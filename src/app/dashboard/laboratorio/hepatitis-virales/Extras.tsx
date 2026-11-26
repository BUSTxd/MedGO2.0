'use client';
// Piezas que comparten varios capítulos del lab «Hepatitis virales» (además de Piezas, Higado y Clinica): animales que respiran y
// parpadean, el mapa del mundo de la referencia (océano turquesa, continentes naranja y verde, marco naranja), el vaso de agua con su
// ola, las heces con sus moscas, el plato de hojas, el filete, una cabecita de multitud y los pequeños símbolos (visto, campana, calendario…).
// Regla del lab: `Txt` recorta `x` al lienzo como si fuera absoluta, así que nunca va dentro de un grupo ya trasladado.

import type { ReactNode } from 'react';
import { parpadeo, clamp, easeBack, easeOut, mezcla, tramo } from './Piezas';

type P2 = [number, number];

/** Un animal con su sombra, que respira, parpadea y mueve la oreja: cerdo, jabalí (oscuro, con colmillos y cresta) o ciervo (con cuernas). */
export function Animal({ x, y, k = 1, o = 1, tipo = 'cerdo', reloj = 0, fase = 0 }: { x: number; y: number; k?: number; o?: number; tipo?: 'cerdo' | 'jabali' | 'ciervo'; reloj?: number; fase?: number }) {
  if (o <= 0.003) return null;
  const resp = 1 + 0.014 * Math.sin(reloj / 650 + fase);
  const par = parpadeo(reloj, fase);
  const c = tipo === 'cerdo' ? ['#D9728C', '#FFB4C6'] : tipo === 'jabali' ? ['#3A2A1E', '#6E5440'] : ['#A5703C', '#D49A60'];
  const oreja = Math.sin(reloj / 1300 + fase * 2) > 0.9 ? 7 : 0;
  const patas = tipo === 'ciervo' ? 84 : 50;
  const ojo = (cx: number, cy: number) => (
    <g><ellipse cx={cx} cy={cy} rx={7} ry={Math.max(0.8, 7 * (1 - par))} fill="#241420" /><circle cx={cx - 2} cy={cy - 2} r={2} fill="#FFF" opacity={1 - par} /></g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${(k * resp).toFixed(3)})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={6} cy={patas + 66} rx={126} ry={13} fill="#000" opacity={0.14} />
      {[-70, -36, 40, 74].map((px, i) => <rect key={i} x={px - 11} y={24} width={22} height={patas + 42} rx={10} fill={i % 2 ? c[0] : c[1]} />)}
      {tipo === 'cerdo'
        ? <path d="M100,-16 C130,-26 134,8 112,8 C98,8 102,-6 116,-2" fill="none" stroke={c[0]} strokeWidth={8} strokeLinecap="round" />
        : <ellipse cx={106} cy={-10} rx={13} ry={10} fill={tipo === 'ciervo' ? '#FFF4E4' : c[0]} />}
      <ellipse cx={0} cy={-2} rx={106} ry={64} fill={c[0]} /><ellipse cx={-4} cy={-7} rx={98} ry={57} fill={c[1]} />
      {tipo === 'jabali' && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-72 + i * 18},-54 l5,-20 l5,20 Z`} fill={c[0]} />)}
      {tipo === 'ciervo' && Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-50 + i * 24} cy={-10 + (i % 2) * 22} r={5} fill="#FFF4E4" opacity={0.85} />)}
      <path d="M-72,-38 C-30,-62 30,-62 72,-38" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.28} />
      {tipo !== 'ciervo' ? (
        <g>
          <circle cx={-112} cy={-18} r={50} fill={c[0]} /><circle cx={-115} cy={-22} r={46} fill={c[1]} />
          <path d={`M-136,-58 L-150,${-92 - oreja} L-112,-70 Z`} fill={c[0]} /><path d={`M-100,-66 L-92,${-100 - oreja} L-72,-58 Z`} fill={c[0]} />
          <ellipse cx={-160} cy={-2} rx={28} ry={21} fill={c[0]} /><ellipse cx={-162} cy={-5} rx={24} ry={18} fill={tipo === 'cerdo' ? '#FF9AB4' : '#8A6A52'} />
          <ellipse cx={-172} cy={-4} rx={4.4} ry={6.4} fill="#4A1E2C" /><ellipse cx={-155} cy={-4} rx={4.4} ry={6.4} fill="#4A1E2C" />
          {tipo === 'jabali' && <g><path d="M-176,10 q-12,12 -2,28 q8,-14 6,-26 Z" fill="#FFF4E4" /><path d="M-150,12 q-4,16 6,26 q4,-14 -2,-26 Z" fill="#FFF4E4" /></g>}
          {ojo(-124, -34)}
        </g>
      ) : (
        <g>
          <path d="M-86,-30 C-104,-64 -118,-92 -126,-118 L-100,-126 C-90,-96 -76,-64 -58,-34 Z" fill={c[0]} />
          <ellipse cx={-130} cy={-124} rx={34} ry={24} fill={c[0]} transform="rotate(-18 -130 -124)" /><ellipse cx={-133} cy={-127} rx={30} ry={20} fill={c[1]} transform="rotate(-18 -133 -127)" />
          <ellipse cx={-160} cy={-116} rx={7} ry={6} fill="#3A2A1E" />
          <path d={`M-110,-140 L-100,${-166 - oreja} L-88,-136 Z`} fill={c[0]} />
          <path d="M-120,-140 C-124,-176 -136,-196 -150,-208 M-124,-168 C-136,-170 -146,-166 -154,-156 M-120,-150 C-108,-186 -96,-200 -84,-212 M-102,-180 C-92,-184 -82,-182 -76,-176" fill="none" stroke="#7A5230" strokeWidth={7} strokeLinecap="round" />
          {ojo(-138, -128)}
        </g>
      )}
    </g>
  );
}

/** Proyección plana (lon, lat → px) del `MapaMundi`, con el centro del mapa en (0, 0): para colocar pines y marcas. Rango útil: −58° a 84°. */
export function proyecta(lon: number, lat: number, w = 1300): P2 {
  const h = (142 / 360) * w;
  return [(lon / 360) * w, ((84 - lat) / 142) * h - h / 2];
}

const CONTINENTES: P2[][] = [
  [[-168, 66], [-156, 71], [-125, 70], [-95, 72], [-80, 73], [-62, 66], [-55, 52], [-66, 45], [-76, 38], [-81, 30], [-80, 25], [-90, 30], [-97, 26], [-105, 22], [-110, 24], [-117, 32], [-124, 40], [-125, 49], [-135, 57], [-152, 59], [-165, 60]],
  [[-73, 78], [-55, 82], [-22, 82], [-20, 72], [-42, 60], [-55, 65], [-68, 70]],
  [[-80, 10], [-72, 12], [-62, 10], [-50, 0], [-35, -6], [-39, -18], [-48, -26], [-58, -35], [-66, -45], [-69, -54], [-74, -50], [-73, -38], [-71, -20], [-76, -14], [-81, -5], [-79, 2]],
  [[-10, 36], [-9, 43], [-2, 48], [2, 51], [8, 54], [10, 58], [20, 62], [28, 70], [40, 68], [40, 56], [30, 46], [28, 41], [24, 37], [15, 38], [8, 42], [0, 38]],
  [[-17, 21], [-16, 28], [-6, 36], [10, 37], [22, 33], [32, 31], [35, 25], [43, 12], [51, 12], [42, -3], [40, -15], [35, -25], [27, -34], [18, -34], [12, -18], [9, -1], [8, 5], [-8, 4], [-17, 14]],
  [[28, 41], [40, 56], [40, 68], [60, 70], [80, 74], [110, 76], [140, 72], [170, 68], [180, 65], [160, 58], [142, 52], [135, 44], [122, 40], [122, 30], [110, 20], [106, 10], [100, 3], [98, 15], [90, 22], [80, 12], [72, 20], [67, 25], [57, 25], [50, 28], [44, 36], [36, 34], [34, 38]],
  [[114, -22], [122, -18], [136, -12], [146, -18], [153, -27], [148, -38], [138, -35], [115, -34]],
];

/** El mapa del mundo de la referencia: océano turquesa con su cuadrícula, continentes naranja con el interior verde y marco naranja de rayas.
 *  Los hijos (pines, rótulos) van en coordenadas de `proyecta`, con el centro del mapa en (0, 0). */
export function MapaMundi({ x, y, w = 1300, k = 1, o = 1, p = 1, children }: { x: number; y: number; w?: number; k?: number; o?: number; p?: number; children?: ReactNode }) {
  if (p <= 0.003 || o <= 0.003) return null;
  const h = (142 / 360) * w;
  const poli = (pts: P2[], esc = 1) => {
    const q = pts.map(([lo, la]) => proyecta(lo, la, w));
    const cx = q.reduce((s, a) => s + a[0], 0) / q.length, cy = q.reduce((s, a) => s + a[1], 0) / q.length;
    return 'M' + q.map(([a, b]) => `${(cx + (a - cx) * esc).toFixed(1)},${(cy + (b - cy) * esc).toFixed(1)}`).join(' L') + ' Z';
  };
  return (
    <g transform={`translate(${x},${y}) scale(${(k * (0.94 + 0.06 * easeOut(clamp(p)))).toFixed(3)})`} opacity={(o < 1 ? o : 1) * tramo(p, 0, 0.4)}>
      <rect x={-w / 2 - 18 + 10} y={-h / 2 - 18 + 14} width={w + 36} height={h + 36} rx={34} fill="#000" opacity={0.16} />
      <rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx={34} fill="#F7B44A" />
      <rect x={-w / 2 - 12} y={-h / 2 - 12} width={w + 24} height={h + 24} rx={28} fill="none" stroke="#FFF4D8" strokeWidth={5} strokeDasharray="22 16" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#0FA9AE" />
      {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={-w / 2 + (i + 1) * (w / 12)} x2={-w / 2 + (i + 1) * (w / 12)} y1={-h / 2} y2={h / 2} stroke="#FFF" strokeWidth={2} opacity={0.12} />)}
      {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} y1={-h / 2 + (i + 1) * (h / 6)} y2={-h / 2 + (i + 1) * (h / 6)} x1={-w / 2} x2={w / 2} stroke="#FFF" strokeWidth={2} opacity={0.12} />)}
      {CONTINENTES.map((c, i) => (
        <g key={i}>
          <path d={poli(c, 1.04)} fill="#0B8A92" transform="translate(5,7)" />
          <path d={poli(c)} fill="#F29A36" stroke="#F29A36" strokeWidth={6} strokeLinejoin="round" />
          <path d={poli(c, 0.82)} fill="#7CCB4A" stroke="#7CCB4A" strokeWidth={4} strokeLinejoin="round" />
        </g>
      ))}
      {children}
    </g>
  );
}

/** Un vaso de agua con su ola. `sucia` 0-1 la enturbia; los hijos (virus) flotan dentro, en coordenadas locales. */
export function VasoAgua({ x, y, k = 1, o = 1, reloj = 0, sucia = 0, children }: { x: number; y: number; k?: number; o?: number; reloj?: number; sucia?: number; children?: ReactNode }) {
  if (o <= 0.003) return null;
  const ola = 5 * Math.sin(reloj / 500), ola2 = 4 * Math.sin(reloj / 430 + 1.4);
  const a0 = mezcla('#3E9ADA', '#85733A', sucia), a1 = mezcla('#8AD0FF', '#C9B36E', sucia);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={8} cy={152} rx={92} ry={13} fill="#000" opacity={0.14} />
      <path d="M-80,-120 L80,-120 L62,140 Q60,150 48,150 L-48,150 Q-60,150 -62,140 Z" fill="#CFEFFF" opacity={0.5} />
      <path d={`M-72,${-52 + ola} Q-36,${-64 + ola} 0,${-52 + ola2} T72,${-52 + ola} L58,136 Q56,144 46,144 L-46,144 Q-56,144 -58,136 Z`} fill={a0} />
      <path d={`M-66,${-46 + ola} Q-34,${-56 + ola} 0,${-46 + ola2} T66,${-46 + ola} L54,128 Q52,136 44,136 L-44,136 Q-52,136 -54,128 Z`} fill={a1} opacity={0.9} />
      {sucia > 0.02 && Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-40 + ((i * 37) % 80)} cy={-20 + ((i * 53) % 130) + 3 * Math.sin(reloj / 600 + i)} r={4 + (i % 3) * 2} fill="#5A4A22" opacity={0.5 * sucia} />)}
      {children}
      <path d="M-62,-104 L-50,120" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.55} />
      <ellipse cx={0} cy={-120} rx={80} ry={11} fill="#EAF8FF" opacity={0.7} />
    </g>
  );
}

/** Heces con sus tres vueltas y dos moscas que zumban alrededor. */
export function Heces({ x, y, k = 1, o = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={6} cy={58} rx={78} ry={11} fill="#000" opacity={0.14} />
      <ellipse cx={0} cy={36} rx={68} ry={26} fill="#5A3416" /><ellipse cx={-3} cy={32} rx={64} ry={23} fill="#8A5428" />
      <ellipse cx={0} cy={6} rx={50} ry={23} fill="#5A3416" /><ellipse cx={-3} cy={2} rx={46} ry={20} fill="#9A6234" />
      <path d="M-28,-14 C-30,-34 -4,-52 10,-58 C8,-44 24,-32 24,-16 C24,-6 -28,-4 -28,-14 Z" fill="#5A3416" /><path d="M-24,-16 C-24,-32 -2,-46 8,-50 C8,-38 20,-30 20,-18 C20,-10 -24,-8 -24,-16 Z" fill="#A66E3A" />
      <path d="M-40,24 C-20,14 20,14 44,22" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.3} />
      {[0, 1].map((i) => {
        const a = reloj / (230 + i * 90) + i * 2.4, fx = Math.cos(a) * (62 + 16 * i), fy = -20 + Math.sin(a * 1.3) * (36 + 10 * i);
        return <g key={i} transform={`translate(${fx.toFixed(1)},${fy.toFixed(1)})`}><ellipse rx={9} ry={6} fill="#2A2030" /><ellipse cx={-4} cy={-6} rx={9} ry={4} fill="#DDEEFF" opacity={0.7} transform={`rotate(${(Math.sin(reloj / 22 + i) * 20).toFixed(0)})`} /></g>;
      })}
    </g>
  );
}

/** Un plato con hojas verdes. */
export function Plato({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={8} cy={40} rx={112} ry={30} fill="#000" opacity={0.14} />
      <ellipse cx={0} cy={30} rx={112} ry={32} fill="#C9C2D6" /><ellipse cx={-2} cy={24} rx={106} ry={28} fill="#F4F0FA" /><ellipse cx={-2} cy={22} rx={74} ry={18} fill="#E4DEEE" />
      {[[-48, 2, -20], [0, -8, 6], [46, 4, 24], [-14, 12, -6]].map(([lx, ly, r], i) => (
        <g key={i} transform={`translate(${lx},${ly}) rotate(${r})`}>
          <path d="M-34,10 C-40,-30 0,-48 30,-30 C46,-10 24,24 -34,10 Z" fill="#2F8F3A" /><path d="M-30,8 C-34,-24 -2,-40 24,-26 C38,-10 20,18 -30,8 Z" fill="#5BC95A" />
          <path d="M-30,8 C-10,-6 10,-14 24,-26" fill="none" stroke="#2F8F3A" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/** Un filete a la plancha con su borde de grasa y sus marcas. */
export function Filete({ x, y, k = 1, o = 1, cocido = 0 }: { x: number; y: number; k?: number; o?: number; cocido?: number }) {
  if (o <= 0.003) return null;
  const c0 = mezcla('#B2243C', '#6A3A22', cocido), c1 = mezcla('#F0607A', '#A8683A', cocido);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={8} cy={58} rx={96} ry={14} fill="#000" opacity={0.14} />
      <path d="M-84,0 C-92,-44 -30,-62 30,-56 C84,-50 100,-8 78,28 C56,58 -24,62 -62,42 C-80,32 -84,14 -84,0 Z" fill="#F4E6D4" />
      <path d="M-76,2 C-82,-36 -28,-52 28,-46 C74,-42 88,-8 70,22 C52,48 -22,52 -54,36 C-70,28 -76,14 -76,2 Z" fill={c0} />
      <path d="M-68,0 C-72,-30 -26,-44 26,-40 C66,-36 78,-8 62,18 C46,40 -20,44 -48,30 C-62,24 -68,12 -68,0 Z" fill={c1} />
      {[-40, -10, 20, 48].map((dx, i) => <path key={i} d={`M${dx - 14},-30 L${dx + 20},20`} stroke="#5A2A18" strokeWidth={6} strokeLinecap="round" opacity={0.28 + 0.4 * cocido} />)}
      <circle cx={-34} cy={-14} r={5} fill="#FFF" opacity={0.5} />
    </g>
  );
}

/** Una cabecita de multitud: cabeza y hombros; `amarillo` 0-1 la pone ictérica. Se mece sola. */
export function Cabecita({ x, y, k = 1, o = 1, amarillo = 0, reloj = 0, fase = 0 }: { x: number; y: number; k?: number; o?: number; amarillo?: number; reloj?: number; fase?: number }) {
  if (o <= 0.003) return null;
  const piel = mezcla('#C98A5E', '#E8B820', amarillo), piel2 = mezcla('#F0B88A', '#FFD84A', amarillo);
  const ropa = ['#2A9D8F', '#5CC8BA'];
  const b = 3 * Math.sin(reloj / 700 + fase);
  return (
    <g transform={`translate(${x},${y + b}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={5} cy={46} rx={40} ry={7} fill="#000" opacity={0.14} />
      <path d="M-34,44 C-34,12 -18,6 0,6 C18,6 34,12 34,44 Z" fill={ropa[0]} /><path d="M-30,42 C-30,16 -16,10 -2,10 C14,10 30,16 30,42 Z" fill={ropa[1]} />
      <circle cx={2} cy={-14} r={24} fill={piel} /><circle cx={0} cy={-16} r={22} fill={piel2} />
      <circle cx={-8} cy={-18} r={2.6} fill="#2A1A22" /><circle cx={8} cy={-18} r={2.6} fill="#2A1A22" />
      <path d="M-14,-34 C-6,-46 10,-46 16,-32 C8,-38 -4,-38 -14,-34 Z" fill="#3A2A22" />
    </g>
  );
}

