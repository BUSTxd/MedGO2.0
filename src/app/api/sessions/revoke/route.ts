import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revokeSession } from '@/lib/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null;
  if (!sessionId) {
    return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
  }

  const ok = await revokeSession(user.id, sessionId);
  if (!ok) return NextResponse.json({ error: 'revoke_failed' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
