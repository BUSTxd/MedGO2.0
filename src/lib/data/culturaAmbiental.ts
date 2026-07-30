export type TipoActividad =
  | 'TEMA'
  | 'CAMPO'
  | 'ASESORIA'
  | 'ENTREGABLE';

export type Unidad =
  | 'AMBIENTAL'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  codigo?: string;
  titulo: string;
  /** El curso es autoinstructivo: no hay calendario de sesiones semanales. */
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** Sobreescribe el destino del card en el sílabo. */
  linkOverride?: string;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  AMBIENTAL:  '#14B8A6',
  EVALUACION: '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEMA:       { bg: 'rgba(20,184,166,0.15)',   color: '#14B8A6', label: 'Tema'       },
  CAMPO:      { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Campo'      },
  ASESORIA:   { bg: 'rgba(148,163,184,0.16)',  color: '#94A3B8', label: 'Asesoría'   },
  ENTREGABLE: { bg: 'rgba(201,162,39,0.15)',   color: '#C9A227', label: 'Entregable' },
};

/**
 * A diferencia del resto de cursos, éste no se organiza en clases semanales:
 * es una unidad única autoinstructiva (Blackboard) con entregables como eje
 * de evaluación, más una sesión presencial de campo y asesorías por Zoom.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — EDUCACIÓN Y RESPONSABILIDAD AMBIENTAL UNIVERSITARIA ────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — Educación y responsabilidad ambiental universitaria',
    fechas: '8 temas autoinstructivos',
    actividades: [
      {
        id: 'amb-tema-1',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Contaminación ambiental global y local',
        fecha: 'Tema 1 de 8',
        hora: '—',
        subtemas: [
          'Cambio climático y calentamiento global',
          'Contaminación del aire, agua y suelo',
          'Situación ambiental del Perú',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-2',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Objetivos de Desarrollo Sostenible (ODS) y Agenda 2030',
        fecha: 'Tema 2 de 8',
        hora: '—',
        subtemas: [
          'Los 17 ODS',
          'Agenda 2030 de Naciones Unidas',
          'Indicadores y metas',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-3',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Estrategias sociales para el desarrollo sostenible',
        fecha: 'Tema 3 de 8',
        hora: '—',
        subtemas: [
          'Proyectos ambientales comunitarios',
          'Participación ciudadana',
          'Educación ambiental',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-4',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Normativa y gestión ambiental en el Perú',
        fecha: 'Tema 4 de 8',
        hora: '—',
        subtemas: [
          'Política Nacional del Ambiente al 2030',
          'Plan Nacional de Educación Ambiental',
          'Institucionalidad ambiental (MINAM, OEFA)',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-5',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Marco legal de residuos sólidos y RAEE',
        fecha: 'Tema 5 de 8',
        hora: '—',
        subtemas: [
          'Clasificación de residuos sólidos',
          'Residuos de aparatos eléctricos y electrónicos (RAEE)',
          'Segregación en la fuente y reciclaje',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-6',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Política Ambiental Herediana',
        fecha: 'Tema 6 de 8',
        hora: '—',
        subtemas: [
          'Lineamientos de Política Ambiental Institucional UPCH',
          'Manejo de impactos ambientales en la universidad',
          'Gestión de residuos en la UPCH',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-7',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Conservación de recursos naturales y mitigación de impactos',
        fecha: 'Tema 7 de 8',
        hora: '—',
        subtemas: [
          'Estrategias de control ambiental',
          'Conservación de recursos naturales',
          'Medidas de mitigación',
        ],
        docentes: [],
      },
      {
        id: 'amb-tema-8',
        tipo: 'TEMA',
        unidad: 'AMBIENTAL',
        titulo: 'Gestión de proyectos ambientales',
        fecha: 'Tema 8 de 8',
        hora: '—',
        subtemas: [
          'Definición y planificación del proyecto',
          'Ejecución y supervisión',
          'Pilares económico, social y ambiental',
        ],
        docentes: [],
      },
    ],
  },

  // ─── ACTIVIDADES PRESENCIALES Y ACOMPAÑAMIENTO ─────────────────────────────
  {
    id: 'presencial',
    titulo: 'Actividades presenciales y acompañamiento',
    fechas: '1 sesión de campo obligatoria · asesorías semanales',
    actividades: [
      {
        id: 'amb-trabajo-campo',
        tipo: 'CAMPO',
        unidad: 'AMBIENTAL',
        titulo: 'Trabajo de campo (sesión presencial obligatoria)',
        fecha: 'Según grupo y horario asignado',
        hora: '—',
        subtemas: [
          'Sembrado de árboles',
          'Recolección y limpieza de residuos',
        ],
        docentes: [],
        nota: 'Única actividad presencial del curso. Es obligatoria.',
      },
      {
        id: 'amb-asesorias',
        tipo: 'ASESORIA',
        unidad: 'AMBIENTAL',
        titulo: 'Asesorías sincrónicas por Zoom',
        fecha: 'Semanal · según horario del grupo',
        hora: '—',
        subtemas: [
          'Consultas sobre los temas autoinstructivos',
          'Acompañamiento del proyecto',
        ],
        docentes: ['Mg. César Del Castillo López'],
      },
    ],
  },

  // ─── ENTREGABLES DEL PROYECTO ──────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Entregables del proyecto',
    fechas: 'Eje de evaluación del curso',
    esEvaluacion: true,
    actividades: [
      {
        id: 'amb-video-ods',
        tipo: 'ENTREGABLE',
        unidad: 'EVALUACION',
        titulo: 'Video de los ODS',
        fecha: 'Entregable 1',
        hora: '—',
        subtemas: [
          'Selección de un ODS',
          'Producción audiovisual',
        ],
        docentes: [],
        nota: 'Vale 15% de la nota final.',
      },
      {
        id: 'amb-mapa-conceptual',
        tipo: 'ENTREGABLE',
        unidad: 'EVALUACION',
        titulo: 'Mapa conceptual de la Política Ambiental UPCH',
        fecha: 'Entregable 2',
        hora: '—',
        subtemas: [
          'Lineamientos institucionales',
          'Organización jerárquica de conceptos',
        ],
        docentes: [],
        nota: 'Vale 15% de la nota final.',
      },
      {
        id: 'amb-informe-final',
        tipo: 'ENTREGABLE',
        unidad: 'EVALUACION',
        titulo: 'Informe final del proyecto',
        fecha: 'Entregable 3',
        hora: '—',
        subtemas: [
          'Planificación, ejecución y resultados',
          'Pilares económico, social y ambiental',
        ],
        docentes: [],
        nota: 'Vale 25% de la nota final.',
      },
      {
        id: 'amb-video-proyecto',
        tipo: 'ENTREGABLE',
        unidad: 'EVALUACION',
        titulo: 'Video del proyecto',
        fecha: 'Entregable 4',
        hora: '—',
        subtemas: [
          'Sustentación audiovisual del proyecto',
          'Resultados e impacto',
        ],
        docentes: [],
        nota: 'Vale 15% de la nota final. La tabla de pesos del sílabo está incompleta: confirmar los porcentajes exactos con el coordinador.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Cultura Ambiental y Desarrollo Sostenible',
  codigo: 'U0683',
  carrera: 'Medicina y otras carreras · UPCH',
  duracion: '19 ago – 14 dic 2024',
  creditos: '01 crédito · 32h de práctica',
  coordinadora: 'Mg. César Del Castillo López',
  aprobacion: 'Nota mínima 11.00',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
