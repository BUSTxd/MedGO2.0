// Estructuras que ninguna fuente trae y que se modelan sobre el propio modelo:
// nervios (plexo cervical, toracodorsal) y vasos (ilíacos, glúteos, obturadores,
// pudendos internos). Las listas están en modelados/<región>.mjs.
//
//   node scripts/atlas-3d/modelar.mjs --region <id> --obj <miembro.obj> [--za <za.obj>] --salida <propios.obj>
//
// Cada estructura es un tubo a lo largo de una curva por puntos de control
// anclados a referencias del modelo (agujeros de conjunción, punto de Erb, borde
// del psoas, nervios que acompañan a cada vaso…). Después se relaja: la curva se
// aparta de todo hueso, músculo y vaso (y, si es un vaso, también de los nervios y
// de los vasos ya modelados) que no sea su destino o aquello a lo que se une, y se
// suaviza. Al final se comprueba: muestras dentro de algo, desvío de lo diseñado,
// entrada en el músculo de destino y cada unión dentro del tubo del otro.
//
// Es un esquema anatómico, no una disección: va rotulado como modelado por MedGO.
// Las coordenadas son las del atlas (metros, +Y arriba, +X izquierda del cuerpo).

import fs from 'node:fs';
import readline from 'node:readline';
import { DESPLAZAR, limpiar, sistemaDe } from './o3d.mjs';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const REGION = arg('region'), OBJ = arg('obj'), ZA = arg('za'), SALIDA = arg('salida');
const DETALLE = process.argv.includes('--detalle'); // imprime dónde choca y dónde se desvía cada rama
if (!REGION || !OBJ || !SALIDA) throw new Error('Uso: --region <id> --obj <miembro.obj> [--za <za.obj>] --salida <propios.obj>');
const { ESTRUCTURAS } = await import(`./modelados/${REGION}.mjs`);
// Una estructura es nervio, arteria o vena según su nombre (como en la extracción).
for (const e of ESTRUCTURAS) e.sistema = sistemaDe(e.en);
const esVaso = (e) => e.sistema === 'arteria' || e.sistema === 'vena';

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

const todos = [...(await leer(OBJ)), ...(ZA ? (await leer(ZA)).map((o) => ({ ...o, za: true })) : [])];

// Nervio existente tal como se publica (el XI de Z-Anatomy lleva DESPLAZAR),
// para comprobar las `uniones`: [rama, 'inicio' | 'fin', nervio].
const generados = new Map(); // estructuras modeladas ya hechas: en → vértices de sus tubos
const radios = new Map(); // y su radio mayor (para saber si una unión cae dentro del tubo)
function nervioPublicado(en) {
  if (generados.has(en)) return generados.get(en);
  const o = todos.find((t) => t.en === en);
  if (!o) throw new Error(`Unión con un nervio que no está: ${en}`);
  const mover = o.za && DESPLAZAR[en];
  if (!mover) return o.v;
  const v = [];
  for (let i = 0; i < o.v.length; i += 3) v.push(...mover(o.v[i], o.v[i + 1], o.v[i + 2]));
  return v;
}
const distanciaA = (v, p) => { let d = Infinity; for (let i = 0; i < v.length; i += 3) d = Math.min(d, Math.hypot(v[i] - p[0], v[i + 1] - p[1], v[i + 2] - p[2])); return d; };
const ctrl = ESTRUCTURAS.flatMap((n) => n.ramas.flat());
const zona = [0, 1, 2].map((a) => [Math.min(...ctrl.map((p) => p[a])) - 0.03, Math.max(...ctrl.map((p) => p[a])) + 0.03]);
// Los nervios solo son obstáculo para los vasos (un nervio modelado puede pasar
// junto a otro). El platisma es una lámina: los cutáneos van por debajo y se colocan a mano.
const OBSTACULO = new Set(['hueso', 'musculo', 'arteria', 'vena', 'nervio']);
const obstaculos = [];
for (const o of todos) {
  const s = sistemaDe(o.en);
  if (!OBSTACULO.has(s) || !o.f.length || o.en === 'Platysma') continue;
  const m = crearObstaculo(o.en, s, o.v, o.f);
  if (m) obstaculos.push(m);
}

