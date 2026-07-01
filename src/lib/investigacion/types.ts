// ─── Tipos del sistema gamificado de Investigación ───
// Motor compartido por los 14 niveles (temas). El contenido de cada nivel se
// declara como data estática tipada (patrón src/lib/data/*.ts).

/** Bandas de dificultad → color de acento del nivel. */
export type Banda = 'fundamentos' | 'desarrollo' | 'analisis' | 'sintesis';

/** Metadata de un nivel para el mapa (existe para los 14, haya o no contenido). */
export interface NivelMeta {
  /** slug estable, p. ej. 'tema-01' */
  id: string;
  /** número de nivel 1..14 */
  n: number;
  nombre: string;
  banda: Banda;
  /** false = aún sin contenido ("próximamente"), no abre */
  disponible: boolean;
}

// ─── Contenido de un nivel ───

/** Tarjeta "ficha de investigador" dentro de un bloque de contenido. */
export interface TarjetaContenido {
  id: string;
  /** clave de ícono del registro <Icono/> (src/components/investigacion/Icono.tsx) */
  icono: string;
  titulo: string;
  /** definición en 1 oración */
  definicion: string;
  ejemploCotidiano: string;
  ejemploAcademico: string;
  /** ejemplo absurdo/gracioso memorable (opcional) */
  ejemploAbsurdo?: string;
  /** "dato que sorprende" o "error común" */
  datoSorpresa: string;
  /** clave de ilustración decorativa del header (registro <Ilustracion/>). Fallback: icono en caja. */
  ilustracion?: string;
  /** íconos por ejemplo (claves de <Icono/>); si faltan, se usan defaults por sección. */
  iconoCotidiano?: string;
  iconoAcademico?: string;
  iconoAbsurdo?: string;
  iconoDato?: string;
}

/** Bloque de teoría: título + varias tarjetas. */
export interface Bloque {
  id: string;
  titulo: string;
  /** intro corta del bloque */
  resumen?: string;
  tarjetas: TarjetaContenido[];
}

// ─── Minijuegos (unión discriminada por `tipo`) ───

export interface MJDrag {
  tipo: 'drag';
  titulo: string;
  instruccion: string;
  pares: { id: string; termino: string; match: string }[];
}

export interface MJVerdaderoFalso {
  tipo: 'vf';
  titulo: string;
  instruccion: string;
  afirmaciones: {
    id: string;
    texto: string;
    esVerdadera: boolean;
    /** por qué es falsa / dónde está la trampa */
    explicacion: string;
  }[];
}

export interface MJOrden {
  tipo: 'orden';
  titulo: string;
  instruccion: string;
  pasos: { id: string; texto: string }[];
  /** orden correcto por ids */
  ordenCorrecto: string[];
}

export interface MJCaso {
  tipo: 'caso';
  titulo: string;
  escenario: string;
  pregunta: string;
  opciones: { id: string; texto: string; correcta: boolean; feedback: string }[];
}

export interface MJMapa {
  tipo: 'mapa';
  titulo: string;
  instruccion: string;
  /** nodos del diagrama; los huecos se completan desde el banco */
  nodos: { id: string; etiqueta?: string; hueco: boolean }[];
  banco: string[];
  /** id de nodo hueco → palabra correcta */
  solucion: Record<string, string>;
}

export interface MJError {
  tipo: 'error';
  titulo: string;
  instruccion: string;
  /** fragmento partido en segmentos; los marcados como error se deben señalar */
  segmentos: { id: string; texto: string; esError: boolean; explicacion?: string }[];
}

export interface MJQuiz {
  tipo: 'quiz';
  titulo: string;
  pregunta: string;
  opciones: { id: string; texto: string; correcta: boolean; explicacion: string }[];
}

export type MinijuegoConfig =
  | MJDrag
  | MJVerdaderoFalso
  | MJOrden
  | MJCaso
  | MJMapa
  | MJError
  | MJQuiz;

/** Boss = secuencia de decisiones que arma un "informe de investigador". */
export interface BossConfig {
  titulo: string;
  escenario: string;
  decisiones: {
    id: string;
    pregunta: string;
    opciones: { id: string; texto: string; correcta: boolean; feedback: string }[];
  }[];
}

/** Contenido completo de un nivel, en orden de recorrido. */
export interface NivelContenido {
  id: string;
  intro: {
    kicker: string;
    titulo: string;
    gancho: string;
    objetivos: string[];
    /** Tarjetas flotantes sobre el visual decorativo (máx. 3). */
    stats?: { label: string; valor: string; sub?: string; viz?: 'line' | 'dots' | 'curve' }[];
    /** Franja inferior de puntos destacados (ideal 4). `icono` = clave del registro <Icono/>. */
    destacados?: { icono: string; texto: string }[];
  };
  bloque1: Bloque;
  minijuegoA: MinijuegoConfig;
  bloque2: Bloque;
  minijuegoB: MinijuegoConfig;
  bloqueFinal: Bloque;
  boss: BossConfig;
  /** informe final mostrado al completar */
  cierre: { titulo: string; puntosClave: string[] };
}

// ─── Insignias ───

export interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
  /** clave de ícono del registro <Icono/> */
  icono: string;
}

// ─── Estado persistido ───

export interface NivelProgreso {
  completado: boolean;
  desbloqueado: boolean;
  xp: number;
  /** pasos ya completados dentro del nivel (para reanudar) */
  pasosHechos: string[];
}

export interface ProgressState {
  niveles: Record<string, NivelProgreso>;
  totalXP: number;
  insignias: string[];
  version: number;
}

/** Pasos del flujo de un nivel, en orden. */
export type FlowStep =
  | 'intro'
  | 'bloque1'
  | 'minijuegoA'
  | 'bloque2'
  | 'minijuegoB'
  | 'bloqueFinal'
  | 'boss'
  | 'completado';

export const FLOW_ORDER: FlowStep[] = [
  'intro',
  'bloque1',
  'minijuegoA',
  'bloque2',
  'minijuegoB',
  'bloqueFinal',
  'boss',
  'completado',
];
