// Cascada de coagulación — datos del laboratorio `laboratorio/cascada-coagulacion`.
//
// Fuente única del lienzo: nodos, hilos, zonas, avisos y las vías del modo
// aprender. Transcribe la lámina «Vías de la coagulación (hemostasia 2.ª)» de
// Hematología: misma disposición, mismos colores de zona, mismos símbolos
// (rosa = dependiente de vitamina K, verde = cofactor, * = Ca²⁺ y fosfolípidos,
// discontinua = activa pero no forma parte de la cascada, gris = activado por
// trombina, ⊖ = inhibe). Las notas al pie de la lámina no se pintan como texto
// fijo: son los AVISOS, que aparecen al pasar el cursor por su punto.
//
// Sin lógica de interfaz: el lienzo (`CascadaLab.tsx`) y el verificador en
// Node leen de aquí.

export type TipoNodo =
  | 'factor'     // cimógeno inactivo: va en caja, como en la lámina (XII, VII, II…)
  | 'activo'     // su forma activa: texto en negrita, sin caja (XIIa, VIIa, IIa…)
  | 'cofactor'   // cofactor activo: caja verde con texto claro (VIIIa, Va)
  | 'disparador' // lo que inicia una vía sin ser un factor (colágeno, factor tisular)
  | 'regulador'  // inhibidor fisiológico suelto (inhibidor de C1-esterasa)
  | 'caja'       // caja de fármacos/reguladores con lista (anticoagulantes…)
  | 'efecto'     // consecuencia clínica (↑ vasodilatación…)
  | 'producto';  // resultado final (malla de fibrina, dímero D)

export type ZonaId = 'contacto' | 'cininas' | 'extrinseca' | 'comun' | 'fibrinolitico';

export interface Nodo {
  id: string;
  /** Lo que se lee en grande (numeral romano en los factores). */
  label: string;
  /** Nombre común debajo (Protrombina, Trombina…). */
  sub?: string;
  tipo: TipoNodo;
  zona?: ZonaId;
  /** Factor dependiente de vitamina K: se pinta en rosa. */
  vitK?: boolean;
  /** Paso que requiere Ca²⁺ y fosfolípidos: lleva el asterisco. */
  calcio?: boolean;
  /** Filas de una `caja` (fármacos, reguladores). */
  items?: string[];
  /** Coordenadas de mundo (centro del nodo). */
  x: number;
  y: number;
  /** Otras formas válidas de escribirlo en el modo «Escribir». */
  alias?: string[];
  /**
   * Texto de su ficha en el modo aprender, si no basta con la etiqueta. Las dos
   * cajas de anticoagulantes se llaman igual en la lámina; y rotularlas «sobre
   * el Xa» / «sobre la trombina» regalaría la respuesta a la pista. La ficha
   * nombra los fármacos: saber a qué factor van es justo lo que se evalúa.
   */
  ficha?: string;
}

export type TipoHilo =
  | 'convierte'   // cimógeno → forma activa (flecha negra)
  | 'activa'      // una enzima actúa sobre una conversión (flecha negra)
  | 'discontinua' // activa pero no forma parte de la cascada
  | 'trombina'    // retroactivación por trombina (gris)
  | 'inhibe'      // ⊖
  | 'estimula';   // ⊕

export interface Hilo {
  id: string;
  de: string;
  /** Id de un nodo, o `hilo:<id>` para llegar al punto medio de otra flecha. */
  a: string;
  tipo: TipoHilo;
}

export interface Zona {
  id: ZonaId;
  rotulo: string;
  /** Sub-rótulo entre paréntesis, como en la lámina. */
  detalle?: string;
}

export interface Aviso {
  id: string;
  /** Nodo al que va pegada la baliza. */
  ancla: string;
  titulo: string;
  /** Lo que se lee en el globo al pasar el cursor. */
  corto: string;
  /** Lo que se despliega al hacer clic. Cada entrada es un párrafo. */
  cuerpo: string[];
  /** Mnemotecnia en grande dentro de la tarjeta desplegada. */
  mnemo?: string;
}

export interface PasoVia {
  nodo: string;
  /** Qué relación tiene con lo que ya se ve; se lee junto al hueco. */
  pista: string;
}

export interface Via {
  id: string;
  nombre: string;
  /** Prueba que la evalúa o subtítulo corto. */
  prueba: string;
  zona?: ZonaId;
  /** Lo que se ve al empezar. */
  semilla: string[];
  pasos: PasoVia[];
  mnemo?: string;
}

// ─── Zonas ────────────────────────────────────────────────────────────────────
export const ZONAS: Zona[] = [
  { id: 'contacto',      rotulo: 'Vía de contacto',       detalle: 'activación intrínseca' },
  { id: 'cininas',       rotulo: 'Sistema de cininas' },
  { id: 'extrinseca',    rotulo: 'Vía del factor tisular', detalle: 'activación extrínseca' },
  { id: 'comun',         rotulo: 'Vía común' },
  { id: 'fibrinolitico', rotulo: 'Sistema fibrinolítico' },
];

