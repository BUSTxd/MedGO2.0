'use client';
// Láminas del capítulo 11 («Complicaciones y tratamiento»). Sin tarjetas: cada dato es
// un dibujo y el texto va suelto, en segundo plano.
// · `txCompl`: el paciente rodeado de microbios, brote o infección, linfoma y
//   osteonecrosis.
// · `txCircuito`: el circuito del lupus con la hidroxicloroquina que corta su origen.
// · `endosomaTx`: la lámina del endosoma del capítulo 3, tal cual, y encima solo lo
//   que añade este capítulo (citocinas que bajan, reloj de arena y retina).
// · `txFarmacos`: corticoides, azatioprina y micofenolato, calcineurina y monoclonales.
// · `txFin`: la cadena entera del lupus y el cierre.

import { type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ComplejoRed, DibujoCelula, IgG } from './Celulas';
import { ArteCorticoide, ArteVirus, DefsPl, Flotante, lobulos, Nota, Silueta } from './FondoClinica';
import { DefsSg, Lente, Sello } from './FondoDano2';
import { ArteBacteria, Dial, Nivel } from './FondoDiagnostico';
import { FondoEndosoma } from './FondoInterferon';
import { DefsNe } from './FondoNefritis';
import { ArteManometro, FlechaViva, Titulo } from './FondoOrganos';
import { clamp, dibujar, easeBack, easeInOut, easeOut, IconoOrgano, tramo, v, type T } from './laminas';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rotulo = `${s.lEtiqueta} ${s.conHalo}`;
const halo = `${s.lSubChico} ${s.conHalo}`;
const subR = `${s.lSub} ${s.conHalo}`;

const Base = () => <g><DefsSg /><DefsPl /><DefsNe /></g>;
const Tachar = ({ k, r = 60 }: { k: number; r?: number }) => k <= 0.001 ? null : <path d={`M${-r},${-r} L${r},${r}`} stroke="#D1293D" strokeWidth={Math.max(6, r * 0.14)} strokeLinecap="round" {...dibujar(k)} />;

// ─── Piezas ───────────────────────────────────────────────────────────────────

const Virus = ({ c, o, rl, r = 20 }: { c: string; o: string; rl: number; r?: number }) => (
  <g transform={`rotate(${f1(rl / 60)})`}>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU; return <g key={i}><line x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * r * 1.5} y2={Math.sin(a) * r * 1.5} stroke={o} strokeWidth={2.6} /><circle cx={Math.cos(a) * r * 1.6} cy={Math.sin(a) * r * 1.6} r={r * 0.2} fill={o} /></g>; })}
    <circle r={r} fill={c} stroke={o} strokeWidth={1.6} /><circle cx={-r * 0.3} cy={-r * 0.34} r={r * 0.26} fill="#FFF" opacity={0.5} />
  </g>
);

const Pastilla = ({ a, b, txt }: { a: string; b: string; txt?: string }) => (
  <g transform="rotate(-26)">
    <path d="M-56,-25 H0 V25 H-56 A25,25 0 0 1 -56,-25 Z" fill={a} stroke="#3A4256" strokeWidth={2} />
    <path d="M0,-25 H56 A25,25 0 0 1 56,25 H0 Z" fill={b} stroke="#3A4256" strokeWidth={2} />
    <rect x={-66} y={-17} width={54} height={7} rx={3.5} fill="#FFF" opacity={0.55} />
    {txt && <text x={28} dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 17, fill: '#FFF' }}>{txt}</text>}
  </g>
);

