import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

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

// Ids con un .html en el bucket `resumenes`. Mismo criterio que el ALLOWED de
// la route de PDF: si no está aquí, es 404 sin tocar Storage.
const ALLOWED = new Set([
  'bcm-ta-1',
  'bcm-ta-2',
  'bcm-ta-3',
  'bcm-ta-4',
  'bcm-ta-5',
  'bcm-te-2-html',
  // Segundo resumen de Te4: la clase se ofrece en dos envases y el alumno
  // elige. El id lleva sufijo porque `bcm-te-4` ya es el PDF, en otro bucket.
  'bcm-te-4-html',
  'bcm-te-8',
  'dig-clase-1',
  'dig-clase-2',
  'dig-clase-3',
  'dig-clase-5',
  'dig-clase-6',
  'dig-clase-7',
  'dig-clase-8',
  'dig-clase-9',
  'dig-clase-10',
  'dig-clase-11',
  'dig-clase-12',
  'dig-clase-14',
  'dig-clase-15',
  'dig-clase-16',
  'dig-clase-18',
  'dig-tbl-1',
  'dig-tbl-2',
  'loc-clase-2',
  'loc-clase-2-osteo',
  'loc-clase-3',
  'loc-clase-4',
  'loc-clase-5',
  'loc-clase-7',
  'loc-clase-9',
  'loc-clase-11',
  'loc-clase-13',
  'loc-clase-14',
  'loc-clase-15',
]);

// id → ruta dentro del bucket (sin extensión).
const FILE_ALIAS: Record<string, string> = {
  'bcm-ta-1': 'biologia-celular/bcm-ta-1',
  'bcm-ta-2': 'biologia-celular/bcm-ta-2',
  'bcm-ta-3': 'biologia-celular/bcm-ta-3',
  'bcm-ta-4': 'biologia-celular/bcm-ta-4',
  'bcm-ta-5': 'biologia-celular/bcm-ta-5',
  'bcm-te-2-html': 'biologia-celular/bcm-te-2-html',
  'bcm-te-4-html': 'biologia-celular/bcm-te-4-html',
  'bcm-te-8': 'biologia-celular/bcm-te-8',
  'dig-clase-1': 'digestivo/dig-clase-1',
  'dig-clase-2': 'digestivo/dig-clase-2',
  'dig-clase-3': 'digestivo/dig-clase-3',
  'dig-clase-5': 'digestivo/dig-clase-5',
  'dig-clase-6': 'digestivo/dig-clase-6',
  'dig-clase-7': 'digestivo/dig-clase-7',
  'dig-clase-8': 'digestivo/dig-clase-8',
  'dig-clase-9': 'digestivo/dig-clase-9',
  'dig-clase-10': 'digestivo/dig-clase-10',
  'dig-clase-11': 'digestivo/dig-clase-11',
  'dig-clase-12': 'digestivo/dig-clase-12',
  'dig-clase-14': 'digestivo/dig-clase-14',
  'dig-clase-15': 'digestivo/dig-clase-15',
  'dig-clase-16': 'digestivo/dig-clase-16',
  'dig-clase-18': 'digestivo/dig-clase-18',
  'dig-tbl-1': 'digestivo/dig-tbl-1',
  'dig-tbl-2': 'digestivo/dig-tbl-2',
  'loc-clase-2': 'aparato-locomotor/loc-clase-2',
  'loc-clase-2-osteo': 'aparato-locomotor/loc-clase-2-osteo',
  'loc-clase-3': 'aparato-locomotor/loc-clase-3',
  'loc-clase-4': 'aparato-locomotor/loc-clase-4',
  'loc-clase-5': 'aparato-locomotor/loc-clase-5',
  'loc-clase-7': 'aparato-locomotor/loc-clase-7',
  'loc-clase-9': 'aparato-locomotor/loc-clase-9',
  'loc-clase-11': 'aparato-locomotor/loc-clase-11',
  'loc-clase-13': 'aparato-locomotor/loc-clase-13',
  'loc-clase-14': 'aparato-locomotor/loc-clase-14',
  'loc-clase-15': 'aparato-locomotor/loc-clase-15',
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!ALLOWED.has(claseId)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[resumen-html] faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  // Service role key: bypasea RLS y nunca se expone al cliente.
  const admin = createSupabaseAdmin(url, key, { auth: { persistSession: false } });

  const fileId = FILE_ALIAS[claseId] ?? claseId;
  const { data, error } = await admin.storage
    .from('resumenes')
    .download(`${fileId}.html`);

  if (error || !data) {
    console.error('[resumen-html] download error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const html = await data.text();

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
