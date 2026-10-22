/**
 * Contenido de la landing nueva (prototipo de GO con DOT), tal cual lo trae el
 * prototipo. La demo es ilustrativa; los planes son una copia visual de
 * `PLANS` / `Pricing.tsx` que todavía no se lee de `src/lib/plans.ts`.
 */

export type CursoDemo = 'cardio' | 'farmaco' | 'histo';

export const CURSOS_DEMO: Record<CursoDemo, {
  name: string; desc: string; avatar: 'blue' | 'teal' | 'lilac'; icono: 'heart' | 'flask' | 'book';
  /** Icono de materia del ENCIB (`/assets/cursos/materia-<materia>_v6.avif`), el mismo de /estudio. */
  materia: string;
  lessons: string[]; subtitle: string; objective: string; explanation: string; map: string[];
}> = {
  cardio: {
    name: 'Sistema Cardiovascular', desc: 'La idea detrás de cada latido.', avatar: 'blue', icono: 'heart', materia: 'fisiologia',
    lessons: ['Mediastino: definición y divisiones', 'Pericardio y morfología externa del corazón', 'Morfología interna del corazón'],
    subtitle: 'Un espacio. Muchas conexiones.',
    objective: 'Reconoce sus divisiones y relaciona cada estructura con su ubicación.',
    explanation: 'Entre ambos pulmones, el mediastino organiza las estructuras centrales del tórax. Empieza por sus límites y después explora sus relaciones.',
    map: ['Mediastino', 'Superior', 'Inferior', 'Anterior', 'Medio', 'Posterior'],
  },
  farmaco: {
    name: 'Farmacología', desc: 'Entender cómo actúan.', avatar: 'teal', icono: 'flask', materia: 'farmacologia',
    lessons: ['Farmacocinética', 'Receptores', 'Antimicrobianos'],
    subtitle: 'Del mecanismo al efecto.',
    objective: 'Conecta la absorción, distribución, metabolismo y eliminación de un fármaco.',
    explanation: 'Comprender cómo se mueve un fármaco por el organismo permite ordenar sus efectos. Esta vista ilustra cómo cambia el contexto de una clase.',
    map: ['Farmacocinética', 'Entrada', 'Recorrido', 'Distribución', 'Metabolismo', 'Eliminación'],
  },
  histo: {
    name: 'Histología', desc: 'De la estructura a la función.', avatar: 'lilac', icono: 'book', materia: 'histologia',
    lessons: ['Tejido epitelial', 'Tejido conectivo', 'Tejido muscular'],
    subtitle: 'La estructura explica la función.',
    objective: 'Relaciona la organización del tejido con su función en el organismo.',
    explanation: 'Observar un tejido es reconocer patrones y conectarlos con lo que hace. Esta vista muestra cómo se organiza un tema dentro del espacio de estudio.',
    map: ['Epitelio', 'Revestimiento', 'Glandular', 'Exocrino', 'Endocrino', 'Mixto'],
  },
};

/** El temario del miniclon: la unidad de la demo y una segunda semana, como el sílabo real. */
export const SEMANAS_DEMO: Record<CursoDemo, { titulo: string; extra: { titulo: string; clases: string[] } }> = {
  cardio: { titulo: '01 · Anatomía y estructura', extra: { titulo: '02 · Función y actividad eléctrica', clases: ['Ciclo cardíaco y curvas presión-volumen', 'Sistema de conducción y electrocardiograma'] } },
  farmaco: { titulo: '01 · Principios generales', extra: { titulo: '02 · Mecanismos', clases: ['Farmacodinamia', 'Interacciones'] } },
  histo: { titulo: '01 · Tejidos básicos', extra: { titulo: '02 · Tejidos especiales', clases: ['Tejido nervioso', 'Sangre'] } },
};

/** Tipo de cada clase del miniclon, por posición (las etiquetas del sílabo real). */
export const TIPOS_DEMO = ['Magistral', 'Seminario', 'Práctica', 'Magistral', 'TBL'];

