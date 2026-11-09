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
import { C as CC, En, IgG, Txt, TxCtx, blob, clamp, easeBack, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import s from '@/styles/citopenias.module.css';
import v from '@/styles/vasculitis.module.css';
import { FOTOS, urlFoto, type FotoId } from '@/lib/data/vasculitis/fotos';

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

/** Rótulo. Por defecto alterna entre cuatro diseños (elegido de forma fija por su texto) para no repetir siempre la misma
 *  banderita: bandera con punta, píldora, texto subrayado con barra de color y marbete con ojal. `punta` 'izq' o 'abajo'
 *  (señala algo) y 'no' (títulos) conservan su forma; `estilo` fuerza uno. */
export type EstiloRotulo = 'bandera' | 'pildora' | 'subrayado' | 'marbete';
export function Bandera({ x, y, txt, color = V.violeta[1], p = 1, t = 30, punta, ancla = 'centro', estilo }: { x: number; y: number; txt: string; color?: string; p?: number; t?: number; punta?: 'der' | 'izq' | 'abajo' | 'no'; ancla?: 'centro' | 'izq' | 'der'; estilo?: EstiloRotulo }) {
  const tx = useContext(TxCtx);
  if (p <= 0.002) return null;
  const ESTILOS: EstiloRotulo[] = ['bandera', 'pildora', 'subrayado', 'marbete'];
  const e: EstiloRotulo = estilo ?? (punta ? 'bandera' : ESTILOS[Math.floor(hash(txt.length * 7 + txt.charCodeAt(0) + txt.charCodeAt(txt.length - 1) * 3, 4) * 4) % 4]);
  const pt = punta ?? 'der';
  const w = txt.length * t * 0.56 + t * 1.2, h = t * 1.8, pk = h * 0.42;
  const dx = ancla === 'izq' ? w / 2 : ancla === 'der' ? -w / 2 : 0;
  const media = (w * tx) / 2 + pk + 8;
  const xx = Math.min(1600 - media, Math.max(media, x + dx * tx));
  const esc = tx * (0.86 + 0.14 * easeBack(clamp(p)));
  if (e === 'subrayado') {
    const ws = txt.length * t * 0.56;
    return (
      <En x={xx} y={y} k={esc} o={tramo(p, 0, 0.5)}>
        <rect x={-ws / 2 - 4} y={t * 0.42} width={(ws + 8) * easeOut(clamp(p * 1.3))} height={t * 0.34} rx={t * 0.17} fill={color} />
        <circle cx={-ws / 2 - t * 0.6} cy={0} r={t * 0.22} fill={color} />
        <text dy="0.35em" textAnchor="middle" fill="var(--cit-texto)" style={{ fontSize: t, fontWeight: 800 }}>{txt}</text>
      </En>
    );
  }
  const forma = e === 'pildora' ? null
    : e === 'marbete' ? `M${-w / 2},${-h / 2 + 6} Q${-w / 2},${-h / 2} ${-w / 2 + 6},${-h / 2} L${w / 2 - 2},${-h / 2} Q${w / 2 + pk},0 ${w / 2 - 2},${h / 2} L${-w / 2 + 6},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 6} Z`
    : pt === 'der' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2 + pk},0 L${w / 2},${h / 2} L${-w / 2},${h / 2} Z`
    : pt === 'izq' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2} L${-w / 2 - pk},0 Z`
    : pt === 'abajo' ? `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${pk * 0.7},${h / 2} L0,${h / 2 + pk * 0.8} L${-pk * 0.7},${h / 2} L${-w / 2},${h / 2} Z`
    : `M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2} Z`;
  return (
    <En x={xx} y={y} k={esc} o={tramo(p, 0, 0.5)}>
      {forma ? <path d={forma} fill={color} /> : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} />}
      {e === 'marbete' && <circle cx={w / 2 - pk * 0.15} cy={0} r={t * 0.16} fill="#FFF" opacity={0.85} />}
      {e === 'pildora' && <rect x={-w / 2 + h * 0.3} y={-h / 2 + 4} width={w * 0.35} height={h * 0.16} rx={h * 0.08} fill="#FFF" opacity={0.28} />}
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
export function C5a({ x = 0, y = 0, k = 1, o = 1, tono = V.c5a }: { x?: number; y?: number; k?: number; o?: number; tono?: string[] }) {
  // Anafilatoxina: proteína pequeña de cuatro hélices (un lóbulo cada una) y su cola C-terminal, la que activa el receptor.
  const lob: [number, number, number][] = [[-6, -5, 8.5], [6, -6, 8], [-5, 6, 8], [7, 5, 8.5]];
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M11,10 Q16,12 15,17 Q14,21 18,22" fill="none" stroke={tono[0]} strokeWidth={2.6} strokeLinecap="round" />
      {lob.map(([lx, ly, r], i) => <circle key={`s${i}`} cx={lx + 1.6} cy={ly + 1.6} r={r} fill={tono[0]} />)}
      {lob.map(([lx, ly, r], i) => <circle key={`c${i}`} cx={lx} cy={ly} r={r - 0.8} fill={tono[1]} />)}
      {lob.map(([lx, ly, r], i) => <path key={`h${i}`} d={`M${lx - r * 0.5},${ly - r * 0.15} q${r * 0.25},${-r * 0.4} ${r * 0.5},0 t${r * 0.5},0`} fill="none" stroke={tono[0]} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />)}
      <circle cx={-8} cy={-8} r={2.4} fill="#FFF" opacity={0.85} />
    </En>
  );
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

/** Riñón en corte frontal: corteza, pirámides, cálices y pelvis, y en el hilio la arteria, la vena y el uréter.
 *  `palido` 0-1 lo apaga (menos flujo). */
export function Rinon({ x = 0, y = 0, k = 1, o = 1, r = 0, palido = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; palido?: number }) {
  const pl = clamp(palido);
  const ext = 'M-30,-120 C40,-128 90,-70 90,0 C90,72 40,128 -30,120 C-80,114 -96,70 -70,44 C-50,24 -50,-24 -70,-44 C-96,-70 -80,-114 -30,-120 Z';
  const pir = [-115, -78, -40, 0, 40, 78, 115].map((g) => {
    const a = (g * Math.PI) / 180, bx = 12 + Math.cos(a) * 66, by = Math.sin(a) * 80, ax = lerp(bx, -36, 0.5), ay = lerp(by, 0, 0.5);
    const nx = -Math.sin(a) * 17, ny = Math.cos(a) * 17;
    return `M${(bx + nx).toFixed(1)},${(by + ny).toFixed(1)} Q${(bx + Math.cos(a) * 6).toFixed(1)},${(by + Math.sin(a) * 6).toFixed(1)} ${(bx - nx).toFixed(1)},${(by - ny).toFixed(1)} L${ax.toFixed(1)},${ay.toFixed(1)} Z`;
  });
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-62,-14 C-90,-16 -110,-22 -138,-20" fill="none" stroke={V.sangre[0]} strokeWidth={13} strokeLinecap="round" />
      <path d="M-62,-14 C-90,-16 -110,-22 -138,-20" fill="none" stroke={V.sangre[1]} strokeWidth={8} strokeLinecap="round" />
      <path d="M-62,10 C-92,12 -112,8 -140,12" fill="none" stroke="#2F3FA0" strokeWidth={15} strokeLinecap="round" />
      <path d="M-62,10 C-92,12 -112,8 -140,12" fill="none" stroke="#5468D8" strokeWidth={10} strokeLinecap="round" />
      <path d="M-58,36 C-74,70 -78,110 -74,150" fill="none" stroke="#D9B04A" strokeWidth={10} strokeLinecap="round" />
      <path d={ext} fill={V.rinon[0]} transform="translate(5,5)" />
      <path d={ext} fill={V.rinon[1]} />
      <path d="M-26,-104 C30,-110 72,-62 74,0 C74,60 32,104 -26,104 C-58,102 -66,72 -52,52 C-34,26 -34,-26 -52,-52 C-66,-74 -58,-102 -26,-104 Z" fill="#D8607E" />
      {pir.map((d, i) => <path key={i} d={d} fill={V.rinon[0]} />)}
      {pir.map((d, i) => <path key={`l${i}`} d={d} fill="none" stroke="#E98AA2" strokeWidth={1.5} strokeDasharray="2 5" opacity={0.7} />)}
      <path d="M-56,-40 C-30,-52 -12,-30 -16,-14 C-6,-8 -6,8 -16,14 C-12,30 -30,52 -56,40 C-44,20 -44,-20 -56,-40 Z" fill="#F3D28A" />
      <path d="M-50,-30 C-34,-36 -26,-24 -28,-14" fill="none" stroke="#FFF2C4" strokeWidth={4} strokeLinecap="round" />
      <path d="M-20,-100 C30,-100 60,-56 62,-14" fill="none" stroke={V.rinon[2]} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      {pl > 0.01 && <path d={ext} fill="#E9E2EE" opacity={0.55 * pl} />}
    </En>
  );
}

