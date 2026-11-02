'use client';
// Casos clínicos: la práctica propia de /estudio, sin ExamRunner ni el panel del
// dashboard. El caso se lee como una historia con su boleta de laboratorio, y al
// responder cada alternativa dice por qué sirve o por qué falla.
//
// El servidor decide qué casos llegan (`/api/examen/<clave>`): sin el plan, solo la
// muestra. Las vistas son puras para poder revisarlas sin navegador.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { cx, Icono } from './Icono';
import type { Contexto } from './EspacioEstudio';

const ElegirPlan = dynamic(() => import('@/components/planes/ElegirPlan'), { ssr: false });

export type Bloque = 'AHAI' | 'PTI' | 'Ambas';
export type OpcionCaso = { t: string; porque: string; correcta?: boolean };
export type Caso = {
  id: string;
  bloque: Bloque;
  tema: string;
  origen: string;
  caso: string;
  datos: { k: string; v: string; alerta?: boolean }[];
  pregunta: string;
  opciones: OpcionCaso[];
  camino: string[];
  lab?: { parte: string; paso: number };
};
export type Filtro = 'todos' | 'AHAI' | 'PTI';
export type Muestra = { mostradas: number; total: number };

const LETRAS = 'ABCDE';
const LAB = '/estudio/laboratorio/citopenias-autoinmunes';
const PROPORCION_FLOJA = 0.6;

const entraEn = (c: Caso, f: Filtro) => f === 'todos' || c.bloque === f || c.bloque === 'Ambas';
const acerto = (c: Caso, elegida: number | undefined) => elegida !== undefined && !!c.opciones[elegida]?.correcta;

/** El orden de las alternativas: fijo en cada intento, para que al repetir no valga recordar el sitio. */
export function ordenDe(id: string, intento: number, n: number): number[] {
  let h = intento * 31 + 7;
  for (const ch of id) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Hematie() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="27" fill="#D92D4A" />
      <circle cx="32" cy="32" r="16" fill="#B51F3A" />
      <circle cx="32" cy="32" r="9" fill="#E8596F" />
    </svg>
  );
}

function Plaqueta() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 30c-2-11 10-20 23-18s21 11 17 22-13 19-25 16S14 41 12 30z" fill="#6D4FD8" />
      <circle cx="26" cy="27" r="4" fill="#C9BCF5" />
      <circle cx="39" cy="24" r="3" fill="#C9BCF5" />
      <circle cx="37" cy="37" r="4.5" fill="#4C33AE" />
      <circle cx="24" cy="39" r="2.5" fill="#C9BCF5" />
    </svg>
  );
}

const Flotante = ({ children }: { children: React.ReactNode }) => (
  <span className={cx('casos-flota')}><span className={cx('casos-flota-dibujo')}>{children}</span><span className={cx('casos-flota-sombra')} /></span>
);

export function VistaInicio({ casos, muestra, seguir, onEmpezar }: {
  casos: Caso[];
  muestra: Muestra | null;
  seguir?: { n: number; total: number; onSeguir: () => void } | null;
  onEmpezar: (f: Filtro) => void;
}) {
  const adaptados = casos.filter((c) => c.origen.startsWith('MIR')).length;
  const opciones: { f: Filtro; nombre: string; dice: string; dibujo: React.ReactNode }[] = [
    { f: 'AHAI', nombre: 'AHAI', dice: 'Anemia hemolítica autoinmune', dibujo: <Flotante><Hematie /></Flotante> },
    { f: 'PTI', nombre: 'PTI', dice: 'Trombocitopenia inmune', dibujo: <Flotante><Plaqueta /></Flotante> },
    { f: 'todos', nombre: 'Las dos', dice: 'Mezcladas, como en el examen', dibujo: <span className={cx('casos-par')}><Flotante><Hematie /></Flotante><Flotante><Plaqueta /></Flotante></span> },
  ];
  return (
    <div className={cx('casos-inicio')}>
      <h1>Casos clínicos</h1>
      <p className={cx('casos-entrada')}>Tienes al paciente y sus análisis delante, y debes decidir qué pasa o qué hacer. Al responder, cada alternativa te dice por qué sirve o por qué falla.</p>
      {seguir && (
        <button className={cx('button', 'casos-seguir')} onClick={seguir.onSeguir}>Seguir en el caso {seguir.n} de {seguir.total}<Icono n="arrow" /></button>
      )}
      <div className={cx('casos-eleccion')}>
        {opciones.map((o) => (
          <button key={o.f} className={cx('casos-opcion')} onClick={() => onEmpezar(o.f)}>
            {o.dibujo}
            <strong>{o.nombre}</strong>
            <span className={cx('casos-opcion-dice')}>{o.dice}</span>
            <small>{casos.filter((c) => entraEn(c, o.f)).length} casos</small>
          </button>
        ))}
      </div>
      {muestra && <p className={cx('casos-muestra')}><Icono n="lock" />Tu plan abre {muestra.mostradas} de los {muestra.total} casos.</p>}
      {adaptados > 0 && !muestra && (
        <p className={cx('casos-nota-origen')}>{adaptados} casos parten de exámenes MIR de España, con la redacción adaptada. Los otros {casos.length - adaptados} se escribieron para esta clase.</p>
      )}
    </div>
  );
}

