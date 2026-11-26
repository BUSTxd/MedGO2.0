'use client';
// Piezas del laboratorio «Hepatitis virales» (Patología, ACP15), en el estilo de las referencias de
// BUST (docs/hepatitis-virales/ESTILO.md): infografía plana, colores de joya y sin contorno oscuro. Cada
// objeto lleva un tono oscuro de base, el cuerpo claro corrido y un brillo. Lienzo de 1600 × 1000, sin
// `filter`; todo lo que se mueve es función de `reloj` (ms).
//
// Lo de Sepsis (que a su vez reexporta lo de Citopenias, Vasculitis, Gramnegativas, Bilirrubina y VIH y
// sífilis) se reexporta tal cual; aquí solo lo propio de las hepatitis: la paleta, las personas que parpadean y
// gesticulan (`Busto`), los cinco virus, las moléculas del ciclo y los linfocitos. El tejido del hígado
// (hepatocito, sinusoide, lobulillo, Kupffer, estrelladas) está en `Higado.tsx`.

import { type ReactNode } from 'react';
import { En, clamp, easeBack, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import { mezcla } from '../vasculitis-anca/Fisio';

export * from '../sepsis/Piezas';

export type Tono = readonly string[];
export type P2 = [number, number];

/** Paleta propia (oscuro → claro). Cada entidad conserva su color en todo el lab. */
export const H = {
  a: ['#C25A00', '#FF8A1E', '#FFD0A0'],
  b: ['#1B36A8', '#2F55E0', '#A8BEFF'],
  c: ['#0B7A4A', '#14B870', '#A4F0CC'],
  d: ['#5A22A8', '#8A4FE8', '#D2B8FF'],
  e: ['#8A6A12', '#D4A21E', '#F5E0A0'],
  hep: ['#D8707A', '#F5A0A6', '#FFD8D8'],
  nucleo: ['#2A0F6E', '#4A2A9E', '#8A6BE0'],
  sangre: ['#9E0B2E', '#E3203F', '#FF5D6C'],
  endo: ['#D98A82', '#F8B8B0', '#FFE4E0'],
  kupffer: ['#B86A00', '#F2A81E', '#FFE08A'],
  estrellada: ['#B09000', '#F2D21E', '#FFF2A0'],
  colageno: ['#1F6FB0', '#3AA7E0', '#BDE6FA'],
  bilis: ['#5A6A12', '#9AAE22', '#D8E58A'],
  biliI: ['#C79A00', '#FFC81E', '#FFEE9A'],
  biliD: ['#D96A00', '#FF9A2E', '#FFD6A0'],
  cd8: ['#0A7F78', '#10B5A8', '#9DEEE6'],
  cd4: ['#1E4FC0', '#4F7FF0', '#C0D4FF'],
  nk: ['#A81878', '#E04AB0', '#FFB0E4'],
  ac: ['#6A9A00', '#A8DC1E', '#E4FAA0'],
  gris: ['#6E6478', '#9C92A8', '#D0C8DA'],
  membrana: ['#B02FA0', '#E86AD2', '#FFB0F0'],
  toro: ['#C77800', '#FFB21E', '#FFE08A'],
  adn: ['#1B4FC0', '#2F8FE8', '#9FE0FF'],
  prot: ['#B01E8A', '#E84AC0', '#FFB0EC'],
  verde: ['#138A3A', '#3FD467', '#B5F5C4'],
  farma: ['#5A22A8', '#8A4FE8', '#D2B8FF'],
} as const;

/** Colores de TEXTO que se adaptan al tema (variables de `hepatitisVirales.module.css`). */
export const TXH = {
  a: 'var(--hv-a)', b: 'var(--hv-b)', c: 'var(--hv-c)', d: 'var(--hv-d)', e: 'var(--hv-e)', hep: 'var(--hv-hep)',
  sangre: 'var(--hv-sangre)', endo: 'var(--hv-endo)', kupffer: 'var(--hv-kupffer)', estrellada: 'var(--hv-estrellada)',
  colageno: 'var(--hv-colageno)', bilis: 'var(--hv-bilis)', biliI: 'var(--hv-bili-i)', biliD: 'var(--hv-bili-d)',
  cd8: 'var(--hv-cd8)', ac: 'var(--hv-ac)', gris: 'var(--hv-gris)',
} as const;

// ─── Vida: lo que se mueve solo ──────────────────────────────────────────────

/** Parpadeo 0-1 (un cierre de ~170 ms cada `cada` ms); `fase` desfasa a cada persona. */
export function parpadeo(reloj: number, fase = 0, cada = 3300): number {
  const t = (((reloj + fase * 1000) % cada) + cada) % cada;
  return t > 170 ? 0 : Math.sin((t / 170) * Math.PI);
}

/** Onda lenta −1..1 (respiración, balanceo). */
export const onda = (reloj: number, periodo = 3600, fase = 0) => Math.sin((reloj / periodo) * Math.PI * 2 + fase);

/** Apertura de la boca al hablar, 0-1, irregular como una frase. */
export const charla = (reloj: number, fase = 0) => clamp(0.5 + 0.5 * Math.sin(reloj / 95 + fase) * Math.sin(reloj / 410 + fase * 2));

/** Cada `cada` ms, un gesto de ~`dur` ms (0-1-0), para cosas que ocurren de vez en cuando. */
export function gesto(reloj: number, cada = 5200, dur = 1400, fase = 0): number {
  const t = (((reloj + fase * 1000) % cada) + cada) % cada;
  return t > dur ? 0 : Math.sin((t / dur) * Math.PI);
}

/** Polígono irregular suavizado (cuadráticas por los puntos medios): el contorno de una célula. */
export function poli(n: number, R: number, irr: number, sem: number): string {
  const pts: P2[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + hash(i, sem) * 0.25;
    const r = R * (1 - irr + irr * 2 * hash(i, sem + 7));
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  const mid = (a: P2, b: P2): P2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v: number) => v.toFixed(1);
  const m0 = mid(pts[n - 1], pts[0]);
  let d = `M${f(m0[0])},${f(m0[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${f(pts[i][0])},${f(pts[i][1])} ${f(m[0])},${f(m[1])}`;
  }
  return `${d} Z`;
}

