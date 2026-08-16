import { NextResponse } from 'next/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Only these IDs have an associated PDF in Supabase Storage
const ALLOWED = new Set([
  // Microbiología — Virología/Micología
  'clase-4', 'clase-5', 'clase-6', 'clase-6.2', 'clase-7', 'clase-8', 'clase-9', 'clase-10',
  'practica-1', 'practica-2', 'practica-3',
  // Microbiología — Parasitología
  'clase-12', 'clase-12.2',
  'clase-13', 'clase-13.2',
  'clase-14', 'clase-15', 'clase-16',
  'clase-17', 'clase-17.2',
  'clase-18',
  // Microbiología — Prácticas Parasitología/Artrópodos
  'practica-8', 'practica-9', 'practica-10',
  'practica-11', 'practica-12', 'practica-13',
  // Aparato Excretor
  'exc-tbl-3',
  // Farmacología (prefijo `far-` evita colisión con clase-* de Microbiología)
  'far-14', 'far-16', 'far-17', 'far-18',
  'far-19', 'far-19.2',
  'far-23', 'far-24', 'far-25',
  // Hematología (prefijo `hem-` evita colisión con clase-* de otros cursos)
  'hem-2', 'hem-3', 'hem-4', 'hem-5', 'hem-6',
  'hem-7', 'hem-8', 'hem-10', 'hem-11', 'hem-12',
  'hem-tbl-1', 'hem-sgp-1', 'hem-tbl-2', 'hem-sgp-3',
  'hem-sgp-2', 'hem-9',
  // Química Orgánica
  'qor-s-1-tablas', 'qor-s-1-visual',
  'qor-s-2', 'qor-s-3', 'qor-s-4', 'qor-s-4-visual', 'qor-s-5',
  'qor-s-6', 'qor-s-7', 'qor-s-8', 'qor-s-9', 'qor-s-10',
  'qor-s-11', 'qor-s-12', 'qor-s-13', 'qor-s-14',
  'qor-pd-1', 'qor-pd-2', 'qor-pd-3', 'qor-pd-4',
  'qor-pd-5', 'qor-pd-6', 'qor-pd-7', 'qor-pd-8',
  'qor-pc-1-2018', 'qor-pc-1-2019',
  'qor-pc-2-2018', 'qor-pc-2-2019',
  'qor-pc-3-2018', 'qor-pc-3-2019',
  'qor-pc-4-2018', 'qor-pc-4-2019',
  'qor-examen-parcial-1', 'qor-examen-parcial-2',
  'qor-examen-final-3-2018', 'qor-examen-final-4-2018',
  'qor-examen-final-3-2019', 'qor-examen-final-4-2019',
  'qor-lab-1', 'qor-lab-2', 'qor-lab-3', 'qor-lab-4',
  // Inmunología (ids bare tal como están en inmunologia.ts — sin colisión
  // actual con otros cursos; el path en Storage sí lleva prefijo inmunologia/)
  't-2', 't-3', 't-4', 't-5', 't-6', 't-7', 't-8', 't-9', 't-10',
  't-11', 't-12', 't-13', 't-14',
  'sgp-1', 'sgp-2', 'sgp-3', 'sgp-4',
  'tbl-1', 'tbl-2', 'tbl-3',
  // Física — 'fis-c-N-prop' es el PDF de propuestos (tarjeta «Propuestos»)
  'fis-c-1', 'fis-c-1-prop',
  'fis-c-2', 'fis-c-2-prop',
  'fis-c-3', 'fis-c-3-prop',
  'fis-c-4', 'fis-c-4-prop',
  'fis-c-5', 'fis-c-5-prop',
  'fis-c-6-mov', 'fis-c-6-ondas', 'fis-c-6-prop',
  'fis-c-7', 'fis-c-7-prop',
  'fis-c-8', 'fis-c-8-prop',
  'fis-c-9', 'fis-c-9-prop',
  'fis-c-10-potencial', 'fis-c-10-capacitancia', 'fis-c-10-prop',
  'fis-c-11', 'fis-c-11-prop',
  'fis-c-12', 'fis-c-12-prop',
  'fis-c-13', 'fis-c-13-prop',
  // Física — Examen final (banqueo con selector, ver `propuestos.opciones`).
  // ex03-2015/ex03-2019 (compilados de varios semestres en un solo PDF) se
  // reemplazaron por los 7 "Examen 3" sueltos de abajo — mismo contenido,
  // sin duplicar.
  'fis-examen-final-parte1', 'fis-examen-final-parte2',
  'fis-examen-final-banqueo',
  'fis-examen3-2015', 'fis-examen3-2016', 'fis-examen3-2017',
  'fis-examen3-2018v', 'fis-examen3-2018ii', 'fis-examen3-2019', 'fis-examen3-2020',
  // Física — PC1 (banqueo con selector, ver `propuestos.opciones`)
  'fis-pc1-banqueo', 'fis-pc1-v1', 'fis-pc1-7-9am', 'fis-pc1-10-12am',
  // Física — PC2/PC3/PC4 (banqueo con selector, ver `propuestos.opciones`)
  'fis-pc2-v1', 'fis-pc2-v2',
  'fis-pc3-v1', 'fis-pc3-v2',
  'fis-pc4-a', 'fis-pc4-b', 'fis-pc4-c',
  // Física — Examen I (banqueo con selector, ver `propuestos.opciones`)
  'fis-examen1-7-9am', 'fis-examen1-17-19', 'fis-examen1-banqueo',
  // Física — Examen parcial (un solo PDF, sin selector)
  'fis-examen-parcial-prop',
  // Física — Examen II (banqueo con selector, ver `propuestos.opciones`)
  'fis-examen2-v1', 'fis-examen2-2020', 'fis-examen2-2018', 'fis-examen2-v2',
  'fis-examen2-sol', 'fis-examen2-2017-sol',
  // Biología Celular — Teorías Te1-Te7
  'bcm-te-1', 'bcm-te-2', 'bcm-te-3', 'bcm-te-4',
  'bcm-te-5', 'bcm-te-6', 'bcm-te-7',
  // Biología Celular — Laboratorios PL1-PL5, PL7-PL9 (falta PL6 y PL10)
  'bcm-pl-1', 'bcm-pl-2', 'bcm-pl-3', 'bcm-pl-4', 'bcm-pl-5',
  'bcm-pl-7', 'bcm-pl-8', 'bcm-pl-9',
  // Aparato Locomotor (prefijo `loc-` evita colisión con tbl-1/tbl-2 de otros cursos)
  'loc-tbl-1', 'loc-tbl-2',
  // Digestivo — Histología (prefijo `dig-` evita colisión con laminas-N/histo-N
  // de Endocrino y Locomotor). Sólo 3 archivos: dig-histo-4 reutiliza estos
  // mismos 3 vía picker, no tiene PDF propio.
  'dig-histo-1', 'dig-histo-2', 'dig-histo-3',
]);

