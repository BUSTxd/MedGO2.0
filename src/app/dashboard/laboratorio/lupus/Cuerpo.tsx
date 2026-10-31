'use client';
// El cuerpo de «el gran imitador»: una figura de frente con el canon de 7,5
// cabezas (barbilla, hombros, ombligo, ingle a media altura, rodillas), en tono
// neutro y translúcida, para que manden los órganos que lleva dentro. Cada órgano
// va donde está de verdad: el corazón hacia el lado izquierdo del paciente (a la
// derecha de quien mira), los riñones a la altura lumbar, los pulmones hasta las
// clavículas. También las figuritas de «¿A quién le da?».

import { memo } from 'react';
import { ARTERIA, ARTERIA_FINA, Articulacion, CerebroFrontal, Corazon, Pulmones, Rinon, Tubo, VENA_FINA } from './Anatomia';
import s from '@/styles/lupus.module.css';

/** Eje de la figura en el lienzo. */
export const CX = 400;

type P = readonly [number, number];

/** Curva suave y cerrada que pasa por los puntos (Catmull-Rom a Bézier). */
function suave(pts: readonly P[]): string {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    const k = 1 / 6;
    d += ` C${(b[0] + (c[0] - a[0]) * k).toFixed(1)},${(b[1] + (c[1] - a[1]) * k).toFixed(1)} ${(c[0] - (e[0] - b[0]) * k).toFixed(1)},${(c[1] - (e[1] - b[1]) * k).toFixed(1)} ${c[0]},${c[1]}`;
  }
  return `${d} Z`;
}

/** Media figura (x negativa = a la izquierda de quien mira), de la coronilla a la ingle. */
const MITAD: P[] = [
  [-30, 84], [-50, 106], [-56, 138], [-50, 168], [-30, 194], [-26, 212], [-32, 228], [-66, 240], [-106, 250],
  [-134, 270], [-148, 312], [-157, 368], [-168, 420], [-185, 478], [-198, 528],
  [-214, 556], [-222, 596], [-212, 626], [-198, 618], [-190, 586], [-182, 566], [-176, 530],
  [-152, 472], [-130, 412], [-114, 352], [-98, 316],
  [-94, 356], [-84, 408], [-86, 450], [-102, 500], [-112, 548], [-112, 612], [-96, 690], [-86, 738],
  [-94, 794], [-84, 860], [-60, 914], [-68, 948], [-72, 966], [-46, 972], [-28, 962], [-26, 912], [-32, 842], [-32, 738],
  [-24, 642], [-4, 534],
];
const FIGURA = suave([[0, 78], ...MITAD, ...[...MITAD].reverse().map(([x, y]) => [-x, y] as P)]);

export const Silueta = memo(function Silueta() {
  return (
    <g transform={`translate(${CX},0)`}>
      <defs>
        <radialGradient id="cu-piel" gradientUnits="userSpaceOnUse" cx={-30} cy={340} r={620}>
          <stop offset="0" className={s.cuerpoStop1} /><stop offset="0.6" className={s.cuerpoStop2} /><stop offset="1" className={s.cuerpoStop3} />
        </radialGradient>
      </defs>
      <path d={FIGURA} fill="url(#cu-piel)" className={s.cuerpoContorno} />
      {/* Relieve: clavículas, pecho, costillas, línea alba, pelvis, rótulas y tibias */}
      <g className={s.cuerpoRelieve}>
        <path d="M-10,240 C-40,232 -74,234 -112,250 M10,240 C40,232 74,234 112,250" />
        <path d="M-84,334 C-62,352 -28,352 -6,334 M84,334 C62,352 28,352 6,334" />
        <path d="M0,246 L0,430" opacity={0.6} />
        <path d="M-86,372 C-60,386 -28,396 -6,402 M86,372 C60,386 28,396 6,402" opacity={0.6} />
        <path d="M-100,484 C-74,510 -36,526 -6,534 M100,484 C74,510 36,526 6,534" />
        <path d="M-132,300 C-118,322 -112,340 -112,350 M132,300 C118,322 112,340 112,350" />
        <path d="M-74,716 C-66,706 -46,706 -40,716 C-38,738 -46,750 -56,750 C-68,750 -76,738 -74,716 Z M74,716 C66,706 46,706 40,716 C38,738 46,750 56,750 C68,750 76,738 74,716 Z" />
        <path d="M-60,762 C-62,810 -56,860 -50,900 M60,762 C62,810 56,860 50,900" opacity={0.65} />
        <path d="M-60,560 C-68,610 -68,660 -62,700 M60,560 C68,610 68,660 62,700" opacity={0.5} />
        <path d="M-205,590 L-208,622 M-198,588 L-200,618 M205,590 L208,622 M198,588 L200,618" opacity={0.7} />
        {/* Cara, apenas: la figura no es nadie en concreto */}
        <path d="M-30,132 Q-20,126 -10,132 M30,132 Q20,126 10,132 M-3,140 L-6,158 Q0,162 6,158 M-11,174 Q0,180 11,174" opacity={0.75} />
      </g>
      <circle cx={0} cy={434} r={2.6} className={s.cuerpoOmbligo} />
    </g>
  );
});

