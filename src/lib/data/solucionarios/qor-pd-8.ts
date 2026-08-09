import type { Solucionario } from './types';

/**
 * PD08 — Carbonilos, derivados de ácido y aromaticidad.
 * Es la única práctica dividida en tres partes con la numeración reiniciada en
 * cada una, de ahí el campo `parte` de cada paso.
 * El enunciado (estructuras, esquemas de síntesis con letras y alternativas)
 * es el PDF: `qor-pd-8`.
 */

const P1 = 'Parte 1 · Aldehídos y cetonas';
const P2 = 'Parte 2 · Ácidos carboxílicos y derivados';
const P3 = 'Parte 3 · Aromaticidad y SEAr';

export const qorPd8: Solucionario = {
  id: 'qor-pd-8',
  pdfId: 'qor-pd-8',
  titulo: 'PD08 — Carbonilos, derivados de ácido y aromaticidad',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    // ── Parte 1 ───────────────────────────────────────────────────────────
    {
      n: 1,
      parte: P1,
      titulo: 'Por qué estos dos acetales se hidrolizan tan rápido',
      enunciado:
        'Explicar la hidrólisis excepcionalmente rápida de los dos acetales mostrados.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'El mecanismo A1, paso a paso',
          items: [
            { etiqueta: '1', valor: 'Protonación de uno de los oxígenos alcoxi', detalle: 'rápido y reversible' },
            {
              etiqueta: '2',
              valor: 'Salida de ROH → catión oxocarbenio (C=O⁺R)',
              detalle: 'este es el paso lento y determinante de la velocidad',
            },
            {
              etiqueta: '3',
              valor: 'El agua ataca el catión y se pierde un protón',
              detalle: 'se regenera el carbonilo',
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'Como el paso lento es formar el oxocarbenio, toda hidrólisis anormalmente rápida se explica con la misma pregunta: ¿qué está estabilizando ese catión? En los dos casos del enunciado la respuesta es distinta, pero el razonamiento es el mismo.',
        },
        {
          tipo: 'contraste',
          titulo: 'Dos formas de estabilizar el mismo intermediario',
          lados: [
            {
              titulo: 'a) Acetal sobre el ciclohepta-trieno',
              items: [
                'al salir el –OC₂H₅ queda un catión sobre el anillo',
                'conjuga con los tres dobles enlaces del ciclo de 7',
                'la carga se deslocaliza por todo el anillo',
                'sistema electrónicamente análogo al tropilio (C₇H₇⁺)',
              ],
              nota:
                'El tropilio es aromático: 6 electrones π, 4n+2 con n=1. Esa estabilización baja muchísimo la energía de activación del paso determinante',
            },
            {
              titulo: 'b) Acetal sobre el anillo de cuatro miembros',
              items: [
                'los ángulos están forzados a ~90°, lejos de los 109,5° ideales',
                'el carbono acetálico pasa de sp³ a sp² al ionizar',
                'la geometría trigonal plana relaja el anillo',
                'los enlaces del ciclo ganan carácter p y se alivia el eclipsamiento',
              ],
              nota:
                'Formar el catión libera parte de la tensión de anillo, así que el intermediario está energéticamente más cerca del sustrato de lo normal: mismo efecto neto, energía de activación más baja',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'En ambos casos la clave es la estabilidad del catión oxocarbenio: por aromaticidad en (a) y por alivio de tensión de anillo en (b).',
        },
      ],
    },
    {
      n: 2,
      parte: P1,
      titulo: 'Butiraldehído con 1,3-propanodiol',
      enunciado: 'Escribir el producto e indicar las condiciones necesarias.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Un aldehído más un diol dan un acetal cíclico. Como la reacción es un equilibrio y produce agua, hay que empujarla en las dos direcciones a la vez: activar el carbonilo y retirar el agua que se forma.',
        },
        {
          tipo: 'datos',
          titulo: 'Lo que hace falta',
          items: [
            {
              etiqueta: 'Catalizador',
              valor: 'Ácido (p-TsOH o HCl catalítico)',
              detalle:
                'la formación de acetales requiere activación ácida del carbonilo; con base, o sin catalizador, la reacción no procede',
            },
            {
              etiqueta: 'Desplazar el equilibrio',
              valor: 'Retirar el agua (Dean-Stark o exceso de diol)',
              detalle: 'la reacción es reversible: si el agua se queda, el acetal vuelve a hidrolizarse',
            },
            {
              etiqueta: 'Producto',
              valor: '2-propil-1,3-dioxano + H₂O',
              detalle: 'acetal cíclico de seis miembros, el tamaño de anillo favorecido por un 1,3-diol',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'CH₃CH₂CH₂CHO + HOCH₂CH₂CH₂OH →[H⁺, −H₂O] 2-propil-1,3-dioxano + H₂O',
        },
      ],
    },
    {
      n: 3,
      parte: P1,
      titulo: 'Velocidad relativa de adición nucleofílica al carbonilo',
      enunciado:
        'Comparar en cada serie la velocidad de la adición nucleofílica y justificar el orden.',
      bloques: [
        {
          tipo: 'contraste',
          titulo: 'Los dos factores que gobiernan todas las series',
          lados: [
            {
              titulo: 'Estérico — ¿puede llegar el nucleófilo?',
              items: [
                'grupos voluminosos junto al carbonilo estorban',
                'dificultan formar el intermediario tetraédrico',
                'más volumen, más lento',
              ],
              nota: 'Decide las series (a) y (f), donde todos los sustituyentes son alquilos',
            },
            {
              titulo: 'Electrónico — ¿cuán δ+ está el carbono?',
              items: [
                'grupos –I (Cl, CCl₃) lo hacen más electrofílico → más rápido',
                'conjugación con anillos o C=C estabiliza el carbonilo → más lento',
                'donadores por resonancia (–OCH₃) lo desactivan aún más',
              ],
              nota: 'Decide las series (b), (c), (d) y (e)',
            },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Orden en cada serie, del más rápido al más lento',
          encabezados: ['', 'Orden', 'Factor decisivo'],
          filas: [
            [
              'a)',
              'CH₃CHO > (CH₃)₃C–CHO',
              'estérico: el terc-butilo bloquea el acceso al carbonilo',
            ],
            [
              'b)',
              'CH₃CHO > C₆H₅CHO',
              'el anillo conjuga con el C=O y le baja la electrofilicidad; además es más voluminoso',
            ],
            [
              'c)',
              'ClCH₂CHO > CH₃CHO > CH₃CH=CH–CHO',
              'el Cl retira densidad (–I) y activa; el crotonaldehído, α,β-insaturado, está estabilizado por conjugación',
            ],
            [
              'd)',
              'CH₃CO–CCl₃ > CH₃CO–CH₃',
              'los tres cloros hacen al carbonilo mucho más electrofílico',
            ],
            [
              'e)',
              'CH₃CH₂CH₂CHO > C₆H₅CHO > p-CH₃O–C₆H₄CHO',
              'el alifático no está conjugado; el metoxi dona por resonancia a través del anillo y desactiva del todo',
            ],
            [
              'f)',
              'CH₃COCH₃ > CH₃CO–CH₂C(CH₃)₃ > CH₃CO–C(CH₃)₃',
              'puramente estérico: el terc-butilo pegado al carbonilo estorba más que separado por un CH₂',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Conviene identificar primero qué factor está en juego. Si los sustituyentes solo cambian de tamaño (series a y f), el criterio es estérico; si aparecen halógenos, anillos o dobles enlaces conjugados, el criterio es electrónico. Mezclarlos lleva a comparar cosas que no compiten.',
        },
      ],
    },
    {
      n: 4,
      parte: P1,
      titulo: 'Identificar la función y los productos de hidrólisis completa',
      enunciado:
        'Para cada estructura, nombrar la función orgánica e indicar qué se obtiene al hidrolizarla por completo.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Cómo reconocer cada función de un vistazo',
          items: [
            { etiqueta: 'C con 2 OR', valor: 'Acetal o cetal', detalle: 'dos enlaces C–O simples, ningún OH' },
            { etiqueta: 'C con OH + OR', valor: 'Hemiacetal o hemicetal', detalle: 'la forma a medio camino' },
            { etiqueta: 'C=N–R', valor: 'Imina (base de Schiff)', detalle: 'viene de un carbonilo más una amina' },
            { etiqueta: 'C=N–OH', valor: 'Oxima', detalle: 'viene de un carbonilo más hidroxilamina' },
            { etiqueta: 'C=N–NH–R', valor: 'Hidrazona', detalle: 'viene de un carbonilo más una hidrazina' },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Función y productos de hidrólisis',
          encabezados: ['', 'Función', 'Productos'],
          filas: [
            [
              'a)',
              'Hemiacetal (mixto)',
              'ciclohexanona + CH₃CH₂OH',
            ],
            [
              'b)',
              'Cetal — CH₃CH₂CH₂–C(OCH₃)₂–CH₃',
              'pentan-2-ona + 2 CH₃OH',
            ],
            [
              'c)',
              'Acetal cíclico mixto (tetrahidropirano)',
              '5-hidroxipentanal, en equilibrio con su hemiacetal cíclico, + ciclopentanol',
            ],
            [
              'd)',
              'Acetal del acetaldehído',
              'CH₃CHO + CH₃OH + ciclopentanol',
            ],
            [
              'e)',
              'Cetal cíclico — 1,4-dioxaespiro[4.5]decano',
              'ciclohexanona + etilenglicol',
            ],
            ['f)', 'Hemicetal — Ph–C(CH₃)(OH)–O–CH(CH₃)₂', 'acetofenona + isopropanol'],
            ['g)', 'Oxima de la ciclobutanona', 'ciclobutanona + NH₂OH'],
            ['h)', 'Imina — Ph–CH=N–ciclopentilo', 'benzaldehído + ciclopentilamina'],
            ['i)', 'Imina de cetona — ciclohexil–N=C(CH₃)₂', 'acetona + ciclohexilamina'],
            [
              'j)',
              'Hidrazona (2,4-DNP)',
              'propanal + 2,4-dinitrofenilhidrazina',
            ],
          ],
        },
        {
          tipo: 'clave',
          texto:
            'La hidrólisis completa siempre devuelve el compuesto carbonílico de partida más el alcohol, los alcoholes o la amina que se habían condensado con él. Identificada la función, los productos salen solos.',
        },
      ],
    },
    {
      n: 5,
      parte: P1,
      titulo: 'Productos principales de cada reacción',
      enunciado: 'Indicar el producto principal, o si no hay reacción.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Reacción por reacción',
          encabezados: ['', 'Reactivo', 'Producto'],
          filas: [
            [
              'a)',
              'Benzaldehído + Tollens',
              'benzoato de amonio (ácido benzoico al acidificar) + espejo de plata',
            ],
            ['b)', 'Acetaldehído + KMnO₄ diluido', 'ácido acético + MnO₂ pardo'],
            ['c)', 'Fenilacetaldehído + LiAlH₄', '2-feniletanol'],
            [
              'd)',
              'Metilvinilcetona + H₂/Pd',
              'butan-2-ona — se hidrogena el C=C, el C=O queda intacto',
            ],
            ['e)', 'Benzaldehído + Fehling', 'sin reacción: prueba negativa'],
            ['f)', 'Metilciclohexilcetona + Tollens', 'sin reacción: Tollens no oxida cetonas'],
            [
              'g)',
              'Metilvinilcetona + NaBH₄',
              'but-3-en-2-ol — se reduce el C=O, el C=C queda intacto',
            ],
            [
              'h)',
              'Ciclohexanocarbaldehído + Benedict',
              'ácido ciclohexanocarboxílico (como sal) + Cu₂O rojo ladrillo',
            ],
          ],
        },
        {
          tipo: 'contraste',
          titulo: 'Los dos pares que la pregunta enfrenta a propósito',
          lados: [
            {
              titulo: 'Tollens frente a Fehling / Benedict',
              items: [
                'Tollens oxida aldehídos alifáticos y aromáticos',
                'Fehling y Benedict solo oxidan los alifáticos',
                'ninguno de los tres oxida cetonas',
              ],
              nota:
                'Por eso (a) da espejo de plata y (e), con el mismo benzaldehído, da negativo — y (f), con una cetona, tampoco reacciona',
            },
            {
              titulo: 'H₂/Pd frente a NaBH₄',
              items: [
                'H₂/Pd reduce el C=C y deja el C=O',
                'NaBH₄ reduce el C=O y deja el C=C',
                'mismo sustrato, dos productos distintos',
              ],
              nota:
                'La metilvinilcetona aparece dos veces, en (d) y (g), justamente para exhibir esa selectividad opuesta',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'Serie i–l — cuando hay más de un grupo oxidable',
          items: [
            {
              etiqueta: 'i)',
              valor: 'ácido 4-hidroxiciclohexanocarboxílico + Ag⁰',
              detalle:
                '4-hidroxiciclohexanocarbaldehído con Tollens: es suave y selectivo para el aldehído, el alcohol secundario queda intacto',
            },
            {
              etiqueta: 'j)',
              valor: 'ácido 4-oxociclohexanocarboxílico',
              detalle:
                'el mismo sustrato con K₂Cr₂O₇/H₂SO₄: el dicromato es fuerte y oxida las dos cosas a la vez, –CHO a –COOH y –OH a cetona',
            },
            {
              etiqueta: 'k)',
              valor: 'ácido ciclohexanocarboxílico',
              detalle:
                'ciclohexilmetanol con Na₂Cr₂O₇/H₂SO₄: oxidación fuerte de un alcohol primario, que pasa por el aldehído y no se detiene ahí',
            },
            {
              etiqueta: 'l)',
              valor: 'ácido con un diol cis vecinal en el anillo',
              detalle:
                'ciclohexenilcarbaldehído con KMnO₄ frío y diluido: dihidroxilación syn del C=C —la prueba de Baeyer, con decoloración del permanganato— y de paso oxidación del –CHO a –COOH',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Los apartados (i) y (j) son el mismo sustrato con dos oxidantes: la diferencia entre un reactivo selectivo y uno fuerte no es de grado sino de resultado, porque el segundo toca grupos que el primero ni ve.',
        },
      ],
    },

    // ── Parte 2 ───────────────────────────────────────────────────────────
    {
      n: 6,
      parte: P2,
      titulo: 'Completar las reacciones e indicar si requieren catálisis',
      enunciado:
        'Escribir los productos de cada transformación y señalar qué condiciones necesita.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Producto y condiciones',
          encabezados: ['', 'Reacción', 'Producto', 'Catálisis'],
          filas: [
            [
              'a)',
              '(CH₃CO)₂O + H₂O',
              '2 CH₃COOH',
              'No indispensable — los anhídridos se hidrolizan solos, aunque ácido o base aceleran',
            ],
            [
              'b)',
              'CH₃C≡N + H₂',
              'CH₃CH₂NH₂ (etilamina)',
              'Sí: catalizador metálico (Ni Raney, Pd o Pt)',
            ],
            [
              'c)',
              'CH₃COOCH₃ + ? → CH₃CH₂OH + A',
              'A = CH₃OH; el reactivo que falta es LiAlH₄',
              'No es catálisis: hidruro estequiométrico y luego hidrólisis acuosa',
            ],
            [
              'd)',
              'CH₃CONH₂ + H₂O',
              'CH₃COOH + NH₃',
              'Sí: ácida o básica, con calor — las amidas son los derivados menos reactivos',
            ],
            [
              'e)',
              'CH₃C≡N + H₂O',
              'CH₃COOH + NH₃, vía la amida',
              'Sí: ácida o básica y calor, son condiciones vigorosas',
            ],
            [
              'f)',
              'CH₃COOC₂H₅ + H₂',
              'No hay reacción',
              'Los ésteres no se reducen con H₂ y catalizadores comunes: harían falta LiAlH₄ o cobre-cromita a alta presión',
            ],
            ['g)', 'CH₃CONH₂ → B + NH₄⁺', 'B = CH₃COOH', 'Ácida (H₃O⁺) con calor'],
            [
              'h)',
              'CH₃COCl → CH₃CH₂OH + C',
              'C = Cl⁻ (sale como HCl/LiCl); el reactivo es LiAlH₄',
              'No aplica: reactivo estequiométrico fuerte',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Los apartados (c) y (h) piden deducir el reactivo, no el producto. La pista es el alcohol primario: ningún reactivo suave lleva un éster o un cloruro de ácido hasta ahí, solo un hidruro fuerte como el LiAlH₄, que no se detiene en el aldehído intermedio.',
        },
      ],
    },
    {
      n: 7,
      parte: P2,
      titulo: 'Hidrólisis de la novocaína',
      enunciado:
        'Al hervir novocaína (C₁₃H₂₀O₂N₂) con NaOH acuoso y acidificar después se obtienen A, sólido blanco (C₇H₇O₂N), y B, que queda disuelto (C₆H₁₅ON). Indicar el tipo de reacción e identificar A y B.',
      bloques: [
        {
          tipo: 'parrafo',
          titulo: 'a) Tipo de reacción',
          texto:
            'La novocaína es el éster del ácido p-aminobenzoico con 2-(dietilamino)etanol. Al hervirla con NaOH acuoso sufre hidrólisis básica del enlace éster, es decir, saponificación: el ⁻OH ataca el carbono carbonílico y rompe el enlace C(=O)–O.',
        },
        {
          tipo: 'datos',
          titulo: 'b) Identificación de los dos fragmentos',
          items: [
            {
              etiqueta: 'A',
              valor: 'Ácido p-aminobenzoico (PABA), H₂N–C₆H₄–COOH',
              detalle:
                'la fórmula C₇H₇NO₂ cuadra. Precipita porque al acidificar el carboxilato se protona a –COOH, forma neutra y poco soluble',
            },
            {
              etiqueta: 'B',
              valor: '2-(dietilamino)etanol, (C₂H₅)₂N–CH₂CH₂–OH',
              detalle:
                'la fórmula C₆H₁₅NO cuadra. Se queda en la fase acuosa porque su nitrógeno amínico se protona y forma una sal de amonio soluble, precisamente en el medio ácido',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Novocaína →[NaOH ac., Δ] carboxilato de PABA + (C₂H₅)₂NCH₂CH₂OH →[H₃O⁺] A precipita, B queda en disolución.',
        },
        {
          tipo: 'nota',
          texto:
            'Los dos fragmentos se separan solos por su comportamiento ácido-base opuesto: al acidificar, el que tiene el ácido se neutraliza y precipita, y el que tiene la amina se ioniza y se disuelve. La pregunta ya lo insinúa al decir cuál es sólido y cuál queda disuelto.',
        },
      ],
    },
    {
      n: 8,
      parte: P2,
      titulo: 'Hidrólisis ácida y básica de cuatro sustratos',
      enunciado: 'Indicar los productos de la hidrólisis en medio ácido y en medio básico.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Productos según el medio',
          encabezados: ['', 'Sustrato', 'Hidrólisis ácida', 'Hidrólisis básica'],
          filas: [
            [
              'a)',
              'Anhídrido mixto benzoico-isobutírico',
              'ácido benzoico + ácido isobutírico',
              'benzoato + isobutirato (sales)',
            ],
            [
              'b)',
              'Sevin (carbaril), un carbamato',
              '1-naftol + metilamina (como sal) + CO₂',
              '1-naftolato + metilamina + CO₂ o carbonato',
            ],
            [
              'c)',
              'Cloroformiato + lactona fusionada',
              'el cloroformiato se hidroliza al instante (alcohol + CO₂ + HCl); la lactona, de forma reversible',
              'igual con el cloroformiato; la lactona se saponifica de forma irreversible',
            ],
            [
              'd)',
              'Acetaminofén (paracetamol), una amida',
              'p-aminofenol (como sal de amonio) + ácido acético',
              'p-aminofenol o su fenolato + acetato de sodio',
            ],
          ],
        },
        {
          tipo: 'datos',
          titulo: 'Los tres detalles que la pregunta evalúa',
          items: [
            {
              etiqueta: 'Anhídridos',
              valor: 'Siempre se parten en los dos ácidos',
              detalle: 'el medio solo decide si quedan como ácido neutro o como su sal',
            },
            {
              etiqueta: 'Carbamatos',
              valor: 'Se rompen como un éster, pero pierden CO₂',
              detalle:
                'el fragmento de ácido carbámico (R–NH–COOH) es inestable y se descompone solo en amina más CO₂',
            },
            {
              etiqueta: 'Lactonas',
              valor: 'Reversible en ácido, irreversible en base',
              detalle:
                'en medio ácido el hidroxiácido tiende a volver a cerrarse; en medio básico queda como carboxilato, que es poco electrofílico y ya no puede ciclarse',
            },
          ],
        },
      ],
    },
    {
      n: 9,
      parte: P2,
      titulo: '¿Hay interconversión entre derivados de ácido?',
      enunciado: 'Indicar en cuáles de las mezclas ocurre realmente una interconversión.',
      bloques: [
        {
          tipo: 'clave',
          texto:
            'Escala de reactividad: cloruro de ácido > anhídrido > éster ≫ amida > carboxilato. Un derivado puede convertirse en otro menos reactivo, nunca al revés por simple mezcla con el nucleófilo.',
        },
        {
          tipo: 'contraste',
          titulo: 'Cuáles funcionan y cuáles no',
          lados: [
            {
              titulo: 'Sí hay interconversión',
              items: [
                'a) anhídrido acético + HN(CH₃)(C₂H₅) → N-etil-N-metilacetamida + CH₃COOH',
                'd) CH₃COCl + CH₃OH → acetato de metilo + HCl',
              ],
              nota:
                'En ambos se baja en la escala: de anhídrido a amida y de cloruro a éster. Son rápidas y no necesitan catalizador',
            },
            {
              titulo: 'No hay interconversión',
              items: [
                'b) CH₃COOH + H₂NCH₃ → solo la sal, acetato de metilamonio',
                'c) propanamida + CH₃CH₂OH → no hay reacción',
              ],
              nota:
                'En (b) ocurre una reacción ácido-base, no una acilación: formar la amida exigiría deshidratación forzada o un activador. En (c) habría que subir de amida a éster, que va contra la escala',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El caso (b) es el más fácil de dar por bueno: hay reacción, sí, pero no es la que la pregunta busca. Un ácido y una amina a temperatura ambiente se limitan a transferirse un protón.',
        },
      ],
    },
    {
      n: 10,
      parte: P2,
      titulo: 'Completar las reacciones de derivados de ácido',
      enunciado: 'Escribir los productos y los reactivos que faltan.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Reacción por reacción',
          encabezados: ['', 'Reacción', 'Producto', 'Condiciones'],
          filas: [
            [
              'a)',
              'CH₃COCl + H₂O',
              'CH₃COOH + HCl',
              'Espontánea y violenta: los cloruros de ácido son el extremo reactivo de la escala',
            ],
            [
              'b)',
              'CH₃COOH + CH₃CH₂OH',
              'acetato de etilo + H₂O',
              'Esterificación de Fischer: catálisis ácida y calor, y es un equilibrio',
            ],
            [
              'c)',
              'CH₃COOC₂H₅ + A → CH₃COO⁻Na⁺ + B',
              'A = NaOH · B = CH₃CH₂OH',
              'Saponificación, irreversible',
            ],
            [
              'd)',
              'CH₃COOC₂H₅ + H₂NCH₃',
              'N-metilacetamida + CH₃CH₂OH',
              'Sin catálisis fuerte: las aminas son buenos nucleófilos y la amida está más abajo en la escala',
            ],
            [
              'e)',
              '(CH₃CO)₂O + HN(CH₃)₂',
              'N,N-dimetilacetamida + CH₃COOH',
              'Sin catalizador',
            ],
            [
              'f)',
              'CH₃COOC₂H₅ + CH₃OH',
              'acetato de metilo + CH₃CH₂OH',
              'Transesterificación: catálisis ácida o básica, y es un equilibrio',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Las que necesitan catálisis y quedan en equilibrio, (b) y (f), son justamente aquellas en las que no se baja en la escala de reactividad: se parte de un ácido o un éster para llegar a un éster. Las que bajan de nivel, (a), (d) y (e), salen solas.',
        },
      ],
    },

    // ── Parte 3 ───────────────────────────────────────────────────────────
    {
      n: 1,
      parte: P3,
      titulo: '¿Cuáles de las 18 especies son aromáticas?',
      enunciado: 'Clasificar cada especie como aromática, antiaromática o no aromática.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Los tres criterios de Hückel, en orden de comprobación',
          items: [
            { etiqueta: '1', valor: 'Cíclica', detalle: 'condición mínima' },
            {
              etiqueta: '2',
              valor: 'Plana y completamente conjugada',
              detalle:
                'cada átomo del anillo necesita un orbital p disponible: un solo carbono sp³ rompe el sistema y la deja no aromática',
            },
            {
              etiqueta: '3',
              valor: 'Contar los electrones π',
              detalle:
                '4n+2 → aromática; 4n → antiaromática, pero solo si además cumple el criterio 2',
            },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Las 18 especies',
          encabezados: ['#', 'Especie', 'e⁻ π', 'Clasificación'],
          filas: [
            ['1', 'Ciclopropeno', '— (un C es sp³)', 'No aromático'],
            ['2', 'Anión ciclopropenilo', '4', 'Antiaromático'],
            ['3', 'Catión ciclopropenilo', '2', 'Aromático'],
            ['4', 'Tetrahidrofurano', '— (saturado)', 'No aromático'],
            ['5', 'Dihidrofurano', '— (queda un CH₂ sp³)', 'No aromático'],
            ['6', 'Tiofeno', '6', 'Aromático'],
            ['7', 'Benzofurano', '10', 'Aromático'],
            ['8', 'Pirano (2H- o 4H-)', '— (un CH₂ sp³)', 'No aromático'],
            ['9', 'Anión del pirano', '8', 'Antiaromático'],
            ['10', 'Catión pirilio', '6', 'Aromático'],
            ['11', 'Pirrol', '6', 'Aromático'],
            ['12', 'Piridina', '6', 'Aromático'],
            ['13', 'Piperidina', '— (saturado)', 'No aromático'],
            ['14', 'Piperazina', '— (saturado)', 'No aromático'],
            ['15', 'Pirazina', '6', 'Aromático'],
            ['16', 'Cicloheptatrieno', '— (un CH₂ sp³)', 'No aromático'],
            ['17', 'Anión cicloheptatrienilo', '8', 'Antiaromático'],
            ['18', 'Catión cicloheptatrienilo (tropilio)', '6', 'Aromático'],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El patrón que estructura la lista',
          texto:
            'Las 18 especies son en realidad tres tríos —ciclopropenilo, pirano/pirilio y cicloheptatrienilo— que repiten la misma historia. La forma neutra tiene un carbono sp³ y no es aromática; quitarle un hidruro deja ese orbital vacío, completa la conjugación y da 4n+2 electrones, o sea el catión aromático; quitarle un protón añade un par libre, sube el conteo a 4n y da el anión antiaromático. Reconocido el patrón, los tres tríos se resuelven de una vez.',
        },
        {
          tipo: 'nota',
          texto:
            'Dos detalles que se confunden: en la piridina el par libre del nitrógeno está en un orbital sp² en el plano del anillo y NO se cuenta entre los seis electrones π, mientras que en el pirrol el par libre del nitrógeno sí forma parte del sextete — por eso el pirrol no es básico y la piridina sí.',
        },
      ],
    },
    {
      n: 2,
      parte: P3,
      titulo: 'Sustitución sobre anillos ya sustituidos',
      enunciado:
        'Indicar el producto de cada reacción y si es más rápida o más lenta que con benceno.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Sustituyente, orientación y velocidad',
          encabezados: ['', 'Reacción', 'Efecto del sustituyente', 'Producto y velocidad'],
          filas: [
            [
              'a)',
              'Fenol + (CH₃)₂CHCl/AlCl₃',
              '–OH: activador fuerte, orto/para',
              'p-isopropilfenol (más algo de orto) — más rápido',
            ],
            [
              'b)',
              'Nitrobenceno + Br₂/Fe',
              '–NO₂: desactivador fuerte, meta',
              'm-bromonitrobenceno — mucho más lento',
            ],
            [
              'c)',
              'Tolueno + HNO₃/H₂SO₄',
              '–CH₃: activador débil, orto/para',
              'o- y p-nitrotolueno, con el para predominando — más rápido',
            ],
            [
              'd)',
              'Benzaldehído + SO₃/H₂SO₄',
              '–CHO: desactivador, meta',
              'ácido m-formilbencenosulfónico — más lento',
            ],
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Activador y orto/para van siempre juntos, igual que desactivador y meta (con la excepción de los halógenos, desactivadores pero orto/para). Determinar una de las dos cosas basta para conocer la otra.',
        },
      ],
    },
    {
      n: 3,
      parte: P3,
      titulo: 'Secuencias de dos reacciones',
      enunciado:
        'Identificar los intermediarios y productos, y comparar la velocidad de la segunda etapa con la del benceno.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Las cuatro secuencias',
          items: [
            {
              etiqueta: 'a)',
              valor: 'A = acetofenona → B = m-cloroacetofenona',
              detalle:
                'la acilación de Friedel-Crafts instala un –COCH₃, que desactiva y orienta meta: la segunda etapa es MÁS LENTA que con benceno',
            },
            {
              etiqueta: 'b)',
              valor: 'C = terc-amilbenceno → D = p-bromo-terc-amilbenceno',
              detalle:
                'el 2-metil-2-buteno protonado da el carbocatión terciario, que alquila el anillo. El grupo alquilo activa y orienta orto/para, con el para favorecido por su volumen: MÁS RÁPIDA',
            },
            {
              etiqueta: 'c)',
              valor: 'E = nitrobenceno → F = m-yodonitrobenceno',
              detalle:
                'el HNO₃ concentrado actúa de oxidante para desplazar el equilibrio de la yodación. Con el anillo muy desactivado por el –NO₂: MÁS LENTA, y la yodación de por sí ya es lenta',
            },
            {
              etiqueta: 'd)',
              valor: 'G = cumeno → H = p-yodocumeno',
              detalle:
                'el isopropanol con BF₃ genera el catión isopropilo. El grupo alquilo activa y orienta orto/para, con el para mayoritario por impedimento: MÁS RÁPIDA',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'La segunda etapa de cada secuencia está gobernada por el grupo que instaló la primera. Por eso conviene resolver estos ejercicios en dos tiempos: primero qué grupo entra, y solo después qué hace ese grupo con el anillo.',
        },
      ],
    },
    {
      n: 4,
      parte: P3,
      titulo: 'Identificar los reactivos de cada esquema',
      enunciado: 'Deducir los compuestos y reactivos señalados con letras.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'En estos esquemas lo que se evalúa es el ORDEN. Instalar los mismos dos grupos en distinta secuencia lleva a isómeros de posición distintos, porque el primero en entrar es el que dirige al segundo.',
        },
        {
          tipo: 'datos',
          titulo: 'Esquema por esquema',
          items: [
            {
              etiqueta: 'a)',
              valor: 'J = HNO₃ · K = H₂SO₄ · L = nitrobenceno · M = Cl₂/AlCl₃',
              detalle:
                'el objetivo es m-cloronitrobenceno. Como el –NO₂ orienta meta y el –Cl orto/para, hay que nitrar primero para que el nitro dirija al cloro a meta',
            },
            {
              etiqueta: 'b)',
              valor: 'N = Br₂ · O = Fe · P = bromobenceno · Q = CH₃COCl/AlCl₃',
              detalle:
                'el objetivo es p-bromoacetofenona. Acilar primero mandaría el bromo a meta, así que hay que bromar antes y acilar después, tomando el isómero para',
            },
            {
              etiqueta: 'c)',
              valor: 'R = benceno · T = H⁺ (H₂SO₄, H₃PO₄ o BF₃) · U = H₂SO₄ fumante · V = ácido p-isopropilbencenosulfónico',
              detalle:
                'el 1-propanol daría un catión primario inestable, que se transpone por desplazamiento de hidruro 1,2 al isopropilo: por eso el producto es cumeno y no n-propilbenceno. Luego el isopropilo dirige la sulfonación a para',
            },
            {
              etiqueta: 'd)',
              valor: 'W = HNO₃ conc. · X = yodobenceno · Y = AlCl₃ · Z = p-etilyodobenceno',
              detalle:
                'la yodación directa es reversible y lenta: el HNO₃ consume el HI que se forma y desplaza el equilibrio. Después el yodo orienta orto/para y la alquilación da mayoritariamente el para',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El apartado (c) esconde una transposición: quien escriba n-propilbenceno ha seguido la fórmula del alcohol en vez del carbocatión. Siempre que una alquilación de Friedel-Crafts parta de un sustrato primario conviene comprobar si el catión puede reordenarse a uno más estable.',
        },
      ],
    },
    {
      n: 5,
      parte: P3,
      titulo: 'Síntesis a partir de benceno',
      enunciado: 'Proponer la secuencia de reacciones para obtener cada compuesto.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Rutas',
          items: [
            {
              etiqueta: 'a) m-nitrotolueno',
              valor: 'Formilación → nitración → reducción de Clemmensen',
              detalle:
                'el –CH₃ orienta orto/para, así que alquilar primero no da el meta. Se usa el –CHO como metilo disfrazado: benceno + CO/HCl con AlCl₃ (Gattermann-Koch) → benzaldehído; nitración, que el –CHO dirige a meta; y Zn(Hg)/HCl, que reduce el C=O hasta CH₂ sin tocar el nitro',
            },
            {
              etiqueta: 'b) p-diclorobenceno',
              valor: 'Cl₂/FeCl₃ dos veces',
              detalle:
                'el primer cloro orienta orto/para; se separa el isómero para, mayoritario y fácil de purificar por cristalización gracias a su punto de fusión más alto',
            },
            {
              etiqueta: 'c) p-bromonitrobenceno',
              valor: 'Bromar primero, nitrar después',
              detalle: 'el Br orienta orto/para y se toma el isómero para',
            },
            {
              etiqueta: 'd) ácido m-bromobencenosulfónico',
              valor: 'Sulfonar primero, bromar después',
              detalle: 'el –SO₃H orienta meta, que es justo lo que se busca',
            },
            {
              etiqueta: 'e) ácido p-bromobencenosulfónico',
              valor: 'Bromar primero, sulfonar después',
              detalle: 'ahora dirige el Br, que es orto/para: se toma el para',
            },
          ],
        },
        {
          tipo: 'contraste',
          titulo: 'Los mismos reactivos, el orden invertido',
          lados: [
            {
              titulo: 'Sulfonar → bromar da meta',
              items: ['d) ácido m-bromobencenosulfónico', 'dirige el –SO₃H, desactivador meta'],
              nota: 'El primero en entrar impone la posición del segundo',
            },
            {
              titulo: 'Bromar → sulfonar da para',
              items: ['e) ácido p-bromobencenosulfónico', 'dirige el Br, orto/para'],
              nota: 'Mismo par de reactivos, producto distinto: el orden no es un detalle de procedimiento',
            },
          ],
        },
      ],
    },
    {
      n: 6,
      parte: P3,
      titulo: 'Ordenar las tres reacciones por velocidad',
      enunciado: 'Ordenar de mayor a menor velocidad las tres alquilaciones propuestas.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué le pasa al anillo en cada caso',
          items: [
            {
              etiqueta: 'a)',
              valor: 'Anilina + C₂H₅Cl/AlCl₃ — muy lenta',
              detalle:
                'el –NH₂ sería un activador fuerte, pero el AlCl₃ se acompleja con su par libre y lo convierte en un grupo tipo amonio, fuertemente desactivador. Es uno de los límites clásicos de Friedel-Crafts: no funciona sobre anilinas libres',
            },
            {
              etiqueta: 'b)',
              valor: 'Benzaldehído + C₂H₅OH/BF₃ — lenta',
              detalle:
                'el –CHO desactiva el anillo y orienta meta; Friedel-Crafts sobre anillos con grupos carbonílicos va mal, aunque no tanto como en (a)',
            },
            {
              etiqueta: 'c)',
              valor: 'Tolueno + H₂C=CH₂/HF — rápida',
              detalle: 'el –CH₃ activa el anillo, que es la situación favorable para una alquilación',
            },
          ],
        },
        {
          tipo: 'clave',
          texto: 'Respuesta: (d) — el orden es c > b > a',
        },
        {
          tipo: 'nota',
          texto:
            'El caso (a) es el que decide la pregunta y es contraintuitivo: la anilina figura en todas las tablas como uno de los anillos más activados, pero con AlCl₃ en el medio deja de serlo. Un sustituyente no se juzga aislado, sino junto al reactivo con el que va a convivir.',
        },
      ],
    },
  ],
};
