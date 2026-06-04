// Geometría del esquema cardíaco. Fuente única de coordenadas: la usan
// HeartSchema.tsx (para dibujar el SVG) y el timeline de cada modo (para
// posicionar el círculo del impulso a lo largo de la vía de conducción).
//
// Sistema de coordenadas: viewBox 0 0 400 360.
// Convención clínica: la derecha del paciente queda a la IZQUIERDA de la pantalla,
// por eso AD/VD están a la izquierda y AI/VI a la derecha.

export const HEART_VIEWBOX = { w: 400, h: 360 };

/** Puntos clave del sistema de conducción (centro de cada estructura). */
export const NODES = {
  sa: { x: 150, y: 92 }, // nodo sinusal — techo de la aurícula derecha
  av: { x: 200, y: 188 }, // nodo AV — unión auriculoventricular
  his: { x: 200, y: 214 }, // haz de His
  fork: { x: 200, y: 236 }, // bifurcación de las ramas
  rbbTip: { x: 154, y: 300 }, // extremo rama derecha (ventrículo derecho)
  lbbTip: { x: 246, y: 300 }, // extremo rama izquierda (ventrículo izquierdo)
} as const;

/** Cajas de las cuatro cámaras (x, y, ancho, alto, rx) para dibujar el esquema. */
export const CHAMBERS = {
  ra: { x: 78, y: 56, w: 120, h: 96, rx: 22, label: 'AD' },
  la: { x: 202, y: 56, w: 120, h: 96, rx: 22, label: 'AI' },
  rv: { x: 70, y: 196, w: 128, h: 128, rx: 26, label: 'VD' },
  lv: { x: 202, y: 196, w: 128, h: 128, rx: 26, label: 'VI' },
} as const;

/** Centro visual de cada ventrículo (para el "glow" de despolarización/repolarización). */
export const VENTRICLE_CENTER = {
  rv: { x: 134, y: 260 },
  lv: { x: 266, y: 260 },
} as const;

/** Posición del foco ectópico (modo de extrasístole ventricular). */
export const ECTOPIC = { x: 150, y: 282 } as const;

/**
 * Interpola una posición a lo largo de una polilínea de waypoints según un
 * parámetro f en [0,1]. Reparte f uniformemente entre tramos (no por longitud,
 * suficiente para una animación suave del impulso).
 */
export function lerpPath(
  points: { x: number; y: number }[],
  f: number,
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1 || f <= 0) return points[0];
  if (f >= 1) return points[points.length - 1];
  const segs = points.length - 1;
  const scaled = f * segs;
  const i = Math.floor(scaled);
  const local = scaled - i;
  const a = points[i];
  const b = points[i + 1];
  return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
}
