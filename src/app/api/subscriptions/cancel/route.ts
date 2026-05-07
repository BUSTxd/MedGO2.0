import { NextResponse } from 'next/server';
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
    .select('id, mp_preapproval_id, status')
    .eq('user_id', user.id)
    .in('status', ['authorized', 'pending'])
    .order('created_at', { ascending: false })
    .maybeSingle<{ id: string; mp_preapproval_id: string; status: string }>();

  if (!sub) {
    return NextResponse.json({ error: 'no_active_subscription' }, { status: 404 });
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

  return NextResponse.json({ ok: true, status: 'cancelled' });
}
