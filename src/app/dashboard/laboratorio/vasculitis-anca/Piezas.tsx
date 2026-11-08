'use client';
// Piezas del laboratorio «Vasculitis de vasos medianos y pequeños y ANCA», en el estilo
// de las referencias de BUST (infografía plana de colores saturados): formas
// redondeadas sin contorno; cada objeto lleva una sombra interior en media luna (un
// tono más oscuro, desplazado) y un brillo blanco pequeño. Rótulos de color sólido con
// punta de flecha y texto blanco. Lienzo de 1600 × 1000, sin `filter`.
//
// Los ayudantes genéricos (`En`, `Sale`, `Flecha`, `Txt`, `tramo`…) y algunas células
// (linfocito, macrófago, plasmática, plaqueta, IgG) son los de Citopenias, sin copiarlos.

import { memo, useContext, useId, type ReactNode } from 'react';
import { C as CC, En, IgG, TxCtx, blob, clamp, easeBack, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import s from '@/styles/citopenias.module.css';
import v from '@/styles/vasculitis.module.css';

export { En, Sale, Flecha, Txt, Rotulo, IgG, Linfocito, Macrofago, Plasmatica, Plaqueta, Esfera, clamp, tramo, lerp, easeOut, easeBack, hash, blob } from '../citopenias-autoinmunes/Piezas';
export { Barra, Lente, viaje, FLECHA, Cruz, Visto } from '../citopenias-autoinmunes/laminas/Comun';

/** Paleta: tres o cuatro tonos por color (oscuro → claro). Valen en los dos temas. */
export const V = {
  sangre: ['#9E0B2E', '#E3203F', '#FF5D6C', '#FFA3AB'],
  pared: ['#3E0820', '#5E1030', '#7E1840', '#A32A55'],
  endo: ['#E8344E', '#FF7480', '#FFC0C5'],
  neutro: ['#B9478E', '#EE86C2', '#FFC6E4'],
  nucleo: ['#3F1680', '#6327BE', '#9A6BF2'],
  eos: ['#C8431F', '#FF7A3D', '#FFC09A'],
  granEos: '#FFD23F',
  anca: ['#97155F', '#E0338A', '#FF9ACB'],
  igg: CC.igg,
  pr3: ['#C77800', '#FFB21E', '#FFE08A'],
  mpo: ['#138A3A', '#3FD467', '#B5F5C4'],
  c5a: ['#C2410C', '#FF8A2B', '#FFC58A'],
  fibrina: ['#C99300', '#FFD23F', '#FFF0A8'],
  verde: ['#11A43C', '#3BE35C', '#B7FFC4'],
  violeta: ['#4B1FA0', '#7A45E6', '#B79BFF'],
  turquesa: ['#0A7F86', '#16B9BE', '#7FEDE8'],
  ambar: ['#C46A00', '#FF9F1C', '#FFD27A'],
  piel: ['#C9806A', '#E9A58A', '#F6CDB8'],
  pielOsc: ['#8A4E3A', '#A8664E', '#C98A70'],
  hueso: ['#E8D9B8', '#F7EED8'],
  rinon: ['#7A1E3A', '#B2345A', '#E26A8C'],
  pulmon: ['#C44E8A', '#F07BB4', '#FFC3E0'],
  moco: ['#9BC23B', '#C6E86A'],
};

// ─── Base ─────────────────────────────────────────────────────────────────────

/** Esfera de la referencia: tono oscuro abajo a la derecha, base, y brillo. */
export function Bola({ x = 0, y = 0, R, tono, o = 1, brillo = true }: { x?: number; y?: number; R: number; tono: string[]; o?: number; brillo?: boolean }) {
  return (
    <En x={x} y={y} o={o}>
      <circle r={R} fill={tono[0]} />
      <circle cx={-R * 0.09} cy={-R * 0.09} r={R * 0.88} fill={tono[1]} />
      {brillo && <circle cx={-R * 0.38} cy={-R * 0.4} r={R * 0.17} fill={tono[2] ?? '#FFF'} opacity={0.95} />}
    </En>
  );
}

/** Banderita de la referencia: rectángulo de color sólido con punta, texto blanco. */
export function Bandera({ x, y, txt, color = V.violeta[1], p = 1, t = 30, punta = 'der', ancla = 'centro' }: { x: number; y: number; txt: string; color?: string; p?: number; t?: number; punta?: 'der' | 'izq' | 'abajo' | 'no'; ancla?: 'centro' | 'izq' | 'der' }) {
  const tx = useContext(TxCtx);
  if (p <= 0.002) return null;
  const w = txt.length * t * 0.56 + t * 1.2, h = t * 1.8, pk = h * 0.42;
  const dx = ancla === 'izq' ? w / 2 : ancla === 'der' ? -w / 2 : 0;
  const media = (w * tx) / 2 + pk + 8;
  const xx = Math.min(1600 - media, Math.max(media, x + dx * tx));
  const forma = punta === 'der' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2 + pk},0 L${w / 2},${h / 2} L${-w / 2},${h / 2} Z`
    : punta === 'izq' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2} L${-w / 2 - pk},0 Z`
    : punta === 'abajo' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${pk * 0.7},${h / 2} L0,${h / 2 + pk * 0.8} L${-pk * 0.7},${h / 2} L${-w / 2},${h / 2} Z`
    : `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2} Z`;
  return (
    <En x={xx} y={y} k={tx * (0.86 + 0.14 * easeBack(clamp(p)))} o={tramo(p, 0, 0.5)}>
      <path d={forma} fill={color} />
      <text dy="0.35em" textAnchor="middle" className={s.rotulo} style={{ fontSize: t }}>{txt}</text>
    </En>
  );
}

/** Tarjeta de la referencia de los pacientes: cuadrado crema de esquinas redondas. */
export function Tarjeta({ x = 0, y = 0, w = 300, h = 300, o = 1, color = '#FFF7E8', children }: { x?: number; y?: number; w?: number; h?: number; o?: number; color?: string; children?: ReactNode }) {
  return (
    <En x={x} y={y} o={o}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill={color} />
      {children}
    </En>
  );
}

/** Pantalla de laboratorio (referencia «análisis de una célula»): fondo violeta y marco
 *  verde con esquinas cortadas. Siempre oscura, también en el tema claro. */
export function Pantalla({ x = 0, y = 0, w = 1200, h = 700, p = 1, children }: { x?: number; y?: number; w?: number; h?: number; p?: number; children?: ReactNode }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p * 1.4)), c = 46, W = w / 2, H = h / 2;
  const marco = `M${-W + c},${-H} L${W * 0.35},${-H} L${W * 0.42},${-H + 26} L${W - c},${-H + 26} L${W},${-H + 26 + c} L${W},${H - c} L${W - c},${H} L${-W * 0.3},${H} L${-W * 0.37},${H - 26} L${-W + c},${H - 26} L${-W},${H - 26 - c} L${-W},${-H + c} Z`;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.4)} k={0.94 + 0.06 * q}>
      <path d={marco} fill="var(--vas-pantalla)" />
      <path d={marco} fill="none" stroke={V.verde[1]} strokeWidth={7} strokeLinejoin="round" strokeDasharray={`${q * 6000} 6000`} />
      {[0, 1, 2].map((i) => <rect key={i} x={-W + 40 + i * 0} y={-H + 34 + i * 16} width={i === 1 ? 90 : 60} height={7} rx={3.5} fill={V.verde[1]} opacity={0.8} />)}
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={W - 40 - i * 46} cy={-H + 70} r={17} fill="none" stroke={V.verde[1]} strokeWidth={6} strokeDasharray={`${70 + i * 8} 200`} opacity={0.9} />)}
      {children}
    </En>
  );
}

/** Texto verde claro de las pantallas. */
export function TxtPantalla({ x, y, txt, t = 30, p = 1, ancla = 'middle' }: { x: number; y: number; txt: string; t?: number; p?: number; ancla?: 'start' | 'middle' | 'end' }) {
  if (p <= 0.002) return null;
  return <text x={x} y={y} dy="0.35em" textAnchor={ancla} className={v.txtPantalla} style={{ fontSize: t }} opacity={tramo(p, 0, 0.6)}>{txt}</text>;
}

// ─── Sangre ───────────────────────────────────────────────────────────────────

/** Glóbulo rojo en rosquilla, de frente (`lado` 0) o de canto (`lado` 1). `vesiculas`: acantocito. */
export const Hematie = memo(function Hematie({ x = 0, y = 0, r = 0, k = 1, o = 1, lado = 0, vesiculas = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; lado?: number; vesiculas?: number }) {
  const sy = lerp(1, 0.32, clamp(lado));
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {vesiculas > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.4;
        return <circle key={i} cx={Math.cos(a) * 44} cy={Math.sin(a) * 44 * sy} r={10 * vesiculas} fill={V.sangre[1]} />;
      })}
      <g transform={`scale(1,${sy.toFixed(3)})`}>
        <circle r={44} fill={V.sangre[0]} />
        <circle cx={-3} cy={-3} r={40} fill={V.sangre[1]} />
        <circle cx={2} cy={3} r={21} fill={V.sangre[0]} />
        <circle cx={0} cy={1} r={15} fill="#C8122F" />
        <path d="M-27,-15 Q-20,-30 -4,-32" fill="none" stroke={V.sangre[3]} strokeWidth={6} strokeLinecap="round" />
      </g>
    </En>
  );
});

/** Neutrófilo: citoplasma rosa con gránulos y núcleo de tres lóbulos.
 *  `cebado`: PR3/MPO en la membrana. `activo`: se aplana y suelta gránulos. */
export const Neutrofilo = memo(function Neutrofilo({ x = 0, y = 0, r = 0, k = 1, o = 1, cebado = 0, activo = 0, tono = V.neutro }: { x?: number; y?: number; r?: number; k?: number; o?: number; cebado?: number; activo?: number; tono?: string[] }) {
  const a = clamp(activo);
  const sx = 1 + 0.18 * a, sy = 1 - 0.16 * a;
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <g transform={`scale(${sx.toFixed(3)},${sy.toFixed(3)})`}>
        <path d={NEU[0]} fill={tono[0]} />
        <path d={NEU[1]} fill={tono[1]} transform="translate(-4,-4)" />
        {GRANULOS.map(([gx, gy], i) => <circle key={i} cx={gx * (1 + 0.6 * a)} cy={gy * (1 + 0.6 * a)} r={4.2} fill={tono[0]} opacity={1 - 0.6 * a} />)}
        <path d="M-26,-14 C-34,-30 -16,-40 -6,-28 C2,-40 22,-36 18,-18 C34,-14 34,8 18,10 C22,26 4,32 -4,20 C-14,30 -34,22 -26,6 C-36,0 -34,-12 -26,-14 Z" fill={V.nucleo[0]} />
        <circle cx={-18} cy={-16} r={13} fill={V.nucleo[1]} /><circle cx={10} cy={-20} r={12} fill={V.nucleo[1]} /><circle cx={14} cy={8} r={11} fill={V.nucleo[1]} /><circle cx={-14} cy={12} r={11} fill={V.nucleo[1]} />
        <circle cx={-22} cy={-21} r={4.5} fill={V.nucleo[2]} />
        <path d="M-40,-30 Q-30,-46 -12,-50" fill="none" stroke={tono[2]} strokeWidth={6} strokeLinecap="round" />
      </g>
      {cebado > 0.01 && Array.from({ length: 9 }, (_, i) => {
        const ang = (i / 9) * Math.PI * 2 + 0.2, R = 56 * (1 + 0.06 * a);
        const q = tramo(cebado, i / 14, i / 14 + 0.35);
        return q > 0 ? <En key={i} x={Math.cos(ang) * R * sx} y={Math.sin(ang) * R * sy} k={q}>{i % 2 ? <Mpo /> : <Pr3 />}</En> : null;
      })}
    </En>
  );
});
const NEU = [blob(11, 58, 0.06, 4), blob(11, 53, 0.06, 4)];
const GRANULOS: [number, number][] = [[-38, 20], [-30, 36], [-6, 40], [22, 34], [38, 18], [40, -6], [30, -34], [-4, -44], [-40, -10], [2, 2]];

/** Proteinasa 3: rombo ámbar. */
export const Pr3 = memo(function Pr3({ x = 0, y = 0, k = 1 }: { x?: number; y?: number; k?: number }) {
  return <En x={x} y={y} k={k}><path d="M0,-11 L10,0 L0,11 L-10,0 Z" fill={V.pr3[1]} /><path d="M0,-11 L10,0 L0,2 Z" fill={V.pr3[2]} /></En>;
});
/** Mieloperoxidasa: bolita verde. */
export const Mpo = memo(function Mpo({ x = 0, y = 0, k = 1 }: { x?: number; y?: number; k?: number }) {
  return <En x={x} y={y} k={k}><circle r={9} fill={V.mpo[0]} /><circle cx={-1.5} cy={-1.5} r={7.4} fill={V.mpo[1]} /><circle cx={-3.5} cy={-3.5} r={2.2} fill="#FFF" /></En>;
});

/** Eosinófilo: núcleo de dos lóbulos y gránulos naranjas. `degranula` los suelta. */
export const Eosinofilo = memo(function Eosinofilo({ x = 0, y = 0, r = 0, k = 1, o = 1, degranula = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; degranula?: number }) {
  const d = clamp(degranula);
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <path d={EOS[0]} fill="#C2457E" />
      <path d={EOS[1]} fill="#F07BB0" transform="translate(-4,-4)" />
      {GRAN_EOS.map(([gx, gy], i) => {
        const f = 1 + d * (1.2 + hash(i, 9) * 1.4);
        return <circle key={i} cx={gx * f} cy={gy * f} r={6.2} fill={V.eos[1]} opacity={1 - 0.5 * tramo(d, 0.6, 1)} />;
      })}
      <ellipse cx={-18} cy={-2} rx={17} ry={22} fill={V.nucleo[0]} /><ellipse cx={18} cy={2} rx={17} ry={22} fill={V.nucleo[0]} />
      <rect x={-6} y={-4} width={12} height={8} rx={4} fill={V.nucleo[0]} />
      <ellipse cx={-20} cy={-5} rx={12} ry={16} fill={V.nucleo[1]} /><ellipse cx={16} cy={-1} rx={12} ry={16} fill={V.nucleo[1]} />
      <path d="M-40,-28 Q-30,-44 -12,-48" fill="none" stroke="#FFC6DD" strokeWidth={6} strokeLinecap="round" />
    </En>
  );
});
const EOS = [blob(11, 58, 0.05, 7), blob(11, 53, 0.05, 7)];
const GRAN_EOS: [number, number][] = [[-30, 30], [-8, 40], [16, 38], [36, 22], [42, -4], [32, -30], [8, -42], [-18, -40], [-40, -18], [-44, 8], [0, 24], [0, -26]];

/** Célula endotelial vista de canto: losa plana con su núcleo. */
export function CelEndo({ x = 0, y = 0, w = 150, h = 34, o = 1, tono = V.endo, r = 0 }: { x?: number; y?: number; w?: number; h?: number; o?: number; tono?: string[]; r?: number }) {
  return (
    <En x={x} y={y} o={o} r={r}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={tono[0]} />
      <rect x={-w / 2 + 3} y={-h / 2} width={w - 6} height={h - 6} rx={(h - 6) / 2} fill={tono[1]} />
      <ellipse cx={0} cy={-h * 0.1} rx={w * 0.2} ry={h * 0.32} fill="#7E1840" />
      <ellipse cx={-w * 0.05} cy={-h * 0.18} rx={w * 0.08} ry={h * 0.12} fill="#B8456F" />
      <path d={`M${-w / 2 + h * 0.5},${-h * 0.25} L${-w * 0.28},${-h * 0.25}`} stroke={tono[2]} strokeWidth={5} strokeLinecap="round" />
    </En>
  );
}

/** Vaso de la referencia: tubo con la pared granate, el endotelio en guiones rojos y
 *  glóbulos que fluyen. Coordenadas locales horizontales; `ang` lo gira. */
export function Vaso({ x = 800, y = 500, largo = 2000, ancho = 380, ang = -16, reloj = 0, flujo = 16, pared = 46, o = 1, children, fondo }: { x?: number; y?: number; largo?: number; ancho?: number; ang?: number; reloj?: number; flujo?: number; pared?: number; o?: number; children?: ReactNode; fondo?: ReactNode }) {
  const L = largo / 2, A = ancho / 2;
  const n = Math.floor(largo / 70);
  // Los extremos se desvanecen (máscara con degradado): el vaso no se corta de golpe.
  const id = `vaso-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <En x={x} y={y} r={ang} o={o}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={-L} y1={0} x2={L} y2={0}>
          <stop offset="0" stopColor="#FFF" stopOpacity={0} />
          <stop offset="0.045" stopColor="#FFF" stopOpacity={1} />
          <stop offset="0.955" stopColor="#FFF" stopOpacity={1} />
          <stop offset="1" stopColor="#FFF" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-L} y={-A - pared - 400} width={largo} height={ancho + pared * 2 + 800}>
          <rect x={-L} y={-A - pared - 400} width={largo} height={ancho + pared * 2 + 800} fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`}>
      {fondo}
      <rect x={-L} y={-A - pared} width={largo} height={ancho + pared * 2} fill={V.pared[2]} />
      <rect x={-L} y={-A - pared} width={largo} height={pared * 0.45} fill={V.pared[3]} />
      <rect x={-L} y={-A} width={largo} height={ancho} fill={V.pared[1]} />
      <rect x={-L} y={-A} width={largo} height={ancho * 0.3} fill={V.pared[0]} opacity={0.6} />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={-L + i * 70 + 10} y={-A - 12} width={44} height={11} rx={5.5} fill={V.endo[0]} />
          <rect x={-L + i * 70 + 10} y={A + 1} width={44} height={11} rx={5.5} fill={V.endo[0]} />
        </g>
      ))}
      {flujo > 0 && Array.from({ length: flujo }, (_, i) => {
        const X = ((hash(i, 11) * largo + reloj * (0.06 + hash(i, 12) * 0.04)) % largo) - L;
        const borde = tramo(Math.min(X + L, L - X), 0, 80);
        return <Hematie key={i} x={X} y={(hash(i, 13) - 0.5) * (ancho - 100)} r={hash(i, 14) * 180} k={0.62 + hash(i, 15) * 0.25} lado={hash(i, 16) > 0.6 ? 0.85 : 0} o={borde} />;
      })}
      {children}
      </g>
    </En>
  );
}

// ─── Inmunidad ────────────────────────────────────────────────────────────────

/** ANCA: la IgG en magenta. */
export function Anca({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return <IgG x={x} y={y} r={r} k={k} o={o} tono={V.anca} />;
}

/** Inmunocomplejo: un antígeno verde con anticuerpos a su alrededor. */
export function Complejo({ x = 0, y = 0, k = 1, o = 1, r = 0, n = 3 }: { x?: number; y?: number; k?: number; o?: number; r?: number; n?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {Array.from({ length: n }, (_, i) => <g key={i} transform={`rotate(${((i / n) * 360 + 20).toFixed(1)}) translate(0,12)`}><IgG /></g>)}
      <Bola R={17} tono={CC.verde} />
    </En>
  );
}

/** C5a: anafilatoxina, gota naranja. */
export function C5a({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}><path d="M0,-14 C8,-4 12,2 12,7 A12,12 0 1 1 -12,7 C-12,2 -8,-4 0,-14 Z" fill={V.c5a[0]} /><path d="M-2,-10 C4,-2 8,3 8,7 A9,9 0 1 1 -10,7 C-10,2 -7,-3 -2,-10 Z" fill={V.c5a[1]} /><circle cx={-4} cy={4} r={2.6} fill="#FFF" /></En>;
}

/** NET: red de ADN con PR3 y MPO prendidas. `p` cuánto se ha desplegado. */
export function Net({ x = 0, y = 0, k = 1, p = 1, R = 160, sem = 1 }: { x?: number; y?: number; k?: number; p?: number; R?: number; sem?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return (
    <En x={x} y={y} k={k}>
      {Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2 + hash(i, sem), d = R * q * (0.6 + hash(i, sem + 1) * 0.5);
        const cx = Math.cos(a + 0.5) * d * 0.55, cy = Math.sin(a + 0.5) * d * 0.55;
        return (
          <g key={i}>
            <path d={`M0,0 Q${cx.toFixed(1)},${cy.toFixed(1)} ${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}`} fill="none" stroke="#B9A6F5" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
            {i % 2 ? <Mpo x={Math.cos(a) * d * 0.7} y={Math.sin(a) * d * 0.7} k={0.7} /> : <Pr3 x={Math.cos(a) * d * 0.75} y={Math.sin(a) * d * 0.75} k={0.75} />}
          </g>
        );
      })}
    </En>
  );
}

/** Célula epitelioide: macrófago aplanado, alargado, de núcleo pálido. */
export function Epitelioide({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <ellipse rx={62} ry={26} fill="#4A3FB8" />
      <ellipse cx={-3} cy={-3} rx={57} ry={22} fill="#7D6FF0" />
      <ellipse cx={4} cy={0} rx={24} ry={10} fill="#C9C0FF" />
      <path d="M-42,-12 Q-28,-22 -8,-22" fill="none" stroke="#E4DEFF" strokeWidth={5} strokeLinecap="round" />
    </En>
  );
}

/** Célula gigante multinucleada; `langhans` 1 ordena los núcleos en herradura. */
export function CelGigante({ x = 0, y = 0, k = 1, o = 1, langhans = 1 }: { x?: number; y?: number; k?: number; o?: number; langhans?: number }) {
  const L = clamp(langhans);
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={GIG[0]} fill="#3D2FA6" />
      <path d={GIG[1]} fill="#6C5CE6" transform="translate(-6,-6)" />
      {Array.from({ length: 12 }, (_, i) => {
        const az = [(hash(i, 31) - 0.5) * 140, (hash(i, 32) - 0.5) * 90];
        const ang = Math.PI * (0.15 + (i / 11) * 1.7) + Math.PI / 2;
        const hz = [Math.cos(ang) * 92, Math.sin(ang) * 66];
        return <ellipse key={i} cx={lerp(az[0], hz[0], L)} cy={lerp(az[1], hz[1], L)} rx={14} ry={10} fill="#C9C0FF" transform={`rotate(${(i * 37) % 180} ${lerp(az[0], hz[0], L).toFixed(1)} ${lerp(az[1], hz[1], L).toFixed(1)})`} />;
      })}
      <path d="M-100,-46 Q-78,-80 -40,-88" fill="none" stroke="#B3A8FF" strokeWidth={9} strokeLinecap="round" />
    </En>
  );
}
const GIG = [blob(14, 125, 0.08, 12, 1.35), blob(14, 117, 0.08, 12, 1.35)];

/** Granuloma: centro necrótico, empalizada de epitelioides, gigantes y collar de linfocitos. */
export function Granuloma({ x = 0, y = 0, k = 1, p = 1, necrosis = 1, R = 230, sem = 3 }: { x?: number; y?: number; k?: number; p?: number; necrosis?: number; R?: number; sem?: number }) {
  if (p <= 0.002) return null;
  return (
    <En x={x} y={y} k={k}>
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2, d = R * 1.05 + hash(i, sem) * 40;
        return <Bola key={`l${i}`} x={Math.cos(a) * d} y={Math.sin(a) * d * 0.8} R={15} tono={['#0B6E86', '#18A7C4', '#9EE9F5']} o={tramo(p, 0.55 + (i % 5) * 0.06, 0.85 + (i % 5) * 0.03)} />;
      })}
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2, d = R * 0.72;
        return <Epitelioide key={`e${i}`} x={Math.cos(a) * d} y={Math.sin(a) * d * 0.8} r={(a * 180) / Math.PI} k={0.62} o={tramo(p, 0.2 + i * 0.012, 0.5 + i * 0.012)} />;
      })}
      {necrosis > 0.01 && <path d={blob(13, R * 0.48, 0.28, sem + 4, 1.25)} fill="#C8569A" opacity={tramo(necrosis, 0, 0.5)} />}
      {necrosis > 0.01 && Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(hash(i, sem + 5) - 0.5) * R * 0.9} cy={(hash(i, sem + 6) - 0.5) * R * 0.55} r={3 + hash(i, sem + 7) * 4} fill="#4B1680" opacity={tramo(necrosis, 0.3, 0.8)} />)}
      <CelGigante x={R * 0.7} y={-R * 0.62} k={0.42} o={tramo(p, 0.5, 0.8)} />
    </En>
  );
}

// ─── Órganos y personas ───────────────────────────────────────────────────────

/** Paciente de la referencia: cara plana, ojos de punto, sin contorno.
 *  `quien` el (42 años, barba corta) o ella (39, pelo corto y lentes). */
export function Paciente({ x = 0, y = 0, k = 1, o = 1, quien, triste = 0 }: { x?: number; y?: number; k?: number; o?: number; quien: 'el' | 'ella'; triste?: number }) {
  const el = quien === 'el';
  const piel = el ? ['#B9576F', '#DD6E8A', '#F29AB0'] : ['#C77B5E', '#E69A7C', '#F6BFA6'];
  const pelo = el ? '#22105E' : '#5B2A86';
  const ropa = el ? ['#0D7F7A', '#3BB5AE'] : ['#D9822B', '#F5A54A'];
  const ceja = -14 * clamp(triste);
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-170,250 C-170,160 -100,118 -40,110 L40,110 C100,118 170,160 170,250 Z" fill={ropa[1]} />
      <path d="M-170,250 C-170,190 -150,160 -122,140 C-112,190 -106,220 -104,250 Z" fill={ropa[0]} />
      <path d="M170,250 C170,190 150,160 122,140 C112,190 106,220 104,250 Z" fill={ropa[0]} />
      <rect x={-34} y={50} width={68} height={70} rx={20} fill={piel[0]} />
      {!el && <path d="M-118,-40 C-130,-150 -60,-200 6,-198 C80,-196 132,-140 118,-30 C114,10 116,40 122,62 L-124,62 C-118,30 -116,0 -118,-40 Z" fill={pelo} />}
      <circle cx={-92} cy={-4} r={20} fill={piel[0]} /><circle cx={92} cy={-4} r={20} fill={piel[0]} />
      <path d="M-90,-30 C-92,-130 -40,-160 0,-160 C42,-160 92,-130 90,-30 C90,50 52,92 0,94 C-52,92 -90,50 -90,-30 Z" fill={piel[1]} />
      <path d="M90,-30 C90,50 52,92 0,94 C34,78 62,40 58,-30 C56,-80 46,-120 26,-154 C66,-140 92,-100 90,-30 Z" fill={piel[0]} opacity={0.55} />
      {el ? (
        <>
          <path d="M-96,-40 C-108,-130 -60,-178 0,-178 C64,-178 108,-128 96,-40 C86,-80 70,-110 40,-124 C10,-108 -50,-104 -96,-40 Z" fill={pelo} />
          <path d="M-84,14 C-80,70 -40,104 0,104 C40,104 80,70 84,14 C70,44 44,40 26,30 C10,40 -10,40 -26,30 C-44,40 -70,44 -84,14 Z" fill={pelo} />
          <path d="M-20,46 Q0,40 20,46 Q0,58 -20,46 Z" fill="#B33A5E" />
        </>
      ) : (
        <>
          <path d="M-96,-38 C-102,-140 -40,-176 10,-172 C70,-168 104,-120 98,-38 C80,-76 50,-104 16,-112 C-20,-90 -60,-74 -96,-38 Z" fill={pelo} />
          {[-38, 38].map((cx) => <circle key={cx} cx={cx} cy={-12} r={27} fill="none" stroke="#E0338A" strokeWidth={7} />)}
          <path d="M-11,-14 L11,-14" stroke="#E0338A" strokeWidth={7} />
          <path d="M-22,50 Q0,42 22,50" fill="none" stroke="#B5544A" strokeWidth={7} strokeLinecap="round" />
        </>
      )}
      {[-38, 38].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-12} r={13} fill="#3A1342" />
          <path d={`M${cx - 22},${-46 + (cx > 0 ? ceja : 0)} Q${cx},${-56} ${cx + 22},${-46 + (cx < 0 ? ceja : 0)}`} fill="none" stroke={pelo} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx={0} cy={18} rx={13} ry={10} fill={piel[0]} />
      <path d="M-64,-60 Q-50,-84 -22,-92" fill="none" stroke={piel[2]} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    </En>
  );
}

/** Uno de los pacientes de perfil, mirando a la derecha, con los colores y la ropa de su
 *  vista de frente (`Paciente`). Nariz fina con una sola fosa nasal; mandíbula fina.
 *  `hundida` 0 → dorso recto, 1 → nariz en silla de montar; `costras` alrededor de la
 *  fosa; `polipo` asoma por ella. Barba (él): de debajo de la oreja a la comisura. */
export function Perfil({ x = 0, y = 0, k = 1, o = 1, quien, hundida = 0, costras = 0, polipo = 0 }: { x?: number; y?: number; k?: number; o?: number; quien: 'el' | 'ella'; hundida?: number; costras?: number; polipo?: number }) {
  const el = quien === 'el';
  const piel = el ? ['#B9576F', '#DD6E8A', '#F29AB0'] : ['#C77B5E', '#E69A7C', '#F6BFA6'];
  const pelo = el ? '#22105E' : '#5B2A86';
  const ropa = el ? ['#0D7F7A', '#3BB5AE'] : ['#D9822B', '#F5A54A'];
  const h = clamp(hundida);
  // Dorso: de la raíz (96,-52) a la punta. Recto de sano; cóncavo y respingado en silla de montar.
  const tx = el ? lerp(122, 116, h) : 115, ty = el ? lerp(-8, -13, h) : -8;
  const cx = el ? lerp(113, 99, h) : 107, cy = el ? lerp(-32, -22, h) : -31;
  const fx = tx - 12; // fosa nasal
  const cara = `M-88,-40 C-96,-120 -50,-165 10,-165 C60,-165 92,-130 94,-80 L96,-52 Q${cx},${cy} ${tx},${ty} Q${tx - 3},8 98,8 C104,14 103,22 98,26 C103,32 102,42 96,48 C96,64 90,78 76,84 L16,90 L16,128 L-46,128 L-54,70 C-78,40 -86,0 -88,-40 Z`;
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-150,260 C-150,170 -90,128 -40,124 L40,124 C100,130 150,170 150,260 Z" fill={ropa[1]} />
      <path d="M-150,260 C-150,200 -132,166 -104,146 C-96,196 -92,228 -90,260 Z" fill={ropa[0]} />
      <path d={cara} fill={piel[1]} />
      <path d="M16,90 L16,128 L-46,128 L-50,86 C-22,92 0,92 16,90 Z" fill={piel[0]} />
      <path d={`M96,-52 Q${cx},${cy} ${tx},${ty}`} fill="none" stroke={piel[2]} strokeWidth={6} strokeLinecap="round" />
      <path d="M66,-142 Q86,-124 90,-98" fill="none" stroke={piel[2]} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      {el ? (
        <>
          <path d="M-88,-40 C-96,-120 -50,-172 10,-172 C58,-172 90,-142 94,-110 C64,-124 34,-120 14,-106 C0,-82 -6,-56 -14,-48 C-36,-62 -58,-50 -64,-22 C-78,-12 -86,-24 -88,-40 Z" fill={pelo} />
          <path d="M-12,8 C10,30 50,40 88,30 L97,30 C103,36 101,42 96,48 C96,64 90,78 76,84 L16,90 C-4,92 -22,82 -26,62 C-30,40 -24,16 -12,8 Z" fill={pelo} />
          <path d="M80,16 Q92,10 100,16 Q96,24 84,24 Z" fill={pelo} />
          <ellipse cx={-18} cy={-20} rx={16} ry={24} fill={piel[0]} />
          <ellipse cx={-16} cy={-20} rx={8} ry={14} fill={piel[1]} />
        </>
      ) : (
        <>
          <path d="M-88,-36 C-96,-126 -40,-176 16,-172 C66,-168 94,-130 94,-98 C66,-112 40,-112 22,-104 C12,-80 8,-40 6,0 L8,88 C-22,80 -60,64 -92,46 C-100,10 -96,-10 -88,-36 Z" fill={pelo} />
          <circle cx={64} cy={-50} r={22} fill="none" stroke="#E0338A" strokeWidth={6} />
          <path d="M42,-52 L-4,-46" stroke="#E0338A" strokeWidth={6} strokeLinecap="round" />
        </>
      )}
      <circle cx={64} cy={-50} r={11} fill="#3A1342" />
      <path d="M48,-76 Q66,-84 86,-76" fill="none" stroke={pelo} strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={99} cy={el ? 28 : 26} rx={4.5} ry={2.8} fill={el ? '#B33A5E' : '#B5544A'} />
      <ellipse cx={fx} cy={3} rx={6} ry={3.5} fill="#5A1A2E" transform={`rotate(-12 ${fx} 3)`} />
      {polipo > 0.01 && <ellipse cx={fx + 1} cy={5} rx={7 * easeOut(clamp(polipo))} ry={5 * easeOut(clamp(polipo))} fill="#ECE7B4" />}
      {costras > 0.01 && [[fx - 6, 0, 5], [fx + 7, 1, 4.5], [fx, 9, 4.5]].map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill="#3A1A10" opacity={tramo(costras, i * 0.25, 0.4 + i * 0.25)} />)}
    </En>
  );
}

/** Pierna con púrpura palpable: manchas violáceas en relieve. */
export function PiernaPurpura({ x = 0, y = 0, k = 1, o = 1, p = 0, presion = 0 }: { x?: number; y?: number; k?: number; o?: number; p?: number; presion?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-70,-300 C-88,-140 -78,0 -58,110 C-56,150 -62,190 -70,216 C-88,244 -126,254 -146,272 C-160,290 -142,302 -114,302 L52,302 C68,302 74,286 70,266 C62,220 60,174 64,124 C94,10 100,-140 86,-300 Z" fill={V.piel[1]} />
      <path d="M86,-300 C100,-140 94,10 64,124 C60,174 62,220 70,266 C74,286 68,302 52,302 L20,302 C36,254 28,184 36,124 C62,10 62,-140 52,-300 Z" fill={V.piel[0]} />
      <path d="M-44,-270 C-56,-140 -50,-40 -34,50" fill="none" stroke={V.piel[2]} strokeWidth={14} strokeLinecap="round" />
      {Array.from({ length: 34 }, (_, i) => {
        const yy = -230 + hash(i, 41) * 440, ancho = yy < 120 ? 62 : 40;
        const q = tramo(p, i / 44, i / 44 + 0.12);
        if (q <= 0) return null;
        const R = (7 + hash(i, 43) * 9) * q;
        return (
          <g key={i}>
            <circle cx={(hash(i, 42) - 0.45) * ancho * 2} cy={yy} r={R} fill="#7A1F6E" />
            <circle cx={(hash(i, 42) - 0.45) * ancho * 2 - R * 0.2} cy={yy - R * 0.2} r={R * 0.65} fill="#A8358F" />
          </g>
        );
      })}
      {presion > 0.01 && (
        <En x={-6} y={-40} o={tramo(presion, 0, 0.3)}>
          <rect x={-60} y={-80} width={120} height={150} rx={18} fill="#BFE9F5" opacity={0.55} />
          <rect x={-60} y={-80} width={120} height={150} rx={18} fill="none" stroke="#7FD3EA" strokeWidth={6} />
        </En>
      )}
    </En>
  );
}

/** Silueta del cuerpo de la referencia: violeta con borde magenta. */
export function Cuerpo({ x = 0, y = 0, k = 1, o = 1, children }: { x?: number; y?: number; k?: number; o?: number; children?: ReactNode }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={CUERPO} fill="var(--vas-cuerpo)" stroke="var(--vas-cuerpo-borde)" strokeWidth={9} strokeLinejoin="round" />
      <path d="M-24,-300 C-40,-296 -52,-276 -52,-250" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.35} />
      {children}
    </En>
  );
}
const CUERPO = 'M0,-330 C36,-330 58,-302 58,-266 C58,-232 44,-208 26,-198 L26,-180 C70,-176 104,-160 116,-130 L156,10 C162,30 150,40 138,30 L96,-90 L92,40 C92,120 86,200 80,300 C80,322 62,330 46,322 L12,90 L-12,90 L-46,322 C-62,330 -80,322 -80,300 C-86,200 -92,120 -92,40 L-96,-90 L-138,30 C-150,40 -162,30 -156,10 L-116,-130 C-104,-160 -70,-176 -26,-180 L-26,-198 C-44,-208 -58,-232 -58,-266 C-58,-302 -36,-330 0,-330 Z';

/** Marcador en el cuerpo (círculo negro con borde rojo de la referencia). */
export function Punto({ x, y, p = 1, color = '#FF3B3B' }: { x: number; y: number; p?: number; color?: string }) {
  if (p <= 0.002) return null;
  return <En x={x} y={y} k={0.5 + 0.5 * easeBack(clamp(p))} o={tramo(p, 0, 0.4)}><circle r={16} fill="#1A0B24" /><circle r={16} fill="none" stroke={color} strokeWidth={6} /></En>;
}

/** Riñón plano con su hilio. */
export function Rinon({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-30,-120 C40,-128 90,-70 90,0 C90,72 40,128 -30,120 C-80,114 -96,70 -70,44 C-50,24 -50,-24 -70,-44 C-96,-70 -80,-114 -30,-120 Z" fill={V.rinon[0]} />
      <path d="M-34,-110 C30,-116 76,-64 76,0 C76,60 32,108 -30,106 C-70,104 -80,70 -60,48 C-38,24 -38,-24 -60,-48 C-80,-70 -72,-106 -34,-110 Z" fill={V.rinon[1]} />
      <path d="M-20,-86 C30,-86 56,-46 58,-6" fill="none" stroke={V.rinon[2]} strokeWidth={10} strokeLinecap="round" />
    </En>
  );
}

/** Pulmones planos. */
export function Pulmones({ x = 0, y = 0, k = 1, o = 1, sangre = 0 }: { x?: number; y?: number; k?: number; o?: number; sangre?: number }) {
  const lobulo = 'M-20,-150 C-70,-150 -120,-60 -126,40 C-130,110 -110,150 -60,150 C-30,150 -16,120 -16,80 L-14,-130 C-14,-144 -16,-150 -20,-150 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-9} y={-210} width={18} height={90} rx={9} fill="#D9A0C4" />
      {[-1, 1].map((sx) => (
        <g key={sx} transform={`translate(${sx * 12},0) scale(${sx},1)`}>
          <path d={lobulo} fill={V.pulmon[0]} />
          <path d={lobulo} fill={V.pulmon[1]} transform="translate(4,-6) scale(0.94)" />
          {sangre > 0.01 && [[-70, -20], [-90, 50], [-50, 90], [-60, -80]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22 * tramo(sangre, i * 0.15, 0.5 + i * 0.15)} fill={V.sangre[1]} opacity={0.85} />)}
          <path d="M-40,-120 C-80,-100 -100,-40 -104,10" fill="none" stroke={V.pulmon[2]} strokeWidth={9} strokeLinecap="round" />
        </g>
      ))}
    </En>
  );
}

/** Glomérulo: cápsula de Bowman, ovillo de asas y arteriolas.
 *  `necrosis` rompe un asa; `fibrina` la llena de amarillo; `semiluna` 0→1 la hace crecer; `cicatriz` la vuelve fibrosa. */
export function Glomerulo({ x = 0, y = 0, k = 1, o = 1, necrosis = 0, fibrina = 0, semiluna = 0, cicatriz = 0, brillo, R = 260 }: { x?: number; y?: number; k?: number; o?: number; necrosis?: number; fibrina?: number; semiluna?: number; cicatriz?: number; brillo?: 'lineal' | 'granular' | 'pauci'; R?: number }) {
  const sl = clamp(semiluna), ci = clamp(cicatriz);
  const ovK = 1 - 0.28 * sl;
  const asas: [number, number, number][] = [[-70, -60, 62], [30, -86, 58], [96, -10, 56], [56, 80, 58], [-40, 86, 56], [-98, 14, 54], [0, 0, 50]];
  const pantalla = !!brillo;
  const colAsa = pantalla ? '#16301E' : V.sangre[1];
  return (
    <En x={x} y={y} k={k} o={o}>
      {!pantalla && <rect x={-R * 1.1} y={-30} width={R * 0.5} height={44} rx={22} fill={V.sangre[0]} transform="rotate(-20)" />}
      {!pantalla && <rect x={R * 0.62} y={-24} width={R * 0.5} height={36} rx={18} fill={V.sangre[0]} transform="rotate(20)" />}
      <circle r={R} fill={pantalla ? '#0E1F14' : '#F4B9CF'} />
      <circle r={R - 18} fill={pantalla ? '#081209' : '#FFF1F6'} />
      {sl > 0.01 && (
        <path d={`M${-(R - 18)},0 A${R - 18},${R - 18} 0 0 1 ${R - 18},0 A${R - 18},${(R - 18) * (1 - 0.55 * sl)} 0 0 0 ${-(R - 18)},0 Z`} transform="rotate(-150)" fill={ci > 0.5 ? '#E7C9A6' : '#D46A9E'} opacity={0.95} />
      )}
      {sl > 0.01 && Array.from({ length: 16 }, (_, i) => {
        const a = (-150 + (i / 15) * 180 - 180) * (Math.PI / 180) * -1;
        const rr = (R - 18) * (1 - 0.28 * sl);
        return <circle key={i} cx={Math.cos(a) * rr} cy={-Math.sin(a) * rr} r={9 * sl * (1 - ci * 0.6)} fill={ci > 0.5 ? '#C9A27A' : '#8A2363'} opacity={tramo(sl, i / 20, i / 20 + 0.3)} />;
      })}
      <g transform={`translate(${(R * 0.16 * sl).toFixed(1)},${(R * 0.12 * sl).toFixed(1)}) scale(${ovK.toFixed(3)})`}>
        <path d={MESANGIO} fill={pantalla ? '#0C1A10' : '#E9B4D6'} />
        {asas.map(([ax, ay, ar], i) => {
          const rota = i === 1 && necrosis > 0;
          return (
            <g key={i}>
              <circle cx={ax} cy={ay} r={ar} fill={pantalla ? '#0E2A16' : '#C2305A'} />
              <circle cx={ax} cy={ay} r={ar - 11} fill={pantalla ? '#0A1A0E' : '#FFDCE5'} />
              {!pantalla && <circle cx={ax + ar * 0.2} cy={ay + ar * 0.15} r={ar * 0.3} fill={colAsa} />}
              {brillo === 'lineal' && <circle cx={ax} cy={ay} r={ar - 6} fill="none" stroke={V.verde[1]} strokeWidth={7} />}
              {brillo === 'granular' && Array.from({ length: 9 }, (_, j) => { const a = (j / 9) * Math.PI * 2 + i; return <circle key={j} cx={ax + Math.cos(a) * (ar - 6)} cy={ay + Math.sin(a) * (ar - 6)} r={6 + hash(i * 9 + j, 2) * 5} fill={V.verde[1]} />; })}
              {brillo === 'pauci' && i % 3 === 0 && <circle cx={ax + 10} cy={ay - 8} r={4} fill={V.verde[1]} opacity={0.5} />}
              {rota && <path d={`M${ax - 30},${ay - ar + 6} A${ar},${ar} 0 0 1 ${ax + 30},${ay - ar + 6}`} fill="none" stroke="#5A0A2A" strokeWidth={18 * clamp(necrosis)} strokeLinecap="round" />}
            </g>
          );
        })}
      </g>
      {fibrina > 0.01 && Array.from({ length: 9 }, (_, i) => {
        const a = (-70 - i * 14) * (Math.PI / 180);
        return <path key={i} d={`M${Math.cos(a) * (R - 40)},${Math.sin(a) * (R - 40)} q${12 + i * 2},${-8} ${24},${6}`} fill="none" stroke={V.fibrina[1]} strokeWidth={7} strokeLinecap="round" opacity={tramo(fibrina, i / 12, i / 12 + 0.3)} />;
      })}
    </En>
  );
}

const MESANGIO = blob(12, 150, 0.12, 31);

/** Alvéolos: racimo con capilares en sus tabiques; `sangre` los llena de glóbulos rojos. */
export function Alveolos({ x = 0, y = 0, k = 1, o = 1, sangre = 0, hemosiderina = 0, eos = 0 }: { x?: number; y?: number; k?: number; o?: number; sangre?: number; hemosiderina?: number; eos?: number }) {
  const sacos: [number, number, number][] = [[-170, -40, 110], [0, -110, 118], [170, -30, 110], [-90, 110, 104], [96, 110, 108]];
  return (
    <En x={x} y={y} k={k} o={o}>
      {sacos.map(([cx, cy, R], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={R + 16} fill={V.pulmon[0]} />
          <circle cx={cx} cy={cy} r={R} fill="#FFE6F2" />
          {Array.from({ length: 10 }, (_, j) => { const a = (j / 10) * Math.PI * 2; return <circle key={j} cx={cx + Math.cos(a) * (R + 8)} cy={cy + Math.sin(a) * (R + 8)} r={7} fill={V.sangre[1]} />; })}
          {sangre > 0.01 && Array.from({ length: 9 }, (_, j) => {
            const q = tramo(sangre, (i * 9 + j) / 60, (i * 9 + j) / 60 + 0.2);
            return q > 0 ? <Hematie key={j} x={cx + (hash(i * 9 + j, 51) - 0.5) * R * 1.3} y={cy + (hash(i * 9 + j, 52) - 0.5) * R * 1.3} k={0.42 * q} r={hash(j, 53) * 180} /> : null;
          })}
          {hemosiderina > 0.01 && <En x={cx + 20} y={cy + 10} k={0.32} o={tramo(hemosiderina, i * 0.1, 0.5 + i * 0.1)}><path d={blob(10, 70, 0.15, i + 3)} fill="#8A6A3E" /><path d={blob(10, 62, 0.15, i + 3)} fill="#B8925A" /><circle cx={-10} cy={0} r={22} fill="#5A3A1E" /></En>}
          {eos > 0.01 && [0, 1].map((j) => <Eosinofilo key={j} x={cx + (j ? 34 : -30)} y={cy + (j ? 20 : -24)} k={0.42} o={tramo(eos, (i * 2 + j) / 12, (i * 2 + j) / 12 + 0.3)} />)}
        </g>
      ))}
    </En>
  );
}

/** Línea de tiempo de la referencia: barra por tramos con banderitas encima. */
export function LineaTiempo({ x = 0, y = 0, w = 1300, tramos, p = 1, t = 28 }: { x?: number; y?: number; w?: number; tramos: { txt: string; color: string; p: number }[]; p?: number; t?: number }) {
  if (p <= 0.002) return null;
  const n = tramos.length, seg = w / n;
  return (
    <>
      <En x={x} y={y} o={tramo(p, 0, 0.4)}>
        <rect x={-w / 2} y={-26} width={w * easeOut(clamp(p * 1.3))} height={52} fill="var(--vas-suave)" />
        {tramos.map((tr, i) => <rect key={tr.txt} x={-w / 2 + i * seg} y={-26} width={seg * easeOut(clamp(tr.p * 1.5))} height={52} fill={tr.color} opacity={0.9} />)}
      </En>
      {tramos.map((tr, i) => <Bandera key={tr.txt} x={x - w / 2 + seg * (i + 0.5)} y={y - 80} txt={tr.txt} color={tr.color} p={tr.p} t={t} punta="abajo" />)}
    </>
  );
}

/** Corazón plano (miocarditis, aneurisma coronario). */
export function Corazon({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M0,110 C-70,60 -130,10 -130,-50 C-130,-100 -90,-124 -56,-124 C-28,-124 -8,-108 0,-88 C8,-108 28,-124 56,-124 C90,-124 130,-100 130,-50 C130,10 70,60 0,110 Z" fill={V.sangre[0]} />
      <path d="M0,96 C-62,52 -116,8 -116,-46 C-116,-90 -84,-110 -54,-110 C-28,-110 -10,-94 0,-74 C10,-94 28,-110 54,-110 C84,-110 116,-90 116,-46 C116,8 62,52 0,96 Z" fill={V.sangre[1]} transform="translate(-6,-6)" />
      <path d="M-86,-70 Q-74,-92 -50,-96" fill="none" stroke={V.sangre[3]} strokeWidth={10} strokeLinecap="round" />
    </En>
  );
}

/** Nervio con su vasa nervorum; `isquemia` lo apaga. */
export function Nervio({ x = 0, y = 0, k = 1, o = 1, isquemia = 0, w = 900 }: { x?: number; y?: number; k?: number; o?: number; isquemia?: number; w?: number }) {
  const q = clamp(isquemia);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill={q > 0.5 ? '#8E86A8' : '#F2C230'} />
      {[-24, 0, 24].map((dy) => <rect key={dy} x={-w / 2 + 20} y={dy - 7} width={w - 40} height={14} rx={7} fill={q > 0.5 ? '#B5AFC8' : '#FFE27A'} />)}
      <path d={`M${-w / 2},-62 C${-w / 4},-90 ${w / 4},-40 ${w / 2},-70`} fill="none" stroke={V.sangre[1]} strokeWidth={12} strokeLinecap="round" strokeDasharray={q > 0.01 ? `${(1 - q) * 900} 2000` : undefined} />
    </En>
  );
}

/** Anillo de foco: círculo que se dibuja alrededor de algo. */
export function Foco({ x, y, R, p, color = '#FFD23F', w = 8 }: { x: number; y: number; R: number; p: number; color?: string; w?: number }) {
  if (p <= 0.002) return null;
  const L = 2 * Math.PI * R;
  return <circle cx={x} cy={y} r={R} fill="none" stroke={color} strokeWidth={w} strokeDasharray={`${L * easeOut(clamp(p))} ${L}`} strokeLinecap="round" transform={`rotate(-90 ${x} ${y})`} />;
}
