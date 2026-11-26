'use client';
// Capítulo 19 · Cómo se esconde el VHC
//
// El hepatocito como un tablero de timbres: los oídos del endosoma (TLR3, TLR7/8), las antenas del citoplasma (RIG-I, MDA5), los cables MAVS y TRIF
// que llevan la señal al núcleo con TBK1, IRF3 y NF-κB, y los interferones que salen. Después la tijera NS3/4A del virus, que corta los cables y deja
// la alarma sin sonido; las NK que fallan; la respuesta adaptativa (dendríticas, CD8, CD4, B); el linfocito agotado; la región hipervariable de E2 como
// un disfraz que cambia; y por qué la mayoría se cronifica.

import type { Lamina } from '../Lienzo';
import { Tijera, tijeretazo } from '../../bilirrubina/Piezas';
import { Anticuerpo, Busto, Dendritica, Etiqueta, Globo, Helice, Higado, Linfo, Reloj, Sale, Sombra, TXH, Txt, VirionC, H, clamp, easeBack, easeOut, hash, lerp, onda, poli, tramo } from '../Piezas';
import { Hepatocito } from '../Higado';
import { Campana, Fact, Gente, Hilo, Tacha, Tachon, Visto } from '../Extras';

type P2 = [number, number];
const ESM = ['#0B7A4A', '#14B870', '#A4F0CC'] as const;

/** Punto de una curva de Bézier cúbica. */
const bez = (a: P2, b: P2, c: P2, d: P2, t: number): P2 => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
};

