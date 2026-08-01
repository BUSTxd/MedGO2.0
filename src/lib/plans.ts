import type { SupabaseClient } from '@supabase/supabase-js';
import { isAdminEmail } from './admin';

export type PlanKey = 'interno' | 'residente' | 'ufbi';
export type ProfilePlan = 'free' | PlanKey;

/**
 * Los dos tramos de la carrera, que se cursan en facultades distintas:
 *  - `basico`   → 1.er año en UFBI (Ciencias Básicas): los 6 cursos del ciclo.
 *  - `medicina` → 2.º a 7.º año en la Facultad de Medicina Humana.
 *
 * No son niveles de un mismo escalafón: un plan de un tramo NUNCA desbloquea
 * cursos del otro. Por eso el acceso se decide con `planUnlocks()` y no
 * comparando `planRank()` a secas.
 */
export type Track = 'basico' | 'medicina';

export interface PlanCatalogEntry {
  key: PlanKey;
  label: string;
  amount: number;
  currency: 'PEN';
  durationDays: number;
  mpPlanIdEnv: string;
  track: Track;
}

export const PLANS: Record<PlanKey, PlanCatalogEntry> = {
  interno: {
    key: 'interno',
    label: 'Interno',
    amount: 14,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_INTERNO_ID',
    track: 'medicina',
  },
  residente: {
    key: 'residente',
    label: 'Residente',
    amount: 142.80,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_RESIDENTE_ID',
    track: 'medicina',
  },
  ufbi: {
    key: 'ufbi',
    label: 'UFBI',
    amount: 20,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_UFBI_ID',
    track: 'basico',
  },
};

export function isPlanKey(value: string): value is PlanKey {
  return value === 'interno' || value === 'residente' || value === 'ufbi';
}

export function getPlan(planKey: string): (PlanCatalogEntry & { mpPlanId: string }) | null {
  if (!isPlanKey(planKey)) return null;
  const entry = PLANS[planKey];
  const mpPlanId = process.env[entry.mpPlanIdEnv];
  if (!mpPlanId) return null;
  return { ...entry, mpPlanId };
}

export interface PlanState {
  plan: ProfilePlan;
  isActive: boolean;
  expiresAt: Date | null;
  /** El admin ve todo sin importar el tramo. Ver `getUserPlanState`. */
  allAccess?: boolean;
}

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
  if (isAdminEmail(user.email)) {
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
 * Jerarquía *dentro de un mismo tramo*. Solo tiene sentido comparar rangos de
 * planes que comparten `track` — para decidir acceso usa `planUnlocks()`.
 */
export function planRank(plan: ProfilePlan): number {
  if (plan === 'free') return 0;
  if (plan === 'residente') return 2;
  return 1; // interno y ufbi: primer escalón de su respectivo tramo
}

/**
 * ¿El plan que tiene el usuario da acceso a contenido que exige `required`?
 *
 * Regla clave: los tramos están separados. Un `ufbi` no abre cursos de la
 * Facultad de Medicina, y un `interno`/`residente` no abre los del ciclo
 * básico. Dentro del tramo `medicina` sí se mantiene residente ≥ interno.
 */
export function planUnlocks(plan: ProfilePlan, required: PlanKey): boolean {
  if (plan === 'free') return false;
  if (PLANS[plan].track !== PLANS[required].track) return false;
  return planRank(plan) >= planRank(required);
}
