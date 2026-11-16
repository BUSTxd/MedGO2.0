// Geometría del nefrón dibujado: un nefrón yuxtamedular de asa larga en un
// lienzo fijo de 1200 × 1000 (corteza arriba, papila abajo) y, de fondo, un
// nefrón cortical de asa corta que vacía en el mismo colector.
//
// Cada tramo es una línea media suave (Catmull-Rom) muestreada cada ≈ 2 u; el
// tubo se pinta como dos trazos (pared y luz). Las células («cuentas») salen
// de recortar la pared a ambos lados de la línea media.

import { SEGMENTOS, TRAMOS } from '@/lib/data/nefron/segmentos.ts';
import type { CelulaId, TramoId } from '@/lib/data/nefron/tipos.ts';

export const ANCHO = 1200;
export const ALTO = 1000;

export type P = [number, number];

/** Límites de las zonas del riñón (y). */
export const ZONAS = {
  capsula: 8,
  corticomedular: 390,
  franja: 520,
  medulaInterna: 680,
  papila: 962,
} as const;

/** Glomérulo del nefrón principal. */
export const GLOMERULO = { c: [380, 220] as P, r: 60, ovillo: 44, polo: [380, 160] as P, urinario: [380, 280] as P };
export const GLOMERULO_CORTICAL = { c: [1080, 70] as P, r: 32, ovillo: 23 };

export interface Muestra {
  p: P;
  /** Normal unitaria (a la izquierda del sentido del flujo). */
  n: P;
  /** Distancia acumulada desde el inicio del tramo. */
  s: number;
}

export interface Tramo {
  id: TramoId;
  muestras: Muestra[];
  largo: number;
  /** Diámetro exterior del tubo y de la luz (u). */
  ancho: number;
  luz: number;
  /** Largo de cada célula sobre la pared. */
  paso: number;
  /** Dónde va el rótulo del tramo y hacia dónde se alinea. */
  rotulo: { p: P; ancla: 'start' | 'middle' | 'end' };
  /** Caja que lo contiene (para encuadrar la cámara). */
  caja: Caja;
}

export interface Caja { x0: number; y0: number; x1: number; y1: number }

// ── Puntos de control (dibujados a mano sobre el lienzo de 1200 × 1000) ──
const PUNTOS: Record<TramoId, P[]> = {
  proximal: [
    [380, 280], [362, 304], [316, 314], [266, 294], [232, 318], [244, 362], [300, 374],
    [360, 352], [418, 320], [470, 302], [512, 330], [552, 346], [585, 330],
  ],
  recto: [[585, 330], [590, 400], [590, 470], [590, 520]],
  descendente: [[590, 520], [590, 700], [590, 880], [596, 928], [620, 950]],
  'ascendente-delgada': [[620, 950], [644, 930], [650, 880], [650, 780], [650, 690]],
  gruesa: [
    [650, 690], [652, 520], [650, 330], [645, 236], [625, 176], [585, 136], [530, 116], [470, 115], [420, 128],
  ],
  distal: [
    [420, 128], [404, 100], [430, 70], [500, 58], [570, 72], [630, 55], [700, 62], [745, 95], [735, 145], [762, 186], [810, 180], [830, 140],
  ],
  conector: [[830, 140], [848, 112], [866, 100], [880, 100]],
  'colector-cortical': [[880, 100], [880, 240], [880, 390]],
  'colector-medular': [[880, 390], [880, 600], [880, 800], [880, 968]],
};

const MEDIDAS: Record<TramoId, { ancho: number; luz: number; paso: number }> = {
  proximal: { ancho: 28, luz: 12, paso: 11 },
  recto: { ancho: 26, luz: 11, paso: 11 },
  descendente: { ancho: 13, luz: 8, paso: 9 },
  'ascendente-delgada': { ancho: 13, luz: 8, paso: 9 },
  gruesa: { ancho: 22, luz: 10, paso: 9 },
  distal: { ancho: 22, luz: 11, paso: 10 },
  conector: { ancho: 22, luz: 12, paso: 11 },
  'colector-cortical': { ancho: 30, luz: 16, paso: 12 },
  'colector-medular': { ancho: 34, luz: 18, paso: 12 },
};

const ROTULOS: Record<TramoId, Tramo['rotulo']> = {
  proximal: { p: [212, 400], ancla: 'start' },
  recto: { p: [578, 470], ancla: 'end' },
  descendente: { p: [578, 800], ancla: 'end' },
  'ascendente-delgada': { p: [664, 830], ancla: 'start' },
  gruesa: { p: [664, 560], ancla: 'start' },
  distal: { p: [612, 36], ancla: 'middle' },
  conector: { p: [836, 82], ancla: 'end' },
  'colector-cortical': { p: [904, 300], ancla: 'start' },
  'colector-medular': { p: [904, 700], ancla: 'start' },
};