/** Un cable de señal que se dibuja de `a` a `d`; con `rota` > 0 se parte por la mitad y deja un hueco. */
function Cable({ a, b, c, d, p = 1, col, w = 10, rota = 0 }: { a: P2; b: P2; c: P2; d: P2; p?: number; col: string; w?: number; rota?: number }) {
  if (p <= 0.01) return null;
  const tramoD = (t0: number, t1: number) => 'M' + Array.from({ length: 31 }, (_, i) => bez(a, b, c, d, lerp(t0, t1, i / 30)).map((v) => v.toFixed(1)).join(',')).join(' L');
  const fin = easeOut(clamp(p)), hueco = 0.07 * clamp(rota);
  const trazos = hueco > 0.005 ? [tramoD(0, 0.5 - hueco), tramoD(0.5 + hueco, fin)] : [tramoD(0, fin)];
  return (
    <g>
      {trazos.map((t, i) => <g key={i}><path d={t} fill="none" stroke="#000" strokeWidth={w + 2} strokeLinecap="round" opacity={0.12} transform="translate(3,6)" /><path d={t} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" /></g>)}
    </g>
  );
}

/** Una estrella de cuatro puntas (el interferón). */
function Estrella({ x, y, k = 1, o = 1, col = '#FFC81E' }: { x: number; y: number; k?: number; o?: number; col?: string }) {
  if (o <= 0.01) return null;
  return <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${k})`} opacity={o}><path d="M0,-20 L6,-6 L20,0 L6,6 L0,20 L-6,6 L-20,0 L-6,-6 Z" fill={col} /><circle r={4} fill="#FFF" opacity={0.8} /></g>;
}

// ─── El tablero de timbres ──────────────────────────────────────────────────
interface TV { endo: number; doble: number; tlr78: number; sencilla: number; cito: number; rig: number; extremos: number; mda5: number; largo: number; mavs: number; trif: number; tbk1: number; irf3: number; nfkb: number; ifn: number; genes: number; rota: number }
const NUC: P2 = [1230, 380], END: P2 = [330, 450], HUB: P2 = [1000, 560];

function Tablero({ reloj, v, solo = false }: { reloj: number; v: TV; solo?: boolean }) {
  const MIT: P2 = solo ? [780, 620] : [800, 770];
  const rot = easeOut(clamp(v.rota));
  const trif: [P2, P2, P2, P2] = [[END[0] + 92, END[1]], [600, 430], [820, 520], [HUB[0] - 46, HUB[1] - 10]];
  const mavs: [P2, P2, P2, P2] = [[MIT[0] + 84, MIT[1] - 20], [960, MIT[1] - 50], [1000, 660], [HUB[0], HUB[1] + 46]];
  const msg = (i: number, col: string, q: number) => {
    const u = (reloj / 1500 + i * 0.5) % 1, uu = u * (rot > 0.5 ? 0.42 : 1);
    const x = lerp(HUB[0] + 12, NUC[0] - 98, uu), y = lerp(HUB[1] - 36, NUC[1] + 90, uu);
    return <g key={i} opacity={q * Math.sin(u * Math.PI)}><circle cx={x + 2} cy={y + 4} r={15} fill="#000" opacity={0.15} /><circle cx={x} cy={y} r={15} fill={col} /><circle cx={x - 4} cy={y - 4} r={4.5} fill="#FFF" opacity={0.7} /></g>;
  };
  const onda2 = (x0: number, y: number, n: number, col: string, q: number, w = 7) => <path d={`M${x0},${y} ${Array.from({ length: n }, (_, i) => `q12,${i % 2 ? 11 : -11} 24,0`).join(' ')}`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(q).toFixed(3)} 1`} />;
  return (
    <g>
      <g transform={solo ? 'translate(800,470) scale(1.3,0.5)' : 'translate(800,590) scale(1.3,0.72)'}>
        <path d={poli(9, 500, 0.05, 2)} fill="var(--hv-cel-0)" transform="translate(8,12)" opacity={0.5} /><path d={poli(9, 500, 0.05, 2)} fill="var(--hv-cel-1)" /><path d={poli(9, 470, 0.05, 3)} fill="var(--hv-cel-2)" opacity={0.55} />
      </g>
      {/* el núcleo con sus genes */}
      <circle cx={NUC[0] + 5} cy={NUC[1] + 9} r={140} fill="#000" opacity={0.14} /><circle cx={NUC[0]} cy={NUC[1]} r={140} fill={H.nucleo[1]} /><circle cx={NUC[0] - 6} cy={NUC[1] - 8} r={128} fill={H.nucleo[2]} opacity={0.5} />
      {[0, 1, 2].map((i) => <rect key={i} x={NUC[0] - 70 + i * 52} y={NUC[1] - 30} width={34} height={70} rx={14} fill={mezclaSimple('#6A4FB8', '#FFC81E', tramo(v.genes, i * 0.15, i * 0.15 + 0.4))} />)}
      {/* el endosoma con sus oídos */}
      <g opacity={tramo(v.endo, 0, 0.4)}>
        <circle cx={END[0]} cy={END[1]} r={96} fill="#FFFFFF" opacity={0.28} /><circle cx={END[0]} cy={END[1]} r={96} fill="none" stroke="#FFB0F0" strokeWidth={10} />
        {!solo && [-24, 24].map((dy) => <g key={dy}><line x1={END[0] - 96} y1={END[1] + dy} x2={END[0] - 126} y2={END[1] + dy} stroke="#1B36A8" strokeWidth={7} strokeLinecap="round" /><circle cx={END[0] - 132} cy={END[1] + dy} r={14} fill="#2F55E0" /></g>)}
      </g>
      {!solo && (
        <g>
          {[-32, 32].map((dx) => <g key={dx} opacity={tramo(v.tlr78, 0, 0.4)}><line x1={END[0] + dx} y1={END[1] + 96} x2={END[0] + dx} y2={END[1] + 124} stroke="#0A7F78" strokeWidth={7} strokeLinecap="round" /><circle cx={END[0] + dx} cy={END[1] + 130} r={14} fill="#10B5A8" /></g>)}
          {onda2(END[0] - 50, END[1] - 14, 4, '#FF8A1E', v.doble)}{onda2(END[0] - 50, END[1] + 6, 4, '#C25A00', v.doble)}
          {onda2(END[0] - 50, END[1] + 44, 4, '#14B870', v.sencilla)}
          <Etiqueta x={200} y={385} txt="TLR3" color="#2F55E0" p={v.endo} t={24} punta="no" />
          <Etiqueta x={END[0] + 120} y={END[1] + 160} txt="TLR7 y 8" color="#0A7F78" p={v.tlr78} t={24} punta="no" />
          {/* las antenas del citoplasma */}
          <g opacity={tramo(v.rig, 0, 0.4)}><line x1={330} y1={722} x2={330} y2={676} stroke="#B8237A" strokeWidth={9} strokeLinecap="round" /><circle cx={330} cy={664} r={18} fill="#E04AB0" /><path d="M312,650 L330,632 L348,650" fill="none" stroke="#B8237A" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></g>
          <Etiqueta x={215} y={740} txt="RIG-I" color="#B8237A" p={v.rig} t={24} punta="no" />
          {onda2(420, 735, 7, '#E04AB0', v.extremos)}
          <g opacity={tramo(v.extremos, 0, 0.4)}>{[0, 1, 2].map((i) => <circle key={i} cx={410 - i * 16} cy={735} r={9} fill="#FFC81E" />)}</g>
          <Txt x={520} y={790} txt="extremos con trifosfato" t={24} p={v.extremos} color={TXH.hep} />
          <g opacity={tramo(v.mda5, 0, 0.4)}><line x1={330} y1={862} x2={330} y2={816} stroke="#1B36A8" strokeWidth={9} strokeLinecap="round" /><circle cx={330} cy={804} r={18} fill="#4F7FF0" /><path d="M312,790 L330,772 L348,790" fill="none" stroke="#1B36A8" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></g>
          <Etiqueta x={215} y={880} txt="MDA5" color="#2F55E0" p={v.mda5} t={24} punta="no" />
          {onda2(420, 880, 13, '#FF8A1E', v.largo)}{onda2(420, 900, 13, '#C25A00', v.largo)}
          <Txt x={590} y={940} txt="ARN largo de doble cadena" t={24} p={v.largo} color={TXH.a} />
          <Txt x={660} y={620} txt="citoplasma" t={28} p={v.cito} color={TXH.hep} />
        </g>
      )}
      {/* los cables, la mitocondria con MAVS y el centro de mando */}
      {!solo && <Cable a={[360, 672]} b={[480, 600]} c={[620, 700]} d={[MIT[0] - 86, MIT[1] - 14]} p={v.mavs} col="#B8237A" w={8} />}
      {!solo && <Cable a={[360, 832]} b={[520, 860]} c={[640, 800]} d={[MIT[0] - 86, MIT[1] + 14]} p={v.mavs} col="#2F55E0" w={8} />}
      <g opacity={tramo(v.mavs, 0, 0.4)}>
        <ellipse cx={MIT[0] + 4} cy={MIT[1] + 8} rx={94} ry={50} fill="#000" opacity={0.14} /><ellipse cx={MIT[0]} cy={MIT[1]} rx={92} ry={50} fill="#C4463C" /><ellipse cx={MIT[0] - 2} cy={MIT[1] - 3} rx={84} ry={42} fill="#EE7A68" />
        <path d={`M${MIT[0] - 56},${MIT[1]} q14,-26 28,0 t28,0 t28,0 t28,0`} fill="none" stroke="#C4463C" strokeWidth={5} strokeLinecap="round" />
      </g>
      {!solo && <Etiqueta x={MIT[0]} y={MIT[1] + 86} txt="MAVS" color="#B8237A" p={v.mavs} t={24} punta="no" />}
      <Cable a={trif[0]} b={trif[1]} c={trif[2]} d={trif[3]} p={v.trif} col="#0A9E9A" w={9} rota={rot} />
      <Cable a={mavs[0]} b={mavs[1]} c={mavs[2]} d={mavs[3]} p={v.mavs} col="#B8237A" w={9} rota={rot} />
      <Fact x={HUB[0]} y={HUB[1]} R={46} tono={H.d} txt="TBK1" t={20} p={v.tbk1} />
      {!solo && <Etiqueta x={640} y={440} txt="TRIF" color="#0A9E9A" p={v.trif} t={22} punta="no" />}
      {msg(0, '#FF8A1E', v.irf3)}{msg(1, '#2F55E0', v.nfkb)}
      {!solo && <Etiqueta x={1090} y={640} txt="IRF3" color="#C25A00" p={v.irf3} t={22} punta="no" />}
      {!solo && <Etiqueta x={1230} y={640} txt="NF-κB" color="#2F55E0" p={v.nfkb} t={22} punta="no" />}
      {/* los interferones salen de la célula */}
      {[0, 1, 2].map((i) => { const u = (reloj / 2200 + i / 3) % 1; return <Estrella key={i} x={lerp(NUC[0] + 110, 1530, u)} y={lerp(NUC[1] - 80, 150, u) + 14 * Math.sin(reloj / 400 + i)} k={0.9} o={v.ifn * Math.sin(u * Math.PI)} />; })}
      {!solo && <Etiqueta x={1440} y={215} txt="interferones" color="#C79A00" p={v.ifn} t={26} punta="no" />}
      {!solo && <Txt x={NUC[0]} y={NUC[1] + 190} txt="genes antivirales" t={26} p={v.genes} color={TXH.kupffer} />}
    </g>
  );
}

