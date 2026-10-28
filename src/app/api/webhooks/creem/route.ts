import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { PLANS, isPlanKey, type PlanKey } from '@/lib/plans';
import { CreemError, estadoPropio, firmaValida, getSuscripcion, idDe } from '@/lib/creem';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Evento {
  id?: string;
  eventType?: string;
  object?: {
    id?: string;
    subscription?: string | { id: string } | null;
    metadata?: Record<string, string> | null;
    customer?: string | { id: string; email?: string } | null;
  };
}

const db = () => createAdminClient() as unknown as SupabaseClient;

/** El plan de un producto de Creem, por si una suscripción llega sin `metadata`. */
function planDeProducto(productId: string | null): PlanKey | null {
  if (!productId) return null;
  for (const p of Object.values(PLANS)) {
    if (p.creem && process.env[p.creem.productoEnv] === productId) return p.key;
  }
  return null;
}

/**
 * Pone `subscriptions` y `profiles` al día con lo que dice Creem de una
 * suscripción. Siempre relee la suscripción por API (no se fía del payload) y
 * es idempotente: Creem puede mandar el mismo evento varias veces.
 */
async function sincronizar(subId: string, pista: { userId?: string; planKey?: string }) {
  const sub = await getSuscripcion(subId);
  const admin = db();

  const { data: fila } = await admin
    .from('subscriptions')
    .select('id, user_id, plan_key')
    .eq('creem_subscription_id', subId)
    .maybeSingle<{ id: string; user_id: string; plan_key: string }>();

  const userId = fila?.user_id ?? sub.metadata?.user_id ?? pista.userId;
  const planCrudo = fila?.plan_key ?? sub.metadata?.plan_key ?? pista.planKey ?? planDeProducto(idDe(sub.product));
  if (!userId || !planCrudo || !isPlanKey(planCrudo)) {
    console.error('[creem webhook] suscripción sin usuario o plan reconocible', subId);
    return;
  }
  const plan = PLANS[planCrudo];
  const estado = estadoPropio(sub.status);
  const fin = sub.current_period_end_date ? new Date(sub.current_period_end_date) : null;
  const cliente = typeof sub.customer === 'object' ? sub.customer : null;

  const datos = {
    status: estado,
    next_payment_date: fin?.toISOString() ?? null,
    creem_customer_id: idDe(sub.customer),
    creem_product_id: idDe(sub.product),
    ...(cliente?.email ? { payer_email: cliente.email } : {}),
  };
  if (fila) {
    const { error } = await admin.from('subscriptions').update(datos).eq('id', fila.id);
    if (error) throw new Error(`update subscriptions: ${error.message}`);
  } else {
    const { error } = await admin.from('subscriptions').insert({
      ...datos,
      user_id: userId,
      proveedor: 'creem',
      creem_subscription_id: subId,
      plan_key: plan.key,
      amount: plan.creem?.usd ?? plan.amount,
      currency: 'USD',
    });
    // Dos entregas del mismo evento a la vez: la otra ya insertó la fila.
    if (error && error.code !== '23505') throw new Error(`insert subscriptions: ${error.message}`);
  }

  // Acceso: mientras Creem la dé por pagada, hasta el fin del periodo. Si la
  // canceló o falló el cobro, no se toca: el acceso pagado vence solo.
  const pagada = sub.status === 'active' || sub.status === 'trialing' || sub.status === 'scheduled_cancel';
  if (pagada && fin && fin.getTime() > Date.now()) {
    const { error } = await admin
      .from('profiles')
      .update({ plan: plan.key, plan_expires_at: fin.toISOString() })
      .eq('id', userId);
    if (error) throw new Error(`update profiles: ${error.message}`);
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/estudio', 'layout');
  }
}

export async function POST(req: Request) {
  const cuerpo = await req.text();
  const firma = firmaValida(cuerpo, req.headers.get('creem-signature'));
  if (!firma.ok) return NextResponse.json({ error: 'invalid signature', motivo: firma.motivo }, { status: 401 });

  let evento: Evento;
  try {
    evento = JSON.parse(cuerpo);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const tipo = evento.eventType ?? '';
  const obj = evento.object ?? {};
  let subId: string | null = null;
  if (tipo === 'checkout.completed') subId = idDe(obj.subscription ?? null);
  else if (tipo.startsWith('subscription.')) subId = obj.id ?? null;
  else {
    // Reembolsos y disputas: Creem los gestiona; aquí solo quedan en el log.
    if (tipo === 'refund.created' || tipo === 'dispute.created') console.warn('[creem webhook]', tipo, evento.id);
    return NextResponse.json({ ok: true, ignorado: tipo });
  }
  if (!subId) return NextResponse.json({ ok: true, ignorado: 'sin suscripción' });

  try {
    await sincronizar(subId, { userId: obj.metadata?.user_id, planKey: obj.metadata?.plan_key });
  } catch (err) {
    console.error('[creem webhook]', tipo, subId, err);
    // 404: la suscripción no existe (no se arreglará reintentando). Lo demás, 500 para que Creem reintente.
    if (err instanceof CreemError && err.status === 404) return NextResponse.json({ ok: true, ignorado: 'no existe' });
    return NextResponse.json({ error: 'sync_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
