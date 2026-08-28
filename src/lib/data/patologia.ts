export type TipoActividad =
  | 'MAGISTRAL'
  | 'AULA-INV'
  | 'TBL'
  | 'ACP'
  | 'LAB'
  | 'EXAM-PARC'
  | 'SUSTIT';

export type Unidad =
  | 'UNIDAD_1'
  | 'UNIDAD_2'
  | 'UNIDAD_3'
  | 'UNIDAD_4'
  | 'INTEGRACION'
  | 'EVALUACION';

/** Envase del resumen: PDF en el bucket `resumenes`, o fragmento HTML. */
export type ResumenFormato = 'pdf' | 'html';

export interface ResumenOpcion {
  id: string;
  label: string;
  /** Por opción además de por tarjeta: un picker puede mezclar los dos envases. */
  formato?: ResumenFormato;
}

export interface ExamenRef {
  key: string;
  free?: boolean;
  /** Grupos adicionales (B, C, …); cada uno se descarga solo al pulsar su cuadro. */
  groups?: string[];
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código corto del sílabo: C1–C16, AI1–AI19, TBL1–TBL6, ACP1–ACP17, Lab 1–9. */
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
  /**
   * No tiene ni va a tener material propio (presentación del curso): muestra la
   * invitación a colaborar en vez de las tres tarjetas de estudio apagadas.
   */
  sinMaterial?: boolean;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  UNIDAD_1:    '#1D5FA6',
  UNIDAD_2:    '#1A7A4A',
  UNIDAD_3:    '#5A3AA6',
  UNIDAD_4:    '#A61D3F',
  INTEGRACION: '#B35A00',
  EVALUACION:  '#444441',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:   { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'      },
  'AULA-INV':  { bg: 'rgba(20,184,166,0.15)',  color: '#0d9488', label: 'Aula invertida' },
  TBL:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'TBL'            },
  ACP:         { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'ACP'            },
  LAB:         { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Laboratorio'    },
  'EXAM-PARC': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Parcial' },
  SUSTIT:      { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio'   },
};

/**
 * Peso de cada tipo de sesión en la nota final (sílabo 2026-II). Se muestra en
 * la ficha de la actividad para que el alumno sepa cuánto pesa repasarla; las
 * magistrales no tienen nota propia, se evalúan dentro del examen parcial.
 */
export const PESO_TIPO: Record<TipoActividad, string | null> = {
  MAGISTRAL:   null,
  'AULA-INV':  '15% — pre-test',
  TBL:         '25% de la nota final',
  ACP:         '15% de la nota final',
  LAB:         '10% de la nota final',
  'EXAM-PARC': '35% — 4 exámenes',
  SUSTIT:      null,
};

/**
 * Qué hace el alumno en cada tipo de sesión. Sirve de aviso en la ficha: no es
 * lo mismo llegar a una magistral que a un TBL, donde el estudio previo es
 * obligatorio y se califica apenas empieza la clase.
 */
export const TIPO_DESC: Record<TipoActividad, string> = {
  MAGISTRAL:   'Exposición docente presencial. Sin material previo obligatorio; el contenido entra al examen parcial.',
  'AULA-INV':  'Estudio previo obligatorio (video/lectura en Blackboard) → pre-test en clase → feedback.',
  TBL:         'Estudio previo obligatorio → prueba individual (60%) → prueba grupal (20%) → aplicación grupal (20%).',
  ACP:         'Análisis de caso clínico-patológico: trabajo autónomo con tutor, con la semana completa como plazo.',
  LAB:         'Práctica presencial con microscopio, con pretest y rotación de grupos (A1–A6 / B1–B6).',
  'EXAM-PARC': 'Examen teórico-práctico de opción múltiple.',
  SUSTIT:      'Reemplaza la nota más baja de los exámenes parciales.',
};

/** Aviso repetido en las 9 prácticas: una sola práctica dictada en 3 turnos. */
const NOTA_LAB =
  'Se dicta en 3 turnos (lunes/miércoles/viernes) para los 12 grupos (A1–A6, B1–B6) en LIDIA y LAB 2. El material de estudio es el mismo para todos; solo cambia tu horario y aula.';

/** Aviso de las ACP: el sílabo no fija día, la fecha es toda la semana. */
const NOTA_ACP = 'Fecha flexible: se trabaja a lo largo de la semana con el tutor asignado.';

export const semanas: Semana[] = [
  // ═══ UNIDAD 1 — Respuesta celular y tisular al daño ════════════════════════
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '10 – 14 ago',
    actividades: [
      {
        id: 'pat-intro',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'Introducción al curso',
        fecha: '10 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
        sinMaterial: true,
      },
      {
        id: 'pat-c-1',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        codigo: 'C1',
        titulo: 'C1 — Aplicaciones del laboratorio clínico (parte 1)',
        fecha: '10 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-1',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI1',
        titulo: 'AI1 — Aplicaciones del laboratorio clínico (parte 2)',
        fecha: '12 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-2',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI2',
        titulo: 'AI2 — Métodos en Patología',
        fecha: '14 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-lab-1',
        tipo: 'LAB',
        unidad: 'UNIDAD_1',
        codigo: 'Lab 1',
        titulo: 'Lab 1 — Macroscopía y uso del microscopio',
        fecha: '10 – 14 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '17 – 21 ago',
    actividades: [
      {
        id: 'pat-ai-3',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI3',
        titulo: 'AI3 — Patología celular I: adaptaciones',
        fecha: '17 ago',
        hora: '—',
        subtemas: ['Adaptaciones celulares'],
        docentes: [],
      },
      {
        id: 'pat-ai-4',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI4',
        titulo: 'AI4 — Patología celular II: lesión y muerte celular',
        fecha: '19 ago',
        hora: '—',
        subtemas: ['Lesión celular', 'Muerte celular'],
        docentes: [],
      },
      {
        id: 'pat-tbl-1',
        tipo: 'TBL',
        unidad: 'UNIDAD_1',
        codigo: 'TBL1',
        titulo: 'TBL1 — Aterosclerosis e infarto de miocardio',
        fecha: '21 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-lab-2',
        tipo: 'LAB',
        unidad: 'UNIDAD_1',
        codigo: 'Lab 2',
        titulo: 'Lab 2 — Adaptaciones y acumulaciones celulares',
        fecha: '17 – 21 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '24 – 29 ago',
    actividades: [
      {
        id: 'pat-c-2',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        codigo: 'C2',
        titulo: 'C2 — Inflamación aguda (parte 1)',
        fecha: '24 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-3',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        codigo: 'C3',
        titulo: 'C3 — Inflamación aguda (parte 2)',
        fecha: '26 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-5',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI5',
        titulo: 'AI5 — Inflamación aguda (parte 3)',
        fecha: '28 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-1',
        tipo: 'ACP',
        unidad: 'UNIDAD_1',
        codigo: 'ACP1',
        titulo: 'ACP1 — Respuesta inflamatoria aguda: mediadores y SIRS',
        fecha: '24 – 29 ago',
        hora: '—',
        subtemas: ['Mediadores de la inflamación', 'SIRS'],
        docentes: [],
        nota: NOTA_ACP,
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'pat-acp-1', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'pat-lab-3',
        tipo: 'LAB',
        unidad: 'UNIDAD_1',
        codigo: 'Lab 3',
        titulo: 'Lab 3 — Muerte celular',
        fecha: '24 – 29 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '31 ago – 4 set',
    actividades: [
      {
        id: 'pat-ai-6',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI6',
        titulo: 'AI6 — Inflamación crónica',
        fecha: '31 ago',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-7',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_1',
        codigo: 'AI7',
        titulo: 'AI7 — Regeneración y reparación',
        fecha: '2 set',
        hora: '—',
        subtemas: ['Regeneración tisular', 'Reparación tisular'],
        docentes: [],
      },
      {
        id: 'pat-tbl-2',
        tipo: 'TBL',
        unidad: 'UNIDAD_1',
        codigo: 'TBL2',
        titulo: 'TBL2 — Neumonía y derrame pleural',
        fecha: '4 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-2',
        tipo: 'ACP',
        unidad: 'UNIDAD_1',
        codigo: 'ACP2',
        titulo: 'ACP2 — Inflamación aguda: manifestaciones clínicas',
        fecha: '31 ago – 4 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-4',
        tipo: 'LAB',
        unidad: 'UNIDAD_1',
        codigo: 'Lab 4',
        titulo: 'Lab 4 — Inflamación',
        fecha: '31 ago – 4 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-5',
    titulo: 'Semana 5',
    fechas: '7 – 11 set',
    actividades: [
      {
        id: 'pat-c-4',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        codigo: 'C4',
        titulo: 'C4 — Trastornos hemodinámicos',
        fecha: '7 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-3',
        tipo: 'ACP',
        unidad: 'UNIDAD_1',
        codigo: 'ACP3',
        titulo: 'ACP3 — Fibrosis: reparación tisular persistente (hígado y pulmón)',
        fecha: '7 – 11 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-acp-4',
        tipo: 'ACP',
        unidad: 'UNIDAD_1',
        codigo: 'ACP4',
        titulo: 'ACP4 — Trombosis y tromboembolismo pulmonar',
        fecha: '7 – 11 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-5',
        tipo: 'LAB',
        unidad: 'UNIDAD_1',
        codigo: 'Lab 5',
        titulo: 'Lab 5 — Trastornos hemodinámicos',
        fecha: '7 – 11 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'eval-1',
    titulo: 'Examen Parcial 1',
    fechas: '12 set',
    esEvaluacion: true,
    actividades: [
      {
        id: 'pat-ex-1',
        tipo: 'EXAM-PARC',
        unidad: 'EVALUACION',
        titulo: 'Examen Parcial 1 — Respuesta celular y tisular al daño',
        fecha: '12 set',
        fechaISO: '2026-09-12',
        hora: '—',
        subtemas: ['Unidad 1 · semanas 1 – 5'],
        docentes: [],
      },
    ],
  },

  // ═══ UNIDAD 2 — Bases genéticas y neoplásicas de la enfermedad ═════════════
  {
    id: 'sem-6',
    titulo: 'Semana 6',
    fechas: '14 – 18 set',
    actividades: [
      {
        id: 'pat-ai-8',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI8',
        titulo: 'AI8 — Bases genéticas de la enfermedad',
        fecha: '15 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-9',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI9',
        titulo: 'AI9 — Patrones de herencia y expresión de enfermedades genéticas',
        fecha: '17 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-5',
        tipo: 'ACP',
        unidad: 'UNIDAD_2',
        codigo: 'ACP5',
        titulo: 'ACP5 — Predisposición genética al cáncer',
        fecha: '14 – 18 set',
        hora: '—',
        subtemas: ['BRCA1 / BRCA2', 'Síndrome de Lynch', 'FAP', 'MEN2'],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'sem-7',
    titulo: 'Semana 7',
    fechas: '21 – 25 set',
    actividades: [
      {
        id: 'pat-ai-10',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI10',
        titulo: 'AI10 — Introducción a las neoplasias',
        fecha: '21 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-11',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI11',
        titulo: 'AI11 — Carcinogénesis y transformación tumoral',
        fecha: '23 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-6',
        tipo: 'ACP',
        unidad: 'UNIDAD_2',
        codigo: 'ACP6',
        titulo: 'ACP6 — VPH: de la infección a la neoplasia maligna',
        fecha: '21 – 25 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-6',
        tipo: 'LAB',
        unidad: 'UNIDAD_2',
        codigo: 'Lab 6',
        titulo: 'Lab 6 — Neoplasias benignas',
        fecha: '21 – 25 set',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-8',
    titulo: 'Semana 8',
    fechas: '28 set – 2 oct',
    actividades: [
      {
        id: 'pat-ai-12',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI12',
        titulo: 'AI12 — Características distintivas del cáncer',
        fecha: '28 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-13',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI13',
        titulo: 'AI13 — Manifestaciones clínicas y evaluación de neoplasias',
        fecha: '30 set',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-tbl-3',
        tipo: 'TBL',
        unidad: 'UNIDAD_2',
        codigo: 'TBL3',
        titulo: 'TBL3 — Cáncer de mama',
        fecha: '2 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
    ],
  },
  {
    id: 'sem-9',
    titulo: 'Semana 9',
    fechas: '5 – 9 oct',
    actividades: [
      {
        id: 'pat-acp-7',
        tipo: 'ACP',
        unidad: 'UNIDAD_2',
        codigo: 'ACP7',
        titulo: 'ACP7 — Inflamación, inmunidad y cáncer: cáncer gástrico y de pulmón',
        fecha: '5 – 9 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-7',
        tipo: 'LAB',
        unidad: 'UNIDAD_2',
        codigo: 'Lab 7',
        titulo: 'Lab 7 — Neoplasias malignas',
        fecha: '5 – 9 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-10',
    titulo: 'Semana 10',
    fechas: '12 – 16 oct',
    actividades: [
      {
        id: 'pat-c-5',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        codigo: 'C5',
        titulo: 'C5 — Leucemias: conceptos y clasificación',
        fecha: '12 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-14',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_2',
        codigo: 'AI14',
        titulo: 'AI14 — Inmunidad y cáncer: vigilancia, escape e inmunoterapia',
        fecha: '14 oct',
        hora: '—',
        subtemas: ['Vigilancia inmunológica', 'Escape tumoral', 'Inmunoterapia'],
        docentes: [],
      },
      {
        id: 'pat-c-6',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        codigo: 'C6',
        titulo: 'C6 — Linfomas: conceptos y clasificación',
        fecha: '14 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-tbl-4',
        tipo: 'TBL',
        unidad: 'UNIDAD_2',
        codigo: 'TBL4',
        titulo: 'TBL4 — Neoplasias hematológicas: leucemias agudas y crónicas',
        fecha: '16 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-8',
        tipo: 'ACP',
        unidad: 'UNIDAD_2',
        codigo: 'ACP8',
        titulo: 'ACP8 — Linfadenopatía persistente',
        fecha: '12 – 16 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'eval-2',
    titulo: 'Examen Parcial 2',
    fechas: '17 oct',
    esEvaluacion: true,
    actividades: [
      {
        id: 'pat-ex-2',
        tipo: 'EXAM-PARC',
        unidad: 'EVALUACION',
        titulo: 'Examen Parcial 2 — Bases genéticas y neoplásicas',
        fecha: '17 oct',
        fechaISO: '2026-10-17',
        hora: '—',
        subtemas: ['Unidad 2 · semanas 6 – 10'],
        docentes: [],
        nota:
          'El sílabo ubica este parcial al cierre de la semana 10, entre el fin de la Unidad 2 y el inicio de la Unidad 3. Confirmar con coordinación si evalúa la Unidad 2, la 3 o ambas.',
      },
    ],
  },

  // ═══ UNIDAD 3 — Inmunopatología ════════════════════════════════════════════
  {
    id: 'sem-11',
    titulo: 'Semana 11',
    fechas: '19 – 23 oct',
    actividades: [
      {
        id: 'pat-ai-15',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_3',
        codigo: 'AI15',
        titulo: 'AI15 — Hipersensibilidad',
        fecha: '19 oct',
        hora: '—',
        subtemas: ['Tipos I – IV'],
        docentes: [],
      },
      {
        id: 'pat-acp-9',
        tipo: 'ACP',
        unidad: 'UNIDAD_3',
        codigo: 'ACP9',
        titulo: 'ACP9 — Hipersensibilidad: anafilaxia, asma, urticaria y alergia alimentaria',
        fecha: '19 – 23 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-acp-10',
        tipo: 'ACP',
        unidad: 'UNIDAD_3',
        codigo: 'ACP10',
        titulo: 'ACP10 — Hipersensibilidad: fiebre reumática, dermatitis de contacto, PPD, incompatibilidad y miastenia',
        fecha: '19 – 23 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'sem-12',
    titulo: 'Semana 12',
    fechas: '26 – 30 oct',
    actividades: [
      {
        id: 'pat-ai-16',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_3',
        codigo: 'AI16',
        titulo: 'AI16 — Autoinmunidad órgano-específica: Graves y Hashimoto',
        fecha: '26 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-7',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        codigo: 'C7',
        titulo: 'C7 — Introducción a las enfermedades autoinmunes',
        fecha: '28 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-tbl-5',
        tipo: 'TBL',
        unidad: 'UNIDAD_3',
        codigo: 'TBL5',
        titulo: 'TBL5 — Lupus eritematoso sistémico (LES)',
        fecha: '30 oct',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
    ],
  },
  {
    id: 'sem-13',
    titulo: 'Semana 13',
    fechas: '2 – 6 nov',
    actividades: [
      {
        id: 'pat-ai-17',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_3',
        codigo: 'AI17',
        titulo: 'AI17 — Citopenias autoinmunes',
        fecha: '2 nov',
        hora: '—',
        subtemas: ['Anemia hemolítica autoinmune', 'PTI'],
        docentes: [],
      },
      {
        id: 'pat-c-8',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        codigo: 'C8',
        titulo: 'C8 — Inmunodeficiencias primarias',
        fecha: '6 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-9',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        codigo: 'C9',
        titulo: 'C9 — Inmunología del trasplante',
        fecha: '6 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-11',
        tipo: 'ACP',
        unidad: 'UNIDAD_3',
        codigo: 'ACP11',
        titulo: 'ACP11 — Vasculitis de vaso pequeño y ANCA',
        fecha: '2 – 6 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-acp-12',
        tipo: 'ACP',
        unidad: 'UNIDAD_3',
        codigo: 'ACP12',
        titulo: 'ACP12 — Vasculitis por complejos inmunes y de grandes vasos',
        fecha: '2 – 6 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-8',
        tipo: 'LAB',
        unidad: 'UNIDAD_3',
        codigo: 'Lab 8',
        titulo: 'Lab 8 — Patología autoinmune',
        fecha: '2 – 6 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },

  // ═══ UNIDAD 4 — Patología de las enfermedades infecciosas ══════════════════
  {
    id: 'sem-14',
    titulo: 'Semana 14',
    fechas: '9 – 13 nov',
    actividades: [
      {
        id: 'pat-c-10',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C10',
        titulo: 'C10 — Infecciones bacterianas: grampositivas',
        fecha: '9 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-18',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_4',
        codigo: 'AI18',
        titulo: 'AI18 — Infecciones bacterianas: gramnegativas',
        fecha: '11 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-11',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C11',
        titulo: 'C11 — Aproximación al paciente con enfermedad infecciosa',
        fecha: '13 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-13',
        tipo: 'ACP',
        unidad: 'UNIDAD_4',
        codigo: 'ACP13',
        titulo: 'ACP13 — Sepsis',
        fecha: '9 – 13 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'eval-3',
    titulo: 'Examen Parcial 3',
    fechas: '14 nov',
    esEvaluacion: true,
    actividades: [
      {
        id: 'pat-ex-3',
        tipo: 'EXAM-PARC',
        unidad: 'EVALUACION',
        titulo: 'Examen Parcial 3 — Inmunopatología e inicio de infecciosas',
        fecha: '14 nov',
        fechaISO: '2026-11-14',
        hora: '—',
        subtemas: ['Unidad 3 · semanas 11 – 13', 'Semana 14'],
        docentes: [],
      },
    ],
  },
  {
    id: 'sem-15',
    titulo: 'Semana 15',
    fechas: '16 – 20 nov',
    actividades: [
      {
        id: 'pat-c-12',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C12',
        titulo: 'C12 — Infecciones en pacientes inmunosuprimidos',
        fecha: '16 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-ai-19',
        tipo: 'AULA-INV',
        unidad: 'UNIDAD_4',
        codigo: 'AI19',
        titulo: 'AI19 — Tuberculosis: fundamentos patogénicos',
        fecha: '18 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-tbl-6',
        tipo: 'TBL',
        unidad: 'UNIDAD_4',
        codigo: 'TBL6',
        titulo: 'TBL6 — Tuberculosis',
        fecha: '20 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-14',
        tipo: 'ACP',
        unidad: 'UNIDAD_4',
        codigo: 'ACP14',
        titulo: 'ACP14 — Infecciones de transmisión sexual y VIH agudo',
        fecha: '16 – 20 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'sem-16',
    titulo: 'Semana 16',
    fechas: '23 – 27 nov',
    actividades: [
      {
        id: 'pat-c-13',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C13',
        titulo: 'C13 — Patología de las infecciones fúngicas',
        fecha: '23 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-acp-15',
        tipo: 'ACP',
        unidad: 'UNIDAD_4',
        codigo: 'ACP15',
        titulo: 'ACP15 — Hepatitis',
        fecha: '27 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-lab-9',
        tipo: 'LAB',
        unidad: 'UNIDAD_4',
        codigo: 'Lab 9',
        titulo: 'Lab 9 — Patología infecciosa',
        fecha: '23 – 27 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_LAB,
      },
    ],
  },
  {
    id: 'sem-17',
    titulo: 'Semana 17',
    fechas: '30 nov – 4 dic',
    actividades: [
      {
        id: 'pat-c-14',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C14',
        titulo: 'C14 — Infecciones por hongos endémicos',
        fecha: '30 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-15',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C15',
        titulo: 'C15 — Eosinofilia, helmintos y parásitos invasivos',
        fecha: '30 nov',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
      {
        id: 'pat-c-16',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        codigo: 'C16',
        titulo: 'C16 — Leishmania y malaria',
        fecha: '4 dic',
        hora: '—',
        subtemas: [],
        docentes: [],
      },
    ],
  },

  // ═══ Integración clínico-patológica ════════════════════════════════════════
  {
    id: 'sem-18',
    titulo: 'Semana 18',
    fechas: '7 – 11 dic',
    actividades: [
      {
        id: 'pat-acp-16',
        tipo: 'ACP',
        unidad: 'INTEGRACION',
        codigo: 'ACP16',
        titulo: 'ACP16 — Diabetes mellitus tipo 2',
        fecha: '7 dic',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
      {
        id: 'pat-acp-17',
        tipo: 'ACP',
        unidad: 'INTEGRACION',
        codigo: 'ACP17',
        titulo: 'ACP17 — Enfermedad renal crónica',
        fecha: '11 dic',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: NOTA_ACP,
      },
    ],
  },
  {
    id: 'sem-19',
    titulo: 'Semana 19 · Cierre',
    fechas: '14 – 19 dic',
    esEvaluacion: true,
    actividades: [
      {
        id: 'pat-ex-4',
        tipo: 'EXAM-PARC',
        unidad: 'EVALUACION',
        titulo: 'Examen Parcial 4 — Infecciosas e integración clínico-patológica',
        fecha: '14 dic',
        fechaISO: '2026-12-14',
        hora: '—',
        subtemas: ['Unidad 4 · semanas 15 – 17', 'Integración · semana 18'],
        docentes: [],
      },
      {
        id: 'pat-sustit',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen Sustitutorio',
        fecha: '18 dic',
        fechaISO: '2026-12-18',
        hora: '—',
        subtemas: [],
        docentes: [],
        nota: 'Entrega de notas: 19 dic.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Patología y Mecanismos de Enfermedad',
  codigo: 'M1556',
  carrera: 'Medicina · UPCH',
  ciclo: '2026-II',
  duracion: '10 ago – 19 dic 2026',
  unidades: '4 unidades + integración · 19 semanas',
  aprobacion: 'Nota mínima 11.00 en Conocimiento y en Desempeño',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
