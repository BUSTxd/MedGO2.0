import Link from 'next/link';
import type { Metadata } from 'next';
import { AREA_POR_CODIGO } from '@/lib/data/encib';
import { PREGUNTAS } from '@/lib/data/encib/preguntas';
import { TEMARIO } from '@/lib/data/encib/temario';
import { ANIOS, areaDe, nombreTema } from '@/lib/encib/analisis';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import hub from '@/styles/cursosHub.module.css';
import JuegoPreguntas, { type TarjetaEncib } from '@/components/cursos/encib/JuegoPreguntas';

export const metadata: Metadata = { title: 'ENCIB 2026 · MedGO' };

/** Nombre de la subárea (`FIS-4`) a partir de un código de tema (`FIS-4.5`). */
const NOMBRE_SUBAREA = new Map(
  Object.values(TEMARIO).flatMap((subs) => subs.map((s) => [s.codigo, s.nombre] as const)),
);

export default async function EncibPage() {
  // Se vuelve al escenario de exámenes: para Cayetano vive en `cursos/examen`.
  const volver = esDeCayetano(await getUser()) ? '/dashboard/cursos/examen' : '/dashboard/cursos';

  // Lista plana por año, ya con nombres: el cliente no conoce el temario.
  const porAnio: Record<number, TarjetaEncib[]> = {};
  for (const y of ANIOS) {
    porAnio[y] = PREGUNTAS.filter((q) => q.anio === y)
      .sort((a, b) => a.n - b.n)
      .map((q) => {
        const area = AREA_POR_CODIGO[areaDe(q.codigo)];
        return {
          n: q.n,
          area: area.codigo,
          areaNombre: area.nombre,
          color: area.color,
          subarea: NOMBRE_SUBAREA.get(q.codigo.split('.')[0]) ?? '',
          tema: nombreTema(q.codigo),
          concepto: q.concepto,
          dificultad: q.dificultad,
          carga: q.carga,
          formato: q.formato,
          decorativo: q.decorativo,
          secundarios: q.secundarios.map((c) => ({
            nombre: nombreTema(c),
            areaNombre: AREA_POR_CODIGO[areaDe(c)].nombre,
            color: AREA_POR_CODIGO[areaDe(c)].color,
          })),
        };
      });
  }

  return (
    <>
      <Link href={volver} className={hub.volver}>← Exámenes</Link>
      <JuegoPreguntas porAnio={porAnio} />
    </>
  );
}
