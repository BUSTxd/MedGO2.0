// Empaqueta un miembro de Open3DModel (CC BY-SA 4.0) para el visor
// `laboratorio/atlas-3d`, con el mismo formato que extraer-region.mjs.
//
// Fuente: los OBJ de https://anatomytool.org/node/63903, p. ej.
//   https://caskanatomy.info/open3dmodelfiles/upper-limb/upper-limb-obj.zip
//   https://caskanatomy.info/open3dmodelfiles/lower-limb/lower-limb-obj.zip
// Open3DModel parte de Z-Anatomy (y este de BodyParts3D), revisado por
// anatomistas de LUMC, UMC Utrecht, Maastricht y KU Leuven: nervios y vasos
// de los miembros remodelados de cero. Solo traen el lado derecho.
//
//   node scripts/atlas-3d/extraer-o3d.mjs --region miembro-superior-derecho --obj <upper-limb.obj> [--za <za.obj>] [--ratio 0.22]
//
// `--za`: piezas que Open3DModel no trae, sacadas de Z-Anatomy con za-a-obj.py
// (el superior v7 lleva platisma, esternocleidomastoideo, nervio accesorio,
// occipital, temporal, mandíbula y ligamento nucal; DESPLAZAR en o3d.mjs).
// Su id lleva `za-` en vez de `o3d-`.
// `--propio`: nervios modelados con nervios-modelados.mjs (plexo cervical,
// toracodorsal). Id `medgo-`; no se simplifican (ya son tubos de 8 lados).
//
// Deja en scripts/atlas-3d/salida/<region>/ manifiesto.json + geometria.bin.gz.
// Las coordenadas del OBJ ya son las del atlas (metros, +Y arriba, +X izquierda).

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { REGIONES_O3D, DESPLAZAR, limpiar, idDe, sistemaDe, nombreDe } from './o3d.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, def) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const REGION = arg('region');
const OBJ = arg('obj');
const ZA = arg('za');
const PROPIO = arg('propio');
const RATIO = Number(arg('ratio', 0.22));
const def = REGIONES_O3D[REGION];
if (!def || !OBJ) throw new Error(`Uso: --region <${Object.keys(REGIONES_O3D).join('|')}> --obj <archivo.obj> [--za <za.obj>] [--propio <propios.obj>]`);

// ─── Lectura del OBJ (un objeto por estructura; solo v y f) ─────────────────
const objetos = [];
for (const [archivo, fuente] of [[OBJ, 'o3d'], ...(ZA ? [[ZA, 'za']] : []), ...(PROPIO ? [[PROPIO, 'medgo']] : [])]) {
  let cur = null, base = 0;
  const rl = readline.createInterface({ input: fs.createReadStream(archivo), crlfDelay: Infinity });
  for await (const l of rl) {
    if (l.startsWith('o ')) {
      cur = { crudo: l.slice(2), fuente, v: [], f: [], base };
      objetos.push(cur);
    } else if (l.startsWith('v ')) {
      const p = l.split(/\s+/);
      cur.v.push(+p[1], +p[2], +p[3]);
      base++;
    } else if (l.startsWith('f ')) {
      const ids = l.split(/\s+/).slice(1).filter(Boolean).map((s) => parseInt(s, 10) - 1 - cur.base);
      for (let k = 1; k + 1 < ids.length; k++) cur.f.push(ids[0], ids[k], ids[k + 1]);
    }
  }
}

// ─── Selección, nombre, sistema, zona ────────────────────────────────────────
await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;
const faltan = [];
const piezas = [];
for (const o of objetos) {
  const en = limpiar(o.crudo);
  const sistema = sistemaDe(en);
  if (!sistema || !o.f.length) continue;
  const nombre = nombreDe(REGION, en);
  if (!nombre) { faltan.push(en); continue; }
  const mover = o.fuente === 'za' && DESPLAZAR[en];
  if (mover) for (let i = 0; i < o.v.length; i += 3) [o.v[i], o.v[i + 1], o.v[i + 2]] = mover(o.v[i], o.v[i + 1], o.v[i + 2]);
  piezas.push({ o, en, sistema, nombre, fuente: o.fuente });
}
if (faltan.length) throw new Error(`Sin traducción en o3d.mjs (${faltan.length}):\n  ${[...new Set(faltan)].join('\n  ')}`);

