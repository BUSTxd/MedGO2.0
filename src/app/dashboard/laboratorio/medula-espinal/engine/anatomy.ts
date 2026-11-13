// Datos anatómicos del simulador de médula espinal 3D.
// Láminas de Rexed, tractos de sustancia blanca, meninges, niveles vertebrales
// y síndromes clínicos. El eje Y+ es dorsal; Y- es ventral; X+ lateral derecho.

// ── Types ────────────────────────────────────────────────────────────────────

export type LevelId = 'cervical' | 'toracico' | 'lumbar' | 'sacro';
export type LaminaGroupId = 'I-II' | 'III-IV' | 'V-VI' | 'VII' | 'VIII' | 'IX' | 'X';
export type TractId =
  | 'gracil'
  | 'cuneiforme'
  | 'espinocerebeloso-post'
  | 'espinocerebeloso-ant'
  | 'espinotalamico-lat'
  | 'espinotalamico-ant'
  | 'espinoolivar'
  | 'corticoespinal-lat'
  | 'corticoespinal-ant'
  | 'rubroespinal'
  | 'reticuloespinal'
  | 'vestibuloespinal'
  | 'olivoespinal';

export type SomaLayer = 'C' | 'T' | 'L' | 'S';
/** Capas presentes por nivel: ['*'] = presente sin somatotopía, [] = ausente. */
export type Presence = Array<'*' | SomaLayer>;
export type MeningeId = 'duramadre' | 'aracnoides' | 'piamadre';
export type SyndromeId =
  | 'brown-sequard'
  | 'siringomielia'
  | 'medular-central'
  | 'indemnidad-sacra';

export interface LaminaInfo {
  numeral: string;
  name: string;
  fn: string;
}

export interface LaminaGroup {
  id: LaminaGroupId;
  name: string;
  region: 'posterior' | 'intermedia' | 'anterior' | 'central';
  color: string;
  laminae: LaminaInfo[];
  summary: string;
}

/**
 * Ubicación de un tracto en el corte (lado derecho; se espeja al izquierdo).
 * Medida sobre «Medulla spinalis - tracts» de Polarlys (Commons, CC BY-SA 3.0;
 * solo como referencia, sin copiar sus trazos) con
 * `scripts/medula-espinal/medir-tractos.mjs`, con el ángulo desde dorsal.
 */
export type TractPlacement =
  /**
   * Sector entre a0..a1 (grados) y rIn..rOut medidos en la banda blanca: 0 es
   * el borde (suavizado) de la sustancia gris en ese ángulo y 1 la superficie.
   * Así el sector se pega al asta como en la lámina y se adapta a cada nivel.
   */
  | { kind: 'sector'; a0: number; a1: number; rIn: number; rOut: number; soma?: 'radial' | 'tangential' }
  /**
   * Óvalo a (ang°, rad) con rad en fracción del contorno, y semiejes rx
   * (tangente a la superficie) y ry (radial) en fracciones del semiancho. Si el
   * gris de un nivel llega a ese sitio, se empuja hacia afuera. `mas` añade
   * haces del mismo tracto.
   */
  | { kind: 'blob'; ang: number; rad: number; rx: number; ry: number; mas?: Array<{ ang: number; rad: number; rx: number; ry: number }> }
  /** Óvalo pegado a la fisura media anterior; `pos` va del fondo (0) al labio (1). */
  | { kind: 'fisura'; pos: number; rx: number; ry: number }
  /**
   * Franja del funículo posterior, entre el septo medio (0) y el asta
   * posterior (1). `f1Solo` reemplaza a `f1` en los niveles sin cuneiforme.
   */
  | { kind: 'posterior'; f0: number; f1: number; f1Solo?: number; soma?: 'tangential' };

export interface Tract {
  id: TractId;
  name: string;
  group: string;
  direction: 'ascendente' | 'descendente';
  color: string;
  fn: string;
  somatotopy: string;
  placement: TractPlacement;
  /** Capas presentes por nivel (orden externo→interno o medial→lateral). */
  presence: Record<LevelId, Presence>;
}

export interface MeningealLayer {
  id: MeningeId;
  name: string;
  color: string;
  opacity: number;
  /** Multiplicador del radio exterior de la médula (1.0 = superficie). */
  rMul: number;
  /** Grosor relativo al radio de la médula. */
  thickness: number;
  desc: string;
  /** Lo esencial en una línea, para el panel. */
  corto: string;
}

/** Punto [x, y] en fracciones del semiancho (x lateral derecho, y dorsal). */
export type Pt = [number, number];

