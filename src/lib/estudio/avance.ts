import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Alcance, Intento, PlanGuardado, Respuestas } from './planificador';

/**
 * Lo guardado del planificador y el avance real del alumno. Las tablas
 * (`planes_estudio`, `planes_tareas_hechas`, migración 0011) tienen RLS sin
 * políticas: todo pasa por aquí con la service role key, y quien llama (la
 * route) ya comprobó la sesión.
 *
 * Los banqueos terminados salen de `analytics_events` (`examen_completado`), que
 * los runners ya registran: no hay un segundo registro que pueda desincronizarse.
 */

const db = () => createAdminClient() as unknown as SupabaseClient;

interface FilaPlan {
  id: string;
  nombre: string;
  fecha_examen: string;
  alcance: Alcance;
  respuestas: Respuestas;
  creado_at: string;
}

const aPlan = (f: FilaPlan): PlanGuardado => ({
  id: f.id, nombre: f.nombre, fechaExamen: f.fecha_examen, alcance: f.alcance, respuestas: f.respuestas, creadoAt: f.creado_at,
});

export async function planActivo(userId: string, ruta: string, curso: string): Promise<PlanGuardado | null> {
  const { data } = await db()
    .from('planes_estudio')
    .select('id, nombre, fecha_examen, alcance, respuestas, creado_at')
    .eq('user_id', userId).eq('ruta', ruta).eq('curso', curso).eq('archivado', false)
    .maybeSingle<FilaPlan>();
  return data ? aPlan(data) : null;
}

/** Guarda un plan nuevo: el anterior del mismo curso queda archivado (no se borra). */
export async function guardarPlan(userId: string, ruta: string, curso: string, p: Omit<PlanGuardado, 'id' | 'creadoAt'>): Promise<PlanGuardado> {
  await archivarPlan(userId, ruta, curso);
  const { data, error } = await db()
    .from('planes_estudio')
    .insert({ user_id: userId, ruta, curso, nombre: p.nombre, fecha_examen: p.fechaExamen, alcance: p.alcance, respuestas: p.respuestas })
    .select('id, nombre, fecha_examen, alcance, respuestas, creado_at')
    .single<FilaPlan>();
  if (error || !data) throw new Error(error?.message ?? 'insert vacío');
  return aPlan(data);
}

export async function archivarPlan(userId: string, ruta: string, curso: string) {
  await db().from('planes_estudio')
    .update({ archivado: true, actualizado_at: new Date().toISOString() })
    .eq('user_id', userId).eq('ruta', ruta).eq('curso', curso).eq('archivado', false);
}

export async function tareasHechas(planId: string): Promise<string[]> {
  const { data } = await db().from('planes_tareas_hechas').select('tarea_id').eq('plan_id', planId);
  return ((data ?? []) as { tarea_id: string }[]).map((f) => f.tarea_id);
}

export async function marcarTarea(planId: string, tareaId: string, hecha: boolean) {
  if (hecha) {
    await db().from('planes_tareas_hechas').upsert({ plan_id: planId, tarea_id: tareaId }, { onConflict: 'plan_id,tarea_id', ignoreDuplicates: true });
  } else {
    await db().from('planes_tareas_hechas').delete().eq('plan_id', planId).eq('tarea_id', tareaId);
  }
}

interface FilaEvento {
  created_at: string;
  props: { examKey?: unknown; score?: unknown; total?: unknown; tema?: unknown; seccion?: unknown; temas?: unknown } | null;
}

/** Los banqueos terminados del alumno en un curso, del más viejo al más nuevo. */
export async function intentosDe(userId: string, curso: string): Promise<Intento[]> {
  const { data, error } = await db()
    .from('analytics_events')
    .select('created_at, props')
    .eq('user_id', userId)
    .eq('event', 'examen_completado')
    .like('props->>examKey', `${curso}/%`)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.error('[estudio/avance] intentos', error.message);
    return [];
  }
  const out: Intento[] = [];
  for (const f of (data ?? []) as FilaEvento[]) {
    const p = f.props ?? {};
    if (typeof p.examKey !== 'string' || typeof p.score !== 'number' || typeof p.total !== 'number') continue;
    out.push({
      key: p.examKey,
      fecha: f.created_at,
      score: p.score,
      total: p.total,
      ...(typeof p.tema === 'string' ? { tema: p.tema } : {}),
      ...(typeof p.seccion === 'string' ? { seccion: p.seccion } : {}),
      ...(p.temas && typeof p.temas === 'object' ? { temas: p.temas as Record<string, [number, number]> } : {}),
    });
  }
  return out.reverse();
}
