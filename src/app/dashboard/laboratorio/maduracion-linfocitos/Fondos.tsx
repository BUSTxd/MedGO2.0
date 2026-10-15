'use client';
// Fondos del laboratorio «Maduración de linfocitos»: cada órgano como en un
// corte histológico, sobre blanco y en la periferia o como textura tenue, para
// que los actores sigan mandando. Van memoizados (`FondoDe`): llevan cientos de
// células de textura y la escena se redibuja en cada fotograma.
//   · médula ósea: hueso trabecular, endostio, sinusoide, adipocitos en racimo,
//     isla eritroblástica, megacariocito;
//   · timo: cápsula con fibroblastos, tabique, corteza densa de timocitos,
//     médula clara, vénula con eritrocitos y corpúsculo de Hassall laminado;
//   · ganglio: cápsula y seno subcapsular, zona del manto densa, centro
//     germinal con zona oscura apretada y zona clara laxa con su red de FDC,
//     paracorteza con linfocitos T y vénula de endotelio alto.

import { memo } from 'react';
import type { Fondo } from '@/lib/data/linfocitos/tipos';
import { ANCHO, ALTO, CELDA } from '@/lib/linfocitos/motor';
import s from '@/styles/linfocitos.module.css';

const g = (v: number) => v * CELDA;

/** Puntos deterministas dentro de una región (sin azar: no parpadean). */
function sembrar(n: number, dentro: (x: number, y: number) => boolean, x0: number, x1: number, y0: number, y1: number, semilla = 1): [number, number][] {
  const out: [number, number][] = [];
  let k = semilla;
  for (let i = 0; out.length < n && i < n * 30; i++) {
    k = (k * 9301 + 49297) % 233280;
    const x = x0 + (k / 233280) * (x1 - x0);
    k = (k * 9301 + 49297) % 233280;
    const y = y0 + (k / 233280) * (y1 - y0);
    if (dentro(x, y)) out.push([x, y]);
  }
  return out;
}

const linea = (f: (x: number) => number, x0: number, n: number, paso = 50) =>
  Array.from({ length: n }, (_, i) => { const x = x0 + i * paso; return `${i ? 'L' : 'M'}${x},${f(x).toFixed(1)}`; }).join(' ');

function Eritrocito({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <ellipse rx={20} ry={12.5} className={s.eritro} />
      <ellipse rx={9} ry={4.5} className={s.eritroCentro} />
    </g>
  );
}

// ─── Médula ósea ──────────────────────────────────────────────────────────────

/** Racimo de adipocitos: gotas de lípido que se aplastan entre sí, un anillo
 *  fino de citoplasma y el núcleo en «anillo de sello» contra la membrana. */
function Adipocitos({ x, y, r }: { x: number; y: number; r: number }) {
  const celdas: [number, number, number, number][] = [[0, 0, r, 2.4], [r * 1.55, r * 0.35, r * 0.82, 3.6], [r * 0.45, r * 1.5, r * 0.78, 1.2]];
  return (
    <g transform={`translate(${x},${y})`}>
      {celdas.map(([cx, cy, rr, ang], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={rr} className={s.adipoBorde} />
          <circle cx={cx} cy={cy} r={rr - 4} fill="url(#lf-lipido)" />
          <ellipse cx={cx - rr * 0.32} cy={cy - rr * 0.38} rx={rr * 0.22} ry={rr * 0.12} fill="#fff" opacity={0.75} />
          {/* Núcleo aplastado contra el borde (anillo de sello) */}
          <path
            d={`M${-rr * 0.5},0 Q0,${rr * 0.22} ${rr * 0.5},0 Q0,${rr * 0.08} ${-rr * 0.5},0 Z`}
            transform={`translate(${cx + Math.cos(ang) * (rr - 6)},${cy + Math.sin(ang) * (rr - 6)}) rotate(${(ang * 180) / Math.PI - 90})`}
            className={s.adipoNucleo}
          />
        </g>
      ))}
      {/* Capilar entre los adipocitos */}
      <path d={`M${r * 0.95},${r * 0.95} q${r * 0.2},${r * 0.1} ${r * 0.35},${r * 0.35}`} className={s.vaso} strokeWidth={2} />
      <ellipse cx={r * 1.12} cy={r * 1.12} rx={5} ry={3.2} className={s.eritro} />
    </g>
  );
}

