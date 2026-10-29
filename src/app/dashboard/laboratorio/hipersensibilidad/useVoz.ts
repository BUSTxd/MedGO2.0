'use client';
// Voz grabada de un capítulo: un solo audio atado a la animación PASO A PASO.
// La voz lee más rápido o más lento que lo que dura la animación de cada paso
// (el tipo II: 99,9 s de voz para 124,7 s de animación), así que de corrido se
// adelantaba. Ahora la frase de un paso acaba en la marca del siguiente
// (`marcas`, sacadas de las pausas del audio): si la voz llega antes, se apaga
// con un fundido en esa pausa y espera a que la animación entre al paso
// siguiente; si llega después, el paso no encadena hasta que la voz llega.
// Cambiar de sitio a mano (anterior, siguiente, barra, reiniciar, encender la
// voz a mitad) la lleva a la marca del paso más lo que lleve animado.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Narracion } from '@/lib/data/hipersensibilidad/tipos';
import type { Reproductor } from './useReproductor';
import { useGrimiVoz } from '@/components/estudio/grimiVoz';

const CLAVE = 'medgo-hiper-voz';
/** Lo más que se espera a que cargue la voz antes de arrancar sin ella (ms). */
const ESPERA_MAX = 5000;
/** La voz se apaga este rato (s) antes de la marca: las marcas caen ~50 ms
 *  antes de que empiece la frase siguiente, al final de la pausa. */
