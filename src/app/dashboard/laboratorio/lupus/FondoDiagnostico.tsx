'use client';
// Láminas del capítulo 10 («Cómo se diagnostica»). Sin tarjetas: cada idea es un
// objeto y el texto va suelto, en segundo plano.
// · `dxInicio`: la prueba única tachada, las tres piezas del rompecabezas, la sospecha
//   en dos o más órganos, los sospechosos que se descartan y las dos biopsias.
// · `pruebas`: ANA en células HEp-2, anti-ADNdc y anti-Smith, con diales de
//   sensibilidad y especificidad y la curva que sigue la actividad.
// · `dxAfl`: los tres tubos de antifosfolípidos y, después, los marcadores de
//   actividad: columnas de C3 y C4, la VSG que sedimenta, la perla de la PCR y la orina.
// · `eular`: la puerta de entrada, las tres reglas, los dominios y el caso de 22 puntos.

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { DibujoCelula, IgG } from './Celulas';
import { ArteAdn, ArteCorticoide, ArteVirus, DefsPl, Flotante, Nota, Silueta, lobulos } from './FondoClinica';
import { ArteObstetrica, ArteTrombosis, DefsSg, Lente, Sello } from './FondoDano2';
import { ArteSedimento, DefsNe, GlomH, TuboOrina } from './FondoNefritis';
import { FlechaViva, Titulo } from './FondoOrganos';
import { clamp, dibujar, easeBack, easeInOut, easeOut, FlechaSuave, IconoOrgano, tramo, v, type T } from './laminas';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rotulo = `${s.lEtiqueta} ${s.conHalo}`;
const halo = `${s.lSubChico} ${s.conHalo}`;
const subR = `${s.lSub} ${s.conHalo}`;

const Base = () => <g><DefsSg /><DefsPl /><DefsNe /></g>;

const Tachar = ({ k, r = 60 }: { k: number; r?: number }) => k <= 0.001 ? null : <path d={`M${-r},${-r} L${r},${r}`} stroke="#D1293D" strokeWidth={Math.max(6, r * 0.14)} strokeLinecap="round" {...dibujar(k)} />;

// ─── Dial de sensibilidad o especificidad ─────────────────────────────────────

export function Dial({ x, y, r = 84, val, k, t, pal, c }: { x: number; y: number; r?: number; val: number; k: number; t: string; pal?: string; c: string }) {
  if (k <= 0.001) return null;
  const q = clamp(val), arco = `M${-r},0 A${r},${r} 0 0 1 ${r},0`, ang = -90 + 180 * q;
  return (
    <g opacity={tramo(k, 0, 0.5)} transform={`translate(${x},${y})`}>
      <path d={`M${-r - 18},6 A${r + 18},${r + 18} 0 0 1 ${r + 18},6 Z`} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.2} />
      <path d={`M${-r - 8},6 A${r + 8},${r + 8} 0 0 1 ${r + 8},6 Z`} fill="#FFFDF8" />
      <path d={arco} fill="none" stroke="#D8DCE4" strokeWidth={r * 0.2} />
      <path d={arco} fill="none" stroke={c} strokeWidth={r * 0.2} pathLength={1} strokeDasharray={`${q} 1`} />
      {Array.from({ length: 11 }, (_, i) => { const a = ((-90 + i * 18) * Math.PI) / 180; return <line key={i} x1={Math.sin(a) * r * 0.62} y1={-Math.cos(a) * r * 0.62} x2={Math.sin(a) * r * 0.76} y2={-Math.cos(a) * r * 0.76} stroke="#3A4256" strokeWidth={i % 5 ? 1.6 : 3} />; })}
      <g transform={`rotate(${f1(ang)})`}><path d={`M-4,4 L0,${-r * 0.82} L4,4 Z`} fill="#2A3144" /></g>
      <circle r={r * 0.12} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={1} />
      <text y={36} textAnchor="middle" className={rotulo} style={{ fontSize: 20 }}>{t}</text>
      {pal && <text y={62} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`} style={{ fill: c, fontSize: 15 }} opacity={tramo(k, 0.5, 1)}>{pal}</text>}
    </g>
  );
}

// ─── Paso 0 · un diagnóstico clínico ──────────────────────────────────────────

/** Pieza de rompecabezas: `pestana` hacia la derecha y `muesca` a la izquierda. */
function Pieza({ x, y, k, de, a, b, pestana, muesca, children }: { x: number; y: number; k: number; de: number; a: string; b: string; pestana: boolean; muesca: boolean; children: ReactNode }) {
  if (k <= 0.001) return null;
  const e = easeBack(clamp(k)), dy = 34 * (1 - easeOut(clamp(k)));
  const der = pestana ? 'V-26 C112,-40 130,-20 130,0 C130,20 112,40 85,26 V85' : 'V85';
  const izq = muesca ? 'V26 C-58,40 -40,20 -40,0 C-40,-20 -58,-40 -85,-26 V-85' : 'V-85';
  const d = `M-85,-85 H85 ${der} H-85 ${izq} Z`;
  return (
    <g opacity={tramo(k, 0, 0.35)} transform={`translate(${f1(x + de * (1 - e))},${f1(y + dy)})`}>
      <path d={d} transform="translate(5,7)" className={s.sombraSuave} />
      <defs><linearGradient id={`dx-p-${x}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <path d={d} fill={`url(#dx-p-${x})`} stroke="#FFF" strokeWidth={3} strokeLinejoin="round" />
      <path d="M-76,-74 H72" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
      {children}
    </g>
  );
}

const TuboTachado = (rl: number, k: number) => (
  <g>
    <g transform="rotate(14)">
      <TuboOrina rl={rl} />
      <text y={36} textAnchor="middle" className={s.tarjTit} style={{ fontSize: 17 }}>LES</text>
    </g>
    <Tachar k={k} r={82} />
  </g>
);

