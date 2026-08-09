import type { Solucionario } from './types';

/**
 * PD02 — Deslocalización y resonancia.
 * El enunciado (con los carbocationes, heterociclos y estructuras que las
 * respuestas referencian) es el PDF de la práctica: `qor-pd-2`.
 */
export const qorPd2: Solucionario = {
  id: 'qor-pd-2',
  pdfId: 'qor-pd-2',
  titulo: 'PD02 — Deslocalización y resonancia',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Carbocationes con sustituyentes O, N y F',
      enunciado: 'Para los siguientes carbocationes, marcar la alternativa CORRECTA.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Los cuatro cationes son cadenas dienílicas (tipo pentadienilo) con un heteroátomo dador (O, N o F) en un extremo y la carga + dibujada sobre un carbono alejado de él. La clave es la resonancia vinilóloga: el par libre del heteroátomo se transmite a través del sistema π conjugado hasta el carbono cargado.',
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'El enlace C–N tiene menor carácter de doble que el C–F — es al revés: el N es mejor dador π que el F, que por su electronegatividad retiene su par libre, así que el C–N tiene mayor carácter de doble enlace',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                '(IV) presenta mayor estabilización por resonancia — (IV) no tiene heteroátomo dador en el extremo, así que le falta justamente la estabilización extra que sí tienen (I), (II) y (III)',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                'La estructura mostrada en (I) no es la más contribuyente — la dibujada pone la carga + en el carbono terminal, lejos del oxígeno; la forma resonante que más contribuye es la que dona el par libre del O y deja la carga sobre el propio oxígeno (oxocarbenio), con todos los átomos con el octeto completo',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
            {
              letra: 'd',
              texto:
                'El doble enlace C–C de (III) es el de menor energía de enlace — no es el concepto que evalúa la pregunta y no se sostiene frente a (c)',
              esRespuesta: false,
              veredicto: 'Descartada',
            },
            {
              letra: 'e',
              texto:
                'Los dos enlaces C–O de (I) son más largos que el C–O del butanol — por resonancia el C–O gana carácter parcial de doble enlace, así que se acorta, no se alarga',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (c)' },
      ],
    },
    {
      n: 2,
      titulo: 'Moléculas con azufre y nitrógeno',
      enunciado:
        'En relación a los siguientes compuestos y los enlaces indicados, señalar qué es cierto.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué es cada molécula',
          items: [
            {
              etiqueta: '(I)',
              valor: 'Tiazol — N piridínico, sin conjugar',
              detalle:
                'su par libre queda en un orbital sp², en el plano del anillo y perpendicular al sistema π: geométricamente no puede solaparse, así que no se deslocaliza',
            },
            {
              etiqueta: '(II)',
              valor: 'H₃C–S–N=CH–CH₃ — sí conjuga',
              detalle:
                'el N es de tipo imina (sp²), pero junto al S el sistema sí se deslocaliza: el par libre del azufre puede empujar formando S=N y desplazando densidad hacia el carbono',
            },
            {
              etiqueta: '(III)',
              valor: 'Isotiocianato (–N=C=S) — sí conjuga',
              detalle:
                'sistema acumulado con resonancia genuina entre N⁻–C≡S⁺ ↔ N=C=S ↔ N⁺≡C–S⁻; el N participa de la deslocalización',
            },
            {
              etiqueta: '(IV)',
              valor: 'Tiofenol (Ar–S–H) — sin nitrógeno',
              detalle:
                'el anillo aromático tiene resonancia propia, pero no involucra a ningún nitrógeno',
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'El tiazol es la única molécula con nitrógeno cuyo par libre queda «atrapado» en un orbital sp² sin poder conjugarse, exactamente como en la piridina. En (II) y (III) el N sí forma parte de sistemas deslocalizados, y (IV) ni siquiera tiene nitrógeno.',
        },
        {
          tipo: 'nota',
          texto:
            'Las otras alternativas fallan al comparar hibridaciones del azufre, energías de disociación o libertad de rotación: ninguna de esas comparaciones sigue el patrón que proponen.',
        },
        {
          tipo: 'clave',
          texto:
            'Respuesta: (e) — solo en la primera molécula el par libre del nitrógeno está en un orbital híbrido sp²',
        },
      ],
    },
    {
      n: 3,
      titulo: 'Anillo tipo piridina-N-óxido (vasodilatador)',
      enunciado: 'Señalar la proposición FALSA.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Es un anillo aromático con un grupo N-óxido: el N(I) unido a O⁻ con carga formal positiva, y un segundo nitrógeno N(II) en el anillo, de tipo piridínico, que actúa de espectador.',
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'Hay 5 estructuras resonantes contribuyentes — encaja con el patrón de un N-óxido aromático: la forma base N⁺–O⁻ más las que desplazan la carga negativa hacia los carbonos orto y para',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'b',
              texto:
                'Solo dos carbonos del anillo portan carga negativa — la deslocalización del N-óxido la reparte entre tres posiciones: las dos orto y la para respecto al nitrógeno',
              esRespuesta: true,
              veredicto: 'Falsa',
            },
            {
              letra: 'c',
              texto:
                'El nitrógeno (I) porta carga positiva en todas las estructuras resonantes — como en el grupo nitro, esa carga + queda fija; lo que se mueve es la negativa, entre el O y los carbonos del anillo',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'd',
              texto:
                'El nitrógeno (II) no porta densidad de carga en el híbrido — la deslocalización fluye hacia los carbonos orto y para, no hacia el segundo nitrógeno, que queda fuera del camino de conjugación',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'e',
              texto:
                'Los dos N y el O tienen la misma hibridación — para que exista la resonancia del punto (a), el oxígeno del N-óxido debe ser sp², igual que los dos nitrógenos aromáticos, y no sp³',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta (la proposición FALSA): (b)' },
      ],
    },
    {
      n: 4,
      titulo: 'Dienona conjugada, éster propargílico y tipo salbutamol',
      enunciado: 'Señalar la afirmación correcta sobre las tres moléculas.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué es cada molécula',
          items: [
            {
              etiqueta: '(I)',
              valor: 'Ciclohexadienona',
              detalle: 'cruzadamente conjugada, con un ácido carboxílico exocíclico',
            },
            {
              etiqueta: '(II)',
              valor: 'Ph–C≡C–C(=O)–O–CH₃',
              detalle: 'éster propargílico aromático',
            },
            {
              etiqueta: '(III)',
              valor: 'Estructura tipo salbutamol',
              detalle:
                'catecol + centro estereogénico con OH + amina secundaria con t-butilo; tiene carbonos sp³, así que no puede ser plana',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'Todos los átomos de las tres moléculas están en el mismo plano — (III) tiene centros sp³, es imposible que sea plana',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                'Todos los átomos (salvo H) de (II) participan de la deslocalización — el carbono del –OCH₃ es sp³ y está unido solo por enlaces σ: sin orbital p disponible, no se conjuga',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                'Todos los oxígenos de (I) aportan un par libre a la deslocalización — los de tipo carbonilo reciben densidad electrónica en las formas resonantes, vía su enlace π; no aportan su par libre como haría un dador tipo éter o amina',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'Ningún par libre participa de la deslocalización en (III) — los dos oxígenos fenólicos del catecol sí donan su par libre al anillo, igual que en el fenol',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                'Todos los oxígenos de (II) tienen hibridación sp² — el carbonílico lo es porque necesita un orbital p para el enlace π del C=O, y el del éster también, porque uno de sus pares libres se conjuga con el carbonilo y eso exige que esté en un p puro',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (e)' },
      ],
    },
    {
      n: 5,
      titulo: 'Hibridación y resonancia en naproxeno y acetaminofén',
      enunciado:
        'Indicar la hibridación de cada fragmento y si participa o no en la resonancia.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Naproxeno — ácido 2-(6-metoxinaftalen-2-il)propanoico',
          encabezados: ['Fragmento', 'Hibridación', '¿Participa en resonancia?'],
          filas: [
            ['Carbonos del naftaleno', 'sp²', 'Sí — sistema aromático extendido'],
            [
              'Oxígeno del metoxilo (–OCH₃)',
              'sp²',
              'Sí — dona un par libre al anillo, como el anisol, activándolo',
            ],
            ['Carbono metílico del –OCH₃', 'sp³', 'No — solo enlaces σ'],
            ['Carbono estereogénico (CH con CH₃ y COOH)', 'sp³', 'No'],
            ['Metilo del centro estereogénico', 'sp³', 'No'],
            ['Carbono del carboxilo (–COOH)', 'sp²', 'Sí'],
            [
              'Los dos oxígenos del –COOH',
              'sp²',
              'Sí — resonancia clásica del carboxilo: el OH dona, el C=O recibe',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El naproxeno sí presenta resonancia, y en dos frentes independientes: el sistema aromático (con el metoxilo aportando densidad) y el grupo carboxílico.',
        },
        {
          tipo: 'tabla',
          titulo: 'Acetaminofén / paracetamol — 4-hidroxiacetanilida',
          encabezados: ['Fragmento', 'Hibridación', '¿Participa en resonancia?'],
          filas: [
            ['Carbonos del anillo aromático', 'sp²', 'Sí'],
            [
              'Oxígeno fenólico (–OH)',
              'sp²',
              'Sí — dona su par libre al anillo, como en el fenol',
            ],
            [
              'Nitrógeno de la amida (–NH–)',
              'sp²',
              'Sí — dona su par libre al carbonilo (resonancia de amida)',
            ],
            ['Carbono carbonílico (C=O)', 'sp²', 'Sí'],
            ['Oxígeno carbonílico', 'sp²', 'Sí — recibe densidad en las formas resonantes'],
            ['Carbono metílico de la amida', 'sp³', 'No'],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Por qué el paracetamol es el ejemplo bonito',
          texto:
            'Es conjugación cruzada en posición para: el –OH dona hacia el anillo por un lado y el N de la amida dona hacia el carbonilo por el otro, con el anillo aromático haciendo de puente. Por eso ambos grupos se «sienten» electrónicamente — y es la base de que su radical fenoxilo quede estabilizado.',
        },
      ],
    },
    {
      n: 6,
      titulo: 'Energía de enlace y ángulos en una cadena con amina, alqueno, cetona y alquino',
      enunciado:
        'a) Ordenar los enlaces marcados por energía de disociación y longitud. b) Explicar cómo influyen los pares libres y los enlaces múltiples sobre los ángulos.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'La cadena lleva, en orden: una amina primaria, un alqueno (C=C), un grupo cetona (C=O) y un alquino terminal (C≡C–H). Los enlaces marcados son un C–H vinílico, un C–H alquínico terminal y dos C–C sencillos alfa al carbonilo, uno hacia el lado alílico y otro hacia el propargílico.',
        },
        {
          tipo: 'nota',
          titulo: 'Principio guía',
          texto:
            'A mayor carácter s del carbono que forma el enlace, más corto y más fuerte es ese enlace: sp > sp² > sp³.',
        },
        {
          tipo: 'datos',
          titulo: 'a) De más fuerte y corto a más débil y largo',
          items: [
            {
              etiqueta: '1.º',
              valor: 'C–H del alquino terminal',
              detalle:
                'carbono sp, ~50 % de carácter s: es el enlace C–H más fuerte de toda la molécula',
            },
            {
              etiqueta: '2.º',
              valor: 'C–H vinílico',
              detalle:
                'carbono sp², ~33 % de carácter s: más fuerte y corto que un C–H sp³ típico, pero por debajo del alquínico',
            },
            {
              etiqueta: '3.º',
              valor: 'Los dos C–C alfa al carbonilo',
              detalle:
                'unen un carbono sp³ con el sp² del carbonilo, y al romperse homolíticamente generan radicales estabilizados por resonancia (alílico + α-carbonílico uno, propargílico + α-carbonílico el otro): cuanto más estable es el radical resultante, más débil es el enlace que lo genera',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Orden: C–H (alquino, sp) > C–H (vinílico, sp²) > C–C α-carbonilo lado alílico ≈ C–C α-carbonilo lado propargílico',
        },
        {
          tipo: 'contraste',
          etiqueta: 'b)',
          titulo: 'Qué comprime los ángulos por debajo del valor ideal',
          lados: [
            {
              titulo: 'Pares libres',
              items: [
                'Están sujetos a un solo núcleo, así que se extienden más que un par enlazante',
                'Ocupan más espacio angular y empujan a los enlaces vecinos entre sí',
              ],
              nota: 'En el –NH₂ de la amina primaria, el ángulo H–N–H cae por debajo de 109,5°: el par libre del N comprime los dos enlaces N–H.',
            },
            {
              titulo: 'Enlaces múltiples',
              items: [
                'Un doble o triple enlace concentra más densidad electrónica que uno sencillo',
                'También ocupa más espacio y comprime los ángulos adyacentes',
              ],
              nota: 'En el carbono del C=O, el ángulo entre los dos C–C alfa suele quedar por debajo de 120°, porque el carbonilo los empuja entre sí.',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El alquino se libra de esta desviación: su geometría es lineal por definición (180°, sp), así que no hay competencia angular posible.',
        },
      ],
    },
    {
      n: 7,
      titulo: 'Orbitales híbridos',
      enunciado: 'a) Cómo se forman. b) Sus características. c) Su orden de energía.',
      bloques: [
        {
          tipo: 'parrafo',
          titulo: 'a) Cómo se forman',
          texto:
            'Por combinación lineal (matemática) de orbitales atómicos puros del mismo átomo y de energía comparable —un orbital s y uno o más orbitales p— para generar un conjunto nuevo de orbitales equivalentes entre sí, con otra geometría y mejor orientados para formar enlaces σ. El número de híbridos que resultan es siempre igual al de orbitales atómicos que se combinaron: 1s + 3p → 4 orbitales sp³.',
        },
        {
          tipo: 'datos',
          titulo: 'b) Características más relevantes',
          items: [
            {
              etiqueta: '1',
              valor: 'Equivalentes entre sí',
              detalle: 'misma energía y misma forma (degenerados)',
            },
            {
              etiqueta: '2',
              valor: 'Direccionales',
              detalle:
                'un lóbulo grande apunta al átomo con el que enlazan, lo que permite mejor solapamiento: enlaces σ más fuertes que los formados por orbitales p puros',
            },
            {
              etiqueta: '3',
              valor: 'Predicen la geometría molecular',
              detalle: 'sp³ → tetraédrica, sp² → trigonal plana, sp → lineal',
            },
            {
              etiqueta: '4',
              valor: 'El % de carácter s manda',
              detalle:
                'a mayor carácter s, el orbital se comporta de forma más electronegativa y los enlaces que forma son más cortos y fuertes',
            },
            {
              etiqueta: '5',
              valor: 'Los p que no se hibridan quedan libres',
              detalle: 'y son justamente los que forman los enlaces π',
            },
          ],
        },
        { tipo: 'clave', texto: 'c) Orden de energía: s < sp < sp² < sp³ < p puro' },
        {
          tipo: 'nota',
          texto:
            'La lógica: cuanto mayor es el carácter s de un híbrido, más cerca queda energéticamente del orbital s puro, que es el de menor energía de todos.',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Enol, acroleína, propeno, catión alilo y estireno',
      enunciado: 'Señalar cuáles de las proposiciones (i)–(v) son verdaderas.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Las cinco especies',
          items: [
            { etiqueta: '(I)', valor: 'Enol', detalle: 'un C=C con un –OH sobre uno de sus carbonos' },
            {
              etiqueta: '(II)',
              valor: 'Acroleína',
              detalle: 'enal α,β-insaturado: C=C conjugado con C=O',
            },
            {
              etiqueta: '(III)',
              valor: 'Propeno',
              detalle: 'alqueno simple, sin nada con lo que conjugarse',
            },
            {
              etiqueta: '(IV)',
              valor: 'Catión alilo',
              detalle: 'carga + repartida entre los dos carbonos terminales',
            },
            {
              etiqueta: '(V)',
              valor: 'Estireno',
              detalle: 'vinilo conjugado con el anillo aromático completo',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'i',
              texto:
                'El C=C de (I) es más corto que el de (III) — en el enol el par libre del OH se conjuga con el C=C (forma resonante O⁺=CH–CH₂⁻), lo que le da carácter parcial de enlace sencillo: es más largo o igual que el de un alqueno aislado, nunca más corto',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'ii',
              texto:
                '(V) es la estructura más estable de todas — tiene el sistema conjugado más extendido, el vinilo con todo el anillo aromático, y por tanto la mayor estabilización por resonancia de las cinco',
              esRespuesta: true,
              veredicto: 'Verdadero',
            },
            {
              letra: 'iii',
              texto:
                'Los C=C de todas las estructuras participan en resonancia — el propeno (III) es un alqueno simple: el metilo no tiene par libre ni orbital π, así que no hay resonancia posible',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'iv',
              texto:
                'La resonancia en (IV) concentra la carga positiva — es justo al revés: la reparte entre los dos carbonos terminales, y esa dispersión es la que estabiliza al catión',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'v',
              texto:
                'El C–O de (II) es más corto que el de la acetona — en la acroleína el C=O está conjugado con el C=C vecino, lo que le da carácter parcial de enlace sencillo y lo alarga respecto al C=O aislado de la acetona',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: solo (ii) es verdadera' },
      ],
    },
    {
      n: 9,
      titulo: '¿Resonancia o no?',
      enunciado: 'Decidir en cada par si las dos estructuras son formas resonantes.',
      bloques: [
        {
          tipo: 'nota',
          titulo: 'Regla de oro',
          texto:
            'Son formas resonantes solo si ningún átomo cambia de posición: lo único que se mueve son los electrones. Si un H salta de un átomo a otro, es un tautómero, no una forma resonante.',
        },
        {
          tipo: 'tabla',
          encabezados: ['Par', '¿Resonancia?', 'Razón'],
          filas: [
            [
              'a) H–C≡N–Ö: / H–C=N=Ö:',
              'Sí',
              'Misma conectividad H–C–N–O; solo cambian el orden de enlace y la ubicación de los pares libres',
            ],
            [
              'b) Las dos formas del SO₃',
              'Sí',
              'Mismo esqueleto, S central con 3 O; solo se desplaza cuál oxígeno lleva el doble enlace (las tres formas equivalentes clásicas)',
            ],
            [
              'c) Enal / enolato con un H desplazado',
              'No',
              'Un H cambia de átomo: eso es un tautómero, con ruptura y formación reales de enlaces σ',
            ],
            [
              'd) Las dos formas del BF₃',
              'Sí',
              'Mismo esqueleto B con 3 F; la segunda muestra un F donando un par libre para formar un B=F parcial — minoritaria pero válida, y explica que los enlaces B–F sean más cortos de lo esperado',
            ],
            [
              'e) Enal con un H reubicado',
              'No',
              'Mismo motivo que (c): si cambia la posición de un H, ya no es la misma molécula',
            ],
            [
              'f) Ciclohexenonas con el doble enlace en distinta posición del anillo',
              'No',
              'Si el doble enlace pasa a una posición no conjugada con el carbonilo, son isómeros de posición distintos, no formas resonantes de la misma molécula',
            ],
            [
              'g) CH₂=C=O (cetena) / H–C≡C–OH (etinol)',
              'No',
              'Misma fórmula molecular pero conectividad completamente distinta: son isómeros constitucionales, compuestos diferentes',
            ],
          ],
        },
      ],
    },
    {
      n: 10,
      titulo: '¿En cuál el nitrógeno NO forma parte de la deslocalización?',
      enunciado: 'Identificar la especie donde el N queda fuera del sistema deslocalizado.',
      bloques: [
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'Anilinio (Ph–NH₃⁺) — el N está protonado, con 4 enlaces σ y ningún par libre: es sp³ y no le queda ningún orbital p con el que conjugarse. Queda completamente desconectado del sistema π aromático',
              esRespuesta: true,
              veredicto: 'No participa',
            },
            {
              letra: 'b',
              texto:
                'Piridinio (anillo protonado en el N) — aunque su par libre ya está usado en el enlace con el H⁺, el N sigue siendo sp² y su orbital p sigue formando parte del anillo aromático continuo, igual que en la piridina neutra',
              esRespuesta: false,
              veredicto: 'Sí participa',
            },
            {
              letra: 'c',
              texto:
                'Nitrilio conjugado con un alqueno del anillo — el N no tiene par libre, pero sus dos enlaces π del triple enlace sí se conjugan con el doble enlace vecino',
              esRespuesta: false,
              veredicto: 'Sí participa',
            },
            {
              letra: 'd',
              texto:
                'Ion iminio aromático, tipo Ph–N⁺(CH₃)=CH₂ — el N es sp² y conserva un orbital p por el que el anillo aromático empuja densidad electrónica (deslocalización push-pull)',
              esRespuesta: false,
              veredicto: 'Sí participa',
            },
            {
              letra: 'e',
              texto:
                'Sistema acumulado S=N=CH– — por definición, un sistema acumulado obliga al átomo central a estar plenamente conjugado con ambos lados',
              esRespuesta: false,
              veredicto: 'Sí participa',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (a)' },
      ],
    },
  ],
};
