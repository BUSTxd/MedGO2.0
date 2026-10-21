import { redirect } from 'next/navigation';
import EspacioEstudio from '@/components/estudio/EspacioEstudio';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursosListados } from '@/lib/estudio/cursos';

/** Entrada de la interfaz: al primer curso del tramo del alumno (los de Cayetano). */
export default async function EstudioPage() {
  const s = await prepararSesionApp();
  const cursos = cursosListados(s.planState);
  // Sin cuenta de Cayetano no hay temario UPCH: la interfaz se pinta con el aviso.
  if (!s.deCayetano) return <EspacioEstudio cursos={[]} curso={null} />;
  redirect(`/estudio/upch/${cursos[0].id}`);
}
