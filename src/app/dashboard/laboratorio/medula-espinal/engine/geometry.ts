// Generación procedural de geometría para el corte transversal de la médula espinal.
// Todas las formas viven en el plano XY (Y+ dorsal, Y- ventral, X lateral).
//
// La forma de cada nivel (`LEVELS[nivel].corte`) está calcada de Gray's Anatomy
// fig. 666 y se compara con ella con `npm run vista:medula`.
//
// Arquitectura clave: la sustancia gris se construye como un conjunto de
// sub-regiones que coinciden EXACTAMENTE con las láminas de Rexed. La "mariposa"
// gris no es más que esas mismas regiones pintadas de gris; al activar el modo
// láminas se recolorean. Las regiones vecinas comparten los mismos puntos de
// borde, así que no quedan huecos ni solapes.

import * as THREE from 'three';
import {
  LEVELS, TRACT_LIST, tractLayersAt,
  type LevelId, type LaminaGroupId, type TractId, type SomaLayer, type Pt, type Asta,
} from './anatomy.ts';

// ── Configuración de extrusión ───────────────────────────────────────────────
// Profundidades escalonadas para que cada capa se vea por delante de la anterior
// sin z-fighting: blanca (fondo) < tractos < gris < canal.

export const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.16,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelSegments: 1,
};

export const EXTRUDE_GRAY: THREE.ExtrudeGeometryOptions = {
  depth: 0.20,
  bevelEnabled: false,
};

export const EXTRUDE_FLAT: THREE.ExtrudeGeometryOptions = {
  depth: 0.05,
  bevelEnabled: false,
};

// Posiciones Z de cada capa (la cámara mira desde +Z).
export const Z = {
  white: 0,
  tracts: 0.18,
  gray: 0.06,
  canal: 0.27,
  overlay: 0.33,
};

// ── Utilidades ───────────────────────────────────────────────────────────────

function deg2rad(d: number) { return (d * Math.PI) / 180; }
function v2(x: number, y: number) { return new THREE.Vector2(x, y); }

function shapeFrom(pts: THREE.Vector2[]): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i].x, pts[i].y);
  s.closePath();
  return s;
}

/** Espejo respecto al eje Y (x → -x), conservando el sentido de giro. */
function mirrorPts(pts: THREE.Vector2[]): THREE.Vector2[] {
  return pts.map((p) => v2(-p.x, p.y)).reverse();
}

/** Puntos equiespaciados (por longitud) de una curva suave que pasa por `pts`. */
function sampleSpline(pts: THREE.Vector2[], n: number): THREE.Vector2[] {
  if (pts.length === 2) {
    return Array.from({ length: n + 1 }, (_, i) => pts[0].clone().lerp(pts[1], i / n));
  }
  const c = new THREE.SplineCurve(pts);
  return Array.from({ length: n + 1 }, (_, i) => c.getPointAt(i / n));
}

const corteDe = (id: LevelId) => LEVELS[id].corte;

// ── Contorno de la médula ────────────────────────────────────────────────────
// Superelipse con exponente propio en la mitad dorsal y en la ventral. El
// ángulo θ se mide desde dorsal, en sentido horario (θ = 90° es lateral derecho).

/** Radio normalizado del contorno liso (sin surcos) en el ángulo θ (grados). */
function contornoRadioNorm(levelId: LevelId, thetaDeg: number): number {
  const c = corteDe(levelId);
  const t = deg2rad(thetaDeg);
  const s = Math.abs(Math.sin(t));
  const k = Math.cos(t);
  const n = k >= 0 ? c.nD : c.nV;
  return 1 / Math.pow(Math.pow(s, n) + Math.pow(Math.abs(k) / c.ry, n), 1 / n);
}

/** y dorsal del contorno liso a una x dada (normalizado). */
function contornoYDorsal(levelId: LevelId, x: number): number {
  const c = corteDe(levelId);
  const ax = Math.min(Math.abs(x), 1);
  return c.ry * Math.pow(Math.max(1 - Math.pow(ax, c.nD), 0), 1 / c.nD);
}

