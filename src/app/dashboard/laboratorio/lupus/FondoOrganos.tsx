'use client';
// Láminas del capítulo 8 (corazón, serosas, bazo y pulmón). Sin tarjetas: cada dato
// es una imagen o un texto suelto con su flecha.
// · `valva`: el corazón y, en la lente, la mitral en corte con sus cuerdas y las
//   verrugas de Libman-Sacks a ambos lados; el émbolo que sale hacia el cerebro.
// · `coronaria`: la arteria en corte, con grasa epicárdica y pared en capas; la placa
//   crece y estrecha la corriente; lo que la empuja llega con flechas.
// · `torax`: pleura y pericardio inflamados; las costillas, discretas, detrás.
// · `cebolla`: el bazo y la arteria peniciliar en «hojas de cebolla».
// · `pulmon`: la enfermedad intersticial y la hipertensión pulmonar.
// · `mecanismos`: complejos inmunes y antifosfolípidos, y el paso al riñón.

import { memo, type ReactNode } from 'react';
import { clamp, dibujar, easeBack, easeInOut, easeOut, FlechaSuave, IconoOrgano, tramo, v, type T } from './laminas';
import { ARTERIA, CONTORNO, Corazon, Pulmones, Tubo, VENA } from './Anatomia';
import { ComplejoRed, IgG } from './Celulas';
import { ArteCorticoide, DefsPl, Flotante, lobulos, Nota } from './FondoClinica';
import { banda, DefsSg, Lente, Pared, Sello } from './FondoDano2';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rotulo = `${s.lEtiqueta} ${s.conHalo}`;
const halo = `${s.lSubChico} ${s.conHalo}`;

const Base = () => <g><DefsSg /><DefsPl /></g>;
type P = { x: number; y: number };

/** Flecha que se dibuja desde el texto y por la que no deja de correr un punto. */
export function FlechaViva({ a, c, b, k, rl, color = '#C2385A', grosor = 5.5, fase = 0 }: { a: P; c: P; b: P; k: number; rl: number; color?: string; grosor?: number; fase?: number }) {
  if (k <= 0.001) return null;
  const f = (rl / 1400 + fase) % 1, q = f * 0.86;
  const x = (1 - q) ** 2 * a.x + 2 * (1 - q) * q * c.x + q * q * b.x, y = (1 - q) ** 2 * a.y + 2 * (1 - q) * q * c.y + q * q * b.y;
  return (
    <g>
      <FlechaSuave a={a} c={c} b={b} k={k} color={color} grosor={grosor} />
      {k > 0.95 && <circle cx={f1(x)} cy={f1(y)} r={grosor * 0.8} fill="#FFF" stroke={color} strokeWidth={2} opacity={Math.sin(f * Math.PI)} />}
    </g>
  );
}

/** Título suelto: letra grande y aclaración debajo, sin caja. */
export function Titulo({ x, y, t, sub, k, fin = 'start', tam = 28, color }: { x: number; y: number; t: string; sub?: string; k: number; fin?: 'start' | 'middle' | 'end'; tam?: number; color?: string }) {
  if (k <= 0.001) return null;
  const dx = (1 - easeOut(clamp(k))) * (fin === 'end' ? -18 : 18);
  return (
    <g opacity={tramo(k, 0, 0.5)} transform={`translate(${f1(dx)},0)`}>
      <text x={x} y={y} textAnchor={fin} className={rotulo} style={{ fontSize: tam, ...(color ? { fill: color } : {}) }}>{t}</text>
      {sub && <text x={x} y={y + 30} textAnchor={fin} className={`${s.lSub} ${s.conHalo}`} style={{ fontSize: 20 }}>{sub}</text>}
    </g>
  );
}

// ─── Paso 0 · válvula ─────────────────────────────────────────────────────────

const VZ = { cx: 770, cy: 480, r: 266 };

/** Verruga: una coliflor de fibrina y plaquetas pegada a la valva. */
function Verruga({ x, y, r, k, sem }: { x: number; y: number; r: number; k: number; sem: number }) {
  if (k <= 0.001) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k.toFixed(3)})`}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * TAU + sem, q = r * (0.52 + hash(i, sem) * 0.14), rr = r * (0.42 + hash(i, sem + 2) * 0.2), cx = Math.cos(a) * q, cy = Math.sin(a) * q;
        return (
          <g key={i}>
            <circle cx={f1(cx)} cy={f1(cy)} r={f1(rr)} fill={i % 3 ? '#EBC88A' : '#E0A87A'} stroke="#A06C3C" strokeWidth={1.2} />
            <circle cx={f1(cx - rr * 0.28)} cy={f1(cy - rr * 0.32)} r={f1(rr * 0.24)} fill="#FFF" opacity={0.55} />
          </g>
        );
      })}
      <circle r={r * 0.5} fill="#F2D49C" stroke="#A06C3C" strokeWidth={1} />
      {Array.from({ length: 6 }, (_, i) => { const a = i * 2.4 + sem, q = r * 0.34; return <circle key={i} cx={f1(Math.cos(a) * q)} cy={f1(Math.sin(a) * q)} r={r * 0.09} fill={i % 2 ? '#9A62C4' : '#C0486A'} />; })}
    </g>
  );
}

/** Valva izquierda; la derecha es su espejo. Termina casi en el centro, donde coapta. */
const VALVA = 'M-238,-108 C-180,-78 -96,-16 -8,52 C-22,70 -40,80 -58,72 C-126,34 -194,-30 -244,-74 Z';
/** [x, y, radio, semilla]: en la cara auricular (arriba) y en la ventricular (abajo). */
const VERRUGAS: [number, number, number, number][] = [[-176, -74, 17, 1], [-108, -26, 19, 2], [-44, 20, 15, 3], [-152, -4, 15, 4], [-76, 56, 17, 5], [176, -74, 16, 6], [106, -26, 20, 7], [40, 18, 14, 8], [150, -4, 14, 9], [74, 56, 16, 10]];

const ValvaFija = memo(function ValvaFija() {
  const cuerdas = (l: number) => [[-200, -30], [-160, 8], [-124, 30], [-92, 50], [-60, 66]].flatMap(([x, y], i) => [
    <path key={`${l}${i}a`} d={`M${l * -x},${y} C${l * -x * 0.9},${y + 60} ${l * 140},${130} ${l * 122},${176}`} fill="none" stroke="#FBF2E2" strokeWidth={3.2} strokeLinecap="round" />,
    <path key={`${l}${i}b`} d={`M${l * -x},${y} C${l * -x * 0.9},${y + 60} ${l * 140},${130} ${l * 122},${176}`} fill="none" stroke="#C8B48E" strokeWidth={1} strokeLinecap="round" opacity={0.75} />,
  ]);
  return (
    <g>
      <defs>
        <linearGradient id="vz-auricula" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F4AFA8" /><stop offset="1" stopColor="#FAD7CF" /></linearGradient>
        <linearGradient id="vz-ventriculo" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FAD0C8" /><stop offset="1" stopColor="#E98F8C" /></linearGradient>
        <linearGradient id="vz-mio" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#7E2230" /><stop offset="1" stopColor="#B84450" /></linearGradient>
        <linearGradient id="vz-valva" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FCE8DE" /><stop offset="1" stopColor="#E8A8A2" /></linearGradient>
      </defs>
      <rect x={-280} y={-280} width={560} height={280} fill="url(#vz-auricula)" />
      <rect x={-280} y={-60} width={560} height={340} fill="url(#vz-ventriculo)" />
      {/* Pared del corazón con sus fibras */}
      {[1, -1].map((l) => (
        <g key={l} transform={`scale(${l},1)`}>
          <path d="M-280,-280 H-238 C-250,-180 -240,-130 -238,-108 L-244,-74 C-262,10 -258,130 -210,280 H-280 Z" fill="url(#vz-mio)" />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M-274,${-250 + i * 54} Q-258,${-232 + i * 54} -246,${-258 + i * 56}`} fill="none" stroke="#5E1420" strokeWidth={2.4} opacity={0.4} />)}
          {/* Músculo papilar */}
          <path d="M-210,280 C-190,240 -152,196 -124,174 C-112,168 -102,176 -100,190 C-98,230 -106,260 -116,280 Z" fill="url(#vz-mio)" />
          <path d="M-178,262 C-160,230 -140,206 -122,192" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.18} />
        </g>
      ))}
      {cuerdas(1)}{cuerdas(-1)}
      {/* Las dos valvas, gruesas y fibrosas */}
      {[1, -1].map((l) => (
        <g key={l} transform={`scale(${l},1)`}>
          <path d={VALVA} fill="url(#vz-valva)" stroke="#B5626C" strokeWidth={2.4} strokeLinejoin="round" />
          {[0, 1, 2].map((i) => <path key={i} d={`M${-226 + i * 8},${-88 + i * 9} C${-170 + i * 8},${-56 + i * 9} ${-98 + i * 6},${-2 + i * 8} ${-30 + i * 4},${50 + i * 4}`} fill="none" stroke="#D08A8E" strokeWidth={1.3} opacity={0.6} />)}
          <path d="M-226,-96 C-170,-66 -92,-10 -18,50" fill="none" stroke="#FFF" strokeWidth={3.4} strokeLinecap="round" opacity={0.6} />
        </g>
      ))}
    </g>
  );
});

