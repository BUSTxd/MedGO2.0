import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/admin';
import { CREDITOS_POR_USD, LIMITES, MODELO, iaAbierta } from '@/lib/ia/config';
import { clienteIA } from '@/lib/ia/cliente';
import { abonar } from '@/lib/ia/saldo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function esAdmin() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  return !!user && isAdminEmail(user.email);
}

const db = () => createAdminClient() as unknown as SupabaseClient;

/** Gasto real de MedGO IA (hoy y este mes) y quién más consume. */
export async function GET() {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const ahora = new Date();
  const hoy = new Date(ahora); hoy.setHours(0, 0, 0, 0);
  const mes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const { data, error } = await db()
    .from('ia_movimientos')
    .select('user_id, costo_usd, cobrado, accion, created_at, tokens_in, tokens_out, tokens_cache_r, tokens_cache_w')
    .eq('tipo', 'liquidacion')
    .gte('created_at', mes.toISOString())
    .limit(20_000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  type Fila = {
    user_id: string; costo_usd: number; cobrado: number | null; accion: string | null; created_at: string;
    tokens_in: number | null; tokens_out: number | null; tokens_cache_r: number | null; tokens_cache_w: number | null;
  };
  const filas = (data ?? []) as Fila[];
  const suma = (fs: Fila[]) => fs.reduce((n, f) => n + Number(f.costo_usd), 0);
  const deHoy = filas.filter((f) => new Date(f.created_at) >= hoy);

  // Tokens: la entrada cuenta lo cacheado (leído o escrito), que también es contexto enviado.
  const entradaDe = (f: Fila) => (f.tokens_in ?? 0) + (f.tokens_cache_r ?? 0) + (f.tokens_cache_w ?? 0);
  const tokens = { entrada: 0, salida: 0, cacheLeida: 0 };
  // Las respuestas guardadas no llaman al modelo: no cuentan para los promedios de tokens.
  let conModelo = 0;

  const porUsuario = new Map<string, { usd: number; consultas: number; creditos: number; tokens: number }>();
  const porAccion = new Map<string, { usd: number; consultas: number; entrada: number; salida: number; conModelo: number }>();
  for (const f of filas) {
    const entrada = entradaDe(f);
    const salida = f.tokens_out ?? 0;
    const llamo = entrada + salida > 0;
    tokens.entrada += entrada; tokens.salida += salida; tokens.cacheLeida += f.tokens_cache_r ?? 0;
    if (llamo) conModelo += 1;

    const u = porUsuario.get(f.user_id) ?? { usd: 0, consultas: 0, creditos: 0, tokens: 0 };
    u.usd += Number(f.costo_usd); u.consultas += 1; u.creditos += Number(f.cobrado ?? 0); u.tokens += entrada + salida;
    porUsuario.set(f.user_id, u);
    const a = porAccion.get(f.accion ?? '—') ?? { usd: 0, consultas: 0, entrada: 0, salida: 0, conModelo: 0 };
    a.usd += Number(f.costo_usd); a.consultas += 1; a.entrada += entrada; a.salida += salida; if (llamo) a.conModelo += 1;
    porAccion.set(f.accion ?? '—', a);
  }
  const promedio = (n: number, d: number) => (d ? Math.round(n / d) : 0);
  const top = [...porUsuario.entries()].sort((a, b) => b[1].usd - a[1].usd).slice(0, 10);
  const admin = createAdminClient();
  const conCorreo = await Promise.all(top.map(async ([id, v]) => {
    const { data: u } = await admin.auth.admin.getUserById(id);
    return { email: u.user?.email ?? id, ...v };
  }));

  return NextResponse.json({
    modelo: MODELO,
    configurada: clienteIA() !== null,
    abierta: iaAbierta(),
    topeDiarioUsd: LIMITES.topeDiarioUsd,
    creditosPorUsd: CREDITOS_POR_USD,
    hoy: { usd: suma(deHoy), consultas: deHoy.length },
    mes: {
      usd: suma(filas),
      consultas: filas.length,
      usuarios: porUsuario.size,
      tokens: {
        ...tokens,
        porAlumno: promedio(tokens.entrada + tokens.salida, porUsuario.size),
        entradaPorConsulta: promedio(tokens.entrada, conModelo),
        salidaPorConsulta: promedio(tokens.salida, conModelo),
        /** Respuestas que salieron guardadas, sin llamar al modelo. */
        guardadas: filas.length - conModelo,
      },
    },
    porAccion: Object.fromEntries([...porAccion].map(([k, v]) => [k, {
      usd: v.usd,
      consultas: v.consultas,
      entradaPromedio: promedio(v.entrada, v.conModelo),
      salidaPromedio: promedio(v.salida, v.conModelo),
    }])),
    top: conCorreo,
  }, { headers: { 'Cache-Control': 'no-store' } });
}

/** Abonar (o quitar, en negativo) créditos de recarga a una cuenta, por correo. */
export async function POST(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => null) as { email?: string; creditos?: number } | null;
  const email = body?.email?.trim().toLowerCase();
  const creditos = Math.trunc(Number(body?.creditos));
  if (!email || !Number.isFinite(creditos) || creditos === 0 || Math.abs(creditos) > 10_000_000) {
    return NextResponse.json({ error: 'invalido' }, { status: 400 });
  }

  // Sin búsqueda por correo en la API de auth: se recorre la lista (pocos miles).
  const admin = createAdminClient();
  let id: string | null = null;
  for (let page = 1; page <= 20 && !id; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    id = data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
    if (data.users.length < 1000) break;
  }
  if (!id) return NextResponse.json({ error: 'sin_usuario' }, { status: 404 });

  await abonar(id, creditos, 'ajuste');
  return NextResponse.json({ ok: true });
}
