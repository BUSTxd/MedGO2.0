import type { SupabaseClient } from '@supabase/supabase-js';

export type PlanKey = 'interno' | 'residente';
export type ProfilePlan = 'free' | 'interno' | 'residente';

export interface PlanCatalogEntry {
  key: PlanKey;
  label: string;
  amount: number;
  currency: 'PEN';
  durationDays: number;
  mpPlanIdEnv: string;
}

export const PLANS: Record<PlanKey, PlanCatalogEntry> = {
  interno: {
    key: 'interno',
    label: 'Interno',
    amount: 14,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_INTERNO_ID',
  },
  residente: {
    key: 'residente',
    label: 'Residente',
    amount: 142.80,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_RESIDENTE_ID',
  },
};

export function getPlan(planKey: string): (PlanCatalogEntry & { mpPlanId: string }) | null {
  if (planKey !== 'interno' && planKey !== 'residente') return null;
  const entry = PLANS[planKey];
  const mpPlanId = process.env[entry.mpPlanIdEnv];
  if (!mpPlanId) return null;
  return { ...entry, mpPlanId };
}

export interface PlanState {
  plan: ProfilePlan;
  isActive: boolean;
  expiresAt: Date | null;
}

export async function getUserPlanState(supabase: SupabaseClient): Promise<PlanState> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'free', isActive: false, expiresAt: null };

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


export function planRank(plan: ProfilePlan): number {
  if (plan === 'free') return 0;
  if (plan === 'interno') return 1;
  return 2;
}
