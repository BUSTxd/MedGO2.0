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

/**
 * Cómo llegó ese banqueo, según lo declara quien lo subió.
 *
 * - `armado` — lo hizo: transcribió el banco de preguntas, resolvió el
 *   solucionario, elaboró los ejercicios propuestos.
 * - `recolectado` — lo consiguió: la PC o el examen de otro año en PDF, subido
 *   tal cual. Cuenta como material publicado, pero no es lo mismo producirlo.
 *
 * Sólo aplica al slot `banqueo`: un resumen o un laboratorio siempre se
 * produce. El código no puede deducirlo de ningún archivo —el mismo PDF puede
 * ser trabajo propio o una descarga—, por eso lo dice la persona al marcar.
 */
export type OrigenMarca = 'armado' | 'recolectado';

export interface Marca {
  ambito: AmbitoMarca;
  /** Slug del curso, del atlas de histología, o `labs` en los laboratorios. */
  scopeId: string;
  /** Id de la actividad del sílabo, o slug del lab / de la clase de histología. */
  itemId: string;
  slot: SlotMarca;
  colaborador: Colaborador;
  /** Sólo en `banqueo`; sin declarar se trata como `armado`. */
  origen?: OrigenMarca;
}

/** Identidad de un material marcable. Es también la clave única en la tabla. */
export function claveMarca(
  m: Pick<Marca, 'ambito' | 'scopeId' | 'itemId' | 'slot'>,
): string {
  return `${m.ambito}:${m.scopeId}:${m.itemId}:${m.slot}`;
}

/** Una persona reclamando un material, con el tipo de aporte que declaró. */
export interface Firma {
  colaborador: Colaborador;
  origen?: OrigenMarca;
}

/** Clave del material → quién lo reclama, para leerlo en O(1) al pintar. */
export type MarcasIndex = Record<string, Firma[]>;

export function indexarMarcas(marcas: readonly Marca[]): MarcasIndex {
  const idx: MarcasIndex = {};
  for (const m of marcas) {
    const clave = claveMarca(m);
    (idx[clave] ??= []).push({ colaborador: m.colaborador, origen: m.origen });
  }
  return idx;
}

/** Sólo los nombres, para cuando el tipo de aporte da igual (pintar el círculo). */
export function firmantesDe(idx: MarcasIndex, clave: string): Colaborador[] {
  return (idx[clave] ?? []).map((f) => f.colaborador);
}
