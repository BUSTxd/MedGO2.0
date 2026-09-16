import { temasInmunologia } from './inmunologia';

export interface ClaseRecomendada {
  /** Id de la actividad: /dashboard/cursos/<curso>/<claseId>. */
  claseId: string;
  /** Código del sílabo (T5, SGP-3, H1): es lo que el alumno reconoce. */
  codigo: string;
  /** Título sin el prefijo del código. */
  titulo: string;
  /** La clase declara `resumen`: el enlace puede abrirlo con `?resumen=1`. */
  conResumen: boolean;
  /** La clase está abierta a cualquier cuenta (flag `gratis` del sílabo). */
  gratis?: boolean;
}

export interface Tema {
  label: string;
  /** De la más directa a la más tangencial; la primera es la que se recomienda sola. */
  clases: ClaseRecomendada[];
}

export type TablaTemas = Record<string, Tema>;

/** Por slug de curso, el mismo del primer segmento de la clave del examen. */
export const TEMAS_POR_CURSO: Record<string, TablaTemas> = {
  inmunologia: temasInmunologia,
};

export function tablaDeCurso(curso: string): TablaTemas | undefined {
  return TEMAS_POR_CURSO[curso];
}

export function temaDe(curso: string, id: string): Tema | undefined {
  return TEMAS_POR_CURSO[curso]?.[id];
}
