'use client';
import { cx, Icono } from './Icono';
import { leccionesDe, todasLasLecciones, type Contexto, type Ruta } from './EspacioEstudio';
import type { CursoMuestra, LabMuestra } from '@/lib/estudio/muestra';

const RUTAS: Ruta[] = ['UPCH', 'Ciencias básicas', 'ENCIB'];

export default function Progreso({ ctx, cursos, labs }: { ctx: Contexto; cursos: CursoMuestra[]; labs: LabMuestra[] }) {
  const { st, set, course, lesson: resume, openLesson, openPracticeLesson, toggleCompleted, abrirLab } = ctx;
  const planned = cursos.find((c) => c.id === st.planCourseId) || course;
  const list = leccionesDe(planned);
  const completed = list.filter((l) => st.completed.has(l.id));
  const answered = list.filter((l) => st.answers[l.id]);
  const wrong = answered.filter((l) => st.answers[l.id].selected !== l.question.correct);
  const correct = answered.length - wrong.length;
  const next = list.find((l) => !st.completed.has(l.id)) || list[0];
  const recommendedLab = labs.find((l) => l.id === next.relatedLab);
  const saved = todasLasLecciones().filter((l) => st.saved.has(l.id));
  const percent = Math.round((completed.length / list.length) * 100);

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
              <p>{course.name} <span>·</span> {resume.minutes || 8} min de lectura</p>
              <button className={cx('button')} onClick={() => openLesson(resume.id, course.id)}>Continuar mi clase <Icono n="arrow" /></button>
            </div>
            <div className={cx('continue-art')} aria-hidden="true"><Icono n="book" /></div>
          </section>
          <section className={cx('plan-settings')} aria-labelledby="plan-heading">
            <h2 id="plan-heading">Organiza tu ruta</h2>
            <label>Ruta<select aria-label="Ruta de estudio en progreso" value={st.route} onChange={(e) => set(() => ({ route: e.target.value as Ruta }))}>{RUTAS.map((r) => <option key={r}>{r}</option>)}</select></label>
            <label>Curso<select aria-label="Curso de la ruta de estudio" value={planned.id} onChange={(e) => set(() => ({ planCourseId: e.target.value }))}>{cursos.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          </section>
        </div>
        <div className={cx('route-stats')} aria-label="Resumen del curso">
          <div><Icono n="circleCheck" /><span><strong>{completed.length}<small> / {list.length}</small></strong><span>Clases estudiadas</span></span></div>
          <div><Icono n="reset" /><span><strong>{wrong.length}</strong><span>Clases para repasar</span></span></div>
          <div><Icono n="target" /><span><strong>{answered.length ? <>{correct}<small> / {answered.length}</small></> : '—'}</strong><span>{answered.length ? 'Aciertos en la práctica' : 'Sin práctica todavía'}</span></span></div>
        </div>
        <div className={cx('route-layout')}>
          <section className={cx('route-panel')} aria-labelledby="route-heading">
            <div className={cx('panel-heading')}>
              <div><div className={cx('eyebrow')}>{st.route === 'UPCH' ? 'SEGÚN TU SÍLABO' : st.route === 'ENCIB' ? 'PREPARACIÓN ENCIB' : 'ESTUDIO POR TEMAS'}</div><h2 id="route-heading">{planned.name}</h2></div>
              <span className={cx('route-percent')}>{percent}%</span>
            </div>
            <div className={cx('route-meter')} role="progressbar" aria-label="Clases marcadas como estudiadas" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={list.length}><span style={{ width: `${percent}%` }} /></div>
            <p className={cx('route-explainer')}>Marca las clases que hayas estudiado. Abrir un resumen no lo completa automáticamente.</p>
            {planned.groups.map((g, i) => (
              <section key={g.id} className={cx('route-module')}>
                <div className={cx('route-module-title')}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{g.title.replace(/^\d+\s*·\s*/, '')}</h3>
                  <small>{g.lessons.filter((l) => st.completed.has(l.id)).length}/{g.lessons.length}</small>
                </div>
                {g.lessons.map((l) => {
                  const hecha = st.completed.has(l.id);
                  return (
                    <div key={l.id} className={cx('route-lesson', hecha && 'is-complete', l.id === next.id && 'is-next')}>
                      <label className={cx('route-check')}><input id={`route-complete-${l.id}`} type="checkbox" aria-label={`Marcar ${l.title} como estudiada`} checked={hecha} onChange={() => toggleCompleted(l.id)} /></label>
                      <button onClick={() => openLesson(l.id, planned.id)}><span>{l.title}</span><small>{l.minutes || 8} min {hecha ? '· Estudiada' : l.id === next.id ? '· Siguiente paso' : ''}</small></button>
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
              <button className={cx('session-step')} onClick={() => openLesson(next.id, planned.id)}><span>1</span><span><strong>Leer el resumen</strong><small>{next.title}</small></span><Icono n="arrow" /></button>
              <button className={cx('session-step')} onClick={() => openPracticeLesson(next.id, planned.id)}><span>2</span><span><strong>Ponerlo en práctica</strong><small>Preguntas de esta clase</small></span><Icono n="arrow" /></button>
              {recommendedLab && <button className={cx('session-step')} onClick={() => abrirLab(recommendedLab.id)}><span>3</span><span><strong>Explorar el recurso</strong><small>{recommendedLab.title}</small></span><Icono n="arrow" /></button>}
            </section>
            <section className={cx('review-panel')}>
              <div className={cx('panel-heading')}><h2>Para repasar</h2><span className={cx('count-pill')}>{wrong.length}</span></div>
              {wrong.length ? wrong.map((l) => (
                <button key={l.id} className={cx('review-link')} onClick={() => openPracticeLesson(l.id, planned.id)}><Icono n="reset" /><span>{l.title}<small>Revisar la respuesta y su explicación</small></span><Icono n="arrow" /></button>
              )) : (
                <div className={cx('quiet-empty')}>
                  <Icono n="circleCheck" />
                  <p>Aquí aparecerán las clases con respuestas por revisar.</p>
                  <button className={cx('text-button')} onClick={() => openPracticeLesson(next.id, planned.id)}>Practicar una clase <Icono n="arrow" /></button>
                </div>
              )}
            </section>
            <section className={cx('saved-panel')}>
              <div className={cx('panel-heading')}><h2>Mis guardados</h2><Icono n="bookmark" /></div>
              {saved.length ? saved.map((l) => (
                <button key={l.id} className={cx('saved-link')} onClick={() => openLesson(l.id, l.course.id)}><Icono n="document" /><span>{l.title}<small>{l.course.name}</small></span><Icono n="arrow" /></button>
              )) : <p className={cx('quiet-empty')}>Usa el marcador de un resumen para tenerlo a mano aquí.</p>}
            </section>
          </div>
        </div>
        <p className={cx('studio-demo')}><Icono n="info" />Vista de interfaz · Las marcas y las respuestas pertenecen a esta sesión de prueba y se reinician al recargar.</p>
      </div>
    </main>
  );
}
