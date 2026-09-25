import type { Metadata } from 'next';
import { LabGate } from '@/components/SeccionGate';
import TrackLabVisit from '@/components/TrackLabVisit';
import MicroscopioHematologiaFrame from '@/components/MicroscopioHematologiaFrame';

export const metadata: Metadata = {
  title: 'Microscopio virtual · Médula ósea y serie blanca · Simulación | MedGO',
  description:
    'Simulación interactiva de microscopio óptico para el Lab 2 de Hematología: médula ósea, serie blanca y fórmula leucocitaria diferencial.',
};

function Contenido() {
  return (
    <>
      <TrackLabVisit labId="microscopio-hematologia" />
      <MicroscopioHematologiaFrame />
    </>
  );
}

// Server: decide el acceso ANTES de montar el contenido (ver SeccionGate).
export default function MicroscopioHematologiaPage() {
  return (
    <LabGate slug="microscopio-hematologia">
      <Contenido />
    </LabGate>
  );
}
