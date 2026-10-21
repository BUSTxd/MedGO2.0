'use client';
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MUESTRA, type CursoMuestra, type LeccionMuestra, type PreguntaMuestra } from '@/lib/estudio/muestra';
import { useDarkMode } from '@/components/DarkModeContext';
import { cx, Icono } from './Icono';
import { norm } from './Graficos';
import Lector, { BarraLector, Practica } from './Lector';
import Laboratorio from './Laboratorio';
import Progreso from './Progreso';
import { Buscador, VisorLab } from './Dialogos';

export type Pagina = 'study' | 'labs' | 'progress';
export type Ruta = 'UPCH' | 'Ciencias básicas' | 'ENCIB';
export interface Simulacro {
  courseId: string; running: boolean; finished: boolean; index: number;
  answers: Record<number, number>; questions: PreguntaMuestra[]; endsAt: number;
}
export interface EstadoEstudio {
  page: Pagina; route: Ruta; courseId: string; lessonId: string; tab: 'summary' | 'practice';
  practiceMode: 'training' | 'simulation'; filter: string; collapsed: Set<string>; saved: Set<string>;
  visited: Set<string>; answers: Record<string, { selected: number }>; sim: Simulacro | null;
  labFilter: string; labSearch: string; labSubject: string; planCourseId: string; completed: Set<string>;
  readingSheet: boolean; focus: boolean; fontSize: number; simulations: Record<string, Simulacro>;
}
type Overlay = null | { tipo: 'buscar' } | { tipo: 'lab'; id: string };

const DATA = MUESTRA;
export const leccionesDe = (c: CursoMuestra) => c.groups.flatMap((g) => g.lessons);
export const todasLasLecciones = () =>
  DATA.courses.flatMap((c) => c.groups.flatMap((g) => g.lessons.map((l) => ({ ...l, course: c, group: g }))));

const CURSO_INICIAL = DATA.courses[0];
const LECCION_INICIAL = leccionesDe(CURSO_INICIAL).find((l) => norm(l.title).includes('mediastino')) || CURSO_INICIAL.groups[0].lessons[0];
/** Tono de la luna elegido en el prototipo (`?luna=blue`). */
const LUNA = '#245b8f';

/** Cambiar de curso guarda el simulacro en curso y recupera el del curso nuevo. */
function cambioDeCurso(s: EstadoEstudio, id: string): Partial<EstadoEstudio> {
  const simulations = s.sim?.courseId ? { ...s.simulations, [s.sim.courseId]: s.sim } : s.simulations;
  return { courseId: id, sim: simulations[id] || null, simulations };
}

const estadoInicial = (): EstadoEstudio => ({
  page: 'study', route: 'UPCH', courseId: CURSO_INICIAL.id, lessonId: LECCION_INICIAL.id, tab: 'summary',
  practiceMode: 'training', filter: '', collapsed: new Set(), saved: new Set(), visited: new Set([LECCION_INICIAL.id]),
  answers: {}, sim: null, labFilter: 'Todos', labSearch: '', labSubject: 'Todos', planCourseId: CURSO_INICIAL.id,
  completed: new Set(), readingSheet: false, focus: false, fontSize: 16, simulations: {},
});

export interface Contexto {
  st: EstadoEstudio;
  set: (fn: (s: EstadoEstudio) => Partial<EstadoEstudio>) => void;
  course: CursoMuestra;
  lessons: LeccionMuestra[];
  lesson: LeccionMuestra;
  group: CursoMuestra['groups'][number];
  relatedLab: (typeof DATA.labs)[number] | undefined;
  openLesson: (id: string, cid?: string) => void;
  openPracticeLesson: (id: string, cid?: string) => void;
  toggleCompleted: (id: string) => void;
  irA: (page: Pagina) => void;
  abrirLab: (id: string) => void;
  toast: (msg: string) => void;
  posiciones: React.MutableRefObject<Record<string, number>>;
  barraOculta: boolean;
  setBarraOculta: (v: boolean) => void;
  ahora: number;
}

