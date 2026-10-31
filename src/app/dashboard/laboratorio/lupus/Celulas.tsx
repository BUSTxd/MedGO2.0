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

/** Valor fijo de 0 a 1 para repartir sin azar real (la célula sale igual siempre). */
const fijo = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);

/** Mitocondria: doble membrana y crestas en zigzag. */
function Mitocondria({ x, y, ang, l, h }: { x: number; y: number; ang: number; l: number; h: number }) {
  const n = 6, paso = (l * 1.5) / n;
  const crestas = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${f1(-l * 0.75 + i * paso)},${f1((i % 2 ? 1 : -1) * h * 0.56)}`).join(' ');
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(0)})`}>
      <ellipse rx={l} ry={h} className={s.mitocondria} />
      <ellipse rx={l * 0.86} ry={h * 0.7} className={s.mitoLuz} />
      <path d={crestas} className={s.crestas} />
    </g>
  );
}

/** Célula nucleada «cualquiera» (queratinocito, leucocito, célula renal): por dentro,
 *  lo que hay en una lámina de histología, y el núcleo con cromatina, nucléolo y poros
 *  como protagonista, porque contra él van los anticuerpos en el lupus. */
const Nucleada = memo(function Nucleada({ r }: { r: number }) {
  const rn = r * 0.44;
  // De lejos, el detalle fino sería ruido: solo cuando la célula es grande.
  const fino = r > 70;
  const pol = (a: number, q: number) => [Math.cos(a) * q, Math.sin(a) * q] as const;
  // Heterocromatina pegada a la envoltura; eucromatina suelta por el centro.
  const peri = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * TAU + fijo(i, 1) * 0.2, [x, y] = pol(a, rn * (0.84 - fijo(i, 2) * 0.1));
    return { x, y, rr: rn * (0.045 + fijo(i, 3) * 0.05) };
  });
  const dentro = Array.from({ length: 16 }, (_, i) => {
    const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 16) * rn * 0.62, [x, y] = pol(a, q);
    return { x: x + rn * 0.05, y: y - rn * 0.03, rr: rn * (0.03 + fijo(i, 4) * 0.04) };
  });
  const fibras = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * TAU + 0.3, b = a + 1.1, [x0, y0] = pol(a, rn * 0.78), [cx, cy] = pol(a + 0.55, rn * 0.2), [x1, y1] = pol(b, rn * 0.72);
    return `M${f1(x0)},${f1(y0)} Q${f1(cx)},${f1(cy)} ${f1(x1)},${f1(y1)}`;
  });
  // Retículo rugoso: sacos que abrazan el núcleo por dos lados.
  const saco = (a0: number, a1: number, q: number, g: number) => {
    const n = 14, ida: string[] = [], vuelta: string[] = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n, o = Math.sin(i * 1.5 + q) * r * 0.012;
      const [x0, y0] = pol(a, q + o), [x1, y1] = pol(a, q + g + o);
      ida.push(`${f1(x0)},${f1(y0)}`); vuelta.unshift(`${f1(x1)},${f1(y1)}`);
    }
    return `M${ida.join(' L')} L${vuelta.join(' L')} Z`;
  };
  const sacos = [
    ...[1.2, 1.42, 1.64].map((k, i) => saco(1.0 + i * 0.1, 3.1 - i * 0.1, rn * k, r * 0.04)),
    ...[1.2, 1.42].map((k, i) => saco(4.0 + i * 0.1, 5.5 - i * 0.1, rn * k, r * 0.04)),
  ];
  const ribos = fino ? Array.from({ length: 70 }, (_, i) => {
    const sup = i % 5 < 3, a = sup ? 1.05 + fijo(i, 5) * 2 : 4.05 + fijo(i, 5) * 1.4, q = rn * (sup ? 1.17 + (i % 3) * 0.22 : 1.17 + (i % 2) * 0.22), [x, y] = pol(a, q);
    return { x, y };
  }) : [];
  const libres = fino ? Array.from({ length: 46 }, (_, i) => {
    const a = i * 2.39996, [x, y] = pol(a, r * (0.55 + fijo(i, 6) * 0.37));
    return { x, y };
  }) : [];
  const hilos = fino ? Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * TAU + 0.2, [x0, y0] = pol(a, rn * 1.1), [cx, cy] = pol(a + 0.2, r * 0.68), [x1, y1] = pol(a + 0.12, r * 0.94);
    return `M${f1(x0)},${f1(y0)} Q${f1(cx)},${f1(cy)} ${f1(x1)},${f1(y1)}`;
  }).join(' ') : '';
  const golgi = [0, 1, 2, 3, 4].map((i) => {
    const w = r * (0.2 - i * 0.018), y = i * r * 0.036;
    return `M${f1(-w)},${f1(y)} Q0,${f1(y - r * 0.09)} ${f1(w)},${f1(y)} Q${f1(w * 1.1)},${f1(y + r * 0.018)} ${f1(w)},${f1(y + r * 0.024)} Q0,${f1(y - r * 0.05)} ${f1(-w)},${f1(y + r * 0.024)} Q${f1(-w * 1.1)},${f1(y + r * 0.018)} ${f1(-w)},${f1(y)} Z`;
  });
  return (
    <g>
      <defs>
        <radialGradient id="cel-cito" cx="0.42" cy="0.38" r="0.68">
          <stop offset="0" className={s.citoStop1} /><stop offset="0.7" className={s.citoStop2} /><stop offset="1" className={s.citoStop3} />
        </radialGradient>
        <radialGradient id="cel-nuc" cx="0.4" cy="0.36" r="0.72">
          <stop offset="0" className={s.nucStop1} /><stop offset="1" className={s.nucStop2} />
        </radialGradient>
        <radialGradient id="cel-nol" cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" className={s.nolStop1} /><stop offset="1" className={s.nolStop2} />
        </radialGradient>
      </defs>
      <path d={contorno(r, 72, 0.03, 1.3)} fill="url(#cel-cito)" className={s.citoplasma} />
      <path d={contorno(r * 0.97, 72, 0.03, 1.3)} className={s.membranaInterna} />
      {fino && <path d={hilos} className={s.citoesqueleto} />}
      {libres.map((o, i) => <circle key={i} cx={o.x} cy={o.y} r={r * 0.007} className={s.ribosoma} />)}
      {/* Retículo endoplásmico rugoso, con sus ribosomas */}
      {sacos.map((d, i) => <path key={i} d={d} className={s.reticulo} />)}
      {ribos.map((o, i) => <circle key={i} cx={o.x} cy={o.y} r={r * 0.0085} className={s.ribosoma} />)}
      {/* Aparato de Golgi y las vesículas que suelta */}
      <g transform={`translate(${f1(r * 0.62)},${f1(-r * 0.38)}) rotate(38)`}>
        {golgi.map((d, i) => <path key={i} d={d} className={s.golgi} />)}
      </g>
      {[[0.84, -0.26, 0.026], [0.76, -0.12, 0.02], [0.42, -0.72, 0.024], [0.3, -0.62, 0.018], [0.88, -0.42, 0.016]].map(([x, y, k], i) => <circle key={i} cx={x * r} cy={y * r} r={k * r} className={s.vesicula} />)}
      {/* Mitocondrias */}
      {[[-0.72, -0.2, 62, 0.13], [-0.45, -0.68, 18, 0.12], [-0.72, 0.36, -40, 0.12], [-0.08, 0.82, 8, 0.13], [0.58, 0.58, -36, 0.13], [0.82, 0.14, 84, 0.11]].map(([x, y, a, l], i) => <Mitocondria key={i} x={x * r} y={y * r} ang={a} l={l * r} h={l * r * 0.46} />)}
      {/* Lisosomas */}
      {[[-0.28, 0.72, 0.05], [0.26, 0.74, 0.04], [-0.84, 0.08, 0.04]].map(([x, y, k], i) => (
        <g key={i} transform={`translate(${f1(x * r)},${f1(y * r)})`}>
          <circle r={k * r} className={s.lisosoma} />
          <circle cx={-k * r * 0.3} cy={-k * r * 0.2} r={k * r * 0.2} className={s.granuloLis} />
          <circle cx={k * r * 0.3} cy={k * r * 0.25} r={k * r * 0.24} className={s.granuloLis} />
        </g>
      ))}
      {/* Centrosoma: dos centriolos en ángulo recto */}
      <g transform={`translate(${f1(r * 0.34)},${f1(-r * 0.56)})`}>
        <rect x={-r * 0.035} y={-r * 0.014} width={r * 0.07} height={r * 0.028} rx={r * 0.006} className={s.centriolo} />
        <rect x={r * 0.012} y={-r * 0.05} width={r * 0.028} height={r * 0.07} rx={r * 0.006} className={s.centriolo} />
      </g>
      {/* Núcleo con su doble envoltura */}
      <path d={contorno(rn * 1.05, 56, 0.025, 0.7)} className={s.envoltura} />
      <path d={contorno(rn, 56, 0.025, 0.7)} fill="url(#cel-nuc)" className={s.nucleoGrad} />
      {fibras.map((d, i) => <path key={i} d={d} className={s.eucromatina} />)}
      {peri.map((g, i) => <circle key={`p${i}`} cx={g.x} cy={g.y} r={g.rr} className={s.cromatina} />)}
      {dentro.map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.rr} className={s.cromatina} />)}
      <circle cx={-rn * 0.26} cy={rn * 0.2} r={rn * 0.2} fill="url(#cel-nol)" />
      <circle cx={-rn * 0.3} cy={rn * 0.16} r={rn * 0.05} className={s.reflejo} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * TAU;
        return <circle key={i} cx={Math.cos(a) * rn * 1.02} cy={Math.sin(a) * rn * 1.02} r={Math.max(1.4, r * 0.013)} className={s.poroNuclear} />;
      })}
      <ellipse cx={-r * 0.4} cy={-r * 0.5} rx={r * 0.24} ry={r * 0.09} transform={`rotate(-36 ${-r * 0.4} ${-r * 0.5})`} className={s.reflejo} />
    </g>
  );
});