/** Pulmones de frente: tráquea con sus anillos, carina, bronquios y su árbol, cisuras (dos a la derecha, una a la izquierda)
 *  y la escotadura cardíaca del izquierdo. `sangre` llena alvéolos de rojo. */
export function Pulmones({ x = 0, y = 0, k = 1, o = 1, sangre = 0, nodulos = 0, infiltrados = 0 }: { x?: number; y?: number; k?: number; o?: number; sangre?: number; nodulos?: number; infiltrados?: number }) {
  const der = 'M-22,-150 C-62,-162 -122,-84 -132,30 C-138,112 -120,160 -72,162 C-44,162 -24,144 -22,116 L-20,-20 C-20,-60 -22,-110 -22,-150 Z';
  const izq = 'M22,-150 C62,-162 122,-84 132,30 C138,112 120,160 72,162 C52,162 40,150 42,128 C62,110 64,70 44,42 C30,22 22,4 22,-24 Z';
  const arbol = (sx: number) => (
    <g transform={`scale(${sx},1)`} fill="none" strokeLinecap="round">
      <path d="M-4,-112 C-24,-96 -40,-80 -56,-60" stroke="#F7E3EC" strokeWidth={10} />
      <path d="M-56,-60 C-70,-86 -78,-104 -80,-120 M-56,-60 C-80,-40 -92,-10 -98,20 M-56,-60 C-62,-20 -66,30 -70,90 M-98,20 C-108,50 -110,80 -108,110 M-70,90 C-76,110 -84,124 -92,134 M-70,90 C-60,110 -52,124 -46,136" stroke="#F7E3EC" strokeWidth={4.5} opacity={0.9} />
      <path d="M-80,-120 L-92,-130 M-80,-120 L-70,-136 M-98,20 L-114,10 M-108,110 L-120,120 M-66,30 L-50,40" stroke="#F7E3EC" strokeWidth={2.5} opacity={0.8} />
    </g>
  );
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={der} fill={V.pulmon[0]} transform="translate(5,5)" /><path d={izq} fill={V.pulmon[0]} transform="translate(5,5)" />
      <path d={der} fill={V.pulmon[1]} /><path d={izq} fill={V.pulmon[1]} />
      <path d="M-44,-60 C-76,0 -104,60 -124,112 M-124,22 C-106,20 -84,16 -54,12" fill="none" stroke={V.pulmon[0]} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
      <path d="M40,-80 C74,-20 102,56 124,104" fill="none" stroke={V.pulmon[0]} strokeWidth={3.5} strokeLinecap="round" opacity={0.75} />
      {sangre > 0.01 && [[-70, -20], [-90, 50], [-50, 100], [-60, -80], [80, -40], [96, 60], [70, 120]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22 * tramo(sangre, i * 0.1, 0.5 + i * 0.1)} fill={V.sangre[1]} opacity={0.85} />)}
      {infiltrados > 0.01 && [[-84, 40, 0], [-60, 110, 1], [88, 70, 2], [72, -20, 3]].map(([cx, cy, i]) => <path key={i} d={blob(8, 30, 0.3, i + 11)} transform={`translate(${cx},${cy})`} fill="#FFF1F7" opacity={0.75 * tramo(infiltrados, i * 0.15, 0.5 + i * 0.15)} />)}
      {arbol(1)}{arbol(-1)}
      {nodulos > 0.01 && [[-84, -40, 22], [-64, 84, 18], [86, 10, 24], [70, -96, 16]].map(([cx, cy, r], i) => { const q = tramo(nodulos, i * 0.15, 0.5 + i * 0.15); return <g key={i} opacity={q}><circle cx={cx + 2} cy={cy + 2} r={r * q} fill="#7A1E4A" /><circle cx={cx} cy={cy} r={r * q} fill="#C2457E" /><circle cx={cx + 2} cy={cy - 2} r={r * 0.45 * q} fill="#3A0F2A" /><circle cx={cx - r * 0.4} cy={cy - r * 0.4} r={r * 0.15} fill="#FFC3E0" /></g>; })}
      <rect x={-13} y={-224} width={26} height={116} rx={11} fill="#E7A9C6" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-13} y={-216 + i * 15} width={26} height={7} rx={3.5} fill="#FBE3EE" />)}
      <path d="M-50,-130 C-80,-108 -100,-70 -110,-20" fill="none" stroke={V.pulmon[2]} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <path d="M54,-130 C80,-108 98,-76 106,-40" fill="none" stroke={V.pulmon[2]} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    </En>
  );
}

