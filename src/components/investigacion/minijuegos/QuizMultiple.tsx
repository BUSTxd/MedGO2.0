'use client';
import { useMemo, useState } from 'react';
import type { MJQuiz } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function QuizMultiple({
  config,
  onComplete,
}: {
  config: MJQuiz;
  onComplete: (r: MinijuegoResult) => void;
}) {
  const opciones = useMemo(() => shuffle(config.opciones), [config]);
  const [elegida, setElegida] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [resuelto, setResuelto] = useState(false);
  const [verExplicacion, setVerExplicacion] = useState(false);

  const seleccion = opciones.find((o) => o.id === elegida);

  const responder = (id: string) => {
    if (resuelto) return;
    const op = opciones.find((o) => o.id === id)!;
    setElegida(id);
    const n = intentos + 1;
    setIntentos(n);
    if (op.correcta) {
      setResuelto(true);
      setVerExplicacion(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <p className={styles.mjPregunta}>{config.pregunta}</p>

      <div className={styles.mjOptions}>
        {opciones.map((o) => {
          const esElegida = elegida === o.id;
          const cls = [styles.mjOption];
          if (resuelto && o.correcta) cls.push(styles.mjOptionCorrect);
          else if (esElegida && !o.correcta) cls.push(styles.mjOptionWrong);
          return (
            <button
              key={o.id}
              className={cls.join(' ')}
              onClick={() => responder(o.id)}
              disabled={resuelto}
            >
              {o.texto}
            </button>
          );
        })}
      </div>

      {elegida && !resuelto && seleccion && !seleccion.correcta && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          Casi. Vuelve a intentarlo — lee bien cada opción.
        </p>
      )}

      {resuelto && (
        <>
          <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
            ¡Correcto! {intentos === 1 ? '+50 XP' : '+25 XP'}
          </p>
          <button className={styles.mjExplainToggle} onClick={() => setVerExplicacion((v) => !v)}>
            {verExplicacion ? 'Ocultar explicación' : 'Ver explicación completa'}
          </button>
          {verExplicacion && (
            <div className={styles.mjExplainList}>
              {opciones.map((o) => (
                <div
                  key={o.id}
                  className={`${styles.mjExplainItem} ${o.correcta ? styles.mjExplainOk : styles.mjExplainBad}`}
                >
                  <strong>{o.correcta ? '✓ ' : '✗ '}{o.texto}</strong>
                  <span>{o.explicacion}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