// ─── Símbolos pequeños (movidos del capítulo 5) ──────────────────────────────

/** Dos flechas circulares que giran: «trabajando». */
export function Trabaja({ x, y, R = 90, reloj, p = 1, color = '#2FA84F' }: { x: number; y: number; R?: number; reloj: number; p?: number; color?: string }) {
  if (p <= 0.003) return null;
  const arco = (a0: number) => {
    const rad = (g: number) => (g * Math.PI) / 180, a1 = a0 + 110;
    const [x0, y0, x1, y1] = [Math.cos(rad(a0)) * R, Math.sin(rad(a0)) * R, Math.cos(rad(a1)) * R, Math.sin(rad(a1)) * R];
    const tx = -Math.sin(rad(a1)), ty = Math.cos(rad(a1)), nx = Math.cos(rad(a1)), ny = Math.sin(rad(a1));
    const punta = `${x1 + tx * 22},${y1 + ty * 22} ${x1 + nx * 13},${y1 + ny * 13} ${x1 - nx * 13},${y1 - ny * 13}`;
    return <g key={a0}><path d={`M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}`} fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" /><polygon points={punta} fill={color} /></g>;
  };
  return <g transform={`translate(${x},${y}) rotate(${((reloj / 9) % 360).toFixed(1)})`} opacity={tramo(p, 0, 0.4)}>{arco(0)}{arco(180)}</g>;
}

