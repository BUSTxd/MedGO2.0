'use client';
// Piezas del laboratorio «Metabolismo de la bilirrubina» (Digestivo, TBL 2), en el estilo
// de las referencias de BUST: infografía plana de colores saturados y sin contorno. Cada
// objeto lleva un tono oscuro de base, el cuerpo claro y un brillo; las moléculas copian la
// referencia «molécula compleja» (esferas con anillo oscuro y punto blanco, enlaces de menta
// translúcidos con un arco rosa donde tocan el átomo). Lienzo de 1600 × 1000, sin `filter`.
//
// Lo que ya existe en Vasculitis, Citopenias, Fisio y Gramnegativas se reexporta tal cual
// (no se copia); aquí solo lo propio del tema: el tetrapirrol que se abre, se pliega y se
// conjuga, la albúmina, el hepatocito, los transportadores, el moretón, la gota…

import { type ReactNode } from 'react';
import { En, clamp, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import { mezcla } from '../vasculitis-anca/Fisio';

export { En, Sale, Flecha, Txt, Rotulo, Esfera, Macrofago, Hematie as HematieC, HematieRoto, Hepatocito as HepatocitoIcono, Higado, Bazo, Medula, Cerebro, Frasco, TuboOrina, Jeringa, BolsaSangre, Pastilla, Termometro, Corazon, Chorro, clamp, tramo, lerp, easeOut, easeBack, hash, blob } from '../citopenias-autoinmunes/Piezas';
export { V, Bola, Bandera, Hematie, Vaso, Tarjeta, Rinon, Foco, Llamada, Pista, Punto, Cuerpo, LineaTiempo } from '../vasculitis-anca/Piezas';
export { Enzima, Viaja, Chip, Basal, mezcla } from '../vasculitis-anca/Fisio';
export { Bacilo, Flota, Piso, Capas, Intestino, Gel, Figurita } from '../gramnegativas/Piezas';
export { Pantalla, TxtPantalla, Manometro } from '../vasculitis-anca/Piezas';

/** Paleta propia (oscuro → claro). Cada pigmento conserva su color en todo el lab. */
export const B = {
  hemo: ['#9E0B2E', '#E3203F', '#FFA3AB'],
  hierro: ['#B5480A', '#F07A1E', '#FFC48A'],
  biliverdina: ['#0E7A34', '#2FC45A', '#B5F5C4'],
  bilirrubina: ['#C46A00', '#FFAA1A', '#FFE08A'],
  conjugada: ['#9C8A00', '#EEDC2A', '#FFF8B0'],
  glucuronido: ['#C2186B', '#F25CA8', '#FFD0E8'],
  urobilina: ['#C9A400', '#FFE36A', '#FFF7C8'],
  estercobilina: ['#5E3210', '#9A5A26', '#D99A64'],
  albumina: ['#1446B0', '#2E78F2', '#A8CCFF'],
  hepato: ['#7A1460', '#C2307A', '#F58AC4'],
  re: ['#5A2DB0', '#8A5AF0', '#D3C2FF'],
  bacteria: ['#0A7F86', '#16B9BE', '#7FEDE8'],
  co: ['#3A3F58', '#6B7290', '#C8CCE0'],
  oxigeno: ['#B0123A', '#F0476A', '#FFC2CF'],
  enlace: '#7FE8C6',
  arco: '#FF9AD0',
  sombra: 'rgba(60,20,40,0.24)',
  piel: ['#C9806A', '#E9A58A', '#F6CDB8'],
  bilis: ['#6E8A00', '#B4C82A', '#E6F29A'],
} as const;

/** Colores de TEXTO que se adaptan al tema (variables de `bilirrubina.module.css`). */
export const TXB = {
  hemo: 'var(--bi-hemo)', verde: 'var(--bi-verde)', ambar: 'var(--bi-ambar)', limon: 'var(--bi-limon)', marron: 'var(--bi-marron)',
  albumina: 'var(--bi-albumina)', hepato: 'var(--bi-hepato)', bacteria: 'var(--bi-bacteria)', violeta: 'var(--bi-violeta)', rosa: 'var(--bi-rosa)',
} as const;

type Tono = readonly string[];
type P2 = [number, number];

/** Átomo de la referencia: anillo oscuro, cuerpo claro y punto de brillo arriba a la izquierda. */
export function Atomo({ x = 0, y = 0, R = 24, tono, o = 1 }: { x?: number; y?: number; R?: number; tono: Tono; o?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={R} fill={tono[0]} />
      <circle cx={x - R * 0.08} cy={y - R * 0.08} r={R * 0.8} fill={tono[1]} />
      <circle cx={x - R * 0.36} cy={y - R * 0.38} r={R * 0.2} fill="#FFFFFF" opacity={0.92} />
    </g>
  );
}

/** Enlace de la referencia: barra de menta translúcida con un arco rosa en cada extremo. */
export function Enlace({ a, b, R = 24, w = 18, o = 1 }: { a: P2; b: P2; R?: number; w?: number; o?: number }) {
  if (o <= 0.002) return null;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g opacity={o}>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={B.enlace} strokeWidth={w} strokeLinecap="round" opacity={0.55} />
      {[[a, 0], [b, 180]].map(([pt, giro], i) => {
        const [px, py] = pt as P2;
        const cx = px + ux * (i ? -R * 0.78 : R * 0.78), cy = py + uy * (i ? -R * 0.78 : R * 0.78);
        return <path key={i} d={`M${-w * 0.55},${-w * 0.55} A${w * 0.78},${w * 0.78} 0 0 0 ${-w * 0.55},${w * 0.55}`} transform={`translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${(ang + (giro as number)).toFixed(1)})`} fill="none" stroke={B.arco} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
      })}
    </g>
  );
}

