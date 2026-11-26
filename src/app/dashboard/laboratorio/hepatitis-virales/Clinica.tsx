'use client';
// Piezas clínicas: la pantalla de ecografía, las barras del laboratorio, el frasco de orina y las curvas. Todo en el
// estilo plano de las referencias (rótulos sólidos, sombras en media luna) y vivo: el barrido de la ecografía, la
// brillantina de las barras, las curvas que se dibujan.

import { useId, type ReactNode } from 'react';
import { En, Txt, clamp, easeBack, easeOut, hash, lerp, tramo } from './Piezas';
import { H, onda, type P2, type Tono } from './Piezas';

/** Pantalla de ecografía (modo B): un abanico gris con granulado que centellea, un barrido que gira y, si `nodulo` > 0, una masa
 *  redonda de bordes definidos y contenido heterogéneo en `nx, ny`. `brillo` (0-1) aclara el parénquima (hiperecogénico) y `heter` le
 *  da textura irregular. Origen en el centro de la pantalla. */
export function Eco({ x = 0, y = 0, w = 520, h = 360, k = 1, o = 1, reloj = 0, nodulo = 0, nx = 40, ny = 40, brillo = 0, heter = 0, riñon = false }: { x?: number; y?: number; w?: number; h?: number; k?: number; o?: number; reloj?: number; nodulo?: number; nx?: number; ny?: number; brillo?: number; heter?: number; riñon?: boolean }) {
  const id = `eco-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const g = lerp(0.55, 0.9, clamp(brillo));
  const gris = (v: number) => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 262 > 255 ? 255 : v * 262)})`;
  const barrido = -0.55 + 1.1 * ((reloj / 2600) % 1);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-w / 2 + 12} y={-h / 2 + 16} width={w} height={h} rx={26} fill="#000" opacity={0.2} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#1B2744" />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={18} fill="#0B1226" />
      <defs>
        <radialGradient id={`${id}-g`} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor={gris(g)} /><stop offset="0.6" stopColor={gris(g * 0.7)} /><stop offset="1" stopColor={gris(g * 0.3)} />
        </radialGradient>
        <clipPath id={`${id}-c`}><path d={`M0,${-h / 2 + 24} L${-w * 0.42},${h / 2 - 24} A${w * 0.6},${w * 0.6} 0 0 0 ${w * 0.42},${h / 2 - 24} Z`} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={`url(#${id}-g)`} />
        {Array.from({ length: 70 }, (_, i) => {
          const px = (hash(i, 3) - 0.5) * w * 0.8, py = -h / 2 + 30 + hash(i, 4) * (h - 60);
          const tw = 0.25 + 0.25 * Math.sin(reloj / (260 + hash(i, 5) * 300) + i);
          return <circle key={i} cx={px} cy={py} r={2 + hash(i, 6) * (2 + 3 * heter)} fill="#FFF" opacity={tw * (0.5 + 0.8 * heter)} />;
        })}
        {riñon && <ellipse cx={w * 0.2} cy={h * 0.18} rx={64} ry={30} fill="#0B1226" opacity={0.6} />}
        {nodulo > 0.02 && (
          <g transform={`translate(${nx},${ny}) scale(${easeBack(clamp(nodulo)).toFixed(3)})`}>
            <ellipse rx={58} ry={50} fill="#0B1226" opacity={0.55} />
            <ellipse rx={54} ry={46} fill={gris(0.62)} />
            {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(hash(i, 9) - 0.5) * 80} cy={(hash(i, 10) - 0.5) * 66} r={3 + hash(i, 11) * 5} fill={i % 3 ? '#FFF' : '#0B1226'} opacity={0.3 + 0.2 * Math.sin(reloj / 500 + i)} />)}
            <ellipse rx={54} ry={46} fill="none" stroke="#FFF" strokeWidth={3} opacity={0.5} />
          </g>
        )}
        <path d={`M0,${-h / 2 + 24} L${(barrido * w * 0.9).toFixed(1)},${h / 2 - 24}`} stroke="#7FE8FF" strokeWidth={4} opacity={0.4} />
      </g>
      <path d={`M0,${-h / 2 + 24} L${-w * 0.42},${h / 2 - 24} A${w * 0.6},${w * 0.6} 0 0 0 ${w * 0.42},${h / 2 - 24} Z`} fill="none" stroke="#3A5A88" strokeWidth={3} opacity={0.7} />
      {[0, 1, 2].map((i) => <circle key={i} cx={w / 2 - 36 - i * 24} cy={-h / 2 + 28} r={6} fill={i === 0 ? '#44E08A' : '#3A5A88'} />)}
    </En>
  );
}

