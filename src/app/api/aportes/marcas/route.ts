import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canVerAportes, isAdminEmail } from '@/lib/admin';
import { COLABORADORES, colaboradorDeEmail, type Colaborador } from '@/lib/data/aportes';
import type { AmbitoMarca, Marca, OrigenMarca, SlotMarca } from '@/lib/aportes-marcas';
import { agregarMarca, leerMarcas, quitarMarca } from '@/lib/aportes-marcas-server';

/**
 * Marcas de autoría del panel de aportes.
 *
 * Regla de permisos: cada persona marca y desmarca lo suyo, y el admin puede
 * corregir cualquier marca —es también el único que puede marcar por alguien
 * que todavía no tiene cuenta en la web.
 */

export const dynamic = 'force-dynamic';

const AMBITOS: readonly AmbitoMarca[] = ['curso', 'laboratorio', 'histologia'];
const SLOTS: readonly SlotMarca[] = ['resumen', 'banqueo', 'apoyo', 'material'];
const ORIGENES: readonly OrigenMarca[] = ['armado', 'recolectado'];

interface Sesion {
  usuarioId: string;
  /** Persona del registro que corresponde a la sesión, si tiene correo asociado. */
  yo: Colaborador | null;
  esAdmin: boolean;
}

async function sesion(): Promise<Sesion | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !canVerAportes(user.email)) return null;
  return {
    usuarioId: user.id,
    yo: colaboradorDeEmail(user.email),
    esAdmin: isAdminEmail(user.email),
  };
}

function parseMarca(body: unknown): Marca | null {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  const { ambito, scopeId, itemId, slot, colaborador, origen } = b;

  if (typeof scopeId !== 'string' || !scopeId) return null;
  if (typeof itemId !== 'string' || !itemId) return null;
  if (!AMBITOS.includes(ambito as AmbitoMarca)) return null;
  if (!SLOTS.includes(slot as SlotMarca)) return null;
  if (typeof colaborador !== 'string' || !(colaborador in COLABORADORES)) return null;
  // El tipo de aporte es opcional y sólo significa algo en el banqueo; si viene
  // con un valor que no existe, se descarta la petición entera en vez de
  // guardar una marca a medias.
  if (origen !== undefined && !ORIGENES.includes(origen as OrigenMarca)) return null;

  return {
    ambito: ambito as AmbitoMarca,
    scopeId,
    itemId,
    slot: slot as SlotMarca,
    colaborador: colaborador as Colaborador,
    origen: slot === 'banqueo' ? ((origen as OrigenMarca) ?? 'armado') : undefined,
  };
}

/** Nadie marca ni borra en nombre de otro; el admin sí, para poder corregir. */
function puedeTocar(s: Sesion, marca: Marca): boolean {
  return s.esAdmin || marca.colaborador === s.yo;
}

export async function GET() {
  const s = await sesion();
  if (!s) return NextResponse.json({ error: 'no autorizado' }, { status: 403 });
  return NextResponse.json({ marcas: await leerMarcas() });
}

export async function POST(req: Request) {
  const s = await sesion();
  if (!s) return NextResponse.json({ error: 'no autorizado' }, { status: 403 });

  const marca = parseMarca(await req.json().catch(() => null));
  if (!marca) return NextResponse.json({ error: 'marca inválida' }, { status: 400 });
  if (!puedeTocar(s, marca)) {
    return NextResponse.json({ error: 'sólo puedes marcar tus propios aportes' }, { status: 403 });
  }

  try {
    await agregarMarca(marca, s.usuarioId);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const s = await sesion();
  if (!s) return NextResponse.json({ error: 'no autorizado' }, { status: 403 });

  const marca = parseMarca(await req.json().catch(() => null));
  if (!marca) return NextResponse.json({ error: 'marca inválida' }, { status: 400 });
  if (!puedeTocar(s, marca)) {
    return NextResponse.json({ error: 'sólo puedes quitar tus propias marcas' }, { status: 403 });
  }

  try {
    await quitarMarca(marca);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
