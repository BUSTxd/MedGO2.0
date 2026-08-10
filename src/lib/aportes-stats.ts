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
import { planDeActividad, type PlanActividad } from '@/lib/material-plan';
import { SILABOS } from '@/lib/data/silabos';
import { HISTO_CURSOS } from '@/lib/data/histologia';
import { claveMarca, indexarMarcas, type Marca } from '@/lib/aportes-marcas';

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
  /** Clases del atlas de histología. Sólo cuenta lo marcado a mano. */
  histologia: number;
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
 * Manda lo marcado a mano en el panel: si alguien pintó el círculo de ese
 * material, el crédito es suyo, y si lo pintaron varios se divide en partes
 * iguales entre ellos (nunca se duplica, o el total atribuido superaría lo
 * realmente publicado).
 *
 * Sin marcas se cae al reparto declarado en `aportes.ts` —`materialDe` del
 * curso para el escrito, `bust` para el banqueo, el `autor` del lab— que es una
 * estimación: sirve para que el panel no salga vacío antes de que el equipo
 * marque, pero cualquier marca lo corrige.
 */
export function getAportes(marcas: readonly Marca[] = []): AporteColaborador[] {
  const marcasIdx = indexarMarcas(marcas);

  const base = Object.entries(COLABORADORES).map(([key, meta]) => ({
    colaborador: key as Colaborador,
    nombre: meta.nombre,
    rol: meta.rol,
    color: meta.color,
    resumenes: 0,
    banqueos: 0,
    laboratorios: 0,
    labsPesados: 0,
    histologia: 0,
    cursosConMaterial: 0,
  }));

  const idx = new Map(base.map((a) => [a.colaborador, a]));
  /** Cursos en los que a cada persona se le atribuyó material escrito. */
  const cursosPorPersona = new Map<Colaborador, Set<string>>();

  /** Reparte una unidad publicada entre quienes la firman. */
  function acreditar(
    personas: readonly Colaborador[],
    campo: 'resumenes' | 'banqueos' | 'laboratorios' | 'histologia',
    unidad = 1,
  ) {
    if (personas.length === 0) return;
    const cuota = unidad / personas.length;
    for (const persona of personas) {
      const a = idx.get(persona);
      if (a) a[campo] += cuota;
    }
  }

  /** Quién firma este material: lo marcado, o el reparto por defecto. */
  const firmantes = (
    clave: string,
    porDefecto: readonly Colaborador[],
  ): readonly Colaborador[] => marcasIdx[clave] ?? porDefecto;

  for (const meta of CURSOS) {
    for (const semana of SILABOS[meta.slug] ?? []) {
      for (const act of semana.actividades) {
        const plan = planDeActividad(meta.slug, act);
        const base_ = { ambito: 'curso' as const, scopeId: meta.slug, itemId: plan.id };

        if (plan.resumen.estado === 'listo') {
          // El override reasigna una actividad suelta a otra persona.
          const porDefecto = APORTE_OVERRIDE[plan.id]
            ? [APORTE_OVERRIDE[plan.id]]
            : meta.materialDe;
          const personas = firmantes(claveMarca({ ...base_, slot: 'resumen' }), porDefecto);
          acreditar(personas, 'resumenes');
          for (const p of personas) {
            (cursosPorPersona.get(p) ?? cursosPorPersona.set(p, new Set()).get(p)!).add(meta.slug);
          }
        }

        if (plan.banqueo.estado === 'listo') {
          // El banqueo lo arma quien monta el banco de preguntas: hoy, BUST.
          acreditar(firmantes(claveMarca({ ...base_, slot: 'banqueo' }), ['bust']), 'banqueos');
        }
      }
    }
  }

  for (const lab of LABORATORIOS) {
    const clave = claveMarca({
      ambito: 'laboratorio',
      scopeId: 'labs',
      itemId: lab.slug,
      slot: 'material',
    });
    const personas = firmantes(clave, [lab.autor]);
    acreditar(personas, 'laboratorios');
    if (lab.pesado) {
      const cuota = 1 / personas.length;
      for (const persona of personas) {
        const a = idx.get(persona);
        if (a) a.labsPesados += cuota;
      }
    }
  }

  // Histología no declara autor en ningún archivo: sólo cuenta lo marcado.
  for (const curso of HISTO_CURSOS) {
    for (const clase of curso.clases) {
      const clave = claveMarca({
        ambito: 'histologia',
        scopeId: curso.id,
        itemId: clase.slug,
        slot: 'material',
      });
      acreditar(marcasIdx[clave] ?? [], 'histologia');
    }
  }

  const red = (n: number) => Math.round(n * 10) / 10;

  return base.map((a) => ({
    ...a,
    resumenes: red(a.resumenes),
    banqueos: red(a.banqueos),
    laboratorios: red(a.laboratorios),
    labsPesados: red(a.labsPesados),
    histologia: red(a.histologia),
    cursosConMaterial: cursosPorPersona.get(a.colaborador)?.size ?? 0,
  }));
}
