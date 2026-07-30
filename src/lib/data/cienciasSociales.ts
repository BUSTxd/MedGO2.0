export type TipoActividad =
  | 'TEORIA'
  | 'PRACTICA'
  | 'PRODUCTO'
  | 'PASO'
  | 'EXAMEN-T';

export type Unidad =
  | 'CONOCIMIENTO'
  | 'CONTEXTO'
  | 'HISTORIA'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código del sílabo: T1–T14 (teoría), P1–P12 (práctica). */
  codigo?: string;
  titulo: string;
  /** Posición dentro de su serie: el sílabo no fija fechas por sesión. */
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** Sobreescribe el destino del card en el sílabo. */
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
  CONOCIMIENTO: '#E879A6',
  CONTEXTO:     '#F5A623',
  HISTORIA:     '#5E9CD3',
  EVALUACION:   '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEORIA:     { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Teoría'    },
  PRACTICA:   { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'Práctica'  },
  PRODUCTO:   { bg: 'rgba(201,162,39,0.15)',  color: '#C9A227', label: 'Producto'  },
  PASO:       { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Paso'      },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'    },
};

/**
 * El curso avanza en parejas teoría + práctica semanales. El sílabo entrega
 * las dos listas por separado, así que aquí se agrupan por unidad temática
 * conservando el orden original de cada serie.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — PRODUCCIÓN DE CONOCIMIENTO EN CIENCIAS SOCIALES ────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — Producción de conocimiento en ciencias sociales',
    fechas: '2 teorías · 2 prácticas',
    actividades: [
      {
        id: 'cso-t-1',
        tipo: 'TEORIA',
        unidad: 'CONOCIMIENTO',
        codigo: 'T1',
        titulo: 'T1 — Surgimiento de las ciencias sociales y la modernidad',
        fecha: 'Teoría 1 de 14',
        hora: '—',
        subtemas: [
          'Modernidad y nacimiento del pensamiento científico social',
          'Ramas de las ciencias sociales',
          'Abordajes inter y multidisciplinarios',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-1',
        tipo: 'PRACTICA',
        unidad: 'CONOCIMIENTO',
        codigo: 'P1',
        titulo: 'P1 — Surgimiento de la ciencia',
        fecha: 'Práctica 1 de 12',
        hora: '—',
        subtemas: [
          'Trabajo colaborativo en grupo',
          'Exposición semanal',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-2',
        tipo: 'TEORIA',
        unidad: 'CONOCIMIENTO',
        codigo: 'T2',
        titulo: 'T2 — El aporte vigente de los fundadores. Descolonización epistémica',
        fecha: 'Teoría 2 de 14',
        hora: '—',
        subtemas: [
          'Comte, Durkheim, Marx y Weber',
          'Perspectivas metodológicas',
          'Descolonización de las teorías del pensamiento crítico',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-2',
        tipo: 'PRACTICA',
        unidad: 'CONOCIMIENTO',
        codigo: 'P2',
        titulo: 'P2 — Técnicas cuantitativas y cualitativas. Historias de vida',
        fecha: 'Práctica 2 de 12',
        hora: '—',
        subtemas: [
          'Encuesta, entrevista y observación',
          'Historias de vida',
          'Diseño de instrumentos',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 2 — CONTEXTO CULTURAL Y SOCIEDAD PERUANA ───────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — Contexto cultural y sociedad peruana',
    fechas: '5 teorías · 4 prácticas',
    actividades: [
      {
        id: 'cso-t-3',
        tipo: 'TEORIA',
        unidad: 'CONTEXTO',
        codigo: 'T3',
        titulo: 'T3 — Sociedad humana y sociedad animal',
        fecha: 'Teoría 3 de 14',
        hora: '—',
        subtemas: [
          'Funciones de la sociedad',
          'Tipos de sociedad',
          'Cultura y organización social',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-3',
        tipo: 'PRACTICA',
        unidad: 'CONTEXTO',
        codigo: 'P3',
        titulo: 'P3 — Sistemas de estratificación',
        fecha: 'Práctica 3 de 12',
        hora: '—',
        subtemas: [
          'Clase, casta y estamento',
          'Movilidad social',
          'Estratificación en el Perú',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-4',
        tipo: 'TEORIA',
        unidad: 'CONTEXTO',
        codigo: 'T4',
        titulo: 'T4 — Socialización y personalidad. Estilo de vida',
        fecha: 'Teoría 4 de 14',
        hora: '—',
        subtemas: [
          'Socialización primaria y secundaria',
          'Personalidad y determinantes sociales',
          'Estilo de vida y salud',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-4',
        tipo: 'PRACTICA',
        unidad: 'CONTEXTO',
        codigo: 'P4',
        titulo: 'P4 — Los agentes de socialización',
        fecha: 'Práctica 4 de 12',
        hora: '—',
        subtemas: [
          'Familia, escuela y grupo de pares',
          'Medios de comunicación y redes sociales',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-5',
        tipo: 'TEORIA',
        unidad: 'CONTEXTO',
        codigo: 'T5',
        titulo: 'T5 — Violencia estructural. Roles de género',
        fecha: 'Teoría 5 de 14',
        hora: '—',
        subtemas: [
          'Violencia estructural y simbólica',
          'Roles de género',
          'Problemática de la mujer',
          'Violencia familiar y salud mental',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-5',
        tipo: 'PRACTICA',
        unidad: 'CONTEXTO',
        codigo: 'P5',
        titulo: 'P5 — Discriminación por género y lugar de nacimiento',
        fecha: 'Práctica 5 de 12',
        hora: '—',
        subtemas: [
          'Casos de discriminación en el Perú',
          'Brechas de género',
          'Migración interna',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-6',
        tipo: 'TEORIA',
        unidad: 'CONTEXTO',
        codigo: 'T6',
        titulo: 'T6 — Procesos culturales',
        fecha: 'Teoría 6 de 14',
        hora: '—',
        subtemas: [
          'Identidad cultural',
          'Endoculturación y aculturación',
          'Sincretismo',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-6',
        tipo: 'PRACTICA',
        unidad: 'CONTEXTO',
        codigo: 'P6',
        titulo: 'P6 — Políticas culturales: multiculturalidad e interculturalidad',
        fecha: 'Práctica 6 de 12',
        hora: '—',
        subtemas: [
          'Multiculturalidad vs. interculturalidad',
          'Políticas públicas culturales',
          'Interculturalidad en salud',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-10',
        tipo: 'TEORIA',
        unidad: 'CONTEXTO',
        codigo: 'T10',
        titulo: 'T10 — El racismo: definición y dimensiones',
        fecha: 'Teoría 10 de 14',
        hora: '—',
        subtemas: [
          'Racismo estructural e institucional',
          'Dimensiones del racismo en el Perú',
          'Discriminación y acceso a servicios',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 3 — PERSPECTIVA HISTÓRICA Y POLÍTICA ───────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — Perspectiva histórica y política',
    fechas: '7 teorías · 6 prácticas',
    actividades: [
      {
        id: 'cso-t-7',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T7',
        titulo: 'T7 — Desarrollo de las sociedades indígenas prehispánicas',
        fecha: 'Teoría 7 de 14',
        hora: '—',
        subtemas: [
          'Organización social andina',
          'Reciprocidad y redistribución',
          'El Tahuantinsuyo',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-7',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P7',
        titulo: 'P7 — Crisis y derrota del Tahuantinsuyo',
        fecha: 'Práctica 7 de 12',
        hora: '—',
        subtemas: [
          'Guerra civil inca',
          'La conquista española',
          'Consecuencias demográficas',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-8',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T8',
        titulo: 'T8 — Conformación de la sociedad virreinal',
        fecha: 'Teoría 8 de 14',
        hora: '—',
        subtemas: [
          'Organización territorial y demográfica',
          'Estructura política del virreinato',
          'Economía colonial: mita y encomienda',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-8',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P8',
        titulo: 'P8 — La independencia y surgimiento de la República',
        fecha: 'Práctica 8 de 12',
        hora: '—',
        subtemas: [
          'Surgimiento del Estado-Nación',
          'Caudillismo y primeras décadas republicanas',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-9',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T9',
        titulo: 'T9 — Cambio social, económico y cultural republicano en el siglo XX',
        fecha: 'Teoría 9 de 14',
        hora: '—',
        subtemas: [
          'Urbanización y migración a la costa',
          'Reforma agraria',
          'Transformaciones culturales',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-9',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P9',
        titulo: 'P9 — Conflictos mineros',
        fecha: 'Práctica 9 de 12',
        hora: '—',
        subtemas: [
          'Conflictos socioambientales',
          'Movimientos sociales',
          'Rol del Estado y de las empresas',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-11',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T11',
        titulo: 'T11 — Pobreza, desarrollo humano y conflictos sociales',
        fecha: 'Teoría 11 de 14',
        hora: '—',
        subtemas: [
          'Medición de la pobreza',
          'Índice de desarrollo humano',
          'Política social y rol del Estado',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-10',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P10',
        titulo: 'P10 — Procesos económicos del Perú',
        fecha: 'Práctica 10 de 12',
        hora: '—',
        subtemas: [
          'Ciclos económicos peruanos',
          'Exportación de materias primas',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-12',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T12',
        titulo: 'T12 — El PBI en la historia',
        fecha: 'Teoría 12 de 14',
        hora: '—',
        subtemas: [
          'Hiperinflación',
          'Crisis económica',
          'Economía informal',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-11',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P11',
        titulo: 'P11 — Política económica en EE.UU., Inglaterra, Latinoamérica y Perú',
        fecha: 'Práctica 11 de 12',
        hora: '—',
        subtemas: [
          'Comparación de modelos económicos',
          'Reformas estructurales',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-13',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T13',
        titulo: 'T13 — Estado intervencionista vs. neoliberalismo',
        fecha: 'Teoría 13 de 14',
        hora: '—',
        subtemas: [
          'Pensamiento liberal y neoliberal',
          'Derechos humanos y política social',
          'Rol del Estado en la economía',
        ],
        docentes: [],
      },
      {
        id: 'cso-p-12',
        tipo: 'PRACTICA',
        unidad: 'HISTORIA',
        codigo: 'P12',
        titulo: 'P12 — Gobiernos autoritarios en América Latina',
        fecha: 'Práctica 12 de 12',
        hora: '—',
        subtemas: [
          'Dictaduras del siglo XX',
          'Transiciones democráticas',
        ],
        docentes: [],
      },
      {
        id: 'cso-t-14',
        tipo: 'TEORIA',
        unidad: 'HISTORIA',
        codigo: 'T14',
        titulo: 'T14 — Regímenes comunistas actuales y terrorismo',
        fecha: 'Teoría 14 de 14',
        hora: '—',
        subtemas: [
          'Cuba y China',
          'Sendero Luminoso',
          'Violencia política en el Perú',
        ],
        docentes: [],
      },
    ],
  },

  // ─── PRODUCTOS ACADÉMICOS ──────────────────────────────────────────────────
  {
    id: 'productos',
    titulo: 'Productos académicos',
    fechas: 'Se trabajan todo el semestre',
    actividades: [
      {
        id: 'cso-monografia',
        tipo: 'PRODUCTO',
        unidad: 'HISTORIA',
        titulo: 'Monografía grupal',
        fecha: 'Grupos de hasta 5 estudiantes',
        hora: '—',
        subtemas: [
          'Elección del tema y estado de la cuestión',
          'Trabajo de campo / revisión de fuentes',
          'Redacción y sustentación final',
        ],
        docentes: [],
        nota: 'Exposiciones y monografía valen 9% de la nota final.',
      },
      {
        id: 'cso-exposiciones',
        tipo: 'PRODUCTO',
        unidad: 'HISTORIA',
        titulo: 'Exposiciones semanales de los trabajos colaborativos',
        fecha: 'Una por sesión práctica',
        hora: '—',
        subtemas: [
          'Presentación grupal del trabajo de la semana',
          'Retroalimentación del docente',
        ],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIONES ──────────────────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Evaluaciones',
    fechas: 'Pasos, trabajos cooperativos y exámenes',
    esEvaluacion: true,
    actividades: [
      {
        id: 'cso-paso-1',
        tipo: 'PASO',
        unidad: 'EVALUACION',
        titulo: 'Paso 1',
        fecha: 'Primer tercio del semestre',
        hora: '—',
        subtemas: ['Evaluación de avance de la Unidad 1'],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
      {
        id: 'cso-cooperativo-1',
        tipo: 'PASO',
        unidad: 'EVALUACION',
        titulo: 'Trabajo cooperativo 1',
        fecha: 'Antes del examen parcial',
        hora: '—',
        subtemas: ['Producto grupal de las sesiones prácticas'],
        docentes: [],
        nota: 'Vale 8% de la nota final.',
      },
      {
        id: 'cso-examen-parcial',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen parcial',
        fecha: 'Mitad del semestre',
        hora: '—',
        subtemas: ['Cubre las Unidades 1 y 2'],
        docentes: [],
        nota: 'Vale 18% de la nota final.',
      },
      {
        id: 'cso-paso-2',
        tipo: 'PASO',
        unidad: 'EVALUACION',
        titulo: 'Paso 2',
        fecha: 'Segundo tercio del semestre',
        hora: '—',
        subtemas: ['Evaluación de avance de la Unidad 3'],
        docentes: [],
        nota: 'Vale 18% de la nota final.',
      },
      {
        id: 'cso-cooperativo-2',
        tipo: 'PASO',
        unidad: 'EVALUACION',
        titulo: 'Trabajo cooperativo 2',
        fecha: 'Antes del examen final',
        hora: '—',
        subtemas: ['Producto grupal de las sesiones prácticas'],
        docentes: [],
        nota: 'Vale 12% de la nota final.',
      },
      {
        id: 'cso-examen-final',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen final',
        fecha: 'Fin del semestre',
        hora: '—',
        subtemas: [
          'Cubre la Unidad 3',
          'Incluye monografía y exposiciones',
        ],
        docentes: [],
        nota: 'Vale 25% de la nota final.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Ciencias Sociales en el Contexto Actual',
  codigo: 'U0688',
  carrera: 'Medicina · UPCH',
  duracion: '19 ago – 14 dic 2024',
  creditos: '03 créditos · 32h teoría / 32h práctica',
  coordinadora: 'Mg. Gonzalo Ríos Monzón',
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
