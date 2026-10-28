import { NextResponse } from 'next/server';
import { pasarelaDePais } from '@/lib/pasarela';

export const dynamic = 'force-dynamic';

/**
 * País del visitante (por IP, cabecera de Vercel) y la pasarela que le toca.
 * Sin Creem configurado (clave y productos en Vercel), todos van a Mercado
 * Pago: mejor eso que un modal de Creem que no puede cobrar.
 */
export function GET(req: Request) {
  const pais = req.headers.get('x-vercel-ip-country');
  const creemListo = !!process.env.CREEM_API_KEY && !!process.env.CREEM_PRODUCT_VISITANTE_ID;
  return NextResponse.json(
    { pais: pais ?? null, pasarela: creemListo ? pasarelaDePais(pais) : 'mercadopago' },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
