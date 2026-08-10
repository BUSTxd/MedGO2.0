export type TipoActividad =
  | 'TEORIA'
  | 'PD'
  | 'LAB'
  | 'TALLER'
  | 'PC'
  | 'EXAMEN-T';

export type Unidad =
  | 'CARBONO'
  | 'REACCIONES_I'
  | 'REACCIONES_II'
  | 'BIOMOLECULAS'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código del sílabo: S1–S14 (capítulos I–XIV), PD01–PD08, Lab01–Lab04, PC01–PC04. */
  codigo?: string;
  titulo: string;
  /** Posición dentro de su serie: el sílabo ordena por capítulo, no por fecha. */
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /**
   * Banqueo en PDF: las prácticas calificadas de años anteriores. Va en la
   * tarjeta «Banqueo», no en «Resumen» — son exámenes para practicar, no
   * material de lectura. Mismo campo y mismo visor que los propuestos de
   * Física (ver `PropuestosPdfRef` en `StudyMaterialSection`).
   */
  propuestos?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /** ISO date YYYY-MM-DD; usado para "Próximos exámenes" en el home. */
  fechaISO?: string;
  /** Sobreescribe el destino del card en el sílabo. */
  linkOverride?: string;
  /** No tenemos material propio de esta actividad: en vez de las 3 tarjetas de
   *  estudio apagadas, la clase muestra el aviso con los datos de contacto. */
  sinMaterial?: boolean;
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  CARBONO:       '#9B8EF8',
  REACCIONES_I:  '#3b9edd',
  REACCIONES_II: '#F5A623',
  BIOMOLECULAS:  '#2DC99A',
  EVALUACION:    '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEORIA:     { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Teoría'          },
  PD:         { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'Práctica dirig.' },
  LAB:        { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Laboratorio'     },
  TALLER:     { bg: 'rgba(20,184,166,0.15)',  color: '#14B8A6', label: 'Taller'          },
  PC:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Práctica calif.' },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'          },
};

