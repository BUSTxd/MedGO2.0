'use client';
// Láminas del capítulo 3 («La firma del interferón»).
//
// · `endosoma`: el interior de una célula dendrítica plasmocitoide en corte: el
//   endosoma con TLR7 y TLR9 en su membrana, el complejo que llega (caballo de
//   Troya), la señal al núcleo, el gen del IFN-α y el interferón que sale.
// · `firma`: mapa de calor de genes estimulados por interferón (sanos frente a
//   pacientes con lupus).
// · `red`: la NET que despliega el neutrófilo sobre el endotelio, con histonas,
//   proteínas de gránulos y bacterias atrapadas.

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { clamp, dibujar, easeBack, easeOut, tramo, v, type T } from './laminas';
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

function Y({ x, y, ang, k = 2, c = L.ana }: { x: number; y: number; ang: number; k?: number; c?: string }) {
  return <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(0)}) scale(${k})`}><path d="M0,10 L0,0 M0,0 L-8,-10 M0,0 L8,-10" stroke={c} strokeWidth={4} strokeLinecap="round" fill="none" /></g>;
}

// ─── Endosoma ─────────────────────────────────────────────────────────────────

const E = { cx: 560, cy: 520, rx: 250, ry: 180 };
const N = { cx: 1230, cy: 520, rx: 240, ry: 205 };

/** TLR en la membrana del endosoma: herradura (LRR) dentro, cola TIR fuera. */
function Tlr({ ang, c, k }: { ang: number; c: string; k: number }) {
  const x = E.cx + Math.cos(ang) * E.rx, y = E.cy + Math.sin(ang) * E.ry;
  const rot = (Math.atan2(Math.sin(ang) * E.rx, Math.cos(ang) * E.ry) * 180) / Math.PI;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})`} opacity={0.35 + 0.65 * k}>
      <path d="M-30,-14 C-48,-14 -54,14 -30,14" fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" />
      <line x1={-6} y1={0} x2={22} y2={0} stroke={c} strokeWidth={7} strokeLinecap="round" />
      <circle cx={28} cy={0} r={8} fill={c} />
    </g>
  );
}

const CelulaPdcFija = memo(function CelulaPdcFija() {
  return (
    <g>
      <ellipse cx={780} cy={520} rx={730} ry={470} className={s.citoplasmaGrande} />
      {Array.from({ length: 7 }, (_, j) => <path key={j} d={`M${860 + j * 18},${200 + j * 10} q120,40 240,0`} className={s.reticuloGrande} />)}
      <ellipse cx={N.cx} cy={N.cy} rx={N.rx} ry={N.ry} className={s.nucleo} />
      {Array.from({ length: 26 }, (_, i) => { const a = i * 2.39996, k = Math.sqrt((i + 0.5) / 26) * 0.8; return <circle key={i} cx={N.cx + Math.cos(a) * N.rx * k} cy={N.cy + Math.sin(a) * N.ry * k} r={7 + (i % 3) * 3} className={s.cromatina} />; })}
      <ellipse cx={E.cx} cy={E.cy} rx={E.rx + 8} ry={E.ry + 8} className={s.endosomaMem} />
      <ellipse cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} className={s.endosomaLuz} />
      <text x={E.cx + 150} y={E.cy + 30} textAnchor="middle" className={s.lSub}>pH ácido</text>
      <text x={60} y={70} className={s.lEtiquetaMayus}>Interior de la célula dendrítica plasmocitoide</text>
      <text x={E.cx} y={E.cy - 110} textAnchor="middle" className={s.lEtiqueta}>Endosoma</text>
      <text x={N.cx} y={N.cy - N.ry - 22} textAnchor="middle" className={s.lEtiqueta}>Núcleo</text>
    </g>
  );
});

function ComplejoDibujo({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <path d="M-50,-6 q12,-16 24,0 t24,0 t24,0 t24,0" fill="none" stroke={L.adn} strokeWidth={5} strokeLinecap="round" />
      <path d="M-40,22 q10,-12 20,0 t20,0 t20,0" fill="none" stroke={L.rnp} strokeWidth={5} strokeLinecap="round" />
      <Y x={-30} y={-26} ang={180} k={2.2} />
      <Y x={24} y={-28} ang={180} k={2.2} />
      <Y x={4} y={44} ang={0} k={2.2} />
    </g>
  );
}

