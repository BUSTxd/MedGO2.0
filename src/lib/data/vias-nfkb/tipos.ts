// Contrato de datos del laboratorio «Vías NF-κB y JAK/STAT».
//
// Mismo modelo que el ciclo celular (`src/lib/data/ciclo-celular/tipos.ts`):
// cada vía es una lista declarativa de pasos y cada paso, una lista de
// acciones con su instante `at`. El motor (`src/lib/vias-nfkb/motor.ts`)
// evalúa la escena como función pura del tiempo.
//
// La diferencia es el dibujo: aquí casi nada es una imagen. Cada actor declara
// su `forma` (elipse de proteína como en la figura de Küppers, receptor que
// cruza la membrana, ligando trimérico…) y el escenario la pinta con SVG. Solo
// el proteasoma y la ligasa SCF usan los recortes del banco del ciclo celular.
//
// Guion de todos los pasos: docs/vias-nfkb/GUION.md

/** Posición en la rejilla de 16 × 10 (celdas de 100 u; admite decimales). */
export type Pos = { col: number; row: number };

export type ViaId = 'clasica' | 'alternativa' | 'jakstat';

export type Forma =
  /** Elipse con brillo y el nombre dentro (RIP, NEMO, IKKα…). */
  | 'proteina'
  /** Barra vertical que cruza la membrana; nombre encima. */
  | 'receptor'
  /** Proteína de seis pasos transmembrana (LMP1). */
  | 'multipaso'
  /** Trímero de la familia del TNF (tres esferas). */
  | 'ligando'
  /** Citocina pequeña (IL-13). */
  | 'citocina'
  /** Recorte del banco del ciclo celular (`img`). */
  | 'imagen'
  /** Doble hélice dibujada, de `tira` celdas de ancho. */
  | 'adn'
  /** Producto de un gen diana: pastilla con texto. */
  | 'producto'
  /** Célula vecina del microambiente (linfocito T, eosinófilo). */
  | 'celula';

export type ActorDecl = {
  forma: Forma;
  /** Texto visible. Admite `<sup>`/`<sub>` simples. */
  label: string;
  /** Color base (relleno) — los de la figura. */
  color?: string;
  /** id en `proteinas.ts` si difiere de la clave del actor. */
  info?: string;
  /** Solo `forma: 'imagen'`: id del recorte (`proteasoma`, `e3_ligasa_scf`). */
  img?: string;
  /** Medidas en unidades del escenario (si no, las de su forma). */
  w?: number;
  h?: number;
  /** Solo `forma: 'adn'`: ancho en celdas. */
  tira?: number;
  /** Sitios de fosforilación normalizados 0–1 (por defecto, el borde superior). */
  pSites?: [number, number][];
};

export type ConnectorType = 'activa' | 'inhibe' | 'fosforila' | 'transcribe' | 'degrada' | 'transloca' | 'secuestra';

export type Lado = 'izq' | 'der' | 'arriba' | 'abajo' | 'encima';

export type Cadena = 'K63' | 'K48';

export type DesenlaceKind = 'apagada' | 'encendida' | 'supervivencia' | 'evasion';

/**
 * Acciones. Todas llevan `at` (ms desde el inicio del paso) y aceptan
 * `duration`. Mismas reglas que el ciclo celular:
 *   · un conector se oculta solo si uno de sus extremos deja de estar visible;
 *   · `inhibit` dibuja su conector «inhibe» salvo `conector: false`;
 *   · `degrade` y `process` viajan al actor visible con `img: 'proteasoma'`;
 *   · `bind` deja al actor acoplado: si el objetivo se mueve, viaja con él.
 */
