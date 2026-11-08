'use client';
// Capítulo 2 · La pared se abre: permeabilidad y reclutamiento del neutrófilo.

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, C5a, En, Eosinofilo, Flecha, FLECHA, Foco, Hematie, Linfocito, Macrofago, Mpo, Neutrofilo, Pr3, Sale, Txt, V, clamp, easeOut, hash, lerp, tramo } from '../Piezas';
import { Basal, Chip, Endo, Histamina, Intersticio, Luz, Selectina, Tallo, Tijera, Union, Viaja, cupula } from '../Fisio';

/** Tramo de pared vista de canto: fila de células endoteliales sobre la basal. `huecos` las separa. */
function Pared({ y = 600, x0 = 0, x1 = 1600, w = 190, huecos = 0, caen = [] as number[], caida = 0, basal = 1, o = 1 }: { y?: number; x0?: number; x1?: number; w?: number; huecos?: number; caen?: number[]; caida?: number; basal?: number; o?: number }) {
  const n = Math.round((x1 - x0) / w);
  return (
    <g opacity={o}>
      <Intersticio y={y + 52} />
      <g opacity={basal}><Basal x0={x0 - 20} x1={x1 + 20} y={y + 30} h={22} /></g>
      {Array.from({ length: n }, (_, i) => {
        const cae = caen.includes(i) ? easeOut(caida) : 0;
        return <Endo key={i} x={x0 + w * (i + 0.5)} y={y + 30 - cae * 170} r={cae * (i % 2 ? 28 : -24)} w={(w - 6) * (1 - 0.25 * huecos)} h={62 + 10 * huecos} muere={cae} sem={i + 2} />;
      })}
      {huecos < 0.05 && Array.from({ length: n - 1 }, (_, i) => <Union key={i} x={x0 + w * (i + 1)} y={y + 30} h={62} />)}
    </g>
  );
}

/** Molécula pequeña que viaja de a a b. */
function Gota({ a, b, q, color, R = 10 }: { a: [number, number]; b: [number, number]; q: number; color: string; R?: number }) {
  if (q <= 0.01) return null;
  const e = easeOut(clamp(q));
  return <circle cx={lerp(a[0], b[0], e)} cy={lerp(a[1], b[1], e)} r={R} fill={color} opacity={tramo(q, 0, 0.2)} />;
}

const Starling: Lamina = ({ p, reloj }) => {
  const rompe = p('rompe'), prot = p('proteinas');
  return (
    <g>
      <Bandera x={800} y={80} txt="Cómo sale y vuelve el líquido" color="var(--cit-base)" p={p('sale')} t={30} punta="no" />
      <rect x={-20} y={180} width={1640} height={200} fill="#F2C0D4" opacity={tramo(p('edema'), 0, 0.5) * 0.5} />
      <Sale p={p('sale')} x={800} y={520}>
        <rect x={-700} y={-90} width={1400} height={180} rx={90} fill={V.endo[0]} />
        <rect x={-690} y={-74} width={1380} height={148} rx={74} fill={V.pared[1]} />
        {[0, 1, 2, 3, 4, 5].map((i) => <Hematie key={i} x={((reloj * 0.07 + i * 260) % 1400) - 700} y={(i % 2 ? 1 : -1) * 22} k={0.7} lado={0.8} />)}
      </Sale>
      {[0, 1, 2].map((i) => <Flecha key={i} a={[260 + i * 120, 440]} b={[260 + i * 120, 300]} p={p('hidro')} color={V.sangre[1]} w={10} />)}
      <Bandera x={380} y={660} txt="↑ Presión hidrostática" color={V.sangre[0]} p={p('hidro')} t={24} punta="no" />
      {[0, 1, 2].map((i) => <Flecha key={i} a={[860 + i * 120, 300]} b={[860 + i * 120, 440]} p={p('onco')} color="#2F6FD8" w={10} />)}
      <Bandera x={980} y={660} txt="↓ Presión oncótica" color="#2F6FD8" p={p('onco')} t={24} punta="no" />
      <Sale p={p('linfa')} x={1380} y={300}><rect x={-120} y={-30} width={240} height={60} rx={30} fill="#6FD06A" /><rect x={-110} y={-20} width={220} height={22} rx={11} fill="#B7F0B2" /></Sale>
      <Txt x={1380} y={380} txt="linfáticos" t={26} p={p('linfa')} />
      {rompe > 0.01 && Array.from({ length: 16 }, (_, i) => <Gota key={i} a={[200 + i * 75, 450]} b={[180 + i * 78 + (hash(i, 2) - 0.5) * 50, 230 + hash(i, 3) * 120]} q={tramo(rompe, i / 30, i / 30 + 0.5)} color="#7FC8F5" R={8} />)}
      {prot > 0.01 && Array.from({ length: 10 }, (_, i) => <Gota key={i} a={[260 + i * 110, 450]} b={[240 + i * 115, 250 + hash(i, 5) * 100]} q={tramo(prot, i / 20, i / 20 + 0.6)} color={V.ambar[1]} R={13} />)}
      <Txt x={560} y={750} txt="agua" t={28} p={rompe} color="#2F86D8" />
      <Txt x={820} y={750} txt="+ proteínas" t={28} p={prot} color={V.ambar[0]} />
      <Bandera x={800} y={830} txt="Exudado" color={V.ambar[0]} p={p('exudado')} t={34} />
      <Txt x={800} y={920} txt="el origen del edema inflamatorio" t={28} p={p('edema')} />
    </g>
  );
};

