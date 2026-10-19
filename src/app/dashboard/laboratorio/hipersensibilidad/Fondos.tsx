'use client';
// Tejidos de fondo del laboratorio «Hipersensibilidad». Cada uno es un dibujo
// que depende de sus PARÁMETROS (`t`, 0–1, los anima la acción `tejido`) y del
// `reloj` (ms acumulados: cilios que baten, hematíes que fluyen, potenciales
// que suben por el nervio). Las medidas salen de `zonas.ts`, las mismas que usa
// el motor para el encuadre y los datos para colocar las células.
//
//   mucosa    epitelio seudoestratificado, lámina propia, vénula poscapilar,
//             glándula seromucosa, nervio sensitivo, músculo liso, corte del
//             bronquio y (con `ganglio`) el ganglio de drenaje
//   cuerpo    silueta con cara, vía aérea, pulmones, corazón, vasos, vísceras + monitor
//   sangre    vaso con su pared, hematíes, plaquetas y leucocitos; con
//             `placenta`, sangre materna, trofoblasto y capilar fetal
//   glomerulo glomérulo con polos vascular y urinario, podocitos y el alvéolo
//   placa     placa motora (sarcómeros, pliegues, AChR) y folículo tiroideo (TSHR)
//   vaso      arteriola en corte (íntima, elástica, media, adventicia) y su entorno
//   piel      epidermis por estratos, dermis con anexos y vénulas
//   granuloma ganglio con el granuloma que se arma por capas
//
// Rendimiento: lo que no depende de ningún parámetro va en capas `memo` sin
// props (se pintan una vez por montaje) y las texturas de cientos de puntos
// (linfocitos, gránulos, alvéolos) van en un solo <path> de segmentos nulos con
// `stroke-linecap: round` (`nube`). Las piezas que se repiten (hematíe, célula
// endotelial, vénula, huso) se dibujan en un solo sitio y las usan todos.

import { memo, type ReactNode } from 'react';
import type { Fondo } from '@/lib/data/hipersensibilidad/tipos';
import { CUERPO, GLOMERULO, GRANULOMA, MUCOSA, PIEL, PLACA, SANGRE, VASO } from '@/lib/data/hipersensibilidad/zonas';
import { hash } from '@/lib/hipersensibilidad/motor';
import { Anticuerpo, DibujoCelula } from './Celulas';
import s from '@/styles/hipersensibilidad.module.css';

type T = Record<string, number>;
type P = [number, number];
const v = (t: T, k: string) => t[k] ?? 0;
const ciclo = (reloj: number, periodo: number, desfase = 0) => (((reloj / periodo + desfase) % 1) + 1) % 1;
const f1 = (n: number) => n.toFixed(1);
const TAU = Math.PI * 2;
const gr = (rad: number) => (rad * 180) / Math.PI;

/** Huso de semilargo `l` y semialto `h` (músculo liso, fibroblasto, pericito, endotelio). */
const huso = (l: number, h: number) =>
  `M${f1(-l)},0 C${f1(-l * 0.45)},${f1(-h)} ${f1(l * 0.45)},${f1(-h)} ${f1(l)},0 C${f1(l * 0.45)},${f1(h)} ${f1(-l * 0.45)},${f1(h)} ${f1(-l)},0 Z`;

/** Muchos puntos en un solo trazo (segmentos nulos con extremo redondo). */
const nube = (pts: P[]) => pts.map(([x, y]) => `M${f1(x)},${f1(y)}h0.01`).join('');

/** Polilínea suave de una lista de puntos. */
const linea = (pts: P[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)},${f1(y)}`).join(' ');

/** Puntos repartidos al azar (deterministas) dentro de una caja que cumplen `vale`. */
function sembrar(n: number, semilla: number, x0: number, y0: number, x1: number, y1: number, vale: (x: number, y: number) => boolean = () => true, sep = 0): P[] {
  const out: P[] = [];
  for (let i = 0; out.length < n && i < n * 12; i++) {
    const x = x0 + hash(i, semilla) * (x1 - x0), y = y0 + hash(i, semilla + 1) * (y1 - y0);
    if (vale(x, y) && (!sep || out.every(([a, b]) => Math.hypot(a - x, b - y) >= sep))) out.push([x, y]);
  }
  return out;
}

/** Ángulos de `n` puntos equiespaciados por longitud de arco sobre una elipse. */
function arcoElipse(rx: number, ry: number, n: number, desfase = 0): number[] {
  const M = 96, acum = [0];
  for (let i = 1; i <= M; i++) {
    const a0 = ((i - 1) / M) * TAU, a1 = (i / M) * TAU;
    acum.push(acum[i - 1] + Math.hypot(rx * (Math.cos(a1) - Math.cos(a0)), ry * (Math.sin(a1) - Math.sin(a0))));
  }
  const L = acum[M];
  return Array.from({ length: n }, (_, k) => {
    const objetivo = (((k + desfase) / n) % 1) * L;
    let i = 1;
    while (i < M && acum[i] < objetivo) i++;
    const q = (objetivo - acum[i - 1]) / (acum[i] - acum[i - 1] || 1);
    return ((i - 1 + q) / M) * TAU;
  });
}
const perimetro = (rx: number, ry: number) => Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
/** Ángulo de la tangente en el punto `a` de la elipse, con +y local hacia el centro. */
const tangente = (rx: number, ry: number, a: number) => gr(Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)));

// ─── Piezas comunes ───────────────────────────────────────────────────────────

const DefsFondo = memo(function DefsFondo() {
  return (
    <defs>
      <radialGradient id="hs-gHem" cx="50%" cy="50%" r="55%">
        <stop offset="0%" className={s.gHem0} />
        <stop offset="45%" className={s.gHem1} />
        <stop offset="100%" className={s.gHem2} />
      </radialGradient>
      <linearGradient id="hs-gPiel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" className={s.gPiel0} />
        <stop offset="50%" className={s.gPiel1} />
        <stop offset="100%" className={s.gPiel0} />
      </linearGradient>
    </defs>
  );
});

/** Hematíe: disco bicóncavo (centro pálido, reborde más oscuro y un brillo). */
function Hematie({ x, y, rot = 0, k = 1, fantasma = false }: { x: number; y: number; rot?: number; k?: number; fantasma?: boolean }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${rot.toFixed(0)}) scale(${k})`}>
      <ellipse rx={15} ry={10} className={fantasma ? s.hematieFantasma : s.hematie} />
      {!fantasma && <ellipse rx={7.5} ry={4.2} className={s.hematieCentro} />}
      {!fantasma && <path d="M-10.5,-4.5 Q-5,-8.6 3,-8.2" className={s.hematieBrillo} />}
    </g>
  );
}

/** Huso con núcleo en bastón. */
function Huso({ x, y, l, h, ang = 0, c, n, kn = 0.36 }: { x: number; y: number; l: number; h: number; ang?: number; c: string; n?: string; kn?: number }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(1)})`}>
      <path d={huso(l, h)} className={c} />
      {n && <ellipse rx={f1(l * kn)} ry={f1(Math.max(1.5, h * 0.42))} className={n} />}
    </g>
  );
}

/**
 * Célula endotelial aplanada con el núcleo abombado hacia la luz (+y local).
 * Activada se engruesa y saca selectinas por la cara luminal.
 */
function Endotelial({ x, y, ang, l, h = 4.5, act = 0 }: { x: number; y: number; ang: number; l: number; h?: number; act?: number }) {
  const hh = h + 3.5 * act;
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(1)})`}>
      <path d={huso(l, hh)} className={s.endotelio} />
      <ellipse cy={f1(1.4 + 1.6 * act)} rx={f1(l * 0.34)} ry={f1(2.6 + 2 * act)} className={s.nucleoEndo} />
      {act > 0.05 && <path d={`M${f1(-l * 0.5)},${f1(hh + 2)}h0.01M0,${f1(hh + 3)}h0.01M${f1(l * 0.5)},${f1(hh + 2)}h0.01`} className={s.selectinas} opacity={act} />}
    </g>
  );
}

/**
 * Vénula poscapilar (la misma en la mucosa y en la piel): adventicia, pericitos,
 * membrana basal, endotelio con huecos que se abren con la histamina (`fuga`),
 * hematíes que fluyen (más lentos si se dilata: estasis) y leucocitos que
 * ruedan por la pared y se frenan cuando el endotelio se activa.
 */
