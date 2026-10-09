'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/examRunner.module.css';

const prefiereQuieto = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Cuenta de 0 a `objetivo` para la nota final. Sin animación si el sistema la desactiva. */
function useConteo(objetivo: number, ms = 900) {
  // Arranca ya en el valor final si no va a haber animación; si arrancara en 0
  // se vería un cero durante un frame. (No hay riesgo de desajuste con el HTML
  // del servidor: la nota sólo se monta al terminar el examen.)
  const [valor, setValor] = useState(() => (prefiereQuieto() ? objetivo : 0));

  useEffect(() => {
    if (prefiereQuieto() || objetivo <= 0) {
      setValor(objetivo);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      // easeOutCubic: arranca rápido y frena, como un contador que se asienta.
      setValor(objetivo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [objetivo, ms]);

  return valor;
}

/**
 * Nota final: aro que se dibuja hasta el porcentaje obtenido, con el mismo
 * valor animado alimentando la cifra — así el número y el arco nunca se
 * desincronizan. La comparten ExamRunner y el examen 3D de miembro superior.
 */
export default function NotaFinal({ score, total, pct, etiqueta = 'correcto' }: { score: number; total: number; pct: number; etiqueta?: string }) {
  const avance = useConteo(score);
  const vistos = Math.round(avance * 10) / 10;
  const fraccion = total > 0 ? avance / total : 0;
  const R = 68;
  const C = 2 * Math.PI * R;
  const tono = pct >= 80 ? '#2EA057' : pct >= 60 ? '#7B72D4' : pct >= 40 ? '#E0932A' : '#D64045';

  return (
    <div className={styles.notaWrap} style={{ '--tono': tono } as React.CSSProperties}>
      <svg className={styles.notaAro} viewBox="0 0 160 160" aria-hidden>
        <circle className={styles.notaPista} cx="80" cy="80" r={R} />
        <circle
          className={styles.notaValor}
          cx="80"
          cy="80"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - fraccion)}
        />
      </svg>
      <div className={styles.notaCentro}>
        <span className={styles.notaNum}>
          {Number.isInteger(score) ? Math.round(vistos) : vistos.toFixed(1)}
          <span className={styles.notaTotal}>/{total}</span>
        </span>
        <span className={styles.notaPct}>{pct}% {etiqueta}</span>
      </div>
    </div>
  );
}
