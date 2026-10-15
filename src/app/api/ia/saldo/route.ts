import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { accesoIA, leerSaldo } from '@/lib/ia/saldo';
import { clienteIA } from '@/lib/ia/cliente';
import { creditosTipicos } from '@/lib/ia/costos';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lo que el panel necesita antes de la primera pregunta: si puede usar la IA,
 * su saldo y el precio orientativo de cada acción. Sin acceso responde 200
 * con el motivo (es un estado de la interfaz, no un error).
 */
export async function GET() {
  const acceso = await accesoIA(await createClient());
  if (!acceso.ok) {
    return NextResponse.json({ disponible: false, motivo: acceso.motivo }, { headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json(
    {
      disponible: true,
      configurada: clienteIA() !== null,
      saldo: await leerSaldo(acceso.userId, acceso.cuota),
      precios: creditosTipicos(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
