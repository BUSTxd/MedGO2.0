import 'server-only';
import { cache } from 'react';
import { createClient } from './supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isAdminEmail, tieneAccesoTotal } from './admin';
import type { PlanState, ProfilePlan } from './plans';
import { checkDevice, getDeviceId } from './sessions';

/**
 * Vive aquí y no en `plans.ts` porque consulta `lib/admin`: `plans.ts` lo
 * importan componentes de cliente, y con esto dentro los correos de admin y de
 * acceso total acababan en el JS público.
 */
export async function getUserPlanState(supabase: SupabaseClient): Promise<PlanState> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'free', isActive: false, expiresAt: null };

  // El admin tiene acceso completo a todo el contenido sin depender de una
  // suscripción activa en `profiles` — mismo criterio que ya usan /admin y
  // /modelado. Sin esto, cualquier curso nuevo que no tenga sus clases
  // marcadas `free: true` a mano queda bloqueado en cuanto el plan de prueba
  // del admin expira.
  // `allAccess` es lo que realmente abre todo: sin él, 'residente' pertenece al
  // tramo `medicina` y dejaría los 6 cursos de UFBI bloqueados para el admin.
  if (isAdminEmail(user.email) || tieneAccesoTotal(user.email)) {
    return { plan: 'residente', isActive: true, expiresAt: null, allAccess: true };
  }

  const { data } = await supabase
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', user.id)
    .maybeSingle();

  const plan: ProfilePlan = (data?.plan as ProfilePlan) ?? 'free';
  const expiresAt = data?.plan_expires_at ? new Date(data.plan_expires_at) : null;
  const isActive = plan !== 'free' && (expiresAt ? expiresAt.getTime() > Date.now() : false);
  return { plan, isActive, expiresAt };
}

/**
 * El plan tal como lo deben ver las APIs de contenido de pago (exámenes,
 * resúmenes): un dispositivo revocado o por encima del cupo cuenta como sin
 * plan. Sin esto, revocar un dispositivo sólo lo frenaba en el layout del
 * dashboard; su sesión seguía viva y las APIs le seguían sirviendo el material.
 */
export async function getPlanStateDeContenido(supabase: SupabaseClient): Promise<PlanState> {
  const estado = await getUserPlanState(supabase);
  if (!estado.isActive) return estado;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return estado;
  const { kind } = await checkDevice(user.id, await getDeviceId(), estado.plan);
  if (kind === 'revoked' || kind === 'limit_exceeded') {
    return { plan: 'free', isActive: false, expiresAt: null };
  }
  return estado;
}

/**
 * Versión cacheada por request: layout, pages y components que la llamen
 * dentro del mismo render comparten una sola consulta a Supabase.
 */
export const getCachedPlanState = cache(async (): Promise<PlanState> => {
  const supabase = await createClient();
  return getUserPlanState(supabase);
});
