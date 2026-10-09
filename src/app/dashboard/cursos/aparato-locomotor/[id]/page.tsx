import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findActividad, esLibre, semanas, UNIDAD_COLOR, TIPO_BADGE } from '@/lib/data/locomotor';
import styles from '@/styles/cursos.module.css';
import StudyMaterialSection from '@/components/StudyMaterialSection';
import LockedContent from '@/components/LockedContent';
import TarjetasRunner from '@/components/tarjetas/TarjetasRunner';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import { tieneMaterial } from '@/lib/material-plan';
import TrackRecentClass from '@/components/TrackRecentClass';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';
import { tieneAccesoA } from '@/lib/acceso';

const UNIDAD_LABEL: Record<string, string> = {
  DESARROLLO: 'Embriología y desarrollo',
  TEJIDOS:    'Histología de tejidos',
  FISIOLOGIA: 'Fisiología ósea y muscular',
  ANATOMIA:   'Anatomía y disección',
  EVALUACION: 'Evaluación',
};

export default async function ActividadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resumen?: string; opcion?: string; seccion?: string; tarjetas?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const result = findActividad(id);
  if (!result) notFound();

  const { actividad: act, semana } = result;

  // Banqueo en tarjetas. Sin velo: quien bloquea es la route del bucket. La
  // baraja del examen 3D cruza varias clases, así que cada tarjeta trae su
  // resumen y aquí sólo se dice cuáles puede abrir el usuario.
  if (sp?.tarjetas === '1' && act.tarjetas) {
    const plan = await getCachedPlanState();
    const resumenes: Record<string, boolean> = {};
    for (const sem of semanas)
      for (const a of sem.actividades)
        for (const o of a.resumen?.opciones ?? [])
          if ((o.formato ?? a.resumen?.formato) === 'html') resumenes[o.id] = puedeVerResumen(plan, o.id);
    return (
      <div className={styles.microPage}>
        <TarjetasRunner
          examKey={act.tarjetas.key}
          titulo={act.titulo}
          backHref={`/dashboard/cursos/aparato-locomotor/${id}`}
          resumenes={resumenes}
          ronda={30}
        />
      </div>
    );
  }
  const badge = TIPO_BADGE[act.tipo];
  const borderColor = UNIDAD_COLOR[act.unidad];
  const unidadLabel = UNIDAD_LABEL[act.unidad];

  // Gating: las prácticas (anatomía e histología) son libres salvo que lleven
  // resumen (`esLibre`); magistrales / invertidas / TBL / SGP / exámenes están
  // detrás del plan Interno.
  const isPractica = act.tipo === 'ANATOMIA' || act.tipo === 'HISTOLOGIA';
  const libre = esLibre(act);
  const [user, planState] = await Promise.all([
    getUser(),
    libre
      ? Promise.resolve({ plan: 'free' as const, isActive: true })
      : getCachedPlanState(),
  ]);
  // El visor va por portal al body (por delante del velo de LockedContent): el
  // enlace directo al resumen (`?resumen=1&opcion=…&seccion=…`, desde el examen
  // 3D) solo lo abre si la clase es accesible.
  const accesible = libre || tieneAccesoA(planState, 'interno');

  const detail = (
    <div className={styles.microPage}>
      <TrackRecentClass id={act.id} courseSlug="aparato-locomotor" title={act.titulo} />
      <div className={styles.container}>
        <Link href="/dashboard/cursos/aparato-locomotor" className={styles.backLink}>
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

        {act.relacionada && (
          <Link
            href={`/dashboard/cursos/aparato-locomotor/${act.relacionada.id}`}
            className={styles.relacionadaLink}
          >
            <span className={styles.relacionadaTexto}>{act.relacionada.texto}</span>
            <span className={styles.relacionadaFlecha} aria-hidden>→</span>
          </Link>
        )}

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
          tarjetas={act.tarjetas}
          /* En las prácticas y en las evaluaciones prácticas (examen en el modelo 3D)
             la primera tarjeta es «Simulación». */
          simulacion={isPractica || act.tipo === 'EXAMEN-P' ? (act.simulacion ?? {}) : undefined}
          abrirResumen={sp?.resumen === '1' && accesible}
          resumenOpcion={sp?.opcion}
          resumenSeccion={sp?.seccion}
        />
      </div>
    </div>
  );

  // Sin material publicado no hay nada que proteger: se ve igual que en el
  // índice, sin candado.
  if (libre || !tieneMaterial('aparato-locomotor', act)) return detail;

  return (
    <LockedContent requiredPlan="interno" planState={planState} isAuthed={!!user}>
      {detail}
    </LockedContent>
  );
}