// ─── Personas vivas ──────────────────────────────────────────────────────────

const PIELES = {
  p1: ['#D98F6E', '#EDB394', '#F9D8C2'],
  p2: ['#A8683F', '#C78A5E', '#E3B088'],
  madre: ['#C98462', '#E2A887', '#F6CDB0'],
} as const;

/** Busto de la referencia «diseño de hombre adulto», vivo: parpadea cada ~3 s, respira, mueve la cabeza, las cejas y la boca.
 *  `quien` elige al paciente 1 (57 años, canoso y con bigote), al 2 (51 años, de gafas) o a una mujer. `ictericia` amarillea
 *  la piel y la esclerótica; `cejas` −1 (fruncidas) a 1 (alzadas); `sonrisa` −1 a 1; `habla` 0-1 abre la boca; `sueno` y `dolor` bajan
 *  los párpados; `frio` pone azules los labios y hace tiritar; `manoOjo` lleva una mano a frotarse el ojo; `sudor` y `rubor` de la fiebre. */
export function Busto({ x = 0, y = 0, k = 1, o = 1, reloj = 0, fase = 0, quien = 'p1', ictericia = 0, rubor = 0, cejas = 0, sonrisa = 0, habla = 0, sueno = 0, dolor = 0, frio = 0, manoOjo = 0, mirada = 0, sudor = 0, tapa = false }: {
  x?: number; y?: number; k?: number; o?: number; reloj?: number; fase?: number; quien?: 'p1' | 'p2' | 'madre'; ictericia?: number; rubor?: number; cejas?: number; sonrisa?: number;
  habla?: number; sueno?: number; dolor?: number; frio?: number; manoOjo?: number; mirada?: number; sudor?: number; tapa?: boolean;
}) {
  const ic = clamp(ictericia);
  const base = PIELES[quien];
  const pielL = mezcla(base[1], '#E8CE4A', 0.5 * ic), pielD = mezcla(base[0], '#C8A82A', 0.5 * ic), pielC = mezcla(base[2], '#F3E27A', 0.5 * ic);
  const ropa = quien === 'p1' ? ['#0F7F88', '#16A7AD', '#7FE0DC'] : quien === 'p2' ? ['#4A2BA8', '#6E4AD8', '#B7A0F5'] : ['#B02FA0', '#E86AD2', '#FFB0F0'];
  const pelo = quien === 'p1' ? '#A09AAA' : quien === 'p2' ? '#2A1A3A' : '#4A2A1E';
  const cierre = clamp(Math.max(parpadeo(reloj, fase), 0.6 * sueno, 0.35 * dolor));
  const resp = onda(reloj, 3600, fase);
  const tirita = clamp(frio) * Math.sin(reloj / 38 + fase * 5) * 1.6;
  const giro = onda(reloj, 5200, fase * 2) * 1.3 + tirita * 0.4;
  const ceja = (lado: 1 | -1) => {
    const alza = cejas * -9 - 1.8 * onda(reloj, 2800, fase + lado);
    const inclina = lado * (-cejas * 6 + dolor * 12 + (cejas < 0 ? -cejas * 8 : 0) * 0);
    return <rect x={lado * 46 - 30} y={-44 + alza} width={60} height={15} rx={7.5} fill={pelo} transform={`rotate(${inclina.toFixed(1)} ${lado * 46} ${-37 + alza})`} />;
  };
  const mir = clamp(mirada, -1, 1) * 6 + onda(reloj, 4300, fase * 3) * 2.4;
  const labio = mezcla('#A31472', '#5A4AD8', 0.7 * clamp(frio));
  const boca = clamp(habla) > 0.04;
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* hombros y ropa: respiran */}
      <g transform={`translate(0,${(resp * 2).toFixed(2)}) scale(1,${(1 + 0.011 * resp).toFixed(4)})`}>
        <path d="M-212,330 C-212,252 -150,206 -78,190 L78,190 C150,206 212,252 212,330 Z" fill={ropa[0]} />
        <path d="M-198,330 C-198,262 -140,214 -70,200 L70,200 C140,214 198,262 198,330 Z" fill={ropa[1]} />
        <path d="M-60,198 Q0,262 60,198 L44,196 Q0,236 -44,196 Z" fill={ropa[2]} opacity={0.8} />
        <path d="M-120,250 C-110,236 -90,224 -70,218" fill="none" stroke={ropa[2]} strokeWidth={9} strokeLinecap="round" opacity={0.55} />
      </g>
      {/* cuello */}
      <path d="M-52,118 L-52,196 Q0,238 52,196 L52,118 Z" fill={pielD} />
      <path d="M-52,142 Q0,172 52,142 L52,118 L-52,118 Z" fill="rgba(60,0,50,0.18)" />
      {/* cabeza: gira un poco y sube y baja con la respiración */}
      <g transform={`translate(${tirita.toFixed(2)},${(-resp * 1.6).toFixed(2)}) rotate(${giro.toFixed(2)} 0 150)`}>
        {[-1, 1].map((l) => <g key={l}><circle cx={l * 113} cy={8} r={27} fill={pielD} /><circle cx={l * 113} cy={8} r={14} fill={mezcla(pielD, '#B0206F', 0.45)} /></g>)}
        <ellipse rx={112} ry={134} fill={pielD} />
        <ellipse cx={-5} cy={-4} rx={106} ry={128} fill={pielL} />
        <ellipse cx={-34} cy={-58} rx={56} ry={34} fill={pielC} opacity={0.45} />
        {rubor > 0.01 && [-1, 1].map((l) => <ellipse key={l} cx={l * 62} cy={34} rx={30} ry={20} fill="#FF4D6A" opacity={0.55 * clamp(rubor)} />)}
        {/* pelo */}
        {quien === 'madre' ? (
          <path d="M-124,-30 C-140,-150 -72,-204 6,-198 C92,-198 144,-140 124,-30 C124,40 138,100 150,150 C110,140 100,40 96,-30 C70,-84 30,-100 -20,-96 C-70,-90 -96,-60 -100,-30 C-100,40 -112,140 -150,150 C-134,90 -124,30 -124,-30 Z" fill={pelo} />
        ) : (
          <g>
            <path d={quien === 'p1' ? 'M-122,-34 C-130,-140 -72,-184 -4,-182 C64,-184 128,-138 122,-34 C102,-82 44,-104 -16,-98 C-70,-92 -106,-70 -122,-34 Z' : 'M-124,-30 C-134,-146 -72,-196 6,-190 C92,-190 138,-134 124,-30 C102,-84 42,-104 -20,-96 C-70,-90 -108,-68 -124,-30 Z'} fill={pelo} />
            {quien === 'p2' && <path d="M28,-186 C52,-210 86,-206 92,-186 C70,-190 50,-184 28,-186 Z" fill={pelo} />}
          </g>
        )}
        {ceja(-1)}{ceja(1)}
        {/* ojos: esclerótica (amarillea), iris redondo y párpado que cae al parpadear */}
        {[-1, 1].map((l) => {
          const ex = l * 46, ey = -6;
          return (
            <g key={l}>
              <ellipse cx={ex} cy={ey} rx={29} ry={26 * (1 - 0.25 * dolor)} fill={mezcla('#FFF6EC', '#F2D238', ic)} />
              <circle cx={ex + mir} cy={ey + 1} r={20} fill="#2A1456" />
              <circle cx={ex + mir - 6} cy={ey - 7} r={5.5} fill="#FFF" opacity={0.85} />
              <rect x={ex - 32} y={ey - 30} width={64} height={60 * cierre} rx={8} fill={pielL} />
              {cierre > 0.5 && <path d={`M${ex - 26},${ey - 30 + 60 * cierre} Q${ex},${ey - 26 + 60 * cierre} ${ex + 26},${ey - 30 + 60 * cierre}`} fill="none" stroke={pielD} strokeWidth={5} strokeLinecap="round" />}
            </g>
          );
        })}
        {quien === 'p2' && (
          <g fill="none" stroke="#3A1E70" strokeWidth={7} strokeLinecap="round">
            <circle cx={-46} cy={-6} r={37} /><circle cx={46} cy={-6} r={37} /><path d="M-9,-8 Q0,-18 9,-8" />
          </g>
        )}
        <circle cy={42} r={15} fill={pielD} />
        {quien === 'p1' && <path d="M-46,64 Q-20,48 2,56 Q24,48 48,64 Q26,66 2,64 Q-20,66 -46,64 Z" fill="#B8B2C2" />}
        {quien === 'p2' && <path d="M-72,70 C-60,118 -30,134 0,134 C30,134 60,118 72,70 C56,102 30,108 0,108 C-30,108 -56,102 -72,70 Z" fill={pelo} opacity={0.55} />}
        {boca
          ? <g><ellipse cx={0} cy={100 - sonrisa * 3} rx={20 + 6 * sonrisa} ry={4 + 15 * clamp(habla)} fill="#6A0E4A" /><ellipse cx={0} cy={100 + 4 + 10 * clamp(habla)} rx={13} ry={3 + 5 * clamp(habla)} fill="#E8607A" opacity={0.8} /></g>
          : <path d={`M-30,${100 - sonrisa * 5} Q0,${100 + sonrisa * 16} 30,${100 - sonrisa * 5}`} fill="none" stroke={labio} strokeWidth={9} strokeLinecap="round" />}
        {sudor > 0.01 && [0, 1].map((i) => {
          const u = (reloj / 2600 + i * 0.47 + fase) % 1;
          return <path key={i} d="M0,-15 C6,-5 9,1 9,6 A9,9 0 0 1 -9,6 C-9,1 -6,-5 0,-15 Z" transform={`translate(${i ? 96 - u * 6 : -96 + u * 6},${-40 + u * 100})`} fill="#8FD3F7" opacity={clamp(sudor) * Math.sin(u * Math.PI)} />;
        })}
        {/* la mano que se frota el ojo izquierdo */}
        {manoOjo > 0.01 && (
          <g opacity={tramo(manoOjo, 0, 0.3)} transform={`translate(${(lerp(150, -58, easeOut(clamp(manoOjo * 1.4))) + Math.sin(reloj / 90) * 5 * manoOjo).toFixed(1)},${(lerp(190, -6, easeOut(clamp(manoOjo * 1.4))) + Math.cos(reloj / 90) * 4 * manoOjo).toFixed(1)}) rotate(-34) scale(0.8)`}>
            <rect x={-24} y={-34} width={50} height={70} rx={24} fill={pielD} transform="translate(5,6)" />
            <rect x={-30} y={-34} width={52} height={70} rx={24} fill={pielL} />
            <ellipse cx={-31} cy={10} rx={11} ry={21} fill={pielL} transform="rotate(28 -31 10)" />
            {[-16, -4, 8].map((fx) => <path key={fx} d={`M${fx},-30 L${fx},-8`} stroke={pielD} strokeWidth={3.4} strokeLinecap="round" opacity={0.7} />)}
            <path d="M-20,-26 Q-8,-34 6,-30" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.45} />
          </g>
        )}
      </g>
      {tapa && null}
    </En>
  );
}

