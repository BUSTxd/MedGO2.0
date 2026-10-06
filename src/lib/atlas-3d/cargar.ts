// Descarga y decodifica las regiones del atlas 3D.
// Formato 1 (extraer-region.mjs, BodyParts3D): posiciones Uint16, normales Int16 e
// índices en bruto. Formato 2 (extraer-o3d.mjs): posiciones e índices codificados
// con meshoptimizer y normales calculadas aquí (un tercio del peso).

import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { regionPorId, urlRegion, type Lado, type Sistema } from '@/lib/data/atlas-3d/regiones';

interface PiezaManifiesto {
  id: string;
  nombre: string;
  nombreEn: string;
  sistema: Sistema;
  zona: string;
  lado: Lado;
  v: number;
  i: number;
  /** Formato 1: offsets de posiciones, normales e índices en bruto. */
  pos?: number;
  nor?: number;
  idx?: number;
  /** Formato 2: offset y bytes de los vértices y los índices codificados. */
  vb?: number;
  vbn?: number;
  ib?: number;
  ibn?: number;
  idx32?: boolean;
  caja: [number[], number[]];
}

interface Manifiesto {
  formato: number;
  region: string;
  nombre: string;
  min: [number, number, number];
  paso: [number, number, number];
  bytes: number;
  gzipBytes: number;
  piezas: PiezaManifiesto[];
}

export interface PiezaAtlas {
  id: string;
  nombre: string;
  nombreEn: string;
  sistema: Sistema;
  zona: string;
  lado: Lado;
  region: string;
  geometry: BufferGeometry;
  /** Centro de la caja, para el rótulo y el encuadre. */
  centro: Vector3;
}

export interface Atlas {
  piezas: PiezaAtlas[];
  /** Caja de todo lo cargado. */
  min: Vector3;
  max: Vector3;
}

/**
 * Descarga las regiones en paralelo. `onProgreso` recibe la fracción de bytes
 * descargados (0-1) sobre el total de todas. Una pieza compartida por dos
 * regiones se queda con la primera.
 */
export async function cargarAtlas(
  ids: string[],
  onProgreso: (fraccion: number) => void,
  signal: AbortSignal,
): Promise<Atlas> {
  const regiones = ids.map((id) => {
    const r = regionPorId(id);
    if (!r) throw new Error(`Región desconocida: ${id}`);
    return r;
  });

  const manifiestos = await Promise.all(
    regiones.map(async (r) => {
      const res = await fetch(`${urlRegion(r)}/manifiesto.json`, { signal });
      if (!res.ok) throw new Error(`No se pudo leer el modelo (${res.status}).`);
      const m = (await res.json()) as Manifiesto;
      if (m.formato !== 1 && m.formato !== 2) throw new Error('Formato de modelo no soportado.');
      return m;
    }),
  );

  const total = manifiestos.reduce((n, m) => n + m.gzipBytes, 0);
  const recibidos = manifiestos.map(() => 0);
  const avisar = () => onProgreso(Math.min(1, recibidos.reduce((a, b) => a + b, 0) / total));

  const buffers = await Promise.all(
    regiones.map(async (r, n) => {
      const res = await fetch(`${urlRegion(r)}/geometria.bin.gz`, { signal });
      if (!res.ok || !res.body) throw new Error(`No se pudo descargar el modelo (${res.status}).`);
      const lector = res.body.getReader();
      const partes: Uint8Array[] = [];
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        partes.push(value);
        recibidos[n] += value.byteLength;
        avisar();
      }
      return descomprimir(await new Blob(partes as BlobPart[]).arrayBuffer(), manifiestos[n].bytes);
    }),
  );

  if (manifiestos.some((m) => m.formato === 2)) await MeshoptDecoder.ready;

  const vistas = new Set<string>();
  const piezas: PiezaAtlas[] = [];
  const min = new Vector3(Infinity, Infinity, Infinity);
  const max = new Vector3(-Infinity, -Infinity, -Infinity);

  manifiestos.forEach((m, n) => {
    const buf = buffers[n];
    for (const p of m.piezas) {
      if (vistas.has(p.id)) continue;
      vistas.add(p.id);

      const g = m.formato === 2 ? geometriaF2(m, p, buf) : geometriaF1(m, p, buf);
      g.computeBoundingSphere();

      const [a, b] = p.caja;
      min.min(new Vector3(a[0], a[1], a[2]));
      max.max(new Vector3(b[0], b[1], b[2]));
      piezas.push({
        id: p.id,
        nombre: p.nombre,
        nombreEn: p.nombreEn,
        sistema: p.sistema,
        zona: p.zona,
        lado: p.lado,
        region: m.region,
        geometry: g,
        centro: new Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2),
      });
    }
  });

  return { piezas, min, max };
}

function geometriaF1(m: Manifiesto, p: PiezaManifiesto, buf: ArrayBuffer): BufferGeometry {
  const q = new Uint16Array(buf, p.pos!, p.v * 3);
  const pos = new Float32Array(p.v * 3);
  for (let i = 0; i < pos.length; i++) {
    const a = i % 3;
    pos[i] = m.min[a] + q[i] * m.paso[a];
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  // Normales Int16 normalizadas: la GPU las lleva a [-1, 1] sin copiarlas.
  g.setAttribute('normal', new BufferAttribute(new Int16Array(buf, p.nor!, p.v * 3).slice(), 3, true));
  g.setIndex(new BufferAttribute(p.idx32 ? new Uint32Array(buf, p.idx!, p.i).slice() : new Uint16Array(buf, p.idx!, p.i).slice(), 1));
  return g;
}

function geometriaF2(m: Manifiesto, p: PiezaManifiesto, buf: ArrayBuffer): BufferGeometry {
  // Vértices de 8 bytes: x, y, z Uint16 cuantizados a la caja de la región y relleno.
  const vb = new Uint8Array(p.v * 8);
  MeshoptDecoder.decodeVertexBuffer(vb, p.v, 8, new Uint8Array(buf, p.vb!, p.vbn!));
  const q = new Uint16Array(vb.buffer);
  const pos = new Float32Array(p.v * 3);
  for (let i = 0; i < p.v; i++) for (let a = 0; a < 3; a++) pos[i * 3 + a] = m.min[a] + q[i * 4 + a] * m.paso[a];
  const tam = p.idx32 ? 4 : 2;
  const ib = new Uint8Array(p.i * tam);
  MeshoptDecoder.decodeIndexBuffer(ib, p.i, tam, new Uint8Array(buf, p.ib!, p.ibn!));
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setIndex(new BufferAttribute(p.idx32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer), 1));
  // Suaves y ponderadas por área, como las que traía el formato 1.
  g.computeVertexNormals();
  return g;
}

/**
 * El bucket sirve el .gz como archivo (`application/gzip`, sin
 * Content-Encoding), pero un proxy o CDN podría descomprimirlo por el camino:
 * se mira la firma antes de descomprimir para no hacerlo dos veces.
 */
async function descomprimir(datos: ArrayBuffer, esperado: number): Promise<ArrayBuffer> {
  const firma = new Uint8Array(datos, 0, Math.min(2, datos.byteLength));
  const gz = firma[0] === 0x1f && firma[1] === 0x8b;
  const salida = gz
    ? await new Response(new Blob([datos]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
    : datos;
  if (salida.byteLength !== esperado) throw new Error('El modelo llegó incompleto. Recarga la página.');
  return salida;
}
