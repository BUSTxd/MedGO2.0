'use client';
// Pestaña «Notas»: la plantilla del resumen práctico. Un solo diseño para todas las
// clases; cada una aporta solo su contenido (`data/clases/<curso>/<clase>.json`,
// formato en docs/clases/PLANTILLA.md). Las secciones son de dos formas: comparación
// (cada hallazgo con sus columnas a la vez) y claves (uno a uno, o como cadena de causas).
// El JSON llega de `/api/estudio/notas` solo con el plan; `VistaNotas` es pura para
// poder revisarla sin navegador.

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { NotaClase, SeccionNota, ValorNota } from '@/lib/data/clases/tipos';
import { cx, Icono } from './Icono';
import { TarjetaLaboratorio } from './Lector';
import type { Contexto } from './EspacioEstudio';

const ElegirPlan = dynamic(() => import('@/components/planes/ElegirPlan'), { ssr: false });

/** Un tono por columna de la comparación; las claves sin columna van en el neutro. */
const TONOS = ['nota-a', 'nota-b', 'nota-c', 'nota-d'] as const;
const tono = (i?: number) => (i === undefined ? 'nota-n' : TONOS[i % TONOS.length]);
const idSeccion = (i: number) => `notas-${i}`;

function Lado({ etiqueta, valor, tonoLado }: { etiqueta: string; valor: ValorNota; tonoLado: string }) {
  return (
    <div className={cx('nota-lado', tonoLado)}>
      <span className={cx('nota-rotulo')}>{etiqueta}</span>
      {Array.isArray(valor)
        ? <ul>{valor.map((v) => <li key={v}>{v}</li>)}</ul>
        : <p>{valor}</p>}
    </div>
  );
}

