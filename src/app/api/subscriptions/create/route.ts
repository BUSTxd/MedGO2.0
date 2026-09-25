import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan } from '@/lib/plans';
import { createPreapproval, getPreapproval, type PreapprovalResponse } from '@/lib/mercadopago';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Cuánto acceso da una suscripción recién autorizada mientras llega el primer
 * cobro. MP suele cobrar en minutos; 72 h cubren un webhook atrasado o un
 * reintento del banco sin regalar más que eso a una tarjeta sin fondos.
 */
const ACCESO_PROVISIONAL_MS = 72 * 60 * 60 * 1000;

/** ¿Se cobró ya la primera cuota? Si la respuesta de creación no lo dice, se relee una vez. */
async function primeraCuotaCobrada(p: PreapprovalResponse): Promise<boolean> {
  if ((p.summarized?.charged_quantity ?? 0) > 0) return true;
  try {
    const fresca = await getPreapproval(p.id);
    return (fresca.summarized?.charged_quantity ?? 0) > 0;
  } catch (err) {
    console.error('[subs/create] no se pudo releer el preapproval', err);
    return false;
  }
}

export async function POST(req: Request) {
  let body: { cardTokenId?: string; planKey?: string; payerEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const { cardTokenId, planKey, payerEmail } = body;
  if (!cardTokenId || !planKey || !payerEmail) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  const plan = getPlan(planKey);
  if (!plan) return NextResponse.json({ error: 'invalid plan' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', user.id)
    .in('status', ['authorized', 'pending'])
    .maybeSingle<{ id: string; status: string }>();
  if (existing) {
    return NextResponse.json(
      { error: 'already_subscribed', status: existing.status },
      { status: 409 },
    );
  }

  // Bloqueo adicional: el usuario puede haber cancelado pero su acceso pagado
  // sigue vigente hasta plan_expires_at. En ese caso, no permitimos comprar
  // otro plan hasta que el acceso actual expire de verdad.
  const { data: profile } = await admin
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', user.id)
    .maybeSingle<{ plan: string | null; plan_expires_at: string | null }>();
  const expiresAtIso = profile?.plan_expires_at ?? null;
  const hasActiveAccess =
    !!profile?.plan &&
    profile.plan !== 'free' &&
    !!expiresAtIso &&
    new Date(expiresAtIso).getTime() > Date.now();
  if (hasActiveAccess) {
    return NextResponse.json(
      {
        error: 'already_subscribed',
        reason: 'active_access',
        plan: profile?.plan,
        expiresAt: expiresAtIso,
      },
      { status: 409 },
    );
  }

  let preapproval;
  try {
    preapproval = await createPreapproval({
      preapproval_plan_id: plan.mpPlanId,
      payer_email: payerEmail,
      card_token_id: cardTokenId,
      status: 'authorized',
    });
  } catch (err) {
    console.error('[subs/create] MP error', err);
    return NextResponse.json({ error: 'mp_error', detail: String(err) }, { status: 502 });
  }

  const nowMs = Date.now();
  const fallback = new Date(nowMs + plan.durationDays * 24 * 60 * 60 * 1000);
  // MP a veces devuelve next_payment_date == start_date == now en la creación
  // (no es cuando "cobra de nuevo" sino cuando "empezó a aplicar"). Solo usamos
  // ese valor si está claramente en el futuro; si no, calculamos +durationDays.
  const npd = preapproval.next_payment_date ? new Date(preapproval.next_payment_date) : null;
  const expiresAt = (npd && npd.getTime() > nowMs + 60 * 60 * 1000) ? npd : fallback;

  const subsTable = admin.from('subscriptions') as unknown as {
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
  const { error: insertErr } = await subsTable.insert({
    user_id: user.id,
    mp_preapproval_id: preapproval.id,
    mp_plan_id: plan.mpPlanId,
    plan_key: plan.key,
    status: preapproval.status,
    amount: plan.amount,
    currency: plan.currency,
    next_payment_date: expiresAt.toISOString(),
    payer_email: payerEmail,
  });
  if (insertErr) {
    console.error('[subs/create] insert error', insertErr);
    return NextResponse.json({ error: 'db_insert_failed' }, { status: 500 });
  }

  if (preapproval.status === 'authorized') {
    const profilesTable = admin.from('profiles') as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: unknown }>;
      };
    };
    // `authorized` sólo dice que la tarjeta se validó, no que se cobró: con una
    // prepago sin saldo MP la autoriza igual. El periodo entero va sólo si la
    // primera cuota ya entró (MP suele cobrar en el mismo segundo); si no, un
    // acceso PROVISIONAL que el webhook alarga al llegar el pago `approved`, y
    // que se apaga solo si el cobro nunca entra.
    const cobrada = await primeraCuotaCobrada(preapproval);
    const vence = cobrada
      ? expiresAt
      : new Date(Math.min(expiresAt.getTime(), nowMs + ACCESO_PROVISIONAL_MS));
    const { error: profErr } = await profilesTable
      .update({ plan: plan.key, plan_expires_at: vence.toISOString() })
      .eq('id', user.id);
    if (profErr) console.error('[subs/create] profile update', profErr);
    // Invalida cualquier cache de Server Components del árbol /dashboard
    // para que el próximo render reciba el plan nuevo.
    revalidatePath('/dashboard', 'layout');
  }

  return NextResponse.json({
    ok: true,
    status: preapproval.status,
    redirectTo: '/dashboard/home',
    receipt: {
      mpPreapprovalId: preapproval.id,
      planLabel: plan.label,
      amount: plan.amount,
      currency: plan.currency,
      nextPaymentDate: expiresAt.toISOString(),
      payerEmail,
    },
  });
}
