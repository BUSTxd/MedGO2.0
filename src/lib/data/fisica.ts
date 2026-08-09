export type TipoActividad =
  | 'TEORIA'
  | 'TRABAJO'
  | 'PC'
  | 'EXAMEN-T';

export type Unidad =
  | 'MECANICA'
  | 'ONDAS_TERMO'
  | 'ELECTROMAGNETISMO'
  | 'OPTICA_MODERNA'
  | 'EVALUACION';

export interface ResumenOpcion {
  id: string;
  label: string;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código del sílabo: C1–C14 (clases), TG01–TG08, PC1–PC4. */
  codigo?: string;
  titulo: string;
  /** Posición dentro de su serie: el sílabo ordena por bloque, no por fecha. */
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /**
   * PDF de problemas propuestos. Sólo en C1–C4, donde la tarjeta «Banqueo» se
   * llama «Propuestos» (ver `banqueoLabelDe` en material-plan.ts). Abre en el
   * mismo visor a pantalla completa que `resumen`, con un id independiente en
   * el bucket (`{id}-prop`).
   */
  propuestos?: { tipo: 'pdf' };
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
  MECANICA:          '#5E9CD3',
  ONDAS_TERMO:       '#F5A623',
  ELECTROMAGNETISMO: '#9B8EF8',
  OPTICA_MODERNA:    '#2DC99A',
  EVALUACION:        '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEORIA:     { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Clase'          },
  TRABAJO:    { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Trabajo grupal' },
  PC:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Práctica calif.'},
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'         },
};

