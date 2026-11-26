// Lo que el servidor le pasa al laboratorio «Hepatitis virales» (según el plan, ver `contenidoDelLab`
// en ./registro.ts). Sin datos de capítulos: este archivo sí llega al navegador.

import type { Parte } from '@/lib/data/hepatitis-virales/tipos';
import type { MetaParte } from '@/lib/data/hepatitis-virales/indice';

export type ResumenParte = MetaParte & {
  nPasos: number;
  /** Duración de su voz (s). */
  segundos: number;
  /** Del vistazo gratis. */
  gratis: boolean;
};

export type Contenido = {
  /** Con el plan: todos los capítulos. */
  completo: boolean;
  /** Los 23 capítulos en orden, abiertos o no. */
  indice: ResumenParte[];
  /** Solo los capítulos abiertos, con sus pasos y su voz. */
  partes: Parte[];
};