function Venula({ id, cx, cy, rx, ry, vaso, fuga, act, reloj, nEndo, nHem, kHem = 1, dilatacion }: {
  id: string; cx: number; cy: number; rx: number; ry: number; vaso: number; fuga: number; act: number; reloj: number; nEndo: number; nHem: number; kHem?: number; dilatacion: number;
}) {
  const clip = `hs-ven-${id}`;
  const endo = arcoElipse(rx, ry, nEndo);
  const lEndo = (perimetro(rx, ry) / nEndo / 2) * (0.96 - 0.4 * fuga);
  const peri = arcoElipse(rx + 16, ry + 14, 9, 0.35);
  return (
    <g>
      <defs><clipPath id={clip}><ellipse cx={cx} cy={cy} rx={rx - 5} ry={Math.max(4, ry - 5)} /></clipPath></defs>
      <ellipse cx={cx} cy={cy} rx={rx + 34} ry={ry + 30} className={s.venAdventicia} />
      <ellipse cx={cx} cy={cy} rx={rx + 10} ry={ry + 10} className={s.paredVenula} strokeWidth={8 + 8 * act} />
      {peri.map((a, i) => (
        <Huso key={i} x={cx + Math.cos(a) * (rx + 16)} y={cy + Math.sin(a) * (ry + 14)} ang={tangente(rx + 16, ry + 14, a)} l={30} h={5} c={s.pericito} n={s.nucleoPericito} />
      ))}
      <ellipse cx={cx} cy={cy} rx={rx + 7} ry={ry + 7} className={s.membranaVen} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={s.luzVenula} style={{ fill: `color-mix(in srgb, #EE8B82 ${Math.round(18 + dilatacion * vaso)}%, var(--luz-venula))` }} />
      <g clipPath={`url(#${clip})`}>
        {Array.from({ length: nHem }, (_, i) => {
          const x = cx - rx + ((i * 71 + reloj * 0.07 * (1 - 0.6 * vaso)) % (rx * 2 + 60)) - 30;
          return <Hematie key={i} x={x} y={cy + (hash(i, 1) - 0.5) * ry * 1.3} rot={hash(i, 3) * 60 - 30} k={kHem} />;
        })}
        {[0, 1, 2].map((i) => {
          const u = ciclo(reloj, 26000 / (1 - 0.82 * act), i / 3 + hash(i, 11) * 0.1);
          const x = cx + (u * 2 - 1) * rx * 0.86;
          const y = cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) - 14;
          return <g key={i} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(((x - cx) / 11) % 360)})`}><DibujoCelula dibujo="linfocito" d={24} color="#9AA3B8" /></g>;
        })}
      </g>
      {endo.map((a, i) => (
        <Endotelial key={i} x={cx + Math.cos(a) * rx} y={cy + Math.sin(a) * ry} ang={tangente(rx, ry, a)} l={lEndo} act={act} />
      ))}
    </g>
  );
}

/** Haz de colágeno: dos o tres fibras paralelas que ondulan. */
function Colageno({ y, x0 = -40, x1 = 1700, amp = 14, fase = 0, n = 2, edema = 0 }: { y: number; x0?: number; x1?: number; amp?: number; fase?: number; n?: number; edema?: number }) {
  const d = Array.from({ length: n }, (_, k) => {
    const yy = y + k * (5 + 6 * edema);
    const pts: P[] = [];
    for (let x = x0; x <= x1; x += 40) pts.push([x, yy + Math.sin(x / 130 + fase + k * 0.4) * amp]);
    return linea(pts);
  }).join(' ');
  return <path d={d} className={s.colagenoFibra} />;
}

// ─── Mucosa respiratoria ──────────────────────────────────────────────────────

const { luz: M_LUZ, epitelio: M_EPI, venula: M_V, glandula: M_G, nervio: M_N, musculo: M_M, bronquio: M_B, ganglio: M_GG } = MUCOSA;
const ALTO_EPI = M_EPI - M_LUZ - 4;
const fueraDeVenula = (x: number, y: number, k = 1.3) => Math.hypot((x - M_V.cx) / (M_V.rx * k), (y - M_V.cy) / (M_V.ry * k * 1.6)) > 1;
const nervioX = (y: number) => M_N.x + 18 * Math.sin((y - M_N.y0) / 92);

/** Lámina propia: capilares bajo la membrana basal, fibroblastos, fibras elásticas y un linfático. */
const LaminaFija = memo(function LaminaFija() {
  const fibro = sembrar(26, 40, 20, 330, 1060, 830, (x, y) => fueraDeVenula(x, y) && !(x < 300 && y > 560) && Math.abs(x - 985) + Math.abs(y - 720) > 90);
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => {
        const pts: P[] = [];
        for (let x = -40; x <= 1080; x += 30) pts.push([x, 320 + k * 110 + Math.sin(x / 47 + k) * 9 + Math.sin(x / 19 + k * 2) * 3]);
        return <path key={k} d={linea(pts)} className={s.elastica} />;
      })}
      {fibro.map(([x, y], i) => <Huso key={i} x={x} y={y} l={21 + hash(i, 41) * 8} h={3.6} ang={(hash(i, 42) - 0.5) * 30} c={s.fibroblasto} n={s.nucleoFibro} />)}
      {[330, 560, 820, 1010, 1230, 1560].map((x, i) => (
        <g key={i} transform={`translate(${x},${M_EPI + 34})`}>
          <ellipse rx={20} ry={13} className={s.capilarPared} />
          <ellipse rx={14} ry={8} className={s.capilarLuz} />
          <Hematie x={i % 2 ? 2 : -2} y={0} rot={i * 9} k={0.62} />
          <ellipse cx={-12} cy={-9} rx={6} ry={2.4} className={s.nucleoEndo} transform="rotate(-25 -12 -9)" />
        </g>
      ))}
      {/* Capilar linfático: pared finísima, luz irregular y válvulas */}
      <path d="M940,712 C952,694 990,690 1012,700 C1036,710 1040,734 1022,744 C1000,756 958,752 944,738 C936,730 934,720 940,712 Z" className={s.linfaticoPared} />
      <path d="M968,703 Q978,716 990,712 M1012,742 Q1004,730 994,734" className={s.valvula} />
    </g>
  );
});

/** Células basales del epitelio (no se descaman: quedan cuando caen las cilíndricas). */
const BasalesFijas = memo(function BasalesFijas() {
  return (
    <g>
      {Array.from({ length: 33 }, (_, i) => (
        <g key={i} transform={`translate(${i * 50},${M_EPI - 15})`}>
          <ellipse rx={14} ry={11} className={s.basalEpi} />
          <ellipse rx={6.5} ry={5.5} className={s.nucleoEpi} />
        </g>
      ))}
    </g>
  );
});

/** Glándula seromucosa: acinos mucosos (pálidos, núcleos aplastados) y serosos (granulados), mioepitelio y conducto. */
const GlandulaFija = memo(function GlandulaFija() {
  const { cx, cy } = M_G;
  const acinos: { x: number; y: number; seroso: boolean }[] = [
    { x: 0, y: 0, seroso: false },
    ...Array.from({ length: 6 }, (_, k) => ({ x: Math.cos(k * 1.047 + 0.3) * 58, y: Math.sin(k * 1.047 + 0.3) * 54, seroso: k % 3 === 1 })),
  ];
  const ri = 8, re = 27;
  const cuna = (a0: number, a1: number) =>
    `M${f1(Math.cos(a0) * ri)},${f1(Math.sin(a0) * ri)} L${f1(Math.cos(a0) * re)},${f1(Math.sin(a0) * re)} A${re},${re} 0 0 1 ${f1(Math.cos(a1) * re)},${f1(Math.sin(a1) * re)} L${f1(Math.cos(a1) * ri)},${f1(Math.sin(a1) * ri)} A${ri},${ri} 0 0 0 ${f1(Math.cos(a0) * ri)},${f1(Math.sin(a0) * ri)} Z`;
  const ducto: P[] = [];
  for (let y = cy - 70; y >= M_EPI; y -= 6) ducto.push([cx + Math.sin((y - cy) / 60) * 6, y]);
  const nucleosDucto: P[] = ducto.filter((_, i) => i % 3 === 0).flatMap(([x, y]) => [[x - 8, y], [x + 8, y + 9]] as P[]);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={98} ry={92} className={s.tabiqueGlandula} />
      <path d={linea(ducto)} className={s.ductoPared} />
      <path d={linea(ducto)} className={s.ductoLuz} />
      <path d={nube(nucleosDucto)} className={s.nucleosDucto} />
      <path d={`M${cx},${cy - 70} L${cx},${cy - 30} M${cx},${cy} ${acinos.slice(1).map((a) => `M${f1(cx + a.x * 0.45)},${f1(cy + a.y * 0.45)} L${cx},${cy - 30}`).join(' ')}`} className={s.ductoIntercalar} />
      {acinos.map((a, i) => (
        <g key={i} transform={`translate(${f1(cx + a.x)},${f1(cy + a.y)})`}>
          <circle r={re + 3} className={s.membranaAcino} />
          {Array.from({ length: 8 }, (_, k) => {
            const a0 = (k / 8) * TAU + 0.04, a1 = ((k + 1) / 8) * TAU - 0.04, am = (a0 + a1) / 2;
            return (
              <g key={k}>
                <path d={cuna(a0, a1)} className={a.seroso ? s.celSerosa : s.celMucosa} />
                {a.seroso
                  ? <><circle cx={f1(Math.cos(am) * 20)} cy={f1(Math.sin(am) * 20)} r={4} className={s.nucleoSeroso} /><circle cx={f1(Math.cos(am) * 12)} cy={f1(Math.sin(am) * 12)} r={1.8} className={s.zimogeno} /></>
                  : <ellipse cx={f1(Math.cos(am) * 23.5)} cy={f1(Math.sin(am) * 23.5)} rx={5} ry={2} transform={`rotate(${f1(gr(am) + 90)} ${f1(Math.cos(am) * 23.5)} ${f1(Math.sin(am) * 23.5)})`} className={s.nucleoMucoso} />}
              </g>
            );
          })}
          <circle r={ri - 1} className={s.luzAcino} />
          {[0.4, 2.5, 4.6].map((am, k) => <Huso key={k} x={Math.cos(am) * (re + 3)} y={Math.sin(am) * (re + 3)} ang={gr(am) + 90} l={13} h={2.2} c={s.mioepitelio} />)}
        </g>
      ))}
    </g>
  );
});

/** Nervio sensitivo: perineuro, axones amielínicos con núcleos de Schwann y terminaciones libres bajo el epitelio. */
const NervioFijo = memo(function NervioFijo() {
  const pts: P[] = [];
  for (let y = M_N.y0; y <= M_N.y1; y += 16) pts.push([nervioX(y), y]);
  const d = linea(pts);
  const schwann = pts.filter((_, i) => i % 4 === 2);
  const top = M_N.y0;
  return (
    <g>
      <path d={d} className={s.perineuro} />
      <path d={d} className={s.endoneuro} />
      {[-5, 0, 5].map((dx) => <path key={dx} d={d} transform={`translate(${dx},0)`} className={s.axon} />)}
      {schwann.map(([x, y], i) => <ellipse key={i} cx={x + (i % 2 ? 6 : -6)} cy={y} rx={2.6} ry={7} className={s.nucleoSchwann} />)}
      <path d={`M${nervioX(top + 30)},${top + 30} C${M_N.x - 30},${top} ${M_N.x - 58},${top - 14} ${M_N.x - 80},${M_EPI + 6} M${nervioX(top + 30)},${top + 30} C${M_N.x + 24},${top + 4} ${M_N.x + 44},${top - 16} ${M_N.x + 62},${M_EPI + 8} M${nervioX(top + 20)},${top + 20} C${M_N.x - 6},${top - 10} ${M_N.x - 14},${M_EPI} ${M_N.x - 22},${M_EPI - 34}`} className={s.terminacion} />
      <path d={nube([[M_N.x - 80, M_EPI + 6], [M_N.x + 62, M_EPI + 8], [M_N.x - 22, M_EPI - 34]])} className={s.botonNervio} />
    </g>
  );
});

/** Corte del bronquio: placas de cartílago con condrocitos y glándulas de la submucosa. */
const BronquioFijo = memo(function BronquioFijo() {
  const { cx, cy, r } = M_B;
  const placas = [0.35, 1.9, 3.35, 4.9];
  const arco = (r0: number, r1: number, a0: number, a1: number) => {
    const p = (rr: number, a: number) => `${f1(cx + Math.cos(a) * rr)},${f1(cy + Math.sin(a) * rr)}`;
    return `M${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`;
  };
  return (
    <g>
      {placas.map((a, i) => (
        <g key={i}>
          <path d={arco(r * 0.85, r * 0.97, a - 0.5, a + 0.5)} className={s.cartilago} />
          <path d={nube(Array.from({ length: 9 }, (_, k) => { const aa = a - 0.42 + (k / 8) * 0.84; const rr = r * (0.89 + (k % 2) * 0.04); return [cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr] as P; }))} className={s.condrocito} />
        </g>
      ))}
      {[1.15, 2.65, 4.1, 5.6].map((a, i) => (
        <g key={i} transform={`translate(${f1(cx + Math.cos(a) * r * 0.9)},${f1(cy + Math.sin(a) * r * 0.9)})`}>
          {[[-5, -3], [5, -2], [0, 6]].map(([dx, dy], k) => <circle key={k} cx={dx} cy={dy} r={5.5} className={s.celMucosa} />)}
        </g>
      ))}
    </g>
  );
});

/** Ganglio de drenaje: cápsula, seno subcapsular, folículos con centro germinal, paracorteza con HEV, médula e hilio. */
const GG_C: P = [(M_GG.x0 + M_GG.x1) / 2, 655];
const enGanglio = (x: number, y: number) => Math.hypot((x - GG_C[0]) / 224, (y - GG_C[1]) / 272) < 1;
const FOLICULOS = [
  { x: 1180, y: 480, r: 46, gc: true },
  { x: 1382, y: 425, r: 50, gc: true },
  { x: 1507, y: 548, r: 44, gc: true },
  { x: 1128, y: 640, r: 28, gc: false },
  { x: 1528, y: 700, r: 26, gc: false },
];
const GanglioFijo = memo(function GanglioFijo() {
  const [gx, gy] = GG_C;
  const contorno = `M${gx},${gy - 290} C${gx + 150},${gy - 290} ${gx + 235},${gy - 185} ${gx + 235},${gy - 25} C${gx + 235},${gy + 135} ${gx + 170},${gy + 255} ${gx + 55},${gy + 285} Q${gx + 25},${gy + 262} ${gx},${gy + 262} Q${gx - 25},${gy + 262} ${gx - 55},${gy + 285} C${gx - 170},${gy + 255} ${gx - 235},${gy + 135} ${gx - 235},${gy - 25} C${gx - 235},${gy - 185} ${gx - 150},${gy - 290} ${gx},${gy - 290} Z`;
  const dentro = (x: number, y: number) => enGanglio(x, y) && !FOLICULOS.some((f) => Math.hypot(x - f.x, y - f.y) < f.r + 4);
  const corteza = sembrar(420, 60, gx - 230, gy - 280, gx + 230, gy + 120, (x, y) => dentro(x, y) && y < gy + 40);
  const manto = FOLICULOS.flatMap((f, i) => Array.from({ length: f.gc ? 44 : 26 }, (_, k) => { const a = k * 2.39996 + i; const rr = f.gc ? f.r * (0.72 + hash(k, i + 70) * 0.3) : f.r * Math.sqrt(hash(k, i + 71)) * 0.95; return [f.x + Math.cos(a) * rr, f.y + Math.sin(a) * rr] as P; }));
  const centro = FOLICULOS.filter((f) => f.gc).flatMap((f, i) => Array.from({ length: 12 }, (_, k) => { const a = k * 2.39996 + i * 3; const rr = Math.sqrt((k + 0.5) / 12) * f.r * 0.58; return [f.x + Math.cos(a) * rr, f.y + Math.sin(a) * rr] as P; }));
  const cordones = [[-150, 120], [-90, 160], [-30, 175], [40, 172], [100, 150], [158, 110]].map(([dx, dy]) => `M${gx + dx},${gy + dy - 40} C${gx + dx * 0.8},${gy + dy + 30} ${gx + dx * 0.3},${gy + 200} ${gx},${gy + 248}`).join(' ');
  return (
    <g>
      {/* Linfáticos aferentes, con válvulas, que entran por la convexidad */}
      <path d={`M${M_GG.x0 + 4},${gy - 150} C${gx - 236},${gy - 152} ${gx - 230},${gy - 150} ${gx - 222},${gy - 146}`} className={s.aferente} />
      <path d={`M${M_GG.x0 + 12},${gy - 158} q5,8 0,16`} className={s.valvula} />
      <path d={contorno} className={s.capsulaGanglio} />
      <path d={contorno} transform={`translate(${gx},${gy}) scale(0.95) translate(${-gx},${-gy})`} className={s.senoSubcapsular} />
      <path d={contorno} transform={`translate(${gx},${gy}) scale(0.92) translate(${-gx},${-gy})`} className={s.cortezaGanglio} />
      {[-2.5, -1.95, -1.1, -0.45, 0.4, 2.75].map((a, i) => <path key={i} d={`M${f1(gx + Math.cos(a) * 214)},${f1(gy + Math.sin(a) * 262)} L${f1(gx + Math.cos(a) * 186)},${f1(gy + Math.sin(a) * 228)}`} className={s.trabecula} />)}
      <ellipse cx={gx} cy={gy + 185} rx={170} ry={78} className={s.medula} />
      <path d={cordones} className={s.cordonMedular} />
      <path d={nube(corteza)} className={s.linfocitoT} />
      {FOLICULOS.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} className={f.gc ? s.foliculo : s.foliculoPrimario} />)}
      {FOLICULOS.filter((f) => f.gc).map((f, i) => <circle key={i} cx={f.x + 4} cy={f.y + 5} r={f.r * 0.6} className={s.centroGerminal} />)}
      <path d={nube(manto)} className={s.linfocitoB} />
      <path d={nube(centro)} className={s.centroblasto} />
      {/* Vénulas de endotelio alto (HEV): por ellas entran los linfocitos vírgenes */}
      {[[1255, 575], [1462, 612], [1282, 742], [1415, 748]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i * 40})`}>
          <ellipse rx={15} ry={10} className={s.hevPared} />
          <ellipse rx={6} ry={3} className={s.capilarLuz} />
          <path d={nube([[-10, 0], [10, 0], [0, -7], [0, 7]])} className={s.nucleoHev} />
        </g>
      ))}
      {/* Hilio: linfático eferente, arteria y vena */}
      <path d={`M${gx},${gy + 248} L${gx},${M_GG.y1 - 2}`} className={s.eferente} />
      <path d={`M${gx - 22},${gy + 240} C${gx - 26},${gy + 270} ${gx - 30},${gy + 290} ${gx - 30},${M_GG.y1 - 2}`} className={s.arteriaHilio} />
      <path d={`M${gx + 22},${gy + 240} C${gx + 26},${gy + 270} ${gx + 32},${gy + 290} ${gx + 32},${M_GG.y1 - 2}`} className={s.venaHilio} />
    </g>
  );
});

