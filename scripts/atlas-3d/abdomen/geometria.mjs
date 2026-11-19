// Abdomen 3D: utilidades de malla para partir y modelar (todo en metros).
// Una malla es { v: [x,y,z,…], f: [a,b,c,…] } con índices desde 0.

export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const suma = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const por = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const largo = (a) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a) => por(a, 1 / (largo(a) || 1));
export const dist = (a, b) => largo(sub(a, b));
export const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export const vert = (m, i) => [m.v[i * 3], m.v[i * 3 + 1], m.v[i * 3 + 2]];
export const centroTri = (m, t) => {
  const a = m.f[t * 3] * 3, b = m.f[t * 3 + 1] * 3, c = m.f[t * 3 + 2] * 3;
  return [(m.v[a] + m.v[b] + m.v[c]) / 3, (m.v[a + 1] + m.v[b + 1] + m.v[c + 1]) / 3, (m.v[a + 2] + m.v[b + 2] + m.v[c + 2]) / 3];
};
export const nTri = (m) => m.f.length / 3;

export function caja(m) {
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.v.length; i += 3) for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], m.v[i + a]); mx[a] = Math.max(mx[a], m.v[i + a]); }
  return { min: mn, max: mx, centro: mn.map((x, a) => (x + mx[a]) / 2) };
}

/** Submalla con los triángulos elegidos (índices de triángulo), compactada. */
export function submalla(m, tris) {
  const mapa = new Map(), v = [], f = [];
  for (const t of tris) for (let k = 0; k < 3; k++) {
    const i = m.f[t * 3 + k];
    if (!mapa.has(i)) { mapa.set(i, v.length / 3); v.push(m.v[i * 3], m.v[i * 3 + 1], m.v[i * 3 + 2]); }
    f.push(mapa.get(i));
  }
  return { v, f };
}

/** Parte la malla por triángulos: `etiqueta(t, centroide)` → nombre de la parte (o null para tirarlo). */
export function partir(m, etiqueta) {
  const grupos = new Map();
  for (let t = 0; t < nTri(m); t++) {
    const e = etiqueta(t, centroTri(m, t));
    if (e == null) continue;
    (grupos.get(e) ?? grupos.set(e, []).get(e)).push(t);
  }
  return Object.fromEntries([...grupos].map(([e, ts]) => [e, submalla(m, ts)]));
}

/** Componentes conexas por triángulos (comparten vértice). Devuelve arreglos de índices de triángulo, de mayor a menor. */
export function componentes(m) {
  const n = m.v.length / 3, padre = Array.from({ length: n }, (_, i) => i);
  const raiz = (x) => { while (padre[x] !== x) x = padre[x] = padre[padre[x]]; return x; };
  for (let t = 0; t < m.f.length; t += 3) { const a = raiz(m.f[t]); padre[raiz(m.f[t + 1])] = a; padre[raiz(m.f[t + 2])] = a; }
  const g = new Map();
  for (let t = 0; t < nTri(m); t++) { const r = raiz(m.f[t * 3]); (g.get(r) ?? g.set(r, []).get(r)).push(t); }
  return [...g.values()].sort((a, b) => b.length - a.length);
}

/** Distancia geodésica (por aristas) desde los vértices `origen` a todos. */
export function geodesica(m, origen) {
  const n = m.v.length / 3;
  const ady = Array.from({ length: n }, () => []);
  for (let t = 0; t < m.f.length; t += 3) for (let k = 0; k < 3; k++) {
    const a = m.f[t + k], b = m.f[t + ((k + 1) % 3)];
    const d = dist(vert(m, a), vert(m, b));
    ady[a].push(b, d); ady[b].push(a, d);
  }
  const D = new Float64Array(n).fill(Infinity);
  // Montículo binario sencillo.
  const heap = [];
  const push = (d, i) => { heap.push([d, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let s = k; if (l < heap.length && heap[l][0] < heap[s][0]) s = l; if (r < heap.length && heap[r][0] < heap[s][0]) s = r; if (s === k) break; [heap[s], heap[k]] = [heap[k], heap[s]]; k = s; } } return top; };
  for (const o of origen) { D[o] = 0; push(0, o); }
  while (heap.length) {
    const [d, i] = pop();
    if (d > D[i]) continue;
    const a = ady[i];
    for (let k = 0; k < a.length; k += 2) { const nd = d + a[k + 1]; if (nd < D[a[k]]) { D[a[k]] = nd; push(nd, a[k]); } }
  }
  return D;
}

