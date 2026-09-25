import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import { labEsGratis, requiredPlanDeLab, tieneAccesoA } from '@/lib/acceso';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Las simulaciones autocontenidas (HTML + Three.js) que embeben los laboratorios
 * de Hematología. Vivían en `public/`, así que cualquiera sin cuenta abría
 * `/simulaciones/frotis-sanguineo.html`: el candado del laboratorio sólo cubría
 * la página que las enmarca.
 *
 * Se sirven desde la MISMA URL de antes a propósito: sus imágenes se piden con
 * rutas relativas (`./frotis-img/…`, `microscopio-hematologia-img/…`) que siguen
 * en `public/simulaciones/`, y así resuelven igual sin tocar el HTML.
 *
 * Las rutas de lectura son literales (y no `path.join` con el nombre pedido)
 * para que el trazado de archivos del build las incluya en la función.
 */
const SIMULACIONES: Record<string, { lab: string; leer: () => Promise<string> }> = {
  'frotis-sanguineo.html': {
    lab: 'frotis-sanguineo',
    leer: () => readFile(path.join(process.cwd(), 'src/simulaciones/frotis-sanguineo.html'), 'utf8'),
  },
  'microscopio-hematologia.html': {
    lab: 'microscopio-hematologia',
    leer: () => readFile(path.join(process.cwd(), 'src/simulaciones/microscopio-hematologia.html'), 'utf8'),
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ archivo: string }> },
) {
  const { archivo } = await params;
  const sim = Object.hasOwn(SIMULACIONES, archivo) ? SIMULACIONES[archivo] : null;
  if (!sim) return new NextResponse('Not found', { status: 404 });

  if (!labEsGratis(sim.lab)) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });
    const planState = await getCachedPlanState();
    if (!tieneAccesoA(planState, requiredPlanDeLab(sim.lab))) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const html = await sim.leer();
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Depende del plan de quien la pide: nunca en la caché compartida.
      'Cache-Control': 'private, no-cache',
    },
  });
}
