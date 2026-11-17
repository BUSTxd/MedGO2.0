import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  MpError,
  cuotaCobrada,
  getPreapproval,
  getAuthorizedPaymentConEspera,
  getPayment,
  verifyWebhookSignature,
  type AuthorizedPaymentResponse,
} from '@/lib/mercadopago';
import { PLANS, type PlanKey } from '@/lib/plans';
import { reconciliarSuscripcionesMp } from '@/lib/mp-reconciliar';

/**
 * Una notificación de un preapproval tan reciente que /create aún no insertó su
 * fila: se contesta con error para que MP la reenvíe, en vez de perderla. Pasado
 * este margen se acepta y se ignora, o un preapproval huérfano haría que MP
 * reintentara cada 15 min para siempre.
 */
const MARGEN_CARRERA_MS = 2 * 60 * 60 * 1000;

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
  if (!dataId) return NextResponse.json({ ok: true, ignored: 'no data.id' });

  if (type === 'payment') return avisoDePago(dataId);

  if (!['subscription_preapproval', 'subscription_authorized_payment'].includes(type)) {
    return NextResponse.json({ ok: true, ignored: type });
  }

  let preapproval;
  let cuota: AuthorizedPaymentResponse | null = null;
  try {
    if (type === 'subscription_authorized_payment') {
      // data.id es el payment ID (numérico), no el preapproval ID.
      // Primero buscamos el pago para obtener el preapproval_id real.
      cuota = await getAuthorizedPaymentConEspera(dataId);
      preapproval = await getPreapproval(cuota.preapproval_id);
    } else {
      preapproval = await getPreapproval(dataId);
    }
  } catch (err) {
    /*
     * El código HTTP decide qué contestar, y no es un detalle: MP reintenta
     * cada 15 minutos HASTA recibir un 200/201, indefinidamente.
     *
     * 404 — el recurso no existe y no va a existir. Devolver 502 aquí dejaba a
     * MP reenviando la misma notificación para siempre: en los logs salieron
     * cuatro intentos sobre `/authorized_payments/7031230226` con el mismo id,
     * y la cuenta iba a seguir recibiéndolos cada cuarto de hora. Se contesta
     * 200 para cortar el bucle, pero con un log al nivel de error: aceptar la
     * notificación no es lo mismo que haberla procesado, y si esto aparece de
     * forma recurrente hay un cobro que no se está sincronizando.
     *
     * Cualquier otro fallo (5xx de MP, corte de red) SÍ es transitorio y ahí
     * el 502 es lo correcto: que MP la reenvíe hasta que entre.
     */
    if (err instanceof MpError && err.status === 404) {
      console.error(
        '[mp webhook] recurso inexistente en MP tras reintentos — se acepta la ' +
        'notificación para no dejar a MP reintentando cada 15 min. ' +
        `type=${type} data.id=${dataId}`,
        err.message,
      );
      return NextResponse.json({ ok: true, ignored: 'mp 404' });
    }
    console.error('[mp webhook] fetch failed', err);
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

  if (!existing) {
    const creado = preapproval.date_created ? Date.parse(preapproval.date_created) : NaN;
    if (Number.isFinite(creado) && nowMs - creado < MARGEN_CARRERA_MS) {
      // Carrera con /create: la fila todavía no está. Un 409 hace que MP la reenvíe.
      console.warn('[mp webhook] preapproval aún sin fila, se pide reintento', preapproval.id);
      return NextResponse.json({ error: 'preapproval not yet in DB' }, { status: 409 });
    }
    console.warn('[mp webhook] preapproval not in DB, ignoring', preapproval.id);
    return NextResponse.json({ ok: true });
  }

  const subsTable = admin.from('subscriptions') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>;
    };
  };
  const updatePayload: Record<string, unknown> = { status: preapproval.status };
  if (mpNpdValid) updatePayload.next_payment_date = nextPaymentIso;
  await subsTable.update(updatePayload).eq('id', existing.id);

  const profilesTable = admin.from('profiles') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>;
    };
  };

  /*
   * El acceso lo da el COBRO, no la autorización. Una suscripción `authorized`
   * con una tarjeta sin fondos seguía `authorized` mientras MP reintentaba el
   * cobro, y cada notificación alargaba el plan hasta next_payment_date: un año
   * regalado en los anuales. Ahora:
   *   - notificación de cuota → cuenta sólo si ESA cuota tiene el pago approved;
   *   - notificación de suscripción → cuenta si MP registra alguna cuota cobrada.
   */
  const cobradas = preapproval.summarized?.charged_quantity ?? 0;
  // Solo un aviso de CUOTA puede dar acceso por sí mismo. Antes un aviso de
  // suscripción contaba con `charged_quantity > 0`, es decir, con cualquier
  // cuota cobrada alguna vez: alguien con la tarjeta rechazada este mes que
  // recibiera un aviso (p. ej. al cambiar la tarjeta) se llevaba el mes gratis.
  const pagado = cuota ? cuotaCobrada(cuota) : false;

  if (preapproval.status === 'authorized' && !cuota) {
    // Aviso de suscripción: que decida la revisión, que mira la ÚLTIMA cuota
    // cobrada y solo alarga lo que de verdad se pagó.
    const r = await reconciliarSuscripcionesMp({ userId: existing.user_id });
    if (r.cambios.length) revalidatePath('/dashboard', 'layout');
    if (r.errores.length) {
      console.error('[mp webhook] revisión tras aviso de suscripción, errores', JSON.stringify(r.errores));
      return NextResponse.json({ error: 'reconcile failed' }, { status: 502 });
    }
  } else if (preapproval.status === 'authorized' && pagado) {
    const plan = PLANS[existing.plan_key as PlanKey];
    const base = cuota?.debit_date ? Date.parse(cuota.debit_date) : nowMs;
    const vence = mpNpdValid
      ? mpNpd
      : plan
        ? new Date((Number.isFinite(base) ? base : nowMs) + plan.durationDays * 24 * 60 * 60 * 1000)
        : null;
    if (vence && vence.getTime() > nowMs) {
      await profilesTable
        .update({ plan: existing.plan_key, plan_expires_at: vence.toISOString() })
        .eq('id', existing.user_id);
      revalidatePath('/dashboard', 'layout');
    }
  } else if (
    (preapproval.status === 'cancelled' || preapproval.status === 'paused') &&
    cobradas === 0
  ) {
    // Nunca se cobró nada: se retira el acceso provisional que dio /create en
    // vez de esperar a que venza. Si hubo cobros, el acceso pagado sigue hasta
    // plan_expires_at como siempre. Sólo si es su suscripción más reciente: una
    // notificación atrasada de una vieja no puede apagar una nueva ya pagada.
    const { data: ultima } = await admin
      .from('subscriptions')
      .select('id')
      .eq('user_id', existing.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<{ id: string }>();
    if (ultima?.id === existing.id) {
      await profilesTable
        .update({ plan_expires_at: new Date(nowMs).toISOString() })
        .eq('id', existing.user_id);
      revalidatePath('/dashboard', 'layout');
    }
  }

  return NextResponse.json({ ok: true });
}

