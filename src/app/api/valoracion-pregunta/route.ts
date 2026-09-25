import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EXAMENES } from '@/lib/data/examenes-acceso';
import { esValoracion } from '@/lib/valoraciones';
import { guardarValoracion } from '@/lib/valoraciones-server';
import { pasaElFreno } from '@/lib/freno';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ID_PREGUNTA = /^[A-Za-z0-9_.-]{1,40}$/;

/** Guarda (o corrige) la valoración de un alumno a una pregunta del quiz. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const examKey = typeof body.examKey === 'string' ? body.examKey : '';
  const questionId = typeof body.questionId === 'string' ? body.questionId : '';
  if (!Object.hasOwn(EXAMENES, examKey) || !ID_PREGUNTA.test(questionId) || !esValoracion(body.rating)) {
    return NextResponse.json({ error: 'datos inválidos' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // Cada questionId distinto es una fila nueva: sin freno, un bucle llenaba la tabla.
  if (!pasaElFreno(`val:${user.id}`, 60)) return new NextResponse(null, { status: 429 });

  const ok = await guardarValoracion(user.id, examKey, questionId, body.rating);
  return ok ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: 'no guardado' }, { status: 500 });
}
