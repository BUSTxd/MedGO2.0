'use client';
import { usePathname } from 'next/navigation';
import BarraSuperior, { type Pagina } from './BarraSuperior';
import EsqueletoEstudio, { BarraEsqueleto } from './EsqueletoEstudio';
import EsqueletoLaboratorio from './EsqueletoLaboratorio';
import { cx } from './Icono';

/** Las rutas que se abren en el espacio de estudio (barra, ruta, temario y lector). */
const ESPACIO = /^\/estudio(\/(upch|preclinicos|encib|ciencias-basicas)(\/|$)|\/?$)/;

/**
 * La silueta de la ruta que se está abriendo. Sin sesión todavía (fallback del
 * layout de /estudio) la barra también es silueta; con ella (`barraReal`, desde
 * `loading.tsx`) va la de verdad, con el avatar, y sólo el resto espera.
 * Exámenes y Mi cuenta tienen otra forma: ahí sólo se adelanta la barra.
 */
export default function SiluetaRuta({ barraReal = false }: { barraReal?: boolean }) {
  const pathname = usePathname();
  const barra = (page: Pagina | null) => (barraReal ? <BarraSuperior page={page} /> : <BarraEsqueleto page={page} />);
  if (ESPACIO.test(pathname)) return <EsqueletoEstudio barra={barra('study')} />;
  if (/^\/estudio\/laboratorio\/?$/.test(pathname)) return <EsqueletoLaboratorio barra={barra('labs')} />;
  const page = pathname.startsWith('/estudio/laboratorio') ? 'labs' : pathname.startsWith('/estudio/examenes') ? 'exams' : null;
  return <div className={cx('wrapper')} data-palette="pearl">{barra(page)}</div>;
}
