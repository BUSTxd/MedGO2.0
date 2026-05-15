'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRecentClasses } from '@/components/RecentClassesProvider';
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

function formatTimer(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`;
  return `${s}s`;
}

function formatRelative(openedAt: number): string {
  const diffMs = Date.now() - openedAt;
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const d = Math.floor(hr / 24);
  return `hace ${d} d`;
}

export default function HomePage() {
  const [firstName, setFirstName] = useState('');
  const [streak, setStreak] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const { recent } = useRecentClasses();

  useEffect(() => {
    const supabase = createClient();
    // getSession reads from the local cookie — no network call
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();
      const nombre = profile?.full_name ?? session.user.email ?? 'Estudiante';
      setFirstName(nombre.split(' ')[0]);
    });
  }, []);

  useEffect(() => {
    // Guardrail: solo hacemos ping al server una vez por dia. Si ya pingamos
    // hoy mostramos el valor cacheado y nos ahorramos round-trip + 2 queries
    // (SELECT profiles + UPDATE profiles) en cada navegacion al home.
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    const lastDate = localStorage.getItem('streak_ping_date');
    const cachedStreak = localStorage.getItem('streak_value');

    if (lastDate === today && cachedStreak) {
      setStreak(Number(cachedStreak));
      return;
    }

    fetch('/api/streak/ping', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.streak === 'number') {
          setStreak(data.streak);
          localStorage.setItem('streak_ping_date', today);
          localStorage.setItem('streak_value', String(data.streak));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // El timestamp de inicio vive en sessionStorage: sobrevive a la
    // navegación entre páginas y a F5, pero se borra al cerrar la pestaña.
    const KEY = 'medgo_session_start';
    let raw = sessionStorage.getItem(KEY);
    if (!raw) {
      raw = String(Date.now());
      sessionStorage.setItem(KEY, raw);
    }
    const startedAt = Number(raw);
    const tick = () => setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className={styles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      </div>

      <div className={styles.homeDashboard}>
        {/* Welcome Panel */}
        <div
          className={styles.welcomePanel}
          style={{ backgroundImage: "url('/assets/bienvenidamedgo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className={styles.welcomeSvgBackground}>
            {SVGS.map((Icon, i) => (
              <div key={i} className={SVG_POSITIONS[i]}>
                <Icon />
              </div>
            ))}
          </div>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              BIENVENIDO A MEDGO{firstName ? `, ${firstName.toUpperCase()}` : ''}
            </h1>
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

        {/* Continuar viendo */}
        <div className={styles.dashboardPanel}>
          <h3 className={styles.dashboardPanelTitle}>Continuar viendo</h3>
          {recent.length === 0 ? (
            <p className={styles.recentExamScore}>
              Cuando abras una clase aparecerá acá.
            </p>
          ) : (
            recent.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/cursos/${c.courseSlug}/${c.id}`}
                className={styles.recentExamItem}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <p className={styles.recentExamName}>{c.title}</p>
                <p className={styles.recentExamScore}>{formatRelative(c.openedAt)}</p>
              </Link>
            ))
          )}
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
              <span className={styles.chartPct}>—</span>
              <span className={styles.chartLabel}>Próximamente</span>
            </div>
          </div>
          <div className={styles.statsMiniGrid}>
            {[
              { val: '—', label: 'Exámenes' },
              { val: formatTimer(seconds), label: 'Tiempo' },
              { val: streak === null ? '…' : String(streak), label: 'Racha' },
              { val: String(recent.length), label: 'Clases vistas' },
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
