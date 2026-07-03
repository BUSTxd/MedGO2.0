'use client';
import { useMemo, useState } from 'react';
import type { MJVerdaderoFalso } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import Icono from '../Icono';
import { MJLiteStars, MJLiteHeader, MJLiteFooter } from './MJLiteChrome';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

/** Panel claro autocontenido (mismo lenguaje visual que orden/drag del nivel 2). */
export default function VerdaderoFalsoTrampa({
  config,
  onComplete,
  onNext,
}: {
  config: MJVerdaderoFalso;
  onComplete: (r: MinijuegoResult) => void;
  onNext?: () => void;
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
    <section className={styles.mjLite}>
      <MJLiteStars />

      <MJLiteHeader
        icono="balanza"
        titulo={config.titulo}
        sub={config.instruccion}
        badgeStrong={`${verificado ? aciertos : Object.keys(respuestas).length} / ${afirmaciones.length}`}
        badgeLabel={verificado ? 'Correctas' : 'Respondidas'}
      />

      <div className={styles.vfLiteList}>
        {afirmaciones.map((a, i) => {
          const r = respuestas[a.id];
          const correcta = r === a.esVerdadera;
          const mostrarEstado = verificado && r !== undefined;
          return (
            <div
              key={a.id}
              className={`${styles.vfLiteItem} ${
                mostrarEstado ? (correcta ? styles.vfLiteOk : styles.vfLiteBad) : ''
              }`}
            >
              <div className={styles.vfLiteRow}>
                <span className={styles.vfLiteNum}>{i + 1}</span>
                <p className={styles.vfLiteTexto}>{a.texto}</p>
                <div className={styles.vfLiteBtns}>
                  <button
                    className={`${styles.vfLiteBtn} ${r === true ? styles.vfLiteBtnSel : ''}`}
                    onClick={() => responder(a.id, true)}
                    disabled={resuelto}
                  >
                    Verdadero
                  </button>
                  <button
                    className={`${styles.vfLiteBtn} ${r === false ? styles.vfLiteBtnSel : ''}`}
                    onClick={() => responder(a.id, false)}
                    disabled={resuelto}
                  >
                    Falso
                  </button>
                </div>
              </div>
              {mostrarEstado && !correcta && (
                <p className={styles.vfLiteExpl}>
                  <Icono name="idea" className={styles.vfLiteExplIcon} />
                  {a.explicacion}
                </p>
              )}
              {mostrarEstado && correcta && !a.esVerdadera && (
                <p className={`${styles.vfLiteExpl} ${styles.vfLiteExplOk}`}>✓ {a.explicacion}</p>
              )}
            </div>
          );
        })}
      </div>

      {verificado && (
        <p className={`${styles.mjLiteAviso} ${resuelto ? styles.mjLiteAvisoOk : ''}`}>
          {resuelto
            ? `¡Todas correctas! ${intentos === 1 ? '+50 XP' : '+25 XP'}`
            : `${aciertos}/${afirmaciones.length} correctas. Revisa las marcadas en rojo e inténtalo de nuevo.`}
        </p>
      )}

      <MJLiteFooter
        resuelto={resuelto}
        deshabilitado={!todasRespondidas}
        onVerificar={verificar}
        onNext={onNext}
      />
    </section>
  );
}
