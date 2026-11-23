'use client';
// Piezas del pulmón (capítulo 15): barrera alvéolo-capilar en corte, saco alveolar y campo de histología.
// Todo es función de `reloj` (ms) y de parámetros 0-1; sin `filter`.

import { useId } from 'react';
import { En, Hematie, S, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Gotita de líquido con sus proteínas (puntos violeta). */
export function Gotita({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cy={4} r={20} fill={S.no[0]} opacity={0.5} /><circle r={20} fill={S.no[1]} opacity={0.95} />
      <circle cx={-6} cy={-7} r={6} fill="#FFF" opacity={0.7} /><circle cx={7} cy={5} r={4.5} fill={S.il6[1]} /><circle cx={-3} cy={8} r={3.5} fill={S.il6[0]} />
    </En>
  );
}

/** Neumocito tipo 2: célula cúbica que asoma al alvéolo, con sus cuerpos laminares (los «ovillos» del surfactante). `activo` 0-1: cuántos fabrica; `dano` 0-1: la apaga. */
export function Neumocito2({ x = 0, y = 0, k = 1, o = 1, reloj = 0, activo = 1, dano = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number; activo?: number; dano?: number }) {
  const d = clamp(dano);
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-84,40 L-84,-30 Q-84,-76 -38,-76 L38,-76 Q84,-76 84,-30 L84,40 Z" fill={S.cito[0]} />
      <path d="M-84,34 L-84,-36 Q-84,-82 -38,-82 L38,-82 Q84,-82 84,-36 L84,34 Z" fill={S.cito[1]} />
      <ellipse cx={-36} cy={-60} rx={28} ry={7} fill="#FFF" opacity={0.5} />
      <circle cx={26} cy={6} r={26} fill={S.nucleo[0]} /><circle cx={22} cy={2} r={22} fill={S.nucleo[1]} />
      {[[-44, -22], [-14, -40], [-52, 10]].map(([cx, cy], i) => <g key={i} opacity={0.55 + 0.45 * (1 - d)}><circle cx={cx} cy={cy} r={13} fill={S.lps[0]} /><circle cx={cx} cy={cy} r={10} fill={S.lps[1]} /><circle cx={cx} cy={cy} r={5} fill={S.lps[2]} /></g>)}
      {[0, 1, 2].map((i) => { const u = ((reloj / 2400 + i / 3) % 1); return <circle key={i} cx={-52 + i * 40} cy={-90 - u * 70} r={7} fill={S.lps[1]} opacity={clamp(activo) * (1 - u) * (1 - d)} />; })}
      <path d="M-84,40 L-84,-30 Q-84,-76 -38,-76 L38,-76 Q84,-76 84,-30 L84,40 Z" fill="#7C7488" opacity={0.6 * d} />
    </En>
  );
}

/**
 * Barrera alvéolo-capilar de corte, horizontal: aire arriba, neumocito tipo 1, membrana basal (con su intersticio),
 * endotelio y luz del capilar con sus eritrocitos. `rota` 0-1 separa las uniones; `hinchada` 0-1 ensancha el
 * intersticio; `agua` 0-1 llena el alvéolo; `fuga` 0-1 hace cruzar gotitas con proteínas; `glow` 0-1 la resalta;
 * `surf` 0-1 pinta la película de surfactante.
 */
