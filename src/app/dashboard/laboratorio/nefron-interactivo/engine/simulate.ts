// Motor educativo de consecuencias. NO es un modelo numérico/ODE: resuelve por
// lookup la consecuencia curada de la perturbación activa (en el MVP, desactivar
// un transportador). Deja la puerta abierta a combinar varias perturbaciones
// (fármacos / enfermedades) en fases siguientes.

import type { Consequence, IonMove, Membrane } from './types';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';

export interface SimState {
  /** ids de transportadores desactivados por el usuario. */
  disabled: Set<string>;
}

/**
 * Devuelve la consecuencia a mostrar. En el MVP se prioriza el último (único)
 * transportador desactivado. Si no hay ninguno, devuelve null.
 */
export function computeConsequence(state: SimState): { transporterId: string; consequence: Consequence } | null {
  // El estado nominal es "todo activo": sin perturbación no hay consecuencia.
  const ids = [...state.disabled];
  if (ids.length === 0) return null;
  // MVP: una sola perturbación a la vez (el panel fuerza exclusividad).
  const id = ids[ids.length - 1];
  const t = TRANSPORTERS[id];
  if (!t) return null;
  return { transporterId: id, consequence: t.consecuenciaDesactivar };
}

export type FlowDir = 'right' | 'left';

/**
 * Dirección visual de una partícula-ion en la vista celular.
 * Convención de columnas: Lumen (izq) · Célula (centro) · Sangre (der).
 * - apical + entra (reabsorbe)      → derecha (lumen → célula)
 * - apical + sale (secreta)         → izquierda (célula → lumen)
 * - basolateral + entra (desde sangre) → izquierda (sangre → célula)
 * - basolateral + sale (a sangre)   → derecha (célula → sangre)
 * - paracelular + entra (reabsorbe) → derecha (lumen → sangre)
 */
export function flowDirection(membrana: Membrane, move: IonMove): FlowDir {
  if (membrana === 'apical') return move.dir === 'entra' ? 'right' : 'left';
  if (membrana === 'basolateral') return move.dir === 'entra' ? 'left' : 'right';
  return 'right'; // paracelular: siempre lumen → sangre
}

export const ACID_BASE_LABEL: Record<string, string> = {
  'acidosis-metabolica': 'Acidosis metabólica',
  'alcalosis-metabolica': 'Alcalosis metabólica',
  'sin-cambio': 'Sin cambio significativo',
};
