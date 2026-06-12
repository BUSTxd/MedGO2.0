'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHistoCurso } from '@/lib/data/histologia';
import styles from '@/styles/histologia.module.css';

type Foto = {
  url: string;
  clase: string;
  claseTitulo: string;
  titulo: string;
  tincion: string | null;
  aumento: string | null;
};

const TODAS = '__todas__';

export default function HistoCursoPage() {
  const { curso } = useParams<{ curso: string }>();
  const cursoData = getHistoCurso(curso);

  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // filtros
  const [fClase, setFClase] = useState<string>(TODAS);
  const [fTincion, setFTincion] = useState<string>(TODAS);
  const [fAumento, setFAumento] = useState<string>(TODAS);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!cursoData) return;
    const cacheKey = `histo-curso-${curso}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setFotos(JSON.parse(cached));
        return;
      } catch {
        /* cache corrupto: re-fetch */
      }
    }
    let cancel = false;
    fetch(`/api/histologia/${curso}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Foto[]) => {
        if (cancel) return;
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setFotos(data);
      })
      .catch(() => !cancel && setError(true));
    return () => {
      cancel = true;
    };
  }, [curso, cursoData]);

  // facetas disponibles a partir de las fotos cargadas
  const tinciones = useMemo(
    () => Array.from(new Set((fotos ?? []).map((f) => f.tincion).filter(Boolean) as string[])).sort(),
    [fotos],
  );
  const aumentos = useMemo(
    () =>
      Array.from(new Set((fotos ?? []).map((f) => f.aumento).filter(Boolean) as string[])).sort(
        (a, b) => parseInt(a) - parseInt(b),
      ),
    [fotos],
  );

  const filtradas = useMemo(() => {
    if (!fotos) return [];
    const q = query.trim().toLowerCase();
    return fotos.filter(
      (f) =>
        (fClase === TODAS || f.clase === fClase) &&
        (fTincion === TODAS || f.tincion === fTincion) &&
        (fAumento === TODAS || f.aumento === fAumento) &&
        (q === '' ||
          f.titulo.toLowerCase().includes(q) ||
          f.claseTitulo.toLowerCase().includes(q)),
    );
  }, [fotos, fClase, fTincion, fAumento, query]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const n = filtradas.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % n));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + n) % n));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, filtradas.length, closeLightbox]);

  if (!cursoData) return notFound();

  const hayFotos = fotos !== null && fotos.length > 0;

  return (
    <>
      <Link href="/dashboard/histologia" className={styles.backLink}>
        ← Histología
      </Link>

      <div className={styles.cursoHeader}>
        <span className={styles.headerIconBox} style={{ background: cursoData.badgeColor }}>
          {cursoData.icon}
        </span>
        <div>
          <h2 className={styles.title}>{cursoData.nombre}</h2>
          <span
            className={styles.badge}
            style={{ color: cursoData.badgeColor, background: cursoData.badgeBg }}
          >
            {cursoData.badge}
          </span>
        </div>
      </div>

      {/* ─── Barra de filtros ─── */}
      {hayFotos && (
        <div className={styles.filterBar}>
          <input
            className={styles.search}
            type="search"
            placeholder="Buscar preparación…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className={styles.chipRow}>
            <button
              className={`${styles.chip} ${fClase === TODAS ? styles.chipActive : ''}`}
              onClick={() => setFClase(TODAS)}
            >
              Todas las clases
            </button>
            {cursoData.clases.map((cl) => (
              <button
                key={cl.slug}
                className={`${styles.chip} ${fClase === cl.slug ? styles.chipActive : ''}`}
                onClick={() => setFClase(cl.slug)}
              >
                {cl.titulo}
              </button>
            ))}
          </div>

          {(tinciones.length > 0 || aumentos.length > 0) && (
            <div className={styles.chipRow}>
              {tinciones.length > 0 && (
                <>
                  <span className={styles.chipLabel}>Tinción</span>
                  <button
                    className={`${styles.chipSm} ${fTincion === TODAS ? styles.chipActive : ''}`}
                    onClick={() => setFTincion(TODAS)}
                  >
                    Todas
                  </button>
                  {tinciones.map((t) => (
                    <button
                      key={t}
                      className={`${styles.chipSm} ${fTincion === t ? styles.chipActive : ''}`}
                      onClick={() => setFTincion(t)}
                    >
                      {t}
                    </button>
                  ))}
                </>
              )}
              {aumentos.length > 0 && (
                <>
                  <span className={styles.chipLabel}>Aumento</span>
                  <button
                    className={`${styles.chipSm} ${fAumento === TODAS ? styles.chipActive : ''}`}
                    onClick={() => setFAumento(TODAS)}
                  >
                    Todos
                  </button>
                  {aumentos.map((a) => (
                    <button
                      key={a}
                      className={`${styles.chipSm} ${fAumento === a ? styles.chipActive : ''}`}
                      onClick={() => setFAumento(a)}
                    >
                      {a}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Estados ─── */}
      {error && (
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>No se pudo cargar la galería</p>
          <p className={styles.emptySub}>Inténtalo de nuevo en unos momentos.</p>
        </div>
      )}

      {!error && fotos === null && (
        <div className={styles.galeriaGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!error && fotos !== null && fotos.length === 0 && (
        <div className={styles.emptyBox}>
          <div className={styles.emptyIcon}>🔬</div>
          <p className={styles.emptyTitle}>Sin imágenes aún</p>
          <p className={styles.emptySub}>
            Las preparaciones de este curso se publicarán próximamente.
          </p>
        </div>
      )}

      {hayFotos && filtradas.length === 0 && (
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>Sin resultados</p>
          <p className={styles.emptySub}>Prueba con otros filtros o limpia la búsqueda.</p>
        </div>
      )}

      {hayFotos && filtradas.length > 0 && (
        <div className={styles.galeriaGrid}>
          {filtradas.map((f, i) => (
            <button key={f.url} className={styles.fotoCard} onClick={() => setLightbox(i)}>
              <span className={styles.fotoImgWrap}>
                <Image
                  src={f.url}
                  alt={f.titulo}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                  quality={50}
                  className={styles.fotoImg}
                />
              </span>
              <span className={styles.fotoInfo}>
                <span className={styles.fotoTitulo}>{f.titulo}</span>
                <span className={styles.fotoTags}>
                  <span className={styles.fotoTagClase}>{f.claseTitulo}</span>
                  {f.tincion && <span className={styles.fotoTag}>{f.tincion}</span>}
                  {f.aumento && <span className={styles.fotoTag}>{f.aumento}</span>}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ─── Lightbox (siempre oscuro) ─── */}
      {lightbox !== null && filtradas[lightbox] && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Cerrar">
            ✕
          </button>
          {filtradas.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) => (i === null ? i : (i - 1 + filtradas.length) % filtradas.length));
                }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((i) => (i === null ? i : (i + 1) % filtradas.length));
                }}
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
          <figure className={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
            <span className={styles.lightboxImgWrap}>
              <Image
                src={filtradas[lightbox].url}
                alt={filtradas[lightbox].titulo}
                fill
                sizes="92vw"
                className={styles.lightboxImg}
              />
            </span>
            <figcaption className={styles.lightboxCaption}>
              {filtradas[lightbox].titulo}
              <span className={styles.lightboxCount}>
                {filtradas[lightbox].claseTitulo}
                {filtradas[lightbox].tincion ? ` · ${filtradas[lightbox].tincion}` : ''}
                {filtradas[lightbox].aumento ? ` · ${filtradas[lightbox].aumento}` : ''}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
