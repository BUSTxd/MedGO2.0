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
//
// Deja en scripts/atlas-3d/salida/<region>/ manifiesto.json + geometria.bin.gz.
// Las coordenadas del OBJ ya son las del atlas (metros, +Y arriba, +X izquierda).

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { MeshoptSimplifier } from 'meshoptimizer';
import { REGIONES_O3D, DESPLAZAR, limpiar, idDe, sistemaDe, nombreDe } from './o3d.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, def) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const REGION = arg('region');
const OBJ = arg('obj');
const ZA = arg('za');
const RATIO = Number(arg('ratio', 0.22));
const def = REGIONES_O3D[REGION];
if (!def || !OBJ) throw new Error(`Uso: --region <${Object.keys(REGIONES_O3D).join('|')}> --obj <archivo.obj> [--za <za.obj>]`);

// ─── Lectura del OBJ (un objeto por estructura; solo v y f) ─────────────────
const objetos = [];
for (const [archivo, fuente] of [[OBJ, 'o3d'], ...(ZA ? [[ZA, 'za']] : [])]) {
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

// Normales suaves ponderadas por área.
function normales(pos, idx) {
  const n = new Float32Array(pos.length);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const k of [a, b, c]) { n[k] += nx; n[k + 1] += ny; n[k + 2] += nz; }
  }
  const out = new Int16Array(n.length);
  for (let i = 0; i < n.length; i += 3) {
    const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1;
    out[i] = Math.round((n[i] / l) * 32767); out[i + 1] = Math.round((n[i + 1] / l) * 32767); out[i + 2] = Math.round((n[i + 2] / l) * 32767);
  }
  return out;
}

let trianOrig = 0;
for (const p of piezas) {
  const pos = Float32Array.from(p.o.v);
  const idx = Uint32Array.from(p.o.f);
  trianOrig += idx.length / 3;
  // Mantener cada estructura reconocible: nunca menos de 64 triángulos, error
  // acotado al 0,4 % de su extensión (los nervios finos no se aplastan).
  const objetivo = Math.min(idx.length, Math.max(192, Math.floor((idx.length * RATIO) / 3) * 3));
  const [simp] = MeshoptSimplifier.simplify(idx, pos, 3, objetivo, 0.004);
  const [remap, n] = MeshoptSimplifier.compactMesh(simp);
  const pos2 = new Float32Array(n * 3);
  for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) pos2.set(pos.subarray(i * 3, i * 3 + 3), remap[i] * 3);
  p.pos = pos2;
  p.idx = simp;
  p.nor = normales(pos2, simp);
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
  const indices = idx32 ? Uint32Array.from(p.idx) : Uint16Array.from(p.idx);
  triangulos += p.idx.length / 3;
  return {
    id: p.id, nombre: p.nombre, nombreEn: p.en, sistema: p.sistema, zona: p.zona, lado: def.lado,
    v, i: p.idx.length,
    pos: anexar(q), nor: anexar(p.nor), idx: anexar(indices),
    ...(idx32 ? { idx32: true } : {}),
    caja: p.caja.map((c) => c.map((x) => Math.round(x * 1e5) / 1e5)),
  };
});

const crudo = Buffer.concat(segmentos);
const gz = zlib.gzipSync(crudo, { level: 9 });
const manifiesto = {
  formato: 1,
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
console.log('  sistemas', cuenta('sistema'));
console.log('  zonas', cuenta('zona'));
