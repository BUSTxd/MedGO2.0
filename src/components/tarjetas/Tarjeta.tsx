'use client';

import type { ReactNode } from 'react';
import s from '@/styles/tarjetas.module.css';

export type Fase = 'quieto' | 'saliendo' | 'entrando';
export type Estado = 'ok' | 'mal' | null;

interface Props {
  /** Dónde está en el ciclo salir → cambiar contenido → entrar. */
  fase: Fase;
  /**
   * Hacia dónde se mueve: `1` avanza (sale por la izquierda y la siguiente
   * entra por la derecha), `-1` retrocede.
   */
  dir: 1 | -1;
  /** Posición en la tanda, para escalonar la entrada. */
  indice?: number;
  /** Inclinación de reposo, en grados: es lo que abre el abanico. */
  inclinacion?: number;
  /**
   * Color propio de la carta: lo usan su palo, su filete y su marca de agua.
   * Se recibe como token (`var(--palo-rojo)`) y no como literal, para que el
   * modo oscuro lo resuelva distinto sin pasar por el JS.
   */
  tinte?: string;
  volteada?: boolean;
  estado?: Estado;
  /** Cede el protagonismo a otra tarjeta (la elegida). */
  atenuada?: boolean;
  frente: ReactNode;
  dorso: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  etiqueta?: string;
  className?: string;
}

/**
 * Una tarjeta que sale, cambia de contenido y vuelve a entrar — **sin
 * remontarse**. Quien la usa le da una `key` estable (la posición, no el id de
 * lo que muestra) y sólo le cambia las props: ése es el punto del componente.
 * `BancoPreguntas` hace lo contrario, remontar por pregunta, y por eso cada
 * avance reconstruye el bloque entero.
 *
 * El truco para que la animación se repita sin remonte es que `entrando` y
 * `saliendo` usan **nombres de animación distintos**: al cambiar el nombre el
 * navegador la reinicia solo, sin tener que forzar un reflow.
 *
 * Tres capas anidadas porque las tres animan `transform` y una sola no puede
 * llevar las tres a la vez: el marco entra y sale, la capa de en medio se
 * sacude al fallar, y la interior voltea en 3D.
 */
export default function Tarjeta({
  fase, dir, indice = 0, inclinacion = 0, tinte, volteada = false, estado = null,
  atenuada = false, frente, dorso, onClick, disabled, etiqueta, className,
}: Props) {
  const clases = [
    s.marco,
    fase === 'saliendo' ? s.marcoSale : fase === 'entrando' ? s.marcoEntra : s.marcoQuieto,
    atenuada ? s.marcoAtenuado : '',
    estado === 'ok' ? s.marcoOk : estado === 'mal' ? s.marcoMal : '',
    onClick ? s.marcoPulsable : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const cuerpo = (
    // La sacudida del fallo vive en su propia capa: el marco ya usa `transform`
    // para entrar y salir, y dos animaciones no pueden escribir la misma propiedad.
    <span className={`${s.sacude} ${estado === 'mal' ? s.sacudeMal : ''}`}>
      <span className={`${s.cara3d} ${volteada ? s.cara3dVolteada : ''}`}>
        <span className={s.frente}>{frente}</span>
        <span className={s.dorso}>{dorso}</span>
      </span>
    </span>
  );

  const estilo = {
    '--i': indice,
    '--dx': `${dir * 64}px`,
    '--giro': `${inclinacion}deg`,
    ...(tinte ? { '--tinte': tinte } : {}),
  } as React.CSSProperties;

  // Siempre un `<button>`, aunque no haya nada que pulsar: cambiar de etiqueta
  // según el estado hace que React tire el nodo y cree otro, que es justo lo
  // que este componente existe para evitar. Cuando no hay manejador, se apaga.
  return (
    <button
      type="button"
      className={clases}
      style={estilo}
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-label={etiqueta}
    >
      {cuerpo}
    </button>
  );
}
