import styles from '@/styles/problem.module.css';

const dolores = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h6l2 2h10v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
        <path d="M7 13h10M7 16h6" />
      </svg>
    ),
    title: 'PDFs sueltos en mil carpetas',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'El sílabo es vago',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M4 9h16M9 3v4M15 3v4" />
        <path d="M8 14l3 3 5-6" />
      </svg>
    ),
    title: 'Llegas al examen sin saber qué viste',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    title: (
      <>Estudiar más horas<br />≠<br />estudiar mejor</>
    ),
  },
];

const posClass = [styles.pos0, styles.pos1, styles.pos2, styles.pos3];

export default function Problem() {
  return (
    <section id="problema">
      <div className="section-inner reveal">
        <div className={styles.layout}>
          <div className={styles.copy}>
            <span className="section-tag" style={{ color: '#f5a623' }}>El problema</span>
            <h2 className="section-title">
              Estudias medicina,<br />
              <em style={{ fontStyle: 'normal', color: '#f5a623' }}>no tienes tiempo de organizarte.</em>
            </h2>
            <p className="section-sub">
              Cada ciclo arranca igual: clases en horario apretado, sílabos abiertos a interpretación,
              y tú haciendo de tu propio gestor de carpetas. Estos son los puntos donde se cae el sistema.
            </p>
          </div>

          <div className={styles.cycle}>
          {/* Anillo central con flujo horario */}
          <div className={styles.ring} aria-hidden>
            <svg className={styles.ringSvg} viewBox="0 0 200 200" fill="none">
              <circle className={styles.ringLine} cx="100" cy="100" r="80" />
              <g className={styles.ringHead}>
                <path d="M100 12 L110 20 L100 28" transform="rotate(0 100 100)" />
                <path d="M100 12 L110 20 L100 28" transform="rotate(90 100 100)" />
                <path d="M100 12 L110 20 L100 28" transform="rotate(180 100 100)" />
                <path d="M100 12 L110 20 L100 28" transform="rotate(270 100 100)" />
              </g>
            </svg>
            <div className={styles.ringInner}>
              <span className={styles.ringKicker}>El ciclo</span>
              <span className={styles.ringLabel}>del estudio<br />desordenado</span>
            </div>
          </div>

          {dolores.map((d, i) => (
            <div key={i} className={`${styles.step} ${posClass[i]}`}>
              <div className={styles.node} aria-hidden>
                <span className={styles.nodeNum}>{i + 1}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.head}>
                  <span className={styles.icon}>{d.icon}</span>
                  <h3 className={styles.title}>{d.title}</h3>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
