'use client';
import { useEffect, useState } from 'react';
import TrackLabVisit from '@/components/TrackLabVisit';
import NivelMap from '@/components/investigacion/NivelMap';
import CargandoBolitas from '@/components/CargandoBolitas';
import shared from '@/styles/dashboardPages.module.css';
import styles from '@/styles/investigacion.module.css';

// El jardín que hace de fondo del mapa (`.mapaCamino`). Si la ruta cambia en el
// CSS hay que cambiarla aquí: es la que se espera antes de enseñar el mapa.
const FONDO = '/investigacion/jardin.svg';
// Si el fondo no llega, el mapa se enseña igual: sin él se puede jugar.
const ESPERA_MAX_MS = 6000;

/** `true` cuando la imagen ya está bajada (o falló, o se agotó la espera). */
function useFondoListo(src: string): boolean {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let vivo = true;
    const fin = () => { if (vivo) setListo(true); };
    // `window.Image`, no `Image` a secas: es el nombre que `next/image` pisa.
    const img = new window.Image();
    img.onload = fin;
    img.onerror = fin;
    img.src = src;
    if (img.complete) fin();
    const tope = window.setTimeout(fin, ESPERA_MAX_MS);
    return () => {
      vivo = false;
      window.clearTimeout(tope);
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return listo;
}

export default function InvestigacionPage() {
  // Sin esto el título y los nodos salían primero y el jardín aparecía después,
  // a destiempo: se espera al fondo y entra todo junto.
  const listo = useFondoListo(FONDO);

  return (
    <>
      <TrackLabVisit labId="investigacion" />

      {!listo ? (
        <CargandoBolitas color="#2CA9BC" etiqueta="Cargando el mapa" />
      ) : (
        <div className={styles.mapaEntrada}>
          <div className={shared.pagePanelIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M17,12v5m-4,0V15M3,15l2.83-2.83M8,7a3,3,0,1,0,3,3A3,3,0,0,0,8,7Z"
                stroke="#9CA3AF" strokeOpacity="0.6"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
              <path
                d="M8,3H20a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V17"
                stroke="#9CA3AF"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
          </div>

          <h2 className={shared.pageTitle}>Investigación</h2>
          <p className={shared.pageSub}>
            Recorre los 14 niveles del curso. Completa cada nivel al 100% para desbloquear el siguiente.
          </p>

          <NivelMap />
        </div>
      )}
    </>
  );
}
