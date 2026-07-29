import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserPlanState } from '@/lib/plans';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, plan_key, status, amount, currency, next_payment_date, mp_preapproval_id')
    .eq('user_id', user.id)
    .in('status', ['authorized', 'pending'])
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Misma fuente de verdad que el resto del sitio (getCachedPlanState): así el
  // bypass de admin también aplica aquí en vez de recalcular el plan aparte.
  const { plan, isActive, expiresAt } = await getUserPlanState(supabase);

  return NextResponse.json({
    subscription: data ?? null,
    planState: { plan, isActive, expiresAt: expiresAt ? expiresAt.toISOString() : null },
  });
}
