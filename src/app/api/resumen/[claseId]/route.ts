import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  // Aparato Excretor
  'exc-tbl-3',
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[resumen] missing env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  // Service role key bypasses RLS — never exposed to the client.
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const fileId = FILE_ALIAS[claseId] ?? claseId;
  const { data, error } = await supabase.storage
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
