import { redirect } from 'next/navigation';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursosListados } from '@/lib/estudio/cursos';

/**
 * Entrada de la app tras iniciar sesión: el primer curso del tramo del alumno.
 * Sin cuenta de Cayetano no hay ruta UPCH, y las de Ciencias básicas y ENCIB aún
 * viven en el dashboard: allí va (el escenario de exámenes).
 */
export default async function EstudioPage() {
  const s = await prepararSesionApp();
  if (!s.deCayetano) redirect('/dashboard/home');
  redirect(`/estudio/upch/${cursosListados(s.planState)[0].id}`);
}
