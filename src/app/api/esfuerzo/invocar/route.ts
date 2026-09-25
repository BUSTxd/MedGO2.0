import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { RACHA_INVOCAR } from '@/lib/esfuerzo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function todayInLima(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

interface ProfileRow {
  last_visit_date: string | null;
  current_streak: number | null;
  esfuerzo_invocado_at: string | null;
}

/**
 * Invoca la célula madre del panel «Tu esfuerzo». La racha se lee de la DB, no
 * del cliente: current_streak solo se mueve con el ping, así que además se exige
 * que la última visita sea de hoy o de ayer (si no, la racha ya está rota).
 * Idempotente: invocar dos veces devuelve la fecha de la primera.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: prof } = await admin
    .from('profiles')
    .select('last_visit_date, current_streak, esfuerzo_invocado_at')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>();

  if (prof?.esfuerzo_invocado_at) {
    return NextResponse.json({ invocadoAt: prof.esfuerzo_invocado_at });
  }

  const today = todayInLima();
  const last = prof?.last_visit_date;
  const delta = last
    ? Math.round((new Date(`${today}T00:00:00Z`).getTime() - new Date(`${last}T00:00:00Z`).getTime()) / 86_400_000)
    : Infinity;
  const racha = delta <= 1 ? prof?.current_streak ?? 0 : 0;
  if (racha < RACHA_INVOCAR) {
    return NextResponse.json({ error: 'racha insuficiente', racha }, { status: 403 });
  }

  const invocadoAt = new Date().toISOString();
  const profilesTable = admin.from('profiles') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>;
    };
  };
  const { error } = await profilesTable.update({ esfuerzo_invocado_at: invocadoAt }).eq('id', user.id);
  if (error) {
    console.error('[esfuerzo/invocar] db update error', error);
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }
  return NextResponse.json({ invocadoAt });
}
