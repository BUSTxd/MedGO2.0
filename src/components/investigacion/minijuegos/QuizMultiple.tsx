'use client';
import { useMemo, useState } from 'react';
import type { MJQuiz } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import { MJLiteStars, MJLiteHeader, MJLiteFooter } from './MJLiteChrome';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/** Panel claro autocontenido (mismo lenguaje visual que orden/drag del nivel 2). */
export default function QuizMultiple({
  config,
  onComplete,
  onNext,
}: {
  config: MJQuiz;
  onComplete: (r: MinijuegoResult) => void;
  onNext?: () => void;
}) {
  const opciones = useMemo(() => shuffle(config.opciones), [config]);
  const [elegida, setElegida] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const seleccion = opciones.find((o) => o.id === elegida);

  const elegir = (id: string) => {
    if (resuelto) return;
    setElegida(id);
    setVerificado(false);
  };

  const verificar = () => {
    if (!seleccion) return;
    const n = intentos + 1;
    setIntentos(n);
    setVerificado(true);
    if (seleccion.correcta) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <section className={styles.mjLite}>
      <MJLiteStars />

      <MJLiteHeader
        icono="idea"
        titulo={config.titulo}
        sub="Lee con calma y elige la única respuesta correcta."
        badgeStrong={String(intentos)}
        badgeLabel={intentos === 1 ? 'Intento' : 'Intentos'}
      />

      <p className={styles.mjLitePregunta}>{config.pregunta}</p>

      <div className={styles.opLiteList}>
        {opciones.map((o, i) => {
          const esElegida = elegida === o.id;
          const cls = [styles.opLiteItem];
          if (resuelto && o.correcta) cls.push(styles.opLiteOk);
          else if (verificado && esElegida && !o.correcta) cls.push(styles.opLiteBad);
          else if (esElegida) cls.push(styles.opLiteSel);
          return (
            <button
              key={o.id}
              className={cls.join(' ')}
              onClick={() => elegir(o.id)}
              disabled={resuelto}
            >
              <span className={styles.opLiteLetra}>{LETRAS[i] ?? i + 1}</span>
              {o.texto}
            </button>
          );
        })}
      </div>

      {verificado && (
        <p className={`${styles.mjLiteAviso} ${resuelto ? styles.mjLiteAvisoOk : ''}`}>
          {resuelto
            ? `¡Correcto! ${intentos === 1 ? '+50 XP' : '+25 XP'}`
            : 'Casi. Vuelve a intentarlo — lee bien cada opción.'}
        </p>
      )}

      {resuelto && (
        <div className={styles.quizLiteExplList}>
          {opciones.map((o) => (
            <div
              key={o.id}
              className={`${styles.quizLiteExplItem} ${
                o.correcta ? styles.quizLiteExplOk : styles.quizLiteExplBad
              }`}
            >
              <strong>{o.correcta ? '✓ ' : '✗ '}{o.texto}</strong>
              <span>{o.explicacion}</span>
            </div>
          ))}
        </div>
      )}

      <MJLiteFooter
        resuelto={resuelto}
        deshabilitado={!elegida}
        onVerificar={verificar}
        onNext={onNext}
      />
    </section>
  );
}
