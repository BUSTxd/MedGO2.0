// Tipos compartidos del simulador del nefrón. Fuente única de verdad para los
// datos de segmentos, transportadores y el motor de consecuencias.

export type SubstanceId =
  | 'agua'
  | 'na'
  | 'k'
  | 'cl'
  | 'hco3'
  | 'h'
  | 'ca'
  | 'mg'
  | 'urea'
  | 'glucosa'
  | 'fosfato'
  | 'aa';

export type Membrane = 'apical' | 'basolateral' | 'paracelular';

/** entra = hacia la célula / reabsorción · sale = hacia el lumen / secreción */
export type Direction = 'entra' | 'sale';

export interface IonMove {
  sustancia: SubstanceId;
  dir: Direction;
  /** estequiometría (p. ej. 2 Cl⁻ en NKCC2). Por defecto 1. */
  n?: number;
}

export type AcidBase = 'acidosis-metabolica' | 'alcalosis-metabolica' | 'sin-cambio';

/** Bloque de consecuencias que alimenta el ConsequencePanel. */
export interface Consequence {
  resumen: string;
  sangre: string;
  orina: string;
  acidoBase: AcidBase;
  potasio?: string;
  otros?: string;
  clinica: string;
}

export type SegmentId =
  | 'glomerulo'
  | 'tcp'
  | 'asa-desc'
  | 'tal'
  | 'tcd'
  | 'conector-cortical'
  | 'medular-interno';

export interface TransporterDef {
  id: string;
  nombre: string;
  sigla: string;
  segmentoId: SegmentId;
  celulaId: string;
  membrana: Membrane;
  usaAtp?: boolean;
  /** Receptor/canal sin transporte iónico directo (no anima iones). */
  receptor?: boolean;
  mueve: IonMove[];
  funcionBreve: string;
  funcionAvanzada: string;
  relevanciaClinica: string;
  asociado?: string;
  consecuenciaDesactivar: Consequence;
}

export interface CellDef {
  id: string;
  nombre: string;
  descripcion: string;
  /** ids de transportadores presentes en esta célula. */
  transportadores: string[];
}

export interface SegmentDef {
  id: SegmentId;
  nombre: string;
  corto: string;
  subsegmentos?: string[];
  zona: 'corteza' | 'medula' | 'glomerulo';
  permeableAgua: 'si' | 'no' | 'adh' | 'parcial';
  /** texto del MODO SIMPLE (principiantes). */
  resumenSimple: string;
  reabsorcion: { sustancia: SubstanceId; detalle: string }[];
  /** texto del zoom de segmento (nivel 1). */
  descripcion: string;
  celulas: CellDef[];
  color: string;
}