/** Mezcla simple de dos colores #rrggbb (0 = a, 1 = b). */
function mezclaSimple(a: string, b: string, q: number): string {
  const f = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  const m = (i: number) => Math.round(lerp(f(a, i), f(b, i), clamp(q))).toString(16).padStart(2, '0');
  return `#${m(0)}${m(1)}${m(2)}`;
}

const V0: TV = { endo: 0, doble: 0, tlr78: 0, sencilla: 0, cito: 0, rig: 0, extremos: 0, mda5: 0, largo: 0, mavs: 0, trif: 0, tbk1: 0, irf3: 0, nfkb: 0, ifn: 0, genes: 0, rota: 0 };

// ─── 0 · Cómo se entera el hepatocito ───────────────────────────────────────
const Alarma: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), tlr3 = p('tlr3'), doble = p('doble'), endosoma = p('endosoma'), tlr78 = p('tlr78'), sencilla = p('sencilla'), citoplasma = p('citoplasma'), rigi = p('rigi'), extremos = p('extremos'), mda5 = p('mda5'), largo = p('largo'), adaptadores = p('adaptadores'), mavs = p('mavs'), trif = p('trif'), tbk1 = p('tbk1'), irf3 = p('irf3'), nfkb = p('nfkb'), interferones = p('interferones'), genes = p('genes');
  const v: TV = { ...V0, endo: Math.max(tlr3, endosoma), doble, tlr78, sencilla, cito: citoplasma, rig: rigi, extremos, mda5, largo, mavs, trif, tbk1, irf3, nfkb, ifn: interferones, genes };
  return (
    <g>
      <Tablero reloj={reloj} v={v} />
      <Globo x={640} y={90} txt="¿cómo se entera un hepatocito de que hay un virus de ARN adentro?" t={30} p={pregunta} colaX={0} />
      <Txt x={END[0]} y={END[1] - 128} txt="endosoma" t={24} p={endosoma} color={TXH.hep} />
      <Txt x={820} y={690} txt="adaptadores" t={26} p={adaptadores * (1 - tramo(mavs, 0, 0.3))} color={TXH.d} />
    </g>
  );
};

