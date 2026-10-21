/**
 * Datos de muestra del prototipo (`prototipos/espacio-estudio/data.js`), copiados tal cual
 * para comparar el port con el original. Se sustituyen por los sílabos reales en la Fase 2.
 */
export interface SeccionMuestra { id: string; title: string; body: string; bullets?: string[] }
export interface PreguntaMuestra { prompt: string; options: string[]; correct: number; explanation: string }
export interface LeccionMuestra { id: string; title: string; kicker?: string; minutes?: number; available?: boolean; relatedLab?: string | null; summary: { intro: string; objectives: string[]; sections: SeccionMuestra[]; keyPoints: string[] }; question: PreguntaMuestra }
export interface GrupoMuestra { id: string; title: string; lessons: LeccionMuestra[] }
export interface CursoMuestra { id: string; name: string; shortName?: string; icon: string; subtitle?: string; groups: GrupoMuestra[] }
export interface LabMuestra { id: string; title: string; category: string; subject: string; description: string; kind: string }
export interface DatosMuestra { courses: CursoMuestra[]; labs: LabMuestra[] }

export const MUESTRA: DatosMuestra = {
  "courses": [
    {
      "id": "cardiovascular",
      "name": "Sistema Cardiovascular",
      "shortName": "Cardiovascular",
      "icon": "heart",
      "subtitle": "M1552 · Medicina · UPCH",
      "groups": [
        {
          "id": "cardio-estructura",
          "title": "01 · Anatomía y estructura",
          "lessons": [
            {
              "id": "cardio-mediastino",
              "title": "Mediastino: definición y divisiones",
              "kicker": "ANATOMÍA · T1",
              "minutes": 8,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Ubica el corazón dentro del tórax y organiza sus relaciones a partir de las divisiones del mediastino.",
                "objectives": [
                  "Reconocer los límites generales del mediastino.",
                  "Distinguir sus divisiones principales.",
                  "Relacionar el corazón con el mediastino medio."
                ],
                "sections": [
                  {
                    "id": "ubicacion",
                    "title": "Un espacio entre ambos pulmones",
                    "body": "El mediastino es el compartimento central de la cavidad torácica, situado entre los sacos pleurales. Se extiende desde la apertura torácica superior hasta el diafragma y desde el esternón hasta la columna torácica."
                  },
                  {
                    "id": "divisiones",
                    "title": "Cómo ordenar sus divisiones",
                    "body": "Un plano que pasa por el ángulo esternal separa el mediastino superior del inferior. El inferior se subdivide en anterior, medio y posterior.",
                    "bullets": [
                      "Superior: por encima del plano del ángulo esternal.",
                      "Medio: contiene el pericardio y el corazón.",
                      "Posterior: se sitúa detrás del pericardio."
                    ]
                  },
                  {
                    "id": "relaciones",
                    "title": "Aprender por relaciones",
                    "body": "Estudia las estructuras como vecinos de un mismo espacio. La posición de la tráquea, el esófago y los grandes vasos ayuda a construir un mapa tridimensional del tórax."
                  }
                ],
                "keyPoints": [
                  "El mediastino ocupa el centro del tórax.",
                  "El mediastino inferior tiene tres subdivisiones.",
                  "Corazón y pericardio se ubican en el mediastino medio."
                ]
              },
              "question": {
                "prompt": "¿En qué subdivisión del mediastino inferior se encuentra el corazón?",
                "options": [
                  "Medio",
                  "Anterior",
                  "Posterior",
                  "Superior"
                ],
                "correct": 0,
                "explanation": "El mediastino medio contiene el corazón, su pericardio y las raíces de los grandes vasos."
              },
              "relatedLab": "ciclo-cardiaco"
            },
            {
              "id": "cardio-pericardio",
              "title": "Pericardio y morfología externa del corazón",
              "kicker": "ANATOMÍA · T2",
              "minutes": 12,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Explora la envoltura del corazón y reconoce las referencias que permiten orientarlo en el espacio.",
                "objectives": [
                  "Distinguir el pericardio fibroso del seroso.",
                  "Identificar base y vértice cardíacos.",
                  "Reconocer los grandes vasos en una vista general."
                ],
                "sections": [
                  {
                    "id": "envoltura",
                    "title": "Una envoltura que acompaña al movimiento",
                    "body": "El pericardio fibroso forma la capa externa resistente. El pericardio seroso tiene una hoja parietal y otra visceral; esta última también recibe el nombre de epicardio."
                  },
                  {
                    "id": "orientacion",
                    "title": "Base, vértice y superficies",
                    "body": "El corazón se dispone de forma oblicua. El vértice está formado principalmente por el ventrículo izquierdo y apunta hacia delante, abajo y a la izquierda.",
                    "bullets": [
                      "La base mira principalmente hacia atrás.",
                      "La superficie anterior es predominantemente ventricular derecha.",
                      "Los surcos externos permiten reconocer límites entre cavidades."
                    ]
                  },
                  {
                    "id": "vasos",
                    "title": "Seguir las conexiones",
                    "body": "Relaciona las venas cavas con la aurícula derecha, las venas pulmonares con la izquierda y las grandes arterias con sus ventrículos. Este recorrido facilita leer cualquier vista anatómica."
                  }
                ],
                "keyPoints": [
                  "Epicardio es la hoja visceral del pericardio seroso.",
                  "El ventrículo izquierdo forma el vértice.",
                  "Los vasos permiten orientarse entre cavidades."
                ]
              },
              "question": {
                "prompt": "¿Qué cavidad forma principalmente el vértice del corazón?",
                "options": [
                  "Aurícula derecha",
                  "Ventrículo derecho",
                  "Ventrículo izquierdo",
                  "Aurícula izquierda"
                ],
                "correct": 2,
                "explanation": "El vértice cardíaco corresponde principalmente al ventrículo izquierdo."
              },
              "relatedLab": "ciclo-cardiaco"
            },
            {
              "id": "cardio-interna",
              "title": "Morfología interna del corazón",
              "kicker": "ANATOMÍA · T3",
              "minutes": 10,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Conecta cavidades, válvulas y trayecto de la sangre para construir una imagen funcional del corazón.",
                "objectives": [
                  "Distinguir las cuatro cavidades.",
                  "Ubicar las válvulas cardíacas.",
                  "Seguir el trayecto de la sangre por ambos circuitos."
                ],
                "sections": [
                  {
                    "id": "cavidades",
                    "title": "Dos bombas conectadas en serie",
                    "body": "El lado derecho recibe sangre de la circulación sistémica y la impulsa hacia los pulmones. El izquierdo recibe sangre de los pulmones y la envía a la circulación sistémica."
                  },
                  {
                    "id": "valvulas",
                    "title": "Cuatro válvulas, un flujo dirigido",
                    "body": "Las válvulas se abren y cierran por diferencias de presión entre los compartimentos que separan.",
                    "bullets": [
                      "Tricúspide: aurícula derecha y ventrículo derecho.",
                      "Mitral: aurícula izquierda y ventrículo izquierdo.",
                      "Pulmonar y aórtica: salidas de los ventrículos."
                    ]
                  },
                  {
                    "id": "paredes",
                    "title": "La estructura responde al trabajo",
                    "body": "La pared del ventrículo izquierdo es más gruesa que la del derecho. Ambos desplazan el mismo volumen en condiciones estables, pero trabajan frente a circuitos con presiones diferentes."
                  }
                ],
                "keyPoints": [
                  "Los dos lados del corazón trabajan en serie.",
                  "Las válvulas responden a gradientes de presión.",
                  "La mitral comunica las cavidades izquierdas."
                ]
              },
              "question": {
                "prompt": "¿Qué válvula separa la aurícula izquierda del ventrículo izquierdo?",
                "options": [
                  "Tricúspide",
                  "Pulmonar",
                  "Aórtica",
                  "Mitral"
                ],
                "correct": 3,
                "explanation": "La válvula mitral es la válvula auriculoventricular izquierda."
              },
              "relatedLab": "ciclo-cardiaco"
            }
          ]
        },
        {
          "id": "cardio-funcion",
          "title": "02 · Función y actividad eléctrica",
          "lessons": [
            {
              "id": "cardio-ciclo",
              "title": "Ciclo cardíaco y curvas presión-volumen",
              "kicker": "FISIOLOGÍA · CLASE 5",
              "minutes": 14,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Sigue un latido completo relacionando el movimiento de la sangre con la apertura de las válvulas y los cambios de presión y volumen.",
                "objectives": [
                  "Ordenar las fases del ciclo cardíaco.",
                  "Relacionar cada fase con el estado valvular.",
                  "Reconocer los ejes de una curva presión-volumen."
                ],
                "sections": [
                  {
                    "id": "fases",
                    "title": "Cuatro momentos de un mismo latido",
                    "body": "El ciclo ventricular combina llenado, contracción isovolumétrica, eyección y relajación isovolumétrica. Las fases son continuas: cada una prepara las condiciones para la siguiente.",
                    "bullets": [
                      "Llenado: aumenta el volumen del ventrículo.",
                      "Contracción isovolumétrica: aumenta la presión sin cambio de volumen.",
                      "Eyección: disminuye el volumen ventricular."
                    ]
                  },
                  {
                    "id": "presion",
                    "title": "La presión decide cuándo se abre una válvula",
                    "body": "La válvula aórtica se abre cuando la presión ventricular supera a la aórtica. La mitral se abre cuando la presión de la aurícula izquierda supera a la del ventrículo izquierdo."
                  },
                  {
                    "id": "curva",
                    "title": "Leer la curva presión-volumen",
                    "body": "El eje horizontal representa volumen y el vertical presión. Los segmentos verticales corresponden a fases isovolumétricas; el ancho del bucle representa el volumen sistólico. El esquema es una herramienta para conectar eventos, no una fotografía aislada."
                  }
                ],
                "keyPoints": [
                  "Sístole y diástole forman un ciclo continuo.",
                  "En las fases isovolumétricas todas las válvulas están cerradas.",
                  "El ancho del bucle corresponde al volumen sistólico."
                ]
              },
              "question": {
                "prompt": "Durante la contracción isovolumétrica ventricular, ¿qué ocurre con el volumen?",
                "options": [
                  "Aumenta rápidamente",
                  "Permanece constante",
                  "Disminuye por eyección",
                  "Se vuelve igual a cero"
                ],
                "correct": 1,
                "explanation": "Todas las válvulas están cerradas: cambia la presión, pero no entra ni sale sangre del ventrículo."
              },
              "relatedLab": "ciclo-cardiaco"
            },
            {
              "id": "cardio-electrico",
              "title": "Sistema eléctrico, potencial de acción y ECG",
              "kicker": "FISIOLOGÍA · CLASE 4",
              "minutes": 11,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Relaciona la propagación del impulso con la secuencia de activación de aurículas y ventrículos.",
                "objectives": [
                  "Reconocer el recorrido general del impulso.",
                  "Distinguir actividad eléctrica y contracción.",
                  "Relacionar las ondas principales del ECG con su origen."
                ],
                "sections": [
                  {
                    "id": "recorrido",
                    "title": "Una secuencia coordinada",
                    "body": "En el ritmo sinusal, la activación comienza en el nodo sinoauricular, se propaga por las aurículas y alcanza el nodo auriculoventricular. Después sigue por el haz de His, sus ramas y la red de Purkinje."
                  },
                  {
                    "id": "registro",
                    "title": "Qué registra el electrocardiograma",
                    "body": "El ECG representa diferencias de potencial detectadas desde la superficie corporal. La señal eléctrica precede a la respuesta mecánica.",
                    "bullets": [
                      "Onda P: despolarización auricular.",
                      "Complejo QRS: despolarización ventricular.",
                      "Onda T: repolarización ventricular."
                    ]
                  },
                  {
                    "id": "conexion",
                    "title": "Conectar el trazado con el corazón",
                    "body": "Para estudiar el trazado, sigue la misma secuencia en un esquema anatómico. Cada derivación observa la actividad desde una dirección particular; por eso una misma activación puede tener apariencias diferentes."
                  }
                ],
                "keyPoints": [
                  "El nodo sinusal inicia el ritmo sinusal.",
                  "El ECG muestra actividad eléctrica.",
                  "El QRS corresponde a la despolarización ventricular."
                ]
              },
              "question": {
                "prompt": "¿Qué representa principalmente el complejo QRS?",
                "options": [
                  "Contracción de la aorta",
                  "Repolarización auricular aislada",
                  "Despolarización ventricular",
                  "Llenado auricular"
                ],
                "correct": 2,
                "explanation": "El complejo QRS corresponde a la despolarización de los ventrículos."
              },
              "relatedLab": "electrocardiograma"
            },
            {
              "id": "cardio-circulacion",
              "title": "Circulación sistémica y coronaria",
              "kicker": "INTEGRACIÓN · TBL 1",
              "minutes": 9,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Organiza el circuito sistémico y reconoce cómo recibe sangre el propio músculo cardíaco.",
                "objectives": [
                  "Seguir el circuito sistémico.",
                  "Ubicar el origen de las arterias coronarias.",
                  "Diferenciar intercambio capilar y conducción vascular."
                ],
                "sections": [
                  {
                    "id": "circuito",
                    "title": "Del ventrículo izquierdo a la aurícula derecha",
                    "body": "La sangre sale por la aorta, se distribuye por arterias y arteriolas, atraviesa los capilares y retorna por vénulas y venas. Las venas cavas completan el regreso al corazón."
                  },
                  {
                    "id": "coronarias",
                    "title": "El corazón también necesita su propio circuito",
                    "body": "Las arterias coronarias derecha e izquierda nacen en la raíz de la aorta y distribuyen sangre al miocardio.",
                    "bullets": [
                      "Las arterias transportan sangre desde el corazón.",
                      "Los capilares permiten intercambio con los tejidos.",
                      "Las venas retornan sangre hacia el corazón."
                    ]
                  },
                  {
                    "id": "integracion",
                    "title": "Pensar en un circuito cerrado",
                    "body": "El flujo depende de la diferencia de presión y de la resistencia del circuito. Comprender ambos conceptos permite conectar la estructura vascular con la función de bomba."
                  }
                ],
                "keyPoints": [
                  "Las coronarias nacen de la aorta.",
                  "La circulación sistémica retorna a la aurícula derecha.",
                  "El intercambio ocurre principalmente en la microcirculación."
                ]
              },
              "question": {
                "prompt": "¿De qué gran vaso se originan las arterias coronarias?",
                "options": [
                  "Aorta",
                  "Vena cava superior",
                  "Tronco pulmonar",
                  "Vena pulmonar"
                ],
                "correct": 0,
                "explanation": "Las arterias coronarias nacen de la raíz de la aorta."
              },
              "relatedLab": "electrocardiograma"
            }
          ]
        }
      ]
    },
    {
      "id": "neurologia",
      "name": "Sistema Nervioso",
      "shortName": "Neurología",
      "icon": "brain",
      "subtitle": "M1551 · Medicina · UPCH",
      "groups": [
        {
          "id": "neuro-organizacion",
          "title": "01 · Organización y desarrollo",
          "lessons": [
            {
              "id": "neuro-histologia",
              "title": "Introducción al sistema nervioso",
              "kicker": "HISTOLOGÍA · SEMANA 1",
              "minutes": 8,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Reconoce las células y las grandes divisiones que organizan el tejido nervioso.",
                "objectives": [
                  "Distinguir sistema nervioso central y periférico.",
                  "Identificar las partes básicas de una neurona.",
                  "Reconocer la función de apoyo de la glía."
                ],
                "sections": [
                  {
                    "id": "divisiones",
                    "title": "Una red con organización",
                    "body": "El sistema nervioso central incluye encéfalo y médula espinal. El periférico conecta estas estructuras con el resto del organismo mediante nervios y ganglios."
                  },
                  {
                    "id": "neurona",
                    "title": "La neurona como unidad de comunicación",
                    "body": "El soma contiene el núcleo y buena parte de la maquinaria celular. Las dendritas reciben numerosas señales y el axón conduce potenciales de acción hacia sus terminales.",
                    "bullets": [
                      "Soma: mantenimiento e integración celular.",
                      "Dendritas: recepción de señales.",
                      "Axón: conducción hacia otras células."
                    ]
                  },
                  {
                    "id": "glia",
                    "title": "Más que una red de neuronas",
                    "body": "Las células gliales participan en el soporte, el ambiente químico y la mielinización. El funcionamiento del tejido depende de la colaboración entre neuronas y glía."
                  }
                ],
                "keyPoints": [
                  "Encéfalo y médula forman el SNC.",
                  "Los nervios pertenecen al sistema periférico.",
                  "La glía cumple funciones activas de soporte."
                ]
              },
              "question": {
                "prompt": "¿Cuál de estas estructuras pertenece al sistema nervioso central?",
                "options": [
                  "Nervio mediano",
                  "Ganglio espinal",
                  "Médula espinal",
                  "Nervio tibial"
                ],
                "correct": 2,
                "explanation": "La médula espinal y el encéfalo constituyen el sistema nervioso central."
              },
              "relatedLab": "poligono-willis"
            },
            {
              "id": "neuro-embrio",
              "title": "Embriología del sistema nervioso",
              "kicker": "EMBRIOLOGÍA · SEMANA 1",
              "minutes": 10,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Usa el desarrollo temprano para comprender la organización general del sistema nervioso.",
                "objectives": [
                  "Relacionar el tubo neural con el SNC.",
                  "Reconocer el origen de la cresta neural.",
                  "Ordenar las vesículas encefálicas primarias."
                ],
                "sections": [
                  {
                    "id": "origen",
                    "title": "Del ectodermo al tubo neural",
                    "body": "La placa neural se pliega y forma el tubo neural durante la neurulación. Su región craneal dará origen al encéfalo y su región caudal a la médula espinal."
                  },
                  {
                    "id": "vesiculas",
                    "title": "Tres regiones para empezar el mapa",
                    "body": "El extremo craneal se organiza inicialmente en prosencéfalo, mesencéfalo y rombencéfalo.",
                    "bullets": [
                      "Prosencéfalo: región anterior.",
                      "Mesencéfalo: región media.",
                      "Rombencéfalo: región posterior."
                    ]
                  },
                  {
                    "id": "cresta",
                    "title": "La contribución de la cresta neural",
                    "body": "Las células de la cresta neural migran y contribuyen a numerosas estructuras, incluidos varios componentes del sistema nervioso periférico. Distinguir tubo y cresta evita confundir sus derivados."
                  }
                ],
                "keyPoints": [
                  "El tubo neural origina el SNC.",
                  "Las vesículas primarias son tres.",
                  "La cresta neural tiene células migratorias."
                ]
              },
              "question": {
                "prompt": "¿Qué estructura embrionaria origina principalmente el sistema nervioso central?",
                "options": [
                  "Tubo neural",
                  "Somita",
                  "Intestino primitivo",
                  "Saco vitelino"
                ],
                "correct": 0,
                "explanation": "El encéfalo y la médula espinal derivan del tubo neural."
              },
              "relatedLab": "checkpoints"
            },
            {
              "id": "neuro-fisiologia",
              "title": "Fisiología neuronal 1",
              "kicker": "FISIOLOGÍA · SEMANA 2",
              "minutes": 11,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Relaciona gradientes iónicos, membrana y comunicación eléctrica de la neurona.",
                "objectives": [
                  "Describir el potencial de membrana.",
                  "Distinguir señales graduadas y potenciales de acción.",
                  "Reconocer la función aislante de la mielina."
                ],
                "sections": [
                  {
                    "id": "membrana",
                    "title": "Una diferencia eléctrica entre dos lados",
                    "body": "La distribución de iones y la permeabilidad selectiva de la membrana contribuyen al potencial de membrana. Los canales iónicos permiten cambios rápidos en esa diferencia eléctrica."
                  },
                  {
                    "id": "senal",
                    "title": "De la integración a la propagación",
                    "body": "Las señales graduadas varían en amplitud. Cuando se alcanzan las condiciones de disparo, el potencial de acción se propaga por el axón.",
                    "bullets": [
                      "Las dendritas y el soma integran muchas entradas.",
                      "Los canales dependientes de voltaje participan en el potencial de acción.",
                      "La señal viaja hacia las terminales axónicas."
                    ]
                  },
                  {
                    "id": "mielina",
                    "title": "Conducción y mielina",
                    "body": "La mielina modifica las propiedades eléctricas del axón. En axones mielinizados, los potenciales de acción se regeneran en los nodos de Ranvier, lo que permite una conducción saltatoria."
                  }
                ],
                "keyPoints": [
                  "El potencial depende de gradientes y permeabilidad.",
                  "El potencial de acción es una señal propagada.",
                  "Los nodos de Ranvier interrumpen la vaina de mielina."
                ]
              },
              "question": {
                "prompt": "¿En qué estructura se regenera el potencial de acción en un axón mielinizado?",
                "options": [
                  "Núcleo neuronal",
                  "Nodo de Ranvier",
                  "Nucléolo",
                  "Aparato de Golgi"
                ],
                "correct": 1,
                "explanation": "Los nodos de Ranvier concentran canales que permiten regenerar el potencial de acción."
              },
              "relatedLab": null
            }
          ]
        },
        {
          "id": "neuro-anatomia",
          "title": "02 · Anatomía e integración",
          "lessons": [
            {
              "id": "neuro-medula",
              "title": "Columna vertebral y médula espinal",
              "kicker": "ANATOMÍA · CT6",
              "minutes": 12,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Explora la organización de la médula y su continuidad con los nervios espinales.",
                "objectives": [
                  "Distinguir sustancia gris y blanca.",
                  "Ubicar las raíces dorsal y ventral.",
                  "Reconocer el papel de las meninges."
                ],
                "sections": [
                  {
                    "id": "corte",
                    "title": "Leer un corte transversal",
                    "body": "En la médula, la sustancia gris ocupa una región central con forma de H. La sustancia blanca la rodea y contiene vías que comunican distintos niveles del sistema nervioso."
                  },
                  {
                    "id": "raices",
                    "title": "Entrada sensitiva y salida motora",
                    "body": "Las raíces dorsales llevan información aferente hacia la médula; las ventrales contienen fibras eferentes que salen de ella.",
                    "bullets": [
                      "Raíz dorsal: entrada sensitiva.",
                      "Ganglio espinal: somas de neuronas sensitivas.",
                      "Raíz ventral: salida motora."
                    ]
                  },
                  {
                    "id": "proteccion",
                    "title": "Una estructura protegida",
                    "body": "La médula se encuentra dentro del conducto vertebral, rodeada de meninges y líquido cefalorraquídeo. Para orientarte, identifica primero anterior y posterior y después los elementos internos."
                  }
                ],
                "keyPoints": [
                  "La sustancia gris medular es central.",
                  "La raíz dorsal lleva aferencias.",
                  "La médula está protegida por columna y meninges."
                ]
              },
              "question": {
                "prompt": "¿Qué raíz lleva información sensitiva hacia la médula espinal?",
                "options": [
                  "Ventral",
                  "Dorsal",
                  "Aórtica",
                  "Pulmonar"
                ],
                "correct": 1,
                "explanation": "Las fibras sensitivas aferentes ingresan por las raíces dorsales."
              },
              "relatedLab": null
            },
            {
              "id": "neuro-tronco",
              "title": "Tronco encefálico",
              "kicker": "ANATOMÍA · CT7",
              "minutes": 13,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Construye un mapa del tronco encefálico desde sus tres grandes regiones.",
                "objectives": [
                  "Ordenar mesencéfalo, puente y bulbo.",
                  "Relacionar el tronco con la médula y el encéfalo.",
                  "Reconocer su función de paso e integración."
                ],
                "sections": [
                  {
                    "id": "regiones",
                    "title": "Tres regiones conectadas",
                    "body": "El tronco encefálico incluye mesencéfalo, puente y bulbo raquídeo. El bulbo continúa con la médula espinal y el mesencéfalo se relaciona superiormente con el diencéfalo."
                  },
                  {
                    "id": "organizacion",
                    "title": "Vías y núcleos en el mismo espacio",
                    "body": "Dentro del tronco conviven vías ascendentes, vías descendentes y numerosos núcleos. Estudiar su posición relativa permite pasar de una vista externa a un corte.",
                    "bullets": [
                      "Mesencéfalo: región más superior.",
                      "Puente: región intermedia.",
                      "Bulbo raquídeo: continuidad con la médula."
                    ]
                  },
                  {
                    "id": "orientacion",
                    "title": "Empezar por referencias grandes",
                    "body": "Compara una vista anterior con una posterior y ubica el cerebelo antes de estudiar estructuras pequeñas. Ese mapa general hace más sencilla la identificación posterior."
                  }
                ],
                "keyPoints": [
                  "El tronco tiene tres regiones principales.",
                  "El bulbo continúa con la médula.",
                  "Las vías atraviesan un espacio con numerosos núcleos."
                ]
              },
              "question": {
                "prompt": "¿Cuál es el orden superior a inferior de las regiones del tronco encefálico?",
                "options": [
                  "Puente, bulbo, mesencéfalo",
                  "Bulbo, puente, mesencéfalo",
                  "Mesencéfalo, puente, bulbo",
                  "Mesencéfalo, bulbo, puente"
                ],
                "correct": 2,
                "explanation": "De superior a inferior se encuentran el mesencéfalo, el puente y el bulbo raquídeo."
              },
              "relatedLab": "poligono-willis"
            },
            {
              "id": "neuro-vascular",
              "title": "Vascularización del SNC, meninges y LCR",
              "kicker": "ANATOMÍA · CT10",
              "minutes": 12,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Relaciona la irrigación cerebral con las cubiertas y los espacios que rodean al sistema nervioso central.",
                "objectives": [
                  "Distinguir circulación carotídea y vertebrobasilar.",
                  "Reconocer las tres meninges.",
                  "Ubicar el espacio subaracnoideo."
                ],
                "sections": [
                  {
                    "id": "arterias",
                    "title": "Dos sistemas que se comunican",
                    "body": "La irrigación encefálica procede de los sistemas carotídeo interno y vertebrobasilar. En la base del encéfalo, sus conexiones forman el círculo arterial cerebral o polígono de Willis."
                  },
                  {
                    "id": "meninges",
                    "title": "Tres cubiertas para orientar los espacios",
                    "body": "De superficial a profunda se encuentran duramadre, aracnoides y piamadre.",
                    "bullets": [
                      "Duramadre: cubierta externa resistente.",
                      "Aracnoides: delimita superficialmente el espacio subaracnoideo.",
                      "Piamadre: acompaña de cerca la superficie del SNC."
                    ]
                  },
                  {
                    "id": "lcr",
                    "title": "El recorrido del líquido cefalorraquídeo",
                    "body": "El LCR circula por el sistema ventricular y el espacio subaracnoideo. Un esquema de continuidad entre cavidades y espacios ayuda a entender su recorrido."
                  }
                ],
                "keyPoints": [
                  "El polígono de Willis está en la base del encéfalo.",
                  "Las meninges se ordenan de duramadre a piamadre.",
                  "El espacio subaracnoideo contiene LCR."
                ]
              },
              "question": {
                "prompt": "¿Qué espacio contiene líquido cefalorraquídeo alrededor del encéfalo?",
                "options": [
                  "Subaracnoideo",
                  "Intramuscular",
                  "Pleural",
                  "Pericárdico"
                ],
                "correct": 0,
                "explanation": "El LCR circula alrededor del SNC en el espacio subaracnoideo."
              },
              "relatedLab": "poligono-willis"
            }
          ]
        }
      ]
    },
    {
      "id": "excretor",
      "name": "Aparato Excretor",
      "shortName": "Excretor",
      "icon": "kidney",
      "subtitle": "M1554 · Medicina · UPCH",
      "groups": [
        {
          "id": "renal-estructura",
          "title": "01 · Anatomía e histología",
          "lessons": [
            {
              "id": "renal-histologia",
              "title": "Histología del aparato excretor",
              "kicker": "HISTOLOGÍA · CLASE 1",
              "minutes": 9,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Relaciona las regiones del riñón con las unidades microscópicas que forman la orina.",
                "objectives": [
                  "Diferenciar corteza y médula renal.",
                  "Reconocer las partes de una nefrona.",
                  "Ubicar el corpúsculo renal."
                ],
                "sections": [
                  {
                    "id": "regiones",
                    "title": "Dos regiones, una organización continua",
                    "body": "La corteza renal es periférica y contiene corpúsculos renales y numerosos túbulos. La médula se organiza en pirámides y contiene segmentos tubulares y conductos colectores."
                  },
                  {
                    "id": "nefrona",
                    "title": "La unidad que conecta filtración y transporte",
                    "body": "Una nefrona combina corpúsculo renal y túbulo renal. Su disposición permite modificar el líquido que se filtra desde la sangre.",
                    "bullets": [
                      "Corpúsculo renal: glomérulo y cápsula glomerular.",
                      "Túbulo proximal: primer segmento tubular.",
                      "Asa de Henle y túbulo distal: segmentos posteriores."
                    ]
                  },
                  {
                    "id": "identificar",
                    "title": "Identificar antes de memorizar",
                    "body": "Al observar una lámina, localiza primero los corpúsculos renales para reconocer corteza. Después compara luces, epitelios y disposición de los túbulos."
                  }
                ],
                "keyPoints": [
                  "Los corpúsculos renales se encuentran en la corteza.",
                  "La nefrona integra corpúsculo y túbulo.",
                  "La médula se organiza en pirámides."
                ]
              },
              "question": {
                "prompt": "¿En qué región renal se encuentran los corpúsculos renales?",
                "options": [
                  "Pelvis renal",
                  "Corteza",
                  "Uréter",
                  "Cáliz mayor"
                ],
                "correct": 1,
                "explanation": "Los corpúsculos renales se localizan en la corteza del riñón."
              },
              "relatedLab": "nefron"
            },
            {
              "id": "renal-anatomia",
              "title": "Anatomía de los riñones y vías urinarias",
              "kicker": "ANATOMÍA · T2",
              "minutes": 11,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Sigue el trayecto de la orina desde el riñón hasta el exterior y reconoce sus conexiones anatómicas.",
                "objectives": [
                  "Ubicar los riñones en el retroperitoneo.",
                  "Ordenar el trayecto de la orina.",
                  "Distinguir uréter y uretra."
                ],
                "sections": [
                  {
                    "id": "posicion",
                    "title": "Una posición retroperitoneal",
                    "body": "Los riñones se sitúan en la pared posterior del abdomen. En su borde medial se encuentra el hilio renal, por donde pasan vasos, nervios y la pelvis renal."
                  },
                  {
                    "id": "trayecto",
                    "title": "Del tejido renal a la vejiga",
                    "body": "La orina alcanza los cálices, continúa hacia la pelvis renal y sigue por los uréteres hasta la vejiga.",
                    "bullets": [
                      "Cálices y pelvis: recogen la orina.",
                      "Uréteres: conectan los riñones con la vejiga.",
                      "Uretra: comunica la vejiga con el exterior."
                    ]
                  },
                  {
                    "id": "relaciones",
                    "title": "Seguir un trayecto sin confundir nombres",
                    "body": "Estudia cada órgano con su entrada, salida y relación con los vecinos. Un esquema de flechas ayuda a separar uréter, vejiga y uretra."
                  }
                ],
                "keyPoints": [
                  "Los riñones son retroperitoneales.",
                  "El uréter llega a la vejiga.",
                  "La uretra sale de la vejiga."
                ]
              },
              "question": {
                "prompt": "¿Qué conducto transporta la orina desde la pelvis renal hasta la vejiga?",
                "options": [
                  "Uretra",
                  "Arteria renal",
                  "Uréter",
                  "Vena renal"
                ],
                "correct": 2,
                "explanation": "Cada uréter conecta la pelvis de un riñón con la vejiga urinaria."
              },
              "relatedLab": "nefron"
            },
            {
              "id": "renal-embrio",
              "title": "Embriología del aparato excretor",
              "kicker": "EMBRIOLOGÍA · CLASE 2",
              "minutes": 10,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Comprende el riñón definitivo como resultado de la interacción de dos componentes embrionarios.",
                "objectives": [
                  "Reconocer el metanefros como riñón definitivo.",
                  "Distinguir brote ureteral y mesénquima metanéfrico.",
                  "Relacionar desarrollo y organización adulta."
                ],
                "sections": [
                  {
                    "id": "secuencia",
                    "title": "Una secuencia de sistemas renales",
                    "body": "Durante el desarrollo se describen pronefros, mesonefros y metanefros. El metanefros es el precursor del riñón definitivo."
                  },
                  {
                    "id": "interaccion",
                    "title": "Dos componentes que se inducen mutuamente",
                    "body": "La formación renal depende de la interacción entre el brote ureteral y el mesénquima metanéfrico.",
                    "bullets": [
                      "Brote ureteral: contribuye al sistema colector.",
                      "Mesénquima metanéfrico: contribuye a las nefronas.",
                      "La ramificación organiza la futura arquitectura renal."
                    ]
                  },
                  {
                    "id": "mapa",
                    "title": "Conectar el origen con la forma",
                    "body": "Dibuja una nefrona junto a un conducto colector y marca sus orígenes por separado. Esa distinción permite entender que estructuras conectadas en el adulto pueden tener historias de desarrollo distintas."
                  }
                ],
                "keyPoints": [
                  "El riñón definitivo deriva del metanefros.",
                  "El brote ureteral forma parte del sistema colector.",
                  "La nefrona tiene un origen distinto al colector."
                ]
              },
              "question": {
                "prompt": "¿Cuál es el precursor embrionario del riñón definitivo?",
                "options": [
                  "Metanefros",
                  "Pronefros",
                  "Tubo neural",
                  "Notocorda"
                ],
                "correct": 0,
                "explanation": "El metanefros da origen al riñón definitivo."
              },
              "relatedLab": "nefron"
            }
          ]
        },
        {
          "id": "renal-funcion",
          "title": "02 · Filtración y transporte",
          "lessons": [
            {
              "id": "renal-glomerulo",
              "title": "Líquidos corporales y función glomerular",
              "kicker": "FISIOLOGÍA · TBL 1",
              "minutes": 13,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Distingue la filtración glomerular de los cambios que ocurren después en el túbulo renal.",
                "objectives": [
                  "Ubicar el glomérulo en el trayecto renal.",
                  "Distinguir filtrado y orina final.",
                  "Reconocer las capas generales de la barrera de filtración."
                ],
                "sections": [
                  {
                    "id": "filtracion",
                    "title": "El primer paso ocurre en el corpúsculo",
                    "body": "El líquido pasa desde los capilares glomerulares hacia el espacio de la cápsula glomerular. Este filtrado inicia el recorrido tubular y todavía no equivale a la orina final."
                  },
                  {
                    "id": "barrera",
                    "title": "Una barrera especializada",
                    "body": "La filtración depende de una barrera con endotelio, membrana basal y estructuras de los podocitos.",
                    "bullets": [
                      "El glomérulo es una red de capilares.",
                      "El filtrado entra al espacio capsular.",
                      "El túbulo modifica el filtrado a lo largo de su recorrido."
                    ]
                  },
                  {
                    "id": "balance",
                    "title": "Filtrar, reabsorber y secretar",
                    "body": "La excreción final resulta de lo que se filtra, menos lo que vuelve a la sangre y más lo que se añade por secreción. Separar estos procesos evita tratar filtración y excreción como sinónimos."
                  }
                ],
                "keyPoints": [
                  "El filtrado comienza en el corpúsculo renal.",
                  "Filtración y excreción son procesos diferentes.",
                  "El túbulo modifica el líquido filtrado."
                ]
              },
              "question": {
                "prompt": "¿A qué espacio llega inicialmente el líquido filtrado desde los capilares glomerulares?",
                "options": [
                  "Vejiga",
                  "Espacio capsular",
                  "Pelvis renal",
                  "Uréter"
                ],
                "correct": 1,
                "explanation": "El filtrado pasa al espacio de la cápsula glomerular antes de ingresar al túbulo proximal."
              },
              "relatedLab": "nefron"
            },
            {
              "id": "renal-proximal",
              "title": "Túbulo proximal",
              "kicker": "FISIOLOGÍA · TBL 2",
              "minutes": 10,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Explora cómo el primer segmento tubular recupera sustancias del filtrado.",
                "objectives": [
                  "Ubicar el túbulo proximal después del corpúsculo.",
                  "Definir reabsorción tubular.",
                  "Relacionar el borde en cepillo con su función."
                ],
                "sections": [
                  {
                    "id": "recorrido",
                    "title": "El primer segmento después de filtrar",
                    "body": "El túbulo proximal recibe líquido del espacio capsular. A lo largo de este segmento se reabsorbe una gran parte del agua y de los solutos filtrados."
                  },
                  {
                    "id": "epitelio",
                    "title": "Una superficie adaptada al transporte",
                    "body": "Las células proximales tienen un borde en cepillo que aumenta la superficie apical y abundantes mitocondrias que sostienen el transporte.",
                    "bullets": [
                      "Apical: orientado hacia la luz tubular.",
                      "Basolateral: orientado hacia el intersticio.",
                      "Reabsorber: mover sustancias del túbulo de regreso a la sangre."
                    ]
                  },
                  {
                    "id": "direccion",
                    "title": "Seguir la dirección de cada movimiento",
                    "body": "Dibuja luz tubular, célula e intersticio como tres compartimentos. Seguir una sustancia a través de ellos ayuda a comprender los transportadores sin memorizar una lista aislada."
                  }
                ],
                "keyPoints": [
                  "El túbulo proximal sigue al corpúsculo renal.",
                  "El borde en cepillo amplía la superficie.",
                  "La reabsorción devuelve sustancias hacia la sangre."
                ]
              },
              "question": {
                "prompt": "¿Qué estructura aumenta la superficie apical de las células del túbulo proximal?",
                "options": [
                  "Cilios móviles",
                  "Borde en cepillo",
                  "Discos intercalares",
                  "Vaina de mielina"
                ],
                "correct": 1,
                "explanation": "Las microvellosidades del borde en cepillo amplían la superficie disponible para el transporte."
              },
              "relatedLab": "nefron"
            },
            {
              "id": "renal-henle",
              "title": "Asa de Henle",
              "kicker": "FISIOLOGÍA · TBL 3",
              "minutes": 12,
              "available": true,
              "summary": {
                "intro": "Contenido de muestra. Relaciona el recorrido del asa con las diferencias de transporte entre sus segmentos.",
                "objectives": [
                  "Ubicar las ramas descendente y ascendente.",
                  "Reconocer que sus permeabilidades son diferentes.",
                  "Relacionar el asa con el gradiente medular."
                ],
                "sections": [
                  {
                    "id": "forma",
                    "title": "Un recorrido que entra y sale de la médula",
                    "body": "El asa conecta segmentos de la nefrona mediante una rama descendente y una ascendente. Su disposición en paralelo contribuye a la organización funcional de la médula renal."
                  },
                  {
                    "id": "segmentos",
                    "title": "Cada segmento transporta de forma distinta",
                    "body": "La rama descendente delgada tiene elevada permeabilidad al agua. La rama ascendente gruesa reabsorbe sales y presenta baja permeabilidad al agua.",
                    "bullets": [
                      "Descendente: facilita el movimiento de agua.",
                      "Ascendente gruesa: transporta sales.",
                      "Las diferencias entre ambas contribuyen al gradiente medular."
                    ]
                  },
                  {
                    "id": "integracion",
                    "title": "Pensar en el sistema completo",
                    "body": "La capacidad renal para concentrar la orina depende de la relación entre asa, vasos y conductos colectores. Estudia el gradiente como un sistema que se construye y mantiene."
                  }
                ],
                "keyPoints": [
                  "El asa tiene ramas con propiedades distintas.",
                  "La ascendente gruesa tiene baja permeabilidad al agua.",
                  "La disposición medular contribuye al mecanismo de concentración."
                ]
              },
              "question": {
                "prompt": "¿Qué segmento del asa presenta baja permeabilidad al agua y reabsorbe sales?",
                "options": [
                  "Rama ascendente gruesa",
                  "Cápsula glomerular",
                  "Rama descendente delgada",
                  "Pelvis renal"
                ],
                "correct": 0,
                "explanation": "La rama ascendente gruesa reabsorbe sales y tiene baja permeabilidad al agua."
              },
              "relatedLab": "nefron"
            }
          ]
        }
      ]
    }
  ],
  "labs": [
    {
      "id": "ciclo-cardiaco",
      "title": "Ciclo cardíaco",
      "category": "Simulación",
      "subject": "Cardiovascular",
      "description": "Relaciona las fases del latido con válvulas, presión y volumen. Vista conceptual del prototipo.",
      "kind": "heart"
    },
    {
      "id": "electrocardiograma",
      "title": "Electrocardiograma",
      "category": "Simulación",
      "subject": "Cardiovascular",
      "description": "Sigue el impulso eléctrico y su relación con las ondas del trazado.",
      "kind": "ecg"
    },
    {
      "id": "nefron",
      "title": "Nefrón interactivo",
      "category": "Simulación",
      "subject": "Excretor",
      "description": "Recorre el filtrado y reconoce los segmentos de la nefrona.",
      "kind": "nephron"
    },
    {
      "id": "poligono-willis",
      "title": "Polígono de Willis 3D",
      "category": "3D",
      "subject": "Neurología",
      "description": "Explora las conexiones arteriales de la base del encéfalo.",
      "kind": "brain"
    },
    {
      "id": "frotis",
      "title": "Frotis sanguíneo",
      "category": "Atlas",
      "subject": "Hematología",
      "description": "Reconoce las células de la sangre en una vista de exploración.",
      "kind": "cells"
    },
    {
      "id": "checkpoints",
      "title": "Checkpoints del ciclo celular",
      "category": "Simulación",
      "subject": "Biología celular",
      "description": "Sigue las etapas del ciclo y sus puntos de control.",
      "kind": "cycle"
    }
  ]
};
