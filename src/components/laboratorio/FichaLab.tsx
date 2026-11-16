'use client';
// Piezas de la barra lateral de los labs con el diseño de Médula Espinal 3D y
// Polígono de Willis 3D (patrón Nielsen de la ficha:
// auditorias-ux/nielsen-willis-barra-lateral-2026-11-14.md): cabecera fija con
// ‹ › ✕, «Lo esencial», perla «Para el examen», apartados, lista e interruptores.
// Las clases vienen de medulaEspinal.module.css y poligonoWillis.module.css.

import { useEffect, type CSSProperties, type ReactNode } from 'react';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';

/** Para buscar sin tildes ni mayúsculas. */
export const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Íconos de trazo fino para los botones de la cabecera. */
export function Icono({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className={styles.structureDot}
      style={{ background: color, width: size, height: size } as CSSProperties}
      aria-hidden
    />
  );
}

export function Interruptor({ activo, onCambio, etiqueta, color, detalle }: {
  activo: boolean;
  onCambio: () => void;
  etiqueta: string;
  color?: string;
  detalle?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={activo} onClick={onCambio} className={styles.toggleRow}>
      <span className={styles.toggleLabel}>
        {color && <Dot color={color} />}
        <span className={styles.toggleTextos}>
          <span className={styles.structureName}>{etiqueta}</span>
          {detalle && <span className={styles.toggleDetalle}>{detalle}</span>}
        </span>
      </span>
      <span className={`${styles.toggleSwitch} ${activo ? styles.toggleOn : ''}`} aria-hidden />
    </button>
  );
}

export function Ficha({ color, titulo, sub, children }: { color?: string; titulo: string; sub?: string; children?: ReactNode }) {
  return (
    <div className={styles.info} role="region" aria-label={titulo}>
      <div className={styles.infoHead}>
        {color && <Dot color={color} size={12} />}
        <h3 className={styles.infoTitle}>{titulo}</h3>
      </div>
      {sub && <p className={styles.infoSub}>{sub}</p>}
      {children}
    </div>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className={styles.infoEmpty}>{children}</p>;
}

export function BotonLista({ activo, onClick, onEnter, onLeave, children }: {
  activo: boolean;
  onClick: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={`${styles.structureBtn} ${activo ? styles.structureActive : ''}`}
      onClick={onClick}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}

/** Título de un apartado de la ficha. */
export function Apartado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className={ws.apartado}>
      <h4 className={ws.apartadoTitulo}>{titulo}</h4>
      {children}
    </div>
  );
}

/** El dato que más se pregunta, con su bombilla. */
export function Perla({ children }: { children: ReactNode }) {
  return (
    <p className={ws.perla}>
      <svg className={ws.perlaIcono} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
      <span><strong>Para el examen.</strong> {children}</span>
    </p>
  );
}

/** Cómo moverse desde la ficha: anterior, siguiente y cerrar (null = no se puede). */
export interface Navegacion {
  posicion: string | null;
  onAnterior: (() => void) | null;
  onSiguiente: (() => void) | null;
  onCerrar: (() => void) | null;
  /** «arteria», «territorio»… para los nombres accesibles de los botones. */
  que: string;
}

/** Anterior, siguiente y posición dentro de una lista. */
export function navegar<T>(lista: T[], actual: T | null, ir: (x: T) => void, que: string, cerrar: (() => void) | null): Navegacion {
  const i = actual === null ? -1 : lista.indexOf(actual);
  return {
    posicion: i >= 0 ? `${i + 1} de ${lista.length}` : null,
    onAnterior: i > 0 ? () => ir(lista[i - 1]) : null,
    onSiguiente: i >= 0 && i < lista.length - 1 ? () => ir(lista[i + 1]) : null,
    onCerrar: cerrar,
    que,
  };
}

/**
 * Teclado de la ficha: ← → pasan al elemento vecino de la lista y Esc cierra
 * la ficha (salvo que se esté escribiendo en un campo).
 */
export function useTecladoFicha(nav: Navegacion | null) {
  useEffect(() => {
    if (!nav) return;
    const tecla = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && nav.onAnterior) { e.preventDefault(); nav.onAnterior(); }
      else if (e.key === 'ArrowRight' && nav.onSiguiente) { e.preventDefault(); nav.onSiguiente(); }
      else if (e.key === 'Escape' && nav.onCerrar) nav.onCerrar();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [nav]);
}

/**
 * 1 · Qué es: cabecera fija de toda ficha (no se pierde al bajar), con su
 * insignia, el título, una línea de datos y ‹ › ✕.
 */
export function CabezaFicha({ insignia, titulo, meta, nav }: { insignia?: ReactNode; titulo: string; meta: ReactNode; nav: Navegacion }) {
  return (
    <header className={ws.fichaCabeza}>
      <div className={ws.fichaFila}>
        <h3 className={ws.fichaTitulo}>{insignia}{titulo}</h3>
        <div className={ws.fichaNav}>
          <button type="button" className={ws.navBtn} onClick={nav.onAnterior ?? undefined} disabled={!nav.onAnterior} aria-label={`${nav.que} anterior de la lista`} title="Anterior (←)">
            <Icono d="m15 6-6 6 6 6" />
          </button>
          <button type="button" className={ws.navBtn} onClick={nav.onSiguiente ?? undefined} disabled={!nav.onSiguiente} aria-label={`${nav.que} siguiente de la lista`} title="Siguiente (→)">
            <Icono d="m9 6 6 6-6 6" />
          </button>
          {nav.onCerrar && (
            <button type="button" className={ws.navBtn} onClick={nav.onCerrar} aria-label="Cerrar la ficha" title="Cerrar (Esc)">
              <Icono d="M6 6l12 12M18 6 6 18" />
            </button>
          )}
        </div>
      </div>
      <p className={ws.fichaMeta}>
        {meta}{nav.posicion ? <span className={ws.fichaPos}> · {nav.posicion}</span> : null}
      </p>
    </header>
  );
}

/** 2 · Lo esencial: rótulo a la izquierda, dato a la derecha. */
export function Esencial({ filas }: { filas: Array<{ rotulo: string; valor: ReactNode }> }) {
  return (
    <dl className={ws.esencial} aria-label="Lo esencial">
      {filas.map((f) => (
        <div key={f.rotulo} className={ws.esencialFila}>
          <dt>{f.rotulo}</dt>
          <dd>{f.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Buscador de la lista: por nombre o sigla, sin importar tildes ni mayúsculas. */
export function Buscador({ valor, onCambio, placeholder, etiqueta }: {
  valor: string;
  onCambio: (v: string) => void;
  placeholder: string;
  etiqueta: string;
}) {
  return (
    <div className={ws.buscador} role="search">
      <svg className={ws.buscadorLupa} width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m15.5 15.5 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={ws.buscadorCampo}
        placeholder={placeholder}
        aria-label={etiqueta}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') onCambio(''); }}
      />
    </div>
  );
}

/** Pestañas de «Más detalle». */
export function Pestanas<T extends string>({ pestanas, activa, onCambio }: {
  pestanas: Array<{ key: T; label: string }>;
  activa: T;
  onCambio: (k: T) => void;
}) {
  return (
    <div className={ws.pestanas} role="tablist" aria-label="Apartados de la ficha">
      {pestanas.map((p) => (
        <button
          key={p.key}
          type="button"
          role="tab"
          aria-selected={activa === p.key}
          className={activa === p.key ? ws.pestanaActiva : ws.pestana}
          onClick={() => onCambio(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