/** Vértice más cercano a un punto. */
export function masCercano(m, p) {
  let mejor = -1, d = Infinity;
  for (let i = 0; i < m.v.length / 3; i++) { const e = dist(vert(m, i), p); if (e < d) { d = e; mejor = i; } }
  return { i: mejor, d };
}

/** Distancia de un punto a la malla (a sus vértices; basta para mallas densas). */
export function distanciaA(m, p) { return masCercano(m, p).d; }

/** Une varias mallas en una. */
export function unir(...ms) {
  const v = [], f = [];
  for (const m of ms) { const base = v.length / 3; v.push(...m.v); for (const i of m.f) f.push(i + base); }
  return { v, f };
}

// ─── Curvas y tubos ──────────────────────────────────────────────────────────

/** Catmull-Rom por los puntos de control, `n` muestras por tramo. */
export function curva(ctrl, n = 10) {
  const P = [ctrl[0], ...ctrl, ctrl.at(-1)];
  const out = [];
  for (let i = 1; i < P.length - 2; i++) {
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((a) => 0.5 * (2 * P[i][a] + (-P[i - 1][a] + P[i + 1][a]) * t + (2 * P[i - 1][a] - 5 * P[i][a] + 4 * P[i + 1][a] - P[i + 2][a]) * t2 + (-P[i - 1][a] + 3 * P[i][a] - 3 * P[i + 1][a] + P[i + 2][a]) * t3)));
    }
  }
  out.push(ctrl.at(-1));
  return out;
}

/**
 * Tubo a lo largo de una polilínea con marcos de transporte paralelo (sin giros).
 * `radio(s)` con s ∈ [0, 1] a lo largo del tubo. Tapas redondeadas en los dos extremos.
 */