const ArteBacteria = (rl: number) => (
  <g>
    <g transform={`rotate(${f1(Math.sin(rl / 700) * 6 - 18)})`}>
      {[-1, 1].map((l) => <path key={l} d={`M${l * 38},0 c${l * 14},-12 ${l * 16},12 ${l * 30},0`} fill="none" stroke="#14695F" strokeWidth={3} strokeLinecap="round" />)}
      <rect x={-40} y={-19} width={80} height={38} rx={19} fill="#2CB88A" stroke="#14695F" strokeWidth={2} />
      <rect x={-30} y={-13} width={36} height={8} rx={4} fill="#FFF" opacity={0.5} />
      <circle cx={-12} cy={6} r={3.4} fill="#14695F" /><circle cx={14} cy={3} r={3.4} fill="#14695F" />
    </g>
    <path d="M-52,-46 L52,46" stroke="#D1293D" strokeWidth={9} strokeLinecap="round" />
  </g>
);

const ArteAmbosLados = (
  <g>
    <path d="M-92,-8 C-40,-16 40,-16 92,-8 L92,12 C40,4 -40,4 -92,12 Z" fill="#F4C6BE" stroke="#B5626C" strokeWidth={2} />
    {[[-48, -22, 14, 1], [10, -24, 16, 2], [54, -20, 12, 3], [-26, 22, 13, 4], [34, 22, 15, 5]].map(([x, y, r, sem]) => <Verruga key={sem} x={x} y={y} r={r} k={1} sem={sem} />)}
    <path d="M-104,-46 l8,-12 l8,12 M-96,-58 V-30" fill="none" stroke="#6E7789" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-104,44 l8,12 l8,-12 M-96,56 V28" fill="none" stroke="#6E7789" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export function FondoValva({ t, reloj }: { t: T; reloj: number }) {
  const co = v(t, 'corazon'), va = v(t, 'valva'), ve = v(t, 'vegetaciones'), es = v(t, 'esteril'), em = v(t, 'embolo'), v1 = v(t, 'v1'), v3 = v(t, 'v3');
  const eq = easeInOut(em);
  const dest = { x: 1440, y: 846 }, ori = { x: VZ.cx + 44, y: VZ.cy + 46 }, ctrl = { x: 1160, y: 790 };
  const px = (1 - eq) ** 2 * ori.x + 2 * (1 - eq) * eq * ctrl.x + eq * eq * dest.x, py = (1 - eq) ** 2 * ori.y + 2 * (1 - eq) * eq * ctrl.y + eq * eq * dest.y;
  return (
    <g>
      <Base />
      {co > 0.001 && (
        <g opacity={co}>
          <IconoOrgano i="corazon" x={250} y={490} k={3 * (0.85 + 0.15 * easeBack(co))} />
          <circle cx={285} cy={474} r={30} className={s.marcaMitral} />
          <text x={250} y={706} textAnchor="middle" className={rotulo}>válvula mitral</text>
        </g>
      )}
      {va > 0.001 && <line x1={314} y1={468} x2={VZ.cx - VZ.r - 8} y2={VZ.cy - 34} className={s.hiloLupa} opacity={va} />}
      <Lente id="vz-l" x={VZ.cx} y={VZ.cy} r={VZ.r} k={va}>
        <ValvaFija />
        {[[-120, -190, 0], [90, -170, 1], [-50, 170, 2], [40, 216, 3]].map(([x, y, i]) => <use key={i} href="#sg-rbc" transform={`translate(${f1(x + Math.sin(reloj / 900 + i) * 8)},${f1(y + Math.cos(reloj / 800 + i) * 6)}) rotate(${i * 60}) scale(0.9,${(0.5 + 0.4 * Math.abs(Math.cos(reloj / 1000 + i))).toFixed(2)})`} opacity={0.55} />)}
        {VERRUGAS.map(([x, y, r, sem], i) => <Verruga key={sem} x={x} y={y} r={r} k={easeOut(tramo(ve, i * 0.07, 0.4 + i * 0.07))} sem={sem} />)}
        <g opacity={tramo(va, 0.5, 1)}>
          <text x={0} y={-214} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>aurícula izquierda</text>
          <text x={0} y={246} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>ventrículo</text>
        </g>
        {/* Escala */}
        <g transform="translate(-118,126)" opacity={tramo(ve, 0.5, 1)}>
          <path d="M-22,0 H22 M-22,-5 V5 M22,-5 V5" stroke="#3A2230" strokeWidth={3} strokeLinecap="round" />
          <text y={22} textAnchor="middle" className={s.sgMini}>1 a 3 mm</text>
        </g>
      </Lente>
      <Titulo x={1090} y={124} t="Endocarditis de Libman-Sacks" sub="verrugas de 1 a 3 mm · mitral y aórtica" k={v1} tam={30} />
      {/* Estériles */}
      <Flotante x={1190} y={330} k={es} rl={reloj} esc={1.35} alto={72}>{ArteBacteria(reloj)}</Flotante>
      <Nota x={1300} y={322} t="Estériles: sin bacterias" sub="verrugosa no bacteriana" k={es} fin="start" tam={23} />
      {/* A ambos lados */}
      <Flotante x={1190} y={560} k={v3} rl={reloj} fase={2} esc={1.3} alto={84}>{ArteAmbosLados}</Flotante>
      <Nota x={1330} y={552} t="A ambos lados" sub="de la valva" k={v3} fin="start" tam={23} />
      {/* El émbolo viaja de la válvula al cerebro */}
      {em > 0.001 && (
        <g>
          <path d={`M${ori.x},${ori.y} Q${ctrl.x},${ctrl.y} ${dest.x},${dest.y}`} className={s.trayectoEmbolo} {...dibujar(eq)} />
          <g opacity={tramo(em, 0.5, 0.85)}>
            <IconoOrgano i="cerebro" x={dest.x + 34} y={dest.y - 14} k={1} />
            <circle cx={dest.x + 12} cy={dest.y - 22} r={22 + Math.sin(reloj / 280) * 3} fill="url(#pl-infl)" />
          </g>
          <g transform={`translate(${f1(px)},${f1(py)})`}><Verruga x={0} y={0} r={15} k={1} sem={3} /></g>
          <Nota x={1180} y={920} t="Puede soltar émbolos" sub="sobre todo con antifosfolípidos" k={tramo(em, 0.3, 1)} tam={23} />
        </g>
      )}
    </g>
  );
}