// ─── Nodos ────────────────────────────────────────────────────────────────────
// Misma topología que la lámina (extrínseca a la izquierda, contacto arriba,
// cininas arriba a la derecha, común al centro, fibrinólisis a la derecha),
// pero espaciada: la caja de cada zona sale de sus nodos, y en la escala ×2 de
// la imagen original contacto pisaba a extrínseca y común a fibrinolítico.
// Al mover un nodo, comprobar que ninguna zona invade a otra.
export const NODOS: Nodo[] = [
  // Vía de contacto (intrínseca)
  { id: 'colageno', label: 'Colágeno, membrana basal, plaquetas activadas', tipo: 'disparador', zona: 'contacto', x: 560, y: 70,
    alias: ['colageno', 'membrana basal', 'plaquetas activadas', 'superficie', 'contacto'] },
  { id: 'xii',   label: 'XII',  tipo: 'factor', zona: 'contacto', x: 470, y: 200 },
  { id: 'xiia',  label: 'XIIa', tipo: 'activo', zona: 'contacto', x: 610, y: 200 },
  { id: 'xi',    label: 'XI',   tipo: 'factor', zona: 'contacto', x: 530, y: 268 },
  { id: 'xia',   label: 'XIa',  tipo: 'activo', zona: 'contacto', x: 650, y: 268 },
  { id: 'ix',    label: 'IX',   tipo: 'factor', zona: 'contacto', x: 590, y: 336, vitK: true, calcio: true },
  { id: 'ixa',   label: 'IXa',  tipo: 'activo', zona: 'contacto', x: 710, y: 336 },
  { id: 'viii',  label: 'VIII', sub: 'con vWF', tipo: 'factor', zona: 'contacto', x: 900, y: 410,
    alias: ['viii con vwf', 'viii vwf'] },
  { id: 'viiia', label: 'VIIIa', tipo: 'cofactor', zona: 'contacto', x: 760, y: 410 },
  { id: 'c1inh', label: 'Inhibidor de la C1-esterasa', tipo: 'regulador', zona: 'contacto', x: 850, y: 150,
    alias: ['inhibidor de c1', 'inhibidor c1', 'c1 inhibidor', 'c1 esterasa', 'inhibidor de la c1 esterasa', 'c1inh'] },

  // Sistema de cininas
  { id: 'hmwk', label: 'HMWK', sub: 'cininógeno de alto peso molecular', tipo: 'factor', zona: 'cininas', x: 1230, y: 60,
    alias: ['hmwk', 'cininogeno', 'cininogeno de alto peso molecular', 'kininogeno'] },
  { id: 'calicreina', label: 'Calicreína', tipo: 'activo', zona: 'cininas', x: 1090, y: 150,
    alias: ['calicreina', 'kalicreina'] },
  { id: 'bradicinina', label: 'Bradicinina', tipo: 'activo', zona: 'cininas', x: 1230, y: 200,
    alias: ['bradicinina', 'bradiquinina'] },
  { id: 'vasodil', label: '↑ vasodilatación', tipo: 'efecto', zona: 'cininas', x: 1450, y: 130,
    alias: ['vasodilatacion'] },
  { id: 'permeab', label: '↑ permeabilidad', tipo: 'efecto', zona: 'cininas', x: 1460, y: 200,
    alias: ['permeabilidad', 'permeabilidad vascular'] },
  { id: 'dolor', label: '↑ dolor', tipo: 'efecto', zona: 'cininas', x: 1440, y: 270,
    alias: ['dolor'] },

  // Vía del factor tisular (extrínseca)
  { id: 'ft',   label: 'Factor tisular', tipo: 'disparador', zona: 'extrinseca', x: 250, y: 500,
    alias: ['factor tisular', 'ft', 'tromboplastina', 'iii', 'factor iii'] },
  { id: 'vii',  label: 'VII',  tipo: 'factor', zona: 'extrinseca', x: 70, y: 580, vitK: true, calcio: true },
  { id: 'viia', label: 'VIIa', tipo: 'activo', zona: 'extrinseca', x: 300, y: 580 },

  // Vía común
  { id: 'x',   label: 'X',   tipo: 'factor', zona: 'comun', x: 620, y: 560, vitK: true, calcio: true },
  { id: 'xa',  label: 'Xa',  tipo: 'activo', zona: 'comun', x: 760, y: 560 },
  { id: 'v',   label: 'V',   tipo: 'factor', zona: 'comun', x: 910, y: 630 },
  { id: 'va',  label: 'Va',  tipo: 'cofactor', zona: 'comun', x: 800, y: 630 },
  { id: 'ii',  label: 'II',  sub: 'Protrombina', tipo: 'factor', zona: 'comun', x: 660, y: 700, vitK: true, calcio: true,
    alias: ['protrombina'] },
  { id: 'iia', label: 'IIa', sub: 'Trombina', tipo: 'activo', zona: 'comun', x: 830, y: 700,
    alias: ['trombina'] },
  { id: 'fibrinogeno', label: 'I', sub: 'Fibrinógeno', tipo: 'factor', zona: 'comun', x: 670, y: 820,
    alias: ['fibrinogeno'] },
  { id: 'monomeros', label: 'Ia', sub: 'Monómeros de fibrina', tipo: 'activo', zona: 'comun', x: 850, y: 820,
    alias: ['monomeros de fibrina', 'monomeros', 'fibrina', 'monomero de fibrina'] },
  { id: 'polimero', label: 'Polímero', sub: 'de fibrina (agregación)', tipo: 'activo', zona: 'comun', x: 850, y: 920,
    alias: ['polimero de fibrina', 'polimero', 'agregacion', 'fibrina laxa', 'polimeros de fibrina'] },
  { id: 'xiii',  label: 'XIII',  tipo: 'factor', zona: 'comun', x: 1150, y: 1010 },
  { id: 'xiiia', label: 'XIIIa', sub: 'Factor estabilizador de la fibrina', tipo: 'activo', zona: 'comun', x: 960, y: 1010, calcio: true,
    alias: ['factor estabilizador de la fibrina', 'factor estabilizador'] },
  { id: 'malla', label: 'Malla de fibrina estable', sub: 'estabiliza el tapón plaquetario', tipo: 'producto', x: 850, y: 1150,
    alias: ['malla de fibrina', 'malla', 'fibrina estable', 'coagulo', 'fibrina entrecruzada', 'malla de fibrina estable'] },

  // Reguladores y fármacos
  { id: 'pcs', label: 'Proteínas anticoagulantes reguladoras', tipo: 'caja', x: 1370, y: 400, ficha: 'Proteínas C y S',
    items: ['Proteínas C y S'],
    alias: ['proteinas c y s', 'proteina c', 'proteina s', 'proteina c y s'] },
  { id: 'anticoagR', label: 'Anticoagulantes', tipo: 'caja', x: 1380, y: 545, ficha: 'Heparina NF, argatrobán, dabigatrán',
    items: [
      'Heparina no fraccionada',
      'Heparina de bajo peso molecular (dalteparina, enoxaparina)',
      'Inhibidores directos de la trombina (argatrobán, bivalirudina, dabigatrán)',
    ],
    // «heparina» a secas no vale en ninguna de las dos cajas: actúa sobre ambas,
    // así que en el modo «Escribir» no distinguiría una de otra.
    alias: ['inhibidores directos de la trombina', 'antitrombinicos', 'dabigatran', 'argatroban', 'bivalirudina'] },
  { id: 'anticoagL', label: 'Anticoagulantes', tipo: 'caja', x: 200, y: 760, ficha: 'HBPM, fondaparinux, apixabán',
    items: [
      'Heparina de bajo peso molecular (dalteparina, enoxaparina)',
      'Heparina no fraccionada',
      'Inhibidores directos del factor Xa (apixabán)',
      'Fondaparinux',
    ],
    alias: ['hbpm', 'enoxaparina', 'dalteparina', 'fondaparinux', 'apixaban', 'inhibidores del xa', 'inhibidores directos del xa'] },

  // Sistema fibrinolítico
  { id: 'plasminogeno', label: 'Plasminógeno', tipo: 'factor', zona: 'fibrinolitico', x: 1420, y: 720,
    alias: ['plasminogeno'] },
  { id: 'tpa', label: 'tPA', sub: 'activador del plasminógeno', tipo: 'activo', zona: 'fibrinolitico', x: 1380, y: 830,
    alias: ['tpa', 'activador tisular del plasminogeno', 'activador del plasminogeno'] },
  { id: 'plasmina', label: 'Plasmina', tipo: 'activo', zona: 'fibrinolitico', x: 1420, y: 940,
    alias: ['plasmina'] },
  { id: 'fibrinoliticos', label: 'Fibrinolíticos (trombolíticos)', tipo: 'caja', zona: 'fibrinolitico', x: 1660, y: 790, ficha: 'Alteplasa, reteplasa, tenecteplasa',
    items: ['Alteplasa', 'Reteplasa', 'Tenecteplasa'],
    alias: ['fibrinoliticos', 'tromboliticos', 'alteplasa', 'reteplasa', 'tenecteplasa'] },
  { id: 'antifibrinoliticos', label: 'Antifibrinolíticos', tipo: 'caja', zona: 'fibrinolitico', x: 1660, y: 930, ficha: 'Ácido tranexámico, aminocaproico',
    items: ['Ácido aminocaproico', 'Ácido tranexámico'],
    alias: ['antifibrinoliticos', 'acido tranexamico', 'tranexamico', 'acido aminocaproico', 'aminocaproico'] },
  { id: 'pdf', label: 'Productos de degradación de la fibrina', sub: 'p. ej. dímero D', tipo: 'producto', x: 1480, y: 1150,
    alias: ['productos de degradacion de la fibrina', 'productos de degradacion', 'pdf', 'dimero d', 'dimero'] },
];

