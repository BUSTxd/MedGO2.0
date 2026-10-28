import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { esDeCayetano } from '@/lib/admin';
import { CURSOS_CON_PLAN, idsDeSecciones, indiceDeCurso, indiceParaCliente } from '@/lib/estudio/indice';
import { archivarPlan, guardarPlan, intentosDe, marcarTarea, planActivo, tareasHechas } from '@/lib/estudio/avance';
import { evaluaciones, type Alcance, type Partida, type Respuestas } from '@/lib/estudio/planificador';
import type { IndiceCurso } from '@/lib/estudio/indice-tipos';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * El planificador de estudio de un curso (`/estudio` → Mi progreso).
 *  GET    ?curso=        índice (ligero), plan activo, banqueos terminados y tareas marcadas
 *  POST   { curso, … }   guarda un plan nuevo (archiva el anterior del curso)
 *  PATCH  { curso, tarea, hecha }  marca o desmarca una tarea a mano
 *  DELETE ?curso=        archiva el plan activo
 * El calendario no viaja: lo calcula el navegador con `planificar` (función pura).
 * Por ahora sólo la ruta UPCH, y sólo para cuentas de Cayetano (como el sílabo).
 */
const RUTA = 'upch';

async function sesion() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && esDeCayetano(user) ? user : null;
}

const hoyEnLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const esTexto = (x: unknown, max: number): x is string => typeof x === 'string' && x.length > 0 && x.length <= max;
const listaDe = (x: unknown, max: number, valido: (s: string) => boolean): string[] | null =>
  Array.isArray(x) && x.length > 0 && x.length <= max && x.every((s) => typeof s === 'string' && valido(s)) ? [...new Set(x as string[])] : null;

function validarAlcance(raw: unknown, indice: IndiceCurso): Alcance | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as Record<string, unknown>;
  const clases = new Set(indice.clases.map((c) => c.id));
  switch (a.tipo) {
    case 'curso': return { tipo: 'curso' };
    case 'evaluacion':
      return typeof a.semana === 'string' && evaluaciones(indice).some((e) => e.semana === a.semana) ? { tipo: 'evaluacion', semana: a.semana } : null;
    case 'clases': {
      const l = listaDe(a.clases, 200, (s) => clases.has(s));
      return l ? { tipo: 'clases', clases: l } : null;
    }
    case 'temas': {
      const l = listaDe(a.temas, 100, (s) => s in indice.temas);
      return l ? { tipo: 'temas', temas: l } : null;
    }
    case 'bloques': {
      const ids = idsDeSecciones(indice);
      if (!Array.isArray(a.bloques) || !a.bloques.length || a.bloques.length > 12) return null;
      const bloques: { nombre: string; secciones: string[] }[] = [];
      for (const b of a.bloques as Record<string, unknown>[]) {
        const secciones = listaDe(b?.secciones, 150, (s) => ids.has(s));
        if (!esTexto(b?.nombre, 40) || !secciones) return null;
        bloques.push({ nombre: b.nombre.trim(), secciones });
      }
      return { tipo: 'bloques', bloques };
    }
    default: return null;
  }
}

const PARTIDAS = new Set<Partida>(['nueva', 'vista', 'domino']);

function validarRespuestas(raw: unknown): Respuestas | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const dias = Array.isArray(r.dias) ? [...new Set(r.dias)] : [];
  if (!dias.length || !dias.every((d) => Number.isInteger(d) && (d as number) >= 0 && (d as number) <= 6)) return null;
  if (!Number.isInteger(r.minutos) || (r.minutos as number) < 15 || (r.minutos as number) > 600) return null;
  if (r.objetivo !== 'aprobar' && r.objetivo !== 'destacar') return null;
  const partida: Record<string, Partida> = {};
  if (r.partida && typeof r.partida === 'object') {
    const entradas = Object.entries(r.partida as Record<string, unknown>);
    if (entradas.length > 200) return null;
    for (const [k, v] of entradas) {
      if (k.length > 80 || !PARTIDAS.has(v as Partida)) return null;
      if (v !== 'nueva') partida[k] = v as Partida;
    }
  }
  return { dias: (dias as number[]).sort(), minutos: r.minutos as number, objetivo: r.objetivo, partida };
}

async function cursoValido(curso: unknown) {
  if (typeof curso !== 'string' || !CURSOS_CON_PLAN.has(curso)) return null;
  return indiceDeCurso(curso);
}

export async function GET(req: NextRequest) {
  const user = await sesion();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const curso = req.nextUrl.searchParams.get('curso');
  if (!curso || !CURSOS_CON_PLAN.has(curso)) return NextResponse.json({ disponible: false });
  const [indice, plan, intentos] = await Promise.all([indiceDeCurso(curso), planActivo(user.id, RUTA, curso), intentosDe(user.id, curso)]);
  if (!indice) return NextResponse.json({ disponible: false });
  const hechas = plan ? await tareasHechas(plan.id) : [];
  return NextResponse.json({ disponible: true, hoy: hoyEnLima(), indice: indiceParaCliente(indice), plan, intentos, hechas });
}

export async function POST(req: NextRequest) {
  const user = await sesion();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  const indice = await cursoValido(body?.curso);
  if (!body || !indice) return NextResponse.json({ error: 'curso' }, { status: 400 });

  const hoy = hoyEnLima();
  const fecha = body.fechaExamen;
  const enUnAnio = new Date(Date.parse(`${hoy}T00:00:00Z`) + 366 * 86_400_000).toISOString().slice(0, 10);
  if (typeof fecha !== 'string' || !FECHA.test(fecha) || Number.isNaN(Date.parse(fecha)) || fecha <= hoy || fecha > enUnAnio) {
    return NextResponse.json({ error: 'fecha' }, { status: 400 });
  }
  const alcance = validarAlcance(body.alcance, indice);
  if (!alcance) return NextResponse.json({ error: 'alcance' }, { status: 400 });
  const respuestas = validarRespuestas(body.respuestas);
  if (!respuestas) return NextResponse.json({ error: 'respuestas' }, { status: 400 });
  const nombre = esTexto(body.nombre, 80) ? body.nombre.trim() : 'Mi plan';

  const plan = await guardarPlan(user.id, RUTA, body.curso as string, { nombre, fechaExamen: fecha, alcance, respuestas });
  return NextResponse.json({ plan });
}

export async function PATCH(req: NextRequest) {
  const user = await sesion();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.curso !== 'string' || !CURSOS_CON_PLAN.has(body.curso) || !esTexto(body.tarea, 200) || typeof body.hecha !== 'boolean') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  const plan = await planActivo(user.id, RUTA, body.curso);
  if (!plan) return NextResponse.json({ error: 'sin plan' }, { status: 404 });
  await marcarTarea(plan.id, body.tarea, body.hecha);
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(req: NextRequest) {
  const user = await sesion();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const curso = req.nextUrl.searchParams.get('curso');
  if (!curso || !CURSOS_CON_PLAN.has(curso)) return NextResponse.json({ error: 'curso' }, { status: 400 });
  await archivarPlan(user.id, RUTA, curso);
  return new NextResponse(null, { status: 204 });
}
