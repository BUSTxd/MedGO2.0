import type { ClaseIndice, IndiceCurso, PracticaIndice, ResumenIndice } from './indice-tipos';

/**
 * El motor del planificador de estudio (`/estudio` → Mi progreso). Función pura:
 * recibe el índice del curso, lo que el alumno decidió y lo que ya hizo, y
 * devuelve el calendario desde hoy hasta la víspera del examen.
 *
 * El plan NO se guarda: se recalcula cada vez. Lo hecho sale de la lista (por id
 * determinista) y lo atrasado vuelve a repartirse solo en los días que quedan.
 * Por eso cada tarea tiene un id estable (`leer:<sección>`, `practicar:<clave>…`):
 * es lo único que se guarda de ella (las marcas «Ya lo leí»).
 *
 * Sin React ni `server-only`: lo prueba `scripts/estudio/probar-planificador.mjs`.
 */

// ── Lo que decide el alumno ──────────────────────────────────────────────────

export type Objetivo = 'aprobar' | 'destacar';
/** Cómo llega a cada unidad: sin verla, ya vista (repaso más corto) o dominada (solo practicar). */
export type Partida = 'nueva' | 'vista' | 'domino';

export type Alcance =
  | { tipo: 'curso' }
  /** Las clases que entran en una evaluación: desde la anterior hasta esta (`semana` del sílabo). */
  | { tipo: 'evaluacion'; semana: string }
  | { tipo: 'clases'; clases: string[] }
  | { tipo: 'temas'; temas: string[] }
  /** Bloques con nombre, como los separa la universidad del alumno: subtítulos sueltos. */
  | { tipo: 'bloques'; bloques: { nombre: string; secciones: string[] }[] };

export interface Respuestas {
  /** Días de la semana en que estudia: 0 = domingo … 6 = sábado. */
  dias: number[];
  /** Minutos por día de estudio. */
  minutos: number;
  /** Por id de unidad (clase, `tema:<id>`, `bloque:<n>`); lo que falte es `nueva`. */
  partida: Record<string, Partida>;
  objetivo: Objetivo;
}

export interface PlanGuardado {
  id: string;
  nombre: string;
  /** YYYY-MM-DD. */
  fechaExamen: string;
  alcance: Alcance;
  respuestas: Respuestas;
  creadoAt: string;
}

// ── Lo que ya hizo ───────────────────────────────────────────────────────────

/** Un banqueo terminado (evento `examen_completado`). */
export interface Intento {
  key: string;
  /** ISO. */
  fecha: string;
  score: number;
  total: number;
  /** El runner iba filtrado por tema o subtítulo. */
  tema?: string;
  seccion?: string;
  /** Aciertos/total por tema de ese intento. */
  temas?: Record<string, [number, number]>;
}

export interface Avance {
  intentos: Intento[];
  /** Ids de tareas marcadas a mano («Ya lo leí»). */
  hechas: string[];
  /** Clases con el check de «estudiada» del temario: su lectura cuenta como hecha. */
  estudiadas: string[];
}

// ── Lo que devuelve ──────────────────────────────────────────────────────────

export type TipoTarea = 'leer' | 'practicar' | 'repasar' | 'simulacro';

export interface PracticaTarea {
  tipo: 'examen' | 'tarjetas';
  key: string;
  tema?: string;
  seccion?: string;
}

export interface Tarea {
  id: string;
  tipo: TipoTarea;
  titulo: string;
  detalle: string;
  minutos: number;
  /** La clase donde se hace (abre su resumen o su práctica). */
  claseId: string;
  /** La unidad del plan a la que pertenece (clase, tema o bloque). */
  unidad: string;
  resumenId?: string;
  /** Título del primer subtítulo: el lector salta ahí. */
  seccion?: string;
  practica?: PracticaTarea;
  hecha: boolean;
  /** % del último intento, en las de práctica. */
  nota?: number;
}

export interface DiaPlan {
  fecha: string;
  tareas: Tarea[];
  minutos: number;
  vispera: boolean;
}

