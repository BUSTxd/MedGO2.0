'use client';
import { useState } from 'react';
import type { Bloque } from '@/lib/investigacion/types';
import TarjetaContenido from './TarjetaContenido';
import styles from '@/styles/investigacionGame.module.css';

export default function BloqueView({
  bloque,
  onDone,
}: {
  bloque: Bloque;
  onDone: () => void;
}) {
  const [hechas, setHechas] = useState<Set<string>>(new Set());

  const marcar = (id: string) =>
    setHechas((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const todasHechas = bloque.tarjetas.every((t) => hechas.has(t.id));

  return (
    <section className={styles.bloque}>
      <header className={styles.bloqueHead}>
        <h3 className={styles.bloqueTitulo}>{bloque.titulo}</h3>
        {bloque.resumen && <p className={styles.bloqueResumen}>{bloque.resumen}</p>}
      </header>

      <div className={styles.fichaGrid}>
        {bloque.tarjetas.map((t) => (
          <TarjetaContenido
            key={t.id}
            tarjeta={t}
            entendido={hechas.has(t.id)}
            onEntendido={() => marcar(t.id)}
          />
        ))}
      </div>

      <button className={styles.bloqueContinuar} onClick={onDone} disabled={!todasHechas}>
        {todasHechas ? 'Continuar → +10 XP' : `Marca las ${bloque.tarjetas.length} fichas para continuar`}
      </button>
    </section>
  );
}