/** Cuerpo apoptótico: la célula encogida, con burbujas en la membrana y el
 *  núcleo partido en fragmentos densos (cariorrexis), alguno ya dentro de una burbuja. */
const Apoptotico = memo(function Apoptotico({ r }: { r: number }) {
  const blebs = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * TAU + 0.3;
    return { x: Math.cos(a) * r * 0.86, y: Math.sin(a) * r * 0.86, rr: r * (0.2 + 0.08 * (i % 3)) };
  });
  return (
    <g>
      {blebs.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.rr} className={s.bleb} />
          <circle cx={b.x - b.rr * 0.3} cy={b.y - b.rr * 0.34} r={b.rr * 0.24} className={s.reflejo} />
          {i % 3 === 0 && <circle cx={b.x} cy={b.y} r={b.rr * 0.34} className={s.fragmentoNuclear} />}
        </g>
      ))}
      <path d={contorno(r * 0.82, 40, 0.07, 2.4)} className={s.citoplasmaApo} />
      {[[0.3, 0.42], [-0.46, -0.3], [0.44, -0.3], [-0.1, -0.5], [0.52, 0.12]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={r * 0.05} className={s.vesicula} />)}
      {[[-0.22, -0.18, 0.2], [0.2, -0.1, 0.16], [0, 0.22, 0.18], [-0.28, 0.2, 0.1]].map(([x, y, k], i) => (
        <g key={i}>
          <circle cx={x * r} cy={y * r} r={k * r} className={s.fragmentoNuclear} />
          <circle cx={(x - k * 0.3) * r} cy={(y - k * 0.34) * r} r={k * r * 0.26} className={s.reflejo} />
        </g>
      ))}
    </g>
  );
});