const ArteFicha = (
  <g>
    <rect x={-62} y={-78} width={124} height={158} rx={10} fill="#7A5A3A" stroke="#4E3820" strokeWidth={1.4} />
    <rect x={-52} y={-66} width={104} height={136} rx={3} fill="#FFFEFA" />
    <rect x={-24} y={-88} width={48} height={20} rx={5} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
    {[-44, -18, 8].map((y, i) => <rect key={y} x={-40} y={y} width={i === 1 ? 58 : 74} height={7} rx={3} fill="#AEB7C8" />)}
    <path d="M-34,44 L-16,58 L32,28" fill="none" stroke="#1F9A6A" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const ArteLabo = (
  <g>
    <g transform="translate(-30,8) rotate(-10) scale(0.66)"><TuboOrina rl={0} /></g>
    <g transform="translate(34,18)">
      <path d="M-13,-44 V-20 L-34,28 C-40,42 -32,46 -20,46 H20 C32,46 40,42 34,28 L13,-20 V-44 Z" fill="#FBFDFF" fillOpacity={0.9} stroke="#7D899C" strokeWidth={2.6} />
      <path d="M-25,12 C-10,6 10,18 25,12 L34,28 C38,40 30,44 20,44 H-20 C-30,44 -38,40 -34,28 Z" fill="#7B4FC9" />
      <rect x={-18} y={-54} width={36} height={9} rx={3} fill="#9AA6B8" />
    </g>
  </g>
);
const ArteExclusion = (
  <g>
    <circle cx={-10} cy={-10} r={40} fill="#FFF" fillOpacity={0.9} stroke="#3A4256" strokeWidth={7} />
    <path d="M20,20 L54,54" stroke="#3A4256" strokeWidth={12} strokeLinecap="round" />
    <path d="M-27,-27 L7,7 M7,-27 L-27,7" stroke="#D1293D" strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** Lo que se ilumina alrededor de la silueta: dos o más órganos. */
const ORG_SOS: { i: Parameters<typeof IconoOrgano>[0]['i']; x: number; y: number; ax: number; ay: number }[] = [
  { i: 'cerebro', x: 590, y: 640, ax: 800, ay: 628 },
  { i: 'articulacion', x: 590, y: 860, ax: 760, ay: 830 },
  { i: 'piel', x: 1010, y: 640, ax: 830, ay: 690 },
  { i: 'rinon', x: 1010, y: 860, ax: 820, ay: 760 },
];

function Sospecha({ k, k2, rl }: { k: number; k2: number; rl: number }) {
  if (k <= 0.001) return null;
  return (
    <g>
      <g opacity={tramo(k, 0, 0.5)} transform="translate(800,720) scale(1.42)"><Silueta x={0} y={0} k={1} focos={[]} piel={[]} rl={rl} /></g>
      {ORG_SOS.map((o, i) => {
        const on = i === 0 || i === 2 ? tramo(k2, i * 0.1, 0.5 + i * 0.1) : tramo(k2, 0.5, 1) * 0.35;
        return (
          <g key={o.i} opacity={tramo(k, 0.15 + i * 0.1, 0.55 + i * 0.1)}>
            <path d={`M${o.x + (o.x < 800 ? 60 : -60)},${o.y} L${o.ax},${o.ay}`} className={s.guia} />
            {on > 0.02 && <circle cx={o.x} cy={o.y} r={70 + Math.sin(rl / 260 + i) * 5} fill="url(#pl-infl)" opacity={on} />}
            <IconoOrgano i={o.i} x={o.x} y={o.y} k={1.05} />
            {on > 0.02 && <circle cx={o.ax} cy={o.ay} r={9} fill="#E5293F" stroke="#FFF" strokeWidth={2} opacity={on} />}
          </g>
        );
      })}
      <Titulo x={80} y={700} t="Paso 1: la sospecha" k={k} tam={30} color="#D9811E" />
      <g opacity={tramo(k, 0.3, 1)}>
        <text x={80} y={744} className={subR} style={{ fontSize: 22 }}>dos o más órganos o sistemas,</text>
        <text x={80} y={774} className={subR} style={{ fontSize: 22 }}>sobre todo si sugieren</text>
        <text x={80} y={804} className={subR} style={{ fontSize: 22 }}>autoinmunidad</text>
      </g>
    </g>
  );
}

// ─── Paso 1 · diferencial y biopsia ───────────────────────────────────────────

const ArteOtraAuto = (
  <g>
    <path d={lobulos(36, 10, 0.05, 6)} fill="#F4C6BE" stroke="#B5626C" strokeWidth={1.8} />
    <circle cx={-3} cy={2} r={15} fill="#6E3F9E" /><circle cx={-8} cy={-3} r={4} fill="#FFF" opacity={0.35} />
    {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * TAU + 0.3; return <IgG key={i} x={Math.cos(a) * 54} y={Math.sin(a) * 54} ang={(Math.atan2(-Math.cos(a), Math.sin(a)) * 180) / Math.PI} k={0.76} />; })}
  </g>
);
function ArteTumor({ rl }: { rl: number }) {
  return (
    <g transform={`scale(${(1 + 0.02 * Math.sin(rl / 500)).toFixed(3)})`}>
      {Array.from({ length: 13 }, (_, i) => {
        const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 13) * 44, r = 13 + hash(i, 2) * 8;
        return <g key={i} transform={`translate(${f1(Math.cos(a) * q)},${f1(Math.sin(a) * q)})`}><path d={lobulos(r, 7, 0.2, i + 2)} fill={i % 2 ? '#C687B8' : '#D79ACB'} stroke="#7A3E76" strokeWidth={1.2} /><circle r={r * 0.46} fill="#3E2470" /></g>;
      })}
    </g>
  );
}

/** Corte de piel y sacabocados que baja a tomar la muestra. */
function ArtePunch({ k, rl }: { k: number; rl: number }) {
  const baja = lerp(-112, -14, easeInOut(tramo(Math.sin(rl / 900) * 0.5 + 0.5, 0.1, 0.9))) * k + -112 * (1 - k);
  return (
    <g>
      <path d="M-120,-10 C-60,-18 60,-4 120,-12 V70 H-120 Z" fill="#F7C8AE" stroke="#B97E62" strokeWidth={1.6} />
      <path d="M-120,-10 C-60,-18 60,-4 120,-12 V8 C60,16 -60,2 -120,10 Z" fill="#E7A688" />
      {[-92, -46, 40, 88].map((x) => <path key={x} d={`M${x},70 q-6,-24 2,-52`} fill="none" stroke="#D76A5E" strokeWidth={3} opacity={0.6} />)}
      <g transform={`translate(0,${f1(baja)})`}>
        <path d="M-18,0 L-22,-60 H22 L18,0 Z" fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.2} />
        <rect x={-13} y={-104} width={26} height={46} rx={7} fill="#2A3144" />
        <path d="M-18,0 V6 M18,0 V6" stroke="#5C6577" strokeWidth={3} />
      </g>
    </g>
  );
}

/** El riñón con la aguja que entra y el glomérulo que se lee en la muestra. */
function ArteBiopsiaRenal({ k, rl }: { k: number; rl: number }) {
  const dentro = easeInOut(tramo(k, 0.1, 0.7)) + Math.sin(rl / 700) * 0.02;
  return (
    <g>
      <IconoOrgano i="rinon" x={0} y={0} k={1.7} />
      <g transform={`translate(${f1(lerp(120, 42, dentro))},${f1(lerp(-120, -44, dentro))}) rotate(45)`}>
        <rect x={-3} y={-2} width={6} height={80} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.8} transform="rotate(180)" />
        <rect x={-14} y={-114} width={28} height={40} rx={6} fill="#2A3144" />
        <rect x={-22} y={-78} width={44} height={8} rx={3} fill="#9AA6B8" />
      </g>
    </g>
  );
}

const DIF: { p: string; t: string; arte: (rl: number) => ReactNode; esc: number; x: number }[] = [
  { p: 'd1', t: 'Infecciones', arte: (rl) => ArteVirus(rl), esc: 1.8, x: 260 },
  { p: 'd2', t: 'Otras autoinmunes', arte: () => ArteOtraAuto, esc: 1.5, x: 620 },
  { p: 'd3', t: 'Neoplasias', arte: (rl) => <ArteTumor rl={rl} />, esc: 1.4, x: 980 },
  { p: 'd4', t: 'Lupus por fármacos', arte: () => ArteCorticoide, esc: 1.8, x: 1340 },
];

