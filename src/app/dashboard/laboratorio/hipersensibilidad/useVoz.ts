'use client';
// Voz grabada de un capítulo: un solo audio que suena DE CORRIDO mientras el
// capítulo se reproduce entero, sin cortarse entre pasos. Solo salta a la marca
// de un paso (`marcas`) cuando el alumno cambia de sitio a mano: anterior,
// siguiente, la barra de tiempo, reiniciar o encender la voz a mitad.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Narracion } from '@/lib/data/hipersensibilidad/tipos';
import type { Reproductor } from './useReproductor';
import { useGrimiVoz } from '@/components/estudio/grimiVoz';

const CLAVE = 'medgo-hiper-voz';
/** Lo más que se espera a que cargue la voz antes de arrancar sin ella (ms). */
const ESPERA_MAX = 5000;

export function useVoz(narracion: Narracion | undefined, rep: Reproductor) {
  const [activa, setActiva] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);
  const tRef = useRef(rep.t);
  tRef.current = rep.t;
  const previo = useRef({ paso: rep.paso, arrastrando: false });
  // En `/estudio`, GRIMI habla mientras suena la voz (en `/dashboard` no hay GRIMI).
  const grimi = useGrimiVoz();
  const repRef = useRef(rep);
  repRef.current = rep;
  // El capítulo en pausa a la espera de que cargue la voz: quita la espera y lo retoma.
  const espera = useRef<null | (() => void)>(null);

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
    const habla = () => grimi?.(true);
    const calla = () => grimi?.(false);
    a.addEventListener('playing', habla);
    a.addEventListener('pause', calla);
    a.addEventListener('ended', calla);
    a.addEventListener('waiting', calla);
    return () => {
      espera.current?.();
      a.removeEventListener('playing', habla);
      a.removeEventListener('pause', calla);
      a.removeEventListener('ended', calla);
      a.removeEventListener('waiting', calla);
      a.pause(); a.removeAttribute('src'); a.load(); audio.current = null;
      calla();
    };
  }, [narracion, activa, grimi]);

  const enInicio = rep.t === 0;
  useEffect(() => {
    const a = audio.current;
    const p = previo.current;
    previo.current = { paso: rep.paso, arrastrando: rep.arrastrando };
    if (!a || !narracion) return;
    if (!activa || !rep.reproduciendo || rep.arrastrando) { if (!espera.current) a.pause(); return; }
    a.playbackRate = rep.velocidad;
    const objetivo = narracion.marcas[rep.paso] + tRef.current / 1000;
    // De corrido = el capítulo avanza solo al paso siguiente (o se retoma tras
    // una pausa): el audio sigue donde iba aunque vaya por delante o por detrás.
    const deCorrido = rep.auto && !p.arrastrando && (rep.paso === p.paso || rep.paso === p.paso + 1);
    const reinicio = enInicio && rep.paso === 0 && a.currentTime > (narracion.marcas[1] ?? 1);
    const recien = a.currentTime === 0 && objetivo > 0.5;
    if (!deCorrido || reinicio || recien) a.currentTime = objetivo;
    else if (a.ended) return;
    // Sin datos para sonar ya (al entrar al capítulo, el audio aún se está bajando): la
    // animación espera a la voz. Si no, la voz arrancaría tarde e iría con retraso.
    if (a.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      if (espera.current) return;
      repRef.current.pausar();
      let t = 0;
      const listo = () => {
        clearTimeout(t);
        a.removeEventListener('canplay', listo);
        a.removeEventListener('error', listo);
        espera.current = null;
        if (!repRef.current.reproduciendo) repRef.current.alternar();
      };
      espera.current = listo;
      a.addEventListener('canplay', listo);
      a.addEventListener('error', listo);
      t = window.setTimeout(listo, ESPERA_MAX);
      return;
    }
    a.play().catch(() => { /* el navegador exige un gesto: el próximo «Reproducir» lo da */ });
  }, [narracion, activa, rep.reproduciendo, rep.arrastrando, rep.paso, rep.auto, rep.velocidad, enInicio]);

  const alternar = useCallback(() => {
    setActiva((v) => {
      try { localStorage.setItem(CLAVE, v ? '0' : '1'); } catch { /* sin almacenamiento */ }
      return !v;
    });
  }, []);

  return { hay: !!narracion, activa, alternar };
}
