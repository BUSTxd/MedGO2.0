// Contrato de datos del laboratorio «Checkpoints del ciclo celular».
//
// Los cinco checkpoints (y la intro) son DATOS: listas declarativas de pasos,
// cada paso una lista de acciones con su instante `at`. El motor
// (`src/lib/ciclo-celular/motor.ts`) evalúa la escena como función pura del
// tiempo — `escenaEn(via, paso, t)` —, así que retroceder, saltar, cancelar o
// cambiar de velocidad no necesita deshacer nada: se vuelve a evaluar.
//
// Diferencias deliberadas con el prompt original:
//   · TS tipado en vez de JSON: un `tipo` mal tecleado no compila.
//   · Sin anclajes nombrados (`dock`, `bolsillo`): los recortes van ajustados
//     al contenido (sin lienzo cuadrado), y el acoplamiento se declara con
//     `lado` + `offset` relativos al objetivo.
//   · `base` en un paso permite ramas (G2/M «con daño» parte del paso 2).
//   · `merge` (inverso de `split`) para Mad2–Cdc20 → MCC y las copias de p53.

/** Posición en la rejilla de 16 × 10 (celdas de 100 u; admite decimales). */
export type Pos = { col: number; row: number };

export type CheckpointId = 'restriccion' | 'g1s_dano' | 'intra_s' | 'g2m' | 'huso';

export type Compartimento = 'extracelular' | 'membrana' | 'citoplasma' | 'nucleo' | 'nucleolo' | 'mitocondria';

export type ActorDecl = {
  /** id de imagen (ver `imagenes.ts`); sin imagen → marcador de posición. */
  img: string;
  /** Texto visible. Admite `<sup>…</sup>` y `<sub>…</sub>` simples. */
  label: string;
  /** id en `proteinas.ts` si difiere de `img`. */
  info?: string;
  compartment?: Compartimento;
  /** Multiplicador sobre el tamaño de su tipo (solo si hace falta). */
  escala?: number;
  /** Espejo horizontal (un cinetocoro a la izquierda del centrómero). */
  espejo?: boolean;
  /** Tira horizontal de este ancho (en celdas): la imagen se repite a lo
   *  largo (ADN, microtúbulo, membrana). Si el actor cambia a otra imagen
   *  (rotura, horquilla, gen activo), esa pieza se pinta en el centro y la
   *  tira se abre a los lados. */
  tira?: number;
};

export type ConnectorType =
  | 'activa' | 'inhibe' | 'fosforila' | 'desfosforila' | 'transcribe'
  | 'degrada' | 'dano' | 'retroalimentacion' | 'transloca' | 'secuestra';

export type Lado = 'izq' | 'der' | 'arriba' | 'abajo' | 'encima';

/**
 * Todas las acciones llevan `at` (ms desde el inicio del paso) y aceptan
 * `duration` (ms) para sobrescribir la de por defecto.
 *
 * Reglas del motor que el contenido puede dar por supuestas:
 *   · un conector se oculta solo si uno de sus extremos deja de estar visible;
 *   · `inhibit` dibuja su propio conector «inhibe» (id `inh:<inhibidor>><objetivo>`)
 *     salvo `conector: false`;
 *   · `phosphorylate`/`dephosphorylate` dibujan su conector efímero y dejan
 *     el fosfato puesto/quitado;
 *   · `degrade` viaja hacia el actor visible cuya imagen es `proteasoma`
 *     (o a (14, 8.6) si no hay) y oculta al objetivo;
 *   · `bind` deja al actor acoplado al objetivo: cuando el objetivo se mueve
 *     (`move`, `translocate`, `sequester … to`), su pareja viaja con él.
 */
