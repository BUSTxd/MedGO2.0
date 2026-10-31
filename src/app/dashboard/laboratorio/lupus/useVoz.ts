'use client';
// Voz grabada de un capítulo. Aquí la voz va primero (cada paso dura lo que su
// frase: `duracionesVoz` del motor), así que el audio y la animación son la misma
// línea de tiempo y EL AUDIO ES EL RELOJ: mientras suena, el instante de la escena
// se lee de `currentTime`, no se cuenta aparte. Por eso no hay nada que resincronizar:
// si la red atasca la voz o tarda en arrancar, la animación espera sola; si un
// fotograma tarda, no se queda atrás. Mover la barra, saltar de paso o reiniciar
// mueve los dos a la vez (`saltar`, en el propio gesto). Sin voz (apagada o rota),
// el reproductor vuelve a su reloj de siempre.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Narracion } from '@/lib/data/lupus/tipos';
import type { Reproductor } from './useReproductor';
import { useGrimiVoz } from '@/components/estudio/grimiVoz';
import { useVolumen } from '../hipersensibilidad/useVolumen';
import { ANTES_DEL_FINAL, liberarVoz, precargarVoz, tomarVoz } from './vozCarga';

const CLAVE = 'medgo-lupus-voz';
/** Sin avanzar este rato (ms) la voz se da por perdida y la animación sigue sin ella. */
const ESPERA_MAX = 5000;
/** Cuánto (ms) tiene que durar una espera para avisar: las breves no se avisan. */
const AVISO_CARGA = 350;
/** Fundidos (ms): al arrancar y al pausar, para que no suene un corte seco. */
const FUNDIDO_ENTRADA = 60;
const FUNDIDO_PAUSA = 90;

