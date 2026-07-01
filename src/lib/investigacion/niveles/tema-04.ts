import type { NivelContenido } from '../types';

// ─── TEMA 4: Inferencia Estadística: Estimación y Prueba de Hipótesis ───
// Nivel de los errores Tipo I y II → insignia "Estadístico" si se completa sin fallar.
export const TEMA_04: NivelContenido = {
  id: 'tema-04',

  intro: {
    kicker: 'Nivel 4 · Fundamentos',
    titulo: 'Inferencia Estadística y Prueba de Hipótesis',
    gancho:
      'Como no podemos medir a toda la población, "saltamos" desde nuestra muestra hacia la verdad universal. En ese salto siempre arriesgamos dos errores: gritar "¡fuego!" sin incendio, o no ver la enfermedad que sí está.',
    objetivos: [
      'Distinguir estadístico (muestra) de parámetro (población).',
      'Entender la hipótesis nula y por qué solo se rechaza o no.',
      'Dominar el Error Tipo I (falso positivo) y Tipo II (falso negativo).',
      'Comprender el poder del estudio (1 − β).',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Inferencia: Estadísticos y Parámetros',
    resumen:
      'La inferencia es la generalización probabilística que conecta lo que medimos con la verdad que no vemos.',
    tarjetas: [
      {
        id: 'estadistico',
        icono: 'microscopio',
        titulo: 'Estadístico',
        definicion: 'El valor medido en TU muestra: conocido, pero solo de tu pedacito de realidad.',
        ejemploAcademico:
          'La media de colesterol de 200 mg/dL de los pacientes de tu hospital es un estadístico.',
        ejemploCotidiano:
          'El promedio de propinas de las 20 mesas que atendiste hoy.',
        datoSorpresa:
          'El estadístico cambia con cada muestra; nunca es "la verdad", solo tu mejor foto de ella.',
      },
      {
        id: 'parametro',
        icono: 'globo',
        titulo: 'Parámetro',
        definicion: 'El valor REAL de toda la población: fijo, verdadero… y desconocido.',
        ejemploAcademico:
          'La media de colesterol real de toda la ciudad es el parámetro que quieres estimar.',
        ejemploCotidiano:
          'La propina promedio real de TODOS los clientes del restaurante en su historia.',
        ejemploAbsurdo:
          'El número exacto de granos de arena en la playa: existe, es fijo… suerte contándolos.',
        datoSorpresa:
          'Casi nunca conocemos el parámetro. La inferencia usa el estadístico para estimarlo con incertidumbre.',
      },
      {
        id: 'inferencia',
        icono: 'calculo',
        titulo: 'Inferencia',
        definicion: 'La generalización probabilística que va de la muestra hacia su población de origen.',
        ejemploAcademico:
          'Estimar el IMC poblacional (?) a partir del IMC medio muestral (29.51) con un margen de error.',
        ejemploCotidiano:
          'Probar una cucharada de sopa (muestra) para inferir si TODA la olla está bien de sal (población).',
        datoSorpresa:
          'Toda la estadística inferencial existe porque trabajamos con muestras, no con poblaciones completas.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'drag',
    titulo: 'Muestra o población',
    instruccion: 'Arrastra cada concepto hacia su descripción correcta.',
    pares: [
      { id: 'p1', termino: 'Estadístico', match: 'La media de colesterol medida en tu muestra de 200 pacientes' },
      { id: 'p2', termino: 'Parámetro', match: 'El valor real y desconocido de toda la población' },
      { id: 'p3', termino: 'Inferencia', match: 'Generalizar de la muestra hacia la población con probabilidad' },
      { id: 'p4', termino: 'Hipótesis nula', match: 'Suponer que no hay diferencia o asociación, para ponerla a prueba' },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'Prueba de Hipótesis y los dos Errores',
    resumen:
      'Al decidir "rechazar" o "no rechazar" la hipótesis nula, siempre corremos el riesgo de equivocarnos de dos formas.',
    tarjetas: [
      {
        id: 'hipotesis-nula',
        icono: 'balanza',
        titulo: 'Hipótesis nula (H₀)',
        definicion: 'El enunciado de "no hay diferencia / no hay asociación" que se asume para ponerlo a prueba.',
        ejemploAcademico:
          'H₀: "el fármaco no reduce la mortalidad". El estudio intenta rechazarla, no probarla.',
        ejemploCotidiano:
          'Asumes "el acusado es inocente" (H₀) hasta que la evidencia obligue a rechazarlo.',
        datoSorpresa:
          'Nunca "aceptas" H₀: solo la rechazas o no la rechazas. No probar diferencia no prueba igualdad.',
      },
      {
        id: 'error-i',
        icono: 'alarma',
        titulo: 'Error Tipo I (α) — la alarma que miente',
        definicion: 'Rechazar H₀ cuando en realidad era verdadera: un FALSO POSITIVO.',
        ejemploAcademico:
          'Concluir que un fármaco funciona cuando en verdad no hace nada.',
        ejemploCotidiano:
          'La alarma de incendios suena por el humo de tu tostada: evacúas el edificio sin fuego real.',
        ejemploAbsurdo:
          'Juras que viste un fantasma y era el gato con una sábana. Rechazaste "no hay fantasma"… falso positivo.',
        datoSorpresa:
          'El umbral α (usualmente 0.05) es la probabilidad que aceptas de cometer este falso positivo.',
      },
      {
        id: 'error-ii',
        icono: 'oculto',
        titulo: 'Error Tipo II (β) — no ver lo que está ahí',
        definicion: 'No rechazar H₀ cuando era falsa: un FALSO NEGATIVO.',
        ejemploAcademico:
          'El paciente sí tiene la enfermedad, pero el estudio (con muestra pequeña) no la detecta y lo manda a casa.',
        ejemploCotidiano:
          'El detector de metales no suena aunque llevas las llaves: "no hay nada"… y sí había.',
        ejemploAbsurdo:
          'No rechazas "mi equipo no juega hoy" y resulta que sí jugaba: te perdiste el partido por un falso negativo.',
        datoSorpresa:
          'El Error Tipo II es frecuente cuando la muestra es muy pequeña: el estudio no tiene "poder".',
      },
      {
        id: 'poder',
        icono: 'fuerza',
        titulo: 'Poder del estudio (1 − β)',
        definicion: 'La capacidad de detectar una diferencia real cuando efectivamente existe.',
        ejemploAcademico:
          'Un estudio sin diferencias (p>0.05) pero con muestra minúscula quizá careció de poder (Error Tipo II).',
        ejemploCotidiano:
          'Unos audífonos buenos (alto poder) te dejan oír la canción entre el ruido; unos malos, no.',
        datoSorpresa:
          'Subir mucho la exigencia para evitar el Error Tipo I puede aumentar el Tipo II: es un tira y afloja.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'vf',
    titulo: 'Errores Tipo I y II (sin caer en la trampa)',
    instruccion: 'Marca cada afirmación. Algunas confunden ambos errores a propósito.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'El Error Tipo I es rechazar H₀ cuando era verdadera (falso positivo).',
        esVerdadera: true,
        explicacion: 'Verdadero. Es "descubrir" algo que no existe: la alarma que miente.',
      },
      {
        id: 'a2',
        texto: 'El Error Tipo II ocurre al declarar un hallazgo positivo que en realidad es falso.',
        esVerdadera: false,
        explicacion:
          'Falso. Eso es el Error Tipo I. El Tipo II es un falso NEGATIVO: no ver lo que sí está.',
      },
      {
        id: 'a3',
        texto: 'Una muestra muy pequeña aumenta el riesgo de Error Tipo II.',
        esVerdadera: true,
        explicacion: 'Verdadero. Sin muestra suficiente, el estudio pierde poder y no detecta lo real.',
      },
      {
        id: 'a4',
        texto: 'El poder del estudio es la probabilidad de cometer un Error Tipo I.',
        esVerdadera: false,
        explicacion:
          'Falso. El poder es 1 − β: la capacidad de detectar una diferencia real. El Tipo I es α.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'Aplicando la inferencia',
    resumen: 'Leer un resultado "no significativo" exige preguntar por el poder antes de concluir nada.',
    tarjetas: [
      {
        id: 'p-valor',
        icono: 'bajada',
        titulo: 'El valor p, con cabeza',
        definicion: 'Mide qué tan compatible es tu dato con H₀; no mide la importancia clínica.',
        ejemploAcademico:
          'p>0.05 con muestra pequeña puede significar falta de poder (Tipo II), no ausencia de efecto.',
        ejemploCotidiano:
          '"No encontré mis llaves" no prueba que no estén en casa: quizá no buscaste lo suficiente.',
        datoSorpresa:
          'El umbral 0.05 es una convención arbitraria; por eso se prefieren los intervalos de confianza (Tema 5).',
      },
      {
        id: 'tradeoff',
        icono: 'control',
        titulo: 'El tira y afloja I ↔ II',
        definicion: 'Reducir mucho un error tiende a aumentar el otro; hay que balancear.',
        ejemploAcademico:
          'Bajar α para evitar falsos positivos vuelve el estudio tan exigente que se le escapan efectos reales.',
        ejemploCotidiano:
          'Alarma muy sensible = muchas falsas; muy insensible = no avisa cuando sí hay fuego.',
        datoSorpresa:
          'No existe un estudio sin riesgo de error: se decide de antemano cuánto de cada uno se tolera.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: interpretando un ensayo',
    escenario:
      'Un ensayo compara dos tratamientos para la mortalidad. Toma decisiones de interpretación como el estadístico del equipo.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'El estudio concluye "el fármaco funciona", pero en verdad no hace nada. ¿Qué error se cometió?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Error Tipo I (falso positivo): se rechazó H₀ siendo verdadera.',
            correcta: true,
            feedback: 'Correcto: es la alarma que miente, un falso positivo.',
          },
          {
            id: 'd1b',
            texto: 'Error Tipo II (falso negativo).',
            correcta: false,
            feedback: 'No. El Tipo II es NO ver un efecto real; aquí se "vio" un efecto inexistente.',
          },
          {
            id: 'd1c',
            texto: 'Ningún error: si el estudio lo dice, es cierto.',
            correcta: false,
            feedback: 'No. Declarar un efecto inexistente es precisamente un Error Tipo I.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Otro estudio no halla diferencias (p>0.05) pero tenía solo 12 pacientes. ¿Qué sospechas?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Falta de poder → posible Error Tipo II: no detectó un efecto que quizá sí existe.',
            correcta: true,
            feedback: 'Exacto: muestra minúscula = bajo poder = falso negativo probable.',
          },
          {
            id: 'd2b',
            texto: 'Está demostrado que los tratamientos son idénticos.',
            correcta: false,
            feedback: 'No. "No rechazar H₀" no prueba igualdad; puede ser falta de poder.',
          },
          {
            id: 'd2c',
            texto: 'Cometió un Error Tipo I por tener pocos pacientes.',
            correcta: false,
            feedback: 'No. Pocas muestras se asocian al Tipo II (no detectar), no al Tipo I.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Para reducir el Error Tipo II sin inflar el Tipo I, ¿qué es lo más razonable?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Aumentar el tamaño de muestra para ganar poder estadístico.',
            correcta: true,
            feedback: 'Correcto: más muestra sube el poder (1 − β) sin relajar α.',
          },
          {
            id: 'd3b',
            texto: 'Subir el umbral α a 0.20 para "encontrar algo".',
            correcta: false,
            feedback: 'No. Eso dispara los falsos positivos (Error Tipo I).',
          },
          {
            id: 'd3c',
            texto: 'Repetir el análisis hasta que salga significativo.',
            correcta: false,
            feedback: 'No. Eso es "pescar" significancia y multiplica el Error Tipo I.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'Un estadístico pertenece a la muestra; un parámetro, a la población total.',
      'La inferencia salva la brecha de incertidumbre entre muestra y población.',
      'El Error Tipo I es un falso positivo de asociación.',
      'El Error Tipo II es un falso negativo, frecuente con muestras pequeñas.',
      'El poder del estudio es la capacidad de hallar una asociación que sí existe.',
    ],
  },
};
