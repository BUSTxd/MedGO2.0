import { findSolucionario } from '@/lib/data/solucionarios';

/**
 * Fuente única de verdad de «qué material tiene y qué le falta a una actividad».
 *
 * Cada actividad del sílabo ofrece tres tarjetas de estudio (ver
 * `StudyMaterialSection`): una de apoyo audiovisual (Video, o Simulación en las
 * prácticas), una de práctica (Banqueo, o Propuestos en Física C1–C4) y una de
 * material escrito (Resumen, o Database en las PD de Química Orgánica).
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
  /** Nombre tal como lo ve el alumno: «Database», «Propuestos», «Simulación»… */
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
  apoyo: Slot;
  banqueo: Slot;
  resumen: Slot;
}

/**
 * Evaluaciones: no se les exige material propio, porque no son contenido sino
 * el examen del contenido. Si alguna lo tiene igual (las PD y PCs de Química
 * Orgánica llevan Database) cuenta como listo, nunca como hueco.
 */
const TIPOS_EVALUACION = new Set([
  'EXAMEN-T',
  'EXAMEN-L',
  'EXAMEN-P',
  'PC',
  'SUSTIT',
]);

interface CursoReglas {
  /** Tipos donde la tarjeta «Video» se sustituye por «Simulación». */
  simulacionEn?: readonly string[];
  /** Tipos donde la tarjeta de banqueo no se muestra (`hideBanqueo`). */
  sinBanqueoEn?: readonly string[];
  /** Título alternativo de la tarjeta de resumen, según el tipo de actividad. */
  resumenLabel?: { label: string; tipos: readonly string[] };
  /** Título alternativo de la tarjeta de banqueo, según el código del sílabo. */
  banqueoLabel?: { label: string; codigos: readonly string[] };
}

/** Espejo de lo que cada `cursos/<slug>/[id]/page.tsx` pasa a las tarjetas. */
const REGLAS: Record<string, CursoReglas> = {
  hematologia:              { simulacionEn: ['LAB'], sinBanqueoEn: ['LAB'] },
  inmunologia:              { simulacionEn: ['LAB'], sinBanqueoEn: ['LAB'] },
  'aparato-locomotor':      { simulacionEn: ['ANATOMIA', 'HISTOLOGIA'] },
  digestivo:                { simulacionEn: ['ANATOMIA', 'HISTOLOGIA'] },
  'endocrino-reproductor':  { simulacionEn: ['ANATOMIA', 'HISTOLOGIA', 'TALLER'] },
  'quimica-organica':       { resumenLabel: { label: 'Database', tipos: ['PD', 'PC', 'EXAMEN-T'] } },
  'fisica-medicina':        { banqueoLabel: { label: 'Propuestos', codigos: ['C1', 'C2', 'C3', 'C4'] } },
};

/** Título de la tarjeta de material escrito. Lo usan el panel y la página del curso. */
export function resumenLabelDe(slug: string, tipo: string): string {
  const regla = REGLAS[slug]?.resumenLabel;
  return regla && regla.tipos.includes(tipo) ? regla.label : 'Resumen';
}

/** Título de la tarjeta de práctica. Lo usan el panel y la página del curso. */
export function banqueoLabelDe(slug: string, codigo?: string): string {
  const regla = REGLAS[slug]?.banqueoLabel;
  return regla && codigo && regla.codigos.includes(codigo) ? regla.label : 'Banqueo';
}

export function planDeActividad(slug: string, act: ActividadLike): PlanActividad {
  const reglas = REGLAS[slug] ?? {};
  const invitacion = act.sinMaterial === true;
  const esEvaluacion = TIPOS_EVALUACION.has(act.tipo);

  const usaSimulacion = reglas.simulacionEn?.includes(act.tipo) ?? false;
  const apoyoListo = usaSimulacion && !!act.simulacion?.href;

  // El banqueo se llena de tres formas: un examen del bucket, un qbank o un
  // solucionario paso a paso (Química Orgánica), que vive fuera del sílabo.
  const banqueoListo = !!(act.examen || act.qbank || findSolucionario(act.id));
  const banqueoNoAplica =
    invitacion || esEvaluacion || (reglas.sinBanqueoEn?.includes(act.tipo) ?? false);

  return {
    id: act.id,
    titulo: act.titulo,
    tipo: act.tipo,
    codigo: act.codigo,
    invitacion,
    apoyo: {
      kind: 'apoyo',
      label: usaSimulacion ? 'Simulación' : 'Video',
      estado: apoyoListo ? 'listo' : invitacion ? 'no-aplica' : 'futuro',
    },
    banqueo: {
      kind: 'banqueo',
      label: banqueoLabelDe(slug, act.codigo),
      estado: banqueoListo ? 'listo' : banqueoNoAplica ? 'no-aplica' : 'falta',
    },
    resumen: {
      kind: 'resumen',
      label: resumenLabelDe(slug, act.tipo),
      estado: act.resumen ? 'listo' : invitacion || esEvaluacion ? 'no-aplica' : 'falta',
    },
  };
}
