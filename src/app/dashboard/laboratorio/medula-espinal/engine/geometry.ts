// Generación procedural de geometría para el corte transversal de la médula espinal.
// Todas las formas viven en el plano XY (Y+ dorsal, Y- ventral, X lateral).
//
// Arquitectura clave: la sustancia gris se construye como un conjunto de
// sub-regiones que coinciden EXACTAMENTE con las láminas de Rexed. La "mariposa"
// gris no es más que esas mismas regiones pintadas de gris; al activar el modo
// láminas se recolorean. Así es imposible que una lámina quede oculta tras la
// sustancia gris (el bug del modelo anterior).

import * as THREE from 'three';
import { LEVELS, TRACT_LIST, tractLayersAt, type LevelId, type LaminaGroupId, type TractId, type SomaLayer } from './anatomy';

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
  fissure: 0.05,
  overlay: 0.33,
};

// ── Utilidades ───────────────────────────────────────────────────────────────

function deg2rad(d: number) { return (d * Math.PI) / 180; }
function v2(x: number, y: number) { return new THREE.Vector2(x, y); }

// Raíles izquierdo/derecho de una "asta" (strip cónico) a lo largo de un eje.
function rails(base: THREE.Vector2, tip: THREE.Vector2, hwBase: number, hwTip: number, n: number) {
  const dir = tip.clone().sub(base);
  const nrm = dir.clone().normalize();
  const perp = v2(-nrm.y, nrm.x);
  const L: THREE.Vector2[] = [];
  const R: THREE.Vector2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const c = base.clone().lerp(tip, t);
    const hw = hwBase + (hwTip - hwBase) * t;
    L.push(c.clone().addScaledVector(perp, hw));
    R.push(c.clone().addScaledVector(perp, -hw));
  }
  return { L, R };
}

// Polígono del tramo del strip entre los índices i0..i1.
function stripSegment(rl: { L: THREE.Vector2[]; R: THREE.Vector2[] }, i0: number, i1: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(rl.L[i0].x, rl.L[i0].y);
  for (let i = i0 + 1; i <= i1; i++) s.lineTo(rl.L[i].x, rl.L[i].y);
  for (let i = i1; i >= i0; i--) s.lineTo(rl.R[i].x, rl.R[i].y);
  s.closePath();
  return s;
}

// Espejo de un shape respecto al eje Y (x → -x), conservando el sentido.
function mirrorShape(sh: THREE.Shape): THREE.Shape {
  const pts = sh.getPoints(20).map((p) => v2(-p.x, p.y)).reverse();
  const m = new THREE.Shape();
  m.setFromPoints(pts);
  return m;
}

// ── Sustancia gris / láminas de Rexed ────────────────────────────────────────
// Devuelve, para cada grupo de láminas, las formas que ocupa (lado derecho +
// espejo izquierdo). La lámina X es central (cruza la línea media).

export function createGrayRegions(levelId: LevelId): Map<LaminaGroupId, THREE.Shape[]> {
  const p = LEVELS[levelId].gm;
  const cw = Math.max(p.bodyW, 0.06) + 0.05;            // extensión lateral de la zona intermedia
  const ch = Math.max(p.bodyH, 0.10);                   // semialtura de la comisura
  const latEdge = cw + (p.latHorn ? p.latHornLen : 0) + 0.05;
  const latW = p.latHorn ? p.latHornW + 0.05 : ch * 0.78;

  // Asta posterior: inclinada dorsolateral, delgada y puntiaguda; casi alcanza
  // el borde para dejar entre ambas el funículo dorsal (columnas dorsales).
  const pBase = v2(cw * 0.85, ch * 0.55);
  const pTip = v2(p.postHornLen * 0.7 + cw * 0.8, p.bodyH + p.postHornLen * 1.1);
  const pr = rails(pBase, pTip, Math.max(p.postHornBaseW * 1.2, 0.085), Math.max(p.postHornTipW * 0.7, 0.04), 9);

  // Asta anterior: inclinada ventrolateral, ancha y roma, pero sin cruzar la
  // línea media (deja libre el funículo anterior junto a la fisura).
  const aBase = v2(cw * 0.85, -ch * 0.55);
  const aTip = v2(p.antHornLen * 0.45 + cw * 0.8, -(p.bodyH + p.antHornLen));
  const ar = rails(aBase, aTip, Math.max(p.antHornBaseW * 1.3, 0.10), Math.max(p.antHornTipW * 0.5, 0.11), 9);

  const m = new Map<LaminaGroupId, THREE.Shape[]>();
  const lateral = (sh: THREE.Shape) => [sh, mirrorShape(sh)];

  // Asta posterior dividida a lo largo: base (V-VI), media (III-IV), vértice (I-II).
  m.set('V-VI', lateral(stripSegment(pr, 0, 3)));
  m.set('III-IV', lateral(stripSegment(pr, 3, 6)));
  m.set('I-II', lateral(stripSegment(pr, 6, 9)));

  // Asta anterior dividida: base ventromedial (VIII), cuerpo motor (IX).
  m.set('VIII', lateral(stripSegment(ar, 0, 3)));
  m.set('IX', lateral(stripSegment(ar, 3, 9)));

  // Zona intermedia (VII): bloque lateral entre la comisura y el borde (+ asta lateral).
  const vii = new THREE.Shape();
  vii.moveTo(cw * 0.62, ch);
  vii.lineTo(latEdge, latW);
  vii.lineTo(latEdge, -latW);
  vii.lineTo(cw * 0.62, -ch);
  vii.closePath();
  m.set('VII', lateral(vii));

  // Comisura gris central (X): rectángulo que cruza la línea media, rodea el canal.
  const xw = cw * 0.64;
  const xh = ch * 0.9;
  const xs = new THREE.Shape();
  xs.moveTo(-xw, xh);
  xs.lineTo(xw, xh);
  xs.lineTo(xw, -xh);
  xs.lineTo(-xw, -xh);
  xs.closePath();
  m.set('X', [xs]);

  return m;
}