// ─── Paso 1 · coronaria ───────────────────────────────────────────────────────

const yCa = (x: number) => 340 + 6 * Math.sin(x / 180 + 0.4);
const yCb = (x: number) => 540 + 6 * Math.sin(x / 200 + 2);
const LUZ_C = banda(yCa, yCb);
const X_PL = { a: 480, b: 1000, m: 740 };
const ALTO_PL = 118;
/** Cuánto ocupa la placa en cada x: la corriente se aprieta por debajo. */
const huecoPlaca = (x: number, k: number) => (x <= X_PL.a || x >= X_PL.b ? 0 : Math.sin(((x - X_PL.a) / (X_PL.b - X_PL.a)) * Math.PI) ** 0.8 * ALTO_PL * k);

const GrasaEpicardica = memo(function GrasaEpicardica() {
  const fila = (y0: number, sem: number) => Array.from({ length: 44 }, (_, i) => {
    const x = -280 + i * 50 + hash(i, sem) * 18, y = y0 + (i % 2) * 28 + hash(i, sem + 1) * 8, r = 22 + hash(i, sem + 2) * 7;
    return (
      <g key={`${sem}-${i}`} transform={`translate(${f1(x)},${f1(y)})`}>
        <circle r={r} fill="url(#sg-gra)" className={s.sgGraF} />
        <ellipse cx={r * 0.5} cy={r * 0.55} rx={4.4} ry={2.2} className={s.sgGraN} />
        <ellipse cx={-r * 0.3} cy={-r * 0.36} rx={r * 0.28} ry={r * 0.12} fill="#FFF" opacity={0.5} />
      </g>
    );
  });
  return <g>{fila(208, 3)}{fila(652, 7)}</g>;
});

const ParedCoronaria = memo(function ParedCoronaria() {
  return (
    <g>
      <Pared f={yCa} sig={1} sem={11} />
      <Pared f={yCb} sig={-1} sem={23} />
      <path d={LUZ_C} fill="url(#sg-plasma)" />
    </g>
  );
});

/** Placa: capa fibrosa, núcleo de lípidos, cristales de colesterol, espumosas y calcio. */
const PlacaFija = memo(function PlacaFija() {
  const W = (X_PL.b - X_PL.a) / 2;
  return (
    <g>
      <defs>
        <linearGradient id="cr-pl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F2D795" /><stop offset="1" stopColor="#EBC06A" /></linearGradient>
        <linearGradient id="cr-cap" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFFBF2" stopOpacity="0" /><stop offset="1" stopColor="#FFFBF2" /></linearGradient>
      </defs>
      <path d={`M${-W},-4 C${-W * 0.58},${ALTO_PL * 1.18} ${W * 0.58},${ALTO_PL * 1.18} ${W},-4 Z`} fill="url(#cr-pl)" stroke="#B88A3C" strokeWidth={1.6} />
      {/* Núcleo necrótico con cristales */}
      <path d={`M${-W * 0.52},4 C${-W * 0.36},${ALTO_PL * 0.84} ${W * 0.36},${ALTO_PL * 0.84} ${W * 0.52},4 Z`} fill="#C58A2E" />
      {Array.from({ length: 26 }, (_, i) => { const x = -W * 0.42 + hash(i, 2) * W * 0.84, y = 12 + hash(i, 3) * ALTO_PL * 0.46, a = hash(i, 4) * 180; return <rect key={i} x={f1(x)} y={f1(y)} width={18} height={2.6} rx={1} fill="#FFF7DC" opacity={0.92} transform={`rotate(${a.toFixed(0)} ${f1(x)} ${f1(y)})`} />; })}
      {/* Células espumosas en los flancos */}
      {[-1, 1].flatMap((l) => Array.from({ length: 7 }, (_, i) => {
        const x = l * (W * 0.62 + (i % 3) * 18 - (i > 3 ? 36 : 0)), y = 12 + i * 8 + (i % 2) * 6;
        return (
          <g key={`${l}${i}`} transform={`translate(${f1(x)},${f1(y)})`}>
            <circle r={13} fill="#FBEFD0" stroke="#C6A052" strokeWidth={1} />
            {[[-4, -3], [4, -4], [0, 3], [-5, 5], [6, 4]].map(([cx, cy], j) => <circle key={j} cx={cx} cy={cy} r={2.4} fill="#E9CE86" />)}
            <circle cx={6} cy={-6} r={2.8} fill="#7D4E86" />
          </g>
        );
      }))}
      {/* Calcio */}
      {[[-W * 0.22, 26], [W * 0.26, 18]].map(([x, y], i) => <path key={i} d={lobulos(9, 7, 0.26, i + 4)} transform={`translate(${f1(x)},${y})`} fill="#F4F6FA" stroke="#8E98AD" strokeWidth={1} />)}
      {/* Capa fibrosa hacia la luz */}
      <path d={`M${-W},-4 C${-W * 0.58},${ALTO_PL * 1.18} ${W * 0.58},${ALTO_PL * 1.18} ${W},-4`} fill="none" stroke="#FFF8EC" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
});

export const ArteManometro = (rl: number, alto = 1) => {
  const ang = lerp(-40, 62, alto) + Math.sin(rl / 260) * 2.4;
  return (
    <g>
      <path d="M-42,18 C-58,24 -62,44 -46,50" fill="none" stroke="#3A4256" strokeWidth={5} strokeLinecap="round" />
      <circle r={44} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.2} />
      <circle r={36} fill="#FFFDF8" />
      <path d={`M${f1(Math.sin(0.5) * 28)},${f1(-Math.cos(0.5) * 28)} A28,28 0 0 1 ${f1(Math.sin(1.5) * 28)},${f1(-Math.cos(1.5) * 28)}`} fill="none" stroke="#E5484D" strokeWidth={9} />
      {Array.from({ length: 11 }, (_, i) => { const a = ((-90 + i * 18) * Math.PI) / 180; return <line key={i} x1={Math.sin(a) * 28} y1={-Math.cos(a) * 28} x2={Math.sin(a) * 34} y2={-Math.cos(a) * 34} stroke="#3A4256" strokeWidth={1.6} />; })}
      <g transform={`rotate(${f1(ang)})`}><path d="M-3,6 L0,-32 L3,6 Z" fill="#D1293D" /></g>
      <circle r={5} fill="#3A4256" />
    </g>
  );
};

