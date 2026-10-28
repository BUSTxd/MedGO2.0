import SiluetaRuta from '@/components/estudio/SiluetaRuta';

/**
 * De un laboratorio de vuelta al índice (o del índice a un laboratorio): el tramo
 * `laboratorio` no cambia, así que el `loading` de /estudio no se vuelve a pintar.
 */
export default function CargandoLaboratorio() {
  return <SiluetaRuta barraReal />;
}
