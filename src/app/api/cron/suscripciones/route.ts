import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { reconciliarSuscripcionesMp } from '@/lib/mp-reconciliar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Revisión diaria de suscripciones de Mercado Pago (cron de `vercel.json`).
 * Vercel manda `Authorization: Bearer $CRON_SECRET`. Con `?ver=1` sólo informa
 * de lo que cambiaría, sin escribir.
 */
export async function GET(req: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) return NextResponse.json({ error: 'CRON_SECRET missing' }, { status: 500 });
  // Comparación en tiempo constante: `!==` corta en el primer carácter
  // distinto y, en teoría, deja adivinar el secreto midiendo tiempos.
  const dado = Buffer.from(req.headers.get('authorization') ?? '');
  const esperado = Buffer.from(`Bearer ${secreto}`);
  if (dado.length !== esperado.length || !timingSafeEqual(dado, esperado)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const soloVer = new URL(req.url).searchParams.get('ver') === '1';
  const res = await reconciliarSuscripcionesMp({ soloVer });

  if (res.cambios.length) {
    console.warn('[cron suscripciones] acceso pagado sin reflejar, corregido:', JSON.stringify(res.cambios));
    if (!soloVer) revalidatePath('/dashboard', 'layout');
  }
  if (res.errores.length) console.error('[cron suscripciones] errores:', JSON.stringify(res.errores));

  return NextResponse.json({ soloVer, ...res });
}
