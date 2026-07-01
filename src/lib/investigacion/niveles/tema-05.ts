import type { NivelContenido } from '../types';

// ─── TEMA 5: Magnitud de Efecto y Precisión ───
export const TEMA_05: NivelContenido = {
  id: 'tema-05',

  intro: {
    kicker: 'Nivel 5 · Desarrollo',
    titulo: 'Magnitud de Efecto y Precisión',
    gancho:
      'Un resultado puede ser "estadísticamente significativo" y clínicamente inútil. Aquí aprendes a mirar más allá del valor p: cuán grande es el efecto y cuán seguros estamos de él.',
    objetivos: [
      'Separar significancia estadística de relevancia clínica.',
      'Diferenciar medida de efecto (RR, OR) de magnitud del efecto.',
      'Leer un Intervalo de Confianza 95% correctamente.',
      'Relacionar amplitud del IC con precisión y tamaño de muestra.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Magnitud vs. Significancia',
    resumen:
      'El valor p te dice si algo es "detectable", no si vale la pena para el paciente.',
    tarjetas: [
      {
        id: 'magnitud',
        icono: 'escuadra',
        titulo: 'Magnitud del efecto',
        definicion: 'Qué tan grande, en el mundo real, es el impacto de una intervención.',
        ejemploAcademico:
          'Un antihipertensivo con p<0.001 que baja la presión solo 1 mmHg: significativo, pero magnitud irrelevante.',
        ejemploCotidiano:
          'Una dieta "científicamente probada" que te hace bajar 100 gramos en un mes. Real… pero, ¿para qué?',
        ejemploAbsurdo:
          'Una app que "comprobadamente" te ahorra 2 segundos al día. Estadística impecable, magnitud ridícula.',
        datoSorpresa:
          'Magnitud de efecto ≠ significancia estadística. Un p diminuto no garantiza un efecto grande.',
      },
      {
        id: 'medida-vs-magnitud',
        icono: 'etiqueta',
        titulo: 'Medida vs. Magnitud',
        definicion:
          'La medida es el indicador (RR, OR); la magnitud es cuán grande es clínicamente ese impacto.',
        ejemploAcademico:
          'Un RR de 1.02 con p<0.05 es una medida significativa pero de magnitud clínica mínima.',
        ejemploCotidiano:
          'El velocímetro (medida) marca 101 km/h; que sea "mucho" o "poco" depende del contexto (magnitud).',
        datoSorpresa:
          'Un p=0.08 con caída de 8 mmHg puede tener enorme magnitud y solo faltarle precisión (muestra pequeña).',
      },
    ],
  },

  minijuegoA: {
    tipo: 'vf',
    titulo: 'Significativo… ¿pero relevante?',
    instruccion: 'Detecta las afirmaciones que confunden lo estadístico con lo clínico.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'Un resultado con p<0.05 siempre es clínicamente importante.',
        esVerdadera: false,
        explicacion:
          'Falso. Puede ser significativo y de magnitud nula (ej. bajar 1 mmHg). Significancia ≠ relevancia.',
      },
      {
        id: 'a2',
        texto: 'Un efecto grande con p=0.08 puede reflejar magnitud real con poca precisión.',
        esVerdadera: true,
        explicacion:
          'Verdadero. Quizás la muestra fue pequeña; el efecto podría ser real pero impreciso.',
      },
      {
        id: 'a3',
        texto: 'La medida de efecto (RR/OR) ya expresa por sí sola la magnitud clínica.',
        esVerdadera: false,
        explicacion:
          'Falso. La medida es el indicador; la magnitud es cuán grande es su impacto real.',
      },
      {
        id: 'a4',
        texto: 'Un estimado puntual sin intervalo ignora el error aleatorio.',
        esVerdadera: true,
        explicacion:
          'Verdadero. "La media fue 5" a secas oculta la incertidumbre; por eso se usa el IC.',
      },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'El Intervalo de Confianza (IC 95%)',
    resumen:
      'Un solo número (estimado puntual) ignora el error aleatorio; el IC entrega un rango de valores compatibles.',
    tarjetas: [
      {
        id: 'ic95',
        icono: 'barras',
        titulo: 'Qué significa el IC 95%',
        definicion:
          'Si repitiéramos el estudio infinitas veces sin sesgos, el 95% de los intervalos contendría el parámetro real.',
        ejemploAcademico:
          'El sesgo del oxímetro tiene un IC de 1.6 a 3.2: ese es el rango real de error esperado.',
        ejemploCotidiano:
          'El GPS dice "llegas en 25–35 min": no un número mágico, sino un rango honesto de lo probable.',
        datoSorpresa:
          'Todo valor DENTRO del IC es matemáticamente compatible con la verdad poblacional.',
      },
      {
        id: 'precision',
        icono: 'lupa',
        titulo: 'Precisión y amplitud',
        definicion: 'Un IC estrecho = alta precisión; uno ancho = mucha incertidumbre.',
        ejemploAcademico:
          'IC de 1.6–3.2 (estrecho) es más preciso que 0.5–9.0 (ancho) para el mismo efecto.',
        ejemploCotidiano:
          '"Llego en 26–28 min" (preciso) es más útil que "entre 10 y 90 min" (inútil de tan ancho).',
        ejemploAbsurdo:
          'Predecir tu peso futuro "entre 3 kg y 300 kg": técnicamente cierto, prácticamente inservible.',
        datoSorpresa:
          'La forma más directa de estrechar un IC (ganar precisión) es aumentar el tamaño de muestra.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'caso',
    titulo: 'Dos antihipertensivos',
    escenario:
      'El fármaco A baja la presión 1 mmHg con IC 0.9–1.1 (p<0.001). El fármaco B la baja 8 mmHg con IC −1 a 17 (p=0.09).',
    pregunta: '¿Cómo interpretas ambos como clínico?',
    opciones: [
      {
        id: 'o1',
        texto: 'A es preciso pero de magnitud trivial; B tiene gran magnitud pero poca precisión.',
        correcta: true,
        feedback:
          '¡Correcto! A: significativo e irrelevante. B: efecto grande pero impreciso (quizá muestra pequeña).',
      },
      {
        id: 'o2',
        texto: 'A es mejor porque su p es más pequeño.',
        correcta: false,
        feedback:
          'No. Un p menor no implica mejor efecto clínico: A apenas baja 1 mmHg.',
      },
      {
        id: 'o3',
        texto: 'B no sirve porque p>0.05.',
        correcta: false,
        feedback:
          'Cuidado: B podría tener un efecto real grande; le falta precisión, no necesariamente efecto.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Por qué acompaña a todo resultado',
    resumen: 'Toda medida (RR, OR, HR) se reporta con su IC 95%: es su compañero obligatorio.',
    tarjetas: [
      {
        id: 'lectura-juiciosa',
        icono: 'cerebro',
        titulo: 'Lectura juiciosa del IC',
        definicion: 'Interpretar el rango completo, no solo si "cruza" un valor.',
        ejemploAcademico:
          'Un RR con IC 0.98–2.5 abarca desde casi nulo hasta fuerte: la conclusión debe ser prudente.',
        ejemploCotidiano:
          'Si el pronóstico da "0 a 40 mm de lluvia", llevas paraguas pero no cancelas el viaje.',
        datoSorpresa:
          'Un IC que incluye el 1 (para RR/OR) sugiere que "sin efecto" es compatible con los datos.',
      },
      {
        id: 'muestra-precision',
        icono: 'subida',
        titulo: 'Muestra → precisión',
        definicion: 'A mayor tamaño de muestra, IC más estrecho y estimación más precisa.',
        ejemploAcademico:
          'Duplicar la muestra suele reducir la amplitud del IC y afinar el estimado.',
        ejemploCotidiano:
          'Preguntar a 1000 personas da un margen mucho más fino que preguntar a 10.',
        datoSorpresa:
          'Precisión NO es lo mismo que validez: un estudio sesgado puede tener un IC estrecho y aun así estar equivocado.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: leyendo la Tabla 2 de un artículo',
    escenario:
      'Revisas asociaciones reportadas con su IC 95%. Decide qué concluir de cada una.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'Un factor tiene OR 3.2 (IC 2.1–4.9), p<0.001. ¿Qué dices?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Asociación fuerte y precisa: el IC es estrecho y no incluye el 1.',
            correcta: true,
            feedback: 'Correcto: efecto grande, buena precisión y estadísticamente significativo.',
          },
          {
            id: 'd1b',
            texto: 'No se puede interpretar sin el valor p exacto.',
            correcta: false,
            feedback: 'El IC ya te dice precisión y significancia; el p refuerza, no reemplaza.',
          },
          {
            id: 'd1c',
            texto: 'Es irrelevante porque los OR nunca importan.',
            correcta: false,
            feedback: 'No. Un OR con IC estrecho y alto es una señal clínica relevante.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Otro factor: OR 1.05 (IC 1.01–1.09), p=0.03. ¿Qué observas?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Es significativo pero de magnitud mínima: relevancia clínica dudosa.',
            correcta: true,
            feedback: 'Exacto: significancia estadística sin magnitud clínica apreciable.',
          },
          {
            id: 'd2b',
            texto: 'Es un efecto enorme porque p<0.05.',
            correcta: false,
            feedback: 'No. Un OR de 1.05 es un efecto pequeñísimo, aunque sea significativo.',
          },
          {
            id: 'd2c',
            texto: 'No hay asociación alguna.',
            correcta: false,
            feedback: 'Sí hay asociación (IC no incluye 1), pero su magnitud es trivial.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Un tercer factor: OR 2.0 (IC 0.7–5.6), p=0.18. ¿Conclusión?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Efecto posiblemente real pero impreciso; el IC ancho incluye el 1.',
            correcta: true,
            feedback: 'Correcto: falta precisión (IC ancho) y "sin efecto" es compatible con los datos.',
          },
          {
            id: 'd3b',
            texto: 'Está demostrado que no existe ninguna asociación.',
            correcta: false,
            feedback: 'No se demuestra ausencia: solo hay imprecisión, quizá por muestra pequeña.',
          },
          {
            id: 'd3c',
            texto: 'Es la asociación más fuerte de la tabla.',
            correcta: false,
            feedback: 'No. Su IC ancho la vuelve la más incierta, no la más fuerte.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Un resultado significativo (p<0.05) puede ser clínicamente inútil si la magnitud es nula.',
      'Los estimados puntuales son insuficientes porque ignoran el error aleatorio.',
      'El IC 95% entrega el margen de incertidumbre; su amplitud refleja la precisión.',
      'La mejor forma de estrechar un IC es aumentar el tamaño de muestra.',
      'Todo valor dentro del IC es compatible con el verdadero valor poblacional.',
    ],
  },
};
