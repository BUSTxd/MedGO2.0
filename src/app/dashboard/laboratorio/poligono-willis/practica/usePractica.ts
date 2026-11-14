'use client';
// Estado de la práctica del lab Polígono de Willis 3D (sin pintar nada). Copia
// el flujo de la de Médula Espinal 3D:
//
//   cargando → inicio → [volteo → responder → corregida] × 10 → resultados
//
// La escena (postura, qué se puede tocar y qué se marca) sale de aquí; el
// lienzo y el panel solo la pintan.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  armarRonda, cargarBanco, filtrar, guardarResultado, leerAvance, progreso,
  type Avance, type Filtro,
} from '@/lib/willis-practica/sesion';
import type { BancoWP, CategoriaWP, PreguntaWP, TipoWP } from '@/lib/willis-practica/tipos';
import type { ArteriaId } from '../engine/anatomia';

export type FasePractica = 'cargando' | 'error' | 'inicio' | 'jugando' | 'resultados';
export type PasoPregunta = 'volteo' | 'responder' | 'corregida';

export interface RespuestaWP {
  pregunta: PreguntaWP;
  ok: boolean;
  /** Alternativa elegida (preguntas de alternativas). */
  elegida?: number;
  /** Arteria tocada (preguntas de señalar). */
  tocado?: ArteriaId;
  /** Se respondió después de ver la pista. */
  pista?: boolean;
}

/** Lo que la escena tiene que pintar mientras se practica. */
export interface EscenaPractica {
  postura: 'atlas' | 'real';
  /** Se pueden tocar las arterias para responder. */
  interactivo: boolean;
  /** Arterias en verde (la respuesta) y en rojo (lo tocado por error). */
  ok: Set<ArteriaId>;
  mal: Set<ArteriaId>;
}

const VOLTEO_MS = 1000;
/** Mínimo de la animación de carga, igual que la práctica de médula. */
const CARGA_MIN = 1300;

