// Textos de la práctica que comparten la tarjeta y el panel: el nombre de lo
// que se toca (relieve, par craneal o núcleo), la respuesta en palabras y la
// pista, que orienta con los datos de la ficha sin dar el nombre.

import { ESTRUCTURAS, GRUPOS, estructuraDe } from '../engine/anatomia';
import { NERVIO } from '../engine/nervios';
import { INTERIOR, type ParId } from '../engine/interior';
import type { PreguntaTP } from '@/lib/tronco-practica/tipos';

export const LETRAS = ['A', 'B', 'C', 'D'];

export function nombre(id: string): string {
  if (id in NERVIO) return `${id} · ${NERVIO[id as ParId].nombre}`;
  if (INTERIOR[id]) return INTERIOR[id].nombre;
  return estructuraDe(id)?.nombre ?? ESTRUCTURAS[id]?.nombre ?? id;
}

export function textoRespuesta(p: PreguntaTP): string {
  return p.forma === 'senalar'
    ? p.objetivo.map(nombre).join(' o ')
    : `${LETRAS[p.correcta]}. ${p.opciones[p.correcta]}`;
}

/** Qué hay que tocar en una pregunta de señalar, según la vista. */
export function queTocar(p: PreguntaTP): string {
  if (p.vista === 'nervios') return 'Toca el nervio en el modelo (sirve cualquiera de los dos lados)';
  if (p.vista === 'superficie') return 'Toca el relieve en el modelo (sirve cualquiera de los dos lados)';
  if (p.vista === 'corte') return 'Toca la estructura en el corte (sirve cualquiera de los dos lados)';
  return 'Toca el núcleo o la vía dentro del tronco (sirve cualquiera de los dos lados)';
}

/**
 * Pista: en las de señalar, dónde buscar (cara y región del relieve, por
 * dónde sale el nervio o a qué nivel está el núcleo); en las de alternativas
 * se tacha una incorrecta (la elige el hook).
 */
export function pistaDe(p: PreguntaTP): string {
  if (p.forma === 'opciones') return 'Tachamos una alternativa incorrecta.';
  const id = p.objetivo[0];
  if (id in NERVIO) return `Sale por aquí: ${NERVIO[id as ParId].emerge}`;
  if (INTERIOR[id]) return `Búscalo aquí: ${INTERIOR[id].nivel}`;
  const e = estructuraDe(id);
  if (!e) return 'Gira el modelo y busca en la cara indicada.';
  const DONDE: Record<string, string> = {
    diencefalo: 'el diencéfalo cortado',
    mesencefalo: 'el mesencéfalo',
    puente: 'la protuberancia',
    ventriculo: 'el suelo del IV ventrículo',
    bulbo: 'el bulbo',
    cerebelo: 'el cerebelo',
  };
  return `Está en la cara ${e.cara}, en ${DONDE[e.grupo] ?? GRUPOS.find((x) => x.id === e.grupo)?.nombre}.`;
}
