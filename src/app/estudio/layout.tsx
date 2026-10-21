import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import EstudioShell from '@/components/estudio/EstudioShell';
import { prepararSesionApp } from '@/lib/sesion-app';

// Outfit variable (100-900): la interfaz usa pesos intermedios (350, 550, 650) que
// la carga fija del layout raíz redondearía.
const outfitEstudio = Outfit({ subsets: ['latin'], variable: '--font-estudio', display: 'swap' });

export const metadata: Metadata = { title: 'MedGO · Tu espacio de estudio' };
export const viewport: Viewport = { themeColor: '#10233f' };

export default async function EstudioLayout({ children }: { children: React.ReactNode }) {
  const s = await prepararSesionApp();
  return (
    <div className={outfitEstudio.variable}>
      <EstudioShell planState={s.clientPlan} isAdmin={s.isAdmin} presencia={s.presencia} buzon={s.buzon}>
        {children}
      </EstudioShell>
    </div>
  );
}