/** Hematíes por la coronaria: se aprietan por debajo de la placa y se desvanecen al dar la vuelta. */
function CorrienteC({ pl, reloj }: { pl: number; reloj: number }) {
  const X0 = -420, A = 2440;
  const borde = (x: number) => tramo(x, X0, X0 + 160) * (1 - tramo(x, X0 + A - 160, X0 + A));
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => {
        const x = X0 + ((i * 113 + reloj * (0.045 + hash(i, 1) * 0.03)) % A), h = huecoPlaca(x, pl), arriba = yCa(x) + 18 + h, abajo = yCb(x) - 18;
        const y = lerp(arriba, abajo, hash(i, 2)), g = reloj / 900 + i * 2.1, q = 0.8 + hash(i, 3) * 0.32;
        return <use key={i} href="#sg-rbc" opacity={borde(x) * 0.95} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1((g * 0.4 * 180) / Math.PI)}) scale(${q.toFixed(2)},${(q * (0.36 + 0.64 * Math.abs(Math.cos(g)))).toFixed(2)})`} />;
      })}
    </g>
  );
}

export function FondoCoronaria({ t, reloj }: { t: T; reloj: number }) {
  const ar = v(t, 'arteria'), pl = v(t, 'placaAt'), ti = v(t, 'kAt'), f1k = v(t, 'c1'), f2k = v(t, 'c2'), f3k = v(t, 'c3'), f4k = v(t, 'c4'), mu = v(t, 'muj');
  const k = easeOut(pl);
  return (
    <g opacity={ar}>
      <Base />
      <GrasaEpicardica />
      <ParedCoronaria />
      <CorrienteC pl={k} reloj={reloj} />
      {k > 0.001 && <g transform={`translate(${X_PL.m},${f1(yCa(X_PL.m) - 2)}) scale(${(0.6 + 0.4 * k).toFixed(3)},${k.toFixed(3)})`}><PlacaFija /></g>}
      {/* Lo que quedó de luz, con su marca */}
      {k > 0.4 && (
        <g opacity={tramo(pl, 0.4, 0.9)}>
          <line x1={X_PL.m + 196} y1={404} x2={X_PL.m + 300} y2={468} className={s.guia} />
        </g>
      )}
      <text x={120} y={460} className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Arteria coronaria</text>
      {pl > 0.5 && <text x={X_PL.m + 306} y={486} className={`${s.lEtiquetaRoja} ${s.conHalo}`} opacity={tramo(pl, 0.5, 1)}>placa de ateroma</text>}
      <Titulo x={800} y={64} t="Aterosclerosis coronaria acelerada" sub="una de las principales causas de muerte en el lupus de larga evolución" k={ti} fin="middle" tam={32} />
      {/* Lo que la empuja, con flechas hacia la arteria */}
      <FlechaViva a={{ x: 190, y: 742 }} c={{ x: 340, y: 700 }} b={{ x: 520, y: 650 }} k={tramo(f1k, 0.2, 1)} rl={reloj} color="#7B4FC9" />
      <FlechaViva a={{ x: 470, y: 742 }} c={{ x: 560, y: 700 }} b={{ x: 640, y: 650 }} k={tramo(f2k, 0.2, 1)} rl={reloj} color="#E0526E" fase={0.25} />
      <FlechaViva a={{ x: 750, y: 742 }} c={{ x: 752, y: 700 }} b={{ x: 760, y: 650 }} k={tramo(f3k, 0.2, 1)} rl={reloj} color="#D1293D" fase={0.5} />
      <FlechaViva a={{ x: 1030, y: 742 }} c={{ x: 960, y: 700 }} b={{ x: 880, y: 650 }} k={tramo(f4k, 0.2, 1)} rl={reloj} color="#B8433E" fase={0.75} />
      <Flotante x={190} y={800} k={f1k} rl={reloj} esc={1} alto={58}><ComplejoRed n={7} d={112} /></Flotante>
      <Nota x={190} y={896} t="Inmunocomplejos e inflamación" sub="dañan el endotelio" k={f1k} tam={19} />
      <Flotante x={470} y={800} k={f2k} rl={reloj} fase={1.5} esc={1.4} alto={58}>{ArteCorticoide}</Flotante>
      <Nota x={470} y={896} t="Corticoides" k={f2k} tam={19} />
      <Flotante x={750} y={800} k={f3k} rl={reloj} fase={3} esc={1.2} alto={62}>{ArteManometro(reloj, tramo(f3k, 0.3, 1))}</Flotante>
      <Nota x={750} y={896} t="Hipertensión" k={f3k} tam={19} />
      <Flotante x={1030} y={800} k={f4k} rl={reloj} fase={4.5} esc={1} alto={58}><IconoOrgano i="rinon" x={0} y={0} k={1.05} /></Flotante>
      <Nota x={1030} y={896} t="Enfermedad renal" k={f4k} tam={19} />
      {/* La paciente joven con dolor en el pecho */}
      {mu > 0.001 && (
        <g opacity={tramo(mu, 0, 0.5)} transform={`translate(0,${f1((1 - easeOut(mu)) * 20)})`}>
          <g transform="translate(1360,640) scale(0.29)">
            <Retrato id="corMuj" />
          </g>
          <circle cx={1360} cy={906} r={32 + Math.sin(reloj / 260) * 5} fill="url(#pl-infl)" />
          {[0, 1, 2].map((j) => { const f = (reloj / 900 + j / 3) % 1; return <circle key={j} cx={1360} cy={906} r={14 + f * 34} fill="none" stroke="#D1293D" strokeWidth={2.4} opacity={(1 - f) * 0.7} />; })}
          <Nota x={1360} y={950} t="Joven con dolor en el pecho" sub="no lo descartes por la edad" k={mu} tam={20} />
        </g>
      )}
    </g>
  );
}

// ─── Pasos 2 y 4 · tórax ──────────────────────────────────────────────────────

/** Medidas compartidas: pulmones reales y corazón real, en sus sitios. */
const TX = { x: 490, y: 500, k: 3.6 };
const CZ = { x: 516, y: 540, k: 1.3 };
const enPulmones = `translate(${TX.x},${TX.y}) scale(${TX.k * 0.96}) translate(0,4)`;
const enCorazon = `translate(${CZ.x},${CZ.y}) scale(${CZ.k * 0.92}) translate(0,6)`;

const ToraxFijo = memo(function ToraxFijo() {
  return (
    <g>
      <path d="M140,150 C260,104 720,104 840,150 C880,320 890,650 870,880 L110,880 C90,650 100,320 140,150 Z" className={s.toraxPared} />
      {/* Columna, costillas, esternón y clavículas: en segundo plano, con poco contraste */}
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={466} y={186 + i * 56} width={48} height={40} rx={9} className={s.ctVertebra} />)}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          {[`M470,${220 + i * 76} C380,${200 + i * 78} 230,${232 + i * 80} 150,${320 + i * 74}`, `M510,${220 + i * 76} C600,${200 + i * 78} 750,${232 + i * 80} 830,${320 + i * 74}`].map((d, j) => (
            <g key={j}>
              <path d={d} fill="none" className={s.ctHuesoFilo} strokeWidth={25} strokeLinecap="round" />
              <path d={d} fill="none" className={s.ctHueso} strokeWidth={22} strokeLinecap="round" />
              <path d={d} fill="none" className={s.ctBrillo} strokeWidth={5} strokeLinecap="round" transform="translate(0,-5)" />
            </g>
          ))}
        </g>
      ))}
      {['M470,178 C400,146 290,150 196,190', 'M510,178 C580,146 690,150 784,190'].map((d) => (
        <g key={d}><path d={d} fill="none" className={s.ctHuesoFilo} strokeWidth={21} strokeLinecap="round" /><path d={d} fill="none" className={s.ctHueso} strokeWidth={18} strokeLinecap="round" /></g>
      ))}
      <path d="M180,862 C300,812 420,842 490,870 C560,842 680,812 800,862" className={s.diafragma} />
      <g transform={`translate(${TX.x},${TX.y}) scale(${TX.k})`}><Pulmones /></g>
      <g transform={`translate(${CZ.x},${CZ.y}) scale(${CZ.k})`}><Corazon /></g>
    </g>
  );
});

export function FondoTorax({ t, reloj }: { t: T; reloj: number }) {
  const tx = v(t, 'torax'), pl = v(t, 'pleuraI'), dp = v(t, 'derrameP'), pc = v(t, 'pericardio'), dc = v(t, 'derrameC');
  const a1 = v(t, 'tx1'), a2 = v(t, 'tx2'), a3 = v(t, 'tx3'), a4 = v(t, 'tx4'), a5 = v(t, 'tx5');
  return (
    <g opacity={tx}>
      <Base />
      <ToraxFijo />
      {pl > 0.001 && (
        <g opacity={pl} transform={enPulmones}>
          <path d={CONTORNO.pulmonD} className={s.serosaInflamada} vectorEffect="non-scaling-stroke" />
          <path d={CONTORNO.pulmonI} className={s.serosaInflamada} vectorEffect="non-scaling-stroke" />
        </g>
      )}
      {/* Derrame pleural: se acumula en la base del pulmón, con el menisco arriba */}
      {dp > 0.001 && (
        <g transform={enPulmones} clipPath="url(#an-c-pulmond)">
          <path d={`M-100,${86 - 44 * dp} Q-50,${80 - 40 * dp} 0,${86 - 44 * dp} L0,100 L-100,100 Z`} className={s.derrame} />
        </g>
      )}
      {pc > 0.001 && <g transform={enCorazon} opacity={pc}><path d={CONTORNO.corazon} transform="scale(1.13)" className={s.serosaInflamada} vectorEffect="non-scaling-stroke" /></g>}
      {dc > 0.001 && <g transform={enCorazon} opacity={dc}><path d={CONTORNO.corazon} transform="scale(1.13)" className={s.derrameCardio} vectorEffect="non-scaling-stroke" /></g>}
      {/* Solo texto y flechas */}
      <Titulo x={960} y={170} t="Serositis" sub="pleura y pericardio" k={a1} tam={40} color="#C2385A" />
      <Titulo x={960} y={340} t="Pleuritis" sub="dolor que aumenta al respirar · derrame" k={a2} tam={30} />
      <FlechaViva a={{ x: 950, y: 332 }} c={{ x: 880, y: 330 }} b={{ x: 800, y: 420 }} k={tramo(a2, 0.1, 0.8)} rl={reloj} color="#D1293D" />
      <Titulo x={960} y={530} t="Pericarditis" sub="mejora al inclinarse hacia adelante · derrame" k={a3} tam={30} />
      <FlechaViva a={{ x: 950, y: 522 }} c={{ x: 840, y: 512 }} b={{ x: 668, y: 566 }} k={tramo(a3, 0.1, 0.8)} rl={reloj} color="#D1293D" fase={0.4} />
      <Sello x={1170} y={724} w={420} txt="AGUDA: 6 PUNTOS" k={a4} sz={30} rot={-3} />
      <text x={1170} y={786} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(a4, 0.5, 1)}>en los criterios de clasificación</text>
      <text x={1170} y={838} textAnchor="middle" className={rotulo} style={{ fontSize: 22 }} opacity={tramo(a5, 0, 0.5)}>Guárdalo: lo vamos a usar</text>
    </g>
  );
}

// ─── Paso 3 · bazo: hojas de cebolla ──────────────────────────────────────────

const BazoFijo = memo(function BazoFijo() {
  return (
    <g>
      <defs>
        <radialGradient id="lp-bazo" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stopColor="#C4687E" /><stop offset="0.55" stopColor="#8E3A54" /><stop offset="1" stopColor="#511C32" /></radialGradient>
        <clipPath id="lp-c-bazo"><path d="M116,186 C130,156 156,136 182,130 L190,146 L206,124 C250,112 304,130 340,168 C368,200 370,248 348,290 C332,304 322,312 316,332 C296,380 238,416 182,404 C134,394 100,352 96,298 C92,256 100,218 116,186 Z" /></clipPath>
      </defs>
      <Tubo d="M318,290 C350,312 382,332 420,348" w={12} tono={VENA} />
      <Tubo d="M324,268 C356,288 390,308 426,324" w={9} tono={ARTERIA} />
      <path d="M116,186 C130,156 156,136 182,130 L190,146 L206,124 C250,112 304,130 340,168 C368,200 370,248 348,290 C332,304 322,312 316,332 C296,380 238,416 182,404 C134,394 100,352 96,298 C92,256 100,218 116,186 Z" fill="url(#lp-bazo)" stroke="#3E1426" strokeWidth={2} />
      <g clipPath="url(#lp-c-bazo)">
        {/* Pulpa blanca sobre la pulpa roja */}
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={100 + hash(i, 3) * 260} cy={130 + hash(i, 4) * 280} r={2.4 + hash(i, 5) * 3} fill="#F0C8D4" opacity={0.42} />)}
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${120 + i * 26},${140 + (i % 2) * 20} C${150 + i * 18},${220} ${130 + i * 22},${320} ${160 + i * 20},${400}`} fill="none" stroke="#3E1426" strokeWidth={1.4} opacity={0.22} />)}
        <path d="M120,300 C150,360 220,396 300,360" fill="none" stroke="#3E1426" strokeWidth={22} opacity={0.2} />
      </g>
      <path d="M182,130 L190,146 L172,174 M206,124 L220,150" fill="none" stroke="#3E1426" strokeWidth={2.2} opacity={0.6} />
      <ellipse cx={178} cy={226} rx={56} ry={30} fill="#FFF" opacity={0.22} transform="rotate(-30 178 226)" />
      <path d="M128,196 C142,166 164,150 186,144" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
    </g>
  );
});

