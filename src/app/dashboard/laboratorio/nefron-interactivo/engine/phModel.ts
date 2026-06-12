// Modelo educativo de pH para la vista de célula: dado el id de la perturbación
// (transportador, fármaco o enfermedad) y su consecuencia ácido-base, resuelve el
// sentido del pH en la LUZ tubular y en la SANGRE. No es un modelo numérico: la
// sangre se deriva del campo `acidoBase` ya curado; la luz solo se anota a mano en
// PH_HINTS para los procesos donde es pedagógicamente relevante.

import type { AcidBase, PhDir } from './types';

export interface PhPair {
  lumen: PhDir;
  sangre: PhDir;
}

export const PH_BASELINE: PhPair = { lumen: 'neutro', sangre: 'neutro' };

/**
 * Sentido de la LUZ (y, opcionalmente, override de la sangre) para los ids cuyo
 * efecto sobre el pH luminal es claro. Solo procesos ácido-base; el resto deja la
 * luz en neutro y la sangre derivada de `acidoBase`.
 *
 * Convención: el pH indicado es el del compartimento TRAS bloquear/aplicar la
 * perturbación. P. ej. bloquear la H⁺-ATPasa → deja de secretarse H⁺ a la luz →
 * la orina se vuelve menos ácida = MÁS BÁSICA; y la sangre retiene H⁺ = más ácida.
 */
const PH_HINTS: Record<string, Partial<PhPair>> = {
  // Túbulo proximal (recuperación de HCO₃⁻ / secreción de H⁺)
  nhe3: { lumen: 'basico', sangre: 'acido' },
  nbce1: { lumen: 'basico', sangre: 'acido' },
  // Célula intercalada α (acidificación distal)
  'h-atpasa': { lumen: 'basico', sangre: 'acido' },
  'hk-atpasa': { lumen: 'basico', sangre: 'acido' },
  ae1: { lumen: 'basico', sangre: 'acido' },
  // Célula intercalada β (eliminación de base)
  pendrina: { lumen: 'acido', sangre: 'basico' },
  'hatpasa-baso': { sangre: 'basico' },

  // Fármacos
  acetazolamida: { lumen: 'basico', sangre: 'acido' },
  espironolactona: { lumen: 'basico', sangre: 'acido' },
  amilorida: { lumen: 'basico', sangre: 'acido' },

  // Enfermedades (acidosis tubular renal / Fanconi)
  'atr-1': { lumen: 'basico', sangre: 'acido' },
  'atr-2': { lumen: 'basico', sangre: 'acido' },
  'atr-4': { sangre: 'acido' },
  fanconi: { lumen: 'basico', sangre: 'acido' },
};

/** Sentido de la sangre derivado solo de la consecuencia ácido-base curada. */
function sangreFromAcidBase(ab: AcidBase): PhDir {
  if (ab === 'acidosis-metabolica') return 'acido';
  if (ab === 'alcalosis-metabolica') return 'basico';
  return 'neutro';
}

/**
 * Resuelve el pH de luz y sangre para una perturbación. La sangre usa el hint si
 * existe; si no, se deriva de `acidoBase`. La luz solo desde el hint (neutro si no).
 */
export function resolvePh(id: string, ab: AcidBase): PhPair {
  const hint = PH_HINTS[id];
  return {
    lumen: hint?.lumen ?? 'neutro',
    sangre: hint?.sangre ?? sangreFromAcidBase(ab),
  };
}

export function phLabel(dir: PhDir): string {
  if (dir === 'acido') return 'más ácido';
  if (dir === 'basico') return 'más básico';
  return 'neutro';
}
