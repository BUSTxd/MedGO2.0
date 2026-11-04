'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Vuelve a pedir la página al servidor cuando la pestaña recupera el foco y,
 * mientras está a la vista, cada `cadaMs`. El panel de avance se deduce de los
 * sílabos desplegados: tras un deploy, basta con volver a la pestaña para ver
 * el material nuevo sin recargar a mano. No pinta nada.
 */
export default function RefrescoAlVolver({ cadaMs = 5 * 60_000 }: { cadaMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const refrescar = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };
    document.addEventListener('visibilitychange', refrescar);
    const id = window.setInterval(refrescar, cadaMs);
    return () => {
      document.removeEventListener('visibilitychange', refrescar);
      window.clearInterval(id);
    };
  }, [router, cadaMs]);

  return null;
}
