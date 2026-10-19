// Colores del laboratorio «Hipersensibilidad». Cada tipo tiene el suyo (el del
// dibujo de Robbins que lo representa: el turquesa del mastocito, el naranja de
// la IgG, el azul marino del inmunocomplejo, el rosa del linfocito T) y se
// repite en capítulos, tabla y anticuerpos. Fondo blanco, como maduración.

import type { Isotipo, Particula } from './tipos';

export const H = {
  tipo1: '#1F9AAE',
  tipo2: '#E0892E',
  tipo3: '#3B4DB8',
  tipo4: '#D24E80',
  integracion: '#5B6475',
  // Anticuerpos
  ige: '#2CA9BC',
  igg: '#E0892E',
  igm: '#8A4FCF',
  complejo: '#2C3E9E',
  antigeno: '#4CB848',
  // Células
  mastocito: '#2CA9BC',
  eosinofilo: '#E5484D',
  basofilo: '#5B4CB0',
  neutrofilo: '#B67AC7',
  macrofago: '#E8A06A',
  th2: '#D9567E',
  th1: '#C2410C',
  th17: '#8A4FCF',
  b: '#5E9CD3',
  plasma: '#6E8FD6',
  epitelio: '#4FA7B8',
  eritrocito: '#D9574F',
  plaqueta: '#D9A72E',
  complemento: '#C0397A',
  treg: '#1F9A6A',
  proteina: '#5B6475',
} as const;

export const COLOR_AB: Record<Isotipo, string> = { IgE: H.ige, IgG: H.igg, IgM: H.igm };

/** Forma y color de cada partícula de un chorro. */
export const PARTICULA: Record<Particula, { color: string; forma: 'punto' | 'triangulo' | 'rombo' | 'y' | 'chispa' | 'gota' }> = {
  histamina: { color: '#2C8FD6', forma: 'punto' },
  lipido: { color: '#E0702A', forma: 'rombo' },
  citocina: { color: '#1F9A6A', forma: 'triangulo' },
  quimiocina: { color: '#2CA9BC', forma: 'triangulo' },
  alarmina: { color: '#E5484D', forma: 'chispa' },
  il4: { color: '#D9567E', forma: 'triangulo' },
  il5: { color: '#E5484D', forma: 'triangulo' },
  il13: { color: '#B4507E', forma: 'triangulo' },
  ifn: { color: '#C2410C', forma: 'triangulo' },
  il17: { color: '#8A4FCF', forma: 'triangulo' },
  ige: { color: H.ige, forma: 'y' },
  igg: { color: H.igg, forma: 'y' },
  complemento: { color: H.complemento, forma: 'triangulo' },
  ros: { color: '#E8B21E', forma: 'chispa' },
  enzima: { color: '#8C624E', forma: 'punto' },
  mbp: { color: '#E5484D', forma: 'punto' },
  ach: { color: '#2C9BD6', forma: 'rombo' },
  hormona: { color: '#D9881E', forma: 'punto' },
  perforina: { color: '#C0397A', forma: 'rombo' },
  plasma: { color: '#8FC3E8', forma: 'gota' },
  hemoglobina: { color: '#C0392B', forma: 'punto' },
};
