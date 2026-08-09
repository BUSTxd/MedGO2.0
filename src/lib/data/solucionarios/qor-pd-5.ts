import type { Solucionario } from './types';

/**
 * PD05 — Ácidos y bases.
 * El enunciado (con las estructuras, los hidrógenos marcados I–VI y las
 * alternativas de cada pregunta) es el PDF de la práctica: `qor-pd-5`.
 */
export const qorPd5: Solucionario = {
  id: 'qor-pd-5',
  pdfId: 'qor-pd-5',
  titulo: 'PD05 — Ácidos y bases',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Ordenar nueve compuestos por acidez y asignarles su Ka',
      enunciado:
        'Ordenar de mayor a menor acidez y emparejar cada compuesto con la constante Ka que le corresponde.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'La estrategia es en dos tiempos y el orden importa: primero se clasifica por familia funcional (ácido carboxílico ≫ fenol ≫ alcohol), porque entre familias hay saltos de cinco o seis órdenes de magnitud; solo después se afina dentro de cada familia mirando el sustituyente. Intentar ordenar los nueve de golpe comparando sustituyentes es el camino largo y propenso a error.',
        },
        {
          tipo: 'datos',
          titulo: 'Paso 1 y 2 — familia y orden interno',
          items: [
            {
              etiqueta: 'Ácidos carboxílicos',
              valor: 'p-NO₂C₆H₄COOH > C₆H₅COOH > p-NH₂C₆H₄COOH',
              detalle:
                'el NO₂ en para es fuertemente –I y –M: retira densidad y estabiliza el carboxilato → sube la acidez. El NH₂ es fuertemente +M: la cede → la baja',
            },
            {
              etiqueta: 'Fenoles',
              valor: 'p-ClC₆H₄OH > C₆H₅OH > p-CH₃C₆H₄OH',
              detalle:
                'el Cl es –I y estabiliza el fenóxido; el CH₃ es +I/+M débil y lo desestabiliza ligeramente',
            },
            {
              etiqueta: 'Alcoholes',
              valor: 'Cl–CH₂CH₂OH > CH₃CH₂OH > (CH₃)₃C–OH',
              detalle:
                'el Cl es –I y acidifica; cada metilo alrededor del carbono del –OH empuja densidad (+I) y desestabiliza el alcóxido',
            },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Paso 3 — orden final decreciente con su Ka',
          encabezados: ['#', 'Compuesto', 'Ka'],
          filas: [
            ['1', 'p-NO₂C₆H₄COOH', '3,9 × 10⁻⁴'],
            ['2', 'C₆H₅COOH', '6,5 × 10⁻⁵'],
            ['3', 'p-NH₂C₆H₄COOH', '1,4 × 10⁻⁵'],
            ['4', 'p-ClC₆H₄OH', '6,3 × 10⁻¹⁰'],
            ['5', 'C₆H₅OH', '1 × 10⁻¹⁰'],
            ['6', 'p-CH₃C₆H₄OH', '6,7 × 10⁻¹¹'],
            ['7', 'Cl–CH₂CH₂OH', '5 × 10⁻¹⁵'],
            ['8', 'CH₃CH₂OH', '1,3 × 10⁻¹⁶'],
            ['9', '(CH₃)₃C–OH', '1 × 10⁻¹⁸'],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Lo que confirma que la clasificación es correcta',
          texto:
            'Los nueve valores caen en tres bloques limpios: 10⁻⁴–10⁻⁵ (ácidos), 10⁻¹⁰–10⁻¹¹ (fenoles) y 10⁻¹⁵–10⁻¹⁸ (alcoholes). Dentro de cada bloque el sustituyente mueve la Ka menos de un orden de magnitud; entre bloques la mueve cinco o seis. Por eso ningún sustituyente, por potente que sea, convierte a un fenol en más ácido que un ácido carboxílico.',
        },
      ],
    },
    {
      n: 2,
      titulo: 'Ordenar cada serie en acidez creciente',
      enunciado: 'Ordenar los compuestos de cada grupo de menor a mayor acidez.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Los tres órdenes, de menor a mayor acidez',
          encabezados: ['', 'Orden creciente (pKa entre paréntesis)'],
          filas: [
            [
              'a)',
              '(CH₃)₂CH–OH (16,49) < CH₃OH (15,49) < Cl₃C–CH₂OH (12,20)',
            ],
            [
              'b)',
              'C₆H₅OH (9,96) < p-BrC₆H₄OH (9,20) < m-BrC₆H₄OH (8,85) < o-BrC₆H₄OH (8,39)',
            ],
            [
              'c)',
              'p-CH₃C₆H₄COOH (4,38) < m-CH₃C₆H₄COOH (4,27) < C₆H₅COOH (4,20) < o-CH₃C₆H₄COOH (3,91)',
            ],
          ],
        },
        {
          tipo: 'datos',
          titulo: 'El factor que decide en cada serie',
          items: [
            {
              etiqueta: 'a)',
              valor: 'Efecto inductivo de los halógenos frente a los metilos',
              detalle:
                'los tres cloros del CCl₃ retiran densidad con fuerza (–I) y estabilizan el alcóxido; en el otro extremo, los dos metilos del isopropanol la ceden (+I) y lo desestabilizan',
            },
            {
              etiqueta: 'b)',
              valor: 'Distancia del bromo al –OH',
              detalle:
                'el Br actúa sobre todo por inducción, y el efecto inductivo se atenúa con la distancia: orto > meta > para. El fenol sin sustituir, sin ningún grupo electroatractor, es el menos ácido',
            },
            {
              etiqueta: 'c)',
              valor: 'Efecto orto — la excepción de la serie',
              detalle:
                'en para y meta el metilo se comporta como se espera (dona densidad y baja la acidez respecto al benzoico), pero en orto el resultado se invierte',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Por qué el ácido o-toluico rompe el patrón',
          texto:
            'El metilo en orto estorba estéricamente al –COOH y lo saca del plano del anillo. Al perderse esa coplanaridad, el grupo carboxilo deja de conjugarse con el anillo y el equilibrio se desplaza a favor del carboxilato, de modo que el ácido o-toluico (pKa 3,91) resulta MÁS ácido que el benzoico (4,20) pese a llevar un grupo donador. Es el llamado efecto orto: cuando un sustituyente está pegado al grupo funcional, la geometría puede pesar más que la electrónica.',
        },
      ],
    },
    {
      n: 3,
      titulo: 'Ácidos y bases de Lewis frente a Brønsted-Lowry',
      enunciado: 'Señalar la alternativa FALSA sobre las especies de las reacciones mostradas.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué ocurre en cada reacción',
          items: [
            {
              etiqueta: '(I)',
              valor: 'AlCl₃ + CH₃Cl → [AlCl₄]⁻ + CH₃⁺',
              detalle:
                'el aluminio tiene el octeto incompleto y acepta un par electrónico del cloro: ácido de Lewis puro',
            },
            {
              etiqueta: '(II) + (III)',
              valor: 'BF₃ + NH₃ → F₃B–NH₃',
              detalle:
                'el aducto ácido-base de Lewis de manual: el boro acepta el par libre del nitrógeno',
            },
            {
              etiqueta: '(IV) + (V)',
              valor: 'CH₃NH₂ + HCl → CH₃NH₃⁺ + Cl⁻',
              detalle:
                'transferencia de protón: la amina lo acepta (base) y el HCl lo cede (ácido), Brønsted-Lowry clásico',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                '(I) y (II) son ácidos de Lewis — AlCl₃ y BF₃ tienen el átomo central con octeto incompleto y aceptan pares de electrones',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'b',
              texto:
                '(III) y (IV) son bases — NH₃ y CH₃NH₂ tienen par libre que donar (Lewis) y pueden aceptar H⁺ (Brønsted-Lowry)',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'c',
              texto:
                '(V) se comporta como ácido en ambos sentidos — el HCl cede H⁺ (Brønsted-Lowry) y ese protón acepta el par de la amina (Lewis)',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'd',
              texto:
                '(II) es ácido tanto de Brønsted-Lowry como de Lewis — el BF₃ no tiene ningún hidrógeno que ceder, así que no puede ser ácido de Brønsted-Lowry; solo lo es de Lewis',
              esRespuesta: true,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                '(IV) es base en ambos sentidos — la metilamina dona el par libre del N (Lewis) y acepta el H⁺ del HCl (Brønsted-Lowry)',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta (la FALSA): (d)' },
        {
          tipo: 'nota',
          texto:
            'La definición de Lewis contiene a la de Brønsted-Lowry, no al revés: todo ácido de Brønsted es ácido de Lewis, pero hay ácidos de Lewis (BF₃, AlCl₃, cationes metálicos) que no tienen ningún protón que ceder. Preguntarse «¿tiene un H disponible?» resuelve de inmediato este tipo de alternativa.',
        },
      ],
    },
    {
      n: 4,
      titulo: 'Acidez de tres ácidos carboxílicos y tres alcoholes',
      enunciado: 'Marcar la alternativa correcta sobre la acidez relativa de los seis compuestos.',
      bloques: [
        {
          tipo: 'contraste',
          titulo: 'Clasificación previa: dos familias, dos escalas distintas',
          lados: [
            {
              titulo: 'Ácidos carboxílicos — VI > II > IV',
              items: [
                '(VI) Cl₂CH–COOH, dicloroacético',
                '(II) CH₃COOH, acético',
                '(IV) CH₃CH₂COOH, propanoico',
              ],
              nota:
                'los dos cloros de (VI) son fuertemente –I y estabilizan el carboxilato: es el ácido más fuerte de toda la lista. Entre acético y propanoico, el carbono extra del propanoico dona algo de densidad (+I) y lo hace ligeramente más débil',
            },
            {
              titulo: 'Alcoholes — V > I > III',
              items: [
                '(V) CH₃CH₂OH, etanol (1°)',
                '(I) (CH₃)₂CH–OH, isopropanol (2°)',
                '(III) (CH₃)₃C–OH, terc-butanol (3°)',
              ],
              nota:
                'en agua el orden de acidez de los alcoholes es 1° > 2° > 3°: cuantos más metilos rodean al carbono del –OH, más se desestabiliza el alcóxido por efecto +I y por impedimento a la solvatación',
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'Uniendo ambas escalas —y recordando que cualquier ácido carboxílico supera con creces a cualquier alcohol— el orden completo de mayor a menor acidez es VI > II > IV > V > I > III.',
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto: 'Orden creciente según la numeración I → VI',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                '(IV) > (II) > (VI) — es justo al revés: (VI), con dos cloros, es el más ácido de los tres',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto: 'Orden decreciente según la numeración VI → I',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'El menos ácido es (V) — el etanol es en realidad el MÁS ácido de los tres alcoholes; el menos ácido de toda la lista es (III), el terc-butanol',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                'El más ácido es (VI) — el ácido dicloroacético, con dos cloros electroatractores sobre el carbono α, es el más fuerte de los seis',
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
      titulo: 'Comparar pKa de fenoles y alcoholes sustituidos',
      enunciado: 'Marcar la alternativa correcta sobre los pKa de los seis compuestos.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Conviene traducir la pregunta antes de responder: mayor acidez es menor pKa. Con eso, el orden de acidez decreciente y el de pKa creciente son el mismo listado leído en el mismo sentido.',
        },
        {
          tipo: 'datos',
          titulo: 'De más ácido (menor pKa) a menos ácido (mayor pKa)',
          items: [
            {
              etiqueta: '1.º',
              valor: '(III) p-nitrofenol — pKa ≈ 7',
              detalle:
                'el NO₂ retira densidad por inducción y por resonancia, deslocalizando la carga del fenóxido hasta los propios oxígenos del nitro: el más ácido con diferencia',
            },
            {
              etiqueta: '2.º',
              valor: '(V) fenol — pKa ≈ 9,95',
              detalle: 'la referencia sin sustituir',
            },
            {
              etiqueta: '3.º',
              valor: '(I) p-cresol — pKa ≈ 10,3',
              detalle: 'el metilo es +I/+M débil y baja ligeramente la acidez respecto al fenol',
            },
            {
              etiqueta: '4.º',
              valor: '(IV) CH₃–CCl₂–CH₂OH — pKa ≈ 12–13',
              detalle:
                'los dos cloros lo acidifican mucho para ser un alcohol, pero sigue por debajo de cualquier fenol: la resonancia del anillo pesa más que dos efectos inductivos',
            },
            {
              etiqueta: '5.º',
              valor: '(II) propan-1-ol — pKa ≈ 16',
              detalle: 'alcohol primario sin sustituyentes',
            },
            {
              etiqueta: '6.º',
              valor: '(VI) terc-butanol — pKa ≈ 18',
              detalle: 'tres metilos +I: el menos ácido y, por tanto, el de mayor pKa',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto: 'Orden según la numeración del enunciado',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                '(III) tiene el menor pKa — el p-nitrofenol es el más ácido de los seis, así que le corresponde el pKa más bajo',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
            {
              letra: 'c',
              texto: 'Orden inverso según la numeración del enunciado',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                '(II) tiene el mayor pKa — el propanol es menos ácido que los fenoles, pero el mayor pKa lo tiene (VI), el terc-butanol',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                '(I) > (III) > (V) en acidez — invierte dos términos: en acidez el orden real de estos tres es (III) > (V) > (I)',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (b)' },
        {
          tipo: 'nota',
          texto:
            'El compuesto (IV) es el que separa a los buenos de los distraídos: tiene dos cloros y parece «muy ácido», pero es un alcohol. Ningún alcohol, por clorado que esté, alcanza a un fenol — la estabilización por resonancia del anillo aromático es un mecanismo cualitativamente distinto y más potente que el inductivo.',
        },
      ],
    },
    {
      n: 6,
      titulo: 'Ka de ácidos aromáticos y fenoles: señalar la falsa',
      enunciado:
        'Indicar la proposición FALSA sobre las constantes de acidez de los seis compuestos.',
      bloques: [
        {
          tipo: 'contraste',
          titulo: 'El par que decide la pregunta: mismo –OH, distinta posición',
          lados: [
            {
              titulo: '(V) Ácido salicílico — OH en orto',
              items: [
                'pKa ≈ 2,97',
                'MÁS ácido que el benzoico (4,20)',
                'forma puente de H intramolecular',
              ],
              nota:
                'una vez ionizado, el –OH vecino sujeta al carboxilato mediante un puente de hidrógeno interno que lo estabiliza enormemente: la geometría vence al carácter donador del –OH',
            },
            {
              titulo: '(III) Ácido p-hidroxibenzoico — OH en para',
              items: [
                'pKa ≈ 4,58',
                'MENOS ácido que el benzoico (4,20)',
                'no puede formar el puente interno',
              ],
              nota:
                'a esa distancia el –OH solo puede ceder densidad al anillo por resonancia, lo que desestabiliza el carboxilato y baja la acidez, como cabría esperar de un grupo donador',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'Orden de Ka, de mayor a menor',
          items: [
            { etiqueta: '1.º', valor: '(V) ácido salicílico', detalle: 'puente de H intramolecular' },
            { etiqueta: '2.º', valor: '(I) ácido benzoico', detalle: 'la referencia sin sustituir' },
            {
              etiqueta: '3.º',
              valor: '(III) ácido p-hidroxibenzoico',
              detalle: 'el –OH en para dona densidad y lo debilita',
            },
            {
              etiqueta: '4.º',
              valor: '(VI) m-clorofenol',
              detalle:
                'ya en la familia de los fenoles; el Cl en meta ejerce más efecto inductivo neto que en para',
            },
            { etiqueta: '5.º', valor: '(II) p-clorofenol', detalle: 'el Cl acidifica, pero menos' },
            { etiqueta: '6.º', valor: '(IV) fenol', detalle: 'sin sustituyentes: la menor Ka de los seis' },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                '(I) > (II) > (IV) — un ácido carboxílico supera a cualquier fenol, y el Cl en para hace al (II) más ácido que el fenol sin sustituir',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'b',
              texto:
                '(IV) tiene la menor Ka — el fenol sin sustituir es el menos ácido de los seis',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'c',
              texto:
                '(V) tiene la menor Ka — es exactamente lo contrario: el ácido salicílico tiene la MAYOR Ka de todos por la estabilización vía puente de hidrógeno intramolecular',
              esRespuesta: true,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto: '(V) > (I) > (III) — el orden correcto entre los tres ácidos carboxílicos',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'e',
              texto: '(I) no tiene la mayor Ka — en efecto, la mayor la tiene (V), no el benzoico',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta (la FALSA): (c)' },
      ],
    },
    {
      n: 7,
      titulo: 'Derivado de la vitamina B₅: ordenar la acidez de cinco hidrógenos',
      enunciado:
        'Comparar la acidez de los hidrógenos señalados (I)–(V) en la estructura y marcar la alternativa correcta.',
      bloques: [
        {
          tipo: 'mapeo',
          titulo: 'Qué hidrógeno señala cada marca',
          items: [
            {
              marca: '(I)',
              senala: 'el H terminal del alquino, H–C≡C–',
              conclusion: 'C–H sobre carbono sp — el único C–H con acidez apreciable de la molécula',
            },
            {
              marca: '(II)',
              senala: 'un H del grupo metilo',
              conclusion: 'C–H sobre carbono sp³ — el hidrógeno menos ácido de toda la estructura',
            },
            {
              marca: '(III)',
              senala: 'el S–H del tiol',
              conclusion: 'tiol: más ácido que un alcohol pese a que el S es menos electronegativo que el O',
            },
            {
              marca: '(IV)',
              senala: 'el O–H del alcohol secundario',
              conclusion: 'alcohol ordinario, sin resonancia que estabilice el alcóxido',
            },
            {
              marca: '(V)',
              senala: 'el O–H del ácido carboxílico terminal',
              conclusion: 'ácido carboxílico: su base conjugada se estabiliza por resonancia',
            },
          ],
        },
        {
          tipo: 'tabla',
          titulo: 'Ranking de acidez, del más al menos ácido',
          encabezados: ['H', 'Tipo', 'pKa aprox.'],
          filas: [
            ['(V)', 'O–H de ácido carboxílico', '4–5'],
            ['(III)', 'S–H de tiol', '10–11'],
            ['(IV)', 'O–H de alcohol', '≈ 16'],
            ['(I)', 'C–H de alquino terminal (sp)', '≈ 25'],
            ['(II)', 'C–H de metilo (sp³)', '≈ 50'],
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto: '(II) es más ácido que (I) — al revés: el H del alquino supera con creces al del metilo',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto: '(IV) es más ácido que (III) — al revés: el tiol es unas 5 unidades de pKa más ácido que el alcohol',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto: '(IV) es el más acídico — el más ácido es (V), el ácido carboxílico',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                '(I) es más ácido que (IV) — no: el alquino terminal (pKa ≈ 25) queda muy por debajo del alcohol (pKa ≈ 16)',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                '(V) es el más acídico — el –COOH lo es siempre que convive con alcoholes, tioles o hidrocarburos, porque su carboxilato reparte la carga entre dos oxígenos equivalentes',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (e)' },
        {
          tipo: 'nota',
          titulo: 'Los dos fundamentos que hay que tener a mano',
          texto:
            'Tiol frente a alcohol: el azufre es más grande y polarizable, el enlace S–H es más débil y la carga negativa del tiolato se reparte sobre un átomo mayor, así que se estabiliza mejor — la electronegatividad no manda cuando se comparan átomos de periodos distintos. Alquino frente a alcano: el carbono sp tiene 50 % de carácter s, lo que mantiene el par de electrones más cerca del núcleo y estabiliza el carbanión; aun así sigue quedando muy lejos de cualquier O–H o S–H.',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Ciprofloxacino: basicidad de sus grupos funcionales',
      enunciado:
        'Analizar los grupos señalados (I)–(VI) en la molécula y marcar la alternativa correcta.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué es cada grupo y cómo se comporta',
          items: [
            {
              etiqueta: '(I)',
              valor: 'Amina primaria alifática (–NH₂) — muy básica',
              detalle:
                'su par libre no está conjugado con ningún sistema π: queda totalmente disponible para captar un protón. Es probablemente el grupo más básico de la molécula',
            },
            {
              etiqueta: '(II)',
              valor: 'Nitrógeno terciario N–CH₃ del anillo tipo piperazina — básico',
              detalle: 'también alifático y con par libre disponible, aunque más impedido estéricamente',
            },
            {
              etiqueta: '(III)',
              valor: 'N–H conjugado con el sistema quinolónico — poco básico',
              detalle:
                'su par se deslocaliza hacia el anillo y el C=O vecino (comportamiento tipo enamina/amida): es el nitrógeno MENOS básico de la molécula',
            },
            {
              etiqueta: '(IV)',
              valor: 'O–H del ácido carboxílico — el protón más ácido',
              detalle:
                'su par libre está deslocalizado por resonancia hacia el carbonilo, así que tampoco es un oxígeno especialmente básico',
            },
            {
              etiqueta: '(V)',
              valor: 'C=O cetónico conjugado (4-oxo-quinolona)',
              detalle: 'el oxígeno del carbonilo conjugado, que participa en la deslocalización del anillo',
            },
            {
              etiqueta: '(VI)',
              valor: 'Flúor aromático — el átomo menos básico',
              detalle:
                'tiene pares libres, pero su electronegatividad extrema y su pequeño tamaño hacen que los retenga con fuerza y prácticamente no los comparta',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                '(II) es el N menos básico y (IV) el O más básico — falla por partida doble: el menos básico es (III), por conjugación, y el O de (IV) tiene su par deslocalizado hacia el carbonilo',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                '(III) es más básica que (I) por ser amina secundaria — el grado de sustitución no decide aquí: (III) es mucho menos básica porque su par está conjugado con el sistema aromático',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                '(I) no es el grupo más básico por ser amina primaria — ser primaria no la descalifica; al no estar conjugada con nada, es justamente la más básica',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'El protón de (IV) no es el más ácido — sí lo es: el O–H del ácido carboxílico, conjugado con su carbonilo, es el protón más ácido de toda la molécula',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                '(VI) es el átomo menos básico — el flúor, por su electronegatividad extrema, es el que menos disponible tiene su par libre, tanto en el sentido de Brønsted-Lowry como en el de Lewis',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (e)' },
        {
          tipo: 'nota',
          texto:
            'La pregunta se resuelve con un solo criterio aplicado seis veces: un par libre solo es básico si está disponible. Lo que lo hace indisponible es la conjugación —caso de (III), (IV) y (V)— o la electronegatividad del átomo que lo sostiene —caso de (VI)—. Los que quedan libres, (I) y (II), son los básicos de verdad.',
        },
      ],
    },
    {
      n: 9,
      titulo: 'Ácido-base aplicado a la absorción de fármacos',
      enunciado:
        'Analizar con Henderson-Hasselbalch la forma predominante de cada fármaco en estómago y duodeno, y deducir dónde se absorbe mejor.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'La herramienta es pH = pKa + log([ionizada]/[neutra]) junto con la hipótesis de partición de pH: solo la forma neutra, sin carga y liposoluble, atraviesa con facilidad la membrana por difusión pasiva; la forma ionizada queda retenida en el medio acuoso. Así que la pregunta «¿dónde se absorbe?» se traduce en «¿dónde predomina la forma neutra?».',
        },
        {
          tipo: 'contraste',
          etiqueta: 'a)',
          titulo: 'Aspirina (ácido acetilsalicílico), pKa = 3,5 — un ácido débil',
          lados: [
            {
              titulo: 'Estómago (pH 1–3) — forma neutra',
              items: [
                'pH < pKa',
                'a pH 1: log([A⁻]/[HA]) = 1 − 3,5 = −2,5',
                '[A⁻]/[HA] ≈ 0,003',
              ],
              nota:
                'prácticamente toda la aspirina está sin ionizar (HA), liposoluble: puede atravesar la mucosa gástrica por difusión pasiva',
            },
            {
              titulo: 'Duodeno (pH 6–6,5) — forma ionizada',
              items: [
                'pH > pKa',
                'a pH 6: log([A⁻]/[HA]) = 6 − 3,5 = 2,5',
                '[A⁻]/[HA] ≈ 316, más del 99,5 % ionizada',
              ],
              nota:
                'domina el carboxilato A⁻, polar y poco liposoluble: la difusión pasiva queda desfavorecida',
            },
          ],
        },
        {
          tipo: 'contraste',
          etiqueta: 'b)',
          titulo: 'Librium® (clordiazepóxido), pKb = 9,5 → pKa(BH⁺) = 14 − 9,5 = 4,5 — una base débil',
          lados: [
            {
              titulo: 'Estómago (pH 1–3) — forma ionizada',
              items: [
                'pH < pKa(BH⁺)',
                'a pH 3: log([B]/[BH⁺]) = 3 − 4,5 = −1,5',
                '[B]/[BH⁺] ≈ 0,03',
              ],
              nota:
                'casi todo el fármaco está protonado como BH⁺, con carga positiva: mala absorción gástrica',
            },
            {
              titulo: 'Duodeno (pH 6–6,5) — forma neutra',
              items: [
                'pH > pKa(BH⁺)',
                'a pH 6: log([B]/[BH⁺]) = 6 − 4,5 = 1,5',
                '[B]/[BH⁺] ≈ 32',
              ],
              nota: 'predomina la base libre B, neutra y liposoluble: buena absorción intestinal',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'La aspirina, ácido débil, encuentra su forma neutra en el medio ácido del estómago; el clordiazepóxido, base débil, la encuentra en el pH más neutro del duodeno. Cada fármaco se absorbe donde el pH del medio no lo ioniza.',
        },
        {
          tipo: 'nota',
          titulo: 'El matiz clínico',
          texto:
            'El razonamiento anterior es el modelo clásico de partición de pH, pero en la práctica la mayor parte de la aspirina se absorbe igualmente en el intestino delgado: su superficie de absorción es órdenes de magnitud mayor que la del estómago y compensa con creces la desventaja de la ionización. El modelo predice bien la tendencia, no el porcentaje final absorbido en cada tramo.',
        },
      ],
    },
  ],
};
