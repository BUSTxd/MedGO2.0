import ExamRunner from '@/components/ExamRunner';
import LockedContent from '@/components/LockedContent';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';
import { cursoEsGratis, requiredPlanDeCurso } from '@/lib/acceso';
import type { ExamenRef } from '@/lib/data/examen';
import styles from '@/styles/cursos.module.css';

/** Cada cuántas preguntas respondidas aparece el aviso de suscripción. */
const AVISO_CADA = 7;

interface Props {
  /** Slug del curso: decide el plan que abre el examen y el que se anuncia. */
  curso: string;
  examen: ExamenRef;
  titulo: string;
  backHref: string;
  /** 0 apaga el aviso de suscripción. */
  avisoCada?: number;
}

/**
 * El examen de una actividad (`?examen=1`), el mismo en todos los cursos. Lo
 * único que cambia de uno a otro es el `ExamenRef` del sílabo; el plan sale del
 * tramo del curso, así que un curso nuevo no toca nada de aquí.
 *
 * Dos capas de acceso, como en todo el proyecto: la route `/api/examen` es la
 * que bloquea de verdad cada clave, y esto sólo decide si se enseña el velo.
 * El examen entero va detrás del plan salvo que el curso sea gratis o el
 * banqueo lleve `free`; dentro, `dePago` pone candado a años sueltos.
 */
export default async function ExamenDeCurso({
  curso,
  examen,
  titulo,
  backHref,
  avisoCada = AVISO_CADA,
}: Props) {
  // El plan real hace falta aunque el examen sea libre: decide el candado de
  // los banqueos de pago y a quién se le enseña el aviso. No cuesta una consulta
  // extra: el layout del dashboard ya la hizo y va cacheada.
  const [user, planState] = await Promise.all([getUser(), getCachedPlanState()]);
  const plan = requiredPlanDeCurso(curso);

  const node = (
    <div className={styles.microPage}>
      <ExamRunner
        examKey={examen.key}
        groupKeys={examen.groups}
        groupLabels={examen.labels}
        groupHints={examen.hints}
        suscripcion={{
          plan,
          estado: {
            plan: planState.plan,
            isActive: planState.isActive,
            allAccess: planState.allAccess,
          },
          isAuthed: !!user,
          etapasDePago: examen.dePago,
          avisoCada,
        }}
        fallbackTitle={titulo}
        backHref={backHref}
      />
    </div>
  );

  if (examen.free || cursoEsGratis(curso)) return node;
  return (
    <LockedContent requiredPlan={plan} planState={planState} isAuthed={!!user}>
      {node}
    </LockedContent>
  );
}
