/** Lo que el servidor le pasa a la interfaz de estudio: sólo el curso abierto, ya resuelto. */

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

export interface CursoEstudio {
  id: string;
  name: string;
  /** Icono de materia del ENCIB, o null si el curso aún no tiene uno propio. */
  icono: string | null;
  track: 'basico' | 'medicina';
  /** Plan mensual del tramo, para abrir la compra desde un candado. */
  planRequerido: 'ufbi' | 'interno';
  groups: SemanaEstudio[];
}

export interface CursoListado {
  id: string;
  name: string;
  track: 'basico' | 'medicina';
  bloqueado: boolean;
  icono: string | null;
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