export function VistaCaso({ caso, n, ronda, respuestas, orden, onResponder, onSiguiente, onSaltar, onSalir }: {
  caso: Caso;
  n: number;
  ronda: Caso[];
  respuestas: Record<string, number>;
  orden: number[];
  onResponder: (i: number) => void;
  onSiguiente: () => void;
  onSaltar: (i: number) => void;
  onSalir: () => void;
}) {
  const elegida = respuestas[caso.id];
  const respondido = elegida !== undefined;
  const ultimo = n === ronda.length - 1;
  const bien = acerto(caso, elegida);
  return (
    <div className={cx('caso')}>
      <div className={cx('caso-barra')}>
        <button className={cx('caso-salir')} onClick={onSalir}><Icono n="arrowLeft" />Casos</button>
        <span className={cx('caso-cuenta')}>Caso {n + 1} de {ronda.length}</span>
        <div className={cx('caso-tiras')}>
          {ronda.map((c, i) => {
            const r = respuestas[c.id];
            const estado = r === undefined ? 'pendiente' : acerto(c, r) ? 'acertado' : 'fallado';
            return (
              <button key={c.id} className={cx('caso-tira', r !== undefined && (acerto(c, r) ? 'tira-bien' : 'tira-mal'), i === n && 'tira-actual')}
                onClick={() => onSaltar(i)} aria-label={`Caso ${i + 1}, ${estado}`} aria-current={i === n ? 'true' : undefined} />
            );
          })}
        </div>
      </div>

      <div className={cx('caso-cuerpo')}>
        <section className={cx('caso-historia')} aria-label="El paciente">
          <div className={cx('caso-meta')}>
            <span className={cx('caso-rotulo', caso.bloque === 'AHAI' && 'rotulo-ahai', caso.bloque === 'PTI' && 'rotulo-pti')}>{caso.bloque === 'Ambas' ? 'AHAI y PTI' : caso.bloque}</span>
            <span>{caso.tema}</span>
          </div>
          <p className={cx('caso-relato')}>{caso.caso}</p>
          {caso.datos.length > 0 && (
            <div className={cx('caso-boleta')}>
              <div className={cx('caso-boleta-titulo')}>Resultados</div>
              <dl>
                {caso.datos.map((d) => (
                  <div key={d.k} className={cx('caso-dato', d.alerta && 'dato-alerta')}>
                    <dt>{d.k}</dt><span aria-hidden="true" /><dd>{d.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <p className={cx('caso-origen')}>{caso.origen === 'MedGO' ? 'Caso escrito para esta clase' : `Adaptado de ${caso.origen}`}</p>
        </section>

        <section className={cx('caso-decision')} aria-label="La decisión">
          <h2>{caso.pregunta}</h2>
          <div className={cx('caso-opciones')}>
            {orden.map((i, pos) => {
              const o = caso.opciones[i];
              const suya = elegida === i;
              return (
                <button key={i} className={cx('caso-op', respondido && (o.correcta ? 'op-correcta' : suya ? 'op-error' : 'op-otra'))}
                  disabled={respondido} onClick={() => onResponder(i)}>
                  <span className={cx('caso-letra')}>{respondido && o.correcta ? <Icono n="check" /> : respondido && suya ? <Icono n="close" /> : LETRAS[pos]}</span>
                  <span className={cx('caso-op-texto')}>
                    <span className={cx('caso-op-t')}>{o.t}</span>
                    {respondido && <span className={cx('caso-porque')}>{o.porque}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {respondido && (
            <div className={cx('caso-despues')} aria-live="polite">
              <p className={cx('caso-veredicto', bien ? 'veredicto-bien' : 'veredicto-mal')}>{bien ? 'Bien razonado.' : 'Esta vez no.'}</p>
              <h3>Cómo se llega</h3>
              <ol className={cx('caso-camino')}>
                {caso.camino.map((paso, i) => <li key={paso} style={{ animationDelay: `${i * 90}ms` }}>{paso}</li>)}
              </ol>
              <div className={cx('caso-acciones')}>
                {caso.lab && (
                  <Link className={cx('caso-al-lab')} href={`${LAB}?parte=${caso.lab.parte}${caso.lab.paso ? `&paso=${caso.lab.paso}` : ''}`}>
                    <Icono n="flask" />Verlo en el laboratorio
                  </Link>
                )}
                <button className={cx('button')} onClick={onSiguiente}>{ultimo ? 'Ver resultado' : 'Siguiente caso'}<Icono n="arrow" /></button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function VistaInforme({ ronda, respuestas, muestra, onRepetir, onDeNuevo, onVer, onPlanes }: {
  ronda: Caso[];
  respuestas: Record<string, number>;
  muestra: Muestra | null;
  onRepetir: () => void;
  onDeNuevo: () => void;
  onVer: (i: number) => void;
  onPlanes: () => void;
}) {
  const aciertos = ronda.filter((c) => acerto(c, respuestas[c.id])).length;
  const proporcion = ronda.length ? aciertos / ronda.length : 0;
  const temas = useMemo(() => {
    const m = new Map<string, { bien: number; total: number }>();
    for (const c of ronda) {
      const t = m.get(c.tema) ?? { bien: 0, total: 0 };
      t.total++;
      if (acerto(c, respuestas[c.id])) t.bien++;
      m.set(c.tema, t);
    }
    return [...m].sort(([, a], [, b]) => a.bien / a.total - b.bien / b.total);
  }, [ronda, respuestas]);
  const fallados = ronda.map((c, i) => ({ c, i })).filter(({ c }) => !acerto(c, respuestas[c.id]));
  const dice = proporcion >= 0.8 ? 'Razonas bien estos cuadros.'
    : proporcion >= PROPORCION_FLOJA ? 'Vas bien. Repasa los temas marcados.'
    : 'Vuelve al laboratorio y repite los que fallaste.';

  return (
    <div className={cx('casos-informe')}>
      <div className={cx('informe-nota')}><strong>{aciertos}</strong><span>de {ronda.length}</span></div>
      <p className={cx('casos-entrada')}>{dice}</p>

      <h2>Por tema</h2>
      <ul className={cx('informe-temas')}>
        {temas.map(([tema, t]) => (
          <li key={tema} className={cx(t.bien / t.total < PROPORCION_FLOJA && 'tema-flojo')}>
            <span>{tema}</span>
            <span className={cx('tema-barra')}><span style={{ width: `${(100 * t.bien) / t.total}%` }} /></span>
            <small>{t.bien}/{t.total}</small>
          </li>
        ))}
      </ul>

      {fallados.length > 0 && (
        <>
          <h2>Para volver a pensar</h2>
          <ul className={cx('informe-fallados')}>
            {fallados.map(({ c, i }) => (
              <li key={c.id}><button onClick={() => onVer(i)}><span>{c.pregunta}</span><Icono n="right" /></button></li>
            ))}
          </ul>
        </>
      )}

      <div className={cx('caso-acciones', 'informe-acciones')}>
        <button className={cx('button secondary')} onClick={onDeNuevo}><Icono n="reset" />Elegir otra vez</button>
        {fallados.length > 0 && <button className={cx('button')} onClick={onRepetir}>{fallados.length === 1 ? "Repetir el que fallé" : `Repetir los ${fallados.length} que fallé`}<Icono n="arrow" /></button>}
      </div>

      {muestra && (
        <div className={cx('informe-plan')}>
          <p>Esta clase tiene {muestra.total} casos, y tu plan abre {muestra.mostradas}.</p>
          <button className={cx('button')} onClick={onPlanes}>Ver planes</button>
        </div>
      )}
    </div>
  );
}

type Fase = 'inicio' | 'caso' | 'informe';
type Guardado = { fase: Fase; ronda: string[]; pos: number; respuestas: Record<string, number>; intento: number };
type Carga = { estado: 'cargando' } | { estado: 'error'; motivo: string } | { estado: 'listo'; casos: Caso[]; muestra: Muestra | null };

const VACIO: Guardado = { fase: 'inicio', ronda: [], pos: 0, respuestas: {}, intento: 0 };

function leerGuardado(clave: string): Guardado {
  try {
    const g = JSON.parse(localStorage.getItem(clave) ?? 'null') as Guardado | null;
    return g && Array.isArray(g.ronda) ? { ...VACIO, ...g } : VACIO;
  } catch { return VACIO; }
}

export default function CasosClinicos({ ctx, examKey, oculta }: { ctx: Contexto; examKey: string; oculta: boolean }) {
  const { course: c, lesson: l } = ctx;
  const router = useRouter();
  const clave = `medgo:casos:v1:${examKey}`;
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });
  const [vuelta, setVuelta] = useState(0);
  const [g, setG] = useState<Guardado>(VACIO);
  const [comprar, setComprar] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  /** El intento ya contado en la analítica: volver a un caso desde el resultado no lo repite. */
  const contado = useRef(-1);

  useEffect(() => {
    const corte = new AbortController();
    (async () => {
      const r = await fetch(`/api/examen/${examKey}`, { signal: corte.signal });
      if (!r.ok) {
        setCarga({ estado: 'error', motivo: r.status === 401 ? 'Tu sesión terminó. Vuelve a entrar para ver los casos.' : 'No pudimos traer los casos.' });
        return;
      }
      const j = await r.json() as { url?: string; payload?: { questions?: Caso[] }; muestra?: Muestra };
      const payload = j.payload ?? (j.url ? await (await fetch(j.url, { signal: corte.signal })).json() as { questions?: Caso[] } : null);
      const casos = payload?.questions ?? [];
      // Lo guardado puede nombrar casos que ya no llegan (un plan vencido, un banco nuevo).
      const hay = new Set(casos.map((x) => x.id));
      const previo = leerGuardado(clave);
      const ronda = previo.ronda.filter((id) => hay.has(id));
      setG(ronda.length ? { ...previo, ronda, pos: Math.min(previo.pos, ronda.length - 1) } : VACIO);
      setCarga({ estado: 'listo', casos, muestra: j.muestra ? { mostradas: j.muestra.mostradas, total: j.muestra.total } : null });
    })().catch((e: unknown) => {
      if ((e as { name?: string }).name !== 'AbortError') setCarga({ estado: 'error', motivo: 'No pudimos traer los casos.' });
    });
    return () => corte.abort();
  }, [examKey, clave, vuelta]);

  useEffect(() => {
    if (carga.estado !== 'listo') return;
    try { localStorage.setItem(clave, JSON.stringify(g)); } catch { /* sin almacenamiento, el avance dura lo que la pestaña */ }
  }, [g, clave, carga.estado]);

  const casos = carga.estado === 'listo' ? carga.casos : [];
  const ronda = useMemo(() => {
    const porId = new Map(casos.map((x) => [x.id, x]));
    return g.ronda.map((id) => porId.get(id)).filter((x): x is Caso => !!x);
  }, [casos, g.ronda]);
  const actual = g.fase === 'caso' ? ronda[g.pos] : undefined;

  const arriba = () => raiz.current?.scrollTo({ top: 0 });
  const empezar = useCallback((f: Filtro) => {
    setG((p) => ({ fase: 'caso', ronda: casos.filter((x) => entraEn(x, f)).map((x) => x.id), pos: 0, respuestas: {}, intento: p.intento + 1 }));
    arriba();
  }, [casos]);
  const saltar = useCallback((i: number) => { setG((p) => ({ ...p, fase: 'caso', pos: i })); arriba(); }, []);
  const responder = useCallback((i: number) => {
    if (!actual) return;
    setG((p) => (p.respuestas[actual.id] !== undefined ? p : { ...p, respuestas: { ...p.respuestas, [actual.id]: i } }));
  }, [actual]);
  const pendiente = ronda.findIndex((x) => g.respuestas[x.id] === undefined);
  const siguiente = useCallback(() => {
    if (g.pos < ronda.length - 1) { saltar(g.pos + 1); return; }
    // Saltar con las tiras puede dejar casos atrás: antes del resultado se vuelve a ellos.
    if (pendiente >= 0) { saltar(pendiente); return; }
    if (contado.current !== g.intento) {
      contado.current = g.intento;
      const score = ronda.filter((x) => acerto(x, g.respuestas[x.id])).length;
      trackEvent('examen_completado', { examKey, score, total: ronda.length, origen: 'estudio' });
    }
    setG((p) => ({ ...p, fase: 'informe' }));
    arriba();
  }, [examKey, g.intento, g.pos, g.respuestas, pendiente, ronda, saltar]);
  const repetir = useCallback(() => {
    setG((p) => {
      const fallados = ronda.filter((x) => !acerto(x, p.respuestas[x.id])).map((x) => x.id);
      const respuestas = { ...p.respuestas };
      for (const id of fallados) delete respuestas[id];
      return { fase: 'caso', ronda: fallados, pos: 0, respuestas, intento: p.intento + 1 };
    });
    arriba();
  }, [ronda]);
  const aLaLista = useCallback(() => router.push(`/estudio/upch/${c.id}/${l.id}`, { scroll: false }), [c.id, l.id, router]);

  const orden = useMemo(() => (actual ? ordenDe(actual.id, g.intento, actual.opciones.length) : []), [actual, g.intento]);

  // A–D o 1–4 responden; Enter y la flecha avanzan. Calla mientras se lee el resumen.
  useEffect(() => {
    if (oculta || !actual) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const respondido = g.respuestas[actual.id] !== undefined;
      if (!respondido) {
        const tecla = e.key.toUpperCase();
        const pos = /^[1-9]$/.test(tecla) ? Number(tecla) - 1 : LETRAS.indexOf(tecla);
        if (pos >= 0 && pos < orden.length) { e.preventDefault(); responder(orden[pos]); }
        return;
      }
      if ((e.key === 'Enter' && !t?.closest?.('a, button')) || e.key === 'ArrowRight') { e.preventDefault(); siguiente(); }
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [actual, g.respuestas, orden, oculta, responder, siguiente]);

  return (
    <div ref={raiz} className={cx('practice-wrap casos')} hidden={oculta} {...(oculta ? {} : { id: 'study-content', role: 'tabpanel', 'aria-labelledby': 'practice-tab' })}>
      <div className={cx('casos-inner')}>
        {carga.estado === 'cargando' && <p className={cx('casos-espera')}><span className={cx('practica-rueda')} aria-hidden="true" />Trayendo los casos…</p>}
        {carga.estado === 'error' && (
          <div className={cx('casos-espera')}>
            <p>{carga.motivo}</p>
            <button className={cx('button secondary')} onClick={() => { setCarga({ estado: 'cargando' }); setVuelta((v) => v + 1); }}>Intentar de nuevo</button>
          </div>
        )}
        {carga.estado === 'listo' && (
          <>
            {g.fase === 'inicio' && (
              <>
                <button className={cx('caso-salir', 'casos-a-lista')} onClick={aLaLista}><Icono n="arrowLeft" />Práctica</button>
                <VistaInicio casos={casos} muestra={carga.muestra} onEmpezar={empezar}
                  seguir={pendiente >= 0 ? { n: pendiente + 1, total: ronda.length, onSeguir: () => saltar(pendiente) } : null} />
              </>
            )}
            {actual && (
              <VistaCaso key={`${actual.id}-${g.intento}`} caso={actual} n={g.pos} ronda={ronda} respuestas={g.respuestas} orden={orden}
                onResponder={responder} onSiguiente={siguiente} onSaltar={saltar}
                onSalir={() => setG((p) => ({ ...p, fase: 'inicio' }))} />
            )}
            {g.fase === 'informe' && (
              <VistaInforme ronda={ronda} respuestas={g.respuestas} muestra={carga.muestra}
                onRepetir={repetir} onDeNuevo={() => setG((p) => ({ ...p, fase: 'inicio' }))}
                onVer={saltar} onPlanes={() => setComprar(true)} />
            )}
          </>
        )}
      </div>
      {comprar && <ElegirPlan requisito={c.requisito} onClose={() => setComprar(false)} />}
    </div>
  );
}
