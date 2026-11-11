'use client';
// Lienzo del laboratorio «Infecciones bacterianas por gramnegativas» (el mismo de
// Citopenias, con su fondo y sus láminas). Pinta la lámina del paso que
// toca, como función del tiempo que da el motor de Lupus: los parámetros (`tejido`)
// llevan un prefijo «capítulo.paso.», así que cada lámina lee solo los suyos y la del
// paso anterior conserva su estado final mientras se funde (nada desaparece de golpe).
// Las láminas de cada capítulo se bajan aparte: las de pago no pesan en el vistazo.

import { memo, useEffect, useRef, useState, type ComponentType } from 'react';
import { TxCtx, clamp, hash } from '../citopenias-autoinmunes/Piezas';
import s from '@/styles/gramnegativas.module.css';

export type PropsLamina = {
  /** Parámetro de esta lámina, de 0 a 1. */
  p: (nombre: string) => number;
  /** Ms acumulados de la parte: lo que se mueve solo (el flujo de un vaso). */
  reloj: number;
};
export type Lamina = ComponentType<PropsLamina>;

const CARGAS: Record<number, () => Promise<{ default: Lamina[] }>> = {
  0: () => import('./laminas/c0'),
  1: () => import('./laminas/c1'),
  2: () => import('./laminas/c2'),
  3: () => import('./laminas/c3'),
  4: () => import('./laminas/c4'),
  5: () => import('./laminas/c5'),
  6: () => import('./laminas/c6'),
  7: () => import('./laminas/c7'),
  8: () => import('./laminas/c8'),
  9: () => import('./laminas/c9'),
};

const listas = new Map<number, Lamina[]>();
const enCurso = new Map<number, Promise<Lamina[]>>();

/** Baja las láminas de un capítulo (una sola vez). */
export function cargarLaminas(cap: number): Promise<Lamina[]> {
  const ya = listas.get(cap);
  if (ya) return Promise.resolve(ya);
  let c = enCurso.get(cap);
  if (!c) {
    c = CARGAS[cap]().then((m) => { listas.set(cap, m.default); return m.default; });
    enCurso.set(cap, c);
  }
  return c;
}

/** Partículas desenfocadas, como en las referencias: degradados, nunca `filter`. */
function Particulas({ colores, id, n, clase, opac }: { colores: string[]; id: string; n: number; clase: string; opac: number }) {
  return (
    <g className={clase} aria-hidden>
      <defs>
        {colores.map((c, i) => (
          <radialGradient key={c} id={`${id}-${i}`}>
            <stop offset="0" stopColor={c} stopOpacity={opac} /><stop offset="0.6" stopColor={c} stopOpacity={opac * 0.7} /><stop offset="1" stopColor={c} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={-300 + hash(i, 71) * 2200} cy={-60 + hash(i, 72) * 1120} r={8 + hash(i, 73) * hash(i, 74) * 70} fill={`url(#${id}-${i % colores.length})`} />
      ))}
    </g>
  );
}

const Bokeh = memo(function Bokeh() {
  return (
    <>
      <Particulas id="gn-bk-c" clase={s.bokehClaro} colores={['#FFFFFF', '#F7A8D8', '#FFE7A0']} n={22} opac={0.55} />
      <Particulas id="gn-bk-o" clase={s.bokehOscuro} colores={['#E0339A', '#46E07A', '#8F6BFF', '#5FD8F0']} n={30} opac={0.42} />
    </>
  );
});

const FUNDIDO = 650;

export default function Lienzo({ cap, paso, t, tejido, reloj, entero = false }: { cap: number; paso: number; t: number; tejido: Record<string, number>; reloj: number; entero?: boolean }) {
  const [laminas, setLaminas] = useState<Lamina[] | null>(() => listas.get(cap) ?? null);
  const zona = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(1);

  useEffect(() => {
    let vigente = true;
    void cargarLaminas(cap).then((l) => { if (vigente) setLaminas(l); });
    return () => { vigente = false; };
  }, [cap]);

  // En una zona estrecha el lienzo se encoge: los rótulos crecen para seguir leyéndose.
  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    const medir = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (w < 10) return;
      const escala = Math.min(w / 1600, h / 1000);
      setTx(Math.round(clamp(0.4 / escala, 1, 1.25) * 10) / 10);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lector = (i: number) => (nombre: string) => (entero ? 1 : tejido[`${cap}.${i}.${nombre}`] ?? 0);
  const Actual = laminas?.[paso];
  const Previa = !entero && paso > 0 ? laminas?.[paso - 1] : undefined;
  const q = entero ? 1 : clamp(t / FUNDIDO);

  return (
    <div ref={zona} className={s.lienzo}>
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" className={s.svg} style={{ overflow: 'visible' }} role="img" aria-label="Lámina animada del capítulo">
        <Bokeh />
        <TxCtx.Provider value={tx}>
          {Previa && q < 1 && <g opacity={1 - q}><Previa p={lector(paso - 1)} reloj={reloj} /></g>}
          {Actual && <g opacity={Previa ? q : 1}><Actual p={lector(paso)} reloj={reloj} /></g>}
        </TxCtx.Provider>
      </svg>
    </div>
  );
}
