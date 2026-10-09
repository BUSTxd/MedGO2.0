/**
 * Contrato del banco del examen 3D de miembro superior. Lo escribe
 * `scripts/examen-ms/ensamblar-banco.mjs` y se sirve desde el bucket privado
 * `examenes` (clave `aparato-locomotor/practico-ms`): las respuestas no viajan en
 * el bundle.
 */

export type CategoriaMS = 'Huesos' | 'Músculos' | 'Arterias' | 'Nervios' | 'Venas';

export type ProbabilidadMS = 'salio' | 'muy_probable' | 'posible';

export type TipoB =
  | 'inervacion' | 'funcion' | 'insercion' | 'origen'
  | 'musculos_que_inerva' | 'territorio_sensitivo'
  | 'articulaciones' | 'inserciones_musculares'
  | 'ramas_colaterales' | 'ramas_terminales' | 'formadores' | 'desemboca';

/** Una respuesta esperada de la pregunta B. */
export interface RespuestaB {
  /** Cómo se muestra al corregir. */
  texto: string;
  /** Estructura del léxico a la que se refiere (si es una estructura). */
  ref?: string;
  /** Formas escritas que valen. */
  aceptadas: string[];
  /** Nombres de otras estructuras parecidas que NO valen. */
  noConfundir?: string[];
  /** Grupos de palabras clave que deben aparecer todos (cada grupo, alternativas). */
  conceptos?: string[][];
  /** Palabras que, si aparecen, la hacen incorrecta (p. ej. el sentido contrario). */
  excluye?: string[];
  /** Matiz que no hace falta escribir. */
  precision?: string;
  /** Aclaración que se muestra al corregir. */
  nota?: string;
  /** La respuesta esperada cuando hay varias equivalentes. */
  principal?: boolean;
}

export type ObjetivoMS =
  | { tipo: 'pieza'; en: string[] }
  | { tipo: 'marcador'; hueso: string; punto: [number, number, number]; radio: number };

export interface PreguntaMS {
  id: string;
  categoria: CategoriaMS;
  tipoEstructura: 'hueso' | 'accidente' | 'musculo' | 'nervio' | 'arteria' | 'vena';
  region: string;
  objetivo: ObjetivoMS;
  preguntaA: { enunciado: string; respuesta: string; aceptadas: string[]; noConfundir: string[] };
  preguntaB: {
    enunciado: string;
    tipoB: TipoB;
    /** Cuántos elementos exige («indique 2»). */
    pide: number;
    filtro?: string;
    respuestas: RespuestaB[];
    criterio: string;
    nota?: string;
    /** Hay que escribir todas las respuestas, no `pide` de ellas. */
    todas?: boolean;
  };
  /** «oficial 2025-A», «oficial 2024 (solo A; B generada)» o «generada». */
  origen: string;
  tambienOficial?: string;
  probabilidad: ProbabilidadMS;
  resumenRelacionado: { claseId: string; opcion: string; seccion: string; href: string };
  revision?: string[];
}

export interface BancoMS {
  version: number;
  generado: string;
  region: string;
  categorias: CategoriaMS[];
  preguntas: PreguntaMS[];
  /** Todas las formas aceptadas de cada estructura del léxico (para desambiguar). */
  formas: Record<string, string[]>;
}
