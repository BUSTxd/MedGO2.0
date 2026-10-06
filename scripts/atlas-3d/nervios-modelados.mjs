// Nervios que ninguna fuente trae y que se modelan aquí sobre el propio modelo:
// el plexo cervical (ni Open3DModel, ni Z-Anatomy, ni BodyParts3D lo tienen) y
// el toracodorsal (el de Z-Anatomy sale a 12 mm del fascículo posterior de
// Open3DModel y atraviesa el redondo mayor y el subescapular).
//
//   node scripts/atlas-3d/nervios-modelados.mjs --obj <upper-limb.obj> --za <za.obj> --salida <propios.obj>
//
// Cada nervio es un tubo a lo largo de una curva por puntos de control anclados
// a referencias del modelo (agujeros de conjunción C1-C4 a la altura de donde
// Open3DModel saca la raíz C5, borde posterior del ECM = punto de Erb, clavícula,
// vasos subclavios, arteria toracodorsal…). Después se relaja: la curva se
// aparta de todo hueso, músculo y vaso que no sea su destino, y se suaviza. Al
// final se comprueba por rayos que ninguna muestra quede dentro de nada.
//
// Es un esquema anatómico, no una disección: va rotulado como modelado por MedGO.
// Las coordenadas son las del atlas (metros, +Y arriba, +X izquierda del cuerpo).

import fs from 'node:fs';
import readline from 'node:readline';
import { limpiar, sistemaDe } from './o3d.mjs';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const OBJ = arg('obj'), ZA = arg('za'), SALIDA = arg('salida');
if (!OBJ || !ZA || !SALIDA) throw new Error('Uso: --obj <upper-limb.obj> --za <za.obj> --salida <propios.obj>');

// ─── Nervios ─────────────────────────────────────────────────────────────────
// `ramas`: polilíneas de control. `radio` en metros. `libreInicio`/`libreFinal`
// (m de recorrido) quedan exentos: el inicio nace dentro de otra estructura
// (fascículo, agujero de conjunción) y el final entra en su músculo (`destino`).
const P = (x, y, z) => [x, y, z];

// Plexo cervical: las asas C1-C2, C2-C3 y C3-C4 van delante de las apófisis
// transversas, detrás del ECM. En este modelo el ECM tapa las transversas por
// delante y por fuera: entre ECM, vértebras y elevador de la escápula queda una
// franja libre de ~5 mm (z ≈ -0,005; mapa de cortes de 2 mm), y ahí van.
const F1 = P(-0.020, 1.551, -0.020), F2 = P(-0.018, 1.535, -0.017), F3 = P(-0.015, 1.518, -0.015), F4 = P(-0.015, 1.503, -0.015);
const A12 = P(-0.031, 1.530, -0.004), A23 = P(-0.029, 1.514, -0.003), A34 = P(-0.030, 1.498, -0.005);
// Punto de Erb: mitad del borde posterior del ECM (y 1,484: x -0,042, z -0,001).
// Los ramos llegan por detrás del ECM (z ≈ -0,011 a la altura de C4).
const ERB = P(-0.046, 1.487, -0.007);
const TRAS_ECM = P(-0.037, 1.500, -0.011);

