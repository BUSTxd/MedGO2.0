import { PLANS, type PlanCatalogEntry, type PlanKey, type Track } from '@/lib/plans';

/**
 * Contenido de la landing nueva (prototipo de GO con DOT), tal cual lo trae el
 * prototipo. La demo es ilustrativa; los planes leen importes, cadencia y
 * compromiso de `PLANS` (`src/lib/plans.ts`) y sólo el texto vive aquí.
 */

/** El curso del miniclon. `materia` = icono del ENCIB (`/assets/cursos/materia-<materia>_v6.avif`), el mismo de /estudio. */
export const CURSO_DEMO = {
  name: 'Sistema Cardiovascular', materia: 'fisiologia',
  lessons: ['Mediastino: definición y divisiones', 'Pericardio y morfología externa del corazón', 'Morfología interna del corazón'],
};

/** El temario del miniclon: la unidad de la demo y una segunda semana, como el sílabo real. */
export const SEMANAS_DEMO = {
  titulo: '01 · Anatomía y estructura',
  extra: { titulo: '02 · Función y actividad eléctrica', clases: ['Ciclo cardíaco y curvas presión-volumen', 'Sistema de conducción y electrocardiograma'] },
};

/** Tipo de cada clase del miniclon, por posición (las etiquetas del sílabo real). */
export const TIPOS_DEMO = ['Magistral', 'Seminario', 'Práctica', 'Magistral', 'TBL'];

/** Cuántos recursos hay en la biblioteca del Laboratorio real, por filtro. Lo cuenta el servidor (`landing-nueva/page.tsx`). */
export type CuentaBiblioteca = Record<'Todos' | 'Simulación' | 'Modelo 3D' | 'Atlas', number>;

/** Las tarjetas del Laboratorio virtual del miniclon (como las de /estudio/laboratorio); detrás va «Y muchos más». */
export const LABS_DEMO: { titulo: string; tipo: 'Simulación' | 'Modelo 3D'; materia: string; desc: string; imagen: string; paraTuClase?: boolean }[] = [
  { titulo: 'Ciclo cardíaco', tipo: 'Simulación', materia: 'Cardiovascular', desc: 'Relaciona las fases del latido con válvulas, presión y volumen.', imagen: '/assets/landing/corazon_v1.avif', paraTuClase: true },
  { titulo: 'Anatomía del miembro superior', tipo: 'Modelo 3D', materia: 'Aparato locomotor', desc: 'Gira el modelo, aísla cada hueso, músculo y nervio, y practica el examen 3D.', imagen: '/assets/cursos/materia-anatomia_v6.avif' },
  { titulo: 'Maduración linfocitaria', tipo: 'Simulación', materia: 'Inmunología', desc: 'De la célula madre a la plasmática, y el origen de las neoplasias linfoides.', imagen: '/assets/cursos/materia-inmunologia_v6.avif' },
];

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

export type TramoLanding = Track;

export interface PlanLanding {
  /** `free` o la clave de `PLANS`: de ahí salen importe, cadencia y compromiso. */
  key: 'free' | PlanKey;
  name: string;
  /** Lo que se ve grande: el importe, o su equivalente mensual en los anuales (como `Pricing.tsx`). */
  price: string;
  period: string;
  billing: string;
  note: string;
  intro: string;
  features: string[];
  summary: string[];
  cta: string;
}

/** El texto de cada tarjeta (el de `Pricing.tsx`). Los números NO van aquí: los pone `planLanding`. */
const TEXTO: Record<'free' | PlanKey, Pick<PlanLanding, 'intro' | 'features' | 'summary'>> = {
  free: {
    intro: 'Para empezar:',
    features: ['Cursos limitados', 'Calculadora de promedio', 'Lecciones básicas', 'Quizzes de práctica'],
    summary: ['Cursos limitados y lecciones básicas', 'Quizzes de práctica', 'Calculadora de promedio'],
  },
  interno: {
    intro: 'Incluye:',
    features: ['Todos los cursos de Medicina', 'Sílabo personalizado', 'Quizzes ilimitados', 'Seguimiento de progreso', 'Soporte prioritario', 'Resúmenes y trabajos', 'Modelos 3D'],
    summary: ['Cursos y sílabo personalizado', 'Quizzes y seguimiento de progreso', 'Resúmenes, trabajos y modelos 3D', 'Soporte prioritario'],
  },
  residente: {
    intro: 'Todo lo de Interno, más:',
    features: ['Bloqueo de precio por 12 meses', 'Exámenes simulacro', 'Flashcards', 'Acceso anticipado a simulaciones'],
    summary: ['Simulacros y flashcards', 'Precio fijo por 12 meses', 'Acceso anticipado a simulaciones'],
  },
  ufbi: {
    intro: 'Los 6 cursos de tu ciclo:',
    features: ['Biología Celular, Física y Química Orgánica', 'Ciencias Sociales, Comunicación y Cultura Ambiental (beta)', 'Sílabo personalizado', 'Quizzes ilimitados (beta)', 'Laboratorios y simulaciones'],
    summary: ['6 cursos del ciclo (incluye beta)', 'Sílabo personalizado', 'Quizzes ilimitados (beta)', 'Laboratorios y simulaciones'],
  },
  'ufbi-anual': {
    intro: 'Todo lo de UFBI, más:',
    features: ['20% de descuento en el plan anual', 'Acceso anticipado a nuevo contenido', 'Acceso anticipado a simulaciones', 'Sin renovaciones mensuales'],
    summary: ['20% de descuento anual', 'Contenido y simulaciones anticipados', 'Un pago para 12 meses'],
  },
};

