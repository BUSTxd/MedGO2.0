'use client';
import type { TarjetaContenido as Tarjeta } from '@/lib/investigacion/types';
import Icono from './Icono';
import Ilustracion from './Ilustracion';
import styles from '@/styles/investigacionGame.module.css';

type Acento = 'azul' | 'purpura' | 'verde';

const ACENTO_CLASS: Record<Acento, string> = {
  azul: styles.fichaAzul,
  purpura: styles.fichaPurpura,
  verde: styles.fichaVerde,
};

/** Íconos por defecto de cada sección (si la ficha no define uno propio). */
const ICONO_DEFAULT = {
  cotidiano: 'chat',
  academico: 'birrete',
  absurdo: 'chincheta',
  dato: 'destello',
};

function Seccion({
  tipo,
  etiqueta,
  icono,
  texto,
}: {
  tipo: 'cotidiano' | 'academico' | 'absurdo' | 'dato';
  etiqueta: string;
  icono: string;
  texto: string;
}) {
  return (
    <div className={`${styles.fichaSecc} ${styles[`secc_${tipo}`]}`}>
      <span className={styles.fichaSeccIcon}>
        <Icono name={icono} />
      </span>
      <div className={styles.fichaSeccBody}>
        <span className={styles.fichaSeccLabel}>{etiqueta}</span>
        <p>{texto}</p>
      </div>
    </div>
  );
}

export default function TarjetaContenido({
  tarjeta,
  n,
  acento,
  entendido,
  onEntendido,
}: {
  tarjeta: Tarjeta;
  n: number;
  acento: Acento;
  entendido: boolean;
  onEntendido: () => void;
}) {
  return (
    <article className={`${styles.ficha} ${ACENTO_CLASS[acento]} ${entendido ? styles.fichaHecha : ''}`}>
      {/* nodo conector superior */}
      <span className={styles.fichaNodo} aria-hidden="true" />

      <header className={styles.fichaHeader}>
        <div className={styles.fichaHeadText}>
          <span className={styles.fichaNum}>{n}</span>
          <h4 className={styles.fichaTitulo}>{tarjeta.titulo}</h4>
        </div>
        {tarjeta.ilustracion ? (
          <Ilustracion name={tarjeta.ilustracion} className={styles.fichaIlustracion} />
        ) : (
          <span className={styles.fichaIcono}>
            <Icono name={tarjeta.icono} />
          </span>
        )}
      </header>

      <p className={styles.fichaDef}>{tarjeta.definicion}</p>

      <div className={styles.fichaSecciones}>
        <Seccion
          tipo="cotidiano"
          etiqueta="Ejemplo cotidiano"
          icono={tarjeta.iconoCotidiano ?? ICONO_DEFAULT.cotidiano}
          texto={tarjeta.ejemploCotidiano}
        />
        <Seccion
          tipo="academico"
          etiqueta="Ejemplo académico"
          icono={tarjeta.iconoAcademico ?? ICONO_DEFAULT.academico}
          texto={tarjeta.ejemploAcademico}
        />
        {tarjeta.ejemploAbsurdo && (
          <Seccion
            tipo="absurdo"
            etiqueta="Para no olvidarlo"
            icono={tarjeta.iconoAbsurdo ?? ICONO_DEFAULT.absurdo}
            texto={tarjeta.ejemploAbsurdo}
          />
        )}
        <Seccion
          tipo="dato"
          etiqueta="Dato que sorprende"
          icono={tarjeta.iconoDato ?? ICONO_DEFAULT.dato}
          texto={tarjeta.datoSorpresa}
        />
      </div>

      <button
        className={`${styles.fichaCheck} ${entendido ? styles.fichaCheckOn : ''}`}
        onClick={onEntendido}
        aria-pressed={entendido}
        aria-label={entendido ? 'Ficha marcada' : 'Marcar ficha'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L19 7" />
        </svg>
      </button>
    </article>
  );
}
