import { PLANES_NUEVOS } from '@/lib/plans';
import { soles } from '@/components/planes/oferta';

/**
 * Contenido de la landing nueva (prototipo de GO con su mascota), tal cual lo trae el
 * prototipo. La demo es ilustrativa; los planes (tarjetas y textos) viven en
 * `components/planes/oferta.ts`, con los importes de `PLANS`.
 */

/** El nombre de la mascota y asistente de IA. Cambiarlo aquí lo cambia en toda la landing. */
export const ASISTENTE = 'GRIMI';

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
    id: 'upch', tab: 'Aprender', label: 'PRÓXIMAMENTE · TU RUTA CON IA', title: ['Empieza por tus bases.', 'Construye tus conexiones.'],
    description: `Cuéntale a ${ASISTENTE} qué tema quieres aprender y de dónde partes. Te propondrá un orden para comprender sus fundamentos, relacionarlos y practicar. Tú eliges por dónde empezar y a qué ritmo.`,
    stamp: 'APRENDER', note: `${ASISTENTE} propone. Tú eliges.`, demo: 'MI RUTA · APRENDER',
  },
  {
    id: 'basicas', tab: 'Reforzar', label: 'PRÓXIMAMENTE · REPASO CON IA', title: ['Vuelve a lo que cuesta.', 'Entiéndelo desde la base.'],
    description: `Elige los conceptos que te cuestan. ${ASISTENTE} te sugerirá qué fundamentos retomar y con qué resúmenes y preguntas. Podrás aceptar la propuesta, cambiar el orden o centrarte en un tema.`,
    stamp: 'REFORZAR', note: 'Refuerza lo que tú necesitas.', demo: 'MI RUTA · REFORZAR',
  },
  {
    id: 'encib', tab: 'Preparar', label: 'PRÓXIMAMENTE · UN PLAN CON IA', title: ['Un examen en mente.', 'Un repaso con sentido.'],
    description: `Indica qué entra en tu examen, cuánto tiempo tienes y qué necesitas reforzar. ${ASISTENTE} te propondrá cómo repartir el repaso y la práctica. Tú ajustas el recorrido.`,
    stamp: 'PREPARAR', note: 'Tu objetivo marca el recorrido.', demo: 'MI RUTA · PREPARAR',
  },
];

export const PREGUNTAS: { q: string; a: string; abierta?: boolean }[] = [
  { q: '¿Qué incluye cada plan y cómo se cobra?', a: `Hay tres planes y todos se cobran cada mes, en soles peruanos (S/), y se renuevan solos hasta que canceles. ${PLANES_NUEVOS.map((p) => p.commitmentMonths ? `${p.label}: S/ ${soles(p.amount)} al mes, con permanencia de ${p.commitmentMonths} meses` : `${p.label}: S/ ${soles(p.amount)} al mes, sin permanencia`).join('; ')}. Visitante abre los cursos preclínicos y tu universidad; Residente y Especialista suman las metas de examen (como el ENCIB), el laboratorio virtual y MedGO IA.` },
  { q: '¿MedGO es para mí si estudio en otro país o universidad?', a: 'Sí. MedGO está pensado para cualquier persona que quiera aprender las ciencias básicas de medicina, sin depender de un país, universidad o examen concreto. Puedes usarlo para empezar, acompañar tus cursos o reforzar conocimientos. El contenido está actualmente en español; los recorridos universitarios y exámenes específicos son opciones dentro de la plataforma, no su único enfoque.', abierta: true },
  { q: '¿Qué puedo estudiar y cómo me ayuda MedGO?', a: 'Puedes explorar anatomía, fisiología, bioquímica, histología, embriología, microbiología, patología y farmacología según el catálogo disponible. MedGO conecta resúmenes, banqueos explicados, modelos 3D, atlas y simulaciones para que pases de entender un concepto a reconocerlo y ponerlo a prueba. La disponibilidad de cada recurso se indica en su curso o sección.' },
  { q: '¿Cómo funcionarán las rutas de estudio con IA?', a: `Próximamente podrás indicar tu objetivo, los temas que quieres estudiar, tu punto de partida y el tiempo disponible. ${ASISTENTE} te propondrá una secuencia de conceptos, recursos y práctica. Tú podrás elegirla, cambiar su orden y ajustar el recorrido según avances. Es una función en preparación: las rutas de esta página ilustran la propuesta, todavía no generan un plan personalizado.` },
  { q: `¿Quién es ${ASISTENTE}?`, a: `${ASISTENTE} es la mascota de MedGO y su asistente de inteligencia artificial: el personaje que ves en esta página. Está pensado para ayudarte a aclarar conceptos y profundizar en lo que estudias, y para proponerte rutas de estudio. Esas rutas todavía no están activas: llegarán pronto.` },
  { q: '¿Qué puedo explorar antes de suscribirme?', a: 'Puedes recorrer la vista previa de esta página para conocer el espacio de estudio, la práctica, el laboratorio y el progreso. Con tu cuenta puedes recorrer el temario completo de cada curso y meta; los resúmenes, banqueos y laboratorios se abren con un plan.' },
];
