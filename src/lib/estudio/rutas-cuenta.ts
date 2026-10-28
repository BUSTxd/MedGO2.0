import type { Ruta } from '@/components/estudio/ruta';

/** Las metas que una cuenta puede abrir: Cayetano sólo con cuenta de la UPCH; Preclínicos y ENCIB, todas. */
export const rutasDeLaCuenta = (deCayetano: boolean): Ruta[] =>
  deCayetano ? ['Preclínicos', 'Cayetano', 'ENCIB'] : ['Preclínicos', 'ENCIB'];