function Mucosa({ t, reloj }: { t: T; reloj: number }) {
  const V = M_V, G = M_G, N = M_N, M = M_M, B = M_B, GG = M_GG;
  const vaso = v(t, 'vasodilatacion'), fuga = v(t, 'fuga'), edema = v(t, 'edema'), esp = v(t, 'espasmo'), moco = v(t, 'moco');
  const dano = v(t, 'dano'), act = v(t, 'activacion'), inf = v(t, 'infiltrado'), prur = v(t, 'prurito'), gang = v(t, 'ganglio');
  const ry = V.ry * (1 + 0.5 * vaso);
  const nervio = (() => { const pts: P[] = []; for (let y = N.y0; y <= N.y1; y += 16) pts.push([nervioX(y), y]); return linea(pts); })();
  // Bronquio
  const rMusc = B.r * 0.72 * (1 - 0.2 * esp);
  const rPliegue = (i: number) => B.r * 0.62 * (1 - 0.42 * esp) * (1 - 0.1 * edema) * (1 + (i % 2 ? 0.07 : -0.05) * (0.3 + esp));
  const pliegue = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * TAU; const r = rPliegue(i); return `${i ? 'L' : 'M'}${f1(B.cx + Math.cos(a) * r)},${f1(B.cy + Math.sin(a) * r)}`; }).join(' ') + 'Z';
  const rLuz = B.r * 0.5 * (1 - 0.5 * esp) * (1 - 0.12 * edema);
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={800 + M_LUZ} className={s.luzAerea} />
      <text x={24} y={52} className={s.rotuloTejido}>Luz de la vía aérea</text>
      {/* Lámina propia, con edema que la aclara y separa las fibras */}
      <rect x={-800} y={M_EPI} width={3200} height={2000} className={s.laminaPropia} />
      <rect x={-800} y={M_EPI} width={3200} height={M.y0 - M_EPI} className={s.edema} opacity={0.45 * edema} />
      {Array.from({ length: 9 }, (_, i) => <Colageno key={i} y={330 + i * 58 + edema * (i - 4) * 6} amp={10} fase={i * 1.7} edema={edema} />)}
      <LaminaFija />
      {/* Gotas de plasma que salen de la vénula */}
      {fuga > 0.02 && Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * TAU + 0.2;
        const d = ciclo(reloj, 2600, hash(i, 2)) * 120 * fuga;
        return <circle key={i} cx={V.cx + Math.cos(a) * (V.rx * 0.8 + d * 1.6)} cy={V.cy + Math.sin(a) * (ry + d)} r={5} className={s.gotaPlasma} opacity={fuga * (1 - d / 140)} />;
      })}

      {/* Epitelio cilíndrico seudoestratificado ciliado con células caliciformes */}
      <BasalesFijas />
      {Array.from({ length: 32 }, (_, i) => {
        const x = i * 50;
        const cae = hash(i, 5) < dano * 0.42;
        const dy = cae ? -70 * dano - 20 : 0;
        const rot = cae ? (hash(i, 6) - 0.5) * 50 * dano : 0;
        const caliciforme = i % 4 === 2;
        const H = ALTO_EPI;
        const yNuc = H - 34 - (i % 3) * 13;
        return (
          <g key={i} transform={`translate(${x + 25},${M_LUZ + dy}) rotate(${rot})`} opacity={cae ? 1 - 0.5 * dano : 1}>
            {caliciforme ? (
              <g>
                <path d={`M-19,3 Q-19,0 -16,0 L16,0 Q19,0 19,3 C20,40 12,60 6,70 L5,${H} L-5,${H} L-6,70 C-12,60 -20,40 -19,3 Z`} className={s.caliciforme} />
                <path d="M-15,8 C-16,36 -9,54 0,60 C9,54 16,36 15,8 Q0,2 -15,8 Z" className={s.mocoCaliz} opacity={1 - 0.6 * moco} />
                <path d={nube([[-8, 16], [0, 13], [8, 17], [-5, 28], [5, 30], [0, 42], [-9, 38], [9, 40]])} className={s.granuloMucina} opacity={1 - 0.7 * moco} />
                <path d={`M-5,${H - 30} Q0,${H - 40} 5,${H - 30} L4,${H - 16} Q0,${H - 12} -4,${H - 16} Z`} className={s.nucleoEpi} />
                {moco > 0.02 && [0, 1].map((k) => { const q = ciclo(reloj, 1800, hash(i, k)); return <circle key={k} cx={(k - 0.5) * 10} cy={-q * 70 * moco} r={7 * (1 - q * 0.4)} className={s.gotaMoco} opacity={moco * (1 - q)} />; })}
              </g>
            ) : (
              <g>
                <path d={`M-22,3 Q-22,0 -19,0 L19,0 Q22,0 22,3 L17,${H} L-17,${H} Z`} className={s.epiCelula} />
                <line x1={-19} y1={4} x2={19} y2={4} className={s.cuerposBasales} />
                {Array.from({ length: 6 }, (_, k) => {
                  const ang = Math.sin(reloj / 170 + i * 0.55 + k * 0.2) * 16;
                  const r = (ang * Math.PI) / 180;
                  return <path key={k} d={`M${-17 + k * 7},1 q${f1(Math.sin(r) * 6)},${f1(-Math.cos(r) * 9)} ${f1(Math.sin(r) * 18)},${f1(-Math.cos(r) * 18)}`} className={s.cilio} />;
                })}
                <ellipse cx={0} cy={yNuc} rx={9.5} ry={14} className={s.nucleoEpiCil} />
                <circle cx={-2} cy={yNuc - 3} r={2.4} className={s.nucleolo} />
              </g>
            )}
          </g>
        );
      })}
      {/* Capa de moco sobre el epitelio */}
      <path d={`M-800,${M_LUZ} L-800,${M_LUZ - 6 - 26 * moco} ${Array.from({ length: 34 }, (_, i) => `L${i * 50},${f1(M_LUZ - 6 - 26 * moco - Math.sin(i * 1.3 + reloj / 900) * 4 * moco)}`).join(' ')} L2400,${M_LUZ - 6 - 26 * moco} L2400,${M_LUZ} Z`} className={s.capaMoco} opacity={0.35 + 0.55 * moco} />
      <line x1={-800} y1={M_EPI} x2={2400} y2={M_EPI} className={s.membranaBasal} />
      <line x1={-800} y1={M_EPI + 4} x2={2400} y2={M_EPI + 4} className={s.laminaReticular} />
      <text x={24} y={M_EPI + 34} className={s.rotuloTejido}>Lámina propia</text>

      {/* Glándula seromucosa y su conducto */}
      <GlandulaFija />
      {moco > 0.02 && Array.from({ length: 6 }, (_, k) => { const q = ciclo(reloj, 2200, k / 6); const y = G.cy - 70 - q * (G.cy - 70 - M_EPI); return <circle key={k} cx={G.cx + Math.sin((y - G.cy) / 60) * 6} cy={y} r={4} className={s.gotaMoco} opacity={moco} />; })}
      <text x={G.cx} y={G.cy + 118} textAnchor="middle" className={s.rotuloTejido}>Glándula</text>

      {/* Vénula poscapilar */}
      <Venula id="mucosa" cx={V.cx} cy={V.cy} rx={V.rx} ry={ry} vaso={vaso} fuga={fuga} act={act} reloj={reloj} nEndo={28} nHem={20} dilatacion={55} />
      <text x={V.cx} y={V.cy - ry - 44} textAnchor="middle" className={s.rotuloTejido}>Vénula poscapilar</text>

      {/* Infiltrado de la fase tardía */}
      {inf > 0.02 && Array.from({ length: 34 }, (_, i) => {
        if (hash(i, 8) > inf) return null;
        const x = 220 + hash(i, 9) * 820, y = 300 + hash(i, 10) * 470;
        if (Math.hypot((x - V.cx) / (V.rx + 20), (y - V.cy) / (ry + 20)) < 1) return null;
        return <g key={i} transform={`translate(${f1(x)},${f1(y)})`} opacity={inf}><DibujoCelula dibujo={i % 4 === 0 ? 'linfocito' : 'eosinofilo'} d={26} color="#D9567E" /></g>;
      })}

      {/* Nervio sensitivo: con la histamina conduce (prurito) */}
      <NervioFijo />
      {prur > 0.02 && <path d={nervio} className={s.nervioBrillo} opacity={prur} />}
      {prur > 0.02 && [0, 1, 2].map((k) => { const q = ciclo(reloj, 900, k / 3); const y = N.y1 - q * (N.y1 - N.y0); return <circle key={k} cx={nervioX(y)} cy={y} r={9} className={s.potencial} opacity={prur * (1 - q * 0.3)} />; })}
      <text x={N.x + 30} y={N.y0 + 40} className={s.rotuloTejido}>Nervio</text>

      {/* Músculo liso bronquial: husos que se acortan y engruesan con el espasmo */}
      <rect x={-800} y={M.y0} width={3200} height={M.y1 - M.y0 + 400} className={s.capaMuscular} />
      {[0, 1, 2, 3, 4].map((fila) => <line key={`e${fila}`} x1={-40} y1={M.y0 + 9 + fila * 24} x2={1700} y2={M.y0 + 9 + fila * 24} className={s.endomisio} />)}
      {[0, 1, 2, 3, 4].flatMap((fila) => Array.from({ length: 20 }, (_, i) => {
        const x = i * 88 + (fila % 2) * 44 - 20 + hash(i, fila + 20) * 12;
        const y = M.y0 + 20 + fila * 24;
        const l = (38 + hash(i, fila + 30) * 14) * (1 - 0.28 * esp), h = (6.5 + hash(i, fila + 31) * 2) * (1 + 0.55 * esp);
        return (
          <g key={`${fila}-${i}`} transform={`translate(${f1(x)},${y})`} style={{ opacity: 0.75 + 0.25 * esp }}>
            <path d={huso(l, h)} className={s.fibraLisa} />
            <ellipse rx={f1(l * 0.3)} ry={f1(2.4 * (1 + 0.35 * esp))} className={s.nucleoLiso} />
          </g>
        );
      }))}
      <text x={24} y={M.y0 - 12} className={s.rotuloTejido}>Músculo liso</text>

      {/* Corte del bronquio: la luz se cierra con el espasmo, el edema y el moco */}
      <g opacity={1 - gang}>
        <circle cx={B.cx} cy={B.cy} r={B.r} className={s.paredBronquio} />
        <BronquioFijo />
        <circle cx={B.cx} cy={B.cy} r={B.r * 0.83 * (1 - 0.08 * esp)} className={s.submucosaBronquio} />
        <circle cx={B.cx} cy={B.cy} r={rMusc} className={s.anilloMuscular} strokeWidth={7 + 7 * esp} />
        {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * TAU; return <Huso key={i} x={B.cx + Math.cos(a) * rMusc} y={B.cy + Math.sin(a) * rMusc} ang={gr(a) + 90} l={11 * (1 - 0.25 * esp)} h={2.6 * (1 + 0.5 * esp)} c={s.nucleoLiso} />; })}
        <circle cx={B.cx} cy={B.cy} r={rMusc - 4 - 4 * esp} className={s.laminaBronquio} />
        <path d={pliegue} className={s.mucosaBronquio} />
        <path d={nube(Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * TAU; const r = (rPliegue(Math.round((i / 30) * 48)) + rLuz) / 2; return [B.cx + Math.cos(a) * r, B.cy + Math.sin(a) * r] as P; }))} className={s.nucleosBronquio} />
        <circle cx={B.cx} cy={B.cy} r={rLuz} className={s.luzBronquio} />
        {moco > 0.02 && <circle cx={B.cx + 6} cy={B.cy + 8} r={B.r * 0.44 * (1 - 0.5 * esp) * moco} className={s.tapon} opacity={0.85} />}
        <text x={B.cx} y={B.cy - B.r - 16} textAnchor="middle" className={s.rotuloTejido}>Corte del bronquio</text>
        <text x={B.cx} y={B.cy + B.r + 32} textAnchor="middle" className={s.rotuloDato}>Luz: {Math.round(100 * (1 - 0.5 * esp) * (1 - 0.12 * edema) * (1 - 0.6 * moco * (1 - 0.5 * esp)))} %</text>
      </g>

      {/* Ganglio de drenaje */}
      {gang > 0.01 && (
        <g opacity={gang}>
          <path d={`M880,${M_EPI + 40} C960,${M_EPI + 60} 1000,${GG.y0 + 140} ${GG.x0 + 4},${GG_C[1] - 150}`} className={s.linfatico} />
          <rect x={GG.x0} y={GG.y0} width={GG.x1 - GG.x0} height={GG.y1 - GG.y0} rx={26} className={s.panelGanglio} />
          <GanglioFijo />
          <text x={(GG.x0 + GG.x1) / 2} y={GG.y0 + 34} textAnchor="middle" className={s.rotuloTejido}>Ganglio de drenaje</text>
          <text x={1382} y={492} textAnchor="middle" className={s.rotuloDato}>Folículos (B)</text>
          <text x={1488} y={668} textAnchor="middle" className={s.rotuloDato}>Paracorteza (T)</text>
          <text x={1176} y={862} textAnchor="middle" className={s.rotuloDato}>Médula</text>
        </g>
      )}
    </g>
  );
}

// ─── Cuerpo (anafilaxia) ──────────────────────────────────────────────────────
//
// Figura de frente con las proporciones del canon (7,5 cabezas): hombros a dos
// cabezas de ancho, codo a la altura del ombligo, muñeca a la de la
// entrepierna, yemas a medio muslo. Encima, en transparencia, lo que importa en
// la anafilaxia: laringe, tráquea, pulmones con su árbol bronquial, corazón y
// grandes vasos, vísceras abdominales y los vasos de los miembros.

const { cx: C_X, cabeza: C_CAB, laringe: C_LAR, pulmon: C_PUL, corazon: C_COR, intestino: C_INT, monitor: C_MO } = CUERPO;
const C_CARINA = C_PUL - 44;

// Mitad derecha (en pantalla) de la silueta, del cuello a la entrepierna; la
// izquierda es su espejo recorrido al revés. Coordenadas: x desde la línea media.
type Seg = { a: P; c1: P; c2: P; b: P };
const MITAD: Seg[] = (() => {
  const q: [P, P, P][] = [
    [[52, 204], [104, 207], [134, 218]], // trapecio
    [[160, 226], [178, 246], [178, 274]], // deltoides
    [[178, 296], [168, 310], [168, 330]], // inserción del deltoides
    [[171, 360], [167, 392], [162, 412]], // bíceps hasta el codo
    [[168, 440], [180, 474], [178, 510]], // antebrazo (braquiorradial)
    [[176, 532], [172, 548], [172, 560]], // muñeca
    [[178, 580], [184, 606], [182, 640]], // borde cubital de la mano
    [[180, 662], [171, 670], [165, 662]], // dedos
    [[161, 654], [158, 640], [157, 626]],
    [[151, 616], [147, 602], [151, 588]], // pulgar
    [[153, 576], [153, 566], [152, 558]], // muñeca por dentro
    [[146, 520], [132, 482], [134, 440]], // antebrazo por dentro
    [[136, 424], [136, 416], [134, 410]], // flexura del codo
    [[128, 380], [126, 330], [118, 292]], // brazo por dentro hasta la axila
    [[120, 330], [102, 392], [90, 440]], // dorsal ancho que se estrecha a la cintura
    [[88, 470], [94, 502], [100, 530]], // cadera
    [[106, 562], [112, 602], [112, 640]], // trocánter
    [[112, 690], [100, 760], [88, 800]], // cuádriceps hasta la rodilla
    [[82, 830], [92, 858], [86, 892]], // gemelo
    [[78, 930], [66, 950], [62, 962]], // tobillo
    [[74, 972], [90, 984], [86, 992]], // pie
    [[66, 997], [44, 997], [32, 990]],
    [[28, 980], [32, 966], [32, 958]],
    [[28, 920], [24, 880], [26, 850]],
    [[26, 820], [26, 800], [22, 780]], // rodilla por dentro
    [[16, 720], [12, 660], [6, 604]], // aductores
    [[4, 594], [2, 592], [0, 592]], // entrepierna
  ];
  const segs: Seg[] = [];
  let a: P = [30, 196];
  for (const [c1, c2, b] of q) { segs.push({ a, c1, c2, b }); a = b; }
  return segs;
})();
const SILUETA = (() => {
  const X = (p: P) => `${C_X + p[0]},${p[1]}`;
  const Xm = (p: P) => `${C_X - p[0]},${p[1]}`;
  const der = MITAD.map((g) => `C${X(g.c1)} ${X(g.c2)} ${X(g.b)}`).join(' ');
  const izq = [...MITAD].reverse().map((g) => `C${Xm(g.c2)} ${Xm(g.c1)} ${Xm(g.a)}`).join(' ');
  return `M${Xm([30, 150])} L${X([30, 150])} L${X(MITAD[0].a)} ${der} ${izq} Z`;
})();
/** El contorno como polígono, para sembrar habones solo sobre la piel. */
const POLI_SILUETA: P[] = (() => {
  const bez = (g: Seg, t: number): P => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * g.a[k] + 3 * u * u * t * g.c1[k] + 3 * u * t * t * g.c2[k] + t * t * t * g.b[k]) as P;
  };
  const der = MITAD.flatMap((g) => [0.25, 0.5, 0.75, 1].map((t) => bez(g, t)));
  return [...der.map(([x, y]) => [C_X + x, y] as P), ...[...der].reverse().map(([x, y]) => [C_X - x, y] as P)];
})();
const enPoligono = (pol: P[], x: number, y: number) => {
  let dentro = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i], [xj, yj] = pol[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
};
const HABONES = sembrar(24, 95, C_X - 190, 220, C_X + 190, 960, (x, y) => enPoligono(POLI_SILUETA, x, y) && Math.abs(x - C_X) > 18, 46);

/** Pulmón: `k` = −1 el de la izquierda de la pantalla (derecho del paciente, 3 lóbulos), +1 el otro (escotadura cardíaca y língula). */
const pulmon = (k: number) => {
  const X = (dx: number) => C_X + k * dx;
  return k < 0
    ? `M${X(28)},208 C${X(52)},198 ${X(76)},218 ${X(82)},258 C${X(88)},300 ${X(88)},334 ${X(84)},354 C${X(68)},350 ${X(44)},344 ${X(24)},340 C${X(20)},296 ${X(18)},244 ${X(28)},208 Z`
    : `M${X(28)},208 C${X(52)},198 ${X(76)},218 ${X(82)},258 C${X(88)},300 ${X(88)},336 ${X(84)},358 C${X(68)},354 ${X(54)},350 ${X(42)},348 C${X(38)},336 ${X(46)},326 ${X(48)},314 C${X(36)},300 ${X(26)},286 ${X(24)},258 C${X(22)},232 ${X(22)},216 ${X(28)},208 Z`;
};
const enPulmon = (x: number, y: number) => {
  const dx = Math.abs(x - C_X);
  return y > 214 && y < 348 && dx > 27 && dx < 82 - Math.max(0, (244 - y) * 0.9) && !(x > C_X && dx < 50 && y > 312);
};
/** Árbol bronquial: un trazo por generación (su grosor sigue al broncoespasmo). */
const ARBOL: string[] = (() => {
  const gens: string[][] = [[], [], [], [], []];
  const rama = (x: number, y: number, ang: number, len: number, g: number) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    gens[g].push(`M${f1(x)},${f1(y)} L${f1(x2)},${f1(y2)}`);
    if (g < 4) {
      rama(x2, y2, ang - 0.42, len * 0.74, g + 1);
      rama(x2, y2, ang + 0.36, len * 0.72, g + 1);
    }
  };
  for (const k of [-1, 1]) {
    const hx = C_X + k * 34, hy = C_CARINA + 24;
    gens[0].push(`M${C_X},${C_CARINA} L${hx},${hy}`);
    const dir = (a: number) => (k > 0 ? a : Math.PI - a);
    rama(hx, hy, dir(1.25), 26, 1); // lóbulo inferior
    rama(hx, hy, dir(0.4), 18, 2); // medio / língula
    rama(hx, hy, dir(-0.95), 20, 2); // lóbulo superior
  }
  return gens.map((g) => g.join(' '));
})();
const CABEZA = (() => { const x = C_X, y = C_CAB; return `M${x - 50},${y - 8} C${x - 52},${y - 58} ${x - 30},${y - 62} ${x},${y - 62} C${x + 30},${y - 62} ${x + 52},${y - 58} ${x + 50},${y - 8} C${x + 49},${y + 22} ${x + 40},${y + 44} ${x + 22},${y + 58} Q${x},${y + 70} ${x - 22},${y + 58} C${x - 40},${y + 44} ${x - 49},${y + 22} ${x - 50},${y - 8} Z`; })();
const ALVEOLOS = sembrar(200, 90, C_X - 90, 206, C_X + 90, 360, enPulmon);
/** Intestino delgado: asas enrolladas que se enciman dentro del marco cólico. */
const ASAS = [
  [-30, -30, 22, 13, -20], [6, -34, 24, 12, 10], [36, -24, 18, 13, 30], [-38, -4, 16, 14, 60],
  [-10, -8, 24, 14, -10], [26, 0, 22, 13, 20], [-28, 22, 22, 12, 15], [6, 20, 22, 13, -25], [36, 28, 16, 12, 40], [-6, 40, 26, 11, 5],
].map(([dx, dy, rx, ry, rot]) => {
  const a = (rot * Math.PI) / 180, x0 = C_X + dx, y0 = C_INT + dy;
  const p = (u: number): P => [x0 + Math.cos(u) * rx * Math.cos(a) - Math.sin(u) * ry * Math.sin(a), y0 + Math.cos(u) * rx * Math.sin(a) + Math.sin(u) * ry * Math.cos(a)];
  const [ax, ay] = p(0), [bx, by] = p(Math.PI * 0.95), [cx2, cy2] = p(Math.PI * 1.9);
  return `M${f1(ax)},${f1(ay)} A${rx},${ry} ${rot} 0 1 ${f1(bx)},${f1(by)} A${rx},${ry} ${rot} 0 1 ${f1(cx2)},${f1(cy2)}`;
}).join(' ');
const COLON = `M${C_X - 72},${C_INT + 40} C${C_X - 78},${C_INT - 10} ${C_X - 80},${C_INT - 50} ${C_X - 74},${C_INT - 62} C${C_X - 50},${C_INT - 70} ${C_X - 10},${C_INT - 58} ${C_X + 10},${C_INT - 64} C${C_X + 40},${C_INT - 70} ${C_X + 70},${C_INT - 70} ${C_X + 80},${C_INT - 58} C${C_X + 84},${C_INT - 20} ${C_X + 80},${C_INT + 20} ${C_X + 76},${C_INT + 36} C${C_X + 70},${C_INT + 56} ${C_X + 34},${C_INT + 50} ${C_X + 18},${C_INT + 62} C${C_X + 8},${C_INT + 70} ${C_X + 2},${C_INT + 76} ${C_X},${C_INT + 84}`;

