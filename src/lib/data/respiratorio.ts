/**
 * Sistema Respiratorio — sílabo REFERENCIAL.
 *
 * El sílabo oficial aún no está subido: este calca la estructura de los otros
 * cursos de la Facultad (Cardiovascular, Endocrino) con los temas de los
 * apuntes de BUST. Fechas, horas y docentes quedan sin poner hasta tenerlo;
 * al llegar, se reordena aquí sin tocar los ids (los resúmenes cuelgan de ellos).
 */

export type TipoActividad =
  | 'MAGISTRAL'
  | 'TBL'
  | 'TALLER'
  | 'ANATOMIA'
  | 'HISTOLOGIA'
  | 'EXAMEN-P'
  | 'EXAMEN-T';

export type Unidad =
  | 'ANATOMIA'
  | 'MORFOLOGIA'
  | 'VENTILACION'
  | 'INTERCAMBIO'
  | 'CONTROL'
  | 'EVALUACION';

export type ResumenFormato = 'pdf' | 'html';

export interface ResumenOpcion {
  id: string;
  label: string;
  formato?: ResumenFormato;
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
  resumen?: { tipo: 'pdf'; formato?: ResumenFormato; opciones?: ResumenOpcion[] };
  /** Módulo interactivo de la práctica: en las prácticas «Video» pasa a «Simulación». */
  simulacion?: { href?: string; desc?: string };
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  ANATOMIA:    '#34C778',
  MORFOLOGIA:  '#E879A6',
  VENTILACION: '#3b9edd',
  INTERCAMBIO: '#14B8A6',
  CONTROL:     '#8b5cf6',
  EVALUACION:  '#6B6B68',
};

export const UNIDAD_LABEL: Record<Unidad, string> = {
  ANATOMIA:    'Anatomía de la vía aérea y el tórax',
  MORFOLOGIA:  'Histología y embriología',
  VENTILACION: 'Mecánica y función pulmonar',
  INTERCAMBIO: 'Intercambio y transporte de gases',
  CONTROL:     'Control y adaptación',
  EVALUACION:  'Evaluación',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'TBL'        },
  TALLER:     { bg: 'rgba(249,115,22,0.15)',  color: '#F97316', label: 'Taller'     },
  ANATOMIA:   { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Anatomía'   },
  HISTOLOGIA: { bg: 'rgba(232,121,166,0.15)', color: '#E879A6', label: 'Histología' },
  'EXAMEN-P': { bg: 'rgba(239,68,68,0.12)',   color: '#F87171', label: 'Examen P'   },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen T'   },
};

/** Resumen HTML con el mismo id que la actividad. */
const html = (id: string) => ({
  tipo: 'pdf' as const,
  formato: 'html' as const,
  opciones: [{ id, label: 'Resumen', formato: 'html' as const }],
});

/** Las prácticas (anatomía e histología) son libres; el resto pide el plan. */
export const esPractica = (a: Pick<Actividad, 'tipo'>) => a.tipo === 'ANATOMIA' || a.tipo === 'HISTOLOGIA';

const SIN_FECHA = { fecha: 'Por confirmar', hora: '—', docentes: [] as string[] };