/** Barra vertical de laboratorio que crece con `p`: un valor, su límite normal en línea discontinua y su nombre debajo. `val` y `norm`
 *  en la misma unidad que `max` (la altura total). La cifra se cuenta hasta `valor` mientras sube. */
export function BarraLab({ x, y, w = 96, alto = 300, val, max, norm, color = H.hep[1], oscuro = H.hep[0], p = 1, nombre, valor, unidad, t = 30 }: { x: number; y: number; w?: number; alto?: number; val: number; max: number; norm?: number; color?: string; oscuro?: string; p?: number; nombre: string; valor: string; unidad?: string; t?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p)), hh = (val / max) * alto * q;
  return (
    <>
    <En x={x} y={y} o={tramo(p, 0, 0.25)}>
      <rect x={-w / 2 + 6} y={-alto} width={w} height={alto} rx={w / 2} fill="#000" opacity={0.1} />
      <rect x={-w / 2} y={-alto} width={w} height={alto} rx={w / 2} fill="#FFF" opacity={0.28} />
      <rect x={-w / 2 + 5} y={-hh} width={w} height={hh} rx={Math.min(w / 2, hh / 2)} fill={oscuro} opacity={hh > 2 ? 1 : 0} />
      <rect x={-w / 2} y={-hh} width={w} height={hh} rx={Math.min(w / 2, hh / 2)} fill={color} opacity={hh > 2 ? 1 : 0} />
      {hh > 20 && <rect x={-w / 2 + 10} y={-hh + 12} width={9} height={Math.max(0, hh - 36)} rx={4.5} fill="#FFF" opacity={0.45} />}
      {norm !== undefined && <g>
        <line x1={-w / 2 - 16} x2={w / 2 + 16} y1={-(norm / max) * alto} y2={-(norm / max) * alto} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="4 9" strokeLinecap="round" opacity={0.8} />
      </g>}
    </En>
    <Txt x={x} y={y - hh - 26} txt={valor} t={t} p={tramo(p, 0.3, 0.7)} />
    {unidad && <Txt x={x} y={y - hh - 26 - t * 0.95} txt={unidad} t={t * 0.62} p={tramo(p, 0.3, 0.7)} fuerte={false} />}
    <Txt x={x} y={y + 36} txt={nombre} t={t * 0.95} p={tramo(p, 0, 0.4)} />
    </>
  );
}

/** Frasco de orina: claro a oscuro («té cargado»), con espuma y el brillo del vidrio. */
export function FrascoOrina({ x = 0, y = 0, k = 1, o = 1, oscuro = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; oscuro?: number; reloj?: number }) {
  const c = clamp(oscuro);
  const col = (a: number, b: number, c3: number) => `rgb(${Math.round(lerp(a, 90, c))},${Math.round(lerp(b, 40, c))},${Math.round(lerp(c3, 6, c))})`;
  const nivel = 150 + 2 * Math.sin(reloj / 700);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-44} y={-110} width={88} height={226} rx={26} fill="#FFF" opacity={0.35} transform="translate(8,10)" />
      <rect x={-44} y={-110} width={88} height={226} rx={26} fill="#E8F6FF" />
      <rect x={-38} y={-60 + (150 - nivel)} width={76} height={170 + (nivel - 150)} rx={20} fill={col(255, 214, 70)} />
      <rect x={-38} y={-60 + (150 - nivel)} width={76} height={26} rx={13} fill={col(255, 236, 140)} opacity={0.7} />
      <rect x={-52} y={-128} width={104} height={30} rx={10} fill="#2F55E0" /><rect x={-52} y={-128} width={104} height={20} rx={10} fill="#5F85FF" />
      <rect x={-30} y={-96} width={11} height={190} rx={5.5} fill="#FFF" opacity={0.65} />
      {c > 0.4 && [0, 1, 2].map((i) => <circle key={i} cx={-18 + i * 18} cy={-52 + 2 * Math.sin(reloj / 400 + i)} r={7 - i} fill="#FFF" opacity={0.5 * c} />)}
    </En>
  );
}

/** Curva de un marcador sobre un eje: se dibuja con `p` (de izquierda a derecha) como una cuerda gruesa con su brillo. `pts` en el
 *  sistema de la pieza (el origen es el extremo izquierdo del eje). */
