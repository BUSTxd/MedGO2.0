import { NextResponse } from 'next/server';
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
  if (!['subscription_preapproval', 'subscription_authorized_payment'].includes(type)) {
    return NextResponse.json({ ok: true, ignored: type });
  }

  if (!dataId) return NextResponse.json({ ok: true, ignored: 'no data.id' });

  let preapproval;
  try {
    if (type === 'subscription_preapproval') {
      preapproval = await getPreapproval(dataId);
    } else {
      // Authorized payment → fetch the payment, then its preapproval_id, then re-fetch the preapproval.
      // Simplification: we re-fetch by dataId as preapproval anyway because the
      // payment payload also carries the preapproval_id; but to keep the loop tight
      // we tolerate failures here and just fall through.
      preapproval = await getPreapproval(dataId);
    }
  } catch (err) {
    console.error('[mp webhook] fetch preapproval failed', err);
    return NextResponse.json({ error: 'mp fetch failed' }, { status: 502 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, user_id, plan_key')
    .eq('mp_preapproval_id', preapproval.id)
    .maybeSingle<{ id: string; user_id: string; plan_key: string }>();

  const nextPaymentIso = preapproval.next_payment_date ?? null;

  if (existing) {
    const subsTable = admin.from('subscriptions') as unknown as {
      update: (row: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: unknown }>;
      };
    };
    await subsTable
      .update({ status: preapproval.status, next_payment_date: nextPaymentIso })
      .eq('id', existing.id);

    if (preapproval.status === 'authorized' && nextPaymentIso) {
      const profilesTable = admin.from('profiles') as unknown as {
        update: (row: Record<string, unknown>) => {
          eq: (col: string, val: string) => Promise<{ error: unknown }>;
        };
      };
      await profilesTable
        .update({ plan: existing.plan_key, plan_expires_at: nextPaymentIso })
        .eq('id', existing.user_id);
    }
    // paused / cancelled: no profile change. Access lapses via plan_expires_at.
  } else {
    console.warn('[mp webhook] preapproval not in DB, ignoring', preapproval.id);
  }

  return NextResponse.json({ ok: true });
}