export interface UnidadPlan {
  id: string;
  titulo: string;
  claseIds: string[];
  /** Cuánto pesa en los exámenes reales (preguntas de sus temas en banqueos de evaluación). */
  peso: number;
  partida: Partida;
}

export interface ResultadoPlan {
  dias: DiaPlan[];
  /** Lo que no cabe antes del examen. */
  sinHueco: Tarea[];
  hechas: Tarea[];
  unidades: UnidadPlan[];
  /** Primer día del plan en que aparece cada clase (para anotar el temario). */
  diaDeClase: Record<string, string>;
  totales: {
    minutosPendientes: number;
    minutosDisponibles: number;
    minutosHechos: number;
    /** 0-100: hecho / (hecho + pendiente). */
    progreso: number;
    diasRestantes: number;
    /** Se reordenó por peso en exámenes porque no alcanzaba el tiempo. */
    priorizado: boolean;
  };
}

// ── Constantes ───────────────────────────────────────────────────────────────

/** Una tarea de lectura no pasa de esto: los resúmenes largos se parten por subtítulos. */
export const MAX_LECTURA = 25;
const MIN_POR_PREGUNTA = 1.2;
const MIN_POR_TARJETA = 0.4;
const MIN_REPASO = 15;
/** Días entre la primera y la segunda vuelta de un banqueo. */
const ESPACIADO = 3;
/** Por debajo de esto, un intento pide refuerzo (el mismo umbral que `temas-flojos.ts`). */
export const UMBRAL_FLOJO = 60;
/** Desde esta fracción de los días entran los simulacros. */
const FASE_FINAL = 0.75;

// ── Fechas (siempre YYYY-MM-DD, en UTC para no bailar con la zona horaria) ───

const aFecha = (d: Date) => d.toISOString().slice(0, 10);
const deFecha = (s: string) => new Date(`${s}T00:00:00Z`);
export const sumarDias = (s: string, n: number) => { const d = deFecha(s); d.setUTCDate(d.getUTCDate() + n); return aFecha(d); };
export const diasEntre = (a: string, b: string) => Math.round((deFecha(b).getTime() - deFecha(a).getTime()) / 86_400_000);
const diaSemana = (s: string) => deFecha(s).getUTCDay();

// ── Unidades del alcance ─────────────────────────────────────────────────────

interface Lectura { claseId: string; resumen: ResumenIndice; secciones: ResumenIndice['secciones'] }
interface Unidad extends UnidadPlan {
  lecturas: Lectura[];
  practicas: (PracticaTarea & { claseId: string; minutos: number; etiqueta: string })[];
}

const redondear = (x: number) => Math.max(1, Math.round(x));

/** Lo que se lee de una clase: sus resúmenes HTML; si no hay, el primero en PDF. */
function resumenesDe(c: ClaseIndice): ResumenIndice[] {
  const html = c.resumenes.filter((r) => r.formato === 'html' && r.calidad !== 'falta');
  if (html.length) return html;
  return c.resumenes.filter((r) => r.calidad === 'pdf').slice(0, 1);
}

const minutosPractica = (p: PracticaIndice, n?: number) =>
  n !== undefined ? redondear(n * ((MIN_POR_PREGUNTA + MIN_POR_TARJETA) / 2))
    : p.preguntas ? redondear(p.preguntas * MIN_POR_PREGUNTA) : redondear(p.tarjetas * MIN_POR_TARJETA);

const nombreClase = (c: ClaseIndice) => c.titulo;

function pesoDeClase(indice: IndiceCurso, claseId: string) {
  return Object.values(indice.temas).filter((t) => t.clases.includes(claseId)).reduce((a, t) => a + t.enExamenes, 0);
}

/** Las clases normales de una evaluación: las que van entre la evaluación anterior y ella. */
export function clasesDeEvaluacion(indice: IndiceCurso, semana: string): ClaseIndice[] {
  const out: ClaseIndice[] = [];
  for (const c of indice.clases) {
    if (c.evaluacion) {
      if (c.semana === semana) return out;
      out.length = 0;
      continue;
    }
    out.push(c);
  }
  return out;
}