/** Riel de un asta: puntos del borde, de la base a la punta. */
export interface Asta {
  /** Borde medial (sin el punto de base, que es la esquina de la comisura). */
  medial: Pt[];
  /** Borde lateral, desde su punto de base. */
  lateral: Pt[];
  /** Abombamiento de la tapa de la punta (× ancho de la punta). */
  tapa: number;
}

/**
 * Forma del corte transversal a un nivel, calcada de Gray's Anatomy fig. 666
 * (dominio público) y medida sobre ella con `scripts/medula-espinal/vista.mjs`.
 * Las coordenadas van en fracciones del semiancho `rx`, con el origen en el
 * centro de la caja del corte; los surcos y la fisura siguen el esquema de
 * Polarlys en Commons («Medulla spinalis - Section»), solo como guía.
 */
export interface CorteForma {
  /** Semiancho en unidades de escena (escala del nivel). */
  rx: number;
  /** Semialto, en fracciones del semiancho. */
  ry: number;
  /** Exponente de superelipse de la mitad dorsal y de la ventral (2 = elipse). */
  nD: number;
  nV: number;
  /** Fisura media anterior: y de su fondo y semiancho. */
  fisura: { fondo: number; ancho: number };
  /** Profundidad del surco medio posterior. */
  surco: number;
  gris: {
    /** Comisura gris (lámina X): semiancho y bordes dorsal y ventral. */
    comisura: { ancho: number; arriba: number; abajo: number };
    dorsal: Asta;
    ventral: Asta;
    /** Borde lateral de la zona intermedia entre las bases de las dos astas (asta lateral incluida). */
    intermedia: Pt[];
    /** Fracciones del asta posterior donde terminan V-VI y III-IV. */
    cortesDorsal: [number, number];
    /** Fracciones del asta anterior donde termina VII (base) y VIII (medial). */
    cortesVentral: [number, number];
  };
}

export interface SpinalLevel {
  id: LevelId;
  name: string;
  segment: string;
  shape: string;
  desc: string;
  corte: CorteForma;
  /** Núcleos del nivel; `rango` (segmentos) si no va entre paréntesis en el nombre. */
  nuclei: Array<{ name: string; desc: string; rango?: [string, string] }>;
  whiteNote: string;
}

export interface ClinicalSyndrome {
  id: SyndromeId;
  name: string;
  cause: string;
  mechanism: string;
  desc: string;
  /** Lado resaltado en el modelo. */
  side: 'left' | 'right' | 'both' | 'center';
  tracts: TractId[];
  laminae: LaminaGroupId[];
}

// ── Láminas de Rexed ─────────────────────────────────────────────────────────

export const LAMINA_GROUPS: Record<LaminaGroupId, LaminaGroup> = {
  'I-II': {
    id: 'I-II', name: 'Láminas I – II', region: 'posterior', color: '#E85B4A',
    summary: 'Vértice del asta posterior. Procesamiento nociceptivo y termoalgésico (fibras Aδ y C).',
    laminae: [
      { numeral: 'I', name: 'Núcleo posteromarginal', fn: 'Neuronas fusiformes de Waldeyer. Recibe dolor/temperatura por fibras Aδ y C. Origen del tracto espinotalámico lateral.' },
      { numeral: 'II', name: 'Sustancia gelatinosa de Rolando', fn: 'Modulación del dolor (compuerta). Células en islote (GABA) y células limitantes filtran señales nociceptivas.' },
    ],
  },
  'III-IV': {
    id: 'III-IV', name: 'Láminas III – IV', region: 'posterior', color: '#F5A623',
    summary: 'Núcleo propio. Tacto discriminativo, presión suave y vibración (mecanorreceptores).',
    laminae: [
      { numeral: 'III', name: 'Núcleo propio (superficial)', fn: 'Neuronas intermedias; recibe mecanorreceptores cutáneos no nociceptivos.' },
      { numeral: 'IV', name: 'Núcleo propio (profundo)', fn: 'Procesamiento de tacto ligero, presión y vibración. Neuronas radiales y en antena.' },
    ],
  },
  'V-VI': {
    id: 'V-VI', name: 'Láminas V – VI', region: 'posterior', color: '#9DC44D',
    summary: 'Base del asta posterior. Integración propioceptiva articular y muscular.',
    laminae: [
      { numeral: 'V', name: 'Base del asta posterior', fn: 'Aferencias mecánicas de articulaciones y músculos; integración multimodal sensorial.' },
      { numeral: 'VI', name: 'Base profunda (intumescencias)', fn: 'Presente en intumescencias; integra señales propioceptivas hacia cerebelo y corteza cerebral.' },
    ],
  },
  'VII': {
    id: 'VII', name: 'Lámina VII', region: 'intermedia', color: '#2DC99A',
    summary: 'Zona intermedia. Columna de Clarke (C8-L2), núcleo IML simpático (T1-L2), parasimpático sacro (S2-S4).',
    laminae: [
      { numeral: 'VII', name: 'Zona intermedia', fn: 'Columna de Clarke: propiocepción inconsciente → espinocerebeloso dorsal. Núcleo IML: neuronas simpáticas preganglionares. Núcleo parasimpático sacro: micción, defecación, erección.' },
    ],
  },
  'VIII': {
    id: 'VIII', name: 'Lámina VIII', region: 'anterior', color: '#3B9EDD',
    summary: 'Zona intermedia ventral. Interneuronas moduladoras del tono muscular y reflejos posturales.',
    laminae: [
      { numeral: 'VIII', name: 'Zona intermedia ventral', fn: 'Recibe aferencias extrapiramidales (vestibuloespinal, reticuloespinal). Modula tono muscular y coordina reflejos posturales bilaterales.' },
    ],
  },
  'IX': {
    id: 'IX', name: 'Lámina IX', region: 'anterior', color: '#5469D4',
    summary: 'Núcleos motores: motoneuronas α (contracción voluntaria) y γ (huso neuromuscular).',
    laminae: [
      { numeral: 'IX', name: 'Núcleos motores', fn: 'Motoneuronas α y γ. Somatotopía: flexores dorsales, extensores ventrales; axiales mediales, distales laterales. En intumescencias: grandes columnas para extremidades.' },
    ],
  },
  'X': {
    id: 'X', name: 'Lámina X', region: 'central', color: '#9b7bdf',
    summary: 'Comisura gris periependimaria. Rodea el canal central; axones que cruzan entre ambos lados.',
    laminae: [
      { numeral: 'X', name: 'Comisura gris central', fn: 'Axones amielínicos comisurales que cruzan la línea media; integración bilateral de reflejos. Rodea el canal central (epéndimo).' },
    ],
  },
};