/** Glucurónido: hexágono rosa (la «colita»). */
export function Glucuronido({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  if (o <= 0.002) return null;
  const hex = Array.from({ length: 6 }, (_, i) => `${(Math.cos((i * Math.PI) / 3) * 17).toFixed(1)},${(Math.sin((i * Math.PI) / 3) * 17).toFixed(1)}`).join(' ');
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <polygon points={hex} fill={B.glucuronido[0]} transform="translate(2,2)" />
      <polygon points={hex} fill={B.glucuronido[1]} />
      <circle cx={-5} cy={-6} r={4} fill={B.glucuronido[2]} />
    </En>
  );
}

// Posiciones de los cuatro anillos de pirrol (A, B, C, D) en tres formas.
const ANILLO: P2[] = [[-48, -48], [-48, 48], [48, 48], [48, -48]];
const CADENA: P2[] = [[-114, -10], [-38, 14], [38, 14], [114, -10]];
const LIBRO: P2[] = [[-34, -66], [-34, 10], [34, 10], [34, -66]];

/** El tetrapirrol que cuenta toda la historia. Una sola pieza que se transforma:
 *  `abre` 0 → anillo de hemo cerrado (con el hierro en el centro), 1 → cadena abierta.
 *  `plegada` 0-1 cierra la cadena «como un libro» (puentes de hidrógeno internos, en trazos blancos).
 *  `colitas` 0-2 engancha uno y luego dos glucurónidos (conjugada). `tono`: el color del pigmento.
 *  `fe` 0-1: el hierro del centro. `vibra` (ms): un temblor leve para que nunca quede quieta. */
export function Tetrapirrol({ x = 0, y = 0, k = 1, r = 0, o = 1, abre = 1, plegada = 0, colitas = 0, tono = B.bilirrubina as Tono, fe = 0, vibra = 0, propionicos = true }: { x?: number; y?: number; k?: number; r?: number; o?: number; abre?: number; plegada?: number; colitas?: number; tono?: Tono; fe?: number; vibra?: number; propionicos?: boolean }) {
  if (o <= 0.002) return null;
  const a = easeOut(clamp(abre)), pl = easeOut(clamp(plegada));
  const pts: P2[] = ANILLO.map((p0, i) => {
    const c = CADENA[i], l = LIBRO[i];
    const px = lerp(lerp(p0[0], c[0], a), l[0], pl), py = lerp(lerp(p0[1], c[1], a), l[1], pl);
    const t = vibra ? Math.sin(vibra / 380 + i * 1.7) * 3 : 0;
    return [px + t, py - t * 0.6];
  });
  // Ácidos propiónicos: cuelgan de los anillos B y C hacia abajo; en el libro, sus puentes los unen a A y D.
  const prop: P2[] = [[pts[1][0] - 8, pts[1][1] + 62], [pts[2][0] + 8, pts[2][1] + 62]];
  const R = 26;
  // Escala base: la molécula es la protagonista, se dibuja grande.
  return (
    <En x={x} y={y} k={k * 1.3 * (1 + 0.45 * pl)} r={r} o={o}>
      <ellipse cx={0} cy={110} rx={130 - 40 * pl} ry={13} fill={B.sombra} opacity={0.6} />
      <Enlace a={pts[0]} b={pts[1]} R={R} />
      <Enlace a={pts[1]} b={pts[2]} R={R} />
      <Enlace a={pts[2]} b={pts[3]} R={R} />
      <Enlace a={pts[3]} b={pts[0]} R={R} o={1 - a} />
      {propionicos && prop.map((q, i) => <Enlace key={`e${i}`} a={pts[i + 1]} b={q} R={14} w={12} />)}
      {pl > 0.05 && propionicos && prop.map((q, i) => {
        const otro = pts[i === 0 ? 0 : 3];
        return <line key={`h${i}`} x1={q[0]} y1={q[1]} x2={otro[0]} y2={otro[1]} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="6 9" strokeLinecap="round" opacity={0.9 * pl * (1 - clamp(colitas))} />;
      })}
      {fe > 0.01 && <Atomo x={0} y={0} R={22} tono={B.hierro} o={clamp(fe)} />}
      {pts.map((q, i) => <Atomo key={i} x={q[0]} y={q[1]} R={R} tono={tono} />)}
      {propionicos && prop.map((q, i) => <Atomo key={`p${i}`} x={q[0]} y={q[1]} R={13} tono={B.oxigeno} />)}
      {colitas > 0.01 && prop.map((q, i) => {
        const v = tramo(colitas, i, i + 1);
        return v > 0 ? <Glucuronido key={`g${i}`} x={q[0] + (i ? 22 : -22)} y={q[1] + 30} k={0.6 + 0.4 * easeOut(v)} o={tramo(v, 0, 0.5)} r={i ? 20 : -20} /> : null;
      })}
    </En>
  );
}

/** Monóxido de carbono: C gris azulado unido a un O rojo. */
export function CO({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <Enlace a={[-18, 0]} b={[18, 0]} R={18} w={12} />
      <Atomo x={-18} y={0} R={18} tono={B.co} />
      <Atomo x={18} y={0} R={18} tono={B.oxigeno} />
    </En>
  );
}

/** Hierro: esfera naranja con «Fe». */
export function Hierro({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <Atomo R={24} tono={B.hierro} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 20, fontWeight: 800, fill: '#FFFFFF' }}>Fe</text>
    </En>
  );
}

/** Albúmina, el «barco»: racimo de esferas azules (referencia de la molécula), con un hueco arriba donde se sienta su carga. */
export function Albumina({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number }) {
  const b = Math.sin(reloj / 520 + fase) * 4;
  const bolas: [number, number, number][] = [[-58, 8, 34], [-14, 22, 40], [36, 16, 36], [70, -6, 26], [-40, -22, 26], [14, -16, 28]];
  return (
    <En x={x} y={y + b} k={k} o={o} r={r}>
      <ellipse cx={8} cy={70 - b} rx={92} ry={12} fill={B.sombra} opacity={0.55} />
      {bolas.map(([cx, cy, R], i) => <circle key={`s${i}`} cx={cx} cy={cy} r={R + 4} fill={B.albumina[0]} />)}
      {bolas.map(([cx, cy, R], i) => <circle key={`c${i}`} cx={cx - 3} cy={cy - 3} r={R} fill={B.albumina[1]} />)}
      {bolas.map(([cx, cy, R], i) => <circle key={`b${i}`} cx={cx - R * 0.4} cy={cy - R * 0.42} r={R * 0.2} fill="#FFFFFF" opacity={0.85} />)}
    </En>
  );
}