/** Glomérulo: cápsula de Bowman, ovillo de asas y arteriolas.
 *  `necrosis` rompe un asa; `fibrina` la llena de amarillo; `semiluna` 0→1 la hace crecer; `cicatriz` la vuelve fibrosa. */
export function Glomerulo({ x = 0, y = 0, k = 1, o = 1, necrosis = 0, fibrina = 0, semiluna = 0, cicatriz = 0, brillo, R = 260, tubulo = false }: { x?: number; y?: number; k?: number; o?: number; necrosis?: number; fibrina?: number; semiluna?: number; cicatriz?: number; brillo?: 'lineal' | 'granular' | 'pauci'; R?: number; tubulo?: boolean }) {
  const sl = clamp(semiluna), ci = clamp(cicatriz);
  const ovK = 1 - 0.28 * sl;
  const asas: [number, number, number][] = [[-70, -60, 62], [30, -86, 58], [96, -10, 56], [56, 80, 58], [-40, 86, 56], [-98, 14, 54], [0, 0, 50]];
  const pantalla = !!brillo;
  const colAsa = pantalla ? '#16301E' : V.sangre[1];
  return (
    <En x={x} y={y} k={k} o={o}>
      {!pantalla && <rect x={-R * 1.1} y={-30} width={R * 0.5} height={44} rx={22} fill={V.sangre[0]} transform="rotate(-20)" />}
      {!pantalla && <rect x={R * 0.62} y={-24} width={R * 0.5} height={36} rx={18} fill={V.sangre[0]} transform="rotate(20)" />}
      {!pantalla && tubulo && <g transform="rotate(115)">
        <path d={`M${R - 20},0 C${R + 30},${-R * 0.25} ${R + 50},${R * 0.2} ${R + 90},${-R * 0.05} C${R + 120},${-R * 0.2} ${R + 130},${R * 0.1} ${R + 150},${R * 0.05}`} fill="none" stroke="#F4B9CF" strokeWidth={R * 0.2} strokeLinecap="round" />
        <path d={`M${R - 20},0 C${R + 30},${-R * 0.25} ${R + 50},${R * 0.2} ${R + 90},${-R * 0.05} C${R + 120},${-R * 0.2} ${R + 130},${R * 0.1} ${R + 150},${R * 0.05}`} fill="none" stroke="#FFF1F6" strokeWidth={R * 0.08} strokeLinecap="round" />
      </g>}
      <circle r={R} fill={pantalla ? '#0E1F14' : '#F4B9CF'} />
      <circle r={R - 18} fill={pantalla ? '#081209' : '#FFF1F6'} />
      {!pantalla && Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, cx = Math.cos(a) * (R - 22), cy = Math.sin(a) * (R - 22); return <ellipse key={i} cx={cx} cy={cy} rx={9} ry={3.2} transform={`rotate(${((a * 180) / Math.PI + 90).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`} fill="#E58FB5" />; })}
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
              {!pantalla && [[0.22, 0.12], [-0.25, -0.18]].map(([fx, fy], j) => <g key={j}><circle cx={ax + ar * fx} cy={ay + ar * fy} r={ar * 0.24} fill={colAsa} /><circle cx={ax + ar * fx} cy={ay + ar * fy} r={ar * 0.1} fill={V.sangre[2]} /></g>)}
              {brillo === 'lineal' && <circle cx={ax} cy={ay} r={ar - 6} fill="none" stroke={V.verde[1]} strokeWidth={7} />}
              {brillo === 'granular' && Array.from({ length: 9 }, (_, j) => { const a = (j / 9) * Math.PI * 2 + i; return <circle key={j} cx={ax + Math.cos(a) * (ar - 6)} cy={ay + Math.sin(a) * (ar - 6)} r={6 + hash(i * 9 + j, 2) * 5} fill={V.verde[1]} />; })}
              {brillo === 'pauci' && i % 3 === 0 && <circle cx={ax + 10} cy={ay - 8} r={4} fill={V.verde[1]} opacity={0.5} />}
              {rota && <path d={`M${ax - 30},${ay - ar + 6} A${ar},${ar} 0 0 1 ${ax + 30},${ay - ar + 6}`} fill="none" stroke="#5A0A2A" strokeWidth={18 * clamp(necrosis)} strokeLinecap="round" />}
            </g>
          );
        })}
        {!pantalla && [[-20, -30], [44, -40], [34, 44], [-52, 36], [-4, 62]].map(([mx, my], i) => <ellipse key={`m${i}`} cx={mx} cy={my} rx={7} ry={5} fill="#8A2363" opacity={0.75} />)}
        {!pantalla && asas.map(([ax, ay, ar], i) => {
          if (Math.hypot(ax, ay) < 30) return null;
          const a = Math.atan2(ay, ax), px = ax + Math.cos(a) * (ar + 6), py = ay + Math.sin(a) * (ar + 6);
          return (
            <g key={`p${i}`}>
              {[-0.7, -0.35, 0, 0.35, 0.7].map((d, j) => <path key={j} d={`M${(ax + Math.cos(a + d) * (ar + 1)).toFixed(1)},${(ay + Math.sin(a + d) * (ar + 1)).toFixed(1)} L${(ax + Math.cos(a + d) * (ar + 9)).toFixed(1)},${(ay + Math.sin(a + d) * (ar + 9)).toFixed(1)}`} stroke="#7A45E6" strokeWidth={4} strokeLinecap="round" />)}
              <ellipse cx={px} cy={py} rx={15} ry={11} transform={`rotate(${((a * 180) / Math.PI + 90).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})`} fill="#7A45E6" />
              <circle cx={px} cy={py} r={5.5} fill="#3F1680" />
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

/** Corazón en vista anterior: ventrículos con el surco interventricular (descendente anterior y grasa), aurículas y orejuelas,
 *  vena cava superior, aorta con sus tres ramas y tronco pulmonar. `aneurisma` 0-1 dilata las coronarias proximales (Kawasaki). */
export function Corazon({ x = 0, y = 0, k = 1, o = 1, aneurisma = 0 }: { x?: number; y?: number; k?: number; o?: number; aneurisma?: number }) {
  const mus = ['#7E1530', '#C2364E', '#EC6A80'];
  const azul = ['#2F3FA0', '#5468D8', '#9FB0FF'];
  const ven = 'M-92,-26 C-112,30 -62,96 40,128 C70,138 94,120 100,88 C112,40 112,-10 92,-46 C60,-72 -60,-72 -92,-26 Z';
  const tubo = (d: string, w: number, t: string[]) => (
    <g>
      <path d={d} fill="none" stroke={t[0]} strokeWidth={w} strokeLinecap="round" transform="translate(3,3)" />
      <path d={d} fill="none" stroke={t[1]} strokeWidth={w - 4} strokeLinecap="round" />
    </g>
  );
  const an = clamp(aneurisma);
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* Grandes vasos */}
      {tubo('M-82,-150 L-82,-70', 32, azul)}
      {tubo('M-40,-100 L106,-100', 18, azul)}
      {[6, 32, 58].map((bx, i) => <g key={bx}>{tubo(`M${bx},-138 L${bx + (i - 1) * 6},-186`, 13, [mus[0], V.sangre[1]])}</g>)}
      {tubo('M-14,-50 C-18,-118 6,-150 40,-150 C76,-150 96,-126 96,-84', 36, [V.sangre[0], V.sangre[1]])}
      <path d="M-8,-110 C-6,-132 10,-142 30,-144" fill="none" stroke={V.sangre[3]} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      {tubo('M20,-40 C20,-78 34,-98 58,-104', 32, azul)}
      <path d="M14,-56 C14,-74 22,-88 36,-96" fill="none" stroke={azul[2]} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      {/* Aurícula derecha y orejuelas */}
      <ellipse cx={-86} cy={-40} rx={42} ry={46} fill={mus[0]} transform="translate(3,3)" />
      <ellipse cx={-86} cy={-40} rx={40} ry={44} fill="#B23048" />
      <path d="M84,-64 C104,-78 126,-62 116,-42 C110,-30 96,-34 86,-42 Z" fill="#A42A44" />
      {/* Ventrículos */}
      <path d={ven} fill={mus[0]} transform="translate(6,6)" />
      <path d={ven} fill={mus[1]} />
      <path d="M30,-56 C38,0 48,70 66,128 C80,130 96,118 100,88 C112,40 112,-10 92,-46 C72,-60 50,-60 30,-56 Z" fill="#A82C45" opacity={0.55} />
      <path d="M-80,-10 C-84,30 -50,70 -6,96" fill="none" stroke={mus[2]} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
      {/* Surco coronario y surco interventricular anterior con su grasa y sus arterias */}
      <path d="M-94,-26 C-40,-60 40,-64 94,-46" fill="none" stroke="#F2C24B" strokeWidth={13} strokeLinecap="round" opacity={0.9} />
      <path d="M26,-52 C34,0 44,70 64,126" fill="none" stroke="#F2C24B" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      <path d="M-58,-50 C-78,-20 -80,30 -62,82" fill="none" stroke="#E3203F" strokeWidth={5} strokeLinecap="round" />
      <path d="M26,-52 C34,0 44,70 64,126" fill="none" stroke="#E3203F" strokeWidth={5} strokeLinecap="round" />
      {[[34, -6, 76, 12], [40, 40, 86, 60], [30, 10, -10, 40]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2},${y1 + 4} ${x2},${y2}`} fill="none" stroke="#E3203F" strokeWidth={3} strokeLinecap="round" opacity={0.85} />)}
      {/* Orejuela derecha por delante de la raíz aórtica */}
      <path d="M-74,-78 C-54,-98 -26,-92 -28,-68 C-40,-60 -58,-62 -74,-78 Z" fill="#B23048" />
      <path d="M-66,-80 C-54,-90 -40,-88 -36,-78" fill="none" stroke={mus[2]} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      {an > 0.01 && <>
        <circle cx={30} cy={-24} r={6 + 14 * an} fill="#9E0B2E" /><circle cx={27} cy={-27} r={4 + 11 * an} fill="#E3203F" /><circle cx={24} cy={-31} r={2 + 3 * an} fill="#FFA3AB" />
        <circle cx={-82} cy={-10} r={5 + 11 * an} fill="#9E0B2E" /><circle cx={-84} cy={-12} r={3 + 9 * an} fill="#E3203F" />
      </>}
    </En>
  );
}

/** Nervio periférico de lado: epineuro, tres fascículos con axones ondulados y su vasa nervorum, que entra con ramas cortas.
 *  `isquemia` 0-1 ocluye la arteria (coágulo oscuro) y apaga los fascículos desde ahí. */
export function Nervio({ x = 0, y = 0, k = 1, o = 1, isquemia = 0, w = 900 }: { x?: number; y?: number; k?: number; o?: number; isquemia?: number; w?: number }) {
  const q = clamp(isquemia), W = w / 2, oc = -W * 0.15;
  const onda = (yy: number, f: number) => { let d = `M${-W + 30},${yy}`; for (let xx = -W + 30; xx < W - 30; xx += 20) d += ` q5,${f} 10,0 t10,0`; return d; };
  const ramas = Array.from({ length: Math.floor(w / 140) }, (_, i) => -W + 90 + i * 140);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-W} y={-50} width={w} height={100} rx={50} fill="#C99A3A" transform="translate(4,4)" />
      <rect x={-W} y={-50} width={w} height={100} rx={50} fill="#F7E1A8" />
      {[-26, 0, 26].map((dy, i) => (
        <g key={dy}>
          <rect x={-W + 22} y={dy - 11} width={w - 44} height={22} rx={11} fill="#FFF3CE" stroke="#D9A23A" strokeWidth={2.5} />
          <path d={onda(dy, i % 2 ? 4 : -4)} fill="none" stroke="#F2C230" strokeWidth={3} />
        </g>
      ))}
      {q > 0.01 && <rect x={oc} y={-48} width={(W - oc) * easeOut(q)} height={96} rx={20} fill="#9C95B5" opacity={0.75} />}
      {ramas.map((rx, i) => <path key={i} d={`M${rx},-66 C${rx + 10},-56 ${rx + 18},-50 ${rx + 30},-36`} fill="none" stroke={rx > oc && q > 0.5 ? '#9C95B5' : V.sangre[1]} strokeWidth={5} strokeLinecap="round" />)}
      <path d={`M${-W},-66 L${W},-66`} fill="none" stroke={V.sangre[0]} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${-W},-66 L${oc + (W - oc) * (q > 0.01 ? 0 : 1)},-66`} fill="none" stroke={V.sangre[1]} strokeWidth={9} strokeLinecap="round" />
      {q > 0.01 && <path d={`M${oc},-66 L${W},-66`} fill="none" stroke="#B5AFC8" strokeWidth={9} strokeLinecap="round" opacity={q} />}
      {q > 0.01 && <ellipse cx={oc} cy={-66} rx={16 * q} ry={11 * q} fill="#3A1342" />}
      <path d={`M${-W + 40},-38 L${-W + w * 0.4},-38`} stroke="#FFF9E6" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
    </En>
  );
}

/** Anillo de foco: círculo que se dibuja alrededor de algo. */
export function Foco({ x, y, R, p, color = '#FFD23F', w = 8 }: { x: number; y: number; R: number; p: number; color?: string; w?: number }) {
  if (p <= 0.002) return null;
  const L = 2 * Math.PI * R;
  return <circle cx={x} cy={y} r={R} fill="none" stroke={color} strokeWidth={w} strokeDasharray={`${L * easeOut(clamp(p))} ${L}`} strokeLinecap="round" transform={`rotate(-90 ${x} ${y})`} />;
}

/** Microscopio óptico: base con lámpara, brazo, platina con portaobjetos, revólver con tres objetivos, cabezal binocular y perillas de enfoque. `luz` 0-1 enciende la lámpara. */
export function Microscopio({ luz = 1, reloj = 0 }: { luz?: number; reloj?: number }) {
  const cu = ['#A99CCB', '#E9E3F6', '#FFFFFF'];
  const os = ['#24104A', '#3B1A6E', '#5B3A86'];
  const brilla = luz * (0.85 + 0.15 * Math.sin(reloj / 260));
  const brazo = 'M38,66 C38,22 70,4 70,-40 C70,-82 50,-108 28,-130 L-2,-110 C22,-86 36,-64 36,-40 C36,-8 8,22 8,66 Z';
  const ocular = (dx: number, tono: string[]) => (
    <g transform={`translate(${dx},0)`}>
      <rect x={-12} y={-76} width={24} height={46} rx={5} fill={tono[0]} />
      <rect x={-12} y={-76} width={16} height={46} rx={5} fill={tono[1]} />
      <rect x={-16} y={-90} width={32} height={16} rx={6} fill={os[0]} />
      <rect x={-13} y={-88} width={10} height={5} rx={2.5} fill={os[2]} />
    </g>
  );
  return (
    <g>
      <ellipse cx={0} cy={116} rx={130} ry={12} fill="#1C0A3E" opacity={0.18} />
      {/* Base */}
      <path d="M-112,66 Q-112,58 -100,58 L100,58 Q112,58 112,66 L120,100 Q122,112 108,112 L-108,112 Q-122,112 -120,100 Z" fill={os[0]} />
      <path d="M-108,66 Q-108,62 -98,62 L98,62 Q108,62 108,66 L114,94 Q115,100 106,100 L-106,100 Q-115,100 -114,94 Z" fill={os[1]} />
      <rect x={-96} y={66} width={70} height={7} rx={3.5} fill={os[2]} />
      {/* Lámpara y haz de luz hasta la muestra */}
      {brilla > 0.01 && <path d="M-34,52 L-6,52 L2,14 L-42,14 Z" fill="#FFE27A" opacity={0.35 * brilla} />}
      <path d="M-40,60 Q-40,40 -20,40 Q0,40 0,60 Z" fill={os[2]} />
      <ellipse cx={-20} cy={42} rx={24 * (0.9 + 0.1 * brilla)} ry={10} fill="#FFD23F" opacity={0.3 * brilla} />
      <ellipse cx={-20} cy={44} rx={13} ry={5} fill={brilla > 0.01 ? '#FFE27A' : '#8C7BB0'} />
      {/* Brazo */}
      <path d={brazo} fill={cu[0]} transform="translate(6,3)" />
      <path d={brazo} fill={cu[1]} />
      <path d="M30,-118 C46,-98 58,-74 60,-46" fill="none" stroke={cu[2]} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      {/* Perillas de enfoque: macrométrica y micrométrica */}
      <circle cx={58} cy={22} r={25} fill={os[0]} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={58 + Math.cos(a) * 24} cy={22 + Math.sin(a) * 24} r={3.2} fill={os[1]} />; })}
      <circle cx={56} cy={20} r={19} fill={os[1]} />
      <circle cx={58} cy={22} r={10} fill={os[2]} />
      <circle cx={55} cy={18} r={3.5} fill="#FFFFFF" opacity={0.6} />
      {/* Condensador */}
      <rect x={-40} y={16} width={40} height={18} rx={5} fill={os[1]} />
      <rect x={-36} y={18} width={14} height={5} rx={2.5} fill={os[2]} />
      {/* Platina, portaobjetos con su corte teñido y pinzas */}
      <rect x={8} y={-8} width={34} height={26} rx={6} fill={os[1]} />
      <rect x={-126} y={-4} width={162} height={18} rx={5} fill={os[0]} />
      <rect x={-126} y={-6} width={162} height={14} rx={5} fill={os[1]} />
      <rect x={-104} y={-14} width={96} height={9} rx={2} fill="#CFEFFF" opacity={0.95} />
      <ellipse cx={-22} cy={-9.5} rx={14} ry={3.5} fill="#E0338A" />
      <ellipse cx={-26} cy={-10.5} rx={5} ry={1.4} fill="#7A45E6" />
      <rect x={-98} y={-17} width={26} height={6} rx={3} fill={os[2]} />
      <rect x={-56} y={-17} width={26} height={6} rx={3} fill={os[2]} />
      {/* Revólver con tres objetivos (anillo rojo, amarillo y azul) */}
      {([[-14, -48, '#3B9EDD', 30], [0, -20, '#FFD23F', 44], [14, 8, '#E3203F', 30]] as const).map(([r, dx, anillo, h]) => (
        <g key={r} transform={`translate(${dx},-96) rotate(${r})`}>
          <rect x={-9} y={0} width={18} height={h} rx={4} fill={cu[0]} />
          <rect x={-9} y={0} width={12} height={h} rx={4} fill={cu[1]} />
          <rect x={-9.5} y={h * 0.45} width={19} height={5} fill={anillo} />
          <rect x={-6} y={h - 2} width={12} height={9} rx={3} fill={os[1]} />
        </g>
      ))}
      <ellipse cx={-20} cy={-98} rx={44} ry={13} fill={os[0]} />
      <ellipse cx={-22} cy={-101} rx={38} ry={9} fill={os[2]} />
      {/* Cabezal y tubo binocular inclinado */}
      <path d="M-62,-104 L36,-104 Q46,-104 44,-116 L38,-140 Q36,-148 26,-148 L-48,-148 Q-60,-148 -62,-136 Z" fill={cu[0]} transform="translate(5,3)" />
      <path d="M-62,-104 L36,-104 Q46,-104 44,-116 L38,-140 Q36,-148 26,-148 L-48,-148 Q-60,-148 -62,-136 Z" fill={cu[1]} />
      <rect x={-46} y={-140} width={60} height={6} rx={3} fill={cu[2]} opacity={0.8} />
      <g transform="translate(-34,-146) rotate(-32)">
        <rect x={-38} y={-34} width={76} height={36} rx={8} fill={cu[0]} />
        <rect x={-38} y={-34} width={64} height={30} rx={8} fill={cu[1]} />
        {ocular(-20, [os[0], os[1]])}
        {ocular(20, [os[1], os[2]])}
      </g>
    </g>
  );
}