/**
 * El curso se estructura en 4 unidades con 14 capítulos (una sesión teórica
 * por capítulo). Las prácticas dirigidas, laboratorios y talleres se reparten
 * en la unidad a la que corresponde su contenido.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — EL ÁTOMO DE CARBONO ────────────────────────────────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — El átomo de carbono',
    fechas: 'Caps. I–III · 3 sesiones · 3 PD · 1 laboratorio',
    actividades: [
      {
        id: 'qor-s-1',
        tipo: 'TEORIA',
        unidad: 'CARBONO',
        codigo: 'Cap. I',
        titulo: 'S1 — Estructura molecular y propiedades',
        fecha: 'Sesión 1 de 14',
        hora: '—',
        subtemas: [
          'Tetravalencia del carbono',
          'Orbitales atómicos y enlace covalente',
          'Hibridación sp³, sp² y sp',
          'Fórmulas estructurales y esqueletales',
        ],
        docentes: [],
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-s-1-tablas', label: 'Resumen — tablas' },
            { id: 'qor-s-1-visual', label: 'Resumen — visual' },
          ],
        },
      },
      {
        id: 'qor-pd-1',
        tipo: 'PD',
        unidad: 'CARBONO',
        codigo: 'PD01',
        titulo: 'PD01 — Estructura molecular y propiedades estructurales',
        fecha: 'Práctica dirigida 1 de 8',
        hora: '—',
        subtemas: [
          'Ejercicios de hibridación y geometría',
          'Grupos funcionales y nomenclatura',
        ],
        docentes: [],
        nota: 'Las prácticas dirigidas valen en conjunto 15% de la nota final y no son recuperables.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-2',
        tipo: 'TEORIA',
        unidad: 'CARBONO',
        codigo: 'Cap. II',
        titulo: 'S2 — Efectos electrónicos y resonancia',
        fecha: 'Sesión 2 de 14',
        hora: '—',
        subtemas: [
          'Efecto inductivo y efecto mesómero',
          'Estructuras resonantes y estabilidad',
          'Deslocalización electrónica',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-2',
        tipo: 'PD',
        unidad: 'CARBONO',
        codigo: 'PD02',
        titulo: 'PD02 — Deslocalización y resonancia',
        fecha: 'Práctica dirigida 2 de 8',
        hora: '—',
        subtemas: [
          'Dibujo de estructuras resonantes',
          'Comparación de estabilidad',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-3',
        tipo: 'TEORIA',
        unidad: 'CARBONO',
        codigo: 'Cap. III',
        titulo: 'S3 — Estereoquímica',
        fecha: 'Sesión 3 de 14',
        hora: '—',
        subtemas: [
          'Isomería constitucional y estereoisomería',
          'Quiralidad y centros estereogénicos',
          'Configuración R/S y proyecciones de Fischer',
          'Enantiómeros, diastereómeros y actividad óptica',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-3',
        tipo: 'PD',
        unidad: 'CARBONO',
        codigo: 'PD03',
        titulo: 'PD03 — Estereoquímica',
        fecha: 'Práctica dirigida 3 de 8',
        hora: '—',
        subtemas: [
          'Asignación R/S',
          'Identificación de relaciones estereoisoméricas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-lab-1',
        tipo: 'LAB',
        unidad: 'CARBONO',
        codigo: 'Lab 01',
        titulo: 'Lab 01 — Estereoquímica',
        fecha: 'Laboratorio 1 de 4',
        hora: '—',
        subtemas: [
          'Modelos moleculares',
          'Isómeros ópticos y geométricos',
          'Polarimetría',
        ],
        docentes: [],
        nota: 'Los laboratorios valen en conjunto 15% de la nota final y no son recuperables (ausencia = 0).',
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── UNIDAD 2 — PROPIEDADES Y REACCIONES ORGÁNICAS I ───────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — Propiedades y reacciones orgánicas I',
    fechas: 'Caps. IV–VII · 4 sesiones · 3 PD',
    actividades: [
      {
        id: 'qor-s-4',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_I',
        codigo: 'Cap. IV',
        titulo: 'S4 — Propiedades físicas',
        fecha: 'Sesión 4 de 14',
        hora: '—',
        subtemas: [
          'Fuerzas intermoleculares',
          'Punto de ebullición y fusión',
          'Solubilidad y polaridad',
        ],
        docentes: [],
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-s-4', label: 'Resumen — tablas' },
            { id: 'qor-s-4-visual', label: 'Resumen — visual' },
          ],
        },
      },
      {
        id: 'qor-pd-4',
        tipo: 'PD',
        unidad: 'REACCIONES_I',
        codigo: 'PD04',
        titulo: 'PD04 — Propiedades físicas',
        fecha: 'Práctica dirigida 4 de 8',
        hora: '—',
        subtemas: [
          'Comparación de puntos de ebullición',
          'Predicción de solubilidad',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-5',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_I',
        codigo: 'Cap. V',
        titulo: 'S5 — Ácidos y bases orgánicas',
        fecha: 'Sesión 5 de 14',
        hora: '—',
        subtemas: [
          'Teorías de Brønsted-Lowry y Lewis',
          'pKa y fuerza ácida',
          'Efecto de la estructura sobre la acidez',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-5',
        tipo: 'PD',
        unidad: 'REACCIONES_I',
        codigo: 'PD05',
        titulo: 'PD05 — Ácidos y bases',
        fecha: 'Práctica dirigida 5 de 8',
        hora: '—',
        subtemas: [
          'Ordenamiento por acidez',
          'Predicción del equilibrio ácido-base',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-6',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_I',
        codigo: 'Cap. VI',
        titulo: 'S6 — Introducción a las reacciones orgánicas',
        fecha: 'Sesión 6 de 14',
        hora: '—',
        subtemas: [
          'Nucleófilos y electrófilos',
          'Ruptura homolítica y heterolítica',
          'Intermediarios de reacción',
          'Diagramas de energía',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-7',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_I',
        codigo: 'Cap. VII',
        titulo: 'S7 — Reacciones de alquenos y alquinos',
        fecha: 'Sesión 7 de 14',
        hora: '—',
        subtemas: [
          'Adición electrofílica',
          'Regla de Markovnikov',
          'Hidrogenación, halogenación e hidratación',
          'Reacciones de alquinos',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-6',
        tipo: 'PD',
        unidad: 'REACCIONES_I',
        codigo: 'PD06',
        titulo: 'PD06 — Reacciones orgánicas. Alquenos y alquinos',
        fecha: 'Práctica dirigida 6 de 8',
        hora: '—',
        subtemas: [
          'Mecanismos de adición',
          'Predicción de productos',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── UNIDAD 3 — REACCIONES ORGÁNICAS II ────────────────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — Reacciones orgánicas II',
    fechas: 'Caps. VIII–X · 3 sesiones · 2 PD · 1 laboratorio',
    actividades: [
      {
        id: 'qor-s-8',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_II',
        codigo: 'Cap. VIII',
        titulo: 'S8 — Reacciones nucleofílicas I: alcoholes',
        fecha: 'Sesión 8 de 14',
        hora: '—',
        subtemas: [
          'Sustitución nucleofílica SN1 y SN2',
          'Eliminación E1 y E2',
          'Alcoholes: síntesis y reacciones',
          'Grupos salientes',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-7',
        tipo: 'PD',
        unidad: 'REACCIONES_II',
        codigo: 'PD07',
        titulo: 'PD07 — Sustitución nucleofílica y alcoholes',
        fecha: 'Práctica dirigida 7 de 8',
        hora: '—',
        subtemas: [
          'SN1 vs. SN2: factores determinantes',
          'Competencia sustitución / eliminación',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-9',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_II',
        codigo: 'Cap. IX',
        titulo: 'S9 — Reacciones nucleofílicas II: grupo carbonilo',
        fecha: 'Sesión 9 de 14',
        hora: '—',
        subtemas: [
          'Aldehídos y cetonas: adición nucleofílica',
          'Ácidos carboxílicos y derivados',
          'Sustitución nucleofílica acílica',
          'Enoles y enolatos',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-10',
        tipo: 'TEORIA',
        unidad: 'REACCIONES_II',
        codigo: 'Cap. X',
        titulo: 'S10 — Aromaticidad y sustitución electrofílica',
        fecha: 'Sesión 10 de 14',
        hora: '—',
        subtemas: [
          'Criterios de aromaticidad y regla de Hückel',
          'Sustitución electrofílica aromática',
          'Efecto de los sustituyentes y orientación',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-pd-8',
        tipo: 'PD',
        unidad: 'REACCIONES_II',
        codigo: 'PD08',
        titulo: 'PD08 — Aldehídos, cetonas, ácidos carboxílicos y aromáticos',
        fecha: 'Práctica dirigida 8 de 8',
        hora: '—',
        subtemas: [
          'Mecanismos del grupo carbonilo',
          'Sustitución electrofílica aromática',
        ],
        docentes: [],
        nota: 'El sílabo pondera 9 prácticas dirigidas; la tabla de temas lista 8.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-lab-2',
        tipo: 'LAB',
        unidad: 'REACCIONES_II',
        codigo: 'Lab 02',
        titulo: 'Lab 02 — Reconocimiento de grupos funcionales',
        fecha: 'Laboratorio 2 de 4',
        hora: '—',
        subtemas: [
          'Ensayos de identificación',
          'Alcoholes, aldehídos, cetonas y ácidos',
          'Marcha analítica orgánica',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── UNIDAD 4 — BIOMOLÉCULAS ───────────────────────────────────────────────
  {
    id: 'u4',
    titulo: 'Unidad 4 — Biomoléculas',
    fechas: 'Caps. XI–XIV · 4 sesiones · 2 laboratorios · taller científico',
    actividades: [
      {
        id: 'qor-s-11',
        tipo: 'TEORIA',
        unidad: 'BIOMOLECULAS',
        codigo: 'Cap. XI',
        titulo: 'S11 — Carbohidratos',
        fecha: 'Sesión 11 de 14',
        hora: '—',
        subtemas: [
          'Monosacáridos: proyecciones de Fischer y Haworth',
          'Mutarrotación y anómeros',
          'Enlace glucosídico',
          'Azúcares reductores',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-lab-3',
        tipo: 'LAB',
        unidad: 'BIOMOLECULAS',
        codigo: 'Lab 03',
        titulo: 'Lab 03 — Carbohidratos',
        fecha: 'Laboratorio 3 de 4',
        hora: '—',
        subtemas: [
          'Ensayo de Molisch, Benedict y Fehling',
          'Hidrólisis de disacáridos',
          'Identificación de almidón',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-12',
        tipo: 'TEORIA',
        unidad: 'BIOMOLECULAS',
        codigo: 'Cap. XII',
        titulo: 'S12 — Aminoácidos y proteínas',
        fecha: 'Sesión 12 de 14',
        hora: '—',
        subtemas: [
          'Estructura y clasificación de aminoácidos',
          'Punto isoeléctrico y comportamiento ácido-base',
          'Enlace peptídico',
          'Niveles estructurales de las proteínas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-lab-4',
        tipo: 'LAB',
        unidad: 'BIOMOLECULAS',
        codigo: 'Lab 04',
        titulo: 'Lab 04 — Aminoácidos y proteínas',
        fecha: 'Laboratorio 4 de 4',
        hora: '—',
        subtemas: [
          'Reacción de Biuret y ninhidrina',
          'Desnaturalización proteica',
          'Precipitación por pH y temperatura',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-13',
        tipo: 'TEORIA',
        unidad: 'BIOMOLECULAS',
        codigo: 'Cap. XIII',
        titulo: 'S13 — Lípidos y compuestos relacionados',
        fecha: 'Sesión 13 de 14',
        hora: '—',
        subtemas: [
          'Ácidos grasos saturados e insaturados',
          'Triglicéridos, fosfolípidos y esfingolípidos',
          'Saponificación',
          'Esteroides y terpenos',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-s-14',
        tipo: 'TEORIA',
        unidad: 'BIOMOLECULAS',
        codigo: 'Cap. XIV',
        titulo: 'S14 — Reacciones de alcanos: sustitución radicalaria',
        fecha: 'Sesión 14 de 14',
        hora: '—',
        subtemas: [
          'Iniciación, propagación y terminación',
          'Halogenación de alcanos',
          'Estabilidad de radicales',
          'Selectividad',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'qor-taller-1',
        tipo: 'TALLER',
        unidad: 'BIOMOLECULAS',
        titulo: 'Taller científico 1 — Discusión de artículos',
        fecha: 'Sesión 1 de 2',
        hora: '—',
        subtemas: [],
        docentes: [],
        sinMaterial: true,
      },
      {
        id: 'qor-taller-2',
        tipo: 'TALLER',
        unidad: 'BIOMOLECULAS',
        titulo: 'Taller científico 2 — Discusión de artículos',
        fecha: 'Sesión 2 de 2',
        hora: '—',
        subtemas: [],
        docentes: [],
        sinMaterial: true,
      },
    ],
  },

  // ─── EVALUACIONES ──────────────────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Evaluaciones',
    fechas: '4 prácticas calificadas · 2 exámenes cancelatorios',
    esEvaluacion: true,
    actividades: [
      {
        id: 'qor-pc-1',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC01',
        titulo: 'PC01 — Estructura molecular, deslocalización y resonancia',
        fecha: 'Práctica calificada 1 de 4',
        hora: '—',
        subtemas: ['Capítulos I y II'],
        docentes: [],
        nota: 'Las 4 prácticas calificadas valen en conjunto 20% de la nota final y no son recuperables.',
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-pc-1-2018', label: 'PC01 — 2018' },
            { id: 'qor-pc-1-2019', label: 'PC01 — 2019' },
          ],
        },
      },
      {
        id: 'qor-pc-2',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC02',
        titulo: 'PC02 — Estereoquímica y propiedades físicas',
        fecha: 'Práctica calificada 2 de 4',
        hora: '—',
        subtemas: ['Capítulos III y IV'],
        docentes: [],
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-pc-2-2018', label: 'PC02 — 2018' },
            { id: 'qor-pc-2-2019', label: 'PC02 — 2019' },
          ],
        },
      },
      {
        id: 'qor-examen-parcial',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen parcial',
        fecha: 'Cierra las Unidades 1 y 2',
        hora: '—',
        subtemas: ['Capítulos I–VII'],
        docentes: [],
        nota: 'Examen cancelatorio: vale 20% y se promedia con el final.',
      },
      {
        id: 'qor-pc-3',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC03',
        titulo: 'PC03 — Sustitución nucleofílica y alcoholes',
        fecha: 'Práctica calificada 3 de 4',
        hora: '—',
        subtemas: ['Capítulo VIII'],
        docentes: [],
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-pc-3-2018', label: 'PC03 — 2018' },
            { id: 'qor-pc-3-2019', label: 'PC03 — 2019' },
          ],
        },
      },
      {
        id: 'qor-pc-4',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC04',
        titulo: 'PC04 — Aldehídos, cetonas, ácidos carboxílicos y aromáticos',
        fecha: 'Práctica calificada 4 de 4',
        hora: '—',
        subtemas: ['Capítulos IX y X'],
        docentes: [],
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'qor-pc-4-2018', label: 'PC04 — 2018' },
            { id: 'qor-pc-4-2019', label: 'PC04 — 2019' },
          ],
        },
      },
      {
        id: 'qor-examen-final',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen final',
        fecha: 'Cierra las Unidades 3 y 4',
        hora: '—',
        subtemas: ['Capítulos VIII–XIV'],
        docentes: [],
        nota: 'Examen cancelatorio: evalúa sólo lo visto desde el parcial. Vale 20%.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Química Orgánica',
  codigo: 'U0016',
  carrera: 'Medicina · UPCH',
  duracion: 'Semestre 2024-II',
  creditos: 'Prerrequisito: U0666',
  coordinadora: 'Equipo docente de Química Orgánica',
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