/** Un visto bueno verde. */
export function Visto({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  if (p <= 0.003) return null;
  const q = easeBack(clamp(p));
  return (
    <g transform={`translate(${x},${y}) scale(${(k * q).toFixed(3)})`}>
      <circle cx={3} cy={4} r={28} fill="#000" opacity={0.16} />
      <circle r={28} fill="#1FA85A" /><circle cx={-2} cy={-2} r={24} fill="#3FD467" />
      <path d="M-12,1 L-4,10 L13,-9" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Una bolita numerada de la cascada de la coagulación. */
export function Fact({ x, y, R = 50, tono, txt, p = 1, t = 34, k = 1, o = 1 }: { x: number; y: number; R?: number; tono: readonly string[]; txt: string; p?: number; t?: number; k?: number; o?: number }) {
  if (p <= 0.003) return null;
  const q = easeBack(clamp(p)) * k;
  return (
    <g transform={`translate(${x},${y}) scale(${q.toFixed(3)})`} opacity={o * tramo(p, 0, 0.3)}>
      <circle cx={4} cy={7} r={R} fill="#000" opacity={0.15} />
      <circle r={R} fill={tono[0]} /><circle cx={-R * 0.07} cy={-R * 0.07} r={R * 0.9} fill={tono[1]} /><circle cx={-R * 0.36} cy={-R * 0.38} r={R * 0.2} fill="#FFF" opacity={0.7} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: t, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{txt}</text>
    </g>
  );
}

/** Un calendario con su número grande. */
export function Calendario({ x, y, k = 1, o = 1, n, unidad = 'días' }: { x: number; y: number; k?: number; o?: number; n: string; unidad?: string }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <rect x={-68} y={-56} width={150} height={136} rx={16} fill="#000" opacity={0.16} />
      <rect x={-76} y={-66} width={152} height={136} rx={16} fill="#FFF8F0" />
      <path d="M-76,-50 a16,16 0 0 1 16,-16 h120 a16,16 0 0 1 16,16 v22 h-152 Z" fill="#E5324C" />
      <circle cx={-40} cy={-66} r={8} fill="#7A1230" /><circle cx={40} cy={-66} r={8} fill="#7A1230" />
      <text y={26} textAnchor="middle" dy="0.36em" style={{ fontSize: 66, fontWeight: 800, fill: '#7A1230', fontFamily: 'inherit' }}>{n}</text>
      <text y={64} textAnchor="middle" dy="0.36em" style={{ fontSize: 26, fontWeight: 800, fill: '#B23A5E', fontFamily: 'inherit' }}>{unidad}</text>
    </g>
  );
}

/** Una campana que suena (se sacude cuando `suena` > 0). */
export function Campana({ x, y, k = 1, o = 1, suena = 0, reloj = 0 }: { x: number; y: number; k?: number; o?: number; suena?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  const a = suena * 16 * Math.sin(reloj / 55);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <g transform={`rotate(${a.toFixed(1)} 0 -60)`}>
        <ellipse cx={4} cy={70} rx={62} ry={12} fill="#000" opacity={0.14} />
        <path d="M-58,50 C-58,-8 -40,-56 0,-62 C40,-56 58,-8 58,50 Z" fill="#C99300" /><path d="M-54,46 C-54,-6 -36,-52 -2,-58 C34,-52 52,-6 52,46 Z" fill="#FFD23F" />
        <rect x={-66} y={44} width={132} height={16} rx={8} fill="#C99300" /><rect x={-64} y={42} width={128} height={12} rx={6} fill="#FFE98A" />
        <circle cx={0} cy={-68} r={9} fill="#C99300" /><circle cy={74} r={12} fill="#7A5A00" />
        <path d="M-34,-6 C-32,-30 -22,-44 -8,-50" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      </g>
    </g>
  );
}

/** Una banda adhesiva sobre una célula. */
export function Banda({ x, y, r = -30, k = 1, p = 1 }: { x: number; y: number; r?: number; k?: number; p?: number }) {
  if (p <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${(k * easeBack(clamp(p))).toFixed(3)})`}>
      <rect x={-72} y={-24} width={150} height={52} rx={22} fill="#000" opacity={0.15} />
      <rect x={-78} y={-30} width={156} height={52} rx={22} fill="#E8B27A" /><rect x={-34} y={-30} width={68} height={52} fill="#F6D0A6" />
      {[-20, -6, 8, 22].map((dy, i) => <circle key={i} cx={(i % 2 ? 8 : -8) + 0} cy={-14 + i * 9} r={2.6} fill="#B5824F" />)}
    </g>
  );
}

// ─── Compartidas por los capítulos 15 a 22 ───────────────────────────────────

/** Una tacha roja que se dibuja (el «no» de lo descartado). */
export function Tacha({ x, y, r = 46, p = 1 }: { x: number; y: number; r?: number; p?: number }) {
  if (p <= 0.003) return null;
  return <path d={`M${x - r},${y - r} L${x + r},${y + r} M${x + r},${y - r} L${x - r},${y + r}`} stroke="#E5324C" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(clamp(p)).toFixed(3)} 1`} opacity={0.95} />;
}

/** Un tumor: racimo de bolas magenta oscuro con su brillo y su resplandor. */
export function Tumor({ x, y, k = 1, o = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <circle r={78 + 4 * Math.sin(reloj / 900 * 6.28 / 6.28)} fill="#7A1260" opacity={0.2} />
      {[[-26, -10, 38], [24, -16, 34], [0, 22, 40], [34, 20, 28], [-34, 24, 26]].map(([cx, cy, R], i) => <g key={i}><circle cx={cx + 3} cy={cy + 5} r={R} fill="#000" opacity={0.18} /><circle cx={cx} cy={cy} r={R} fill="#6A0F58" /><circle cx={cx - 3} cy={cy - 3} r={R - 6} fill="#B03A8C" /><circle cx={cx - R * 0.4} cy={cy - R * 0.4} r={R * 0.2} fill="#FFF" opacity={0.6} /></g>)}
    </g>
  );
}

/** Una lucecita de tablero: encendida (color, con su brillo que late) o apagada (gris), con su signo + − ?. */
export function Luz({ x, y, on, col, signo, q = 1, reloj = 0 }: { x: number; y: number; on: number; col: string; signo: '+' | '−' | '?'; q?: number; reloj?: number }) {
  if (q <= 0.003) return null;
  const luz = clamp(on) * (0.75 + 0.25 * Math.sin(reloj / 900 * 6.28));
  return (
    <g transform={`translate(${x},${y}) scale(${(easeBack(clamp(q))).toFixed(3)})`}>
      <circle r={44} fill={col} opacity={0.28 * luz} />
      <circle cx={3} cy={5} r={30} fill="#000" opacity={0.18} />
      <circle r={30} fill={on > 0.5 ? col : '#8A8496'} /><circle cx={-3} cy={-3} r={26} fill={on > 0.5 ? '#FFF' : '#B8B2C6'} opacity={on > 0.5 ? 0.3 : 0.85} />
      <circle cx={-9} cy={-10} r={6} fill="#FFF" opacity={0.7} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: on > 0.5 ? '#FFF' : '#6E6478', fontFamily: 'inherit' }}>{signo}</text>
    </g>
  );
}