export function Curva({ x = 0, y = 0, pts, color, oscuro, p = 1, grosor = 12, o = 1 }: { x?: number; y?: number; pts: P2[]; color: string; oscuro?: string; p?: number; grosor?: number; o?: number }) {
  if (p <= 0.003 || pts.length < 2) return null;
  const d = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
  let largo = 0;
  for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const da = `${(largo * clamp(p)).toFixed(0)} ${(largo * 2).toFixed(0)}`;
  const fin = pts.reduce((acc, _, i) => acc, 0);
  void fin;
  return (
    <En x={x} y={y} o={o}>
      <path d={d} fill="none" stroke={oscuro ?? color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da} transform="translate(0,5)" opacity={0.9} />
      <path d={d} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da} />
      <path d={d} fill="none" stroke="#FFF" strokeWidth={grosor * 0.22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={da} opacity={0.55} transform="translate(0,-3)" />
    </En>
  );
}

/** Eje temporal con muescas: una línea gruesa con puntas y marcas en las posiciones dadas. */
export function Eje({ x = 0, y = 0, w = 800, alto = 0, o = 1, p = 1, marcas = [] }: { x?: number; y?: number; w?: number; alto?: number; o?: number; p?: number; marcas?: { u: number; txt?: string }[] }) {
  if (p <= 0.003) return null;
  return (
    <>
    <En x={x} y={y} o={o}>
      <path d={`M0,0 L${(w * clamp(p)).toFixed(1)},0`} stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      {alto > 0 && <path d={`M0,0 L0,${-alto * clamp(p)}`} stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" opacity={0.85} />}
      {marcas.map((m, i) => (
        <g key={i} opacity={tramo(p, m.u - 0.05, m.u + 0.05)}>
          <line x1={w * m.u} x2={w * m.u} y1={-9} y2={9} stroke="var(--cit-flecha)" strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
    </En>
    {marcas.map((m, i) => m.txt ? <Txt key={i} x={x + w * m.u} y={y + 32} txt={m.txt} t={24} fuerte={false} p={tramo(p, m.u - 0.05, m.u + 0.05) * o} /> : null)}
    </>
  );
}

export type { Tono };
export { onda };

// ─── Del microscopio y de las referencias de presentación ────────────────────

/** El campo del microscopio de la referencia «E. coli bajo el microscopio»: un círculo de luz crema que se apaga en un viñeteado
 *  oscuro, con grano de vídeo antiguo y líneas de barrido. Los hijos se pintan dentro, recortados. `R` es el radio de la luz. */
export function Ocular({ x, y, R = 330, o = 1, reloj = 0, id, children }: { x: number; y: number; R?: number; o?: number; reloj?: number; id: string; children?: ReactNode }) {
  if (o <= 0.003) return null;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <defs>
        <radialGradient id={`${id}-v`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF8D2" /><stop offset="0.62" stopColor="#FFF2BE" /><stop offset="0.88" stopColor="#D9A8B8" /><stop offset="1" stopColor="#3A1A56" />
        </radialGradient>
        <clipPath id={`${id}-c`}><circle cx={x} cy={y} r={R * 1.12} /></clipPath>
      </defs>
      <circle cx={x + 10} cy={y + 14} r={R * 1.12} fill="#000" opacity={0.22} />
      <circle cx={x} cy={y} r={R * 1.12} fill={`url(#${id}-v)`} />
      <g clipPath={`url(#${id}-c)`}>{children}</g>
      <g clipPath={`url(#${id}-c)`} opacity={0.5}>
        {Array.from({ length: 26 }, (_, i) => <rect key={i} x={x - R * 1.2} y={y - R * 1.12 + i * (R * 2.24 / 26)} width={R * 2.4} height={1.6} fill="#2A0F4A" opacity={0.18} />)}
        {Array.from({ length: 50 }, (_, i) => <circle key={`g${i}`} cx={x + (hash(i, 51) - 0.5) * R * 2.2} cy={y + (hash(i, 52) - 0.5) * R * 2.2} r={1.6} fill="#2A0F4A" opacity={0.12 + 0.1 * Math.sin(reloj / 90 + i)} />)}
      </g>
    </g>
  );
}

/** Dos barras como la referencia «ratio de supervivencia»: fondo partido (rosa y celeste), barras con su porcentaje en blanco y etiquetas
 *  sólidas debajo. `a` y `b` van de 0 a 1 (cuánto está llena la parte de color de cada barra). */
export function BarrasPct({ x, y, w = 900, h = 560, a, b, pa = 1, pb = 1, colA = '#4A1E6E', colB = '#14B870', txtA, txtB, valA, valB, titulo, pt = 1 }: { x: number; y: number; w?: number; h?: number; a: number; b: number; pa?: number; pb?: number; colA?: string; colB?: string; txtA: string; txtB: string; valA: string; valB: string; titulo?: string; pt?: number }) {
  const alto = h - 190, bw = 150;
  const barra = (cx: number, frac: number, p: number, color: string, resto: string, val: string, txt: string, etq: string) => {
    const q = easeOut(clamp(p)), top = -h / 2 + 110;
    const hf = alto * frac * q;
    return (
      <g opacity={tramo(p, 0, 0.3)}>
        <rect x={cx - bw / 2} y={top} width={bw} height={alto} rx={10} fill={resto} />
        <rect x={cx - bw / 2} y={top + alto - hf} width={bw} height={hf} rx={10} fill={color} />
        <rect x={cx - bw / 2 + 8} y={top + alto - hf + 8} width={10} height={Math.max(0, hf - 24)} rx={5} fill="#FFF" opacity={0.3} />
        <text x={cx} y={frac < 0.2 ? top + alto - hf - 26 : top + alto - hf / 2} dy="0.36em" textAnchor="middle" opacity={tramo(p, 0.4, 0.9)} style={{ fontSize: 40, fontWeight: 800, fill: frac < 0.2 ? color : '#FFF', fontFamily: 'inherit' }}>{val}</text>
        <rect x={cx - 120} y={top + alto + 24} width={240} height={46} rx={6} fill={etq} />
        <text x={cx} y={top + alto + 47} dy="0.36em" textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{txt}</text>
      </g>
    );
  };
  return (
    <En x={x} y={y}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={34} fill="#000" opacity={0.16} />
      <rect x={-w / 2} y={-h / 2} width={w / 2} height={h} rx={34} fill="#FFD6F0" /><rect x={-w / 4} y={-h / 2} width={w / 4} height={h} fill="#FFD6F0" />
      <rect x={0} y={-h / 2} width={w / 2} height={h} rx={34} fill="#C8F8F4" /><rect x={0} y={-h / 2} width={w / 4} height={h} fill="#C8F8F4" />
      {titulo && <g opacity={tramo(pt, 0, 0.4)}><rect x={-300} y={-h / 2 + 22} width={600} height={50} rx={5} fill="#C71E8A" /><text y={-h / 2 + 47} dy="0.36em" textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{titulo}</text></g>}
      {barra(-w / 4, a, pa, colB, colA, valA, txtA, '#5A2D8A')}
      {barra(w / 4, b, pb, colB, colA, valB, txtB, '#2EB0D0')}
    </En>
  );
}

/** La tabla de estadios de la referencia «esquematización de la enfermedad»: cuadrados violeta apilados (el más bajo, 0) y uno resaltado con
 *  borde rojo (`activo`, 0 a n−1); si lleva `a`, una línea roja une el cuadrado activo con ese punto. */
export function Estadios({ x, y, niveles, activo, p = 1, a, o = 1, t = 34 }: { x: number; y: number; niveles: string[]; activo: number; p?: number; a?: P2; o?: number; t?: number }) {
  if (p <= 0.003) return null;
  const lado = t * 2.1, n = niveles.length;
  return (
    <En x={x} y={y} o={o * tramo(p, 0, 0.4)}>
      {niveles.map((nv, i) => {
        const yy = -(i - (n - 1) / 2) * (lado + 8); // F0 abajo, el estadio más alto arriba
        const act = Math.abs(i - activo) < 0.5;
        const q = tramo(p, i / (n + 2), i / (n + 2) + 0.3);
        return (
          <g key={i} transform={`translate(0,${yy.toFixed(1)}) scale(${(0.6 + 0.4 * easeBack(q)).toFixed(3)})`} opacity={q}>
            <rect x={-lado / 2 + 4} y={-lado / 2 + 6} width={lado} height={lado} rx={5} fill="#000" opacity={0.18} />
            <rect x={-lado / 2} y={-lado / 2} width={lado} height={lado} rx={5} fill={act ? '#8C1E40' : '#4A1E8E'} />
            <rect x={-lado / 2} y={-lado / 2} width={lado} height={lado} rx={5} fill="none" stroke={act ? '#FF3B3B' : '#6E55D8'} strokeWidth={act ? 6 : 3} />
            <text dy="0.36em" textAnchor="middle" style={{ fontSize: t, fontWeight: 800, fill: '#E8E0FF', fontFamily: 'inherit' }}>{nv}</text>
          </g>
        );
      })}
      {a && <path d={`M${-lado / 2},${-(Math.round(activo) - (n - 1) / 2) * (lado + 8)} L${a[0] - x},${a[1] - y}`} stroke="#E5322C" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9} />}
    </En>
  );
}
