'use client';
// Visor comparativo del tronco encefálico (pantalla partida).
//
//   Izquierda → CADÁVER (pager: alterna entre 2 vistas).
//   Derecha   → MAQUETA 3D (rotation: anillo de 4 perspectivas; la flecha derecha rota a
//               la derecha y al final vuelve al inicio).
//
// Cada panel se puede colapsar para dejar el otro a pantalla completa (no se colapsan ambos
// a la vez). La capa de marcadores ya está cableada para el futuro modo examen: si una vista
// trae `markers`, se pintan como puntos CSS sobre la imagen.

import { useState } from 'react';
import Image from 'next/image';
import { CADAVER, MAQUETA, type Side, type View } from './views';
import styles from '@/styles/troncoEncefalico.module.css';

type Collapsed = 'left' | 'right' | null;

export default function TroncoViewer() {
  const [collapsed, setCollapsed] = useState<Collapsed>(null);
  const [cadIdx, setCadIdx] = useState(0);
  const [maqIdx, setMaqIdx] = useState(0);

  const wrapperClass = [
    styles.split,
    collapsed === 'left' ? styles.splitLeftCollapsed : '',
    collapsed === 'right' ? styles.splitRightCollapsed : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      <SidePanel
        side={CADAVER}
        index={cadIdx}
        onStep={(d) => setCadIdx((i) => wrap(i + d, CADAVER.views.length))}
        collapsed={collapsed === 'left'}
        otherCollapsed={collapsed === 'right'}
        onToggleCollapse={() => setCollapsed((c) => (c === 'left' ? null : 'left'))}
      />

      <div className={styles.divider} aria-hidden />

      <SidePanel
        side={MAQUETA}
        index={maqIdx}
        onStep={(d) => setMaqIdx((i) => wrap(i + d, MAQUETA.views.length))}
        collapsed={collapsed === 'right'}
        otherCollapsed={collapsed === 'left'}
        onToggleCollapse={() => setCollapsed((c) => (c === 'right' ? null : 'right'))}
      />
    </div>
  );
}

function SidePanel({
  side, index, onStep, collapsed, otherCollapsed, onToggleCollapse,
}: {
  side: Side;
  index: number;
  onStep: (delta: number) => void;
  collapsed: boolean;
  otherCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const view = side.views[index];
  const isRotation = side.mode === 'rotation';

  return (
    <section className={`${styles.panel} ${collapsed ? styles.panelCollapsed : ''}`}>
      <header className={styles.panelHead}>
        <div className={styles.panelTitleBox}>
          <span className={styles.panelTitle}>{side.title}</span>
          <span className={styles.viewName}>{view.name}</span>
        </div>
        <button
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          title={collapsed ? 'Restaurar vista' : 'Colapsar este panel'}
          aria-label={collapsed ? 'Restaurar vista' : 'Colapsar este panel'}
        >
          {collapsed ? 'Restaurar' : (side.id === 'cadaver' ? '⟨ Colapsar' : 'Colapsar ⟩')}
        </button>
      </header>

      {!collapsed && (
        <div className={styles.stage}>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => onStep(-1)}
            title={isRotation ? 'Rotar a la izquierda' : 'Vista anterior'}
            aria-label={isRotation ? 'Rotar a la izquierda' : 'Vista anterior'}
          >
            ‹
          </button>

          <ImageCanvas side={side} index={index} fullWidth={otherCollapsed} />

          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => onStep(1)}
            title={isRotation ? 'Rotar a la derecha' : 'Vista siguiente'}
            aria-label={isRotation ? 'Rotar a la derecha' : 'Vista siguiente'}
          >
            ›
          </button>
        </div>
      )}

      {!collapsed && (
        <div className={styles.dots}>
          {side.views.map((v, i) => (
            <span key={v.id} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>
      )}
    </section>
  );
}

function ImageCanvas({ side, index, fullWidth }: { side: Side; index: number; fullWidth: boolean }) {
  const sizes = fullWidth
    ? '(max-width: 860px) 100vw, 1100px'
    : '(max-width: 860px) 100vw, 620px';
  const active = side.views[index];

  // Apilamos TODAS las vistas del lado: la activa se ve, el resto quedan cargadas
  // (cambiar de perspectiva no dispara peticiones nuevas). La activa lleva `priority`
  // (carga primero); las demás `loading="eager"`, pero la posterior va al final del DOM
  // para que el navegador la descargue de última.
  const order = [...side.views].sort(
    (a, b) => (isPosterior(a) ? 1 : 0) - (isPosterior(b) ? 1 : 0),
  );

  return (
    <div className={styles.canvas} onContextMenu={(e) => e.preventDefault()}>
      {order.map((v) => {
        const isActive = v.id === active.id;
        return (
          <Image
            key={v.id}
            src={v.src}
            alt={v.name}
            fill
            draggable={false}
            priority={isActive}
            loading={isActive ? undefined : 'eager'}
            sizes={sizes}
            style={{ objectFit: 'contain' }}
            className={`${styles.layer} ${isActive ? styles.layerActive : styles.layerHidden}`}
          />
        );
      })}

      {/* Capa de marcadores (futuro examen). Sin markers no se dibuja nada. */}
      {active.markers?.map((m) => (
        <span
          key={m.id}
          className={styles.marker}
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          title={m.label}
        />
      ))}
    </div>
  );
}

/** ¿Es la vista posterior? (se deja para el final de la cola de carga). */
function isPosterior(v: View): boolean {
  return v.id.includes('posterior');
}

/** Índice circular: al pasar del último vuelve al primero y viceversa. */
function wrap(i: number, len: number): number {
  return ((i % len) + len) % len;
}
