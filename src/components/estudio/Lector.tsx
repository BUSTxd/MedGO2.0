'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/analytics';
import type { ResumenEstudio } from '@/lib/estudio/tipos';
import { cx, Icono } from './Icono';
import type { Contexto } from './EspacioEstudio';

// Los mismos visores que la tarjeta «Resumen» del dashboard; sólo bajan al abrirlos.
const HtmlFullscreenModal = dynamic(() => import('@/components/HtmlFullscreenModal'), { ssr: false });
const PdfFullscreenModal = dynamic(() => import('@/components/PdfFullscreenModal'), { ssr: false });
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

export function BarraLector({ ctx }: { ctx: Contexto }) {
  const { st, set, barraOculta } = ctx;
  return (
    <div className={cx('study-toolbar')} inert={barraOculta} aria-hidden={barraOculta ? 'true' : undefined}>
      <div className={cx('study-tabs')} role="tablist" aria-label="Material de la clase">
        <button id="summary-tab" className={cx('study-tab', st.tab === 'summary' && 'active')} role="tab" aria-selected={st.tab === 'summary'} aria-controls="study-content" onClick={() => set(() => ({ tab: 'summary' }))}>
          <Icono n="document" />Resumen
        </button>
        <button id="practice-tab" className={cx('study-tab', st.tab === 'practice' && 'active')} role="tab" aria-selected={st.tab === 'practice'} aria-controls="study-content" onClick={() => set(() => ({ tab: 'practice' }))}>
          <Icono n="quiz" />Práctica
        </button>
      </div>
      <div className={cx('reading-tools')}>
        <label className={cx('reading-view-switch')} title="Comparar el resumen con y sin hoja">
          <input type="checkbox" checked={st.readingSheet} disabled={st.tab !== 'summary'} onChange={(e) => {
            const readingSheet = e.target.checked;
            set(() => ({ readingSheet }));
            const url = new URL(location.href);
            if (readingSheet) url.searchParams.set('hoja', '1'); else url.searchParams.delete('hoja');
            history.replaceState(history.state, '', url);
          }} />
          <span>Hoja</span>
        </label>
        <button className={cx('focus-button')} aria-label={st.focus ? 'Salir de enfoque' : 'Enfocar'} onClick={() => set((s) => ({ focus: !s.focus }))}>
          <Icono n="expand" /><span>{st.focus ? 'Salir de enfoque' : 'Enfocar'}</span>
        </button>
      </div>
    </div>
  );
}

