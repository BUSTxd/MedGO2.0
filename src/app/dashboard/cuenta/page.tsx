import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import { PLANS, type ProfilePlan } from '@/lib/plans';
import styles from '@/styles/accountPage.module.css';

export const dynamic = 'force-dynamic';

interface SubRow {
  id: string;
  plan_key: 'interno' | 'residente';
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  amount: number;
  currency: string;
  next_payment_date: string | null;
  mp_preapproval_id: string;
  created_at: string;
}

interface ProfileRow {
  plan: ProfilePlan;
  plan_expires_at: string | null;
  full_name: string | null;
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard/cuenta');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_expires_at, full_name')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id, plan_key, status, amount, currency, next_payment_date, mp_preapproval_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SubRow>();

  const planKey = profile?.plan ?? 'free';
  const expiresAt = profile?.plan_expires_at ?? null;
  const planLabel =
    planKey === 'free' ? 'Gratuito' : PLANS[planKey].label;

  return (
    <>
      <div className={styles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
      </div>

      <h1 className={styles.pageTitle}>Mi cuenta</h1>
      <p className={styles.pageSub}>
        {profile?.full_name ?? user.email}
      </p>

      <SubscriptionPanel
        plan={planKey}
        planLabel={planLabel}
        expiresAt={expiresAt}
        subscription={sub ?? null}
      />
    </>
  );
}
