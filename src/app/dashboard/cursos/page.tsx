'use client';
import Link from 'next/link';
import styles from '@/styles/cursos.module.css';

const COURSES = [
  {
    id: 'microbiologia',
    nombre: 'Microbiología | UPCH',
    badge: 'Microbiología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#5445d8',
    badgeBg: 'rgba(84, 69, 216, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#5445d8" stroke="#5445d8" strokeWidth="2"/>
        <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'farmacologia',
    nombre: 'Farmacología | UPCH',
    badge: 'Farmacología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#5445d8',
    badgeBg: 'rgba(84, 69, 216, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <g transform="rotate(135 12 12)">
          <rect x="4" y="8" width="16" height="8" rx="4" fill="#5445d8" stroke="#5445d8" strokeWidth="1.5"/>
          <path d="M12 8v8" stroke="white" strokeWidth="1.5"/>
        </g>
      </svg>
    ),
  },
  {
    id: 'cardiovascular',
    nombre: 'Cardiovascular | UPCH',
    badge: 'Cardiovascular',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. Sistema Cardiovascular M1552.',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 21C11 20 2 14.5 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.79 3.84 11.5 5.04C12.21 3.84 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 13 20 12 21Z"
          fill="#d44a4a" stroke="#d44a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'excretor',
    nombre: 'Excretor | UPCH',
    badge: 'Excretor',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. Aparato Excretor M1554.',
    badgeColor: '#4a9ad4',
    badgeBg: 'rgba(74, 154, 212, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C8.5 3 6 6.5 6 10.5C6 13.5 7.5 16 10 17.5C9.7 18 9.5 18.6 9.5 19.2C9.5 20.8 10.6 22 12 22C13.4 22 14.5 20.8 14.5 19.2C14.5 18.6 14.3 18 14 17.5C16.5 16 18 13.5 18 10.5C18 6.5 15.5 3 12 3Z"
          fill="#4a9ad4" stroke="#4a9ad4" strokeWidth="1"/>
        <path d="M12 8.5C11 8.5 10.5 9.5 10.5 11C10.5 12.5 11.2 13.5 12 13.5"
          stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
];

export default function CursosPage() {
  return (
    <>
      <div className={styles.qbankPanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2a1 1 0 100-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
        </svg>
      </div>

      <h2 className={styles.qbankTitle}>Qbank</h2>
      <p className={styles.qbankSub}>Elige una materia o práctica y comienza.</p>

      <div className={styles.qgrid}>
        {COURSES.map((c) =>
          c.activo ? (
            <Link key={c.id} href={`/dashboard/cursos/${c.id}`} className={styles.qCard}>
              <div className={styles.qCardTop}>
                <span className={styles.qBadge} style={{ color: c.badgeColor, background: c.badgeBg }}>
                  {c.badge}
                </span>
                <span className={styles.qCardIconWrap}>{c.icon}</span>
              </div>
              <h3 className={styles.qTitle}>{c.nombre}</h3>
              <p className={styles.qSummary}>{c.desc}</p>
              <div className={styles.qDiff}>
                <span className={styles.diffEasy}>Interno (fácil)</span>
                <span className={styles.diffMed}>Residente (media)</span>
                <span className={styles.diffHard}>Especialista (difícil)</span>
              </div>
            </Link>
          ) : (
            <div key={c.id} className={`${styles.qCard} ${styles.qCardLocked}`}>
              <div className={styles.qCardTop}>
                <span className={styles.qBadge} style={{ color: c.badgeColor, background: c.badgeBg }}>
                  {c.badge}
                </span>
                <span className={styles.qCardIconWrap}>{c.icon}</span>
              </div>
              <h3 className={styles.qTitle}>{c.nombre}</h3>
              <p className={styles.qSummary}>{c.desc}</p>
              <div className={styles.qDiff}>
                <span className={styles.diffEasy}>Interno (fácil)</span>
                <span className={styles.diffMed}>Residente (media)</span>
                <span className={styles.diffHard}>Especialista (difícil)</span>
              </div>
              <span className={styles.qComingSoon}>Próximamente</span>
            </div>
          )
        )}
      </div>
    </>
  );
}
