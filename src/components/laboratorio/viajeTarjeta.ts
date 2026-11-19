'use client';
// Viaje de la tarjeta de práctica del centro a un lado (labs 3D de Médula,
// Willis y Tronco). Técnica FLIP con la caja y el texto separados:
//
// - La caja (`pos`, con el fondo y la sombra de la tarjeta) va de su rectángulo
//   anterior al nuevo con escala distinta en ancho y alto, así coincide en
//   tamaño con lo que se veía en cada momento.
// - El texto (`cuerpo`) ya está maquetado con el ancho final y se contraescala
//   en cada fotograma: no se estira ni se reacomoda mientras viaja.
//
// Antes la caja se escalaba igual en los dos ejes (por el ancho): como el texto
// a 400 px es más alto que a 600 px, la tarjeta salía del centro bastante más
// alta de lo que era y se encogía al llegar.

import { useLayoutEffect, useRef, type RefObject } from 'react';

const VIAJE_MS = 620;
const RADIO = 16; // border-radius de .tarjeta

/** Curva de salida fuerte (equivale a cubic-bezier(0.22, 0.9, 0.24, 1)). */
const curva = (t: number) => 1 - Math.pow(1 - t, 4);

export function useViajeTarjeta(
  pos: RefObject<HTMLDivElement | null>,
  cuerpo: RefObject<HTMLDivElement | null>,
  id: string | null,
  lado: boolean,
  paso: string,
) {
  /** Dónde estaba la tarjeta en el render anterior (y de qué pregunta y lado). */
  const antes = useRef<{ rect: DOMRect; id: string; lado: boolean } | null>(null);

  useLayoutEffect(() => {
    const el = pos.current;
    const dentro = cuerpo.current;
    const caja = dentro?.parentElement as HTMLElement | null;
    if (!el || !dentro || !caja || !id) { antes.current = null; return; }
    const ahora = el.getBoundingClientRect();
    const prev = antes.current;
    antes.current = { rect: ahora, id, lado };
    if (!prev || prev.id !== id || prev.lado === lado) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (ahora.width < 1 || ahora.height < 1) return;

    const dx = prev.rect.left - ahora.left;
    const dy = prev.rect.top - ahora.top;
    const sx = prev.rect.width / ahora.width;
    const sy = prev.rect.height / ahora.height;
    el.style.transformOrigin = 'top left';
    dentro.style.transformOrigin = 'top left';
    caja.style.overflow = 'hidden';

    const pintar = (t: number) => {
      const e = curva(t);
      const kx = sx + (1 - sx) * e;
      const ky = sy + (1 - sy) * e;
      el.style.transform = `translate(${dx * (1 - e)}px, ${dy * (1 - e)}px) scale(${kx}, ${ky})`;
      dentro.style.transform = `scale(${1 / kx}, ${1 / ky})`;
      // Las esquinas tampoco se deforman.
      caja.style.borderRadius = `${RADIO / kx}px / ${RADIO / ky}px`;
      // El texto pasa del ancho del centro al del lado de golpe: un fundido corto lo disimula.
      dentro.style.opacity = String(0.35 + 0.65 * Math.min(1, t * 1.8));
    };
    const limpiar = () => {
      el.style.transform = '';
      el.style.transformOrigin = '';
      dentro.style.transform = '';
      dentro.style.transformOrigin = '';
      dentro.style.opacity = '';
      caja.style.overflow = '';
      caja.style.borderRadius = '';
    };

    pintar(0); // primer fotograma antes de que el navegador pinte
    const inicio = performance.now();
    let raf = 0;
    const paso = (ahoraMs: number) => {
      const t = Math.min(1, (ahoraMs - inicio) / VIAJE_MS);
      pintar(t);
      if (t < 1) raf = requestAnimationFrame(paso);
      else {
        limpiar();
        antes.current = { rect: el.getBoundingClientRect(), id, lado };
      }
    };
    raf = requestAnimationFrame(paso);
    return () => { cancelAnimationFrame(raf); limpiar(); };
  }, [pos, cuerpo, id, lado, paso]);
}
