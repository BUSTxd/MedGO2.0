import { findSolucionario } from '@/lib/data/solucionarios';

/**
 * Fuente única de verdad de «qué material tiene y qué le falta a una actividad».
 *
 * Cada actividad del sílabo ofrece tres tarjetas de estudio (ver
 * `StudyMaterialSection`): una de apoyo audiovisual (Video, o Simulación en las
 * prácticas), una de práctica (Banqueo, o Propuestos en las clases teóricas de
 * Física) y una de material escrito (Resumen).
 *
 * El panel de aportes lee de aquí para no reimplementar las reglas que cada
 * `[id]/page.tsx` aplica al montar las tarjetas. Al añadir una regla nueva en
 * un curso hay que reflejarla en `REGLAS` o el panel mostrará un hueco falso.
 */

export type SlotKind = 'apoyo' | 'banqueo' | 'resumen';

export type SlotEstado =
  /** Publicado y accesible al alumno. */
  | 'listo'
  /** Hueco real: la tarjeta se ve apagada y debería tener material. */
  | 'falta'
  /** La tarjeta no se muestra en esta actividad (lab sin banqueo, evaluación). */
  | 'no-aplica'
  /** Planificado a futuro, no bloquea el lanzamiento (video). */
  | 'futuro';

export interface Slot {
  kind: SlotKind;
  /** Nombre tal como lo ve el alumno: «Propuestos», «Simulación»… */
  label: string;
  estado: SlotEstado;
}

/** Forma mínima común a los 16 sílabos; cada curso añade campos propios. */
export interface ActividadLike {
  id: string;
  tipo: string;
  codigo?: string;
  titulo: string;
  resumen?: unknown;
  examen?: unknown;
  qbank?: unknown;
  /** PDF de problemas propuestos (Física C1–C4), abre en el mismo visor que Resumen. */
  propuestos?: unknown;
  simulacion?: { href?: string };
  sinMaterial?: boolean;
}

export interface PlanActividad {
  id: string;
  titulo: string;
  tipo: string;
  codigo?: string;
  /**
   * No hay ni va a haber material propio: la clase muestra la invitación a
   * colaborar (`SinMaterialSection`) en vez de las tres tarjetas apagadas.
   * No es un hueco pendiente, es una decisión tomada.
   */
  invitacion: boolean;
  /**
   * Es una evaluación que el alumno rinde (examen, parcial, final, PC, paso).
   * Su banqueo pesa más que el de una clase suelta: es lo que se busca para
   * prepararla, y no hay resumen que lo sustituya.
   */
  esExamen: boolean;
  /** Categoría legible de la evaluación («Examen final»), sólo si `esExamen`. */
  examenLabel?: string;
  apoyo: Slot;
  banqueo: Slot;
  resumen: Slot;
}

/**
 * Evaluaciones que el alumno *rinde*: exámenes, prácticas calificadas, pasos.
 *
 * No se les exige material escrito —no son contenido sino el examen del
 * contenido; si alguna lo tiene igual cuenta como listo, nunca como hueco—,
 * pero **sí se les exige banqueo**: los exámenes resueltos de años anteriores
 * son justamente lo que el alumno viene a buscar antes de un parcial o un
 * final.
 */
const TIPOS_EXAMEN = new Set([
  'EXAMEN',
  'EXAMEN-T',
  'EXAMEN-L',
  'EXAMEN-P',
  'EXAM-PARC',
  'EXAM-FINAL',
  'EXAM-ANAT',
  'PC',
  'PASO',
  'PASO-CORTO',
  'SUSTIT',
]);

/**
 * Evaluaciones que se *entregan* (un trabajo, un producto, un informe). No hay
 * nada que banquear ni que resumir: ninguna de las tres tarjetas aplica.
 */
const TIPOS_ENTREGA = new Set(['ENTREGABLE', 'PRODUCTO']);

/** Nombre legible del tipo de evaluación, para el listado de pendientes. */
const ETIQUETA_EXAMEN: Record<string, string> = {
  'EXAMEN':     'Examen',
  'EXAMEN-T':   'Examen teórico',
  'EXAMEN-L':   'Examen de laboratorio',
  'EXAMEN-P':   'Examen práctico',
  'EXAM-PARC':  'Examen parcial',
  'EXAM-FINAL': 'Examen final',
  'EXAM-ANAT':  'Examen de anatomía',
  'PC':         'Práctica calificada',
  'PASO':       'Paso',
  'PASO-CORTO': 'Paso corto',
  'SUSTIT':     'Sustitutorio',
};

