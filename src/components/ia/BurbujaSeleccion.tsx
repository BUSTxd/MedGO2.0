'use client';
import { useEffect, useState, type RefObject } from 'react';
import type { PedidoIA } from './useChatIA';
import s from '@/styles/panelIA.module.css';

const MAX = 600;

/**
 * Ruta de títulos (h1-h4) que tiene encima un nodo, en el mismo formato
 * «Padre › Hijo» que usa el visor. Es sólo una pista: el servidor busca lo
 * subrayado por contenido.
 */
function rutaDe(sheet: HTMLElement, nodo: Node): string | undefined {
  const pila: { n: number; t: string }[] = [];
  for (const h of Array.from(sheet.querySelectorAll<HTMLElement>('h1, h2, h3, h4'))) {
    const antes = h.contains(nodo) || !!(h.compareDocumentPosition(nodo) & Node.DOCUMENT_POSITION_FOLLOWING);
    if (!antes) break;
    const n = Number(h.tagName[1]);
    while (pila.length && pila[pila.length - 1].n >= n) pila.pop();
    pila.push({ n, t: (h.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 120) });
  }
  return pila.length ? pila.map((p) => p.t).join(' › ') : undefined;
}

/**
 * Burbuja que aparece sobre lo subrayado en «modo IA». Tiene su propio estado
 * a propósito: vive dentro del visor, y un estado en el visor re-renderizaría
 * el documento inyectado en cada selección.
 */
export default function BurbujaSeleccion({
  sheetRef,
  activo,
  onPedir,
}: {
  sheetRef: RefObject<HTMLElement | null>;
  activo: boolean;
  onPedir: (p: PedidoIA) => void;
}) {
  const [sel, setSel] = useState<{ texto: string; ruta?: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!activo) { setSel(null); return; }
    const leer = () => {
      const sheet = sheetRef.current;
      const s = window.getSelection();
      if (!sheet || !s || s.isCollapsed || s.rangeCount === 0) { setSel(null); return; }
      const rango = s.getRangeAt(0);
      if (!sheet.contains(rango.commonAncestorContainer)) { setSel(null); return; }
      const texto = s.toString().replace(/\s+/g, ' ').trim();
      if (texto.length < 2) { setSel(null); return; }
      const r = rango.getBoundingClientRect();
      setSel({
        texto,
        ruta: rutaDe(sheet, rango.startContainer),
        x: Math.min(window.innerWidth - 140, Math.max(140, r.left + r.width / 2)),
        y: Math.max(64, r.top),
      });
    };
    // Al soltar el mouse (o el dedo, o mayúsculas+flechas) se lee la selección.
    const alSoltar = () => setTimeout(leer, 0);
    const ocultar = () => setSel(null);
    document.addEventListener('mouseup', alSoltar);
    document.addEventListener('touchend', alSoltar);
    document.addEventListener('keyup', alSoltar);
    document.addEventListener('scroll', ocultar, true);
    return () => {
      document.removeEventListener('mouseup', alSoltar);
      document.removeEventListener('touchend', alSoltar);
      document.removeEventListener('keyup', alSoltar);
      document.removeEventListener('scroll', ocultar, true);
    };
  }, [activo, sheetRef]);

  if (!sel) return null;
  const largo = sel.texto.length > MAX;
  const corto = sel.texto.split(' ').length <= 6;

  const mandar = (accion: 'definir' | 'explicar') => {
    onPedir({ accion, seleccion: sel.texto, seccion: sel.ruta });
    window.getSelection()?.removeAllRanges();
    setSel(null);
  };

  return (
    <div
      className={s.burbuja}
      style={{ left: sel.x, top: sel.y }}
      // Pulsar un botón no debe deshacer la selección antes del clic.
      onMouseDown={(e) => e.preventDefault()}
    >
      {largo ? (
        <span className={s.burbujaAviso}>Selecciona un fragmento más corto</span>
      ) : (
        <>
          {corto && <button onClick={() => mandar('definir')}>¿Qué significa?</button>}
          <button onClick={() => mandar('explicar')}>Explícame</button>
        </>
      )}
    </div>
  );
}
