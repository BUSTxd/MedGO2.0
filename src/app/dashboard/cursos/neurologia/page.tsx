import Link from 'next/link';
import { semanas, curso, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/neurologia';
import { planRank } from '@/lib/plans';
import { getCachedPlanState } from '@/lib/plans-server';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  UNIDAD_1:   'Anatomía de la Cabeza y SN',
  UNIDAD_2:   'Estructura y Función Neuronal',
  UNIDAD_3:   'Sistema Motor y Sensorial',
  UNIDAD_4:   'Regulación Interna y Cerebro',
  UNIDAD_5:   'LCR y Circulación Cerebral',
  EVALUACION: 'Evaluación',
};

export default async function NeurologiaPage() {
  const plan = await getCachedPlanState();
  const hasInterno = plan.isActive && planRank(plan.plan) >= planRank('interno');

  return (
    <div className={styles.microPage}>
      {/* Cerebro decorativo — esquina superior derecha */}
      <svg className={styles.microPageIcon} width="160" height="160" viewBox="0 0 511.989 511.989" fill="none">
        <defs>
          <radialGradient id="bGrdP" cx="50%" cy="46%" r="54%">
            <stop offset="0%"   stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#d44a4a" />
          </radialGradient>
        </defs>
        <path
          fill="url(#bGrdP)"
          d="M489.333,255.088l-21.344-17.625l8-34.671l4-18.812l-30.656-42.141l6.656-22.53l-8-38.483
          l-30.655-30.077h-39.999c0,0-22.655,12.312-16,0c6.672-12.328-33.326-36.577-33.326-36.577h-17.328l-40.663,15.483l-9.602,7.828
          l-31.062-23.702h-30.672l-23.999,0.391l-20.929,23.312L150.41,50.75h-22.383l-23.998,10.654L66.694,73.295l-6.664,29.358
          l-5.336,42.577l-19.999,22.891v26.516l12.397,37.623l-12.397,16.547l-18.664,22.672v41.326l18.664,29.984v36.67l23.999,55.999
          c0,0,35.999,18.672,41.335,21.327c5.328,2.672,14.664,0,14.664,0l29.327,32l27.999,9.328h21.336l42.663-18.656l24.397-18.672
          l10.664,24l42.257,13.328h21.344l31.998-6.656l21.719-38.671l11.609,3.999l38.67-7.999l28-28.327l10.656-46.327v-31.343
          l17.718-20.156l10.281-35.171L489.333,255.088z"
        />
        <path
          fill="#b83030"
          opacity="0.85"
          d="M511.973,294.009c0-24.546-12.891-46.093-32.28-58.218c7.984-11.203,12.672-24.905,12.672-39.701
          c0-22.203-10.562-41.938-26.938-54.453c2.625-7.655,4.078-15.858,4.078-24.42c0-41.281-33.484-74.749-74.764-74.749
          c-8.344,0-16.375,1.375-23.875,3.906C363.21,19.594,338.554,0,309.321,0c-22.266,0-41.858,11.359-53.327,28.608
          C244.525,11.359,224.925,0,202.667,0c-29.233,0-53.889,19.594-61.537,46.374c-7.5-2.531-15.531-3.906-23.89-3.906
          c-41.288,0-74.757,33.468-74.757,74.749c0,8.562,1.445,16.765,4.086,24.42c-16.382,12.516-26.952,32.25-26.952,54.453
          c0,14.796,4.695,28.498,12.672,39.701c-19.383,12.125-32.273,33.672-32.273,58.218c0,21.327,9.727,40.374,24.984,52.952
          c-2.375,8.375-3.656,17.202-3.656,26.343c0,52.53,42.194,95.185,94.537,95.966c13.405,25.406,40.069,42.719,70.787,42.719
          c29.632,0,55.506-16.125,69.326-40.062c13.82,23.938,39.687,40.062,69.327,40.062c30.718,0,57.389-17.312,70.795-42.719
          c52.342-0.781,94.529-43.436,94.529-95.966c0-9.141-1.281-17.968-3.656-26.343C502.238,334.383,511.973,315.336,511.973,294.009z
          M186.668,490.644c-32.351,0-58.663-26.312-58.663-58.654c0-16.406,7.195-31.688,18.078-42.344c2.008-1.938,3.25-4.641,3.25-7.656
          c0-5.891-4.773-10.655-10.664-10.655c-2.906,0-5.547,1.156-7.469,3.047c-15.569,14.593-24.53,34.577-24.53,57.608
          c0,5.265,0.516,10.421,1.492,15.405c-16.469-2-31.702-9.391-43.616-21.312c-14.102-14.094-21.867-32.844-21.867-52.78
          c0-19.952,7.766-38.702,21.867-52.796c14.102-14.109,32.851-21.875,52.796-21.875c6.351,0,12.585,0.781,18.585,2.312
          c0.883,0.234,1.797,0.375,2.742,0.375c5.891,0,10.664-4.78,10.664-10.671c0-5.203-3.727-9.531-8.656-10.469
          c-7.477-1.875-15.289-2.875-23.335-2.875c-35.805,0-67.03,19.608-83.529,48.655c-7.734-8.422-12.469-19.641-12.469-31.952
          c0-16.406,8.32-31.405,22.265-40.14l9.789-6.125c2.898-1.906,4.812-5.188,4.812-8.922c0-2.266-0.719-4.391-1.938-6.109l-6.609-9.297
          c-5.695-7.999-8.711-17.452-8.711-27.326c0-13.922,6.07-26.453,15.695-35.094c13.578,18.766,35.655,30.984,60.593,30.984
          c5.89,0,10.765-4.781,10.765-10.672s-4.844-10.656-10.733-10.656c-29.453,0-53.452-23.969-53.452-53.436
          c0-29.453,23.968-53.422,53.421-53.422c7.679,0,14.976,1.641,21.585,4.562c2.242,33.312,29.968,59.624,63.842,59.624
          c5.891,0,10.664-4.766,10.664-10.671c0-5.891-4.773-10.657-10.664-10.657c-23.522,0-42.663-19.14-42.663-42.671
          c0-23.515,19.133-42.655,42.663-42.655c23.523,0,42.663,19.141,42.663,42.655v106.67h-0.016
          c-0.156,5.734-4.867,10.359-10.655,10.359c-5.891,0-10.664,4.781-10.664,10.672s4.773,10.671,10.664,10.671
          c3.741,0,7.335-0.656,10.671-1.828v87.451c0,17.64-14.358,31.983-31.999,31.983c-5.891,0-10.664,4.781-10.664,10.672
          s4.773,10.672,10.664,10.672c12.008,0,23.086-3.969,31.999-10.672v101.357C245.33,464.332,219.011,490.644,186.668,490.644z
          M478.177,325.961c-16.5-29.047-47.718-48.655-83.529-48.655c-8.047,0-15.859,1-23.344,2.875c-4.922,0.938-8.656,5.266-8.656,10.469
          c0,5.891,4.781,10.671,10.672,10.671c0.953,0,1.859-0.141,2.734-0.375c6-1.531,12.25-2.312,18.594-2.312
          c19.938,0,38.687,7.766,52.795,21.875c14.109,14.094,21.859,32.844,21.859,52.796c0,19.937-7.75,38.687-21.859,52.78
          c-11.922,11.921-27.14,19.312-43.607,21.312c0.969-4.984,1.484-10.141,1.484-15.405c0-23.031-8.953-43.016-24.531-57.608
          c-1.922-1.891-4.562-3.047-7.469-3.047c-5.891,0-10.672,4.765-10.672,10.655c0,3.016,1.25,5.719,3.25,7.656
          c10.891,10.656,18.094,25.938,18.094,42.344c0,32.342-26.312,58.654-58.67,58.654c-32.344,0-58.663-26.312-58.663-58.654V330.633
          c8.914,6.703,19.991,10.672,31.991,10.672c5.906,0,10.672-4.781,10.672-10.672s-4.766-10.672-10.672-10.672
          c-17.625,0-31.991-14.344-31.991-31.983v-87.451c3.336,1.172,6.93,1.828,10.663,1.828c5.891,0,10.672-4.78,10.672-10.671
          c0-5.891-4.781-10.672-10.672-10.672c-5.78,0-10.491-4.625-10.647-10.359h-0.016V63.982c0-23.515,19.147-42.655,42.663-42.655
          s42.671,19.141,42.671,42.655c0,23.531-19.155,42.671-42.671,42.671c-5.891,0-10.672,4.767-10.672,10.657
          c0,5.905,4.781,10.671,10.672,10.671c33.874,0,61.607-26.312,63.842-59.624c6.609-2.922,13.906-4.562,21.578-4.562
          c29.468,0,53.436,23.969,53.436,53.422c0,29.467-23.999,53.436-53.467,53.436c-5.891,0-10.719,4.766-10.719,10.656
          c0,5.89,4.875,10.672,10.75,10.672c24.937,0,47.029-12.219,60.592-30.984c9.625,8.641,15.703,21.172,15.703,35.094
          c0,9.874-3.016,19.327-8.719,27.326l-6.609,9.297c-1.219,1.719-1.938,3.844-1.938,6.109c0,3.734,1.922,7.016,4.812,8.922
          l9.797,6.125c13.938,8.734,22.266,23.733,22.266,40.14C490.645,306.32,485.911,317.539,478.177,325.961z"
        />
      </svg>
      <div className={styles.container}>
        <Link href="/dashboard/cursos" className={styles.backLink}>
          ← Mis cursos
        </Link>

        {/* Encabezado del curso */}
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
            <span className={styles.formulaChip}><strong>Conocimientos 50%</strong> — Examen Parcial 30% + Examen Final 60% + TBL 10%</span>
            <span className={styles.formulaChip}><strong>Desempeño 50%</strong> — Anatomía 40% + Histología 20% + Fisiología 10% + ABP 30%</span>
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
                const isLab = ['LAB-ANAT','LAB-HISTO','TALLER-FIS','AULA-VIRTUAL','ICONOGRAFIA','REV-VIRTUAL'].includes(act.tipo);
                const isLocked = !isLab && !hasInterno;

                return (
                  <Link
                    key={act.id}
                    href={`/dashboard/cursos/neurologia/${act.id}`}
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
          ))
        }
      </div>
    </div>
  );
}