/** C1q: el «ramo de tulipanes»: un tallo de colágeno que se abre en seis brazos,
 *  cada uno con su cabeza globular, la que se pega a la célula que muere. */
const C1q = memo(function C1q({ r, color }: { r: number; color: string }) {
  const brazos = [-62, -38, -14, 14, 38, 62];
  const base = r * 0.8, nudo = r * 0.14;
  return (
    <g>
      <rect x={-r * 0.11} y={nudo} width={r * 0.22} height={base - nudo} rx={r * 0.08} fill={color} />
      {[0.32, 0.5, 0.68].map((f) => <line key={f} x1={-r * 0.11} y1={r * f} x2={r * 0.11} y2={r * f - r * 0.05} stroke="#FFF" strokeWidth={Math.max(0.8, r * 0.022)} opacity={0.5} />)}
      {brazos.map((a, i) => {
        const rad = (a * Math.PI) / 180, l = r * (Math.abs(a) > 50 ? 0.82 : 0.96);
        const x = Math.sin(rad) * l, y = nudo - Math.cos(rad) * l;
        return (
          <g key={a}>
            <path d={`M0,${f1(nudo)} Q${f1(x * 0.22)},${f1(y * 0.52)} ${f1(x)},${f1(y)}`} fill="none" stroke={color} strokeWidth={r * 0.09} strokeLinecap="round" />
            <circle cx={x} cy={y} r={r * 0.2} fill={color} />
            <circle cx={x} cy={y} r={r * 0.2} fill="#000" opacity={i % 2 ? 0.08 : 0} />
            <circle cx={x - r * 0.06} cy={y - r * 0.07} r={r * 0.065} fill="#FFF" opacity={0.6} />
          </g>
        );
      })}
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
      {/* El octámero: las bolas de histona, y el ADN que les da dos vueltas */}
      {[[-0.02, -0.3], [-0.02, 0.3], [-0.42, 0], [0.42, 0], [-0.3, -0.26], [0.32, -0.26], [-0.32, 0.26], [0.3, 0.26]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x * r} cy={y * r} r={r * 0.3} className={ox ? s.histonaOx : s.histonaNuc} />
          <circle cx={(x - 0.09) * r} cy={(y - 0.1) * r} r={r * 0.08} fill="#FFF" opacity={0.55} />
        </g>
      ))}
      <path d={d} className={ox ? s.adnOx : s.adnNuc} />
      {!ox && <path d={d} fill="none" stroke="#CFE2FF" strokeWidth={Math.max(1, r * 0.04)} strokeDasharray={`${r * 0.16} ${r * 0.12}`} opacity={0.9} />}
      {ox && [[-0.5, -0.6], [0.55, 0.45], [0.7, -0.5]].map(([x, y], i) => <path key={i} d={`M${x * r - 5},${y * r} L${x * r + 5},${y * r} M${x * r},${y * r - 5} L${x * r},${y * r + 5}`} className={s.marcaOx} />)}
    </g>
  );
});