/** Gota (bilis, orina, agua): con su brillo. */
export function Gota({ x = 0, y = 0, k = 1, o = 1, tono, r = 0 }: { x?: number; y?: number; k?: number; o?: number; tono: Tono; r?: number }) {
  const d = 'M0,-70 C22,-36 46,-8 46,22 C46,50 25,68 0,68 C-25,68 -46,50 -46,22 C-46,-8 -22,-36 0,-70 Z';
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={d} fill={B.sombra} transform="translate(8,9)" />
      <path d={d} fill={tono[0]} />
      <path d="M0,-62 C18,-32 38,-6 38,22 C38,44 22,58 0,58 C-22,58 -40,44 -40,20 C-40,-6 -20,-32 0,-62 Z" fill={tono[1]} />
      <path d="M-24,10 Q-24,-8 -12,-24" fill="none" stroke={tono[2]} strokeWidth={9} strokeLinecap="round" />
    </En>
  );
}

/** Piel con un moretón: el color pasa de rojo violeta (0) a verde (1) y a amarillo (2). */
export function Moreton({ x = 0, y = 0, k = 1, o = 1, fase = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; fase?: number; reloj?: number }) {
  const f = clamp(fase, 0, 2);
  const tinta = f <= 1 ? mezcla('#7A2A8A', '#3E9E4A', f) : mezcla('#3E9E4A', '#F2C21E', f - 1);
  const borde = f <= 1 ? mezcla('#B04A9A', '#8ACB5A', f) : mezcla('#8ACB5A', '#FFE07A', f - 1);
  const late = 1 + Math.sin(reloj / 900) * 0.02;
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-250} y={-120} width={520} height={250} rx={125} fill={B.sombra} transform="translate(10,12)" />
      <rect x={-260} y={-130} width={520} height={250} rx={125} fill={B.piel[0]} />
      <rect x={-260} y={-130} width={510} height={236} rx={118} fill={B.piel[1]} />
      <path d="M-200,-84 Q-120,-112 -20,-108" fill="none" stroke={B.piel[2]} strokeWidth={14} strokeLinecap="round" opacity={0.8} />
      <g transform={`scale(${late.toFixed(3)})`}>
        <path d="M-110,-6 C-120,-60 -40,-84 10,-70 C70,-56 120,-30 106,20 C94,64 30,74 -20,66 C-74,58 -104,40 -110,-6 Z" fill={borde} opacity={0.75} />
        <path d="M-80,-4 C-86,-44 -30,-60 8,-50 C52,-40 84,-20 74,14 C64,44 20,52 -16,46 C-54,40 -76,28 -80,-4 Z" fill={tinta} />
        <circle cx={-34} cy={-22} r={14} fill="#FFFFFF" opacity={0.18} />
      </g>
    </En>
  );
}

/** Ave plana (las aves y los anfibios eliminan la biliverdina tal cual). */
export function Ave({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  const ala = Math.sin(reloj / 260) * 14;
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={4} cy={86} rx={60} ry={10} fill={B.sombra} />
      <path d="M-70,10 C-70,-40 -20,-60 20,-50 C60,-40 80,-10 70,24 C60,58 10,70 -30,58 C-56,50 -70,36 -70,10 Z" fill="#1E7FD0" />
      <path d="M-62,8 C-62,-30 -20,-48 16,-40 C50,-32 66,-8 58,20 C50,48 10,58 -26,48 C-50,42 -62,30 -62,8 Z" fill="#3FB4E0" />
      <path d={`M24,-4 C6,${-46 - ala} -40,${-40 - ala} -64,${-12 - ala * 0.6} C-44,4 -12,12 24,-4 Z`} fill="#1BA79A" />
      <path d={`M14,-2 C-2,${-26 - ala * 0.6} -30,${-24 - ala * 0.6} -46,${-6 - ala * 0.4}`} fill="none" stroke="#7FE0D0" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <circle cx={34} cy={-22} r={8} fill="#22105E" /><circle cx={31} cy={-25} r={2.5} fill="#FFF" />
      <path d="M58,-12 L88,-4 L58,6 Z" fill="#FFB21E" />
      <path d="M-10,62 L-14,84 M14,62 L12,84" stroke="#FFB21E" strokeWidth={6} strokeLinecap="round" />
    </En>
  );
}

/** Escudo (antioxidante). */
export function Escudo({ x = 0, y = 0, k = 1, o = 1, tono = B.bilirrubina as Tono }: { x?: number; y?: number; k?: number; o?: number; tono?: Tono }) {
  const d = 'M0,-80 L66,-56 C66,10 44,54 0,84 C-44,54 -66,10 -66,-56 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={d} fill={B.sombra} transform="translate(8,9)" />
      <path d={d} fill={tono[0]} />
      <path d="M0,-66 L52,-46 C52,6 34,42 0,68 C-34,42 -52,6 -52,-46 Z" fill={tono[1]} />
      <path d="M-30,-40 L-30,0" stroke={tono[2]} strokeWidth={10} strokeLinecap="round" />
    </En>
  );
}

/** Radical libre: bolita roja con dientes que tiembla. */
export function Radical({ x = 0, y = 0, k = 1, o = 1, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number; fase?: number }) {
  const t = Math.sin(reloj / 90 + fase) * 3;
  return (
    <En x={x + t} y={y - t} k={k} o={o}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r={7} fill="#C2185B" />;
      })}
      <circle r={18} fill="#F2476A" /><circle cx={-6} cy={-6} r={5} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Placenta: disco rosa con su cordón que se ondula. */
