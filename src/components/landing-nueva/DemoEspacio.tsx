'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { c } from './estilos';
import Mascota from './Mascota';
import { Ico, teclasDePestanas } from './piezas';
import { CLASE_GENERICA, CURSOS_DEMO, LABS_DEMO, SEMANAS_DEMO, TIPOS_DEMO, type CursoDemo } from './datos';

/**
 * Miniclon del espacio de estudio que vamos a lanzar (`/estudio`), dentro de la
 * ventana de la landing. Es la app de verdad a escala: un lienzo de 1028×628 (lo que
 * ocupa /estudio en una pantalla de ese ancho) con las medidas reales de cada pieza
 * —barra de 64, ruta de 48, temario de 232, barra del lector de 52, índice de 195—,
 * reducido con `transform` al ancho de la ventana. En pantallas estrechas pasa a
 * la versión de teléfono (lienzo de 400). Los colores son los de la landing.
 *
 * Los tres apartados funcionan: Estudiar (Resumen / Práctica), Laboratorio virtual
 * y Mi progreso. La primera clase lleva el resumen real de Mediastino (texto y dos
 * figuras, recortadas y reducidas en `/assets/landing/`).
 */

type Pagina = 'estudiar' | 'laboratorio' | 'progreso';
type Pestana = 'resumen' | 'practica';
type Ejercicio = null | 'banqueo' | 'tarjetas';

const ESCRITORIO = { ancho: 1028, alto: 628 };
const TELEFONO = { ancho: 400, alto: 700 };

const PAGINAS: { id: Pagina; label: string; icono: string }[] = [
  { id: 'estudiar', label: 'Estudiar', icono: 'i-book' },
  { id: 'laboratorio', label: 'Laboratorio virtual', icono: 'i-flask' },
  { id: 'progreso', label: 'Mi progreso', icono: 'i-chart' },
];
const PESTANAS: { id: Pestana; label: string; icono: string }[] = [
  { id: 'resumen', label: 'Resumen', icono: 'i-page' },
  { id: 'practica', label: 'Práctica', icono: 'i-quiz' },
];
const INDICE_MEDIASTINO = ['Clase 1: Mediastino', 'División', 'Mediastino superior', 'Vena cava superior', 'Aorta'];
const INDICE_GENERICO = ['Objetivo de la clase', 'Mapa del tema', 'La idea central'];
const BIBLIOTECA = [
  { id: 'Todos', label: 'Todos los recursos', icono: 'i-layers' },
  { id: 'Simulación', label: 'Simulaciones', icono: 'i-flask' },
  { id: 'Modelo 3D', label: 'Modelos 3D', icono: 'i-cube' },
  { id: 'Atlas', label: 'Atlas', icono: 'i-book' },
] as const;

