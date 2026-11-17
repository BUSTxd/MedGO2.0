'use client';
// Página del lab «Tronco encefálico 3D». Misma arquitectura que Médula Espinal
// 3D y Polígono de Willis 3D: el modelo ocupa toda la altura, la vista flota
// arriba a la izquierda y el resto va en la barra lateral. La escena 3D se
// carga en diferido (solo en cliente) para dejar three.js fuera del bundle.

import TrackLabVisit from '@/components/TrackLabVisit';
import TroncoSimulator from './TroncoSimulator';
import styles from '@/styles/medulaEspinal.module.css';

export default function TroncoEncefalicoPage() {
  return (
    <div className={styles.wrapper}>
      <TrackLabVisit labId="tronco-encefalico" />
      <TroncoSimulator />
    </div>
  );
}
