import type { BancoPregunta, BancoTema } from './types';

/**
 * ACP1 — Respuesta inflamatoria aguda: mediadores y SIRS.
 *
 * Cuatro exámenes reales del curso, agrupados en dos tandas de pretest+postest.
 * Las claves se verificaron una a una; las de la tanda 1 venían marcadas en el
 * video de la sesión y las de la tanda 2 se dedujeron. Seis de las veinte
 * posiciones son la MISMA pregunta repetida entre exámenes: en vez de copiarlas
 * se declaran una vez arriba y se reutilizan con `conId`, para que retocar el
 * enunciado no pueda dejar dos versiones con claves distintas.
 *
 * Los enunciados y las alternativas se transcriben tal cual del examen. No se
 * reescriben para equilibrar la longitud de los distractores: son las preguntas
 * que el alumno se va a encontrar.
 */

/** Clona una pregunta compartida cambiándole el id (los ids son únicos). */
const conId = (p: BancoPregunta, id: string): BancoPregunta => ({ ...p, id });

// ─────────────────────────────────────────────────────────────────────────────
// Preguntas que aparecen en más de un examen
// ─────────────────────────────────────────────────────────────────────────────

const Q_SECUENCIA_RECLUTAMIENTO: BancoPregunta = {
  id: 'secuencia-reclutamiento',
  enunciado:
    '¿Cuál de las siguientes secuencias representa correctamente el reclutamiento leucocitario durante la inflamación aguda?',
  etiquetas: ['Reclutamiento leucocitario'],
  opciones: [
    { id: 'a', texto: 'Adhesión → rolling → diapédesis → quimiotaxis' },
    { id: 'b', texto: 'Rolling → adhesión → diapédesis → quimiotaxis', correcta: true },
    { id: 'c', texto: 'Quimiotaxis → rolling → adhesión → diapédesis' },
    { id: 'd', texto: 'Diapédesis → adhesión → rolling → quimiotaxis' },
  ],
  explicacion:
    'La cascada va **de la luz del vaso hacia el tejido**, y el orden es fijo. Primero la marginación (la estasis empuja al leucocito hacia la periferia del vaso), luego el **rolling** —selectinas E y P del endotelio contra Sialyl-Lewis X del leucocito, una unión débil que lo hace rodar—, después la **adhesión firme** —integrinas LFA-1 y Mac-1, activadas por quimiocinas, contra ICAM-1—, la **diapédesis** por la unión interendotelial (PECAM-1) y por último la **quimiotaxis** siguiendo el gradiente (CXCL8, C5a, LTB₄, péptidos bacterianos).\n\nLas otras tres invierten pasos imposibles de invertir: no se puede seguir un gradiente en el tejido antes de haber salido del vaso, ni adherirse con firmeza antes de haber frenado rodando.',
};

const Q_PROCESO_INICIAL: BancoPregunta = {
  id: 'proceso-inicial',
  enunciado: '¿Cuál es el proceso inicial de la inflamación aguda?',
  etiquetas: ['Inflamación aguda', 'STEP 1 · 2024'],
  opciones: [
    { id: 'a', texto: 'Vasodilatación', correcta: true },
    { id: 'b', texto: 'Diapédesis' },
    { id: 'c', texto: 'Migración' },
    { id: 'd', texto: 'Rodamiento' },
  ],
  explicacion:
    'De los cambios vasculares, el primero es la **vasodilatación arteriolar**, mediada por histamina y óxido nítrico. Aumenta el flujo y produce dos de los signos cardinales: el *rubor* y el *calor*. Al aumentar después la permeabilidad, la sangre se concentra y se enlentece (**estasis**), y sólo entonces los leucocitos se desplazan a la periferia del vaso y empiezan a rodar.\n\nLas otras tres alternativas —rodamiento, diapédesis y migración— son pasos del **reclutamiento leucocitario**, que ocurre después y que la vasodilatación hace posible.',
  matiz:
    'Justo tras la lesión hay una vasoconstricción arteriolar que dura segundos, pero es tan breve que no se cuenta como el proceso inicial: la respuesta esperada es la vasodilatación.',
};