/** ADN roto: un trozo de doble hélice con los extremos deshilachados. */
const FragmentoAdn = memo(function FragmentoAdn({ r }: { r: number }) {
  const n = 18, y = (f: number, s0: number) => Math.sin(f * 4.2 * Math.PI + s0) * r * 0.26 + (f - 0.5) * r * 0.2;
  const onda = (s0: number) => Array.from({ length: n + 1 }, (_, i) => `${(-r + (2 * r * i) / n).toFixed(1)},${y(i / n, s0).toFixed(1)}`).join(' L');
  return (
    <g transform="rotate(-18)">
      {Array.from({ length: 11 }, (_, i) => { const f = (i + 0.7) / 12; return <line key={i} x1={-r + 2 * r * f} y1={y(f, 0)} x2={-r + 2 * r * f} y2={y(f, Math.PI)} stroke={i % 2 ? '#E8B21E' : '#3DBA8C'} strokeWidth={Math.max(1.4, r * 0.055)} />; })}
      <path d={`M${onda(0)}`} fill="none" stroke="#2F6FD0" strokeWidth={r * 0.13} strokeLinecap="round" />
      <path d={`M${onda(Math.PI)}`} fill="none" stroke="#6AA0EA" strokeWidth={r * 0.13} strokeLinecap="round" />
    </g>
  );
});

/** ARN: una sola hebra, que se dobla sobre sí misma en horquilla. */
const FragmentoArn = memo(function FragmentoArn({ r }: { r: number }) {
  const d = `M${-r * 0.9},${r * 0.62} C${-r * 0.5},${r * 0.1} ${-r * 0.5},${-r * 0.5} ${-r * 0.14},${-r * 0.72} C${r * 0.24},${-r * 0.92} ${r * 0.46},${-r * 0.5} ${r * 0.16},${-r * 0.2} C${-r * 0.02},${0} ${r * 0.1},${r * 0.5} ${r * 0.86},${r * 0.6}`;
  return (
    <g>
      {[[-0.42, -0.2, 0.08, -0.04], [-0.34, -0.44, 0.08, -0.32], [-0.46, 0.08, 0.07, 0.22]].map(([a, b, c, e], i) => <line key={i} x1={a * r} y1={b * r} x2={c * r} y2={e * r} stroke="#E8B21E" strokeWidth={Math.max(1.4, r * 0.06)} />)}
      <path d={d} fill="none" stroke="#14704F" strokeWidth={r * 0.2} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#3DBA8C" strokeWidth={r * 0.13} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#FFF" strokeWidth={r * 0.03} strokeLinecap="round" strokeDasharray={`${r * 0.14} ${r * 0.12}`} opacity={0.7} />
    </g>
  );
});