const Ifn = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${f1(x)},${f1(y)})`}>
    <path d={`M0,${-r} L${r * 0.87},${-r / 2} V${r / 2} L0,${r} L${-r * 0.87},${r / 2} V${-r / 2} Z`} fill="#E0892E" stroke="#8A4A0E" strokeWidth={1.4} />
    <path d={`M${-r * 0.5},${-r * 0.28} L0,${-r * 0.6}`} stroke="#FFF" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
  </g>
);

const Termo = ({ rl }: { rl: number }) => (
  <g>
    <path d="M-9,-48 A9,9 0 0 1 9,-48 L9,12 A18,18 0 1 1 -9,12 Z" fill="#FFF" stroke="#7D899C" strokeWidth={2.6} />
    <rect x={-4} y={f1(-34 + Math.sin(rl / 700) * 3)} width={8} height={56} fill="url(#pl-mercurio)" />
    <circle cy={25} r={13} fill="url(#pl-mercurio)" />
    {[-40, -26, -12, 2].map((y) => <line key={y} x1={13} y1={y} x2={22} y2={y} stroke="#6E7789" strokeWidth={2} />)}
  </g>
);

const Llama = ({ k, rl }: { k: number; rl: number }) => {
  const q = 0.3 + 0.7 * k, m = Math.sin(rl / 170) * 4;
  return (
    <g transform={`scale(${q.toFixed(3)})`}>
      <path d={`M0,70 C-56,70 -66,16 -38,-12 C-34,10 -22,8 -22,-10 C-22,-38 ${-6 + m},-58 ${4 + m},-92 C20,-60 44,-36 46,-2 C48,4 40,12 34,-4 C56,18 54,70 0,70 Z`} fill="#F08A24" stroke="#C2410C" strokeWidth={2} />
      <path d={`M0,70 C-28,70 -34,38 -18,18 C-14,30 -6,28 -6,14 C-6,-4 ${2 - m},-16 ${8 - m},-38 C18,-16 32,0 30,26 C30,50 22,70 0,70 Z`} fill="#FFD54A" />
    </g>
  );
};

/** Saco, gotero y línea: los pulsos por la vena. */
function Goteo({ rl }: { rl: number }) {
  const f = (rl / 800) % 1;
  return (
    <g>
      <rect x={-3} y={-110} width={6} height={22} fill="#6E7789" />
      <path d="M-34,-90 H34 V-24 C34,-8 16,0 0,0 C-16,0 -34,-8 -34,-24 Z" fill="#DCEFFA" fillOpacity={0.9} stroke="#7D899C" strokeWidth={2.4} />
      <path d="M-30,-56 C-14,-60 14,-52 30,-56 V-24 C30,-10 16,-4 0,-4 C-16,-4 -30,-10 -30,-24 Z" fill="#79C2EC" />
      <text y={-28} textAnchor="middle" className={s.tarjTit} style={{ fontSize: 14 }}>IV</text>
      <rect x={-9} y={2} width={18} height={30} rx={4} fill="#FFF" fillOpacity={0.7} stroke="#7D899C" strokeWidth={1.8} />
      <circle cy={f1(6 + f * 22)} r={3.4} fill="#3F9FD8" opacity={1 - f * 0.3} />
      <path d="M0,32 C0,62 34,60 40,88 C44,108 20,112 6,110" fill="none" stroke="#9AA6B8" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** Cabeza del fémur con su trabeculado; `n` es la cuña de hueso muerto. */
function Femur({ n, rl }: { n: number; rl: number }) {
  const q = easeOut(n);
  return (
    <g>
      <path d="M-70,-62 C-98,-34 -96,14 -64,28 C-44,34 -34,44 -28,62 L-38,160 H26 L34,70 C40,44 66,16 76,-8 L58,-30 C44,-14 26,-18 8,-30 C4,-66 -36,-88 -70,-62 Z" fill="#F7EFDF" stroke="#AD9670" strokeWidth={2.4} strokeLinejoin="round" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-34 + i * 5},52 C${-44 + i * 5},18 ${-72 + i * 6},-10 ${-66 + i * 5},-48`} fill="none" stroke="#D9C8A4" strokeWidth={1.4} />)}
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-26 + i * 6},150 V70`} stroke="#D9C8A4" strokeWidth={1.4} />)}
      {n > 0.01 && (
        <g opacity={tramo(n, 0, 0.5)}>
          <path d={`M-48,-16 L${f1(-48 + Math.cos(-2.2) * 46 * q)},${f1(-16 + Math.sin(-2.2) * 46 * q)} A${f1(46 * q)},${f1(46 * q)} 0 0 1 ${f1(-48 + Math.cos(-0.65) * 46 * q)},${f1(-16 + Math.sin(-0.65) * 46 * q)} Z`} fill="#6A4A48" stroke="#3E2A28" strokeWidth={1.4} />
          <path d={`M${-84},${-46} C-64,-72 -30,-70 -14,-48`} fill="none" stroke="#D1293D" strokeWidth={3.4} strokeDasharray="5 4" opacity={0.65 + 0.35 * Math.sin(rl / 280)} />
        </g>
      )}
    </g>
  );
}

function Ganglio({ k, rl }: { k: number; rl: number }) {
  const n = Math.round(lerp(4, 26, easeInOut(k)));
  return (
    <g>
      <path d="M-40,-96 C24,-112 98,-70 100,-4 C102,56 40,104 -24,92 C-34,70 -34,56 -24,44 C-14,30 -14,-22 -24,-36 C-36,-52 -46,-70 -40,-96 Z" fill="#E7BCCB" stroke="#9E5A74" strokeWidth={2.4} />
      {[[10, -56, 26], [56, -22, 24], [52, 30, 24], [8, 58, 24], [-2, 0, 18]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y} r={r} fill="#C98AA8" /><circle cx={x} cy={y} r={r * 0.55} fill="#E9C8D8" /></g>)}
      {/* El clon que crece y borra la arquitectura */}
      {Array.from({ length: n }, (_, i) => {
        const a = i * 2.39996 + rl / 9000, q = Math.sqrt((i + 0.5) / 26) * 70;
        return <g key={i} transform={`translate(${f1(22 + Math.cos(a) * q)},${f1(Math.sin(a) * q)})`}><circle r={10} fill="#8E6AC8" stroke="#3E2478" strokeWidth={1} /><circle r={6} fill="#3E2470" /></g>;
      })}
      <path d="M-32,-2 H-74 M-28,28 H-68" stroke="#7D899C" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

// ─── Pasos 0 a 2 · las complicaciones ─────────────────────────────────────────

const ITEM_B: { t: string; i: Parameters<typeof IconoOrgano>[0]['i']; x: number }[] = [
  { t: 'piel', i: 'piel', x: 160 }, { t: 'neumonía', i: 'pulmon', x: 370 }, { t: 'urinarias', i: 'orina', x: 580 },
];

const ArteVaricela = (rl: number) => (
  <g>
    <circle r={48} fill="url(#pl-piel)" />
    <path d="M-44,-14 C-22,-34 18,14 44,-8" fill="none" stroke="#E0607C" strokeWidth={20} strokeLinecap="round" opacity={0.42} />
    {[[-30, -16], [-14, -14], [2, -4], [18, 0], [32, -6]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={6.6} fill="#FFF8DC" stroke="#D8486A" strokeWidth={2} /><circle cx={x - 2} cy={y - 2} r={1.6} fill="#FFF" /></g>)}
    <g transform={`translate(30,-40) scale(0.6)`}><Virus c="#D24E80" o="#7E1E4A" rl={rl} /></g>
  </g>
);
const ArteCmv = (rl: number) => (
  <g>
    <path d={lobulos(46, 10, 0.05, 3)} fill="#F4C6BE" stroke="#B5626C" strokeWidth={2} />
    <circle r={26} fill="#E9D6F4" stroke="#8E6AB4" strokeWidth={1.6} />
    <circle r={14} fill="#3E2470" />
    <g transform={`translate(34,-38) scale(0.6)`}><Virus c="#3F9FD8" o="#1F5F82" rl={rl} /></g>
  </g>
);
const ArteVph = (rl: number) => (
  <g>
    {[[-26, -8], [18, -22], [24, 22], [-16, 28]].map(([x, y], i) => <g key={i} transform={`translate(${x},${y}) scale(0.72)`}><Virus c="#7B4FC9" o="#3E2478" rl={rl + i * 500} /></g>)}
  </g>
);

function Brote({ k, rl }: { k: number; rl: number }) {
  return (
    <g transform="translate(0,6)">
      <g transform="scale(0.72)"><Llama k={1} rl={rl} /></g>
      <g transform={`translate(78,${f1(14 - Math.abs(Math.sin(rl / 320)) * 8)})`} opacity={k}>
        <path d="M0,-30 L22,0 H9 V30 H-9 V0 H-22 Z" fill="#7B4FC9" stroke="#FFF" strokeWidth={2.4} strokeLinejoin="round" />
      </g>
    </g>
  );
}

export function FondoTxCompl({ t, reloj }: { t: T; reloj: number }) {
  const co = v(t, 'kCom'), inf = v(t, 'kInf'), inL = v(t, 'kInfL'), ba = v(t, 'kBac'), vi = v(t, 'kVir');
  const fi = v(t, 'tFie'), du = v(t, 'tDud'), br = v(t, 'kBro'), in2 = v(t, 'kIn2'), pi = v(t, 'kPI'), pb = v(t, 'kPB'), dd = v(t, 'kDuda');
  const li = v(t, 'kLin'), os = v(t, 'kOst'), ca = v(t, 'kCad'), ca2 = v(t, 'kCadL'), pu = v(t, 'kPul');
  const C = 2 * Math.PI * 62, barre = easeOut(inf);
  return (
    <g>
      <Base />
      {/* Paso 0 */}
      <Titulo x={800} y={60} t="Complicaciones" sub="de la enfermedad y de los fármacos" k={co} fin="middle" tam={36} />
      {inf > 0.001 && (
        <g opacity={tramo(inf, 0, 0.4)}>
          <g transform="translate(800,296) scale(1.5)"><Silueta x={0} y={0} k={1} focos={[]} piel={[]} rl={reloj} /></g>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * TAU + reloj / 5200, r = lerp(300, 188, easeOut(inf)) + Math.sin(reloj / 500 + i) * 8, x = 800 + Math.cos(a) * r, y = 290 + Math.sin(a) * r * 0.6;
            return <g key={i} transform={`translate(${f1(x)},${f1(y)}) scale(${i % 2 ? 0.46 : 0.8})`}>{i % 2 ? <ArteBacteria_ rl={reloj + i * 200} /> : <Virus c={['#2CA99A', '#D24E80', '#3F9FD8', '#7B4FC9', '#2CA99A'][i / 2]} o={['#14695F', '#7E1E4A', '#1F5F82', '#3E2478', '#14695F'][i / 2]} rl={reloj + i * 300} />}</g>;
          })}
          <g transform="translate(260,300) rotate(-90)">
            <circle r={62} fill="none" stroke="#9AA3B8" strokeOpacity={0.3} strokeWidth={22} />
            <circle r={62} fill="none" stroke="#F0A8A8" strokeWidth={22} strokeDasharray={`${C * 0.5 * barre} ${C}`} />
            <circle r={62} fill="none" stroke="#D1293D" strokeWidth={22} strokeDasharray={`${C * 0.25 * barre} ${C}`} />
          </g>
          <text x={260} y={420} textAnchor="middle" className={`${s.sgNum} ${s.conHalo}`} style={{ fontSize: 44, fill: '#D1293D' }}>25 a 50 %</text>
          <text x={260} y={452} textAnchor="middle" className={halo} style={{ fontSize: 19 }}>de las muertes, en algunas series</text>
          <text x={1290} y={300} textAnchor="middle" className={rotulo} style={{ fontSize: 40, fill: '#D1293D' }} opacity={tramo(inL, 0, 0.6)}>Infecciones</text>
          <text x={1290} y={336} textAnchor="middle" className={subR} style={{ fontSize: 21 }} opacity={tramo(inL, 0.2, 0.8)}>la complicación más importante</text>
        </g>
      )}
      <Titulo x={370} y={540} t="Bacterianas" k={ba} fin="middle" tam={28} />
      {ITEM_B.map((b, i) => {
        const k = tramo(ba, i * 0.2, 0.5 + i * 0.2);
        return (
          <g key={b.t}>
            <Flotante x={b.x} y={650} k={k} rl={reloj} fase={i * 1.5} esc={1} alto={62}>
              <g><IconoOrgano i={b.i} x={0} y={0} k={0.95} /><g transform="translate(36,-34) scale(0.42)"><ArteBacteria_ rl={reloj} /></g></g>
            </Flotante>
            <Nota x={b.x} y={754} t={b.t} k={k} tam={21} />
          </g>
        );
      })}
      <Titulo x={1180} y={540} t="Virales" k={vi} fin="middle" tam={28} />
      <Flotante x={960} y={650} k={tramo(vi, 0, 0.4)} rl={reloj} esc={1.05} alto={62}>{ArteVaricela(reloj)}</Flotante>
      <Nota x={960} y={754} t="varicela zóster" k={tramo(vi, 0, 0.4)} tam={21} />
      <Flotante x={1180} y={650} k={tramo(vi, 0.25, 0.65)} rl={reloj} fase={2} esc={1.05} alto={62}>{ArteCmv(reloj)}</Flotante>
      <Nota x={1180} y={754} t="citomegalovirus" k={tramo(vi, 0.25, 0.65)} tam={21} />
      <Flotante x={1400} y={650} k={tramo(vi, 0.5, 1)} rl={reloj} fase={4} esc={1.05} alto={62}>{ArteVph(reloj)}</Flotante>
      <Nota x={1400} y={754} t="VPH persistente" k={tramo(vi, 0.5, 1)} tam={21} />

      {/* Paso 1 · ¿brote o infección? */}
      {fi > 0.001 && (
        <g opacity={tramo(fi, 0, 0.5)}>
          <g transform="translate(800,-52) scale(0.34)"><Retrato id="txFie" soloCabeza /></g>
          <g transform={`translate(910,${f1(150 + Math.sin(reloj / 800) * 3)}) rotate(14)`}><Termo rl={reloj} /></g>
          <text x={1000} y={120} className={rotulo} style={{ fontSize: 24 }}>Llega con fiebre</text>
        </g>
      )}
      <Titulo x={800} y={300} t="¿Brote o infección?" k={du} fin="middle" tam={46} color={L.lupus} />
      <FlechaViva a={{ x: 580, y: 296 }} c={{ x: 450, y: 296 }} b={{ x: 370, y: 372 }} k={tramo(br, 0, 0.6)} rl={reloj} color="#7B4FC9" grosor={7} />
      <FlechaViva a={{ x: 1020, y: 296 }} c={{ x: 1150, y: 296 }} b={{ x: 1230, y: 372 }} k={tramo(in2, 0, 0.6)} rl={reloj} color="#D1293D" grosor={7} fase={0.4} />
      <Flotante x={240} y={460} k={br} rl={reloj} esc={1.05} alto={66}><Brote k={br} rl={reloj} /></Flotante>
      <Nota x={420} y={448} t="Brote" sub="subir la inmunosupresión" k={br} fin="start" tam={28} />
      <Flotante x={1020} y={460} k={in2} rl={reloj} fase={2} esc={1.15} alto={48}>{ArteBacteria(reloj)}</Flotante>
      <Nota x={1140} y={448} t="Infección" sub="la inmunosupresión la empeora" k={in2} fin="start" tam={28} />
      {/* Pistas */}
      <Nivel x={150} y={590} h={190} n={lerp(0.82, 0.22, easeInOut(pb))} nom="C3 C4" k={pb} />
      {pb > 0.001 && (
        <g opacity={tramo(pb, 0.2, 0.8)}>
          <g transform={`translate(330,${f1(660 + Math.sin(reloj / 800) * 3)}) scale(1.05)`}>
            <path d={Array.from({ length: 2 }, (_, l) => `M-38,0 ${Array.from({ length: 4 }, (__, j) => `q9.5,${(j % 2 === l ? -1 : 1) * 22} 19,0`).join(' ')}`).join(' ')} fill="none" stroke="#2F6FD0" strokeWidth={4} strokeLinecap="round" />
            <IgG x={-14} y={-30} ang={180} k={0.72} /><IgG x={18} y={32} ang={0} k={0.72} />
          </g>
          <g transform={`translate(410,${f1(655 - Math.abs(Math.sin(reloj / 320)) * 8)})`}><path d="M0,-26 L19,0 H8 V26 H-8 V0 H-19 Z" fill="#7B4FC9" stroke="#FFF" strokeWidth={2} strokeLinejoin="round" /></g>
          <text x={470} y={650} className={rotulo} style={{ fontSize: 23 }}>Complemento bajo</text>
          <text x={470} y={680} className={rotulo} style={{ fontSize: 23 }}>y anti-ADN en aumento</text>
          <text x={470} y={718} className={rotulo} style={{ fontSize: 26, fill: '#7B4FC9' }}>→ brote</text>
        </g>
      )}
      <Dial x={950} y={690} r={84} val={lerp(0.1, 0.95, easeOut(pi))} k={pi} t="PCR" c="#D1293D" />
      <Nivel x={1120} y={590} h={190} n={0.78} nom="C3 C4" k={pi} />
      {pi > 0.001 && (
        <g opacity={tramo(pi, 0.2, 0.8)}>
          <text x={1190} y={650} className={rotulo} style={{ fontSize: 23 }}>PCR muy alta</text>
          <text x={1190} y={680} className={rotulo} style={{ fontSize: 23 }}>y complemento normal</text>
          <text x={1190} y={718} className={rotulo} style={{ fontSize: 26, fill: '#D1293D' }}>→ infección</text>
        </g>
      )}
      <Sello x={800} y={906} w={880} txt="ANTE LA DUDA: PRIMERO SE BUSCA LA INFECCIÓN" k={dd} sz={25} rot={-2} />

      {/* Paso 2 · linfoma y osteonecrosis */}
      <Flotante x={330} y={210} k={li} rl={reloj} esc={1.3} alto={126}><Ganglio k={li} rl={reloj} /></Flotante>
      <Nota x={330} y={382} t="Linfoma no Hodgkin" sub="disfunción inmune crónica · tratamientos" k={li} tam={27} />
      {os > 0.001 && <g opacity={tramo(os, 0, 0.4)} transform={`translate(1020,${f1(150 + Math.sin(reloj / 800) * 3)})`}><Femur n={os} rl={reloj} /></g>}
      <Nota x={1300} y={190} t="Osteonecrosis" sub="de la cabeza del fémur" k={os} fin="start" tam={27} />
      {os > 0.001 && <text x={1300} y={246} className={subR} style={{ fontSize: 20 }} opacity={tramo(os, 0.5, 1)}>sobre todo con glucocorticoides</text>}
      {ca > 0.001 && (
        <g opacity={tramo(ca, 0, 0.5)}>
          <g transform={`translate(170,${f1(650 + Math.sin(reloj / 800) * 3)}) scale(1.4)`}>{ArteCorticoide}</g>
          <text x={300} y={666} textAnchor="middle" className={`${s.safSigno} ${s.conHalo}`} style={{ fontSize: 50 }}>+</text>
          <g transform="translate(450,640)">
            <circle r={60 + Math.sin(reloj / 260) * 6} fill="url(#pl-infl)" />
            <IconoOrgano i="articulacion" x={0} y={0} k={0.9} />
            {[[-44, -46, -20], [46, -44, 20]].map(([x, y, a], i) => <path key={i} d="M4,-17 L-9,3 H0 L-4,17 L10,-4 H1 Z" fill="#F2B21E" stroke="#A8821A" strokeWidth={1} strokeLinejoin="round" transform={`translate(${x},${y}) rotate(${a}) scale(${(1.1 + 0.2 * Math.sin(reloj / 170 + i)).toFixed(3)})`} />)}
          </g>
          <FlechaViva a={{ x: 540, y: 650 }} c={{ x: 600, y: 636 }} b={{ x: 660, y: 650 }} k={tramo(ca, 0.3, 1)} rl={reloj} color={L.lupus} grosor={7} />
          <g transform="translate(770,590) scale(0.82)"><Femur n={1} rl={reloj} /></g>
          <Nota x={460} y={800} t="Corticoides y dolor de cadera" sub="piensa en osteonecrosis" k={ca} tam={28} />
          {ca2 > 0.01 && <circle cx={732} cy={570} r={62} fill="none" stroke={L.lupus} strokeWidth={5} opacity={ca2 * (0.6 + 0.4 * Math.sin(reloj / 260))} />}
        </g>
      )}
      <Flotante x={1250} y={640} k={pu} rl={reloj} esc={1} alto={110}><IconoOrgano i="pulmon" x={0} y={0} k={1.6} /></Flotante>
      <Nota x={1250} y={796} t="Pulmón" sub="intersticial e hipertensión pulmonar (capítulo 8)" k={pu} tam={26} />
    </g>
  );
}

const ArteBacteria_ = ({ rl }: { rl: number }) => <g>{ArteBacteria(rl)}</g>;

// ─── Paso 3 · cada fármaco corta el circuito ──────────────────────────────────

const NODOS = [
  { p: 'n1', x: 800, y: 172, t: 'Endosoma', sub: 'TLR7 y TLR9, en la pDC', dx: 0, dy: 118 },
  { p: 'n2', x: 1270, y: 390, t: 'Interferón I', sub: 'la firma', dx: 0, dy: 108 },
  { p: 'n3', x: 1100, y: 800, t: 'Linfocito B', sub: 'BAFF · CD20', dx: 0, dy: 108 },
  { p: 'n4', x: 500, y: 800, t: 'Linfocito T', sub: 'calcineurina · IL-2', dx: 0, dy: 108 },
  { p: 'n5', x: 330, y: 390, t: 'Inflamación y daño', sub: 'en los tejidos', dx: 0, dy: 108 },
];

function ArteNodo({ i, rl }: { i: number; rl: number }) {
  if (i === 0) return (
    <g>
      <ellipse rx={84} ry={58} fill="#DCEBFA" stroke="#7B4FC9" strokeWidth={5} />
      {[[-46, -34, 30], [0, -46, 0], [46, -34, -30]].map(([x, y, a], j) => <g key={j} transform={`translate(${x},${y}) rotate(${a})`}><path d="M-10,12 Q0,-10 10,12" fill="none" stroke="#C2385A" strokeWidth={5} strokeLinecap="round" /></g>)}
      {[[-46, 34, 150], [0, 46, 180], [46, 34, 210]].map(([x, y, a], j) => <g key={j} transform={`translate(${x},${y}) rotate(${a})`}><path d="M-10,12 Q0,-10 10,12" fill="none" stroke="#2F6FD0" strokeWidth={5} strokeLinecap="round" /></g>)}
      <path d="M-32,0 q8,-14 16,0 t16,0 t16,0 t16,0" fill="none" stroke="#2F6FD0" strokeWidth={3.6} strokeLinecap="round" />
    </g>
  );
  if (i === 1) return (
    <g>
      {Array.from({ length: 9 }, (_, j) => { const f = (rl / 2000 + j / 9) % 1, a = (j / 9) * TAU, d = 14 + f * 74; return <g key={j} opacity={Math.sin(f * Math.PI)}><Ifn x={Math.cos(a) * d} y={Math.sin(a) * d} r={15} /></g>; })}
      <Ifn x={0} y={0} r={24} />
    </g>
  );
  if (i === 2) return <DibujoCelula dibujo="linfocito" d={124} color="#2F6FD0" />;
  if (i === 3) return <DibujoCelula dibujo="linfocito" d={124} color="#D24E80" />;
  return <g><circle r={72 + Math.sin(rl / 280) * 6} fill="url(#pl-infl)" /><IconoOrgano i="rinon" x={0} y={0} k={1.15} /></g>;
}

export function FondoTxCircuito({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'cA'), ti = v(t, 'cT'), hc = v(t, 'hcq'), hb = v(t, 'hcqB'), pi = v(t, 'pilar');
  const fle: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }, number][] = [
    [{ x: 900, y: 180 }, { x: 1120, y: 200 }, { x: 1230, y: 290 }, 0],
    [{ x: 1275, y: 535 }, { x: 1290, y: 650 }, { x: 1190, y: 762 }, 0.2],
    [{ x: 1020, y: 810 }, { x: 800, y: 870 }, { x: 590, y: 815 }, 0.4],
    [{ x: 440, y: 730 }, { x: 330, y: 660 }, { x: 322, y: 540 }, 0.6],
    [{ x: 380, y: 300 }, { x: 480, y: 190 }, { x: 690, y: 176 }, 0.8],
  ];
  return (
    <g>
      <Base />
      <Titulo x={60} y={70} t="Cada fármaco corta" k={ti} tam={30} color={L.tratamiento} />
      <Titulo x={60} y={108} t="el circuito en un punto" k={ti} tam={30} color={L.tratamiento} />
      {fle.map(([a, c, b, f], i) => <FlechaViva key={i} a={a} c={c} b={b} k={tramo(ca, i * 0.17, 0.3 + i * 0.17)} rl={reloj} color={L.tratamiento} grosor={8} fase={f} />)}
      {NODOS.map((n, i) => {
        const k = v(t, n.p);
        return (
          <g key={n.p}>
            <Flotante x={n.x} y={n.y} k={k} rl={reloj} fase={i * 1.3} esc={1} alto={i === 0 ? 76 : 84}><ArteNodo i={i} rl={reloj} /></Flotante>
            <Nota x={n.x} y={n.y + n.dy} t={n.t} sub={n.sub} k={k} tam={23} />
          </g>
        );
      })}
      {/* La hidroxicloroquina, en el centro, sube hasta el origen */}
      <Flotante x={800} y={500} k={hc} rl={reloj} esc={1.5} alto={62}><Pastilla a="#FFF" b={L.tratamiento} txt="HCQ" /></Flotante>
      <Nota x={800} y={606} t="Hidroxicloroquina" sub="para todos, salvo contraindicación" k={hc} tam={32} />
      <FlechaViva a={{ x: 800, y: 440 }} c={{ x: 792, y: 400 }} b={{ x: 800, y: 352 }} k={tramo(hb, 0, 0.6)} rl={reloj} color="#D1293D" grosor={9} />
      {hb > 0.3 && <path d="M752,338 H848" stroke="#D1293D" strokeWidth={11} strokeLinecap="round" opacity={tramo(hb, 0.3, 0.8)} />}
      {pi > 0.001 && <text x={800} y={690} textAnchor="middle" className={rotulo} style={{ fontSize: 23, fill: L.tratamiento }} opacity={tramo(pi, 0, 0.6)}>El pilar de base: del lupus más leve al más grave</text>}
    </g>
  );
}

// ─── Paso 4 · lo que se le añade al endosoma ──────────────────────────────────

const CITO = ['IFN I', 'IL-1', 'IL-6', 'TNF'];
const CITO_C = ['#E0892E', '#C0397A', '#7B4FC9', '#2F8FB0'];

function Retina() {
  return (
    <g>
      <rect x={-90} y={-90} width={180} height={180} fill="#D9752E" />
      <circle cx={-34} r={14} fill="#FFE7B8" />
      {[-40, -20, 10, 34].map((a, i) => <path key={i} d={`M-34,0 Q${f1(10)},${f1(a * 0.6)} ${f1(70)},${f1(a * 1.4)}`} fill="none" stroke="#A82C28" strokeWidth={2.4} />)}
      <circle cx={24} cy={0} r={22} fill="none" stroke="#F8D7A8" strokeWidth={9} opacity={0.85} />
      <circle cx={24} cy={0} r={10} fill="#8E3A1E" />
    </g>
  );
}

function CapaHcq({ t, reloj }: { t: T; reloj: number }) {
  const x1 = v(t, 'hx1'), x2 = v(t, 'hx2'), x3 = v(t, 'hx3'), x4 = v(t, 'hx4');
  const arena = (reloj / 5000) % 1;
  return (
    <g>
      <Base />
      {/* Citocinas que bajan */}
      {CITO.map((c, i) => {
        const k = tramo(x1, i * 0.15, 0.4 + i * 0.15), x = 50 + i * 96;
        return k > 0.001 ? (
          <g key={c} opacity={tramo(k, 0, 0.5)}>
            <g transform={`translate(${x},${f1(948 + Math.sin(reloj / 700 + i) * 3)})`}>
              <circle r={28} fill={CITO_C[i]} stroke="#FFF" strokeWidth={3} /><circle r={28} fill="url(#sg-bola)" />
              <text dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 16 }}>{c}</text>
            </g>
            <g transform={`translate(${x + 37},${f1(944 + Math.abs(Math.sin(reloj / 320 + i)) * 5)})`}><path d="M0,14 L11,-1 H4 V-14 H-4 V-1 H-11 Z" fill="#2F6FD0" stroke="#FFF" strokeWidth={1.6} strokeLinejoin="round" /></g>
          </g>
        ) : null;
      })}
      {x2 > 0.001 && <text x={1110} y={50} textAnchor="middle" className={rotulo} style={{ fontSize: 28, fill: L.tratamiento }} opacity={tramo(x2, 0, 0.6)}>Corta el círculo vicioso en su origen</text>}
      {/* Lenta: un reloj de arena */}
      {x3 > 0.001 && (
        <g opacity={tramo(x3, 0, 0.5)}>
          <g transform={`translate(860,${f1(885 + Math.sin(reloj / 800) * 3)})`}>
            <rect x={-40} y={-66} width={80} height={11} rx={5} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
            <rect x={-40} y={55} width={80} height={11} rx={5} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
            <path d="M-30,-55 C-30,-20 -8,-14 -5,0 C-8,14 -30,20 -30,55 H30 C30,20 8,14 5,0 C8,-14 30,-20 30,-55 Z" fill="#FFF" fillOpacity={0.7} stroke="#7D899C" strokeWidth={2.4} />
            <path d={`M${f1(-24 * (1 - arena * 0.8))},${f1(-48 + arena * 36)} H${f1(24 * (1 - arena * 0.8))} L2,-3 H-2 Z`} fill="#E0A93E" />
            <path d={`M-24,52 C-18,${f1(52 - 28 * arena)} 18,${f1(52 - 28 * arena)} 24,52 Z`} fill="#E0A93E" />
            <line x1={0} y1={0} x2={0} y2={46} stroke="#E0A93E" strokeWidth={2} strokeDasharray="3 4" />
          </g>
          <text x={930} y={884} className={rotulo} style={{ fontSize: 23 }}>Lenta</text>
          <text x={930} y={912} className={halo} style={{ fontSize: 19 }}>tarda semanas</text>
        </g>
      )}
      {/* Riesgo: la retina */}
      <Lente id="tx-ret" x={1200} y={886} r={70} k={x3}><Retina /></Lente>
      {x3 > 0.001 && <text x={1290} y={884} className={rotulo} style={{ fontSize: 23 }} opacity={tramo(x3, 0.3, 0.8)}>Retinopatía</text>}
      {x4 > 0.001 && <text x={1290} y={912} className={halo} style={{ fontSize: 19 }} opacity={tramo(x4, 0, 0.6)}>controles con el oftalmólogo</text>}
    </g>
  );
}

export function FondoEndosomaTx({ t, reloj }: { t: T; reloj: number }) {
  // El mismo degradado de la lámina, prolongado: en pantallas anchas no quedan barras.
  return (
    <g>
      <linearGradient id="tx-fondo" gradientUnits="userSpaceOnUse" gradientTransform="scale(1600,1000)" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className={s.ifF1} /><stop offset="1" className={s.ifF2} /></linearGradient>
      <g opacity={v(t, 'endo')}><rect x={-800} y={0} width={802} height={1000} fill="url(#tx-fondo)" /><rect x={1598} y={0} width={802} height={1000} fill="url(#tx-fondo)" /></g>
      <FondoEndosoma t={t} reloj={reloj} />
      <CapaHcq t={t} reloj={reloj} />
    </g>
  );
}

// ─── Pasos 5 a 7 · los fármacos ───────────────────────────────────────────────

const ArteAzucar = (rl: number) => (
  <g>
    <rect x={-30} y={-46} width={60} height={92} rx={12} fill="#2A3144" />
    <rect x={-21} y={-36} width={42} height={30} rx={4} fill="#BEEBD2" />
    <text y={-14} textAnchor="middle" className={s.tarjTit} style={{ fontSize: 17 }}>↑ Glu</text>
    <g transform={`translate(44,${f1(30 + ((rl / 1000) % 1) * 12)})`}><path d="M0,-14 C-6,-4 -9,0 -9,6 A9,9 0 0 0 9,6 C9,0 6,-4 0,-14 Z" fill="#D1293D" /></g>
  </g>
);
const ArteArteriaPlaca = (
  <g>
    <rect x={-56} y={-30} width={112} height={60} fill="#FFE9CE" />
    <rect x={-56} y={-38} width={112} height={12} fill="#B5486A" /><rect x={-56} y={26} width={112} height={12} fill="#B5486A" />
    <path d="M-34,-26 C-12,10 12,10 34,-26 Z" fill="#EBC06A" stroke="#B88A3C" strokeWidth={1.4} />
    <ellipse cx={-34} cy={12} rx={10} ry={6} fill="#D8423E" /><ellipse cx={26} cy={16} rx={10} ry={6} fill="#D8423E" />
  </g>
);

/** La dosis cae con el tiempo: el objetivo de los corticoides. */
function CurvaDosis({ x, y, k, rl }: { x: number; y: number; k: number; rl: number }) {
  if (k <= 0.001) return null;
  const W = 400, H = 170, yf = (q: number) => H * (1 - Math.exp(-q * 3.4)) * 0.88;
  const d = Array.from({ length: 31 }, (_, i) => { const q = i / 30; return `${i ? 'L' : 'M'}${f1(q * W)},${f1(yf(q))}`; }).join(' ');
  const q = (rl / 3400) % 1;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(k, 0, 0.3)}>
      <path d={`M0,-8 V${H} H${W}`} fill="none" stroke="var(--texto-2)" strokeWidth={3} strokeLinecap="round" />
      <text x={8} y={-14} className={halo} style={{ fontSize: 15 }}>dosis</text>
      <text x={W} y={H + 24} textAnchor="end" className={halo} style={{ fontSize: 15 }}>tiempo</text>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill={L.tratamiento} opacity={0.14} />
      <path d={d} fill="none" stroke={L.tratamiento} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...dibujar(tramo(k, 0.05, 0.8))} />
      {k > 0.8 && <g transform={`translate(${f1(q * W)},${f1(yf(q))})`}><circle r={9} fill="#FFF" stroke={L.tratamiento} strokeWidth={3.4} /></g>}
    </g>
  );
}

const Purina = (
  <g>
    <path d="M-30,-22 L-6,-34 L16,-22 V6 L-6,18 L-30,6 Z" fill="#FBEFD0" stroke="#A8821A" strokeWidth={3} strokeLinejoin="round" />
    <path d="M16,-22 L40,-14 L46,8 L28,18 L16,6" fill="#F4DFA6" stroke="#A8821A" strokeWidth={3} strokeLinejoin="round" />
    <text x={-8} y={-1} textAnchor="middle" className={s.tarjTit} style={{ fontSize: 15 }}>N</text>
    <circle cx={-30} cy={-22} r={4} fill="#2F6FD0" /><circle cx={16} cy={-22} r={4} fill="#2F6FD0" /><circle cx={46} cy={8} r={4} fill="#2F6FD0" />
  </g>
);

/** El linfocito quiere dividirse y no le alcanza: las hijas se quedan en fantasma. */
function Dividir({ x, y, k, rl }: { x: number; y: number; k: number; rl: number }) {
  if (k <= 0.001) return null;
  const f = (rl / 2400) % 1, sep = 30 + Math.sin(f * Math.PI) * 58;
  return (
    <g opacity={tramo(k, 0, 0.4)} transform={`translate(${x},${y})`}>
      {[-1, 1].map((l) => (
        <g key={l} opacity={0.38 * Math.sin(f * Math.PI)} transform={`translate(${f1(l * sep)},${f1(-l * sep * 0.34)})`}>
          <circle r={66} fill="none" stroke="#D24E80" strokeWidth={3} strokeDasharray="7 7" />
        </g>
      ))}
      <DibujoCelula dibujo="linfocito" d={144} color="#D24E80" />
    </g>
  );
}

const ArteCitopenia = (
  <g>
    <circle r={46} fill="#FBE3E8" stroke="#D99AAE" strokeWidth={2} />
    <g transform="translate(-16,-14) scale(0.6)"><use href="#sg-rbc" /></g>
    <g transform="translate(18,18) scale(0.5)"><use href="#sg-rbc" /></g>
    <g transform="translate(22,-16)"><use href="#sg-plq" /></g>
    <path d="M-24,22 m-6,0 a6,6 0 1 0 12,0 a6,6 0 1 0 -12,0" fill="none" stroke="#A9B2C2" strokeWidth={2} strokeDasharray="3 3" />
  </g>
);
const ArteDiarrea = (rl: number) => (
  <g>
    <path d="M-40,-30 C-16,-46 18,-46 40,-30 C50,-16 30,-12 22,-18 C8,-26 -10,-26 -20,-18 C-30,-10 -14,-4 0,-4 C18,-4 42,-2 40,14 C38,28 14,22 4,16 C-14,8 -38,10 -38,22 C-38,34 -20,36 -4,34" fill="none" stroke="#E98D8A" strokeWidth={17} strokeLinecap="round" />
    <path d="M-40,-30 C-16,-46 18,-46 40,-30" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    {[0, 1, 2].map((j) => { const f = (rl / 1000 + j / 3) % 1; return <path key={j} d="M0,-7 C-3,-2 -5,0 -5,3 A5,5 0 0 0 5,3 C5,0 3,-2 0,-7 Z" fill="#3F9FD8" opacity={1 - f} transform={`translate(${-10 + j * 11},${f1(36 + f * 22)})`} />; })}
  </g>
);
const ArteEmbarazo = (
  <g>
    <circle cy={-40} r={15} fill="#EFC4A6" />
    <path d="M-15,-46 C-16,-60 16,-60 15,-46 C11,-54 -11,-54 -15,-46 Z" fill="#4A2C20" />
    <path d="M-17,50 L-14,-14 C-12,-22 12,-22 14,-14 C20,-6 28,6 28,18 C28,28 18,32 12,32 L16,50 Z" fill="#7B4FC9" />
    <path d="M10,-2 C18,2 22,10 20,16" fill="none" stroke="#FFF" strokeWidth={2.6} strokeLinecap="round" opacity={0.5} />
  </g>
);
const ArteHirsutismo = (
  <g>
    <rect x={-46} y={-20} width={92} height={40} rx={18} fill="url(#pl-torso)" stroke="#A9765C" strokeWidth={1.6} />
    {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${-40 + i * 6.6},${-8 + (i % 3) * 8} q3,-6 7,-10`} fill="none" stroke="#3A2820" strokeWidth={1.8} strokeLinecap="round" />)}
  </g>
);
const ArteInteracciones = (
  <g>
    <g transform="translate(-30,-22) scale(0.5)"><Pastilla a="#FFF" b="#E0526E" /></g>
    <g transform="translate(34,-16) scale(0.5) rotate(50)"><Pastilla a="#FFF" b="#2F8FB0" /></g>
    <g transform="translate(0,30) scale(0.5) rotate(90)"><Pastilla a="#FFF" b="#E0892E" /></g>
    <path d="M-4,-14 H8 M12,8 L6,16 M-14,4 L-8,14" stroke="#D1293D" strokeWidth={3.6} strokeLinecap="round" />
  </g>
);

