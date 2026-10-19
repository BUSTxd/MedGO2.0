'use client';
// Tejidos de fondo del laboratorio «Hipersensibilidad». Cada uno es un dibujo
// que depende de sus PARÁMETROS (`t`, 0–1, los anima la acción `tejido`) y del
// `reloj` (ms acumulados: cilios que baten, hematíes que fluyen, potenciales
// que suben por el nervio). Las medidas salen de `zonas.ts`, las mismas que usa
// el motor para el encuadre y los datos para colocar las células.
//
//   mucosa    epitelio respiratorio, vénula, glándula, nervio, músculo liso,
//             corte del bronquio y (con `ganglio`) el ganglio de drenaje
//   cuerpo    silueta con piel, laringe, bronquios, corazón e intestino + monitor
//   sangre    vaso con hematíes; con `placenta`, sangre materna y capilar fetal
//   glomerulo asa capilar con membrana basal, podocitos y el alvéolo
//   placa     placa motora (receptores de ACh) y folículo tiroideo (TSHR)
//   vaso      arteriola en corte (íntima, media, adventicia) para los complejos
//   piel      epidermis por estratos y dermis con vénulas
//   granuloma ganglio con el granuloma que se arma por capas

import { memo, type ReactNode } from 'react';
import type { Fondo } from '@/lib/data/hipersensibilidad/tipos';
import { CUERPO, GLOMERULO, GRANULOMA, MUCOSA, PIEL, PLACA, SANGRE, VASO } from '@/lib/data/hipersensibilidad/zonas';
import { hash } from '@/lib/hipersensibilidad/motor';
import { Anticuerpo, DibujoCelula } from './Celulas';
import s from '@/styles/hipersensibilidad.module.css';

type T = Record<string, number>;
const v = (t: T, k: string) => t[k] ?? 0;
const ciclo = (reloj: number, periodo: number, desfase = 0) => (((reloj / periodo + desfase) % 1) + 1) % 1;

