'use client';
import { useEffect, useState } from 'react';
import type { DiaPlan, Tarea, TipoTarea } from '@/lib/estudio/planificador';
import { cx, Icono, type NombreIcono } from '../Icono';
import { duracion, fechaLarga } from './formato';
import type { PlanEstudio } from './usePlanEstudio';

/** Las piezas del plan en «Mi progreso». El cálculo vive en `usePlanEstudio`. */

const ICONO: Record<TipoTarea, NombreIcono> = { leer: 'document', practicar: 'quiz', repasar: 'reset', simulacro: 'clock' };
const RUBRO: Record<TipoTarea, string> = { leer: 'Lectura', practicar: 'Práctica', repasar: 'Refuerzo', simulacro: 'Simulacro' };

/** Lectura y refuerzo se marcan a mano; la práctica se marca sola al terminar el banqueo. */
const seMarcaAMano = (t: Tarea) => t.tipo === 'leer' || t.tipo === 'repasar';

export function FilaTarea({ t, onAbrir, onMarcar, compacta = false }: {
  t: Tarea; onAbrir: (t: Tarea) => void; onMarcar: (t: Tarea, hecha: boolean) => void; compacta?: boolean;
}) {
  return (
    <div className={cx('plan-tarea', `is-${t.tipo}`, t.hecha && 'is-hecha', compacta && 'is-compacta')}>
      {seMarcaAMano(t) ? (
        <label className={cx('route-check')} title={t.hecha ? 'Desmarcar' : 'Marcar como hecha'}>
          <input type="checkbox" checked={t.hecha} onChange={() => onMarcar(t, !t.hecha)} aria-label={`Marcar «${t.titulo}» como hecha`} />
        </label>
      ) : (
        <span className={cx('plan-tarea-auto')} title="Se marca sola al terminar el banqueo"><Icono n={t.hecha ? 'circleCheck' : ICONO[t.tipo]} /></span>
      )}
      <button className={cx('plan-tarea-cuerpo')} onClick={() => onAbrir(t)}>
        <small>{RUBRO[t.tipo]} · {duracion(t.minutos)}{t.nota !== undefined ? ` · ${t.nota} %` : ''}</small>
        <span>{t.titulo}</span>
        {!compacta && <small className={cx('plan-tarea-detalle')}>{t.detalle}</small>}
      </button>
      <Icono n="arrow" />
    </div>
  );
}