/** Dentro del linfocito T: calcineurina → NFAT → núcleo → IL-2, y dónde se corta. */
function CelulaT({ k, bl, rl }: { k: number; bl: number; rl: number }) {
  if (k <= 0.001) return null;
  const f = (rl / 2200) % 1, hay = 1 - easeOut(bl);
  return (
    <g opacity={tramo(k, 0, 0.3)} transform="translate(370,320)">
      <path d={lobulos(250, 16, 0.025, 4)} transform="scale(1.3,0.92)" fill="#F7D6E2" stroke="#B85A7C" strokeWidth={3} />
      <ellipse cx={120} cy={0} rx={118} ry={112} fill="#D9C4EC" stroke="#6E4A9E" strokeWidth={3} />
      {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * TAU; return <circle key={i} cx={f1(120 + Math.cos(a) * 104)} cy={f1(Math.sin(a) * 98)} r={4.4} fill="#6E4A9E" opacity={0.65} />; })}
      {/* El gen de IL-2 */}
      <path d="M50,44 q18,-14 36,0 t36,0 t36,0 t36,0" fill="none" stroke="#2F6FD0" strokeWidth={4} strokeLinecap="round" />
      <rect x={100} y={30} width={60} height={28} rx={7} fill="#F2C94C" stroke="#A8821A" strokeWidth={1.4} />
      <text x={130} y={44} dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 15 }}>IL-2</text>
      {/* Calcineurina */}
      <g transform="translate(-210,-30)">
        <circle r={46} fill="#D24E80" stroke="#7E1E4A" strokeWidth={2} /><circle r={46} fill="url(#sg-bola)" />
        <text y={76} textAnchor="middle" className={s.lEtiqueta} style={{ fontSize: 19, fill: '#4A1F35' }}>Calcineurina</text>
      </g>
      {/* NFAT, que viaja al núcleo si la calcineurina funciona */}
      <g transform={`translate(${f1(lerp(-110, 80, hay * f))},${f1(lerp(-30, 20, hay * f))})`} opacity={lerp(0.45, 1, hay)}>
        <rect x={-34} y={-20} width={68} height={40} rx={20} fill="#2F8FB0" stroke="#14546E" strokeWidth={1.6} />
        <text dy="0.36em" textAnchor="middle" className={s.protTxt} style={{ fontSize: 15 }}>NFAT</text>
      </g>
      {/* IL-2 que sale, mientras haya señal */}
      {Array.from({ length: 5 }, (_, i) => { const q = (rl / 1500 + i / 5) % 1; return <g key={i} opacity={hay * Math.sin(q * Math.PI)}><circle cx={f1(130 + q * 180)} cy={f1(-60 - q * 70 + i * 22)} r={9} fill="#F2C94C" stroke="#A8821A" strokeWidth={1.2} /></g>; })}
      {/* El fármaco */}
      {bl > 0.001 && (
        <g opacity={tramo(bl, 0, 0.5)}>
          <g transform={`translate(-300,-110) scale(0.8)`}><Pastilla a="#FFF" b={L.tratamiento} /></g>
          <path d="M-262,-82 L-234,-66" stroke="#D1293D" strokeWidth={8} strokeLinecap="round" />
          <g transform="translate(-210,-30)"><Tachar k={tramo(bl, 0.2, 0.8)} r={46} /></g>
        </g>
      )}
    </g>
  );
}

