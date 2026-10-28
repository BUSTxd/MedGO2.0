'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { PLANS, type PlanKey, type ProfilePlan } from '@/lib/plans';
import { ofertasPara } from '@/components/planes/oferta';
import { usePasarela } from '@/components/planes/usePasarela';
import Footer from '@/components/Footer';
import { c } from './estilos';
import Mascota from './Mascota';
import DemoEspacio from './DemoEspacio';
import ExploraHipersensibilidad from './ExploraHipersensibilidad';
import ConectaRed from './ConectaRed';
import { Ico, teclasDePestanas } from './piezas';
import { ASISTENTE, PREGUNTAS, RUTAS, type CuentaBiblioteca, type RutaLanding } from './datos';

// El SDK de Mercado Pago sólo baja al abrir la compra (como en `Pricing.tsx`).
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

/**
 * La landing nueva de MedGO (port del prototipo `prototipos/espacio-estudio/landing`),
 * en ruta provisional. Los CTA llevan al espacio de estudio (`/estudio`, que pide
 * sesión) y los planes son los nuevos (Visitante, Residente, Especialista): importes
 * de `PLANS`, textos de `components/planes/oferta.ts` y la compra de siempre
 * (`SubscribeModal`, Mercado Pago) en cuanto cada plan esté `aLaVenta`.
 */

const ESPACIO = '/estudio';
const LABORATORIO = '/estudio/laboratorio';
/** Las chips de «Explora»: cada una abre su laboratorio (todas iguales: ninguna está «seleccionada»). */
const LABS_EXPLORA: [slug: string, nombre: string][] = [
  ['hipersensibilidad', 'Hipersensibilidad I–IV'], ['maduracion-linfocitos', 'Maduración de linfocitos'],
  ['checkpoints-ciclo-celular', 'Ciclo celular'], ['vias-nfkb-jakstat', 'NF-κB y JAK/STAT'],
  ['cascada-coagulacion', 'Coagulación'], ['electrocardiograma', 'ECG'], ['nefron-interactivo', 'Nefrón'], ['atlas-3d', 'Atlas 3D'],
];

/** Las dos siluetas de la portada se miran entre ellas, hacia el título. */
const MIRA_DERECHA = { yaw: 0.75, pitch: 0.15 };
const MIRA_IZQUIERDA = { yaw: -0.75, pitch: 0.1 };
const SALUDO_REPOSO ='MedGO. Comprende las bases, conecta lo que aprendes.';
/** Total de elaboración comunicado por BUST; no depende del conteo del catálogo. */
const HORAS_ELABORACION_RESUMENES = 1128;

