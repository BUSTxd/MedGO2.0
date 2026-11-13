// Textos de la práctica que comparten la tarjeta y el panel: nombre de cada
// estructura, la respuesta en palabras y la pista (orienta sin dar el nombre).

import { LAMINA_GROUPS, TRACTS, type LaminaGroupId, type TractId } from '../engine/anatomy';
import type { PreguntaMP } from '@/lib/medula-practica/tipos';

export const LETRAS = ['A', 'B', 'C', 'D'];

export function nombre(id: string): string {
  if (id in LAMINA_GROUPS) return LAMINA_GROUPS[id as LaminaGroupId].name;
  if (id in TRACTS) return TRACTS[id as TractId].name;
  return id;
}

export function textoRespuesta(p: PreguntaMP): string {
  return p.forma === 'senalar'
    ? p.objetivo.ids.map(nombre).join(' o ')
    : `${LETRAS[p.correcta]}. ${p.opciones[p.correcta]}`;
}

/** Dónde está cada tracto, a grandes rasgos (cordón), sin nombrarlo. */
const ZONA_TRACTO: Record<TractId, string> = {
  gracil: 'Está en el cordón posterior, entre las dos astas posteriores.',
  cuneiforme: 'Está en el cordón posterior, entre las dos astas posteriores.',
  'espinotalamico-lat': 'Está en el cordón lateral, en su mitad anterior.',
  'espinotalamico-ant': 'Está en el cordón anterior.',
  'espinocerebeloso-post': 'Está en el cordón lateral, junto a la superficie.',
  'espinocerebeloso-ant': 'Está en el cordón lateral, junto a la superficie.',
  espinoolivar: 'Está en el cordón anterior, cerca de la superficie.',
  'corticoespinal-lat': 'Está en el cordón lateral, en su mitad posterior.',
  'corticoespinal-ant': 'Está en el cordón anterior.',
  rubroespinal: 'Está en el cordón lateral.',
  reticuloespinal: 'Está en el cordón anterolateral, junto al asta anterior.',
  vestibuloespinal: 'Está en el cordón anterior.',
  olivoespinal: 'Está en el cordón anterior, cerca de la superficie.',
};

/** Dónde está cada grupo de láminas, a grandes rasgos (asta), sin nombrarlo. */
const ZONA_LAMINA: Record<LaminaGroupId, string> = {
  'I-II': 'Está en el asta posterior.',
  'III-IV': 'Está en el asta posterior.',
  'V-VI': 'Está en el asta posterior.',
  VII: 'Está en la zona intermedia, entre el asta posterior y la anterior.',
  VIII: 'Está en el asta anterior.',
  IX: 'Está en el asta anterior.',
  X: 'Está en el centro, alrededor del canal central.',
};

/**
 * Pista de una pregunta. En las de señalar orienta por zonas; en las de
 * alternativas se tacha una incorrecta (la elige el hook).
 */
export function pistaDe(p: PreguntaMP): string {
  if (p.forma === 'opciones') return 'Tachamos una alternativa incorrecta.';
  const id = p.objetivo.ids[0];
  return p.objetivo.kind === 'tract'
    ? ZONA_TRACTO[id as TractId]
    : ZONA_LAMINA[id as LaminaGroupId];
}
