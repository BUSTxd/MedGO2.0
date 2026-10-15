'use client';
// Mide la zona de la escena y decide para qué pantalla se compila: en un
// teléfono (estrecho, o bajo en horizontal) la cámara toma la proporción real
// de la zona y se acerca a las células del paso; en escritorio, 16:10 y el
// encuadre de siempre. La proporción va redondeada para no recompilar con cada
// píxel (la barra de Safari que aparece y desaparece cambia el alto).

import { useEffect, useState, type RefObject } from 'react';
import { MODO_ESCRITORIO, type Modo } from '@/lib/linfocitos/motor';

export function useModo(ref: RefObject<HTMLElement | null>): Modo {
  const [modo, setModo] = useState<Modo>(MODO_ESCRITORIO);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (w < 10 || h < 10) return;
      const movil = w < 720 || h < 420;
      const asp = Math.min(3, Math.max(0.5, Math.round((w / h) * 10) / 10));
      setModo((m) => (movil ? (m.movil && m.asp === asp ? m : { asp, movil }) : m.movil ? MODO_ESCRITORIO : m));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return modo;
}
