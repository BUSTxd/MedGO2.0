import styles from '@/styles/consequences.module.css';

const filas = [
  {
    sin: 'Buscas PDFs en 5 chats antes de empezar a estudiar.',
    con: 'Abres la clase del día y todo está ahí: subtemas, material, prácticas.',
  },
  {
    sin: 'El sílabo te dice "Micología", tú adivinas qué hongos entran.',
    con: 'Cada clase con sus subtemas, fechas, docentes y prácticas detalladas.',
  },
  {
    sin: 'Llegas al práctico sin saber distinguir Candida de Cryptococcus.',
    con: 'Practicas en el atlas con imágenes reales antes del laboratorio.',
  },
  {
    sin: 'El día antes del examen recién reconstruyes lo visto en 12 semanas.',
    con: 'Sabes qué viste, qué te falta y qué viene la próxima semana.',
  },
  {
    sin: 'Estudias más horas con peor rendimiento.',
    con: 'Estudias dirigido al sílabo real. Menos esfuerzo, más cobertura.',
  },
];

export default function Consequences() {
  return (
    <section id="comparacion">
      <div className="section-inner reveal">
        <span className="section-tag" style={{ color: '#a78bfa' }}>El antes y el después</span>
        <h2 className="section-title">
          Dos formas de cursar el ciclo.<br />
          <em style={{ fontStyle: 'normal', color: '#a78bfa' }}>Tú eliges cuál.</em>
        </h2>

        <div className={styles.table}>
          <div className={`${styles.header} ${styles.headerSin}`}>
            <span className={styles.headerLabel}>Sin MedGO</span>
          </div>
          <div className={`${styles.header} ${styles.headerCon}`}>
            <span className={styles.headerLabel}>Con MedGO</span>
          </div>

          {filas.map((f, i) => (
            <div key={i} className={styles.row}>
              <div className={`${styles.cell} ${styles.cellSin}`}>
                <span className={styles.dot} aria-hidden>×</span>
                <span>{f.sin}</span>
              </div>
              <div className={`${styles.cell} ${styles.cellCon}`}>
                <span className={styles.dot} aria-hidden>✓</span>
                <span>{f.con}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
