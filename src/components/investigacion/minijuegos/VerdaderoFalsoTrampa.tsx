'use client';
import { useMemo, useState } from 'react';
import type { MJVerdaderoFalso } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import Icono from '../Icono';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function VerdaderoFalsoTrampa({
  config,
  onComplete,
}: {
  config: MJVerdaderoFalso;
  onComplete: (r: MinijuegoResult) => void;
}) {
  const afirmaciones = useMemo(() => shuffle(config.afirmaciones), [config]);
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>({});
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const responder = (id: string, valor: boolean) => {
    if (resuelto) return;
    setRespuestas((r) => ({ ...r, [id]: valor }));
    setVerificado(false);
  };

  const todasRespondidas = afirmaciones.every((a) => a.id in respuestas);
  const aciertos = afirmaciones.filter((a) => respuestas[a.id] === a.esVerdadera).length;
  const todoBien = aciertos === afirmaciones.length;

  const verificar = () => {
    const n = intentos + 1;
    setIntentos(n);
    setVerificado(true);
    if (todoBien) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <p className={styles.mjInstruction}>{config.instruccion}</p>

      <div className={styles.vfList}>
        {afirmaciones.map((a) => {
          const r = respuestas[a.id];
          const correcta = r === a.esVerdadera;
          const mostrarEstado = verificado && r !== undefined;
          return (
            <div
              key={a.id}
              className={`${styles.vfItem} ${
                mostrarEstado ? (correcta ? styles.vfOk : styles.vfBad) : ''
              }`}
            >
              <p className={styles.vfTexto}>{a.texto}</p>
              <div className={styles.vfBotones}>
                <button
                  className={`${styles.vfBtn} ${r === true ? styles.vfBtnSel : ''}`}
                  onClick={() => responder(a.id, true)}
                  disabled={resuelto}
                >
                  Verdadero
                </button>
                <button
                  className={`${styles.vfBtn} ${r === false ? styles.vfBtnSel : ''}`}
                  onClick={() => responder(a.id, false)}
                  disabled={resuelto}
                >
                  Falso
                </button>
              </div>
              {mostrarEstado && !correcta && (
                <p className={styles.vfExpl}>
                  <Icono name="idea" className={styles.vfExplIcon} />
                  {a.explicacion}
                </p>
              )}
              {mostrarEstado && correcta && !a.esVerdadera && (
                <p className={styles.vfExpl}>✓ {a.explicacion}</p>
              )}
            </div>
          );
        })}
      </div>

      {!resuelto && (
        <button className={styles.mjCheckBtn} onClick={verificar} disabled={!todasRespondidas}>
          Verificar
        </button>
      )}

      {verificado && !todoBien && !resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          {aciertos}/{afirmaciones.length} correctas. Revisa las marcadas en rojo e inténtalo de nuevo.
        </p>
      )}
      {resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
          ¡Todas correctas! {intentos === 1 ? '+50 XP' : '+25 XP'}
        </p>
      )}
    </div>
  );
}
