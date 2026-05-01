import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Only these IDs have an associated PDF in Supabase Storage
const ALLOWED = new Set(['clase-4']);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!ALLOWED.has(claseId)) {
    return new NextResponse(null, { status: 404 });
  }

  // Service role key bypasses RLS — never exposed to the client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

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
      // no client-side cache → can't inspect cached PDF bytes
      'Cache-Control': 'private, no-store',
    },
  });
}
