'use client';
// Globo (al pasar el cursor) y tarjeta desplegada (al hacer clic) de un aviso.
// Van por portal a <body> con posición fija calculada desde la baliza: dentro
// del mundo escalarían con el zoom y quedarían ilegibles a 40 %. Sin
// `backdrop-filter` (en esta app ya dejó el fondo en blanco al cerrar un overlay).

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Aviso } from '@/lib/data/coagulacion';
import s from '@/styles/cascadaCoagulacion.module.css';

interface Ancla {
  aviso: Aviso;
  rect: DOMRect;
}

/** Coloca una caja de `w×h` junto a `r` sin salirse de la ventana. */
function colocar(r: DOMRect, w: number, h: number, sep = 12) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = r.left + r.width / 2 - w / 2;
  let top = r.top - h - sep;
  let debajo = false;
  if (top < 8) {
    top = r.bottom + sep;
    debajo = true;
  }
  if (top + h > vh - 8) top = Math.max(8, vh - h - 8);
  left = Math.min(Math.max(8, left), vw - w - 8);
  return { left, top, debajo };
}

export function GloboAviso({ ancla }: { ancla: Ancla | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!ancla || !ref.current) { setPos(null); return; }
    const { width, height } = ref.current.getBoundingClientRect();
    setPos(colocar(ancla.rect, width, height, 10));
  }, [ancla]);

  if (!ancla || typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      className={s.globo}
      style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: -9999 }}
    >
      <span className={s.globoTitulo}>{ancla.aviso.titulo}</span>
      <span className={s.globoTexto}>{ancla.aviso.corto}</span>
      <span className={s.globoPie}>Clic para ver más</span>
    </div>,
    document.body,
  );
}

export function TarjetaAviso({ ancla, onCerrar }: { ancla: Ancla | null; onCerrar: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; debajo: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!ancla || !ref.current) { setPos(null); return; }
    const { width, height } = ref.current.getBoundingClientRect();
    setPos(colocar(ancla.rect, width, height, 14));
  }, [ancla]);

  useEffect(() => {
    if (!ancla) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (ref.current?.contains(t) || t.closest('[data-aviso]')) return;
      onCerrar();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [ancla, onCerrar]);

  if (!ancla || typeof document === 'undefined') return null;
  const { aviso } = ancla;
  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={aviso.titulo}
      key={aviso.id}
      className={`${s.tarjeta} ${pos?.debajo ? s.tarjetaDebajo : ''}`}
      style={pos ? { left: pos.left, top: pos.top } : { left: -9999, top: -9999 }}
    >
      <div className={s.tarjetaCab}>
        <span className={s.tarjetaTitulo}>{aviso.titulo}</span>
        <button type="button" className={s.tarjetaCerrar} onClick={onCerrar} aria-label="Cerrar">
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {aviso.mnemo && <div className={s.mnemo}>{aviso.mnemo}</div>}
      <div className={s.tarjetaCuerpo}>
        {aviso.cuerpo.map((p, i) => (
          <p key={i} style={{ ['--i' as string]: i }}>{p}</p>
        ))}
      </div>
    </div>,
    document.body,
  );
}
