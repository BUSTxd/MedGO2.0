export type TipoActividad =
  | 'MAGISTRAL'
  | 'INVERTIDA'
  | 'TBL'
  | 'SGP'
  | 'LAB'
  | 'HISTOLOGIA'
  | 'REPASO'
  | 'EXAMEN-T';

export type Unidad = 'INNATA' | 'ADAPTATIVA' | 'INMUNOPATOLOGIA' | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código del sílabo: T1–T14, H1–H2, L1–L2, SGP-1…4, TBL-1…3. */
  codigo?: string;
  titulo: string;
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /**
   * Módulo interactivo de la práctica. En las actividades LAB la tarjeta
   * «Video» se sustituye por «Simulación»; sin `href` queda como próximamente.
   */
  simulacion?: { href?: string; desc?: string };
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** Sobreescribe el destino del card en el sílabo (p.ej. histología → atlas). */
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
  INNATA:          '#C9A227',
  ADAPTATIVA:      '#5E9CD3',
  INMUNOPATOLOGIA: '#9B8EF8',
  EVALUACION:      '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',   color: '#3b9edd', label: 'Magistral'  },
  INVERTIDA:  { bg: 'rgba(20,184,166,0.15)',   color: '#14B8A6', label: 'Invertida'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',   color: '#F5A623', label: 'TBL'        },
  SGP:        { bg: 'rgba(155,142,248,0.15)',  color: '#9B8EF8', label: 'SGP'        },
  LAB:        { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Lab'        },
  HISTOLOGIA: { bg: 'rgba(232,121,166,0.15)',  color: '#E879A6', label: 'Histología' },
  REPASO:     { bg: 'rgba(148,163,184,0.16)',  color: '#94A3B8', label: 'Repaso'     },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',    color: '#F87171', label: 'Examen T'   },
};

/**
 * El cronograma reparte labs e histología por subgrupos (A1–A4 / B1–B4): misma
 * sesión, distinto horario y aula. Aquí se guarda una sola línea de tiempo
 * canónica y el subgrupo queda como rango de fechas ("según subgrupo").
 */
export const semanas: Semana[] = [
  // ─── SEMANA 1 — UNIDAD 1: SISTEMA INMUNE E INFLAMACIÓN ─────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Sistema inmune e inflamación',
    fechas: '1 – 5 set',
    actividades: [
      {
        id: 'orientacion',
        tipo: 'MAGISTRAL',
        unidad: 'INNATA',
        titulo: 'Presentación del curso y sílabo',
        fecha: '1 set',
        hora: '—',
        subtemas: ['Metodología del curso', 'Sistema de evaluación', 'Bibliografía'],
        docentes: [],
      },
      {
        id: 't-1',
        tipo: 'INVERTIDA',
        unidad: 'INNATA',
        codigo: 'T1',
        titulo: 'T1 — Generalidades del sistema inmune',
        fecha: '1 set',
        hora: '—',
        subtemas: [
          'Inmunidad innata vs. adaptativa',
          'Barreras naturales',
          'Antígeno, inmunógeno y epítope',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
      },
      {
        id: 't-2',
        tipo: 'MAGISTRAL',
        unidad: 'INNATA',
        codigo: 'T2',
        titulo: 'T2 — Células del sistema inmune y lámina periférica',
        fecha: '1 set',
        hora: '—',
        subtemas: [
          'Serie mieloide y serie linfoide',
          'Granulocitos, monocitos y macrófagos',
          'Linfocitos B, T y NK',
          'Reconocimiento en lámina periférica',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-3',
        tipo: 'MAGISTRAL',
        unidad: 'INNATA',
        codigo: 'T3',
        titulo: 'T3 — Órganos linfoides primarios',
        fecha: '1 set',
        hora: '—',
        subtemas: [
          'Médula ósea: nicho hematopoyético',
          'Timo: corteza, médula y corpúsculos de Hassall',
          'Educación y selección linfocitaria',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'h-1',
        tipo: 'HISTOLOGIA',
        unidad: 'INNATA',
        codigo: 'H1',
        titulo: 'H1 — Timo y tejido linfoide asociado a mucosas',
        fecha: '2 – 5 set · según subgrupo',
        hora: '—',
        subtemas: [
          'Médula ósea',
          'Timo: corteza y médula',
          'MALT: amígdalas y placas de Peyer',
        ],
        docentes: [],
        nota: 'Evaluación: 60% individual (Kahoot) + 40% grupal (rúbrica). Promedio de las 2 prácticas = 5% de la nota final.',
        linkOverride: '/dashboard/histologia/inmunologia',
      },
      {
        id: 't-4',
        tipo: 'INVERTIDA',
        unidad: 'INNATA',
        codigo: 'T4',
        titulo: 'T4 — Desarrollo de las células del sistema inmune (leucopoyesis)',
        fecha: '3 set',
        hora: '—',
        subtemas: [
          'Célula madre hematopoyética',
          'Granulopoyesis y monopoyesis',
          'Linfopoyesis B y T',
          'Factores de crecimiento hematopoyéticos',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-5',
        tipo: 'MAGISTRAL',
        unidad: 'INNATA',
        codigo: 'T5',
        titulo: 'T5 — Respuestas innatas moleculares',
        fecha: '5 set',
        hora: '—',
        subtemas: [
          'Sistema del complemento: vías clásica, alterna y de lectinas',
          'Citoquinas y quimioquinas',
          'Reactantes de fase aguda',
          'Interferones',
        ],
        docentes: [],
        nota: 'Paso corto: evaluado durante la sesión (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'INNATA',
        codigo: 'SGP-1',
        titulo: 'SGP 1 — Inflamación',
        fecha: '2 – 5 set · flexible',
        hora: '—',
        subtemas: [
          'Caso clínico: infección bacteriana (celulitis)',
          'Signos cardinales de la inflamación',
          'Reclutamiento leucocitario y diapédesis',
          'Mediadores de la inflamación aguda',
        ],
        docentes: [],
        nota: 'Evaluado por el tutor facilitador al final de la semana. Promedio de SGP = 30% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── SEMANA 2 — CIERRE UNIDAD 1 / INICIO UNIDAD 2 ──────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — De la inmunidad innata a la adaptativa',
    fechas: '8 – 12 set',
    actividades: [
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'INNATA',
        codigo: 'TBL-1',
        titulo: 'TBL 1 — Hemograma y reactantes de fase aguda',
        fecha: '8 set',
        hora: '—',
        subtemas: [
          'Interpretación de la serie blanca',
          'Fórmula leucocitaria y desviación izquierda',
          'PCR, VSG, procalcitonina y ferritina',
        ],
        docentes: [],
        nota: 'Evaluación: 60% examen individual + 40% trabajo grupal. Promedio de TBL = 10% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-6',
        tipo: 'MAGISTRAL',
        unidad: 'INNATA',
        codigo: 'T6',
        titulo: 'T6 — Respuestas innatas celulares',
        fecha: '8 set',
        hora: '—',
        subtemas: [
          'Receptores de reconocimiento de patrones (PRR, TLR)',
          'PAMPs y DAMPs',
          'Fagocitosis y estallido respiratorio',
          'Células NK e inflamasoma',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'l-1',
        tipo: 'LAB',
        unidad: 'INNATA',
        codigo: 'L1',
        titulo: 'L1 — Inmunohematología aplicada',
        fecha: '9 – 12 set · según subgrupo',
        hora: '—',
        subtemas: [
          'Sistema ABO y Rh',
          'Prueba cruzada y Coombs',
          'Reacciones antígeno-anticuerpo',
        ],
        docentes: [],
        nota: 'Inicia en la Unidad 1 y continúa en la Unidad 2. Se evalúa por envío de tareas / resolución de problemas (promedio de los 2 labs = 5%).',
        simulacion: { desc: 'Práctica interactiva de tipificación ABO/Rh y pruebas de compatibilidad' },
      },
      {
        id: 't-7',
        tipo: 'MAGISTRAL',
        unidad: 'ADAPTATIVA',
        codigo: 'T7',
        titulo: 'T7 — El sistema innato transfiere información al sistema adaptativo',
        fecha: '10 set',
        hora: '—',
        subtemas: [
          'Células presentadoras de antígeno',
          'Complejo mayor de histocompatibilidad (MHC I y II)',
          'Procesamiento y presentación antigénica',
          'Sinapsis inmunológica y coestimulación',
        ],
        docentes: [],
        nota: 'Paso corto: evaluado durante la sesión (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-8',
        tipo: 'INVERTIDA',
        unidad: 'ADAPTATIVA',
        codigo: 'T8',
        titulo: 'T8 — Desarrollo, selección y activación de linfocitos T',
        fecha: '12 set',
        hora: '—',
        subtemas: [
          'Reordenamiento del receptor TCR',
          'Selección positiva y negativa en el timo',
          'Tolerancia central',
          'Activación: señales 1, 2 y 3',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'ADAPTATIVA',
        codigo: 'SGP-2',
        titulo: 'SGP 2 — Infección por micobacterias: tuberculosis latente',
        fecha: '9 – 12 set · flexible',
        hora: '—',
        subtemas: [
          'Respuesta inmune celular frente a micobacterias',
          'Formación del granuloma',
          'Tuberculosis latente vs. activa',
          'PPD e IGRA',
        ],
        docentes: [],
        nota: 'Evaluado por el tutor facilitador al final de la semana. Promedio de SGP = 30% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── SEMANA 3 — UNIDAD 2: RESPUESTA INMUNE ─────────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Respuesta inmune adaptativa',
    fechas: '15 – 19 set',
    actividades: [
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'ADAPTATIVA',
        codigo: 'TBL-2',
        titulo: 'TBL 2 — Infecciones virales: VIH',
        fecha: '15 set',
        hora: '—',
        subtemas: [
          'Ciclo replicativo del VIH',
          'Depleción de linfocitos T CD4+',
          'Historia natural y estadios',
          'Carga viral y recuento CD4',
        ],
        docentes: [],
        nota: 'Evaluación: 60% examen individual + 40% trabajo grupal. Promedio de TBL = 10% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-9',
        tipo: 'INVERTIDA',
        unidad: 'ADAPTATIVA',
        codigo: 'T9',
        titulo: 'T9 — Respuesta humoral y linfocitos B',
        fecha: '15 set',
        hora: '—',
        subtemas: [
          'Estructura de la inmunoglobulina',
          'Isotipos: IgM, IgG, IgA, IgE, IgD',
          'Cambio de clase e hipermutación somática',
          'Respuesta primaria vs. secundaria',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-10',
        tipo: 'MAGISTRAL',
        unidad: 'ADAPTATIVA',
        codigo: 'T10',
        titulo: 'T10 — Órganos linfoides secundarios',
        fecha: '15 set',
        hora: '—',
        subtemas: [
          'Ganglio linfático: corteza, paracorteza y médula',
          'Bazo: pulpa blanca y pulpa roja',
          'Centro germinal',
          'Recirculación linfocitaria',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'h-2',
        tipo: 'HISTOLOGIA',
        unidad: 'ADAPTATIVA',
        codigo: 'H2',
        titulo: 'H2 — Órganos linfoides secundarios: bazo y ganglios linfáticos',
        fecha: '16 – 19 set · según subgrupo',
        hora: '—',
        subtemas: [
          'Ganglio linfático: folículos primarios y secundarios',
          'Bazo: corpúsculos de Malpighi y cordones de Billroth',
        ],
        docentes: [],
        nota: 'Evaluación: 60% individual (Kahoot) + 40% grupal (rúbrica). Promedio de las 2 prácticas = 5% de la nota final.',
        linkOverride: '/dashboard/histologia/inmunologia',
      },
      {
        id: 't-11',
        tipo: 'INVERTIDA',
        unidad: 'ADAPTATIVA',
        codigo: 'T11',
        titulo: 'T11 — Respuesta inmune específica y diferenciación de linfocitos T',
        fecha: '17 set',
        hora: '—',
        subtemas: [
          'Linfocitos T helper: Th1, Th2, Th17, Tfh',
          'Linfocitos T citotóxicos y mecanismos de lisis',
          'Memoria inmunológica',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'ADAPTATIVA',
        codigo: 'SGP-3',
        titulo: 'SGP 3 — Autoinmunidad: artritis reumatoide y autoanticuerpos',
        fecha: '16 – 19 set · flexible',
        hora: '—',
        subtemas: [
          'Pérdida de la tolerancia periférica',
          'Factor reumatoide y anti-CCP',
          'ANA y patrones de inmunofluorescencia',
          'Mecanismos de daño tisular',
        ],
        docentes: [],
        nota: 'Evaluado por el tutor facilitador al final de la semana. Promedio de SGP = 30% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'repaso-1',
        tipo: 'REPASO',
        unidad: 'ADAPTATIVA',
        codigo: 'R1',
        titulo: 'Repaso y autoevaluación 1',
        fecha: '19 set',
        hora: '—',
        subtemas: ['Repaso integrador de las Unidades 1 y 2', 'Autoevaluación'],
        docentes: [],
        nota: 'Sesión no calificada. Es voluntaria, pero recomendada.',
      },
    ],
  },

  // ─── SEMANA 4 — UNIDAD 3: INTRODUCCIÓN A INMUNOPATOLOGÍA ───────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4 — Introducción a inmunopatología',
    fechas: '22 – 26 set',
    actividades: [
      {
        id: 'tbl-3',
        tipo: 'TBL',
        unidad: 'ADAPTATIVA',
        codigo: 'TBL-3',
        titulo: 'TBL 3 — Vacunas',
        fecha: '22 set',
        hora: '—',
        subtemas: [
          'Tipos de vacunas: atenuadas, inactivadas, subunidades, ARNm',
          'Adyuvantes',
          'Inmunidad de rebaño',
          'Esquema nacional de vacunación',
        ],
        docentes: [],
        nota: 'Evaluación: 60% examen individual + 40% trabajo grupal. Promedio de TBL = 10% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-12',
        tipo: 'INVERTIDA',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'T12',
        titulo: 'T12 — Regulación de la respuesta inmune',
        fecha: '22 set',
        hora: '—',
        subtemas: [
          'Linfocitos T reguladores (Treg)',
          'Tolerancia periférica',
          'Checkpoints inmunológicos: CTLA-4 y PD-1',
          'Citoquinas reguladoras: IL-10 y TGF-β',
        ],
        docentes: [],
        nota: 'Clase invertida: se evalúa en sesión con clickers (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 't-13',
        tipo: 'MAGISTRAL',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'T13',
        titulo: 'T13 — Citometría de flujo (teoría)',
        fecha: '22 set',
        hora: '—',
        subtemas: [
          'Fundamento: dispersión de luz y fluorescencia',
          'FSC y SSC',
          'Fluorocromos y compensación',
          'Inmunofenotipo y marcadores CD',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'l-2',
        tipo: 'LAB',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'L2',
        titulo: 'L2 — Citometría de flujo (FlowJo)',
        fecha: '23 – 25 set · según subgrupo',
        hora: '—',
        subtemas: [
          'Manejo de FlowJo',
          'Estrategia de gating',
          'Interpretación de dot plots e histogramas',
        ],
        docentes: [],
        nota: 'Se evalúa por envío de tareas / resolución de problemas (promedio de los 2 labs = 5%).',
        simulacion: { desc: 'Práctica interactiva de gating e interpretación de dot plots' },
      },
      {
        id: 't-14',
        tipo: 'MAGISTRAL',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'T14',
        titulo: 'T14 — Fallas del sistema inmune: inmunidad y cáncer',
        fecha: '24 set',
        hora: '—',
        subtemas: [
          'Inmunovigilancia tumoral',
          'Inmunoedición: eliminación, equilibrio y escape',
          'Mecanismos de evasión tumoral',
          'Inmunoterapia: anti-PD-1 / anti-CTLA-4 y CAR-T',
        ],
        docentes: [],
        nota: 'Paso corto: evaluado durante la sesión (cuenta para pasos cortos, 10%).',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'sgp-4',
        tipo: 'SGP',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'SGP-4',
        titulo: 'SGP 4 — Inmunidad y cáncer: melanoma y evasión del sistema inmune',
        fecha: 'Flexible',
        hora: '—',
        subtemas: [
          'Caso clínico: melanoma',
          'Mecanismos de carcinogénesis',
          'Escape inmunológico del tumor',
          'Respuesta a inmunoterapia',
        ],
        docentes: [],
        nota: 'Evaluado por el tutor facilitador al final de la semana. Promedio de SGP = 30% de la nota final.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'repaso-2',
        tipo: 'REPASO',
        unidad: 'INMUNOPATOLOGIA',
        codigo: 'R2',
        titulo: 'Repaso y autoevaluación 2',
        fecha: '26 set',
        hora: '—',
        subtemas: ['Repaso integrador de la Unidad 3', 'Autoevaluación'],
        docentes: [],
        nota: 'Sesión no calificada. Es voluntaria, pero recomendada.',
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ──────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación Final',
    fechas: '27 set',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Final Teórico',
        fecha: '27 set',
        fechaISO: '2025-09-27',
        hora: '14:30–16:30',
        subtemas: [
          '60 preguntas',
          'Cubre las Unidades 1 a 3 (T1–T14)',
          'Presencial, sesión única',
        ],
        docentes: [],
        nota: 'Vale 40% de la nota final y exige un mínimo de 11.00 de forma independiente. Quien desapruebe rinde el Examen Sustitutorio, cuya nota máxima es 11.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Inmunología',
  carrera: 'Medicina · UPCH',
  duracion: '1 – 27 set 2025',
  unidades: '3 unidades · 4 semanas',
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