export function FondoDxInicio({ t, reloj }: { t: T; reloj: number }) {
  const t0 = v(t, 't0'), kNo = v(t, 'kNo'), k1 = v(t, 'k1'), k2 = v(t, 'k2'), k3 = v(t, 'k3'), kS = v(t, 'kSos'), kS2 = v(t, 'kSosL');
  const kD = v(t, 'kDif'), kB = v(t, 'kBio'), kR = v(t, 'kRen'), kR2 = v(t, 'kRenL');
  const todas = tramo(k3, 0.6, 1);
  return (
    <g>
      <Base />
      <Titulo x={800} y={70} t="El lupus es un diagnóstico clínico" k={t0} fin="middle" tam={38} color={L.diagnostico} />
      {/* No hay una prueba única */}
      <Flotante x={230} y={290} k={kNo} rl={reloj} esc={1.3} alto={118}>{TuboTachado(reloj, tramo(kNo, 0.3, 1))}</Flotante>
      <Nota x={230} y={462} t="No hay una prueba única" sub="que lo confirme" k={kNo} tam={24} />
      {/* Tres piezas que encajan */}
      <Pieza x={650} y={290} k={k1} de={-180} a="#6AA0EA" b="#2F6FD0" pestana muesca={false}>
        <g transform="translate(0,-104) scale(0.2)"><Retrato id="dxCli" soloCabeza /></g>
      </Pieza>
      <Pieza x={820} y={290} k={k2} de={0} a="#B18CE6" b="#7B4FC9" pestana muesca>{ArteLabo}</Pieza>
      <Pieza x={990} y={290} k={k3} de={180} a="#6FCFA6" b="#1F9A6A" pestana={false} muesca>{ArteExclusion}</Pieza>
      <Nota x={650} y={412} t="Clínica" k={k1} tam={24} />
      <Nota x={820} y={412} t="Laboratorio" k={k2} tam={24} />
      <Nota x={990} y={412} t="Exclusión" sub="de otras causas" k={k3} tam={24} />
      {todas > 0.01 && (
        <g opacity={todas * (1 - tramo(kS, 0, 0.5) * 0.25)}>
          <FlechaViva a={{ x: 1090, y: 290 }} c={{ x: 1150, y: 280 }} b={{ x: 1210, y: 290 }} k={todas} rl={reloj} color={L.diagnostico} grosor={7} />
          <g transform={`translate(1310,290) rotate(${f1(Math.sin(reloj / 900) * 3)})`}>{ArteFicha}</g>
          <text x={1310} y={412} textAnchor="middle" className={rotulo} style={{ fontSize: 24 }}>Diagnóstico</text>
        </g>
      )}
      <Sospecha k={kS} k2={kS2} rl={reloj} />
      {/* Paso 1: los que hay que descartar */}
      <Titulo x={800} y={66} t="Diagnóstico diferencial: descartar" k={kD} fin="middle" tam={34} />
      {DIF.map((d, i) => {
        const k = v(t, d.p);
        return (
          <g key={d.p}>
            <Flotante x={d.x} y={210} k={k} rl={reloj} fase={i * 1.5} esc={d.esc} alto={92}>{d.arte(reloj)}</Flotante>
            {k > 0.001 && <g transform={`translate(${d.x},210)`}><Tachar k={tramo(k, 0.45, 1)} r={78} /></g>}
            <Nota x={d.x} y={344} t={d.t} k={k} tam={24} />
          </g>
        );
      })}
      {/* Las dos biopsias */}
      <g>
        {kB > 0.001 && <g opacity={tramo(kB, 0, 0.4)} transform="translate(270,640)"><ArtePunch k={kB} rl={reloj} /></g>}
        <Nota x={270} y={760} t="Biopsia de piel o riñón" sub="respalda, pero no es obligatoria" k={kB} tam={26} />
      </g>
      {kR > 0.001 && (
        <g opacity={tramo(kR, 0, 0.4)}>
          <g transform="translate(860,650)"><ArteBiopsiaRenal k={kR} rl={reloj} /></g>
          <FlechaViva a={{ x: 980, y: 660 }} c={{ x: 1050, y: 640 }} b={{ x: 1118, y: 650 }} k={tramo(kR, 0.3, 0.9)} rl={reloj} color={L.rinon} grosor={7} />
          <Lente id="dx-gl" x={1250} y={650} r={118} k={tramo(kR, 0.4, 1)}>
            <rect x={-140} y={-140} width={280} height={280} fill="#F4C2D2" />
            <GlomH r={108} f={{ mes: 1, sub: 1, asas: 0.7 }} />
          </Lente>
          <Nota x={1050} y={830} t="Biopsia renal" sub="clasifica la nefritis y decide el tratamiento" k={kR} tam={30} />
          {kR2 > 0.01 && <circle cx={1250} cy={650} r={142} fill="none" stroke={L.rinon} strokeWidth={5} opacity={kR2 * (0.6 + 0.4 * Math.sin(reloj / 260))} />}
        </g>
      )}
    </g>
  );
}

// ─── Pasos 2 y 3 · los anticuerpos ────────────────────────────────────────────

/** Células HEp-2: con ANA, los núcleos brillan; sin ANA, el campo queda oscuro. */
const CampoHep = memo(function CampoHep({ positivo }: { positivo: boolean }) {
  const celdas: [number, number, number][] = [[-96, -84, 40], [8, -112, 36], [108, -72, 42], [-124, 22, 34], [-22, 8, 44], [84, 30, 38], [-74, 112, 40], [34, 118, 36], [132, 112, 28]];
  return (
    <g>
      <rect x={-210} y={-210} width={420} height={420} fill="url(#ne-if)" />
      {celdas.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d={lobulos(r * 1.32, 9, 0.08, i + 3)} fill={positivo ? '#143A26' : '#0E1C14'} stroke={positivo ? '#1F5A3C' : '#142A1E'} strokeWidth={1} />
          {positivo
            ? <g>
                <ellipse rx={r * 0.92} ry={r * 0.82} fill="#2EB864" opacity={0.35} />
                <ellipse rx={r * 0.76} ry={r * 0.66} fill="#7CF29A" />
                {[[-0.28, -0.18], [0.24, 0.12]].map(([a, b], j) => <circle key={j} cx={a * r} cy={b * r} r={r * 0.13} fill="#1F7A4C" />)}
                <ellipse cx={-r * 0.24} cy={-r * 0.3} rx={r * 0.24} ry={r * 0.1} fill="#E4FFEA" opacity={0.75} />
              </g>
            : <ellipse rx={r * 0.72} ry={r * 0.62} fill="#142A1E" />}
        </g>
      ))}
    </g>
  );
});

/** Partícula Sm: un anillo de siete proteínas sobre un ARN en horquilla. */
function ArteSm({ rl }: { rl: number }) {
  return (
    <g>
      <path d="M-4,-26 C-30,-62 -14,-92 2,-92 C18,-92 30,-62 6,-26" fill="none" stroke="#1F9A6A" strokeWidth={6} strokeLinecap="round" />
      {[-82, -70, -58, -46].map((y) => <path key={y} d={`M${-14 + (y + 92) * 0.08},${y} H${14 - (y + 92) * 0.08}`} stroke="#1F9A6A" strokeWidth={3} opacity={0.65} />)}
      {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * TAU - 1.57; return <g key={i} transform={`translate(${f1(Math.cos(a) * 28)},${f1(Math.sin(a) * 28)})`}><circle r={15} fill={i % 2 ? '#7B4FC9' : '#A58BE0'} stroke="#3E2478" strokeWidth={1.4} /><circle cx={-4} cy={-5} r={4} fill="#FFF" opacity={0.5} /></g>; })}
      <IgG x={-70} y={8 + Math.sin(rl / 600) * 3} ang={92} k={1.1} />
      <IgG x={70} y={8 - Math.sin(rl / 600) * 3} ang={-92} k={1.1} />
    </g>
  );
}

/** El anti-ADN sube antes de cada brote renal: sirve para seguir al paciente. */
function CurvaActividad({ x, y, k, rl, foco }: { x: number; y: number; k: number; rl: number; foco: number }) {
  if (k <= 0.001) return null;
  const W = 500, H = 170;
  const yf = (q: number) => H - H * (0.2 + 0.68 * Math.exp(-(((q - 0.68) / 0.14) ** 2)) + 0.16 * Math.exp(-(((q - 0.22) / 0.08) ** 2)));
  const d = Array.from({ length: 41 }, (_, i) => { const q = i / 40; return `${i ? 'L' : 'M'}${f1(q * W)},${f1(yf(q))}`; }).join(' ');
  const pk = (rl / 3600) % 1;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(k, 0, 0.3)}>
      <path d={`M0,0 V${H} H${W}`} fill="none" stroke="var(--texto-2)" strokeWidth={3} strokeLinecap="round" />
      <text x={-12} y={8} textAnchor="end" className={halo} style={{ fontSize: 15 }}>título</text>
      <text x={W} y={H + 26} textAnchor="end" className={halo} style={{ fontSize: 15 }}>tiempo</text>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="#C2385A" opacity={0.12 * tramo(k, 0.5, 1)} />
      <path d={d} fill="none" stroke="#C2385A" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...dibujar(tramo(k, 0.1, 1))} />
      {k > 0.95 && <circle cx={f1(pk * W)} cy={f1(yf(pk))} r={8} fill="#FFF" stroke="#C2385A" strokeWidth={3} />}
      <g opacity={tramo(k, 0.7, 1)} transform={`translate(${W * 0.68 + 40},${f1(yf(0.68) - 14 + Math.sin(rl / 700) * 3)})`}>
        <circle r={38 + 4 * foco * Math.sin(rl / 240)} fill="url(#pl-infl)" />
        <IconoOrgano i="rinon" x={0} y={0} k={0.5} />
      </g>
    </g>
  );
}

