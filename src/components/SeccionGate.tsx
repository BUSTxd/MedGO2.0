import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import { labEsGratis, requiredPlanDeLab, requisitoDeLab, tieneAccesoA } from '@/lib/acceso';
import type { PlanKey, Requisito } from '@/lib/plans';
import LockedContent from './LockedContent';

/**
 * Paywall de una sección entera del dashboard (Histología, Investigación, un
 * laboratorio). Server Component que se monta desde el **`page.tsx`** de cada
 * ruta, no desde el `layout.tsx`:
 *
 * - Un layout no impide que la página se renderice: su segmento viaja en el
 *   payload RSC igual, y como estas páginas son de cliente, el navegador se
 *   bajaba su JS (preguntas y respuestas incluidas) aunque viera el candado.
 * - Por lo mismo, sin acceso NO se le pasan los `children` a `LockedContent`:
 *   lo que recibe un componente cliente como prop se serializa entero.
 *
 * Por eso cada ruta tiene un `page.tsx` de servidor mínimo que envuelve a su
 * `Pagina.tsx` (la página de cliente de siempre) en este gate.
 *
 * `preview={false}`: aquí no se enseña el contenido difuminado por detrás. En
 * una clase el aperitivo invita a comprar; en un laboratorio significaría
 * montar la escena 3D entera para que nadie la vea.
 */
export default async function SeccionGate({
  required,
  requisito,
  children,
}: {
  /** El plan legado que ofrece la tarjeta. */
  required: PlanKey;
  /** Lo que pide la sección, si no basta con `required` (un laboratorio es nivel completo). */
  requisito?: Requisito;
  children: React.ReactNode;
}) {
  const [planState, supabase] = await Promise.all([getCachedPlanState(), createClient()]);

  if (tieneAccesoA(planState, requisito ?? required)) return <>{children}</>;

  const { data: { user } } = await supabase.auth.getUser();
  return (
    <LockedContent
      requiredPlan={required}
      requisito={requisito}
      planState={planState}
      isAuthed={!!user}
      preview={false}
    >
      {null}
    </LockedContent>
  );
}

/**
 * Gate de un laboratorio: el tramo y si es gratis salen de `LABORATORIOS`
 * (src/lib/data/aportes.ts), así que cambiar el flag allí abre o cierra el
 * laboratorio sin tocar su página.
 */
export function LabGate({ slug, children }: { slug: string; children: React.ReactNode }) {
  if (labEsGratis(slug)) return <>{children}</>;
  return <SeccionGate required={requiredPlanDeLab(slug)} requisito={requisitoDeLab(slug)}>{children}</SeccionGate>;
}
