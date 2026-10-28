import { notFound } from 'next/navigation';
import EspacioEstudio from '@/components/estudio/EspacioEstudio';
import { prepararSesionApp } from '@/lib/sesion-app';
import { cursoPreclinicos, cursosPreclinicosListados } from '@/lib/estudio/preclinicos';
import { rutasDeLaCuenta } from '@/lib/estudio/rutas-cuenta';

/** Como la ruta ENCIB: la interfaz vive aquí, abierta a toda cuenta, y cambiar de tema sólo cambia la página. */
export default async function SistemaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ sistema: string }> }) {
  const { sistema } = await params;
  const s = await prepararSesionApp();
  const curso = cursoPreclinicos(sistema);
  if (!curso) notFound();
  return (
    <EspacioEstudio cursos={cursosPreclinicosListados()} curso={curso} rutas={rutasDeLaCuenta(s.deCayetano)}>
      {children}
    </EspacioEstudio>
  );
}