// ─── Los vasos (media figura; la otra, reflejada) ─────────────────────────────

const MIEMBRO_A = 'M-22,262 C-56,250 -90,258 -120,296 C-134,340 -140,380 -150,418';
const ANTEBRAZO_A = 'M-150,418 C-158,450 -172,490 -188,530 C-196,552 -202,566 -204,590 M-150,418 C-150,456 -164,496 -180,530 C-188,550 -196,566 -200,578';
const CAROTIDA = 'M-10,262 C-14,240 -16,216 -20,194 C-26,176 -34,160 -40,138 M-20,194 C-30,186 -38,180 -42,170';
const PIERNA_A = 'M2,476 C-22,500 -44,530 -56,570 C-62,620 -62,680 -58,736 C-62,780 -66,840 -56,904 C-54,926 -56,944 -60,956 M-58,736 C-52,780 -50,850 -40,908';
const RAMAS_A = 'M-56,590 C-74,616 -82,650 -82,684 M-136,350 C-126,366 -124,384 -128,400 M-58,650 C-46,664 -44,684 -46,708 M-6,370 C-34,376 -60,372 -84,362 M-6,400 C-30,410 -56,410 -78,402 M-34,510 C-52,516 -74,516 -92,510';
const MIEMBRO_V = 'M-18,256 C-52,244 -86,252 -112,290 C-122,340 -128,380 -138,422 C-146,456 -160,496 -174,532 C-184,556 -192,572 -194,584';
const PIERNA_V = 'M6,480 C-14,504 -36,534 -46,572 C-50,620 -50,680 -48,738 C-50,790 -54,850 -46,906 C-44,926 -44,942 -46,954';
const CUELLO_V = 'M-6,258 C-4,236 -6,214 -8,194 C-14,176 -24,160 -30,146';
const RAMAS_V = 'M-46,600 C-34,628 -30,660 -34,690 M-128,350 C-138,368 -142,386 -142,404 M-48,800 C-40,820 -36,846 -36,872';

function Lado({ n }: { n: string }) {
  return (
    <g>
      <Tubo d={MIEMBRO_V} w={2.8} tono={VENA_FINA} cap="round" />
      <Tubo d={PIERNA_V} w={3.2} tono={VENA_FINA} cap="round" />
      <Tubo d={CUELLO_V} w={3} tono={VENA_FINA} cap="round" />
      <Tubo d={RAMAS_V} w={1.6} tono={VENA_FINA} cap="round" />
      <Tubo d={MIEMBRO_A} w={3.6} tono={ARTERIA_FINA} cap="round" />
      <Tubo d={ANTEBRAZO_A} w={2.2} tono={ARTERIA_FINA} cap="round" />
      <Tubo d={PIERNA_A} w={3.6} tono={ARTERIA_FINA} cap="round" />
      <Tubo d={CAROTIDA} w={3} tono={ARTERIA_FINA} cap="round" />
      <Tubo d={RAMAS_A} w={1.7} tono={ARTERIA_FINA} cap="round" key={n} />
    </g>
  );
}

export const Vasos = memo(function Vasos() {
  return (
    <g transform={`translate(${CX},0)`}>
      <Lado n="i" />
      <g transform="scale(-1,1)"><Lado n="d" /></g>
      {/* Aorta abdominal y cava inferior */}
      <Tubo d="M10,410 L9,476" w={6} tono={VENA_FINA} />
      <Tubo d="M0,300 C-1,350 1,420 2,478" w={7} tono={ARTERIA} />
    </g>
  );
});

const NERVIOS = 'M-3,424 L-3,470 M-3,250 C-36,250 -86,262 -116,306 C-130,350 -136,390 -150,428 C-160,470 -176,510 -192,552 M-3,470 C-20,510 -42,546 -62,590 C-72,650 -72,700 -68,746 C-70,800 -68,860 -56,920';

