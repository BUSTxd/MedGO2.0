export type TipoActividad = 'MAGISTRAL' | 'TBL' | 'SGP' | 'LAB' | 'EXAMEN-T' | 'EXAMEN-L' | 'SUSTIT';
export type Unidad = 'VIROLOGIA_MICOLOGIA' | 'PARASITOLOGIA' | 'BACTERIOLOGIA' | 'EVALUACION';

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
  resumen?: { tipo: 'pdf' };
}

export interface Semana {
  id: string;
  titulo: string;
  fechas: string;
  esEvaluacion?: boolean;
  actividades: Actividad[];
}

export const UNIDAD_COLOR: Record<Unidad, string> = {
  VIROLOGIA_MICOLOGIA: '#7B72D4',
  PARASITOLOGIA:       '#2DC99A',
  BACTERIOLOGIA:       '#E07856',
  EVALUACION:          '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  MAGISTRAL:  { bg: 'rgba(59,158,221,0.15)',   color: '#3b9edd', label: 'Magistral'  },
  TBL:        { bg: 'rgba(245,166,35,0.15)',   color: '#F5A623', label: 'TBL'        },
  SGP:        { bg: 'rgba(155,142,248,0.15)',  color: '#9B8EF8', label: 'SGP'        },
  LAB:        { bg: 'rgba(52,199,120,0.13)',   color: '#34C778', label: 'Lab'        },
  'EXAMEN-T': { bg: 'rgba(239,68,68,0.15)',    color: '#F87171', label: 'Examen T'   },
  'EXAMEN-L': { bg: 'rgba(239,68,68,0.12)',    color: '#F87171', label: 'Examen L'   },
  SUSTIT:     { bg: 'rgba(150,150,150,0.15)',  color: '#9CA3AF', label: 'Sustitutorio'},
};

