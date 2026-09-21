/**
 * Los cinco palos de la mano del quiz.
 *
 * El póker sólo tiene cuatro, y aquí hacen falta cinco: el quinto es la
 * estrella, el «palo extra» de las barajas de cinco palos. Se pinta en oro para
 * que no parezca un palo negro más ni compita con el rojo.
 *
 * El color no es un literal sino el **nombre de una variable**: se inyecta como
 * `--tinte` y quien lo resuelve es el CSS, que la redefine en modo oscuro. Un
 * `#23204f` quemado aquí sería invisible sobre el fondo oscuro.
 */

export interface Palo {
  id: string;
  nombre: string;
  /** Token CSS, no un color: lo resuelve el módulo según el tema. */
  color: string;
  Glifo: () => React.ReactElement;
}

const Pica = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.4c-1.9 3-7.6 6.8-7.6 11 0 2.4 1.8 4.2 4.1 4.2 1.3 0 2.5-.6 3.2-1.6-.2 2.1-1.1 4-2.4 5.2h5.4c-1.3-1.2-2.2-3.1-2.4-5.2.7 1 1.9 1.6 3.2 1.6 2.3 0 4.1-1.8 4.1-4.2 0-4.2-5.7-8-7.6-11Z" />
  </svg>
);

const Corazon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.2 4.4 13.6C1.9 11.1 2.1 7.1 4.8 5c2.4-1.9 5.7-1.2 7.2 1 1.5-2.2 4.8-2.9 7.2-1 2.7 2.1 2.9 6.1.4 8.6L12 21.2Z" />
  </svg>
);

const Trebol = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* Tres círculos y el tallo: un solo `fill`, así los solapes no se notan. */}
    <circle cx="12" cy="6.9" r="3.7" />
    <circle cx="6.6" cy="13.6" r="3.7" />
    <circle cx="17.4" cy="13.6" r="3.7" />
    <path d="M10.7 12.6c.1 3.9-.7 6.8-2.3 8.6h7.2c-1.6-1.8-2.4-4.7-2.3-8.6Z" />
  </svg>
);

const Diamante = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.3c2 3.6 4.4 6.8 7.2 9.7-2.8 2.9-5.2 6.1-7.2 9.7-2-3.6-4.4-6.8-7.2-9.7C7.6 9.1 10 5.9 12 2.3Z" />
  </svg>
);

const Estrella = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.83 5.9 6.42.86-4.68 4.5 1.16 6.42L12 17.08l-5.73 3.1 1.16-6.42-4.68-4.5 6.42-.86Z" />
  </svg>
);

/**
 * Orden pensado para el abanico: rojo y negro se alternan, y el oro cierra la
 * mano por el extremo derecho.
 */
export const PALOS: Palo[] = [
  { id: 'pica',     nombre: 'Picas',     color: 'var(--palo-tinta)', Glifo: Pica },
  { id: 'corazon',  nombre: 'Corazones', color: 'var(--palo-rojo)',  Glifo: Corazon },
  { id: 'trebol',   nombre: 'Tréboles',  color: 'var(--palo-tinta)', Glifo: Trebol },
  { id: 'diamante', nombre: 'Diamantes', color: 'var(--palo-rojo)',  Glifo: Diamante },
  { id: 'estrella', nombre: 'Estrellas', color: 'var(--palo-oro)',   Glifo: Estrella },
];

export const paloDe = (i: number): Palo => PALOS[i % PALOS.length];
