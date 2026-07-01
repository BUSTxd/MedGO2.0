import type { NivelContenido } from '../types';

// ─── TEMA 8: Ensayos Clínicos Aleatorizados (ECA) ───
export const TEMA_08: NivelContenido = {
  id: 'tema-08',

  intro: {
    kicker: 'Nivel 8 · Desarrollo',
    titulo: 'Ensayos Clínicos Aleatorizados (ECA)',
    gancho:
      'El "Gold Standard". Aquí el investigador SÍ asigna la intervención, y lo hace al azar. Ese acto casi mágico equilibra hasta los confusores que nadie conoce.',
    objetivos: [
      'Conocer los 3 pilares: aleatorización, cegamiento y comparador.',
      'Entender por qué la aleatorización controla confusores desconocidos.',
      'Distinguir niveles de cegamiento (abierto → triple ciego).',
      'Diferenciar diseños paralelo, crossover y factorial (washout, carryover).',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Los 3 Pilares y el Cegamiento',
    resumen:
      'La aleatorización ajusta por nuestra ignorancia; el cegamiento bloquea las expectativas; el comparador mide el efecto real.',
    tarjetas: [
      {
        id: 'aleatorizacion',
        icono: 'azar',
        titulo: 'Aleatorización',
        definicion: 'Asignar la intervención al azar, equilibrando confusores conocidos y desconocidos.',
        ejemploAcademico:
          'Al repartir al azar el fármaco y el placebo, ambos grupos quedan comparables incluso en lo que no medimos.',
        ejemploCotidiano:
          'Repartir equipos con un sorteo justo: nadie acomoda a los mejores en un solo lado.',
        ejemploAbsurdo:
          'Elegir quién lava los platos tirando una moneda: hasta el azar es más justo que tu hermano eligiendo.',
        datoSorpresa:
          'Mientras el multivariado ajusta por variables medidas, la aleatorización ajusta por la ignorancia total.',
      },
      {
        id: 'cegamiento',
        icono: 'oculto',
        titulo: 'Cegamiento (enmascaramiento)',
        definicion: 'Ocultar quién recibe qué, para evitar el sesgo de expectativa y de desempeño.',
        ejemploAcademico:
          'Doble ciego: ni paciente ni médico saben el grupo; es el estándar en farmacología.',
        ejemploCotidiano:
          'Una cata de gaseosas con vasos sin marca: sin la etiqueta, no te dejas llevar por la marca.',
        datoSorpresa:
          'Va desde "abierto" (nadie ciego, usado en cirugías) hasta triple ciego (paciente, médico y analista).',
      },
      {
        id: 'comparador',
        icono: 'balanza',
        titulo: 'Grupo comparador',
        definicion: 'El brazo control (placebo o tratamiento estándar) frente al cual se mide el efecto real.',
        ejemploAcademico:
          'Comparar el fármaco nuevo contra placebo idéntico permite aislar su efecto verdadero.',
        ejemploCotidiano:
          'Para saber si tu nueva rutina funciona, necesitas comparar con lo que hacías antes.',
        datoSorpresa:
          'Sin comparador no hay ECA: es lo que convierte una observación en un experimento.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'drag',
    titulo: 'Los pilares del ECA',
    instruccion: 'Arrastra cada pilar hacia lo que controla o aporta.',
    pares: [
      { id: 'p1', termino: 'Aleatorización', match: 'Equilibra los confusores conocidos y desconocidos' },
      { id: 'p2', termino: 'Cegamiento', match: 'Evita el sesgo de expectativa del paciente y del médico' },
      { id: 'p3', termino: 'Comparador', match: 'Permite medir el efecto real frente a placebo' },
      { id: 'p4', termino: 'Triple ciego', match: 'Paciente, médico y analista ignoran la asignación' },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Anatomía de los tipos de ECA',
    resumen:
      'La elección del tipo depende de la cronicidad, la urgencia y el número de intervenciones.',
    tarjetas: [
      {
        id: 'paralelo',
        icono: 'vias',
        titulo: 'Paralelo (clásico)',
        definicion: 'Cada grupo recibe una sola intervención y se comparan entre sí.',
        ejemploAcademico:
          'Grupo A recibe fármaco, grupo B recibe placebo, en paralelo, durante todo el estudio.',
        ejemploCotidiano:
          'Dos filas corren la carrera al mismo tiempo, cada una con sus zapatillas distintas.',
        datoSorpresa:
          'Es el diseño más común y directo, pero requiere más pacientes que el crossover.',
      },
      {
        id: 'crossover',
        icono: 'ciclo',
        titulo: 'Crossover (cruzado)',
        definicion: 'Un mismo paciente recibe A, descansa y luego B: es su propio control.',
        ejemploAcademico:
          'El paciente toma el fármaco, hace un "washout" (lavado sin fármaco) y luego toma el placebo.',
        ejemploCotidiano:
          'Pruebas dos colchones tú mismo, con una semana de descanso entre uno y otro, para comparar justo.',
        datoSorpresa:
          'Ahorra muestra, pero exige un "washout" para evitar el efecto carryover (residuo del fármaco A al tomar B).',
      },
      {
        id: 'factorial',
        icono: 'multiplicar',
        titulo: 'Factorial',
        definicion: 'Prueba dos intervenciones a la vez: A, B, A+B y placebo.',
        ejemploAcademico:
          'El Physician\'s Health Study evaluó aspirina (corazón) y betacaroteno (cáncer) en 4 grupos simultáneos.',
        ejemploCotidiano:
          'Probar a la vez si duermes mejor con antifaz, con tapones, con ambos o con nada.',
        datoSorpresa:
          'Ahorra dinero probando 2 drogas juntas, pero colapsa si ambas interactúan biológicamente.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'vf',
    titulo: 'ECA: mitos y verdades',
    instruccion: 'Detecta las trampas sobre el diseño de ensayos.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'La aleatorización equilibra también los confusores que no conocemos.',
        esVerdadera: true,
        explicacion: 'Verdadero. Es su gran ventaja frente al ajuste estadístico, que solo cubre lo medido.',
      },
      {
        id: 'a2',
        texto: 'En el diseño crossover no hace falta período de washout.',
        esVerdadera: false,
        explicacion:
          'Falso. Sin washout aparece el efecto carryover: el fármaco previo contamina la segunda fase.',
      },
      {
        id: 'a3',
        texto: 'El diseño factorial falla si las dos drogas interactúan biológicamente.',
        esVerdadera: true,
        explicacion: 'Verdadero. La interacción rompe la eficiencia y confunde los efectos.',
      },
      {
        id: 'a4',
        texto: 'Todos los ECA deben ser siempre doble ciego, incluso las cirugías.',
        esVerdadera: false,
        explicacion:
          'Falso. Algunas intervenciones (cirugías) no pueden cegarse; se usan diseños abiertos.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Por qué es el Gold Standard',
    resumen: 'El ECA soluciona el problema de los confusores del Tema 3 y alimenta la evidencia de eficacia.',
    tarjetas: [
      {
        id: 'gold-standard',
        icono: 'trofeo',
        titulo: 'Gold Standard de causalidad',
        definicion: 'El diseño primario más robusto para probar eficacia.',
        ejemploAcademico:
          'Al aleatorizar, elimina el sesgo estructural que arruina a los observacionales.',
        ejemploCotidiano:
          'Es el "árbitro con VAR" de la investigación: reduce al mínimo las decisiones injustas.',
        datoSorpresa:
          'Es el único diseño que distribuye uniformemente los factores de confusión desconocidos.',
      },
      {
        id: 'washout-carryover',
        icono: 'gota',
        titulo: 'Washout y carryover',
        definicion: 'El washout "limpia" el cuerpo entre fases para evitar el arrastre (carryover) del fármaco previo.',
        ejemploAcademico:
          'En un crossover, sin washout suficiente, el efecto de A persiste y sesga la medición de B.',
        ejemploCotidiano:
          'Entre dos catas de vino te enjuagas la boca para que el sabor anterior no arruine el siguiente.',
        datoSorpresa:
          'El crossover convierte a cada paciente en su propio control, pero solo si el washout es riguroso.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: diseñando un ensayo',
    escenario:
      'Vas a probar un nuevo analgésico. Toma decisiones de diseño para maximizar la validez.',
    decisiones: [
      {
        id: 'd1',
        pregunta: '¿Por qué aleatorizar la asignación del fármaco?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Para equilibrar confusores conocidos y desconocidos entre los grupos.',
            correcta: true,
            feedback: 'Correcto: la aleatorización distribuye hasta lo que no medimos.',
          },
          {
            id: 'd1b',
            texto: 'Para que el médico elija a los pacientes con mejor pronóstico.',
            correcta: false,
            feedback: 'Eso sería sesgo de selección; lo contrario de aleatorizar.',
          },
          {
            id: 'd1c',
            texto: 'Para reducir el tamaño de muestra necesario.',
            correcta: false,
            feedback: 'No es su objetivo; su función es comparar grupos equilibrados.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Es una condición crónica y estable, y quieres ahorrar muestra. ¿Qué diseño conviene?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Crossover con washout: cada paciente es su propio control.',
            correcta: true,
            feedback: 'Correcto: eficiente en muestra, siempre que el washout evite el carryover.',
          },
          {
            id: 'd2b',
            texto: 'Factorial, aunque las drogas interactúen.',
            correcta: false,
            feedback: 'No: si interactúan, el factorial colapsa. Además aquí pruebas un solo fármaco.',
          },
          {
            id: 'd2c',
            texto: 'Serie de casos.',
            correcta: false,
            feedback: 'No es un ECA ni tiene comparador aleatorizado.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Para bloquear el efecto placebo y las expectativas, ¿qué añades?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Cegamiento doble: paciente y evaluador ignoran la asignación.',
            correcta: true,
            feedback: 'Correcto: el doble ciego neutraliza sesgos de expectativa y desempeño.',
          },
          {
            id: 'd3b',
            texto: 'Decirle a cada paciente exactamente qué recibe.',
            correcta: false,
            feedback: 'Eso invita al sesgo de expectativa: justo lo que quieres evitar.',
          },
          {
            id: 'd3c',
            texto: 'Quitar el grupo placebo.',
            correcta: false,
            feedback: 'Sin comparador no puedes medir el efecto real del analgésico.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Es el único diseño que distribuye uniformemente los confusores desconocidos.',
      'El cegamiento evita el sesgo ocultando expectativas de paciente y evaluador.',
      'El crossover convierte a cada paciente en su propio control (menos muestra).',
      'El washout es obligatorio en crossover para evitar el sesgo carryover.',
      'El factorial ahorra al testear 2 drogas a la vez, pero falla si interactúan.',
    ],
  },
};
