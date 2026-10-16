import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, UNIDAD_LABEL, TIPO_BADGE, esPractica } from '@/lib/data/respiratorio';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

export default async function RespiratorioActividadPage({
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

  // Las prácticas (anatomía e histología) son libres; el resto pide el plan
  // Interno. La misma regla vive en `LIBRE` de `acceso-resumen.ts`.
  const libre = esPractica(act);
  const [user, planState] = await Promise.all([
    getUser(),
    libre ? Promise.resolve({ plan: 'free' as const, isActive: true }) : getCachedPlanState(),
  ]);

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="respiratorio" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/respiratorio" className={styles.backLink}>
          ← {semana.titulo}
        </Link>

        <div className={styles.detailBadgeRow}>
          <span className={styles.typeBadge} style={{ background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
          <span className={styles.unitBadge} style={{ background: `${borderColor}1a`, color: borderColor }}>
            {UNIDAD_LABEL[act.unidad]}
          </span>
        </div>

        <h1 className={styles.detailTitle}>{act.titulo}</h1>

        <div className={styles.detailMetaRow}>
          <span className={styles.detailMetaItem}>
            <span style={{ color: borderColor }}>◆</span>
            {act.fecha}
          </span>
          {act.hora !== '—' && <span className={styles.detailMetaItem}>{act.hora}</span>}
          {act.docentes.length > 0 && (
            <span className={styles.detailMetaItem}>{act.docentes.join(' · ')}</span>
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
          resumenFormato={act.resumen?.formato}
          resumenTitulo={act.titulo}
          /* En las prácticas la primera tarjeta es «Simulación». */
          simulacion={libre ? (act.simulacion ?? {}) : undefined}
        />
      </div>
    </div>
  );

  if (libre) return detail;

  return (
    <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