// IDs that require an active paid plan (Interno/Residente). Free-plan users
// get 403 before any signed URL is generated — zero Supabase egress for them.
const REQUIRES_PAID_PLAN = new Set([
  'practica-8', 'practica-9', 'practica-10',
  'practica-11', 'practica-12', 'practica-13',
]);

// Some IDs share a single PDF file in storage, or need a path prefix (carpeta/)
const FILE_ALIAS: Record<string, string> = {
  'practica-2':  'practica-2-3',
  'practica-3':  'practica-2-3',
  'exc-tbl-3':   'excretor/tbl-3-asa-henle',
  // Parasitología — todos en subcarpeta
  'clase-12':    'parasitologia/clase-12',
  'clase-12.2':  'parasitologia/clase-12.2',
  'clase-13':    'parasitologia/clase-13',
  'clase-13.2':  'parasitologia/clase-13.2',
  'clase-14':    'parasitologia/clase-14',
  'clase-15':    'parasitologia/clase-15',
  'clase-16':    'parasitologia/clase-16',
  'clase-17':    'parasitologia/clase-17',
  'clase-17.2':  'parasitologia/clase-17.2',
  'clase-18':    'parasitologia/clase-18',
  // Prácticas Parasitología/Artrópodos
  'practica-8':  'parasitologia/practica-8',
  'practica-9':  'parasitologia/practica-9',
  'practica-10': 'parasitologia/practica-10',
  'practica-11': 'parasitologia/practica-11',
  'practica-12': 'parasitologia/practica-12',
  'practica-13': 'parasitologia/practica-13',
  // Farmacología — subcarpeta farmacologia/. .v2 fix de imágenes blancas:
  // el compresor antiguo dejaba /Filter como JPXDecode tras reemplazar bytes con
  // JPEG → pdfjs renderizaba garbage. .v2 se generó con page.replace_image() que
  // actualiza filter/colorspace correctamente. Path nuevo invalida el cache
  // immutable instantáneamente para todos los usuarios.
  'far-14':   'farmacologia/clase-14.v2',
  'far-16':   'farmacologia/clase-16.v2',
  'far-17':   'farmacologia/clase-17.v2',
  'far-18':   'farmacologia/clase-18.v2',
  'far-19':   'farmacologia/clase-19.v2',
  'far-19.2': 'farmacologia/clase-19.2.v2',
  'far-23':   'farmacologia/clase-23.v2',
  'far-24':   'farmacologia/clase-24.v2',
  'far-25':   'farmacologia/clase-25.v2',
  // Hematología — subcarpeta hematologia/
  'hem-2':    'hematologia/clase-2',
  'hem-3':    'hematologia/clase-3',
  'hem-4':    'hematologia/clase-4',
  'hem-5':    'hematologia/clase-5',
  'hem-6':    'hematologia/clase-6',
  'hem-7':    'hematologia/clase-7',
  'hem-8':    'hematologia/clase-8',
  'hem-10':   'hematologia/clase-10',
  'hem-11':   'hematologia/clase-11',
  'hem-12':   'hematologia/clase-12',
  'hem-tbl-1': 'hematologia/tbl-1',
  'hem-sgp-1': 'hematologia/sgp-1',
  'hem-tbl-2': 'hematologia/tbl-2',
  'hem-sgp-3': 'hematologia/sgp-3',
  'hem-sgp-2': 'hematologia/sgp-2',
  'hem-9':     'hematologia/clase-9',
  // Química Orgánica — subcarpeta quimica-organica/
  'qor-s-1-tablas': 'quimica-organica/qor-s-1-tablas',
  'qor-s-1-visual': 'quimica-organica/qor-s-1-visual',
  'qor-s-2':  'quimica-organica/qor-s-2',
  'qor-s-3':  'quimica-organica/qor-s-3',
  'qor-s-4':  'quimica-organica/qor-s-4',
  'qor-s-4-visual': 'quimica-organica/qor-s-4-visual',
  'qor-s-5':  'quimica-organica/qor-s-5',
  'qor-s-6':  'quimica-organica/qor-s-6',
  'qor-s-7':  'quimica-organica/qor-s-7',
  'qor-s-8':  'quimica-organica/qor-s-8',
  'qor-s-9':  'quimica-organica/qor-s-9',
  'qor-s-10': 'quimica-organica/qor-s-10',
  'qor-s-11': 'quimica-organica/qor-s-11',
  'qor-s-12': 'quimica-organica/qor-s-12',
  'qor-s-13': 'quimica-organica/qor-s-13',
  'qor-s-14': 'quimica-organica/qor-s-14',
  'qor-pd-1': 'quimica-organica/qor-pd-1',
  'qor-pd-2': 'quimica-organica/qor-pd-2',
  'qor-pd-3': 'quimica-organica/qor-pd-3',
  'qor-pd-4': 'quimica-organica/qor-pd-4',
  'qor-pd-5': 'quimica-organica/qor-pd-5',
  'qor-pd-6': 'quimica-organica/qor-pd-6',
  'qor-pd-7': 'quimica-organica/qor-pd-7',
  'qor-pd-8': 'quimica-organica/qor-pd-8',
  'qor-pc-1-2018': 'quimica-organica/qor-pc-1-2018',
  'qor-pc-1-2019': 'quimica-organica/qor-pc-1-2019',
  'qor-pc-2-2018': 'quimica-organica/qor-pc-2-2018',
  'qor-pc-2-2019': 'quimica-organica/qor-pc-2-2019',
  'qor-pc-3-2018': 'quimica-organica/qor-pc-3-2018',
  'qor-pc-3-2019': 'quimica-organica/qor-pc-3-2019',
  'qor-pc-4-2018': 'quimica-organica/qor-pc-4-2018',
  'qor-pc-4-2019': 'quimica-organica/qor-pc-4-2019',
  'qor-examen-parcial-1': 'quimica-organica/qor-examen-parcial-1',
  'qor-examen-parcial-2': 'quimica-organica/qor-examen-parcial-2',
  'qor-examen-final-3-2018': 'quimica-organica/qor-examen-final-3-2018',
  'qor-examen-final-4-2018': 'quimica-organica/qor-examen-final-4-2018',
  'qor-examen-final-3-2019': 'quimica-organica/qor-examen-final-3-2019',
  'qor-examen-final-4-2019': 'quimica-organica/qor-examen-final-4-2019',
  'qor-lab-1': 'quimica-organica/qor-lab-1',
  'qor-lab-2': 'quimica-organica/qor-lab-2',
  'qor-lab-3': 'quimica-organica/qor-lab-3',
  'qor-lab-4': 'quimica-organica/qor-lab-4',
  // Inmunología — subcarpeta inmunologia/
  't-2':   'inmunologia/t-2',
  't-3':   'inmunologia/t-3',
  't-4':   'inmunologia/t-4',
  't-5':   'inmunologia/t-5',
  't-6':   'inmunologia/t-6',
  't-7':   'inmunologia/t-7',
  't-8':   'inmunologia/t-8',
  't-9':   'inmunologia/t-9',
  't-10':  'inmunologia/t-10',
  't-11':  'inmunologia/t-11',
  't-12':  'inmunologia/t-12',
  't-13':  'inmunologia/t-13',
  't-14':  'inmunologia/t-14',
  'sgp-1': 'inmunologia/sgp-1',
  'sgp-2': 'inmunologia/sgp-2',
  'sgp-3': 'inmunologia/sgp-3',
  'sgp-4': 'inmunologia/sgp-4',
  'tbl-1': 'inmunologia/tbl-1',
  'tbl-2': 'inmunologia/tbl-2',
  'tbl-3': 'inmunologia/tbl-3',
  // Física — subcarpeta fisica-medicina/
  'fis-c-1':      'fisica-medicina/fis-c-1',
  'fis-c-1-prop': 'fisica-medicina/fis-c-1-propuestos',
  'fis-c-2':      'fisica-medicina/fis-c-2',
  'fis-c-2-prop': 'fisica-medicina/fis-c-2-propuestos',
  'fis-c-3':      'fisica-medicina/fis-c-3',
  'fis-c-3-prop': 'fisica-medicina/fis-c-3-propuestos',
  'fis-c-4':      'fisica-medicina/fis-c-4',
  'fis-c-4-prop': 'fisica-medicina/fis-c-4-propuestos',
  'fis-c-5':      'fisica-medicina/fis-c-5',
  'fis-c-5-prop': 'fisica-medicina/fis-c-5-propuestos',
  'fis-c-6-mov':   'fisica-medicina/fis-c-6-mov',
  'fis-c-6-ondas': 'fisica-medicina/fis-c-6-ondas',
  'fis-c-6-prop':  'fisica-medicina/fis-c-6-propuestos',
  'fis-c-7':      'fisica-medicina/fis-c-7',
  'fis-c-7-prop': 'fisica-medicina/fis-c-7-propuestos',
  'fis-c-8':      'fisica-medicina/fis-c-8',
  'fis-c-8-prop': 'fisica-medicina/fis-c-8-propuestos',
  'fis-c-9':      'fisica-medicina/fis-c-9',
  'fis-c-9-prop': 'fisica-medicina/fis-c-9-propuestos',
  'fis-c-10-potencial':    'fisica-medicina/fis-c-10-potencial',
  'fis-c-10-capacitancia': 'fisica-medicina/fis-c-10-capacitancia',
  'fis-c-10-prop':         'fisica-medicina/fis-c-10-propuestos',
  'fis-c-11':      'fisica-medicina/fis-c-11',
  // .v2: PDF actualizado (agosto 2026). Path nuevo para invalidar el cache
  // immutable del CDN — mismo criterio que farmacología (ver comentario arriba).
  'fis-c-11-prop': 'fisica-medicina/fis-c-11-propuestos.v2',
  'fis-c-12':      'fisica-medicina/fis-c-12',
  'fis-c-12-prop': 'fisica-medicina/fis-c-12-propuestos.v2',
  'fis-c-13':      'fisica-medicina/fis-c-13',
  'fis-c-13-prop': 'fisica-medicina/fis-c-13-propuestos',
  'fis-examen-final-parte1':    'fisica-medicina/fis-examen-final-parte1',
  'fis-examen-final-parte2':    'fisica-medicina/fis-examen-final-parte2',
  'fis-examen-final-banqueo':   'fisica-medicina/fis-examen-final-banqueo',
  // "Examen 3" antiguo (electrostática + circuitos + magnetismo, sin óptica/
  // física moderna) — sueltos por semestre, reemplazan a los compilados
  // ex03-2015/ex03-2019 que se borraron del bucket.
  'fis-examen3-2015':   'fisica-medicina/fis-examen3-2015',
  'fis-examen3-2016':   'fisica-medicina/fis-examen3-2016',
  'fis-examen3-2017':   'fisica-medicina/fis-examen3-2017',
  'fis-examen3-2018v':  'fisica-medicina/fis-examen3-2018v',
  'fis-examen3-2018ii': 'fisica-medicina/fis-examen3-2018ii',
  'fis-examen3-2019':   'fisica-medicina/fis-examen3-2019',
  'fis-examen3-2020':   'fisica-medicina/fis-examen3-2020',
  'fis-pc1-banqueo':  'fisica-medicina/fis-pc1-banqueo',
  'fis-pc1-v1':       'fisica-medicina/fis-pc1-v1',
  'fis-pc1-7-9am':    'fisica-medicina/fis-pc1-7-9am',
  'fis-pc1-10-12am':  'fisica-medicina/fis-pc1-10-12am',
  'fis-pc2-v1': 'fisica-medicina/fis-pc2-v1',
  'fis-pc2-v2': 'fisica-medicina/fis-pc2-v2',
  'fis-pc3-v1': 'fisica-medicina/fis-pc3-v1',
  'fis-pc3-v2': 'fisica-medicina/fis-pc3-v2',
  'fis-pc4-a':  'fisica-medicina/fis-pc4-a',
  'fis-pc4-b':  'fisica-medicina/fis-pc4-b',
  'fis-pc4-c':  'fisica-medicina/fis-pc4-c',
  'fis-examen1-7-9am':   'fisica-medicina/fis-examen1-7-9am',
  'fis-examen1-17-19':   'fisica-medicina/fis-examen1-17-19',
  'fis-examen1-banqueo': 'fisica-medicina/fis-examen1-banqueo',
  'fis-examen-parcial-prop': 'fisica-medicina/fis-examen-parcial-prop',
  'fis-examen2-v1':        'fisica-medicina/fis-examen2-v1',
  'fis-examen2-2020':      'fisica-medicina/fis-examen2-2020',
  'fis-examen2-2018':      'fisica-medicina/fis-examen2-2018',
  'fis-examen2-v2':        'fisica-medicina/fis-examen2-v2',
  'fis-examen2-sol':       'fisica-medicina/fis-examen2-sol',
  'fis-examen2-2017-sol':  'fisica-medicina/fis-examen2-2017-sol',
  // Biología Celular — subcarpeta biologia-celular/
  'bcm-te-1': 'biologia-celular/bcm-te-1',
  'bcm-te-2': 'biologia-celular/bcm-te-2',
  'bcm-te-3': 'biologia-celular/bcm-te-3',
  'bcm-te-4': 'biologia-celular/bcm-te-4',
  'bcm-te-5': 'biologia-celular/bcm-te-5',
  'bcm-te-6': 'biologia-celular/bcm-te-6',
  'bcm-te-7': 'biologia-celular/bcm-te-7',
  'bcm-pl-1': 'biologia-celular/bcm-pl-1',
  'bcm-pl-2': 'biologia-celular/bcm-pl-2',
  'bcm-pl-3': 'biologia-celular/bcm-pl-3',
  'bcm-pl-4': 'biologia-celular/bcm-pl-4',
  'bcm-pl-5': 'biologia-celular/bcm-pl-5',
  'bcm-pl-7': 'biologia-celular/bcm-pl-7',
  'bcm-pl-8': 'biologia-celular/bcm-pl-8',
  'bcm-pl-9': 'biologia-celular/bcm-pl-9',
  // Aparato Locomotor — subcarpeta aparato-locomotor/
  'loc-tbl-1': 'aparato-locomotor/loc-tbl-1',
  'loc-tbl-2': 'aparato-locomotor/loc-tbl-2',
  // Digestivo — subcarpeta digestivo/
  'dig-histo-1': 'digestivo/dig-histo-1',
  'dig-histo-2': 'digestivo/dig-histo-2',
  'dig-histo-3': 'digestivo/dig-histo-3',
};

