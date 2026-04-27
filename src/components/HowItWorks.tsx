import styles from '@/styles/howItWorks.module.css';

const steps = [
  {
    color: '#3b9edd', bg: 'rgba(59,158,221,0.12)', num: '01',
    title: 'Avanza a la par',
    desc: 'Trabajamos con el sílabo oficial de tu universidad. MedGO te ayuda a seguir las clases y repasarlas optimizando tu día.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="4" y="2" width="13" height="17" rx="2" stroke="#3b9edd" strokeWidth="1.8" />
        <path d="M7 7h7M7 10.5h7M7 14h4.5" stroke="#3b9edd" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="19" cy="19" r="4" stroke="#3b9edd" strokeWidth="1.6" />
        <path d="M17 19h4M19 17v4" stroke="#3b9edd" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', num: '02',
    title: 'Ruta personalizada',
    desc: 'Organiza tus días semana a semana exactamente con los temas y evaluaciones de tu currícula médica.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="#a78bfa" strokeWidth="1.8" />
        <path d="M13 8v5l3.5 3.5" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13" cy="13" r="1.2" fill="#a78bfa" />
      </svg>
    ),
  },
  {
    color: '#f5a623', bg: 'rgba(245,166,35,0.12)', num: '03',
    title: 'Aprende y evalúate',
    desc: 'Estudia con lecciones, videos (beta) y quizzes. Monitorea tu progreso por unidad temática y prepárate para tus exámenes.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="#f5a623" strokeWidth="1.8" />
        <path d="M8.5 13.5L11.5 16.5L18 9.5" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.section}>
      <div className="section-inner reveal">
        <span className="section-tag">Cómo funciona</span>
        <h2 className="section-title">
          Aprende según <em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>tu sílabo</em>,<br />
          no según otros.
        </h2>
        <p className="section-sub">Tres pasos para transformar tu forma de estudiar medicina.</p>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div className={styles.stepCard} key={i}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIconWrap} style={{ background: s.bg }}>
                {s.icon}
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
