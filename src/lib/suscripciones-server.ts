import 'server-only';
import { NextResponse } from 'next/server';
import type { createAdminClient } from '@/lib/supabase/admin';

/**
 * ¿Puede este usuario empezar una compra? La misma regla para Mercado Pago y
 * Creem: no si ya tiene una suscripción viva, ni si canceló pero su acceso
 * pagado sigue vigente (no se compra otro plan hasta que venza). Devuelve la
 * respuesta 409 que hay que mandar, o `null` si puede comprar.
 */
export async function bloqueoDeCompra(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<NextResponse | null> {
  const { data: existing } = await admin
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .in('status', ['authorized', 'pending'])
    .maybeSingle<{ id: string; status: string }>();
  if (existing) {
    return NextResponse.json({ error: 'already_subscribed', status: existing.status }, { status: 409 });
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', userId)
    .maybeSingle<{ plan: string | null; plan_expires_at: string | null }>();
  const expiresAt = profile?.plan_expires_at ?? null;
  if (profile?.plan && profile.plan !== 'free' && expiresAt && new Date(expiresAt).getTime() > Date.now()) {
    return NextResponse.json(
      { error: 'already_subscribed', reason: 'active_access', plan: profile.plan, expiresAt },
      { status: 409 },
    );
  }
  return null;
}
