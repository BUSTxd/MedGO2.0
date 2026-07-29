'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/frotisSim.module.css';

const SIM_URL = '/simulaciones/frotis-sanguineo.html';

/* La simulación corre en un HTML autocontenido dentro de un iframe. Todos sus
   pasos usan «modo flow»: el documento crece con su contenido en vez de
   encajarse en una pantalla, avisa su altura real por postMessage y este
   wrapper estira el <iframe> a esa medida — así scrollea la página del
   dashboard (con el sidebar fijo), no una barra dentro del panel.
   Como el documento pasa a ser más alto que el viewport, la navegación
   Anterior/Siguiente se dibuja aquí en una barra fija: dentro del iframe
   quedaría al final del documento y sólo se vería tras bajarlo entero. */

type SimMessage =
  | { source: 'medgo-frotis-sim'; type: 'size'; height: number }
  | {
      source: 'medgo-frotis-sim';
      type: 'nav';
      cur: number;
      total: number;
      canPrev: boolean;
      nextLabel: string;
      hint: string;
      scrollTop: boolean;
    };

function isSimMessage(data: unknown): data is SimMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).source === 'medgo-frotis-sim'
  );
}

interface NavState {
  canPrev: boolean;
  nextLabel: string;
  hint: string;
}

export default function FrotisSimFrame() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [nav, setNav] = useState<NavState | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || !isSimMessage(e.data)) return;

      if (e.data.type === 'size') {
        setHeight(e.data.height);
        return;
      }

      const { canPrev, nextLabel, hint, scrollTop } = e.data;
      setNav({ canPrev, nextLabel, hint });
      // Cada paso empieza por arriba: es esta página la que scrollea.
      if (scrollTop) wrapperRef.current?.scrollIntoView({ block: 'start' });
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const send = useCallback((msg: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage(
      { target: 'medgo-frotis-sim', ...msg },
      window.location.origin,
    );
  }, []);

  /* Las escenas 3D dimensionan su alto con la ventana real del dashboard: dentro
     del iframe `vh` mide el propio iframe, cuya altura ya sale del contenido, y
     eso realimentaría el crecimiento sin parar. */
  useEffect(() => {
    const push = () => send({ type: 'viewport', height: window.innerHeight });
    push();
    window.addEventListener('resize', push);
    return () => window.removeEventListener('resize', push);
  }, [send]);

  /* La simulación anuncia su estado al arrancar, pero ese primer aviso puede
     salir antes de que esta escucha exista y dejaría la barra sin dibujar (el
     caso visible: la portada sin botón «Siguiente»). Pedirlo explícitamente
     quita la carrera. */
  const sync = useCallback(() => {
    send({ type: 'viewport', height: window.innerHeight });
    send({ type: 'sync' });
  }, [send]);

  // `onLoad` cubre el arranque normal; esto cubre el caso inverso —el iframe
  // ya cargado cuando este componente (re)monta, p. ej. con Fast Refresh.
  useEffect(sync, [sync]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>
          ← Laboratorio virtual
        </Link>
        <div className={styles.actions}>
          <span className={styles.counter}>Hematología · Práctica 1</span>
          <a
            className={styles.expand}
            href={SIM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir a pantalla completa ↗
          </a>
        </div>
      </div>

      <iframe
        ref={frameRef}
        className={styles.frame}
        src={SIM_URL}
        style={{ height: height ? `${height}px` : '100dvh' }}
        title="Simulación: realización y tinción del frotis sanguíneo"
        allow="fullscreen"
        scrolling="no"
        onLoad={sync}
      />

      {nav && (
        <div className={styles.navBar}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => send({ type: 'prev' })}
            disabled={!nav.canPrev}
          >
            ← Anterior
          </button>
          <span className={styles.navHint}>{nav.hint}</span>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnPrimary}`}
            onClick={() => send({ type: 'next' })}
          >
            {nav.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
