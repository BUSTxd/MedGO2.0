'use client';
// Página del simulador «Médula Espinal 3D». Misma arquitectura que el atlas 3D
// del miembro superior: el modelo ocupa toda la altura, la vista flota arriba a
// la izquierda y el resto va en la barra lateral. Sin títulos: el modelo manda.
// La escena 3D se carga en diferido (solo en cliente) para dejar three.js fuera
// del bundle del dashboard.

import TrackLabVisit from '@/components/TrackLabVisit';
import SpinalCordSimulator from './SpinalCordSimulator';
import styles from '@/styles/medulaEspinal.module.css';

export default function MedulaEspinalPage() {
  return (
    <div className={styles.wrapper}>
      <TrackLabVisit labId="medula-espinal" />
      <SpinalCordSimulator />
    </div>
  );
}