export const LAMINA_GROUP_LIST: LaminaGroup[] = [
  LAMINA_GROUPS['I-II'],
  LAMINA_GROUPS['III-IV'],
  LAMINA_GROUPS['V-VI'],
  LAMINA_GROUPS['VII'],
  LAMINA_GROUPS['VIII'],
  LAMINA_GROUPS['IX'],
  LAMINA_GROUPS['X'],
];

// ── Tractos de sustancia blanca ──────────────────────────────────────────────
// Cada tracto tiene una ubicación (sector o blob) en el hemicordón derecho (se
// espeja) y una tabla de presencia por nivel: las capas somatotópicas se listan
// de externo→interno (sectores radiales) o medial→lateral (columnas dorsales);
// ['*'] = presente sin somatotopía; [] = ausente.

export const TRACTS: Record<TractId, Tract> = {
  // ── Cordón posterior · DCML ──
  gracil: {
    id: 'gracil', name: 'Fascículo grácil', group: 'Cordón posterior · DCML', direction: 'ascendente',
    color: '#2E86DE',
    fn: 'Propiocepción consciente, vibración y tacto discriminativo de MMII y tronco bajo (T7-S5). Asciende ipsilateral hasta el núcleo grácil del bulbo.',
    somatotopy: 'Medial→lateral: sacro, lumbar, torácico inferior.',
    placement: { kind: 'posterior', f0: 0, f1: 0.44, f1Solo: 0.95, soma: 'tangential' },
    presence: { cervical: ['S', 'L', 'T'], toracico: ['S', 'L', 'T'], lumbar: ['S', 'L'], sacro: ['S'] },
  },
  cuneiforme: {
    id: 'cuneiforme', name: 'Fascículo cuneiforme', group: 'Cordón posterior · DCML', direction: 'ascendente',
    color: '#54A0E0',
    fn: 'Propiocepción consciente, vibración y tacto discriminativo de MMSS y tronco alto (C1-T6). Asciende ipsilateral al núcleo cuneiforme.',
    somatotopy: 'Componente cervical y torácico superior. Sólo C1–T6.',
    placement: { kind: 'posterior', f0: 0.48, f1: 0.95 },
    presence: { cervical: ['C'], toracico: ['C'], lumbar: [], sacro: [] },
  },
  // ── Sistema anterolateral ──
  'espinotalamico-lat': {
    id: 'espinotalamico-lat', name: 'Espinotalámico lateral', group: 'Sistema anterolateral', direction: 'ascendente',
    color: '#3b9edd',
    fn: 'Dolor y temperatura (termoalgesia). Decusan por la comisura blanca anterior y ascienden contralaterales.',
    somatotopy: 'Profundo→superficial: cervical, torácico, lumbar, sacro.',
    placement: { kind: 'sector', a0: 105, a1: 132, rIn: 0.0, rOut: 0.52, soma: 'radial' },
    presence: { cervical: ['S', 'L', 'T', 'C'], toracico: ['S', 'L', 'T'], lumbar: ['S', 'L'], sacro: ['S'] },
  },
  'espinotalamico-ant': {
    id: 'espinotalamico-ant', name: 'Espinotalámico anterior', group: 'Sistema anterolateral', direction: 'ascendente',
    color: '#5DADE2',
    fn: 'Tacto protopático (grueso) y presión. Decusa y asciende contralateral en el cordón anterior.',
    somatotopy: 'Núcleo del borde anteroexterno del cordón anterior.',
    placement: { kind: 'blob', ang: 151, rad: 0.74, rx: 0.08, ry: 0.05 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: ['*'], sacro: ['*'] },
  },
  // ── Vías espinocerebelosas ──
  'espinocerebeloso-post': {
    id: 'espinocerebeloso-post', name: 'Espinocerebeloso posterior', group: 'Vías espinocerebelosas', direction: 'ascendente',
    color: '#2E9BB5',
    fn: 'Propiocepción inconsciente del tronco y MI. Sinapsis en la columna de Clarke (C8–L2); asciende ipsilateral.',
    somatotopy: 'Banda periférica del cuadrante posterolateral.',
    placement: { kind: 'sector', a0: 53, a1: 91, rIn: 0.64, rOut: 0.95 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: [], sacro: [] },
  },
  'espinocerebeloso-ant': {
    id: 'espinocerebeloso-ant', name: 'Espinocerebeloso anterior', group: 'Vías espinocerebelosas', direction: 'ascendente',
    color: '#48C0D8',
    fn: 'Propiocepción inconsciente del MI. Doble decusación; corre por la periferia del cordón lateral (ecuador).',
    somatotopy: 'Banda periférica del ecuador lateral, bajo el posterior.',
    placement: { kind: 'sector', a0: 103, a1: 130, rIn: 0.60, rOut: 0.95 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: ['*'], sacro: [] },
  },
  // ── Vías espinoolivares ──
  espinoolivar: {
    id: 'espinoolivar', name: 'Fibras espinoolivares', group: 'Vías espinoolivares', direction: 'ascendente',
    color: '#6FB8D8',
    fn: 'Información cutánea y propioceptiva hacia el complejo olivar inferior. Núcleo del cordón anterior, medial al espinotalámico anterior.',
    somatotopy: 'Pequeño núcleo basal del cordón anterior.',
    placement: { kind: 'blob', ang: 134, rad: 0.90, rx: 0.05, ry: 0.045 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: [], sacro: [] },
  },
  // ── Vías piramidales ──
  'corticoespinal-lat': {
    id: 'corticoespinal-lat', name: 'Corticoespinal lateral', group: 'Vías piramidales', direction: 'descendente',
    color: '#E0322E',
    fn: 'Control motor voluntario fino de extremidades distales. Cruzado en la decusación piramidal; desciende contralateral.',
    somatotopy: 'Superficial→profundo: sacro, lumbar, torácico, cervical.',
    placement: { kind: 'sector', a0: 59, a1: 92, rIn: 0.05, rOut: 0.58, soma: 'radial' },
    presence: { cervical: ['S', 'L', 'T', 'C'], toracico: ['S', 'L', 'T'], lumbar: ['S', 'L'], sacro: ['S'] },
  },
  'corticoespinal-ant': {
    id: 'corticoespinal-ant', name: 'Corticoespinal anterior', group: 'Vías piramidales', direction: 'descendente',
    color: '#F0664F',
    fn: 'Control de la musculatura axial y proximal del tronco. Desciende ipsilateral junto a la fisura media; decusa antes de sinaptar. Termina en niveles torácicos/lumbares altos.',
    somatotopy: 'Óvalo vertical adyacente a la fisura media anterior.',
    placement: { kind: 'fisura', pos: 0.64, rx: 0.044, ry: 0.165 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: ['*'], sacro: [] },
  },
  // ── Vías extrapiramidales ──
  rubroespinal: {
    id: 'rubroespinal', name: 'Rubroespinal', group: 'Vías extrapiramidales', direction: 'descendente',
    color: '#C0392B',
    fn: 'Facilita el tono flexor de las extremidades. Cruzado desde el núcleo rojo; profundo, por delante del corticoespinal lateral. Se reduce al descender.',
    somatotopy: 'Núcleo profundo, anterior al corticoespinal lateral.',
    placement: { kind: 'blob', ang: 97, rad: 0.80, rx: 0.05, ry: 0.09 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: [], sacro: [] },
  },
  reticuloespinal: {
    id: 'reticuloespinal', name: 'Reticuloespinal', group: 'Vías extrapiramidales', direction: 'descendente',
    color: '#D9534F',
    fn: 'Modula el tono muscular, los reflejos posturales y la marcha automática. Profundo, pegado a la base del asta anterior.',
    somatotopy: 'Núcleo profundo anterolateral, base del asta anterior.',
    placement: { kind: 'blob', ang: 99, rad: 0.50, rx: 0.06, ry: 0.10, mas: [{ ang: 159, rad: 0.46, rx: 0.05, ry: 0.05 }] },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: ['*'], sacro: ['*'] },
  },
  vestibuloespinal: {
    id: 'vestibuloespinal', name: 'Vestibuloespinal', group: 'Vías extrapiramidales', direction: 'descendente',
    color: '#E8746A',
    fn: 'Equilibrio y facilitación del tono extensor postural. Desciende ipsilateral; por delante y fuera del reticuloespinal.',
    somatotopy: 'Núcleo anterolateral intermedio del cordón anterior.',
    placement: { kind: 'blob', ang: 163, rad: 0.91, rx: 0.09, ry: 0.04 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: ['*'], sacro: [] },
  },
  olivoespinal: {
    id: 'olivoespinal', name: 'Olivoespinal', group: 'Vías extrapiramidales', direction: 'descendente',
    color: '#F1948A',
    fn: 'Influencia de la oliva sobre la actividad motora segmentaria. Óvalo superficial del borde anterolateral. Desaparece bajo el nivel torácico.',
    somatotopy: 'Núcleo periférico anterolateral superficial.',
    placement: { kind: 'blob', ang: 140, rad: 0.90, rx: 0.065, ry: 0.042 },
    presence: { cervical: ['*'], toracico: ['*'], lumbar: [], sacro: [] },
  },
};

