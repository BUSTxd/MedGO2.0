'use client';
// Procesos de la «lupa» del laboratorio «Hipersensibilidad». Cada uno es un
// dibujo en coordenadas locales (LUPA_W × LUPA_H) que depende solo de su
// progreso `p` (0–1), así que retroceder o saltar lo deja en el fotograma exacto.
// El cambio de clase y los factores se toman tal cual del laboratorio de
// linfocitos.

import type { ReactNode } from 'react';
import type { DatosProceso } from '@/lib/data/hipersensibilidad/tipos';
import type { DatosProceso as DatosLinfocitos } from '@/lib/data/linfocitos/tipos';
import { H } from '@/lib/data/hipersensibilidad/colores';
import { IMAGENES } from '@/lib/data/hipersensibilidad/imagenes';
import { LUPA_H, LUPA_W, easeBack, easeInOut, easeOut, tramo } from '@/lib/hipersensibilidad/motor';
import ProcesoLinfocitos from '../maduracion-linfocitos/Procesos';
import { Anticuerpo } from './Celulas';
import { srcImagen } from './imagenes';
import ls from '@/styles/linfocitos.module.css';
import s from '@/styles/hipersensibilidad.module.css';

function Titulo({ texto, sub }: { texto: string; sub?: string }) {
  return (
    <g>
      <text x={18} y={30} className={ls.lupaTitulo}>{texto}</text>
      {sub && <text x={18} y={52} className={ls.lupaSub}>{sub}</text>}
    </g>
  );
}