function Hematie({ x, y, rot = 0, k = 1 }: { x: number; y: number; rot?: number; k?: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${k})`}>
      <ellipse rx={15} ry={10} className={s.hematie} />
      <ellipse rx={7} ry={3.6} className={s.hematieCentro} />
    </g>
  );
}

// ─── Mucosa respiratoria ──────────────────────────────────────────────────────

function Mucosa({ t, reloj }: { t: T; reloj: number }) {
  const { luz, epitelio, venula: V, glandula: G, nervio: N, musculo: M, bronquio: B, ganglio: GG } = MUCOSA;
  const vaso = v(t, 'vasodilatacion'), fuga = v(t, 'fuga'), edema = v(t, 'edema'), esp = v(t, 'espasmo'), moco = v(t, 'moco');
  const dano = v(t, 'dano'), act = v(t, 'activacion'), inf = v(t, 'infiltrado'), prur = v(t, 'prurito'), gang = v(t, 'ganglio');
  const ry = V.ry * (1 + 0.5 * vaso);
  const celulas = 32;
  return (
    <g className={s.fondo}>
      <defs>
        <clipPath id="hs-clipVenula"><ellipse cx={V.cx} cy={V.cy} rx={V.rx - 8} ry={ry - 8} /></clipPath>
      </defs>
      <rect x={-800} y={-800} width={3200} height={800 + luz} className={s.luzAerea} />
      <text x={24} y={52} className={s.rotuloTejido}>Luz de la vía aérea</text>
      {/* Lámina propia, con edema que la aclara y separa las fibras */}
      <rect x={-800} y={epitelio} width={3200} height={2000} className={s.laminaPropia} />
      <rect x={-800} y={epitelio} width={3200} height={M.y0 - epitelio} className={s.edema} opacity={0.45 * edema} />
      {Array.from({ length: 13 }, (_, i) => {
        const y = 300 + i * 42 + edema * (i - 6) * 4;
        return <path key={i} d={`M-40,${y} C200,${y - 14} 420,${y + 16} 640,${y} S1000,${y - 12} 1240,${y + 4} S1560,${y + 10} 1700,${y}`} className={s.colagenoFibra} />;
      })}
      {/* Gotas de plasma que salen de la vénula */}
      {fuga > 0.02 && Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2 + 0.2;
        const d = ciclo(reloj, 2600, hash(i, 2)) * 120 * fuga;
        return <circle key={i} cx={V.cx + Math.cos(a) * (V.rx * 0.8 + d * 1.6)} cy={V.cy + Math.sin(a) * (ry + d)} r={5} className={s.gotaPlasma} opacity={fuga * (1 - d / 140)} />;
      })}
      {/* Epitelio cilíndrico ciliado con células caliciformes */}
      {Array.from({ length: celulas }, (_, i) => {
        const x = i * 50;
        const cae = hash(i, 5) < dano * 0.42;
        const dy = cae ? -70 * dano - 20 : 0;
        const rot = cae ? (hash(i, 6) - 0.5) * 50 * dano : 0;
        const caliciforme = i % 4 === 2;
        return (
          <g key={i} transform={`translate(${x + 25},${luz + dy}) rotate(${rot})`} opacity={cae ? 1 - 0.5 * dano : 1}>
            <rect x={-23} y={0} width={46} height={epitelio - luz - 4} rx={8} className={caliciforme ? s.caliciforme : s.epiCelula} />
            {caliciforme ? (
              <g>
                <path d="M-15,8 Q0,-4 15,8 L13,52 Q0,62 -13,52 Z" className={s.mocoCaliz} opacity={1 - 0.6 * moco} />
                {moco > 0.02 && [0, 1].map((k) => { const q = ciclo(reloj, 1800, hash(i, k)); return <circle key={k} cx={(k - 0.5) * 10} cy={-q * 70 * moco} r={7 * (1 - q * 0.4)} className={s.gotaMoco} opacity={moco * (1 - q)} />; })}
              </g>
            ) : (
              Array.from({ length: 6 }, (_, k) => {
                const ang = Math.sin(reloj / 170 + i * 0.55 + k * 0.2) * 16;
                return <line key={k} x1={-17 + k * 7} y1={0} x2={-17 + k * 7 + Math.sin((ang * Math.PI) / 180) * 18} y2={-Math.cos((ang * Math.PI) / 180) * 18} className={s.cilio} />;
              })
            )}
            <ellipse cx={0} cy={epitelio - luz - 30} rx={11} ry={15} className={s.nucleoEpi} />
          </g>
        );
      })}
      {/* Capa de moco sobre el epitelio */}
      <path d={`M-800,${luz} L-800,${luz - 6 - 26 * moco} ${Array.from({ length: 34 }, (_, i) => `L${i * 50},${luz - 6 - 26 * moco - Math.sin(i * 1.3 + reloj / 900) * 4 * moco}`).join(' ')} L2400,${luz - 6 - 26 * moco} L2400,${luz} Z`} className={s.capaMoco} opacity={0.35 + 0.55 * moco} />
      <line x1={-800} y1={epitelio} x2={2400} y2={epitelio} className={s.membranaBasal} />
      <text x={24} y={epitelio + 34} className={s.rotuloTejido}>Lámina propia</text>

      {/* Glándula submucosa y su conducto */}
      <path d={`M${G.cx},${G.cy - 60} L${G.cx},${epitelio + 2}`} className={s.conducto} />
      {[[-46, -10], [-10, -46], [36, -24], [44, 22], [4, 46], [-42, 34]].map(([dx, dy], i) => (
        <g key={i} transform={`translate(${G.cx + dx},${G.cy + dy})`}>
          <circle r={34} className={s.acino} />
          {Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * Math.PI * 2; return <circle key={k} cx={Math.cos(a) * 23} cy={Math.sin(a) * 23} r={5} className={s.nucleoEpi} />; })}
          <circle r={9} className={s.mocoCaliz} />
        </g>
      ))}
      {moco > 0.02 && Array.from({ length: 6 }, (_, k) => { const q = ciclo(reloj, 2200, k / 6); return <circle key={k} cx={G.cx} cy={G.cy - 60 - q * (G.cy - 60 - epitelio)} r={6} className={s.gotaMoco} opacity={moco} />; })}
      <text x={G.cx} y={G.cy + 108} textAnchor="middle" className={s.rotuloTejido}>Glándula</text>

      {/* Vénula poscapilar */}
      <ellipse cx={V.cx} cy={V.cy} rx={V.rx + 10} ry={ry + 10} className={s.paredVenula} strokeWidth={10 + 8 * act} />
      <ellipse cx={V.cx} cy={V.cy} rx={V.rx} ry={ry} className={s.luzVenula} style={{ fill: `color-mix(in srgb, #EE8B82 ${Math.round(18 + 55 * vaso)}%, var(--luz-venula))` }} />
      <g clipPath="url(#hs-clipVenula)">
        {Array.from({ length: 20 }, (_, i) => {
          const x = V.cx - V.rx + ((i * 71 + reloj * 0.07 * (1 - 0.6 * vaso)) % (V.rx * 2 + 60)) - 30;
          return <Hematie key={i} x={x} y={V.cy + (hash(i, 1) - 0.5) * ry * 1.3} rot={hash(i, 3) * 60 - 30} />;
        })}
      </g>
      {/* Endotelio: células en el borde; con la histamina se abren huecos entre ellas */}
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const x = V.cx + Math.cos(a) * V.rx, y = V.cy + Math.sin(a) * ry;
        const ang = (Math.atan2(Math.sin(a) * V.rx, Math.cos(a) * ry) * 180) / Math.PI + 90;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${ang})`}>
            <ellipse rx={28 - 9 * fuga} ry={5 + 5 * act} className={s.endotelio} />
            {act > 0.05 && <circle cy={-6} r={2.6} className={s.selectina} opacity={act} />}
          </g>
        );
      })}
      <text x={V.cx} y={V.cy - ry - 26} textAnchor="middle" className={s.rotuloTejido}>Vénula poscapilar</text>

      {/* Infiltrado de la fase tardía */}
      {inf > 0.02 && Array.from({ length: 34 }, (_, i) => {
        if (hash(i, 8) > inf) return null;
        const x = 220 + hash(i, 9) * 820, y = 300 + hash(i, 10) * 470;
        if (Math.hypot((x - V.cx) / (V.rx + 20), (y - V.cy) / (ry + 20)) < 1) return null;
        return <g key={i} transform={`translate(${x},${y})`} opacity={inf}><DibujoCelula dibujo={i % 4 === 0 ? 'linfocito' : 'eosinofilo'} d={26} color="#D9567E" /></g>;
      })}

      {/* Nervio sensitivo: con la histamina conduce (prurito) */}
      <path d={`M${N.x},${N.y0} C${N.x - 30},${N.y0 + 130} ${N.x + 30},${N.y0 + 260} ${N.x},${N.y0 + 390} S${N.x - 20},${N.y1 - 30} ${N.x},${N.y1}`} className={s.nervio} />
      {prur > 0.02 && <path d={`M${N.x},${N.y0} C${N.x - 30},${N.y0 + 130} ${N.x + 30},${N.y0 + 260} ${N.x},${N.y0 + 390} S${N.x - 20},${N.y1 - 30} ${N.x},${N.y1}`} className={s.nervioBrillo} opacity={prur} />}
      {prur > 0.02 && [0, 1, 2].map((k) => { const q = ciclo(reloj, 900, k / 3); const y = N.y1 - q * (N.y1 - N.y0); return <circle key={k} cx={N.x + Math.sin(y / 70) * 14} cy={y} r={9} className={s.potencial} opacity={prur * (1 - q * 0.3)} />; })}
      <text x={N.x + 26} y={N.y0 + 10} className={s.rotuloTejido}>Nervio</text>

      {/* Músculo liso bronquial */}
      <rect x={-800} y={M.y0} width={3200} height={M.y1 - M.y0 + 400} className={s.capaMuscular} />
      {Array.from({ length: 22 }, (_, i) => {
        const x = i * 76 + (i % 2) * 30, y = M.y0 + 30 + (i % 3) * 26;
        return <g key={i}><ellipse cx={x} cy={y} rx={40 * (1 - 0.28 * esp)} ry={8 * (1 + 0.55 * esp)} className={s.fibraLisa} style={{ opacity: 0.7 + 0.3 * esp }} /><ellipse cx={x} cy={y} rx={10 * (1 - 0.2 * esp)} ry={3} className={s.nucleoLiso} /></g>;
      })}
      <text x={24} y={M.y0 - 12} className={s.rotuloTejido}>Músculo liso</text>

      {/* Corte del bronquio: la luz se cierra con el espasmo, el edema y el moco */}
      <g opacity={1 - gang}>
        <circle cx={B.cx} cy={B.cy} r={B.r} className={s.paredBronquio} />
        <circle cx={B.cx} cy={B.cy} r={B.r * 0.84 * (1 - 0.14 * esp)} className={s.musculoBronquio} />
        <path d={Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * Math.PI * 2; const r = B.r * 0.62 * (1 - 0.42 * esp) * (1 - 0.1 * edema) * (1 + (i % 2 ? 0.07 : -0.05) * (0.3 + esp)); return `${i ? 'L' : 'M'}${(B.cx + Math.cos(a) * r).toFixed(1)},${(B.cy + Math.sin(a) * r).toFixed(1)}`; }).join(' ') + 'Z'} className={s.mucosaBronquio} />
        <circle cx={B.cx} cy={B.cy} r={B.r * 0.5 * (1 - 0.5 * esp) * (1 - 0.12 * edema)} className={s.luzBronquio} />
        {moco > 0.02 && <circle cx={B.cx + 6} cy={B.cy + 8} r={B.r * 0.44 * (1 - 0.5 * esp) * moco} className={s.tapon} opacity={0.85} />}
        <text x={B.cx} y={B.cy - B.r - 16} textAnchor="middle" className={s.rotuloTejido}>Corte del bronquio</text>
        <text x={B.cx} y={B.cy + B.r + 32} textAnchor="middle" className={s.rotuloDato}>Luz: {Math.round(100 * (1 - 0.5 * esp) * (1 - 0.12 * edema) * (1 - 0.6 * moco * (1 - 0.5 * esp)))} %</text>
      </g>

      {/* Ganglio de drenaje */}
      {gang > 0.01 && (
        <g opacity={gang}>
          <path d={`M880,${epitelio + 40} C960,${epitelio + 60} 1000,${GG.y0 + 140} ${GG.x0 + 40},${GG.y0 + 200}`} className={s.linfatico} />
          <rect x={GG.x0} y={GG.y0} width={GG.x1 - GG.x0} height={GG.y1 - GG.y0} rx={26} className={s.panelGanglio} />
          <path d={`M${GG.x0 + 60},${(GG.y0 + GG.y1) / 2} C${GG.x0 + 60},${GG.y0 + 60} ${GG.x1 - 40},${GG.y0 + 50} ${GG.x1 - 40},${(GG.y0 + GG.y1) / 2} S${GG.x0 + 140},${GG.y1 - 40} ${GG.x0 + 60},${(GG.y0 + GG.y1) / 2} Z`} className={s.capsulaGanglio} />
          {[[0.3, 0.22], [0.62, 0.17], [0.86, 0.36]].map(([fx, fy], i) => <circle key={i} cx={GG.x0 + (GG.x1 - GG.x0) * fx} cy={GG.y0 + (GG.y1 - GG.y0) * fy} r={44} className={s.foliculo} />)}
          <text x={(GG.x0 + GG.x1) / 2} y={GG.y0 + 34} textAnchor="middle" className={s.rotuloTejido}>Ganglio de drenaje</text>
          <text x={GG.x0 + (GG.x1 - GG.x0) * 0.62} y={GG.y0 + (GG.y1 - GG.y0) * 0.17 + 66} textAnchor="middle" className={s.rotuloDato}>Folículos (B)</text>
          <text x={GG.x0 + (GG.x1 - GG.x0) * 0.5} y={GG.y1 - 30} textAnchor="middle" className={s.rotuloDato}>Paracorteza (T)</text>
        </g>
      )}
    </g>
  );
}

// ─── Cuerpo (anafilaxia) ──────────────────────────────────────────────────────

function Cuerpo({ t, reloj }: { t: T; reloj: number }) {
  const { cx, cabeza, laringe: yl, pulmon: yp, corazon: yc, intestino: yi, monitor: Mo } = CUERPO;
  const piel = v(t, 'piel'), lar = v(t, 'laringe'), bron = v(t, 'bronquio'), intes = v(t, 'intestino'), vasos = v(t, 'vasos'), pres = v(t, 'presion'), adr = v(t, 'adrenalina');
  const fc = 78 + 60 * pres, sis = Math.round(120 - 64 * pres), dia = Math.round(80 - 46 * pres);
  const sat = Math.round(98 - 14 * bron), fr = Math.round(16 + 14 * bron);
  const latido = 1 + 0.06 * Math.pow(Math.max(0, Math.sin((reloj / 60000) * fc * Math.PI * 2)), 8);
  const silueta = `M${cx - 32},${cabeza + 66} L${cx - 32},${cabeza + 108} C${cx - 120},${cabeza + 118} ${cx - 150},${cabeza + 150} ${cx - 160},${cabeza + 230} L${cx - 196},${cabeza + 520} C${cx - 200},${cabeza + 548} ${cx - 172},${cabeza + 552} ${cx - 166},${cabeza + 526} L${cx - 126},${cabeza + 290} L${cx - 118},${cabeza + 560} L${cx - 110},${cabeza + 840} C${cx - 108},${cabeza + 868} ${cx - 58},${cabeza + 868} ${cx - 56},${cabeza + 840} L${cx - 20},${cabeza + 580} L${cx + 20},${cabeza + 580} L${cx + 56},${cabeza + 840} C${cx + 58},${cabeza + 868} ${cx + 108},${cabeza + 868} ${cx + 110},${cabeza + 840} L${cx + 118},${cabeza + 560} L${cx + 126},${cabeza + 290} L${cx + 166},${cabeza + 526} C${cx + 172},${cabeza + 552} ${cx + 200},${cabeza + 548} ${cx + 196},${cabeza + 520} L${cx + 160},${cabeza + 230} C${cx + 150},${cabeza + 150} ${cx + 120},${cabeza + 118} ${cx + 32},${cabeza + 108} L${cx + 32},${cabeza + 66} Z`;
  const ecg = Array.from({ length: 121 }, (_, i) => {
    const x = Mo.x0 + 40 + (i / 120) * (Mo.x1 - Mo.x0 - 80);
    const fase = ((i / 120) * 3 + reloj / (60000 / fc)) % 1;
    const y = 220 - (fase > 0.42 && fase < 0.46 ? 60 : fase > 0.46 && fase < 0.5 ? -18 : fase > 0.6 && fase < 0.7 ? 12 * Math.sin(((fase - 0.6) / 0.1) * Math.PI) : 0);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const estado = pres < 0.2 ? 'Estable' : pres < 0.6 ? 'Hipotensión' : 'Shock distributivo';
  return (
    <g className={s.fondo}>
      <path d={silueta} className={s.cuerpo} />
      <circle cx={cx} cy={cabeza} r={68} className={s.cuerpo} />
      <path d={silueta} className={s.pielRoja} opacity={0.32 * piel} />
      <circle cx={cx} cy={cabeza} r={68} className={s.pielRoja} opacity={0.32 * piel} />
      {/* Vasos periféricos: se dilatan */}
      {[[-140, 260, -180, 520], [140, 260, 180, 520], [-80, 600, -84, 940], [80, 600, 84, 940]].map(([x1, y1, x2, y2], i) => <line key={i} x1={cx + x1} y1={y1} x2={cx + x2} y2={y2} className={s.vasoPeriferico} strokeWidth={3 + 5 * vasos} />)}
      {/* Habones de la urticaria */}
      {piel > 0.02 && Array.from({ length: 20 }, (_, i) => {
        const x = cx + (hash(i, 1) - 0.5) * 260, y = 260 + hash(i, 2) * 560;
        return <g key={i} opacity={Math.min(1, piel * 1.4 - hash(i, 3) * 0.4)}><circle cx={x} cy={y} r={20} className={s.halo} /><circle cx={x} cy={y} r={11} className={s.habon} /></g>;
      })}
      {/* Vía aérea: laringe, tráquea, bronquios y pulmones */}
      <circle cx={cx} cy={yl} r={16 + 16 * lar} className={s.laringeEdema} opacity={0.25 + 0.6 * lar} />
      <circle cx={cx} cy={yl} r={13} className={s.laringe} />
      <path d={`M${cx},${yl + 12} L${cx},${yp - 70}`} className={s.traquea} strokeWidth={14 - 7 * lar} />
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={cx + k * 78} cy={yp + 20} rx={62} ry={104} className={s.pulmon} style={{ fill: `color-mix(in srgb, #8DA6D6 ${Math.round(40 * bron)}%, var(--pulmon))` }} />
          <path d={`M${cx},${yp - 70} Q${cx + k * 30},${yp - 40} ${cx + k * 60},${yp - 10} M${cx + k * 60},${yp - 10} L${cx + k * 92},${yp + 40} M${cx + k * 60},${yp - 10} L${cx + k * 58},${yp + 70} M${cx + k * 92},${yp + 40} L${cx + k * 112},${yp + 90} M${cx + k * 58},${yp + 70} L${cx + k * 70},${yp + 120}`} className={s.bronquios} strokeWidth={9 - 6 * bron} />
        </g>
      ))}
      <g transform={`translate(${cx + 22},${yc}) scale(${latido})`}><path d="M0,26 C-34,4 -40,-22 -20,-30 C-8,-34 0,-24 0,-16 C0,-24 8,-34 20,-30 C40,-22 34,4 0,26 Z" className={s.corazon} /></g>
      <path d={`M${cx - 70},${yi - 40} C${cx - 20},${yi - 70} ${cx + 70},${yi - 60} ${cx + 66},${yi - 10} C${cx + 60},${yi + 30} ${cx - 60},${yi + 10} ${cx - 64},${yi + 40} C${cx - 66},${yi + 70} ${cx + 40},${yi + 80} ${cx + 60},${yi + 56}`} className={s.intestino} style={{ strokeDashoffset: -(reloj / 30) * intes }} strokeDasharray={intes > 0.02 ? '14 8' : undefined} />
      {/* Adrenalina en la cara lateral del muslo */}
      {adr > 0.01 && (
        <g opacity={adr} transform={`translate(${cx + 150},${cabeza + 640}) rotate(-35)`}>
          <rect x={-10} y={-60} width={20} height={80} rx={5} className={s.jeringa} />
          <line x1={0} y1={20} x2={0} y2={46} className={s.aguja} />
          <text x={22} y={-20} className={s.rotuloDato} transform="rotate(35 22 -20)">Adrenalina IM</text>
        </g>
      )}
      {/* Monitor */}
      <rect x={Mo.x0} y={Mo.y0} width={Mo.x1 - Mo.x0} height={Mo.y1 - Mo.y0} rx={26} className={s.monitor} />
      <path d={ecg} className={s.ecg} />
      {[
        ['PA', `${sis}/${dia}`, 'mmHg', pres > 0.5],
        ['FC', `${Math.round(fc)}`, 'lpm', pres > 0.5],
        ['SatO₂', `${sat}`, '%', bron > 0.5],
        ['FR', `${fr}`, 'rpm', bron > 0.5],
      ].map(([k, valor, u, alerta], i) => (
        <g key={k as string} transform={`translate(${Mo.x0 + 50 + (i % 2) * 300},${Mo.y0 + 250 + Math.floor(i / 2) * 210})`}>
          <text className={s.monitorRotulo}>{k}</text>
          <text y={86} className={alerta ? s.monitorAlerta : s.monitorValor}>{valor}</text>
          <text y={124} className={s.monitorRotulo}>{u}</text>
        </g>
      ))}
      <text x={(Mo.x0 + Mo.x1) / 2} y={Mo.y1 - 40} textAnchor="middle" className={pres > 0.5 ? s.monitorAlerta2 : s.monitorEstado}>{estado}</text>
    </g>
  );
}

