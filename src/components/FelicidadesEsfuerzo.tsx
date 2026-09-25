'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/felicidadesEsfuerzo.module.css';
import { SPRITE_CELULA, SPRITE_PUNTERO } from '@/lib/esfuerzo';
import { setCursorCelula, useCursorCelula } from './CursorCelula';

/*
 * Tarjeta «¡Felicidades!» del panel «Tu esfuerzo». Va en su propio archivo y
 * TuEsfuerzo la carga con next/dynamic: solo la descarga quien ya puede invocar.
 */

const DESENFOQUE = 'blur(6px)';
const PASO_CARRUSEL = 2500;

/**
 * Desenfoca el dashboard mientras la tarjeta está abierta. Con `filter` y no con
 * `backdrop-filter`, que en esta app ya dejó fondos en blanco al cerrar. Va hijo
 * a hijo de [data-shell]: un filter en el contenedor haría que la sidebar
 * (position: fixed) se ubicara respecto a él y se fuera con el scroll.
 */
function useDesenfocarShell() {
  useEffect(() => {
    const nodos = Array.from(document.querySelectorAll<HTMLElement>('[data-shell] > *'));
    for (const n of nodos) {
      n.style.transition = 'filter 0.3s ease';
      n.style.filter = DESENFOQUE;
    }
    return () => {
      for (const n of nodos) n.style.filter = '';
      setTimeout(() => { for (const n of nodos) n.style.transition = ''; }, 350);
    };
  }, []);
}

export default function FelicidadesEsfuerzo({ onCerrar }: { onCerrar: () => void }) {
  const boton = useRef<HTMLButtonElement>(null);
  // El home se re-renderiza cada segundo (cronómetro): con onCerrar en las
  // dependencias el efecto robaría el foco en cada tic.
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;
  const [slide, setSlide] = useState(0);
  // El carrusel avanza solo hasta que el usuario elige una imagen.
  const [manual, setManual] = useState(false);
  const cursorActivo = useCursorCelula();

  useDesenfocarShell();

  useEffect(() => {
    boton.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrarRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (manual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), PASO_CARRUSEL);
    return () => clearInterval(id);
  }, [manual]);

  const elegir = (i: number) => { setManual(true); setSlide(i); };

  return createPortal(
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        className={styles.tarjeta}
        role="dialog"
        aria-modal="true"
        aria-labelledby="esfuerzo-felicidades"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.carrusel} aria-roledescription="carrusel">
          <div className={styles.carruselPista} style={{ transform: `translateX(-${slide * 100}%)` }}>
            <figure className={styles.slide} aria-hidden={slide !== 0}>
              <div
                className={styles.tarjetaSprite}
                style={{ backgroundImage: `url('${SPRITE_CELULA}')` }}
                aria-hidden="true"
              />
              <figcaption className={styles.slideRotulo}>Tu célula madre</figcaption>
            </figure>
            <figure className={styles.slide} aria-hidden={slide !== 1}>
              {/* El sprite del puntero (sin sombra), animado a ×3: la misma tira
                  que usará el mouse, así al activarlo ya está en caché. */}
              <div
                className={styles.spriteIndividual}
                style={{ backgroundImage: `url('${SPRITE_PUNTERO}')` }}
                role="img"
                aria-label="Sprite de la célula madre para el puntero"
              />
              <figcaption className={styles.slideRotulo}>Tu puntero</figcaption>
              <button
                type="button"
                className={styles.usarPuntero}
                aria-pressed={cursorActivo}
                tabIndex={slide === 1 ? 0 : -1}
                onClick={() => setCursorCelula(!cursorActivo)}
              >
                {cursorActivo ? 'Quitar del puntero' : 'Usar como puntero del mouse'}
              </button>
            </figure>
          </div>
        </div>
        <div className={styles.puntos}>
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              className={styles.punto}
              aria-current={slide === i}
              aria-label={i === 0 ? 'Ver la animación' : 'Ver el sprite individual'}
              onClick={() => elegir(i)}
            />
          ))}
        </div>
        <h2 id="esfuerzo-felicidades" className={styles.tarjetaTitulo}>¡Felicidades!</h2>
        <p className={styles.tarjetaTexto}>
          Tu esfuerzo se materializó. Sigue mejorando para que evolucione junto a ti.
        </p>
        <button ref={boton} type="button" className={styles.tarjetaBoton} onClick={onCerrar}>
          Continuar
        </button>
      </div>
    </div>,
    document.body,
  );
}
