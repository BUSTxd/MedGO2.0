import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SubscriptionPanel from '@/components/SubscriptionPanel';
import DeviceList, { type DeviceListItem } from '@/components/DeviceList';
import { PLANS, type ProfilePlan } from '@/lib/plans';
import {
  getDeviceId,
  listActiveSessions,
  parseUserAgent,
  type ActiveSession,
} from '@/lib/sessions';
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

  const [deviceId, sessions] = await Promise.all([
    getDeviceId(),
    listActiveSessions(user.id),
  ]);

  const deviceItems: DeviceListItem[] = sessions.map((s: ActiveSession) => {
    const diffMs = Date.now() - new Date(s.last_seen).getTime();
    const mins = Math.floor(diffMs / 60_000);
    let lastSeen: string;
    if (mins < 1) lastSeen = 'hace unos segundos';
    else if (mins < 60) lastSeen = `hace ${mins} min`;
    else if (mins < 60 * 24) lastSeen = `hace ${Math.floor(mins / 60)} h`;
    else lastSeen = `hace ${Math.floor(mins / (60 * 24))} días`;
    return {
      id: s.id,
      deviceLabel: parseUserAgent(s.user_agent),
      meta: `Última actividad ${lastSeen}${s.ip ? ` · ${s.ip}` : ''}`,
      isCurrent: s.device_id === deviceId,
    };
  });

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

      <section className={styles.devicesSection}>
        <h2 className={styles.devicesTitle}>Dispositivos activos</h2>
        <p className={styles.devicesHint}>
          Tu cuenta puede estar conectada en hasta 3 dispositivos al mismo tiempo.
          Cierra sesión en los que no reconozcas.
        </p>
        <DeviceList
          items={deviceItems}
          emptyText="Aún no tienes sesiones registradas. Visita el dashboard para empezar."
        />
      </section>
    </>
  );
}