export const semanas: Semana[] = [
  // ─── SEMANA 1 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-1',
    titulo: 'Semana 1',
    fechas: '27 abr – 2 may',
    actividades: [
      {
        id: 'clase-1',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 1 — Introducción a la Microbiología',
        fecha: '27 abr',
        hora: '07:00–09:00',
        subtemas: ['Los microorganismos'],
        docentes: ['Dra. Manuela Verástegui'],
      },
      {
        id: 'clase-2',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 2 — Introducción al Sistema Inmune',
        fecha: '27 abr',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Dr. Martin Montes'],
      },
      {
        id: 'clase-3',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 3 — Procesos Genéticos de los Microorganismos',
        fecha: '29 abr',
        hora: '09:00–11:00',
        subtemas: ['Variación genética', 'Mutaciones', 'Transferencia de genes'],
        docentes: ['Dra. Patricia Sheen'],
      },
      {
        id: 'practica-1',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 1 — Taller de Bioseguridad',
        fecha: 'Sem 1 · según grupo',
        hora: '—',
        subtemas: ['Reglas de bioseguridad en el laboratorio'],
        docentes: [],
        nota: 'No se evalúa con paso corto ni informe.',
      },
    ],
  },

  // ─── SEMANA 2 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-2',
    titulo: 'Semana 2',
    fechas: '4 – 8 may',
    actividades: [
      {
        id: 'clase-4',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 4 — Virus que infectan células animales',
        fecha: '4 may',
        hora: '09:00–11:00',
        subtemas: ['Generalidades', 'Ciclo de Multiplicación', 'Receptores y co-receptores', 'Sistema Interferón'],
        docentes: ['Dr. Abraham Vaisberg'],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'clase-5',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 5 — Virus Bacterianos (Bacteriófagos)',
        fecha: '6 may',
        hora: '09:00–11:00',
        subtemas: ['Generalidades', 'Ciclos de Multiplicación y Lisogenia', 'Aplicaciones'],
        docentes: ['Dr. Abraham Vaisberg'],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'clase-6',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 6 — Virus RNA',
        fecha: '8 may',
        hora: '09:00–11:00',
        subtemas: ['SARS-CoV', 'Influenza', 'RSV', 'Rotavirus', 'Dengue', 'HIV', 'HTLV'],
        docentes: ['Dr. Maita', 'Dr. Montes'],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'practica-2',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 2 — Esterilización',
        fecha: 'Sem 2 · según grupo',
        hora: '—',
        subtemas: ['Calor húmedo', 'Rayos UV'],
        docentes: [],
      },
      {
        id: 'practica-3',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 3 — Desinfección química',
        fecha: 'Sem 2 · según grupo',
        hora: '—',
        subtemas: ['Desinfección química'],
        docentes: [],
      },
      {
        id: 'sgp-1',
        tipo: 'SGP',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'SGP 1 — Virus emergentes y enfermedades virales',
        fecha: '5–12 may',
        hora: '2 sesiones de 1h',
        subtemas: [
          'Virus emergentes importantes para la salud humana',
          'Métodos de diagnóstico y tratamiento de enfermedades virales',
        ],
        docentes: ['Dra. Méndez', 'Dra. Chile', 'Dra. Verástegui', 'Mg. Cristóbal', 'Dr. Coronel', 'Lic. Ampuero', 'Dra. Vallejos'],
      },
    ],
  },

  // ─── SEMANA 3 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-3',
    titulo: 'Semana 3',
    fechas: '11 – 15 may',
    actividades: [
      {
        id: 'clase-7',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 7 — Virus DNA',
        fecha: '11 may',
        hora: '09:00–11:00',
        subtemas: ['Herpes virus', 'Papilomavirus', 'Viruela / Mpox', 'Hepatitis B'],
        docentes: ['Dr. Holger Maita'],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'clase-8',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 8 — Introducción a la Micología',
        fecha: '13 may',
        hora: '09:00–11:00',
        subtemas: ['Estructura celular', 'Morfología', 'Reproducción', 'Taxonomía convencional y molecular'],
        docentes: ['Edgard Neyra'],
      },
      {
        id: 'clase-9',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 9 — Regulación del Metabolismo y Fisiología de Hongos',
        fecha: '15 may',
        hora: '09:00–11:00',
        subtemas: ['Filamentosos y levaduras', 'Respiración'],
        docentes: ['Edgard Neyra'],
      },
      {
        id: 'practica-4',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 4 — Coloración fúngica (sesión 1)',
        fecha: 'Sem 3 · según grupo',
        hora: '—',
        subtemas: ['Técnicas de coloración para hongos filamentosos y levaduriformes'],
        docentes: [],
      },
      {
        id: 'practica-5',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 5 — Coloración fúngica (sesión 2)',
        fecha: 'Sem 3 · según grupo',
        hora: '—',
        subtemas: ['Continuación coloración fúngica'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 4 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-4',
    titulo: 'Semana 4',
    fechas: '18 – 22 may',
    actividades: [
      {
        id: 'clase-10',
        tipo: 'MAGISTRAL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 10 — Interacción Hongo–Hospedero',
        fecha: '20 may',
        hora: '09:00–11:00',
        subtemas: [
          'Mecanismos de patogenicidad',
          'Factores de virulencia',
          'Colonización e infección',
          'Respuesta inmune',
          'Antígenos fúngicos',
          'Transferencia génica',
        ],
        docentes: ['Edgard Neyra'],
      },
      {
        id: 'tbl-1',
        tipo: 'TBL',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Clase 11 — TBL 1 · Hongos patógenos humanos',
        fecha: '22 may',
        hora: '09:00–11:00',
        subtemas: ['Diversidad', 'Evolución', 'Factores de presencia'],
        docentes: ['Verástegui', 'Chile', 'Aguilar', 'Méndez', 'Coronel', 'Vallejos'],
      },
      {
        id: 'practica-6',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 6 — Caracterización de hongos (sesión 1)',
        fecha: 'Sem 4 · según grupo',
        hora: '—',
        subtemas: ['Técnicas fisiológicas y bioquímicas', 'Filamentosos y levaduriformes'],
        docentes: [],
      },
      {
        id: 'practica-7',
        tipo: 'LAB',
        unidad: 'VIROLOGIA_MICOLOGIA',
        titulo: 'Práctica 7 — Caracterización de hongos (sesión 2)',
        fecha: 'Sem 4 · según grupo',
        hora: '—',
        subtemas: ['Continuación caracterización de hongos'],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIÓN I ──────────────────────────────────────────────────────────
  {
    id: 'eval-1',
    titulo: 'Evaluación I — Virología / Micología',
    fechas: '23 may (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t-1',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Teórico I — Virología y Micología',
        fecha: '23 may (sáb)',
        hora: '11:30–13:30',
        subtemas: ['Cubre Clases 1–11'],
        docentes: [],
      },
      {
        id: 'examen-l-1',
        tipo: 'EXAMEN-L',
        unidad: 'EVALUACION',
        titulo: 'Examen Práctico I — Micología general',
        fecha: '23 may (sáb)',
        hora: '13:30–14:30',
        subtemas: ['Cubre Prácticas 1–7'],
        docentes: [],
        nota: 'Back-to-back con el teórico. Retiro de curso: hasta el 27 de mayo.',
      },
    ],
  },

  // ─── SEMANA 5 — INICIO PARASITOLOGÍA ───────────────────────────────────────
  {
    id: 'sem-5',
    titulo: 'Semana 5 — Inicio Parasitología',
    fechas: '25 – 29 may',
    actividades: [
      {
        id: 'clase-12',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 12 — Parasitología generalidades · Protozoos 1',
        fecha: '25 may',
        hora: '09:00–11:00',
        subtemas: [
          'Relaciones simbióticas',
          'Clases de parásitos',
          'Tipos de hospederos',
          'Ciclos biológicos',
          'Taxonomía',
          'Metamonada: Giardia, Chilomastix',
        ],
        docentes: ['Dra. Manuela Verástegui'],
      },
      {
        id: 'clase-13',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 13 — Protozoos 2',
        fecha: '27 may',
        hora: '09:00–11:00',
        subtemas: [
          'Ciliophora: Balantidium',
          'Parabazala: Trichomonas',
          'Amoebozoa: Entamoeba, Balamuthia, Acanthamoeba',
          'Percolozoa: Naegleria',
        ],
        docentes: ['Dra. Verástegui', 'Dra. Calderón'],
      },
      {
        id: 'clase-14',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 14 — Protozoos intracelulares · Coccidios',
        fecha: '29 may',
        hora: '09:00–11:00',
        subtemas: ['Cryptosporidium', 'Cyclospora cayetanensis', 'Cystoisospora belli', 'Toxoplasma gondii'],
        docentes: ['Dra. Verástegui', 'Dra. Calderón'],
      },
      {
        id: 'practica-8',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 8 — Diagnóstico parasitológico',
        fecha: 'Sem 5 · según grupo',
        hora: '—',
        subtemas: ['Examen directo', 'Concentraciones', 'Reconocimiento de parásitos intestinales'],
        docentes: [],
      },
      {
        id: 'practica-9',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 9 — Protozoarios intestinales',
        fecha: 'Sem 5 · según grupo',
        hora: '—',
        subtemas: ['Amebas', 'Giardia', 'Chilomastix', 'Cryptosporidium', 'Cyclospora', 'Cystoisospora', 'Balantidium'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 6 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-6',
    titulo: 'Semana 6',
    fechas: '1 – 5 jun',
    actividades: [
      {
        id: 'clase-15',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 15 — Protozoos con vectores biológicos',
        fecha: '1 jun',
        hora: '09:00–11:00',
        subtemas: ['Leishmania', 'Trypanosoma', 'Plasmodium'],
        docentes: ['Dr. Montes', 'Dra. Verástegui'],
      },
      {
        id: 'clase-16',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 16 — Helmintos · Nematoda',
        fecha: '3 jun',
        hora: '09:00–11:00',
        subtemas: ['Ascaris', 'Enterobius', 'Trichuris', 'Strongyloides', 'Uncinaria', 'Anatomía, fisiología, ciclo de vida'],
        docentes: ['Dra. Chile', 'Dra. Verástegui'],
      },
      {
        id: 'clase-17',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 17 — Helmintos · Cestodos y Trematodos',
        fecha: '5 jun',
        hora: '09:00–11:00',
        subtemas: ['Taenia', 'Echinococcus', 'Diphyllobothrium', 'Hymenolepis', 'Fasciola', 'Paragonimus', 'Modulación de la respuesta inmune'],
        docentes: ['Dra. Verástegui', 'Dra. Chile'],
      },
      {
        id: 'practica-10',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 10 — Protozoarios de otras cavidades',
        fecha: 'Sem 6 · según grupo',
        hora: '—',
        subtemas: ['Trichomonas', 'Trypanosoma', 'Leishmania', 'Plasmodium vivax / falciparum / malariae', 'Toxoplasma', 'Acanthamoeba', 'Naegleria'],
        docentes: [],
      },
      {
        id: 'practica-11',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 11 — Nematodos intestinales y vectores',
        fecha: 'Sem 6 · según grupo',
        hora: '—',
        subtemas: ['Ascaris lumbricoides', 'Trichuris trichiura', 'Enterobius vermicularis', 'Ancylostoma / Necator', 'Strongyloides', 'Vectores de T. cruzi, Leishmania, Plasmodium'],
        docentes: [],
      },
      {
        id: 'sgp-2',
        tipo: 'SGP',
        unidad: 'PARASITOLOGIA',
        titulo: 'SGP 2 — Diagnóstico y control de parásitos resistentes',
        fecha: '1–8 jun',
        hora: '2 sesiones de 1h',
        subtemas: [
          'Parásitos resistentes y emergentes',
          'Diagnóstico temprano, tratamiento y control en poblaciones vulnerables',
        ],
        docentes: ['Dra. Méndez', 'Dra. Chile', 'Dra. Verástegui', 'Mg. Cristóbal', 'Dr. Coronel', 'Lic. Ampuero', 'Dra. Vallejos'],
      },
    ],
  },

  // ─── SEMANA 7 ──────────────────────────────────────────────────────────────
  {
    id: 'sem-7',
    titulo: 'Semana 7',
    fechas: '8 – 12 jun',
    actividades: [
      {
        id: 'clase-18',
        tipo: 'MAGISTRAL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 18 — Artrópodos',
        fecha: '8 jun',
        hora: '09:00–11:00',
        subtemas: ['Generalidades', 'Clasificación', 'Ectoparásitos y endoparásitos', 'Piojos', 'Pulgas', 'Larvas de mosca', 'Ácaros'],
        docentes: ['MSc. Ventosilla', 'Dra. Chile'],
      },
      {
        id: 'tbl-2',
        tipo: 'TBL',
        unidad: 'PARASITOLOGIA',
        titulo: 'Clase 19 — TBL 2 · Cambio climático y enfermedades metaxénicas parasitarias',
        fecha: '10 jun',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Chile', 'Verástegui', 'Méndez', 'Coronel', 'Orrego', 'Vallejos'],
      },
      {
        id: 'practica-12',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 12 — Cestodos y Trematodos',
        fecha: 'Sem 7 · según grupo',
        hora: '—',
        subtemas: ['Hymenolepis nana / diminuta', 'Diphyllobothrium pacificum', 'Taenia solium / saginata', 'Echinococcus granulosus', 'Fasciola', 'Paragonimus', 'Schistosoma'],
        docentes: [],
      },
      {
        id: 'practica-13',
        tipo: 'LAB',
        unidad: 'PARASITOLOGIA',
        titulo: 'Práctica 13 — Artrópodos',
        fecha: 'Sem 7 · según grupo',
        hora: '—',
        subtemas: ['Piojos', 'Pulgas', 'Larvas de mosca', 'Arácnidos (ácaros, garrapatas, arañas, escorpiones)'],
        docentes: [],
      },
    ],
  },

  // ─── EVALUACIÓN II ─────────────────────────────────────────────────────────
  {
    id: 'eval-2',
    titulo: 'Evaluación II — Parasitología',
    fechas: '20 jun (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t-2',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Teórico II — Parasitología',
        fecha: '20 jun (sáb)',
        hora: '11:30–13:30',
        subtemas: ['Cubre Clases 12–19'],
        docentes: [],
      },
      {
        id: 'examen-l-2',
        tipo: 'EXAMEN-L',
        unidad: 'EVALUACION',
        titulo: 'Examen Práctico II — Parasitología',
        fecha: '20 jun (sáb)',
        hora: '14:30–18:00',
        subtemas: ['Cubre Prácticas 8–13'],
        docentes: [],
        nota: '4 horas de evaluación back-to-back.',
      },
    ],
  },

  // ─── SEMANA 8 — INICIO BACTERIOLOGÍA ───────────────────────────────────────
  {
    id: 'sem-8',
    titulo: 'Semana 8 — Inicio Bacteriología',
    fechas: '15 – 19 jun',
    actividades: [
      {
        id: 'clase-20',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 20 — Fisiología y Reproducción Bacteriana',
        fecha: '15 jun',
        hora: '09:00–11:00',
        subtemas: ['Curva de desarrollo', 'Interacción bacteriana con el medio ambiente'],
        docentes: ['Dra. Jasmín Hurtado'],
      },
      {
        id: 'clase-21',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 21 — Microbiota Humana · Biología Molecular',
        fecha: '17 jun',
        hora: '09:00–11:00',
        subtemas: ['Aplicación de biología molecular en microbiología clínica'],
        docentes: ['Dr. Pablo Tsukayama', 'Dra. Patricia Sheen'],
      },
      {
        id: 'clase-22',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 22 — Metodologías de identificación bacteriana',
        fecha: '19 jun',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Mg. Ruth Cristóbal'],
      },
      {
        id: 'practica-14',
        tipo: 'LAB',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Práctica 14 — Microbiota',
        fecha: 'Sem 8 · según grupo',
        hora: '—',
        subtemas: ['Microbiota humana normal'],
        docentes: [],
      },
      {
        id: 'practica-15',
        tipo: 'LAB',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Práctica 15 — Coloración de Gram',
        fecha: 'Sem 8 · según grupo',
        hora: '—',
        subtemas: ['Coloración de Gram'],
        docentes: [],
      },
      {
        id: 'sgp-3',
        tipo: 'SGP',
        unidad: 'BACTERIOLOGIA',
        titulo: 'SGP 3 — Infecciones bacterianas multidrogo resistentes',
        fecha: '19–24 jun',
        hora: '2 sesiones de 1h',
        subtemas: ['Desafíos para el control de infecciones bacterianas multidrogo resistentes'],
        docentes: ['Dra. Méndez', 'Dra. Chile', 'Dra. Verástegui', 'Mg. Cristóbal', 'Dr. Coronel', 'Lic. Ampuero', 'Dra. Vallejos'],
      },
    ],
  },

  // ─── SEMANAS 9–10 ──────────────────────────────────────────────────────────
  {
    id: 'sem-9-10',
    titulo: 'Semanas 9–10',
    fechas: '22 – 26 jun',
    actividades: [
      {
        id: 'clase-23',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 23 — Proceso infeccioso · Gram negativas',
        fecha: '22 jun',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Dra. Fiorella Krapp'],
      },
      {
        id: 'clase-24',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 24 — Proceso infeccioso · Gram positivas',
        fecha: '24 jun',
        hora: '09:00–11:00',
        subtemas: ['Staphylococcus', 'Streptococcus'],
        docentes: ['Dra. Theresa Ochoa'],
      },
      {
        id: 'clase-25',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 25 — Bacterias por vectores y transmisión sexual',
        fecha: '26 jun',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Dr. Enrique Cornejo'],
      },
      {
        id: 'practica-16',
        tipo: 'LAB',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Práctica 16 — Urocultivo · Coprocultivo · Susceptibilidad antibiótica',
        fecha: 'Sem 9–10 · según grupo (2 sesiones)',
        hora: '—',
        subtemas: ['Urocultivo', 'Coprocultivo', 'Susceptibilidad antibiótica'],
        docentes: [],
        nota: 'Esta práctica ocupa dos sesiones consecutivas por grupo.',
      },
    ],
  },

  // ─── SEMANA 11 ─────────────────────────────────────────────────────────────
  {
    id: 'sem-11',
    titulo: 'Semana 11',
    fechas: '29 jun – 3 jul',
    actividades: [
      {
        id: 'clase-26',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 26 — Enteropatógenos bacterianos',
        fecha: '1 jul',
        hora: '09:00–11:00',
        subtemas: ['Salmonella', 'Shigella', 'E. coli diarreogénica'],
        docentes: ['Dra. Theresa Ochoa'],
      },
      {
        id: 'clase-27',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 27 — Resistencia antimicrobiana',
        fecha: '3 jul',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Dr. Pablo Tsukayama'],
      },
      {
        id: 'practica-17',
        tipo: 'LAB',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Práctica 17 — MODS y TEMA',
        fecha: 'Sem 11 · según grupo',
        hora: '—',
        subtemas: ['MODS', 'TEMA', 'Métodos microscópicos para diagnóstico de tuberculosis'],
        docentes: [],
      },
    ],
  },

  // ─── SEMANA 12 ─────────────────────────────────────────────────────────────
  {
    id: 'sem-12',
    titulo: 'Semana 12',
    fechas: '6 – 10 jul',
    actividades: [
      {
        id: 'clase-28',
        tipo: 'MAGISTRAL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 28 — Bacterias asociadas a mortalidad infantil',
        fecha: '6 jul',
        hora: '09:00–11:00',
        subtemas: ['Factores de riesgo', 'Prevención', 'Control'],
        docentes: ['Dra. Theresa Ochoa'],
      },
      {
        id: 'tbl-3',
        tipo: 'TBL',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Clase 29 — TBL 3 · Enfermedades intrahospitalarias y biofilms',
        fecha: '8 jul',
        hora: '09:00–11:00',
        subtemas: [],
        docentes: ['Verástegui', 'Aguilar', 'Méndez', 'Vásquez', 'Vallejos', 'Ampuero'],
      },
      {
        id: 'practica-18',
        tipo: 'LAB',
        unidad: 'BACTERIOLOGIA',
        titulo: 'Práctica 18 — Cultivo de hisopado faríngeo',
        fecha: 'Sem 12 · según grupo (2 sesiones)',
        hora: '—',
        subtemas: ['Cultivo de hisopado faríngeo', 'Diferenciación Staphylococcus / Streptococcus'],
        docentes: [],
        nota: 'Esta práctica ocupa dos sesiones consecutivas por grupo.',
      },
    ],
  },

  // ─── EVALUACIÓN III ────────────────────────────────────────────────────────
  {
    id: 'eval-3',
    titulo: 'Evaluación Final — Bacteriología',
    fechas: '11 jul (sáb)',
    esEvaluacion: true,
    actividades: [
      {
        id: 'examen-t-3',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen Teórico III — Bacteriología',
        fecha: '11 jul (sáb)',
        hora: '08:00–10:00',
        subtemas: ['Cubre Clases 20–29'],
        docentes: [],
      },
      {
        id: 'examen-l-3',
        tipo: 'EXAMEN-L',
        unidad: 'EVALUACION',
        titulo: 'Examen Práctico III — Bacteriología',
        fecha: '11 jul (sáb)',
        hora: '13:30–14:30',
        subtemas: ['Cubre Prácticas 14–18'],
        docentes: [],
      },
    ],
  },

  // ─── CIERRE ────────────────────────────────────────────────────────────────
  {
    id: 'cierre',
    titulo: 'Cierre del curso',
    fechas: '14 jul',
    esEvaluacion: true,
    actividades: [
      {
        id: 'sustit',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Exámenes de rezagados y sustitutorios',
        fecha: '14 jul (mar)',
        hora: '10:00–12:00',
        subtemas: ['Solo un examen teórico parcial puede sustituirse', 'Nota máxima: 11'],
        docentes: [],
      },
    ],
  },
];

export const curso = {
  nombre: 'Microbiología General',
  codigo: 'M2058',
  carrera: 'Medicina · UPCH',
  coordinadora: 'Dra. Manuela Verástegui',
  duracion: '27 abr – 10 jul 2026',
  creditos: '5 créditos · 58h teóricas + 50h prácticas',
};

export function findActividad(id: string): { actividad: Actividad; semana: Semana } | null {
  for (const semana of semanas) {
    for (const actividad of semana.actividades) {
      if (actividad.id === id) return { actividad, semana };
    }
  }
  return null;
}
