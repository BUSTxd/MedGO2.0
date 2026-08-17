export type TipoActividad =
  | 'TEORIA'
  | 'TALLER'
  | 'LAB'
  | 'AUTOAPRENDIZAJE'
  | 'INTEGRACION'
  | 'EXAMEN-T'
  | 'SUSTIT';

export type Unidad =
  | 'QUIMICA'
  | 'METABOLISMO'
  | 'ORGANIZACION'
  | 'HERENCIA'
  | 'EVALUACION';

/** Envase del resumen: PDF, o fragmento HTML servido por /api/resumen-html. */
export type ResumenFormato = 'pdf' | 'html';

export interface ResumenOpcion {
  id: string;
  label: string;
  /** Va por opción además de por tarjeta: un picker puede mezclar envases. */
  formato?: ResumenFormato;
}

export interface Actividad {
  id: string;
  tipo: TipoActividad;
  unidad: Unidad;
  /** Código del sílabo: Te1–Te12, Ta1–Ta13, PL1–PL10, AFPD1–3, AFA1–2. */
  codigo?: string;
  titulo: string;
  /** Posición dentro de su serie ("Teoría 3 de 12"): el sílabo no da fechas. */
  fecha: string;
  hora: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumen?: { tipo: 'pdf'; formato?: ResumenFormato; opciones?: ResumenOpcion[] };
  /**
   * PDF que abre desde la tarjeta «Banqueo» en el mismo visor que Resumen
   * (igual que los propuestos de Física). Aquí es la guía de la práctica ya
   * resuelta y anotada a mano, que es material de práctica, no un resumen.
   * Su id de bucket va explícito porque no sigue el patrón `{id}-prop`.
   */
  propuestos?: {
    tipo: 'pdf';
    claseId?: string;
    desc?: string;
    /** `html` cuando lo que cuelga de Banqueo es un fragmento, no un PDF. */
    formato?: ResumenFormato;
    opciones?: ResumenOpcion[];
  };
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
  QUIMICA:      '#34C778',
  METABOLISMO:  '#F5A623',
  ORGANIZACION: '#3b9edd',
  HERENCIA:     '#9B8EF8',
  EVALUACION:   '#6B6B68',
};

