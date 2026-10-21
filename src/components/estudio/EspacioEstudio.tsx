'use client';
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MUESTRA } from '@/lib/estudio/muestra';
import type { ClaseEstudio, CursoEstudio, CursoListado, SemanaEstudio } from '@/lib/estudio/tipos';
import { useDarkMode } from '@/components/DarkModeContext';
import { cx, Icono } from './Icono';
import { norm } from './Graficos';
import Lector, { BarraLector, Practica } from './Lector';
import Laboratorio from './Laboratorio';
import Progreso from './Progreso';
import { Buscador, VisorLab } from './Dialogos';
import { useMarcas, type Marcas } from './marcas';

export type Pagina = 'study' | 'labs' | 'progress';
export type Ruta = 'UPCH' | 'Ciencias básicas' | 'ENCIB';
export interface EstadoEstudio {
  page: Pagina; route: Ruta; tab: 'summary' | 'practice'; filter: string; collapsed: Set<string>;
  labFilter: string; labSearch: string; labSubject: string; readingSheet: boolean; focus: boolean;
}
type Overlay = null | { tipo: 'buscar' } | { tipo: 'lab'; id: string };

/** Los laboratorios siguen siendo los de muestra hasta la Fase 4. */
const LABS = MUESTRA.labs;
/** Tono de la luna elegido en el prototipo (`?luna=blue`). */
const LUNA = '#245b8f';

const estadoInicial = (): EstadoEstudio => ({
  page: 'study', route: 'UPCH', tab: 'summary', filter: '', collapsed: new Set(),
  labFilter: 'Todos', labSearch: '', labSubject: 'Todos', readingSheet: false, focus: false,
});

export const leccionesDe = (c: CursoEstudio) => c.groups.flatMap((g) => g.lessons);
/** La primera clase con resumen (la que tiene algo que leer); si no hay, la primera. */
const claseDeEntrada = (c: CursoEstudio) => leccionesDe(c).find((l) => l.resumenes.length) ?? leccionesDe(c)[0];

export interface Contexto {
  st: EstadoEstudio;
  set: (fn: (s: EstadoEstudio) => Partial<EstadoEstudio>) => void;
  marcas: Marcas;
  cursos: CursoListado[];
  course: CursoEstudio;
  lessons: ClaseEstudio[];
  lesson: ClaseEstudio;
  group: SemanaEstudio;
  openLesson: (id: string) => void;
  cambiarCurso: (slug: string, pagina?: Pagina) => void;
  irA: (page: Pagina) => void;
  abrirLab: (id: string) => void;
  toast: (msg: string) => void;
  posiciones: React.MutableRefObject<Record<string, number>>;
  barraOculta: boolean;
  setBarraOculta: (v: boolean) => void;
}

