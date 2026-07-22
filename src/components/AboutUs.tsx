'use client';

import Image from 'next/image';
import styles from '@/styles/about.module.css';

const team = [
  {
    initials: 'FD', name: 'Fernand Durand', role: 'Co-fundador & CEO',
    photo: '/assets/fernand.avif',
    bio: 'Estudiante de medicina con la visión de transformar cómo los futuros médicos aprenden. Creó MedGO para que ningún sílabo quede sin cubrir.',
    color: '#3b9edd', bg: 'rgba(59,158,221,0.15)',
    linkedin: 'https://www.linkedin.com/public-profile/settings/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_self_edit_contact_info%3BxSQlRK6pRRq9feHi0HxWyg%3D%3D',
  },
  {
    initials: 'SC', name: 'Sofia Colchado', role: 'Co-fundadora & Directora Académica',
    photo: '/assets/sofia.avif',
    bio: 'Apasionada por la educación médica de calidad. Diseña las rutas de aprendizaje y garantiza que cada contenido esté alineado con los sílabos universitarios.',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.15)',
    linkedin: 'https://www.linkedin.com/in/sofia-colchado/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BcB6dU1nCRqSe%2FOhKNaJg%2Bg%3D%3D',
  },
];

export default function AboutUs() {
  // Abre AMBOS perfiles en pestañas nuevas dentro del mismo gesto de clic.
  const abrirAmbos = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(team[0].linkedin, '_blank', 'noopener,noreferrer');
    window.open(team[1].linkedin, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="nosotros" className={styles.section}>
      {/* Banda de borde a borde con el lema de cómo nació MedGO */}
      <div className={styles.quoteBand}>
        <div className={styles.quoteInner}>
          <span className={styles.quoteMark} aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5 5C6.46 5 4 7.46 4 10.5V19h7.5v-8H8c0-1.93 1.57-3.5 3.5-3.5V5zm10 0C16.46 5 14 7.46 14 10.5V19h7.5v-8H18c0-1.93 1.57-3.5 3.5-3.5V5z" />
            </svg>
          </span>
          <p className={styles.quote}>
            &quot;MedGO nació de la necesidad de estudiar medicina sin una guía clara. Queremos
            que cada estudiante tenga una <span>ruta estructurada, personalizada</span>{' '}y
            alineada con su universidad — porque aprender medicina merece algo mejor que un PDF
            desordenado.&quot;
          </p>
          <div className={styles.attr}>
            <a
              className={styles.attrName}
              href={team[0].linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={abrirAmbos}
            >
              Fernand Durand &amp; Sofia Colchado
            </a>
            <span className={styles.attrSub}>Fundadores · Estudiantes de Medicina UPCH</span>
          </div>
        </div>
      </div>

      {/* Co-fundadores, fuera de la banda */}
      <div className={styles.founders}>
        <span className={styles.foundersLabel}>Los co-fundadores</span>
        <div className={styles.teamGrid}>
          {team.map((t, i) => (
            <a
              className={styles.teamCard}
              key={i}
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ['--accent' as string]: t.color } as React.CSSProperties}
            >
              <span className={styles.cardGlow} aria-hidden />
              <div className={styles.avatarRing}>
                <div className={styles.avatar}>
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={76}
                    height={76}
                    className={styles.avatarImg}
                  />
                </div>
              </div>
              <div className={styles.name}>{t.name}</div>
              <div className={styles.role} style={{ color: t.color }}>{t.role}</div>
              <p className={styles.bio}>{t.bio}</p>
              <span className={styles.linkedinHint}>Ver LinkedIn →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
