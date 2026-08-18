import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cancelPreapproval } from '@/lib/mercadopago';
import { PLANS, unlockDateFor, type PlanKey } from '@/lib/plans';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = createAdminClient();

  const { data: sub } = await admin
    .from('subscriptions')
    .select('id, mp_preapproval_id, status, plan_key, created_at')
    .eq('user_id', user.id)
    .in('status', ['authorized', 'pending'])
    .order('created_at', { ascending: false })
    .maybeSingle<{
      id: string;
      mp_preapproval_id: string;
      status: string;
      plan_key: PlanKey;
      created_at: string;
    }>();

  if (!sub) {
    return NextResponse.json({ error: 'no_active_subscription' }, { status: 404 });
  }

  // Compromiso mínimo de los planes mensuales (Interno y UFBI). Sale del
  // catálogo (`commitmentMonths`), no de una lista de nombres aquí: los anuales
  // devuelven `null` y quedan fuera del lock sin nombrarlos.
  const unlockAt = unlockDateFor(sub.plan_key, sub.created_at);
  if (unlockAt && Date.now() < unlockAt.getTime()) {
    return NextResponse.json(
      {
        error: 'lock_period_active',
        unlockAt: unlockAt.toISOString(),
        months: PLANS[sub.plan_key].commitmentMonths,
      },
      { status: 423 },
    );
  }

  try {
    await cancelPreapproval(sub.mp_preapproval_id);
  } catch (err) {
    console.error('[subs/cancel] MP error', err);
    return NextResponse.json({ error: 'mp_error', detail: String(err) }, { status: 502 });
  }

  const subsTable = admin.from('subscriptions') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>;
    };
  };
  const { error: updErr } = await subsTable
    .update({ status: 'cancelled' })
    .eq('id', sub.id);
  if (updErr) {
    console.error('[subs/cancel] db update error', updErr);
  }

  revalidatePath('/dashboard', 'layout');

  return NextResponse.json({ ok: true, status: 'cancelled' });
}
