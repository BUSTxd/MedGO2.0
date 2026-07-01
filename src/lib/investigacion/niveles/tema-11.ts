import type { NivelContenido } from '../types';

// ─── TEMA 11: Análisis Bivariado ───
export const TEMA_11: NivelContenido = {
  id: 'tema-11',

  intro: {
    kicker: 'Nivel 11 · Análisis',
    titulo: 'Análisis Bivariado',
    gancho:
      'Cruzas exactamente DOS variables para ver si se relacionan. La prueba estadística no la eliges por gusto: la dicta rígidamente la escala de ambas variables. Pero ojo: el bivariado asume que el mundo está vacío.',
    objetivos: [
      'Elegir la prueba según la escala de las dos variables.',
      'Entender la asociación "cruda" (sin ajustar confusores).',
      'No confundir correlación con causalidad.',
      'Usar el bivariado como filtro previo al multivariado.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Selección de la prueba estadística',
    resumen:
      'La escala de la variable independiente y de la dependiente determina mecánicamente la prueba.',
    tarjetas: [
      {
        id: 'chi-cuadrado',
        icono: 'cuadricula',
        titulo: 'Chi-cuadrado',
        definicion: 'Compara proporciones al cruzar dos variables categóricas (dicotómica vs dicotómica).',
        ejemploAcademico:
          'Tabaquismo (sí/no) vs EPOC (sí/no): tabla de contingencia analizada con Chi-cuadrado (o Fisher si n pequeño).',
        ejemploCotidiano:
          '¿Llevar paraguas (sí/no) se asocia a llegar seco (sí/no)? Cruzas proporciones.',
        datoSorpresa:
          'Si las frecuencias esperadas son muy bajas, se usa la prueba exacta de Fisher en lugar de Chi-cuadrado.',
      },
      {
        id: 't-student',
        icono: 'regla',
        titulo: 'T de Student',
        definicion: 'Compara la media de una variable numérica normal entre dos grupos.',
        ejemploAcademico:
          'Colesterol (numérico normal) en fumadores vs no fumadores: diferencia de medias con T-test.',
        ejemploCotidiano:
          'Comparar la altura promedio de dos equipos de básquet.',
        datoSorpresa:
          'Si la variable numérica NO es normal, se usa Mann-Whitney en vez de la T de Student.',
      },
      {
        id: 'correlacion',
        icono: 'subida',
        titulo: 'Correlación',
        definicion: 'Mide si dos variables numéricas suben o bajan juntas (Pearson/Spearman).',
        ejemploAcademico:
          'Horas de estudio vs nota del examen: una correlación positiva, pero no prueba causalidad.',
        ejemploCotidiano:
          'A más horas de sol, más ventas de helado: suben juntas, pero el sol no "obliga" a comprar.',
        ejemploAbsurdo:
          '"A más piratas, menos calentamiento global": correlacionan… y no tiene ningún sentido causal.',
        datoSorpresa:
          'Una correlación fuerte NO implica causalidad y no reemplaza a una regresión.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'mapa',
    titulo: 'Elige la prueba correcta',
    instruccion: 'Selecciona la prueba estadística que corresponde a cada cruce de variables.',
    nodos: [
      { id: 'n1', etiqueta: 'Dicotómica × Dicotómica', hueco: false },
      { id: 'h1', hueco: true },
      { id: 'n2', etiqueta: 'Dicotómica × Numérica normal', hueco: false },
      { id: 'h2', hueco: true },
      { id: 'n3', etiqueta: 'Dicotómica × Numérica NO normal', hueco: false },
      { id: 'h3', hueco: true },
      { id: 'n4', etiqueta: 'Numérica × Numérica', hueco: false },
      { id: 'h4', hueco: true },
    ],
    banco: ['Chi-cuadrado', 'T de Student', 'Mann-Whitney', 'Correlación'],
    solucion: { h1: 'Chi-cuadrado', h2: 'T de Student', h3: 'Mann-Whitney', h4: 'Correlación' },
  },

  bloque2: {
    id: 'b2',
    titulo: 'Interpretación e intersección clínica',
    resumen:
      'El bivariado da asociaciones crudas; su límite es asumir que las variables operan en el vacío.',
    tarjetas: [
      {
        id: 'cruda',
        icono: 'tubo',
        titulo: 'Asociación cruda',
        definicion: 'La relación entre dos variables SIN ajustar por confusores.',
        ejemploAcademico:
          'Un OR crudo de 3.2 (p<0.001) sugiere asociación fuerte, pero podría deberse a un confusor no considerado.',
        ejemploCotidiano:
          'Notar que "los que usan reloj caro ganan más" sin considerar que también estudiaron más.',
        datoSorpresa:
          'El bivariado ignora completamente los factores de confusión: por eso es solo un primer filtro.',
      },
      {
        id: 'filtro',
        icono: '🔎',
        titulo: 'Filtro hacia el multivariado',
        definicion: 'Las variables con asociación cruda relevante pasan a ser "ajustadas" después.',
        ejemploAcademico:
          'Todo hallazgo bivariado con p<0.05 es candidato natural a entrar al modelo multivariado (Tema 13).',
        ejemploCotidiano:
          'Preseleccionas ingredientes prometedores antes de probar la receta final con todos juntos.',
        datoSorpresa:
          'Cuidado al colapsar categorías de variables politómicas: destruyes información original.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'vf',
    titulo: 'Bivariado: verdad o trampa',
    instruccion: 'Detecta los errores sutiles sobre el análisis de dos variables.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'Una correlación fuerte entre dos variables demuestra que una causa la otra.',
        esVerdadera: false,
        explicacion: 'Falso. Correlación no es causalidad; podría haber un confusor detrás.',
      },
      {
        id: 'a2',
        texto: 'Dicotómica vs dicotómica se analiza con Chi-cuadrado (comparación de proporciones).',
        esVerdadera: true,
        explicacion: 'Verdadero. Es la prueba clásica para tablas de contingencia 2×2.',
      },
      {
        id: 'a3',
        texto: 'El análisis bivariado ya ajusta por los factores de confusión.',
        esVerdadera: false,
        explicacion: 'Falso. El bivariado da asociaciones crudas; el ajuste llega con el multivariado.',
      },
      {
        id: 'a4',
        texto: 'Para comparar una media numérica normal entre dos grupos se usa la T de Student.',
        esVerdadera: true,
        explicacion: 'Verdadero. Si no fuera normal, se usaría Mann-Whitney.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Su lugar en la cadena',
    resumen: 'Ejecuta la "magnitud" del Tema 5 y prepara las variables para el Tema 13.',
    tarjetas: [
      {
        id: 'magnitud-bivariado',
        icono: 'escuadra',
        titulo: 'Magnitud, otra vez',
        definicion: 'Se lee el cruce por su magnitud (OR, diferencia de medias), no solo por el p.',
        ejemploAcademico:
          'Un OR crudo de 1.9 con p=0.08 puede ser biológicamente vital pese a no ser "significativo".',
        ejemploCotidiano:
          'Una pista fuerte aunque no "confirmada": no la descartas solo porque el p pasó de 0.05.',
        datoSorpresa:
          'El bivariado es un filtro conceptual: lleva las variables sospechosas al análisis profundo.',
      },
      {
        id: 'no-colapsar',
        icono: 'advertencia',
        titulo: 'No colapses a la ligera',
        definicion: 'Unir categorías de una variable politómica destruye información original.',
        ejemploAcademico:
          'Fusionar "leve/moderado/grave" en "sí/no" pierde el matiz de gravedad que podría importar.',
        ejemploCotidiano:
          'Resumir "excelente/bueno/regular/malo" en "me gustó/no me gustó" borra información útil.',
        datoSorpresa:
          'A veces colapsar es necesario, pero siempre pierdes detalle: hazlo con criterio, no por comodidad.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: eligiendo pruebas para un artículo',
    escenario:
      'Analizas una base con varias variables. Decide la prueba correcta y su interpretación.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'Cruzas tabaquismo (sí/no) con hipertensión (sí/no). ¿Qué prueba usas?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Chi-cuadrado (o Fisher si el n es pequeño): dos variables categóricas.',
            correcta: true,
            feedback: 'Correcto: comparas proporciones en una tabla de contingencia.',
          },
          {
            id: 'd1b',
            texto: 'T de Student.',
            correcta: false,
            feedback: 'No. La T compara medias numéricas, no proporciones categóricas.',
          },
          {
            id: 'd1c',
            texto: 'Correlación de Pearson.',
            correcta: false,
            feedback: 'No. Pearson es para dos variables numéricas.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Comparas el colesterol (numérico, distribución normal) entre diabéticos y no diabéticos. ¿Prueba?',
        opciones: [
          {
            id: 'd2a',
            texto: 'T de Student: diferencia de medias entre dos grupos, variable numérica normal.',
            correcta: true,
            feedback: 'Exacto. Si no fuera normal, usarías Mann-Whitney.',
          },
          {
            id: 'd2b',
            texto: 'Chi-cuadrado.',
            correcta: false,
            feedback: 'No. El colesterol es numérico; Chi-cuadrado es para categóricas.',
          },
          {
            id: 'd2c',
            texto: 'Correlación de Spearman.',
            correcta: false,
            feedback: 'No. Aquí comparas grupos, no dos numéricas continuas entre sí.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Encuentras un OR crudo de 3.2 (p<0.001). ¿Qué concluyes?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Asociación cruda fuerte; candidata a ajustarse por confusores en el multivariado.',
            correcta: true,
            feedback: 'Correcto: el bivariado es un filtro; falta ajustar antes de hablar de efecto independiente.',
          },
          {
            id: 'd3b',
            texto: 'Queda demostrada la causalidad directa.',
            correcta: false,
            feedback: 'No. Es una asociación cruda; podría deberse a confusión.',
          },
          {
            id: 'd3c',
            texto: 'No sirve porque el bivariado nunca importa.',
            correcta: false,
            feedback: 'No. Es un paso preliminar útil para seleccionar variables.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Relaciona estrictamente DOS variables; la asociación es cruda, sin ajustar confusores.',
      'Dicotómica vs dicotómica se testea con Chi-cuadrado (proporciones).',
      'Dicotómica vs cuantitativa normal se testea con T de Student (medias).',
      'La correlación evalúa si dos numéricas suben o bajan juntas (no prueba causa).',
      'Es el paso preliminar para seleccionar variables hacia el multivariado.',
    ],
  },
};
