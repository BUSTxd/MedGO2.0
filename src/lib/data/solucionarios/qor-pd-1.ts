import type { Solucionario } from './types';

/**
 * PD01 — Estructura molecular y propiedades.
 * El enunciado (con los dibujos de orbitales que las respuestas referencian)
 * es el mismo PDF del resumen de la práctica: `qor-pd-1`.
 */
export const qorPd1: Solucionario = {
  id: 'qor-pd-1',
  pdfId: 'qor-pd-1',
  titulo: 'PD01 — Estructura molecular y propiedades',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Diagramas de orbitales del doble y del triple enlace C–C',
      enunciado:
        'Identificar cada característica estructural A–E señalada con flechas con el comentario a–e que le corresponda.',
      bloques: [
        {
          tipo: 'mapeo',
          titulo: 'Dibujo 1 — enlace doble, carbonos sp²',
          items: [
            {
              marca: 'A',
              senala:
                'la línea que conecta los lóbulos sombreados superiores (el traslape lateral de los orbitales p)',
              conclusion:
                '(a) representa el traslape lateral de dos orbitales p para generar un enlace π',
            },
            {
              marca: 'B',
              senala:
                'el lóbulo blanco que sobresale hacia afuera (el orbital que apuntaría hacia un H)',
              conclusion: '(e) representa un orbital híbrido sp²',
            },
            {
              marca: 'C',
              senala: 'el óvalo central entre los dos carbonos',
              conclusion:
                '(d) representa el solapamiento a lo largo del eje internuclear de dos orbitales híbridos sp² para generar un enlace σ',
            },
          ],
        },
        {
          tipo: 'mapeo',
          titulo: 'Dibujo 2 — enlace triple, carbonos sp',
          items: [
            {
              marca: 'D',
              senala:
                'el lóbulo blanco exterior (el híbrido que no participa en el triple enlace)',
              conclusion: '(b) representa un orbital híbrido sp',
            },
            {
              marca: 'E',
              senala: 'el óvalo central entre los carbonos',
              conclusion:
                '(c) representa el traslape a lo largo del eje internuclear de dos orbitales híbridos para generar un enlace σ',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'La lógica de fondo',
          texto:
            'Un doble enlace usa carbonos sp²: 1 σ desde sp²–sp² y 1 π desde el traslape lateral p–p. Un triple enlace usa carbonos sp: 1 σ desde sp–sp y 2 π desde dos pares p–p perpendiculares entre sí.',
        },
      ],
    },
    {
      n: 2,
      titulo: 'Formaldehído (H₂C=O)',
      enunciado:
        'Contar enlaces σ y π, estimar el ángulo H–C–H e identificar pares enlazantes y no enlazantes en el diagrama.',
      bloques: [
        {
          tipo: 'datos',
          items: [
            {
              etiqueta: 'a)',
              valor: '3 enlaces σ',
              detalle: '2 enlaces C–H + 1 enlace σ C–O',
            },
            {
              etiqueta: 'b)',
              valor: '1 enlace π',
              detalle: 'el enlace π del doble enlace C=O',
            },
            {
              etiqueta: 'c)',
              valor: 'Ángulo H–C–H ≈ 120°',
              detalle:
                'el carbono es sp², geometría trigonal plana; experimentalmente es ~116–117°, muy cercano al ideal',
            },
          ],
        },
        {
          tipo: 'contraste',
          etiqueta: 'd)',
          lados: [
            {
              titulo: 'Pares enlazantes',
              items: [
                'Los dos traslapes C–H',
                'El óvalo central C–O (enlace σ)',
                'Los lóbulos sombreados arriba y abajo (enlace π)',
              ],
            },
            {
              titulo: 'Pares no enlazantes',
              items: [
                'Los dos lóbulos blancos que salen del oxígeno hacia la derecha, arriba y abajo',
              ],
              nota: 'Son los 2 pares libres del O, alojados en orbitales híbridos sp²: el oxígeno también es sp² al estar doblemente enlazado.',
            },
          ],
        },
      ],
    },
    {
      n: 3,
      titulo: 'Hibridación a partir de los diagramas',
      enunciado:
        'Deducir la hibridación de cada átomo sabiendo que lo sombreado es un orbital híbrido y lo blanco un orbital p puro.',
      bloques: [
        {
          tipo: 'datos',
          items: [
            {
              etiqueta: 'N',
              valor: 'sp',
              detalle:
                '2 lóbulos sombreados + 2 lóbulos p sin sombrear (uno por cada p, casi paralelos)',
            },
            {
              etiqueta: 'C',
              valor: 'sp²',
              detalle:
                '3 lóbulos sombreados en disposición trigonal + 1 orbital p sin hibridar (arriba/abajo)',
            },
            {
              etiqueta: 'O',
              valor: 'sp³',
              detalle:
                '3 lóbulos sombreados visibles en arreglo tetraédrico (el 4.º queda oculto detrás del átomo) y ningún orbital p libre',
            },
          ],
        },
      ],
    },
    {
      n: 4,
      titulo: 'Geometrías moleculares',
      enunciado:
        'Indicar pares enlazantes y libres, hibridación y geometría de cada especie.',
      bloques: [
        {
          tipo: 'tabla',
          encabezados: ['Especie', 'Enlazantes / libres', 'Hibridación', 'Geometría'],
          filas: [
            ['a) NH₄⁺', '4 / 0', 'sp³', 'Tetraédrica'],
            ['b) B(CH₃)₃', '3 / 0 — el B no tiene par libre', 'sp²', 'Trigonal plana'],
            ['c) P(CH₃)₃', '3 / 1', 'sp³', 'Piramidal'],
            ['d) H₃O⁺', '3 / 1', 'sp³', 'Piramidal'],
            ['e) NH₂NH₂', '3 / 1 en cada N', 'sp³ (c/u)', 'Piramidal en cada nitrógeno'],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El boro es la excepción del grupo: al no tener par libre, sus tres enlaces se reparten en un plano (sp², 120°). En el resto, ese par libre «empuja» y convierte la trigonal plana en piramidal.',
        },
      ],
    },
    {
      n: 5,
      titulo: 'Representación Z–X≡Y (tipo HCN)',
      enunciado: 'Señalar la afirmación incorrecta sobre la especie representada.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Analizando el dibujo: Z se traslapa con un lóbulo blanco de X (enlace s–sp, típico de H); X≡Y muestra 1 σ (óvalo central, sp–sp) + 2 π (los pares de lóbulos gris claro y gris oscuro); Y tiene un lóbulo blanco libre (par no enlazante) hacia afuera. Todo coherente con Z = H, X = C, Y = N: cianuro de hidrógeno.',
        },
        {
          tipo: 'opciones',
          items: [
            { letra: 'a', texto: 'Calza con H–C≡N', esRespuesta: false, veredicto: 'Cierto' },
            {
              letra: 'b',
              texto: 'El H solo usa su orbital 1s puro, no hibrida',
              esRespuesta: false,
              veredicto: 'Cierto',
            },
            {
              letra: 'c',
              texto: 'El N forma 3 enlaces (el triple enlace), por lo tanto su valencia es 3',
              esRespuesta: false,
              veredicto: 'Cierto',
            },
            {
              letra: 'd',
              texto:
                'La geometría de la molécula la determinan los orbitales p — falso: la fija la disposición de los orbitales híbridos (el esqueleto σ); los p solo generan los enlaces π adicionales sin cambiar los ángulos ya establecidos',
              esRespuesta: true,
              veredicto: 'Falso',
            },
            { letra: 'e', texto: 'X e Y son ambos sp', esRespuesta: false, veredicto: 'Cierto' },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: d)' },
      ],
    },
    {
      n: 6,
      titulo: 'Reactividad del bencino (C₆H₄)',
      enunciado: 'Explicar por qué el bencino es tan reactivo.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'El bencino tiene un «triple enlace» forzado dentro del anillo bencénico. Un triple enlace normal exige geometría lineal (~180°, carbonos sp), pero el anillo de 6 miembros obliga a esos carbonos a mantener un ángulo cercano a 120°.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Esto genera una tensión angular enorme, y el enlace π adicional (perpendicular al sistema aromático) se forma por el traslape de orbitales mal alineados — no son p puros y paralelos como en un alquino normal —, por lo que es un traslape pobre y un enlace muy débil.',
        },
        {
          tipo: 'nota',
          texto:
            'Tensión de anillo + enlace débil = especie de altísima energía. Por eso el bencino reacciona vigorosamente, como electrófilo o dienófilo, con lo primero que encuentra para aliviar esa tensión.',
        },
      ],
    },
    {
      n: 7,
      titulo: 'Geometrías de CH₃Cl, H₂C=O y H–C≡N',
      enunciado: 'Elegir la afirmación correcta sobre las geometrías de A, B y C.',
      bloques: [
        {
          tipo: 'datos',
          items: [
            { etiqueta: 'A', valor: 'Tetraédrica', detalle: 'CH₃Cl — carbono sp³' },
            { etiqueta: 'B', valor: 'Trigonal plana', detalle: 'formaldehído — carbono sp²' },
            { etiqueta: 'C', valor: 'Lineal', detalle: 'HCN — carbono sp' },
          ],
        },
        {
          tipo: 'clave',
          texto: 'Respuesta: a) «La molécula B es trigonal plana mientras que la C es lineal.»',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Excitación, hibridación, valencia y geometría',
      enunciado: 'Relacionar cada concepto con lo que explica.',
      bloques: [
        {
          tipo: 'datos',
          items: [
            {
              etiqueta: 'Excitación',
              valor: 'Justifica la valencia',
              detalle:
                'la promoción electrónica explica por qué un átomo forma más enlaces de los que su estado basal sugiere',
            },
            {
              etiqueta: 'Hibridación',
              valor: 'Justifica la geometría',
              detalle:
                'la mezcla de orbitales s y p explica los ángulos y la disposición espacial de los enlaces',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Respuesta: d) «La excitación justifica la valencia de los átomos y la hibridación la geometría de las moléculas.»',
        },
      ],
    },
    {
      n: 9,
      titulo: 'Análisis de las cinco especies (I)–(V)',
      enunciado: 'Señalar la afirmación correcta comparando hibridaciones y pares libres.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué es cada especie',
          items: [
            {
              etiqueta: '(I)',
              valor: 'N sp³',
              detalle: '[CH₃CH₂NH]⁻ — N con 2 enlaces + 2 pares libres',
            },
            {
              etiqueta: '(II)',
              valor: 'N sp²',
              detalle:
                '2H-pirrol — tiene un enlace N=C (imina cíclica); su par libre queda en un orbital sp², en el plano, fuera del sistema π',
            },
            { etiqueta: '(III)', valor: 'S sp³', detalle: 'CH₃CH₂SH — 2 pares libres sp³' },
            {
              etiqueta: '(IV)',
              valor: 'C y S sp',
              detalle:
                '[CH₃C≡S]⁺ — análogo al catión acilio pero con azufre; el S tiene 1 par libre en un orbital sp',
            },
            {
              etiqueta: '(V)',
              valor: 'N sp',
              detalle:
                '[H₂C=N=CHCH₃]⁺ — N central tipo aleno (dos dobles enlaces acumulados); usa TODOS sus electrones de valencia en enlaces, sin par libre',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'El N de (II) y el de (I) alojan su par libre en el mismo tipo de orbital — no: (II) es sp² y (I) es sp³',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto: 'En (V) el N tiene un par libre — no tiene ninguno',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                'El orbital sp del S en (IV) es mayor que el sp³ en (III) — al revés: más carácter s lo hace más contraído, no mayor',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'El carbono metílico (sp³) y el azufre (sp) en (IV) tienen hibridación diferente',
              esRespuesta: true,
              veredicto: 'Cierto',
            },
            {
              letra: 'e',
              texto:
                'Los H del CH₂ del anillo en (II) están en el plano — no: ese CH₂ es sp³, así que salen del plano',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: d)' },
      ],
    },
    {
      n: 10,
      titulo: 'Hibridación de los heteroátomos de la estructura',
      enunciado: 'Indicar la hibridación de cada heteroátomo y dónde alojan sus pares libres.',
      bloques: [
        {
          tipo: 'tabla',
          encabezados: ['Heteroátomo', 'Hibridación', 'Pares libres'],
          filas: [
            [
              'N del anillo de piridina',
              'sp²',
              '1 par libre en orbital sp², en el plano y fuera del sistema aromático — por eso la piridina es básica',
            ],
            ['O tipo éter (Ar–O–CH)', 'sp³', '2 pares libres en orbitales sp³'],
            ['N de la amina secundaria (–NH–CH₃)', 'sp³', '1 par libre en orbital sp³'],
            [
              'N de la amida (–C(=O)NH₂)',
              'sp² por resonancia con el carbonilo',
              '1 par libre deslocalizado en un orbital p, no en un híbrido → carácter parcial de doble enlace C–N',
            ],
            ['O del carbonilo (C=O)', 'sp²', '2 pares libres en orbitales sp²'],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El caso que hay que llevarse',
          texto:
            'El N de la amida parece tetraédrico a primera vista (3 enlaces σ + 1 par libre = «aparente sp³»), pero en realidad es sp²: su par libre se conjuga con el carbonilo. Esa resonancia amídica explica la planaridad y la rotación restringida del enlace C–N, algo decisivo en péptidos y proteínas.',
        },
      ],
    },
  ],
};
