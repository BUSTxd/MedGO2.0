import type { Colaborador } from '@/lib/data/aportes';

/**
 * Marcas de autoría: quién subió cada material.
 *
 * El panel deduce de los sílabos QUÉ material existe, pero no puede saber QUIÉN
 * lo aportó — eso no está en ningún archivo del repo. Cada persona lo declara
 * pintando el círculo del material que subió, y esas marcas viven en la tabla
 * `aportes_marcas` de Supabase para que las vea todo el equipo.
 *
 * Un mismo material admite varias marcas: cuando dos personas lo armaron a
 * medias, el crédito se divide entre ellas en `getAportes()`.
 */

export type AmbitoMarca = 'curso' | 'laboratorio' | 'histologia';

/**
 * Qué se marca. En cursos coincide con los slots de `material-plan` (cada
 * actividad tiene los suyos); en laboratorios e histología no hay tarjetas que
 * distinguir —el lab o el atlas es una pieza entera—, así que va `material`.
 */
export type SlotMarca = 'resumen' | 'banqueo' | 'apoyo' | 'material';

export interface Marca {
  ambito: AmbitoMarca;
  /** Slug del curso, del atlas de histología, o `labs` en los laboratorios. */
  scopeId: string;
  /** Id de la actividad del sílabo, o slug del lab / de la clase de histología. */
  itemId: string;
  slot: SlotMarca;
  colaborador: Colaborador;
}

/** Identidad de un material marcable. Es también la clave única en la tabla. */
export function claveMarca(
  m: Pick<Marca, 'ambito' | 'scopeId' | 'itemId' | 'slot'>,
): string {
  return `${m.ambito}:${m.scopeId}:${m.itemId}:${m.slot}`;
}

/** Clave del material → personas que lo reclaman, para leerlo en O(1) al pintar. */
export type MarcasIndex = Record<string, Colaborador[]>;

export function indexarMarcas(marcas: readonly Marca[]): MarcasIndex {
  const idx: MarcasIndex = {};
  for (const m of marcas) {
    const clave = claveMarca(m);
    (idx[clave] ??= []).push(m.colaborador);
  }
  return idx;
}