export default function Lector({ ctx }: { ctx: Contexto }) {
  const { st, marcas, course: c, lesson: l, group: g, lessons: list, openLesson, toast, posiciones, setBarraOculta } = ctx;
  const index = list.findIndex((a) => a.id === l.id);
  const scroller = useRef<HTMLDivElement>(null);
  const [tocActivo, setTocActivo] = useState('');
  const [abierto, setAbierto] = useState<ResumenEstudio | null>(null);
  const [comprar, setComprar] = useState(false);
  const guardada = !!marcas.saved[l.id];
  const estudiada = marcas.completed.has(l.id);

  // Secciones del lector (numeradas como en el prototipo); el índice «En esta clase» las sigue.
  const secciones: [string, string][] = [
    ...(l.subtemas.length ? [['section-temas', 'Temas de la clase'] as [string, string]] : []),
    ['section-resumen', l.resumenes.length > 1 ? 'Resúmenes' : 'Resumen'],
    ...(l.docentes.length ? [['section-docentes', 'Docentes'] as [string, string]] : []),
  ];
  const num = (id: string) => String(secciones.findIndex(([s]) => s === id) + 1).padStart(2, '0');

  // Cada clase recuerda dónde se quedó la lectura.
  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: posiciones.current[l.id] || 0, behavior: 'instant' });
    setTocActivo(secciones[0][0]);
  }, [l.id, posiciones]); // eslint-disable-line react-hooks/exhaustive-deps

  // La barra del lector se contrae al bajar 40 px pasados los 120 y vuelve al subir 12.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let last = el.scrollTop, direction = 0, travel = 0, settlingUntil = 0, oculta = false;
    const alDesplazar = () => {
      const y = Math.max(0, el.scrollTop), delta = y - last; last = y;
      posiciones.current[l.id] = el.scrollTop;
      if (performance.now() < settlingUntil || !delta) return;
      const bar = el.closest('section')?.querySelector('[role="tablist"]')?.parentElement;
      if (bar?.contains(document.activeElement)) return;
      const next = Math.sign(delta);
      if (direction !== next) { travel = 0; direction = next; }
      travel += Math.abs(delta);
      if (oculta && (y < 32 || (direction < 0 && travel >= 12))) { oculta = false; setBarraOculta(false); travel = 0; settlingUntil = performance.now() + 260; }
      else if (!oculta && y > 120 && direction > 0 && travel >= 40) { oculta = true; setBarraOculta(true); travel = 0; settlingUntil = performance.now() + 260; }
    };
    el.addEventListener('scroll', alDesplazar, { passive: true });
    return () => el.removeEventListener('scroll', alDesplazar);
  }, [l.id, posiciones, setBarraOculta]);

  const irASeccion = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocActivo(id);
  };
  const guardar = () => {
    const queda = marcas.alternarGuardada(l.id, { title: l.title, curso: c.id, cursoNombre: c.name });
    toast(queda ? 'Clase guardada en Mi progreso' : 'Clase quitada de guardados');
  };
  const abrir = (r: ResumenEstudio) => {
    if (l.bloqueada) { setComprar(true); return; }
    trackEvent('resumen_abierto', { claseId: r.id, origen: 'estudio' });
    setAbierto(r);
  };

  return (
    <div className={cx('reading-layout')} id="study-content" role="tabpanel" aria-labelledby="summary-tab">
      <div className={cx('article-scroller')} id="article-scroller" ref={scroller} tabIndex={0} aria-label="Contenido de la clase" data-reading-lesson={l.id}>
        <article className={cx('article')}>
          <div className={cx('article-topline')}>
            <div className={cx('breadcrumb')}>{c.name}<span>/</span><span>{st.route === 'UPCH' ? g.title : 'Temario'}</span></div>
            <div className={cx('article-controls')}>
              <button className={cx('icon-button')} aria-label="Reducir tamaño de letra" onClick={() => marcas.setFontSize((n) => Math.max(14, n - 1))}>A−</button>
              <button className={cx('icon-button')} aria-label="Aumentar tamaño de letra" onClick={() => marcas.setFontSize((n) => Math.min(21, n + 1))}>A+</button>
              <button className={cx('icon-button', guardada && 'saved')} aria-label={guardada ? 'Quitar de guardados' : 'Guardar clase'} title="Guardar clase" onClick={guardar}>
                <Icono n="bookmark" />
              </button>
            </div>
          </div>
          <h1>{l.title}</h1>
          <div className={cx('article-meta')}>
            {(l.fecha || l.hora) && <span><Icono n="clock" />{[l.fecha, l.hora].filter(Boolean).join(' · ')}</span>}
            <span><Icono n="document" />{l.tipo}</span>
            <span className={cx('material-chip')}>{l.resumenes.length ? (l.bloqueada ? 'Con tu plan' : 'Con resumen') : 'Sin resumen aún'}</span>
          </div>
          {l.nota && <p className={cx('article-intro')}>{l.nota}</p>}

          {l.subtemas.length > 0 && (
            <section id="section-temas">
              <div className={cx('section-heading')}><span>{num('section-temas')}</span><h2>Temas de la clase</h2></div>
              <ul className={cx('objectives')}>{l.subtemas.map((o) => <li key={o}><Icono n="circleCheck" /><span>{o}</span></li>)}</ul>
            </section>
          )}

          <section id="section-resumen" className={cx('key-card')}>
            <div className={cx('key-card-title')}><Icono n={l.bloqueada ? 'lock' : 'bulb'} />{secciones.find(([s]) => s === 'section-resumen')![1]}</div>
            {l.resumenes.length ? (
              <div className={cx('resumen-opciones')}>
                {l.resumenes.map((r) => (
                  <button key={r.id} className={cx('button')} onClick={() => abrir(r)}>
                    <Icono n={l.bloqueada ? 'lock' : 'document'} />
                    {l.resumenes.length > 1 ? r.label : 'Abrir el resumen'}
                  </button>
                ))}
              </div>
            ) : (
              <ul><li>Esta clase todavía no tiene resumen. Puedes repasar sus temas y seguir con la siguiente.</li></ul>
            )}
            {l.bloqueada && <ul><li>Se abre con el plan de {c.track === 'basico' ? 'UFBI' : 'la Facultad'}.</li></ul>}
          </section>

          {l.docentes.length > 0 && (
            <section id="section-docentes" className={cx('article-section')}>
              <div className={cx('section-heading')}><span>{num('section-docentes')}</span><h2>Docentes</h2></div>
              <p>{l.docentes.join(' · ')}</p>
            </section>
          )}

          <div className={cx('completion-row')}>
            <span>¿Terminaste de estudiar esta clase?</span>
            <button className={cx('lesson-complete', estudiada && 'is-complete')} aria-pressed={estudiada} onClick={() => marcas.alternarEstudiada(l.id)}>
              <Icono n={estudiada ? 'circleCheck' : 'check'} />{estudiada ? 'Marcada como estudiada' : 'Marcar como estudiada'}
            </button>
          </div>
          <footer className={cx('lesson-footer')}>
            {index > 0 ? <button onClick={() => openLesson(list[index - 1].id)}><Icono n="arrowLeft" /><span>{list[index - 1].title}</span></button> : <span />}
            {index < list.length - 1 ? <button className={cx('next')} onClick={() => openLesson(list[index + 1].id)}><span>{list[index + 1].title}</span><Icono n="arrow" /></button> : <span />}
          </footer>
        </article>
      </div>
      <aside className={cx('reading-aside')} aria-label="Índice de la clase">
        <div className={cx('eyebrow')}>En esta clase</div>
        <nav className={cx('toc')} aria-label="Índice de la clase">
          {secciones.map(([id, titulo]) => <button key={id} className={cx(tocActivo === id && 'active')} onClick={() => irASeccion(id)}>{titulo}</button>)}
        </nav>
        <p className={cx('aside-note')}>Este espacio recuerda tu clase mientras exploras. Elige otro tema en el temario para seguir estudiando.</p>
      </aside>

      {abierto && (abierto.formato === 'html'
        ? <HtmlFullscreenModal claseId={abierto.id} titulo={l.title} onClose={() => setAbierto(null)} />
        : <PdfFullscreenModal claseId={abierto.id} onClose={() => setAbierto(null)} />)}
      {comprar && <SubscribeModal open planKey={c.planRequerido} onClose={() => setComprar(false)} />}
    </div>
  );
}

export function Practica({ ctx }: { ctx: Contexto }) {
  const { lesson } = ctx;
  return (
    <div className={cx('practice-wrap')} id="study-content" role="tabpanel" aria-labelledby="practice-tab">
      <div className={cx('practice-inner')}>
        <div className={cx('practice-head')}>
          <div><h1>Aprende practicando</h1><p>{lesson.title}</p></div>
        </div>
        <div className={cx('sim-setup')}>
          <Icono n="quiz" />
          <h2>La práctica llega pronto</h2>
          <p>Aquí vas a encontrar el banqueo y las preguntas de esta clase. Mientras tanto, sigue con el resumen y marca lo que vayas estudiando.</p>
        </div>
      </div>
    </div>
  );
}
