import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/inmunologia';
import { planUnlocks } from '@/lib/plans';
import { getCachedPlanState } from '@/lib/plans-server';
import ImmuneIcon from '@/components/icons/ImmuneIcon';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  INNATA:          'Sistema inmune e inflamación',
  ADAPTATIVA:      'Respuesta inmune',
  INMUNOPATOLOGIA: 'Introducción a inmunopatología',
  EVALUACION:      'Evaluación',
};

export default async function InmunologiaPage() {
  const plan = await getCachedPlanState();
  // Los tramos están separados: un plan de UFBI no abre cursos de la Facultad
  // (ni al revés), así que se decide con planUnlocks y no comparando rangos.
  // `allAccess` (admin) va primero: su plan es del tramo medicina.
  const hasAcceso = !!plan.allAccess || (plan.isActive && planUnlocks(plan.plan, 'interno'));

  return (
    <div className={styles.microPage}>
      {/* Decorative icon — top right corner */}
      <ImmuneIcon size={160} className={styles.microPageIcon} />

      <div className={styles.container}>
        <Link href="/dashboard/cursos" className={styles.backLink}>
          ← Mis cursos
        </Link>

        {/* Course header */}
        <div className={styles.courseHeader}>
          <h1 className={styles.courseTitle}>{curso.nombre}</h1>
          <p className={styles.courseSubtitle}>{curso.carrera}</p>
          <div className={styles.courseMeta}>
            <span className={styles.metaItem}>{curso.duracion}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.unidades}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.aprobacion}</span>
          </div>
        </div>

        {/* Fórmula de evaluación — Conocimientos y Desempeño se aprueban por separado */}
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>Evaluación</span>
          <div className={styles.formulaItems}>
            <span className={styles.formulaChip}><strong>Conocimientos 50%</strong> — Examen Final 40% + TBL 10%</span>
            <span className={styles.formulaChip}><strong>Desempeño 50%</strong> — SGP 30% + Pasos cortos 10% + Histología 5% + Laboratorios 5%</span>
            <span className={styles.formulaChip}>Mínimo aprobación: <strong>11.00</strong> en cada componente · Sustitutorio máx. <strong>11</strong></span>
          </div>
        </div>

        {/* Leyenda de unidades */}
        <div className={styles.legend}>
          {Object.entries(UNIDAD_LABEL).map(([key, label]) => (
            <span key={key} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: UNIDAD_COLOR[key as keyof typeof UNIDAD_COLOR] }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* Timeline de semanas */}
        {semanas.map((semana) => (
          <section key={semana.id} className={styles.weekSection}>
            <div className={styles.weekHeader}>
              <span className={`${styles.weekLabel} ${semana.esEvaluacion ? styles.evalLabel : ''}`}>
                {semana.titulo} · {semana.fechas}
              </span>
              <div className={`${styles.weekLine} ${semana.esEvaluacion ? styles.evalLine : ''}`} />
            </div>

            {semana.actividades.map((act) => {
              const badge = TIPO_BADGE[act.tipo];
              const borderColor = UNIDAD_COLOR[act.unidad];
              const docStr = act.docentes.length > 0 ? act.docentes.join(', ') : null;
              // Las prácticas (laboratorio e histología) son libres.
              const isPractica = act.tipo === 'LAB' || act.tipo === 'HISTOLOGIA';
              // Si la card redirige a otra sección, no la bloqueamos:
              // el destino maneja su propio acceso.
              const isLocked = !isPractica && !act.linkOverride && !hasAcceso;

              const href = act.linkOverride ?? `/dashboard/cursos/inmunologia/${act.id}`;

              return (
                <Link
                  key={act.id}
                  href={href}
                  className={`${styles.activityCard} ${isLocked ? styles.activityCardLocked : ''}`}
                  aria-label={isLocked ? `${act.titulo} (bloqueado, requiere plan Interno)` : act.titulo}
                >
                  <span
                    className={styles.activityStripe}
                    style={{ background: borderColor }}
                  />
                  <div className={styles.activityBody}>
                    <div className={styles.activityTop}>
                      <span
                        className={styles.typeBadge}
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                      <span className={styles.activityName}>{act.titulo}</span>
                    </div>
                    <div className={styles.activitySub}>
                      {act.fecha}
                      {act.hora !== '—' && ` · ${act.hora}`}
                      {docStr && ` · ${docStr}`}
                    </div>
                  </div>
                  {isLocked ? (
                    <span className={styles.activityLock} title="Requiere plan Interno" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  ) : (
                    <span className={styles.activityChevron}>›</span>
                  )}
                </Link>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
