/**
 * Contrato del banco de práctica del lab Polígono de Willis 3D. El banco lo arma
 * `scripts/poligono-willis/practica/ensamblar.mjs` desde `data/willis-practica/`
 * (fuera de git: lleva las respuestas) y se sirve desde el bucket privado
 * `examenes` (clave `CLAVE_PRACTICA`), así las respuestas no viajan en el bundle.
 * Mismo diseño que la práctica de Médula Espinal 3D (`src/lib/medula-practica`).
 */

import type { ArteriaId } from '@/app/dashboard/laboratorio/poligono-willis/engine/anatomia';

export const CLAVE_PRACTICA = 'neurologia/willis-practica';

/** Bloque temático: de dónde nace cada arteria, qué irriga, o la clínica. */
export type CategoriaWP = 'anatomia' | 'territorios' | 'clinico';

/** Pregunta de teoría o caso clínico (con viñeta). */
export type TipoWP = 'teorica' | 'caso';

interface Base {
  id: string;
  categoria: CategoriaWP;
  tipo: TipoWP;
  /** Postura del modelo: la de atlas o la real (para el cuello). */
  postura: 'atlas' | 'real';
  /** Viñeta clínica, solo en los casos. */
  caso?: string;
  enunciado: string;
  /** Por qué la respuesta es esa (se muestra al corregir). */
  explicacion: string;
  /** Arterias que se marcan en verde al corregir una de alternativas. */
  resaltar?: ArteriaId[];
  /**
   * De dónde sale: «propia», o la pregunta libre que la inspira
   * («HEAD-QA MIR 2016 #123, adaptada», «MedMCQA, adaptada»).
   */
  origen: string;
}

/** Señalar en el modelo: vale tocar cualquiera de `objetivo` (de cualquier lado). */
export interface PreguntaSenalar extends Base {
  forma: 'senalar';
  objetivo: ArteriaId[];
}

/** Alternativas: una sola correcta. */
export interface PreguntaOpciones extends Base {
  forma: 'opciones';
  opciones: string[];
  correcta: number;
}

export type PreguntaWP = PreguntaSenalar | PreguntaOpciones;

export interface BancoWP {
  version: number;
  generado: string;
  preguntas: PreguntaWP[];
}

export const CATEGORIAS_WP: Array<{ id: CategoriaWP; label: string; desc: string }> = [
  { id: 'anatomia', label: 'Anatomía', desc: 'De dónde nace cada arteria, el anillo y sus ramas' },
  { id: 'territorios', label: 'Territorios', desc: 'Qué irriga cada arteria' },
  { id: 'clinico', label: 'Clínico', desc: 'Aneurismas, ictus y variantes' },
];

export const TIPOS_WP: Array<{ id: TipoWP; label: string }> = [
  { id: 'teorica', label: 'Teóricas' },
  { id: 'caso', label: 'Casos clínicos' },
];
