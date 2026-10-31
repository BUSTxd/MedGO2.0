'use client';
// Láminas del capítulo 7 (piel, mucosas, articulaciones):
// · `manos`: las dos manos con las articulaciones que se encienden (MCF, IFP,
//   muñecas), la radiografía comparada con la artritis reumatoide, la desviación
//   de Jaccoud que se reduce con la mano y los dedos del fenómeno de Raynaud.
// · `boca`: la boca abierta con úlceras indoloras en el paladar.
// · `torso`: el lupus cutáneo subagudo (anillos y placas psoriasiformes en
//   cuello, hombros, escote y brazos; la cara, respetada).
// · `discoide`: la placa discoide, la alopecia cicatricial y la banda lúpica.

import { memo } from 'react';
import { clamp, easeBack, easeInOut, easeOut, tramo, v, type T } from './laminas';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

function Chip({ x, y, w, txt, k, clase = s.chip }: { x: number; y: number; w: number; txt: string; k: number; clase?: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(clamp(k))})`}>
      <rect x={-w / 2} y={-28} width={w} height={56} rx={28} className={clase} />
      <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>{txt}</text>
    </g>
  );
}

// ─── Manos ────────────────────────────────────────────────────────────────────

/** Dedos de una mano derecha vista por el dorso: [x base, largo, ángulo]. */
const DEDOS: [number, number, number][] = [[-78, 150, -8], [-30, 190, -2], [16, 205, 2], [60, 185, 6], [104, 120, 38]];

/** Dedo que se afina hacia la yema, con la uña y los pliegues de los nudillos. */
function Dedo({ l, pulgar }: { l: number; pulgar: boolean }) {
  const w0 = pulgar ? 22 : 20, w1 = pulgar ? 17 : 15;
  return (
    <g>
      {/* El contorno queda abierto por abajo: el dedo nace del dorso, sin un corte recto. */}
      <path d={`M${-w0},24 C${-w0},${-l * 0.4} ${-w1 - 1},${-l * 0.7} ${-w1},${-l + 18} C${-w1},${-l - 2} ${w1},${-l - 2} ${w1},${-l + 18} C${w1 + 1},${-l * 0.7} ${w0},${-l * 0.4} ${w0},24 C${w0},46 ${-w0},46 ${-w0},24 Z`} fill="url(#lp-mano)" />
      <path d={`M${-w0},2 C${-w0},${-l * 0.4} ${-w1 - 1},${-l * 0.7} ${-w1},${-l + 18} C${-w1},${-l - 2} ${w1},${-l - 2} ${w1},${-l + 18} C${w1 + 1},${-l * 0.7} ${w0},${-l * 0.4} ${w0},2`} fill="none" className={s.manoTrazo} />
      {/* Uña */}
      <path d={`M${-w1 + 4},${-l + 26} C${-w1 + 3},${-l + 6} ${w1 - 3},${-l + 6} ${w1 - 4},${-l + 26} C${w1 - 8},${-l + 30} ${-w1 + 8},${-l + 30} ${-w1 + 4},${-l + 26} Z`} className={s.manoUna} />
      {/* Pliegues */}
      {(pulgar ? [0.45] : [0.42, 0.68]).map((f) => (
        <g key={f} className={s.manoPliegue}>
          <path d={`M-11,${-l * f - 4} Q0,${-l * f - 8} 11,${-l * f - 4}`} />
          <path d={`M-10,${-l * f + 3} Q0,${-l * f} 10,${-l * f + 3}`} />
        </g>
      ))}
    </g>
  );
}

const MANO_DORSO = 'M-98,6 C-104,60 -96,120 -66,176 C-60,196 -62,224 -66,300 L74,300 C70,224 68,196 74,176 C94,140 126,120 132,84 C130,62 116,42 108,10 C70,-16 -60,-16 -98,6 Z';

function Mano({ cx, cy, espejo, artic, desvio }: { cx: number; cy: number; espejo: boolean; artic: number; desvio: number }) {
  const sx = espejo ? -1 : 1;
  const inflama = artic > 0.05 ? { stroke: '#E5484D' } : undefined;
  return (
    <g transform={`translate(${cx},${cy}) scale(${sx},1)`}>
      <defs>
        <linearGradient id="lp-mano" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" className={s.manoStop1} /><stop offset="0.5" className={s.manoStop2} /><stop offset="1" className={s.manoStop3} />
        </linearGradient>
      </defs>
      {/* Dorso y muñeca, con los tendones extensores */}
      <path d={MANO_DORSO} fill="url(#lp-mano)" className={s.manoTrazo} />
      <g className={s.manoPliegue}>
        <path d="M-74,12 C-60,70 -30,130 -6,178 M-28,6 C-20,70 -12,130 -2,178 M16,6 C14,70 8,130 2,178 M60,8 C50,70 28,130 8,178" opacity={0.55} />
        <path d="M-60,212 Q6,222 72,212 M-60,226 Q6,236 72,226" opacity={0.6} />
      </g>
      {DEDOS.map(([x, l, a], i) => {
        const pulgar = i === 4;
        const giro = a + (pulgar ? 0 : desvio * 22);
        return (
          <g key={i} transform={`translate(${x},${pulgar ? 60 : 0}) rotate(${giro})`}>
            <Dedo l={l} pulgar={pulgar} />
            {[0, pulgar ? 0.45 : 0.42].map((f, j) => (
              <circle key={j} cy={-l * f} r={16} className={s.articulacion} opacity={0.2 + 0.8 * artic} style={inflama} />
            ))}
          </g>
        );
      })}
      <ellipse cx={4} cy={218} rx={70} ry={20} className={s.articulacion} opacity={0.2 + 0.8 * artic} style={inflama} />
    </g>
  );
}

function Radiografia({ x, y, erosiva, titulo, sub }: { x: number; y: number; erosiva: boolean; titulo: string; sub: string }) {
  const hueso = (dy: number, flip: boolean) => (
    <path d={flip
      ? `M-26,${dy} L-26,${dy - 70} Q-34,${dy - 96} 0,${dy - 100} Q34,${dy - 96} 26,${dy - 70} L26,${dy} Z`
      : `M-26,${dy} L-26,${dy + 70} Q-34,${dy + 96} 0,${dy + 100} Q34,${dy + 96} 26,${dy + 70} L26,${dy} Z`} className={s.hueso} />
  );
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-130} y={-150} width={260} height={300} rx={18} className={s.placaRx} />
      <g transform={`translate(0,${erosiva ? 6 : 0})`}>{hueso(-120, false)}</g>
      {hueso(130, true)}
      {erosiva && [[-22, -16], [20, -20], [-22, 26], [22, 20]].map(([ex, ey], i) => <circle key={i} cx={ex} cy={ey} r={13} className={s.erosion} />)}
      <text y={190} textAnchor="middle" className={s.lEtiqueta}>{titulo}</text>
      <text y={220} textAnchor="middle" className={erosiva ? s.lEtiquetaRoja : s.lEtiquetaVerde}>{sub}</text>
    </g>
  );
}

export function FondoManos({ t }: { t: T }) {
  const ma = v(t, 'mano'), ar = v(t, 'artic'), pe = v(t, 'perla'), co = v(t, 'comparar'), ja = v(t, 'jaccoud'), re = v(t, 'reduce'), rx = v(t, 'rx'), ry = v(t, 'raynaud');
  const desvio = easeInOut(ja) * (1 - easeInOut(re));
  return (
    <g>
      {ma > 0.001 && (
        <g opacity={ma}>
          <Mano cx={300} cy={420} espejo={false} artic={ar} desvio={desvio} />
          <Mano cx={720} cy={420} espejo artic={ar} desvio={0} />
          {ar > 0.3 && (
            <g opacity={tramo(ar, 0.3, 1)}>
              <text x={510} y={140} textAnchor="middle" className={s.lEtiqueta}>MCF · IFP · muñecas (y rodillas)</text>
              <text x={510} y={170} textAnchor="middle" className={s.lSub}>simétrica y distal</text>
            </g>
          )}
          {ja > 0.3 && (
            <g opacity={tramo(ja, 0.3, 0.7)}>
              <text x={300} y={830} textAnchor="middle" className={s.lEtiqueta}>{re > 0.5 ? 'se reduce con la mano' : 'artropatía de Jaccoud'}</text>
              <text x={300} y={860} textAnchor="middle" className={s.lSub}>{re > 0.5 ? 'tendones y ligamentos, no hueso' : 'dedos desviados'}</text>
            </g>
          )}
        </g>
      )}
      <Chip x={1290} y={140} w={340} txt="La perla" k={pe} clase={s.chipPista} />
      {co > 0.001 && (
        <g opacity={co}>
          <Radiografia x={1140} y={420} erosiva titulo="Artritis reumatoide" sub="erosiva" />
          <Radiografia x={1440} y={420} erosiva={false} titulo="Lupus" sub="no erosiva" />
        </g>
      )}
      <Chip x={1290} y={760} w={540} txt="En la radiografía no verás erosiones" k={rx} clase={s.chipVerde} />
      {ry > 0.001 && (
        <g transform="translate(1180,520)">
          {[0, 1, 2].map((j) => {
            const fase = clamp(ry * 3 - j);
            const col = ['#F4F1EC', '#6E8FD6', '#E0526E'][j];
            return (
              <g key={j} transform={`translate(${(j - 1) * 150},0)`} opacity={0.25 + 0.75 * fase}>
                <path d="M-34,70 C-34,-40 -30,-120 -28,-160 C-26,-200 26,-200 28,-160 C30,-120 34,-40 34,70 Z" className={s.piel7} />
                <path d="M-31,-60 C-30,-100 -29,-130 -28,-160 C-26,-200 26,-200 28,-160 C29,-130 30,-100 31,-60 Q0,-48 -31,-60 Z" fill={col} opacity={fase} />
                <path d="M-18,-152 C-18,-180 18,-180 18,-152 C14,-146 -14,-146 -18,-152 Z" className={s.manoUna} />
                <path d="M-20,-90 Q0,-94 20,-90 M-22,-20 Q0,-24 22,-20" className={s.icoLinea} opacity={0.4} />
                <text y={110} textAnchor="middle" className={s.lEtiqueta}>{['blanco', 'azul', 'rojo'][j]}</text>
              </g>
            );
          })}
          <text y={160} textAnchor="middle" className={s.lSub}>con el frío</text>
        </g>
      )}
    </g>
  );
}

// ─── Boca ─────────────────────────────────────────────────────────────────────

const BocaFija = memo(function BocaFija() {
  return (
    <g>
      <path d="M140,500 C180,250 840,250 880,500 C840,780 180,780 140,500 Z" className={s.labio} />
      <path d="M190,500 C230,300 790,300 830,500 C790,720 230,720 190,500 Z" className={s.bocaInterior} />
      <path d="M240,470 C300,320 720,320 780,470 C690,440 330,440 240,470 Z" className={s.paladar} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={270 + i * 49} y={430 + Math.abs(i - 4.5) * 4} width={44} height={46} rx={10} className={s.diente} />)}
      <path d="M330,640 C420,590 600,590 690,640 C620,700 400,700 330,640 Z" className={s.lengua} />
      <text x={510} y={250} textAnchor="middle" className={s.lEtiquetaMayus}>Paladar duro</text>
    </g>
  );
});

export function FondoBoca({ t }: { t: T }) {
  const bo = v(t, 'boca'), ul = v(t, 'ulceras'), mi = v(t, 'mira');
  return (
    <g opacity={bo}>
      <BocaFija />
      {[[420, 380, 18], [560, 360, 14], [640, 400, 11]].map(([x, y, r], i) => {
        const k = easeOut(tramo(ul, i * 0.2, 0.6 + i * 0.2));
        return k > 0 ? <g key={i}><circle cx={x} cy={y} r={r * 1.8 * k} className={s.halo7} /><circle cx={x} cy={y} r={r * k} className={s.ulcera} /></g> : null;
      })}
      {mi > 0.001 && <circle cx={520} cy={385} r={150 + 10 * mi} className={s.linterna} opacity={mi} />}
    </g>
  );
}

// ─── Torso (lupus cutáneo subagudo) ───────────────────────────────────────────

/** Cuello, hombros y escote: la zona fotoexpuesta. La cara, igual que en el resto del lab. */
const TorsoFijo = memo(function TorsoFijo() {
  return (
    <g>
      <defs>
        <linearGradient id="lp-torso" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#E0AE8E" /><stop offset="0.4" stopColor="#EFCBB0" /><stop offset="0.75" stopColor="#E3B497" /><stop offset="1" stopColor="#C48D70" />
        </linearGradient>
        <linearGradient id="lp-bata" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="920" y2="1000">
          <stop offset="0" stopColor="#C5D2DC" /><stop offset="1" stopColor="#8FA3B3" />
        </linearGradient>
      </defs>
      <path d="M478,600 C472,640 430,660 350,680 C250,704 176,746 150,824 C132,880 108,950 90,1000 L950,1000 C932,950 908,880 890,824 C864,746 790,704 690,680 C610,660 568,640 562,600 Z" fill="url(#lp-torso)" />
      {/* Clavículas, hueco supraesternal y el pliegue de la axila */}
      <path d="M498,716 C450,694 370,690 290,716 M542,716 C590,694 670,690 750,716" className={s.torsoRelieve} />
      <path d="M204,840 C214,890 222,950 224,1000 M836,840 C826,890 818,950 816,1000" className={s.torsoRelieve} />
      <ellipse cx={520} cy={724} rx={18} ry={14} fill="#A9745A" opacity={0.28} />
      {/* Bata bajada hasta el pecho */}
      <path d="M224,936 C350,952 690,952 816,936 L836,1000 L204,1000 Z" fill="url(#lp-bata)" />
      <g transform="translate(520,119) scale(0.62)"><Retrato id="torso" peinado="recogido" soloCabeza /></g>
    </g>
  );
});
const ANILLOS: [number, number, number][] = [[470, 640, 22], [600, 700, 26], [300, 760, 30], [750, 780, 28], [420, 860, 34], [640, 880, 30], [210, 880, 26], [840, 900, 24], [530, 960, 28]];

export function FondoTorso({ t }: { t: T }) {
  const to = v(t, 'torso'), so = v(t, 'sol'), an = v(t, 'anillos'), ps = v(t, 'psoriasis'), ca = v(t, 'cara');
  return (
    <g>
      {to > 0.001 && <g opacity={to}><TorsoFijo /></g>}
      {so > 0.001 && (
        <g opacity={so} transform="translate(900,200)">
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 54} y1={Math.sin(a) * 54} x2={Math.cos(a) * 76} y2={Math.sin(a) * 76} className={s.rayoSol} />; })}
          <circle r={44} className={s.sol} />
        </g>
      )}
      {ANILLOS.map(([x, y, r], i) => {
        const k = easeOut(tramo(an, i * 0.08, 0.4 + i * 0.08));
        return k > 0 ? <circle key={i} cx={x} cy={y} r={r * (0.6 + 0.4 * k)} className={s.anillo} opacity={k} /> : null;
      })}
      {[[350, 690], [700, 950], [860, 840]].map(([x, y], i) => {
        const k = tramo(ps, i * 0.2, 0.6 + i * 0.2);
        return k > 0 ? <ellipse key={i} cx={x} cy={y} rx={40} ry={26} className={s.placaPsor} opacity={k} /> : null;
      })}
      {ca > 0.001 && (
        <g opacity={ca}>
          <ellipse cx={520} cy={405} rx={138} ry={190} className={s.caraLibre} />
          <text x={520} y={190} textAnchor="middle" className={s.lEtiquetaVerde}>la cara, respetada</text>
        </g>
      )}
    </g>
  );
}

// ─── Discoide y banda lúpica ──────────────────────────────────────────────────

export function FondoDiscoide({ t }: { t: T }) {
  const pl = v(t, 'placa'), ci = v(t, 'cicatriz'), al = v(t, 'alopecia'), ba = v(t, 'banda');
  return (
    <g>
      {pl > 0.001 && (
        <g opacity={pl} transform={`translate(380,360) scale(${0.85 + 0.15 * easeBack(pl)})`}>
          <circle r={230} className={s.piel7} />
          <circle r={150} className={s.bordePigmento} opacity={ci} />
          <circle r={135} className={s.placaDisco} />
          <circle r={90 * ci} className={s.atrofia} />
          {Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 30) * 120; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={4} className={s.tapon} />; })}
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 60},${Math.sin(a) * 60} l${Math.cos(a + 1) * 30},${Math.sin(a + 1) * 30}`} className={s.escamaDisco} />; })}
          <text y={280} textAnchor="middle" className={s.lEtiqueta}>Placa discoide</text>
        </g>
      )}
      {al > 0.001 && (
        <g opacity={al} transform="translate(380,830)">
          <ellipse rx={260} ry={90} className={s.pielCuero} />
          {Array.from({ length: 70 }, (_, i) => {
            const x = -240 + hash(i, 1) * 480, y = -70 + hash(i, 2) * 140;
            if (Math.hypot(x / 1.6, y) < 62) return null;
            return <line key={i} x1={x} y1={y} x2={x + 6} y2={y - 22} className={s.cabello} />;
          })}
          <ellipse rx={100} ry={56} className={s.atrofia} />
          <text y={130} textAnchor="middle" className={s.lSub}>alopecia cicatricial: permanente</text>
        </g>
      )}
      {ba > 0.001 && (
        <g opacity={ba} transform="translate(1290,790)">
          <rect x={-270} y={-120} width={540} height={220} rx={18} className={s.panelIf} />
          <path d={`M-250,0 ${Array.from({ length: 10 }, (_, i) => `Q${-225 + i * 50},${i % 2 ? 30 : -30} ${-200 + i * 50},0`).join(' ')}`} className={s.bandaIf} />
          <text x={-250} y={-70} className={s.etiquetaIf}>epidermis</text>
          <text x={-250} y={80} className={s.etiquetaIf}>dermis</text>
          <text y={150} textAnchor="middle" className={s.lEtiqueta}>Banda lúpica: IgG, IgM y C3</text>
          <text y={178} textAnchor="middle" className={s.lSub}>en la unión dermoepidérmica</text>
        </g>
      )}
    </g>
  );
}