const N_CONTORNO = 120; // puntos por media vuelta

/** Media vuelta lisa (derecha), de dorsal a ventral, normalizada. */
function mediaVueltaLisa(levelId: LevelId): THREE.Vector2[] {
  const out: THREE.Vector2[] = [];
  for (let i = 0; i <= N_CONTORNO; i++) {
    const th = (180 * i) / N_CONTORNO;
    const r = contornoRadioNorm(levelId, th);
    const t = deg2rad(th);
    out.push(v2(r * Math.sin(t), r * Math.cos(t)));
  }
  return out;
}

/**
 * Contorno real (normalizado, lado derecho, de dorsal a ventral): con el surco
 * medio posterior y la fisura media anterior como muesca.
 */
function mediaVueltaReal(levelId: LevelId): THREE.Vector2[] {
  const c = corteDe(levelId);
  const lisa = mediaVueltaLisa(levelId);

  // Surco medio posterior: hundimiento suave junto a la línea media.
  const anchoSurco = 0.07;
  for (const p of lisa) {
    if (p.y > 0 && p.x < anchoSurco) {
      const u = 1 - p.x / anchoSurco;
      p.y -= c.surco * u * u;
    }
  }

  // Fisura media anterior: se corta la media vuelta donde el borde ventral
  // llega al labio y se baja por la fisura hasta su fondo.
  const fw = c.fisura.ancho;
  const labio = fw * 2.6;
  const out: THREE.Vector2[] = [];
  let yLabio = -c.ry;
  for (const p of lisa) {
    if (p.y < 0 && p.x < labio) { yLabio = p.y; break; }
    out.push(p);
  }
  // Labio redondeado que se mete en la fisura.
  out.push(v2(fw * 1.6, yLabio + fw * 0.4));
  out.push(v2(fw * 1.05, yLabio + fw * 1.4));
  // Paredes de la fisura y fondo redondeado.
  const pasos = 8;
  const yTope = c.fisura.fondo - fw; // centro del fondo redondeado
  for (let i = 1; i <= pasos; i++) {
    const y = yLabio + fw * 1.4 + ((yTope - (yLabio + fw * 1.4)) * i) / pasos;
    out.push(v2(fw, y));
  }
  for (let i = 1; i <= 6; i++) {
    const a = (Math.PI / 2) * (i / 6);
    out.push(v2(fw * Math.cos(a), yTope + fw * Math.sin(a)));
  }
  return out;
}

/** Contorno de la médula en unidades de escena (vuelta completa, cerrado). */
export function contornoMedula(levelId: LevelId): THREE.Vector2[] {
  const rx = corteDe(levelId).rx;
  const der = mediaVueltaReal(levelId).map((p) => p.clone().multiplyScalar(rx));
  const izq = der.map((p) => v2(-p.x, p.y)).reverse();
  // derecha: dorsal → ventral; izquierda: ventral → dorsal (sin repetir extremos)
  return [...der, ...izq.slice(1, -1)];
}

export function createCordOutline(levelId: LevelId): THREE.Shape {
  return shapeFrom(contornoMedula(levelId));
}

/** Septo medio posterior: del surco a la comisura gris (escena). */
export function septoPosterior(levelId: LevelId): [THREE.Vector2, THREE.Vector2] {
  const c = corteDe(levelId);
  return [
    v2(0, (c.ry - c.surco) * c.rx),
    v2(0, c.gris.comisura.arriba * c.rx),
  ];
}

// ── Sustancia gris / láminas de Rexed ────────────────────────────────────────

const N_ASTA = 30;

interface AstaMuestreada {
  med: THREE.Vector2[];
  lat: THREE.Vector2[];
  /** Tapa de la punta, de la punta medial a la lateral (sin extremos). */
  tapa: THREE.Vector2[];
}

