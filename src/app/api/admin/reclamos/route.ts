import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/admin';
import { CORREO } from '@/lib/contacto';
import { PROVEEDOR } from '@/lib/proveedor';
import { enviarCorreo, escHtml } from '@/lib/correo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function esAdmin() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  return !!user && isAdminEmail(user.email);
}

const db = () => createAdminClient() as unknown as SupabaseClient;

/** Las hojas del Libro de Reclamaciones, las pendientes primero. */
export async function GET() {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { data, error } = await db()
    .from('libro_reclamaciones')
    .select('*')
    .order('estado', { ascending: false }) // 'pendiente' > 'respondido'
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hojas: data ?? [], correo: !!process.env.RESEND_API_KEY });
}

/** Guarda la respuesta de una hoja, la marca respondida y, si hay correo, se la envía al consumidor. */
export async function PATCH(req: Request) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id, respuesta } = (await req.json().catch(() => ({}))) as { id?: string; respuesta?: string };
  const texto = String(respuesta ?? '').trim();
  if (!id || !texto) return NextResponse.json({ error: 'Falta la respuesta.' }, { status: 400 });
  if (texto.length > 5000) return NextResponse.json({ error: 'La respuesta es demasiado larga.' }, { status: 400 });

  const { data: hoja, error } = await db()
    .from('libro_reclamaciones')
    .update({ respuesta: texto, estado: 'respondido', respondido_at: new Date().toISOString() })
    .eq('id', id)
    .select('codigo, email, nombre')
    .single<{ codigo: string; email: string; nombre: string }>();
  if (error || !hoja) return NextResponse.json({ error: error?.message ?? 'No existe.' }, { status: 404 });

  const enviada = await enviarCorreo({
    to: hoja.email,
    bcc: CORREO,
    subject: `Respuesta a tu hoja ${hoja.codigo} · Libro de Reclamaciones de MedGO`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:640px">
<p>Hola, ${escHtml(hoja.nombre)}:</p>
<p>Esta es nuestra respuesta a tu hoja <strong>${escHtml(hoja.codigo)}</strong> del Libro de Reclamaciones.</p>
<p style="white-space:pre-wrap;padding:12px 14px;background:#f4f5f7;border-radius:8px">${escHtml(texto)}</p>
<p style="color:#555;font-size:12px">${escHtml(PROVEEDOR.nombreComercial)} · ${escHtml(PROVEEDOR.titular)} · ${escHtml(CORREO)}</p>
</div>`,
  });
  return NextResponse.json({ ok: true, enviada });
}