export const NERVIOS = [
  {
    en: 'Cervical plexus (C1-C4 ventral rami)',
    radio: 0.0011,
    libreInicio: 0.009,
    ramas: [
      [F1, P(-0.031, 1.548, -0.010), P(-0.038, 1.538, -0.004), A12, A23, A34],
      [F2, P(-0.027, 1.533, -0.010), A12],
      [F3, P(-0.026, 1.515, -0.009), A23],
      [F4, P(-0.026, 1.500, -0.009), A34],
    ],
  },
  {
    en: 'Lesser occipital nerve', // C2: sube por el borde posterior del ECM hasta detrás de la oreja
    radio: 0.0007,
    // borde posterior del ECM: y 1,52 (-0,046, -0,017) · 1,54 (-0,053, -0,028) · 1,56 (-0,055, -0,041)
    ramas: [[A12, P(-0.033, 1.516, -0.011), TRAS_ECM, ERB, P(-0.049, 1.503, -0.013), P(-0.051, 1.522, -0.021), P(-0.058, 1.542, -0.032), P(-0.060, 1.562, -0.045), P(-0.062, 1.580, -0.056), P(-0.060, 1.598, -0.066)]],
  },
  {
    en: 'Great auricular nerve', // C2-C3: rodea el ECM y sube sobre su cara superficial hacia el lóbulo de la oreja
    radio: 0.0008,
    // cara lateral del ECM: y 1,50 (-0,046, 0,000) · 1,52 (-0,050, -0,005) · 1,54 (-0,055, -0,014) · 1,56 (-0,060, -0,020)
    ramas: [[A23, TRAS_ECM, ERB, P(-0.0495, 1.492, -0.003), P(-0.050, 1.502, 0.001), P(-0.054, 1.520, -0.003), P(-0.058, 1.540, -0.010), P(-0.063, 1.558, -0.015), P(-0.066, 1.572, -0.011)]],
  },
  {
    en: 'Transverse cervical nerve', // C2-C3: cruza la cara superficial del ECM hacia delante, bajo el platisma
    radio: 0.0007,
    // ECM a y 1,475: x -0,042…-0,022, z 0,0025…0,025
    ramas: [[A23, TRAS_ECM, ERB, P(-0.049, 1.482, 0.000), P(-0.047, 1.478, 0.010), P(-0.044, 1.476, 0.020), P(-0.036, 1.474, 0.030), P(-0.022, 1.472, 0.039), P(-0.008, 1.470, 0.047)]],
  },
  {
    en: 'Supraclavicular nerves', // C3-C4: medial, intermedio y lateral, por encima de la clavícula
    radio: 0.0007,
    ramas: [
      // el medial baja por fuera de la cabeza clavicular del ECM (y 1,44: lateral -0,046, 0,021) y cruza la clavícula por delante
      [A34, P(-0.034, 1.492, -0.011), ERB, P(-0.049, 1.470, 0.002), P(-0.050, 1.452, 0.014), P(-0.051, 1.435, 0.026), P(-0.049, 1.418, 0.044), P(-0.044, 1.402, 0.056), P(-0.038, 1.385, 0.068)],
      [ERB, P(-0.054, 1.464, -0.002), P(-0.066, 1.444, 0.008), P(-0.075, 1.428, 0.022), P(-0.080, 1.408, 0.040), P(-0.082, 1.388, 0.050)],
      [ERB, P(-0.060, 1.470, -0.012), P(-0.085, 1.450, -0.018), P(-0.110, 1.437, -0.022), P(-0.135, 1.430, -0.026), P(-0.155, 1.424, -0.030)],
    ],
  },
  {
    en: 'Muscular branches of cervical plexus to sternocleidomastoid', // C2-C3, por su cara profunda
    radio: 0.0006,
    destino: ['Sternocleidomastoid muscle'],
    libreFinal: 0.005,
    ramas: [[A23, P(-0.031, 1.512, -0.001), P(-0.0335, 1.510, 0.002), P(-0.036, 1.509, 0.004)]],
  },
  {
    en: 'Muscular branches of cervical plexus to trapezius', // C3-C4, cruzan el triángulo posterior junto al XI
    radio: 0.0006,
    destino: ['Descending part of Trapezius muscle'],
    libreFinal: 0.012,
    ramas: [[A34, P(-0.040, 1.490, -0.010), P(-0.047, 1.476, -0.016), P(-0.054, 1.462, -0.022), P(-0.059, 1.452, -0.027), P(-0.063, 1.446, -0.030)]],
  },
  {
    en: 'Phrenic nerve', // C3-C5: baja por delante del escaleno anterior (no está), entre arteria y vena subclavias, y por el mediastino hasta el diafragma
    radio: 0.0011,
    ramas: [
      [A34, P(-0.031, 1.484, 0.002), P(-0.028, 1.466, 0.005), P(-0.025, 1.446, 0.008), P(-0.023, 1.428, 0.011), P(-0.021, 1.405, 0.014), P(-0.025, 1.375, 0.020), P(-0.034, 1.340, 0.027), P(-0.042, 1.300, 0.031), P(-0.047, 1.260, 0.030), P(-0.049, 1.225, 0.024)],
      [P(-0.030, 1.468, -0.008), P(-0.029, 1.462, 0.001), P(-0.028, 1.456, 0.006)], // raíz de C5 (desde la de Open3DModel)
    ],
  },
  {
    en: 'Thoracodorsal nerve', // del fascículo posterior, con la arteria toracodorsal, a la cara profunda del dorsal ancho
    radio: 0.0012,
    libreInicio: 0.005,
    destino: ['Latissimus dorsi'],
    libreFinal: 0.03,
    ramas: [[P(-0.1214, 1.3797, -0.0146), P(-0.124, 1.372, -0.022), P(-0.130, 1.360, -0.030), P(-0.136, 1.345, -0.038), P(-0.138, 1.330, -0.047), P(-0.135, 1.318, -0.059), P(-0.130, 1.305, -0.070), P(-0.127, 1.290, -0.080), P(-0.128, 1.275, -0.080), P(-0.124, 1.258, -0.084), P(-0.116, 1.240, -0.087), P(-0.106, 1.225, -0.090)]],
  },
];