// ─── Los cinco virus ─────────────────────────────────────────────────────────

/** Icosaedro visto de frente: hexágono con sus facetas. Ancla de los virus desnudos (A y E) y de las cápsides. */
function Icosaedro({ R, tono, o = 1 }: { R: number; tono: Tono; o?: number }) {
  const v = Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6) * R, Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6) * R] as P2);
  const d = (pts: P2[]) => `M${pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' L')} Z`;
  return (
    <g opacity={o}>
      <path d={d(v)} fill={tono[0]} transform={`translate(${R * 0.07},${R * 0.09})`} />
      <path d={d(v)} fill={tono[1]} />
      <path d={d([v[0], v[1], [0, 0]])} fill={tono[2]} opacity={0.5} />
      <path d={d([v[2], v[3], [0, 0]])} fill={tono[0]} opacity={0.28} />
      <path d={d([v[4], v[5], [0, 0]])} fill={tono[2]} opacity={0.3} />
      <path d={`M${v[0][0] * 0.6},${v[0][1] * 0.6} L${v[1][0] * 0.6},${v[1][1] * 0.6}`} stroke="#FFF" strokeWidth={R * 0.07} strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

/** Espículas que se acercan y alejan (titilan) alrededor de un círculo de radio `R`. */
function Espiculas({ R, n, largo, tono, reloj, fase = 0, bola = 5, p = 1 }: { R: number; n: number; largo: number; tono: Tono; reloj: number; fase?: number; bola?: number; p?: number }) {
  if (p <= 0.01) return null;
  return (
    <g opacity={clamp(p)}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + fase;
        const l = largo * (0.85 + 0.2 * Math.sin(reloj / 520 + i * 1.7)) * clamp(p);
        const x1 = Math.cos(a) * (R - 3), y1 = Math.sin(a) * (R - 3), x2 = Math.cos(a) * (R + l), y2 = Math.sin(a) * (R + l);
        return (
          <g key={i}>
            <path d={`M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`} stroke={tono[0]} strokeWidth={bola * 0.8} strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={bola} fill={tono[2]} />
            <circle cx={x2 - bola * 0.3} cy={y2 - bola * 0.3} r={bola * 0.35} fill="#FFF" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
}

/** Virión del VHB (partícula de Dane), azul cobalto: envoltura con espículas S, M y L, nucleocápside icosaédrica y el ADN circular
 *  con su polimerasa. `env` muestra la envoltura, `espiculas` las espículas, `capside` la cápside, `adn` el ADN. Gira unos grados. */
export function VirionB({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, env = 1, espiculas = 1, capside = 1, adn = 1 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; env?: number; espiculas?: number; capside?: number; adn?: number }) {
  const R = 78;
  return (
    <En x={x} y={y} r={r + onda(reloj, 6000, fase) * 6} k={k * (1 + 0.012 * onda(reloj, 2400, fase))} o={o}>
      {env > 0.01 && <g opacity={clamp(env)}>
        <Espiculas R={R} n={16} largo={14} tono={H.b} reloj={reloj} fase={fase} bola={5.2} p={espiculas} />
        <Espiculas R={R} n={8} largo={26} tono={H.b} reloj={reloj + 400} fase={fase + 0.2} bola={4.4} p={espiculas} />
        <circle r={R} fill={H.b[0]} />
        <circle cx={-3} cy={-3} r={R - 5} fill={H.b[1]} />
        <circle r={R - 16} fill={H.b[0]} opacity={0.35} />
        <path d={`M${-R * 0.7},${-R * 0.35} A${R * 0.78},${R * 0.78} 0 0 1 ${-R * 0.18},${-R * 0.76}`} fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.45} />
      </g>}
      {capside > 0.01 && <g opacity={clamp(capside)} transform={`scale(${(0.9 + 0.1 * clamp(capside)).toFixed(3)})`}>
        <Icosaedro R={R * 0.58} tono={H.b} />
      </g>}
      {adn > 0.01 && <g opacity={clamp(adn)}>
        <circle r={R * 0.3} fill="none" stroke="#FFF6D8" strokeWidth={6} strokeDasharray="150 22" strokeLinecap="round" transform={`rotate(${(reloj / 40) % 360})`} />
        <circle cx={R * 0.28} cy={-R * 0.1} r={6.5} fill="#FFC81E" /><circle cx={R * 0.26} cy={-R * 0.12} r={2.4} fill="#FFF" />
      </g>}
    </En>
  );
}

/** Partículas subvirales de HBsAg (los señuelos): esfera vacía y filamento. */
export function Subviral({ x = 0, y = 0, k = 1, o = 1, r = 0, forma = 'esfera', reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; forma?: 'esfera' | 'filamento'; reloj?: number; fase?: number }) {
  const w = onda(reloj, 3000, fase);
  return (
    <En x={x} y={y} r={r + w * 4} k={k} o={o}>
      {forma === 'esfera' ? (
        <g>
          <circle r={20} fill={H.b[0]} /><circle cx={-2} cy={-2} r={17} fill={H.b[2]} /><circle cx={-7} cy={-8} r={4.4} fill="#FFF" opacity={0.85} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={Math.cos((i / 8) * 6.28) * 22} cy={Math.sin((i / 8) * 6.28) * 22} r={2.6} fill={H.b[1]} />)}
        </g>
      ) : (
        <g>
          <rect x={-46} y={-13} width={92} height={26} rx={13} fill={H.b[0]} />
          <rect x={-44} y={-14} width={88} height={22} rx={11} fill={H.b[2]} />
          <rect x={-34} y={-9} width={42} height={5} rx={2.5} fill="#FFF" opacity={0.7} />
        </g>
      )}
    </En>
  );
}