const CORTE_ANTES = 0.02;
/** Fundidos (ms): al callar entre frases, al retomar y al pausar a mano. */
const FUNDIDO_SALIDA = 140;
const FUNDIDO_ENTRADA = 60;
const FUNDIDO_PAUSA = 90;
/** Si el reloj del audio no avanza en este rato (ms), el paso deja de esperarlo. */
const ATASCO_MAX = 1500;

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
  // Paso cuya frase ya se dijo entera: la voz calla hasta que la animación pase al siguiente.
  const callado = useRef<number | null>(null);
  // El paso está esperando a la voz (espejo de `rep.retener`, para no repetir el aviso).
  const retenido = useRef(false);
  const fundido = useRef(0);

  useEffect(() => {
    try { if (localStorage.getItem(CLAVE) === '0') setActiva(false); } catch { /* sin almacenamiento */ }
  }, []);

  const retener = useCallback((r: boolean) => {
    if (retenido.current === r) return;
    retenido.current = r;
    repRef.current.retener(r);
  }, []);

  /** Lleva el volumen a `hasta` en `ms`: sin cortes secos al callar o retomar
   *  (en iOS el volumen es de solo lectura y queda el corte, siempre en una pausa). */
  const fundir = useCallback((a: HTMLAudioElement, hasta: number, ms: number, alAcabar?: () => void) => {
    cancelAnimationFrame(fundido.current);
    const desde = a.volume, t0 = performance.now();
    const paso = (ahora: number) => {
      const k = Math.min(1, Math.max(0, (ahora - t0) / ms));
      a.volume = desde + (hasta - desde) * k;
      if (k < 1) fundido.current = requestAnimationFrame(paso);
      else alAcabar?.();
    };
    fundido.current = requestAnimationFrame(paso);
  }, []);

  // Deja el capítulo quieto hasta que la voz SUENA: hasta que su reloj (`currentTime`)
  // avanza de verdad. Ni `canplay` ni `playing` bastan: al pasar de Anafilaxia al tipo II
  // el audio se crea y se arranca a la vez, `playing` llega con el primer trozo y el
  // sonido se queda enseguida esperando datos (`waiting`) mientras la barra seguía sola.
  // Al recargar no pasaba porque, hasta el clic, el audio ya se había bajado entero.
  const esperarVoz = useCallback((a: HTMLAudioElement) => {
    if (espera.current) return;
    cancelAnimationFrame(fundido.current);
    a.volume = 1;
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
    callado.current = null;
    let raf = 0, ultimoT = -1, desdeT = 0;
    // Mientras suena: ¿ya dijo la frase de este paso? ¿o la animación tiene que esperarla?
    const vigilar = () => {
      raf = 0;
      if (a.paused || a.ended) { retener(false); return; }
      const r = repRef.current;
      const limite = narracion.marcas[r.paso + 1];
      if (limite === undefined || r.arrastrando || callado.current !== null) retener(false);
      else if (a.currentTime >= limite - CORTE_ANTES - (FUNDIDO_SALIDA / 1000) * a.playbackRate) {
        retener(false);
        // La animación ya acabó el paso y está por encadenar: la voz sigue sin cortarse.
        // Si no, se apaga en la pausa y espera a que la animación llegue.
        if (!(r.auto && r.terminado)) {
          callado.current = r.paso;
          fundir(a, 0, FUNDIDO_SALIDA, () => a.pause());
        }
      } else {
        const ahora = performance.now();
        if (a.currentTime !== ultimoT) { ultimoT = a.currentTime; desdeT = ahora; }
        retener(ahora - desdeT < ATASCO_MAX);
      }
      raf = requestAnimationFrame(vigilar);
    };
    const habla = () => {
      grimi?.('habla');
      ultimoT = -1;
      if (!raf) raf = requestAnimationFrame(vigilar);
    };
    // Callada entre dos frases, GRIMI cierra la boca pero no se pone a seguir al puntero.
    const calla = () => grimi?.(callado.current !== null && repRef.current.reproduciendo ? 'espera' : false);
    // La voz se corta a mitad por falta de datos: la animación la espera.
    const atasco = () => {
      calla();
      if (!a.paused && repRef.current.reproduciendo && !repRef.current.arrastrando) esperarVoz(a);
    };
    // Con la pestaña oculta la animación se congela (requestAnimationFrame) y la voz seguiría sola.
    const oculta = () => { if (document.hidden) repRef.current.pausar(); };
    a.addEventListener('playing', habla);
    a.addEventListener('pause', calla);
    a.addEventListener('ended', calla);
    a.addEventListener('waiting', atasco);
    document.addEventListener('visibilitychange', oculta);
    return () => {
      espera.current?.();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fundido.current);
      retener(false);
      a.removeEventListener('playing', habla);
      a.removeEventListener('pause', calla);
      a.removeEventListener('ended', calla);
      a.removeEventListener('waiting', atasco);
      document.removeEventListener('visibilitychange', oculta);
      a.pause(); a.removeAttribute('src'); a.load(); audio.current = null;
      grimi?.(false);
    };
  }, [narracion, activa, grimi, esperarVoz, fundir, retener]);

  const enInicio = rep.t === 0;
  useEffect(() => {
    const a = audio.current;
    const p = previo.current;
    previo.current = { paso: rep.paso, arrastrando: rep.arrastrando };
    if (!a || !narracion) return;
    if (!activa || !rep.reproduciendo || rep.arrastrando) {
      if (!espera.current && !a.paused) fundir(a, 0, FUNDIDO_PAUSA, () => a.pause());
      else if (a.paused) grimi?.(false);
      return;
    }
    a.playbackRate = rep.velocidad;
    // De corrido = el capítulo avanza solo al paso siguiente (o se retoma tras una pausa).
    const deCorrido = rep.auto && !p.arrastrando && (rep.paso === p.paso || rep.paso === p.paso + 1);
    // La frase de este paso ya se dijo: sigue callada hasta que la animación pase al siguiente.
    if (deCorrido && callado.current === rep.paso) return;
    const objetivo = narracion.marcas[rep.paso] + tRef.current / 1000;
    const limite = narracion.marcas[rep.paso + 1];
    const reinicio = enInicio && rep.paso === 0 && a.currentTime > (narracion.marcas[1] ?? 1);
    const recien = a.currentTime === 0 && objetivo > 0.5;
    if (!deCorrido || reinicio || recien || callado.current !== null) {
      callado.current = null;
      // La animación va más allá de lo que dura la frase del paso: la voz espera al siguiente.
      if (limite !== undefined && objetivo >= limite - CORTE_ANTES) {
        callado.current = rep.paso;
        if (!a.paused) fundir(a, 0, FUNDIDO_PAUSA, () => a.pause());
        return;
      }
      cancelAnimationFrame(fundido.current);
      if (arrancado.current) a.volume = 0;
      a.currentTime = objetivo;
    } else if (a.ended) return;
    // Primer arranque del audio (al entrar al capítulo) o sin datos para sonar ya: si
    // la animación no esperase, cualquier demora del navegador (bajarlo, decodificarlo,
    // arrancar el sonido) sería un retraso de la voz durante todo el capítulo.
    if (!arrancado.current || a.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      esperarVoz(a);
      return;
    }
    fundir(a, 1, FUNDIDO_ENTRADA);
    a.play().catch((e: DOMException) => {
      if (e.name !== 'NotAllowedError') return;
      repRef.current.pausar();
      setBloqueada(true);
    });
  }, [narracion, activa, rep.reproduciendo, rep.arrastrando, rep.paso, rep.auto, rep.velocidad, enInicio, esperarVoz, fundir, grimi]);

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
