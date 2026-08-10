/**
 * Morfología de glóbulos rojos — datos del ejercicio de reconocimiento.
 *
 * ── Fuente de verdad ──────────────────────────────────────────────────────
 * Todo el texto de las fichas está TRANSCRITO LITERALMENTE de
 * `alteraciones_morfologicas_e_inclusiones_eritrocitarias_ampliado.md`, el
 * material que entregó el usuario. No se completa, resume ni parafrasea con
 * conocimiento externo: si el material no dice algo, aquí no aparece.
 *
 * Los `**` dentro de los textos son los énfasis del material original; los
 * renderiza `<Enfasis/>` en el componente, no un parser de markdown.
 *
 * ── El desajuste entre la lámina y el material ────────────────────────────
 * La lámina de microfotografías (imagen 1) trae 19 rótulos; el material
 * desarrolla 15 entradas. No son el mismo conjunto:
 *
 *   · 13 coinciden y tienen ficha completa.
 *   ·  6 salen en la lámina pero el material NO las desarrolla (normal,
 *      reticulocito, macrocito, microcito, eritroblasto, anillo de Cabot):
 *      van sin `ficha`, y la UI lo dice explícitamente en vez de inventar.
 *   ·  2 las desarrolla el material pero no tienen microfotografía en la
 *      lámina (excentrocito, rouleaux): viven en FICHAS_SIN_FOTO, fuera del
 *      quiz, disponibles como material de consulta.
 *
 * ── Imágenes ──────────────────────────────────────────────────────────────
 * `public/laboratorio/morfologia-gr/<id>.webp` — los 19 recortes de la lámina,
 * ya separados uno por uno (420×420, sin el rótulo dentro del recorte, que
 * sería la respuesta). `guia-referencia.webp` es la lámina 2 completa.
 */

/** Bloques de la ficha, con los mismos encabezados del material. */
export interface Ficha {
  /** Columna «Característica» (alteraciones) o «Qué representa» (inclusiones). */
  caracteristica: string;
  /** Columna «¿Por qué adquiere esa forma?» / «¿Por qué aparece?». */
  porQue: string;
  /** Columna «Asociación / importancia clínica». */
  asociacion: string;
  /** Sección 3 del material — a qué mecanismo principal pertenece. */
  mecanismo?: { grupo: string; frase: string };
  /** Sección 5 — cadena morfología → mecanismo → enfermedad → consecuencia. */
  ruta?: string[];
  /** Sección «Diferencia importante: equinocito vs. acantocito». */
  contraste?: string;
  /** Sección 4 — cascada del déficit de G6PD. */
  cascada?: string[];
}

export type Clase = 'forma' | 'inclusion' | 'sin-clasificar';

export interface Morfologia {
  id: string;
  /** Rótulo tal cual aparece en la lámina. Es la respuesta canónica. */
  nombre: string;
  /** Otras formas de escribirlo que se aceptan como correctas. */
  aliases: string[];
  clase: Clase;
  /** Ausente = el material de referencia no desarrolla esta morfología. */
  ficha?: Ficha;
}

const CONTRASTE_ESPICULAS =
  'Equinocito: muchas espículas **pequeñas, cortas y uniformes**. ' +
  'Acantocito: pocas espículas **largas, irregulares y de diferente tamaño**.';

/* ────────────────────────────────────────────────────────────────────────
   LAS 19 DE LA LÁMINA — en el orden en que aparecen en ella
   ──────────────────────────────────────────────────────────────────────── */

