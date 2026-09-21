import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { CURSOS, LABORATORIOS } from '@/lib/data/aportes';
import { SILABOS } from '@/lib/data/silabos';
import { HISTO_CURSOS } from '@/lib/data/histologia';
import { EXAMENES } from '@/lib/data/examenes-acceso';
import { PLANS, type PlanKey } from '@/lib/plans';

export interface EventoRow {
  user_id: string | null;
  event: string;
  path: string | null;
  props: Record<string, unknown> | null;
  plan: string | null;
  created_at: string;
}

/** Cómo estaba el contenido para el alumno: abierto a todos, a medias o con candado. */
export type Etiqueta = 'gratis' | 'muestra' | 'bloqueado';

/** Acceso congelado en el evento al registrarlo (props.acceso). */
export type Acceso = 'gratis' | 'muestra' | 'pago';

/** Versión del registro de acceso. Los eventos sin ella son anteriores: acceso desconocido. */
export const ACCESO_V = 1;

export interface EventoLegible {
  fecha: string;
  evento: string;
  accion: string;
  lugar: string;
  detalle: string | null;
  etiqueta: Etiqueta | null;
  /** Para el CSV: gratis / muestra / pago / bloqueado, o sin_registro en eventos viejos. */
  acceso: string;
  cursoSlug: string | null;
  path: string | null;
  /** Hasta cuándo siguió en esa página y cuánto tiempo la tuvo a la vista. */
  estancia: Estancia | null;
}

export interface Estancia {
  hasta: string;
  segundos: number;
}

/** Tramo continuo de uso: se corta tras 30 min sin registros. */
export interface Sesion {
  inicio: string;
  fin: string;
  /** El fin es una salida registrada; si no, es el último evento (se fue en algún momento después). */
  exacto: boolean;
}

export interface CursoDeUsuario {
  slug: string;
  nombre: string;
  dias: number;
  eventos: number;
  ultimo: string;
}

export interface Bloqueo {
  lugar: string;
  veces: number;
  ultimo: string;
  /** Si llegó a pulsar el botón de pago desde ahí. */
  abrioPago: boolean;
}

export interface ActividadUsuario {
  totalEventos: number;
  primerRegistro: string | null;
  diasActivos: number;
  cursos: CursoDeUsuario[];
  eventos: EventoLegible[];
  bloqueos: Bloqueo[];
  sesiones: Sesion[];
  truncado: boolean;
}

const NOMBRE_CURSO = new Map(CURSOS.map((c) => [c.slug, c.nombre]));
const NOMBRE_LAB = new Map(LABORATORIOS.map((l) => [l.slug, l.nombre]));
const NOMBRE_HISTO = new Map(HISTO_CURSOS.map((h) => [h.id, h.nombre]));
const LABS_GRATIS = new Set(LABORATORIOS.filter((l) => l.gratis).map((l) => l.slug));

const SECCIONES: Record<string, string> = {
  home: 'Inicio',
  cursos: 'Cursos',
  laboratorio: 'Laboratorio',
  histologia: 'Histología',
  investigacion: 'Investigación',
  cuenta: 'Mi cuenta',
  contacto: 'Contacto',
  aportes: 'Aportes',
};

const ACCION: Record<string, string> = {
  pagina_vista: 'Visitó',
  pagina_salida: 'Salió de',
  clase_abierta: 'Abrió la clase',
  resumen_abierto: 'Abrió el resumen',
  banco_iniciado: 'Empezó el banqueo',
  examen_completado: 'Terminó el banqueo',
  simulacion_abierta: 'Abrió la simulación',
  contenido_bloqueado: 'Chocó con el candado en',
  pago_abierto: 'Abrió el pago desde',
};

const MODO_BANQUEO: Record<string, string> = {
  tarjetas: 'Tarjetas de memoria',
  quiz: 'Quiz',
};

const ORIGEN_PAGO: Record<string, string> = {
  candado: 'el candado',
  aviso: 'el aviso del banqueo',
  muestra: 'el final de la muestra',
  resumen: 'el botón Premium del resumen',
};