function muestrearAsta(base: Pt, asta: Asta): AstaMuestreada {
  const med = sampleSpline([v2(base[0], base[1]), ...asta.medial.map(([x, y]) => v2(x, y))], N_ASTA);
  const lat = sampleSpline(asta.lateral.map(([x, y]) => v2(x, y)), N_ASTA);
  const tm = med[N_ASTA];
  const tl = lat[N_ASTA];
  // Dirección de la punta: media de las tangentes finales de ambos rieles.
  const dir = tm.clone().sub(med[N_ASTA - 3]).normalize()
    .add(tl.clone().sub(lat[N_ASTA - 3]).normalize()).normalize();
  const ancho = tm.distanceTo(tl);
  const ctrl = tm.clone().add(tl).multiplyScalar(0.5).addScaledVector(dir, ancho * asta.tapa);
  const curva = new THREE.QuadraticBezierCurve(tm, ctrl, tl);
  const tapa = Array.from({ length: 9 }, (_, i) => curva.getPoint((i + 1) / 10));
  return { med, lat, tapa };
}

interface GrisMitad {
  dorsal: AstaMuestreada;
  ventral: AstaMuestreada;
  /** Borde lateral de VII, de la base dorsal a la base ventral (sin extremos). */
  intermedia: THREE.Vector2[];
  comisura: { ancho: number; arriba: number; abajo: number };
}

/** Bordes de la mitad derecha de la sustancia gris (normalizados). */
function grisMitad(levelId: LevelId): GrisMitad {
  const g = corteDe(levelId).gris;
  const { ancho, arriba, abajo } = g.comisura;
  const dorsal = muestrearAsta([ancho, arriba], g.dorsal);
  const ventral = muestrearAsta([ancho, abajo], g.ventral);
  const borde = sampleSpline(
    [dorsal.lat[0], ...g.intermedia.map(([x, y]) => v2(x, y)), ventral.lat[0]],
    6 + g.intermedia.length * 4,
  );
  return { dorsal, ventral, intermedia: borde.slice(1, -1), comisura: g.comisura };
}

const idx = (f: number) => Math.round(f * N_ASTA);

/** Tramo de asta entre los índices i0..i1 (polígono). */
function tramo(a: AstaMuestreada, i0: number, i1: number, conTapa: boolean): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  for (let i = i0; i <= i1; i++) pts.push(a.med[i]);
  if (conTapa) pts.push(...a.tapa);
  for (let i = i1; i >= i0; i--) pts.push(a.lat[i]);
  return pts;
}

/**
 * Para cada grupo de láminas, las formas que ocupa (lado derecho + espejo
 * izquierdo), en unidades de escena. La lámina X cruza la línea media.
 */
export function createGrayRegions(levelId: LevelId): Map<LaminaGroupId, THREE.Shape[]> {
  const c = corteDe(levelId);
  const rx = c.rx;
  const h = grisMitad(levelId);
  const [d1, d2] = c.gris.cortesDorsal;
  const [v1, v2c] = c.gris.cortesVentral;
  const D = h.dorsal;
  const V = h.ventral;
  const iv1 = idx(v1);
  const iv2 = idx(v2c);
  const espina = (i: number) => V.med[i].clone().add(V.lat[i]).multiplyScalar(0.5);

  const m = new Map<LaminaGroupId, THREE.Shape[]>();
  const lateral = (pts: THREE.Vector2[]) => {
    const esc = pts.map((p) => p.clone().multiplyScalar(rx));
    return [shapeFrom(esc), shapeFrom(mirrorPts(esc))];
  };

  // Asta posterior a lo largo: base (V-VI), media (III-IV), vértice (I-II) con la tapa.
  m.set('V-VI', lateral(tramo(D, 0, idx(d1), false)));
  m.set('III-IV', lateral(tramo(D, idx(d1), idx(d2), false)));
  m.set('I-II', lateral(tramo(D, idx(d2), N_ASTA, true)));

  // Asta anterior: VIII es la franja medial, IX la lateral con la punta.
  const viii: THREE.Vector2[] = [];
  for (let i = iv1; i <= iv2; i++) viii.push(V.med[i]);
  for (let i = iv2; i >= iv1; i--) viii.push(espina(i));
  m.set('VIII', lateral(viii));

  const ix: THREE.Vector2[] = [];
  for (let i = iv1; i <= N_ASTA; i++) ix.push(V.lat[i]);
  ix.push(...[...V.tapa].reverse());
  for (let i = N_ASTA; i >= iv2; i--) ix.push(V.med[i]);
  for (let i = iv2 - 1; i > iv1; i--) ix.push(espina(i));
  m.set('IX', lateral(ix));

  // Zona intermedia (VII): entre las dos bases, el borde lateral y la comisura.
  const vii: THREE.Vector2[] = [D.med[0], D.lat[0], ...h.intermedia];
  for (let i = 0; i <= iv1; i++) vii.push(V.lat[i]);
  for (let i = iv1; i >= 0; i--) vii.push(V.med[i]);
  m.set('VII', lateral(vii));

  // Comisura gris central (X): rodea el canal y cruza la línea media.
  const { ancho, arriba, abajo } = h.comisura;
  m.set('X', [shapeFrom([v2(-ancho, arriba), v2(ancho, arriba), v2(ancho, abajo), v2(-ancho, abajo)]
    .map((p) => p.multiplyScalar(rx)))]);

  return m;
}