const icono = (k: CursoDemo) => `/assets/cursos/materia-${CURSOS_DEMO[k].materia}_v6.avif`;
const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export default function DemoEspacio({ parado, rutaDemo }: { parado: boolean; rutaDemo: string }) {
  // ── El lienzo a escala ──
  const marco = useRef<HTMLDivElement>(null);
  const [vista, setVista] = useState({ ...ESCRITORIO, escala: 965 / ESCRITORIO.ancho });
  useLayoutEffect(() => {
    const el = marco.current;
    if (!el) return;
    const medir = () => {
      const w = el.clientWidth;
      const base = w < 600 ? TELEFONO : ESCRITORIO;
      setVista({ ...base, escala: w / base.ancho });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const movil = vista.ancho === TELEFONO.ancho;

  const [pagina, setPagina] = useState<Pagina>('estudiar');
  const [curso, setCurso] = useState<CursoDemo>('cardio');
  const [menuCurso, setMenuCurso] = useState(false);
  const [clase, setClase] = useState(0);
  const [pestana, setPestana] = useState<Pestana>('resumen');
  const [ejercicio, setEjercicio] = useState<Ejercicio>(null);
  const [respuesta, setRespuesta] = useState<null | { letra: string; bien: boolean }>(null);
  const [volteada, setVolteada] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [biblioteca, setBiblioteca] = useState<(typeof BIBLIOTECA)[number]['id']>('Todos');
  const [cerrada, setCerrada] = useState(false);
  const [indice, setIndice] = useState(0);
  // Una clase ya marcada, para que el temario enseñe el check desde el principio.
  const [estudiadas, setEstudiadas] = useState<Set<string>>(() => new Set(['cardio:1']));
  const lab = useRef<SVGSVGElement>(null);
  const primeraOpcion = useRef<HTMLButtonElement>(null);
  const lectura = useRef<HTMLDivElement>(null);

  useEffect(() => { if (parado) lab.current?.pauseAnimations(); else lab.current?.unpauseAnimations(); }, [parado, pagina, biblioteca]);

  const datos = CURSOS_DEMO[curso];
  const semana = SEMANAS_DEMO[curso];
  const clases = [...datos.lessons, ...semana.extra.clases];
  const titulo = clases[clase];
  const real = curso === 'cardio' && clase === 0;
  const mapa = clase > 0 ? CLASE_GENERICA.map(titulo) : datos.map;
  const clave = `${curso}:${clase}`;
  const estudiada = estudiadas.has(clave);
  const hechas = clases.filter((_, i) => estudiadas.has(`${curso}:${i}`)).length;
  const pct = Math.round((hechas / clases.length) * 100);
  const enPrimera = clase < datos.lessons.length;

  const termino = sinTildes(filtro);
  const visible = (t: string) => !termino || sinTildes(t).includes(termino);
  const grupos = [
    { titulo: semana.titulo, desde: 0, clases: datos.lessons },
    { titulo: semana.extra.titulo, desde: datos.lessons.length, clases: semana.extra.clases },
  ];
  const labs = LABS_DEMO.filter((l) => biblioteca === 'Todos' || l.tipo === biblioteca);

  const abrirClase = (i: number) => {
    setClase(i); setPestana('resumen'); setEjercicio(null); setRespuesta(null); setIndice(0); setPagina('estudiar');
    lectura.current?.scrollTo({ top: 0 });
  };
  const elegirCurso = (k: CursoDemo) => { setCurso(k); setMenuCurso(false); setFiltro(''); abrirClase(0); };
  const alternarEstudiada = () => setEstudiadas((s) => {
    const n = new Set(s);
    if (n.has(clave)) n.delete(clave); else n.add(clave);
    return n;
  });
  const empezar = (e: Ejercicio) => { setEjercicio(e); setRespuesta(null); setVolteada(false); };

  return (
    <div ref={marco} className={c('m-marco')} style={{ height: vista.alto * vista.escala }}>
      <div
        className={c('m-app', movil && 'm-movil')}
        style={{ width: vista.ancho, height: vista.alto, transform: `scale(${vista.escala})` }}
      >
        {/* ── Barra superior ── */}
        <div className={c('m-top')}>
          <span className={c('m-brand')}><span className={c('m-logo')} role="img" aria-label="MedGO" /></span>
          <nav className={c('m-nav')} aria-label="Navegación del espacio de ejemplo">
            {PAGINAS.map((p) => (
              <button key={p.id} className={c(pagina === p.id && 'active')} aria-current={pagina === p.id ? 'page' : undefined} onClick={() => setPagina(p.id)}>
                <Ico id={p.icono} /><span>{p.label}</span>
              </button>
            ))}
          </nav>
          <div className={c('m-tools')}>
            <span className={c('m-search')} aria-hidden="true"><Ico id="i-search" /></span>
            <span className={c('m-moon')} aria-hidden="true"><Ico id="i-moon" /></span>
            <span className={c('m-avatar')} aria-hidden="true">B</span>
          </div>
        </div>

        {/* ── Estudiar ── */}
        {pagina === 'estudiar' && (
          <>
            <div className={c('m-context')}>
              <span className={c('m-context-label')}>Tu ruta</span>
              <span className={c('m-select m-select-ruta')}>{rutaDemo}<Ico id="i-chevron" /></span>
              <span className={c('m-divider')} />
              <div className={c('m-curso')}>
                <button className={c('m-select')} aria-haspopup="listbox" aria-expanded={menuCurso} onClick={() => setMenuCurso((v) => !v)}>
                  {datos.name}<Ico id="i-chevron" />
                </button>
                {menuCurso && (
                  <div className={c('m-curso-menu')} role="listbox" aria-label="Elegir curso">
                    {(Object.keys(CURSOS_DEMO) as CursoDemo[]).map((k) => (
                      <button key={k} role="option" aria-selected={k === curso} className={c(k === curso && 'active')} onClick={() => elegirCurso(k)}>
                        <img src={icono(k)} alt="" />
                        <span><strong>{CURSOS_DEMO[k].name}</strong><small>{CURSOS_DEMO[k].desc}</small></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className={c('m-badge')}>MEDICINA</span>
              <span className={c('m-context-end')}>Todo tu estudio, en un mismo lugar <Ico id="i-book" /></span>
            </div>

            <div className={c('m-work')}>
              <aside className={c('m-temario')} aria-label="Temario de ejemplo">
                <div className={c('m-temario-head')}>
                  <div className={c('m-curso-fila')}>
                    <span className={c('m-curso-icono')}><img src={icono(curso)} alt="" /></span>
                    <span><strong>{datos.name}</strong><small>Tu sílabo, a tu ritmo</small></span>
                  </div>
                  <label className={c('m-filtro')}>
                    <Ico id="i-search" />
                    <input type="search" placeholder="Filtrar clases…" aria-label="Filtrar las clases de ejemplo" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
                  </label>
                </div>
                <div className={c('m-temario-lista')}>
                  {grupos.map((g, gi) => {
                    const visibles = g.clases.map((t, j) => ({ t, i: g.desde + j })).filter(({ t }) => visible(t));
                    if (!visibles.length) return null;
                    const plegada = gi === 1 && cerrada && !termino;
                    return (
                      <section key={g.titulo}>
                        <button className={c('m-semana')} aria-expanded={!plegada} onClick={() => gi === 1 && setCerrada((v) => !v)}>
                          <span>{g.titulo}</span><Ico id="i-chevron" cls={plegada ? 'm-plegada' : undefined} />
                        </button>
                        {!plegada && visibles.map(({ t, i }) => (
                          <button key={t} className={c('m-clase', clase === i && 'active')} aria-current={clase === i ? 'true' : undefined} onClick={() => abrirClase(i)}>
                            <Ico id="i-page" /><span>{t}</span>
                            {estudiadas.has(`${curso}:${i}`) && <Ico id="i-check" cls="m-check" />}
                          </button>
                        ))}
                      </section>
                    );
                  })}
                  {!clases.some(visible) && <p className={c('m-vacio')}>Sin clases con ese nombre.</p>}
                </div>
                <p className={c('m-temario-info')}><Ico id="i-info" />Según tu sílabo de Cayetano</p>
              </aside>

              <section className={c('m-study')} aria-label="Clase de ejemplo">
                <div className={c('m-toolbar')}>
                  <div className={c('m-tabs')} role="tablist" aria-label="Material de la clase de ejemplo">
                    {PESTANAS.map((p) => (
                      <button
                        key={p.id} role="tab" aria-selected={pestana === p.id} tabIndex={pestana === p.id ? 0 : -1}
                        onClick={() => { setPestana(p.id); setEjercicio(null); }}
                        onKeyDown={(e) => teclasDePestanas(e, PESTANAS.map((x) => x.id), pestana, (t) => { setPestana(t); setEjercicio(null); })}
                      >
                        <Ico id={p.icono} />{p.label}
                      </button>
                    ))}
                  </div>
                  <div className={c('m-lectura-tools')} aria-hidden="true">
                    <span className={c('m-hoja')}><i />Hoja</span>
                    <span><Ico id="i-expand" />Enfocar</span>
                  </div>
                </div>

                {pestana === 'resumen' ? (
                  <div className={c('m-lectura')}>
                    <div ref={lectura} className={c('m-articulo m-scroll')}>
                      <div className={c('m-topline')}>
                        <span className={c('m-migas')}>{datos.name}<i>/</i>{enPrimera ? semana.titulo : semana.extra.titulo}</span>
                        <span className={c('m-controles')} aria-hidden="true"><b>A−</b><b>A+</b><Ico id="i-bookmark" /></span>
                      </div>
                      <h2 className={c('m-h1')}>{titulo}</h2>
                      <div className={c('m-meta')}>
                        <span><Ico id="i-clock" />{real ? '12 min de lectura' : '8 min de lectura'}</span>
                        <span><Ico id="i-page" />{TIPOS_DEMO[clase]}</span>
                        <span className={c('m-chip')}>Con resumen</span>
                      </div>

                      {real ? <ResumenMediastino /> : (
                        <>
                          <p className={c('m-intro')}>{clase > 0 ? CLASE_GENERICA.objective : datos.objective}</p>
                          <h3 className={c('m-seccion')}><span>01</span>Mapa del tema</h3>
                          <div className={c('diagram m-diagram')}>
                            <div className={c('diagram-root')}>{mapa[0]}</div>
                            <div className={c('diagram-branches')}><span>{mapa[1]}</span><span>{mapa[2]}</span></div>
                            <div className={c('diagram-leaves')}><span>{mapa[3]}</span><span>{mapa[4]}</span><span>{mapa[5]}</span></div>
                          </div>
                          <h3 className={c('m-seccion')}><span>02</span>La idea central</h3>
                          <p className={c('m-parrafo')}>{clase > 0 ? CLASE_GENERICA.explanation : datos.explanation}</p>
                        </>
                      )}

                      <div className={c('m-completar')}>
                        <span>¿Terminaste de estudiar esta clase?</span>
                        <button className={c('m-marcar', estudiada && 'hecha')} aria-pressed={estudiada} onClick={alternarEstudiada}>
                          <Ico id={estudiada ? 'i-circle-check' : 'i-check'} />{estudiada ? 'Marcada como estudiada' : 'Marcar como estudiada'}
                        </button>
                      </div>
                      <div className={c('m-pie')}>
                        {clase > 0 ? <button onClick={() => abrirClase(clase - 1)}><Ico id="i-arrow" cls="m-atras" /><span>{clases[clase - 1]}</span></button> : <span />}
                        {clase < clases.length - 1 ? <button className={c('m-siguiente')} onClick={() => abrirClase(clase + 1)}><span>{clases[clase + 1]}</span><Ico id="i-arrow" /></button> : <span />}
                      </div>
                    </div>
                    <aside className={c('m-aside')} aria-label="Índice de la clase de ejemplo">
                      <span className={c('m-eyebrow')}>En esta clase</span>
                      <nav className={c('m-toc')}>
                        {(real ? INDICE_MEDIASTINO : INDICE_GENERICO).map((t, i) => (
                          <button key={t} className={c(indice === i && 'active')} onClick={() => setIndice(i)}>{t}</button>
                        ))}
                      </nav>
                      <span className={c('m-aside-linea')} />
                      <span className={c('m-eyebrow')}>Llévalo a la práctica</span>
                      <div className={c('m-labcard')}>
                        <div className={c('m-labcard-art')}><span>Simulación</span><img src="/assets/landing/corazon_v1.avif" alt="" /></div>
                        <div className={c('m-labcard-cuerpo')}>
                          <strong>Ciclo cardíaco</strong>
                          <button onClick={() => setPagina('laboratorio')}>Abrir el laboratorio <Ico id="i-arrow" /></button>
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : (
                  <div className={c('m-practica m-scroll')}>
                    {ejercicio === null && (
                      <div className={c('m-practica-in')}>
                        <h2 className={c('m-h1')}>Aprende practicando</h2>
                        <p className={c('m-sub')}>{titulo}</p>
                        <div className={c('m-items')}>
                          <article className={c('m-item')}>
                            <span className={c('m-item-icono')}><Ico id="i-quiz" /></span>
                            <div>
                              <span className={c('m-eyebrow m-eyebrow-verde')}>Preguntas tipo examen</span>
                              <strong>Banqueo</strong>
                              <p>2 banqueos de exámenes anteriores, con su explicación</p>
                              <div className={c('m-chips')}><span>2024</span><span>2023</span><span>Por temas</span></div>
                            </div>
                            <button className={c('m-boton')} onClick={() => empezar('banqueo')}><Ico id="i-arrow" />Empezar</button>
                          </article>
                          <article className={c('m-item')}>
                            <span className={c('m-item-icono')}><Ico id="i-layers" /></span>
                            <div>
                              <span className={c('m-eyebrow m-eyebrow-verde')}>Repaso activo</span>
                              <strong>Tarjetas de repaso</strong>
                              <p>Memoriza con tarjetas o respóndelas como alternativas</p>
                            </div>
                            <button className={c('m-boton')} onClick={() => empezar('tarjetas')}><Ico id="i-arrow" />Empezar</button>
                          </article>
                        </div>
                      </div>
                    )}
                    {ejercicio === 'banqueo' && (
                      <div className={c('m-practica-in')}>
                        <button className={c('m-volver')} onClick={() => setEjercicio(null)}><Ico id="i-arrow" cls="m-atras" />Volver a la práctica</button>
                        <p className={c('m-pregunta')}>¿Qué división del mediastino contiene el corazón y el pericardio?</p>
                        <div className={c('m-opciones')}>
                          {([['A', 'Anterior', false], ['B', 'Medio', true], ['C', 'Posterior', false]] as const).map(([letra, texto, bien], i) => (
                            <button
                              key={letra} ref={i === 0 ? primeraOpcion : undefined} disabled={!!respuesta}
                              className={c(respuesta?.letra === letra && (respuesta.bien ? 'correct' : 'incorrect'))}
                              onClick={() => setRespuesta({ letra, bien })}
                            >
                              <span>{letra}</span>{texto}
                            </button>
                          ))}
                        </div>
                        <p className={c('m-feedback', respuesta?.bien && 'correct')} role="status">
                          {!respuesta ? 'Elige una respuesta para ver la explicación.'
                            : respuesta.bien ? 'Correcto. El corazón y el pericardio se encuentran en el mediastino medio.'
                              : 'La respuesta es el mediastino medio: allí se encuentran el corazón y el pericardio.'}
                        </p>
                        {respuesta && (
                          <button className={c('m-volver')} onClick={() => { setRespuesta(null); requestAnimationFrame(() => primeraOpcion.current?.focus()); }}>Volver a intentarlo ↗</button>
                        )}
                      </div>
                    )}
                    {ejercicio === 'tarjetas' && (
                      <div className={c('m-practica-in')}>
                        <button className={c('m-volver')} onClick={() => setEjercicio(null)}><Ico id="i-arrow" cls="m-atras" />Volver a la práctica</button>
                        <button className={c('m-tarjeta', volteada && 'volteada')} aria-pressed={volteada} onClick={() => setVolteada((v) => !v)}>
                          <span className={c('m-tarjeta-cara')}><small>PREGUNTA · 1 / 12</small>¿Qué plano separa el mediastino superior del inferior?<em>Toca para voltear</em></span>
                          <span className={c('m-tarjeta-cara m-tarjeta-dorso')}><small>RESPUESTA</small>El plano del ángulo esternal (de Louis), hasta el borde inferior de T4.<em>Toca para volver</em></span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {/* ── Laboratorio virtual ── */}
        {pagina === 'laboratorio' && (
          <div className={c('m-pagina m-scroll')}>
            <div className={c('m-pagina-head')}>
              <div>
                <span className={c('m-eyebrow m-eyebrow-verde')}>Explora y comprende</span>
                <h2 className={c('m-titulo')}>Laboratorio virtual</h2>
                <p className={c('m-sub')}>Una forma de ver lo que estás estudiando.</p>
              </div>
              <button className={c('m-boton-borde')} onClick={() => setPagina('estudiar')}><Ico id="i-arrow" cls="m-atras" />Volver a mi clase</button>
            </div>
            <div className={c('m-labs-cuerpo')}>
              <aside className={c('m-biblioteca')}>
                <span className={c('m-eyebrow')}>Biblioteca</span>
                {BIBLIOTECA.map((b) => {
                  const n = b.id === 'Todos' ? LABS_DEMO.length : LABS_DEMO.filter((l) => l.tipo === b.id).length;
                  return (
                    <button key={b.id} className={c(biblioteca === b.id && 'active')} aria-pressed={biblioteca === b.id} onClick={() => setBiblioteca(b.id)}>
                      <Ico id={b.icono} /><span>{b.label}</span><b>{n}</b>
                    </button>
                  );
                })}
                <p className={c('m-biblioteca-nota')}><Ico id="i-info" />Abre un recurso y vuelve al mismo punto de tu resumen.</p>
              </aside>
              <div className={c('m-labs-main')}>
                <div className={c('m-labs-filtros')}>
                  <span className={c('m-buscador')}><Ico id="i-search" />Buscar un modelo, simulación o tema</span>
                  <span className={c('m-select m-select-grande')}>Todas las materias<Ico id="i-chevron" /></span>
                </div>
                <div className={c('m-labs-cuenta')}><span>{labs.length} recursos disponibles</span><span><Ico id="i-book" />Tu clase: {clases[clase]}</span></div>
                <div className={c('m-labs')}>
                  {labs.map((l) => (
                    <article key={l.titulo} className={c('m-lab')}>
                      <div className={c('m-lab-art')}>
                        <span className={c('m-lab-tipo')}>{l.tipo}</span>
                        {l.arte === 'corazon' && <img src="/assets/landing/corazon_v1.avif" alt="" />}
                        {l.arte === 'ecg' && (
                          <svg ref={lab} viewBox="0 0 260 90" aria-hidden="true">
                            <path className={c('m-ecg')} d="M0 55h40l6-6 6 6h18l6 10 8-55 8 62 6-17h30l8-10 10 10h34l6-6 6 6h18l6 10 8-45 8 52 6-17h12" />
                            <circle r="3.5" fill="#cfe3f3"><animateMotion dur="3.2s" repeatCount="indefinite" path="M0 55h40l6-6 6 6h18l6 10 8-55 8 62 6-17h30l8-10 10 10h34l6-6 6 6h18l6 10 8-45 8 52 6-17h12" /></circle>
                          </svg>
                        )}
                        {l.arte === 'icono' && <Ico id={`i-${l.icono}`} />}
                      </div>
                      <div className={c('m-lab-cuerpo')}>
                        <span className={c('m-eyebrow m-eyebrow-verde')}>{l.materia}</span>
                        <strong>{l.titulo}</strong>
                        <p>{l.desc}</p>
                        <span className={c('m-lab-pie')}>{l.paraTuClase ? <><Ico id="i-pin" />Para tu clase</> : 'Explorar recurso'}<Ico id="i-arrow" /></span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mi progreso ── */}
        {pagina === 'progreso' && (
          <div className={c('m-pagina m-scroll')}>
            <div className={c('m-pagina-head')}>
              <div>
                <span className={c('m-eyebrow m-eyebrow-verde')}>Mi progreso</span>
                <h2 className={c('m-titulo')}>Tu ruta de estudio</h2>
                <p className={c('m-sub')}>Retoma tu clase, organiza el curso y decide qué repasar.</p>
              </div>
              <span className={c('m-boton-borde m-boton-chico')}><Ico id="i-clock" />Tu sesión de estudio</span>
            </div>
            <div className={c('m-progreso-fila')}>
              <div className={c('m-continua')}>
                <span className={c('m-eyebrow')}>Continúa donde te quedaste</span>
                <strong>{titulo}</strong>
                <small>{datos.name} · 12 min de lectura</small>
                <button onClick={() => setPagina('estudiar')}>Continuar mi clase <Ico id="i-arrow" /></button>
              </div>
              <div className={c('m-organiza')}>
                <strong>Organiza tu ruta</strong>
                <label><span>Ruta</span><span className={c('m-select')}>{rutaDemo}<Ico id="i-chevron" /></span></label>
                <label><span>Curso</span><span className={c('m-select')}>{datos.name}<Ico id="i-chevron" /></span></label>
              </div>
            </div>
            <div className={c('m-stats')}>
              <div><Ico id="i-circle-check" /><span><strong>{hechas}<small> / {clases.length}</small></strong>Clases estudiadas</span></div>
              <div><Ico id="i-reset" /><span><strong>0</strong>Clases para repasar</span></div>
              <div><Ico id="i-target" /><span><strong>—</strong>Sin práctica todavía</span></div>
            </div>
            <div className={c('m-progreso-fila m-progreso-fila-b')}>
              <div className={c('m-silabo')}>
                <div className={c('m-silabo-head')}>
                  <div><span className={c('m-eyebrow')}>Según tu sílabo</span><strong>{datos.name}</strong></div>
                  <b>{pct}%</b>
                </div>
                <div className={c('m-meter')} role="progressbar" aria-label="Clases marcadas como estudiadas" aria-valuenow={hechas} aria-valuemin={0} aria-valuemax={clases.length}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <p>Marca las clases que hayas estudiado. Abrir un resumen no lo completa automáticamente.</p>
                <div className={c('m-ruta')}>
                  {clases.map((t, i) => {
                    const hecha = estudiadas.has(`${curso}:${i}`);
                    return (
                      <button key={t} onClick={() => abrirClase(i)}>
                        <span className={c('m-ruta-marca', hecha && 'hecha')}>{hecha ? <Ico id="i-check" /> : i + 1}</span>
                        <span>{t}<small>{TIPOS_DEMO[i]}{hecha ? ' · Estudiada' : ''}</small></span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={c('m-sugerida')}>
                <div className={c('m-silabo-head')}>
                  <div><span className={c('m-eyebrow')}>Un paso a la vez</span><strong>Sesión sugerida</strong></div>
                  <Ico id="i-target" />
                </div>
                <p>Parte de tu siguiente clase sin marcar.</p>
                <div className={c('m-nota')}>
                  <Mascota pausado={parado} cls="note-mascot" />
                  <span><strong>Un tema a la vez.</strong><small>Del resumen a la práctica, sin perder el contexto.</small></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * El comienzo del resumen real de «Mediastino» (`cv-t1-mediastino`), con dos de sus
 * figuras recortadas y reducidas. Es lo que se lee hoy en /estudio en esa clase.
 */
function ResumenMediastino() {
  return (
    <div className={c('m-resumen')}>
      <h3 className={c('m-r-h1')}>CLASE 1: Mediastino</h3>
      <p>Se divide en 3 compartimentos:</p>
      <ul>
        <li>Compartimentos laterales derecho e izquierdo: cavidad pulmonar (pulmón-pleura)</li>
        <li>Compartimento medio (mediastino)</li>
      </ul>
      <p><b>Límite lateral:</b> pleura mediastínica derecha e izquierda</p>
      <img className={c('m-r-figura')} src="/assets/landing/mediastino-corte_v1.avif" alt="Corte transversal del tórax: el mediastino entre ambas cavidades pleurales" width={440} height={354} />
      <h3 className={c('m-r-h1')}>DIVISIÓN:</h3>
      <p>El inferior se divide por el pericardio.</p>
      <img className={c('m-r-figura')} src="/assets/landing/mediastino-division_v1.avif" alt="Divisiones del mediastino: superior e inferior (anterior, medio y posterior)" width={440} height={297} />
      <h3 className={c('m-r-h1')}>MEDIASTINO SUPERIOR</h3>
      <p className={c('m-r-rotulo')}>LÍMITES</p>
      <table className={c('m-r-tabla')}>
        <thead><tr><th>Límite</th><th>Estructura</th></tr></thead>
        <tbody>
          <tr><td>Superior</td><td>Abertura torácica superior</td></tr>
          <tr><td>Posterior</td><td>Cuerpos vertebrales T1–T4</td></tr>
          <tr><td>Anterior</td><td>Manubrio esternal</td></tr>
          <tr><td>Inferior</td><td>Plano del ángulo esternal al borde inferior de T4</td></tr>
        </tbody>
      </table>
    </div>
  );
}
