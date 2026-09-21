import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/inmunologia';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TrackRecentClass from '@/components/TrackRecentClass';
import ExamenDeCurso from '@/components/ExamenDeCurso';
import TarjetasRunner from '@/components/tarjetas/TarjetasRunner';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';
import { destinoDeResumen, puedeVerResumen } from '@/lib/acceso-resumen';

const UNIDAD_LABEL: Record<string, string> = {
  INNATA:          'Sistema inmune e inflamación',
  ADAPTATIVA:      'Respuesta inmune',
  INMUNOPATOLOGIA: 'Introducción a inmunopatología',
  EVALUACION:      'Evaluación',
};

export default async function ActividadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ examen?: string; resumen?: string; tarjetas?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const result = findActividad(id);
  if (!result) notFound();

  const { actividad: act, semana } = result;

  if (sp?.examen === '1' && act.examen) {
    return (
      <ExamenDeCurso
        curso="inmunologia"
        examen={act.examen}
        titulo={act.titulo}
        backHref={`/dashboard/cursos/inmunologia/${id}`}
        /* Los banqueos abiertos son el reclamo del plan: el aviso entra pronto. */
        avisoCada={3}
      />
    );
  }

  // Banqueo en tarjetas. No lleva velo: quien bloquea es la route del bucket,
  // que recorta la muestra en el servidor y devuelve sólo lo que toca.
  if (sp?.tarjetas === '1' && act.tarjetas) {
    return (
      <div className={styles.microPage}>
        <TarjetasRunner
          examKey={act.tarjetas.key}
          titulo={act.titulo}
          backHref={`/dashboard/cursos/inmunologia/${id}`}
        />
      </div>
    );
  }

  const badge = TIPO_BADGE[act.tipo];
  const borderColor = UNIDAD_COLOR[act.unidad];
  const unidadLabel = UNIDAD_LABEL[act.unidad];

  // Gating: los laboratorios son libres, y además las clases marcadas `gratis`
  // como muestra del curso. El resto está detrás del plan Interno. Histología
  // ya NO es libre por tipo: H1 lleva el flag y H2 es de pago.
  const isLab = act.tipo === 'LAB';
  const esLibre = isLab || !!act.gratis;

  // Ids con los que la tarjeta de Resumen pedirá el archivo. Una clase libre
  // puede tener el resumen detrás del plan (TBL 3): ahí hace falta el plan de
  // verdad, o el candado saldría también a quien ya paga.
  const idsResumen = act.resumen
    ? (act.resumen.opciones?.map(o => o.id) ?? [act.id])
    : [];
  const resumenSiempreDePago = idsResumen.some(id => !destinoDeResumen(id).libre);

  const [user, planState] = await Promise.all([
    getUser(),
    esLibre && !resumenSiempreDePago
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);

  const resumenDePago = idsResumen.length > 0 && !idsResumen.every(id => puedeVerResumen(planState, id));

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
          resumenFormato={act.resumen?.formato}
          resumenTitulo={act.titulo}
          examen={act.examen}
          examenTitle={act.titulo}
          tarjetas={act.tarjetas}
          resumenDePago={resumenDePago}
          /* En las prácticas de laboratorio la primera tarjeta es «Simulación». */
          simulacion={isLab ? (act.simulacion ?? {}) : undefined}
          /* Los labs no tienen banco de preguntas: sólo Simulación y Resumen. */
          hideBanqueo={isLab}
          /* El visor va por portal al body: se montaría por delante del velo de
             LockedContent, así que sólo se abre si el resumen es accesible —la
             misma respuesta que dará `/api/resumen-html`, no una copia suya. */
          abrirResumen={sp?.resumen === '1' && !resumenDePago}
        />
      </div>
    </div>
  );

  if (esLibre) return detail;

  return (
    <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