export default function EspacioEstudio({ cursos, curso, children }: { cursos: CursoListado[]; curso: CursoEstudio | null; children?: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ clase?: string[] }>();
  const [st, setSt] = useState<EstadoEstudio>(estadoInicial);
  const set = useCallback((fn: (s: EstadoEstudio) => Partial<EstadoEstudio>) => setSt((s) => ({ ...s, ...fn(s) })), []);
  const marcas = useMarcas();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [aviso, setAviso] = useState({ msg: '', visible: false });
  const [barraOculta, setBarraOculta] = useState(false);
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const posiciones = useRef<Record<string, number>>({});
  const vuelveFoco = useRef<HTMLElement | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { darkMode, toggleDark } = useDarkMode();

  const lessons = curso ? leccionesDe(curso) : [];
  const pedida = params?.clase?.[0];
  const lesson = (curso && (lessons.find((l) => l.id === pedida) ?? claseDeEntrada(curso))) || null;
  const group = curso && lesson ? curso.groups.find((g) => g.lessons.some((l) => l.id === lesson.id)) ?? curso.groups[0] : null;

  const toast = useCallback((msg: string) => {
    setAviso({ msg, visible: true });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 2500);
  }, []);

  const base = curso ? `/estudio/upch/${curso.id}` : '/estudio';
  const openLesson = useCallback((id: string) => {
    set(() => ({ page: 'study', tab: 'summary', filter: '' }));
    setSidebarAbierta(false);
    router.push(`${base}/${id}`, { scroll: false });
  }, [base, router, set]);
  const cambiarCurso = useCallback((slug: string, pagina?: Pagina) => {
    router.push(`/estudio/upch/${slug}${pagina && pagina !== 'study' ? `#${pagina === 'labs' ? 'labs' : 'progress'}` : ''}`);
  }, [router]);
  const irA = useCallback((page: Pagina) => { set(() => ({ page, focus: false })); setSidebarAbierta(false); }, [set]);
  const abrirOverlay = (o: Overlay) => { vuelveFoco.current = document.activeElement as HTMLElement; setOverlay(o); };
  const cerrarOverlay = useCallback(() => {
    setOverlay(null);
    const el = vuelveFoco.current; vuelveFoco.current = null;
    requestAnimationFrame(() => el?.focus?.());
  }, []);
  const abrirLab = (id: string) => { if (LABS.some((l) => l.id === id)) abrirOverlay({ tipo: 'lab', id }); };

  // La clase visitada queda marcada en el temario (el check gris del prototipo).
  const visitar = marcas.visitar;
  useEffect(() => { if (lesson) visitar(lesson.id); }, [lesson?.id, visitar]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hash: `#labs` y `#progress` son páginas de la interfaz; la clase va en la ruta ──
  const [hashLeido, setHashLeido] = useState(false);
  useEffect(() => {
    const leer = () => {
      const h = location.hash.slice(1);
      set(() => ({ page: h === 'labs' ? 'labs' : h === 'progress' ? 'progress' : 'study', focus: false }));
    };
    leer();
    if (new URLSearchParams(location.search).get('hoja') === '1') set(() => ({ readingSheet: true }));
    setHashLeido(true);
    window.addEventListener('hashchange', leer);
    return () => window.removeEventListener('hashchange', leer);
  }, [set]);
  useEffect(() => {
    if (!hashLeido) return;
    const hash = st.page === 'study' ? '' : `#${st.page}`;
    if (location.hash !== hash) history.replaceState(history.state, '', location.pathname + location.search + hash);
  }, [hashLeido, st.page]);

  // En el prototipo cada render rehacía el DOM y la barra del lector volvía a verse.
  useEffect(() => { setBarraOculta(false); }, [st.page, st.tab, lesson?.id, st.focus, marcas.saved, marcas.completed]);

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

  const claseRaiz = cx(
    'wrapper',
    st.focus && st.page === 'study' && 'focus-mode',
    st.readingSheet && 'reading-sheet',
    sidebarAbierta && 'sidebar-open',
  );
  const estilo = { '--reading-size': `${marcas.fontSize}px` } as React.CSSProperties;

  // Cuenta que no es de Cayetano: la misma cáscara con el aviso en lugar del temario.
  if (!curso || !lesson || !group) {
    return (
      <div className={claseRaiz} data-palette="pearl" style={estilo}>
        <BarraSuperior page="study" onPagina={() => {}} onBuscar={() => {}} darkMode={darkMode} onLuna={toggleDark} />
        <main className={cx('page-scroll studio-page')}>
          <div className={cx('studio-shell')}>
            <div className={cx('resource-empty')}>
              <Icono n="lock" />
              <h2>Los cursos de Cayetano son para cuentas @upch.pe</h2>
              <p>Entra con tu correo de la universidad (Google) para ver tus sílabos. Las rutas de Ciencias básicas y ENCIB llegan pronto.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const ctx: Contexto = {
    st, set, marcas, cursos, course: curso, lessons, lesson, group, openLesson, cambiarCurso,
    irA, abrirLab, toast, posiciones, barraOculta, setBarraOculta,
  };

  return (
    <div className={claseRaiz} data-palette="pearl" style={estilo}>
      <div inert={overlay !== null}>
        <BarraSuperior page={st.page} onPagina={irA} onBuscar={() => abrirOverlay({ tipo: 'buscar' })} darkMode={darkMode} onLuna={toggleDark} />
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
        ) : st.page === 'labs' ? <Laboratorio ctx={ctx} labs={LABS} /> : <Progreso ctx={ctx} />}
      </div>
      <div ref={overlayRef}>
        {overlay?.tipo === 'buscar' && (
          <Buscador
            curso={curso}
            cursos={cursos}
            onCerrar={cerrarOverlay}
            onAbrir={(id) => { cerrarOverlay(); openLesson(id); }}
            onCurso={(slug) => { cerrarOverlay(); cambiarCurso(slug); }}
          />
        )}
        {overlay?.tipo === 'lab' && <VisorLab lab={LABS.find((l) => l.id === overlay.id)!} onCerrar={cerrarOverlay} />}
      </div>
      <div className={cx('toast', aviso.visible && 'visible')} role="status" aria-live="polite">{aviso.msg}</div>
      {children}
    </div>
  );
}

function BarraSuperior({ page, onPagina, onBuscar, darkMode, onLuna }: { page: Pagina; onPagina: (p: Pagina) => void; onBuscar: () => void; darkMode: boolean; onLuna: () => void }) {
  const enlace = (p: Pagina, label: string, icon: 'book' | 'flask' | 'chart') => (
    <button className={cx('nav-link', page === p && 'active')} data-page={p} aria-current={page === p ? 'page' : undefined} onClick={() => onPagina(p)}>
      <Icono n={icon} /><span>{label}</span>
    </button>
  );
  const etiquetaLuna = darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  return (
    <header className={cx('topbar')}>
      <button className={cx('brand')} aria-label="MedGO, ir a Estudiar" onClick={() => onPagina('study')}><span className={cx('brand-lockup')} aria-hidden="true" /></button>
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
  const { st, cursos, course, cambiarCurso, toast } = ctx;
  return (
    <div className={cx('contextbar')}>
      <button className={cx('icon-button mobile-menu')} aria-label="Abrir temario" onClick={onMenu}><Icono n="menu" /></button>
      <div className={cx('context-label')}>Tu ruta</div>
      <div className={cx('select-shell')}>
        {/* Por ahora sólo UPCH tiene temario: las otras dos rutas avisan y no cambian nada. */}
        <select aria-label="Ruta de estudio" value={st.route} onChange={(e) => {
          if (e.target.value !== 'UPCH') toast(`${e.target.value} llega pronto · Seguimos con tu sílabo de UPCH`);
        }}>
          {RUTAS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <Icono n="down" />
      </div>
      <span className={cx('context-divider')} />
      <div className={cx('select-shell')}>
        <select className={cx('course-select')} aria-label="Elegir curso" value={course.id} onChange={(e) => cambiarCurso(e.target.value)}>
          {cursos.map((c) => <option key={c.id} value={c.id}>{c.name}{c.bloqueado ? ' · con plan' : ''}</option>)}
        </select>
        <Icono n="down" />
      </div>
      <span className={cx('route-badge')}>{course.track === 'basico' ? 'UFBI' : 'MEDICINA'}</span>
      <div className={cx('context-end')}><span>Todo tu estudio, en un mismo lugar</span><Icono n="book" /></div>
    </div>
  );
}

function IconoCurso({ c }: { c: CursoEstudio }) {
  if (!c.icono) return <Icono n="book" />;
  return <img src={c.icono} alt="" />;
}

function Temario({ ctx }: { ctx: Contexto }) {
  const { st, set, course: c, lesson: actual, marcas, openLesson } = ctx;
  const query = norm(st.filter);
  const grupos = useMemo(() => c.groups.map((g) => ({ g, found: g.lessons.filter((l) => !query || norm(l.title).includes(query)) }))
    .filter((x) => x.found.length), [c, query]);
  return (
    <aside className={cx('course-nav')} aria-label="Temario del curso">
      <div className={cx('course-nav-head')}>
        <div className={cx('course-name-row')}>
          <div className={cx('subject-icon')}><IconoCurso c={c} /></div>
          <div>
            <h2>{c.name}</h2>
            <p>Tu sílabo, a tu ritmo</p>
          </div>
        </div>
        <label className={cx('small-search')}>
          <Icono n="search" />
          <input type="search" placeholder="Filtrar clases..." value={st.filter} aria-label="Filtrar clases del temario" onChange={(e) => set(() => ({ filter: e.target.value }))} />
        </label>
      </div>
      <div className={cx('course-nav-scroll')}>
        {grupos.length ? grupos.map(({ g, found }) => {
          const closed = st.collapsed.has(g.id) && !query;
          return (
            <section key={g.id} className={cx('nav-group')}>
              <button className={cx('nav-group-heading')} aria-expanded={!closed} onClick={() => set((s) => {
                const collapsed = new Set(s.collapsed); if (collapsed.has(g.id)) collapsed.delete(g.id); else collapsed.add(g.id); return { collapsed };
              })}>
                <span>{g.title}</span>
                <Icono n={closed ? 'right' : 'down'} />
              </button>
              {!closed && found.map((l) => (
                <button key={l.id} className={cx('lesson-link', l.id === actual.id && 'active')} aria-current={l.id === actual.id ? 'true' : undefined} onClick={() => openLesson(l.id)}>
                  <Icono n={l.bloqueada ? 'lock' : 'document'} cls="lesson-summary-icon" />
                  <span>{l.title}</span>
                  {marcas.visited.has(l.id) && l.id !== actual.id && <Icono n="check" cls="done-icon" />}
                </button>
              ))}
            </section>
          );
        }) : <div className={cx('empty-state')}>Sin clases con ese nombre.</div>}
      </div>
      <div className={cx('nav-info')}><Icono n="info" />Según tu sílabo de Cayetano</div>
    </aside>
  );
}
