// Paleta de sustancias del nefrón. Son objetos físicos (iones / moléculas), por lo
// que el color es el MISMO en modo claro y oscuro (igual criterio que el fluido del
// minijuego Sangre vs Orina). Se usa en la leyenda, en las flechas y en las
// partículas-ion de la vista celular.

import type { SubstanceId } from '@/app/dashboard/laboratorio/nefron-interactivo/engine/types';

export interface Substance {
  id: SubstanceId;
  label: string;
  color: string;
}

export const SUBSTANCES: Record<SubstanceId, Substance> = {
  agua: { id: 'agua', label: 'Agua', color: '#38bdf8' },
  na: { id: 'na', label: 'Na⁺', color: '#f59e0b' },
  k: { id: 'k', label: 'K⁺', color: '#a855f7' },
  cl: { id: 'cl', label: 'Cl⁻', color: '#22c55e' },
  hco3: { id: 'hco3', label: 'HCO₃⁻', color: '#3b82f6' },
  h: { id: 'h', label: 'H⁺', color: '#ef4444' },
  ca: { id: 'ca', label: 'Ca²⁺', color: '#ec4899' },
  mg: { id: 'mg', label: 'Mg²⁺', color: '#14b8a6' },
  urea: { id: 'urea', label: 'Urea', color: '#94a3b8' },
  glucosa: { id: 'glucosa', label: 'Glucosa', color: '#eab308' },
  fosfato: { id: 'fosfato', label: 'Fosfato', color: '#8b5cf6' },
  aa: { id: 'aa', label: 'Aminoácidos', color: '#f97316' },
};

/** Sustancias mostradas en la leyenda del modo simple. */
export const LEGEND_SUBSTANCES: SubstanceId[] = [
  'agua', 'na', 'k', 'cl', 'hco3', 'h', 'ca', 'mg', 'urea',
];

export function substanceColor(id: SubstanceId): string {
  return SUBSTANCES[id].color;
}

export function substanceLabel(id: SubstanceId): string {
  return SUBSTANCES[id].label;
}
