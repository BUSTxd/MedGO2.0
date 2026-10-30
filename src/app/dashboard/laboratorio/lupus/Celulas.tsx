'use client';
// Células dibujadas con código del laboratorio «Lupus». Lo que ya existe se
// reutiliza: anticuerpos, inmunocomplejos y las células de «Hipersensibilidad»
// (que a su vez trae las de «Maduración de linfocitos»).

import { memo } from 'react';
import type { Dibujo } from '@/lib/data/lupus/tipos';
import type { Dibujo as DibujoHiper } from '@/lib/data/hipersensibilidad/tipos';
import { DibujoCelula as DibujoHipersensibilidad } from '../hipersensibilidad/Celulas';
import s from '@/styles/lupus.module.css';

export { Anticuerpo, Complejo, DefsPropias } from '../hipersensibilidad/Celulas';

const TAU = Math.PI * 2;

/** Membrana algo irregular (no un círculo perfecto): radio con dos ondas suaves. */
function contorno(r: number, n = 64, amp = 0.035, semilla = 0): string {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU;
    const k = 1 + amp * Math.sin(a * 3 + semilla) + amp * 0.6 * Math.sin(a * 5 + semilla * 2);
    return [Math.cos(a) * r * k, Math.sin(a) * r * k];
  });
  return `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')} Z`;
}

/** Célula nucleada «cualquiera» (queratinocito, leucocito, célula renal): el
 *  núcleo grande con cromatina, nucléolo y poros es el protagonista del lupus. */
const Nucleada = memo(function Nucleada({ r }: { r: number }) {
  const rn = r * 0.46;
  // Grumos de cromatina (heterocromatina) y fibras de eucromatina, fijos.
  const grumos = Array.from({ length: 22 }, (_, i) => {
    const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 22) * rn * 0.82;
    return { x: Math.cos(a) * k + rn * 0.04, y: Math.sin(a) * k - rn * 0.03, rr: rn * (0.05 + 0.04 * ((i * 7) % 3) / 2) };
  });
  const fibras = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * TAU + 0.3, b = a + 1.1;
    return `M${(Math.cos(a) * rn * 0.75).toFixed(1)},${(Math.sin(a) * rn * 0.75).toFixed(1)} Q${(Math.cos(a + 0.55) * rn * 0.2).toFixed(1)},${(Math.sin(a + 0.55) * rn * 0.2).toFixed(1)} ${(Math.cos(b) * rn * 0.7).toFixed(1)},${(Math.sin(b) * rn * 0.7).toFixed(1)}`;
  });
  const organelos = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * TAU + 0.6, k = r * (0.66 + 0.08 * (i % 2));
    return { x: Math.cos(a) * k, y: Math.sin(a) * k, ang: (a * 180) / Math.PI + 90 };
  });
  return (
    <g>
      <path d={contorno(r, 72, 0.03, 1.3)} className={s.citoplasma} />
      <path d={contorno(r * 0.97, 72, 0.03, 1.3)} className={s.membranaInterna} />
      {organelos.map((o, i) => (
        <g key={i} transform={`translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) rotate(${o.ang.toFixed(0)})`}>
          {i % 3 === 0
            ? <ellipse rx={r * 0.09} ry={r * 0.045} className={s.mitocondria} />
            : <circle r={r * 0.028} className={s.vesicula} />}
        </g>
      ))}
      {/* Retículo alrededor del núcleo */}
      <path d={contorno(rn * 1.28, 48, 0.06, 2.1)} className={s.reticulo} />
      <path d={contorno(rn, 56, 0.025, 0.7)} className={s.nucleo} />
      {fibras.map((d, i) => <path key={i} d={d} className={s.eucromatina} />)}
      {grumos.map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.rr} className={s.cromatina} />)}
      <circle cx={-rn * 0.28} cy={rn * 0.2} r={rn * 0.17} className={s.nucleolo} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * TAU;
        return <circle key={i} cx={Math.cos(a) * rn} cy={Math.sin(a) * rn} r={2.6} className={s.poroNuclear} />;
      })}
      <ellipse cx={-r * 0.35} cy={-r * 0.42} rx={r * 0.28} ry={r * 0.13} transform={`rotate(-30 ${-r * 0.35} ${-r * 0.42})`} className={s.reflejo} />
    </g>
  );
});