// ─── Hilos ────────────────────────────────────────────────────────────────────
// Orden: primero las conversiones nodo→nodo, luego las que llegan a otra flecha.
export const HILOS: Hilo[] = [
  // Vía de contacto
  { id: 'c-xii',  de: 'xii',  a: 'xiia',  tipo: 'convierte' },
  { id: 'c-xi',   de: 'xi',   a: 'xia',   tipo: 'convierte' },
  { id: 'c-ix',   de: 'ix',   a: 'ixa',   tipo: 'convierte' },
  { id: 'c-viii', de: 'viii', a: 'viiia', tipo: 'convierte' },
  // Extrínseca
  { id: 'c-vii',  de: 'vii',  a: 'viia',  tipo: 'convierte' },
  { id: 'e-ft-viia', de: 'ft', a: 'viia', tipo: 'activa' },
  // Común
  { id: 'c-x',    de: 'x',    a: 'xa',    tipo: 'convierte' },
  { id: 'c-v',    de: 'v',    a: 'va',    tipo: 'convierte' },
  { id: 'c-ii',   de: 'ii',   a: 'iia',   tipo: 'convierte' },
  { id: 'c-fib',  de: 'fibrinogeno', a: 'monomeros', tipo: 'convierte' },
  { id: 'c-agr',  de: 'monomeros',   a: 'polimero',  tipo: 'convierte' },
  { id: 'c-xiii', de: 'xiii', a: 'xiiia', tipo: 'convierte' },
  { id: 'c-malla', de: 'polimero', a: 'malla', tipo: 'convierte' },
  // Cininas
  { id: 'c-hmwk', de: 'hmwk', a: 'bradicinina', tipo: 'convierte' },
  { id: 'd-brad-vaso', de: 'bradicinina', a: 'vasodil', tipo: 'discontinua' },
  { id: 'd-brad-perm', de: 'bradicinina', a: 'permeab', tipo: 'discontinua' },
  { id: 'd-brad-dolor', de: 'bradicinina', a: 'dolor', tipo: 'discontinua' },
  { id: 'd-xiia-cal', de: 'xiia', a: 'calicreina', tipo: 'discontinua' },
  // Fibrinólisis
  { id: 'c-plg',  de: 'plasminogeno', a: 'plasmina', tipo: 'convierte' },
  { id: 'c-pdf',  de: 'malla', a: 'pdf', tipo: 'convierte' },
  // Inhibiciones sobre nodos
  { id: 'i-c1-xiia', de: 'c1inh', a: 'xiia', tipo: 'inhibe' },
  { id: 'i-c1-xia',  de: 'c1inh', a: 'xia',  tipo: 'inhibe' },
  { id: 'i-c1-cal',  de: 'c1inh', a: 'calicreina', tipo: 'inhibe' },
  { id: 'i-pcs-va',    de: 'pcs', a: 'va',    tipo: 'inhibe' },
  { id: 'i-pcs-viiia', de: 'pcs', a: 'viiia', tipo: 'inhibe' },
  { id: 'i-acL-xa',  de: 'anticoagL', a: 'xa',  tipo: 'inhibe' },
  { id: 'i-acR-iia', de: 'anticoagR', a: 'iia', tipo: 'inhibe' },
  { id: 's-fibrin-tpa', de: 'fibrinoliticos', a: 'tpa', tipo: 'estimula' },

  // Enzimas que actúan sobre una conversión (llegan al punto medio de la flecha)
  { id: 'd-col-xii', de: 'colageno', a: 'hilo:c-xii', tipo: 'discontinua' },
  { id: 'e-xiia-xi', de: 'xiia', a: 'hilo:c-xi', tipo: 'activa' },
  { id: 'e-xia-ix',  de: 'xia',  a: 'hilo:c-ix', tipo: 'activa' },
  { id: 'e-ixa-x',   de: 'ixa',  a: 'hilo:c-x',  tipo: 'activa' },
  { id: 'e-viiia-x', de: 'viiia', a: 'hilo:c-x', tipo: 'activa' },
  { id: 'e-viia-x',  de: 'viia', a: 'hilo:c-x',  tipo: 'activa' },
  { id: 'e-ft-x',    de: 'ft',   a: 'hilo:c-x',  tipo: 'activa' },
  { id: 'e-xa-ii',   de: 'xa',   a: 'hilo:c-ii', tipo: 'activa' },
  { id: 'e-va-ii',   de: 'va',   a: 'hilo:c-ii', tipo: 'activa' },
  { id: 'e-iia-fib', de: 'iia',  a: 'hilo:c-fib', tipo: 'activa' },
  { id: 'e-xiiia-malla', de: 'xiiia', a: 'hilo:c-malla', tipo: 'activa' },
  { id: 'e-cal-hmwk', de: 'calicreina', a: 'hilo:c-hmwk', tipo: 'activa' },
  { id: 'e-tpa-plg',  de: 'tpa', a: 'hilo:c-plg', tipo: 'activa' },
  { id: 'i-antifib-plg', de: 'antifibrinoliticos', a: 'hilo:c-plg', tipo: 'inhibe' },
  { id: 'd-plasmina-pdf', de: 'plasmina', a: 'hilo:c-pdf', tipo: 'discontinua' },
  // Retroactivación por trombina (gris)
  { id: 't-iia-v',    de: 'iia', a: 'hilo:c-v',    tipo: 'trombina' },
  { id: 't-iia-viii', de: 'iia', a: 'hilo:c-viii', tipo: 'trombina' },
  { id: 't-iia-xi',   de: 'iia', a: 'hilo:c-xi',   tipo: 'trombina' },
  { id: 't-iia-xiii', de: 'iia', a: 'hilo:c-xiii', tipo: 'trombina' },
];