function Prot({ x, y, r, color, nombre, op = 1, esc = 1 }: { x: number; y: number; r: number; color: string; nombre: string; op?: number; esc?: number }) {
  if (op <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`} opacity={op}>
      <circle r={r} fill={color} />
      <circle r={r} fill="url(#brilloProt)" />
      <text textAnchor="middle" dy="0.35em" className={ls.protTxt} style={{ fontSize: Math.min(14, (r * 2 - 4) / (nombre.length * 0.56)) }}>{nombre}</text>
    </g>
  );
}

/** Parte un texto en líneas de `max` caracteres. */
function lineas(t: string, max: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const w of t.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

function Caja({ x, y, w, h, texto, sub, color, op = 1, k = 1 }: { x: number; y: number; w: number; h: number; texto: string; sub?: string; color: string; op?: number; k?: number }) {
  if (op <= 0.01) return null;
  return (
    <g opacity={op} transform={`translate(${x + w / 2},${y + h / 2}) scale(${0.85 + 0.15 * k}) translate(${-w / 2},${-h / 2})`}>
      <rect width={w} height={h} rx={9} className={s.cajaFlujo} style={{ stroke: color }} />
      <text x={w / 2} y={sub ? h / 2 - 4 : h / 2} dy="0.35em" textAnchor="middle" className={s.cajaTxt}>{texto}</text>
      {sub && <text x={w / 2} y={h / 2 + 11} dy="0.35em" textAnchor="middle" className={s.cajaSub}>{sub}</text>}
    </g>
  );
}

function Flecha({ x1, y1, x2, y2, q, color = '#5B6475' }: { x1: number; y1: number; x2: number; y2: number; q: number; color?: string }) {
  if (q <= 0.01) return null;
  const x = x1 + (x2 - x1) * q, y = y1 + (y2 - y1) * q;
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      {q > 0.6 && <path d="M0,0 L-9,-5 L-9,5 Z" fill={color} transform={`translate(${x},${y}) rotate(${ang})`} />}
    </g>
  );
}

/** Curva en un eje: `f(x)` con x 0–1, dibujada hasta `q`. */
function Curva({ x0, y0, w, h, f, q, color, ancho = 3, dash }: { x0: number; y0: number; w: number; h: number; f: (x: number) => number; q: number; color: string; ancho?: number; dash?: string }) {
  if (q <= 0) return null;
  const N = Math.max(2, Math.round(90 * q));
  const d = Array.from({ length: N + 1 }, (_, i) => { const x = (i / N) * q; return `${i ? 'L' : 'M'}${(x0 + x * w).toFixed(1)},${(y0 - f(x) * h).toFixed(1)}`; }).join(' ');
  return <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />;
}

function Ejes({ x0, y0, w, h, xRot, yRot, marcas }: { x0: number; y0: number; w: number; h: number; xRot: string; yRot: string; marcas: { x: number; t: string }[] }) {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} className={s.eje} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} className={s.eje} />
      {marcas.map((m) => <text key={m.t} x={x0 + m.x * w} y={y0 + 15} textAnchor="middle" className={s.ejeTxt}>{m.t}</text>)}
      <text x={x0 + w} y={y0 + 30} textAnchor="end" className={s.ejeTxt}>{xRot}</text>
      <text x={x0 - 8} y={y0 - h - 6} className={s.ejeTxt}>{yRot}</text>
    </g>
  );
}

const gauss = (x: number, c: number, a: number) => Math.exp(-Math.pow((x - c) / a, 2));

// ─── Lista de tarjetas ────────────────────────────────────────────────────────

function Lista({ d, p }: { d: Extract<DatosProceso, { clase: 'lista' }>; p: number }) {
  const n = d.items.length;
  const cols = n <= 4 ? 2 : 3;
  const filas = Math.ceil(n / cols);
  const w = (LUPA_W - 36 - (cols - 1) * 10) / cols;
  const y0 = d.sub ? 64 : 48;
  const h = (LUPA_H - y0 - 12 - (filas - 1) * 8) / filas;
  const max = Math.floor(w / 6.6);
  return (
    <g>
      <Titulo texto={d.titulo} sub={d.sub} />
      {d.items.map((it, i) => {
        const k = tramo(p, 0.06 + i * (0.6 / n), 0.2 + i * (0.6 / n));
        if (k <= 0) return null;
        const x = 18 + (i % cols) * (w + 10), y = y0 + Math.floor(i / cols) * (h + 8);
        const ls2 = lineas(it.detalle, max).slice(0, Math.max(1, Math.floor((h - 26) / 14)));
        return (
          <g key={it.nombre} opacity={k} transform={`translate(${x},${y + (1 - easeOut(k)) * 10})`}>
            <rect width={w} height={h} rx={10} className={s.tarjeta} />
            <rect width={5} height={h} rx={2.5} fill={it.color} />
            <text x={14} y={19} className={s.tarjetaNombre} style={{ fill: it.color }}>{it.nombre}</text>
            {ls2.map((l, j) => <text key={j} x={14} y={36 + j * 14} className={s.tarjetaTxt}>{l}</text>)}
          </g>
        );
      })}
    </g>
  );
}

// ─── Señal del FcεRI ──────────────────────────────────────────────────────────

function Fceri({ p }: { p: number }) {
  const ym = 160;
  const junta = easeInOut(tramo(p, 0.18, 0.32));
  const xa = 110 + 28 * junta, xb = 230 - 28 * junta;
  const ag = easeOut(tramo(p, 0, 0.2));
  const lyn = tramo(p, 0.32, 0.44), syk = tramo(p, 0.44, 0.56), plc = tramo(p, 0.56, 0.68);
  const ca = tramo(p, 0.66, 0.8);
  const res = [tramo(p, 0.74, 0.84), tramo(p, 0.82, 0.92), tramo(p, 0.9, 1)];
  const Receptor = ({ x }: { x: number }) => (
    <g transform={`translate(${x},${ym})`}>
      <path d="M-9,-6 L-9,-26 Q0,-34 9,-26 L9,-6" className={s.fcAlfa} />
      <rect x={-15} y={-6} width={7} height={22} rx={3} className={s.fcBeta} />
      <rect x={-4} y={-6} width={6} height={22} rx={3} className={s.fcGamma} />
      <rect x={4} y={-6} width={6} height={22} rx={3} className={s.fcGamma} />
      {[[-11, 22], [-1, 22], [7, 22]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={4} className={lyn > 0.5 ? s.itamP : s.itam} />)}
      <g transform="translate(0,-48)"><Anticuerpo ab="IgE" d={42} /></g>
    </g>
  );
  return (
    <g>
      <Titulo texto="Entrecruzamiento del FcεRI" sub="El alérgeno une dos IgE vecinas y junta sus receptores" />
      <rect x={10} y={ym - 6} width={330} height={12} className={s.bicapa} />
      <Receptor x={xa} />
      <Receptor x={xb} />
      <g transform={`translate(${(xa + xb) / 2},${ym - 84 - (1 - ag) * 30})`} opacity={ag}>
        <circle r={20} className={s.alergenoLupa} />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={Math.cos(i) * 13} cy={Math.sin(i) * 13} r={4} className={s.alergenoBola} />)}
      </g>
      <Prot x={xa - 4} y={ym + 52} r={16} color="#5B6475" nombre="Lyn" op={lyn} esc={easeBack(Math.min(1, lyn))} />
      {lyn > 0.4 && <text x={xa + 18} y={ym + 34} className={s.fosfo} opacity={lyn}>P</text>}
      <Prot x={(xa + xb) / 2 + 6} y={ym + 68} r={18} color="#7C5CD6" nombre="Syk" op={syk} esc={easeBack(Math.min(1, syk))} />
      <Prot x={(xa + xb) / 2 + 70} y={ym + 66} r={20} color="#3D8BD9" nombre="PLCγ" op={plc} esc={easeBack(Math.min(1, plc))} />
      {ca > 0 && Array.from({ length: 9 }, (_, i) => <circle key={i} cx={250 + (i % 3) * 16 + ca * 8} cy={ym + 36 + Math.floor(i / 3) * 14 - ca * 10} r={4} className={s.calcio} opacity={ca} />)}
      {ca > 0.2 && <text x={244} y={ym + 92} className={ls.lupaNota} opacity={ca}>IP₃ → Ca²⁺ ↑ · DAG → PKC</text>}
      <Caja x={366} y={66} w={198} h={46} texto="Desgranulación" sub="histamina, proteasas (segundos)" color={H.mastocito} op={res[0]} k={res[0]} />
      <Caja x={366} y={122} w={198} h={46} texto="PLA₂ → ácido araquidónico" sub="PGD₂, leucotrienos (minutos)" color="#E0702A" op={res[1]} k={res[1]} />
      <Caja x={366} y={178} w={198} h={46} texto="NFAT · NF-κB → genes" sub="citocinas: TNF, IL-4, IL-5 (horas)" color="#1F9A6A" op={res[2]} k={res[2]} />
      <Flecha x1={340} y1={130} x2={362} y2={89} q={res[0]} />
      <Flecha x1={340} y1={145} x2={362} y2={145} q={res[1]} />
      <Flecha x1={340} y1={160} x2={362} y2={200} q={res[2]} />
    </g>
  );
}

// ─── Cascada del ácido araquidónico ───────────────────────────────────────────

function Araquidonico({ p }: { p: number }) {
  const k = (i: number) => tramo(p, 0.05 + i * 0.1, 0.15 + i * 0.1);
  return (
    <g>
      <Titulo texto="Mediadores lipídicos: se fabrican en el momento" sub="La fosfolipasa A₂ libera el ácido araquidónico de la membrana" />
      <Caja x={14} y={110} w={124} h={44} texto="Fosfolípidos" sub="de membrana" color="#8A93A6" op={k(0)} k={k(0)} />
      <Flecha x1={140} y1={132} x2={170} y2={132} q={k(1)} />
      <text x={143} y={122} className={s.enzima} opacity={k(1)}>PLA₂</text>
      <Caja x={172} y={110} w={112} h={44} texto="Ácido" sub="araquidónico" color="#E0702A" op={k(1)} k={k(1)} />
      <Flecha x1={286} y1={122} x2={318} y2={88} q={k(2)} />
      <text x={290} y={92} className={s.enzima} opacity={k(2)}>COX</text>
      <Caja x={320} y={64} w={246} h={44} texto="PGD₂" sub="broncoespasmo intenso · moco · vasodilatación" color="#C05FA8" op={k(3)} k={k(3)} />
      <Flecha x1={286} y1={142} x2={318} y2={168} q={k(4)} />
      <text x={286} y={176} className={s.enzima} opacity={k(4)}>5-LOX</text>
      <Caja x={320} y={150} w={118} h={44} texto="LTB₄" sub="quimiotaxis" color="#2C8FD6" op={k(5)} k={k(5)} />
      <Caja x={446} y={150} w={120} h={44} texto="LTC₄ · D₄ · E₄" sub="×1000 la histamina" color="#E5484D" op={k(6)} k={k(6)} />
      <Caja x={14} y={196} w={270} h={44} texto="PAF (no viene del ácido araquidónico)" sub="agrega plaquetas · broncoespasmo · fuga" color="#8A4FCF" op={k(7)} k={k(7)} />
      {p > 0.9 && <text x={320} y={226} className={ls.lupaOk} opacity={tramo(p, 0.9, 1)}>Montelukast bloquea el receptor de LTD₄</text>}
    </g>
  );
}

// ─── Los tres tipos de mediadores ─────────────────────────────────────────────

function Mediadores({ p }: { p: number }) {
  const cols = [
    { t: 'Preformados', s: 'en los gránulos · segundos', c: H.mastocito, items: ['Histamina', 'Triptasa, quimasa', 'Heparina'] },
    { t: 'Lipídicos', s: 'de la membrana · minutos', c: '#E0702A', items: ['PGD₂', 'LTC₄, LTD₄, LTB₄', 'PAF'] },
    { t: 'Citocinas', s: 'genes nuevos · horas', c: '#1F9A6A', items: ['TNF, IL-1', 'IL-4, IL-5, IL-13', 'Quimiocinas'] },
  ];
  return (
    <g>
      <Titulo texto="Tres oleadas de mediadores" sub="Las dos primeras dan la fase inmediata; la tercera prepara la tardía" />
      {cols.map((c, i) => {
        const k = tramo(p, 0.08 + i * 0.22, 0.28 + i * 0.22);
        return (
          <g key={c.t} opacity={k} transform={`translate(${18 + i * 186},${66 + (1 - easeOut(k)) * 10})`}>
            <rect width={174} height={150} rx={12} className={s.tarjeta} />
            <rect width={174} height={6} rx={3} fill={c.c} />
            <text x={12} y={28} className={s.tarjetaNombre} style={{ fill: c.c }}>{c.t}</text>
            <text x={12} y={44} className={s.tarjetaTxt}>{c.s}</text>
            {c.items.map((it, j) => <text key={it} x={12} y={72 + j * 24} className={s.cajaTxt} textAnchor="start" opacity={tramo(k, 0.3 + j * 0.2, 0.6 + j * 0.2)}>• {it}</text>)}
          </g>
        );
      })}
      <g opacity={tramo(p, 0.78, 0.95)}>
        <rect x={18} y={228} width={358} height={18} rx={9} fill={H.mastocito} opacity={0.25} />
        <text x={197} y={241} textAnchor="middle" className={s.ejeTxt}>Fase inmediata: edema, moco, espasmo</text>
        <rect x={390} y={228} width={174} height={18} rx={9} fill="#1F9A6A" opacity={0.25} />
        <text x={477} y={241} textAnchor="middle" className={s.ejeTxt}>Fase tardía</text>
      </g>
    </g>
  );
}

// ─── Cinética bifásica (fig. 6-13A) ───────────────────────────────────────────

function Cinetica({ d, p }: { d: Extract<DatosProceso, { clase: 'cinetica' }>; p: number }) {
  const X0 = 50, Y0 = 220, W = 500, Hh = 140;
  // Eje partido como en Robbins: la primera hora ocupa el 22 % del ancho.
  const f = (x: number) => 0.12 + 0.86 * gauss(x, 0.09, 0.05) + 0.52 * gauss(x, 0.55, 0.2) * (x > 0.22 ? 1 : 0.4 * gauss(x, 0.22, 0.02));
  const fAnti = (x: number) => 0.12 + 0.3 * gauss(x, 0.09, 0.05) + 0.52 * gauss(x, 0.55, 0.2) * (x > 0.22 ? 1 : 0);
  const fCort = (x: number) => 0.12 + 0.86 * gauss(x, 0.09, 0.05) + 0.14 * gauss(x, 0.55, 0.2) * (x > 0.22 ? 1 : 0);
  const q = easeInOut(tramo(p, 0.05, 0.6));
  const q2 = easeInOut(tramo(p, 0.62, 0.95));
  return (
    <g>
      <Titulo texto="Dos fases tras una sola exposición" sub="Minutos después, y otra vez de 2 a 24 h sin más alérgeno" />
      <Ejes x0={X0} y0={Y0} w={W} h={Hh} xRot="horas" yRot="síntomas" marcas={[{ x: 0, t: '0' }, { x: 0.22, t: '1' }, { x: 0.3, t: '4' }, { x: 0.5, t: '8' }, { x: 0.7, t: '12' }, { x: 0.9, t: '16' }]} />
      <path d={`M${X0 + 0.22 * W - 5},${Y0 + 4} l5,-8 m2,8 l5,-8`} className={s.eje} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={f} q={q} color="#3B6FD0" />
      {d.marca === 'antihistaminico' && <Curva x0={X0} y0={Y0} w={W} h={Hh} f={fAnti} q={q2} color="#1F9A6A" dash="7 6" />}
      {d.marca === 'corticoide' && <Curva x0={X0} y0={Y0} w={W} h={Hh} f={fCort} q={q2} color="#1F9A6A" dash="7 6" />}
      <g opacity={tramo(p, 0.0, 0.08)}><path d={`M${X0 + 4},${Y0 - 40} l0,22 m-6,-8 l6,8 l6,-8`} stroke="#E5484D" strokeWidth={3} fill="none" /></g>
      {q > 0.2 && <text x={X0 + 0.09 * W + 34} y={Y0 - 0.9 * Hh} className={s.ejeTxt} opacity={tramo(q, 0.2, 0.35)}>Inmediata (vasos, músculo liso)</text>}
      {q > 0.75 && <text x={X0 + 0.55 * W} y={Y0 - 0.66 * Hh - 10} textAnchor="middle" className={s.ejeTxt} opacity={tramo(q, 0.75, 0.95)}>Tardía (infiltrado celular)</text>}
      {d.marca && q2 > 0.4 && <text x={X0 + W} y={64} textAnchor="end" className={ls.lupaOk} opacity={tramo(q2, 0.4, 0.8)}>{d.marca === 'antihistaminico' ? 'Antihistamínico: solo baja el primer pico' : 'Corticoide: apaga la fase tardía'}</text>}
    </g>
  );
}

// ─── Vía clásica del complemento ─────────────────────────────────────────────
// Una sola cascada dibujada según su avance global `G` (0 → 6): cada etapa
// ocupa una unidad (C1 · C4 y C2 · C3 · C5 · MAC · lisis). Cada fase de los
// datos anima la suya con lo anterior ya hecho, así la lupa sigue abierta de un
// paso al siguiente sin saltos; `rapida` corre de C1 a C5b de un tirón (IgM).
// Abajo, un rótulo numerado dice qué pasa ahora; arriba, el riel de etapas.

type FaseC = Extract<DatosProceso, { clase: 'complemento' }>['fase'];
type Pt = { x: number; y: number };

const ETAPA: Record<FaseC, [number, number]> = { c1: [0, 1], c4c2: [1, 2], c3: [2, 3], c5: [3, 4], mac: [4, 5], agua: [5, 6], rapida: [0, 4] };
const RIEL = ['C1', 'C3 convertasa', 'C3b', 'C5 convertasa', 'MAC', 'Lisis'];
const YM = 212; // borde de arriba de la bicapa
const C1X = 81;
const AB_X = [64, 98];
const C4B: Pt = { x: 130, y: YM - 13 };
const C2A: Pt = { x: 154, y: YM - 11 };
const C3B_CONV: Pt = { x: 142, y: YM - 33 };
const C3B_X = [205, 235, 265, 295, 325, 352];
const C3A_P: Pt[] = [{ x: 318, y: 104 }, { x: 340, y: 116 }, { x: 362, y: 102 }, { x: 384, y: 114 }, { x: 406, y: 103 }, { x: 428, y: 115 }];
const C5A_P: Pt = { x: 250, y: 124 };
const MAC_X = 470;
const C5B: Pt = { x: 440, y: YM - 12 };
const C6: Pt = { x: 421, y: YM - 10 };
const C7: Pt = { x: 433, y: YM - 31 };
const ANILLO: Pt = { x: 538, y: 116 };
const CC = { c1q: H.complemento, c1r: '#5E9CD3', c1s: '#D9567E', c4: '#B4507E', c2: '#7C5CD6', c3: '#C0397A', c3a: '#E5484D', c5: '#8A4FCF', c5b: '#5B3FB0', c6: '#6E5BC4', c7: '#4F7FC2', c8: '#3E6FA8', c9: '#7C5CD6', agua: '#2C8FD6', hb: '#C0392B' };

type Rotulo = { g: number; t: string; ok?: boolean };
const ROTULOS: Rotulo[] = [
  { g: 0, t: '① El C1 circula inactivo y encuentra los Fc' },
  { g: 0.36, t: '② Su cabeza, el C1q, agarra dos Fc vecinos a la vez' },
  { g: 0.46, t: '③ Eso activa al C1r…' },
  { g: 0.62, t: '④ …y el C1r activa al C1s, una proteasa' },
  { g: 0.86, t: 'C1 activo: el C1s ya puede cortar', ok: true },
  { g: 1, t: '① El C1s corta el C4' },
  { g: 1.33, t: '② El C4a se va; el C4b se pega a la membrana' },
  { g: 1.52, t: '③ El C2 se une al C4b y el C1s también lo corta' },
  { g: 1.76, t: '④ El C2b se va; el C2a queda junto al C4b' },
  { g: 1.88, t: 'C4b2a: la C3 convertasa, fija sobre la célula', ok: true },
  { g: 2, t: '① La C3 convertasa parte cada C3 que llega' },
  { g: 2.2, t: '② El C3a sale al plasma; el C3b se pega a la membrana' },
  { g: 2.62, t: '③ Una sola convertasa repite el corte cientos de veces' },
  { g: 2.88, t: 'La célula queda cubierta de C3b: opsonizada', ok: true },
  { g: 3, t: '① Un C3b se suma a la C3 convertasa' },
  { g: 3.22, t: '② Ahora es C4b2a3b, la C5 convertasa: corta el C5' },
  { g: 3.5, t: '③ El C5a sale al plasma; el C5b se queda' },
  { g: 3.88, t: 'C5a llama neutrófilos; C5b empieza el poro', ok: true },
  { g: 4, t: '① El C5b recoge al C6' },
  { g: 4.18, t: '② Se suma el C7 y el complejo se hunde en la bicapa' },
  { g: 4.4, t: '③ El C8 la atraviesa: abre un poro pequeño' },
  { g: 4.53, t: '④ Llegan 10 a 16 C9 y cierran un anillo' },
  { g: 4.9, t: 'MAC (C5b-C9): un canal a través de la membrana', ok: true },
  { g: 5, t: '① Por el poro entran agua y Na⁺' },
  { g: 5.35, t: '② La célula se hincha: la membrana se estira' },
  { g: 5.62, t: '③ Revienta: la hemoglobina sale al plasma' },
  { g: 5.88, t: 'Lisis osmótica: hemólisis intravascular', ok: true },
];
const ROTULOS_IGM: Rotulo[] = [
  { g: 0, t: '① Una IgM sobre el hematíe: con una sola basta' },
  { g: 0.9, t: '② El C1s corta C4 y C2: C3 convertasa' },
  { g: 1.9, t: '③ La convertasa cubre la célula de C3b' },
  { g: 2.9, t: '④ C5 convertasa: el C5a sale, el C5b se queda' },
  { g: 3.82, t: 'Esta vez la cascada sigue hasta el final', ok: true },
];

const mezcla = (a: Pt, b: Pt, k: number): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
/** Igual que `mezcla`, pero subiendo en arco (`alto` px por encima de la recta). */
const arco = (a: Pt, b: Pt, k: number, alto: number): Pt => { const m = mezcla(a, b, k); return { x: m.x, y: m.y - Math.sin(Math.PI * k) * alto }; };

/** Destello de un corte de proteasa. */
function Corte({ x, y, k }: { x: number; y: number; k: number }) {
  if (k <= 0 || k >= 1) return null;
  const s = Math.sin(Math.PI * k);
  return (
    <g transform={`translate(${x},${y}) scale(${0.4 + 0.8 * s}) rotate(${k * 90})`} opacity={s}>
      <path d="M0,-13 L3,-3 L13,0 L3,3 L0,13 L-3,3 L-13,0 L-3,-3 Z" fill="#FFD23F" stroke="#E0A21E" strokeWidth={1} />
    </g>
  );
}

/** Fragmento pequeño con su nombre al lado (no cabe dentro). */
function Frag({ p, r, color, nombre, op, dx = 9, dy = -8 }: { p: Pt; r: number; color: string; nombre?: string; op: number; dx?: number; dy?: number }) {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      <circle cx={p.x} cy={p.y} r={r} fill={color} stroke="#fff" strokeWidth={1.2} />
      {nombre && <text x={p.x + dx} y={p.y + dy} className={s.protChico}>{nombre}</text>}
    </g>
  );
}

function Membrana({ grieta, hinchazon }: { grieta: number; hinchazon: number }) {
  const gx = 528;
  const tramos: [number, number][] = grieta > 0.5 ? [[10, gx - grieta / 2], [gx + grieta / 2, 570]] : [[10, 570]];
  return (
    <g>
      <rect x={10} y={YM + 14} width={560} height={LUPA_H - YM - 20} rx={10} className={s.citoplasmaLupa} opacity={0.55 + 0.45 * hinchazon} />
      {tramos.map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={YM} width={b - a} height={14} className={s.bicapa} />
          {Array.from({ length: Math.max(0, Math.floor((b - a - 4) / 8)) }, (_, i) => a + 5 + i * 8).map((x) => (
            <g key={x}><circle cx={x} cy={YM + 2.6} r={2.6} className={s.bicapaCabeza} /><circle cx={x} cy={YM + 11.4} r={2.6} className={s.bicapaCabeza} /></g>
          ))}
        </g>
      ))}
    </g>
  );
}

function Riel({ G }: { G: number }) {
  // La etapa en curso sigue marcada hasta que empieza la siguiente.
  const cur = Math.min(RIEL.length - 1, Math.max(0, Math.ceil(G) - 1));
  let x = 18;
  return (
    <g>
      {RIEL.map((t, i) => {
        const w = 18 + t.length * 6.4;
        const hecho = i < cur;
        const actual = i === cur;
        const el = (
          <g key={t} transform={`translate(${x},64)`}>
            {i > 0 && <text x={-8} y={10} dy="0.35em" textAnchor="middle" className={s.rielTxt}>›</text>}
            <rect width={w} height={20} rx={10} className={actual ? s.rielActual : hecho ? s.rielHecho : s.rielPend} />
            <text x={w / 2} y={10} dy="0.35em" textAnchor="middle" className={actual ? s.rielTxtActual : s.rielTxt}>{t}</text>
          </g>
        );
        x += w + 16;
        return el;
      })}
    </g>
  );
}

/** IgM en «grapa» sobre la membrana: los cinco Fc arriba, los Fab abajo. */
function IgMGrapa() {
  const xs = [-26, -13, 0, 13, 26];
  return (
    <g transform={`translate(${C1X},0)`}>
      {xs.map((x) => <path key={x} d={`M${x},${YM - 40} L${x - 6},${YM - 2} M${x},${YM - 40} L${x + 6},${YM - 2}`} stroke={H.igm} strokeWidth={3} strokeLinecap="round" fill="none" />)}
      <rect x={-31} y={YM - 46} width={62} height={8} rx={4} fill={H.igm} />
      <circle cy={YM - 42} r={4} fill="#fff" stroke={H.igm} strokeWidth={1.5} />
    </g>
  );
}

/** C1: el C1q (seis cabezas sobre tallos que se juntan) con el C1r₂s₂ entre los tallos. */
function C1({ dy, op, unido, c1r, chispa, c1s, pulso }: { dy: number; op: number; unido: number; c1r: number; chispa: number; c1s: number; pulso: number }) {
  if (op <= 0.01) return null;
  const cabezas = [-30, -18, -6, 6, 18, 30];
  return (
    <g transform={`translate(${C1X},${dy})`} opacity={op}>
      <rect x={-6} y={YM - 110} width={12} height={26} rx={5} fill={CC.c1q} />
      {cabezas.map((x) => (
        <g key={x}>
          <path d={`M0,${YM - 86} Q${x * 0.5},${YM - 74} ${x},${YM - 54}`} stroke={CC.c1q} strokeWidth={2.4} fill="none" />
          <circle cx={x} cy={YM - 50} r={5.5} fill={CC.c1q} />
          {unido > 0 && Math.abs(x) <= 30 && <circle cx={x} cy={YM - 50} r={8} fill="none" stroke="#FFD23F" strokeWidth={2} opacity={unido * (1 - 0.6 * c1s)} />}
        </g>
      ))}
      {[-8, 8].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={YM - 80} rx={6} ry={4} fill={CC.c1r} />
          {c1r > 0 && <ellipse cx={x} cy={YM - 80} rx={9} ry={7} fill="none" stroke="#FFD23F" strokeWidth={1.8} opacity={c1r * (1 - 0.5 * c1s)} />}
        </g>
      ))}
      {[-17, 17].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={YM - 68} rx={7} ry={4.5} fill={CC.c1s} />
          {c1s > 0 && <ellipse cx={x} cy={YM - 68} rx={10 + pulso} ry={7.5 + pulso} fill="none" stroke="#FFD23F" strokeWidth={2} opacity={c1s} />}
        </g>
      ))}
      {chispa > 0 && chispa < 1 && [-1, 1].map((sg) => { const q = mezcla({ x: 8 * sg, y: YM - 80 }, { x: 17 * sg, y: YM - 68 }, chispa); return <circle key={sg} cx={q.x} cy={q.y} r={3.5} fill="#FFD23F" />; })}
      <text x={36} y={YM - 98} className={s.protChico}>C1q</text>
    </g>
  );
}

function Complemento({ d, p }: { d: Extract<DatosProceso, { clase: 'complemento' }>; p: number }) {
  const [g0, g1] = ETAPA[d.fase];
  const G = g0 + (g1 - g0) * p;
  const igm = d.ab === 'IgM';
  /** Avance local de la etapa `e` entre `a` y `b` (0–1). */
  const L = (e: number, a: number, b: number) => tramo(G - e, a, b);
  /** Rótulo que aparece en la etapa `e` (desde `a`) y se va al empezar la siguiente. */
  const vis = (e: number, a: number) => L(e, a, a + 0.1) * (1 - L(e, 1, 1.12));
  const pulso = Math.sin(G * 26) * 1.2;

  // ── Etapa 0: C1
  const c1Baja = easeOut(L(0, 0.08, 0.36));
  const unido = L(0, 0.36, 0.44), c1r = L(0, 0.46, 0.58), chispa = L(0, 0.58, 0.68), c1s = L(0, 0.66, 0.76);
  const c1sCorta = (k: number) => k > 0 && k < 1;
  const C1S: Pt = { x: C1X + 17, y: YM - 68 };

  // ── Etapa 1: C4 y C2
  const c4Llega = easeInOut(L(1, 0.04, 0.24)), c4Corte = L(1, 0.24, 0.34), c4Sep = L(1, 0.33, 0.5), c4aVa = L(1, 0.33, 0.62), c4Pega = L(1, 0.48, 0.56);
  const c2Llega = easeInOut(L(1, 0.52, 0.68)), c2Corte = L(1, 0.68, 0.78), c2bVa = L(1, 0.76, 0.96);
  const C4_JUNTO: Pt = { x: 128, y: YM - 62 };
  const conv3 = L(1, 0.84, 0.94);

  // ── Etapa 2: C3 (seis cortes) + amplificación
  const c3s = C3B_X.map((_, i) => { const a = 0.04 + i * 0.12; return { llega: easeInOut(L(2, a, a + 0.08)), corte: L(2, a + 0.08, a + 0.1), sep: easeInOut(L(2, a + 0.1, a + 0.18)) }; });
  const ampli = L(2, 0.7, 0.95);
  const PUNTO_CORTE3: Pt = { x: 166, y: YM - 34 };

  // ── Etapa 3: C5
  const c3bSube = easeInOut(L(3, 0.04, 0.22)), conv5 = L(3, 0.18, 0.28), c5Llega = easeInOut(L(3, 0.22, 0.42)), c5Corte = L(3, 0.42, 0.5), c5Sep = L(3, 0.5, 0.85);
  const C5_JUNTO: Pt = { x: 198, y: YM - 42 };

  // ── Etapa 4: MAC
  const c6 = easeInOut(L(4, 0.04, 0.18)), c7 = easeInOut(L(4, 0.18, 0.3)), hunde = easeInOut(L(4, 0.3, 0.4)), c8 = easeInOut(L(4, 0.4, 0.5));
  const c9 = Array.from({ length: 12 }, (_, i) => easeOut(L(4, 0.52 + i * 0.03, 0.6 + i * 0.03)));
  const nubes = 1 - L(4, 0, 0.3); // C3a y C5a ya se fueron al plasma

  // ── Etapa 5: agua y lisis
  const flujo = L(5, 0.02, 0.7), hinchazon = L(5, 0.3, 0.62), grieta = easeOut(L(5, 0.62, 0.78)) * 40, hb = L(5, 0.64, 0.98);
  const anilloOp = 1 - L(5, 0, 0.25);

  // Paredes del poro en corte: C8 + C9 a la izquierda, C9 a la derecha.
  const paredes = [
    { x: MAC_X - 13, k: c8, col: CC.c8 }, { x: MAC_X - 18.5, k: c9[0], col: CC.c9 }, { x: MAC_X - 24, k: c9[2], col: CC.c9 },
    { x: MAC_X + 8.5, k: c9[1], col: CC.c9 }, { x: MAC_X + 14, k: c9[3], col: CC.c9 }, { x: MAC_X + 19.5, k: c9[5], col: CC.c9 },
  ];
  const lista = igm && d.fase === 'rapida' ? ROTULOS_IGM : ROTULOS.filter((r) => r.g >= g0 - 1e-6 && r.g < g1 - 1e-6);
  let rot: Rotulo | null = null;
  for (const r of lista) if (r.g <= G + 1e-6) rot = r;
  const rotOp = rot ? easeOut(tramo(G - rot.g, 0, 0.06 * (g1 - g0))) : 0;

  return (
    <g>
      <Titulo texto="Vía clásica del complemento" sub={igm ? 'La IgM la dispara sola; dos IgG tienen que estar juntas' : 'Cada paso activa al siguiente, sobre la membrana de la célula'} />
      <Riel G={G} />
      <Membrana grieta={grieta} hinchazon={hinchazon} />

      {/* Anticuerpos sobre la célula */}
      {igm ? <IgMGrapa /> : AB_X.map((x) => <g key={x} transform={`translate(${x},${YM - 22}) rotate(180)`}><Anticuerpo ab="IgG" d={40} /></g>)}
      {!igm && <text x={AB_X[1] + 16} y={YM - 40} className={s.protChico} opacity={L(0, 0, 0.08) * (1 - L(0, 0.3, 0.4))}>Fc</text>}

      {/* Una IgG sola no basta: el C1q baja, no se queda y se va */}
      {d.fase === 'c1' && !igm && (() => {
        const op = L(0, 0.06, 0.14) * (1 - L(0, 0.86, 1));
        const baja = easeOut(L(0, 0.1, 0.3)), sube = easeInOut(L(0, 0.34, 0.52));
        const dy = -40 * (1 - baja) - 45 * sube;
        return (
          <g opacity={op}>
            <g transform={`translate(330,${YM - 22}) rotate(180)`}><Anticuerpo ab="IgG" d={40} /></g>
            <g transform={`translate(330,${dy})`} opacity={0.55 * (1 - sube)}>
              {[-30, -18, -6, 6, 18, 30].map((x) => <g key={x}><path d={`M0,${YM - 86} Q${x * 0.5},${YM - 74} ${x},${YM - 54}`} stroke={CC.c1q} strokeWidth={2} fill="none" strokeDasharray="3 3" /><circle cx={x} cy={YM - 50} r={5} fill="none" stroke={CC.c1q} strokeWidth={1.8} /></g>)}
            </g>
            <text x={366} y={YM - 30} className={s.protChico} opacity={L(0, 0.34, 0.44)}>Una IgG sola:</text>
            <text x={366} y={YM - 16} className={s.protChico} opacity={L(0, 0.34, 0.44)}>el C1q no se queda</text>
          </g>
        );
      })()}

      {/* C1 */}
      <C1 dy={-(1 - c1Baja) * 45} op={c1Baja} unido={unido} c1r={c1r} chispa={chispa} c1s={c1s} pulso={pulso * L(0, 0.66, 0.76)} />
      <g opacity={vis(0, 0.46)}>
        <text x={18} y={YM - 77} className={s.protChico} style={{ fill: CC.c1r }}>C1r</text>
        <line x1={40} y1={YM - 81} x2={C1X - 15} y2={YM - 80} stroke={CC.c1r} strokeWidth={1.2} />
        <text x={18} y={YM - 61} className={s.protChico} style={{ fill: CC.c1s }}>C1s</text>
        <line x1={40} y1={YM - 65} x2={C1X - 24} y2={YM - 68} stroke={CC.c1s} strokeWidth={1.2} />
      </g>

      {/* C4 → C4a + C4b; C2 → C2b + C2a */}
      {c1sCorta(c4Corte) && <line x1={C1S.x} y1={C1S.y} x2={C4_JUNTO.x} y2={C4_JUNTO.y} stroke={CC.c1s} strokeWidth={2} strokeDasharray="4 3" opacity={Math.sin(Math.PI * c4Corte)} />}
      {c4Llega > 0 && c4Sep <= 0 && <Prot {...mezcla({ x: 250, y: 98 }, C4_JUNTO, c4Llega)} r={15} color={CC.c4} nombre="C4" />}
      <Corte x={C4_JUNTO.x - 6} y={C4_JUNTO.y - 2} k={c4Corte} />
      {c4Sep > 0 && <Frag p={arco(C4_JUNTO, { x: 232, y: 106 }, c4aVa, 20)} r={5} color={CC.c4} nombre="C4a" op={1 - tramo(c4aVa, 0.7, 1)} />}
      {c4Sep > 0 && <Prot {...mezcla(C4_JUNTO, C4B, easeInOut(c4Sep))} r={13} color={CC.c4} nombre="C4b" />}
      <Corte x={C4B.x} y={YM} k={c4Pega} />
      {c1sCorta(c2Corte) && <line x1={C1S.x} y1={C1S.y} x2={C2A.x} y2={C2A.y - 6} stroke={CC.c1s} strokeWidth={2} strokeDasharray="4 3" opacity={Math.sin(Math.PI * c2Corte)} />}
      {c2Llega > 0 && <Prot {...mezcla({ x: 268, y: 118 }, C2A, c2Llega)} r={c2Corte >= 0.5 ? 11 : 12} color={CC.c2} nombre={c2Corte >= 0.5 ? 'C2a' : 'C2'} />}
      <Corte x={C2A.x + 6} y={C2A.y - 10} k={c2Corte} />
      {c2Corte >= 0.5 && <Frag p={arco({ x: C2A.x + 4, y: C2A.y - 10 }, { x: 252, y: 132 }, c2bVa, 18)} r={4.5} color={CC.c2} nombre="C2b" op={1 - tramo(c2bVa, 0.7, 1)} />}
      {conv3 > 0 && <rect x={C4B.x - 18} y={YM - 30} width={C2A.x - C4B.x + 34} height={30} rx={14} fill="none" stroke="#FFD23F" strokeWidth={2} strokeDasharray="5 4" opacity={conv3 * (1 - L(3, 0.1, 0.25))} />}
      <text x={C4B.x - 8} y={YM - 36} className={s.protChico} opacity={vis(1, 0.86)}>C3 convertasa</text>

      {/* C3 → C3a + C3b, seis veces, y luego cientos */}
      {c3s.map((c, i) => {
        const desde = { x: 236 + i * 12, y: 96 };
        const destino = { x: C3B_X[i], y: YM - 9 };
        const esConv = i === 0 && c3bSube > 0;
        return (
          <g key={i}>
            {c.llega > 0 && c.sep <= 0 && <Prot {...mezcla(desde, PUNTO_CORTE3, c.llega)} r={11} color={CC.c3} nombre="C3" />}
            <Corte x={PUNTO_CORTE3.x + 4} y={PUNTO_CORTE3.y - 6} k={c.corte} />
            {c.sep > 0 && <Frag p={arco(PUNTO_CORTE3, C3A_P[i], c.sep, 16)} r={5} color={CC.c3a} op={0.9 * nubes} />}
            {c.sep > 0 && <Prot {...(esConv ? mezcla(destino, C3B_CONV, c3bSube) : mezcla(PUNTO_CORTE3, destino, c.sep))} r={9} color={CC.c3} nombre="C3b" />}
          </g>
        );
      })}
      {ampli > 0 && Array.from({ length: 6 }, (_, i) => { const k = easeBack(tramo(ampli, i * 0.12, 0.3 + i * 0.12)); return k > 0 ? <circle key={i} cx={368 + i * 8} cy={YM - 4} r={3.4 * k} fill={CC.c3} stroke="#fff" strokeWidth={1} /> : null; })}
      <text x={366} y={YM - 14} className={s.protChico} opacity={vis(2, 0.72)}>×100</text>
      <text x={318} y={134} className={s.protChico} style={{ fill: CC.c3a }} opacity={vis(2, 0.3) * nubes}>C3a: anafilatoxina</text>
      <text x={196} y={YM - 26} className={s.protChico} style={{ fill: CC.c3 }} opacity={vis(2, 0.82)}>C3b: opsonina</text>

      {/* C5 → C5a + C5b; la C5 convertasa es C4b2a3b */}
      {conv5 > 0 && <rect x={C4B.x - 18} y={YM - 48} width={C2A.x - C4B.x + 34} height={48} rx={16} fill="none" stroke="#FFD23F" strokeWidth={2} strokeDasharray="5 4" opacity={conv5 * (1 - L(4, 0, 0.2))} />}
      <text x={C4B.x - 8} y={YM - 54} className={s.protChico} opacity={vis(3, 0.2)}>C5 convertasa</text>
      {c5Llega > 0 && c5Sep <= 0 && <Prot {...mezcla({ x: 262, y: 96 }, C5_JUNTO, c5Llega)} r={13} color={CC.c5} nombre="C5" />}
      <Corte x={C5_JUNTO.x - 4} y={C5_JUNTO.y + 4} k={c5Corte} />
      {c5Sep > 0 && <Frag p={arco(C5_JUNTO, C5A_P, easeInOut(tramo(c5Sep, 0, 0.6)), 14)} r={6} color={CC.c5} op={nubes} />}
      <text x={C5A_P.x - 28} y={C5A_P.y + 22} className={s.protChico} style={{ fill: CC.c5 }} opacity={L(3, 0.62, 0.72) * nubes}>C5a: atrae neutrófilos</text>

      {/* MAC: C5b recoge C6 y C7, se hunde, entra C8 y los C9 cierran el anillo */}
      {paredes.map((w, i) => w.k > 0 ? <rect key={i} x={w.x} y={YM - 26 - (1 - w.k) * 34} width={4.6} height={44} rx={2.2} fill={w.col} opacity={w.k} /> : null)}
      {c6 > 0 && <Prot {...mezcla({ x: 400, y: 98 }, { x: C6.x, y: C6.y + hunde * 7 }, c6)} r={9} color={CC.c6} nombre="C6" />}
      {c7 > 0 && <Prot {...mezcla({ x: 470, y: 96 }, { x: C7.x, y: C7.y + hunde * 7 }, c7)} r={9} color={CC.c7} nombre="C7" />}
      {c5Sep > 0 && <Prot {...(c5Sep < 1 ? arco(C5_JUNTO, C5B, easeInOut(c5Sep), 46) : { x: C5B.x, y: C5B.y + hunde * 7 })} r={11} color={CC.c5b} nombre="C5b" />}
      {c8 > 0 && c8 < 1 && <Prot {...mezcla({ x: 500, y: 96 }, { x: MAC_X - 11, y: YM - 22 }, c8)} r={8} color={CC.c8} nombre="C8" />}
      <text x={MAC_X - 66} y={YM - 50} className={s.protChico} opacity={vis(4, 0.9)}>MAC (C5b-C9)</text>

      {/* El anillo visto desde arriba */}
      {G > 4.5 && (
        <g transform={`translate(${ANILLO.x},${ANILLO.y})`} opacity={L(4, 0.5, 0.56) * anilloOp}>
          <circle r={11} className={s.citoplasmaLupa} />
          {Array.from({ length: 13 }, (_, i) => {
            const k = i === 0 ? c8 : c9[i - 1];
            const a = (i / 13) * 360 - 90;
            return k > 0 ? <rect key={i} x={-3} y={-24} width={6} height={12} rx={3} fill={i === 0 ? CC.c8 : CC.c9} opacity={k} transform={`rotate(${a + 90})`} /> : null;
          })}
          <text y={40} textAnchor="middle" className={s.protChico}>desde arriba</text>
        </g>
      )}

      {/* Agua y Na⁺ que entran; hemoglobina que sale */}
      {flujo > 0 && flujo < 1 && Array.from({ length: 7 }, (_, i) => {
        const f = (flujo * 3 + i / 7) % 1;
        const y = YM - 64 + f * 92;
        const op = Math.sin(Math.PI * f) * (1 - tramo(flujo, 0.85, 1));
        return i % 3 === 2
          ? <text key={i} x={MAC_X + 1} y={y} textAnchor="middle" className={s.protChico} style={{ fill: '#B48A1E' }} opacity={op}>Na⁺</text>
          : <path key={i} d={`M${MAC_X + 2},${y - 6} q5,7 0,10 q-5,-3 0,-10 Z`} fill={CC.agua} opacity={op} />;
      })}
      {/* El agua que entra se reparte por el interior */}
      {flujo > 0.15 && Array.from({ length: 16 }, (_, i) => {
        const k = tramo(flujo, 0.15 + i * 0.04, 0.25 + i * 0.04) * (1 - tramo(hb, 0, 0.3));
        if (k <= 0) return null;
        const x = MAC_X + (i % 2 ? 1 : -1) * (12 + i * 17), y = YM + 21 + (i % 3) * 4;
        return x > 16 && x < 564 ? <path key={i} d={`M${x},${y - 4} q3.5,5 0,7 q-3.5,-2 0,-7 Z`} fill={CC.agua} opacity={0.7 * k} /> : null;
      })}
      {hb > 0 && Array.from({ length: 9 }, (_, i) => {
        const k = tramo(hb, i * 0.06, 0.5 + i * 0.05);
        if (k <= 0) return null;
        const ang = -Math.PI / 2 + (i - 4) * 0.13;
        return <circle key={i} cx={528 + Math.cos(ang) * 70 * k} cy={YM + 6 + Math.sin(ang) * 100 * k} r={3.6} fill={CC.hb} opacity={1 - tramo(k, 0.85, 1) * 0.4} />;
      })}
      <text x={512} y={100} textAnchor="end" className={s.protChico} style={{ fill: CC.hb }} opacity={L(5, 0.74, 0.84)}>hemoglobina</text>

      {rot && <text x={LUPA_W / 2} y={LUPA_H - 10} textAnchor="middle" className={rot.ok ? ls.lupaOk : s.pasoLupa} opacity={rotOp}>{rot.t}</text>}
    </g>
  );
}

// ─── Receptor: miastenia (bloqueo) o Graves (estímulo) ───────────────────────

function Receptor({ d, p }: { d: Extract<DatosProceso, { clase: 'receptor' }>; p: number }) {
  const ym = 170;
  const ab = easeOut(tramo(p, 0.12, 0.35));
  if (d.caso === 'miastenia') {
    const caida = tramo(p, 0.4, 0.7);
    const potencial = 0.95 - 0.6 * caida;
    return (
      <g>
        <Titulo texto="Miastenia gravis: el anticuerpo tapa el receptor" sub="Anticuerpos IgG contra el receptor de acetilcolina (AChR)" />
        <rect x={10} y={ym} width={330} height={14} className={s.bicapa} />
        {[70, 150, 230, 310].map((x, i) => {
          const internaliza = i === 3 && caida > 0.3;
          return (
            <g key={x} transform={`translate(${x},${ym + (internaliza ? 26 * tramo(caida, 0.3, 1) : 0)})`} opacity={internaliza ? 1 - 0.6 * tramo(caida, 0.3, 1) : 1}>
              <path d="M-10,-2 L-10,-22 Q0,-30 10,-22 L10,-2" className={s.achrLupa} />
              {i < 3 && <g transform={`translate(${(i - 1) * 4},${-50 - (1 - ab) * 50})`} opacity={ab}><Anticuerpo ab="IgG" d={44} color="#E8B21E" /></g>}
            </g>
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => { const q = tramo(p, 0.05 + i * 0.1, 0.4 + i * 0.1); const x = 60 + i * 60, y = 70 + q * 70; return <path key={i} d={`M${x},${y - 6} L${x + 6},${y} L${x},${y + 6} L${x - 6},${y} Z`} className={s.achLupa} opacity={q > 0.92 ? 0.3 : 1} />; })}
        <text x={20} y={74} className={ls.lupaNota}>ACh</text>
        <g transform="translate(372,72)">
          <text className={ls.lupaNota}>Potencial de placa</text>
          <rect y={12} width={40} height={140} rx={8} className={s.medidorFondo} />
          <rect y={12 + 140 * (1 - potencial)} width={40} height={140 * potencial} rx={8} className={potencial < 0.55 ? s.medidorBajo : s.medidorOk} />
          <line x1={-8} y1={12 + 140 * 0.45} x2={48} y2={12 + 140 * 0.45} stroke="#E5484D" strokeWidth={2} strokeDasharray="5 4" />
          <text x={52} y={12 + 140 * 0.45 + 4} className={s.ejeTxt}>umbral</text>
          {[['Bloquea el sitio de la ACh', 0.5], ['Entrecruza e internaliza receptores', 0.62], ['Fija complemento: daña los pliegues', 0.74]].map(([t, a], i) => <text key={i} x={64} y={60 + i * 26} className={s.tarjetaTxt} opacity={tramo(p, a as number, (a as number) + 0.12)}>• {t}</text>)}
        </g>
        {p > 0.88 && <text x={LUPA_W / 2} y={LUPA_H - 10} textAnchor="middle" className={ls.lupaResultado} fill="#E5484D" opacity={tramo(p, 0.88, 1)}>Debilidad que empeora con el esfuerzo</text>}
      </g>
    );
  }
  const k = (a: number) => tramo(p, a, a + 0.12);
  return (
    <g>
      <Titulo texto="Graves: el anticuerpo enciende el receptor" sub="IgG estimulante (TSI) contra el receptor de TSH" />
      <rect x={10} y={ym} width={240} height={14} className={s.bicapa} />
      <g transform={`translate(110,${ym})`}>
        <path d="M-10,-2 L-10,-22 Q0,-30 10,-22 L10,-2" className={s.tshrLupa} />
        <g transform={`translate(0,${-50 - (1 - ab) * 50})`} opacity={ab}><Anticuerpo ab="IgG" d={44} color="#E07A8A" /></g>
      </g>
      <Prot x={110} y={ym + 44} r={17} color="#5B6475" nombre="Gs" op={k(0.36)} />
      <Prot x={170} y={ym + 44} r={18} color="#3D8BD9" nombre="AC" op={k(0.46)} />
      {k(0.56) > 0 && <text x={196} y={ym + 50} className={s.cajaTxt} textAnchor="start" opacity={k(0.56)}>AMPc ↑</text>}
      <Caja x={290} y={70} w={270} h={44} texto="T3 / T4 ↑ → hipertiroidismo" sub="bocio difuso, exoftalmos, taquicardia" color="#D9881E" op={k(0.66)} k={k(0.66)} />
      <Caja x={290} y={128} w={270} h={44} texto="TSH ↓ (la hipófisis se frena)" sub="pero el anticuerpo no obedece al freno" color="#5B6475" op={k(0.78)} k={k(0.78)} />
      <Flecha x1={250} y1={150} x2={286} y2={96} q={k(0.66)} />
      {p > 0.9 && <text x={LUPA_W / 2} y={LUPA_H - 10} textAnchor="middle" className={ls.lupaOk} opacity={tramo(p, 0.9, 1)}>Lo contrario de la miastenia: estímulo sin lesión</text>}
    </g>
  );
}

// ─── Curva de precipitación (tamaño del complejo) ────────────────────────────

function Precipitacion({ p }: { p: number }) {
  const X0 = 40, Y0 = 214, W = 290, Hh = 120;
  const f = (x: number) => gauss(x, 0.42, 0.2);
  const q = easeInOut(tramo(p, 0.05, 0.45));
  const m = easeInOut(tramo(p, 0.5, 0.75));
  const xm = 0.42 + 0.26 * m;
  const Mini = ({ x, y, n, c }: { x: number; y: number; n: number; c: string }) => (
    <g transform={`translate(${x},${y})`}>{Array.from({ length: n }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / n) * (6 + n * 1.6); return <circle key={i} cx={Math.cos(a) * k} cy={Math.sin(a) * k} r={3.6} fill={i % 2 ? H.complejo : H.antigeno} />; })}<circle r={8 + n * 1.7} fill="none" stroke={c} strokeWidth={2} /></g>
  );
  return (
    <g>
      <Titulo texto="¿Qué complejo hace daño?" sub="Depende de la proporción entre antígeno y anticuerpo" />
      <rect x={X0} y={Y0 - Hh} width={W * 0.3} height={Hh} fill="#B0B8C6" opacity={0.12} />
      <rect x={X0 + W * 0.56} y={Y0 - Hh} width={W * 0.24} height={Hh} fill="#E5484D" opacity={0.12 * tramo(p, 0.5, 0.7)} />
      <Ejes x0={X0} y0={Y0} w={W} h={Hh} xRot="antígeno →" yRot="precipitado" marcas={[{ x: 0.15, t: 'exceso Ac' }, { x: 0.42, t: 'equivalencia' }, { x: 0.82, t: 'exceso Ag' }]} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={f} q={q} color={H.complejo} />
      {m > 0 && <g transform={`translate(${X0 + xm * W},${Y0 - f(xm) * Hh})`}><circle r={7} fill="#E5484D" /><line y1={7} y2={f(xm) * Hh} stroke="#E5484D" strokeWidth={1.5} strokeDasharray="3 3" /></g>}
      <g opacity={tramo(p, 0.4, 0.55)}><Mini x={360} y={92} n={9} c="#8A93A6" /><text x={392} y={88} className={s.tarjetaTxt}>Grandes: los retiran</text><text x={392} y={102} className={s.tarjetaTxt}>el bazo y el hígado</text></g>
      <g opacity={tramo(p, 0.62, 0.78)}><Mini x={360} y={150} n={4} c="#E5484D" /><text x={392} y={146} className={s.tarjetaNombre} style={{ fill: '#E5484D' }}>Medianos (exceso de Ag)</text><text x={392} y={160} className={s.tarjetaTxt}>circulan y se depositan</text></g>
      <g opacity={tramo(p, 0.74, 0.9)}><Mini x={360} y={206} n={2} c="#8A93A6" /><text x={392} y={202} className={s.tarjetaTxt}>Muy pequeños: casi no</text><text x={392} y={216} className={s.tarjetaTxt}>fijan complemento</text></g>
    </g>
  );
}

// ─── Enfermedad del suero: cronología ────────────────────────────────────────

function Suero({ p }: { p: number }) {
  const X0 = 50, Y0 = 218, W = 500, Hh = 140;
  const q = easeInOut(tramo(p, 0.08, 0.85));
  const ag = (x: number) => (x < 0.38 ? 0.95 - 0.5 * x : Math.max(0.05, 0.76 - (x - 0.38) * 3.2));
  const ac = (x: number) => (x < 0.45 ? 0.02 : Math.min(0.85, (x - 0.45) * 2.2));
  const ic = (x: number) => 0.62 * gauss(x, 0.5, 0.09);
  const c3 = (x: number) => 0.62 - 0.36 * gauss(x, 0.52, 0.1);
  return (
    <g>
      <Titulo texto="Enfermedad del suero: tres fases" sub="Una sola dosis grande de proteína extraña" />
      <rect x={X0 + 0.4 * W} y={Y0 - Hh} width={0.3 * W} height={Hh} className={s.bandaSintomas} opacity={tramo(p, 0.55, 0.7)} />
      {p > 0.6 && <text x={X0 + 0.55 * W} y={Y0 - Hh + 14} textAnchor="middle" className={s.ejeTxt} opacity={tramo(p, 0.6, 0.75)}>fiebre · urticaria · artralgias · proteinuria</text>}
      <Ejes x0={X0} y0={Y0} w={W} h={Hh} xRot="días" yRot="" marcas={[0, 4, 8, 12, 16, 20].map((d) => ({ x: d / 20, t: String(d) }))} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={ag} q={q} color="#4CB848" />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={ac} q={q} color={H.igg} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={ic} q={q} color={H.complejo} ancho={4} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={c3} q={q} color="#E5484D" dash="6 5" />
      {[['Antígeno', '#4CB848'], ['Anticuerpo libre', H.igg], ['Complejos', H.complejo], ['C3 sérico', '#E5484D']].map(([t, c], i) => (
        <g key={t} transform={`translate(${X0 + 8 + i * 126},${LUPA_H - 10})`} opacity={tramo(p, 0.1 + i * 0.12, 0.25 + i * 0.12)}><rect y={-8} width={14} height={4} fill={c} /><text x={20} className={s.ejeTxt}>{t}</text></g>
      ))}
    </g>
  );
}

// ─── Reacción de tuberculina ──────────────────────────────────────────────────

function Tuberculina({ p }: { p: number }) {
  const X0 = 50, Y0 = 210, W = 500, Hh = 128;
  const q = easeInOut(tramo(p, 0.08, 0.8));
  const ind = (x: number) => (x < 0.1 ? 0 : x < 0.3 ? Math.pow((x - 0.1) / 0.2, 1.6) * 0.9 : x < 0.75 ? 0.9 + 0.08 * Math.sin((x - 0.3) * 7) : Math.max(0.2, 0.92 - (x - 0.75) * 2.4));
  const roncha = (x: number) => 0.62 * gauss(x, 0.012, 0.012);
  return (
    <g>
      <Titulo texto="PPD: la induración tarda en llegar" sub="Intradérmica en un sensibilizado (TB o BCG)" />
      <rect x={X0 + 0.25 * W} y={Y0 - Hh} width={0.5 * W} height={Hh} className={s.bandaLectura} opacity={tramo(p, 0.7, 0.85)} />
      {p > 0.72 && <text x={X0 + 0.5 * W} y={Y0 - Hh + 14} textAnchor="middle" className={s.ejeTxt}>se lee a las 48–72 h (en mm de induración)</text>}
      <Ejes x0={X0} y0={Y0} w={W} h={Hh} xRot="horas" yRot="induración" marcas={[0, 24, 48, 72, 96].map((h) => ({ x: h / 96, t: String(h) }))} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={roncha} q={Math.min(1, q * 8)} color={H.tipo1} />
      <Curva x0={X0} y0={Y0} w={W} h={Hh} f={ind} q={q} color={H.tipo4} ancho={4} />
      {q > 0.05 && <text x={X0 + 18} y={Y0 - 0.64 * Hh} className={s.ejeTxt} opacity={tramo(q, 0.05, 0.15)} style={{ fill: H.tipo1 }}>roncha tipo I: 15 min</text>}
      {q > 0.3 && <text x={X0 + 0.18 * W} y={Y0 - 0.3 * Hh} className={s.ejeTxt} opacity={tramo(q, 0.3, 0.45)} style={{ fill: H.tipo4 }}>empieza a las 8–12 h</text>}
    </g>
  );
}

// ─── Diferenciación del CD4 ───────────────────────────────────────────────────

function Diferenciacion({ d, p }: { d: Extract<DatosProceso, { clase: 'diferenciacion' }>; p: number }) {
  const ramas = [
    { id: 'th1' as const, cit: 'IL-12', nombre: 'Th1', sale: 'IFN-γ', efecto: 'macrófagos activados', color: H.th1, y: 88 },
    { id: 'th17' as const, cit: 'IL-1 · IL-6 · IL-23', nombre: 'Th17', sale: 'IL-17 · IL-22', efecto: 'neutrófilos', color: H.th17, y: 152 },
    { id: 'th2' as const, cit: 'IL-4', nombre: 'Th2', sale: 'IL-4 · IL-5 · IL-13', efecto: 'IgE, eosinófilos, moco', color: H.th2, y: 216 },
  ];
  return (
    <g>
      <Titulo texto="¿Qué linfocito T sale del CD4 naive?" sub="Lo decide la citocina de la célula presentadora" />
      <Prot x={64} y={152} r={34} color="#8A93A6" nombre="CD4 naive" op={tramo(p, 0, 0.1)} />
      {ramas.map((r, i) => {
        const k = tramo(p, 0.12 + i * 0.2, 0.32 + i * 0.2);
        const on = d.resaltar.includes(r.id);
        return (
          <g key={r.id} opacity={k * (on || !d.resaltar.length ? 1 : 0.32)}>
            <Flecha x1={100} y1={152} x2={196} y2={r.y} q={k} color={r.color} />
            <text x={112} y={r.y + (r.y < 152 ? -8 : r.y > 152 ? 18 : -10)} className={s.ejeTxt} style={{ fill: r.color }}>{r.cit}</text>
            <Prot x={226} y={r.y} r={26} color={r.color} nombre={r.nombre} />
            <Flecha x1={256} y1={r.y} x2={316} y2={r.y} q={tramo(k, 0.4, 1)} color={r.color} />
            <text x={322} y={r.y - 3} className={s.tarjetaNombre} style={{ fill: r.color }} opacity={tramo(k, 0.5, 1)}>{r.sale}</text>
            <text x={322} y={r.y + 13} className={s.tarjetaTxt} opacity={tramo(k, 0.6, 1)}>→ {r.efecto}</text>
          </g>
        );
      })}
    </g>
  );
}

// ─── Citotoxicidad del CD8 ────────────────────────────────────────────────────

function Citotoxicidad({ p }: { p: number }) {
  const gran = easeInOut(tramo(p, 0.12, 0.3)), poro = tramo(p, 0.3, 0.46), grz = easeInOut(tramo(p, 0.46, 0.62)), casp = tramo(p, 0.62, 0.8), apo = tramo(p, 0.8, 1);
  return (
    <g>
      <Titulo texto="El CD8 mata por contacto" sub="Reconoce el péptido en el MHC I de la célula diana" />
      <circle cx={110} cy={154} r={64} fill="#F7C9D8" stroke="#C0396E" strokeWidth={3} />
      <circle cx={100} cy={154} r={34} fill="#D24E80" opacity={0.75} />
      <text x={110} y={240} textAnchor="middle" className={s.tarjetaNombre} style={{ fill: H.tipo4 }}>CTL CD8+</text>
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={130 + gran * 36 + (i % 2) * 10} cy={128 + i * 10} r={6} fill="#C0397A" stroke="#fff" strokeWidth={1.2} opacity={1 - tramo(poro, 0.4, 1) * 0.7} />)}
      <g transform={`translate(${352 - apo * 6},154) scale(${1 - 0.25 * apo})`}>
        <rect x={-80} y={-70} width={160} height={140} rx={30} fill="#BFE6EE" stroke="#2C8FA6" strokeWidth={3} />
        <circle cx={10} r={32} fill="#5FB5C9" opacity={0.85} />
        {apo > 0.2 && [[-60, -50], [64, -30], [-40, 60], [58, 52]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10 * apo} fill="#BFE6EE" stroke="#2C8FA6" strokeWidth={2} />)}
      </g>
      <text x={352} y={240} textAnchor="middle" className={s.tarjetaNombre} style={{ fill: '#2C8FA6' }}>Célula diana</text>
      <line x1={174} y1={154} x2={272} y2={154} stroke="#8A93A6" strokeWidth={2} strokeDasharray="4 4" />
      <text x={186} y={146} className={s.ejeTxt}>TCR – MHC I</text>
      {poro > 0 && <rect x={268} y={136} width={10} height={36} rx={3} fill="#C0397A" opacity={poro} />}
      {poro > 0.4 && <text x={210} y={186} className={ls.lupaNota} opacity={poro}>perforina: poro</text>}
      {grz > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${280 + grz * 50},${142 + i * 12} l6,6 l-6,6 l-6,-6 Z`} fill="#8A4FCF" />)}
      {grz > 0.4 && <text x={300} y={122} className={ls.lupaNota} opacity={grz}>granzimas</text>}
      <Caja x={452} y={78} w={112} h={40} texto="Caspasas" sub="se activan" color="#E5484D" op={casp} k={casp} />
      <Caja x={452} y={128} w={112} h={40} texto="Apoptosis" sub="de la diana" color="#5B6475" op={apo} k={apo} />
      <text x={18} y={LUPA_H - 10} className={s.tarjetaTxt} opacity={tramo(p, 0.6, 0.8)}>Otra vía: FasL del CTL se une a Fas de la diana → caspasa 8 → apoptosis. El CD8 también secreta IFN-γ.</text>
    </g>
  );
}