/** Histonas sueltas: el octámero sin su ADN, con las colas hacia afuera. */
const Octamero = memo(function Octamero({ r, color }: { r: number; color: string }) {
  const bolas = [[-0.34, -0.34], [0.32, -0.36], [-0.36, 0.3], [0.34, 0.32], [0, -0.5], [-0.5, -0.02], [0.5, 0], [0, 0.46]];
  return (
    <g>
      {bolas.map(([x, y], i) => <path key={i} d={`M${x * r},${y * r} q${x * r * 0.5},${y * r * 0.2} ${x * r * 1.1},${y * r * 1.1}`} fill="none" stroke={color} strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.75} />)}
      {bolas.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x * r} cy={y * r} r={r * 0.34} fill={color} />
          <circle cx={x * r} cy={y * r} r={r * 0.34} fill="#000" opacity={i % 2 ? 0.16 : 0.04} />
          <circle cx={(x - 0.1) * r} cy={(y - 0.12) * r} r={r * 0.09} fill="#FFF" opacity={0.6} />
        </g>
      ))}
    </g>
  );
});

/** Célula dendrítica plasmocitoide: redonda, de aspecto «plasmático», con el núcleo
 *  excéntrico y mucho retículo endoplásmico (fabrica interferón a raudales). */
const Pdc = memo(function Pdc({ r }: { r: number }) {
  const nx = r * 0.3, ny = r * 0.14, nrx = r * 0.44, nry = r * 0.4;
  const fino = r > 60;
  return (
    <g>
      <defs>
        <radialGradient id="lp-pdc" cx="0.4" cy="0.34" r="0.75"><stop offset="0" className={s.pdcC1} /><stop offset="1" className={s.pdcC2} /></radialGradient>
        <radialGradient id="lp-pdcn" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#B79AE2" /><stop offset="1" stopColor="#5A3E8C" /></radialGradient>
      </defs>
      <path d={contorno(r, 64, 0.025, 0.4)} fill="url(#lp-pdc)" className={s.citoplasmaPdcFilo} />
      {/* Retículo rugoso, apilado: fabrica interferón a raudales */}
      {Array.from({ length: fino ? 7 : 4 }, (_, i) => {
        const y = -r * 0.62 + i * r * (fino ? 0.15 : 0.24), xa = -r * (0.74 - Math.abs(i - 3) * 0.04), w = r * (0.82 - i * 0.04);
        return (
          <g key={i}>
            <path d={`M${f1(xa)},${f1(y)} q${f1(w / 2)},${f1(-r * 0.09)} ${f1(w)},0`} className={s.reticuloPdc} />
            {fino && <path d={Array.from({ length: 9 }, (_, n) => { const f = n / 8; return `M${f1(xa + w * f)},${f1(y - r * 0.18 * f * (1 - f) - r * 0.018)}h0`; }).join('')} className={s.ribosomasPdc} />}
          </g>
        );
      })}
      {fino && (
        <g>
          {/* Golgi y vesículas */}
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${f1(-r * 0.6 + i * r * 0.03)},${f1(r * 0.3 + i * r * 0.08)} Q${f1(-r * 0.32)},${f1(r * 0.14 + i * r * 0.08)} ${f1(-r * 0.1 - i * r * 0.03)},${f1(r * 0.3 + i * r * 0.08)}`} className={s.golgiPdc} />)}
          {[[-0.68, 0.22], [-0.04, 0.26], [-0.62, 0.66], [-0.12, 0.74]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={r * 0.035} className={s.vesiculaPdc} />)}
          <Mitocondria x={r * 0.5} y={-r * 0.56} ang={24} l={r * 0.2} h={r * 0.085} />
          <Mitocondria x={-r * 0.2} y={r * 0.8} ang={-10} l={r * 0.18} h={r * 0.075} />
        </g>
      )}
      {/* Núcleo excéntrico: envoltura, heterocromatina y nucléolo */}
      <ellipse cx={nx} cy={ny} rx={nrx} ry={nry} fill="url(#lp-pdcn)" stroke="#3F2A6A" strokeWidth={Math.max(1, r * 0.012)} />
      {Array.from({ length: fino ? 26 : 12 }, (_, i) => { const a = (i / (fino ? 26 : 12)) * TAU; return <circle key={i} cx={nx + Math.cos(a) * nrx * 0.84} cy={ny + Math.sin(a) * nry * 0.84} r={r * (0.022 + fijo(i, 2) * 0.022)} fill="#2F1C5E" opacity={0.75} />; })}
      {fino && Array.from({ length: 12 }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 12) * 0.62; return <circle key={i} cx={nx + Math.cos(a) * nrx * k} cy={ny + Math.sin(a) * nry * k} r={r * 0.018} fill="#3F2A6A" opacity={0.65} />; })}
      <circle cx={nx + nrx * 0.28} cy={ny - nry * 0.26} r={r * 0.09} fill="#2F1C5E" />
      <ellipse cx={nx - nrx * 0.34} cy={ny - nry * 0.52} rx={nrx * 0.3} ry={nry * 0.1} fill="#FFF" opacity={0.28} />
      <ellipse cx={-r * 0.38} cy={-r * 0.72} rx={r * 0.25} ry={r * 0.075} className={s.reflejo} />
    </g>
  );
});

/** IgG: dos brazos Fab (cadena pesada y ligera) y el tallo Fc. Con `ang` = 0, los
 *  brazos apuntan hacia arriba. */
export function IgG({ x, y, ang = 0, k = 1, igm = false }: { x: number; y: number; ang?: number; k?: number; igm?: boolean }) {
  const P = igm ? '#7B4FC9' : '#D9791E', C = igm ? '#C9B2EC' : '#F6C27E', O = igm ? '#472A80' : '#8A4A10', F = igm ? '#9872D8' : '#E89038';
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(0)}) scale(${k.toFixed(3)})`}>
      <rect x={-7} y={1} width={6.8} height={22} rx={3.2} fill={P} stroke={O} strokeWidth={0.7} />
      <rect x={0.2} y={1} width={6.8} height={22} rx={3.2} fill={F} stroke={O} strokeWidth={0.7} />
      {[-1, 1].map((l) => (
        <g key={l} transform={`rotate(${l * 42})`}>
          <rect x={-5.6} y={-27} width={5.8} height={25} rx={2.9} fill={P} stroke={O} strokeWidth={0.7} />
          <rect x={0.3} y={-27} width={5.6} height={23} rx={2.8} fill={C} stroke={O} strokeWidth={0.7} />
          <rect x={1.6} y={-25} width={1.7} height={15} rx={0.8} fill="#FFF" opacity={0.55} />
        </g>
      ))}
      <circle r={3.1} fill="#F2D388" stroke={O} strokeWidth={0.7} />
    </g>
  );
}

/** IgM: cinco anticuerpos unidos por los tallos y por la cadena J. */
export function IgM({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) scale(${k.toFixed(3)})`}>
      {[0, 72, 144, 216, 288].map((a) => <g key={a} transform={`rotate(${a}) translate(0,-30)`}><IgG x={0} y={0} k={1} igm /></g>)}
      <circle r={8.5} fill="#F2D388" stroke="#8A6A10" strokeWidth={1} />
      <path d="M-5,-2 C-2,-6 2,2 5,-2" fill="none" stroke="#8A6A10" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  );
}

/** Linfocito pequeño: el núcleo casi lo llena, con su cromatina en grumos, un filo de
 *  citoplasma y microvellosidades. Lo que cambia entre tipos es el color. */
const LinfocitoLupus = memo(function LinfocitoLupus({ r, color }: { r: number; color: string }) {
  const fino = r > 30;
  return (
    <g>
      {fino && <path d={Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * TAU; return `M${f1(Math.cos(a) * r * 0.97)},${f1(Math.sin(a) * r * 0.97)}L${f1(Math.cos(a) * r * 1.08)},${f1(Math.sin(a) * r * 1.08)}`; }).join('')} stroke={color} strokeWidth={Math.max(1.2, r * 0.03)} strokeLinecap="round" />}
      <path d={contorno(r, 40, 0.018, 0.9)} fill={color} />
      <path d={contorno(r, 40, 0.018, 0.9)} fill="#FFF" opacity={0.58} />
      <path d={contorno(r, 40, 0.018, 0.9)} fill="none" stroke={color} strokeWidth={Math.max(1.2, r * 0.035)} />
      <ellipse cx={r * 0.06} cy={r * 0.05} rx={r * 0.74} ry={r * 0.72} fill={color} />
      <ellipse cx={r * 0.06} cy={r * 0.05} rx={r * 0.74} ry={r * 0.72} fill="#000" opacity={0.2} />
      {Array.from({ length: fino ? 22 : 9 }, (_, i) => { const a = i * 2.39996, q = Math.sqrt((i + 0.5) / (fino ? 22 : 9)) * 0.64; return <circle key={i} cx={r * 0.06 + Math.cos(a) * r * q} cy={r * 0.05 + Math.sin(a) * r * q} r={r * (0.05 + fijo(i, 3) * 0.05)} fill="#000" opacity={0.3} />; })}
      {fino && <circle cx={r * 0.26} cy={-r * 0.14} r={r * 0.12} fill="#000" opacity={0.42} />}
      <ellipse cx={-r * 0.34} cy={-r * 0.56} rx={r * 0.26} ry={r * 0.09} fill="#FFF" opacity={0.65} transform={`rotate(-28 ${-r * 0.34} ${-r * 0.56})`} />
    </g>
  );
});

/** T doble negativo: los huecos donde irían CD4 y CD8, tachados. */
const TDobleNegativo = memo(function TDobleNegativo({ r, color }: { r: number; color: string }) {
  return (
    <g>
      <LinfocitoLupus r={r} color={color} />
      {[['CD4', -42], ['CD8', 42]].map(([txt, a]) => {
        const rad = ((a as number) * Math.PI) / 180, x = Math.cos(rad) * r * 1.1, y = Math.sin(rad) * r * 1.1;
        return (
          <g key={txt as string} transform={`translate(${f1(x + r * 0.2)},${f1(y)})`}>
            <rect x={-20} y={-12} width={40} height={24} rx={7} fill="#FFF" stroke="#C2385A" strokeWidth={1.6} />
            <text dy="0.36em" textAnchor="middle" className={s.marcaT}>{txt}</text>
            <path d="M-18,10 L18,-10" stroke="#C2385A" strokeWidth={2.6} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
});

/** Inmunocomplejo en red: antígenos unidos por IgG. Cuantos más `n`, más grande: el
 *  tamaño decide si circula, se deposita o lo retira el bazo. */
export function ComplejoRed({ n, d }: { n: number; d: number }) {
  const r = d / 2, N = Math.max(2, n);
  const k = Math.max(0.4, Math.min(0.78, r / 58));
  const nodos = Array.from({ length: N }, (_, i) => {
    const a = i * 2.39996, q = Math.sqrt((i + 0.5) / N) * r * 0.74;
    return { x: Math.cos(a) * q, y: Math.sin(a) * q, a };
  });
  return (
    <g>
      {nodos.map((p, i) => {
        const o = nodos[(i + 1) % N], mx = (p.x + o.x) / 2, my = (p.y + o.y) / 2;
        return i % 2 === 0 || N < 5 ? <IgG key={`p${i}`} x={mx} y={my} ang={(Math.atan2(o.y - p.y, o.x - p.x) * 180) / Math.PI + 90} k={k} /> : null;
      })}
      {nodos.map((p, i) => {
        const dr = 1 + (20 * k) / Math.max(10, Math.hypot(p.x, p.y)), ang = (Math.atan2(p.y, p.x) * 180) / Math.PI - 90;
        return i % 2 === 1 ? <IgG key={`f${i}`} x={p.x * dr} y={p.y * dr} ang={ang} k={k} /> : null;
      })}
      {nodos.map((p, i) => {
        const ra = Math.max(3.4, r * 0.13);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={ra} fill={i % 3 === 2 ? '#1F9A6A' : '#2F6FD0'} stroke="#173A7A" strokeWidth={0.7} />
            <circle cx={p.x - ra * 0.3} cy={p.y - ra * 0.34} r={ra * 0.28} fill="#FFF" opacity={0.65} />
          </g>
        );
      })}
    </g>
  );
}

/** Inmunocomplejo con ácido nucleico: la hebra en el centro y las IgG agarradas a
 *  ella. `tipo` dice qué hebra lleva: ADN (doble y azul), ARN (sencilla y verde) o ambas. */
export function ComplejoNuc({ r, tipo = 'adn' }: { r: number; tipo?: 'adn' | 'arn' | 'ambos' }) {
  const k = r / 66;
  const onda = (dy: number, s0: number, amp: number) => Array.from({ length: 17 }, (_, i) => `${i ? 'L' : 'M'}${f1(-r * 0.92 + (i * r * 1.84) / 16)},${f1(dy + Math.sin(i * 0.82 + s0) * r * amp)}`).join(' ');
  const adn = tipo !== 'arn', arn = tipo !== 'adn';
  const ya = arn && adn ? -r * 0.12 : 0, yb = arn && adn ? r * 0.22 : 0;
  return (
    <g>
      {adn && <g>
        {Array.from({ length: 9 }, (_, i) => { const xx = -r * 0.82 + i * r * 0.205, sn = Math.sin(((xx + r * 0.92) / (r * 1.84)) * 16 * 0.82) * r * 0.13; return <line key={i} x1={xx} y1={ya + sn} x2={xx} y2={ya - sn} stroke={i % 2 ? '#E8B21E' : '#3DBA8C'} strokeWidth={r * 0.035} />; })}
        <path d={onda(ya, 0, 0.13)} fill="none" stroke="#1F56B0" strokeWidth={r * 0.07} strokeLinecap="round" />
        <path d={onda(ya, Math.PI, 0.13)} fill="none" stroke="#6AA0EA" strokeWidth={r * 0.07} strokeLinecap="round" />
      </g>}
      {arn && <path d={onda(yb, 1, 0.11)} fill="none" stroke="#1F9A6A" strokeWidth={r * 0.085} strokeLinecap="round" />}
      {[[-0.62, -0.47, 172], [0, -0.5, 186], [0.62, -0.46, 176]].map(([x, y, a], i) => <IgG key={i} x={x * r} y={y * r + ya} ang={a} k={k} />)}
      {[[-0.34, 0.47, -8], [0.36, 0.48, 8]].map(([x, y, a], i) => <IgG key={i} x={x * r} y={y * r + yb} ang={a} k={k} />)}
    </g>
  );
}

export function DibujoCelula({ dibujo, d, color, vacio = 0 }: { dibujo: Dibujo; d: number; color?: string; vacio?: number }) {
  if (dibujo === 'nucleada') return <Nucleada r={d / 2} />;
  if (dibujo === 'apoptotico') return <Apoptotico r={d / 2} />;
  if (dibujo === 'c1q') return <C1q r={d / 2} color={color ?? '#C0397A'} />;
  if (dibujo === 'pdc') return <Pdc r={d / 2} />;
  if (dibujo === 'linfocito') return <LinfocitoLupus r={d / 2} color={color ?? '#5E9CD3'} />;
  if (dibujo === 'tdn') return <TDobleNegativo r={d / 2} color={color ?? '#C2410C'} />;
  if (dibujo === 'complejoadn') return <ComplejoNuc r={d / 2} tipo="adn" />;
  if (dibujo === 'complejoarn') return <ComplejoNuc r={d / 2} tipo="arn" />;
  if (dibujo === 'fragadn') return <FragmentoAdn r={d / 2} />;
  if (dibujo === 'fragarn') return <FragmentoArn r={d / 2} />;
  if (dibujo === 'octamero') return <Octamero r={d / 2} color={color ?? '#8A4FCF'} />;
  if (dibujo === 'nucleosoma' || dibujo === 'nucleosomaox') return <Nucleosoma r={d / 2} ox={dibujo === 'nucleosomaox'} />;
  return <DibujoHipersensibilidad dibujo={dibujo as DibujoHiper} d={d} color={color} vacio={vacio} />;
}
