import { createAdminClient } from '@/lib/supabase/admin';
import { COLABORADORES, type Colaborador } from '@/lib/data/aportes';
import type { AmbitoMarca, Marca, OrigenMarca, SlotMarca } from '@/lib/aportes-marcas';

/**
 * Lectura y escritura de `aportes_marcas`.
 *
 * La tabla tiene RLS activo y ninguna política: el navegador nunca la toca
 * directamente. Todo pasa por aquí con la service role key, y quién puede
 * marcar qué se decide en `/api/aportes/marcas` (y en la página del panel),
 * donde sí se conoce la sesión.
 */

interface FilaMarca {
  ambito: string;
  scope_id: string;
  item_id: string;
  slot: string;
  colaborador: string;
  /** NULL en todo lo que no es banqueo, y en las marcas anteriores a la columna. */
  origen: string | null;
}

interface ErrorSupabase {
  message: string;
}

/**
 * El cliente admin no lleva los tipos generados de la base, así que la tabla se
 * describe aquí con la forma mínima que se usa — mismo apaño que en
 * `api/track/route.ts`.
 */
function tabla() {
  return createAdminClient().from('aportes_marcas') as unknown as {
    select: (cols: string) => Promise<{ data: FilaMarca[] | null; error: ErrorSupabase | null }>;
    upsert: (
      row: Record<string, unknown>,
      opts?: { onConflict?: string; ignoreDuplicates?: boolean },
    ) => Promise<{ error: ErrorSupabase | null }>;
    delete: () => {
      match: (filtros: Record<string, string>) => Promise<{ error: ErrorSupabase | null }>;
    };
  };
}

const AMBITOS = new Set<string>(['curso', 'laboratorio', 'histologia']);
const SLOTS = new Set<string>(['resumen', 'banqueo', 'apoyo', 'material']);

/** Descarta filas de personas o ámbitos que ya no existen en el código. */
function aMarca(fila: FilaMarca): Marca | null {
  if (!AMBITOS.has(fila.ambito)) return null;
  if (!SLOTS.has(fila.slot)) return null;
  if (!(fila.colaborador in COLABORADORES)) return null;
  return {
    ambito: fila.ambito as AmbitoMarca,
    scopeId: fila.scope_id,
    itemId: fila.item_id,
    slot: fila.slot as SlotMarca,
    colaborador: fila.colaborador as Colaborador,
    origen: fila.origen === 'recolectado' ? 'recolectado' : undefined,
  };
}

export async function leerMarcas(): Promise<Marca[]> {
  const { data, error } = await tabla().select(
    'ambito, scope_id, item_id, slot, colaborador, origen',
  );
  if (error || !data) return [];
  return data.map(aMarca).filter((m): m is Marca => m !== null);
}

export async function agregarMarca(marca: Marca, usuarioId: string): Promise<void> {
  // `ignoreDuplicates` haría que cambiar de tipo no surtiera efecto: una marca
  // que ya existe se ignoraría en vez de actualizar su `origen`. Por eso se
  // sobrescribe la fila entera.
  const origen: OrigenMarca | null = marca.slot === 'banqueo' ? (marca.origen ?? 'armado') : null;
  const { error } = await tabla().upsert(
    {
      ambito: marca.ambito,
      scope_id: marca.scopeId,
      item_id: marca.itemId,
      slot: marca.slot,
      colaborador: marca.colaborador,
      origen,
      marcado_por: usuarioId,
    },
    { onConflict: 'ambito,scope_id,item_id,slot,colaborador' },
  );
  if (error) throw new Error(error.message);
}

export async function quitarMarca(marca: Marca): Promise<void> {
  const { error } = await tabla().delete().match({
    ambito: marca.ambito,
    scope_id: marca.scopeId,
    item_id: marca.itemId,
    slot: marca.slot,
    colaborador: marca.colaborador,
  });
  if (error) throw new Error(error.message);
}
