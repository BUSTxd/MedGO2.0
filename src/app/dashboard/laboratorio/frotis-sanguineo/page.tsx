import type { Metadata } from 'next';
import TrackLabVisit from '@/components/TrackLabVisit';
import FrotisSimFrame from '@/components/FrotisSimFrame';

export const metadata: Metadata = {
  title: 'Frotis sanguíneo · Simulación | MedGO',
  description:
    'Simulación 3D paso a paso de la práctica de realización y tinción del frotis sanguíneo, morfología eritrocitaria y recuento plaquetario.',
};

export default function FrotisSanguineoPage() {
  return (
    <>
      <TrackLabVisit labId="frotis-sanguineo" />
      <FrotisSimFrame />
    </>
  );
}
