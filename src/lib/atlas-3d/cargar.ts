// Descarga y decodifica las regiones del atlas 3D (formato 1 de
// `scripts/atlas-3d/extraer-region.mjs`).

import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
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
  pos: number;
  nor: number;
  idx: number;
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
      if (m.formato !== 1) throw new Error('Formato de modelo no soportado.');
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

  const vistas = new Set<string>();
  const piezas: PiezaAtlas[] = [];
  const min = new Vector3(Infinity, Infinity, Infinity);
  const max = new Vector3(-Infinity, -Infinity, -Infinity);

  manifiestos.forEach((m, n) => {
    const buf = buffers[n];
    for (const p of m.piezas) {
      if (vistas.has(p.id)) continue;
      vistas.add(p.id);

      const q = new Uint16Array(buf, p.pos, p.v * 3);
      const pos = new Float32Array(p.v * 3);
      for (let i = 0; i < pos.length; i++) {
        const a = i % 3;
        pos[i] = m.min[a] + q[i] * m.paso[a];
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      // Normales Int16 normalizadas: la GPU las lleva a [-1, 1] sin copiarlas.
      g.setAttribute('normal', new BufferAttribute(new Int16Array(buf, p.nor, p.v * 3).slice(), 3, true));
      g.setIndex(new BufferAttribute(p.idx32 ? new Uint32Array(buf, p.idx, p.i).slice() : new Uint16Array(buf, p.idx, p.i).slice(), 1));
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
