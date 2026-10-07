'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from '@/styles/cursosHub.module.css';

/**
 * Fila horizontal de tarjetas con flechas. El desplazamiento es nativo
 * (`overflow-x` + scroll-snap): en táctil se arrastra con el dedo y las
 * flechas solo aparecen cuando de verdad hay algo escondido a ese lado.
 */
export default function Pasarela({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  const pista = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ atras: false, adelante: false });

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => {
      // 2px de margen: el redondeo del zoom deja restos de medio píxel.
      setPuede({
        atras: el.scrollLeft > 2,
        adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    };
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', medir);
      ro.disconnect();
    };
  }, []);

  const mover = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: sentido * el.clientWidth * 0.85, behavior: suave ? 'smooth' : 'auto' });
  };

  return (
    <div className={styles.pasarela}>
      <div ref={pista} className={styles.pasarelaPista} role="region" aria-label={etiqueta} tabIndex={0}>
        {children}
      </div>
      {puede.atras && (
        <button type="button" className={`${styles.flecha} ${styles.flechaAtras}`} onClick={() => mover(-1)} aria-label="Anteriores">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {puede.adelante && (
        <button type="button" className={`${styles.flecha} ${styles.flechaAdelante}`} onClick={() => mover(1)} aria-label="Siguientes">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
