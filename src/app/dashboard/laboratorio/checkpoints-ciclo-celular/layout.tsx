import SeccionGate from '@/components/SeccionGate';
import { labEsGratis, requiredPlanDeLab } from '@/lib/acceso';

// El tramo y si es gratis salen de `LABORATORIOS` (src/lib/data/aportes.ts), no
// de aquí: cambiar el flag allí abre o cierra el laboratorio sin tocar este archivo.
export default function CheckpointsCicloCelularLayout({ children }: { children: React.ReactNode }) {
  if (labEsGratis('checkpoints-ciclo-celular')) return <>{children}</>;
  return <SeccionGate required={requiredPlanDeLab('checkpoints-ciclo-celular')}>{children}</SeccionGate>;
}
