'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { IndiceCurso } from '@/lib/estudio/indice-tipos';
import {
  evaluaciones, listarUnidades, planificar, sumarDias,
  type Alcance, type Intento, type Objetivo, type Partida, type PlanGuardado,
} from '@/lib/estudio/planificador';
import { cx, Icono } from '../Icono';
import { norm } from '../texto';
import type { NuevoPlan } from './usePlanEstudio';
import { duracion, fechaLarga } from './formato';

/**
 * El asistente que arma un plan: qué estudiar → para cuándo → con cuánto tiempo
 * → desde dónde parte → para qué → vista previa. Todo con preguntas cerradas: el
 * calendario lo calcula `planificar`, que aquí corre en vivo para la vista previa.
 */

type Tipo = Alcance['tipo'];
const PASOS = ['Qué estudiar', 'Para cuándo', 'Tu tiempo', 'Desde dónde', 'Tu objetivo', 'Tu plan'] as const;
const DIAS = [['L', 1], ['M', 2], ['M', 3], ['J', 4], ['V', 5], ['S', 6], ['D', 0]] as const;
const NOMBRE_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MINUTOS = [30, 45, 60, 90, 120, 180, 240];
const PARTIDAS: [Partida, string][] = [['nueva', 'No la vi'], ['vista', 'Ya la vi'], ['domino', 'La domino']];


interface Props {
  indice: IndiceCurso;
  cursoNombre: string;
  hoy: string;
  estudiadas: Set<string>;
  intentos: Intento[];
  inicial: PlanGuardado | null;
  onGuardar: (p: NuevoPlan) => Promise<boolean>;
  onCerrar: () => void;
}