/** Contorno exterior de toda la sustancia gris (escena, cerrado). */
export function contornoGris(levelId: LevelId): THREE.Vector2[] {
  const rx = corteDe(levelId).rx;
  const h = grisMitad(levelId);
  const D = h.dorsal;
  const V = h.ventral;
  const der: THREE.Vector2[] = [v2(0, h.comisura.arriba)];
  der.push(...D.med, ...D.tapa, ...[...D.lat].reverse());
  der.push(...h.intermedia);
  der.push(...V.lat, ...[...V.tapa].reverse(), ...[...V.med].reverse());
  der.push(v2(0, h.comisura.abajo));
  const esc = der.map((p) => p.multiplyScalar(rx));
  return [...esc, ...esc.slice(1, -1).map((p) => v2(-p.x, p.y)).reverse()];
}

/** Canal central: centro y radio (escena). */
export function canalCentral(levelId: LevelId): { x: number; y: number; r: number } {
  const c = corteDe(levelId);
  const { arriba, abajo } = c.gris.comisura;
  return { x: 0, y: ((arriba + abajo) / 2) * c.rx, r: Math.max(c.rx * 0.022, 0.022) };
}

// ── Tractos de sustancia blanca ──────────────────────────────────────────────
// Sectores y óvalos se ubican con un ángulo desde dorsal y un radio en fracción
// del contorno en ese ángulo (medidos sobre la lámina de tractos de Polarlys),
// así siguen el borde ovalado de cada nivel. Si la sustancia gris de un nivel
// llega a ese sitio, el tracto se empuja hacia afuera. Las columnas dorsales
// llenan el funículo posterior real, entre el septo medio y el asta posterior.

const GAP_R = 0.010; // separación entre capas radiales (fracción del contorno)
const GAP_A = 0.7;   // separación entre capas tangenciales (grados)
const HOLGURA = 0.025; // distancia mínima a la sustancia gris (normalizada)

const grisNormCache = new Map<LevelId, THREE.Vector2[]>();
function grisNorm(levelId: LevelId): THREE.Vector2[] {
  let g = grisNormCache.get(levelId);
  if (!g) {
    const rx = corteDe(levelId).rx;
    g = contornoGris(levelId).map((p) => p.divideScalar(rx));
    grisNormCache.set(levelId, g);
  }
  return g;
}

function dentroDe(pts: THREE.Vector2[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}

/** Distancia normalizada, por un rayo desde el origen, a la que termina la sustancia gris. */
function salidaDelGris(levelId: LevelId, angDeg: number): number {
  const pts = grisNorm(levelId);
  const t = deg2rad(angDeg);
  const dx = Math.sin(t);
  const dy = Math.cos(t);
  let lejos = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[j];
    const b = pts[i];
    // Intersección del rayo (0,0)+d·u con el segmento a→b.
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const u = (a.x * ey - a.y * ex) / den;
    const w = (a.x * dy - a.y * dx) / den;
    if (u > 0 && w >= 0 && w <= 1) lejos = Math.max(lejos, u);
  }
  return lejos;
}

