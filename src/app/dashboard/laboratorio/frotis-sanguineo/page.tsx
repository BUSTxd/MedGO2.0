import type { Metadata } from 'next';
import { LabGate } from '@/components/SeccionGate';
import TrackLabVisit from '@/components/TrackLabVisit';
import FrotisSimFrame from '@/components/FrotisSimFrame';

export const metadata: Metadata = {
  title: 'Frotis sanguíneo · Simulación | MedGO',
  description:
    'Simulación 3D paso a paso de la práctica de realización y tinción del frotis sanguíneo, morfología eritrocitaria y recuento plaquetario.',
};

function Contenido() {
  return (
    <>
      <TrackLabVisit labId="frotis-sanguineo" />
      <FrotisSimFrame />
    </>
  );
}

// Server: decide el acceso ANTES de montar el contenido (ver SeccionGate).
export default function FrotisSanguineoPage() {
  return (
    <LabGate slug="frotis-sanguineo">
      <Contenido />
    </LabGate>
  );
}
