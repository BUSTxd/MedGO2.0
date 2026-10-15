import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlanStateDeContenido } from '@/lib/plans-server';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import { descargarResumenHtml, existeResumenHtml } from '@/lib/resumen-html';

/**
 * Resúmenes en HTML (no PDF).
 *
 * Para el material muy visual —una página de Notion con decenas de imágenes—
 * el PDF es el peor envase: el texto va rasterizado o en fuentes incrustadas,
 * no reflowea en móvil y pesa decenas de MB. El mismo contenido como fragmento
 * HTML pesa ~100 KB, conserva el texto real (seleccionable, buscable, nítido a
 * cualquier zoom) y sirve las imágenes en AVIF desde el CDN público.
 *
 * A diferencia de `/api/resumen/[claseId]`, que devuelve una signed URL para
 * que el navegador se descargue el PDF, aquí devolvemos **el HTML mismo**: son
 * ~100 KB, evita el baile de la signed URL y deja el contenido detrás de la
 * sesión. Las imágenes NO pasan por aquí — van directas al bucket público
 * `resumenes-img`, que es donde está el peso de verdad.
 */

// Los ids y la descarga viven en `lib/resumen-html.ts` (también los usa la IA).

export async function GET(
  req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!existeResumenHtml(claseId)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // El velo de la página no protege nada: el candado de verdad es este.
  if (!puedeVerResumen(await getPlanStateDeContenido(await createClient()), claseId)) {
    return NextResponse.json({ error: 'plan_required' }, { status: 403 });
  }

  const html = await descargarResumenHtml(claseId);
  if (html === null) {
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  // ETag sobre el contenido. Un resumen se reedita (se corrige una tabla, se
  // cambia una figura) y el path en el bucket no cambia, así que un max-age
  // largo dejaría a todo el mundo leyendo la versión vieja hasta que caduque.
  // Con `no-cache` el navegador revalida siempre, y mientras el HTML no cambie
  // la respuesta es un 304 sin cuerpo: la corrección se ve al instante y no se
  // repiten los ~100 KB en cada visita.
  const etag = `"${createHash('sha1').update(html).digest('base64url')}"`;

  if (req.headers.get('if-none-match') === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, 'Cache-Control': 'private, no-cache' },
    });
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ETag: etag,
      // `private`: es contenido de pago, nunca en un CDN compartido.
      'Cache-Control': 'private, no-cache',
    },
  });
}
