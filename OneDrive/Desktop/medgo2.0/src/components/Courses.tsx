import styles from '@/styles/courses.module.css';

const courses = [
  {
    emoji: '🧫', color: '#3b9edd', bgFrom: '#0a1e35', bgTo: '#0d2a4a',
    tag: 'Ciencias básicas', tagBg: 'rgba(59,158,221,0.15)', tagColor: '#3b9edd',
    name: 'Microbiología Médica',
    desc: 'Bacterias, virus, hongos y parásitos. Cobertura completa del sílabo UNMSM y afines.',
    weeks: '14 semanas', units: '8 unidades', progress: 87,
  },
  {
    emoji: '🫀', color: '#f5a623', bgFrom: '#2a1800', bgTo: '#3d2200',
    tag: 'Clínica', tagBg: 'rgba(245,166,35,0.15)', tagColor: '#f5a623',
    name: 'Cardiología Clínica',
    desc: 'Fisiopatología, semiología cardíaca, ECG y manejo de las principales cardiopatías.',
    weeks: '12 semanas', units: '6 unidades', progress: 43,
  },
  {
    emoji: '💊', color: '#a78bfa', bgFrom: '#140d2e', bgTo: '#1e1040',
    tag: 'Farmacología', tagBg: 'rgba(167,139,250,0.15)', tagColor: '#a78bfa',
    name: 'Farmacología General',
    desc: 'Farmacocinética, farmacodinamia y grupos farmacológicos principales con enfoque clínico.',
    weeks: '16 semanas', units: '10 unidades', progress: 20,
  },
];

export default function Courses() {
  return (
    <section id="cursos">
      <div className="section-inner reveal">
        <span className="section-tag">Cursos disponibles</span>
        <h2 className="section-title">
          Materias que dominan<br />los mejores estudiantes.
        </h2>
        <p className="section-sub">Cada curso sigue la estructura de tu sílabo universitario. Aprende en el orden correcto.</p>
        <div className={styles.grid}>
          {courses.map((c, i) => (
            <div className={styles.card} key={i}>
              <div
                className={styles.banner}
                style={{ background: `linear-gradient(135deg, ${c.bgFrom}, ${c.bgTo})` }}
              >
                <span
                  className={styles.bannerEmoji}
                  style={{ filter: `drop-shadow(0 0 24px ${c.color}88)` }}
                >
                  {c.emoji}
                </span>
              </div>
              <div className={styles.body}>
                <span className={styles.tag} style={{ background: c.tagBg, color: c.tagColor }}>
                  {c.tag}
                </span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <div className={styles.meta}>
                  <div className={styles.metaItem}><div className={styles.metaDot} />{c.weeks}</div>
                  <div className={styles.metaItem}><div className={styles.metaDot} />{c.units}</div>
                </div>
                <div className={styles.progress}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${c.progress}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}99)` }}
                    />
                  </div>
                  <div className={styles.progressLabel}>
                    <span>Progreso del sílabo</span>
                    <span style={{ color: c.color, fontWeight: 600 }}>{c.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