// ─── Avisos ───────────────────────────────────────────────────────────────────
export const AVISOS: Aviso[] = [
  {
    id: 'tp', ancla: 'vii', titulo: 'Vía extrínseca → TP',
    corto: 'Se evalúa con el tiempo de protrombina · «7 + 3 = 10»',
    mnemo: '7 + 3 = 10',
    cuerpo: [
      'El tiempo de protrombina (TP / INR) mide la vía extrínseca y la común. Mnemotecnia: «tennis player» — el tenis se juega afuera, como la vía extrínseca.',
      '«7 + 3 = 10»: el factor VII junto al factor tisular (factor III) activa el factor X.',
      'Es el primero en alargarse con warfarina, déficit de vitamina K o hepatopatía: el VII tiene la vida media más corta de todos los factores.',
    ],
  },
  {
    id: 'ttp', ancla: 'xii', titulo: 'Vía intrínseca → TTPa',
    corto: 'Se evalúa con el tiempo de tromboplastina parcial · «12, 11, 9, 8»',
    mnemo: '12 · 11 · 9 · 8',
    cuerpo: [
      'El TTPa mide la vía intrínseca y la común. Mnemotecnia: «table tennis player» — el tenis de mesa se juega adentro, como la vía intrínseca.',
      'Sus factores, en orden: 12, 11, 9, 8. Se alarga con heparina no fraccionada, hemofilias y anticoagulante lúpico.',
      'El déficit de XII alarga mucho el TTPa pero no produce sangrado: in vivo la vía de contacto no es imprescindible.',
    ],
  },
  {
    id: 'colageno', ancla: 'colageno', titulo: 'Activa, pero no forma parte',
    corto: 'La línea discontinua: inicia la vía sin ser un factor',
    cuerpo: [
      'El colágeno expuesto, la membrana basal y las plaquetas activadas ofrecen una superficie cargada que activa el XII. Por eso la flecha es discontinua: activa, pero no forma parte de la cascada.',
      'In vitro se imita con caolín o sílice: es la base del TTPa.',
    ],
  },
  {
    id: 'hemofilia-a', ancla: 'viii', titulo: 'Hemofilia A',
    corto: 'Deficiencia del factor VIII · ligada al X',
    cuerpo: [
      'La más frecuente (≈ 80 % de las hemofilias). TTPa alargado con TP normal; hemartrosis y hematomas musculares.',
      'El factor de von Willebrand transporta y protege al VIII: en la enfermedad de von Willebrand el VIII también cae.',
    ],
  },
  {
    id: 'hemofilia-b', ancla: 'ix', titulo: 'Hemofilia B',
    corto: 'Deficiencia del factor IX · ligada al X',
    cuerpo: [
      'También llamada enfermedad de Christmas. Clínica indistinguible de la hemofilia A: se diferencian dosando el factor.',
      'El IX es dependiente de vitamina K (por eso va en rosa).',
    ],
  },
  {
    id: 'hemofilia-c', ancla: 'xi', titulo: 'Hemofilia C',
    corto: 'Deficiencia del factor XI · autosómica recesiva',
    cuerpo: [
      'A diferencia de la A y la B no está ligada al X: afecta por igual a hombres y mujeres.',
      'El sangrado es más leve y aparece sobre todo tras cirugía o traumatismo.',
    ],
  },
  {
    id: 'vitk', ancla: 'ii', titulo: 'Dependientes de vitamina K',
    corto: 'Los factores en rosa: II, VII, IX y X',
    cuerpo: [
      'La vitamina K permite la γ-carboxilación de los factores II, VII, IX y X (y de las proteínas C y S), sin la cual no se unen al Ca²⁺ ni a los fosfolípidos.',
      'La warfarina bloquea la vitamina K epóxido reductasa: alarga primero el TP, porque el VII es el que menos dura.',
    ],
  },
  {
    id: 'calcio', ancla: 'xa', titulo: 'Requiere Ca²⁺ y fosfolípidos',
    corto: 'Los pasos con asterisco (*)',
    cuerpo: [
      'Los complejos tenasa (IXa + VIIIa) y protrombinasa (Xa + Va) se arman sobre la membrana de la plaqueta activada, unidos por Ca²⁺.',
      'Por eso el citrato y el EDTA, que atrapan el calcio, impiden que la sangre del tubo coagule.',
    ],
  },
  {
    id: 'c1', ancla: 'c1inh', titulo: 'Angioedema hereditario',
    corto: 'Deficiencia del inhibidor de la C1-esterasa (#)',
    cuerpo: [
      'El inhibidor de C1 frena al XIIa, al XIa y a la calicreína. Sin él, la calicreína genera bradicinina en exceso.',
      'Resultado: angioedema hereditario — edema sin urticaria de cara, laringe e intestino.',
    ],
  },
  {
    id: 'bradicinina', ancla: 'bradicinina', titulo: 'Calicreína y ECA',
    corto: 'La calicreína activa la bradicinina; la ECA la inactiva',
    cuerpo: [
      'La calicreína libera bradicinina del cininógeno de alto peso molecular (HMWK); la ECA (enzima convertidora de angiotensina) la degrada.',
      'Por eso los IECA pueden causar tos seca y angioedema: la bradicinina se acumula.',
    ],
  },
  {
    id: 'factor-v', ancla: 'v', titulo: 'Cómo se activa el factor V',
    corto: 'Las primeras trazas de trombina lo convierten en Va',
    cuerpo: [
      'Xa + Ca²⁺ + fosfolípidos (sin Va todavía) puede convertir protrombina en trombina, pero a una velocidad muy lenta — se estima que el complejo completo con Va es ~300,000 veces más eficiente que Xa solo.',
      'Esa actividad basal y lenta genera las primeras trazas mínimas de trombina.',
      'Esas trazas de trombina activan al factor V → Va (y VIII → VIIIa, y plaquetas, y XI).',
    ],
  },
  {
    id: 'trombina', ancla: 'iia', titulo: 'Trombina: el centro de todo',
    corto: 'Líneas grises: lo que la trombina activa de vuelta',
    cuerpo: [
      'Además de convertir el fibrinógeno en fibrina, la trombina se amplifica a sí misma activando los factores V, VIII, XI y XIII.',
      'También activa plaquetas y, unida a la trombomodulina, activa la proteína C: a la vez acelera y frena la coagulación.',
    ],
  },
  {
    id: 'xiii', ancla: 'xiiia', titulo: 'Factor estabilizador',
    corto: 'XIIIa entrecruza la fibrina (necesita Ca²⁺)',
    cuerpo: [
      'El XIIIa es una transglutaminasa: une con enlaces covalentes los monómeros ya agregados y convierte el coágulo laxo en una malla estable.',
      'Su déficit sangra con TP y TTPa normales, porque ninguna de las dos pruebas llega a medirlo.',
    ],
  },
  {
    id: 'dimero', ancla: 'pdf', titulo: 'Dímero D',
    corto: 'Sólo aparece si hubo fibrina entrecruzada',
    cuerpo: [
      'La plasmina degrada la fibrina; el dímero D es el fragmento que conserva el enlace hecho por el XIIIa, así que indica que se formó y se lisó un coágulo estable.',
      'Tiene alto valor predictivo negativo: un dímero D normal ayuda a descartar trombosis venosa profunda y tromboembolia pulmonar.',
    ],
  },
  {
    id: 'anticoag-xa', ancla: 'anticoagL', titulo: 'Anticoagulantes sobre el Xa',
    corto: 'Heparinas, fondaparinux e inhibidores directos del Xa',
    cuerpo: [
      'Heparina no fraccionada y HBPM potencian la antitrombina; la HBPM actúa sobre todo sobre el Xa y se controla con anti-Xa, no con TTPa.',
      'Fondaparinux: sólo Xa, también a través de la antitrombina. Apixabán: inhibición directa, sin antitrombina.',
    ],
  },
  {
    id: 'anticoag-iia', ancla: 'anticoagR', titulo: 'Anticoagulantes sobre la trombina',
    corto: 'Heparina e inhibidores directos de la trombina',
    cuerpo: [
      'La heparina no fraccionada frena por igual al Xa y a la trombina; se controla con TTPa y se revierte con protamina.',
      'Inhibidores directos: argatrobán y bivalirudina (endovenosos) y dabigatrán (oral, se revierte con idarucizumab).',
    ],
  },
  {
    id: 'pcs', ancla: 'pcs', titulo: 'Proteínas C y S',
    corto: 'Anticoagulantes naturales que degradan Va y VIIIa',
    cuerpo: [
      'La proteína C activada, con la proteína S de cofactor, inactiva los cofactores Va y VIIIa. Ambas dependen de la vitamina K.',
      'El factor V Leiden resiste esa inactivación y causa trombofilia. Al iniciar warfarina la proteína C cae antes que los factores: riesgo de necrosis cutánea.',
    ],
  },
  {
    id: 'fibrinoliticos', ancla: 'fibrinoliticos', titulo: 'Fibrinolíticos',
    corto: 'Alteplasa, reteplasa, tenecteplasa: potencian el tPA',
    cuerpo: [
      'Son activadores del plasminógeno recombinantes: convierten más plasminógeno en plasmina y disuelven el trombo.',
      'Se usan en el infarto con elevación del ST, el ictus isquémico y la tromboembolia pulmonar masiva. Su riesgo principal es la hemorragia.',
    ],
  },
  {
    id: 'antifibrinoliticos', ancla: 'antifibrinoliticos', titulo: 'Antifibrinolíticos',
    corto: 'Ácido tranexámico y aminocaproico',
    cuerpo: [
      'Son análogos de la lisina: impiden que el plasminógeno se una a la fibrina, así que el coágulo no se disuelve.',
      'Se usan en hemorragia posparto, trauma, cirugía y menorragia.',
    ],
  },
];

