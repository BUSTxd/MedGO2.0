'use client';

import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { fetchExam, type ExamOption, type ExamQuestion } from '@/lib/examen/payload';
import { claveSesionEncib, combinarPreguntasEncib, vistaPreguntasEncib } from '@/lib/examen/encib-sesion';
import { FiguraAmpliable, VisorImagen, figurasDe, type Ampliada } from '@/components/examen/FiguraAmpliable';
import LockedContent, { useCandadoCerrado } from '@/components/LockedContent';
import Desplegable from '@/components/estudio/Desplegable';
import type { PlanKey, ProfilePlan } from '@/lib/plans';
import { REQ_ENCIB } from '@/lib/acceso';
import type { SesionExamen } from '@/lib/estudio/examenes';
import s from '@/styles/quizEncib.module.css';

export interface AreaEncibLite { codigo: string; nombre: string; color: string }
export interface DifEncib { menor: number; mediana: number; mayor: number; total: number }

interface Props {
  anios: number[];
  areas: AreaEncibLite[];
  dif: Record<number, DifEncib>;
  planState: { plan: ProfilePlan; isActive: boolean; allAccess?: boolean };
  isAuthed: boolean;
  requiredPlan: PlanKey;
}

/** El JSON del ENCIB añade `n` y `codigo` (tema `ÁREA-sub.tema`) a la pregunta común. */
type Q = ExamQuestion & { n?: number; codigo?: string; anio?: number };

const LETRAS = 'ABCDE';
const MUELLE = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 } as const;
const llave = (anio: number | string) => `medgo:encib:${anio}`;

/* ── Barajado estable ─────────────────────────────────────────────────────── */