export function FondoEndosoma({ t, reloj }: { t: T; reloj: number }) {
  const en = v(t, 'endo'), ce = v(t, 'complejoEndo'), t7 = v(t, 'tlr7'), t9 = v(t, 'tlr9'), vi = v(t, 'virus'), tr = v(t, 'troya');
  const se = v(t, 'senal'), ig = v(t, 'ifnGen'), is = v(t, 'ifnSale'), es = v(t, 'estrella'), ef = v(t, 'efectos');
  const ph = v(t, 'ph'), bl = v(t, 'bloqueo');
  const cx = lerp(80, E.cx, easeOut(ce)), cy = lerp(300, E.cy, easeOut(ce));
  return (
    <g opacity={en}>
      <CelulaPdcFija />
      {ph > 0.001 && (
        <g opacity={ph}>
          <ellipse cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} className={s.endosomaAlcalino} />
          <text x={E.cx + 120} y={E.cy + 70} textAnchor="middle" className={s.lEtiqueta} style={{ fill: '#2F6FD0' }}>pH sube</text>
        </g>
      )}
      {[-2.6, -2.1, -1.6, -1.1].map((a, j) => <Tlr key={`7${j}`} ang={a} c="#C0396E" k={t7} />)}
      {[1.1, 1.6, 2.1, 2.6].map((a, j) => <Tlr key={`9${j}`} ang={a} c="#2F6FD0" k={t9} />)}
      {t7 > 0.001 && <g opacity={t7}><text x={E.cx} y={E.cy - E.ry - 62} textAnchor="middle" className={s.etiquetaTlr7}>TLR7 · ARN</text></g>}
      {t9 > 0.001 && <g opacity={t9}><text x={E.cx} y={E.cy + E.ry + 80} textAnchor="middle" className={s.etiquetaTlr9}>TLR9 · ADN</text></g>}
      {ce > 0.001 && (
        <g opacity={Math.min(1, ce * 2)}>
          {ce < 0.98 && <circle cx={cx} cy={cy} r={86} className={s.vesiculaEntrada} />}
          {tr > 0.001 && <circle cx={cx} cy={cy} r={96 + 8 * Math.sin(reloj / 200)} className={s.haloTroya} opacity={tr} />}
          <ComplejoDibujo x={cx} y={cy} />
        </g>
      )}
      {vi > 0.001 && (
        <g opacity={vi * (1 - tr * 0.6)} transform={`translate(${E.cx + 150},${E.cy - 40})`}>
          <polygon points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17" className={s.virusFantasma} />
          <text y={64} textAnchor="middle" className={s.lSub}>hechos para virus</text>
        </g>
      )}
      <Chip x={800} y={110} w={760} txt="Caballo de Troya: el anticuerpo mete el ácido nucleico propio" k={tr * (1 - es)} clase={s.chipPista} />
      {se > 0.001 && (
        <g>
          <path d={`M${E.cx + E.rx + 20},${E.cy} C${E.cx + E.rx + 120},${E.cy - 60} ${N.cx - N.rx - 120},${N.cy - 60} ${N.cx - N.rx + 10},${N.cy}`} className={s.caminoSenal} {...dibujar(se)} />
          {Array.from({ length: 6 }, (_, j) => {
            const f = ((reloj / 1400 + j / 6) % 1) * se;
            const x0 = E.cx + E.rx + 20, x1 = N.cx - N.rx + 10;
            return <circle key={j} cx={lerp(x0, x1, f)} cy={E.cy - 46 * Math.sin(Math.PI * f)} r={7} fill="#E0892E" opacity={se} />;
          })}
          <text x={(E.cx + E.rx + N.cx - N.rx) / 2} y={E.cy - 80} textAnchor="middle" className={s.lEtiqueta} opacity={se}>MyD88 → IRF7</text>
        </g>
      )}
      {ig > 0.001 && (
        <g opacity={ig}>
          <line x1={N.cx - 150} y1={N.cy + 40} x2={N.cx + 150} y2={N.cy + 40} className={s.adnLinea} />
          <rect x={N.cx - 50} y={N.cy + 26} width={100} height={28} rx={8} fill="#E8B21E" />
          <text x={N.cx} y={N.cy + 92} textAnchor="middle" className={s.lEtiqueta}>gen del IFN-α</text>
        </g>
      )}
      {bl > 0.001 && (
        <g opacity={bl}>
          <path d={`M${E.cx + E.rx + 70},${E.cy - 80} l60,60 M${E.cx + E.rx + 130},${E.cy - 80} l-60,60`} className={s.cruz} />
          <text x={E.cx} y={E.cy + E.ry + 120} textAnchor="middle" className={s.lEtiquetaRoja}>la señal de TLR7 y TLR9 se frena</text>
        </g>
      )}
      {is > 0.001 && Array.from({ length: Math.round(34 * (1 - 0.8 * bl)) }, (_, i) => {
        const q = tramo(is, hash(i, 2) * 0.5, hash(i, 2) * 0.5 + 0.5);
        if (q <= 0) return null;
        const a = -1.2 + hash(i, 3) * 1.6;
        const r = 160 + q * 520;
        return <path key={i} d="M0,-7 L6.5,5 L-6.5,5 Z" fill="#C2410C" transform={`translate(${(N.cx + Math.cos(a) * r).toFixed(0)},${(N.cy + Math.sin(a) * r * 0.9).toFixed(0)}) rotate(${i * 40})`} opacity={1 - q * 0.4} />;
      })}
      {is > 0.4 && <text x={1340} y={130} textAnchor="middle" className={`${s.significado} ${s.textoIfn}`} opacity={tramo(is, 0.4, 0.8) * (1 - bl)}>IFN-α en cantidades enormes</text>}
      <Chip x={800} y={110} w={520} txt="La citocina estrella del lupus" k={es} clase={s.chipPista} />
      {[['Dendríticas maduran y presentan más', 330], ['Linfocitos B → productores de anticuerpos', 820], ['Más anticuerpos… y más complejos', 1290]].map(([txt, x], j) => (
        <Chip key={txt as string} x={x as number} y={920} w={j === 1 ? 520 : 440} txt={txt as string} k={clamp(ef - j)} clase={j === 2 ? s.chipPista : s.chip} />
      ))}
    </g>
  );
}
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ─── Firma ────────────────────────────────────────────────────────────────────

