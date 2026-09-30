import CargandoBolitas from '@/components/CargandoBolitas';

// Mapa y niveles: no hay silueta que adelantar, así que va la rueda — la misma
// que el mapa sigue enseñando hasta que su fondo termina de bajar.
export default function Loading() {
  return <CargandoBolitas color="#2CA9BC" />;
}
