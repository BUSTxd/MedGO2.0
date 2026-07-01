'use client';
import { useState } from 'react';
import type { MJError } from '@/lib/investigacion/types';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function ErrorInvestigador({
  config,
  onComplete,
}: {
  config: MJError;
  onComplete: (r: MinijuegoResult) => void;
}) {
  const [marcados, setMarcados] = useState<Set<string>>(new Set());
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const toggle = (id: string) => {
    if (resuelto) return;
    setMarcados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setVerificado(false);
  };

  const errores = config.segmentos.filter((s) => s.esError);
  const correcto =
    errores.every((s) => marcados.has(s.id)) &&
    [...marcados].every((id) => config.segmentos.find((s) => s.id === id)?.esError);

  const verificar = () => {
    const n = intentos + 1;
    setIntentos(n);
    setVerificado(true);
    if (correcto) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <p className={styles.mjInstruction}>{config.instruccion}</p>

      <p className={styles.errorFragmento}>
        {config.segmentos.map((s) => {
          const flagged = marcados.has(s.id);
          const revelar = verificado && s.esError;
          const cls = [styles.errorSeg];
          if (flagged) cls.push(styles.errorSegFlag);
          if (revelar) cls.push(styles.errorSegReveal);
          return (
            <span key={s.id} className={cls.join(' ')} onClick={() => toggle(s.id)}>
              {s.texto}{' '}
            </span>
          );
        })}
      </p>

      {!resuelto && (
        <button className={styles.mjCheckBtn} onClick={verificar} disabled={marcados.size === 0}>
          Señalar errores
        </button>
      )}

      {verificado && !correcto && !resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          Todavía no encuentras exactamente los errores. Los reales quedaron resaltados: ajusta tu selección.
        </p>
      )}
      {resuelto && (
        <>
          <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
            ¡Ojo clínico! Encontraste todos los errores. {intentos === 1 ? '+50 XP' : '+25 XP'}
          </p>
          <div className={styles.mjExplainList}>
            {errores.map((s) => (
              <div key={s.id} className={`${styles.mjExplainItem} ${styles.mjExplainBad}`}>
                <strong>✗ {s.texto}</strong>
                <span>{s.explicacion}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