/**
 * Aviso `payment`: un cobro suelto, como el de una cuota fallida que el alumno
 * paga a mano desde su app. Antes se ignoraba y su acceso esperaba al cron.
 *
 * No se fía del pago para dar acceso: solo lo usa para saber de qué alumno es
 * y le pasa `reconciliarSuscripcionesMp`, que relee sus cuotas en MP y solo
 * alarga si hay una cobrada. Un aviso falso o reenviado no puede abrir nada.
 */
async function avisoDePago(paymentId: string) {
  let pago;
  try {
    pago = await getPayment(paymentId);
  } catch (err) {
    if (err instanceof MpError && err.status === 404) {
      return NextResponse.json({ ok: true, ignored: 'payment 404' });
    }
    console.error('[mp webhook] payment fetch failed', err);
    return NextResponse.json({ error: 'mp fetch failed' }, { status: 502 });
  }
  if (pago.status !== 'approved') return NextResponse.json({ ok: true, ignored: `payment ${pago.status}` });

  const admin = createAdminClient();
  const preId = pago.point_of_interaction?.transaction_data?.subscription_id ?? pago.metadata?.preapproval_id ?? null;

  let userId: string | null = null;
  if (preId) {
    const { data } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('mp_preapproval_id', preId)
      .maybeSingle<{ user_id: string }>();
    userId = data?.user_id ?? null;
  }
  if (!userId && pago.payer?.email) {
    // Respaldo por correo, con igualdad exacta (no `ilike`: un correo puede
    // llevar `*` o `%`, que harían de comodín). Aunque acertara con otro
    // alumno, solo le revisaría su propia suscripción: nunca le regala nada.
    const { data } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('proveedor', 'mercadopago')
      .eq('payer_email', pago.payer.email.trim().toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<{ user_id: string }>();
    userId = data?.user_id ?? null;
  }
  if (!userId) return NextResponse.json({ ok: true, ignored: 'payment sin suscripción' });

  const res = await reconciliarSuscripcionesMp({ userId });
  if (res.cambios.length) {
    console.warn('[mp webhook] pago suelto reflejado:', JSON.stringify(res.cambios));
    revalidatePath('/dashboard', 'layout');
  }
  if (res.errores.length) {
    // Fallo transitorio de MP: que reenvíe el aviso.
    console.error('[mp webhook] pago suelto, errores', JSON.stringify(res.errores));
    return NextResponse.json({ error: 'reconcile failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