// Mayor distancia de los vértices del original (muestreados) a la superficie
// simplificada, que comparte vértices con el original (`pos`, índices `simp`).
function desvioMax(orig, pos, simp) {
  const H = 0.003, rej = new Map();
  const v = (k) => [pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]];
  for (let t = 0; t < simp.length; t += 3) {
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (const k of [simp[t], simp[t + 1], simp[t + 2]]) for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], pos[k * 3 + a]); mx[a] = Math.max(mx[a], pos[k * 3 + a]); }
    for (let x = Math.floor(mn[0] / H); x <= Math.floor(mx[0] / H); x++)
      for (let y = Math.floor(mn[1] / H); y <= Math.floor(mx[1] / H); y++)
        for (let z = Math.floor(mn[2] / H); z <= Math.floor(mx[2] / H); z++) { const k = `${x},${y},${z}`; (rej.get(k) ?? rej.set(k, []).get(k)).push(t); }
  }
  let peor = 0;
  const paso = Math.max(1, Math.floor(orig.length / 3 / 3000));
  for (let i = 0; i < orig.length; i += 3 * paso) {
    const P = [orig[i], orig[i + 1], orig[i + 2]], c = P.map((x) => Math.floor(x / H));
    let best = Infinity;
    for (let r = 0; r < 12 && best > r * H; r++)
      for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) for (let z = -r; z <= r; z++) {
        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) !== r) continue;
        for (const t of rej.get(`${c[0] + x},${c[1] + y},${c[2] + z}`) ?? []) best = Math.min(best, distTri(P, v(simp[t]), v(simp[t + 1]), v(simp[t + 2])));
      }
    peor = Math.max(peor, best);
    if (peor > 0.0005) return peor; // basta con saber que se pasa
  }
  return peor;
}

// Distancia de un punto a un triángulo (punto más cercano, Ericson).
function distTri(p, a, b, c) {
  const sub = (u, w) => [u[0] - w[0], u[1] - w[1], u[2] - w[2]], dot = (u, w) => u[0] * w[0] + u[1] * w[1] + u[2] * w[2];
  const en = (o, d, s) => [o[0] + d[0] * s, o[1] + d[1] * s, o[2] + d[2] * s];
  const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a), d1 = dot(ab, ap), d2 = dot(ac, ap);
  let q;
  if (d1 <= 0 && d2 <= 0) q = a;
  else {
    const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp);
    if (d3 >= 0 && d4 <= d3) q = b;
    else {
      const vc = d1 * d4 - d3 * d2;
      if (vc <= 0 && d1 >= 0 && d3 <= 0) q = en(a, ab, d1 / (d1 - d3));
      else {
        const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp);
        if (d6 >= 0 && d5 <= d6) q = c;
        else {
          const vb = d5 * d2 - d1 * d6;
          if (vb <= 0 && d2 >= 0 && d6 <= 0) q = en(a, ac, d2 / (d2 - d6));
          else {
            const va = d3 * d6 - d5 * d4;
            if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) q = en(b, sub(c, b), (d4 - d3) / (d4 - d3 + (d5 - d6)));
            else { const den = 1 / (va + vb + vc); q = en(en(a, ab, vb * den), ac, vc * den); }
          }
        }
      }
    }
  }
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

