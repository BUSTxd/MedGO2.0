'use client';
// Cámara del lienzo: desplazar arrastrando el fondo, zoom con la rueda (hacia
// el cursor) y pellizco con dos dedos. El estado vive en un ref y se aplica
// como `transform` del mundo y como custom properties de la cuadrícula: ni un
// render de React por frame. El % de zoom se escribe también a mano en su
// etiqueta (`etiquetaRef`).

import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface Cam {
  x: number;
  y: number;
  k: number;
}

export interface Encuadre {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ZOOM_MIN = 0.3;
export const ZOOM_MAX = 2.2;
const CELDA = 24;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const suave = (t: number) => 1 - Math.pow(1 - t, 3);

/** Lo que no debe iniciar un desplazamiento del fondo. */
const NO_PAN = '[data-nodo],[data-ui],[data-aviso]';

export function useCamara(
  viewportRef: React.RefObject<HTMLDivElement | null>,
  worldRef: React.RefObject<HTMLDivElement | null>,
  alMover?: () => void,
) {
  const cam = useRef<Cam>({ x: 0, y: 0, k: 1 });
  const etiquetaRef = useRef<HTMLSpanElement | null>(null);
  const vuelo = useRef(0);
  const alMoverRef = useRef(alMover);
  alMoverRef.current = alMover;

  const aplicar = useCallback(() => {
    const vp = viewportRef.current;
    const w = worldRef.current;
    if (!vp || !w) return;
    const { x, y, k } = cam.current;
    w.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    vp.style.setProperty('--gx', `${x}px`);
    vp.style.setProperty('--gy', `${y}px`);
    vp.style.setProperty('--gs', `${CELDA * k}px`);
    // Las balizas lo usan para compensar el zoom: a 40 % seguirían siendo tocables.
    vp.style.setProperty('--k', k.toFixed(3));
    if (etiquetaRef.current) etiquetaRef.current.textContent = `${Math.round(k * 100)} %`;
    alMoverRef.current?.();
  }, [viewportRef, worldRef]);

  const cancelarVuelo = () => {
    if (vuelo.current) cancelAnimationFrame(vuelo.current);
    vuelo.current = 0;
  };

  /** Zoom manteniendo fijo el punto (px, py) del viewport. */
  const zoomEn = useCallback((px: number, py: number, factor: number) => {
    cancelarVuelo();
    const c = cam.current;
    const k2 = clamp(c.k * factor, ZOOM_MIN, ZOOM_MAX);
    const r = k2 / c.k;
    c.x = px - (px - c.x) * r;
    c.y = py - (py - c.y) * r;
    c.k = k2;
    aplicar();
  }, [aplicar]);

  const zoomCentro = useCallback((factor: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    zoomEn(vp.clientWidth / 2, vp.clientHeight / 2, factor);
  }, [viewportRef, zoomEn]);

  const volar = useCallback((dest: Cam, ms = 520) => {
    cancelarVuelo();
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || ms <= 0) {
      cam.current = { ...dest };
      aplicar();
      return;
    }
    const ini = { ...cam.current };
    const t0 = performance.now();
    const paso = (t: number) => {
      const p = suave(Math.min(1, (t - t0) / ms));
      cam.current = {
        x: ini.x + (dest.x - ini.x) * p,
        y: ini.y + (dest.y - ini.y) * p,
        k: ini.k + (dest.k - ini.k) * p,
      };
      aplicar();
      vuelo.current = p < 1 ? requestAnimationFrame(paso) : 0;
    };
    vuelo.current = requestAnimationFrame(paso);
  }, [aplicar]);

