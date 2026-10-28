import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { IndiceCurso } from './indice-tipos';

/**
 * El índice de un curso para el planificador (lo genera
 * `scripts/estudio/indexar-curso.mjs`). Vive en el bucket privado `examenes`
 * (`_indice/<curso>.json`): el de `resumenes` sólo acepta PDF/HTML.
 */

/**
 * Cursos que ofrecen planificador: los que pasan la auditoría
 * (`indexar-curso.mjs --auditar`): resúmenes HTML con subtítulos, práctica y
 * tabla de temas. Al añadir uno, indexarlo antes (ver CLAUDE.md, «Planificador
 * y catálogo por tema»).
 */
export const CURSOS_CON_PLAN = new Set(['inmunologia']);

const VIDA_MS = 5 * 60_000;
const memoria = new Map<string, { indice: IndiceCurso; hasta: number }>();

export async function indiceDeCurso(curso: string): Promise<IndiceCurso | null> {
  const previo = memoria.get(curso);
  if (previo && previo.hasta > Date.now()) return previo.indice;
  const { data, error } = await createAdminClient().storage.from('examenes').download(`_indice/${curso}.json`);
  if (error || !data) {
    console.error('[estudio/indice] sin índice de', curso, error?.message);
    return previo?.indice ?? null;
  }
  const indice = JSON.parse(await data.text()) as IndiceCurso;
  memoria.set(curso, { indice, hasta: Date.now() + VIDA_MS });
  return indice;
}

/**
 * Lo que necesita el navegador para calcular el plan: sin las cifras de
 * auditoría (palabras, figuras, conteos por sección, huellas). Un tercio del
 * peso del índice entero.
 */
export function indiceParaCliente(i: IndiceCurso): IndiceCurso {
  return {
    ...i,
    clases: i.clases.map((c) => ({
      ...c,
      resumenes: c.resumenes.map(({ hash: _h, ...r }) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
        ...r,
        secciones: r.secciones.map((s) => ({
          id: s.id, titulo: s.titulo, ruta: '', nivel: s.nivel, palabras: 0, figuras: 0,
          minutos: s.minutos, temas: s.temas, preguntas: 0, tarjetas: 0,
        })),
      })),
    })),
  };
}

/** Todos los ids de subtítulo del índice (para validar los bloques que arma el alumno). */
export function idsDeSecciones(i: IndiceCurso): Set<string> {
  return new Set(i.clases.flatMap((c) => c.resumenes.flatMap((r) => r.secciones.map((s) => s.id))));
}
