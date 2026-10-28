import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPlanKey, PLANS } from '@/lib/plans';
import { bloqueoDeCompra } from '@/lib/suscripciones-server';
import { crearCheckout } from '@/lib/creem';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Abre el checkout de Creem (pagos de fuera del Perú) para un plan nuevo y
 * devuelve la URL a la que redirigir. El alta de verdad la hace el webhook
 * (`api/webhooks/creem`) cuando Creem confirma el pago: aquí solo se arma el
 * pedido, con el usuario y el plan en `metadata` para reconocerlo después.
 */
export async function POST(req: Request) {
  const { planKey, volverA } = (await req.json().catch(() => ({}))) as { planKey?: string; volverA?: string };
  if (!planKey || !isPlanKey(planKey)) return NextResponse.json({ error: 'invalid plan' }, { status: 400 });
  const plan = PLANS[planKey];
  if (!plan.aLaVenta || !plan.creem) return NextResponse.json({ error: 'not_for_sale' }, { status: 400 });
  const productId = process.env[plan.creem.productoEnv];
  if (!productId || !process.env.CREEM_API_KEY) {
    return NextResponse.json({ error: 'creem_no_configurado' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const bloqueo = await bloqueoDeCompra(createAdminClient(), user.id);
  if (bloqueo) return bloqueo;

  // Vuelve a donde pagó (solo rutas internas), con la marca para el aviso de bienvenida.
  const origen = new URL(req.url).origin;
  const destino = typeof volverA === 'string' && volverA.startsWith('/') && !volverA.startsWith('//') ? volverA : '/estudio';
  const exito = new URL(destino, origen);
  exito.searchParams.set('pago', 'creem');

  try {
    const checkout = await crearCheckout({
      product_id: productId,
      request_id: `${user.id}:${planKey}:${Date.now()}`,
      customer: { email: user.email },
      success_url: exito.toString(),
      metadata: { user_id: user.id, plan_key: planKey },
    });
    return NextResponse.json({ url: checkout.checkout_url });
  } catch (err) {
    console.error('[creem/checkout]', err);
    return NextResponse.json({ error: 'creem_error' }, { status: 502 });
  }
}
