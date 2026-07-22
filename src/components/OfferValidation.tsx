import Image from 'next/image';
import styles from '@/styles/offerValidation.module.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const features = [
  'Responsive en cualquier celular, tablet o computadora — sin instalar nada.',
  'Modelos 3D interactivos: gira, acerca y explora cada estructura con el dedo.',
  'Rendimiento fluido dentro del navegador, incluso en gama media.',
];

export default function OfferValidation() {
  return (
    <section id="garantias" className={styles.section}>
      <div className="section-inner reveal">
        <div className={styles.split}>
          <div className={styles.copy}>
            <span className="section-tag" style={{ color: '#2DC99A' }}>Estudia donde sea</span>
            <h2 className={styles.heading}>
              Anatomía en 3D,<br />
              <em style={{ fontStyle: 'normal', color: '#2DC99A' }}>en la palma de tu mano.</em>
            </h2>
            <p className={styles.sub}>
              MedGO se adapta a la pantalla de cualquier dispositivo y carga modelos 3D
              interactivos directo en la web. Rota, acerca y despieza cada estructura para
              estudiar de la mejor manera, donde estés.
            </p>
            <ul className={styles.list}>
              {features.map((f) => (
                <li key={f} className={styles.item}>
                  <span className={styles.check}><CheckIcon /></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.visual}>
            <Image
              src="/assets/lab-3d-phone.webp"
              alt="MedGO en un celular mostrando un modelo 3D interactivo del ojo"
              width={838}
              height={875}
              sizes="(max-width: 900px) 80vw, 440px"
              className={styles.phone}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