function FondoMedula() {
  const borde = (x: number) => 112 + 12 * Math.sin(x / 130) + 7 * Math.sin(x / 47 + 1.3);
  const filo = linea(borde, -40, 35);
  const yArriba = (x: number) => 858 + 9 * Math.sin(x / 160);
  const yAbajo = (x: number) => 946 + 9 * Math.sin(x / 160 + 1);
  const paredArriba = linea(yArriba, 300, 28);
  const paredAbajo = linea(yAbajo, 300, 28);
  const vuelta = Array.from({ length: 28 }, (_, i) => { const x = 300 + (27 - i) * 50; return `L${x},${yAbajo(x).toFixed(1)}`; }).join(' ');
  const luz = `${paredArriba} ${vuelta} Q262,902 300,${yArriba(300).toFixed(1)} Z`;
  const osteocitos = [70, 190, 330, 460, 610, 740, 880, 1010, 1150, 1290, 1420, 1550];
  const revestimiento = Array.from({ length: 15 }, (_, i) => 40 + i * 108);
  const eritros = [380, 520, 640, 790, 930, 1070, 1200, 1330, 1560];
  const isla: [number, number][] = Array.from({ length: 8 }, (_, i) => [Math.cos((i / 8) * Math.PI * 2) * 42, Math.sin((i / 8) * Math.PI * 2) * 34]);
  const Laguna = ({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) => (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {[0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2; return <line key={k} x1={Math.cos(a) * 9} y1={Math.sin(a) * 5} x2={Math.cos(a) * 19} y2={Math.sin(a) * 11} className={s.canaliculo} />; })}
      <ellipse rx={10} ry={5} className={s.laguna} />
      <ellipse rx={5} ry={2.6} className={s.osteocito} />
    </g>
  );
  return (
    <g className={s.fondoTrazo}>
      <path d={`${filo} L1640,-40 L-40,-40 Z`} className={s.huesoMatriz} />
      {[22, 44, 66].map((dy) => <path key={dy} d={linea((x) => borde(x) - dy, -40, 35)} className={s.huesoLinea} />)}
      {osteocitos.map((x, i) => <Laguna key={x} x={x} y={borde(x) - 34 - (i % 3) * 18} rot={(i * 17) % 30 - 15} />)}
      <path d={filo} className={s.endostio} />
      {revestimiento.map((x) => (
        <g key={x} transform={`translate(${x},${(borde(x) + 4).toFixed(1)})`}>
          <ellipse rx={20} ry={4.5} className={s.revestimiento} />
          <ellipse rx={6} ry={2.2} className={s.osteocito} />
        </g>
      ))}
      <path d="M-40,760 C40,742 140,770 210,812 C262,844 268,900 236,960 C214,1000 120,1040 -40,1040 Z" className={s.huesoMatriz} />
      <path d="M-40,760 C40,742 140,770 210,812 C262,844 268,900 236,960 C214,1000 120,1040 -40,1040" className={s.endostio} />
      <path d="M-40,790 C40,776 120,798 180,834 C222,860 228,904 204,950" className={s.huesoLinea} />
      <Laguna x={70} y={850} rot={10} />
      <Laguna x={150} y={900} rot={-20} />
      <Laguna x={60} y={950} rot={5} />
      <path d={luz} className={s.luz} />
      <path d={paredArriba} className={s.vaso} />
      <path d={paredAbajo} className={s.vaso} />
      <path d={`M300,${yArriba(300).toFixed(1)} Q262,902 300,${yAbajo(300).toFixed(1)}`} className={s.vaso} />
      {Array.from({ length: 9 }, (_, i) => 360 + i * 145).map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={yArriba(x) + 3} rx={15} ry={3.4} className={s.endotelio} />
          <ellipse cx={x + 70} cy={yAbajo(x + 70) - 3} rx={15} ry={3.4} className={s.endotelio} />
        </g>
      ))}
      {eritros.map((x, i) => <Eritrocito key={x} x={x} y={902 + ((i * 13) % 20) - 10} rot={(i * 29) % 50 - 25} />)}
      <g transform="translate(1440,752)">
        <path d="M-6,52 C-12,72 6,86 -2,104 M10,50 C18,70 8,88 16,108" className={s.proplaqueta} />
        {[[-2, 104], [16, 108], [-8, 82], [12, 84], [36, 120], [-24, 126]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} className={s.plaqueta} />)}
        <circle r={62} className={s.megaCito} />
        {puntos(16, 54).map(([x, y], i) => <circle key={`gr${i}`} cx={x} cy={y} r={2} className={s.plaqueta} />)}
        {[[-18, -10, 22], [10, -16, 20], [16, 10, 21], [-10, 16, 19], [-2, -1, 16]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} className={s.megaNucleo} />)}
      </g>
      <text x={1440} y={672} textAnchor="middle" className={s.zonaMini}>megacariocito</text>
      <Adipocitos x={70} y={226} r={46} />
      <Adipocitos x={1490} y={214} r={44} />
      <Adipocitos x={40} y={600} r={38} />
      <text x={110} y={364} textAnchor="middle" className={s.zonaMini}>adipocitos</text>
      <g transform="translate(300,712)">
        <path d="M-26,-6 C-24,-24 4,-30 20,-18 C34,-6 28,18 10,24 C-8,30 -30,16 -26,-6 Z" className={s.macroIsla} />
        <ellipse cx={-2} cy={-2} rx={9} ry={7} className={s.macroNucleo} />
        {isla.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r={11} className={s.eritroblasto} />
            {i % 3 !== 2 && <circle r={5} className={s.eritroblastoNucleo} />}
          </g>
        ))}
      </g>
      <text x={300} y={784} textAnchor="middle" className={s.zonaMini}>isla eritroblástica</text>
    </g>
  );
}