let trianOrig = 0;
for (const p of piezas) {
  const pos = Float32Array.from(p.o.v);
  const idx = Uint32Array.from(p.o.f);
  trianOrig += idx.length / 3;
  // Mantener cada estructura reconocible: nunca menos de 64 triángulos, error
  // acotado al 0,4 % de su extensión (los nervios finos no se aplastan).
  // Nervios, vasos y ligamentos: el simplificador (cuádricas) puede acortar un tubo fino a
  // lo largo de su eje sin «error» y se comía puntas y ramitas (el axilar perdía
  // tramos de hasta 10 mm; en el visor, muñones y quiebros). Se mide el desvío
  // real y, si algún punto del original queda a > 0,5 mm, se repite con un 25 %
  // más de triángulos (con el doble, piezas que necesitaban un 30 % acababan en el 88 %).
  // También ligamentos y cartílagos: láminas finas que perdían bordes de 2-3 mm.
  const tubular = p.sistema === 'nervio' || p.sistema === 'arteria' || p.sistema === 'vena' || p.sistema === 'conectivo';
  let ratio = RATIO, simp;
  for (;;) {
    const objetivo = Math.min(idx.length, Math.max(192, Math.floor((idx.length * ratio) / 3) * 3));
    [simp] = p.fuente === 'medgo' ? [idx] : MeshoptSimplifier.simplify(idx, pos, 3, objetivo, tubular ? 0.00025 : 0.004, tubular ? ['ErrorAbsolute'] : []);
    if (!tubular || p.fuente === 'medgo' || simp.length >= idx.length || desvioMax(pos, pos, simp) <= 0.0005) break;
    ratio *= 1.25;
  }
  p.ratio = ratio;
  const [remap, n] = MeshoptSimplifier.compactMesh(simp);
  const pos2 = new Float32Array(n * 3);
  for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) pos2.set(pos.subarray(i * 3, i * 3 + 3), remap[i] * 3);
  p.pos = pos2;
  p.idx = simp;
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos2.length; i++) { min[i % 3] = Math.min(min[i % 3], pos2[i]); max[i % 3] = Math.max(max[i % 3], pos2[i]); }
  p.caja = [min, max];
  p.zona = def.zona(p.en, min.map((v, i) => (v + max[i]) / 2));
  p.id = idDe(REGION, p.en, p.fuente);
  delete p.o;
}

// Ids únicos (dos objetos con el mismo nombre en el OBJ → sufijo).
const vistos = new Map();
for (const p of piezas) {
  const k = vistos.get(p.id) ?? 0;
  vistos.set(p.id, k + 1);
  if (k) p.id = `${p.id}-${k + 1}`;
}

// ─── Caja de la región y cuantización ───────────────────────────────────────
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (const p of piezas) for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], p.caja[0][a]); max[a] = Math.max(max[a], p.caja[1][a]); }
const paso = min.map((m, a) => (max[a] - m) / 65535);

const segmentos = [];
let bytes = 0;
const anexar = (vista) => {
  const relleno = (4 - (bytes % 4)) % 4;
  if (relleno) { segmentos.push(Buffer.alloc(relleno)); bytes += relleno; }
  const inicio = bytes;
  const b = Buffer.from(vista.buffer, vista.byteOffset, vista.byteLength);
  segmentos.push(b);
  bytes += b.length;
  return inicio;
};