export const TIPO_BADGE: Record<TipoActividad, { bg: string; color: string; label: string }> = {
  TEORIA:          { bg: 'rgba(59,158,221,0.15)',  color: '#3b9edd', label: 'Teoría'       },
  TALLER:          { bg: 'rgba(155,142,248,0.15)', color: '#9B8EF8', label: 'Taller'       },
  LAB:             { bg: 'rgba(52,199,120,0.13)',  color: '#34C778', label: 'Laboratorio'  },
  AUTOAPRENDIZAJE: { bg: 'rgba(20,184,166,0.15)',  color: '#14B8A6', label: 'Autoaprend.'  },
  INTEGRACION:     { bg: 'rgba(232,121,166,0.15)', color: '#E879A6', label: 'Integración'  },
  'EXAMEN-T':      { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Examen'       },
  SUSTIT:          { bg: 'rgba(150,150,150,0.15)', color: '#9CA3AF', label: 'Sustitutorio' },
};

/**
 * El sílabo del curso no reparte las sesiones por semana: entrega listas
 * ordenadas por tipo (Te / Ta / PL / AFPD-AFA). Aquí se agrupan por unidad
 * temática y, dentro de cada unidad, en el orden del sílabo.
 */
export const semanas: Semana[] = [
  // ─── UNIDAD 1 — LA VIDA, BASES QUÍMICAS ────────────────────────────────────
  {
    id: 'u1',
    titulo: 'Unidad 1 — La vida, bases químicas',
    fechas: '2 teorías · 2 talleres · 2 laboratorios',
    actividades: [
      {
        id: 'bcm-te-1',
        tipo: 'TEORIA',
        unidad: 'QUIMICA',
        codigo: 'Te1',
        titulo: 'Te1 — Componentes químicos de la célula',
        fecha: 'Teoría 1 de 12',
        hora: '—',
        subtemas: [
          'Elementos químicos de los seres vivos',
          'Enlaces covalentes, iónicos y puentes de hidrógeno',
          'El agua como solvente biológico',
          'Importancia del carbono',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-2',
        tipo: 'TEORIA',
        unidad: 'QUIMICA',
        codigo: 'Te2',
        titulo: 'Te2 — Compuestos orgánicos. Carbohidratos y lípidos',
        fecha: 'Teoría 2 de 12',
        hora: '—',
        subtemas: [
          'Grupos funcionales y macromoléculas',
          'Monosacáridos, disacáridos y polisacáridos',
          'Ácidos grasos, triglicéridos y fosfolípidos',
          'Esteroides y vitaminas',
        ],
        docentes: [],
        /* Dos envases para la misma clase, así que la tarjeta abre el picker.
           El HTML salió de un export que traía la teórica y el Taller 2 en una
           sola página; se cortó por la coordenada del título del taller y la
           otra mitad vive en `bcm-ta-2`. Id con sufijo porque `bcm-te-2` ya es
           el PDF, en otro bucket y otra route. */
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'bcm-te-2', label: 'Resumen (PDF)' },
            { id: 'bcm-te-2-html', label: 'Resumen (clase anotada)', formato: 'html' },
          ],
        },
      },
      {
        id: 'bcm-ta-1',
        tipo: 'TALLER',
        unidad: 'QUIMICA',
        codigo: 'Ta1',
        titulo: 'Ta1 — Agua',
        fecha: 'Taller 1 de 13',
        hora: '—',
        subtemas: [
          'Polaridad y puentes de hidrógeno',
          'Propiedades coligativas',
          'pH, ácidos, bases y amortiguadores',
        ],
        docentes: [],
        // Envase «documento de flujo» (ver /addresumencapas): el taller resuelto,
        // reconstruido como HTML real a partir de la foto. Reflowea de verdad, así
        // que en móvil se lee y los botones A−/A+ del visor funcionan.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-1', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-2',
        tipo: 'TALLER',
        unidad: 'QUIMICA',
        codigo: 'Ta2',
        titulo: 'Ta2 — Proteínas y ácidos nucleicos',
        fecha: 'Taller 2 de 13',
        hora: '—',
        subtemas: [
          'Aminoácidos y enlace peptídico',
          'Estructura primaria, secundaria, terciaria y cuaternaria',
          'Desnaturalización y plegamiento',
          'Nucleótidos: ADN y ARN',
        ],
        docentes: [],
        // Envase "en capas", variante «text-block» (ver /addresumencapas): es la
        // segunda mitad del mismo export que la teórica Te2, cortada por la
        // coordenada donde empieza el título del taller.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-2', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-pl-1',
        tipo: 'LAB',
        unidad: 'QUIMICA',
        codigo: 'PL1',
        titulo: 'PL1 — Microscopía: partes y enfoque',
        fecha: 'Laboratorio 1 de 10',
        hora: '—',
        subtemas: [
          'Partes del microscopio óptico',
          'Secuencia de enfoque y objetivos',
          'Preparación de montajes húmedos',
        ],
        docentes: [],
        nota: 'La inasistencia no justificada a una PL se califica con 0 y no es recuperable.',
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-pl-2',
        tipo: 'LAB',
        unidad: 'QUIMICA',
        codigo: 'PL2',
        titulo: 'PL2 — Mediciones con microscopio. Uso del ocular micrométrico',
        fecha: 'Laboratorio 2 de 10',
        hora: '—',
        subtemas: [
          'Calibración del ocular micrométrico',
          'Cálculo del factor de conversión por objetivo',
          'Medición de estructuras celulares',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── UNIDAD 2 — METABOLISMO CELULAR Y ENERGÍA ──────────────────────────────
  {
    id: 'u2',
    titulo: 'Unidad 2 — Metabolismo celular y energía',
    fechas: '2 teorías · 2 talleres · 2 laboratorios · 2 autoaprendizajes',
    actividades: [
      {
        id: 'bcm-te-3',
        tipo: 'TEORIA',
        unidad: 'METABOLISMO',
        codigo: 'Te3',
        titulo: 'Te3 — Orden biológico y energía. Introducción al metabolismo',
        fecha: 'Teoría 3 de 12',
        hora: '—',
        subtemas: [
          'Leyes de la termodinámica aplicadas a la célula',
          'Energía libre y reacciones acopladas',
          'Trabajo celular y ATP',
          'Rutas catabólicas y anabólicas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-4',
        tipo: 'TEORIA',
        unidad: 'METABOLISMO',
        codigo: 'Te4',
        titulo: 'Te4 — Procariotas y eucariotas. Origen de las células eucariotas',
        fecha: 'Teoría 4 de 12',
        hora: '—',
        subtemas: [
          'Comparación procariota / eucariota',
          'Teoría endosimbiótica',
          'Compartimentalización celular',
        ],
        docentes: [],
        /* Dos resúmenes del mismo tema, y el alumno elige. Los rótulos dicen
           en qué se diferencian, que es lo que decide la elección: el PDF son
           secciones numeradas y tablas comparativas; el HTML es la clase con
           sus figuras y las anotaciones a mano. Con `opciones` la tarjeta abre
           el picker en vez de ir directa al visor, y `formato` va por opción
           porque cada una abre un visor distinto. */
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'bcm-te-4', label: 'Resumen (tablas)' },
            { id: 'bcm-te-4-html', label: 'Resumen (visual)', formato: 'html' },
          ],
        },
      },
      {
        id: 'bcm-ta-3',
        tipo: 'TALLER',
        unidad: 'METABOLISMO',
        codigo: 'Ta3',
        titulo: 'Ta3 — Enzimas',
        fecha: 'Taller 3 de 13',
        hora: '—',
        subtemas: [
          'Energía de activación y sitio activo',
          'Cinética de Michaelis-Menten',
          'Inhibición competitiva y no competitiva',
          'Regulación alostérica',
        ],
        // Envase "en capas", variante «native-line» (ver /addresumencapas): el
        // taller resuelto a dos columnas — enunciado escaneado a la izquierda y
        // las respuestas a la derecha, con la tinta y el resaltado en SVG.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-3', label: 'Resumen', formato: 'html' }],
        },
        docentes: [],
      },
      {
        id: 'bcm-afpd-1',
        tipo: 'AUTOAPRENDIZAJE',
        unidad: 'METABOLISMO',
        codigo: 'AFPD1',
        titulo: 'AFPD1 — Cómo las células obtienen energía de los alimentos',
        fecha: 'Autoaprendizaje facilitado 1 de 3',
        hora: '—',
        subtemas: [
          'Glucólisis',
          'Fermentación láctica y alcohólica',
          'Destino del piruvato',
        ],
        docentes: [],
        nota: 'Los AFPD promedian junto con las prácticas de laboratorio (componente D, 40%).',
      },
      {
        id: 'bcm-afa-2',
        tipo: 'AUTOAPRENDIZAJE',
        unidad: 'METABOLISMO',
        codigo: 'AFA2',
        titulo: 'AFA2 — Respiración celular',
        fecha: 'Autoaprendizaje asincrónico 2 de 2',
        hora: '—',
        subtemas: [
          'Ciclo de Krebs',
          'Cadena transportadora de electrones',
          'Fosforilación oxidativa y quimiosmosis',
          'Balance energético',
        ],
        docentes: [],
      },
      {
        id: 'bcm-pl-3',
        tipo: 'LAB',
        unidad: 'METABOLISMO',
        codigo: 'PL3',
        titulo: 'PL3 — Enzimas',
        fecha: 'Laboratorio 3 de 10',
        hora: '—',
        subtemas: [
          'Actividad de la catalasa',
          'Efecto del pH y la temperatura',
          'Efecto de la concentración de sustrato',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-pl-4',
        tipo: 'LAB',
        unidad: 'METABOLISMO',
        codigo: 'PL4',
        titulo: 'PL4 — Células',
        fecha: 'Laboratorio 4 de 10',
        hora: '—',
        subtemas: [
          'Células procariotas y eucariotas al microscopio',
          'Célula vegetal vs. célula animal',
          'Tinciones simples',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-ta-6',
        tipo: 'TALLER',
        unidad: 'METABOLISMO',
        codigo: 'Ta6',
        titulo: 'Ta6 — Caso de integración (Unidades 1-2)',
        fecha: 'Taller 6 de 13',
        hora: '—',
        subtemas: [
          'Caso aplicado: bioquímica y metabolismo',
          'Integración de agua, biomoléculas y enzimas',
        ],
        docentes: [],
      },
    ],
  },

  // ─── UNIDAD 3 — ORGANIZACIÓN INTERNA DE LA CÉLULA ──────────────────────────
  {
    id: 'u3',
    titulo: 'Unidad 3 — Organización interna de la célula',
    fechas: '4 teorías · 4 talleres · 3 laboratorios · 2 autoaprendizajes',
    actividades: [
      {
        id: 'bcm-te-5',
        tipo: 'TEORIA',
        unidad: 'ORGANIZACION',
        codigo: 'Te5',
        titulo: 'Te5 — Transporte a través de la membrana',
        fecha: 'Teoría 5 de 12',
        hora: '—',
        subtemas: [
          'Modelo del mosaico fluido',
          'Difusión simple y facilitada',
          'Transporte activo primario y secundario',
          'Endocitosis y exocitosis',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-6',
        tipo: 'TEORIA',
        unidad: 'ORGANIZACION',
        codigo: 'Te6',
        titulo: 'Te6 — Potencial de membrana',
        fecha: 'Teoría 6 de 12',
        hora: '—',
        subtemas: [
          'Potencial de reposo y ecuación de Nernst',
          'Bomba Na⁺/K⁺ ATPasa',
          'Canales iónicos',
          'Potencial de acción',
        ],
        docentes: [],
        /* Dos envases, así que la tarjeta abre el picker. El HTML es la primera
           mitad de un export que traía la teórica y el autoaprendizaje en una
           sola página; la otra mitad está en `bcm-afa-1`. Id con sufijo porque
           `bcm-te-6` ya es el PDF, en otro bucket y otra route. */
        resumen: {
          tipo: 'pdf',
          opciones: [
            { id: 'bcm-te-6', label: 'Resumen (PDF)' },
            { id: 'bcm-te-6-html', label: 'Resumen (visual)', formato: 'html' },
          ],
        },
      },
      {
        id: 'bcm-te-7',
        tipo: 'TEORIA',
        unidad: 'ORGANIZACION',
        codigo: 'Te7',
        titulo: 'Te7 — Sistema de endomembranas',
        fecha: 'Teoría 7 de 12',
        hora: '—',
        subtemas: [
          'Retículo endoplasmático rugoso y liso',
          'Aparato de Golgi y tráfico vesicular',
          'Lisosomas y peroxisomas',
          'Señales de direccionamiento de proteínas',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-8',
        tipo: 'TEORIA',
        unidad: 'ORGANIZACION',
        codigo: 'Te8',
        titulo: 'Te8 — Comunicación celular',
        fecha: 'Teoría 8 de 12',
        hora: '—',
        subtemas: [
          'Señalización autocrina, paracrina y endocrina',
          'Receptores de membrana y nucleares',
          'Segundos mensajeros: AMPc, Ca²⁺, IP₃',
          'Cascadas de transducción de señales',
        ],
        docentes: [],
        // Envase "en capas" (ver /addresumencapas): apuntes con anotaciones
        // manuscritas que son parte del contenido, no decoración.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-te-8', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-4',
        tipo: 'TALLER',
        unidad: 'ORGANIZACION',
        codigo: 'Ta4',
        titulo: 'Ta4 — Estructura de la membrana',
        fecha: 'Taller 4 de 13',
        hora: '—',
        subtemas: [
          'Bicapa lipídica y fluidez',
          'Proteínas integrales y periféricas',
          'Glucocálix y asimetría de membrana',
        ],
        docentes: [],
        // Envase "en capas", variante «pdf-page» (ver /addresumencapas): el
        // taller resuelto, con las anotaciones manuscritas en SVG.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-4', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-5',
        tipo: 'TALLER',
        unidad: 'ORGANIZACION',
        codigo: 'Ta5',
        titulo: 'Ta5 — Ósmosis. Regulación del volumen celular',
        fecha: 'Taller 5 de 13',
        hora: '—',
        subtemas: [
          'Osmolaridad y tonicidad',
          'Soluciones hipo, iso e hipertónicas',
          'Hemólisis y crenación',
        ],
        docentes: [],
        // Envase "en capas" (ver /addresumencapas): las 4 hojas del taller con
        // las respuestas al margen. Variante sin catalogar, así que se publicó
        // llevándose su propio <style> saneado en vez de enseñarle su
        // vocabulario al CSS module.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-5', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-7',
        tipo: 'TALLER',
        unidad: 'ORGANIZACION',
        codigo: 'Ta7',
        titulo: 'Ta7 — Tráfico vesicular',
        fecha: 'Taller 7 de 13',
        hora: '—',
        subtemas: [
          'Vesículas de COPI, COPII y clatrina',
          'Fusión de membranas y proteínas SNARE',
          'Vía secretora y vía endocítica',
        ],
        docentes: [],
        // Envase «documento de flujo» (ver /addresumencapas): tablas de
        // transporte vesicular y los formularios del taller resueltos. Va en
        // flujo (cero `position:absolute`), aunque su página fije el ancho.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-7', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-8',
        tipo: 'TALLER',
        unidad: 'ORGANIZACION',
        codigo: 'Ta8',
        titulo: 'Ta8 — Matriz extracelular / adhesiones célula-célula',
        fecha: 'Taller 8 de 13',
        hora: '—',
        subtemas: [
          'Colágeno, elastina y proteoglicanos',
          'Integrinas y adhesión focal',
          'Uniones estrechas, adherentes, desmosomas y gap',
        ],
        docentes: [],
      },
      {
        id: 'bcm-afa-1',
        tipo: 'AUTOAPRENDIZAJE',
        unidad: 'ORGANIZACION',
        codigo: 'AFA1',
        titulo: 'AFA1 — Potencial de membrana',
        fecha: 'Autoaprendizaje asincrónico 1 de 2',
        hora: '—',
        subtemas: [
          'Gradientes iónicos',
          'Equilibrio electroquímico',
          'Aplicación en células excitables',
        ],
        docentes: [],
        // Envase "en capas" (ver /addresumencapas): segunda mitad del mismo
        // export que la teórica Te6, cortada donde empieza el bloque «AFA:».
        // Son las capturas de las preguntas del autoaprendizaje, resueltas.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-afa-1', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-afpd-2',
        tipo: 'AUTOAPRENDIZAJE',
        unidad: 'ORGANIZACION',
        codigo: 'AFPD2',
        titulo: 'AFPD2 — Citoesqueleto',
        fecha: 'Autoaprendizaje facilitado 2 de 3',
        hora: '—',
        subtemas: [
          'Microfilamentos de actina',
          'Filamentos intermedios',
          'Microtúbulos y proteínas motoras',
          'Cilios, flagelos y centrosoma',
        ],
        docentes: [],
      },
      {
        id: 'bcm-pl-5',
        tipo: 'LAB',
        unidad: 'ORGANIZACION',
        codigo: 'PL5',
        titulo: 'PL5 — Membrana celular',
        fecha: 'Laboratorio 5 de 10',
        hora: '—',
        subtemas: [
          'Permeabilidad de la membrana',
          'Ósmosis en glóbulos rojos y células vegetales',
          'Plasmólisis y turgencia',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-pl-6',
        tipo: 'LAB',
        unidad: 'ORGANIZACION',
        codigo: 'PL6',
        titulo: 'PL6 — Microscopía: límite de resolución. Uso de escala de coordenadas',
        fecha: 'Laboratorio 6 de 10',
        hora: '—',
        subtemas: [
          'Poder de resolución y apertura numérica',
          'Escala de coordenadas de la platina',
          'Registro y relocalización de campos',
        ],
        docentes: [],
        // Envase "hojas de tamaño fijo" (ver /addresumencapas): la guía de la
        // práctica anotada a mano, 14 hojas —2 tamaños— con la tinta en SVG.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-pl-6', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-pl-7',
        tipo: 'LAB',
        unidad: 'ORGANIZACION',
        codigo: 'PL7',
        titulo: 'PL7 — Lisosomas y mitocondrias',
        fecha: 'Laboratorio 7 de 10',
        hora: '—',
        subtemas: [
          'Tinciones vitales (rojo neutro, verde jano)',
          'Identificación de organelas',
          'Actividad metabólica celular',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
    ],
  },

  // ─── UNIDAD 4 — MECANISMOS MOLECULARES DE LA HERENCIA ──────────────────────
  {
    id: 'u4',
    titulo: 'Unidad 4 — Mecanismos moleculares de la herencia',
    fechas: '4 teorías · 5 talleres · 3 laboratorios · 1 autoaprendizaje',
    actividades: [
      {
        id: 'bcm-te-9',
        tipo: 'TEORIA',
        unidad: 'HERENCIA',
        codigo: 'Te9',
        titulo: 'Te9 — Replicación',
        fecha: 'Teoría 9 de 12',
        hora: '—',
        subtemas: [
          'Estructura del ADN y cromosomas',
          'Horquilla de replicación y ADN polimerasas',
          'Hebra líder y hebra retrasada',
          'Mutaciones y reparación del ADN',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-10',
        tipo: 'TEORIA',
        unidad: 'HERENCIA',
        codigo: 'Te10',
        titulo: 'Te10 — Transcripción y traducción',
        fecha: 'Teoría 10 de 12',
        hora: '—',
        subtemas: [
          'ARN polimerasa y promotores',
          'Procesamiento del ARNm: splicing, cap y poli-A',
          'Código genético y ribosomas',
          'Iniciación, elongación y terminación',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-te-11',
        tipo: 'TEORIA',
        unidad: 'HERENCIA',
        codigo: 'Te11',
        titulo: 'Te11 — Meiosis',
        fecha: 'Teoría 11 de 12',
        hora: '—',
        subtemas: [
          'Meiosis I y meiosis II',
          'Entrecruzamiento y variabilidad genética',
          'Comparación con la mitosis',
          'No disyunción y aneuploidías',
        ],
        docentes: [],
        // Envase "en capas", variante «pdf-page» en px (ver /addresumencapas).
        // Su `vectors.svg` no es tinta: son las 14 líneas del borde de una tabla.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-te-11', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-te-12',
        tipo: 'TEORIA',
        unidad: 'HERENCIA',
        codigo: 'Te12',
        titulo: 'Te12 — Apoptosis',
        fecha: 'Teoría 12 de 12',
        hora: '—',
        subtemas: [
          'Vía intrínseca y vía extrínseca',
          'Caspasas y familia Bcl-2',
          'Apoptosis vs. necrosis',
          'Apoptosis y cáncer',
        ],
        docentes: [],
      },
      {
        id: 'bcm-ta-9',
        tipo: 'TALLER',
        unidad: 'HERENCIA',
        codigo: 'Ta9',
        titulo: 'Ta9 — Replicación',
        fecha: 'Taller 9 de 13',
        hora: '—',
        subtemas: [
          'Ejercicios de hebras molde y complementarias',
          'Fragmentos de Okazaki',
          'Telómeros y telomerasa',
        ],
        docentes: [],
      },
      {
        id: 'bcm-ta-10',
        tipo: 'TALLER',
        unidad: 'HERENCIA',
        codigo: 'Ta10',
        titulo: 'Ta10 — Regulación de la expresión de genes. Epigenética',
        fecha: 'Taller 10 de 13',
        hora: '—',
        subtemas: [
          'Operón lactosa y operón triptófano',
          'Factores de transcripción y enhancers',
          'Metilación del ADN y modificación de histonas',
          'ARN de interferencia',
        ],
        docentes: [],
        // Envase «documento de flujo» (ver /addresumencapas): 9 hojas del
        // taller resuelto, con las figuras en flujo.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-10', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-ta-11',
        tipo: 'TALLER',
        unidad: 'HERENCIA',
        codigo: 'Ta11',
        titulo: 'Ta11 — Meiosis',
        fecha: 'Taller 11 de 13',
        hora: '—',
        subtemas: [
          'Leyes de Mendel',
          'Cuadros de Punnett y proporciones',
          'Ligamiento y recombinación',
        ],
        docentes: [],
      },
      {
        id: 'bcm-ta-12',
        tipo: 'TALLER',
        unidad: 'HERENCIA',
        codigo: 'Ta12',
        titulo: 'Ta12 — Cáncer',
        fecha: 'Taller 12 de 13',
        hora: '—',
        subtemas: [
          'Protooncogenes y oncogenes',
          'Genes supresores de tumores (p53, Rb)',
          'Puntos de control del ciclo celular',
          'Características del cáncer',
        ],
        docentes: [],
        // El PDF original de las 3 hojas anotadas (una sola página de
        // 845 × 3670 pt). Estuvo publicado como "en capas" y BUST lo cambió
        // por el PDF; el fragmento y sus 7 figuras se borraron de Storage.
        resumen: { tipo: 'pdf' },
      },
      {
        id: 'bcm-ta-13',
        tipo: 'TALLER',
        unidad: 'HERENCIA',
        codigo: 'Ta13',
        titulo: 'Ta13 — Caso de integración (Unidades 3-4)',
        fecha: 'Taller 13 de 13',
        hora: '—',
        subtemas: [
          'Caso aplicado: de la señalización al ciclo celular',
          'Integración de membrana, endomembranas y herencia',
        ],
        docentes: [],
        // Envase "páginas auto-escaladas" (ver /addresumencapas): 7 hojas A4
        // con el texto palabra a palabra —buscable— y 3 tablas. Se escala solo
        // por container query, así que en móvil se lee sin zoom. Sustituyó a un
        // export en capas de 12 subpáginas y 1.2 MB de figuras.
        resumen: {
          tipo: 'pdf',
          formato: 'html',
          opciones: [{ id: 'bcm-ta-13', label: 'Resumen', formato: 'html' }],
        },
      },
      {
        id: 'bcm-afpd-3',
        tipo: 'AUTOAPRENDIZAJE',
        unidad: 'HERENCIA',
        codigo: 'AFPD3',
        titulo: 'AFPD3 — Ciclo celular',
        fecha: 'Autoaprendizaje facilitado 3 de 3',
        hora: '—',
        subtemas: [
          'Fases G1, S, G2 y M',
          'Ciclinas y quinasas dependientes de ciclina',
          'Puntos de control',
        ],
        docentes: [],
      },
      {
        id: 'bcm-pl-8',
        tipo: 'LAB',
        unidad: 'HERENCIA',
        codigo: 'PL8',
        titulo: 'PL8 — Mitosis',
        fecha: 'Laboratorio 8 de 10',
        hora: '—',
        subtemas: [
          'Ápice de raíz de cebolla',
          'Identificación de profase, metafase, anafase y telofase',
          'Índice mitótico',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        // El escaneo de la guía resuelta y anotada a mano (4 hojas) va en
        // «Banqueo», no en «Resumen»: es la práctica con sus respuestas.
        propuestos: {
          tipo: 'pdf',
          claseId: 'bcm-pl-8-anotado',
          desc: 'Guía de la práctica resuelta y anotada a mano',
        },
      },
      {
        id: 'bcm-pl-9',
        tipo: 'LAB',
        unidad: 'HERENCIA',
        codigo: 'PL9',
        titulo: 'PL9 — Meiosis',
        fecha: 'Laboratorio 9 de 10',
        hora: '—',
        subtemas: [
          'Anteras y células madre del polen',
          'Reconocimiento de las fases meióticas',
          'Comparación mitosis / meiosis al microscopio',
        ],
        docentes: [],
        resumen: { tipo: 'pdf' },
        propuestos: {
          tipo: 'pdf',
          claseId: 'bcm-pl-9-anotado',
          desc: 'Guía de la práctica resuelta y anotada a mano',
        },
      },
      {
        id: 'bcm-pl-10',
        tipo: 'LAB',
        unidad: 'HERENCIA',
        codigo: 'PL10',
        titulo: 'PL10 — Cromosomas politénicos',
        fecha: 'Laboratorio 10 de 10',
        hora: '—',
        subtemas: [
          'Glándulas salivales de Drosophila',
          'Bandas y puffs cromosómicos',
          'Relación con la actividad transcripcional',
        ],
        docentes: [],
        // Guía resuelta y anotada a mano, envase «hojas de tamaño fijo» (5
        // hojas). Va en Banqueo, no en Resumen: PL10 no tiene resumen propio.
        propuestos: {
          tipo: 'pdf',
          claseId: 'bcm-pl-10-anotado',
          formato: 'html',
          desc: 'Guía de la práctica resuelta y anotada a mano',
        },
      },
    ],
  },

  // ─── INTEGRACIÓN Y EVALUACIONES ────────────────────────────────────────────
  {
    id: 'eval',
    titulo: 'Integración y evaluaciones',
    fechas: 'Semanas 8, 16 y 17',
    esEvaluacion: true,
    actividades: [
      {
        id: 'bcm-integracion-1',
        tipo: 'INTEGRACION',
        unidad: 'EVALUACION',
        titulo: 'Integración de conceptos 1',
        fecha: 'Antes del examen parcial',
        hora: '—',
        subtemas: [
          'Te1–Te6 · Ta1–Ta5',
          'AFPD1 · AFA1–2',
          'PL1–PL4',
        ],
        docentes: [],
      },
      {
        id: 'bcm-examen-parcial',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen parcial',
        fecha: 'Semana 8',
        hora: '—',
        subtemas: [
          'Te1–Te6 · Ta1–Ta6',
          'AFPD1 · AFA1–2',
          'PL1–PL5',
        ],
        docentes: [],
        nota: 'Vale 30% de la nota final (EXP).',
      },
      {
        id: 'bcm-integracion-2',
        tipo: 'INTEGRACION',
        unidad: 'EVALUACION',
        titulo: 'Integración de conceptos 2',
        fecha: 'Antes del examen final',
        hora: '—',
        subtemas: [
          'Te7–Te12 · Ta7–Ta12',
          'AFPD2–3',
          'PL6–PL9',
        ],
        docentes: [],
      },
      {
        id: 'bcm-examen-final',
        tipo: 'EXAMEN-T',
        unidad: 'EVALUACION',
        titulo: 'Examen final',
        fecha: 'Semana 16',
        hora: '—',
        subtemas: [
          'Te7–Te12 · Ta7–Ta13',
          'AFPD2–3',
          'PL6–PL10',
        ],
        docentes: [],
        nota: 'Vale 30% de la nota final (EXF).',
        propuestos: {
          tipo: 'pdf',
          claseId: 'bcm-examen-final-resuelto',
          formato: 'html',
          desc: 'Examen final resuelto',
        },
      },
      {
        id: 'bcm-sustitutorio',
        tipo: 'SUSTIT',
        unidad: 'EVALUACION',
        titulo: 'Examen de rezagados / sustitutorio',
        fecha: 'Semana 17',
        hora: '—',
        subtemas: ['Reemplaza la nota de parcial o final'],
        docentes: [],
        // Mismo documento que el examen final: un único fragmento en Storage al
        // que apuntan las dos actividades. La descripción dice de cuál examen
        // es, porque desde aquí no se deduce.
        propuestos: {
          tipo: 'pdf',
          claseId: 'bcm-examen-final-resuelto',
          formato: 'html',
          desc: 'Examen final resuelto',
        },
      },
    ],
  },
];

export const curso = {
  nombre: 'Introducción a la Biología Celular',
  codigo: 'U0670',
  carrera: 'Medicina · UPCH',
  duracion: '19 ago – 14 dic 2024 · 17 semanas',
  creditos: '04 créditos · 32h teoría / 64h práctica',
  coordinadora: 'Dra. María Arana',
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
