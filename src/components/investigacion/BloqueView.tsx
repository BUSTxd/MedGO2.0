'use client';
import { useState } from 'react';
import type { Bloque } from '@/lib/investigacion/types';
import TarjetaContenido from './TarjetaContenido';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

const ACENTOS = ['azul', 'purpura', 'verde'] as const;

export default function BloqueView({
  bloque,
  onDone,
}: {
  bloque: Bloque;
  onDone: () => void;
}) {
  const [hechas, setHechas] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setHechas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const total = bloque.tarjetas.length;
  const marcadas = bloque.tarjetas.filter((t) => hechas.has(t.id)).length;
  const todasHechas = marcadas === total;

  return (
    <section className={styles.bloque}>
      <header className={styles.bloqueHead}>
        <div className={styles.bloqueHeadText}>
          <h3 className={styles.bloqueTitulo}>
            {bloque.titulo}
            <span className={styles.bloqueSparkle} aria-hidden="true">
              <Icono name="destello" />
            </span>
          </h3>
          {bloque.resumen && <p className={styles.bloqueResumen}>{bloque.resumen}</p>}
        </div>

        <div className={styles.bloqueContador}>
          <span className={styles.bloqueContadorNum}>
            {marcadas} / {total}
          </span>
          <span className={styles.bloqueContadorLabel}>
            <Icono name="estrellas" />
            Fichas seleccionadas
          </span>
        </div>
      </header>

      <div className={styles.fichaGrid}>
        <span className={styles.fichaGridLinea} aria-hidden="true" />
        {bloque.tarjetas.map((t, i) => (
          <TarjetaContenido
            key={t.id}
            tarjeta={t}
            n={i + 1}
            acento={ACENTOS[i % ACENTOS.length]}
            entendido={hechas.has(t.id)}
            onEntendido={() => toggle(t.id)}
          />
        ))}
      </div>

      <div className={styles.bloqueFooter}>
        <div className={`${styles.bloqueChip} ${styles.bloqueChipXP}`}>
          <span className={styles.bloqueChipIcon}>
            <Icono name="estrellas" />
          </span>
          <span>
            <strong>+10 XP</strong>
            <br />
            al completar el bloque
          </span>
        </div>

        <button
          className={`${styles.bloqueContinuar} ${todasHechas ? styles.bloqueContinuarListo : ''}`}
          onClick={onDone}
          disabled={!todasHechas}
        >
          <span className={styles.bloqueContinuarIcon}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M21.2,11l-5.3-1l0.9-1.4C17,8.2,17,7.7,16.7,7.3S15.8,7,15.4,7.2L14,8.1l-1-5.3C12.9,2.3,12.5,2,12,2s-0.9,0.3-1,0.8l-1,5.3L8.6,7.2C8.2,7,7.7,7,7.3,7.3C7,7.7,7,8.2,7.2,8.6L8.1,10l-5.3,1C2.3,11.1,2,11.5,2,12s0.3,0.9,0.8,1l5.3,1l-0.9,1.4C7,15.8,7,16.3,7.3,16.7C7.5,16.9,7.8,17,8.1,17c0.2,0,0.4-0.1,0.6-0.2l1.4-0.9l1,5.3c0.1,0.5,0.5,0.8,1,0.8s0.9-0.3,1-0.8l1-5.3l1.4,0.9c0.2,0.1,0.4,0.2,0.6,0.2c0.3,0,0.5-0.1,0.7-0.3c0.3-0.3,0.4-0.9,0.1-1.3L15.9,14l5.3-1c0.5-0.1,0.8-0.5,0.8-1S21.7,11.1,21.2,11z M13.3,12.5c-0.4,0.1-0.7,0.4-0.8,0.8L12,15.8l-0.5-2.5c-0.1-0.4-0.4-0.7-0.8-0.8L8.2,12l2.5-0.5c0.4-0.1,0.7-0.4,0.8-0.8L12,8.2l0.5,2.5c0.1,0.4,0.4,0.7,0.8,0.8l2.5,0.5L13.3,12.5z" />
            </svg>
          </span>
          {todasHechas ? 'Continuar' : `Marca las ${total} fichas para continuar`}
        </button>

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
