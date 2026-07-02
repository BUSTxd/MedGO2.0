'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { BossConfig } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import BossMarco from '../BossMarco';
import styles from '@/styles/investigacionGame.module.css';

export interface BossResult {
  aciertosPrimerIntento: number;
  total: number;
  sinErrores: boolean;
}

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

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
    <section className={styles.bossPanel}>
      <BossMarco className={styles.bossMarco} />

      {/* Columnas de LEDs rojos en los laterales internos */}
      <span className={`${styles.bossLeds} ${styles.bossLedsL}`} aria-hidden="true" />
      <span className={`${styles.bossLeds} ${styles.bossLedsR}`} aria-hidden="true" />

      {/* Decoración superior central sobre la plataforma */}
      <div className={styles.bossTopDeco} aria-hidden="true">
        <span className={styles.bossTopDots} />
        <Image src="/investigacion/calavera.webp" alt="" width={30} height={30} className={styles.bossTopSkull} />
        <span className={styles.bossTopDots} />
      </div>

      <div className={styles.bossInner}>
        {/* Cabecera: badge BOSS + título */}
        <header className={styles.bossHeader}>
          <span className={styles.bossBadge}>
            <Image src="/investigacion/calavera.webp" alt="" width={18} height={18} className={styles.bossBadgeSkull} />
            BOSS
          </span>
          <h4 className={styles.bossTitle}>{config.titulo}</h4>
        </header>

        {/* Escenario del caso — el minijefe apoya las manos en su borde superior */}
        <div className={styles.bossEscenario}>
          <div className={styles.bossChar} aria-hidden="true">
            <Image src="/investigacion/minijefe.avif" alt="" width={190} height={190} className={styles.bossCharImg} />
          </div>
          <p className={styles.bossEscenarioTxt}>{config.escenario}</p>
        </div>

        {/* Panel de decisiones */}
        <div className={styles.bossDecisiones}>
          <div className={styles.bossProgreso}>
            Decisión {paso + 1} de {decisiones.length}
          </div>

          <p className={styles.bossPregunta}>{actual.pregunta}</p>

          <div className={styles.bossOptions}>
            {opciones.map((o, i) => {
              const esElegida = elegida === o.id;
              const cls = [styles.bossOption];
              if (resueltoPaso && o.correcta) cls.push(styles.bossOptionCorrect);
              else if (esElegida && !o.correcta) cls.push(styles.bossOptionWrong);
              return (
                <button key={o.id} className={cls.join(' ')} onClick={() => responder(o.id)} disabled={resueltoPaso}>
                  <span className={styles.bossOptionLetra}>
                    <span className={styles.bossOptionLetraTxt}>{LETRAS[i]}</span>
                  </span>
                  <span className={styles.bossOptionTexto}>{o.texto}</span>
                </button>
              );
            })}
          </div>

          {seleccion && (
            <p
              className={`${styles.bossFeedback} ${
                seleccion.correcta ? styles.bossFeedbackOk : styles.bossFeedbackBad
              }`}
            >
              {seleccion.feedback}
            </p>
          )}

          {resueltoPaso && (
            <button className={styles.bossNext} onClick={avanzar}>
              {paso + 1 < decisiones.length ? 'Siguiente decisión →' : 'Cerrar el caso'}
            </button>
          )}
        </div>

        {/* Puntos de progreso inferiores, sobre el segmento rojo */}
        <div className={styles.bossDots} aria-hidden="true">
          {decisiones.map((_, i) => (
            <span
              key={i}
              className={`${styles.bossDot} ${i === paso ? styles.bossDotActive : ''} ${
                i < paso ? styles.bossDotDone : ''
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
