'use client';
// Barra de tiempo estilo YouTube: la vía entera como una pista partida en
// capítulos (un segmento por paso, ancho proporcional a su duración). Se
// mantiene presionada y la escena sigue al dedo; al soltar se retoma lo que
// había (reproducir o pausa). El reloj es de `useReproductor`: aquí solo se
// traduce puntero ↔ instante global.

import { useLayoutEffect, useRef, useState } from 'react';
import type { Escenario } from '@/lib/data/ciclo-celular/tipos';
import type { Reproductor } from './useReproductor';
import { etiquetaTexto } from './texto';
import s from '@/styles/cicloCelular.module.css';

/** Hueco entre segmentos (px). Única fuente: va a CSS como `--bt-hueco`. */
const HUECO = 3;
/** Paso del teclado (ms) con ← / →. */
const PASO_TECLA = 2000;

type Tip = { x: number; i: number };

function rotuloPaso(orden: number): string {
  return orden === 0 ? 'Contexto' : `Paso ${String(orden).replace('.', ',')}`;
}

function reloj(ms: number): string {
  const sg = Math.round(ms / 1000);
  return `${Math.floor(sg / 60)}:${String(sg % 60).padStart(2, '0')}`;
}

export default function BarraTiempo({ rep, escenario, visto }: { rep: Reproductor; escenario: Escenario; visto: Set<number> }) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const agarre = useRef<number | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const { inicios, duracionTotal: total } = rep;
  const n = inicios.length;
  const largo = (i: number) => (inicios[i + 1] ?? total) - inicios[i];

  /** Puntero (clientX) → segmento e instante global, descontando los huecos:
   *  el segmento i mide largo_i / total · (ancho − huecos), igual que el flex. */
  const medir = (clientX: number): { i: number; tg: number; x: number } | null => {
    const el = pistaRef.current;
    if (!el || total <= 0) return null;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(0, clientX - r.left), r.width);
    const util = Math.max(1, r.width - HUECO * (n - 1));
    let x0 = 0;
    for (let i = 0; i < n; i++) {
      const w = (largo(i) / total) * util;
      // El hueco se reparte: su mitad izquierda cae al final del segmento.
      if (x <= x0 + w + HUECO / 2 || i === n - 1) {
        const f = w > 0 ? Math.min(Math.max(0, (x - x0) / w), 1) : 0;
        return { i, tg: inicios[i] + f * largo(i), x };
      }
      x0 += w + HUECO;
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || agarre.current !== null) return;
    const m = medir(e.clientX);
    if (!m) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    agarre.current = e.pointerId;
    // Primero se agarra (guarda si se reproducía) y luego se salta: si no,
    // `buscar` fuera de arrastre pausaría.
    rep.empezarArrastre();
    rep.buscar(m.tg);
    setTip({ x: m.x, i: m.i });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const arrastra = agarre.current === e.pointerId;
    if (!arrastra && e.pointerType !== 'mouse') return;
    const m = medir(e.clientX);
    if (!m) return;
    if (arrastra) rep.buscar(m.tg);
    setTip((p) => (p && p.x === m.x && p.i === m.i ? p : { x: m.x, i: m.i }));
  };

  const soltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (agarre.current !== e.pointerId) return;
    agarre.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    rep.terminarArrastre();
    // En táctil no hay «hover» que mantener; con ratón, solo si sigue encima.
    const r = e.currentTarget.getBoundingClientRect();
    const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (e.pointerType !== 'mouse' || !dentro) setTip(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let tg: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') tg = rep.tGlobal + PASO_TECLA;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') tg = rep.tGlobal - PASO_TECLA;
    else if (e.key === 'Home') tg = 0;
    else if (e.key === 'End') tg = total;
    else if (e.key === 'PageDown') tg = inicios[Math.min(n - 1, rep.paso + 1)];
    else if (e.key === 'PageUp') tg = inicios[rep.terminado || rep.t > 400 ? rep.paso : Math.max(0, rep.paso - 1)];
    else if (e.key === ' ' || e.key === 'k' || e.key === 'K') { e.preventDefault(); e.stopPropagation(); rep.alternar(); return; }
    if (tg === null) return;
    e.preventDefault();
    e.stopPropagation();
    rep.buscar(tg);
  };

  // Tooltip acotado a la barra: se mide ya pintado (antes del fotograma) y se
  // corre para que no asome por los bordes.
  useLayoutEffect(() => {
    const el = tipRef.current, pista = pistaRef.current;
    if (!el || !pista || !tip) return;
    const W = pista.clientWidth, w = el.offsetWidth;
    const x = W <= w ? W / 2 : Math.min(Math.max(tip.x, w / 2), W - w / 2);
    el.style.left = `${x}px`;
  }, [tip]);

  const pasoActual = escenario.pasos[rep.paso];
  const maxOrden = Math.max(...escenario.pasos.map((p) => p.orden));
  const tipPaso = tip ? escenario.pasos[tip.i] : null;
  const a = total > 0 ? rep.tGlobal / total : 0;

  return (
    <div
      className={`${s.barraTiempo} ${rep.arrastrando ? s.btActiva : ''}`}
      role="slider"
      tabIndex={0}
      aria-label="Línea de tiempo de la vía"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={Math.round(total)}
      aria-valuenow={Math.round(rep.tGlobal)}
      aria-valuetext={pasoActual ? `${rotuloPaso(pasoActual.orden)}${pasoActual.orden ? ` de ${maxOrden}` : ''}: ${etiquetaTexto(pasoActual.titulo)} · ${reloj(rep.tGlobal)} de ${reloj(total)}` : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={soltar}
      onPointerCancel={soltar}
      onLostPointerCapture={soltar}
      onPointerLeave={() => { if (agarre.current === null) setTip(null); }}
      onKeyDown={onKeyDown}
      style={{ '--bt-hueco': `${HUECO}px`, '--bt-huecos': n - 1, '--bt-a': a, '--bt-i': rep.paso } as React.CSSProperties}
    >
      <div className={s.btPista} ref={pistaRef}>
        {escenario.pasos.slice(0, n).map((p, i) => {
          const f = i < rep.paso ? 1 : i > rep.paso ? 0 : rep.terminado ? 1 : Math.min(1, rep.t / largo(i));
          return (
            <div
              key={p.id}
              className={`${s.btSegmento} ${visto.has(i) ? s.btVisto : ''} ${p.lateral ? s.btLateral : ''} ${tip?.i === i ? s.btBajo : ''}`}
              style={{ flexGrow: largo(i) }}
            >
              <span className={s.btRelleno} style={{ transform: `scaleX(${f})` }} />
            </div>
          );
        })}
        <span className={s.btTirador} aria-hidden />
      </div>
      {tipPaso && (
        <div className={s.btTooltip} ref={tipRef} aria-hidden>
          <strong>{rotuloPaso(tipPaso.orden)}</strong>
          <span> · {etiquetaTexto(tipPaso.titulo)}</span>
        </div>
      )}
    </div>
  );
}
