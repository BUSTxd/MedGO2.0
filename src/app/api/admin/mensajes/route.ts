import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import {
  bandeja, enviarMensaje, marcarRespuestasLeidas, textoValido, MAX_CUERPO, MAX_TITULO,
} from '@/lib/mensajes-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function esAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user && isAdminEmail(user.email);
}

/** Bandeja: mensajes enviados con sus respuestas. */
export async function GET() {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ mensajes: await bandeja() }, { headers: { 'Cache-Control': 'no-store' } });
}

/** Enviar un mensaje a un alumno. */
export async function POST(req: NextRequest) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === 'string' && UUID.test(body.userId) ? body.userId : null;
  const titulo = textoValido(body.titulo, MAX_TITULO);
  const cuerpo = textoValido(body.cuerpo, MAX_CUERPO);
  if (!userId || !titulo || !cuerpo) {
    return NextResponse.json({ error: 'datos inválidos' }, { status: 400 });
  }
  const mensaje = await enviarMensaje(userId, titulo, cuerpo);
  return NextResponse.json({ mensaje });
}

/** Marca como leídas todas las respuestas (al abrir la bandeja). */
export async function PATCH() {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  await marcarRespuestasLeidas();
  return new NextResponse(null, { status: 204 });
}
