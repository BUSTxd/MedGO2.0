import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Only these IDs have an associated PDF in Supabase Storage
const ALLOWED = new Set([
  // Microbiología — Virología/Micología
  'clase-4', 'clase-5', 'clase-6', 'clase-6.2', 'clase-7', 'clase-8', 'clase-9', 'clase-10',
  'practica-1', 'practica-2', 'practica-3',
  // Microbiología — Parasitología
  'clase-12', 'clase-12.2',
  'clase-13', 'clase-13.2',
  'clase-14', 'clase-15', 'clase-16',
  'clase-17', 'clase-17.2',
  'clase-18',
  // Microbiología — Prácticas Parasitología/Artrópodos
  'practica-8', 'practica-9', 'practica-10',
  'practica-11', 'practica-12', 'practica-13',
  // Aparato Excretor
  'exc-tbl-3',
  // Farmacología (prefijo `far-` evita colisión con clase-* de Microbiología)
  'far-14', 'far-16', 'far-17', 'far-18',
  'far-19', 'far-19.2',
  'far-23', 'far-24', 'far-25',
]);

// IDs that require an active paid plan (Interno/Residente). Free-plan users
// get 403 before any signed URL is generated — zero Supabase egress for them.
const REQUIRES_PAID_PLAN = new Set([
  'practica-8', 'practica-9', 'practica-10',
  'practica-11', 'practica-12', 'practica-13',
]);

// Some IDs share a single PDF file in storage, or need a path prefix (carpeta/)
const FILE_ALIAS: Record<string, string> = {
  'practica-2':  'practica-2-3',
  'practica-3':  'practica-2-3',
  'exc-tbl-3':   'excretor/tbl-3-asa-henle',
  // Parasitología — todos en subcarpeta
  'clase-12':    'parasitologia/clase-12',
  'clase-12.2':  'parasitologia/clase-12.2',
  'clase-13':    'parasitologia/clase-13',
  'clase-13.2':  'parasitologia/clase-13.2',
  'clase-14':    'parasitologia/clase-14',
  'clase-15':    'parasitologia/clase-15',
  'clase-16':    'parasitologia/clase-16',
  'clase-17':    'parasitologia/clase-17',
  'clase-17.2':  'parasitologia/clase-17.2',
  'clase-18':    'parasitologia/clase-18',
  // Prácticas Parasitología/Artrópodos
  'practica-8':  'parasitologia/practica-8',
  'practica-9':  'parasitologia/practica-9',
  'practica-10': 'parasitologia/practica-10',
  'practica-11': 'parasitologia/practica-11',
  'practica-12': 'parasitologia/practica-12',
  'practica-13': 'parasitologia/practica-13',
  // Farmacología — subcarpeta farmacologia/. .v2 fix de imágenes blancas:
  // el compresor antiguo dejaba /Filter como JPXDecode tras reemplazar bytes con
  // JPEG → pdfjs renderizaba garbage. .v2 se generó con page.replace_image() que
  // actualiza filter/colorspace correctamente. Path nuevo invalida el cache
  // immutable instantáneamente para todos los usuarios.
  'far-14':   'farmacologia/clase-14.v2',
  'far-16':   'farmacologia/clase-16.v2',
  'far-17':   'farmacologia/clase-17.v2',
  'far-18':   'farmacologia/clase-18.v2',
  'far-19':   'farmacologia/clase-19.v2',
  'far-19.2': 'farmacologia/clase-19.2.v2',
  'far-23':   'farmacologia/clase-23.v2',
  'far-24':   'farmacologia/clase-24.v2',
  'far-25':   'farmacologia/clase-25.v2',
};

// Las signed URLs viven 1 semana. Suficiente para una sesion de estudio larga
// (incluso varios dias) y el cliente las cachea en sessionStorage. Cuando la
// URL caduca el cliente vuelve a pedir una nueva — un fetch JSON, sin descargar
// el PDF entero por Vercel.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!ALLOWED.has(claseId)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (REQUIRES_PAID_PLAN.has(claseId)) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle<{ plan: string | null }>();
    if (!profile?.plan || profile.plan === 'free') {
      return NextResponse.json({ error: 'plan_required' }, { status: 403 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[resumen] missing env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  // Service role key bypasses RLS — never exposed to the client.
  const admin = createSupabaseAdmin(url, key, { auth: { persistSession: false } });

  const fileId = FILE_ALIAS[claseId] ?? claseId;
  const { data, error } = await admin.storage
    .from('resumenes')
    .createSignedUrl(`${fileId}.pdf`, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('[resumen] signed url error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  // expiresAt: timestamp en ms en el que la URL deja de ser valida. El cliente
  // lo usa para decidir si reutiliza la URL cacheada o pide una nueva.
  const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;

  return NextResponse.json(
    { url: data.signedUrl, expiresAt },
    {
      // Nunca cachear el JSON en CDN: la signed URL es por-usuario y temporal.
      // El cliente la guarda en sessionStorage para no repedirla en la sesion.
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