/** Virión del VHC, verde esmeralda: envoltura con espículas E1/E2 y, pegadas, lipoproteínas con ApoE (esferitas amarillas) que lo disfrazan. */
export function VirionC({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, lipo = 0, espiculas = 1 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; lipo?: number; espiculas?: number }) {
  const R = 64;
  return (
    <En x={x} y={y} r={r + onda(reloj, 6500, fase) * 5} k={k * (1 + 0.012 * onda(reloj, 2300, fase))} o={o}>
      <Espiculas R={R} n={14} largo={20} tono={H.c} reloj={reloj} fase={fase} bola={5.4} p={espiculas} />
      <circle r={R} fill={H.c[0]} /><circle cx={-3} cy={-3} r={R - 5} fill={H.c[1]} />
      <Icosaedro R={R * 0.55} tono={H.c} />
      <circle cx={R * 0.24} cy={-R * 0.16} r={7} fill="#FFF6D8" opacity={0.9} />
      <path d={`M${-R * 0.7},${-R * 0.3} A${R * 0.75},${R * 0.75} 0 0 1 ${-R * 0.2},${-R * 0.72}`} fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
      {lipo > 0.01 && Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 + 0.3 + onda(reloj, 4000, i) * 0.06;
        const q = easeOut(tramo(lipo, i / 12, i / 12 + 0.5));
        return (
          <g key={i} transform={`translate(${(Math.cos(a) * (R + 22) * q).toFixed(1)},${(Math.sin(a) * (R + 22) * q).toFixed(1)})`} opacity={q}>
            <circle r={13} fill="#C79A00" /><circle cx={-1.5} cy={-1.5} r={11} fill="#FFD23F" /><circle cx={-5} cy={-5} r={3} fill="#FFF" opacity={0.85} />
          </g>
        );
      })}
    </En>
  );
}