// ─── Mallas de obstáculo ─────────────────────────────────────────────────────
async function leer(archivo) {
  const objs = [];
  let cur = null, base = 0;
  const rl = readline.createInterface({ input: fs.createReadStream(archivo), crlfDelay: Infinity });
  for await (const l of rl) {
    if (l.startsWith('o ')) objs.push((cur = { en: limpiar(l.slice(2)), v: [], f: [], base }));
    else if (l.startsWith('v ')) { const p = l.split(/\s+/); cur.v.push(+p[1], +p[2], +p[3]); base++; }
    else if (l.startsWith('f ')) {
      const ids = l.split(/\s+/).slice(1).filter(Boolean).map((s) => parseInt(s, 10) - 1 - cur.base);
      for (let k = 1; k + 1 < ids.length; k++) cur.f.push(ids[0], ids[k], ids[k + 1]);
    }
  }
  return objs;
}

const todos = [...(await leer(OBJ)), ...(await leer(ZA))];
const ctrl = NERVIOS.flatMap((n) => n.ramas.flat());
const zona = [0, 1, 2].map((a) => [Math.min(...ctrl.map((p) => p[a])) - 0.03, Math.max(...ctrl.map((p) => p[a])) + 0.03]);
const OBSTACULO = new Set(['hueso', 'musculo', 'arteria', 'vena']);
const obstaculos = [];
for (const o of todos) {
  const s = sistemaDe(o.en);
  if (!OBSTACULO.has(s) || !o.f.length || o.en === 'Platysma') continue; // el platisma es una lámina: los cutáneos van por debajo y se colocan a mano
  const v = Float64Array.from(o.v), t = Uint32Array.from(o.f);
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < v.length; i++) { mn[i % 3] = Math.min(mn[i % 3], v[i]); mx[i % 3] = Math.max(mx[i % 3], v[i]); }
  if ([0, 1, 2].some((a) => mx[a] < zona[a][0] || mn[a] > zona[a][1])) continue;
  // normales por vértice (ponderadas por área) y rejilla de vértices
  const n = new Float64Array(v.length);
  for (let k = 0; k < t.length; k += 3) {
    const a = t[k] * 3, b = t[k + 1] * 3, c = t[k + 2] * 3;
    const u = [v[b] - v[a], v[b + 1] - v[a + 1], v[b + 2] - v[a + 2]], w = [v[c] - v[a], v[c + 1] - v[a + 1], v[c + 2] - v[a + 2]];
    const cr = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    for (const q of [a, b, c]) for (let j = 0; j < 3; j++) n[q + j] += cr[j];
  }
  for (let i = 0; i < n.length; i += 3) { const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1; n[i] /= l; n[i + 1] /= l; n[i + 2] /= l; }
  const H = 0.004, rej = new Map();
  for (let i = 0; i < v.length; i += 3) { const k = `${Math.floor(v[i] / H)},${Math.floor(v[i + 1] / H)},${Math.floor(v[i + 2] / H)}`; (rej.get(k) ?? rej.set(k, []).get(k)).push(i); }
  // ¿Cerrada? Los rayos solo valen en mallas sin bordes (la yugular externa de
  // Open3DModel es un árbol de venas con los extremos abiertos).
  const aristas = new Map();
  for (let k = 0; k < t.length; k += 3) for (const [a, b] of [[t[k], t[k + 1]], [t[k + 1], t[k + 2]], [t[k + 2], t[k]]]) {
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    aristas.set(key, (aristas.get(key) ?? 0) + 1);
  }
  const cerrada = [...aristas.values()].every((c) => c === 2);
  // Normales hacia fuera: la yugular externa de Open3DModel viene con las caras
  // al revés. Cerrada → signo del volumen; abierta → votación local (el vértice
  // queda del lado de su normal respecto al centro de sus vecinos a < 4 mm).
  let fuera;
  if (cerrada) {
    let vol = 0;
    for (let k = 0; k < t.length; k += 3) {
      const a = t[k] * 3, b = t[k + 1] * 3, c = t[k + 2] * 3;
      vol += v[a] * (v[b + 1] * v[c + 2] - v[b + 2] * v[c + 1]) - v[a + 1] * (v[b] * v[c + 2] - v[b + 2] * v[c]) + v[a + 2] * (v[b] * v[c + 1] - v[b + 1] * v[c]);
    }
    fuera = vol > 0;
  } else {
    let voto = 0;
    for (let i = 0; i < v.length; i += 3 * Math.max(1, Math.floor(v.length / 3 / 300))) {
      const c = [0, 0, 0]; let k = 0;
      const g = [0, 1, 2].map((a) => Math.floor(v[i + a] / H));
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++)
        for (const q of rej.get(`${g[0] + x},${g[1] + y},${g[2] + z}`) ?? []) if (Math.hypot(v[q] - v[i], v[q + 1] - v[i + 1], v[q + 2] - v[i + 2]) < 0.004) { c[0] += v[q]; c[1] += v[q + 1]; c[2] += v[q + 2]; k++; }
      voto += Math.sign((v[i] - c[0] / k) * n[i] + (v[i + 1] - c[1] / k) * n[i + 1] + (v[i + 2] - c[2] / k) * n[i + 2]);
    }
    fuera = voto >= 0;
  }
  if (!fuera) for (let i = 0; i < n.length; i++) n[i] = -n[i];
  obstaculos.push({ en: o.en, v, t, n, rej, H, mn, mx, cerrada });
}

