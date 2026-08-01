import type { Track } from '@/lib/plans';
import {
  CURSOS,
  LABORATORIOS,
  APORTE_OVERRIDE,
  COLABORADORES,
  type Colaborador,
  type CursoMeta,
} from '@/lib/data/aportes';

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
import { semanas as biologiaCelular } from '@/lib/data/biologiaCelular';
import { semanas as cienciasSociales }from '@/lib/data/cienciasSociales';
import { semanas as fisica }          from '@/lib/data/fisica';
import { semanas as quimicaOrganica } from '@/lib/data/quimicaOrganica';
import { semanas as comunicacion }    from '@/lib/data/comunicacion';
import { semanas as culturaAmbiental }from '@/lib/data/culturaAmbiental';

/**
 * Forma mínima común a los 16 sílabos. Cada curso tiene su propio tipo
 * `Actividad` con campos extra, pero para contar cobertura solo importan estos.
 */
interface ActividadLike {
  id: string;
  tipo: string;
  resumen?: unknown;
  examen?: unknown;
}
interface SemanaLike {
  actividades: readonly ActividadLike[];
}

const SILABOS: Record<string, readonly SemanaLike[]> = {
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
  'biologia-celular':       biologiaCelular as unknown as SemanaLike[],
  'ciencias-sociales':      cienciasSociales as unknown as SemanaLike[],
  'fisica-medicina':        fisica          as unknown as SemanaLike[],
  'quimica-organica':       quimicaOrganica as unknown as SemanaLike[],
  'comunicacion-redaccion-ii': comunicacion as unknown as SemanaLike[],
  'cultura-ambiental':      culturaAmbiental as unknown as SemanaLike[],
};

export interface CursoStats extends CursoMeta {
  actividades: number;
  resumenes: number;
  banqueos: number;
  /** 0–100 */
  covResumen: number;
  covBanqueo: number;
}

export interface AporteColaborador {
  colaborador: Colaborador;
  nombre: string;
  rol: string;
  color: string;
  /** Resúmenes publicados atribuidos a esta persona. */
  resumenes: number;
  /** Banqueos publicados (siempre de quien los arma). */
  banqueos: number;
  laboratorios: number;
  labsPesados: number;
  cursosConMaterial: number;
}

export interface TrackStats {
  track: Track;
  etiqueta: string;
  cursos: CursoStats[];
  actividades: number;
  resumenes: number;
  banqueos: number;
  covResumen: number;
  covBanqueo: number;
  laboratorios: number;
}

const pct = (n: number, total: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

function statsDeCurso(meta: CursoMeta): CursoStats {
  const semanas = SILABOS[meta.slug] ?? [];
  let actividades = 0;
  let resumenes = 0;
  let banqueos = 0;

  for (const semana of semanas) {
    for (const act of semana.actividades) {
      actividades++;
      if (act.resumen) resumenes++;
      if (act.examen) banqueos++;
    }
  }

  return {
    ...meta,
    actividades,
    resumenes,
    banqueos,
    covResumen: pct(resumenes, actividades),
    covBanqueo: pct(banqueos, actividades),
  };
}

export function getTrackStats(): TrackStats[] {
  const todos = CURSOS.map(statsDeCurso);

  return (['basico', 'medicina'] as Track[]).map((track) => {
    const cursos = todos.filter((c) => c.track === track);
    const actividades = cursos.reduce((s, c) => s + c.actividades, 0);
    const resumenes = cursos.reduce((s, c) => s + c.resumenes, 0);
    const banqueos = cursos.reduce((s, c) => s + c.banqueos, 0);
    return {
      track,
      etiqueta: track === 'basico' ? 'UFBI · 1.er año' : 'Facultad de Medicina · 2.º–7.º',
      cursos,
      actividades,
      resumenes,
      banqueos,
      covResumen: pct(resumenes, actividades),
      covBanqueo: pct(banqueos, actividades),
      laboratorios: LABORATORIOS.filter((l) => l.track === track).length,
    };
  });
}

/**
 * Atribuye cada unidad publicada a una persona.
 *
 * Los resúmenes se reparten por curso: si un curso tiene varios autores de
 * material, el crédito se divide en partes iguales (no se duplica, o el total
 * atribuido superaría lo realmente publicado). `APORTE_OVERRIDE` permite
 * reasignar actividades sueltas.
 */
export function getAportes(): AporteColaborador[] {
  const base = Object.entries(COLABORADORES).map(([key, meta]) => ({
    colaborador: key as Colaborador,
    nombre: meta.nombre,
    rol: meta.rol,
    color: meta.color,
    resumenes: 0,
    banqueos: 0,
    laboratorios: 0,
    labsPesados: 0,
    cursosConMaterial: 0,
  }));

  const idx = new Map(base.map((a) => [a.colaborador, a]));
  const overrides = Object.values(APORTE_OVERRIDE);

  for (const curso of CURSOS.map(statsDeCurso)) {
    // El banqueo siempre es de quien lo arma: hoy, BUST.
    const bust = idx.get('bust');
    if (bust) bust.banqueos += curso.banqueos;

    if (curso.resumenes > 0 && curso.materialDe.length > 0) {
      const cuota = curso.resumenes / curso.materialDe.length;
      for (const persona of curso.materialDe) {
        const a = idx.get(persona);
        if (!a) continue;
        a.resumenes += cuota;
        a.cursosConMaterial++;
      }
    }
  }

  // Overrides: mueven una unidad de su autor por defecto al declarado.
  for (const persona of overrides) {
    const a = idx.get(persona);
    if (a) a.resumenes += 1;
  }

  for (const lab of LABORATORIOS) {
    const a = idx.get(lab.autor);
    if (!a) continue;
    a.laboratorios++;
    if (lab.pesado) a.labsPesados++;
  }

  return base.map((a) => ({ ...a, resumenes: Math.round(a.resumenes * 10) / 10 }));
}
