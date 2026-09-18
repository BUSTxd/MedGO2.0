import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/admin';
import { cargarActividadUsuario, cargarEventos, legible } from '@/lib/actividad-usuario';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function celda(v: string | number | null | undefined): string {
  const s = v == null ? '' : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function fechaLima(iso: string): string {
  return new Date(iso).toLocaleString('sv-SE', { timeZone: 'America/Lima' });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get('user');
  if (userId && !UUID.test(userId)) {
    return NextResponse.json({ error: 'user inválido' }, { status: 400 });
  }

  if (req.nextUrl.searchParams.get('formato') !== 'csv') {
    if (!userId) return NextResponse.json({ error: 'falta user' }, { status: 400 });
    return NextResponse.json(await cargarActividadUsuario(userId), {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const admin = createAdminClient();
  const [{ filas }, authRes] = await Promise.all([
    cargarEventos(userId),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const emails = new Map(authRes.data?.users.map((u) => [u.id, u.email ?? '']) ?? []);
  const adminIds = new Set(authRes.data?.users.filter((u) => isAdminEmail(u.email)).map((u) => u.id));

  const lineas = [['fecha_lima', 'email', 'plan', 'evento', 'accion', 'lugar', 'acceso', 'detalle', 'ruta'].join(',')];
  for (const f of filas) {
    if (f.user_id && adminIds.has(f.user_id)) continue;
    const e = legible(f);
    lineas.push([
      fechaLima(f.created_at),
      emails.get(f.user_id ?? '') ?? '',
      f.plan ?? '',
      e.evento,
      e.accion,
      e.lugar,
      e.acceso,
      e.detalle,
      e.path,
    ].map(celda).join(','));
  }

  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  const quien = userId ? (emails.get(userId) ?? userId).split('@')[0] : 'todos';
  // BOM para que Excel abra las tildes bien.
  return new NextResponse('﻿' + lineas.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="medgo-actividad-${quien.replace(/[^\w.-]/g, '_')}-${hoy}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
