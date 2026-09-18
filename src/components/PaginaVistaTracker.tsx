'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/**
 * Registra cada página que abre el alumno y cuándo la deja. La salida se manda
 * al navegar a otra página y al ocultar la pestaña (cambiar de pestaña,
 * minimizar o cerrar): en el móvil la página puede morir oculta sin avisar, así
 * que esperar al cierre perdería la mayoría de salidas. Si vuelve a la pestaña,
 * el tiempo sigue contando en un tramo nuevo; la ficha del admin los suma.
 *
 * `segundos` es tiempo con la pestaña visible, no reloj de pared.
 * El banqueo (`?examen=1`) cuenta como página propia aunque comparta ruta.
 */
export default function PaginaVistaTracker() {
  const pathname = usePathname();
  const banqueo = useSearchParams().get('examen') === '1';

  useEffect(() => {
    if (!pathname) return;
    const path = pathname;
    const extra = banqueo ? { banqueo: true } : {};
    let desde: number | null = document.visibilityState === 'visible' ? Date.now() : null;

    const cerrar = (motivo: 'navego' | 'oculto') => {
      if (desde === null) return;
      const segundos = Math.round((Date.now() - desde) / 1000);
      desde = null;
      trackEvent('pagina_salida', { ...extra, segundos, motivo }, { path, beacon: motivo === 'oculto' });
    };
    const onVisibilidad = () => {
      if (document.visibilityState === 'hidden') cerrar('oculto');
      else if (desde === null) desde = Date.now();
    };
    const onPagehide = () => cerrar('oculto');

    trackEvent('pagina_vista', extra);
    document.addEventListener('visibilitychange', onVisibilidad);
    window.addEventListener('pagehide', onPagehide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilidad);
      window.removeEventListener('pagehide', onPagehide);
      cerrar('navego');
    };
  }, [pathname, banqueo]);

  return null;
}