export const MORFOLOGIAS: Morfologia[] = [
  {
    id: 'normal',
    nombre: 'Normal',
    aliases: ['normocito', 'eritrocito normal', 'hematie normal', 'globulo rojo normal', 'disco bicóncavo'],
    clase: 'sin-clasificar',
  },
  {
    id: 'reticulocito',
    nombre: 'Reticulocito',
    aliases: ['policromatofilo', 'policromasia', 'eritrocito policromatofilo'],
    clase: 'sin-clasificar',
  },
  {
    id: 'acantocito',
    nombre: 'Acantocito',
    aliases: ['spur cell', 'celula en espuela', 'acantocito (spur cell)'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Espículas largas, irregulares y desiguales',
      porQue:
        'Aparece por una alteración marcada de la composición lipídica de la membrana, especialmente por aumento del colesterol respecto a los fosfolípidos. Esto vuelve la membrana rígida y produce **prolongaciones irregulares de distinto tamaño y distribución**.',
      asociacion:
        'Hepatopatía avanzada, abetalipoproteinemia. Puede favorecer hemólisis por disminución de deformabilidad.',
      contraste: CONTRASTE_ESPICULAS,
      ruta: [
        'Acantocito',
        'alteración de lípidos de membrana',
        'espículas largas e irregulares',
        'menor deformabilidad',
        'destrucción esplénica',
      ],
    },
  },
  {
    id: 'dianocito',
    nombre: 'Dianocito',
    aliases: ['codocito', 'celula en diana', 'target cell', 'dianocito (celula en diana)'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocito con centro teñido, halo claro y borde periférico de Hb',
      porQue:
        'Se produce una **desproporción entre la superficie de membrana y el volumen del eritrocito**. Puede haber exceso relativo de membrana, como en hepatopatías y post-esplenectomía, o disminución del contenido de Hb, como en talasemias y ferropenia. Al extenderse en la lámina, la Hb se distribuye en el centro y periferia, dejando un halo claro intermedio.',
      asociacion:
        'Hepatopatía, talasemia, ferropenia, esplenectomía, hemoglobinopatía C. Orienta a trastornos de Hb o membrana.',
      mecanismo: {
        grupo: 'Alteraciones de hemoglobina',
        frase: 'menor contenido de Hb o exceso relativo de membrana.',
      },
    },
  },
  {
    id: 'esferocito',
    nombre: 'Esferocito',
    aliases: ['esferocitos', 'celula esferica'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocito redondo, pequeño y sin palidez central',
      porQue:
        'El eritrocito **pierde fragmentos de membrana sin perder proporcionalmente su contenido interno**. Esto disminuye la relación superficie/volumen y la célula ya no puede mantener su forma bicóncava, por lo que adopta una forma esférica. En la esferocitosis hereditaria hay defectos de proteínas como espectrina, anquirina o banda 3; en la hemólisis autoinmune, los macrófagos retiran porciones de membrana del eritrocito.',
      asociacion:
        'Esferocitosis hereditaria, anemia hemolítica autoinmune. La menor deformabilidad facilita su destrucción en el bazo y puede causar hemólisis.',
      mecanismo: { grupo: 'Alteraciones de membrana o citoesqueleto', frase: 'pérdida de membrana.' },
      ruta: [
        'Esferocito',
        'pérdida de membrana',
        'forma esférica y menor deformabilidad',
        'atrapamiento esplénico',
        'hemólisis extravascular',
      ],
    },
  },
  {
    id: 'esquistocito',
    nombre: 'Esquistocito',
    aliases: ['esquizocito', 'celula fragmentada', 'celula en casco', 'helmet cell'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Fragmentos irregulares de eritrocitos',
      porQue:
        'Se forman por **fragmentación mecánica dentro de la circulación**. El eritrocito puede romperse al atravesar vasos con depósitos de fibrina, microtrombos o zonas sometidas a elevada fuerza de cizallamiento. También pueden aparecer por contacto con prótesis valvulares.',
      asociacion:
        'Anemia hemolítica microangiopática, CID, PTT/SHU, válvulas cardiacas mecánicas. Sugieren hemólisis intravascular.',
      mecanismo: { grupo: 'Daño mecánico', frase: 'fragmentación dentro de la microcirculación.' },
      ruta: [
        'Esquistocito',
        'daño mecánico',
        'fragmentación del eritrocito',
        'microangiopatía',
        'hemólisis intravascular',
      ],
    },
  },
  {
    id: 'estomatocito',
    nombre: 'Estomatocito',
    aliases: ['celula en boca', 'estomatocitos'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Palidez central con forma de boca o hendidura',
      porQue:
        'Se debe a una alteración de la **permeabilidad de la membrana a sodio y potasio**, lo que modifica el contenido de agua y el volumen celular. El eritrocito adopta una forma tridimensional parecida a una copa; al observarlo en el frotis, su palidez central se ve como una boca.',
      asociacion:
        'Estomatocitosis hereditaria, hepatopatía, alcoholismo. Algunas formas se acompañan de hemólisis.',
      mecanismo: {
        grupo: 'Alteraciones de membrana o citoesqueleto',
        frase: 'alteración de permeabilidad iónica.',
      },
    },
  },
  {
    id: 'dacriocito',
    nombre: 'Dacriocito',
    aliases: ['celula en lagrima', 'teardrop cell', 'lagrima'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocito en forma de lágrima',
      porQue:
        'Se relaciona con alteración de la arquitectura de la médula ósea. En procesos como mielofibrosis o infiltración medular, los eritrocitos sufren **deformación mecánica al atravesar una médula fibrosada o al salir desde focos de hematopoyesis extramedular**. Esto genera el extremo puntiagudo típico.',
      asociacion:
        'Mielofibrosis primaria, infiltración medular. Sugiere compromiso estructural de la médula ósea.',
      mecanismo: {
        grupo: 'Alteración de médula ósea',
        frase: 'deformación asociada a fibrosis o infiltración medular.',
      },
    },
  },
  {
    id: 'eliptocito',
    nombre: 'Eliptocito',
    aliases: ['ovalocito', 'celula elíptica', 'eliptocitos'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocito ovalado o alargado',
      porQue:
        'Se debe a alteraciones de las proteínas del **citoesqueleto eritrocitario**, principalmente espectrina y proteína 4.1. El eritrocito normal se deforma al pasar por capilares estrechos y recupera su forma; cuando el citoesqueleto está alterado, no recupera adecuadamente su disco bicóncavo y queda elongado.',
      asociacion:
        'Eliptocitosis hereditaria, ferropenia, talasemia, mielofibrosis. En formas severas puede existir hemólisis.',
      mecanismo: {
        grupo: 'Alteraciones de membrana o citoesqueleto',
        frase: 'defecto del citoesqueleto.',
      },
    },
  },
  {
    id: 'equinocito',
    nombre: 'Equinocito',
    aliases: ['burr cell', 'celula crenada', 'crenocito', 'equinocito (burr cell)'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Muchas espículas pequeñas, cortas y regulares',
      porQue:
        'Se produce por alteraciones reversibles de la membrana, especialmente en la **distribución de fosfolípidos y en el equilibrio iónico**. La expansión relativa de la capa externa de la membrana hace que aparezcan múltiples espículas uniformes. También puede aparecer como artefacto por envejecimiento de la muestra o exceso de EDTA.',
      asociacion:
        'Insuficiencia renal, déficit de piruvato cinasa. También puede ser un artefacto preanalítico.',
      mecanismo: {
        grupo: 'Alteraciones metabólicas y oxidativas',
        frase: 'cambios de membrana y metabolismo.',
      },
      contraste: CONTRASTE_ESPICULAS,
    },
  },
  {
    id: 'macrocito',
    nombre: 'Macrocito',
    aliases: ['macrocitosis', 'megalocito', 'macrocito oval'],
    clase: 'sin-clasificar',
  },
  {
    id: 'microcito',
    nombre: 'Microcito',
    aliases: ['microcitosis'],
    clase: 'sin-clasificar',
  },
  {
    id: 'eritroblasto',
    nombre: 'Eritroblasto',
    aliases: ['normoblasto', 'eritrocito nucleado', 'hematie nucleado'],
    clase: 'sin-clasificar',
  },
  {
    id: 'howell-jolly',
    nombre: 'Cuerpo Howell-Jolly',
    aliases: ['cuerpos de howell jolly', 'howell jolly', 'cuerpo de howell jolly'],
    clase: 'inclusion',
    ficha: {
      caracteristica: 'Restos de ADN nuclear',
      porQue:
        'Son fragmentos nucleares que deberían ser retirados por el bazo. Si el bazo está ausente o funciona mal, permanecen en circulación. También pueden aparecer cuando existe una maduración nuclear defectuosa.',
      asociacion:
        'Postesplenectomía, hipofunción esplénica, anemia megaloblástica, diseritropoyesis.',
    },
  },
  {
    id: 'punteado-basofilo',
    nombre: 'Punteado basófilo',
    aliases: ['punteado basofilo', 'granulacion basofila', 'puntilleo basofilo'],
    clase: 'inclusion',
    ficha: {
      caracteristica: 'Agregados de ARN ribosomal',
      porQue:
        'Durante la maduración normal, el eritrocito elimina su ARN. Cuando este proceso se altera, quedan pequeños agregados basófilos visibles en el citoplasma. El plomo, por ejemplo, inhibe enzimas que participan en la degradación del ARN.',
      asociacion:
        'Intoxicación por plomo, talasemia, anemia sideroblástica, síndromes mielodisplásicos.',
    },
  },
  {
    id: 'anillo-cabot',
    nombre: 'Anillo de Cabot',
    aliases: ['anillos de cabot', 'cabot'],
    clase: 'sin-clasificar',
  },
  {
    id: 'cuerpos-heinz',
    nombre: 'Cuerpos de Heinz',
    aliases: ['cuerpo de heinz', 'heinz'],
    clase: 'inclusion',
    ficha: {
      caracteristica: 'Hemoglobina desnaturalizada y precipitada',
      porQue:
        'Aparecen cuando la Hb sufre **oxidación**. Si el eritrocito no puede neutralizar adecuadamente los oxidantes, la hemoglobina se desnaturaliza y precipita en forma de inclusiones. Son características del déficit de G6PD.',
      asociacion: 'Déficit de G6PD, hemoglobinopatías, anemias hemolíticas por oxidantes.',
      mecanismo: { grupo: 'Alteraciones de hemoglobina', frase: 'Hb oxidada y precipitada.' },
      cascada: [
        'Déficit de G6PD',
        '↓ NADPH',
        '↓ Glutatión reducido',
        'Menor defensa frente a oxidantes',
        'Oxidación y desnaturalización de Hb',
        'Cuerpos de Heinz',
        'Daño de membrana',
        'Células mordidas / excentrocitos',
        'Hemólisis',
      ],
      ruta: [
        'Cuerpo de Heinz',
        'estrés oxidativo',
        'desnaturalización de Hb',
        'precipitación intracelular',
        'lesión de membrana',
        'hemólisis',
      ],
    },
  },
  {
    id: 'parasito-paludismo',
    nombre: 'Parásito (paludismo)',
    aliases: [
      'parasito',
      'parasitos intracelulares',
      'paludismo',
      'malaria',
      'plasmodium',
      'parasito intracelular',
    ],
    clase: 'inclusion',
    ficha: {
      caracteristica: 'Microorganismos dentro del eritrocito',
      porQue:
        'El parásito invade directamente al eritrocito, utiliza sus recursos y se multiplica en su interior. Esto altera la membrana y favorece la destrucción del hematíe.',
      asociacion:
        'Malaria (Plasmodium) y babesiosis (Babesia). Pueden producir anemia hemolítica.',
    },
  },
  {
    id: 'drepanocito',
    nombre: 'Drepanocito',
    aliases: ['celula falciforme', 'falciforme', 'sickle cell', 'celula en hoz', 'drepanocitos'],
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocito en forma de hoz o media luna',
      porQue:
        'En presencia de HbS, cuando disminuye el oxígeno, la **hemoglobina S se polimeriza formando fibras rígidas dentro del eritrocito**. Estas fibras empujan la membrana y alargan la célula hasta darle aspecto de hoz. Los episodios repetidos de desoxigenación dañan la membrana y pueden volver la deformación irreversible.',
      asociacion:
        'Drepanocitosis / enfermedad falciforme. Puede causar hemólisis y vasooclusión, con isquemia tisular.',
      mecanismo: { grupo: 'Alteraciones de hemoglobina', frase: 'polimerización de HbS.' },
      ruta: [
        'Drepanocito',
        'polimerización de HbS',
        'deformación en hoz',
        'rigidez eritrocitaria',
        'hemólisis + vasooclusión',
      ],
    },
  },
];