/** `siguiente`: la voz del capítulo que viene (si está abierto), para precargarla. */
export function useVoz(narracion: Narracion | undefined, rep: Reproductor, siguiente?: Narracion) {
  const [activa, setActiva] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);
  const { volumen, ajustable, ganancia, aplicar, cambiar, restaurar } = useVolumen(audio);
  // En `/estudio`, GRIMI habla mientras suena la voz (en `/dashboard` no hay GRIMI).
  const grimi = useGrimiVoz();
  const repRef = useRef(rep);
  repRef.current = rep;
  // El navegador no deja sonar sin un gesto (p. ej. al recargar la página, que arranca
  // el capítulo solo): el capítulo queda en pausa hasta que el alumno pulse.
  const [bloqueada, setBloqueada] = useState(false);
  // La voz tiene que sonar y no puede (bajando o buscando): la animación la está esperando.
  const [cargando, setCargando] = useState(false);
  // Lo que el reproductor pide ahora: distingue una pausa nuestra de una ajena.
  const debeSonar = useRef(false);
  // Desde cuándo no avanza el audio (ms); se reinicia cada vez que debe sonar.
  const quieto = useRef(0);
  const fundido = useRef(0);
  const siguienteRef = useRef(siguiente);
  siguienteRef.current = siguiente;

  useEffect(() => {
    try { if (localStorage.getItem(CLAVE) === '0') setActiva(false); } catch { /* sin almacenamiento */ }
  }, []);

  /** Lleva el volumen a `hasta` en `ms`: sin cortes secos al pausar o retomar
   *  (en iOS el volumen es de solo lectura y queda el corte). */
  const fundir = useCallback((a: HTMLAudioElement, hasta: number, ms: number, alAcabar?: () => void) => {
    cancelAnimationFrame(fundido.current);
    const desde = ganancia.current, t0 = performance.now();
    const paso = (ahora: number) => {
      const k = Math.min(1, Math.max(0, (ahora - t0) / ms));
      aplicar(a, desde + (hasta - desde) * k);
      if (k < 1) fundido.current = requestAnimationFrame(paso);
      else alAcabar?.();
    };
    fundido.current = requestAnimationFrame(paso);
  }, [aplicar, ganancia]);

  // Solo se baja con la voz encendida (es lo que más pesa del capítulo), y solo la
  // de este capítulo: la del siguiente se pide cuando faltan ANTES_DEL_FINAL s (vozCarga.ts).
  useEffect(() => {
    if (!narracion || !activa) return;
    const a = tomarVoz(narracion);
    aplicar(a, 1);
    audio.current = a;
    const r0 = repRef.current;
    a.currentTime = narracion.marcas[r0.paso] + r0.t / 1000;
    let ultimoT = a.currentTime;
    // La voz se dio por perdida y la animación sigue sola: al volver, se pone a su altura.
    let perdida = false;
    const fijar = (paso: number, t: number) => {
      a.currentTime = narracion.marcas[paso] + t / 1000;
      ultimoT = a.currentTime;
      quieto.current = performance.now();
    };
    r0.reloj.current = {
      saltar: (paso, t) => { perdida = false; fijar(paso, t); },
      enPaso: (paso) => {
        if (a.error) return null;
        if (a.ended) return Infinity;
        const ahora = performance.now();
        if (a.currentTime !== ultimoT) {
          ultimoT = a.currentTime;
          quieto.current = ahora;
          if (perdida) { perdida = false; const r = repRef.current; fijar(r.paso, r.t); }
        } else if (ahora - quieto.current > ESPERA_MAX) perdida = true;
        return perdida ? null : (a.currentTime - narracion.marcas[paso]) * 1000;
      },
    };
    let aviso = 0;
    const espera = () => {
      clearTimeout(aviso);
      grimi?.('espera');
      aviso = window.setTimeout(() => { if (debeSonar.current) setCargando(true); }, AVISO_CARGA);
    };
    const yaSuena = () => { clearTimeout(aviso); setCargando(false); };
    const habla = () => { yaSuena(); grimi?.('habla'); };
    const calla = () => {
      yaSuena();
      grimi?.(false);
      // La pausó otro (el sistema, unos audífonos que se quitan): la animación no se queda sola.
      if (a.paused && !a.ended && debeSonar.current) repRef.current.pausar();
    };
    const avanza = () => {
      if (narracion.duracion - a.currentTime <= ANTES_DEL_FINAL) precargarVoz(siguienteRef.current);
    };
    // Con la pestaña oculta la animación se congela (requestAnimationFrame) y la voz seguiría sola.
    const oculta = () => { if (document.hidden) repRef.current.pausar(); };
    a.addEventListener('playing', habla);
    a.addEventListener('pause', calla);
    a.addEventListener('ended', calla);
    a.addEventListener('waiting', espera);
    a.addEventListener('seeking', espera);
    a.addEventListener('seeked', yaSuena);
    a.addEventListener('timeupdate', avanza);
    document.addEventListener('visibilitychange', oculta);
    return () => {
      clearTimeout(aviso);
      cancelAnimationFrame(fundido.current);
      r0.reloj.current = null;
      setCargando(false);
      a.removeEventListener('playing', habla);
      a.removeEventListener('pause', calla);
      a.removeEventListener('ended', calla);
      a.removeEventListener('waiting', espera);
      a.removeEventListener('seeking', espera);
      a.removeEventListener('seeked', yaSuena);
      a.removeEventListener('timeupdate', avanza);
      document.removeEventListener('visibilitychange', oculta);
      liberarVoz(a); audio.current = null;
      grimi?.(false);
    };
  }, [narracion, activa, grimi, aplicar]);

  // Suena solo mientras la escena corre y nadie tiene agarrada la barra.
  const suena = rep.reproduciendo && !rep.arrastrando;
  useEffect(() => {
    const a = audio.current;
    debeSonar.current = suena;
    if (!a) return;
    a.playbackRate = rep.velocidad;
    if (!suena) {
      setCargando(false);
      // Con la pestaña oculta no hay fotogramas: un fundido no acabaría nunca.
      if (document.hidden) { cancelAnimationFrame(fundido.current); a.pause(); }
      else if (!a.paused) fundir(a, 0, FUNDIDO_PAUSA, () => a.pause());
      return;
    }
    quieto.current = performance.now();
    if (!a.paused) { fundir(a, 1, FUNDIDO_ENTRADA); return; }
    cancelAnimationFrame(fundido.current);
    aplicar(a, 0);
    fundir(a, 1, FUNDIDO_ENTRADA);
    a.play().catch((e: DOMException) => {
      if (e.name !== 'NotAllowedError') return;
      repRef.current.pausar();
      setBloqueada(true);
    });
  }, [narracion, activa, suena, rep.velocidad, fundir, aplicar]);

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
    // Con la barra en cero el altavoz devuelve el volumen, no apaga una voz que ya no se oye.
    if (restaurar()) return;
    setActiva((v) => {
      try { localStorage.setItem(CLAVE, v ? '0' : '1'); } catch { /* sin almacenamiento */ }
      return !v;
    });
  }, [restaurar]);

  // Subir la barra con la voz apagada la enciende.
  const cambiarVolumen = useCallback((v: number) => {
    cambiar(v);
    if (v > 0 && !activa) {
      setActiva(true);
      try { localStorage.setItem(CLAVE, '1'); } catch { /* sin almacenamiento */ }
    }
  }, [cambiar, activa]);

  return { hay: !!narracion, activa, alternar, desbloquear, bloqueada: bloqueada && activa, cargando: cargando && activa, volumen: activa ? volumen : 0, volumenAjustable: ajustable, cambiarVolumen };
}