function Veredicto({ x, y, k, ok, t, sub }: { x: number; y: number; k: number; ok: boolean; t: string; sub: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.5)}>
      <g transform={`translate(${x},${y}) scale(${(0.7 + 0.3 * easeBack(clamp(k))).toFixed(3)})`}>
        <circle r={31} fill={ok ? '#1F9A6A' : '#D9881E'} stroke="#FFF" strokeWidth={4} />
        {ok ? <path d="M-14,0 L-4,11 L15,-12" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : <text dy="0.36em" textAnchor="middle" className={s.safGrande} style={{ fontSize: 36 }}>?</text>}
      </g>
      <text x={x + 46} y={y - 2} className={rotulo} style={{ fontSize: 24 }}>{t}</text>
      <text x={x + 46} y={y + 26} className={subR} style={{ fontSize: 20 }}>{sub}</text>
    </g>
  );
}

const SANOS = (
  <g>
    {[-44, 0, 44].map((x, i) => <g key={x} transform={`translate(${x},${i === 1 ? -6 : 8}) scale(1.6)`} fill="url(#pl-silueta)"><circle cy={-8} r={7.4} /><path d="M-11.6,14 C-11.6,1.4 -6,-.4 0,-.4 C6,-.4 11.6,1.4 11.6,14 Z" /></g>)}
    <g transform="translate(46,-34)"><circle r={15} fill="#7CF29A" stroke="#1F7A4C" strokeWidth={2} /><text dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 15 }}>+</text></g>
  </g>
);

export function FondoPruebas({ t, reloj }: { t: T; reloj: number }) {
  const an = v(t, 'ana'), aS = v(t, 'anaS'), aE = v(t, 'anaE'), po = v(t, 'kPos'), ne = v(t, 'kNeg'), so = v(t, 'kSolo'), ta = v(t, 'tTam');
  const dn = v(t, 'dsdna'), dS = v(t, 'dsdnaS'), dE = v(t, 'dsdnaE'), si = v(t, 'kSigue'), si2 = v(t, 'kSigueL'), sm = v(t, 'sm'), mS = v(t, 'smS'), mE = v(t, 'smE'), mp = v(t, 'kSmP'), mn = v(t, 'kSmN');
  return (
    <g>
      <Base />
      {/* ANA */}
      <Lente id="dx-hep" x={250} y={270} r={190} k={an}><CampoHep positivo /></Lente>
      <Titulo x={250} y={52} t="ANA" k={an} fin="middle" tam={38} color="#1F9A6A" />
      {an > 0.001 && <text x={250} y={514} textAnchor="middle" className={halo} opacity={tramo(an, 0.5, 1)}>núcleos que brillan en células HEp-2</text>}
      <Dial x={620} y={230} val={0.96 * easeOut(aS)} k={aS} t="Sensibilidad" pal="muy alta" c="#2F6FD0" />
      <Dial x={870} y={230} val={0.28 * easeOut(aE)} k={aE} t="Especificidad" pal="baja" c={L.lupus} />
      {po > 0.001 && <text x={1300} y={70} textAnchor="middle" className={rotulo} style={{ fontSize: 24 }} opacity={tramo(po, 0, 0.3)}>Positivos también en…</text>}
      <Flotante x={1170} y={170} k={tramo(po, 0, 0.3)} rl={reloj} esc={1} alto={64}>{ArteOtraAuto}</Flotante>
      <Nota x={1170} y={262} t="otras autoinmunes" k={tramo(po, 0, 0.3)} tam={19} />
      <Flotante x={1430} y={170} k={tramo(po, 0.2, 0.5)} rl={reloj} fase={1.5} esc={1.2} alto={58}>{ArteVirus(reloj)}</Flotante>
      <Nota x={1430} y={262} t="infecciones" k={tramo(po, 0.2, 0.5)} tam={19} />
      <Flotante x={1170} y={360} k={tramo(po, 0.4, 0.7)} rl={reloj} fase={3} esc={1.5} alto={52}>{ArteCorticoide}</Flotante>
      <Nota x={1170} y={446} t="fármacos" k={tramo(po, 0.4, 0.7)} tam={19} />
      <Flotante x={1430} y={360} k={tramo(po, 0.6, 1)} rl={reloj} fase={4.5} esc={1} alto={52}>{SANOS}</Flotante>
      <Nota x={1430} y={446} t="personas sanas" sub="títulos bajos" k={tramo(po, 0.6, 1)} tam={19} />
      {/* Negativo y positivo */}
      <Lente id="dx-n" x={300} y={690} r={108} k={ne} flota={Math.sin(reloj / 800) * 3}><g transform="scale(0.72)"><CampoHep positivo={false} /></g></Lente>
      <Veredicto x={456} y={680} k={ne} ok t="ANA negativo" sub="lupus muy improbable" />
      <Lente id="dx-p" x={960} y={690} r={108} k={so} flota={Math.sin(reloj / 800 + 2) * 3}><g transform="scale(0.72)"><CampoHep positivo /></g></Lente>
      <Veredicto x={1116} y={680} k={so} ok={false} t="ANA positivo, solo" sub="no hace el diagnóstico" />
      <Sello x={800} y={904} w={810} txt="SIRVE PARA TAMIZAR, NO PARA CONFIRMAR" k={ta} sz={27} rot={-2} />

      {/* Anti-ADN de doble cadena */}
      <Titulo x={400} y={60} t="Anti-ADN de doble cadena" k={dn} fin="middle" tam={32} color={L.lupus} />
      <Flotante x={400} y={166} k={dn} rl={reloj} esc={1.7} alto={72}>{ArteAdn(reloj)}</Flotante>
      <Dial x={260} y={400} r={78} val={0.6 * easeOut(dS)} k={dS} t="Sensibilidad" pal="media" c="#2F6FD0" />
      <Dial x={540} y={400} r={78} val={0.95 * easeOut(dE)} k={dE} t="Especificidad" pal="muy alta" c={L.lupus} />
      <CurvaActividad x={150} y={586} k={si} rl={reloj} foco={si2} />
      <Nota x={400} y={830} t="Sube con la actividad, sobre todo renal" sub="sirve para seguir al paciente" k={si} tam={24} />
      {/* Anti-Smith */}
      <Titulo x={1200} y={60} t="Anti-Smith" k={sm} fin="middle" tam={32} color="#7B4FC9" />
      <Flotante x={1200} y={186} k={sm} rl={reloj} fase={2} esc={1} alto={52}><ArteSm rl={reloj} /></Flotante>
      <Dial x={1060} y={400} r={78} val={0.25 * easeOut(mS)} k={mS} t="Sensibilidad" pal="baja" c="#2F6FD0" />
      <Dial x={1340} y={400} r={78} val={0.98 * easeOut(mE)} k={mE} t="Especificidad" pal="muy alta" c={L.lupus} />
      <Veredicto x={1020} y={620} k={mp} ok t="Positivo" sub="casi confirma el lupus" />
      <Veredicto x={1020} y={760} k={mn} ok={false} t="Negativo" sub="no lo descarta" />
    </g>
  );
}

// ─── Pasos 4 y 5 · antifosfolípidos y actividad ───────────────────────────────

function Probeta({ x, y, k, c, rl, txt, sub }: { x: number; y: number; k: number; c: string; rl: number; txt: string; sub?: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.4)}>
      <g transform={`translate(${x},${f1(y + (1 - easeOut(clamp(k))) * -50)})`}>
        <path d="M-30,-40 L-30,86 A30,23 0 0 0 30,86 L30,-40 Z" fill={c} opacity={0.85} />
        {Array.from({ length: 6 }, (_, i) => <IgG key={i} x={-14 + (i % 2) * 28 + Math.sin(rl / 700 + i) * 3} y={-14 + i * 18} ang={i * 60} k={0.62} />)}
        <path d="M-35,-92 L-35,86 A35,27 0 0 0 35,86 L35,-92" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3.4} />
        <path d="M-23,-82 V80" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        <rect x={-42} y={-104} width={84} height={14} rx={5} fill="#9AA6B8" stroke="#5C6577" strokeWidth={1} />
      </g>
      <Nota x={x} y={y + 166} t={txt} sub={sub} k={k} tam={21} />
    </g>
  );
}

