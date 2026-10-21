'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx, Icono } from './Icono';
import { DiagramaResumen } from './Graficos';
import type { Contexto } from './EspacioEstudio';

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
            history.replaceState(null, '', url);
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
  const { st, set, course: c, lesson: l, group: g, lessons: list, relatedLab: lab, openLesson, toggleCompleted, abrirLab, toast, posiciones, setBarraOculta } = ctx;
  const s = l.summary;
  const index = list.findIndex((a) => a.id === l.id);
  const scroller = useRef<HTMLDivElement>(null);
  const [tocActivo, setTocActivo] = useState('section-objectives');
  const guardada = st.saved.has(l.id);
  const estudiada = st.completed.has(l.id);

  // Cada clase recuerda dónde se quedó la lectura (el prototipo lo restauraba en cada render).
  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: posiciones.current[l.id] || 0, behavior: 'instant' });
    setTocActivo('section-objectives');
  }, [l.id, posiciones]);

  // La barra del lector se contrae al bajar 40 px pasados los 120 y vuelve al subir 12.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let last = el.scrollTop, direction = 0, travel = 0, settlingUntil = 0, oculta = false;
    const alDesplazar = () => {
      const y = Math.max(0, el.scrollTop), delta = y - last; last = y;
      posiciones.current[l.id] = el.scrollTop;
      if (performance.now() < settlingUntil || !delta) return;
      const area = el.closest('section');
      const bar = area?.querySelector('[role="tablist"]')?.parentElement;
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
    set((p) => { const saved = new Set(p.saved); if (saved.has(l.id)) saved.delete(l.id); else saved.add(l.id); return { saved }; });
    toast(guardada ? 'Clase quitada de guardados' : 'Clase guardada en Mi progreso');
  };
  const toc = [
    ['section-objectives', 'Antes de empezar'],
    ['section-map', 'Conecta las ideas'],
    ...s.sections.map((sec) => [`section-${sec.id}`, sec.title]),
    ['section-keys', 'Ideas clave'],
  ];

  return (
    <div className={cx('reading-layout')} id="study-content" role="tabpanel" aria-labelledby="summary-tab">
      <div className={cx('article-scroller')} id="article-scroller" ref={scroller} tabIndex={0} aria-label="Contenido del resumen" data-reading-lesson={l.id}>
        <article className={cx('article')}>
          <div className={cx('article-topline')}>
            <div className={cx('breadcrumb')}>{c.name}<span>/</span><span>{st.route === 'UPCH' ? g.title : 'Temario'}</span></div>
            <div className={cx('article-controls')}>
              <button className={cx('icon-button')} aria-label="Reducir tamaño de letra" onClick={() => set((p) => ({ fontSize: Math.max(14, p.fontSize - 1) }))}>A−</button>
              <button className={cx('icon-button')} aria-label="Aumentar tamaño de letra" onClick={() => set((p) => ({ fontSize: Math.min(21, p.fontSize + 1) }))}>A+</button>
              <button className={cx('icon-button', guardada && 'saved')} aria-label={guardada ? 'Quitar de guardados' : 'Guardar clase'} title="Guardar clase" onClick={guardar}>
                <Icono n="bookmark" />
              </button>
            </div>
          </div>
          <h1>{l.title}</h1>
          <div className={cx('article-meta')}>
            <span><Icono n="clock" />{l.minutes || 8} min de lectura</span>
            <span><Icono n="document" />Resumen de clase</span>
            <span className={cx('material-chip')}>Muestra</span>
          </div>
          <p className={cx('article-intro')}>{s.intro}</p>
          <section id="section-objectives">
            <div className={cx('section-heading')}><span>01</span><h2>Antes de empezar</h2></div>
            <ul className={cx('objectives')}>{s.objectives.map((o) => <li key={o}><Icono n="circleCheck" /><span>{o}</span></li>)}</ul>
          </section>
          <section id="section-map">
            <div className={cx('section-heading')}><span>02</span><h2>Conecta las ideas</h2></div>
            <div className={cx('diagram-card')}>
              <div className={cx('diagram-caption')}><span>Una mirada al tema</span><Icono n="layers" /></div>
              <DiagramaResumen c={c} l={l} />
              <div className={cx('diagram-note')}><Icono n="info" />Esquema conceptual de ejemplo</div>
            </div>
          </section>
          {s.sections.map((section, i) => (
            <section key={section.id} className={cx('article-section')} id={`section-${section.id}`}>
              <div className={cx('section-heading')}><span>{String(i + 3).padStart(2, '0')}</span><h2>{section.title}</h2></div>
              <p>{section.body}</p>
              {section.bullets && <ul>{section.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
            </section>
          ))}
          <section id="section-keys" className={cx('key-card')}>
            <div className={cx('key-card-title')}><Icono n="bulb" />Qué llevarte de esta clase</div>
            <ul>{s.keyPoints.map((k) => <li key={k}>{k}</li>)}</ul>
          </section>
          <div className={cx('completion-row')}>
            <span>¿Terminaste de estudiar esta clase?</span>
            <button className={cx('lesson-complete', estudiada && 'is-complete')} aria-pressed={estudiada} onClick={() => toggleCompleted(l.id)}>
              <Icono n={estudiada ? 'circleCheck' : 'check'} />{estudiada ? 'Marcada como estudiada' : 'Marcar como estudiada'}
            </button>
          </div>
          <footer className={cx('lesson-footer')}>
            {index > 0 ? <button onClick={() => openLesson(list[index - 1].id)}><Icono n="arrowLeft" /><span>{list[index - 1].title}</span></button> : <span />}
            {index < list.length - 1 ? <button className={cx('next')} onClick={() => openLesson(list[index + 1].id)}><span>{list[index + 1].title}</span><Icono n="arrow" /></button> : <span />}
          </footer>
        </article>
      </div>
      <aside className={cx('reading-aside')} aria-label="Índice y recursos relacionados">
        <div className={cx('eyebrow')}>En esta clase</div>
        <nav className={cx('toc')} aria-label="Índice del resumen">
          {toc.map(([id, titulo]) => <button key={id} className={cx(tocActivo === id && 'active')} onClick={() => irASeccion(id)}>{titulo}</button>)}
        </nav>
        {lab && (
          <>
            <div className={cx('aside-divider')} />
            <div className={cx('eyebrow')}>Llévalo a la práctica</div>
            <div className={cx('related-card')}>
              <div className={cx('related-art')}>
                <span className={cx('related-tag')}>{lab.category}</span>
                {lab.kind === 'heart'
                  ? <img src="/assets/estudio/heart-anatomy.webp" alt="Modelo ilustrativo del corazón" />
                  : <Icono n={lab.kind === 'brain' ? 'brain' : lab.kind === 'nephron' ? 'flask' : 'cube'} />}
              </div>
              <div className={cx('related-card-body')}>
                <h3>{lab.title}</h3>
                <p>Explora este recurso sin perder tu clase.</p>
                <button onClick={() => abrirLab(lab.id)}>Explorar recurso <Icono n="arrow" /></button>
              </div>
            </div>
          </>
        )}
        <p className={cx('aside-note')}>Este espacio recuerda tu clase mientras exploras. Elige otro tema en el temario para seguir estudiando.</p>
      </aside>
    </div>
  );
}

const letra = (i: number) => String.fromCharCode(65 + i);
const formatTime = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

function Entrenamiento({ ctx }: { ctx: Contexto }) {
  const { st, set, lesson: l } = ctx;
  const entry = st.answers[l.id];
  const q = l.question;
  return (
    <>
      <div className={cx('quiz-card')}>
        <div className={cx('quiz-card-top')}><span className={cx('eyebrow')}>Pregunta de la clase</span><span><Icono n="target" /></span></div>
        <h2 className={cx('question')}>{q.prompt}</h2>
        <div className={cx('answer-list')}>
          {q.options.map((o, i) => (
            <button key={o} className={cx('answer-option', entry && (i === q.correct ? 'correct' : i === entry.selected ? 'wrong' : ''))} disabled={!!entry}
              onClick={() => set((p) => ({ answers: { ...p.answers, [l.id]: { selected: i } } }))}>
              <span className={cx('answer-letter')}>{letra(i)}</span><span>{o}</span>{entry && i === q.correct && <Icono n="check" />}
            </button>
          ))}
        </div>
        {entry && (
          <div className={cx('feedback')} tabIndex={-1}>
            <h3>{entry.selected === q.correct ? 'Bien conectado.' : 'Vamos a repasar la idea.'}</h3>
            <p>{q.explanation}</p>
          </div>
        )}
        <div className={cx('quiz-footer')}>
          <span>Una pregunta de ejemplo · A tu ritmo</span>
          {entry
            ? <button className={cx('button secondary')} onClick={() => set((p) => { const answers = { ...p.answers }; delete answers[l.id]; return { answers }; })}><Icono n="reset" />Volver a practicar</button>
            : <span>Selecciona una respuesta</span>}
        </div>
      </div>
      <p className={cx('quiz-footnote')}>Práctica ilustrativa. Las respuestas y el avance sólo viven en esta demostración.</p>
    </>
  );
}

function Simulacro({ ctx }: { ctx: Contexto }) {
  const { st, set, course, lessons, ahora } = ctx;
  const sim = st.sim;
  if (sim?.finished) {
    const score = sim.questions.reduce((n, q, i) => n + (sim.answers[i] === q.correct ? 1 : 0), 0);
    return (
      <div className={cx('quiz-card result-card')}>
        <div className={cx('score-circle')}>{score}/{sim.questions.length}</div>
        <h2>Una pausa para ver tu avance</h2>
        <p>Completaste este simulacro de muestra.<br />Vuelve al resumen para reforzar las ideas que necesites.</p>
        <button className={cx('button')} onClick={() => set((p) => { const simulations = { ...p.simulations }; delete simulations[p.courseId]; return { simulations, sim: null }; })}>
          Volver a configurar <Icono n="arrow" />
        </button>
      </div>
    );
  }
  if (sim?.running) {
    const q = sim.questions[sim.index];
    const a = sim.answers[sim.index];
    const ultima = sim.index === sim.questions.length - 1;
    return (
      <>
        <div className={cx('quiz-card')}>
          <div className={cx('quiz-card-top')}><span className={cx('eyebrow')}>Pregunta {sim.index + 1} de {sim.questions.length}</span><span>{formatTime(sim.endsAt - ahora)}</span></div>
          <h2 className={cx('question')}>{q.prompt}</h2>
          <div className={cx('answer-list')}>
            {q.options.map((o, i) => (
              <button key={o} className={cx('answer-option', a === i && 'selected')} onClick={() => set((p) => ({ sim: p.sim && { ...p.sim, answers: { ...p.sim.answers, [p.sim.index]: i } } }))}>
                <span className={cx('answer-letter')}>{letra(i)}</span><span>{o}</span>
              </button>
            ))}
          </div>
          <div className={cx('quiz-footer')}>
            <button className={cx('text-button')} onClick={() => set((p) => ({ sim: p.sim && { ...p.sim, running: false, finished: true } }))}>Terminar ahora</button>
            <button className={cx('button')} disabled={a === undefined} onClick={() => set((p) => {
              if (!p.sim || p.sim.answers[p.sim.index] === undefined) return {};
              return { sim: p.sim.index < p.sim.questions.length - 1 ? { ...p.sim, index: p.sim.index + 1 } : { ...p.sim, running: false, finished: true } };
            })}>
              {ultima ? 'Ver resultados' : 'Siguiente'} <Icono n="arrow" />
            </button>
          </div>
        </div>
        <p className={cx('quiz-footnote')}>Puedes consultar el resumen y volver: tus selecciones se conservan durante esta sesión.</p>
      </>
    );
  }
  return (
    <div className={cx('sim-setup')}>
      <Icono n="quiz" />
      <h2>Un momento para ponerte a prueba</h2>
      <p>Practica con tiempo y recibe tus resultados al terminar. Esta muestra reúne preguntas del curso seleccionado.</p>
      <div className={cx('setup-field')}><span>Contenido</span><strong>{course.name}</strong></div>
      <div className={cx('setup-field')}><span>Preguntas</span><strong>{Math.min(5, lessons.length)} de ejemplo</strong></div>
      <div className={cx('setup-field')}><span>Tiempo disponible</span><strong>10 minutos</strong></div>
      <button className={cx('button')} onClick={() => set((p) => ({
        sim: { courseId: p.courseId, running: true, finished: false, index: 0, answers: {}, questions: lessons.slice(0, 5).map((x) => x.question), endsAt: Date.now() + 600000 },
      }))}>
        Comenzar simulacro <Icono n="arrow" />
      </button>
    </div>
  );
}

export function Practica({ ctx }: { ctx: Contexto }) {
  const { st, set, lesson } = ctx;
  return (
    <div className={cx('practice-wrap')} id="study-content" role="tabpanel" aria-labelledby="practice-tab">
      <div className={cx('practice-inner')}>
        <div className={cx('practice-head')}>
          <div><h1>Aprende practicando</h1><p>{lesson.title}</p></div>
          <div className={cx('segmented')} aria-label="Modo de práctica">
            <button className={cx(st.practiceMode === 'training' && 'active')} onClick={() => set(() => ({ practiceMode: 'training' }))}>Entrenamiento</button>
            <button className={cx(st.practiceMode === 'simulation' && 'active')} onClick={() => set(() => ({ practiceMode: 'simulation' }))}>Simulacro</button>
          </div>
        </div>
        {st.practiceMode === 'training' ? <Entrenamiento ctx={ctx} /> : <Simulacro ctx={ctx} />}
      </div>
    </div>
  );
}