const Q_SECUENCIA_TRAUMA: BancoPregunta = {
  id: 'secuencia-trauma',
  enunciado:
    '¿Cuál de las siguientes secuencias representa mejor el desarrollo de una inflamación aguda posterior a un traumatismo?',
  etiquetas: ['Inflamación aguda', 'Inmunidad innata'],
  opciones: [
    { id: 'a', texto: 'Lesión → anticuerpos → linfocitos → vasoconstricción → edema' },
    {
      id: 'b',
      texto:
        'Lesión → DAMPs → células centinela → mediadores → cambios vasculares → reclutamiento leucocitario',
      correcta: true,
    },
    { id: 'c', texto: 'Lesión → neutrófilos → DAMPs → anticuerpos → vasodilatación' },
    { id: 'd', texto: 'Lesión → células plasmáticas → complemento → fibrosis inmediata' },
  ],
  explicacion:
    'Un traumatismo es una lesión **estéril**: no hay microbios, pero sí células rotas que liberan **DAMPs** (ATP, ADN, ácido úrico, HMGB1). Los reconocen las **células centinela** del tejido —macrófagos residentes, mastocitos, células dendríticas— mediante receptores de patrón, que liberan **mediadores** (histamina, prostaglandinas, IL-1, TNF). Esos mediadores producen los **cambios vasculares** (vasodilatación y aumento de permeabilidad) y sólo con el vaso ya alterado es posible el **reclutamiento leucocitario**.\n\nTodo esto es inmunidad **innata** y ocurre en minutos a horas. Las opciones que empiezan por anticuerpos, linfocitos o células plasmáticas describen la respuesta **adaptativa**, que tarda días; y la «fibrosis inmediata» no existe: la reparación viene después de la inflamación, no en su lugar.',
};