/** Virus desnudo (A naranja, E ocre): un icosaedro; `manto` (0-1) lo envuelve con una membrana translúcida robada a la célula (el VHA en la sangre). */
export function VirionAE({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, tipo = 'a', manto = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; tipo?: 'a' | 'e'; manto?: number }) {
  const t = tipo === 'a' ? H.a : H.e;
  return (
    <En x={x} y={y} r={r + onda(reloj, 5200, fase) * 7} k={k * (1 + 0.015 * onda(reloj, 2000, fase))} o={o}>
      <Icosaedro R={48} tono={t} />
      {manto > 0.01 && <g opacity={clamp(manto)}>
        <circle r={66} fill="#FFFFFF" opacity={0.28} />
        <circle r={66} fill="none" stroke="#FFF" strokeWidth={5} strokeDasharray="3 9" strokeLinecap="round" opacity={0.8} />
      </g>}
    </En>
  );
}

/** Virión del VHD, violeta: un ARN circular plegado en varilla con las dos proteínas HDAg, dentro de un abrigo azul prestado
 *  (HBsAg del VHB). `abrigo` 0-1 lo viste. Es más pequeño que el B. */
export function VirionD({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, abrigo = 1 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; abrigo?: number }) {
  const R = 44;
  return (
    <En x={x} y={y} r={r + onda(reloj, 5600, fase) * 6} k={k * (1 + 0.014 * onda(reloj, 2200, fase))} o={o}>
      {abrigo > 0.01 && <g opacity={clamp(abrigo)}>
        <Espiculas R={R + 12} n={12} largo={11} tono={H.b} reloj={reloj} fase={fase} bola={3.8} p={abrigo} />
        <circle r={R + 12} fill={H.b[0]} /><circle cx={-2} cy={-2} r={R + 8} fill={H.b[2]} opacity={0.95} />
      </g>}
      <circle r={R - 4} fill={H.d[0]} /><circle cx={-2} cy={-2} r={R - 8} fill={H.d[1]} />
      <path d="M-18,-4 C-8,-26 8,-26 18,-4 C22,10 10,22 0,22 C-12,22 -22,12 -18,-4 Z" fill="none" stroke="#FFF6D8" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="22 6" />
      <circle cx={-4} cy={2} r={6} fill={H.d[2]} /><circle cx={9} cy={-2} r={4.4} fill={H.d[2]} />
      <path d={`M${-R * 0.6},${-R * 0.35} A${R * 0.7},${R * 0.7} 0 0 1 ${-R * 0.15},${-R * 0.66}`} fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
    </En>
  );
}

