import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getCachedPlanState } from '@/lib/plans-server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail, canVerAportes } from '@/lib/admin';
import { tieneAccesoA } from '@/lib/acceso';
import { checkDevice, getDeviceId, touchSession } from '@/lib/sessions';

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
  // Permiso propio: las socias ven Aportes sin ser admin.
  const verAportes = canVerAportes(user?.email);
  // Investigación e Histología son íntegramente de la Facultad. Se decide aquí,
  // en el servidor, porque el estado de plan del cliente no lleva `allAccess`.
  const accesoFacultad = tieneAccesoA(planState, 'interno');

  // Enforcement de límite de dispositivos. Free pasa siempre. Pagados:
  //  - 'allowed'        → ya está activo, seguir
  //  - 'allowed_new'    → hay espacio, registrar y seguir
  //  - 'revoked'        → fue cerrado desde otro dispositivo → sign out + landing
  //  - 'limit_exceeded' → /auth/device-limit para que elija cuál cerrar
  if (user) {
    const check = await checkDevice(user.id, deviceId, planState.plan);

    if (check.kind === 'revoked') {
      // El route handler hace signOut, borra la cookie device_id e invalida
      // el cache de user-sessions para que el siguiente login genere un
      // device nuevo (sin esto, el browser quedaba atrapado en loop).
      redirect('/auth/clear-device');
    }
    if (check.kind === 'limit_exceeded') {
      redirect('/auth/device-limit');
    }
    if (check.kind === 'allowed_new' && deviceId) {
      const h = await headers();
      await touchSession({
        userId:    user.id,
        deviceId,
        userAgent: h.get('user-agent'),
        ip:        h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      });
    }
  }

  return (
    <DashboardWrapper
      planState={{
        plan: planState.plan,
        isActive: planState.isActive,
        expiresAt: planState.expiresAt ? planState.expiresAt.toISOString() : null,
      }}
      isAdmin={isAdmin}
      verAportes={verAportes}
      accesoFacultad={accesoFacultad}
    >
      {children}
    </DashboardWrapper>
  );
}