export const semanas: Semana[] = [
  // ─── SEMANA 1 — VÍA AÉREA SUPERIOR Y MORFOLOGÍA ─────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Vía aérea superior y morfología',
    fechas: 'por confirmar',
    actividades: [
      {
        id: 'resp-anat-1', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T1 — Nariz y fosas nasales',
        subtemas: ['Nariz externa', 'Fosas nasales y cornetes', 'Senos paranasales', 'Irrigación e inervación'],
        resumen: html('resp-anat-1'),
      },
      {
        id: 'resp-histo', tipo: 'MAGISTRAL', unidad: 'MORFOLOGIA', ...SIN_FECHA,
        titulo: 'Histología del sistema respiratorio',
        subtemas: ['Mucosa respiratoria', 'Porción conductora', 'Porción respiratoria y alvéolos', 'Irrigación pulmonar'],
        resumen: html('resp-histo'),
      },
      {
        id: 'resp-emb', tipo: 'MAGISTRAL', unidad: 'MORFOLOGIA', ...SIN_FECHA,
        titulo: 'Embriología del sistema respiratorio',
        subtemas: ['Divertículo respiratorio', 'Laringe', 'Tráquea y bronquios', 'Maduración de los pulmones'],
        resumen: html('resp-emb'),
      },
      {
        id: 'resp-anat-2', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T2 — Faringe y laringe',
        subtemas: ['Nasofaringe, orofaringe y laringofaringe', 'Cartílagos de la laringe', 'Músculos laríngeos', 'Inervación de la laringe'],
        resumen: html('resp-anat-2'),
      },
      {
        id: 'resp-fis-1', tipo: 'MAGISTRAL', unidad: 'VENTILACION', ...SIN_FECHA,
        titulo: 'Mecánica de la ventilación',
        subtemas: ['Presiones y flujo', 'Propiedades elásticas y distensibilidad', 'Tensión superficial y surfactante', 'Resistencia de la vía aérea', 'Volúmenes pulmonares'],
        resumen: html('resp-fis-1'),
      },
      {
        id: 'resp-pa-1', tipo: 'ANATOMIA', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'Práctica de Anatomía 1 — Nariz, faringe y laringe',
        subtemas: ['Fosas nasales y senos paranasales', 'Faringe', 'Laringe'],
      },
      {
        id: 'resp-ph-1', tipo: 'HISTOLOGIA', unidad: 'MORFOLOGIA', ...SIN_FECHA,
        titulo: 'Práctica de Histología 1 — Porción conductora',
        subtemas: ['Epitelio respiratorio', 'Tráquea', 'Bronquios y bronquiolos'],
      },
    ],
  },

  // ─── SEMANA 2 — CAJA TORÁCICA Y FUNCIÓN PULMONAR ────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — Caja torácica y función pulmonar',
    fechas: 'por confirmar',
    actividades: [
      {
        id: 'resp-anat-3', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T3 — Osteología del tórax',
        subtemas: ['Esternón', 'Costillas y cartílagos costales', 'Vértebras torácicas', 'Articulaciones del tórax'],
        resumen: html('resp-anat-3'),
      },
      {
        id: 'resp-anat-4', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T4 — Músculos del tórax',
        subtemas: ['Músculos de la respiración', 'Diafragma', 'Músculos intercostales', 'Músculos accesorios'],
        resumen: html('resp-anat-4'),
      },
      {
        id: 'resp-fis-2', tipo: 'MAGISTRAL', unidad: 'INTERCAMBIO', ...SIN_FECHA,
        titulo: 'Difusión de gases',
        subtemas: ['Presiones parciales y ecuación del gas alveolar', 'Leyes de la difusión', 'Membrana alvéolo-capilar', 'Limitaciones del intercambio'],
        resumen: html('resp-fis-2'),
      },
      {
        id: 'resp-fis-3', tipo: 'MAGISTRAL', unidad: 'INTERCAMBIO', ...SIN_FECHA,
        titulo: 'Ventilación – perfusión',
        subtemas: ['Relación V/Q', 'Zonas de West', 'Espacio muerto y cortocircuito', 'Alteraciones V/Q'],
        resumen: html('resp-fis-3'),
      },
      {
        id: 'resp-taller-1', tipo: 'TALLER', unidad: 'VENTILACION', ...SIN_FECHA,
        titulo: 'Taller 1 — Espirometría',
        subtemas: ['Volúmenes y capacidades', 'Curva flujo-volumen', 'Valores de referencia', 'Patrón obstructivo y restrictivo'],
        resumen: html('resp-taller-1'),
      },
      {
        id: 'resp-pa-2', tipo: 'ANATOMIA', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'Práctica de Anatomía 2 — Osteología y músculos del tórax',
        subtemas: ['Esqueleto del tórax', 'Músculos de la pared torácica', 'Diafragma'],
      },
      {
        id: 'resp-ph-2', tipo: 'HISTOLOGIA', unidad: 'MORFOLOGIA', ...SIN_FECHA,
        titulo: 'Práctica de Histología 2 — Porción respiratoria',
        subtemas: ['Bronquiolo respiratorio', 'Conducto y saco alveolar', 'Neumocitos I y II'],
      },
      {
        id: 'resp-exam-p1', tipo: 'EXAMEN-P', unidad: 'EVALUACION', ...SIN_FECHA,
        titulo: '🔴 Evaluación práctica de Anatomía 1',
        subtemas: ['Nariz y fosas nasales', 'Faringe y laringe', 'Osteología y músculos del tórax'],
      },
    ],
  },

  // ─── SEMANA 3 — PULMONES, TRANSPORTE Y CIRCULACIÓN ──────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Pulmones, transporte y circulación',
    fechas: 'por confirmar',
    actividades: [
      {
        id: 'resp-anat-5', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T5 — Pleura y pulmones',
        subtemas: ['Pleura visceral y parietal', 'Recesos pleurales', 'Lóbulos, fisuras e hilio', 'Irrigación y drenaje linfático'],
        resumen: html('resp-anat-5'),
      },
      {
        id: 'resp-anat-6', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'T6 — Árbol tráqueo-bronquial',
        subtemas: ['Tráquea', 'Bronquios principales y lobares', 'Segmentos broncopulmonares', 'Inervación'],
        resumen: html('resp-anat-6'),
      },
      {
        id: 'resp-fis-4', tipo: 'MAGISTRAL', unidad: 'INTERCAMBIO', ...SIN_FECHA,
        titulo: 'Transporte de oxígeno y dióxido de carbono',
        subtemas: ['Contenido arterial de O₂', 'Curva de disociación de la oxihemoglobina', 'Transporte de CO₂', 'Efectos Bohr y Haldane'],
        resumen: html('resp-fis-4'),
      },
      {
        id: 'resp-fis-5', tipo: 'MAGISTRAL', unidad: 'INTERCAMBIO', ...SIN_FECHA,
        titulo: 'Circulación pulmonar',
        subtemas: ['Circulación pulmonar y bronquial', 'Presiones pulmonares', 'Resistencia vascular pulmonar', 'Vasoconstricción hipóxica'],
        resumen: html('resp-fis-5'),
      },
      {
        id: 'resp-taller-2', tipo: 'TALLER', unidad: 'INTERCAMBIO', ...SIN_FECHA,
        titulo: 'Taller 2 — Análisis de gases arteriales (AGA)',
        subtemas: ['Oxigenación y gradiente A-a', 'Trastornos ácido-base', 'Compensación', 'Algoritmo de interpretación'],
        resumen: html('resp-taller-2'),
      },
      {
        id: 'resp-pa-3', tipo: 'ANATOMIA', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'Práctica de Anatomía 3 — Pleura, pulmones y árbol tráqueo-bronquial',
        subtemas: ['Pleura', 'Pulmones', 'Tráquea y bronquios'],
      },
    ],
  },

  // ─── SEMANA 4 — CONTROL DE LA VENTILACIÓN Y ADAPTACIÓN ──────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4 — Control de la ventilación y adaptación',
    fechas: 'por confirmar',
    actividades: [
      {
        id: 'resp-fis-6', tipo: 'MAGISTRAL', unidad: 'CONTROL', ...SIN_FECHA,
        titulo: 'Control de la ventilación',
        subtemas: ['Centros respiratorios del tronco', 'Reflejos de receptores pulmonares', 'Quimiorreceptores centrales y periféricos', 'Regulación química'],
        resumen: html('resp-fis-6'),
      },
      {
        id: 'resp-fis-7', tipo: 'MAGISTRAL', unidad: 'CONTROL', ...SIN_FECHA,
        titulo: 'Sistema respiratorio en situaciones extremas',
        subtemas: ['Sueño', 'Buceo', 'Ejercicio', 'Embarazo'],
        resumen: html('resp-fis-7'),
      },
      {
        id: 'resp-tbl-1', tipo: 'TBL', unidad: 'CONTROL', ...SIN_FECHA,
        titulo: 'TBL — Fisiología de altura',
        subtemas: ['Hipoxia hipobárica', 'Aclimatación', 'Mal agudo de montaña', 'Factores inducibles por hipoxia (HIF)'],
        resumen: html('resp-tbl-1'),
      },
      {
        id: 'resp-rx', tipo: 'MAGISTRAL', unidad: 'ANATOMIA', ...SIN_FECHA,
        titulo: 'Radiología de tórax',
        subtemas: ['Densidades radiológicas', 'Proyecciones', 'Calidad: rotación, penetración, inspiración', 'Lectura sistemática'],
        resumen: html('resp-rx'),
      },
      {
        id: 'resp-exam-p2', tipo: 'EXAMEN-P', unidad: 'EVALUACION', ...SIN_FECHA,
        titulo: '🔴 Evaluación práctica de Anatomía 2',
        subtemas: ['Pleura y pulmones', 'Árbol tráqueo-bronquial', 'Radiología de tórax'],
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ───────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación final',
    fechas: 'por confirmar',
    esEvaluacion: true,
    actividades: [
      {
        id: 'resp-examen-t', tipo: 'EXAMEN-T', unidad: 'EVALUACION', ...SIN_FECHA,
        titulo: '🔴 Examen teórico final',
        subtemas: ['Todo el curso'],
      },
    ],
  },
];

export const curso = {
  nombre: 'Sistema Respiratorio',
  codigo: 'UPCH',
  carrera: 'Medicina · UPCH',
  duracion: 'Sílabo referencial',
  creditos: '4 semanas',
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
