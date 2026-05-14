export type TipoActividad =
  | 'MAGISTRAL'
  | 'TBL'
  | 'ABP'
  | 'LAB-HISTO'
  | 'LAB-ANAT'
  | 'PASO-CORTO'
  | 'TALLER-FIS'
  | 'EXAM-ANAT'
  | 'EXAM-PARC'
  | 'EXAM-FINAL'
  | 'SUSTIT'
  | 'EFI-GAMES';

export type Unidad =
  | 'UNIDAD_1'
  | 'UNIDAD_2'
  | 'UNIDAD_3'
  | 'UNIDAD_4'
  | 'UNIDAD_5'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
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
  UNIDAD_5:   '#A61D1D',
  EVALUACION: '#444441',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:   { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'    },
  TBL:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'TBL'          },
  ABP:         { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'ABP'          },
  'LAB-HISTO': { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Histo'    },
  'LAB-ANAT':  { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Anat'     },
  'PASO-CORTO':{ bg: 'rgba(239,68,68,0.12)',   color: '#F87171', label: 'Paso corto'   },
  'TALLER-FIS':{ bg: 'rgba(59,158,221,0.20)',  color: '#3b9edd', label: 'Taller Fis'   },
  'EXAM-ANAT': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Anat'  },
  'EXAM-PARC': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Parc'  },
  'EXAM-FINAL':{ bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Final' },
  SUSTIT:      { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio' },
  'EFI-GAMES': { bg: 'rgba(245,166,35,0.20)',  color: '#F5A623', label: 'EFI Games'    },
};

export const semanas: Semana[] = [
  // ─── SEMANA 1 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '30 mar – 05 abr',
    actividades: [
      {
        id: 'cv-emb-1',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'Bienvenida · Embriología 1: Áreas Cardíacas y torsión',
        fecha: 'Lun 30 mar',
        hora: '07:00–09:00',
        subtemas: [
          'Formación de las áreas cardiogénicas y regulación genética',
          'Formación del tubo cardíaco y movimientos de torsión',
        ],
        docentes: ['Dr. Henry Anchante', 'Dra. Díaz Kuan'],
      },
      {
        id: 'cv-t1-mediastino',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'T1 — Mediastino: definición y divisiones',
        fecha: 'Lun 30 mar',
        hora: '11:00–13:00',
        subtemas: [
          'Definición y divisiones del mediastino',
          'Relaciones anatómicas generales',
        ],
        docentes: ['Dr. De la Cruz'],
      },
      {
        id: 'cv-histo-clase',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'Clase 1 — Histología: Aparato Circulatorio',
        fecha: 'Mié 01 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Tipos, subtipos y funciones de cada componente del sistema circulatorio',
          'Las tres túnicas de los componentes del sistema circulatorio',
          'Comparación estructural de los componentes vasculares',
          'Relación estructura–función',
        ],
        docentes: ['Dr. José Velásquez'],
      },
      {
        id: 'cv-p1-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_1',
        titulo: 'P1 — Lab Anatomía: Mediastino (Aula virtual + Anfiteatro)',
        fecha: '30 mar – 01 abr (virtual) · B: Lun 30, A: Mar 31 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Mediastino — definición y divisiones'],
        docentes: ['Profesores de anatomía'],
        nota: 'Aula virtual: Lun–Mié 30 mar–01 abr 14–18h. Anfiteatro: B1/B2 Lun 14–16h, B3/B4 Lun 16–18h, A1/A2 Mar 14–16h, A3/A4 Mar 16–18h.',
      },
      {
        id: 'cv-abp-1',
        tipo: 'ABP',
        unidad: 'UNIDAD_1',
        titulo: 'ABP — Semana 1: Unidad Anatomía del corazón',
        fecha: '30 mar – 05 abr',
        hora: 'Según tutor',
        subtemas: ['Unidad 1: Anatomía del corazón'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Grupos de máx. 5 alumnos. Evaluación sumativa por rúbrica.',
      },
    ],
  },

  // ─── SEMANA 2 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '06 – 12 abr',
    actividades: [
      {
        id: 'cv-emb-2',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_2',
        titulo: 'Clase 2 — Embriología 2: Tabicamiento y malformaciones',
        fecha: 'Lun 06 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Tabicación auricular, ventricular y del tronco cono',
          'Formación del seno venoso y venas cavas',
          'Vasculogénesis y arcos aórticos',
          'Circulación fetal y cambios en el recién nacido',
          'Malformaciones, heterotaxias, defectos de tabicación',
        ],
        docentes: ['Dra. Díaz Kuan'],
      },
      {
        id: 'cv-t2-pericardio',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'T2 — Pericardio · Morfología externa del corazón',
        fecha: 'B: Lun 06 abr · A: Mar 07 abr',
        hora: '11:00–13:00',
        subtemas: [
          'Pericardio fibroso y seroso',
          'Morfología externa del corazón',
          'Relaciones anatómicas',
        ],
        docentes: ['Dr. Fernandini'],
      },
      {
        id: 'cv-clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        titulo: 'Clase 3 — Endotelio, miocito y sarcómero · Músculo cardíaco',
        fecha: 'Mié 08 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Endotelio como unidad funcional',
          'Estructura del miocito y la sarcómera',
          'Fisiología de la contracción del músculo cardíaco',
        ],
        docentes: ['Dr. Félix Medina'],
      },
      {
        id: 'cv-clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_5',
        titulo: 'Clase 4 — Sistema eléctrico · Potencial de acción y ECG',
        fecha: 'Vie 10 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Sistema de generación y conducción del impulso cardíaco',
          'Potencial de acción del nodo sinusal y del miocito',
          'Bases del electrocardiograma',
        ],
        docentes: ['Dr. Henry Anchante'],
      },
      {
        id: 'cv-exam-anat-1',
        tipo: 'EXAM-ANAT',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Práctico de Anatomía N°1',
        fecha: 'Vie 10 abr',
        hora: '14:00–18:00',
        subtemas: ['10 estaciones · 2 preguntas por estación', 'Contenido: T1 y T2'],
        docentes: ['Profesores de anatomía'],
        nota: 'La segunda pregunta solo se califica si la primera es correcta.',
      },
      {
        id: 'cv-p2-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_1',
        titulo: 'P2 — Lab Anatomía: Pericardio · Morfología del corazón',
        fecha: '06–08 abr (virtual) · B: Lun 06, A: Mar 07 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Pericardio', 'Morfología externa e interna del corazón'],
        docentes: ['Profesores de anatomía'],
        nota: 'Repaso libre: Mié 08 abr antes del examen práctico N°1.',
      },
      {
        id: 'cv-histo-lab-1',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_2',
        titulo: 'Lab Histología — Sesión 1: Histología del Corazón',
        fecha: 'GA1-GA2: Mar 07 abr · GA3-GA4: Mié 08 abr · GB1-GB2: Jue 09 abr · GB3-GB4: Vie 10 abr',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Histología del corazón'],
        docentes: ['Dra. Ysabel Coico', 'Dra. Mery Revilla', 'Dra. Melisa Velarde', 'Dra. Shirley Alva'],
        nota: 'Evaluación: 5 preguntas al término de la sesión. Repaso virtual: Lun 06 abr 20–21h.',
      },
      {
        id: 'cv-abp-2',
        tipo: 'ABP',
        unidad: 'UNIDAD_2',
        titulo: 'ABP — Semana 2: Embriología e Histología',
        fecha: '06 – 12 abr',
        hora: 'Según tutor',
        subtemas: ['Unidad 2: Embriología e Histología'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Grupos de máx. 5 alumnos. Evaluación sumativa por rúbrica.',
      },
    ],
  },

  // ─── SEMANA 3 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '13 – 19 abr',
    actividades: [
      {
        id: 'cv-t3-morfologia',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'T3 — Morfología interna del corazón',
        fecha: 'A: Mié 08 abr · B: Jue 09 abr',
        hora: '11:00–13:00',
        subtemas: [
          'Morfología interna de aurículas y ventrículos',
          'Aparato valvular',
          'Sistema de conducción intracardiaco',
        ],
        docentes: ['Dr. Fernandini'],
      },
      {
        id: 'cv-clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_3',
        titulo: 'Clase 5 — Ciclo cardíaco · Curvas presión-volumen',
        fecha: 'Lun 13 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Fases del ciclo cardíaco',
          'Curvas presión-volumen normales y en patologías cardíacas',
          'Expresión mecánica de la fisiología cardíaca',
        ],
        docentes: ['Dr. Arnold Zárate'],
      },
      {
        id: 'cv-paso-corto-1',
        tipo: 'PASO-CORTO',
        unidad: 'EVALUACION',
        titulo: '⚡ Paso corto N°1 de Anatomía — T1 y T2',
        fecha: 'Lun 13 abr',
        hora: '11:00',
        subtemas: ['T1: Mediastino', 'T2: Pericardio y morfología externa'],
        docentes: [],
        nota: 'Calificado · contribuye al 10% del rubro desempeño en anatomía.',
      },
      {
        id: 'cv-tbl-1',
        tipo: 'TBL',
        unidad: 'UNIDAD_4',
        titulo: 'TBL 1 — Circulación sistémica y coronaria',
        fecha: 'Mié 15 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Fisiología de la circulación sistémica',
          'Fisiología de la circulación coronaria',
        ],
        docentes: ['Dr. Anchante', 'Dr. Durand', 'Dra. Inquilla', 'Dr. W. Quispe', 'Dr. D. Espinoza', 'Dr. Arévalo'],
        nota: 'Evaluación individual 60% + trabajo grupal 40%. Duración 120 min. Material en Blackboard®.',
      },
      {
        id: 'cv-clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_5',
        titulo: 'Clase 6 — Interpretación de ECG normal y patológico',
        fecha: 'Vie 17 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Principios básicos de lectura electrocardiográfica',
          'ECG normal: ritmo, frecuencia, eje, ondas, intervalos',
          'Reconocimiento de alteraciones patológicas frecuentes',
        ],
        docentes: ['Dr. Percy Durand'],
      },
      {
        id: 'cv-paso-corto-2',
        tipo: 'PASO-CORTO',
        unidad: 'EVALUACION',
        titulo: '⚡ Paso corto N°2 de Anatomía — T3 y T4',
        fecha: 'Sáb 18 abr',
        hora: '11:00',
        subtemas: ['T3: Morfología interna del corazón', 'T4: Mediastino posterior'],
        docentes: [],
        nota: 'Calificado · contribuye al 10% del rubro desempeño en anatomía.',
      },
      {
        id: 'cv-exam-parc',
        tipo: 'EXAM-PARC',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Teórico Parcial',
        fecha: 'Sáb 18 abr',
        hora: '—',
        subtemas: ['40 preguntas de opción múltiple', '30% del rubro conocimientos'],
        docentes: [],
      },
      {
        id: 'cv-p3-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_1',
        titulo: 'P3 — Lab Anatomía: Morfología interna del corazón',
        fecha: '13–15 abr (virtual) · B: Lun 13, A: Mar 14 / Jue 17 (anfiteatro)',
        hora: '14:00–18:00',
        subtemas: ['Morfología interna del corazón'],
        docentes: ['Profesores de anatomía'],
        nota: 'Aula virtual 13–15 abr incluye evaluación AV3 (Mediastino posterior).',
      },
      {
        id: 'cv-t4-mediastino-post',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_1',
        titulo: 'T4 — Mediastino posterior',
        fecha: 'A: Lun 13 abr · B: Jue 16 abr',
        hora: '11:00–13:00',
        subtemas: ['Mediastino posterior', 'Esófago, aorta torácica, vena ácigos, conducto torácico'],
        docentes: ['Dr. De la Cruz'],
      },
      {
        id: 'cv-p4-anat',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_1',
        titulo: 'P4 — Lab Anatomía: Mediastino posterior (Anfiteatro)',
        fecha: 'B: Jue 17 abr · A: Vie 17 abr',
        hora: '14:00–18:00',
        subtemas: ['Mediastino posterior'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'cv-histo-lab-2',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_2',
        titulo: 'Lab Histología — Sesión 2: Vasos sanguíneos y linfáticos',
        fecha: 'GA1-GA2: Mar 14 abr · GA3-GA4: Mié 15 abr · GB1-GB2: Jue 16 abr · GB3-GB4: Vie 17 abr',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Histología de vasos sanguíneos y linfáticos'],
        docentes: ['Dra. Ysabel Coico', 'Dra. Melisa Velarde', 'Dr. Sabino Portugal', 'Dra. Shirley Alva'],
        nota: 'Evaluación: 5 preguntas al término de la sesión. Repaso virtual: Lun 13 abr 20–21h.',
      },
      {
        id: 'cv-abp-3',
        tipo: 'ABP',
        unidad: 'UNIDAD_3',
        titulo: 'ABP — Semana 3: Músculo cardíaco y ciclo',
        fecha: '13 – 19 abr',
        hora: 'Según tutor',
        subtemas: ['Unidad 3: Endotelio, músculo cardíaco y ciclo cardíaco'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Grupos de máx. 5 alumnos. Evaluación sumativa por rúbrica.',
      },
    ],
  },

  // ─── SEMANA 4 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '20 – 26 abr',
    actividades: [
      {
        id: 'cv-taller-fis',
        tipo: 'TALLER-FIS',
        unidad: 'UNIDAD_4',
        titulo: 'Taller de Fisiología — Presión Arterial · Gasto Cardíaco · ECG',
        fecha: 'Lun 20 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Casos de aplicación clínica',
          'Medición de presión arterial',
          'Cálculo de gasto cardíaco y fracción de eyección',
          'Toma e interpretación de electrocardiograma',
        ],
        docentes: ['Dr. Henry Anchante'],
        nota: '⚡ Evaluación sumativa al inicio: 10 preguntas (Blackboard®). Corresponde al 10% del rubro de desempeño.',
      },
      {
        id: 'cv-tbl-2',
        tipo: 'TBL',
        unidad: 'UNIDAD_4',
        titulo: 'TBL 2 — Edema agudo de pulmón',
        fecha: 'Mié 22 abr',
        hora: '07:00–09:00',
        subtemas: ['Edema agudo de pulmón', 'Fisiopatología y manejo'],
        docentes: ['Dr. Anchante', 'Dr. Durand', 'Dra. Inquilla', 'Dr. W. Quispe', 'Dr. D. Espinoza', 'Dr. Arévalo'],
        nota: 'Evaluación individual 60% + trabajo grupal 40%.',
      },
      {
        id: 'cv-clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_4',
        titulo: 'Clase 7 — Regulación de la FC y Presión Arterial · Ejercicio',
        fecha: 'Vie 24 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Mecanismos de regulación a corto y largo plazo de la presión arterial',
          'Presión arterial central y periférica',
          'Regulación de la frecuencia cardíaca',
          'Fisiología del ejercicio cardiovascular',
        ],
        docentes: ['Dr. Félix Medina'],
      },
      {
        id: 'cv-efi-games',
        tipo: 'EFI-GAMES',
        unidad: 'EVALUACION',
        titulo: 'EFI Games / Anatomy Games',
        fecha: 'B: Lun 20 abr · A: Mar 21 abr',
        hora: '11:00–13:00 y 14:00–18:00',
        subtemas: ['Round teórico de anatomía'],
        docentes: [],
      },
      {
        id: 'cv-histo-lab-3',
        tipo: 'LAB-HISTO',
        unidad: 'UNIDAD_2',
        titulo: 'Lab Histología — Sesión 3: Presentación de Portafolio',
        fecha: 'GA1-GA2: Mar 21 abr · GA3-GA4: Mié 22 abr · GB1-GB2: Jue 23 abr · GB3-GB4: Vie 24 abr',
        hora: '08:00–10:00 / 09:00–11:00',
        subtemas: ['Presentación de portafolio final'],
        docentes: ['Dra. Ysabel Coico', 'Dra. Melisa Velarde', 'Dr. Sabino Portugal'],
        nota: 'Rúbrica 20 pts: Morfología (6) · Integración Morfología-Función (5) · Targets terapéuticos (3) · Integración y síntesis (4) · Actitudinal (2). Repaso virtual: Lun 20 abr 20–21h.',
      },
      {
        id: 'cv-abp-4',
        tipo: 'ABP',
        unidad: 'UNIDAD_4',
        titulo: 'ABP — Semana 4: Circulación y presión arterial',
        fecha: '20 – 26 abr',
        hora: 'Según tutor',
        subtemas: ['Unidad 4: Circulación sistémica y regulación de presión arterial'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Grupos de máx. 5 alumnos. Evaluación sumativa por rúbrica.',
      },
    ],
  },

  // ─── SEMANA 5 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-5',
    titulo: 'Semana 5',
    fechas: '27 abr – 02 may',
    actividades: [
      {
        id: 'cv-clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_5',
        titulo: 'Clase 8 — ECG en arritmias cardíacas',
        fecha: 'Lun 27 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Identificación de arritmias en el trazado electrocardiográfico',
          'Criterios de interpretación en patologías eléctricas frecuentes',
        ],
        docentes: ['Dr. Henry Anchante'],
      },
      {
        id: 'cv-exam-anat-2',
        tipo: 'EXAM-ANAT',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Práctico de Anatomía N°2',
        fecha: 'Lun 27 abr',
        hora: '14:00–18:00',
        subtemas: ['10 estaciones · 2 preguntas por estación', 'Contenido: T3 y T4'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'cv-clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'UNIDAD_5',
        titulo: 'Clase 9 — Exploración del sistema cardiovascular',
        fecha: 'Mié 29 abr',
        hora: '07:00–09:00',
        subtemas: [
          'Ecocardiografía',
          'Prueba de esfuerzo',
          'Monitoreo ambulatorio electrocardiográfico y de presión arterial',
          'Estudios invasivos e imágenes cardíacas',
        ],
        docentes: ['Dr. Martín Salazar'],
      },
      {
        id: 'cv-p5-repaso',
        tipo: 'LAB-ANAT',
        unidad: 'UNIDAD_1',
        titulo: 'P5 — Repaso libre de Anatomía',
        fecha: 'B: Lun 27 abr · A: Mar 28 abr · Ambos: Mié 29 abr',
        hora: '14:00–18:00',
        subtemas: ['Repaso general de contenidos de anatomía'],
        docentes: ['Profesores de anatomía'],
      },
      {
        id: 'cv-exam-final',
        tipo: 'EXAM-FINAL',
        unidad: 'EVALUACION',
        titulo: '🔴 Examen Teórico Final',
        fecha: 'Sáb 02 may',
        hora: '—',
        subtemas: ['60 preguntas de opción múltiple', '60% del rubro conocimientos'],
        docentes: [],
      },
      {
        id: 'cv-abp-5',
        tipo: 'ABP',
        unidad: 'UNIDAD_5',
        titulo: 'ABP — Semana 5: Sistema eléctrico',
        fecha: '27 abr – 02 may',
        hora: 'Según tutor',
        subtemas: ['Unidad 5: Sistema eléctrico cardíaco y métodos exploratorios'],
        docentes: ['Docente facilitador asignado'],
        nota: 'Quinto y último caso. Evaluación sumativa por rúbrica.',
      },
    ],
  },

  // ─── CIERRE ────────────────────────────────────────────────────────────────
  {
    id: 'cierre',
    titulo: 'Cierre',
    fechas: '04 may',
    esEvaluacion: true,
    actividades: [
      {
        id: 'cv-sustit',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen sustitutorio y rezagados',
        fecha: 'Lun 04 may',
        hora: '—',
        subtemas: [
          'Solo para alumnos desaprobados en conocimientos con desempeño aprobado',
          'Sustituye el parcial o final (el más bajo)',
          'Nota máxima: 11.00',
        ],
        docentes: [],
      },
    ],
  },
];

export const curso = {
  nombre: 'Sistema Cardiovascular',
  codigo: 'M1552',
  carrera: 'Medicina · 3er Año I · UPCH',
  coordinadora: 'Dr. Henry Anchante · Dr. Percy Durand',
  duracion: '30 mar – 02 may 2026',
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