export const Sistema = memo(function Sistema() {
  const lado = <path d={NERVIOS} className={s.nervios} />;
  return (
    <g transform={`translate(${CX},0)`}>
      {lado}
      <g transform="scale(-1,1)">{lado}</g>
      <g transform="translate(0,132) scale(0.56)"><CerebroFrontal /></g>
      <path d="M-3,176 L-3,424" className={s.medula} />
    </g>
  );
});

export const PulmonesEn = memo(function PulmonesEn() {
  return <g transform={`translate(${CX},318) scale(0.88)`}><Pulmones /></g>;
});

export const CorazonEn = memo(function CorazonEn() {
  return <g transform={`translate(${CX + 16},334) scale(0.38)`}><Corazon /></g>;
});

export const RinonesEn = memo(function RinonesEn() {
  return (
    <g>
      <g transform={`translate(${CX - 48},432) scale(0.27)`}><Rinon /></g>
      <g transform={`translate(${CX + 48},432) scale(-0.27,0.27)`}><Rinon /></g>
    </g>
  );
});

/** Dónde está cada articulación: x respecto al eje, y, escala y ángulo del miembro. */
export const ARTICULACIONES: readonly (readonly [number, number, number, number])[] = [
  [-128, 276, 0.15, 18], [-150, 420, 0.13, 14], [-186, 530, 0.09, 20], [-68, 530, 0.16, 4], [-58, 730, 0.19, 0], [-46, 912, 0.1, -6],
];

export const Articulaciones = memo(function Articulaciones() {
  return (
    <g transform={`translate(${CX},0)`}>
      {ARTICULACIONES.flatMap(([x, y, k, a], i) => [-1, 1].map((l) => (
        <g key={`${i}${l}`} transform={`translate(${x * -l},${y}) rotate(${a * l}) scale(${k})`}><Articulacion /></g>
      )))}
    </g>
  );
});

// ─── Figuritas de «¿A quién le da?» ───────────────────────────────────────────

/** Figura proporcionada, de 110 u de alto, centrada en la cintura. */
export const Figurita = memo(function Figurita({ mujer, c }: { mujer: boolean; c: string }) {
  return (
    <g>
      <ellipse cy={-48} rx={9.6} ry={11.5} fill={c} />
      {mujer && <path d="M-11,-44 C-14,-64 14,-64 11,-44 C13,-38 12,-32 10,-29 L6,-31 C8,-40 6,-50 0,-52 C-6,-50 -8,-40 -6,-31 L-10,-29 C-12,-32 -13,-38 -11,-44 Z" fill={c} />}
      {mujer && <path d="M-11,-44 C-14,-64 14,-64 11,-44 C13,-38 12,-32 10,-29 L6,-31 C8,-40 6,-50 0,-52 C-6,-50 -8,-40 -6,-31 L-10,-29 C-12,-32 -13,-38 -11,-44 Z" fill="#000" opacity={0.28} />}
      <rect x={-3.6} y={-39} width={7.2} height={9} fill={c} />
      {mujer
        ? <path d="M-15,-31 C-8,-34 8,-34 15,-31 C17,-26 15,-14 10,-3 C14,8 19,18 21,28 L-21,28 C-19,18 -14,8 -10,-3 C-15,-14 -17,-26 -15,-31 Z" fill={c} />
        : <path d="M-19,-31 C-10,-35 10,-35 19,-31 C21,-24 18,-10 14,0 L15,16 L-15,16 L-14,0 C-18,-10 -21,-24 -19,-31 Z" fill={c} />}
      <path d={mujer ? 'M-15,-28 C-20,-16 -23,-6 -24,8 M15,-28 C20,-16 23,-6 24,8' : 'M-19,-27 C-24,-14 -26,-4 -27,12 M19,-27 C24,-14 26,-4 27,12'} fill="none" stroke={c} strokeWidth={5.6} strokeLinecap="round" />
      <path d={mujer ? 'M-7,26 L-7,56 M7,26 L7,56' : 'M-8,14 L-9,56 M8,14 L9,56'} fill="none" stroke={c} strokeWidth={mujer ? 6 : 8} strokeLinecap="round" />
      {/* El costado en sombra da volumen sin un degradado por figura */}
      <path d={mujer ? 'M0,-34 C8,-34 15,-31 15,-31 C17,-26 15,-14 10,-3 C14,8 19,18 21,28 L0,28 Z' : 'M0,-34 C10,-35 19,-31 19,-31 C21,-24 18,-10 14,0 L15,16 L0,16 Z'} fill="#000" opacity={0.09} />
      <path d="M0,-59.5 C5.3,-59.5 9.6,-54 9.6,-48 C9.6,-42 5.3,-36.5 0,-36.5 Z" fill="#000" opacity={0.09} />
    </g>
  );
});
