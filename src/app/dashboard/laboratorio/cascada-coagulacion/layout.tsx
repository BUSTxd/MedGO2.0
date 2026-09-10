import SeccionGate from '@/components/SeccionGate';
import { labEsGratis, requiredPlanDeLab } from '@/lib/acceso';

// El tramo y si es gratis salen de `LABORATORIOS` (src/lib/data/aportes.ts), no
// de aquí. Hoy es gratis: sin paywall para ninguna cuenta. Quitar el flag allí
// lo vuelve a poner detrás del plan de su tramo sin tocar este archivo.
export default function CascadaCoagulacionLayout({ children }: { children: React.ReactNode }) {
  if (labEsGratis('cascada-coagulacion')) return <>{children}</>;
  return <SeccionGate required={requiredPlanDeLab('cascada-coagulacion')}>{children}</SeccionGate>;
}
