'use client';
// Capítulo 5 · El hígado en el laboratorio
//
// Las enzimas son frijolitos brillantes (ALT amarilla, AST naranja) que se escapan por la grieta de la membrana y bajan por el sinusoide con
// los glóbulos; la bilirrubina es una gota que se atasca en un canalículo apretado y refluye; el INR es una cascada de bolitas numeradas
// con el factor VII, el primero en caer, junto a su reloj. Todo respira: la célula late, la sangre corre, la alarma suena.

import type { Lamina } from '../Lienzo';
import { Albumina } from '../../bilirrubina/Piezas';
import { Caracol } from '../../vih-sifilis/Piezas';
import { Busto, Corazon, Etiqueta, Flecha, Globo, Gota, Higado, Intestino, Mitocondria, Nota, Reloj, Rinon, Sale, Sombra, TXH, Toro, TuboEnsayo, Txt, VirionB, Zoom, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo } from '../Piezas';
import { Colageno, Corre, Hepatocito, TuboCurvo } from '../Higado';
import { BarraLab, FrascoOrina } from '../Clinica';
import { Banda, Calendario, Campana, Fact, Trabaja, Visto } from '../Extras';

type P2 = [number, number];
const AL = ['#C99300', '#FFD23F'] as const; // ALT: amarillo vivo
const AS = ['#C2540A', '#FF8A1E'] as const; // AST: naranja

/** Una enzima: frijolito con su sombra y su brillo. */
function Enz({ x, y, k = 1, o = 1, r = 0, tono }: { x: number; y: number; k?: number; o?: number; r?: number; tono: readonly string[] }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} />
      <ellipse rx={13} ry={9} fill={tono[0]} />
      <ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill={tono[1]} />
      <ellipse cx={-4.5} cy={-3.6} rx={4.4} ry={2.2} fill="#FFF" opacity={0.75} />
    </g>
  );
}

/** La grieta de la membrana: un zigzag blanco con borde oscuro que se dibuja. */
function Grieta({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  if (p <= 0.003) return null;
  const d = 'M0,-62 L14,-36 L-8,-12 L16,12 L-6,38 L10,64';
  const da = `${easeOut(clamp(p)).toFixed(3)} 1`;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <path d={d} pathLength={1} strokeDasharray={da} fill="none" stroke="#7A1230" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} pathLength={1} strokeDasharray={da} fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Posición de una enzima: dentro de la célula → en la grieta → en la sangre (que baja por el vaso de abscisa `vx`). */
function tray(i: number, dentro: P2, salida: P2, vx: number, rompe: number, sangre: number, reloj: number): P2 {
  const jx = 5 * Math.sin(reloj / 420 + i * 1.9) * (1 - rompe), jy = 5 * Math.cos(reloj / 510 + i * 2.3) * (1 - rompe);
  const a: P2 = [lerp(dentro[0] + jx, salida[0], easeOut(rompe)), lerp(dentro[1] + jy, salida[1] + (i % 5 - 2) * 12, easeOut(rompe))];
  const by = 280 + ((hash(i, 4) * 500 + reloj * 0.045) % 500);
  const b: P2 = [vx + (hash(i, 3) - 0.5) * 66, by];
  const q = easeOut(sangre);
  return [lerp(a[0], b[0], q), lerp(a[1], b[1], q)];
}

/** Un vaso vertical (sinusoide) con glóbulos que bajan. */
function Sinusoide({ x, y0 = 250, y1 = 790, w = 130, reloj, p = 1, vel = 0.00007 }: { x: number; y0?: number; y1?: number; w?: number; reloj: number; p?: number; vel?: number }) {
  if (p <= 0.003) return null;
  const a: P2 = [x, y0], b: P2 = [x, y1], c: P2 = [x + 26, (y0 + y1) / 2];
  const camino = (u: number): P2 => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  return (
    <g>
      <TuboCurvo a={a} b={b} c={c} w={w} tono={H.endo} p={p} />
      <Corre camino={camino} reloj={reloj} n={6} vel={vel} tono={H.sangre} R={17} sem={3} o={tramo(p, 0.5, 1)} />
    </g>
  );
}

/** Eje y curva de una enzima en sangre: sube de golpe en 12 h y baja con su vida media. `p` 0-1 dibuja la curva; `marca` muestra la media vida. */
function CurvaEnz({ x, y, w = 440, h = 220, vida, tono, p, marca = 0, o = 1, grosor = 12, rotulo }: { x: number; y: number; w?: number; h?: number; vida: number; tono: readonly string[]; p: number; marca?: number; o?: number; grosor?: number; rotulo?: string }) {
  if (p <= 0.003 || o <= 0.003) return null;
  const pts: P2[] = Array.from({ length: 49 }, (_, i) => {
    const t = (i / 48) * 144, v = t < 12 ? Math.sin((t / 12) * Math.PI / 2) : Math.exp(-Math.LN2 * (t - 12) / vida);
    return [x + (t / 144) * w, y - v * h];
  });
  const d = 'M' + pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L');
  const da = `${clamp(p).toFixed(3)} 1`;
  const xm = x + ((12 + vida) / 144) * w;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <path d={d} pathLength={1} strokeDasharray={da} fill="none" stroke={tono[0]} strokeWidth={grosor + 4} strokeLinecap="round" strokeLinejoin="round" transform="translate(0,5)" opacity={0.55} />
      <path d={d} pathLength={1} strokeDasharray={da} fill="none" stroke={tono[1]} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" />
      {marca > 0.003 && (
        <g opacity={tramo(marca, 0, 0.5)}>
          <line x1={xm} x2={xm} y1={y} y2={y - h * 0.5} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="3 9" strokeLinecap="round" />
          <line x1={x} x2={xm} y1={y - h * 0.5} y2={y - h * 0.5} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="3 9" strokeLinecap="round" />
          <circle cx={xm} cy={y - h * 0.5} r={11} fill={tono[1]} /><circle cx={xm - 2} cy={y - h * 0.5 - 2} r={8} fill="#FFF" opacity={0.5} />
        </g>
      )}
    </g>
  );
}

