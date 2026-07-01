'use client';
import { useMemo, useState } from 'react';
import type { MJCaso } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function CasoClinico({
  config,
  onComplete,
}: {
  config: MJCaso;
  onComplete: (r: MinijuegoResult) => void;
}) {
  const opciones = useMemo(() => shuffle(config.opciones), [config]);
  const [elegida, setElegida] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [resuelto, setResuelto] = useState(false);

  const seleccion = opciones.find((o) => o.id === elegida);

  const responder = (id: string) => {
    if (resuelto) return;
    const op = opciones.find((o) => o.id === id)!;
    setElegida(id);
    const n = intentos + 1;
    setIntentos(n);
    if (op.correcta) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <div className={styles.mjEscenario}>{config.escenario}</div>
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

      {seleccion && (
        <p
          className={`${styles.mjFeedback} ${
            seleccion.correcta ? styles.mjFeedbackOk : styles.mjFeedbackBad
          }`}
        >
          {seleccion.feedback}
          {resuelto && (intentos === 1 ? ' · +50 XP' : ' · +25 XP')}
        </p>
      )}
    </div>
  );
}