const CuerpoFijo = memo(function CuerpoFijo() {
  const x = C_X, y = C_CAB;
  return (
    <g>
      {/* Relieves: clavículas, pectorales, abdominales, oblicuos, deltoides, bíceps, cuádriceps, gemelos, rótulas */}
      <path d={[-1, 1].map((k) => [
        `M${x + k * 6},212 C${x + k * 40},204 ${x + k * 90},206 ${x + k * 122},218`,
        `M${x + k * 8},304 C${x + k * 40},322 ${x + k * 84},316 ${x + k * 108},282`,
        `M${x + k * 150},250 C${x + k * 140},280 ${x + k * 138},304 ${x + k * 144},326`,
        `M${x + k * 150},336 C${x + k * 146},360 ${x + k * 148},384 ${x + k * 156},400`,
        `M${x + k * 160},452 C${x + k * 162},480 ${x + k * 166},506 ${x + k * 170},528`,
        `M${x + k * 84},446 C${x + k * 70},500 ${x + k * 40},548 ${x + k * 12},576`,
        `M${x + k * 34},352 L${x + k * 34},466`,
        `M${x + k * 4},372 L${x + k * 32},370 M${x + k * 4},404 L${x + k * 32},404 M${x + k * 4},436 L${x + k * 32},438`,
        `M${x + k * 26},700 C${x + k * 34},736 ${x + k * 32},758 ${x + k * 40},776`,
        `M${x + k * 84},840 C${x + k * 74},864 ${x + k * 70},890 ${x + k * 70},912`,
        `M${x + k * 42},800 C${x + k * 40},784 ${x + k * 44},768 ${x + k * 56},766 C${x + k * 68},768 ${x + k * 72},784 ${x + k * 68},800 C${x + k * 64},810 ${x + k * 48},810 ${x + k * 42},800`,
        `M${x + k * 176},640 l${k},20 M${x + k * 170},643 l${k * 0.5},22 M${x + k * 164},641 l0,18 M${x + k * 152},608 q${k * 5},8 ${k * 10},10`,
      ].join(' ')).join(' ')} className={s.relieve} />
      <path d={`M${x},322 L${x},470 M${x - 8},${C_INT - 20} q8,8 16,0`} className={s.relieve} />
      {/* Diafragma, hígado con vesícula, estómago, bazo, colon y vejiga */}
      <path d={`M${x - 88},362 C${x - 60},332 ${x - 20},332 ${x},344 C${x + 20},334 ${x + 60},332 ${x + 88},366`} className={s.diafragma} />
      <g transform={`translate(${x},0) scale(0.84,1) translate(${-x},0)`}>
      <ellipse cx={x + 92} cy={392} rx={11} ry={24} transform={`rotate(-18 ${x + 92} 392)`} className={s.bazo} />
      <path d={`M${x - 100},382 C${x - 96},356 ${x - 40},352 ${x + 20},364 C${x + 34},368 ${x + 30},384 ${x + 14},392 C${x - 20},410 ${x - 60},428 ${x - 88},424 C${x - 100},418 ${x - 104},400 ${x - 100},382 Z`} className={s.higado} />
      <path d={`M${x - 46},396 C${x - 30},392 ${x - 14},398 ${x - 8},404`} className={s.cisura} />
      <ellipse cx={x - 30} cy={410} rx={9} ry={6} className={s.vesiculaBiliar} />
      <path d={`M${x + 20},372 C${x + 40},356 ${x + 82},360 ${x + 86},386 C${x + 90},412 ${x + 66},428 ${x + 40},420 C${x + 28},416 ${x + 22},404 ${x + 8},404 C${x + 6},394 ${x + 14},386 ${x + 20},372 Z`} className={s.estomago} />
      <path d={`M${x + 30},382 C${x + 50},376 ${x + 70},384 ${x + 74},398`} className={s.pliegueGastrico} />
      <path d={COLON} className={s.colon} />
      <path d={COLON} className={s.haustras} />
      <path d={`M${x - 72},${C_INT + 40} q4,14 14,18`} className={s.apendice} />
      <ellipse cx={x} cy={C_INT + 80} rx={20} ry={13} className={s.vejiga} />
      </g>
      {/* Cabeza */}
      <path d={`M${x - 48},${y + 2} C${x - 58},${y - 4} ${x - 60},${y + 22} ${x - 48},${y + 24} M${x + 48},${y + 2} C${x + 58},${y - 4} ${x + 60},${y + 22} ${x + 48},${y + 24}`} className={s.oreja} />
      <path d={CABEZA} className={s.cara} style={{ fill: 'url(#hs-gPiel)' }} />
      <path d={`M${x - 51},${y} C${x - 56},${y - 48} ${x - 30},${y - 70} ${x},${y - 70} C${x + 32},${y - 70} ${x + 58},${y - 48} ${x + 51},${y} C${x + 47},${y - 22} ${x + 40},${y - 34} ${x + 24},${y - 38} C${x + 6},${y - 30} ${x - 16},${y - 38} ${x - 22},${y - 42} C${x - 38},${y - 34} ${x - 46},${y - 22} ${x - 51},${y} Z`} className={s.pelo} />
      <path d={`M${x - 22},${y - 42} C${x - 12},${y - 56} ${x + 10},${y - 60} ${x + 30},${y - 52}`} className={s.mechon} />
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${x + k * 30},${y - 16} Q${x + k * 20},${y - 23} ${x + k * 8},${y - 17}`} className={s.ceja} />
          <path d={`M${x + k * 29},${y - 6} Q${x + k * 18},${y - 13} ${x + k * 7},${y - 6} Q${x + k * 18},${y - 1} ${x + k * 29},${y - 6} Z`} className={s.ojo} />
          <circle cx={x + k * 18} cy={y - 6.5} r={3.6} className={s.iris} />
          <circle cx={x + k * 18} cy={y - 6.5} r={1.6} className={s.pupila} />
          <path d={`M${x + k * 30},${y - 6} Q${x + k * 18},${y - 14} ${x + k * 6},${y - 6}`} className={s.parpado} />
          <path d={`M${x + k * 34},${y + 14} q${k * -6},6 ${k * -10},4`} className={s.rasgo} />
        </g>
      ))}
      <path d={`M${x - 3},${y - 6} Q${x - 5},${y + 8} ${x - 8},${y + 16} Q${x - 4},${y + 21} ${x},${y + 19} Q${x + 4},${y + 21} ${x + 8},${y + 16}`} className={s.rasgo} />
      <path d={`M${x - 5},${y + 18} q-2,-2 -4,0 M${x + 5},${y + 18} q2,-2 4,0`} className={s.narina} />
      <path d={`M${x},${y + 22} L${x},${y + 30}`} className={s.surcoNasolabial} />
      {/* Cuello: esternocleidomastoideos y prominencia laríngea */}
      <path d={`M${x - 30},${y + 52} C${x - 26},${y + 74} ${x - 16},${y + 92} ${x - 8},${y + 104} M${x + 30},${y + 52} C${x + 26},${y + 74} ${x + 16},${y + 92} ${x + 8},${y + 104}`} className={s.relieve} />
    </g>
  );
});

/** Parrilla costal y esternón, en transparencia por delante de pulmones y corazón. */
const CostillasFijas = memo(function CostillasFijas() {
  const x = C_X;
  return (
    <g>
            <path d={Array.from({ length: 7 }, (_, i) => { const yy = 226 + i * 19; const w = 48 + i * 5; return `M${x - 8},${yy} C${x - w * 0.6},${yy - 4} ${x - w},${yy + 6} ${x - w - 18},${yy + 26} M${x + 8},${yy} C${x + w * 0.6},${yy - 4} ${x + w},${yy + 6} ${x + w + 18},${yy + 26}`; }).join(' ')} className={s.costilla} />
      <path d={`M${x - 7},214 L${x + 7},214 L${x + 6},318 L${x},332 L${x - 6},318 Z`} className={s.esternon} />
    </g>
  );
});

function Cuerpo({ t, reloj }: { t: T; reloj: number }) {
  const cx = C_X, cabeza = C_CAB, yl = C_LAR, yc = C_COR, Mo = C_MO;
  const piel = v(t, 'piel'), lar = v(t, 'laringe'), bron = v(t, 'bronquio'), intes = v(t, 'intestino'), vasos = v(t, 'vasos'), pres = v(t, 'presion'), adr = v(t, 'adrenalina');
  const fc = 78 + 60 * pres, sis = Math.round(120 - 64 * pres), dia = Math.round(80 - 46 * pres);
  const sat = Math.round(98 - 14 * bron), fr = Math.round(16 + 14 * bron);
  const latido = 1 + 0.06 * Math.pow(Math.max(0, Math.sin((reloj / 60000) * fc * TAU)), 8);
  const ecg = Array.from({ length: 161 }, (_, i) => {
    const x = Mo.x0 + 40 + (i / 160) * (Mo.x1 - Mo.x0 - 80);
    const fase = ((i / 160) * 3 + reloj / (60000 / fc)) % 1;
    const y = 220 - (fase > 0.12 && fase < 0.2 ? 8 * Math.sin(((fase - 0.12) / 0.08) * Math.PI) : fase > 0.42 && fase < 0.46 ? 60 * Math.sin(((fase - 0.42) / 0.04) * Math.PI) : fase > 0.46 && fase < 0.5 ? -18 * Math.sin(((fase - 0.46) / 0.04) * Math.PI) : fase > 0.6 && fase < 0.72 ? 12 * Math.sin(((fase - 0.6) / 0.12) * Math.PI) : 0);
    return `${i ? 'L' : 'M'}${f1(x)},${f1(y)}`;
  }).join(' ');
  const pleth = Array.from({ length: 121 }, (_, i) => {
    const x = Mo.x0 + 40 + (i / 120) * (Mo.x1 - Mo.x0 - 80);
    const fase = ((i / 120) * 3 + reloj / (60000 / fc) - 0.08) % 1;
    const onda = fase < 0.3 ? Math.sin(((fase / 0.3) * Math.PI) / 2) : 0.15 * Math.sin(((fase - 0.3) / 0.12) * Math.PI) * (fase < 0.42 ? 1 : 0) + Math.max(0, 1 - (fase - 0.3) / 0.7);
    return `${i ? 'L' : 'M'}${f1(x)},${f1(318 - onda * 26 * (1 - 0.65 * pres))}`;
  }).join(' ');
  const estado = pres < 0.2 ? 'Estable' : pres < 0.6 ? 'Hipotensión' : 'Shock distributivo';
  const anchoA = 2.4 + 4 * vasos;
  // Arterias: aorta (arco y descendente), carótidas, subclavias hasta la radial, ilíacas hasta las tibiales.
  const brazoA = (k: number) => `M${cx + (k < 0 ? 0 : 16)},${k < 0 ? 264 : 260} C${cx + k * 40},250 ${cx + k * 96},234 ${cx + k * 126},262 C${cx + k * 142},300 ${cx + k * 146},380 ${cx + k * 148},430 C${cx + k * 152},490 ${cx + k * 158},530 ${cx + k * 162},580`;
  const piernaA = (k: number) => `M${cx + 4},500 C${cx + k * 20},520 ${cx + k * 40},550 ${cx + k * 50},592 C${cx + k * 54},660 ${cx + k * 56},720 ${cx + k * 52},790 C${cx + k * 50},850 ${cx + k * 52},910 ${cx + k * 52},960`;
  const arterias = `M${cx + 2},${yc - 26} C${cx},270 ${cx + 6},256 ${cx + 14},258 C${cx + 22},262 ${cx + 16},290 ${cx + 10},320 L${cx + 4},500 M${cx + 2},262 C${cx - 6},240 ${cx - 14},210 ${cx - 16},150 M${cx + 10},258 C${cx + 12},240 ${cx + 14},210 ${cx + 16},150 ${brazoA(-1)} ${brazoA(1)} ${piernaA(-1)} ${piernaA(1)}`;
  const brazoV = (k: number) => `M${cx + k * 14},262 C${cx + k * 46},244 ${cx + k * 104},230 ${cx + k * 134},258 C${cx + k * 150},300 ${cx + k * 154},380 ${cx + k * 156},430 C${cx + k * 160},490 ${cx + k * 166},530 ${cx + k * 170},580`;
  const piernaV = (k: number) => `M${cx - 12},500 C${cx + k * 10},522 ${cx + k * 30},552 ${cx + k * 38},592 C${cx + k * 40},660 ${cx + k * 42},720 ${cx + k * 40},790 C${cx + k * 38},850 ${cx + k * 40},910 ${cx + k * 42},962`;
  const venas = `M${cx - 16},${yc - 10} L${cx - 16},262 M${cx - 12},${yc + 30} L${cx - 12},500 M${cx - 24},150 C${cx - 22},200 ${cx - 20},240 ${cx - 16},262 M${cx + 24},150 C${cx + 22},200 ${cx + 18},240 ${cx + 10},264 ${brazoV(-1)} ${brazoV(1)} ${piernaV(-1)} ${piernaV(1)}`;
  const grosor = [1, 0.72, 0.54, 0.42, 0.32];
  const yBoca = cabeza + 34;
  return (
    <g className={s.fondo}>
      <defs><clipPath id="hs-pulmones">{[-1, 1].map((k) => <path key={k} d={pulmon(k)} />)}</clipPath></defs>
      <path d={SILUETA} className={s.cuerpo} style={{ fill: 'url(#hs-gPiel)' }} />
      {/* Vasos: se dilatan (y la presión cae) */}
      <path d={venas} className={s.venaPeriferica} strokeWidth={anchoA * 0.85} />
      <path d={arterias} className={s.vasoPeriferico} strokeWidth={anchoA} />
      <CuerpoFijo />
      <path d={SILUETA} className={s.pielRoja} opacity={0.28 * piel} />
      <path d={CABEZA} className={s.pielRoja} opacity={0.24 * piel} />
      {/* Labios (arco de Cupido) y párpados: el angioedema los hincha */}
      <g transform={`translate(${cx},${yBoca}) scale(${f1(1 + 0.3 * piel)},${f1(1 + 0.9 * piel)})`}>
        <path d="M-15,0 C-11,-4 -5,-6.5 -1.5,-3.5 Q0,-2.5 1.5,-3.5 C5,-6.5 11,-4 15,0 C8,1.5 -8,1.5 -15,0 Z" className={s.labio} />
        <path d="M-15,0 C-8,1.5 8,1.5 15,0 C11,7.5 -11,7.5 -15,0 Z" className={s.labioInf} />
        <path d="M-15,0 C-8,1.5 8,1.5 15,0" className={s.comisura} />
        <path d="M-7,3.4 Q0,5 7,3.4" className={s.brilloLabio} />
      </g>
      {piel > 0.05 && [-1, 1].map((k) => <ellipse key={k} cx={cx + k * 18} cy={cabeza - 1} rx={12} ry={3 + 4 * piel} className={s.parpadoEdema} opacity={piel} />)}
      {/* Habones de la urticaria, solo sobre la piel */}
      {piel > 0.02 && HABONES.map(([x, y], i) => (
        <g key={i} opacity={Math.min(1, piel * 1.4 - hash(i, 3) * 0.4)}>
          <circle cx={f1(x)} cy={f1(y)} r={16} className={s.halo} />
          <path d={`M${f1(x - 9)},${f1(y)} C${f1(x - 9)},${f1(y - 7)} ${f1(x - 2)},${f1(y - 10)} ${f1(x + 3)},${f1(y - 7)} C${f1(x + 10)},${f1(y - 6)} ${f1(x + 10)},${f1(y + 5)} ${f1(x + 4)},${f1(y + 7)} C${f1(x - 2)},${f1(y + 10)} ${f1(x - 9)},${f1(y + 6)} ${f1(x - 9)},${f1(y)} Z`} className={s.habon} />
        </g>
      ))}
      {/* Vía aérea: laringe, tráquea, bronquios y pulmones */}
      {[-1, 1].map((k) => <path key={k} d={pulmon(k)} className={s.pulmon} style={{ fill: `color-mix(in srgb, #8DA6D6 ${Math.round(40 * bron)}%, var(--pulmon))` }} />)}
      <path d={nube(ALVEOLOS)} className={s.alveolosTextura} />
      <path d={`M${cx - 84},282 C${cx - 66},280 ${cx - 46},284 ${cx - 28},290 M${cx - 78},236 C${cx - 62},276 ${cx - 50},310 ${cx - 38},340 M${cx + 78},238 C${cx + 64},280 ${cx + 54},316 ${cx + 44},346`} className={s.cisura} />
      <circle cx={cx} cy={yl} r={13 + 14 * lar} className={s.laringeEdema} opacity={0.25 + 0.6 * lar} />
      <path d={`M${cx},${yl + 8} L${cx},${C_CARINA}`} className={s.traquea} strokeWidth={12 - 6 * lar} />
      <path d={Array.from({ length: 6 }, (_, i) => { const yy = yl + 14 + i * 8; return `M${cx - 6},${yy} Q${cx},${yy + 2.5} ${cx + 6},${yy}`; }).join(' ')} className={s.anilloTraqueal} />
      <path d={`M${cx - 12},${yl - 9} L${cx - 3},${yl - 9} L${cx},${yl - 4} L${cx + 3},${yl - 9} L${cx + 12},${yl - 9} L${cx + 9},${yl + 4} Q${cx},${yl + 10} ${cx - 9},${yl + 4} Z`} className={s.laringe} />
      <path d={`M${cx - 9},${yl + 8} L${cx + 9},${yl + 8}`} className={s.cricoides} />
      <path d={`M${cx - 5},${yl - 4} L${cx},${yl + 4} L${cx + 5},${yl - 4}`} className={s.cuerdasVocales} strokeWidth={1.6 + 2.4 * lar} />
      <path d={ARBOL[0]} className={s.bronquios} strokeWidth={8 - 5 * bron} />
      <g clipPath="url(#hs-pulmones)">{ARBOL.slice(1).map((d, g) => <path key={g} d={d} className={s.bronquios} strokeWidth={(8 - 5 * bron) * grosor[g + 1]} />)}</g>
      {/* Corazón: aurícula y ventrículo derechos por delante, punta a la izquierda del paciente */}
      <path d={`M${cx + 2},${yc - 26} C${cx},270 ${cx + 6},256 ${cx + 14},258 C${cx + 22},262 ${cx + 18},280 ${cx + 14},296`} className={s.aorta} />
      <path d={`M${cx + 14},${yc - 20} C${cx + 18},${yc - 30} ${cx + 24},${yc - 34} ${cx + 30},${yc - 34}`} className={s.troncoPulmonar} />
      <path d={`M${cx - 14},${yc - 56} L${cx - 14},${yc - 18}`} className={s.cava} />
      <g transform={`translate(${cx + 10},${yc}) scale(${(0.86 * latido).toFixed(4)})`}>
        <path d="M-30,-22 C-44,6 -14,40 26,48 C42,34 46,0 34,-20 C22,-34 -16,-38 -30,-22 Z" className={s.corazon} />
        <path d="M-12,-30 C-4,-8 6,16 22,44" className={s.surcoCardiaco} />
        <path d="M-28,-16 C-38,-4 -34,10 -22,18 M-10,-28 C-2,-8 8,14 24,42" className={s.coronaria} />
        <path d="M-32,-24 C-40,-36 -24,-42 -16,-32 C-20,-24 -26,-20 -32,-24 Z" className={s.auricula} />
      </g>
      <CostillasFijas />
      {/* Intestino delgado: el peristaltismo se vuelve espasmo */}
      <g transform={`translate(${cx},0) scale(0.84,1) translate(${-cx},0)`}>
      <path d={ASAS} className={s.intestinoBorde} />
      <path d={ASAS} className={s.intestino} />
      <path d={ASAS} className={s.intestinoLuz} style={{ strokeDashoffset: -(reloj / 30) * intes }} strokeDasharray={intes > 0.02 ? '10 7' : undefined} />
      </g>
      {/* Adrenalina en la cara lateral del muslo */}
      {adr > 0.01 && (
        <g opacity={adr} transform={`translate(${cx + 148},664) rotate(50)`}>
          <rect x={-12} y={-70} width={24} height={86} rx={8} className={s.jeringa} />
          <rect x={-12} y={-70} width={24} height={20} rx={8} className={s.jeringaTapa} />
          <rect x={-7} y={-34} width={14} height={30} rx={3} className={s.jeringaVentana} />
          <line x1={0} y1={16} x2={0} y2={44} className={s.aguja} />
          <text x={-14} y={-80} className={s.rotuloDato} transform="rotate(-50 -14 -80)">Adrenalina IM</text>
        </g>
      )}
      {/* Monitor */}
      <rect x={Mo.x0} y={Mo.y0} width={Mo.x1 - Mo.x0} height={Mo.y1 - Mo.y0} rx={26} className={s.monitor} />
      <path d={Array.from({ length: 13 }, (_, i) => `M${f1(Mo.x0 + 40 + i * 46.7)},158 L${f1(Mo.x0 + 40 + i * 46.7)},336`).join(' ') + ' ' + [158, 200, 242, 284, 336].map((y) => `M${Mo.x0 + 40},${y} L${Mo.x1 - 40},${y}`).join(' ')} className={s.monitorRejilla} />
      <text x={Mo.x0 + 44} y={150} className={s.monitorCanal}>II</text>
      <text x={Mo.x0 + 44} y={290} className={s.monitorCanalPleth}>Pleth</text>
      <path d={ecg} className={s.ecg} />
      <path d={pleth} className={s.pleth} />
      {[
        ['PA', `${sis}/${dia}`, 'mmHg', pres > 0.5],
        ['FC', `${Math.round(fc)}`, 'lpm', pres > 0.5],
        ['SatO₂', `${sat}`, '%', bron > 0.5],
        ['FR', `${fr}`, 'rpm', bron > 0.5],
      ].map(([k, valor, u, alerta], i) => (
        <g key={k as string} transform={`translate(${Mo.x0 + 50 + (i % 2) * 300},${Mo.y0 + 270 + Math.floor(i / 2) * 200})`}>
          <text className={s.monitorRotulo}>{k}</text>
          <text y={86} className={alerta ? s.monitorAlerta : s.monitorValor}>{valor}</text>
          <text y={124} className={s.monitorRotulo}>{u}</text>
        </g>
      ))}
      <text x={(Mo.x0 + Mo.x1) / 2} y={Mo.y1 - 40} textAnchor="middle" className={pres > 0.5 ? s.monitorAlerta2 : s.monitorEstado}>{estado}</text>
      {pres > 0.5 && <circle cx={Mo.x1 - 46} cy={Mo.y0 + 40} r={10} className={s.monitorLuz} opacity={0.4 + 0.6 * (Math.sin(reloj / 180) > 0 ? 1 : 0)} />}
    </g>
  );
}

// ─── Sangre ───────────────────────────────────────────────────────────────────

const SangreFija = memo(function SangreFija() {
  const { y0, y1 } = SANGRE;
  const pared = (yBorde: number, signo: number) => {
    // signo −1: pared de arriba (la luz queda abajo); +1: la de abajo.
    const yM = yBorde + signo * 30;
    return (
      <g>
        <rect x={-800} y={signo < 0 ? yBorde - 50 : yBorde} width={3200} height={50} className={s.paredVaso} />
        {Array.from({ length: 34 }, (_, i) => <Huso key={i} x={i * 50 + (signo < 0 ? 0 : 25)} y={yM + (i % 2 ? 5 : -5)} l={22} h={4.2} c={s.fibraLisa} n={s.nucleoLiso} />)}
        <line x1={-800} y1={yBorde + signo * 13} x2={2400} y2={yBorde + signo * 13} className={s.membranaVen} />
        {Array.from({ length: 33 }, (_, i) => <Endotelial key={i} x={i * 52 + (signo < 0 ? 0 : 26)} y={yBorde + signo * 6} ang={signo < 0 ? 0 : 180} l={24} />)}
        {Array.from({ length: 6 }, (_, k) => <Colageno key={k} y={signo < 0 ? yBorde - 70 - k * 30 : yBorde + 70 + k * 30} amp={8} fase={k * 2 + signo} />)}
        {sembrar(14, signo < 0 ? 110 : 120, 0, signo < 0 ? 0 : yBorde + 60, 1600, signo < 0 ? yBorde - 60 : 1000).map(([x, y], i) => <Huso key={`f${i}`} x={x} y={y} l={20} h={3.5} ang={(hash(i, 4) - 0.5) * 20} c={s.fibroblasto} n={s.nucleoFibro} />)}
      </g>
    );
  };
  return <g>{pared(y0, -1)}{pared(y1, 1)}</g>;
});

/** Vellosidad placentaria: sincitiotrofoblasto con nudos sincitiales, citotrofoblasto y endotelio fetal. */
const PlacentaFija = memo(function PlacentaFija() {
  const yp = SANGRE.placenta;
  const borde = (dy: number, amp: number, fase: number) => { const pts: P[] = []; for (let x = -40; x <= 1680; x += 40) pts.push([x, yp + dy + Math.sin(x / 90 + fase) * amp]); return pts; };
  const arriba = borde(-34, 7, 0), abajo = borde(30, 4, 1.3);
  const banda = `${linea(arriba)} ${linea([...abajo].reverse()).replace('M', 'L')} Z`;
  return (
    <g>
      <path d={banda} className={s.trofoblasto} />
      <path d={nube(arriba.filter((_, i) => i % 2 === 0).flatMap(([x, y]) => [[x - 6, y + 12], [x + 4, y + 10]] as P[]))} className={s.nucleoTrofo} />
      {[160, 610, 1090, 1450].map((x, i) => <path key={i} d={nube([[x, yp - 40], [x + 9, yp - 44], [x - 8, yp - 44], [x + 2, yp - 50], [x - 4, yp - 36]])} className={s.nudoSincitial} />)}
      {Array.from({ length: 22 }, (_, i) => <g key={i} transform={`translate(${i * 76 + 20},${yp + 16})`}><ellipse rx={20} ry={9} className={s.citotrofo} /><ellipse rx={6} ry={4} className={s.nucleoTrofo2} /></g>)}
      {Array.from({ length: 30 }, (_, i) => <Endotelial key={i} x={i * 56 + 10} y={yp + 40} ang={180} l={25} />)}
    </g>
  );
});

function Sangre({ t, reloj }: { t: T; reloj: number }) {
  const { y0, y1, placenta: yp } = SANGRE;
  const pl = v(t, 'placenta'), hem = v(t, 'hemolisis');
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <rect x={-800} y={y0} width={3200} height={y1 - y0} className={s.plasmaSangre} />
      <rect x={-800} y={y0} width={3200} height={y1 - y0} className={s.hemoLibre} opacity={0.3 * hem} />
      <SangreFija />
      {Array.from({ length: 34 }, (_, i) => {
        const x = ((i * 97 + reloj * 0.06) % 1800) - 100;
        const fetal = pl > 0.5 && hash(i, 4) > 0.5;
        const y = pl > 0.02 ? (fetal ? yp + 60 + hash(i, 1) * (y1 - yp - 90) : y0 + 30 + hash(i, 1) * (yp - y0 - 90)) : y0 + 30 + hash(i, 1) * (y1 - y0 - 60);
        return <Hematie key={i} x={x} y={y} rot={hash(i, 2) * 50 - 25} k={fetal ? 0.85 : 1} fantasma={!fetal && hash(i, 7) < hem * 0.55} />;
      })}
      {/* Plaquetas y algún leucocito, más lentos junto a la pared */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = ((i * 149 + reloj * 0.05) % 1800) - 100;
        const y = hash(i, 12) > 0.5 ? y0 + 22 + hash(i, 13) * 30 : (pl > 0.5 ? yp - 70 : y1 - 22) - hash(i, 13) * 30;
        return <g key={i} transform={`translate(${f1(x)},${f1(y)}) rotate(${i * 37})`}><DibujoCelula dibujo="plaqueta" d={14} /></g>;
      })}
      {[0, 1].map((i) => {
        const x = ((i * 860 + reloj * 0.035) % 1900) - 150;
        return <g key={i} transform={`translate(${f1(x)},${i ? (pl > 0.5 ? yp - 80 : y1 - 46) : y0 + 46})`}><DibujoCelula dibujo="linfocito" d={34} color="#9AA3B8" /></g>;
      })}
      {pl > 0.01 && (
        <g opacity={pl}>
          <PlacentaFija />
          <text x={24} y={y0 + 34} className={s.rotuloTejido}>Sangre materna</text>
          <text x={24} y={yp + 84} className={s.rotuloTejido}>Capilar fetal</text>
          <text x={1576} y={yp - 54} textAnchor="end" className={s.rotuloDato}>Placenta (sincitiotrofoblasto)</text>
        </g>
      )}
      {pl < 0.99 && <text x={24} y={y0 + 34} className={s.rotuloTejido} opacity={1 - pl}>Luz del vaso</text>}
    </g>
  );
}

