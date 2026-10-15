// Registro del laboratorio «Vías NF-κB y JAK/STAT»: las tres vías en el orden
// de la figura, el panorama y la compilación memoizada de cada escenario.

import clasica from '@/lib/data/vias-nfkb/clasica';
import alternativa from '@/lib/data/vias-nfkb/alternativa';
import jakstat from '@/lib/data/vias-nfkb/jakstat';
import { ESTUDIO, INTRO } from '@/lib/data/vias-nfkb/panorama';
import type { Escenario, Via, ViaId } from '@/lib/data/vias-nfkb/tipos';
import { compilar, type EscenarioCompilado } from './motor';

export const VIAS: Via[] = [clasica, alternativa, jakstat];
export const VIA_POR_ID = Object.fromEntries(VIAS.map((v) => [v.id, v])) as Record<ViaId, Via>;
export { INTRO, ESTUDIO };

const compilados = new Map<string, EscenarioCompilado>();

export function compilado(esc: Escenario): EscenarioCompilado {
  let c = compilados.get(esc.id);
  if (!c) { c = compilar(esc); compilados.set(esc.id, c); }
  return c;
}

export function siguienteVia(id: ViaId): Via | null {
  const i = VIAS.findIndex((v) => v.id === id);
  return VIAS[i + 1] ?? null;
}
