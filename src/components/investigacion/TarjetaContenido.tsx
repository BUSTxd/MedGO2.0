'use client';
import type { TarjetaContenido as Tarjeta } from '@/lib/investigacion/types';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

export default function TarjetaContenido({
  tarjeta,
  entendido,
  onEntendido,
}: {
  tarjeta: Tarjeta;
  entendido: boolean;
  onEntendido: () => void;
}) {
  return (
    <article className={`${styles.ficha} ${entendido ? styles.fichaHecha : ''}`}>
      <header className={styles.fichaHeader}>
        <span className={styles.fichaIcono}>
          <Icono name={tarjeta.icono} />
        </span>
        <h4 className={styles.fichaTitulo}>{tarjeta.titulo}</h4>
      </header>

      <p className={styles.fichaDef}>{tarjeta.definicion}</p>

      <div className={styles.fichaBloque}>
        <span className={`${styles.fichaEtiqueta} ${styles.etCotidiano}`}>Ejemplo cotidiano</span>
        <p>{tarjeta.ejemploCotidiano}</p>
      </div>
      <div className={styles.fichaBloque}>
        <span className={`${styles.fichaEtiqueta} ${styles.etAcademico}`}>Ejemplo académico</span>
        <p>{tarjeta.ejemploAcademico}</p>
      </div>
      {tarjeta.ejemploAbsurdo && (
        <div className={styles.fichaBloque}>
          <span className={`${styles.fichaEtiqueta} ${styles.etAbsurdo}`}>Para no olvidarlo</span>
          <p>{tarjeta.ejemploAbsurdo}</p>
        </div>
      )}
      <div className={`${styles.fichaBloque} ${styles.fichaDato}`}>
        <span className={`${styles.fichaEtiqueta} ${styles.etDato}`}>Dato que sorprende</span>
        <p>{tarjeta.datoSorpresa}</p>
      </div>

      <button
        className={`${styles.fichaBtn} ${entendido ? styles.fichaBtnHecho : ''}`}
        onClick={onEntendido}
        disabled={entendido}
      >
        {entendido ? 'Entendido ✓' : 'Entendido'}
      </button>
    </article>
  );
}
