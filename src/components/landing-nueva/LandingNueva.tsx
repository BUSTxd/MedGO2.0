'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { PLANS, type PlanKey, type ProfilePlan } from '@/lib/plans';
import { c } from './estilos';
import Mascota from './Mascota';
import DemoEspacio from './DemoEspacio';
import { Ico, teclasDePestanas } from './piezas';
import { PREGUNTAS, RUTAS, planesDe, soles, type CuentaBiblioteca, type PlanLanding, type RutaLanding, type TramoLanding } from './datos';

// El SDK de Mercado Pago sólo baja al abrir la compra (como en `Pricing.tsx`).
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

/**
 * La landing nueva de MedGO (port del prototipo `prototipos/espacio-estudio/landing`),
 * en ruta provisional. Los CTA llevan al espacio de estudio (`/estudio`, que pide
 * sesión) y los planes son los reales: importes de `PLANS` y la compra de siempre
 * (`SubscribeModal`, Mercado Pago), con el mismo flujo que `Pricing.tsx`.
 */

const ESPACIO = '/estudio';
const LABORATORIO = '/estudio/laboratorio';

/** Las dos siluetas de la portada se miran entre ellas, hacia el título. */
const MIRA_DERECHA = { yaw: 0.75, pitch: 0.15 };
const MIRA_IZQUIERDA = { yaw: -0.75, pitch: 0.1 };
const SALUDO_REPOSO ='MedGO te acompaña en esta demostración.';
const TRAMOS: TramoLanding[] = ['medicina', 'basico'];
/** Lo que tardan las tarjetas de planes en irse antes de que entren las del otro tramo. */
const SALIDA_PLANES = 190;

