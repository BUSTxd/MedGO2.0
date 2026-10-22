'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/analytics';
import type { ResumenEstudio } from '@/lib/estudio/tipos';
import DocumentoResumen from '@/components/resumen/DocumentoResumen';
import rs from '@/styles/resumenHtml.module.css';
import { useRouter } from 'next/navigation';
import type { LabRecomendado } from '@/lib/estudio/tipos';
import { cx, Icono } from './Icono';
import type { Contexto } from './EspacioEstudio';

// Los mismos visores que la tarjeta «Resumen» del dashboard; sólo bajan al abrirlos.
const HtmlFullscreenModal = dynamic(() => import('@/components/HtmlFullscreenModal'), { ssr: false });
const PdfFullscreenModal = dynamic(() => import('@/components/PdfFullscreenModal'), { ssr: false });
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });
// react-pdf (~2 MB) sólo baja si la clase abierta tiene el resumen en PDF.
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), { ssr: false });

interface EntradaIndice { el: HTMLElement; titulo: string; nivel: number; grupo?: boolean }

const limpio = (t: string | null) => (t ?? '').replace(/\s+/g, ' ').trim();

/** El índice «En esta clase» del resumen ya inyectado: sus títulos (h1-h3) o, si no trae, sus hojas. */
function indiceDe(sheet: HTMLElement): EntradaIndice[] {
  const titulos = Array.from(sheet.querySelectorAll<HTMLElement>('h1, h2, h3'))
    .map((el) => ({ el, titulo: limpio(el.textContent), nivel: Number(el.tagName[1]) }))
    .filter((e) => e.titulo && e.el.offsetParent !== null);
  return (titulos.length ? titulos : indicePorHojas(sheet)).slice(0, 60);
}

const SEPARADOR = /^(grupo|estaci[oó]n|unidad|parte|bloque|m[oó]dulo|secci[oó]n)\s*\d+/i;

/** Lo que el título de una hoja suele arrastrar detrás: viñetas, rótulos, el arranque de una definición. */
function acortarTitulo(t: string): string {
  t = t.split('•')[0]
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\s(Objetivos?|Tarea|Localizaci[oó]n|Funci[oó]n|Caracter[ií]sticas)\b.*$/u, '')
    .replace(/(.{8,}?)\s(Es|Son)\s(el|la|los|las|un|una)\s.*$/u, '$1')
    .trim();
  const dos = t.indexOf(':');
  if (t.length > 50 && dos >= 6 && dos <= 45) t = t.slice(0, dos);
  t = t.replace(/[:·\-–—\s]+$/, '');
  return t.length > 60 ? `${t.slice(0, 60).replace(/\s+\S*$/, '')}…` : t;
}

/**
 * Envases por hojas (diapositivas de un PPTX, PDF reconstruido): el texto va
 * colocado por coordenadas y no hay <h1-h3>. El título de cada hoja es su letra
 * más grande; las hojas cuya letra mayor destaca mucho sobre la del resto del
 * documento son separadores («Grupo 1 Epitelios simples») y abren grupo.
 * Las unidades dan igual (px, cqw…): sólo se comparan dentro del documento.
 */
