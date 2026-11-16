// Motor educativo de consecuencias. NO es un modelo numérico/ODE: resuelve por
// lookup la consecuencia curada de la perturbación activa (desactivar un
// transportador, aplicar un fármaco o activar una enfermedad). En el MVP hay una
// sola perturbación a la vez (exclusiva).

import type { AffectKind, Consequence, IonMove, Mechanism, Membrane, Perturbation, SegmentId, TransporterDef } from './types';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { DRUGS } from '@/lib/data/nefron/drugs';
import { DISEASES } from '@/lib/data/nefron/diseases';
import { resolvePh, PH_BASELINE, type PhPair } from './phModel';

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
  /** Sentido del pH en luz y sangre tras la perturbación. */
  ph: PhPair;
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
      ph: resolvePh(t.id, t.consecuenciaDesactivar.acidoBase),
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
      ph: resolvePh(d.id, d.consecuencia.acidoBase),
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
    ph: resolvePh(e.id, e.consecuencia.acidoBase),
  };
}

export { PH_BASELINE };
export type { PhPair };

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

/** Eje vertical de la vista de célula: la LUZ está arriba y la SANGRE abajo. */
export type VFlow = 'up' | 'down';

/**
 * Dirección VERTICAL de un ion en la vista de pared (luz arriba, sangre abajo,
 * membrana apical arriba, basolateral abajo):
 * - apical + entra (lumen → célula)        → down
 * - apical + sale (célula → lumen)          → up
 * - basolateral + entra (sangre → célula)   → up
 * - basolateral + sale (célula → sangre)    → down
 * - paracelular + entra (lumen → sangre)    → down
 */
export function flowDirectionV(membrana: Membrane, move: IonMove): VFlow {
  if (membrana === 'apical') return move.dir === 'entra' ? 'down' : 'up';
  if (membrana === 'basolateral') return move.dir === 'entra' ? 'up' : 'down';
  return 'down'; // paracelular: siempre lumen → sangre
}

/**
 * Mecanismo de transporte para elegir la FORMA del glifo. Usa el campo explícito
 * `mecanismo` si existe; si no, lo deriva: receptor → receptor; ATPasa → bomba;
 * ≥2 iones en el mismo sentido → simporte; ≥2 en sentidos opuestos → antiporte;
 * 1 ion → canal.
 */
export function transporterMechanism(t: TransporterDef): Mechanism {
  if (t.mecanismo) return t.mecanismo;
  if (t.receptor) return 'receptor';
  if (t.usaAtp) return 'bomba';
  const ions = t.mueve;
  if (ions.length >= 2) {
    const allSame = ions.every((m) => m.dir === ions[0].dir);
    return allSame ? 'simporte' : 'antiporte';
  }
  return 'canal';
}

export const MECHANISM_LABEL: Record<Mechanism, string> = {
  bomba: 'Bomba (ATP)',
  canal: 'Canal / poro',
  simporte: 'Simporte (cotransporte)',
  antiporte: 'Antiporte (intercambio)',
  facilitado: 'Difusión facilitada',
  receptor: 'Receptor',
};

export const MECHANISM_ORDER: Mechanism[] = [
  'bomba', 'canal', 'simporte', 'antiporte', 'facilitado', 'receptor',
];

export const ACID_BASE_LABEL: Record<string, string> = {
  'acidosis-metabolica': 'Acidosis metabólica',
  'alcalosis-metabolica': 'Alcalosis metabólica',
  'sin-cambio': 'Sin cambio significativo',
};
