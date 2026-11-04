import type { Track } from '@/lib/plans';
import {
  CURSOS,
  LABORATORIOS,
  APORTE_OVERRIDE,
  BANQUEO_ARMADO_DE,
  COLABORADORES,
  PRIORIDAD_LANZAMIENTO,
  type Colaborador,
  type CursoMeta,
} from '@/lib/data/aportes';
import { planDeActividad, type PlanActividad, type Slot } from '@/lib/material-plan';
import { SILABOS } from '@/lib/data/silabos';
import { HISTO_CURSOS } from '@/lib/data/histologia';
import { claveMarca, firmantesDe, indexarMarcas, type Marca } from '@/lib/aportes-marcas';

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
  /** Nombre de la tarjeta de material escrito que falta, o null si ya está en HTML. */
  faltaResumen: string | null;
  /** Tiene resumen, pero sólo en PDF: hay que pasarlo a HTML, no escribirlo de cero. */
  soloPdf: boolean;
  /** Nombre de la tarjeta de práctica que falta, o null si ya está / no aplica. */
  faltaBanqueo: string | null;
  /** Es una evaluación (examen, parcial, final, PC, paso). */
  esExamen: boolean;
  /** Categoría legible de la evaluación («Examen final»), sólo si `esExamen`. */
  examenLabel?: string;
  /** Tipo de actividad tal como lo nombra el sílabo, en palabras («Lab. de anatomía»). */
  tipoLabel: string;
  /** Página de la clase en el dashboard, para ir directo a completarla. */
  href: string;
}

/**
 * Los tipos del sílabo en palabras. El código crudo (`LAB-ANAT`, `AULA-INV`) es
 * jerga de los archivos de datos; quien planifica qué escribir piensa en «Lab.
 * de anatomía». Un tipo nuevo sin entrada cae en su código, sin romper nada.
 */
const TIPO_LABEL: Record<string, string> = {
  MAGISTRAL: 'Magistral',
  TEORIA: 'Teoría',
  SGP: 'SGP',
  TBL: 'TBL',
  ABP: 'ABP',
  ACP: 'ACP',
  LAB: 'Laboratorio',
  'LAB-ANAT': 'Lab. de anatomía',
  'LAB-HISTO': 'Lab. de histología',
  ANATOMIA: 'Anatomía',
  HISTOLOGIA: 'Histología',
  TALLER: 'Taller',
  'TALLER-INT': 'Taller integrador',
  'TALLER-FIS': 'Taller de fisiología',
  SEMINARIO: 'Seminario',
  PRACTICA: 'Práctica',
  REPASO: 'Repaso',
  'AULA-INV': 'Aula invertida',
  'AULA-VIRTUAL': 'Aula virtual',
  'REV-VIRTUAL': 'Revisión virtual',
  ICONOGRAFIA: 'Iconografía',
  AUTOAPRENDIZAJE: 'Autoaprendizaje',
  INTEGRACION: 'Integración',
  'EFI-GAMES': 'EFI Games',
};

export const tipoLabel = (tipo: string) => TIPO_LABEL[tipo] ?? tipo;

export interface CursoStats extends CursoMeta {
  actividades: number;
  /** Material escrito en HTML; los PDF cuentan como `falta`. */
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
  /** Parte de `banqueos` que es PDF subido tal cual, no banco armado. */
  banqueosRecolectados: number;
  laboratorios: number;
  labsPesados: number;
  /** Clases del atlas de histología. Sólo cuenta lo marcado a mano. */
  histologia: number;
  cursosConMaterial: number;
}

/** Material escrito de un tramo de Cayetano: lo que falta va primero. */
export interface EscritoTramo {
  track: Track;
  etiqueta: string;
  /** Sólo de los cursos con sílabo. */
  resumen: SlotStats;
  /** Cursos con clases sin resumen, de menos a más pendientes. */
  conFalta: CursoStats[];
  /** Cursos con todo su material escrito publicado. */
  completos: CursoStats[];
  /** Cursos sin sílabo cargado: no se puede medir qué les falta. */
  sinSilabo: CursoStats[];
}

/** Titular del panel: lo que falta para cubrir todos los temas de Cayetano. */
export interface Avance {
  facultad: EscritoTramo;
  ufbi: EscritoTramo;
  banqueo: {
    banqueo: SlotStats;
    examenes: SlotStats;
    /** Clases (no evaluaciones) sin banqueo. */
    faltanClase: number;
    /** Cursos con algún banqueo pendiente, los de más exámenes sin banqueo primero. */
    cursos: CursoStats[];
  };
}

const pct = (n: number, total: number) => (total === 0 ? 100 : Math.round((n / total) * 100));

function slotVacio(): SlotStats {
  return { listo: 0, falta: 0, noAplica: 0, cobertura: 0 };
}

/**
 * La cobertura sólo mide si el material está o no está. Quién lo subió y si lo
 * armó o lo consiguió se declara en «Quién subió qué» y se lee en `getAportes`.
 */
