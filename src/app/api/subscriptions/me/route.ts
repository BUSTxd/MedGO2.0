import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', user.id)
    .maybeSingle<{ plan: string | null; plan_expires_at: string | null }>();

  const plan = (profile?.plan as 'free' | 'interno' | 'residente' | null) ?? 'free';
  const expiresAt = profile?.plan_expires_at ?? null;
  const isActive =
    plan !== 'free' && !!expiresAt && new Date(expiresAt).getTime() > Date.now();

  return NextResponse.json({
    subscription: data ?? null,
    planState: { plan, isActive, expiresAt },
  });
}
