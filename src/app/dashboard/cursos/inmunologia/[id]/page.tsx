import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/inmunologia';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

const UNIDAD_LABEL: Record<string, string> = {
  INNATA:          'Sistema inmune e inflamación',
  ADAPTATIVA:      'Respuesta inmune',
  INMUNOPATOLOGIA: 'Introducción a inmunopatología',
  EVALUACION:      'Evaluación',
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

  // Gating: las prácticas (laboratorio e histología) son libres; las clases
  // magistrales / invertidas / TBL / SGP / repasos / examen están detrás del
  // plan Interno.
  const isLab = act.tipo === 'LAB';
  const isPractica = isLab || act.tipo === 'HISTOLOGIA';
  const [user, planState] = await Promise.all([
    getUser(),
    isPractica
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="inmunologia" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/inmunologia" className={styles.backLink}>
          ← {semana.titulo} · {semana.fechas}
        </Link>

        <div className={styles.detailBadgeRow}>
          <span
            className={styles.typeBadge}
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
          <span
            className={styles.unitBadge}
            style={{ background: `${borderColor}1a`, color: borderColor }}
          >
            {unidadLabel}
          </span>
        </div>

        <h1 className={styles.detailTitle}>{act.titulo}</h1>

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

        {act.nota && <div className={styles.notaBanner}>⚠ {act.nota}</div>}

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

        <StudyMaterialSection
          claseId={act.id}
          hasResumen={act.resumen?.tipo === 'pdf'}
          resumenOpciones={act.resumen?.opciones}
          /* En las prácticas de laboratorio la primera tarjeta es «Simulación». */
          simulacion={isLab ? (act.simulacion ?? {}) : undefined}
          /* Los labs no tienen banco de preguntas: sólo Simulación y Resumen. */
          hideBanqueo={isLab}
        />
      </div>
    </div>
  );

  if (isPractica) return detail;

  return (
    <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