/** Cuerpo apoptótico: la célula encogida, con burbujas en la membrana y el
 *  núcleo partido en fragmentos densos (cariorrexis). */
const Apoptotico = memo(function Apoptotico({ r }: { r: number }) {
  const blebs = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * TAU + 0.3;
    return { x: Math.cos(a) * r * 0.86, y: Math.sin(a) * r * 0.86, rr: r * (0.2 + 0.08 * (i % 3)) };
  });
  return (
    <g>
      {blebs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.rr} className={s.bleb} />)}
      <path d={contorno(r * 0.82, 40, 0.07, 2.4)} className={s.citoplasmaApo} />
      {[[-0.22, -0.18, 0.2], [0.2, -0.1, 0.16], [0, 0.22, 0.18], [-0.28, 0.2, 0.1]].map(([x, y, k], i) => (
        <circle key={i} cx={x * r} cy={y * r} r={k * r} className={s.fragmentoNuclear} />
      ))}
    </g>
  );
});

/** Nucleosoma: el ADN (dos vueltas) enrollado en un octámero de histonas.
 *  `ox`: modificado tras la necrosis secundaria (oxidado, fragmentado). */
const Nucleosoma = memo(function Nucleosoma({ r, ox }: { r: number; ox: boolean }) {
  const d = `M${-r},${-r * 0.2} C${-r * 0.6},${-r * 0.75} ${r * 0.6},${-r * 0.75} ${r * 0.7},${-r * 0.15} C${r * 0.85},${r * 0.45} ${-r * 0.6},${r * 0.7} ${-r * 0.7},${r * 0.15} C${-r * 0.8},${-r * 0.3} ${r * 0.4},${-r * 0.55} ${r},${-r * 0.05}`;
  return (
    <g>
      {ox && <circle r={r * 1.05} className={s.auraOx} />}
      <ellipse rx={r * 0.62} ry={r * 0.5} className={ox ? s.histonaOx : s.histonaNuc} />
      <path d={d} className={ox ? s.adnOx : s.adnNuc} />
      {ox && [[-0.5, -0.6], [0.55, 0.45], [0.7, -0.5]].map(([x, y], i) => <path key={i} d={`M${x * r - 5},${y * r} L${x * r + 5},${y * r} M${x * r},${y * r - 5} L${x * r},${y * r + 5}`} className={s.marcaOx} />)}
    </g>
  );
});

/** Célula dendrítica plasmocitoide: redonda, de aspecto «plasmático», con el núcleo
 *  excéntrico y mucho retículo endoplásmico (fabrica interferón a raudales). */
const Pdc = memo(function Pdc({ r }: { r: number }) {
  return (
    <g>
      <path d={contorno(r, 64, 0.025, 0.4)} className={s.citoplasmaPdc} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-r * 0.7 + i * 6},${-r * 0.35 + i * r * 0.13} q${r * 0.35},${-r * 0.08} ${r * 0.7},0`} className={s.reticuloPdc} />)}
      <ellipse cx={r * 0.32} cy={r * 0.12} rx={r * 0.42} ry={r * 0.38} className={s.nucleo} />
      {Array.from({ length: 10 }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 10) * 0.75; return <circle key={i} cx={r * 0.32 + Math.cos(a) * r * 0.42 * k} cy={r * 0.12 + Math.sin(a) * r * 0.38 * k} r={r * 0.05} className={s.cromatina} />; })}
      <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.25} ry={r * 0.11} className={s.reflejo} />
    </g>
  );
});

export function DibujoCelula({ dibujo, d, color, vacio = 0 }: { dibujo: Dibujo; d: number; color?: string; vacio?: number }) {
  if (dibujo === 'nucleada') return <Nucleada r={d / 2} />;
  if (dibujo === 'apoptotico') return <Apoptotico r={d / 2} />;
  if (dibujo === 'pdc') return <Pdc r={d / 2} />;
  if (dibujo === 'nucleosoma' || dibujo === 'nucleosomaox') return <Nucleosoma r={d / 2} ox={dibujo === 'nucleosomaox'} />;
  return <DibujoHipersensibilidad dibujo={dibujo as DibujoHiper} d={d} color={color} vacio={vacio} />;
}
