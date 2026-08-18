import type { SupabaseClient } from '@supabase/supabase-js';
import { isAdminEmail } from './admin';

export type PlanKey = 'interno' | 'residente' | 'ufbi' | 'ufbi-anual';
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
  /**
   * Compromiso mínimo en meses: nº de cobros consecutivos que el usuario acepta
   * antes de poder cancelar. Lo llevan los **mensuales** de los dos tramos; los
   * anuales no, porque ya cobran 12 meses por adelantado.
   *
   * Es un eje aparte de la cadencia (`durationDays`) y no se deduce del nombre
   * del plan: preguntarlo aquí es lo que evita repetir `planKey === 'interno'`
   * en el modal de compra, en Mi cuenta y en la ruta de cancelación —los tres
   * sitios donde ya se desincronizó una vez.
   */
  commitmentMonths?: number;
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
    commitmentMonths: 3,
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
    amount: 19.70,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_UFBI_ID',
    track: 'basico',
    commitmentMonths: 3,
  },
  // Anual del tramo básico — el análogo de `residente` en Medicina. 189 son
  // exactamente el 80 % de 12 × 19.70 (236.40), de ahí el «20 % de descuento»
  // de la tarjeta: si se toca uno de los dos importes hay que rehacer el otro.
  'ufbi-anual': {
    key: 'ufbi-anual',
    label: 'UFBI Anual',
    amount: 189,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_UFBI_ANUAL_ID',
    track: 'basico',
  },
};

export function isPlanKey(value: string): value is PlanKey {
  return (
    value === 'interno' ||
    value === 'residente' ||
    value === 'ufbi' ||
    value === 'ufbi-anual'
  );
}

export function getPlan(planKey: string): (PlanCatalogEntry & { mpPlanId: string }) | null {
  if (!isPlanKey(planKey)) return null;
  const entry = PLANS[planKey];
  const mpPlanId = process.env[entry.mpPlanIdEnv];
  if (!mpPlanId) return null;
  return { ...entry, mpPlanId };
}

/**
 * Fecha a partir de la cual una suscripción se puede cancelar, o `null` si el
 * plan no tiene compromiso. Se cuenta en **meses calendario** desde la primera
 * autorización (`setMonth +N`), no en 90 días, para que coincida con N ciclos
 * de cobro reales.
 *
 * Vive aquí y no en cada consumidor a propósito: el botón de Mi cuenta y el
 * guard de `api/subscriptions/cancel` tienen que dar exactamente la misma
 * fecha, o el botón se habilita antes de que la API acepte cancelar.
 */
export function unlockDateFor(planKey: PlanKey, createdAt: string | Date): Date | null {
  const months = PLANS[planKey].commitmentMonths;
  if (!months) return null;
  const d = new Date(createdAt);
  d.setMonth(d.getMonth() + months);
  return d;
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
  // Los anuales son el escalón alto de su tramo: 'residente' en medicina,
  // 'ufbi-anual' en básico. Abren lo mismo que su mensual y algo más.
  if (plan === 'residente' || plan === 'ufbi-anual') return 2;
  return 1; // interno y ufbi: primer escalón de su respectivo tramo
}

/**
 * ¿El plan que tiene el usuario da acceso a contenido que exige `required`?
 *
 * Regla clave: los tramos están separados. Un `ufbi` no abre cursos de la
 * Facultad de Medicina, y un `interno`/`residente` no abre los del ciclo
 * básico. Dentro de cada tramo sí se mantiene el orden anual ≥ mensual
 * (residente ≥ interno, ufbi-anual ≥ ufbi).
 */
export function planUnlocks(plan: ProfilePlan, required: PlanKey): boolean {
  if (plan === 'free') return false;
  if (PLANS[plan].track !== PLANS[required].track) return false;
  return planRank(plan) >= planRank(required);
}