/** Foto real de histología dentro de una lente, con su crédito (autor · licencia) pegado al aro. */
export function FotoLente({ x, y, R, foto, o = 1, credito = 'abajo', aro = '#2B3A52', tinta = 'var(--cit-texto-2)' }: { x: number; y: number; R: number; foto: FotoId; o?: number; credito?: 'arriba' | 'abajo'; aro?: string; tinta?: string }) {
  const id = useId().replace(/:/g, '');
  if (o <= 0.002) return null;
  const f = FOTOS[foto];
  const t = R < 160 ? 14 : 17;
  const cy = credito === 'abajo' ? R + 14 + t : -R - 20;
  return (
    <En x={x} y={y} o={o}>
      <clipPath id={`foto-${id}`}><circle r={R} /></clipPath>
      <circle r={R + 12} fill={aro} />
      <image href={urlFoto(foto)} x={-R} y={-R} width={R * 2} height={R * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#foto-${id})`} />
      <text y={cy} textAnchor="middle" style={{ fontSize: t, fontWeight: 600 }} fill={tinta} opacity={0.85}>{`Foto: ${f.autor} · ${f.licencia} · Wikimedia Commons`}</text>
    </En>
  );
}

/** Inhalador de rescate (asma): cartucho, boquilla y una nube de spray. */
export function Inhalador({ x = 0, y = 0, k = 1, o = 1, spray = 0 }: { x?: number; y?: number; k?: number; o?: number; spray?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-18} y={-70} width={36} height={80} rx={12} fill="#1F6FB2" transform="translate(3,3)" />
      <rect x={-18} y={-70} width={36} height={80} rx={12} fill="#3B9EDD" />
      <rect x={-12} y={-64} width={8} height={56} rx={4} fill="#9FD3F5" opacity={0.8} />
      <path d="M-24,4 L24,4 L24,30 L50,30 Q60,30 60,40 L60,54 L-14,54 Q-24,54 -24,44 Z" fill="#E9EEF7" />
      <path d="M-24,4 L24,4 L24,16 L-24,16 Z" fill="#C9D3E6" />
      {spray > 0.01 && [0, 1, 2].map((i) => <circle key={i} cx={74 + i * 16} cy={42 - i * 3} r={(8 + i * 3) * spray} fill="#CFEAFF" opacity={0.8 - i * 0.2} />)}
    </En>
  );
}

