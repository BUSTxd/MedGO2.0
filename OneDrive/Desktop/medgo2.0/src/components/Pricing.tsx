import styles from '@/styles/pricing.module.css';

type Feature = string | { text: string; disabled: boolean };

const plans: { name: string; price: string; period: string; features: Feature[]; btnStyle: 'primary' | 'ghost'; btnText: string; featured?: boolean; badge?: string }[] = [
  {
    name: 'Gratuito', price: 'S/ 0', period: 'Para siempre',
    features: [
      '1 curso activo', 'Lecciones básicas', 'Quizzes de práctica',
      { text: 'Sílabo personalizado', disabled: true },
      { text: 'Acceso a todos los cursos', disabled: true },
    ],
    btnStyle: 'ghost', btnText: 'Empezar gratis',
  },
  {
    name: 'Interno', price: 'S/ 39', period: '/ mes',
    features: ['Todos los cursos', 'Sílabo personalizado', 'Quizzes ilimitados', 'Seguimiento de progreso', 'Soporte prioritario'],
    btnStyle: 'primary', btnText: 'Empezar ahora',
    featured: true, badge: 'Popular',
  },
  {
    name: 'Residente', price: 'S/ 299', period: '/ año · Ahorra 38%',
    features: ['Todo lo de Estudiante', 'Exámenes simulacro', 'Flashcards AI', 'Descarga offline', 'Comunidad exclusiva'],
    btnStyle: 'ghost', btnText: 'Elegir Pro',
  },
];

export default function Pricing() {
  return (
    <section id="precios" className={styles.section}>
      <div className="section-inner reveal">
        <span className="section-tag">Planes y Precios</span>
        <h2 className="section-title">
          Invierte en tu<br />
          <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>carrera médica.</em>
        </h2>
        <p className="section-sub">Sin contratos largos. Cancela cuando quieras.</p>
        <div className={styles.grid}>
          {plans.map((p, i) => (
            <div className={`${styles.card} ${p.featured ? styles.featured : ''}`} key={i}>
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
              <div className={styles.planName}>{p.name}</div>
              <div className={styles.price}>{p.price} <span>{p.period}</span></div>
              <ul className={styles.features}>
                {p.features.map((f, j) => {
                  const disabled = typeof f !== 'string' && f.disabled;
                  const text = typeof f === 'string' ? f : f.text;
                  return <li key={j} className={disabled ? styles.disabled : ''}>{text}</li>;
                })}
              </ul>
              <button className={`${styles.btn} ${p.btnStyle === 'primary' ? styles.btnPrimary : styles.btnGhost}`}>
                {p.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
