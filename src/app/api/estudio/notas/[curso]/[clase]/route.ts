import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlanStateDeContenido } from '@/lib/plans-server';
import { actividadDe, descargarNotas, puedeVerNotas, tieneNotas } from '@/lib/estudio/notas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Las notas de una clase (pestaña «Notas» de /estudio). El candado de la interfaz
 * es solo un aviso: el de verdad es este, con la regla del resumen de la clase.
 * ETag y `no-cache`, como el resumen HTML: una nota corregida se ve al instante.
 */
export async function GET(req: Request, { params }: { params: Promise<{ curso: string; clase: string }> }) {
  const { curso, clase } = await params;
  const act = tieneNotas(curso, clase) ? actividadDe(curso, clase) : null;
  if (!act) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  if (!puedeVerNotas(await getPlanStateDeContenido(await createClient()), act)) {
    return NextResponse.json({ error: 'plan_required' }, { status: 403 });
  }

  const json = await descargarNotas(curso, clase);
  if (json === null) return NextResponse.json({ error: 'not_available' }, { status: 404 });

  const etag = `"${createHash('sha1').update(json).digest('base64url')}"`;
  if (req.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'private, no-cache' } });
  }
  return new NextResponse(json, {
    headers: { 'Content-Type': 'application/json; charset=utf-8', ETag: etag, 'Cache-Control': 'private, no-cache' },
  });
}
