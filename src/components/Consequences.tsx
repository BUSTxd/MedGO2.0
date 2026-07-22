import Image from 'next/image';
import styles from '@/styles/consequences.module.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const ventajas = [
  'Miles de fotografías microscópicas y clínicas reales para entrenar el ojo.',
  'Atlas y laboratorios interactivos: aprendes haciendo, no solo leyendo.',
  'Modelos 3D que exploras a tu ritmo, desde cualquier dispositivo.',
];

export default function Consequences() {
  return (
    <section id="comparacion">
      <div className="section-inner reveal">
        <div className={styles.split}>
          <div className={styles.visual}>
            <Image
              src="/assets/tecnologia-interactiva.avif"
              alt="Tecnología interactiva de MedGO con miles de imágenes médicas reales"
              width={1292}
              height={855}
              sizes="(max-width: 900px) 90vw, 520px"
              className={styles.shot}
            />
          </div>

          <div className={styles.copy}>
            <span className="section-tag" style={{ color: '#a78bfa' }}>Ventaja tecnológica</span>
            <h2 className={styles.heading}>
              Tecnología interactiva y<br />
              <em style={{ fontStyle: 'normal', color: '#a78bfa' }}>miles de imágenes reales.</em>
            </h2>
            <p className={styles.sub}>
              El médico que se apoya en la tecnología aprende más rápido, retiene mejor y llega
              más preparado. Con atlas interactivos, modelos 3D y miles de fotografías reales,
              tendrás una ventaja que quienes solo estudian del PDF no tienen.
            </p>
            <ul className={styles.list}>
              {ventajas.map((v) => (
                <li key={v} className={styles.item}>
                  <span className={styles.check}><CheckIcon /></span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
