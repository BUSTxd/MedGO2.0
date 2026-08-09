import type { Solucionario } from './types';

/**
 * PD04 — Fuerzas intermoleculares, punto de ebullición, fusión y solubilidad.
 * El enunciado (con las listas de compuestos, los valores a emparejar y los
 * pares a comparar) es el PDF de la práctica: `qor-pd-4`.
 */
export const qorPd4: Solucionario = {
  id: 'qor-pd-4',
  pdfId: 'qor-pd-4',
  titulo: 'PD04 — Fuerzas intermoleculares y propiedades físicas',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Emparejar cada compuesto con su punto de ebullición',
      enunciado:
        'Asignar a cada uno de los seis compuestos el punto de ebullición que le corresponde de la lista.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Lo primero que hay que notar es que los seis pesos moleculares son casi el mismo (58–62). Si el PM apenas cambia y los puntos de ebullición van de 0 a 118 °C, la explicación no puede estar en el peso: está en el tipo de fuerza intermolecular que hay que romper para pasar a fase gas.',
        },
        {
          tipo: 'tabla',
          titulo: 'Asignación compuesto a compuesto',
          encabezados: ['Compuesto', 'PM', 'Fuerza dominante', 'PE'],
          filas: [
            [
              'CH₃COOH (ácido acético)',
              '60',
              'Puente de H + dimerización (dos puentes simultáneos)',
              'e) 118,0 °C',
            ],
            ['CH₃CH₂CH₂CH₃ (butano)', '58', 'Solo London — molécula apolar', 'd) 0,0 °C'],
            ['CH₃CH₂CH₂OH (1-propanol)', '60', 'Puente de H por el –OH', 'c) 97,0 °C'],
            [
              'CH₃CH₂OCH₃ (metil etil éter)',
              '60',
              'Dipolo-dipolo — hay O, pero ningún H unido a él',
              'a) 10,8 °C',
            ],
            [
              'CH₃CH₂CH₂F (1-fluoropropano)',
              '62',
              'Dipolo-dipolo débil — el F está unido a C, no a H',
              'f) 3,0 °C',
            ],
            [
              'CH₃CH₂CH₂NH₂ (propilamina)',
              '59',
              'Puente de H por N–H, más débil que el del O',
              'b) 48,0 °C',
            ],
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Escala de fuerzas: London (butano) < dipolo-dipolo débil (fluoropropano) < dipolo-dipolo (éter) < puente de H con N (amina) < puente de H con O (alcohol) < puente de H + dimerización (ácido).',
        },
        {
          tipo: 'nota',
          titulo: 'La trampa del flúor',
          texto:
            'Que el flúor sea el átomo más electronegativo no basta: el puente de hidrógeno exige un H unido DIRECTAMENTE a N, O o F. En el 1-fluoropropano el F está unido a carbono y no hay ningún H sobre él, así que la molécula solo puede recurrir a dipolo-dipolo — de ahí su PE bajísimo (3 °C), casi el del butano. El mismo criterio explica por qué el éter, con oxígeno y todo, hierve a 10,8 °C.',
        },
      ],
    },
    {
      n: 2,
      titulo: 'Elegir el disolvente apropiado para cada compuesto',
      enunciado:
        'Asignar a cada compuesto el disolvente en el que se disolverá, justificando la elección.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            '«Semejante disuelve a semejante» resuelve tres de los cuatro casos; el cuarto no es una disolución sino una reacción ácido-base, que es justamente lo que la pregunta quiere que se distinga.',
        },
        {
          tipo: 'tabla',
          titulo: 'Compuesto → disolvente',
          encabezados: ['Compuesto', 'Naturaleza', 'Disolvente', 'Razón'],
          filas: [
            [
              'CH₃CH₂CH₂OH (1-propanol)',
              'Alcohol de cadena corta, muy polar',
              'c) H₂O',
              'Cadena corta + –OH: forma puente de H con el agua y es miscible',
            ],
            [
              'CH₃(CH₂)₅CH₂OH (1-heptanol)',
              'Alcohol de cadena larga (7 C)',
              'b) C₆H₅CH₃ (tolueno)',
              'La cola hidrocarbonada domina sobre el –OH: el carácter apolar manda y se disuelve mejor en un disolvente aromático',
            ],
            [
              'CH₃(CH₂)₂NHCH₃ (amina secundaria)',
              'Base orgánica — par libre sobre el N',
              'a) HCl(ac)',
              'No se disuelve: reacciona. El ácido protona el N y forma la sal de amonio, que sí es soluble en agua',
            ],
            [
              'CH₃(CH₂)₄CH₃ (hexano)',
              'Hidrocarburo apolar',
              'd) CH₃CH₂OCH₂CH₃ (éter etílico)',
              'Ambos apolares. No se disuelve en agua ni reacciona con el ácido, así que solo le queda el disolvente orgánico',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El heptanol frente al propanol muestra la regla práctica que reaparece en el ejercicio 7: a partir de unos 4–5 carbonos, la cadena hidrofóbica pesa más que el grupo –OH y el compuesto deja de comportarse como «polar».',
        },
      ],
    },
    {
      n: 3,
      titulo: 'Isómeros I, II y III: fusión, ebullición y solubilidad',
      enunciado:
        'Asignar a cada estructura su punto de fusión, su punto de ebullición y su solubilidad en agua.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué es cada estructura',
          items: [
            {
              etiqueta: 'I',
              valor: 'cis-2-penteno (Z) — PM 70',
              detalle: 'CH₃ y CH₂CH₃ del mismo lado del doble enlace',
            },
            {
              etiqueta: 'II',
              valor: 'trans-2-penteno (E) — PM 70',
              detalle: 'los mismos grupos, pero en lados opuestos',
            },
            {
              etiqueta: 'III',
              valor: 'but-2-en-1-ol (alcohol crotílico) — PM 72',
              detalle: 'CH₃–CH=CH–CH₂OH: el único de los tres con grupo –OH',
            },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Asignación de las tres propiedades',
          encabezados: ['', 'Punto de fusión', 'Punto de ebullición', 'Solubilidad en agua'],
          filas: [
            ['I (cis)', 'b) –151 °C', 'c) 37,0 °C', 'a) Poco soluble'],
            ['II (trans)', 'c) –140 °C', 'a) 36,3 °C', 'b) Insoluble'],
            ['III (alcohol)', 'a) –89,4 °C', 'b) 123,6 °C', 'c) 16,6 g/100 g H₂O'],
          ],
        },
        {
          tipo: 'contraste',
          titulo: 'Por qué el cis y el trans se separan en fusión pero no en ebullición',
          lados: [
            {
              titulo: 'Punto de ebullición — casi iguales',
              items: [
                'I: 37,0 °C · II: 36,3 °C',
                'ambos son alquenos con fuerzas de London',
                'el pequeño dipolo del cis apenas añade 0,7 °C',
              ],
              nota:
                'Hervir depende de la fuerza de atracción en el líquido, y ahí los dos isómeros son prácticamente equivalentes',
            },
            {
              titulo: 'Punto de fusión — el trans gana',
              items: [
                'II (trans): –140 °C funde más alto',
                'I (cis): –151 °C',
                'el trans es más simétrico y lineal',
              ],
              nota:
                'Fundir depende de lo bien que las moléculas encajen en la red cristalina, y la simetría del trans permite un empaquetamiento más compacto',
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'El alcohol III se separa de los dos alquenos en las tres propiedades por la misma causa: el puente de hidrógeno. Hierve a 123,6 °C (frente a ~37 °C) pese a tener un PM casi idéntico, funde más alto porque el puente ordena mejor el sólido, y es el único con solubilidad apreciable en agua. Entre los alquenos, el cis conserva un pequeño momento dipolar neto —sus dipolos de enlace no se cancelan por la geometría— y por eso queda «poco soluble», mientras que el trans, prácticamente simétrico y con dipolo neto casi nulo, es insoluble.',
        },
        {
          tipo: 'nota',
          texto:
            'Punto de fusión y punto de ebullición no siempre siguen la misma tendencia: el cis suele hervir algo más alto (es más polar) pero funde más bajo (empaqueta peor). Confundir ambos criterios es el error clásico en las preguntas cis/trans.',
        },
      ],
    },
    {
      n: 4,
      titulo: '¿Cuál de cada par tiene mayor punto de ebullición?',
      enunciado: 'Señalar en cada par el compuesto que hierve a mayor temperatura y explicar por qué.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Ganador de cada par',
          encabezados: ['Par', 'Hierve más alto', 'Razón'],
          filas: [
            [
              'a) propano vs. heptano',
              'Heptano',
              'Mayor PM y mucha más superficie de contacto → fuerzas de London más intensas',
            ],
            [
              'b) propano vs. dimetil éter',
              'Dimetil éter',
              'Es polar (dipolo-dipolo); el propano solo tiene London, con PM similar',
            ],
            [
              'c) etanol vs. dimetil éter',
              'Etanol',
              'Mismo PM (46), pero el etanol tiene un H sobre el O → puente de H; el éter no',
            ],
            [
              'd) etanol vs. 1-butanol',
              '1-Butanol',
              'Ambos forman puente de H, pero el butanol suma dos carbonos más de London',
            ],
            [
              'e) 1-butanol vs. terc-butanol',
              '1-Butanol (lineal)',
              'Mismo PM y ambos con puente de H, pero la ramificación del terc-butanol reduce el área de contacto',
            ],
            [
              'f) 1-propanol vs. propilamina',
              '1-Propanol',
              'El O es más electronegativo que el N: el puente O–H···O es más fuerte que el N–H···N',
            ],
            [
              'g) propilamina vs. trimetilamina',
              'Propilamina',
              'La amina terciaria no tiene ningún H sobre el N, así que no puede donar puente de H — se queda en dipolo-dipolo',
            ],
            [
              'h) 1-propanol vs. ácido acético',
              'Ácido acético',
              'El ácido forma dímeros con dos puentes de H simultáneos, más estables que el puente simple del alcohol',
            ],
            [
              'i) 1-cloropropano vs. ácido propanoico',
              'Ácido propanoico',
              'El cloruro solo tiene dipolo-dipolo (el Cl no forma puente de H); el ácido, puente de H y dimerización',
            ],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Los tres criterios, en orden de peso',
          texto:
            'Primero se compara el tipo de fuerza (London < dipolo-dipolo < puente de H < puente de H con dimerización). Solo si ambos compuestos empatan en tipo de fuerza se pasa al tamaño (más carbonos, más London) y, en último lugar, a la forma (a igual PM, lo ramificado hierve menos que lo lineal).',
        },
      ],
    },
    {
      n: 5,
      titulo: '¿Cuál de cada par tiene mayor punto de fusión?',
      enunciado: 'Señalar en cada par el compuesto que funde a mayor temperatura.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Fundir es romper una red cristalina, así que además de la intensidad de las fuerzas cuenta el empaquetamiento: la simetría y la regularidad de la molécula pesan más aquí que en la ebullición.',
        },
        {
          tipo: 'tabla',
          titulo: 'Ganador de cada par',
          encabezados: ['Par', 'Funde más alto', 'Razón'],
          filas: [
            [
              'a) pentano vs. hexano',
              'Hexano',
              'Cadena más larga → mayor PM, más London y mejor empaquetamiento',
            ],
            ['b) butano vs. pentano', 'Pentano', 'Mismo argumento: más carbonos, mayor punto de fusión'],
            [
              'c) 1,2-dibromoeteno cis vs. trans',
              'El isómero trans',
              'Más simétrico, encaja mejor en el sólido — aunque el cis, al ser polar, suele hervir más alto',
            ],
            [
              'd) butano vs. 1-propanol',
              '1-Propanol',
              'El puente de H ordena las moléculas en la red pese al PM similar',
            ],
            [
              'e) 1-butanol vs. ácido butanoico',
              'Ácido butanoico',
              'La dimerización y su geometría más plana y simétrica dan un cristal más compacto que el del alcohol',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El apartado c) es el recordatorio de que fusión y ebullición pueden ir en direcciones opuestas: en cis/trans, el trans gana en fusión (simetría) y el cis suele ganar en ebullición (polaridad).',
        },
      ],
    },
    {
      n: 6,
      titulo: 'Ordenar de menor a mayor punto de ebullición',
      enunciado: 'Ordenar cada grupo de compuestos según su punto de ebullición creciente.',
      bloques: [
        {
          tipo: 'clave',
          texto:
            'a) neopentano < 2,3-dimetilbutano < n-hexano < 2-metil-2-butanol < 1-hexanol',
        },
        {
          tipo: 'datos',
          titulo: 'a) Por qué ese orden',
          items: [
            {
              etiqueta: '1.º',
              valor: 'Neopentano, (CH₃)₄C',
              detalle:
                'la más ramificada y compacta, casi esférica: mínima área de contacto entre moléculas → el PE más bajo del grupo',
            },
            {
              etiqueta: '2.º',
              valor: '2,3-dimetilbutano',
              detalle:
                'algo ramificado: hierve por encima del neopentano pero por debajo de su isómero lineal',
            },
            {
              etiqueta: '3.º',
              valor: 'n-Hexano',
              detalle:
                'misma fórmula que el anterior, pero lineal: más superficie de contacto → más London',
            },
            {
              etiqueta: '4.º',
              valor: '2-Metil-2-butanol',
              detalle:
                'ya es alcohol y forma puente de H, pero al ser terciario y muy ramificado no llega al PE de un alcohol lineal comparable',
            },
            {
              etiqueta: '5.º',
              valor: '1-Hexanol',
              detalle:
                'combina cadena larga lineal y puente de H: el más alto, con amplio margen sobre el resto',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'b) butano < metil etil éter < propanal < 1-propanol < ácido acético < ácido oxálico',
        },
        {
          tipo: 'datos',
          titulo: 'b) Por qué ese orden',
          items: [
            { etiqueta: '1.º', valor: 'Butano', detalle: 'solo London: el mínimo posible' },
            {
              etiqueta: '2.º',
              valor: 'Metil etil éter',
              detalle: 'polar (dipolo-dipolo), pero sin ningún H sobre el oxígeno',
            },
            {
              etiqueta: '3.º',
              valor: 'Propanal',
              detalle:
                'el carbonilo C=O es más polar que el C–O–C del éter → dipolo-dipolo más intenso, aunque sigue sin poder donar puente de H',
            },
            {
              etiqueta: '4.º',
              valor: '1-Propanol',
              detalle: 'aparece el –OH: el salto a puente de H es el mayor escalón de la serie',
            },
            {
              etiqueta: '5.º',
              valor: 'Ácido acético',
              detalle: 'puente de H más dimerización: dos puentes por par de moléculas',
            },
            {
              etiqueta: '6.º',
              valor: 'Ácido oxálico, HOOC–COOH',
              detalle:
                'dos grupos –COOH: el doble de puntos de puente de H y mayor PM → el más alto del grupo (de hecho sublima a temperatura elevada)',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El grupo a) se ordena por forma y tamaño (todos London salvo los dos alcoholes); el grupo b) se ordena por tipo de fuerza, escalón a escalón. Reconocer cuál de los dos criterios manda en cada lista es lo que pide el ejercicio.',
        },
      ],
    },
    {
      n: 7,
      titulo: 'Mayor y menor solubilidad en agua de los compuestos del ejercicio 6',
      enunciado:
        'Indicar en cada grupo cuál es el compuesto más soluble en agua y cuál el menos soluble.',
      bloques: [
        {
          tipo: 'contraste',
          etiqueta: 'a)',
          titulo: 'Neopentano · n-hexano · 2,3-dimetilbutano · 1-hexanol · 2-metil-2-butanol',
          lados: [
            {
              titulo: 'Mayor solubilidad — 2-metil-2-butanol',
              items: [
                'tiene –OH que forma puente de H con el agua',
                'solo 5 carbonos',
                'ramificado: la parte hidrofóbica es compacta',
              ],
              nota:
                'El 1-hexanol también tiene –OH, pero su cadena de 6 carbonos lineal ya es demasiado hidrofóbica',
            },
            {
              titulo: 'Menor solubilidad — n-hexano',
              items: [
                'los tres hidrocarburos son prácticamente insolubles',
                'ningún grupo polar que interactúe con el agua',
                'el n-hexano es lineal: más superficie apolar expuesta',
              ],
              nota:
                'Las formas ramificadas (neopentano, 2,3-dimetilbutano), al ser más compactas, exponen algo menos de superficie apolar',
            },
          ],
        },
        {
          tipo: 'contraste',
          etiqueta: 'b)',
          titulo: 'Butano · éter metil-etílico · propanal · 1-propanol · ác. acético · ác. oxálico',
          lados: [
            {
              titulo: 'Mayor solubilidad — ácido acético (y ácido oxálico)',
              items: [
                'donan y aceptan puentes de H a la vez',
                'moléculas pequeñas, sin cola hidrofóbica apreciable',
                'el 1-propanol también es miscible en toda proporción',
              ],
              nota:
                'Ser donador y aceptor simultáneo es lo que separa a los ácidos del propanal, que solo puede aceptar',
            },
            {
              titulo: 'Menor solubilidad — butano',
              items: [
                'ningún grupo polar',
                'completamente hidrofóbico',
                'prácticamente insoluble en agua',
              ],
              nota: 'Solo puede ofrecer fuerzas de London, que no compiten con el puente de H del agua',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'La regla de los 4–5 carbonos',
          texto:
            'Un grupo –OH hace soluble a una molécula pequeña, pero su efecto se diluye al alargar la cadena: a partir de unos 4–5 carbonos el carácter hidrofóbico empieza a dominar. Por eso el propanol es miscible, el 2-metil-2-butanol bastante soluble y el 1-hexanol ya poco soluble, teniendo los tres el mismo grupo funcional.',
        },
      ],
    },
    {
      n: 8,
      titulo: '¿Cuál de cada par tiene el punto de ebullición más alto?',
      enunciado: 'Señalar en cada par el compuesto que hierve a mayor temperatura.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Ganador de cada par',
          encabezados: ['Par', 'Hierve más alto', 'Razón'],
          filas: [
            [
              'a) (CH₃)₃C–C(CH₃)₃ vs. 2,5-dimetilhexano',
              '2,5-Dimetilhexano',
              'Mismo PM (C₈H₁₈), pero el primero es casi esférico y compacto; el segundo conserva una cadena alargada con más área de contacto',
            ],
            [
              'b) octano vs. 1-heptanol',
              '1-Heptanol',
              'El alcohol forma puente de H; el octano, con PM similar, solo tiene London',
            ],
            [
              'c) 1,6-hexanodiol vs. 3,3-dimetilbutan-2-ol',
              '1,6-Hexanodiol',
              'Dos grupos –OH (el doble de puentes de H) y cadena lineal, frente a un alcohol ramificado con un solo –OH',
            ],
            [
              'd) hexan-2-ona vs. hexan-2-ol',
              'Hexan-2-ol',
              'La cetona solo tiene dipolo-dipolo — su O no lleva ningún H; el alcohol sí forma puente de H',
            ],
            [
              'e) metil etil éter vs. propan-2-ol',
              'Propan-2-ol',
              'Mismo PM (60): el éter carece de H sobre el O y se queda en dipolo-dipolo',
            ],
            [
              'f) fenol vs. hidroquinona',
              'Hidroquinona',
              'El 1,4-dihidroxibenceno tiene dos –OH sobre el anillo: mayor PM y el doble de puntos de puente de H',
            ],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El patrón que se repite en toda la práctica',
          texto:
            'Cinco de los seis pares se deciden con la misma pregunta: ¿hay un H unido directamente a N, O o F? Solo a) escapa a ese criterio y se resuelve por forma, porque ambos compuestos son hidrocarburos isómeros. Ante un par nuevo conviene aplicar la pregunta del puente de H primero y recurrir al tamaño y la forma únicamente cuando ambos empatan.',
        },
      ],
    },
  ],
};
