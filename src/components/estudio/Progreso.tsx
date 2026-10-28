'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cx, Icono } from './Icono';
import type { Contexto } from './EspacioEstudio';
import { RUTAS, opcionRuta, useCambiarRuta, type Ruta } from './ruta';
import AsistentePlan from './plan/AsistentePlan';
import { CabeceraPlan, CalendarioPlan, InvitarPlan } from './plan/PanelPlan';
import { fechaLarga } from './plan/formato';
import type { Tarea } from '@/lib/estudio/planificador';

/**
 * Mi progreso: el plan de estudio del curso (si el curso lo ofrece), las cifras
 * reales de sus banqueos y el sílabo con las marcas de lo estudiado.
 */
export default function Progreso({ ctx }: { ctx: Contexto }) {
  const { st, marcas, cursos, rutas, course: planned, lessons: list, lesson: resume, openLesson, cambiarCurso, set, toast, plan: p, abrirTarea } = ctx;
  const cambiarRuta = useCambiarRuta({ actual: st.route, rutas, toast });
  const [asistente, setAsistente] = useState(false);
  const encib = planned.ruta === 'encib';
  const porTemas = planned.ruta !== 'upch';
  const unidad = porTemas ? 'Temas' : 'Clases';
  const completed = list.filter((l) => marcas.completed.has(l.id));
  const next = list.find((l) => !marcas.completed.has(l.id)) || list[0];
  const saved = Object.entries(marcas.saved);
  const percent = Math.round((completed.length / list.length) * 100);
  const practicar = (id: string) => { openLesson(id); set(() => ({ tab: 'practice' })); };
  const router = useRouter();

  const conPlan = !!(p.plan && p.resultado && p.indice);
  // Cifras reales de la práctica del curso (servidor + este navegador).
  const banqueos = p.intentos.length;
  const recientes = p.intentos.slice(-10).filter((i) => i.total > 0);
  const acierto = recientes.length ? Math.round(recientes.reduce((a, i) => a + i.score / i.total, 0) / recientes.length * 100) : null;
  const marcar = (t: Tarea, hecha: boolean) => {
    p.marcar(t.id, hecha);
    if (hecha) toast('Tarea hecha. El plan se reacomoda solo.');
  };

  return (
    <main className={cx('page-scroll studio-page')}>
      <div className={cx('studio-shell progress-studio')}>
        <div className={cx('studio-heading')}>
          <div>
            <div className={cx('eyebrow')}>MI PROGRESO</div>
            <h1>{conPlan ? 'Tu plan de estudio' : 'Tu ruta de estudio'}</h1>
            <p>{conPlan ? 'Lo que toca cada día hasta tu examen, con tus resúmenes y tus banqueos.' : 'Retoma tu clase, organiza el curso y decide qué repasar.'}</p>
          </div>
          {conPlan
            ? <button className={cx('session-badge')} onClick={() => setAsistente(true)}><Icono n="target" />Editar mi plan</button>
            : <span className={cx('session-badge')}><Icono n="clock" />Tu sesión de estudio</span>}
        </div>
        <div className={cx('progress-overview')}>
          {conPlan ? (
            <CabeceraPlan p={p} onEditar={() => setAsistente(true)} onEmpezar={abrirTarea} />
          ) : (
            <section className={cx('continue-card')} aria-labelledby="continue-heading">
              <div className={cx('continue-copy')}>
                <div className={cx('eyebrow')}>CONTINÚA DONDE TE QUEDASTE</div>
                <h2 id="continue-heading">{resume.title}</h2>
                <p>{planned.name} <span>·</span> {resume.tipo}</p>
                <button className={cx('button')} onClick={() => openLesson(resume.id)}>Continuar mi clase <Icono n="arrow" /></button>
              </div>
              <div className={cx('continue-art')} aria-hidden="true"><Icono n="book" /></div>
            </section>
          )}
          <section className={cx('plan-settings')} aria-labelledby="plan-heading">
            <h2 id="plan-heading">Organiza tu ruta</h2>
            <label>Ruta<select aria-label="Ruta de estudio en progreso" value={st.route} onChange={(e) => cambiarRuta(e.target.value as Ruta)}>
              {RUTAS.map((r) => { const o = opcionRuta(r, rutas); return <option key={r} value={r} disabled={!!o.etiqueta}>{o.etiqueta ? `${r} · ${o.etiqueta}` : r}</option>; })}
            </select></label>
            <label>Curso<select aria-label="Curso de la ruta de estudio" value={planned.id} onChange={(e) => cambiarCurso(e.target.value, 'progress')}>{cursos.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          </section>
        </div>
        <div className={cx('route-stats plan-stats')} aria-label="Resumen del curso">
          <div><Icono n="circleCheck" /><span><strong>{completed.length}<small> / {list.length}</small></strong><span>{unidad} estudiad{porTemas ? 'os' : 'as'}</span></span></div>
          <div><Icono n="quiz" /><span><strong>{banqueos}</strong><span>{banqueos === 1 ? 'Banqueo hecho' : 'Banqueos hechos'}</span></span></div>
          <div><Icono n="target" /><span><strong>{acierto === null ? '—' : `${acierto} %`}</strong><span>{acierto === null ? 'Sin práctica todavía' : 'Acierto reciente'}</span></span></div>
          <div><Icono n="reset" /><span><strong>{p.flojos.length}</strong><span>Temas para repasar</span></span></div>
        </div>
        <div className={cx('route-layout')}>
          <div className={cx('route-main')}>
            {conPlan && <CalendarioPlan p={p} onAbrir={abrirTarea} onMarcar={marcar} onBorrar={() => { void p.borrar(); toast('Plan borrado'); }} />}
            <section className={cx('route-panel')} aria-labelledby="route-heading">
              <div className={cx('panel-heading')}>
                <div><div className={cx('eyebrow')}>{encib ? 'SEGÚN EL TEMARIO ENCIB 2026' : porTemas ? 'SEGÚN EL TEMARIO UNIVERSAL' : 'SEGÚN TU SÍLABO'}</div><h2 id="route-heading">{planned.name}</h2></div>
                <span className={cx('route-percent')}>{percent}%</span>
              </div>
              <div className={cx('route-meter')} role="progressbar" aria-label="Clases marcadas como estudiadas" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={list.length}><span style={{ width: `${percent}%` }} /></div>
              <p className={cx('route-explainer')}>Marca las clases que hayas estudiado. Abrir un resumen no lo completa automáticamente.{conPlan ? ' Marcar una clase da por leída su parte del plan.' : ''}</p>
              {planned.groups.map((g, i) => (
                <section key={g.id} className={cx('route-module')}>
                  <div className={cx('route-module-title')}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <h3>{g.title}</h3>
                    <small>{g.lessons.filter((l) => marcas.completed.has(l.id)).length}/{g.lessons.length}</small>
                  </div>
                  {g.lessons.map((l) => {
                    const hecha = marcas.completed.has(l.id);
                    const enPlan = conPlan ? p.resultado!.diaDeClase[l.id] : undefined;
                    const etiqueta = hecha ? '· Estudiada' : enPlan ? `· En tu plan: ${fechaLarga(enPlan, p.hoy).toLowerCase()}` : !conPlan && l.id === next.id ? '· Siguiente paso' : '';
                    return (
                      <div key={l.id} className={cx('route-lesson', hecha && 'is-complete', !conPlan && l.id === next.id && 'is-next')}>
                        <label className={cx('route-check')}><input id={`route-complete-${l.id}`} type="checkbox" aria-label={`Marcar ${l.title} como estudiada`} checked={hecha} onChange={() => marcas.alternarEstudiada(l.id)} /></label>
                        <button onClick={() => openLesson(l.id)}><span>{l.title}</span><small>{l.tipo} {etiqueta}</small></button>
                        <Icono n={hecha ? 'check' : 'arrow'} />
                      </div>
                    );
                  })}
                </section>
              ))}
            </section>
          </div>
          <div className={cx('route-side')}>
            {!conPlan && !porTemas && <InvitarPlan p={p} onCrear={() => setAsistente(true)} />}
            {!conPlan && (
              <section className={cx('session-panel')}>
                <div className={cx('panel-heading')}><div><div className={cx('eyebrow')}>UN PASO A LA VEZ</div><h2>Sesión sugerida</h2></div><Icono n="target" /></div>
                <p>{completed.length === list.length ? 'Ya recorriste el curso. Elige una clase para repasar.' : 'Parte de tu siguiente clase sin marcar.'}</p>
                <button className={cx('session-step')} onClick={() => openLesson(next.id)}><span>1</span><span><strong>Leer el resumen</strong><small>{next.title}</small></span><Icono n="arrow" /></button>
                <button className={cx('session-step')} onClick={() => practicar(next.id)}><span>2</span><span><strong>Ponerlo en práctica</strong><small>Preguntas de esta clase</small></span><Icono n="arrow" /></button>
                {next.laboratorio && <button className={cx('session-step')} onClick={() => router.push(next.laboratorio!.href)}><span>3</span><span><strong>Explorar el recurso</strong><small>{next.laboratorio.titulo}</small></span><Icono n="arrow" /></button>}
              </section>
            )}
            <section className={cx('review-panel')}>
              <div className={cx('panel-heading')}><h2>Para repasar</h2><span className={cx('count-pill')}>{p.flojos.length}</span></div>
              {p.flojos.length ? p.flojos.slice(0, 6).map((t) => (
                <button key={t.id} className={cx('review-link')} onClick={() => t.claseId && openLesson(t.claseId)} disabled={!t.claseId}>
                  <Icono n="reset" />
                  <span>{t.label}<small>Último resultado: {t.ok}/{t.total} ({t.pct} %)</small></span>
                  <Icono n="arrow" />
                </button>
              )) : (
                <div className={cx('quiet-empty')}>
                  <Icono n="circleCheck" />
                  <p>{banqueos ? 'Ningún tema flojo en tus últimos banqueos. ¡Bien!' : 'Aquí aparecerán los temas que fallas en los banqueos.'}</p>
                </div>
              )}
            </section>
            <section className={cx('saved-panel')}>
              <div className={cx('panel-heading')}><h2>Mis guardados</h2><Icono n="bookmark" /></div>
              {saved.length ? saved.map(([id, s]) => (
                <button key={id} className={cx('saved-link')} onClick={() => (s.curso === planned.id && (s.ruta ?? 'upch') === planned.ruta ? openLesson(id) : (location.href = `/estudio/${s.ruta ?? 'upch'}/${s.curso}/${id}`))}>
                  <Icono n="document" /><span>{s.title}<small>{s.cursoNombre}</small></span><Icono n="arrow" />
                </button>
              )) : <p className={cx('quiet-empty')}>Usa el marcador de un resumen para tenerlo a mano aquí.</p>}
            </section>
          </div>
        </div>
        <p className={cx('studio-demo')}><Icono n="info" />{conPlan ? 'Tu plan y tus banqueos se guardan en tu cuenta; las clases marcadas, en este navegador por ahora.' : 'Tus marcas se guardan en este navegador por ahora.'}</p>
      </div>

      {asistente && p.indice && (
        <AsistentePlan
          indice={p.indice}
          cursoNombre={planned.name}
          hoy={p.hoy}
          estudiadas={marcas.completed}
          intentos={p.intentos}
          inicial={p.plan}
          onGuardar={async (nuevo) => {
            const ok = await p.guardar(nuevo);
            if (ok) toast(p.plan ? 'Plan actualizado' : 'Tu plan está listo');
            return ok;
          }}
          onCerrar={() => setAsistente(false)}
        />
      )}
    </main>
  );
}
