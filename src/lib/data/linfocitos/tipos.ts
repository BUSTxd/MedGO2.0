// Contrato de datos del laboratorio «Maduración de linfocitos y origen de las
// neoplasias linfoides». Guion completo: docs/linfocitos/GUION.md.
//
// Mismo modelo que los laboratorios del ciclo celular y de las vías NF-κB:
// cada parte es una lista de pasos con acciones en el tiempo, y el motor
// (`src/lib/linfocitos/motor.ts`) evalúa la escena como función pura del
// tiempo. Lo propio de este laboratorio: los actores son sobre todo CÉLULAS
// (ilustraciones de Servier recortadas o dibujadas con código), que se dividen,
// mueren por apoptosis, cambian de etapa y expresan receptores en su membrana;
// y los procesos moleculares (recombinación V(D)J, hipermutación, cambio de
// clase, translocaciones…) se animan en una «lupa» que sale de la célula.

export type Pos = { col: number; row: number };

export type ParteId = 'medula' | 'linfocito-b' | 'timo' | 'centro-germinal' | 'neoplasias';

/** Fondo dibujado de cada parte (todo sobre blanco). */
export type Fondo = 'medula' | 'timo' | 'ganglio' | 'mapa' | 'ruta';

export type Dibujo =
  | 'plasmocito' | 'fdc' | 'ctec' | 'mtec' | 'dendritica' | 'macrofago' | 'tfh'
  | 'car' | 'osteoblasto' | 'centroblasto' | 'centrocito' | 'eritrocito' | 'hueso';

export type Forma =
  /** Ilustración recortada (`img`), con nombre debajo y marcadores en la membrana. */
  | 'celula'
  /** Célula dibujada con código (`dibujo`). */
  | 'dibujo'
  /** Proteína compleja: un círculo con su nombre (RAG1/2, TdT, AID…). */
  | 'proteina'
  /** Molécula pequeña o grupo (citocina, antígeno, autoantígeno). */
  | 'molecula'
  /** Órgano (timo, ganglio) para el mapa. */
  | 'organo';

export type ActorDecl = {
  forma: Forma;
  label: string;
  /** Subtítulo pequeño bajo el nombre (inmunofenotipo: «CD19+ CD10+ TdT+»). */
  sub?: string;
  img?: string;
  dibujo?: Dibujo;
  color?: string;
  /** Diámetro (u). Por defecto, el de su forma. */
  d?: number;
  /** id en `fichas.ts` si difiere de la clave. */
  info?: string;
};

export type TipoMarcador = 'bcr' | 'igd' | 'prebcr' | 'tcr' | 'pretcr' | 'cd' | 'mhc1' | 'mhc2' | 'receptor';

export type Marcador = { id: string; tipo: TipoMarcador; label?: string; color?: string; /** Ángulo en grados (0 = derecha, −90 = arriba). */ ang: number };

export type ClaseProceso = 'vdj' | 'shm' | 'csr' | 'translocacion' | 'afinidad' | 'clonalidad' | 'factores';

/** Datos de cada proceso de la lupa. */
export type DatosProceso =
  | { clase: 'vdj'; locus: string; cromosoma: string; fase: 'DJ' | 'VDJ' | 'VJ'; tdt: boolean }
  | { clase: 'shm'; mutaciones: number }
  | { clase: 'csr'; hacia: 'IgG' | 'IgA' | 'IgE'; citocina: string }
  | { clase: 'translocacion'; a: string; b: string; genA: string; genB: string; nombre: string; efecto: string }
  | { clase: 'afinidad'; valor: number; resultado: string; titulo: string }
  | { clase: 'clonalidad' }
  | { clase: 'factores'; titulo: string; factores: { nombre: string; color: string }[] };

export type DesenlaceKind = 'sobrevive' | 'muere' | 'sale' | 'neoplasia';

export type Lado = 'izq' | 'der' | 'arriba' | 'abajo';