// ─── Glomérulo ────────────────────────────────────────────────────────────────

const { cx: G_X, cy: G_Y, r: G_R, mbg: G_MBG, bowman: G_BOW, alveolo: G_A } = GLOMERULO;
const POLO_V = Math.PI * 0.75, POLO_U = -Math.PI * 0.25;

const GlomeruloFijo = memo(function GlomeruloFijo() {
  const cx = G_X, cy = G_Y, r = G_R, bowman = G_BOW;
  const px = (a: number, rr: number) => cx + Math.cos(a) * rr, py = (a: number, rr: number) => cy + Math.sin(a) * rr;
  // Polo urinario: túbulo proximal (cúbico, ribete en cepillo) hacia arriba a la derecha.
  const tub: P[] = [];
  for (let k = 0; k <= 24; k++) { const q = k / 24; tub.push([px(POLO_U, bowman + 10) + q * 200 + Math.sin(q * 5) * 20, py(POLO_U, bowman + 10) - q * 190]); }
  const peritubular = sembrar(9, 140, 0, 0, 1600, 1000, (x, y) => Math.hypot(x - cx, y - cy) > bowman + 70 && Math.hypot(x - G_A.cx, y - G_A.cy) > G_A.r + 150 && Math.hypot(x - tub[12][0], y - tub[12][1]) > 90);
  const parietal = arcoElipse(bowman - 3, bowman - 3, 30, 0.2);
  return (
    <g>
      {peritubular.map(([x, y], i) => (
        <g key={i} transform={`translate(${f1(x)},${f1(y)})`}>
          <circle r={22} className={s.capilarPared} />
          <circle r={15} className={s.capilarLuz} />
          <Hematie x={0} y={0} rot={i * 30} k={0.7} />
        </g>
      ))}
      <path d={linea(tub)} className={s.tubuloPared} />
      <path d={linea(tub)} className={s.tubuloCepillo} />
      <path d={linea(tub)} className={s.tubuloLuz} />
      <path d={nube(tub.filter((_, i) => i % 2 === 1).flatMap(([x, y]) => [[x - 20, y - 14], [x + 20, y + 14]] as P[]))} className={s.nucleoTubulo} />
      {/* Polo vascular: arteriola aferente (con células yuxtaglomerulares) y eferente */}
      {[[-0.1, 30, 15, s.aferenteArt], [0.12, 22, 10, s.eferenteArt]].map(([da, w, wl, c], i) => {
        const a = POLO_V + (da as number);
        const d = `M${f1(px(a, r * 0.5))},${f1(py(a, r * 0.5))} L${f1(px(a, bowman + 40))},${f1(py(a, bowman + 40))} L${f1(px(a + (i ? 0.2 : -0.2), 900))},${f1(py(a + (i ? 0.2 : -0.2), 900))}`;
        return <g key={i}><path d={d} className={c as string} strokeWidth={w as number} /><path d={d} className={s.arteriolaLuz} strokeWidth={wl as number} /></g>;
      })}
      <path d={nube(Array.from({ length: 10 }, (_, k) => [px(POLO_V - 0.1, bowman + 40 + k * 12) + (k % 2 ? 9 : -9), py(POLO_V - 0.1, bowman + 40 + k * 12)] as P))} className={s.granuloYG} />
      <circle cx={cx} cy={cy} r={bowman + 16} className={s.capsulaBowman} />
      <circle cx={cx} cy={cy} r={bowman} className={s.espacioUrinario} />
      <path d={`M${f1(px(POLO_U, bowman - 6))},${f1(py(POLO_U, bowman - 6))} L${f1(px(POLO_U, bowman + 24))},${f1(py(POLO_U, bowman + 24))}`} className={s.tubuloLuz} />
      {parietal.map((a, i) => <Huso key={i} x={px(a, bowman - 3)} y={py(a, bowman - 3)} ang={gr(a) + 90} l={22} h={3} c={s.parietal} n={s.nucleoParietal} />)}
      {/* Tallo mesangial del polo vascular */}
      <path d={`M${f1(px(POLO_V, r * 0.62))},${f1(py(POLO_V, r * 0.62))} L${f1(px(POLO_V, bowman))},${f1(py(POLO_V, bowman))}`} className={s.mesangio} />
      {/* Podocitos: cuerpo, procesos primarios que abrazan la membrana basal */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * TAU + 0.3;
        const rc = r + 62;
        const brazos = [-0.2, -0.08, 0.08, 0.2].map((da) => `M${f1(px(a, rc))},${f1(py(a, rc))} Q${f1(px(a + da * 0.6, rc - 8))},${f1(py(a + da * 0.6, rc - 8))} ${f1(px(a + da, r + G_MBG + 9))},${f1(py(a + da, r + G_MBG + 9))}`).join(' ');
        return (
          <g key={i}>
            <path d={brazos} className={s.procesoPodo} />
            <circle cx={px(a, rc)} cy={py(a, rc)} r={30} className={s.podocito} />
            <circle cx={px(a, rc) - 3} cy={py(a, rc) + 2} r={13} className={s.nucleoPodo} />
          </g>
        );
      })}
    </g>
  );
});

