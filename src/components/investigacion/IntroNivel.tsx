'use client';
import type { NivelContenido } from '@/lib/investigacion/types';
import styles from '@/styles/investigacionGame.module.css';

export default function IntroNivel({
  intro,
  onStart,
}: {
  intro: NivelContenido['intro'];
  onStart: () => void;
}) {
  return (
    <section className={styles.intro}>
      <span className={styles.introKicker}>{intro.kicker}</span>
      <h2 className={styles.introTitulo}>{intro.titulo}</h2>
      <p className={styles.introGancho}>{intro.gancho}</p>

      <ul className={styles.introObjetivos}>
        {intro.objetivos.map((o, i) => (
          <li key={i}>
            <span className={styles.introCheck}>◆</span>
            {o}
          </li>
        ))}
      </ul>

      <button className={styles.introBtn} onClick={onStart}>
        Empezar nivel →
      </button>
    </section>
  );
}
