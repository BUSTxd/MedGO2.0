import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/farmacologia';
import { planRank } from '@/lib/plans';
import { getCachedPlanState } from '@/lib/plans-server';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  FARMACOCINETICA: 'Farmacocinética',
  FARMACODINAMIA:  'Farmacodinamia',
  SN_VEGETATIVO:   'Sistema nervioso vegetativo',
  ANTIBIOTICOS:    'Antibióticos / Antimicóticos',
  EVALUACION:      'Evaluación',
};

export default async function FarmacologiaPage() {
  const plan = await getCachedPlanState();
  const hasInterno = plan.isActive && planRank(plan.plan) >= planRank('interno');

  return (
    <div className={styles.microPage}>
      {/* Decorative icon — top right corner */}
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 0 24 24" fill="none">
        <g transform="rotate(135 12 12)">
          <rect x="4" y="8" width="16" height="8" rx="4" fill="#5445d8" stroke="#5445d8" strokeWidth="1.5"/>
          <path d="M12 8v8" stroke="white" strokeWidth="1.5"/>
        </g>
      </svg>
      <div className={styles.container}>
        <Link href="/dashboard/cursos" className={styles.backLink}>
          ← Mis cursos
        </Link>

        {/* Course header */}
        <div className={styles.courseHeader}>
          <h1 className={styles.courseTitle}>{curso.nombre}</h1>
          <p className={styles.courseSubtitle}>{curso.codigo} · {curso.carrera}</p>
          <div className={styles.courseMeta}>
            <span className={styles.metaItem}>{curso.duracion}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.creditos}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.coordinadora}</span>
          </div>
        </div>

        {/* Fórmula de evaluación */}
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>Evaluación</span>
          <div className={styles.formulaItems}>
            <span className={styles.formulaChip}><strong>Conocimiento 50%</strong> — Ex 1 (20%) + Ex 2 (30%) + Ex 3 (30%) + Pasos cortos (20%)</span>
            <span className={styles.formulaChip}><strong>Desempeño 50%</strong> — Labs (50%) + SGP (25%) + Seminarios (25%)</span>
            <span className={styles.formulaChip}>Aprobar ambos componentes con mínimo <strong>11.00</strong></span>
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
              const isLab = act.tipo === 'LAB';
              const isLocked = !isLab && !hasInterno;

              return (
                <Link
                  key={act.id}
                  href={`/dashboard/cursos/farmacologia/${act.id}`}
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