export function Placenta({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  const cordon = Array.from({ length: 12 }, (_, i) => `${i ? 'L' : 'M'}${(20 + i * 14).toFixed(1)},${(40 + Math.sin(i * 0.9 + reloj / 400) * 10).toFixed(1)}`).join(' ');
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={8} cy={10} rx={96} ry={64} fill={B.sombra} />
      <ellipse rx={96} ry={64} fill="#B5245E" />
      <ellipse cx={-6} cy={-6} rx={84} ry={52} fill="#E65A8C" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-60 + i * 20} cy={(i % 2 ? -14 : 10)} r={9} fill="#FF9AB8" opacity={0.8} />)}
      <path d={cordon} fill="none" stroke="#8FD0F0" strokeWidth={12} strokeLinecap="round" />
    </En>
  );
}

/** Estación del viaje (referencia de la línea de tiempo): una plataforma de color sobre la vía, que se enciende. */
export function Estacion({ x, y, color, p = 1, luz = 0, children }: { x: number; y: number; color: string; p?: number; luz?: number; children?: ReactNode }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      {luz > 0.01 && <circle cx={x} cy={y} r={82 + 10 * luz} fill={color} opacity={0.22 * clamp(luz)} />}
      <rect x={x - 66} y={y + 74} width={132} height={22} rx={11} fill={color} />
      <En x={x} y={y} k={0.7 + 0.3 * q}>{children}</En>
    </g>
  );
}

/** Vía del tren con sus traviesas y tramos de color (de la referencia de la línea de tiempo). */
export function Via({ x0, x1, y, tramos, p = 1 }: { x0: number; x1: number; y: number; tramos: string[]; p?: number }) {
  const L = (x1 - x0) * easeOut(clamp(p)), n = tramos.length, paso = (x1 - x0) / n;
  return (
    <g>
      <rect x={x0} y={y + 6} width={L} height={30} fill={B.sombra} />
      {tramos.map((c, i) => {
        const w = clamp(L - i * paso, 0, paso);
        return w > 0 ? <rect key={i} x={x0 + i * paso} y={y} width={w} height={30} fill={c} /> : null;
      })}
      {Array.from({ length: Math.floor(L / 46) }, (_, i) => <rect key={i} x={x0 + 10 + i * 46} y={y + 9} width={24} height={12} rx={3} fill="#FFFFFF" opacity={0.35} />)}
    </g>
  );
}

/** Vagón del tren: la bilirrubina de pasajera. */
export function Vagon({ x, y, k = 1, o = 1, reloj = 0, tono = B.bilirrubina as Tono }: { x: number; y: number; k?: number; o?: number; reloj?: number; tono?: Tono }) {
  const rueda = (reloj / 6) % 360;
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-70} y={-62} width={140} height={84} rx={18} fill={tono[0]} />
      <rect x={-70} y={-62} width={134} height={74} rx={16} fill={tono[1]} />
      <rect x={-52} y={-48} width={42} height={30} rx={8} fill={tono[2]} /><rect x={6} y={-48} width={42} height={30} rx={8} fill={tono[2]} />
      {[-40, 40].map((cx) => (
        <g key={cx} transform={`translate(${cx},26) rotate(${rueda})`}>
          <circle r={18} fill="#2A1250" /><circle r={7} fill="#B79BFF" /><rect x={-2} y={-16} width={4} height={32} fill="#B79BFF" />
        </g>
      ))}
    </En>
  );
}

// ─── Membrana y transportadores (referencia «membrana celular») ──────────────

/** Canal de membrana: dona dorada en perspectiva con el agujero oscuro y su brillo, sobre un tallo.
 *  `tono` cambia el color (OATP dorado, MRP2 naranja, MRP3 rosa…). `roto` 0-1 la tacha y la apaga. `bombea` (ms) la hace latir. */
export function Poro({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = ['#C77800', '#FFB21E', '#FFE08A'] as Tono, roto = 0, bombea = 0, tallo = 70 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; roto?: number; bombea?: number; tallo?: number }) {
  if (o <= 0.002) return null;
  const late = bombea ? 1 + Math.max(0, Math.sin(bombea / 180)) * 0.08 : 1;
  const apaga = clamp(roto);
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-9} y={0} width={18} height={tallo} rx={9} fill="#D23AD8" opacity={1 - 0.5 * apaga} />
      <g transform={`scale(${late.toFixed(3)})`}>
        <ellipse cx={0} cy={6} rx={62} ry={26} fill={mezcla(tono[0], '#6A6070', apaga)} />
        <ellipse cx={0} cy={0} rx={60} ry={24} fill={mezcla(tono[1], '#9A90A0', apaga)} />
        <ellipse cx={0} cy={-2} rx={30} ry={9} fill="#1A1248" />
        <ellipse cx={34} cy={8} rx={10} ry={5} fill="#FFFFFF" opacity={0.8} />
      </g>
      {apaga > 0.01 && <g opacity={apaga} stroke="#E3203F" strokeWidth={10} strokeLinecap="round"><path d="M-40,-30 L40,30" /><path d="M40,-30 L-40,30" /></g>}
    </En>
  );
}

/** Proteína que flota (ligandina, FABP, receptor): blob de dos lóbulos de la referencia, con su brillo. */
export function Proteina({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = ['#3A5FD0', '#7298F5', '#C8D8FF'] as Tono, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; reloj?: number; fase?: number }) {
  const b = Math.sin(reloj / 600 + fase) * 5;
  return (
    <En x={x} y={y + b} k={k} o={o} r={r}>
      <ellipse cx={34} cy={6} rx={50} ry={46} fill={tono[0]} />
      <ellipse cx={-16} cy={0} rx={62} ry={54} fill={tono[1]} />
      <ellipse cx={-34} cy={-16} rx={20} ry={17} fill={tono[2]} />
    </En>
  );
}

