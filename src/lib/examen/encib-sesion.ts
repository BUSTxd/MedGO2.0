import type { ExamQuestion } from './payload';
import type { SesionExamen } from '@/lib/estudio/examenes';

export type PreguntaSesionEncib = ExamQuestion & { n?: number; codigo?: string; anio?: number };

/** Cambia la vista, nunca las identidades ni las respuestas de la sesión. */
export function vistaPreguntasEncib(
  preguntas: PreguntaSesionEncib[],
  agrupada: boolean,
  area: string | null,
  areas: { codigo: string }[],
): PreguntaSesionEncib[] {
  if (!agrupada) return preguntas;
  if (area) return preguntas.filter((q) => q.codigo?.split('-')[0] === area);
  const orden = new Map(areas.map((a, i) => [a.codigo, i]));
  return [...preguntas].sort((a, b) =>
    (orden.get(a.codigo?.split('-')[0] ?? '') ?? areas.length) -
    (orden.get(b.codigo?.split('-')[0] ?? '') ?? areas.length));
}

export function claveSesionEncib(sesion: SesionExamen): string {
  return `sesion:${[...sesion.anios].sort((a, b) => b - a).join(',')}:${[...sesion.codigos].sort().join(',') || 'todos'}`;
}

/** Prefija los ids por año: los tres cuadernillos usan q1, q2, etc. */
export function combinarPreguntasEncib(
  grupos: { anio: number; preguntas: PreguntaSesionEncib[] }[], codigos: string[],
): PreguntaSesionEncib[] {
  const temas = new Set(codigos);
  return grupos.flatMap(({ anio, preguntas }) => preguntas
    .filter((q) => !temas.size || (q.codigo && temas.has(q.codigo)))
    .map((q) => ({ ...q, id: `${anio}:${q.id}`, anio })));
}