/** Las semanas de evaluación del sílabo, para ofrecerlas en el asistente. */
export function evaluaciones(indice: IndiceCurso) {
  const vistas = new Map<string, ClaseIndice[]>();
  for (const c of indice.clases) if (c.evaluacion) vistas.set(c.semana, [...(vistas.get(c.semana) ?? []), c]);
  return [...vistas.entries()].map(([semana, clases]) => ({ semana, titulo: clases[0].titulo, clases }));
}

function unidadDeClase(indice: IndiceCurso, c: ClaseIndice, r: Respuestas): Unidad {
  return {
    id: c.id,
    titulo: nombreClase(c),
    claseIds: [c.id],
    peso: pesoDeClase(indice, c.id),
    partida: r.partida[c.id] ?? 'nueva',
    lecturas: resumenesDe(c).map((res) => ({ claseId: c.id, resumen: res, secciones: res.secciones })),
    practicas: c.practica.map((p) => ({
      tipo: p.tipo, key: p.key, claseId: c.id, minutos: minutosPractica(p),
      etiqueta: p.tipo === 'tarjetas' ? 'Quiz de la clase' : (p.etiqueta ?? 'Banqueo'),
    })),
  };
}

/** Dónde vive cada subtítulo del índice. */
function mapaSecciones(indice: IndiceCurso) {
  const m = new Map<string, { clase: ClaseIndice; resumen: ResumenIndice; i: number }>();
  for (const clase of indice.clases) for (const resumen of clase.resumenes) {
    resumen.secciones.forEach((s, i) => m.set(s.id, { clase, resumen, i }));
  }
  return m;
}

/** Subtítulos agrupados por resumen, en el orden del documento. */
function lecturasDeSecciones(indice: IndiceCurso, ids: string[]): Lectura[] {
  const mapa = mapaSecciones(indice);
  const grupos = new Map<string, Lectura & { orden: number[] }>();
  for (const id of ids) {
    const d = mapa.get(id);
    if (!d) continue;
    const g = grupos.get(d.resumen.id) ?? { claseId: d.clase.id, resumen: d.resumen, secciones: [], orden: [] };
    if (!g.orden.includes(d.i)) { g.orden.push(d.i); g.secciones.push(d.resumen.secciones[d.i]); }
    grupos.set(d.resumen.id, g);
  }
  return [...grupos.values()].map((g) => ({
    claseId: g.claseId, resumen: g.resumen,
    secciones: g.orden.map((i, k) => [i, g.secciones[k]] as const).sort((a, b) => a[0] - b[0]).map(([, s]) => s),
  }));
}

/**
 * La práctica de un tema: la suya propia si existe; si no, los quiz de las clases
 * que más preguntas tienen de él, filtrados por el tema. `preferir` (las clases
 * de un bloque) va primero; `max` limita cuántos quiz se piden.
 */
function practicasDeTema(indice: IndiceCurso, temaId: string, preferir: string[] = [], max = 2): Unidad['practicas'] {
  const t = indice.temas[temaId];
  if (!t) return [];
  const clases = indice.clases.filter((c) => t.clases.includes(c.id));
  const claseBase = clases[0]?.id ?? '';
  const propias: Unidad['practicas'] = [];
  // Un banqueo o tarjetas propios del tema mandan sobre filtrar los de la clase.
  if (t.tarjetas) propias.push({ tipo: 'tarjetas', key: t.tarjetas, claseId: claseBase, minutos: redondear(Math.max(10, t.preguntas * 0.5)), etiqueta: 'Tarjetas del tema' });
  if (t.banqueo) propias.push({ tipo: 'examen', key: t.banqueo, claseId: claseBase, minutos: redondear(Math.max(10, t.preguntas * MIN_POR_PREGUNTA)), etiqueta: 'Banqueo del tema' });
  if (propias.length) return propias;
  const candidatos: (Unidad['practicas'][number] & { n: number; pref: number })[] = [];
  for (const c of indice.clases) {
    if (c.evaluacion) continue;
    for (const p of c.practica) {
      const n = p.porTema[temaId];
      if (p.tipo !== 'tarjetas' || !n) continue;
      candidatos.push({
        tipo: 'tarjetas', key: p.key, tema: temaId, claseId: c.id, minutos: minutosPractica(p, n),
        etiqueta: `Quiz de ${c.codigo ?? c.titulo}, solo este tema`, n, pref: preferir.includes(c.id) ? 1 : 0,
      });
    }
  }
  return candidatos.sort((a, b) => b.pref - a.pref || b.n - a.n).slice(0, max).map(({ n: _n, pref: _p, ...x }) => x); // eslint-disable-line @typescript-eslint/no-unused-vars
}

