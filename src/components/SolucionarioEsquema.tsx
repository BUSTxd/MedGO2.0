import type { EsquemaId } from '@/lib/data/solucionarios';
import styles from '@/styles/solucionario.module.css';

/*
 * Registro de diagramas del bloque `esquema`. Se dibujan inline en vez de
 * servirse como archivo .svg para que hereden el tema claro/oscuro del runner:
 * los colores salen de variables CSS del módulo, no de valores fijos.
 *
 * Los ids internos (markers, gradientes) van prefijados para que dos esquemas
 * en la misma pantalla no se pisen las definiciones.
 */

/**
 * Estados de transición SN1 y SN2. Transcripción del SVG de referencia
 * (viewBox 680×460, mismas coordenadas, radios y rótulos); lo único que cambia
 * son los colores, que pasan a variables para funcionar en ambos temas.
 *
 * Arriba, la fila SN2: Nu ··· C ··· LG entre corchetes de doble daga, con el
 * carbono a medio camino entre ambos. Abajo, la fila SN1: solo C ··· LG dentro
 * del corchete (el nucleófilo no participa del estado de transición) y, fuera
 * de él, el carbocatión plano al que se llega.
 */
function EsquemaSn1Sn2() {
  return (
    <svg
      viewBox="0 0 680 460"
      role="img"
      aria-labelledby="sol-esq-sn-title sol-esq-sn-desc"
      className={styles.esquemaSvg}
    >
      <title id="sol-esq-sn-title">Comparación de los estados de transición SN1 y SN2</title>
      <desc id="sol-esq-sn-desc">
        Diagrama esquemático mostrando el estado de transición único de SN2 (ataque por detrás,
        concertado) y el estado de transición de la etapa determinante de SN1 (ionización hacia un
        carbocatión plano).
      </desc>

      <defs>
        <marker
          id="sol-esq-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* ── SN2: un solo estado de transición, pentacoordinado ── */}
      <text x="340" y="55" textAnchor="middle" className={styles.esqDaga}>
        ‡
      </text>
      <path d="M124,85 L110,85 L110,155 L124,155" fill="none" className={styles.esqCorchete} />
      <path d="M556,85 L570,85 L570,155 L556,155" fill="none" className={styles.esqCorchete} />

      <line x1="196" y1="120" x2="318" y2="120" className={styles.esqEnlaceParcial} />
      <line x1="362" y1="120" x2="484" y2="120" className={styles.esqEnlaceParcial} />

      <text x="170" y="75" textAnchor="middle" className={styles.esqCarga}>
        δ-
      </text>
      <text x="510" y="75" textAnchor="middle" className={styles.esqCarga}>
        δ-
      </text>

      <g className={styles.esqNu}>
        <circle cx="170" cy="120" r="26" />
        <text x="170" y="120" textAnchor="middle" dominantBaseline="central">
          Nu
        </text>
      </g>
      <g className={styles.esqCarbono}>
        <circle cx="340" cy="120" r="22" />
        <text x="340" y="120" textAnchor="middle" dominantBaseline="central">
          C
        </text>
      </g>
      <g className={styles.esqSaliente}>
        <circle cx="510" cy="120" r="26" />
        <text x="510" y="120" textAnchor="middle" dominantBaseline="central">
          LG
        </text>
      </g>

      <text x="340" y="185" textAnchor="middle" className={styles.esqRotulo}>
        SN2 (concertado, un solo paso)
      </text>

      {/* ── SN1: estado de transición de la ionización, sin nucleófilo ── */}
      <text x="335" y="285" textAnchor="middle" className={styles.esqDaga}>
        ‡
      </text>
      <path d="M228,305 L214,305 L214,375 L228,375" fill="none" className={styles.esqCorchete} />
      <path d="M446,305 L460,305 L460,375 L446,375" fill="none" className={styles.esqCorchete} />

      <line x1="272" y1="340" x2="394" y2="340" className={styles.esqEnlaceParcial} />

      <text x="250" y="300" textAnchor="middle" className={styles.esqCarga}>
        δ+
      </text>
      <text x="420" y="300" textAnchor="middle" className={styles.esqCarga}>
        δ-
      </text>

      <g className={styles.esqCarbono}>
        <circle cx="250" cy="340" r="22" />
        <text x="250" y="340" textAnchor="middle" dominantBaseline="central">
          C
        </text>
      </g>
      <g className={styles.esqSaliente}>
        <circle cx="420" cy="340" r="26" />
        <text x="420" y="340" textAnchor="middle" dominantBaseline="central">
          LG
        </text>
      </g>

      <line
        x1="468"
        y1="340"
        x2="534"
        y2="340"
        className={styles.esqFlecha}
        markerEnd="url(#sol-esq-arrow)"
      />

      <g className={styles.esqCation}>
        <circle cx="560" cy="340" r="24" />
        <text x="560" y="340" textAnchor="middle" dominantBaseline="central">
          C+
        </text>
      </g>
      <text x="560" y="378" textAnchor="middle" className={styles.esqCarga}>
        (plano)
      </text>

      <text x="399" y="410" textAnchor="middle" className={styles.esqRotulo}>
        SN1 (ionización, etapa lenta y determinante)
      </text>
    </svg>
  );
}

const ESQUEMAS: Record<EsquemaId, () => React.JSX.Element> = {
  'sn1-sn2': EsquemaSn1Sn2,
};

export default function SolucionarioEsquema({ grafico }: { grafico: EsquemaId }) {
  const Grafico = ESQUEMAS[grafico];
  return <Grafico />;
}