function crearObstaculo(en, sistema, vv, ff) {
  const v = Float64Array.from(vv), t = Uint32Array.from(ff);
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < v.length; i++) { mn[i % 3] = Math.min(mn[i % 3], v[i]); mx[i % 3] = Math.max(mx[i % 3], v[i]); }
  if ([0, 1, 2].some((a) => mx[a] < zona[a][0] || mn[a] > zona[a][1])) return null;
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
  return { en, sistema, v, t, n, rej, H, mn, mx, cerrada };
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
// Qué obstáculos no cuentan en la muestra i de una rama: el inicio libre, el
// músculo de destino al final, los nervios si la estructura es un nervio, y
// aquello a lo que se une la rama cerca de ese extremo (12 mm).
function exenciones(est, r, s) {
  const total = s.at(-1);
  const unidos = (est.uniones ?? []).filter(([q]) => q === r);
  return (i, m) =>
    s[i] < (est.libreInicio ?? 0) ||
    (est.destino?.includes(m.en) && s[i] > total - (est.libreFinal ?? 0)) ||
    (m.sistema === 'nervio' && !esVaso(est)) ||
    m.en === est.en ||
    unidos.some(([, extremo, otro]) => (otro === m.en || m.modelado) && (extremo === 'inicio' ? s[i] < 0.012 : s[i] > total - 0.012));
  // (m.modelado: en una bifurcación los hermanos nacen del mismo punto y se tocan por construcción)
}

function radioEn(est, r, f) {
  if (r !== 0) return est.radioRamas ?? est.radio;
  return est.radioFinal ? est.radio + (est.radioFinal - est.radio) * f : est.radio;
}

