import type { LaboratorioClase } from './types';

/* ───────────────────────────────────────────────────────────────────────────
   Laboratorio virtual de Física, clase por clase.

   Aquí viven las doce clases que tienen laboratorio pero todavía no el módulo
   completo de teoría. Cada una declara sus TEMAS: el menú que el alumno ve al
   entrar, y que al elegir abre la vista de simulación.

   Reglas de contenido, para que un tema nuevo no baje el listón:
   - el `objetivo` dice qué se lleva el alumno, no qué hay en pantalla;
   - los `retos` se responden MOVIENDO los controles, nunca leyendo. Si un reto
     se puede contestar sin tocar la escena, sobra;
   - el acento es el de la unidad del sílabo (`UNIDAD_COLOR` en `fisica.ts`),
     para que el laboratorio y el índice del curso hablen el mismo idioma de
     color.
   ─────────────────────────────────────────────────────────────────────────── */

const MECANICA = '#5E9CD3';
const ONDAS_TERMO = '#F5A623';
const ELECTRO = '#9B8EF8';
const OPTICA = '#2DC99A';

export const LABS: LaboratorioClase[] = [
  /* ═══ C1 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-1',
    codigo: 'C1',
    titulo: 'Leyes de Newton del movimiento',
    gancho: 'Un bloque, un plano y cuatro flechas: el diagrama de cuerpo libre dejando de ser un dibujo estático.',
    temas: [
      {
        id: 'plano-inclinado',
        titulo: 'Plano inclinado con fricción',
        subtitulo: 'Diagrama de cuerpo libre en movimiento',
        acento: MECANICA,
        icono: 'plano',
        objetivo:
          'Ver que la normal no es el peso, que la fricción depende de ella, y que el ángulo al que un cuerpo empieza a deslizar no depende de su masa.',
        sim: 'plano',
        retos: [
          {
            pregunta: '¿A qué ángulo empieza a deslizar con μ = 0,3? ¿Y si triplicas la masa?',
            pista: 'Sube el ángulo grado a grado hasta que el veredicto cambie. Después repite con otra masa sin tocar nada más.',
          },
          {
            pregunta: 'Con el bloque ya deslizando, ¿qué le pasa a la normal al seguir inclinando?',
            pista: 'Mira la longitud de la flecha azul: crece el coseno o decrece. Y con ella, la fricción.',
          },
          {
            pregunta: '¿Puede la fricción ser menor que μN?',
            pista: 'Pon el plano casi horizontal y lee el veredicto: en reposo la fricción vale sólo lo necesario para empatar.',
          },
        ],
      },
    ],
  },

  /* ═══ C2 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-2',
    codigo: 'C2',
    titulo: 'Trabajo y energía · Momento lineal e impulso',
    gancho: 'Dos carros chocando con el coeficiente de restitución como perilla: la frontera entre elástico e inelástico es continua.',
    temas: [
      {
        id: 'choque',
        titulo: 'Choque frontal',
        subtitulo: 'Qué se conserva y qué se pierde',
        acento: MECANICA,
        icono: 'choque',
        objetivo:
          'Separar las dos conservaciones: el momento se conserva siempre, la energía cinética sólo si el choque es elástico.',
        sim: 'colision',
        retos: [
          {
            pregunta: 'Baja e de 1 a 0. ¿Cuál de las dos barras se mueve y cuál no?',
            pista: 'Vigila las dos filas a la vez. Una no se inmuta: ésa es la que se conserva pase lo que pase.',
          },
          {
            pregunta: 'Con e = 0, ¿qué tienen en común las velocidades finales?',
            pista: 'Lee v₁′ y v₂′ en el tablero. Salen pegados: por eso se llama perfectamente inelástico.',
          },
          {
            pregunta: 'Con masas iguales y e = 1, ¿qué pasa si B está quieto?',
            pista: 'Pon m₁ = m₂, v₂ = 0 y e = 1. A se queda parado y B sale con toda la velocidad: el intercambio limpio.',
          },
        ],
      },
    ],
  },

  /* ═══ C3 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-3',
    codigo: 'C3',
    titulo: 'Dinámica rotacional de cuerpos rígidos',
    gancho: 'Una barra que se cae cuando los torques no se empatan, y cuatro cuerpos con la misma masa que no arrancan igual.',
    temas: [
      {
        id: 'torque-barra',
        titulo: 'Torque: la barra y su punto de apoyo',
        subtitulo: 'Στ = 0, comprobado dejándola caer',
        acento: MECANICA,
        icono: 'torque',
        objetivo:
          'Ver que sólo la componente perpendicular a la barra hace girar, y que el equilibrio no es que las fuerzas se empaten sino que se empaten sus torques.',
        sim: 'torque',
        retos: [
          {
            pregunta: 'Con F₂ = 400 N a 30°, d₁ = 40 cm y d₂ = 130 cm, ¿qué F₁ deja la barra quieta?',
            pista: 'Pulsa «Enunciado del problema» y sube F₁ hasta que la balanza de abajo quede partida por la mitad. Después compáralo con F₁* en el tablero.',
          },
          {
            pregunta: 'Sube θ de 30° a 90° sin tocar F₂. ¿Por qué cambia el torque si la fuerza es la misma?',
            pista: 'Mira la flecha punteada: es la parte de F₂ que apunta al apoyo. A 90° desaparece y toda la fuerza gira.',
          },
          {
            pregunta: 'Sube F₁ un 5 % por encima del equilibrio, y luego bájalo un 5 % por debajo. ¿Por qué no pasa lo mismo en los dos lados?',
            pista: 'τ₁ lleva un cos φ y τ₂ no. Si el que sobra es el de F₁, al inclinarse se encoge hasta empatar y la barra se frena sola; si es el que falta, la diferencia sólo puede crecer y se va al tope.',
          },
          {
            pregunta: 'Pon la masa de la barra en 8 kg. ¿Hacia dónde la empuja su propio peso?',
            pista: 'El círculo ámbar es el centro de masa. Fíjate en si cae a la izquierda o a la derecha del apoyo, y lee τ_W.',
          },
        ],
      },
      {
        id: 'inercia',
        titulo: 'Momento de inercia',
        subtitulo: 'Por qué la forma pesa más que la masa',
        acento: MECANICA,
        icono: 'giro',
        objetivo:
          'Entender que la inercia rotacional no es la masa sino cómo está repartida, y ver la conservación del momento angular en acción.',
        sim: 'rotacional',
        retos: [
          {
            pregunta: 'Con la misma masa y el mismo radio, ¿cuál arranca antes, el aro o el disco?',
            pista: 'Cambia de forma sin tocar M ni R y mira α en el panel. El factor c es lo único que cambió.',
          },
          {
            pregunta: 'Enciende el modo patinadora y baja el radio. ¿Qué se queda quieto en el tablero?',
            pista: 'Sin torque externo hay una magnitud que no puede cambiar. Encuéntrala y deduce por qué ω sube.',
          },
          {
            pregunta: '¿Duplicar el radio duplica la inercia?',
            pista: 'R está al cuadrado. Prueba con 0,2 y 0,4 m y compara el valor de I.',
          },
        ],
      },
    ],
  },

  /* ═══ C4 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-4',
    codigo: 'C4',
    titulo: 'Equilibrio y elasticidad',
    gancho: 'Sostener cinco kilos le cuesta al bíceps más de 350 N. La anatomía paga fuerza para ganar velocidad.',
    temas: [
      {
        id: 'palanca-codo',
        titulo: 'La palanca del codo',
        subtitulo: 'Palanca de tercer género',
        acento: MECANICA,
        icono: 'palanca',
        objetivo:
          'Aplicar la suma de torques a una articulación real y ver por qué casi todas las palancas del cuerpo pierden fuerza.',
        sim: 'palanca',
        retos: [
          {
            pregunta: '¿Cuántas veces la carga tiene que hacer el bíceps para sostener 5 kg?',
            pista: 'Pon la carga en 5 kg y lee «F_m / carga» en el tablero. Compáralo con d₂/d₁.',
          },
          {
            pregunta: 'Mueve el ángulo del codo. ¿Por qué apenas cambia F_m?',
            pista: 'Toma torques respecto al codo: el coseno del ángulo aparece en los dos lados de la igualdad.',
          },
          {
            pregunta: '¿Qué carga aguanta más la articulación: la que sostienes o la que hace el músculo?',
            pista: 'Compara F_c con W. La articulación soporta casi todo lo que tira el músculo, no lo que hay en la mano.',
          },
        ],
      },
    ],
  },

  /* ═══ C5 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-5',
    codigo: 'C5',
    titulo: 'Mecánica de fluidos · Hidrostática e hidrodinámica',
    gancho: 'Estrechar un vaso a la mitad de diámetro cuadruplica la velocidad y hunde la presión justo donde ya está enfermo.',
    temas: [
      {
        id: 'estenosis',
        titulo: 'Continuidad y Bernoulli',
        subtitulo: 'Un vaso con estenosis',
        acento: MECANICA,
        icono: 'vaso',
        objetivo:
          'Ver las dos ecuaciones tirando en sentidos opuestos sobre el mismo vaso, y de dónde salen el gradiente y el soplo.',
        sim: 'fluidos',
        retos: [
          {
            pregunta: 'Con un 50 % de reducción de diámetro, ¿cuántas veces sube la velocidad?',
            pista: 'El área va con el diámetro al cuadrado. Compara v₂ con v₁ en el tablero antes de calcularlo.',
          },
          {
            pregunta: '¿Dónde es menor la presión y por qué es mala noticia?',
            pista: 'Enciende la curva de presión y mírala junto a la de velocidad. Son espejos.',
          },
          {
            pregunta: '¿Qué hace falta para que el flujo se vuelva turbulento?',
            pista: 'Sube la estenosis hasta que Re pase de 2000 y lee el veredicto del pie.',
          },
        ],
      },
    ],
  },

  /* ═══ C8 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-8',
    codigo: 'C8',
    titulo: 'Leyes de la termodinámica',
    gancho: 'El mismo gas, entre los mismos dos volúmenes, por cuatro caminos distintos: el trabajo no es el mismo.',
    temas: [
      {
        id: 'procesos',
        titulo: 'Procesos sobre el diagrama PV',
        subtitulo: 'Primera ley, camino a camino',
        acento: ONDAS_TERMO,
        icono: 'piston',
        objetivo:
          'Ver que el trabajo es el área bajo la curva y que depende del camino, mientras que la energía interna sólo depende de la temperatura.',
        sim: 'gas',
        retos: [
          {
            pregunta: 'Con los mismos V₁ y V₂, ¿en qué proceso hace más trabajo el gas?',
            pista: 'Cambia de proceso y compara el área sombreada. Después contrástalo con W en el tablero.',
          },
          {
            pregunta: 'En el isotermo, ¿de dónde sale el trabajo que hace el gas?',
            pista: 'Mira ΔU: es cero. Si la energía interna no cambia y el gas trabaja, algo tuvo que entrar.',
          },
          {
            pregunta: '¿Por qué el gas se enfría en el adiabático sin ceder calor a nadie?',
            pista: 'Q = 0 en la primera ley. Si trabaja, ΔU tiene que pagarlo — y U sólo depende de T.',
          },
        ],
      },
    ],
  },

  /* ═══ C9 ═══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-9',
    codigo: 'C9',
    titulo: 'Carga eléctrica, campo eléctrico y ley de Gauss',
    gancho: 'Dos cargas, sus líneas de campo trazadas de verdad, y el 1/r² dejando de ser un exponente escrito.',
    temas: [
      {
        id: 'coulomb',
        titulo: 'Ley de Coulomb y campo',
        subtitulo: 'La fuerza y el campo que la explica',
        acento: ELECTRO,
        icono: 'cargas',
        objetivo:
          'Distinguir campo de potencial —1/r² frente a 1/r— y ver que la tercera ley de Newton también manda aquí.',
        sim: 'coulomb',
        retos: [
          {
            pregunta: 'Dobla la separación. ¿A cuánto queda la fuerza? ¿Y el potencial?',
            pista: 'Selecciona primero la fórmula de la fuerza y luego la del potencial, sin tocar nada más.',
          },
          {
            pregunta: 'Pon q₁ mucho mayor que q₂. ¿Cuál nota más fuerza?',
            pista: 'Compara las dos flechas naranjas. Da igual el tamaño de las cargas: la fuerza es la misma.',
          },
          {
            pregunta: '¿En qué se nota que las cargas se atraen y no se repelen?',
            pista: 'Enciende las líneas de campo y cambia el signo de q₂. Mira adónde van a parar.',
          },
        ],
      },
    ],
  },

  /* ═══ C10 ══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-10',
    codigo: 'C10',
    titulo: 'Potencial eléctrico y capacitancia',
    gancho: '70 mV parecen nada hasta que los repartes sobre 7 nanómetros: más campo que dentro de una tormenta.',
    temas: [
      {
        id: 'condensador',
        titulo: 'Condensador de placas',
        subtitulo: 'De la membrana celular al desfibrilador',
        acento: ELECTRO,
        icono: 'condensador',
        objetivo:
          'Manejar C, Q, V y U con la misma fórmula en dos escalas que parecen no tener nada que ver.',
        sim: 'capacitor',
        retos: [
          {
            pregunta: '¿Qué campo hay en una membrana celular?',
            pista: 'Pulsa el preset «Membrana celular» y selecciona la fórmula del campo. Compáralo con los 3×10⁶ V/m que rompen el aire.',
          },
          {
            pregunta: 'Para guardar el doble de energía, ¿conviene doblar C o doblar V?',
            pista: 'En U = ½CV² el voltaje va al cuadrado. Prueba las dos cosas y compara.',
          },
          {
            pregunta: '¿Qué hace el dieléctrico?',
            pista: 'Sube εr sin tocar nada más y mira C y Q. Deja meter más carga al mismo voltaje.',
          },
        ],
      },
    ],
  },

  /* ═══ C11 ══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-11',
    codigo: 'C11',
    titulo: 'Corriente, resistencia y fuerza electromotriz',
    gancho: 'La misma pareja de resistencias montada de dos formas: lo que cambia no es la ley de Ohm, es el equivalente.',
    temas: [
      {
        id: 'ohm',
        titulo: 'Serie y paralelo',
        subtitulo: 'Con la escala fisiológica al pie',
        acento: ELECTRO,
        icono: 'circuito',
        objetivo:
          'Ver que la corriente no se gasta al pasar por una resistencia, y a qué miliamperios la corriente deja de ser inofensiva.',
        sim: 'circuito',
        retos: [
          {
            pregunta: 'En serie, ¿pasa menos corriente por la segunda resistencia que por la primera?',
            pista: 'Cuenta los portadores antes y después de R₁. La densidad es la misma en todo el lazo.',
          },
          {
            pregunta: 'Al pasar a paralelo, ¿la fuente entrega más o menos corriente?',
            pista: 'Mira R_eq antes y después. En paralelo es menor que la menor de las dos.',
          },
          {
            pregunta: '¿Qué mata: los voltios o los amperios?',
            pista: 'Prueba el preset de 220 V y mira dónde cae la barra de la escala fisiológica.',
          },
        ],
      },
    ],
  },

  /* ═══ C12 ══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-12',
    codigo: 'C12',
    titulo: 'Magnetismo e inducción electromagnética',
    gancho: 'Una carga que gira sin cambiar de rapidez y una espira que sólo genera corriente cuando el flujo cambia.',
    temas: [
      {
        id: 'lorentz-faraday',
        titulo: 'Lorentz y Faraday',
        subtitulo: 'Las dos mitades del tema en una escena',
        acento: ELECTRO,
        icono: 'iman',
        objetivo:
          'Ver que la fuerza magnética no hace trabajo, que el periodo de giro no depende de la velocidad, y que lo que induce es el cambio de flujo.',
        sim: 'magnetico',
        retos: [
          {
            pregunta: 'Sube la velocidad del protón. ¿Cambia el periodo de su vuelta?',
            pista: 'Selecciona la fórmula del periodo y mira si v aparece en ella. Después compruébalo en la escena.',
          },
          {
            pregunta: '¿A qué frecuencia hay que excitar los protones en una resonancia de 1,5 T?',
            pista: 'Pulsa el preset de 1,5 T y lee la frecuencia de Larmor en el tablero.',
          },
          {
            pregunta: 'En la espira, ¿cuándo es máxima la fem?',
            pista: 'Pasa al modo Faraday y compara las dos curvas. La fem no sigue al flujo: va un cuarto de ciclo por delante.',
          },
        ],
      },
    ],
  },

  /* ═══ C13 ══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-13',
    codigo: 'C13',
    titulo: 'Óptica geométrica',
    gancho: 'Los tres rayos principales cortándose donde la ecuación dice — y el mismo dibujo diagnosticando una miopía.',
    temas: [
      {
        id: 'lente-delgada',
        titulo: 'Lente delgada y el ojo',
        subtitulo: 'Construcción de la imagen',
        acento: OPTICA,
        icono: 'lente',
        objetivo:
          'Construir la imagen con los tres rayos, distinguir real de virtual, y leer un defecto de refracción como una imagen fuera de la retina.',
        sim: 'lente',
        retos: [
          {
            pregunta: '¿Qué pasa justo cuando el objeto llega al foco?',
            pista: 'Pulsa «Objeto en el foco» y mira la ecuación: el denominador se anula.',
          },
          {
            pregunta: '¿Por qué una lupa no puede proyectar la imagen en una pared?',
            pista: 'Mete el objeto dentro del foco y fíjate en el signo de s′ y en el trazo de la imagen.',
          },
          {
            pregunta: 'En modo ojo, ¿qué distingue una miopía de una hipermetropía?',
            pista: 'Sube y baja la potencia del ojo y lee dónde cae la imagen respecto a la retina.',
          },
        ],
      },
    ],
  },

  /* ═══ C14 ══════════════════════════════════════════════════════════════ */
  {
    claseId: 'fis-c-14',
    codigo: 'C14',
    titulo: 'Fotones, electrones y átomos',
    gancho: 'Toda la luz del mundo por debajo del umbral no arranca ni un electrón. Ahí se acabó la luz como onda.',
    temas: [
      {
        id: 'fotoelectrico',
        titulo: 'Efecto fotoeléctrico',
        subtitulo: 'El experimento que obligó a aceptar el fotón',
        acento: OPTICA,
        icono: 'foton',
        objetivo:
          'Separar lo que hace la frecuencia de lo que hace la intensidad, y ver por qué el umbral es un corte y no una cuesta.',
        sim: 'fotoelectrico',
        retos: [
          {
            pregunta: 'Justo por debajo del umbral, sube la intensidad al máximo. ¿Sale algún electrón?',
            pista: 'Elige un metal, pon λ un poco por encima de λ₀ y prueba. Después baja λ cinco nanómetros.',
          },
          {
            pregunta: '¿Qué cambia al subir la intensidad y qué no?',
            pista: 'Cuenta los electrones en la escena y compara K máx en el tablero antes y después.',
          },
          {
            pregunta: '¿Qué metal necesita luz más energética, el cesio o el platino?',
            pista: 'Compara sus funciones de trabajo y mira dónde queda λ₀ en cada caso.',
          },
        ],
      },
    ],
  },
];

/** Registro por `claseId`, para que la ruta resuelva sin recorrer el array. */
const POR_CLASE: Record<string, LaboratorioClase> = Object.fromEntries(
  LABS.map((lab) => [lab.claseId, lab]),
);

export function findLab(claseId: string): LaboratorioClase | null {
  return POR_CLASE[claseId] ?? null;
}
