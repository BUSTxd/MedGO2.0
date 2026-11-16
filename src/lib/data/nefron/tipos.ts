// Tipos del lab «Nefrón interactivo» (rehecho de cero el 2026-11-15).
// Los datos viven aquí, en src/lib/data/nefron/, y no importan nada de la
// carpeta del lab: así los scripts (verificar, vista) los cargan con Node.

export type SustanciaId =
  | 'agua' | 'na' | 'k' | 'cl' | 'hco3' | 'h' | 'co2'
  | 'glucosa' | 'aa' | 'fosfato' | 'ca' | 'mg' | 'urea' | 'nh3' | 'nh4'
  | 'aniones' | 'cationes' | 'albumina';

export type SegmentoId =
  | 'glomerulo' | 'proximal' | 'recto' | 'descendente' | 'ascendente-delgada'
  | 'gruesa' | 'distal' | 'conector' | 'colector-cortical' | 'colector-medular';

/** Los nueve tramos del túbulo por donde corre el filtrado, en orden. */
export type TramoId = Exclude<SegmentoId, 'glomerulo'>;

export type CelulaId =
  | 'barrera' | 'proximal-s1' | 'proximal-s3' | 'descendente' | 'ascendente-delgada'
  | 'gruesa' | 'macula-densa' | 'distal' | 'principal' | 'intercalada-a' | 'intercalada-b'
  | 'medular-interna';

export type TransportadorId =
  | 'sglt2' | 'sglt1' | 'nhe3' | 'napi2a' | 'aa-na' | 'aqp1' | 'ac4' | 'ac2'
  | 'nak' | 'nbce1' | 'glut2' | 'oat1' | 'oct2' | 'mate1' | 'mrp4'
  | 'clck1' | 'nkcc2' | 'romk' | 'clckb' | 'kcc4' | 'casr'
  | 'ncc' | 'trpv5' | 'trpm6' | 'ncx1' | 'pmca' | 'pth1r'
  | 'enac' | 'aqp2' | 'aqp3' | 'v2r' | 'mr'
  | 'hatpasa' | 'hkatpasa' | 'ae1' | 'rhcg' | 'pendrina' | 'hatpasa-baso'
  | 'uta1' | 'uta3' | 'npra';

export type HormonaId = 'adh' | 'aldosterona' | 'angiotensina' | 'pth' | 'anp';
export type FarmacoId =
  | 'acetazolamida' | 'manitol' | 'furosemida' | 'tiazida'
  | 'amilorida' | 'espironolactona' | 'gliflozina' | 'tolvaptan';
export type SindromeId =
  | 'fanconi' | 'atr2' | 'atr1' | 'atr4' | 'bartter' | 'gitelman' | 'liddle'
  | 'di-central' | 'di-nefrogenica' | 'siadh' | 'conn' | 'glucosuria-renal';

/** −1 = suprimida, 0 = basal, 1 = alta. */
export type NivelHormona = -1 | 0 | 1;

export type Mecanismo =
  | 'bomba' | 'canal' | 'simportador' | 'antiportador' | 'uniportador' | 'receptor' | 'enzima';

export type Membrana = 'apical' | 'basolateral' | 'interior';

export interface Sustancia {
  id: SustanciaId;
  nombre: string;
  simbolo: string;
  /** Color fijo, el mismo en claro y oscuro (va sobre burbujas con texto blanco). */
  color: string;
  /** Texto oscuro dentro de la burbuja cuando el color es muy claro. */
  textoOscuro?: boolean;
}

/** Lo que mueve un transportador: `adentro` = hacia el citosol. */
export interface Movimiento {
  s: SustanciaId;
  n?: number;
  hacia: 'adentro' | 'afuera';
}

/** Ficha corta: lo que se pregunta, de un vistazo (patrón de la ficha de Willis). */
export interface EsencialTransportador {
  hace: string;
  siFalla: string;
  perla: string;
}

export interface Transportador {
  id: TransportadorId;
  sigla: string;
  nombre: string;
  gen?: string;
  mecanismo: Mecanismo;
  mueve: Movimiento[];
  energia: string;
  resumen: string;
  regulacion?: string;
  /** Fármacos y enfermedades que lo tocan (enlaces de la ficha). */
  farmacos?: FarmacoId[];
  sindromes?: SindromeId[];
  /** Color del contorno del glifo; por defecto, el de lo primero que mueve. */
  color?: string;
  esencial: EsencialTransportador;
}

