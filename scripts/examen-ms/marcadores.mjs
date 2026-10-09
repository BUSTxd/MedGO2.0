/**
 * Calcula el punto 3D de cada accidente óseo del examen sobre la malla de su hueso
 * (modelo miembro-superior-derecho, el mismo paquete que sirve el visor).
 *
 *   node scripts/examen-ms/marcadores.mjs
 *
 * Lee scripts/atlas-3d/salida/<región>/ (manifiesto + geometría, gitignored) y el
 * catálogo; escribe docs/examen-ms/marcadores.json (gitignored).
 *
 * Ejes del modelo: +Y arriba, +Z anterior, +X = izquierda del cuerpo; en el miembro
 * DERECHO, lateral = −X. Posición anatómica (palma hacia delante).
 *
 * Cada regla dice: en qué tramo del hueso (`t`, 0 = extremo proximal/medial,
 * 1 = distal/lateral, sobre el eje `eje`) y hacia dónde mira (`dir` en
 * L = lateral, S = superior, A = anterior). `max` = el saliente más extremo en esa
 * dirección (tubérculos, apófisis, epicóndilos); `cara` = el centro de la
 * superficie que mira hacia allí (fosas, caras, surcos). Son heurísticas: BUST las
 * revisa en el propio examen y las que caigan mal se corrigen aquí.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { MeshoptDecoder } from 'meshoptimizer';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const REGION = 'miembro-superior-derecho';
const DOCS = path.join(RAIZ, 'docs', 'examen-ms');
const SALIDA_ATLAS = path.join(RAIZ, 'scripts', 'atlas-3d', 'salida', REGION);

// hueso: nombre del hueso en el catálogo (o «Nombre#i» para elegir una pieza de un grupo).
const R = (hueso, t, dir, modo = 'max', eje = 'y') => ({ hueso, t, dir, modo, eje });
const REGLAS = {
  // ── Escápula ──
  'Acromion': R('Escápula', [0, 0.3], { L: 1, S: 0.6, A: -0.2 }),
  'Apófisis coracoides': R('Escápula', [0, 0.4], { A: 1, L: 0.3 }),
  'Cavidad glenoidea': R('Escápula', [0.18, 0.4], { L: 1 }, 'cara'),
  'Ángulo lateral de la escápula': R('Escápula', [0.2, 0.4], { L: 1 }),
  'Tubérculo supraglenoideo': R('Escápula', [0.15, 0.24], { L: 1, S: 0.5 }),
  'Tubérculo infraglenoideo': R('Escápula', [0.36, 0.46], { L: 1, S: -0.5 }),
  'Ángulo superior de la escápula': R('Escápula', [0, 0.25], { S: 1, L: -0.8 }),
  'Ángulo inferior de la escápula': R('Escápula', [0.85, 1], { S: -1 }),
  'Borde medial de la escápula': R('Escápula', [0.35, 0.65], { L: -1 }),
  'Borde lateral de la escápula': R('Escápula', [0.5, 0.75], { L: 1, A: -0.2 }),
  'Borde inferior de la escápula': R('Escápula', [0.7, 0.9], { L: 1, S: -0.6 }),
  'Borde superior de la escápula': R('Escápula', [0, 0.2], { S: 1, L: -0.2 }),
  'Escotadura supraescapular': R('Escápula', [0.55, 0.68], { S: 1 }, 'max', 'l'),
  'Escotadura escapular mayor (espinoglenoidea)': R('Escápula', [0.22, 0.36], { L: 0.8, A: -1 }, 'cara'),
  'Espina de la escápula': R('Escápula', [0.12, 0.35], { A: -1, L: 0.2 }),
  'Fosa supraespinosa': R('Escápula', [0.05, 0.2], { A: -1, L: -0.3 }, 'cara'),
  'Fosa infraespinosa': R('Escápula', [0.4, 0.75], { A: -1 }, 'cara'),
  'Cara dorsal (posterior) de la escápula': R('Escápula', [0.45, 0.7], { A: -1 }, 'cara'),
  'Fosa subescapular': R('Escápula', [0.3, 0.7], { A: 1, L: -0.3 }, 'cara'),
  'Cara costal (anterior) de la escápula': R('Escápula', [0.4, 0.7], { A: 1 }, 'cara'),
  // ── Húmero ──
  'Cabeza del húmero': R('Húmero', [0, 0.09], { L: -1, S: 0.6, A: -0.3 }),
  'Cuello anatómico del húmero': R('Húmero', [0.06, 0.1], { L: -1, S: 0.2 }),
  'Tubérculo mayor': R('Húmero', [0, 0.1], { L: 1, S: 0.3 }),
  'Tubérculo menor': R('Húmero', [0.03, 0.11], { A: 1, L: -0.2 }),
  'Surco intertubercular': R('Húmero', [0.09, 0.15], { A: 1 }, 'cara'),
  'Cresta del tubérculo mayor': R('Húmero', [0.13, 0.25], { A: 1, L: 0.5 }),
  'Cresta del tubérculo menor': R('Húmero', [0.13, 0.22], { A: 1, L: -0.5 }),
  'Cuello quirúrgico del húmero': R('Húmero', [0.12, 0.16], { L: 1 }, 'cara'),
  'Tuberosidad deltoidea': R('Húmero', [0.35, 0.45], { L: 1, A: 0.3 }),
  'Cresta oblicua de la cara posterior del húmero': R('Húmero', [0.25, 0.35], { A: -1, L: 0.3 }),
  'Surco del nervio radial': R('Húmero', [0.38, 0.55], { A: -1 }, 'cara'),
  'Diáfisis del húmero': R('Húmero', [0.47, 0.53], { A: 1 }, 'cara'),
  'Agujero nutricio del húmero': R('Húmero', [0.47, 0.53], { A: 1, L: -1 }),
  'Borde anterior del húmero': R('Húmero', [0.4, 0.6], { A: 1 }),
  'Borde medial del húmero': R('Húmero', [0.4, 0.6], { L: -1 }),
  'Cara anterolateral del húmero': R('Húmero', [0.5, 0.62], { A: 1, L: 1 }, 'cara'),
  'Cara anteromedial del húmero': R('Húmero', [0.5, 0.62], { A: 1, L: -1 }, 'cara'),
  'Cara posterior del húmero': R('Húmero', [0.55, 0.7], { A: -1 }, 'cara'),
  'Cara anterior del húmero (mitad inferior)': R('Húmero', [0.62, 0.78], { A: 1 }, 'cara'),
  'Cresta supracondílea lateral': R('Húmero', [0.74, 0.85], { L: 1 }),
  'Cresta supracondílea medial': R('Húmero', [0.74, 0.85], { L: -1 }),
  'Epicóndilo lateral': R('Húmero', [0.85, 1], { L: 1 }),
  'Epicóndilo medial': R('Húmero', [0.85, 1], { L: -1 }),
  'Fosa coronoidea del húmero': R('Húmero', [0.84, 0.9], { A: 1, L: -0.3 }, 'cara'),
  'Fosa radial del húmero': R('Húmero', [0.84, 0.9], { A: 1, L: 0.6 }, 'cara'),
  'Fosa olecraneana del húmero': R('Húmero', [0.83, 0.91], { A: -1 }, 'cara'),
  'Capítulo del húmero': R('Húmero', [0.9, 1], { A: 0.7, L: 0.6, S: -0.5 }),
  'Tróclea del húmero': R('Húmero', [0.9, 1], { A: 0.4, L: -0.6, S: -0.8 }),
  'Cóndilo del húmero': R('Húmero', [0.95, 1], { S: -1 }),
  'Surco condilotroclear': R('Húmero', [0.92, 1], { A: 0.7, S: -0.6 }, 'cara'),
  // ── Radio ──
  'Cabeza del radio': R('Radio', [0, 0.04], { S: 1, L: 0.3 }),
  'Fóvea articular de la cabeza del radio': R('Radio', [0, 0.02], { S: 1 }, 'cara'),
  'Circunferencia articular de la cabeza del radio': R('Radio', [0.01, 0.04], { L: -1 }),
  'Cuello del radio': R('Radio', [0.05, 0.08], { L: 1 }, 'cara'),
  'Tuberosidad del radio': R('Radio', [0.08, 0.15], { L: -1, A: 0.5 }),
  'Línea oblicua anterior del radio': R('Radio', [0.15, 0.3], { A: 1 }),
  'Diáfisis del radio': R('Radio', [0.47, 0.53], { A: 1 }, 'cara'),
  'Cara anterior del radio': R('Radio', [0.5, 0.7], { A: 1 }, 'cara'),
  'Cara posterior del radio': R('Radio', [0.5, 0.7], { A: -1 }, 'cara'),
  'Cara lateral del radio': R('Radio', [0.4, 0.6], { L: 1 }, 'cara'),
  'Borde anterior del radio': R('Radio', [0.4, 0.6], { A: 1, L: 1 }),
  'Borde posterior del radio': R('Radio', [0.4, 0.6], { A: -1, L: 1 }),
  'Borde interóseo del radio': R('Radio', [0.4, 0.6], { L: -1 }),
  'Tubérculo dorsal del radio': R('Radio', [0.9, 0.97], { A: -1 }),
  'Escotadura cubital del radio': R('Radio', [0.9, 0.97], { L: -1 }, 'cara'),
  'Apófisis estiloides del radio': R('Radio', [0.93, 1], { L: 0.5, S: -1 }),
  'Cara inferior (carpiana) del radio': R('Radio', [0.96, 1], { S: -1 }, 'cara'),
  'Fosa escafoidea': R('Radio', [0.96, 1], { S: -1, L: 0.5 }, 'cara'),
  'Fosa semilunar': R('Radio', [0.96, 1], { S: -1, L: -0.5 }, 'cara'),
  // ── Cúbito ──
  'Olécranon': R('Cúbito', [0, 0.07], { S: 1, A: -1 }),
  'Escotadura troclear del cúbito': R('Cúbito', [0.03, 0.1], { A: 1 }, 'cara'),
  'Apófisis coronoides': R('Cúbito', [0.08, 0.14], { A: 1 }),
  'Tuberosidad del cúbito': R('Cúbito', [0.12, 0.19], { A: 1 }),
  'Escotadura radial del cúbito': R('Cúbito', [0.08, 0.13], { L: 1 }, 'cara'),
  'Cresta del supinador': R('Cúbito', [0.12, 0.25], { L: 1, A: -0.3 }),
  'Área triangular (parte adyacente a la cresta del supinador)': R('Cúbito', [0.1, 0.16], { L: 1, A: -0.6 }, 'cara'),
  'Rugosidad para el ancóneo': R('Cúbito', [0.06, 0.2], { A: -1, L: 0.5 }, 'cara'),
  'Diáfisis del cúbito': R('Cúbito', [0.47, 0.53], { A: 1 }, 'cara'),
  'Cara anterior del cúbito': R('Cúbito', [0.4, 0.6], { A: 1 }, 'cara'),
  'Cara posterior del cúbito': R('Cúbito', [0.4, 0.6], { A: -1 }, 'cara'),
  'Borde posterior del cúbito': R('Cúbito', [0.3, 0.6], { A: -1, L: -1 }),
  'Borde interóseo del cúbito': R('Cúbito', [0.4, 0.6], { L: 1 }),
  'Cabeza del cúbito': R('Cúbito', [0.9, 0.97], { S: -1, L: 0.3 }),
  'Apófisis estiloides del cúbito': R('Cúbito', [0.9, 1], { S: -1, L: -0.6, A: -0.4 }),
  'Surco para el tendón del extensor cubital del carpo': R('Cúbito', [0.9, 0.97], { A: -1, L: -0.3 }, 'cara'),
  // ── Clavícula (eje medial → lateral) ──
  'Extremo medial (esternal) de la clavícula': R('Clavícula', [0, 0.06], { L: -1 }, 'max', 'l'),
  'Extremo lateral (acromial) de la clavícula': R('Clavícula', [0.94, 1], { L: 1 }, 'max', 'l'),
  'Cuerpo de la clavícula': R('Clavícula', [0.45, 0.55], { S: 1 }, 'cara', 'l'),
  'Cara superior de la clavícula': R('Clavícula', [0.35, 0.5], { S: 1 }, 'cara', 'l'),
  'Cara inferior de la clavícula': R('Clavícula', [0.5, 0.65], { S: -1 }, 'cara', 'l'),
  'Borde anterior de la clavícula': R('Clavícula', [0.3, 0.5], { A: 1 }, 'max', 'l'),
  'Borde posterior de la clavícula': R('Clavícula', [0.5, 0.7], { A: -1 }, 'max', 'l'),
  'Surco subclavio': R('Clavícula', [0.35, 0.55], { S: -1 }, 'cara', 'l'),
  'Impresión para el ligamento costoclavicular': R('Clavícula', [0.05, 0.15], { S: -1 }, 'cara', 'l'),
  'Tubérculo conoide': R('Clavícula', [0.75, 0.85], { S: -1, A: -1 }, 'max', 'l'),
  'Línea trapezoide': R('Clavícula', [0.82, 0.92], { S: -1 }, 'cara', 'l'),
  // ── Mano ──
  'Base del 1er metacarpiano': R('Primer metacarpiano', [0, 0.15], { S: 1 }),
  'Base del 2do metacarpiano': R('Segundo metacarpiano', [0, 0.15], { S: 1 }),
  'Base del 4to metacarpiano': R('Cuarto metacarpiano', [0, 0.15], { S: 1 }),
  'Bases de los metacarpianos': R('Metacarpianos#2', [0, 0.15], { S: 1 }),
  'Cabezas de los metacarpianos': R('Metacarpianos#2', [0.85, 1], { S: -1 }),
  'Apófisis estiloides del 3er metacarpiano': R('Tercer metacarpiano', [0, 0.15], { A: -1, L: 0.4 }),
  'Tubérculo del 5to metacarpiano': R('Quinto metacarpiano', [0, 0.15], { L: -1 }),
  'Cabeza del hueso grande': R('Grande (hueso)', [0, 0.35], { S: 1 }),
  'Carilla articular dorsal del pisiforme': R('Pisiforme', [0, 1], { A: -1 }, 'cara'),
  'Carilla articular palmar del piramidal': R('Piramidal', [0, 1], { A: 1 }, 'cara'),
  'Tubérculo del escafoides': R('Escafoides', [0, 1], { A: 1, S: -0.5, L: 0.3 }),
  'Cuello del escafoides': R('Escafoides', [0.4, 0.6], { A: -1 }, 'cara'),
  'Gancho del ganchoso': R('Ganchoso', [0, 1], { A: 1 }),
  'Tubérculo del trapecio': R('Trapecio (hueso)', [0, 1], { A: 1 }),
  'Surco del trapecio': R('Trapecio (hueso)', [0, 1], { A: 1, L: -0.6 }, 'cara'),
  'Tuberosidad en herradura de la falange distal': R('Falanges distales#1', [0.85, 1], { S: -1 }),
};

// ── Geometría ────────────────────────────────────────────────────────────────
const man = JSON.parse(fs.readFileSync(path.join(SALIDA_ATLAS, 'manifiesto.json'), 'utf8'));
const gz = fs.readFileSync(path.join(SALIDA_ATLAS, 'geometria.bin.gz'));
const bin = gz[0] === 0x1f && gz[1] === 0x8b ? zlib.gunzipSync(gz) : gz;
const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
await MeshoptDecoder.ready;
function vertices(p) {
  const vb = new Uint8Array(p.v * 8);
  MeshoptDecoder.decodeVertexBuffer(vb, p.v, 8, new Uint8Array(buf, p.vb, p.vbn));
  const q = new Uint16Array(vb.buffer);
  const out = [];
  for (let i = 0; i < p.v; i++) out.push([0, 1, 2].map((a) => man.min[a] + q[i * 4 + a] * man.paso[a]));
  return out;
}

const { estructuras } = JSON.parse(fs.readFileSync(path.join(DOCS, 'catalogo_estructuras.json'), 'utf8'));
const porNombre = new Map(estructuras.map((e) => [e.nombre, e]));
const piezaPorEn = new Map(man.piezas.map((p) => [p.nombreEn, p]));
const cacheV = new Map();
function huesoEn(nombre) {
  const [n, i] = nombre.split('#');
  const e = porNombre.get(n);
  if (!e?.modelo?.en) throw new Error(`hueso «${n}» sin pieza en el modelo`);
  return e.modelo.en[i ? +i : 0];
}
function verts(en) {
  if (!cacheV.has(en)) {
    const p = piezaPorEn.get(en);
    if (!p) throw new Error(`pieza «${en}» no está en el manifiesto`);
    cacheV.set(en, vertices(p));
  }
  return cacheV.get(en);
}

// Coordenadas anatómicas del miembro derecho: L = −x, S = y, A = z.
const anat = ([x, y, z]) => ({ L: -x, S: y, A: z });
function punto(regla) {
  const en = huesoEn(regla.hueso);
  const V = verts(en);
  const C = V.map(anat);
  const k = regla.eje === 'l' ? 'L' : 'S';
  const vals = C.map((c) => c[k]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  // t = 0 en el extremo proximal (arriba) o medial (clavícula, eje 'l').
  const tDe = (c) => (regla.eje === 'l' ? (c.L - lo) / (hi - lo) : (hi - c.S) / (hi - lo));
  const tramo = C.map((c, i) => ({ c, i })).filter(({ c }) => { const t = tDe(c); return t >= regla.t[0] && t <= regla.t[1]; });
  if (tramo.length < 10) throw new Error(`${regla.hueso}: solo ${tramo.length} vértices en el tramo ${regla.t}`);
  const d = regla.dir;
  const norma = Math.hypot(d.L ?? 0, d.S ?? 0, d.A ?? 0);
  const proy = ({ c }) => ((d.L ?? 0) * c.L + (d.S ?? 0) * c.S + (d.A ?? 0) * c.A) / norma;
  const orden = tramo.sort((a, b) => proy(b) - proy(a));
  // max: media del 1,5 % más extremo; cara: media del 30 % que más mira hacia allí.
  const n = Math.max(5, Math.round(orden.length * (regla.modo === 'cara' ? 0.3 : 0.015)));
  const sel = orden.slice(0, n);
  const m = sel.reduce((s, { i }) => s.map((v, a) => v + V[i][a] / n), [0, 0, 0]);
  // Se apoya en el vértice real más cercano a esa media (queda sobre la superficie).
  let mejor = sel[0].i, dm = Infinity;
  for (const { i } of sel) { const dd = Math.hypot(...V[i].map((v, a) => v - m[a])); if (dd < dm) { dm = dd; mejor = i; } }
  const caja = [0, 1, 2].map((a) => Math.max(...V.map((v) => v[a])) - Math.min(...V.map((v) => v[a])));
  const tam = Math.max(...caja);
  return { hueso: en, punto: V[mejor].map((v) => +v.toFixed(5)), radio: +Math.min(0.008, Math.max(0.0025, tam * 0.045)).toFixed(4) };
}

const accidentes = estructuras.filter((e) => e.categoria === 'accidente' && e.preguntable);
const salida = {};
const faltan = [];
for (const e of accidentes) {
  const r = REGLAS[e.nombre];
  if (!r) { faltan.push(e.nombre); continue; }
  salida[e.nombre] = { ...punto(r), regla: `${r.hueso} t=${r.t.join('–')} ${r.modo} hacia ${Object.entries(r.dir).map(([k, v]) => `${v > 0 ? '+' : '−'}${k}${Math.abs(v) !== 1 ? `×${Math.abs(v)}` : ''}`).join(' ')}` };
}
for (const n of Object.keys(REGLAS)) if (!accidentes.some((e) => e.nombre === n)) faltan.push(`(regla sin accidente) ${n}`);
if (faltan.length) { console.error('✗ sin regla:', faltan.join(' · ')); process.exit(1); }

// ── Comprobaciones anatómicas (relaciones que tienen que cumplirse) ──────────
const P = (n) => anat(salida[n].punto);
const CHEQUEOS = [
  ['tubérculo mayor lateral al menor', () => P('Tubérculo mayor').L > P('Tubérculo menor').L],
  ['tubérculo menor anterior al mayor', () => P('Tubérculo menor').A > P('Tubérculo mayor').A],
  ['cabeza del húmero medial al tubérculo mayor', () => P('Cabeza del húmero').L < P('Tubérculo mayor').L],
  ['epicóndilo lateral más lateral que el medial', () => P('Epicóndilo lateral').L > P('Epicóndilo medial').L],
  ['coracoides anterior al acromion', () => P('Apófisis coracoides').A > P('Acromion').A],
  ['acromion lateral a la coracoides', () => P('Acromion').L > P('Apófisis coracoides').L],
  ['espina posterior a la fosa subescapular', () => P('Espina de la escápula').A < P('Fosa subescapular').A],
  ['fosa supraespinosa por encima de la infraespinosa', () => P('Fosa supraespinosa').S > P('Fosa infraespinosa').S],
  ['ángulo superior por encima del inferior', () => P('Ángulo superior de la escápula').S > P('Ángulo inferior de la escápula').S],
  ['olécranon posterior a la coronoides', () => P('Olécranon').A < P('Apófisis coronoides').A],
  ['estiloides del radio más distal que la del cúbito', () => P('Apófisis estiloides del radio').S < P('Apófisis estiloides del cúbito').S],
  ['estiloides del radio lateral a la del cúbito', () => P('Apófisis estiloides del radio').L > P('Apófisis estiloides del cúbito').L],
  ['tubérculo de Lister posterior a la fosa escafoidea', () => P('Tubérculo dorsal del radio').A < P('Fosa escafoidea').A],
  ['tuberosidad deltoidea por debajo del cuello quirúrgico', () => P('Tuberosidad deltoidea').S < P('Cuello quirúrgico del húmero').S],
  ['extremo lateral de la clavícula lateral al medial', () => P('Extremo lateral (acromial) de la clavícula').L > P('Extremo medial (esternal) de la clavícula').L],
  ['gancho del ganchoso palmar al tubérculo del 5.º metacarpiano', () => P('Gancho del ganchoso').A > P('Tubérculo del 5to metacarpiano').A - 0.02],
  ['capítulo lateral a la tróclea', () => P('Capítulo del húmero').L > P('Tróclea del húmero').L],
];
let malos = 0;
for (const [txt, f] of CHEQUEOS) { const ok = f(); if (!ok) malos++; console.log(`${ok ? '✓' : '✗'} ${txt}`); }

// Dos marcadores del mismo hueso casi en el mismo sitio se confundirían.
const lista = Object.entries(salida);
const juntos = [];
for (let i = 0; i < lista.length; i++) for (let j = i + 1; j < lista.length; j++) {
  const [a, A] = lista[i], [b, B] = lista[j];
  if (A.hueso !== B.hueso) continue;
  const d = Math.hypot(...A.punto.map((v, k) => v - B.punto[k]));
  if (d < Math.min(A.radio, B.radio)) juntos.push(`${a} ↔ ${b} (${(d * 1000).toFixed(1)} mm)`);
}
if (juntos.length) console.log(`\n⚠ marcadores a menos de su radio:\n  ${juntos.join('\n  ')}`);

// Una cara o un cuerpo entero no se señala con un punto: el marcador caería en
// el mismo sitio que la fosa o el borde de al lado y la pregunta A sería ambigua.
// Siguen sirviendo como respuesta de una B (p. ej. dónde se inserta un músculo).
const NO_SENALABLES = new Set([
  'Diáfisis del húmero', 'Diáfisis del radio', 'Diáfisis del cúbito', 'Cuerpo de la clavícula',
  'Cara dorsal (posterior) de la escápula', 'Cara costal (anterior) de la escápula',
  'Cóndilo del húmero', 'Bases de los metacarpianos', 'Cabezas de los metacarpianos',
  'Borde inferior de la escápula',
]);
// Tampoco las caras ni los bordes: un punto sobre una superficie larga no se
// entiende (BUST lo vio en el examen). Quedan los salientes, fosas y surcos.
const SUPERFICIE = /^(Cara|Borde|Diáfisis|Cuerpo|Superficie)\b/;
for (const n of Object.keys(salida)) if (NO_SENALABLES.has(n) || SUPERFICIE.test(n)) salida[n].noSenalable = true;

fs.writeFileSync(path.join(DOCS, 'marcadores.json'), JSON.stringify(salida, null, 2));
console.log(`\n${Object.keys(salida).length} marcadores · ${malos} comprobaciones fallan`);
process.exit(malos ? 1 : 0);
