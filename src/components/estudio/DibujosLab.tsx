'use client';
// Los dibujos de los bloques de «Casos clínicos» que no son los dos propios de la AI17:
// piezas que ya existen en los laboratorios virtuales (Citopenias, Vasculitis,
// Gramnegativas) e ilustraciones del bucket `laboratorio-img` (Linfocitos,
// Hipersensibilidad). No se dibuja nada nuevo: cada pieza se pinta sola y se encuadra
// midiendo su contorno, porque vive en el lienzo de su laboratorio (1600 × 1000).
// Se carga con `next/dynamic` desde CasosClinicos: el lector no paga estas piezas.

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as CT from '@/app/dashboard/laboratorio/citopenias-autoinmunes/Piezas';
import * as VS from '@/app/dashboard/laboratorio/vasculitis-anca/Piezas';
import * as GN from '@/app/dashboard/laboratorio/gramnegativas/Piezas';
import { srcImagen as linfocitos } from '@/lib/data/linfocitos/imagenes';
import { srcPropia as hipersensibilidad } from '@/lib/data/hipersensibilidad/imagenes';
import type { DibujoLab } from '@/lib/data/clases/tipos';

type Pieza = { pieza: () => ReactNode } | { img: string | null };

const PIEZAS: Record<DibujoLab, Pieza> = {
  corazon: { pieza: () => <CT.Corazon /> },
  higado: { pieza: () => <CT.Higado /> },
  linfocito: { pieza: () => <CT.Linfocito /> },
  plasmatica: { pieza: () => <CT.Plasmatica /> },
  termometro: { pieza: () => <CT.Termometro val={0.85} /> },
  igg: { pieza: () => <CT.IgG /> },
  'plaqueta-lab': { pieza: () => <CT.Plaqueta /> },
  neutrofilo: { pieza: () => <VS.Neutrofilo activo={1} /> },
  eosinofilo: { pieza: () => <VS.Eosinofilo /> },
  granuloma: { pieza: () => <VS.Granuloma /> },
  'celula-gigante': { pieza: () => <VS.CelGigante /> },
  purpura: { pieza: () => <VS.PiernaPurpura p={1} /> },
  pulmones: { pieza: () => <VS.Pulmones infiltrados={1} /> },
  alveolos: { pieza: () => <VS.Alveolos sangre={0.6} /> },
  rinon: { pieza: () => <VS.Rinon /> },
  bacilo: { pieza: () => <GN.Bacilo fimbrias={1} flagelo={1} /> },
  enterocito: { pieza: () => <GN.Enterocito /> },
  nk: { img: linfocitos('nk') },
  ganglio: { img: linfocitos('ganglio') },
  'linfocito-b': { img: linfocitos('linfocito_2') },
  hsc: { img: linfocitos('hsc') },
  mieloide: { img: linfocitos('mieloide') },
  anticuerpo: { img: linfocitos('anticuerpo_2') },
  tirocito: { img: hipersensibilidad('tirocito') },
  'terminal-nerviosa': { img: hipersensibilidad('terminal_nerviosa') },
  't-cd4': { img: hipersensibilidad('t_cd4') },
  't-cd8': { img: hipersensibilidad('t_cd8') },
  mastocito: { img: hipersensibilidad('mastocito_activo') },
  'celula-opsonizada': { img: hipersensibilidad('celula_opsonizada') },
  complejo: { pieza: () => <VS.Complejo /> },
};

/** Una pieza del lienzo, encuadrada a su contorno real (con un margen). */
function Encuadre({ children }: { children: ReactNode }) {
  const g = useRef<SVGGElement>(null);
  const [vista, setVista] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (!g.current) return;
    const b = g.current.getBBox();
    if (!b.width || !b.height) return;
    const lado = Math.max(b.width, b.height) * 1.08;
    setVista(`${b.x + b.width / 2 - lado / 2} ${b.y + b.height / 2 - lado / 2} ${lado} ${lado}`);
  }, []);
  return (
    <svg viewBox={vista ?? '-200 -200 400 400'} aria-hidden="true" style={{ visibility: vista ? 'visible' : 'hidden', overflow: 'visible' }}>
      <g ref={g}>{children}</g>
    </svg>
  );
}

export default function DibujoDeLab({ dibujo }: { dibujo: DibujoLab }) {
  const p = PIEZAS[dibujo];
  if (!p) return null;
  if ('img' in p) return p.img ? <img src={p.img} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null;
  return <Encuadre>{p.pieza()}</Encuadre>;
}

export const NOMBRES_LAB = Object.keys(PIEZAS) as DibujoLab[];