/** Célula del hígado vista en corte: bloque magenta con el núcleo; `x0..x1`, `y0..y1`. `tinte` 0-1 la tiñe de amarillo (bilirrubina dentro). */
export function Hepatocito({ x0, x1, y0, y1, o = 1, tinte = 0, nucleo = true, sem = 1 }: { x0: number; x1: number; y0: number; y1: number; o?: number; tinte?: number; nucleo?: boolean; sem?: number }) {
  const w = x1 - x0, h = y1 - y0;
  const cuerpo = mezcla(B.hepato[1], '#E0A030', clamp(tinte) * 0.45);
  return (
    <g opacity={o}>
      <rect x={x0 + 8} y={y0 + 10} width={w} height={h} rx={34} fill={B.sombra} />
      <rect x={x0} y={y0} width={w} height={h} rx={34} fill={B.hepato[0]} />
      <rect x={x0} y={y0} width={w - 8} height={h - 10} rx={30} fill={cuerpo} />
      <path d={`M${x0 + 30},${y0 + 40} Q${x0 + 18},${y0 + h / 2} ${x0 + 30},${y1 - 50}`} fill="none" stroke={B.hepato[2]} strokeWidth={9} strokeLinecap="round" opacity={0.7} />
      {nucleo && <g><ellipse cx={x0 + w * (0.5 + (hash(sem, 2) - 0.5) * 0.2)} cy={y0 + h * 0.55} rx={Math.min(70, w * 0.18)} ry={Math.min(56, h * 0.2)} fill="#4A1060" /><ellipse cx={x0 + w * (0.5 + (hash(sem, 2) - 0.5) * 0.2) - 10} cy={y0 + h * 0.55 - 8} rx={Math.min(46, w * 0.12)} ry={Math.min(34, h * 0.13)} fill="#7A2A9A" /></g>}
    </g>
  );
}

/** Retículo endoplasmático: cintas violetas onduladas que se mueven (la «cinta de montaje»). */
export function Reticulo({ x, y, w = 420, n = 3, o = 1, reloj = 0 }: { x: number; y: number; w?: number; n?: number; o?: number; reloj?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, j) => {
        const d = Array.from({ length: 13 }, (_, i) => `${i ? 'L' : 'M'}${(x - w / 2 + (i * w) / 12).toFixed(1)},${(y + j * 34 + Math.sin(i * 0.9 + reloj / 700 + j) * 8).toFixed(1)}`).join(' ');
        return <g key={j}><path d={d} fill="none" stroke={B.re[0]} strokeWidth={24} strokeLinecap="round" /><path d={d} fill="none" stroke={B.re[1]} strokeWidth={14} strokeLinecap="round" /></g>;
      })}
    </g>
  );
}

/** Receptor nuclear (PPARα) con su hueco en forma de llave; `encaja` 0-1 mete la bilirrubina dentro. */
export function Cerradura({ x = 0, y = 0, k = 1, o = 1, encaja = 0, tono = ['#0A7F86', '#16B9BE', '#7FEDE8'] as Tono }: { x?: number; y?: number; k?: number; o?: number; encaja?: number; tono?: Tono }) {
  const e = easeOut(clamp(encaja));
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-110,-60 Q-110,-100 -70,-100 L-24,-100 L-24,-40 L24,-40 L24,-100 L70,-100 Q110,-100 110,-60 L110,60 Q110,100 70,100 L-70,100 Q-110,100 -110,60 Z" fill={tono[0]} transform="translate(8,9)" opacity={0.4} />
      <path d="M-110,-60 Q-110,-100 -70,-100 L-24,-100 L-24,-40 L24,-40 L24,-100 L70,-100 Q110,-100 110,-60 L110,60 Q110,100 70,100 L-70,100 Q-110,100 -110,60 Z" fill={tono[0]} />
      <path d="M-100,-56 Q-100,-90 -66,-90 L-34,-90 L-34,-30 L34,-30 L34,-90 L66,-90 Q100,-90 100,-56 L100,50 Q100,86 66,86 L-66,86 Q-100,86 -100,50 Z" fill={tono[1]} />
      <circle cx={-64} cy={-56} r={9} fill={tono[2]} />
      <g transform={`translate(0,${lerp(-160, -66, e)})`} opacity={tramo(encaja, 0, 0.3)}>
        <Atomo R={24} tono={B.bilirrubina} />
      </g>
      {e > 0.95 && <circle r={130} fill="none" stroke={tono[2]} strokeWidth={6} opacity={0.6} />}
    </En>
  );
}

/** Gotita de grasa que se encoge (`usa` 0-1). */
export function Grasa({ x = 0, y = 0, k = 1, o = 1, usa = 0 }: { x?: number; y?: number; k?: number; o?: number; usa?: number }) {
  const s = 1 - 0.55 * easeOut(clamp(usa));
  return (
    <En x={x} y={y} k={k * s} o={o}>
      <circle r={44} fill="#E0A100" /><circle cx={-4} cy={-4} r={38} fill="#FFD23F" /><circle cx={-16} cy={-16} r={9} fill="#FFF" opacity={0.85} />
    </En>
  );
}

/** Cruz roja (no pasa). */
export function Cruz({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  if (o <= 0.002) return null;
  return <En x={x} y={y} k={k} o={o}><circle r={30} fill="#E3203F" /><path d="M-13,-13 L13,13 M13,-13 L-13,13" stroke="#FFF" strokeWidth={7} strokeLinecap="round" /></En>;
}

/** Visto verde (sí). */
export function Visto({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  if (o <= 0.002) return null;
  return <En x={x} y={y} k={k} o={o}><circle r={30} fill="#18A34A" /><path d="M-13,1 L-3,11 L14,-10" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></En>;
}

/** Puntitos de bilirrubina que viajan en fila por un camino (flujo continuo). */
export function Flujo({ camino, reloj, n = 8, vel = 0.00012, tono = B.bilirrubina as Tono, R = 9, o = 1, sem = 1 }: { camino: (u: number) => P2; reloj: number; n?: number; vel?: number; tono?: Tono; R?: number; o?: number; sem?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const u = (i / n + reloj * vel + hash(i, sem) * 0.02) % 1;
        const [px, py] = camino(u);
        const borde = tramo(Math.min(u, 1 - u), 0, 0.08);
        return <g key={i} opacity={borde}><circle cx={px} cy={py} r={R} fill={tono[0]} /><circle cx={px - R * 0.15} cy={py - R * 0.15} r={R * 0.75} fill={tono[1]} /></g>;
      })}
    </g>
  );
}

