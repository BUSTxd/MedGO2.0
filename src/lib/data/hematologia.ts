export type TipoActividad = 'MAGISTRAL' | 'TBL' | 'SGP' | 'LAB' | 'REPASO' | 'EXAMEN-T' | 'EXAMEN-L';
export type Unidad = 'ERITROCITOS' | 'HEMOSTASIA' | 'LEUCOCITOS' | 'EVALUACION';

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
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** Sobreescribe el destino del card en el sílabo (p.ej. examen práctico → atlas). */
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
  ERITROCITOS: '#D4574A',
  HEMOSTASIA:  '#C9A227',
  LEUCOCITOS:  '#5E9CD3',
  EVALUACION:  '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',   color: '#3b9edd', label: 'Magistral'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',   color: '#F5A623', label: 'TBL'        },
  SGP:        { bg: 'rgba(155,142,248,0.15)',  color: '#9B8EF8', label: 'SGP'        },
  LAB:        { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Lab'        },
  REPASO:     { bg: 'rgba(148,163,184,0.16)',  color: '#94A3B8', label: 'Repaso'     },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',    color: '#F87171', label: 'Examen T'   },
  'EXAMEN-L': { bg: 'rgba(239,68,68,0.12)',    color: '#F87171', label: 'Examen L'   },
};