// `posV` / `toV`: posición en un teléfono vertical, para escenas sin fondo
// (la intro) cuyo reparto en fila quedaría diminuto en una pantalla alta.
export type Accion =
  | { at: number; duration?: number; tipo: 'appear'; actor: string; pos: Pos; posV?: Pos; from?: 'fade' | 'top' | 'left' | 'right' | 'bottom' | 'grow' }
  | { at: number; duration?: number; tipo: 'move'; actor: string; to: Pos; toV?: Pos }
  | { at: number; duration?: number; tipo: 'bind'; actor: string; target: string; lado?: Lado; offset?: Pos }
  | { at: number; duration?: number; tipo: 'release'; actor: string; from: string; to?: Pos }
  | { at: number; duration?: number; tipo: 'activate' | 'deactivate' | 'hide'; actor: string }
  /** Cambio de etapa: fundido a otra imagen/dibujo, nombre, subtítulo o tamaño. */
  | { at: number; duration?: number; tipo: 'swap'; actor: string; img?: string; dibujo?: Dibujo; label?: string; sub?: string; d?: number }
  /** Mitosis: el actor se estrangula y aparecen `into` (declarados), que se separan. */
  | { at: number; duration?: number; tipo: 'divide'; actor: string; into: [string, string]; pos: [Pos, Pos]; posV?: [Pos, Pos] }
  | { at: number; duration?: number; tipo: 'apoptosis'; actor: string }
  /** Anergia: la célula se apaga y se queda (gris). */
  | { at: number; duration?: number; tipo: 'anergia'; actor: string }
  | { at: number; duration?: number; tipo: 'express'; actor: string; marcador: Marcador }
  | { at: number; duration?: number; tipo: 'unexpress'; actor: string; id: string }
  /** Abre la lupa con un proceso molecular junto a la célula `cerca`. */
  | { at: number; duration?: number; tipo: 'proceso'; id: string; cerca: string; lado?: Lado; datos: DatosProceso; persist?: boolean }
  | { at: number; duration?: number; tipo: 'cerrar_proceso'; id: string }
  /** Rótulo rojo de neoplasia bajo un actor. */
  | { at: number; duration?: number; tipo: 'marca'; actor: string; texto: string; sub?: string }
  | { at: number; duration?: number; tipo: 'pulse_signal'; from: string; to: string }
  | { at: number; duration?: number; tipo: 'outcome'; kind: DesenlaceKind; pos?: Pos; texto: string }
  | { at: number; duration?: number; tipo: 'camera'; box: { col: number; row: number; w: number; h: number } | 'all' }
  | { at: number; duration?: number; tipo: 'highlight'; actors: string[] }
  | { at: number; duration?: number; tipo: 'note'; text: string; near: string; side?: 'top' | 'right' | 'bottom' | 'left'; persist?: boolean }
  | { at: number; duration?: number; tipo: 'connect'; id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number }
  | { at: number; duration?: number; tipo: 'disconnect'; id: string }
  | { at: number; tipo: 'wait'; ms: number }
  /** Interna (la añade el motor, no se escribe en los datos): desvanece lo que
   *  el paso anterior dejó a la vista (lupas, avisos, tarjetas). */
  | { at: number; duration?: number; tipo: 'despedir' };

export type ConnectorType = 'activa' | 'inhibe' | 'migra' | 'secreta' | 'une';

export type Paso = {
  id: string;
  orden: number;
  titulo: string;
  texto: string;
  profundiza: string;
  clinica?: string;
  /** Términos que el texto animado subraya. */
  claves?: string[];
  protagonistas: string[];
  /** En un teléfono la cámara se acerca a los actores del paso; con esto mira
   *  todo lo visible (un cierre que anota el conjunto). */
  planoGeneral?: boolean;
  acciones: Accion[];
};

/** Rótulos de zona del fondo («Corteza», «Zona oscura»…), en celdas. */
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
  lugar: string;
  color: string;
  pregunta: string;
};

export type Ficha = {
  id: string;
  nombre: string;
  tipo: string;
  /** Inmunofenotipo o gen. */
  marcadores?: string;
  queEs: string;
  origen?: string;
  papel: string;
  neoplasia?: string;
  clinica?: string[];
};

export type Neoplasia = {
  nombre: string;
  origen: string;
  parte: ParteId;
  inmunofenotipo: string;
  genetica: string;
  clinica: string;
  paso: string;
};
