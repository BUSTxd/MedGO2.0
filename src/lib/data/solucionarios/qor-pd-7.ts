import type { Solucionario } from './types';

/**
 * PD07 — Sustitución nucleofílica y alcoholes.
 * El enunciado (con las estructuras a ordenar, los datos estereoquímicos y las
 * condiciones de cada reacción) es el PDF de la práctica: `qor-pd-7`.
 */
export const qorPd7: Solucionario = {
  id: 'qor-pd-7',
  pdfId: 'qor-pd-7',
  titulo: 'PD07 — Sustitución nucleofílica y alcoholes',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Estados de transición de SN1 y SN2',
      enunciado:
        'Comparar los estados de transición de ambos mecanismos, el orden de reacción que resulta y la importancia del disolvente.',
      bloques: [
        {
          tipo: 'esquema',
          grafico: 'sn1-sn2',
          pie:
            'Arriba, el estado de transición único de SN2: el carbono queda pentacoordinado entre el nucleófilo entrante y el grupo saliente. Abajo, el de la etapa determinante de SN1: solo interviene el sustrato, que se ioniza hacia el carbocatión plano.',
        },
        {
          tipo: 'contraste',
          titulo: 'Qué hay dentro de cada estado de transición',
          lados: [
            {
              titulo: 'SN2 — un único estado de transición',
              items: [
                'el nucleófilo ataca por el lado opuesto al grupo saliente',
                'carbono pentacoordinado, geometría bipiramidal trigonal',
                'un enlace se forma mientras el otro se rompe',
                'los otros tres sustituyentes quedan ecuatoriales, como un paraguas a punto de invertirse',
              ],
              nota:
                'La carga negativa está repartida entre el nucleófilo que entra y el grupo saliente que se va: ambos aparecen en el mismo estado de transición',
            },
            {
              titulo: 'SN1 — dos etapas, una sola cuenta',
              items: [
                'el estado de transición que importa es el de la ionización',
                'solo participa el sustrato: se rompe el enlace C–LG',
                'aparece δ+ sobre el carbono y δ− sobre el saliente',
                'el nucleófilo no está presente aquí',
              ],
              nota:
                'El nucleófilo entra recién en la segunda etapa, rápida, atacando al carbocatión plano ya formado — por eso no aparece en la ecuación de velocidad',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'Orden de reacción, deducido del estado de transición',
          items: [
            {
              etiqueta: 'SN2',
              valor: 'v = k[sustrato][Nu⁻] — segundo orden, bimolecular',
              detalle:
                'sustrato y nucleófilo chocan en el mismo y único paso, así que la concentración de ambos afecta a la velocidad',
            },
            {
              etiqueta: 'SN1',
              valor: 'v = k[sustrato] — primer orden, unimolecular',
              detalle:
                'la velocidad la fija la ionización, que es el paso lento; añadir más nucleófilo no acelera nada porque este actúa después',
            },
          ],
        },
        {
          tipo: 'contraste',
          titulo: 'El disolvente no es un detalle: decide el mecanismo',
          lados: [
            {
              titulo: 'SN1 pide polar prótico',
              items: ['agua', 'alcoholes', 'ácido fórmico'],
              nota:
                'Solvatan el carbocatión con sus pares no enlazantes y al anión saliente por puente de hidrógeno. Como el estado de transición de la ionización es muy polar —hay separación de cargas—, bajarle la energía acelera la reacción',
            },
            {
              titulo: 'SN2 pide polar aprótico',
              items: ['DMSO', 'DMF', 'acetona', 'acetonitrilo'],
              nota:
                'Solvatan bien al catión pero no pueden formar puentes de hidrógeno con el nucleófilo aniónico, que queda «desnudo» y mucho más reactivo. Un disolvente prótico lo enjaularía en puentes de hidrógeno y le quitaría nucleofilicidad',
            },
          ],
        },
      ],
    },
    {
      n: 2,
      titulo: 'Ordenar los alcoholes por reactividad decreciente',
      enunciado:
        'En cada serie, ordenar los alcoholes según su reactividad decreciente frente al reactivo indicado.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Antes de ordenar hay que decidir por qué mecanismo transcurre cada serie, porque los criterios son opuestos: en SN1 manda la estabilidad del carbocatión y en SN2 manda el acceso al carbono, es decir, el impedimento estérico.',
        },
        {
          tipo: 'datos',
          titulo: 'a) Alcoholes bencílicos sustituidos + HBr/HCOOH — mecanismo SN1',
          items: [
            {
              etiqueta: '1.º',
              valor: 'p-OCH₃',
              detalle:
                'dador π fuerte por resonancia: estabiliza mucho el carbocatión bencílico y dispara la ionización',
            },
            { etiqueta: '2.º', valor: 'p-CH₃', detalle: 'dador débil, solo por hiperconjugación e inducción' },
            { etiqueta: '3.º', valor: 'H (sin sustituir)', detalle: 'la referencia' },
            {
              etiqueta: '4.º',
              valor: 'p-NO₂',
              detalle:
                'atractor fuerte por resonancia: desestabiliza el catión bencílico y frena la reacción',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'b) Alcoholes primarios ramificados + HCl conc./acetona — mecanismo SN2',
          items: [
            { etiqueta: '1.º', valor: '1-pentanol', detalle: 'cadena lineal, impedimento mínimo' },
            {
              etiqueta: '2.º',
              valor: '3-metil-1-butanol',
              detalle: 'la ramificación está en γ, lejos del centro de reacción: estorba poco',
            },
            {
              etiqueta: '3.º',
              valor: '2-metil-1-butanol',
              detalle:
                'ramificación en β, pegada al carbono que lleva el OH: interfiere con la trayectoria de ataque del Cl⁻',
            },
            {
              etiqueta: '4.º',
              valor: 'alcohol neopentílico, (CH₃)₃C–CH₂OH',
              detalle:
                'el carbono β es cuaternario y tapa el acceso por detrás casi por completo: efecto neopentílico, reacción lentísima pese a ser primario',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'c) Fenol, 1-metilciclohexanol y alcohol bencílico + HBr/H₂O — mecanismo SN1',
          items: [
            {
              etiqueta: '1.º',
              valor: '1-metilciclohexanol',
              detalle:
                'alcohol terciario: da un carbocatión estabilizado por la hiperconjugación de tres grupos alquilo, ioniza rápido',
            },
            {
              etiqueta: '2.º',
              valor: 'alcohol bencílico',
              detalle:
                'su catión se estabiliza por resonancia con el anillo, pero un bencílico primario simple queda algo por debajo de un terciario completamente sustituido',
            },
            {
              etiqueta: '3.º',
              valor: 'fenol — prácticamente no reacciona',
              detalle:
                'el –OH está sobre un carbono aromático sp²: romper ese enlace daría un catión arilo, inestabilísimo. Además el par libre del oxígeno se conjuga con el anillo y le da al C–O carácter parcial de doble enlace, lo que lo hace muy fuerte',
            },
          ],
        },
        {
          tipo: 'contraste',
          etiqueta: 'd)',
          titulo: 'Alcohol alílico frente a homoalílico + HI/etanol',
          lados: [
            {
              titulo: 'CH₃–CH=CH–CH₂OH — alílico, muy reactivo',
              items: [
                'OH en C1, doble enlace en C2=C3',
                'el carbono que ioniza está pegado al doble enlace',
                'catión alílico deslocalizado entre C1 y C3',
              ],
              nota: 'La resonancia estabiliza mucho el intermediario: SN1 rápida',
            },
            {
              titulo: 'H₂C=CH–CH₂–CH₂OH — homoalílico, poco reactivo',
              items: [
                'OH en C1, doble enlace en C3=C4',
                'un CH₂ los separa: no hay conjugación posible',
                'un catión en C1 sería primario y sin estabilizar',
              ],
              nota:
                'Se comporta como un alcohol primario corriente: tendría que ir por SN2, mucho más lento',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Un carbono de más entre el OH y el sistema π cambia por completo el resultado. Conviene numerar la cadena y comprobar si el carbono que perdería el agua es realmente contiguo al doble enlace o al anillo — es la misma distinción que reaparece en las preguntas 4d y 7b.',
        },
      ],
    },
    {
      n: 3,
      titulo: 'Identificar los tres alcoholes de fórmula C₄H₁₀O',
      enunciado:
        'A es ópticamente activo, se oxida a una metilcetona y con HBr/H₂O da un racemato de C₄H₉Br. B se oxida a un ácido de cadena lineal. C no se oxida. Identificar los tres.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Los isómeros posibles son 1-butanol, 2-butanol, isobutanol y terc-butanol. Cada pista apunta a una característica estructural distinta: la actividad óptica exige un estereocentro, el producto de oxidación revela el grado de sustitución, y no oxidarse en absoluto solo le ocurre a un tipo de alcohol.',
        },
        {
          tipo: 'datos',
          titulo: 'Compuesto por compuesto',
          items: [
            {
              etiqueta: 'A',
              valor: '2-butanol — CH₃–CH(OH)–CH₂CH₃',
              detalle:
                'el único isómero secundario. Su C2 lleva OH, H, CH₃ y CH₂CH₃: cuatro grupos distintos, de ahí la actividad óptica. Se oxida a butan-2-ona, que es una metilcetona, y con HBr en agua va por SN1: el carbocatión secundario es plano y el Br⁻ lo ataca por ambas caras con igual probabilidad, dando el racemato de 2-bromobutano que menciona el enunciado',
            },
            {
              etiqueta: 'B',
              valor: '1-butanol — CH₃CH₂CH₂CH₂OH',
              detalle:
                'alcohol primario sin ramificar: se oxida pasando por el aldehído hasta ácido butanoico, de cadena lineal. El isobutanol también es primario, pero daría ácido isobutírico, que es ramificado — por eso queda descartado',
            },
            {
              etiqueta: 'C',
              valor: 'terc-butanol — (CH₃)₃C–OH',
              detalle:
                'el único terciario. No se oxida con KMnO₄, dicromato ni PCC porque el carbono que lleva el –OH no tiene ningún hidrógeno que perder para formar el C=O',
            },
          ],
        },
        {
          tipo: 'clave',
          texto: 'A = butan-2-ol · B = butan-1-ol · C = terc-butanol (2-metil-2-propanol)',
        },
        {
          tipo: 'nota',
          texto:
            'El isobutanol es el isómero que sobra, y no es casual: está ahí para comprobar que se distingue «alcohol primario» de «alcohol primario sin ramificar». La pista de que el ácido es de cadena lineal es la que lo elimina.',
        },
      ],
    },
    {
      n: 4,
      titulo: '¿SN1 o SN2 en cada caso?',
      enunciado: 'Predecir el mecanismo de cada reacción según el sustrato y el disolvente.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Sustrato, disolvente y veredicto',
          encabezados: ['Reacción', 'Sustrato', 'Disolvente', 'Mecanismo'],
          filas: [
            [
              'a) 1-feniletanol + HCl/H₂O',
              'secundario y bencílico: catión doblemente estabilizado',
              'agua, polar prótico',
              'SN1',
            ],
            [
              'b) 3-fenil-1-propanol + HBr/DMSO',
              'primario; el fenilo está a dos CH₂, no es bencílico',
              'DMSO, polar aprótico: deja al Br⁻ desnudo',
              'SN2',
            ],
            [
              'c) 1-(ciclohex-2-en-1-il)etanol + HCl/CH₃OH',
              'secundario y alílico: catión estabilizado por resonancia',
              'metanol, prótico',
              'SN1',
            ],
            [
              'd) 2-metilbut-3-en-1-ol + HI/dioxano',
              'primario y homoalílico: el doble enlace está en C3=C4, sin conjugación con C1',
              'dioxano, aprótico y poco polar',
              'SN2',
            ],
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Los dos factores se refuerzan, no se contradicen',
          texto:
            'En las cuatro reacciones el sustrato y el disolvente apuntan al mismo mecanismo, que es la situación cómoda. El caso (d) es el que exige leer con cuidado: parece alílico a primera vista, pero el CH₂ intermedio —el C2, que además lleva el metilo— rompe la conjugación y lo deja como un primario corriente, sin ninguna vía para formar un carbocatión.',
        },
      ],
    },
    {
      n: 5,
      titulo: 'Explicar los resultados estereoquímicos del 1-feniletanol con HBr',
      enunciado:
        'En agua se obtiene 98 % de racemización y 2 % de inversión; en metanol, 73 % de racemización y 27 % de inversión. Explicarlo.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Un SN1 ideal —con un carbocatión completamente libre, plano y atacable por igual desde ambas caras— daría racemización total: 50:50, cero inversión neta. Que en ambos experimentos aparezca algo de inversión indica que el carbocatión no llega a estar del todo libre en el momento del ataque. Lo explica el modelo de par iónico de Hughes-Ingold.',
        },
        {
          tipo: 'parrafo',
          titulo: 'Qué es el par iónico',
          texto:
            'Al romperse el enlace C–OH₂⁺, el agua saliente no se aleja de golpe: durante un instante permanece muy cerca del carbono formando un par iónico íntimo que tapa parcialmente la cara por la que salió. Mientras ese par no se separa, el Br⁻ tiene más probabilidad de atacar por la cara libre que por la bloqueada, y eso produce un exceso de inversión sobre el 50:50 esperado.',
        },
        {
          tipo: 'contraste',
          titulo: 'Por qué el disolvente cambia la proporción',
          lados: [
            {
              titulo: 'Agua — 98 % racemización, 2 % inversión',
              items: [
                'muy polar, constante dieléctrica alta',
                'separa los iones con rapidez',
                'el carbocatión queda verdaderamente libre y simétrico',
              ],
              nota:
                'El intermediario pierde toda «memoria» de su configuración original, así que domina la racemización casi completa',
            },
            {
              titulo: 'Metanol — 73 % racemización, 27 % inversión',
              items: [
                'menos polar, constante dieléctrica menor',
                'separa el par iónico con más dificultad',
                'el par íntimo persiste más tiempo antes de disociarse',
              ],
              nota:
                'Mientras el saliente sigue estorbando una cara, el ataque ocurre preferentemente por la opuesta: se conserva más recuerdo de la configuración de partida y sube la inversión',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Los dos experimentos son SN1; lo que cambia es la eficacia del disolvente para separar el par iónico intermedio, y con ella la proporción racemización/inversión.',
        },
      ],
    },
    {
      n: 6,
      titulo: '(R)-butan-2-ol con HCl diluido frente a HBr concentrado',
      enunciado:
        'Explicar por qué el mismo sustrato, en DMF, da mezcla de estereoisómeros con HCl diluido y un único producto invertido con HBr concentrado.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'El butan-2-ol es secundario, es decir, está justo en la frontera: puede ir por SN1 o por SN2 según lo que le ofrezca el medio. Quien decide aquí no es el sustrato sino el nucleófilo, por su fuerza y por su concentración.',
        },
        {
          tipo: 'contraste',
          titulo: 'Dos nucleófilos, dos mecanismos',
          lados: [
            {
              titulo: 'HCl diluido → SN1, mezcla (R) y (S)',
              items: [
                'el Cl⁻ es duro y poco polarizable: nucleófilo débil',
                'además está en baja concentración',
                'el ataque directo es lento, porque su velocidad depende de [Nu⁻]',
                'da tiempo a que el alcohol protonado pierda agua',
              ],
              nota:
                'Se forma el carbocatión secundario plano, que el Cl⁻ ataca por cualquiera de las dos caras: mezcla de (R)- y (S)-2-clorobutano, con racemización parcial',
            },
            {
              titulo: 'HBr concentrado → SN2, solo (S)',
              items: [
                'el Br⁻ es blando y polarizable: nucleófilo mucho más fuerte',
                'y está en alta concentración',
                'ataca por detrás antes de que haya ionización',
                'la reacción además es más rápida',
              ],
              nota:
                'El desplazamiento es concertado y ocurre con inversión de Walden completa: se obtiene exclusivamente (S)-2-bromobutano',
            },
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Un mismo sustrato secundario puede tomar dos caminos: con nucleófilo débil y diluido gana SN1, con racemización parcial; con nucleófilo fuerte y concentrado gana SN2, con inversión total y mayor velocidad, porque v = k[sustrato][Nu⁻].',
        },
      ],
    },
    {
      n: 7,
      titulo: 'Ordenar en reactividad SN1 creciente',
      enunciado: 'Ordenar cada par de menor a mayor reactividad frente a un mecanismo SN1.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'En SN1 el paso lento es la ionización, así que la pregunta se reduce siempre a la misma: ¿cuál de los dos genera el carbocatión más estable?',
        },
        {
          tipo: 'tabla',
          titulo: 'Orden creciente y el porqué',
          encabezados: ['', 'Orden creciente', 'Razón'],
          filas: [
            [
              'a)',
              '(CH₃)₃C–OH < C₆H₅–C(CH₃)₂–OH',
              'el alcohol cumílico es terciario y bencílico a la vez: suma la hiperconjugación de dos metilos y la resonancia con el anillo, mientras que el terc-butilo solo dispone de hiperconjugación',
            ],
            [
              'b)',
              'C₆H₅CH₂CH₂OH < C₆H₅CH₂OH',
              'el bencílico tiene el carbono reactivo pegado al anillo y su catión se estabiliza por resonancia pese a ser primario; en el 2-feniletanol un CH₂ los separa y el catión sería un primario simple, prácticamente inaccesible',
            ],
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El apartado (b) es el mismo contraste alílico/homoalílico de la pregunta 2d trasladado al anillo aromático: la estabilización por resonancia solo funciona si el carbono que ioniza está directamente unido al sistema π.',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Ordenar en reactividad SN2 creciente',
      enunciado: 'Ordenar cada serie de menor a mayor reactividad frente a un mecanismo SN2.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'En SN2 el criterio se invierte respecto a la pregunta anterior: ya no importa la estabilidad de ningún carbocatión —no lo hay— sino si el nucleófilo puede llegar al carbono por detrás.',
        },
        {
          tipo: 'datos',
          titulo: 'a) Terciario frente a primario',
          items: [
            {
              etiqueta: '1.º (el más lento)',
              valor: '(CH₃)₃C–OH',
              detalle:
                'los tres metilos bloquean por completo el acceso por detrás; de hecho no reacciona por SN2 en absoluto, solo por SN1',
            },
            {
              etiqueta: '2.º',
              valor: 'CH₃CH₂CH₂–OH',
              detalle: 'primario y sin ramificar: el sustrato SN2 ideal',
            },
          ],
        },
        {
          tipo: 'datos',
          titulo: 'b) Tres grados de impedimento',
          items: [
            {
              etiqueta: '1.º (el más lento)',
              valor: '(CH₃)₃C–CH₂OH, alcohol neopentílico',
              detalle:
                'es primario, pero su carbono β cuaternario tapa la trayectoria de ataque: el efecto neopentílico lo deja incluso por debajo de muchos secundarios',
            },
            {
              etiqueta: '2.º',
              valor: '(CH₃)₂CH–CH(OH)–CH₃, 3-metil-2-butanol',
              detalle:
                'secundario y con un isopropilo voluminoso unido justo al carbono reactivo: impedimento considerable en el sitio del ataque',
            },
            {
              etiqueta: '3.º (el más rápido)',
              valor: '(CH₃)₂CH–CH₂OH, isobutanol',
              detalle: 'primario con ramificación en β: estorba, pero solo de forma moderada',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El caso neopentílico merece recordarse',
          texto:
            'La regla «primario > secundario > terciario» vale para sustratos sin ramificar. El alcohol neopentílico es la excepción que la matiza: siendo primario reacciona más lento que un secundario, porque lo que cuenta no es el grado de sustitución del carbono que reacciona sino el espacio libre alrededor de él, y ahí el carbono β pesa tanto como el α.',
        },
      ],
    },
  ],
};
