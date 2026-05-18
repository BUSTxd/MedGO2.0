import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cancelPreapproval } from '@/lib/mercadopago';

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
      plan_key: 'interno' | 'residente';
      created_at: string;
    }>();

  if (!sub) {
    return NextResponse.json({ error: 'no_active_subscription' }, { status: 404 });
  }

  // Compromiso mínimo de 3 meses para el plan Interno (mensual). Usamos meses
  // calendario (setMonth +3) en vez de 90 días para que coincida con 3 ciclos
  // de cobro reales. El plan Residente queda fuera del lock.
  if (sub.plan_key === 'interno') {
    const unlockAt = new Date(sub.created_at);
    unlockAt.setMonth(unlockAt.getMonth() + 3);
    if (Date.now() < unlockAt.getTime()) {
      return NextResponse.json(
        { error: 'lock_period_active', unlockAt: unlockAt.toISOString() },
        { status: 423 },
      );
    }
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
