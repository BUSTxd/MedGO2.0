import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getUserPlanState } from '@/lib/plans';
import { requiredPlanDeCurso, tieneAccesoA } from '@/lib/acceso';
import { EXAMENES } from '@/lib/data/examenes-acceso';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const requerido = meta.plan ?? requiredPlanDeCurso(key.split('/')[0]);

  // Sólo se resuelve si hace falta: un banqueo `free` sin muestra no consulta el plan.
  let conAcceso = true;
  if (!meta.free || meta.muestra) {
    conAcceso = user ? tieneAccesoA(await getUserPlanState(supabase), requerido) : false;
  }

  // Antes bastaba con que `profiles.plan` no fuera 'free': una suscripción
  // vencida o de otro tramo abría igual. `tieneAccesoA` exige plan activo del
  // tramo correcto y deja pasar al admin por `allAccess`.
  // Un banqueo con `muestra` no corta aquí: sigue y se entrega recortado, lo
  // mismo con sesión que sin ella.
  if (!meta.free && !meta.muestra && !conAcceso) {
    return user
      ? NextResponse.json({ error: 'plan_required', plan: requerido }, { status: 403 })
      : NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('[examen] missing env vars');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const admin = createSupabaseAdmin(url, serviceKey, { auth: { persistSession: false } });

  // Muestra: el archivo se lee aquí y se recorta antes de contestar, así el
  // navegador nunca recibe las preguntas que no le tocan.
  if (meta.muestra && !conAcceso) {
    const { data: blob, error: dlError } = await admin.storage.from('examenes').download(`${key}.json`);
    if (dlError || !blob) {
      console.error('[examen] download error:', dlError?.message);
      return NextResponse.json({ error: 'not_available' }, { status: 404 });
    }

    type PreguntaCruda = { variante?: unknown; explanation?: string; reviewNote?: string; image?: string; explanationImage?: string };
    const payload = JSON.parse(await blob.text()) as { questions?: PreguntaCruda[]; flashcards?: unknown[] };
    const todas = Array.isArray(payload.questions) ? payload.questions : [];
    const cuantas = (fn: (q: PreguntaCruda) => unknown) => todas.filter(q => !!fn(q)).length;
    const flash = Array.isArray(payload.flashcards) ? payload.flashcards : null;
    const flashCorte = Math.min(meta.muestraFlash ?? 0, flash?.length ?? 0);

    return NextResponse.json(
      {
        payload: {
          ...payload,
          questions: todas.slice(0, meta.muestra),
          ...(flash ? { flashcards: flash.slice(0, flashCorte) } : {}),
        },
        // Lo que hay detrás del corte se cuenta aquí: el cliente sólo recibe la
        // muestra y no podría saber qué trae el resto del banqueo.
        muestra: {
          mostradas: Math.min(meta.muestra, todas.length),
          total: todas.length,
          ...(flash ? { flashMostradas: flashCorte, flashTotal: flash.length } : {}),
          plan: requerido,
          variantes: cuantas(q => q.variante),
          conExplicacion: cuantas(q => q.explanation),
          conNota: cuantas(q => q.reviewNote),
          conImagen: cuantas(q => q.image),
          conLamina: cuantas(q => q.explanationImage),
        },
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  const { data, error } = await admin.storage
    .from('examenes')
    .createSignedUrl(`${key}.json`, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('[examen] signed url error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;

  // Con el plan, un banqueo con muestra llega entero pero dice dónde empezaba
  // lo premium: esas preguntas siguen pintándose en oro.
  return NextResponse.json(
    { url: data.signedUrl, expiresAt, ...(meta.muestra ? { premiumDesde: meta.muestra } : {}) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