export default function EspacioEstudio() {
  const [st, setSt] = useState<EstadoEstudio>(estadoInicial);
  const set = useCallback((fn: (s: EstadoEstudio) => Partial<EstadoEstudio>) => setSt((s) => ({ ...s, ...fn(s) })), []);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [aviso, setAviso] = useState({ msg: '', visible: false });
  const [barraOculta, setBarraOculta] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());
  const posiciones = useRef<Record<string, number>>({});
  const vuelveFoco = useRef<HTMLElement | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [hashLeido, setHashLeido] = useState(false);
  const { darkMode, toggleDark } = useDarkMode();

  const course = DATA.courses.find((c) => c.id === st.courseId) || DATA.courses[0];
  const lessons = leccionesDe(course);
  const lesson = lessons.find((l) => l.id === st.lessonId) || lessons[0];
  const group = course.groups.find((g) => g.lessons.some((l) => l.id === st.lessonId)) || course.groups[0];
  const relatedLab = DATA.labs.find((l) => l.id === lesson.relatedLab)
    || DATA.labs.find((l) => l.kind === (course.icon === 'kidney' ? 'nephron' : course.icon === 'brain' ? 'brain' : 'heart'));

  const toast = useCallback((msg: string) => {
    setAviso({ msg, visible: true });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 2500);
  }, []);

  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const openLesson = useCallback((id: string, cid?: string) => {
    set((s) => ({
      ...(cid && cid !== s.courseId ? cambioDeCurso(s, cid) : {}),
      lessonId: id, page: 'study', tab: 'summary', visited: new Set(s.visited).add(id), filter: '',
    }));
    setSidebarAbierta(false);
  }, [set]);
  const openPracticeLesson = useCallback((id: string, cid?: string) => {
    set((s) => ({
      ...(cid && cid !== s.courseId ? cambioDeCurso(s, cid) : {}),
      lessonId: id, page: 'study', tab: 'practice', practiceMode: 'training', focus: false, visited: new Set(s.visited).add(id), filter: '',
    }));
  }, [set]);
  const toggleCompleted = useCallback((id: string) => {
    set((s) => { const completed = new Set(s.completed); if (completed.has(id)) completed.delete(id); else completed.add(id); return { completed }; });
  }, [set]);
  const irA = useCallback((page: Pagina) => { set(() => ({ page, focus: false })); setSidebarAbierta(false); }, [set]);
  const abrirOverlay = (o: Overlay) => { vuelveFoco.current = document.activeElement as HTMLElement; setOverlay(o); };
  const cerrarOverlay = useCallback(() => {
    setOverlay(null);
    const el = vuelveFoco.current; vuelveFoco.current = null;
    requestAnimationFrame(() => el?.focus?.());
  }, []);
  const abrirLab = (id: string) => { if (DATA.labs.some((l) => l.id === id)) abrirOverlay({ tipo: 'lab', id }); };

  // ── Hash: `#study/<curso>/<clase>/<pestaña>`, `#labs`, `#progress` (como el prototipo) ──
  const leerHash = useCallback(() => {
    const [page, cid, lid, tab] = location.hash.slice(1).split('/');
    if (!['study', 'labs', 'progress'].includes(page)) return;
    set((s) => {
      const r: Partial<EstadoEstudio> = { page: page as Pagina, focus: false };
      if (page === 'study') {
        const target = DATA.courses.find((c) => c.id === cid);
        if (target) {
          Object.assign(r, cambioDeCurso(s, target.id));
          r.lessonId = leccionesDe(target).find((l) => l.id === lid)?.id || target.groups[0].lessons[0].id;
        }
        r.tab = tab === 'practice' ? 'practice' : 'summary';
      }
      return r;
    });
  }, [set]);
  useEffect(() => {
    leerHash();
    if (new URLSearchParams(location.search).get('hoja') === '1') set(() => ({ readingSheet: true }));
    setHashLeido(true);
    const alCambiar = () => leerHash();
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, [leerHash, set]);
  useEffect(() => {
    if (!hashLeido) return;
    const hash = `#${st.page}${st.page === 'study' ? `/${st.courseId}/${st.lessonId}/${st.tab}` : ''}`;
    history.replaceState(null, '', location.pathname + location.search + hash);
  }, [hashLeido, st.page, st.courseId, st.lessonId, st.tab]);

  // En el prototipo cada render rehacía el DOM y la barra del lector volvía a verse.
  useEffect(() => { setBarraOculta(false); }, [st.page, st.tab, st.lessonId, st.focus, st.saved, st.completed]);

  // ── Simulacro: reloj de 1 s ──
  const simEnCurso = st.sim?.running ? st.sim : null;
  useEffect(() => {
    if (!simEnCurso) return;
    const t = setInterval(() => {
      setAhora(Date.now());
      if (simEnCurso.endsAt - Date.now() <= 0) {
        set((s) => ({ sim: s.sim && { ...s.sim, running: false, finished: true } }));
        toast('El tiempo del simulacro ha terminado');
      }
    }, 1000);
    return () => clearInterval(t);
  }, [simEnCurso, set, toast]);

  // ── Teclado global ──
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Escape') setBarraOculta(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrirOverlay({ tipo: 'buscar' }); return; }
      if (e.key === 'Escape') {
        if (overlay) cerrarOverlay();
        else if (st.focus) set(() => ({ focus: false }));
        else setSidebarAbierta(false);
      }
      if (e.key === 'Tab' && overlay && overlayRef.current) {
        const focusable = Array.from(overlayRef.current.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,[tabindex="0"]'));
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement as HTMLElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [overlay, st.focus, cerrarOverlay, set]);

  const ctx: Contexto = {
    st, set, course, lessons, lesson, group, relatedLab, openLesson, openPracticeLesson, toggleCompleted,
    irA, abrirLab, toast, posiciones, barraOculta, setBarraOculta, ahora,
  };

  const claseRaiz = cx(
    'wrapper',
    st.focus && st.page === 'study' && 'focus-mode',
    st.readingSheet && 'reading-sheet',
    sidebarAbierta && 'sidebar-open',
  );

  return (
    <div className={claseRaiz} data-palette="pearl" style={{ '--reading-size': `${st.fontSize}px` } as React.CSSProperties}>
      <div inert={overlay !== null}>
        <BarraSuperior ctx={ctx} onBuscar={() => abrirOverlay({ tipo: 'buscar' })} darkMode={darkMode} onLuna={toggleDark} />
        {st.page === 'study' ? (
          <>
            <BarraRuta ctx={ctx} onMenu={() => setSidebarAbierta((v) => !v)} />
            <main className={cx('workspace')}>
              <Temario ctx={ctx} />
              <section className={cx('study-area', barraOculta && 'reader-bar-hidden')} aria-label="Espacio de estudio">
                <BarraLector ctx={ctx} />
                {st.tab === 'summary' ? <Lector ctx={ctx} /> : <Practica ctx={ctx} />}
              </section>
            </main>
          </>
        ) : st.page === 'labs' ? <Laboratorio ctx={ctx} labs={DATA.labs} /> : <Progreso ctx={ctx} cursos={DATA.courses} labs={DATA.labs} />}
      </div>
      <div ref={overlayRef}>
        {overlay?.tipo === 'buscar' && (
          <Buscador
            onCerrar={cerrarOverlay}
            onAbrir={(id, cid) => { cerrarOverlay(); openLesson(id, cid); }}
          />
        )}
        {overlay?.tipo === 'lab' && <VisorLab lab={DATA.labs.find((l) => l.id === overlay.id)!} onCerrar={cerrarOverlay} />}
      </div>
      <div className={cx('toast', aviso.visible && 'visible')} role="status" aria-live="polite">{aviso.msg}</div>
    </div>
  );
}

function BarraSuperior({ ctx, onBuscar, darkMode, onLuna }: { ctx: Contexto; onBuscar: () => void; darkMode: boolean; onLuna: () => void }) {
  const { st, irA } = ctx;
  const enlace = (page: Pagina, label: string, icon: 'book' | 'flask' | 'chart') => (
    <button className={cx('nav-link', st.page === page && 'active')} data-page={page} aria-current={st.page === page ? 'page' : undefined} onClick={() => irA(page)}>
      <Icono n={icon} /><span>{label}</span>
    </button>
  );
  const etiquetaLuna = darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  return (
    <header className={cx('topbar')}>
      <button className={cx('brand')} aria-label="MedGO, ir a Estudiar" onClick={() => irA('study')}><span className={cx('brand-lockup')} aria-hidden="true" /></button>
      <nav className={cx('main-nav')} aria-label="Navegación principal">
        {enlace('study', 'Estudiar', 'book')}{enlace('labs', 'Laboratorio virtual', 'flask')}{enlace('progress', 'Mi progreso', 'chart')}
      </nav>
      <div className={cx('top-tools')}>
        <button className={cx('search-launch')} aria-label="Buscar una clase o tema" onClick={onBuscar}>
          <Icono n="search" /><span>Buscar una clase o tema...</span><kbd>Ctrl K</kbd>
        </button>
        <div className={cx('top-account')}>
          <button className={cx('icon-button moon-toggle')} aria-label={etiquetaLuna} title={etiquetaLuna} aria-pressed={darkMode} onClick={onLuna} style={{ '--moon-color': LUNA } as React.CSSProperties}>
            <Icono n="moon" />
          </button>
          <span className={cx('avatar')} title="Perfil de ejemplo">B</span>
        </div>
      </div>
    </header>
  );
}

const RUTAS: Ruta[] = ['UPCH', 'Ciencias básicas', 'ENCIB'];

function BarraRuta({ ctx, onMenu }: { ctx: Contexto; onMenu: () => void }) {
  const { st, set, toast } = ctx;
  return (
    <div className={cx('contextbar')}>
      <button className={cx('icon-button mobile-menu')} aria-label="Abrir temario" onClick={onMenu}><Icono n="menu" /></button>
      <div className={cx('context-label')}>Tu ruta</div>
      <div className={cx('select-shell')}>
        <select aria-label="Ruta de estudio" value={st.route} onChange={(e) => {
          const route = e.target.value as Ruta;
          set(() => ({ route }));
          toast(route === 'UPCH' ? 'Temario organizado según el sílabo' : route === 'ENCIB' ? 'Vista de preparación ENCIB · Temas de muestra' : 'Vista por temas · Ciencias básicas');
        }}>
          {RUTAS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <Icono n="down" />
      </div>
      <span className={cx('context-divider')} />
      <div className={cx('select-shell')}>
        <select className={cx('course-select')} aria-label="Elegir curso" value={st.courseId} onChange={(e) => {
          const id = e.target.value;
          const destino = DATA.courses.find((c) => c.id === id)!;
          const primera = leccionesDe(destino)[0].id;
          set((s) => ({
            ...cambioDeCurso(s, id), filter: '', collapsed: new Set(),
            lessonId: primera, page: 'study', tab: 'summary', visited: new Set(s.visited).add(primera),
          }));
        }}>
          {DATA.courses.map((c) => <option key={c.id} value={c.id}>{st.route === 'UPCH' ? c.name : c.shortName || c.name}</option>)}
        </select>
        <Icono n="down" />
      </div>
      <span className={cx('route-badge')}>{st.route === 'UPCH' ? 'MEDICINA' : st.route === 'ENCIB' ? 'PREPARACIÓN' : 'ESTUDIO LIBRE'}</span>
      <div className={cx('context-end')}><span>Todo tu estudio, en un mismo lugar</span><Icono n="book" /></div>
    </div>
  );
}

function IconoCurso({ c }: { c: CursoMuestra }) {
  if (c.icon === 'brain') return <Icono n="brain" />;
  return <img src={`/assets/estudio/${c.icon === 'kidney' ? 'kidney.svg' : 'course-fisiologia.avif'}`} alt="" />;
}

function Temario({ ctx }: { ctx: Contexto }) {
  const { st, set, course: c, openLesson } = ctx;
  const query = norm(st.filter);
  const grupos = useMemo(() => c.groups.map((g, gi) => {
    const found = g.lessons.filter((l) => !query || norm(l.title).includes(query));
    return { g, gi, found };
  }).filter((x) => x.found.length), [c, query]);
  return (
    <aside className={cx('course-nav')} aria-label="Temario del curso">
      <div className={cx('course-nav-head')}>
        <div className={cx('course-name-row')}>
          <div className={cx('subject-icon')}><IconoCurso c={c} /></div>
          <div>
            <h2>{c.name}</h2>
            <p>{st.route === 'UPCH' ? 'Tu sílabo, a tu ritmo' : st.route === 'ENCIB' ? 'Temas para preparar el examen' : 'Explora y conecta los conceptos'}</p>
          </div>
        </div>
        <label className={cx('small-search')}>
          <Icono n="search" />
          <input type="search" placeholder="Filtrar clases..." value={st.filter} aria-label="Filtrar clases del temario" onChange={(e) => set(() => ({ filter: e.target.value }))} />
        </label>
      </div>
      <div className={cx('course-nav-scroll')}>
        {grupos.length ? grupos.map(({ g, gi, found }) => {
          const closed = st.collapsed.has(g.id) && !query;
          return (
            <section key={g.id} className={cx('nav-group')}>
              <button className={cx('nav-group-heading')} aria-expanded={!closed} onClick={() => set((s) => {
                const collapsed = new Set(s.collapsed); if (collapsed.has(g.id)) collapsed.delete(g.id); else collapsed.add(g.id); return { collapsed };
              })}>
                <span>{st.route === 'UPCH' ? g.title : `BLOQUE ${gi + 1}`}</span>
                <Icono n={closed ? 'right' : 'down'} />
              </button>
              {!closed && found.map((l) => (
                <button key={l.id} className={cx('lesson-link', l.id === st.lessonId && 'active')} aria-current={l.id === st.lessonId ? 'true' : undefined} onClick={() => openLesson(l.id)}>
                  <Icono n="document" cls="lesson-summary-icon" />
                  <span>{l.title}</span>
                  {st.visited.has(l.id) && l.id !== st.lessonId && <Icono n="check" cls="done-icon" />}
                </button>
              ))}
            </section>
          );
        }) : <div className={cx('empty-state')}>Sin clases con ese nombre.</div>}
      </div>
      <div className={cx('nav-info')}><Icono n="info" />Contenido de ejemplo · Sin conexiones</div>
    </aside>
  );
}

