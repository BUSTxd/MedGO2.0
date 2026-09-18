import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  findActividad,
  UNIDAD_COLOR,
  UNIDAD_LABEL,
  TIPO_BADGE,
  TIPO_DESC,
} from '@/lib/data/epidemiologia';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import SinMaterialSection from '@/components/SinMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import ExamenDeCurso from '@/components/ExamenDeCurso';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';
import { cursoEsGratis } from '@/lib/acceso';

export default async function EpidemiologiaActividadPage({
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

  const isFreeExam = act.examen?.free === true;
  // Epidemiología es curso `gratis`: abierto para cualquier cuenta.
  const isFreeAccess = isFreeExam || cursoEsGratis('epidemiologia');
  const [user, planState] = await Promise.all([getUser(), getCachedPlanState()]);

  if (sp?.examen === '1' && act.examen) {
    return (
      <ExamenDeCurso
        curso="epidemiologia"
        examen={act.examen}
        titulo={act.titulo}
        backHref={`/dashboard/cursos/epidemiologia/${id}`}
        avisoCada={3}
      />
    );
  }

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="epidemiologia" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/epidemiologia" className={styles.backLink}>
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

        <p className={styles.tipoDesc}>{TIPO_DESC[act.tipo]}</p>

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
            resumenFormato={act.resumen?.formato}
            resumenTitulo={act.titulo}
            examen={act.examen}
            examenTitle={act.titulo}
          />
        )}
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
