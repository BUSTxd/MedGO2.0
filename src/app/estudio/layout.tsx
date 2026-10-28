import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import EstudioShell from '@/components/estudio/EstudioShell';
import SiluetaRuta from '@/components/estudio/SiluetaRuta';
import { prepararSesionApp } from '@/lib/sesion-app';
import { PLANS } from '@/lib/plans';

// Outfit variable (100-900): la interfaz usa pesos intermedios (350, 550, 650) que
// la carga fija del layout raíz redondearía.
const outfitEstudio = Outfit({ subsets: ['latin'], variable: '--font-estudio', display: 'swap' });

export const metadata: Metadata = { title: 'MedGO · Tu espacio de estudio' };
export const viewport: Viewport = { themeColor: '#18212c' };

/**
 * El layout no espera a la sesión: la silueta sale en cuanto llega la primera
 * respuesta (desde la portada, lo primero que se ve) y la sesión entra detrás.
 * Un `loading.tsx` no serviría para esto: cuelga de este layout y esperaría con él.
 */
export default function EstudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={outfitEstudio.variable}>
      <Suspense fallback={<SiluetaRuta />}>
        <ConSesion>{children}</ConSesion>
      </Suspense>
    </div>
  );
}

async function ConSesion({ children }: { children: React.ReactNode }) {
  const s = await prepararSesionApp();
  const { plan, isActive, allAccess } = s.planState;
  const cuenta = {
    ...s.perfil,
    planLabel: allAccess ? 'Acceso total' : isActive && plan !== 'free' ? `Plan ${PLANS[plan].label}` : 'Gratuito',
    planActivo: !!allAccess || (isActive && plan !== 'free'),
    isAdmin: s.isAdmin,
    verAportes: s.verAportes,
  };
  return (
    <EstudioShell planState={s.clientPlan} isAdmin={s.isAdmin} presencia={s.presencia} buzon={s.buzon} canalAdmin={s.canalAdmin} cuenta={cuenta}>
      {children}
    </EstudioShell>
  );
}