export default function LandingNueva({ biblioteca, resumenes }: { biblioteca: CuentaBiblioteca; resumenes: number }) {
  // ── Movimiento: el botón de pausa y la preferencia del sistema ──
  const [reducido, setReducido] = useState(false);
  const [pausado, setPausado] = useState(false);
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    setReducido(q.matches); setPausado(q.matches);
    const cambio = (e: MediaQueryListEvent) => { setReducido(e.matches); setPausado(e.matches); };
    q.addEventListener('change', cambio);
    return () => q.removeEventListener('change', cambio);
  }, []);
  const parado = pausado || reducido;

  // ── Saludo de la mascota ──
  const [saludo, setSaludo] = useState(SALUDO_REPOSO);
  const reloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saludar = () => {
    clearTimeout(reloj.current);
    setSaludo(`¡Hola! Soy ${ASISTENTE}. Un tema a la vez. Vamos contigo.`);
    reloj.current = setTimeout(() => setSaludo(SALUDO_REPOSO), 3200);
  };
  useEffect(() => () => clearTimeout(reloj.current), []);

  // ── Menú del teléfono ──
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const cerrarMenu = useCallback((devolverFoco = false) => {
    setMenu(false);
    if (devolverFoco) botonMenu.current?.focus();
  }, []);
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector('a')?.focus({ preventScroll: true });
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrarMenu(true); };
    const fuera = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !botonMenu.current?.contains(t)) cerrarMenu();
    };
    const mq = matchMedia('(max-width:720px)');
    const alCambiar = () => cerrarMenu();
    document.addEventListener('keydown', tecla);
    document.addEventListener('click', fuera);
    mq.addEventListener('change', alCambiar);
    return () => { document.removeEventListener('keydown', tecla); document.removeEventListener('click', fuera); mq.removeEventListener('change', alCambiar); };
  }, [menu, cerrarMenu]);

  const [ruta, setRuta] = useState<RutaLanding>('upch');
  const rutaActiva = RUTAS.find((r) => r.id === ruta)!;

  // ── La compra real (el flujo de `Pricing.tsx`) ──
  // Sin sesión, el plan lleva al login; con sesión se pide el plan vigente: quien ya paga
  // ve «Tu plan actual» y no puede volver a comprar. Un plan que aún no está a la venta
  // (sus planes de Mercado Pago llegan con la pasarela) solo avisa de que viene pronto.
  const router = useRouter();
  const { user } = useAuth();
  const [planActual, setPlanActual] = useState<{ plan: ProfilePlan; isActive: boolean } | null>(null);
  const [comprar, setComprar] = useState<PlanKey | null>(null);
  const [pasarela] = usePasarela();
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    if (!user) { setPlanActual(null); return; }
    let cancelado = false;
    fetch('/api/subscriptions/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelado || !json?.planState) return;
        setPlanActual(json.planState as { plan: ProfilePlan; isActive: boolean });
      })
      .catch(() => {});
    return () => { cancelado = true; };
  }, [user]);
  const yaPaga = !!planActual?.isActive && planActual.plan !== 'free';
  /** Lo que dice (y si se puede pulsar) el botón de compra de un plan. */
  const estadoCompra = (key: PlanKey) =>
    !yaPaga ? null : planActual!.plan === key ? 'Tu plan actual' : 'Ya tienes un plan activo';
  // Un solo botón principal en toda la página: sin sesión registra, con sesión lleva a estudiar.
  const entrar = user ? ESPACIO : '/auth/login?signup=1';
  const textoEntrar = user ? 'Ir a estudiar' : 'Empieza ahora';
  const suscribirme = (key: PlanKey) => {
    if (!user) { router.push(`/auth/login?next=${encodeURIComponent('/#planes')}`); return; }
    if (estadoCompra(key)) return;
    if (!PLANS[key].aLaVenta) { setPronto(true); return; }
    setComprar(key);
  };

  return (
    <div className={c('pagina')} data-motion={parado ? 'paused' : 'active'}>
      <a className={c('skip-link')} href="#contenido">Ir al contenido</a>
      <SimbolosSvg />

      <header className={c('site-header wrap')} id="inicio">
        <a className={c('brand')} href="#inicio" aria-label="MedGO, inicio"><span className={c('brand-mark')} aria-hidden="true" /></a>
        <nav
          id="header-links" ref={menuRef} className={c('header-links')} aria-label="Navegación principal"
          data-open={menu ? 'true' : undefined}
          onBlur={(e) => { if (menu && !e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget !== botonMenu.current) cerrarMenu(); }}
        >
          {[['#espacio', 'Tu espacio'], ['#recursos', 'Recursos'], ['#rutas', 'Rutas de estudio'], ['#planes', 'Planes'], ['#preguntas', 'Preguntas']].map(([h, t]) => (
            <a key={h} href={h} onClick={() => cerrarMenu()}>{t}</a>
          ))}
        </nav>
        <div className={c('header-actions')}>
          <a className={c('header-secondary')} href="#recursos">Cómo funciona</a>
          <Link className={c('button primary small')} href={entrar}>{textoEntrar} <Ico id="i-arrow" /></Link>
        </div>
        <button
          ref={botonMenu} className={c('menu-toggle')} aria-expanded={menu} aria-controls="header-links"
          aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} onClick={() => (menu ? cerrarMenu() : setMenu(true))}
        >
          <Ico id="i-menu" />
        </button>
      </header>

      <main id="contenido" tabIndex={-1}>
        <section className={c('hero')} aria-labelledby="hero-title">
          <div className={c('hero-decorations')} aria-hidden="true">
            <Mascota pausado={parado} cls="bot-silhouette hero-silhouette silhouette-left" mirada={MIRA_DERECHA} silueta />
            <Mascota pausado={parado} cls="bot-silhouette hero-silhouette silhouette-right" mirada={MIRA_IZQUIERDA} silueta />
          </div>
          <div className={c('hero-copy')}>
            <a href="#espacio" className={c('announcement')}>
              <strong>Preclínicos de medicina</strong><span>Conoce MedGO</span><span className={c('announcement-arrow')} aria-hidden="true">↗</span>
            </a>
            <h1 id="hero-title" aria-label="Conoce MedGO">
              <span>Conoce</span>
              <button className={c('title-mascot mascot-button')} aria-label={`Saludar a ${ASISTENTE}, la mascota de MedGO`} onClick={saludar}><Mascota pausado={parado} cls="" detalle={1} /></button>
              <span>MedGO</span>
            </h1>
            <p className={c('hero-description')}>Tu espacio para comprender la medicina.<br />Los cursos preclínicos, práctica y recursos visuales para aprender a tu ritmo, desde donde estés.</p>
            <div className={c('hero-actions')}>
              <Link className={c('button primary')} href={entrar}><Ico id="i-book" />{textoEntrar}</Link>
              <a className={c('button secondary')} href="#recursos">Ver cómo funciona</a>
            </div>
            <p className={c('sr-only')} role="status" id="mascot-message">{saludo}</p>
          </div>

          <div className={c('demo-window')} id="demo" aria-label="Demostración interactiva del espacio de estudio">
            <div className={c('demo-titlebar')}>
              <div className={c('window-tools')}>
                <span className={c('window-dots')} aria-hidden="true"><i /><i /><i /></span>
                <span className={c('window-brand')}>MedGO</span>
              </div>
              <span className={c('window-title')}><Mascota pausado={parado} cls="tiny-mascot" /> Tu espacio de estudio</span>
              <span className={c('demo-badge')}>VISTA DE EJEMPLO <Ico id="i-monitor" /></span>
            </div>
            <DemoEspacio parado={parado} rutaDemo={rutaActiva.demo.replace('MI RUTA · ', '')} biblioteca={biblioteca} />
          </div>
          <div className={c('demo-caption')}>
            <span>Del concepto a la práctica. Todo conectado.</span>
            <button className={c('motion-control')} disabled={reducido} onClick={() => setPausado((p) => !p)}>
              <Ico id={parado ? 'i-play' : 'i-pause'} />
              <span>{reducido ? 'Movimiento reducido' : parado ? 'Activar movimiento' : 'Pausar movimiento'}</span>
            </button>
          </div>
        </section>

        <section className={c('intro-section wrap')} id="espacio">
          <div className={c('intro-copy')}>
            <p className={c('eyebrow')}>CIENCIAS BÁSICAS DE MEDICINA</p>
            <h2>Estudia las bases.<br />Entiende la medicina.</h2>
            <p className={c('section-description')}>Anatomía, fisiología, bioquímica y más. Relaciona lo que estudias con resúmenes, preguntas explicadas y recursos visuales que te ayudan a entender cómo funciona el cuerpo y qué cambia en la enfermedad.</p>
            <Link className={c('text-action')} href={entrar}>{textoEntrar} <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={c('intro-illustration')} aria-hidden="true"><Mascota pausado={parado} cls="feature-mascot" guion="vivo" detalle={1} /></div>
        </section>

        <section className={c('resources-section wrap')} id="recursos">
          {/* Cada tarjeta: verbo · titular · una frase · prueba. El color de cada verbo es el de su tipo de nodo en la red de «Conecta». */}
          <div className={c('center-heading')}>
            <h2>
              <span className={c('verbo-resumen')}>Lee.</span> <span className={c('verbo-banqueo')}>Practica.</span> <span className={c('verbo-lab')}>Explora.</span>
              <br />Conecta lo que aprendes.
            </h2>
            <p>Resúmenes, preguntas explicadas y recursos visuales para comprender un tema y relacionarlo con los demás.</p>
          </div>
          <div className={c('feature-grid')}>
            <article className={c('feature-card')} data-tipo="resumen">
              <div className={c('feature-copy')}>
                <div className={c('feature-cabeza')}>
                  <span className={c('feature-verbo')}>01 · Lee</span>
                  <span className={c('sello-humano')}>Escrito por personas</span>
                </div>
                <h3>Lo esencial, bien explicado.</h3>
                <p>Elaborados sin inteligencia artificial. Explicaciones, esquemas y figuras para comprender cada tema y volver a consultarlo.</p>
                <dl className={c('feature-cifras')}>
                  <div><dt>{resumenes}</dt><dd>resúmenes</dd></div>
                  <div><dt>{HORAS_ELABORACION_RESUMENES} h</dt><dd>de trabajo humano</dd></div>
                </dl>
              </div>
              <div className={c('mini-lector')} aria-hidden="true">
                <div className={c('lector-hoja')}>
                  <strong>Mediastino</strong>
                  <p>Espacio central del tórax, entre ambos pulmones. Contiene el <mark>corazón y los grandes vasos</mark>, la <u>tráquea y el esófago</u>.</p>
                  <span className={c('nota-margen')}>
                    <svg viewBox="0 0 40 22" fill="none"><path d="M38 4C26 2 12 6 5 17M5 17l1-7M5 17l7-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ¡sus relaciones!
                  </span>
                  <figure>
                    <img src="/assets/landing/mediastino-axial-400_v1.avif" alt="" width={400} height={300} loading="lazy" draggable={false} />
                    <figcaption>Corte axial</figcaption>
                  </figure>
                  <p className={c('lector-firma')}>Cardiovascular · Teoría 1</p>
                </div>
              </div>
            </article>
            <article className={c('feature-card')} data-tipo="banqueo">
              <div className={c('feature-copy')}>
                <div className={c('feature-cabeza')}><span className={c('feature-verbo')}>02 · Practica</span></div>
                <h3>Cada respuesta tiene un porqué.</h3>
                <p>Revisa el fundamento de la correcta, por qué las otras no encajan y el dato clave que te ayuda a resolver la siguiente.</p>
                <dl className={c('feature-cifras')}>
                  <div><dt>300</dt><dd>preguntas reales del ENCIB</dd></div>
                  <div><dt>2021 · 2024 · 2025</dt><dd>los tres exámenes, completos</dd></div>
                </dl>
                <p className={c('feature-nota')}>Los cuadernillos no traen clave: clave y explicaciones son nuestras, basadas en apuntes y libros.</p>
              </div>
              <div className={c('mini-examen')} aria-hidden="true">
                <div className={c('ex-hoja')}>
                  <div className={c('ex-top')}><span>Pregunta <b>12</b> · ejemplo</span><span>Fisiología</span></div>
                  <p className={c('ex-enunciado')}>Durante la eyección ventricular, ¿qué válvulas están abiertas?</p>
                  <div className={c('ex-ops')}>
                    <div className={c('ex-ok')}><span>B</span>Aórtica y pulmonar<MarcaExamen ok /></div>
                    <div className={c('ex-mal')}><span>C</span>Las cuatro a la vez<MarcaExamen /></div>
                  </div>
                  <div className={c('ex-razon')}>
                    <p className={c('ex-feedback')}><MarcaExamen /><span>Vamos a entenderla<strong>Aórtica y pulmonar</strong></span></p>
                    <h4>Por qué es correcta</h4>
                    <p>Cuando la presión del ventrículo supera la de la aorta y la pulmonar, las sigmoideas se abren; las auriculoventriculares ya se cerraron al empezar la sístole.</p>
                    <div className={c('ex-descartes')}>Por qué las otras opciones no corresponden <span>2</span></div>
                    <div className={c('ex-dato')}><span>↳</span><div><h4>Dato clave</h4><p>Con las cuatro cerradas, la fase es isovolumétrica.</p></div></div>
                  </div>
                </div>
              </div>
            </article>
            {/* Las anchas en tres piezas: en escritorio texto y extra van a la izquierda y el visual ocupa la
                derecha entera; en el teléfono el visual queda entre el texto y el extra (no tras las chips). */}
            <article className={c('feature-card feature-wide')} data-tipo="lab">
              <div className={c('feature-copy')}>
                <div className={c('feature-cabeza')}><span className={c('feature-verbo')}>03 · Explora</span></div>
                <h3>Mira el mecanismo en acción.</h3>
                <p>Sigue los procesos en las simulaciones, reconoce estructuras en los atlas y explora sus relaciones en los modelos 3D.</p>
              </div>
              <ExploraHipersensibilidad parado={parado} />
              <div className={c('feature-extra')}>
                <ul className={c('lab-chips')} aria-label="Laboratorios">
                  {LABS_EXPLORA.map(([slug, nombre]) => (
                    <li key={slug}><Link href={`${LABORATORIO}/${slug}`}>{nombre}</Link></li>
                  ))}
                </ul>
                <p className={c('lab-accion')}>
                  <Link className={c('text-action')} href={`${LABORATORIO}/hipersensibilidad`}>Probar el laboratorio <span aria-hidden="true">↗</span></Link>
                  <span>Vistazo gratis con tu cuenta</span>
                </p>
                <p className={c('lab-credito')}>Células: Robbins, Patología humana (cap. 6) y Servier Medical Art (CC BY-SA 3.0).</p>
              </div>
            </article>
            <article className={c('feature-card feature-wide feature-red')} data-tipo="curso">
              <div className={c('feature-copy')}>
                <div className={c('feature-cabeza')}><span className={c('feature-verbo')}>04 · Conecta</span></div>
                <h3>Un tema te lleva al siguiente.</h3>
                <p>Encuentra los resúmenes, preguntas y laboratorios vinculados a cada curso, y descubre qué temas comparten.</p>
              </div>
              <ConectaRed parado={parado} />
              <div className={c('feature-extra')}>
                <p className={c('red-nota')}><span>Próximamente</span>{ASISTENTE} usará este mapa para armarte la ruta.</p>
              </div>
            </article>
          </div>
        </section>

        <section className={c('routes-section wrap')} id="rutas">
          <div className={c('center-heading')}>
            <h2>Tu objetivo.<br />Tu propia ruta.</h2>
            <p>Próximamente: rutas con IA. Define qué quieres aprender, cuánto tiempo tienes y qué necesitas reforzar. {ASISTENTE} te propondrá un recorrido; tú eliges cómo seguirlo.</p>
          </div>
          <div className={c('route-tabs')} role="tablist" aria-label="Elige una ruta de estudio">
            {RUTAS.map((r) => (
              <button
                key={r.id} role="tab" id={`route-${r.id}`} aria-controls="route-panel" aria-selected={ruta === r.id} tabIndex={ruta === r.id ? 0 : -1}
                onClick={() => setRuta(r.id)} onKeyDown={(e) => teclasDePestanas(e, RUTAS.map((x) => x.id), ruta, setRuta)}
              >
                {r.tab}
              </button>
            ))}
          </div>
          <div id="route-panel" className={c('route-panel')} role="tabpanel" aria-labelledby={`route-${ruta}`} tabIndex={0}>
            <div className={c('route-copy')}>
              <span className={c('eyebrow')}>{rutaActiva.label}</span>
              <h3>{rutaActiva.title[0]}<br />{rutaActiva.title[1]}</h3>
              <p>{rutaActiva.description}</p>
              <p className={c('route-pronto')}>Mientras llega, ya puedes estudiar con los resúmenes, el banqueo y los laboratorios.</p>
              <Link className={c('button primary')} href={entrar}>{textoEntrar} <Ico id="i-arrow" /></Link>
            </div>
            <div className={c('route-visual')}>
              <span className={c('route-stamp')}>{rutaActiva.stamp}</span>
              <Mascota pausado={parado} cls="route-mascot" detalle={1} />
              <span className={c('route-visual-note')}>{rutaActiva.note}</span>
            </div>
          </div>
        </section>

        <section className={c('pricing-section wrap')} id="planes" aria-labelledby="pricing-title">
          <div className={c('center-heading')}>
            <h2 id="pricing-title">Planes de estudio</h2>
            <p>Todo MedGO se abre con un plan. Cuanto más tiempo te quedas, menos pagas al mes.</p>
          </div>
          <div className={c('plans-grid')}>
            {ofertasPara(pasarela ?? 'mercadopago').map((o) => {
              const p = o.plan;
              const bloqueo = estadoCompra(p.key);
              return (
                <article
                  key={p.key} className={c('plan-card')} data-plan={p.key} aria-labelledby={`plan-name-${p.key}`}
                  data-destacado={p.destacado ? '' : undefined} data-apagado={p.nivel === 'base' ? '' : undefined}
                >
                  {p.destacado && <span className={c('plan-cinta')}>{p.destacado}</span>}
                  <div className={c('plan-name-row')}><h3 id={`plan-name-${p.key}`}>{p.label}</h3></div>
                  <p className={c('plan-acceso')}>{o.acceso} <span>({o.tipo})</span></p>
                  <p className={c('plan-price')}>
                    <span className={c('plan-currency')}>{o.moneda}</span><span>{o.importe}</span><span className={c('plan-period')}>/ {o.periodo}</span>
                  </p>
                  <div className={c('plan-billing')}><p>{o.cobro}</p></div>
                  <button className={c('button primary plan-action')} disabled={!!bloqueo} onClick={() => suscribirme(p.key)}>{bloqueo ?? 'Empieza ahora'}</button>
                  <ul className={c('plan-features')}>
                    {o.incluye.map((i) => (
                      <li key={i.texto} data-no={i.incluido ? undefined : ''}>
                        <Ico id={i.incluido ? 'i-check' : 'i-plus'} /><span>{i.texto}{!i.incluido && <span className={c('sr-only')}> (no incluido)</span>}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className={c('pricing-aviso')} role="status">
            {pronto
              ? 'Muy pronto: estamos activando los pagos de los planes nuevos.'
              : <>Pago seguro con {pasarela === 'creem' ? 'Creem' : 'Mercado Pago'}. Al suscribirte aceptas los <Link href="/terminos" className={c('dialog-enlace')}>Términos y condiciones</Link>.</>}
          </p>
          <div className={c('pricing-access')}>
            <Ico id="i-book" />
            <p><strong>Conoce MedGO antes de elegir.</strong><span>Explora el contenido disponible y descubre cómo quieres estudiar.</span></p>
            <Link href={entrar}>{textoEntrar} <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className={c('faq-section wrap')} id="preguntas">
          <h2>Las cosas claras.</h2>
          <div className={c('faq-list')}>
            {PREGUNTAS.map((p) => (
              <details key={p.q} open={p.abierta}>
                <summary>{p.q}<Ico id="i-plus" /></summary>
                <p>{p.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={c('closing-section')}>
          <Mascota pausado={parado} cls="bot-silhouette closing-silhouette" guion="silueta" silueta />
          <div className={c('closing-copy wrap')}>
            <h2>La medicina se entiende<br />desde sus bases.</h2>
            <p>Empieza con un tema. Compréndelo, practícalo y sigue conectando.</p>
            <div className={c('hero-actions')}>
              <Link className={c('button primary')} href={entrar}>{textoEntrar} <Ico id="i-arrow" /></Link>
              <a className={c('button secondary')} href="#planes">Ver los planes</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {comprar && <SubscribeModal open planKey={comprar} onClose={() => setComprar(null)} />}
      <div className={c('sr-only')} role="status">{`Ruta ${rutaActiva.stamp}: ${rutaActiva.note}`}</div>
    </div>
  );
}

/** Los iconos del prototipo, como símbolos que reusan los `<use>`. */
function SimbolosSvg() {
  return (
    <svg className={c('svg-library')} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></symbol>
        <symbol id="i-book" viewBox="0 0 24 24"><path d="M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H3zM21 4h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h5z" /></symbol>
        <symbol id="i-page" viewBox="0 0 24 24"><path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h5" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m6 12 4 4 8-8" /></symbol>
        <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6m-5 0v7L4 20h16l-6-10V3M7 15h10" /></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M3 6h1M3 12h1M3 18h1" /></symbol>
        <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.4a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.9a5.3 5.3 0 0 0 0-7.5ZM3 11h5l2-4 3 8 2-4h6" /></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></symbol>
        <symbol id="i-play" viewBox="0 0 24 24"><path d="m9 5 11 7-11 7z" /></symbol>
        <symbol id="i-pause" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14" /></symbol>
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
        <symbol id="i-monitor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></symbol>
        <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5" /></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></symbol>
        <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10" /></symbol>
        <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 11v6M12 7h.01" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v5l3 2" /></symbol>
        <symbol id="i-expand" viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" /></symbol>
        <symbol id="i-quiz" viewBox="0 0 24 24"><path d="M8 3h8v4H8zM8 5H5v16h14V5h-3M8 12h2M13 12h3M8 17h2M13 17h3" /></symbol>
        <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5" /></symbol>
        <symbol id="i-cube" viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5zM3 8v9l9 5 9-5V8M12 13v9" /></symbol>
        <symbol id="i-bookmark" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z" /></symbol>
        <symbol id="i-circle-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></symbol>
        <symbol id="i-reset" viewBox="0 0 24 24"><path d="M3 11a9 9 0 1 1 3 8M3 4v7h7" /></symbol>
        <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M8 3h8l-1 6 4 4H5l4-4zM12 13v8" /></symbol>
        <symbol id="i-cards" viewBox="0 0 24 24"><rect x="3" y="7" width="14" height="13" rx="2" /><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2" /></symbol>
      </defs>
    </svg>
  );
}

/** La marca de acierto o fallo de la hoja de examen real (QuizEncib). */
function MarcaExamen({ ok }: { ok?: boolean }) {
  return (
    <svg className={c('ex-marca')} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2" />
      {ok
        ? <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  );
}
