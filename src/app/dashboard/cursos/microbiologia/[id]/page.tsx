import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/microbiologia';
import styles from '@/styles/cursos.module.css';

const UNIDAD_LABEL: Record<string, string> = {
  VIROLOGIA_MICOLOGIA: 'Virología / Micología',
  PARASITOLOGIA:       'Parasitología',
  BACTERIOLOGIA:       'Bacteriología',
  EVALUACION:          'Evaluación',
};

export default async function ActividadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = findActividad(id);
  if (!result) notFound();

  const { actividad: act, semana } = result;
  const badge = TIPO_BADGE[act.tipo];
  const borderColor = UNIDAD_COLOR[act.unidad];
  const unidadLabel = UNIDAD_LABEL[act.unidad];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/dashboard/cursos/microbiologia" className={styles.backLink}>
          ← {semana.titulo} · {semana.fechas}
        </Link>

        {/* Badges */}
        <div className={styles.detailBadgeRow}>
          <span
            className={styles.typeBadge}
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
          <span
            className={styles.unitBadge}
            style={{
              background: `${borderColor}1a`,
              color: borderColor,
            }}
          >
            {unidadLabel}
          </span>
        </div>

        {/* Title */}
        <h1 className={styles.detailTitle}>{act.titulo}</h1>

        {/* Meta row */}
        <div className={styles.detailMetaRow}>
          <span className={styles.detailMetaItem}>
            <span style={{ color: borderColor }}>◆</span>
            {act.fecha}
          </span>
          {act.hora !== '—' && (
            <span className={styles.detailMetaItem}>{act.hora}</span>
          )}
          {act.docentes.length > 0 && (
            <span className={styles.detailMetaItem}>
              {act.docentes.join(' · ')}
            </span>
          )}
        </div>

        {/* Nota de aviso */}
        {act.nota && (
          <div className={styles.notaBanner}>⚠ {act.nota}</div>
        )}

        {/* Subtemas */}
        {act.subtemas.length > 0 && (
          <div className={styles.subtemasSection}>
            <p className={styles.subtemasLabel}>Temas que cubre</p>
            <div className={styles.subtemasWrap}>
              {act.subtemas.map((t) => (
                <span key={t} className={styles.subtemaPill}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Material de estudio — en construcción */}
        <div className={styles.constructionBox}>
          <div className={styles.constructionIcon}>🔧</div>
          <p className={styles.constructionTitle}>Material de estudio en construcción</p>
          <p className={styles.constructionSub}>
            Pronto encontrarás aquí el resumen, flashcards,<br />
            preguntas de práctica y recursos bibliográficos.
          </p>
        </div>
      </div>
    </div>
  );
}