// ─── Sangre ───────────────────────────────────────────────────────────────────

function Sangre({ t, reloj }: { t: T; reloj: number }) {
  const { y0, y1, placenta: yp } = SANGRE;
  const pl = v(t, 'placenta'), hem = v(t, 'hemolisis');
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <rect x={-800} y={y0 - 50} width={3200} height={50} className={s.paredVaso} />
      <rect x={-800} y={y1} width={3200} height={50} className={s.paredVaso} />
      <rect x={-800} y={y0} width={3200} height={y1 - y0} className={s.plasmaSangre} />
      <rect x={-800} y={y0} width={3200} height={y1 - y0} className={s.hemoLibre} opacity={0.3 * hem} />
      {Array.from({ length: 32 }, (_, i) => <ellipse key={`e${i}`} cx={i * 52} cy={y0 - 6} rx={24} ry={6} className={s.endotelio} />)}
      {Array.from({ length: 32 }, (_, i) => <ellipse key={`f${i}`} cx={i * 52 + 26} cy={y1 + 6} rx={24} ry={6} className={s.endotelio} />)}
      {Array.from({ length: 34 }, (_, i) => {
        const x = ((i * 97 + reloj * 0.06) % 1800) - 100;
        const fetal = pl > 0.5 && hash(i, 4) > 0.5;
        const y = pl > 0.02 ? (fetal ? yp + 60 + hash(i, 1) * (y1 - yp - 90) : y0 + 30 + hash(i, 1) * (yp - y0 - 90)) : y0 + 30 + hash(i, 1) * (y1 - y0 - 60);
        return <Hematie key={i} x={x} y={y} rot={hash(i, 2) * 50 - 25} k={fetal ? 0.85 : 1} />;
      })}
      {pl > 0.01 && (
        <g opacity={pl}>
          <rect x={-800} y={yp - 34} width={3200} height={68} className={s.trofoblasto} />
          {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={i * 56 + 20} cy={yp + (i % 2 ? 10 : -10)} rx={9} ry={6} className={s.nucleoTrofo} />)}
          <text x={24} y={y0 + 34} className={s.rotuloTejido}>Sangre materna</text>
          <text x={24} y={yp + 64} className={s.rotuloTejido}>Capilar fetal</text>
          <text x={1576} y={yp - 44} textAnchor="end" className={s.rotuloDato}>Placenta (sincitiotrofoblasto)</text>
        </g>
      )}
      {pl < 0.99 && <text x={24} y={y0 + 34} className={s.rotuloTejido} opacity={1 - pl}>Luz del vaso</text>}
    </g>
  );
}