/** Bradicinina: péptido corto de nueve cuentas. */
function Bradicinina({ k = 1 }: { k?: number }) {
  return <g transform={`scale(${k})`}>{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-24 + i * 6} cy={Math.sin(i * 1.2) * 5} r={4.2} fill={i % 2 ? '#16B9BE' : '#0A7F86'} />)}</g>;
}
/** Leucotrieno: cadena lipídica en zigzag con su cabeza. */
function Leucotrieno({ k = 1 }: { k?: number }) {
  return <g transform={`scale(${k})`}><path d="M-26,0 L-18,-7 L-10,0 L-2,-7 L6,0 L14,-7 L22,0" fill="none" stroke="#E0338A" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /><circle cx={24} cy={0} r={5.5} fill="#B8237A" /></g>;
}

const Contraccion: Lamina = ({ p, reloj }) => {
  const c = p('contraen');
  return (
    <g>
      <Bandera x={800} y={80} txt="El mecanismo más rápido: la contracción endotelial" color="var(--cit-base)" p={p('rapido')} t={28} punta="no" />
      {([['histamina', 'Histamina', V.ambar[1]], ['bradi', 'Bradicinina', '#2CC6B8'], ['leuco', 'Leucotrienos', '#E0338A']] as const).map(([n, txt, col], i) => (
        <g key={n}>
          {[0, 1, 2, 3].map((j) => (
            <Viaja key={j} a={[240 + i * 420 + j * 50, 220]} b={[250 + i * 420 + j * 70, 500 + (j % 2) * 20]} q={tramo(p(n), j * 0.1, 0.8 + j * 0.05)} sem={i * 4 + j}>
              {i === 0 ? <Histamina k={1.5} r={j * 30} /> : i === 1 ? <Bradicinina k={1.4} /> : <Leucotrieno k={1.4} />}
            </Viaja>
          ))}
          <Chip x={330 + i * 420} y={180} txt={txt} color={col} p={p(n)} t={22} />
        </g>
      ))}
      <Pared y={600} huecos={c} />
      {c > 0.01 && [1, 2, 3, 4, 5, 6, 7].map((i) => [0, 1, 2].map((j) => {
        const t = ((reloj / 1600 + j / 3 + i * 0.13) % 1);
        return <path key={`${i}${j}`} d="M0,-9 C5,-3 7,1 7,4 A7,7 0 1 1 -7,4 C-7,1 -5,-3 0,-9 Z" fill="#7FC8F5" transform={`translate(${i * 190},${lerp(560, 720, t)})`} opacity={c * (1 - tramo(t, 0.7, 1))} />;
      }))}
      <Txt x={420} y={720} txt="vénula poscapilar" t={28} p={p('contraen')} />
      <Bandera x={1180} y={720} txt="Abren huecos" color="#2F86D8" p={p('huecos')} t={28} />
      <Txt x={500} y={860} txt="inmediato y breve: 15 a 30 minutos" t={30} p={p('minutos')} />
      <Sale p={p('roncha')} x={1240} y={860} k={0.9}>
        <ellipse rx={120} ry={60} fill="#F6B9C8" /><ellipse cx={-10} cy={-10} rx={90} ry={40} fill="#FBD3DD" />
      </Sale>
      <Txt x={1240} y={950} txt="como una roncha" t={26} p={p('roncha')} />
    </g>
  );
};

