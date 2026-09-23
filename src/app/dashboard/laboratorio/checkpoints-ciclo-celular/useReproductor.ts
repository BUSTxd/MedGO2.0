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

/** Largo mínimo de un paso en la línea global: un paso sin acciones dura 0 ms
 *  y, sin piso, sería un segmento invisible imposible de alcanzar. */
export const LARGO_MIN = 600;

export type Reproductor = {
  paso: number;
  t: number;
  escena: Escena;
  /** El paso actual terminó de animarse. */
  terminado: boolean;
  /** Reproducción continua (encadena pasos). */
  auto: boolean;
  pausado: boolean;
  /** Lo que se ve: la escena avanza sola (un paso suelto o la vía entera).
   *  Mientras se arrastra la barra dice lo que pasará al soltar. */
  reproduciendo: boolean;
  velocidad: number;
  /** Línea global (ms): dónde empieza cada paso (suma de largos previos). */
  inicios: number[];
  duracionTotal: number;
  /** Instante global = inicios[paso] + t (al final del segmento si terminó). */
  tGlobal: number;
  /** La barra de tiempo tiene agarrado el reloj. */
  arrastrando: boolean;
  irA: (i: number, animar?: boolean) => void;
  siguiente: () => void;
  anterior: () => void;
  alternar: () => void;
  pausar: () => void;
  reiniciar: () => void;
  setVelocidad: (v: number) => void;
  /** Fija (paso, t) desde un instante global. Fuera de un arrastre, si no se
   *  estaba reproduciendo, deja la escena en pausa en ese fotograma. */
  buscar: (tGlobal: number) => void;
  empezarArrastre: () => void;
  terminarArrastre: () => void;
};

export function useReproductor(c: EscenarioCompilado, inicial = 0, opciones: { autoInicial?: boolean } = {}): Reproductor {
  const reducido = useMovimientoReducido();
  const [paso, setPaso] = useState(() => Math.min(Math.max(0, inicial), c.pasos.length - 1));
  const [t, setT] = useState(0);
  const [auto, setAuto] = useState(!!opciones.autoInicial);
  const [pausado, setPausado] = useState(false);
  const [velocidad, setVelocidad] = useState(1);
  // null = nadie arrastra; si no, si se reproducía al agarrar (como YouTube:
  // al soltar se retoma lo que había).
  const [arrastre, setArrastre] = useState<boolean | null>(null);
  const arrastrando = arrastre !== null;
  const pc = c.pasos[paso];
  const terminado = t >= pc.duracion;
  const ultimo = c.pasos.length - 1;
  // En continua sigue «reproduciendo» durante la pausa entre pasos; un paso
  // suelto (tras `irA`) reproduce mientras se anima.
  const reproduciendo = arrastrando
    ? arrastre
    : !pausado && (auto ? !(terminado && paso >= ultimo) : !terminado);

  const { inicios, duracionTotal } = useMemo(() => {
    const ini: number[] = [];
    let acc = 0;
    for (const p of c.pasos) { ini.push(acc); acc += Math.max(p.duracion, LARGO_MIN); }
    return { inicios: ini, duracionTotal: acc };
  }, [c.pasos]);
  const tGlobal = inicios[paso] + (terminado ? Math.max(pc.duracion, LARGO_MIN) : t);

  // Espejos para callbacks estables (el arrastre llama a varios en el mismo
  // evento, antes de que React vuelva a pintar).
  const tRef = useRef(t);
  tRef.current = t;
  const arrastreRef = useRef(arrastre);
  arrastreRef.current = arrastre;
  const reproduciendoRef = useRef(reproduciendo);
  reproduciendoRef.current = reproduciendo;

  // Bucle: avanza t mientras no esté terminado, pausado ni agarrado.
  useEffect(() => {
    if (terminado || pausado || arrastrando) return;
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
  }, [paso, terminado, pausado, arrastrando, velocidad, reducido, pc.duracion]);

  // Encadenar pasos en reproducción continua (nunca con la barra agarrada:
  // la escena solo sigue al puntero).
  useEffect(() => {
    if (!auto || !terminado || pausado || arrastrando) return;
    if (paso >= c.pasos.length - 1) { setAuto(false); return; }
    const id = setTimeout(() => { setPaso((p) => p + 1); setT(0); }, 1400 / velocidad);
    return () => clearTimeout(id);
  }, [auto, terminado, pausado, arrastrando, paso, c.pasos.length, velocidad]);

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

  // Play/pausa según lo que se ve. Pausar congela también un paso suelto a
  // mitad de animación; reproducir siempre es continuo (encadena pasos).
  const alternar = useCallback(() => {
    if (arrastreRef.current !== null) {
      // Con la barra agarrada solo cambia lo que pasará al soltar.
      const v = !arrastreRef.current;
      arrastreRef.current = v;
      setArrastre(v);
      return;
    }
    if (reproduciendo) { setPausado(true); return; }
    setPausado(false);
    setAuto(true);
    if (terminado && paso < ultimo) irA(paso + 1);
    else if (terminado) irA(0);
  }, [reproduciendo, terminado, paso, ultimo, irA]);

  const pausar = useCallback(() => { if (reproduciendoRef.current) setPausado(true); }, []);
  const reiniciar = useCallback(() => { setAuto(false); irA(0); }, [irA]);

  const buscar = useCallback((tg: number) => {
    const x = Math.min(Math.max(0, tg), duracionTotal);
    let j = 0;
    while (j < inicios.length - 1 && inicios[j + 1] <= x) j++;
    const tt = Math.min(x - inicios[j], c.pasos[j].duracion);
    tRef.current = tt;
    setPaso(j);
    setT(tt);
    // Buscar (con teclado) sin estar reproduciendo deja el fotograma quieto:
    // si no, el bucle «terminaría» solo la animación de un paso ya visto.
    if (arrastreRef.current === null && !reproduciendoRef.current) setPausado(true);
  }, [inicios, duracionTotal, c.pasos]);

  const empezarArrastre = useCallback(() => {
    if (arrastreRef.current !== null) return;
    arrastreRef.current = reproduciendoRef.current;
    setArrastre(reproduciendoRef.current);
  }, []);

  const terminarArrastre = useCallback(() => {
    const era = arrastreRef.current;
    if (era === null) return;
    arrastreRef.current = null;
    setArrastre(null);
    // Como YouTube: si se reproducía, sigue desde ahí (encadenando pasos);
    // si no, se queda en pausa en ese fotograma.
    if (era) { setPausado(false); setAuto(true); }
    else setPausado(true);
  }, []);

  const escena = useMemo(() => evaluar(pc, t), [pc, t]);

  return {
    paso, t, escena, terminado, auto, pausado, reproduciendo, velocidad, inicios, duracionTotal, tGlobal, arrastrando,
    irA, siguiente, anterior, alternar, pausar, reiniciar, setVelocidad, buscar, empezarArrastre, terminarArrastre,
  };
}