// ─── 1 · La tijera NS3/4A ───────────────────────────────────────────────────
const Tijera34: Lamina = ({ p, reloj }) => {
  const tijera = p('tijera'), ns34a = p('ns34a'), serina = p('serina'), corta = p('corta'), mavs = p('mavs'), trif = p('trif'), rompen = p('rompen'), irf3 = p('irf3'), nfkb = p('nfkb'), nollegan = p('nollegan'), ifn = p('ifn'), genes = p('genes'), retrasa = p('retrasa'), nk = p('nk'), adaptativa = p('adaptativa'), alarma = p('alarma'), sonido = p('sonido');
  const v: TV = { ...V0, endo: 1, mavs: 1, trif: 1, tbk1: 1, irf3, nfkb, rota: rompen };
  const snip = tijeretazo(reloj, 700);
  const trifMid = bez([422, 450], [600, 430], [820, 520], [954, 550], 0.5), mavsMid = bez([864, 600], [960, 570], [1000, 660], [1000, 606], 0.5);
  return (
    <g>
      <Tablero reloj={reloj} v={v} solo />
      <Txt x={800} y={110} txt="el virus tiene una tijera" t={36} p={tijera} color={TXH.c} />
      <Etiqueta x={560} y={235} txt="NS3/4A" color="#0B7A4A" p={ns34a} t={30} punta="no" /><Txt x={560} y={290} txt="una serinproteasa" t={24} p={serina} color={TXH.c} />
      <Sale p={Math.max(ns34a, corta)} x={trifMid[0]} y={trifMid[1] - 60}><g transform="rotate(90)"><Tijera color="#0B7A4A" corta={corta > 0.1 ? snip : 0} k={0.8} /></g></Sale>
      <Sale p={Math.max(ns34a, corta)} x={mavsMid[0]} y={mavsMid[1] + 78}><g transform="rotate(-90)"><Tijera color="#0B7A4A" corta={corta > 0.1 ? snip : 0} k={0.8} /></g></Sale>
      <Etiqueta x={560} y={540} txt="TRIF" color="#0A9E9A" p={trif} t={22} punta="no" /><Etiqueta x={880} y={700} txt="MAVS" color="#B8237A" p={mavs} t={22} punta="no" />
      <Txt x={760} y={800} txt="se rompen los cables de las alarmas" t={26} p={rompen} color={TXH.sangre} />
      <Tacha x={1130} y={440} r={36} p={nollegan} /><Txt x={1230} y={590} txt="no llegan al núcleo" t={24} p={nollegan} color={TXH.sangre} />
      <Txt x={1230} y={640} txt="no hay interferón beta" t={24} p={ifn} color={TXH.gris} /><Txt x={1230} y={685} txt="ni genes estimulados" t={24} p={genes} color={TXH.gris} />
      {/* se retrasan las NK y la respuesta adaptativa */}
      <Linfo x={250} y={880} k={0.8} tono={H.nk} reloj={reloj} o={tramo(nk, 0, 0.4)} /><Reloj x={380} y={880} k={0.7} ang={(reloj / 25) % 360} o={tramo(nk, 0, 0.4)} />
      <Txt x={320} y={960} txt="se retrasan las NK" t={22} p={Math.max(retrasa, nk)} color={TXH.hep} />
      <Linfo x={700} y={880} k={0.8} tono={H.cd8} reloj={reloj} o={tramo(adaptativa, 0, 0.4)} /><Reloj x={830} y={880} k={0.7} ang={(reloj / 25) % 360} o={tramo(adaptativa, 0, 0.4)} />
      <Txt x={770} y={960} txt="y la respuesta adaptativa" t={22} p={adaptativa} color={TXH.hep} />
      <Campana x={1330} y={870} k={1.1} suena={0} reloj={reloj} o={tramo(alarma, 0, 0.4)} /><Tacha x={1330} y={870} r={50} p={sonido} />
      <Txt x={1330} y={960} txt="una alarma sin sonido" t={26} p={sonido} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Las NK también fallan ──────────────────────────────────────────────
const NkFallan: Lamina = ({ p, reloj }) => {
  const nk = p('nk'), fallan = p('fallan'), modula = p('modula'), receptores = p('receptores'), deteriora = p('deteriora'), citotoxica = p('citotoxica'), defensa = p('defensa'), temprana = p('temprana'), tiempo = p('tiempo'), primero = p('primero'), alarma = p('alarma'), luego = p('luego'), desarma = p('desarma'), guardias = p('guardias');
  const avance = easeOut(tiempo), nx = lerp(420, 640, 0.4 * avance) + 10 * Math.sin(reloj / 400);
  return (
    <g>
      <Linfo x={nx} y={470} k={1.9} tono={H.nk} reloj={reloj} activo={0.5 * tramo(nk, 0, 0.3)} agotado={0.5 * easeOut(desarma)} o={tramo(nk, 0, 0.4)} />
      <Etiqueta x={430} y={265} txt="células NK" color="#A81878" p={nk} t={30} punta="no" />
      {/* los receptores de la NK cambian de color: el virus los modula */}
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 6.283 + reloj / 4000; return <circle key={i} cx={nx + Math.cos(a) * 190} cy={470 + Math.sin(a) * 160} r={11} fill={`hsl(${lerp(320, 30, easeOut(modula)) + 20 * Math.sin(i)},70%,55%)`} opacity={tramo(receptores, 0, 0.4)} />; })}
      <Txt x={430} y={680} txt="el virus modula sus receptores" t={26} p={modula} color={TXH.hep} />
      {/* los gránulos citotóxicos se apagan */}
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={nx - 40 + (i % 3) * 36} cy={470 + (i < 3 ? -10 : 28)} r={7} fill="#FFC81E" opacity={0.95 - 0.8 * easeOut(deteriora)} />)}
      <Txt x={430} y={735} txt="deteriora su capacidad citotóxica" t={26} p={deteriora} color={TXH.sangre} /><Tacha x={nx} y={470} r={60} p={citotoxica} />
      <Hepatocito x={1130} y={470} k={1.6} reloj={reloj} sem={9} infecta={H.c} brillo={1} />
      <Txt x={1130} y={640} txt="hepatocito infectado" t={26} p={fallan} color={TXH.c} />
      <Txt x={800} y={130} txt="las NK también fallan" t={38} p={fallan} color={TXH.hep} />
      <Txt x={800} y={200} txt="otra defensa temprana" t={28} p={defensa} color={TXH.d} />
      <Reloj x={800} y={470} k={1.0} ang={(reloj / 18) % 360} o={tramo(temprana, 0, 0.4)} />
      <Txt x={800} y={560} txt="que no llega a tiempo" t={26} p={tiempo} color={TXH.sangre} />
      {/* primero se silencia la alarma, luego se desarma a los guardias */}
      <Campana x={330} y={860} k={1.0} suena={0} reloj={reloj} o={tramo(alarma, 0, 0.4)} /><Tacha x={330} y={860} r={48} p={alarma} />
      <Txt x={330} y={950} txt="primero se silencia la alarma" t={26} p={primero} color={TXH.hep} />
      <Txt x={800} y={870} txt="luego" t={34} p={luego} color={TXH.gris} />
      <Linfo x={1120} y={860} k={0.9} tono={H.nk} reloj={reloj} agotado={easeOut(desarma)} o={tramo(desarma, 0, 0.4)} /><Tacha x={1120} y={860} r={50} p={guardias} />
      <Txt x={1120} y={950} txt="se desarma a los guardias" t={26} p={guardias} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · La respuesta adaptativa ────────────────────────────────────────────
