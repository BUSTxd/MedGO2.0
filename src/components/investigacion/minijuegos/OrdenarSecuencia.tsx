'use client';
import { useMemo, useState } from 'react';
import type { MJOrden } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import Icono from '../Icono';
import BolaCristal from './BolaCristal';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function OrdenarSecuencia({
  config,
  onComplete,
  onNext,
}: {
  config: MJOrden;
  onComplete: (r: MinijuegoResult) => void;
  onNext?: () => void;
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
  const total = orden.length;
  const enLugar = verificado ? orden.filter((p, i) => config.ordenCorrecto[i] === p.id).length : 0;

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
    <section className={styles.mjOrden}>
      {/* estrellas decorativas del panel */}
      <span className={`${styles.mjOrdenStar} ${styles.mjOrdenStar1}`} aria-hidden="true" />
      <span className={`${styles.mjOrdenStar} ${styles.mjOrdenStar2}`} aria-hidden="true" />
      <span className={`${styles.mjOrdenStar} ${styles.mjOrdenStar3}`} aria-hidden="true" />

      <header className={styles.mjOrdenHead}>
        <BolaCristal className={styles.mjOrdenBola} />
        <div className={styles.mjOrdenHeadText}>
          <h4 className={styles.mjOrdenTitulo}>{config.titulo}</h4>
          <p className={styles.mjOrdenSub}>{config.instruccion}</p>
        </div>
        <div className={styles.mjOrdenContador}>
          <span className={styles.mjOrdenContadorStar}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
            </svg>
          </span>
          <span className={styles.mjOrdenContadorTxt}>
            <strong>{enLugar} / {total}</strong>
            En su lugar
          </span>
        </div>
      </header>

      <ol className={styles.mjOrdenList}>
        {orden.map((p, i) => {
          const enPosicion = verificado && config.ordenCorrecto[i] === p.id;
          const malPosicion = verificado && config.ordenCorrecto[i] !== p.id;
          return (
            <li
              key={p.id}
              className={`${styles.mjOrdenItem} ${enPosicion ? styles.mjOrdenOk : ''} ${
                malPosicion ? styles.mjOrdenBad : ''
              }`}
            >
              <span className={styles.mjOrdenGrip} aria-hidden="true">
                <svg viewBox="0 0 16 24" width="12" height="18" fill="currentColor">
                  <circle cx="5" cy="6" r="1.6" /><circle cx="11" cy="6" r="1.6" />
                  <circle cx="5" cy="12" r="1.6" /><circle cx="11" cy="12" r="1.6" />
                  <circle cx="5" cy="18" r="1.6" /><circle cx="11" cy="18" r="1.6" />
                </svg>
              </span>
              <span className={styles.mjOrdenNum}>{i + 1}</span>
              <span className={styles.mjOrdenTexto}>{p.texto}</span>
              <span className={styles.mjOrdenCtrls}>
                <button onClick={() => mover(i, -1)} disabled={i === 0 || resuelto} aria-label="Subir">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
                <button onClick={() => mover(i, 1)} disabled={i === orden.length - 1 || resuelto} aria-label="Bajar">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      {verificado && (
        <p className={`${styles.mjOrdenAviso} ${resuelto ? styles.mjOrdenAvisoOk : ''}`}>
          {resuelto
            ? `¡Secuencia correcta! ${intentos === 1 ? '+50 XP' : '+25 XP'}`
            : 'Aún no. Las que están en verde ya están en su lugar; reordena el resto.'}
        </p>
      )}

      <div className={styles.mjOrdenFooter}>
        <div className={`${styles.bloqueChip} ${styles.bloqueChipXP}`}>
          <span className={styles.bloqueChipIcon}>
            <Icono name="estrellas" />
          </span>
          <span>
            <strong>+20 XP</strong>
            <br />
            por cada ficha marcada
          </span>
        </div>

        <div className={styles.mjOrdenContinuarWrap}>
          <span className={styles.mjOrdenOrbita} aria-hidden="true" />
          <button
            className={`${styles.mjOrdenContinuar} ${resuelto ? styles.mjOrdenContinuarListo : ''}`}
            onClick={resuelto ? onNext : verificar}
          >
            <span key={resuelto ? 'cont' : 'ver'} className={styles.mjOrdenBtnLabel}>
              {resuelto ? (
                <>
                  Continuar
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              ) : (
                'Verificar'
              )}
            </span>
          </button>
        </div>

        <div className={`${styles.bloqueChip} ${styles.bloqueChipMotiva}`}>
          <span className={styles.bloqueChipIcon}>
            <svg viewBox="0 0 512 512" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M384,449.963v-12.629c0-17.643-14.357-32-32-32h-15.104c-20.011-34.176-27.52-93.995-27.563-127.68 c3.349-6.059,6.549-11.712,9.216-16.32c17.557-30.379,44.096-99.072,44.096-133.333v-4.821c0-5.824-0.043-10.347-0.192-14.293 c0.085-0.619,0.192-1.728,0.192-2.219C362.645,47.851,314.795,0,255.979,0S149.312,47.851,149.312,106.667 c0,13.141,2.645,25.835,7.189,37.696c0.043,0.235-0.021,0.448,0.021,0.661l46.763,185.749 c-9.493,31.296-23.019,62.037-28.779,74.56H160c-17.643,0-32,14.357-32,32v12.629c-12.395,4.416-21.333,16.149-21.333,30.037 v21.333c0,5.888,4.779,10.667,10.667,10.667h277.333c5.888,0,10.667-4.779,10.667-10.667V480 C405.333,466.112,396.395,454.379,384,449.963z M277.333,128.021c2.603,0,5.035,0.64,7.36,1.493 c0.683,0.256,1.344,0.576,2.005,0.896c1.579,0.789,3.029,1.792,4.352,2.944c0.576,0.512,1.216,0.917,1.749,1.472 c3.584,3.819,5.888,8.875,5.888,14.528c0,11.755-9.557,21.333-21.333,21.333c-8.128-0.021-14.955-4.736-18.56-11.413 c-0.469-0.853-0.96-1.685-1.301-2.56c-0.853-2.325-1.493-4.757-1.493-7.36C256,137.6,265.557,128.021,277.333,128.021z M189.781,189.504c3.84,3.051,7.893,5.845,12.203,8.384c5.717,29.824,11.371,61.077,11.371,79.467c0,1.536-0.149,3.2-0.235,4.821 L189.781,189.504z M197.952,405.333c12.395-27.968,36.715-87.979,36.715-128c0-21.312-6.187-54.741-12.629-88.043 c0-0.021,0-0.021,0-0.043l-1.408-7.296c-1.579-8.128-3.307-17.088-4.949-25.984c-1.387-7.467-2.645-14.741-3.733-21.611 c-0.299-1.899-0.64-3.904-0.917-5.717c3.093,7.765,6.784,16.491,11.328,24.96c0.235,0.427,0.469,0.853,0.704,1.28 c2.155,3.883,4.523,7.637,7.147,11.243c0.235,0.32,0.448,0.661,0.704,0.981c8.832,11.819,20.651,21.077,37.056,23.765 c3.029,0.704,6.144,1.131,9.365,1.131c3.392,0,6.656-0.491,9.835-1.259c34.816-6.123,47.445-43.371,54.165-67.435V128 c0,27.136-23.061,91.2-42.219,124.373C285.141,276.565,256,326.933,256,373.333c0,5.888,4.779,10.667,10.667,10.667 s10.667-4.779,10.667-10.667c0-18.453,5.696-38.144,13.12-56.512c3.157,28.267,9.728,61.973,22.123,88.512H197.952z" />
            </svg>
          </span>
          <span>Sigue así, estás construyendo tu conocimiento.</span>
        </div>
      </div>
    </section>
  );
}