/** Un nivel de vidrio que cae; rojo cuando está bajo. */
export function Nivel({ x, y, h, n, nom, k }: { x: number; y: number; h: number; n: number; nom: string; k: number }) {
  if (k <= 0.001) return null;
  const q = clamp((n - 0.28) / 0.5), col = `rgb(${[210, 56, 72].map((c, j) => Math.round(c + ([31, 154, 106][j] - c) * q)).join(',')})`;
  return (
    <g opacity={tramo(k, 0, 0.3)} transform={`translate(${x},${y})`}>
      <rect x={-22} y={0} width={44} height={h} rx={22} fill="#FFF" fillOpacity={0.45} />
      <rect x={-22} y={h * 0.12} width={44} height={h * 0.26} fill="#1F9A6A" opacity={0.2} />
      <path d={`M-14,${f1(h - h * n)} H14 V${h - 16} A14,14 0 0 1 -14,${h - 16} Z`} fill={col} />
      <rect x={-22} y={0} width={44} height={h} rx={22} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={2.6} />
      {Array.from({ length: 9 }, (_, j) => <line key={j} x1={22} y1={h * (j + 1) / 10} x2={j % 2 ? 30 : 36} y2={h * (j + 1) / 10} stroke="#6E7789" strokeWidth={1.8} />)}
      <rect x={-15} y={10} width={6} height={h - 22} rx={3} fill="#FFF" opacity={0.65} />
      <text x={0} y={h + 34} textAnchor="middle" className={`${s.tituloSeccionChico} ${s.conHalo}`}>{nom}</text>
    </g>
  );
}

/** Pipeta de Westergren: los hematíes caen y dejan plasma claro arriba. */
function Pipeta({ x, y, k, h, rl }: { x: number; y: number; k: number; h: number; rl: number }) {
  if (k <= 0.001) return null;
  const nivel = 0.5 * easeInOut(tramo(k, 0.1, 1)), top = h * nivel;
  return (
    <g opacity={tramo(k, 0, 0.3)} transform={`translate(${x},${y})`}>
      <clipPath id="dx-vsg"><rect x={-30} y={0} width={60} height={h} rx={12} /></clipPath>
      <g clipPath="url(#dx-vsg)">
        <rect x={-30} y={0} width={60} height={h} fill="#FBE9B8" />
        <rect x={-30} y={f1(top)} width={60} height={h - top} fill="#B8302E" />
        {Array.from({ length: 22 }, (_, i) => {
          const f = (rl / 2600 + hash(i, 2)) % 1, yy = top + f * (h - top), xx = -22 + hash(i, 3) * 44;
          return <ellipse key={i} cx={f1(xx)} cy={f1(yy)} rx={8} ry={5} fill="#E8584E" stroke="#7E1E22" strokeWidth={0.7} />;
        })}
        {nivel > 0.02 && Array.from({ length: 6 }, (_, i) => { const f = (rl / 1800 + i / 6) % 1; return <ellipse key={i} cx={-18 + i * 7} cy={f1(f * top)} rx={7} ry={4.4} fill="#E8584E" opacity={Math.sin(f * Math.PI) * 0.8} />; })}
      </g>
      <rect x={-30} y={0} width={60} height={h} rx={12} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3} />
      {Array.from({ length: 11 }, (_, j) => <line key={j} x1={30} y1={h * j / 10} x2={j % 5 ? 38 : 46} y2={h * j / 10} stroke="#6E7789" strokeWidth={1.8} />)}
      <path d={`M-20,10 V${h - 12}`} stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
      <FlechaSuave a={{ x: -66, y: 22 }} c={{ x: -70, y: h * 0.24 }} b={{ x: -64, y: h * 0.48 }} k={tramo(k, 0.3, 1)} color="#D1293D" grosor={6} />
    </g>
  );
}

const ArtePerla = (
  <g>
    <path d="M-44,20 C-54,-14 -28,-44 0,-44 C28,-44 54,-14 44,20 C24,34 -24,34 -44,20 Z" fill="#D8C8E8" stroke="#7B5AA0" strokeWidth={2.4} />
    {[-30, -16, 0, 16, 30].map((x) => <path key={x} d={`M${x * 0.3},-38 Q${x * 0.8},-6 ${x},24`} fill="none" stroke="#9E84BE" strokeWidth={1.6} />)}
    <path d="M-48,22 C-30,48 30,48 48,22 C24,32 -24,32 -48,22 Z" fill="#B9A4D2" stroke="#7B5AA0" strokeWidth={2} />
    <circle cy={8} r={22} fill="#FFF8EE" stroke="#BCA88A" strokeWidth={1.4} />
    <circle cx={-7} cy={1} r={7} fill="#FFF" />
  </g>
);
export const ArteBacteria = (rl: number) => (
  <g transform={`rotate(${f1(Math.sin(rl / 700) * 7 - 14)})`}>
    {[-1, 1].map((l) => <path key={l} d={`M${l * 40},0 c${l * 14},-12 ${l * 16},12 ${l * 30},0`} fill="none" stroke="#14695F" strokeWidth={3} strokeLinecap="round" />)}
    <rect x={-42} y={-20} width={84} height={40} rx={20} fill="#2CB88A" stroke="#14695F" strokeWidth={2} />
    <rect x={-30} y={-13} width={38} height={8} rx={4} fill="#FFF" opacity={0.5} />
    <circle cx={-12} cy={6} r={3.6} fill="#14695F" /><circle cx={16} cy={3} r={3.6} fill="#14695F" />
  </g>
);

/** El cociente, dibujado: proteína arriba, creatinina abajo. */
function Cociente({ rl }: { rl: number }) {
  return (
    <g>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-66 + i * 22} cy={f1(-42 + Math.sin(rl / 500 + i) * 3 - (i % 2) * 14)} r={10} fill="#F2B21E" stroke="#A8821A" strokeWidth={1} />)}
      <rect x={-92} y={-11} width={184} height={8} rx={4} fill="var(--texto)" />
      {[-34, 0, 34].map((x) => <rect key={x} x={x - 14} y={14} width={28} height={28} rx={8} fill="#D9881E" stroke="#8A4A0E" strokeWidth={1} />)}
    </g>
  );
}

