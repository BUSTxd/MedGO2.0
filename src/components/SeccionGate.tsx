import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import { tieneAccesoA } from '@/lib/acceso';
import type { PlanKey } from '@/lib/plans';
import LockedContent from './LockedContent';

/**
 * Paywall de una sección entera del dashboard (Histología, Investigación, un
 * laboratorio). Server Component: se monta desde el `layout.tsx` de la carpeta,
 * de modo que cubre el índice **y** sus rutas hijas sin tocar las páginas, que
 * son de cliente y algunas de varios cientos de líneas.
 *
 * `preview={false}`: aquí no se enseña el contenido difuminado por detrás. En
 * una clase el aperitivo invita a comprar; en un laboratorio significaría
 * montar la escena 3D entera para que nadie la vea.
 */
export default async function SeccionGate({
  required,
  children,
}: {
  required: PlanKey;
  children: React.ReactNode;
}) {
  const [planState, supabase] = await Promise.all([getCachedPlanState(), createClient()]);
  const { data: { user } } = await supabase.auth.getUser();

  if (tieneAccesoA(planState, required)) return <>{children}</>;

  return (
    <LockedContent
      requiredPlan={required}
      planState={planState}
      isAuthed={!!user}
      preview={false}
    >
      {children}
    </LockedContent>
  );
}
