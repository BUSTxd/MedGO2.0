import type { NivelContenido } from '../types';

// ─── TEMA 13: Análisis Multivariado ───
export const TEMA_13: NivelContenido = {
  id: 'tema-13',

  intro: {
    kicker: 'Nivel 13 · Síntesis',
    titulo: 'Análisis Multivariado',
    gancho:
      'Las enfermedades raras veces tienen una sola causa. El multivariado "iguala el terreno": aísla el efecto independiente de una exposición mientras controla decenas de confusores medidos al mismo tiempo.',
    objetivos: [
      'Entender la multicausalidad y la asociación independiente.',
      'Diferenciar exposición necesaria de suficiente.',
      'Elegir la regresión según la variable dependiente.',
      'Reconocer que el multivariado no cura sesgos ni ajusta lo no medido.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Multicausalidad: la asociación independiente',
    resumen:
      'Ajustar significa aislar el efecto puro de una variable, neutralizando el ruido de las demás.',
    tarjetas: [
      {
        id: 'independiente',
        icono: 'diana',
        titulo: 'Asociación independiente',
        definicion: 'El efecto puro de una variable que resiste tras "limpiar" la contaminación de otros confusores.',
        ejemploAcademico:
          'Si el ejercicio protege el corazón de forma independiente, lo hace incluso ajustando el efecto del tabaco.',
        ejemploCotidiano:
          'Saber si estudiar sube tus notas "por sí solo", aun comparando alumnos que duermen y comen igual.',
        datoSorpresa:
          'La medicina exige distinguir una asociación "confundida" de una "independiente" real.',
      },
      {
        id: 'necesaria-suficiente',
        icono: 'adn',
        titulo: 'Necesaria vs. suficiente',
        definicion: 'Una causa necesaria debe estar; una suficiente basta por sí sola. Pocas son ambas.',
        ejemploAcademico:
          'El Mycobacterium es NECESARIO para la TBC, pero no SUFICIENTE: requiere inmunidad baja o desnutrición.',
        ejemploCotidiano:
          'La chispa es necesaria para el fuego, pero no suficiente: también hace falta oxígeno y combustible.',
        ejemploAbsurdo:
          'Tener wifi es necesario para ver la serie, pero no suficiente: también necesitas que no te quiten la cuenta.',
        datoSorpresa:
          'Las enfermedades son "multivariadas": redes de causas que interactúan, no botones únicos.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'caso',
    titulo: 'Necesaria o suficiente',
    escenario:
      'El Mycobacterium tuberculosis está presente en muchas personas, pero solo algunas desarrollan TBC clínica.',
    pregunta: '¿Cómo describes el rol del Mycobacterium?',
    opciones: [
      {
        id: 'o1',
        texto: 'Causa necesaria pero no suficiente: hace falta, pero requiere covariables como desnutrición o inmunidad baja.',
        correcta: true,
        feedback: '¡Correcto! Sin el bacilo no hay TBC (necesaria), pero él solo no basta (no suficiente).',
      },
      {
        id: 'o2',
        texto: 'Causa suficiente: su sola presencia siempre produce la enfermedad.',
        correcta: false,
        feedback: 'No. Muchos portan el bacilo sin enfermar; no es suficiente por sí solo.',
      },
      {
        id: 'o3',
        texto: 'No tiene relación causal con la TBC.',
        correcta: false,
        feedback: 'Falso. Es la causa necesaria: sin él no existe la enfermedad.',
      },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Tipos de regresión y sus límites',
    resumen:
      'La regresión elegida depende SOLO de la escala de la variable dependiente (el resultado).',
    tarjetas: [
      {
        id: 'lineal',
        icono: 'bajada',
        titulo: 'Regresión Lineal Múltiple',
        definicion: 'Cuando la variable dependiente es cuantitativa continua.',
        ejemploAcademico:
          'Predecir la presión arterial (continua) según edad, peso y sal, reportando coeficientes β.',
        ejemploCotidiano:
          'Estimar tu gasto mensual (número) según ingresos, salidas y clima.',
        datoSorpresa:
          'Requiere supuestos: normalidad, linealidad, independencia y homocedasticidad; es sensible a outliers.',
      },
      {
        id: 'logistica',
        icono: 'mezcla',
        titulo: 'Regresión Logística Múltiple',
        definicion: 'Cuando la variable dependiente es dicotómica (sí/no). Reporta OR ajustado.',
        ejemploAcademico:
          'Predecir muerte (vivo/muerto) según fármaco, edad y comorbilidades → Odds Ratio ajustado.',
        ejemploCotidiano:
          'Estimar si aprobarás (sí/no) según horas de estudio y sueño.',
        datoSorpresa:
          'El OR sobreestima el efecto si el evento es frecuente (>10%): ojo al interpretarlo.',
      },
      {
        id: 'cox',
        icono: 'cronometro',
        titulo: 'Regresión de Cox',
        definicion: 'Cuando la variable dependiente es el tiempo hasta un evento. Reporta HR ajustado.',
        ejemploAcademico:
          'Meses de supervivencia en cáncer según fármaco, edad y estado nutricional → Hazard Ratio ajustado.',
        ejemploCotidiano:
          'Cuánto dura una batería según marca y uso: el "tiempo hasta que muere".',
        datoSorpresa:
          'Asume riesgos proporcionales en el tiempo y maneja "censuras" (pérdidas de seguimiento).',
      },
    ],
  },

  minijuegoB: {
    tipo: 'mapa',
    titulo: 'Elige la regresión',
    instruccion: 'Selecciona la regresión según la variable dependiente (el resultado).',
    nodos: [
      { id: 'n1', etiqueta: 'Resultado: presión arterial (continua)', hueco: false },
      { id: 'h1', hueco: true },
      { id: 'n2', etiqueta: 'Resultado: muerte sí/no (dicotómica)', hueco: false },
      { id: 'h2', hueco: true },
      { id: 'n3', etiqueta: 'Resultado: tiempo hasta la recaída', hueco: false },
      { id: 'h3', hueco: true },
    ],
    banco: ['Regresión Lineal', 'Regresión Logística', 'Regresión de Cox'],
    solucion: { h1: 'Regresión Lineal', h2: 'Regresión Logística', h3: 'Regresión de Cox' },
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'El salvavidas… con letra chica',
    resumen: 'El multivariado repara la confusión del Tema 3, pero no es magia contra los sesgos.',
    tarjetas: [
      {
        id: 'no-cura-sesgos',
        icono: 'prohibido',
        titulo: 'No cura sesgos ni lo no medido',
        definicion: 'Solo ajusta confusores que fueron MEDIDOS; es inútil contra el sesgo de diseño.',
        ejemploAcademico:
          'La computadora no "ajusta" lo que nunca le entregaste: los confusores no medidos escapan.',
        ejemploCotidiano:
          'Un corrector ortográfico no arregla ideas mal pensadas: basura entra, basura sale.',
        datoSorpresa:
          'Las matemáticas más complejas no salvan a un estudio plagado de sesgos de selección o medición.',
      },
      {
        id: 'ajuste-independencia',
        icono: 'engranaje',
        titulo: 'Ajustar = aislar',
        definicion: 'Ajustar es evaluar el poder de una variable anulando el ruido de las covariables medidas.',
        ejemploAcademico:
          'Un HR ajustado de un fármaco indica su impacto puro, ya descontados edad, sexo y nutrición.',
        ejemploCotidiano:
          'Comparar sueldos "a igual experiencia, ciudad y cargo": aíslas el factor que te interesa.',
        datoSorpresa:
          'La naturaleza de la regresión la dicta exclusivamente el formato de la variable dependiente.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: modelando una cohorte de cáncer',
    escenario:
      'Tienes una cohorte con un fármaco y varias covariables. Decide el análisis para aislar el efecto real.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'El desenlace es "meses de supervivencia". ¿Qué regresión usas?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Regresión de Cox: variable dependiente = tiempo hasta el evento (reporta HR ajustado).',
            correcta: true,
            feedback: 'Correcto: tiempo hasta el evento → Cox, que además maneja censuras.',
          },
          {
            id: 'd1b',
            texto: 'Regresión logística.',
            correcta: false,
            feedback: 'No. La logística es para desenlaces dicotómicos, no para tiempo de supervivencia.',
          },
          {
            id: 'd1c',
            texto: 'Regresión lineal.',
            correcta: false,
            feedback: 'No. La lineal es para desenlaces continuos como presión o peso, no "tiempo hasta evento" con censura.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Metes edad, sexo y estado nutricional al modelo. ¿Para qué?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Para ajustar por confusores medidos y aislar el efecto independiente del fármaco.',
            correcta: true,
            feedback: 'Exacto: el ajuste neutraliza el ruido de las covariables medidas.',
          },
          {
            id: 'd2b',
            texto: 'Para inflar artificialmente la significancia.',
            correcta: false,
            feedback: 'No. El objetivo es aislar el efecto real, no manipular el p.',
          },
          {
            id: 'd2c',
            texto: 'Para eliminar el sesgo de selección del estudio.',
            correcta: false,
            feedback: 'No. El multivariado no corrige sesgos de diseño, solo ajusta confusores medidos.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Un colega dice que el modelo "corrige cualquier problema del estudio". ¿Qué respondes?',
        opciones: [
          {
            id: 'd3a',
            texto: 'No: solo ajusta confusores medidos; no cura sesgos ni ajusta lo que no se midió.',
            correcta: true,
            feedback: 'Correcto: basura en los datos = basura en el modelo, por muy sofisticado que sea.',
          },
          {
            id: 'd3b',
            texto: 'Sí: con suficientes variables, la regresión lo arregla todo.',
            correcta: false,
            feedback: 'Falso. Ningún modelo repara un sesgo de selección o medición.',
          },
          {
            id: 'd3c',
            texto: 'Sí, si la muestra es muy grande.',
            correcta: false,
            feedback: 'No. Más muestra no corrige sesgos ni confusores no medidos.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Diferencia los efectos independientes reales de los simples efectos confundidos.',
      'Ajustar es evaluar una variable anulando el ruido de las covariables medidas.',
      'La regresión la dicta exclusivamente el formato de la variable dependiente.',
      'La logística evalúa resultados binarios y genera Odds Ratios ajustados.',
      'Ni las matemáticas más complejas salvan a un estudio con sesgos de selección o medición.',
    ],
  },
};
