import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCachedPlanState } from '@/lib/plans-server';
import { isAdminEmail } from '@/lib/admin';
import { ACCESO_V, accesoAlRegistrar } from '@/lib/actividad-usuario';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Whitelist de eventos. Debe coincidir con AnalyticsEvent en src/lib/analytics.ts.
 * Cualquier nombre fuera de aquí se rechaza (evita basura/abuso del endpoint).
 */
const ALLOWED_EVENTS = new Set([
  'pagina_vista',
  'pagina_salida',
  'clase_abierta',
  'banco_iniciado',
  'examen_completado',
  'resumen_abierto',
  'simulacion_abierta',
  'contenido_bloqueado',
  'pago_abierto',
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

  let props =
    body.props && typeof body.props === 'object' && !Array.isArray(body.props)
      ? (body.props as Record<string, unknown>)
      : {};
  if (event === 'pagina_salida') {
    // Lo único que la ficha suma: un número fuera de rango descuadraría los tiempos.
    const s = Number(props.segundos);
    props = {
      segundos: Number.isFinite(s) ? Math.min(Math.max(Math.round(s), 0), 86_400) : 0,
      motivo: props.motivo === 'navego' ? 'navego' : 'oculto',
      ...(props.banqueo === true ? { banqueo: true } : {}),
    };
  }
  const path = typeof body.path === 'string' ? body.path.slice(0, 300) : null;

  // user_id real (puede ser null en la landing pública) + plan como fuente de
  // verdad del servidor: el snapshot no es manipulable desde el navegador.
  const supabase = await createClient();
  const [{ data: { user } }, planState] = await Promise.all([
    supabase.auth.getUser(),
    getCachedPlanState(),
  ]);
  // El admin recorre la web para revisarla: sus eventos ensuciarían las métricas.
  if (isAdminEmail(user?.email)) return new NextResponse(null, { status: 204 });

  // El acceso se congela aquí: lo que el cliente mande en props.acceso solo
  // cuenta si no hay una fuente mejor en el servidor.
  const acceso = accesoAlRegistrar(event, path, props);
  const { acceso: _cliente, ...resto } = props;
  const propsFinal = { ...resto, acceso_v: ACCESO_V, ...(acceso ? { acceso } : {}) };

  const admin = createAdminClient();
  const table = admin.from('analytics_events') as unknown as {
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
  const { error } = await table.insert({
    user_id: user?.id ?? null,
    plan: planState.plan,
    event,
    props: propsFinal,
    path,
  });
  if (error) console.error('[track] insert error', error);

  return new NextResponse(null, { status: 204 });
}
