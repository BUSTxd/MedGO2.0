import type { NivelContenido } from '../types';

// ─── TEMA 7: Diseños de Estudios Observacionales ───
export const TEMA_07: NivelContenido = {
  id: 'tema-07',

  intro: {
    kicker: 'Nivel 7 · Desarrollo',
    titulo: 'Diseños de Estudios Observacionales',
    gancho:
      'Aquí el investigador es un espectador: no asigna nada, solo observa el "experimento de la naturaleza". La dirección del tiempo y la presencia de un grupo comparador definen qué puede (y qué no) demostrar.',
    objetivos: [
      'Ubicar los observacionales en el árbol de decisiones (¿el investigador asigna? No).',
      'Diferenciar descriptivos (sin comparador) de analíticos (con comparador).',
      'Distinguir transversal, cohorte y casos y controles por su temporalidad.',
      'Situar cada diseño en la jerarquía de evidencia.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Descriptivos: Reportes y Series de Casos',
    resumen:
      'Sin grupo comparador no se prueba asociación, pero son la vanguardia del descubrimiento médico.',
    tarjetas: [
      {
        id: 'observacional',
        icono: 'ojos',
        titulo: 'La naturaleza asigna, tú observas',
        definicion: 'En lo observacional el investigador no manipula la exposición; solo la mide.',
        ejemploAcademico:
          'Árbol de decisión: ¿el investigador asigna la exposición? NO → estudio observacional.',
        ejemploCotidiano:
          'Anotas quién de tu barrio se enferma en invierno, sin decidir tú quién se abriga.',
        datoSorpresa:
          'Como no hay aleatorización, todos los observacionales sufren del problema de los confusores (Tema 3).',
      },
      {
        id: 'series-casos',
        icono: 'documento',
        titulo: 'Reportes y series de casos',
        definicion: 'Descripción de uno o varios pacientes, sin grupo control.',
        ejemploAcademico:
          'El reporte del síndrome de Reye por aspirina en niños; la alerta de talidomida y malformaciones.',
        ejemploCotidiano:
          'Contar "conozco 3 personas a las que este alimento les cayó mal": llamativo, pero no prueba nada solo.',
        ejemploAbsurdo:
          'Tu tío jura que "un té curó su gripe": una serie de casos de tamaño 1, con máximo entusiasmo y mínima evidencia.',
        datoSorpresa:
          'Son el escalón MÁS BAJO de causalidad, pero la PRIMERA alerta de enfermedades raras o efectos nuevos.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'orden',
    titulo: 'Jerarquía de la evidencia',
    instruccion: 'Ordena de menor a mayor solidez para probar causalidad.',
    pasos: [
      { id: 's1', texto: 'Reporte / serie de casos (sin comparador)' },
      { id: 's2', texto: 'Estudio transversal (exposición y evento a la vez)' },
      { id: 's3', texto: 'Casos y controles / cohorte (analíticos)' },
      { id: 's4', texto: 'Ensayo clínico aleatorizado (ECA)' },
    ],
    ordenCorrecto: ['s1', 's2', 's3', 's4'],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Analíticos: Transversal, Cohorte y Casos-Controles',
    resumen:
      'Todos tienen grupo comparador; se diferencian por la dirección del tiempo.',
    tarjetas: [
      {
        id: 'transversal',
        icono: 'camara',
        titulo: 'Transversal (cross-sectional)',
        definicion: 'Mide exposición y evento al MISMO tiempo. Da prevalencias.',
        ejemploAcademico:
          'Encuesta que mide hoy si las personas fuman y si tienen tos crónica, todo a la vez.',
        ejemploCotidiano:
          'Una foto grupal: ves quién tiene lentes y quién sonríe, pero no qué pasó antes.',
        datoSorpresa:
          'Su gran límite: relación temporal incierta. Es "el tren sin máquina": no sabes qué vino primero.',
      },
      {
        id: 'casos-controles',
        icono: 'retroceder',
        titulo: 'Casos y controles',
        definicion: 'Parte del evento (enfermos vs sanos) y mira retrospectivamente la exposición.',
        ejemploAcademico:
          'Comparar pacientes con cáncer de pulmón vs sanos y revisar quién fumó. Ideal para enfermedades raras. Reporta OR.',
        ejemploCotidiano:
          'Investigar por qué un grupo se intoxicó en una fiesta preguntando qué comió cada uno.',
        datoSorpresa:
          'Es el diseño de elección cuando la enfermedad tarda décadas (ej. cáncer por asbesto): miras el pasado laboral.',
      },
      {
        id: 'cohorte',
        icono: 'avanzar',
        titulo: 'Cohorte',
        definicion: 'Parte de personas sanas agrupadas por exposición y las sigue hacia el futuro.',
        ejemploAcademico:
          'Seguir sanos fumadores y no fumadores hasta que hacen (o no) EPOC. Confirma temporalidad. Reporta RR e incidencia.',
        ejemploCotidiano:
          'Anotar hoy quién hace ejercicio y ver, en 5 años, quién tuvo problemas cardíacos.',
        datoSorpresa:
          'Es el observacional más fuerte para causalidad, pero inviable si la enfermedad tarda mucho en aparecer.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'drag',
    titulo: 'Empareja el diseño',
    instruccion: 'Arrastra cada diseño hacia su rasgo distintivo.',
    pares: [
      { id: 'p1', termino: 'Transversal', match: 'Exposición y evento medidos al mismo tiempo (prevalencia)' },
      { id: 'p2', termino: 'Casos y controles', match: 'Parte del enfermo y mira al pasado (reporta OR)' },
      { id: 'p3', termino: 'Cohorte', match: 'Parte del sano expuesto y sigue al futuro (reporta RR)' },
      { id: 'p4', termino: 'Serie de casos', match: 'Describe pacientes sin grupo comparador' },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Fortalezas y límites',
    resumen: 'Elegir el diseño lo dicta la pregunta, la frecuencia de la enfermedad y el tiempo disponible.',
    tarjetas: [
      {
        id: 'comparador',
        icono: 'balanza',
        titulo: 'El grupo comparador',
        definicion: 'Sin un grupo con quien comparar, no hay forma lógica de probar asociación.',
        ejemploAcademico:
          'Una serie de casos no puede decir "esto causa aquello": le falta el grupo de referencia.',
        ejemploCotidiano:
          'Decir "los que toman mi jugo mejoran" no vale sin ver qué pasa con los que no lo toman.',
        datoSorpresa:
          'El comparador es lo que separa a los descriptivos (generan hipótesis) de los analíticos (las prueban).',
      },
      {
        id: 'temporalidad',
        icono: 'reloj',
        titulo: 'La temporalidad',
        definicion: 'Saber qué ocurrió primero (causa antes que efecto) es clave para la causalidad.',
        ejemploAcademico:
          'La cohorte confirma temporalidad (exposición → evento); el transversal no puede.',
        ejemploCotidiano:
          'Para culpar a la cena de tu malestar, necesitas saber que comiste ANTES de sentirte mal.',
        datoSorpresa:
          'Los observacionales están un escalón bajo el ECA por su vulnerabilidad al sesgo y a la confusión.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: eligiendo el diseño correcto',
    escenario:
      'Debes estudiar una posible causa de una enfermedad. Elige el diseño según cada situación.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'La enfermedad es rarísima (1 en 100 000). ¿Qué diseño es más eficiente?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Casos y controles: parte de los pocos enfermos y mira su exposición pasada.',
            correcta: true,
            feedback: 'Correcto: ideal para enfermedades raras, sin esperar años a que aparezcan.',
          },
          {
            id: 'd1b',
            texto: 'Cohorte: seguir a miles de sanos por décadas.',
            correcta: false,
            feedback: 'Ineficiente: necesitarías una muestra enorme y mucho tiempo para ver casos raros.',
          },
          {
            id: 'd1c',
            texto: 'Serie de casos, para probar la causa.',
            correcta: false,
            feedback: 'No prueba causa: sin comparador no hay asociación demostrable.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Quieres confirmar que la exposición ocurre ANTES del evento. ¿Qué diseño lo garantiza?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Cohorte: parte de sanos expuestos y observa aparecer el evento en el futuro.',
            correcta: true,
            feedback: 'Exacto: la cohorte establece temporalidad y reporta incidencia y RR.',
          },
          {
            id: 'd2b',
            texto: 'Transversal: mide todo a la vez.',
            correcta: false,
            feedback: 'No. El transversal no distingue qué vino primero: temporalidad incierta.',
          },
          {
            id: 'd2c',
            texto: 'Serie de casos.',
            correcta: false,
            feedback: 'No. Describe pacientes; no sigue una secuencia temporal comparada.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Apareció una malformación nueva ligada a un fármaco. ¿Qué diseño da la primera alerta?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Reporte / serie de casos: describe los primeros casos y genera la hipótesis.',
            correcta: true,
            feedback: 'Correcto: como talidomida, la serie de casos es la vanguardia del descubrimiento.',
          },
          {
            id: 'd3b',
            texto: 'Un ECA de inmediato.',
            correcta: false,
            feedback: 'No sería ético ni factible exponer deliberadamente; primero se alerta con casos.',
          },
          {
            id: 'd3c',
            texto: 'Un transversal nacional.',
            correcta: false,
            feedback: 'Demasiado lento para una alerta temprana; la serie de casos avisa primero.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'En la observación, la naturaleza asigna la exposición; el investigador solo mide.',
      'Sin grupo comparador (descriptivos) no hay forma lógica de probar asociación.',
      'El transversal es una fotografía estática; pobre para demostrar qué causó qué.',
      'Las cohortes van hacia adelante y prueban causa-efecto temporal con incidencias.',
      'Los observacionales están un escalón bajo el ECA por su vulnerabilidad al sesgo.',
    ],
  },
};
