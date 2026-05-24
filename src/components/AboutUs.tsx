import styles from '@/styles/about.module.css';

const trust = [
  'Creado por estudiantes de medicina UPCH',
  'Sílabos reales de Microbiología, Cardiovascular, Excretor y Farmacología',
  'Validado con necesidades de estudio reales, no inventado en marketing',
  'Atlas con imágenes microscópicas reales',
];

const team = [
  {
    initials: 'FD', name: 'Fernad Durand', role: 'Co-fundador & CEO',
    bio: 'Estudiante de medicina con la visión de transformar cómo los futuros médicos aprenden. Creó MedGO para que ningún sílabo quede sin cubrir.',
    color: '#3b9edd', bg: 'rgba(59,158,221,0.15)',
  },
  {
    initials: 'SC', name: 'Sofia Colchado', role: 'Co-fundadora & Directora Académica',
    bio: 'Apasionada por la educación médica de calidad. Diseña las rutas de aprendizaje y garantiza que cada contenido esté alineado con los sílabos universitarios.',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.15)',
  },
];

export default function AboutUs() {
  return (
    <section id="nosotros">
      <div className="section-inner reveal">
        <span className="section-tag">Sobre Nosotros</span>
        <h2 className="section-title">
          Creado por estudiantes,<br />
          <em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>para estudiantes.</em>
        </h2>
        <div className={styles.mission}>
          <p>
            &quot;MedGO nació de la necesidad de estudiar medicina sin una guía clara. Queremos que cada estudiante tenga una
            <span> ruta estructurada, personalizada</span> y alineada con su universidad — porque aprender medicina merece algo mejor que un PDF desordenado.&quot;
          </p>
        </div>
        <div className={styles.teamGrid}>
          {team.map((t, i) => (
            <div className={styles.teamCard} key={i}>
              <div className={styles.avatar} style={{ background: t.bg, color: t.color }}>
                {t.initials}
              </div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role} style={{ color: t.color }}>{t.role}</div>
              </div>
              <p className={styles.bio}>{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
