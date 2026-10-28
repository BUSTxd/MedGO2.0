import { notFound, redirect } from 'next/navigation';
import EspacioEstudio from '@/components/estudio/EspacioEstudio';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursoEstudio, cursosListados } from '@/lib/estudio/cursos';
import { rutasDeLaCuenta } from '@/lib/estudio/rutas-cuenta';

/**
 * La interfaz vive en el layout del curso: cambiar de clase sólo cambia la página
 * (vacía), así que el temario no se vuelve a montar. El sílabo de Cayetano sólo se
 * arma para cuentas de Cayetano; al resto ni siquiera le viaja.
 */
export default async function CursoLayout({ children, params }: { children: React.ReactNode; params: Promise<{ curso: string }> }) {
  const { curso: slug } = await params;
  const s = await prepararSesionApp();
  if (!s.deCayetano) redirect('/estudio');
  const curso = cursoEstudio(slug, s.planState);
  if (!curso) notFound();
  return <EspacioEstudio cursos={cursosListados(s.planState)} curso={curso} rutas={rutasDeLaCuenta(true)}>{children}</EspacioEstudio>;
}
