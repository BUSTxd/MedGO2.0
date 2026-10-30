'use client';
// Láminas del capítulo 9 («Nefritis lúpica»):
// · `capas`: un asa capilar del glomérulo en corte (endotelio fenestrado,
//   membrana basal, podocitos con pedicelos, mesangio) y los tres sitios de
//   depósito (mesangial, subendotelial, subepitelial); luego la inflamación.
// · `fullhouse`: la inmunofluorescencia «casa llena» (IgG, IgA, IgM, C3, C1q).
// · `clases`: la fila de las seis clases y un glomérulo grande que muestra lo de
//   cada una (proliferación, depósitos, asas de alambre, trombos hialinos,
//   semilunas, spikes, esclerosis).

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { clamp, easeBack, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
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

// ─── Asa capilar en corte ─────────────────────────────────────────────────────

const C = { x: 560, y: 520, luz: 190, mbg: 214 };

const AsaFija = memo(function AsaFija() {
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={1080} className={s.espacioUrinario} />
      {/* Mesangio: a la izquierda, donde se sostiene el asa */}
      <path d={`M${C.x - C.mbg - 10},${C.y - 120} C${C.x - 330},${C.y - 100} ${C.x - 360},${C.y + 100} ${C.x - C.mbg - 10},${C.y + 120} Z`} className={s.mesangio} />
      <ellipse cx={C.x - 290} cy={C.y} rx={36} ry={24} className={s.nucleoMes} />
      {/* Podocitos con sus pedicelos */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = -1.15 + (i / 29) * 2.3;
        return <circle key={i} cx={C.x + Math.cos(a) * (C.mbg + 14)} cy={C.y + Math.sin(a) * (C.mbg + 14)} r={9} className={s.pedicelo} />;
      })}
      {[-0.7, 0.05, 0.75].map((a, j) => <ellipse key={j} cx={C.x + Math.cos(a) * (C.mbg + 70)} cy={C.y + Math.sin(a) * (C.mbg + 70)} rx={60} ry={40} className={s.podocito} transform={`rotate(${(a * 180) / Math.PI} ${C.x + Math.cos(a) * (C.mbg + 70)} ${C.y + Math.sin(a) * (C.mbg + 70)})`} />)}
      <circle cx={C.x} cy={C.y} r={C.mbg} className={s.mbg} />
      <circle cx={C.x} cy={C.y} r={C.luz} className={s.luzCapilar} />
      <circle cx={C.x} cy={C.y} r={C.luz + 4} className={s.endotelioFen} />
      {[[-60, -40], [40, -70], [70, 40], [-40, 60], [0, 0]].map(([dx, dy], i) => <g key={i} transform={`translate(${C.x + dx},${C.y + dy})`}><ellipse rx={30} ry={24} className={s.hematie} /><ellipse rx={13} ry={9} className={s.hematieCentro} /></g>)}
    </g>
  );
});

const ROT_ASA: { p: string; t: string; x: number; y: number; px: number; py: number; fin: 'start' | 'end' }[] = [
  { p: 'capilar', t: 'Luz del capilar', x: 560, y: 260, px: 560, py: 420, fin: 'start' },
  { p: 'endotelioL', t: 'Endotelio fenestrado', x: 960, y: 250, px: C.x + 130, py: C.y - 140, fin: 'start' },
  { p: 'mbgL', t: 'Membrana basal glomerular', x: 960, y: 330, px: C.x + 160, py: C.y - 142, fin: 'start' },
  { p: 'podoL', t: 'Podocitos (pedicelos)', x: 960, y: 420, px: C.x + 220, py: C.y - 60, fin: 'start' },
  { p: 'mesangioL', t: 'Mesangio', x: 120, y: 330, px: C.x - 290, py: C.y - 60, fin: 'start' },
];

