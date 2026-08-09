import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/quimicaOrganica';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import SinMaterialSection from '@/components/SinMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import SolucionarioRunner from '@/components/SolucionarioRunner';
import { findSolucionario } from '@/lib/data/solucionarios';
import { resumenLabelDe } from '@/lib/material-plan';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

const UNIDAD_LABEL: Record<string, string> = {
  CARBONO:       'El átomo de carbono',
  REACCIONES_I:  'Propiedades y reacciones I',
  REACCIONES_II: 'Reacciones orgánicas II',
  BIOMOLECULAS:  'Biomoléculas',
  EVALUACION:    'Evaluación',
};

export default async function ActividadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ solucionario?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const result = findActividad(id);
  if (!result) notFound();

  const { actividad: act, semana } = result;
  const badge = TIPO_BADGE[act.tipo];
  const borderColor = UNIDAD_COLOR[act.unidad];
  const unidadLabel = UNIDAD_LABEL[act.unidad];
  const solucionario = findSolucionario(act.id);

  // Gating: los laboratorios son libres; teoría, prácticas dirigidas,
  // talleres y evaluaciones están detrás del plan Interno.
  const isLab = act.tipo === 'LAB';
  const [user, planState] = await Promise.all([
    getUser(),
    isLab
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);

  const backHref = `/dashboard/cursos/quimica-organica/${id}`;

  if (sp?.solucionario === '1' && solucionario) {
    const runner = <SolucionarioRunner solucionario={solucionario} backHref={backHref} />;
    if (isLab) return runner;
    return (
      <LockedContent requiredPlan="ufbi" planState={planState} isAuthed={!!user}>
        {runner}
      </LockedContent>
    );
  }

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="quimica-organica" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/quimica-organica" className={styles.backLink}>
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

        {act.sinMaterial ? (
          <SinMaterialSection />
        ) : (
          <StudyMaterialSection
            claseId={act.id}
            hasResumen={act.resumen?.tipo === 'pdf'}
            resumenOpciones={act.resumen?.opciones}
            resumenLabel={resumenLabelDe('quimica-organica', act.tipo)}
            solucionario={
              solucionario ? { href: `${backHref}?solucionario=1` } : undefined
            }
          />
        )}
      </div>
    </div>
  );

  if (isLab) return detail;

  return (
    <LockedContent requiredPlan="ufbi" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
