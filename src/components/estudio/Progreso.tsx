'use client';
import { cx, Icono } from './Icono';
import type { Contexto, Ruta } from './EspacioEstudio';

const RUTAS: Ruta[] = ['UPCH', 'Ciencias básicas', 'ENCIB'];

/** Mi progreso con el curso abierto. Las preguntas todavía no cuentan: la práctica llega después. */
export default function Progreso({ ctx }: { ctx: Contexto }) {
  const { st, marcas, cursos, course: planned, lessons: list, lesson: resume, openLesson, cambiarCurso, set } = ctx;
  const completed = list.filter((l) => marcas.completed.has(l.id));
  const next = list.find((l) => !marcas.completed.has(l.id)) || list[0];
  const saved = Object.entries(marcas.saved);
  const percent = Math.round((completed.length / list.length) * 100);
  const practicar = (id: string) => { openLesson(id); set(() => ({ tab: 'practice' })); };

  return (
    <main className={cx('page-scroll studio-page')}>
      <div className={cx('studio-shell progress-studio')}>
        <div className={cx('studio-heading')}>
          <div><div className={cx('eyebrow')}>MI PROGRESO</div><h1>Tu ruta de estudio</h1><p>Retoma tu clase, organiza el curso y decide qué repasar.</p></div>
          <span className={cx('session-badge')}><Icono n="clock" />Tu sesión de estudio</span>
        </div>
        <div className={cx('progress-overview')}>
          <section className={cx('continue-card')} aria-labelledby="continue-heading">
            <div className={cx('continue-copy')}>
              <div className={cx('eyebrow')}>CONTINÚA DONDE TE QUEDASTE</div>
              <h2 id="continue-heading">{resume.title}</h2>
              <p>{planned.name} <span>·</span> {resume.tipo}</p>
              <button className={cx('button')} onClick={() => openLesson(resume.id)}>Continuar mi clase <Icono n="arrow" /></button>
            </div>
            <div className={cx('continue-art')} aria-hidden="true"><Icono n="book" /></div>
          </section>
          <section className={cx('plan-settings')} aria-labelledby="plan-heading">
            <h2 id="plan-heading">Organiza tu ruta</h2>
            <label>Ruta<select aria-label="Ruta de estudio en progreso" value={st.route} onChange={() => {}}>{RUTAS.map((r) => <option key={r} disabled={r !== 'UPCH'}>{r}</option>)}</select></label>
            <label>Curso<select aria-label="Curso de la ruta de estudio" value={planned.id} onChange={(e) => cambiarCurso(e.target.value, 'progress')}>{cursos.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          </section>
        </div>
        <div className={cx('route-stats')} aria-label="Resumen del curso">
          <div><Icono n="circleCheck" /><span><strong>{completed.length}<small> / {list.length}</small></strong><span>Clases estudiadas</span></span></div>
          <div><Icono n="reset" /><span><strong>0</strong><span>Clases para repasar</span></span></div>
          <div><Icono n="target" /><span><strong>—</strong><span>Sin práctica todavía</span></span></div>
        </div>
        <div className={cx('route-layout')}>
          <section className={cx('route-panel')} aria-labelledby="route-heading">
            <div className={cx('panel-heading')}>
              <div><div className={cx('eyebrow')}>SEGÚN TU SÍLABO</div><h2 id="route-heading">{planned.name}</h2></div>
              <span className={cx('route-percent')}>{percent}%</span>
            </div>
            <div className={cx('route-meter')} role="progressbar" aria-label="Clases marcadas como estudiadas" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={list.length}><span style={{ width: `${percent}%` }} /></div>
            <p className={cx('route-explainer')}>Marca las clases que hayas estudiado. Abrir un resumen no lo completa automáticamente.</p>
            {planned.groups.map((g, i) => (
              <section key={g.id} className={cx('route-module')}>
                <div className={cx('route-module-title')}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{g.title}</h3>
                  <small>{g.lessons.filter((l) => marcas.completed.has(l.id)).length}/{g.lessons.length}</small>
                </div>
                {g.lessons.map((l) => {
                  const hecha = marcas.completed.has(l.id);
                  return (
                    <div key={l.id} className={cx('route-lesson', hecha && 'is-complete', l.id === next.id && 'is-next')}>
                      <label className={cx('route-check')}><input id={`route-complete-${l.id}`} type="checkbox" aria-label={`Marcar ${l.title} como estudiada`} checked={hecha} onChange={() => marcas.alternarEstudiada(l.id)} /></label>
                      <button onClick={() => openLesson(l.id)}><span>{l.title}</span><small>{l.tipo} {hecha ? '· Estudiada' : l.id === next.id ? '· Siguiente paso' : ''}</small></button>
                      <Icono n={hecha ? 'check' : 'arrow'} />
                    </div>
                  );
                })}
              </section>
            ))}
          </section>
          <div className={cx('route-side')}>
            <section className={cx('session-panel')}>
              <div className={cx('panel-heading')}><div><div className={cx('eyebrow')}>UN PASO A LA VEZ</div><h2>Sesión sugerida</h2></div><Icono n="target" /></div>
              <p>{completed.length === list.length ? 'Ya recorriste el curso. Elige una clase para repasar.' : 'Parte de tu siguiente clase sin marcar.'}</p>
              <button className={cx('session-step')} onClick={() => openLesson(next.id)}><span>1</span><span><strong>Leer el resumen</strong><small>{next.title}</small></span><Icono n="arrow" /></button>
              <button className={cx('session-step')} onClick={() => practicar(next.id)}><span>2</span><span><strong>Ponerlo en práctica</strong><small>Preguntas de esta clase</small></span><Icono n="arrow" /></button>
            </section>
            <section className={cx('review-panel')}>
              <div className={cx('panel-heading')}><h2>Para repasar</h2><span className={cx('count-pill')}>0</span></div>
              <div className={cx('quiet-empty')}>
                <Icono n="circleCheck" />
                <p>Aquí aparecerán las clases con respuestas por revisar.</p>
              </div>
            </section>
            <section className={cx('saved-panel')}>
              <div className={cx('panel-heading')}><h2>Mis guardados</h2><Icono n="bookmark" /></div>
              {saved.length ? saved.map(([id, s]) => (
                <button key={id} className={cx('saved-link')} onClick={() => (s.curso === planned.id ? openLesson(id) : (location.href = `/estudio/upch/${s.curso}/${id}`))}>
                  <Icono n="document" /><span>{s.title}<small>{s.cursoNombre}</small></span><Icono n="arrow" />
                </button>
              )) : <p className={cx('quiet-empty')}>Usa el marcador de un resumen para tenerlo a mano aquí.</p>}
            </section>
          </div>
        </div>
        <p className={cx('studio-demo')}><Icono n="info" />Tus marcas se guardan en este navegador por ahora.</p>
      </div>
    </main>
  );
}
