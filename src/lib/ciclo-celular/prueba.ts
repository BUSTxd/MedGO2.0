// Generadores de la prueba: los ítems «¿quién hace esto?» y «tipo de
// interacción» salen de las propias acciones y conectores de la vía, así que
// un checkpoint nuevo tiene prueba sin escribir preguntas a mano.

import type { Checkpoint, ConnectorType, Paso, QuizItem } from '@/lib/data/ciclo-celular/tipos';
import type { EscenarioCompilado, PasoCompilado } from './motor';

const limpio = (l: string) => l.replace(/<\/?(sup|sub)>/g, '');

/** Pasos que entran al mazo / al ordenar: sin contexto ni laterales. */
export function pasosDeMazo(cp: Checkpoint): Paso[] {
  return cp.pasos.filter((p) => p.orden !== 0 && !p.lateral && p.tarjeta);
}

/** Secuencias del checkpoint en orden de aparición (una sola si no declara). */
export function secuencias(cp: Checkpoint): { nombre: string | null; pasos: Paso[] }[] {
  const out: { nombre: string | null; pasos: Paso[] }[] = [];
  for (const p of pasosDeMazo(cp)) {
    const n = p.secuencia ?? null;
    let s = out.find((x) => x.nombre === n);
    if (!s) { s = { nombre: n, pasos: [] }; out.push(s); }
    s.pasos.push(p);
  }
  return out;
}

// ─── Ordenar ──────────────────────────────────────────────────────────────────

/** 6–8 pasos consecutivos de la secuencia más larga. */
export function itemsOrden(cp: Checkpoint, rnd = Math.random): Paso[] {
  const larga = secuencias(cp).sort((a, b) => b.pasos.length - a.pasos.length)[0]?.pasos ?? [];
  if (larga.length <= 8) return larga;
  const ini = Math.floor(rnd() * (larga.length - 8 + 1));
  return larga.slice(ini, ini + 8);
}

/** Longitud de la subsecuencia creciente más larga (puntuación parcial). */
export function lis(xs: number[]): number {
  const colas: number[] = [];
  for (const x of xs) {
    let lo = 0, hi = colas.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (colas[m] < x) lo = m + 1; else hi = m; }
    colas[lo] = x;
  }
  return colas.length;
}

// ─── ¿Quién hace esto? ────────────────────────────────────────────────────────

export type ItemIdentificar = {
  id: string;
  enunciado: string;
  /** Paso cuya escena final se muestra (sin etiquetas). */
  paso: number;
  /** Rótulo correcto: vale tocar cualquier actor con ese rótulo. */
  correcto: string;
  pasoId: string;
};

export function itemsIdentificar(cp: Checkpoint, c: EscenarioCompilado, rnd = Math.random): ItemIdentificar[] {
  const L = (k: string) => limpio(cp.actores[k]?.label ?? k);
  const cand: ItemIdentificar[] = [];
  const visto = new Set<string>();
  const add = (pc: PasoCompilado, sujeto: string, enunciado: string) => {
    const f = pc.final;
    if (!f.actores[sujeto]?.vis) return;
    const clave = `${L(sujeto)}|${enunciado}`;
    if (visto.has(clave)) return;
    visto.add(clave);
    cand.push({ id: `id-${cand.length}`, enunciado, paso: pc.indice, correcto: L(sujeto), pasoId: pc.paso.id });
  };
  for (const pc of c.pasos) {
    for (const { a } of pc.acciones) {
      switch (a.tipo) {
        case 'phosphorylate':
          if (a.kinase !== a.target) add(pc, a.kinase, `Toca la proteína que fosforila a ${L(a.target)}${a.label ? ` (${a.label})` : ''}.`);
          break;
        case 'inhibit':
          add(pc, a.inhibitor, `Toca la proteína que inhibe a ${L(a.target)}.`);
          break;
        case 'transcribe':
          add(pc, a.tf, `Toca el factor que activa la transcripción de ${L(a.product)}.`);
          break;
        case 'ubiquitinate':
          add(pc, a.ligase, `Toca la ubiquitina ligasa que marca a ${L(a.target)} para su degradación.`);
          break;
        case 'dephosphorylate':
          if (a.phosphatase) add(pc, a.phosphatase, `Toca la fosfatasa que retira fosfatos de ${L(a.target)}.`);
          break;
        case 'sequester':
          add(pc, a.actor, `Toca la proteína que secuestra a ${L(a.target)}.`);
          break;
      }
    }
  }
  // Variedad: se prefiere no repetir el mismo verbo.
  const barajados = [...cand].sort(() => rnd() - 0.5);
  const out: ItemIdentificar[] = [];
  const verbos = new Set<string>();
  for (const it of barajados) {
    const v = it.enunciado.split(' ').slice(0, 4).join(' ');
    if (verbos.has(v) && barajados.length > 6) continue;
    verbos.add(v);
    out.push(it);
    if (out.length === 4) break;
  }
  return out.length >= 3 ? out : barajados.slice(0, 4);
}

