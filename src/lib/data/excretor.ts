export type TipoActividad =
  | 'MAGISTRAL'
  | 'TBL'
  | 'ABP'
  | 'LAB-HISTO'
  | 'LAB-ANAT'
  | 'PASO-CORTO'
  | 'EXAM-ANAT'
  | 'EXAM-FINAL'
  | 'SUSTIT';

export type Unidad =
  | 'UNIDAD_1'
  | 'UNIDAD_2'
  | 'UNIDAD_3'
  | 'UNIDAD_4'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface ExamenRef {
  key: string;
  free?: boolean;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  titulo: string;
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  examen?: ExamenRef;
  qbank?: ExamenRef;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  UNIDAD_1:   '#1D5FA6',
  UNIDAD_2:   '#1A7A4A',
  UNIDAD_3:   '#5A3AA6',
  UNIDAD_4:   '#B35A00',
  EVALUACION: '#444441',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:   { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'    },
  TBL:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'TBL'          },
  ABP:         { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'ABP'          },
  'LAB-HISTO': { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Histo'    },
  'LAB-ANAT':  { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Anat'     },
  'PASO-CORTO':{ bg: 'rgba(239,68,68,0.12)',   color: '#F87171', label: 'Paso corto'   },
  'EXAM-ANAT': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Anat'  },
  'EXAM-FINAL':{ bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Final' },
  SUSTIT:      { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio' },
};

export const semanas: Semana[] = [
  // ─── SEMANA 1 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '04 – 08 may',
    actividades: [
      {
        id: 'exc-clase-1-histo',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'Clase 1 — Histología del Aparato Excretor',
        fecha: 'Lun 04 may',
        hora: '07:00–09:00',
        subtemas: ['Histología del riñón', 'Corpúsculo renal', 'Sistema tubular'],
        docentes: ['Dr. S. Portugal'],
      },
      {
        id: 'exc-t1-pared',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'T1 — Anatomía: Pared posterior del abdomen · Espacio Retroperitoneal',
        fecha: 'Lun 04 may',
        hora: '11:00–13:00',
        subtemas: ['Pared abdominal posterior', 'Espacio retroperitoneal'],
        docentes: ['Dr. B. Fernandini'],
      },
      {
        id: 'exc-p1-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_2',
        titulo: 'P1 — Lab Anatomía: Pared abdominal posterior · Retroperitoneal',
        fecha: '04–06 may (virtual) · B: Jue 07, A: Vie 08 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Pared abdominal posterior', 'Espacio retroperitoneal'],
        docentes: ['Profesores de anatomía'],
        nota: 'Aula virtual Lun–Mié 14–18h. Anfiteatro: B1/B2 Jue 14–16h, B3/B4 Jue 16–18h, A1/A2 Vie 14–16h, A3/A4 Vie 16–18h.',
      },
      {
        id: 'exc-histo-lab-1',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_1',
        titulo: 'Lab Histología — Histología Renal (1ª sesión)',
        fecha: 'A1-A2: Mar 05 · A3-A4: Mié 06 · B1-B2: Jue 07 · B3-B4: Vie 08 may',
        hora: '08:00–10:00',
        subtemas: ['Histología Renal'],
        docentes: ['Profesores de histología'],
        nota: 'Evaluación Blackboard al término de esta sesión.',
      },
      {
        id: 'exc-tbl-1',
        tipo: 'TBL',
        unidad: 'UNIDAD_1',
        titulo: 'TBL 1 — Líquidos corporales y función glomerular',
        fecha: 'Mié 06 may',
        hora: '07:00–09:00',
        subtemas: ['Líquidos corporales', 'Función glomerular', 'Filtración glomerular'],
        docentes: ['Dr. J. García', 'Dr. H. Pérez', 'Dra. J. Bernuy'],
      },
      {
        id: 'exc-abp-1',
        tipo: 'ABP',
        unidad: 'UNIDAD_1',
        titulo: 'ABP — Semana 1 (formativa)',
        fecha: '04 – 08 may',
        hora: 'Según tutor',
        subtemas: ['Caso introductorio'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Evaluación formativa — sin nota. Grupos de 6–7 alumnos.',
      },
    ],
  },

  // ─── SEMANA 2 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '09 – 15 may',
    actividades: [
      {
        id: 'exc-t2-rinones',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'T2 — Anatomía de los riñones y vías urinarias',
        fecha: 'Sáb 09 may',
        hora: '11:00–13:00',
        subtemas: ['Anatomía renal', 'Uréteres', 'Relaciones topográficas'],
        docentes: ['Dr. B. Fernandini'],
      },
      {
        id: 'exc-clase-2-emb',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'Clase 2 — Embriología del aparato excretor',
        fecha: 'Lun 11 may',
        hora: '07:00–09:00',
        subtemas: ['Pronefros, mesonefros, metanefros', 'Desarrollo del riñón definitivo', 'Malformaciones renales'],
        docentes: ['Dra. A. Díaz'],
      },
      {
        id: 'exc-paso-corto-1',
        tipo: 'PASO-CORTO',
        unidad: 'EVALUACION',
        titulo: '⚡ Paso corto N°1 de Anatomía — T1 y T2',
        fecha: 'Lun 11 may',
        hora: '11:00',
        subtemas: ['T1: Pared posterior abdomen', 'T2: Riñones y vías urinarias'],
        docentes: [],
        nota: 'Calificado · contribuye al 25% del rubro desempeño en anatomía.',
      },
      {
        id: 'exc-t3-vejiga',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'T3 — Anatomía de la vejiga urinaria y la uretra',
        fecha: 'Lun 11 may',
        hora: '11:00–13:00',
        subtemas: ['Vejiga urinaria', 'Uretra masculina y femenina', 'Relaciones anatómicas'],
        docentes: ['Dr. M. De La Cruz'],
      },
      {
        id: 'exc-tbl-2',
        tipo: 'TBL',
        unidad: 'UNIDAD_1',
        titulo: 'TBL 2 — Túbulo Proximal',
        fecha: 'Mié 13 may',
        hora: '07:00–09:00',
        subtemas: ['Reabsorción en el túbulo proximal', 'Cotransportadores', 'Secreción tubular'],
        docentes: ['Dr. J. García', 'Dr. H. Pérez', 'Dra. J. Bernuy'],
      },
      {
        id: 'exc-p2-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_2',
        titulo: 'P2 — Lab Anatomía: Riñones · Uréteres · Vejiga · Uretra · Suprarrenal',
        fecha: '11–14 may (virtual) · B: Lun 11, A: Mar 12 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Riñones', 'Uréteres', 'Vejiga', 'Uretra', 'Glándula suprarrenal'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'exc-histo-lab-2',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_1',
        titulo: 'Lab Histología — Histología Renal (2ª sesión)',
        fecha: 'A1-A2: Mar 12 · A3-A4: Mié 13 · B1-B2: Jue 14 · B3-B4: Vie 15 may',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Histología Renal (continuación)'],
        docentes: ['Profesores de histología'],
        nota: 'Evaluación Blackboard al término de esta sesión.',
      },
      {
        id: 'exc-clase-3-regna',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        titulo: 'Regulación de la excreción de sodio y agua',
        fecha: 'Vie 15 may',
        hora: '07:00–09:00',
        subtemas: ['Mecanismos de reabsorción de sodio', 'Regulación del balance hídrico', 'ADH y aldosterona'],
        docentes: ['Dr. L. Estremadoyro'],
      },
      {
        id: 'exc-exam-anat-1',
        tipo: 'EXAM-ANAT',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Práctico de Anatomía N°1',
        fecha: 'Vie 15 may',
        hora: '14:00–18:00',
        subtemas: ['Contenido: T1 y T2'],
        docentes: ['Profesores de anatomía'],
        nota: 'Dos evaluaciones prácticas continuas → 62.5% del desempeño en anatomía.',
      },
      {
        id: 'exc-abp-2',
        tipo: 'ABP',
        unidad: 'UNIDAD_1',
        titulo: 'ABP — Semana 2 (1ª evaluación sumativa)',
        fecha: '09 – 15 may',
        hora: 'Según tutor',
        subtemas: ['Caso clínico de fisiopatología renal'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Primera evaluación sumativa. Grupos de 6–7 alumnos.',
      },
    ],
  },

  // ─── SEMANA 3 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '16 – 22 may',
    actividades: [
      {
        id: 'exc-t4-aorta',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'T4 — Anatomía: Aorta abdominal · VCI · Linfáticos · Plexo lumbar · Cadena simpática',
        fecha: 'Sáb 16 may',
        hora: '11:00–13:00',
        subtemas: ['Aorta abdominal', 'Vena cava inferior', 'Linfáticos retroperitoneales', 'Plexo lumbar', 'Cadena simpática'],
        docentes: ['Dr. M. De La Cruz'],
      },
      {
        id: 'exc-clase-3-calc',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        titulo: 'Clase 3 — Metabolismo del calcio y fósforo',
        fecha: 'Lun 18 may',
        hora: '07:00–09:00',
        subtemas: ['Homeostasis del calcio', 'Homeostasis del fósforo', 'PTH, calcitonina, vitamina D'],
        docentes: ['Dr. L. Estremadoyro'],
      },
      {
        id: 'exc-paso-corto-2',
        tipo: 'PASO-CORTO',
        unidad: 'EVALUACION',
        titulo: '⚡ Paso corto N°2 de Anatomía — T3 y T4',
        fecha: 'Lun 18 may',
        hora: '11:00',
        subtemas: ['T3: Vejiga y uretra', 'T4: Aorta abdominal, VCI, linfáticos, plexo lumbar'],
        docentes: [],
        nota: 'Calificado · contribuye al 25% del rubro desempeño en anatomía.',
      },
      {
        id: 'exc-tbl-3',
        tipo: 'TBL',
        unidad: 'UNIDAD_3',
        titulo: 'TBL 3 — Asa de Henle',
        fecha: 'Mié 20 may',
        hora: '07:00–09:00',
        subtemas: ['Asa de Henle', 'Mecanismo contracorriente', 'Gradiente medular'],
        docentes: ['Dr. J. García', 'Dr. H. Pérez', 'Dra. J. Bernuy'],
        resumen: { tipo: 'pdf' },
        examen: { key: 'excretor/tbl-3-asa-henle', free: true },
      },
      {
        id: 'exc-p3-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_2',
        titulo: 'P3 — Lab Anatomía: Vejiga · Uretra · Vasos y nervios pared posterior ⚠️ con evaluación',
        fecha: '18–21 may (virtual) · B: Lun 18, A: Mar 19 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Vejiga urinaria', 'Uretra', 'Vasos y nervios de la pared posterior abdominal'],
        docentes: ['Profesores de anatomía'],
        nota: 'Aula virtual incluye evaluación.',
      },
      {
        id: 'exc-p4-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_2',
        titulo: 'P4 — Lab Anatomía: Aorta abdominal · Vena cava · Linfáticos · Plexo lumbar · Cadena simpática',
        fecha: 'B: Jue 21 may · A: Vie 22 may',
        hora: '14:00–18:00',
        subtemas: ['Aorta abdominal', 'Vena cava inferior', 'Linfáticos', 'Plexo lumbar', 'Cadena simpática'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'exc-histo-lab-3',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_1',
        titulo: 'Lab Histología — Uréter y vejiga',
        fecha: 'A1-A2: Mar 19 · A3-A4: Mié 20 · B1-B2: Jue 21 · B3-B4: Vie 22 may',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Histología de uréter', 'Histología de vejiga urinaria'],
        docentes: ['Profesores de histología'],
      },
      {
        id: 'exc-clase-4-acido',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        titulo: 'Clase 4 — Equilibrio ácido-base',
        fecha: 'Vie 22 may',
        hora: '07:00–09:00',
        subtemas: ['Sistemas buffer', 'Regulación renal del pH', 'Acidosis y alcalosis', 'Gasometría arterial'],
        docentes: ['Dr. C. León'],
      },
      {
        id: 'exc-abp-3',
        tipo: 'ABP',
        unidad: 'UNIDAD_3',
        titulo: 'ABP — Semana 3 (2ª evaluación sumativa)',
        fecha: '16 – 22 may',
        hora: 'Según tutor',
        subtemas: ['Caso clínico de trastornos ácido-base'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Segunda evaluación sumativa. Grupos de 6–7 alumnos.',
      },
    ],
  },

  // ─── SEMANA 4 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '25 – 30 may',
    actividades: [
      {
        id: 'exc-clase-5-diuresis',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        titulo: 'Clase 5 — Diuresis y antidiuresis · Mecanismos de interacción farmacológica',
        fecha: 'Lun 25 may',
        hora: '07:00–09:00',
        subtemas: ['Mecanismos de concentración urinaria', 'Diuréticos y su mecanismo de acción', 'Interacciones farmacológicas'],
        docentes: ['Dr. L. Estremadoyro'],
      },
      {
        id: 'exc-clase-6-nefrotox',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        titulo: 'Clase 6 — Nefrotoxicidad de fármacos de uso frecuente',
        fecha: 'Lun 25 may',
        hora: '10:00–12:00',
        subtemas: ['Fármacos nefrotóxicos', 'Mecanismos de daño renal', 'AINE, aminoglucósidos, contrastes yodados'],
        docentes: ['Dr. H. Pérez'],
      },
      {
        id: 'exc-exam-anat-2',
        tipo: 'EXAM-ANAT',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Práctico de Anatomía N°2',
        fecha: 'Lun 25 may',
        hora: '14:00–16:00',
        subtemas: ['Contenido: T3 y T4'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'exc-tbl-4',
        tipo: 'TBL',
        unidad: 'UNIDAD_3',
        titulo: 'TBL 4 — Túbulo Distal',
        fecha: 'Mié 27 may',
        hora: '07:00–09:00',
        subtemas: ['Túbulo contorneado distal', 'Conducto colector', 'Regulación hormonal'],
        docentes: ['Dr. J. García', 'Dr. H. Pérez', 'Dra. J. Bernuy'],
      },
      {
        id: 'exc-clase-7-potasio',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        titulo: 'Clase 7 — Regulación del balance de potasio y magnesio',
        fecha: 'Vie 29 may',
        hora: '07:00–09:00',
        subtemas: ['Homeostasis del potasio', 'Homeostasis del magnesio', 'Hiper e hipopotasemia'],
        docentes: ['Dra. J. Bernuy'],
      },
      {
        id: 'exc-histo-lab-repaso',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_1',
        titulo: 'Lab Histología — Repaso general',
        fecha: 'A1-A2: Mar 26 · A3-A4: Mié 27 · B1-B2: Jue 28 · B3-B4: Vie 29 may',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Repaso general de histología del aparato excretor'],
        docentes: ['Profesores de histología'],
        nota: 'El proyecto final de histología se presenta en esta sesión.',
      },
      {
        id: 'exc-exam-final',
        tipo: 'EXAM-FINAL',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Teórico Final — Aparato Excretor',
        fecha: 'Sáb 30 may',
        hora: '07:00–10:00',
        subtemas: ['85% del rubro conocimiento'],
        docentes: [],
      },
      {
        id: 'exc-abp-4',
        tipo: 'ABP',
        unidad: 'UNIDAD_4',
        titulo: 'ABP — Semana 4 (3ª evaluación sumativa)',
        fecha: '25 – 30 may',
        hora: 'Según tutor',
        subtemas: ['Caso clínico de aplicación clínica renal'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Tercera y última evaluación sumativa. Grupos de 6–7 alumnos.',
      },
    ],
  },

  // ─── CIERRE ────────────────────────────────────────────────────────────────
  {
    id: 'cierre',
    titulo: 'Cierre',
    fechas: '06 jun',
    esEvaluacion: true,
    actividades: [
      {
        id: 'exc-sustit',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen sustitutorio y rezagados',
        fecha: 'Sáb 06 jun',
        hora: '08:00',
        subtemas: [
          'Sustituye solo la calificación original',
          'Nota máxima: 11.00',
          'Sin derecho: quienes con 11 no alcancen promedio aprobatorio',
          'Reprobados por inasistencia no tienen sustitutorio',
        ],
        docentes: [],
      },
    ],
  },
];

export const curso = {
  nombre: 'Aparato Excretor',
  codigo: 'M1554',
  carrera: 'Medicina · 3er Año I · UPCH',
  coordinadora: 'Dr. J.J. García · Dra. J. Bernuy · Dra. S. Alva · Dr. M. De La Cruz',
  duracion: '04 may – 30 may 2026',
  creditos: '5 créditos · 32h teóricas + 96h prácticas',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
