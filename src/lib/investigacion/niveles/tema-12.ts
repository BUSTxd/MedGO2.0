import type { NivelContenido } from '../types';

// ─── TEMA 12: Investigación Cualitativa ───
export const TEMA_12: NivelContenido = {
  id: 'tema-12',

  intro: {
    kicker: 'Nivel 12 · Análisis',
    titulo: 'Investigación Cualitativa',
    gancho:
      'Mientras lo cuantitativo pregunta "cuántos", lo cualitativo pregunta "cómo y por qué". Usa palabras, no números; escucha en vez de contar; y se detiene cuando ya no aprende nada nuevo (saturación).',
    objetivos: [
      'Diferenciar el paradigma positivista del constructivista.',
      'Conocer etnografía, teoría fundamentada y fenomenología.',
      'Entender el muestreo propositivo y la saturación.',
      'Reconocer triangulación, reflexividad y métodos mixtos.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Paradigmas, enfoques y saturación',
    resumen:
      'La realidad se construye socialmente; la muestra busca individuos informativos, no miles.',
    tarjetas: [
      {
        id: 'paradigma',
        icono: 'pieza',
        titulo: 'Positivismo vs. Constructivismo',
        definicion: 'Cuantitativo: números, hipótesis, investigador ausente. Cualitativo: significados, investigador parte activa.',
        ejemploAcademico:
          'Entender el estigma del VIH no con una encuesta, sino escuchando las vivencias de los pacientes.',
        ejemploCotidiano:
          'No preguntas "¿cuántos disfrutaron la fiesta?" sino "¿qué la hizo especial para ti?".',
        datoSorpresa:
          'En lo cualitativo el investigador no "desaparece": su interpretación es parte del proceso (reflexividad).',
      },
      {
        id: 'enfoques',
        icono: 'telescopio',
        titulo: 'Los tres enfoques',
        definicion: 'Etnografía (cultura), Teoría Fundamentada (crear teoría desde los datos) y Fenomenología (la experiencia vivida).',
        ejemploAcademico:
          'Etnografía: convivir en una comunidad. Grounded theory: construir teoría inductiva. Fenomenología: describir el "vivir" una enfermedad.',
        ejemploCotidiano:
          'Etnografía: mudarte a un barrio para entenderlo. Fenomenología: contar cómo se siente realmente mudarse.',
        ejemploAbsurdo:
          'Estudiar la cultura "gamer" jugando 3 meses con ellos (etnografía) vs. describir el puro éxtasis de ganar (fenomenología).',
        datoSorpresa:
          'Cada enfoque nace de una disciplina: etnografía (antropología), grounded theory (sociología), fenomenología (psicología).',
      },
      {
        id: 'saturacion',
        icono: 'verter',
        titulo: 'Muestreo propositivo y saturación',
        definicion: 'La muestra no es probabilística: se eligen informantes clave y se para al no surgir nada nuevo.',
        ejemploAcademico:
          'Entrevistar jóvenes hasta que las nuevas voces ya no aportan significados diferentes: saturación.',
        ejemploCotidiano:
          'Preguntas a más amigos por un buen restaurante hasta que todos repiten los mismos nombres.',
        datoSorpresa:
          'La saturación —no un número fijo— define cuándo detener la recolección en lo cualitativo.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'drag',
    titulo: 'Empareja el enfoque',
    instruccion: 'Arrastra cada enfoque o concepto hacia su descripción.',
    pares: [
      { id: 'p1', termino: 'Etnografía', match: 'Inmersión en el entorno para entender una cultura' },
      { id: 'p2', termino: 'Teoría Fundamentada', match: 'Crear teoría inductivamente desde los propios datos' },
      { id: 'p3', termino: 'Fenomenología', match: 'Describir la experiencia vivida en primera persona' },
      { id: 'p4', termino: 'Saturación', match: 'Punto en que nuevas entrevistas ya no aportan nada nuevo' },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Rigurosidad y métodos mixtos',
    resumen:
      'Cuatro elementos dan rigor: flexibilidad, iteratividad, triangulación y reflexividad.',
    tarjetas: [
      {
        id: 'triangulacion',
        icono: 'escuadra',
        titulo: 'Triangulación',
        definicion: 'Cruzar varias técnicas, fuentes o investigadores para equilibrar e invalidar suposiciones.',
        ejemploAcademico:
          'Combinar entrevistas + observaciones + documentos para no depender de una sola mirada.',
        ejemploCotidiano:
          'Antes de comprar algo, contrastas reseñas, opinión de un amigo y probarlo tú mismo.',
        datoSorpresa:
          'La triangulación es el equivalente cualitativo a "no fiarse de una sola medición".',
      },
      {
        id: 'iteratividad',
        icono: 'ciclo',
        titulo: 'Iteratividad y codificación',
        definicion: 'Recolectar y analizar a la vez, en ciclos; los textos se "codifican" con software.',
        ejemploAcademico:
          'Las entrevistas se transcriben y se codifican inductivamente con ATLAS.ti, MAXQDA o Nvivo.',
        ejemploCotidiano:
          'Vas ajustando tu lista de compras a medida que recorres el mercado, no todo de golpe al final.',
        datoSorpresa:
          'A diferencia de lo cuantitativo (lineal), lo cualitativo analiza mientras aún recolecta.',
      },
      {
        id: 'mixtos',
        icono: 'mezcla',
        titulo: 'Métodos mixtos',
        definicion: 'Integran lo cuantitativo y lo cualitativo para responder "cuántos" y "por qué".',
        ejemploAcademico:
          'En Benín, una encuesta (cuanti) guió entrevistas (cuali) sobre por qué las adolescentes no usan anticonceptivos.',
        ejemploCotidiano:
          'Primero cuentas cuántos dejaron el gimnasio (número) y luego preguntas por qué (razones).',
        datoSorpresa:
          'Para juzgar el rigor de un artículo cualitativo se usan listas como COREQ o SRQR.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'vf',
    titulo: 'Cualitativa: verdad o trampa',
    instruccion: 'Detecta las afirmaciones que malinterpretan lo cualitativo.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'La investigación cualitativa busca medir promedios y probar hipótesis estáticas.',
        esVerdadera: false,
        explicacion: 'Falso. Eso es lo cuantitativo. Lo cualitativo busca significados y el "por qué".',
      },
      {
        id: 'a2',
        texto: 'La saturación es el punto donde nuevas entrevistas ya no aportan conceptos diferentes.',
        esVerdadera: true,
        explicacion: 'Verdadero. Define cuándo detener la recolección.',
      },
      {
        id: 'a3',
        texto: 'En lo cualitativo, la recolección y el análisis siempre son lineales y separados.',
        esVerdadera: false,
        explicacion: 'Falso. Son iterativos: se recolecta y analiza en ciclos simultáneos.',
      },
      {
        id: 'a4',
        texto: 'La triangulación combina métodos, datos o investigadores para dar robustez.',
        esVerdadera: true,
        explicacion: 'Verdadero. Evita depender de una sola mirada y reduce sesgos.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Su papel en la medicina',
    resumen: 'Lo cualitativo explica el "por qué" que los números no capturan; decanta en el Tema 14.',
    tarjetas: [
      {
        id: 'reflexividad',
        icono: 'espejo',
        titulo: 'Reflexividad',
        definicion: 'El investigador reconoce cómo su propia postura influye en la interpretación.',
        ejemploAcademico:
          'Un médico que estudia pacientes debe reconocer sus propios prejuicios al interpretar sus relatos.',
        ejemploCotidiano:
          'Al opinar de una película, admitir que tu ánimo de ese día tiñó tu juicio.',
        datoSorpresa:
          'La reflexividad convierte una limitación (la subjetividad) en un elemento de rigor consciente.',
      },
      {
        id: 'complementariedad',
        icono: 'acuerdo',
        titulo: 'Complementa lo cuantitativo',
        definicion: 'Aporta las narrativas para entender barreras sociales que los números no ven.',
        ejemploAcademico:
          'Explica POR QUÉ una política de salud fracasa, algo que la estadística sola no revela.',
        ejemploCotidiano:
          'Los números dicen que la app se desinstala; las entrevistas dicen por qué la gente se frustra.',
        datoSorpresa:
          'Por eso la Ciencia de la Implementación (Tema 14) se apoya masivamente en lo cualitativo.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: diseñando un estudio cualitativo',
    escenario:
      'Quieres entender por qué las adolescentes de una comunidad no usan métodos anticonceptivos. Decide el enfoque.',
    decisiones: [
      {
        id: 'd1',
        pregunta: '¿Qué tipo de muestreo y criterio de parada usas?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Muestreo propositivo, hasta alcanzar la saturación de significados.',
            correcta: true,
            feedback: 'Correcto: eliges informantes clave y paras cuando no surge nada nuevo.',
          },
          {
            id: 'd1b',
            texto: 'Muestreo aleatorio de 1000 personas con encuesta cerrada.',
            correcta: false,
            feedback: 'Eso es cuantitativo; no captura el "por qué" en profundidad.',
          },
          {
            id: 'd1c',
            texto: 'Un solo relato basta, sin más criterio.',
            correcta: false,
            feedback: 'No. Se busca saturación, contrastando varias voces informativas.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Para dar rigor y no depender de una sola fuente, ¿qué aplicas?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Triangulación: combinar entrevistas, observación y documentos.',
            correcta: true,
            feedback: 'Exacto: cruzar técnicas equilibra e invalida suposiciones.',
          },
          {
            id: 'd2b',
            texto: 'Usar solo tu impresión personal como dato único.',
            correcta: false,
            feedback: 'No. Eso es lo contrario del rigor cualitativo.',
          },
          {
            id: 'd2c',
            texto: 'Un valor p sobre las entrevistas.',
            correcta: false,
            feedback: 'No aplica: lo cualitativo no busca significancia estadística.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Quieres además cuantificar la magnitud del problema. ¿Qué diseño integras?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Métodos mixtos: una encuesta (cuanti) que guíe entrevistas a profundidad (cuali).',
            correcta: true,
            feedback: 'Correcto: mixtos responden "cuántos" y "por qué" a la vez.',
          },
          {
            id: 'd3b',
            texto: 'Descartar lo cuantitativo por completo.',
            correcta: false,
            feedback: 'No. Si quieres magnitud, lo cuantitativo aporta ese "cuántos".',
          },
          {
            id: 'd3c',
            texto: 'Convertir las entrevistas en un ECA.',
            correcta: false,
            feedback: 'No tiene sentido: un ECA es experimental, no interpretativo.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'No busca hipótesis ni promedios: entiende percepciones y el "por qué" social.',
      'La recolección y el análisis ocurren de forma cíclica e iterativa.',
      'La saturación es el punto donde nuevas entrevistas no aportan conceptos nuevos.',
      'La triangulación otorga robustez y evita sesgos de visión única.',
      'Grounded theory crea teoría; etnografía observa culturas; fenomenología describe vivencias.',
    ],
  },
};
