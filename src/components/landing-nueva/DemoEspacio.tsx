'use client';
/* eslint-disable @next/next/no-img-element */
import { useLayoutEffect, useRef, useState } from 'react';
import { c } from './estilos';
import Mascota from './Mascota';
import { Ico, teclasDePestanas } from './piezas';
import { CURSO_DEMO, LABS_DEMO, SEMANAS_DEMO, TIPOS_DEMO, type CuentaBiblioteca } from './datos';

/**
 * Miniclon del espacio de estudio que vamos a lanzar (`/estudio`), dentro de la
 * ventana de la landing. Es la app de verdad a escala: un lienzo de 1028×628 (lo que
 * ocupa /estudio en una pantalla de ese ancho) con las medidas reales de cada pieza
 * —barra de 64, ruta de 48, temario de 232, barra del lector de 52, índice de 195—,
 * reducido con `transform` al ancho de la ventana. En pantallas estrechas pasa a
 * la versión de teléfono (lienzo de 400). Los colores son los de la landing.
 *
 * Es una vista previa: se mueve entre los tres apartados (Estudiar, Laboratorio
 * virtual, Mi progreso) y entre Resumen y Práctica, y se puede marcar la clase,
 * pero temario, índice, filtros y ejercicios están pintados, no se pulsan. La
 * única clase es Mediastino, con el comienzo de su resumen real y dos figuras
 * reducidas en `/assets/landing/`. Sin selección de texto ni arrastre de imágenes.
 */

type Pagina = 'estudiar' | 'laboratorio' | 'progreso';
type Pestana = 'resumen' | 'practica';

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
const INDICE = ['Clase 1: Mediastino', 'División', 'Mediastino superior', 'Vena cava superior', 'Aorta'];
const BIBLIOTECA: { id: keyof CuentaBiblioteca; label: string; icono: string }[] = [
  { id: 'Todos', label: 'Todos los recursos', icono: 'i-layers' },
  { id: 'Simulación', label: 'Simulaciones', icono: 'i-flask' },
  { id: 'Modelo 3D', label: 'Modelos 3D', icono: 'i-cube' },
  { id: 'Atlas', label: 'Atlas', icono: 'i-book' },
];

const ICONO_CURSO = `/assets/cursos/materia-${CURSO_DEMO.materia}_v6.avif`;

