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
const ElegirPlan = dynamic(() => import('@/components/planes/ElegirPlan'), { ssr: false });

const ICONO: Record<TipoPractica, NombreIcono> = {
  examen: 'quiz', banco: 'grid', tarjetas: 'layers', solucionario: 'bulb', propuestos: 'document', casos: 'stethoscope',
};
const RUBRO: Record<TipoPractica, string> = {
  examen: 'Preguntas tipo examen', banco: 'Banco por temas', tarjetas: 'Repaso activo',
  solucionario: 'Paso a paso', propuestos: 'Para resolver', casos: 'Razonamiento clínico',
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
            {l.practica.map((p) => (
              <TarjetaPractica key={p.tipo} p={p} cargando={pendiente && abriendo === p.tipo} ocupado={pendiente}
                onAbrir={() => abrir(p)} onLeer={leer} />
            ))}
          </div>
        ) : (
          <div className={cx('sim-setup')}>
            <Icono n="quiz" />
            <h2>{l.encib || l.basicas ? 'Este tema' : 'Esta clase'} todavía no tiene banqueo</h2>
            <p>Cuando lo subamos aparecerá aquí, junto a sus explicaciones. Mientras tanto, sigue con {l.encib ? 'lo que pide el temario' : l.basicas ? 'los puntos del tema' : 'el resumen'} y marca lo que vayas estudiando.</p>
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
      {comprar && <ElegirPlan requisito={c.requisito} onClose={() => setComprar(false)} />}
    </div>
  );
}

/** Lo que el alumno dejó en una ronda de casos (lo guarda `CasosClinicos` en este navegador). */
type Avance = { fase: 'caso' | 'informe'; respondidos: number; total: number; pos: number };

function useAvanceCasos(examKey?: string): Avance | null {
  const [avance, setAvance] = useState<Avance | null>(null);
  // Tras montar: el servidor no ve el `localStorage` y la primera pintura debe coincidir.
  useEffect(() => {
    if (!examKey) return;
    try {
      const g = JSON.parse(localStorage.getItem(`medgo:casos:v1:${examKey}`) ?? 'null') as
        { fase?: string; ronda?: unknown; pos?: number; respuestas?: Record<string, number> } | null;
      if (!g || !Array.isArray(g.ronda) || !g.ronda.length || (g.fase !== 'caso' && g.fase !== 'informe')) return;
      const ronda = g.ronda as string[];
      const respondidos = ronda.filter((id) => g.respuestas && id in g.respuestas).length;
      setAvance({ fase: g.fase, respondidos, total: ronda.length, pos: Math.min(g.pos ?? 0, ronda.length - 1) });
    } catch { /* sin almacenamiento: la tarjeta queda como nueva */ }
  }, [examKey]);
  return avance;
}

/**
 * Una entrada de la lista de práctica. Toda la tarjeta abre el runner (el botón se
 * estira por debajo con `::after`); los propuestos con varios documentos, no, porque
 * cada botón abre uno distinto.
 */
function TarjetaPractica({ p, cargando, ocupado, onAbrir, onLeer }: {
  p: PracticaEstudio;
  cargando: boolean;
  ocupado: boolean;
  onAbrir: () => void;
  onLeer: (d: NonNullable<PracticaEstudio['documentos']>[number]) => void;
}) {
  const avance = useAvanceCasos(p.tipo === 'casos' ? p.examKey : undefined);
  const docs = p.documentos;
  const entera = !docs || docs.length === 1;
  const muestra = p.cuenta && p.cuenta.abiertos < p.cuenta.total ? p.cuenta : null;
  const accion = avance?.fase === 'caso' ? 'Seguir' : avance?.fase === 'informe' ? 'Ver tu resultado' : 'Empezar';

  return (
    <article className={cx('practica-item', entera && 'practica-item-abre')}>
      <div className={cx('practica-cuerpo')}>
        <div className={cx('eyebrow')}><Icono n={ICONO[p.tipo]} />{RUBRO[p.tipo]}</div>
        <h2>{p.titulo}</h2>
        <p>{p.desc}</p>
        {p.chips.length > 0 && (
          <div className={cx('practica-chips')}>{p.chips.map((ch) => <span key={ch}>{ch}</span>)}</div>
        )}
        {p.cuenta && (
          <div className={cx('practica-meta')}>
            <span>{p.cuenta.total} casos</span>
            {muestra && <span className={cx('practica-muestra')}><Icono n="lock" />Sin plan abres {muestra.abiertos} de {muestra.total}</span>}
          </div>
        )}
        {avance && (
          <div className={cx('practica-avance')}>
            <span className={cx('practica-barra')} aria-hidden="true"><span style={{ width: `${(avance.respondidos / avance.total) * 100}%` }} /></span>
            <span>
              {avance.fase === 'caso'
                ? `Vas por el caso ${avance.pos + 1} de ${avance.total}`
                : `Terminaste una ronda de ${avance.total} ${avance.total === 1 ? 'caso' : 'casos'}`}
            </span>
          </div>
        )}
      </div>
      <div className={cx('practica-acciones')}>
        {docs ? docs.map((d) => (
          <button key={d.id} className={cx('button', docs.length > 1 && 'secondary', entera && 'practica-abre')} onClick={() => onLeer(d)}>
            <Icono n={d.bloqueado ? 'lock' : 'document'} />{docs.length > 1 ? d.label : 'Abrir'}
          </button>
        )) : (
          <button className={cx('button', 'practica-abre')} onClick={onAbrir} disabled={ocupado} aria-busy={cargando || undefined}
            aria-label={cargando ? undefined : `${accion}: ${p.titulo}`}>
            {cargando ? <span className={cx('practica-rueda')} aria-hidden="true" /> : <Icono n="arrow" />}
            {cargando ? 'Abriendo…' : accion}
          </button>
        )}
      </div>
    </article>
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
