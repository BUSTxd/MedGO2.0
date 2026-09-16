import { TEMAS_POR_CURSO, tablaDeCurso } from '@/lib/data/temas';
import type { ClaseRecomendada } from '@/lib/data/temas';

export interface Desglose {
  curso: string;
  temaId: string;
  label: string;
  ok: number;
  total: number;
  /** Entero 0–100. */
  pct: number;
  clases: ClaseRecomendada[];
}

/** Por debajo de este porcentaje un tema está flojo. */
export const UMBRAL_FLOJO = 60;
/** Preguntas mínimas para que el acumulado recomiende un tema. */
export const MINIMO_ACUMULADO = 3;

const STORAGE_KEY = 'medgo:temas:v1';
const VERSION = 1;
/** Techo de preguntas por tema: al pasarse, ok/total se reescalan. */
const TOPE_POR_TEMA = 20;
const CADUCIDAD_MS = 120 * 24 * 60 * 60 * 1000;

interface MarcaTema {
  ok: number;
  total: number;
  /** ms epoch del último intento que tocó el tema. */
  last: number;
}

interface RegistroTemas {
  v: number;
  /** cursos[slugCurso][temaId] */
  cursos: Record<string, Record<string, MarcaTema>>;
}

/** El curso de un examen es el primer segmento de su clave. */
export function cursoDe(examKey: string): string {
  return examKey.split('/')[0] ?? '';
}

function pctDe(ok: number, total: number): number {
  return total > 0 ? Math.round((ok / total) * 100) : 0;
}

/** Peor primero: más fallos, luego peor porcentaje, luego alfabético. */
function porFlojedad(a: Desglose, b: Desglose): number {
  const fa = a.total - a.ok;
  const fb = b.total - b.ok;
  if (fa !== fb) return fb - fa;
  if (a.pct !== b.pct) return a.pct - b.pct;
  return a.label.localeCompare(b.label, 'es');
}

export function desglosarIntento(
  curso: string,
  respuestas: { q: string; ok: boolean }[],
  preguntas: { id: string; tema?: string }[],
): Desglose[] {
  const tabla = tablaDeCurso(curso);
  if (!tabla) return [];

  const temaPorId = new Map(preguntas.map(q => [q.id, q.tema]));
  const acc = new Map<string, { ok: number; total: number }>();

  for (const r of respuestas) {
    const temaId = temaPorId.get(r.q);
    if (!temaId || !tabla[temaId]) continue;
    const prev = acc.get(temaId) ?? { ok: 0, total: 0 };
    acc.set(temaId, { ok: prev.ok + (r.ok ? 1 : 0), total: prev.total + 1 });
  }

  return [...acc.entries()]
    .map(([temaId, { ok, total }]) => ({
      curso,
      temaId,
      label: tabla[temaId].label,
      ok,
      total,
      pct: pctDe(ok, total),
      clases: tabla[temaId].clases,
    }))
    .sort(porFlojedad);
}

function defaultState(): RegistroTemas {
  return { v: VERSION, cursos: {} };
}

function reconcile(raw: unknown): RegistroTemas {
  if (!raw || typeof raw !== 'object') return defaultState();
  const r = raw as Partial<RegistroTemas>;
  if (r.v !== VERSION || !r.cursos || typeof r.cursos !== 'object') return defaultState();

  const ahora = Date.now();
  const cursos: RegistroTemas['cursos'] = {};

  for (const [curso, temas] of Object.entries(r.cursos)) {
    const tabla = TEMAS_POR_CURSO[curso];
    if (!tabla || !temas || typeof temas !== 'object') continue;
    const limpios: Record<string, MarcaTema> = {};
    for (const [temaId, m] of Object.entries(temas)) {
      if (!tabla[temaId] || !m || typeof m !== 'object') continue;
      const { ok, total, last } = m as MarcaTema;
      if (!Number.isFinite(ok) || !Number.isFinite(total)) continue;
      if (total <= 0 || ok < 0 || ok > total) continue;
      if (!Number.isFinite(last) || ahora - last > CADUCIDAD_MS) continue;
      limpios[temaId] = { ok, total, last };
    }
    if (Object.keys(limpios).length > 0) cursos[curso] = limpios;
  }

  return { v: VERSION, cursos };
}

function leer(): RegistroTemas {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? reconcile(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

// Reescalar al llegar al tope convierte el registro en una media móvil: sin
// esto, un tema ya dominado seguiría flojo para siempre porque los fallos
// viejos nunca se irían.
function sumar(prev: MarcaTema | undefined, ok: number, total: number): MarcaTema {
  let o = (prev?.ok ?? 0) + ok;
  let t = (prev?.total ?? 0) + total;
  if (t > TOPE_POR_TEMA) {
    o = Math.round((o * TOPE_POR_TEMA) / t);
    t = TOPE_POR_TEMA;
  }
  return { ok: o, total: t, last: Date.now() };
}

export function registrarIntento(curso: string, desglose: Desglose[]): void {
  if (typeof window === 'undefined' || desglose.length === 0) return;
  const estado = leer();
  const delCurso = { ...(estado.cursos[curso] ?? {}) };
  for (const d of desglose) {
    delCurso[d.temaId] = sumar(delCurso[d.temaId], d.ok, d.total);
  }
  estado.cursos[curso] = delCurso;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch {}
}

export function desgloseAcumulado(): Desglose[] {
  const estado = leer();
  const out: Desglose[] = [];

  for (const [curso, temas] of Object.entries(estado.cursos)) {
    const tabla = TEMAS_POR_CURSO[curso];
    if (!tabla) continue;
    for (const [temaId, m] of Object.entries(temas)) {
      const tema = tabla[temaId];
      if (!tema) continue;
      out.push({
        curso,
        temaId,
        label: tema.label,
        ok: m.ok,
        total: m.total,
        pct: pctDe(m.ok, m.total),
        clases: tema.clases,
      });
    }
  }

  return out.sort(porFlojedad);
}