export default function AsistentePlan({ indice, cursoNombre, hoy, estudiadas, intentos, inicial, onGuardar, onCerrar }: Props) {
  const evs = useMemo(() => evaluaciones(indice), [indice]);
  const a0 = inicial?.alcance;
  const [paso, setPaso] = useState(0);
  const [tipo, setTipo] = useState<Tipo>(a0?.tipo ?? (evs.length > 1 ? 'evaluacion' : 'curso'));
  const [semana, setSemana] = useState(a0?.tipo === 'evaluacion' ? a0.semana : evs[0]?.semana ?? '');
  const [clases, setClases] = useState<Set<string>>(new Set(a0?.tipo === 'clases' ? a0.clases : []));
  const [temas, setTemas] = useState<Set<string>>(new Set(a0?.tipo === 'temas' ? a0.temas : []));
  const [bloques, setBloques] = useState<{ nombre: string; secciones: string[] }[]>(
    a0?.tipo === 'bloques' ? a0.bloques : [{ nombre: 'Bloque 1', secciones: [] }],
  );
  const [fecha, setFecha] = useState(inicial?.fechaExamen ?? '');
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [dias, setDias] = useState<number[]>(inicial?.respuestas.dias ?? [1, 2, 3, 4, 5]);
  const [minutos, setMinutos] = useState(inicial?.respuestas.minutos ?? 60);
  const [partida, setPartida] = useState<Record<string, Partida>>(inicial?.respuestas.partida ?? {});
  const [objetivo, setObjetivo] = useState<Objetivo>(inicial?.respuestas.objetivo ?? 'aprobar');
  const [guardando, setGuardando] = useState(false);
  const [fallo, setFallo] = useState(false);
  const dialogo = useRef<HTMLElement>(null);

  useEffect(() => {
    dialogo.current?.focus();
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onCerrar(); } };
    window.addEventListener('keydown', alTeclear, true);
    return () => window.removeEventListener('keydown', alTeclear, true);
  }, [onCerrar]);

  const alcance: Alcance | null = useMemo(() => {
    switch (tipo) {
      case 'curso': return { tipo };
      case 'evaluacion': return semana ? { tipo, semana } : null;
      case 'clases': return clases.size ? { tipo, clases: [...clases] } : null;
      case 'temas': return temas.size ? { tipo, temas: [...temas] } : null;
      case 'bloques': {
        const llenos = bloques.filter((b) => b.nombre.trim() && b.secciones.length);
        return llenos.length ? { tipo, bloques: llenos.map((b) => ({ ...b, nombre: b.nombre.trim() })) } : null;
      }
    }
  }, [tipo, semana, clases, temas, bloques]);

  const unidades = useMemo(() => (alcance ? listarUnidades(indice, alcance) : []), [indice, alcance]);

  // Punto de partida sugerido: lo marcado como estudiado ya se vio; un banqueo con 80 % o más, dominado.
  const sugerida = (u: { id: string; claseIds: string[] }): Partida => {
    if (u.claseIds.length !== 1 || u.id !== u.claseIds[0]) return 'nueva';
    const claves = new Set(indice.clases.find((c) => c.id === u.id)?.practica.map((p) => p.key));
    const mejor = Math.max(0, ...intentos.filter((i) => claves.has(i.key) && i.total > 0).map((i) => i.score / i.total));
    return mejor >= 0.8 ? 'domino' : estudiadas.has(u.id) ? 'vista' : 'nueva';
  };
  const partidaDe = (u: { id: string; claseIds: string[] }) => partida[u.id] ?? sugerida(u);

  const respuestas = { dias, minutos, objetivo, partida: Object.fromEntries(unidades.map((u) => [u.id, partidaDe(u)])) };
  const nombreFinal = nombre.trim() || (tipo === 'evaluacion' ? evs.find((e) => e.semana === semana)?.titulo : null) || `Plan de ${cursoNombre}`;
  const manana = sumarDias(hoy, 1);
  const fechaOk = !!fecha && fecha >= manana && fecha <= sumarDias(hoy, 365);

  const vista = useMemo(() => {
    if (paso < 5 || !alcance || !fechaOk) return null;
    return planificar(indice, { fechaExamen: fecha, alcance, respuestas }, { intentos, hechas: [], estudiadas: [...estudiadas] }, hoy);
  }, [paso, alcance, fechaOk, fecha, indice, intentos, estudiadas, hoy, JSON.stringify(respuestas)]); // eslint-disable-line react-hooks/exhaustive-deps

  const puedeSeguir = [!!alcance, fechaOk, dias.length > 0, true, true, true][paso];
  const crear = async () => {
    if (!alcance) return;
    setGuardando(true); setFallo(false);
    const ok = await onGuardar({ nombre: nombreFinal, fechaExamen: fecha, alcance, respuestas });
    setGuardando(false);
    if (ok) onCerrar(); else setFallo(true);
  };

  return (
    <div className={cx('overlay-backdrop plan-fondo')} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <section ref={dialogo} className={cx('plan-dialog')} role="dialog" aria-modal="true" aria-labelledby="plan-titulo" tabIndex={-1}>
        <header className={cx('plan-dialog-head')}>
          <div>
            <div className={cx('eyebrow')}>{inicial ? 'EDITAR TU PLAN' : 'ARMA TU PLAN'} · {cursoNombre.toUpperCase()}</div>
            <h2 id="plan-titulo">{PASOS[paso]}</h2>
          </div>
          <button className={cx('icon-button')} aria-label="Cerrar" onClick={onCerrar}><Icono n="close" /></button>
        </header>
        <ol className={cx('plan-pasos')} aria-label="Pasos">
          {PASOS.map((p, i) => (
            <li key={p} className={cx(i === paso && 'is-actual', i < paso && 'is-hecho')} aria-current={i === paso ? 'step' : undefined}>
              <span>{i < paso ? <Icono n="check" /> : i + 1}</span><small>{p}</small>
            </li>
          ))}
        </ol>

        <div className={cx('plan-dialog-body')}>
          {paso === 0 && (
            <PasoAlcance
              indice={indice} evs={evs} tipo={tipo} setTipo={setTipo} semana={semana} setSemana={setSemana}
              clases={clases} setClases={setClases} temas={temas} setTemas={setTemas} bloques={bloques} setBloques={setBloques}
            />
          )}

          {paso === 1 && (
            <div className={cx('plan-campos')}>
              <label className={cx('plan-campo')}>
                <span>¿Cuándo es tu examen?</span>
                <input type="date" min={manana} max={sumarDias(hoy, 365)} value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </label>
              <label className={cx('plan-campo')}>
                <span>Ponle un nombre <small>(opcional)</small></span>
                <input type="text" maxLength={80} placeholder={nombreFinal} value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </label>
              {fecha && !fechaOk && <p className={cx('plan-aviso')}>Elige una fecha desde mañana y dentro del próximo año.</p>}
              {fechaOk && <p className={cx('plan-nota')}>Faltan {Math.round((Date.parse(fecha) - Date.parse(hoy)) / 86_400_000)} días. El plan termina la víspera, que queda para un repaso ligero.</p>}
            </div>
          )}

          {paso === 2 && (
            <div className={cx('plan-campos')}>
              <div className={cx('plan-campo')}>
                <span>¿Qué días puedes estudiar?</span>
                <div className={cx('plan-dias')} role="group" aria-label="Días de estudio">
                  {DIAS.map(([letra, d]) => (
                    <button key={d} type="button" aria-pressed={dias.includes(d)} aria-label={NOMBRE_DIA[d]}
                      onClick={() => setDias((xs) => (xs.includes(d) ? xs.filter((x) => x !== d) : [...xs, d]))}>{letra}</button>
                  ))}
                </div>
              </div>
              <div className={cx('plan-campo')}>
                <span>¿Cuánto tiempo al día?</span>
                <div className={cx('plan-chips')} role="radiogroup" aria-label="Minutos por día">
                  {MINUTOS.map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={minutos === m} onClick={() => setMinutos(m)}>{duracion(m)}</button>
                  ))}
                </div>
              </div>
              {!dias.length && <p className={cx('plan-aviso')}>Elige al menos un día.</p>}
            </div>
          )}

          {paso === 3 && (
            <div className={cx('plan-campos')}>
              <p className={cx('plan-nota')}>Lo que ya viste se repasa más rápido y lo que dominas pasa directo a practicar. Lo propusimos según tus marcas y tus banqueos; cámbialo si no es así.</p>
              <div className={cx('plan-partidas')}>
                {unidades.map((u) => (
                  <div key={u.id} className={cx('plan-partida')}>
                    <span>{u.titulo}</span>
                    <div className={cx('plan-segmento')} role="radiogroup" aria-label={`Cómo llegas a ${u.titulo}`}>
                      {PARTIDAS.map(([v, t]) => (
                        <button key={v} type="button" role="radio" aria-checked={partidaDe(u) === v} onClick={() => setPartida((p) => ({ ...p, [u.id]: v }))}>{t}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {paso === 4 && (
            <div className={cx('plan-opciones')} role="radiogroup" aria-label="Objetivo">
              {([
                ['aprobar', 'Aprobar con seguridad', 'Una vuelta de práctica por tema, refuerzo de lo que salga flojo y dos simulacros al final.'],
                ['destacar', 'Sacar nota alta', 'Dos vueltas espaciadas de práctica, refuerzo de lo flojo y todos los simulacros que haya.'],
              ] as const).map(([v, t, d]) => (
                <label key={v} className={cx('plan-opcion', objetivo === v && 'is-elegida')}>
                  <input type="radio" name="objetivo" checked={objetivo === v} onChange={() => setObjetivo(v)} />
                  <span><strong>{t}</strong><small>{d}</small></span>
                </label>
              ))}
            </div>
          )}

          {paso === 5 && vista && (
            <div className={cx('plan-preview')}>
              <div className={cx('plan-cifras')}>
                <div><strong>{duracion(vista.totales.minutosPendientes)}</strong><span>de estudio por hacer</span></div>
                <div><strong>{duracion(vista.totales.minutosDisponibles)}</strong><span>disponibles hasta el examen</span></div>
                <div><strong>{vista.dias.filter((d) => d.tareas.length).length}</strong><span>días con sesión</span></div>
              </div>
              {vista.sinHueco.length > 0 ? (
                <p className={cx('plan-aviso')}>
                  <Icono n="info" />No alcanza el tiempo: quedan {vista.sinHueco.length} tareas ({duracion(vista.sinHueco.reduce((a, t) => a + t.minutos, 0))}) fuera.
                  {vista.totales.priorizado && ' Pusimos primero lo que más ha salido en los exámenes.'} Suma días o minutos, o acota lo que vas a estudiar.
                </p>
              ) : (
                <p className={cx('plan-nota')}><Icono n="circleCheck" />Cabe todo, con {duracion(vista.totales.minutosDisponibles - vista.totales.minutosPendientes)} de holgura.</p>
              )}
              <div className={cx('plan-primeros')}>
                <div className={cx('eyebrow')}>ASÍ EMPIEZA</div>
                {vista.dias.filter((d) => d.tareas.length).slice(0, 3).map((d) => (
                  <div key={d.fecha} className={cx('plan-primer-dia')}>
                    <strong>{fechaLarga(d.fecha, hoy)}</strong>
                    <ul>{d.tareas.map((t) => <li key={t.id}>{t.titulo} <small>· {duracion(t.minutos)}</small></li>)}</ul>
                  </div>
                ))}
              </div>
              {fallo && <p className={cx('plan-aviso')}>No se pudo guardar. Revisa tu conexión e inténtalo otra vez.</p>}
            </div>
          )}
        </div>

        <footer className={cx('plan-dialog-foot')}>
          {paso > 0 ? <button className={cx('button secondary')} onClick={() => setPaso((p) => p - 1)}><Icono n="arrowLeft" />Atrás</button> : <span />}
          {paso < 5
            ? <button className={cx('button')} disabled={!puedeSeguir} onClick={() => setPaso((p) => p + 1)}>Siguiente<Icono n="arrow" /></button>
            : <button className={cx('button')} disabled={guardando || !vista} onClick={crear}>{guardando ? 'Guardando…' : inicial ? 'Guardar cambios' : 'Crear mi plan'}<Icono n="check" /></button>}
        </footer>
      </section>
    </div>
  );
}


// ── Paso 1: qué estudiar ─────────────────────────────────────────────────────

function PasoAlcance({ indice, evs, tipo, setTipo, semana, setSemana, clases, setClases, temas, setTemas, bloques, setBloques }: {
  indice: IndiceCurso; evs: ReturnType<typeof evaluaciones>; tipo: Tipo; setTipo: (t: Tipo) => void;
  semana: string; setSemana: (s: string) => void;
  clases: Set<string>; setClases: (f: (s: Set<string>) => Set<string>) => void;
  temas: Set<string>; setTemas: (f: (s: Set<string>) => Set<string>) => void;
  bloques: { nombre: string; secciones: string[] }[]; setBloques: (f: (b: { nombre: string; secciones: string[] }[]) => { nombre: string; secciones: string[] }[]) => void;
}) {
  const alternar = (set: (f: (s: Set<string>) => Set<string>) => void, id: string) =>
    set((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const opciones: [Tipo, string, string][] = [
    ['curso', 'Todo el curso', 'Todas las clases con resumen o práctica, más los simulacros de los exámenes.'],
    ...(evs.length ? [['evaluacion', 'Una evaluación', 'Las clases que entran en un examen del sílabo.'] as [Tipo, string, string]] : []),
    ['clases', 'Algunas clases', 'Elige tú las clases.'],
    ['temas', 'Temas', 'Un tema suelto o varios, juntando lo que dicen todas las clases.'],
    ['bloques', 'Como lo divide mi universidad', 'Arma tus propios bloques con los subtítulos de los resúmenes.'],
  ];
  const conMaterial = indice.clases.filter((c) => !c.evaluacion && (c.resumenes.length || c.practica.length));

  return (
    <div className={cx('plan-campos')}>
      <div className={cx('plan-opciones')} role="radiogroup" aria-label="Qué vas a estudiar">
        {opciones.map(([v, t, d]) => (
          <label key={v} className={cx('plan-opcion', tipo === v && 'is-elegida')}>
            <input type="radio" name="alcance" checked={tipo === v} onChange={() => setTipo(v)} />
            <span><strong>{t}</strong><small>{d}</small></span>
          </label>
        ))}
      </div>

      {tipo === 'evaluacion' && (
        <label className={cx('plan-campo')}>
          <span>¿Qué evaluación?</span>
          <select value={semana} onChange={(e) => setSemana(e.target.value)}>
            {evs.map((e) => <option key={e.semana} value={e.semana}>{e.titulo}</option>)}
          </select>
        </label>
      )}

      {tipo === 'clases' && (
        <Lista titulo={`${clases.size} de ${conMaterial.length} clases`} onTodas={() => setClases(() => new Set(clases.size === conMaterial.length ? [] : conMaterial.map((c) => c.id)))} todas={clases.size === conMaterial.length}>
          {conMaterial.map((c) => (
            <label key={c.id} className={cx('plan-check')}>
              <input type="checkbox" checked={clases.has(c.id)} onChange={() => alternar(setClases, c.id)} />
              <span>{c.titulo}</span>
            </label>
          ))}
        </Lista>
      )}

      {tipo === 'temas' && <ListaTemas indice={indice} temas={temas} alternar={(id) => alternar(setTemas, id)} />}

      {tipo === 'bloques' && <Bloques indice={indice} bloques={bloques} setBloques={setBloques} />}
    </div>
  );
}

function Lista({ titulo, todas, onTodas, children }: { titulo: string; todas: boolean; onTodas: () => void; children: React.ReactNode }) {
  return (
    <div className={cx('plan-lista')}>
      <div className={cx('plan-lista-head')}><span>{titulo}</span><button type="button" className={cx('text-button')} onClick={onTodas}>{todas ? 'Quitar todas' : 'Elegir todas'}</button></div>
      <div className={cx('plan-lista-scroll')}>{children}</div>
    </div>
  );
}

function ListaTemas({ indice, temas, alternar }: { indice: IndiceCurso; temas: Set<string>; alternar: (id: string) => void }) {
  const [q, setQ] = useState('');
  const lista = Object.entries(indice.temas)
    .filter(([, t]) => !q || norm(t.label).includes(norm(q)))
    .sort((a, b) => b[1].enExamenes - a[1].enExamenes || a[1].label.localeCompare(b[1].label, 'es'));
  return (
    <div className={cx('plan-lista')}>
      <label className={cx('small-search')}><Icono n="search" /><input type="search" placeholder="Buscar un tema…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar un tema" /></label>
      <div className={cx('plan-lista-scroll')}>
        {lista.map(([id, t]) => (
          <label key={id} className={cx('plan-check')}>
            <input type="checkbox" checked={temas.has(id)} onChange={() => alternar(id)} />
            <span>{t.label}<small>{t.enExamenes ? `${t.enExamenes} preguntas en exámenes reales · ` : ''}{t.clases.length} {t.clases.length === 1 ? 'clase' : 'clases'}</small></span>
          </label>
        ))}
        {!lista.length && <p className={cx('plan-nota')}>Ningún tema con ese nombre.</p>}
      </div>
    </div>
  );
}

function Bloques({ indice, bloques, setBloques }: {
  indice: IndiceCurso; bloques: { nombre: string; secciones: string[] }[];
  setBloques: (f: (b: { nombre: string; secciones: string[] }[]) => { nombre: string; secciones: string[] }[]) => void;
}) {
  const [activo, setActivo] = useState(0);
  const [q, setQ] = useState('');
  const todas = useMemo(() => indice.clases.flatMap((c) => c.resumenes.flatMap((r) => r.secciones.map((s) => ({
    ...s, clase: c.codigo ?? c.titulo, buscar: norm(`${c.codigo ?? ''} ${c.titulo} ${s.titulo}`),
  })))), [indice]);
  const porId = useMemo(() => new Map(todas.map((s) => [s.id, s])), [todas]);
  const b = bloques[Math.min(activo, bloques.length - 1)];
  const resultados = q.trim().length >= 2 ? todas.filter((s) => s.buscar.includes(norm(q))).slice(0, 40) : [];
  const cambiar = (fn: (x: { nombre: string; secciones: string[] }) => { nombre: string; secciones: string[] }) =>
    setBloques((bs) => bs.map((x, i) => (i === activo ? fn(x) : x)));
  const alternar = (id: string) => cambiar((x) => ({ ...x, secciones: x.secciones.includes(id) ? x.secciones.filter((s) => s !== id) : [...x.secciones, id] }));
  const minutos = b.secciones.reduce((a, id) => a + (porId.get(id)?.minutos ?? 0), 0);

  return (
    <div className={cx('plan-bloques')}>
      <div className={cx('plan-bloques-tabs')} role="tablist" aria-label="Tus bloques">
        {bloques.map((x, i) => (
          <button key={i} role="tab" aria-selected={i === activo} className={cx(i === activo && 'active')} onClick={() => setActivo(i)}>
            {x.nombre || `Bloque ${i + 1}`}<small>{x.secciones.length}</small>
          </button>
        ))}
        {bloques.length < 12 && (
          <button type="button" className={cx('plan-bloque-nuevo')} onClick={() => { setBloques((bs) => [...bs, { nombre: `Bloque ${bs.length + 1}`, secciones: [] }]); setActivo(bloques.length); }}>
            + Bloque
          </button>
        )}
      </div>
      <div className={cx('plan-bloque-head')}>
        <input type="text" maxLength={40} value={b.nombre} aria-label="Nombre del bloque" onChange={(e) => cambiar((x) => ({ ...x, nombre: e.target.value }))} />
        <span>{b.secciones.length} subtítulos · {duracion(minutos)} de lectura</span>
        {bloques.length > 1 && (
          <button type="button" className={cx('text-button')} onClick={() => { setBloques((bs) => bs.filter((_, i) => i !== activo)); setActivo(0); }}>Quitar bloque</button>
        )}
      </div>
      {b.secciones.length > 0 && (
        <div className={cx('plan-elegidas')}>
          {b.secciones.map((id) => (
            <button key={id} type="button" onClick={() => alternar(id)} title="Quitar">
              {porId.get(id)?.titulo ?? id}<small>{porId.get(id)?.clase}</small><Icono n="close" />
            </button>
          ))}
        </div>
      )}
      <label className={cx('small-search')}><Icono n="search" /><input type="search" placeholder="Busca un subtítulo: «complemento», «timo»…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar subtítulos de los resúmenes" /></label>
      <div className={cx('plan-lista-scroll')}>
        {resultados.map((s) => (
          <label key={s.id} className={cx('plan-check')}>
            <input type="checkbox" checked={b.secciones.includes(s.id)} onChange={() => alternar(s.id)} />
            <span>{s.titulo}<small>{s.clase} · {duracion(s.minutos)}</small></span>
          </label>
        ))}
        {q.trim().length >= 2 && !resultados.length && <p className={cx('plan-nota')}>Ningún subtítulo con esas palabras.</p>}
        {q.trim().length < 2 && <p className={cx('plan-nota')}>Escribe al menos dos letras para buscar entre los {todas.length} subtítulos del curso.</p>}
      </div>
    </div>
  );
}
