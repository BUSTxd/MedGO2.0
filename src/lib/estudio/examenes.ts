import 'server-only';
import { AREAS } from '@/lib/data/encib';
import { PREGUNTAS } from '@/lib/data/encib/preguntas';
import { TEMARIO } from '@/lib/data/encib/temario';

export interface TemaExamen {
  codigo: string;
  nombre: string;
  porAnio: Record<number, number>;
}

export interface CatalogoExamenes {
  anios: number[];
  areas: { codigo: string; nombre: string; color: string; temas: TemaExamen[] }[];
}

export interface SesionExamen {
  anios: number[];
  /** Vacío significa todas las preguntas de los años elegidos. */
  codigos: string[];
}

/** Solo nombres y conteos: los enunciados se descargan por la API protegida. */
export function catalogoExamenes(): CatalogoExamenes {
  const conteos = new Map<string, Record<number, number>>();
  for (const q of PREGUNTAS) {
    const porAnio = conteos.get(q.codigo) ?? {};
    porAnio[q.anio] = (porAnio[q.anio] ?? 0) + 1;
    conteos.set(q.codigo, porAnio);
  }
  return {
    anios: [...new Set(PREGUNTAS.map((q) => q.anio))].sort((a, b) => b - a),
    areas: AREAS.map((a) => ({
      codigo: a.codigo, nombre: a.nombre, color: a.color,
      temas: (TEMARIO[a.codigo] ?? []).flatMap((bloque) => bloque.temas)
        .filter((t) => conteos.has(t.codigo))
        .map((t) => ({ ...t, porAnio: conteos.get(t.codigo)! })),
    })),
  };
}

/** Una URL inválida vuelve al configurador; nunca inicia una sesión distinta. */
export function sesionExamen(
  params: Record<string, string | string[] | undefined>, catalogo: CatalogoExamenes,
): SesionExamen | null {
  if (params.iniciar !== '1') return null;
  const anios = params.anios === 'todos' ? catalogo.anios
    : typeof params.anios === 'string' && catalogo.anios.includes(Number(params.anios)) ? [Number(params.anios)] : [];
  if (!anios.length || typeof params.temas !== 'string' || !params.temas) return null;
  if (params.temas === 'todos') return { anios, codigos: [] };
  const codigos = [...new Set(params.temas.split(','))].sort();
  const disponibles = new Set(catalogo.areas.flatMap((a) => a.temas)
    .filter((t) => anios.some((y) => t.porAnio[y] > 0)).map((t) => t.codigo));
  if (!codigos.every((codigo) => disponibles.has(codigo))) return null;
  return { anios, codigos };
}
