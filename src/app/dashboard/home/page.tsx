import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-user';
import { createClient } from '@/lib/supabase/server';
import styles from '@/styles/dashboardPages.module.css';

const BacteriaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={styles.welcomeSvg}>
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className={styles.welcomeSvg}>
    <g transform="rotate(135 12 12)">
      <rect x="4" y="8" width="16" height="8" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8v8" stroke="white" strokeWidth="1.5"/>
    </g>
  </svg>
);

const StethIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.welcomeSvg}>
    <path d="M4.8 2.3A.3.3 0 0 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 0 0 .2.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2" fill="currentColor"/>
  </svg>
);

const MicroscopeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.welcomeSvg}>
    <rect x="10" y="3" width="4" height="3" rx="0.5"/>
    <path d="M12 6v3"/>
    <rect x="9" y="9" width="6" height="3" rx="1"/>
    <circle cx="12" cy="13" r="1" fill="none"/>
    <path d="M8 10h-1v5"/>
    <rect x="6" y="15" width="6" height="1.5" rx="0.3"/>
    <path d="M4 20h12"/>
  </svg>
);

const DnaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.welcomeSvg}>
    <path d="M4 2c0 4 2 6 2 10s-2 6-2 10" strokeWidth="2.5"/>
    <path d="M20 2c0 4-2 6-2 10s2 6 2 10" strokeWidth="2.5"/>
    <line x1="7.2" y1="7" x2="16.8" y2="7" strokeWidth="1.5" strokeDasharray="1,1"/>
    <line x1="6.2" y1="12" x2="17.8" y2="12" strokeWidth="1.5" strokeDasharray="1,1"/>
    <line x1="7.2" y1="17" x2="16.8" y2="17" strokeWidth="1.5" strokeDasharray="1,1"/>
  </svg>
);

const CellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.welcomeSvg}>
    <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3.5" strokeWidth="1.2"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <ellipse cx="8" cy="8" rx="1.2" ry="0.7" fill="currentColor" opacity="0.6"/>
    <ellipse cx="16" cy="7" rx="1" ry="0.6" fill="currentColor" opacity="0.6"/>
    <ellipse cx="7" cy="16" rx="1.3" ry="0.8" fill="currentColor" opacity="0.6"/>
    <ellipse cx="16" cy="16" rx="1.1" ry="0.7" fill="currentColor" opacity="0.6"/>
  </svg>
);

const SVG_POSITIONS = [
  styles.svgPos1, styles.svgPos2, styles.svgPos3, styles.svgPos4,
  styles.svgPos5, styles.svgPos6, styles.svgPos7, styles.svgPos8,
  styles.svgPos9, styles.svgPos10, styles.svgPos11, styles.svgPos12,
];

const SVGS = [BacteriaIcon, PillIcon, StethIcon, MicroscopeIcon, DnaIcon, CellIcon,
              BacteriaIcon, PillIcon, StethIcon, MicroscopeIcon, DnaIcon, CellIcon];

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const nombre = profile?.full_name ?? user.email ?? 'Estudiante';
  const firstName = nombre.split(' ')[0];

  return (
    <>
      <div className={styles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      </div>

      <div className={styles.homeDashboard}>
        {/* Welcome Panel */}
        <div className={styles.welcomePanel}>
          <div className={styles.welcomeSvgBackground}>
            {SVGS.map((Icon, i) => (
              <div key={i} className={SVG_POSITIONS[i]}>
                <Icon />
              </div>
            ))}
          </div>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>BIENVENIDO A MEDGO, {firstName.toUpperCase()}</h1>
            <h2 className={styles.welcomeSubtitle}>Sistema DeepRecall</h2>
            <p className={styles.deeprecallDesc}>
              DeepRecall maximiza tus probabilidades de éxito practicando con preguntas reales de examen. Repite, detecta patrones y llega más seguro a tu prueba.
            </p>
          </div>
        </div>

        {/* Exam Dates */}
        <div className={styles.dashboardPanel}>
          <h3 className={styles.dashboardPanelTitle}>Próximos Exámenes</h3>
          {[
            { name: 'Examen Final', date: '15 Jul 2026' },
            { name: 'Bimestral II',  date: '30 Jun 2026' },
            { name: 'Parcial Micro', date: '20 May 2026' },
            { name: 'Quiz Farma',    date: '18 May 2026' },
          ].map((e) => (
            <div key={e.name} className={styles.examDateItem}>
              <span className={styles.examDateName}>{e.name}</span>
              <span className={styles.examDateDate}>{e.date}</span>
            </div>
          ))}
        </div>

        {/* Recent Exams */}
        <div className={styles.dashboardPanel}>
          <h3 className={styles.dashboardPanelTitle}>Historial de Pruebas</h3>
          {[
            { name: 'Microbiología – Bacterias', score: '85% · 17/20 correctas' },
            { name: 'Farmacología – SNC',        score: '92% · 23/25 correctas' },
            { name: 'Microbiología – Virus',     score: '78% · 14/18 correctas' },
          ].map((e) => (
            <div key={e.name} className={styles.recentExamItem}>
              <p className={styles.recentExamName}>{e.name}</p>
              <p className={styles.recentExamScore}>{e.score}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={`${styles.dashboardPanel} ${styles.statsPanel}`}>
          <h3 className={styles.dashboardPanelTitle}>Estadísticas</h3>
          <div className={styles.circularChartWrap}>
            <svg className={styles.circularChart} width="110" height="110" viewBox="0 0 110 110">
              <circle className={styles.circleBg} cx="55" cy="55" r="40"/>
              <circle className={styles.circleProgress} cx="55" cy="55" r="40"
                strokeDasharray="213.5 251.2"/>
            </svg>
            <div className={styles.chartCenterText}>
              <span className={styles.chartPct}>85%</span>
              <span className={styles.chartLabel}>Promedio</span>
            </div>
          </div>
          <div className={styles.statsMiniGrid}>
            {[
              { val: '24',  label: 'Exámenes' },
              { val: '12h', label: 'Tiempo' },
              { val: '7',   label: 'Racha' },
              { val: '92%', label: 'Mejor' },
            ].map((s) => (
              <div key={s.label} className={styles.statMini}>
                <div className={styles.statMiniVal}>{s.val}</div>
                <div className={styles.statMiniLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