// ─── Glomérulo ────────────────────────────────────────────────────────────────

function Glomerulo({ t, reloj }: { t: T; reloj: number }) {
  const { cx, cy, r, mbg, bowman, alveolo: A } = GLOMERULO;
  const lin = v(t, 'lineal'), gran = v(t, 'granular'), prot = v(t, 'proteinuria'), hema = v(t, 'hematuria'), dano = v(t, 'dano'), hemo = v(t, 'hemorragia'), comp = v(t, 'complemento');
  const R2 = r + mbg / 2;
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <circle cx={cx} cy={cy} r={bowman + 16} className={s.capsulaBowman} />
      <circle cx={cx} cy={cy} r={bowman} className={s.espacioUrinario} />
      <text x={cx} y={cy - bowman + 44} textAnchor="middle" className={s.rotuloTejido}>Espacio urinario (de Bowman)</text>
      {/* Podocitos con sus pedicelos sobre la membrana basal */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        return (
          <g key={i}>
            <circle cx={cx + Math.cos(a) * (r + 62)} cy={cy + Math.sin(a) * (r + 62)} r={30} className={s.podocito} />
            <circle cx={cx + Math.cos(a) * (r + 62)} cy={cy + Math.sin(a) * (r + 62)} r={13} className={s.nucleoPodo} />
          </g>
        );
      })}
      {Array.from({ length: 72 }, (_, i) => { const a = (i / 72) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * (r + mbg + 5)} cy={cy + Math.sin(a) * (r + mbg + 5)} r={5} className={s.pedicelo} />; })}
      <circle cx={cx} cy={cy} r={r} className={s.luzCapilar} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 + reloj / 9000; const q = 0.35 + hash(i, 1) * 0.5; return <Hematie key={i} x={cx + Math.cos(a) * r * q} y={cy + Math.sin(a) * r * q} rot={(a * 180) / Math.PI} />; })}
      {/* Membrana basal glomerular (con roturas si hay daño) */}
      <circle cx={cx} cy={cy} r={R2} className={s.mbg} strokeWidth={mbg} strokeDasharray={dano > 0.02 ? `${120 - 60 * dano} ${14 * dano}` : undefined} />
      <circle cx={cx} cy={cy} r={r - 6} className={s.endotelioFenestrado} />
      {lin > 0.01 && <circle cx={cx} cy={cy} r={R2} className={s.ifLineal} opacity={lin} />}
      {gran > 0.01 && Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2 + hash(i, 2) * 0.1; const sub = i % 3 === 0; return <circle key={i} cx={cx + Math.cos(a) * (R2 + (sub ? -14 : 13))} cy={cy + Math.sin(a) * (R2 + (sub ? -14 : 13))} r={7 + hash(i, 3) * 6} className={s.ifGranular} opacity={gran} />; })}
      {comp > 0.01 && Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + 0.2; const x = cx + Math.cos(a) * (R2 - 26), y = cy + Math.sin(a) * (R2 - 26); return <path key={i} d={`M${x},${y - 7} L${x + 7},${y + 6} L${x - 7},${y + 6} Z`} className={s.c3} opacity={comp} />; })}
      {/* Proteínas y hematíes que cruzan al espacio urinario */}
      {prot > 0.02 && Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; const q = ciclo(reloj, 3000, hash(i, 5)); const rr = r - 30 + q * (bowman - r + 10); return <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr} r={4} className={s.proteina} opacity={prot * (q > 0.3 ? 1 : 0.5)} />; })}
      {hema > 0.02 && Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + 1; const q = ciclo(reloj, 4200, hash(i, 6)); const rr = r - 40 + q * (bowman - r + 20); return <Hematie key={i} x={cx + Math.cos(a) * rr} y={cy + Math.sin(a) * rr} rot={(a * 180) / Math.PI} k={0.9} />; })}
      <text x={cx} y={cy + 8} textAnchor="middle" className={s.rotuloTejido}>Luz capilar</text>
      <text x={cx + bowman + 28} y={cy + 60} className={s.rotuloDato}>MBG · podocitos</text>
      {/* Alvéolo pulmonar (Goodpasture) */}
      <circle cx={A.cx} cy={A.cy} r={A.r + 10} className={s.paredAlveolo} />
      <circle cx={A.cx} cy={A.cy} r={A.r} className={s.alveolo} />
      {hemo > 0.02 && Array.from({ length: 18 }, (_, i) => { if (hash(i, 7) > hemo) return null; const a = i * 2.39996; const k = Math.sqrt((i + 0.5) / 18) * A.r * 0.85; return <Hematie key={i} x={A.cx + Math.cos(a) * k} y={A.cy + Math.sin(a) * k} rot={i * 23} />; })}
      {lin > 0.01 && <circle cx={A.cx} cy={A.cy} r={A.r + 5} className={s.ifLineal} opacity={lin} strokeWidth={8} />}
      <ellipse cx={A.cx} cy={A.cy + A.r + 48} rx={110} ry={26} className={s.luzCapilar} />
      <text x={A.cx} y={A.cy - A.r - 24} textAnchor="middle" className={s.rotuloTejido}>Alvéolo pulmonar</text>
    </g>
  );
}

