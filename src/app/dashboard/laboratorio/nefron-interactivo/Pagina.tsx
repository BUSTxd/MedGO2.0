'use client';
// Página del lab «Nefrón interactivo». Mismo diseño que Médula Espinal 3D y
// Polígono de Willis 3D: sin títulos, el dibujo a toda altura y la barra
// lateral a la derecha. Es 2D con código: no carga three.js.

import TrackLabVisit from '@/components/TrackLabVisit';
import NefronSimulator from './NefronSimulator';
import styles from '@/styles/medulaEspinal.module.css';

export default function NefronInteractivoPage() {
  return (
    <div className={styles.wrapper}>
      <TrackLabVisit labId="nefron-interactivo" />
      <NefronSimulator />
    </div>
  );
}