/* ────────────────────────────────────────────────────────────────────────
   LAS 2 DEL MATERIAL QUE NO TIENEN MICROFOTOGRAFÍA EN LA LÁMINA
   Fuera del quiz (no hay imagen que mostrar), disponibles para consulta.
   ──────────────────────────────────────────────────────────────────────── */

export const FICHAS_SIN_FOTO: { nombre: string; clase: Clase; ficha: Ficha }[] = [
  {
    nombre: 'Excentrocito',
    clase: 'forma',
    ficha: {
      caracteristica: 'La Hb está desplazada hacia un lado de la célula',
      porQue:
        'Se origina por **daño oxidativo**. Los oxidantes lesionan la Hb y las proteínas de membrana, provocando que la hemoglobina se agrupe hacia un lado y quede una zona aparentemente vacía. Puede acompañarse de cuerpos de Heinz y células mordidas.',
      asociacion:
        'Déficit de G6PD, exposición a sustancias oxidantes. Puede conducir a hemólisis aguda.',
      mecanismo: { grupo: 'Alteraciones metabólicas y oxidativas', frase: 'daño oxidativo.' },
    },
  },
  {
    nombre: 'Rouleaux',
    clase: 'forma',
    ficha: {
      caracteristica: 'Eritrocitos apilados como monedas',
      porQue:
        'Los eritrocitos normalmente se repelen entre sí por su carga superficial negativa. Cuando aumentan proteínas plasmáticas como inmunoglobulinas o fibrinógeno, esta repulsión disminuye y los eritrocitos se adhieren **cara a cara**, formando pilas de monedas.',
      asociacion:
        'Mieloma múltiple, macroglobulinemia, estados inflamatorios. Puede asociarse a aumento de VSG e hiperviscosidad.',
      mecanismo: {
        grupo: 'Alteración de proteínas plasmáticas',
        frase: 'aumento de inmunoglobulinas o fibrinógeno disminuye la repulsión entre eritrocitos.',
      },
    },
  },
];

