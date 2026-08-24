import SeccionGate from '@/components/SeccionGate';
import { requiredPlanDeLab } from '@/lib/acceso';

// El tramo sale de `LABORATORIOS` (src/lib/data/aportes.ts), no de aquí: un
// laboratorio nuevo se registra allí con su `track` y este layout no cambia.
export default function Eva3Layout({ children }: { children: React.ReactNode }) {
  return <SeccionGate required={requiredPlanDeLab('eva-3')}>{children}</SeccionGate>;
}