export function FondoCapas({ t }: { t: T }) {
  const me = v(t, 'mesangial'), se = v(t, 'subendotelial'), sp = v(t, 'subepitelial'), la = v(t, 'lado'), pr = v(t, 'pregunta');
  const inf = v(t, 'inflamaG'), es = v(t, 'esclerosisG');
  return (
    <g>
      <AsaFija />
      <text x={1560} y={940} textAnchor="end" className={s.lEtiquetaMayus}>Espacio urinario</text>
      {ROT_ASA.map((r) => {
        const k = v(t, r.p);
        if (k <= 0.001) return null;
        const yy = r.p === 'capilar' ? r.y : r.y;
        return (
          <g key={r.p} opacity={k}>
            <line x1={r.px} y1={r.py} x2={r.p === 'capilar' ? r.x : r.x - 10} y2={yy + (r.p === 'capilar' ? 12 : -6)} className={s.guia} />
            <text x={r.p === 'capilar' ? r.x : r.x} y={yy} textAnchor={r.p === 'capilar' ? 'middle' : 'start'} className={s.lEtiqueta}>{r.t}</text>
          </g>
        );
      })}
      {/* Depósitos */}
      {me > 0.001 && Array.from({ length: 10 }, (_, i) => {
        const k = tramo(me, i * 0.06, 0.4 + i * 0.06);
        return <circle key={i} cx={C.x - 300 + hash(i, 1) * 80} cy={C.y - 70 + hash(i, 2) * 140} r={9 * k} className={s.depositoG} />;
      })}
      {se > 0.001 && Array.from({ length: 12 }, (_, i) => {
        const a = -1.1 + (i / 11) * 2.2, k = tramo(se, i * 0.05, 0.4 + i * 0.05);
        return <ellipse key={i} cx={C.x + Math.cos(a) * (C.luz + 12)} cy={C.y + Math.sin(a) * (C.luz + 12)} rx={13 * k} ry={8 * k} className={s.depositoG} transform={`rotate(${(a * 180) / Math.PI + 90} ${C.x + Math.cos(a) * (C.luz + 12)} ${C.y + Math.sin(a) * (C.luz + 12)})`} />;
      })}
      {sp > 0.001 && Array.from({ length: 10 }, (_, i) => {
        const a = -1.0 + (i / 9) * 2.0, k = tramo(sp, i * 0.05, 0.4 + i * 0.05);
        return <circle key={i} cx={C.x + Math.cos(a) * (C.mbg + 13)} cy={C.y + Math.sin(a) * (C.mbg + 13)} r={10 * k} className={s.depositoG} />;
      })}
      {me > 0.5 && <text x={C.x - 300} y={C.y + 150} textAnchor="middle" className={s.etiquetaDep} opacity={tramo(me, 0.5, 1)}>mesangial</text>}
      {se > 0.5 && <text x={C.x + 40} y={C.y + 152} textAnchor="middle" className={s.etiquetaDep} opacity={tramo(se, 0.5, 1)}>subendotelial</text>}
      {sp > 0.5 && <text x={C.x + 300} y={C.y + 240} textAnchor="middle" className={s.etiquetaDep} opacity={tramo(sp, 0.5, 1)}>subepitelial</text>}
      <Chip x={800} y={110} w={620} txt="¿En qué capa se depositan los complejos?" k={pr} clase={s.chipPista} />
      {la > 0.001 && (
        <g>
          <Chip x={1200} y={600} w={600} txt="Lado de la sangre: inflaman (leucocitos)" k={tramo(la, 0, 0.5)} clase={s.chipPista} />
          <Chip x={1200} y={700} w={600} txt="Lado del podocito: dañan el filtro" k={tramo(la, 0.5, 1)} />
        </g>
      )}
      {inf > 0.001 && (
        <g opacity={inf}>
          {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={C.x - 330 + hash(i, 4) * 120} cy={C.y - 90 + hash(i, 5) * 180} rx={18} ry={13} className={s.nucleoMes} />)}
          <circle cx={C.x} cy={C.y} r={C.mbg + 6} className={s.mbgGruesa} />
        </g>
      )}
      {es > 0.001 && <path d={`M${C.x - C.mbg - 10},${C.y - 120} C${C.x - 330},${C.y - 100} ${C.x - 360},${C.y + 100} ${C.x - C.mbg - 10},${C.y + 120} Z`} className={s.esclerosisG} opacity={es * 0.85} />}
    </g>
  );
}