export function FondoTxFarmacos({ t, reloj }: { t: T; reloj: number }) {
  const gl = v(t, 'gl'), g1 = v(t, 'gc1'), g2 = v(t, 'gc2'), g3 = v(t, 'gc3'), g4 = v(t, 'gc4');
  const lt = v(t, 'lt'), az = v(t, 'aza'), azB = v(t, 'azaB'), mf = v(t, 'mmf'), mfB = v(t, 'mmfB'), mr = v(t, 'mmfR'), me = v(t, 'mmfE');
  const cn = v(t, 'cni'), cb = v(t, 'cniB'), cs = v(t, 'csa'), mt = v(t, 'mab'), m1 = v(t, 'mb1'), m2 = v(t, 'mb2'), m3 = v(t, 'mb3');
  return (
    <g>
      <Base />
      {/* Paso 5 · glucocorticoides */}
      <Titulo x={800} y={58} t="Glucocorticoides: el freno rápido" k={gl} fin="middle" tam={34} color={L.tratamiento} />
      {gl > 0.001 && (
        <g opacity={tramo(gl, 0, 0.4)}>
          <g transform="translate(190,210)"><Llama k={1 - 0.74 * easeOut(tramo(gl, 0.1, 1))} rl={reloj} /></g>
          <g transform={`translate(340,${f1(170 + Math.sin(reloj / 800) * 3)}) scale(1.5)`}>{ArteCorticoide}</g>
          <text x={340} y={278} textAnchor="middle" className={rotulo} style={{ fontSize: 22 }}>Prednisona</text>
        </g>
      )}
      <Flotante x={700} y={190} k={g1} rl={reloj} esc={0.9} alto={50}><g transform="scale(0.7)"><Pastilla a="#FFF" b="#E0526E" /></g></Flotante>
      <Nota x={700} y={272} t="Leve a moderado" sub="dosis bajas, poco tiempo" k={g1} tam={24} />
      {g2 > 0.001 && <g opacity={tramo(g2, 0, 0.4)} transform="translate(1130,190)"><Goteo rl={reloj} /></g>}
      <Nota x={1300} y={176} t="Brote grave" sub="pulsos por la vena, dosis altas" k={g2} fin="start" tam={24} />
      <CurvaDosis x={110} y={410} k={g3} rl={reloj} />
      <Nota x={310} y={636} t="Bajarlos lo antes posible" k={g3} tam={26} />
      {[
        { x: 700, t: 'infecciones', a: <g transform="scale(1.1)">{ArteVirus(reloj)}</g> },
        { x: 900, t: 'osteonecrosis', a: <g transform="translate(14,-32) scale(0.46)"><Femur n={1} rl={reloj} /></g> },
        { x: 1110, t: 'diabetes', a: ArteAzucar(reloj) },
        { x: 1320, t: 'aterosclerosis', a: <g transform="scale(0.92)">{ArteArteriaPlaca}</g> },
      ].map((e, i) => {
        const k = tramo(g3, 0.2 + i * 0.18, 0.45 + i * 0.18);
        return (
          <g key={e.t}>
            <Flotante x={e.x} y={480} k={k} rl={reloj} fase={i * 1.4} esc={1} alto={66}>{e.a}</Flotante>
            <Nota x={e.x} y={592} t={e.t} k={k} tam={20} />
          </g>
        );
      })}
      {g4 > 0.001 && (
        <g opacity={tramo(g4, 0, 0.5)}>
          <g transform={`translate(260,${f1(800 + Math.sin(reloj / 800) * 3)})`}><Pastilla a="#FFF" b="#E0526E" /></g>
          <text x={400} y={818} textAnchor="middle" className={`${s.safSigno} ${s.conHalo}`} style={{ fontSize: 52 }}>+</text>
          <g transform={`translate(540,${f1(800 + Math.sin(reloj / 800 + 2) * 3)})`}><Pastilla a="#FFF" b="#2F8FB0" /></g>
          <text x={700} y={796} className={rotulo} style={{ fontSize: 28 }}>Sin respuesta: otro inmunosupresor</text>
          <text x={700} y={830} className={subR} style={{ fontSize: 22 }}>metotrexato o azatioprina</text>
        </g>
      )}

      {/* Paso 6 · azatioprina y micofenolato */}
      <Dividir x={800} y={260} k={lt} rl={reloj} />
      {lt > 0.001 && <text x={800} y={440} textAnchor="middle" className={rotulo} style={{ fontSize: 25 }} opacity={tramo(lt, 0.3, 0.9)}>El linfocito quiere proliferar</text>}
      <Flotante x={130} y={150} k={az} rl={reloj} esc={0.95} alto={46}><Pastilla a="#FFF" b="#2F8FB0" /></Flotante>
      <Nota x={300} y={120} t="Azatioprina" sub="→ 6-mercaptopurina" k={az} fin="start" tam={27} />
      {azB > 0.001 && (
        <g opacity={tramo(azB, 0, 0.4)}>
          <g transform="translate(280,290) scale(1.2)">{Purina}<g transform="translate(6,-8)"><Tachar k={tramo(azB, 0.2, 0.8)} r={46} /></g></g>
          <text x={280} y={380} textAnchor="middle" className={rotulo} style={{ fontSize: 21 }}>altera las purinas</text>
          <FlechaViva a={{ x: 370, y: 280 }} c={{ x: 500, y: 240 }} b={{ x: 658, y: 260 }} k={tramo(azB, 0.2, 0.9)} rl={reloj} color="#D1293D" grosor={7} />
        </g>
      )}
      <Flotante x={1100} y={150} k={mf} rl={reloj} fase={2} esc={0.95} alto={46}><Pastilla a="#FFF" b="#7B4FC9" /></Flotante>
      <Nota x={1230} y={120} t="Micofenolato" sub="inhibe la IMPDH" k={mf} fin="start" tam={27} />
      {mfB > 0.001 && (
        <g opacity={tramo(mfB, 0, 0.4)}>
          <g transform="translate(1310,290)">
            <circle cx={-52} r={27} fill="#8EA6E0" stroke="#3E5EA8" strokeWidth={2} /><text x={-52} dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 15 }}>IMP</text>
            <path d="M-20,0 H10 M2,-8 L12,0 L2,8" fill="none" stroke="#6E7789" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={50} r={27} fill="#D9DEE8" stroke="#8E98AD" strokeWidth={2} strokeDasharray="5 4" /><text x={50} dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 22, fill: '#8E98AD' }}>G</text>
            <g transform="translate(-4,0)"><Tachar k={tramo(mfB, 0.2, 0.7)} r={24} /></g>
          </g>
          <text x={1310} y={380} textAnchor="middle" className={rotulo} style={{ fontSize: 21 }}>sin guanosina no hay ADN</text>
          <FlechaViva a={{ x: 1230, y: 280 }} c={{ x: 1100, y: 240 }} b={{ x: 942, y: 260 }} k={tramo(mfB, 0.2, 0.9)} rl={reloj} color="#D1293D" grosor={7} fase={0.4} />
        </g>
      )}
      <Flotante x={300} y={660} k={mr} rl={reloj} esc={1.25} alto={90}><IconoOrgano i="rinon" x={0} y={0} k={1.15} /></Flotante>
      <Nota x={300} y={800} t="Micofenolato: de elección" sub="en la nefritis lúpica" k={mr} tam={27} />
      {[
        { x: 760, t: 'citopenias', a: ArteCitopenia },
        { x: 1010, t: 'diarrea', a: ArteDiarrea(reloj) },
        { x: 1270, t: 'teratógeno', a: <g>{ArteEmbarazo}<Tachar k={tramo(me, 0.6, 1)} r={62} /></g> },
      ].map((e, i) => {
        const k = tramo(me, i * 0.2, 0.5 + i * 0.2);
        return (
          <g key={e.t}>
            <Flotante x={e.x} y={660} k={k} rl={reloj} fase={i * 1.4} esc={1.1} alto={70}>{e.a}</Flotante>
            <Nota x={e.x} y={786} t={e.t} k={k} tam={23} />
          </g>
        );
      })}
      {me > 0.001 && <text x={1270} y={820} textAnchor="middle" className={halo} opacity={tramo(me, 0.6, 1)}>no se usa en el embarazo</text>}

      {/* Paso 7 · calcineurina */}
      <Titulo x={370} y={56} t="Inhibidores de la calcineurina" sub="ciclosporina · tacrolimus" k={cn} fin="middle" tam={30} />
      <CelulaT k={cn} bl={cb} rl={reloj} />
      {cb > 0.3 && <text x={370} y={616} textAnchor="middle" className={rotulo} style={{ fontSize: 22 }} opacity={tramo(v(t, 'cniN'), 0, 0.5)}>Sin NFAT, el linfocito T no transcribe IL-2</text>}
      {cs > 0.001 && (
        <g>
          <Titulo x={370} y={682} t="Ciclosporina" k={cs} fin="middle" tam={26} color="#D1293D" />
          {[
            { x: 90, t: 'daña el riñón', a: <IconoOrgano i="rinon" x={0} y={0} k={0.85} /> },
            { x: 275, t: 'sube la presión', a: <g transform="scale(0.9)">{ArteManometro(reloj, 1)}</g> },
            { x: 460, t: 'hirsutismo', a: ArteHirsutismo },
            { x: 645, t: 'interacciones', a: ArteInteracciones },
          ].map((e, i) => {
            const k = tramo(cs, i * 0.16, 0.45 + i * 0.16);
            return (
              <g key={e.t}>
                <Flotante x={e.x} y={770} k={k} rl={reloj} fase={i * 1.4} esc={1} alto={56}>{e.a}</Flotante>
                <Nota x={e.x} y={866} t={e.t} k={k} tam={19} />
              </g>
            );
          })}
        </g>
      )}
      {/* Paso 7 · monoclonales */}
      <Titulo x={1200} y={56} t="Anticuerpos monoclonales" sub="un blanco muy específico" k={mt} fin="middle" tam={30} color={L.tratamiento} />
      {m1 > 0.001 && (
        <g opacity={tramo(m1, 0, 0.5)}>
          <g transform="translate(900,250)"><DibujoCelula dibujo="linfocito" d={110} color="#2F6FD0" /></g>
          <g transform={`translate(${f1(lerp(1060, 1000, easeOut(m1)))},250)`}>
            {[[0, -14], [-14, 10], [14, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="#E0892E" stroke="#8A4A0E" strokeWidth={1.2} />)}
            <IgG x={38} y={0} ang={-90} k={1.2} />
          </g>
          <text x={1110} y={232} className={rotulo} style={{ fontSize: 25 }}>Belimumab → BAFF</text>
          <text x={1110} y={262} className={halo} style={{ fontSize: 19 }}>capítulo 4</text>
        </g>
      )}
      {m2 > 0.001 && (
        <g opacity={tramo(m2, 0, 0.5)}>
          <path d="M840,500 C880,470 950,470 990,500 V550 H840 Z" fill="#E9D6F4" stroke="#8E6AB4" strokeWidth={2} />
          <rect x={906} y={456} width={18} height={44} rx={5} fill="#C0397A" stroke="#7E1E4A" strokeWidth={1.2} />
          <path d="M898,458 C898,440 932,440 932,458" fill="none" stroke="#C0397A" strokeWidth={8} strokeLinecap="round" />
          <IgG x={915} y={lerp(380, 416, easeOut(m2))} ang={180} k={1.25} />
          {[0, 1].map((j) => { const f = (reloj / 1700 + j / 2) % 1; return <g key={j} opacity={Math.sin(f * Math.PI)}><Ifn x={1010 - f * 30} y={410 + j * 30 - f * 24} r={12} /></g>; })}
          <text x={1110} y={472} className={rotulo} style={{ fontSize: 25 }}>Anifrolumab → receptor del IFN I</text>
          <text x={1110} y={502} className={halo} style={{ fontSize: 19 }}>la firma de interferón (capítulo 3)</text>
        </g>
      )}
      {m3 > 0.001 && (
        <g opacity={tramo(m3, 0, 0.5)}>
          <g transform="translate(905,740)" opacity={lerp(1, 0.28, tramo(m3, 0.5, 1))}><DibujoCelula dibujo="linfocito" d={124} color="#2F6FD0" /></g>
          {[-0.8, 0.4, 2.2].map((a, i) => <IgG key={i} x={905 + Math.cos(a) * 84} y={740 + Math.sin(a) * 84} ang={(Math.atan2(-Math.cos(a), Math.sin(a)) * 180) / Math.PI} k={0.95} />)}
          {tramo(m3, 0.5, 1) > 0.01 && <circle cx={905} cy={740} r={62} fill="none" stroke="#D1293D" strokeWidth={4} strokeDasharray="7 7" opacity={tramo(m3, 0.5, 1)} />}
          <text x={1110} y={728} className={rotulo} style={{ fontSize: 25 }}>Rituximab → CD20</text>
          <text x={1110} y={758} className={halo} style={{ fontSize: 19 }}>elimina los linfocitos B</text>
        </g>
      )}
    </g>
  );
}

