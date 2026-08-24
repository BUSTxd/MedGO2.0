import SeccionGate from '@/components/SeccionGate';
import { requiredPlanDeLab } from '@/lib/acceso';

// El tramo sale de `LABORATORIOS` (src/lib/data/aportes.ts), no de aquí: un
// laboratorio nuevo se registra allí con su `track` y este layout no cambia.
export default function MorfologiaGlobulosRojosLayout({ children }: { children: React.ReactNode }) {
  return <SeccionGate required={requiredPlanDeLab('morfologia-globulos-rojos')}>{children}</SeccionGate>;
}