/** «14», «19.70», «142.80»: los céntimos sólo cuando los hay (como en el resto de la web). */
export const soles = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/**
 * La tarjeta de un plan con los números de `PLANS` (`src/lib/plans.ts`): la cadencia sale
 * de `durationDays` (nunca del nombre) y el compromiso de `commitmentMonths`, como en
 * `SubscribeModal`, Mi cuenta y /terminos. Cambiar un precio allí lo cambia aquí.
 */
export function planLanding(key: 'free' | PlanKey): PlanLanding {
  const texto = TEXTO[key];
  if (key === 'free') {
    return { key, name: 'Gratuito', price: '0', period: '', billing: 'Para siempre', note: 'Acceso gratuito y limitado.', cta: 'Empezar gratis', ...texto };
  }
  const p = PLANS[key];
  const anual = p.durationDays >= 365;
  return {
    key,
    name: p.label,
    price: soles(anual ? Math.round((p.amount / 12) * 100) / 100 : p.amount),
    period: '/ mes',
    billing: anual ? `Pago único de S/ ${soles(p.amount)} al año` : 'Facturado cada mes',
    note: anual
      ? 'Equivalente mensual con pago anual.'
      : p.commitmentMonths ? `Compromiso mínimo de ${p.commitmentMonths} meses.` : 'Sin compromiso de permanencia.',
    cta: `Ver plan ${p.label}`,
    ...texto,
  };
}

/** Gratuito + los planes del tramo, el mensual antes que el anual. */
export const planesDe = (tramo: TramoLanding): PlanLanding[] => [
  planLanding('free'),
  ...(Object.values(PLANS) as PlanCatalogEntry[])
    .filter((p) => p.track === tramo)
    .sort((a, b) => a.durationDays - b.durationDays)
    .map((p) => planLanding(p.key)),
];

const anuales = (Object.values(PLANS) as PlanCatalogEntry[]).filter((p) => p.durationDays >= 365);

export const PREGUNTAS: { q: string; a: string; abierta?: boolean }[] = [
  { q: '¿Cómo se cobra un plan anual?', a: `El precio por mes es un equivalente para comparar. ${anuales.map((p) => `${p.label} se paga en un único cobro de S/ ${soles(p.amount)} al año`).join(' y ')}. El importe total también aparece en cada tarjeta.` },
  { q: '¿GO es sólo para estudiantes de la UPCH?', a: 'No. La ruta UPCH sigue el sílabo del curso; Ciencias básicas permite estudiar por materias y ENCIB orienta el recorrido hacia el examen.', abierta: true },
  { q: '¿Qué puedo probar aquí?', a: 'La ventana de la portada es una demostración: puedes cambiar de recurso, explorar una pregunta y comparar rutas. «Probar mi espacio» abre tu espacio de estudio real.' },
  { q: '¿Ciencias básicas y ENCIB son contenidos separados?', a: 'Comparten fundamentos. Cambia la organización del estudio y el objetivo de la ruta; no necesitas pensar en ellos como dos bibliotecas independientes.' },
  { q: '¿Qué hace DOT en esta versión?', a: 'Es la mascota del espacio: sigue tu cursor y responde al saludo. La ventana de la portada es una demostración: no conecta un asistente de IA.' },
  { q: '¿Puedo detener el movimiento?', a: 'Sí. Usa «Pausar movimiento» debajo de la demostración. También se respeta la preferencia de movimiento reducido de tu dispositivo.' },
];
