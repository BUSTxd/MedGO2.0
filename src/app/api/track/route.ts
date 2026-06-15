import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCachedPlanState } from '@/lib/plans-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Whitelist de eventos. Debe coincidir con AnalyticsEvent en src/lib/analytics.ts.
 * Cualquier nombre fuera de aquí se rechaza (evita basura/abuso del endpoint).
 */
const ALLOWED_EVENTS = new Set([
  'clase_abierta',
  'banco_iniciado',
  'examen_completado',
  'resumen_abierto',
]);

interface TrackBody {
  event?: unknown;
  props?: unknown;
  path?: unknown;
}

export async function POST(req: NextRequest) {
  let body: TrackBody;
  try {
    body = (await req.json()) as TrackBody;
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const event = typeof body.event === 'string' ? body.event : null;
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ error: 'invalid event' }, { status: 400 });
  }

  const props =
    body.props && typeof body.props === 'object' && !Array.isArray(body.props)
      ? (body.props as Record<string, unknown>)
      : {};
  const path = typeof body.path === 'string' ? body.path.slice(0, 300) : null;

  // user_id real (puede ser null en la landing pública) + plan como fuente de
  // verdad del servidor: el snapshot no es manipulable desde el navegador.
  const supabase = await createClient();
  const [{ data: { user } }, planState] = await Promise.all([
    supabase.auth.getUser(),
    getCachedPlanState(),
  ]);

  const admin = createAdminClient();
  const table = admin.from('analytics_events') as unknown as {
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
  const { error } = await table.insert({
    user_id: user?.id ?? null,
    plan: planState.plan,
    event,
    props,
    path,
  });
  if (error) console.error('[track] insert error', error);

  return new NextResponse(null, { status: 204 });
}
