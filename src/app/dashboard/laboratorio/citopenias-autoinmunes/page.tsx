import { getCachedPlanState } from '@/lib/plans-server';
import { labEsGratis, requiredPlanDeLab, requisitoDeLab, tieneAccesoA } from '@/lib/acceso';
import { contenidoDelLab } from '@/lib/citopenias/registro';
import Pagina from './Pagina';

// Server: sin `LabGate`, porque el laboratorio tiene vistazo gratis (capítulos 0 y 1,
// `VISTAZO`). Aquí se decide qué capítulos viajan al navegador: sin el plan, los de
// pago (y la URL de su voz) no salen del servidor. `?vistazo=1` deja al admin ver el
// lab como una cuenta sin plan.
const SLUG = 'citopenias-autoinmunes';

export default async function Page({ searchParams }: { searchParams: Promise<{ vistazo?: string }> }) {
  const [planState, { vistazo }] = await Promise.all([getCachedPlanState(), searchParams]);
  const requerido = requiredPlanDeLab(SLUG);
  const prueba = !!planState.allAccess && vistazo === '1';
  const completo = !prueba && (labEsGratis(SLUG) || tieneAccesoA(planState, requisitoDeLab(SLUG)));
  return <Pagina contenido={contenidoDelLab(completo)} plan={requerido} prueba={prueba} />;
}