const Lesion: Lamina = ({ p }) => {
  const sue = p('suelta');
  return (
    <g>
      <Bandera x={800} y={80} txt="El segundo, más grave: la lesión directa" color={V.sangre[0]} p={p('grave')} t={30} punta="no" />
      <Pared y={560} caen={[3, 4]} caida={p('mueren')} />
      {Array.from({ length: 12 }, (_, i) => <Gota key={i} a={[640 + i * 25, 470]} b={[600 + i * 30, 760 + hash(i, 7) * 80]} q={tramo(p('fuga'), i / 20, i / 20 + 0.6)} color="#7FC8F5" R={9} />)}
      <Txt x={760} y={880} txt="la fuga dura horas o días" t={28} p={p('dias')} />
      <Foco x={300} y={430} R={110} p={p('clave')} />
      <Neutrofilo x={300} y={460} k={1.25} o={tramo(p('leucocito'), 0, 0.3)} activo={sue} />
      {sue > 0.01 && Array.from({ length: 10 }, (_, i) => { const a = Math.PI * (0.15 + i * 0.07); return <circle key={i} cx={300 + Math.cos(a) * 80 * (1 + easeOut(sue))} cy={470 + Math.sin(a) * 60 * (1 + easeOut(sue))} r={7} fill={V.neutro[0]} />; })}
      <Bandera x={300} y={280} txt="El propio leucocito" color={V.nucleo[1]} p={p('leucocito')} t={28} />
      <Txt x={330} y={680} txt="se pega y suelta sus enzimas" t={26} p={sue} />
      <Bandera x={1200} y={300} txt="Así trabaja una vasculitis" color={V.anca[1]} p={p('vasculitis')} t={30} />
    </g>
  );
};

const Purpura: Lamina = ({ p }) => {
  const rojos = p('rojos'), pal = p('palpa'), bl = p('blanquea');
  return (
    <g>
      <Bandera x={800} y={80} txt="Cuando la pared se rompe del todo" color={V.sangre[0]} p={p('rompe')} t={30} punta="no" />
      <Sale p={p('piel')} x={800} y={560}>
        <path d={`M-650,-200 C-200,-200 -160,${-200 - 70 * pal} 0,${-200 - 80 * pal} C160,${-200 - 70 * pal} 200,-200 650,-200 L650,300 L-650,300 Z`} fill="#E9A58A" />
        <path d={`M-650,-200 C-200,-200 -160,${-200 - 70 * pal} 0,${-200 - 80 * pal} C160,${-200 - 70 * pal} 200,-200 650,-200 L650,-150 C200,-150 160,${-150 - 70 * pal} 0,${-150 - 80 * pal} C-160,${-150 - 70 * pal} -200,-150 -650,-150 Z`} fill="#C9806A" />
        <rect x={-650} y={60} width={1300} height={70} rx={35} fill={V.pared[2]} />
        <rect x={-640} y={72} width={1280} height={46} rx={23} fill={V.pared[1]} />
        {Array.from({ length: 22 }, (_, i) => {
          const q = tramo(rojos, i / 30, i / 30 + 0.4);
          return q > 0 ? <Hematie key={i} x={-160 + hash(i, 3) * 320} y={lerp(90, -60 - hash(i, 4) * 120 * (0.5 + pal), easeOut(q))} k={0.5} r={i * 40} o={tramo(q, 0, 0.3)} /> : null;
        })}
        {Array.from({ length: 12 }, (_, i) => <Bola key={i} x={-200 + hash(i, 9) * 400} y={-40 - hash(i, 10) * 90} R={14} tono={V.neutro} o={tramo(pal, i / 16, i / 16 + 0.3)} />)}
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-560 + i * 70} cy={95} r={10} fill={V.sangre[1]} />)}
        {bl > 0.01 && <rect x={-260} y={-330} width={520} height={110} rx={20} fill="#BFE9F5" opacity={0.55 * tramo(bl, 0, 0.3)} />}
      </Sale>
      <Txt x={360} y={190} txt="sale plasma… y glóbulos rojos" t={28} p={rojos} />
      <Bandera x={1280} y={200} txt="Púrpura" color="#7A1F6E" p={p('purpura')} t={34} />
      <Txt x={1280} y={280} txt="se palpa: edema y células" t={26} p={pal} />
      <Bandera x={800} y={940} txt="No se blanquea: la sangre ya está fuera del vaso" color={V.sangre[0]} p={p('fuera')} t={28} />
      <Txt x={1280} y={860} txt="como en nuestra segunda paciente" t={24} p={p('paciente')} fuerte={false} />
    </g>
  );
};

