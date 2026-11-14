'use client';
// Página del lab «Polígono de Willis 3D». Mismo diseño que Médula Espinal 3D:
// sin títulos, el modelo a toda altura y la barra lateral a la derecha. La
// escena 3D se carga en diferido para dejar three.js fuera del bundle.

import TrackLabVisit from '@/components/TrackLabVisit';
import WillisSimulator from './WillisSimulator';
import styles from '@/styles/medulaEspinal.module.css';

export default function PoligonoWillisPage() {
  return (
    <div className={styles.wrapper}>
      <TrackLabVisit labId="poligono-willis" />
      <WillisSimulator />
    </div>
  );
}