function indicePorHojas(sheet: HTMLElement): EntradaIndice[] {
  const shells = Array.from(sheet.querySelectorAll<HTMLElement>('.page-shell'));
  const hojas = shells.length ? shells : Array.from(sheet.querySelectorAll<HTMLElement>('.pdf-page'));
  const tamano = (el: HTMLElement) => parseFloat(el.style.fontSize) || 0;

  const porHoja = hojas.map((hoja) => {
    // Sólo los nodos con texto propio y tamaño declarado (no sus contenedores).
    const textos = Array.from(hoja.querySelectorAll<HTMLElement>('[style*="font-size"]'))
      .filter((el) => limpio(el.textContent) && !el.querySelector('[style*="font-size"]'));
    let mayor: HTMLElement | null = null;
    for (const el of textos) if (!mayor || tamano(el) > tamano(mayor)) mayor = el;
    if (!mayor) return null;
    const max = tamano(mayor);
    // El título es la LÍNEA de la letra mayor (no la caja: debajo suele ir el texto), con
    // sólo lo que va casi tan grande. Una línea muy corta («Grupo 1») sigue en la de abajo.
    const linea = mayor.closest<HTMLElement>('.p, .text-line') ?? mayor.parentElement ?? mayor;
    const grande = (l: Element) => limpio(textos.filter((el) => l.contains(el) && tamano(el) >= max * 0.75).map((el) => el.textContent).join(' '));
    let titulo = grande(linea);
    const sig = linea.nextElementSibling;
    if (titulo.length <= 25 && sig?.matches('.p, .text-line')) titulo = limpio(`${titulo} ${grande(sig)}`);
    titulo = acortarTitulo(titulo);
    return titulo ? { el: hoja, titulo, max } : null;
  }).filter((x): x is { el: HTMLElement; titulo: string; max: number } => !!x);
  if (!porHoja.length) return [];

  const ordenados = porHoja.map((h) => h.max).sort((a, b) => a - b);
  const mediana = ordenados[Math.floor(ordenados.length / 2)];
  const entradas: EntradaIndice[] = [];
  for (const h of porHoja) {
    if (h.max < mediana * 0.6) continue; // hoja sin título: sólo texto corrido o figuras
    if (entradas.at(-1)?.titulo === h.titulo) continue;
    // Separador: letra mucho mayor que la del documento, o rótulo «Grupo 2», «Estación 5»…
    const grupo = h.max >= mediana * 1.6 || SEPARADOR.test(h.titulo);
    entradas.push({ el: h.el, titulo: h.titulo, nivel: grupo ? 2 : 3, grupo });
  }
  // Sin ningún separador, todas las hojas van al mismo nivel.
  return entradas.some((e) => e.grupo) ? entradas : entradas.map((e) => ({ ...e, nivel: 2 }));
}

/** Ancho útil del artículo para el PDF (el visor de react-pdf no reflowea). */
function useAncho(ref: React.RefObject<HTMLElement | null>, activo: boolean) {
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !activo) return;
    const ro = new ResizeObserver(() => setAncho(el.clientWidth));
    ro.observe(el);
    setAncho(el.clientWidth);
    return () => ro.disconnect();
  }, [ref, activo]);
  return ancho;
}

/* eslint-disable @next/next/no-img-element */
/** «Llévalo a la práctica»: el laboratorio que el sílabo enlaza a la clase (tarjeta del prototipo). */
export function TarjetaLaboratorio({ lab }: { lab: LabRecomendado }) {
  const router = useRouter();
  return (
    <div className={cx('related-card')}>
      <div className={cx('related-art')}>
        <span className={cx('related-tag')}>{lab.etiqueta}</span>
        {lab.icono ? <img src={lab.icono} alt="" /> : <Icono n="flask" />}
      </div>
      <div className={cx('related-card-body')}>
        <h3>{lab.titulo}</h3>
        {lab.desc && <p>{lab.desc}</p>}
        <button onClick={() => router.push(lab.href)}>Abrir el laboratorio <Icono n="arrow" /></button>
      </div>
    </div>
  );
}

export function BarraLector({ ctx }: { ctx: Contexto }) {
  const { st, set, barraOculta } = ctx;
  return (
    <div className={cx('study-toolbar')} inert={barraOculta} aria-hidden={barraOculta ? 'true' : undefined}>
      <div className={cx('study-tabs')} role="tablist" aria-label="Material de la clase">
        <button id="summary-tab" className={cx('study-tab', st.tab === 'summary' && 'active')} role="tab" aria-selected={st.tab === 'summary'} aria-controls="study-content" onClick={() => set(() => ({ tab: 'summary' }))}>
          <Icono n="document" />Resumen
        </button>
        <button id="practice-tab" className={cx('study-tab', st.tab === 'practice' && 'active')} role="tab" aria-selected={st.tab === 'practice'} aria-controls="study-content" onClick={() => set(() => ({ tab: 'practice' }))}>
          <Icono n="quiz" />Práctica
        </button>
      </div>
      <div className={cx('reading-tools')}>
        <label className={cx('reading-view-switch')} title="Comparar el resumen con y sin hoja">
          <input type="checkbox" checked={st.readingSheet} disabled={st.tab !== 'summary'} onChange={(e) => {
            const readingSheet = e.target.checked;
            set(() => ({ readingSheet }));
            const url = new URL(location.href);
            if (readingSheet) url.searchParams.set('hoja', '1'); else url.searchParams.delete('hoja');
            history.replaceState(history.state, '', url);
          }} />
          <span>Hoja</span>
        </label>
        <button className={cx('focus-button')} aria-label={st.focus ? 'Salir de enfoque' : 'Enfocar'} onClick={() => set((s) => ({ focus: !s.focus }))}>
          <Icono n="expand" /><span>{st.focus ? 'Salir de enfoque' : 'Enfocar'}</span>
        </button>
      </div>
    </div>
  );
}

