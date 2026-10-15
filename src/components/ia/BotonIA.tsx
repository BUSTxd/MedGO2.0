'use client';
import { useEffect, useRef, useState } from 'react';
import { useIA } from './IAContext';
import { IconoIA } from './PanelIA';
import s from '@/styles/panelIA.module.css';

/**
 * Cuadradito flotante abajo a la derecha. Se sacude cada pocos segundos para
 * hacerse notar. Con la IA disponible abre el panel lateral; si no (antes del
 * lanzamiento), una tarjeta «Próximamente». Se esconde con el panel abierto y
 * con un visor a pantalla completa (ver `panelIA.module.css`).
 */
export default function BotonIA() {
  const ia = useIA();
  const [aviso, setAviso] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aviso) return;
    const fuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAviso(false);
    };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [aviso]);

  if (!ia || ia.abierto) return null;

  return (
    <div className={s.botonCaja} ref={caja}>
      {aviso && (
        <div className={s.avisoTarjeta} role="status">
          <strong>MedGO IA · en desarrollo</strong>
          <p>Muy pronto podrás subrayar tus resúmenes y que la IA te explique cada palabra, cada figura y cada mecanismo.</p>
        </div>
      )}
      <button
        className={`${s.boton} ${aviso ? '' : s.botonLlama}`}
        onClick={() => (ia.puedeUsar ? ia.abrir() : setAviso((a) => !a))}
        aria-label={ia.puedeUsar ? 'Abrir MedGO IA' : 'MedGO IA — próximamente'}
      >
        <IconoIA size={26} />
        <span className={s.botonEtiqueta}>{ia.puedeUsar ? 'MedGO IA' : 'Próximamente'}</span>
      </button>
    </div>
  );
}
