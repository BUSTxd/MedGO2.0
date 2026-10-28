import { getCachedPlanState } from '@/lib/plans-server';
import { labEsGratis, requiredPlanDeLab, requisitoDeLab, tieneAccesoA } from '@/lib/acceso';
import { contenidoDelLab } from '@/lib/hipersensibilidad/registro';
import Pagina from './Pagina';

// Server: sin `LabGate`, porque el laboratorio tiene vistazo gratis (la intro y
// la sensibilización, `VISTAZO`). Aquí se decide qué capítulos viajan al
// navegador: sin el plan, los de pago no salen del servidor. Tras pagar,
// `SubscribeModal` hace `router.refresh()` y esta página vuelve a llegar con
// todos, sin remontar el lab (la misma página, con más props).
//
// `?vistazo=1` deja al admin ver el lab como una cuenta sin plan (solo quita
// acceso, así que no hace falta más cerradura que `allAccess`).
const SLUG = 'hipersensibilidad';

export default async function Page({ searchParams }: { searchParams: Promise<{ vistazo?: string }> }) {
  const [planState, { vistazo }] = await Promise.all([getCachedPlanState(), searchParams]);
  const requerido = requiredPlanDeLab(SLUG);
  const prueba = !!planState.allAccess && vistazo === '1';
  const completo = !prueba && (labEsGratis(SLUG) || tieneAccesoA(planState, requisitoDeLab(SLUG)));
  return <Pagina contenido={contenidoDelLab(completo)} plan={requerido} prueba={prueba} />;
}