// ─── Hapteno ──────────────────────────────────────────────────────────────────

function Hapteno({ d, p }: { d: Extract<DatosProceso, { clase: 'hapteno' }>; p: number }) {
  const une = easeInOut(tramo(p, 0.05, 0.3)), neo = tramo(p, 0.3, 0.45), sig = tramo(p, 0.45, 0.7), fin = tramo(p, 0.7, 0.95);
  return (
    <g>
      <Titulo texto="Un hapteno vuelve extraña a una proteína propia" sub={`${d.hapteno} solo no es inmunógeno: se une a ${d.portador}`} />
      <g transform="translate(120,150)">
        <path d="M-60,0 C-60,-46 -10,-58 24,-40 C64,-24 66,34 30,46 C-6,60 -60,40 -60,0 Z" fill="#E7E1F6" stroke="#7C5CD6" strokeWidth={2.5} />
        <text y={74} textAnchor="middle" className={s.tarjetaTxt}>{d.portador}</text>
        <g transform={`translate(${56 + (1 - une) * 70},${-36 - (1 - une) * 40})`}><path d="M0,-11 L10,-4 L7,9 L-7,9 L-10,-4 Z" fill="#E0702A" /></g>
        <text x={74 + (1 - une) * 70} y={-58 - (1 - une) * 40} className={s.tarjetaNombre} style={{ fill: '#E0702A' }}>{d.hapteno}</text>
        {neo > 0 && <circle r={78} fill="none" stroke="#E5484D" strokeWidth={2.5} strokeDasharray="6 5" opacity={neo} />}
      </g>
      {neo > 0.4 && <text x={50} y={248} className={ls.lupaNota} opacity={neo}>neoantígeno</text>}
      <Flecha x1={214} y1={150} x2={300} y2={150} q={sig} />
      {d.efector === 'T' ? (
        <g opacity={fin}>
          <Caja x={306} y={80} w={258} h={44} texto="La célula presentadora lo procesa" sub="péptido + hapteno en el MHC" color="#E0A24A" op={fin} k={fin} />
          <Caja x={306} y={134} w={258} h={44} texto="El linfocito T lo reconoce" sub="Th1 → IFN-γ → inflamación (tipo IV)" color={H.tipo4} op={tramo(fin, 0.3, 1)} k={fin} />
        </g>
      ) : (
        <g opacity={fin}>
          <Caja x={306} y={80} w={258} h={44} texto="El linfocito B hace IgG" sub="contra el complejo fármaco-proteína" color={H.igg} op={fin} k={fin} />
          <Caja x={306} y={134} w={258} h={44} texto="La célula queda opsonizada" sub="fagocitosis en el bazo (tipo II)" color={H.tipo2} op={tramo(fin, 0.3, 1)} k={fin} />
        </g>
      )}
    </g>
  );
}

