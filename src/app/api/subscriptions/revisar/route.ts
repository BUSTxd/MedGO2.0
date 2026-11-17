import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { reconciliarSuscripcionesMp } from '@/lib/mp-reconciliar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Una revisión cada tantos segundos por alumno (límite en la base). */
const CADA_SEGUNDOS = 30;
const TOPE_MS = 8000;

/**
 * Botón «Ya pagué, revisar» de Mi cuenta.
 *
 * Seguridad (ver docs/seguridad/revisar-pago.md):
 *  - No recibe ningún dato: el alumno sale de la sesión y solo se revisa SU
 *    suscripción. No hay id que manipular.
 *  - Solo alarga si Mercado Pago (leído con nuestro token) da la cuota por
 *    cobrada; pulsarlo no puede dar acceso sin pago.
 *  - Límite atómico en la base (`reclamar_revision_pago`), válido en todas las
 *    instancias y que el alumno no puede borrar (RLS sin políticas).
 *  - Rechaza peticiones de otro sitio (CSRF): no daría acceso, pero gastaría
 *    el cupo del alumno.
 *  - La respuesta no lleva datos de MP: solo un estado.
 */
export async function POST(req: Request) {
  const sitio = req.headers.get('sec-fetch-site');
  if (sitio && sitio !== 'same-origin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const origen = req.headers.get('origin');
  if (origen && origen !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const sinCache = { headers: { 'Cache-Control': 'no-store' } };

  const { data: concedida, error: errLimite } = await admin.rpc('reclamar_revision_pago', {
    p_user: user.id,
    p_segundos: CADA_SEGUNDOS,
  } as never);
  if (errLimite) {
    console.error('[revisar pago] límite', errLimite);
    return NextResponse.json({ estado: 'error' }, { status: 500, ...sinCache });
  }
  if (concedida !== true) {
    return NextResponse.json(
      { estado: 'espera', reintentarEn: CADA_SEGUNDOS },
      { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(CADA_SEGUNDOS) } },
    );
  }

  const { data: perfil } = await admin
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', user.id)
    .maybeSingle<{ plan: string | null; plan_expires_at: string | null }>();
  const vence = perfil?.plan_expires_at ? Date.parse(perfil.plan_expires_at) : 0;
  if (perfil?.plan && perfil.plan !== 'free' && vence > Date.now()) {
    return NextResponse.json({ estado: 'activo' }, sinCache);
  }

  try {
    const res = await Promise.race([
      reconciliarSuscripcionesMp({ userId: user.id }),
      new Promise<null>((r) => setTimeout(() => r(null), TOPE_MS)),
    ]);
    if (!res) return NextResponse.json({ estado: 'error' }, { status: 504, ...sinCache });
    if (res.revisadas === 0) return NextResponse.json({ estado: 'sin_suscripcion' }, sinCache);
    if (res.cambios.length) {
      console.warn('[revisar pago] acceso pagado sin reflejar, corregido a pedido:', JSON.stringify(res.cambios));
      revalidatePath('/dashboard', 'layout');
      return NextResponse.json({ estado: 'actualizado' }, sinCache);
    }
    if (res.errores.length) {
      console.error('[revisar pago] errores', JSON.stringify(res.errores));
      return NextResponse.json({ estado: 'error' }, { status: 502, ...sinCache });
    }
    return NextResponse.json({ estado: 'sin_pago' }, sinCache);
  } catch (err) {
    console.error('[revisar pago] falló', err);
    return NextResponse.json({ estado: 'error' }, { status: 500, ...sinCache });
  }
}