// ─── Placa motora y tiroides ──────────────────────────────────────────────────

const POZOS = [292, 392, 505];

function Placa({ t, reloj }: { t: T; reloj: number }) {
  const { membrana: ym, receptores, foliculo: F } = PLACA;
  const ach = v(t, 'ach'), bloq = v(t, 'bloqueo'), intern = v(t, 'internalizacion'), contr = v(t, 'contraccion'), anti = v(t, 'antiTshr'), horm = v(t, 'hormona');
  const latido = 0.5 + 0.5 * Math.sin(reloj / 260);
  const fuerza = contr * (0.75 + 0.25 * latido);
  const pliegues = `M40,${ym} ${receptores.map((x, i) => `L${x - 34},${ym} C${x - 34},${ym + 70} ${x - 14},${ym + 70} ${x - 14},${ym} L${x + 14},${ym}${i === receptores.length - 1 ? '' : ''}`).join(' ')} L760,${ym}`;
  const celulas = 18;
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <line x1={800} y1={60} x2={800} y2={960} className={s.divisor} />
      <text x={400} y={70} textAnchor="middle" className={s.rotuloTejido}>Placa motora · miastenia gravis</text>
      <text x={1210} y={70} textAnchor="middle" className={s.rotuloTejido}>Folículo tiroideo · enfermedad de Graves</text>
      {/* Fibra muscular */}
      <rect x={40} y={ym} width={720} height={390} rx={20} className={s.fibraMuscular} />
      {Array.from({ length: 18 }, (_, i) => { const x = 60 + i * 40 * (1 - 0.18 * fuerza) + 9 * fuerza * i; return <line key={i} x1={x} y1={ym + 90} x2={x} y2={ym + 370} className={s.sarcomero} />; })}
      <path d={pliegues} className={s.membranaPost} />
      {/* Receptores de ACh en las crestas de los pliegues */}
      {receptores.map((x, i) => {
        const fuera = hash(i, 3) < intern * 0.75;
        const dy = fuera ? 60 * intern : 0;
        return (
          <g key={i} transform={`translate(${x},${ym - 8 + dy})`} opacity={fuera ? 1 - 0.85 * intern : 1}>
            <path d="M-10,-14 L-10,4 Q0,12 10,4 L10,-14" className={s.achr} />
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
        return <path key={`${k}-${i}`} d={`M${x},${y - 6} L${x + 6},${y} L${x},${y + 6} L${x - 6},${y} Z`} className={s.ach} opacity={ach * (q > 0.9 ? (1 - q) * 10 : 1)} />;
      }))}
      {/* Fuerza muscular */}
      <rect x={700} y={ym + 40} width={30} height={300} rx={8} className={s.medidorFondo} />
      <rect x={700} y={ym + 40 + 300 * (1 - fuerza)} width={30} height={300 * fuerza} rx={8} className={fuerza < 0.5 ? s.medidorBajo : s.medidorOk} />
      <text x={715} y={ym + 372} textAnchor="middle" className={s.rotuloDato}>Fuerza</text>

      {/* Folículo tiroideo */}
      <rect x={1470} y={140} width={60} height={760} rx={30} className={s.capilarTiroides} />
      <circle cx={F.cx} cy={F.cy} r={F.r - 40 - 45 * horm} className={s.coloide} />
      {horm > 0.05 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; const rr = F.r - 40 - 45 * horm; return <circle key={i} cx={F.cx + Math.cos(a) * rr} cy={F.cy + Math.sin(a) * rr} r={10 * horm} className={s.vacuola} />; })}
      {Array.from({ length: celulas }, (_, i) => {
        const a = (i / celulas) * Math.PI * 2;
        const alto = 46 + 46 * horm;
        const rr = F.r - 40 - 45 * horm + alto / 2;
        return (
          <g key={i} transform={`translate(${F.cx + Math.cos(a) * rr},${F.cy + Math.sin(a) * rr}) rotate(${(a * 180) / Math.PI})`}>
            <rect x={-alto / 2} y={-38} width={alto} height={76} rx={10} className={s.tirocito} />
            <circle cx={alto * 0.12} r={12} className={s.nucleoTiro} />
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

function Vaso({ t, reloj }: { t: T; reloj: number }) {
  const { cx, cy, luz, intima, media, adventicia } = VASO;
  const dep = v(t, 'deposito'), nec = v(t, 'necrosis'), tro = v(t, 'trombo'), vas = v(t, 'vasculitis'), fuga = v(t, 'fuga'), comp = v(t, 'complemento');
  const arco = (r0: number, r1: number, a0: number, a1: number) => {
    const p = (r: number, a: number) => `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`;
  };
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.intersticio} />
      <rect x={-800} y={-800} width={3200} height={2600} className={s.edema} opacity={0.35 * fuga} />
      <circle cx={cx} cy={cy} r={adventicia} className={s.adventicia} />
      <circle cx={cx} cy={cy} r={media} className={s.media} />
      {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; const r = (intima + media) / 2 + (i % 2 ? 10 : -8); return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} rx={16} ry={4.5} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r})`} className={s.nucleoLiso} />; })}
      <circle cx={cx} cy={cy} r={intima} className={s.intima} />
      <circle cx={cx} cy={cy} r={luz} className={s.luzVaso} />
      {Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2; return <ellipse key={i} cx={cx + Math.cos(a) * (luz + 8)} cy={cy + Math.sin(a) * (luz + 8)} rx={26} ry={6} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * (luz + 8)} ${cy + Math.sin(a) * (luz + 8)})`} className={s.endotelio} />; })}
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + reloj / 7000; const q = 0.3 + hash(i, 1) * 0.55; return <Hematie key={i} x={cx + Math.cos(a) * luz * q} y={cy + Math.sin(a) * luz * q} rot={(a * 180) / Math.PI} />; })}
      {/* Necrosis fibrinoide: el lado izquierdo de la pared se vuelve rosado y borroso */}
      {nec > 0.01 && (
        <g opacity={nec}>
          <path d={arco(luz - 4, media + 16, Math.PI * 0.62, Math.PI * 1.38)} className={s.fibrinoide} />
          {Array.from({ length: 22 }, (_, i) => { const a = Math.PI * (0.64 + (i / 22) * 0.72); const r = luz + hash(i, 4) * (media - luz); return <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a + 0.05) * (r + 22)} y2={cy + Math.sin(a + 0.05) * (r + 14)} className={s.fibrina} />; })}
        </g>
      )}
      {/* Depósitos subendoteliales de inmunocomplejos */}
      {dep > 0.01 && Array.from({ length: 14 }, (_, i) => {
        if (hash(i, 2) > dep * 1.1) return null;
        const a = Math.PI * (0.66 + (i / 14) * 0.68);
        const r = luz + 18;
        return <g key={i} transform={`translate(${cx + Math.cos(a) * r},${cy + Math.sin(a) * r})`}><circle r={9} className={s.deposito} /><circle r={4} cx={4} cy={-3} className={s.depositoAg} /></g>;
      })}
      {comp > 0.01 && Array.from({ length: 12 }, (_, i) => { const a = Math.PI * (0.68 + (i / 12) * 0.64); const x = cx + Math.cos(a) * (luz - 18), y = cy + Math.sin(a) * (luz - 18); return <path key={i} d={`M${x},${y - 7} L${x + 7},${y + 6} L${x - 7},${y + 6} Z`} className={s.c3} opacity={comp} />; })}
      {/* Neutrófilos en la pared (vasculitis aguda) */}
      {vas > 0.01 && Array.from({ length: 16 }, (_, i) => {
        if (hash(i, 6) > vas) return null;
        const a = Math.PI * (0.62 + hash(i, 7) * 0.76);
        const r = luz + 20 + hash(i, 8) * (adventicia - luz);
        return <g key={i} transform={`translate(${cx + Math.cos(a) * r},${cy + Math.sin(a) * r})`} opacity={vas}><DibujoCelula dibujo="linfocito" d={22} color="#8A4FCF" /></g>;
      })}
      {/* Agregado de plaquetas → trombo */}
      {tro > 0.01 && Array.from({ length: 16 }, (_, i) => {
        if (i / 16 > tro) return null;
        const a = Math.PI + (hash(i, 9) - 0.5) * 0.5;
        const r = luz - 16 - hash(i, 10) * 90 * tro;
        return <g key={i} transform={`translate(${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}) rotate(${i * 37})`}><DibujoCelula dibujo="plaqueta" d={22} /></g>;
      })}
      <text x={cx} y={cy - adventicia - 24} textAnchor="middle" className={s.rotuloTejido}>Arteriola (corte transversal)</text>
      <text x={cx} y={cy + 8} textAnchor="middle" className={s.rotuloDato}>Luz</text>
      <text x={cx + adventicia + 20} y={cy - media + 10} className={s.rotuloDato}>Media</text>
      <text x={cx + adventicia + 20} y={cy - media + 36} className={s.rotuloDato}>Íntima · endotelio</text>
      <text x={1300} y={160} textAnchor="middle" className={s.rotuloTejido}>Tejido · ganglio</text>
    </g>
  );
}