// ─── Tipo de interacción ──────────────────────────────────────────────────────

export const TIPOS_INTERACCION: { tipo: ConnectorType; nombre: string }[] = [
  { tipo: 'activa', nombre: 'Activa' },
  { tipo: 'inhibe', nombre: 'Inhibe' },
  { tipo: 'fosforila', nombre: 'Fosforila' },
  { tipo: 'desfosforila', nombre: 'Desfosforila' },
  { tipo: 'transcribe', nombre: 'Induce su transcripción' },
  { tipo: 'degrada', nombre: 'Lo marca para degradación' },
  { tipo: 'secuestra', nombre: 'Lo secuestra' },
];

export type ItemInteraccion = { id: string; from: string; to: string; correcto: ConnectorType; pasoId: string | null };

export function itemsInteraccion(cp: Checkpoint, c: EscenarioCompilado, rnd = Math.random): ItemInteraccion[] {
  const validos = new Set(TIPOS_INTERACCION.map((t) => t.tipo));
  const cands = c.conectoresVia.filter((cn) => validos.has(cn.type) && cp.actores[cn.from] && cp.actores[cn.to] && cn.from !== cn.to);
  // El paso donde nace cada conector, para «Ver en la vía».
  const pasoDe = (id: string) => c.pasos.find((pc) => pc.final.conectores.some((x) => x.id === id))?.paso.id ?? null;
  const porTipo = new Map<string, typeof cands>();
  for (const cn of cands) porTipo.set(cn.type, [...(porTipo.get(cn.type) ?? []), cn]);
  const tipos = [...porTipo.keys()].sort(() => rnd() - 0.5);
  const out: ItemInteraccion[] = [];
  // Uno por tipo distinto mientras se pueda.
  for (const t of tipos) {
    const l = porTipo.get(t)!;
    const cn = l[Math.floor(rnd() * l.length)];
    out.push({ id: `in-${out.length}`, from: cn.from, to: cn.to, correcto: cn.type, pasoId: pasoDe(cn.id) });
    if (out.length === 3) break;
  }
  return out;
}

// ─── Prueba integrada ─────────────────────────────────────────────────────────

export type ItemIntegrado = QuizItem & { origen: string };

export function itemsIntegrada(cps: Checkpoint[], puente: QuizItem[], rnd = Math.random, total = 20): ItemIntegrado[] {
  const out: ItemIntegrado[] = puente.map((q) => ({ ...q, origen: 'puente' }));
  const restantes = total - out.length;
  // Reparto equitativo entre checkpoints; el resto al azar.
  const porCp = cps.map((cp) => [...cp.preguntas].sort(() => rnd() - 0.5).map((q) => ({ ...q, origen: cp.id })));
  let i = 0;
  while (out.length < total && porCp.some((l) => l.length)) {
    const l = porCp[i % porCp.length];
    const q = l.shift();
    if (q) out.push(q);
    i++;
    if (i > restantes * 10) break;
  }
  return out.sort(() => rnd() - 0.5);
}
