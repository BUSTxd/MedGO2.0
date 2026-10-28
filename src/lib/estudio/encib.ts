import 'server-only';
import { CURSOS_ENCIB, CURSO_POR_SLUG } from '@/lib/data/encib/cursos';
import { TEMARIO_OFICIAL } from '@/lib/data/encib/temario-oficial';
import { AREA_POR_CODIGO } from '@/lib/data/encib';
import { aparicionesPorTema, areaDe, nombreTema, type AparicionTema } from '@/lib/encib/analisis';
import { REQ_ENCIB } from '@/lib/acceso';
import type { ClaseEstudio, CursoEstudio, CursoListado } from './tipos';

/**
 * La ruta ENCIB: las 11 materias de la franja del dashboard (`CURSOS_ENCIB`) como
 * cursos, sus subáreas como semanas y cada tema de la tabla oficial como clase,
 * con lo que ya salió en 2021, 2024 y 2025. Abierta a toda cuenta, como
 * `dashboard/cursos/area`. Aún sin resúmenes: el tema sólo dice qué entra.
 */

const icono = (slug: string) => `/assets/cursos/materia-${slug}_v6.avif`;

/** `ANA-2.1` → `ana-2.1`: el id del tema en la URL. */
const idTema = (codigo: string) => codigo.toLowerCase();

export function cursosEncibListados(): CursoListado[] {
  return CURSOS_ENCIB.map((c) => ({
    id: c.slug,
    name: c.nombre,
    track: 'basico',
    bloqueado: false,
    icono: icono(c.slug),
    grupo: 'Materias del ENCIB 2026',
  }));
}

function tema(codigo: string, num: string, apariciones: Map<string, AparicionTema[]>): ClaseEstudio {
  const salio = (apariciones.get(codigo) ?? [])
    .slice()
    .sort((x, y) => y.anio - x.anio || x.n - y.n)
    .map(({ anio, n, dificultad, concepto }) => ({ anio, n, dificultad, concepto }));
  return {
    id: idTema(codigo),
    title: nombreTema(codigo),
    tipo: `Tema ${codigo}`,
    subtemas: [],
    docentes: [],
    resumenes: [],
    bloqueada: false,
    practica: [],
    encib: {
      codigo,
      num,
      area: AREA_POR_CODIGO[areaDe(codigo)].nombre,
      oficial: TEMARIO_OFICIAL[codigo] ?? nombreTema(codigo),
      salio,
    },
  };
}

export function cursoEncib(slug: string): CursoEstudio | null {
  const c = CURSO_POR_SLUG.get(slug);
  if (!c) return null;
  const apariciones = aparicionesPorTema();
  return {
    id: c.slug,
    name: c.nombre,
    ruta: 'encib',
    icono: icono(c.slug),
    track: 'basico',
    // Meta de examen: nivel completo, como su banqueo (`EXAMENES`). Hoy ningún tema lleva candado.
    requisito: REQ_ENCIB,
    groups: c.bloques.map((b, i) => ({
      id: `bloque-${i + 1}`,
      title: b.nombre,
      lessons: b.temas.map((codigo, j) => tema(codigo, `${i + 1}.${j + 1}`, apariciones)),
    })),
  };
}