// ─── Inmunofluorescencia «full house» ─────────────────────────────────────────

const IF = ['IgG', 'IgA', 'IgM', 'C3', 'C1q'];

function GlomIf({ x, y, k, brillo }: { x: number; y: number; k: number; brillo: number }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={k}>
      <rect x={-130} y={-130} width={260} height={260} rx={20} className={s.panelIf} />
      {Array.from({ length: 60 }, (_, i) => {
        const a = hash(i, 1) * TAU, r = Math.sqrt(hash(i, 2)) * 95;
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={4 + hash(i, 3) * 4} fill="#6FE08A" opacity={0.5 + 0.5 * brillo} />;
      })}
      <circle r={110} fill="none" stroke="#2A4A32" strokeWidth={3} />
    </g>
  );
}

export function FondoFullHouse({ t }: { t: T }) {
  const fh = v(t, 'fh'), vi = v(t, 'viaClasica'), pi = v(t, 'piensa');
  return (
    <g>
      <text x={800} y={140} textAnchor="middle" className={s.tituloSeccion}>Inmunofluorescencia: «full house»</text>
      {IF.map((n, i) => {
        const k = clamp(fh - i);
        const x = 220 + i * 290;
        return (
          <g key={n}>
            <GlomIf x={x} y={420} k={k} brillo={1} />
            {k > 0.001 && <text x={x} y={600} textAnchor="middle" className={n === 'C1q' && vi > 0.5 ? `${s.tituloSeccion} ${s.textoLupus}` : s.tituloSeccion} opacity={k}>{n}</text>}
          </g>
        );
      })}
      {vi > 0.001 && (
        <g opacity={vi}>
          <rect x={1380 - 145} y={420 - 145} width={290} height={290} rx={26} fill="none" stroke={L.lupus} strokeWidth={6} />
          <text x={1380} y={650} textAnchor="middle" className={s.lEtiquetaRoja}>C1q = vía clásica</text>
        </g>
      )}
      <Chip x={800} y={800} w={680} txt="Todo positivo a la vez → piensa en lupus" k={pi} clase={s.chipPista} />
    </g>
  );
}

// ─── Las seis clases ──────────────────────────────────────────────────────────

type Rasgos = { mes?: number; dep?: number; sub?: number; epi?: number; asas?: number; trombos?: number; semiluna?: number; escl?: number; gruesa?: number };
const PRESET: Rasgos[] = [
  { dep: 1 },
  { mes: 1, dep: 1 },
  { mes: 1, sub: 0.5 },
  { mes: 1, sub: 1, asas: 0.6 },
  { epi: 1, gruesa: 1 },
  { escl: 1 },
];

function Glomerulo({ x, y, r, f }: { x: number; y: number; r: number; f: Rasgos }) {
  const asas = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * TAU + 0.3; return { x: Math.cos(a) * r * 0.42, y: Math.sin(a) * r * 0.42 }; });
  const ra = r * 0.24;
  const escl = f.escl ?? 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} className={s.bowman} />
      {(f.semiluna ?? 0) > 0.001 && <path d={`M${-r * 0.95},${-r * 0.3} A${r * 0.98},${r * 0.98} 0 0 1 ${r * 0.2},${-r * 0.96} L${r * 0.1},${-r * 0.78} A${r * 0.8},${r * 0.8} 0 0 0 ${-r * 0.78},${-r * 0.22} Z`} className={s.semiluna} opacity={f.semiluna} />}
      <circle r={r * 0.78} className={s.ovilloG} opacity={1 - escl * 0.7} />
      {asas.map((p, i) => (
        <g key={i} opacity={1 - escl}>
          <circle cx={p.x} cy={p.y} r={ra} className={(f.asas ?? 0) > 0.3 && i % 2 === 0 ? s.asaAlambre : s.asaG} style={(f.gruesa ?? 0) > 0.3 ? { strokeWidth: 6 } : undefined} />
          {(f.trombos ?? 0) > 0.3 && i % 3 === 0 && <circle cx={p.x} cy={p.y} r={ra * 0.7} className={s.tromboHialino} opacity={f.trombos} />}
          {(f.sub ?? 0) > 0.001 && i % 2 === 0 && <circle cx={p.x} cy={p.y} r={ra * 0.85} className={s.depositoAnillo} opacity={f.sub} />}
          {(f.epi ?? 0) > 0.001 && Array.from({ length: 5 }, (_, j) => { const a = (j / 5) * TAU; return <circle key={j} cx={p.x + Math.cos(a) * ra * 1.12} cy={p.y + Math.sin(a) * ra * 1.12} r={ra * 0.14} className={s.depositoG} opacity={f.epi} />; })}
        </g>
      ))}
      <circle r={r * (0.16 + 0.1 * (f.mes ?? 0))} className={s.mesangio} opacity={1 - escl} />
      {(f.mes ?? 0) > 0.001 && Array.from({ length: 6 }, (_, j) => { const a = (j / 6) * TAU; return <circle key={j} cx={Math.cos(a) * r * 0.13} cy={Math.sin(a) * r * 0.13} r={r * 0.045} className={s.nucleoMes} opacity={f.mes} />; })}
      {(f.dep ?? 0) > 0.001 && Array.from({ length: 6 }, (_, j) => { const a = (j / 6) * TAU + 0.5; return <circle key={j} cx={Math.cos(a) * r * 0.2} cy={Math.sin(a) * r * 0.2} r={r * 0.035} className={s.depositoG} opacity={f.dep} />; })}
      {escl > 0.001 && <circle r={r * 0.7} className={s.esclerosisG} opacity={escl} />}
    </g>
  );
}

