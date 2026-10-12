import { LabGate } from '@/components/SeccionGate';
import { getCachedPlanState } from '@/lib/plans-server';
import { requiredPlanDeLab, tieneAccesoA } from '@/lib/acceso';
import { leerRegiones } from '@/lib/data/atlas-3d/regiones';
import Pagina from './Pagina';

/** El examen práctico solo existe para el miembro superior. */
const REGION_EXAMEN = 'miembro-superior-derecho';

// Server: decide el acceso ANTES de montar la página de cliente (ver SeccionGate).
// `?examen=1` abre directo en el examen práctico (enlace desde la Evaluación 1 del sílabo).
//
// Sin plan, `?examen=1` abre igual pero SOLO el examen (prueba gratis: barajas 1
// y 7): región fija y sin salida al atlas libre. Lo que se cobra de verdad —las
// preguntas de las demás barajas— lo recorta la route del banco; el modelo 3D
// es de un bucket público, así que aquí no hay nada más que esconder.
//
// Con o sin plan, `?examen=1` devuelve la MISMA rama (sin LabGate, que con plan
// no hace nada): al pagar, `router.refresh()` solo cambia `soloExamen`. Si
// cambiara de rama, React volvería a montar el examen y cerraría la pasarela a
// mitad del recibo.
//
// `?desde=laboratorio`: la prueba gratis se abrió desde el índice del
// Laboratorio, y «Salir» vuelve ahí en vez de a la Evaluación 1.
export default async function Page({ searchParams }: { searchParams: Promise<{ region?: string | string[]; examen?: string; desde?: string }> }) {
  const { region, examen, desde } = await searchParams;
  if (examen === '1') {
    const acceso = tieneAccesoA(await getCachedPlanState(), requiredPlanDeLab('atlas-3d'));
    return <Pagina regiones={acceso ? leerRegiones(region) : [REGION_EXAMEN]} examen soloExamen={!acceso} desdeLaboratorio={desde === 'laboratorio'} />;
  }
  return (
    <LabGate slug="atlas-3d">
      <Pagina regiones={leerRegiones(region)} examen={examen === '1'} />
    </LabGate>
  );
}