/** Las tarjetas del Laboratorio virtual del miniclon (como las de /estudio/laboratorio). */
export const LABS_DEMO: {
  titulo: string; tipo: 'Simulación' | 'Modelo 3D' | 'Atlas'; materia: string; desc: string;
  arte: 'corazon' | 'ecg' | 'icono'; icono: 'cube' | 'book' | 'flask'; paraTuClase?: boolean;
}[] = [
  { titulo: 'Ciclo cardíaco', tipo: 'Simulación', materia: 'Cardiovascular', desc: 'Relaciona las fases del latido con válvulas, presión y volumen.', arte: 'corazon', icono: 'flask', paraTuClase: true },
  { titulo: 'Electrocardiograma', tipo: 'Simulación', materia: 'Cardiovascular', desc: 'Sigue el impulso eléctrico y su relación con las ondas del trazado.', arte: 'ecg', icono: 'flask' },
  { titulo: 'Corazón en 3D', tipo: 'Modelo 3D', materia: 'Anatomía', desc: 'Gíralo, aísla cada estructura y mira sus relaciones.', arte: 'icono', icono: 'cube' },
  { titulo: 'Atlas de histología', tipo: 'Atlas', materia: 'Histología', desc: 'Láminas reales, filtradas por tinción y aumento.', arte: 'icono', icono: 'book' },
];

/** Lo que muestra una clase que no es la primera del curso (texto genérico del prototipo). */
export const CLASE_GENERICA = {
  subtitle: 'Una idea. Distintas conexiones.',
  objective: 'Vista de ejemplo: identifica los conceptos, sus relaciones y cómo aplicarlos.',
  explanation: 'Esta vista ilustra cómo se mantiene el contexto al cambiar de clase. El contenido completo se consulta en el espacio de estudio.',
  map: (titulo: string) => [titulo, 'Conceptos', 'Relaciones', 'Identifica', 'Conecta', 'Aplica'],
};

export type RutaLanding = 'upch' | 'basicas' | 'encib';

export const RUTAS: { id: RutaLanding; tab: string; label: string; title: [string, string]; description: string; stamp: string; note: string; demo: string }[] = [
  {
    id: 'upch', tab: 'UPCH', label: 'TU SÍLABO, A TU RITMO', title: ['El orden de tu curso.', 'El espacio para entenderlo.'],
    description: 'Encuentra tus clases organizadas por sílabo. Mantén el temario a mano y continúa con el tema que necesitas.',
    stamp: 'UPCH', note: 'Tu sílabo. Tu ritmo.', demo: 'MI RUTA · UPCH',
  },
  {
    id: 'basicas', tab: 'Ciencias básicas', label: 'TUS FUNDAMENTOS, CONECTADOS', title: ['Construye una base.', 'Conecta lo que aprendes.'],
    description: 'Recorre las materias de ciencias básicas y vuelve a cada concepto desde su resumen, su práctica o un recurso del laboratorio.',
    stamp: 'CIENCIAS BÁSICAS', note: 'Una base para seguir aprendiendo.', demo: 'MI RUTA · CIENCIAS BÁSICAS',
  },
  {
    id: 'encib', tab: 'ENCIB', label: 'UN OBJETIVO DE PREPARACIÓN', title: ['Las mismas bases.', 'Una ruta hacia el examen.'],
    description: 'Organiza los fundamentos con un objetivo de examen. Un recorrido orientado al repaso y a la práctica, sobre la misma biblioteca de ciencias básicas.',
    stamp: 'ENCIB', note: 'Un objetivo. Un siguiente paso.', demo: 'MI RUTA · ENCIB',
  },
];

export type TramoLanding = 'medicina' | 'basico';

export interface PlanLanding {
  key: string; name: string; price: string; period: string; billing: string; note: string;
  intro: string; features: string[]; cta: string; summary: string[];
}

const GRATUITO: PlanLanding = {
  key: 'free', name: 'Gratuito', price: '0', period: '', billing: 'Para siempre', note: 'Acceso gratuito y limitado.',
  intro: 'Para empezar:', features: ['Cursos limitados', 'Calculadora de promedio', 'Lecciones básicas', 'Quizzes de práctica'],
  cta: 'Empezar gratis', summary: ['Cursos limitados y lecciones básicas', 'Quizzes de práctica', 'Calculadora de promedio'],
};

