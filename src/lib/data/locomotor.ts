export type TipoActividad =
  | 'MAGISTRAL'
  | 'INVERTIDA'
  | 'TBL'
  | 'SGP'
  | 'HISTOLOGIA'
  | 'ANATOMIA'
  | 'REPASO'
  | 'EXAMEN-P'
  | 'EXAMEN-T';

export type Unidad = 'DESARROLLO' | 'TEJIDOS' | 'FISIOLOGIA' | 'ANATOMIA' | 'EVALUACION';

/** Envase del resumen: PDF en el visor de siempre, o fragmento HTML propio. */
export type ResumenFormato = 'pdf' | 'html';

export interface ResumenOpcion {
  id: string;
  label: string;
  /** Va por opción además de por tarjeta: un picker puede mezclar HTML y PDF. */
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
  DESARROLLO: '#A855F7',
  TEJIDOS:    '#E879A6',
  FISIOLOGIA: '#3b9edd',
  ANATOMIA:   '#34C778',
  EVALUACION: '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',   color: '#3b9edd', label: 'Magistral'  },
  INVERTIDA:  { bg: 'rgba(20,184,166,0.15)',   color: '#14B8A6', label: 'Invertida'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',   color: '#F5A623', label: 'TBL'        },
  SGP:        { bg: 'rgba(155,142,248,0.15)',  color: '#9B8EF8', label: 'SGP'        },
  HISTOLOGIA: { bg: 'rgba(232,121,166,0.15)',  color: '#E879A6', label: 'Histología' },
  ANATOMIA:   { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Anatomía'   },
  REPASO:     { bg: 'rgba(148,163,184,0.16)',  color: '#94A3B8', label: 'Repaso'     },
  'EXAMEN-P': { bg: 'rgba(239,68,68,0.12)',    color: '#F87171', label: 'Examen P'   },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',    color: '#F87171', label: 'Examen T'   },
};

/**
 * Línea de tiempo canónica. El cronograma del sílabo repite cada práctica para
 * los subgrupos A1–A18 / B1–B18 (misma sesión, distinto horario, aula y
 * docente). Aquí se guarda una sola entrada por contenido.
 */
export const semanas: Semana[] = [
  // ─── SEMANA 1 — TEJIDO EPITELIAL Y MIEMBRO SUPERIOR ────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Tejido epitelial y hombro',
    fechas: '29 sep – 4 oct',
    actividades: [
      {
        id: 'bienvenida',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Presentación al curso',
        fecha: '29 sep',
        hora: '07:00–07:30',
        subtemas: ['Presentación del curso', 'Metodología y sistema de evaluación'],
        docentes: ['Dra. Wendy Sotelo'],
      },
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'TEJIDOS',
        titulo: 'Histología del tejido epitelial',
        fecha: '29 sep',
        hora: '07:30–09:00',
        subtemas: [
          'Estructuras que conforman el tejido epitelial',
          'Clasificación de los epitelios',
          'Uniones intercelulares',
        ],
        docentes: ['Dr. José Velásquez'],
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la región del hombro',
        fecha: '29 sep',
        hora: '11:00–13:00',
        subtemas: ['Osteología del miembro superior', 'Articulación del hombro', 'Axila'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: apuntes muy visuales (31 figuras), ver /addresumenhtml.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'loc-clase-2', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la región del brazo y antebrazo',
        fecha: '29 sep (grupo A) · 1 oct (grupo B)',
        hora: '14:00–16:00',
        subtemas: ['Compartimentos del brazo', 'Compartimentos del antebrazo', 'Plexo braquial'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: apuntes muy visuales (45 figuras), ver /addresumenhtml.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'loc-clase-3', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'embrio-1',
        tipo: 'MAGISTRAL',
        unidad: 'DESARROLLO',
        titulo: 'Embriología — Generalidades',
        fecha: '29 sep · asincrónico',
        hora: '—',
        subtemas: ['Generalidades del desarrollo embrionario'],
        docentes: ['Dra. Alicia Díaz'],
        nota: 'Clase asincrónica en Blackboard.',
      },
      {
        id: 'anat-1',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 1 — Región del hombro',
        fecha: '29 sep – 1 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección de la región del hombro',
          'Aula virtual: hombro, axila y brazo',
        ],
        docentes: ['Profesores de Anatomía'],
        nota: 'La misma práctica se repite por mesas (A1–A18 / B1–B18). Revisa tu grupo en el cronograma oficial.',
      },
      {
        id: 'laminas-1',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Revisión de láminas de Histología 1',
        fecha: '29 sep',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Shirley Alva', 'Dra. Mery Revilla'],
      },
      {
        id: 'embrio-2',
        tipo: 'MAGISTRAL',
        unidad: 'DESARROLLO',
        titulo: 'Embriología del aparato locomotor',
        fecha: '30 sep · asincrónico',
        hora: '—',
        subtemas: [
          'Derivados del esqueleto axial y periférico',
          'Formación del sistema músculo-esquelético',
          'Desarrollo normal de los miembros',
          'Proceso y tipos de osificación',
          'Desarrollo del tejido muscular',
          'Desarrollo anormal del sistema esquelético',
        ],
        docentes: ['Dra. Alicia Díaz'],
        nota: 'Clase asincrónica en Blackboard.',
      },
      {
        id: 'histo-1',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Práctica de Histología 1 — Tejido epitelial',
        fecha: '30 sep – 3 oct · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Epitelios de revestimiento', 'Epitelios glandulares', 'Especializaciones apicales'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        nota: 'Cada práctica se evalúa con 70% paso corto (Kahoot) + 30% presentación grupal. El promedio vale 30% del desempeño.',
      },
      {
        id: 'clase-4',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Fisiología del tejido óseo',
        fecha: '1 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Regulación hormonal del crecimiento óseo',
          'Formación y resorción ósea',
          'Mecanismos de la remodelación ósea',
        ],
        docentes: ['Dra. Elva Izquierdo'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 4 clases invertidas valen 25% de conocimientos.',
      },
      {
        id: 'anat-2',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 2 — Brazo y antebrazo',
        fecha: '2 – 3 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: ['Disección del brazo', 'Disección del antebrazo'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'FISIOLOGIA',
        titulo: 'TBL 1 — Hueso',
        fecha: '3 oct',
        hora: '07:00–09:00',
        subtemas: ['Metabolismo óseo', 'Remodelación ósea', 'Aplicación clínica'],
        docentes: ['Dra. Yanett Mendoza', 'Dr. Juan Carrasco', 'Dra. Karla Tafur', 'Dra. Wendy Sotelo'],
        nota: 'Evaluación: 35% individual + 25% grupal + 40% problema de aplicación (rúbrica). Promedio de los 2 TBL = 25% de conocimientos.',
        resumen: { tipo: 'pdf', opciones: [{ id: 'loc-tbl-1', label: 'Resumen' }] },
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la muñeca y mano',
        fecha: '4 oct',
        hora: '11:00–13:00',
        subtemas: ['Huesos del carpo', 'Compartimentos y túnel carpiano', 'Músculos intrínsecos de la mano'],
        docentes: ['Dr. Bruno Fernandini'],
        // Resumen en HTML: apuntes muy visuales (46 figuras), ver /addresumenhtml.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'loc-clase-5', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 1',
        fecha: '30 sep – 4 oct · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana (2 sesiones de 2 h)'],
        docentes: ['Tutores de SGP'],
        nota: 'Se califica al finalizar la semana. El promedio de los 4 SGP vale 20% del desempeño.',
      },
    ],
  },

  // ─── SEMANA 2 — TEJIDO CONECTIVO, MANO Y REGIÓN GLÚTEA ─────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — Tejido conectivo, mano y región glútea',
    fechas: '6 – 11 oct · 8 oct feriado',
    actividades: [
      {
        id: 'clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'TEJIDOS',
        titulo: 'Histología del tejido conectivo',
        fecha: '6 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Tejido conectivo propiamente dicho',
          'Conectivo especializado: cartílago y hueso',
          'Tipos de cartílago y su importancia',
          'Osificación',
        ],
        docentes: ['Dra. Shirley Alva'],
      },
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la región glútea',
        fecha: '6 oct',
        hora: '11:00–13:00',
        subtemas: ['Musculatura glútea', 'Nervio ciático', 'Foramen isquiático'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: apuntes muy visuales (16 figuras), ver /addresumenhtml.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'loc-clase-7', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'anat-3',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 3 — Muñeca y mano',
        fecha: '6 – 7 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección de la muñeca y la mano',
          'Aula virtual: antebrazo, mano y glúteo',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-2',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Revisión de láminas de Histología 2',
        fecha: '6 oct',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'histo-2',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Práctica de Histología 2 — Tejido conectivo',
        fecha: '7 – 10 oct · según subgrupo',
        hora: '08:00–12:00',
        subtemas: ['Fibras y matriz extracelular', 'Células del tejido conectivo', 'Tipos de tejido conectivo'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'anat-4',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 4 — Región glútea',
        fecha: '9 – 10 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: ['Disección de la región glútea', 'Nervio ciático'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Fisiología del músculo',
        fecha: '10 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Contracción y relajación muscular',
          'Transmisión neuromuscular',
          'Acoplamiento excitación-contracción',
        ],
        docentes: ['Dr. Armando Calvo'],
      },
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la región del muslo',
        fecha: '11 oct',
        hora: '11:00–13:00',
        subtemas: ['Osteología del miembro inferior', 'Compartimentos del muslo', 'Triángulo femoral'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: apuntes muy visuales (23 figuras), ver /addresumenhtml.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'loc-clase-9', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'radio-1',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía radiológica del miembro superior',
        fecha: '11 oct · asincrónico',
        hora: '—',
        subtemas: ['Radiografía de hombro, codo, muñeca y mano'],
        docentes: ['Dra. Rosa Laimes'],
        nota: 'Clase asincrónica en Blackboard.',
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 2',
        fecha: '6 – 11 oct · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana (2 sesiones de 2 h)'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── SEMANA 3 — TEJIDO MUSCULAR Y MIEMBRO INFERIOR ─────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Tejido muscular, cartílago y miembro inferior',
    fechas: '13 – 18 oct',
    actividades: [
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'TEJIDOS',
        titulo: 'Histología del tejido muscular',
        fecha: '13 oct',
        hora: '07:00–09:00',
        subtemas: ['Músculo esquelético', 'Músculo cardiaco', 'Músculo liso', 'Sarcómero'],
        docentes: ['Dr. José Velásquez'],
      },
      {
        id: 'clase-11',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la rodilla, región poplítea y pierna',
        fecha: '13 oct',
        hora: '11:00–13:00',
        subtemas: ['Articulación de la rodilla', 'Fosa poplítea', 'Compartimentos de la pierna'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'anat-5',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 5 — Región del muslo',
        fecha: '13 – 14 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección de la región del muslo',
          'Aula virtual: antebrazo, mano y región glútea',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-3',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Revisión de láminas de Histología 3',
        fecha: '13 oct',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'histo-3',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Práctica de Histología 3 — Cartílago, hueso y osificación',
        fecha: '14 – 17 oct · según subgrupo',
        hora: '08:00–11:00',
        subtemas: [
          'Cartílago hialino, elástico y fibroso',
          'Hueso compacto y esponjoso',
          'Osificación intramembranosa y endocondral',
        ],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'clase-12',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Fisiología de la vitamina D, calcio y fósforo',
        fecha: '15 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Metabolismo óseo',
          'Mecanismos reguladores del calcio y fósforo',
          'Paratohormona',
          'Vitamina D',
        ],
        docentes: ['Dr. Víctor Noriega'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 4 clases invertidas valen 25% de conocimientos.',
      },
      {
        id: 'examen-p1',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación continua 1 de práctica de Anatomía',
        fecha: '15 oct',
        fechaISO: '2025-10-15',
        hora: '14:00–18:00',
        subtemas: ['Cubre hombro, brazo, antebrazo, muñeca, mano y región glútea'],
        docentes: ['Profesores de Anatomía'],
        nota: 'Las 2 evaluaciones continuas valen 35% de la nota de anatomía; los 4 pasos cortos, 15%.',
      },
      {
        id: 'anat-6',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 6 — Rodilla, región poplítea y pierna',
        fecha: '16 – 17 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: ['Disección de la rodilla', 'Fosa poplítea', 'Pierna'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'FISIOLOGIA',
        titulo: 'TBL 2 — Músculo',
        fecha: '17 oct',
        hora: '07:00–09:00',
        subtemas: ['Contracción muscular', 'Transmisión neuromuscular', 'Aplicación clínica'],
        docentes: ['Dra. Yanett Mendoza', 'Dr. Juan Carrasco', 'Dra. Karla Tafur', 'Dra. Wendy Sotelo'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'loc-tbl-2', label: 'Resumen' }] },
      },
      {
        id: 'clase-13',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía del tobillo y pie',
        fecha: '18 oct',
        hora: '11:00–13:00',
        subtemas: ['Articulación del tobillo', 'Huesos del tarso', 'Arcos plantares'],
        docentes: ['Dr. Bruno Fernandini'],
      },
      {
        id: 'radio-2',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía radiológica del miembro inferior',
        fecha: '18 oct · asincrónico',
        hora: '—',
        subtemas: ['Radiografía de cadera, rodilla, tobillo y pie'],
        docentes: ['Dr. Walter Aliaga'],
        nota: 'Clase asincrónica en Blackboard.',
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 3',
        fecha: '13 – 18 oct · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana (2 sesiones de 2 h)'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── SEMANA 4 — SINOVIAL, OSTEOINMUNOLOGÍA Y REPASO ────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4 — Sinovial, osteoinmunología y repaso',
    fechas: '20 – 25 oct',
    actividades: [
      {
        id: 'clase-14',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Membrana sinovial y líquido sinovial',
        fecha: '20 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Membrana sinovial normal y sus funciones',
          'Producción del líquido sinovial',
          'Importancia del líquido sinovial',
        ],
        docentes: ['Dra. Yanett Mendoza'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 4 clases invertidas valen 25% de conocimientos.',
      },
      {
        id: 'repaso-anat',
        tipo: 'REPASO',
        unidad: 'ANATOMIA',
        titulo: 'Repaso teórico de Anatomía',
        fecha: '20 oct',
        hora: '11:00–13:00',
        subtemas: ['Integración del miembro superior e inferior'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'anat-7',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 7 — Tobillo y pie',
        fecha: '20 – 21 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección del tobillo y el pie',
          'Aula virtual: muslo, pierna y pie',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-4',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Revisión de láminas de Histología 4',
        fecha: '20 oct',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de todas las láminas del curso'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'histo-4',
        tipo: 'HISTOLOGIA',
        unidad: 'TEJIDOS',
        titulo: 'Práctica de Histología 4 — Tejido muscular y repaso',
        fecha: '21 – 24 oct · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Músculo esquelético, cardiaco y liso', 'Repaso integrador de todas las láminas'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
      },
      {
        id: 'clase-15',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Osteoinmunología',
        fecha: '22 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Mecanismos inmunológicos del sistema locomotor',
          'Interacción entre sistema inmune y hueso',
          'RANK / RANKL / osteoprotegerina',
        ],
        docentes: ['Dra. Elva Izquierdo'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 4 clases invertidas valen 25% de conocimientos.',
      },
      {
        id: 'repaso-anat-p',
        tipo: 'REPASO',
        unidad: 'ANATOMIA',
        titulo: 'Repaso de Anatomía en anfiteatro y aula virtual',
        fecha: '23 oct',
        hora: '14:00–18:00',
        subtemas: ['Repaso práctico sobre cadáver', 'Repaso en aula virtual'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'repaso-fisio',
        tipo: 'REPASO',
        unidad: 'FISIOLOGIA',
        titulo: 'Repaso de Fisiología',
        fecha: '24 oct',
        hora: '07:00–09:00',
        subtemas: ['Repaso integrador de fisiología ósea y muscular'],
        docentes: ['Dra. Yanett Mendoza'],
      },
      {
        id: 'examen-p2',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación continua 2 de práctica de Anatomía',
        fecha: '24 oct',
        fechaISO: '2025-10-24',
        hora: '14:00–18:00',
        subtemas: ['Cubre muslo, rodilla, pierna, tobillo y pie'],
        docentes: ['Profesores de Anatomía'],
        nota: 'El cronograma del sílabo imprime esta sesión como «Viernes 18/10/2024»; por su posición corresponde al viernes 24 de octubre. Confirma la fecha con el coordinador.',
      },
      {
        id: 'sgp-4',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 4',
        fecha: '20 – 25 oct · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana (2 sesiones de 2 h)'],
        docentes: ['Tutores de SGP'],
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ──────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación Final',
    fechas: '25 oct',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Final del Curso',
        fecha: '25 oct',
        fechaISO: '2025-10-25',
        hora: '14:30–16:30',
        subtemas: ['60 preguntas de opción múltiple', 'Cubre todos los contenidos', 'Presencial'],
        docentes: ['Dra. Wendy Sotelo'],
        nota: 'Vale 50% de conocimientos y exige un mínimo de 11.00. Quien desapruebe rinde el sustitutorio (nota máxima 11) el 7 de enero de 2026.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Aparato Locomotor',
  codigo: 'M2060',
  carrera: 'Medicina · UPCH',
  coordinadores: ['Dra. Wendy Sotelo', 'Mag. Víctor Noriega', 'Dr. Sabino Portugal', 'Dr. Marcos De La Cruz'],
  duracion: '29 sep – 25 oct 2025',
  creditos: '5 créditos · 48 h teoría + 64 h práctica',
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
