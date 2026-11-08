// Lo que el servidor le pasa al laboratorio «Vasculitis de vasos medianos y pequeños y
// ANCA» (según el plan, ver `contenidoDelLab` en ./registro.ts). Sin datos de capítulos:
// este archivo sí llega al navegador.

import type { Parte } from '@/lib/data/vasculitis/tipos';
import type { MetaParte } from '@/lib/data/vasculitis/indice';

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
  /** Los 10 capítulos en orden, abiertos o no. */
  indice: ResumenParte[];
  /** Solo los capítulos abiertos, con sus pasos y su voz. */
  partes: Parte[];
};