// ─── Piel ─────────────────────────────────────────────────────────────────────

function Piel({ t, reloj }: { t: T; reloj: number }) {
  const { cornea, basal, venulas } = PIEL;
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
      filas.push(
        <g key={`${fila}-${i}`} transform={`translate(${x},${y + (redonda ? 30 * aca : 0)})`}>
          {redonda ? <circle r={20} className={s.queratinocito} /> : <rect x={-28 + 6 * esp} y={-24 + 5 * esp} width={56 - 12 * esp} height={48 - 10 * esp} rx={10} className={s.queratinocito} />}
          <circle r={8} className={s.nucleoQuera} />
        </g>,
      );
    }
  }
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={800 + cornea} className={s.aire} />
      <rect x={-800} y={basal} width={3200} height={2000} className={s.dermis} />
      <rect x={-800} y={basal} width={3200} height={2000} className={s.eritema} opacity={0.3 * eri} />
      <rect x={-800} y={basal} width={3200} height={2000} className={s.edema} opacity={0.4 * edema} />
      {Array.from({ length: 11 }, (_, i) => { const y = basal + 90 + i * 56 + edema * (i - 5) * 3; return <path key={i} d={`M-40,${y} C240,${y - 16} 480,${y + 18} 760,${y} S1200,${y - 12} 1700,${y + 6}`} className={s.colagenoFibra} />; })}
      {edema > 0.02 && Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${120 + i * 120},${basal + 140 + hash(i, 1) * 300} q30,-14 60,0 t60,0`} className={s.fibrina} opacity={edema} />)}
      {/* Epidermis */}
      <path d={`M-800,${cornea + sube(0)} ${Array.from({ length: 33 }, (_, i) => `L${i * 50},${cornea - 4 * Math.sin(i * 1.7) + sube(i * 50)}`).join(' ')} L2400,${cornea} L2400,${mb(1600)} ${Array.from({ length: 33 }, (_, i) => `L${1600 - i * 50},${mb(1600 - i * 50)}`).join(' ')} L-800,${mb(0)} Z`} className={s.epidermis} />
      {filas}
      {Array.from({ length: 30 }, (_, i) => { const x = i * 56; return <ellipse key={i} cx={x} cy={mb(x) - 18} rx={14} ry={18} className={s.basal} />; })}
      <path d={`M-40,${mb(-40)} ${Array.from({ length: 34 }, (_, i) => `L${i * 50},${mb(i * 50)}`).join(' ')}`} className={s.membranaBasal} />
      <path d={`M-800,${cornea + sube(0)} ${Array.from({ length: 33 }, (_, i) => `L${i * 50},${cornea - 4 * Math.sin(i * 1.7) + sube(i * 50)}`).join(' ')} L2400,${cornea}`} className={s.cornea} />
      {/* Células de Langerhans (dendríticas de la epidermis) */}
      {[300, 820, 1340].map((x, i) => <g key={i} transform={`translate(${x},${cornea + 120 + sube(x)})`}>{[0, 1.2, 2.4, 3.6, 4.8].map((a, k) => <line key={k} x1={0} y1={0} x2={Math.cos(a) * 30} y2={Math.sin(a) * 30} className={s.langerhans} />)}<circle r={9} className={s.langerhansCuerpo} /></g>)}
      {/* Espongiosis y vesículas (dermatitis de contacto) */}
      {ves > 0.02 && [[640, 0.6], [820, 1], [990, 0.7]].map(([x, k], i) => <ellipse key={i} cx={x} cy={cornea + 120 + sube(x)} rx={58 * ves * k} ry={40 * ves * k} className={s.vesicula} />)}
      {/* Acantólisis suprabasal (pénfigo) */}
      {aca > 0.02 && <path d={`M470,${mb(470) - 36} C600,${mb(600) - 36 - 70 * aca} 1000,${mb(1000) - 36 - 70 * aca} 1130,${mb(1130) - 36} Z`} className={s.vesicula} />}
      {/* Vénulas de la dermis, con el manguito perivascular */}
      {venulas.map((V, j) => {
        const ry = V.ry * (1 + 0.45 * vaso);
        return (
          <g key={j}>
            {man > 0.01 && Array.from({ length: 46 }, (_, i) => {
              if (hash(i, j + 2) > man) return null;
              const a = (i / 46) * Math.PI * 2 + hash(i, 3);
              const k = 1.25 + hash(i, 4) * 0.8;
              return <g key={i} transform={`translate(${V.cx + Math.cos(a) * V.rx * k},${V.cy + Math.sin(a) * ry * k * 1.5})`} opacity={man}><DibujoCelula dibujo="linfocito" d={20} color={i % 3 ? '#D24E80' : '#C9875A'} /></g>;
            })}
            <ellipse cx={V.cx} cy={V.cy} rx={V.rx + 10} ry={ry + 10} className={s.paredVenula} strokeWidth={8 + 10 * act} />
            <ellipse cx={V.cx} cy={V.cy} rx={V.rx} ry={ry} className={s.luzVenula} style={{ fill: `color-mix(in srgb, #EE8B82 ${Math.round(18 + 50 * vaso)}%, var(--luz-venula))` }} />
            {Array.from({ length: 8 }, (_, i) => <Hematie key={i} x={V.cx - V.rx + 30 + ((i * 53 + reloj * 0.05) % (V.rx * 2 - 60))} y={V.cy + (hash(i, j) - 0.5) * ry} rot={i * 20} k={0.9} />)}
            {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return <ellipse key={i} cx={V.cx + Math.cos(a) * V.rx} cy={V.cy + Math.sin(a) * ry} rx={22} ry={4 + 7 * act} transform={`rotate(${(Math.atan2(Math.sin(a) * V.rx, Math.cos(a) * ry) * 180) / Math.PI + 90} ${V.cx + Math.cos(a) * V.rx} ${V.cy + Math.sin(a) * ry})`} className={s.endotelio} />; })}
          </g>
        );
      })}
      <text x={24} y={cornea - 24} className={s.rotuloTejido}>Epidermis</text>
      <text x={24} y={basal + 80} className={s.rotuloTejido}>Dermis</text>
      <text x={venulas[0].cx} y={venulas[0].cy - venulas[0].ry - 40} textAnchor="middle" className={s.rotuloDato}>Vénula</text>
    </g>
  );
}