export const semanas: Semana[] = [
  // ─── SEMANA 1 — UNIDAD 1: ERITROCITOS ──────────────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Eritrocitos',
    fechas: '11 – 15 ago',
    actividades: [
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 1 — Bienvenida e Introducción al curso',
        fecha: '11 ago',
        hora: '07:00–08:00',
        subtemas: ['Presentación del curso', 'Metodología y evaluación'],
        docentes: ['Dra. Evelyn Mejía Gil'],
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 2 — Hematopoyesis',
        fecha: '11 ago',
        hora: '08:00–09:00',
        subtemas: [
          'Embriología del sistema hematopoyético (saco vitelino, hígado fetal, médula ósea)',
          'Hematopoyesis',
          'Eritropoyesis',
        ],
        docentes: [],
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 3 — Eritrograma',
        fecha: '11 ago',
        hora: '09:00–10:00',
        subtemas: ['Serie roja del hemograma', 'Índices eritrocitarios (VCM, HCM, CHCM, RDW)'],
        docentes: [],
      },
      {
        id: 'clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 4 — Fisiología del eritrocito',
        fecha: '11 ago',
        hora: '10:00–12:00',
        subtemas: [
          'Membrana del eritrocito: proteínas, lípidos, carbohidratos',
          'Actividad enzimática del eritrocito',
          'Hemoglobina: globina, grupo hemo, curva de disociación de O₂',
          'Grupos sanguíneos: ABO, Rh y otros sistemas',
        ],
        docentes: [],
      },
      {
        id: 'lab-1',
        tipo: 'LAB',
        unidad: 'ERITROCITOS',
        titulo: 'Lab 1 — Lámina periférica y morfología de eritrocitos',
        fecha: '12 – 13 ago · según grupo',
        hora: '—',
        subtemas: ['Frotis de sangre periférica', 'Morfología eritrocitaria normal y patológica'],
        docentes: [],
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'ERITROCITOS',
        titulo: 'SGP 1 — Anemia ferropénica / megaloblástica y transfusión',
        fecha: '13 ago',
        hora: '08:00–12:00',
        subtemas: [
          'Anemia ferropénica',
          'Anemia megaloblástica',
          'Transfusión de hemoderivados',
        ],
        docentes: [],
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 5 — Bazo y ganglios linfáticos',
        fecha: '13 ago',
        hora: '13:00–15:00',
        subtemas: [
          'Bazo: anatomía, pulpa roja y pulpa blanca',
          'Filtración sanguínea',
          'Ganglios linfáticos: estructura y función',
        ],
        docentes: [],
      },
      {
        id: 'clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'ERITROCITOS',
        titulo: 'Clase 6 — Metabolismo del hierro',
        fecha: '15 ago',
        hora: '13:00–15:00',
        subtemas: ['Absorción del hierro', 'Transferrina y transporte', 'Reciclaje del hierro'],
        docentes: [],
      },
      {
        id: 'repaso-1',
        tipo: 'REPASO',
        unidad: 'ERITROCITOS',
        titulo: 'Repaso y autoevaluación 1 — Eritrocitos',
        fecha: '15 ago',
        hora: '15:00–16:00 (presencial) · 20:00–21:00 (virtual)',
        subtemas: ['Repaso integrador de la Unidad 1', 'Autoevaluación'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 2 — HEMOSTASIA / INICIO LEUCOCITOS ─────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — Hemostasia e Inmunología',
    fechas: '18 – 22 ago',
    actividades: [
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'ERITROCITOS',
        titulo: 'TBL 1 — Análisis del hemograma y anemia hemolítica',
        fecha: '18 ago',
        hora: '08:00–11:00',
        subtemas: ['Interpretación del hemograma', 'Anemia hemolítica'],
        docentes: [],
      },
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'LEUCOCITOS',
        titulo: 'Clase 7 — Introducción a la Inmunología',
        fecha: '18 ago',
        hora: '11:00–13:00',
        subtemas: ['Inmunidad innata y adaptativa', 'Órganos y células del sistema inmune'],
        docentes: [],
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'HEMOSTASIA',
        titulo: 'Clase 8 — Megacariopoyesis y fisiología plaquetaria',
        fecha: '18 ago',
        hora: '14:00–16:00',
        subtemas: [
          'Megacariopoyesis y proplaquetas',
          'Plaquetas: membrana, gránulos, citoesqueleto',
        ],
        docentes: [],
      },
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'HEMOSTASIA',
        titulo: 'Clase 9 — Hemostasia primaria y secundaria',
        fecha: '20 ago',
        hora: '13:00–15:00',
        subtemas: [
          'Hemostasia primaria: tapón plaquetario',
          'Hemostasia secundaria: cascada de coagulación (vía intrínseca y extrínseca)',
          'Modelo celular de la coagulación',
          'Farmacología: antiagregantes, anticoagulantes, fibrinolíticos',
        ],
        docentes: [],
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'HEMOSTASIA',
        titulo: 'SGP 2 — Trombosis',
        fecha: '21 ago',
        hora: '08:00–12:00',
        subtemas: ['Trombosis arterial y venosa', 'Factores de riesgo trombótico'],
        docentes: [],
      },
      {
        id: 'lab-2',
        tipo: 'LAB',
        unidad: 'LEUCOCITOS',
        titulo: 'Lab 2 — Médula ósea, serie blanca y fórmula diferencial',
        fecha: '22 ago · según grupo',
        hora: '—',
        subtemas: ['Médula ósea', 'Serie blanca', 'Fórmula leucocitaria diferencial'],
        docentes: [],
      },
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'LEUCOCITOS',
        titulo: 'Clase 10 — Inmunohematología',
        fecha: '22 ago',
        hora: '13:00–15:00',
        subtemas: ['Transfusión sanguínea', 'Compatibilidad ABO y HLA'],
        docentes: [],
      },
      {
        id: 'repaso-2',
        tipo: 'REPASO',
        unidad: 'HEMOSTASIA',
        titulo: 'Repaso y autoevaluación 2 — Hemostasia e Inmunohematología',
        fecha: '22 ago',
        hora: '15:00–16:00 (presencial) · 20:00–21:00 (virtual)',
        subtemas: ['Repaso integrador de las Unidades 2 y 3', 'Autoevaluación'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 3 — LEUCOCITOS E INMUNOHEMATOLOGÍA ─────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Leucocitos',
    fechas: '25 – 29 ago',
    actividades: [
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'HEMOSTASIA',
        titulo: 'TBL 2 — Enfermedad de von Willebrand',
        fecha: '25 ago',
        hora: '08:00–11:00',
        subtemas: ['Factor de von Willebrand', 'Diagnóstico y clasificación'],
        docentes: [],
      },
      {
        id: 'clase-11',
        tipo: 'MAGISTRAL',
        unidad: 'LEUCOCITOS',
        titulo: 'Clase 11 — Leucopoyesis y ciclo celular',
        fecha: '25 ago',
        hora: '13:00–15:00',
        subtemas: [
          'Granulopoyesis',
          'Linfopoyesis (B, T, NK)',
          'Ciclo celular (G1, S, G2, M)',
          'Quimioterápicos y ciclo celular',
        ],
        docentes: [],
      },
      {
        id: 'clase-12',
        tipo: 'MAGISTRAL',
        unidad: 'LEUCOCITOS',
        titulo: 'Clase 12 — Estructura y función leucocitaria',
        fecha: '27 ago',
        hora: '11:00–13:00',
        subtemas: ['Neutrófilos', 'Eosinófilos', 'Basófilos', 'Linfocitos', 'Monocitos'],
        docentes: [],
      },
      {
        id: 'repaso-final',
        tipo: 'REPASO',
        unidad: 'EVALUACION',
        titulo: 'Repaso final del curso',
        fecha: '27 ago',
        hora: '14:00–16:00',
        subtemas: ['Repaso integrador de las Unidades 1 a 3'],
        docentes: [],
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'LEUCOCITOS',
        titulo: 'SGP 3 — Leucocitosis, médula ósea y esplenomegalia',
        fecha: '28 ago',
        hora: '08:00–12:00',
        subtemas: ['Leucocitosis y leucemia', 'Médula ósea', 'Esplenomegalia'],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ──────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación Final',
    fechas: '29 ago (vie)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Final Teórico',
        fecha: '29 ago (vie)',
        fechaISO: '2025-08-29',
        hora: '08:00–10:00',
        subtemas: ['Cubre las Clases 1–12 (Unidades 1 a 3)'],
        docentes: [],
      },
      {
        id: 'examen-l',
        tipo: 'EXAMEN-L',
        unidad: 'EVALUACION',
        titulo: 'Laboratorio (evaluado)',
        fecha: '29 ago (vie)',
        fechaISO: '2025-08-29',
        hora: '10:00–11:00',
        subtemas: ['Cubre los Lab 1 y 2'],
        docentes: [],
        nota: 'Back-to-back con el examen teórico. Nota mínima aprobatoria: 11.00.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Hematología',
  codigo: 'M1546',
  carrera: 'Medicina · UPCH',
  coordinadora: 'Dra. Evelyn Mejía Gil',
  duracion: '11 – 30 ago 2025',
  creditos: '3 créditos · 1 teoría + 2 práctica',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
