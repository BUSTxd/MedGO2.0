import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getUserPlanState, type PlanKey } from '@/lib/plans';
import { requiredPlanDeCurso, tieneAccesoA } from '@/lib/acceso';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * `free` abre el examen a cualquier cuenta. Sin él, hace falta un plan activo
 * que abra `plan` o, si no se declara, el tramo del curso (primer segmento de
 * la clave): un plan de UFBI no abre un examen de la Facultad.
 */
const EXAMENES: Record<string, { free?: boolean; plan?: PlanKey }> = {
  'excretor/tbl-3-asa-henle': { free: true },
  'neurologia/snp-histologia': { free: true },
  'neurologia/snp-histologia-b': { free: true },
  'neurologia/snc-histologia': { free: true },
  'neurologia/snc-histologia-a3': { free: true },
  'neurologia/snc-histologia-c': { free: true },
  'neurologia/piel-histologia': { free: true },
  'neurologia/piel-histologia-a3': { free: true },
  'neurologia/piel-histologia-c': { free: true },
  'neurologia/piel-histologia-b': { free: true },
  'patologia/parcial-1': { free: true },
  // De pago aunque Patología sea un curso gratis: son el reclamo del plan. El
  // 2020 B queda abierto como el 2024, con el aviso de suscripción del runner.
  'patologia/parcial-1-2022': {},
  'patologia/parcial-1-2020': {},
  'patologia/parcial-1-2020-b': { free: true },
  // De pago como el resto de Inmunología: sin `free`, lo abre el plan del tramo.
  'inmunologia/final-2024-2': {},
  'inmunologia/final-2023': {},
  'inmunologia/final-2025': {},
  'inmunologia/extra-hemato': {},
  'inmunologia/extra-pato': {},
};

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ examKey: string[] }> },
) {
  const { examKey } = await params;
  const key = examKey.join('/');

  const meta = EXAMENES[key];
  if (!meta) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!meta.free) {
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    // Antes bastaba con que `profiles.plan` no fuera 'free': una suscripción
    // vencida o de otro tramo abría igual. `tieneAccesoA` exige plan activo del
    // tramo correcto y deja pasar al admin por `allAccess`.
    const estado = await getUserPlanState(supabase);
    const requerido = meta.plan ?? requiredPlanDeCurso(key.split('/')[0]);
    if (!tieneAccesoA(estado, requerido)) {
      return NextResponse.json({ error: 'plan_required', plan: requerido }, { status: 403 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('[examen] missing env vars');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const admin = createSupabaseAdmin(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.storage
    .from('examenes')
    .createSignedUrl(`${key}.json`, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('[examen] signed url error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;

  return NextResponse.json(
    { url: data.signedUrl, expiresAt },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
