// Lo que viaja por el nefrón. Cada sustancia tiene un color fijo: es el de su
// burbuja en las animaciones y el del punto en la barra lateral.

import type { Sustancia, SustanciaId } from './tipos.ts';

export const SUSTANCIAS: Record<SustanciaId, Sustancia> = {
  agua: { id: 'agua', nombre: 'Agua', simbolo: 'H₂O', color: '#5ec8f2', textoOscuro: true },
  na: { id: 'na', nombre: 'Sodio', simbolo: 'Na⁺', color: '#f2b631', textoOscuro: true },
  k: { id: 'k', nombre: 'Potasio', simbolo: 'K⁺', color: '#8b5cf6' },
  cl: { id: 'cl', nombre: 'Cloruro', simbolo: 'Cl⁻', color: '#22a06b' },
  hco3: { id: 'hco3', nombre: 'Bicarbonato', simbolo: 'HCO₃⁻', color: '#2f80d1' },
  h: { id: 'h', nombre: 'Hidrogenión', simbolo: 'H⁺', color: '#e5484d' },
  co2: { id: 'co2', nombre: 'Dióxido de carbono', simbolo: 'CO₂', color: '#8592a6' },
  glucosa: { id: 'glucosa', nombre: 'Glucosa', simbolo: 'Glu', color: '#f97316' },
  aa: { id: 'aa', nombre: 'Aminoácidos', simbolo: 'AA', color: '#d16ba5' },
  fosfato: { id: 'fosfato', nombre: 'Fosfato', simbolo: 'HPO₄²⁻', color: '#a3794f' },
  ca: { id: 'ca', nombre: 'Calcio', simbolo: 'Ca²⁺', color: '#14b8a6' },
  mg: { id: 'mg', nombre: 'Magnesio', simbolo: 'Mg²⁺', color: '#7fae1f' },
  urea: { id: 'urea', nombre: 'Urea', simbolo: 'Urea', color: '#b08968' },
  nh3: { id: 'nh3', nombre: 'Amoníaco', simbolo: 'NH₃', color: '#c2410c' },
  nh4: { id: 'nh4', nombre: 'Amonio', simbolo: 'NH₄⁺', color: '#9a3412' },
  aniones: { id: 'aniones', nombre: 'Aniones orgánicos', simbolo: 'OA⁻', color: '#be185d' },
  cationes: { id: 'cationes', nombre: 'Cationes orgánicos', simbolo: 'OC⁺', color: '#4d7c0f' },
  albumina: { id: 'albumina', nombre: 'Albúmina', simbolo: 'Alb', color: '#e3b505', textoOscuro: true },
};

/** Las que corren por el túbulo en la vista del nefrón (el «chorro»). */
export const SUSTANCIAS_FLUJO: SustanciaId[] = [
  'agua', 'na', 'k', 'hco3', 'glucosa', 'aa', 'fosfato', 'ca', 'mg', 'urea',
];
