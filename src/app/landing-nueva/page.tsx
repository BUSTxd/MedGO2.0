import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import LandingNueva from '@/components/landing-nueva/LandingNueva';

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

export default function LandingNuevaPage() {
  return (
    <div className={outfitLanding.variable}>
      <LandingNueva />
    </div>
  );
}