const NUM = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function FondoClases({ t }: { t: T }) {
  const fo = v(t, 'focoClase');
  const grande: Rasgos = {
    mes: v(t, 'gMes'), dep: v(t, 'gDep'), sub: v(t, 'gSub'), epi: v(t, 'gEpi'), asas: v(t, 'gAsas'),
    trombos: v(t, 'gTrombos'), semiluna: v(t, 'gSemiluna'), escl: v(t, 'gEscl'), gruesa: v(t, 'gGruesa'),
  };
  const sp = v(t, 'spikes');
  return (
    <g>
      {NUM.map((n, i) => {
        const k = v(t, `clase${i + 1}`);
        if (k <= 0.001) return null;
        const x = 180 + i * 248, act = clamp(1 - Math.abs(fo - (i + 1)));
        return (
          <g key={n} opacity={k * (0.45 + 0.55 * Math.max(act, fo === 0 ? 1 : 0))}>
            <Glomerulo x={x} y={220} r={88} f={PRESET[i]} />
            {act > 0.5 && <circle cx={x} cy={220} r={100} fill="none" stroke={L.rinon} strokeWidth={5} />}
            <text x={x} y={345} textAnchor="middle" className={s.tituloSeccion}>{n}</text>
          </g>
        );
      })}
      {v(t, 'grande') > 0.001 && (
        <g opacity={v(t, 'grande')}>
          <Glomerulo x={380} y={700} r={230} f={grande} />
          {grande.asas! > 0.5 && <text x={380} y={960} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(grande.asas!, 0.5, 1)}>asas de alambre</text>}
          {grande.trombos! > 0.5 && <text x={650} y={600} className={s.lEtiquetaRoja} opacity={tramo(grande.trombos!, 0.5, 1)}>trombos hialinos</text>}
          {grande.semiluna! > 0.5 && <text x={180} y={440} className={s.lEtiquetaRoja} opacity={tramo(grande.semiluna!, 0.5, 1)}>semiluna</text>}
        </g>
      )}
      {sp > 0.001 && (
        <g opacity={sp} transform="translate(700,820)">
          <rect x={-90} y={-90} width={240} height={150} rx={16} className={s.panelPlata} />
          <path d="M-70,10 L130,10" className={s.mbgPlata} />
          {Array.from({ length: 8 }, (_, j) => <path key={j} d={`M${-60 + j * 25},10 L${-60 + j * 25},${-22 * easeOut(sp)}`} className={s.mbgPlata} />)}
          <text x={30} y={48} textAnchor="middle" className={s.lSub}>plata: «spikes»</text>
        </g>
      )}
    </g>
  );
}
