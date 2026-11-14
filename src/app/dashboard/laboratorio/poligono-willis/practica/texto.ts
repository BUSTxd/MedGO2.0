// Textos de la práctica que comparten la tarjeta y el panel: nombre de cada
// arteria, la respuesta en palabras y la pista (orienta sin dar el nombre).

import { ARTERIAS, type ArteriaId } from '../engine/anatomia';
import type { PreguntaWP } from '@/lib/willis-practica/tipos';

export const LETRAS = ['A', 'B', 'C', 'D'];

export function nombre(id: ArteriaId): string {
  return ARTERIAS[id]?.nombre ?? id;
}

export function textoRespuesta(p: PreguntaWP): string {
  return p.forma === 'senalar'
    ? p.objetivo.map(nombre).join(' o ')
    : `${LETRAS[p.correcta]}. ${p.opciones[p.correcta]}`;
}

/** Dónde está cada arteria en el modelo, a grandes rasgos, sin nombrarla. */
const ZONA: Record<ArteriaId, string> = {
  carotida_comun: 'Está en el cuello, abajo: es el tronco más grueso, antes de dividirse.',
  ica: 'Es el tronco grueso que sube a cada lado del quiasma y se divide en dos.',
  oftalmica: 'Sale hacia delante, por debajo del nervio óptico, rumbo a la órbita.',
  pcom: 'Es uno de los lados del anillo: une la carótida con la cerebral posterior.',
  coroidea_ant: 'Es un vaso fino que sale de la carótida hacia atrás, junto a la cintilla óptica.',
  a1: 'Es uno de los lados del anillo, por delante: va de la carótida a la línea media.',
  acom: 'Es el puente corto de la línea media, en la punta delantera del anillo.',
  a2: 'Sube por la línea media, hacia la cisura entre los dos hemisferios.',
  heubner: 'Es un vaso fino que vuelve hacia atrás por encima del tramo anterior del anillo.',
  anteromediales: 'Son ramitas muy finas que suben desde la punta delantera del anillo.',
  m1: 'Es el tronco grueso que sale hacia fuera, hacia la cisura de Silvio.',
  m2: 'Son las ramas que se abren al final del tronco lateral, sobre la ínsula.',
  lenticuloestriadas: 'Son ramitas finas que suben desde el tronco que va hacia fuera.',
  p1: 'Es el tramo corto del anillo que sale de la punta de la basilar.',
  p2: 'Rodea el mesencéfalo y se va hacia atrás, al lóbulo occipital.',
  talamoperforantes: 'Son ramitas finas que suben desde la punta de la basilar.',
  basilar: 'Es el tronco único de la línea media, sobre la protuberancia.',
  pontinas: 'Son ramas cortas que salen a los lados del tronco de la línea media.',
  sca: 'Sale de lo más alto del tronco de la línea media y rodea el mesencéfalo.',
  aica: 'Sale del tercio inferior del tronco de la línea media, hacia el ángulo pontocerebeloso.',
  laberintica: 'Es una rama muy fina que va hacia el oído interno.',
  vertebral: 'Es uno de los dos troncos que se unen en la línea media, junto al bulbo.',
  pica: 'Sale de un tronco junto al bulbo, lo rodea y hace un asa hacia el cerebelo.',
  espinal_ant: 'Baja por la línea media, por delante del bulbo y de la médula.',
};

/**
 * Pista de una pregunta. En las de señalar orienta por zonas; en las de
 * alternativas se tacha una incorrecta (la elige el hook).
 */
export function pistaDe(p: PreguntaWP): string {
  if (p.forma === 'opciones') return 'Tachamos una alternativa incorrecta.';
  return ZONA[p.objetivo[0]];
}
