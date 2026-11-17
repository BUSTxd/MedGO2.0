/**
 * Contrato del banco de práctica del lab Tronco encefálico 3D. El banco lo arma
 * `scripts/tronco-encefalico/practica.mjs` desde `data/tronco-practica/` (fuera
 * de git: lleva las respuestas) y se sirve desde el bucket privado `examenes`
 * (clave `CLAVE_PRACTICA`), así las respuestas no viajan en el bundle. Mismo
 * diseño que las prácticas de Médula Espinal 3D y Polígono de Willis 3D.
 */

export const CLAVE_PRACTICA = 'neurologia/tronco-practica';

/** Bloque temático. */
export type CategoriaTP = 'superficie' | 'pares' | 'nucleos' | 'clinico';

/** Pregunta de teoría o caso clínico (con viñeta). */
export type TipoTP = 'teorica' | 'caso';

/**
 * Cómo se muestra el modelo en la pregunta y qué se puede tocar:
 * - `superficie`: tronco opaco, se tocan los relieves (ids de anatomia.ts);
 * - `nervios`: tronco opaco con los pares, se toca un nervio (III…XII);
 * - `nucleos`: tronco de cristal, se toca un núcleo o una vía (ids de interior.ts);
 * - `corte`: corte transversal al nivel `nivel` (ids de interior.ts).
 */
export type VistaTP = 'superficie' | 'nervios' | 'nucleos' | 'corte';

export type MirarTP = 'anterior' | 'lateral' | 'posterior';

interface Base {
  id: string;
  categoria: CategoriaTP;
  tipo: TipoTP;
  vista: VistaTP;
  /** Desde dónde se mira el modelo al empezar la pregunta. */
  mirar: MirarTP;
  /** Nivel del corte (ids de engine/cortes.ts), solo en la vista `corte`. */
  nivel?: string;
  /** Viñeta clínica, solo en los casos. */
  caso?: string;
  enunciado: string;
  /** Por qué la respuesta es esa (se muestra al corregir). */
  explicacion: string;
  /** Lo que se marca en verde al corregir una de alternativas (ids de la vista). */
  resaltar?: string[];
  /** «propia», o la fuente libre que la inspira. */
  origen: string;
}

/** Señalar en el modelo: vale tocar cualquiera de `objetivo` (de cualquier lado). */
export interface PreguntaSenalar extends Base {
  forma: 'senalar';
  objetivo: string[];
}

/** Alternativas: una sola correcta. */
export interface PreguntaOpciones extends Base {
  forma: 'opciones';
  opciones: string[];
  correcta: number;
}

export type PreguntaTP = PreguntaSenalar | PreguntaOpciones;

export interface BancoTP {
  version: number;
  generado: string;
  preguntas: PreguntaTP[];
}

export const CATEGORIAS_TP: Array<{ id: CategoriaTP; label: string; desc: string }> = [
  { id: 'superficie', label: 'Superficie', desc: 'Relieves de las caras anterior, lateral y posterior' },
  { id: 'pares', label: 'Pares craneales', desc: 'Dónde emerge cada par, qué hace y su lesión' },
  { id: 'nucleos', label: 'Núcleos y cortes', desc: 'Núcleos, vías largas y cortes del atlas' },
  { id: 'clinico', label: 'Clínico', desc: 'Síndromes alternos: localiza la lesión' },
];

export const TIPOS_TP: Array<{ id: TipoTP; label: string }> = [
  { id: 'teorica', label: 'Teóricas' },
  { id: 'caso', label: 'Casos clínicos' },
];