const Q_CELULITIS_MEDIADORES: BancoPregunta = {
  id: 'celulitis-mediadores',
  enunciado:
    'Una paciente presenta celulitis de miembro inferior acompañada de fiebre y escalofríos. ¿Qué grupo de mediadores explica mejor la aparición de la respuesta inflamatoria sistémica?',
  etiquetas: ['Caso clínico', 'Respuesta sistémica'],
  opciones: [
    { id: 'a', texto: 'IL-1, TNF e IL-6', correcta: true },
    { id: 'b', texto: 'IL-4, IL-5 e IL-13' },
    { id: 'c', texto: 'IL-2 e IL-7' },
    { id: 'd', texto: 'TGF-β e IL-10 exclusivamente' },
  ],
  explicacion:
    '**IL-1, TNF-α e IL-6** son las tres citocinas de la **respuesta de fase aguda**. Las producen macrófagos y endotelio activados en el foco, pasan a la circulación y actúan a distancia: sobre el hipotálamo (fiebre y escalofríos), el hígado (proteína C reactiva, fibrinógeno), la médula ósea (leucocitosis con desviación izquierda) y el propio endotelio. Cuando esa producción se generaliza aparece el SIRS y, en el extremo, el shock séptico.\n\nLas de la opción B (IL-4, IL-5, IL-13) son citocinas **Th2**, de alergia y parásitos; IL-2 e IL-7 son linfoproliferativas; y TGF-β e IL-10 son **antiinflamatorias** — apagan la respuesta, no la encienden.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Tanda 1
// ─────────────────────────────────────────────────────────────────────────────

const T1_PRETEST: BancoPregunta[] = [
  conId(Q_SECUENCIA_RECLUTAMIENTO, 't1-pre-1'),
  {
    id: 't1-pre-2',
    enunciado:
      'Un hombre de 32 años presenta dolor, eritema y edema alrededor de una herida infectada. Se administran antiinflamatorios no esteroideos, con disminución significativa del dolor y la fiebre. La acción terapéutica de estos fármacos se explica principalmente por la disminución de la síntesis de:',
    etiquetas: ['Caso clínico', 'Farmacología'],
    opciones: [
      { id: 'a', texto: 'Histamina' },
      { id: 'b', texto: 'Leucotrienos' },
      { id: 'c', texto: 'Prostaglandinas', correcta: true },
      { id: 'd', texto: 'Bradicinina' },
    ],
    explicacion:
      'Los AINEs inhiben la **ciclooxigenasa** (COX-1 y COX-2), la enzima que convierte el ácido araquidónico en prostaglandinas. Al bajar la **PGE₂** desaparecen a la vez las dos cosas que el enunciado dice que mejoraron: la sensibilización de los nociceptores (**dolor**) y el ascenso del punto de regulación térmica hipotalámico (**fiebre**). Que un solo fármaco alivie ambas es justamente la pista.\n\nLa **histamina** ya está preformada en los gránulos del mastocito: no se sintetiza por esta vía. Los **leucotrienos** salen de la 5-lipooxigenasa, la otra rama del araquidónico, que los AINEs no tocan — de hecho al bloquear la COX se desvía sustrato hacia allí, y de ahí el broncoespasmo por AINEs. La **bradicinina** se genera en el plasma por el sistema de cininas.',
  },
  conId(Q_CELULITIS_MEDIADORES, 't1-pre-3'),
  {
    id: 't1-pre-4',
    enunciado:
      'Durante la migración de los leucocitos hacia el sitio de inflamación, estos deben adherirse al endotelio antes de atravesar la pared vascular. ¿Qué moléculas participan en este proceso de adhesión firme?',
    etiquetas: ['Reclutamiento leucocitario'],
    opciones: [
      { id: 'a', texto: 'Integrinas', correcta: true },
      { id: 'b', texto: 'Selectinas' },
      { id: 'c', texto: 'Histamina' },
      { id: 'd', texto: 'PECAM-1' },
    ],
    explicacion:
      'La **adhesión firme** la median las **integrinas** del leucocito —LFA-1 y Mac-1, de la familia β₂— contra ICAM-1 del endotelio. El detalle que hace de esto un paso regulado: las integrinas están en reposo en conformación de **baja afinidad**, y son las quimiocinas del endotelio (CXCL8) las que las activan y cambian su conformación. Sólo entonces el leucocito deja de rodar y se detiene.\n\nLas **selectinas** son el paso anterior (rolling, unión débil y transitoria); **PECAM-1** es el siguiente (transmigración por la unión interendotelial); y la histamina no es una molécula de adhesión sino un mediador vasoactivo.',
  },
  {
    id: 't1-pre-5',
    enunciado:
      'Un paciente con una infección bacteriana presenta fiebre de 39 °C. ¿Cuál mecanismo explica mejor este aumento de temperatura?',
    etiquetas: ['Caso clínico', 'Fiebre'],
    opciones: [
      { id: 'a', texto: 'TNF-α → disminución de PGE₂ hipotalámica' },
      { id: 'b', texto: 'IL-1 → aumento de PGE₂ en el hipotálamo', correcta: true },
      { id: 'c', texto: 'IL-10 → aumento de PGE₂' },
      { id: 'd', texto: 'Histamina → disminución del punto de ajuste hipotalámico' },
    ],
    explicacion:
      'Los pirógenos **exógenos** (el LPS de la bacteria) hacen que leucocitos y endotelio liberen pirógenos **endógenos**: IL-1, TNF e IL-6. Éstos inducen **COX-2** en las células del órgano vasculoso de la lámina terminal, junto al hipotálamo, que sintetizan **PGE₂**. La PGE₂ actúa sobre el centro termorregulador y **sube el punto de ajuste**; el cuerpo, que ahora se percibe frío respecto a ese nuevo objetivo, responde con vasoconstricción cutánea y escalofríos hasta alcanzarlo.\n\nLa opción A invierte el sentido (dice *disminución* de PGE₂, que es lo que hace un antipirético). La **IL-10** es antiinflamatoria. Y la histamina no participa en la termorregulación.',
  },
];

const T1_POSTEST: BancoPregunta[] = [
  conId(Q_SECUENCIA_TRAUMA, 't1-post-1'),
  conId(Q_PROCESO_INICIAL, 't1-post-2'),
  {
    id: 't1-post-3',
    enunciado:
      'La micrografía electrónica muestra estructuras elongadas en una célula endotelial. Durante una respuesta inflamatoria aguda, la movilización de una molécula almacenada en estas estructuras hacia la superficie celular facilita el rolling de los leucocitos. ¿Cuál es dicha molécula?',
    etiquetas: ['Endotelio', 'Micrografía electrónica'],
    imagen: {
      src: '/banco/patologia/acp-1/micrografia-weibel-palade.avif',
      alt: 'Micrografía electrónica de una célula endotelial con varios orgánulos alargados de contenido tubular paralelo, correspondientes a cuerpos de Weibel-Palade.',
      w: 700,
      h: 621,
    },
    opciones: [
      { id: 'a', texto: 'P-selectina', correcta: true },
      { id: 'b', texto: 'ICAM-1' },
      { id: 'c', texto: 'PECAM-1' },
      { id: 'd', texto: 'β₂-integrina' },
    ],
    explicacion:
      'Las estructuras elongadas de la imagen son **cuerpos de Weibel-Palade**, los gránulos de secreción propios de la célula endotelial. Almacenan dos cosas: **P-selectina** y factor de von Willebrand.\n\nAnte histamina, trombina o PAF, el gránulo se fusiona con la membrana y la P-selectina aparece en la superficie **en minutos**, sin necesidad de transcribir nada — por eso es la primera molécula capaz de mediar el rolling. (La E-selectina también lo media, pero hay que sintetizarla de nuevo y tarda horas.)\n\n**ICAM-1** y las **β₂-integrinas** pertenecen a la adhesión firme, un paso más tarde; y **PECAM-1** vive en las uniones interendoteliales, no en gránulos de reserva.',
  },
  {
    id: 't1-post-4',
    enunciado:
      'Se desarrolla un fármaco que impide que los neutrófilos respondan a CXCL8 (IL-8). ¿Qué proceso se verá especialmente afectado?',
    etiquetas: ['Neutrófilo', 'Farmacología'],
    opciones: [
      { id: 'a', texto: 'Activación del endotelio' },
      { id: 'b', texto: 'Adhesión al endotelio' },
      { id: 'c', texto: 'Fagocitosis neutrofílica' },
      { id: 'd', texto: 'Quimiotaxis hacia el sitio de inflamación', correcta: true },
    ],
    explicacion:
      '**CXCL8 (IL-8)** es la quimiocina principal del neutrófilo. La producen macrófagos y endotelio activados, queda anclada a los proteoglicanos de la superficie endotelial y forma el **gradiente** que el neutrófilo sigue hasta el foco. Bloquear su receptor (CXCR1/CXCR2) deja al neutrófilo sin brújula: puede llegar al vaso, pero no sabe hacia dónde ir.\n\nLa **activación del endotelio** depende de IL-1 y TNF, no de CXCL8. Y la **fagocitosis** depende del reconocimiento de opsoninas (IgG, C3b) sobre la partícula, un mecanismo distinto.',
    matiz:
      'CXCL8 también activa las integrinas del neutrófilo, así que la adhesión firme se resiente algo. Pero la función que se pierde por completo, y la que pide la pregunta, es la quimiotaxis.',
  },
  {
    id: 't1-post-5',
    enunciado:
      'Un neutrófilo ya se encuentra adherido firmemente al endotelio y comienza a atravesar la unión entre dos células endoteliales. ¿Qué molécula participa principalmente en esta etapa?',
    etiquetas: ['Reclutamiento leucocitario'],
    opciones: [
      { id: 'a', texto: 'E-selectina' },
      { id: 'b', texto: 'ICAM' },
      { id: 'c', texto: 'PECAM-1', correcta: true },
      { id: 'd', texto: 'Sialyl-Lewis X' },
    ],
    explicacion:
      'La **transmigración** o diapédesis ocurre sobre todo en las **vénulas poscapilares**, y el leucocito pasa *entre* dos células endoteliales. La molécula que la media es **PECAM-1 (CD31)**, presente tanto en el leucocito como en la unión interendotelial: la interacción homotípica CD31–CD31 va cerrando la unión por detrás mientras la célula avanza. Después el leucocito degrada la membrana basal con colagenasas.\n\nLas otras tres son de pasos ya cumplidos: **E-selectina** y **Sialyl-Lewis X** son la pareja del rolling, e **ICAM** es la de la adhesión firme — que el propio enunciado da por hecha al decir que el neutrófilo *ya está adherido firmemente*.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tanda 2
// ─────────────────────────────────────────────────────────────────────────────

const T2_PRETEST: BancoPregunta[] = [
  conId(Q_PROCESO_INICIAL, 't2-pre-1'),
  conId(Q_SECUENCIA_TRAUMA, 't2-pre-2'),
  {
    id: 't2-pre-3',
    enunciado:
      'Un paciente presenta una lesión inflamatoria con edema. El análisis del líquido intersticial muestra una concentración elevada de proteínas. ¿Cuál es la explicación más probable?',
    etiquetas: ['Caso clínico', 'Edema'],
    opciones: [
      { id: 'a', texto: 'Disminución de la presión hidrostática capilar' },
      { id: 'b', texto: 'Disminución de la presión oncótica intersticial' },
      { id: 'c', texto: 'Aumento de la reabsorción capilar' },
      { id: 'd', texto: 'Aumento de la permeabilidad vascular', correcta: true },
    ],
    explicacion:
      'Un líquido con **proteínas altas** es un **exudado**, y sólo aparece cuando el endotelio deja pasar proteínas. En la inflamación las células endoteliales de la vénula se contraen ante histamina, bradicinina y leucotrienos, se abren huecos interendoteliales y la albúmina escapa al intersticio. Eso **sube la presión oncótica intersticial** y baja la plasmática, y el agua sigue a la proteína.\n\nSi el edema fuera por presión hidrostática —insuficiencia cardiaca, por ejemplo— el líquido sería un **trasudado**, pobre en proteínas: ése es justo el contraste que la pregunta busca. Las opciones A y C describen mecanismos que *reducen* el edema, y la B lo dice al revés: en la inflamación la presión oncótica intersticial aumenta.',
  },
  conId(Q_CELULITIS_MEDIADORES, 't2-pre-4'),
  {
    id: 't2-pre-5',
    enunciado:
      'Una mujer de 42 años presenta dolor abdominal periumbilical, náuseas, vómitos y fiebre. A las 6 horas, el dolor progresa al cuadrante inferior derecho. Presenta abdomen rígido, leucocitos 16 000 cél/µL y pared apendicular engrosada. ¿Qué manifestaciones indican inflamación sistémica?',
    etiquetas: ['Caso clínico', 'Respuesta sistémica'],
    opciones: [
      { id: 'a', texto: 'Leucocitosis y fiebre', correcta: true },
      { id: 'b', texto: 'Dolor migratorio' },
      { id: 'c', texto: 'Pared apendicular engrosada' },
      { id: 'd', texto: 'Abdomen rígido a la palpación' },
    ],
    explicacion:
      'La pregunta pide separar lo **local** de lo **sistémico**, y el caso está construido para que convivan los dos.\n\nSon locales el **dolor migratorio** (visceral periumbilical al principio, parietal en fosa iliaca derecha cuando se inflama el peritoneo), el **engrosamiento de la pared apendicular** y el **abdomen rígido**: los tres ocurren en el apéndice o a su alrededor.\n\nSon sistémicas la **fiebre** y la **leucocitosis de 16 000**: efectos de IL-1, TNF e IL-6 circulantes actuando lejos del foco, sobre el hipotálamo y la médula ósea. Junto con la taquicardia y la taquipnea son los criterios de SIRS.',
  },
];

const T2_POSTEST: BancoPregunta[] = [
  {
    id: 't2-post-1',
    enunciado:
      '¿Cuál de estos mediadores inflamatorios es liberado por desgranulación y produce vasodilatación y aumento de la permeabilidad vascular?',
    etiquetas: ['Mediadores'],
    opciones: [
      { id: 'a', texto: 'Prostaglandinas' },
      { id: 'b', texto: 'Histamina', correcta: true },
      { id: 'c', texto: 'Bradicinina' },
      { id: 'd', texto: 'C3a' },
    ],
    explicacion:
      'La palabra que decide es **desgranulación**: sólo un mediador **preformado**, guardado en gránulos, se libera así.\n\nLa **histamina** está preformada en los gránulos de mastocitos, basófilos y plaquetas, y sale en segundos ante trauma, C3a/C5a, IgE o neuropéptidos. Produce vasodilatación arteriolar y contracción de la célula endotelial venular —o sea, aumento de permeabilidad—: es la responsable de la fase inmediata de la inflamación.\n\nLas **prostaglandinas** se sintetizan *de novo* a partir de los fosfolípidos de membrana; la **bradicinina** se genera en el plasma por el sistema de cininas; y **C3a** aparece por escisión proteolítica del complemento. C3a es tentadora porque sí produce vasodilatación y permeabilidad, pero lo hace **activando al mastocito** para que desgranule: no es ella la que sale del gránulo.',
  },
  {
    id: 't2-post-2',
    enunciado: '¿Cuál de las siguientes moléculas es mediadora del dolor en la inflamación aguda?',
    etiquetas: ['Mediadores'],
    opciones: [
      { id: 'a', texto: 'Prostaglandina E', correcta: true },
      { id: 'b', texto: 'Óxido nítrico' },
      { id: 'c', texto: 'TNF-α' },
      { id: 'd', texto: 'Tromboxano A₂' },
    ],
    explicacion:
      'La **PGE₂** no genera dolor por sí sola: **sensibiliza los nociceptores**, les baja el umbral y hace que estímulos normalmente indoloros duelan (hiperalgesia). Es exactamente lo que explica que un AINE, que bloquea la COX, quite el dolor inflamatorio.\n\nEl **óxido nítrico** es vasodilatador y antiagregante. El **TNF-α** es una citocina de fase aguda —fiebre, activación endotelial, caquexia—, no un mediador directo del dolor. Y el **tromboxano A₂**, de origen plaquetario, es vasoconstrictor y proagregante.\n\nLa bradicinina es el otro gran mediador del dolor inflamatorio, pero no figura entre las alternativas.',
  },
  conId(Q_SECUENCIA_RECLUTAMIENTO, 't2-post-3'),
  {
    id: 't2-post-4',
    enunciado:
      'Cuatro horas después de un esguince, un paciente presenta edema alrededor del tobillo. ¿Cuál mecanismo explica mejor este hallazgo?',
    etiquetas: ['Caso clínico', 'Edema'],
    opciones: [
      { id: 'a', texto: 'Vasodilatación arteriolar' },
      { id: 'b', texto: 'Sensibilización de nociceptores' },
      { id: 'c', texto: 'Extravasación de proteínas plasmáticas', correcta: true },
      { id: 'd', texto: 'Activación de integrinas leucocitarias' },
    ],
    explicacion:
      'A las **cuatro horas** el edema del esguince ya es un **exudado**: la permeabilidad vascular aumentada ha dejado salir proteínas plasmáticas al intersticio, y el agua las sigue arrastrada por la presión oncótica. Ése es el mecanismo del edema inflamatorio.\n\nLa **vasodilatación arteriolar** contribuye subiendo la presión hidrostática capilar, pero por sí sola daría un trasudado escaso y no explica la magnitud del edema — es la distractora buena de la pregunta. La **sensibilización de nociceptores** explica el dolor, no la hinchazón; y la **activación de integrinas** explica el reclutamiento leucocitario, no la salida de líquido.',
  },
  {
    id: 't2-post-5',
    enunciado:
      'Una paciente con celulitis desarrolla fiebre y escalofríos. ¿Cuál secuencia explica mejor la aparición de fiebre?',
    etiquetas: ['Caso clínico', 'Fiebre'],
    opciones: [
      { id: 'a', texto: 'Histamina → vasodilatación → aumento de temperatura' },
      {
        id: 'b',
        texto: 'IL-1/IL-6/TNF → PGE₂ → aumento del punto de regulación térmica',
        correcta: true,
      },
      { id: 'c', texto: 'LTB₄ → neutrófilos → producción de calor' },
      { id: 'd', texto: 'C3b → opsonización → activación hipotalámica' },
    ],
    explicacion:
      'La secuencia completa es: infección → macrófagos y endotelio liberan **IL-1, IL-6 y TNF** (pirógenos endógenos) → inducción de **COX-2** en la vecindad del hipotálamo → **PGE₂** → **sube el punto de regulación térmica**. El cuerpo se percibe entonces por debajo de su nuevo objetivo y genera calor: vasoconstricción cutánea y escalofríos, que es justo lo que la paciente refiere.\n\nLa **histamina** es vasoactiva pero no termorreguladora, y la vasodilatación cutánea si acaso *pierde* calor. El **LTB₄** es quimiotáctico de neutrófilos, y el calor que produce un leucocito es despreciable. **C3b** opsoniza para la fagocitosis, sin ninguna acción hipotalámica.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export const PATOLOGIA_ACP_1: BancoTema = {
  id: 'patologia/acp-1',
  claseId: 'pat-acp-1',
  titulo: 'Inflamación aguda',
  subtitulo: 'ACP1 · Mediadores y SIRS',
  // El acento del badge ACP en el sílabo de Patología (`TIPO_BADGE.ACP`).
  acento: '#9B8EF8',
  etiquetas: ['Patología'],
  tandas: [
    {
      id: 'patologia/acp-1/t1',
      label: '1',
      fases: [
        { id: 'pretest', label: 'Pretest', preguntas: T1_PRETEST },
        { id: 'postest', label: 'Postest', preguntas: T1_POSTEST },
      ],
    },
    {
      id: 'patologia/acp-1/t2',
      label: '2',
      fases: [
        { id: 'pretest', label: 'Pretest', preguntas: T2_PRETEST },
        { id: 'postest', label: 'Postest', preguntas: T2_POSTEST },
      ],
    },
  ],
};
