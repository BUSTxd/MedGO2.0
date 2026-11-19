// Abdomen 3D, paso 3: simplifica y empaqueta las piezas en el formato 2 del atlas
// (el mismo de extraer-o3d.mjs: posiciones Uint16 e índices codificados con
// meshoptimizer; normales en el navegador), con el color de cada órgano.
//
//   node scripts/atlas-3d/abdomen/empaquetar.mjs [--ratio 0.3]
//
// Lee scripts/atlas-3d/salida/abdomen/piezas.json (construir.mjs) y deja
// manifiesto.json + geometria.bin.gz en la misma carpeta, listos para subir-region.mjs.
// La medida del desvío de los tubos es la de extraer-o3d.mjs (ver allí por qué).

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(AQUI, '../salida/abdomen');
const REGION = 'abdomen';
const arg = (n, def) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : def; };
const RATIO = Number(arg('ratio', 0.3));

const piezas = JSON.parse(fs.readFileSync(path.join(DIR, 'piezas.json'), 'utf8'));
await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;

// ─── Desvío de lo simplificado (como en extraer-o3d.mjs) ────────────────────
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
    if (peor > 0.0005) return peor;
  }
  return peor;
}
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

// ─── Simplificación ──────────────────────────────────────────────────────────
// Lo modelado ya es liviano (tubos de 10-12 lados): no se toca. Vasos y ligamentos:
// error absoluto y desvío ≤ 0,5 mm, como en los miembros. Órganos y huesos: error
// relativo; el omento mayor y el diafragma (láminas enormes) a la mitad del ratio.
const MODELADO = (p) => p.de.startsWith('op:') && /hepatica|porta|hepatico-comun|falciforme|redondo/.test(p.de);
let trianOrig = 0;
for (const p of piezas) {
  const pos = Float32Array.from(p.v);
  const idx = Uint32Array.from(p.f);
  trianOrig += idx.length / 3;
  const tubular = p.sistema === 'arteria' || p.sistema === 'vena';
  let ratio = /Greater omentum|Diaphragm|Mesocolon/.test(p.en) ? RATIO / 2 : RATIO, simp;
  for (;;) {
    const objetivo = Math.min(idx.length, Math.max(192, Math.floor((idx.length * ratio) / 3) * 3));
    [simp] = MODELADO(p) ? [idx] : MeshoptSimplifier.simplify(idx, pos, 3, objetivo, tubular ? 0.00025 : 0.004, tubular ? ['ErrorAbsolute'] : []);
    if (!tubular || MODELADO(p) || simp.length >= idx.length || desvioMax(pos, pos, simp) <= 0.0005) break;
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
  p.id = `ab-${MODELADO(p) ? 'medgo' : 'za'}-${p.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

// ─── Cuantización y códec ───────────────────────────────────────────────────
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
let triangulos = 0;
const salida = piezas.map((p) => {
  const q = new Uint16Array(p.pos.length);
  for (let i = 0; i < p.pos.length; i++) { const a = i % 3; q[i] = Math.min(65535, Math.max(0, Math.round((p.pos[i] - min[a]) / paso[a]))); }
  const v = p.pos.length / 3;
  const idx32 = v > 65536;
  const ind = Uint32Array.from(p.idx);
  const [remap] = MeshoptEncoder.reorderMesh(ind, true, true);
  const vb = new Uint16Array(v * 4);
  for (let i = 0; i < v; i++) if (remap[i] !== 0xffffffff) vb.set(q.subarray(i * 3, i * 3 + 3), remap[i] * 4);
  const tam = idx32 ? 4 : 2;
  const ib = idx32 ? ind : Uint16Array.from(ind);
  const vbc = MeshoptEncoder.encodeVertexBuffer(new Uint8Array(vb.buffer), v, 8);
  const ibc = MeshoptEncoder.encodeIndexBuffer(new Uint8Array(ib.buffer, ib.byteOffset, ib.byteLength), ind.length, tam);
  triangulos += p.idx.length / 3;
  return {
    id: p.id, nombre: p.nombre, nombreEn: p.en, sistema: p.sistema, zona: p.zona, lado: 'derecho',
    ...(p.color ? { color: p.color } : {}),
    ...(MODELADO(p) ? { modelado: true } : {}),
    v, i: p.idx.length,
    vb: anexar(vbc), vbn: vbc.length, ib: anexar(ibc), ibn: ibc.length,
    ...(idx32 ? { idx32: true } : {}),
    caja: p.caja.map((c) => c.map((x) => Math.round(x * 1e5) / 1e5)),
  };
});

const crudo = Buffer.concat(segmentos);
const gz = zlib.gzipSync(crudo, { level: 9 });
const manifiesto = {
  formato: 2,
  region: REGION,
  nombre: 'Abdomen',
  fuente: {
    modelo: 'Z-Anatomy',
    autor: 'Z-Anatomy (sobre BodyParts3D/DBCLS)',
    licencia: 'CC BY-SA 4.0',
    url: 'https://www.z-anatomy.com',
    adaptacion: `Simplificado (meshoptimizer, ~${Math.round(RATIO * 100)} % de los triángulos), rotulado en español; yeyuno e íleon, porciones del duodeno, partes del páncreas, lóbulo cuadrado y cístico/colédoco partidos por MedGO.`,
    modelados: {
      autor: 'MedGO (esquema anatómico sobre este modelo, scripts/atlas-3d/abdomen/modelados.mjs)',
      piezas: salida.filter((p) => p.modelado).map((p) => p.nombreEn),
    },
  },
  unidades: 'm',
  min, paso,
  bytes: crudo.length,
  gzipBytes: gz.length,
  triangulos,
  piezas: salida,
};
fs.writeFileSync(path.join(DIR, 'manifiesto.json'), JSON.stringify(manifiesto));
fs.writeFileSync(path.join(DIR, 'geometria.bin.gz'), gz);
const cuenta = (k) => salida.reduce((o, p) => ((o[p[k]] = (o[p[k]] ?? 0) + 1), o), {});
console.log(`✓ ${REGION}: ${salida.length} piezas · ${Math.round(trianOrig / 1000)}k → ${Math.round(triangulos / 1000)}k triángulos`);
console.log(`  geometría ${(crudo.length / 1e6).toFixed(2)} MB → ${(gz.length / 1e6).toFixed(2)} MB gzip · manifiesto ${(fs.statSync(path.join(DIR, 'manifiesto.json')).size / 1e3).toFixed(1)} kB`);
console.log('  sistemas', cuenta('sistema'));
console.log('  zonas', cuenta('zona'));
const grandes = [...piezas].sort((a, b) => b.idx.length - a.idx.length).slice(0, 8).map((p) => `${p.en} ${Math.round(p.idx.length / 3000)}k`);
console.log('  más pesadas:', grandes.join(' · '));
