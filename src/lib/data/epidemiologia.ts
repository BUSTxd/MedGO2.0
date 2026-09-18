export type TipoActividad =
  | 'TEORIA'
  | 'PRACTICA'
  | 'TALLER'
  | 'EXAMEN'
  | 'SUSTIT';

export type Unidad =
  | 'MODULO_1'
  | 'MODULO_2'
  | 'MODULO_3'
  | 'EVALUACION';

/** Envase del resumen: PDF en el bucket `resumenes`, o fragmento HTML. */
export type ResumenFormato = 'pdf' | 'html';

export interface ResumenOpcion {
  id: string;
  label: string;
  /** Por opción además de por tarjeta: un picker puede mezclar los dos envases. */
  formato?: ResumenFormato;
}

import type { ExamenRef } from './examen';
export type { ExamenRef };

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código corto: T1–T15 (teoría), P1–P15 (práctica), TA1–TA15 (taller). */
  codigo?: string;
  titulo: string;
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; formato?: ResumenFormato; opciones?: ResumenOpcion[] };
  examen?: ExamenRef;
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** No tiene ni va a tener material propio: muestra la invitación a colaborar. */
  sinMaterial?: boolean;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  /** Aviso de la semana entera (feriado, semana sin clases). */
  aviso?: string;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  MODULO_1:   '#1D5FA6',
  MODULO_2:   '#1A7A4A',
  MODULO_3:   '#5A3AA6',
  EVALUACION: '#444441',
};