export default function Lector({ ctx }: { ctx: Contexto }) {
  const { st, marcas, course: c, lesson: l, group: g, lessons: list, openLesson, toast, posiciones, setBarraOculta } = ctx;
  const index = list.findIndex((a) => a.id === l.id);
  const scroller = useRef<HTMLDivElement>(null);
  const [tocActivo, setTocActivo] = useState('');
  const [abierto, setAbierto] = useState<ResumenEstudio | null>(null);
  const [comprar, setComprar] = useState(false);
  const [opcion, setOpcion] = useState(0);
  const [indice, setIndice] = useState<EntradaIndice[]>([]);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const sheetRef = useRef<HTMLElement>(null);
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const guardada = !!marcas.saved[l.id];
  const estudiada = marcas.completed.has(l.id);

  // El resumen se lee aquí mismo si la clase lo tiene y el plan lo abre.
  const resumen = !l.bloqueada ? l.resumenes[Math.min(opcion, l.resumenes.length - 1)] : undefined;
  const anchoPdf = useAncho(cuerpoRef, resumen?.formato === 'pdf');
  useEffect(() => { setOpcion(0); }, [l.id]);
  useEffect(() => { setIndice([]); setIndiceActivo(0); }, [resumen?.id]);

  // Con el documento ya en el DOM: índice, vuelta al punto de lectura y registro de la apertura.
  const alCargar = useCallback((sheet: HTMLElement) => {
    setIndice(indiceDe(sheet));
    const pos = posiciones.current[l.id];
    if (pos) requestAnimationFrame(() => scroller.current?.scrollTo({ top: pos, behavior: 'instant' }));
    if (resumen) trackEvent('resumen_abierto', { claseId: resumen.id, origen: 'estudio' });
  }, [l.id, posiciones, resumen]);

  // El índice sigue la lectura: el último título que ya pasó por arriba.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !indice.length) return;
    let raf = 0;
    const alDesplazar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tope = el.getBoundingClientRect().top + 90;
        let i = 0;
        indice.forEach((e, k) => { if (e.el.getBoundingClientRect().top <= tope) i = k; });
        setIndiceActivo(i);
      });
    };
    el.addEventListener('scroll', alDesplazar, { passive: true });
    return () => { el.removeEventListener('scroll', alDesplazar); cancelAnimationFrame(raf); };
  }, [indice]);

  // Secciones del lector (numeradas como en el prototipo); el índice «En esta clase» las sigue.
  const secciones: [string, string][] = [
    ...(l.subtemas.length ? [['section-temas', 'Temas de la clase'] as [string, string]] : []),
    ['section-resumen', l.resumenes.length > 1 ? 'Resúmenes' : 'Resumen'],
    ...(l.docentes.length ? [['section-docentes', 'Docentes'] as [string, string]] : []),
  ];
  const num = (id: string) => String(secciones.findIndex(([s]) => s === id) + 1).padStart(2, '0');

  // Cada clase recuerda dónde se quedó la lectura.
  useLayoutEffect(() => {
    scroller.current?.scrollTo({ top: posiciones.current[l.id] || 0, behavior: 'instant' });
    setTocActivo(secciones[0][0]);
  }, [l.id, posiciones]); // eslint-disable-line react-hooks/exhaustive-deps

  // La barra del lector se contrae al bajar 40 px pasados los 120 y vuelve al subir 12.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let last = el.scrollTop, direction = 0, travel = 0, settlingUntil = 0, oculta = false;
    const alDesplazar = () => {
      const y = Math.max(0, el.scrollTop), delta = y - last; last = y;
      posiciones.current[l.id] = el.scrollTop;
      if (performance.now() < settlingUntil || !delta) return;
      const bar = el.closest('section')?.querySelector('[role="tablist"]')?.parentElement;
      if (bar?.contains(document.activeElement)) return;
      const next = Math.sign(delta);
      if (direction !== next) { travel = 0; direction = next; }
      travel += Math.abs(delta);
      if (oculta && (y < 32 || (direction < 0 && travel >= 12))) { oculta = false; setBarraOculta(false); travel = 0; settlingUntil = performance.now() + 260; }
      else if (!oculta && y > 120 && direction > 0 && travel >= 40) { oculta = true; setBarraOculta(true); travel = 0; settlingUntil = performance.now() + 260; }
    };
    el.addEventListener('scroll', alDesplazar, { passive: true });
    return () => el.removeEventListener('scroll', alDesplazar);
  }, [l.id, posiciones, setBarraOculta]);

  const irASeccion = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTocActivo(id);
  };
  const guardar = () => {
    const queda = marcas.alternarGuardada(l.id, { title: l.title, curso: c.id, cursoNombre: c.name });
    toast(queda ? 'Clase guardada en Mi progreso' : 'Clase quitada de guardados');
  };
  const abrir = (r: ResumenEstudio) => {
    if (l.bloqueada) { setComprar(true); return; }
    trackEvent('resumen_abierto', { claseId: r.id, origen: 'estudio' });
    setAbierto(r);
  };

  return (
    <div className={cx('reading-layout')} id="study-content" role="tabpanel" aria-labelledby="summary-tab">
      <div className={cx('article-scroller')} id="article-scroller" ref={scroller} tabIndex={0} aria-label="Contenido de la clase" data-reading-lesson={l.id}>
        <article className={cx('article')}>
          <div className={cx('article-topline')}>
            <div className={cx('breadcrumb')}>{c.name}<span>/</span><span>{st.route === 'UPCH' ? g.title : 'Temario'}</span></div>
            <div className={cx('article-controls')}>
              <button className={cx('icon-button')} aria-label="Reducir tamaño de letra" onClick={() => marcas.setFontSize((n) => Math.max(14, n - 1))}>A−</button>
              <button className={cx('icon-button')} aria-label="Aumentar tamaño de letra" onClick={() => marcas.setFontSize((n) => Math.min(21, n + 1))}>A+</button>
              <button className={cx('icon-button', guardada && 'saved')} aria-label={guardada ? 'Quitar de guardados' : 'Guardar clase'} title="Guardar clase" onClick={guardar}>
                <Icono n="bookmark" />
              </button>
              {resumen && (
                <button className={cx('icon-button')} aria-label="Abrir el resumen a pantalla completa" title="Pantalla completa" onClick={() => setAbierto(resumen)}>
                  <Icono n="expand" />
                </button>
              )}
            </div>
          </div>
          <h1>{l.title}</h1>
          <div className={cx('article-meta')}>
            {(l.fecha || l.hora) && <span><Icono n="clock" />{[l.fecha, l.hora].filter(Boolean).join(' · ')}</span>}
            <span><Icono n="document" />{l.tipo}</span>
            <span className={cx('material-chip')}>{l.resumenes.length ? (l.bloqueada ? 'Con tu plan' : 'Con resumen') : 'Sin resumen aún'}</span>
          </div>
          {l.nota && <p className={cx('article-intro')}>{l.nota}</p>}

          {resumen ? (
            <div ref={cuerpoRef}>
              {l.resumenes.length > 1 && (
                <div className={cx('segmented resumen-selector')} role="tablist" aria-label="Resúmenes de la clase">
                  {l.resumenes.map((r, i) => (
                    <button key={r.id} role="tab" aria-selected={resumen.id === r.id} className={cx(resumen.id === r.id && 'active')} onClick={() => setOpcion(i)}>{r.label}</button>
                  ))}
                </div>
              )}
              {resumen.formato === 'html' ? (
                <DocumentoResumen
                  key={resumen.id}
                  claseId={resumen.id}
                  escala={marcas.fontSize / 16}
                  scrollerRef={scroller}
                  sheetRef={sheetRef}
                  className={rs.incrustado}
                  estadoClass={cx('article-intro')}
                  onCargado={alCargar}
                  bloquearTeclas
                />
              ) : anchoPdf > 0 ? (
                <div className={rs.incrustado} onContextMenu={(e) => e.preventDefault()}>
                  <PdfViewer key={resumen.id} claseId={resumen.id} widthOverride={anchoPdf} scale={marcas.fontSize / 16} loadingClass={cx('article-intro')} />
                </div>
              ) : null}
            </div>
          ) : (<>
          {l.subtemas.length > 0 && (
            <section id="section-temas">
              <div className={cx('section-heading')}><span>{num('section-temas')}</span><h2>Temas de la clase</h2></div>
              <ul className={cx('objectives')}>{l.subtemas.map((o) => <li key={o}><Icono n="circleCheck" /><span>{o}</span></li>)}</ul>
            </section>
          )}

          <section id="section-resumen" className={cx('key-card')}>
            <div className={cx('key-card-title')}><Icono n={l.bloqueada ? 'lock' : 'bulb'} />{secciones.find(([s]) => s === 'section-resumen')![1]}</div>
            {l.resumenes.length ? (
              <div className={cx('resumen-opciones')}>
                {l.resumenes.map((r) => (
                  <button key={r.id} className={cx('button')} onClick={() => abrir(r)}>
                    <Icono n={l.bloqueada ? 'lock' : 'document'} />
                    {l.resumenes.length > 1 ? r.label : 'Abrir el resumen'}
                  </button>
                ))}
              </div>
            ) : (
              <ul><li>Esta clase todavía no tiene resumen. Puedes repasar sus temas y seguir con la siguiente.</li></ul>
            )}
            {l.bloqueada && <ul><li>Se abre con el plan de {c.track === 'basico' ? 'UFBI' : 'la Facultad'}.</li></ul>}
          </section>

          {l.docentes.length > 0 && (
            <section id="section-docentes" className={cx('article-section')}>
              <div className={cx('section-heading')}><span>{num('section-docentes')}</span><h2>Docentes</h2></div>
              <p>{l.docentes.join(' · ')}</p>
            </section>
          )}
          </>)}

          {l.laboratorio && (
            <section className={cx('lab-reco')} aria-label="Llévalo a la práctica">
              <div className={cx('eyebrow')}>Llévalo a la práctica</div>
              <TarjetaLaboratorio lab={l.laboratorio} />
            </section>
          )}

          <div className={cx('completion-row')}>
            <span>¿Terminaste de estudiar esta clase?</span>
            <button className={cx('lesson-complete', estudiada && 'is-complete')} aria-pressed={estudiada} onClick={() => marcas.alternarEstudiada(l.id)}>
              <Icono n={estudiada ? 'circleCheck' : 'check'} />{estudiada ? 'Marcada como estudiada' : 'Marcar como estudiada'}
            </button>
          </div>
          <footer className={cx('lesson-footer')}>
            {index > 0 ? <button onClick={() => openLesson(list[index - 1].id)}><Icono n="arrowLeft" /><span>{list[index - 1].title}</span></button> : <span />}
            {index < list.length - 1 ? <button className={cx('next')} onClick={() => openLesson(list[index + 1].id)}><span>{list[index + 1].title}</span><Icono n="arrow" /></button> : <span />}
          </footer>
        </article>
      </div>
      <aside className={cx('reading-aside')} aria-label="Índice de la clase">
        <div className={cx('eyebrow')}>En esta clase</div>
        <nav className={cx('toc')} aria-label="Índice de la clase">
          {resumen
            ? indice.map((e, i) => (
              <button key={i} className={cx(indiceActivo === i && 'active', e.nivel > 2 && 'toc-sub', e.grupo && 'toc-grupo')} onClick={() => { e.el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setIndiceActivo(i); }}>
                {e.titulo}
              </button>
            ))
            : secciones.map(([id, titulo]) => <button key={id} className={cx(tocActivo === id && 'active')} onClick={() => irASeccion(id)}>{titulo}</button>)}
        </nav>
        {resumen && !indice.length && <p className={cx('aside-note')}>Este resumen va por páginas: desplázate para recorrerlo.</p>}
        {l.laboratorio && (
          <>
            <div className={cx('aside-divider')} />
            <div className={cx('eyebrow')}>Llévalo a la práctica</div>
            <TarjetaLaboratorio lab={l.laboratorio} />
          </>
        )}
        <p className={cx('aside-note')}>Este espacio recuerda tu clase mientras exploras. Elige otro tema en el temario para seguir estudiando.</p>
      </aside>

      {abierto && (abierto.formato === 'html'
        ? <HtmlFullscreenModal claseId={abierto.id} titulo={l.title} onClose={() => setAbierto(null)} />
        : <PdfFullscreenModal claseId={abierto.id} onClose={() => setAbierto(null)} />)}
      {comprar && <SubscribeModal open planKey={c.planRequerido} onClose={() => setComprar(false)} />}
    </div>
  );
}
