// Contrato de datos del laboratorio «Hipersensibilidad». Guion completo:
// docs/hipersensibilidad/GUION.md.
//
// Mismo modelo que «Maduración de linfocitos»: cada capítulo es una lista de
// pasos con acciones en el tiempo y el motor (`src/lib/hipersensibilidad/motor.ts`)
// evalúa la escena como función pura del tiempo. Lo propio de este laboratorio
// es la FISIOLOGÍA: el fondo es un tejido vivo (mucosa, vénula, glomérulo,
// placa motora, piel…) cuyos parámetros se animan (`tejido`: la vénula se
// dilata, sale plasma, el músculo liso se contrae), y las células desgranulan,
// secretan chorros de mediadores, fagocitan y se lisan.

import type { Dibujo as DibujoLinfocitos } from '../linfocitos/tipos';

export type Pos = { col: number; row: number };

export type ParteId = 'sensibilizacion' | 'fase-inmediata' | 'fase-tardia' | 'anafilaxia' | 'tipo-2' | 'tipo-3' | 'tipo-4' | 'integracion';

/** Tejido dibujado de fondo; un paso puede cambiarlo con la acción `fondo`. */
export type Fondo = 'blanco' | 'mucosa' | 'cuerpo' | 'sangre' | 'glomerulo' | 'placa' | 'vaso' | 'piel' | 'granuloma';

/** Parámetros del tejido que se animan (0 = reposo, 1 = máximo). Cada fondo lee los suyos. */
export type ParamTejido =
  // mucosa respiratoria
  | 'ganglio' | 'dano' | 'vasodilatacion' | 'fuga' | 'edema' | 'espasmo' | 'moco' | 'prurito' | 'activacion' | 'infiltrado'
  // cuerpo (anafilaxia)
  | 'piel' | 'laringe' | 'bronquio' | 'intestino' | 'vasos' | 'presion' | 'adrenalina'
  // sangre
  | 'placenta' | 'hemolisis'
  // glomérulo
  | 'lineal' | 'granular' | 'proteinuria' | 'hematuria' | 'hemorragia' | 'complemento'
  // placa motora y tiroides
  | 'ach' | 'bloqueo' | 'internalizacion' | 'contraccion' | 'antiTshr' | 'hormona'
  // vaso (complejos)
  | 'deposito' | 'necrosis' | 'trombo' | 'vasculitis'
  // piel
  | 'eritema' | 'induracion' | 'manguito' | 'vesicula' | 'acantolisis'
  // granuloma
  | 'macrofagos' | 'epitelioides' | 'gigantes' | 'corona' | 'fibrosis' | 'caseosis';

export type DibujoPropio = 'eosinofilo' | 'basofilo' | 'ilc2' | 'plaqueta' | 'gigante' | 'epitelioide' | 'linfocito';
export type Dibujo = DibujoPropio | DibujoLinfocitos;

export type Forma =
  /** Ilustración recortada (`img`) con nombre debajo; si falta, `dibujo`. */
  | 'celula'
  /** Célula dibujada con código (`dibujo`). */
  | 'dibujo'
  /** Proteína compleja: un círculo con su nombre (C1q, Syk…). */
  | 'proteina'
  /** Molécula pequeña (antígeno soluble, C5a, hapteno). */
  | 'molecula'
  /** Anticuerpo (`ab`: IgE, IgG o IgM) dibujado en Y; se orienta solo al unirse. */
  | 'anticuerpo'
  /** Inmunocomplejo antígeno-anticuerpo (`n`: cuántos anticuerpos). */
  | 'complejo'
  /** Punto invisible del tejido (el epitelio, la vénula) del que salen chorros. */
  | 'ancla';

export type Isotipo = 'IgE' | 'IgG' | 'IgM';

