import type { Solucionario } from './types';

/**
 * PD03 — Estereoquímica.
 * El enunciado (con las estructuras dibujadas en cuñas, las proyecciones y los
 * pares que hay que comparar) es el PDF de la práctica: `qor-pd-3`.
 */
export const qorPd3: Solucionario = {
  id: 'qor-pd-3',
  pdfId: 'qor-pd-3',
  titulo: 'PD03 — Estereoquímica',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Nombrar las estructuras e identificar isómeros',
      enunciado:
        'Nombrar cada compuesto y agrupar los que sean isómeros entre sí, indicando el tipo de isomería.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'El camino corto es sacar primero la fórmula molecular de cada dibujo: los que comparten fórmula son candidatos a isómeros, y recién ahí se mira qué los diferencia (esqueleto, posición, grupo funcional, geometría o configuración).',
        },
        {
          tipo: 'tabla',
          titulo: 'Nombre y fórmula de cada estructura',
          encabezados: ['', 'Nombre', 'Fórmula'],
          filas: [
            ['a)', '3-metilbut-1-ino', 'C₅H₈'],
            ['b)', 'propan-2-ol (isopropanol)', 'C₃H₈O'],
            ['c)', '(E)-1-cloropropeno', 'C₃H₅Cl'],
            ['d)', 'propanal', 'C₃H₆O'],
            ['e)', 'propan-2-ol', 'C₃H₈O'],
            ['f)', 'pent-1-ino', 'C₅H₈'],
            ['g)', 'metoxietano (éter etil-metílico)', 'C₃H₈O'],
            ['h)', 'propan-2-ona (acetona)', 'C₃H₆O'],
            ['i)', 'propan-1-ol', 'C₃H₈O'],
            ['j)', 'pent-2-ino', 'C₅H₈'],
            ['k)', '(S)-2-bromobutan-2-ol', 'C₄H₉BrO'],
            ['l)', 'penta-1,4-dieno', 'C₅H₈'],
            ['m)', '(Z)-1-cloropropeno', 'C₃H₅Cl'],
            ['n)', 'ciclopenteno', 'C₅H₈'],
            ['o)', '(R)-2-bromobutan-2-ol', 'C₄H₉BrO'],
          ],
        },
        {
          tipo: 'mapeo',
          titulo: 'Los tres pares que se prestan a confusión',
          items: [
            {
              marca: 'b) y e)',
              senala: 'dos dibujos de propan-2-ol, uno de ellos con cuñas',
              conclusion:
                'NO son isómeros: son el mismo compuesto. El carbono central lleva dos CH₃ idénticos, así que no es estereocentro por más que esté dibujado en 3D — las cuñas ahí no significan nada estereoquímico',
            },
            {
              marca: 'c) y m)',
              senala: 'el mismo esqueleto ClCH=CH–CH₃ con distinta disposición',
              conclusion:
                'isómeros geométricos (cis-trans): en c) el Cl y el CH₃ quedan en lados opuestos del doble enlace (E); en m) del mismo lado (Z)',
            },
            {
              marca: 'k) y o)',
              senala: '2-bromobutan-2-ol dibujado con las cuñas invertidas',
              conclusion:
                'enantiómeros (isomería óptica): misma conectividad, configuración opuesta en C2. Prioridades CIP Br > OH > C₂H₅ > CH₃',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'Grupos de isómeros (misma fórmula molecular)',
          items: [
            {
              etiqueta: 'C₃H₈O',
              valor: 'b (≡ e), g, i',
              detalle:
                'b/i son isómeros de posición (el OH en C2 frente a C1); g es isómero de función respecto a ambos (éter frente a alcohol)',
            },
            {
              etiqueta: 'C₃H₆O',
              valor: 'd y h',
              detalle: 'isómeros de función: aldehído (propanal) frente a cetona (propanona)',
            },
            {
              etiqueta: 'C₃H₅Cl',
              valor: 'c y m',
              detalle: 'isómeros geométricos E/Z sobre el mismo doble enlace',
            },
            {
              etiqueta: 'C₅H₈',
              valor: 'a, f, j, l, n',
              detalle:
                'todos constitucionales: a/f/j son alquinos que se diferencian en cadena y posición; l (dieno) y n (cicloalqueno) son isómeros de función frente a los alquinos',
            },
            {
              etiqueta: 'C₄H₉BrO',
              valor: 'k y o',
              detalle: 'enantiómeros — el único par de la lista que difiere solo en configuración',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Que dos estructuras estén dibujadas con cuñas no las convierte en estereoisómeros. Antes de hablar de R/S hay que comprobar que el carbono tenga cuatro sustituyentes distintos — es lo que falla en e) y lo que se cumple en k)/o).',
        },
      ],
    },
    {
      n: 2,
      titulo: 'Proponer un isómero de cada compuesto',
      enunciado:
        'Para cada compuesto, escribir un isómero e indicar el tipo de isomería que los relaciona.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Isómero propuesto y relación',
          items: [
            {
              etiqueta: 'a)',
              valor: '1-cloro-2-metilpropano → 1-clorobutano',
              detalle:
                'isomería de cadena: mismo grupo funcional (haluro primario), distinto esqueleto carbonado (ramificado frente a lineal)',
            },
            {
              etiqueta: 'b)',
              valor: '1-cloroetanol (CH₃–CHCl–OH) → 2-cloroetanol (ClCH₂–CH₂–OH)',
              detalle:
                'isomería de posición: el Cl se muda de carbono sin que cambien ni la cadena ni la función',
            },
            {
              etiqueta: 'c)',
              valor: 'ácido (Z)-3-cloropropenoico → ácido (E)-3-cloropropenoico',
              detalle:
                'isomería geométrica: la rigidez del doble enlace fija dos disposiciones distintas de los mismos grupos',
            },
            {
              etiqueta: 'd)',
              valor: 'butan-2-ona → butanal',
              detalle:
                'isomería de función: C₄H₈O puede ser cetona o aldehído; cambia el grupo funcional, no la fórmula',
            },
            {
              etiqueta: 'e)',
              valor: 'pentan-2-ol → su enantiómero',
              detalle:
                'isomería óptica: el C2 lleva OH, CH₃, H y propilo — cuatro grupos distintos, así que es estereocentro y existe la imagen especular no superponible',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'La escalera de isomerías va de más a menos diferencia: cadena → posición → función cambian la conectividad; geométrica y óptica no, solo reordenan lo mismo en el espacio.',
        },
      ],
    },
    {
      n: 3,
      titulo: 'Verdadero o falso sobre quiralidad y actividad óptica',
      enunciado: 'Indicar si cada proposición es verdadera o falsa.',
      bloques: [
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'Un compuesto con designación R gira la luz en sentido horario — R/S es una convención de nomenclatura (CIP) que se asigna sobre el papel; el sentido de rotación se mide en el polarímetro. No hay correlación fija entre ambos',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                'Un compuesto levorrotatorio (–) desvía el plano de la luz polarizada en sentido antihorario — es la definición misma de levorrotatorio',
              esRespuesta: true,
              veredicto: 'Verdadero',
            },
            {
              letra: 'c',
              texto:
                'Una molécula con un solo centro asimétrico es siempre quiral — con un único estereocentro no puede existir plano de simetría interno, así que la molécula y su imagen especular nunca son superponibles',
              esRespuesta: true,
              veredicto: 'Verdadero',
            },
            {
              letra: 'd',
              texto:
                'Una molécula puede tener varios centros asimétricos y aun así ser aquiral — es el caso de los compuestos meso, con dos mitades de configuración opuesta',
              esRespuesta: true,
              veredicto: 'Verdadero',
            },
            {
              letra: 'e',
              texto:
                'Un compuesto meso tiene centros asimétricos pero un plano de simetría interno que lo hace aquiral — esa es exactamente la definición de meso',
              esRespuesta: true,
              veredicto: 'Verdadero',
            },
            {
              letra: 'f',
              texto:
                'Dos moléculas no superponibles son enantiómeros — no basta con no ser superponibles: además deben ser imágenes especulares una de la otra. Si no lo son, son diastereómeros o directamente compuestos distintos',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'g',
              texto:
                'Los diastereómeros son imágenes especulares superponibles — doble error: no son imágenes especulares (eso son los enantiómeros) y tampoco son superponibles, porque son compuestos distintos con propiedades físicas distintas',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'h',
              texto:
                'Solo las mezclas racémicas son ópticamente inactivas — también lo son los compuestos aquirales: cualquier molécula sin quiralidad (incluidos los meso) no desvía la luz polarizada',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        {
          tipo: 'clave',
          texto: 'Respuestas: a) F · b) V · c) V · d) V · e) V · f) F · g) F · h) F',
        },
        {
          tipo: 'nota',
          titulo: 'Las dos trampas del ejercicio',
          texto:
            'Separar la nomenclatura (R/S, asignada por CIP) de la propiedad física (+/–, medida en el polarímetro), y recordar que «ópticamente inactivo» tiene dos causas distintas: la molécula es aquiral, o es quiral pero está en mezcla racémica 50:50.',
        },
      ],
    },
    {
      n: 4,
      titulo: 'Nombrar indicando la configuración R/S',
      enunciado:
        'Asignar la configuración a cada estructura dibujada con cuñas y escribir el nombre completo.',
      bloques: [
        {
          tipo: 'parrafo',
          titulo: 'Cómo se lee cada dibujo',
          texto:
            'Se ordenan los cuatro sustituyentes por prioridad CIP (número atómico del primer átomo; si empatan, se comparan los átomos unidos a él). Luego se mira dónde quedó el grupo de MENOR prioridad: si está en raya (hacia atrás) se lee el giro 1→2→3 directo — horario es R, antihorario es S. Si está en cuña (hacia adelante), se lee igual y se invierte el resultado.',
        },
        {
          tipo: 'datos',
          titulo: 'Asignación estructura por estructura',
          items: [
            {
              etiqueta: 'a)',
              valor: '(S)-hexan-3-ol',
              detalle: 'prioridades OH > propilo > etilo > H',
            },
            {
              etiqueta: 'b)',
              valor: '(R)-3-yodo-3-metilhexano',
              detalle: 'prioridades I > propilo > etilo > CH₃ (aquí el menor no es un H)',
            },
            {
              etiqueta: 'c)',
              valor: '(S)-4-cloro-2-metilbutan-1-ol',
              detalle:
                'prioridades CH₂OH > CH₂CH₂Cl > CH₃ > H — el CH₂OH gana porque su primer punto de diferencia es (O,H,H) frente a (C,H,H)',
            },
            {
              etiqueta: 'd)',
              valor: '(S)-2-bromopentano',
              detalle: 'prioridades Br > propilo > CH₃ > H',
            },
            {
              etiqueta: 'e)',
              valor: '(R)-1-bromo-1-cloropropano',
              detalle:
                'prioridades Br > Cl > etilo > H, con el H en cuña: el giro se lee y luego se invierte',
            },
            {
              etiqueta: 'f)',
              valor: '(R)-1,2-diclorobutano',
              detalle:
                'prioridades Cl (unido directo) > CH₂Cl > CH₂CH₃ > H — el cloro directo siempre vence al carbono que lo lleva',
            },
            {
              etiqueta: 'g)',
              valor: '(R)-4-bromobutan-2-ol',
              detalle: 'prioridades OH > CH₂CH₂Br > CH₃ > H',
            },
            {
              etiqueta: 'h)',
              valor: '(S)-alanina',
              detalle:
                'prioridades NH₃⁺ > COO⁻ > CH₃ > H. Coincide con el dato real: la L-alanina es (S) y además dextrorrotatoria (+)',
            },
            {
              etiqueta: 'i)',
              valor: '(R)-ácido láctico',
              detalle:
                'prioridades OH > COOH > CH₃ > H, con el H en cuña (se invierte). Coincide con el dato real: el ácido D-láctico es (R) y levorrotatorio (–)',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Dos detalles del enunciado',
          texto:
            'El PDF rotula «g)» dos veces con estructuras de cuñas distintas; comprobadas ambas, representan la misma molécula, (R)-4-bromobutan-2-ol — es una duplicación del documento original. Y en h)/i) el enunciado da el signo de rotación (+/–) como dato extra: sirve para confirmar contra la literatura, no para deducir la letra R/S.',
        },
      ],
    },
    {
      n: 5,
      titulo: 'Asignar la configuración E/Z',
      enunciado:
        'Determinar si cada doble enlace es E o Z comparando prioridades a ambos lados.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'En cada carbono del doble enlace se elige el sustituyente de mayor prioridad CIP. Si los dos ganadores quedan del mismo lado del plano del doble enlace es Z; si quedan en lados opuestos, E.',
        },
        {
          tipo: 'tabla',
          titulo: 'Ganador CIP en cada carbono',
          encabezados: ['', 'Carbono 1', 'Carbono 2', 'Disposición', 'Config.'],
          filas: [
            ['a)', 'fenilo > etilo (arriba)', 'etilo > H (arriba)', 'mismo lado', 'Z'],
            [
              'b)',
              'ciclobutilo (C,C,H) > etilo (abajo)',
              'isopropilo (C,C,H) > propilo (abajo)',
              'mismo lado',
              'Z',
            ],
            [
              'c)',
              'acetilo –COCH₃ (O,O,C) > –CH₂OH (O,H,H) (arriba)',
              'CH₃ > H (arriba)',
              'mismo lado',
              'Z',
            ],
            ['d)', 'CH₃ > H (arriba)', 'COOH (O,O,O) > arilo (C,C,C) (abajo)', 'lados opuestos', 'E'],
          ],
        },
        {
          tipo: 'clave',
          texto: 'Respuestas: a) Z · b) Z · c) Z · d) E',
        },
        {
          tipo: 'nota',
          texto:
            'En b) el desempate se decide en la segunda esfera: tanto ciclobutilo como isopropilo presentan (C,C,H) frente al (C,H,H) de etilo y propilo. Y en c) y d) los átomos duplicados de los dobles enlaces C=O son los que deciden: –COCH₃ cuenta como (O,O,C) y –COOH como (O,O,O).',
        },
      ],
    },
    {
      n: 6,
      titulo: 'Isómeros ópticos, enantiómeros, diastereómeros y meso',
      enunciado:
        'Analizar cada estructura: identificar los estereocentros reales, decir cuántos estereoisómeros existen y qué relación guardan.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Antes de aplicar la fórmula 2ⁿ hay que contar los estereocentros REALES: un carbono con dos sustituyentes idénticos no cuenta, y cuando la molécula tiene mitades equivalentes aparecen formas meso que reducen el total.',
        },
        {
          tipo: 'contraste',
          etiqueta: 'a)',
          titulo: 'Pentano-2,3,4-triol — 3 centros dibujados, solo 4 estereoisómeros',
          lados: [
            {
              titulo: 'Quirales — 2 pares de enantiómeros',
              items: [
                '(2R,3R,4R) ↔ (2S,3S,4S)',
                '(2R,3S,4R) ↔ (2S,3R,4S)',
                'cada par es diastereómero del otro',
              ],
              nota:
                'C2 y C4 con la misma configuración: no hay plano interno, la molécula es quiral y ópticamente activa',
            },
            {
              titulo: 'Aquirales — formas meso',
              items: [
                'C2 y C4 de configuración opuesta',
                'plano especular interno que pasa por C3',
                'diastereómeros de todos los anteriores',
              ],
              nota:
                'La estructura tal como está dibujada en el enunciado (C2 = S, C4 = R) cae aquí: es un compuesto MESO, aquiral, pese a tener tres «centros» dibujados',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'b) 2-bromo-4-cloropentano-1,1-diol — cuáles cruces son estereocentros de verdad',
          items: [
            {
              etiqueta: 'C1',
              valor: 'No es estereocentro',
              detalle: 'lleva dos grupos –OH idénticos, así que su imagen especular es superponible',
            },
            {
              etiqueta: 'C3',
              valor: 'No es estereocentro',
              detalle: 'lleva dos H idénticos (arriba y abajo en el dibujo)',
            },
            {
              etiqueta: 'C2 (Br)',
              valor: 'Estereocentro — configuración S',
              detalle: 'prioridades Br > C1 (O,O,H) > C3 (C,H,H) > H',
            },
            {
              etiqueta: 'C4 (Cl)',
              valor: 'Estereocentro — configuración R',
              detalle: 'prioridades Cl > C3 (hacia el lado del diol) > CH₃ > H',
            },
            {
              etiqueta: 'Total',
              valor: '4 estereoisómeros, ninguno meso',
              detalle:
                '(2R,4R)/(2S,4S) son un par de enantiómeros y (2R,4S)/(2S,4R) el otro; ambos pares son diastereómeros entre sí. Al ser Br ≠ Cl no hay mitades equivalentes, así que no cabe forma meso',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'a) La estructura dibujada es meso (aquiral); en total existen 4 estereoisómeros — 2 pares de enantiómeros quirales y las formas meso. · b) (2S,4R)-2-bromo-4-cloropentano-1,1-diol, con 4 estereoisómeros y sin forma meso.',
        },
        {
          tipo: 'nota',
          texto:
            'La estructura de b) tal como aparece en el PDF es poco habitual (un carbono con dos –OH, un gem-diol). Si la intención en clase era otra sustitución, el método no cambia: identificar primero qué cruces son estereocentros reales y solo después contar.',
        },
      ],
    },
    {
      n: 7,
      titulo: 'Dibujar las proyecciones tridimensionales',
      enunciado:
        'a) Ácido carboxílico C₃H₅O₂Br que presenta dos enantiómeros. b) El alcohol quiral de menor peso molecular.',
      bloques: [
        {
          tipo: 'parrafo',
          titulo: 'a) Identificar de qué compuesto se trata',
          texto:
            'C₃H₅O₂Br corresponde a un ácido propanoico con un Br sustituyendo un H. De las dos posiciones posibles, solo el ácido 2-bromopropanoico (CH₃–CHBr–COOH) tiene un carbono con cuatro grupos distintos (Br, COOH, CH₃, H) y puede existir como par de enantiómeros; el ácido 3-bromopropanoico no tiene estereocentro y quedaría descartado.',
        },
        {
          tipo: 'contraste',
          titulo: 'Los dos enantiómeros en proyección de Fischer',
          lados: [
            {
              titulo: '(R)-2-bromopropanoico',
              items: ['Arriba: COOH', 'Derecha: Br', 'Izquierda: H', 'Abajo: CH₃'],
              nota: 'la cadena principal va en vertical y el estereocentro es el cruce',
            },
            {
              titulo: '(S)-2-bromopropanoico',
              items: ['Arriba: COOH', 'Derecha: H', 'Izquierda: Br', 'Abajo: CH₃'],
              nota: 'la imagen especular: basta intercambiar Br y H de lado',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'b) Por qué el más pequeño es el butan-2-ol',
          items: [
            {
              etiqueta: 'Metanol',
              valor: 'No quiral',
              detalle: 'el carbono lleva tres H',
            },
            {
              etiqueta: 'Etanol',
              valor: 'No quiral',
              detalle: 'el C del OH lleva dos H',
            },
            {
              etiqueta: 'Propan-1-ol',
              valor: 'No quiral',
              detalle: 'el C del OH sigue llevando dos H',
            },
            {
              etiqueta: 'Propan-2-ol',
              valor: 'No quiral',
              detalle: 'el C del OH lleva dos CH₃ idénticos',
            },
            {
              etiqueta: 'Butan-2-ol',
              valor: 'Quiral — PM ≈ 74 g/mol',
              detalle:
                'CH₃–CH(OH)–CH₂–CH₃: el C2 lleva OH, H, CH₃ y CH₂CH₃, cuatro grupos distintos. Fischer: OH a un lado y H al otro, con CH₃ arriba y CH₂CH₃ abajo (o al revés, según el enantiómero)',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'a) Ácido 2-bromopropanoico, (R) y (S). · b) Butan-2-ol, el alcohol quiral de menor peso molecular.',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Pasar de cuñas a proyección de Fischer',
      enunciado:
        'Convertir cada estructura tridimensional a su proyección de Fischer equivalente, conservando la configuración.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'La conversión no es un simple copiar posiciones: la Fischer supone que los brazos horizontales salen hacia el observador y los verticales se alejan. Lo seguro es asignar primero R/S sobre las cuñas y después colocar los grupos en la cruz de modo que reproduzcan esa misma configuración — y verificarla otra vez sobre la Fischer.',
        },
        {
          tipo: 'mapeo',
          titulo: 'Estructura de partida → configuración → Fischer',
          items: [
            {
              marca: 'a)',
              senala: 'CO₂H arriba, CH₃ abajo, NH₂ en cuña (adelante) y H en raya (atrás)',
              conclusion:
                '(R)-alanina (D-alanina). Fischer: CO₂H arriba, CH₃ abajo, NH₂ a la derecha, H a la izquierda',
            },
            {
              marca: 'b)',
              senala: 'CO₂H arriba, CH₃ abajo, OH en cuña (adelante) y H en raya (atrás)',
              conclusion:
                '(S)-ácido láctico, el L-(+)-láctico, que es la forma biológica natural. Fischer: CO₂H arriba, CH₃ abajo, OH a la izquierda, H a la derecha',
            },
            {
              marca: 'c)',
              senala: 'CH₃ arriba, CH₂CH₃ a la izquierda, Br en cuña hacia la derecha y CHO abajo en raya',
              conclusion:
                '(R)-2-bromo-2-metilbutanal. Fischer: CHO arriba, CH₂CH₃ abajo, Br a la derecha, CH₃ a la izquierda',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El control de calidad',
          texto:
            'Toda Fischer dibujada debe releerse: si el grupo de menor prioridad quedó en un brazo horizontal (apuntando al observador), el giro leído hay que invertirlo. Saltarse esa comprobación es la causa habitual de convertir un enantiómero en el otro sin darse cuenta.',
        },
      ],
    },
  ],
};