const XS = [115, 345, 575, 805, 1035, 1265, 1495];
const W = 230, H = 70;
/** Superficie del endotelio (base yb) en x. */
const supE = (yb: number, x: number) => {
  const c = XS.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), XS[0]);
  return yb + cupula(W, H, Math.max(-W / 2, Math.min(W / 2, x - c)));
};

/** Corte del vaso para el reclutamiento: luz con sangre que fluye, endotelio, basal y tejido. */
function Corte({ yb, reloj, o = 1, y0 = 130, flujo = 1, gluco = 0, aparte = {} as Record<number, number>, activa = 0 }: { yb: number; reloj: number; o?: number; y0?: number; flujo?: number; gluco?: number; aparte?: Record<number, number>; activa?: number }) {
  return (
    <g opacity={o}>
      <Intersticio y={yb + 22} />
      <Luz y0={y0} y1={yb} reloj={reloj * flujo} n={7} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={((reloj * 0.12 * flujo + i * 380) % 1900) - 200} y={y0 + 50 + (i % 3) * 70} width={110} height={5} rx={2.5} fill="#FFB3C4" opacity={0.25} />)}
      {XS.map((cx, i) => <Endo key={cx} x={cx + (aparte[i] ?? 0)} y={yb} w={W} h={H} gluco={gluco} activa={activa} sem={i + 3} />)}
      {XS.slice(1).map((cx, i) => (aparte[i] || aparte[i + 1] ? null : <Union key={i} x={cx - W / 2} y={yb} h={H} />))}
      <Basal x0={-20} x1={1640} y={yb} h={22} />
    </g>
  );
}

