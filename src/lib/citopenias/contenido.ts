// Lo que el servidor le pasa al laboratorio «Citopenias autoinmunes» (según el plan,
// ver `contenidoDelLab` en ./registro.ts). Sin datos de capítulos: este archivo sí
// llega al navegador. La compilación es la de Lupus (`compilado`), con su mismo motor.

import type { Parte } from '@/lib/data/citopenias/tipos';
import type { MetaParte } from '@/lib/data/citopenias/indice';
import type { NotaClase } from '@/lib/data/notas/tipos';

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
  /** La tabla resumen; sin el plan no viaja. */
  tabla?: NotaClase;
};
