'use client';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TARJETAS_EXAMEN, TARJETA_INICIAL, type Caja } from '@/lib/data/encib/hub';
import s from '@/styles/cursosHubEscena.module.css';

const N = TARJETAS_EXAMEN.length;
/** −1 izquierda · 0 centro · +1 derecha (circular). */
const posDe = (i: number, actual: number) => ((i - actual + N + 1) % N) - 1;
/** Px de arrastre táctil para cambiar de tarjeta. */
const UMBRAL_SWIPE = 40;

type Vuelta = 'aDerecha' | 'aIzquierda';

/**
 * Carrusel de los tres exámenes sobre el podio. Al cambiar, las tarjetas
 * «revuelven»: dos se deslizan a su sitio con un rebote y la que da la vuelta
 * (de un extremo al otro) pasa por detrás, encogida. La posición la pinta el
 * CSS según `data-pos`; aquí solo se decide cuál está en el centro.
 *
 * Solo el ENCIB tiene destino: el resto lleva el botón en «Próximamente».
 * `cuenta` llega del servidor (los días se cuentan en hora de Lima).
 */
export default function CarruselExamenes({ cuenta }: { cuenta: { numero?: number; texto: string } }) {
  const [actual, setActual] = useState(TARJETA_INICIAL);
  const [vueltas, setVueltas] = useState<Record<number, Vuelta>>({});
  const [giros, setGiros] = useState(0);
  const inicioSwipe = useRef<number | null>(null);

  const ir = (destino: number) => {
    const nuevo = ((destino % N) + N) % N;
    if (nuevo === actual) return;
    const v: Record<number, Vuelta> = {};
    TARJETAS_EXAMEN.forEach((_, i) => {
      const antes = posDe(i, actual);
      const despues = posDe(i, nuevo);
      if (antes === -1 && despues === 1) v[i] = 'aDerecha';
      if (antes === 1 && despues === -1) v[i] = 'aIzquierda';
    });
    setVueltas(v);
    setActual(nuevo);
    setGiros((g) => g + 1);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') inicioSwipe.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (inicioSwipe.current === null) return;
    const dx = e.clientX - inicioSwipe.current;
    inicioSwipe.current = null;
    if (Math.abs(dx) >= UMBRAL_SWIPE) ir(actual + (dx < 0 ? 1 : -1));
  };

  const pct = (c: Caja) => ({ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%` });

  return (
    <div
      className={s.carrusel}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Exámenes"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { inicioSwipe.current = null; }}
    >
      {/* Podio dibujado: anillos de luz bajo la tarjeta del centro (late en cada cambio). */}
      <div className={s.podio} aria-hidden>
        {/* La luz va debajo: encima de los anillos los tapaba. */}
        <span key={giros} className={`${s.podioLuz} ${giros ? s.podioPulso : ''}`} />
        <span className={s.podioAnillo3} />
        <span className={s.podioAnillo2} />
        <span className={s.podioAnillo} />
      </div>

      <div className={s.escena} data-escena>
        {TARJETAS_EXAMEN.map((t, i) => {
          const pos = posDe(i, actual);
          const centro = pos === 0;
          const vuelta = vueltas[i];
          return (
            <article
              key={t.slug}
              className={`${s.tarjeta} ${vuelta ? s[vuelta] : ''}`}
              data-pos={pos}
              aria-hidden={!centro}
              onAnimationEnd={() => vuelta && setVueltas((v) => {
                const resto = { ...v };
                delete resto[i];
                return resto;
              })}
            >
              <Image
                src={t.imagen}
                alt={t.alt}
                width={t.ancho}
                height={t.alto}
                unoptimized
                priority={i === TARJETA_INICIAL}
                className={s.tarjetaImg}
                draggable={false}
              />

              {/* Contador real encima del «16 días» impreso. */}
              {t.chip && (
                <span className={s.encibCuenta} style={pct(t.chip)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M8 14h2M12 14h2M16 14h.5M8 17h2M12 17h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span>
                    {cuenta.numero !== undefined ? <strong>{cuenta.numero} {cuenta.numero === 1 ? 'día' : 'días'}</strong> : <strong>{cuenta.texto}</strong>}
                    {cuenta.numero !== undefined && <small>{cuenta.texto}</small>}
                  </span>
                </span>
              )}

              {/* El botón impreso: en el ENCIB es el enlace; en las demás, se tapa. */}
              {t.href ? (
                <>
                  <Link href={t.href} className={s.arteEnlace} tabIndex={-1} aria-hidden />
                  <Link href={t.href} className={s.botonEnlace} style={pct(t.boton)} tabIndex={centro ? undefined : -1}>
                    <span className={s.oculto}>Comenzar</span>
                  </Link>
                </>
              ) : (
                <span className={s.botonPronto} style={pct(t.boton)} aria-disabled>Próximamente</span>
              )}

              {/* Una lateral se pulsa entera para traerla al centro. */}
              {!centro && (
                <button type="button" className={s.traer} onClick={() => ir(i)} tabIndex={-1} aria-label={`Ver ${t.alt.split(':')[0]}`} />
              )}
            </article>
          );
        })}
      </div>

      <button type="button" className={`${s.flechaGrande} ${s.flechaGrandeIzq}`} onClick={() => ir(actual - 1)} aria-label="Examen anterior">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="m14.5 6-6 6 6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={`${s.flechaGrande} ${s.flechaGrandeDer}`} onClick={() => ir(actual + 1)} aria-label="Examen siguiente">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={s.puntos}>
        {TARJETAS_EXAMEN.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            className={s.punto}
            onClick={() => ir(i)}
            aria-label={`Ir a ${t.alt.split(':')[0]}`}
            aria-current={i === actual}
          />
        ))}
      </div>
    </div>
  );
}