/** Los ejes del gráfico de las enzimas. */
function EjesEnz({ x, y, w = 440, h = 220, p = 1, rotulo }: { x: number; y: number; w?: number; h?: number; p?: number; rotulo?: string }) {
  if (p <= 0.003) return null;
  return (
    <g opacity={tramo(p, 0, 0.5)}>
      <path d={`M${x},${y - h - 18} L${x},${y} L${x + w + 18},${y}`} fill="none" stroke="var(--cit-flecha)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <Txt x={x + w - 6} y={y + 30} txt={rotulo ?? 'horas'} t={22} fuerte={false} p={p} />
    </g>
  );
}

// ─── 0 · Destrucción frente a función ───────────────────────────────────────
const Contraste: Lamina = ({ p, reloj }) => {
  const analisis = p('analisis'), destruccion = p('destruccion'), escapan = p('escapan'), funcion = p('funcion'), bili = p('bili'), alb = p('alb'), inr = p('inr'), sano = p('sano'), pac2 = p('pac2'), normales = p('normales'), fibrosis = p('fibrosis'), romperse = p('romperse'), funcionar = p('funcionar');
  const C: P2 = [400, 440], K = 1.25;
  const sal: P2 = [C[0] + 96 * K, C[1] - 6];
  const fugas = Array.from({ length: 14 }, (_, i) => {
    const a = hash(i, 1) * 6.28, r = (40 + hash(i, 2) * 38) * K;
    const dentro: P2 = [C[0] + Math.cos(a) * r + 4 * Math.sin(reloj / 430 + i), C[1] + Math.sin(a) * r + 4 * Math.cos(reloj / 520 + i)];
    const afuera: P2 = [C[0] + 230 + hash(i, 5) * 90, C[1] - 120 + hash(i, 6) * 250];
    const q1 = easeOut(tramo(escapan, 0, 0.5)), q2 = easeOut(tramo(escapan, 0.35 + (i % 4) * 0.05, 1));
    const m: P2 = [lerp(dentro[0], sal[0], q1), lerp(dentro[1], sal[1], q1)];
    return { pos: [lerp(m[0], afuera[0], q2), lerp(m[1], afuera[1], q2)] as P2, i };
  });
  return (
    <g>
      <Globo x={800} y={100} txt="¿qué miden realmente los análisis del hígado?" t={34} p={analisis} colaX={0} />
      {/* izquierda: la destrucción */}
      <Hepatocito x={C[0]} y={C[1]} k={K} reloj={reloj} sem={3} balon={0.5 * escapan} o={tramo(destruccion, 0, 0.4)} />
      <Grieta x={sal[0]} y={sal[1]} k={0.9} p={escapan} />
      {fugas.map(({ pos, i }) => <Enz key={i} x={pos[0]} y={pos[1]} k={0.9} r={i * 37} tono={i % 2 ? AL : AS} o={tramo(destruccion, 0.4, 1)} />)}
      <Etiqueta x={C[0]} y={655} txt="transaminasas: destrucción" color="#E5324C" p={destruccion} t={28} punta="arriba" />
      <Txt x={C[0]} y={720} txt="se escapan cuando la célula se rompe" t={24} p={escapan} fuerte={false} />
      <Txt x={C[0]} y={785} txt="una cosa es romperse…" t={30} p={romperse} color={TXH.sangre} />
      {/* derecha: la función */}
      <Etiqueta x={1010} y={245} txt="función: cuánto hígado sano trabaja" color="#1FA85A" p={funcion} t={26} punta="no" />
      <Sale p={bili} x={880} y={420}><Gota x={0} y={0} k={1.5} tono={H.biliI} /></Sale>
      <Sale p={alb} x={1110} y={420}><Albumina x={0} y={0} k={0.8} reloj={reloj} /></Sale>
      <Sale p={inr} x={1330} y={410}><TuboEnsayo x={0} y={0} k={0.85} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={880} y={560} txt="bilirrubina" color="#C79A00" p={bili} t={26} punta="arriba" />
      <Etiqueta x={1110} y={560} txt="albúmina" color="#B01E8A" p={alb} t={26} punta="arriba" />
      <Etiqueta x={1330} y={560} txt="INR" color="#9E0B2E" p={inr} t={26} punta="arriba" />
      <Sale p={sano} x={1110} y={690} k={0.42}><Higado corte={false} /></Sale>
      <Trabaja x={1110} y={690} R={86} reloj={reloj} p={sano} />
      <Txt x={1110} y={815} txt="otra, dejar de funcionar" t={30} p={funcionar} color={TXH.hep} />
      {/* el paciente 2: las tres normales y, aun así, fibrosis posible */}
      <Sombra><Sale p={pac2} x={420} y={905} k={0.26}><Busto quien="p2" reloj={reloj} fase={1.4} sonrisa={0.3} /></Sale></Sombra>
      {[560, 650, 740].map((vx, i) => <Visto key={i} x={vx} y={905} k={0.8} p={tramo(normales, i * 0.22, i * 0.22 + 0.45)} />)}
      <Colageno x={1010} y={905} w={260} h={50} n={4} p={fibrosis} reloj={reloj} />
      <Etiqueta x={1340} y={905} txt="no descarta fibrosis" color="#1F6FB0" p={fibrosis} t={26} punta="no" />
    </g>
  );
};

