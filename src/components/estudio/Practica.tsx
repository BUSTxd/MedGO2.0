'use client';
import { useCallback, useEffect, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import { rutaEnEstudio } from '@/lib/estudio/rutas';
import type { PracticaEstudio, ResumenEstudio, TipoPractica } from '@/lib/estudio/tipos';
import { RutaInterfazProvider } from '@/components/RutaInterfaz';
import panel from '@/styles/dashboardLayout.module.css';
import { cx, Icono, type NombreIcono } from './Icono';
import { TarjetaLaboratorio } from './Lector';
import type { Contexto } from './EspacioEstudio';

// Los propuestos se leen en los mismos visores que el resumen; sólo bajan al abrirlos.
const HtmlFullscreenModal = dynamic(() => import('@/components/HtmlFullscreenModal'), { ssr: false });
const PdfFullscreenModal = dynamic(() => import('@/components/PdfFullscreenModal'), { ssr: false });
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

const ICONO: Record<TipoPractica, NombreIcono> = {
  examen: 'quiz', banco: 'grid', tarjetas: 'layers', solucionario: 'bulb', propuestos: 'document',
};
const RUBRO: Record<TipoPractica, string> = {
  examen: 'Preguntas tipo examen', banco: 'Banco por temas', tarjetas: 'Repaso activo',
  solucionario: 'Paso a paso', propuestos: 'Para resolver',
};

/** La lista de banqueos de la clase. Cada runner se abre con `?practica=<tipo>`. */
export function Practica({ ctx }: { ctx: Contexto }) {
  const { lesson: l, course: c } = ctx;
  const router = useRouter();
  const [abriendo, setAbriendo] = useState<TipoPractica | null>(null);
  const [pendiente, empezar] = useTransition();
  const [documento, setDocumento] = useState<ResumenEstudio | null>(null);
  const [comprar, setComprar] = useState(false);

  const abrir = (p: PracticaEstudio) => {
    trackEvent('banco_iniciado', { claseId: l.id, examKey: p.tipo, origen: 'estudio' });
    setAbriendo(p.tipo);
    empezar(() => router.push(`/estudio/upch/${c.id}/${l.id}?practica=${p.tipo}`, { scroll: false }));
  };
  const leer = (d: NonNullable<PracticaEstudio['documentos']>[number]) => {
    if (d.bloqueado) { setComprar(true); return; }
    trackEvent('banco_iniciado', { claseId: l.id, examKey: d.id, origen: 'estudio' });
    setDocumento(d);
  };

  return (
    <div className={cx('practice-wrap')} id="study-content" role="tabpanel" aria-labelledby="practice-tab">
      <div className={cx('practice-inner')}>
        <div className={cx('practice-head')}>
          <div><h1>Aprende practicando</h1><p>{l.title}</p></div>
        </div>

        {l.practica.length ? (
          <div className={cx('practica-lista')}>
            {l.practica.map((p) => {
              const cargando = pendiente && abriendo === p.tipo;
              return (
                <article key={p.tipo} className={cx('practica-item')}>
                  <span className={cx('practica-icono')}><Icono n={ICONO[p.tipo]} /></span>
                  <div className={cx('practica-cuerpo')}>
                    <div className={cx('eyebrow')}>{RUBRO[p.tipo]}</div>
                    <h2>{p.titulo}</h2>
                    <p>{p.desc}</p>
                    {p.chips.length > 0 && (
                      <div className={cx('practica-chips')}>{p.chips.map((ch) => <span key={ch}>{ch}</span>)}</div>
                    )}
                  </div>
                  <div className={cx('practica-acciones')}>
                    {p.documentos ? p.documentos.map((d) => (
                      <button key={d.id} className={cx('button', p.documentos!.length > 1 && 'secondary')} onClick={() => leer(d)}>
                        <Icono n={d.bloqueado ? 'lock' : 'document'} />{p.documentos!.length > 1 ? d.label : 'Abrir'}
                      </button>
                    )) : (
                      <button className={cx('button')} onClick={() => abrir(p)} disabled={pendiente} aria-busy={cargando || undefined}>
                        {cargando ? <span className={cx('practica-rueda')} aria-hidden="true" /> : <Icono n="arrow" />}
                        {cargando ? 'Abriendo…' : 'Empezar'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={cx('sim-setup')}>
            <Icono n="quiz" />
            <h2>Esta clase todavía no tiene banqueo</h2>
            <p>Cuando lo subamos aparecerá aquí, junto a sus explicaciones. Mientras tanto, sigue con el resumen y marca lo que vayas estudiando.</p>
          </div>
        )}

        {l.laboratorio && (
          <section className={cx('practica-lab')} aria-label="Llévalo a la práctica">
            <div className={cx('eyebrow')}>Llévalo a la práctica</div>
            <TarjetaLaboratorio lab={l.laboratorio} />
          </section>
        )}
      </div>

      {documento && (documento.formato === 'html'
        ? <HtmlFullscreenModal claseId={documento.id} titulo={l.title} onClose={() => setDocumento(null)} />
        : <PdfFullscreenModal claseId={documento.id} onClose={() => setDocumento(null)} />)}
      {comprar && <SubscribeModal open planKey={c.planRequerido} onClose={() => setComprar(false)} />}
    </div>
  );
}

/** Teclas con las que responde un runner (A–E, 1–5, Enter, flechas, espacio). */
const esTeclaDeRunner = (e: KeyboardEvent) =>
  !e.ctrlKey && !e.metaKey && !e.altKey && (e.key.length === 1 || /^(Enter|Arrow|Backspace)/.test(e.key));

/**
 * El runner abierto (la página que pinta `?practica=`), en el panel de práctica.
 *
 * Va con el panel del dashboard (`.panel`, su modo oscuro) y FUERA del reset de la
 * interfaz (`.practica-zona`, ver el CSS): los runners están maquetados contando
 * con el de `globals.css`. Sus enlaces siguen siendo del dashboard; aquí se
 * reconducen a la interfaz: la vuelta a la clase deja la lista de práctica y el
 * resto (un resumen, otra clase) abre el lector.
 *
 * Al cambiar a «Resumen» el runner sigue montado (no se pierde lo respondido),
 * pero sus atajos de teclado se callan mientras no se ve.
 */
export function ZonaPractica({ ctx, oculta, children }: { ctx: Contexto; oculta: boolean; children: React.ReactNode }) {
  const { course: c, lesson: l, set } = ctx;
  const router = useRouter();
  const clase = `/estudio/upch/${c.id}/${l.id}`;

  const traducir = useCallback((href: string) => rutaEnEstudio(href) ?? href, []);
  const ir = useCallback((destino: string) => {
    const url = new URL(destino, location.origin);
    const enCurso = url.pathname.startsWith('/estudio/upch/');
    const vuelve = url.pathname === clase && !url.searchParams.has('resumen');
    if (enCurso) set(() => ({ tab: vuelve ? 'practice' : 'summary' }));
    // La interfaz no lee la query de una clase (`?resumen=1&opcion=…`): basta la ruta.
    router.push(enCurso ? url.pathname : url.pathname + url.search, { scroll: false });
  }, [clase, router, set]);

  // En captura y en todo el documento: los runners también pintan por portal (visores, avisos).
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a');
      const href = a?.getAttribute('href');
      if (!a || !href || a.target === '_blank') return;
      const destino = rutaEnEstudio(href);
      if (!destino) return;
      e.preventDefault();
      e.stopPropagation();
      ir(destino);
    };
    document.addEventListener('click', alClic, true);
    return () => document.removeEventListener('click', alClic, true);
  }, [ir]);

  useEffect(() => {
    if (!oculta) return;
    const callar = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('input, textarea, [contenteditable="true"]') || !esTeclaDeRunner(e)) return;
      e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', callar, true);
    return () => window.removeEventListener('keydown', callar, true);
  }, [oculta]);

  return (
    <div className={cx('practice-wrap practica-scroll')} hidden={oculta} {...(oculta ? {} : { id: 'study-content', role: 'tabpanel', 'aria-labelledby': 'practice-tab' })}>
      <div className={`${panel.panel} ${cx('practica-zona')}`}>
        <RutaInterfazProvider value={traducir}>{children}</RutaInterfazProvider>
      </div>
    </div>
  );
}