/** Punto a ángulo θ (desde dorsal) y fracción f del contorno (normalizado). */
function polarNorm(levelId: LevelId, angDeg: number, f: number): THREE.Vector2 {
  const r = contornoRadioNorm(levelId, angDeg) * f;
  const t = deg2rad(angDeg);
  return v2(r * Math.sin(t), r * Math.cos(t));
}

/**
 * Suaviza el perfil del borde del gris (fracción del contorno por grado, de 0°
 * a 180°): máximo y luego media en ±7°. Sin esto, un rayo que apenas roza la
 * punta de un asta hace saltar el borde y el sector se astilla. Lo usa también
 * `scripts/medula-espinal/medir-tractos.mjs` sobre la lámina de referencia.
 */
export function suavizarPiso(crudo: number[]): number[] {
  const V = 7;
  const n = crudo.length;
  const max = crudo.map((_, i) => {
    let m = 0;
    for (let k = Math.max(0, i - V); k <= Math.min(n - 1, i + V); k++) m = Math.max(m, crudo[k]);
    return m;
  });
  return max.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = Math.max(0, i - V); k <= Math.min(n - 1, i + V); k++) { s += max[k]; c++; }
    return s / c;
  });
}

const pisoCache = new Map<LevelId, number[]>();
/** Borde del gris (fracción del contorno) suavizado, por grado de 0° a 180°. */
function pisoNivel(levelId: LevelId): number[] {
  let p = pisoCache.get(levelId);
  if (!p) {
    p = suavizarPiso(Array.from({ length: 181 }, (_, a) => salidaDelGris(levelId, a) / contornoRadioNorm(levelId, a)));
    pisoCache.set(levelId, p);
  }
  return p;
}

/** Radio (fracción del contorno) de la posición b de la banda blanca en el ángulo θ. */
function radioDeBanda(levelId: LevelId, angDeg: number, b: number): number {
  const p = pisoNivel(levelId);
  const a = Math.min(Math.max(angDeg, 0), 180);
  const i = Math.floor(a);
  const g0 = p[i];
  const g1 = p[Math.min(i + 1, 180)];
  const g = g0 + (g1 - g0) * (a - i);
  const base = g > 0 ? Math.min(g + HOLGURA, 0.9) : 0;
  return base + (1 - base) * b;
}

/** Sector de la banda blanca entre bIn..bOut (0 = borde del gris, 1 = superficie). */
function sectorPts(levelId: LevelId, bIn: number, bOut: number, a0: number, a1: number): THREE.Vector2[] {
  const rx = corteDe(levelId).rx;
  const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) / 1.5));
  const angs = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n);
  const pt = (a: number, b: number) => polarNorm(levelId, a, radioDeBanda(levelId, a, b)).multiplyScalar(rx);
  return [...angs.map((a) => pt(a, bOut)), ...[...angs].reverse().map((a) => pt(a, bIn))];
}

/** Óvalo con su eje mayor tangente a la superficie en el ángulo θ (normalizado). */
function ovaloTangente(c: THREE.Vector2, angDeg: number, rt: number, rr: number): THREE.Vector2[] {
  const t = deg2rad(angDeg);
  const u = v2(Math.sin(t), Math.cos(t));  // radial
  const w = v2(Math.cos(t), -Math.sin(t)); // tangente
  return Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return c.clone().addScaledVector(w, rt * Math.cos(a)).addScaledVector(u, rr * Math.sin(a));
  });
}

/**
 * Óvalo de un tracto: en su sitio medido; si toca la sustancia gris del nivel,
 * se desplaza hacia afuera por el mismo ángulo sin salirse de la médula.
 */
