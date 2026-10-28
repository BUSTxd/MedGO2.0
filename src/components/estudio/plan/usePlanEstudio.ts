'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IndiceCurso } from '@/lib/estudio/indice-tipos';
import { planificar, UMBRAL_FLOJO, type Intento, type PlanGuardado, type ResultadoPlan } from '@/lib/estudio/planificador';
import { juntarIntentos, leerIntentosLocales } from '@/lib/estudio/intentos-locales';

/**
 * El planificador de un curso en el navegador: baja de `/api/estudio/plan` lo
 * guardado (índice ligero, plan, banqueos terminados, marcas) y calcula el
 * calendario aquí con `planificar`, así que marcar algo o terminar un quiz lo
 * actualiza al instante. Los banqueos se juntan con la copia local de
 * `trackEvent` (el admin no deja eventos en el servidor).
 */

interface Respuesta {
  disponible: boolean;
  indice?: IndiceCurso;
  plan?: PlanGuardado | null;
  intentos?: Intento[];
  hechas?: string[];
}

export type NuevoPlan = Pick<PlanGuardado, 'nombre' | 'fechaExamen' | 'alcance' | 'respuestas'>;

export interface TemaFlojo { id: string; label: string; ok: number; total: number; pct: number; claseId?: string }

export interface PlanEstudio {
  estado: 'cargando' | 'no-disponible' | 'listo' | 'error';
  indice: IndiceCurso | null;
  plan: PlanGuardado | null;
  resultado: ResultadoPlan | null;
  /** Los banqueos terminados del curso (servidor + este navegador). */
  intentos: Intento[];
  flojos: TemaFlojo[];
  hoy: string;
  guardar: (p: NuevoPlan) => Promise<boolean>;
  marcar: (tareaId: string, hecha: boolean) => void;
  borrar: () => Promise<void>;
}

/** Fecha local del alumno (YYYY-MM-DD): su «hoy» es el de su reloj. */
const hoyLocal = () => new Intl.DateTimeFormat('en-CA').format(new Date());

/** Por tema, el último resultado que se tuvo; flojos los de menos de UMBRAL_FLOJO. */
function temasFlojos(indice: IndiceCurso | null, intentos: Intento[]): TemaFlojo[] {
  if (!indice) return [];
  const ultimo = new Map<string, [number, number]>();
  for (const i of intentos) for (const [t, r] of Object.entries(i.temas ?? {})) ultimo.set(t, r);
  return [...ultimo.entries()]
    .map(([id, [ok, total]]) => ({ id, label: indice.temas[id]?.label ?? id, ok, total, pct: Math.round((ok / total) * 100), claseId: indice.temas[id]?.clases[0] }))
    .filter((t) => t.total >= 2 && t.pct < UMBRAL_FLOJO)
    .sort((a, b) => (b.total - b.ok) - (a.total - a.ok) || a.pct - b.pct);
}

export function usePlanEstudio(curso: string | null, estudiadas: Set<string>): PlanEstudio {
  const [datos, setDatos] = useState<Respuesta | null>(null);
  const [error, setError] = useState(false);
  const [hechas, setHechas] = useState<string[]>([]);
  const [locales, setLocales] = useState<Intento[]>([]);
  const [hoy, setHoy] = useState(hoyLocal);

  useEffect(() => {
    if (!curso) return;
    let vivo = true;
    setDatos(null); setError(false);
    fetch(`/api/estudio/plan?curso=${encodeURIComponent(curso)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Respuesta) => { if (vivo) { setDatos(d); setHechas(d.hechas ?? []); } })
      .catch(() => { if (vivo) setError(true); });
    return () => { vivo = false; };
  }, [curso]);

  // Lo que se termina en otra pestaña o en este mismo runner cuenta sin recargar.
  useEffect(() => {
    const leer = () => { setLocales(leerIntentosLocales()); setHoy(hoyLocal()); };
    leer();
    const alStorage = (e: StorageEvent) => { if (e.key === 'medgo:intentos:v1') leer(); };
    window.addEventListener('medgo:intento', leer);
    window.addEventListener('storage', alStorage);
    window.addEventListener('focus', leer);
    return () => {
      window.removeEventListener('medgo:intento', leer);
      window.removeEventListener('storage', alStorage);
      window.removeEventListener('focus', leer);
    };
  }, []);

  const indice = datos?.indice ?? null;
  const plan = datos?.plan ?? null;
  const intentos = useMemo(() => {
    const deCurso = curso ? locales.filter((i) => i.key.startsWith(`${curso}/`)) : [];
    return juntarIntentos(datos?.intentos ?? [], deCurso);
  }, [datos?.intentos, locales, curso]);

  const resultado = useMemo(() => {
    if (!indice || !plan) return null;
    return planificar(indice, plan, { intentos, hechas, estudiadas: [...estudiadas] }, hoy);
  }, [indice, plan, intentos, hechas, estudiadas, hoy]);

  const flojos = useMemo(() => temasFlojos(indice, intentos), [indice, intentos]);

  const guardar = useCallback(async (p: NuevoPlan) => {
    if (!curso) return false;
    const r = await fetch('/api/estudio/plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ curso, ...p }),
    });
    if (!r.ok) return false;
    const { plan: nuevo } = (await r.json()) as { plan: PlanGuardado };
    setDatos((d) => (d ? { ...d, plan: nuevo } : d));
    setHechas([]);
    return true;
  }, [curso]);

  const marcar = useCallback((tareaId: string, hecha: boolean) => {
    if (!curso) return;
    setHechas((xs) => (hecha ? [...new Set([...xs, tareaId])] : xs.filter((x) => x !== tareaId)));
    fetch('/api/estudio/plan', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ curso, tarea: tareaId, hecha }),
    }).catch(() => { /* la marca queda en pantalla; se guardará la próxima vez */ });
  }, [curso]);

  const borrar = useCallback(async () => {
    if (!curso) return;
    await fetch(`/api/estudio/plan?curso=${encodeURIComponent(curso)}`, { method: 'DELETE' });
    setDatos((d) => (d ? { ...d, plan: null } : d));
    setHechas([]);
  }, [curso]);

  const estado = !curso ? 'no-disponible' : error ? 'error' : !datos ? 'cargando' : datos.disponible ? 'listo' : 'no-disponible';
  return { estado, indice, plan, resultado, intentos, flojos, hoy, guardar, marcar, borrar };
}
