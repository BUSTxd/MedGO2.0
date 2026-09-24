'use client';

import type { Valoracion } from '@/lib/valoraciones';
import s from '@/styles/tarjetas.module.css';

const OPCIONES: { v: Valoracion; etiqueta: string; tecla: string; clase: string }[] = [
  { v: 'rojo', etiqueta: 'Mal armada', tecla: '1', clase: s.valoraRojo },
  { v: 'amarillo', etiqueta: 'Regular', tecla: '2', clase: s.valoraAmarillo },
  { v: 'verde', etiqueta: 'Bien armada', tecla: '3', clase: s.valoraVerde },
];

/** La cara de cada color: triste, neutra, contenta. */
const Cara = ({ v }: { v: Valoracion }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="1.1" fill="currentColor" />
    <circle cx="15" cy="10" r="1.1" fill="currentColor" />
    <path
      d={v === 'rojo' ? 'M8.4 16.4c1-1.4 2.2-2 3.6-2s2.6.6 3.6 2' : v === 'amarillo' ? 'M8.6 15.2h6.8' : 'M8.4 14c1 1.4 2.2 2 3.6 2s2.6-.6 3.6-2'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

interface Props {
  valor: Valoracion | null;
  onElegir: (v: Valoracion) => void;
  /** Cuántas veces se intentó seguir sin valorar: cada una vuelve a sacudir el bloque. */
  intentos: number;
}

/**
 * Semáforo de satisfacción de la pregunta. Late mientras falta y se sacude si
 * se intenta pasar sin él: la pregunta no avanza hasta que se pulsa un color.
 */
export default function ValoracionPregunta({ valor, onElegir, intentos }: Props) {
  const avisando = valor === null && intentos > 0;
  return (
    <div
      // El `key` remonta el bloque en cada intento y reinicia la sacudida.
      key={avisando ? `aviso-${intentos}` : 'quieto'}
      className={`${s.valora} ${valor ? s.valoraHecha : s.valoraPide} ${avisando ? s.valoraAviso : ''}`}
      data-valora
    >
      <p className={s.valoraTitulo}>
        {valor
          ? 'Gracias, tu opinión llega al equipo.'
          : avisando
            ? 'Antes de seguir, elige un color.'
            : '¿Qué tan bien armada está esta pregunta?'}
      </p>
      <div className={s.valoraOpciones} role="radiogroup" aria-label="Valoración de la pregunta">
        {OPCIONES.map(o => (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={valor === o.v}
            className={`${s.valoraBtn} ${o.clase} ${valor === o.v ? s.valoraElegida : valor ? s.valoraApagada : ''}`}
            onClick={() => onElegir(o.v)}
            title={`${o.etiqueta} · tecla ${o.tecla}`}
          >
            <span className={s.valoraCara}><Cara v={o.v} /></span>
            <span className={s.valoraEtiqueta}>{o.etiqueta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
