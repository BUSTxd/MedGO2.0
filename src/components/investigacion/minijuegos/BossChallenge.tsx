'use client';
import { useMemo, useState } from 'react';
import type { BossConfig } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import styles from '@/styles/investigacionGame.module.css';

export interface BossResult {
  aciertosPrimerIntento: number;
  total: number;
  sinErrores: boolean;
}

export default function BossChallenge({
  config,
  onComplete,
}: {
  config: BossConfig;
  onComplete: (r: BossResult) => void;
}) {
  const decisiones = config.decisiones;
  const [paso, setPaso] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [intentosPaso, setIntentosPaso] = useState(0);
  const [aciertos1er, setAciertos1er] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const actual = decisiones[paso];
  const opciones = useMemo(() => shuffle(actual.opciones), [actual]);
  const seleccion = opciones.find((o) => o.id === elegida);
  const resueltoPaso = !!seleccion?.correcta;

  const responder = (id: string) => {
    if (resueltoPaso) return;
    const op = opciones.find((o) => o.id === id)!;
    setElegida(id);
    const n = intentosPaso + 1;
    setIntentosPaso(n);
    if (op.correcta && n === 1) setAciertos1er((a) => a + 1);
  };

  const avanzar = () => {
    if (paso + 1 < decisiones.length) {
      setPaso((p) => p + 1);
      setElegida(null);
      setIntentosPaso(0);
    } else {
      setTerminado(true);
      onComplete({
        aciertosPrimerIntento: aciertos1er,
        total: decisiones.length,
        sinErrores: aciertos1er === decisiones.length,
      });
    }
  };

  if (terminado) return null;

  return (
    <div className={styles.bossWrap}>
      <div className={styles.bossHeader}>
        <span className={styles.bossBadge}>BOSS</span>
        <h4 className={styles.bossTitle}>{config.titulo}</h4>
      </div>
      <div className={styles.bossEscenario}>{config.escenario}</div>

      <div className={styles.bossProgreso}>
        Decisión {paso + 1} de {decisiones.length}
      </div>

      <p className={styles.mjPregunta}>{actual.pregunta}</p>
      <div className={styles.mjOptions}>
        {opciones.map((o) => {
          const esElegida = elegida === o.id;
          const cls = [styles.mjOption];
          if (resueltoPaso && o.correcta) cls.push(styles.mjOptionCorrect);
          else if (esElegida && !o.correcta) cls.push(styles.mjOptionWrong);
          return (
            <button
              key={o.id}
              className={cls.join(' ')}
              onClick={() => responder(o.id)}
              disabled={resueltoPaso}
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
        </p>
      )}

      {resueltoPaso && (
        <button className={styles.mjCheckBtn} onClick={avanzar}>
          {paso + 1 < decisiones.length ? 'Siguiente decisión →' : 'Cerrar el caso'}
        </button>
      )}
    </div>
  );
}
