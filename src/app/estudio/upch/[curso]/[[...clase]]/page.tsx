import { prepararSesionApp } from '@/lib/sesion-app';
import { cursoEstudio } from '@/lib/estudio/cursos';
import { PAGINA_DE_CLASE, esRunner } from '@/lib/estudio/practica';

/**
 * La clase abierta la lee la interfaz del layout con `useParams`: aquí sólo se pinta
 * un banqueo, cuando la pestaña «Práctica» lo abre (`?practica=examen|banco|tarjetas|
 * solucionario`). Es el runner de la página de clase del dashboard, con su velo y su
 * plan; la interfaz lo coloca en el panel de práctica.
 */
export default async function ClasePage({ params, searchParams }: {
  params: Promise<{ curso: string; clase?: string[] }>;
  searchParams: Promise<{ practica?: string }>;
}) {
  const [{ curso, clase }, { practica }] = await Promise.all([params, searchParams]);
  const id = clase?.[0];
  if (!id || !practica || !esRunner(practica) || !PAGINA_DE_CLASE[curso]) return null;

  // Sólo lo que la pestaña ofrece: con otra cosa la página del dashboard pintaría la clase entera.
  const s = await prepararSesionApp();
  if (!s.deCayetano) return null;
  const leccion = cursoEstudio(curso, s.planState)?.groups.flatMap((g) => g.lessons).find((l) => l.id === id);
  if (!leccion?.practica.some((p) => p.tipo === practica)) return null;

  const { default: Pagina } = await PAGINA_DE_CLASE[curso]();
  return <Pagina params={Promise.resolve({ id })} searchParams={Promise.resolve({ [practica]: '1' })} />;
}