/** Endotelio fenestrado: núcleos que abomban hacia la luz. */
const EndoGlomFijo = memo(function EndoGlomFijo() {
  return (
    <g>
      <circle cx={G_X} cy={G_Y} r={G_R - 6} className={s.endotelioFenestrado} />
      {arcoElipse(G_R - 8, G_R - 8, 9, 0.1).map((a, i) => <ellipse key={i} cx={G_X + Math.cos(a) * (G_R - 12)} cy={G_Y + Math.sin(a) * (G_R - 12)} rx={14} ry={5} transform={`rotate(${f1(gr(a) + 90)} ${f1(G_X + Math.cos(a) * (G_R - 12))} ${f1(G_Y + Math.sin(a) * (G_R - 12))})`} className={s.nucleoEndo} />)}
    </g>
  );
});

/** Alvéolo y sus vecinos: tabiques con capilares, neumocitos I (planos) y II (cúbicos). */
const AlveoloFijo = memo(function AlveoloFijo() {
  const { cx, cy, r } = G_A;
  const vecinos = [0.2, 1.25, 2.3, 3.4, 4.45, 5.5].map((a, i) => ({ a, rr: 78 + (i % 3) * 10 }));
  const borde = Array.from({ length: 37 }, (_, i) => { const a = (i / 36) * TAU; const rr = 300 + Math.sin(a * 5) * 16 + Math.sin(a * 3 + 1) * 10; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as P; });
  return (
    <g>
      <path d={linea(borde) + 'Z'} className={s.parenquimaPulmon} />
      {vecinos.map(({ a, rr }, i) => (
        <g key={i}>
          <circle cx={cx + Math.cos(a) * (r + rr + 14)} cy={cy + Math.sin(a) * (r + rr + 14)} r={rr} className={s.alveolo} />
        </g>
      ))}
      {vecinos.map(({ a }, i) => {
        const x = cx + Math.cos(a + 0.52) * (r + 14), y = cy + Math.sin(a + 0.52) * (r + 14);
        return <g key={i} transform={`translate(${f1(x)},${f1(y)})`}><circle r={9} className={s.capilarLuz} /><Hematie x={0} y={0} rot={i * 40} k={0.5} /></g>;
      })}
    </g>
  );
});
const AlveoloInterior = memo(function AlveoloInterior() {
  const { cx, cy, r } = G_A;
  return (
    <g>
      {arcoElipse(r + 4, r + 4, 9, 0.3).map((a, i) => <Huso key={i} x={cx + Math.cos(a) * (r + 4)} y={cy + Math.sin(a) * (r + 4)} ang={gr(a) + 90} l={20} h={2.6} c={s.neumocito1} n={s.nucleoParietal} />)}
      {[2.1, 5.0].map((a, i) => (
        <g key={i} transform={`translate(${f1(cx + Math.cos(a) * (r - 6))},${f1(cy + Math.sin(a) * (r - 6))}) rotate(${f1(gr(a) + 90)})`}>
          <rect x={-13} y={-10} width={26} height={20} rx={6} className={s.neumocito2} />
          <circle cy={2} r={5} className={s.nucleoTiro} />
          <path d={nube([[-7, -5], [7, -5], [0, -6]])} className={s.cuerpoLamelar} />
        </g>
      ))}
    </g>
  );
});

function Glomerulo({ t, reloj }: { t: T; reloj: number }) {
  const cx = G_X, cy = G_Y, r = G_R, mbg = G_MBG, bowman = G_BOW, A = G_A;
  const lin = v(t, 'lineal'), gran = v(t, 'granular'), prot = v(t, 'proteinuria'), hema = v(t, 'hematuria'), dano = v(t, 'dano'), hemo = v(t, 'hemorragia'), comp = v(t, 'complemento');
  const R2 = r + mbg / 2;
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <GlomeruloFijo />
      <text x={cx} y={cy - bowman + 44} textAnchor="middle" className={s.rotuloTejido}>Espacio urinario (de Bowman)</text>
      {/* Pedicelos sobre la membrana basal: se borran (fusión) con la proteinuria */}
      {Array.from({ length: 72 }, (_, i) => { const a = (i / 72) * TAU; const x = cx + Math.cos(a) * (r + mbg + 5), y = cy + Math.sin(a) * (r + mbg + 5); return <ellipse key={i} cx={f1(x)} cy={f1(y)} rx={f1(5 + 7 * prot)} ry={4.5} transform={`rotate(${f1(gr(a) + 90)} ${f1(x)} ${f1(y)})`} className={s.pedicelo} />; })}
      <circle cx={cx} cy={cy} r={r} className={s.luzCapilar} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * TAU + reloj / 9000; const q = 0.35 + hash(i, 1) * 0.5; return <Hematie key={i} x={cx + Math.cos(a) * r * q} y={cy + Math.sin(a) * r * q} rot={gr(a)} />; })}
      {/* Membrana basal glomerular: lámina rara interna, densa y rara externa (con roturas si hay daño) */}
      <circle cx={cx} cy={cy} r={R2} className={s.mbg} strokeWidth={mbg} strokeDasharray={dano > 0.02 ? `${120 - 60 * dano} ${14 * dano}` : undefined} />
      <circle cx={cx} cy={cy} r={R2} className={s.laminaDensa} strokeDasharray={dano > 0.02 ? `${120 - 60 * dano} ${14 * dano}` : undefined} />
      <EndoGlomFijo />
      {lin > 0.01 && <circle cx={cx} cy={cy} r={R2} className={s.ifLineal} opacity={lin} />}
      {gran > 0.01 && Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * TAU + hash(i, 2) * 0.1; const sub = i % 3 === 0; return <circle key={i} cx={cx + Math.cos(a) * (R2 + (sub ? -14 : 13))} cy={cy + Math.sin(a) * (R2 + (sub ? -14 : 13))} r={7 + hash(i, 3) * 6} className={s.ifGranular} opacity={gran} />; })}
      {comp > 0.01 && Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * TAU + 0.2; const x = cx + Math.cos(a) * (R2 - 26), y = cy + Math.sin(a) * (R2 - 26); return <path key={i} d={`M${f1(x)},${f1(y - 7)} L${f1(x + 7)},${f1(y + 6)} L${f1(x - 7)},${f1(y + 6)} Z`} className={s.c3} opacity={comp} />; })}
      {/* Proteínas y hematíes que cruzan al espacio urinario */}
      {prot > 0.02 && Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * TAU; const q = ciclo(reloj, 3000, hash(i, 5)); const rr = r - 30 + q * (bowman - r + 10); return <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr} r={4} className={s.proteina} opacity={prot * (q > 0.3 ? 1 : 0.5)} />; })}
      {hema > 0.02 && Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * TAU + 1; const q = ciclo(reloj, 4200, hash(i, 6)); const rr = r - 40 + q * (bowman - r + 20); return <Hematie key={i} x={cx + Math.cos(a) * rr} y={cy + Math.sin(a) * rr} rot={gr(a)} k={0.9} />; })}
      <text x={cx} y={cy + 8} textAnchor="middle" className={s.rotuloTejido}>Luz capilar</text>
      <text x={cx + bowman * 0.72 + 34} y={cy + bowman * 0.72 + 44} className={s.rotuloDato}>MBG · podocitos</text>
      <text x={cx - bowman * 0.72 - 40} y={cy + bowman * 0.72 + 60} textAnchor="end" className={s.rotuloDato}>Polo vascular</text>
      {/* Alvéolo pulmonar (Goodpasture) */}
      <AlveoloFijo />
      <circle cx={A.cx} cy={A.cy} r={A.r + 10} className={s.paredAlveolo} />
      <circle cx={A.cx} cy={A.cy} r={A.r} className={s.alveolo} />
      <AlveoloInterior />
      {hemo > 0.02 && Array.from({ length: 18 }, (_, i) => { if (hash(i, 7) > hemo) return null; const a = i * 2.39996; const k = Math.sqrt((i + 0.5) / 18) * A.r * 0.85; return <Hematie key={i} x={A.cx + Math.cos(a) * k} y={A.cy + Math.sin(a) * k} rot={i * 23} />; })}
      {lin > 0.01 && <circle cx={A.cx} cy={A.cy} r={A.r + 5} className={s.ifLineal} opacity={lin} strokeWidth={8} />}
      <ellipse cx={A.cx} cy={A.cy + A.r + 30} rx={46} ry={14} className={s.luzCapilar} />
      {[0, 1].map((i) => <Hematie key={i} x={A.cx - 30 + ((i * 40 + reloj * 0.03) % 60)} y={A.cy + A.r + 30} rot={0} k={0.7} />)}
      <text x={A.cx} y={A.cy - A.r - 24} textAnchor="middle" className={s.rotuloTejido}>Alvéolo pulmonar</text>
    </g>
  );
}

// ─── Placa motora y tiroides ──────────────────────────────────────────────────

const POZOS = [292, 392, 505];
const { membrana: P_YM, receptores: P_REC, foliculo: P_F } = PLACA;
const PLIEGUES = `M40,${P_YM} ${P_REC.map((x) => `L${x - 34},${P_YM} C${x - 34},${P_YM + 70} ${x - 14},${P_YM + 70} ${x - 14},${P_YM} L${x + 14},${P_YM}`).join(' ')} L760,${P_YM}`;

/** Lo quieto de la placa: miofibrillas, placa basal (núcleos, mitocondrias), lámina basal con AChE y los folículos vecinos. */
const PlacaFija = memo(function PlacaFija() {
  const ym = P_YM, F = P_F;
  return (
    <g>
      {[1, 2, 3, 4, 5].map((k) => <line key={k} x1={48} y1={ym + 90 + k * 46.7} x2={752} y2={ym + 90 + k * 46.7} className={s.separaMiofibrilla} />)}
      {[170, 300, 450, 590].map((x, i) => <ellipse key={i} cx={x} cy={ym + 56} rx={20} ry={8} className={s.nucleoMusculo} />)}
      {[120, 220, 260, 360, 400, 500, 540, 640].map((x, i) => <g key={i} transform={`translate(${x},${ym + 80})`}><ellipse rx={11} ry={5} className={s.mitocondria} /><path d="M-7,0 l3,-3 l3,3 l3,-3 l3,3" className={s.crestas} /></g>)}
      <path d={PLIEGUES} transform="translate(0,-7)" className={s.laminaBasalSinap} />
      <path d={nube(P_REC.flatMap((x) => [[x - 28, ym - 8], [x - 24, ym + 24], [x - 20, ym + 46]] as P[]))} className={s.ache} />
      {/* Folículos vecinos y la membrana basal del grande */}
      {[[920, 230, 88], [945, 830, 80]].map(([x, y, rr], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={rr} className={s.tirocito} />
          <circle cx={x} cy={y} r={rr - 22} className={s.coloide} />
          <path d={nube(Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * TAU; return [x + Math.cos(a) * (rr - 10), y + Math.sin(a) * (rr - 10)] as P; }))} className={s.nucleosTiroVecino} />
        </g>
      ))}
      <circle cx={F.cx} cy={F.cy} r={F.r + 10} className={s.membranaFoliculo} />
      <rect x={1470} y={140} width={60} height={760} rx={30} className={s.capilarTiroides} />
      {Array.from({ length: 12 }, (_, i) => <Endotelial key={i} x={1474} y={170 + i * 62} ang={90} l={26} h={3.6} />)}
      {Array.from({ length: 12 }, (_, i) => <Endotelial key={`d${i}`} x={1526} y={200 + i * 62} ang={-90} l={26} h={3.6} />)}
    </g>
  );
});