function puntos(n: number, r: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n, a = i * 2.39996; return [Math.cos(a) * r * Math.sqrt(t) * 0.8, Math.sin(a) * r * Math.sqrt(t) * 0.8]; });
}

// ─── Timo ─────────────────────────────────────────────────────────────────────

const limiteCM = (y: number) => 1000 + 40 * Math.sin(y / 140) - 25 * Math.sin(y / 61);

function FondoTimo() {
  const capsula = (x: number) => 52 + 8 * Math.sin(x / 210) + 4 * Math.sin(x / 73);
  const corteza = sembrar(300, (x, y) => x < limiteCM(y) - 16 && y > capsula(x) + 12 && y < ALTO - 20, 0, 1050, 60, 1000, 3);
  const medula = sembrar(70, (x, y) => x > limiteCM(y) + 16 && y > capsula(x) + 12 && Math.hypot(x - 1460, y - 820) > 70, 980, 1600, 60, 1000, 7);
  return (
    <g className={s.fondoTrazo}>
      {/* Cápsula de tejido conectivo con fibroblastos y colágeno */}
      <path d={`${linea(capsula, -40, 35)} L1640,-40 L-40,-40 Z`} className={s.capsulaFill} />
      {[14, 28, 40].map((dy) => <path key={dy} d={linea((x) => capsula(x) - dy, -40, 35)} className={s.colageno} />)}
      {Array.from({ length: 14 }, (_, i) => 60 + i * 115).map((x, i) => <ellipse key={x} cx={x} cy={capsula(x) - 22 - (i % 2) * 10} rx={16} ry={3.4} className={s.fibroblasto} />)}
      <path d={linea(capsula, -40, 35)} className={s.capsula} />
      {/* Tabique que baja de la cápsula entre corteza y médula */}
      <path d={`M${limiteCM(60) - 18},${capsula(1000)} C${limiteCM(150) - 6},170 ${limiteCM(240) - 4},230 ${limiteCM(300)},300 C${limiteCM(240) + 4},230 ${limiteCM(150) + 6},170 ${limiteCM(60) + 18},${capsula(1000)} Z`} className={s.capsulaFill} />
      {/* Corteza: timocitos apretados (la zona se ve oscura en el corte) */}
      {corteza.map(([x, y], i) => (
        <g key={i} opacity={0.55}>
          <circle cx={x} cy={y} r={6.5} className={s.timocitoT} />
          <circle cx={x + 0.5} cy={y} r={4.6} className={s.timocitoN} />
        </g>
      ))}
      {/* Médula: más clara, menos timocitos */}
      {medula.map(([x, y], i) => (
        <g key={i} opacity={0.45}>
          <circle cx={x} cy={y} r={7} className={s.timocitoT} />
          <circle cx={x + 0.5} cy={y} r={4.4} className={s.timocitoN} />
        </g>
      ))}
      <path d={linea((y) => limiteCM(y), 60, 20).replace(/(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (_, a, b) => `${b},${a}`)} className={s.limite} />
      {/* Vénula de la unión corticomedular, por donde entran los progenitores */}
      <ellipse cx={800} cy={962} rx={118} ry={40} className={s.luz} />
      <ellipse cx={800} cy={962} rx={118} ry={40} className={s.vaso} />
      {[-70, -35, 0, 35, 70].map((dx, i) => <ellipse key={dx} cx={800 + dx * 1.3} cy={962 + (i % 2 ? -36 : 36) * 0.98} rx={12} ry={3} className={s.endotelio} />)}
      {[[-55, 8], [-15, -6], [25, 6], [62, -4]].map(([dx, dy], i) => <Eritrocito key={i} x={800 + dx} y={962 + dy} rot={(i * 37) % 60 - 30} />)}
      {/* Corpúsculo de Hassall: capas concéntricas de epitelio aplanado y centro queratinizado */}
      <g transform="translate(1460,820)">
        <circle r={46} className={s.hassallFondo} />
        {[44, 36, 28].map((r) => <circle key={r} r={r} className={s.hassall} />)}
        {[40, 32].map((r, k) => Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + k * 0.4; return <path key={`${r}-${i}`} d={`M${Math.cos(a) * r},${Math.sin(a) * r} a${r},${r} 0 0 1 ${Math.cos(a + 0.35) * r - Math.cos(a) * r},${Math.sin(a + 0.35) * r - Math.sin(a) * r}`} fill="none" className={s.hassallNucleo} />; }))}
        <circle r={20} className={s.hassallCentro} />
        {[12, 6].map((r) => <circle key={r} r={r} fill="none" className={s.hassall} />)}
      </g>
      <text x={1460} y={890} textAnchor="middle" className={s.zonaMini}>corpúsculo de Hassall</text>
      <text x={800} y={918} textAnchor="middle" className={s.zonaMini}>vénula</text>
    </g>
  );
}

