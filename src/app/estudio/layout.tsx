import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import EstudioShell from '@/components/estudio/EstudioShell';
import { prepararSesionApp } from '@/lib/sesion-app';
import { PLANS } from '@/lib/plans';

// Outfit variable (100-900): la interfaz usa pesos intermedios (350, 550, 650) que
// la carga fija del layout raíz redondearía.
const outfitEstudio = Outfit({ subsets: ['latin'], variable: '--font-estudio', display: 'swap' });

export const metadata: Metadata = { title: 'MedGO · Tu espacio de estudio' };
export const viewport: Viewport = { themeColor: '#10233f' };

export default async function EstudioLayout({ children }: { children: React.ReactNode }) {
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
    <div className={outfitEstudio.variable}>
      <EstudioShell planState={s.clientPlan} isAdmin={s.isAdmin} presencia={s.presencia} buzon={s.buzon} cuenta={cuenta}>
        {children}
      </EstudioShell>
    </div>
  );
}
