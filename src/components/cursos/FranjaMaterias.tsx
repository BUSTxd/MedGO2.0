'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AREA_POR_CODIGO } from '@/lib/data/encib';
import { MATERIAS } from '@/lib/data/encib/hub';
import FisicaIcon from '@/components/icons/FisicaIcon';
import s from '@/styles/cursosHubEscena.module.css';

/**
 * Franja de las materias básicas. Si no caben todas, se mueven con las
 * flechas, con el dedo o con la rueda del mouse encima de la franja (la rueda
 * vertical se vuelve horizontal; en los extremos la suelta y la página sigue).
 * Mismo patrón de medida que `Pasarela`: las flechas solo salen si hay algo
 * escondido a ese lado.
 */
export default function FranjaMaterias() {
  const pista = useRef<HTMLDivElement>(null);
  const [puede, setPuede] = useState({ atras: false, adelante: false });

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => {
      // 2px de margen: el redondeo del zoom deja restos de medio píxel.
      setPuede({
        atras: el.scrollLeft > 2,
        adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
    };
    const rueda = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // ya es horizontal (trackpad)
      const max = el.scrollWidth - el.clientWidth;
      const haciaDelante = e.deltaY > 0;
      if ((haciaDelante && el.scrollLeft >= max - 2) || (!haciaDelante && el.scrollLeft <= 2)) return;
      e.preventDefault();
      // Con rueda de línea (Firefox) delta viene en líneas, no en píxeles.
      const px = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      el.scrollLeft += px;
    };
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    el.addEventListener('wheel', rueda, { passive: false });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', medir);
      el.removeEventListener('wheel', rueda);
      ro.disconnect();
    };
  }, []);

  const mover = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: sentido * el.clientWidth * 0.8, behavior: suave ? 'smooth' : 'auto' });
  };

  return (
    <div className={s.franja}>
      <div className={s.franjaCabecera}>
        <h2 className={s.franjaTitulo}>
          <FisicaIcon className={s.franjaAtomo} color="#4b3fd6" />
          Ciencias Básicas · Facultad de Medicina
        </h2>
        {/* El análisis del ENCIB recorre las 8 áreas: es «todas las materias». */}
        <Link href="/dashboard/cursos/examen/encib" className={s.franjaExplora}>
          Explora todas las materias básicas
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className={s.franjaCuerpo}>
        <div ref={pista} className={s.franjaPista} role="region" aria-label="Materias de ciencias básicas" tabIndex={0}>
          {MATERIAS.map((m) => {
            const img = (
              <>
                <Image src={m.imagen} alt="" width={m.ancho} height={m.alto} unoptimized draggable={false} className={s.materiaImg} />
                <span className={s.materiaNombre}>{m.nombre}</span>
              </>
            );
            return m.area ? (
              <Link key={m.slug} href={`/dashboard/cursos/area/${AREA_POR_CODIGO[m.area].slug}`} className={s.materia}>
                {img}
              </Link>
            ) : (
              <div key={m.slug} className={`${s.materia} ${s.materiaPronto}`} aria-disabled>
                {img}
                <span className={s.materiaSello}>Próximamente</span>
              </div>
            );
          })}
        </div>

        {puede.atras && (
          <button type="button" className={`${s.flechaChica} ${s.flechaChicaIzq}`} onClick={() => mover(-1)} aria-label="Materias anteriores">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {puede.adelante && (
          <button type="button" className={`${s.flechaChica} ${s.flechaChicaDer}`} onClick={() => mover(1)} aria-label="Materias siguientes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