export type ActorDecl = {
  forma: Forma;
  label: string;
  sub?: string;
  img?: string;
  dibujo?: Dibujo;
  color?: string;
  /** Diámetro (u). Por defecto, el de su forma. */
  d?: number;
  /** id en `fichas.ts` si difiere de la clave. */
  info?: string;
  ab?: Isotipo;
  n?: number;
};

export type TipoMarcador = 'fceri' | 'fcgr' | 'cr' | 'tcr' | 'mhc1' | 'mhc2' | 'cd' | 'receptor' | 'cd40l';

export type Marcador = { id: string; tipo: TipoMarcador; label?: string; color?: string; /** Grados (0 = derecha, −90 = arriba). */ ang: number };

/** Chorro de partículas de un mediador (`secretar`, `degranular`). */
export type Particula =
  | 'histamina' | 'lipido' | 'citocina' | 'quimiocina' | 'alarmina' | 'il4' | 'il5' | 'il13' | 'ifn' | 'il17'
  | 'ige' | 'igg' | 'complemento' | 'ros' | 'enzima' | 'mbp' | 'ach' | 'hormona' | 'perforina' | 'plasma' | 'hemoglobina';

/** Datos de cada proceso de la lupa. */
export type DatosProceso =
  // Reutilizados del laboratorio de linfocitos
  | { clase: 'csr'; hacia: 'IgG' | 'IgA' | 'IgE'; citocina: string }
  | { clase: 'factores'; titulo: string; factores: { nombre: string; color: string }[] }
  // Propios
  | { clase: 'lista'; titulo: string; sub?: string; items: { nombre: string; color: string; detalle: string }[] }
  | { clase: 'fceri' }
  | { clase: 'araquidonico' }
  | { clase: 'mediadores' }
  | { clase: 'cinetica'; marca?: 'antihistaminico' | 'corticoide' }
  | { clase: 'complemento'; enfasis: 'opsonina' | 'mac' | 'inflamacion' }
  | { clase: 'receptor'; caso: 'miastenia' | 'graves' }
  | { clase: 'precipitacion' }
  | { clase: 'suero' }
  | { clase: 'tuberculina' }
  | { clase: 'diferenciacion'; resaltar: ('th1' | 'th17' | 'th2')[] }
  | { clase: 'citotoxicidad' }
  | { clase: 'hapteno'; hapteno: string; portador: string; efector: 'T' | 'anticuerpo' }
  | { clase: 'rh' }
  | { clase: 'lamina'; img: string; titulo: string; sub?: string; rotulos: { texto: string; x: number; y: number }[] };

export type DesenlaceKind = 'sobrevive' | 'muere' | 'sale' | 'lesion' | 'alivio';

export type Lado = 'izq' | 'der' | 'arriba' | 'abajo';

