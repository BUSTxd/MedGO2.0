'use client';
// Altavoz de los laboratorios con voz grabada, con su barra de volumen. La barra sale
// hacia arriba, sobre la escena, para no empujar la narración que va al lado de los
// controles. Con mouse sale al pasar por encima y el clic silencia; en táctil no hay
// «pasar por encima», así que el primer toque la saca y el segundo silencia.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import c from '@/styles/cicloCelular.module.css';
import h from '@/styles/hipersensibilidad.module.css';

export type VozVolumen = {
  volumen: number;
  volumenAjustable: boolean;
  cambiarVolumen: (v: number) => void;
  alternar: () => void;
};

export default function ControlVoz({ voz }: { voz: VozVolumen }) {
  const grupo = useRef<HTMLDivElement>(null);
  const tacto = useRef(false);
  const [abierta, setAbierta] = useState(false);
  const callada = voz.volumen === 0;
  const etiqueta = callada ? 'Activar la voz' : 'Silenciar la voz';

  useEffect(() => {
    if (!abierta) return;
    const fuera = (e: PointerEvent) => {
      if (!grupo.current?.contains(e.target as Node)) setAbierta(false);
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierta]);

  const pulsar = () => {
    const porTacto = tacto.current;
    tacto.current = false;
    if (porTacto && voz.volumenAjustable && !abierta) setAbierta(true);
    else voz.alternar();
  };

  return (
    <div ref={grupo} className={`${h.voz} ${abierta ? h.vozAbierta : ''}`}>
      <button
        type="button"
        className={`${c.btnIcono} ${callada ? h.vozApagada : ''}`}
        onPointerDown={(e) => { tacto.current = e.pointerType === 'touch'; }}
        onClick={pulsar}
        aria-pressed={!callada}
        aria-label={etiqueta}
        title={etiqueta}
      >
        <svg viewBox="0 0 20 20" aria-hidden>
          <path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z" fill="currentColor" />
          {callada
            ? <path d="M13.5 7.5l4 5M17.5 7.5l-4 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            : <path d={voz.volumen < 0.5 ? 'M13.5 7a4 4 0 0 1 0 6' : 'M13.5 7a4 4 0 0 1 0 6M15.5 5a7 7 0 0 1 0 10'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
        </svg>
      </button>
      {voz.volumenAjustable && (
        <div className={h.vozBarra}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={voz.volumen}
            onChange={(e) => voz.cambiarVolumen(Number(e.target.value))}
            // Sin foco al soltar, las flechas y el espacio siguen mandando en el capítulo.
            onPointerUp={(e) => e.currentTarget.blur()}
            aria-label="Volumen de la voz"
            aria-valuetext={`${Math.round(voz.volumen * 100)} %`}
            style={{ '--v': `${voz.volumen * 100}%` } as CSSProperties}
          />
        </div>
      )}
    </div>
  );
}
