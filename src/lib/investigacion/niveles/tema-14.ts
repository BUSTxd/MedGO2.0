import type { NivelContenido } from '../types';

// ─── TEMA 14: Ciencia de la Implementación ───
export const TEMA_14: NivelContenido = {
  id: 'tema-14',

  intro: {
    kicker: 'Nivel 14 · Síntesis',
    titulo: 'Ciencia de la Implementación',
    gancho:
      'El estadio final (T4). La evidencia probada tarda hasta 17 años en llegar al hospital de rutina. Este campo estudia cómo lograr que lo que funciona en el ensayo funcione también en el caótico mundo real.',
    objetivos: [
      'Entender la brecha de implementación y el "research waste".',
      'Distinguir intervención (el qué) de estrategia (el cómo).',
      'Reconocer intervenciones complejas y diseños híbridos.',
      'Valorar la co-creación y los marcos teóricos (CFIR, TDF).',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Intervenciones complejas y "Research Waste"',
    resumen:
      'Lo que brilla en el aislamiento de un ECA suele desplomarse al chocar con la realidad social.',
    tarjetas: [
      {
        id: 'brecha',
        icono: 'hoyo',
        titulo: 'La brecha de implementación',
        definicion: 'La distancia entre la evidencia probada y su uso real en los servicios de salud.',
        ejemploAcademico:
          'Un tratamiento eficaz tarda, en promedio, hasta 17 años en incorporarse a la práctica rutinaria.',
        ejemploCotidiano:
          'Sabes que deberías hacer ejercicio (evidencia), pero pasan años hasta que realmente lo haces (implementación).',
        datoSorpresa:
          'Ese abismo genera "research waste": evidencia de altísima calidad que nunca cambia la práctica real.',
      },
      {
        id: 'intervencion-compleja',
        icono: 'pieza',
        titulo: 'Intervención compleja',
        definicion: 'Intervenciones con múltiples componentes que interactúan en sistemas sociales no controlados.',
        ejemploAcademico:
          'Distribuir sal enriquecida con potasio (Estudio SALT) fracasa no por su química, sino por barreras culturales y logísticas.',
        ejemploCotidiano:
          'Una dieta perfecta en el papel falla si tu familia cocina distinto y no hay tiempo de preparar.',
        ejemploAbsurdo:
          'El plan "todos reciclan" es genial hasta que descubres que no hay tachos, ni camión, ni ganas a las 6 am.',
        datoSorpresa:
          'En el mundo real se evalúan también desenlaces operativos (adopción, aceptación), no solo la biología.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'caso',
    titulo: 'El Estudio SALT',
    escenario:
      'Una sal enriquecida con potosio reduce la presión arterial en ensayos, pero al distribuirla en comunidades no baja la presión poblacional esperada.',
    pregunta: '¿Cuál es la explicación más probable desde la ciencia de la implementación?',
    opciones: [
      {
        id: 'o1',
        texto: 'Barreras culturales y de distribución en las familias reales, no falta de eficacia molecular.',
        correcta: true,
        feedback: '¡Correcto! El problema es la implementación (el "cómo"), no la biología (el "qué").',
      },
      {
        id: 'o2',
        texto: 'La sal no funciona: el ensayo original estaba equivocado.',
        correcta: false,
        feedback: 'No. La eficacia estaba probada; el fallo está en la adopción en el mundo real.',
      },
      {
        id: 'o3',
        texto: 'Hace falta un fármaco más potente.',
        correcta: false,
        feedback: 'No. El obstáculo no es la potencia, sino las barreras contextuales de implementación.',
      },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Co-creación y Marcos Teóricos',
    resumen:
      'El contexto lo es todo: una intervención se adapta con la comunidad, apoyándose en marcos probados.',
    tarjetas: [
      {
        id: 'co-creacion',
        icono: 'acuerdo',
        titulo: 'Co-creación',
        definicion: 'Involucrar a pacientes, personal y decisores en el diseño de la estrategia, no imponerla.',
        ejemploAcademico:
          'El Proyecto FIND reunió a pobladores, personal primario y directivos 4 días para decidir dónde poner el equipo, logrando aceptación real.',
        ejemploCotidiano:
          'Una regla de la casa funciona mejor si todos la acuerdan, en vez de que uno la imponga.',
        datoSorpresa:
          'La estrategia se desarrolla CON la comunidad, no a puerta cerrada: eso decide si se adopta o fracasa.',
      },
      {
        id: 'marcos',
        icono: 'mapa',
        titulo: 'Marcos teóricos (CFIR, TDF)',
        definicion: 'Modelos para analizar el contexto (CFIR) y el cambio de comportamiento (TDF).',
        ejemploAcademico:
          'El CFIR estructura el análisis del contexto organizacional; el TDF, el cambio de conducta de los profesionales.',
        ejemploCotidiano:
          'Usar una checklist probada para mudarte, en vez de improvisar y olvidar la mitad de las cosas.',
        datoSorpresa:
          'Un fármaco en una clínica rural peruana enfrenta barreras opuestas a uno en Europa: el contexto manda.',
      },
      {
        id: 'hibridos',
        icono: 'microscopio',
        titulo: 'Diseños híbridos',
        definicion: 'Mezclan la evaluación de eficacia clínica con la de adaptabilidad e implementación real.',
        ejemploAcademico:
          'Se prueba a la vez si el fármaco cura (eficacia) y si el hospital puede adoptarlo (implementación).',
        ejemploCotidiano:
          'Probar una app viendo si funciona Y si la gente realmente la usa, al mismo tiempo.',
        datoSorpresa:
          'Se evalúa no solo si algo cura el cuerpo, sino si el sistema es capaz de adoptarlo sin quebrar.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'drag',
    titulo: 'Conceptos de implementación',
    instruccion: 'Arrastra cada concepto hacia su descripción.',
    pares: [
      { id: 'p1', termino: 'Research Waste', match: 'Evidencia probada que nunca se adopta en la práctica real' },
      { id: 'p2', termino: 'Co-creación', match: 'Diseñar la estrategia junto a la comunidad y los decisores' },
      { id: 'p3', termino: 'CFIR', match: 'Marco para analizar el contexto organizacional' },
      { id: 'p4', termino: 'Diseño híbrido', match: 'Evalúa a la vez eficacia clínica y adopción real' },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'El cierre del ciclo',
    resumen: 'Recibe la evidencia del ECA (Tema 8) y se apoya en lo cualitativo (Tema 12) para las barreras humanas.',
    tarjetas: [
      {
        id: 'que-vs-como',
        icono: 'flechas',
        titulo: 'El "qué" vs. el "cómo"',
        definicion: 'La intervención es qué funciona (biológico); la estrategia es cómo lograr que el sistema lo use.',
        ejemploAcademico:
          'El fármaco (qué) puede ser excelente, pero sin una estrategia de adopción (cómo), no llega al paciente.',
        ejemploCotidiano:
          'Tener la mejor receta (qué) no sirve si nadie en casa sabe ni quiere cocinarla (cómo).',
        datoSorpresa:
          'La ciencia de la implementación dejó de preguntar solo si un fármaco cura, para preguntar si un hospital puede adoptarlo.',
      },
      {
        id: 'contexto',
        icono: 'globo',
        titulo: 'El contexto lo es todo',
        definicion: 'Las comunidades y sistemas de salud son complejos; el contexto puede hundir una droga perfecta.',
        ejemploAcademico:
          'Una intervención exitosa en Europa puede fracasar en una zona rural por barreras culturales y logísticas.',
        ejemploCotidiano:
          'Un negocio que triunfa en una ciudad quiebra en otra por costumbres y contexto distintos.',
        datoSorpresa:
          'Requiere diseños híbridos y evaluaciones de proceso (métodos mixtos) para testear eficacia y adopción a la vez.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: llevando la evidencia al mundo real',
    escenario:
      'Tienes un test rápido (POCT) eficaz en ensayos. Debes implementarlo en zonas rurales. Decide la estrategia.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'El equipo funciona en laboratorio pero no se usa en la comunidad. ¿Qué priorizas?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Analizar el contexto y las barreras de adopción, no solo la eficacia del test.',
            correcta: true,
            feedback: 'Correcto: el problema es de implementación (el cómo), no de eficacia (el qué).',
          },
          {
            id: 'd1b',
            texto: 'Fabricar un test aún más preciso.',
            correcta: false,
            feedback: 'No. La precisión ya está probada; el obstáculo es la adopción real.',
          },
          {
            id: 'd1c',
            texto: 'Descartar la comunidad por "difícil".',
            correcta: false,
            feedback: 'No. Justamente el objetivo es adaptar la estrategia al contexto.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Para lograr aceptación real (como el Proyecto FIND), ¿qué haces?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Co-crear: reunir a pobladores, personal y directivos para decidir juntos dónde y cómo usarlo.',
            correcta: true,
            feedback: 'Exacto: la co-creación con los actores clave genera adopción sostenible.',
          },
          {
            id: 'd2b',
            texto: 'Imponer el equipo por decreto, sin consultar a nadie.',
            correcta: false,
            feedback: 'No. Imponer a puerta cerrada suele terminar en rechazo y abandono.',
          },
          {
            id: 'd2c',
            texto: 'Repetir el ECA una vez más.',
            correcta: false,
            feedback: 'No aporta: la eficacia ya está probada; falta resolver la implementación.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Quieres evaluar a la vez si el test es eficaz Y si el sistema lo adopta. ¿Qué diseño usas?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Un diseño híbrido, apoyado en marcos como CFIR/TDF y métodos mixtos.',
            correcta: true,
            feedback: 'Correcto: los híbridos miden eficacia clínica y adopción real simultáneamente.',
          },
          {
            id: 'd3b',
            texto: 'Solo un análisis de laboratorio de la precisión del test.',
            correcta: false,
            feedback: 'Insuficiente: no evalúa la adopción en el sistema de salud.',
          },
          {
            id: 'd3c',
            texto: 'Una encuesta anónima al final, sin marco teórico.',
            correcta: false,
            feedback: 'Débil: sin marcos (CFIR/TDF) ni evaluación de proceso pierdes el análisis del contexto.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador — ¡curso completado!',
    puntosClave: [
      'Existe una brecha de hasta 17 años entre la evidencia y la práctica hospitalaria.',
      'La intervención es "qué" funciona; la estrategia de implementación es "cómo" lograr que se use.',
      'El contexto puede hacer fracasar a una droga perfecta.',
      'La co-creación desarrolla las intervenciones junto a la comunidad y los médicos.',
      'Requiere diseños híbridos y métodos mixtos para testear eficacia y adopción a la vez.',
    ],
  },
};
