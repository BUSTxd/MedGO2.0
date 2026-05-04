import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Only these IDs have an associated PDF in Supabase Storage
const ALLOWED = new Set(['clase-4', 'clase-5', 'clase-6', 'clase-6.2', 'clase-7']);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!ALLOWED.has(claseId)) {
    return new NextResponse(null, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[resumen] missing env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Restart the dev server after adding them to .env.local.');
    return new NextResponse(null, { status: 500 });
  }

  // Service role key bypasses RLS — never exposed to the client
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data, error } = await supabase.storage
    .from('resumenes')
    .download(`${claseId}.pdf`);

  if (error || !data) {
    console.error('[resumen] storage error:', error?.message);
    return new NextResponse(null, { status: 404 });
  }

  const buffer = await data.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      // inline → renders in browser, no download dialog
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      // private: solo el browser del usuario lo cachea (no proxies/CDN)
      // max-age=3600: evita re-descargar si el alumno cierra y vuelve a abrir
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
