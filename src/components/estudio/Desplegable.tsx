'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from 'react';
import { cx, Icono } from './Icono';

export interface OpcionDesplegable {
  value: string;
  label: string;
  /** Rótulo del grupo; se pinta cuando cambia respecto a la opción anterior. */
  grupo?: string;
  icono?: string | null;
  /** Pastilla a la derecha («Pronto», «Con plan»…). */
  etiqueta?: string;
  bloqueada?: boolean;
}

/**
 * Sustituye al <select> nativo de la barra de ruta: su lista la dibuja el
 * sistema y no admite estilos. Mismo botón que el select (texto + flecha) y una
 * lista propia con el patrón `listbox`: flechas, Inicio/Fin, Enter, Esc y saltar
 * escribiendo la primera letra.
 */
export default function Desplegable({ valor, opciones, onCambiar, etiqueta, claseBoton }: {
  valor: string;
  opciones: OpcionDesplegable[];
  onCambiar: (value: string) => void;
  etiqueta: string;
  claseBoton?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const id = useId();
  const actual = opciones.find((o) => o.value === valor) ?? opciones[0];

  const abrir = () => {
    setActiva(Math.max(0, opciones.findIndex((o) => o.value === valor)));
    setAbierto(true);
  };
  const cerrar = (devolverFoco = true) => {
    setAbierto(false);
    if (devolverFoco) boton.current?.focus();
  };
  const elegir = (i: number) => {
    const o = opciones[i];
    if (!o) return;
    cerrar();
    if (o.value !== valor) onCambiar(o.value);
  };

  // Al abrir: foco en la lista y la opción actual a la vista.
  useEffect(() => {
    if (!abierto) return;
    lista.current?.focus({ preventScroll: true });
  }, [abierto]);
  useEffect(() => {
    if (!abierto) return;
    lista.current?.querySelector<HTMLElement>(`[data-i="${activa}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [abierto, activa]);

  // Un clic fuera la cierra sin robar el foco a lo que se pulsó.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) cerrar(false); };
    document.addEventListener('pointerdown', fuera);
    return () => document.removeEventListener('pointerdown', fuera);
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  const teclaBoton = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); abrir(); }
  };
  const teclaLista = (e: React.KeyboardEvent) => {
    const ultimo = opciones.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiva((i) => Math.min(ultimo, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiva((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiva(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiva(ultimo); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(activa); }
    // Esc no debe llegar a la interfaz (saldría del enfoque o cerraría el temario).
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); }
    else if (e.key === 'Tab') cerrar(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const letra = e.key.toLowerCase();
      const desde = opciones.findIndex((o, i) => i > activa && o.label.toLowerCase().startsWith(letra));
      const i = desde >= 0 ? desde : opciones.findIndex((o) => o.label.toLowerCase().startsWith(letra));
      if (i >= 0) setActiva(i);
    }
  };

  return (
    <div ref={caja} className={cx('select-shell', abierto && 'select-abierto')}>
      <button
        ref={boton}
        type="button"
        className={cx('select-trigger', claseBoton)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={`${etiqueta}: ${actual?.label ?? ''}`}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={teclaBoton}
      >
        {actual?.label}
      </button>
      <Icono n="down" />
      {abierto && (
        <div
          ref={lista}
          className={cx('select-panel')}
          role="listbox"
          aria-label={etiqueta}
          tabIndex={-1}
          aria-activedescendant={`${id}-${activa}`}
          onKeyDown={teclaLista}
        >
          {opciones.map((o, i) => {
            const nuevoGrupo = o.grupo && o.grupo !== opciones[i - 1]?.grupo;
            const elegida = o.value === valor;
            return (
              <div key={o.value} role="presentation">
                {nuevoGrupo && <div className={cx('select-grupo')} role="presentation">{o.grupo}</div>}
                <div
                  id={`${id}-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={elegida}
                  className={cx('select-opcion', i === activa && 'is-activa', elegida && 'is-elegida', o.bloqueada && 'is-bloqueada')}
                  onPointerEnter={() => setActiva(i)}
                  onClick={() => elegir(i)}
                >
                  {o.icono !== undefined && (
                    <span className={cx('select-icono')}>{o.icono ? <img src={o.icono} alt="" /> : <Icono n="book" />}</span>
                  )}
                  <span className={cx('select-texto')}>{o.label}</span>
                  {o.etiqueta && <span className={cx('select-etiqueta')}>{o.bloqueada && <Icono n="lock" />}{o.etiqueta}</span>}
                  {elegida && <Icono n="check" cls="select-check" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
