'use client';
import Icono from '../Icono';
import styles from '@/styles/investigacionGame.module.css';

/**
 * Piezas compartidas del panel claro genérico (vf · quiz · caso · mapa).
 * Mismo lenguaje visual que los minijuegos del nivel 2 (orden/drag):
 * estrellas difusas, cabecera con icon-box, footer con chips y botón
 * Verificar→Continuar (clases mjOrdenContinuar/mjOrdenBtnLabel compartidas).
 */

/** Estrellas difusas decorativas del panel. */
export function MJLiteStars() {
  return (
    <>
      <span className={`${styles.mjLiteStar} ${styles.mjLiteStar1}`} aria-hidden="true" />
      <span className={`${styles.mjLiteStar} ${styles.mjLiteStar2}`} aria-hidden="true" />
      <span className={`${styles.mjLiteStar} ${styles.mjLiteStar3}`} aria-hidden="true" />
    </>
  );
}

/** Cabecera: icon-box degradado + título/instrucción + badge contador. */
export function MJLiteHeader({
  icono,
  titulo,
  sub,
  badgeStrong,
  badgeLabel,
}: {
  icono: string;
  titulo: string;
  sub: string;
  badgeStrong: string;
  badgeLabel: string;
}) {
  return (
    <header className={styles.mjLiteHead}>
      <span className={styles.mjLiteIconBox}>
        <Icono name={icono} />
      </span>
      <div className={styles.mjLiteHeadText}>
        <h4 className={styles.mjLiteTitulo}>{titulo}</h4>
        <p className={styles.mjLiteSub}>{sub}</p>
      </div>
      <div className={styles.mjLiteBadge}>
        <span className={styles.mjLiteBadgeStar}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
          </svg>
        </span>
        <span className={styles.mjLiteBadgeTxt}>
          <strong>{badgeStrong}</strong>
          {badgeLabel}
        </span>
      </div>
    </header>
  );
}

/** Trofeo world-cup compartido (mismo path que OrdenarSecuencia/DragConnect). */
function Trofeo() {
  return (
    <svg viewBox="0 0 512 512" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M384,449.963v-12.629c0-17.643-14.357-32-32-32h-15.104c-20.011-34.176-27.52-93.995-27.563-127.68 c3.349-6.059,6.549-11.712,9.216-16.32c17.557-30.379,44.096-99.072,44.096-133.333v-4.821c0-5.824-0.043-10.347-0.192-14.293 c0.085-0.619,0.192-1.728,0.192-2.219C362.645,47.851,314.795,0,255.979,0S149.312,47.851,149.312,106.667 c0,13.141,2.645,25.835,7.189,37.696c0.043,0.235-0.021,0.448,0.021,0.661l46.763,185.749 c-9.493,31.296-23.019,62.037-28.779,74.56H160c-17.643,0-32,14.357-32,32v12.629c-12.395,4.416-21.333,16.149-21.333,30.037 v21.333c0,5.888,4.779,10.667,10.667,10.667h277.333c5.888,0,10.667-4.779,10.667-10.667V480 C405.333,466.112,396.395,454.379,384,449.963z M277.333,128.021c2.603,0,5.035,0.64,7.36,1.493 c0.683,0.256,1.344,0.576,2.005,0.896c1.579,0.789,3.029,1.792,4.352,2.944c0.576,0.512,1.216,0.917,1.749,1.472 c3.584,3.819,5.888,8.875,5.888,14.528c0,11.755-9.557,21.333-21.333,21.333c-8.128-0.021-14.955-4.736-18.56-11.413 c-0.469-0.853-0.96-1.685-1.301-2.56c-0.853-2.325-1.493-4.757-1.493-7.36C256,137.6,265.557,128.021,277.333,128.021z M189.781,189.504c3.84,3.051,7.893,5.845,12.203,8.384c5.717,29.824,11.371,61.077,11.371,79.467c0,1.536-0.149,3.2-0.235,4.821 L189.781,189.504z M197.952,405.333c12.395-27.968,36.715-87.979,36.715-128c0-21.312-6.187-54.741-12.629-88.043 c0-0.021,0-0.021,0-0.043l-1.408-7.296c-1.579-8.128-3.307-17.088-4.949-25.984c-1.387-7.467-2.645-14.741-3.733-21.611 c-0.299-1.899-0.64-3.904-0.917-5.717c3.093,7.765,6.784,16.491,11.328,24.96c0.235,0.427,0.469,0.853,0.704,1.28 c2.155,3.883,4.523,7.637,7.147,11.243c0.235,0.32,0.448,0.661,0.704,0.981c8.832,11.819,20.651,21.077,37.056,23.765 c3.029,0.704,6.144,1.131,9.365,1.131c3.392,0,6.656-0.491,9.835-1.259c34.816-6.123,47.445-43.371,54.165-67.435V128 c0,27.136-23.061,91.2-42.219,124.373C285.141,276.565,256,326.933,256,373.333c0,5.888,4.779,10.667,10.667,10.667 s10.667-4.779,10.667-10.667c0-18.453,5.696-38.144,13.12-56.512c3.157,28.267,9.728,61.973,22.123,88.512H197.952z" />
    </svg>
  );
}

/** Footer: chip XP · botón Verificar→Continuar (crossfade) · chip motivación. */
export function MJLiteFooter({
  resuelto,
  deshabilitado,
  onVerificar,
  onNext,
}: {
  resuelto: boolean;
  /** Deshabilita "Verificar" mientras falte responder (no afecta a "Continuar"). */
  deshabilitado?: boolean;
  onVerificar: () => void;
  onNext?: () => void;
}) {
  return (
    <div className={styles.mjLiteFooter}>
      <div className={`${styles.bloqueChip} ${styles.bloqueChipXP}`}>
        <span className={styles.bloqueChipIcon}>
          <Icono name="estrellas" />
        </span>
        <span>
          <strong>+50 XP</strong>
          <br />
          si aciertas a la primera
        </span>
      </div>

      <div className={styles.mjOrdenContinuarWrap}>
        <span className={styles.mjOrdenOrbita} aria-hidden="true" />
        <button
          className={`${styles.mjOrdenContinuar} ${resuelto ? styles.mjOrdenContinuarListo : ''}`}
          onClick={resuelto ? onNext : onVerificar}
          disabled={!resuelto && !!deshabilitado}
        >
          <span key={resuelto ? 'cont' : 'ver'} className={styles.mjOrdenBtnLabel}>
            {resuelto ? (
              <>
                Continuar
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            ) : (
              'Verificar'
            )}
          </span>
        </button>
      </div>

      <div className={`${styles.bloqueChip} ${styles.bloqueChipMotiva}`}>
        <span className={styles.bloqueChipIcon}>
          <Trofeo />
        </span>
        <span>
          <strong>Vas muy bien</strong>
          <br />
          ¡Sigue así!
        </span>
      </div>
    </div>
  );
}