export type Accion =
  | { at: number; duration?: number; tipo: 'appear'; actor: string; pos: Pos; from?: 'fade' | 'top' | 'left' | 'right' | 'bottom' | 'grow' }
  | { at: number; duration?: number; tipo: 'move'; actor: string; to: Pos }
  | { at: number; duration?: number; tipo: 'bind'; actor: string; target: string; lado?: Lado; offset?: Pos }
  | { at: number; duration?: number; tipo: 'release'; actor: string; from: string; to?: Pos }
  | { at: number; duration?: number; tipo: 'phosphorylate'; kinase: string; target: string; site: string; label?: string }
  | { at: number; duration?: number; tipo: 'dephosphorylate'; phosphatase?: string; target: string }
  | { at: number; duration?: number; tipo: 'activate' | 'deactivate' | 'hide' | 'release_inhibition'; actor: string }
  | { at: number; duration?: number; tipo: 'inhibit'; inhibitor: string; target: string; conector?: boolean }
  /** Cruza la envoltura nuclear (destello en el poro). */
  | { at: number; duration?: number; tipo: 'translocate'; actor: string; to: Pos }
  /** `gene` es el ADN; `product` aparece en `productPos`. */
  | { at: number; duration?: number; tipo: 'transcribe'; tf: string; gene: string; product: string; productPos: Pos }
  | { at: number; duration?: number; tipo: 'ubiquitinate'; ligase: string; target: string; chain: Cadena }
  /** A20 / CYLD: la enzima se inclina hacia el objetivo y la cadena se desarma. */
  | { at: number; duration?: number; tipo: 'deubiquitinate'; enzyme: string; target: string }
  | { at: number; duration?: number; tipo: 'degrade'; target: string }
  /** Procesamiento parcial (p100 → p52): el objetivo viaja al proteasoma, se
   *  fragmenta su cola y vuelve como `into` a `back`. */
  | { at: number; duration?: number; tipo: 'process'; target: string; into: string; back: Pos }
  /** Marca roja de una alteración del linfoma de Hodgkin. `perdida` apaga al
   *  actor (gris + cruz); `ganancia` le pinta copias detrás. */
  | { at: number; duration?: number; tipo: 'mutate'; actor: string; gene: string; efecto: 'perdida' | 'ganancia'; pct?: string }
  | { at: number; duration?: number; tipo: 'pulse_signal'; from: string; to: string }
  | { at: number; duration?: number; tipo: 'swap_label'; actor: string; label: string; color?: string }
  | { at: number; duration?: number; tipo: 'merge'; actors: string[]; into: string; pos: Pos }
  | { at: number; duration?: number; tipo: 'outcome'; kind: DesenlaceKind; pos?: Pos; texto?: string }
  | { at: number; duration?: number; tipo: 'camera'; box: { col: number; row: number; w: number; h: number } | 'all' }
  | { at: number; duration?: number; tipo: 'highlight'; actors: string[] }
  /** Globo breve (máx. 12 palabras). Se desvanece al cambiar de paso salvo `persist`. */
  | { at: number; duration?: number; tipo: 'note'; text: string; near: string; side?: 'top' | 'right' | 'bottom' | 'left'; persist?: boolean }
  | { at: number; duration?: number; tipo: 'connect'; id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number }
  | { at: number; duration?: number; tipo: 'disconnect'; id: string }
  | { at: number; tipo: 'wait'; ms: number };

export type Paso = {
  id: string;
  /** 0 = contexto. */
  orden: number;
  titulo: string;
  /** Narración corta (1–2 frases). */
  texto: string;
  profundiza: string;
  clinica?: string;
  /** Actores que protagonizan el paso (resaltado y fichas). */
  protagonistas: string[];
  acciones: Accion[];
  /** «Fisiología» o «Linfoma de Hodgkin clásico». */
  secuencia?: string;
  /** id del paso cuyo estado final es el punto de partida (rama). */
  base?: string;
};

export type Compartimentos = {
  /** Fila de la membrana plasmática (centro de la bicapa). */
  membrana: number;
  /** Fila del vértice de la envoltura nuclear (es un arco). */
  nucleo: number;
  /** Rótulos de las vías encima del lienzo (panorama). */
  rotulosVias?: { via: ViaId; col: number }[];
  /** Dónde van «Citoplasma» y «Núcleo» (por defecto, a la izquierda). */
  rotulos?: { citoplasma: Pos; nucleo: Pos };
};

export type Escenario = {
  id: string;
  nombre: string;
  resumen: string;
  compartimentos: Compartimentos;
  actores: Record<string, ActorDecl>;
  pasos: Paso[];
  /** Escala del texto de las elipses (el panorama es más pequeño). */
  texto?: number;
};

export type Via = Escenario & {
  id: ViaId;
  nombreCorto: string;
  /** Color de la vía (rótulo, chips). */
  color: string;
  /** Pregunta que responde la vía (portada). */
  pregunta: string;
};

/** Ficha de una proteína o pieza (panel lateral). */
export type ProteinInfo = {
  id: string;
  nombre: string;
  gen?: string;
  /** Tipo de molécula / familia. */
  familia: string;
  queEs: string;
  /** De dónde proviene: gen, procesamiento, qué células la expresan. */
  origen: string;
  /** Con qué se activa (o qué la activa / la frena). */
  activaCon?: string;
  porVia: Partial<Record<ViaId, string>>;
  /** Alteración en el linfoma de Hodgkin clásico. */
  hodgkin?: string;
  clinica?: string[];
};

/** Una pieza del modo estudio. */
export type Pieza = {
  id: string;
  via: ViaId;
  /** Ronda: la vía fisiológica o las alteraciones del linfoma de Hodgkin. */
  ronda: 'fisiologia' | 'hodgkin';
  /** Lo que se arrastra. */
  ficha: { label: string; color: string; forma: 'proteina' | 'ligando' | 'citocina' | 'imagen' | 'alteracion'; img?: string };
  /** Hueco donde va (coordenadas del panorama). */
  hueco: Pos;
  titulo: string;
  /** Lo que explica el panel al colocarla bien. */
  explica: string;
  acciones: Accion[];
};
