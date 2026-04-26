import styles from '@/styles/hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBgImg} />
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          Tu estudio médico,<br />
          <em>estructurado</em> y<br />
          personalizado.
        </h1>
        <p className={styles.heroSub}>
          Aprende cada materia exactamente como dice tu sílabo. Microbiología, Cardiología,
          Farmacología y más, con rutas de aprendizaje que siguen tu currícula universitaria.
        </p>
        <div className={styles.heroCtas}>
          <button className="btn-primary">Iniciar Sesión</button>
          <button className="btn-ghost">Explorar cursos →</button>
        </div>
      </div>
    </section>
  );
}
