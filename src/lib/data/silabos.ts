import type { ActividadLike } from '@/lib/material-plan';

import { semanas as microbiologia }   from '@/lib/data/microbiologia';
import { semanas as farmacologia }    from '@/lib/data/farmacologia';
import { semanas as cardiovascular }  from '@/lib/data/cardiovascular';
import { semanas as neurologia }      from '@/lib/data/neurologia';
import { semanas as excretor }        from '@/lib/data/excretor';
import { semanas as hematologia }     from '@/lib/data/hematologia';
import { semanas as locomotor }       from '@/lib/data/locomotor';
import { semanas as inmunologia }     from '@/lib/data/inmunologia';
import { semanas as digestivo }       from '@/lib/data/digestivo';
import { semanas as endocrino }       from '@/lib/data/endocrino';
import { semanas as patologia }       from '@/lib/data/patologia';
import { semanas as biologiaCelular } from '@/lib/data/biologiaCelular';
import { semanas as cienciasSociales }from '@/lib/data/cienciasSociales';
import { semanas as fisica }          from '@/lib/data/fisica';
import { semanas as quimicaOrganica } from '@/lib/data/quimicaOrganica';
import { semanas as comunicacion }    from '@/lib/data/comunicacion';
import { semanas as culturaAmbiental }from '@/lib/data/culturaAmbiental';

export interface SemanaLike {
  titulo: string;
  actividades: readonly ActividadLike[];
}

/**
 * Todos los sílabos indexados por el slug de su ruta.
 *
 * Vive aparte de `aportes-stats.ts` porque hay dos lecturas distintas del mismo
 * material: el recuento de cobertura y el registro de quién subió cada cosa
 * (`aportes-registro.ts`). Ambas tienen que recorrer exactamente los mismos
 * sílabos, o el panel contaría actividades que el registro no deja marcar.
 */
export const SILABOS: Record<string, readonly SemanaLike[]> = {
  'microbiologia':          microbiologia   as unknown as SemanaLike[],
  'farmacologia':           farmacologia    as unknown as SemanaLike[],
  'cardiovascular':         cardiovascular  as unknown as SemanaLike[],
  'neurologia':             neurologia      as unknown as SemanaLike[],
  'excretor':               excretor        as unknown as SemanaLike[],
  'hematologia':            hematologia     as unknown as SemanaLike[],
  'aparato-locomotor':      locomotor       as unknown as SemanaLike[],
  'inmunologia':            inmunologia     as unknown as SemanaLike[],
  'digestivo':              digestivo       as unknown as SemanaLike[],
  'endocrino-reproductor':  endocrino       as unknown as SemanaLike[],
  'patologia':              patologia       as unknown as SemanaLike[],
  'biologia-celular':       biologiaCelular as unknown as SemanaLike[],
  'ciencias-sociales':      cienciasSociales as unknown as SemanaLike[],
  'fisica-medicina':        fisica          as unknown as SemanaLike[],
  'quimica-organica':       quimicaOrganica as unknown as SemanaLike[],
  'comunicacion-redaccion-ii': comunicacion as unknown as SemanaLike[],
  'cultura-ambiental':      culturaAmbiental as unknown as SemanaLike[],
};