// ── Silueta exterior (contorno de la médula) ─────────────────────────────────

export function createCordOutline(levelId: LevelId): THREE.Shape {
  const r = LEVELS[levelId].gm.cordRadius;
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return s;
}

// Muesca de la fisura media anterior (cuña ventral oscura).
export function createFissureShape(levelId: LevelId): THREE.Shape {
  const r = LEVELS[levelId].gm.cordRadius;
  const w = r * 0.05;
  const s = new THREE.Shape();
  s.moveTo(-w, -r * 0.40);
  s.lineTo(w, -r * 0.40);
  s.lineTo(w * 0.5, -r * 0.98);
  s.lineTo(-w * 0.5, -r * 0.98);
  s.closePath();
  return s;
}

// ── Tractos de sustancia blanca ──────────────────────────────────────────────
// Cada tracto se sitúa en el hemicordón derecho y se espeja al izquierdo. Los
// sectores con somatotopía se subdividen en capas (radial = externo→interno;
// tangencial = medial→lateral). Los blobs son óvalos en una posición de reloj.
// La sustancia gris, más adelantada en Z, ocluye la parte medial de las columnas
// dorsales para que sólo se vea el funículo.

const GAP_R = 0.010; // separación entre capas radiales (fracción de R)
const GAP_A = 0.7;   // separación entre capas tangenciales (grados)

function sectorShape(rIn: number, rOut: number, aStart: number, aEnd: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, aStart, aEnd, false);
  s.absarc(0, 0, rIn, aEnd, aStart, true);
  s.closePath();
  return s;
}

function ellipseShape(cx: number, cy: number, rx: number, ry: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absellipse(cx, cy, rx, ry, 0, Math.PI * 2, false, 0);
  return s;
}

export interface TractPiece { shape: THREE.Shape; shade: number; layer?: SomaLayer; }
export interface TractRender {
  id: TractId;
  color: string;
  direction: 'ascendente' | 'descendente';
  pieces: TractPiece[];
}

/** Geometría de todos los tractos presentes al nivel dado (ambos lados). */
export function createTracts(levelId: LevelId): TractRender[] {
  const R = LEVELS[levelId].gm.cordRadius;
  const out: TractRender[] = [];

  for (const t of TRACT_LIST) {
    const layers = tractLayersAt(t.id, levelId);
    if (layers.length === 0) continue;
    const isSingle = layers.length === 1 && layers[0] === '*';
    const pieces: TractPiece[] = [];
    const pl = t.placement;

    if (pl.kind === 'blob') {
      const cx = pl.rad * R * Math.sin(deg2rad(pl.ang));
      const cy = pl.rad * R * Math.cos(deg2rad(pl.ang));
      pieces.push({ shape: ellipseShape(cx, cy, pl.rx * R, pl.ry * R), shade: 0 });
      pieces.push({ shape: ellipseShape(-cx, cy, pl.rx * R, pl.ry * R), shade: 0 });
    } else {
      const { a0, a1, rIn, rOut, soma } = pl;
      const addSector = (ri: number, ro: number, aa0: number, aa1: number, shade: number, layer?: SomaLayer) => {
        pieces.push({ shape: sectorShape(ri * R, ro * R, deg2rad(90 - aa1), deg2rad(90 - aa0)), shade, layer });
        pieces.push({ shape: sectorShape(ri * R, ro * R, deg2rad(90 + aa0), deg2rad(90 + aa1)), shade, layer });
      };
      const n = layers.length;

      if (isSingle || n === 1) {
        addSector(rIn, rOut, a0, a1, 0);
      } else if (soma === 'radial') {
        for (let k = 0; k < n; k++) {
          const ro = rOut - (rOut - rIn) * (k / n) - (k > 0 ? GAP_R : 0);
          const ri = rOut - (rOut - rIn) * ((k + 1) / n) + (k < n - 1 ? GAP_R : 0);
          addSector(ri, ro, a0, a1, 0.55 * (1 - k / (n - 1)), layers[k] as SomaLayer);
        }
      } else if (soma === 'tangential') {
        const span = a1 - a0;
        for (let k = 0; k < n; k++) {
          const aa0 = a0 + span * (k / n) + (k > 0 ? GAP_A : 0);
          const aa1 = a0 + span * ((k + 1) / n) - (k < n - 1 ? GAP_A : 0);
          addSector(rIn, rOut, aa0, aa1, 0.55 * (1 - k / (n - 1)), layers[k] as SomaLayer);
        }
      } else {
        addSector(rIn, rOut, a0, a1, 0);
      }
    }

    out.push({ id: t.id, color: t.color, direction: t.direction, pieces });
  }

  return out;
}

// ── Anillos meníngeos ────────────────────────────────────────────────────────

export function createMeningeShape(rInner: number, rOuter: number): THREE.Shape {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOuter, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, rInner, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
}
