'use client';
// Reloj de la escena. Solo guarda (paso, t): la escena sale de `evaluar`, así
// que retroceder o saltar no deja actores a medio camino por construcción.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { evaluar, type EscenarioCompilado, type Escena } from '@/lib/ciclo-celular/motor';

export const VELOCIDADES = [0.5, 1, 1.5, 2] as const;

export function useMovimientoReducido(): boolean {
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducido(mq.matches);
    const on = () => setReducido(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reducido;
}

export type Reproductor = {
  paso: number;
  t: number;
  escena: Escena;
  /** El paso actual terminó de animarse. */
  terminado: boolean;
  /** Reproducción continua (encadena pasos). */
  auto: boolean;
  pausado: boolean;
  velocidad: number;
  irA: (i: number, animar?: boolean) => void;
  siguiente: () => void;
  anterior: () => void;
  alternar: () => void;
  pausar: () => void;
  reiniciar: () => void;
  setVelocidad: (v: number) => void;
};

export function useReproductor(c: EscenarioCompilado, inicial = 0, opciones: { autoInicial?: boolean } = {}): Reproductor {
  const reducido = useMovimientoReducido();
  const [paso, setPaso] = useState(() => Math.min(Math.max(0, inicial), c.pasos.length - 1));
  const [t, setT] = useState(0);
  const [auto, setAuto] = useState(!!opciones.autoInicial);
  const [pausado, setPausado] = useState(false);
  const [velocidad, setVelocidad] = useState(1);
  const pc = c.pasos[paso];
  const terminado = t >= pc.duracion;

  // Bucle: avanza t mientras no esté terminado ni pausado.
  const tRef = useRef(t);
  tRef.current = t;
  useEffect(() => {
    if (terminado || pausado) return;
    if (reducido) { setT(pc.duracion); return; }
    let raf = 0, prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      const nt = Math.min(pc.duracion, tRef.current + dt * velocidad);
      setT(nt);
      if (nt < pc.duracion) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paso, terminado, pausado, velocidad, reducido, pc.duracion]);

  // Encadenar pasos en reproducción continua.
  useEffect(() => {
    if (!auto || !terminado || pausado) return;
    if (paso >= c.pasos.length - 1) { setAuto(false); return; }
    const id = setTimeout(() => { setPaso((p) => p + 1); setT(0); }, 1400 / velocidad);
    return () => clearTimeout(id);
  }, [auto, terminado, pausado, paso, c.pasos.length, velocidad]);

  const irA = useCallback((i: number, animar = true) => {
    const j = Math.min(Math.max(0, i), c.pasos.length - 1);
    setPaso(j);
    setT(animar ? 0 : c.pasos[j].duracion);
    setPausado(false);
  }, [c.pasos]);

  const siguiente = useCallback(() => {
    setAuto(false);
    if (paso < c.pasos.length - 1) irA(paso + 1);
  }, [paso, c.pasos.length, irA]);

  const anterior = useCallback(() => {
    setAuto(false);
    // Primer «Anterior» a mitad de un paso: lo reinicia; si ya estaba al
    // principio, va al anterior.
    if (tRef.current > 400 && !terminado) irA(paso);
    else if (paso > 0) irA(paso - 1);
  }, [paso, terminado, irA]);

  const alternar = useCallback(() => {
    if (auto && !pausado) { setPausado(true); return; }
    if (pausado) { setPausado(false); setAuto(true); return; }
    setAuto(true);
    if (terminado && paso < c.pasos.length - 1) irA(paso + 1);
    else if (terminado) irA(0);
  }, [auto, pausado, terminado, paso, c.pasos.length, irA]);

  const pausar = useCallback(() => { if (!terminado || auto) setPausado(true); }, [terminado, auto]);
  const reiniciar = useCallback(() => { setAuto(false); irA(0); }, [irA]);

  const escena = useMemo(() => evaluar(pc, t), [pc, t]);

  return { paso, t, escena, terminado, auto, pausado, velocidad, irA, siguiente, anterior, alternar, pausar, reiniciar, setVelocidad };
}
