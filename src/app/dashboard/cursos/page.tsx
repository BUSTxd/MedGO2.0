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
    badgeColor: '#b04040',
    badgeBg: 'rgba(176, 64, 64, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 511.96 511.96" fill="#b04040">
        <path d="M217.751,287.96c-19.84,1.707-41.92,5.44-61.333,8.853c-8.64,1.493-17.067,2.88-24.747,4.16c-5.867,0.747-9.92,6.08-9.173,11.947c0.747,5.867,6.08,9.92,11.947,9.173c0.107,0,0.32,0,0.427-0.107c7.893-1.173,16.32-2.667,25.173-4.16c19.413-3.307,39.36-6.827,57.92-8.427c-4.053,12.587-26.027,41.28-33.813,51.413l-4.587,5.973c-3.52,4.693-2.667,11.413,2.027,14.933c4.693,3.52,11.413,2.667,14.933-2.027l4.48-5.867c31.147-40.64,44.587-62.507,36.693-76.907C235.778,292.973,230.444,286.893,217.751,287.96z"/>
        <path d="M218.391,233.133c3.093-17.707-14.4-35.84-69.44-71.68c-4.907-3.307-11.52-2.027-14.827,2.88c-3.307,4.907-2.027,11.52,2.88,14.827c0.107,0.107,0.213,0.107,0.213,0.107c56.32,36.693,60.16,47.573,60.053,50.027c-2.56,6.507-35.733,14.293-62.4,20.587c-8,1.92-16.427,3.84-25.387,6.08c-5.76,1.387-9.173,7.147-7.787,12.907s7.147,9.173,12.907,7.787c8.853-2.133,17.387-4.16,25.28-5.973C188.204,259.373,214.871,253.187,218.391,233.133z"/>
        <path d="M266.391,106.413c0,0.213,0,0.213-0.107,0.213c-5.76,1.067-9.707,6.613-8.64,12.373c2.667,15.04,4.16,37.227,3.52,50.347l-3.093-1.067c-2.133-0.853-4.48-1.707-6.933-2.453c-22.4-7.04-47.573-22.933-69.227-37.653c-4.8-3.413-11.413-2.347-14.933,2.453c-3.52,4.8-2.347,11.413,2.453,14.933c0.213,0.107,0.32,0.213,0.533,0.32c22.933,15.573,49.813,32.427,74.773,40.32c2.027,0.64,4.053,1.387,5.973,2.027c4.587,1.707,9.493,3.52,14.4,3.52c3.2,0,6.293-0.853,8.96-2.56c7.467-4.8,8.107-14.08,8.32-17.173c0.96-14.613-0.64-39.573-3.733-56.853C277.698,109.4,272.258,105.453,266.391,106.413z"/>
        <path d="M505.857,381.613c-21.333-82.56-71.04-118.507-111.04-147.413c-11.413-8.32-22.4-16.32-31.893-24.747c37.547-39.36,69.333-99.627,55.04-147.2c-6.4-21.227-24.853-48.64-76.48-58.133C239.938-14.653,107.138,29.08,39.618,169.347C2.071,247.32-5.076,330.52,20.098,397.613c17.173,45.867,47.893,79.36,88.747,96.747c27.413,11.733,54.72,17.6,82.027,17.6c35.947,0,71.573-10.133,106.56-30.507c70.933-41.173,97.28-97.813,73.707-156.587c1.707-0.107,3.307-0.107,4.907,0l2.56,0.107c15.04,0.64,50.347,2.133,76.267,73.067c3.733,10.56,13.76,17.707,24.96,17.813c1.707,0,3.413-0.213,5.013-0.533c7.253-1.493,13.547-5.76,17.493-12.053C506.497,396.76,507.671,388.973,505.857,381.613z M484.418,391.853c-0.747,1.28-2.027,2.24-3.52,2.56c-2.667,0.427-5.12-1.173-5.867-3.733c-30.827-84.373-79.467-86.4-95.467-87.04l-2.133-0.107c-33.6-2.133-100.373,20.48-146.24,90.453c-3.2,4.907-1.92,11.52,3.093,14.827c4.907,3.2,11.52,1.92,14.827-3.093c30.187-46.08,70.507-69.013,100.587-77.227c22.933,50.88,1.387,97.28-62.72,134.613c-55.467,32.213-112.533,36.16-169.493,11.84c-35.413-15.147-62.08-44.373-77.227-84.693c-22.827-60.8-15.787-139.84,18.773-211.52c62.4-130.24,184.96-170.987,278.507-153.707c32.96,6.08,53.12,20.693,59.947,43.307c11.2,37.44-15.36,89.707-49.173,125.547c-10.027-15.893-10.987-49.92-11.733-75.413c-0.107-4.267-0.213-8.427-0.427-12.373c-0.107-5.76-4.907-10.347-10.667-10.24c-0.107,0-0.213,0-0.427,0c-5.867,0.213-10.453,5.12-10.24,11.093c0.107,3.84,0.213,7.893,0.427,12.16c0.96,34.133,2.027,72.853,19.307,92.48c13.227,15.04,29.973,27.093,47.787,39.893c39.147,28.267,83.52,60.373,102.933,135.467C485.591,388.653,485.271,390.36,484.418,391.853z"/>
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