function cercano(m, p) {
  const c = p.map((x) => Math.floor(x / m.H));
  let best = Infinity, bi = -1;
  for (let r = 1; r <= 3; r++) {
    for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) for (let k = -r; k <= r; k++) {
      const l = m.rej.get(`${c[0] + i},${c[1] + j},${c[2] + k}`);
      if (l) for (const q of l) { const d = Math.hypot(m.v[q] - p[0], m.v[q + 1] - p[1], m.v[q + 2] - p[2]); if (d < best) { best = d; bi = q; } }
    }
    if (bi >= 0 && best < r * m.H) break;
  }
  return bi;
}

// Malla cerrada: paridad de cortes de un rayo (Möller-Trumbore), votada en 3
// direcciones. Abierta: detrás de la superficie del vértice más cercano, a < 3 mm.
function dentro(m, p) {
  if (p.some((x, a) => x < m.mn[a] || x > m.mx[a])) return false;
  if (!m.cerrada) {
    const q = cercano(m, p);
    if (q < 0) return false;
    const d = [p[0] - m.v[q], p[1] - m.v[q + 1], p[2] - m.v[q + 2]];
    return Math.hypot(...d) < 0.003 && d[0] * m.n[q] + d[1] * m.n[q + 1] + d[2] * m.n[q + 2] < 0;
  }
  let votos = 0;
  for (const D of [[0, 0, -1], [0.3, 0.2, 0.93], [-0.6, 0.5, 0.62]]) {
    let c = 0;
    const { v, t } = m;
    for (let k = 0; k < t.length; k += 3) {
      const a = t[k] * 3, b = t[k + 1] * 3, cc = t[k + 2] * 3;
      const e1 = [v[b] - v[a], v[b + 1] - v[a + 1], v[b + 2] - v[a + 2]], e2 = [v[cc] - v[a], v[cc + 1] - v[a + 1], v[cc + 2] - v[a + 2]];
      const h = [D[1] * e2[2] - D[2] * e2[1], D[2] * e2[0] - D[0] * e2[2], D[0] * e2[1] - D[1] * e2[0]];
      const det = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
      if (Math.abs(det) < 1e-14) continue;
      const f = 1 / det, s = [p[0] - v[a], p[1] - v[a + 1], p[2] - v[a + 2]];
      const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);
      if (u < 0 || u > 1) continue;
      const q = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]];
      const w = f * (D[0] * q[0] + D[1] * q[1] + D[2] * q[2]);
      if (w < 0 || u + w > 1) continue;
      if (f * (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]) > 0) c++;
    }
    if (c % 2) votos++;
  }
  return votos >= 2;
}

