/**
 * Contrato del banco de práctica del lab Médula Espinal 3D. El banco lo arma
 * `scripts/medula-espinal/practica/ensamblar.mjs` desde `data/medula-practica/`
 * (fuera de git: lleva las respuestas) y se sirve desde el bucket privado
 * `examenes` (clave `CLAVE_PRACTICA`), así las respuestas no viajan en el bundle.
 */

import type { LaminaGroupId, LevelId, TractId } from '@/app/dashboard/laboratorio/medula-espinal/engine/anatomy';

export const CLAVE_PRACTICA = 'neurologia/medula-practica';

/** Bloque temático: láminas y núcleos del corte, vías, o síndromes. */
export type CategoriaMP = 'corte' | 'tractos' | 'clinico';

/** Pregunta de teoría o caso clínico (con viñeta). */
export type TipoMP = 'teorica' | 'caso';

/** Lo que hay que tocar en el corte. */
export type ObjetivoMP =
  | { kind: 'lamina'; ids: LaminaGroupId[] }
  | { kind: 'tract'; ids: TractId[] };

interface Base {
  id: string;
  categoria: CategoriaMP;
  tipo: TipoMP;
  /** Nivel del corte que se pinta en el lienzo. */
  nivel: LevelId;
  /** Qué se pinta: la sustancia gris (láminas) o la blanca (tractos). */
  vista: 'laminas' | 'tractos';
  /** Viñeta clínica, solo en los casos. */
  caso?: string;
  enunciado: string;
  /** Por qué la respuesta es esa (se muestra al corregir). */
  explicacion: string;
  /** Lo que se resalta en el modelo al corregir una pregunta de alternativas. */
  resaltar?: ObjetivoMP;
  /**
   * De dónde sale: «propia», o la pregunta libre que la inspira
   * («HEAD-QA MIR 2016 #123, adaptada», «MedMCQA, adaptada»).
   */
  origen: string;
}

/** Señalar en el corte: vale cualquiera de `objetivo.ids`. */
export interface PreguntaSenalar extends Base {
  forma: 'senalar';
  objetivo: ObjetivoMP;
}

/** Alternativas: una sola correcta. */
export interface PreguntaOpciones extends Base {
  forma: 'opciones';
  opciones: string[];
  correcta: number;
}

export type PreguntaMP = PreguntaSenalar | PreguntaOpciones;

export interface BancoMP {
  version: number;
  generado: string;
  preguntas: PreguntaMP[];
}

export const CATEGORIAS_MP: Array<{ id: CategoriaMP; label: string; desc: string }> = [
  { id: 'corte', label: 'Corte', desc: 'Láminas de Rexed, núcleos y niveles' },
  { id: 'tractos', label: 'Tractos', desc: 'Vías ascendentes y descendentes' },
  { id: 'clinico', label: 'Clínico', desc: 'Síndromes medulares y lesiones' },
];

export const TIPOS_MP: Array<{ id: TipoMP; label: string }> = [
  { id: 'teorica', label: 'Teóricas' },
  { id: 'caso', label: 'Casos clínicos' },
];
