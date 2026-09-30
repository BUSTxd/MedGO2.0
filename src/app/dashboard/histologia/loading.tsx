'use client';
import { usePathname } from 'next/navigation';
import EsqueletoHistologia from '@/components/esqueletos/EsqueletoHistologia';
import EsqueletoGenerico from '@/components/esqueletos/EsqueletoGenerico';

// También cubre `histologia/<curso>`, que no es una rejilla de cursos.
export default function Loading() {
  const nivel = usePathname().split('/').filter(Boolean).length;
  return nivel <= 2 ? <EsqueletoHistologia /> : <EsqueletoGenerico />;
}
