import Link from 'next/link';
import type { Metadata } from 'next';
import { AREAS } from '@/lib/data/encib';
import { PREGUNTAS } from '@/lib/data/encib/preguntas';
import { ANIOS } from '@/lib/encib/analisis';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';
import { esDeCayetano } from '@/lib/admin';
import hub from '@/styles/cursosHub.module.css';
import QuizEncib, { type DifEncib } from '@/components/cursos/encib/QuizEncib';

export const metadata: Metadata = { title: 'ENCIB 2026 · MedGO' };

export default async function EncibPage() {
  const [user, planState] = await Promise.all([getUser(), getCachedPlanState()]);
  // Se vuelve al escenario de exámenes: para Cayetano vive en `cursos/examen`.
  const volver = esDeCayetano(user) ? '/dashboard/cursos/examen' : '/dashboard/cursos';

  // Solo cifras de dificultad para el cuadrado de estadísticas: las preguntas
  // reales las pide el cliente a la API, y únicamente si hay plan.
  const dif: Record<number, DifEncib> = {};
  for (const y of ANIOS) {
    const qs = PREGUNTAS.filter((q) => q.anio === y);
    dif[y] = {
      menor: qs.filter((q) => q.dificultad === 'menor').length,
      mediana: qs.filter((q) => q.dificultad === 'mediana').length,
      mayor: qs.filter((q) => q.dificultad === 'mayor').length,
      total: qs.length,
    };
  }

  return (
    <>
      <Link href={volver} className={hub.volver}>← Exámenes</Link>
      <QuizEncib
        anios={[2025, 2024, 2021]}
        areas={AREAS.map((a) => ({ codigo: a.codigo, nombre: a.nombre, color: a.color }))}
        dif={dif}
        planState={{ plan: planState.plan, isActive: planState.isActive, allAccess: planState.allAccess }}
        isAuthed={!!user}
        requiredPlan="interno"
      />
    </>
  );
}
