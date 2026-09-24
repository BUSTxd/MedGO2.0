import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { resumenValoraciones } from '@/lib/valoraciones-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const csv = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** Valoraciones de las preguntas, agregadas por clase. Con `?formato=csv`, una fila por pregunta. */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const resumen = await resumenValoraciones();
  if (req.nextUrl.searchParams.get('formato') === 'csv') {
    const filas = ['clase,pregunta,enunciado,rojo,amarillo,verde,votos,satisfaccion'];
    for (const c of resumen.clases) {
      for (const p of c.preguntas) {
        filas.push([csv(c.key), csv(p.id), csv(p.enunciado), p.rojo, p.amarillo, p.verde, p.total, p.satisfaccion].join(','));
      }
    }
    return new NextResponse(`﻿${filas.join('\n')}`, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="valoraciones-preguntas.csv"',
        'Cache-Control': 'no-store',
      },
    });
  }
  return NextResponse.json(resumen, { headers: { 'Cache-Control': 'no-store' } });
}
