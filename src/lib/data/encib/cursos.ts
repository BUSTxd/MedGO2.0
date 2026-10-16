import { AREA_POR_CODIGO } from './index';
import { TEMARIO } from './temario';
import type { AreaEncib } from './tipos';

/**
 * Los 11 cursos de la franja de materias del escenario. Ocho salen tal cual de
 * las áreas del ENCIB (Microbiología y Parasitología parten la suya en dos);
 * Genética e Inmunología no son áreas del examen: reúnen, en orden, los temas
 * de la tabla oficial que tocan esas materias.
 *
 * Un bloque = una subárea de la tabla (o un grupo propio en las dos nuevas);
 * los temas son códigos `ÁREA-sub.tema`, el texto lo pone la página.
 */
export interface BloqueCurso {
  nombre: string;
  temas: string[];
}

export interface CursoEncib {
  slug: string;
  nombre: string;
  color: string;
  bloques: BloqueCurso[];
}

/** Las subáreas de un área como bloques, opcionalmente solo algunas. */
function deArea(area: AreaEncib, subareas?: string[]): BloqueCurso[] {
  return TEMARIO[area]
    .filter((s) => !subareas || subareas.includes(s.codigo))
    .map((s) => ({ nombre: s.nombre, temas: s.temas.map((t) => t.codigo) }));
}

const area = (codigo: AreaEncib, slug: string, nombre?: string, subareas?: string[]): CursoEncib => ({
  slug,
  nombre: nombre ?? AREA_POR_CODIGO[codigo].nombre,
  color: AREA_POR_CODIGO[codigo].color,
  bloques: deArea(codigo, subareas),
});

/** En el orden de la franja. */
export const CURSOS_ENCIB: CursoEncib[] = [
  area('ANA', 'anatomia'),
  area('FIS', 'fisiologia'),
  area('BIO', 'bioquimica'),
  area('HIS', 'histologia'),
  area('EMB', 'embriologia'),
  {
    slug: 'genetica',
    nombre: 'Genética',
    color: '#0f9f8f',
    bloques: [
      { nombre: 'Bases moleculares', temas: ['EMB-1.1', 'EMB-1.2'] },
      { nombre: 'División celular y gametos', temas: ['EMB-1.3', 'EMB-2.1'] },
      { nombre: 'Genética clínica', temas: ['EMB-2.9', 'PAT-5.5'] },
      { nombre: 'Farmacogenética', temas: ['FAR-1.10'] },
    ],
  },
  area('MIC', 'microbiologia', 'Microbiología', ['MIC-1', 'MIC-2', 'MIC-3']),
  area('MIC', 'parasitologia', 'Parasitología', ['MIC-4', 'MIC-5', 'MIC-6']),
  {
    slug: 'inmunologia',
    nombre: 'Inmunología',
    color: '#6d5bd0',
    bloques: [
      { nombre: 'Respuesta inmune', temas: ['FIS-6.4', 'FIS-6.5', 'FIS-6.6'] },
      { nombre: 'Células, tejidos y órganos', temas: ['HIS-1.6', 'HIS-2.1', 'PAT-4.1', 'PAT-4.2'] },
      { nombre: 'Inmunoglobulinas', temas: ['BIO-4.3'] },
      { nombre: 'Inmunopatología', temas: ['PAT-4.3', 'PAT-4.4', 'PAT-4.5', 'PAT-4.6'] },
    ],
  },
  area('FAR', 'farmacologia'),
  area('PAT', 'patologia'),
];

export const CURSO_POR_SLUG: ReadonlyMap<string, CursoEncib> = new Map(CURSOS_ENCIB.map((c) => [c.slug, c]));

/** Las rutas viejas por área que ya no son un curso (Micro y Parasito eran una sola). */
export const SLUG_VIEJO: Record<string, string> = {
  'microbiologia-parasitologia': 'microbiologia',
};
