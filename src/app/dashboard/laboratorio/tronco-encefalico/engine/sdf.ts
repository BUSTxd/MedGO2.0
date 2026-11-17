// Campo de distancias con signo (SDF) para modelar el tronco del encéfalo y el
// cerebelo con primitivas suaves, sin React ni three.js.
//
// Coordenadas en centímetros: +Y superior, +Z anterior (ventral), +X izquierda
// del paciente. Así, mirando de frente (cámara en +Z), la derecha del paciente
// queda a la izquierda de la pantalla, como en un atlas.
//
// Cada primitiva suma, resta o recorta el campo acumulado, en orden. La
// etiqueta de cada punto es la de la primitiva que manda allí: con ella se sabe
// qué estructura se toca y de qué color se pinta.

export type Vec = [number, number, number];

interface Base {
  /** Estructura a la que pertenece la superficie que genera. */
  id: string;
  /** Radio de la mezcla suave con lo anterior (0 = unión dura). */
  k?: number;
  op?: 'sumar' | 'restar' | 'recortar';
}

export interface Elipsoide extends Base {
  tipo: 'elipsoide';
  c: Vec;
  r: Vec;
  /** Giro en radianes alrededor de X, Y y Z (en ese orden). */
  giro?: Vec;
}

export interface Tubo extends Base {
  tipo: 'tubo';
  pts: Vec[];
  /** Radio en cada punto (se interpola a lo largo del segmento). */
  r: number[];
  /** Aplana la sección: factor sobre el eje dado (0,5 = la mitad de grueso). */
  aplanar?: { eje: Vec; f: number };
  /** Termina en un corte plano (perpendicular al último tramo). */
  cortado?: boolean;
  /** Etiqueta de la cara de corte. */
  idCorte?: string;
}

/** Columna barrida: sección elíptica que cambia con la altura. */
export interface Barrido extends Base {
  tipo: 'barrido';
  /** [y, cz, rx, rz] de abajo arriba. */
  tabla: Array<[number, number, number, number]>;
  /** Superelipse: 2 = elipse, > 2 más cuadrada. */
  n?: number;
}

/** Semiespacio que conserva lo que queda por debajo de un plano (cara de corte). */
export interface Plano extends Base {
  tipo: 'plano';
  /** Normal hacia fuera (lo que se quita). */
  n: Vec;
  /** Un punto del plano. */
  p: Vec;
}

/** Losa: caja redondeada (para fisuras y surcos). */
export interface Caja extends Base {
  tipo: 'caja';
  c: Vec;
  h: Vec;
  giro?: Vec;
  redondeo?: number;
}

/** Rombo extruido hacia atrás (fosa romboidea). */
export interface Rombo extends Base {
  tipo: 'rombo';
  /** Altura de los vértices superior e inferior y del ángulo lateral. */
  yArriba: number;
  yAbajo: number;
  yLateral: number;
  /** Semiancho en el ángulo lateral. */
  ancho: number;
  /** Profundidad del suelo (z del suelo) y hasta dónde llega hacia atrás. */
  zSuelo: number;
  /** Curvatura del suelo: se hunde en la línea media. */
  combado?: number;
}

export type Primitiva = Elipsoide | Tubo | Barrido | Plano | Caja | Rombo;

// ── Utilidades ───────────────────────────────────────────────────────────────

export const espejo = (v: Vec): Vec => [-v[0], v[1], v[2]];

/** Copia del lado derecho (x negativa) de una primitiva escrita para el izquierdo. */
export function reflejar<T extends Primitiva>(p: T): T {
  const q = JSON.parse(JSON.stringify(p)) as T;
  if (q.tipo === 'elipsoide') {
    q.c = espejo(q.c);
    if (q.giro) q.giro = [q.giro[0], -q.giro[1], -q.giro[2]];
  } else if (q.tipo === 'tubo') {
    q.pts = q.pts.map(espejo);
    if (q.aplanar) q.aplanar = { eje: espejo(q.aplanar.eje), f: q.aplanar.f };
  } else if (q.tipo === 'caja') {
    q.c = espejo(q.c);
    if (q.giro) q.giro = [q.giro[0], -q.giro[1], -q.giro[2]];
  } else if (q.tipo === 'plano') {
    q.n = espejo(q.n);
    q.p = espejo(q.p);
  }
  return q;
}

