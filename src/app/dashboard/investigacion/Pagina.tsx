'use client';
import TrackLabVisit from '@/components/TrackLabVisit';
import NivelMap from '@/components/investigacion/NivelMap';
import shared from '@/styles/dashboardPages.module.css';

export default function InvestigacionPage() {
  return (
    <>
      <TrackLabVisit labId="investigacion" />

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
    </>
  );
}