export type Accion =
  | { at: number; duration?: number; tipo: 'appear'; actor: string; pos: Pos; from?: 'fade' | 'top' | 'left' | 'right' | 'bottom' | 'grow' }
  | { at: number; duration?: number; tipo: 'enter'; actor: string; from: 'top' | 'left' | 'right' | 'bottom'; to: Pos }
  | { at: number; duration?: number; tipo: 'move'; actor: string; to: Pos }
  /** El actor viaja hasta pegarse al objetivo por `lado` (por defecto 'izq'),
   *  solapándose un poco; `offset` (en celdas) fija el punto exacto relativo
   *  al centro del objetivo y manda sobre `lado`. */
  | { at: number; duration?: number; tipo: 'bind'; actor: string; target: string; lado?: Lado; offset?: Pos }
  | { at: number; duration?: number; tipo: 'release'; actor: string; from: string; to?: Pos }
  /** `site`: 'p1'…'p4' (sitios del contorno superior de la imagen). La cinasa
   *  puede ser el propio objetivo (autofosforilación). `label`: residuo («S15»). */
  | { at: number; duration?: number; tipo: 'phosphorylate'; kinase: string; target: string; site: string; label?: string }
  /** Sin `site` retira todos los fosfatos del objetivo. Sin `phosphatase`, el
   *  fosfato se desprende sin enzima visible. */
  | { at: number; duration?: number; tipo: 'dephosphorylate'; phosphatase?: string; target: string; site?: string }
  | { at: number; duration?: number; tipo: 'activate' | 'hide' | 'release_inhibition'; actor: string }
  | { at: number; duration?: number; tipo: 'inhibit'; inhibitor: string; target: string; conector?: boolean }
  /** El secuestrador envuelve al objetivo (que encoge a 0,85) y, con `to`,
   *  ambos viajan allí. */
  | { at: number; duration?: number; tipo: 'sequester'; actor: string; target: string; to?: Pos }
  | { at: number; duration?: number; tipo: 'translocate'; actor: string; to: Pos; compartment: Compartimento }
  /** `gene` es un actor de ADN ya visible; `product` aparece en `productPos`. */
  | { at: number; duration?: number; tipo: 'transcribe'; tf: string; gene: string; product: string; productPos: Pos }
  | { at: number; duration?: number; tipo: 'ubiquitinate'; ligase: string; target: string }
  | { at: number; duration?: number; tipo: 'degrade'; target: string }
  | { at: number; duration?: number; tipo: 'damage'; agent: 'radiacion' | 'uv' | 'horquilla'; target: string; kind: 'doble' | 'simple' | 'dimero' }
  | { at: number; duration?: number; tipo: 'feedback_loop'; from: string; to: string; sign: '+' | '−'; cycles: number }
  | { at: number; duration?: number; tipo: 'pulse_signal'; from: string; to: string }
  /** `label` cambia el rótulo visible (cinetocoro sin unir → unido). */
  | { at: number; duration?: number; tipo: 'swap_image'; actor: string; img: string; label?: string }
  /** El complejo se oculta y aparecen sus partes en sus posiciones. */
  | { at: number; duration?: number; tipo: 'split'; actor: string; into: { actor: string; pos: Pos }[] }
  /** Inverso de `split`: las partes viajan a `pos`, se ocultan, y aparece `into`. */
  | { at: number; duration?: number; tipo: 'merge'; actors: string[]; into: string; pos: Pos }
  | { at: number; duration?: number; tipo: 'outcome'; kind: 'fase_s' | 'mitosis' | 'detencion' | 'reparacion' | 'apoptosis' | 'senescencia' | 'reanuda'; pos?: Pos; texto?: string }
  | { at: number; duration?: number; tipo: 'camera'; box: { col: number; row: number; w: number; h: number } | 'all' }
  | { at: number; duration?: number; tipo: 'highlight'; actors: string[] }
  /** Globo breve (máx. 12 palabras). Se desvanece al cambiar de paso salvo `persist`. */
  | { at: number; duration?: number; tipo: 'note'; text: string; near: string; side?: 'top' | 'right' | 'bottom' | 'left'; persist?: boolean }
  | { at: number; duration?: number; tipo: 'connect'; id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number }
  | { at: number; duration?: number; tipo: 'disconnect'; id: string }
  | { at: number; tipo: 'wait'; ms: number };

export type Paso = {
  id: string;
  /** 0 = contexto. Admite decimales (5.5 = paso lateral). */
  orden: number;
  titulo: string;
  /** Texto del mazo del modo aprendizaje (máx. 18 palabras). El paso 0 no lleva. */
  tarjeta?: string;
  /** Narración corta (1–2 frases). */
  texto: string;
  profundiza: string;
  clinica?: string;
  /** Keys de actores: pistas del modo aprendizaje e ítems «¿quién hace esto?». */
  protagonistas: string[];
  acciones: Accion[];
  /** Factor global de la escena (nunca se escala un actor aislado). */
  sceneScale?: number;
  /** Nombre de la secuencia si el checkpoint tiene varias («Sin daño», «Con daño»).
   *  El modo aprendizaje arma un mazo por secuencia. */
  secuencia?: string;
  /** id del paso cuyo estado final es el punto de partida de éste (rama).
   *  Por defecto, el paso anterior del array. */
  base?: string;
  /** Rótulo de paso lateral («Vía alternativa de activación de p53»). */
  lateral?: string;
  /** Gráfica SVG especial que acompaña al paso (solo la intro). */
  grafica?: 'ciclinas';
};

export type Distractor = { id: string; tarjeta: string; porQueEsFalso: string; secuencia?: string };

export type QuizItem = {
  id: string;
  enunciado: string;
  opciones: [string, string, string, string];
  correcta: 0 | 1 | 2 | 3;
  explicacion: string;
  pasoRelacionado?: string;
  /** Solo en la prueba integrada: checkpoints que cruza la pregunta. */
  checkpoints?: CheckpointId[];
};

export type Compartimentos = {
  /** Franja de membrana plasmática arriba (fila ~1). */
  membrana?: boolean;
  /** Núcleo: borde superior en filas (`top`). `false` = sin núcleo (mitosis). */
  nucleo: { top: number } | false;
  nucleolo?: Pos;
  centrosoma?: Pos;
  /** Polos del huso a izquierda y derecha (solo SAC). */
  polos?: boolean;
};

/** Un escenario animable: un checkpoint o la intro. */
export type Escenario = {
  id: string;
  nombre: string;
  resumen: string;
  compartimentos: Compartimentos;
  actores: Record<string, ActorDecl>;
  pasos: Paso[];
};

export type Checkpoint = Escenario & {
  id: CheckpointId;
  nombreCorto: string;
  fase: 'G1' | 'G1/S' | 'S' | 'G2/M' | 'M';
  /** La pregunta que «hace» el checkpoint (tooltip del anillo). */
  pregunta: string;
  distractores: Distractor[];
  /** Banco de casos clínicos / razonamiento (bloque 4 de la prueba). */
  preguntas: QuizItem[];
};

export type ProteinInfo = {
  id: string;
  nombre: string;
  gen?: string;
  familia: string;
  funcionGeneral: string;
  porCheckpoint: Partial<Record<CheckpointId, string>>;
  clinica?: string[];
};
