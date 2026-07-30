export type TipoActividad =
  | 'TALLER'
  | 'PRODUCTO'
  | 'PC'
  | 'EXAMEN-T';

export type Unidad =
  | 'ORAL'
  | 'LECTORA'
  | 'ESCRITA'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código interno del sílabo cuando existe (PC de normativa / lectura). */
  codigo?: string;
  titulo: string;
  /** El curso es 100% práctico y no fija fechas por taller. */
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
  ORAL:       '#F5A623',
  LECTORA:    '#5E9CD3',
  ESCRITA:    '#9B8EF8',
  EVALUACION: '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TALLER:     { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'Taller'         },
  PRODUCTO:   { bg: 'rgba(201,162,39,0.15)',  color: '#C9A227', label: 'Producto'       },
  PC:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Práctica calif.'},
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'         },
};

/**
 * Curso 100% práctico (0h de teoría / 96h de práctica). El sílabo describe
 * talleres y productos por unidad sin numerarlos, así que aquí se ordenan
 * siguiendo los contenidos declarados de cada unidad.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — LA COMUNICACIÓN ORAL ───────────────────────────────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — La comunicación oral',
    fechas: '10% de la nota · 3 talleres · 2 productos grupales',
    actividades: [
      {
        id: 'com-oral-1',
        tipo: 'TALLER',
        unidad: 'ORAL',
        titulo: 'Taller — Comunicación no verbal',
        fecha: 'Taller 1 de 3 · Unidad 1',
        hora: '—',
        subtemas: [
          'Movimientos gestuales y corporales',
          'Desplazamiento en escena',
          'Contacto visual con el público',
        ],
        docentes: [],
      },
      {
        id: 'com-oral-2',
        tipo: 'TALLER',
        unidad: 'ORAL',
        titulo: 'Taller — Comunicación verbal',
        fecha: 'Taller 2 de 3 · Unidad 1',
        hora: '—',
        subtemas: [
          'Vocalización y dicción',
          'Entonación y ritmo',
          'Expresión coherente de ideas',
        ],
        docentes: [],
      },
      {
        id: 'com-oral-3',
        tipo: 'TALLER',
        unidad: 'ORAL',
        titulo: 'Taller — Exposición espontánea, eficaz y segura',
        fecha: 'Taller 3 de 3 · Unidad 1',
        hora: '—',
        subtemas: [
          'Estrategias para hablar en público',
          'Manejo de la ansiedad expositiva',
          'Tolerancia y respeto hacia el público receptor',
        ],
        docentes: [],
      },
      {
        id: 'com-entrevista-argumentativo',
        tipo: 'PRODUCTO',
        unidad: 'ORAL',
        titulo: 'Entrevista y cuestionario sobre fuentes — texto argumentativo',
        fecha: 'Producto grupal',
        hora: '—',
        subtemas: [
          'Diseño del cuestionario',
          'Entrevista a fuentes especializadas',
          'Registro y selección de información',
        ],
        docentes: [],
        nota: 'Vale 5% de la nota final. Cámara encendida obligatoria en la evaluación.',
      },
      {
        id: 'com-entrevista-revision',
        tipo: 'PRODUCTO',
        unidad: 'ORAL',
        titulo: 'Entrevista y cuestionario sobre fuentes — revisión literaria',
        fecha: 'Producto grupal',
        hora: '—',
        subtemas: [
          'Búsqueda de fuentes científicas',
          'Entrevista a especialistas',
          'Organización del material recogido',
        ],
        docentes: [],
        nota: 'Vale 5% de la nota final. Cámara encendida obligatoria en la evaluación.',
      },
    ],
  },

  // ─── UNIDAD 2 — LA COMPRENSIÓN LECTORA ─────────────────────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — La comprensión lectora',
    fechas: '34% de la nota · 3 talleres · 2 prácticas calificadas',
    actividades: [
      {
        id: 'com-lectora-1',
        tipo: 'TALLER',
        unidad: 'LECTORA',
        titulo: 'Taller — Estructura textual',
        fecha: 'Taller 1 de 3 · Unidad 2',
        hora: '—',
        subtemas: [
          'Ideas principales y secundarias',
          'Tema y título del texto',
          'Jerarquía de la información',
        ],
        docentes: [],
      },
      {
        id: 'com-lectora-2',
        tipo: 'TALLER',
        unidad: 'LECTORA',
        titulo: 'Taller — Estrategias de lectura y organización de la información',
        fecha: 'Taller 2 de 3 · Unidad 2',
        hora: '—',
        subtemas: [
          'Subrayado y sumillado',
          'Organizadores gráficos',
          'Resumen y paráfrasis',
        ],
        docentes: [],
      },
      {
        id: 'com-lectora-3',
        tipo: 'TALLER',
        unidad: 'LECTORA',
        titulo: 'Taller — Niveles de análisis de lectura',
        fecha: 'Taller 3 de 3 · Unidad 2',
        hora: '—',
        subtemas: [
          'Nivel inferencial',
          'Nivel crítico',
          'Nivel analógico-valorativo',
        ],
        docentes: [],
      },
      {
        id: 'com-pc-lectora-2',
        tipo: 'PC',
        unidad: 'LECTORA',
        titulo: 'Práctica calificada de comprensión lectora 2',
        fecha: 'Individual',
        hora: '—',
        subtemas: ['Niveles literal, inferencial y crítico'],
        docentes: [],
        nota: 'Vale 7% de la nota final. Sólo hay 1 rezagado por PC (no hay sustitutorio de PC).',
      },
      {
        id: 'com-pc-lectora-3',
        tipo: 'PC',
        unidad: 'LECTORA',
        titulo: 'Práctica calificada de comprensión lectora 3',
        fecha: 'Individual',
        hora: '—',
        subtemas: ['Análisis crítico y analógico-valorativo'],
        docentes: [],
        nota: 'Vale 7% de la nota final.',
      },
    ],
  },

  // ─── UNIDAD 3 — LA COMUNICACIÓN ESCRITA ────────────────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — La comunicación escrita',
    fechas: '56% de la nota · 5 talleres · 1 PC · 3 productos',
    actividades: [
      {
        id: 'com-escrita-1',
        tipo: 'TALLER',
        unidad: 'ESCRITA',
        titulo: 'Taller — Normativa: comas, gerundio y conectores',
        fecha: 'Taller 1 de 5 · Unidad 3',
        hora: '—',
        subtemas: [
          'Uso de comas',
          'Uso correcto del gerundio',
          'Conectores lógicos',
          'Pragmática académica',
        ],
        docentes: [],
      },
      {
        id: 'com-escrita-2',
        tipo: 'TALLER',
        unidad: 'ESCRITA',
        titulo: 'Taller de ortografía',
        fecha: 'Taller 2 de 5 · Unidad 3',
        hora: '—',
        subtemas: [
          'Tildación general, diacrítica y de hiatos',
          'Uso de grafías',
          'Signos de puntuación',
        ],
        docentes: [],
      },
      {
        id: 'com-escrita-3',
        tipo: 'TALLER',
        unidad: 'ESCRITA',
        titulo: 'Taller — Coherencia y cohesión textual',
        fecha: 'Taller 3 de 5 · Unidad 3',
        hora: '—',
        subtemas: [
          'Referentes textuales',
          'Marcadores discursivos',
          'Progresión temática',
        ],
        docentes: [],
      },
      {
        id: 'com-escrita-4',
        tipo: 'TALLER',
        unidad: 'ESCRITA',
        titulo: 'Taller — El texto: concepto, estructura y tipos',
        fecha: 'Taller 4 de 5 · Unidad 3',
        hora: '—',
        subtemas: [
          'Propiedades del texto',
          'Introducción, desarrollo y cierre',
          'Tipos textuales',
        ],
        docentes: [],
      },
      {
        id: 'com-escrita-5',
        tipo: 'TALLER',
        unidad: 'ESCRITA',
        titulo: 'Taller — El artículo científico y su estructura',
        fecha: 'Taller 5 de 5 · Unidad 3',
        hora: '—',
        subtemas: [
          'Estructura IMRyD',
          'Citas y referencias',
          'Lectura de artículos científicos',
        ],
        docentes: [],
      },
      {
        id: 'com-pc-normativa-1',
        tipo: 'PC',
        unidad: 'ESCRITA',
        titulo: 'Práctica calificada de normativa 1',
        fecha: 'Individual',
        hora: '—',
        subtemas: ['Ortografía, puntuación y conectores'],
        docentes: [],
        nota: 'Vale 6% de la nota final.',
      },
      {
        id: 'com-resena',
        tipo: 'PRODUCTO',
        unidad: 'ESCRITA',
        titulo: 'Reseña-resumen de artículos científicos',
        fecha: 'Producto grupal',
        hora: '—',
        subtemas: [
          'Selección de artículos',
          'Síntesis y valoración crítica',
          'Redacción de la reseña',
        ],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
      {
        id: 'com-argumentativo',
        tipo: 'PRODUCTO',
        unidad: 'ESCRITA',
        titulo: 'Texto argumentativo',
        fecha: 'Producto grupal',
        hora: '—',
        subtemas: [
          'Tesis y argumentos',
          'Contraargumentación',
          'Uso de fuentes',
        ],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
      {
        id: 'com-revision-literaria',
        tipo: 'PRODUCTO',
        unidad: 'ESCRITA',
        titulo: 'Revisión literaria de artículos científicos',
        fecha: 'Producto grupal',
        hora: '—',
        subtemas: [
          'Búsqueda y selección bibliográfica',
          'Organización temática de las fuentes',
          'Redacción y referencias',
        ],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
    ],
  },

  // ─── EVALUACIONES ──────────────────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Evaluaciones',
    fechas: 'Parcial y final · 20% cada uno',
    esEvaluacion: true,
    actividades: [
      {
        id: 'com-examen-parcial',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen parcial',
        fecha: 'Cierra la Unidad 2',
        hora: '—',
        subtemas: [
          'Comprensión lectora',
          'Evaluación individual',
        ],
        docentes: [],
        nota: 'Vale 20%. Hay sustitutorio para parcial y final, con nota máxima 11. Cámara obligatoria: si no se activa, la nota es 0.',
      },
      {
        id: 'com-examen-final',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen final',
        fecha: 'Cierra la Unidad 3',
        hora: '—',
        subtemas: [
          'Comunicación escrita',
          'Evaluación individual',
        ],
        docentes: [],
        nota: 'Vale 20%. Hay sustitutorio para parcial y final, con nota máxima 11.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Comunicación y Redacción II',
  codigo: 'U0681',
  carrera: 'Medicina · UPCH',
  duracion: '19 ago – 14 dic 2024',
  creditos: '03 créditos · 96h de práctica',
  coordinadora: 'Mag. Ketty García Ruiz',
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