// ─── 1 · ALT: la enzima del citosol ─────────────────────────────────────────
const Alt: Lamina = ({ p, reloj }) => {
  const alt = p('alt'), citosol = p('citosol'), libre = p('libre'), rompe = p('rompe'), sangre = p('sangre'), lentitud = p('lentitud'), vida = p('vida'), h47 = p('h47'), sube = p('sube'), baja = p('baja');
  const C: P2 = [400, 540], K = 2.0, VX = 880;
  const sal: P2 = [C[0] + 92 * K, C[1] - 20];
  const curva = 0.12 * easeOut(sube) + 0.88 * easeOut(baja);
  return (
    <g>
      <Sale p={alt} x={250} y={150} k={1.8}><Enz x={0} y={0} tono={AL} /></Sale>
      <Etiqueta x={400} y={150} txt="ALT" color="#C99300" p={alt} t={44} punta="no" />
      <Sinusoide x={VX} reloj={reloj} p={rompe} />
      <Hepatocito x={C[0]} y={C[1]} k={K} reloj={reloj} sem={3} balon={0.25 * rompe} />
      {Array.from({ length: 14 }, (_, i) => {
        const a = hash(i, 1) * 6.28, r = (40 + hash(i, 2) * 38) * K;
        const [bx, by] = tray(i, [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r], sal, VX, rompe, tramo(sangre, i * 0.03, i * 0.03 + 0.6), reloj);
        return <Enz key={i} x={bx} y={by} k={1.15} r={i * 41} tono={AL} o={tramo(libre, i / 20, i / 20 + 0.3)} />;
      })}
      <Grieta x={sal[0]} y={sal[1]} k={1.4} p={rompe} />
      <Etiqueta x={400} y={790} txt="citosol" color="#E04AB0" p={citosol} t={28} punta="arriba" />
      <Txt x={400} y={855} txt="libre en el citoplasma" t={26} p={libre} />
      <Txt x={620} y={300} txt="se rompe la membrana" t={26} p={rompe} color={TXH.sangre} />
      <Etiqueta x={VX} y={200} txt="sangre" color="#E3203F" p={sangre} t={28} punta="abajo" />
      <Caracol x={VX} y={868} k={0.6} o={tramo(lentitud, 0, 0.4)} reloj={reloj} />
      <Txt x={VX} y={940} txt="se elimina con lentitud" t={24} p={lentitud} />
      {/* la vida media y la curva */}
      <Reloj x={1250} y={250} k={1.1} ang={(reloj / 45) % 360} o={tramo(vida, 0, 0.4)} />
      <Txt x={1250} y={360} txt="vida media" t={30} p={vida} color={TXH.kupffer} />
      <Etiqueta x={1250} y={430} txt="≈ 47 horas" color="#C99300" p={h47} t={36} punta="no" />
      <EjesEnz x={1070} y={850} h={260} p={sube} />
      <CurvaEnz x={1070} y={850} h={260} vida={47} tono={AL} p={curva} marca={h47} />
      <Txt x={1210} y={560} txt="sube fuerte" t={26} p={sube} color={TXH.kupffer} />
      <Txt x={1390} y={700} txt="tarda en bajar" t={26} p={baja} color={TXH.kupffer} />
    </g>
  );
};

