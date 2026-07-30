export type TipoActividad =
  | 'MAGISTRAL'
  | 'INVERTIDA'
  | 'TBL'
  | 'SGP'
  | 'HISTOLOGIA'
  | 'ANATOMIA'
  | 'TALLER'
  | 'REPASO'
  | 'EXAMEN-P'
  | 'EXAMEN-T';

export type Unidad =
  | 'ENDOCRINA'
  | 'METABOLISMO'
  | 'ESTRES'
  | 'REPRODUCTOR'
  | 'ANATOMIA'
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
  /**
   * Módulo interactivo de la práctica. En las actividades de práctica la tarjeta
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
  ENDOCRINA:   '#C9A227',
  METABOLISMO: '#3b9edd',
  ESTRES:      '#EF6C4D',
  REPRODUCTOR: '#E879A6',
  ANATOMIA:    '#34C778',
  EVALUACION:  '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',   color: '#3b9edd', label: 'Magistral'  },
  INVERTIDA:  { bg: 'rgba(20,184,166,0.15)',   color: '#14B8A6', label: 'Invertida'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',   color: '#F5A623', label: 'TBL'        },
  SGP:        { bg: 'rgba(155,142,248,0.15)',  color: '#9B8EF8', label: 'SGP'        },
  HISTOLOGIA: { bg: 'rgba(232,121,166,0.15)',  color: '#E879A6', label: 'Histología' },
  ANATOMIA:   { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Anatomía'   },
  TALLER:     { bg: 'rgba(249,115,22,0.15)',   color: '#F97316', label: 'Taller'     },
  REPASO:     { bg: 'rgba(148,163,184,0.16)',  color: '#94A3B8', label: 'Repaso'     },
  'EXAMEN-P': { bg: 'rgba(239,68,68,0.12)',    color: '#F87171', label: 'Examen P'   },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',    color: '#F87171', label: 'Examen T'   },
};

/**
 * Línea de tiempo canónica. El cronograma del sílabo repite cada práctica para
 * los subgrupos A1–A4 / B1–B4 (histología) y las mesas de anatomía (misma
 * sesión, distinto horario, aula y docente). Aquí se guarda una sola entrada
 * por contenido.
 */
