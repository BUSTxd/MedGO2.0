import type { Track } from '@/lib/plans';
import {
  CURSOS,
  LABORATORIOS,
  APORTE_OVERRIDE,
  COLABORADORES,
  PRIORIDAD_LANZAMIENTO,
  type Colaborador,
  type CursoMeta,
} from '@/lib/data/aportes';
import { planDeActividad, type ActividadLike, type PlanActividad } from '@/lib/material-plan';

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

interface SemanaLike {
  titulo: string;
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
  'patologia':              patologia       as unknown as SemanaLike[],
  'biologia-celular':       biologiaCelular as unknown as SemanaLike[],
  'ciencias-sociales':      cienciasSociales as unknown as SemanaLike[],
  'fisica-medicina':        fisica          as unknown as SemanaLike[],
  'quimica-organica':       quimicaOrganica as unknown as SemanaLike[],
  'comunicacion-redaccion-ii': comunicacion as unknown as SemanaLike[],
  'cultura-ambiental':      culturaAmbiental as unknown as SemanaLike[],
};

/** Recuento de un slot (Resumen o Banqueo) sobre las actividades de un curso. */
export interface SlotStats {
  listo: number;
  falta: number;
  /** Actividades donde esa tarjeta ni se muestra: no cuentan al porcentaje. */
  noAplica: number;
  /** 0–100 sobre `listo + falta`, es decir sólo lo exigible. */
  cobertura: number;
}

/** Fila del desglose que se ve al abrir un curso: qué le falta a esta actividad. */
export interface Pendiente {
  id: string;
  titulo: string;
  codigo?: string;
  /** Bloque del sílabo al que pertenece (unidad o semana). */
  bloque: string;
  /** Nombre de la tarjeta de material escrito que falta, o null si ya está. */
  faltaResumen: string | null;
  /** Nombre de la tarjeta de práctica que falta, o null si ya está / no aplica. */
  faltaBanqueo: string | null;
  /** Es una evaluación (examen, parcial, final, PC, paso). */
  esExamen: boolean;
  /** Categoría legible de la evaluación («Examen final»), sólo si `esExamen`. */
  examenLabel?: string;
}

export interface CursoStats extends CursoMeta {
  actividades: number;
  resumen: SlotStats;
  banqueo: SlotStats;
  /**
   * Subconjunto de `banqueo` restringido a las evaluaciones (exámenes,
   * parciales, finales, PCs, pasos): el banqueo más buscado del curso.
   */
  examenes: SlotStats;
  /** Simulaciones/labs interactivos ya enlazados desde el sílabo. */
  simulaciones: number;
  /** Actividades con la invitación a colaborar en vez de tarjetas apagadas. */
  invitaciones: number;
  /** Actividades a las que les falta algo, en orden de sílabo. */
  pendientes: Pendiente[];
  /** Posición en `PRIORIDAD_LANZAMIENTO`, o null si no bloquea el lanzamiento. */
  prioridad: number | null;
}

export interface AporteColaborador {
  colaborador: Colaborador;
  nombre: string;
  rol: string;
  color: string;
  resumenes: number;
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
  resumen: SlotStats;
  banqueo: SlotStats;
  examenes: SlotStats;
  laboratorios: number;
}

/** Titular del panel: lo que falta para poder lanzar. */
export interface Lanzamiento {
  cursos: CursoStats[];
  resumen: SlotStats;
  banqueo: SlotStats;
  examenes: SlotStats;
  /** Evaluaciones de los cursos prioritarios sin banqueo: la deuda más cara. */
  faltanExamen: number;
  /** Clases (no evaluaciones) de los cursos prioritarios sin banqueo. */
  faltanBanqueoClase: number;
  /** Actividades de los cursos prioritarios sin material escrito. */
  faltanResumen: number;
  /** Cursos prioritarios sin ningún hueco de banqueo ni de material escrito. */
  cursosListos: number;
  /** Cursos prioritarios con todo el material escrito, aunque les falte banqueo. */
  cursosConEscrito: number;
}

const pct = (n: number, total: number) => (total === 0 ? 100 : Math.round((n / total) * 100));

function slotVacio(): SlotStats {
  return { listo: 0, falta: 0, noAplica: 0, cobertura: 0 };
}

function acumular(acc: SlotStats, estado: string) {
  if (estado === 'listo') acc.listo++;
  else if (estado === 'falta') acc.falta++;
  else acc.noAplica++;
}

function cerrar(acc: SlotStats): SlotStats {
  return { ...acc, cobertura: pct(acc.listo, acc.listo + acc.falta) };
}

