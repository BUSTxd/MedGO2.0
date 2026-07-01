'use client';
import { useMemo, useState } from 'react';
import type { MJOrden } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function OrdenarSecuencia({
  config,
  onComplete,
}: {
  config: MJOrden;
  onComplete: (r: MinijuegoResult) => void;
}) {
  // Orden inicial barajado (garantiza que no arranque ya resuelto).
  const inicial = useMemo(() => {
    let s = shuffle(config.pasos);
    if (s.map((p) => p.id).join() === config.ordenCorrecto.join() && s.length > 1) {
      s = [...s.slice(1), s[0]];
    }
    return s;
  }, [config]);

  const [orden, setOrden] = useState(inicial);
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const mover = (i: number, dir: -1 | 1) => {
    if (resuelto) return;
    const j = i + dir;
    if (j < 0 || j >= orden.length) return;
    const next = [...orden];
    [next[i], next[j]] = [next[j], next[i]];
    setOrden(next);
    setVerificado(false);
  };

  const esCorrecto = orden.map((p) => p.id).join() === config.ordenCorrecto.join();

  const verificar = () => {
    const n = intentos + 1;
    setIntentos(n);
    setVerificado(true);
    if (esCorrecto) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <p className={styles.mjInstruction}>{config.instruccion}</p>

      <ol className={styles.ordenList}>
        {orden.map((p, i) => {
          const enPosicion = verificado && config.ordenCorrecto[i] === p.id;
          const malPosicion = verificado && config.ordenCorrecto[i] !== p.id;
          return (
            <li
              key={p.id}
              className={`${styles.ordenItem} ${enPosicion ? styles.ordenOk : ''} ${
                malPosicion ? styles.ordenBad : ''
              }`}
            >
              <span className={styles.ordenNum}>{i + 1}</span>
              <span className={styles.ordenTexto}>{p.texto}</span>
              <span className={styles.ordenCtrls}>
                <button onClick={() => mover(i, -1)} disabled={i === 0 || resuelto} aria-label="Subir">
                  ▲
                </button>
                <button
                  onClick={() => mover(i, 1)}
                  disabled={i === orden.length - 1 || resuelto}
                  aria-label="Bajar"
                >
                  ▼
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      {!resuelto && (
        <button className={styles.mjCheckBtn} onClick={verificar}>
          Verificar orden
        </button>
      )}
      {verificado && !esCorrecto && !resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          Aún no. Las que están en verde ya están en su lugar; reordena el resto.
        </p>
      )}
      {resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
          ¡Secuencia correcta! {intentos === 1 ? '+50 XP' : '+25 XP'}
        </p>
      )}
    </div>
  );
}
