import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findLab, findModulo } from '@/lib/data/fisica-modulos';
import { findActividad } from '@/lib/data/fisica';
import ModuloTeoriaRunner from '@/components/fisica/ModuloTeoriaRunner';
import LabRunner from '@/components/fisica/LabRunner';
import LockedContent from '@/components/LockedContent';
import { getUser } from '@/lib/supabase/get-user';
import { getCachedPlanState } from '@/lib/plans-server';

/**
 * Material interactivo de una clase de Física.
 *
 * La ruta es estática (`modulo/[id]`) y no un segmento del `[id]` de clase para
 * que el sílabo y el módulo no compartan página: la clase es RSC y esto es un
 * runner de cliente con canvas animados.
 *
 * Dos runners cuelgan de la misma ruta y el orden de resolución importa: si la
 * clase tiene módulo completo de teoría, manda ése; si sólo tiene laboratorio,
 * se abre el menú de temas. Así, el día que una clase gane su `ModuloTeoria`,
 * el cambio es registrar el módulo — el enlace del sílabo no se toca y nadie se
 * queda con el laboratorio suelto por descuido.
 *
 * `preview={false}` en el gate por el mismo motivo que en los laboratorios:
 * difuminar esto obligaría a montar las simulaciones para que nadie las vea.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const modulo = findModulo(id);
  if (modulo) {
    return {
      title: `${modulo.codigo} — ${modulo.titulo} · MedGO`,
      description: modulo.gancho,
    };
  }
  const lab = findLab(id);
  if (lab) {
    return {
      title: `${lab.codigo} — ${lab.titulo} · Laboratorio · MedGO`,
      description: lab.gancho,
    };
  }
  return { title: 'Módulo no encontrado' };
}

export default async function ModuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const modulo = findModulo(id);
  const lab = modulo ? null : findLab(id);
  if (!modulo && !lab) notFound();

  const claseId = modulo?.claseId ?? lab!.claseId;

  // La actividad tiene que existir en el sílabo: esto cuelga de una clase real,
  // no vive por su cuenta.
  if (!findActividad(claseId)) notFound();

  const [user, planState] = await Promise.all([getUser(), getCachedPlanState()]);
  const volverHref = `/dashboard/cursos/fisica-medicina/${claseId}`;

  return (
    <LockedContent
      requiredPlan="ufbi"
      planState={planState}
      isAuthed={!!user}
      preview={false}
    >
      {modulo ? (
        <ModuloTeoriaRunner modulo={modulo} volverHref={volverHref} />
      ) : (
        <LabRunner lab={lab!} volverHref={volverHref} />
      )}
    </LockedContent>
  );
}
