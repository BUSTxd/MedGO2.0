// Layout del lienzo único con zoom continuo. Calcula, en coordenadas del world
// (el mismo viewBox del nefrón), la caja de detalle celular de cada segmento, la
// columna de cada célula y la posición de cada transportador según su membrana.
// También deriva el transform de "cámara" que lleva una caja a llenar el viewBox.

import type { CellDef, SegmentDef, TransporterDef } from './types';
import { NEFRON_VIEWBOX, SEGMENT_GEOMS } from './geometry';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Caja de detalle de un segmento, centrada sobre su insignia (badge). */
export function segmentDetailBox(seg: SegmentDef): Box {
  const badge = SEGMENT_GEOMS[seg.id].badge;
  const n = Math.max(1, seg.celulas.length);
  const w = n <= 1 ? 240 : n * 176;
  const h = 220;
  return { x: badge.x - w / 2, y: badge.y - h / 2, w, h };
}

/** Columnas (una por célula) dentro de la caja de detalle. */
export function cellColumns(seg: SegmentDef, box: Box): { cell: CellDef; box: Box }[] {
  const n = Math.max(1, seg.celulas.length);
  const gap = 14;
  const top = box.y + 30; // espacio para el rótulo del segmento
  const cw = (box.w - gap * (n + 1)) / n;
  const ch = box.h - 30 - 18;
  return seg.celulas.map((cell, i) => ({
    cell,
    box: { x: box.x + gap + i * (cw + gap), y: top, w: cw, h: ch },
  }));
}

export interface TransporterSlot {
  t: TransporterDef;
  x: number;
  y: number;
}

/** Transportadores apicales/basolaterales colocados sobre su membrana (sin paracelular). */
export function transporterSlots(cell: CellDef, cellBox: Box): TransporterSlot[] {
  const apicalX = cellBox.x + cellBox.w * 0.27;
  const basoX = cellBox.x + cellBox.w * 0.73;
  const groups: Record<string, TransporterDef[]> = { apical: [], basolateral: [] };
  cell.transportadores.forEach((id) => {
    const t = TRANSPORTERS[id];
    if (t && t.membrana !== 'paracelular') groups[t.membrana]?.push(t);
  });

  const slots: TransporterSlot[] = [];
  const place = (arr: TransporterDef[], x: number) => {
    // Deja sitio arriba para la franja paracelular y abajo para el nombre de la célula.
    const top = cellBox.y + 30;
    const bottom = cellBox.y + cellBox.h - 16;
    const span = bottom - top;
    arr.forEach((t, i) => {
      const y = arr.length === 1 ? (top + bottom) / 2 : top + span * (i / (arr.length - 1));
      slots.push({ t, x, y });
    });
  };
  place(groups.apical, apicalX);
  place(groups.basolateral, basoX);
  return slots;
}

/** Transportadores paracelulares (vía claudinas) de una célula. */
export function paracellularTransporters(cell: CellDef): TransporterDef[] {
  return cell.transportadores
    .map((id) => TRANSPORTERS[id])
    .filter((t): t is TransporterDef => !!t && t.membrana === 'paracelular');
}

/** Franja paracelular: banda fina en el borde superior de la célula (luz → sangre). */
export function paracellularBox(cellBox: Box): Box {
  return { x: cellBox.x + 4, y: cellBox.y + 6, w: cellBox.w - 8, h: 16 };
}

/** Geometría de las bandas (lumen / membranas / citoplasma / intersticio) de una célula. */
export function cellBands(box: Box) {
  const apicalX = box.x + box.w * 0.27;
  const basoX = box.x + box.w * 0.73;
  return {
    lumen: { x: box.x, w: apicalX - box.x },
    cito: { x: apicalX, w: basoX - apicalX },
    inters: { x: basoX, w: box.x + box.w - basoX },
    apicalX,
    basoX,
  };
}

const ZOOM_PAD = 0.14;

export interface Camera {
  k: number;
  x: number;
  y: number;
}

/**
 * Cámara (escala k + traslación x,y, en unidades del viewBox) que lleva `box` a
 * llenar el viewBox. El transform SVG resultante es `translate(x,y) scale(k)`.
 * box null → cámara identidad (nefrón completo).
 */
export function cameraForBox(box: Box | null): Camera {
  if (!box) return { k: 1, x: 0, y: 0 };
  const vb = NEFRON_VIEWBOX;
  const padW = box.w * ZOOM_PAD;
  const padH = box.h * ZOOM_PAD;
  const bw = box.w + padW * 2;
  const bh = box.h + padH * 2;
  const bx = box.x - padW;
  const by = box.y - padH;
  const k = Math.min(vb.w / bw, vb.h / bh);
  const x = vb.w / 2 - k * (bx + bw / 2);
  const y = vb.h / 2 - k * (by + bh / 2);
  return { k, x, y };
}