export type Accion =
  | { at: number; duration?: number; tipo: 'appear'; actor: string; pos: Pos; posV?: Pos; from?: 'fade' | 'top' | 'left' | 'right' | 'bottom' | 'grow' }
  | { at: number; duration?: number; tipo: 'move'; actor: string; to: Pos; toV?: Pos }
  /** Se pega a `target`. Con `ang` queda en ese ángulo de su membrana; un
   *  anticuerpo se orienta solo (`apunta`: qué extremo mira a la célula). */
  | { at: number; duration?: number; tipo: 'bind'; actor: string; target: string; lado?: Lado; offset?: Pos; ang?: number; apunta?: 'fc' | 'fab'; dist?: number }
  | { at: number; duration?: number; tipo: 'release'; actor: string; from: string; to?: Pos }
  | { at: number; duration?: number; tipo: 'activate' | 'deactivate' | 'hide'; actor: string }
  | { at: number; duration?: number; tipo: 'swap'; actor: string; img?: string; dibujo?: Dibujo; label?: string; sub?: string; d?: number }
  | { at: number; duration?: number; tipo: 'divide'; actor: string; into: [string, string]; pos: [Pos, Pos]; posV?: [Pos, Pos] }
  | { at: number; duration?: number; tipo: 'apoptosis'; actor: string }
  | { at: number; duration?: number; tipo: 'express'; actor: string; marcador: Marcador }
  | { at: number; duration?: number; tipo: 'unexpress'; actor: string; id: string }
  /** El actor vacía sus gránulos (poros de exocitosis + chorro de `kind`). */
  | { at: number; duration?: number; tipo: 'degranular'; actor: string; kind?: Particula; hacia?: string[] }
  /** Chorro de partículas del actor hacia otro actor, un punto o en abanico. */
  | { at: number; duration?: number; tipo: 'secretar'; actor: string; kind: Particula; hacia?: string | Pos; n?: number; label?: string }
  /** `actor` (fagocito) rodea a `target` con seudópodos y lo deja en un fagosoma. */
  | { at: number; duration?: number; tipo: 'fagocitar'; actor: string; target: string }
  /** Poros del complejo de ataque a la membrana: se hincha y revienta. */
  | { at: number; duration?: number; tipo: 'lisis'; actor: string }
  | { at: number; duration?: number; tipo: 'tejido'; param: ParamTejido; a: number }
  | { at: number; duration?: number; tipo: 'fondo'; fondo: Fondo }
  | { at: number; duration?: number; tipo: 'proceso'; id: string; cerca: string; lado?: Lado; datos: DatosProceso; persist?: boolean }
  | { at: number; duration?: number; tipo: 'cerrar_proceso'; id: string }
  | { at: number; duration?: number; tipo: 'pulse_signal'; from: string; to: string }
  | { at: number; duration?: number; tipo: 'outcome'; kind: DesenlaceKind; pos?: Pos; texto: string }
  | { at: number; duration?: number; tipo: 'camera'; box: { col: number; row: number; w: number; h: number } | 'all' }
  | { at: number; duration?: number; tipo: 'highlight'; actors: string[] }
  | { at: number; duration?: number; tipo: 'note'; text: string; near: string; side?: 'top' | 'right' | 'bottom' | 'left'; persist?: boolean }
  | { at: number; duration?: number; tipo: 'connect'; id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number }
  | { at: number; duration?: number; tipo: 'disconnect'; id: string }
  | { at: number; tipo: 'wait'; ms: number }
  /** Interna (la añade el motor): desvanece lo que dejó el paso anterior. */
  | { at: number; duration?: number; tipo: 'despedir' };

export type ConnectorType = 'activa' | 'inhibe' | 'migra' | 'secreta' | 'une';

export type Paso = {
  id: string;
  orden: number;
  titulo: string;
  texto: string;
  profundiza: string;
  clinica?: string;
  claves?: string[];
  protagonistas: string[];
  planoGeneral?: boolean;
  /** Encuadre fijo (celdas) en vez del automático; 'all' = el tejido entero. */
  encuadre?: { col: number; row: number; w: number; h: number } | 'all';
  acciones: Accion[];
};

export type RotuloZona = { texto: string; pos: Pos };

export type Escenario = {
  id: string;
  nombre: string;
  resumen: string;
  fondo: Fondo;
  zonas?: RotuloZona[];
  actores: Record<string, ActorDecl>;
  pasos: Paso[];
};

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  /** «Tipo I», «Tipo II»… */
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};

export type Ficha = {
  id: string;
  nombre: string;
  tipo: string;
  marcadores?: string;
  queEs: string;
  origen?: string;
  papel: string;
  clinica?: string[];
};

/** Fila de la tabla de los cuatro tipos. */
export type FilaTipo = {
  tipo: string;
  nombre: string;
  color: string;
  efector: string;
  antigeno: string;
  tiempo: string;
  mecanismo: string;
  lesion: string;
  prototipos: string;
  destino: { parte: ParteId; paso: string };
};

/** Enfermedad → mecanismo, para la segunda tabla. */
export type FilaEnfermedad = {
  nombre: string;
  tipo: string;
  blanco: string;
  manifestacion: string;
  destino: { parte: ParteId; paso: string };
};