/** Integrina en el borde del leucocito: doblada (0) o extendida (1); apunta hacia +y. */
function Integrina({ x, y, e, r = 0 }: { x: number; y: number; e: number; r?: number }) {
  const ang = lerp(75, 0, e);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(1)})`}>
      <rect x={-4} y={0} width={8} height={26} rx={4} fill="#7A45E6" />
      <g transform={`translate(0,26) rotate(${ang.toFixed(1)})`}><rect x={-4} y={0} width={8} height={24} rx={4} fill="#7A45E6" /><circle cy={28} r={8} fill="#B79BFF" /></g>
    </g>
  );
}

const Marginacion: Lamina = ({ p, reloj }) => {
  const dil = p('dilatan'), esp = p('espesa'), lento = p('enlentece'), mar = p('pared');
  const A = lerp(190, 250, easeOut(dil));
  const yc = 520, yt = yc - A, yb = yc + A;
  const vel = lerp(1, 0.3, lento);
  const xN = ((reloj * 0.2 * vel) % 1900) - 150;
  const xs = Array.from({ length: 8 }, (_, i) => -40 + i * 240);
  return (
    <g>
      <Bandera x={800} y={60} txt="Sigue a un neutrófilo" color="var(--cit-base)" p={p('sigue')} t={30} punta="no" />
      <g opacity={tramo(p('sigue'), 0, 0.4)}>
        <rect x={-200} y={yt - 140} width={2000} height={140} fill="#F6CFE0" opacity={0.55} />
        <rect x={-200} y={yb} width={2000} height={300} fill="#F6CFE0" opacity={0.55} />
        <rect x={-200} y={yt} width={2000} height={yb - yt} fill={V.pared[1]} />
        {Array.from({ length: 18 + Math.round(16 * esp) }, (_, i) => {
          const X = ((hash(i, 11) * 1900 + reloj * (0.2 + hash(i, 12) * 0.05) * vel * (1 - 0.5 * Math.abs(hash(i, 13) - 0.5))) % 1900) - 150;
          const ancho = (A - 90) * lerp(1, 0.7, mar);
          return <Hematie key={i} x={X} y={yc + (hash(i, 13) - 0.5) * 2 * ancho} k={0.62} lado={0.75} r={hash(i, 14) * 30 - 15} />;
        })}
        {xs.map((cx, i) => <Endo key={`b${i}`} x={cx} y={yb} w={240} h={60} sem={i + 1} />)}
        {xs.map((cx, i) => <Endo key={`t${i}`} x={cx + 120} y={yt} w={240} h={60} r={180} sem={i + 9} />)}
        <Basal x0={-60} x1={1660} y={yb} h={20} />
        <Basal x0={-60} x1={1660} y={yt - 20} h={20} />
        {Array.from({ length: 7 }, (_, j) => {
          const f = (j - 3) / 3.4, L = 170 * (1 - f * f) * vel;
          return <Flecha key={j} a={[60, yc + f * (A - 60)]} b={[60 + Math.max(14, L), yc + f * (A - 60)]} p={tramo(p('centro'), 0, 0.6)} color="#FFD6DF" w={5} />;
        })}
        {(dil > 0.01 || esp > 0.01) && Array.from({ length: 14 }, (_, i) => {
          const t = (reloj / 2200 + i / 14) % 1, arriba = i % 2 === 0;
          const x = 120 + i * 105;
          return <path key={i} d="M0,-8 C4,-2 6,1 6,4 A6,6 0 1 1 -6,4 C-6,1 -4,-2 0,-8 Z" fill="#9AD8F7" transform={`translate(${x},${arriba ? lerp(yt + 30, yt - 120, t) : lerp(yb - 30, yb + 130, t)})`} opacity={clamp(dil + esp) * (1 - tramo(t, 0.7, 1))} />;
        })}
        <Neutrofilo x={lerp(xN, 760, easeOut(tramo(mar, 0, 0.7)))} y={lerp(yc, yb - 60 - 62, easeOut(mar))} k={1.05} r={reloj * 0.04 * vel * (1 - mar)} />
      </g>
      <Chip x={1200} y={yt - 80} txt="el vaso se dilata y el plasma sale" color="#2F86D8" p={dil} />
      <Chip x={400} y={yt - 80} txt="la sangre se espesa y se enlentece" color={V.sangre[0]} p={lento} />
      <Bandera x={800} y={920} txt="Marginación" color={V.nucleo[1]} p={p('marginacion')} t={32} />
    </g>
  );
};

const Rodamiento: Lamina = ({ p, reloj }) => {
  const yb = 640, ru = p('rueda'), deb = p('debiles'), sl = tramo(p('slex'), 0, 0.4);
  const R = 72, x = lerp(160, 1380, ru), giro = ((x - 160) / R) * (180 / Math.PI);
  const y = yb - 70 - 40 - R * 1.12 + 4;
  const SEL = Array.from({ length: 32 }, (_, i) => 40 + i * 48);
  const lig = Array.from({ length: 12 }, (_, j) => {
    const a = (j / 12) * Math.PI * 2 + (giro * Math.PI) / 180;
    return { a, x: x + Math.cos(a) * R * 1.12, y: y + Math.sin(a) * R * 1.12 };
  });
  return (
    <g>
      <Bandera x={800} y={60} txt="1 · Rodamiento" color={V.nucleo[1]} p={p('rodamiento')} t={30} punta="no" />
      <Corte yb={yb} reloj={reloj} o={tramo(p('rodamiento'), 0, 0.4)} />
      {SEL.map((sx, i) => {
        const e = i % 2 ? p('esel') : p('psel');
        return <Selectina key={i} x={sx} y={supE(yb, sx) + 2} p={e} color={i % 2 ? '#16B9BE' : '#23B26C'} k={1.4} />;
      })}
      <Neutrofilo x={x} y={y} k={1.25} r={giro} />
      {sl > 0.01 && lig.map((l, j) => (
        <g key={j} opacity={sl}>
          <line x1={x + Math.cos(l.a) * R * 0.98} y1={y + Math.sin(l.a) * R * 0.98} x2={l.x} y2={l.y} stroke="#2F6FD8" strokeWidth={4} />
          <circle cx={l.x} cy={l.y} r={6} fill="#2F6FD8" />
        </g>
      ))}
      {deb > 0.01 && SEL.map((sx, i) => {
        if (Math.abs(sx - x) > R * 0.85) return null;
        const hy = supE(yb, sx) - 40;
        const l = lig.reduce((m, q) => (Math.hypot(q.x - sx, q.y - hy) < Math.hypot(m.x - sx, m.y - hy) ? q : m), lig[0]);
        const e = i % 2 ? p('esel') : p('psel');
        const pulso = 0.5 + 0.5 * Math.sin(reloj / 160 + i * 1.7);
        return <g key={i} opacity={deb * e * pulso}><circle cx={sx} cy={hy} r={16} fill="#FFD23F" opacity={0.35} /><line x1={l.x} y1={l.y} x2={sx} y2={hy} stroke="#FFD23F" strokeWidth={6} strokeLinecap="round" /><circle cx={sx} cy={hy} r={6} fill="#FFF3A8" /></g>;
      })}
      <Chip x={420} y={260} txt="P-selectina (minutos)" color="#11804F" p={p('psel')} />
      <Chip x={1180} y={260} txt="E-selectina (horas)" color="#0A7F86" p={p('esel')} />
      <Chip x={x} y={y - R * 1.4} txt="sialil Lewis X" color="#2F6FD8" p={p('slex')} />
    </g>
  );
};

const Adhesion: Lamina = ({ p, reloj }) => {
  const yb = 660, R = 72;
  const quim = p('quimio'), ints = p('integrinas'), af = p('aferran'), seco = p('seco');
  const xN = lerp(220, 780, easeOut(clamp(quim * 0.5 + ints * 0.5)));
  const sup = supE(yb, 780) - 4;
  const yN = lerp(sup - 120 - R, sup - 64 - R - 58, easeOut(ints)) + 0 * reloj;
  const giro = ((xN - 220) / R) * (180 / Math.PI) * (1 - ints);
  const ICAM = [690, 735, 780, 825, 870];
  const ang = [55, 72, 90, 108, 125];
  return (
    <g>
      <Bandera x={800} y={60} txt="2 · Adhesión firme" color={V.nucleo[1]} p={p('firme')} t={30} punta="no" />
      <Corte yb={yb} reloj={reloj} gluco={0.8} o={tramo(p('firme'), 0, 0.4)} />
      {Array.from({ length: 22 }, (_, i) => { const x = 40 + i * 70; return <circle key={i} cx={x} cy={supE(yb, x) - 46 - (i % 2) * 10} r={8 * easeOut(tramo(quim, i / 30, i / 30 + 0.4))} fill="#E0338A" />; })}
      {ICAM.map((x) => <Tallo key={x} x={x} y={supE(yb, x)} n={5} color="#2F86D8" claro="#A3E3F7" p={tramo(ints, 0, 0.6)} k={1.05} />)}
      {[300, 1300].map((x) => [-30, 0, 30].map((d) => <Tallo key={x + d} x={x + d} y={supE(yb, x + d)} n={7} color="#7A45E6" claro="#CDB4FF" p={p('vcam')} k={0.9} />))}
      <circle cx={xN} cy={yN} r={R * 1.35} fill="#E0338A" opacity={0.18 * tramo(p('il8'), 0, 0.5) * (1 - tramo(af, 0.5, 1))} />
      <Neutrofilo x={xN} y={yN} k={1.25} r={giro} activo={0.4 * seco} />
      {ints > 0.01 && ang.map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return <Integrina key={i} x={xN + Math.cos(rad) * R * 0.95} y={yN + Math.sin(rad) * R * 0.95} e={ints} r={a - 90} />;
      })}
      {af > 0.01 && ICAM.map((x, i) => {
        const rad = (ang[i] * Math.PI) / 180;
        const tx = xN + Math.cos(rad) * (R * 0.95 + 58), ty = yN + Math.sin(rad) * (R * 0.95 + 58);
        return <line key={x} x1={tx} y1={ty} x2={x} y2={supE(yb, x) - 66} stroke="#FFD23F" strokeWidth={6} strokeLinecap="round" opacity={tramo(af, i * 0.1, 0.5 + i * 0.1)} />;
      })}
      {seco > 0.01 && <circle cx={xN} cy={yN} r={R * (1.3 + 0.5 * tramo(seco, 0, 1))} fill="none" stroke="#FFD23F" strokeWidth={5} opacity={1 - tramo(seco, 0.2, 1)} />}
      <Eosinofilo x={lerp(-60, 300, easeOut(p('otros')))} y={supE(yb, 300) - 150 + 40 * p('vcam')} k={0.9} o={tramo(p('otros'), 0, 0.3)} />
      <En x={lerp(1700, 1300, easeOut(p('otros')))} y={supE(yb, 1300) - 150 + 40 * p('vcam')} k={0.3} o={tramo(p('otros'), 0, 0.3)}><Macrofago /></En>
      <Linfocito x={lerp(1700, 1460, easeOut(p('otros')))} y={supE(yb, 1460) - 120} k={0.7} o={tramo(p('otros'), 0, 0.3)} />
      <Chip x={420} y={250} txt="IL-8" color="#E0338A" p={p('il8')} />
      <Chip x={xN} y={yN - R * 1.5} txt="integrinas" color="#7A45E6" p={ints} />
      <Chip x={780} y={yb + 80} txt="ICAM-1" color="#2F86D8" p={af} />
      <Chip x={300} y={yb + 80} txt="VCAM-1" color="#7A45E6" p={p('vcam')} />
      <Chip x={1300} y={yb + 80} txt="VCAM-1" color="#7A45E6" p={p('vcam')} />
    </g>
  );
};

/** Bacteria: bastón verde con su brillo. */
function Bacteria({ x, y, r = 0, o = 1 }: { x: number; y: number; r?: number; o?: number }) {
  return <En x={x} y={y} r={r} o={o}><rect x={-26} y={-11} width={52} height={22} rx={11} fill="#11804F" /><rect x={-22} y={-8} width={40} height={14} rx={7} fill="#23B26C" /><rect x={-16} y={-6} width={16} height={4} rx={2} fill="#7BE3A4" /></En>;
}

const Cruza: Lamina = ({ p, reloj }) => {
  const yb = 470, xj = 690;
  const ap = p('aplana'), pe = p('perfora'), ra = p('rastro');
  const fase1 = easeOut(ap), fase2 = easeOut(pe);
  let x = xj, y = lerp(250, yb - 30, fase1);
  y = lerp(y, yb + 90, fase2);
  x = lerp(x, 1180, easeOut(ra)); y = lerp(y, 760, easeOut(ra));
  const bell = Math.exp(-(((y - (yb - 20)) / 70) ** 2));
  const sx = 1.15 * (1 - 0.62 * bell), sy = 1.15 * (1 + 0.38 * bell);
  const sep = 46 * bell * clamp(ap * 2);
  const BAC: [number, number][] = [[1360, 800], [1410, 760], [1440, 830], [1390, 860], [1330, 740]];
  const gradiente = (n: string, color: string, sem: number) => Array.from({ length: 18 }, (_, i) => {
    const d = 60 + hash(i, sem) * 520, a = Math.PI * (0.55 + hash(i, sem + 1) * 0.9);
    return <circle key={i} cx={1390 + Math.cos(a) * d} cy={800 + Math.sin(a) * d * 0.5} r={6 + 8 * (1 - d / 600)} fill={color} opacity={tramo(p(n), i / 30, i / 30 + 0.4) * (1 - d / 700)} />;
  });
  return (
    <g>
      <Bandera x={800} y={60} txt="3 · Cruza la pared" color={V.nucleo[1]} p={p('cruza')} t={30} punta="no" />
      <Corte yb={yb} reloj={reloj} o={tramo(p('cruza'), 0, 0.4)} aparte={{ 2: -sep, 3: sep }} />
      {[0, 1, 2, 3].map((j) => <g key={j} opacity={tramo(p('pecam'), 0, 0.4)}><rect x={xj - 12 - sep} y={yb - 18 - j * 13} width={12} height={8} rx={4} fill="#2F86D8" /><rect x={xj + sep} y={yb - 18 - j * 13} width={12} height={8} rx={4} fill="#2F86D8" /></g>)}
      {pe > 0.01 && <ellipse cx={xj} cy={yb + 11} rx={46 * easeOut(tramo(pe, 0, 0.6))} ry={13} fill="#F8DDE8" />}
      <Tijera x={xj - 70} y={yb + 40} k={0.7} corta={tramo(pe, 0.2, 0.7)} o={tramo(pe, 0, 0.3) * (1 - tramo(ra, 0, 0.4))} />
      {BAC.map(([bx, by], i) => <Bacteria key={i} x={bx} y={by} r={i * 47} o={tramo(p('bacterias'), i * 0.1, 0.5)} />)}
      {gradiente('c5a', '#FF8A2B', 31)}
      {gradiente('ltb4', '#E0338A', 41)}
      {gradiente('il8', '#3FB6E8', 51)}
      {ra > 0.01 && <path d={`M${xj},${yb + 90} Q900,700 ${x},${y}`} fill="none" stroke="#B9A6F5" strokeWidth={6} strokeDasharray="4 12" strokeLinecap="round" opacity={0.7 * tramo(p('quimiotaxis'), 0, 0.5)} />}
      <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sx.toFixed(3)},${sy.toFixed(3)})`}>
        {ra > 0.05 && <ellipse cx={62} cy={6} rx={36 * tramo(ra, 0, 0.3)} ry={18} fill={V.neutro[1]} />}
        <Neutrofilo activo={0.3 * bell} />
      </g>
      <Chip x={xj - 200} y={yb - 90} txt="PECAM-1" color="#2F86D8" p={p('pecam')} />
      <Chip x={xj - 200} y={yb + 70} txt="colagenasas" color="#0C9E9A" p={pe} />
      <Chip x={1120} y={600} txt="C5a" color="#C2410C" p={p('c5a')} />
      <Chip x={1230} y={560} txt="LTB4" color="#B8237A" p={p('ltb4')} />
      <Chip x={1340} y={600} txt="IL-8" color="#0A7F86" p={p('il8')} />
      <Bandera x={800} y={940} txt="Quimiotaxis" color={V.nucleo[1]} p={p('quimiotaxis')} t={30} />
    </g>
  );
};