let clases: Map<string, string> | null = null;
function tituloClase(curso: string, id: string): string | null {
  if (!clases) {
    clases = new Map();
    for (const [slug, semanas] of Object.entries(SILABOS)) {
      for (const s of semanas) {
        for (const a of s.actividades) {
          const conCodigo = a.codigo && !a.titulo.startsWith(a.codigo);
          clases.set(`${slug}/${a.id}`, conCodigo ? `${a.codigo} · ${a.titulo}` : a.titulo);
        }
      }
    }
  }
  return clases.get(`${curso}/${id}`) ?? null;
}

function bonito(slug: string): string {
  const s = decodeURIComponent(slug).replace(/-/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function nombrePlan(plan: unknown): string | null {
  return typeof plan === 'string' && plan in PLANS ? PLANS[plan as PlanKey].label : null;
}

/** Traduce una ruta del dashboard a «dónde estaba». */
export function lugarDeRuta(path: string | null): { lugar: string; cursoSlug: string | null } {
  if (!path) return { lugar: '—', cursoSlug: null };
  const partes = path.split('/').filter(Boolean);
  if (partes[0] !== 'dashboard') {
    return { lugar: path === '/' ? 'Página de inicio pública' : path, cursoSlug: null };
  }
  const [, seccion, a, b, c] = partes;
  if (!seccion) return { lugar: 'Inicio', cursoSlug: null };

  if (seccion === 'cursos' && a) {
    const curso = NOMBRE_CURSO.get(a) ?? bonito(a);
    if (!b) return { lugar: `${curso} · índice del curso`, cursoSlug: a };
    const id = b === 'modulo' && c ? c : b;
    const clase = tituloClase(a, id) ?? bonito(id);
    return { lugar: `${curso} · ${clase}${b === 'modulo' ? ' (módulo)' : ''}`, cursoSlug: a };
  }
  if (seccion === 'laboratorio' && a) {
    return { lugar: `Laboratorio · ${NOMBRE_LAB.get(a) ?? bonito(a)}`, cursoSlug: null };
  }
  if (seccion === 'histologia' && a) {
    return { lugar: `Histología · ${NOMBRE_HISTO.get(a) ?? bonito(a)}`, cursoSlug: null };
  }
  if (seccion === 'investigacion' && a) {
    return { lugar: `Investigación · nivel ${a}`, cursoSlug: null };
  }
  return { lugar: SECCIONES[seccion] ?? bonito(seccion), cursoSlug: null };
}

/**
 * Acceso del contenido EN EL MOMENTO del evento; /api/track lo congela en
 * props. Así un cambio posterior de gratis ↔ pago no reescribe la historia.
 * - Banqueos: manda `EXAMENES`, que es lo que de verdad abre o cierra la route.
 * - Clases: lo dice el cliente según esté o no dentro de LockedContent, que
 *   aplica las reglas reales de cada página (labs libres, `gratis`, etc.).
 * - Laboratorios: su flag `gratis`, que es lo que decide su SeccionGate.
 */
export function accesoAlRegistrar(event: string, path: string | null, props: Record<string, unknown>): Acceso | null {
  if (event === 'contenido_bloqueado' || event === 'pago_abierto' || event === 'pagina_salida') return null;
  const examKey = props.examKey;
  if (typeof examKey === 'string' && EXAMENES[examKey]) {
    const meta = EXAMENES[examKey];
    return meta.free ? 'gratis' : meta.muestra ? 'muestra' : 'pago';
  }
  if (props.acceso === 'gratis' || props.acceso === 'pago') return props.acceso;
  const lab = path?.match(/^\/dashboard\/laboratorio\/([^/]+)/)?.[1];
  if (lab) return LABS_GRATIS.has(lab) ? 'gratis' : 'pago';
  return null;
}

function duracion(segundos: number): string {
  if (segundos < 60) return `${segundos} s`;
  const min = Math.round(segundos / 60);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} min`;
}

function detalleDe(e: EventoRow): string | null {
  const p = e.props ?? {};
  if (e.event === 'pagina_salida') {
    const seg = typeof p.segundos === 'number' ? p.segundos : 0;
    return `${duracion(seg)} a la vista · ${p.motivo === 'navego' ? 'pasó a otra página' : 'ocultó la pestaña o cerró'}`;
  }
  const examKey = typeof p.examKey === 'string' ? p.examKey : null;
  // Banqueo de tarjetas: dos modos sobre el mismo examKey. Los eventos de antes
  // de registrar el modo no lo traen y se quedan sin etiqueta.
  const modo = MODO_BANQUEO[String(p.modo)] ?? null;
  const conModo = (s: string) => (modo ? `${modo} · ${s}` : s);
  if (e.event === 'examen_completado' && typeof p.score === 'number' && typeof p.total === 'number') {
    const pct = p.total > 0 ? Math.round((p.score / p.total) * 100) : 0;
    // En memoria no hay acierto: es lo que el alumno dijo que ya se sabía.
    const cifra = `${p.modo === 'tarjetas' ? 'se sabía ' : ''}${p.score}/${p.total} (${pct} %)`;
    return conModo(`${cifra} · ${examKey ?? ''}`);
  }
  if (e.event === 'banco_iniciado') return examKey ? conModo(examKey) : modo;
  if (e.event === 'resumen_abierto' && p.origen === 'tarjeta') return 'Desde una tarjeta del banqueo';
  if (e.event === 'contenido_bloqueado') {
    if (p.origen === 'muestra') return `Terminó la parte gratis de ${examKey ?? 'el banqueo'}`;
    const plan = nombrePlan(p.plan);
    return plan ? `Pide el plan ${plan}` : null;
  }
  if (e.event === 'pago_abierto') {
    const plan = nombrePlan(p.plan);
    const desde = ORIGEN_PAGO[String(p.origen)] ?? 'el candado';
    return `${plan ? `Plan ${plan} · ` : ''}desde ${desde}${examKey ? ` (${examKey})` : ''}`;
  }
  return null;
}

/** Lee el acceso congelado; un evento anterior al registro no se adivina con las reglas de hoy. */
function accesoDe(e: EventoRow): string {
  if (e.event === 'contenido_bloqueado') return 'bloqueado';
  const p = e.props ?? {};
  if (p.acceso_v === undefined) return 'sin_registro';
  return typeof p.acceso === 'string' ? p.acceso : '';
}

function etiquetaDe(acceso: string): Etiqueta | null {
  return acceso === 'gratis' || acceso === 'muestra' || acceso === 'bloqueado' ? acceso : null;
}

export function legible(e: EventoRow): EventoLegible {
  const { lugar, cursoSlug } = lugarDeRuta(e.path);
  const acceso = accesoDe(e);
  return {
    fecha: e.created_at,
    evento: e.event,
    accion: ACCION[e.event] ?? e.event,
    lugar: e.props?.banqueo === true ? `${lugar} · banqueo` : lugar,
    detalle: detalleDe(e),
    etiqueta: etiquetaDe(acceso),
    acceso,
    cursoSlug,
    path: e.path,
    estancia: null,
  };
}

/**
 * Cierra cada `pagina_vista` con las salidas que le siguen en la misma página
 * (una por vez que ocultó la pestaña y volvió). Una salida que no casa con la
 * última página abierta (otra pestaña, o una vista fuera del límite) se ignora.
 * `eventos` va del más reciente al más antiguo, como `filas`.
 */
function asignarEstancias(filas: EventoRow[], eventos: EventoLegible[]): void {
  let abierta: EventoLegible | null = null;
  let clave = '';
  for (let i = filas.length - 1; i >= 0; i--) {
    const f = filas[i];
    const k = `${f.path}|${f.props?.banqueo === true}`;
    if (f.event === 'pagina_vista') {
      abierta = eventos[i];
      clave = k;
    } else if (f.event === 'pagina_salida' && abierta && k === clave) {
      const seg = typeof f.props?.segundos === 'number' ? f.props.segundos : 0;
      abierta.estancia = { hasta: f.created_at, segundos: (abierta.estancia?.segundos ?? 0) + seg };
    }
  }
}

const CORTE_SESION_MS = 30 * 60_000;

function sesionesDe(filas: EventoRow[]): Sesion[] {
  const out: Sesion[] = [];
  for (let i = filas.length - 1; i >= 0; i--) {
    const f = filas[i];
    const t = new Date(f.created_at).getTime();
    const s = out[out.length - 1];
    if (s && t - new Date(s.fin).getTime() < CORTE_SESION_MS) {
      s.fin = f.created_at;
      s.exacto = f.event === 'pagina_salida';
    } else {
      out.push({ inicio: f.created_at, fin: f.created_at, exacto: f.event === 'pagina_salida' });
    }
  }
  return out.reverse();
}

/**
 * Solo cuenta el registro real del candado. Deducirlo del plan guardado en
 * eventos viejos no sirve: cada curso tiene sus excepciones (labs libres,
 * clases `gratis` que cambian con el tiempo) y marcaría bloqueos falsos.
 */
function resumirBloqueos(eventos: EventoLegible[]): Bloqueo[] {
  const porLugar = new Map<string, Bloqueo>();
  const conPago = new Set(eventos.filter((e) => e.evento === 'pago_abierto').map((e) => e.lugar));
  for (const e of eventos) {
    if (e.evento !== 'contenido_bloqueado') continue;
    const b = porLugar.get(e.lugar);
    if (b) b.veces += 1;
    else porLugar.set(e.lugar, { lugar: e.lugar, veces: 1, ultimo: e.fecha, abrioPago: conPago.has(e.lugar) });
  }
  return [...porLugar.values()].sort((a, b) => b.veces - a.veces || b.ultimo.localeCompare(a.ultimo));
}

function diaLima(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

const PAGINA = 1000;

/** Eventos, del más reciente al más antiguo. `limite` evita traer años enteros a la ficha. */
export async function cargarEventos(userId: string | null, limite = Infinity): Promise<{ filas: EventoRow[]; truncado: boolean }> {
  const admin = createAdminClient();
  const filas: EventoRow[] = [];
  for (let from = 0; filas.length < limite; from += PAGINA) {
    let q = admin
      .from('analytics_events')
      .select('user_id, event, path, props, plan, created_at')
      .order('created_at', { ascending: false })
      .range(from, from + PAGINA - 1);
    q = userId ? q.eq('user_id', userId) : q.not('user_id', 'is', null);
    const { data, error } = await q;
    if (error) throw new Error(`analytics_events: ${error.message}`);
    filas.push(...((data ?? []) as EventoRow[]));
    if (!data || data.length < PAGINA) return { filas, truncado: false };
  }
  return { filas: filas.slice(0, limite), truncado: true };
}

export async function cargarActividadUsuario(userId: string): Promise<ActividadUsuario> {
  const admin = createAdminClient() as unknown as {
    from: (t: string) => {
      select: (c: string, o: { count: 'exact'; head: true }) => {
        eq: (k: string, v: string) => Promise<{ count: number | null }>;
      };
    };
  };
  const [{ filas, truncado }, { count }, cursosRes] = await Promise.all([
    cargarEventos(userId, 500),
    admin.from('analytics_events').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    cargarResumenCursos(),
  ]);

  const eventos = filas.map(legible);
  asignarEstancias(filas, eventos);
  const dias = new Set(filas.map((f) => diaLima(f.created_at)));
  return {
    totalEventos: count ?? filas.length,
    primerRegistro: filas.length ? filas[filas.length - 1].created_at : null,
    diasActivos: dias.size,
    cursos: cursosRes.get(userId) ?? [],
    eventos,
    bloqueos: resumirBloqueos(eventos),
    sesiones: sesionesDe(filas),
    truncado,
  };
}

interface ResumenRow {
  user_id: string;
  curso: string;
  dias: number;
  eventos: number;
  ultimo: string;
}

/** Cursos de cada alumno, el que más días visitó primero (el curso objetivo). */
export async function cargarResumenCursos(): Promise<Map<string, CursoDeUsuario[]>> {
  const admin = createAdminClient() as unknown as {
    rpc: (fn: string) => Promise<{ data: ResumenRow[] | null; error: { message: string } | null }>;
  };
  const { data, error } = await admin.rpc('resumen_cursos_usuarios');
  if (error) throw new Error(`resumen_cursos_usuarios: ${error.message}`);

  const out = new Map<string, CursoDeUsuario[]>();
  for (const r of data ?? []) {
    if (!NOMBRE_CURSO.has(r.curso)) continue;
    const lista = out.get(r.user_id) ?? [];
    lista.push({
      slug: r.curso,
      nombre: NOMBRE_CURSO.get(r.curso)!,
      dias: Number(r.dias),
      eventos: Number(r.eventos),
      ultimo: r.ultimo,
    });
    out.set(r.user_id, lista);
  }
  for (const lista of out.values()) {
    lista.sort((a, b) => b.dias - a.dias || b.eventos - a.eventos);
  }
  return out;
}
