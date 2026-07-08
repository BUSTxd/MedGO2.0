'use client';
// Wrapper cliente del visor 3D. Carga la escena de forma diferida (solo en
// cliente) para mantener three.js fuera del bundle del dashboard, igual que el
// resto de labs 3D del proyecto.

import dynamic from 'next/dynamic';
import styles from '@/styles/poligonoWillis.module.css';

const WillisScene = dynamic(() => import('./WillisScene'), {
  ssr: false,
  loading: () => <div className={styles.stageLoading}>Cargando modelo 3D…</div>,
});

export default function WillisViewer() {
  return (
    <div className={styles.stage}>
      <WillisScene />
      <span className={styles.zoomHint}>Arrastra · rotar&emsp;|&emsp;Scroll · zoom</span>
    </div>
  );
}
