import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/cardiovascular';
import { planRank } from '@/lib/plans';
import { getCachedPlanState } from '@/lib/plans-server';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  UNIDAD_1:   'Anatomía cardiovascular',
  UNIDAD_2:   'Embriología e Histología',
  UNIDAD_3:   'Endotelio y músculo cardíaco',
  UNIDAD_4:   'Circulación sistémica y coronaria',
  UNIDAD_5:   'Sistema eléctrico y exploración',
  EVALUACION: 'Evaluación',
};

export default async function CardiovascularPage() {
  const plan = await getCachedPlanState();
  const hasInterno = plan.isActive && planRank(plan.plan) >= planRank('interno');

  return (
    <div className={styles.microPage}>
      {/* Decorative crossfit icon — top right corner */}
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 -137.5 1299 1299" fill="none">
        <path d="M164.854878 495.321455h188.089332l95.704278-132.953342a48.313142 48.313142 0 0 1 82.796187 7.376053l131.846934 275.495551 160.98234-411.952518a49.050747 49.050747 0 0 1 46.65353-30.795018 48.313142 48.313142 0 0 1 44.440715 33.745439l83.349391 264.431473h65.646865a594.694213 594.694213 0 0 0 38.539873-52.554372c73.760522-119.676448-9.220065-376.178665-234.005258-376.178665s-252.260987 176.656451-252.260987 176.656451-27.475795-176.656451-252.260987-176.656451S56.242509 328.438273 130.371834 448.114721a554.310327 554.310327 0 0 0 34.483044 47.206734z" fill="#F09090"/>
        <path d="M963.312534 596.742173a48.313142 48.313142 0 0 1-46.100327-33.745439l-52.738773-167.436386-151.577874 387.242743a48.313142 48.313142 0 0 1-43.334307 30.795019h-1.290809a48.313142 48.313142 0 0 1-43.518708-27.475795L479.99671 483.519771l-62.512043 86.853016a48.313142 48.313142 0 0 1-39.277478 20.099742h-131.109328c147.521045 166.883182 370.277823 394.987598 370.277822 394.987598s217.962344-221.65037 364.376982-388.717954h-18.440131z" fill="#F09090"/>
        <path d="M127.974617 498.456277H184.95462a862.629311 862.629311 0 0 1-65.093661-85.377805c-36.880261-60.483628-32.639031-158.769525 11.986085-238.799691a243.778527 243.778527 0 0 1 219.621956-130.187322c217.777943 0 247.09775 163.379557 248.204158 170.386807a22.128157 22.128157 0 0 0 43.70311 0 201.550628 201.550628 0 0 1 40.383886-84.271397c45.362721-57.164405 115.250816-86.11541 208.004673-86.11541a243.594126 243.594126 0 0 1 219.068752 130.371723c44.625116 80.030167 49.41955 178.316063 11.986085 238.799692a906.148019 906.148019 0 0 1-69.334891 90.172239h57.164405a726.909949 726.909949 0 0 0 49.603951-66.937675c45.547123-73.760522 41.121491-190.117747-10.879677-283.609209a288.772446 288.772446 0 0 0-258.161829-152.868682c-165.961176 0-238.799692 85.562206-270.147913 147.521045-31.348222-61.221234-104.555541-147.521045-269.963513-147.521045a288.772446 288.772446 0 0 0-258.161828 152.868682c-52.001168 93.491462-56.4268 210.033088-10.879678 283.609209a686.341662 686.341662 0 0 0 45.915926 61.958839zM977.142632 591.763338c-130.371724 145.861433-302.971346 324.361898-355.341317 378.391481-53.107576-55.320392-228.842021-236.402475-359.766949-383.185915h-59.008418c153.975091 175.550044 389.63996 416.746952 402.916854 430.392649a22.128157 22.128157 0 0 0 31.532624 0c13.276894-13.645697 244.516132-250.232573 398.675624-425.413813h-59.008418z" fill="#d44a4a"/>
        <path d="M262.58757 587.522108h-202.841437c-33.007834 0-59.746023 19.73094-59.746023 44.256314s26.738189 44.256313 59.746023 44.256313h282.3184zM1234.566855 592.316542h-258.161828l-76.342141 88.328226h333.950765c35.773853 0 64.724858-19.73094 64.724859-44.256314s-28.397801-44.071912-64.171655-44.071912z" fill="#d44a4a"/>
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
            <span className={styles.formulaChip}><strong>Conocimiento 50%</strong> — Examen Parcial 30% + Examen Final 60% + TBL 10%</span>
            <span className={styles.formulaChip}><strong>Desempeño 50%</strong> — Anatomía 40% + Histología 20% + Taller Fis 10% + ABP 30%</span>
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
                  href={`/dashboard/cursos/cardiovascular/${act.id}`}
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