const GENES = ['IFI27', 'IFI44L', 'IFIT1', 'ISG15', 'MX1', 'OAS1', 'RSAD2', 'SIGLEC1'];
const HX = 400, HY = 230, CW = 70, CH = 52;

export function FondoFirma({ t }: { t: T }) {
  const fi = v(t, 'firma'), ti = v(t, 'firmaTit'), vi = v(t, 'viral'), an = v(t, 'anifro');
  return (
    <g>
      <text x={800} y={140} textAnchor="middle" className={s.tituloSeccion} opacity={0.35 + 0.65 * ti}>{ti > 0.5 ? 'La firma de interferón' : 'Genes encendidos en los leucocitos'}</text>
      <text x={HX + 2 * CW} y={HY - 22} textAnchor="middle" className={s.lEtiquetaMayus}>Sanos</text>
      <text x={HX + 4 * CW + 4 * CW} y={HY - 22} textAnchor="middle" className={s.lEtiquetaMayus}>Lupus</text>
      {GENES.map((g, r) => (
        <g key={g}>
          <text x={HX - 16} y={HY + r * CH + CH / 2} dy="0.35em" textAnchor="end" className={s.genTxt}>{g}</text>
          {Array.from({ length: 12 }, (_, c) => {
            const lupus = c >= 4;
            const base = lupus ? 0.55 + 0.45 * hash(r * 12 + c, 5) : 0.08 + 0.12 * hash(r * 12 + c, 6);
            const k = lupus ? tramo(fi, (c - 4) * 0.1, (c - 4) * 0.1 + 0.25) : 1;
            const val = lupus ? lerp(0.1, base, k) : base;
            return <rect key={c} x={HX + c * CW + (lupus ? 14 : 0)} y={HY + r * CH} width={CW - 4} height={CH - 4} rx={6} fill="#C2410C" opacity={0.08 + 0.85 * val} />;
          })}
        </g>
      ))}
      <Chip x={800} y={800} w={720} txt={vi > 0.5 ? 'Como si respondieran a una infección viral… que no existe' : 'Como si respondieran a una infección viral…'} k={Math.min(1, vi * 2)} />
      <Chip x={800} y={900} w={760} txt="Anifrolumab: bloquea el receptor del interferón I (capítulo 11)" k={an} clase={s.chipVerde} />
    </g>
  );
}

// ─── Red (NET) sobre el endotelio ─────────────────────────────────────────────

const RC = { x: 600, y: 430 };
const HEBRAS = Array.from({ length: 22 }, (_, i) => ({ a: (i / 22) * TAU + hash(i, 1) * 0.2, L: 230 + hash(i, 2) * 170, ond: hash(i, 3) }));

