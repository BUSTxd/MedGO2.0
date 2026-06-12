// Tipos compartidos del simulador EKG.
// Todo el motor trabaja con tiempo en milisegundos dentro de un latido (tBeat)
// y con un timeline global (t) que recorre la ventana visible del trazado.

/** Una componente gaussiana de la onda EKG (P, Q, R, S o T). */
export interface WaveComponent {
  /** Centro de la gaussiana, en ms relativos al inicio del latido. */
  mu: number;
  /** Amplitud en mV (positiva hacia arriba, negativa hacia abajo). */
  a: number;
  /** Desviación estándar en ms (ancho de la onda). */
  sigma: number;
}

/** Parámetros que definen la forma de un latido. */
export interface BeatParams {
  /** Duración del latido base (intervalo RR) en ms. */
  rr: number;
  /** Componentes gaussianas que suman la morfología (DII). */
  waves: WaveComponent[];
  /** Ancho del QRS en ms — usado para etiquetas/clasificación. */
  qrsWidth: number;
  /** Intervalo PR en ms — usado para etiquetas/clasificación. */
  prInterval: number;
}

/** Identificadores de las estructuras del sistema de conducción. */
export type StructureId =
  | 'sa' // nodo sinusal
  | 'ra' // aurícula derecha
  | 'la' // aurícula izquierda
  | 'av' // nodo AV
  | 'his' // haz de His
  | 'rbb' // rama derecha
  | 'lbb' // rama izquierda
  | 'purkinjeR' // red de Purkinje derecha
  | 'purkinjeL' // red de Purkinje izquierda
  | 'rv' // ventrículo derecho
  | 'lv' // ventrículo izquierdo
  | 'ectopic'; // foco ectópico

/** Color semántico del impulso/estructura según el evento eléctrico. */
export type ImpulseColor = 'yellow' | 'blue' | 'green' | 'orange' | 'red' | 'gray';

/** Segmento del EKG que se está recorriendo. */
export type EkgSegment = 'P' | 'PR' | 'PRseg' | 'QRS' | 'ST' | 'T' | 'RR' | 'baseline';

/**
 * Estado fisiológico derivado de un instante del latido.
 * HeartSchema y EkgTrace consumen esto para pintar exactamente el mismo momento.
 */
export interface PhaseState {
  segment: EkgSegment;
  /** Etiqueta corta para el trazado, p.ej. "Onda P". */
  ekgLabel: string;
  /** Frase clínica breve de interpretación. */
  explanation: string;
  /** Color del impulso en este instante. */
  color: ImpulseColor;
  /** Estructuras que deben iluminarse, con su color e intensidad (0-1). */
  active: Partial<Record<StructureId, { color: ImpulseColor; glow: number }>>;
  /** Posiciones del impulso (x,y en coords SVG). Puede haber 0, 1 o 2 (al dividirse en las ramas). */
  impulse: { x: number; y: number }[];
}

/** Una mini-derivación adicional (V1/V6) para los bloqueos de rama. */
export interface MiniLeadDef {
  name: string;
  beat: BeatParams;
}

/**
 * Definición completa de un modo de aprendizaje.
 * Trabaja en TIEMPO GLOBAL de la ventana visible [0, windowMs): esto permite
 * que cada latido tenga distinta duración/morfología (arritmias, Wenckebach,
 * extrasístoles, disociación AV), no solo repetir un latido idéntico.
 */
export interface ModeDefinition {
  id: string;
  title: string;
  /** Mensaje clave del modo. */
  keyMessage: string;
  /** Duración de la ventana visible; el wrap ocurre en windowMs. */
  windowMs: number;
  /** Amplitud de la onda (mV) en tiempo global. Determinista (permite scrubbing). */
  sampleAt(t: number): number;
  /** Estado fisiológico (corazón + etiqueta) en tiempo global. */
  phaseAt(t: number): PhaseState;
  /** Tiempos globales de interés para la vista "paso a paso". */
  stepStops: number[];
  /** Si el esquema debe mostrar el foco ectópico. */
  showEctopic?: boolean;
  /** Mini-derivaciones adicionales (modos de bloqueo de rama). */
  miniLeads?: MiniLeadDef[];
}

/** Metadata ligera del catálogo (siempre cargada, sin lógica pesada). */
export interface ModeMeta {
  id: string;
  title: string;
  short: string;
  desc: string;
  /** Color de acento de la tarjeta. */
  color: string;
  /** Si el modo ya está implementado o se muestra como "Próximamente". */
  ready: boolean;
}

/** Preferencias persistidas del usuario. */
export interface EkgPrefs {
  speed: number; // 0.25 .. 1.5
  grid: boolean;
  labels: boolean;
  explanation: boolean;
  /** Ampliación vertical del trazado (1 = normal). Aumenta alto del panel y mV/px. */
  ampScale: number; // 1 .. 2
  /** Ampliación horizontal del trazado (1 = normal). Ensancha el latido (scroll). */
  timeScale: number; // 1 .. 2
}