/** Curva de Catmull-Rom por los puntos, muestreada cada `paso` unidades. */
export function curva(puntos: P[], paso = 2): Muestra[] {
  const pts = [puntos[0], ...puntos, puntos[puntos.length - 1]];
  const crudo: P[] = [];
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    const largo = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const n = Math.max(2, Math.ceil(largo / (paso / 2)));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      crudo.push([x, y]);
    }
  }
  crudo.push(puntos[puntos.length - 1]);
  // Remuestreo uniforme por largo de arco.
  const acum = [0];
  for (let i = 1; i < crudo.length; i++) acum.push(acum[i - 1] + Math.hypot(crudo[i][0] - crudo[i - 1][0], crudo[i][1] - crudo[i - 1][1]));
  const total = acum[acum.length - 1];
  const n = Math.max(2, Math.round(total / paso));
  const out: Muestra[] = [];
  let j = 0;
  for (let k = 0; k <= n; k++) {
    const s = (k / n) * total;
    while (j < acum.length - 2 && acum[j + 1] < s) j++;
    const t = acum[j + 1] === acum[j] ? 0 : (s - acum[j]) / (acum[j + 1] - acum[j]);
    const p: P = [crudo[j][0] + (crudo[j + 1][0] - crudo[j][0]) * t, crudo[j][1] + (crudo[j + 1][1] - crudo[j][1]) * t];
    out.push({ p, n: [0, 0], s });
  }
  for (let k = 0; k < out.length; k++) {
    const a = out[Math.max(0, k - 1)].p;
    const b = out[Math.min(out.length - 1, k + 1)].p;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    out[k].n = [dy / l, -dx / l];
  }
  return out;
}

function cajaDe(ms: Muestra[], margen: number): Caja {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const m of ms) {
    x0 = Math.min(x0, m.p[0]); y0 = Math.min(y0, m.p[1]);
    x1 = Math.max(x1, m.p[0]); y1 = Math.max(y1, m.p[1]);
  }
  return { x0: x0 - margen, y0: y0 - margen, x1: x1 + margen, y1: y1 + margen };
}

export const TRAMOS_GEO: Record<TramoId, Tramo> = Object.fromEntries(TRAMOS.map((id) => {
  const muestras = curva(PUNTOS[id]);
  const m = MEDIDAS[id];
  return [id, {
    id, muestras, largo: muestras[muestras.length - 1].s, ...m, rotulo: ROTULOS[id], caja: cajaDe(muestras, m.ancho + 20),
  }];
})) as Record<TramoId, Tramo>;

/** El recorrido completo del filtrado, del polo urinario a la papila. */
export interface Ruta {
  muestras: Array<Muestra & { tramo: number; u: number; luz: number }>;
  largo: number;
  /** Distancia acumulada al inicio de cada tramo (y al final del último). */
  cortes: number[];
}

export const RUTA: Ruta = (() => {
  const muestras: Ruta['muestras'] = [];
  const cortes = [0];
  let base = 0;
  TRAMOS.forEach((id, i) => {
    const t = TRAMOS_GEO[id];
    t.muestras.forEach((m, k) => {
      if (i > 0 && k === 0) return; // el primero repite el último del tramo anterior
      muestras.push({ ...m, s: base + m.s, tramo: i, u: m.s / t.largo, luz: t.luz });
    });
    base += t.largo;
    cortes.push(base);
  });
  return { muestras, largo: base, cortes };
})();

/** Punto de la ruta a una distancia s (interpolado). */
export function enRuta(s: number): { p: P; n: P; tramo: number; u: number; luz: number } {
  const ms = RUTA.muestras;
  const L = RUTA.largo;
  const x = Math.min(L, Math.max(0, s));
  // Búsqueda binaria por s.
  let a = 0; let b = ms.length - 1;
  while (b - a > 1) {
    const m = (a + b) >> 1;
    if (ms[m].s <= x) a = m; else b = m;
  }
  const A = ms[a]; const B = ms[b];
  const t = B.s === A.s ? 0 : (x - A.s) / (B.s - A.s);
  return {
    p: [A.p[0] + (B.p[0] - A.p[0]) * t, A.p[1] + (B.p[1] - A.p[1]) * t],
    n: A.n,
    tramo: A.tramo,
    u: A.tramo === B.tramo ? A.u + (B.u - A.u) * t : A.u,
    luz: A.luz,
  };
}

/** Polilínea SVG («x,y x,y …») de una lista de muestras. */
export function polilinea(ms: Array<{ p: P }>): string {
  return ms.map((m) => `${m.p[0].toFixed(1)},${m.p[1].toFixed(1)}`).join(' ');
}

// ── Células sobre la pared ──
export interface Cuenta {
  clave: string;
  tramo: TramoId;
  tipo: CelulaId;
  lado: 1 | -1;
  /** Polígono de la célula y su núcleo. */
  poli: string;
  nucleo: P;
  centro: P;
}

