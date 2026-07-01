import type { NivelContenido } from '../types';

// ─── TEMA 3: Validez Interna, Sesgos y Factores de Confusión ───
export const TEMA_03: NivelContenido = {
  id: 'tema-03',

  intro: {
    kicker: 'Nivel 3 · Fundamentos',
    titulo: 'Validez, Sesgos y Factores de Confusión',
    gancho:
      'Ningún estudio es un espejo perfecto del universo. Aquí conoces a los dos villanos que distorsionan la verdad: el sesgo (error sistemático) y el confusor (la tercera variable oculta).',
    objetivos: [
      'Diferenciar precisión (agrupado) de validez (dar en el centro).',
      'Entender el sesgo como error sistemático, no azaroso.',
      'Reconocer el factor de confusión y su doble asociación.',
      'Saber por qué nunca conocemos todos los confusores.',
    ],
  },

  bloque1: {
    id: 'b1',
    titulo: 'Validez Interna y Sesgo',
    resumen:
      'Ser preciso no es lo mismo que ser válido. El sesgo empuja tus resultados sistemáticamente hacia lo falso.',
    tarjetas: [
      {
        id: 'precision-validez',
        icono: 'diana',
        titulo: 'Precisión vs. Validez (el tiro al blanco)',
        definicion:
          'Precisión = tus tiros están agrupados; validez = tus tiros dan en el centro (la verdad).',
        ejemploAcademico:
          'Una balanza que siempre marca 5 kg de más es muy precisa (repite el error) pero nada válida.',
        ejemploCotidiano:
          'Un reloj que atrasa exactamente 10 minutos es precisísimo… y siempre te hace llegar tarde.',
        ejemploAbsurdo:
          'El arquero clava las 5 flechas juntitas… en el árbol de al lado. Precisión de campeón, puntería de cero.',
        datoSorpresa:
          'Aumentar la muestra mejora la precisión, pero si hay sesgo solo te vuelve "precisamente equivocado".',
      },
      {
        id: 'sesgo',
        icono: 'iman',
        titulo: 'Sesgo (error sistemático)',
        definicion:
          'Una distorsión sistemática, no azarosa, introducida en cualquier etapa del estudio.',
        ejemploAcademico:
          'Usar "distrito de residencia" como proxy estricto de pobreza introduce un sesgo de medición.',
        ejemploCotidiano:
          'Preguntar "¿te gustó la comida?" mirando fijo al cocinero: todos dirán que sí (sesgo de deseabilidad).',
        ejemploAbsurdo:
          'Encuestar "¿la gente madruga?" solo a las 5 am en el gimnasio. Spoiler: 100% dirá que sí.',
        datoSorpresa:
          'El sesgo NO se cura con más muestra, porque no es azar: es una dirección falsa constante.',
      },
      {
        id: 'complejidad',
        icono: 'niebla',
        titulo: 'Complejidad de medición',
        definicion:
          'Fenómenos como depresión o estatus socioeconómico son difíciles de definir y medir, lo que facilita el sesgo.',
        ejemploAcademico:
          'Medir "depresión" con una sola pregunta subestima el fenómeno; medir pobreza por barrio la simplifica en exceso.',
        ejemploCotidiano:
          'Medir "felicidad" por número de fotos sonriendo en redes: constructo complejo, instrumento pobre.',
        datoSorpresa:
          'Cuanto más abstracto es un constructo (mental o social), más fácil es que se cuele un sesgo de medición.',
      },
    ],
  },

  minijuegoA: {
    tipo: 'vf',
    titulo: '¿Verdadero o falso? (cuidado con la trampa)',
    instruccion: 'Algunas afirmaciones parecen correctas pero tienen un error sutil. Detéctalas.',
    afirmaciones: [
      {
        id: 'a1',
        texto: 'Aumentar el tamaño de la muestra corrige el sesgo de un estudio.',
        esVerdadera: false,
        explicacion:
          'Falso. Más muestra mejora la precisión, no el sesgo. El sesgo es sistemático, no azar.',
      },
      {
        id: 'a2',
        texto: 'Un estudio puede ser muy preciso y aun así estar equivocado (no válido).',
        esVerdadera: true,
        explicacion:
          'Verdadero. Precisión (agrupamiento) y validez (dar en el centro) son cosas distintas.',
      },
      {
        id: 'a3',
        texto: 'El sesgo es un error que ocurre puramente por azar en la medición.',
        esVerdadera: false,
        explicacion:
          'Falso. El sesgo es SISTEMÁTICO y direccional; el azar es lo contrario (error aleatorio).',
      },
      {
        id: 'a4',
        texto: 'Los constructos sociales o mentales son más propensos al sesgo de medición.',
        esVerdadera: true,
        explicacion:
          'Verdadero. Su complejidad de definición y medición facilita distorsiones sistemáticas.',
      },
    ],
  },

  bloque2: {
    id: 'b2',
    titulo: 'El Factor de Confusión',
    resumen:
      'El gran enemigo de los estudios observacionales: una tercera variable que engaña creando o borrando asociaciones.',
    tarjetas: [
      {
        id: 'confusor',
        icono: 'detective',
        titulo: 'El confusor (doble asociación)',
        definicion:
          'Una tercera variable asociada TANTO a la exposición COMO al evento, que no está en la cadena causal.',
        ejemploAcademico:
          'Café ↔ cáncer de pulmón parecen asociados, pero el cigarrillo (confusor) se asocia a ambos.',
        ejemploCotidiano:
          'Ventas de helado ↔ ahogamientos suben juntas… porque el confusor es el calor del verano, no el helado.',
        ejemploAbsurdo:
          '"Usar pijama causa dormir": el confusor es la noche. La pijama es inocente.',
        datoSorpresa:
          'Un confusor puede INVENTAR una asociación falsa o BORRAR una real y beneficiosa.',
      },
      {
        id: 'confusores-desconocidos',
        icono: 'pregunta',
        titulo: 'Los confusores desconocidos',
        definicion:
          'El límite de la medicina observacional: nunca sabemos si medimos todos los confusores.',
        ejemploAcademico:
          'Podemos ajustar estadísticamente los confusores conocidos, pero los desconocidos solo se neutralizan aleatorizando (ECA).',
        ejemploCotidiano:
          'Crees controlar todo lo que afecta tu sueño, pero olvidaste el vecino que taladra a las 6 am.',
        datoSorpresa:
          'Este es el argumento clave a favor del ECA (Tema 8): la aleatorización equilibra hasta lo que ignoramos.',
      },
      {
        id: 'ajuste',
        icono: 'engranaje',
        titulo: 'Ajuste estadístico',
        definicion:
          'Método (multivariado) para neutralizar matemáticamente el efecto de los confusores medidos.',
        ejemploAcademico:
          'Al estudiar café y cáncer, se ajusta por tabaquismo para aislar el efecto real del café.',
        ejemploCotidiano:
          'Comparar sueldos "a igual experiencia y ciudad": ajustas para comparar lo comparable.',
        datoSorpresa:
          'El ajuste solo funciona con confusores que mediste. Lo que no entra a la base de datos, no se ajusta.',
      },
    ],
  },

  minijuegoB: {
    tipo: 'caso',
    titulo: 'El caso del café y el cáncer',
    escenario:
      'Un estudio observacional encuentra que quienes toman más café tienen más cáncer de pulmón. Antes de titular "el café causa cáncer", piensa como investigador.',
    pregunta: '¿Cuál es la explicación metodológica más probable?',
    opciones: [
      {
        id: 'o1',
        texto: 'El tabaquismo es un confusor: los fumadores toman más café y fuman más.',
        correcta: true,
        feedback:
          '¡Correcto! El cigarrillo se asocia tanto al café como al cáncer: distorsiona la asociación aparente.',
      },
      {
        id: 'o2',
        texto: 'El café causa cáncer directamente; el estudio lo demuestra.',
        correcta: false,
        feedback:
          'No. Un estudio observacional con posibles confusores no demuestra causalidad directa.',
      },
      {
        id: 'o3',
        texto: 'Es azar; con más muestra la asociación desaparecería.',
        correcta: false,
        feedback:
          'No necesariamente. Esto no es azar (error aleatorio); es confusión sistemática por el tabaco.',
      },
    ],
  },

  bloqueFinal: {
    id: 'bf',
    titulo: 'La verdad del universo vs. la del estudio',
    resumen: 'La validez interna es el prerrequisito absoluto: sin ella, la inferencia es inútil.',
    tarjetas: [
      {
        id: 'validez-interna',
        icono: 'columnas',
        titulo: 'Validez interna',
        definicion: 'La capacidad del estudio de medir realmente lo que pretendía medir en su muestra.',
        ejemploAcademico:
          'Si mides bien la saturación real y el error del oxímetro sin sesgos, tu estudio tiene validez interna.',
        ejemploCotidiano:
          'Un examen "válido" evalúa lo que enseñaste, no la suerte del alumno adivinando.',
        datoSorpresa:
          'Primero se cuestiona la validez (sesgos); solo después tiene sentido creer en los valores p.',
      },
      {
        id: 'brecha',
        icono: 'puente',
        titulo: 'La brecha universo–estudio',
        definicion: 'La distancia entre la verdad real (inalcanzable) y lo que tu estudio logra capturar.',
        ejemploAcademico:
          'Sesgos y confusores son las "roturas del puente" entre el plan teórico y la ejecución real.',
        ejemploCotidiano:
          'La foto (estudio) nunca es idéntica al paisaje (universo): el lente y la luz meten distorsión.',
        datoSorpresa:
          'Controlar sesgos y confusores en el DISEÑO es la máxima prioridad, más que arreglarlos después.',
      },
    ],
  },

  boss: {
    titulo: 'Caso: cazando distorsiones',
    escenario:
      'Revisas un estudio observacional sobre actividad física y salud cardiovascular. Detecta las amenazas a su validez.',
    decisiones: [
      {
        id: 'd1',
        pregunta: 'El estudio mide "pobreza" solo por el distrito de residencia. ¿Qué problema hay?',
        opciones: [
          {
            id: 'd1a',
            texto: 'Sesgo de medición: un proxy estricto distorsiona sistemáticamente la variable.',
            correcta: true,
            feedback: 'Correcto: es un error sistemático de medición, no azar.',
          },
          {
            id: 'd1b',
            texto: 'Nada: el distrito mide la pobreza perfectamente.',
            correcta: false,
            feedback: 'No. El distrito es un proxy grueso; introduce sesgo de medición.',
          },
          {
            id: 'd1c',
            texto: 'Solo falta aumentar la muestra para corregirlo.',
            correcta: false,
            feedback: 'No. Más muestra no corrige un sesgo sistemático de medición.',
          },
        ],
      },
      {
        id: 'd2',
        pregunta: 'Quienes hacen ejercicio también comen mejor y fuman menos. ¿Qué son esas variables?',
        opciones: [
          {
            id: 'd2a',
            texto: 'Factores de confusión: se asocian a la exposición y al desenlace.',
            correcta: true,
            feedback: 'Exacto: dieta y tabaco confunden la relación ejercicio–corazón.',
          },
          {
            id: 'd2b',
            texto: 'Son parte de la exposición "ejercicio", así que se ignoran.',
            correcta: false,
            feedback: 'No. Son variables externas asociadas a ambos lados: confusores, no la exposición.',
          },
          {
            id: 'd2c',
            texto: 'Son el desenlace del estudio.',
            correcta: false,
            feedback: 'No. El desenlace es la salud cardiovascular; dieta y tabaco son confusores.',
          },
        ],
      },
      {
        id: 'd3',
        pregunta: '¿Cómo neutralizas los confusores que ni siquiera conoces?',
        opciones: [
          {
            id: 'd3a',
            texto: 'Con un ensayo aleatorizado (ECA): la aleatorización equilibra hasta lo desconocido.',
            correcta: true,
            feedback: 'Correcto: solo la aleatorización distribuye los confusores desconocidos.',
          },
          {
            id: 'd3b',
            texto: 'Ajustando estadísticamente todas las variables, incluidas las no medidas.',
            correcta: false,
            feedback: 'No se puede: el ajuste solo funciona con confusores medidos.',
          },
          {
            id: 'd3c',
            texto: 'Ignorándolos, porque si no los conoces no afectan.',
            correcta: false,
            feedback: 'Falso: los confusores desconocidos afectan igual; por eso existe el ECA.',
          },
        ],
      },
    ],
  },

  cierre: {
    titulo: 'Informe del investigador',
    puntosClave: [
      'La validez interna evalúa si la conclusión es real para la muestra estudiada.',
      'El sesgo es sistemático y no se cura aumentando la muestra.',
      'Un confusor se asocia a la vez a la causa estudiada y al desenlace.',
      'La confusión puede crear asociaciones falsas o borrar verdaderas.',
      'En medicina observacional es imposible conocer y medir todos los confusores.',
    ],
  },
};