export function tubo(pts, radio, lados = 10) {
  const r = typeof radio === 'function' ? radio : () => radio;
  const T = pts.map((p, i) => unit(sub(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)])));
  let N = unit(cruz(T[0], Math.abs(T[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const marcos = [];
  for (let i = 0; i < pts.length; i++) {
    if (i) { const b = cruz(T[i - 1], T[i]); if (largo(b) > 1e-8) { const eje = unit(b), ang = Math.acos(Math.max(-1, Math.min(1, punto(T[i - 1], T[i])))); N = rotar(N, eje, ang); } }
    marcos.push([N, cruz(T[i], N)]);
  }
  // Longitud acumulada para el radio.
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + dist(pts[i], pts[i - 1]));
  const total = L.at(-1) || 1;
  const v = [], f = [];
  const anillo = (c, N, B, rr) => { const base = v.length / 3; for (let k = 0; k < lados; k++) { const a = (k / lados) * Math.PI * 2; v.push(...suma(c, suma(por(N, Math.cos(a) * rr), por(B, Math.sin(a) * rr)))); } return base; };
  const anillos = [];
  // Tapa inicial: media esfera.
  const capas = 3;
  for (let c = capas; c >= 1; c--) { const ang = (c / (capas + 1)) * (Math.PI / 2), rr = r(0) * Math.cos(ang); anillos.push(anillo(suma(pts[0], por(T[0], -r(0) * Math.sin(ang))), marcos[0][0], marcos[0][1], rr)); }
  for (let i = 0; i < pts.length; i++) anillos.push(anillo(pts[i], marcos[i][0], marcos[i][1], r(L[i] / total)));
  const ult = pts.length - 1;
  for (let c = 1; c <= capas; c++) { const ang = (c / (capas + 1)) * (Math.PI / 2), rr = r(1) * Math.cos(ang); anillos.push(anillo(suma(pts[ult], por(T[ult], r(1) * Math.sin(ang))), marcos[ult][0], marcos[ult][1], rr)); }
  for (let i = 0; i + 1 < anillos.length; i++) for (let k = 0; k < lados; k++) {
    const a = anillos[i] + k, b = anillos[i] + ((k + 1) % lados), c = anillos[i + 1] + k, d = anillos[i + 1] + ((k + 1) % lados);
    f.push(a, b, c, b, d, c); // caras hacia fuera
  }
  // Cierre de las puntas.
  const p0 = v.length / 3; v.push(...suma(pts[0], por(T[0], -r(0)))); for (let k = 0; k < lados; k++) f.push(p0, anillos[0] + ((k + 1) % lados), anillos[0] + k);
  const p1 = v.length / 3; v.push(...suma(pts[ult], por(T[ult], r(1)))); const ua = anillos.at(-1); for (let k = 0; k < lados; k++) f.push(p1, ua + k, ua + ((k + 1) % lados));
  return { v, f };
}

function rotar(v, eje, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return suma(suma(por(v, c), por(cruz(eje, v), s)), por(eje, punto(eje, v) * (1 - c)));
}

/**
 * Lámina con grosor entre dos curvas (borde A y borde B, mismo número de puntos):
 * una cinta de `filas` divisiones entre ellas, extruida ±grosor/2 por su normal.
 */
export function lamina(bordeA, bordeB, grosor, filas = 6) {
  const n = bordeA.length;
  const rej = [];
  for (let j = 0; j <= filas; j++) rej.push(bordeA.map((a, i) => mezcla(a, bordeB[i], j / filas)));
  const normal = (j, i) => {
    const du = sub(rej[j][Math.min(i + 1, n - 1)], rej[j][Math.max(i - 1, 0)]);
    const dv = sub(rej[Math.min(j + 1, filas)][i], rej[Math.max(j - 1, 0)][i]);
    return unit(cruz(du, dv));
  };
  const v = [], f = [];
  const idx = (cara, j, i) => cara * (filas + 1) * n + j * n + i;
  for (const s of [1, -1]) for (let j = 0; j <= filas; j++) for (let i = 0; i < n; i++) v.push(...suma(rej[j][i], por(normal(j, i), (s * grosor) / 2)));
  for (let j = 0; j < filas; j++) for (let i = 0; i < n - 1; i++) {
    const a = idx(0, j, i), b = idx(0, j, i + 1), c = idx(0, j + 1, i), d = idx(0, j + 1, i + 1);
    f.push(a, b, c, b, d, c);
    const a2 = idx(1, j, i), b2 = idx(1, j, i + 1), c2 = idx(1, j + 1, i), d2 = idx(1, j + 1, i + 1);
    f.push(a2, c2, b2, b2, c2, d2);
  }
  // Bordes: cierre entre las dos caras.
  const coser = (lista) => { for (let k = 0; k + 1 < lista.length; k++) { const [j, i] = lista[k], [j2, i2] = lista[k + 1]; const a = idx(0, j, i), b = idx(0, j2, i2), c = idx(1, j, i), d = idx(1, j2, i2); f.push(a, c, b, b, c, d); } };
  coser(Array.from({ length: n }, (_, i) => [0, i]));
  coser(Array.from({ length: n }, (_, i) => [filas, n - 1 - i]));
  coser(Array.from({ length: filas + 1 }, (_, j) => [filas - j, 0]));
  coser(Array.from({ length: filas + 1 }, (_, j) => [j, n - 1]));
  return { v, f };
}

// ─── Reparación de superficies ───────────────────────────────────────────────

/** Lazos de borde (aristas de un solo triángulo), en orden, de mayor a menor. */
export function lazosDeBorde(m) {
  const cnt = new Map(), dir = new Map();
  for (let t = 0; t < m.f.length; t += 3) for (let k = 0; k < 3; k++) {
    const a = m.f[t + k], b = m.f[t + ((k + 1) % 3)];
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    cnt.set(key, (cnt.get(key) ?? 0) + 1);
    dir.set(key, [a, b]);
  }
  const sig = new Map();
  for (const [k, n] of cnt) if (n === 1) { const [a, b] = dir.get(k); sig.set(a, b); }
  const visto = new Set(), lazos = [];
  for (const s of sig.keys()) {
    if (visto.has(s)) continue;
    const l = [];
    for (let a = s; a !== undefined && !visto.has(a); a = sig.get(a)) { visto.add(a); l.push(a); }
    lazos.push(l);
  }
  return lazos.sort((a, b) => b.length - a.length);
}

/**
 * Tapa un agujero con la superficie que lo rodea: ajusta una cuádrica h(a, b) a
 * la pared en un radio `alcance` (en un marco local con la normal hacia fuera) y
 * cose anillos concéntricos desde el borde hasta el centro sobre ella.
 * `fuera`: un punto del interior del órgano (la normal apunta lejos de él).
 */
export function taparAgujero(m, lazo, fuera, alcance = 0.045, anillos = 6) {
  const borde = lazo.map((i) => vert(m, i));
  const c = por(borde.reduce(suma), 1 / borde.length);
  const n = unit(sub(c, fuera));
  const u = unit(cruz(n, Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const w = cruz(n, u);
  const local = (p) => { const d = sub(p, c); return [punto(d, u), punto(d, w), punto(d, n)]; };
  // Mínimos cuadrados: h = k0 + k1 a + k2 b + k3 a² + k4 ab + k5 b² (solo la pared de este lado).
  const filas = [];
  for (let i = 0; i < m.v.length / 3; i++) {
    const p = vert(m, i);
    if (dist(p, c) > alcance) continue;
    const [a, b, h] = local(p);
    if (h < -0.015) continue;
    filas.push([[1, a, b, a * a, a * b, b * b], h]);
  }
  const A = Array.from({ length: 6 }, () => new Array(6).fill(0)), y = new Array(6).fill(0);
  for (const [x, h] of filas) for (let r = 0; r < 6; r++) { y[r] += x[r] * h; for (let s = 0; s < 6; s++) A[r][s] += x[r] * x[s]; }
  const k = resolver(A, y);
  const altura = (a, b) => k[0] + k[1] * a + k[2] * b + k[3] * a * a + k[4] * a * b + k[5] * b * b;
  const v = [...m.v], f = [...m.f];
  const nb = borde.length;
  const ids = [lazo];
  for (let r = 1; r < anillos; r++) {
    const s = 1 - r / anillos, fila = [];
    for (const p of borde) {
      const [a, b] = local(p);
      const q = [a * s, b * s];
      fila.push(v.length / 3);
      v.push(...suma(suma(c, suma(por(u, q[0]), por(w, q[1]))), por(n, altura(q[0], q[1]))));
    }
    ids.push(fila);
  }
  const centro = v.length / 3;
  v.push(...suma(c, por(n, altura(0, 0))));
  // Orientación: la del triángulo vecino de cada arista del borde (el lazo va en el sentido de su cara).
  for (let r = 0; r + 1 < ids.length; r++) for (let j = 0; j < nb; j++) {
    const a = ids[r][j], b = ids[r][(j + 1) % nb], c2 = ids[r + 1][j], d = ids[r + 1][(j + 1) % nb];
    f.push(b, a, c2, b, c2, d);
  }
  const ult = ids.at(-1);
  for (let j = 0; j < nb; j++) f.push(ult[(j + 1) % nb], ult[j], centro);
  return { v, f };
}

function resolver(A, y) {
  const n = y.length, M = A.map((r, i) => [...r, y[i]]);
  for (let i = 0; i < n; i++) {
    let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
    [M[i], M[p]] = [M[p], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const k = M[r][i] / M[i][i]; for (let s = i; s <= n; s++) M[r][s] -= k * M[i][s]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}

/** Suavizado de Taubin (λ/μ, no encoge): quita arrugas finas y deja la forma. `fijos`: vértices que no se mueven. */
export function taubin(m, vueltas = 20, fijos = new Set(), lambda = 0.5, mu = -0.53, peso = () => 1) {
  const n = m.v.length / 3, ady = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < m.f.length; t += 3) for (let k = 0; k < 3; k++) { const a = m.f[t + k], b = m.f[t + ((k + 1) % 3)]; ady[a].add(b); ady[b].add(a); }
  let v = Float64Array.from(m.v);
  const w = Array.from({ length: n }, (_, i) => peso([m.v[i * 3], m.v[i * 3 + 1], m.v[i * 3 + 2]]));
  const paso = (f) => {
    const nv = Float64Array.from(v);
    for (let i = 0; i < n; i++) {
      if (fijos.has(i) || !ady[i].size || !w[i]) continue;
      const s = [0, 0, 0];
      for (const j of ady[i]) for (let a = 0; a < 3; a++) s[a] += v[j * 3 + a];
      for (let a = 0; a < 3; a++) nv[i * 3 + a] = v[i * 3 + a] + f * w[i] * (s[a] / ady[i].size - v[i * 3 + a]);
    }
    v = nv;
  };
  for (let k = 0; k < vueltas; k++) { paso(lambda); paso(mu); }
  return { v: [...v], f: m.f };
}
