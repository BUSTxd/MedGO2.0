import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXAMENES: Record<string, { free?: boolean }> = {
  'excretor/tbl-3-asa-henle': { free: true },
  'neurologia/snp-histologia': { free: true },
  'neurologia/snp-histologia-b': { free: true },
  'neurologia/snc-histologia': { free: true },
};

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ examKey: string[] }> },
) {
  const { examKey } = await params;
  const key = examKey.join('/');

  const meta = EXAMENES[key];
  if (!meta) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!meta.free) {
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
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('[examen] missing env vars');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const admin = createSupabaseAdmin(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.storage
    .from('examenes')
    .createSignedUrl(`${key}.json`, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('[examen] signed url error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;

  return NextResponse.json(
    { url: data.signedUrl, expiresAt },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
