import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPreapproval, verifyWebhookSignature } from '@/lib/mercadopago';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface MpWebhookPayload {
  type?: string;
  action?: string;
  data?: { id?: string };
}

export async function POST(req: Request) {
  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');

  let payload: MpWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const dataId = payload?.data?.id ?? null;

  const sig = verifyWebhookSignature({ xSignature, xRequestId, dataId });
  if (!sig.ok) {
    console.warn('[mp webhook] signature reject:', sig.reason);
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const type = payload?.type ?? '';
  // Solo procesamos subscription_preapproval. El evento subscription_authorized_payment
  // lleva el payment ID (numérico) en data.id, no el preapproval ID; intentar
  // getPreapproval(paymentId) devuelve 404 → 502 → MP reintenta sin fin.
  // subscription_preapproval cubre todos los cambios de estado que necesitamos
  // (authorized, paused, cancelled) incluyendo cobros recurrentes exitosos.
  if (type !== 'subscription_preapproval') {
    return NextResponse.json({ ok: true, ignored: type });
  }

  if (!dataId) return NextResponse.json({ ok: true, ignored: 'no data.id' });

  let preapproval;
  try {
    preapproval = await getPreapproval(dataId);
  } catch (err) {
    console.error('[mp webhook] fetch preapproval failed', err);
    return NextResponse.json({ error: 'mp fetch failed' }, { status: 502 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, user_id, plan_key, next_payment_date')
    .eq('mp_preapproval_id', preapproval.id)
    .maybeSingle<{ id: string; user_id: string; plan_key: string; next_payment_date: string | null }>();

  const nowMs = Date.now();
  // Same defensive logic that /create uses: solo aceptamos next_payment_date de MP
  // si está al menos 1 hora en el futuro. Si no, conservamos el valor actual del
  // row (calculado al crear como now+30d) para no expirar la sub anticipadamente.
  const mpNpd = preapproval.next_payment_date ? new Date(preapproval.next_payment_date) : null;
  const mpNpdValid = mpNpd && mpNpd.getTime() > nowMs + 60 * 60 * 1000;
  const nextPaymentIso = mpNpdValid
    ? mpNpd.toISOString()
    : (existing?.next_payment_date ?? null);

  if (existing) {
    const subsTable = admin.from('subscriptions') as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: unknown }>;
      };
    };
    const updatePayload: Record<string, unknown> = { status: preapproval.status };
    if (mpNpdValid) updatePayload.next_payment_date = nextPaymentIso;
    await subsTable.update(updatePayload).eq('id', existing.id);

    if (preapproval.status === 'authorized' && nextPaymentIso) {
      const profilesTable = admin.from('profiles') as unknown as {
        update: (row: Record<string, unknown>) => {
          eq: (col: string, val: string) => Promise<{ error: unknown }>;
        };
      };
      await profilesTable
        .update({ plan: existing.plan_key, plan_expires_at: nextPaymentIso })
        .eq('id', existing.user_id);
      // El plan acaba de pasar a 'authorized' (puede ser una autorización tardía
      // tras un pending). Invalidamos el árbol /dashboard para que el próximo
      // render del usuario refleje el plan nuevo.
      revalidatePath('/dashboard', 'layout');
    }
    // paused / cancelled: no profile change. Access lapses via plan_expires_at.
  } else {
    console.warn('[mp webhook] preapproval not in DB, ignoring', preapproval.id);
  }

  return NextResponse.json({ ok: true });
}