export function usePractica(activa: boolean, reducido: boolean) {
  const [fase, setFase] = useState<FasePractica>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [banco, setBanco] = useState<BancoWP | null>(null);
  const [avance, setAvance] = useState<Avance>({ resultados: {} });
  const [filtro, setFiltro] = useState<Filtro>({ categorias: ['anatomia', 'territorios', 'clinico'], tipos: ['teorica', 'caso'] });
  const [ronda, setRonda] = useState<PreguntaWP[]>([]);
  const [i, setI] = useState(0);
  const [paso, setPaso] = useState<PasoPregunta>('volteo');
  const [respuestas, setRespuestas] = useState<RespuestaWP[]>([]);
  const [intento, setIntento] = useState(0);
  /** Pista de la pregunta en curso: vista o no, y la alternativa tachada. */
  const [pistaVista, setPistaVista] = useState(false);
  const [descartada, setDescartada] = useState<number | null>(null);

  // ── Carga del banco al entrar ──
  useEffect(() => {
    if (!activa) return;
    const abort = new AbortController();
    setFase('cargando');
    setError(null);
    const t0 = performance.now();
    cargarBanco(abort.signal)
      .then(async (b) => {
        const falta = CARGA_MIN - (performance.now() - t0);
        if (falta > 0 && !reducido) await new Promise((ok) => setTimeout(ok, falta));
        if (abort.signal.aborted) return;
        setBanco(b);
        setAvance(leerAvance());
        setFase('inicio');
      })
      .catch((e: unknown) => {
        if (abort.signal.aborted) return;
        setError(e instanceof Error ? e.message : 'No se pudo cargar la práctica.');
        setFase('error');
      });
    return () => abort.abort();
  }, [activa, intento, reducido]);

  // ── Volteo de la tarjeta → se puede responder ──
  useEffect(() => {
    if (fase !== 'jugando' || paso !== 'volteo') return;
    const t = setTimeout(() => setPaso('responder'), reducido ? 0 : VOLTEO_MS);
    return () => clearTimeout(t);
  }, [fase, paso, i, reducido]);

  const pool = useMemo(() => (banco ? filtrar(banco, filtro) : []), [banco, filtro]);
  const prog = useMemo(() => progreso(pool, avance), [pool, avance]);
  const actual = fase === 'jugando' ? ronda[i] ?? null : null;
  const respuesta = paso === 'corregida' ? respuestas[i] ?? null : null;

  const empezar = useCallback((soloFalladas = false) => {
    const r = armarRonda(pool, leerAvance(), soloFalladas);
    if (!r.length) return;
    setRonda(r);
    setI(0);
    setRespuestas([]);
    setPistaVista(false);
    setDescartada(null);
    setPaso('volteo');
    setFase('jugando');
  }, [pool]);

  const registrar = useCallback((r: RespuestaWP) => {
    const conPista = { ...r, pista: pistaVista };
    setRespuestas((prev) => { const n = [...prev]; n[i] = conPista; return n; });
    setAvance(guardarResultado(r.pregunta.id, r.ok));
    setPaso('corregida');
  }, [i, pistaVista]);

  const responderOpcion = useCallback((elegida: number) => {
    if (!actual || actual.forma !== 'opciones' || paso !== 'responder') return;
    registrar({ pregunta: actual, ok: elegida === actual.correcta, elegida });
  }, [actual, paso, registrar]);

  const responderSenalar = useCallback((id: ArteriaId) => {
    if (!actual || actual.forma !== 'senalar' || paso !== 'responder') return;
    registrar({ pregunta: actual, ok: actual.objetivo.includes(id), tocado: id });
  }, [actual, paso, registrar]);

  const siguiente = useCallback(() => {
    if (paso !== 'corregida') return;
    if (i + 1 >= ronda.length) { setFase('resultados'); return; }
    setI(i + 1);
    setPistaVista(false);
    setDescartada(null);
    setPaso('volteo');
  }, [paso, i, ronda.length]);

  /** Pista: en las de alternativas tacha una incorrecta al azar. */
  const verPista = useCallback(() => {
    if (!actual || paso !== 'responder' || pistaVista) return;
    setPistaVista(true);
    if (actual.forma === 'opciones') {
      const malas = actual.opciones.map((_, k) => k).filter((k) => k !== actual.correcta);
      setDescartada(malas[Math.floor(Math.random() * malas.length)]);
    }
  }, [actual, paso, pistaVista]);

  const alInicio = useCallback(() => { setFase('inicio'); setRonda([]); setRespuestas([]); }, []);
  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  const alternarCategoria = useCallback((c: CategoriaWP) => {
    setFiltro((f) => {
      const tiene = f.categorias.includes(c);
      if (tiene && f.categorias.length === 1) return f; // al menos una
      return { ...f, categorias: tiene ? f.categorias.filter((x) => x !== c) : [...f.categorias, c] };
    });
  }, []);
  const elegirTipos = useCallback((tipos: TipoWP[]) => setFiltro((f) => ({ ...f, tipos })), []);

  // ── Escena ──
  const escena = useMemo<EscenaPractica | null>(() => {
    if (!actual) return null;
    const ok = new Set<ArteriaId>();
    const mal = new Set<ArteriaId>();
    if (respuesta) {
      const marca = actual.forma === 'senalar' ? actual.objetivo : actual.resaltar;
      marca?.forEach((id) => ok.add(id));
      if (respuesta.tocado && !respuesta.ok) mal.add(respuesta.tocado);
    }
    return {
      postura: actual.postura,
      interactivo: paso === 'responder' && actual.forma === 'senalar',
      ok,
      mal,
    };
  }, [actual, paso, respuesta]);

  return {
    fase, error, banco, avance, filtro, pool, prog, ronda, i, paso, actual, respuesta, respuestas, escena,
    pistaVista, descartada, verPista,
    empezar, responderOpcion, responderSenalar, siguiente, alInicio, reintentar,
    alternarCategoria, elegirTipos,
  };
}

export type Practica = ReturnType<typeof usePractica>;