function Placa({ t, reloj }: { t: T; reloj: number }) {
  const ym = P_YM, receptores = P_REC, F = P_F;
  const ach = v(t, 'ach'), bloq = v(t, 'bloqueo'), intern = v(t, 'internalizacion'), contr = v(t, 'contraccion'), anti = v(t, 'antiTshr'), horm = v(t, 'hormona');
  const latido = 0.5 + 0.5 * Math.sin(reloj / 260);
  const fuerza = contr * (0.75 + 0.25 * latido);
  const p = 40 * (1 - 0.16 * fuerza);
  const sarc = Math.floor(690 / p);
  const celulas = 18;
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <line x1={800} y1={60} x2={800} y2={960} className={s.divisor} />
      <text x={400} y={70} textAnchor="middle" className={s.rotuloTejido}>Placa motora · miastenia gravis</text>
      <text x={1210} y={70} textAnchor="middle" className={s.rotuloTejido}>Folículo tiroideo · enfermedad de Graves</text>
      {/* Fibra muscular con sus sarcómeros: banda A oscura, zona H que se cierra al contraerse, línea Z */}
      <rect x={40} y={ym} width={720} height={390} rx={20} className={s.fibraMuscular} />
      {Array.from({ length: sarc }, (_, k) => {
        const x = 60 + k * p;
        const wH = 0.18 * p * (1 - 0.85 * fuerza);
        return (
          <g key={k}>
            <rect x={f1(x + 0.2 * p)} y={ym + 92} width={f1(0.6 * p)} height={278} className={s.bandaA} />
            <rect x={f1(x + 0.5 * p - wH / 2)} y={ym + 92} width={f1(wH)} height={278} className={s.zonaH} />
            <line x1={f1(x)} y1={ym + 92} x2={f1(x)} y2={ym + 370} className={s.sarcomero} />
          </g>
        );
      })}
      <PlacaFija />
      <path d={PLIEGUES} className={s.membranaPost} />
      {/* Receptores de ACh en las crestas de los pliegues */}
      {receptores.map((x, i) => {
        const fuera = hash(i, 3) < intern * 0.75;
        const dy = fuera ? 60 * intern : 0;
        return (
          <g key={i} transform={`translate(${x},${ym - 8 + dy})`} opacity={fuera ? 1 - 0.85 * intern : 1}>
            <path d="M-10,-14 L-10,4 Q0,12 10,4 L10,-14" className={s.achr} />
            <path d="M-4,-14 L-4,2 M4,-14 L4,2" className={s.achrPoro} />
            {bloq > 0.02 && !fuera && <g transform="translate(0,-34)" opacity={bloq}><Anticuerpo ab="IgG" d={44} color="#E8B21E" /></g>}
          </g>
        );
      })}
      {/* ACh que cae de los pozos de la terminal hacia los receptores */}
      {ach > 0.02 && POZOS.flatMap((x0, k) => Array.from({ length: 5 }, (_, i) => {
        const q = ciclo(reloj, 1400, i / 5 + k * 0.13);
        const dest = receptores[Math.min(receptores.length - 1, Math.round((x0 - 118) / 100) + (i % 2))];
        const rebota = bloq > 0.4 && q > 0.7;
        const x = x0 + (dest - x0) * Math.min(1, q / 0.75);
        const y = 480 + (ym - 40 - 480) * Math.min(1, q / 0.75) - (rebota ? (q - 0.7) * 120 * bloq : 0);
        return <path key={`${k}-${i}`} d={`M${f1(x)},${f1(y - 6)} L${f1(x + 6)},${f1(y)} L${f1(x)},${f1(y + 6)} L${f1(x - 6)},${f1(y)} Z`} className={s.ach} opacity={ach * (q > 0.9 ? (1 - q) * 10 : 1)} />;
      }))}
      {/* Fuerza muscular */}
      <rect x={700} y={ym + 40} width={30} height={300} rx={8} className={s.medidorFondo} />
      <rect x={700} y={ym + 40 + 300 * (1 - fuerza)} width={30} height={300 * fuerza} rx={8} className={fuerza < 0.5 ? s.medidorBajo : s.medidorOk} />
      <text x={715} y={ym + 372} textAnchor="middle" className={s.rotuloDato}>Fuerza</text>

      {/* Folículo tiroideo */}
      {Array.from({ length: 5 }, (_, i) => <Hematie key={i} x={1500 + (i % 2 ? 5 : -5)} y={150 + ((i * 160 + reloj * 0.05) % 740)} rot={90} k={0.9} />)}
      <circle cx={F.cx} cy={F.cy} r={F.r - 40 - 45 * horm} className={s.coloide} />
      {horm > 0.05 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU; const rr = F.r - 40 - 45 * horm; return <circle key={i} cx={F.cx + Math.cos(a) * rr} cy={F.cy + Math.sin(a) * rr} r={10 * horm} className={s.vacuola} />; })}
      {Array.from({ length: celulas }, (_, i) => {
        const a = (i / celulas) * TAU;
        const alto = 46 + 46 * horm;
        const rr = F.r - 40 - 45 * horm + alto / 2;
        return (
          <g key={i} transform={`translate(${f1(F.cx + Math.cos(a) * rr)},${f1(F.cy + Math.sin(a) * rr)}) rotate(${f1(gr(a))})`}>
            <rect x={-alto / 2} y={-38} width={alto} height={76} rx={10} className={s.tirocito} />
            <path d={[-24, -12, 0, 12, 24].map((y) => `M${f1(-alto / 2)},${y} l-6,0`).join(' ')} className={s.microvellosidad} />
            {horm > 0.1 && <path d={nube([[-alto / 2 + 9, -10], [-alto / 2 + 12, 9]])} className={s.vesiculaApical} opacity={horm} />}
            <circle cx={alto * 0.12} r={12} className={s.nucleoTiro} />
            <circle cx={alto * 0.12 - 3} cy={-3} r={2.6} className={s.nucleolo} />
            {/* TSHR en la cara basal (hacia fuera) */}
            <g transform={`translate(${alto / 2 + 4},0) rotate(90)`}><path d="M-7,-10 L-7,3 Q0,9 7,3 L7,-10" className={s.tshr} /></g>
            {anti > 0.02 && i % 2 === 0 && <g transform={`translate(${alto / 2 + 34},0) rotate(-90)`} opacity={anti}><Anticuerpo ab="IgG" d={40} color="#E07A8A" /></g>}
          </g>
        );
      })}
      {horm > 0.02 && Array.from({ length: 14 }, (_, i) => { const q = ciclo(reloj, 2200, hash(i, 4)); const a = -0.6 + hash(i, 5) * 1.2; const r0 = F.r + 10; return <circle key={i} cx={F.cx + Math.cos(a) * (r0 + q * 160)} cy={F.cy + Math.sin(a) * (r0 + q * 160)} r={6} className={s.t4} opacity={horm * (1 - q * 0.5)} />; })}
      <text x={F.cx} y={F.cy + 8} textAnchor="middle" className={s.rotuloDato}>Coloide</text>
      {horm > 0.02 && <text x={1500} y={130} textAnchor="middle" className={s.rotuloDato} opacity={horm}>T3 / T4 ↑</text>}
    </g>
  );
}

// ─── Vaso en corte (complejos inmunitarios) ──────────────────────────────────

const { cx: V_X, cy: V_Y, luz: V_LUZ, intima: V_INT, media: V_MED, adventicia: V_ADV } = VASO;

/** Alrededor de la arteriola: tejido laxo con fibroblastos y adipocitos, una vénula y un nervio acompañantes. */
const EntornoVasoFijo = memo(function EntornoVasoFijo() {
  const libre = (x: number, y: number) => Math.hypot(x - V_X, y - V_Y) > V_ADV + 30 && Math.hypot(x - 1000, y - 820) > 120;
  const adipos = sembrar(14, 150, 1080, 560, 1640, 1040, (x, y) => libre(x, y), 104);
  const fibro = sembrar(30, 160, 0, 0, 1600, 1000, libre);
  return (
    <g>
      {Array.from({ length: 8 }, (_, k) => <Colageno key={k} y={60 + k * 120} amp={18} fase={k * 1.3} />)}
      {adipos.map(([x, y], i) => <g key={i}><circle cx={f1(x)} cy={f1(y)} r={44 + hash(i, 151) * 6} className={s.adipocito} /><ellipse cx={f1(x + 30)} cy={f1(y)} rx={7} ry={3} className={s.nucleoFibro} /></g>)}
      {fibro.map(([x, y], i) => <Huso key={i} x={x} y={y} l={22} h={3.5} ang={(hash(i, 161) - 0.5) * 60} c={s.fibroblasto} n={s.nucleoFibro} />)}
      {/* Vénula acompañante */}
      <ellipse cx={1000} cy={820} rx={96} ry={54} className={s.paredVaso} />
      <ellipse cx={1000} cy={820} rx={84} ry={44} className={s.luzVaso} />
      {[0, 1, 2].map((i) => <Hematie key={i} x={960 + i * 38} y={812 + (i % 2) * 16} rot={i * 25} k={0.9} />)}
      {/* Nervio perivascular */}
      <circle cx={1060} cy={330} r={40} className={s.perineuroCorte} />
      <path d={nube(Array.from({ length: 16 }, (_, k) => { const a = k * 2.39996; const rr = Math.sqrt((k + 0.5) / 16) * 30; return [1060 + Math.cos(a) * rr, 330 + Math.sin(a) * rr] as P; }))} className={s.axonCorte} />
    </g>
  );
});

/** La pared: fibras musculares en anillo (dos capas), láminas elásticas interna (festoneada) y externa, íntima. */
const ParedVasoFija = memo(function ParedVasoFija() {
  const cx = V_X, cy = V_Y;
  const iel: P[] = Array.from({ length: 145 }, (_, i) => { const a = (i / 144) * TAU; const rr = V_INT + 3 * Math.sin(a * 36); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
  return (
    <g>
      {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={cx} cy={cy} r={V_MED + 6 + k * 3.5} className={s.colagenoAdv} />)}
      <circle cx={cx} cy={cy} r={V_MED} className={s.media} />
      {[0, 1, 2].flatMap((capa) => Array.from({ length: 34 + capa * 3 }, (_, i) => {
        const n = 34 + capa * 3;
        const a = (i / n) * TAU + capa * 0.05;
        const rr = V_INT + 10 + capa * 16;
        return <Huso key={`${capa}-${i}`} x={cx + Math.cos(a) * rr} y={cy + Math.sin(a) * rr} ang={gr(a) + 90} l={(TAU * rr) / n / 2 * 0.98} h={6} c={s.fibraLisa} n={s.nucleoLiso} kn={0.3} />;
      }))}
      <circle cx={cx} cy={cy} r={V_MED} className={s.elasticaExterna} />
      <circle cx={cx} cy={cy} r={V_INT} className={s.intima} />
      <path d={linea(iel) + 'Z'} className={s.elasticaInterna} />
    </g>
  );
});

const EndoVasoFijo = memo(function EndoVasoFijo() {
  return <g>{arcoElipse(V_LUZ + 6, V_LUZ + 6, 30).map((a, i) => <Endotelial key={i} x={V_X + Math.cos(a) * (V_LUZ + 6)} y={V_Y + Math.sin(a) * (V_LUZ + 6)} ang={tangente(V_LUZ + 6, V_LUZ + 6, a)} l={30} />)}</g>;
});

function Vaso({ t, reloj }: { t: T; reloj: number }) {
  const cx = V_X, cy = V_Y, luz = V_LUZ, media = V_MED, adventicia = V_ADV;
  const dep = v(t, 'deposito'), nec = v(t, 'necrosis'), tro = v(t, 'trombo'), vas = v(t, 'vasculitis'), fuga = v(t, 'fuga'), comp = v(t, 'complemento');
  const arco = (r0: number, r1: number, a0: number, a1: number) => {
    const p = (r: number, a: number) => `${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}`;
    return `M${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`;
  };
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <EntornoVasoFijo />
      <rect x={-800} y={-800} width={3200} height={2600} className={s.edema} opacity={0.35 * fuga} />
      <circle cx={cx} cy={cy} r={adventicia} className={s.adventicia} />
      <ParedVasoFija />
      <circle cx={cx} cy={cy} r={luz} className={s.luzVaso} />
      <EndoVasoFijo />
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU + reloj / 7000; const q = 0.3 + hash(i, 1) * 0.55; return <Hematie key={i} x={cx + Math.cos(a) * luz * q} y={cy + Math.sin(a) * luz * q} rot={gr(a)} />; })}
      {/* Necrosis fibrinoide: el lado izquierdo de la pared se vuelve rosado y borroso */}
      {nec > 0.01 && (
        <g opacity={nec}>
          <path d={arco(luz - 4, media + 16, Math.PI * 0.62, Math.PI * 1.38)} className={s.fibrinoide} />
          {Array.from({ length: 22 }, (_, i) => { const a = Math.PI * (0.64 + (i / 22) * 0.72); const r = luz + hash(i, 4) * (media - luz); return <line key={i} x1={f1(cx + Math.cos(a) * r)} y1={f1(cy + Math.sin(a) * r)} x2={f1(cx + Math.cos(a + 0.05) * (r + 22))} y2={f1(cy + Math.sin(a + 0.05) * (r + 14))} className={s.fibrina} />; })}
          <path d={nube(Array.from({ length: 18 }, (_, i) => { const a = Math.PI * (0.66 + hash(i, 30) * 0.68); const r = luz + 10 + hash(i, 31) * (media - luz); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as P; }))} className={s.cariorrexis} />
        </g>
      )}
      {/* Depósitos subendoteliales de inmunocomplejos */}
      {dep > 0.01 && Array.from({ length: 14 }, (_, i) => {
        if (hash(i, 2) > dep * 1.1) return null;
        const a = Math.PI * (0.66 + (i / 14) * 0.68);
        const r = luz + 18;
        return <g key={i} transform={`translate(${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)})`}><circle r={9} className={s.deposito} /><circle r={4} cx={4} cy={-3} className={s.depositoAg} /></g>;
      })}
      {comp > 0.01 && Array.from({ length: 12 }, (_, i) => { const a = Math.PI * (0.68 + (i / 12) * 0.64); const x = cx + Math.cos(a) * (luz - 18), y = cy + Math.sin(a) * (luz - 18); return <path key={i} d={`M${f1(x)},${f1(y - 7)} L${f1(x + 7)},${f1(y + 6)} L${f1(x - 7)},${f1(y + 6)} Z`} className={s.c3} opacity={comp} />; })}
      {/* Neutrófilos en la pared (vasculitis aguda) */}
      {vas > 0.01 && Array.from({ length: 16 }, (_, i) => {
        if (hash(i, 6) > vas) return null;
        const a = Math.PI * (0.62 + hash(i, 7) * 0.76);
        const r = luz + 20 + hash(i, 8) * (adventicia - luz);
        return <g key={i} transform={`translate(${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)})`} opacity={vas}><DibujoCelula dibujo="linfocito" d={22} color="#8A4FCF" /></g>;
      })}
      {/* Agregado de plaquetas → trombo */}
      {tro > 0.01 && Array.from({ length: 16 }, (_, i) => {
        if (i / 16 > tro) return null;
        const a = Math.PI + (hash(i, 9) - 0.5) * 0.5;
        const r = luz - 16 - hash(i, 10) * 90 * tro;
        return <g key={i} transform={`translate(${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}) rotate(${i * 37})`}><DibujoCelula dibujo="plaqueta" d={22} /></g>;
      })}
      {tro > 0.2 && <path d={Array.from({ length: 6 }, (_, i) => { const y = cy - 60 + i * 24; return `M${cx - luz + 18},${y} q${40 * tro},-10 ${80 * tro},6`; }).join(' ')} className={s.fibrina} opacity={tro} />}
      <text x={cx} y={cy - adventicia - 24} textAnchor="middle" className={s.rotuloTejido}>Arteriola (corte transversal)</text>
      <text x={cx} y={cy + 8} textAnchor="middle" className={s.rotuloDato}>Luz</text>
      <text x={cx + adventicia + 20} y={cy - media + 10} className={s.rotuloDato}>Media</text>
      <text x={cx + adventicia + 20} y={cy - media + 36} className={s.rotuloDato}>Íntima · endotelio</text>
      <text x={1300} y={160} textAnchor="middle" className={s.rotuloTejido}>Tejido · ganglio</text>
    </g>
  );
}

// ─── Piel ─────────────────────────────────────────────────────────────────────

const { cornea: S_COR, basal: S_BAS, venulas: S_VEN } = PIEL;

/** Anexos y dermis quietos: folículo piloso con glándula sebácea y músculo erector, glándula sudorípara y fibroblastos. */
const AnexosFijos = memo(function AnexosFijos() {
  const fx = 130;
  const enrollado: P[] = Array.from({ length: 64 }, (_, i) => { const a = i * 0.42; const q = i / 63; return [1470 + Math.cos(a) * (40 - 10 * q) + Math.sin(a * 0.31) * 18, 900 + Math.sin(a) * 26 * (1 - 0.3 * q) - q * 30]; });
  const ducto: P[] = [];
  for (let y = 860; y >= S_BAS + 30; y -= 14) ducto.push([1452 + Math.sin(y / 40) * 10, y]);
  const fibro = sembrar(22, 170, 0, S_BAS + 70, 1600, 990, (x, y) => S_VEN.every((V) => Math.hypot((x - V.cx) / (V.rx + 60), (y - V.cy) / (V.ry + 70)) > 1) && x > 230 && !(x > 1390 && y > 780));
  return (
    <g>
      {fibro.map(([x, y], i) => <Huso key={i} x={x} y={y} l={21} h={3.4} ang={(hash(i, 171) - 0.5) * 24} c={s.fibroblasto} n={s.nucleoFibro} />)}
      {/* Glándula sudorípara ecrina: ovillo en la dermis profunda y conducto */}
      <path d={linea(enrollado)} className={s.sudoriparaPared} />
      <path d={linea(enrollado)} className={s.sudoriparaLuz} />
      <path d={linea(ducto)} className={s.sudoriparaPared} />
      <path d={linea(ducto)} className={s.sudoriparaLuz} />
      {/* Folículo piloso */}
      <path d={`M${fx - 34},${S_BAS - 10} C${fx - 36},${S_BAS + 160} ${fx - 40},${S_BAS + 360} ${fx - 46},${S_BAS + 520} C${fx - 50},${S_BAS + 590} ${fx + 50},${S_BAS + 590} ${fx + 46},${S_BAS + 520} C${fx + 40},${S_BAS + 360} ${fx + 36},${S_BAS + 160} ${fx + 34},${S_BAS - 10} Z`} className={s.vainaExterna} />
      <path d={`M${fx - 18},${S_BAS + 10} L${fx - 22},${S_BAS + 520} C${fx - 24},${S_BAS + 560} ${fx + 24},${S_BAS + 560} ${fx + 22},${S_BAS + 520} L${fx + 18},${S_BAS + 10} Z`} className={s.vainaInterna} />
      <path d={`M${fx},${S_COR - 70} C${fx + 4},${S_COR + 60} ${fx - 2},${S_BAS + 200} ${fx},${S_BAS + 500}`} className={s.pelo2} />
      <ellipse cx={fx} cy={S_BAS + 548} rx={30} ry={22} className={s.bulbo} />
      <ellipse cx={fx} cy={S_BAS + 556} rx={13} ry={10} className={s.papilaPelo} />
      {/* Glándula sebácea: lóbulos de células espumosas */}
      {[[fx + 66, S_BAS + 120, 34], [fx + 92, S_BAS + 176, 28], [fx + 56, S_BAS + 196, 24]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} className={s.sebacea} />
          <path d={nube(Array.from({ length: 10 }, (_, k) => { const a = k * 2.39996; const rr = Math.sqrt((k + 0.5) / 10) * r * 0.8; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as P; }))} className={s.sebocito} />
        </g>
      ))}
      <path d={`M${fx + 40},${S_BAS + 150} L${fx + 34},${S_BAS + 140}`} className={s.ductoSebaceo} />
      {/* Músculo erector del pelo */}
      <path d={`M${fx + 46},${S_BAS + 300} C${fx + 120},${S_BAS + 230} ${fx + 170},${S_BAS + 120} ${fx + 200},${S_BAS + 40}`} className={s.erector} />
    </g>
  );
});

