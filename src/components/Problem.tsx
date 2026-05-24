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
    body: 'Diapositivas, libros, links de WhatsApp, apuntes propios. Encontrar el tema correcto te toma más que estudiarlo.',
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
    body: 'Sabes que viene "micología" pero no qué subtemas, ni cómo distinguir un Aspergillus fumigatus de un flavus en la práctica.',
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
    body: 'El día antes intentas reconstruir 12 semanas en una noche. No sabes qué te falta ni por dónde empezar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    title: 'Estudiar más horas ≠ estudiar mejor',
    body: 'Sin estructura, repites lo que ya sabes y dejas lagunas en lo importante. Más esfuerzo, menos resultado.',
  },
];

export default function Problem() {
  return (
    <section id="problema">
      <div className="section-inner reveal">
        <span className="section-tag" style={{ color: '#f5a623' }}>El problema</span>
        <h2 className="section-title">
          Estudias medicina,<br />
          <em style={{ fontStyle: 'normal', color: '#f5a623' }}>no tienes tiempo de organizarte.</em>
        </h2>
        <p className="section-sub">
          Cada ciclo arranca igual: clases en horario apretado, sílabos abiertos a interpretación,
          y tú haciendo de tu propio gestor de carpetas. Estos son los puntos donde se cae el sistema.
        </p>
        <div className={styles.grid}>
          {dolores.map((d) => (
            <div key={d.title} className={styles.card}>
              <div className={styles.iconWrap}>{d.icon}</div>
              <h3 className={styles.title}>{d.title}</h3>
              <p className={styles.body}>{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