/** La primitiva y su gemela del otro lado. */
export const par = <T extends Primitiva>(p: T): T[] => [p, reflejar(p)];

function matriz(g: Vec): number[] {
  const [a, b, c] = g;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  // R = Rz · Ry · Rx; se guarda la inversa (transpuesta) para llevar el punto al marco local.
  const r = [
    cc * cb, cc * sb * sa - sc * ca, cc * sb * ca + sc * sa,
    sc * cb, sc * sb * sa + cc * ca, sc * sb * ca - cc * sa,
    -sb, cb * sa, cb * ca,
  ];
  return [r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]];
}

const hyp = (a: number, b: number) => Math.sqrt(a * a + b * b);
const largo3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

// ── Primitivas compiladas ────────────────────────────────────────────────────

interface Compilada {
  id: string;
  op: 'sumar' | 'restar' | 'recortar';
  k: number;
  /** Caja donde la primitiva puede cambiar el campo (ya con margen). */
  min: Vec;
  max: Vec;
  global: boolean;
  d: (x: number, y: number, z: number) => number;
  /** Para tubos cortados: distancia firmada al plano del corte (para etiquetar la cara). */
  dCorte?: (x: number, y: number, z: number) => number;
  idCorte?: string;
}

function compilarElipsoide(p: Elipsoide): Compilada['d'] {
  const [cx, cy, cz] = p.c;
  const [rx, ry, rz] = p.r;
  const m = p.giro ? matriz(p.giro) : null;
  return (x, y, z) => {
    let px = x - cx, py = y - cy, pz = z - cz;
    if (m) {
      const qx = m[0] * px + m[1] * py + m[2] * pz;
      const qy = m[3] * px + m[4] * py + m[5] * pz;
      const qz = m[6] * px + m[7] * py + m[8] * pz;
      px = qx; py = qy; pz = qz;
    }
    const k0 = largo3(px / rx, py / ry, pz / rz);
    const k1 = largo3(px / (rx * rx), py / (ry * ry), pz / (rz * rz));
    if (k1 < 1e-9) return -Math.min(rx, ry, rz);
    return (k0 * (k0 - 1)) / k1;
  };
}

function compilarTubo(p: Tubo): { d: Compilada['d']; dCorte?: Compilada['d'] } {
  const n = p.pts.length;
  const segs: Array<{ a: Vec; ba: Vec; bb: number; ra: number; rb: number }> = [];
  for (let i = 0; i < n - 1; i++) {
    const a = p.pts[i];
    const b = p.pts[i + 1];
    const ba: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    segs.push({ a, ba, bb: ba[0] * ba[0] + ba[1] * ba[1] + ba[2] * ba[2], ra: p.r[i], rb: p.r[i + 1] });
  }
  let ax: Vec | null = null;
  let f = 1;
  if (p.aplanar) {
    const e = p.aplanar.eje;
    const l = largo3(e[0], e[1], e[2]);
    ax = [e[0] / l, e[1] / l, e[2] / l];
    f = p.aplanar.f;
  }
  const d: Compilada['d'] = (x, y, z) => {
    let best = Infinity;
    for (const s of segs) {
      const px = x - s.a[0], py = y - s.a[1], pz = z - s.a[2];
      let t = (px * s.ba[0] + py * s.ba[1] + pz * s.ba[2]) / s.bb;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      let qx = px - s.ba[0] * t, qy = py - s.ba[1] * t, qz = pz - s.ba[2] * t;
      if (ax) {
        // Componente del vector radial sobre el eje de aplanado, estirada.
        const c = qx * ax[0] + qy * ax[1] + qz * ax[2];
        const extra = c * (1 / f - 1);
        qx += ax[0] * extra; qy += ax[1] * extra; qz += ax[2] * extra;
      }
      const r = s.ra + (s.rb - s.ra) * t;
      const dd = (largo3(qx, qy, qz) - r) * (ax ? f : 1);
      if (dd < best) best = dd;
    }
    return best;
  };
  if (!p.cortado) return { d };
  // Corte plano en el extremo final, perpendicular al último tramo.
  const b = p.pts[n - 1];
  const a = p.pts[n - 2];
  const l = largo3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const t: Vec = [(b[0] - a[0]) / l, (b[1] - a[1]) / l, (b[2] - a[2]) / l];
  const dCorte: Compilada['d'] = (x, y, z) => (x - b[0]) * t[0] + (y - b[1]) * t[1] + (z - b[2]) * t[2];
  return { d: (x, y, z) => Math.max(d(x, y, z), dCorte(x, y, z)), dCorte };
}