export function FondoDxAfl({ t, reloj }: { t: T; reloj: number }) {
  const af = v(t, 'af'), a1 = v(t, 'af1'), a2 = v(t, 'af2'), a3 = v(t, 'af3');
  const c = v(t, 'a1'), vs = v(t, 'a2'), pe = v(t, 'a3'), pb = v(t, 'a4'), pa = v(t, 'a5'), ri = v(t, 'a6');
  const baja = easeInOut(tramo(c, 0.15, 1));
  return (
    <g>
      <Base />
      {/* Antifosfolípidos */}
      <Titulo x={460} y={72} t="Antifosfolípidos" k={af} fin="middle" tam={36} color="#7B4FC9" />
      {af > 0.001 && (
        <g opacity={tramo(af, 0, 0.3)}>
          <rect x={60} y={258} width={800} height={16} rx={6} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
          <rect x={60} y={420} width={800} height={18} rx={6} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
          {[80, 820].map((x) => <rect key={x} x={x} y={258} width={14} height={170} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.8} />)}
        </g>
      )}
      <Probeta x={200} y={290} k={tramo(af, 0.05, 0.3)} c="#F2A73A" rl={reloj} txt="Anticoagulante lúpico" />
      <Probeta x={460} y={290} k={tramo(af, 0.25, 0.55)} c="#E0607C" rl={reloj} txt="Anticardiolipina" sub="IgG e IgM" />
      <Probeta x={720} y={290} k={tramo(af, 0.5, 0.85)} c="#9570D8" rl={reloj} txt="Anti-β2-glicoproteína I" />
      {/* No hacen el diagnóstico */}
      <Sello x={1240} y={100} w={540} txt="NO HACEN EL DIAGNÓSTICO" k={a1} sz={27} rot={-2.5} />
      {/* Predicen */}
      <Lente id="dx-tr" x={1060} y={340} r={108} k={a2} flota={Math.sin(reloj / 800) * 3}><g transform="scale(1.42)"><ArteTrombosis rl={reloj} /></g></Lente>
      <Lente id="dx-ob" x={1400} y={340} r={108} k={tramo(a2, 0.25, 1)} flota={Math.sin(reloj / 800 + 2) * 3}><rect x={-120} y={-120} width={240} height={240} fill="#FBE3DC" /><ArteObstetrica rl={reloj} /></Lente>
      <Nota x={1060} y={500} t="Trombosis" k={a2} tam={24} />
      <Nota x={1400} y={500} t="Complicaciones del embarazo" sub="abortos del primer trimestre" k={tramo(a2, 0.25, 1)} tam={22} />
      {/* Cambia lo que haces */}
      {a3 > 0.001 && (
        <g opacity={tramo(a3, 0, 0.5)}>
          <g transform={`translate(300,${f1(740 + Math.sin(reloj / 800) * 3)}) scale(1.25)`}>{ArteFicha}</g>
          <FlechaViva a={{ x: 400, y: 740 }} c={{ x: 470, y: 724 }} b={{ x: 546, y: 740 }} k={tramo(a3, 0.1, 0.7)} rl={reloj} color="#1F9A6A" grosor={7} />
          <text x={574} y={750} className={rotulo} style={{ fontSize: 32, fill: '#1F9A6A' }}>Saberlo cambia lo que haces con el paciente</text>
        </g>
      )}
      {/* Paso 5 · actividad */}
      <Nivel x={95} y={74} h={280} n={lerp(0.82, 0.24, baja)} nom="C3" k={c} />
      <Nivel x={225} y={74} h={280} n={lerp(0.82, 0.16, baja)} nom="C4" k={c} />
      <Nota x={160} y={436} t="Bajos: consumo" sub="puede ser un brote" k={c} tam={23} />
      <Pipeta x={520} y={74} h={280} k={vs} rl={reloj} />
      <Nota x={520} y={400} t="VSG" k={vs} tam={25} />
      {vs > 0.001 && <text x={520} y={436} textAnchor="middle" className={halo} opacity={tramo(vs, 0.3, 0.9)}>sube con la inflamación · inespecífica</text>}
      {/* La perla */}
      <Flotante x={850} y={84} k={pe} rl={reloj} esc={1.1} alto={48}>{ArtePerla}</Flotante>
      <Titulo x={930} y={100} t="La perla: la proteína C reactiva" k={pe} tam={30} color={L.lupus} />
      <Dial x={960} y={300} r={92} val={lerp(0.05, 0.2, easeOut(pb))} k={pb} t="En el brote sube poco" pal="salvo serositis o artritis" c="#2F6FD0" />
      <Dial x={1350} y={300} r={92} val={lerp(0.05, 0.95, easeOut(pa))} k={pa} t="PCR muy alta" c="#D1293D" />
      <Flotante x={1500} y={190} k={tramo(pa, 0.4, 1)} rl={reloj} esc={0.9} alto={38}>{ArteBacteria(reloj)}</Flotante>
      {pa > 0.001 && <text x={1350} y={392} textAnchor="middle" className={rotulo} style={{ fontSize: 23, fill: '#D1293D' }} opacity={tramo(pa, 0.4, 1)}>Piensa en infección</text>}
      {/* El riñón */}
      {ri > 0.001 && (
        <g opacity={tramo(ri, 0, 0.3)}>
          <g transform={`translate(190,${f1(700 + Math.sin(reloj / 800) * 3)})`}><IconoOrgano i="rinon" x={0} y={0} k={1.7} /></g>
          <Nota x={190} y={850} t="Para el riñón" sub="examen de orina" k={ri} tam={26} />
          <FlechaViva a={{ x: 310, y: 700 }} c={{ x: 370, y: 688 }} b={{ x: 428, y: 700 }} k={tramo(ri, 0.1, 0.5)} rl={reloj} color={L.rinon} grosor={7} />
          <g transform={`translate(520,${f1(690 + Math.sin(reloj / 800 + 1) * 3)})`}><TuboOrina rl={reloj} /></g>
          <FlechaViva a={{ x: 590, y: 690 }} c={{ x: 640, y: 676 }} b={{ x: 690, y: 690 }} k={tramo(ri, 0.3, 0.7)} rl={reloj} color={L.rinon} grosor={7} fase={0.4} />
        </g>
      )}
      <Lente id="dx-sed" x={840} y={700} r={134} k={tramo(ri, 0.3, 0.7)}><g transform="scale(0.94)">{ArteSedimento}</g></Lente>
      <Nota x={840} y={878} t="Hematuria y cilindros celulares" k={tramo(ri, 0.4, 0.8)} tam={23} />
      {ri > 0.001 && (
        <g opacity={tramo(ri, 0.6, 1)}>
          <g transform={`translate(1270,${f1(690 + Math.sin(reloj / 800 + 2) * 3)}) scale(1.3)`}><Cociente rl={reloj} /></g>
          <Nota x={1270} y={798} t="Proteína / creatinina" sub="cuánta proteína se pierde" k={ri} tam={24} />
        </g>
      )}
    </g>
  );
}

// ─── Pasos 6 y 7 · EULAR/ACR 2019 y el caso ───────────────────────────────────

function Puerta({ k, rl }: { k: number; rl: number }) {
  const ab = easeInOut(tramo(k, 0.3, 1));
  return (
    <g>
      <path d="M-82,108 V-50 C-82,-118 82,-118 82,-50 V108 Z" fill="#6E7789" stroke="#3A4256" strokeWidth={2} />
      <path d="M-60,108 V-44 C-60,-92 60,-92 60,-44 V108 Z" fill="#FFF3B8" />
      {[0, 1, 2].map((i) => { const f = (rl / 2000 + i / 3) % 1; return <circle key={i} cx={f1(-20 + i * 20)} cy={f1(100 - f * 170)} r={5} fill="#F2B21E" opacity={ab * Math.sin(f * Math.PI)} />; })}
      {/* La hoja de la puerta gira y se estrecha */}
      <g transform={`translate(-60,0) scale(${(1 - 0.84 * ab).toFixed(3)},1)`}>
        <path d="M0,108 V-44 C0,-70 16,-86 60,-92 C104,-86 120,-70 120,-44 V108 Z" fill="#8A5A34" stroke="#4E2C1A" strokeWidth={2} />
        {[-50, 20].map((y) => <rect key={y} x={18} y={y} width={84} height={52} rx={4} fill="none" stroke="#5E3A20" strokeWidth={3} />)}
        <circle cx={104} cy={14} r={6} fill="url(#sg-pomo)" />
      </g>
    </g>
  );
}

function Balancita({ k }: { k: number }) {
  const a = 12 * easeInOut(tramo(k, 0.2, 1)), rad = (a * Math.PI) / 180, B = 92;
  const lx = -B * Math.cos(rad), ly = -B * Math.sin(rad), rx = B * Math.cos(rad), ry = B * Math.sin(rad);
  const pesa = (x: number, y: number, n: string, r: number, ok: boolean) => (
    <g transform={`translate(${f1(x)},${f1(y + 46)})`}>
      <path d={`M-40,${r} C-30,${r + 18} 30,${r + 18} 40,${r} Z`} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
      <circle r={r} fill={ok ? '#C2385A' : '#AEB7C8'} stroke="#FFF" strokeWidth={2} />
      <text dy="0.36em" textAnchor="middle" className={s.safGrande} style={{ fontSize: r * 1.1 }}>{n}</text>
      <path d={`M0,${-r - 28} L-30,${r} M0,${-r - 28} L30,${r}`} stroke="#6E4C14" strokeWidth={1.6} strokeDasharray="4 2" />
    </g>
  );
  return (
    <g>
      <rect x={-6} y={-6} width={12} height={106} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.8} />
      <path d="M-46,108 L-30,92 H30 L46,108 Z" fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
      <g transform={`rotate(${f1(a)})`}><rect x={-B - 6} y={-5} width={2 * B + 12} height={10} rx={5} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.9} /></g>
      <circle r={9} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={1} />
      {pesa(lx, ly, '2', 15, false)}
      {pesa(rx, ry, '6', 22, true)}
    </g>
  );
}

