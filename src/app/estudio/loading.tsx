'use client';
import { usePathname } from 'next/navigation';
import BarraSuperior from '@/components/estudio/BarraSuperior';
import EsqueletoEstudio from '@/components/estudio/EsqueletoEstudio';
import { cx } from '@/components/estudio/Icono';

/** Las rutas que se abren en el espacio de estudio (barra, ruta, temario y lector). */
const ESPACIO = /^\/estudio(\/(upch|preclinicos|encib|ciencias-basicas)(\/|$)|\/?$)/;

/**
 * Ya hay sesión (esto cuelga del layout de /estudio), así que la barra es la de
 * verdad, con el avatar del alumno, y sólo el resto espera. Laboratorio, Exámenes y
 * Mi cuenta tienen otra forma: ahí sólo se adelanta la barra.
 */
export default function CargandoEstudio() {
  const pathname = usePathname();
  if (ESPACIO.test(pathname)) return <EsqueletoEstudio barra={<BarraSuperior page="study" />} />;
  const page = pathname.startsWith('/estudio/laboratorio') ? 'labs' : pathname.startsWith('/estudio/examenes') ? 'exams' : null;
  return <div className={cx('wrapper')} data-palette="pearl"><BarraSuperior page={page} /></div>;
}