export const semanas: Semana[] = [
  // ─── SEMANA 1 — PRINCIPIOS ENDOCRINOS E HIPÓFISIS ──────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Principios endocrinos e hipófisis',
    fechas: '23 – 29 nov',
    actividades: [
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'ENDOCRINA',
        titulo: 'Histología de glándulas endocrinas',
        fecha: '23 nov',
        hora: '10:00–12:00',
        subtemas: ['Hipófisis', 'Tiroides y paratiroides', 'Suprarrenal', 'Páncreas endocrino'],
        docentes: ['Dr. José Velásquez'],
        nota: 'Clase teórica virtual.',
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T1 — Introducción a la anatomía del sistema endocrino',
        fecha: '24 nov',
        hora: '09:00–11:00',
        subtemas: ['Glándula tiroides', 'Páncreas', 'Glándula suprarrenal', 'Glándulas paratiroides'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'bienvenida',
        tipo: 'MAGISTRAL',
        unidad: 'ENDOCRINA',
        titulo: 'Bienvenida al curso',
        fecha: '24 nov',
        hora: '11:00–11:15',
        subtemas: ['Presentación del curso', 'Metodología y sistema de evaluación'],
        docentes: ['Dr. Víctor Noriega'],
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'ENDOCRINA',
        titulo: 'Introducción a la endocrinología',
        fecha: '24 nov',
        hora: '11:15–13:00',
        subtemas: [
          'Hormona, neurotransmisor, célula blanco y receptor',
          'Sistema endocrino, paracrino y autocrino',
          'Clasificación de hormonas: péptidos, esteroides y aminas',
          'Receptores de membrana e intracelulares',
          'Retroalimentación negativa y positiva',
          'Disruptores endocrinos',
        ],
        docentes: ['Dr. Sandro Corigliano'],
      },
      {
        id: 'clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T2 — Pelvis ósea e irrigación de la pelvis',
        fecha: '24 nov (grupo A) · 26 nov (grupo B)',
        hora: '14:00–16:00',
        subtemas: ['Pelvis ósea', 'Irrigación de la pelvis'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'anat-1',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 1 — Introducción al sistema endocrino',
        fecha: '24 – 25 nov · según grupo',
        hora: '14:00–18:00',
        subtemas: [
          'Disección: tiroides, páncreas y suprarrenal',
          'Aula virtual 1: anatomía de cuello, tiroides e irrigación de pelvis',
        ],
        docentes: ['Profesores de Anatomía'],
        nota: 'La misma práctica se repite por grupos y mesas. Revisa tu subgrupo en el cronograma oficial.',
      },
      {
        id: 'laminas-1',
        tipo: 'HISTOLOGIA',
        unidad: 'ENDOCRINA',
        titulo: 'Revisión de láminas 1',
        fecha: '24 nov',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Amparo Coico'],
      },
      {
        id: 'histo-1',
        tipo: 'HISTOLOGIA',
        unidad: 'ENDOCRINA',
        titulo: 'Práctica de Histología 1 — Glándulas endocrinas',
        fecha: '25 – 28 nov · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Hipófisis', 'Tiroides y paratiroides', 'Suprarrenal', 'Islotes de Langerhans'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        nota: 'Evaluación: 70% pasos cortos (Kahoot) + 30% presentación grupal. El promedio vale 30% del desempeño.',
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'ENDOCRINA',
        titulo: 'Regulación hipofisaria',
        fecha: '26 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Embriología, anatomía e histología de la hipófisis',
          'Hormonas adenohipofisarias: crecimiento y prolactina',
          'Hormonas neurohipofisarias: antidiurética y oxitocina',
          'Neuroimágenes de silla turca',
        ],
        docentes: ['Dra. Lourdes Manco'],
      },
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'ENDOCRINA',
        titulo: 'TBL 1 — Hormona antidiurética y neurohipófisis',
        fecha: '26 nov',
        hora: '11:00–13:00',
        subtemas: ['Síntesis y secreción de ADH', 'Osmorregulación', 'Diabetes insípida y SIADH'],
        docentes: ['Dr. Víctor Noriega', 'Dra. Lourdes Manco', 'Dra. Olga Flores', 'Dra. Paola Casas'],
        nota: 'Evaluación: 40% individual + 20% trabajo grupal + 40% problema de aplicación.',
      },
      {
        id: 'anat-2',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 2 — Pelvis ósea e irrigación de la pelvis',
        fecha: '27 – 28 nov · según grupo',
        hora: '14:00–18:00',
        subtemas: ['Disección de la pelvis ósea', 'Vasos pélvicos'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'clase-6',
        tipo: 'INVERTIDA',
        unidad: 'ENDOCRINA',
        titulo: 'Regulación del apetito',
        fecha: '28 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Regulación hipotalámica del apetito',
          'Regulación gastrointestinal y del tejido adiposo',
          'Otras hormonas que regulan el apetito',
          'Obesidad',
          'Fármacos que regulan el apetito',
        ],
        docentes: ['Dra. Lourdes Manco'],
        nota: 'Aula invertida: paso corto al inicio (30%) y al final (70%). Las 3 invertidas valen 10% de conocimientos.',
      },
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'REPRODUCTOR',
        titulo: 'Embriología de glándulas endocrinas',
        fecha: '28 nov',
        hora: '11:00–12:00',
        subtemas: ['Desarrollo de la hipófisis', 'Desarrollo de tiroides y suprarrenal'],
        docentes: ['Dra. Alicia Díaz'],
        nota: 'Clase teórica virtual.',
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'REPRODUCTOR',
        titulo: 'Genética de la diferenciación sexual',
        fecha: '28 nov',
        hora: '12:00–13:00',
        subtemas: ['Determinación sexual', 'Gen SRY', 'Trastornos de la diferenciación sexual'],
        docentes: ['Dra. Alicia Díaz'],
        nota: 'Clase teórica virtual.',
      },
      {
        id: 'paso-1',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Paso corto 1 — Anatomía (temas 1 y 2)',
        fecha: '29 nov',
        fechaISO: '2025-11-29',
        hora: '11:00–11:30',
        subtemas: ['Introducción a la anatomía del sistema endocrino', 'Pelvis ósea e irrigación'],
        docentes: ['Dr. Marcos De La Cruz'],
        nota: 'Los 3 pasos cortos de anatomía valen 10% de la nota de desempeño.',
      },
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T3 — Periné masculino y femenino',
        fecha: '29 nov',
        hora: '11:30–13:00',
        subtemas: ['Periné masculino', 'Periné femenino', 'Diafragma urogenital'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'ENDOCRINA',
        titulo: 'SGP 1',
        fecha: '24 – 29 nov · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
        nota: 'Se califica al finalizar la semana. El promedio de los 4 SGP vale 20% del desempeño.',
      },
    ],
  },

  // ─── SEMANA 2 — REPRODUCTOR MASCULINO Y METABOLISMO ────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — Reproductor masculino y metabolismo',
    fechas: '1 – 6 dic',
    actividades: [
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'REPRODUCTOR',
        titulo: 'Histología del sistema reproductor masculino',
        fecha: '1 dic',
        hora: '07:00–09:00',
        subtemas: ['Testículo y túbulos seminíferos', 'Epidídimo y conducto deferente', 'Próstata'],
        docentes: ['Dra. Shirley Alva'],
      },
      {
        id: 'clase-11',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T4 — Genitales masculinos',
        fecha: '1 dic',
        hora: '11:00–13:00',
        subtemas: [
          'Pene y bolsas escrotales',
          'Testículos y cordón espermático',
          'Próstata y vesículas seminales',
        ],
        docentes: ['Dr. Bruno Fernandini'],
      },
      {
        id: 'anat-3',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 3 — Periné masculino y femenino',
        fecha: '1 – 2 dic · según grupo',
        hora: '14:00–18:00',
        subtemas: [
          'Disección del periné masculino y femenino',
          'Aula virtual 2: periné y genitales masculinos',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-2',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Revisión de láminas 2',
        fecha: '1 dic',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla'],
      },
      {
        id: 'histo-2',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Práctica de Histología 2 — Aparato genital masculino',
        fecha: '2 – 5 dic · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Testículo', 'Epidídimo', 'Conducto deferente', 'Próstata y vesículas seminales'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'clase-12',
        tipo: 'MAGISTRAL',
        unidad: 'METABOLISMO',
        titulo: 'Metabolismo basal',
        fecha: '3 dic',
        hora: '07:00–09:00',
        subtemas: [
          'Embriología e histología de la tiroides',
          'Síntesis, almacenamiento y liberación de hormonas tiroideas',
          'Importancia del yodo',
          'Efectos celulares y metabólicos',
          'Exceso y deficiencia de hormonas tiroideas',
          'Hormonas tiroideas y neurodesarrollo',
        ],
        docentes: ['Dr. Víctor Noriega'],
      },
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'METABOLISMO',
        titulo: 'TBL 2 — Metabolismo del calcio y fósforo',
        fecha: '3 dic',
        hora: '11:00–13:00',
        subtemas: ['Paratohormona', 'Vitamina D', 'Calcitonina', 'Hipo e hipercalcemia'],
        docentes: ['Dr. Víctor Noriega', 'Dra. Lourdes Manco', 'Dra. Gretell Molina', 'Dra. Paola Casas'],
      },
      {
        id: 'anat-4',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 4 — Genitales masculinos',
        fecha: '4 – 5 dic · según grupo',
        hora: '14:00–18:00',
        subtemas: ['Disección de los genitales masculinos'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'clase-13',
        tipo: 'MAGISTRAL',
        unidad: 'METABOLISMO',
        titulo: 'Metabolismo energético',
        fecha: '5 dic',
        hora: '07:00–09:00',
        subtemas: [
          'Páncreas endocrino: embriología e histología',
          'Insulina y glucagón: síntesis, secreción y regulación',
          'Regulación en ayuno y postprandial',
          'Balance de energía',
          'Rangos normales de glucosa en plasma',
        ],
        docentes: ['Dra. Gretell Molina'],
      },
      {
        id: 'clase-14',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Radiología normal de órganos endocrinos',
        fecha: '5 dic',
        hora: '11:00–13:00',
        subtemas: ['Imagen de tiroides', 'Imagen de suprarrenales', 'Imagen de la silla turca'],
        docentes: ['Dr. César Ramírez'],
      },
      {
        id: 'paso-2',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Paso corto 2 — Anatomía (temas 3 y 4)',
        fecha: '6 dic',
        fechaISO: '2025-12-06',
        hora: '11:00–11:30',
        subtemas: ['Periné masculino y femenino', 'Genitales masculinos'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'clase-15',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T5 — Genitales femeninos',
        fecha: '6 dic',
        hora: '11:30–13:00',
        subtemas: ['Genitales externos', 'Genitales internos', 'Útero y vagina'],
        docentes: ['Dr. Bruno Fernandini'],
      },
      {
        id: 'clase-16',
        tipo: 'MAGISTRAL',
        unidad: 'REPRODUCTOR',
        titulo: 'Histología del aparato reproductor femenino',
        fecha: '6 dic',
        hora: '16:00–18:00',
        subtemas: ['Ovario y folículos', 'Trompa uterina', 'Útero y endometrio', 'Vagina'],
        docentes: ['Dra. Yessenia Salas'],
        nota: 'Clase teórica virtual.',
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'REPRODUCTOR',
        titulo: 'SGP 2',
        fecha: '1 – 6 dic · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── SEMANA 3 — REPRODUCTOR FEMENINO Y RESPUESTA AL ESTRÉS ─────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Reproductor femenino y respuesta al estrés',
    fechas: '8 – 13 dic',
    actividades: [
      {
        id: 'laminas-3',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Revisión de láminas 3',
        fecha: '8 dic',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Shirley Alva'],
      },
      {
        id: 'histo-3',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Práctica de Histología 3 — Aparato genital femenino',
        fecha: '9 – 12 dic · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Ovario y folículos ováricos', 'Trompa uterina', 'Endometrio y miometrio', 'Cuello uterino'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        nota: 'El subgrupo A1/A2 la realiza en modalidad virtual (9 dic); en ese caso la nota es 100% presentación grupal.',
      },
      {
        id: 'clase-17',
        tipo: 'MAGISTRAL',
        unidad: 'REPRODUCTOR',
        titulo: 'Fisiología del aparato reproductor femenino',
        fecha: '10 dic',
        hora: '07:00–09:00',
        subtemas: [
          'Oogénesis y folículo ovárico',
          'Papel de FSH, LH, estradiol e inhibina',
          'Ovulación y cuerpo lúteo',
          'Biosíntesis de estrógenos y progestágenos',
          'Ciclo ovárico y menstrual',
        ],
        docentes: ['Dr. Víctor Noriega'],
      },
      {
        id: 'examen-p1',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación práctica 1 de Anatomía',
        fecha: '10 dic',
        fechaISO: '2025-12-10',
        hora: '14:00–18:00',
        subtemas: ['Cubre sistema endocrino, pelvis ósea, periné y genitales masculinos'],
        docentes: ['Profesores de Anatomía'],
        nota: 'Las evaluaciones prácticas continuas valen 30% de la nota de anatomía (40% del desempeño).',
      },
      {
        id: 'anat-5',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 5 — Genitales femeninos',
        fecha: '11 – 12 dic · según grupo',
        hora: '14:00–18:00',
        subtemas: ['Disección de los genitales femeninos', 'Útero y vagina'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'clase-18',
        tipo: 'INVERTIDA',
        unidad: 'ESTRES',
        titulo: 'Respuesta endocrina al estrés 1 — Médula adrenal',
        fecha: '12 dic',
        hora: '07:00–09:00',
        subtemas: [
          'Biosíntesis y metabolismo de catecolaminas',
          'Acciones biológicas y órganos blanco',
          'Receptores alfa y beta',
          'Exceso de secreción de catecolaminas',
        ],
        docentes: ['Dr. Rubén Cruz'],
        nota: 'Aula invertida: paso corto al inicio (30%) y al final (70%). Las 3 invertidas valen 10% de conocimientos.',
      },
      {
        id: 'clase-19',
        tipo: 'MAGISTRAL',
        unidad: 'ESTRES',
        titulo: 'Respuesta endocrina al estrés 2 — Corteza adrenal',
        fecha: '12 dic',
        hora: '11:00–13:00',
        subtemas: [
          'Embriología e histología de la glándula adrenal',
          'Anatomía funcional y hormonas de cada zona',
          'Síntesis y liberación de hormonas adrenocorticales',
          'Ritmo circadiano de la secreción',
          'Exceso y deficiencia: consecuencias',
        ],
        docentes: ['Dr. Rubén Cruz'],
      },
      {
        id: 'clase-20',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'T6 — Peritoneo pelviano, recto-ano y plexo sacro',
        fecha: '13 dic',
        hora: '11:00–13:00',
        subtemas: [
          'Fondos de saco y relaciones peritoneales',
          'Espacio subperitoneal y láminas de Ombredanne',
          'Recto pelviano y conducto anal',
          'Plexo sacro',
        ],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'ESTRES',
        titulo: 'SGP 3',
        fecha: '8 – 13 dic · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── SEMANA 4 — REPRODUCTOR MASCULINO, ANTROPOMETRÍA Y REPASO ──────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4 — Integración, antropometría y repaso',
    fechas: '15 – 19 dic',
    actividades: [
      {
        id: 'clase-21',
        tipo: 'INVERTIDA',
        unidad: 'REPRODUCTOR',
        titulo: 'Fisiología del aparato reproductor masculino',
        fecha: '15 dic',
        hora: '07:00–09:00',
        subtemas: [
          'Regulación endocrina de la función testicular (GnRH, FSH, LH, testosterona, inhibina)',
          'Órganos blanco de la testosterona',
          'Mecanismo de acción celular de la testosterona',
          'Control neuroendocrino y vascular de la erección y eyaculación',
        ],
        docentes: ['Dr. Víctor Noriega'],
        nota: 'Aula invertida: paso corto al inicio (30%) y al final (70%). Las 3 invertidas valen 10% de conocimientos.',
      },
      {
        id: 'paso-3',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Paso corto 3 — Anatomía (temas 5 y 6)',
        fecha: '15 dic',
        fechaISO: '2025-12-15',
        hora: '11:00–11:30',
        subtemas: ['Genitales femeninos', 'Peritoneo pelviano, recto-ano y plexo sacro'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'repaso-teorico',
        tipo: 'REPASO',
        unidad: 'ANATOMIA',
        titulo: 'Repaso teórico de Anatomía',
        fecha: '15 dic',
        hora: '11:30–13:00',
        subtemas: ['Integración de las 6 unidades temáticas de anatomía'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'anat-6',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 6 — Peritoneo pelviano, recto-ano y plexo sacro',
        fecha: '15 – 16 dic · según grupo',
        hora: '14:00–18:00',
        subtemas: [
          'Disección del peritoneo pelviano',
          'Recto y conducto anal',
          'Aula virtual 3: genitales femeninos, recto y plexo sacro',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-4',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Revisión de láminas 4',
        fecha: '15 dic',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de todas las láminas del curso'],
        docentes: ['Dra. Mónica Calisaya'],
      },
      {
        id: 'histo-4',
        tipo: 'HISTOLOGIA',
        unidad: 'REPRODUCTOR',
        titulo: 'Práctica de Histología 4 — Repaso',
        fecha: '16 – 19 dic · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Repaso integrador de todas las láminas del curso'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'taller-antropometria',
        tipo: 'TALLER',
        unidad: 'METABOLISMO',
        titulo: 'Taller de Antropometría',
        fecha: '17 dic · según subgrupo',
        hora: '07:00–13:00',
        subtemas: [
          'Medición de peso, talla y circunferencias corporales',
          'Cálculo de IMC y relación cintura-talla',
          'Identificación de sobrepeso y obesidad',
          'Distribución de grasa corporal y riesgo metabólico',
        ],
        docentes: ['Dr. Víctor Noriega', 'Dr. Rubén Cruz'],
        nota: 'Actividad obligatoria y calificada. Vale 10% de la nota de desempeño.',
      },
      {
        id: 'repaso-anat-p',
        tipo: 'REPASO',
        unidad: 'ANATOMIA',
        titulo: 'Repaso de Anatomía en anfiteatro',
        fecha: '18 dic',
        hora: '14:00–18:00',
        subtemas: ['Repaso práctico sobre cadáver'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'examen-p2',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación práctica 2 de Anatomía',
        fecha: '19 dic',
        fechaISO: '2025-12-19',
        hora: '14:00–18:00',
        subtemas: ['Cubre genitales femeninos, peritoneo pelviano, recto-ano y plexo sacro'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'sgp-4',
        tipo: 'SGP',
        unidad: 'REPRODUCTOR',
        titulo: 'SGP 4',
        fecha: '15 – 19 dic · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ──────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación Final',
    fechas: '20 dic',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Teórico Final',
        fecha: '20 dic',
        fechaISO: '2025-12-20',
        hora: '14:30–17:00',
        subtemas: ['60 preguntas', 'Cubre las 5 unidades del curso', 'Presencial, sesión única'],
        docentes: ['Dr. Víctor Noriega'],
        nota: 'Vale 60% de conocimientos y exige un mínimo de 11.00. El sustitutorio y el rezagado se rinden el 8 de enero en aulas de FAMED (nota máxima 11).',
      },
    ],
  },
];

export const curso = {
  nombre: 'Sistema Endocrino y Reproductor',
  codigo: 'M2061',
  carrera: 'Medicina · UPCH',
  coordinadores: ['Mag. Víctor Noriega', 'Dra. Evelyn Mejía', 'Dr. Marcos De La Cruz', 'Dr. Sabino Portugal'],
  duracion: '24 nov – 20 dic 2025',
  creditos: '4 créditos · 32 h teoría + 64 h práctica',
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