const SeActiva: Lamina = ({ p, reloj }) => {
  const fag = p('fagocita'), est = p('estallido'), gr = p('granulos');
  return (
    <g>
      <Bandera x={800} y={80} txt="4 · Al llegar, se activa" color={V.nucleo[1]} p={p('activa')} t={32} punta="no" />
      <Neutrofilo x={500} y={480} k={2.1} activo={gr} />
      <En x={lerp(760, 560, easeOut(fag))} y={lerp(360, 470, easeOut(fag))} k={lerp(1, 0.6, fag)} o={1 - tramo(fag, 0.7, 1) * 0.6}>
        <rect x={-40} y={-16} width={80} height={32} rx={16} fill="#3FB86A" /><rect x={-32} y={-10} width={50} height={10} rx={5} fill="#8FE3A6" />
      </En>
      <Txt x={500} y={760} txt="fagocita" t={28} p={fag} />
      {est > 0.01 && Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + reloj / 900; const d = 150 + 40 * Math.sin(reloj / 200 + i); return <path key={i} d="M0,-12 L4,-3 L13,0 L4,3 L0,12 L-4,3 L-13,0 L-4,-3 Z" fill={V.fibrina[1]} transform={`translate(${(500 + Math.cos(a) * d).toFixed(1)},${(480 + Math.sin(a) * d).toFixed(1)})`} opacity={tramo(est, i / 16, i / 16 + 0.3)} />; })}
      <Txt x={500} y={810} txt="estallido respiratorio · libera gránulos" t={26} p={est} />
      <Sale p={p('mpo')} x={1120} y={330} k={3}><Mpo /></Sale>
      <Bandera x={1300} y={330} txt="Mieloperoxidasa" color={V.mpo[0]} p={p('mpo')} t={26} ancla="izq" punta="izq" />
      <Txt x={1380} y={400} txt="fabrica ácido hipocloroso" t={22} p={p('hocl')} />
      <Sale p={p('pr3')} x={1120} y={520} k={3}><Pr3 /></Sale>
      <Bandera x={1300} y={520} txt="Proteinasa 3" color={V.pr3[0]} p={p('pr3')} t={26} ancla="izq" punta="izq" />
      <Bandera x={800} y={920} txt="En la vasculitis por ANCA: dentro del vaso y contra su pared" color={V.anca[1]} p={p('contra')} t={26} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Starling, Contraccion, Lesion, Purpura, Marginacion, Rodamiento, Adhesion, Cruza, SeActiva];
export default LAMINAS;
