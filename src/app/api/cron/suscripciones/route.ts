import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { reconciliarSuscripcionesMp } from '@/lib/mp-reconciliar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/** No empieza revisiones nuevas pasado este tiempo (`maxDuration` - 60 s). */
const PRESUPUESTO_MS = 240_000;

/**
 * Revisión diaria de suscripciones de Mercado Pago (cron de `vercel.json`).
 * Vercel manda `Authorization: Bearer $CRON_SECRET`. Solo revisa a los alumnos
 * vencidos con suscripción viva. `?ver=1` solo informa, sin escribir;
 * `?todas=1` revisa todas las vivas (auditoría).
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

  const params = new URL(req.url).searchParams;
  const soloVer = params.get('ver') === '1';
  const todas = params.get('todas') === '1';
  const inicio = Date.now();
  // Deja margen sobre `maxDuration`: lo que no dé tiempo sale en `pendientes`.
  const res = await reconciliarSuscripcionesMp({ soloVer, todas, hastaMs: inicio + PRESUPUESTO_MS });
  const ms = Date.now() - inicio;

  if (res.pendientes) {
    console.error(`[cron suscripciones] sin tiempo para ${res.pendientes} (revisadas ${res.revisadas} en ${ms} ms)`);
  }
  if (res.cambios.length) {
    console.warn('[cron suscripciones] acceso pagado sin reflejar, corregido:', JSON.stringify(res.cambios));
    if (!soloVer) revalidatePath('/dashboard', 'layout');
  }
  if (res.errores.length) console.error('[cron suscripciones] errores:', JSON.stringify(res.errores));

  return NextResponse.json({ soloVer, todas, ms, ...res });
}