const PulpaFija = memo(function PulpaFija() {
  return (
    <g>
      <rect x={-300} y={-300} width={600} height={600} fill="#F6D2DA" />
      {/* Pulpa roja: senos con hematíes */}
      {Array.from({ length: 70 }, (_, i) => { const a = hash(i, 8) * TAU, r = 190 + hash(i, 9) * 110; return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} rx={8} ry={5} fill="#D8606A" opacity={0.72} transform={`rotate(${i * 37} ${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)})`} />; })}
      {/* Pulpa blanca: linfocitos apretados alrededor de la arteria */}
      {Array.from({ length: 260 }, (_, i) => { const a = hash(i, 2) * TAU, r = 118 + hash(i, 3) * 106; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={4.6} fill={i % 3 ? '#4E3E9A' : '#6E5AB8'} opacity={0.86} />; })}
    </g>
  );
});

/** Cada hoja crece hacia fuera con sus fibras y sus núcleos aplanados. */
function Hojas({ ca, reloj }: { ca: number; reloj: number }) {
  const N = 9;
  return (
    <g>
      {Array.from({ length: N }, (_, i) => {
        const q = N - 1 - i, k = easeOut(tramo(ca, q / N, (q + 1) / N));
        if (k <= 0.001) return null;
        const r = 30 + (q + 0.5) * 12.6;
        return (
          <g key={q} opacity={k}>
            <circle r={r} fill="none" stroke={q % 2 ? '#F6B6C4' : '#E7869C'} strokeWidth={12.6 * k} />
            {Array.from({ length: 10 + q * 3 }, (_, j) => { const a = (j / (10 + q * 3)) * TAU + q * 0.5; return <ellipse key={j} cx={Math.cos(a) * r} cy={Math.sin(a) * r} rx={7} ry={2.1} fill="#5A2E7E" transform={`rotate(${f1((a * 180) / Math.PI + 90)} ${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)})`} />; })}
          </g>
        );
      })}
      <circle r={30} fill="#7E1E2C" />
      <circle r={24} fill="#FCEAE0" />
      {[0, 1, 2].map((j) => <ellipse key={j} cx={-9 + j * 9 + Math.sin(reloj / 800 + j) * 1.5} cy={-6 + (j % 2) * 12} rx={7.4} ry={5} fill="#D8423E" stroke="#7E1E22" strokeWidth={0.8} transform={`rotate(${j * 50} ${-9 + j * 9} ${-6 + (j % 2) * 12})`} />)}
    </g>
  );
}