export const TRACT_LIST: Tract[] = [
  TRACTS['gracil'],
  TRACTS['cuneiforme'],
  TRACTS['espinotalamico-lat'],
  TRACTS['espinotalamico-ant'],
  TRACTS['espinocerebeloso-post'],
  TRACTS['espinocerebeloso-ant'],
  TRACTS['espinoolivar'],
  TRACTS['corticoespinal-lat'],
  TRACTS['corticoespinal-ant'],
  TRACTS['rubroespinal'],
  TRACTS['reticuloespinal'],
  TRACTS['vestibuloespinal'],
  TRACTS['olivoespinal'],
];

/** Capas presentes de un tracto a un nivel (vacío = ausente). */
export function tractLayersAt(id: TractId, level: LevelId): Presence {
  return TRACTS[id].presence[level] ?? [];
}
export function tractPresentAt(id: TractId, level: LevelId): boolean {
  return tractLayersAt(id, level).length > 0;
}
/** Orden de grupos para el panel. */
export const TRACT_GROUPS: string[] = [
  'Cordón posterior · DCML',
  'Sistema anterolateral',
  'Vías espinocerebelosas',
  'Vías espinoolivares',
  'Vías piramidales',
  'Vías extrapiramidales',
];

// ── Meninges ─────────────────────────────────────────────────────────────────

