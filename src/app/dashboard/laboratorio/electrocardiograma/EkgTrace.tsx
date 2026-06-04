'use client';
// Trazado EKG (derivación DII) en Canvas 2D. Dibuja la tira completa (varios
// latidos) de forma estática y un "cursor" (playhead) que recorre el tiempo.
// En pausa, arrastrar el cursor mueve la variable de tiempo compartida (scrub),
// igual que mover la línea de tiempo de un video: NO deforma la onda, la recorre.

import { useCallback, useEffect, useRef } from 'react';
import type { PhaseState } from './engine/types';
import styles from '@/styles/electrocardiograma.module.css';

interface Props {
  /** Amplitud (mV) en tiempo global; la onda puede variar latido a latido. */
  sampleAt: (t: number) => number;
  /** Tiempo global actual dentro de la ventana visible [0, windowMs). */
  t: number;
  windowMs: number;
  phase: PhaseState | null;
  showGrid: boolean;
  showLabels: boolean;
  paused: boolean;
  dark: boolean;
  /** Llamado al arrastrar el cursor (solo en pausa). */
  onScrub: (t: number) => void;
}

export default function EkgTrace({
  sampleAt,
  t,
  windowMs,
  phase,
  showGrid,
  showLabels,
  paused,
  dark,
  onScrub,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const draggingRef = useRef(false);

  // Redibuja todo el trazado para el instante actual.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0) return;

    const baseline = h * 0.62; // línea isoeléctrica
    const pxPerSec = w / (windowMs / 1000);
    const bigBox = pxPerSec * 0.2; // 0.2 s por cuadro grande
    const pxPerMv = bigBox * 0.4; // 0.5 mV por cuadro grande → cuadros cuadrados (25mm/s, 10mm/mV)

    const col = dark
      ? { bg: '#0a0f1a', gridMinor: 'rgba(95,224,168,0.07)', gridMajor: 'rgba(95,224,168,0.16)', wave: '#5fe0a8', text: 'rgba(220,240,232,0.7)' }
      : { bg: '#fff8f8', gridMinor: 'rgba(220,120,120,0.13)', gridMajor: 'rgba(210,90,90,0.28)', wave: '#16203a', text: 'rgba(40,30,30,0.55)' };

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = col.bg;
    ctx.fillRect(0, 0, w, h);

    // ── Cuadrícula tipo papel ECG ──
    if (showGrid) {
      const minor = bigBox / 5;
      ctx.lineWidth = 1;
      ctx.strokeStyle = col.gridMinor;
      ctx.beginPath();
      for (let x = 0; x <= w; x += minor) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = baseline % minor; y <= h; y += minor) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
      ctx.strokeStyle = col.gridMajor;
      ctx.beginPath();
      for (let x = 0; x <= w; x += bigBox) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = baseline % bigBox; y <= h; y += bigBox) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }

    // ── Onda ──
    ctx.strokeStyle = col.wave;
    ctx.lineWidth = dark ? 2 : 1.8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const time = (x / w) * windowMs;
      const y = baseline - sampleAt(time) * pxPerMv;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // ── Cursor / playhead ──
    const xPlay = (t / windowMs) * w;
    const yPlay = baseline - sampleAt(t) * pxPerMv;

    ctx.strokeStyle = paused ? 'rgba(230,167,0,0.95)' : 'rgba(230,167,0,0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xPlay, 0);
    ctx.lineTo(xPlay, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Punto agarrable sobre la onda
    ctx.beginPath();
    ctx.arc(xPlay, yPlay, paused ? 7 : 5, 0, Math.PI * 2);
    ctx.fillStyle = '#E6A700';
    ctx.shadowColor = 'rgba(230,167,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Etiqueta del segmento actual junto al cursor
    if (showLabels && phase) {
      const label = phase.ekgLabel;
      ctx.font = '700 11px system-ui, sans-serif';
      const tw = ctx.measureText(label).width;
      const lx = Math.min(Math.max(xPlay, tw / 2 + 8), w - tw / 2 - 8);
      ctx.fillStyle = dark ? 'rgba(10,15,26,0.85)' : 'rgba(255,255,255,0.9)';
      ctx.fillRect(lx - tw / 2 - 6, 6, tw + 12, 18);
      ctx.fillStyle = '#E6A700';
      ctx.textAlign = 'center';
      ctx.fillText(label, lx, 19);
    }

    // ── Parámetros clínicos (esquina) ──
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillStyle = col.text;
    ctx.textAlign = 'right';
    ctx.fillText('25 mm/s · 10 mm/mV · DII', w - 8, h - 8);
  }, [sampleAt, t, windowMs, phase, showGrid, showLabels, paused, dark]);

  // Ajuste de tamaño con devicePixelRatio.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const hgt = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hgt * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${hgt}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h: hgt };
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [draw]);

  // Redibuja cuando cambia el instante o las opciones.
  useEffect(() => {
    draw();
  }, [draw]);

  // ── Scrubbing (solo en pausa) ──
  const timeFromX = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return 0;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      return (x / rect.width) * windowMs;
    },
    [windowMs],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!paused) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onScrub(timeFromX(e.clientX));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    onScrub(timeFromX(e.clientX));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  return (
    <div className={styles.traceWrap}>
      <canvas
        ref={canvasRef}
        className={styles.traceCanvas}
        style={{ cursor: paused ? 'ew-resize' : 'default', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      {paused && <span className={styles.scrubHint}>Arrastra el cursor para recorrer el latido</span>}
    </div>
  );
}
