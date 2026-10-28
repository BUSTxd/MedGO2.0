import { temasInmunologia } from './inmunologia';
import { temasEpidemiologia } from './epidemiologia';
import { temasPsicologiaMedica } from './psicologia-medica';
import { temasPatologia } from './patologia';

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
  /**
   * Comienzo del título de la sección del resumen que trata el tema: el visor
   * la busca entre los h1-h4 (sin distinguir mayúsculas ni tildes) y abre ahí.
   */
  seccion?: string;
}

/** Enlace a la clase; con resumen accesible, lo abre (y en su sección). */
export function hrefDeClase(curso: string, c: ClaseRecomendada, abrir: boolean): string {
  const base = `/dashboard/cursos/${curso}/${c.claseId}`;
  if (!abrir || !c.conResumen) return base;
  return `${base}?resumen=1${c.seccion ? `&seccion=${encodeURIComponent(c.seccion)}` : ''}`;
}

export interface Tema {
  label: string;
  /**
   * De la más directa a la más tangencial; la primera es la que se recomienda sola.
   * Vacía en un curso aún sin mapear (Epidemiología): el informe dice el tema
   * fallado pero no recomienda clase.
   */
  clases: ClaseRecomendada[];
  /**
   * Subtítulos del resumen que lo cubren, como ids del índice del planificador
   * (`<resumenId>#<slug>`, ver `scripts/estudio/indexar-curso.mjs`). Opcional:
   * el indexador ya los deduce del `seccion` de las preguntas y tarjetas con este
   * tema; esto solo añade los que ninguna pregunta toca todavía.
   */
  secciones?: string[];
  /**
   * Banqueo propio del tema (clave del bucket `examenes`, también en `EXAMENES`).
   * El planificador lo prefiere a filtrar por `tema` los banqueos de la clase.
   */
  banqueo?: string;
  /** Tarjetas propias del tema (clave del bucket `examenes`, también en `EXAMENES`). */
  tarjetas?: string;
}

export type TablaTemas = Record<string, Tema>;

/** Por slug de curso, el mismo del primer segmento de la clave del examen. */
export const TEMAS_POR_CURSO: Record<string, TablaTemas> = {
  inmunologia: temasInmunologia,
  epidemiologia: temasEpidemiologia,
  'psicologia-medica': temasPsicologiaMedica,
  patologia: temasPatologia,
};

export function tablaDeCurso(curso: string): TablaTemas | undefined {
  return TEMAS_POR_CURSO[curso];
}

export function temaDe(curso: string, id: string): Tema | undefined {
  return TEMAS_POR_CURSO[curso]?.[id];
}