const ArteCebolla = (
  <g>
    <path d="M0,-82 C-12,-70 -20,-62 -26,-52 C-62,-40 -78,-10 -76,18 C-74,58 -38,84 0,84 C38,84 74,58 76,18 C78,-10 62,-40 26,-52 C20,-62 12,-70 0,-82 Z" fill="#C89AD8" stroke="#6E3E8E" strokeWidth={2.4} />
    {[62, 50, 38, 26, 15].map((r, i) => <ellipse key={r} cy={14} rx={r} ry={r * 0.94} fill={i % 2 ? '#F4E4F8' : '#FBF4FC'} stroke="#A878BE" strokeWidth={1.8} />)}
    <ellipse cy={14} rx={5} ry={5} fill="#D8B8E2" />
    <path d="M-28,-48 C-14,-58 14,-58 28,-48" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    {[-10, 0, 10].map((x) => <path key={x} d={`M${x},82 q${x * 0.3},12 ${x * 0.5},18`} fill="none" stroke="#B8A080" strokeWidth={2} strokeLinecap="round" />)}
  </g>
);

export function FondoCebolla({ t, reloj }: { t: T; reloj: number }) {
  const ba = v(t, 'bazo'), ca = v(t, 'capasBazo'), b1 = v(t, 'b1'), b2 = v(t, 'b2'), b3 = v(t, 'b3');
  const C = { x: 690, y: 540 };
  return (
    <g opacity={ba}>
      <Base />
      <BazoFijo />
      <text x={230} y={456} textAnchor="middle" className={rotulo}>bazo</text>
      <circle cx={340} cy={290} r={24} className={s.marcaMitral} />
      <line x1={360} y1={304} x2={C.x - 214} y2={C.y - 176} className={s.hiloLupa} />
      <Lente id="cb-l" x={C.x} y={C.y} r={280} k={ba}>
        <PulpaFija />
        <Hojas ca={ca} reloj={reloj} />
      </Lente>
      <text x={C.x} y={C.y + 362} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`}>arteria peniciliar en corte</text>
      <Titulo x={1040} y={214} t="Hiperplasia concéntrica" sub="del músculo liso y de la íntima" k={b1} tam={28} />
      <FlechaViva a={{ x: 1032, y: 240 }} c={{ x: 930, y: 300 }} b={{ x: 806, y: 440 }} k={tramo(b1, 0.1, 0.8)} rl={reloj} color="#7B4FC9" />
      <Flotante x={1190} y={510} k={b2} rl={reloj} esc={1.2} alto={108}>{ArteCebolla}</Flotante>
      <Nota x={1330} y={510} t="Como una cebolla" sub="capas alrededor de la luz" k={b2} fin="start" tam={25} />
      <Sello x={1270} y={776} w={500} txt="ESA IMAGEN → LUPUS" k={b3} sz={30} rot={-3} />
    </g>
  );
}

// ─── Paso 4 · pulmón ──────────────────────────────────────────────────────────

const Alveolos = memo(function Alveolos() {
  const A: [number, number, number][] = [[-70, -66, 44], [20, -82, 40], [92, -30, 42], [-96, 22, 42], [-14, 2, 44], [76, 50, 40], [-52, 88, 40], [28, 92, 36]];
  return (
    <g>
      <rect x={-150} y={-150} width={300} height={300} fill="#E8909A" />
      {/* Intersticio engrosado con fibras y células */}
      {Array.from({ length: 34 }, (_, i) => <path key={i} d={`M${f1(-140 + hash(i, 2) * 280)},${f1(-140 + hash(i, 3) * 280)} q${f1((hash(i, 4) - 0.5) * 34)},${f1((hash(i, 5) - 0.5) * 34)} ${f1((hash(i, 6) - 0.5) * 50)},${f1((hash(i, 7) - 0.5) * 50)}`} fill="none" stroke="#B5455C" strokeWidth={2} opacity={0.65} />)}
      {A.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d={lobulos(r, 9, 0.08, i + 3)} fill="#FDF0EC" stroke="#C25D74" strokeWidth={2} />
          <path d={lobulos(r * 0.8, 8, 0.1, i + 5)} fill="none" stroke="#F4C4C4" strokeWidth={1.4} />
        </g>
      ))}
      {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={f1(-140 + hash(i, 9) * 280)} cy={f1(-140 + hash(i, 10) * 280)} r={3.4} fill="#4E3E9A" opacity={0.82} />)}
    </g>
  );
});

const ArteCorazonVD = (rl: number) => (
  <g transform={`scale(${(1 + 0.025 * Math.sin(rl / 300)).toFixed(3)})`}>
    <IconoOrgano i="corazon" x={0} y={0} k={1.1} />
    <g transform="scale(0.55)"><path d="M-30,-14 C-44,0 -50,24 -36,52 C-14,68 8,76 28,88 C16,60 8,30 8,-6 C4,-20 -16,-24 -30,-14 Z" fill="#E5293F" opacity={0.75} stroke="#7E1420" strokeWidth={2} /></g>
  </g>
);

export function FondoPulmon({ t, reloj }: { t: T; reloj: number }) {
  const pu = v(t, 'pulmones'), it = v(t, 'intersticio'), hp = v(t, 'hp'), q1 = v(t, 'q1'), q2 = v(t, 'q2'), q3 = v(t, 'q3');
  return (
    <g opacity={pu}>
      <Base />
      <ToraxFijo />
      {it > 0.001 && (
        <g opacity={it} transform={enPulmones}>
          {[['an-c-pulmond', -46], ['an-c-pulmoni', 50]].map(([id, cx]) => (
            <g key={id} clipPath={`url(#${id})`}>
              {Array.from({ length: 46 }, (_, i) => {
                const x = (cx as number) - 36 + hash(i, 1) * 72, y = -60 + hash(i, 2) * 138;
                return <path key={i} d={`M${x},${y} l${(hash(i, 3) - 0.5) * 16},${(hash(i, 4) - 0.5) * 16} l${(hash(i, 5) - 0.5) * 16},${(hash(i, 6) - 0.5) * 16}`} className={s.reticular} vectorEffect="non-scaling-stroke" />;
              })}
            </g>
          ))}
        </g>
      )}
      {hp > 0.001 && (
        <g opacity={hp}>
          <g transform={enCorazon}>
            <path d="M-30,-14 C-44,0 -50,24 -36,52 C-14,68 8,76 28,88 C16,60 8,30 8,-6 C4,-20 -16,-24 -30,-14 Z" className={s.ventriculoDerecho} />
            <Tubo d="M14,-24 C14,-44 20,-58 32,-66 C50,-72 66,-72 84,-68" w={21 + 11 * hp} tono={VENA} />
          </g>
          <line x1={640} y1={395} x2={664} y2={290} className={s.guia} />
          <text x={664} y={276} textAnchor="middle" className={`${s.lEtiquetaRoja} ${s.conHalo}`} style={{ fontSize: 19 }}>arteria pulmonar dilatada</text>
          <line x1={470} y1={620} x2={330} y2={740} className={s.guia} />
          <text x={330} y={764} textAnchor="middle" className={`${s.lEtiquetaRoja} ${s.conHalo}`} style={{ fontSize: 19 }}>ventrículo derecho</text>
        </g>
      )}
      {/* 1 · Intersticial: la lente sobre el alvéolo */}
      {it > 0.001 && <line x1={790} y1={420} x2={962} y2={282} className={s.hiloLupa} opacity={it} />}
      <Lente id="pm-l" x={1070} y={210} r={120} k={q1}><Alveolos /></Lente>
      <Nota x={1214} y={190} t="Enfermedad intersticial" sub="disnea progresiva, tos seca," k={q1} fin="start" tam={24} />
      {q1 > 0.001 && <text x={1214} y={240} className={halo} opacity={tramo(q1, 0.3, 0.9)}>menor difusión del oxígeno</text>}
      {/* 2 · Hipertensión pulmonar */}
      <Flotante x={1070} y={510} k={q2} rl={reloj} esc={1.5} alto={78}>{ArteManometro(reloj, tramo(q2, 0.3, 1))}</Flotante>
      <Nota x={1214} y={492} t="Hipertensión pulmonar" sub="vasos, daño del pulmón," k={q2} fin="start" tam={24} />
      {q2 > 0.001 && <text x={1214} y={542} className={halo} opacity={tramo(q2, 0.3, 0.9)}>tromboembolias (antifosfolípidos)</text>}
      {/* 3 · Consecuencia */}
      <FlechaViva a={{ x: 1070, y: 612 }} c={{ x: 1058, y: 650 }} b={{ x: 1070, y: 694 }} k={tramo(q3, 0, 0.5)} rl={reloj} color="#D1293D" />
      <Flotante x={1070} y={806} k={q3} rl={reloj} fase={2} esc={1} alto={108}>{ArteCorazonVD(reloj)}</Flotante>
      <Nota x={1214} y={800} t="Insuficiencia del" k={q3} fin="start" tam={24} />
      {q3 > 0.001 && <text x={1214} y={832} className={rotulo} style={{ fontSize: 24 }} opacity={tramo(q3, 0.3, 0.9)}>ventrículo derecho</text>}
    </g>
  );
}

