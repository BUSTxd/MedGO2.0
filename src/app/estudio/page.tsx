import { redirect } from 'next/navigation';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursosListados } from '@/lib/estudio/cursos';

/**
 * Entrada de la app tras iniciar sesión. Con cuenta de Cayetano, su meta: el
 * primer curso de su tramo. El resto entra a Preclínicos, el producto central.
 */
export default async function EstudioPage() {
  const s = await prepararSesionApp();
  if (!s.deCayetano) redirect('/estudio/preclinicos');
  redirect(`/estudio/upch/${cursosListados(s.planState)[0].id}`);
}