function sumar(slots: SlotStats[]): SlotStats {
  const total = slots.reduce(
    (s, x) => ({
      listo: s.listo + x.listo,
      falta: s.falta + x.falta,
      noAplica: s.noAplica + x.noAplica,
      cobertura: 0,
    }),
    slotVacio(),
  );
  return cerrar(total);
}

function statsDeCurso(meta: CursoMeta): CursoStats {
  const semanas = SILABOS[meta.slug] ?? [];
  const resumen = slotVacio();
  const banqueo = slotVacio();
  const examenes = slotVacio();
  const pendientes: Pendiente[] = [];
  let actividades = 0;
  let simulaciones = 0;
  let invitaciones = 0;

  for (const semana of semanas) {
    for (const act of semana.actividades) {
      actividades++;
      const plan: PlanActividad = planDeActividad(meta.slug, act);

      acumular(resumen, plan.resumen.estado);
      acumular(banqueo, plan.banqueo.estado);
      if (plan.esExamen) acumular(examenes, plan.banqueo.estado);
      if (plan.apoyo.estado === 'listo') simulaciones++;
      if (plan.invitacion) invitaciones++;

      if (plan.resumen.estado === 'falta' || plan.banqueo.estado === 'falta') {
        pendientes.push({
          id: plan.id,
          titulo: plan.titulo,
          codigo: plan.codigo,
          bloque: semana.titulo,
          faltaResumen: plan.resumen.estado === 'falta' ? plan.resumen.label : null,
          faltaBanqueo: plan.banqueo.estado === 'falta' ? plan.banqueo.label : null,
          esExamen: plan.esExamen,
          examenLabel: plan.examenLabel,
        });
      }
    }
  }

  const prioridad = PRIORIDAD_LANZAMIENTO.indexOf(meta.slug);

  return {
    ...meta,
    actividades,
    resumen: cerrar(resumen),
    banqueo: cerrar(banqueo),
    examenes: cerrar(examenes),
    simulaciones,
    invitaciones,
    pendientes,
    prioridad: prioridad === -1 ? null : prioridad,
  };
}

/** Se calcula una sola vez por render y se comparte entre las tres vistas. */
function todosLosCursos(): CursoStats[] {
  return CURSOS.map(statsDeCurso);
}

export function getTrackStats(): TrackStats[] {
  const todos = todosLosCursos();

  return (['basico', 'medicina'] as Track[]).map((track) => {
    const cursos = todos.filter((c) => c.track === track);
    return {
      track,
      etiqueta: track === 'basico' ? 'UFBI · 1.er año' : 'Facultad de Medicina · 2.º–7.º',
      cursos,
      actividades: cursos.reduce((s, c) => s + c.actividades, 0),
      resumen: sumar(cursos.map((c) => c.resumen)),
      banqueo: sumar(cursos.map((c) => c.banqueo)),
      examenes: sumar(cursos.map((c) => c.examenes)),
      laboratorios: LABORATORIOS.filter((l) => l.track === track).length,
    };
  });
}

/**
 * Cobertura de los cursos que sí bloquean el lanzamiento, en el orden declarado
 * en `PRIORIDAD_LANZAMIENTO`.
 */
export function getLanzamiento(): Lanzamiento {
  const todos = todosLosCursos();
  const cursos = PRIORIDAD_LANZAMIENTO.map((slug) => todos.find((c) => c.slug === slug)).filter(
    (c): c is CursoStats => !!c,
  );

  const examenes = sumar(cursos.map((c) => c.examenes));
  const banqueo = sumar(cursos.map((c) => c.banqueo));

  return {
    cursos,
    resumen: sumar(cursos.map((c) => c.resumen)),
    banqueo,
    examenes,
    faltanExamen: examenes.falta,
    faltanBanqueoClase: banqueo.falta - examenes.falta,
    faltanResumen: cursos.reduce((s, c) => s + c.resumen.falta, 0),
    cursosListos: cursos.filter((c) => c.resumen.falta === 0 && c.banqueo.falta === 0).length,
    cursosConEscrito: cursos.filter((c) => c.resumen.falta === 0).length,
  };
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

  for (const curso of todosLosCursos()) {
    // El banqueo siempre es de quien lo arma: hoy, BUST.
    const bust = idx.get('bust');
    if (bust) bust.banqueos += curso.banqueo.listo;

    if (curso.resumen.listo > 0 && curso.materialDe.length > 0) {
      const cuota = curso.resumen.listo / curso.materialDe.length;
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