function compilarBarrido(p: Barrido): Compilada['d'] {
  const tab = p.tabla;
  const n = p.n ?? 2;
  const y0 = tab[0][0];
  const y1 = tab[tab.length - 1][0];
  // Tabla fina precalculada (cada 0,01 cm): evita buscar el tramo en cada punto.
  const PASO = 0.01;
  const m = Math.ceil((y1 - y0) / PASO) + 1;
  const CZ = new Float64Array(m), RX = new Float64Array(m), RZ = new Float64Array(m);
  for (let q = 0, i = 0; q < m; q++) {
    const y = Math.min(y0 + q * PASO, y1);
    while (i < tab.length - 2 && tab[i + 1][0] < y) i++;
    const [ya, cza, rxa, rza] = tab[i];
    const [yb, czb, rxb, rzb] = tab[i + 1];
    let u = (y - ya) / (yb - ya || 1);
    u = u * u * (3 - 2 * u);
    CZ[q] = cza + (czb - cza) * u;
    RX[q] = rxa + (rxb - rxa) * u;
    RZ[q] = rza + (rzb - rza) * u;
  }
  return (x, y, z) => {
    const q = Math.round(((y < y0 ? y0 : y > y1 ? y1 : y) - y0) / PASO);
    const rx = RX[q], rz = RZ[q];
    const qx = (x < 0 ? -x : x) / rx;
    const dz = z - CZ[q];
    const qz = (dz < 0 ? -dz : dz) / rz;
    let d2: number;
    if (n === 2) {
      const k0 = Math.sqrt(qx * qx + qz * qz);
      const ax = qx / rx, az = qz / rz;
      const k1 = Math.sqrt(ax * ax + az * az);
      d2 = k1 < 1e-9 ? -Math.min(rx, rz) : (k0 * (k0 - 1)) / k1;
    } else {
      const s = Math.pow(Math.pow(qx, n) + Math.pow(qz, n), 1 / n);
      d2 = (s - 1) * (rx < rz ? rx : rz);
    }
    const dy = y0 - y > y - y1 ? y0 - y : y - y1;
    if (dy > 0) return d2 > 0 ? Math.sqrt(d2 * d2 + dy * dy) : dy;
    return d2;
  };
}

function compilarCaja(p: Caja): Compilada['d'] {
  const m = p.giro ? matriz(p.giro) : null;
  const rr = p.redondeo ?? 0;
  const [hx, hy, hz] = p.h;
  return (x, y, z) => {
    let px = x - p.c[0], py = y - p.c[1], pz = z - p.c[2];
    if (m) {
      const qx = m[0] * px + m[1] * py + m[2] * pz;
      const qy = m[3] * px + m[4] * py + m[5] * pz;
      const qz = m[6] * px + m[7] * py + m[8] * pz;
      px = qx; py = qy; pz = qz;
    }
    const qx = Math.abs(px) - hx + rr, qy = Math.abs(py) - hy + rr, qz = Math.abs(pz) - hz + rr;
    const fuera = largo3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0));
    return fuera + Math.min(Math.max(qx, qy, qz), 0) - rr;
  };
}