// ─── Isoinmunización Rh ──────────────────────────────────────────────────────

function Rh({ p }: { p: number }) {
  const paneles = [
    { t: '1.er embarazo', s: 'Madre Rh− · feto Rh+', d: 'En el parto pasan hematíes fetales: la madre hace anti-D (IgM) y memoria.', c: '#8A93A6' },
    { t: '2.º embarazo', s: 'Feto Rh+ otra vez', d: 'La IgG anti-D cruza la placenta y opsoniza los hematíes fetales: hemólisis, anemia, ictericia, hidrops.', c: '#E5484D' },
    { t: 'Prevención', s: 'Inmunoglobulina anti-D', d: 'A la madre Rh− (semana 28 y tras el parto): elimina los hematíes fetales antes de que la sensibilicen.', c: '#1F9A6A' },
  ];
  return (
    <g>
      <Titulo texto="Enfermedad hemolítica del feto y del recién nacido" sub="La IgG es el único anticuerpo que cruza la placenta" />
      {paneles.map((pn, i) => {
        const k = tramo(p, 0.08 + i * 0.28, 0.3 + i * 0.28);
        return (
          <g key={pn.t} opacity={k} transform={`translate(${18 + i * 186},${66 + (1 - easeOut(k)) * 10})`}>
            <rect width={174} height={182} rx={12} className={s.tarjeta} />
            <rect width={174} height={6} rx={3} fill={pn.c} />
            <text x={12} y={30} className={s.tarjetaNombre} style={{ fill: pn.c }}>{pn.t}</text>
            <text x={12} y={46} className={s.tarjetaTxt}>{pn.s}</text>
            {lineas(pn.d, 25).map((l, j) => <text key={j} x={12} y={72 + j * 15} className={s.tarjetaTxt}>{l}</text>)}
          </g>
        );
      })}
    </g>
  );
}

