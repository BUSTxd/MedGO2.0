import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import {
  assertDeviceAllowed,
  getDeviceId,
  parseUserAgent,
  type ActiveSession,
} from '@/lib/sessions';
import DeviceList, { type DeviceListItem } from '@/components/DeviceList';
import SignOutButton from '@/components/SignOutButton';
import styles from '@/styles/deviceLimitPage.module.css';

export const dynamic = 'force-dynamic';

function formatLastSeen(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'hace unos segundos';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

function toItem(s: ActiveSession, currentDeviceId: string | null): DeviceListItem {
  const ip = s.ip ? ` · ${s.ip}` : '';
  return {
    id: s.id,
    deviceLabel: parseUserAgent(s.user_agent),
    meta: `Última actividad ${formatLastSeen(s.last_seen)}${ip}`,
    isCurrent: s.device_id === currentDeviceId,
  };
}

export default async function DeviceLimitPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [plan, deviceId] = await Promise.all([getCachedPlanState(), getDeviceId()]);
  const { allowed, sessions, limit } = await assertDeviceAllowed(user.id, deviceId, plan.plan);

  // Si ya hay slot disponible (revocó una sesión), llevarlo al dashboard.
  if (allowed) redirect('/dashboard');

  const items = sessions.map((s) => toItem(s, deviceId));

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className={styles.title}>Demasiados dispositivos activos</h1>
        <p className={styles.subtitle}>
          Tu cuenta solo puede estar conectada en <strong>{limit} dispositivos</strong> a la vez.
          Para usar este nuevo dispositivo, cierra la sesión en uno de los siguientes:
        </p>

        <DeviceList items={items} emptyText="No se encontraron sesiones activas." />

        <div className={styles.divider} />

        <div className={styles.footer}>
          <span className={styles.helpText}>
            Si no reconoces alguna sesión, ciérrala y cambia tu contraseña.
          </span>
          <SignOutButton className={styles.signOut}>Cerrar mi sesión</SignOutButton>
        </div>
      </div>
    </div>
  );
}
