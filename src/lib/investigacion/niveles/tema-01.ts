import type { NivelContenido } from '../types';

// ─── TEMA 1: Principios Básicos para la Investigación Médica ───
// Banda Fundamentos. Contenido expandido con 3 registros de ejemplo por concepto
// (académico / cotidiano inesperado / absurdo memorable) + "dato que sorprende".

export const TEMA_01: NivelContenido = {
  id: 'tema-01',

  intro: {
    kicker: 'Nivel 1 · Fundamentos',
    titulo: 'Principios Básicos de la Investigación Médica',
    gancho:
      'Sigue la odisea de un simple número hasta convertirse en una decisión que salva vidas. Antes de calcular nada, la ciencia médica se rige por cuatro principios que separan el conocimiento real de la simple opinión.',
    objetivos: [
      'Entender cómo un dato se transforma en información y luego en conocimiento.',
      'Ubicar las fases de la investigación traslacional (T0 → T4).',
      'Dominar los cuatro principios rectores de la investigación.',
      'Identificar población, exposición y evento desde el título de un artículo.',
    ],
  },

  // ── BLOQUE 1 ──
  bloque1: {
    id: 'b1',
    titulo: 'De los Datos al Conocimiento',
    resumen:
      'La investigación no es espontánea: los números crudos se ordenan hasta volverse decisiones de salud pública.',
    tarjetas: [
      {
        id: 'dato',
        icono: 'numeros',
        titulo: 'Dato',
        definicion: 'El valor crudo y aislado que se registra al medir una variable en un sujeto.',
        ejemploAcademico:
          'La saturación de oxígeno de un paciente marcada por el pulsioxímetro: "96%". Solo, no dice nada.',
        ejemploCotidiano:
          'El número que aparece en la balanza del baño: "72". ¿72 qué? ¿Es bueno? Sin contexto es solo un número.',
        ejemploAbsurdo:
          'Tu primo grita "¡SIETE!" en medio del almuerzo. Técnicamente es un dato. Absolutamente inútil sin saber siete de qué.',
        datoSorpresa:
          'Un dato por sí solo NO es conocimiento. Un hospital puede tener millones de datos y cero conocimiento si nunca los ordena.',
      },
      {
        id: 'informacion',
        icono: 'barras',
        titulo: 'Información',
        definicion: 'Datos organizados y contextualizados que ya permiten comparar y ver patrones.',
        ejemploAcademico:
          'Las saturaciones de 500 pacientes ordenadas por tono de piel: ahora se ve una tendencia.',
        ejemploCotidiano:
          'Tu peso anotado cada semana en una gráfica: ahora ves que subes en invierno y bajas en verano.',
        ejemploAbsurdo:
          'Juntas todos los "¡SIETE!" de tu primo en un Excel y descubres que siempre los grita al ver comida. Ahora es información.',
        datoSorpresa:
          'La información responde "qué está pasando", pero todavía no responde "por qué" ni "qué hacer".',
      },
      {
        id: 'conocimiento',
        icono: 'cerebro',
        titulo: 'Conocimiento',
        definicion: 'La información analizada que permite resolver un problema y tomar decisiones.',
        ejemploAcademico:
          'Concluir que el pulsioxímetro sobreestima la saturación en pieles oscuras, y cambiar la práctica clínica.',
        ejemploCotidiano:
          'Entender que engordas en invierno por comer más y moverte menos → decides caminar aunque haga frío.',
        ejemploAbsurdo:
          'Teoría confirmada: tu primo grita "¡SIETE!" por hambre. Le das de comer y el fenómeno cesa. Ciencia.',
        datoSorpresa:
          'El salto de información a conocimiento es donde nace la ciencia: exige análisis, no solo acumular datos.',
      },
      {
        id: 'traslacional',
        icono: 'microscopio',
        titulo: 'Investigación Traslacional (T0 → T4)',
        definicion:
          'El recorrido del conocimiento desde el laboratorio (T0) hasta la comunidad y las políticas de salud (T4).',
        ejemploAcademico:
          'Una molécula probada en ratones (T0), luego en ensayos fase 1-3 (T1-T3) y finalmente en una norma del Ministerio de Salud (T4).',
        ejemploCotidiano:
          'Una receta de la abuela → la pruebas en casa → funciona → toda la familia la adopta en Navidad.',
        ejemploAbsurdo:
          'Descubres que la música a las 3am espanta zancudos. De tu cuarto (T0) al edificio entero votando una "ordenanza anti-zancudos" (T4).',
        datoSorpresa:
          'El objetivo de la ciencia no es que el hallazgo se quede en el laboratorio, sino que llegue a cambiar la vida de la gente real.',
      },
    ],
  },

  // ── MINIJUEGO A: Ordenar la secuencia ──
  minijuegoA: {
    tipo: 'orden',
    titulo: 'La ruta del conocimiento',
    instruccion: 'Ordena la transformación desde lo crudo hasta la decisión médica.',
    pasos: [
      { id: 's1', texto: 'Dato (valor crudo aislado)' },
      { id: 's2', texto: 'Información (datos ordenados y en contexto)' },
      { id: 's3', texto: 'Conocimiento (análisis que resuelve un problema)' },
      { id: 's4', texto: 'Decisión / cambio en la práctica de salud' },
    ],
    ordenCorrecto: ['s1', 's2', 's3', 's4'],
  },

  // ── BLOQUE 2 ──
  bloque2: {
    id: 'b2',
    titulo: 'Los Cuatro Principios Rectores',
    resumen:
      'La ética y el escepticismo obligan al investigador a cuestionar sus propias ideas y a estandarizar todo lo que hace.',
    tarjetas: [
      {
        id: 'no-danar',
        icono: 'escudo',
        titulo: '1. Primum non nocere (no hacer daño)',
        definicion:
          'Ante todo, no dañar al sujeto ni a la sociedad; por eso todo estudio pasa por un Comité de Ética.',
        ejemploAcademico:
          'Solicitar aprobación del Comité Institucional de Ética antes de recolectar un solo dato.',
        ejemploCotidiano:
          'Antes de darle a probar tu receta nueva a toda la familia, te aseguras de que nadie sea alérgico.',
        ejemploAbsurdo:
          'Quieres estudiar si empujar a la gente a la piscina mejora su ánimo. El comité de ética (tu mamá) dice NO rotundo.',
        datoSorpresa:
          'Un estudio puede ser científicamente brillante y aun así ser rechazado si pone en riesgo a los participantes.',
      },
      {
        id: 'escepticismo',
        icono: 'idea',
        titulo: '2. Sano escepticismo',
        definicion:
          'No asumir nada: verificar, y estar dispuesto a refutar tus propias hipótesis (combatir la reflexividad).',
        ejemploAcademico:
          'Diseñar el estudio para poder demostrar que tu propia idea está equivocada, no solo para confirmarla.',
        ejemploCotidiano:
          'Crees que "la ventana abierta te resfría". En vez de asumirlo, revisas si de verdad te enfermas más con ella abierta.',
        ejemploAbsurdo:
          'Estás convencidísimo de que tu equipo pierde porque no ves el partido. El escéptico ve el partido igual… y pierden. Adiós teoría.',
        datoSorpresa:
          'El mayor sesgo de un investigador es enamorarse de su propia hipótesis. La ciencia premia a quien intenta derribar la suya.',
      },
      {
        id: 'sistemico',
        icono: 'globo',
        titulo: '3. Enfoque sistémico',
        definicion:
          'Ver el bosque y el árbol: la salud es multicausal, ninguna enfermedad tiene una sola causa.',
        ejemploAcademico:
          'El infarto no depende solo del colesterol: también tabaco, genética, estrés, dieta y ejercicio.',
        ejemploCotidiano:
          'Tu planta se muere no solo "por falta de agua": también luz, tierra, maceta y la maceta rota del gato.',
        ejemploAbsurdo:
          'Culpas al café de tu insomnio, ignorando que también juegas videojuegos hasta las 4am. El sistema es más grande que el café.',
        datoSorpresa:
          'Este principio es la semilla del análisis multivariado (Tema 13): las enfermedades son redes de causas, no una sola.',
      },
      {
        id: 'sistematico',
        icono: 'portapapeles',
        titulo: '4. Aproximación sistemática',
        definicion:
          'Estandarizar todo con protocolos prolijos para que el estudio sea reproducible por cualquiera.',
        ejemploAcademico:
          'Especificar la marca exacta de balanza calibrada y el cuestionario validado que se usará.',
        ejemploCotidiano:
          'Tu receta secreta funciona igual cada vez porque anotas gramos exactos, no "un poquito de esto".',
        ejemploAbsurdo:
          'Tu ritual para que la wifi funcione ("girar 3 veces y soplar el router") solo es ciencia si otro puede repetirlo y funciona.',
        datoSorpresa:
          'Si nadie más puede repetir tu estudio y obtener lo mismo, tus resultados no valen: la reproducibilidad es innegociable.',
      },
    ],
  },

  // ── MINIJUEGO B: Drag & connect ──
  minijuegoB: {
    tipo: 'drag',
    titulo: 'Empareja cada principio',
    instruccion: 'Arrastra cada principio rector hacia la situación que lo representa.',
    pares: [
      { id: 'p1', termino: 'Primum non nocere', match: 'Pedir aprobación del Comité de Ética antes de empezar' },
      { id: 'p2', termino: 'Sano escepticismo', match: 'Diseñar el estudio para poder refutar tu propia hipótesis' },
      { id: 'p3', termino: 'Enfoque sistémico', match: 'Asumir que la enfermedad tiene múltiples causas a la vez' },
      { id: 'p4', termino: 'Aproximación sistemática', match: 'Usar un protocolo estandarizado y reproducible' },
    ],
  },

  // ── BLOQUE FINAL ──
  bloqueFinal: {
    id: 'bf',
    titulo: 'Leer un artículo como investigador',
    resumen:
      'El primer paso al leer un estudio es identificar, desde el título, a quién se estudia, qué se compara y qué se mide.',
    tarjetas: [
      {
        id: 'poblacion',
        icono: 'personas',
        titulo: 'Población',
        definicion: 'El grupo de sujetos en quienes ocurre el fenómeno que se investiga.',
        ejemploAcademico:
          'En el estudio de oximetría: niños hospitalizados a quienes se les mide la saturación.',
        ejemploCotidiano:
          'Si estudias "por qué mi cuadra se inunda", tu población son las casas de esa cuadra.',
        datoSorpresa:
          'Definir mal la población invalida todo el estudio: es la primera pregunta antes de leer los resultados.',
      },
      {
        id: 'exposicion',
        icono: 'sol',
        titulo: 'Exposición',
        definicion: 'La característica o factor cuyo efecto se quiere evaluar.',
        ejemploAcademico:
          'En oximetría, la exposición es el tono de piel (medido por el ángulo ITA), no la enfermedad.',
        ejemploCotidiano:
          'En la cuadra que se inunda, la exposición podría ser "tener o no desagüe tapado".',
        datoSorpresa:
          'La exposición no siempre es una enfermedad ni un fármaco: puede ser una característica como el tono de piel.',
      },
      {
        id: 'evento',
        icono: 'diana',
        titulo: 'Evento (desenlace)',
        definicion: 'El resultado o desenlace que se mide para ver si la exposición influye.',
        ejemploAcademico:
          'El evento es el error del pulsioxímetro: cuánto se aleja de la saturación real medida en sangre.',
        ejemploCotidiano:
          'El evento sería "la casa se inundó / no se inundó" tras la lluvia.',
        datoSorpresa:
          'Población + Exposición + Evento suelen estar ya sugeridos en el título de un buen artículo.',
      },
    ],
  },

  // ── BOSS ──
  boss: {
    titulo: 'Caso: el pulsioxímetro y el tono de piel',
    escenario:
      'Un equipo sospecha que los pulsioxímetros sobreestiman la saturación de oxígeno en pacientes de piel oscura, lo que podría retrasar tratamientos. Toma decisiones como investigador principal para que el estudio sea sólido y ético.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'Identifica correctamente los tres elementos desde el planteamiento.',
        opciones: [
          {
            id: 'd1a',
            texto: 'Población: niños hospitalizados · Exposición: tono de piel · Evento: error del pulsioxímetro',
            correcta: true,
            feedback:
              '¡Correcto! La exposición es una característica (tono de piel) y el evento es el error de medición, no la enfermedad.',
          },
          {
            id: 'd1b',
            texto: 'Población: pulsioxímetros · Exposición: hospital · Evento: saturación',
            correcta: false,
            feedback:
              'No. La población son personas, no aparatos; el hospital es el escenario, no la exposición.',
          },
          {
            id: 'd1c',
            texto: 'Población: piel oscura · Exposición: oxígeno · Evento: niños',
            correcta: false,
            feedback:
              'No. Confundes los elementos: el evento debe ser un desenlace medible (el error), no un grupo de personas.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Antes de recolectar datos, ¿cuál es el paso ético obligatorio?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Solicitar la aprobación del Comité de Ética institucional.',
            correcta: true,
            feedback:
              'Exacto. Primum non nocere: ningún dato se recolecta sin aval ético previo.',
          },
          {
            id: 'd2b',
            texto: 'Publicar primero los resultados esperados para ganar tiempo.',
            correcta: false,
            feedback:
              'Jamás. Anunciar resultados antes de tenerlos viola el sano escepticismo y la ética.',
          },
          {
            id: 'd2c',
            texto: 'Elegir solo pacientes que confirmen tu hipótesis.',
            correcta: false,
            feedback:
              'Eso es sesgo de selección y rompe el sano escepticismo: buscarías confirmar, no verificar.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: 'Para que otro equipo pueda repetir tu estudio, ¿qué debes garantizar?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Un protocolo estandarizado: instrumento, escala (ITA) y procedimiento exactos.',
            correcta: true,
            feedback:
              'Correcto. La aproximación sistemática hace tu estudio reproducible y creíble.',
          },
          {
            id: 'd3b',
            texto: 'Medir "a ojo" el tono de piel para ir más rápido.',
            correcta: false,
            feedback:
              'No. Medir sin una escala objetiva introduce sesgo y hace irreproducible el estudio.',
          },
          {
            id: 'd3c',
            texto: 'Cambiar de balanza y de criterios en cada paciente.',
            correcta: false,
            feedback:
              'No. Cambiar los instrumentos sobre la marcha destruye la estandarización.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'La ciencia médica no busca confirmar ideas, sino estar abierta a refutarlas (sano escepticismo).',
      'Los eventos de salud son complejos y multicausales (enfoque sistémico).',
      'La validez de los datos depende de métodos prolijos y estandarizados (aproximación sistemática).',
      'Todo estudio clínico exige aprobación de un Comité de Ética (no hacer daño).',
      'Al leer un artículo, identifica primero población, exposición y evento desde el título.',
    ],
  },
};