/** Esquema de estudio de la sección 5 del material. */
export const ESQUEMA_ESTUDIO = 'Morfología → Mecanismo → Enfermedad → Consecuencia';

export const ETIQUETA_CLASE: Record<Clase, string> = {
  forma: 'Alteración morfológica',
  inclusion: 'Inclusión eritrocitaria',
  'sin-clasificar': 'Morfología de la lámina',
};

export const RUTA_IMG = '/laboratorio/morfologia-gr';
export const GUIA_IMG = `${RUTA_IMG}/guia-referencia.webp`;

/* ────────────────────────────────────────────────────────────────────────
   COMPARACIÓN FLEXIBLE DE LA RESPUESTA
   ──────────────────────────────────────────────────────────────────────── */

/** Marcas diacriticas que deja normalize('NFD') (U+0300 a U+036F). */
const DIACRITICOS = new RegExp('[\u0300-\u036f]', 'g');

/** minúsculas, sin tildes, sin puntuación, sin espacios de más. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Palabras que el alumno puede añadir sin cambiar la respuesta. */
const RELLENO = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'es']);

function claves(texto: string): string {
  return normalizar(texto)
    .split(' ')
    .filter((p) => !RELLENO.has(p))
    .join(' ');
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[n];
}

/** Todas las formas aceptadas de una morfología, ya normalizadas. */
function variantes(m: Morfologia): string[] {
  return [m.nombre, ...m.aliases].map(claves);
}