function Seccion({ s, i }: { s: SeccionNota; i: number }) {
  if (s.tipo === 'comparacion') {
    const n = s.columnas.length;
    return (
      <section id={idSeccion(i)} className={cx('nota-seccion')}>
        <h2>{s.titulo}</h2>
        <div className={cx('nota-rejilla')}>
          {s.filas.map((f) => (
            <div key={f.nombre} className={cx('nota-recuadro', n > 2 && 'nota-ancho')}>
              <h3>{f.nombre}</h3>
              <div className={cx('nota-lados', n > 2 && `nota-lados-${n}`)}>
                {s.columnas.map((col, k) => <Lado key={col} etiqueta={col} valor={f.valores[k]} tonoLado={tono(k)} />)}
              </div>
              {f.clave && <p className={cx('nota-clave')}><Icono n="bulb" />{f.clave}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section id={idSeccion(i)} className={cx('nota-seccion')}>
      <h2>{s.titulo}</h2>
      <div className={cx('nota-rejilla')}>
        {s.filas.map((f) => (
          <div key={f.nombre} className={cx('nota-recuadro', f.flujo && 'nota-ancho')}>
            <h3>{f.nombre}</h3>
            {f.donde && <span className={cx('nota-rotulo', tono(f.columna))}>{f.donde}</span>}
            {f.texto && <p className={cx('nota-texto')}>{f.texto}</p>}
            {f.flujo && (
              <ol className={cx('nota-flujo')}>
                {f.flujo.map((paso) => <li key={paso}>{paso}</li>)}
              </ol>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Las notas ya cargadas: título, entrada y sus secciones en orden. */
export function VistaNotas({ nota }: { nota: NotaClase }) {
  return (
    <>
      <h1>{nota.titulo}</h1>
      <p className={cx('article-intro')}>{nota.entrada}</p>
      {nota.secciones.map((s, i) => <Seccion key={idSeccion(i)} s={s} i={i} />)}
    </>
  );
}

type Carga = { estado: 'cargando' } | { estado: 'error'; motivo: string } | { estado: 'lista'; clave: string; nota: NotaClase };

/** Las ya pedidas en esta visita: volver a la pestaña no las baja otra vez. */
const PEDIDAS = new Map<string, NotaClase>();

function useNotas(clave: string, activa: boolean) {
  const [carga, setCarga] = useState<Carga>(() => {
    const ya = PEDIDAS.get(clave);
    return ya ? { estado: 'lista', clave, nota: ya } : { estado: 'cargando' };
  });
  const [vuelta, setVuelta] = useState(0);
  useEffect(() => {
    if (!activa) return;
    const ya = PEDIDAS.get(clave);
    if (ya) { setCarga({ estado: 'lista', clave, nota: ya }); return; }
    setCarga({ estado: 'cargando' });
    const corte = new AbortController();
    fetch(`/api/estudio/notas/${clave}`, { signal: corte.signal })
      .then(async (r) => {
        if (!r.ok) {
          setCarga({ estado: 'error', motivo: r.status === 403 ? 'Tu sesión o tu plan ya no abren estas notas. Vuelve a entrar.' : 'No pudimos traer las notas.' });
          return;
        }
        const nota = await r.json() as NotaClase;
        PEDIDAS.set(clave, nota);
        setCarga({ estado: 'lista', clave, nota });
      })
      .catch((e: unknown) => {
        if ((e as { name?: string }).name !== 'AbortError') setCarga({ estado: 'error', motivo: 'No pudimos traer las notas.' });
      });
    return () => corte.abort();
  }, [clave, activa, vuelta]);
  const reintentar = useCallback(() => setVuelta((v) => v + 1), []);
  return { carga, reintentar };
}

export default function Notas({ ctx }: { ctx: Contexto }) {
  const { course: c, lesson: l, group: g, set } = ctx;
  const [comprar, setComprar] = useState(false);
  const clave = `${c.id}/${l.id}`;
  const { carga, reintentar } = useNotas(clave, l.notas === 'abiertas');
  // La de otra clase no se pinta ni un instante mientras llega la nueva.
  const nota = l.notas === 'abiertas' && carga.estado === 'lista' && carga.clave === clave ? carga.nota : null;
  const ir = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={cx('reading-layout', 'notas-zona')} id="study-content" role="tabpanel" aria-labelledby="notes-tab">
      <div className={cx('article-scroller')} tabIndex={0} aria-label="Notas de la clase">
        <article className={cx('article', 'notas')}>
          <div className={cx('article-topline')}>
            <div className={cx('breadcrumb')}>{c.name}<span>/</span><span>{g.title}</span></div>
          </div>
          {nota ? <VistaNotas nota={nota} /> : (
            <>
              <h1>{l.title}</h1>
              {l.notas === 'abiertas' && (carga.estado === 'error' ? (
                <div className={cx('nota-espera')}>
                  <p>{carga.motivo}</p>
                  <button className={cx('button', 'secondary')} onClick={reintentar}>Intentar de nuevo</button>
                </div>
              ) : <p className={cx('nota-espera')} aria-live="polite">Trayendo las notas…</p>)}
              {l.notas === 'bloqueadas' && (
                <section className={cx('key-card')}>
                  <div className={cx('key-card-title')}><Icono n="lock" />Notas de la clase</div>
                  <ul><li>El resumen práctico de esta clase se abre con cualquier plan de MedGO.</li></ul>
                  <div className={cx('resumen-opciones')}>
                    <button className={cx('button')} onClick={() => setComprar(true)}><Icono n="lock" />Ver los planes</button>
                  </div>
                </section>
              )}
              {l.notas === 'pronto' && (
                <div className={cx('sim-setup', 'nota-pronto')}>
                  <Icono n="bulb" />
                  <h2>Las notas de esta clase llegan pronto</h2>
                  <p>Aquí irá lo esencial en recuadros: lo que se compara, los hallazgos que no se te pueden pasar y cómo se encadenan. Mientras, estudia con el resumen.</p>
                  <button className={cx('button')} onClick={() => set(() => ({ tab: 'summary' }))}><Icono n="document" />Ir al resumen</button>
                </div>
              )}
            </>
          )}
          {l.laboratorio && (
            <section className={cx('lab-reco')} aria-label="Llévalo a la práctica">
              <div className={cx('eyebrow')}>Llévalo a la práctica</div>
              <TarjetaLaboratorio lab={l.laboratorio} />
            </section>
          )}
        </article>
      </div>
      <aside className={cx('reading-aside')} aria-label="Índice de las notas">
        {nota && (
          <>
            <div className={cx('eyebrow')}>En estas notas</div>
            <nav className={cx('toc')} aria-label="Índice de las notas">
              {nota.secciones.map((s, i) => <button key={idSeccion(i)} onClick={() => ir(idSeccion(i))}>{s.titulo}</button>)}
            </nav>
          </>
        )}
        {l.laboratorio && (
          <>
            {nota && <div className={cx('aside-divider')} />}
            <div className={cx('eyebrow')}>Llévalo a la práctica</div>
            <TarjetaLaboratorio lab={l.laboratorio} />
          </>
        )}
      </aside>
      {comprar && <ElegirPlan requisito={c.requisito} onClose={() => setComprar(false)} />}
    </div>
  );
}