// ─── Paso 5 · los dos mecanismos ──────────────────────────────────────────────

function ArteAfl({ rl }: { rl: number }) {
  return (
    <g>
      {/* Pared del vaso con su trombo */}
      <rect x={-126} y={-44} width={252} height={88} rx={10} fill="#FBDCD4" />
      <rect x={-126} y={-58} width={252} height={18} fill="#C7506E" /><rect x={-126} y={40} width={252} height={18} fill="#C7506E" />
      <path d="M-14,-40 C-40,-18 -34,20 -8,40 H66 C40,20 44,-18 72,-40 Z" fill="#7E1E2C" />
      {[0, 14, 28, 42].map((x) => <path key={x} d={`M${x},-38 C${x - 12},-14 ${x - 12},14 ${x},38`} fill="none" stroke="#F4A9B4" strokeWidth={2} opacity={0.7} />)}
      {[0, 1, 2].map((j) => { const f = (rl / 1500 + j / 3) % 1; return <ellipse key={j} cx={lerp(-120, -24, f)} cy={(j - 1) * 20} rx={10} ry={6.5} fill="#D8423E" stroke="#7E1E22" strokeWidth={0.8} opacity={1 - f * f} />; })}
      {/* Anticuerpos que lo inician */}
      {[[-84, -82, 180], [-30, -84, 170], [24, -82, 190], [84, -82, 180]].map(([x, y, a], i) => <IgG key={i} x={x + Math.sin(rl / 600 + i) * 2} y={y} ang={a} k={0.92} />)}
    </g>
  );
}

