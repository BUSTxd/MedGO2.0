import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { abiertosDe, cerrar, marcarVisto, pasaElFreno, responder, textoValido, MAX_RESPUESTA } from '@/lib/mensajes-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function usuario() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Los mensajes sin cerrar del alumno con sesión. */
export async function GET() {
  const user = await usuario();
  if (!user) return NextResponse.json({ mensajes: [] });
  return NextResponse.json({ mensajes: await abiertosDe(user.id) }, { headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Acciones del alumno sobre SU mensaje: `visto`, `cerrar` o `responder`. El
 * servidor comprueba en cada una que el mensaje sea suyo.
 */
export async function POST(req: NextRequest) {
  const user = await usuario();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' && UUID.test(body.id) ? body.id : null;
  if (!id) return NextResponse.json({ error: 'id inválido' }, { status: 400 });

  if (body.accion === 'visto') {
    await marcarVisto(user.id, id);
    return new NextResponse(null, { status: 204 });
  }
  if (body.accion === 'cerrar') {
    await cerrar(user.id, id);
    return new NextResponse(null, { status: 204 });
  }
  if (body.accion === 'responder') {
    if (!pasaElFreno(user.id)) {
      return NextResponse.json({ error: 'demasiadas respuestas seguidas' }, { status: 429 });
    }
    const cuerpo = textoValido(body.cuerpo, MAX_RESPUESTA);
    if (!cuerpo) return NextResponse.json({ error: 'respuesta vacía o demasiado larga' }, { status: 400 });
    const respuesta = await responder(user.id, id, cuerpo);
    if (!respuesta) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ respuesta });
  }
  return NextResponse.json({ error: 'acción desconocida' }, { status: 400 });
}
