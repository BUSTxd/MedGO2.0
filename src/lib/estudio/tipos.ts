/** Lo que el servidor le pasa a la interfaz de estudio: sólo el curso abierto, ya resuelto. */
import type { Requisito } from '@/lib/plans';

export type FormatoResumen = 'pdf' | 'html';

export interface ResumenEstudio {
  id: string;
  label: string;
  formato: FormatoResumen;
}

export interface ClaseEstudio {
  id: string;
  title: string;
  /** Tipo del sílabo (MAGISTRAL, TBL, LAB…) ya traducido a una etiqueta corta. */
  tipo: string;
  fecha?: string;
  hora?: string;
  subtemas: string[];
  docentes: string[];
  nota?: string;
  resumenes: ResumenEstudio[];
  /** Tiene resumen y el plan no lo abre (misma regla que `/api/resumen-html`). */
  bloqueada: boolean;
  /** El laboratorio que el sílabo enlaza a esta clase («Llévalo a la práctica»). */
  laboratorio?: LabRecomendado;
  /** Los banqueos de la clase (pestaña «Práctica»), en el orden en que se ofrecen. */
  practica: PracticaEstudio[];
  /** Sólo en la ruta ENCIB: la clase es un tema de la tabla oficial. */
  encib?: TemaEncibEstudio;
  /** Sólo en Preclínicos: un tema del temario universal (`subtemas` son sus puntos). */
  basicas?: { num: string; disciplinas: string[] };
}

/** Un tema del ENCIB 2026: qué pide la tabla oficial y en qué preguntas ya salió. */
export interface TemaEncibEstudio {
  /** `ÁREA-sub.tema`, p. ej. `ANA-2.1`. */
  codigo: string;
  /** Su número dentro de la materia («3.2»). */
  num: string;
  /** Área del examen de la que viene (en Genética e Inmunología no es la materia). */
  area: string;
  /** Texto oficial de ASPEFAM. */
  oficial: string;
  /** Las preguntas en que salió como tema principal, de la más reciente a la más vieja. */
  salio: { anio: number; n: number; dificultad: 'menor' | 'mediana' | 'mayor'; concepto: string }[];
}

/**
 * Cómo se practica una clase. Los cuatro primeros son el runner del dashboard que
 * su `[id]/page.tsx` monta con `?<tipo>=1`; los propuestos son documentos del visor.
 */
export type TipoPractica = 'examen' | 'banco' | 'tarjetas' | 'solucionario' | 'propuestos';

export interface PracticaEstudio {
  tipo: TipoPractica;
  titulo: string;
  desc: string;
  /** Lo que trae dentro: los años de cada banqueo, «Por temas»… */
  chips: string[];
  /** Sólo los propuestos: cada documento, con el acceso de `/api/resumen` ya resuelto. */
  documentos?: (ResumenEstudio & { bloqueado: boolean })[];
}

export interface LabRecomendado {
  titulo: string;
  desc: string;
  /** «Examen práctico 3D», «Simulación», «Modelo 3D»… */
  etiqueta: string;
  href: string;
  icono: string | null;
}

export interface SemanaEstudio {
  id: string;
  title: string;
  lessons: ClaseEstudio[];
}

/** El segmento de la URL de cada ruta: `/estudio/<ruta>/<curso>/<clase>`. */
export type RutaEstudio = 'upch' | 'encib' | 'preclinicos';

export interface CursoEstudio {
  id: string;
  name: string;
  ruta: RutaEstudio;
  /** Icono de materia del ENCIB, o null si el curso aún no tiene uno propio. */
  icono: string | null;
  /** Debajo del nombre en el temario; sin él, el de cada ruta. */
  subtitulo?: string;
  track: 'basico' | 'medicina';
  /** Lo que pide el curso: el candado ofrece los planes que lo abren. */
  requisito: Requisito;
  groups: SemanaEstudio[];
}

export interface CursoListado {
  id: string;
  name: string;
  track: 'basico' | 'medicina';
  bloqueado: boolean;
  icono: string | null;
  /** Rótulo del grupo en el selector de cursos; sin él, el del tramo. */
  grupo?: string;
}

export type TipoLab = 'Simulación' | 'Modelo 3D' | 'Atlas' | 'Práctica' | 'Investigación';

/** Una tarjeta del Laboratorio virtual, con el acceso ya resuelto en el servidor. */
export interface TarjetaLab {
  id: string;
  nombre: string;
  desc: string;
  /** Curso al que pertenece (el primero si se comparte) y todos, para el filtro. */
  materia: string;
  cursos: string[];
  tipo: TipoLab;
  href: string;
  icono: string | null;
  /** abierto: lo abre su plan · gratis/vistazo/prueba: una parte sin plan · plan: candado. */
  acceso: 'abierto' | 'gratis' | 'vistazo' | 'prueba' | 'plan';
}