export function Barrera({ y = 600, x0 = 0, x1 = 1600, reloj = 0, rota = 0, hinchada = 0, agua = 0, fuga = 0, glow = 0, surf = 0, flujo = 7, o = 1 }: { y?: number; x0?: number; x1?: number; reloj?: number; rota?: number; hinchada?: number; agua?: number; fuga?: number; glow?: number; surf?: number; flujo?: number; o?: number }) {
  const w = x1 - x0, ye = y - 60, eh = 28, g = 12 + 56 * clamp(hinchada), yn = ye + eh + g, nh = 26, yl = yn + nh;
  const xs: number[] = [];
  for (let x = x0 + 170; x < x1 - 60; x += 270) xs.push(x);
  const abre = clamp(rota), ag = easeOut(clamp(agua)), yw = ye - 330 * ag;
  const olas = Array.from({ length: 25 }, (_, i) => `${x0 + (w * i) / 24},${(yw + Math.sin(reloj / 520 + i * 0.9) * 6).toFixed(1)}`).join(' ');
  return (
    <g opacity={o}>
      {ag > 0.01 && <g><polygon points={`${x0},${ye} ${olas} ${x1},${ye}`} fill={S.no[1]} opacity={0.55} /><polygon points={`${x0},${ye} ${olas} ${x1},${ye}`} fill={S.no[2]} opacity={0.35} /></g>}
      {glow > 0.01 && <rect x={x0} y={ye - 16} width={w} height={yl - ye + 26} rx={20} fill={S.lps[1]} opacity={0.3 * glow * (0.75 + 0.25 * Math.sin(reloj / 300))} />}
      <rect x={x0} y={yl} width={w} height={230} fill="#5E1030" /><rect x={x0} y={yl} width={w} height={46} fill="#7A1E3A" opacity={0.7} />
      {Array.from({ length: flujo }, (_, i) => <Hematie key={i} x={x0 + ((hash(i, 21) * w + reloj * (0.05 + hash(i, 23) * 0.03)) % w)} y={yl + 60 + hash(i, 22) * 130} r={hash(i, 24) * 180} k={0.8 + hash(i, 25) * 0.2} />)}
      <rect x={x0} y={ye + eh} width={w} height={g} fill={S.no[2]} opacity={clamp(hinchada * 1.3) * 0.85} />
      <rect x={x0} y={ye + eh} width={w} height={6} fill={S.fibrina[1]} /><rect x={x0} y={yn - 6} width={w} height={6} fill={S.fibrina[1]} />
      <rect x={x0} y={ye + 4} width={w} height={eh} rx={14} fill={S.cito[0]} /><rect x={x0} y={ye} width={w} height={eh} rx={14} fill={S.cito[1]} />
      {xs.map((x, i) => <ellipse key={i} cx={x + 90} cy={ye + eh / 2} rx={36} ry={9} fill={S.nucleo[1]} />)}
      <rect x={x0} y={yn + 4} width={w} height={nh} rx={13} fill={S.endo[0]} /><rect x={x0} y={yn} width={w} height={nh} rx={13} fill={S.endo[1]} />
      {xs.map((x, i) => <ellipse key={i} cx={x - 100} cy={yn + nh / 2} rx={32} ry={8} fill="#7A2A40" />)}
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - abre * 22} y={ye - 4} width={abre * 44} height={eh + 8} fill="var(--se-fondo-a)" opacity={abre} />
          <rect x={x - 11 - abre * 18} y={ye + 2} width={8} height={eh - 4} rx={4} fill={S.gluco[1]} transform={`rotate(${-abre * 16} ${x - 11 - abre * 18} ${ye + 14})`} />
          <rect x={x + 3 + abre * 18} y={ye + 2} width={8} height={eh - 4} rx={4} fill={S.gluco[1]} transform={`rotate(${abre * 16} ${x + 7 + abre * 18} ${ye + 14})`} />
          <rect x={x + 135 - abre * 14} y={yn - 3} width={abre * 28} height={nh + 6} fill="#5E1030" opacity={abre} />
        </g>
      ))}
      {surf > 0.01 && <line x1={x0} x2={x1} y1={ye - 10} y2={ye - 10} stroke={S.lps[1]} strokeWidth={7} strokeDasharray="2 13" strokeLinecap="round" opacity={clamp(surf)} />}
      {fuga > 0.01 && xs.flatMap((x, i) => [0, 1].map((j) => {
        const u = ((reloj / 3200 + (i * 2 + j) / (xs.length * 2)) % 1);
        return <Gotita key={`${i}-${j}`} x={x + (j ? 18 : -14) + Math.sin(u * 8 + i) * 10} y={lerp(yl + 20, ye - 190, u)} k={0.95} o={clamp(fuga) * Math.min(1, u * 6) * (1 - u * 0.7)} />;
      }))}
    </g>
  );
}

/** Saco alveolar en corte. `colapso` 0-1: las paredes se pegan; `agua` 0-1: se llena de líquido; `surf` 0-1: película de surfactante. */
export function Saco({ x = 800, y = 520, R = 240, colapso = 0, agua = 0, surf = 1, reloj = 0, o = 1 }: { x?: number; y?: number; R?: number; colapso?: number; agua?: number; surf?: number; reloj?: number; o?: number }) {
  const id = `saco-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const c = easeOut(clamp(colapso)), rx = R * (1 - 0.86 * c), ry = R * (1 + 0.05 * c), a = easeOut(clamp(agua));
  const resp = 1 + 0.014 * Math.sin(reloj / 700) * (1 - c);
  return (
    <En x={x} y={y} k={resp} o={o}>
      <ellipse cx={0} cy={12} rx={rx + 36} ry={ry + 36} fill={S.endo[0]} />
      <ellipse cx={0} cy={0} rx={rx + 36} ry={ry + 36} fill={S.endo[1]} />
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={S.no[2]} />
      <clipPath id={id}><ellipse cx={0} cy={0} rx={rx} ry={ry} /></clipPath>
      {a > 0.01 && <g clipPath={`url(#${id})`}><rect x={-rx} y={ry - 2 * ry * a} width={2 * rx} height={2 * ry * a + 2} fill={S.no[1]} opacity={0.85} /><rect x={-rx} y={ry - 2 * ry * a} width={2 * rx} height={10} fill={S.no[2]} opacity={0.8} /></g>}
      <ellipse cx={0} cy={0} rx={Math.max(4, rx - 10)} ry={ry - 10} fill="none" stroke={S.lps[1]} strokeWidth={8} strokeDasharray="3 15" strokeLinecap="round" opacity={clamp(surf)} />
      {c > 0.35 && <g stroke={S.endo[0]} strokeWidth={6} strokeLinecap="round" fill="none" opacity={tramo(c, 0.35, 0.8)}>{[-0.6, -0.2, 0.2, 0.6].map((f, i) => <path key={i} d={`M${-rx * 0.5},${ry * f} q${rx * 0.5},${i % 2 ? -10 : 10} ${rx},0`} />)}</g>}
      <ellipse cx={-rx * 0.45} cy={-ry * 0.55} rx={Math.max(6, rx * 0.2)} ry={ry * 0.07} fill="#FFF" opacity={0.55} transform={`rotate(-30 ${-rx * 0.45} ${-ry * 0.55})`} />
    </En>
  );
}

