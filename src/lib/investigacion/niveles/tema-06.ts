import type { NivelContenido } from '../types';

// ─── TEMA 6: Medidas de Frecuencia y de Efecto (Probabilidad) ───
export const TEMA_06: NivelContenido = {
  id: 'tema-06',

  intro: {
    kicker: 'Nivel 6 · Desarrollo',
    titulo: 'Medidas de Frecuencia y Probabilidad',
    gancho:
      'Para comunicar cuánto daña o protege una exposición, la epidemiología usa indicadores estandarizados. Primero cuentas el problema (prevalencia, incidencia); luego comparas grupos (RR, OR).',
    objetivos: [
      'Diferenciar prevalencia (foto) de incidencia (video).',
      'Saber cuándo se puede calcular incidencia.',
      'Distinguir Riesgo Relativo (RR) de Odds Ratio (OR).',
      'Leer una tabla de contingencia 2×2.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Prevalencia vs. Incidencia',
    resumen:
      'Ambas miden la frecuencia de una condición, pero una es una foto y la otra un video.',
    tarjetas: [
      {
        id: 'prevalencia',
        icono: 'camara',
        titulo: 'Prevalencia',
        definicion: 'Todos los casos existentes (nuevos y antiguos) dividido por la población, en un instante.',
        ejemploAcademico:
          'La prevalencia de VIH sigue alta porque los pacientes viven más tiempo, aunque haya menos casos nuevos.',
        ejemploCotidiano:
          'Cuántas personas en tu salón usan lentes HOY: una foto del momento.',
        ejemploAbsurdo:
          'Contar cuántos memes viejos y nuevos hay en tu galería ahora mismo. Todos cuentan, sin importar cuándo llegaron.',
        datoSorpresa:
          'La prevalencia refleja la "carga" de la enfermedad, no qué tan rápido aparece.',
      },
      {
        id: 'incidencia',
        icono: 'claqueta',
        titulo: 'Incidencia',
        definicion: 'Solo los casos NUEVOS en una población a riesgo durante un período de seguimiento.',
        ejemploAcademico:
          'Nuevas infecciones de VIH por año: la incidencia puede caer aunque la prevalencia siga alta.',
        ejemploCotidiano:
          'Cuántos compañeros EMPEZARON a usar lentes este año: solo los nuevos.',
        datoSorpresa:
          'Solo puedes calcular incidencia si hay seguimiento prospectivo (ves aparecer los casos nuevos).',
      },
    ],
  },

  minijuegoA: {
    tipo: 'drag',
    titulo: 'Foto o video',
    instruccion: 'Arrastra cada medida hacia lo que describe.',
    pares: [
      { id: 'p1', termino: 'Prevalencia', match: 'Todos los casos existentes en un instante (la carga actual)' },
      { id: 'p2', termino: 'Incidencia', match: 'Solo los casos nuevos durante un seguimiento en el tiempo' },
      { id: 'p3', termino: 'Riesgo Relativo (RR)', match: 'Incidencia en expuestos ÷ incidencia en no expuestos' },
      { id: 'p4', termino: 'Odds Ratio (OR)', match: 'Razón de probabilidades usada en casos y controles' },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Riesgo Relativo y Odds Ratio',
    resumen:
      'Las medidas de efecto comparan matemáticamente al grupo expuesto contra el no expuesto.',
    tarjetas: [
      {
        id: 'rr',
        icono: 'division',
        titulo: 'Riesgo Relativo (RR)',
        definicion: 'La incidencia en expuestos dividida por la incidencia en no expuestos.',
        ejemploAcademico:
          'En una cohorte, RR = [a/(a+b)] ÷ [c/(c+d)]. Se usa cuando partes de la exposición hacia el evento.',
        ejemploCotidiano:
          'Si 30% de los que corren se lesionan vs. 10% de los que no, el RR es 3: corren "3 veces más" riesgo.',
        datoSorpresa:
          'El RR solo se calcula cuando hay incidencia y temporalidad prospectiva (cohortes, ECA).',
      },
      {
        id: 'or',
        icono: 'azar',
        titulo: 'Odds Ratio (OR)',
        definicion: 'La razón de "ventajas" (odds), usada cuando partes del enfermo hacia el pasado.',
        ejemploAcademico:
          'En casos y controles (o regresión logística) no hay incidencia medible, así que se reporta OR.',
        ejemploCotidiano:
          'Las "cuotas" de una apuesta: no dicen incidencia real, sino la ventaja relativa de un resultado.',
        datoSorpresa:
          'Si el evento NO es raro, el OR magnifica al RR: exagera la fuerza de la asociación.',
      },
      {
        id: 'tabla2x2',
        icono: 'cuadricula',
        titulo: 'La tabla 2×2 (a, b, c, d)',
        definicion: 'La cuadrícula que cruza exposición (filas) con evento (columnas).',
        ejemploAcademico:
          'El RR se lee horizontalmente: [a/(a+b)] vs [c/(c+d)], expuestos contra no expuestos.',
        ejemploCotidiano:
          'Una tabla de "llovió / no llovió" contra "llevé paraguas / no": cuatro casillas que lo resumen todo.',
        datoSorpresa:
          'Casi toda la epidemiología clásica cabe en cuatro celdas: a, b, c y d.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'caso',
    titulo: '¿RR u OR?',
    escenario:
      'Un equipo parte de personas SANAS agrupadas por si fuman o no, y las sigue 10 años para ver quién desarrolla EPOC.',
    pregunta: '¿Qué medida de efecto corresponde a este diseño?',
    opciones: [
      {
        id: 'o1',
        texto: 'Riesgo Relativo (RR): hay seguimiento prospectivo e incidencia real.',
        correcta: true,
        feedback: '¡Correcto! Partir de la exposición y seguir en el tiempo permite calcular incidencia y RR.',
      },
      {
        id: 'o2',
        texto: 'Odds Ratio (OR), porque siempre se usa OR en epidemiología.',
        correcta: false,
        feedback: 'No. El OR se reserva para casos y controles o regresión logística, sin incidencia real.',
      },
      {
        id: 'o3',
        texto: 'Prevalencia, porque cuenta casos.',
        correcta: false,
        feedback: 'No. La prevalencia es una foto; aquí hay seguimiento, así que la medida es de efecto (RR).',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Frecuencia y efecto, juntos',
    resumen: 'Toda medida de efecto debe acompañarse de su IC 95% (Tema 5) para tener valor real.',
    tarjetas: [
      {
        id: 'diseno-medida',
        icono: 'brujula',
        titulo: 'El diseño manda la medida',
        definicion: 'Cohortes y ECA reportan RR; casos y controles reportan OR.',
        ejemploAcademico:
          'Una cohorte de fumadores → RR; un estudio de casos (con cáncer) y controles → OR.',
        ejemploCotidiano:
          'La herramienta depende de la tarea: martillo para clavos, destornillador para tornillos.',
        datoSorpresa:
          'Confundir la medida con el diseño es un error clásico al leer artículos.',
      },
      {
        id: 'estandarizacion',
        icono: 'regla',
        titulo: 'Medida ≠ magnitud',
        definicion: 'RR y OR expresan la relación estandarizada, no el tamaño absoluto del efecto.',
        ejemploAcademico:
          'Un RR de 2 duplica el riesgo relativo, pero si el riesgo base es 0.1%, el impacto absoluto es pequeño.',
        ejemploCotidiano:
          '"El doble de probabilidad" suena enorme, pero el doble de casi-nada sigue siendo casi-nada.',
        datoSorpresa:
          'Por eso un RR/OR siempre debe leerse junto al riesgo base y a su intervalo de confianza.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: interpretando frecuencias y efectos',
    escenario:
      'Un boletín epidemiológico mezcla prevalencias, incidencias y medidas de efecto. Ordena las ideas.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'El VIH tiene incidencia en descenso pero prevalencia alta. ¿Cómo se explica?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Hay menos casos nuevos, pero los pacientes viven más, así que el total acumulado sigue alto.',
            correcta: true,
            feedback: 'Correcto: menos incidencia + mayor supervivencia = prevalencia sostenida.',
          },
          {
            id: 'd1b',
            texto: 'Es imposible: si baja la incidencia debe bajar la prevalencia de inmediato.',
            correcta: false,
            feedback: 'No. La prevalencia acumula casos antiguos; puede seguir alta pese a menos casos nuevos.',
          },
          {
            id: 'd1c',
            texto: 'Significa que los datos están mal.',
            correcta: false,
            feedback: 'No. Es un patrón esperable cuando mejora la supervivencia.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Un estudio de casos y controles reporta la asociación tabaco–cáncer. ¿Qué medida usa?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Odds Ratio (OR): parte del enfermo y mira al pasado, sin incidencia real.',
            correcta: true,
            feedback: 'Exacto: casos y controles → OR.',
          },
          {
            id: 'd2b',
            texto: 'Riesgo Relativo (RR), porque es más fácil de interpretar.',
            correcta: false,
            feedback: 'No. Sin incidencia (no hay seguimiento prospectivo) no se calcula RR.',
          },
          {
            id: 'd2c',
            texto: 'Prevalencia.',
            correcta: false,
            feedback: 'No. La prevalencia es una medida de frecuencia, no de asociación.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Un RR de 2.0 aparece sin su intervalo de confianza. ¿Qué haces?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Pedir el IC 95%: sin él no conozco la precisión ni la significancia del efecto.',
            correcta: true,
            feedback: 'Correcto: toda medida de efecto necesita su IC para interpretarse.',
          },
          {
            id: 'd3b',
            texto: 'Aceptarlo tal cual: el número basta.',
            correcta: false,
            feedback: 'No. Un RR sin IC no dice cuán precisa o incierta es la estimación.',
          },
          {
            id: 'd3c',
            texto: 'Convertirlo a prevalencia.',
            correcta: false,
            feedback: 'No tiene sentido: son conceptos distintos (efecto vs frecuencia).',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'La prevalencia es una foto (casos totales); la incidencia es un video (casos nuevos).',
      'Solo se calcula incidencia cuando hay seguimiento prospectivo.',
      'El RR es la división de dos incidencias (expuestos vs no expuestos).',
      'La medida de efecto (RR/OR) expresa relación estandarizada, no magnitud absoluta.',
      'Toda medida de probabilidad debe acompañarse de su IC 95%.',
    ],
  },
};