// ─── Paso 8 · todo encaja ─────────────────────────────────────────────────────

const ArteMuere = <DibujoCelula dibujo="apoptotico" d={120} color="#E9A8B8" />;
const ArteConfunde = (rl: number) => (
  <g>
    <g transform="translate(-36,0)"><DibujoCelula dibujo="fragadn" d={90} color={L.adn} /></g>
    <text x={8} y={10} textAnchor="middle" className={`${s.safSigno} ${s.conHalo}`} style={{ fontSize: 34 }}>≈</text>
    <g transform="translate(58,0)"><Virus c="#2CA99A" o="#14695F" rl={rl} r={22} /></g>
  </g>
);
const ArteIfn = (rl: number) => (
  <g>
    {Array.from({ length: 10 }, (_, j) => { const f = (rl / 2000 + j / 10) % 1, a = (j / 10) * TAU, d = 12 + f * 62; return <g key={j} opacity={Math.sin(f * Math.PI)}><Ifn x={Math.cos(a) * d} y={Math.sin(a) * d} r={13} /></g>; })}
    <Ifn x={0} y={0} r={22} />
  </g>
);
const ArteLinfos = (
  <g>
    <g transform="translate(-40,4)"><DibujoCelula dibujo="linfocito" d={96} color="#2F6FD0" /></g>
    <g transform="translate(44,-4)"><DibujoCelula dibujo="linfocito" d={90} color="#D24E80" /></g>
  </g>
);
const ArteOrganos = (
  <g>
    <g transform="translate(-92,-6) scale(0.2)"><g transform="translate(0,-480)"><Retrato id="txFin" soloCabeza /></g></g>
    <IconoOrgano i="articulacion" x={8} y={-34} k={0.56} />
    <IconoOrgano i="sangre" x={8} y={40} k={0.56} />
    <IconoOrgano i="rinon" x={84} y={0} k={0.62} />
  </g>
);