/**
 * Tolerancia a erratas. Ojo: «microcito» y «macrocito» se diferencian en UNA
 * letra, así que una distancia fija aceptaría uno por el otro. Por eso el
 * umbral solo se usa después de comprobar que ninguna OTRA morfología está
 * igual o más cerca de lo escrito (ver `evaluar`).
 */
function umbral(texto: string): number {
  return texto.length >= 8 ? 2 : texto.length >= 5 ? 1 : 0;
}

function distanciaA(m: Morfologia, escrito: string): number {
  return Math.min(...variantes(m).map((v) => levenshtein(escrito, v)));
}

export type Veredicto = 'correcto' | 'casi' | 'incorrecto';

/**
 * Compara lo escrito contra la morfología esperada.
 *
 * - `correcto`: coincide exactamente con el nombre o un alias, o está dentro
 *   del umbral de erratas Y ninguna otra morfología queda igual de cerca.
 * - `casi`: lo escrito está a un paso, pero también se parece a otra
 *   morfología distinta — típico de macro/microcito. No se da por buena: se
 *   pide precisar, sin revelar cuál era.
 */
export function evaluar(escrito: string, esperada: Morfologia): Veredicto {
  const texto = claves(escrito);
  if (!texto) return 'incorrecto';

  const propia = distanciaA(esperada, texto);
  if (propia === 0) return 'correcto';

  const ajena = Math.min(
    ...MORFOLOGIAS.filter((m) => m.id !== esperada.id).map((m) => distanciaA(m, texto)),
  );
  if (ajena === 0) return 'incorrecto';

  if (propia <= umbral(texto)) return propia < ajena ? 'correcto' : 'casi';
  return 'incorrecto';
}
