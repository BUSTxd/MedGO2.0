import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Qué resúmenes existen en HTML y cómo se bajan del bucket privado `resumenes`.
 * Lo comparten la ruta del visor (`api/resumen-html/[claseId]`) y la IA
 * (`lib/ia/secciones.ts`), que lee el mismo documento para armar su contexto.
 * El candado (`puedeVerResumen`) lo pone cada llamador: aquí no hay sesión.
 */

// Ids con un .html en el bucket `resumenes`. Mismo criterio que el ALLOWED de
// la route de PDF: si no está aquí, es 404 sin tocar Storage.
export const ALLOWED = new Set([
  'bcm-afa-1',
  // Un solo documento para dos actividades: lo abren los Banqueos del examen
  // final y del parcial, que apuntan al mismo id (no hay copia duplicada).
  'bcm-examen-final-resuelto',
  'bcm-pl-6',
  // PL10 lo abre la tarjeta «Banqueo», no «Resumen»: es la guía resuelta.
  'bcm-pl-10-anotado',
  'bcm-ta-1',
  'bcm-ta-10',
  'bcm-ta-13',
  'bcm-ta-2',
  'bcm-ta-7',
  'bcm-ta-3',
  'bcm-ta-4',
  'bcm-ta-5',
  'bcm-te-11',
  'bcm-te-2-html',
  'bcm-te-6-html',
  // Segundo resumen de Te4: la clase se ofrece en dos envases y el alumno
  // elige. El id lleva sufijo porque `bcm-te-4` ya es el PDF, en otro bucket.
  'bcm-te-4-html',
  'bcm-te-8',
  'dig-clase-1',
  'dig-clase-2',
  'dig-clase-3',
  'dig-clase-5',
  'dig-clase-6',
  'dig-clase-7',
  'dig-clase-8',
  'dig-clase-9',
  'dig-clase-10',
  'dig-clase-11',
  'dig-clase-12',
  'dig-clase-14',
  'dig-clase-15',
  'dig-clase-16',
  'dig-clase-18',
  'dig-tbl-1',
  'dig-tbl-2',
  'epi-t-2', 'epi-t-3', 'epi-t-4',
  // Inmunología: con prefijo, a diferencia de sus PDF (`t-10`, `sgp-1`…),
  // porque `t-N` es un nombre que cualquier otro curso podría usar.
  'inm-t-1', 'inm-t-2', 'inm-t-3', 'inm-t-4', 'inm-t-5', 'inm-t-6', 'inm-t-7',
  'inm-t-8', 'inm-t-9', 'inm-t-10', 'inm-t-11', 'inm-t-12', 'inm-t-13', 'inm-t-14',
  'inm-sgp-1', 'inm-sgp-2', 'inm-sgp-3', 'inm-sgp-4',
  'inm-tbl-1', 'inm-tbl-2', 'inm-tbl-3',
  'inm-h-1', 'inm-h-2', 'inm-l-2',
  'loc-clase-2',
  'loc-clase-2-osteo',
  'loc-clase-3',
  'loc-clase-4',
  'loc-clase-5',
  'loc-clase-7',
  'loc-clase-8',
  'loc-clase-9',
  'loc-clase-9-osteo',
  'loc-clase-10',
  'loc-clase-11',
  'loc-clase-12',
  'loc-clase-13',
  'loc-clase-14',
  'loc-clase-15',
  'loc-sgp-1',
  'loc-sgp-2',
  'loc-sgp-3',
  'loc-tbl-1',
  'loc-tbl-2',
  'loc-embrio-1',
  'loc-embrio-2',
  'loc-histo-1',
  'loc-histo-2',
  'loc-histo-3',
  'pat-acp-1',
  'pat-acp-8',
  'pat-ai-3',
  'pat-c-1',
  'pat-tbl-2',
]);