export const MENINGES: Record<MeningeId, MeningealLayer> = {
  piamadre: {
    id: 'piamadre', name: 'Piamadre', color: '#E88B8B', opacity: 0.5,
    rMul: 1.02, thickness: 0.03,
    desc: 'Membrana vascular interna, adherida directamente a la superficie de la médula. Emite los ligamentos dentados hacia la duramadre.',
    corto: 'Pegada a la médula; forma los ligamentos dentados.',
  },
  aracnoides: {
    id: 'aracnoides', name: 'Aracnoides', color: '#B0C4DE', opacity: 0.25,
    rMul: 1.18, thickness: 0.03,
    desc: 'Membrana avascular intermedia. Bajo ella se abre el espacio subaracnoideo lleno de LCR (suspensión hidráulica).',
    corto: 'Avascular; debajo, el LCR del espacio subaracnoideo.',
  },
  duramadre: {
    id: 'duramadre', name: 'Duramadre', color: '#5C6C80', opacity: 0.35,
    rMul: 1.30, thickness: 0.06,
    desc: 'Saco fibroso externo resistente. Se extiende del foramen magno a S2. Coraza mecánica del cordón espinal.',
    corto: 'Saco fibroso del foramen magno a S2.',
  },
};

export const MENINGE_LIST: MeningealLayer[] = [
  MENINGES['piamadre'],
  MENINGES['aracnoides'],
  MENINGES['duramadre'],
];