// ─── 2 · AST: la enzima encerrada ───────────────────────────────────────────
const Ast: Lamina = ({ p, reloj }) => {
  const ast = p('ast'), encerrada = p('encerrada'), veinte = p('veinte'), ochenta = p('ochenta'), mito = p('mito'), rompen = p('rompen'), rapido = p('rapido'), h17 = p('h17'), exclusiva = p('exclusiva'), musculo = p('musculo'), corazon = p('corazon');
  const C: P2 = [400, 540], K = 2.0, VX = 880;
  const sal: P2 = [C[0] + 92 * K, C[1] - 20];
  const MIT: P2[] = [[-82, -66], [74, -84], [-98, 60], [84, 72]];
  const libres: P2[] = [[-34, 8], [34, -28], [12, 96]];
  const sangre = tramo(rompen, 0.35, 1);
  const R = 100, P = 2 * Math.PI * R;
  return (
    <g>
      <Sale p={ast} x={250} y={150} k={1.8}><Enz x={0} y={0} tono={AS} /></Sale>
      <Etiqueta x={400} y={150} txt="AST" color="#C2540A" p={ast} t={44} punta="no" />
      <Sinusoide x={VX} reloj={reloj} p={rompen} />
      <Hepatocito x={C[0]} y={C[1]} k={K} reloj={reloj} sem={5} balon={0.2 * rompen} o={tramo(encerrada, 0, 0.4)} />
      {/* las mitocondrias, con casi todas las enzimas dentro */}
      {MIT.map(([mx, my], i) => (
        <g key={i} opacity={tramo(encerrada, 0.1 + i * 0.08, 0.45 + i * 0.08)}>
          <Mitocondria x={C[0] + mx} y={C[1] + my} k={0.22} r={i * 40 - 30} dano={rompen} reloj={reloj} />
        </g>
      ))}
      {MIT.flatMap(([mx, my], i) => [0, 1, 2].map((j) => {
        const n = i * 3 + j, dentro: P2 = [C[0] + mx + (j - 1) * 18, C[1] + my + (j % 2 ? 8 : -8)];
        const [bx, by] = tray(n, dentro, sal, VX, rompen, sangre, reloj);
        return <Enz key={`m${n}`} x={bx} y={by} k={0.95} r={n * 41} tono={AS} o={tramo(ochenta, n / 16, n / 16 + 0.3)} />;
      }))}
      {libres.map(([lx, ly], i) => {
        const [bx, by] = tray(20 + i, [C[0] + lx, C[1] + ly], sal, VX, rompen, sangre, reloj);
        return <Enz key={`l${i}`} x={bx} y={by} k={1.1} r={i * 61} tono={AS} o={tramo(veinte, i / 5, i / 5 + 0.4)} />;
      })}
      <Grieta x={sal[0]} y={sal[1]} k={1.4} p={rompen} />
      <Etiqueta x={C[0] - 150} y={800} txt="mitocondria" color="#C4463C" p={mito} t={28} punta="arriba" />
      <Txt x={400} y={300} txt="se rompe todo: ahora sale mucho" t={26} p={rompen} color={TXH.sangre} />
      {/* el reparto 20 % / 80 % */}
      <g transform="translate(1250,260) rotate(-90)">
        <circle r={R} fill="none" stroke="#FFF" strokeWidth={38} opacity={0.3} />
        <circle r={R} fill="none" stroke="#FFC24A" strokeWidth={38} pathLength={1} strokeDasharray={`${(0.2 * easeOut(veinte)).toFixed(3)} 1`} strokeLinecap="butt" />
        <circle r={R} fill="none" stroke="#E8641A" strokeWidth={38} pathLength={1} strokeDasharray={`${(0.8 * easeOut(ochenta)).toFixed(3)} 1`} strokeDashoffset={-0.2} strokeLinecap="butt" />
      </g>
      <Txt x={1250} y={262} txt="AST" t={36} p={ast} color={TXH.kupffer} />
      <Etiqueta x={1100} y={420} txt="20 % citosol" color="#E0A100" p={veinte} t={26} punta="no" />
      <Etiqueta x={1400} y={420} txt="80 % mitocondria" color="#C2540A" p={ochenta} t={26} punta="no" />
      {/* se elimina más rápido */}
      <EjesEnz x={1070} y={700} h={190} p={rapido} />
      <CurvaEnz x={1070} y={700} h={190} vida={47} tono={AL} p={rapido} o={0.4} grosor={8} />
      <CurvaEnz x={1070} y={700} h={190} vida={17} tono={AS} p={rapido} marca={h17} />
      <Txt x={1250} y={500} txt="se elimina más rápido" t={26} p={rapido} color={TXH.kupffer} />
      <Etiqueta x={1350} y={560} txt="≈ 17 horas" color="#C2540A" p={h17} t={30} punta="no" />
      {/* no es exclusiva del hígado */}
      <Txt x={1250} y={800} txt="no es exclusiva del hígado" t={26} p={exclusiva} color={TXH.hep} />
      <g opacity={tramo(musculo, 0, 0.4)}>
        {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1130 + i * 30},905) rotate(${(i - 1.5) * 5})`}><rect x={-13} y={-48} width={26} height={96} rx={13} fill="#B02F52" /><rect x={-11} y={-48} width={22} height={90} rx={11} fill="#E8528C" /><rect x={-6} y={-38} width={6} height={64} rx={3} fill="#FFF" opacity={0.4} /></g>)}
      </g>
      <Txt x={1190} y={978} txt="músculo" t={24} p={musculo} />
      <Sale p={corazon} x={1400} y={905} k={0.5}><Corazon /></Sale>
      <Txt x={1400} y={978} txt="corazón" t={24} p={corazon} />
    </g>
  );
};

// ─── 3 · De Ritis: un cociente que cuenta una historia ──────────────────────
const Cociente: Lamina = ({ p, reloj }) => {
  const cociente = p('cociente'), formula = p('formula'), viral = p('viral'), menor = p('menor'), p1 = p('p1'), v980 = p('v980'), r068 = p('r068'), p2 = p('p2'), r078 = p('r078'), mayor1 = p('mayor1'), alcohol = p('alcohol'), acetaldehido = p('acetaldehido'), b6 = p('b6'), historia = p('historia');
  const GX = 200, UN = 400, GY = 600; // el 0 está en x=200 y cada unidad mide 400 px
  const seg = (a: number, b: number, q: number, col: string) => <rect x={GX + a * UN} y={GY - 32} width={(b - a) * UN * easeOut(q)} height={64} fill={col} />;
  const pinX1 = GX + 0.68 * UN, pinX2 = GX + 0.78 * UN;
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Globo x={800} y={80} txt="el cociente de De Ritis" t={34} p={cociente} colaX={0} />
      {/* AST sobre ALT */}
      <g opacity={tramo(formula, 0, 0.4)}>
        <Enz x={720} y={198} k={1.5} tono={AS} /><Txt x={820} y={198} txt="AST" t={38} p={formula} color={TXH.kupffer} />
        <line x1={670} x2={930} y1={234} y2={234} stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" />
        <Enz x={720} y={274} k={1.5} tono={AL} /><Txt x={820} y={274} txt="ALT" t={38} p={formula} color={TXH.kupffer} />
      </g>
      {/* la regla del cociente */}
      <defs><clipPath id="hv-g5"><rect x={GX} y={GY - 32} width={3 * UN} height={64} rx={32} /></clipPath></defs>
      <rect x={GX + 6} y={GY - 26} width={3 * UN} height={64} rx={32} fill="#000" opacity={0.13} />
      <rect x={GX} y={GY - 32} width={3 * UN} height={64} rx={32} fill="#FFF" opacity={0.3} />
      <g clipPath="url(#hv-g5)">
        {seg(0, 1, viral, '#10B5A8')}{seg(1, 2, mayor1, '#F2A81E')}{seg(2, 3, alcohol, '#E5324C')}
        <rect x={GX + 12} y={GY - 26} width={3 * UN - 24} height={10} rx={5} fill="#FFF" opacity={0.28} />
      </g>
      {[0, 1, 2, 3].map((n) => <Txt key={n} x={GX + n * UN} y={GY + 62} txt={String(n)} t={30} p={tramo(formula, 0.3, 0.8)} />)}
      <Sale p={viral} x={400} y={490}><VirionB x={0} y={0} k={0.62} reloj={reloj} /></Sale>
      <Sale p={mayor1} x={800} y={490} k={0.34}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /><circle cx={-8} cy={-10} r={6} fill="#FFF" opacity={0.5} /></g>)}</Sale>
      <Sale p={alcohol} x={1200} y={492} k={0.8}>
        <ellipse cx={8} cy={84} rx={40} ry={8} fill="#000" opacity={0.14} />
        <path d="M-30,80 L-30,-4 Q-30,-22 -12,-34 L-12,-78 L12,-78 L12,-34 Q30,-22 30,-4 L30,80 Z" fill="#1E6A3C" /><path d="M-26,76 L-26,-2 Q-26,-18 -9,-30 L-9,-74 L8,-74 L8,-30 Q26,-18 26,-2 L26,76 Z" fill="#2FA860" />
        <rect x={-12} y={-92} width={24} height={16} rx={5} fill="#C99300" /><rect x={-18} y={10} width={36} height={44} rx={5} fill="#FFF8E8" /><rect x={-20} y={0} width={8} height={70} rx={4} fill="#FFF" opacity={0.35} />
      </Sale>
      <Etiqueta x={400} y={352} txt="hepatitis viral" color="#10B5A8" p={viral} t={28} punta="no" />
      <Etiqueta x={800} y={352} txt="cirrosis" color="#C98400" p={mayor1} t={28} punta="no" />
      <Etiqueta x={1200} y={352} txt="alcohol" color="#E5324C" p={alcohol} t={28} punta="no" />
      <Txt x={400} y={392} txt="menor que 1" t={26} p={menor} color={TXH.cd8} />
      <Txt x={800} y={392} txt="mayor que 1" t={26} p={mayor1} color={TXH.kupffer} />
      <Txt x={1200} y={392} txt="mayor que 2" t={26} p={alcohol} color={TXH.sangre} />
      {/* los dos pacientes dejan su ficha en la regla */}
      <g opacity={tramo(p1, 0, 0.4)}><polygon points={`${pinX1},${GY + 36} ${pinX1 - 13},${GY + 62} ${pinX1 + 13},${GY + 62}`} fill="#2F55E0" /></g>
      <g opacity={tramo(p2, 0, 0.4)}><polygon points={`${pinX2},${GY + 36} ${pinX2 - 13},${GY + 62} ${pinX2 + 13},${GY + 62}`} fill="#E04AB0" /></g>
      <Sombra><Sale p={p1} x={380} y={780} k={0.3}><Busto quien="p1" reloj={reloj} fase={0.5} /></Sale></Sombra>
      <Sombra><Sale p={p2} x={600} y={780} k={0.3}><Busto quien="p2" reloj={reloj} fase={2.1} sonrisa={0.3} /></Sale></Sombra>
      <Txt x={380} y={872} txt="980 / 1 450" t={28} p={v980} />
      <Etiqueta x={380} y={930} txt="0,68" color="#2F55E0" p={r068} t={34} punta="no" />
      <Etiqueta x={600} y={930} txt="0,78" color="#E04AB0" p={r078} t={34} punta="no" />
      {/* por qué el alcohol pasa de 2 */}
      <Sale p={acetaldehido} x={1010} y={760} k={0.11}><Mitocondria reloj={reloj} /></Sale>
      <Txt x={1270} y={760} txt="acetaldehído mitocondrial" t={26} p={acetaldehido} color={TXH.sangre} />
      <Sale p={b6} x={1010} y={845}><circle cx={3} cy={4} r={34} fill="#000" opacity={0.16} /><circle r={34} fill="#5A22A8" /><circle cx={-2} cy={-2} r={30} fill="#8A4FE8" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 30, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>B6</text><path d="M-30,30 L30,-30" stroke="#E5324C" strokeWidth={8} strokeLinecap="round" /></Sale>
      <Txt x={1270} y={845} txt="falta de vitamina B6" t={26} p={b6} color={TXH.d} />
      <Txt x={800} y={975} txt="un cociente cuenta una historia" t={34} p={historia} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · La bilirrubina que se queda atrás ──────────────────────────────────
const BiliBrote: Lamina = ({ p, reloj }) => {
  const bili = p('bili'), total = p('total'), directa = p('directa'), indirecta = p('indirecta'), citocinas = p('citocinas'), transportadores = p('transportadores'), comprime = p('comprime'), conjugada = p('conjugada'), refluye = p('refluye'), mixta = p('mixta'), directo = p('directo');
  const SX = 170, CX = 470, CY = 540, KX = 720, UN = 85, BASE = 860;
  const ancho = lerp(46, 14, easeOut(comprime));
  const bloq = Math.max(tramo(transportadores, 0, 1), easeOut(comprime));
  const hD = 4.1 * UN * easeOut(directa), hI = 1.3 * UN * easeOut(indirecta);
  return (
    <g>
      <Globo x={800} y={90} txt="la bilirrubina del brote" t={34} p={bili} colaX={0} />
      <Sinusoide x={SX} y0={220} y1={860} w={110} reloj={reloj} p={tramo(bili, 0, 0.6)} />
      <Hepatocito x={CX} y={CY} k={1.75} reloj={reloj} sem={4} balon={easeOut(comprime)} o={tramo(bili, 0, 0.5)} />
      {/* el canalículo se estrecha */}
      <g opacity={tramo(bili, 0.2, 0.7)}>
        <rect x={KX - ancho / 2 + 5} y={262} width={ancho} height={600} rx={ancho / 2} fill="#000" opacity={0.12} />
        <rect x={KX - ancho / 2} y={260} width={ancho} height={600} rx={ancho / 2} fill="#7A8A1E" /><rect x={KX - ancho / 2 + 3} y={260} width={Math.max(2, ancho - 8)} height={600} rx={ancho / 2} fill="#B8C84A" />
      </g>
      {Array.from({ length: 9 }, (_, i) => {
        const flujo = ((reloj / 2600 + i / 9) % 1), pila = 0.1 + i * 0.075;
        const u = lerp(flujo, pila, bloq), x1 = KX + 6 * Math.sin(i * 1.7), y1 = 290 + u * 540;
        const q = easeOut(refluye);
        const x = lerp(x1, SX + (i % 3 - 1) * 22, q), y = lerp(y1, 300 + i * 62, q);
        return <Gota key={i} x={x} y={y} k={0.46} tono={H.biliD} o={tramo(bili, 0.3, 0.8)} />;
      })}
      {[[KX - 30, 380], [KX - 30, 520], [KX - 30, 660], [KX + 30, 450], [KX + 30, 590]].map(([tx, ty], i) => <Toro key={i} x={tx} y={ty} k={0.5} r={tx < KX ? -90 : 90} tapon={transportadores} tallo={46} tono={H.toro} o={tramo(transportadores, i * 0.1, i * 0.1 + 0.4)} reloj={reloj} />)}
      {/* las citocinas bajan sobre el canalículo */}
      <g opacity={tramo(citocinas, 0, 0.4)}>
        {Array.from({ length: 5 }, (_, i) => {
          const u = ((reloj / 2200 + i / 5) % 1);
          return <g key={i} transform={`translate(${lerp(1040, 790, u)},${240 + i * 34 + 6 * Math.sin(u * 9)})`} opacity={Math.sin(u * Math.PI)}>
            {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={15} y2={0} stroke="#C2540A" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />)}
            <circle r={9} fill="#FF8A1E" />
          </g>;
        })}
      </g>
      <Txt x={940} y={205} txt="citocinas (TNF-α)" t={26} p={citocinas} color={TXH.kupffer} />
      <Txt x={930} y={540} txt="transportadores apagados" t={24} p={transportadores} />
      <Txt x={CX} y={795} txt="el hepatocito hinchado lo comprime" t={26} p={comprime} color={TXH.hep} />
      <Etiqueta x={KX} y={910} txt="conjugada: no sale" color="#D96A00" p={conjugada} t={26} punta="no" />
      <Etiqueta x={250} y={165} txt="refluye a la sangre" color="#E3203F" p={refluye} t={26} punta="no" />
      {/* la barra: total 5,4 = directa 4,1 + indirecta 1,3 */}
      <rect x={1160} y={BASE - 5.4 * UN} width={120} height={5.4 * UN} rx={16} fill="#FFF" opacity={0.28 * tramo(total, 0, 0.5)} />
      <rect x={1160} y={BASE - hD} width={120} height={hD} rx={hD > 20 ? 14 : 0} fill="#D96A00" opacity={hD > 2 ? 1 : 0} /><rect x={1160} y={BASE - hD} width={120} height={hD} rx={hD > 20 ? 14 : 0} fill="#FF9A2E" transform="translate(-4,-4)" opacity={hD > 2 ? 1 : 0} />
      <rect x={1160} y={BASE - hD - hI} width={120} height={hI} rx={hI > 20 ? 14 : 0} fill="#C79A00" opacity={hI > 2 ? 1 : 0} /><rect x={1160} y={BASE - hD - hI} width={120} height={hI} rx={hI > 20 ? 14 : 0} fill="#FFC81E" transform="translate(-4,-4)" opacity={hI > 2 ? 1 : 0} />
      <path d={`M1310,${BASE} L1330,${BASE} L1330,${BASE - 5.4 * UN} L1310,${BASE - 5.4 * UN}`} fill="none" stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(total, 0, 0.5)} />
      <Txt x={1440} y={BASE - 2.7 * UN} txt="total 5,4" t={34} p={total} />
      <Txt x={1020} y={BASE - 2.05 * UN} txt="directa 4,1" t={30} p={directa} color={TXH.biliD} />
      <Txt x={1020} y={BASE - 4.75 * UN} txt="indirecta 1,3" t={30} p={indirecta} color={TXH.biliI} />
      <Etiqueta x={1220} y={290} txt="bilirrubina mixta" color="#C98400" p={mixta} t={28} punta="no" />
      <Etiqueta x={1220} y={350} txt="de predominio directo" color="#D96A00" p={directo} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · Ictericia, coluria, hipocolia ──────────────────────────────────────
const Ictericia: Lamina = ({ p, reloj }) => {
  const ojos = p('ojos'), orina = p('orina'), umbral = p('umbral'), elastina = p('elastina'), escleras = p('escleras'), directa = p('directa'), rinon = p('rinon'), oscura = p('oscura'), intestino = p('intestino'), estercobilina = p('estercobilina'), palidas = p('palidas'), tres = p('tres');
  const heces = [mezcla('#7A4A22', '#E4D6B6', palidas), mezcla('#A8683A', '#F4EBD2', palidas)];
  return (
    <g>
      {/* columna 1: los ojos amarillos */}
      <Sombra><Sale p={ojos} x={300} y={440} k={0.85}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ojos)} dolor={0.2} /></Sale></Sombra>
      <Etiqueta x={300} y={800} txt="ictericia" color="#C79A00" p={ojos} t={30} punta="no" />
      <Txt x={300} y={170} txt="más de 2,5 a 3 mg/dL" t={30} p={umbral} color={TXH.biliI} />
      <Zoom x={660} y={330} R={140} de={[330, 438]} p={elastina} fondo="#FFF4D8">
        <g transform="translate(660,330)">
        {[-60, -30, 0, 30, 60].map((dy, i) => <path key={i} d={`M-150,${dy} C-90,${dy - 22} -40,${dy + 22} 10,${dy} S100,${dy - 20} 150,${dy + 6}`} fill="none" stroke="#C9A860" strokeWidth={6} strokeLinecap="round" strokeDasharray="1 0" opacity={tramo(elastina, i * 0.12, i * 0.12 + 0.5)} />)}
        {Array.from({ length: 12 }, (_, i) => {
          const fy = [-60, -30, 0, 30, 60][i % 5], fx = -120 + (i * 53) % 240;
          const x = lerp(fx + 40 * Math.sin(i), fx, escleras), y = lerp(fy - 50 + 20 * Math.cos(i * 1.3), fy + 2 * Math.sin(fx / 40), easeOut(escleras));
          return <circle key={i} cx={x} cy={y + 2 * Math.sin(reloj / 400 + i)} r={9} fill="#FFC81E" opacity={tramo(escleras, i * 0.04, i * 0.04 + 0.4)} />;
        })}
        </g>
      </Zoom>
      <Txt x={660} y={525} txt="elastina de las escleras" t={26} p={escleras} color={TXH.biliI} />
      {/* columna 2: la orina oscura */}
      <Etiqueta x={900} y={170} txt="directa: hidrosoluble" color="#D96A00" p={directa} t={28} punta="no" />
      <Sale p={rinon} x={900} y={300} k={0.55}><Rinon /></Sale>
      <Flecha a={[900, 400]} b={[900, 470]} p={tramo(rinon, 0.2, 1)} color="var(--cit-flecha)" w={8} />
      <Sale p={orina} x={900} y={620} k={1.25}><FrascoOrina oscuro={0.3 * orina + 0.7 * oscura} reloj={reloj} /></Sale>
      <Etiqueta x={900} y={800} txt="coluria" color="#B8601E" p={oscura} t={30} punta="no" />
      {/* columna 3: las heces pálidas */}
      <Sale p={intestino} x={1330} y={340} k={0.8}><Intestino /></Sale>
      <Txt x={1330} y={190} txt="llega menos bilis al intestino" t={24} p={intestino} />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={1250 + i * 26 + 4 * Math.sin(reloj / 500 + i)} cy={540 + 10 * Math.sin(i * 2.1)} r={7} fill="#8A4A1E" opacity={0.85 * (1 - palidas) * tramo(estercobilina, i * 0.08, i * 0.08 + 0.4)} />)}
      <g opacity={tramo(estercobilina, 0, 0.4)}>
        <ellipse cx={1340} cy={684} rx={140} ry={16} fill="#000" opacity={0.12} />
        <rect x={1200} y={625} width={280} height={74} rx={37} fill={heces[0]} /><rect x={1200} y={620} width={274} height={66} rx={33} fill={heces[1]} />
        <rect x={1226} y={632} width={150} height={10} rx={5} fill="#FFF" opacity={0.45} />
      </g>
      <Txt x={1340} y={750} txt="menos estercobilina" t={26} p={estercobilina} color={TXH.bilis} />
      <Etiqueta x={1330} y={800} txt="hipocolia" color="#8A6A12" p={palidas} t={30} punta="no" />
      <Txt x={800} y={930} txt="tres señales para una misma causa" t={38} p={tres} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · INR y factor VII ───────────────────────────────────────────────────
const Inr: Lamina = ({ p, reloj }) => {
  const inr = p('inr'), extrinseca = p('extrinseca'), comun = p('comun'), f7 = p('f7'), f10 = p('f10'), f5 = p('f5'), f2 = p('f2'), fibrinogeno = p('fibrinogeno'), dura = p('dura'), horas = p('horas'), primero = p('primero'), fabricar = p('fabricar'), brote = p('brote'), inrb = p('inrb'), leve = p('leve'), avisa = p('avisa');
  const FY = 390, XS = [420, 640, 860, 1080, 1310];
  const caida = easeOut(primero);
  return (
    <g>
      <Sale p={inr} x={170} y={330} k={0.9}><TuboEnsayo x={0} y={0} k={1} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={170} y={520} txt="INR" color="#9E0B2E" p={inr} t={34} punta="arriba" />
      {/* las dos vías */}
      <path d="M360,300 L480,300" stroke="#FF8A1E" strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${easeOut(extrinseca).toFixed(3)} 1`} />
      <path d="M580,300 L1370,300" stroke="#2F55E0" strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${easeOut(comun).toFixed(3)} 1`} />
      <Txt x={420} y={262} txt="vía extrínseca" t={26} p={extrinseca} color={TXH.a} />
      <Txt x={975} y={262} txt="vía común" t={26} p={comun} color={TXH.b} />
      {/* los factores: 7, 10, 5, 2 y fibrinógeno */}
      <Fact x={XS[0]} y={FY} tono={H.a} txt="VII" p={f7} k={1 - 0.35 * caida} o={1 - 0.4 * caida} />
      <Flecha a={[XS[0] + 60, FY]} b={[XS[1] - 60, FY]} p={tramo(f10, 0, 0.7)} color="var(--cit-flecha)" w={7} />
      <Fact x={XS[1]} y={FY} tono={H.b} txt="X" p={f10} />
      <Flecha a={[XS[1] + 60, FY]} b={[XS[2] - 60, FY]} p={tramo(f5, 0, 0.7)} color="var(--cit-flecha)" w={7} />
      <Fact x={XS[2]} y={FY} tono={H.c} txt="V" p={f5} />
      <Flecha a={[XS[2] + 60, FY]} b={[XS[3] - 60, FY]} p={tramo(f2, 0, 0.7)} color="var(--cit-flecha)" w={7} />
      <Fact x={XS[3]} y={FY} tono={H.d} txt="II" p={f2} />
      <Flecha a={[XS[3] + 60, FY]} b={[XS[4] - 70, FY]} p={tramo(fibrinogeno, 0, 0.7)} color="var(--cit-flecha)" w={7} />
      <Fact x={XS[4]} y={FY} R={62} tono={H.sangre} txt="I" p={fibrinogeno} />
      <Txt x={XS[4]} y={FY + 100} txt="fibrinógeno" t={26} p={fibrinogeno} color={TXH.sangre} />
      {/* el factor VII dura poco */}
      <Reloj x={420} y={650} k={1.2} ang={(reloj / 30) % 360} o={tramo(dura, 0, 0.4)} />
      <Etiqueta x={420} y={790} txt="dura 4 a 6 horas" color="#C25A00" p={horas} t={28} punta="no" />
      <Etiqueta x={420} y={860} txt="el primero en caer" color="#B8237A" p={primero} t={28} punta="no" />
      <Sale p={fabricar} x={720} y={680} k={0.46}><Higado corte={false} /></Sale>
      <g opacity={tramo(fabricar, 0.3, 0.8)}><path d="M660,630 L780,730 M780,630 L660,730" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" /></g>
      <Txt x={720} y={800} txt="el hígado deja de fabricar" t={26} p={fabricar} />
      {/* el INR del brote */}
      <Etiqueta x={1250} y={555} txt="en el brote" color="#7A55D8" p={brote} t={28} punta="no" />
      <BarraLab x={1250} y={905} w={96} alto={300} val={1.3} max={2.2} norm={1.0} color="#F0495F" oscuro="#A8203A" p={inrb} nombre="INR" valor="1,3" t={30} />
      <Txt x={1030} y={770} txt="caída leve de la síntesis" t={24} p={leve} color={TXH.kupffer} />
      <Campana x={1480} y={660} k={0.62} o={tramo(avisa, 0, 0.4)} suena={avisa} reloj={reloj} />
      <Txt x={1480} y={750} txt="pero ya avisa" t={28} p={avisa} color={TXH.kupffer} />
    </g>
  );
};

// ─── 7 · La albúmina y las señales lentas ───────────────────────────────────
const SenalesLentas: Lamina = ({ p, reloj }) => {
  const albumina = p('albumina'), tarde = p('tarde'), d20 = p('d20'), pac2 = p('pac2'), normal = p('normal'), inr = p('inr'), sube = p('sube'), alarma = p('alarma'), falla = p('falla'), trans = p('trans'), bili = p('bili'), agredido = p('agredido'), trabaja = p('trabaja'), juntas = p('juntas'), historia = p('historia');
  return (
    <g>
      {/* la albúmina avisa tarde */}
      <Sale p={albumina} x={300} y={260} k={1.1}><Albumina x={0} y={0} k={1} reloj={reloj} /></Sale>
      <Etiqueta x={300} y={400} txt="albúmina" color="#B01E8A" p={albumina} t={30} punta="arriba" />
      <Txt x={300} y={470} txt="avisa tarde" t={30} p={tarde} color={TXH.hep} />
      <Calendario x={220} y={650} k={0.9} o={tramo(d20, 0, 0.4) * easeBack(clamp(d20))} n="20" />
      <Sombra><Sale p={pac2} x={470} y={650} k={0.34}><Busto quien="p2" reloj={reloj} fase={1.1} sonrisa={0.4} /></Sale></Sombra>
      <Etiqueta x={470} y={790} txt="paciente 2: 4,2" color="#1FA85A" p={normal} t={26} punta="no" />
      <Visto x={600} y={650} k={0.8} p={normal} />
      {/* el INR que sube es la alarma temprana */}
      <BarraLab x={760} y={800} w={100} alto={340} val={1.9} max={2.5} norm={1.1} color="#F0495F" oscuro="#A8203A" p={tramo(inr, 0, 1) * (0.55 + 0.45 * easeOut(sube))} nombre="INR" valor="sube" t={28} />
      <Flecha a={[900, 800]} b={[900, 560]} p={tramo(sube, 0, 0.8)} color="#E5324C" w={10} />
      <Campana x={1000} y={400} k={0.8} o={tramo(alarma, 0, 0.4)} suena={alarma} reloj={reloj} />
      <Etiqueta x={900} y={200} txt="falla hepática" color="#B8237A" p={falla} t={32} punta="no" />
      <Txt x={1000} y={510} txt="alarma temprana" t={26} p={alarma} color={TXH.kupffer} />
      {/* transaminasas altas con bilirrubina normal: un hígado agredido que aún trabaja */}
      <Hepatocito x={1330} y={310} k={0.8} reloj={reloj} sem={6} balon={0.25 * agredido} o={tramo(agredido, 0, 0.4)} />
      <Banda x={1380} y={270} r={-32} k={0.9} p={agredido} />
      <Trabaja x={1330} y={310} R={118} reloj={reloj} p={trabaja} />
      <BarraLab x={1230} y={820} w={84} alto={300} val={1450} max={1600} norm={40} color="#F2848C" oscuro="#B83A52" p={trans} nombre="ALT / AST" valor="altas" t={26} />
      <BarraLab x={1450} y={820} w={84} alto={300} val={0.8} max={6} norm={1.2} color="#FFC81E" oscuro="#C79A00" p={bili} nombre="bilirrubina" valor="normal" t={26} />
      <Etiqueta x={1330} y={462} txt="agredido, pero trabaja" color="#1FA85A" p={trabaja} t={26} punta="no" />
      <Txt x={800} y={925} txt="mirar las dos cosas juntas" t={34} p={juntas} color={TXH.hep} />
      <Txt x={800} y={970} txt="cuenta la historia completa" t={30} p={historia} fuerte={false} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Contraste, Alt, Ast, Cociente, BiliBrote, Ictericia, Inr, SenalesLentas];
export default LAMINAS;