export default function LandingNueva({ biblioteca }: { biblioteca: CuentaBiblioteca }) {
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

  // ── Saludo de DOT ──
  const [saludo, setSaludo] = useState(SALUDO_REPOSO);
  const reloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const saludar = () => {
    clearTimeout(reloj.current);
    setSaludo('¡Hola! Un tema a la vez. Vamos contigo.');
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

  // ── Planes: el cambio de tramo va animado ──
  // La pestaña elegida se marca al instante (la píldora se desliza hasta ella); las
  // tarjetas salen hacia un lado y entran las del otro tramo desde el contrario, una tras otra.
  const [pestanaTramo, setPestanaTramo] = useState<TramoLanding>('medicina');
  const [tramo, setTramo] = useState<TramoLanding>('medicina');
  const [fase, setFase] = useState<'quieto' | 'saliendo' | 'entrando'>('quieto');
  const [sentido, setSentido] = useState(1);
  const cambio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const elegirTramo = (t: TramoLanding) => {
    if (t === pestanaTramo) return;
    setPestanaTramo(t);
    setSentido(TRAMOS.indexOf(t) > TRAMOS.indexOf(pestanaTramo) ? 1 : -1);
    clearTimeout(cambio.current);
    if (parado) { setTramo(t); setFase('quieto'); return; }
    setFase('saliendo');
    cambio.current = setTimeout(() => { setTramo(t); setFase('entrando'); }, SALIDA_PLANES);
  };
  useEffect(() => () => clearTimeout(cambio.current), []);
  const pestanas = useRef<Record<TramoLanding, HTMLButtonElement | null>>({ medicina: null, basico: null });
  const [pildora, setPildora] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const medir = () => {
      const b = pestanas.current[pestanaTramo];
      if (b) setPildora({ x: b.offsetLeft, w: b.offsetWidth });
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [pestanaTramo]);
  const [plan, setPlan] = useState<PlanLanding | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const abrirPlan = (p: PlanLanding) => { setPlan(p); requestAnimationFrame(() => dialogo.current?.showModal()); };

  // ── La compra real (el flujo de `Pricing.tsx`) ──
  // Sin sesión, el plan lleva al login; con sesión se pide el plan vigente: quien ya paga
  // ve «Tu plan actual» y no puede volver a comprar, y su tramo se abre solo.
  const router = useRouter();
  const { user } = useAuth();
  const [planActual, setPlanActual] = useState<{ plan: ProfilePlan; isActive: boolean } | null>(null);
  const [comprar, setComprar] = useState<PlanKey | null>(null);
  useEffect(() => {
    if (!user) { setPlanActual(null); return; }
    let cancelado = false;
    fetch('/api/subscriptions/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelado || !json?.planState) return;
        const ps = json.planState as { plan: ProfilePlan; isActive: boolean };
        setPlanActual(ps);
        if (ps.isActive && ps.plan !== 'free' && PLANS[ps.plan].track !== pestanaTramo) {
          setPestanaTramo(PLANS[ps.plan].track); setTramo(PLANS[ps.plan].track);
        }
      })
      .catch(() => {});
    return () => { cancelado = true; };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  const yaPaga = !!planActual?.isActive && planActual.plan !== 'free';
  /** Lo que dice (y si se puede pulsar) el botón de compra de un plan de pago. */
  const estadoCompra = (key: PlanKey) =>
    !yaPaga ? null : planActual!.plan === key ? 'Tu plan actual' : 'Ya tienes un plan activo';
  const empezarGratis = () => router.push(user ? ESPACIO : '/auth/login?signup=1');
  const suscribirme = (key: PlanKey) => {
    dialogo.current?.close();
    if (!user) { router.push(`/auth/login?next=${encodeURIComponent('/landing-nueva#planes')}`); return; }
    if (estadoCompra(key)) return;
    // El diálogo vive en la capa superior del navegador: el modal de pago se abre al cerrarlo.
    requestAnimationFrame(() => setComprar(key));
  };

  return (
    <div className={c('pagina')} data-motion={parado ? 'paused' : 'active'}>
      <a className={c('skip-link')} href="#contenido">Ir al contenido</a>
      <SimbolosSvg />

      <header className={c('site-header wrap')} id="inicio">
        <a className={c('brand')} href="#inicio" aria-label="GO, inicio"><span className={c('brand-mark')} aria-hidden="true" /></a>
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
          <a className={c('header-secondary')} href="#espacio">Conocer GO</a>
          <Link className={c('button primary small')} href={ESPACIO}>Entrar a la demo <Ico id="i-arrow" /></Link>
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
              <strong>Tu nuevo espacio de estudio</strong><span>Conoce GO</span><span className={c('announcement-arrow')} aria-hidden="true">↗</span>
            </a>
            <h1 id="hero-title" aria-label="Conoce MedGO">
              <span>Conoce</span>
              <button className={c('title-mascot mascot-button')} aria-label="Saludar a la mascota de MedGO" onClick={saludar}><Mascota pausado={parado} cls="" detalle={1} /></button>
              <span>MedGO</span>
            </h1>
            <p className={c('hero-description')}>Un compañero para tu espacio de estudio médico.<br />Comprende, practica y explora. Todo sigue el hilo de tu aprendizaje.</p>
            <div className={c('hero-actions')}>
              <Link className={c('button primary')} href={ESPACIO}><Ico id="i-book" />Probar mi espacio</Link>
              <a className={c('button secondary')} href="#rutas">Explorar las rutas</a>
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
            <span>Tu temario. Tus recursos. Un mismo espacio.</span>
            <button className={c('motion-control')} disabled={reducido} onClick={() => setPausado((p) => !p)}>
              <Ico id={parado ? 'i-play' : 'i-pause'} />
              <span>{reducido ? 'Movimiento reducido' : parado ? 'Activar movimiento' : 'Pausar movimiento'}</span>
            </button>
          </div>
        </section>

        <section className={c('intro-section wrap')} id="espacio">
          <div className={c('intro-copy')}>
            <p className={c('eyebrow')}>MENOS VUELTAS. MÁS MEDICINA.</p>
            <h2>De encontrar tu clase<br />a estar aprendiendo.</h2>
            <p className={c('section-description')}>Tu temario a un lado. El resumen, la práctica y los recursos al frente. Un espacio pensado para seguir estudiando.</p>
            <Link className={c('text-action')} href={ESPACIO}>Conoce el espacio de estudio <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={c('intro-illustration')} aria-hidden="true"><Mascota pausado={parado} cls="feature-mascot" guion="cardinal" detalle={2} /></div>
        </section>

        <section className={c('resources-section wrap')} id="recursos">
          <div className={c('center-heading')}>
            <h2>Distintas formas.<br />Una misma idea.</h2>
            <p>Conecta lo que lees con lo que ves y lo que practicas.</p>
          </div>
          <div className={c('feature-grid')}>
            <article className={c('feature-card')}>
              <div className={c('feature-copy')}><h3>Comprende lo esencial.</h3><p>Resúmenes y mapas para ordenar el tema antes de memorizarlo.</p></div>
              <div className={c('mini-summary')} aria-hidden="true">
                <span className={c('card-kicker')}>MAPA DEL TEMA</span>
                <div className={c('mini-root')}>Una idea central</div>
                <div className={c('mini-branches')}><span>Relaciona</span><span>Comprende</span></div>
                <div className={c('mini-line')} /><div className={c('mini-line short')} />
              </div>
            </article>
            <article className={c('feature-card')}>
              <div className={c('feature-copy')}><h3>Llévalo a la práctica.</h3><p>Preguntas del tema para descubrir qué dominas y qué falta repasar.</p></div>
              <div className={c('mini-practice')} aria-hidden="true">
                <span className={c('card-kicker')}>UNA PREGUNTA. UNA CONEXIÓN.</span>
                <span className={c('question-line')} /><span className={c('question-line short')} />
                <div><span>A</span>Una posibilidad</div>
                <div className={c('correct')}><span>B</span>La idea que encaja <Ico id="i-check" /></div>
                <div><span>C</span>Otra posibilidad</div>
              </div>
            </article>
            <article className={c('feature-card')}>
              <div className={c('feature-copy')}><h3>Míralo de otra forma.</h3><p>Modelos, animaciones y recursos del laboratorio para explorar.</p></div>
              <div className={c('mini-lab')} aria-hidden="true">
                <div className={c('orbital orbit-a')} /><div className={c('orbital orbit-b')} />
                <Ico id="i-flask" cls="lab-symbol" />
                <span className={c('lab-dot dot-a')} /><span className={c('lab-dot dot-b')} />
                <span className={c('lab-pill')}>Explora las conexiones</span>
              </div>
            </article>
            <article className={c('feature-card')}>
              <div className={c('feature-copy')}><h3>Encuentra tu siguiente paso.</h3><p>Una ruta para organizar el estudio y volver al tema que necesitas.</p></div>
              <div className={c('mini-path')} aria-hidden="true">
                <div className={c('path-line')} />
                <div><span className={c('path-check')}>✓</span><p>Comprender el tema<small>Primero, la idea.</small></p></div>
                <div><span className={c('path-check')}>✓</span><p>Conectar las estructuras<small>Después, sus relaciones.</small></p></div>
                <div><span className={c('path-next')}>3</span><p>Practicar y repasar<small>Ahora, ponlo a prueba.</small></p></div>
              </div>
            </article>
          </div>
        </section>

        <section className={c('routes-section wrap')} id="rutas">
          <div className={c('center-heading')}>
            <h2>Tu objetivo.<br />Tu propia ruta.</h2>
            <p>Una base común, organizada para la forma en que estudias.</p>
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
              <Link className={c('button primary')} href={ESPACIO}>Explorar una clase <Ico id="i-arrow" /></Link>
            </div>
            <div className={c('route-visual')}>
              <span className={c('route-stamp')}>{rutaActiva.stamp}</span>
              <Mascota pausado={parado} cls="route-mascot" detalle={2} />
              <span className={c('route-visual-note')}>{rutaActiva.note}</span>
            </div>
          </div>
        </section>

        <section className={c('pricing-section wrap')} id="planes" aria-labelledby="pricing-title">
          <div className={c('center-heading')}>
            <h2 id="pricing-title">Planes de estudio</h2>
            <p>Empieza gratis o elige el acceso para tu etapa.</p>
          </div>
          <div className={c('pricing-tabs')} role="tablist" aria-label="Etapa de estudio para ver planes" data-pildora={pildora ? '' : undefined}>
            {pildora && <span className={c('pricing-pildora')} aria-hidden="true" style={{ transform: `translateX(${pildora.x}px)`, width: pildora.w }} />}
            {([['medicina', 'Facultad de Medicina'], ['basico', '1.er año · UFBI']] as const).map(([t, label]) => (
              <button
                key={t} ref={(el) => { pestanas.current[t] = el; }} role="tab" id={`pricing-${t}`} aria-controls="pricing-panel"
                aria-selected={pestanaTramo === t} tabIndex={pestanaTramo === t ? 0 : -1}
                onClick={() => elegirTramo(t)}
                onKeyDown={(e) => teclasDePestanas(e, TRAMOS, pestanaTramo, elegirTramo)}
              >
                {label}
              </button>
            ))}
          </div>
          <p key={tramo} className={c('pricing-track-note')} data-fase={fase}>{tramo === 'medicina' ? '2.º a 7.º año · Facultad de Medicina' : '1.er año · Ciencias Básicas · UFBI'}</p>
          <div
            className={c('plans-grid')} id="pricing-panel" role="tabpanel" aria-labelledby={`pricing-${tramo}`}
            data-fase={fase} style={{ '--sentido': sentido } as React.CSSProperties}
          >
            {planesDe(tramo).map((p, i) => {
              const bloqueo = p.key === 'free' ? null : estadoCompra(p.key);
              return (
                <article key={`${tramo}-${p.key}`} className={c('plan-card')} data-plan={p.key} aria-labelledby={`plan-name-${p.key}`} style={{ '--i': i } as React.CSSProperties}>
                  <div className={c('plan-name-row')}><h3 id={`plan-name-${p.key}`}>{p.name}</h3></div>
                  <Precio p={p} />
                  <div className={c('plan-billing')}><p>{p.billing}</p><small>{p.note}</small></div>
                  {p.key === 'free'
                    ? <button className={c('button primary plan-action')} onClick={empezarGratis}>{p.cta}</button>
                    : bloqueo
                      ? <button className={c('button primary plan-action')} disabled>{bloqueo}</button>
                      : <button className={c('button primary plan-action')} aria-haspopup="dialog" onClick={() => abrirPlan(p)}>{p.cta}</button>}
                  <p className={c('plan-includes')}>{p.intro}</p>
                  <Beneficios lista={p.summary} />
                </article>
              );
            })}
          </div>
          <div className={c('pricing-access')}>
            <Ico id="i-book" />
            <p><strong>Conoce tu espacio antes de elegir.</strong><span>Explora una clase y encuentra tu forma de estudiar.</span></p>
            <Link href={ESPACIO}>Probar la demo <span aria-hidden="true">↗</span></Link>
          </div>
          <div className={c('sr-only')} role="status">
            {`Planes de ${tramo === 'medicina' ? 'Medicina' : 'primer año, UFBI'}: ${planesDe(tramo).map((p) => p.name).join(', ')}.`}
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
            <h2>Tu próxima clase<br />ya tiene su espacio.</h2>
            <p>Un tema. Un paso. Un poco más cerca.</p>
            <div className={c('hero-actions')}>
              <Link className={c('button primary')} href={ESPACIO}>Probar mi espacio <Ico id="i-arrow" /></Link>
              <a className={c('button secondary')} href="#rutas">Elegir mi ruta</a>
            </div>
          </div>
        </section>
      </main>

      <footer className={c('site-footer wrap')}>
        <div className={c('footer-top')}>
          <a className={c('brand')} href="#inicio" aria-label="GO, volver al inicio"><span className={c('brand-mark')} aria-hidden="true" /></a>
          <span>Medicina, a tu ritmo.</span>
          <a href="#inicio">Volver arriba ↗</a>
        </div>
        <div className={c('footer-bottom')}><span>GO · Prototipo visual</span><span>Diseñado para sentarte a estudiar.</span></div>
      </footer>

      <dialog ref={dialogo} className={c('plan-dialog')} aria-labelledby="plan-dialog-title" aria-describedby="plan-dialog-description" onClose={() => setPlan(null)}>
        <button className={c('dialog-close')} aria-label="Cerrar detalle del plan" onClick={() => dialogo.current?.close()}><Ico id="i-plus" /></button>
        <p className={c('eyebrow')}>DETALLE DEL PLAN</p>
        <h2 id="plan-dialog-title">{plan?.name}</h2>
        {plan && <Precio p={plan} />}
        <p className={c('dialog-billing')}>{plan?.billing}</p>
        <p className={c('dialog-note')}>{plan?.note}</p>
        <p className={c('plan-includes')}>{plan?.intro}</p>
        {plan && <Beneficios lista={plan.features} />}
        <p id="plan-dialog-description" className={c('dialog-preview-note')}>
          Pago seguro con Mercado Pago. Al suscribirte aceptas los <Link href="/terminos" className={c('dialog-enlace')}>Términos y condiciones</Link>.
        </p>
        {plan && plan.key !== 'free' && (() => {
          const key = plan.key;
          const bloqueo = estadoCompra(key);
          const cadencia = PLANS[key].durationDays >= 365 ? 'al año' : 'al mes';
          return (
            <button className={c('button primary')} disabled={!!bloqueo} onClick={() => suscribirme(key)}>
              {bloqueo ?? `Suscribirme · S/ ${soles(PLANS[key].amount)} ${cadencia}`}
              {!bloqueo && <Ico id="i-arrow" />}
            </button>
          );
        })()}
      </dialog>
      {comprar && <SubscribeModal open planKey={comprar} onClose={() => setComprar(null)} />}
      <div className={c('sr-only')} role="status">{`Ruta ${rutaActiva.stamp}: ${rutaActiva.note}`}</div>
    </div>
  );
}

function Precio({ p }: { p: PlanLanding }) {
  return (
    <p className={c('plan-price')}>
      <span className={c('plan-currency')}>S/</span><span>{p.price}</span>
      {p.period && <span className={c('plan-period')}>{p.period}</span>}
    </p>
  );
}

function Beneficios({ lista }: { lista: string[] }) {
  return (
    <ul className={c('plan-features')}>
      {lista.map((f) => <li key={f}><Ico id="i-check" /><span>{f}</span></li>)}
    </ul>
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
