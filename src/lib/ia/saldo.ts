import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/admin';
import { getPlanStateDeContenido } from '@/lib/plans-server';
import { CICLO_DIAS, CUOTA_ADMIN, CUOTA_POR_PLAN, LIMITES, iaAbierta, type Accion } from './config';
import type { Uso } from './costos';

/**
 * Saldo y cobro. Todo pasa por las funciones SQL de `0010_ia.sql`, que sólo
 * puede ejecutar el service role: el navegador no puede leer ni tocar su
 * saldo por ningún camino que no sea esta capa.
 */

// El cliente admin no tiene los tipos de la base: sin esto `rpc` no admite argumentos.
function db() {
  return createAdminClient() as unknown as SupabaseClient;
}

export type Acceso =
  | { ok: true; userId: string; cuota: number; esAdmin: boolean }
  | { ok: false; status: 401 | 403; motivo: 'sesion' | 'proximamente' | 'plan' };

/**
 * ¿Puede usar la IA? Sesión + interruptor de lanzamiento + plan de pago
 * activo (con el dispositivo en regla, como el resto del contenido de pago).
 * La cuota sale del plan, nunca del cliente.
 */
export async function accesoIA(supabase: SupabaseClient): Promise<Acceso> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, motivo: 'sesion' };
  const esAdmin = isAdminEmail(user.email);
  if (!esAdmin && !iaAbierta()) return { ok: false, status: 403, motivo: 'proximamente' };
  if (esAdmin) return { ok: true, userId: user.id, cuota: CUOTA_ADMIN, esAdmin };

  const plan = await getPlanStateDeContenido(supabase);
  const cuota = plan.isActive ? CUOTA_POR_PLAN[plan.plan] : null;
  if (!cuota) return { ok: false, status: 403, motivo: 'plan' };
  return { ok: true, userId: user.id, cuota, esAdmin };
}

export type Reserva =
  | { ok: true; reserva: string; plan: number; recarga: number }
  | { ok: false; motivo: 'tope_global' | 'ocupado' | 'ritmo' | 'ritmo_dia' | 'saldo' | 'invalido' | 'error'; plan?: number; recarga?: number };

export async function reservar(userId: string, cuota: number, creditos: number, accion: Accion, claseId: string | null): Promise<Reserva> {
  const { data, error } = await db().rpc('ia_reservar', {
    p_user: userId,
    p_creditos: creditos,
    p_cuota: cuota,
    p_ciclo_dias: CICLO_DIAS,
    p_max_minuto: LIMITES.porMinuto,
    p_max_dia: LIMITES.porDia,
    p_tope_usd: LIMITES.topeDiarioUsd,
    p_accion: accion,
    p_clase: claseId,
    p_ttl_seg: LIMITES.ttlReservaSeg,
  });
  if (error || !data) {
    console.error('[ia] reservar:', error?.message);
    return { ok: false, motivo: 'error' };
  }
  return data as Reserva;
}

export async function liquidar(reserva: string, cobrado: number, costoUsd: number, uso: Uso | null) {
  const { error } = await db().rpc('ia_liquidar', {
    p_reserva: reserva,
    p_cobrado: cobrado,
    p_costo_usd: Number(costoUsd.toFixed(6)),
    p_tokens_in: uso?.input_tokens ?? 0,
    p_tokens_out: uso?.output_tokens ?? 0,
    p_cache_r: uso?.cache_read_input_tokens ?? 0,
    p_cache_w: uso?.cache_creation_input_tokens ?? 0,
  });
  if (error) console.error('[ia] liquidar:', error.message);
}

/** Abono de recarga o ajuste (admin, o el webhook de una compra con su id de pago). */
export async function abonar(userId: string, creditos: number, tipo: 'recarga' | 'ajuste', clave?: string) {
  const { data, error } = await db().rpc('ia_abonar', {
    p_user: userId, p_creditos: creditos, p_tipo: tipo, p_clave: clave ?? null,
  });
  if (error) throw new Error(error.message);
  return data as { ok: boolean; repetido?: boolean };
}

/** Saldo para mostrar. Si el ciclo venció (o nunca empezó), se enseña la cuota que se repondrá al usarla. */
export async function leerSaldo(userId: string, cuota: number) {
  const { data } = await db()
    .from('ia_saldos')
    .select('plan_creditos, recarga_creditos, ciclo_inicio')
    .eq('user_id', userId)
    .maybeSingle<{ plan_creditos: number; recarga_creditos: number; ciclo_inicio: string | null }>();
  const inicio = data?.ciclo_inicio ? new Date(data.ciclo_inicio) : null;
  const vence = inicio ? new Date(inicio.getTime() + CICLO_DIAS * 86_400_000) : null;
  const vigente = !!vence && vence.getTime() > Date.now();
  return {
    plan: vigente ? Number(data!.plan_creditos) : cuota,
    recarga: Number(data?.recarga_creditos ?? 0),
    cuota,
    renueva: vigente ? vence!.toISOString() : null,
  };
}

// ── Conversaciones ──────────────────────────────────────────────────────────

export async function conversacionDe(userId: string, id: string | null, claseId: string | null): Promise<string> {
  if (id) {
    const { data } = await db().from('ia_conversaciones').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
    if (data) return id;
  }
  const { data, error } = await db()
    .from('ia_conversaciones')
    .insert({ user_id: userId, clase_id: claseId })
    .select('id')
    .single<{ id: string }>();
  if (error || !data) throw new Error(error?.message ?? 'conversacion');
  return data.id;
}

export async function historial(conversacionId: string): Promise<{ rol: 'user' | 'assistant'; contenido: string }[]> {
  const { data } = await db()
    .from('ia_mensajes')
    .select('rol, contenido')
    .eq('conversacion_id', conversacionId)
    .order('id', { ascending: false })
    .limit(LIMITES.historial);
  return ((data ?? []) as { rol: 'user' | 'assistant'; contenido: string }[]).reverse();
}

export async function guardarTurno(conversacionId: string, pregunta: string, respuesta: string) {
  const { error } = await db().from('ia_mensajes').insert([
    { conversacion_id: conversacionId, rol: 'user', contenido: pregunta },
    { conversacion_id: conversacionId, rol: 'assistant', contenido: respuesta },
  ]);
  if (error) console.error('[ia] guardar turno:', error.message);
}

// ── Caché de respuestas ─────────────────────────────────────────────────────

export async function respuestaGuardada(clave: string) {
  const { data } = await db()
    .from('ia_respuestas_cache')
    .select('respuesta, creditos, usos')
    .eq('clave', clave)
    .maybeSingle<{ respuesta: string; creditos: number; usos: number }>();
  if (data) await db().from('ia_respuestas_cache').update({ usos: data.usos + 1 }).eq('clave', clave);
  return data ?? null;
}

export async function guardarRespuesta(clave: string, respuesta: string, creditos: number) {
  await db().from('ia_respuestas_cache').upsert({ clave, respuesta, creditos }, { onConflict: 'clave', ignoreDuplicates: true });
}