/** Pista visual: un dibujo con su nombre pequeño debajo (y un subtítulo opcional). Sustituye a un rótulo. */
export function Pista({ x, y, p = 1, nombre, sub, dy = 70, t = 20, children }: { x: number; y: number; p?: number; nombre: string; sub?: string; dy?: number; t?: number; children: ReactNode }) {
  if (p <= 0.002) return null;
  return (
    <g>
      <En x={x} y={y} o={tramo(p, 0, 0.4)} k={0.85 + 0.15 * easeBack(clamp(p))}>{children}</En>
      <Txt x={x} y={y + dy} txt={nombre} t={t} p={tramo(p, 0.1, 0.6)} />
      {sub && <Txt x={x} y={y + dy + t * 1.25} txt={sub} t={t * 0.85} p={tramo(p, 0.2, 0.7)} fuerte={false} />}
    </g>
  );
}

/** Llamada fina: texto pequeño y una línea con punto hasta lo que señala. */
export function Llamada({ x, y, a, txt, p, ancla = 'start', t = 22 }: { x: number; y: number; a: [number, number]; txt: string; p: number; ancla?: 'start' | 'end'; t?: number }) {
  if (p <= 0.002) return null;
  const ancho = txt.length * t * 0.54;
  const x0 = a[0] > x + ancho / 2 ? x + ancho + 10 : x - 10;
  const q = easeOut(clamp(p * 1.4));
  return (
    <g>
      <path d={`M${x0},${y} L${lerp(x0, a[0], q)},${lerp(y, a[1], q)}`} stroke="var(--cit-flecha)" strokeWidth={2.5} strokeDasharray="5 5" fill="none" />
      <circle cx={a[0]} cy={a[1]} r={6 * q} fill="#FFD23F" stroke={V.sangre[0]} strokeWidth={2} />
      <Txt x={x + (ancla === 'start' ? 0 : -ancho)} y={y} txt={txt} t={t} p={p} ancla="start" />
    </g>
  );
}