/** Categoría de la evaluación tal como la nombra el sílabo («Examen final»…). */
export function etiquetaExamen(tipo: string): string {
  return ETIQUETA_EXAMEN[tipo] ?? 'Evaluación';
}

interface CursoReglas {
  /** Tipos donde la tarjeta «Video» se sustituye por «Simulación». */
  simulacionEn?: readonly string[];
  /** Tipos donde la tarjeta de banqueo no se muestra (`hideBanqueo`). */
  sinBanqueoEn?: readonly string[];
  /** Título alternativo de la tarjeta de banqueo, según el tipo de actividad. */
  banqueoLabel?: { label: string; tipos: readonly string[] };
}

/** Espejo de lo que cada `cursos/<slug>/[id]/page.tsx` pasa a las tarjetas. */
const REGLAS: Record<string, CursoReglas> = {
  hematologia:              { simulacionEn: ['LAB'], sinBanqueoEn: ['LAB'] },
  inmunologia:              { simulacionEn: ['LAB'], sinBanqueoEn: ['LAB'] },
  'aparato-locomotor':      { simulacionEn: ['ANATOMIA', 'HISTOLOGIA'] },
  digestivo:                { simulacionEn: ['ANATOMIA', 'HISTOLOGIA'] },
  'endocrino-reproductor':  { simulacionEn: ['ANATOMIA', 'HISTOLOGIA', 'TALLER'] },
  // Todas las clases teóricas (C1–C14) usan el PDF de propuestos, no un banco
  // interactivo — PC/EXAMEN-T siguen mostrando "Banqueo" por defecto.
  'fisica-medicina':        { banqueoLabel: { label: 'Propuestos', tipos: ['TEORIA'] } },
};

/** Título de la tarjeta de práctica. Lo usan el panel y la página del curso. */
export function banqueoLabelDe(slug: string, tipo: string): string {
  const regla = REGLAS[slug]?.banqueoLabel;
  return regla && regla.tipos.includes(tipo) ? regla.label : 'Banqueo';
}

export function planDeActividad(slug: string, act: ActividadLike): PlanActividad {
  const reglas = REGLAS[slug] ?? {};
  const invitacion = act.sinMaterial === true;
  const esExamen = TIPOS_EXAMEN.has(act.tipo);
  const esEntrega = TIPOS_ENTREGA.has(act.tipo);
  const esEvaluacion = esExamen || esEntrega;

  const usaSimulacion = reglas.simulacionEn?.includes(act.tipo) ?? false;
  const apoyoListo = usaSimulacion && !!act.simulacion?.href;

  // El banqueo se llena de cuatro formas: examen del bucket, qbank, solucionario
  // paso a paso (Química Orgánica, vive fuera del sílabo) o PDF de práctica.
  //
  // Aquí sólo se decide si está o no está. Si ese material se armó o sólo se
  // consiguió no se puede deducir del sílabo —el mismo PDF puede ser trabajo
  // propio o una descarga—, así que lo declara quien lo subió al marcar su
  // círculo en «Quién subió qué» (`OrigenMarca` en `aportes-marcas.ts`).
  const banqueoListo = !!(act.examen || act.qbank || act.propuestos || findSolucionario(act.id));
  // Los exámenes sí exigen banqueo; los entregables no tienen nada que banquear.
  const banqueoNoAplica =
    invitacion || esEntrega || (reglas.sinBanqueoEn?.includes(act.tipo) ?? false);

  return {
    id: act.id,
    titulo: act.titulo,
    tipo: act.tipo,
    codigo: act.codigo,
    invitacion,
    esExamen,
    examenLabel: esExamen ? etiquetaExamen(act.tipo) : undefined,
    apoyo: {
      kind: 'apoyo',
      label: usaSimulacion ? 'Simulación' : 'Video',
      estado: apoyoListo ? 'listo' : invitacion ? 'no-aplica' : 'futuro',
    },
    banqueo: {
      kind: 'banqueo',
      label: banqueoLabelDe(slug, act.tipo),
      estado: banqueoListo ? 'listo' : banqueoNoAplica ? 'no-aplica' : 'falta',
    },
    resumen: {
      kind: 'resumen',
      label: 'Resumen',
      estado: act.resumen ? 'listo' : invitacion || esEvaluacion ? 'no-aplica' : 'falta',
    },
  };
}
