import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import LandingNueva from '@/components/landing-nueva/LandingNueva';
import type { CuentaBiblioteca } from '@/components/landing-nueva/datos';
import { tarjetasLaboratorio } from '@/lib/estudio/laboratorios';

// Outfit variable (100-900): el prototipo usa pesos intermedios (450) que la carga
// fija del layout raíz redondearía.
const outfitLanding = Outfit({ subsets: ['latin'], variable: '--font-landing', display: 'swap' });

/** Ruta PROVISIONAL de la landing nueva (GO con DOT): fuera de buscadores mientras se pule. */
export const metadata: Metadata = {
  title: 'Conoce MedGO',
  description: 'Tu espacio para estudiar medicina: resúmenes, práctica y laboratorio, en tu propia ruta.',
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#0c1015' };

/**
 * Los recursos del Laboratorio de /estudio (todos, Física incluida), contados aquí para
 * que la demo diga la cifra real sin bajarse el catálogo. Un laboratorio nuevo suma solo.
 */
function cuentaBiblioteca(): CuentaBiblioteca {
  const labs = tarjetasLaboratorio({ plan: 'free', isActive: false }, true);
  const de = (tipo: string) => labs.filter((l) => l.tipo === tipo).length;
  return { Todos: labs.length, 'Simulación': de('Simulación'), 'Modelo 3D': de('Modelo 3D'), Atlas: de('Atlas') };
}

export default function LandingNuevaPage() {
  return (
    <div className={outfitLanding.variable}>
      <LandingNueva biblioteca={cuentaBiblioteca()} />
    </div>
  );
}
