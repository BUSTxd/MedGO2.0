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

export type Unidad = 'DESARROLLO' | 'ESTRUCTURA' | 'FISIOLOGIA' | 'ANATOMIA' | 'EVALUACION';

/**
 * Formato del resumen. `pdf` sale del bucket `resumenes` y lo pinta react-pdf;
 * `html` es un fragmento servido por `/api/resumen-html` con las imágenes en
 * AVIF desde el bucket público — se usa cuando el material es muy visual y el
 * PDF saldría pesado y con el texto rasterizado.
 */
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
  ESTRUCTURA: '#E879A6',
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
 * Línea de tiempo canónica. El cronograma del sílabo repite cada práctica de
 * anatomía e histología para los subgrupos A1–A18 / B1–B18 (misma sesión,
 * distinto horario, aula y docente). Aquí se guarda una sola entrada por
 * contenido y el subgrupo queda como rango de fechas.
 */
export const semanas: Semana[] = [
  // ─── SEMANA 1 — CAVIDAD ORAL, ESÓFAGO Y PARED ABDOMINAL ────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1 — Cavidad oral, esófago y pared abdominal',
    fechas: '27 – 31 oct',
    actividades: [
      {
        id: 'bienvenida',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Bienvenida al curso',
        fecha: '27 oct',
        hora: '07:00–07:30',
        subtemas: ['Presentación del curso', 'Metodología y sistema de evaluación'],
        docentes: ['Dr. Alvaro Bellido Caparó'],
      },
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'ESTRUCTURA',
        titulo: 'Histología: estructura general, cavidad oral, glándulas salivales y esófago',
        fecha: '27 oct',
        hora: '07:30–09:00',
        subtemas: [
          'Capas de la pared del tracto gastrointestinal',
          'Células secretoras mucosas y serosas',
          'Lengua, encía y dientes',
          'Glándulas salivales',
          'Faringe y esófago',
        ],
        docentes: ['Dr. Sabino Portugal'],
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la boca y faringe',
        fecha: '27 oct',
        hora: '11:00–13:00',
        subtemas: ['Cavidad oral', 'Faringe', 'Esófago cervical'],
        docentes: ['Dr. Bruno Fernandini'],
        // Resumen en HTML: 81 figuras anatómicas. Como PDF pesaría decenas de
        // MB con el texto rasterizado; así son 108 KB + AVIF desde el CDN.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-2', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía de la pared abdominal',
        fecha: '27 oct (grupo A) · 29 oct (grupo B)',
        hora: '14:00–16:00',
        subtemas: [
          'Anatomía de superficie y topografía abdominal',
          'Pared anterolateral del abdomen',
          'Canal inguinal',
        ],
        docentes: ['Dr. Bruno Fernandini'],
        // Resumen en HTML: 33 figuras anatómicas.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-3', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'anat-1',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 1 — Boca y faringe',
        fecha: '27 – 31 oct · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección en cadáver: boca y faringe',
          'Aula virtual de Anatomía (Anatomage): boca y faringe',
        ],
        docentes: ['Profesores de Anatomía'],
        nota: 'La misma práctica se repite por mesas (A1–A18 / B1–B18). Revisa tu grupo en el cronograma oficial.',
      },
      {
        id: 'laminas-1',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Revisión virtual de láminas 1',
        fecha: '27 oct',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-1', label: 'Resumen' }] },
      },
      {
        id: 'histo-1',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Práctica de Histología 1 — De la boca a las glándulas salivales y esófago',
        fecha: '28 – 31 oct · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Lengua y dientes', 'Glándulas salivales', 'Faringe', 'Esófago'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        nota: 'Evaluación: 21% pasos cortos + 9% presentaciones grupales del total de histología (30% del desempeño).',
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-1', label: 'Resumen' }] },
      },
      {
        id: 'clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'ESTRUCTURA',
        titulo: 'Histología: estómago, intestino delgado y grueso, hígado, páncreas y vesícula biliar',
        fecha: '29 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Estructura regional del estómago',
          'Mucosa del intestino delgado y grueso',
          'Lobulillo hepático',
          'Páncreas exocrino',
          'Vesícula biliar',
        ],
        docentes: ['Dr. Sabino Portugal'],
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Regulación neural y peptídica',
        fecha: '31 oct',
        hora: '07:00–09:00',
        subtemas: [
          'Sistema endocrino, paracrino y neuroendocrino digestivo',
          'Sistema nervioso entérico',
          'Músculo liso gastrointestinal',
          'Péptidos reguladores',
        ],
        docentes: ['Dr. Jorge Espinoza'],
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 1',
        fecha: '27 – 31 oct · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
        nota: 'Se califica al finalizar la semana. El promedio de los 4 SGP vale 30% del desempeño.',
      },
    ],
  },

  // ─── SEMANA 2 — MOTILIDAD, SECRECIONES Y ABSORCIÓN ─────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2 — Motilidad, secreciones y absorción',
    fechas: '3 – 8 nov',
    actividades: [
      {
        id: 'clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Motilidad del sistema digestivo',
        fecha: '3 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Deglución: fase faríngea y esofágica',
          'Peristaltismo esofágico y esfínter esofágico inferior',
          'Relajación receptiva y vaciamiento gástrico',
          'Complejo motor migratorio',
          'Motilidad del colon y defecación',
        ],
        docentes: ['Dr. Jorge Espinoza'],
      },
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía del esófago y estómago',
        fecha: '3 nov',
        hora: '11:00–13:00',
        subtemas: ['Esófago torácico y abdominal', 'Estómago', 'Tronco celiaco', 'Peritoneo'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: 28 figuras anatómicas.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-7', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'anat-2',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 2 — Pared abdominal, canal inguinal y peritoneo',
        fecha: '3 – 5 nov · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección de la pared anterolateral del abdomen',
          'Canal inguinal',
          'Peritoneo',
          'Aula virtual: canal inguinal, esófago y estómago',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-2',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Revisión virtual de láminas 2',
        fecha: '3 nov',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-2', label: 'Resumen' }] },
      },
      {
        id: 'histo-2',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Práctica de Histología 2 — Estómago, intestino delgado y grueso',
        fecha: '4 – 7 nov · según subgrupo',
        hora: '08:00–11:00',
        subtemas: [
          'Mucosa gástrica: fúndica, cardial y pilórica',
          'Duodeno, yeyuno e íleon',
          'Colon y recto',
        ],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-2', label: 'Resumen' }] },
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Secreciones del sistema digestivo',
        fecha: '5 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Secreción de ácido: regulación y fármacos',
          'Pepsina y factor intrínseco',
          'Secreción pancreática: agua, electrolitos y enzimas',
          'Secreción biliar y función de la vesícula',
        ],
        docentes: ['Dr. Eduardo Monge'],
      },
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Digestión y absorción',
        fecha: '7 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Características de la mucosa que favorecen la absorción',
          'Carbohidratos: amilasas y disacaridasas',
          'Proteínas: peptidasas, péptidos y aminoácidos',
          'Lípidos: absorción de ácidos grasos',
          'Agua y electrolitos: sodio, cloro, potasio, calcio y hierro',
        ],
        docentes: ['Dr. Eduardo Monge'],
      },
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'FISIOLOGIA',
        titulo: 'TBL 1 — Secreción de ácido',
        fecha: '7 nov',
        hora: '11:00–13:00',
        subtemas: [
          'Anatomía funcional del estómago',
          'Mecanismo de la bomba de protones',
          'Regulación de la secreción ácida',
          'Fármacos antisecretores',
        ],
        docentes: ['Dra. Andrea Carlin', 'Dr. Luis Flores', 'Dr. Diego Huanay'],
        nota: 'Evaluación: 35% individual + 25% examen grupal + 40% trabajo grupal (rúbrica). Promedio de los 2 TBL = 15% de conocimientos.',
      },
      {
        id: 'anat-3',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 3 — Esófago y estómago',
        fecha: '6 – 7 nov · según mesa',
        hora: '14:00–18:00',
        subtemas: ['Disección del esófago abdominal', 'Estómago y tronco celiaco'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 2',
        fecha: '3 – 7 nov · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
      },
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía del intestino delgado y grueso',
        fecha: '8 nov',
        hora: '11:00–13:00',
        subtemas: ['Intestino delgado', 'Intestino grueso', 'Irrigación mesentérica'],
        docentes: ['Dr. Bruno Fernandini'],
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-10', label: 'Resumen', formato: 'html' }],
        },
      },
    ],
  },

  // ─── SEMANA 3 — HÍGADO, VÍAS BILIARES Y EMBRIOLOGÍA ────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3 — Hígado, vías biliares y embriología',
    fechas: '10 – 15 nov',
    actividades: [
      {
        id: 'clase-11',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Fisiología hepática',
        fecha: '10 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Estructura funcional del hígado e irrigación',
          'Función del hepatocito',
          'Metabolismo de la bilirrubina',
          'Formación de bilis',
          'Detoxificación de fármacos y toxinas',
        ],
        docentes: ['Dra. Claudia Alvizuri'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 2 clases invertidas valen 10% de conocimientos.',
      },
      {
        id: 'clase-12',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía del hígado y vías biliares',
        fecha: '10 nov',
        hora: '11:00–13:00',
        subtemas: ['Hígado: segmentación', 'Vesícula biliar', 'Vías biliares'],
        docentes: ['Dr. Marcos De La Cruz'],
        // Resumen en HTML: 29 figuras anatómicas.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-12', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'anat-4',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 4 — Intestino delgado y grueso',
        fecha: '10 – 11 nov · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección del intestino delgado y grueso',
          'Aula virtual: hígado, vías biliares, páncreas y bazo',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-3',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Revisión virtual de láminas 3',
        fecha: '10 nov',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de las láminas de la semana'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-3', label: 'Resumen' }] },
      },
      {
        id: 'histo-3',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Práctica de Histología 3 — Hígado, páncreas y vesícula biliar',
        fecha: '11 – 14 nov · según subgrupo',
        hora: '08:00–11:00',
        subtemas: ['Lobulillo hepático y espacio porta', 'Páncreas exocrino', 'Vesícula biliar'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: { tipo: 'pdf', opciones: [{ id: 'dig-histo-3', label: 'Resumen' }] },
      },
      {
        id: 'clase-13',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Absorción de vitaminas y minerales',
        fecha: '12 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Vitaminas hidrosolubles y liposolubles',
          'Absorción de calcio',
          'Absorción de hierro',
          'Absorción de vitamina B12 y factor intrínseco',
        ],
        docentes: ['Dr. Eduardo Monge'],
      },
      {
        id: 'examen-p1',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación práctica 1 de Anatomía',
        fecha: '12 nov',
        fechaISO: '2025-11-12',
        hora: '14:00–18:00',
        subtemas: ['Cubre boca, faringe, pared abdominal, peritoneo, esófago, estómago e intestinos'],
        docentes: ['Profesores de Anatomía'],
        nota: 'Cuenta para el 30% de evaluaciones prácticas dentro del 40% de anatomía (desempeño).',
      },
      {
        id: 'clase-14',
        tipo: 'MAGISTRAL',
        unidad: 'DESARROLLO',
        titulo: 'Embriología del aparato digestivo',
        fecha: '14 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Derivados del intestino anterior, medio y posterior',
          'Rotación gástrica y del intestino medio',
          'Origen de hígado, vesícula, páncreas y bazo',
          'Onfalocele, malrotación, atresia esofágica y estenosis pilórica',
          'Páncreas anular, divertículo de Meckel, hernia diafragmática y ano imperforado',
        ],
        docentes: ['Dra. Alicia Díaz'],
      },
      {
        id: 'anat-5',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 5 — Hígado y vías biliares',
        fecha: '13 – 14 nov · según mesa',
        hora: '14:00–18:00',
        subtemas: ['Disección del hígado', 'Vesícula y vías biliares'],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 3',
        fecha: '10 – 14 nov · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana'],
        docentes: ['Tutores de SGP'],
      },
      {
        id: 'clase-15',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía del páncreas y del bazo',
        fecha: '15 nov',
        hora: '11:00–13:00',
        subtemas: ['Páncreas', 'Bazo', 'Relaciones retroperitoneales'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
    ],
  },

  // ─── SEMANA 4 — MICROBIOTA, INMUNIDAD Y REPASO ─────────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4 — Microbiota, inmunidad e integración',
    fechas: '17 – 21 nov',
    actividades: [
      {
        id: 'clase-16',
        tipo: 'MAGISTRAL',
        unidad: 'FISIOLOGIA',
        titulo: 'Microbiota intestinal',
        fecha: '17 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Componentes de la microbiota',
          'Funciones e intervención en la digestión',
          'Mecanismo de defensa',
        ],
        docentes: ['Dr. Alvaro Bellido Caparó'],
      },
      {
        id: 'repaso-anat',
        tipo: 'REPASO',
        unidad: 'ANATOMIA',
        titulo: 'Repaso teórico de Anatomía',
        fecha: '17 nov',
        hora: '11:00–13:00',
        subtemas: ['Integración de todas las regiones disecadas'],
        docentes: ['Dr. Marcos De La Cruz'],
      },
      {
        id: 'anat-6',
        tipo: 'ANATOMIA',
        unidad: 'ANATOMIA',
        titulo: 'Práctica de Anatomía 6 — Páncreas y bazo',
        fecha: '17 – 18 nov · según mesa',
        hora: '14:00–18:00',
        subtemas: [
          'Disección del páncreas y el bazo',
          'Aula virtual: intestinos, hígado, vías biliares, páncreas y bazo',
        ],
        docentes: ['Profesores de Anatomía'],
      },
      {
        id: 'laminas-4',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Revisión virtual de láminas 4',
        fecha: '17 nov',
        hora: '21:00–22:00',
        subtemas: ['Repaso guiado de todas las láminas del curso'],
        docentes: ['Dra. Mery Revilla', 'Dra. Shirley Alva'],
        // Repaso: no tiene PDF propio, reutiliza los 3 resúmenes de histo-1/2/3
        // vía picker (2+ opciones abre selector en vez de cargar directo).
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'dig-histo-1', label: 'Práctica 1 — Boca a esófago' },
            { id: 'dig-histo-2', label: 'Práctica 2 — Estómago e intestinos' },
            { id: 'dig-histo-3', label: 'Práctica 3 — Hígado, páncreas y vesícula' },
          ],
        },
      },
      {
        id: 'histo-4',
        tipo: 'HISTOLOGIA',
        unidad: 'ESTRUCTURA',
        titulo: 'Práctica de Histología 4 — Repaso',
        fecha: '18 – 20 nov · según subgrupo',
        hora: '08:00–12:00',
        subtemas: ['Repaso integrador de todas las láminas del curso'],
        docentes: ['Dr. Sabino Portugal', 'Dra. Mery Revilla', 'Dra. Shirley Alva'],
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'dig-histo-1', label: 'Práctica 1 — Boca a esófago' },
            { id: 'dig-histo-2', label: 'Práctica 2 — Estómago e intestinos' },
            { id: 'dig-histo-3', label: 'Práctica 3 — Hígado, páncreas y vesícula' },
          ],
        },
      },
      {
        id: 'clase-17',
        tipo: 'MAGISTRAL',
        unidad: 'ANATOMIA',
        titulo: 'Anatomía radiológica del sistema digestivo',
        fecha: '19 nov',
        hora: '07:00–09:00',
        subtemas: ['Radiografía simple de abdomen', 'Estudios contrastados', 'TC abdominal'],
        docentes: ['Dr. Eduardo More Mori'],
      },
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'FISIOLOGIA',
        titulo: 'TBL 2 — Bilirrubina',
        fecha: '19 nov',
        hora: '11:00–13:00',
        subtemas: [
          'Metabolismo de la bilirrubina',
          'Bilirrubina directa e indirecta',
          'Ictericia prehepática, hepática y posthepática',
        ],
        docentes: ['Dra. Andrea Carlin', 'Dr. Alvaro Bellido', 'Dr. Luis Flores'],
      },
      {
        id: 'clase-18',
        tipo: 'INVERTIDA',
        unidad: 'FISIOLOGIA',
        titulo: 'Inmunología del tracto digestivo',
        fecha: '21 nov',
        hora: '07:00–09:00',
        subtemas: [
          'Tolerancia oral y factores que influyen',
          'Inmunoglobulinas asociadas a GALT',
          'Células principales de inmunidad hepática',
        ],
        docentes: ['Dr. Alvaro Bellido Caparó'],
        nota: 'Clase invertida: se toma un paso corto al inicio. Las 2 clases invertidas valen 10% de conocimientos.',
        // Resumen en HTML: 9 figuras (GALT, hígado, páncreas).
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'dig-clase-18', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'sgp-4',
        tipo: 'SGP',
        unidad: 'FISIOLOGIA',
        titulo: 'SGP 4 y retroalimentación final',
        fecha: '17 – 21 nov · por coordinar',
        hora: '—',
        subtemas: ['Caso clínico integrador de la semana', 'Retroalimentación final de SGP'],
        docentes: ['Tutores de SGP'],
      },
      {
        id: 'examen-p2',
        tipo: 'EXAMEN-P',
        unidad: 'EVALUACION',
        titulo: 'Evaluación práctica 2 de Anatomía',
        fecha: '21 nov',
        fechaISO: '2025-11-21',
        hora: '14:00–18:00',
        subtemas: ['Cubre hígado, vías biliares, páncreas, bazo y todo lo disecado en el curso'],
        docentes: ['Profesores de Anatomía'],
      },
    ],
  },

  // ─── EVALUACIÓN FINAL ──────────────────────────────────────────────────────
  {
    id: 'eval-final',
    titulo: 'Evaluación Final',
    fechas: '22 nov',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Teórico Final',
        fecha: '22 nov',
        fechaISO: '2025-11-22',
        hora: '14:30–16:30',
        subtemas: ['60 preguntas', 'Cubre las 4 unidades del curso', 'Presencial, sesión única'],
        docentes: ['Dr. Alvaro Bellido Caparó'],
        nota: 'Vale 70% de conocimientos y exige un mínimo de 11.00. Quien desapruebe rinde el sustitutorio, cuya nota máxima es 11.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Aparato Digestivo',
  codigo: 'M1549',
  carrera: 'Medicina · UPCH',
  coordinadores: ['Dr. Alvaro Bellido', 'Dr. Jorge Espinoza', 'Dr. Marcos De La Cruz', 'Dr. Sabino Portugal'],
  duracion: '27 oct – 22 nov 2025',
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