export const PLANES: Record<TramoLanding, PlanLanding[]> = {
  medicina: [
    GRATUITO,
    {
      key: 'interno', name: 'Interno', price: '14', period: '/ mes', billing: 'Facturado cada mes', note: 'Compromiso mínimo de 3 meses.',
      intro: 'Incluye:',
      features: ['Todos los cursos de Medicina', 'Sílabo personalizado', 'Quizzes ilimitados', 'Seguimiento de progreso', 'Soporte prioritario', 'Resúmenes y trabajos', 'Modelos 3D'],
      cta: 'Ver plan Interno',
      summary: ['Cursos y sílabo personalizado', 'Quizzes y seguimiento de progreso', 'Resúmenes, trabajos y modelos 3D', 'Soporte prioritario'],
    },
    {
      key: 'residente', name: 'Residente', price: '11.90', period: '/ mes', billing: 'Pago único de S/ 142.80 al año', note: 'Equivalente mensual con pago anual.',
      intro: 'Todo lo de Interno, más:',
      features: ['Precio fijo durante 12 meses', 'Exámenes simulacro', 'Flashcards', 'Acceso anticipado a simulaciones'],
      cta: 'Ver plan Residente',
      summary: ['Simulacros y flashcards', 'Precio fijo por 12 meses', 'Acceso anticipado a simulaciones'],
    },
  ],
  basico: [
    GRATUITO,
    {
      key: 'ufbi', name: 'UFBI', price: '19.70', period: '/ mes', billing: 'Facturado cada mes', note: 'Compromiso mínimo de 3 meses.',
      intro: 'Los 6 cursos de tu ciclo:',
      features: ['Biología Celular, Física y Química Orgánica', 'Ciencias Sociales, Comunicación y Cultura Ambiental (beta)', 'Sílabo personalizado', 'Quizzes ilimitados (beta)', 'Laboratorios y simulaciones'],
      cta: 'Ver plan UFBI',
      summary: ['6 cursos del ciclo (incluye beta)', 'Sílabo personalizado', 'Quizzes ilimitados (beta)', 'Laboratorios y simulaciones'],
    },
    {
      key: 'ufbi-anual', name: 'UFBI Anual', price: '15.75', period: '/ mes', billing: 'Pago único de S/ 189 al año', note: 'Equivalente mensual con pago anual.',
      intro: 'Todo lo de UFBI, más:',
      features: ['20% de descuento en el plan anual', 'Acceso anticipado a nuevo contenido', 'Acceso anticipado a simulaciones', 'Sin renovaciones mensuales'],
      cta: 'Ver plan UFBI Anual',
      summary: ['20% de descuento anual', 'Contenido y simulaciones anticipados', 'Un pago para 12 meses'],
    },
  ],
};

export const PREGUNTAS: { q: string; a: string; abierta?: boolean }[] = [
  { q: '¿Cómo se cobra un plan anual?', a: 'El precio por mes es un equivalente para comparar. Residente se paga en un único cobro de S/ 142.80 al año y UFBI Anual en un único cobro de S/ 189 al año. El importe total también aparece en cada tarjeta.' },
  { q: '¿GO es sólo para estudiantes de la UPCH?', a: 'No. La ruta UPCH sigue el sílabo del curso; Ciencias básicas permite estudiar por materias y ENCIB orienta el recorrido hacia el examen.', abierta: true },
  { q: '¿Qué puedo probar aquí?', a: 'Esta es una demostración visual. Puedes cambiar de recurso, explorar una pregunta y comparar rutas. «Probar mi espacio» abre la interfaz local de estudio.' },
  { q: '¿Ciencias básicas y ENCIB son contenidos separados?', a: 'Comparten fundamentos. Cambia la organización del estudio y el objetivo de la ruta; no necesitas pensar en ellos como dos bibliotecas independientes.' },
  { q: '¿Qué hace DOT en esta versión?', a: 'Es la mascota del espacio: sigue tu cursor y responde al saludo. Esta demostración no conecta un asistente de IA, cuentas ni pagos.' },
  { q: '¿Puedo detener el movimiento?', a: 'Sí. Usa «Pausar movimiento» debajo de la demostración. También se respeta la preferencia de movimiento reducido de tu dispositivo.' },
];