const Adaptativa: Lamina = ({ p, reloj }) => {
  const adaptativa = p('adaptativa'), dendriticas = p('dendriticas'), presentan = p('presentan'), cd8 = p('cd8'), ganglios = p('ganglios'), cruzada = p('cruzada'), matan = p('matan'), perforinas = p('perforinas'), granzimas = p('granzimas'), fas = p('fas'), ifn = p('ifn'), tnf = p('tnf'), frenan = p('frenan'), sinmatar = p('sinmatar'), cd4 = p('cd4'), sostienen = p('sostienen'), b = p('b'), anticuerpos = p('anticuerpos'), e1 = p('e1'), equipo = p('equipo');
  const flota = (i: number) => ((reloj / 1300 + i / 4) % 1);
  return (
    <g>
      <Globo x={500} y={80} txt="¿y la respuesta adaptativa?" t={32} p={adaptativa} colaX={0} />
      {/* el ganglio: la dendrítica presenta el antígeno al CD8 */}
      <ellipse cx={254} cy={344} rx={170} ry={110} fill="#000" opacity={0.1} /><ellipse cx={250} cy={338} rx={170} ry={110} fill="#F3D9E6" opacity={tramo(ganglios, 0, 0.4)} />
      <Dendritica x={210} y={338} k={1.4} o={tramo(dendriticas, 0, 0.4)} />
      {[0, 1, 2, 3].map((i) => { const f = flota(i); return <circle key={i} cx={lerp(290, 450, f)} cy={lerp(330, 360, f)} r={8} fill="#14B870" opacity={tramo(presentan, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      <Linfo x={480} y={360} k={1.1} tono={H.cd8} reloj={reloj} activo={0.4 * tramo(cd8, 0, 0.3)} o={tramo(cd8, 0, 0.4)} />
      <Etiqueta x={210} y={480} txt="células dendríticas" color="#B8237A" p={dendriticas} t={24} punta="no" /><Txt x={300} y={548} txt="presentan los antígenos" t={22} p={presentan} color={TXH.c} />
      <Etiqueta x={500} y={480} txt="CD8" color="#0A7F78" p={cd8} t={26} punta="no" /><Txt x={330} y={598} txt="en los ganglios del hígado" t={22} p={ganglios} color={TXH.gris} />
      <Etiqueta x={330} y={655} txt="presentación cruzada" color="#8A4FE8" p={cruzada} t={24} punta="no" />
      {/* los CD8 matan con perforinas, granzimas y Fas; con interferón gamma y TNF-α frenan al virus sin matar */}
      <Linfo x={820} y={380} k={1.2} tono={H.cd8} reloj={reloj} activo={0.7 * tramo(matan, 0, 0.3)} o={tramo(matan, 0, 0.4)} />
      <Hepatocito x={1060} y={380} k={1.1} reloj={reloj} sem={10} infecta={H.c} brillo={1 - 0.8 * easeOut(fas)} apop={0.7 * easeOut(fas)} />
      {[0, 1, 2, 3].map((i) => { const f = flota(i); return <circle key={i} cx={lerp(900, 1000, f)} cy={380 + 18 * (i - 1.5)} r={6} fill="#FFC81E" opacity={tramo(perforinas, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      {[0, 1, 2].map((i) => { const f = flota(i + 2); return <circle key={i} cx={lerp(900, 1000, f)} cy={400 + 18 * (i - 1)} r={5} fill="#E5324C" opacity={tramo(granzimas, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      <Etiqueta x={820} y={500} txt="matan con" color="#0A7F78" p={matan} t={24} punta="no" />
      <Txt x={1060} y={520} txt="perforinas" t={22} p={perforinas} color={TXH.kupffer} /><Txt x={1060} y={556} txt="granzimas" t={22} p={granzimas} color={TXH.sangre} /><Txt x={1060} y={592} txt="y Fas" t={22} p={fas} color={TXH.hep} />
      <Hepatocito x={1400} y={380} k={0.95} reloj={reloj} sem={11} infecta={H.c} brillo={1 - 0.9 * easeOut(frenan)} />
      {[0, 1, 2].map((i) => { const f = flota(i); return <Estrella key={i} x={1400 + 90 * Math.cos(i * 2.1 + reloj / 900)} y={380 + 90 * Math.sin(i * 2.1 + reloj / 900)} k={0.7} o={tramo(ifn, 0, 0.3) * (0.5 + 0.5 * Math.sin(f * Math.PI))} />; })}
      <Txt x={1400} y={500} txt="interferón gamma" t={22} p={ifn} color={TXH.kupffer} /><Txt x={1400} y={536} txt="y TNF-α" t={22} p={tnf} color={TXH.kupffer} />
      <Txt x={1400} y={600} txt="frenan al virus" t={24} p={frenan} color={TXH.c} /><Txt x={1400} y={640} txt="sin matar" t={24} p={sinmatar} color={TXH.c} />
      {/* los CD4 ayudan a los B, que fabrican anticuerpos contra E1 y E2 */}
      <Linfo x={300} y={830} k={1.1} tono={H.cd4} reloj={reloj} o={tramo(cd4, 0, 0.4)} /><Etiqueta x={300} y={925} txt="CD4" color="#1E4FC0" p={cd4} t={26} punta="no" /><Txt x={470} y={770} txt="los sostienen" t={22} p={sostienen} color={TXH.b} />
      <Linfo x={640} y={830} k={1.1} tono={H.ac} reloj={reloj} o={tramo(b, 0, 0.4)} /><Etiqueta x={640} y={925} txt="linfocitos B" color="#6A9A00" p={b} t={24} punta="no" />
      {[0, 1, 2].map((i) => { const f = flota(i); return <Anticuerpo key={i} x={lerp(740, 960, f)} y={800 + 28 * i} k={0.9} r={-90} o={tramo(anticuerpos, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      <Txt x={850} y={740} txt="anticuerpos" t={22} p={anticuerpos} color={TXH.ac} />
      <VirionC x={1110} y={830} k={1.0} reloj={reloj} o={tramo(anticuerpos, 0, 0.4)} /><Etiqueta x={1110} y={925} txt="E1 y E2" color="#14B870" p={e1} t={24} punta="no" />
      <Txt x={1400} y={850} txt="un equipo completo" t={34} p={equipo} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · El linfocito agotado ───────────────────────────────────────────────
const Agotados: Lamina = ({ p, reloj }) => {
  const estimulacion = p('estimulacion'), cansa = p('cansa'), linfocitos = p('linfocitos'), pierden = p('pierden'), proliferar = p('proliferar'), matar = p('matar'), menos = p('menos'), il2 = p('il2'), tnf = p('tnf'), ifn = p('ifn'), agotados = p('agotados'), alcanzan = p('alcanzan');
  const barras = [
    { t: 'proliferar', q: proliferar, c: '#14B870' }, { t: 'matar', q: matar, c: '#E5324C' }, { t: 'IL-2', q: il2, c: '#2F55E0' }, { t: 'TNF-α', q: tnf, c: '#E8841E' }, { t: 'IFN-γ', q: ifn, c: '#C79A00' },
  ];
  const cae = easeOut(Math.max(cansa, pierden * 0.7));
  return (
    <g>
      <Txt x={800} y={110} txt="la estimulación continua cansa" t={40} p={Math.max(estimulacion, cansa)} color={TXH.hep} />
      <Linfo x={380} y={480} k={2.5} tono={H.cd8} reloj={reloj} agotado={Math.max(easeOut(agotados), cae * 0.8)} activo={0.4 * (1 - cae)} o={tramo(linfocitos, 0, 0.4)} />
      {[0, 1, 2, 3, 4].map((i) => { const f = ((reloj / 1200 + i / 5) % 1); return <circle key={i} cx={lerp(120, 330, f)} cy={lerp(240 + i * 120, 480, f)} r={9} fill="#14B870" opacity={tramo(estimulacion, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      <Etiqueta x={380} y={720} txt="linfocitos T" color="#0A7F78" p={linfocitos} t={28} punta="no" />
      <Txt x={380} y={790} txt="pierden la capacidad" t={26} p={pierden} color={TXH.sangre} /><Txt x={380} y={832} txt="de proliferar y de matar" t={26} p={Math.max(proliferar, matar)} color={TXH.sangre} />
      {/* lo que producen: cada barra cae */}
      <Txt x={1090} y={230} txt="producen menos" t={30} p={menos} color={TXH.hep} />
      {barras.map((br, i) => {
        const x = 800 + i * 150, alto = 300, h = alto * (1 - 0.82 * easeOut(br.q)), o = tramo(i < 2 ? pierden : menos, 0, 0.4);
        return (
          <g key={br.t} opacity={o}>
            <rect x={x - 38} y={760 - alto} width={76} height={alto} rx={22} fill="#000" opacity={0.08} />
            <rect x={x - 38} y={760 - h} width={76} height={h} rx={22} fill={br.c} /><rect x={x - 30} y={760 - h + 8} width={14} height={Math.max(0, h - 18)} rx={7} fill="#FFF" opacity={0.28} />
          </g>
        );
      })}
      {barras.map((br, i) => <Txt key={br.t} x={800 + i * 150} y={806} txt={br.t} t={22} p={i < 2 ? pierden : menos} color={TXH.gris} />)}
      <Txt x={800} y={960} txt="agotados, ya no alcanzan" t={40} p={Math.max(agotados, alcanzan)} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · Un disfraz que cambia ──────────────────────────────────────────────
const Disfraz: Lamina = ({ p, reloj }) => {
  const esconde = p('esconde'), hvr = p('hvr'), e1e2 = p('e1e2'), muta = p('muta'), rapido = p('rapido'), casi = p('casi'), variantes = p('variantes'), escapan = p('escapan'), sobreviven = p('sobreviven'), predominar = p('predominar'), cambia = p('cambia'), antigenos = p('antigenos'), alcanza = p('alcanza'), disfraz = p('disfraz');
  const vel = 1 + 5 * easeOut(rapido);
  const hue = (i: number) => (i * 47 + (reloj / 18) * vel * (0.2 + muta)) % 360;
  const golpe = Math.abs(Math.sin(reloj / 520)) * tramo(escapan, 0, 0.3);
  return (
    <g>
      <Globo x={640} y={85} txt="¿cómo se esconde el virus C de los anticuerpos?" t={32} p={esconde} colaX={0} />
      <VirionC x={400} y={470} k={2.3} reloj={reloj} />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 6.283 + 0.3; return <circle key={i} cx={400 + Math.cos(a) * 205} cy={470 + Math.sin(a) * 205} r={13} fill={`hsl(${hue(i)},75%,52%)`} opacity={tramo(hvr, 0, 0.4)} />; })}
      <Etiqueta x={400} y={225} txt="región hipervariable" color="#E5324C" p={hvr} t={26} punta="no" /><Txt x={400} y={730} txt="de E1 y de E2" t={24} p={e1e2} color={TXH.c} />
      <Txt x={400} y={785} txt="muta muy rápido" t={28} p={Math.max(muta, rapido)} color={TXH.sangre} /><Etiqueta x={400} y={850} txt="cuasiespecies" color="#0B7A4A" p={casi} t={26} punta="no" />
      {/* el anticuerpo tallado para una variante vieja ya no encaja */}
      <Anticuerpo x={960 - 70 * golpe} y={470} k={2.4} r={-90} o={tramo(escapan, 0, 0.4)} />
      <Tacha x={810} y={470} r={46} p={escapan} />
      <Txt x={960} y={330} txt="escapan de los anticuerpos" t={26} p={escapan} color={TXH.sangre} /><Txt x={960} y={372} txt="y de los linfocitos" t={24} p={sobreviven} color={TXH.sangre} />
      {/* las variantes: la vieja se encoge y las que escapan pasan a predominar */}
      <Txt x={1330} y={190} txt="variantes" t={28} p={variantes} color={TXH.d} />
      {[0, 1, 2, 3, 4].map((i) => {
        const base = [0.8, 0.12, 0.08, 0.05, 0.05][i], fin = [0.06, 0.2, 0.9, 0.55, 0.3][i], q = lerp(base, fin, easeOut(predominar)) * (1 - 0.0), h = 360 * lerp(base, q, 1);
        return (
          <g key={i} opacity={tramo(variantes, i * 0.1, i * 0.1 + 0.4)}>
            <rect x={1130 + i * 90 - 30} y={640 - 360} width={60} height={360} rx={18} fill="#000" opacity={0.07} />
            <rect x={1130 + i * 90 - 30} y={640 - h} width={60} height={h} rx={18} fill={`hsl(${i * 70 + 40},65%,45%)`} /><rect x={1130 + i * 90 - 22} y={640 - h + 8} width={10} height={Math.max(0, h - 16)} rx={5} fill="#FFF" opacity={0.3} />
          </g>
        );
      })}
      <Txt x={1330} y={690} txt="las que escapan, predominan" t={24} p={predominar} color={TXH.hep} />
      <Txt x={800} y={920} txt="cambia sus antígenos" t={32} p={Math.max(cambia, antigenos)} color={TXH.hep} />
      <Txt x={800} y={965} txt="más deprisa de lo que el sistema inmune los alcanza" t={26} p={alcanza} color={TXH.c} />
      <Txt x={1330} y={790} txt="un disfraz que cambia" t={30} p={disfraz} color={TXH.d} />
    </g>
  );
};

// ─── 6 · Por qué se cronifica la mayoría ────────────────────────────────────
const Cronifica: Lamina = ({ p, reloj }) => {
  const cronifica = p('cronifica'), treinta = p('treinta'), elimina = p('elimina'), meses = p('meses'), resto = p('resto'), rango = p('rango'), cronico = p('cronico'), variantes = p('variantes'), lambda = p('lambda'), influyen = p('influyen'), anos = p('anos'), quince = p('quince'), cirrosis = p('cirrosis'), cifra = p('cifra'), curar = p('curar');
  const gente = (i: number) => {
    const col = i < 6 ? '#1FA85A' : '#E5324C', q = i < 6 ? tramo(Math.max(treinta, elimina), 0, 0.5) : tramo(Math.max(resto, rango, cronico), 0, 0.5);
    const x = 140 + (i % 10) * 78, y = 270 + Math.floor(i / 10) * 120, z = easeBack(q);
    return q > 0.01 ? <Gente key={i} x={x} y={y + 4 * Math.sin(reloj / 600 + i)} col={col} k={z} /> : null;
  };
  const bx = (u: number) => 440 + 520 * u;
  return (
    <g>
      <Globo x={560} y={85} txt="¿por qué se cronifica la mayoría?" t={32} p={cronifica} colaX={0} />
      {Array.from({ length: 20 }, (_, i) => gente(i))}
      <Etiqueta x={330} y={530} txt="cerca del 30 % elimina el virus" color="#1FA85A" p={treinta} t={26} punta="no" /><Txt x={330} y={584} txt="solo en los primeros 6 meses" t={24} p={meses} color={TXH.c} />
      <Etiqueta x={740} y={530} txt="55 a 85 % queda crónico" color="#E5324C" p={rango} t={26} punta="no" /><Txt x={740} y={584} txt="el resto" t={24} p={resto} color={TXH.sangre} />
      {/* variantes cerca de los genes del interferón lambda */}
      <Helice x={1230} y={300} w={300} amp={26} reloj={reloj} p={variantes} grosor={11} tono={H.adn} vueltas={2} />
      <Etiqueta x={1230} y={210} txt="IFNL3 · interferón lambda" color="#2F55E0" p={lambda} t={24} punta="no" />
      <Txt x={1230} y={400} txt="variantes cerca de sus genes" t={24} p={variantes} color={TXH.b} /><Txt x={1230} y={445} txt="influyen en quién lo elimina" t={24} p={influyen} color={TXH.b} />
      {/* en 20 años, cirrosis en 15 a 30 % de los crónicos */}
      <Reloj x={200} y={760} k={0.9} ang={(reloj / 22) % 360} o={tramo(anos, 0, 0.4)} /><Etiqueta x={200} y={850} txt="en 20 años" color="#6A35A0" p={anos} t={28} punta="no" />
      <Txt x={700} y={690} txt="de los crónicos" t={24} p={quince} color={TXH.gris} />
      <rect x={440} y={738} width={520} height={44} rx={22} fill="#E6DDF2" opacity={tramo(quince, 0, 0.4)} />
      <rect x={bx(0.15)} y={738} width={Math.max(0, 520 * 0.15 * easeOut(quince))} height={44} rx={12} fill="#B8602F" />
      <Txt x={bx(0.15)} y={820} txt="15 %" t={26} p={quince} color={TXH.hep} /><Txt x={bx(0.3)} y={820} txt="30 %" t={26} p={quince} color={TXH.hep} />
      <Sale p={cirrosis} x={1130} y={760} k={0.3}><Higado corte={false} /></Sale><Txt x={1130} y={850} txt="desarrollan cirrosis" t={28} p={cirrosis} color={TXH.hep} />
      <Txt x={800} y={915} txt="una cifra que justifica" t={26} p={cifra} color={TXH.c} /><Txt x={800} y={962} txt="curar a tiempo" t={36} p={curar} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Alarma, Tijera34, NkFallan, Adaptativa, Agotados, Disfraz, Cronifica];
export default LAMINAS;
