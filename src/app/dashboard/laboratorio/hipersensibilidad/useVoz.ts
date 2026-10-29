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
  // El navegador no deja sonar sin un gesto (p. ej. al recargar la página, que arranca
  // el capítulo solo): el capítulo queda en pausa hasta que el alumno pulse.
  const [bloqueada, setBloqueada] = useState(false);
  // Ya sonó una vez este audio: los arranques siguientes no esperan.
  const arrancado = useRef(false);

  useEffect(() => {
    try { if (localStorage.getItem(CLAVE) === '0') setActiva(false); } catch { /* sin almacenamiento */ }
  }, []);

  // Deja el capítulo quieto hasta que la voz SUENA: hasta que su reloj (`currentTime`)
  // avanza de verdad. Ni `canplay` ni `playing` bastan: al pasar de Anafilaxia al tipo II
  // el audio se crea y se arranca a la vez, `playing` llega con el primer trozo y el
  // sonido se queda enseguida esperando datos (`waiting`) mientras la barra seguía sola.
  // Al recargar no pasaba porque, hasta el clic, el audio ya se había bajado entero.
  const esperarVoz = useCallback((a: HTMLAudioElement) => {
    if (espera.current) return;
    const desde = a.currentTime;
    let raf = 0, t = 0;
    const soltar = () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      a.removeEventListener('error', listo);
      espera.current = null;
    };
    function listo() {
      soltar();
      arrancado.current = true;
      if (!repRef.current.reproduciendo) repRef.current.alternar();
    }
    const mirar = () => {
      if (!a.paused && a.currentTime > desde + 0.03) listo();
      else raf = requestAnimationFrame(mirar);
    };
    espera.current = listo;
    repRef.current.pausar();
    a.addEventListener('error', listo);
    t = window.setTimeout(listo, ESPERA_MAX);
    raf = requestAnimationFrame(mirar);
    a.play().catch((e: DOMException) => {
      if (e.name !== 'NotAllowedError') return;
      // El navegador pide un gesto: sin voz no avanza, y al pulsar arrancan juntas.
      soltar();
      setBloqueada(true);
    });
  }, []);

  // Solo se baja con la voz encendida (es lo que más pesa del capítulo).
  useEffect(() => {
    if (!narracion || !activa) return;
    const a = new Audio();
    a.preload = 'auto';
    a.src = a.canPlayType('audio/webm; codecs=opus') ? narracion.webm : narracion.mp3;
    audio.current = a;
    arrancado.current = false;
    const habla = () => grimi?.(true);
    const calla = () => grimi?.(false);
    // La voz se corta a mitad por falta de datos: la animación la espera.
    const atasco = () => {
      calla();
      if (!a.paused && repRef.current.reproduciendo && !repRef.current.arrastrando) esperarVoz(a);
    };
    a.addEventListener('playing', habla);
    a.addEventListener('pause', calla);
    a.addEventListener('ended', calla);
    a.addEventListener('waiting', atasco);
    return () => {
      espera.current?.();
      a.removeEventListener('playing', habla);
      a.removeEventListener('pause', calla);
      a.removeEventListener('ended', calla);
      a.removeEventListener('waiting', atasco);
      a.pause(); a.removeAttribute('src'); a.load(); audio.current = null;
      calla();
    };
  }, [narracion, activa, grimi, esperarVoz]);

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
    // Primer arranque del audio (al entrar al capítulo) o sin datos para sonar ya: si
    // la animación no esperase, cualquier demora del navegador (bajarlo, decodificarlo,
    // arrancar el sonido) sería un retraso de la voz durante todo el capítulo.
    if (!arrancado.current || a.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      esperarVoz(a);
      return;
    }
    a.play().catch((e: DOMException) => {
      if (e.name !== 'NotAllowedError') return;
      repRef.current.pausar();
      setBloqueada(true);
    });
  }, [narracion, activa, rep.reproduciendo, rep.arrastrando, rep.paso, rep.auto, rep.velocidad, enInicio, esperarVoz]);

  /** Llamarlo DENTRO del clic que va a reproducir: el navegador da permiso al audio
   *  (Safari lo exige en el propio gesto) y el efecto de arriba lo arranca donde toca. */
  const desbloquear = useCallback(() => {
    setBloqueada(false);
    const a = audio.current;
    if (!a || !a.paused) return;
    a.play().catch(() => { /* lo interrumpe el pause de abajo */ });
    a.pause();
  }, []);

  const alternar = useCallback(() => {
    setActiva((v) => {
      try { localStorage.setItem(CLAVE, v ? '0' : '1'); } catch { /* sin almacenamiento */ }
      return !v;
    });
  }, []);

  return { hay: !!narracion, activa, alternar, desbloquear, bloqueada: bloqueada && activa };
}
