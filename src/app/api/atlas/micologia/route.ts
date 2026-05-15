import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPublicUrl } from '@/lib/supabase/storage';

export const revalidate = 86400;

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
      // 1 dia en browser y CDN. Pueden refrescar en background tras 1 hora
      // (stale-while-revalidate) sin bloquear la primera respuesta.
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