// ─── Ganglio linfático ────────────────────────────────────────────────────────

const CX = 650, CY = 520;
const enElipse = (x: number, y: number, rx: number, ry: number) => ((x - CX) / rx) ** 2 + ((y - CY) / ry) ** 2 <= 1;

function FondoGanglio() {
  const manto = sembrar(300, (x, y) => enElipse(x, y, 592, 422) && !enElipse(x, y, 490, 340), 40, 1260, 80, 960, 11);
  const oscura = sembrar(150, (x, y) => enElipse(x, y, 470, 320) && x < 640 + (y - CY) * 0.05, 160, 660, 190, 850, 13);
  const clara = sembrar(70, (x, y) => enElipse(x, y, 470, 320) && x > 668 + (y - CY) * 0.05, 660, 1140, 190, 850, 17);
  const zonaT = sembrar(90, (x, y) => x > 1310 + 20 * Math.sin(y / 120) && y > 60 && Math.hypot(x - 1440, y - 820) > 70, 1290, 1600, 60, 1000, 19);
  const fdcRed = [[730, 360, 860, 300], [760, 420, 900, 470], [820, 560, 960, 520], [780, 640, 900, 720], [880, 380, 1000, 430], [960, 600, 1060, 650]];
  return (
    <g className={s.fondoTrazo}>
      {/* Cápsula y seno subcapsular (por donde llega la linfa aferente) */}
      <path d={`${linea((x) => 34 + 5 * Math.sin(x / 190), -40, 35)} L1640,-40 L-40,-40 Z`} className={s.capsulaFill} />
      <path d={linea((x) => 34 + 5 * Math.sin(x / 190), -40, 35)} className={s.capsula} />
      <path d={linea((x) => 64 + 5 * Math.sin(x / 190), -40, 35)} className={s.seno} />
      {[260, 640, 1020, 1400].map((x) => <path key={x} d={`M${x - 40},50 l60,0 m-10,-6 l10,6 l-10,6`} className={s.flujo} />)}
      {/* Zona del manto: linfocitos pequeños muy apretados */}
      <ellipse cx={CX} cy={CY} rx={600} ry={430} className={s.manto} />
      {manto.map(([x, y], i) => (
        <g key={i} opacity={0.6}>
          <circle cx={x} cy={y} r={6} className={s.lnfB} />
          <circle cx={x + 0.4} cy={y} r={4.4} className={s.lnfBN} />
        </g>
      ))}
      <ellipse cx={CX} cy={CY} rx={480} ry={330} className={s.cg} />
      {/* Zona oscura: centroblastos grandes y juntos */}
      {oscura.map(([x, y], i) => (
        <g key={i} opacity={0.55}>
          <circle cx={x} cy={y} r={9} className={s.cbFondo} />
          <circle cx={x} cy={y} r={6.6} className={s.cbFondoN} />
          <circle cx={x - 2.5} cy={y - 2} r={1.6} className={s.cbFondoNucleolo} />
        </g>
      ))}
      {/* Zona clara: centrocitos más sueltos sobre la red de FDC */}
      {fdcRed.map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2 + 20},${(y1 + y2) / 2 - 25} ${x2},${y2}`} className={s.redFdc} />)}
      {clara.map(([x, y], i) => (
        <g key={i} opacity={0.5}>
          <circle cx={x} cy={y} r={7.5} className={s.ccFondo} />
          <path d={`M${x - 4.5},${y} C${x - 4.5},${y - 5} ${x + 4},${y - 5} ${x + 4.5},${y - 0.5} L${x + 1},${y + 0.4} L${x + 4.2},${y + 1.4} C${x + 3.5},${y + 5} ${x - 4.5},${y + 5} ${x - 4.5},${y} Z`} className={s.ccFondoN} />
        </g>
      ))}
      <path d="M650,190 C620,350 680,690 650,850" className={s.limite} />
      {/* Paracorteza: linfocitos T y la vénula de endotelio alto */}
      <path d="M1290,0 C1250,300 1320,600 1260,1000" className={s.limite} />
      {zonaT.map(([x, y], i) => (
        <g key={i} opacity={0.5}>
          <circle cx={x} cy={y} r={6} className={s.lnfT} />
          <circle cx={x + 0.4} cy={y} r={4.3} className={s.lnfTN} />
        </g>
      ))}
      <g transform="translate(1440,820)">
        <ellipse rx={64} ry={38} className={s.luz} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <g key={i} transform={`translate(${Math.cos(a) * 56},${Math.sin(a) * 31}) rotate(${(a * 180) / Math.PI + 90})`}>
              <rect x={-7} y={-8} width={14} height={14} rx={4} className={s.hevCelula} />
              <circle r={3.4} cy={-1} className={s.hevNucleo} />
            </g>
          );
        })}
        <Eritrocito x={-14} y={2} rot={20} />
        {/* Un linfocito cruzando la pared */}
        <g transform="translate(46,-26)"><circle r={9} className={s.lnfT} /><circle r={6.5} className={s.lnfTN} /></g>
      </g>
      <text x={1440} y={890} textAnchor="middle" className={s.zonaMini}>vénula de endotelio alto</text>
    </g>
  );
}

// ─── Mapa de neoplasias ───────────────────────────────────────────────────────

function FondoMapa() {
  const cortes = [2.2, 4.4, 8.8];
  return (
    <g className={s.fondoTrazo}>
      {cortes.map((x) => <line key={x} x1={g(x)} y1={40} x2={g(x)} y2={g(6.1)} className={s.limite} />)}
      <line x1={30} y1={g(6.35)} x2={ANCHO - 30} y2={g(6.35)} className={s.limite} />
      <path d={`M40,${g(2.3)} L${ANCHO - 40},${g(2.3)}`} className={s.lineaRuta} />
      <path d={`M40,${g(7.9)} L${g(9)},${g(7.9)}`} className={s.lineaRuta} />
    </g>
  );
}

export const FondoDe = memo(function FondoDe({ f }: { f: Fondo }) {
  switch (f) {
    case 'medula': return <FondoMedula />;
    case 'timo': return <FondoTimo />;
    case 'ganglio': return <FondoGanglio />;
    case 'mapa': return <FondoMapa />;
    case 'ruta': return null;
  }
});