/** Tubo de ensayo con su líquido (`color`) y burbujas que suben. */
export function TuboEnsayo({ x = 0, y = 0, k = 1, o = 1, color = '#FFD23F', nivel = 0.6, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; color?: string; nivel?: number; reloj?: number }) {
  const alto = 260 * clamp(nivel);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-50} y={-170} width={100} height={330} rx={44} fill={B.sombra} transform="translate(8,9)" />
      <rect x={-50} y={-170} width={100} height={330} rx={44} fill="#D6E7F2" />
      <rect x={-40} y={150 - alto} width={80} height={alto} rx={36} fill={color} />
      {Array.from({ length: 4 }, (_, i) => {
        const u = (reloj / 1800 + i / 4) % 1;
        return alto > 40 ? <circle key={i} cx={-16 + i * 11} cy={140 - u * (alto - 20)} r={5} fill="#FFFFFF" opacity={0.5 * (1 - u)} /> : null;
      })}
      <rect x={-28} y={-150} width={12} height={280} rx={6} fill="#FFF" opacity={0.6} />
      <rect x={-62} y={-190} width={124} height={34} rx={10} fill="#7F93A8" />
    </En>
  );
}

/** Tira reactiva de orina: varilla blanca con almohadillas de color (`pads`: lista de colores). */
export function Tira({ x = 0, y = 0, k = 1, o = 1, r = 0, pads }: { x?: number; y?: number; k?: number; o?: number; r?: number; pads: string[] }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-40} y={-300} width={80} height={600} rx={14} fill={B.sombra} transform="translate(8,9)" />
      <rect x={-40} y={-300} width={80} height={600} rx={14} fill="#F4F2FA" />
      {pads.map((c, i) => <rect key={i} x={-28} y={-270 + i * 92} width={56} height={64} rx={10} fill={c} />)}
    </En>
  );
}

/** La UGT1A1: máquina violeta con un brazo que engancha glucurónidos; `encendida` 0-1, `golpe` (ms) mueve el brazo. */
export function Maquina({ x, y, k = 1, o = 1, encendida = 1, golpe = 0 }: { x: number; y: number; k?: number; o?: number; encendida?: number; golpe?: number }) {
  if (o <= 0.002) return null;
  const brazo = Math.sin(golpe / 260) * 18 * clamp(encendida);
  const luz = clamp(encendida);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
      <rect x={-86} y={-60} width={180} height={140} rx={30} fill={B.sombra} />
      <rect x={-94} y={-70} width={180} height={140} rx={30} fill={B.re[0]} />
      <rect x={-94} y={-70} width={172} height={124} rx={28} fill={lerp(0, 1, luz) > 0.5 ? B.re[1] : '#7A6A9A'} />
      <circle cx={-40} cy={-16} r={20} fill={luz > 0.5 ? '#FFD23F' : '#4A3A6A'} />
      <circle cx={-46} cy={-22} r={6} fill="#FFF" opacity={0.8 * luz} />
      <g transform={`translate(30,-70) rotate(${brazo})`}>
        <rect x={-8} y={-70} width={16} height={74} rx={8} fill={B.re[0]} />
        <circle cx={0} cy={-74} r={16} fill={B.glucuronido[1]} opacity={luz} />
      </g>
    </g>
  );
}

// ─── Pulmones (vista anterior, planos y detallados) ────────────────────────────

const PULMON_D = 'M-34,-118 C-70,-142 -146,-96 -166,6 C-182,88 -160,150 -108,152 C-72,154 -44,136 -34,108 C-30,40 -30,-40 -34,-118 Z';
const PULMON_I = 'M34,-118 C70,-142 146,-96 166,6 C182,88 160,150 108,152 C82,154 56,146 46,126 C64,104 66,74 46,52 C38,20 34,-40 34,-118 Z';
const TONO_PULMON = ['#A8325E', '#E8739C', '#FFC2D6'];

/** Árbol bronquial de un lado (`s` = −1 derecha del paciente, +1 izquierda). */
function Bronquios({ s }: { s: number }) {
  const d = [
    `M${s * 16},-90 C${s * 40},-64 ${s * 62},-40 ${s * 78},-6`,
    `M${s * 50},-50 C${s * 76},-70 ${s * 100},-76 ${s * 120},-74`,
    `M${s * 66},-26 C${s * 98},-24 ${s * 120},-10 ${s * 138},10`,
    `M${s * 78},-6 C${s * 92},30 ${s * 104},70 ${s * 112},110`,
    `M${s * 78},-6 C${s * 70},34 ${s * 66},72 ${s * 68},116`,
    `M${s * 96},44 C${s * 118},56 ${s * 134},74 ${s * 146},96`,
    `M${s * 60},-70 C${s * 70},-96 ${s * 74},-110 ${s * 80},-124`,
  ];
  return (
    <g fill="none" strokeLinecap="round">
      {d.map((p, i) => <path key={i} d={p} stroke="#FFE8F0" strokeWidth={i < 1 ? 11 : i < 4 ? 7 : 5} opacity={0.85} />)}
    </g>
  );
}

/** Pulmones con tráquea anillada, árbol bronquial, cisuras (tres lóbulos a la derecha, dos a la izquierda con la escotadura
 *  cardíaca), sombra en media luna, alvéolos y brillo. `reloj` los hace respirar. Ocupa x ±185, y −215…155. */