// ─── Moléculas ───────────────────────────────────────────────────────────────

/** Doble hélice de la referencia «medicamento interactuando con proteína del ADN»: cuerda azul gruesa con peldaños celestes que gira
 *  con `reloj`. `w` ancho total; `p` cuánto se ha dibujado. */
export function Helice({ x = 0, y = 0, w = 600, amp = 38, o = 1, reloj = 0, p = 1, grosor = 13, tono = H.adn, vueltas = 3 }: { x?: number; y?: number; w?: number; amp?: number; o?: number; reloj?: number; p?: number; grosor?: number; tono?: Tono; vueltas?: number }) {
  if (p <= 0.01) return null;
  const n = 80, largo = w * clamp(p), fase = reloj / 700;
  const pt = (i: number, s: 1 | -1): P2 => {
    const u = i / n, xx = -w / 2 + u * w;
    return [xx, Math.sin(u * Math.PI * 2 * vueltas + fase) * amp * s];
  };
  const camino = (s: 1 | -1) => Array.from({ length: n + 1 }, (_, i) => pt(i, s)).filter(([xx]) => xx + w / 2 <= largo).map(([xx, yy], i) => `${i ? 'L' : 'M'}${xx.toFixed(1)},${yy.toFixed(1)}`).join(' ');
  return (
    <En x={x} y={y} o={o}>
      {Array.from({ length: n / 2 }, (_, j) => {
        const i = j * 2, [x1, y1] = pt(i, 1), [, y2] = pt(i, -1);
        return x1 + w / 2 <= largo ? <line key={j} x1={x1} y1={y1} x2={x1} y2={y2} stroke={tono[2]} strokeWidth={grosor * 0.55} strokeLinecap="round" opacity={0.9} /> : null;
      })}
      <path d={camino(-1)} fill="none" stroke={tono[0]} strokeWidth={grosor} strokeLinecap="round" />
      <path d={camino(1)} fill="none" stroke={tono[1]} strokeWidth={grosor} strokeLinecap="round" />
      <path d={camino(1)} fill="none" stroke={tono[2]} strokeWidth={grosor * 0.25} strokeLinecap="round" opacity={0.5} transform="translate(0,-3)" />
    </En>
  );
}

/** El cccDNA: un círculo de ADN enrollado en nucleosomas (cuentas) que gira lento. `p` los va poniendo. */
export function CccDNA({ x = 0, y = 0, R = 70, k = 1, o = 1, reloj = 0, p = 1 }: { x?: number; y?: number; R?: number; k?: number; o?: number; reloj?: number; p?: number }) {
  const n = 14;
  return (
    <En x={x} y={y} k={k} o={o} r={(reloj / 60) % 360}>
      <circle r={R} fill="none" stroke={H.adn[1]} strokeWidth={9} />
      <circle r={R} fill="none" stroke={H.adn[2]} strokeWidth={3} opacity={0.6} transform="translate(0,-2)" />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2, q = easeBack(tramo(p, i / (n + 3), i / (n + 3) + 0.3));
        return q > 0.01 ? (
          <g key={i} transform={`translate(${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R).toFixed(1)}) scale(${q.toFixed(3)})`}>
            <circle r={13} fill={H.prot[0]} /><circle cx={-1.5} cy={-1.5} r={11} fill={H.prot[1]} /><circle cx={-4.5} cy={-4.5} r={3} fill="#FFF" opacity={0.85} />
          </g>
        ) : null;
      })}
    </En>
  );
}

/** Receptor o transportador de membrana, como en la referencia «membrana celular»: un toro con hueco sobre un tallo magenta.
 *  `bombea` (0-1) hace pasar puntitos (el ácido biliar) por el hueco. */
export function Toro({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = H.toro, tallo = 58, reloj = 0, bombea = 0, tapon = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; tallo?: number; reloj?: number; bombea?: number; tapon?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <path d={`M-11,0 L-8,${tallo} L8,${tallo} L11,0 Z`} fill={H.prot[0]} />
      <path d={`M-9,0 L-6,${tallo} L4,${tallo} L7,0 Z`} fill={H.prot[1]} />
      <ellipse rx={46} ry={21} fill={tono[0]} /><ellipse cx={-2} cy={-3} rx={43} ry={18} fill={tono[1]} />
      <ellipse cx={0} cy={0} rx={27} ry={8.5} fill="#3A1470" />
      <path d="M-34,-9 Q-22,-17 -8,-15" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      {bombea > 0.01 && [0, 1, 2].map((i) => {
        const u = (reloj / 1100 + i / 3) % 1;
        return <circle key={i} cx={Math.sin(u * 6.28) * 4} cy={-60 + u * 120} r={5.4} fill={H.bilis[1]} opacity={clamp(bombea) * Math.sin(u * Math.PI)} />;
      })}
      {tapon > 0.01 && <g opacity={clamp(tapon)} transform={`translate(0,${(-26 * (1 - easeOut(clamp(tapon)))).toFixed(1)})`}>
        <rect x={-24} y={-22} width={48} height={20} rx={10} fill="#8A4FE8" /><rect x={-22} y={-23} width={44} height={14} rx={7} fill="#D2B8FF" />
      </g>}
    </En>
  );
}

