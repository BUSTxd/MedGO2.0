// Contrato de datos del laboratorio «Lupus eritematoso sistémico». Guion:
// docs/lupus/GUION.md; narración: docs/lupus/NARRACION-ELEVENLABS.md.
//
// Mismo modelo que «Hipersensibilidad» (cada capítulo es una lista de pasos con
// acciones en el tiempo y el motor, `src/lib/lupus/motor.ts`, evalúa la escena
// como función pura del tiempo). Lo propio de este laboratorio: LA VOZ ES EL
// RELOJ. Cada capítulo trae su audio con la marca de cada paso, y cada paso dura
// exactamente lo que dura su frase (`marcas[i + 1] − marcas[i]`); las acciones se
// escriben dentro de ese margen, en ms desde el inicio del paso.

import type { Dibujo as DibujoHiper } from '../hipersensibilidad/tipos';

export type Pos = { col: number; row: number };

export type ParteId =
  | 'que-es' | 'causas' | 'basura' | 'interferon' | 'linfocitos' | 'tipo-3'
  | 'tipo-2' | 'piel' | 'corazon' | 'nefritis' | 'diagnostico' | 'tratamiento';

/** Lámina de fondo; un paso la cambia con la acción `fondo` (con fundido). */
export type Fondo = 'blanco' | 'nombre' | 'nucleo' | 'brotes' | 'quien' | 'imitador' | 'ruta' | 'causas' | 'epidermis' | 'ciudad' | 'espacio' | 'endosoma' | 'firma' | 'red' | 'circulo' | 'seleccion' | 'periferia' | 'germinal' | 'efectoras' | 'freno' | 'intersticio' | 'circuito' | 'puente' | 'h-vaso' | 'h-sangre' | 'h-glomerulo' | 'manos' | 'boca' | 'torso' | 'discoide' | 'valva' | 'coronaria' | 'torax' | 'cebolla' | 'pulmon' | 'capas' | 'fullhouse' | 'clases' | 'pruebas' | 'eular';

/** Parámetros de la lámina que se animan (0 = nada, 1 = entero). Cada fondo lee los suyos. */
/** Parámetro de una lámina (0 = nada, 1 = entero). Los que lee cada lámina están en
 *  `PARAMETROS` (zonas.ts) y el verificador caza el que no exista. */
export type ParamTejido = string;

export type DibujoPropio = 'nucleada' | 'apoptotico' | 'nucleosoma' | 'nucleosomaox' | 'pdc' | 'c1q' | 'fragadn' | 'fragarn' | 'octamero' | 'complejoadn' | 'complejoarn' | 'tdn';
export type Dibujo = DibujoPropio | DibujoHiper;

export type Forma = 'celula' | 'dibujo' | 'proteina' | 'molecula' | 'anticuerpo' | 'complejo' | 'ancla'
  /** Tarjeta con título (`label`) y subtítulo (`sub`, `\n` = otra línea); `w` × `h`. */
  | 'caja'
  /** Texto suelto: `label` (tamaño = `d`) y `sub` debajo. */
  | 'texto'
  /** Icono de órgano o síntoma (`icono`), con su nombre debajo. */
  | 'icono';

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
  /** Caja: ancho y alto (u). */
  w?: number;
  h?: number;
  /** Caja medida para su texto, con letra más grande (`cajaJusta` en acciones.ts). */
  ajusta?: boolean;
  /** Icono: cuál (ver `Icono` en lupus/laminas.tsx). */
  icono?: string;
};

export type TipoMarcador = 'fceri' | 'fcgr' | 'cr' | 'tcr' | 'mhc1' | 'mhc2' | 'cd' | 'receptor' | 'cd40l';

export type Marcador = { id: string; tipo: TipoMarcador; label?: string; color?: string; /** Grados (0 = derecha, −90 = arriba). */ ang: number };

/** Chorro de partículas de un mediador (`secretar`, `degranular`). */
export type Particula =
  | 'histamina' | 'lipido' | 'citocina' | 'quimiocina' | 'alarmina' | 'il4' | 'il5' | 'il13' | 'ifn' | 'il17'
  | 'ige' | 'igg' | 'complemento' | 'ros' | 'enzima' | 'mbp' | 'ach' | 'hormona' | 'perforina' | 'plasma' | 'hemoglobina';

/** Datos de cada proceso de la lupa. */
export type DatosProceso =
  | { clase: 'lista'; titulo: string; sub?: string; items: { nombre: string; color: string; detalle: string }[] };

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
  | { at: number; duration?: number; tipo: 'degranular'; actor: string; kind?: Particula; hacia?: string[] }
  | { at: number; duration?: number; tipo: 'secretar'; actor: string; kind: Particula; hacia?: string | Pos; n?: number; label?: string }
  | { at: number; duration?: number; tipo: 'fagocitar'; actor: string; target: string }
  | { at: number; duration?: number; tipo: 'lisis'; actor: string }
  /** Anima un parámetro de la lámina. `lineal`: sin aceleración (una curva que
   *  se dibuja a la par que la voz). */
  | { at: number; duration?: number; tipo: 'tejido'; param: ParamTejido; a: number; ease?: 'lineal' }
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
  /** Versión corta que se lee en pantalla; la explicación completa va en la voz. */
  texto: string;
  profundiza: string;
  clinica?: string;
  claves?: string[];
  protagonistas: string[];
  planoGeneral?: boolean;
  /** Encuadre fijo (celdas) en vez del automático; 'all' = la lámina entera. */
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
  /** Voz del capítulo: marca la duración de cada paso. */
  narracion?: Narracion;
};

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  /** Bloque de la ruta: «Qué es», «Causas», «Mecanismo», «Daño»… */
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};

/** La voz de un capítulo: un solo audio con la marca de cada paso. */
export type Narracion = {
  /** WebM con Opus; `mp3` para el navegador que no lo lea. */
  webm: string;
  mp3: string;
  /** Segundo en que empieza la frase de cada paso (una por paso, en orden). */
  marcas: number[];
  /** Largo del audio (s): hasta aquí dura el último paso. */
  duracion: number;
  /** Peso de cada archivo (KB), para decidir qué precargar. */
  kb: { webm: number; mp3: number };
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
