import Image from 'next/image';
import styles from '@/styles/solution.module.css';

const steps = [
  {
    color: '#3b9edd',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
        <path d="M4 4v14a2 2 0 0 0 2 2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
    title: 'Sílabo digital de tu universidad',
    body: 'Cada clase con sus subtemas, fechas, docentes y materiales. Sabes exactamente qué viene la próxima semana — sin adivinar.',
  },
  {
    color: '#a78bfa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: 'Atlas y laboratorios virtuales',
    body: 'Practica identificación de hongos, parásitos y bacterias con imágenes microscópicas reales. Elige modo alternativas o escribiendo.',
  },
  {
    color: '#f5a623',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
        <path d="M14 3v6h6" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
    title: 'Resúmenes en PDF y exámenes simulados',
    body: 'Material curado clase por clase + banco de preguntas con explicaciones. Estudias dirigido a lo que sí va a venir.',
  },
];

export default function Solution() {
  return (
    <section id="solucion" className={styles.section}>
      <div className={styles.band}>
        {/* diseño de fondo */}
        <span className={styles.bgDots} aria-hidden />
        <span className={styles.bgGlowA} aria-hidden />
        <span className={styles.bgGlowB} aria-hidden />

        <div className="section-inner reveal">
          <span className="section-tag">La solución</span>
          <h2 className="section-title">
            Una plataforma que <em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>piensa por tu sílabo,</em><br />
            para que tú estudies.
          </h2>
          <p className="section-sub">
            MedGO ordena el caos: tu currícula, tus prácticas y tu banco de preguntas en un mismo lugar.
            Tres piezas que trabajan juntas.
          </p>

          <div className={styles.split}>
            <div className={styles.visual}>
              <Image
                src="/assets/solucion-drcapi.webp"
                alt="Dr. Capi, la mascota de MedGO"
                width={788}
                height={1206}
                sizes="(max-width: 900px) 60vw, 320px"
                className={styles.visualImg}
              />
            </div>

            <ul className={styles.steps}>
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={styles.step}
                  style={{ ['--c' as string]: s.color } as React.CSSProperties}
                >
                  <span className={styles.stepNum}>0{i + 1}</span>
                  <div className={styles.stepText}>
                    <h3 className={styles.title}>{s.title}</h3>
                    <p className={styles.body}>{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
