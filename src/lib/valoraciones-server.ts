import { createAdminClient } from '@/lib/supabase/admin';
import {
  satisfaccionDe, totalDe,
  type ClaseValorada, type Conteo, type PreguntaValorada, type ResumenValoraciones, type Valoracion,
} from '@/lib/valoraciones';

/**
 * Lectura y escritura de `pregunta_valoraciones` (RLS activo y sin políticas:
 * el navegador nunca la toca, todo pasa por aquí con la service role key).
 * Mismo apaño de tipos que `aportes-marcas-server.ts`.
 */

interface Fila { exam_key: string; question_id: string; rating: string }
interface ErrorSupabase { message: string }

function tabla() {
  return createAdminClient().from('pregunta_valoraciones') as unknown as {
    upsert: (
      row: Record<string, unknown>,
      opts?: { onConflict?: string },
    ) => Promise<{ error: ErrorSupabase | null }>;
    select: (cols: string) => {
      range: (a: number, b: number) => Promise<{ data: Fila[] | null; error: ErrorSupabase | null }>;
    };
  };
}

export async function guardarValoracion(
  userId: string, examKey: string, questionId: string, rating: Valoracion,
): Promise<boolean> {
  const { error } = await tabla().upsert(
    { user_id: userId, exam_key: examKey, question_id: questionId, rating, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,exam_key,question_id' },
  );
  if (error) console.error('[valoracion] upsert', error.message);
  return !error;
}

async function todasLasFilas(): Promise<Fila[]> {
  const filas: Fila[] = [];
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await tabla().select('exam_key, question_id, rating').range(desde, desde + 999);
    if (error) throw new Error(`pregunta_valoraciones: ${error.message}`);
    filas.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return filas;
}

interface PreguntaCruda { id: string; stem?: string }

/** Título y enunciados de cada banqueo, para que el panel diga de qué pregunta se habla. */
async function leerBanqueo(key: string): Promise<{ titulo: string; stems: Map<string, string> }> {
  const { data, error } = await createAdminClient().storage.from('examenes').download(`${key}.json`);
  if (error || !data) return { titulo: key, stems: new Map() };
  try {
    const j = JSON.parse(await data.text()) as { title?: string; questions?: PreguntaCruda[] };
    return {
      titulo: j.title || key,
      stems: new Map((j.questions ?? []).map(q => [q.id, q.stem ?? ''])),
    };
  } catch {
    return { titulo: key, stems: new Map() };
  }
}

const vacio = (): Conteo => ({ rojo: 0, amarillo: 0, verde: 0 });

export async function resumenValoraciones(): Promise<ResumenValoraciones> {
  const filas = await todasLasFilas();
  const porClase = new Map<string, Map<string, Conteo>>();
  const global = vacio();
  for (const f of filas) {
    if (f.rating !== 'rojo' && f.rating !== 'amarillo' && f.rating !== 'verde') continue;
    const clase = porClase.get(f.exam_key) ?? new Map<string, Conteo>();
    const c = clase.get(f.question_id) ?? vacio();
    c[f.rating]++;
    global[f.rating]++;
    clase.set(f.question_id, c);
    porClase.set(f.exam_key, clase);
  }

  const claves = [...porClase.keys()];
  const banqueos = await Promise.all(claves.map(leerBanqueo));

  const clases: ClaseValorada[] = claves.map((key, i) => {
    const { titulo, stems } = banqueos[i];
    const acumulado = vacio();
    const preguntas: PreguntaValorada[] = [...porClase.get(key)!].map(([id, c]) => {
      acumulado.rojo += c.rojo; acumulado.amarillo += c.amarillo; acumulado.verde += c.verde;
      const enunciado = stems.get(id) ?? '';
      return {
        id, ...c,
        enunciado: enunciado.length > 170 ? `${enunciado.slice(0, 170)}…` : enunciado,
        total: totalDe(c),
        satisfaccion: satisfaccionDe(c) ?? 0,
      };
    });
    // Las peor valoradas primero; a igualdad, las que más votos tienen.
    preguntas.sort((a, b) => a.satisfaccion - b.satisfaccion || b.total - a.total || a.id.localeCompare(b.id));
    return { key, titulo, ...acumulado, total: totalDe(acumulado), satisfaccion: satisfaccionDe(acumulado) ?? 0, preguntas };
  });
  clases.sort((a, b) => a.satisfaccion - b.satisfaccion || b.total - a.total);

  return { clases, total: totalDe(global), ...global };
}
