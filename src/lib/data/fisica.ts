export type TipoActividad =
  | 'TEORIA'
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
  /** Código del sílabo: C1–C14 (clases), PC1–PC4. */
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
   * PDF de problemas propuestos. En C1–C4 la tarjeta «Banqueo» se llama
   * «Propuestos» (ver `banqueoLabelDe` en material-plan.ts) y abre un único
   * PDF (`{id}-prop`) en el mismo visor a pantalla completa que `resumen`.
   * Con `opciones` (2+, como en `resumen`) el click abre un selector — usado
   * en el Examen final, que junta varios documentos de banqueo.
   */
  propuestos?: { tipo: 'pdf'; opciones?: ResumenOpcion[] };
  /**
   * Material interactivo de la clase (`/cursos/fisica-medicina/modulo/{id}`).
   * Sustituye la tarjeta «Video» por «Simulación».
   *
   * Aquí sólo se declara que existe: QUÉ se abre lo decide
   * `src/lib/data/fisica-modulos/index.ts` — el módulo completo de teoría si la
   * clase lo tiene, y si no el laboratorio con su menú de temas. Las catorce
   * clases lo llevan, así que el sílabo sigue siendo la única fuente de qué
   * material tiene cada actividad sin tener que saber de qué tipo es.
   */
  modulo?: boolean;
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
  PC:         { bg: 'rgba(245,166,35,0.15)',  color: '#F5A623', label: 'Práctica calif.'},
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'         },
};