// ─── Granuloma ────────────────────────────────────────────────────────────────

function Granuloma({ t }: { t: T }) {
  const { cx, cy, r } = GRANULOMA;
  const mac = v(t, 'macrofagos'), epi = v(t, 'epitelioides'), gig = v(t, 'gigantes'), cor = v(t, 'corona'), fib = v(t, 'fibrosis'), cas = v(t, 'caseosis');
  return (
    <g className={s.fondo}>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.ganglioFondo} />
      {Array.from({ length: 260 }, (_, i) => {
        const x = hash(i, 1) * 1600, y = hash(i, 2) * 1000;
        const d = Math.hypot(x - cx, y - cy);
        if (d < r * 0.95) return null;
        return <circle key={i} cx={x} cy={y} r={6} className={s.linfocitoFondo} />;
      })}
      {cor > 0.01 && Array.from({ length: 120 }, (_, i) => {
        const a = i * 2.39996, k = r * (1.02 + hash(i, 3) * 0.4);
        return <circle key={i} cx={cx + Math.cos(a) * k} cy={cy + Math.sin(a) * k} r={7} className={s.linfocitoCorona} opacity={cor} />;
      })}
      {fib > 0.01 && Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; const k = r * 1.5; return <ellipse key={i} cx={cx + Math.cos(a) * k} cy={cy + Math.sin(a) * k} rx={22} ry={4} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * k} ${cy + Math.sin(a) * k})`} className={s.fibroblasto} opacity={fib} />; })}
      {fib > 0.01 && <circle cx={cx} cy={cy} r={r * 1.5} className={s.capsulaFibrosa} opacity={fib} />}
      {/* Macrófagos que llegan y se transforman en células epitelioides */}
      {mac > 0.01 && Array.from({ length: 16 }, (_, i) => {
        const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 16) * r * 0.85;
        return <g key={i} transform={`translate(${cx + Math.cos(a) * k},${cy + Math.sin(a) * k})`} opacity={mac * (1 - epi)}><circle r={22} className={s.macrofagoFondo} /><circle r={9} cx={-4} className={s.nucleoMacro} /></g>;
      })}
      {epi > 0.01 && Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2 + (i % 2) * 0.1, k = r * (0.45 + (i % 3) * 0.17);
        return <g key={i} transform={`translate(${cx + Math.cos(a) * k},${cy + Math.sin(a) * k}) rotate(${(a * 180) / Math.PI + 90})`} opacity={epi}><DibujoCelula dibujo="epitelioide" d={62} /></g>;
      })}
      {cas > 0.01 && (
        <g opacity={cas}>
          <circle cx={cx} cy={cy} r={r * 0.36} className={s.caseum} />
          {Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 30) * r * 0.32; return <circle key={i} cx={cx + Math.cos(a) * k} cy={cy + Math.sin(a) * k} r={2.5} className={s.detritus} />; })}
        </g>
      )}
      {gig > 0.01 && [[-0.2, -0.05], [0.24, 0.12]].map(([dx, dy], i) => <g key={i} transform={`translate(${cx + dx * r * (1 + cas)},${cy + dy * r * (1 + cas)}) scale(${0.6 + 0.4 * gig})`} opacity={gig}><DibujoCelula dibujo="gigante" d={110} /></g>)}
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
  return <>{C({ t, reloj })}</>;
});
