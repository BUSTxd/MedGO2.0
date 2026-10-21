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
}
