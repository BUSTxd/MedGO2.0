'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const MOVE_THRESHOLD = 6; // px para distinguir tap de arrastre

export interface GhostPos {
  x: number;
  y: number;
}

interface Options<T> {
  /** Se llama al soltar sobre un slot (`slotKey`) o fuera (`null`). */
  onDrop: (item: T, slotKey: string | null) => void;
  /** Deshabilita el arrastre (p. ej. tras verificar respuestas). */
  disabled?: boolean;
}

/**
 * Drag & drop reutilizable (Pointer Events + fallback tap), extraído de la
 * mecánica de `parametro-sangre-orina`. Los slots destino deben tener
 * `data-slot="<key>"`. El consumidor renderiza el "fantasma" usando `dragItem`
 * y `ghostPos`.
 */
export function useDragDrop<T extends { id: string }>({ onDrop, disabled }: Options<T>) {
  const [dragItem, setDragItem] = useState<T | null>(null);
  const [ghost, setGhost] = useState<GhostPos>({ x: 0, y: 0 });
  const [target, setTarget] = useState<string | null>(null);
  /** Selección por tap (móvil / click). */
  const [picked, setPicked] = useState<T | null>(null);

  const startRef = useRef<GhostPos>({ x: 0, y: 0 });
  const itemRef = useRef<T | null>(null);
  const targetRef = useRef<string | null>(null);
  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  /** Elemento que capturó el puntero (para liberar la captura al soltar). */
  const captureRef = useRef<{ el: HTMLElement; pointerId: number } | null>(null);

  const moveGhost = (x: number, y: number) => setGhost({ x, y });

  const releaseCapture = () => {
    const cap = captureRef.current;
    if (cap) {
      try {
        cap.el.releasePointerCapture(cap.pointerId);
      } catch {
        /* el puntero ya se liberó */
      }
      captureRef.current = null;
    }
  };

  const onPointerMove = useCallback((e: PointerEvent) => {
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (!draggingRef.current) {
      if (Math.hypot(dx, dy) < MOVE_THRESHOLD) return;
      draggingRef.current = true;
      didDragRef.current = true;
      setDragItem(itemRef.current);
    }
    moveGhost(e.clientX, e.clientY);
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slotEl = el?.closest('[data-slot]') as HTMLElement | null;
    const key = slotEl?.dataset.slot ?? null;
    if (key !== targetRef.current) {
      targetRef.current = key;
      setTarget(key);
    }
  }, []);

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      releaseCapture();
      const item = itemRef.current;
      // pointercancel no trae coordenadas fiables: usamos el último target detectado.
      if (draggingRef.current && item) {
        let key = targetRef.current;
        if (e.type !== 'pointercancel') {
          const el = document.elementFromPoint(e.clientX, e.clientY);
          const slotEl = el?.closest('[data-slot]') as HTMLElement | null;
          key = slotEl?.dataset.slot ?? null;
        }
        onDrop(item, key);
      }
      draggingRef.current = false;
      itemRef.current = null;
      targetRef.current = null;
      setDragItem(null);
      setTarget(null);
    },
    [onDrop, onPointerMove],
  );

  const startDrag = useCallback(
    (e: React.PointerEvent, item: T) => {
      if (disabled) return;
      e.preventDefault();
      // Captura el puntero para que el arrastre no lo secuestre un gesto de
      // scroll del navegador (trackpad/pantalla táctil) -> evita pointercancel.
      const el = e.currentTarget as HTMLElement;
      try {
        el.setPointerCapture(e.pointerId);
        captureRef.current = { el, pointerId: e.pointerId };
      } catch {
        captureRef.current = null;
      }
      startRef.current = { x: e.clientX, y: e.clientY };
      itemRef.current = item;
      draggingRef.current = false;
      didDragRef.current = false;
      moveGhost(e.clientX, e.clientY);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [disabled, onPointerMove, onPointerUp],
  );

  // Fallback tap: seleccionar un item y luego tocar un slot.
  const tapItem = useCallback(
    (item: T) => {
      if (disabled || didDragRef.current) return;
      setPicked((p) => (p?.id === item.id ? null : item));
    },
    [disabled],
  );

  const tapSlot = useCallback(
    (slotKey: string, occupant?: T | null) => {
      if (disabled || didDragRef.current) return;
      if (picked) {
        // hay un chip seleccionado -> colocarlo aquí
        onDrop(picked, slotKey);
        setPicked(null);
      } else if (occupant) {
        // slot ocupado y nada seleccionado -> devolver el chip al banco
        onDrop(occupant, null);
      }
    },
    [disabled, onDrop, picked],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      releaseCapture();
    };
  }, [onPointerMove, onPointerUp]);

  return { dragItem, ghost, target, picked, startDrag, tapItem, tapSlot };
}