/** Cabecera con la cuenta atrás y el avance. */
export function CabeceraPlan({ p, onEditar, onEmpezar }: { p: PlanEstudio; onEditar: () => void; onEmpezar: (t: Tarea) => void }) {
  const r = p.resultado!;
  const plan = p.plan!;
  const proxima = r.dias.flatMap((d) => d.tareas)[0];
  const dias = r.totales.diasRestantes;
  return (
    <section className={cx('continue-card plan-hero')} aria-labelledby="plan-hero-titulo">
      <div className={cx('continue-copy')}>
        <div className={cx('eyebrow')}>TU PLAN · {plan.nombre.toUpperCase()}</div>
        <h2 id="plan-hero-titulo">{dias === 0 ? 'Hoy es tu examen. ¡Éxitos!' : dias === 1 ? 'Tu examen es mañana' : `Faltan ${dias} días para tu examen`}</h2>
        <p>{fechaLarga(plan.fechaExamen, p.hoy)} <span>·</span> {r.totales.progreso} % del plan hecho <span>·</span> {duracion(r.totales.minutosPendientes)} por delante</p>
        <div className={cx('plan-hero-meter')} role="progressbar" aria-label="Avance del plan" aria-valuenow={r.totales.progreso} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${r.totales.progreso}%` }} /></div>
        <div className={cx('plan-hero-acciones')}>
          {proxima && <button className={cx('button')} onClick={() => onEmpezar(proxima)}>{proxima.tipo === 'leer' ? 'Empezar a leer' : 'Empezar'} <Icono n="arrow" /></button>}
          <button className={cx('plan-hero-link')} onClick={onEditar}>Editar plan</button>
        </div>
      </div>
      <div className={cx('plan-hero-anillo')} aria-hidden="true" style={{ '--avance': `${r.totales.progreso * 3.6}deg` } as React.CSSProperties}>
        <span><strong>{dias}</strong><small>{dias === 1 ? 'día' : 'días'}</small></span>
      </div>
    </section>
  );
}

/** Hoy (o el próximo día con sesión) y los días que vienen. */
export function CalendarioPlan({ p, onAbrir, onMarcar, onBorrar }: {
  p: PlanEstudio; onAbrir: (t: Tarea) => void; onMarcar: (t: Tarea, hecha: boolean) => void; onBorrar: () => void;
}) {
  const r = p.resultado!;
  const conSesion = r.dias.filter((d) => d.tareas.length);
  const [abierto, setAbierto] = useState<string | null>(null);
  const hoy = r.dias.find((d) => d.fecha === p.hoy);
  const hechasHoy = r.hechas.length;
  const primero: DiaPlan | undefined = hoy?.tareas.length ? hoy : conSesion[0];
  const resto = conSesion.filter((d) => d !== primero).slice(0, 6);

  return (
    <section className={cx('route-panel plan-calendario')} aria-labelledby="plan-hoy">
      <div className={cx('panel-heading')}>
        <div><div className={cx('eyebrow')}>{primero?.fecha === p.hoy ? 'TU SESIÓN DE HOY' : 'TU PRÓXIMA SESIÓN'}</div><h2 id="plan-hoy">{primero ? fechaLarga(primero.fecha, p.hoy) : 'Sin sesiones pendientes'}</h2></div>
        {primero && <span className={cx('route-percent')}>{duracion(primero.minutos)}</span>}
      </div>
      {primero ? (
        <div className={cx('plan-tareas')}>
          {primero.vispera && <p className={cx('plan-nota')}>Es la víspera: solo repaso ligero. Nada nuevo.</p>}
          {primero.tareas.map((t) => <FilaTarea key={t.id} t={t} onAbrir={onAbrir} onMarcar={onMarcar} />)}
        </div>
      ) : (
        <p className={cx('route-explainer')}>
          {r.dias.length ? '¡Terminaste todo lo del plan! Repasa lo que quieras o haz otro simulacro.' : 'No quedan días de estudio antes del examen con los días que elegiste.'}
        </p>
      )}

      {r.sinHueco.length > 0 && (
        <p className={cx('plan-aviso')}>
          <Icono n="info" />Con tu tiempo no entran {r.sinHueco.length} tareas ({duracion(r.sinHueco.reduce((a, t) => a + t.minutos, 0))}). {r.totales.priorizado ? 'Pusimos primero lo que más sale en los exámenes. ' : ''}Edita el plan para sumar días o minutos.
        </p>
      )}

      {resto.length > 0 && (
        <div className={cx('plan-proximos')}>
          <div className={cx('eyebrow')}>LO QUE VIENE</div>
          {resto.map((d) => (
            <div key={d.fecha} className={cx('plan-dia')}>
              <button className={cx('plan-dia-head')} aria-expanded={abierto === d.fecha} onClick={() => setAbierto((a) => (a === d.fecha ? null : d.fecha))}>
                <strong>{fechaLarga(d.fecha, p.hoy)}</strong>
                <span>{d.tareas.length} {d.tareas.length === 1 ? 'tarea' : 'tareas'} · {duracion(d.minutos)}</span>
                <Icono n={abierto === d.fecha ? 'up' : 'down'} />
              </button>
              {abierto === d.fecha
                ? <div className={cx('plan-tareas')}>{d.tareas.map((t) => <FilaTarea key={t.id} t={t} onAbrir={onAbrir} onMarcar={onMarcar} compacta />)}</div>
                : <p className={cx('plan-dia-resumen')}>{d.tareas.map((t) => t.titulo).join(' · ')}</p>}
            </div>
          ))}
        </div>
      )}

      <div className={cx('plan-pie')}>
        <span>{hechasHoy} {hechasHoy === 1 ? 'tarea hecha' : 'tareas hechas'} en total · el plan se reacomoda solo si te atrasas</span>
        <BorrarPlan onBorrar={onBorrar} />
      </div>
    </section>
  );
}

/** Sin `window.confirm` (bloquea la pestaña): el botón pide la confirmación en su propio texto. */
function BorrarPlan({ onBorrar }: { onBorrar: () => void }) {
  const [seguro, setSeguro] = useState(false);
  useEffect(() => {
    if (!seguro) return;
    const t = setTimeout(() => setSeguro(false), 5000);
    return () => clearTimeout(t);
  }, [seguro]);
  return seguro
    ? <span className={cx('plan-borrar')}>¿Borrar el plan? <button className={cx('text-button')} onClick={onBorrar}>Sí, borrar</button><button className={cx('text-button')} onClick={() => setSeguro(false)}>No</button></span>
    : <button className={cx('text-button')} onClick={() => setSeguro(true)}>Borrar plan</button>;
}

/** La invitación a armar el plan (o el aviso de que el curso aún no lo tiene). */
export function InvitarPlan({ p, onCrear }: { p: PlanEstudio; onCrear: () => void }) {
  if (p.estado === 'no-disponible' || p.estado === 'error') {
    return (
      <section className={cx('session-panel plan-invitar')}>
        <div className={cx('panel-heading')}><div><div className={cx('eyebrow')}>PLAN DE ESTUDIO</div><h2>Llega pronto a este curso</h2></div><Icono n="target" /></div>
        <p>{p.estado === 'error' ? 'No pudimos cargar tu plan. Recarga la página para intentarlo otra vez.' : 'Estamos terminando sus resúmenes y banqueos. Mientras tanto, marca las clases que vayas estudiando.'}</p>
      </section>
    );
  }
  return (
    <section className={cx('session-panel plan-invitar')}>
      <div className={cx('panel-heading')}><div><div className={cx('eyebrow')}>PLAN DE ESTUDIO</div><h2>¿Cuándo es tu examen?</h2></div><Icono n="target" /></div>
      <p>Dinos la fecha, qué entra y cuánto tiempo tienes, y te armamos una rutina diaria de resúmenes y banqueos que se reacomoda sola.</p>
      <button className={cx('button')} onClick={onCrear} disabled={p.estado === 'cargando'}>{p.estado === 'cargando' ? 'Cargando…' : 'Armar mi plan'} <Icono n="arrow" /></button>
    </section>
  );
}