// ─── Curvas ──────────────────────────────────────────────────────────────────
// Catmull-Rom centrípeta muestreada cada ~1,5 mm.
function curva(ctrlP, paso = 0.0015) {
  const pts = [ctrlP[0], ...ctrlP, ctrlP.at(-1)];
  const out = [];
  for (let i = 1; i + 2 < pts.length; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const n = Math.max(1, Math.ceil(Math.hypot(...p2.map((x, a) => x - p1[a])) / paso));
    for (let s = 0; s < n; s++) {
      const t = s / n, t2 = t * t, t3 = t2 * t;
      out.push(p1.map((_, a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
    }
  }
  out.push([...ctrlP.at(-1)]);
  return out;
}

const largo = (pts) => { const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(...pts[i].map((x, a) => x - pts[i - 1][a]))); return s; };

// Aparta la curva de los obstáculos (empuje por la normal del vértice más
// cercano hasta dejar radio + 0,6 mm de holgura) y la suaviza; los extremos
// quedan fijos y un muelle la retiene cerca de lo diseñado (sin él, una curva
// encajada entre dos músculos se deslizaba 2-3 cm buscando hueco).
function relajar(pts, nervio) {
  const ancla = pts.map((p) => [...p]);
  const holgura = nervio.radio + 0.0006;
  const s = largo(pts), total = s.at(-1);
  const exento = (i, m) =>
    s[i] < (nervio.libreInicio ?? 0) ||
    (nervio.destino?.includes(m.en) && s[i] > total - (nervio.libreFinal ?? 0));
  for (let it = 0; it < 40; it++) {
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i];
      for (const m of obstaculos) {
        if (exento(i, m) || p.some((x, a) => x < m.mn[a] - 0.01 || x > m.mx[a] + 0.01)) continue;
        const q = cercano(m, p);
        if (q < 0) continue;
        // Una lámina abierta no tiene «dentro»: estar 1 cm detrás de ella no es chocar.
        if (!m.cerrada && Math.hypot(p[0] - m.v[q], p[1] - m.v[q + 1], p[2] - m.v[q + 2]) > holgura + 0.002) continue;
        const nq = [m.n[q], m.n[q + 1], m.n[q + 2]];
        const d = (p[0] - m.v[q]) * nq[0] + (p[1] - m.v[q + 1]) * nq[1] + (p[2] - m.v[q + 2]) * nq[2];
        if (d < holgura) for (let a = 0; a < 3; a++) p[a] += nq[a] * (holgura - d) * 0.5;
      }
    }
    for (let k = 0; k < 2; k++) {
      const prev = pts.map((p) => [...p]);
      for (let i = 1; i < pts.length - 1; i++) for (let a = 0; a < 3; a++) pts[i][a] = 0.5 * prev[i][a] + 0.25 * (prev[i - 1][a] + prev[i + 1][a]);
    }
    for (let i = 1; i < pts.length - 1; i++) for (let a = 0; a < 3; a++) pts[i][a] += 0.15 * (ancla[i][a] - pts[i][a]);
  }
  let movido = 0;
  for (let i = 0; i < pts.length; i++) movido = Math.max(movido, Math.hypot(...pts[i].map((x, a) => x - ancla[i][a])));
  return { pts, movido };
}

