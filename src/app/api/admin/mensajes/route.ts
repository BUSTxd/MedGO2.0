import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import {
  bandeja, borrarMensajes, contarNuevas, difundir, enviarMensaje, marcarRespuestasLeidas,
  textoValido, MAX_CUERPO, MAX_TITULO,
} from '@/lib/mensajes-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function esAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user && isAdminEmail(user.email);
}

/** Bandeja: mensajes enviados con sus respuestas. Con `?cuenta=1`, sólo cuántas respuestas faltan leer. */
export async function GET(req: NextRequest) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const headers = { 'Cache-Control': 'no-store' };
  if (req.nextUrl.searchParams.get('cuenta') === '1') {
    return NextResponse.json({ nuevas: await contarNuevas() }, { headers });
  }
  // `?todo=1`: la descarga previa a vaciar, sin el tope de la vista.
  const completa = req.nextUrl.searchParams.get('todo') === '1';
  return NextResponse.json({ mensajes: await bandeja(completa) }, { headers });
}

/** Enviar un mensaje a un alumno, o a todos con `{ a: 'todos' }`. */
export async function POST(req: NextRequest) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const titulo = textoValido(body.titulo, MAX_TITULO);
  const cuerpo = textoValido(body.cuerpo, MAX_CUERPO);
  if (!titulo || !cuerpo) return NextResponse.json({ error: 'datos inválidos' }, { status: 400 });

  if (body.a === 'todos') {
    return NextResponse.json({ enviados: await difundir(titulo, cuerpo) });
  }

  const userId = typeof body.userId === 'string' && UUID.test(body.userId) ? body.userId : null;
  if (!userId) return NextResponse.json({ error: 'datos inválidos' }, { status: 400 });
  const mensaje = await enviarMensaje(userId, titulo, cuerpo);
  return NextResponse.json({ mensaje, enviados: 1 });
}

/** Vaciar la bandeja: `{ modo: 'cerrados' }` o `{ modo: 'todos' }`. */
export async function DELETE(req: NextRequest) {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const modo = body.modo === 'todos' ? 'todos' : body.modo === 'cerrados' ? 'cerrados' : null;
  if (!modo) return NextResponse.json({ error: 'modo inválido' }, { status: 400 });
  return NextResponse.json({ borrados: await borrarMensajes(modo) });
}

/** Marca como leídas todas las respuestas (al abrir la bandeja). */
export async function PATCH() {
  if (!(await esAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  await marcarRespuestasLeidas();
  return new NextResponse(null, { status: 204 });
}