/**
 * El sílabo lista las clases por unidad (orden aproximado) y los trabajos
 * grupales en una serie aparte; los TG04–TG08 aparecen agrupados en una sola
 * fila ("uno por bloque temático") y aquí se despliegan uno por unidad.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — MECÁNICA ───────────────────────────────────────────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — Mecánica',
    fechas: '4 clases · 3 trabajos grupales',
    actividades: [
      {
        id: 'fis-c-1',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C1',
        titulo: 'C1 — Presentación del curso. Leyes de Newton del movimiento',
        fecha: 'Clase 1 de 14',
        hora: '—',
        subtemas: [
          'Primera, segunda y tercera ley de Newton',
          'Diagramas de cuerpo libre',
          'Fuerzas de fricción y aplicaciones biomecánicas',
        ],
        docentes: ['Dr. Erwin Haya Enríquez'],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
      },
      {
        id: 'fis-tg-1',
        tipo: 'TRABAJO',
        unidad: 'MECANICA',
        codigo: 'TG01',
        titulo: 'TG01 — Ejercicios y problemas sobre leyes de Newton',
        fecha: 'Trabajo grupal 1 de 8',
        hora: '—',
        subtemas: [
          'Resolución colaborativa de problemas',
          'Laboratorio virtual asincrónico',
        ],
        docentes: [],
        nota: 'Los trabajos grupales valen en conjunto 10% de la nota final.',
      },
      {
        id: 'fis-c-2',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C2',
        titulo: 'C2 — Trabajo y energía. Momento lineal, impulso y colisiones',
        fecha: 'Clase 2 de 14',
        hora: '—',
        subtemas: [
          'Trabajo, energía cinética y potencial',
          'Conservación de la energía mecánica',
          'Impulso y cantidad de movimiento',
          'Colisiones elásticas e inelásticas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
      },
      {
        id: 'fis-tg-2',
        tipo: 'TRABAJO',
        unidad: 'MECANICA',
        codigo: 'TG02',
        titulo: 'TG02 — Ejercicios y problemas de trabajo y energía',
        fecha: 'Trabajo grupal 2 de 8',
        hora: '—',
        subtemas: [
          'Problemas de conservación de energía',
          'Laboratorio virtual asincrónico',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-3',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C3',
        titulo: 'C3 — Rotación de cuerpos rígidos. Dinámica de rotación',
        fecha: 'Clase 3 de 14',
        hora: '—',
        subtemas: [
          'Momento de inercia y torque',
          'Momento angular y su conservación',
          'Equilibrio y elasticidad',
          'Palancas del cuerpo humano',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-4',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C4',
        titulo: 'C4 — Mecánica de fluidos. Hidrostática e hidrodinámica',
        fecha: 'Clase 4 de 14',
        hora: '—',
        subtemas: [
          'Presión, densidad y principio de Pascal',
          'Principio de Arquímedes',
          'Ecuación de continuidad y Bernoulli',
          'Viscosidad y flujo sanguíneo',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-3',
        tipo: 'TRABAJO',
        unidad: 'MECANICA',
        codigo: 'TG03',
        titulo: 'TG03 — Ejercicios sobre rotación y mecánica de fluidos',
        fecha: 'Trabajo grupal 3 de 8',
        hora: '—',
        subtemas: [
          'Problemas de torque y equilibrio',
          'Problemas de hidrodinámica',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 2 — OSCILACIONES, ONDAS Y TERMODINÁMICA ────────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — Oscilaciones, ondas y termodinámica',
    fechas: '3 clases · 2 trabajos grupales',
    actividades: [
      {
        id: 'fis-c-5',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C5',
        titulo: 'C5 — Movimiento periódico. Ondas mecánicas',
        fecha: 'Clase 5 de 14',
        hora: '—',
        subtemas: [
          'Movimiento armónico simple',
          'Péndulo y sistemas masa-resorte',
          'Ondas transversales y longitudinales',
          'Sonido y oído',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-4',
        tipo: 'TRABAJO',
        unidad: 'ONDAS_TERMO',
        codigo: 'TG04',
        titulo: 'TG04 — Ejercicios sobre movimiento periódico y ondas',
        fecha: 'Trabajo grupal 4 de 8',
        hora: '—',
        subtemas: [
          'Problemas de MAS y ondas',
          'Intensidad sonora y decibeles',
        ],
        docentes: [],
        nota: 'El sílabo agrupa TG04–TG08 como "uno por bloque temático" (6 laboratorios virtuales asincrónicos en total).',
      },
      {
        id: 'fis-c-6',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C6',
        titulo: 'C6 — Temperatura y calor. Propiedades térmicas de la materia',
        fecha: 'Clase 6 de 14',
        hora: '—',
        subtemas: [
          'Escalas de temperatura y dilatación',
          'Calor específico y cambios de fase',
          'Conducción, convección y radiación',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-7',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C7',
        titulo: 'C7 — Leyes de la termodinámica',
        fecha: 'Clase 7 de 14',
        hora: '—',
        subtemas: [
          'Primera ley y procesos termodinámicos',
          'Segunda ley y entropía',
          'Máquinas térmicas y eficiencia',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-5',
        tipo: 'TRABAJO',
        unidad: 'ONDAS_TERMO',
        codigo: 'TG05',
        titulo: 'TG05 — Ejercicios de termodinámica',
        fecha: 'Trabajo grupal 5 de 8',
        hora: '—',
        subtemas: [
          'Problemas de calorimetría',
          'Problemas de procesos termodinámicos',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 3 — ELECTROMAGNETISMO ──────────────────────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — Electromagnetismo',
    fechas: '5 clases · 2 trabajos grupales',
    actividades: [
      {
        id: 'fis-c-8',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C8',
        titulo: 'C8 — Carga eléctrica, campo eléctrico y ley de Gauss',
        fecha: 'Clase 8 de 14',
        hora: '—',
        subtemas: [
          'Ley de Coulomb',
          'Campo eléctrico y líneas de campo',
          'Ley de Gauss y aplicaciones',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-9',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C9',
        titulo: 'C9 — Potencial eléctrico y capacitancia',
        fecha: 'Clase 9 de 14',
        hora: '—',
        subtemas: [
          'Diferencia de potencial y superficies equipotenciales',
          'Capacitores y dieléctricos',
          'Energía almacenada. Aplicación al desfibrilador',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-6',
        tipo: 'TRABAJO',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'TG06',
        titulo: 'TG06 — Ejercicios de campo y potencial eléctrico',
        fecha: 'Trabajo grupal 6 de 8',
        hora: '—',
        subtemas: [
          'Problemas de electrostática',
          'Problemas de capacitancia',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-10',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C10',
        titulo: 'C10 — Corriente, resistencia y fuerza electromotriz',
        fecha: 'Clase 10 de 14',
        hora: '—',
        subtemas: [
          'Ley de Ohm y resistividad',
          'Circuitos en serie y paralelo',
          'Leyes de Kirchhoff',
          'Efectos fisiológicos de la corriente',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-11',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C11',
        titulo: 'C11 — Campo y fuerzas magnéticas. Fuentes de campo magnético',
        fecha: 'Clase 11 de 14',
        hora: '—',
        subtemas: [
          'Fuerza de Lorentz',
          'Campo de una corriente. Ley de Ampère',
          'Aplicación a la resonancia magnética',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-12',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C12',
        titulo: 'C12 — Inducción electromagnética',
        fecha: 'Clase 12 de 14',
        hora: '—',
        subtemas: [
          'Ley de Faraday y ley de Lenz',
          'Inductancia y transformadores',
          'Corrientes inducidas',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-7',
        tipo: 'TRABAJO',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'TG07',
        titulo: 'TG07 — Ejercicios de circuitos y magnetismo',
        fecha: 'Trabajo grupal 7 de 8',
        hora: '—',
        subtemas: [
          'Problemas de circuitos',
          'Problemas de campo magnético e inducción',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 4 — ÓPTICA Y FÍSICA MODERNA ────────────────────────────────────
  {
    id: 'u4',
    titulo: 'Unidad 4 — Óptica y física moderna',
    fechas: '2 clases · 1 trabajo grupal',
    actividades: [
      {
        id: 'fis-c-13',
        tipo: 'TEORIA',
        unidad: 'OPTICA_MODERNA',
        codigo: 'C13',
        titulo: 'C13 — Naturaleza de la luz. Óptica geométrica',
        fecha: 'Clase 13 de 14',
        hora: '—',
        subtemas: [
          'Reflexión y refracción. Ley de Snell',
          'Espejos y lentes delgadas',
          'El ojo humano y defectos de refracción',
        ],
        docentes: [],
      },
      {
        id: 'fis-c-14',
        tipo: 'TEORIA',
        unidad: 'OPTICA_MODERNA',
        codigo: 'C14',
        titulo: 'C14 — Interferencia y difracción. Introducción a la física moderna',
        fecha: 'Clase 14 de 14',
        hora: '—',
        subtemas: [
          'Interferencia y difracción',
          'Fotones y dualidad onda-partícula',
          'Estructura atómica',
          'Física nuclear y radiación en medicina',
        ],
        docentes: [],
      },
      {
        id: 'fis-tg-8',
        tipo: 'TRABAJO',
        unidad: 'OPTICA_MODERNA',
        codigo: 'TG08',
        titulo: 'TG08 — Ejercicios de óptica y física moderna',
        fecha: 'Trabajo grupal 8 de 8',
        hora: '—',
        subtemas: [
          'Problemas de lentes y espejos',
          'Problemas de fotones y decaimiento radiactivo',
        ],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIONES ──────────────────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Evaluaciones',
    fechas: '4 prácticas calificadas · 4 exámenes',
    esEvaluacion: true,
    actividades: [
      {
        id: 'fis-examen-1',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen I',
        fecha: 'Cubre las semanas 1–3',
        hora: '—',
        subtemas: ['Leyes de Newton', 'Trabajo y energía'],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
      {
        id: 'fis-pc-1',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC1',
        titulo: 'Práctica calificada 1',
        fecha: 'Práctica calificada 1 de 4',
        hora: '—',
        subtemas: ['Evalúa lo visto hasta la sesión anterior'],
        docentes: [],
        nota: 'El promedio de las 4 prácticas calificadas vale 40% de la nota final.',
      },
      {
        id: 'fis-examen-parcial',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen parcial',
        fecha: 'Cubre las semanas 1–7',
        hora: '—',
        subtemas: ['Unidades 1 y 2'],
        docentes: [],
        nota: 'Vale 15% de la nota final.',
      },
      {
        id: 'fis-pc-2',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC2',
        titulo: 'Práctica calificada 2',
        fecha: 'Práctica calificada 2 de 4',
        hora: '—',
        subtemas: ['Evalúa lo visto hasta la sesión anterior'],
        docentes: [],
      },
      {
        id: 'fis-examen-2',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen II',
        fecha: 'Cubre las semanas 9–11',
        hora: '—',
        subtemas: ['Electromagnetismo'],
        docentes: [],
        nota: 'Vale 10% de la nota final.',
      },
      {
        id: 'fis-pc-3',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC3',
        titulo: 'Práctica calificada 3',
        fecha: 'Práctica calificada 3 de 4',
        hora: '—',
        subtemas: ['Evalúa lo visto hasta la sesión anterior'],
        docentes: [],
      },
      {
        id: 'fis-pc-4',
        tipo: 'PC',
        unidad: 'EVALUACION',
        codigo: 'PC4',
        titulo: 'Práctica calificada 4',
        fecha: 'Práctica calificada 4 de 4',
        hora: '—',
        subtemas: ['Evalúa lo visto hasta la sesión anterior'],
        docentes: [],
      },
      {
        id: 'fis-examen-final',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen final',
        fecha: 'Cubre las semanas 9–15',
        hora: '—',
        subtemas: ['Unidades 3 y 4'],
        docentes: [],
        nota: 'Vale 15% de la nota final.',
      },
    ],
  },
];

export const curso = {
  nombre: 'Física — Medicina',
  codigo: 'U0669',
  carrera: 'Medicina · UPCH',
  duracion: '18 ago – 12 dic 2025',
  creditos: '04 créditos · 48h teoría / 32h práctica',
  coordinadora: 'Dr. Erwin Haya Enríquez',
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
