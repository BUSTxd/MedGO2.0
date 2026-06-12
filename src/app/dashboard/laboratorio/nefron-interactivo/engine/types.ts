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
  | 'aa'
  | 'aniorg'
  | 'catorg';

export type Membrane = 'apical' | 'basolateral' | 'paracelular';

/** entra = hacia la célula / reabsorción · sale = hacia el lumen / secreción */
export type Direction = 'entra' | 'sale';

/** Mecanismo de transporte (define la FORMA del glifo en la vista de célula). */
export type Mechanism = 'bomba' | 'canal' | 'simporte' | 'antiporte' | 'facilitado' | 'receptor';

/** Dirección de pH en un compartimento (luz o sangre). */
export type PhDir = 'acido' | 'neutro' | 'basico';

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
  | 'asa-asc-delgada'
  | 'tal'
  | 'tcd'
  | 'conector-cortical'
  | 'medular-interno'
  | 'yuxtaglomerular'
  | 'vasa-recta';

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
  /** Mecanismo explícito (forma del glifo). Si falta, se DERIVA en sceneLayout. */
  mecanismo?: Mechanism;
  mueve: IonMove[];
  funcionBreve: string;
  funcionAvanzada: string;
  relevanciaClinica: string;
  asociado?: string;
  consecuenciaDesactivar: Consequence;
}

/** Reacción/etiqueta intracelular mostrada dentro del citoplasma de la célula. */
export interface CellReaction {
  /** Texto de la reacción, p. ej. "CO₂ + H₂O → H⁺ + HCO₃⁻". */
  texto: string;
  /** Enzima que la cataliza, p. ej. "anhidrasa carbónica II". */
  enzima?: string;
}

export interface CellDef {
  id: string;
  nombre: string;
  descripcion: string;
  /** Morfología del epitelio (para dibujar la pared de la vista de célula). */
  morfologia?: 'cuboidal' | 'cilindrica' | 'plana';
  /** Borde en cepillo apical (microvellosidades), p. ej. TCP. */
  bordeCepillo?: boolean;
  /** ids de transportadores presentes en esta célula. */
  transportadores: string[];
  /** Reacciones/enzimas a dibujar dentro del citoplasma (opcional). */
  intracelular?: CellReaction[];
  /** Reacciones a dibujar en la LUZ tubular (p. ej. anhidrasa carbónica luminal). */
  luminal?: CellReaction[];
}

// ─────────────── PERTURBACIONES (Fase 2): fármacos y enfermedades ───────────────

/** Tipo de perturbación activa. En el MVP solo una a la vez (exclusiva). */
export type PerturbationKind = 'transportador' | 'farmaco' | 'enfermedad';

export interface Perturbation {
  kind: PerturbationKind;
  id: string;
}

/** Cómo nace el efecto sobre los transportadores diana (define el tag visual). */
export type AffectKind = 'bloqueo' | 'inhibicion' | 'perdida' | 'ganancia' | 'osmotico';

export interface DrugDef {
  id: string;
  nombre: string;
  /** Clase farmacológica corta, p. ej. "Diurético de asa". */
  clase: string;
  segmentoId: SegmentId;
  /** ids de transportadores diana (se resaltan en la vista celular). */
  objetivos: string[];
  efecto: AffectKind;
  mecanismo: string;
  consecuencia: Consequence;
  indicaciones?: string;
  /** Reacciones adversas / efectos no deseados. */
  ram?: string;
}

export interface DiseaseDef {
  id: string;
  nombre: string;
  /** Grupo nosológico corto, p. ej. "Tubulopatía pierde-sal". */
  grupo: string;
  segmentoId: SegmentId;
  objetivos: string[];
  efecto: AffectKind;
  /** Gen / proteína implicada. */
  proteina: string;
  herencia?: string;
  consecuencia: Consequence;
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
