import { redirect } from 'next/navigation';
import ModuloPage, { generateMetadata } from '@/app/dashboard/cursos/fisica-medicina/modulo/[id]/page';
import { prepararSesionApp } from '@/lib/sesion-app';

export { generateMetadata };

/**
 * El laboratorio de una clase de Física. Es material de un curso de Cayetano:
 * en el dashboard lo cierra el middleware (`/dashboard/cursos/<curso>`); aquí,
 * fuera de esa ruta, se comprueba a mano antes de montar nada.
 */
export default async function FisicaModuloEstudio(props: { params: Promise<{ id: string }> }) {
  const s = await prepararSesionApp();
  if (!s.deCayetano) redirect('/estudio/laboratorio');
  return <ModuloPage {...props} />;
}
