import { notFound } from 'next/navigation';
import EspacioEstudio from '@/components/estudio/EspacioEstudio';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursoEncib, cursosEncibListados } from '@/lib/estudio/encib';
import { rutasDeLaCuenta } from '@/lib/estudio/rutas-cuenta';

/**
 * Como el layout de un curso UPCH: la interfaz vive aquí y cambiar de tema sólo
 * cambia la página (vacía). Abierta a toda cuenta; la ruta UPCH sólo se ofrece
 * en el selector a quien es de Cayetano.
 */
export default async function MateriaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ materia: string }> }) {
  const { materia } = await params;
  const s = await prepararSesionApp();
  const curso = cursoEncib(materia);
  if (!curso) notFound();
  return (
    <EspacioEstudio cursos={cursosEncibListados()} curso={curso} rutas={rutasDeLaCuenta(s.deCayetano)}>
      {children}
    </EspacioEstudio>
  );
}