const CADENA: { p: string; x: number; y: number; t: string; sub: string; arte: (rl: number) => ReactNode }[] = [
  { p: 'fb1', x: 280, y: 130, t: 'Una célula que muere', sub: 'y no se limpia', arte: () => ArteMuere },
  { p: 'fb2', x: 800, y: 130, t: 'Un ácido nucleico', sub: 'confundido con un virus', arte: (rl) => ArteConfunde(rl) },
  { p: 'fb3', x: 1320, y: 130, t: 'El interferón', sub: 'que lo enciende todo', arte: (rl) => ArteIfn(rl) },
  { p: 'fb4', x: 1320, y: 420, t: 'Linfocitos', sub: 'que no se apagan', arte: () => ArteLinfos },
  { p: 'fb5', x: 800, y: 420, t: 'Complejos', sub: 'que se depositan', arte: () => <ComplejoRed n={8} d={130} /> },
  { p: 'fb6', x: 280, y: 420, t: 'La cara, las articulaciones,', sub: 'la sangre o el riñón', arte: () => ArteOrganos },
];

export function FondoTxFin({ t, reloj }: { t: T; reloj: number }) {
  const t1 = v(t, 'tF1'), t2 = v(t, 'tF2'), t3 = v(t, 'tF3');
  return (
    <g>
      <Base />
      {CADENA.map((c, i) => {
        const k = v(t, c.p);
        const sig = CADENA[i + 1];
        return (
          <g key={c.p}>
            <Flotante x={c.x} y={c.y} k={k} rl={reloj} fase={i * 1.2} esc={1} alto={70}>{c.arte(reloj)}</Flotante>
            <Nota x={c.x} y={c.y + 104} t={c.t} sub={c.sub} k={k} tam={24} />
            {sig && (() => {
              const kn = tramo(v(t, sig.p), 0, 0.5);
              if (c.y === sig.y) {
                const l = sig.x > c.x ? 1 : -1;
                return <FlechaViva a={{ x: c.x + l * 150, y: c.y }} c={{ x: (c.x + sig.x) / 2, y: c.y - 22 }} b={{ x: sig.x - l * 150, y: c.y }} k={kn} rl={reloj} color={L.lupus} grosor={8} fase={i * 0.15} />;
              }
              return <FlechaViva a={{ x: c.x + 20, y: c.y + 160 }} c={{ x: c.x + 46, y: (c.y + sig.y) / 2 }} b={{ x: sig.x + 20, y: sig.y - 96 }} k={kn} rl={reloj} color={L.lupus} grosor={8} fase={i * 0.15} />;
            })()}
          </g>
        );
      })}
      <Titulo x={800} y={648} t="Con diagnóstico temprano y buen tratamiento:" k={t1} fin="middle" tam={28} />
      {t1 > 0.001 && (
        <g opacity={tramo(t1, 0.2, 0.8)}>
          <text x={800} y={690} textAnchor="middle" className={rotulo} style={{ fontSize: 28 }}>muchos años, con buena calidad de vida</text>
          {/* Una línea de latido, tranquila */}
          <path d={Array.from({ length: 161 }, (_, i) => { const x = i * 6, f = (x + reloj / 14) % 240; const y = f < 12 ? -f * 2.4 : f < 24 ? -28.8 + (f - 12) * 3.6 : f < 36 ? 14.4 - (f - 24) * 1.2 : 0; return `${i ? 'L' : 'M'}${320 + x},${f1(740 + y)}`; }).join(' ')} fill="none" stroke={L.tratamiento} strokeWidth={3.4} strokeLinejoin="round" />
        </g>
      )}
      <Titulo x={800} y={812} t="Y eso empieza por un médico que sepa pensar en él." k={t2} fin="middle" tam={32} color={L.lupus} />
      {t3 > 0.001 && (
        <g opacity={tramo(t3, 0, 0.6)} transform={`translate(800,${f1(900 + (1 - easeOut(t3)) * 20)}) scale(${(0.86 + 0.14 * easeBack(clamp(t3))).toFixed(3)})`}>
          <text y={18} textAnchor="middle" className={rotulo} style={{ fontSize: 58, fill: L.lupus }}>Ahora ya eres uno.</text>
          <g transform="translate(-330,0)">
            <path d="M-26,-40 V-8 C-26,18 22,18 22,-8 V-40" fill="none" stroke="#3A4256" strokeWidth={6} strokeLinecap="round" />
            <circle cx={-26} cy={-44} r={6} fill="#6E7789" /><circle cx={22} cy={-44} r={6} fill="#6E7789" />
            <path d="M-2,11 C-2,40 40,46 44,16" fill="none" stroke="#3A4256" strokeWidth={6} strokeLinecap="round" />
            <circle cx={44} cy={8} r={15} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.4} />
          </g>
        </g>
      )}
    </g>
  );
}