const EndotelioFijo = memo(function EndotelioFijo() {
  return (
    <g>
      <rect x={-40} y={860} width={1680} height={200} className={s.luzVaso} />
      {Array.from({ length: 17 }, (_, j) => <ellipse key={j} cx={50 + j * 100} cy={842} rx={48} ry={16} className={s.endotelio} />)}
      <text x={1560} y={815} textAnchor="end" className={s.lEtiquetaMayus}>Endotelio</text>
    </g>
  );
});

export function FondoRed({ t, reloj }: { t: T; reloj: number }) {
  const re = v(t, 'red'), pa = v(t, 'partes'), ba = v(t, 'bacterias'), au = v(t, 'autoag'), da = v(t, 'danoEndo'), pe = v(t, 'persisten'), pr = v(t, 'problema');
  return (
    <g>
      <EndotelioFijo />
      {Array.from({ length: 9 }, (_, i) => { const x = ((i * 190 + reloj * 0.07) % 1800) - 100; return <g key={i} transform={`translate(${x.toFixed(0)},${930 + (i % 3) * 22})`}><ellipse rx={26} ry={20} className={s.hematie} /><ellipse rx={12} ry={8} className={s.hematieCentro} /></g>; })}
      {da > 0.001 && Array.from({ length: 6 }, (_, j) => <ellipse key={j} cx={350 + j * 100} cy={842} rx={48} ry={16} className={s.endotelioDanado} opacity={da} />)}
      {re > 0.001 && (
        <g>
          {HEBRAS.map((h, i) => {
            const k = easeOut(tramo(re, i * 0.012, 0.6 + i * 0.012));
            const L2 = h.L * k * (h.a > 0.6 && h.a < 2.5 ? 1 + 0.6 * da : 1);
            const pts = Array.from({ length: 9 }, (_, n) => { const f = n / 8; const ox = Math.sin(f * 7 + h.ond * 6) * 14; return [RC.x + Math.cos(h.a) * L2 * f - Math.sin(h.a) * ox, RC.y + Math.sin(h.a) * L2 * f + Math.cos(h.a) * ox]; });
            return (
              <g key={i}>
                <path d={`M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`} className={s.hebraNet} />
                {pts.slice(2).filter((_, n) => n % 2 === 0).map(([x, y], n) => <circle key={n} cx={x} cy={y} r={5.5} fill={L.histona} opacity={k} />)}
                {pts.slice(3).filter((_, n) => n % 3 === 0).map(([x, y], n) => <circle key={`g${n}`} cx={x + 6} cy={y - 5} r={4} fill="#E0892E" opacity={k} />)}
              </g>
            );
          })}
          <circle cx={RC.x} cy={RC.y} r={40 * (1 - 0.4 * re)} className={s.restoNeutrofilo} />
        </g>
      )}
      {pa > 0.001 && (
        <g opacity={pa}>
          <text x={1020} y={250} className={s.lEtiqueta} style={{ fill: L.adn }}>ADN descondensado</text>
          <text x={1020} y={290} className={s.lEtiqueta} style={{ fill: L.histona }}>histonas</text>
          <text x={1020} y={330} className={s.lEtiqueta} style={{ fill: '#E0892E' }}>proteínas de gránulos (elastasa, MPO)</text>
        </g>
      )}
      {ba > 0.001 && [[420, 260], [760, 330], [520, 610], [800, 540]].map(([x, y], j) => (
        <rect key={j} x={x - 18} y={y - 7} width={36} height={14} rx={7} className={s.bacteria} opacity={ba} transform={`rotate(${j * 40} ${x} ${y})`} />
      ))}
      <Chip x={1240} y={420} w={560} txt="Hecha para atrapar bacterias…" k={ba * (1 - au)} />
      <Chip x={1240} y={420} w={600} txt="…en el lupus: otro paquete de autoantígeno" k={au} clase={s.chipPista} />
      {da > 0.4 && <text x={600} y={790} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(da, 0.4, 1)}>lesiona el endotelio</text>}
      <Chip x={800} y={110} w={820} txt="Normalmente las degrada la DNasa; en muchos pacientes persisten" k={pe * (1 - pr)} />
      <Chip x={800} y={110} w={pr > 0.5 ? 640 : 360} txt={pr > 0.5 ? 'El sistema se alimenta a sí mismo' : '¿Ves el problema?'} k={Math.min(1, pr * 2)} clase={s.chipPista} />
    </g>
  );
}
