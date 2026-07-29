import type { Metadata } from 'next';
import TrackLabVisit from '@/components/TrackLabVisit';
import MicroscopioHematologiaFrame from '@/components/MicroscopioHematologiaFrame';

export const metadata: Metadata = {
  title: 'Microscopio virtual · Médula ósea y serie blanca · Simulación | MedGO',
  description:
    'Simulación interactiva de microscopio óptico para el Lab 2 de Hematología: médula ósea, serie blanca y fórmula leucocitaria diferencial.',
};

export default function MicroscopioHematologiaPage() {
  return (
    <>
      <TrackLabVisit labId="microscopio-hematologia" />
      <MicroscopioHematologiaFrame />
    </>
  );
}
