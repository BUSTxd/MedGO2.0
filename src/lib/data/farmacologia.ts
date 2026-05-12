export type TipoActividad =
  | 'MAGISTRAL'
  | 'TALLER'
  | 'TALLER-INT'
  | 'AULA-INV'
  | 'LAB'
  | 'SEMINARIO'
  | 'SGP'
  | 'EXAMEN'
  | 'SUSTIT';

export type Unidad =
  | 'FARMACOCINETICA'
  | 'FARMACODINAMIA'
  | 'SN_VEGETATIVO'
  | 'ANTIBIOTICOS'
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
  FARMACOCINETICA: '#1D5FA6',
  FARMACODINAMIA: '#5A3AA6',
  SN_VEGETATIVO:  '#1A7A4A',
  ANTIBIOTICOS:   '#B35A00',
  EVALUACION:     '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:    { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'  },
  TALLER:       { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Taller'     },
  'TALLER-INT': { bg: 'rgba(125,211,252,0.18)', color: '#38BDF8', label: 'Taller Int.' },
  'AULA-INV':   { bg: 'rgba(20,184,166,0.15)',  color: '#14B8A6', label: 'Aula Inv.'  },
  LAB:          { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab'        },
  SEMINARIO:    { bg: 'rgba(236,72,153,0.15)',  color: '#EC4899', label: 'Seminario'  },
  SGP:          { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'SGP'        },
  EXAMEN:       { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'     },
  SUSTIT:       { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio'},
};

export const semanas: Semana[] = [
  // ─── SEMANA 1 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '27 abr – 1 may',
    actividades: [
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 1 — Historia de la Farmacología · Farmacología peruana',
        fecha: '27 abr',
        hora: '14:00–15:00',
        subtemas: ['Clase inaugural', 'Hitos en la historia de la farmacología', 'Aportes peruanos'],
        docentes: ['Dra. Yolanda Viguria', 'Dr. J. Sánchez'],
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 2 — Introducción · Definiciones · Conceptos generales',
        fecha: '27 abr',
        hora: '15:00–16:00',
        subtemas: ['Definiciones de farmacología', 'Conceptos generales'],
        docentes: ['Dr. J. Sánchez'],
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 3 — Farmacocinética: Absorción y vías de administración',
        fecha: '29 abr',
        hora: '14:00–16:00',
        subtemas: ['Absorción', 'Vías de administración'],
        docentes: ['Dr. A. Zavaleta'],
      },
      {
        id: 'practica-1',
        tipo: 'LAB',
        unidad: 'FARMACOCINETICA',
        titulo: 'Práctica 1 — Farmacocinética 1 (recursos informáticos)',
        fecha: 'Sem 1 · según grupo',
        hora: '—',
        subtemas: ['Simulación con recursos informáticos'],
        docentes: [],
        nota: 'Viernes 1 may es feriado (Día del Trabajo).',
      },
    ],
  },

  // ─── SEMANA 2 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '4 – 8 may',
    actividades: [
      {
        id: 'clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 4 — Distribución de fármacos',
        fecha: '4 may',
        hora: '14:00–16:00',
        subtemas: ['Distribución', 'Unión a proteínas plasmáticas', 'Volumen de distribución'],
        docentes: ['Dra. Y. Viguria'],
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 5 — Biotransformación',
        fecha: '6 may',
        hora: '14:00–16:00',
        subtemas: ['Metabolismo de fase I y II', 'Citocromo P450', 'Inductores e inhibidores'],
        docentes: ['Dra. Y. Viguria'],
      },
      {
        id: 'clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACOCINETICA',
        titulo: 'Clase 6 — Eliminación de fármacos',
        fecha: '8 may',
        hora: '14:00–16:00',
        subtemas: ['Eliminación renal y biliar', 'Vida media', 'Aclaramiento'],
        docentes: ['Dra. Y. Viguria'],
      },
      {
        id: 'practica-2',
        tipo: 'LAB',
        unidad: 'FARMACOCINETICA',
        titulo: 'Práctica 2 — Farmacocinética 2 (recursos informáticos)',
        fecha: 'Sem 2 · según grupo',
        hora: '—',
        subtemas: ['Simulación con recursos informáticos'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 3 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '11 – 15 may',
    actividades: [
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 7 — Farmacodinamia: Mecanismo de acción de los fármacos',
        fecha: '11 may',
        hora: '14:00–16:00 (A) · 16:00–18:00 (B)',
        subtemas: ['Mecanismos de acción'],
        docentes: ['Dr. Sánchez (A)', 'Dra. Viguria (B)'],
        nota: 'Aula G102 · turnos separados A y B.',
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 8 — Farmacodinamia: Receptores · Tipo canal iónico',
        fecha: '13 may',
        hora: '14:00–16:00',
        subtemas: ['Clasificación de receptores', 'Receptores tipo canal iónico'],
        docentes: ['Dr. E. Moncada'],
      },
      {
        id: 'taller-int-1',
        tipo: 'TALLER-INT',
        unidad: 'FARMACODINAMIA',
        titulo: 'Taller Integrativo 1',
        fecha: '15 may',
        hora: '14:00–16:00',
        subtemas: ['Sesión integradora temas 1–7 y prácticas 1–3'],
        docentes: [],
        nota: 'Virtual por Zoom. Formativo.',
      },
      {
        id: 'practica-3',
        tipo: 'LAB',
        unidad: 'FARMACODINAMIA',
        titulo: 'Práctica 3 — Farmacodinamia 1: interacción fármaco–receptor',
        fecha: 'Sem 3 · según grupo',
        hora: '—',
        subtemas: ['Curva dosis–respuesta', 'Simulación in silico (docking molecular)'],
        docentes: [],
        nota: 'Incluye alumnos invitados de 3.° y 4.° año.',
      },
    ],
  },

  // ─── EVALUACIÓN I ──────────────────────────────────────────────────────────
  {
    id: 'eval-1',
    titulo: 'Examen 1',
    fechas: '16 may (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-1',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Examen 1',
        fecha: '16 may (sáb)',
        hora: '11:00–13:00',
        subtemas: ['Cubre Sesiones 1–7', 'Prácticas 1–3'],
        docentes: [],
        nota: 'Presencial · Pab. Aulas Medicina.',
      },
    ],
  },

  // ─── SEMANA 4 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '18 – 22 may',
    actividades: [
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 9 — Receptores enzimáticos y acoplados a proteína G · Insulina',
        fecha: '18 may',
        hora: '14:00–16:00 (A) · 16:00–18:00 (B)',
        subtemas: ['Receptores enzimáticos', 'Receptores acoplados a proteína G', 'Insulina'],
        docentes: ['Dr. Sánchez (A)', 'Dra. Viguria (B)'],
        nota: 'Aula G102 · turnos separados A y B.',
      },
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 10 — Receptores nucleares · Agonistas/antagonistas · Corticoides',
        fecha: '20 may',
        hora: '14:00–16:00',
        subtemas: ['Clasificación de receptores nucleares', 'Corticoides'],
        docentes: ['Dr. A. Bautista'],
      },
      {
        id: 'seminario-1',
        tipo: 'SEMINARIO',
        unidad: 'FARMACODINAMIA',
        titulo: 'Práctica 4 — Seminarios Ronda 1',
        fecha: 'Sem 4 · según grupo',
        hora: '—',
        subtemas: [
          'Tema 1: Paso de fármacos por SNC, líquidos oculares y testículos',
          'Tema 2: Ciclo de vida de los receptores farmacológicos',
          'Tema 3: Agonistas inversos · Down/up regulation · Desensibilización',
        ],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 5 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-5',
    titulo: 'Semana 5',
    fechas: '25 – 29 may',
    actividades: [
      {
        id: 'clase-11',
        tipo: 'MAGISTRAL',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 11 — Introducción al sistema nervioso · Neurotransmisores',
        fecha: '25 may',
        hora: '14:00–16:00',
        subtemas: ['Modelos neuronales (video Dr. Niels Pacheco, Harvard)', 'Neurotransmisores'],
        docentes: ['Dra. V. Cuba', 'Dr. N. Pacheco'],
      },
      {
        id: 'clase-12',
        tipo: 'MAGISTRAL',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 12 — Receptores adrenérgicos · Fármacos adrenérgicos',
        fecha: '25 may',
        hora: '14:00–16:00',
        subtemas: ['Receptores adrenérgicos', 'Agonistas adrenérgicos'],
        docentes: ['Dra. Y. Viguria'],
      },
      {
        id: 'clase-13',
        tipo: 'TALLER',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 13 — Taller: Receptores adrenérgicos · Adrenolíticos',
        fecha: '27 may',
        hora: '14:00–16:00',
        subtemas: ['Fármacos adrenolíticos'],
        docentes: ['Dra. Viguria', 'Dra. Cuba'],
        nota: 'Taller formativo, no calificado.',
      },
      {
        id: 'clase-14',
        tipo: 'MAGISTRAL',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 14 — Receptores colinérgicos · Agonistas colinérgicos',
        fecha: '29 may',
        hora: '14:00–16:00',
        subtemas: ['Receptores colinérgicos', 'Agonistas colinérgicos'],
        docentes: ['Dra. Y. Viguria'],
      },
      {
        id: 'practica-5',
        tipo: 'LAB',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Práctica 5 — Farmacodinamia 2: interacción fármaco–receptor',
        fecha: 'Sem 5 · según grupo',
        hora: '—',
        subtemas: ['Recursos informáticos', 'Simulación de efectos biológicos'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 6 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-6',
    titulo: 'Semana 6',
    fechas: '1 – 5 jun',
    actividades: [
      {
        id: 'clase-15',
        tipo: 'TALLER',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 15 — Taller: Receptores colinérgicos · Antagonistas · Organofosforados',
        fecha: '1 jun',
        hora: '14:00–16:00 (A) · 16:00–18:00 (B)',
        subtemas: ['Antagonistas colinérgicos', 'Intoxicación por organofosforados'],
        docentes: ['Dra. V. Cuba'],
        nota: 'Aula G102 · turnos separados A y B. Taller formativo.',
      },
      {
        id: 'clase-16',
        tipo: 'MAGISTRAL',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 16 — Receptor nicotínico · Farmacología del Ganglio · Nicotina',
        fecha: '3 jun',
        hora: '14:00–16:00 (A) · 16:00–18:00 (B)',
        subtemas: ['Receptor nicotínico', 'Farmacología del ganglio', 'Neurobiología de la dependencia a nicotina'],
        docentes: ['Dr. Moncada (A)', 'Dr. Sánchez (B)'],
        nota: 'Aula G101 · turnos separados A y B.',
      },
      {
        id: 'clase-17',
        tipo: 'MAGISTRAL',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Clase 17 — Colinérgicos nicotínicos de la placa motora · Agonistas/antagonistas',
        fecha: '5 jun',
        hora: '14:00–16:00',
        subtemas: ['Placa motora', 'Bloqueantes neuromusculares'],
        docentes: ['Dr. E. Moncada'],
      },
      {
        id: 'seminario-2',
        tipo: 'SEMINARIO',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Práctica 6 — Seminarios Ronda 2',
        fecha: 'Sem 6 · según grupo',
        hora: '—',
        subtemas: [
          'Tema 4: Canales de sodio',
          'Tema 5: Canales de potasio',
          'Tema 6: Canales de calcio',
          'Tema 7: Receptores dopaminérgicos',
          'Tema 8: Receptores GABA',
          'Tema 9: Receptores de glutamato',
        ],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 7 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-7',
    titulo: 'Semana 7',
    fechas: '8 – 12 jun',
    actividades: [
      {
        id: 'clase-18',
        tipo: 'TALLER',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 18 — Taller de Autacoides: Histamina · AINES · COXIB',
        fecha: '8 jun',
        hora: '14:00–16:00',
        subtemas: ['Histamina · agonistas y antagonistas', 'AINES', 'COXIB'],
        docentes: ['Dra. Viguria', 'Dra. Cuba'],
        nota: 'Taller formativo.',
      },
      {
        id: 'clase-19',
        tipo: 'TALLER',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 19 — Taller: Medicamentos biológicos y terapia génica',
        fecha: '10 jun',
        hora: '14:00–16:00',
        subtemas: ['Medicamentos biológicos', 'Terapia génica'],
        docentes: ['Dra. Viguria (A)', 'Dra. Cuba (B)'],
        nota: 'A: aula G101 · B: aula G102. Taller formativo.',
      },
      {
        id: 'taller-int-2',
        tipo: 'TALLER-INT',
        unidad: 'FARMACODINAMIA',
        titulo: 'Taller Integrativo 2',
        fecha: '12 jun',
        hora: '14:00–16:00',
        subtemas: ['Sesión integradora temas 8–19 y prácticas 3–5'],
        docentes: [],
        nota: 'Virtual por Zoom. Formativo.',
      },
      {
        id: 'practica-7',
        tipo: 'LAB',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Práctica 7 — Sistema nervioso autónomo colinérgico',
        fecha: 'Sem 7 · según grupo',
        hora: '—',
        subtemas: ['SNA colinérgico'],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIÓN II ─────────────────────────────────────────────────────────
  {
    id: 'eval-2',
    titulo: 'Examen 2',
    fechas: '13 jun (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-2',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Examen 2',
        fecha: '13 jun (sáb)',
        hora: '08:00–10:00',
        subtemas: ['Cubre Sesiones 8–19', 'Prácticas 4–5', 'Seminarios rondas 1 y 2'],
        docentes: [],
        nota: 'Presencial · Pab. Aulas Medicina.',
      },
    ],
  },

  // ─── SEMANA 8 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-8',
    titulo: 'Semana 8',
    fechas: '15 – 19 jun',
    actividades: [
      {
        id: 'clase-20',
        tipo: 'MAGISTRAL',
        unidad: 'FARMACODINAMIA',
        titulo: 'Clase 20 — Interacciones medicamentosas · Interacciones alimentos–medicamentos',
        fecha: '15 jun',
        hora: '14:00–16:00',
        subtemas: ['Interacciones farmacológicas', 'Interacciones con alimentos'],
        docentes: ['Dr. J. Sánchez'],
      },
      {
        id: 'clase-21',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 21 — Introducción a Farmacología Clínica · Mecanismos de acción de antibióticos',
        fecha: '17 jun',
        hora: '14:00–16:00',
        subtemas: ['Farmacología clínica', 'Mecanismos de acción de antibióticos'],
        docentes: ['Dra. L. Mori'],
      },
      {
        id: 'clase-22',
        tipo: 'AULA-INV',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 22 — Antiparasitarios',
        fecha: '19 jun',
        hora: '14:00–16:00',
        subtemas: ['Antiparasitarios'],
        docentes: ['Dr. J. Alave', 'Dra. V. Cuba'],
        nota: 'Modalidad aula invertida.',
      },
      {
        id: 'practica-8',
        tipo: 'LAB',
        unidad: 'SN_VEGETATIVO',
        titulo: 'Práctica 8 — Sistema nervioso autónomo adrenérgico',
        fecha: 'Sem 8 · según grupo',
        hora: '—',
        subtemas: ['Agonistas adrenérgicos', 'Bloqueantes adrenérgicos'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 9 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-9',
    titulo: 'Semana 9',
    fechas: '22 – 27 jun',
    actividades: [
      {
        id: 'clase-23',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 23 — Penicilinas · Cefalosporinas · Carbapenems',
        fecha: '22 jun',
        hora: '14:00–16:00',
        subtemas: ['Penicilinas', 'Cefalosporinas', 'Carbapenems'],
        docentes: ['Dra. C. García'],
      },
      {
        id: 'clase-24',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 24 — Fluoroquinolonas · Aminoglucósidos · Macrólidos',
        fecha: '24 jun',
        hora: '14:00–16:00',
        subtemas: ['Fluoroquinolonas', 'Aminoglucósidos', 'Macrólidos'],
        docentes: ['Dr. F. Álvarez'],
      },
      {
        id: 'clase-25',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 25 — Clindamicina · Vancomicina · Trimetoprim-sulfametoxazol',
        fecha: '26 jun',
        hora: '14:00–16:00',
        subtemas: ['Clindamicina', 'Vancomicina', 'TMP-SMX'],
        docentes: ['Dra. C. García'],
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'ANTIBIOTICOS',
        titulo: 'SGP / ABP 1 — Módulo integrado Microbiología–Farmacología',
        fecha: '22–27 jun',
        hora: '2 sesiones de 2h',
        subtemas: ['Coordinación con docente asignado'],
        docentes: [],
      },
      {
        id: 'seminario-3',
        tipo: 'SEMINARIO',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Práctica 9 — Seminarios Ronda 3',
        fecha: 'Sem 9 · según grupo',
        hora: '—',
        subtemas: [
          'Tema 10: Receptores serotoninérgicos',
          'Tema 11: Autacoides · histamina · AINES · COXIB',
          'Tema 12: Receptores opioides',
          'Tema 13: Cocaína, anfetaminas, éxtasis, cristal',
          'Tema 14: Alcohol',
          'Tema 15: Sistema endocannabinoide · Cannabis medicinal',
        ],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 10 ─────────────────────────────────────────────────────────────
  {
    id: 'sem-10',
    titulo: 'Semana 10',
    fechas: '29 jun – 4 jul',
    actividades: [
      {
        id: 'clase-26',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 26 — Metronidazol · Doxiciclina · Colistina · Nitrofurantoína',
        fecha: '1 jul',
        hora: '14:00–16:00',
        subtemas: ['Metronidazol', 'Doxiciclina', 'Colistina', 'Nitrofurantoína'],
        docentes: ['Dr. F. Álvarez'],
        nota: 'Lunes 29 jun es feriado (San Pedro y San Pablo).',
      },
      {
        id: 'clase-27',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 27 — Selección de antimicrobianos (Bugs and Drugs)',
        fecha: '3 jul',
        hora: '14:00–16:00',
        subtemas: ['Selección racional de antibióticos'],
        docentes: ['Dr. M. Montes'],
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'ANTIBIOTICOS',
        titulo: 'SGP / ABP 2 — Módulo integrado Microbiología–Farmacología',
        fecha: '29 jun – 4 jul',
        hora: '2 sesiones de 2h',
        subtemas: ['Coordinación con docente asignado'],
        docentes: [],
      },
      {
        id: 'practica-10',
        tipo: 'LAB',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Práctica 10 — Farmacovigilancia',
        fecha: 'Sem 10 · según grupo',
        hora: '—',
        subtemas: ['Farmacovigilancia'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 11 ─────────────────────────────────────────────────────────────
  {
    id: 'sem-11',
    titulo: 'Semana 11',
    fechas: '6 – 10 jul',
    actividades: [
      {
        id: 'clase-28',
        tipo: 'MAGISTRAL',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Clase 28 — Antifúngicos: equinocandinas · anfotericina · azoles',
        fecha: '6 jul',
        hora: '14:00–16:00',
        subtemas: ['Equinocandinas', 'Anfotericina', 'Azoles', 'Discusión de casos clínicos'],
        docentes: ['Dra. L. Mori'],
      },
      {
        id: 'taller-int-3',
        tipo: 'TALLER-INT',
        unidad: 'ANTIBIOTICOS',
        titulo: 'Taller Integrativo 3',
        fecha: '8 jul',
        hora: '14:00–16:00',
        subtemas: ['Sesión integradora temas 20–28 y prácticas 5–7'],
        docentes: [],
        nota: 'Virtual por Zoom. Formativo. Viernes 10 jul: estudio independiente para el examen final.',
      },
    ],
  },

  // ─── EVALUACIÓN III ────────────────────────────────────────────────────────
  {
    id: 'eval-3',
    titulo: 'Examen 3',
    fechas: '11 jul (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-3',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Examen 3',
        fecha: '11 jul (sáb)',
        hora: '11:00–13:00',
        subtemas: ['Cubre Sesiones 21–28', 'Prácticas 6–7', 'Seminarios ronda 3'],
        docentes: [],
        nota: 'Presencial · Pab. Aulas Medicina.',
      },
    ],
  },

  // ─── CIERRE ────────────────────────────────────────────────────────────────
  {
    id: 'cierre',
    titulo: 'Cierre del curso',
    fechas: '15 jul (mar)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'sustit',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen sustitutorio y rezagados',
        fecha: '15 jul (mar)',
        hora: '08:00–10:00',
        subtemas: ['Solo un examen parcial puede sustituirse', 'Nota máxima: 11'],
        docentes: [],
        nota: 'Presencial · Pab. Aulas Medicina.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Farmacología',
  codigo: 'M2316',
  carrera: 'Medicina · UPCH',
  coordinadora: 'Dra. Yolanda Viguria',
  duracion: '27 abr – 15 jul 2026',
  creditos: '5 créditos · 48h teóricas + 64h prácticas',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