/**
 * El sílabo lista las clases por unidad. Los trabajos grupales (TG01–TG08) no
 * se muestran: nunca van a tener material propio en la plataforma.
 *
 * Orden real de las 14 semanas de teoría (confirmado ago-2026, reemplaza el
 * orden asumido original): Semana 08 no existe — es la semana del examen
 * parcial — por eso el conteo salta de semana 07 a semana 09. Lo que antes
 * era un único C3 ("Rotación... Equilibrio... Palancas") en realidad son dos
 * clases reales (semana 03 y semana 04); y lo que eran C11+C12 separados
 * (campo magnético / inducción) es una sola clase real (semana 13). Los C1–C14
 * de abajo son ese orden real renumerado sin huecos:
 *   C1  Leyes de movimiento              (semana 01)
 *   C2  Trabajo, energía y colisiones    (semana 02)
 *   C3  Dinámica rotacional de cuerpos rígidos (semana 03)
 *   C4  Equilibrio y elasticidad         (semana 04)
 *   C5  Mecánica de fluidos              (semana 05)
 *   C6  Movimiento periódico y ondas mecánicas (semana 06)
 *   C7  Temperatura y calor              (semana 07)
 *   C8  Leyes de la termodinámica        (semana 09)
 *   C9  Carga eléctrica, campo eléctrico y ley de Gauss (semana 10)
 *   C10 Potencial eléctrico y capacitancia (semana 11)
 *   C11 Corriente, resistencia y fuerza electromotriz (semana 12)
 *   C12 Magnetismo e inducción electromagnética (semana 13)
 *   C13 Óptica geométrica                (semana 14)
 *   C14 Fotones, electrones y átomos     (semana 15)
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — MECÁNICA ───────────────────────────────────────────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — Mecánica',
    fechas: '5 clases',
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
        modulo: true,
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
        modulo: true,
      },
      {
        id: 'fis-c-3',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C3',
        titulo: 'C3 — Dinámica rotacional de cuerpos rígidos',
        fecha: 'Clase 3 de 14',
        hora: '—',
        subtemas: [
          'Momento de inercia y torque',
          'Momento angular y su conservación',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-4',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C4',
        titulo: 'C4 — Equilibrio y elasticidad',
        fecha: 'Clase 4 de 14',
        hora: '—',
        subtemas: [
          'Equilibrio y elasticidad',
          'Palancas del cuerpo humano',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-5',
        tipo: 'TEORIA',
        unidad: 'MECANICA',
        codigo: 'C5',
        titulo: 'C5 — Mecánica de fluidos. Hidrostática e hidrodinámica',
        fecha: 'Clase 5 de 14',
        hora: '—',
        subtemas: [
          'Presión, densidad y principio de Pascal',
          'Principio de Arquímedes',
          'Ecuación de continuidad y Bernoulli',
          'Viscosidad y flujo sanguíneo',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
    ],
  },

  // ─── UNIDAD 2 — OSCILACIONES, ONDAS Y TERMODINÁMICA ────────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — Oscilaciones, ondas y termodinámica',
    fechas: '3 clases',
    actividades: [
      {
        id: 'fis-c-6',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C6',
        titulo: 'C6 — Movimiento periódico. Ondas mecánicas',
        fecha: 'Clase 6 de 14',
        hora: '—',
        subtemas: [
          'Movimiento armónico simple',
          'Péndulo y sistemas masa-resorte',
          'Ondas transversales y longitudinales',
          'Sonido y oído',
        ],
        docentes: [],
        modulo: true,
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-c-6-mov', label: 'Movimiento periódico' },
            { id: 'fis-c-6-ondas', label: 'Ondas mecánicas' },
          ],
        },
        propuestos: { tipo: 'pdf' },
      },
      {
        id: 'fis-c-7',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C7',
        titulo: 'C7 — Temperatura y calor. Propiedades térmicas de la materia',
        fecha: 'Clase 7 de 14',
        hora: '—',
        subtemas: [
          'Escalas de temperatura y dilatación',
          'Calor específico y cambios de fase',
          'Conducción, convección y radiación',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-8',
        tipo: 'TEORIA',
        unidad: 'ONDAS_TERMO',
        codigo: 'C8',
        titulo: 'C8 — Leyes de la termodinámica',
        fecha: 'Clase 8 de 14',
        hora: '—',
        subtemas: [
          'Primera ley y procesos termodinámicos',
          'Segunda ley y entropía',
          'Máquinas térmicas y eficiencia',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
    ],
  },

  // ─── UNIDAD 3 — ELECTROMAGNETISMO ──────────────────────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — Electromagnetismo',
    fechas: '4 clases',
    actividades: [
      {
        id: 'fis-c-9',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C9',
        titulo: 'C9 — Carga eléctrica, campo eléctrico y ley de Gauss',
        fecha: 'Clase 9 de 14',
        hora: '—',
        subtemas: [
          'Ley de Coulomb',
          'Campo eléctrico y líneas de campo',
          'Ley de Gauss y aplicaciones',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-10',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C10',
        titulo: 'C10 — Potencial eléctrico y capacitancia',
        fecha: 'Clase 10 de 14',
        hora: '—',
        subtemas: [
          'Diferencia de potencial y superficies equipotenciales',
          'Capacitores y dieléctricos',
          'Energía almacenada. Aplicación al desfibrilador',
        ],
        docentes: [],
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-c-10-potencial',    label: 'Potencial eléctrico' },
            { id: 'fis-c-10-capacitancia', label: 'Capacitancia' },
          ],
        },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-11',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C11',
        titulo: 'C11 — Corriente, resistencia y fuerza electromotriz',
        fecha: 'Clase 11 de 14',
        hora: '—',
        subtemas: [
          'Ley de Ohm y resistividad',
          'Circuitos en serie y paralelo',
          'Leyes de Kirchhoff',
          'Efectos fisiológicos de la corriente',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-12',
        tipo: 'TEORIA',
        unidad: 'ELECTROMAGNETISMO',
        codigo: 'C12',
        titulo: 'C12 — Magnetismo e inducción electromagnética',
        fecha: 'Clase 12 de 14',
        hora: '—',
        subtemas: [
          'Fuerza de Lorentz',
          'Campo de una corriente. Ley de Ampère',
          'Aplicación a la resonancia magnética',
          'Ley de Faraday y ley de Lenz',
          'Inductancia y transformadores',
          'Corrientes inducidas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
    ],
  },

  // ─── UNIDAD 4 — ÓPTICA Y FÍSICA MODERNA ────────────────────────────────────
  {
    id: 'u4',
    titulo: 'Unidad 4 — Óptica y física moderna',
    fechas: '2 clases',
    actividades: [
      {
        id: 'fis-c-13',
        tipo: 'TEORIA',
        unidad: 'OPTICA_MODERNA',
        codigo: 'C13',
        titulo: 'C13 — Óptica geométrica',
        fecha: 'Clase 13 de 14',
        hora: '—',
        subtemas: [
          'Reflexión y refracción. Ley de Snell',
          'Espejos y lentes delgadas',
          'El ojo humano y defectos de refracción',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: { tipo: 'pdf' },
        modulo: true,
      },
      {
        id: 'fis-c-14',
        tipo: 'TEORIA',
        unidad: 'OPTICA_MODERNA',
        codigo: 'C14',
        titulo: 'C14 — Fotones, electrones y átomos',
        fecha: 'Clase 14 de 14',
        hora: '—',
        subtemas: [
          'Fotones y dualidad onda-partícula',
          'Estructura atómica',
          'Física nuclear y radiación en medicina',
        ],
        docentes: [],
        modulo: true,
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-examen1-7-9am', label: 'Examen I — grupo 7-9 am' },
            { id: 'fis-examen1-17-19', label: 'Examen I — grupo 17-19h' },
            { id: 'fis-examen1-banqueo', label: 'Banqueo variado' },
          ],
        },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-pc1-banqueo',  label: 'Banqueo variado (2022-II)' },
            { id: 'fis-pc1-v1',       label: 'PC1 — versión 1' },
            { id: 'fis-pc1-7-9am',    label: 'PC1 — grupo 7-9 am' },
            { id: 'fis-pc1-10-12am',  label: 'PC1 — grupo 10-12 am' },
          ],
        },
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
        propuestos: { tipo: 'pdf' },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-pc2-v1', label: 'PC2 — versión 1' },
            { id: 'fis-pc2-v2', label: 'PC2 — versión 2' },
          ],
        },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-examen2-v1', label: 'Examen II — versión 1' },
            { id: 'fis-examen2-v2', label: 'Examen II — versión 2' },
            { id: 'fis-examen2-2020', label: 'Examen II — 2020' },
            { id: 'fis-examen2-2018', label: 'Examen II — 2018 (V)' },
            { id: 'fis-examen2-sol', label: 'Examen II — solucionario' },
            { id: 'fis-examen2-2017-sol', label: 'Examen II 2017-II — soluciones' },
          ],
        },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-pc3-v1', label: 'PC3 — versión 1 (2024-II)' },
            { id: 'fis-pc3-v2', label: 'PC3 — versión 2' },
          ],
        },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-pc4-a', label: 'PC4 — grupo A' },
            { id: 'fis-pc4-b', label: 'PC4 — grupo B' },
            { id: 'fis-pc4-c', label: 'PC4 — grupo C' },
          ],
        },
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
        propuestos: {
          tipo: 'pdf',
          opciones: [
            { id: 'fis-examen-final-parte1',  label: 'Examen final 2025-II (Parte 1)' },
            { id: 'fis-examen-final-parte2',  label: 'Examen final 2025-II (Parte 2)' },
            { id: 'fis-examen-final-banqueo', label: 'Banqueo variado' },
            // "Examen 3" — nombre antiguo del examen que cubría electrostática,
            // circuitos y magnetismo (ver nota en fis-examen3-* de route.ts).
            { id: 'fis-examen3-2020',   label: 'Examen 3 (antiguo) — 2020' },
            { id: 'fis-examen3-2019',   label: 'Examen 3 (antiguo) — 2019-II' },
            { id: 'fis-examen3-2018v',  label: 'Examen 3 (antiguo) — 2018 (V)' },
            { id: 'fis-examen3-2018ii', label: 'Examen 3 (antiguo) — 2018-II' },
            { id: 'fis-examen3-2017',   label: 'Examen 3 (antiguo) — 2017-II' },
            { id: 'fis-examen3-2016',   label: 'Examen 3 (antiguo) — 2016-II' },
            { id: 'fis-examen3-2015',   label: 'Examen 3 (antiguo) — 2015-II' },
          ],
        },
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
