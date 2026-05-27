import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { DEVICE_COOKIE } from '@/lib/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Salida controlada cuando el device del usuario aparece como `revoked` en
 * checkDevice. Sin este flujo, dashboard/layout solo hacía signOut + redirect,
 * pero la cookie `device_id` sobrevivía y al volver a iniciar sesión el
 * mismo browser caía otra vez en `revoked` (loop infinito).
 *
 * Aquí: invalidamos el cache de sesiones, cerramos sesión Supabase, borramos
 * la cookie device_id (el middleware genera una nueva en el próximo request)
 * y mandamos al login con un flash de motivo.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) revalidateTag(`user-sessions:${user.id}`, { expire: 0 });
  await supabase.auth.signOut();

  const url = new URL('/auth/login?error=device_revoked', req.url);
  const res = NextResponse.redirect(url);
  res.cookies.delete(DEVICE_COOKIE);
  return res;
}