function relajar(pts, nervio, r) {
  const ancla = pts.map((p) => [...p]);
  const s = largo(pts), total = s.at(-1);
  const exento = exenciones(nervio, r, s);
  // En un vaso, un extremo libre (sin unión) también se aparta: si no, la punta de
  // la ilíaca común venosa quedaba medio metida en L5. En los nervios no, para no
  // mover lo ya revisado.
  const unido = (e) => (nervio.uniones ?? []).some(([q, extremo]) => q === r && extremo === e);
  const desde = esVaso(nervio) && !unido('inicio') ? 0 : 1;
  const hasta = esVaso(nervio) && !unido('fin') ? pts.length : pts.length - 1;
  for (let it = 0; it < 40; it++) {
    for (let i = desde; i < hasta; i++) {
      const p = pts[i];
      const holgura = radioEn(nervio, r, s[i] / total) + 0.0006;
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
  let movido = 0, donde = null;
  for (let i = 0; i < pts.length; i++) { const d = Math.hypot(...pts[i].map((x, a) => x - ancla[i][a])); if (d > movido) { movido = d; donde = ancla[i]; } }
  return { pts, movido, donde };
}

// ─── Tubo ────────────────────────────────────────────────────────────────────
// Tubo con radio variable y puntas redondeadas (media esfera): con tapas planas,
// donde un ramo toca a otro nervio se veía un tubo «cortado» (lo vio BUST en el
// frénico, v10). `afinar`: [inicio, final] en metros; ese extremo empieza al
// 55 % del radio y crece hasta el radio entero, para nacer dentro del otro nervio.
function tubo(pts, r, afinar = [0, 0], lados = 8, rFinal = r) {
  const s = largo(pts), total = s.at(-1);
  const radio = (i) => {
    let k = (r + (rFinal - r) * (s[i] / total)) / r;
    if (afinar[0] > 0) k *= 0.55 + 0.45 * Math.min(1, s[i] / afinar[0]);
    if (afinar[1] > 0) k *= 0.55 + 0.45 * Math.min(1, (total - s[i]) / afinar[1]);
    return r * k;
  };
  const v = [], f = [], marcos = [];
  let ref = [0, 0, 1];
  const anillo = (centro, n, bn, rr) => {
    for (let k = 0; k < lados; k++) {
      const ang = (2 * Math.PI * k) / lados, c = Math.cos(ang) * rr, sn = Math.sin(ang) * rr;
      v.push(centro.map((x, j) => x + n[j] * c + bn[j] * sn));
    }
  };
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let t = b.map((x, k) => x - a[k]); const lt = Math.hypot(...t) || 1; t = t.map((x) => x / lt);
    // marco por transporte paralelo
    let n = [ref[1] * t[2] - ref[2] * t[1], ref[2] * t[0] - ref[0] * t[2], ref[0] * t[1] - ref[1] * t[0]];
    if (Math.hypot(...n) < 1e-6) n = [t[1], -t[0], 0];
    const ln = Math.hypot(...n); n = n.map((x) => x / ln);
    const bn = [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
    ref = bn;
    marcos.push({ t, n, bn });
    anillo(pts[i], n, bn, radio(i));
  }
  for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k < lados; k++) {
    const a = i * lados + k, b = i * lados + ((k + 1) % lados), c = a + lados, d = b + lados;
    f.push([a, c, b], [b, c, d]);
  }
  // Puntas: dos anillos más (a 35° y 70°) y el polo, hacia fuera del tubo.
  for (const [i, sentido] of [[0, -1], [pts.length - 1, 1]]) {
    const { t, n, bn } = marcos[i], rr = radio(i);
    let prev = i * lados;
    for (const ang of [35, 70]) {
      const a = (ang * Math.PI) / 180, centro = pts[i].map((x, j) => x + t[j] * sentido * rr * Math.sin(a));
      const ini = v.length;
      anillo(centro, n, bn, rr * Math.cos(a));
      for (let k = 0; k < lados; k++) {
        const p0 = prev + k, p1 = prev + ((k + 1) % lados), q0 = ini + k, q1 = ini + ((k + 1) % lados);
        f.push(...(sentido > 0 ? [[p0, q0, p1], [p1, q0, q1]] : [[p0, p1, q0], [p1, q1, q0]]));
      }
      prev = ini;
    }
    const polo = v.length;
    v.push(pts[i].map((x, j) => x + t[j] * sentido * rr));
    for (let k = 0; k < lados; k++) { const a = prev + k, b = prev + ((k + 1) % lados); f.push(sentido > 0 ? [a, polo, b] : [a, b, polo]); }
  }
  return { v, f };
}

// `partes` (opcional, una entrada por rama): en qué pieza del visor sale cada
// rama. Una cadena = la rama entera; una lista [[nombre, hasta], …, [nombre]] =
// la rama cortada en tramos, cada uno hasta la muestra más cercana al punto de
// control `hasta`. Solo cambia cómo se agrupan los tubos al escribir el OBJ: la
// curva, la relajación y las comprobaciones son las de la estructura entera.
function tramos(est, r, pts) {
  const p = est.partes?.[r];
  if (!p) return [{ en: est.en, pts }];
  if (typeof p === 'string') return [{ en: p, pts }];
  const out = [];
  let desde = 0;
  for (const [en, hasta] of p) {
    let k = pts.length - 1;
    if (hasta) {
      let best = Infinity;
      for (let i = desde + 1; i < pts.length - 1; i++) { const d = Math.hypot(...pts[i].map((x, a) => x - hasta[a])); if (d < best) { best = d; k = i; } }
    }
    out.push({ en, pts: pts.slice(desde, k + 1) });
    desde = k;
  }
  return out;
}

// ─── Generación y comprobación ───────────────────────────────────────────────
let texto = '', base = 1;
for (const nervio of ESTRUCTURAS) {
  const mallas = [];
  const piezas = new Map(); // nombre de la pieza → sus tubos (en orden de aparición)
  let muestras = 0, movidoMax = 0;
  const uniones = [];
  const choques = {};
  for (const rama of nervio.ramas) {
    const r = nervio.ramas.indexOf(rama);
    const { pts, movido, donde } = relajar(curva(rama), nervio, r);
    movidoMax = Math.max(movidoMax, movido);
    if (DETALLE && movido > 0.003) console.log(`    rama ${r}: se desvía ${(movido * 1000).toFixed(1)} mm cerca de (${donde.map((x) => x.toFixed(3)).join(', ')})`);
    const s = largo(pts);
    const exento = exenciones(nervio, r, s);
    for (let i = 0; i < pts.length; i += 2) {
      muestras++;
      for (const m of obstaculos) {
        if (exento(i, m)) continue;
        if (dentro(m, pts[i])) {
          choques[m.en] = (choques[m.en] ?? 0) + 1;
          if (DETALLE) console.log(`    rama ${r}: dentro de ${m.en} en (${pts[i].map((x) => x.toFixed(3)).join(', ')}), a ${(s[i] * 1000).toFixed(0)} mm del inicio`);
        }
      }
    }
    // Un extremo que se une a otro nervio tiene que caer dentro de su tubo
    // (los de Open3DModel y Z-Anatomy miden 1,5-3 mm de radio). Se mide antes
    // de añadir esta rama: una unión con el propio nervio es con sus ramas anteriores.
    for (const [r, extremo, otro] of nervio.uniones ?? []) {
      if (r !== nervio.ramas.indexOf(rama)) continue;
      const d = distanciaA(nervioPublicado(otro), extremo === 'inicio' ? pts[0] : pts.at(-1));
      uniones.push(`${otro === nervio.en ? 'su tronco' : otro} ${(d * 1000).toFixed(1)} mm`);
      if (d > Math.max(0.003, (radios.get(otro) ?? 0) + 0.0005)) choques[`no llega a ${otro}`] = 1;
    }
    const une = (e) => (nervio.uniones ?? []).some(([q, extremo]) => q === r && extremo === e);
    // radioFinal afina el tronco (rama 0); las demás ramas llevan radioRamas.
    const r0 = radioEn(nervio, r, 0), r1 = radioEn(nervio, r, 1);
    const lados = Math.max(r0, r1) > 0.0025 ? 12 : 8;
    const partes = tramos(nervio, r, pts);
    if (partes.length > 1 && r0 !== r1) throw new Error(`${nervio.en}: una rama con radio variable no se puede cortar en tramos`);
    partes.forEach(({ en, pts: tp }, j) => {
      // Solo se afina el extremo de la rama que se une a otro nervio, no los cortes entre tramos.
      const malla = partes.length === 1
        ? tubo(tp, r0, [une('inicio') ? 0.003 : 0, une('fin') ? 0.003 : 0], lados, r1)
        : tubo(tp, r0, [j === 0 && une('inicio') ? 0.003 : 0, j === partes.length - 1 && une('fin') ? 0.003 : 0], lados);
      mallas.push(malla);
      (piezas.get(en) ?? piezas.set(en, []).get(en)).push(malla);
    });
    generados.set(nervio.en, mallas.flatMap((m) => m.v.flat()));
    radios.set(nervio.en, Math.max(nervio.radio, nervio.radioFinal ?? 0));
  }
  for (const [en, ms] of piezas) {
    texto += `o ${en}\n`;
    let off = 0;
    for (const m of ms) {
      for (const p of m.v) texto += `v ${p.map((x) => x.toFixed(6)).join(' ')}\n`;
      for (const t of m.f) texto += `f ${t.map((i) => i + base + off).join(' ')}\n`;
      off += m.v.length;
    }
    base += off;
  }
  // Un vaso ya hecho es obstáculo para los siguientes (la vena no atraviesa su arteria).
  if (esVaso(nervio)) {
    const v = [], f = [];
    for (const m of mallas) { const o = v.length / 3; v.push(...m.v.flat()); f.push(...m.f.flat().map((i) => i + o)); }
    const ob = crearObstaculo(nervio.en, nervio.sistema, v, f);
    if (ob) obstaculos.push({ ...ob, modelado: true });
  }
  // Cada rama de una estructura con destino acaba dentro de uno de sus músculos
  // (salvo `entra: false`: el destino solo se puede rozar, p. ej. al salir por el conducto obturador).
  if (nervio.destino && nervio.entra !== false) for (const rama of nervio.ramas) {
    const fin = rama.at(-1);
    if (!nervio.destino.some((d) => { const m = obstaculos.find((o) => o.en === d); return m && dentro(m, fin); }))
      choques[`rama ${nervio.ramas.indexOf(rama)} no entra en ${nervio.destino.join(' / ')}`] = 1;
  }
  const n = Object.values(choques).reduce((a, b) => a + b, 0);
  const lejos = movidoMax > 0.006;
  console.log(`${n || lejos ? '⚠' : '✓'} ${nervio.en}: ${nervio.ramas.length} rama(s), ${muestras} muestras, se apartó hasta ${(movidoMax * 1000).toFixed(1)} mm de lo diseñado${uniones.length ? ' · se une a ' + uniones.join(', ') : ''}${n ? ' · ' + JSON.stringify(choques) : ''}`);
}
fs.writeFileSync(SALIDA, texto);
console.log(`→ ${SALIDA}`);
