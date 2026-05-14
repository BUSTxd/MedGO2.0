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
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 0 511.985 511.985" fill="none">
        <path fill="#b83838" d="M260.934,163.337l11,80.373c108.325-17.297,81.482,268.275,81.482,268.275h58.437C432.915,82.057,260.934,163.337,260.934,163.337z"/>
        <path fill="#d44a4a" d="M299.121,224.897c0,0,4.125-8.765,3.719-21.296c0.406-12.53-3.719-21.312-3.719-21.312c61.67-15.562,61.67-203.167-63.857-180.371C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683C360.791,428.081,360.791,240.475,299.121,224.897z"/>
        <g style={{opacity: 0.2}}>
          <path fill="#FFFFFF" d="M256.607,405.284c-124.575-22.625-136.591-155.34-136.935-201.683c0.344-46.358,12.36-179.058,136.935-201.682c3.203-0.578,6.328-1.016,9.359-1.328c-9.25-1.062-19.468-0.718-30.702,1.328C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683c11.234,2.047,21.453,2.391,30.702,1.328C262.934,406.3,259.809,405.862,256.607,405.284z"/>
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
