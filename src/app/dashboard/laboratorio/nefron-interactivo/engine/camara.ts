// Cámara 2D del nefrón: centro en el lienzo y zoom (1 = todo el nefrón a la
// vista). El SVG la usa como viewBox y el canvas como matriz.

import { ALTO, ANCHO, type Caja, type P } from './geometria.ts';

export interface Camara { cx: number; cy: number; z: number }

export const CAM_INICIAL: Camara = { cx: ANCHO / 2, cy: ALTO / 2, z: 1 };
export const Z_MIN = 0.85;
export const Z_MAX = 12;
/** Desde aquí se ven las células sobre la pared. */
export const Z_CELULAS = 1.8;
/** Desde aquí, núcleos y nombre de cada célula. */
export const Z_DETALLE = 3.4;
/** Acercar más que esto sobre una célula entra en ella. */
export const Z_ENTRAR = 10.5;

/** Píxeles por unidad del lienzo. */
export function escala(cam: Camara, w: number, h: number) {
  return Math.min(w / ANCHO, h / ALTO) * 0.96 * cam.z;
}

export function viewBox(cam: Camara, w: number, h: number) {
  const s = escala(cam, w, h);
  const vw = w / s;
  const vh = h / s;
  return `${(cam.cx - vw / 2).toFixed(2)} ${(cam.cy - vh / 2).toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}`;
}

export function aMundo(cam: Camara, w: number, h: number, sx: number, sy: number): P {
  const s = escala(cam, w, h);
  return [cam.cx + (sx - w / 2) / s, cam.cy + (sy - h / 2) / s];
}

export function aPantalla(cam: Camara, w: number, h: number, p: P): P {
  const s = escala(cam, w, h);
  return [(p[0] - cam.cx) * s + w / 2, (p[1] - cam.cy) * s + h / 2];
}

/** Cuánto puede asomar el fondo más allá del nefrón: hasta 170 u del lienzo y nunca
 *  más de 140 px de pantalla (de cerca, el margen se encoge con el zoom). */
export const MARGEN = 170;
const MARGEN_PX = 140;

/** Zoom dentro de sus topes y vista dentro del nefrón más su margen: nunca se
 *  llega al borde del fondo. Si la vista es más grande que todo, se centra. */
export function limitar(cam: Camara, w: number, h: number): Camara {
  const z = Math.min(Z_MAX, Math.max(Z_MIN, cam.z));
  const s = Math.min(w / ANCHO, h / ALTO) * 0.96 * z;
  const eje = (c: number, mitad: number, largo: number) => {
    const m = Math.min(MARGEN, MARGEN_PX / s);
    const lo = -m + mitad;
    const hi = largo + m - mitad;
    return lo > hi ? largo / 2 : Math.min(hi, Math.max(lo, c));
  };
  return { z, cx: eje(cam.cx, w / (2 * s), ANCHO), cy: eje(cam.cy, h / (2 * s), ALTO) };
}

/** Cámara que encuadra una caja del lienzo. */
export function encuadrar(c: Caja, w: number, h: number, margen = 0.82): Camara {
  const base = Math.min(w / ANCHO, h / ALTO) * 0.96;
  const z = Math.min((w / (c.x1 - c.x0)), (h / (c.y1 - c.y0))) * margen / base;
  return limitar({ cx: (c.x0 + c.x1) / 2, cy: (c.y0 + c.y1) / 2, z }, w, h);
}

/** Zoom alrededor de un punto de la pantalla (el punto no se mueve). */
export function zoomEn(cam: Camara, w: number, h: number, sx: number, sy: number, factor: number): Camara {
  const antes = aMundo(cam, w, h, sx, sy);
  const z = Math.min(Z_MAX, Math.max(Z_MIN, cam.z * factor));
  const s = Math.min(w / ANCHO, h / ALTO) * 0.96 * z;
  return limitar({ z, cx: antes[0] - (sx - w / 2) / s, cy: antes[1] - (sy - h / 2) / s }, w, h);
}

/** Interpola dos cámaras (el zoom en escala logarítmica, que se siente parejo). */
export function interpolar(a: Camara, b: Camara, t: number): Camara {
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return {
    cx: a.cx + (b.cx - a.cx) * e,
    cy: a.cy + (b.cy - a.cy) * e,
    z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * e),
  };
}