const DOMINIOS: { t: string; i: Parameters<typeof IconoOrgano>[0]['i'] }[] = [
  { t: 'Constitucional', i: 'fiebre' }, { t: 'Hematológico', i: 'sangre' }, { t: 'Neuropsiquiátrico', i: 'cerebro' }, { t: 'Mucocutáneo', i: 'cara' },
  { t: 'Serosas', i: 'pulmon' }, { t: 'Musculoesquelético', i: 'articulacion' }, { t: 'Renal', i: 'rinon' },
];

const ArteComplemento = (
  <g>
    <g transform="translate(-30,-6)"><DibujoCelula dibujo="c1q" d={72} color="#C0397A" /></g>
    <g transform="translate(32,18)"><circle r={22} fill="#6A3EAE" /><circle r={22} fill="url(#sg-bola)" /><text dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 17 }}>C3</text></g>
  </g>
);
const ArteTuboAfl = (rl: number) => (
  <g transform="scale(0.7)">
    <path d="M-30,-40 L-30,86 A30,23 0 0 0 30,86 L30,-40 Z" fill="#9570D8" opacity={0.85} transform="translate(0,-20)" />
    {Array.from({ length: 5 }, (_, i) => <IgG key={i} x={-12 + (i % 2) * 24 + Math.sin(rl / 700 + i) * 3} y={-40 + i * 20} ang={i * 60} k={0.62} />)}
    <path d="M-35,-112 L-35,66 A35,27 0 0 0 35,66 L35,-112" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3.4} />
    <rect x={-42} y={-124} width={84} height={14} rx={5} fill="#9AA6B8" />
  </g>
);

const FILAS_CASO = (mu: number, ar: number, co: number, ds: number) => [
  { k: ar, t: 'Artritis en las dos muñecas, rigidez matinal', pts: 6, i: 'articulacion' as const },
  { k: tramo(mu, 0, 0.5), t: 'Úlceras orales', pts: 2, i: 'boca' as const, tachar: tramo(mu, 0.5, 1) },
  { k: tramo(mu, 0.5, 1), t: 'Exantema malar · mismo dominio, cuenta solo este', pts: 6, i: 'cara' as const },
  { k: co, t: 'C3 y C4 bajos', pts: 4, i: 'c3' as const },
  { k: ds, t: 'Anti-ADN de doble cadena', pts: 6, i: 'adn' as const },
];

const ArteOral = (
  <g>
    <path d="M-34,-4 C-20,-22 20,-22 34,-4 C20,22 -20,22 -34,-4 Z" fill="#C25468" />
    <path d="M-26,-4 C-14,-14 14,-14 26,-4 C14,12 -14,12 -26,-4 Z" fill="#6E1E2E" />
    {[-12, 0, 12].map((x) => <rect key={x} x={x - 5} y={-13} width={10} height={9} rx={2} fill="#FFF" />)}
    <circle cx={6} cy={4} r={5} fill="#FBF2D2" stroke="#D8B860" strokeWidth={1.4} />
  </g>
);
const ArteSol = (
  <g>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU; return <line key={i} x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 38} y2={Math.sin(a) * 38} className={s.rayoSol} style={{ strokeWidth: 4.4 }} />; })}
    <circle r={22} fill="url(#pl-sol)" stroke="#E0A11E" strokeWidth={1.6} />
  </g>
);
const ArteAnaMini = (
  <g>
    <circle r={32} fill="#0C2016" />
    <ellipse rx={20} ry={17} fill="#7CF29A" />
    <circle cx={-6} cy={-3} r={3} fill="#1F7A4C" /><circle cx={7} cy={4} r={3} fill="#1F7A4C" />
  </g>
);
const ArtePlacaMini = (
  <g>
    <path d={lobulos(30, 10, 0.08, 5)} fill="#D8486A" stroke="#A82B4E" strokeWidth={1.6} />
    <path d={lobulos(17, 8, 0.1, 6)} fill="#F8E9DF" />
    {[[-6, -4], [6, 2], [-2, 8]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill="#3E2418" />)}
  </g>
);

const ICONO_FILA: Record<string, ReactNode> = {
  articulacion: <IconoOrgano i="articulacion" x={0} y={0} k={0.62} />,
  boca: ArteOral,
  cara: <IconoOrgano i="cara" x={0} y={0} k={0.62} />,
  c3: <g><circle r={25} fill="#6A3EAE" /><circle r={25} fill="url(#sg-bola)" /><text dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 18 }}>C3</text></g>,
  adn: <g transform="scale(0.7)">{ArteAdn(0)}</g>,
};

const SOAP: [string, string, ReactNode][] = [
  ['S', 'Serositis', <IconoOrgano key="s" i="pulmon" x={0} y={0} k={0.55} />],
  ['O', 'Úlceras orales', ArteOral],
  ['A', 'Artritis', <IconoOrgano key="a" i="articulacion" x={0} y={0} k={0.55} />],
  ['P', 'Fotosensibilidad', ArteSol],
  ['B', 'Sangre', <IconoOrgano key="b" i="sangre" x={0} y={0} k={0.55} />],
  ['R', 'Riñón', <IconoOrgano key="r" i="rinon" x={0} y={0} k={0.55} />],
  ['A', 'ANA', ArteAnaMini],
  ['I', 'Inmunología', <IgG key="i" x={0} y={4} k={1.1} />],
  ['N', 'Neurología', <IconoOrgano key="n" i="cerebro" x={0} y={0} k={0.55} />],
  ['M', 'Malar', <IconoOrgano key="m" i="cara" x={0} y={0} k={0.55} />],
  ['D', 'Discoide', ArtePlacaMini],
];
const COLOR_G = [L.lupus, '#2F6FD0', '#7B4FC9'];
const X_SOAP = (i: number) => { const g = i < 4 ? 0 : i < 9 ? 1 : 2; return 92 + i * 128 + g * 36; };