// Las signed URLs viven 1 semana. Suficiente para una sesion de estudio larga
// (incluso varios dias) y el cliente las cachea en sessionStorage. Cuando la
// URL caduca el cliente vuelve a pedir una nueva — un fetch JSON, sin descargar
// el PDF entero por Vercel.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ claseId: string }> },
) {
  const { claseId } = await params;

  if (!ALLOWED.has(claseId)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (REQUIRES_PAID_PLAN.has(claseId)) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .maybeSingle<{ plan: string | null }>();
    if (!profile?.plan || profile.plan === 'free') {
      return NextResponse.json({ error: 'plan_required' }, { status: 403 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[resumen] missing env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  // Service role key bypasses RLS — never exposed to the client.
  const admin = createSupabaseAdmin(url, key, { auth: { persistSession: false } });

  const fileId = FILE_ALIAS[claseId] ?? claseId;
  const { data, error } = await admin.storage
    .from('resumenes')
    .createSignedUrl(`${fileId}.pdf`, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.error('[resumen] signed url error:', error?.message);
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  // expiresAt: timestamp en ms en el que la URL deja de ser valida. El cliente
  // lo usa para decidir si reutiliza la URL cacheada o pide una nueva.
  const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;

  return NextResponse.json(
    { url: data.signedUrl, expiresAt },
    {
      // Nunca cachear el JSON en CDN: la signed URL es por-usuario y temporal.
      // El cliente la guarda en sessionStorage para no repedirla en la sesion.
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
