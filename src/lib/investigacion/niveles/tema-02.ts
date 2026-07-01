import type { NivelContenido } from '../types';

// ─── TEMA 2: Diseño Muestral y Gestión Científica de Datos ───
export const TEMA_02: NivelContenido = {
  id: 'tema-02',

  intro: {
    kicker: 'Nivel 2 · Fundamentos',
    titulo: 'Diseño Muestral y Gestión de Datos',
    gancho:
      'No puedes estudiar a toda la humanidad. La ciencia se conforma con una muestra —una de infinitas posibles— y convierte conceptos abstractos en números medibles. Aquí decides a quién mides y qué mides.',
    objetivos: [
      'Recorrer el embudo: población objetivo → accesible → muestra del estudio.',
      'Distinguir criterios de inclusión de criterios de exclusión.',
      'Entender la variabilidad muestral y por qué existe la inferencia.',
      'Pasar de la definición conceptual a la operativa de una variable.',
    ],
    stats: [
      { label: 'Población objetivo', valor: '24,650', viz: 'line' },
      { label: 'Muestra', valor: '1,256', sub: '5.1%', viz: 'dots' },
      { label: 'Variabilidad muestral', valor: 'σ x̄', viz: 'curve' },
    ],
    destacados: [
      { icono: 'diana', texto: 'Decisiones basadas en evidencia' },
      { icono: 'flechas', texto: 'De la población a la muestra' },
      { icono: 'subida', texto: 'Variabilidad e inferencia' },
      { icono: 'escudo', texto: 'Datos de calidad, resultados confiables' },
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'El Diseño Muestral y la Variabilidad',
    resumen:
      'De una población teórica infinita bajamos, mediante filtros, a un grupo tangible que sí podemos medir.',
    tarjetas: [
      {
        id: 'embudo',
        icono: 'reloj',
        ilustracion: 'embudo',
        iconoCotidiano: 'chat',
        iconoAcademico: 'birrete',
        iconoAbsurdo: 'chincheta',
        iconoDato: 'destello',
        titulo: 'El embudo poblacional',
        definicion:
          'La reducción de la población objetivo (teórica) hacia la muestra real del estudio, paso a paso.',
        ejemploAcademico:
          'Población objetivo: todos los hipertensos del Perú → accesible: los del hospital → muestra: los 300 que aceptaron.',
        ejemploCotidiano:
          'Quieres opinión "de todos" sobre una pizzería, pero solo puedes preguntar a los que pasan por tu cuadra hoy.',
        ejemploAbsurdo:
          'Prometes encuestar "a la humanidad" sobre el mejor sabor de helado y terminas con tu grupo de WhatsApp de 12 primos.',
        datoSorpresa:
          'Tu estudio nunca captura "la verdad universal": solo la de una muestra. Por eso toda conclusión es probabilística.',
      },
      {
        id: 'inclusion-exclusion',
        icono: 'puerta',
        ilustracion: 'embudoFiltro',
        iconoCotidiano: 'personas',
        iconoAcademico: 'libro',
        iconoAbsurdo: 'guitarra',
        iconoDato: 'escudo',
        titulo: 'Inclusión vs. Exclusión',
        definicion:
          'Inclusión define quién entra; exclusión retira, de los ya incluidos, a quienes traen riesgo o sesgo.',
        ejemploAcademico:
          'Estudio de hipertensión: incluir adultos >18 años (inclusión); excluir gestantes para protegerlas (exclusión).',
        ejemploCotidiano:
          'Fiesta: invitas a "amigos del cole" (inclusión) pero retiras a los que siempre pelean (exclusión).',
        ejemploAbsurdo:
          'Casting para tu banda: incluyes a "los que tocan algo", excluyes a tu tío que solo toca la bocina del carro.',
        datoSorpresa:
          'La exclusión se aplica DESPUÉS y solo sobre quienes ya cumplían la inclusión. No son dos listas independientes.',
      },
      {
        id: 'variabilidad',
        icono: 'azar',
        ilustracion: 'dados',
        iconoCotidiano: 'fruta',
        iconoAcademico: 'subida',
        iconoAbsurdo: 'azar',
        iconoDato: 'diana',
        titulo: 'Variabilidad muestral',
        definicion:
          'Si extraes muestra 1, 2 o 10 de la misma población, sus resultados variarán solo por azar.',
        ejemploAcademico:
          'La media de colesterol cambia entre dos muestras del mismo hospital aunque midas igual. A mayor n, más se acerca al parámetro real.',
        ejemploCotidiano:
          'Sacas 5 mandarinas de un costal y salen dulces; otras 5 salen ácidas. El costal es el mismo; el azar mandó.',
        ejemploAbsurdo:
          'Tiras 10 dados hoy y sacas promedio 3.2; mañana 3.9. Nadie cambió los dados: es el azar haciendo travesuras.',
        datoSorpresa:
          'Aumentar el tamaño de muestra no elimina el azar, pero sí lo reduce: el estimado se acerca al valor real.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'orden',
    titulo: 'El embudo de la población',
    instruccion: 'Ordena de lo más amplio (teórico) a lo más concreto (lo que realmente mides).',
    pasos: [
      { id: 's1', texto: 'Población objetivo (todos los que tienen el fenómeno)' },
      { id: 's2', texto: 'Población accesible (a los que sí puedes llegar)' },
      { id: 's3', texto: 'Muestra objetivo (a quienes planeas incluir)' },
      { id: 's4', texto: 'Muestra del estudio (los que finalmente midieron)' },
    ],
    ordenCorrecto: ['s1', 's2', 's3', 's4'],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Gestión Científica de Datos',
    resumen:
      'Un concepto clínico abstracto se transforma en un número interpretable mediante instrumentos precisos.',
    tarjetas: [
      {
        id: 'conceptual',
        icono: 'idea',
        titulo: 'Definición conceptual',
        definicion: 'El "qué es" teórico de una variable, antes de decidir cómo medirla.',
        ejemploAcademico:
          '¿Qué es "desnutrición"? La respuesta teórica: un estado de déficit nutricional. Aún no dice cómo medirlo.',
        ejemploCotidiano:
          'Definir qué significa "buen clima" antes de decidir si lo mides por temperatura, sol o humedad.',
        datoSorpresa:
          'Sin una definición conceptual clara, dos investigadores medirán cosas distintas creyendo que miden lo mismo.',
      },
      {
        id: 'operativa',
        icono: 'regla',
        titulo: 'Definición operativa',
        definicion: 'El instrumento, procedimiento y escala EXACTOS con que se medirá la variable.',
        ejemploAcademico:
          'Desnutrición operativa: pesar con balanza calibrada, medir talla y calcular IMC con puntos de corte definidos.',
        ejemploCotidiano:
          '"Buen clima" operativo: temperatura entre 20-26 °C medida con este termómetro a las 3 pm.',
        ejemploAbsurdo:
          'Medir "qué tan buen amigo eres" con un test de BuzzFeed. Es operativo… pero elegiste un instrumento pésimo.',
        datoSorpresa:
          'La definición operativa es lo que hace tu estudio reproducible: dice qué balanza o cuestionario validado usar.',
      },
      {
        id: 'dato-variable',
        icono: 'numeros',
        titulo: 'Variable y Dato',
        definicion:
          'La variable es "un hecho que tiende a variar"; el dato es el valor registrado al aplicarle la escala a un sujeto.',
        ejemploAcademico:
          'Variable: tono de piel, medido por el Ángulo de Tipología Individual (ITA). Dato: el ITA de 45° del paciente X.',
        ejemploCotidiano:
          'Variable: tu estado de ánimo. Dato: "hoy, 7/10" según tu propia escala.',
        datoSorpresa:
          'El "tono de piel" pasó de idea abstracta a categoría medible gracias al ITA: así se operacionaliza lo cualitativo.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'drag',
    titulo: 'Del concepto al dato',
    instruccion: 'Arrastra cada término hacia el ejemplo que lo representa.',
    pares: [
      { id: 'p1', termino: 'Criterio de inclusión', match: 'Adultos mayores de 18 años con diagnóstico de hipertensión' },
      { id: 'p2', termino: 'Criterio de exclusión', match: 'Retirar a las gestantes ya incluidas para protegerlas' },
      { id: 'p3', termino: 'Definición conceptual', match: 'Desnutrición entendida como estado de déficit nutricional' },
      { id: 'p4', termino: 'Definición operativa', match: 'Medir IMC con balanza calibrada y puntos de corte fijos' },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Por qué esto importa',
    resumen: 'El diseño muestral y la gestión de datos son la antesala de toda la estadística que viene.',
    tarjetas: [
      {
        id: 'estadistico-parametro',
        icono: 'flechas',
        titulo: 'Estadístico vs. Parámetro',
        definicion:
          'El estadístico es el valor de tu muestra; el parámetro es el valor real (desconocido) de la población.',
        ejemploAcademico:
          'IMC medio de tu muestra = 29.5 (estadístico). El IMC medio real de toda la ciudad = ? (parámetro).',
        ejemploCotidiano:
          'El promedio de goles de los partidos que viste (estadístico) vs. el promedio real de toda la liga (parámetro).',
        datoSorpresa:
          'Nunca conoces el parámetro directamente: la inferencia (Tema 4) es el puente entre tu estadístico y él.',
      },
      {
        id: 'reproducibilidad',
        icono: 'ciclo',
        titulo: 'Reproducibilidad',
        definicion: 'Otro equipo debe poder repetir tu medición y obtener resultados equivalentes.',
        ejemploAcademico:
          'Especificar marca de balanza y cuestionario validado permite que otro hospital replique tu protocolo.',
        ejemploCotidiano:
          'Tu receta funciona igual en otra cocina solo si anotaste gramos y tiempos exactos.',
        datoSorpresa:
          'Una definición operativa vaga rompe la reproducibilidad aunque tu muestra sea enorme.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: diseñando un estudio de hipertensión',
    escenario:
      'Vas a estimar la presión arterial media en adultos de un distrito. Toma decisiones de muestreo y medición para que el estudio sea válido y reproducible.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'Defines la muestra. ¿Cuál es el orden correcto del embudo?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Población objetivo → accesible → muestra objetivo → muestra del estudio',
            correcta: true,
            feedback: 'Correcto: de lo teórico y amplio a lo concreto y medido.',
          },
          {
            id: 'd1b',
            texto: 'Muestra del estudio → población accesible → población objetivo',
            correcta: false,
            feedback: 'Al revés. El embudo va de lo amplio a lo concreto, no de lo concreto hacia arriba.',
          },
          {
            id: 'd1c',
            texto: 'Población accesible → población objetivo → muestra',
            correcta: false,
            feedback: 'No. La población objetivo (teórica) es el punto de partida, no el intermedio.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Incluiste adultos >18 años. ¿Cómo aplicas correctamente un criterio de exclusión?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Retirar a las gestantes que ya cumplían la inclusión, para protegerlas.',
            correcta: true,
            feedback: 'Exacto: la exclusión actúa sobre quienes ya fueron incluidos.',
          },
          {
            id: 'd2b',
            texto: 'Hacer una lista separada de "no invitados" sin relación con la inclusión.',
            correcta: false,
            feedback: 'No. La exclusión no es una lista independiente; se aplica sobre los ya incluidos.',
          },
          {
            id: 'd2c',
            texto: 'Excluir a cualquiera al azar para reducir el tamaño de muestra.',
            correcta: false,
            feedback: 'No. Excluir al azar introduce sesgo y no responde a un criterio metodológico.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Vas a medir la presión. ¿Qué garantiza reproducibilidad?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Una definición operativa: tensiómetro calibrado, brazo y postura estandarizados.',
            correcta: true,
            feedback: 'Correcto: instrumento y procedimiento exactos hacen replicable el estudio.',
          },
          {
            id: 'd3b',
            texto: 'Medir "como salga" con cualquier aparato disponible.',
            correcta: false,
            feedback: 'No. Sin estandarizar el instrumento, otro equipo no podrá repetir tu medición.',
          },
          {
            id: 'd3c',
            texto: 'Aumentar la muestra para compensar una medición imprecisa.',
            correcta: false,
            feedback: 'No. Más muestra no arregla una medición mal definida: quedarías "precisamente equivocado".',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'El diseño se divide en a quiénes seleccionar (muestra) y qué medir (datos).',
      'Los criterios de exclusión se aplican después, sobre los ya incluidos.',
      'Un estudio captura la verdad de una muestra, no la verdad universal.',
      'La definición operativa dicta el instrumento y la escala de medición.',
      'Más muestra reduce la variabilidad y acerca el estimado al parámetro real.',
    ],
  },
};
