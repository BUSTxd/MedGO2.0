import { redirect } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Background from '@/components/Background';
import { createClient } from '@/lib/supabase/server';
import styles from '@/styles/cursos.module.css';

const COURSES = [
  {
    id: 'microbiologia',
    nombre: 'Microbiología General',
    codigo: 'M2058',
    fechas: '27 abr – 10 jul 2026',
    desc: 'Virología, Micología, Parasitología y Bacteriología.',
    color: '#7B72D4',
    bg: 'rgba(123, 114, 212, 0.12)',
    letra: '🧫',
    activo: true,
  },
  {
    id: 'cardiologia',
    nombre: 'Cardiología',
    codigo: '',
    fechas: 'Próximamente',
    desc: 'Fisiología y patología cardiovascular.',
    color: '#E07856',
    bg: 'rgba(224, 120, 86, 0.12)',
    letra: '🫀',
    activo: false,
  },
  {
    id: 'farmacologia',
    nombre: 'Farmacología',
    codigo: '',
    fechas: 'Próximamente',
    desc: 'Mecanismos de acción y farmacoterapia.',
    color: '#2DC99A',
    bg: 'rgba(45, 201, 154, 0.12)',
    letra: '💊',
    activo: false,
  },
];

export default async function CursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single();

  const nombre = profile?.full_name ?? user.email ?? 'Estudiante';
  const plan = profile?.plan ?? 'free';

  return (
    <div className={styles.page}>
      <Background />
      <header className={styles.topBar}>
        <Link href="/">
          <Logo size={44} />
        </Link>
        <div className={styles.userChip}>
          {nombre}
          <span className={styles.planPill}>{plan}</span>
        </div>
      </header>

      <div className={styles.container}>
        <p className={styles.sectionLabel}>Plataforma de estudio</p>
        <h1 className={styles.pageTitle}>Tus cursos</h1>

        <div className={styles.courseGrid}>
          {COURSES.map((c) =>
            c.activo ? (
              <Link
                key={c.id}
                href={`/dashboard/cursos/${c.id}`}
                className={`${styles.courseCard} ${styles.courseCardActive}`}
              >
                <div
                  className={styles.courseIcon}
                  style={{ background: c.bg, color: c.color }}
                >
                  {c.letra}
                </div>
                <div className={styles.courseName}>{c.nombre}</div>
                {c.codigo && <div className={styles.courseCode}>{c.codigo}</div>}
                <div className={styles.courseDates}>{c.fechas}</div>
                <div className={styles.courseDates} style={{ opacity: 0.7 }}>{c.desc}</div>
                <span className={styles.courseEnter}>Entrar al curso →</span>
              </Link>
            ) : (
              <div
                key={c.id}
                className={`${styles.courseCard} ${styles.courseCardLocked}`}
              >
                <div
                  className={styles.courseIcon}
                  style={{ background: c.bg, color: c.color }}
                >
                  {c.letra}
                </div>
                <div className={styles.courseName}>{c.nombre}</div>
                <div className={styles.courseDates}>{c.desc}</div>
                <span className={styles.comingSoon}>Próximamente</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
