import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPublicUrl } from '@/lib/supabase/storage';
import { createClient } from '@/lib/supabase/server';
import { getCachedPlanState } from '@/lib/plans-server';
import { requiredPlanDeLab, tieneAccesoA } from '@/lib/acceso';

export const dynamic = 'force-dynamic';

const DISPLAY: Record<string, string> = {
  'alternaria-spp': 'Alternaria spp.',
  'aspergillus-flavus': 'Aspergillus flavus',
  'aspergillus-fumigatus': 'Aspergillus fumigatus',
  'aspergillus-niger': 'Aspergillus niger',
  'candida-albicans': 'Candida albicans',
  'cryptococcus-neoformans': 'Cryptococcus neoformans',
  'fusarium-spp': 'Fusarium spp.',
  'histoplasma-capsulatum': 'Histoplasma capsulatum',
  'malassezia-furfur': 'Malassezia furfur',
  'microsporum-canis': 'Microsporum canis',
  'microsporum-gypseum': 'Microsporum gypseum',
  'penicillium-spp': 'Penicillium spp.',
  'trichophyton-rubrum': 'Trichophyton rubrum',
  'tricophyton-mentagrophytes': 'Trichophyton mentagrophytes',
  'tricophyton-tonsurans': 'Trichophyton tonsurans',
};

export async function GET() {
  // Lista las fotos de un laboratorio de pago: sólo para quien tiene el plan.
  // Sin esto cualquiera, sin cuenta, se bajaba el atlas entero (y con caché
  // pública, la CDN lo servía a todo el mundo).
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!tieneAccesoA(await getCachedPlanState(), requiredPlanDeLab('atlas-micologia'))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const supabase = createAdminClient();
  const items: { url: string; hongo: string }[] = [];

  for (const slug of Object.keys(DISPLAY)) {
    const { data, error } = await supabase.storage.from('micologia').list(slug, { limit: 100 });
    if (error || !data) continue;
    for (const f of data) {
      if (f.name === '.emptyFolderPlaceholder') continue;
      items.push({ url: getPublicUrl('micologia', `${slug}/${f.name}`), hongo: DISPLAY[slug] });
    }
  }

  return NextResponse.json(items, {
    headers: {
      // Sólo en el navegador de quien tiene el plan: nunca en la CDN compartida.
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