// ─── Vías del modo aprender ───────────────────────────────────────────────────
export const VIAS: Via[] = [
  {
    id: 'extrinseca', nombre: 'Vía extrínseca', prueba: 'Se evalúa con el TP', zona: 'extrinseca',
    semilla: ['ft'],
    mnemo: 'TP · «tennis player» · 7 + 3 = 10',
    pasos: [
      { nodo: 'vii',  pista: 'Cimógeno dependiente de vitamina K que se une al factor tisular' },
      { nodo: 'viia', pista: 'Su forma activa, en complejo con el factor tisular' },
      { nodo: 'x',    pista: 'Lo que activa el complejo factor tisular–VIIa' },
      { nodo: 'xa',   pista: 'La puerta de entrada a la vía común' },
    ],
  },
  {
    id: 'intrinseca', nombre: 'Vía intrínseca', prueba: 'Se evalúa con el TTPa', zona: 'contacto',
    semilla: ['colageno'],
    mnemo: 'TTPa · «table tennis player» · 12, 11, 9, 8',
    pasos: [
      { nodo: 'xii',   pista: 'Lo activa el contacto con superficies cargadas' },
      { nodo: 'xiia',  pista: 'Su forma activa' },
      { nodo: 'xi',    pista: 'El sustrato del XIIa' },
      { nodo: 'xia',   pista: 'Su forma activa' },
      { nodo: 'ix',    pista: 'Sustrato del XIa, dependiente de vitamina K' },
      { nodo: 'ixa',   pista: 'Su forma activa' },
      { nodo: 'viii',  pista: 'Viaja unido al factor de von Willebrand' },
      { nodo: 'viiia', pista: 'Cofactor del IXa: juntos forman la tenasa' },
      { nodo: 'x',     pista: 'Lo que activa la tenasa' },
      { nodo: 'xa',    pista: 'La puerta de entrada a la vía común' },
    ],
  },
  {
    id: 'comun', nombre: 'Vía común', prueba: 'Del Xa a la malla de fibrina', zona: 'comun',
    semilla: ['xa'],
    pasos: [
      { nodo: 'v',           pista: 'El cofactor del Xa, todavía inactivo' },
      { nodo: 'va',          pista: 'Con el Xa forma la protrombinasa' },
      { nodo: 'ii',          pista: 'El sustrato de la protrombinasa' },
      { nodo: 'iia',         pista: 'La enzima central de la cascada' },
      { nodo: 'fibrinogeno', pista: 'El sustrato de la trombina (factor I)' },
      { nodo: 'monomeros',   pista: 'Lo que la trombina corta del fibrinógeno' },
      { nodo: 'polimero',    pista: 'Los monómeros se agregan entre sí' },
      { nodo: 'xiii',        pista: 'Lo activa la trombina (línea gris)' },
      { nodo: 'xiiia',       pista: 'Entrecruza la fibrina con Ca²⁺' },
      { nodo: 'malla',       pista: 'El resultado final de toda la cascada' },
    ],
  },
  {
    id: 'cininas', nombre: 'Sistema de cininas', prueba: 'Del XIIa a la bradicinina', zona: 'cininas',
    semilla: ['xiia'],
    pasos: [
      { nodo: 'calicreina',  pista: 'La activa el XIIa (fuera de la cascada)' },
      { nodo: 'hmwk',        pista: 'El sustrato de la calicreína' },
      { nodo: 'bradicinina', pista: 'La cinina que libera la calicreína' },
      { nodo: 'vasodil',     pista: 'Primer efecto de la bradicinina' },
      { nodo: 'permeab',     pista: 'Segundo efecto: sale líquido del vaso' },
      { nodo: 'dolor',       pista: 'Tercer efecto' },
    ],
  },
  {
    id: 'fibrinolisis', nombre: 'Fibrinólisis', prueba: 'Cómo se disuelve el coágulo', zona: 'fibrinolitico',
    semilla: ['plasminogeno', 'malla'],
    pasos: [
      { nodo: 'tpa',                pista: 'Activa el plasminógeno' },
      { nodo: 'plasmina',           pista: 'La forma activa del plasminógeno' },
      { nodo: 'pdf',                pista: 'Lo que queda al degradar la malla' },
      { nodo: 'fibrinoliticos',     pista: 'Fármacos que potencian el tPA (⊕)' },
      { nodo: 'antifibrinoliticos', pista: 'Fármacos que frenan la plasmina (⊖)' },
    ],
  },
  {
    id: 'regulacion', nombre: 'Regulación y fármacos', prueba: 'Quién frena a quién',
    semilla: ['xiia', 'xia', 'calicreina', 'viiia', 'xa', 'va', 'iia'],
    pasos: [
      { nodo: 'c1inh',     pista: 'Frena al XIIa, al XIa y a la calicreína' },
      { nodo: 'pcs',       pista: 'Anticoagulantes naturales que frenan Va y VIIIa' },
      { nodo: 'anticoagL', pista: 'Fármacos que actúan sobre el Xa' },
      { nodo: 'anticoagR', pista: 'Fármacos que actúan sobre la trombina' },
    ],
  },
];