/** Un hilo que sale de un rótulo y señala la pieza: la línea crece hasta ella y termina en un punto. `p` 0-1. */
export function Hilo({ a, b, p, color = '#0B7A4A', w = 4 }: { a: P2; b: P2; p: number; color?: string; w?: number }) {
  if (p <= 0.01) return null;
  const q = easeOut(clamp(p)), x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q;
  return (
    <g opacity={tramo(p, 0, 0.2)}>
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <circle cx={x} cy={y} r={w + 3} fill={color} />
    </g>
  );
}

/** Un tachón: una línea roja que cruza un texto de izquierda a derecha. `p` 0-1. */
export function Tachon({ x1, x2, y, p, color = '#E5324C', w = 7 }: { x1: number; x2: number; y: number; p: number; color?: string; w?: number }) {
  if (p <= 0.01) return null;
  return <line x1={x1} y1={y} x2={x1 + (x2 - x1) * easeOut(clamp(p))} y2={y} stroke={color} strokeWidth={w} strokeLinecap="round" />;
}

/** Una persona de pictograma, como las de la referencia de la multitud: cabeza, camisa, piernas y su sombra sobre el suelo. */
export function Gente({ x, y, col, k = 1, o = 1, piel = '#F3C9A0' }: { x: number; y: number; col: string; k?: number; o?: number; piel?: string }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
      <ellipse cy={52} rx={30} ry={9} fill="#000" opacity={0.13} />
      <rect x={-14} y={22} width={10} height={30} rx={4} fill="#2F4F7A" /><rect x={4} y={22} width={10} height={30} rx={4} fill="#2F4F7A" />
      <path d="M-22,24 C-22,-2 -12,-8 0,-8 C12,-8 22,-2 22,24 Z" fill={col} />
      <circle cy={-24} r={14} fill={piel} /><circle cx={-5} cy={-27} r={3.4} fill="#FFF" opacity={0.5} />
    </g>
  );
}
