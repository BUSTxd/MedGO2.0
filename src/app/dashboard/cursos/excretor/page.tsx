import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/excretor';
import { planRank } from '@/lib/plans';
import { getCachedPlanState } from '@/lib/plans-server';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  UNIDAD_1:   'Histología y función glomerular',
  UNIDAD_2:   'Embriología y anatomía macro',
  UNIDAD_3:   'Micción y concentración urinaria',
  UNIDAD_4:   'Aplicación clínica y farmacología',
  EVALUACION: 'Evaluación',
};

export default async function ExcretorPage() {
  const plan = await getCachedPlanState();
  const hasInterno = plan.isActive && planRank(plan.plan) >= planRank('interno');

  return (
    <div className={styles.microPage}>
      {/* Decorative kidney icon — top right corner */}
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C8.5 3 6 6.5 6 10.5C6 13.5 7.5 16 10 17.5C9.7 18 9.5 18.6 9.5 19.2C9.5 20.8 10.6 22 12 22C13.4 22 14.5 20.8 14.5 19.2C14.5 18.6 14.3 18 14 17.5C16.5 16 18 13.5 18 10.5C18 6.5 15.5 3 12 3Z"
          fill="#4a9ad4" stroke="#4a9ad4" strokeWidth="1"/>
        <path d="M12 8.5C11 8.5 10.5 9.5 10.5 11C10.5 12.5 11.2 13.5 12 13.5"
          stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
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
            <span className={styles.formulaChip}><strong>Conocimiento 50%</strong> — Examen Final 85% + TBL ×4 15%</span>
            <span className={styles.formulaChip}><strong>Desempeño 50%</strong> — Anatomía 40% + Histología 30% + ABP 30%</span>
            <span className={styles.formulaChip}>Mínimo aprobación: <strong>11.00</strong> en cada componente</span>
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
              const isLab = act.tipo === 'LAB-HISTO' || act.tipo === 'LAB-ANAT';
              const isLocked = !isLab && !hasInterno;

              return (
                <Link
                  key={act.id}
                  href={`/dashboard/cursos/excretor/${act.id}`}
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