// ── Niveles vertebrales ──────────────────────────────────────────────────────

export const LEVELS: Record<LevelId, SpinalLevel> = {
  cervical: {
    id: 'cervical', name: 'Cervical', segment: 'C5', shape: 'Ovalada',
    desc: 'Mayor cantidad de sustancia blanca. Astas anteriores anchas para la inervación del miembro superior (intumescencia cervical C3-C8).',
    corte: {
      rx: 1.5, ry: 0.742, nD: 2.0, nV: 2.5,
      fisura: { fondo: -0.31, ancho: 0.022 }, surco: 0.03,
      gris: {
        comisura: { ancho: 0.10, arriba: -0.15, abajo: -0.27 },
        dorsal: { medial: [[0.16, 0.05], [0.25, 0.33], [0.35, 0.58]], lateral: [[0.25, -0.10], [0.27, 0.08], [0.34, 0.33], [0.42, 0.56]], tapa: 0.6 },
        ventral: { medial: [[0.12, -0.37], [0.17, -0.45], [0.25, -0.50]], lateral: [[0.45, -0.17], [0.59, -0.22], [0.63, -0.32], [0.55, -0.45]], tapa: 0.45 },
        intermedia: [[0.34, -0.09], [0.43, -0.12]],
        cortesDorsal: [0.3, 0.68], cortesVentral: [0.15, 0.85],
      },
    },
    nuclei: [
      { name: 'N. accesorio espinal (C1-C5)', desc: 'Fibras motoras para el NC XI → trapecio y esternocleidomastoideo.' },
      { name: 'N. frénico (C3-C5)', desc: 'Estimulación rítmica del diafragma; mantiene la ventilación pulmonar.' },
    ],
    whiteNote: 'Cordón posterior dividido: fascículo grácil (medial) + cuneiforme (lateral).',
  },
  toracico: {
    id: 'toracico', name: 'Torácico', segment: 'T5', shape: 'Circular pequeña',
    desc: 'Sección circular y pequeña. Sustancia gris reducida con asta lateral visible (sistema simpático).',
    corte: {
      rx: 0.95, ry: 0.91, nD: 2.0, nV: 2.6,
      fisura: { fondo: -0.50, ancho: 0.03 }, surco: 0.04,
      gris: {
        comisura: { ancho: 0.09, arriba: -0.24, abajo: -0.38 },
        dorsal: { medial: [[0.12, -0.06], [0.22, 0.30], [0.33, 0.62]], lateral: [[0.20, -0.22], [0.24, -0.03], [0.30, 0.30], [0.40, 0.60]], tapa: 0.5 },
        ventral: { medial: [[0.09, -0.50], [0.11, -0.66]], lateral: [[0.23, -0.38], [0.29, -0.50], [0.28, -0.65]], tapa: 0.5 },
        intermedia: [[0.26, -0.23], [0.31, -0.26], [0.25, -0.32]],
        cortesDorsal: [0.3, 0.68], cortesVentral: [0.15, 0.6],
      },
    },
    nuclei: [
      { name: 'Columna de Clarke (C8-L2)', desc: 'Propiocepción inconsciente → tracto espinocerebeloso dorsal ipsilateral.' },
      { name: 'N. intermediolateral (T1-L2)', desc: 'Asta lateral; neuronas simpáticas preganglionares → ramos comunicantes blancos.' },
    ],
    whiteNote: 'Fascículo cuneiforme solo visible por encima de T6. Por debajo, solo fascículo grácil.',
  },
  lumbar: {
    id: 'lumbar', name: 'Lumbar', segment: 'L4', shape: 'Circular robusta',
    desc: 'Gran volumen de sustancia gris (intumescencia lumbar). Astas anteriores muy anchas para la musculatura del MI.',
    corte: {
      rx: 1.1, ry: 0.95, nD: 2.1, nV: 2.5,
      fisura: { fondo: -0.14, ancho: 0.04 }, surco: 0.04,
      gris: {
        comisura: { ancho: 0.10, arriba: 0.0, abajo: -0.11 },
        dorsal: { medial: [[0.15, 0.15], [0.23, 0.40], [0.36, 0.64]], lateral: [[0.30, 0.02], [0.39, 0.20], [0.46, 0.45], [0.50, 0.66]], tapa: 0.6 },
        ventral: { medial: [[0.09, -0.25], [0.12, -0.45], [0.20, -0.62]], lateral: [[0.50, -0.12], [0.59, -0.30], [0.54, -0.50], [0.42, -0.63]], tapa: 0.5 },
        intermedia: [[0.40, -0.02], [0.46, -0.08]],
        cortesDorsal: [0.3, 0.68], cortesVentral: [0.15, 0.8],
      },
    },
    nuclei: [
      { name: 'N. propio (láminas III-IV)', desc: 'Muy desarrollado; recibe tacto discriminativo de dermatomas del MI.', rango: ['C1', 'S5'] },
      { name: 'N. lumbosacro (L2-S1)', desc: 'Columna nuclear motora → plexo lumbosacro para cadera, muslo y pierna.' },
    ],
    whiteNote: 'Solo fascículo grácil en el cordón posterior. Sin espinocerebeloso posterior (ausencia de Clarke).',
  },
  sacro: {
    id: 'sacro', name: 'Sacro', segment: 'S3', shape: 'Cuadrangular',
    desc: 'Menor diámetro de toda la médula. Sustancia gris domina la sección; sustancia blanca reducida a un delgado anillo.',
    corte: {
      rx: 0.9, ry: 0.922, nD: 2.7, nV: 2.9,
      fisura: { fondo: -0.42, ancho: 0.025 }, surco: 0.03,
      gris: {
        comisura: { ancho: 0.08, arriba: 0.02, abajo: -0.08 },
        dorsal: { medial: [[0.10, 0.20], [0.18, 0.42], [0.28, 0.62]], lateral: [[0.45, 0.0], [0.55, 0.20], [0.58, 0.45], [0.50, 0.66]], tapa: 0.7 },
        ventral: { medial: [[0.07, -0.20], [0.10, -0.45], [0.18, -0.62]], lateral: [[0.66, -0.10], [0.68, -0.30], [0.60, -0.52], [0.42, -0.62]], tapa: 0.5 },
        intermedia: [[0.60, -0.05]],
        cortesDorsal: [0.3, 0.68], cortesVentral: [0.15, 0.8],
      },
    },
    nuclei: [
      { name: 'N. de Onuf (S2-S4)', desc: 'Motoneuronas somáticas para esfínteres anal externo, uretral estriado, isquiocavernoso y bulbocavernoso.' },
      { name: 'N. parasimpático sacro (S2-S4)', desc: 'Reflejos parasimpáticos pélvicos: contracción del detrusor (micción) y evacuación rectal.' },
    ],
    whiteNote: 'Sustancia blanca en delgada banda periférica; solo un vestigio medial del fascículo grácil.',
  },
};

