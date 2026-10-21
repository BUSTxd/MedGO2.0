import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCachedPlanState } from '@/lib/plans-server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail, canVerAportes, esDeCayetano } from '@/lib/admin';
import { tieneAccesoA } from '@/lib/acceso';
import { checkDevice, getDeviceId, touchSession } from '@/lib/sessions';
import { canalBuzonAdmin, tokenDePresencia } from '@/lib/presencia';
import { iaAbierta } from '@/lib/ia/config';
import type { ClientPlanState } from '@/components/PlanProvider';

/**
 * Lo que comparten los dos «interiores» de la app (`/dashboard` y `/estudio`):
 * sesión, límite de dispositivos y plan. Las redirecciones de dispositivo se
 * lanzan aquí mismo, así que el layout que la llama no renderiza nada si no pasa.
 * Con `cache`: el layout y la página de una misma petición comparten la consulta.
 */
export const prepararSesionApp = cache(async () => {
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
      const touch = await touchSession({
        userId:    user.id,
        deviceId,
        plan:      planState.plan,
        userAgent: h.get('user-agent'),
        ip:        h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      });
      // `checkDevice` lee una lista cacheada hasta 1 h; el conteo fresco de
      // touchSession es el que manda si en ese rato ya se llenó el cupo.
      if (touch === 'limit_exceeded') redirect('/auth/device-limit');
    }
  }

  const clientPlan: ClientPlanState = {
    plan: planState.plan,
    isActive: planState.isActive,
    expiresAt: planState.expiresAt ? planState.expiresAt.toISOString() : null,
  };

  return {
    user,
    planState,
    clientPlan,
    isAdmin,
    verAportes,
    accesoFacultad,
    deCayetano: user ? esDeCayetano(user) : false,
    // El admin no se anuncia: recorre la web para revisarla, como en /api/track.
    presencia: user && !isAdmin ? tokenDePresencia(user.id) : undefined,
    // El buzón sí incluye al admin: puede escribirse a sí mismo para probar.
    buzon: user ? tokenDePresencia(user.id) : undefined,
    canalAdmin: isAdmin ? canalBuzonAdmin() : undefined,
    // Sólo la señal de la interfaz: la ruta de la IA vuelve a comprobarlo.
    iaAbierta: iaAbierta(),
  };
});