export default function DemoEspacio({ parado, rutaDemo, biblioteca }: { parado: boolean; rutaDemo: string; biblioteca: CuentaBiblioteca }) {
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
  const [pestana, setPestana] = useState<Pestana>('resumen');
  // La segunda clase ya viene marcada, para que el temario enseñe el check desde el principio.
  const [estudiada, setEstudiada] = useState(false);
  const estudiadas = new Set(estudiada ? [0, 1] : [1]);

  const clases = [...CURSO_DEMO.lessons, ...SEMANAS_DEMO.extra.clases];
  const titulo = clases[0];
  const hechas = estudiadas.size;
  const pct = Math.round((hechas / clases.length) * 100);
  const grupos = [
    { titulo: SEMANAS_DEMO.titulo, desde: 0, clases: CURSO_DEMO.lessons },
    { titulo: SEMANAS_DEMO.extra.titulo, desde: CURSO_DEMO.lessons.length, clases: SEMANAS_DEMO.extra.clases },
  ];

  return (
    <div ref={marco}className={c('m-marco')} style={{ height: vista.alto * vista.escala }}>
      <div
        className={c('m-app', movil && 'm-movil')}
        style={{ width: vista.ancho, height: vista.alto, transform: `scale(${vista.escala})` }}
        onDragStart={(e) => e.preventDefault()}
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
              <span className={c('m-context-label')}>Tu meta</span>
              <span className={c('m-select m-select-ruta')}>{rutaDemo}<Ico id="i-chevron" /></span>
              <span className={c('m-divider')} />
              <span className={c('m-select')}>{CURSO_DEMO.name}<Ico id="i-chevron" /></span>
              <span className={c('m-badge')}>MEDICINA</span>
              <span className={c('m-context-end')}>Todo tu estudio, en un mismo lugar <Ico id="i-book" /></span>
            </div>

            <div className={c('m-work')}>
              <aside className={c('m-temario')} aria-label="Temario de ejemplo">
                <div className={c('m-temario-head')}>
                  <div className={c('m-curso-fila')}>
                    <span className={c('m-curso-icono')}><img src={ICONO_CURSO} alt="" draggable={false} /></span>
                    <span><strong>{CURSO_DEMO.name}</strong><small>Tu sílabo, a tu ritmo</small></span>
                  </div>
                  <span className={c('m-filtro')} aria-hidden="true"><Ico id="i-search" />Filtrar clases…</span>
                </div>
                <div className={c('m-temario-lista')}>
                  {grupos.map((g) => (
                    <section key={g.titulo}>
                      <span className={c('m-semana')}><span>{g.titulo}</span><Ico id="i-chevron" /></span>
                      {g.clases.map((t, j) => {
                        const i = g.desde + j;
                        return (
                          <span key={t} className={c('m-clase', i === 0 && 'active')} aria-current={i === 0 ? 'true' : undefined}>
                            <Ico id="i-page" /><span>{t}</span>
                            {estudiadas.has(i) && <Ico id="i-check" cls="m-check" />}
                          </span>
                        );
                      })}
                    </section>
                  ))}
                </div>
                <p className={c('m-temario-info')}><Ico id="i-info" />Un ejemplo de ciencias básicas</p>
              </aside>

              <section className={c('m-study')} aria-label="Clase de ejemplo">
                <div className={c('m-toolbar')}>
                  <div className={c('m-tabs')} role="tablist" aria-label="Material de la clase de ejemplo">
                    {PESTANAS.map((p) => (
                      <button
                        key={p.id} role="tab" aria-selected={pestana === p.id} tabIndex={pestana === p.id ? 0 : -1}
                        onClick={() => setPestana(p.id)}
                        onKeyDown={(e) => teclasDePestanas(e, PESTANAS.map((x) => x.id), pestana, setPestana)}
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
                    <div className={c('m-articulo m-scroll')}>
                      <div className={c('m-topline')}>
                        <span className={c('m-migas')}>{CURSO_DEMO.name}<i>/</i>{SEMANAS_DEMO.titulo}</span>
                        <span className={c('m-controles')} aria-hidden="true"><b>A−</b><b>A+</b><Ico id="i-bookmark" /></span>
                      </div>
                      <h2 className={c('m-h1')}>{titulo}</h2>
                      <div className={c('m-meta')}>
                        <span><Ico id="i-clock" />12 min de lectura</span>
                        <span><Ico id="i-page" />{TIPOS_DEMO[0]}</span>
                        <span className={c('m-chip')}>Con resumen</span>
                      </div>

                      <ResumenMediastino />

                      <div className={c('m-completar')}>
                        <span>¿Terminaste de estudiar esta clase?</span>
                        <button className={c('m-marcar', estudiada && 'hecha')} aria-pressed={estudiada} onClick={() => setEstudiada((v) => !v)}>
                          <Ico id={estudiada ? 'i-circle-check' : 'i-check'} />{estudiada ? 'Marcada como estudiada' : 'Marcar como estudiada'}
                        </button>
                      </div>
                      <div className={c('m-pie')} aria-hidden="true">
                        <span />
                        <span className={c('m-siguiente')}><span>{clases[1]}</span><Ico id="i-arrow" /></span>
                      </div>
                    </div>
                    <aside className={c('m-aside')} aria-label="Índice de la clase de ejemplo">
                      <span className={c('m-eyebrow')}>En esta clase</span>
                      <div className={c('m-toc')}>
                        {INDICE.map((t, i) => <span key={t} className={c(i === 0 && 'active')}>{t}</span>)}
                      </div>
                      <span className={c('m-aside-linea')} />
                      <span className={c('m-eyebrow')}>Llévalo a la práctica</span>
                      <div className={c('m-labcard')}>
                        <div className={c('m-labcard-art')}><span>Simulación</span><img src="/assets/landing/corazon_v1.avif" alt="" draggable={false} /></div>
                        <div className={c('m-labcard-cuerpo')}>
                          <strong>Ciclo cardíaco</strong>
                          <span className={c('m-labcard-enlace')}>Abrir el laboratorio <Ico id="i-arrow" /></span>
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : (
                  <div className={c('m-practica m-scroll')}>
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
                          <span className={c('m-boton')} aria-hidden="true"><Ico id="i-arrow" />Empezar</span>
                        </article>
                        <article className={c('m-item')}>
                          <span className={c('m-item-icono')}><Ico id="i-layers" /></span>
                          <div>
                            <span className={c('m-eyebrow m-eyebrow-verde')}>Repaso activo</span>
                            <strong>Tarjetas de repaso</strong>
                            <p>Memoriza con tarjetas o respóndelas como alternativas</p>
                          </div>
                          <span className={c('m-boton')} aria-hidden="true"><Ico id="i-arrow" />Empezar</span>
                        </article>
                      </div>
                    </div>
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
                {BIBLIOTECA.map((b) => (
                  <span key={b.id} className={c('m-biblioteca-item', b.id === 'Todos' && 'active')}>
                    <Ico id={b.icono} /><span>{b.label}</span><b>{biblioteca[b.id]}</b>
                  </span>
                ))}
                <p className={c('m-biblioteca-nota')}><Ico id="i-info" />Abre un recurso y vuelve al mismo punto de tu resumen.</p>
              </aside>
              <div className={c('m-labs-main')}>
                <div className={c('m-labs-filtros')} aria-hidden="true">
                  <span className={c('m-buscador')}><Ico id="i-search" />Buscar un modelo, simulación o tema</span>
                  <span className={c('m-select m-select-grande')}>Todas las materias<Ico id="i-chevron" /></span>
                </div>
                <div className={c('m-labs-cuenta')}><span>{biblioteca.Todos} recursos disponibles</span><span><Ico id="i-book" />Tu clase: {titulo}</span></div>
                <div className={c('m-labs')}>
                  {LABS_DEMO.map((l) => (
                    <article key={l.titulo} className={c('m-lab')}>
                      <div className={c('m-lab-art')}>
                        <span className={c('m-lab-tipo')}>{l.tipo}</span>
                        <img src={l.imagen} alt="" draggable={false} />
                      </div>
                      <div className={c('m-lab-cuerpo')}>
                        <span className={c('m-eyebrow m-eyebrow-verde')}>{l.materia}</span>
                        <strong>{l.titulo}</strong>
                        <p>{l.desc}</p>
                        <span className={c('m-lab-pie')}>{l.paraTuClase ? <><Ico id="i-pin" />Para tu clase</> : 'Explorar recurso'}<Ico id="i-arrow" /></span>
                      </div>
                    </article>
                  ))}
                  <div className={c('m-lab-mas')}>
                    <strong>Y muchos más</strong>
                    <span><b>{biblioteca.Todos}</b> recursos en la biblioteca del laboratorio virtual</span>
                  </div>
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
                <small>{CURSO_DEMO.name} · 12 min de lectura</small>
                <button onClick={() => setPagina('estudiar')}>Continuar mi clase <Ico id="i-arrow" /></button>
              </div>
              <div className={c('m-organiza')}>
                <strong>Organiza tu ruta</strong>
                <label><span>Ruta</span><span className={c('m-select')}>{rutaDemo}<Ico id="i-chevron" /></span></label>
                <label><span>Curso</span><span className={c('m-select')}>{CURSO_DEMO.name}<Ico id="i-chevron" /></span></label>
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
                  <div><span className={c('m-eyebrow')}>Según tu sílabo</span><strong>{CURSO_DEMO.name}</strong></div>
                  <b>{pct}%</b>
                </div>
                <div className={c('m-meter')} role="progressbar" aria-label="Clases marcadas como estudiadas" aria-valuenow={hechas} aria-valuemin={0} aria-valuemax={clases.length}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <p>Marca las clases que hayas estudiado. Abrir un resumen no lo completa automáticamente.</p>
                <div className={c('m-ruta')}>
                  {clases.map((t, i) => {
                    const hecha = estudiadas.has(i);
                    return (
                      <span key={t} className={c('m-ruta-fila')}>
                        <span className={c('m-ruta-marca', hecha && 'hecha')}>{hecha ? <Ico id="i-check" /> : i + 1}</span>
                        <span>{t}<small>{TIPOS_DEMO[i]}{hecha ? ' · Estudiada' : ''}</small></span>
                      </span>
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
 * figuras reducidas. Es lo que se lee hoy en /estudio en esa clase. La primera va en
 * dos tamaños: se pinta a ~380 px, así que una pantalla normal baja la de 400 y solo
 * una de alta densidad la de 653.
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
      <img
        className={c('m-r-figura')}
        src="/assets/landing/mediastino-axial-400_v1.avif"
        srcSet="/assets/landing/mediastino-axial-400_v1.avif 400w, /assets/landing/mediastino-axial_v1.avif 653w"
        sizes="(max-width: 600px) 330px, 380px"
        alt="Diagrama axial del tórax: el mediastino entre ambas cavidades pleurales"
        width={653} height={489} draggable={false} decoding="async"
      />
      <h3 className={c('m-r-h1')}>DIVISIÓN:</h3>
      <p>El inferior se divide por el pericardio.</p>
      <img className={c('m-r-figura')} src="/assets/landing/mediastino-division_v1.avif" alt="Divisiones del mediastino: superior e inferior (anterior, medio y posterior)" width={440} height={297} draggable={false} loading="lazy" decoding="async" />
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
