import type { ExamenRef } from './examen';
export type { ExamenRef };

// Psicología Médica (Facultad de Medicina). Aún no hay sílabo: el curso abre
// sólo con el banqueo del parcial. Cuando llegue, las clases se añaden como
// semanas antes de la evaluación y sus temas se mapean en `temas/psicologia-medica.ts`.

export type TipoActividad = 'EXAMEN';

export type Unidad = 'EVALUACION';

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
  examen?: ExamenRef;
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  /** Aviso de la semana entera. */
  aviso?: string;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  EVALUACION: '#444441',
};

export const UNIDAD_LABEL: Record<Unidad, string> = {
  EVALUACION: 'Evaluación',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  EXAMEN: { bg: 'rgba(239,68,68,0.15)', color: '#F87171', label: 'Examen' },
};

export const TIPO_DESC: Record<TipoActividad, string> = {
  EXAMEN: 'Examen presencial.',
};

export const semanas: Semana[] = [
  {
    id: 'eval-parcial',
    titulo: 'Evaluación parcial',
    fechas: 'Fecha por confirmar',
    esEvaluacion: true,
    aviso: 'El sílabo del curso aún no está publicado: por ahora trae el banqueo del examen parcial.',
    actividades: [
      {
        id: 'examen-parcial',
        tipo: 'EXAMEN',
        unidad: 'EVALUACION',
        titulo: 'Examen Parcial',
        fecha: 'Por confirmar',
        hora: '—',
        subtemas: [
          'Entrevista clínica (Calgary-Cambridge)',
          'Intervenciones facilitadoras',
          'Examen mental',
          'Relación médico-paciente',
          'Comunicación de malas noticias (SPIKES)',
        ],
        docentes: [],
        // Tres banqueos: los dos de Moodle (2022-II y 2021-I, transcritos de
        // capturas con la clave del aula virtual) y uno de repaso que circula en
        // texto, con preguntas recordadas y alguna clave dudosa (`reviewNote`).
        // El más reciente abre por defecto y es la muestra abierta; los otros
        // dos van con candado.
        examen: {
          key: 'psicologia-medica/parcial-2022-2',
          free: true,
          dePago: [
            'psicologia-medica/parcial-2021-1',
            'psicologia-medica/parcial-repaso',
          ],
          groups: [
            'psicologia-medica/parcial-2021-1',
            'psicologia-medica/parcial-repaso',
          ],
          labels: {
            'psicologia-medica/parcial-2022-2': '2022-II',
            'psicologia-medica/parcial-2021-1': '2021-I',
            'psicologia-medica/parcial-repaso': 'Repaso',
          },
          hints: {
            'psicologia-medica/parcial-repaso': 'Preguntas recordadas por alumnos, sin la captura del aula virtual',
          },
        },
      },
    ],
  },
];

export const curso = {
  nombre: 'Psicología Médica',
  carrera: 'Facultad de Medicina · Universidad Peruana Cayetano Heredia',
  ciclo: 'Sílabo por publicar',
  duracion: 'Banqueo del parcial',
  unidades: '115 preguntas',
};

export const EXAMENES = semanas
  .flatMap((s) => s.actividades)
  .filter((a) => a.unidad === 'EVALUACION');

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
