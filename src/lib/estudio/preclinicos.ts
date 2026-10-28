import 'server-only';
import { DISCIPLINAS, SISTEMAS_BASICOS, SISTEMA_BASICO_POR_SLUG, idTemaBasico } from '@/lib/data/preclinicos/temario';
import { REQ_PRECLINICOS } from '@/lib/acceso';
import type { CursoEstudio, CursoListado } from './tipos';

/**
 * Preclínicos, el producto central: el temario universal (`SISTEMAS_BASICOS`,
 * guiado por el USMLE Step 1) con cada sistema como curso, sus bloques como
 * semanas y cada tema como clase, con sus puntos. El temario lo ve cualquier
 * cuenta (la vitrina); el contenido, cuando llegue, pide `REQ_PRECLINICOS`.
 * Aún sin resúmenes ni práctica: es el esqueleto.
 */

export function cursosPreclinicosListados(): CursoListado[] {
  return SISTEMAS_BASICOS.map((s) => ({
    id: s.slug,
    name: s.nombre,
    track: 'basico',
    bloqueado: false,
    icono: null,
    grupo: 'Por sistemas, como el USMLE',
  }));
}

export function cursoPreclinicos(slug: string): CursoEstudio | null {
  const s = SISTEMA_BASICO_POR_SLUG.get(slug);
  if (!s) return null;
  return {
    id: s.slug,
    name: s.nombre,
    ruta: 'preclinicos',
    icono: null,
    subtitulo: s.peso.charAt(0).toUpperCase() + s.peso.slice(1),
    track: 'basico',
    requisito: REQ_PRECLINICOS,
    groups: s.bloques.map((b, i) => ({
      id: `bloque-${i + 1}`,
      title: b.nombre,
      lessons: b.temas.map((t, j) => {
        const disciplinas = t.disciplinas.map((d) => DISCIPLINAS[d]);
        return {
          id: idTemaBasico(t),
          title: t.titulo,
          tipo: disciplinas.join(' · '),
          subtemas: t.puntos,
          docentes: [],
          resumenes: [],
          bloqueada: false,
          practica: [],
          basicas: { num: `${i + 1}.${j + 1}`, disciplinas },
        };
      }),
    })),
  };
}