// id → ruta dentro del bucket (sin extensión).
export const FILE_ALIAS: Record<string, string> = {
  'bcm-afa-1': 'biologia-celular/bcm-afa-1',
  'bcm-examen-final-resuelto': 'biologia-celular/bcm-examen-final-resuelto',
  'bcm-pl-6': 'biologia-celular/bcm-pl-6',
  'bcm-pl-10-anotado': 'biologia-celular/bcm-pl-10-anotado',
  'bcm-ta-1': 'biologia-celular/bcm-ta-1',
  'bcm-ta-10': 'biologia-celular/bcm-ta-10',
  'bcm-ta-13': 'biologia-celular/bcm-ta-13',
  'bcm-ta-2': 'biologia-celular/bcm-ta-2',
  'bcm-ta-3': 'biologia-celular/bcm-ta-3',
  'bcm-ta-4': 'biologia-celular/bcm-ta-4',
  'bcm-ta-7': 'biologia-celular/bcm-ta-7',
  'bcm-ta-5': 'biologia-celular/bcm-ta-5',
  'bcm-te-11': 'biologia-celular/bcm-te-11',
  'bcm-te-2-html': 'biologia-celular/bcm-te-2-html',
  'bcm-te-6-html': 'biologia-celular/bcm-te-6-html',
  'bcm-te-4-html': 'biologia-celular/bcm-te-4-html',
  'bcm-te-8': 'biologia-celular/bcm-te-8',
  'dig-clase-1': 'digestivo/dig-clase-1',
  'dig-clase-2': 'digestivo/dig-clase-2',
  'dig-clase-3': 'digestivo/dig-clase-3',
  'dig-clase-5': 'digestivo/dig-clase-5',
  'dig-clase-6': 'digestivo/dig-clase-6',
  'dig-clase-7': 'digestivo/dig-clase-7',
  'dig-clase-8': 'digestivo/dig-clase-8',
  'dig-clase-9': 'digestivo/dig-clase-9',
  'dig-clase-10': 'digestivo/dig-clase-10',
  'dig-clase-11': 'digestivo/dig-clase-11',
  'dig-clase-12': 'digestivo/dig-clase-12',
  'dig-clase-14': 'digestivo/dig-clase-14',
  'dig-clase-15': 'digestivo/dig-clase-15',
  'dig-clase-16': 'digestivo/dig-clase-16',
  'dig-clase-18': 'digestivo/dig-clase-18',
  'dig-tbl-1': 'digestivo/dig-tbl-1',
  'dig-tbl-2': 'digestivo/dig-tbl-2',
  'epi-t-2': 'epidemiologia/epi-t-2',
  'epi-t-3': 'epidemiologia/epi-t-3',
  'epi-t-4': 'epidemiologia/epi-t-4',
  'inm-t-1': 'inmunologia/inm-t-1',
  'inm-t-2': 'inmunologia/inm-t-2',
  'inm-t-3': 'inmunologia/inm-t-3',
  'inm-t-4': 'inmunologia/inm-t-4',
  'inm-t-5': 'inmunologia/inm-t-5',
  'inm-t-6': 'inmunologia/inm-t-6',
  'inm-t-7': 'inmunologia/inm-t-7',
  'inm-t-8': 'inmunologia/inm-t-8',
  'inm-t-9': 'inmunologia/inm-t-9',
  'inm-t-10': 'inmunologia/inm-t-10',
  'inm-t-11': 'inmunologia/inm-t-11',
  'inm-t-12': 'inmunologia/inm-t-12',
  'inm-t-13': 'inmunologia/inm-t-13',
  'inm-t-14': 'inmunologia/inm-t-14',
  'inm-sgp-1': 'inmunologia/inm-sgp-1',
  'inm-sgp-2': 'inmunologia/inm-sgp-2',
  'inm-sgp-3': 'inmunologia/inm-sgp-3',
  'inm-sgp-4': 'inmunologia/inm-sgp-4',
  'inm-tbl-1': 'inmunologia/inm-tbl-1',
  'inm-tbl-2': 'inmunologia/inm-tbl-2',
  'inm-tbl-3': 'inmunologia/inm-tbl-3',
  'inm-h-1': 'inmunologia/inm-h-1',
  'inm-h-2': 'inmunologia/inm-h-2',
  'inm-l-2': 'inmunologia/inm-l-2',
  'loc-clase-2': 'aparato-locomotor/loc-clase-2',
  'loc-clase-2-osteo': 'aparato-locomotor/loc-clase-2-osteo',
  'loc-clase-3': 'aparato-locomotor/loc-clase-3',
  'loc-clase-4': 'aparato-locomotor/loc-clase-4',
  'loc-clase-5': 'aparato-locomotor/loc-clase-5',
  'loc-clase-7': 'aparato-locomotor/loc-clase-7',
  'loc-clase-8': 'aparato-locomotor/loc-clase-8',
  'loc-clase-9': 'aparato-locomotor/loc-clase-9',
  'loc-clase-9-osteo': 'aparato-locomotor/loc-clase-9-osteo',
  'loc-clase-10': 'aparato-locomotor/loc-clase-10',
  'loc-clase-11': 'aparato-locomotor/loc-clase-11',
  'loc-clase-12': 'aparato-locomotor/loc-clase-12',
  'loc-clase-13': 'aparato-locomotor/loc-clase-13',
  'loc-clase-14': 'aparato-locomotor/loc-clase-14',
  'loc-clase-15': 'aparato-locomotor/loc-clase-15',
  'loc-sgp-1': 'aparato-locomotor/loc-sgp-1',
  'loc-sgp-2': 'aparato-locomotor/loc-sgp-2',
  'loc-sgp-3': 'aparato-locomotor/loc-sgp-3',
  'loc-tbl-1': 'aparato-locomotor/loc-tbl-1',
  'loc-tbl-2': 'aparato-locomotor/loc-tbl-2',
  'loc-embrio-1': 'aparato-locomotor/loc-embrio-1',
  'loc-embrio-2': 'aparato-locomotor/loc-embrio-2',
  'loc-histo-1': 'aparato-locomotor/loc-histo-1',
  'loc-histo-2': 'aparato-locomotor/loc-histo-2',
  'loc-histo-3': 'aparato-locomotor/loc-histo-3',
  'pat-acp-1': 'patologia/pat-acp-1',
  'pat-acp-8': 'patologia/pat-acp-8',
  'pat-ai-3': 'patologia/pat-ai-3',
  'pat-c-1': 'patologia/pat-c-1',
  'pat-tbl-2': 'patologia/pat-tbl-2',
};

export function existeResumenHtml(claseId: string): boolean {
  return ALLOWED.has(claseId);
}

/** El fragmento HTML tal como está en el bucket, o `null` si no se pudo bajar. */
export async function descargarResumenHtml(claseId: string): Promise<string | null> {
  if (!ALLOWED.has(claseId)) return null;
  const fileId = FILE_ALIAS[claseId] ?? claseId;
  const { data, error } = await createAdminClient().storage
    .from('resumenes')
    .download(`${fileId}.html`);
  if (error || !data) {
    console.error('[resumen-html] download error:', error?.message);
    return null;
  }
  return data.text();
}