/**
 * Segmentos que ocupa un núcleo: su `rango`, o el que lleva entre paréntesis
 * en el nombre («Columna de Clarke (C8-L2)» → ['C8', 'L2']).
 */
export function rangoNucleo(n: { name: string; rango?: [string, string] }): [string, string] | null {
  if (n.rango) return n.rango;
  const m = n.name.match(/\(((?:[CTLS]\d+)|Co)-((?:[CTLS]\d+)|Co)\)/);
  return m ? [m[1], m[2]] : null;
}

export const LEVEL_LIST: SpinalLevel[] = [
  LEVELS['cervical'],
  LEVELS['toracico'],
  LEVELS['lumbar'],
  LEVELS['sacro'],
];

// ── Síndromes clínicos ───────────────────────────────────────────────────────

export const SYNDROMES: Record<SyndromeId, ClinicalSyndrome> = {
  'brown-sequard': {
    id: 'brown-sequard', name: 'Brown-Séquard (hemisección)',
    cause: 'Hemisección medular traumática o tumoral.',
    mechanism: 'Daño unilateral interrumpe vías ipsilaterales (motora y columnas posteriores) y contralaterales (espinotalámico lateral, que ya cruzó).',
    desc: 'Parálisis motora y pérdida propioceptiva ipsilateral; pérdida termoalgésica contralateral (2 niveles abajo).',
    side: 'right',
    tracts: ['corticoespinal-lat', 'gracil', 'cuneiforme', 'espinotalamico-lat'],
    laminae: ['IX', 'I-II'],
  },
  siringomielia: {
    id: 'siringomielia', name: 'Siringomielia',
    cause: 'Cavidad quística (siringe) en la comisura gris central.',
    mechanism: 'Expansión de la siringe comprime los axones del espinotalámico lateral al cruzar por la comisura blanca anterior.',
    desc: 'Pérdida BILATERAL de dolor y temperatura con preservación del tacto y propiocepción (disociación sensorial suspendida en "capa").',
    side: 'center',
    tracts: ['espinotalamico-lat'],
    laminae: ['X', 'I-II'],
  },
  'medular-central': {
    id: 'medular-central', name: 'Síndrome medular central',
    cause: 'Hiperextensión cervical (latigazo) en artrosis cervical.',
    mechanism: 'Compresión central daña fibras mediales del corticoespinal lateral (cervicales=brazos) y del espinotalámico; fibras laterales (sacras=piernas) se preservan.',
    desc: 'Parálisis y pérdida sensorial severa en MMSS con MMII relativamente preservados.',
    side: 'center',
    tracts: ['corticoespinal-lat', 'espinotalamico-lat'],
    laminae: ['IX', 'X'],
  },
  'indemnidad-sacra': {
    id: 'indemnidad-sacra', name: 'Indemnidad sacra (sacral sparing)',
    cause: 'Tumor intrínseco (ependimoma) en expansión central.',
    mechanism: 'Crecimiento centro→periferia daña primero fibras cervicales (mediales); las fibras sacras (laterales/superficiales) son las últimas afectadas.',
    desc: 'Pérdida sensoriomotora torácica y de MMSS con PRESERVACIÓN de la sensibilidad perineal (S2-S4) y el tono del esfínter anal.',
    side: 'both',
    tracts: ['corticoespinal-lat', 'espinotalamico-lat'],
    laminae: ['IX'],
  },
};

