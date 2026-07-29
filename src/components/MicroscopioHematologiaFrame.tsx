'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/microscopioHematologiaSim.module.css';

const SIM_URL = '/simulaciones/microscopio-hematologia.html';

/* La simulación corre en un HTML autocontenido dentro de un iframe, en modo
   flow: el documento crece con su contenido y avisa su altura real por
   postMessage para que este wrapper estire el <iframe> a esa medida — así
   scrollea la página del dashboard, no una barra dentro del panel. A
   diferencia de FrotisSimFrame, esto no es un flujo de pasos (no hay
   Anterior/Siguiente): es una sola pantalla continua, así que el puente solo
   necesita el mensaje de tamaño. */

type SimMessage = { source: 'medgo-microscopio-sim'; type: 'size'; height: number };

function isSimMessage(data: unknown): data is SimMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).source === 'medgo-microscopio-sim'
  );
}

export default function MicroscopioHematologiaFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || !isSimMessage(e.data)) return;
      if (e.data.type === 'size') setHeight(e.data.height);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const sync = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { target: 'medgo-microscopio-sim', type: 'sync' },
      window.location.origin,
    );
  }, []);

  useEffect(sync, [sync]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>
          ← Laboratorio virtual
        </Link>
        <a className={styles.expand} href={SIM_URL} target="_blank" rel="noopener noreferrer">
          Abrir a pantalla completa ↗
        </a>
      </div>

      <iframe
        ref={frameRef}
        className={styles.frame}
        src={SIM_URL}
        style={{ height: height ? `${height}px` : '100dvh' }}
        title="Simulación: microscopio virtual — médula ósea y serie blanca"
        allow="fullscreen"
        scrolling="no"
        onLoad={sync}
      />
    </div>
  );
}