function unidades(indice: IndiceCurso, alcance: Alcance, r: Respuestas): Unidad[] {
  const conMaterial = (c: ClaseIndice) => !c.evaluacion && (c.resumenes.length > 0 || c.practica.length > 0);
  switch (alcance.tipo) {
    case 'curso':
      return indice.clases.filter(conMaterial).map((c) => unidadDeClase(indice, c, r));
    case 'evaluacion':
      return clasesDeEvaluacion(indice, alcance.semana).filter(conMaterial).map((c) => unidadDeClase(indice, c, r));
    case 'clases': {
      const ids = new Set(alcance.clases);
      return indice.clases.filter((c) => ids.has(c.id) && conMaterial(c)).map((c) => unidadDeClase(indice, c, r));
    }
    case 'temas':
      return alcance.temas.filter((t) => indice.temas[t]).map((temaId) => {
        const t = indice.temas[temaId];
        let lecturas = lecturasDeSecciones(indice, t.secciones);
        if (!lecturas.length) {
          const c = indice.clases.find((x) => x.id === t.clases[0]);
          lecturas = c ? resumenesDe(c).map((res) => ({ claseId: c.id, resumen: res, secciones: res.secciones })) : [];
        }
        const id = `tema:${temaId}`;
        return {
          id, titulo: t.label, claseIds: t.clases, peso: t.enExamenes,
          partida: r.partida[id] ?? 'nueva', lecturas, practicas: practicasDeTema(indice, temaId),
        };
      });
    case 'bloques':
      return alcance.bloques.map((b, i) => {
        const lecturas = lecturasDeSecciones(indice, b.secciones);
        const temas = [...new Set(lecturas.flatMap((l) => l.secciones.flatMap((s) => s.temas)))];
        const clases = [...new Set(lecturas.map((l) => l.claseId))];
        // Un quiz por tema (el de las clases del bloque si lo hay), hasta 4 temas.
        const practicas = temas.slice(0, 4).flatMap((t) => practicasDeTema(indice, t, clases, 1))
          .filter((p, k, xs) => xs.findIndex((q) => q.key === p.key && q.tema === p.tema) === k);
        const id = `bloque:${i}`;
        return {
          id, titulo: b.nombre, claseIds: clases,
          peso: temas.reduce((a, t) => a + (indice.temas[t]?.enExamenes ?? 0), 0),
          partida: r.partida[id] ?? 'nueva', lecturas, practicas,
        };
      });
  }
}

/** Las unidades que saldrán de un alcance (para preguntar el punto de partida de cada una). */
export function listarUnidades(indice: IndiceCurso, alcance: Alcance): { id: string; titulo: string; claseIds: string[] }[] {
  return unidades(indice, alcance, { dias: [], minutos: 0, partida: {}, objetivo: 'aprobar' })
    .map(({ id, titulo, claseIds }) => ({ id, titulo, claseIds }));
}

function simulacros(indice: IndiceCurso, alcance: Alcance, objetivo: Objetivo) {
  let clases: ClaseIndice[] = [];
  if (alcance.tipo === 'curso') clases = indice.clases.filter((c) => c.evaluacion);
  else if (alcance.tipo === 'evaluacion') clases = indice.clases.filter((c) => c.evaluacion && c.semana === alcance.semana);
  else if (alcance.tipo === 'clases') clases = indice.clases.filter((c) => c.evaluacion && alcance.clases.includes(c.id));
  const todos = clases.flatMap((c) => c.practica.filter((p) => p.tipo === 'examen').map((p) => ({ c, p })));
  return objetivo === 'destacar' ? todos : todos.slice(0, 2);
}

// ── Tareas ───────────────────────────────────────────────────────────────────

