import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/excretor';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import ExamRunner from '@/components/ExamRunner';
import KidneyIcon from '@/components/KidneyIcon';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

const UNIDAD_LABEL: Record<string, string> = {
  UNIDAD_1:   'Histología y función glomerular',
  UNIDAD_2:   'Embriología y anatomía macro',
  UNIDAD_3:   'Micción y concentración urinaria',
  UNIDAD_4:   'Aplicación clínica y farmacología',
  EVALUACION: 'Evaluación',
};

export default async function ExcretorActividadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ examen?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const result = findActividad(id);
  if (!result) notFound();

  const { actividad: act, semana } = result;
  const badge = TIPO_BADGE[act.tipo];
  const borderColor = UNIDAD_COLOR[act.unidad];
  const unidadLabel = UNIDAD_LABEL[act.unidad];

  const isLab = act.tipo === 'LAB-HISTO' || act.tipo === 'LAB-ANAT';
  const isFreeExam = act.examen?.free === true;
  const isFreeAccess = isLab || isFreeExam;
  const [user, planState] = await Promise.all([
    getUser(),
    isFreeAccess
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);

  const examMode = sp?.examen === '1' && !!act.examen;

  if (examMode && act.examen) {
    const examNode = (
      <div className={styles.microPage}>
        <KidneyIcon className={styles.microPageIcon} />
        <ExamRunner
          examKey={act.examen.key}
          fallbackTitle={act.titulo}
          backHref={`/dashboard/cursos/excretor/${id}`}
        />
      </div>
    );
    if (isFreeAccess) return examNode;
    return (
      <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
        {examNode}
      </LockedContent>
    );
  }

  const detail = (
    <div className={styles.microPage}>
      <KidneyIcon className={styles.microPageIcon} />
      <TrackRecentClass id={act.id} courseSlug="excretor" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/excretor" className={styles.backLink}>
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
          examen={act.examen}
          examenTitle={act.titulo}
        />
      </div>
    </div>
  );

  if (isFreeAccess) return detail;

  return (
    <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