/** Campo de histología (H&E) con sus rasgos del daño alveolar difuso. Todo en coordenadas locales de un círculo de radio `R`. */
export function Histo({ x = 560, y = 520, R = 400, edema = 0, hemorragia = 0, necrosis = 0, neutro = 0, trombos = 0, membrana = 0, o = 1 }: { x?: number; y?: number; R?: number; edema?: number; hemorragia?: number; necrosis?: number; neutro?: number; trombos?: number; membrana?: number; o?: number }) {
  const id = `histo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const salas: number[][] = [
    [-310, -170, -130, -250, 50, -190, 30, -50, -170, 0, -320, -60],
    [100, -300, 270, -230, 310, -90, 170, -30, 70, -120],
    [-300, 60, -150, 50, -100, 230, -240, 320, -340, 200],
    [-60, 70, 120, 40, 240, 120, 200, 280, 30, 330, -90, 220],
    [260, -10, 350, 40, 340, 200, 280, 260],
  ];
  const pts = (a: number[]) => a.map((v, i) => (i % 2 ? `,${v}` : ` ${v}`)).join('').trim().replace(/ ,/g, ',');
  const ed = clamp(edema), hm = clamp(hemorragia), nc = clamp(necrosis), nt = clamp(neutro), tb = clamp(trombos), mb = clamp(membrana);
  const rbc = Array.from({ length: 16 }, (_, i) => [(hash(i, 31) - 0.5) * 560, (hash(i, 32) - 0.5) * 560] as [number, number]);
  const neu = Array.from({ length: 9 }, (_, i) => [(hash(i, 33) - 0.5) * 520, (hash(i, 34) - 0.5) * 520] as [number, number]);
  return (
    <En x={x} y={y} o={o}>
      <clipPath id={id}><circle r={R} /></clipPath>
      <circle r={R + 16} fill="#2A1E3C" /><circle r={R + 6} fill="#8A8098" />
      <g clipPath={`url(#${id})`}>
        <rect x={-R} y={-R} width={2 * R} height={2 * R} fill="#C77BB8" />
        {[[-210, -150], [190, -170], [-200, 190], [150, 200], [10, 10], [280, 130], [-30, -260], [-330, 20]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={34} ry={14} fill="#A83A62" opacity={0.7} transform={`rotate(${i * 37} ${cx} ${cy})`} />)}
        {salas.map((a, i) => <polygon key={i} points={pts(a)} fill={ed > 0.02 ? '#F2C4DE' : '#FDF1F7'} stroke={`rgba(232,80,154,${mb})`} strokeWidth={18} strokeLinejoin="round" />)}
        {ed > 0.02 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(hash(i, 41) - 0.5) * 640} cy={(hash(i, 42) - 0.5) * 640} r={3 + hash(i, 43) * 4} fill="#E79AC4" opacity={0.55 * ed} />)}
        {rbc.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11} fill="#C4163A" opacity={hm * (i < 12 ? 1 : 0.7)} />)}
        {neu.map(([cx, cy], i) => <g key={i} opacity={tramo(nt, i * 0.08, i * 0.08 + 0.3)} transform={`translate(${cx},${cy})`}><circle cx={-8} cy={2} r={10} fill="#3A1E7A" /><circle cx={8} cy={-3} r={10} fill="#3A1E7A" /><circle cx={2} cy={12} r={9} fill="#4A2A9E" /></g>)}
        {[[-230, -120], [-150, 100], [220, -100], [160, 150], [-40, -10], [60, 270]].map(([cx, cy], i) => <g key={i} opacity={tb}><ellipse cx={cx} cy={cy} rx={30} ry={13} fill="#F6D5DD" transform={`rotate(${i * 50} ${cx} ${cy})`} /><path d={`M${cx - 22},${cy} l44,0 M${cx - 16},${cy - 6} l32,12`} stroke="#E8B0C0" strokeWidth={3} /></g>)}
        {[[-300, -100], [90, -250], [-60, 40], [250, 20], [-200, 210]].map(([cx, cy], i) => <g key={i}><ellipse cx={cx} cy={cy} rx={22} ry={9} fill="#3A1E7A" opacity={1 - 0.6 * nc} />{nc > 0.2 && <g fill="#2A1E3C" opacity={nc}><circle cx={cx - 12} cy={cy - 6} r={5} /><circle cx={cx + 8} cy={cy + 8} r={4} /><circle cx={cx + 16} cy={cy - 8} r={3.5} /></g>}</g>)}
      </g>
      <ellipse cx={-R * 0.45} cy={-R * 0.82} rx={R * 0.3} ry={R * 0.03} fill="#FFF" opacity={0.35} transform="rotate(-22)" />
    </En>
  );
}

