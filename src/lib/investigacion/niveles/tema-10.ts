import type { NivelContenido } from '../types';

// ─── TEMA 10: Introducción a la Estadística Descriptiva ───
export const TEMA_10: NivelContenido = {
  id: 'tema-10',

  intro: {
    kicker: 'Nivel 10 · Análisis',
    titulo: 'Introducción a la Estadística Descriptiva',
    gancho:
      'Antes de cruzar variables para buscar causas, todo estudio empieza describiendo sus datos. La escala de medición de cada variable decide qué herramienta usar. Es el control de calidad de tu base de datos.',
    objetivos: [
      'Reconocer filas (pacientes) y columnas (variables) en una base de datos.',
      'Clasificar variables cualitativas y cuantitativas.',
      'Distinguir escala de razón (cero real) de intervalo (cero relativo).',
      'Elegir el resumen correcto según la escala.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'La base de datos y las escalas',
    resumen:
      'El primer análisis siempre es descriptivo: resume y organiza antes de comparar.',
    tarjetas: [
      {
        id: 'base-datos',
        icono: 'archivador',
        titulo: 'Filas y columnas',
        definicion: 'En una base de datos, cada fila es un paciente y cada columna es una variable.',
        ejemploAcademico:
          'En la UCI pediátrica: fila = un niño; columnas = edad, peso, diagnóstico, saturación.',
        ejemploCotidiano:
          'Tu lista de contactos: cada fila una persona, cada columna un dato (nombre, teléfono, cumpleaños).',
        datoSorpresa:
          'Una variable es, literalmente, "un hecho que tiende a variar" entre los sujetos.',
      },
      {
        id: 'cualitativas',
        icono: 'etiqueta',
        titulo: 'Variables cualitativas',
        definicion: 'Categorías: dicotómicas, nominales (sin orden) u ordinales (con orden).',
        ejemploAcademico:
          'Sexo (dicotómica), país de origen (nominal), estadio del cáncer I-IV (ordinal).',
        ejemploCotidiano:
          'Sabor favorito (nominal), talla S/M/L (ordinal), ¿tienes mascota? sí/no (dicotómica).',
        ejemploAbsurdo:
          'Clasificar memes en "graciosos / muy graciosos / me morí": eso es una variable ordinal.',
        datoSorpresa:
          'Las cualitativas se resumen en frecuencias y porcentajes (tablas o gráficos de barras).',
      },
      {
        id: 'cuantitativas',
        icono: 'escuadra',
        titulo: 'Razón vs. Intervalo',
        definicion: 'Razón tiene un cero real (ausencia); intervalo tiene un cero relativo.',
        ejemploAcademico:
          'Peso en kg (razón: 0 = ausencia). Temperatura en °C (intervalo: 0 °C no es "ausencia de calor").',
        ejemploCotidiano:
          'Dinero en tu billetera (razón, 0 = nada). La hora del día (intervalo, las 0h no es "ausencia de tiempo").',
        datoSorpresa:
          'En razón puedes decir "el doble" (4 kg es el doble de 2 kg); en intervalo no (20 °C no es "el doble de calor" que 10 °C).',
      },
    ],
  },

  minijuegoA: {
    tipo: 'drag',
    titulo: 'Clasifica la variable',
    instruccion: 'Arrastra cada tipo de escala hacia su ejemplo.',
    pares: [
      { id: 'p1', termino: 'Nominal', match: 'País de origen (categorías sin orden jerárquico)' },
      { id: 'p2', termino: 'Ordinal', match: 'Estadio del cáncer I-II-III-IV (orden con jerarquía)' },
      { id: 'p3', termino: 'Razón', match: 'Peso en kg (el cero significa ausencia real)' },
      { id: 'p4', termino: 'Intervalo', match: 'Temperatura en °C (el cero es relativo, no ausencia)' },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Resúmenes según la escala',
    resumen:
      'La escala dicta la herramienta: proporciones para categóricas, tendencia y dispersión para numéricas.',
    tarjetas: [
      {
        id: 'frecuencias',
        icono: 'barras',
        titulo: 'Frecuencias (cualitativas)',
        definicion: 'Absolutas, relativas y acumuladas; se muestran en tablas o gráficos de barras.',
        ejemploAcademico:
          'Distribución de diagnósticos en la UCI: 40% respiratorio, 30% cardíaco, 30% otros.',
        ejemploCotidiano:
          'Cuántas veces salió cada sabor de helado en las encuestas: una tabla de frecuencias.',
        datoSorpresa:
          'En variables nominales el orden de las barras no importa; en ordinales, sí respeta la jerarquía.',
      },
      {
        id: 'tendencia-dispersion',
        icono: 'diana',
        titulo: 'Tendencia central y dispersión',
        definicion: 'Numéricas: su "centro" (media o mediana) y su "amplitud" (desviación estándar).',
        ejemploAcademico:
          'Presión arterial: media ± desviación estándar si es normal; mediana y rango si no lo es.',
        ejemploCotidiano:
          'Tu gasto mensual promedio (centro) y cuánto varía de un mes a otro (dispersión).',
        datoSorpresa:
          'La elección entre media y mediana depende de si la distribución es normal o está sesgada.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'mapa',
    titulo: 'Completa la clasificación',
    instruccion: 'Elige el tipo de escala correcto para cada variable.',
    nodos: [
      { id: 'n1', etiqueta: 'Sexo (H/M)', hueco: false },
      { id: 'h1', hueco: true },
      { id: 'n2', etiqueta: 'Nivel educativo (primaria/secundaria/superior)', hueco: false },
      { id: 'h2', hueco: true },
      { id: 'n3', etiqueta: 'Peso en kilogramos', hueco: false },
      { id: 'h3', hueco: true },
    ],
    banco: ['Dicotómica', 'Ordinal', 'Razón'],
    solucion: { h1: 'Dicotómica', h2: 'Ordinal', h3: 'Razón' },
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Por qué es el paso 1',
    resumen: 'El análisis descriptivo aplica las definiciones operativas (Tema 2) y prepara el bivariado (Tema 11).',
    tarjetas: [
      {
        id: 'regla-oro',
        icono: 'uno',
        titulo: 'Regla de oro',
        definicion: 'En toda investigación cuantitativa, el primer análisis es siempre descriptivo.',
        ejemploAcademico:
          'Antes de cruzar variables, describes cada una: detectas errores, valores imposibles y patrones.',
        ejemploCotidiano:
          'Antes de cocinar, revisas cada ingrediente: si uno está malo, lo notas ahora, no en el plato final.',
        datoSorpresa:
          'Saltarse el descriptivo esconde errores de datos que después arruinan cualquier análisis avanzado.',
      },
      {
        id: 'escala-manda',
        icono: 'brujula',
        titulo: 'La escala manda',
        definicion: 'El tipo de variable (nominal, ordinal, numérica) dicta cómo se resume y se grafica.',
        ejemploAcademico:
          'Categóricas → barras y proporciones; numéricas continuas → histogramas y medidas de resumen.',
        ejemploCotidiano:
          'No mides "sabor favorito" con un promedio ni "temperatura" con un gráfico de pastel.',
        datoSorpresa:
          'La misma pregunta mal escalada lleva a un gráfico equivocado y a conclusiones absurdas.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: control de calidad de una base de datos',
    escenario:
      'Recibes la base de una UCI pediátrica. Aplica el análisis descriptivo antes de cualquier cruce.',
    decisiones: [
      {
        id: 'd1',
        pregunta: '¿Cuál es tu primer paso con los datos?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Describir cada variable por separado (análisis univariado) según su escala.',
            correcta: true,
            feedback: 'Correcto: el primer análisis siempre es descriptivo.',
          },
          {
            id: 'd1b',
            texto: 'Correr de inmediato una regresión multivariada.',
            correcta: false,
            feedback: 'No. Sin describir primero, no detectas errores ni entiendes tus variables.',
          },
          {
            id: 'd1c',
            texto: 'Cruzar todas las variables entre sí al azar.',
            correcta: false,
            feedback: 'No. Eso es "pescar" asociaciones; primero describe.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Para la variable "diagnóstico" (categórica nominal), ¿qué resumen usas?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Frecuencias absolutas y relativas (tabla o barras).',
            correcta: true,
            feedback: 'Exacto: las cualitativas se resumen en proporciones.',
          },
          {
            id: 'd2b',
            texto: 'La media y la desviación estándar del diagnóstico.',
            correcta: false,
            feedback: 'No tiene sentido promediar categorías nominales.',
          },
          {
            id: 'd2c',
            texto: 'Un histograma de intervalos.',
            correcta: false,
            feedback: 'El histograma es para numéricas continuas, no para categorías nominales.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'La "temperatura corporal" está en °C. Un colega dice "40 °C es el doble de calor que 20 °C". ¿Correcto?',
        opciones: [
          {
            id: 'd3a',
            texto: 'No: °C es escala de intervalo (cero relativo); no se interpretan razones como "el doble".',
            correcta: true,
            feedback: 'Correcto: solo en escala de razón (cero real) tiene sentido decir "el doble".',
          },
          {
            id: 'd3b',
            texto: 'Sí, 40 es el doble de 20 en cualquier escala.',
            correcta: false,
            feedback: 'No. En intervalo el cero es relativo; "el doble" no aplica.',
          },
          {
            id: 'd3c',
            texto: 'Depende del termómetro.',
            correcta: false,
            feedback: 'No. Depende de la escala de medición, no del instrumento.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Toda base de datos tiene pacientes en las filas y variables en las columnas.',
      'El análisis descriptivo es obligatorio como paso 1 de todo estudio cuantitativo.',
      'La escala de medición dicta cómo se resume el dato.',
      'Variables de intervalo (°C) no tienen cero absoluto; las de razón (kg) sí.',
      'Cualitativas → frecuencias y porcentajes; cuantitativas → centro y dispersión.',
    ],
  },
};