// ─── Utilidades puras (las comparten el lienzo y el verificador) ──────────────

export const NODO_POR_ID: Record<string, Nodo> = Object.fromEntries(NODOS.map((n) => [n.id, n]));
export const HILO_POR_ID: Record<string, Hilo> = Object.fromEntries(HILOS.map((h) => [h.id, h]));

/** `hilo:c-x` → `c-x`; un nodo → null. */
export function hiloDestino(a: string): string | null {
  return a.startsWith('hilo:') ? a.slice(5) : null;
}

const ROMANOS: [number, string][] = [
  [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
];
function aRomano(n: number): string {
  let r = '';
  for (const [v, s] of ROMANOS) while (n >= v) { r += s; n -= v; }
  return r;
}

/**
 * Normaliza una respuesta escrita: sin tildes ni mayúsculas, sin «factor», y
 * los arábigos pasados a romanos («9a» → «ixa»). «IX» y «IXa» siguen siendo
 * distintos: la `a` final es la diferencia entre el cimógeno y la enzima.
 */
export function normalizar(txt: string): string {
  let s = txt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[↑*#().,;:·«»"'¿?¡!]/g, ' ')
    .replace(/\bfactor(es)?\b/g, ' ')
    .replace(/\bactivad[oa]\b/g, 'a')
    .replace(/[\s_-]+/g, ' ')
    .trim();
  // «12a», «12 a» → «xiia»; «9» → «ix»
  s = s.replace(/\b(\d{1,2})\s?(a?)\b/g, (_, n: string, a: string) => aRomano(Number(n)) + a);
  // «ix a» → «ixa»
  s = s.replace(/\b([ivx]+) a\b/g, '$1a');
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Formas aceptadas para un nodo en el modo «Escribir». En las cajas no vale la
 * etiqueta: «Anticoagulantes» es el rótulo de dos cajas distintas, y lo que se
 * pregunta es qué fármacos van ahí (sus `alias`).
 */
export function formasAceptadas(n: Nodo): string[] {
  const base = [...(n.alias ?? [])];
  if (n.tipo !== 'caja') base.push(n.label);
  if (n.sub && n.tipo !== 'producto' && n.tipo !== 'caja') base.push(n.sub);
  return Array.from(new Set(base.map(normalizar).filter(Boolean)));
}

/** Cómo se nombra un nodo en una ficha o en un mensaje del modo aprender. */
export function textoFicha(n: Nodo): string {
  if (n.ficha) return n.ficha;
  return n.sub && n.tipo !== 'producto' && n.tipo !== 'caja' ? `${n.label} · ${n.sub}` : n.label;
}

export function respuestaCorrecta(n: Nodo, escrito: string): boolean {
  const e = normalizar(escrito);
  if (!e) return false;
  return formasAceptadas(n).includes(e);
}

const FAMILIA: Record<TipoNodo, string> = {
  factor: 'factor', activo: 'factor', cofactor: 'factor',
  disparador: 'otro', regulador: 'regulador', caja: 'regulador',
  efecto: 'efecto', producto: 'otro',
};

/** Base romana de un factor («XIIa» → «xii»), para buscar distractores parecidos. */
function baseRomana(label: string): string | null {
  const m = /^([IVX]+)a?$/.exec(label);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Tres distractores para el hueco `correcto`: de la misma familia (un factor se
 * confunde con factores, no con «↑ dolor»), sin repetir lo que ya está a la
 * vista y priorizando los parecidos — el cimógeno frente a su forma activa, el
 * numeral vecino—. `rand` inyectable para que el verificador sea determinista.
 */
export function distractores(correcto: string, visibles: Set<string>, rand: () => number = Math.random): string[] {
  const c = NODO_POR_ID[correcto];
  const fam = FAMILIA[c.tipo];
  const bc = baseRomana(c.label);
  const pool = NODOS.filter((n) => n.id !== correcto && !visibles.has(n.id));
  const puntuar = (n: Nodo) => {
    let p = rand();
    if (FAMILIA[n.tipo] === fam) p += 3;
    const bn = baseRomana(n.label);
    if (bc && bn && bc === bn) p += 2;
    if (n.zona && n.zona === c.zona) p += 1;
    if (n.tipo === c.tipo) p += 0.5;
    return p;
  };
  return pool
    .map((n) => ({ id: n.id, p: puntuar(n) }))
    .sort((a, b) => b.p - a.p)
    .slice(0, 3)
    .map((x) => x.id);
}

export function barajar<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
