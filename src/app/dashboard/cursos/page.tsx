import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/DashboardLayout';
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
    /* Bacteria SVG — tomado del proyecto de referencia (MedGO) */
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
    activo: false,
    /* Pill SVG — tomado del proyecto de referencia (MedGO) */
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
    id: 'cardiologia',
    nombre: 'Cardiología | UPCH',
    badge: 'Cardiología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 1,500 preguntas totales.',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    activo: false,
    /* Heart / blood-drop SVG */
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 2 7 7 7 13c0 3 2.5 5.5 5 5.5s5-2.5 5-5.5c0-6-5-11-5-11z"
          fill="#d44a4a" stroke="#d44a4a" strokeWidth="1.5"/>
        <ellipse cx="10.5" cy="9" rx="1.5" ry="2" fill="rgba(255,255,255,0.3)"/>
      </svg>
    ),
  },
];

export default async function CursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}
