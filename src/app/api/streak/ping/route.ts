import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDeviceId, touchSession } from '@/lib/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function todayInLima(): string {
  // YYYY-MM-DD en zona America/Lima (UTC-5, sin DST).
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date());
}

function diffDays(fromIso: string, toIso: string): number {
  const a = new Date(`${fromIso}T00:00:00Z`).getTime();
  const b = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

interface ProfileRow {
  last_visit_date: string | null;
  current_streak: number | null;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Touch de la sesión del dispositivo (UA + IP). Sin await en el caller para no
  // bloquear la respuesta — pero await aquí porque la tabla es pequeña y rápida.
  const deviceId = await getDeviceId();
  if (deviceId) {
    await touchSession({
      userId:    user.id,
      deviceId,
      userAgent: req.headers.get('user-agent'),
      ip:        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    });
  }

  const admin = createAdminClient();
  const today = todayInLima();

  const { data: prof } = await admin
    .from('profiles')
    .select('last_visit_date, current_streak')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  const lastVisit = prof?.last_visit_date ?? null;
  const prevStreak = prof?.current_streak ?? 0;

  let nextStreak: number;
  if (!lastVisit) {
    nextStreak = 1;
  } else if (lastVisit === today) {
    nextStreak = prevStreak > 0 ? prevStreak : 1;
  } else {
    const delta = diffDays(lastVisit, today);
    nextStreak = delta === 1 ? prevStreak + 1 : 1;
  }

  if (lastVisit !== today || nextStreak !== prevStreak) {
    const profilesTable = admin.from('profiles') as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: unknown }>;
      };
    };
    const { error: updErr } = await profilesTable
      .update({ last_visit_date: today, current_streak: nextStreak })
      .eq('id', user.id);
    if (updErr) console.error('[streak/ping] db update error', updErr);
  }

  return NextResponse.json({ streak: nextStreak });
}