// ─── Lámina histológica ───────────────────────────────────────────────────────

function Lamina({ d, p }: { d: Extract<DatosProceso, { clase: 'lamina' }>; p: number }) {
  const m = IMAGENES[d.img];
  const src = srcImagen(d.img);
  const alto = 196;
  const ancho = m ? Math.min(330, (m.w / m.h) * alto) : 260;
  const altoR = m ? (ancho / m.w) * m.h : alto;
  const x0 = 14, y0 = 56 + (alto - altoR) / 2;
  const k = easeOut(tramo(p, 0, 0.2));
  return (
    <g>
      <Titulo texto={d.titulo} sub={d.sub} />
      <g opacity={k}>
        {src ? <image href={src} x={x0} y={y0} width={ancho} height={altoR} preserveAspectRatio="xMidYMid slice" /> : <rect x={x0} y={y0} width={ancho} height={altoR} fill="#EEE" />}
        <rect x={x0} y={y0} width={ancho} height={altoR} rx={4} fill="none" stroke="var(--linea)" strokeWidth={1.5} />
      </g>
      {d.rotulos.map((r, i) => {
        const q = tramo(p, 0.25 + i * 0.15, 0.4 + i * 0.15);
        if (q <= 0) return null;
        const px = x0 + r.x * ancho, py = y0 + r.y * altoR;
        const tx = x0 + ancho + 22, ty = 78 + i * (170 / Math.max(1, d.rotulos.length));
        return (
          <g key={r.texto} opacity={q}>
            <circle cx={px} cy={py} r={9} fill="none" stroke="#FFD23F" strokeWidth={3} />
            <line x1={px + 9} y1={py} x2={tx - 6} y2={ty - 4} stroke="#FFD23F" strokeWidth={2} />
            {lineas(r.texto, Math.floor((LUPA_W - tx - 10) / 7)).map((l, j) => <text key={j} x={tx} y={ty + j * 15} className={s.tarjetaTxt}>{l}</text>)}
          </g>
        );
      })}
      <text x={x0} y={LUPA_H - 4} className={s.fuenteLamina}>Robbins, Patología humana</text>
    </g>
  );
}

export default function Proceso({ datos, p }: { datos: DatosProceso; p: number }): ReactNode {
  switch (datos.clase) {
    case 'csr':
    case 'factores':
      return <ProcesoLinfocitos datos={datos as DatosLinfocitos} p={p} />;
    case 'lista': return <Lista d={datos} p={p} />;
    case 'fceri': return <Fceri p={p} />;
    case 'araquidonico': return <Araquidonico p={p} />;
    case 'mediadores': return <Mediadores p={p} />;
    case 'cinetica': return <Cinetica d={datos} p={p} />;
    case 'complemento': return <Complemento d={datos} p={p} />;
    case 'receptor': return <Receptor d={datos} p={p} />;
    case 'precipitacion': return <Precipitacion p={p} />;
    case 'suero': return <Suero p={p} />;
    case 'tuberculina': return <Tuberculina p={p} />;
    case 'diferenciacion': return <Diferenciacion d={datos} p={p} />;
    case 'citotoxicidad': return <Citotoxicidad p={p} />;
    case 'hapteno': return <Hapteno d={datos} p={p} />;
    case 'rh': return <Rh p={p} />;
    case 'lamina': return <Lamina d={datos} p={p} />;
  }
}