function ovaloTracto(levelId: LevelId, ang: number, rad: number, rt: number, rr: number): THREE.Vector2[] {
  const gris = grisNorm(levelId);
  const rOut = contornoRadioNorm(levelId, ang);
  const fMax = Math.max((rOut * 0.97 - rr) / rOut, rad);
  let f = rad;
  let pts = ovaloTangente(polarNorm(levelId, ang, f), ang, rt, rr);
  const toca = (ps: THREE.Vector2[]) => ps.some((p) => dentroDe(gris, p.x, p.y))
    || dentroDe(gris, ...(polarNorm(levelId, ang, f).toArray() as [number, number]));
  while (toca(pts) && f < fMax) {
    f = Math.min(f + 0.015, fMax);
    pts = ovaloTangente(polarNorm(levelId, ang, f), ang, rt, rr);
  }
  return pts.map((p) => p.multiplyScalar(corteDe(levelId).rx));
}

function ellipsePts(cx: number, cy: number, rx: number, ry: number): THREE.Vector2[] {
  return Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return v2(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
  });
}

/** Límite medial del funículo posterior (x del asta posterior) a una altura y. */
function funiculoPosterior(levelId: LevelId) {
  const c = corteDe(levelId);
  const D = grisMitad(levelId).dorsal;
  const med = D.med; // de la base (comisura) a la punta
  const yBase = med[0].y;
  const yTope = c.ry - c.surco;
  const xLimite = (y: number): number => {
    if (y <= med[0].y) return med[0].x;
    for (let i = 0; i < med.length - 1; i++) {
      const a = med[i];
      const b = med[i + 1];
      if (y >= a.y && y <= b.y) return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y || 1);
    }
    // Por encima de la punta del asta: sigue la tapa hacia la superficie.
    const tip = med[med.length - 1];
    return tip.x + (y - tip.y) * 0.4;
  };
  /** Franja entre fracciones f0..f1 del ancho del funículo (escena). */
  return (f0: number, f1: number): THREE.Vector2[] => {
    const N = 40;
    const izq: THREE.Vector2[] = [];
    const der: THREE.Vector2[] = [];
    const sep = 0.012; // separación junto al septo
    for (let i = 0; i <= N; i++) {
      const y = yBase + ((yTope - yBase) * i) / N;
      const xl = xLimite(y);
      const x0 = Math.max(f0 * xl, sep);
      const x1 = Math.max(f1 * xl, x0 + 0.004);
      izq.push(v2(x0, Math.min(y, contornoYDorsal(levelId, x0) - 0.012)));
      der.push(v2(x1, Math.min(y, contornoYDorsal(levelId, x1) - 0.012)));
    }
    return [...izq, ...der.reverse()].map((p) => p.multiplyScalar(c.rx));
  };
}

export interface TractPiece { shape: THREE.Shape; shade: number; layer?: SomaLayer; /** Puntos del lado derecho (para verificar). */ pts: THREE.Vector2[]; }
export interface TractRender {
  id: TractId;
  color: string;
  direction: 'ascendente' | 'descendente';
  pieces: TractPiece[];
}