function compilarRombo(p: Rombo): Compilada['d'] {
  const comb = p.combado ?? 0;
  return (x, y, z) => {
    // Semiancho del rombo a la altura y: crece de los vértices al ángulo lateral.
    const ax = Math.abs(x);
    let w: number;
    if (y >= p.yLateral) w = p.ancho * (p.yArriba - y) / (p.yArriba - p.yLateral);
    else w = p.ancho * (y - p.yAbajo) / (p.yLateral - p.yAbajo);
    // Distancia aproximada al borde del rombo en el plano xy.
    const pend = y >= p.yLateral ? p.ancho / (p.yArriba - p.yLateral) : p.ancho / (p.yLateral - p.yAbajo);
    const dxy = (ax - w) / Math.sqrt(1 + pend * pend);
    // El suelo se comba: más hondo en la línea media que en los bordes.
    const suelo = p.zSuelo + comb * (1 - Math.min(ax / Math.max(p.ancho, 1e-3), 1) ** 2);
    const dz = z - suelo; // > 0: dentro del tejido (por delante del suelo)
    return Math.max(dxy, dz);
  };
}

function caja(p: Primitiva, margen: number): { min: Vec; max: Vec; global: boolean } {
  const m = margen + (p.k ?? 0);
  if (p.tipo === 'elipsoide') {
    const r = Math.max(...p.r) + m;
    return { min: [p.c[0] - r, p.c[1] - r, p.c[2] - r], max: [p.c[0] + r, p.c[1] + r, p.c[2] + r], global: false };
  }
  if (p.tipo === 'tubo') {
    const r = Math.max(...p.r) + m;
    const min: Vec = [Infinity, Infinity, Infinity];
    const max: Vec = [-Infinity, -Infinity, -Infinity];
    for (const q of p.pts) for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], q[i] - r); max[i] = Math.max(max[i], q[i] + r); }
    return { min, max, global: false };
  }
  if (p.tipo === 'barrido') {
    let rx = 0, z0 = Infinity, z1 = -Infinity;
    for (const [, cz, a, b] of p.tabla) { rx = Math.max(rx, a); z0 = Math.min(z0, cz - b); z1 = Math.max(z1, cz + b); }
    return {
      min: [-rx - m, p.tabla[0][0] - m, z0 - m],
      max: [rx + m, p.tabla[p.tabla.length - 1][0] + m, z1 + m],
      global: false,
    };
  }
  if (p.tipo === 'caja') {
    const r = Math.max(...p.h) * 1.75 + m;
    return { min: [p.c[0] - r, p.c[1] - r, p.c[2] - r], max: [p.c[0] + r, p.c[1] + r, p.c[2] + r], global: false };
  }
  if (p.tipo === 'rombo') {
    return { min: [-p.ancho - m, p.yAbajo - m, -50], max: [p.ancho + m, p.yArriba + m, p.zSuelo + Math.max(p.combado ?? 0, 0) + m], global: false };
  }
  return { min: [-1e9, -1e9, -1e9], max: [1e9, 1e9, 1e9], global: true };
}

function compilar(p: Primitiva, margen: number): Compilada {
  let d: Compilada['d'];
  let dCorte: Compilada['d'] | undefined;
  if (p.tipo === 'elipsoide') d = compilarElipsoide(p);
  else if (p.tipo === 'tubo') ({ d, dCorte } = compilarTubo(p));
  else if (p.tipo === 'barrido') d = compilarBarrido(p);
  else if (p.tipo === 'caja') d = compilarCaja(p);
  else if (p.tipo === 'rombo') d = compilarRombo(p);
  else {
    const l = largo3(...p.n);
    const n: Vec = [p.n[0] / l, p.n[1] / l, p.n[2] / l];
    d = (x, y, z) => (x - p.p[0]) * n[0] + (y - p.p[1]) * n[1] + (z - p.p[2]) * n[2];
  }
  return {
    id: p.id,
    op: p.op ?? 'sumar',
    k: p.k ?? 0,
    ...caja(p, margen),
    d,
    dCorte,
    idCorte: p.tipo === 'tubo' ? p.idCorte : undefined,
  };
}

// ── Campo ────────────────────────────────────────────────────────────────────

/** Mezcla suave (polinómica) de dos distancias. */
function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