function Piel({ t, reloj }: { t: T; reloj: number }) {
  const cornea = S_COR, basal = S_BAS, venulas = S_VEN;
  const eri = v(t, 'eritema'), vaso = v(t, 'vasodilatacion'), act = v(t, 'activacion'), man = v(t, 'manguito'), edema = v(t, 'edema');
  const ind = v(t, 'induracion'), ves = v(t, 'vesicula'), aca = v(t, 'acantolisis');
  const sube = (x: number) => -70 * ind * Math.exp(-Math.pow((x - 800) / 380, 2));
  const mb = (x: number) => basal + 18 + 22 * Math.sin(x / 85) + sube(x);
  const filas: ReactNode[] = [];
  for (let fila = 0; fila < 4; fila++) {
    for (let i = 0; i < 28; i++) {
      const x = i * 60 + (fila % 2) * 30;
      const y = cornea + 40 + fila * 52 + sube(x) + (fila === 3 && aca > 0.02 && x > 470 && x < 1130 ? -40 * aca : 0);
      const esp = ves * (Math.abs(x - 800) < 320 ? 1 : 0.3);
      const redonda = aca > 0.3 && fila === 3 && x > 520 && x < 1080 && hash(i, fila) < aca * 0.5;
      const granulosa = fila === 0;
      filas.push(
        <g key={`${fila}-${i}`} transform={`translate(${x},${f1(y + (redonda ? 30 * aca : 0))})`}>
          {redonda
            ? <circle r={20} className={s.queratinocitoSuelto} />
            : granulosa
              ? <rect x={-29 + 6 * esp} y={-14} width={58 - 12 * esp} height={30} rx={9} className={s.granulosa} />
              : <rect x={-28 + 6 * esp} y={-24 + 5 * esp} width={56 - 12 * esp} height={48 - 10 * esp} rx={10} className={s.queratinocito} />}
          {granulosa
            ? <><ellipse rx={7} ry={4.5} className={s.nucleoQuera} /><path d={nube([[-18, -4], [-13, 5], [13, -5], [18, 4], [-6, 8], [7, -8]])} className={s.queratohialina} /></>
            : <circle r={8} className={s.nucleoQuera} />}
        </g>,
      );
    }
  }
  const capas = [0, 1, 2, 3].map((k) => `M-800,${f1(cornea - 8 - k * 6 + sube(0))} ${Array.from({ length: 33 }, (_, i) => `L${i * 50},${f1(cornea - 8 - k * 6 - 4 * Math.sin(i * 1.7 + k) + sube(i * 50))}`).join(' ')} L2400,${cornea - 8 - k * 6}`);
  const papilas = [400, 667, 934, 1201].map((x) => ({ x, y: mb(x) + 10 }));
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={800 + cornea} className={s.aire} />
      <rect x={-800} y={basal - 120} width={3200} height={2200} className={s.dermis} />
      <rect x={-800} y={basal + 130} width={3200} height={2000} className={s.dermisReticular} />
      <rect x={-800} y={basal - 120} width={3200} height={2200} className={s.eritema} opacity={0.3 * eri} />
      <rect x={-800} y={basal - 120} width={3200} height={2200} className={s.edema} opacity={0.4 * edema} />
      {Array.from({ length: 6 }, (_, i) => <Colageno key={`p${i}`} y={basal + 70 + i * 14 + edema * i * 3} amp={6} fase={i * 2.1} n={1} edema={edema} />)}
      {Array.from({ length: 8 }, (_, i) => <Colageno key={`r${i}`} y={basal + 190 + i * 64 + edema * (i - 4) * 4} amp={16} fase={i * 1.4} n={3} edema={edema} />)}
      {edema > 0.02 && Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${120 + i * 120},${f1(basal + 140 + hash(i, 1) * 300)} q30,-14 60,0 t60,0`} className={s.fibrina} opacity={edema} />)}
      <AnexosFijos />
      {/* Asas capilares de las papilas dérmicas */}
      {papilas.map(({ x, y }, i) => <g key={i}><path d={`M${x - 14},${f1(y + 130)} C${x - 16},${f1(y + 30)} ${x - 10},${f1(y - 6)} ${x},${f1(y - 6)} C${x + 10},${f1(y - 6)} ${x + 16},${f1(y + 30)} ${x + 14},${f1(y + 130)}`} className={s.asaCapilar} /><Hematie x={x - 14} y={y + 70} rot={90} k={0.42} /></g>)}
      {/* Epidermis */}
      <path d={`M-800,${f1(cornea + sube(0))} ${Array.from({ length: 33 }, (_, i) => `L${i * 50},${f1(cornea - 4 * Math.sin(i * 1.7) + sube(i * 50))}`).join(' ')} L2400,${cornea} L2400,${f1(mb(1600))} ${Array.from({ length: 33 }, (_, i) => `L${1600 - i * 50},${f1(mb(1600 - i * 50))}`).join(' ')} L-800,${f1(mb(0))} Z`} className={s.epidermis} />
      {filas}
      {Array.from({ length: 30 }, (_, i) => {
        const x = i * 56, y = mb(x) - 18;
        if (i % 6 === 3) {
          return (
            <g key={i} transform={`translate(${x},${f1(y)})`}>
              <path d="M0,-8 L-16,-46 M0,-8 L14,-50 M0,-6 L26,-24" className={s.dendritaMelano} />
              <ellipse rx={12} ry={15} className={s.melanocito} />
              <circle r={5} className={s.nucleoMelano} />
            </g>
          );
        }
        return (
          <g key={i} transform={`translate(${x},${f1(y)})`}>
            <ellipse rx={13} ry={18} className={s.basal} />
            <ellipse cy={3} rx={6} ry={8} className={s.nucleoQuera} />
            <path d="M-6,-6 Q0,-11 6,-6" className={s.melanina} />
          </g>
        );
      })}
      <path d={`M-40,${f1(mb(-40))} ${Array.from({ length: 34 }, (_, i) => `L${i * 50},${f1(mb(i * 50))}`).join(' ')}`} className={s.membranaBasal} />
      <path d={capas.join(' ')} className={s.laminillaCornea} />
      <path d={`M-800,${f1(cornea + sube(0))} ${Array.from({ length: 33 }, (_, i) => `L${i * 50},${f1(cornea - 4 * Math.sin(i * 1.7) + sube(i * 50))}`).join(' ')} L2400,${cornea}`} className={s.cornea} />
      {/* Células de Langerhans (dendríticas de la epidermis) */}
      {[300, 820, 1340].map((x, i) => <g key={i} transform={`translate(${x},${f1(cornea + 120 + sube(x))})`}>{[0, 1.2, 2.4, 3.6, 4.8].map((a, k) => <path key={k} d={`M0,0 Q${f1(Math.cos(a + 0.3) * 16)},${f1(Math.sin(a + 0.3) * 16)} ${f1(Math.cos(a) * 30)},${f1(Math.sin(a) * 30)}`} className={s.langerhans} />)}<circle r={9} className={s.langerhansCuerpo} /><ellipse rx={5} ry={3.5} className={s.nucleoLanger} /></g>)}
      {/* Espongiosis y vesículas (dermatitis de contacto) */}
      {ves > 0.02 && [[640, 0.6], [820, 1], [990, 0.7]].map(([x, k], i) => <ellipse key={i} cx={x} cy={f1(cornea + 120 + sube(x))} rx={58 * ves * k} ry={40 * ves * k} className={s.vesicula} />)}
      {/* Acantólisis suprabasal (pénfigo) */}
      {aca > 0.02 && <path d={`M470,${f1(mb(470) - 36)} C600,${f1(mb(600) - 36 - 70 * aca)} 1000,${f1(mb(1000) - 36 - 70 * aca)} 1130,${f1(mb(1130) - 36)} Z`} className={s.vesicula} />}
      {/* Vénulas de la dermis, con el manguito perivascular */}
      {venulas.map((V, j) => {
        const ry = V.ry * (1 + 0.45 * vaso);
        return (
          <g key={j}>
            {man > 0.01 && Array.from({ length: 46 }, (_, i) => {
              if (hash(i, j + 2) > man) return null;
              const a = (i / 46) * TAU + hash(i, 3);
              const k = 1.25 + hash(i, 4) * 0.8;
              return <g key={i} transform={`translate(${f1(V.cx + Math.cos(a) * V.rx * k)},${f1(V.cy + Math.sin(a) * ry * k * 1.5)})`} opacity={man}><DibujoCelula dibujo="linfocito" d={20} color={i % 3 ? '#D24E80' : '#C9875A'} /></g>;
            })}
            <Venula id={`piel${j}`} cx={V.cx} cy={V.cy} rx={V.rx} ry={ry} vaso={vaso} fuga={edema} act={act} reloj={reloj} nEndo={j ? 18 : 22} nHem={8} kHem={0.9} dilatacion={50} />
          </g>
        );
      })}
      <text x={24} y={cornea - 34} className={s.rotuloTejido}>Epidermis</text>
      <text x={250} y={basal + 80} className={s.rotuloTejido}>Dermis</text>
      <text x={venulas[0].cx} y={venulas[0].cy - venulas[0].ry - 44} textAnchor="middle" className={s.rotuloDato}>Vénula</text>
    </g>
  );
}

// ─── Granuloma ────────────────────────────────────────────────────────────────

const { cx: R_X, cy: R_Y, r: R_R } = GRANULOMA;

/** Parénquima del ganglio: cápsula y seno arriba, linfocitos (núcleo denso y halo), HEV y fibras reticulares. */
const GanglioGranulomaFijo = memo(function GanglioGranulomaFijo() {
  const libre = (x: number, y: number) => Math.hypot(x - R_X, y - R_Y) > R_R * 0.95 && y > 96;
  const linfos = sembrar(620, 180, 0, 0, 1600, 1000, libre);
  const reticular = Array.from({ length: 22 }, (_, i) => {
    const x = hash(i, 190) * 1600, y = 120 + hash(i, 191) * 880;
    return Math.hypot(x - R_X, y - R_Y) > R_R * 1.1 ? `M${f1(x)},${f1(y)} q${f1(30 + hash(i, 192) * 40)},${f1(-20)} ${f1(70 + hash(i, 193) * 50)},${f1(10 - hash(i, 194) * 30)}` : '';
  }).join(' ');
  return (
    <g>
      <path d="M-40,40 C400,58 1200,58 1640,40" className={s.capsulaNodo} />
      <path d="M-40,74 C400,92 1200,92 1640,74" className={s.senoNodo} />
      <path d={reticular} className={s.reticular} />
      <path d={nube(linfos)} className={s.linfocitoHalo} />
      <path d={nube(linfos)} className={s.linfocitoNucleo} />
      {[[220, 300], [1380, 760], [1300, 260], [260, 820]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${i * 50})`}>
          <ellipse rx={30} ry={18} className={s.hevPared} />
          <ellipse rx={13} ry={6} className={s.capilarLuz} />
          <path d={nube([[-20, 0], [20, 0], [-8, -12], [8, -12], [-8, 12], [8, 12]])} className={s.nucleoHev} />
        </g>
      ))}
    </g>
  );
});

function Granuloma({ t }: { t: T }) {
  const cx = R_X, cy = R_Y, r = R_R;
  const mac = v(t, 'macrofagos'), epi = v(t, 'epitelioides'), gig = v(t, 'gigantes'), cor = v(t, 'corona'), fib = v(t, 'fibrosis'), cas = v(t, 'caseosis');
  const corona = Array.from({ length: 150 }, (_, i) => { const a = i * 2.39996, k = r * (1.02 + hash(i, 3) * 0.42); return [cx + Math.cos(a) * k, cy + Math.sin(a) * k] as P; });
  const caseum = Array.from({ length: 25 }, (_, i) => { const a = (i / 24) * TAU; const rr = r * 0.36 * (1 + (hash(i, 40) - 0.5) * 0.18); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] as P; });
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.ganglioFondo} />
      <GanglioGranulomaFijo />
      {cor > 0.01 && <g opacity={cor}><path d={nube(corona)} className={s.linfocitoHalo} /><path d={nube(corona)} className={s.linfocitoCorona} /></g>}
      {fib > 0.01 && (
        <g opacity={fib}>
          {[1.42, 1.5, 1.58].map((k, i) => <circle key={i} cx={cx} cy={cy} r={r * k} className={s.capsulaFibrosa} strokeWidth={6 - i * 1.5} />)}
          {Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * TAU; const k = r * 1.5; return <Huso key={i} x={cx + Math.cos(a) * k} y={cy + Math.sin(a) * k} ang={gr(a) + 90} l={22} h={4} c={s.fibroblasto} n={s.nucleoFibro} />; })}
        </g>
      )}
      {/* Macrófagos que llegan y se transforman en células epitelioides */}
      {mac > 0.01 && Array.from({ length: 16 }, (_, i) => {
        const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 16) * r * 0.85;
        return (
          <g key={i} transform={`translate(${f1(cx + Math.cos(a) * k)},${f1(cy + Math.sin(a) * k)})`} opacity={mac * (1 - epi)}>
            <path d="M-22,0 C-22,-14 -10,-23 2,-22 C16,-21 23,-10 22,2 C21,15 8,23 -4,22 C-16,21 -22,12 -22,0 Z" className={s.macrofagoFondo} />
            <path d="M-12,-2 C-12,-9 -4,-11 0,-8 C4,-11 10,-8 8,0 C6,7 -10,8 -12,-2 Z" className={s.nucleoMacro} />
            <path d={nube([[10, 8], [12, -4], [4, 12]])} className={s.fagolisosoma} />
          </g>
        );
      })}
      {epi > 0.01 && Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * TAU + (i % 2) * 0.1, k = r * (0.45 + (i % 3) * 0.17);
        return <g key={i} transform={`translate(${f1(cx + Math.cos(a) * k)},${f1(cy + Math.sin(a) * k)}) rotate(${f1(gr(a) + 90)})`} opacity={epi}><DibujoCelula dibujo="epitelioide" d={62} /></g>;
      })}
      {cas > 0.01 && (
        <g opacity={cas}>
          <path d={linea(caseum) + 'Z'} className={s.caseum} />
          {Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 30) * r * 0.32; return <circle key={i} cx={f1(cx + Math.cos(a) * k)} cy={f1(cy + Math.sin(a) * k)} r={2.5} className={s.detritus} />; })}
          <path d={nube(Array.from({ length: 40 }, (_, i) => { const a = hash(i, 50) * TAU, k = Math.sqrt(hash(i, 51)) * r * 0.33; return [cx + Math.cos(a) * k, cy + Math.sin(a) * k] as P; }))} className={s.polvoNuclear} />
        </g>
      )}
      {gig > 0.01 && [[-0.2, -0.05], [0.24, 0.12]].map(([dx, dy], i) => <g key={i} transform={`translate(${f1(cx + dx * r * (1 + cas))},${f1(cy + dy * r * (1 + cas))}) scale(${f1(0.6 + 0.4 * gig)})`} opacity={gig}><DibujoCelula dibujo="gigante" d={110} /></g>)}
      <text x={cx} y={cy - r * 1.6 - 20} textAnchor="middle" className={s.rotuloTejido}>Ganglio linfático</text>
    </g>
  );
}

const FONDOS: Record<Fondo, (p: { t: T; reloj: number }) => ReactNode> = {
  blanco: () => null,
  mucosa: Mucosa,
  cuerpo: Cuerpo,
  sangre: Sangre,
  glomerulo: Glomerulo,
  placa: Placa,
  vaso: Vaso,
  piel: Piel,
  granuloma: Granuloma,
};

export const FondoDe = memo(function FondoDe({ f, t, reloj }: { f: Fondo; t: T; reloj: number }) {
  const C = FONDOS[f];
  if (f === 'blanco') return null;
  return <><DefsFondo />{C({ t, reloj })}</>;
});
