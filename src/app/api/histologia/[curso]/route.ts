import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPublicUrl } from '@/lib/supabase/storage';
import { getHistoCurso } from '@/lib/data/histologia';
import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import { tieneAccesoA } from '@/lib/acceso';

export const dynamic = 'force-dynamic';

const IMG_RE = /\.(jpe?g|png|webp)$/i;

// Tinciones reconocidas en el nombre de archivo → etiqueta mostrada.
const TINCIONES: Record<string, string> = {
  he: 'H&E',
  hye: 'H&E',
  hematoxilina: 'H&E',
  tricromico: 'Tricrómico',
  masson: 'Tricrómico',
  pas: 'PAS',
  plata: 'Plata',
  jones: 'Plata',
  gram: 'Gram',
  giemsa: 'Giemsa',
  orceina: 'Orceína',
  azan: 'Azán',
};

const AUMENTO_RE = /^(\d{1,4})x$/i;
const STOPWORDS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'con', 'en', 'a']);

/**
 * Deriva título + facetas del nombre de archivo. Order-independent: cada token
 * que sea un aumento (40x) o una tinción conocida (he, masson…) se extrae como
 * faceta; el resto forma el título.
 *   "1-glomerulo-he-40x.jpg" → { titulo: "Glomérulo", tincion: "H&E", aumento: "40x" }
 */
function parseFilename(name: string): { titulo: string; tincion: string | null; aumento: string | null } {
  const base = name.replace(/\.[^.]+$/, '').replace(/^\d+[-_\s]*/, '');
  const tokens = base.replace(/[-_]+/g, ' ').trim().split(/\s+/).filter(Boolean);

  let tincion: string | null = null;
  let aumento: string | null = null;
  const rest: string[] = [];

  for (const tok of tokens) {
    const low = tok.toLowerCase();
    const am = low.match(AUMENTO_RE);
    if (am) {
      aumento = `${am[1]}x`;
      continue;
    }
    if (TINCIONES[low]) {
      tincion = TINCIONES[low];
      continue;
    }
    rest.push(tok);
  }

  const titulo = rest
    .map((w, i) => {
      const low = w.toLowerCase();
      if (i > 0 && STOPWORDS.has(low)) return low;
      if (w.length <= 3) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');

  return { titulo: titulo || 'Sin título', tincion, aumento };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ curso: string }> },
) {
  const { curso } = await params;
  // Lista las fotos de un laboratorio de pago: sólo para quien tiene el plan.
  // Sin esto cualquiera, sin cuenta, se bajaba el atlas entero (y con caché
  // pública, la CDN lo servía a todo el mundo).
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!tieneAccesoA(await getCachedPlanState(), 'interno')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const cursoData = getHistoCurso(curso);
  if (!cursoData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const supabase = createAdminClient();

  // Una petición de listado por clase (pocas clases), en paralelo.
  const porClase = await Promise.all(
    cursoData.clases.map(async (clase) => {
      const folder = `${curso}/${clase.slug}`;
      const { data, error } = await supabase.storage
        .from('histologia')
        .list(folder, { limit: 300 });
      if (error || !data) return [];
      return data
        .filter((f) => IMG_RE.test(f.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
        .map((f) => {
          const meta = parseFilename(f.name);
          return {
            url: getPublicUrl('histologia', `${folder}/${f.name}`),
            clase: clase.slug,
            claseTitulo: clase.titulo,
            ...meta,
          };
        });
    }),
  );

  const items = porClase.flat();

  return NextResponse.json(items, {
    headers: {
      // Sólo en el navegador de quien tiene el plan: nunca en la CDN compartida.
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