  /**
   * Encuadra una caja de mundo. `margen` en px de pantalla por lado; `abajo`
   * reserva sitio extra (la bandeja del modo aprender) y `kMax` evita que tres
   * nodos sueltos se vean gigantes.
   */
  const encuadrar = useCallback(
    (c: Encuadre, opts: { margen?: number; abajo?: number; arriba?: number; kMax?: number; ms?: number } = {}) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const { margen = 56, abajo = 0, arriba = 64, kMax = 1.15, ms = 520 } = opts;
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const aw = Math.max(80, vw - margen * 2);
      const ah = Math.max(80, vh - margen * 2 - abajo - arriba);
      const k = clamp(Math.min(aw / Math.max(c.w, 1), ah / Math.max(c.h, 1)), ZOOM_MIN, kMax);
      const cx = c.x + c.w / 2;
      const cy = c.y + c.h / 2;
      volar({ k, x: vw / 2 - cx * k, y: arriba + margen + ah / 2 - cy * k }, ms);
    },
    [viewportRef, volar],
  );

  /** Desplaza lo justo para que el punto de mundo `p` quede dentro del área útil. */
  const asegurarVisible = useCallback(
    (p: { x: number; y: number }, opts: { margen?: number; abajo?: number; arriba?: number } = {}) => {
      const vp = viewportRef.current;
      // Con un vuelo en curso (el encuadre de la vía al empezar) no se toca:
      // ese vuelo ya deja a la vista todos sus nodos, y volar aquí lo cancelaría.
      if (!vp || vuelo.current) return;
      const { margen = 90, abajo = 0, arriba = 64 } = opts;
      const c = cam.current;
      const sx = p.x * c.k + c.x;
      const sy = p.y * c.k + c.y;
      let dx = 0;
      let dy = 0;
      if (sx < margen) dx = margen - sx;
      else if (sx > vp.clientWidth - margen) dx = vp.clientWidth - margen - sx;
      if (sy < arriba + margen) dy = arriba + margen - sy;
      else if (sy > vp.clientHeight - abajo - margen) dy = vp.clientHeight - abajo - margen - sy;
      if (dx || dy) volar({ k: c.k, x: c.x + dx, y: c.y + dy }, 420);
    },
    [viewportRef, volar],
  );

  // Rueda: registrada a mano con `passive: false`. React adjunta `onWheel`
  // como pasivo y ahí `preventDefault()` no evitaría que la página se desplace.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('[data-ui]')) return;
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      // Trackpad con dos dedos sin ctrl = desplazar; rueda o pellizco = zoom.
      const esPan = !e.ctrlKey && e.deltaMode === 0 && Math.abs(e.deltaX) > 0.5;
      if (esPan) {
        cancelarVuelo();
        cam.current.x -= e.deltaX;
        cam.current.y -= e.deltaY;
        aplicar();
        return;
      }
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomEn(e.clientX - r.left, e.clientY - r.top, Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0016)));
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [viewportRef, aplicar, zoomEn]);

  // Desplazar y pellizcar sobre el fondo.
  const punteros = useRef(new Map<number, { x: number; y: number }>());
  const gesto = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest(NO_PAN)) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const vp = viewportRef.current;
    if (!vp) return;
    cancelarVuelo();
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vp.classList.add('arrastrando-fondo');

    const recalcular = () => {
      const ps = [...punteros.current.values()];
      if (ps.length >= 2) {
        const [a, b] = ps;
        gesto.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      } else gesto.current = null;
    };
    recalcular();

    const mover = (ev: PointerEvent) => {
      const prev = punteros.current.get(ev.pointerId);
      if (!prev) return;
      const nuevo = { x: ev.clientX, y: ev.clientY };
      punteros.current.set(ev.pointerId, nuevo);
      if (punteros.current.size >= 2 && gesto.current) {
        const [a, b] = [...punteros.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const cx = (a.x + b.x) / 2;
        const cy = (a.y + b.y) / 2;
        const r = vp.getBoundingClientRect();
        cam.current.x += cx - gesto.current.cx;
        cam.current.y += cy - gesto.current.cy;
        zoomEn(cx - r.left, cy - r.top, dist / (gesto.current.dist || dist));
        gesto.current = { dist, cx, cy };
      } else {
        cam.current.x += nuevo.x - prev.x;
        cam.current.y += nuevo.y - prev.y;
        aplicar();
      }
    };
    const soltar = (ev: PointerEvent) => {
      punteros.current.delete(ev.pointerId);
      recalcular();
      if (punteros.current.size === 0) {
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
        window.removeEventListener('pointercancel', soltar);
        vp.classList.remove('arrastrando-fondo');
      }
    };
    if (punteros.current.size === 1) {
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
    }
  }, [viewportRef, aplicar, zoomEn]);

  useEffect(() => () => cancelarVuelo(), []);

  // Objeto estable: quien lo consume lo pone en dependencias de sus callbacks.
  return useMemo(
    () => ({ cam, aplicar, zoomCentro, encuadrar, asegurarVisible, onPointerDown, etiquetaRef }),
    [aplicar, zoomCentro, encuadrar, asegurarVisible, onPointerDown],
  );
}
