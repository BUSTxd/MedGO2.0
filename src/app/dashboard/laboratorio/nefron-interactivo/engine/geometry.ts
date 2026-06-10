// Geometría del esquema del nefrón. Fuente única de coordenadas para NefronMap.
// Sistema de coordenadas: viewBox 0 0 440 470. Los segmentos se dibujan como
// paths continuos (el final de uno coincide con el inicio del siguiente, siguiendo
// el trayecto del filtrado), salvo el glomérulo que se dibuja como círculo.

import type { SegmentId } from './types';

export const NEFRON_VIEWBOX = { w: 440, h: 470 };

/** Línea corticomedular: por encima = corteza, por debajo = médula. */
export const CORTICO_MEDULLARY_Y = 214;

export interface SegmentGeom {
  /** path SVG del trayecto tubular (no usado por el glomérulo). */
  path?: string;
  /** glomérulo: se dibuja como círculo. */
  circle?: { cx: number; cy: number; r: number };
  /** punto de la insignia numerada / centro clicable. */
  badge: { x: number; y: number };
  /** índice mostrado en la insignia (orden del filtrado). Ausente en accesorios. */
  index?: number;
  /** marcador corto para estructuras accesorias sin número (p. ej. "JG", "VR"). */
  marker?: string;
}

export const SEGMENT_GEOMS: Record<SegmentId, SegmentGeom> = {
  glomerulo: {
    circle: { cx: 86, cy: 78, r: 30 },
    badge: { x: 86, y: 78 },
    index: 1,
  },
  tcp: {
    path: 'M110,100 C150,78 150,124 186,108 C212,98 206,134 236,132',
    badge: { x: 168, y: 96 },
    index: 2,
  },
  'asa-desc': {
    path: 'M236,132 L236,382 C236,410 196,410 196,382',
    badge: { x: 236, y: 320 },
    index: 3,
  },
  'asa-asc-delgada': {
    path: 'M196,382 L196,300',
    badge: { x: 196, y: 344 },
    index: 4,
  },
  tal: {
    path: 'M196,300 L196,150',
    badge: { x: 196, y: 224 },
    index: 5,
  },
  tcd: {
    path: 'M196,150 C214,132 244,140 258,152 C272,164 288,150 302,150',
    badge: { x: 258, y: 138 },
    index: 6,
  },
  'conector-cortical': {
    path: 'M302,150 C316,150 324,164 324,190 L324,214',
    badge: { x: 326, y: 184 },
    index: 7,
  },
  'medular-interno': {
    path: 'M324,214 L324,432',
    badge: { x: 324, y: 372 },
    index: 8,
  },
  // ── Estructuras accesorias (no están en el trayecto del filtrado) ──
  yuxtaglomerular: {
    // Arco corto junto al glomérulo (mácula densa + yuxtaglomerulares + mesangiales).
    path: 'M70,120 C86,134 110,134 126,122',
    badge: { x: 98, y: 132 },
    marker: 'JG',
  },
  'vasa-recta': {
    // Vaso en horquilla en la médula, a la izquierda del asa.
    path: 'M166,230 L166,414 C166,432 148,432 148,414 L148,230',
    badge: { x: 157, y: 384 },
    marker: 'VR',
  },
};

/** Orden de dibujo / de la leyenda (trayecto del filtrado + accesorios al final). */
export const SEGMENT_ORDER: SegmentId[] = [
  'glomerulo',
  'tcp',
  'asa-desc',
  'asa-asc-delgada',
  'tal',
  'tcd',
  'conector-cortical',
  'medular-interno',
  'yuxtaglomerular',
  'vasa-recta',
];