// ─── Tubo ────────────────────────────────────────────────────────────────────
function tubo(pts, r, lados = 8) {
  const v = [], f = [];
  let ref = [0, 0, 1];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let t = b.map((x, k) => x - a[k]); const lt = Math.hypot(...t) || 1; t = t.map((x) => x / lt);
    // marco por transporte paralelo
    let n = [ref[1] * t[2] - ref[2] * t[1], ref[2] * t[0] - ref[0] * t[2], ref[0] * t[1] - ref[1] * t[0]];
    if (Math.hypot(...n) < 1e-6) n = [t[1], -t[0], 0];
    const ln = Math.hypot(...n); n = n.map((x) => x / ln);
    const bn = [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
    ref = bn;
    for (let k = 0; k < lados; k++) {
      const ang = (2 * Math.PI * k) / lados, c = Math.cos(ang) * r, s = Math.sin(ang) * r;
      v.push(pts[i].map((x, j) => x + n[j] * c + bn[j] * s));
    }
  }
  for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k < lados; k++) {
    const a = i * lados + k, b = i * lados + ((k + 1) % lados), c = a + lados, d = b + lados;
    f.push([a, c, b], [b, c, d]);
  }
  // tapas
  for (const [i, inv] of [[0, true], [pts.length - 1, false]]) {
    const ci = v.length; v.push([...pts[i]]);
    for (let k = 0; k < lados; k++) { const a = i * lados + k, b = i * lados + ((k + 1) % lados); f.push(inv ? [ci, b, a] : [ci, a, b]); }
  }
  return { v, f };
}

// ─── Generación y comprobación ───────────────────────────────────────────────
let texto = '', base = 1;
for (const nervio of NERVIOS) {
  const mallas = [];
  let muestras = 0, movidoMax = 0;
  const choques = {};
  for (const rama of nervio.ramas) {
    const { pts, movido } = relajar(curva(rama), nervio);
    movidoMax = Math.max(movidoMax, movido);
    const s = largo(pts), total = s.at(-1);
    for (let i = 0; i < pts.length; i += 2) {
      muestras++;
      if (s[i] < (nervio.libreInicio ?? 0)) continue;
      for (const m of obstaculos) {
        if (nervio.destino?.includes(m.en) && s[i] > total - (nervio.libreFinal ?? 0)) continue;
        if (dentro(m, pts[i])) choques[m.en] = (choques[m.en] ?? 0) + 1;
      }
    }
    mallas.push(tubo(pts, nervio.radio));
  }
  texto += `o ${nervio.en}\n`;
  let off = 0;
  for (const m of mallas) {
    for (const p of m.v) texto += `v ${p.map((x) => x.toFixed(6)).join(' ')}\n`;
    for (const t of m.f) texto += `f ${t.map((i) => i + base + off).join(' ')}\n`;
    off += m.v.length;
  }
  base += off;
  const n = Object.values(choques).reduce((a, b) => a + b, 0);
  // El final de un ramo muscular tiene que acabar dentro de su músculo.
  for (const d of nervio.destino ?? []) {
    const m = obstaculos.find((o) => o.en === d);
    const fin = nervio.ramas.at(-1).at(-1);
    if (!m || !dentro(m, fin)) choques[`no entra en ${d}`] = 1;
  }
  const lejos = movidoMax > 0.006;
  console.log(`${n || lejos ? '⚠' : '✓'} ${nervio.en}: ${nervio.ramas.length} rama(s), ${muestras} muestras, se apartó hasta ${(movidoMax * 1000).toFixed(1)} mm de lo diseñado${n ? ' · dentro de ' + JSON.stringify(choques) : ''}`);
}
fs.writeFileSync(SALIDA, texto);
console.log(`→ ${SALIDA}`);
