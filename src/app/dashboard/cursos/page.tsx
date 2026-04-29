import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardSidebar from '@/components/DashboardSidebar';
import styles from '@/styles/cursos.module.css';

const COURSES = [
  {
    id: 'microbiologia',
    nombre: 'Microbiología | UPCH',
    badge: 'Microbiología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#7B72D4',
    badgeBg: 'rgba(123, 114, 212, 0.15)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B72D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="#7B72D4" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'farmacologia',
    nombre: 'Farmacología | UPCH',
    badge: 'Farmacología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#4A7FD4',
    badgeBg: 'rgba(74, 127, 212, 0.15)',
    activo: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A7FD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 1 5 5c0 6-5 11-5 11S7 13 7 7a5 5 0 0 1 5-5z"/>
        <circle cx="12" cy="7" r="2" fill="#4A7FD4" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'cardiologia',
    nombre: 'Cardiología | UPCH',
    badge: 'Cardiología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 1,500 preguntas totales.',
    badgeColor: '#D44A4A',
    badgeBg: 'rgba(212, 74, 74, 0.15)',
    activo: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#D44A4A" stroke="#D44A4A" strokeWidth="0.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
];

export default async function CursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <div className={styles.qbankLayout}>
      <DashboardSidebar />

      <main className={styles.qbankMain}>
        <div className={styles.qbankPanel}>
          {/* Panel header icon */}
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
                    <span
                      className={styles.qBadge}
                      style={{ color: c.badgeColor, background: c.badgeBg }}
                    >
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
                    <span
                      className={styles.qBadge}
                      style={{ color: c.badgeColor, background: c.badgeBg }}
                    >
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
        </div>
      </main>
    </div>
  );
}