/** Geometría de todos los tractos presentes al nivel dado (ambos lados). */
export function createTracts(levelId: LevelId): TractRender[] {
  const rx = corteDe(levelId).rx;
  const out: TractRender[] = [];
  const franja = funiculoPosterior(levelId);
  const hayCuneiforme = tractLayersAt('cuneiforme', levelId).length > 0;

  for (const t of TRACT_LIST) {
    const layers = tractLayersAt(t.id, levelId);
    if (layers.length === 0) continue;
    const isSingle = layers.length === 1 && layers[0] === '*';
    const pieces: TractPiece[] = [];
    const pl = t.placement;
    const add = (pts: THREE.Vector2[], shade: number, layer?: SomaLayer) => {
      pieces.push({ shape: shapeFrom(pts), shade, layer, pts });
      pieces.push({ shape: shapeFrom(mirrorPts(pts)), shade, layer, pts: mirrorPts(pts) });
    };
    const n = layers.length;

    if (pl.kind === 'blob') {
      for (const h of [pl, ...(pl.mas ?? [])]) add(ovaloTracto(levelId, h.ang, h.rad, h.rx, h.ry), 0);
    } else if (pl.kind === 'fisura') {
      // Junto a la pared de la fisura, entre su fondo y el labio ventral.
      const cf = corteDe(levelId);
      // El largo se ajusta a la fisura de cada nivel para no salirse por el labio.
      const yLabio = -cf.ry * 0.88;
      const largo = cf.fisura.fondo - yLabio;
      const ryT = Math.min(pl.ry, largo * 0.42);
      const yDeseo = cf.fisura.fondo + (yLabio - cf.fisura.fondo) * pl.pos;
      const y = Math.min(Math.max(yDeseo, yLabio + ryT), cf.fisura.fondo - ryT * 0.4);
      const x = cf.fisura.ancho + 0.015 + pl.rx;
      add(ellipsePts(x * rx, y * rx, pl.rx * rx, ryT * rx), 0);
    } else if (pl.kind === 'posterior') {
      const f1 = hayCuneiforme ? pl.f1 : (pl.f1Solo ?? pl.f1);
      if (isSingle || n === 1 || pl.soma !== 'tangential') {
        add(franja(pl.f0, f1), 0);
      } else {
        const gap = 0.025;
        for (let k = 0; k < n; k++) {
          const a = pl.f0 + ((f1 - pl.f0) * k) / n + (k > 0 ? gap / 2 : 0);
          const b = pl.f0 + ((f1 - pl.f0) * (k + 1)) / n - (k < n - 1 ? gap / 2 : 0);
          add(franja(a, b), 0.55 * (1 - k / (n - 1)), layers[k] as SomaLayer);
        }
      }
    } else {
      const { a0, a1, rIn, rOut, soma } = pl;
      if (isSingle || n === 1) {
        add(sectorPts(levelId, rIn, rOut, a0, a1), 0);
      } else if (soma === 'radial') {
        for (let k = 0; k < n; k++) {
          const ro = rOut - (rOut - rIn) * (k / n) - (k > 0 ? GAP_R : 0);
          const ri = rOut - (rOut - rIn) * ((k + 1) / n) + (k < n - 1 ? GAP_R : 0);
          add(sectorPts(levelId, ri, ro, a0, a1), 0.55 * (1 - k / (n - 1)), layers[k] as SomaLayer);
        }
      } else if (soma === 'tangential') {
        const span = a1 - a0;
        for (let k = 0; k < n; k++) {
          const aa0 = a0 + span * (k / n) + (k > 0 ? GAP_A : 0);
          const aa1 = a0 + span * ((k + 1) / n) - (k < n - 1 ? GAP_A : 0);
          add(sectorPts(levelId, rIn, rOut, aa0, aa1), 0.55 * (1 - k / (n - 1)), layers[k] as SomaLayer);
        }
      } else {
        add(sectorPts(levelId, rIn, rOut, a0, a1), 0);
      }
    }

    out.push({ id: t.id, color: t.color, direction: t.direction, pieces });
  }

  return out;
}

// ── Anillos meníngeos ────────────────────────────────────────────────────────
// Siguen el contorno liso del nivel (sin la muesca de la fisura), escalado.

function vueltaLisa(levelId: LevelId, k: number): THREE.Vector2[] {
  const rx = corteDe(levelId).rx;
  const der = mediaVueltaLisa(levelId).map((p) => p.multiplyScalar(rx * k));
  return [...der, ...der.slice(1, -1).map((p) => v2(-p.x, p.y)).reverse()];
}

/** Anillo entre `kIn` y `kOut` veces el contorno liso del nivel. */
export function createMeningeShape(levelId: LevelId, kIn: number, kOut: number): THREE.Shape {
  const s = shapeFrom(vueltaLisa(levelId, kOut));
  s.holes.push(new THREE.Path(vueltaLisa(levelId, kIn).reverse()));
  return s;
}
