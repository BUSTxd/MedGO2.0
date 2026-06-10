// Motor educativo de consecuencias. NO es un modelo numérico/ODE: resuelve por
// lookup la consecuencia curada de la perturbación activa (desactivar un
// transportador, aplicar un fármaco o activar una enfermedad). En el MVP hay una
// sola perturbación a la vez (exclusiva).

import type { AffectKind, Consequence, IonMove, Membrane, Perturbation, SegmentId } from './types';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { DRUGS } from '@/lib/data/nefron/drugs';
import { DISEASES } from '@/lib/data/nefron/diseases';

/** Resultado resuelto de una perturbación, listo para pintar paneles y resaltados. */
export interface Resolved {
  /** Título del panel de consecuencias, p. ej. "Fármaco: Furosemida". */
  titulo: string;
  consequence: Consequence;
  /** Transportadores diana a resaltar en la vista celular. */
  affected: Set<string>;
  /** Etiqueta del resaltado ("Bloqueado", "Inhibido", "Hiperactivo"…). */
  tag: string;
  /** Segmento donde actúa (para navegar/resaltar en el mapa). */
  segmentoId?: SegmentId;
}

const TAG_BY_EFFECT: Record<AffectKind, string> = {
  bloqueo: 'Bloqueado',
  inhibicion: 'Inhibido',
  perdida: 'Afectado',
  ganancia: 'Hiperactivo',
  osmotico: 'Osmótico',
};

/**
 * Resuelve la perturbación activa. Devuelve null en estado basal (sin perturbación).
 */
export function resolvePerturbation(pert: Perturbation | null): Resolved | null {
  if (!pert) return null;

  if (pert.kind === 'transportador') {
    const t = TRANSPORTERS[pert.id];
    if (!t) return null;
    return {
      titulo: `Bloqueo: ${t.sigla}`,
      consequence: t.consecuenciaDesactivar,
      affected: new Set([t.id]),
      tag: TAG_BY_EFFECT.bloqueo,
      segmentoId: t.segmentoId,
    };
  }

  if (pert.kind === 'farmaco') {
    const d = DRUGS[pert.id];
    if (!d) return null;
    return {
      titulo: `Fármaco: ${d.nombre}`,
      consequence: d.consecuencia,
      affected: new Set(d.objetivos),
      tag: TAG_BY_EFFECT[d.efecto],
      segmentoId: d.segmentoId,
    };
  }

  // enfermedad
  const e = DISEASES[pert.id];
  if (!e) return null;
  return {
    titulo: `Enfermedad: ${e.nombre}`,
    consequence: e.consecuencia,
    affected: new Set(e.objetivos),
    tag: TAG_BY_EFFECT[e.efecto],
    segmentoId: e.segmentoId,
  };
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
