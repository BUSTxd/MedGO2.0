export type TipoActividad =
  | 'MAGISTRAL'
  | 'TBL'
  | 'ABP'
  | 'LAB-NEURO'
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
  UNIDAD_4:   '#A61D1D',
  EVALUACION: '#444441',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:    { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Magistral'    },
  TBL:          { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'TBL'          },
  ABP:          { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'ABP'          },
  'LAB-NEURO':  { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Neuro'    },
  'LAB-ANAT':   { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Lab Anat'     },
  'PASO-CORTO': { bg: 'rgba(239,68,68,0.12)',   color: '#F87171', label: 'Paso corto'   },
  'TALLER-FIS': { bg: 'rgba(59,158,221,0.20)',  color: '#3b9edd', label: 'Taller Fis'   },
  'EXAM-ANAT':  { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Anat'  },
  'EXAM-PARC':  { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Parc'  },
  'EXAM-FINAL': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen Final' },
  SUSTIT:       { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio' },
  'EFI-GAMES':  { bg: 'rgba(245,166,35,0.20)',  color: '#F5A623', label: 'EFI Games'    },
};

export const semanas: Semana[] = [
  // Las semanas se irán agregando conforme se publique el sílabo.
];

export const curso = {
  nombre: 'Sistema Nervioso',
  codigo: 'M1553',
  carrera: 'Medicina · UPCH',
  coordinadora: 'Por definir',
  duracion: 'Por definir',
  creditos: 'Por definir',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
