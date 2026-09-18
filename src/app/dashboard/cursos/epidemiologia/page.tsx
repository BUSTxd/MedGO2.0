import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, UNIDAD_LABEL, TIPO_BADGE, EXAMENES } from '@/lib/data/epidemiologia';
import { cursoEsGratis, requiredPlanDeCurso, tieneAccesoA } from '@/lib/acceso';
import { getCachedPlanState } from '@/lib/plans-server';
import HospitalIcon from '@/components/icons/HospitalIcon';
import styles from '@/styles/cursos.module.css';

export default async function EpidemiologiaPage() {
  const plan = await getCachedPlanState();
  // Curso `gratis`: abierto para cualquier cuenta, sin pasar por el plan.
  const hasAcceso = cursoEsGratis('epidemiologia') || tieneAccesoA(plan, requiredPlanDeCurso('epidemiologia'));

  return (
    <div className={styles.microPage}>
      {/* Ícono decorativo del curso — esquina superior derecha */}
      <HospitalIcon size={160} className={styles.microPageIcon} style={{ color: '#8b5cf6' }} />

      <div className={styles.container}>
        <Link href="/dashboard/cursos" className={styles.backLink}>
          ← Mis cursos
        </Link>

        {/* Encabezado del curso */}
        <div className={styles.courseHeader}>
          <h1 className={styles.courseTitle}>{curso.nombre}</h1>
          <p className={styles.courseSubtitle}>{curso.carrera}</p>
          <div className={styles.courseMeta}>
            <span className={styles.metaItem}>{curso.ciclo}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.duracion}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>{curso.unidades}</span>
          </div>
        </div>

        {/* Exámenes presenciales: el horario no trae los pesos, sólo las fechas */}
        <div className={styles.formulaCard}>
          <span className={styles.formulaLabel}>Evaluación</span>
          <div className={styles.formulaItems}>
            {EXAMENES.map((e) => (
              <span key={e.id} className={styles.formulaChip}>
                <strong>{e.titulo}</strong> — {e.fecha}
              </span>
            ))}
          </div>
        </div>

        {/* Leyenda de módulos */}
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

            {semana.aviso && <div className={styles.notaBanner}>{semana.aviso}</div>}

            {semana.actividades.map((act) => {
              const badge = TIPO_BADGE[act.tipo];
              const borderColor = UNIDAD_COLOR[act.unidad];
              const docStr = act.docentes.length > 0 ? act.docentes.join(', ') : null;
              const isLocked = !hasAcceso;

              return (
                <Link
                  key={act.id}
                  href={`/dashboard/cursos/epidemiologia/${act.id}`}
                  className={`${styles.activityCard} ${isLocked ? styles.activityCardLocked : ''}`}
                  aria-label={isLocked ? `${act.titulo} (bloqueado, requiere plan Interno)` : act.titulo}
                >
                  <span className={styles.activityStripe} style={{ background: borderColor }} />
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
