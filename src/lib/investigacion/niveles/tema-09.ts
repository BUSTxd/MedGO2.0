import type { NivelContenido } from '../types';

// ─── TEMA 9: Consolidación y Repaso Metodológico ───
export const TEMA_09: NivelContenido = {
  id: 'tema-09',

  intro: {
    kicker: 'Nivel 9 · Análisis',
    titulo: 'Consolidación y Repaso Metodológico',
    gancho:
      'Punto de control. La investigación no es una colección de conceptos sueltos, sino un puente continuo desde una pregunta anclada en un universo inalcanzable hasta datos recogidos en sujetos reales.',
    objetivos: [
      'Rearmar la secuencia: principios → métodos → amenazas → inferencia.',
      'Entender el mapa de Hulley (universo → plan → estudio real).',
      'Reconocer dónde atacan sesgos y confusores.',
      'Confirmar que la validez interna es requisito antes que la precisión.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'La Arquitectura de la Inferencia',
    resumen:
      'El estudio conecta dos mundos: la verdad teórica inalcanzable y los datos empíricos tangibles.',
    tarjetas: [
      {
        id: 'universo',
        icono: 'estrellas',
        titulo: 'Verdad en el universo',
        definicion: 'La población objetivo y el fenómeno de interés reales, que nunca vemos por completo.',
        ejemploAcademico:
          'La saturación de O₂ verdadera de todos los niños del mundo: el fenómeno que queremos entender.',
        ejemploCotidiano:
          'El sabor "real" de todos los cafés del planeta: existe como idea, imposible de probar entero.',
        datoSorpresa:
          'La inferencia intenta "devolvernos la mirada" al universo desde una muestra minúscula.',
      },
      {
        id: 'plan',
        icono: 'escuadra',
        titulo: 'Plan de estudio',
        definicion: 'La muestra planificada y las variables definidas para acercarnos al universo.',
        ejemploAcademico:
          'Elegir 500 niños, medir el ITA y el error del oxímetro: el plan que aterriza el fenómeno.',
        ejemploCotidiano:
          'Decidir qué 20 cafeterías probar y con qué criterios calificarlas.',
        datoSorpresa:
          'Entre el plan y la ejecución real es donde se cuelan los errores de diseño (sesgos, confusores).',
      },
      {
        id: 'estudio-real',
        icono: 'tubo',
        titulo: 'Verdad del estudio',
        definicion: 'Los sujetos reales y las mediciones efectivamente obtenidas.',
        ejemploAcademico:
          'Las saturaciones realmente registradas en los niños incluidos: lo que de verdad tienes en la base.',
        ejemploCotidiano:
          'Las notas que finalmente pusiste a las cafeterías que sí visitaste.',
        datoSorpresa:
          'Si el "puente" sobrevive intacto, la estadística puede devolver el hallazgo hacia el universo.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'orden',
    titulo: 'El mapa de Hulley',
    instruccion: 'Ordena el recorrido desde la verdad teórica hasta los datos reales.',
    pasos: [
      { id: 's1', texto: 'Verdad en el universo (población y fenómeno de interés)' },
      { id: 's2', texto: 'Plan de estudio (muestra planificada y variables)' },
      { id: 's3', texto: 'Verdad del estudio (sujetos reales y mediciones)' },
      { id: 's4', texto: 'Inferencia de vuelta hacia el universo' },
    ],
    ordenCorrecto: ['s1', 's2', 's3', 's4'],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Dónde se rompe el puente',
    resumen:
      'Sesgos y confusores atacan la traducción entre el plan teórico y la ejecución real.',
    tarjetas: [
      {
        id: 'sesgo-repaso',
        icono: 'iman',
        titulo: 'Sesgo (repaso)',
        definicion: 'Error sistemático que distorsiona la validez; no se arregla con más muestra.',
        ejemploAcademico:
          'Un instrumento mal calibrado empuja todos los datos en una dirección falsa.',
        ejemploCotidiano:
          'Una regla que empieza en el "1" en vez del "0": todas tus medidas quedan corridas.',
        datoSorpresa:
          'La validez interna es el prerrequisito: sin ella, no tiene sentido calcular valores p.',
      },
      {
        id: 'confusor-repaso',
        icono: 'detective',
        titulo: 'Confusor (repaso)',
        definicion: 'Tercera variable asociada a exposición y evento que distorsiona la relación.',
        ejemploAcademico:
          'El tabaco confundiendo la relación café–cáncer: se ajusta si se midió; si no, escapa.',
        ejemploCotidiano:
          'El calor confundiendo la relación helado–ahogamientos.',
        datoSorpresa:
          'Primero cuestiona los sesgos (validez); solo después cree en la precisión matemática.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'quiz',
    titulo: 'Repaso integrador',
    pregunta:
      'Al leer un artículo con un p<0.001 impactante, ¿cuál es el orden mental correcto del investigador?',
    opciones: [
      {
        id: 'o1',
        texto: 'Primero evaluar validez (sesgos y confusores) y luego interpretar la precisión (p, IC).',
        correcta: true,
        explicacion:
          'Correcto: la validez interna es el requisito. Un p brillante sobre datos sesgados no vale.',
      },
      {
        id: 'o2',
        texto: 'Creer el p<0.001 de inmediato: si es tan pequeño, el estudio es válido.',
        correcta: false,
        explicacion:
          'Incorrecto: un p diminuto no protege del sesgo; podrías estar "precisamente equivocado".',
      },
      {
        id: 'o3',
        texto: 'Ignorar el diseño y mirar solo el tamaño de muestra.',
        correcta: false,
        explicacion:
          'Incorrecto: más muestra mejora precisión pero no corrige sesgos ni confusión.',
      },
      {
        id: 'o4',
        texto: 'Aceptar las conclusiones si la revista es prestigiosa.',
        correcta: false,
        explicacion:
          'Incorrecto: el prestigio no reemplaza el análisis crítico de validez y precisión.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'El hilo conductor',
    resumen: 'Este repaso es el pivote antes de entrar de lleno a los cálculos (Temas 10, 11 y 13).',
    tarjetas: [
      {
        id: 'validez-primero',
        icono: 'medalla',
        titulo: 'Validez antes que precisión',
        definicion: 'Evaluar precisión asume que el estudio ya superó la prueba de la validez.',
        ejemploAcademico:
          'De nada sirve un IC estrecho si los datos que lo generaron están sesgados.',
        ejemploCotidiano:
          'Afinar la puntería no ayuda si estás apuntando al blanco equivocado.',
        datoSorpresa:
          'Un estudio sesgado con datos "precisos" es más peligroso que uno impreciso y honesto.',
      },
      {
        id: 'flujo',
        icono: 'cadena',
        titulo: 'Todo conectado',
        definicion: 'Principios → métodos → amenazas → inferencia forman un flujo, no piezas sueltas.',
        ejemploAcademico:
          'El enfoque sistémico (Tema 1) fundamenta el multivariado (Tema 13); la muestra (Tema 2) habilita la inferencia (Tema 4).',
        ejemploCotidiano:
          'Una receta: ingredientes, técnica, control de errores y prueba final; saltarte un paso arruina el plato.',
        datoSorpresa:
          'Este nivel sintetiza los Temas 1-8 antes de sumergirte en los cálculos estadísticos.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: auditando un estudio de principio a fin',
    escenario:
      'Te dan un artículo completo. Aplica el modelo mental del curso para juzgarlo en orden.',
    decisiones: [
      {
        id: 'd1',
        pregunta: '¿Cuál es el primer paso al evaluar el estudio?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Revisar la validez interna: buscar sesgos y confusores en el diseño.',
            correcta: true,
            feedback: 'Correcto: la validez es el prerrequisito antes de creer cualquier número.',
          },
          {
            id: 'd1b',
            texto: 'Ir directo al valor p de la Tabla 2.',
            correcta: false,
            feedback: 'No. La precisión (p, IC) se interpreta DESPUÉS de asegurar la validez.',
          },
          {
            id: 'd1c',
            texto: 'Mirar cuántas citas tiene el artículo.',
            correcta: false,
            feedback: 'Irrelevante para juzgar la validez metodológica.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'El estudio mide bien, sin sesgos evidentes. ¿Qué evalúas ahora?',
        opciones: [
          {
            id: 'd2a',
            texto: 'La precisión: magnitud del efecto y su IC 95%.',
            correcta: true,
            feedback: 'Exacto: superada la validez, toca leer magnitud y precisión.',
          },
          {
            id: 'd2b',
            texto: 'Nada más: si no hay sesgos, el estudio es perfecto.',
            correcta: false,
            feedback: 'No. Falta evaluar magnitud y precisión para saber si el hallazgo importa.',
          },
          {
            id: 'd2c',
            texto: 'El diseño de la portada de la revista.',
            correcta: false,
            feedback: 'Irrelevante para la interpretación científica.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Concluyes. ¿Qué frase resume el criterio correcto?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Validez primero, precisión después: sin validez, la estadística es humo.',
            correcta: true,
            feedback: 'Correcto: ese es el modelo mental que consolida todo el curso hasta aquí.',
          },
          {
            id: 'd3b',
            texto: 'Un p pequeño garantiza que la conclusión es verdadera.',
            correcta: false,
            feedback: 'No. Un p pequeño sobre un estudio sesgado sigue siendo engañoso.',
          },
          {
            id: 'd3c',
            texto: 'La muestra grande lo compensa todo.',
            correcta: false,
            feedback: 'No. La muestra grande no cura sesgos ni confusión.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'El estudio conecta la teoría inalcanzable con los datos empíricos tangibles.',
      'Sesgos y confusores atacan la traducción del plan a la ejecución real.',
      'La inferencia eleva el hallazgo de la muestra de vuelta al universo.',
      'La validez interna es obligatoria; si los datos están sesgados, el estudio colapsa.',
      'Evaluar precisión asume que el estudio ya superó la prueba de validez.',
    ],
  },
};