function acumular(acc: SlotStats, slot: Slot) {
  if (slot.estado === 'listo') acc.listo++;
  else if (slot.estado === 'falta') acc.falta++;
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

      // El material escrito del panel sólo cuenta el HTML: un PDF es un hueco.
      acumular(resumen, plan.escrito);
      acumular(banqueo, plan.banqueo);
      if (plan.esExamen) acumular(examenes, plan.banqueo);
      if (plan.apoyo.estado === 'listo') simulaciones++;
      if (plan.invitacion) invitaciones++;

      if (plan.escrito.estado === 'falta' || plan.banqueo.estado === 'falta') {
        pendientes.push({
          id: plan.id,
          titulo: plan.titulo,
          codigo: plan.codigo,
          bloque: semana.titulo,
          faltaResumen: plan.escrito.estado === 'falta' ? plan.escrito.label : null,
          soloPdf: plan.escrito.soloPdf,
          faltaBanqueo: plan.banqueo.estado === 'falta' ? plan.banqueo.label : null,
          esExamen: plan.esExamen,
          examenLabel: plan.examenLabel,
          tipoLabel: tipoLabel(plan.tipo),
          href: `/dashboard/cursos/${meta.slug}/${plan.id}`,
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

/** Se calcula una sola vez por carga y se reparte entre las vistas. */
function todosLosCursos(): CursoStats[] {
  return CURSOS.map(statsDeCurso);
}

function escritoDe(track: Track, todos: CursoStats[]): EscritoTramo {
  const cursos = todos.filter((c) => c.track === track);
  // Un curso sin actividades no está completo: no tiene sílabo cargado, y
  // contarlo como «listo» escondería el hueco más grande de todos.
  const sinSilabo = cursos.filter((c) => c.actividades === 0);
  const conSilabo = cursos.filter((c) => c.actividades > 0);
  return {
    track,
    etiqueta: track === 'basico' ? 'UFBI · 1.er año' : 'Facultad de Medicina · 2.º–7.º',
    resumen: sumar(conSilabo.map((c) => c.resumen)),
    // De menos a más pendientes: arriba lo que se cierra con poco trabajo.
    conFalta: conSilabo
      .filter((c) => c.resumen.falta > 0)
      .sort((a, b) => a.resumen.falta - b.resumen.falta || a.nombre.localeCompare(b.nombre)),
    completos: conSilabo.filter((c) => c.resumen.falta === 0),
    sinSilabo,
  };
}

/**
 * Lo que falta para cubrir todo Cayetano: el material escrito manda, el
 * banqueo va aparte y en pequeño. Se calcula de los sílabos en cada carga.
 */
export function getAvance(): Avance {
  const todos = todosLosCursos();
  const conSilabo = todos.filter((c) => c.actividades > 0);
  const banqueo = sumar(conSilabo.map((c) => c.banqueo));
  const examenes = sumar(conSilabo.map((c) => c.examenes));

  return {
    facultad: escritoDe('medicina', todos),
    ufbi: escritoDe('basico', todos),
    banqueo: {
      banqueo,
      examenes,
      faltanClase: banqueo.falta - examenes.falta,
      // Primero los cursos con más exámenes sin banqueo: es lo que más se busca.
      cursos: conSilabo
        .filter((c) => c.banqueo.falta > 0)
        .sort(
          (a, b) =>
            b.examenes.falta - a.examenes.falta ||
            b.banqueo.falta - a.banqueo.falta ||
            a.nombre.localeCompare(b.nombre),
        ),
    },
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
    banqueosRecolectados: 0,
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
    campo: 'resumenes' | 'banqueos' | 'banqueosRecolectados' | 'laboratorios' | 'histologia',
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
  const firmantes = (clave: string, porDefecto: readonly Colaborador[]): readonly Colaborador[] =>
    marcasIdx[clave]?.map((f) => f.colaborador) ?? porDefecto;

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
          // Por defecto lo arma quien monta los bancos de preguntas —hoy BUST—,
          // salvo en los cursos donde el banqueo de las clases lo hace otra
          // persona (los propuestos de Física los elabora María). Las
          // evaluaciones no heredan ese crédito: la PC de otro año se consigue,
          // no se arma, y quién la consiguió sólo se sabe si lo marca.
          const armadoDe = BANQUEO_ARMADO_DE[meta.slug];
          const porDefecto: Colaborador[] =
            armadoDe && !plan.esExamen ? [armadoDe] : ['bust'];

          const firmas = marcasIdx[claveMarca({ ...base_, slot: 'banqueo' })];
          const personas = firmas?.map((f) => f.colaborador) ?? porDefecto;
          acreditar(personas, 'banqueos');

          // El tipo de aporte sólo existe si alguien lo declaró al marcar: el
          // sílabo no distingue un PDF conseguido de uno hecho a mano.
          const cuota = 1 / personas.length;
          for (const f of firmas ?? []) {
            if (f.origen !== 'recolectado') continue;
            const a = idx.get(f.colaborador);
            if (a) a.banqueosRecolectados += cuota;
          }
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
      acreditar(firmantesDe(marcasIdx, clave), 'histologia');
    }
  }

  const red = (n: number) => Math.round(n * 10) / 10;

  return base.map((a) => ({
    ...a,
    resumenes: red(a.resumenes),
    banqueos: red(a.banqueos),
    banqueosRecolectados: red(a.banqueosRecolectados),
    laboratorios: red(a.laboratorios),
    labsPesados: red(a.labsPesados),
    histologia: red(a.histologia),
    cursosConMaterial: cursosPorPersona.get(a.colaborador)?.size ?? 0,
  }));
}
