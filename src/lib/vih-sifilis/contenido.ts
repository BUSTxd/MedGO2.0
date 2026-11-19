// Lo que el servidor le pasa al laboratorio «VIH y sífilis» (según el plan, ver
// `contenidoDelLab` en ./registro.ts). Sin datos de capítulos: este archivo sí llega al
// navegador.

import type { GrupoTablas, Parte } from '@/lib/data/vih-sifilis/tipos';
import type { MetaParte } from '@/lib/data/vih-sifilis/indice';

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
  /** Los 21 capítulos en orden, abiertos o no. */
  indice: ResumenParte[];
  /** Solo los capítulos abiertos, con sus pasos y su voz. */
  partes: Parte[];
  /** Las pestañas de las tablas resumen, todas; el contenido (`tablas`) solo de las abiertas. */
  tablas: GrupoTablas[];
};