/** Anticuerpo en Y, lima. */
export function Anticuerpo({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = H.ac }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <g stroke={tono[0]} strokeLinecap="round" strokeWidth={12} fill="none" transform="translate(2,3)">
        <path d="M0,22 L0,-2" /><path d="M0,-2 L-20,-24" /><path d="M0,-2 L20,-24" />
      </g>
      <g stroke={tono[1]} strokeLinecap="round" strokeWidth={11} fill="none">
        <path d="M0,22 L0,-2" /><path d="M0,-2 L-20,-24" /><path d="M0,-2 L20,-24" />
      </g>
      <path d="M-18,-22 L-8,-10" stroke="#FFF" strokeWidth={3.4} strokeLinecap="round" opacity={0.65} />
    </En>
  );
}

/** Linfocito (T CD8 turquesa, CD4 azul o NK magenta): cuerpo que ondula, un núcleo grande y receptores en la membrana.
 *  `activo` (0-1) lo estira como si avanzara y tanteara con un seudópodo; `agotado` (0-1) lo apaga (gris y encogido). */
export function Linfo({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = H.cd8, reloj = 0, fase = 0, activo = 0, agotado = 0, receptores = 8 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; reloj?: number; fase?: number; activo?: number; agotado?: number; receptores?: number }) {
  const ag = clamp(agotado), ac = clamp(activo);
  const t0 = mezcla(tono[0], '#6E6478', ag), t1 = mezcla(tono[1], '#9C92A8', ag), t2 = mezcla(tono[2], '#D0C8DA', ag);
  const w = reloj / 700 + fase;
  const sx = 1 + 0.16 * ac + 0.03 * Math.sin(w * 2.1), sy = 1 - 0.1 * ac + 0.03 * Math.cos(w * 1.7);
  return (
    <En x={x} y={y} r={r} k={k * (1 - 0.12 * ag)} o={o}>
      <g transform={`scale(${sx.toFixed(3)},${sy.toFixed(3)})`}>
        {ac > 0.01 && <ellipse cx={46 + 12 * Math.sin(w * 3)} cy={0} rx={22 * ac} ry={14 * ac} fill={t1} />}
        {Array.from({ length: receptores }, (_, i) => {
          const a = (i / receptores) * Math.PI * 2 + w * 0.15;
          return <g key={i} transform={`translate(${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(0)})`}><path d="M0,0 L0,-10 M0,-10 L-6,-18 M0,-10 L6,-18" stroke={t0} strokeWidth={3.4} strokeLinecap="round" fill="none" /></g>;
        })}
        <circle r={48} fill={t0} /><circle cx={-3} cy={-3} r={44} fill={t1} />
        <circle cx={3 + 2 * Math.sin(w)} cy={2} r={28} fill={H.nucleo[0]} /><circle cx={1 + 2 * Math.sin(w)} cy={0} r={25} fill={H.nucleo[1]} />
        <circle cx={-6 + 2 * Math.sin(w)} cy={-8} r={6} fill={H.nucleo[2]} opacity={0.8} />
        <path d="M-34,-20 Q-26,-38 -8,-42" fill="none" stroke={t2} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      </g>
    </En>
  );
}

/** Cápsula de fármaco (de una familia): dos mitades de color con brillo; con `reloj` flota y gira un poco. */
export function Capsula({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = H.farma, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; reloj?: number; fase?: number }) {
  return (
    <En x={x} y={y + onda(reloj, 2400, fase) * 5} r={r + onda(reloj, 3600, fase) * 8} k={k} o={o}>
      <rect x={-44} y={-19} width={88} height={38} rx={19} fill={tono[0]} transform="translate(3,4)" />
      <rect x={-44} y={-19} width={88} height={38} rx={19} fill="#FFFFFF" />
      <path d="M0,-19 L25,-19 A19,19 0 0 1 25,19 L0,19 Z" fill={tono[1]} />
      <path d="M0,-19 L-25,-19 A19,19 0 0 0 -25,19 L0,19 Z" fill={tono[2]} />
      <path d="M-36,-9 Q-26,-15 -12,-14" fill="none" stroke="#FFF" strokeWidth={4.4} strokeLinecap="round" opacity={0.75} />
    </En>
  );
}

/** El «hueco» punteado de la referencia de los fármacos: el contorno discontinuo del paso del ciclo que el fármaco bloquea. */
export function Hueco({ x = 0, y = 0, w = 120, h = 80, tono = H.farma, p = 1, reloj = 0, redondo = true, children }: { x?: number; y?: number; w?: number; h?: number; tono?: Tono; p?: number; reloj?: number; redondo?: boolean; children?: ReactNode }) {
  if (p <= 0.01) return null;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.4)} k={0.9 + 0.1 * easeBack(clamp(p))}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={redondo ? Math.min(w, h) / 2 : 14} fill="none" stroke={tono[1]} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" strokeDashoffset={-(reloj / 40) % 16} />
      {children}
    </En>
  );
}