export function PulmonesB({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  const r = 1 + Math.sin(reloj / 900) * 0.025;
  return (
    <En x={x} y={y} k={k} o={o}>
      <g transform={`scale(${r.toFixed(4)},${(1 + (r - 1) * 0.6).toFixed(4)})`}>
        {[PULMON_D, PULMON_I].map((d, i) => (
          <g key={i}>
            <path d={d} fill={TONO_PULMON[0]} transform="translate(8,9)" opacity={0.35} />
            <path d={d} fill={TONO_PULMON[0]} />
            <path d={d} fill={TONO_PULMON[1]} transform={`translate(${i ? 3 : -3},-4) scale(0.95)`} />
          </g>
        ))}
        {/* Sombra en media luna del borde lateral e inferior */}
        <path d="M-166,6 C-182,88 -160,150 -108,152 C-72,154 -44,136 -34,108 C-60,132 -100,138 -128,120 C-156,100 -166,60 -166,6 Z" fill={TONO_PULMON[0]} opacity={0.7} />
        <path d="M166,6 C182,88 160,150 108,152 C82,154 56,146 46,126 C74,138 112,134 134,114 C158,92 166,56 166,6 Z" fill={TONO_PULMON[0]} opacity={0.7} />
        {/* Alvéolos */}
        {Array.from({ length: 26 }, (_, i) => {
          const lado = i % 2 ? 1 : -1, xx = lado * (60 + hash(i, 31) * 90), yy = -70 + hash(i, 32) * 200;
          return <circle key={i} cx={xx} cy={yy} r={4 + hash(i, 33) * 5} fill={TONO_PULMON[2]} opacity={0.45} />;
        })}
        <Bronquios s={-1} />
        <Bronquios s={1} />
        {/* Cisuras: horizontal y oblicua a la derecha; oblicua a la izquierda */}
        <path d="M-40,-6 C-80,-6 -122,0 -164,10" fill="none" stroke={TONO_PULMON[0]} strokeWidth={5} strokeLinecap="round" />
        <path d="M-150,-60 C-120,-10 -80,60 -44,122" fill="none" stroke={TONO_PULMON[0]} strokeWidth={5} strokeLinecap="round" />
        <path d="M150,-60 C122,-6 92,50 70,132" fill="none" stroke={TONO_PULMON[0]} strokeWidth={5} strokeLinecap="round" />
        {/* Brillo */}
        <path d="M-136,-40 Q-120,-96 -76,-118" fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.55} />
        <path d="M136,-40 Q120,-96 76,-118" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.4} />
      </g>
      {/* Tráquea con sus anillos de cartílago y la carina */}
      <path d="M-18,-215 L18,-215 L18,-104 C30,-92 44,-82 58,-72 L50,-60 C34,-70 16,-82 0,-92 C-16,-82 -34,-70 -50,-60 L-58,-72 C-44,-82 -30,-92 -18,-104 Z" fill="#E9D8C8" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-18,${-206 + i * 12} Q0,${-200 + i * 12} 18,${-206 + i * 12}`} fill="none" stroke="#B89A80" strokeWidth={5} strokeLinecap="round" />)}
      <path d="M-8,-212 L-8,-110" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    </En>
  );
}

// ─── Tijeras de verdad ──────────────────────────────────────────────────────────

/** Una de las dos piezas de la tijera: la hoja hacia +x y, al otro lado del eje, su anilla. `lado` ±1 la refleja. */
function PiezaTijera({ ang, lado, color, claro }: { ang: number; lado: 1 | -1; color: string; claro: string }) {
  return (
    <g transform={`rotate(${ang.toFixed(2)})`}>
      {/* Hoja: el filo recto mira a la otra hoja; el lomo, curvo */}
      <path d={lado === 1 ? 'M-6,0 L104,-1 C80,-12 40,-20 -6,-14 Z' : 'M-6,0 L104,1 C80,12 40,20 -6,14 Z'} fill="#C8D2E0" />
      <path d={lado === 1 ? 'M-6,0 L104,-1 C84,-6 40,-9 -6,-6 Z' : 'M-6,0 L104,1 C84,6 40,9 -6,6 Z'} fill="#F2F6FC" />
      {/* Brazo y anilla */}
      <path d={lado === 1 ? 'M-4,4 C-20,10 -36,18 -46,26' : 'M-4,-4 C-20,-10 -36,-18 -46,-26'} stroke={color} strokeWidth={14} strokeLinecap="round" fill="none" />
      <ellipse cx={-66} cy={lado * 34} rx={26} ry={20} fill="none" stroke={color} strokeWidth={12} transform={`rotate(${lado * 20} -66 ${lado * 34})`} />
      <path d={`M-84,${lado * 26} Q-74,${lado * 18} -62,${lado * 18}`} stroke={claro} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.8} />
    </g>
  );
}

/** Tijera: dos piezas que se cruzan en el eje (cada una con su hoja y su anilla al lado contrario), así que al cerrar
 *  las hojas se cruzan y cortan. `corta` 0 abierta → 1 cerrada. `r` gira toda la tijera. Hojas de unos 100 de largo. */
export function Tijera({ x = 0, y = 0, k = 1, o = 1, r = 0, corta = 0, color = '#0C9E9A' }: { x?: number; y?: number; k?: number; o?: number; r?: number; corta?: number; color?: string }) {
  if (o <= 0.002) return null;
  const a = lerp(26, 1.5, clamp(corta));
  const claro = mezcla(color, '#FFFFFF', 0.6);
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <PiezaTijera ang={-a} lado={1} color={color} claro={claro} />
      <PiezaTijera ang={a} lado={-1} color={mezcla(color, '#000000', 0.18)} claro={claro} />
      <circle r={8} fill="#5A6478" /><circle cx={-2} cy={-2} r={3.5} fill="#FFFFFF" opacity={0.8} />
    </En>
  );
}

/** Golpe de corte que se repite: 0 abierta → 1 cerrada, rápido al cerrar y lento al abrir. */
export const tijeretazo = (reloj: number, periodo = 900) => {
  const u = (reloj % periodo) / periodo;
  return u < 0.3 ? easeOut(u / 0.3) : 1 - (u - 0.3) / 0.7;
};

// ─── Retratos (referencias de pacientes y del hombre adulto) ──────────────────

/** Retrato plano en su tarjeta crema: piel de color sólido, ojos macizos, cejas gruesas, nariz redonda, orejas.
 *  `quien`: 'adulto' (pelo con remolino), 'adulta' (melena), 'bebe' (cabeza grande, mechón, mejillas, gorrito). */
export function Rostro({ x = 0, y = 0, k = 1, o = 1, quien, piel = ['#B8456A', '#E07A98'], pelo = '#2A1460', ropa = ['#0A7F86', '#3FC0B8'], reloj = 0, triste = 0 }: { x?: number; y?: number; k?: number; o?: number; quien: 'adulto' | 'adulta' | 'bebe'; piel?: string[]; pelo?: string; ropa?: string[]; reloj?: number; triste?: number }) {
  if (o <= 0.002) return null;
  const bebe = quien === 'bebe';
  const parpadeo = (reloj % 4200) < 140 ? 0.15 : 1;
  const cara = bebe ? 92 : 80;
  const ojoY = bebe ? 6 : -4, ojoX = bebe ? 34 : 32;
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* Tarjeta */}
      <rect x={-140} y={-150} width={280} height={300} rx={46} fill="#FFF7E6" />
      <rect x={-140} y={-150} width={280} height={300} rx={46} fill="none" stroke="#EADBC0" strokeWidth={4} />
      <clipPath id={`rostro-${quien}`}><rect x={-140} y={-150} width={280} height={300} rx={46} /></clipPath>
      <g clipPath={`url(#rostro-${quien})`}>
        {/* Ropa y cuello */}
        <path d={`M-120,160 C-116,96 -70,${bebe ? 92 : 74} 0,${bebe ? 92 : 74} C70,${bebe ? 92 : 74} 116,96 120,160 Z`} fill={ropa[1]} />
        <path d={`M-120,160 C-118,120 -100,100 -84,92 C-90,120 -92,140 -92,160 Z M120,160 C118,120 100,100 84,92 C90,120 92,140 92,160 Z`} fill={ropa[0]} />
        {!bebe && <rect x={-26} y={44} width={52} height={44} rx={18} fill={piel[0]} />}
        {/* Orejas */}
        <circle cx={-cara + 2} cy={ojoY + 8} r={bebe ? 16 : 18} fill={piel[1]} /><circle cx={cara - 2} cy={ojoY + 8} r={bebe ? 16 : 18} fill={piel[1]} />
        <circle cx={-cara + 4} cy={ojoY + 8} r={8} fill={piel[0]} /><circle cx={cara - 4} cy={ojoY + 8} r={8} fill={piel[0]} />
        {/* Cara */}
        <ellipse cx={0} cy={bebe ? 0 : -6} rx={cara - 6} ry={bebe ? cara - 2 : cara + 6} fill={piel[1]} />
        {/* Pelo */}
        {quien === 'adulto' && <path d="M-74,-30 C-84,-90 -40,-118 6,-116 C40,-116 54,-128 62,-122 C60,-112 70,-104 76,-90 C84,-70 80,-44 74,-30 C66,-56 40,-70 0,-68 C-36,-66 -64,-56 -74,-30 Z" fill={pelo} />}
        {quien === 'adulta' && <path d="M-86,60 C-96,-40 -70,-112 0,-114 C70,-112 96,-40 86,60 C76,30 72,0 70,-30 C50,-60 20,-74 -10,-62 C-40,-50 -64,-40 -70,-20 C-74,10 -76,36 -86,60 Z" fill={pelo} />}
        {bebe && <g><path d="M-6,-86 C-14,-104 4,-116 18,-106 C10,-104 6,-96 10,-88" fill="none" stroke={pelo} strokeWidth={7} strokeLinecap="round" /><path d="M-70,-48 C-60,-96 60,-96 70,-48 C40,-62 -40,-62 -70,-48 Z" fill="#9FD8FF" /><circle cx={0} cy={-88} r={12} fill="#FFFFFF" /></g>}
        {/* Cejas */}
        <path d={`M${-ojoX - 18},${ojoY - 26 - triste * 6} Q${-ojoX},${ojoY - 34} ${-ojoX + 16},${ojoY - 26 + triste * 4}`} fill="none" stroke={pelo} strokeWidth={bebe ? 5 : 9} strokeLinecap="round" />
        <path d={`M${ojoX - 16},${ojoY - 26 + triste * 4} Q${ojoX},${ojoY - 34} ${ojoX + 18},${ojoY - 26 - triste * 6}`} fill="none" stroke={pelo} strokeWidth={bebe ? 5 : 9} strokeLinecap="round" />
        {/* Ojos macizos (con parpadeo) */}
        {[-ojoX, ojoX].map((ex) => <ellipse key={ex} cx={ex} cy={ojoY} rx={bebe ? 10 : 13} ry={(bebe ? 10 : 13) * parpadeo} fill="#3A1250" />)}
        {/* Mejillas, nariz y boca */}
        {bebe && [-ojoX - 8, ojoX + 8].map((ex) => <circle key={ex} cx={ex} cy={ojoY + 30} r={13} fill="#FF8AA8" opacity={0.6} />)}
        <ellipse cx={0} cy={ojoY + 24} rx={bebe ? 9 : 12} ry={bebe ? 7 : 10} fill={piel[0]} />
        <path d={bebe ? `M-12,${ojoY + 46} Q0,${ojoY + 56} 12,${ojoY + 46}` : `M-16,${ojoY + 50 + triste * 6} Q0,${ojoY + 46 - triste * 8} 16,${ojoY + 50 + triste * 6}`} fill="none" stroke={piel[0]} strokeWidth={bebe ? 5 : 7} strokeLinecap="round" />
      </g>
    </En>
  );
}
