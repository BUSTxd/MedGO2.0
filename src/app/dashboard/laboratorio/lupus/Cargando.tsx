'use client';
// La rueda de carga del laboratorio, dentro de un marco que mide lo mismo que
// el lienzo blanco del lab (`cargandoLab.module.css`). La pintan, en este
// orden y sin saltos entre ellas: el `loading.tsx` de la ruta, el `dynamic` de
// `Pagina.tsx` y el propio lab mientras bajan las imágenes de la primera escena.

import CargandoBolitas from '@/components/CargandoBolitas';
import s from '@/styles/cargandoLab.module.css';

export const COLOR_CARGA = '#C2385A';

/** Solo la rueda: para dentro del marco del lab, que ya está pintado. */
export function Rueda() {
  return (
    <div className={s.centro}>
      <CargandoBolitas color={COLOR_CARGA} etiqueta="Cargando el laboratorio" />
    </div>
  );
}

/** Marco + rueda: para el `loading.tsx`, donde aún no hay lab. */
export default function CargandoLupus() {
  return (
    <div className={s.marco}>
      <Rueda />
    </div>
  );
}
