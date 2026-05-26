import { redirect } from 'next/navigation';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getCachedPlanState } from '@/lib/plans-server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { isDeviceAllowed, getDeviceId } from '@/lib/sessions';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [planState, supabase, deviceId] = await Promise.all([
    getCachedPlanState(),
    createClient(),
    getDeviceId(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);

  // Enforcement de límite de dispositivos. Free no se ve afectado (skip query);
  // pagados con >= 3 sesiones activas son redirigidos a /auth/device-limit.
  // Usa cache de 1h por usuario — invalidada en revoke/touch.
  if (user) {
    const allowed = await isDeviceAllowed(user.id, deviceId, planState.plan);
    if (!allowed) redirect('/auth/device-limit');
  }

  return (
    <DashboardWrapper
      planState={{
        plan: planState.plan,
        isActive: planState.isActive,
        expiresAt: planState.expiresAt ? planState.expiresAt.toISOString() : null,
      }}
      isAdmin={isAdmin}
    >
      {children}
    </DashboardWrapper>
  );
}