function tipoEn(id: TramoId, i: number): CelulaId {
  const sec = SEGMENTOS[id].secuencia;
  return sec[i % sec.length];
}

export const CUENTAS: Record<TramoId, Cuenta[]> = Object.fromEntries(TRAMOS.map((id) => {
  const t = TRAMOS_GEO[id];
  const out: Cuenta[] = [];
  const n = Math.max(1, Math.floor(t.largo / t.paso));
  const paso = t.largo / n;
  const ms = t.muestras;
  const at = (s: number) => {
    let k = Math.round((s / t.largo) * (ms.length - 1));
    k = Math.min(ms.length - 1, Math.max(0, k));
    return ms[k];
  };
  const gc = GLOMERULO.c;
  for (let i = 0; i < n; i++) {
    const a = at(i * paso + 0.6);
    const b = at((i + 1) * paso - 0.6);
    const m = at((i + 0.5) * paso);
    for (const lado of [1, -1] as const) {
      const ri = (t.luz / 2) * lado;
      const ro = (t.ancho / 2) * lado;
      const q = (mm: Muestra, r: number): P => [mm.p[0] + mm.n[0] * r, mm.p[1] + mm.n[1] * r];
      const pts = [q(a, ri), q(b, ri), q(b, ro), q(a, ro)];
      const rm = (ri + ro) / 2;
      let tipo = tipoEn(id, i + (lado === 1 ? 0 : 3));
      // La mácula densa: las últimas células de la rama gruesa del lado que mira al glomérulo.
      if (id === 'gruesa' && i >= n - 4) {
        const otro = q(m, -ro);
        const este = q(m, ro);
        const cerca = Math.hypot(este[0] - gc[0], este[1] - gc[1]) < Math.hypot(otro[0] - gc[0], otro[1] - gc[1]);
        if (cerca) tipo = 'macula-densa';
      }
      out.push({
        clave: `${id}-${i}-${lado}`,
        tramo: id,
        tipo,
        lado,
        poli: pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '),
        nucleo: q(m, rm),
        centro: q(m, rm),
      });
    }
  }
  return [id, out];
})) as Record<TramoId, Cuenta[]>;

/** Una cuenta representativa de cada tipo de célula (para volar a ella). */
export function cuentaDe(tipo: CelulaId): Cuenta | null {
  if (tipo === 'barrera') return null;
  for (const id of TRAMOS) {
    const lista = CUENTAS[id].filter((c) => c.tipo === tipo);
    if (lista.length) return lista[Math.floor(lista.length / 2)];
  }
  return null;
}

export function cajaGlomerulo(): Caja {
  const { c, r } = GLOMERULO;
  return { x0: c[0] - r - 50, y0: c[1] - r - 60, x1: c[0] + r + 50, y1: c[1] + r + 40 };
}

// ── Vasos ──
export const VASOS = {
  arteriaArcuata: [[20, 384], [1180, 384]] as P[],
  venaArcuata: [[20, 398], [1180, 398]] as P[],
  radiada: [[120, 384], [118, 250], [116, 120], [114, 24]] as P[],
  aferente: [[118, 150], [200, 146], [280, 150], [334, 160], [352, 170]] as P[],
  eferente: [[408, 170], [448, 168], [494, 192], [530, 240], [544, 300], [546, 390]] as P[],
  rectaDesc: [[546, 390], [548, 620], [550, 900], [560, 944], [600, 966], [660, 968], [700, 940]] as P[],
  rectaAsc: [[700, 940], [704, 700], [706, 500], [708, 398]] as P[],
  capilares: [
    [[494, 192], [470, 240], [430, 300], [360, 330], [290, 340], [250, 330]],
    [[530, 240], [600, 220], [690, 200], [760, 220], [820, 210]],
    [[544, 300], [610, 280], [700, 300], [790, 280], [850, 300]],
  ] as P[][],
};

// ── Nefrón cortical (de fondo) ──
export const CORTICAL: P[][] = [
  // proximal + recto
  [[1080, 102], [1058, 116], [1026, 134], [992, 154], [1000, 192], [1040, 202], [1070, 182], [1090, 222], [1095, 280], [1095, 430]],
  // descendente + vuelta
  [[1095, 430], [1095, 500], [1110, 522], [1125, 502]],
  // rama gruesa hasta su glomérulo
  [[1125, 502], [1125, 300], [1130, 180], [1120, 112], [1102, 88]],
  // distal + conector
  [[1102, 88], [1120, 50], [1080, 26], [1020, 30], [975, 56], [950, 100], [930, 140], [905, 165], [882, 172]],
];
/** Otros conectores que llegan al colector por arriba. */
export const OTROS_CONECTORES: P[][] = [
  [[880, 20], [880, 100]],
  [[840, 14], [860, 40], [878, 64]],
];

export { TRAMOS };
