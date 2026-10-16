import Link from 'next/link';
import type { Metadata } from 'next';
import { AREAS, ENCIB } from '@/lib/data/encib';
import { TEMARIO } from '@/lib/data/encib/temario';
import { TEMARIO_OFICIAL } from '@/lib/data/encib/temario-oficial';
import { PREGUNTAS } from '@/lib/data/encib/preguntas';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import TemarioEncib, { type AreaTemario } from '@/components/cursos/TemarioEncib';
import hub from '@/styles/cursosHub.module.css';

export const metadata: Metadata = { title: 'Temario ENCIB 2026 · MedGO' };

export default async function TemarioPage() {
  const volver = esDeCayetano(await getUser()) ? '/dashboard/cursos/examen' : '/dashboard/cursos';

  // Cuántas veces salió cada tema (como tema principal) en cada cuadernillo.
  const salidas = new Map<string, [number, number, number]>();
  for (const q of PREGUNTAS) {
    const v = salidas.get(q.codigo) ?? [0, 0, 0];
    const i = q.anio === 2021 ? 0 : q.anio === 2024 ? 1 : 2;
    v[i] += 1;
    salidas.set(q.codigo, v);
  }

  const areas: AreaTemario[] = AREAS.map((a) => ({
    codigo: a.codigo,
    slug: a.slug,
    nombre: a.nombre,
    color: a.color,
    peso: a.peso,
    lema: a.lema,
    subareas: TEMARIO[a.codigo].map((sa) => ({
      codigo: sa.codigo,
      nombre: sa.nombre,
      temas: sa.temas.map((t) => ({
        codigo: t.codigo,
        nombre: t.nombre,
        oficial: TEMARIO_OFICIAL[t.codigo] ?? t.nombre,
        salidas: salidas.get(t.codigo) ?? [0, 0, 0],
      })),
    })),
  }));

  const nSub = areas.reduce((n, a) => n + a.subareas.length, 0);
  const nTemas = areas.reduce((n, a) => n + a.subareas.reduce((m, sa) => m + sa.temas.length, 0), 0);

  return (
    <div>
      <Link href={volver} className={hub.volver}>← Exámenes</Link>
      <TemarioEncib areas={areas} cifras={{ areas: areas.length, subareas: nSub, temas: nTemas, preguntas: ENCIB.preguntas }} />
    </div>
  );
}
