'use client';
import { usePathname } from 'next/navigation';
import EsqueletoLaboratorio from '@/components/esqueletos/EsqueletoLaboratorio';
import EsqueletoGenerico from '@/components/esqueletos/EsqueletoGenerico';
import CargandoHipersensibilidad from './hipersensibilidad/Cargando';

// También cubre cada laboratorio (`laboratorio/<slug>`), que no es el índice.
// Hipersensibilidad lleva su rueda, la misma que sigue enseñando el lab hasta
// que bajan las imágenes de la primera escena: una silueta genérica antes
// sería una carga de más.
export default function Loading() {
  const ruta = usePathname();
  if (ruta.startsWith('/dashboard/laboratorio/hipersensibilidad')) return <CargandoHipersensibilidad />;
  const nivel = ruta.split('/').filter(Boolean).length;
  return nivel <= 2 ? <EsqueletoLaboratorio /> : <EsqueletoGenerico />;
}
