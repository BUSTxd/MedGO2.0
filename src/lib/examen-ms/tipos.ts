/**
 * Contrato del banco de los exámenes prácticos 3D. El de miembro superior lo
 * escribe `scripts/examen-ms/ensamblar-banco.mjs` (clave
 * `aparato-locomotor/practico-ms`); el de abdomen,
 * `scripts/examen-digestivo/publicar.mjs` (`digestivo/practico-abdomen`). Se
 * sirven desde el bucket privado `examenes`: las respuestas no viajan en el bundle.
 */

/** Miembro superior: Huesos · Músculos · Arterias · Nervios · Venas. Abdomen: las de su banco. */
export type CategoriaMS = string;

export type ProbabilidadMS = 'salio' | 'muy_probable' | 'posible';

export type TipoB =
  | 'inervacion' | 'funcion' | 'insercion' | 'origen'
  | 'musculos_que_inerva' | 'territorio_sensitivo'
  | 'articulaciones' | 'inserciones_musculares'
  | 'ramas_colaterales' | 'ramas_terminales' | 'formadores' | 'desemboca'
  // Abdomen
  | 'caracteristicas' | 'limites_segmento' | 'relaciones' | 'ramas' | 'irrigacion'
  | 'drenaje' | 'porciones' | 'ligamentos' | 'segmentos' | 'constitucion';

/** Desde dónde se mira lo señalado en el examen (si no, se calcula). */
export type VistaExamen = 'anterior' | 'posterior' | 'lateral' | 'medial' | 'inferior' | 'superior';

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
  | { tipo: 'pieza'; en: string[]; vista?: VistaExamen }
  | { tipo: 'marcador'; hueso: string; punto: [number, number, number]; radio: number };

export interface PreguntaMS {
  id: string;
  categoria: CategoriaMS;
  tipoEstructura: 'hueso' | 'accidente' | 'musculo' | 'nervio' | 'arteria' | 'vena' | 'organo' | 'parte' | 'ligamento';
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
  /**
   * Barajas fijas (el abdomen: cada una es un examen real tal cual). Sin ellas,
   * `armarBarajas` parte el banco por probabilidad (miembro superior).
   */
  barajas?: { numero: number; nombre?: string; ids: string[] }[];
}
