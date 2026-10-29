'use client';
// Voz grabada de un capítulo: un solo audio que sigue al reproductor. Cada paso
// tiene su tramo (`marcas`); al empezar un paso salta a su marca y al acabar el
// tramo se calla hasta el paso siguiente. Si un tramo dura algo más que su
// animación no se corta: el audio es continuo y sigue hacia el tramo nuevo.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Narracion } from '@/lib/data/hipersensibilidad/tipos';
import type { Reproductor } from './useReproductor';

const CLAVE = 'medgo-hiper-voz';
/** Retraso que se tolera al entrar en un paso antes de saltar a su marca (s). */
const HOLGURA = 0.8;

export function useVoz(narracion: Narracion | undefined, rep: Reproductor) {
  const [activa, setActiva] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);
  const pasoRef = useRef(rep.paso);
  pasoRef.current = rep.paso;
  const tRef = useRef(rep.t);
  tRef.current = rep.t;

  useEffect(() => {
    try { if (localStorage.getItem(CLAVE) === '0') setActiva(false); } catch { /* sin almacenamiento */ }
  }, []);

  // Solo se baja con la voz encendida (es lo que más pesa del capítulo).
  useEffect(() => {
    if (!narracion || !activa) return;
    const a = new Audio();
    a.preload = 'auto';
    a.src = a.canPlayType('audio/webm; codecs=opus') ? narracion.webm : narracion.mp3;
    audio.current = a;
    return () => { a.pause(); a.removeAttribute('src'); a.load(); audio.current = null; };
  }, [narracion, activa]);

  const fin = useCallback((i: number) => narracion?.marcas[i + 1] ?? Infinity, [narracion]);

  // Arrancar, saltar o callar según el reproductor. `enInicio` hace que
  // «Reiniciar» (o volver a pulsar el mismo paso) también vuelva a su marca.
  const enInicio = rep.t === 0;
  useEffect(() => {
    const a = audio.current;
    if (!a || !narracion) return;
    if (!activa || !rep.reproduciendo || rep.arrastrando) { a.pause(); return; }
    a.playbackRate = rep.velocidad;
    const i = rep.paso;
    const objetivo = narracion.marcas[i] + tRef.current / 1000;
    if (objetivo >= fin(i)) { a.pause(); return; }
    const atraso = objetivo - a.currentTime;
    const sigue = !a.paused && atraso > 0 && atraso <= HOLGURA;
    if (!sigue && Math.abs(atraso) > 0.25) a.currentTime = objetivo;
    a.play().catch(() => { /* el navegador exige un gesto: el próximo «Reproducir» lo da */ });
  }, [narracion, activa, rep.reproduciendo, rep.arrastrando, rep.paso, rep.velocidad, enInicio, fin]);

  // Callar al final del tramo del paso en curso.
  useEffect(() => {
    const a = audio.current;
    if (!a || !narracion || !activa) return;
    let raf = 0;
    const vigila = () => {
      if (!a.paused && a.currentTime >= fin(pasoRef.current)) a.pause();
      raf = requestAnimationFrame(vigila);
    };
    raf = requestAnimationFrame(vigila);
    return () => cancelAnimationFrame(raf);
  }, [narracion, activa, fin]);

  const alternar = useCallback(() => {
    setActiva((v) => {
      try { localStorage.setItem(CLAVE, v ? '0' : '1'); } catch { /* sin almacenamiento */ }
      return !v;
    });
  }, []);

  return { hay: !!narracion, activa, alternar };
}
