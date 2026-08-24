import { PLANS, planUnlocks, type PlanKey, type PlanState, type Track } from '@/lib/plans';
import { CURSOS, LABORATORIOS } from '@/lib/data/aportes';

/**
 * A qué tramo pertenece cada cosa del dashboard, y quién puede abrirla.
 *
 * El registro de tramos vive en `src/lib/data/aportes.ts` (`CURSOS` y
 * `LABORATORIOS`, con su `track`) y no se duplica aquí: es la misma verdad que
 * usa el panel de Aportes, y tenerla dos veces garantiza que un día discrepen.
 * Este módulo sólo la traduce a la pregunta que hace la UI: «¿este alumno puede
 * entrar?».
 */

/** El mensual de cada tramo. Los cursos declaran siempre el mensual como
 *  requisito: el anual los abre por rango (ver `planUnlocks`). */
const PLAN_DE_TRACK: Record<Track, PlanKey> = {
  basico: 'ufbi',
  medicina: 'interno',
};

const TRACK_CURSO = new Map(CURSOS.map((c) => [c.slug, c.track]));
const TRACK_LAB = new Map(LABORATORIOS.map((l) => [l.slug, l.track]));

/**
 * Fallback para un slug sin registrar. Hoy todo lo publicado fuera de los 6
 * cursos del ciclo básico es de la Facultad, así que bloquear de más es el
 * fallo seguro. Ojo al añadir contenido de UFBI: un laboratorio de Física que
 * no se registre en `LABORATORIOS` saldrá bloqueado justo para quien es.
 */
const TRACK_POR_DEFECTO: Track = 'medicina';

export function trackDeCurso(slug: string): Track {
  return TRACK_CURSO.get(slug) ?? TRACK_POR_DEFECTO;
}

export function trackDeLab(slug: string): Track {
  return TRACK_LAB.get(slug) ?? TRACK_POR_DEFECTO;
}

/** Plan mínimo que abre el contenido de un tramo. */
export function planDeTrack(track: Track): PlanKey {
  return PLAN_DE_TRACK[track];
}

/** Plan mínimo que abre el curso `slug`. */
export function requiredPlanDeCurso(slug: string): PlanKey {
  return PLAN_DE_TRACK[trackDeCurso(slug)];
}

/** Plan mínimo que abre el laboratorio `slug`. */
export function requiredPlanDeLab(slug: string): PlanKey {
  return PLAN_DE_TRACK[trackDeLab(slug)];
}

/**
 * ¿El estado de plan del usuario abre contenido que exige `required`?
 *
 * `allAccess` (admin) va primero: su plan es `residente`, del tramo `medicina`,
 * y sin el flag le quedarían bloqueados los cursos de UFBI. Después, la regla
 * de siempre — `planUnlocks`, **nunca** comparar `planRank`, que trata los dos
 * tramos como escalones de una misma escalera.
 */
export function tieneAccesoA(
  plan: Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>,
  required: PlanKey,
): boolean {
  return !!plan.allAccess || (plan.isActive && planUnlocks(plan.plan, required));
}

/**
 * El tramo al que pertenece el alumno, o `null` si aún no tiene plan activo.
 * Decide qué sección va primero en las rejillas; el acceso lo sigue diciendo
 * `tieneAccesoA`. El admin cuenta como `medicina` sólo para ese orden — su
 * `allAccess` le abre los dos tramos igual.
 */
export function trackDelUsuario(
  plan: Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>,
): Track | null {
  if (plan.allAccess) return 'medicina';
  if (plan.plan === 'free' || !plan.isActive) return null;
  return PLANS[plan.plan].track;
}