/** Rótulo de color sólido con texto blanco y puntita (como «Cell Membrane» o «Lymph Nodes» de las referencias): una o dos palabras. */
export function Etiqueta({ x, y, txt, color = '#E04AB0', p = 1, t = 30, punta = 'abajo' }: { x: number; y: number; txt: string; color?: string; p?: number; t?: number; punta?: 'abajo' | 'arriba' | 'izq' | 'der' | 'no' }) {
  if (p <= 0.002) return null;
  const W = txt.length * t * 0.56 + t * 1.2, Hh = t * 1.75;
  const q = easeBack(clamp(p));
  const tip = punta === 'abajo' ? `M-9,${Hh / 2 - 1} L0,${Hh / 2 + 12} L9,${Hh / 2 - 1} Z` : punta === 'arriba' ? `M-9,${-Hh / 2 + 1} L0,${-Hh / 2 - 12} L9,${-Hh / 2 + 1} Z` : punta === 'izq' ? `M${-W / 2 + 1},-9 L${-W / 2 - 12},0 L${-W / 2 + 1},9 Z` : punta === 'der' ? `M${W / 2 - 1},-9 L${W / 2 + 12},0 L${W / 2 - 1},9 Z` : '';
  return (
    <En x={x} y={y} k={0.85 + 0.15 * q} o={tramo(p, 0, 0.4)}>
      <rect x={-W / 2 + 4} y={-Hh / 2 + 5} width={W} height={Hh} rx={6} fill="#000" opacity={0.18} />
      <rect x={-W / 2} y={-Hh / 2} width={W} height={Hh} rx={6} fill={color} />
      {tip && <path d={tip} fill={color} />}
      <text dy="0.35em" textAnchor="middle" style={{ fontSize: t, fontWeight: 800, fill: '#FFFFFF', fontFamily: 'inherit' }}>{txt}</text>
    </En>
  );
}

// ─── El mapa del recorrido ───────────────────────────────────────────────────

/** Tranvía del mapa, con los dos pacientes asomados a sus ventanas (el paciente 1, canoso y con bigote; el 2, de gafas), que parpadean.
 *  Origen en el centro del vagón; `dir` −1 lo voltea para que avance hacia la izquierda (las caras no se voltean). */
export function Tranvia({ x, y, k = 1, o = 1, r = 0, reloj = 0, dir = 1 }: { x: number; y: number; k?: number; o?: number; r?: number; reloj?: number; dir?: 1 | -1 }) {
  const rueda = (reloj / 4) % 360;
  const cuerpo = 'M-104,-74 L74,-74 Q104,-74 114,-44 L124,4 Q127,22 108,22 L-104,22 Q-118,22 -118,8 L-118,-60 Q-118,-74 -104,-74 Z';
  const ventanas = [-70, 4];
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <g transform="translate(0,-44)">
        <g transform={`scale(${dir},1)`}>
          <path d="M-40,-74 L-30,-96 L20,-96 L30,-74" fill="none" stroke="#2A3F9A" strokeWidth={6} strokeLinejoin="round" />
          <path d={cuerpo} fill="#1B36A8" />
          <path d={cuerpo} fill="#4F7FF0" transform="translate(-4,-4) scale(0.97)" />
          <rect x={-118} y={-8} width={238} height={9} fill="#BCD0FF" opacity={0.75} />
          {ventanas.map((vx) => <rect key={vx} x={vx - 32} y={-62} width={64} height={48} rx={13} fill="#EAF0FF" />)}
          <path d="M62,-62 L84,-62 Q102,-60 106,-40 L110,-14 L62,-14 Z" fill="#EAF0FF" />
          <path d="M-96,-66 L60,-66" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
          {[-70, 70].map((cx) => (
            <g key={cx} transform={`translate(${cx},26) rotate(${rueda})`}>
              <circle r={19} fill="#1A1850" /><circle r={7} fill="#A8BEFF" /><rect x={-2} y={-17} width={4} height={34} fill="#A8BEFF" />
            </g>
          ))}
        </g>
        {ventanas.map((vx, i) => {
          const cx = vx * dir, uno = i === (dir === 1 ? 0 : 1);
          const par = 1 - 0.9 * parpadeo(reloj, i * 1.3);
          return (
            <g key={vx} transform={`translate(${cx},${-34 + Math.sin(reloj / 300 + i) * 1.5})`}>
              <circle r={17} fill={uno ? '#EDB394' : '#C78A5E'} />
              <path d={uno ? 'M-17,-2 C-19,-24 19,-24 17,-2 C10,-12 -10,-12 -17,-2 Z' : 'M-17,-2 C-20,-24 20,-24 17,-2 C12,-10 -12,-10 -17,-2 Z'} fill={uno ? '#A09AAA' : '#2A1A3A'} />
              <ellipse cx={-6} cy={2} rx={2.6} ry={2.6 * par} fill="#2A1250" /><ellipse cx={6} cy={2} rx={2.6} ry={2.6 * par} fill="#2A1250" />
              {uno ? <path d="M-8,8 Q0,5 8,8 Q0,10 -8,8 Z" fill="#B8B2C2" /> : <g fill="none" stroke="#3A1E70" strokeWidth={1.8}><circle cx={-6} cy={2} r={5.4} /><circle cx={6} cy={2} r={5.4} /></g>}
              <path d="M-5,11 Q0,14 5,11" fill="none" stroke="#2A1250" strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    </En>
  );
}