export interface Reaccion {
  donde: 'luz' | 'citosol';
  texto: string;
  enzima?: string;
}

export interface Paracelular {
  sustancias: SustanciaId[];
  sentido: 'reabsorbe' | 'secreta';
  via: string;
}

export interface Celula {
  id: CelulaId;
  nombre: string;
  corto: string;
  segmento: SegmentoId;
  forma: 'plana' | 'cubica' | 'cilindrica';
  cepillo: 'denso' | 'escaso' | null;
  /** 0 = casi ninguna … 3 = muchísimas (gasto de ATP). */
  mitocondrias: 0 | 1 | 2 | 3;
  /** Pliegues basolaterales con mitocondrias entre ellos. */
  pliegues: boolean;
  apical: TransportadorId[];
  basolateral: TransportadorId[];
  interior: TransportadorId[];
  paracelular?: Paracelular;
  reacciones?: Reaccion[];
  /** Células a los lados en la vista de pared (izquierda, derecha). */
  vecinas: [CelulaId, CelulaId];
  /** Nombre del vaso bajo la célula. */
  vaso: string;
  resumen: string;
  esencial: { funcion: string; siFalla: string; perla: string };
  /** Mensaje de señal (mácula densa): qué hace con lo que detecta. */
  senal?: string;
}

export interface Reabsorcion {
  s: SustanciaId;
  cuanto: string;
  como: string;
}

export interface Segmento {
  id: SegmentoId;
  nombre: string;
  corto: string;
  sigla: string;
  zona: string;
  color: string;
  agua: 'permeable' | 'impermeable' | 'segun ADH';
  resumen: string;
  reabsorbe: Reabsorcion[];
  celulas: CelulaId[];
  /** Orden de las células a lo largo de la pared (se repite). */
  secuencia: CelulaId[];
  esencial: { funcion: string; claves: TransportadorId[]; siFalla: string; perla: string };
  histologia: string;
  clinica: string;
}

/** Cambio sobre el flujo de un transportador; `en` lo limita a ciertas células. */
export interface Efecto {
  t: TransportadorId;
  factor: number;
  en?: CelulaId[];
}

export interface EfectoHormona {
  t: TransportadorId;
  /** Factor con la hormona suprimida, basal y alta. */
  factor: [number, number, number];
  en?: CelulaId[];
}

export interface Hormona {
  id: HormonaId;
  sigla: string;
  nombre: string;
  origen: string;
  estimulo: string;
  receptor: string;
  celulas: CelulaId[];
  efectos: EfectoHormona[];
  resumen: string;
  esencial: { efecto: string; siSobra: string; siFalta: string; perla: string };
  mecanismo: string;
  color: string;
}

export type Tendencia = 'sube' | 'baja' | 'igual';

/** Consecuencias que se leen en la ficha de un fármaco o un síndrome. */
export interface Consecuencias {
  orina: string[];
  sangre: string[];
  potasio: Tendencia;
  acidoBase: 'acidosis' | 'alcalosis' | 'neutro';
  volumen: Tendencia;
}

export interface Farmaco {
  id: FarmacoId;
  nombre: string;
  ejemplos: string;
  clase: string;
  celula: CelulaId;
  dianas: Efecto[];
  /** Deslava el gradiente medular (manitol): 1 = sin efecto. */
  lavado?: number;
  consecuencias: Consecuencias;
  usos: string[];
  adversos: string[];
  resumen: string;
  esencial: { mecanismo: string; efecto: string; perla: string };
}

export interface Sindrome {
  id: SindromeId;
  nombre: string;
  corto: string;
  tipo: 'tubulopatia' | 'hormonal';
  celula: CelulaId;
  dianas: Efecto[];
  /** Niveles de hormona que impone mientras está activo. */
  hormonas?: Partial<Record<HormonaId, NivelHormona>>;
  consecuencias: Consecuencias;
  causas: string[];
  tratamiento: string;
  resumen: string;
  esencial: { defecto: string; signo: string; imita?: string; perla: string };
}