export function FondoEular({ t, reloj }: { t: T; reloj: number }) {
  const ti = v(t, 'eularTit'), en = v(t, 'entrada'), re = v(t, 'regla'), cl = v(t, 'clinicos'), im = v(t, 'inmuno');
  const ca = v(t, 'caso'), ar = v(t, 'artritis'), mu = v(t, 'mucocutaneo'), co = v(t, 'complementoC'), ds = v(t, 'dsdnaC'), to = v(t, 'total'), so = v(t, 'soap');
  const puntos = 6 * ar + 2 * tramo(mu, 0, 0.4) * (1 - tramo(mu, 0.5, 1)) + 6 * tramo(mu, 0.5, 1) + 4 * co + 6 * ds;
  const redondo = Math.round(puntos), Ytub = 92, Htub = 340, llena = Math.min(1, puntos / 24);
  return (
    <g>
      <Base />
      <Titulo x={800} y={58} t="Criterios EULAR/ACR 2019" k={ti} fin="middle" tam={36} />
      {/* La entrada */}
      {en > 0.001 && <g opacity={tramo(en, 0, 0.3)} transform="translate(210,206)"><Puerta k={en} rl={reloj} /></g>}
      <Nota x={210} y={346} t="Entrada: ANA ≥ 1:80" k={en} tam={24} />
      {/* Las tres reglas */}
      <FlechaViva a={{ x: 320, y: 206 }} c={{ x: 390, y: 192 }} b={{ x: 470, y: 206 }} k={tramo(re, 0, 0.25)} rl={reloj} color={L.diagnostico} grosor={7} />
      {re > 0.001 && (
        <g opacity={tramo(re, 0, 0.4)} transform="translate(590,200) scale(1.32)">
          <Silueta x={0} y={0} k={1} focos={[[-34, 22]]} piel={[]} rl={reloj} />
        </g>
      )}
      <Nota x={590} y={346} t="≥ 1 criterio clínico" k={re} tam={24} />
      {re > 0.001 && (
        <g opacity={tramo(re, 0.15, 0.55)} transform={`translate(920,${f1(206 + Math.sin(reloj / 800) * 3)})`}>
          <circle r={84} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1.6} />
          <circle r={68} fill="none" stroke="#FFF2C4" strokeWidth={3} strokeDasharray="4 8" />
          <text dy="0.36em" textAnchor="middle" className={s.safGrande} style={{ fontSize: 72 }}>10</text>
        </g>
      )}
      <Nota x={920} y={346} t="≥ 10 puntos" k={tramo(re, 0.15, 1)} tam={24} />
      {re > 0.001 && <g opacity={tramo(re, 0.3, 0.7)} transform="translate(1280,180)"><Balancita k={tramo(re, 0.3, 1)} /></g>}
      <Nota x={1280} y={346} t="Por dominio, el de más peso" k={tramo(re, 0.3, 1)} tam={24} />
      {/* Dominios */}
      {cl > 0.001 && <text x={800} y={424} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`} opacity={tramo(cl, 0, 0.1)}>Dominios clínicos</text>}
      {DOMINIOS.map((d, i) => {
        const k = tramo(cl, i * 0.11, 0.3 + i * 0.11), x = 130 + i * 223;
        return (
          <g key={d.t}>
            <Flotante x={x} y={510} k={k} rl={reloj} fase={i * 1.1} esc={0.95} alto={54}><IconoOrgano i={d.i} x={0} y={0} k={1} /></Flotante>
            <Nota x={x} y={606} t={d.t} k={k} tam={19} />
          </g>
        );
      })}
      {im > 0.001 && <text x={800} y={682} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`} opacity={tramo(im, 0, 0.15)}>Dominios inmunológicos</text>}
      <Flotante x={420} y={780} k={tramo(im, 0, 0.4)} rl={reloj} esc={1} alto={64}>{ArteTuboAfl(reloj)}</Flotante>
      <Nota x={420} y={880} t="Antifosfolípidos" k={tramo(im, 0, 0.4)} tam={21} />
      <Flotante x={800} y={780} k={tramo(im, 0.25, 0.65)} rl={reloj} fase={2} esc={1.15} alto={60}>{ArteComplemento}</Flotante>
      <Nota x={800} y={880} t="Complemento" k={tramo(im, 0.25, 0.65)} tam={21} />
      <Flotante x={1180} y={780} k={tramo(im, 0.5, 1)} rl={reloj} fase={4} esc={1.3} alto={60}>{ArteAdn(reloj)}</Flotante>
      <Nota x={1180} y={880} t="Anticuerpos específicos" k={tramo(im, 0.5, 1)} tam={21} />

      {/* El caso */}
      {ca > 0.001 && (
        <g opacity={tramo(ca, 0, 0.5)}>
          <g transform="translate(170,6) scale(0.42)"><Retrato id="dxCaso" /></g>
          <text x={170} y={456} textAnchor="middle" className={rotulo} style={{ fontSize: 26 }}>Mujer de 26 años</text>
          <text x={170} y={488} textAnchor="middle" className={subR} style={{ fontSize: 21 }}>ANA 1:320 · entra</text>
        </g>
      )}
      {FILAS_CASO(mu, ar, co, ds).map((f, i) => {
        if (f.k <= 0.001) return null;
        const y = 90 + i * 84, tach = f.tachar ?? 0;
        return (
          <g key={i} opacity={tramo(f.k, 0, 0.4)} transform={`translate(${f1(24 * (1 - easeOut(f.k)))},0)`}>
            <g transform={`translate(420,${y}) scale(${(0.8 + 0.2 * easeBack(clamp(f.k))).toFixed(3)})`} opacity={1 - tach * 0.55}>{ICONO_FILA[f.i]}</g>
            <text x={478} y={y + 8} className={rotulo} style={{ fontSize: 23 }} opacity={1 - tach * 0.55}>{f.t}</text>
            <g transform={`translate(1102,${y}) scale(${(0.6 + 0.4 * easeBack(tramo(f.k, 0.2, 1))).toFixed(3)})`}>
              <circle r={29} fill={tach > 0.5 ? '#AEB7C8' : 'url(#sg-laton)'} stroke="#6E4C14" strokeWidth={1.2} />
              <text dy="0.36em" textAnchor="middle" className={s.safGrande} style={{ fontSize: 26 }}>{tach > 0.5 ? f.pts : `+${f.pts}`}</text>
            </g>
            {tach > 0.001 && <line x1={470} y1={y} x2={470 + 670 * easeOut(tach)} y2={y} stroke="#D1293D" strokeWidth={4} strokeLinecap="round" />}
          </g>
        );
      })}
      {/* El marcador: un tubo que se llena y cruza el umbral */}
      {ca > 0.001 && (
        <g opacity={tramo(ca, 0.2, 0.7)}>
          <rect x={1216} y={Ytub} width={60} height={Htub} rx={30} fill="#FFF" fillOpacity={0.45} />
          <path d={`M1226,${f1(Ytub + Htub - Htub * llena)} H1266 V${Ytub + Htub - 22} A20,20 0 0 1 1226,${Ytub + Htub - 22} Z`} fill={redondo >= 10 ? L.lupus : '#9AA3B8'} />
          <rect x={1216} y={Ytub} width={60} height={Htub} rx={30} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3} />
          <rect x={1226} y={Ytub + 14} width={7} height={Htub - 34} rx={3.5} fill="#FFF" opacity={0.65} />
          <line x1={1204} y1={Ytub + Htub - (Htub * 10) / 24} x2={1296} y2={Ytub + Htub - (Htub * 10) / 24} stroke="#1F9A6A" strokeWidth={5} strokeDasharray="10 6" />
          <text x={1304} y={Ytub + Htub - (Htub * 10) / 24 + 7} className={rotulo} style={{ fontSize: 22, fill: '#1F9A6A' }}>10</text>
          <text x={1430} y={236} textAnchor="middle" className={`${s.puntaje} ${s.conHalo}`} style={{ fill: redondo >= 10 ? L.lupus : undefined }}>{redondo}</text>
          <text x={1430} y={282} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>puntos</text>
        </g>
      )}
      <Sello x={1320} y={492} w={460} txt="≥ 10: CLASIFICA COMO LUPUS" k={to} sz={21} rot={-3} />
      {/* SOAP BRAIN MD */}
      {so > 0.001 && (
        <g>
          <text x={800} y={584} textAnchor="middle" className={rotulo} style={{ fontSize: 26 }} opacity={tramo(so, 0, 0.08)}>Para recordarlas: SOAP BRAIN MD</text>
          {SOAP.map(([l, n, arte], i) => {
            const k = tramo(so, 0.08 + i * 0.075, 0.2 + i * 0.075), g = i < 4 ? 0 : i < 9 ? 1 : 2, x = X_SOAP(i);
            if (k <= 0) return null;
            return (
              <g key={i} opacity={tramo(k, 0, 0.5)}>
                <g transform={`translate(${x},${f1(660 + Math.sin(reloj / 800 + i) * 3)}) scale(${(0.8 + 0.2 * easeBack(k)).toFixed(3)})`}>{arte}</g>
                <text x={x} y={768} textAnchor="middle" style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 62, fill: COLOR_G[g] }} className={s.conHalo}>{l}</text>
                <text x={x} y={798} textAnchor="middle" className={halo} style={{ fontSize: 15 }}>{n}</text>
              </g>
            );
          })}
          {[[0, 3, 0.15], [4, 8, 0.45], [9, 10, 0.86]].map(([a, b, d], j) => {
            const k = tramo(so, d, d + 0.12);
            return k > 0 ? <path key={j} d={`M${X_SOAP(a) - 44},816 Q${X_SOAP(a) - 44},832 ${X_SOAP(a) - 26},832 H${X_SOAP(b) + 26} Q${X_SOAP(b) + 44},832 ${X_SOAP(b) + 44},816`} fill="none" stroke={COLOR_G[j]} strokeWidth={5} strokeLinecap="round" {...dibujar(k)} /> : null;
          })}
        </g>
      )}
    </g>
  );
}