/** Manómetro: la aguja sube hacia el rojo con `val`. */
export function Manometro({ x, y, k = 1, o = 1, val = 0 }: { x: number; y: number; k?: number; o?: number; val?: number }) {
  const ang = lerp(-120, 70, clamp(val));
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle r={44} fill="#3B1A6E" /><circle r={37} fill="#FFFFFF" />
      <path d="M-26,22 A34,34 0 0 1 -30,-14" fill="none" stroke="#3FD467" strokeWidth={7} />
      <path d="M-30,-14 A34,34 0 0 1 14,-30" fill="none" stroke="#FFB21E" strokeWidth={7} />
      <path d="M14,-30 A34,34 0 0 1 30,16" fill="none" stroke="#E5324C" strokeWidth={7} />
      <g transform={`rotate(${ang.toFixed(1)})`}><path d="M-3,0 L0,-30 L3,0 Z" fill="#3B1A6E" /></g>
      <circle r={6} fill="#3B1A6E" />
      <path d="M0,44 L0,64 Q0,74 12,74 L40,74" fill="none" stroke="#3B1A6E" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={52} cy={74} rx={14} ry={18} fill="#E5324C" />
    </En>
  );
}


/** Portaobjetos de vidrio con el corte teñido y su etiqueta esmerilada: dice de qué es la lámina que se mira. */
export function Portaobjetos({ x, y, k = 1, o = 1, organo, tincion, caso, tejido = '#E58FB5' }: { x: number; y: number; k?: number; o?: number; organo: string; tincion: string; caso: string; tejido?: string }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-146} y={-40} width={300} height={88} rx={8} fill="#000000" opacity={0.12} />
      <rect x={-150} y={-44} width={300} height={88} rx={8} fill="#D8F0F8" />
      <rect x={-150} y={-44} width={300} height={10} rx={5} fill="#FFFFFF" opacity={0.6} />
      <rect x={-142} y={-36} width={104} height={72} rx={5} fill="#F7F4EC" />
      <rect x={-142} y={-36} width={104} height={14} rx={5} fill="#2E78F2" />
      <text x={-90} y={-25} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} fill="#FFFFFF">{tincion}</text>
      <text x={-90} y={0} textAnchor="middle" style={{ fontSize: Math.min(17, 96 / (organo.length * 0.66)), fontWeight: 800 }} fill="#2B1250">{organo}</text>
      <text x={-90} y={22} textAnchor="middle" style={{ fontSize: Math.min(13, 98 / (caso.length * 0.56)), fontWeight: 600 }} fill="#5A3D7E">{caso}</text>
      <path d="M8,-18 C34,-34 78,-30 104,-14 C126,0 122,26 96,32 C64,40 26,34 10,20 C-4,8 -6,-8 8,-18 Z" fill={tejido} opacity={0.85} />
      <path d="M30,-10 C50,-20 80,-16 94,-4 C104,6 96,20 76,22 C54,24 34,18 26,8 C20,2 22,-6 30,-10 Z" fill="#B94C8A" opacity={0.45} />
      <rect x={-20} y={-34} width={160} height={68} rx={4} fill="#FFFFFF" opacity={0.18} />
    </En>
  );
}

/** Foto que no es un zoom (una pieza entera): marco redondeado en vez de lente, con su crédito debajo. */
export function FotoCuadro({ x, y, w, h, foto, o = 1, tinta = 'var(--cit-texto-2)' }: { x: number; y: number; w: number; h: number; foto: FotoId; o?: number; tinta?: string }) {
  const id = useId().replace(/:/g, '');
  if (o <= 0.002) return null;
  const f = FOTOS[foto];
  return (
    <En x={x} y={y} o={o}>
      <clipPath id={`cuadro-${id}`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} /></clipPath>
      <rect x={-w / 2 - 8} y={-h / 2 - 8} width={w + 16} height={h + 16} rx={24} fill="#2B3A52" />
      <image href={urlFoto(foto)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#cuadro-${id})`} />
      <text y={h / 2 + 30} textAnchor="middle" style={{ fontSize: 14, fontWeight: 600 }} fill={tinta} opacity={0.85}>{`Foto: ${f.autor} · ${f.licencia} · Wikimedia Commons`}</text>
    </En>
  );
}
