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
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 0 511.96 511.96" fill="#b04040">
        <path d="M217.751,287.96c-19.84,1.707-41.92,5.44-61.333,8.853c-8.64,1.493-17.067,2.88-24.747,4.16c-5.867,0.747-9.92,6.08-9.173,11.947c0.747,5.867,6.08,9.92,11.947,9.173c0.107,0,0.32,0,0.427-0.107c7.893-1.173,16.32-2.667,25.173-4.16c19.413-3.307,39.36-6.827,57.92-8.427c-4.053,12.587-26.027,41.28-33.813,51.413l-4.587,5.973c-3.52,4.693-2.667,11.413,2.027,14.933c4.693,3.52,11.413,2.667,14.933-2.027l4.48-5.867c31.147-40.64,44.587-62.507,36.693-76.907C235.778,292.973,230.444,286.893,217.751,287.96z"/>
        <path d="M218.391,233.133c3.093-17.707-14.4-35.84-69.44-71.68c-4.907-3.307-11.52-2.027-14.827,2.88c-3.307,4.907-2.027,11.52,2.88,14.827c0.107,0.107,0.213,0.107,0.213,0.107c56.32,36.693,60.16,47.573,60.053,50.027c-2.56,6.507-35.733,14.293-62.4,20.587c-8,1.92-16.427,3.84-25.387,6.08c-5.76,1.387-9.173,7.147-7.787,12.907s7.147,9.173,12.907,7.787c8.853-2.133,17.387-4.16,25.28-5.973C188.204,259.373,214.871,253.187,218.391,233.133z"/>
        <path d="M266.391,106.413c0,0.213,0,0.213-0.107,0.213c-5.76,1.067-9.707,6.613-8.64,12.373c2.667,15.04,4.16,37.227,3.52,50.347l-3.093-1.067c-2.133-0.853-4.48-1.707-6.933-2.453c-22.4-7.04-47.573-22.933-69.227-37.653c-4.8-3.413-11.413-2.347-14.933,2.453c-3.52,4.8-2.347,11.413,2.453,14.933c0.213,0.107,0.32,0.213,0.533,0.32c22.933,15.573,49.813,32.427,74.773,40.32c2.027,0.64,4.053,1.387,5.973,2.027c4.587,1.707,9.493,3.52,14.4,3.52c3.2,0,6.293-0.853,8.96-2.56c7.467-4.8,8.107-14.08,8.32-17.173c0.96-14.613-0.64-39.573-3.733-56.853C277.698,109.4,272.258,105.453,266.391,106.413z"/>
        <path d="M505.857,381.613c-21.333-82.56-71.04-118.507-111.04-147.413c-11.413-8.32-22.4-16.32-31.893-24.747c37.547-39.36,69.333-99.627,55.04-147.2c-6.4-21.227-24.853-48.64-76.48-58.133C239.938-14.653,107.138,29.08,39.618,169.347C2.071,247.32-5.076,330.52,20.098,397.613c17.173,45.867,47.893,79.36,88.747,96.747c27.413,11.733,54.72,17.6,82.027,17.6c35.947,0,71.573-10.133,106.56-30.507c70.933-41.173,97.28-97.813,73.707-156.587c1.707-0.107,3.307-0.107,4.907,0l2.56,0.107c15.04,0.64,50.347,2.133,76.267,73.067c3.733,10.56,13.76,17.707,24.96,17.813c1.707,0,3.413-0.213,5.013-0.533c7.253-1.493,13.547-5.76,17.493-12.053C506.497,396.76,507.671,388.973,505.857,381.613z M484.418,391.853c-0.747,1.28-2.027,2.24-3.52,2.56c-2.667,0.427-5.12-1.173-5.867-3.733c-30.827-84.373-79.467-86.4-95.467-87.04l-2.133-0.107c-33.6-2.133-100.373,20.48-146.24,90.453c-3.2,4.907-1.92,11.52,3.093,14.827c4.907,3.2,11.52,1.92,14.827-3.093c30.187-46.08,70.507-69.013,100.587-77.227c22.933,50.88,1.387,97.28-62.72,134.613c-55.467,32.213-112.533,36.16-169.493,11.84c-35.413-15.147-62.08-44.373-77.227-84.693c-22.827-60.8-15.787-139.84,18.773-211.52c62.4-130.24,184.96-170.987,278.507-153.707c32.96,6.08,53.12,20.693,59.947,43.307c11.2,37.44-15.36,89.707-49.173,125.547c-10.027-15.893-10.987-49.92-11.733-75.413c-0.107-4.267-0.213-8.427-0.427-12.373c-0.107-5.76-4.907-10.347-10.667-10.24c-0.107,0-0.213,0-0.427,0c-5.867,0.213-10.453,5.12-10.24,11.093c0.107,3.84,0.213,7.893,0.427,12.16c0.96,34.133,2.027,72.853,19.307,92.48c13.227,15.04,29.973,27.093,47.787,39.893c39.147,28.267,83.52,60.373,102.933,135.467C485.591,388.653,485.271,390.36,484.418,391.853z"/>
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