export const SYNDROME_LIST: ClinicalSyndrome[] = [
  SYNDROMES['brown-sequard'],
  SYNDROMES['siringomielia'],
  SYNDROMES['medular-central'],
  SYNDROMES['indemnidad-sacra'],
];

// ── Médula completa (vista longitudinal) ─────────────────────────────────────
// Modelo didáctico del cordón entero. El eje Y es vertical: Y+ craneal (foramen
// magno), Y- caudal (cono medular y filum terminale). El radio varía a lo largo
// del eje para reproducir las dos intumescencias y el adelgazamiento del cono.

export interface CordRegion {
  id: LevelId;
  label: string;
  /** Etiqueta de intumescencia/estructura, si aplica. */
  feature?: string;
  /** Rango de segmentos medulares. */
  segments: string;
  /** Tramo del eje Y (Hi craneal, Lo caudal) que ocupa la región. */
  yHi: number;
  yLo: number;
  color: string;
}

/** Puntos de control [y, radio] del perfil del cordón, de craneal a caudal. */
export const CORD_PROFILE: Array<[number, number]> = [
  [5.0, 0.46],   // foramen magno (C1)
  [4.1, 0.78],   // intumescencia cervical (C5-C6)
  [3.0, 0.52],   // C8-T1
  [1.6, 0.44],   // torácico alto
  [-0.6, 0.43],  // torácico bajo (cordón delgado y uniforme)
  [-1.6, 0.62],  // inicio intumescencia lumbosacra
  [-2.4, 0.76],  // pico intumescencia lumbosacra
  [-3.1, 0.55],  // S1-S2
  [-3.7, 0.40],  // inicio del cono medular
  [-4.6, 0.02],  // vértice del cono medular (L1-L2)
];

/** Radio del cordón a una altura Y dada (interpolación suavizada). */
export function cordRadiusAt(y: number): number {
  const pts = CORD_PROFILE;
  if (y >= pts[0][0]) return pts[0][1];
  if (y <= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [y0, r0] = pts[i];
    const [y1, r1] = pts[i + 1];
    if (y <= y0 && y >= y1) {
      const t = (y0 - y) / (y0 - y1);
      const ts = t * t * (3 - 2 * t); // smoothstep
      return r0 + (r1 - r0) * ts;
    }
  }
  return pts[pts.length - 1][1];
}

export const CORD_TOP = 5.0;
export const CONUS_TIP = -4.6;       // vértice del cono medular

export const REGIONS: CordRegion[] = [
  { id: 'cervical', label: 'Cervical',  feature: 'Intumescencia cervical (C4–T1)', segments: 'C1–C8', yHi: 5.0, yLo: 3.0, color: '#3b9edd' },
  { id: 'toracico', label: 'Torácico',  segments: 'T1–T12', yHi: 3.0, yLo: -1.6, color: '#2DC99A' },
  { id: 'lumbar',   label: 'Lumbar',    feature: 'Intumescencia lumbosacra (L2–S3)', segments: 'L1–L5', yHi: -1.6, yLo: -3.4, color: '#F5A623' },
  { id: 'sacro',    label: 'Sacro / cono', feature: 'Cono medular (L1–L2 vertebral)', segments: 'S1–S5 + Co', yHi: -3.4, yLo: -4.6, color: '#E85B4A' },
];
