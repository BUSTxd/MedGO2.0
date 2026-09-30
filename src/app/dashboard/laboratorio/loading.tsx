'use client';
import { usePathname } from 'next/navigation';
import EsqueletoLaboratorio from '@/components/esqueletos/EsqueletoLaboratorio';
import EsqueletoGenerico from '@/components/esqueletos/EsqueletoGenerico';

// También cubre cada laboratorio (`laboratorio/<slug>`), que no es el índice.
export default function Loading() {
  const nivel = usePathname().split('/').filter(Boolean).length;
  return nivel <= 2 ? <EsqueletoLaboratorio /> : <EsqueletoGenerico />;
}
