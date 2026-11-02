'use client';
// Pestaña «Notas» de una clase: el resumen práctico en recuadros. Cada hallazgo
// muestra sus dos columnas a la vez, y lo que es una cadena de causas va como cadena.
// El contenido lo manda el servidor solo a quien tiene el plan (`clase` en cursos.ts).

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { LadoNota } from '@/lib/data/notas/tipos';
import { cx, Icono } from './Icono';
import { TarjetaLaboratorio } from './Lector';
import type { Contexto } from './EspacioEstudio';

const ElegirPlan = dynamic(() => import('@/components/planes/ElegirPlan'), { ssr: false });

const TONOS = ['nota-a', 'nota-b'] as const;

function Lado({ etiqueta, valor, tono }: { etiqueta: string; valor: LadoNota; tono: string }) {
  return (
    <div className={cx('nota-lado', tono)}>
      <span className={cx('nota-rotulo')}>{etiqueta}</span>
      {Array.isArray(valor)
        ? <ul>{valor.map((v) => <li key={v}>{v}</li>)}</ul>
        : <p>{valor}</p>}
    </div>
  );
}

export default function Notas({ ctx }: { ctx: Contexto }) {
  const { course: c, lesson: l, group: g } = ctx;
  const [comprar, setComprar] = useState(false);
  const n = l.notas;
  const ir = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={cx('reading-layout')} id="study-content" role="tabpanel" aria-labelledby="notes-tab">
      <div className={cx('article-scroller')} tabIndex={0} aria-label="Notas de la clase">
        <article className={cx('article', 'notas')}>
          <div className={cx('article-topline')}>
            <div className={cx('breadcrumb')}>{c.name}<span>/</span><span>{g.title}</span></div>
          </div>
          {n ? (
            <>
              <h1>{n.titulo}</h1>
              <p className={cx('article-intro')}>{n.entrada}</p>

              <section id="notas-comparacion" className={cx('nota-seccion')}>
                <h2>{n.comparacion.titulo}</h2>
                <div className={cx('nota-rejilla')}>
                  {n.comparacion.filas.map((f) => (
                    <div key={f.nombre} className={cx('nota-recuadro')}>
                      <h3>{f.nombre}</h3>
                      <div className={cx('nota-lados')}>
                        <Lado etiqueta={n.comparacion.columnas[0]} valor={f.a} tono={TONOS[0]} />
                        <Lado etiqueta={n.comparacion.columnas[1]} valor={f.b} tono={TONOS[1]} />
                      </div>
                      {f.clave && <p className={cx('nota-clave')}><Icono n="bulb" />{f.clave}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <section id="notas-claves" className={cx('nota-seccion')}>
                <h2>{n.claves.titulo}</h2>
                <div className={cx('nota-rejilla')}>
                  {n.claves.filas.map((f) => (
                    <div key={f.nombre} className={cx('nota-recuadro', f.flujo && 'nota-ancho')}>
                      <h3>{f.nombre}</h3>
                      <span className={cx('nota-rotulo', TONOS[f.columna])}>{f.donde}</span>
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
            </>
          ) : (
            <>
              <h1>{l.title}</h1>
              <section className={cx('key-card')}>
                <div className={cx('key-card-title')}><Icono n="lock" />Notas de la clase</div>
                <ul><li>El resumen práctico de esta clase se abre con cualquier plan de MedGO.</li></ul>
                <div className={cx('resumen-opciones')}>
                  <button className={cx('button')} onClick={() => setComprar(true)}><Icono n="lock" />Ver los planes</button>
                </div>
              </section>
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
        {n && (
          <>
            <div className={cx('eyebrow')}>En estas notas</div>
            <nav className={cx('toc')} aria-label="Índice de las notas">
              <button onClick={() => ir('notas-comparacion')}>{n.comparacion.titulo}</button>
              <button onClick={() => ir('notas-claves')}>{n.claves.titulo}</button>
            </nav>
          </>
        )}
        {l.laboratorio && (
          <>
            {n && <div className={cx('aside-divider')} />}
            <div className={cx('eyebrow')}>Llévalo a la práctica</div>
            <TarjetaLaboratorio lab={l.laboratorio} />
          </>
        )}
      </aside>
      {comprar && <ElegirPlan requisito={c.requisito} onClose={() => setComprar(false)} />}
    </div>
  );
}
