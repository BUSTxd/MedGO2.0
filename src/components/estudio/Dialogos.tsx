'use client';
import { useEffect, useRef, useState } from 'react';
import { cx, Icono } from './Icono';
import { norm } from './texto';
import type { CursoEstudio, CursoListado } from '@/lib/estudio/tipos';

/** Cierra al pulsar el fondo, no el diálogo. */
function Fondo({ onCerrar, children }: { onCerrar: () => void; children: React.ReactNode }) {
  return (
    <div className={cx('overlay-backdrop')} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      {children}
    </div>
  );
}

/** Busca en las clases del curso abierto y entre los demás cursos (por nombre). */
export function Buscador({ curso, cursos, onCerrar, onAbrir, onCurso }: {
  curso: CursoEstudio; cursos: CursoListado[]; onCerrar: () => void; onAbrir: (id: string) => void; onCurso: (slug: string) => void;
}) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const q = norm(query);
  const clases = curso.groups
    .flatMap((g) => g.lessons.map((l) => ({ l, g })))
    .filter(({ l, g }) => !q || norm(`${l.title} ${l.subtemas.join(' ')} ${g.title}`).includes(q))
    .slice(0, 8);
  const otros = q ? cursos.filter((c) => c.id !== curso.id && norm(c.name).includes(q)).slice(0, 4) : [];
  const primero = () => { if (clases[0]) onAbrir(clases[0].l.id); else if (otros[0]) onCurso(otros[0].id); };
  return (
    <Fondo onCerrar={onCerrar}>
      <section className={cx('search-dialog')} role="dialog" aria-modal="true" aria-labelledby="search-heading" tabIndex={-1}>
        <div className={cx('dialog-search-row')}>
          <Icono n="search" />
          <input ref={input} placeholder="¿Qué quieres estudiar?" aria-label="Buscar una clase o tema" autoComplete="off" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') primero(); }} />
          <button aria-label="Cerrar búsqueda" onClick={onCerrar}><kbd>ESC</kbd></button>
        </div>
        <div className={cx('search-results')}>
          {clases.length || otros.length ? (
            <>
              {clases.map(({ l, g }) => (
                <button key={l.id} className={cx('search-result')} onClick={() => onAbrir(l.id)}>
                  <Icono n={l.bloqueada ? 'lock' : 'document'} />
                  <span>{l.title}<small>{curso.name} · {g.title}</small></span>
                  <Icono n="arrow" cls="result-arrow" />
                </button>
              ))}
              {otros.map((c) => (
                <button key={c.id} className={cx('search-result')} onClick={() => onCurso(c.id)}>
                  <Icono n="book" />
                  <span>{c.name}<small>Abrir el curso</small></span>
                  <Icono n="arrow" cls="result-arrow" />
                </button>
              ))}
            </>
          ) : <div className={cx('empty-state')}>Prueba con otro tema o con el nombre de un curso.</div>}
        </div>
        <div className={cx('search-footer')} id="search-heading">Busca en {curso.name} y en tus cursos · Enter para abrir el primer resultado</div>
      </section>
    </Fondo>
  );
}