export const UNIDAD_LABEL: Record<Unidad, string> = {
  MODULO_1:   'Módulo I · Sistema de salud y primer nivel de atención',
  MODULO_2:   'Módulo II · Cuidado integral e intervenciones sanitarias',
  MODULO_3:   'Módulo III · Epidemiología y diagnóstico comunitario',
  EVALUACION: 'Evaluación',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEORIA:   { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Teoría'     },
  PRACTICA: { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Práctica'   },
  TALLER:   { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Taller'     },
  EXAMEN:   { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'     },
  SUSTIT:   { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Rezagados'  },
};

/** Qué hace el alumno en cada tipo de sesión; se muestra en la ficha. */
export const TIPO_DESC: Record<TipoActividad, string> = {
  TEORIA:   'Clase teórica de 2 horas (07:00–09:00).',
  PRACTICA: 'Práctica de 4 horas (09:00–13:00) en el establecimiento de salud y la comunidad asignada.',
  TALLER:   'Taller de 2 horas por la tarde (15:00–17:00).',
  EXAMEN:   'Examen presencial.',
  SUSTIT:   'Examen para quienes no rindieron alguno de los exámenes en su fecha.',
};

/** Cada sesión se dicta dos veces en la semana, una por grupo. */
const NOTA_TURNOS =
  'Se dicta dos veces en la semana (martes y jueves), según tu grupo. El contenido es el mismo; solo cambia el día.';

/** Contenido literal de la mayoría de talleres del horario. */
const TALLER_CASO = ['Lectura', 'Discusión de caso', 'Ejercicio integrador'];
const TALLER_CASO_TITULO = 'Lectura, discusión de caso y ejercicio integrador';

const H_TEORIA = '07:00 – 09:00';
const H_PRACTICA = '09:00 – 13:00';
const H_TALLER = '15:00 – 17:00';

/** Las tres sesiones de una semana normal: teoría, práctica y taller. */
function semanaDeClases(
  n: number,
  unidad: Unidad,
  fecha: string,
  teoria: { titulo: string; subtemas: string[]; resumen?: Actividad['resumen'] },
  practica: { titulo: string; subtemas: string[] },
  taller: { titulo: string; subtemas: string[] },
): Actividad[] {
  return [
    {
      ...(teoria.resumen && { resumen: teoria.resumen }),
      id: `epi-t-${n}`,
      tipo: 'TEORIA',
      unidad,
      codigo: `T${n}`,
      titulo: `T${n} — ${teoria.titulo}`,
      fecha,
      hora: H_TEORIA,
      subtemas: teoria.subtemas,
      docentes: [],
      nota: NOTA_TURNOS,
    },
    {
      id: `epi-p-${n}`,
      tipo: 'PRACTICA',
      unidad,
      codigo: `P${n}`,
      titulo: `P${n} — ${practica.titulo}`,
      fecha,
      hora: H_PRACTICA,
      subtemas: practica.subtemas,
      docentes: [],
      nota: NOTA_TURNOS,
    },
    {
      id: `epi-ta-${n}`,
      tipo: 'TALLER',
      unidad,
      codigo: `TA${n}`,
      titulo: `TA${n} — ${taller.titulo}`,
      fecha,
      hora: H_TALLER,
      subtemas: taller.subtemas,
      docentes: [],
      nota: NOTA_TURNOS,
    },
  ];
}

const tallerCaso = { titulo: TALLER_CASO_TITULO, subtemas: TALLER_CASO };

function resumenHtml(id: string): Actividad['resumen'] {
  return { tipo: 'pdf', formato: 'html', opciones: [{ id, label: 'Resumen', formato: 'html' }] };
}

export const semanas: Semana[] = [
  // ═══ MÓDULO I — Sistema de salud y primer nivel de atención ═══════════════
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '17 – 23 ago',
    actividades: semanaDeClases(1, 'MODULO_1', '18 y 20 ago',
      {
        titulo: 'Presentación del curso y generalidades de salud comunitaria',
        subtemas: ['Presentación del curso', 'Generalidades de salud comunitaria', 'Video de presentación del curso'],
      },
      { titulo: 'Feria de establecimientos', subtemas: [] },
      {
        titulo: 'Historia de la epidemiología',
        subtemas: ['Historia de la epidemiología', 'Dinámica de aprendizaje interactivo: Hitos de la medicina'],
      },
    ),
  },
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '24 – 30 ago',
    actividades: semanaDeClases(2, 'MODULO_1', '25 y 27 ago',
      {
        titulo: 'Sistema Nacional de Salud y Redes Integradas de Salud',
        subtemas: [
          'Sistema Nacional de Salud',
          'Redes Integradas de Salud',
          'Sistemas de salud en el mundo y comparación con el sistema peruano',
        ],
        resumen: resumenHtml('epi-t-2'),
      },
      {
        titulo: 'Reconocimiento del Centro de Salud',
        subtemas: ['Visita guiada al Centro de Salud', 'Zonas aledañas', 'Comunidad a intervenir'],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '31 ago – 6 set',
    actividades: semanaDeClases(3, 'MODULO_1', '1 y 3 set',
      {
        titulo: 'Niveles de atención de salud',
        subtemas: [
          'Niveles de atención de salud',
          'Primer nivel de atención',
          'Categorías de los establecimientos de salud',
          'Proceso de referencia y contrarreferencia',
        ],
        resumen: resumenHtml('epi-t-3'),
      },
      {
        titulo: 'Ejemplos aplicativos y su relación con el rol de su RIS',
        subtemas: [],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '7 – 13 set',
    actividades: semanaDeClases(4, 'MODULO_1', '8 y 10 set',
      {
        titulo: 'Cartera de servicios de salud y prioridades globales',
        subtemas: [
          'Cartera de servicios de salud',
          'Modalidad de oferta de servicios de salud',
          'Prioridades globales en salud: rol de la OMS',
        ],
        resumen: resumenHtml('epi-t-4'),
      },
      {
        titulo: 'Verificación de la cartera de servicios de salud',
        subtemas: ['Verificación en línea y en físico', 'Comentario PADLET'],
      },
      { titulo: 'Actividad integradora del Módulo I', subtemas: [] },
    ),
  },
  {
    id: 'sem-5',
    titulo: 'Semana 5',
    fechas: '14 – 20 set',
    esEvaluacion: true,
    actividades: [
      {
        id: 'epi-ex-1',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Primer examen — Módulo I',
        fecha: 'Sáb 19 set',
        fechaISO: '2026-09-19',
        hora: '08:00',
        subtemas: ['Módulo I · semanas 1 – 4'],
        docentes: [],
        nota: 'Examen presencial.',
        examen: {
          key: 'epidemiologia/parcial-1-2022',
          groups: ['epidemiologia/parcial-1-susti', 'epidemiologia/parcial-1-kahoot', 'epidemiologia/parcial-1-pasos'],
          // Sólo pinta el candado; quien lo bloquea es la route (sin `free`).
          // Los PASOS no van aquí: son muestra (se piden y el servidor los recorta).
          dePago: ['epidemiologia/parcial-1-susti', 'epidemiologia/parcial-1-kahoot'],
          labels: {
            'epidemiologia/parcial-1-2022': '2022',
            'epidemiologia/parcial-1-susti': 'SUSTI',
            'epidemiologia/parcial-1-kahoot': 'Kahoots',
            'epidemiologia/parcial-1-pasos': 'PASOS',
          },
          hints: {
            'epidemiologia/parcial-1-2022': 'Primer examen 2022-II · 50 preguntas',
            'epidemiologia/parcial-1-susti': 'Sustitutorio I 2022-II · sus 46 preguntas salen también en el 2022',
            'epidemiologia/parcial-1-kahoot': 'Kahoots de clase',
            'epidemiologia/parcial-1-pasos': 'PASOS 1 a 4 del aula virtual, con lámina explicativa',
          },
        },
      },
    ],
  },

  // ═══ MÓDULO II — Cuidado integral e intervenciones sanitarias ═════════════
  {
    id: 'sem-6',
    titulo: 'Semana 6',
    fechas: '21 – 27 set',
    actividades: semanaDeClases(5, 'MODULO_2', '22 y 24 set',
      {
        titulo: 'Cuidado integral por curso de vida: niño, adolescente y joven',
        subtemas: [
          'Modelo de Cuidado Integral de Salud por curso de vida',
          'Niño, adolescente y joven',
          'Preparativos del trabajo con la familia asignada',
        ],
      },
      { titulo: 'Roleplay por curso de vida', subtemas: [] },
      tallerCaso,
    ),
  },
  {
    id: 'sem-7',
    titulo: 'Semana 7',
    fechas: '28 set – 4 oct',
    actividades: semanaDeClases(6, 'MODULO_2', '29 set y 1 oct',
      {
        titulo: 'Cuidado integral por curso de vida: adulto, adulto mayor y gestante',
        subtemas: [
          'Modelo de Cuidado Integral de Salud por curso de vida',
          'Adulto, adulto mayor y gestante',
        ],
      },
      { titulo: 'Roleplay por curso de vida', subtemas: [] },
      tallerCaso,
    ),
  },
  {
    id: 'sem-8',
    titulo: 'Semana 8',
    fechas: '5 – 11 oct',
    aviso: 'Jueves 8 de octubre sin clases: Combate de Angamos.',
    actividades: [],
  },
  {
    id: 'sem-9',
    titulo: 'Semana 9',
    fechas: '12 – 18 oct',
    actividades: semanaDeClases(7, 'MODULO_2', '13 y 15 oct',
      {
        titulo: 'Cuidado integral de la salud: familia y comunidad',
        subtemas: ['Modelo de Cuidado Integral de la Salud, familia y comunidad', 'PAIFAM'],
      },
      { titulo: 'Trabajo con familias priorizadas', subtemas: ['Continuar con el trabajo de familias priorizadas'] },
      tallerCaso,
    ),
  },
  {
    id: 'sem-10',
    titulo: 'Semana 10',
    fechas: '19 – 25 oct',
    actividades: semanaDeClases(8, 'MODULO_2', '20 y 22 oct',
      {
        titulo: 'Intervenciones I: estrategias sanitarias',
        subtemas: ['Generalidades', 'Nutrición-anemia', 'Inmunizaciones', 'Salud ocular'],
      },
      { titulo: 'Verificación de las estrategias', subtemas: [] },
      { titulo: 'Simulación de intervención', subtemas: [] },
    ),
  },
  {
    id: 'sem-11',
    titulo: 'Semana 11',
    fechas: '26 oct – 1 nov',
    esEvaluacion: true,
    actividades: [
      ...semanaDeClases(9, 'MODULO_2', '27 y 29 oct',
        {
          titulo: 'Intervenciones II: estrategias sanitarias',
          subtemas: ['Daños no transmisibles', 'Tuberculosis', 'Metaxénicas', 'Salud sexual y reproductiva'],
        },
        { titulo: 'Verificación de las estrategias', subtemas: [] },
        { titulo: 'Actividad integradora del Módulo II', subtemas: [] },
      ),
      {
        id: 'epi-ex-2',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Segundo examen — Módulo II',
        fecha: 'Sáb 31 oct',
        fechaISO: '2026-10-31',
        hora: '11:00 – 13:00',
        subtemas: ['Módulo II · semanas 6 – 11'],
        docentes: [],
        nota: 'Examen presencial.',
      },
    ],
  },

  // ═══ MÓDULO III — Epidemiología y diagnóstico comunitario ═════════════════
  {
    id: 'sem-12',
    titulo: 'Semana 12',
    fechas: '2 – 8 nov',
    actividades: semanaDeClases(10, 'MODULO_3', '3 y 5 nov',
      {
        titulo: 'Proceso salud-enfermedad e historia natural de la enfermedad',
        subtemas: ['Proceso de salud-enfermedad', 'Multicausalidad', 'Historia natural de la enfermedad'],
      },
      {
        titulo: 'Construcción de la historia natural de diferentes enfermedades',
        subtemas: ['Construcción de la historia natural de diferentes enfermedades', 'Discusión de enfermedades a considerar'],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-13',
    titulo: 'Semana 13',
    fechas: '9 – 15 nov',
    actividades: semanaDeClases(11, 'MODULO_3', '10 y 12 nov',
      {
        titulo: 'Vigilancia epidemiológica en el Perú',
        subtemas: ['Objetivos', 'Modalidades', 'Herramientas e instrumentos', 'Canal endémico'],
      },
      {
        titulo: 'Fichas epidemiológicas y registros del Centro de Salud',
        subtemas: ['Revisión y análisis de fichas epidemiológicas y registros del Centro de Salud'],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-14',
    titulo: 'Semana 14',
    fechas: '16 – 22 nov',
    actividades: semanaDeClases(12, 'MODULO_3', '17 y 19 nov',
      {
        titulo: 'Prevención y control de infecciones asociadas a la atención de salud',
        subtemas: ['Infecciones asociadas a la atención de salud en el primer nivel de atención'],
      },
      {
        titulo: 'Verificación con checklist de bioseguridad',
        subtemas: ['Verificación en los establecimientos con checklist de bioseguridad vigente del MINSA'],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-15',
    titulo: 'Semana 15',
    fechas: '23 – 29 nov',
    actividades: semanaDeClases(13, 'MODULO_3', '24 y 26 nov',
      {
        titulo: 'Diagnóstico de la comunidad',
        subtemas: [
          'Búsqueda de población en riesgo epidemiológico',
          'Trabajo sectorizado',
          'Plano de la comunidad',
          'Actores sociales',
        ],
      },
      {
        titulo: 'Diagnóstico de la comunidad: ficha familiar y sala situacional',
        subtemas: ['Ficha familiar', 'Análisis de la sala situacional de su jurisdicción'],
      },
      tallerCaso,
    ),
  },
  {
    id: 'sem-16',
    titulo: 'Semana 16',
    fechas: '30 nov – 6 dic',
    esEvaluacion: true,
    actividades: [
      ...semanaDeClases(14, 'MODULO_3', '1 y 3 dic',
        { titulo: 'Análisis de la situación de salud (ASIS)', subtemas: [] },
        {
          titulo: 'Feria de establecimientos',
          subtemas: ['Presentación de experiencias en el Centro de Salud'],
        },
        {
          titulo: 'Actividad integradora del Módulo III',
          subtemas: ['Actividad integradora del Módulo III', 'Encuesta del curso'],
        },
      ),
      {
        id: 'epi-ex-3',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Tercer examen — Módulo III',
        fecha: 'Sáb 5 dic',
        fechaISO: '2026-12-05',
        hora: '11:00 – 13:00',
        subtemas: ['Módulo III · semanas 12 – 16'],
        docentes: [],
        nota: 'Examen presencial.',
      },
    ],
  },
  {
    id: 'sem-17',
    titulo: 'Semana 17 · Cierre',
    fechas: '7 – 13 dic',
    esEvaluacion: true,
    actividades: [
      {
        id: 'epi-rezagados',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen de rezagados',
        fecha: 'Sáb 12 dic',
        fechaISO: '2026-12-12',
        hora: '08:00 – 11:00',
        subtemas: [],
        docentes: [],
      },
    ],
  },
];

export const curso = {
  nombre: 'Epidemiología Básica y Salud Comunitaria',
  carrera: 'Medicina · UPCH',
  ciclo: '2026-II',
  duracion: '18 ago – 12 dic 2026',
  unidades: '3 módulos · 17 semanas',
};

/** Los exámenes del curso, para la tarjeta de evaluación del índice. */
export const EXAMENES = semanas
  .flatMap((s) => s.actividades)
  .filter((a) => a.unidad === 'EVALUACION');

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