function Blanco({ x, y, k, txt, children }: { x: number; y: number; k: number; txt: string; children: ReactNode }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.5)}>
      <g transform={`translate(${x},${y}) scale(${(0.8 + 0.2 * easeBack(clamp(k))).toFixed(3)})`}>{children}</g>
      <text x={x} y={y + 66} textAnchor="middle" className={halo} style={{ fontSize: 19 }}>{txt}</text>
    </g>
  );
}

export function FondoMecanismos({ t, reloj }: { t: T; reloj: number }) {
  const r1 = v(t, 'r1'), r2 = v(t, 'r2'), r3 = v(t, 'r3'), r4 = v(t, 'r4');
  const sube = Math.sin(reloj / 800) * 6;
  return (
    <g>
      <Base />
      {/* Complejos inmunes: se depositan en serosas, válvulas y vasos */}
      <Flotante x={400} y={230} k={r1} rl={reloj} esc={1} alto={120}><ComplejoRed n={10} d={210} /></Flotante>
      <Titulo x={400} y={92} t="Complejos inmunes" k={r1} fin="middle" tam={32} />
      <FlechaViva a={{ x: 318, y: 356 }} c={{ x: 256, y: 392 }} b={{ x: 186, y: 428 }} k={tramo(r1, 0.3, 0.8)} rl={reloj} color="#2F6FD0" />
      <FlechaViva a={{ x: 400, y: 366 }} c={{ x: 402, y: 396 }} b={{ x: 400, y: 426 }} k={tramo(r1, 0.4, 0.9)} rl={reloj} color="#2F6FD0" fase={0.3} />
      <FlechaViva a={{ x: 482, y: 356 }} c={{ x: 550, y: 392 }} b={{ x: 616, y: 428 }} k={tramo(r1, 0.5, 1)} rl={reloj} color="#2F6FD0" fase={0.6} />
      <Blanco x={170} y={486} k={tramo(r1, 0.4, 0.9)} txt="serosas"><IconoOrgano i="pulmon" x={0} y={0} k={0.8} /></Blanco>
      <Blanco x={400} y={486} k={tramo(r1, 0.5, 1)} txt="válvulas"><IconoOrgano i="corazon" x={0} y={0} k={0.8} /></Blanco>
      <Blanco x={630} y={486} k={tramo(r1, 0.6, 1)} txt="vasos">
        <rect x={-48} y={-20} width={96} height={40} rx={6} fill="#FBDCD4" />
        <rect x={-48} y={-26} width={96} height={9} fill="#C7506E" /><rect x={-48} y={17} width={96} height={9} fill="#C7506E" />
        {[-20, 16].map((x) => <circle key={x} cx={x} cy={-13} r={7} fill="#2F6FD0" stroke="#173A7A" strokeWidth={0.8} />)}
      </Blanco>
      {/* Antifosfolípidos: trombosis */}
      <Flotante x={1180} y={270} k={r2} rl={reloj} fase={2} esc={1.45} alto={96}><ArteAfl rl={reloj} /></Flotante>
      <Titulo x={1180} y={92} t="Antifosfolípidos" k={r2} fin="middle" tam={32} />
      <Nota x={1180} y={420} t="trombosis" k={r2} tam={24} />
      {/* Y ahora, el riñón */}
      {r3 > 0.001 && <text x={800} y={622} textAnchor="middle" className={rotulo} style={{ fontSize: 32 }} opacity={tramo(r3, 0, 0.6)}>Y ahora, el órgano que más define el pronóstico…</text>}
      {r4 > 0.001 && (
        <g opacity={tramo(r4, 0, 0.4)}>
          <ellipse cx={800} cy={952} rx={120 * (1 + sube * 0.008)} ry={9} className={s.sombraSuave} />
          <g transform={`translate(800,${f1(800 + sube + (1 - easeOut(r4)) * 26)}) scale(${(0.8 + 0.2 * easeBack(clamp(r4))).toFixed(3)})`}><IconoOrgano i="rinon" x={0} y={0} k={2.3} /></g>
          <text x={1000} y={812} className={rotulo} style={{ fontSize: 30 }}>el riñón</text>
        </g>
      )}
    </g>
  );
}

