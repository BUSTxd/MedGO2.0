import 'server-only';
import { SILABOS } from '@/lib/data/silabos';
import { REGISTRO_CLASES } from '@/lib/data/clases/registro';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import { createAdminClient } from '@/lib/supabase/admin';
import type { PlanState } from '@/lib/plans';
import type { EstadoNotas } from './tipos';

/**
 * Las notas de la plantilla de clase (`data/clases/<curso>/<clase>.json`). Viven en
 * el bucket privado `examenes` y las entrega `/api/estudio/notas/<curso>/<clase>`
 * con la regla del resumen de su clase: sin el plan, no salen del servidor.
 */

type Plan = Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>;
interface ActNotas { id: string; resumen?: { opciones?: { id: string }[] } }

/** Dónde está el JSON en el bucket (lo escribe scripts/clases/publicar.mjs). */
export const rutaNotas = (curso: string, clase: string) => `${curso}/notas/${clase}.json`;

/** Los ids con que se pide el resumen de la clase; sin resumen, el de la clase. */
const idsDeResumen = (a: ActNotas) => (a.resumen?.opciones?.length ? a.resumen.opciones.map((o) => o.id) : [a.id]);

/** Se abren con la misma regla que el resumen de su clase (`bloqueada` en cursos.ts). */
export function puedeVerNotas(plan: Plan, a: ActNotas): boolean {
  return idsDeResumen(a).some((id) => puedeVerResumen(plan, id));
}

export const tieneNotas = (curso: string, clase: string) => !!REGISTRO_CLASES[`${curso}/${clase}`]?.notas;

/** Qué enseña la pestaña «Notas». Una clase sin resumen ni notas no la tiene. */
export function estadoNotas(plan: Plan, curso: string, a: ActNotas): EstadoNotas | undefined {
  if (tieneNotas(curso, a.id)) return puedeVerNotas(plan, a) ? 'abiertas' : 'bloqueadas';
  return a.resumen ? 'pronto' : undefined;
}

export function actividadDe(curso: string, clase: string): ActNotas | null {
  for (const s of SILABOS[curso] ?? []) {
    for (const a of s.actividades as unknown as ActNotas[]) if (a.id === clase) return a;
  }
  return null;
}

/** El JSON tal cual (la route calcula su ETag sobre el texto). */
export async function descargarNotas(curso: string, clase: string): Promise<string | null> {
  const { data, error } = await createAdminClient().storage.from('examenes').download(rutaNotas(curso, clase));
  if (error || !data) {
    console.error('[notas] download error:', error?.message);
    return null;
  }
  return data.text();
}