const pct = (i: Intento) => (i.total > 0 ? Math.round((i.score / i.total) * 100) : 0);

/** Los intentos que cuentan para una práctica: misma clave y mismo filtro (sin filtro vale cualquiera sin filtro). */
function intentosDe(avance: Avance, p: PracticaTarea) {
  return avance.intentos
    .filter((i) => i.key === p.key && (p.tema ? i.tema === p.tema : !i.tema) && (p.seccion ? i.seccion === p.seccion : !i.seccion))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function flojosDe(i: Intento | undefined, indice: IndiceCurso) {
  if (!i?.temas) return [];
  return Object.entries(i.temas)
    .filter(([, [ok, total]]) => total > 0 && (ok / total) * 100 < UMBRAL_FLOJO)
    .map(([t]) => indice.temas[t]?.label ?? t);
}

interface Pendiente extends Tarea {
  /** No antes de este día (YYYY-MM-DD). */
  desde?: string;
  cola: 'refuerzo' | 'principal' | 'espaciada' | 'simulacro';
}

function tareasDeUnidad(u: Unidad, r: Respuestas, avance: Avance, indice: IndiceCurso, hoy: string): Pendiente[] {
  const out: Pendiente[] = [];
  const hechasMano = new Set(avance.hechas);
  const estudiada = u.claseIds.length === 1 && u.id === u.claseIds[0] && avance.estudiadas.includes(u.id);
  const factor = u.partida === 'vista' ? 0.5 : 1;

  if (u.partida !== 'domino') {
    for (const l of u.lecturas) {
      const codigo = indice.clases.find((c) => c.id === l.claseId)?.codigo;
      const prefijo = `${u.partida === 'vista' ? 'Repasa' : 'Lee'} ${codigo ?? ''}`.trim();
      if (!l.secciones.length) {
        const id = `leer:${l.resumen.id}`;
        out.push({
          id, tipo: 'leer', cola: 'principal', titulo: `${prefijo}: ${u.titulo}`, detalle: l.resumen.label,
          minutos: redondear(l.resumen.minutos * factor), claseId: l.claseId, unidad: u.id, resumenId: l.resumen.id,
          hecha: hechasMano.has(id) || estudiada,
        });
        continue;
      }
      // Trozos de hasta MAX_LECTURA minutos, sin partir un subtítulo.
      let trozo: typeof l.secciones = [];
      let min = 0;
      const cerrar = () => {
        if (!trozo.length) return;
        const id = `leer:${trozo[0].id}`;
        const desdeA = trozo.length > 1 ? `${trozo[0].titulo} → ${trozo[trozo.length - 1].titulo}` : trozo[0].titulo;
        out.push({
          id, tipo: 'leer', cola: 'principal', titulo: `${prefijo}: ${desdeA}`,
          detalle: `${trozo.length} ${trozo.length === 1 ? 'subtítulo' : 'subtítulos'} de ${u.titulo}`,
          minutos: redondear(min * factor), claseId: l.claseId, unidad: u.id, resumenId: l.resumen.id,
          seccion: trozo[0].titulo, hecha: hechasMano.has(id) || estudiada,
        });
        trozo = []; min = 0;
      };
      for (const s of l.secciones) {
        if (trozo.length && min + s.minutos > MAX_LECTURA) cerrar();
        trozo.push(s); min += s.minutos;
      }
      cerrar();
    }
  }

  const vueltas = r.objetivo === 'destacar' ? 2 : 1;
  for (const p of u.practicas) {
    const practica: PracticaTarea = { tipo: p.tipo, key: p.key, ...(p.tema ? { tema: p.tema } : {}), ...(p.seccion ? { seccion: p.seccion } : {}) };
    const intentos = intentosDe(avance, practica);
    const base = `${p.key}${p.tema ? `~${p.tema}` : ''}`;
    const ultimo = intentos[intentos.length - 1];
    for (let v = 1; v <= vueltas; v++) {
      const hecha = intentos.length >= v;
      const desde = v > 1 ? (intentos[0] ? sumarDias(intentos[0].fecha.slice(0, 10), ESPACIADO) : undefined) : undefined;
      out.push({
        id: `practicar:${base}:${v}`, tipo: 'practicar', cola: v === 1 ? 'principal' : 'espaciada',
        titulo: `${v === 1 ? 'Practica' : 'Segunda vuelta'}: ${u.titulo}`, detalle: p.etiqueta,
        minutos: p.minutos, claseId: p.claseId, unidad: u.id, practica, hecha,
        ...(hecha ? { nota: pct(intentos[v - 1]) } : {}),
        ...(desde && desde > hoy ? { desde } : {}),
      });
    }
    // Refuerzo: el último intento quedó flojo. Al volver a intentarlo cambia el id
    // (lleva el número de intentos), así que desaparece solo si ya salió bien.
    if (ultimo && pct(ultimo) < UMBRAL_FLOJO) {
      const id = `repasar:${base}:${intentos.length}`;
      const flojos = flojosDe(ultimo, indice);
      out.push({
        id, tipo: 'repasar', cola: 'refuerzo', titulo: `Refuerza: ${u.titulo}`,
        detalle: flojos.length ? `Flojo en ${flojos.slice(0, 3).join(', ')}: relee y vuelve a practicar` : `Sacaste ${pct(ultimo)} %: relee lo que fallaste y vuelve a practicar`,
        minutos: MIN_REPASO + p.minutos, claseId: p.claseId, unidad: u.id, practica,
        resumenId: u.lecturas.find((l) => l.claseId === p.claseId)?.resumen.id,
        hecha: hechasMano.has(id),
      });
    }
  }
  return out;
}

// ── Calendario ───────────────────────────────────────────────────────────────

function repartir(pendientes: Pendiente[], dias: string[], vispera: string | null, minutos: number) {
  const calendario: DiaPlan[] = dias.map((fecha) => ({ fecha, tareas: [], minutos: 0, vispera: fecha === vispera }));
  const colas = {
    refuerzo: pendientes.filter((t) => t.cola === 'refuerzo'),
    principal: pendientes.filter((t) => t.cola === 'principal'),
    espaciada: pendientes.filter((t) => t.cola === 'espaciada'),
    simulacro: pendientes.filter((t) => t.cola === 'simulacro'),
  };
  const inicioFinal = dias.length >= 4 ? Math.floor(dias.length * FASE_FINAL) : Math.max(0, dias.length - 1);
  const colocadoEn = new Map<string, number>();

  calendario.forEach((dia, i) => {
    // La víspera, solo la mitad y nada nuevo: refuerzos y segundas vueltas.
    const tope = dia.vispera ? Math.round(minutos / 2) : minutos;
    const cabe = (t: Pendiente) => dia.minutos + t.minutos <= tope || dia.tareas.length === 0;
    const poner = (t: Pendiente) => { dia.tareas.push(t); dia.minutos += t.minutos; colocadoEn.set(t.id, i); };
    const listo = (t: Pendiente) => {
      if (t.desde && t.desde > dia.fecha) return false;
      // Una segunda vuelta espera ESPACIADO días desde la primera, si la primera está en el plan.
      const [, base] = t.id.match(/^practicar:(.+):2$/) ?? [];
      if (base) {
        const primera = colocadoEn.get(`practicar:${base}:1`);
        if (primera !== undefined && i - primera < ESPACIADO) return false;
        if (primera === undefined && colas.principal.some((x) => x.id === `practicar:${base}:1`)) return false;
      }
      return true;
    };
    const tomarDe = (cola: Pendiente[], max = Infinity, enOrden = false) => {
      let n = 0;
      for (let k = 0; k < cola.length && n < max;) {
        const t = cola[k];
        if (listo(t) && cabe(t)) { poner(t); cola.splice(k, 1); n++; continue; }
        if (enOrden) break;
        k++;
      }
    };

    tomarDe(colas.refuerzo);
    if (!dia.vispera && i >= inicioFinal) tomarDe(colas.simulacro, 1);
    tomarDe(colas.espaciada);
    if (!dia.vispera) tomarDe(colas.principal, Infinity, true);
    // Si sobró hueco al final, otro simulacro.
    if (!dia.vispera && i >= inicioFinal) tomarDe(colas.simulacro, 1);
  });

  const sinHueco = [...colas.refuerzo, ...colas.principal, ...colas.espaciada, ...colas.simulacro];
  return { calendario, sinHueco };
}

/** Los días de estudio desde hoy hasta la víspera del examen. */
export function diasDeEstudio(hoy: string, fechaExamen: string, dias: number[]) {
  const out: string[] = [];
  for (let f = hoy; f < fechaExamen; f = sumarDias(f, 1)) if (dias.includes(diaSemana(f))) out.push(f);
  return out;
}

export function planificar(indice: IndiceCurso, plan: Pick<PlanGuardado, 'fechaExamen' | 'alcance' | 'respuestas'>, avance: Avance, hoy: string): ResultadoPlan {
  const r = plan.respuestas;
  const dias = diasDeEstudio(hoy, plan.fechaExamen, r.dias);
  const vispera = dias.includes(sumarDias(plan.fechaExamen, -1)) ? sumarDias(plan.fechaExamen, -1) : null;

  const armar = (us: Unidad[]) => {
    const todas: Pendiente[] = us.flatMap((u) => tareasDeUnidad(u, r, avance, indice, hoy));
    for (const { c, p } of simulacros(indice, plan.alcance, r.objetivo)) {
      const practica: PracticaTarea = { tipo: 'examen', key: p.key };
      const intentos = intentosDe(avance, practica);
      todas.push({
        id: `simulacro:${p.key}`, tipo: 'simulacro', cola: 'simulacro',
        titulo: `Simulacro: ${p.etiqueta ?? c.titulo}`, detalle: `${p.preguntas} preguntas de examen, con cronómetro`,
        minutos: redondear(p.preguntas * MIN_POR_PREGUNTA), claseId: c.id, unidad: c.id, practica,
        hecha: intentos.length > 0, ...(intentos.length ? { nota: pct(intentos[intentos.length - 1]) } : {}),
      });
    }
    const pendientes = todas.filter((t) => !t.hecha);
    return { todas, ...repartir(pendientes, dias, vispera, r.minutos) };
  };

  let us = unidades(indice, plan.alcance, r);
  let res = armar(us);
  let priorizado = false;
  // No alcanza: primero lo que más pesa en los exámenes reales (estable: a igual peso, el orden del sílabo).
  if (res.sinHueco.length && us.length > 1 && us.some((u) => u.peso > 0)) {
    us = us.map((u, i) => ({ u, i })).sort((a, b) => b.u.peso - a.u.peso || a.i - b.i).map((x) => x.u);
    res = armar(us);
    priorizado = true;
  }

  const hechas = res.todas.filter((t) => t.hecha);
  const minutosHechos = hechas.reduce((a, t) => a + t.minutos, 0);
  const minutosPendientes = res.todas.filter((t) => !t.hecha).reduce((a, t) => a + t.minutos, 0);
  const diaDeClase: Record<string, string> = {};
  for (const d of res.calendario) for (const t of d.tareas) diaDeClase[t.claseId] ??= d.fecha;
  const limpiar = ({ cola: _c, desde: _d, ...t }: Pendiente): Tarea => t; // eslint-disable-line @typescript-eslint/no-unused-vars

  return {
    dias: res.calendario.map((d) => ({ ...d, tareas: d.tareas.map((t) => limpiar(t as Pendiente)) })),
    sinHueco: res.sinHueco.map(limpiar),
    hechas: hechas.map(limpiar),
    unidades: us.map(({ id, titulo, claseIds, peso, partida }) => ({ id, titulo, claseIds, peso, partida })),
    diaDeClase,
    totales: {
      minutosPendientes,
      minutosDisponibles: res.calendario.reduce((a, d) => a + (d.vispera ? Math.round(r.minutos / 2) : r.minutos), 0),
      minutosHechos,
      progreso: minutosHechos + minutosPendientes > 0 ? Math.round((minutosHechos / (minutosHechos + minutosPendientes)) * 100) : 0,
      diasRestantes: Math.max(0, diasEntre(hoy, plan.fechaExamen)),
      priorizado,
    },
  };
}
