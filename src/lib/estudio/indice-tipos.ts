/**
 * Forma del índice de un curso para el planificador: qué subtítulos tiene cada
 * resumen, cuánto se tarda en leerlos y cuánta práctica cuelga de cada clase,
 * tema y subtítulo. Lo genera `scripts/estudio/indexar-curso.mjs` leyendo los
 * resúmenes del bucket y lo guarda en el bucket privado `examenes`
 * (`_indice/<curso>.json`): el repo es público y los subtítulos de los
 * resúmenes de pago no tienen por qué estar en GitHub.
 *
 * Sólo tipos (sin valores): lo importan el script, el servidor y la interfaz.
 */

export const VERSION_INDICE = 1;

/** Cómo se pudo partir el resumen; `pdf` y `falta` no tienen subtítulos. */
export type CalidadResumen = 'titulos' | 'hojas' | 'trozos' | 'pdf' | 'falta';

export interface SeccionIndice {
  /** `<resumenId>#<slug del subtítulo>`: estable mientras no se renombre el subtítulo. */
  id: string;
  titulo: string;
  /** «Padre › Hijo». */
  ruta: string;
  nivel: number;
  palabras: number;
  figuras: number;
  /** Lectura estimada: palabras / 180 + 0,5 por figura. */
  minutos: number;
  /** Temas de la tabla del curso que tocan las preguntas/tarjetas de esta sección. */
  temas: string[];
  /** Preguntas de alternativas cuyo `seccion` cae aquí. */
  preguntas: number;
  /** Tarjetas de memoria cuyo `seccion` cae aquí. */
  tarjetas: number;
}

export interface ResumenIndice {
  id: string;
  label: string;
  formato: 'html' | 'pdf';
  calidad: CalidadResumen;
  /** Huella del HTML del bucket: el verificador avisa si el índice quedó viejo. */
  hash?: string;
  minutos: number;
  secciones: SeccionIndice[];
}

export interface PracticaIndice {
  /** Clave del bucket `examenes`. */
  key: string;
  /** `examen`: banqueo de alternativas; `tarjetas`: tarjetas + quiz. */
  tipo: 'examen' | 'tarjetas';
  /** «Banqueo 2024», si el sílabo lo rotula. */
  etiqueta?: string;
  preguntas: number;
  tarjetas: number;
  /** Preguntas + tarjetas por tema. */
  porTema: Record<string, number>;
}

export interface ClaseIndice {
  id: string;
  codigo?: string;
  titulo: string;
  /** Tipo del sílabo (MAGISTRAL, TBL…). */
  tipo: string;
  /** Id de la semana del sílabo. */
  semana: string;
  /** La semana es de evaluación (`esEvaluacion`). */
  evaluacion: boolean;
  resumenes: ResumenIndice[];
  practica: PracticaIndice[];
}

export interface TemaIndice {
  label: string;
  /** Clases que lo tratan, de la tabla de temas. */
  clases: string[];
  /** Subtítulos que lo cubren: los de `secciones` en la tabla + los deducidos de las preguntas. */
  secciones: string[];
  /** Preguntas + tarjetas con este tema en todo el curso. */
  preguntas: number;
  /** Cuántas de ellas son de banqueos de evaluación (exámenes reales). */
  enExamenes: number;
  banqueo?: string;
  tarjetas?: string;
}

export interface IndiceCurso {
  version: typeof VERSION_INDICE;
  curso: string;
  generado: string;
  clases: ClaseIndice[];
  temas: Record<string, TemaIndice>;
}