export interface Campo {
  /** Distancia firmada (negativa dentro). */
  d: (x: number, y: number, z: number) => number;
  /** Distancia con la etiqueta de la estructura que manda en ese punto. */
  conEtiqueta: (x: number, y: number, z: number) => { d: number; id: string };
  /** Igual que d, pero solo con las primitivas que pueden actuar dentro de la caja. */
  local: (min: Vec, max: Vec) => (x: number, y: number, z: number) => number;
  /** Caja que encierra todo lo que suma. */
  limites: { min: Vec; max: Vec };
}

const LEJOS = 1e3;

export function crearCampo(prims: Primitiva[], margen = 0.12): Campo {
  const lista = prims.map((p) => compilar(p, margen));

  const min: Vec = [Infinity, Infinity, Infinity];
  const max: Vec = [-Infinity, -Infinity, -Infinity];
  for (const p of lista) {
    if (p.op !== 'sumar' || p.global) continue;
    for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], p.min[i]); max[i] = Math.max(max[i], p.max[i]); }
  }

  // Rejilla espacial: cada celda guarda (en orden) las primitivas que pueden
  // actuar en ella, para no mirar las ~80 en cada punto.
  const G = 0.3;
  const o: Vec = [min[0] - G, min[1] - G, min[2] - G];
  const n = [0, 1, 2].map((i) => Math.ceil((max[i] - o[i] + G) / G));
  const celdas: Compilada[][] = new Array(n[0] * n[1] * n[2]);
  const globales = lista.filter((p) => p.global);
  for (let k = 0; k < n[2]; k++) for (let j = 0; j < n[1]; j++) for (let i = 0; i < n[0]; i++) {
    const a: Vec = [o[0] + i * G, o[1] + j * G, o[2] + k * G];
    celdas[i + n[0] * (j + n[1] * k)] = lista.filter((p) => p.global
      || !(p.max[0] < a[0] || p.max[1] < a[1] || p.max[2] < a[2] || p.min[0] > a[0] + G || p.min[1] > a[1] + G || p.min[2] > a[2] + G));
  }
  const enCelda = (x: number, y: number, z: number): Compilada[] => {
    const i = Math.floor((x - o[0]) / G), j = Math.floor((y - o[1]) / G), k = Math.floor((z - o[2]) / G);
    if (i < 0 || j < 0 || k < 0 || i >= n[0] || j >= n[1] || k >= n[2]) return globales;
    return celdas[i + n[0] * (j + n[1] * k)];
  };

  const evaluar = (x: number, y: number, z: number): number => {
    const ps = enCelda(x, y, z);
    let acc = LEJOS;
    for (let q = 0; q < ps.length; q++) {
      const p = ps[q];
      if (!p.global && (x < p.min[0] || y < p.min[1] || z < p.min[2] || x > p.max[0] || y > p.max[1] || z > p.max[2])) continue;
      const v = p.d(x, y, z);
      if (p.op === 'sumar') acc = smin(acc, v, p.k);
      else if (p.op === 'restar') acc = -smin(-acc, v, p.k);
      else acc = -smin(-acc, -v, p.k);
    }
    return acc;
  };

  const conEtiqueta = (x: number, y: number, z: number) => {
    let acc = LEJOS;
    let id = '';
    for (const p of enCelda(x, y, z)) {
      if (!p.global && (x < p.min[0] || y < p.min[1] || z < p.min[2] || x > p.max[0] || y > p.max[1] || z > p.max[2])) continue;
      const v = p.d(x, y, z);
      if (p.op === 'sumar') {
        if (v < acc) {
          id = p.id;
          // En un tubo cortado, la cara plana lleva su propia etiqueta.
          if (p.dCorte && p.idCorte && Math.abs(v - p.dCorte(x, y, z)) < 0.012) id = p.idCorte;
        }
        acc = smin(acc, v, p.k);
      } else if (p.op === 'restar') {
        if (-v > acc && p.id) id = p.id;
        acc = -smin(-acc, v, p.k);
      } else {
        if (v > acc && p.id) id = p.id;
        acc = -smin(-acc, -v, p.k);
      }
    }
    return { d: acc, id };
  };

  return {
    d: evaluar,
    conEtiqueta,
    local: () => evaluar,
    limites: { min, max },
  };
}
