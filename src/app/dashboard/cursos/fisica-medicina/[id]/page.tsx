import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/fisica';
import { banqueoLabelDe } from '@/lib/material-plan';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

const UNIDAD_LABEL: Record<string, string> = {
  MECANICA:          'Mecánica',
  ONDAS_TERMO:       'Oscilaciones, ondas y termodinámica',
  ELECTROMAGNETISMO: 'Electromagnetismo',
  OPTICA_MODERNA:    'Óptica y física moderna',
  EVALUACION:        'Evaluación',
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

  // C1–C4: la tarjeta "Banqueo" se llama "Propuestos". La regla vive en
  // `material-plan.ts` para que el panel de aportes cuente el mismo nombre.
  const banqueoLabel = banqueoLabelDe('fisica-medicina', act.codigo);

  // Gating: los trabajos grupales (laboratorio virtual) son libres; clases,
  // prácticas calificadas y exámenes están detrás del plan Interno.
  const isTrabajo = act.tipo === 'TRABAJO';
  const [user, planState] = await Promise.all([
    getUser(),
    isTrabajo
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="fisica-medicina" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/fisica-medicina" className={styles.backLink}>
          ← {semana.titulo}
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
          banqueoLabel={banqueoLabel}
        />
      </div>
    </div>
  );

  if (isTrabajo) return detail;

  return (
    <LockedContent requiredPlan="ufbi" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