let triangulos = 0, errorMax = 0;
const salida = piezas.map((p) => {
  const q = new Uint16Array(p.pos.length);
  for (let i = 0; i < p.pos.length; i++) {
    const a = i % 3;
    q[i] = Math.min(65535, Math.max(0, Math.round((p.pos[i] - min[a]) / paso[a])));
    errorMax = Math.max(errorMax, Math.abs(min[a] + q[i] * paso[a] - p.pos[i]));
  }
  const v = p.pos.length / 3;
  const idx32 = v > 65536;
  // Reordenar vértices y triángulos para la caché y el códec, y codificar con
  // meshoptimizer (EXT_meshopt_compression): un tercio que gzip sobre los números en bruto.
  const ind = Uint32Array.from(p.idx);
  const [remap] = MeshoptEncoder.reorderMesh(ind, true, true);
  const vb = new Uint16Array(v * 4); // x, y, z y relleno: el códec pide múltiplos de 4 bytes
  for (let i = 0; i < v; i++) if (remap[i] !== 0xffffffff) vb.set(q.subarray(i * 3, i * 3 + 3), remap[i] * 4);
  const tam = idx32 ? 4 : 2;
  const ib = idx32 ? ind : Uint16Array.from(ind);
  const vbc = MeshoptEncoder.encodeVertexBuffer(new Uint8Array(vb.buffer), v, 8);
  const ibc = MeshoptEncoder.encodeIndexBuffer(new Uint8Array(ib.buffer, ib.byteOffset, ib.byteLength), ind.length, tam);
  triangulos += p.idx.length / 3;
  return {
    id: p.id, nombre: p.nombre, nombreEn: p.en, sistema: p.sistema, zona: p.zona, lado: def.lado,
    v, i: p.idx.length,
    vb: anexar(vbc), vbn: vbc.length, ib: anexar(ibc), ibn: ibc.length,
    ...(idx32 ? { idx32: true } : {}),
    caja: p.caja.map((c) => c.map((x) => Math.round(x * 1e5) / 1e5)),
  };
});

const crudo = Buffer.concat(segmentos);
const gz = zlib.gzipSync(crudo, { level: 9 });
const manifiesto = {
  // 2: vértices (posición Uint16 cuantizada, 8 bytes) e índices codificados con
  // meshoptimizer; las normales las calcula el navegador.
  formato: 2,
  region: REGION,
  nombre: def.nombre,
  fuente: {
    modelo: 'Open3DModel',
    autor: 'LUMC, UMC Utrecht, Maastricht University, KU Leuven (sobre Z-Anatomy y BodyParts3D/DBCLS)',
    licencia: 'CC BY-SA 4.0',
    url: 'https://anatomytool.org/open3dmodel',
    adaptacion: `Simplificado (meshoptimizer, ~${Math.round(RATIO * 100)} % de los triángulos), rotulado en español.`,
    ...(ZA ? {
      complementos: {
        modelo: 'Z-Anatomy',
        licencia: 'CC BY-SA 4.0',
        url: 'https://www.z-anatomy.com',
        piezas: piezas.filter((p) => p.fuente === 'za').map((p) => p.en),
      },
    } : {}),
    ...(PROPIO ? {
      modelados: {
        autor: 'MedGO (esquema anatómico sobre este modelo, scripts/atlas-3d/nervios-modelados.mjs)',
        piezas: piezas.filter((p) => p.fuente === 'medgo').map((p) => p.en),
      },
    } : {}),
  },
  unidades: 'm',
  min, paso,
  bytes: crudo.length,
  gzipBytes: gz.length,
  triangulos,
  piezas: salida,
};
const dir = path.join(AQUI, 'salida', REGION);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'manifiesto.json'), JSON.stringify(manifiesto));
fs.writeFileSync(path.join(dir, 'geometria.bin.gz'), gz);

const cuenta = (k) => salida.reduce((o, p) => ((o[p[k]] = (o[p[k]] ?? 0) + 1), o), {});
console.log(`✓ ${REGION}: ${salida.length} piezas · ${Math.round(trianOrig / 1000)}k → ${Math.round(triangulos / 1000)}k triángulos`);
console.log(`  geometría ${(crudo.length / 1e6).toFixed(2)} MB → ${(gz.length / 1e6).toFixed(2)} MB gzip · manifiesto ${(fs.statSync(path.join(dir, 'manifiesto.json')).size / 1e3).toFixed(1)} kB`);
console.log(`  error de cuantización máx. ${(errorMax * 1000).toFixed(4)} mm`);
const mas = piezas.filter((p) => p.ratio > RATIO);
console.log(`  ${mas.length} nervios, vasos o ligamentos necesitaron más triángulos para no perder ramitas ni bordes: ${mas.map((p) => `${p.en} ×${p.ratio / RATIO}`).join(', ')}`);
console.log('  sistemas', cuenta('sistema'));
console.log('  zonas', cuenta('zona'));