/** Semilla estable a partir de texto (FNV-1a). */
function semilla(t: string): number {
  let h = 2166136261;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Alternativas barajadas con semilla año+pregunta: el mismo orden en cada visita. */
function barajar(q: Q, anio: number): ExamOption[] {
  if (q.ordenFijo) return q.options;
  const rnd = mulberry32(semilla(`${anio}:${q.id}`));
  const a = [...q.options];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Persistencia ─────────────────────────────────────────────────────────── */

interface Guardado { r: Record<string, string>; id: string | null; agrupada?: boolean; area?: string | null }

function leer(anio: number | string): Guardado {
  try {
    const raw = localStorage.getItem(llave(anio));
    if (raw) {
      const g = JSON.parse(raw) as Guardado;
      if (g && typeof g.r === 'object' && g.r && !Array.isArray(g.r)) return {
        r: g.r, id: typeof g.id === 'string' ? g.id : null,
        agrupada: typeof g.agrupada === 'boolean' ? g.agrupada : undefined,
        area: typeof g.area === 'string' ? g.area : null,
      };
    }
  } catch {}
  return { r: {}, id: null };
}

function guardar(anio: number | string, g: Guardado) {
  try { localStorage.setItem(llave(anio), JSON.stringify(g)); } catch {}
}

/* ── Utilidades de presentación ───────────────────────────────────────────── */

/** `**negrita**` lo resuelve el markdown; los saltos sueltos pasan a saltos duros. */
const conSaltos = (t: string) => t.replace(/([^\n])\n(?!\n)/g, '$1  \n');

function useConteo(meta: number, reducido: boolean) {
  const [v, setV] = useState(reducido ? meta : 0);
  useEffect(() => {
    if (reducido) { setV(meta); return; }
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      setV(Math.round(meta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [meta, reducido]);
  return v;
}

function IconoOk() {
  return (
    <svg className={s.marca} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconoMal() {
  return (
    <svg className={s.marca} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Componente principal: cabecera, selector de examen y puerta de pago ──── */

export default function QuizEncib({ anios, areas, dif, planState, isAuthed, requiredPlan }: Props) {
  const [anio, setAnio] = useState<number>(anios.includes(2025) ? 2025 : anios[0]);
  const d = dif[anio] ?? { menor: 0, mediana: 0, mayor: 0, total: 0 };
  const pct = (v: number) => (d.total ? Math.round((100 * v) / d.total) : 0);

  return (
    <div className={s.raiz}>
      <header className={s.cabecera}>
        <div className={s.cabTexto}>
          <span className={s.kicker}>Banco de preguntas</span>
          <h1 className={s.titulo}>ENCIB 2026</h1>
          <p className={s.sub}>Resuelve las preguntas reales de los exámenes anteriores, una por una.</p>
        </div>
        <Link href="/dashboard/cursos/examen/encib/estadisticas" className={s.stats} aria-label={`Ver estadísticas del ENCIB. ${anio}: ${pct(d.menor)} % de dificultad menor`}>
          <svg className={s.statsIcono} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20V10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 20V4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M16 20v-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M22 20H2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className={s.statsRotulo}>Estadísticas</span>
          <span className={s.statsBarra} aria-hidden>
            <i className={s.d1} style={{ flexGrow: d.menor }} />
            <i className={s.d2} style={{ flexGrow: d.mediana }} />
            <i className={s.d3} style={{ flexGrow: d.mayor }} />
          </span>
          <span className={s.statsCifra}><strong>{pct(d.menor)} %</strong> fáciles · {anio}</span>
        </Link>
      </header>

      <div className={s.anios} role="group" aria-label="Examen">
        {anios.map((y) => (
          <button key={y} type="button" className={`${s.anio} ${y === anio ? s.anioOn : ''}`} aria-pressed={y === anio} onClick={() => setAnio(y)}>
            <span className={s.anioNum}>{y}</span>
            <span className={s.anioSub}>{y === 2021 ? 'Piloto' : `${dif[y]?.total ?? 0} preguntas`}</span>
          </button>
        ))}
      </div>

      <LockedContent
        requiredPlan={requiredPlan}
        requisito={REQ_ENCIB}
        planState={planState}
        isAuthed={isAuthed}
        titulo="Banco de preguntas del ENCIB"
        descripcion={<>Resuelve las preguntas reales de 2025, 2024 y 2021 con su explicación, y revisa tus fallos por área.</>}
      >
        <Juego anio={anio} areas={areas} />
      </LockedContent>
    </div>
  );
}

/** Con el candado cerrado solo se pinta una carta de ejemplo: nada se pide a la API. */
function Juego({ anio, areas }: { anio: number; areas: AreaEncibLite[] }) {
  const cerrado = useCandadoCerrado();
  if (cerrado) return <Muestra />;
  return <JuegoReal key={anio} anio={anio} areas={areas} />;
}

/** El configurador de /estudio reutiliza el mismo motor y el mismo control de acceso. */
export function PracticaEncib({ sesion, areas, planState, isAuthed, requiredPlan }: Omit<Props, 'anios' | 'dif'> & { sesion: SesionExamen }) {
  return (
    <div className={`${s.raiz} ${s.practica}`}>
    <LockedContent requiredPlan={requiredPlan} requisito={REQ_ENCIB} planState={planState} isAuthed={isAuthed} preview={false}
      titulo="Banco de exámenes del ENCIB"
      descripcion="Accede a las preguntas de 2025, 2024 y 2021 con sus explicaciones. Tu selección se conserva al desbloquear el banco.">
      <JuegoReal anio={sesion.anios[0]} areas={areas} sesion={sesion} />
    </LockedContent>
    </div>
  );
}

function Muestra() {
  return (
    <div className={`${s.mazo} ${s.muestra}`} style={{ ['--ac' as string]: '#5445d8' }}>
      <div className={`${s.fantasma} ${s.fantasma1}`} style={{ transform: 'translateY(10px) scale(0.97)' }} />
      <div className={`${s.fantasma} ${s.fantasma2}`} style={{ transform: 'translateY(20px) scale(0.94)' }} />
      <article className={s.carta}>
        <div className={s.top}>
          <span className={s.numero}>Pregunta <strong>1</strong></span>
          <span className={s.areaPill}><i aria-hidden />Área</span>
        </div>
        <p className={s.enunciado}>Aquí aparecerá el enunciado de la pregunta, con su caso clínico o su figura.</p>
        <div className={s.ops}>
          {['Primera alternativa', 'Segunda alternativa', 'Tercera alternativa', 'Cuarta alternativa'].map((t, i) => (
            <div key={t} className={`${s.op} ${s.opcion}`}>
              <span className={s.letra}>{LETRAS[i]}</span>
              <span className={s.opTexto}>{t}</span>
              <span />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

/* ── El juego ─────────────────────────────────────────────────────────────── */

function JuegoReal({ anio, areas, sesion }: { anio: number; areas: AreaEncibLite[]; sesion?: SesionExamen }) {
  const idCurso = useId();
  const claveGuardado = sesion ? claveSesionEncib(sesion) : anio;
  const titulo = sesion ? 'Práctica ENCIB' : `ENCIB ${anio}`;
  const reducido = !!useReducedMotion();
  const [estado, setEstado] = useState<'cargando' | 'error' | 'ok'>('cargando');
  const [mensaje, setMensaje] = useState('');
  const [intento, setIntento] = useState(0);
  const [preguntas, setPreguntas] = useState<Q[]>([]);
  const [resp, setResp] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [area, setArea] = useState<string | null>(null);
  const [agrupada, setAgrupada] = useState(!sesion);
  const [revision, setRevision] = useState<string[] | null>(null);
  const [fin, setFin] = useState(false);
  const [ampliada, setAmpliada] = useState<Ampliada | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  const mazoRef = useRef<HTMLDivElement>(null);
  const primera = useRef(true);

  /* Carga (misma ruta y caché de URL firmada que el ExamRunner). */
  useEffect(() => {
    let vivo = true;
    setEstado('cargando');
    Promise.all((sesion?.anios ?? [anio]).map(async (y) => {
      const { payload } = await fetchExam(`encib/${y}`);
      return { anio: y, preguntas: payload.questions as Q[] };
    }))
      .then((grupos) => {
        if (!vivo) return;
        const qs = sesion ? combinarPreguntasEncib(grupos, sesion.codigos) : grupos.flatMap((g) => g.preguntas);
        const g = leer(claveGuardado);
        const validas = new Map(qs.map((q) => [q.id, new Set(q.options.map((o) => o.id))]));
        const r: Record<string, string> = {};
        for (const [k, v] of Object.entries(g.r)) if (validas.get(k)?.has(v)) r[k] = v;
        const agrupada = g.agrupada ?? !sesion;
        const area = agrupada && qs.some((q) => q.codigo?.split('-')[0] === g.area) ? g.area ?? null : null;
        const vista = vistaPreguntasEncib(qs, agrupada, area, areas);
        const pos = g.id ? vista.findIndex((q) => q.id === g.id) : -1;
        setPreguntas(qs);
        setResp(r);
        setAgrupada(agrupada);
        setArea(area);
        setIdx(pos >= 0 ? pos : Math.max(0, vista.findIndex((q) => !r[q.id])));
        setEstado('ok');
      })
      .catch((e: unknown) => {
        if (!vivo) return;
        setMensaje(e instanceof Error ? e.message : 'No pudimos cargar las preguntas. Vuelve a intentarlo.');
        setEstado('error');
      });
    return () => { vivo = false; };
  }, [anio, sesion, claveGuardado, intento, areas]);

  /* Alternativas barajadas una vez por pregunta. */
  const opciones = useMemo(() => {
    const m = new Map<string, ExamOption[]>();
    for (const q of preguntas) m.set(q.id, barajar(q, q.anio ?? anio));
    return m;
  }, [preguntas, anio]);

  const areaDe = useCallback((q: Q) => (q.codigo ? q.codigo.slice(0, 3) : ''), []);
  const metaArea = useMemo(() => new Map(areas.map((a) => [a.codigo, a])), [areas]);

  const esCorrecta = useCallback((q: Q) => {
    const o = q.options.find((x) => x.id === resp[q.id]);
    return !!o?.correct;
  }, [resp]);

  const mazo = useMemo(() => {
    if (revision) return preguntas.filter((q) => revision.includes(q.id));
    return vistaPreguntasEncib(preguntas, agrupada, area, areas);
  }, [preguntas, revision, agrupada, area, areas]);

  const i = Math.max(0, Math.min(idx, mazo.length - 1));
  const actual = mazo[i];
  const elegida = actual ? resp[actual.id] : undefined;
  const respondida = elegida !== undefined;

  /* Guardado. */
  useEffect(() => {
    if (estado !== 'ok') return;
    guardar(claveGuardado, { r: resp, id: actual?.id ?? null, agrupada, area });
  }, [estado, claveGuardado, resp, actual?.id, agrupada, area]);

  const total = preguntas.length;
  const hechas = preguntas.filter((q) => resp[q.id] !== undefined).length;
  const aciertos = preguntas.filter((q) => resp[q.id] !== undefined && esCorrecta(q)).length;
  const falladas = preguntas.filter((q) => resp[q.id] !== undefined && !esCorrecta(q));
  const hechasVista = area ? mazo.filter((q) => resp[q.id] !== undefined).length : hechas;
  const aciertosVista = area ? mazo.filter((q) => resp[q.id] !== undefined && esCorrecta(q)).length : aciertos;

  const ir = useCallback((j: number) => {
    if (j < 0 || j >= mazo.length) return;
    setDir(j >= i ? 1 : -1);
    setIdx(j);
    setConfirmar(false);
  }, [mazo.length, i]);

  const responder = useCallback((optId: string) => {
    if (!actual || resp[actual.id] !== undefined) return;
    setResp((r) => ({ ...r, [actual.id]: optId }));
  }, [actual, resp]);

  const siguiente = useCallback(() => {
    if (i < mazo.length - 1) ir(i + 1);
    else setFin(true);
  }, [i, mazo.length, ir]);

  const filtrarArea = (a: string | null) => {
    setRevision(null);
    setArea(a);
    setDir(1);
    setFin(false);
    const lista = vistaPreguntasEncib(preguntas, agrupada, a, areas);
    const primeraPend = lista.findIndex((q) => resp[q.id] === undefined);
    setIdx(Math.max(0, primeraPend));
  };

  const cambiarAgrupacion = (valor: boolean) => {
    const lista = vistaPreguntasEncib(preguntas, valor, null, areas);
    const pos = lista.findIndex((q) => q.id === actual?.id);
    setAgrupada(valor);
    setArea(null);
    setRevision(null);
    setIdx(Math.max(0, pos));
    setConfirmar(false);
  };

  const empezarRevision = () => {
    setRevision(falladas.map((q) => q.id));
    setArea(null);
    setFin(false);
    setDir(1);
    setIdx(0);
  };

  const reiniciar = () => {
    guardar(claveGuardado, { r: {}, id: null });
    setResp({});
    setRevision(null);
    setArea(null);
    setFin(false);
    setIdx(0);
    setDir(1);
    setConfirmar(false);
  };

  /* Teclado: A–E / 1–5 responden, Enter avanza, flechas navegan. */
  const h = useRef({ responder, siguiente, ir, i, actual, respondida, ampliada, fin, opciones });
  h.current = { responder, siguiente, ir, i, actual, respondida, ampliada, fin, opciones };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = h.current;
      if (c.ampliada || c.fin || !c.actual) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || t.closest('[role="listbox"], [aria-haspopup="listbox"]'))) return;
      const k = e.key;
      const lista = c.opciones.get(c.actual.id) ?? [];
      const n = /^[1-5]$/.test(k) ? Number(k) - 1 : /^[a-eA-E]$/.test(k) ? k.toLowerCase().charCodeAt(0) - 97 : -1;
      if (n >= 0 && n < lista.length) { e.preventDefault(); c.responder(lista[n].id); return; }
      if (k === 'Enter' && c.respondida) {
        if (t?.closest('a, button, summary, [role="combobox"]')) return;
        e.preventDefault(); c.siguiente();
      } else if (k === 'ArrowRight') { c.ir(c.i + 1); }
      else if (k === 'ArrowLeft') { c.ir(c.i - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Al cambiar de pregunta se mueve la ventana (nunca scrollIntoView). */
  useEffect(() => {
    if (primera.current) { primera.current = false; return; }
    const el = mazoRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: Math.max(0, top + window.scrollY - 16), behavior: reducido ? 'auto' : 'smooth' });
  }, [actual?.id, fin, reducido]);

  /* Clic en el rastro: salta a la pregunta bajo el puntero. */
  const saltarRastro = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(0.9999, Math.max(0, (e.clientX - r.left) / r.width));
    ir(Math.floor(f * mazo.length));
  };

  const areasConteo = useMemo(() => {
    const m = new Map<string, number>();
    for (const q of preguntas) { const a = areaDe(q); if (a) m.set(a, (m.get(a) ?? 0) + 1); }
    return m;
  }, [preguntas, areaDe]);

  /* ── Estados de carga ── */
  if (estado === 'cargando') {
    return (
      <div className={s.mazo} aria-busy="true" aria-live="polite">
        <article className={`${s.carta} ${s.cargando}`}>
          <div className={s.hueso} style={{ height: 28, width: '40%' }} />
          <div className={s.hueso} style={{ height: 22 }} />
          <div className={s.hueso} style={{ height: 22, width: '80%' }} />
          {[0, 1, 2, 3].map((k) => <div key={k} className={s.hueso} style={{ height: 56 }} />)}
          <span className="sr-only" style={{ position: 'absolute', left: -9999 }}>Cargando preguntas…</span>
        </article>
      </div>
    );
  }
  if (estado === 'error') {
    return (
      <div className={s.mazo}>
        <article className={`${s.carta} ${s.error}`}>
          <p>{mensaje}</p>
          <button type="button" className={s.btn} onClick={() => setIntento((n) => n + 1)}>Reintentar</button>
        </article>
      </div>
    );
  }

  /* ── Resultado ── */
  if (fin) {
    return (
      <Resultado
        anio={anio}
        titulo={titulo}
        total={total}
        hechas={hechas}
        aciertos={aciertos}
        falladas={falladas.length}
        areas={areas}
        areasConteo={areasConteo}
        porArea={(cod) => preguntas.filter((q) => areaDe(q) === cod && resp[q.id] !== undefined && esCorrecta(q)).length}
        reducido={reducido}
        onRevisar={empezarRevision}
        onVolver={() => setFin(false)}
        onReiniciar={sesion ? () => { setFin(false); setConfirmar(true); } : reiniciar}
      />
    );
  }

  const color = sesion ? 'var(--acento)' : actual ? metaArea.get(areaDe(actual))?.color ?? '#5445d8' : '#5445d8';
  const variantes = reducido
    ? { ini: { opacity: 1 }, entra: { opacity: 1 }, sale: { opacity: 0, transition: { duration: 0 } } }
    : sesion ? {
        ini: (d: number) => ({ opacity: 0, x: d * 18 }),
        entra: { opacity: 1, x: 0 },
        sale: (d: number) => ({ opacity: 0, x: d * -12, transition: { duration: 0.12 } }),
      } : {
        ini: (d: number) => ({ opacity: 0, y: 56, scale: 0.9, rotate: d * 4 }),
        entra: { opacity: 1, y: 0, scale: 1, rotate: 0 },
        sale: (d: number) => ({ opacity: 0, x: d * -420, rotate: d * -10, scale: 0.94, transition: { duration: 0.3, ease: [0.4, 0, 0.8, 0.4] as const } }),
      };

  const figuras = actual ? figurasDe(actual) : [];
  const lista = actual ? opciones.get(actual.id) ?? [] : [];

  return (
    <>
      {sesion ? (
        <div className={s.vista}>
          <div className={s.vistaTexto}><strong>Organiza tu práctica</strong><span>Cambia la vista sin perder tus respuestas.</span></div>
          <label className={s.separar}><input type="checkbox" checked={agrupada} onChange={(e) => cambiarAgrupacion(e.target.checked)} />Separar por cursos</label>
          {agrupada && <div className={s.cursoSelector}>
            <label htmlFor={idCurso}>Curso</label>
            <Desplegable id={idCurso} etiqueta="Curso" variante="campo" icono="book" valor={area ?? ''}
              onCambiar={(valor) => filtrarArea(valor || null)}
              opciones={[
                { value: '', label: 'Todos, agrupados', simbolo: 'layers', etiqueta: `${total} preg.` },
                ...areas.filter((a) => areasConteo.has(a.codigo)).map((a) => ({
                  value: a.codigo, label: a.nombre, simbolo: 'book' as const, etiqueta: `${areasConteo.get(a.codigo)} preg.`,
                })),
              ]} />
          </div>}
          {revision && <button type="button" className={s.btnTexto} onClick={() => filtrarArea(null)}>Salir del repaso de errores</button>}
        </div>
      ) : <div className={s.chips} role="group" aria-label="Filtrar por área">
        <button type="button" className={`${s.chip} ${!area && !revision ? s.chipOn : ''}`} aria-pressed={!area && !revision} onClick={() => filtrarArea(null)}>
          Todas <em>{total}</em>
        </button>
        {areas.filter((a) => areasConteo.has(a.codigo)).map((a) => (
          <button key={a.codigo} type="button" className={`${s.chip} ${area === a.codigo ? s.chipOn : ''}`} aria-pressed={area === a.codigo}
            onClick={() => filtrarArea(area === a.codigo ? null : a.codigo)} style={{ ['--ac' as string]: a.color }}>
            <i aria-hidden />{a.nombre} <em>{areasConteo.get(a.codigo)}</em>
          </button>
        ))}
      </div>}

      <div className={s.herramientas}>
        <p className={s.aviso}>
          {revision
            ? <><strong>{revision.length}</strong> {revision.length === 1 ? 'pregunta para repasar.' : 'preguntas para repasar.'}</>
            : <><strong>{aciertosVista}</strong> aciertos de <strong>{hechasVista}</strong> respondidas{area ? ' en este curso' : ''}</>}
        </p>
        <span style={{ display: 'inline-flex', gap: 8 }}>
          {hechas > 0 && (
            <button type="button" className={s.btnTexto} onClick={() => setFin(true)}>Ver resultado</button>
          )}
          {confirmar ? (
            <>
              <button type="button" className={`${s.btnTexto} ${s.btnPeligro}`} onClick={reiniciar}>Sí, reiniciar {sesion ? 'práctica' : anio}</button>
              <button type="button" className={s.btnTexto} onClick={() => setConfirmar(false)}>Cancelar</button>
            </>
          ) : (
            <button type="button" className={s.btnTexto} onClick={() => setConfirmar(true)} disabled={hechas === 0}>Reiniciar {sesion ? 'práctica' : 'año'}</button>
          )}
        </span>
      </div>

      {!actual ? (
        <div className={s.mazo}>
          <article className={`${s.carta} ${s.error}`}>
            <p>No hay preguntas en este filtro.</p>
            <button type="button" className={s.btn} onClick={() => filtrarArea(null)}>Ver todas</button>
          </article>
        </div>
      ) : (
        <>
          <div className={s.mazo} ref={mazoRef} style={{ ['--ac' as string]: color }}>
            <motion.div className={`${s.fantasma} ${s.fantasma1}`} aria-hidden
              initial={reducido ? false : { y: 0, scale: 1, opacity: 0 }} animate={{ y: 10, scale: 0.97, opacity: 1 }} transition={MUELLE} />
            <motion.div className={`${s.fantasma} ${s.fantasma2}`} aria-hidden
              initial={reducido ? false : { y: 0, scale: 1, opacity: 0 }} animate={{ y: 20, scale: 0.94, opacity: 1 }} transition={{ ...MUELLE, delay: 0.06 }} />

            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.article
                key={actual.id}
                className={s.carta}
                custom={dir}
                variants={variantes}
                initial="ini"
                animate="entra"
                exit="sale"
                transition={reducido ? { duration: 0 } : sesion ? { duration: 0.2, ease: 'easeOut' } : MUELLE}
              >
                <div className={s.top}>
                  <span className={s.numero}>Pregunta <strong>{actual.n ?? preguntas.indexOf(actual) + 1}</strong> · {actual.anio ?? anio}</span>
                  {metaArea.get(areaDe(actual)) && (
                    <span className={s.areaPill}><i aria-hidden />{metaArea.get(areaDe(actual))!.nombre}</span>
                  )}
                </div>

                <h2 className={s.enunciado}>{actual.stem}</h2>

                {figuras.length > 0 && (
                  <div className={s.figuras}>
                    {figuras.map((f) => (
                      <FiguraAmpliable key={f.src} {...f} onAmpliar={setAmpliada} sizes="(max-width: 600px) 100vw, 360px" />
                    ))}
                  </div>
                )}

                <div className={s.ops} role="group" aria-label="Alternativas">
                  {lista.map((o, n) => {
                    const mia = elegida === o.id;
                    const clases = [s.op];
                    if (respondida) {
                      if (o.correct) { clases.push(s.opAcierto); if (mia) clases.push(s.late); }
                      else if (mia) { clases.push(s.opFallo, s.sacude); }
                      else clases.push(s.opApagada);
                    }
                    return (
                      <button key={o.id} type="button" className={clases.join(' ')} disabled={respondida} onClick={() => responder(o.id)}
                        aria-label={`Alternativa ${LETRAS[n]}: ${o.text}${respondida && o.correct ? '. Correcta' : mia ? '. Tu respuesta, incorrecta' : ''}`}>
                        <span className={s.letra} aria-hidden>{LETRAS[n]}</span>
                        <span className={s.opTexto}>
                          {o.text && <span>{o.text}</span>}
                          {o.image && (
                            <Image src={o.image.src} alt={o.image.alt ?? `Alternativa ${LETRAS[n]}`} width={o.image.w} height={o.image.h} sizes="(max-width: 600px) 80vw, 260px" className={s.opImg} />
                          )}
                        </span>
                        {respondida && o.correct ? <IconoOk /> : respondida && mia ? <IconoMal /> : <span />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence initial={false}>
                  {respondida && (
                    <motion.div
                      key="explicacion"
                      className={s.explicWrap}
                      initial={reducido ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={reducido ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
                    >
                      {actual.explanationDetail ? (
                        <ExplicacionEncib pregunta={actual} opciones={lista} elegida={elegida} />
                      ) : actual.explanation && (
                        <div className={s.explic} aria-live="polite">
                          <span className={s.explicTitulo}>{actual.options.find((o) => o.id === elegida)?.correct ? 'Correcto' : 'Explicación'}</span>
                          <ReactMarkdown>{conSaltos(actual.explanation)}</ReactMarkdown>
                        </div>
                      )}
                      {actual.reviewNote && (
                        <div className={s.revisar}>
                          <strong>Observación del cuadernillo</strong>
                          <span>{actual.reviewNote}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={s.pie}>
                  <span className={s.atajo}>{respondida ? 'Enter para continuar' : 'Responde con clic o con las teclas A–E'}</span>
                  {respondida && (
                    <button type="button" className={s.btn} onClick={siguiente}>
                      {i < mazo.length - 1 ? 'Siguiente' : 'Ver resultado'}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className={s.mando}>
            <button type="button" className={s.flecha} onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Pregunta anterior">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className={s.progreso}>
              <span className={s.contador} aria-live="polite"><strong>{i + 1}</strong> / {mazo.length} <em>· {hechas}/{total} respondidas</em></span>
              <div className={s.rastro} onClick={saltarRastro} role="slider" tabIndex={0} aria-valuemin={1} aria-valuemax={mazo.length} aria-valuenow={i + 1} aria-valuetext={`Pregunta ${i + 1} de ${mazo.length}`} aria-label="Ir a una pregunta" onKeyDown={(e) => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
                e.preventDefault(); e.stopPropagation();
                ir(e.key === 'Home' ? 0 : e.key === 'End' ? mazo.length - 1 : i + (e.key === 'ArrowRight' ? 1 : -1));
              }}>
                {mazo.map((q, k) => {
                  const r = resp[q.id];
                  const c = [r === undefined ? '' : esCorrecta(q) ? s.mOk : s.mMal, k === i ? s.mActual : ''].join(' ');
                  return <i key={q.id} className={c} />;
                })}
              </div>
            </div>
            <button type="button" className={s.flecha} onClick={() => ir(i + 1)} disabled={i >= mazo.length - 1} aria-label="Pregunta siguiente">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </>
      )}

      {ampliada && <VisorImagen img={ampliada} onClose={() => setAmpliada(null)} />}
    </>
  );
}

function ExplicacionEncib({ pregunta, opciones, elegida }: { pregunta: Q; opciones: ExamOption[]; elegida?: string }) {
  const detalle = pregunta.explanationDetail!;
  const correcta = opciones.find((o) => o.correct);
  const acierto = correcta?.id === elegida;
  return (
    <section className={s.razonamiento} aria-label="Explicación de la respuesta">
      <p className={`${s.feedback} ${acierto ? s.feedbackOk : s.feedbackMal}`} role="status">
        {acierto ? <IconoOk /> : <IconoMal />}
        <span>{pregunta.reviewNote ? acierto ? 'Coincide con la clave del cuadernillo' : 'Revisemos la clave del cuadernillo' : acierto ? 'Respuesta correcta' : 'Vamos a entenderla'}<strong>{correcta?.text}</strong></span>
      </p>
      <div className={s.fundamento}><h3>{pregunta.reviewNote ? 'Fundamento y límites de la clave' : 'Por qué es correcta'}</h3><ReactMarkdown>{detalle.fundamento}</ReactMarkdown></div>
      <details key={pregunta.id} className={s.descartes}>
        <summary>Por qué las otras opciones no corresponden <span>{detalle.descartes.length}</span></summary>
        <dl>{opciones.filter((o) => !o.correct).map((o) => {
          const descarte = detalle.descartes.find((d) => d.optionId === o.id);
          if (!descarte) return null;
          return <div key={o.id}><dt>{LETRAS[opciones.indexOf(o)]}. {o.text}{o.id === elegida && <small>Tu respuesta</small>}</dt><dd><ReactMarkdown>{descarte.texto}</ReactMarkdown></dd></div>;
        })}</dl>
      </details>
      <aside className={s.datoClave}><span aria-hidden>↳</span><div><h3>Dato clave</h3><ReactMarkdown>{detalle.datoClave}</ReactMarkdown></div></aside>
    </section>
  );
}

/* ── Pantalla de resultado ────────────────────────────────────────────────── */

function Resultado({
  anio, titulo, total, hechas, aciertos, falladas, areas, areasConteo, porArea, reducido, onRevisar, onVolver, onReiniciar,
}: {
  anio: number; titulo?: string; total: number; hechas: number; aciertos: number; falladas: number;
  areas: AreaEncibLite[]; areasConteo: Map<string, number>; porArea: (cod: string) => number;
  reducido: boolean; onRevisar: () => void; onVolver: () => void; onReiniciar: () => void;
}) {
  const n = useConteo(aciertos, reducido);
  const vigesimal = total ? Math.round((aciertos / total) * 200) / 10 : 0;
  const pendientes = total - hechas;

  return (
    <motion.div
      className={s.mazo}
      initial={reducido ? false : { opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={MUELLE}
    >
      <article className={`${s.carta} ${s.fin}`}>
        <div className={s.finCabeza}>
          <div className={s.nota} aria-label={`${aciertos} aciertos de ${total}`}>{n}<small> / {total}</small></div>
          <div className={s.finTexto}>
            <strong>{titulo ?? `ENCIB ${anio}`}</strong>
            <span>Nota vigesimal: <b>{vigesimal.toFixed(1)}</b> / 20</span>
            <span>{hechas} respondidas{pendientes > 0 ? `, ${pendientes} sin responder` : ''}</span>
          </div>
        </div>

        <ul className={s.barras} aria-label="Aciertos por área">
          {areas.filter((a) => areasConteo.has(a.codigo)).map((a, k) => {
            const t = areasConteo.get(a.codigo) ?? 0;
            const ok = porArea(a.codigo);
            return (
              <li key={a.codigo} className={s.barraFila} style={{ ['--ac' as string]: a.color }}>
                <span className={s.barraNombre}><i aria-hidden />{a.nombre}</span>
                <span className={s.barraPista}>
                  <motion.span
                    className={s.barraRelleno}
                    initial={reducido ? false : { scaleX: 0 }}
                    animate={{ scaleX: t ? ok / t : 0 }}
                    transition={reducido ? { duration: 0 } : { duration: 0.7, delay: 0.1 + k * 0.05, ease: 'easeOut' }}
                  />
                </span>
                <span className={s.barraCifra}>{ok} / {t}</span>
              </li>
            );
          })}
        </ul>

        <div className={s.finAcciones}>
          {falladas > 0 && <button type="button" className={s.btn} onClick={onRevisar}>{falladas === 1 ? 'Revisar la pregunta fallada' : `Revisar las ${falladas} falladas`}</button>}
          <button type="button" className={`${s.btn} ${s.btnSec}`} onClick={onVolver}>{pendientes > 0 ? 'Seguir respondiendo' : 'Volver al mazo'}</button>
          <button type="button" className={`${s.btn} ${s.btnSec}`} onClick={onReiniciar}>Reiniciar {titulo === 'Práctica ENCIB' ? 'práctica' : anio}</button>
        </div>
      </article>
    </motion.div>
  );
}
