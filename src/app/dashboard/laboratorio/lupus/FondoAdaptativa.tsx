'use client';
// Láminas del capítulo 4 («Linfocitos B y T fuera de control»). Cada paso ocurre en
// un sitio del cuerpo, con el estilo de lámina médica del resto del laboratorio.
//
// · `seleccion`: la médula ósea con su hueso (selección negativa), el sinusoide por
//   el que se sale y la periferia con un ganglio.
// · `periferia`: el tejido linfoide donde BAFF mantiene vivos a los clones y donde
//   cada autoanticuerpo se ve junto a lo que reconoce.
// · `germinal`: un folículo con su manto y su centro germinal (zona oscura y clara).
//   El cambio de clase se dibuja: IgM → IgG, con el gen que se recorta; la afinidad
//   también: el Fab que va encajando en el antígeno y su medidor.
// · `efectoras`: Th1 y Th17 con la célula a la que empujan, y los dos interferones.
// · `freno`: el Treg, su medidor de IL-2 y los clones que se multiplican sin freno.
// · `intersticio`: túbulos renales donde entran los T dobles negativos.
// · `circuito` y `puente`: el cierre, innata ↔ adaptativa y del anticuerpo al daño.

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ComplejoNuc, DibujoCelula, IgG, IgM } from './Celulas';
import { DefsInterferon, Ifn, Medalla } from './FondoInterferon';
import { dibujar, easeBack, easeInOut, easeOut, Globo, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Muchas células en un solo trazo: cada punto es un segmento nulo con punta redonda. */
const nube = (pts: number[][]) => pts.map(([x, y]) => `M${f1(x)},${f1(y)}h0`).join('');

const DefsAdaptativa = memo(function DefsAdaptativa() {
  const fondo = (id: string, a: string, b: string) => <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" className={a} /><stop offset="1" className={b} /></linearGradient>;
  return (
    <defs>
      {fondo('ad-azul', s.adA1, s.adA2)}
      {fondo('ad-violeta', s.adV1, s.adV2)}
      {fondo('ad-verde', s.adG1, s.adG2)}
      {fondo('ad-rosa', s.adR1, s.adR2)}
      <radialGradient id="ad-medula" cx="0.45" cy="0.42" r="0.72"><stop offset="0" className={s.adM1} /><stop offset="1" className={s.adM2} /></radialGradient>
      <linearGradient id="ad-hueso" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6EDD8" /><stop offset="1" stopColor="#D8C7A0" /></linearGradient>
      <linearGradient id="ad-sinusoide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D9544A" /><stop offset="0.5" stopColor="#F08B7C" /><stop offset="1" stopColor="#C63E38" /></linearGradient>
      <radialGradient id="ad-ganglio" cx="0.42" cy="0.36" r="0.8"><stop offset="0" className={s.adP1} /><stop offset="1" className={s.adP2} /></radialGradient>
      <radialGradient id="ad-foliculo" cx="0.4" cy="0.36" r="0.8"><stop offset="0" className={s.adF1} /><stop offset="1" className={s.adF2} /></radialGradient>
      <radialGradient id="ad-oscura" cx="0.5" cy="0.5" r="0.7"><stop offset="0" className={s.adO1} /><stop offset="1" className={s.adO2} /></radialGradient>
      <radialGradient id="ad-clara" cx="0.5" cy="0.5" r="0.7"><stop offset="0" className={s.adC1} /><stop offset="1" className={s.adC2} /></radialGradient>
      <radialGradient id="ad-baff" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFE29A" /><stop offset="1" stopColor="#C98A14" /></radialGradient>
      <radialGradient id="ad-dend" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#F5D9B8" /><stop offset="1" stopColor="#C98A5E" /></radialGradient>
      <linearGradient id="ad-fab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A24E" /><stop offset="1" stopColor="#C96A18" /></linearGradient>
      <linearGradient id="ad-ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5FCF9E" /><stop offset="1" stopColor="#157A5A" /></linearGradient>
      <radialGradient id="ad-brillo"><stop offset="0" stopColor="#FFD54A" stopOpacity="0.75" /><stop offset="1" stopColor="#FFD54A" stopOpacity="0" /></radialGradient>
      <radialGradient id="ad-inflama"><stop offset="0" stopColor="#E5484D" stopOpacity="0.32" /><stop offset="1" stopColor="#E5484D" stopOpacity="0" /></radialGradient>
      <linearGradient id="ad-flecha1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7B4FC9" stopOpacity="0.24" /><stop offset="1" stopColor="#7B4FC9" stopOpacity="0.05" /></linearGradient>
      <linearGradient id="ad-flecha2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C0396E" stopOpacity="0.24" /><stop offset="1" stopColor="#C0396E" stopOpacity="0.05" /></linearGradient>
      <linearGradient id="ad-riel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3F6AA8" /><stop offset="0.55" stopColor="#E0892E" /><stop offset="1" stopColor="#C2385A" /></linearGradient>
    </defs>
  );
});

/** Un tejido de fondo: degradado, retículo tenue y células lejanas. */
const Tejido = memo(function Tejido({ id, semilla = 1 }: { id: string; semilla?: number }) {
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={1080} fill={`url(#${id})`} />
      {Array.from({ length: 11 }, (_, j) => {
        const y = 30 + j * 92, o = hash(j, semilla) * 260;
        return <path key={j} d={`M-30,${y} C${230 + o},${y - 44} ${520 + o},${y + 54} ${860 + o},${y} S1400,${y - 34} 1640,${y + 22}`} className={s.adFibra} strokeWidth={2 + (j % 3) * 2} />;
      })}
      {Array.from({ length: 16 }, (_, j) => {
        const x = hash(j, semilla + 2) * 1600, y = hash(j, semilla + 3) * 1000, r = 26 + hash(j, semilla + 4) * 34;
        return <g key={j} className={s.adLejana}><circle cx={x} cy={y} r={r} /><circle cx={x + r * 0.1} cy={y + r * 0.08} r={r * 0.62} className={s.adLejanaN} /></g>;
      })}
    </g>
  );
});

// ─── Selección: médula ósea → periferia ───────────────────────────────────────

const MEDULA = 'M70,180 C66,130 110,104 170,108 C330,96 560,96 690,112 C744,118 770,150 770,206 C778,380 774,640 768,820 C768,874 734,900 680,900 C520,908 300,908 150,898 C96,894 66,862 66,812 C56,620 58,380 70,180 Z';

const MedulaFija = memo(function MedulaFija() {
  const rojos = Array.from({ length: 150 }, (_, i) => [110 + hash(i, 1) * 620, 150 + hash(i, 2) * 710]);
  const azules = Array.from({ length: 70 }, (_, i) => [120 + hash(i, 3) * 600, 160 + hash(i, 4) * 690]);
  return (
    <g>
      <path d={MEDULA} fill="url(#ad-medula)" />
      {/* Células en formación: normoblastos y precursores */}
      <path d={nube(rojos)} className={s.medRojos} />
      <path d={nube(azules)} className={s.medAzules} />
      <path d={nube(azules)} className={s.medAzulesN} />
      {/* Adipocitos */}
      {[[170, 300, 34], [640, 240, 38], [590, 820, 40], [160, 770, 30], [310, 860, 26], [690, 560, 30], [255, 200, 24], [440, 170, 26]].map(([x, y, r], j) => (
        <g key={j}><circle cx={x} cy={y} r={r} className={s.adipocito} /><path d={`M${x - r * 0.72},${y + r * 0.42} A${r * 0.85},${r * 0.85} 0 0 0 ${x + r * 0.3},${y + r * 0.8}`} className={s.adipocitoN} /></g>
      ))}
      {/* Megacariocito */}
      <g transform="translate(560,620)">
        <circle r={46} className={s.megaC} />
        <path d="M-22,-10 C-26,-28 -4,-30 -2,-14 C8,-28 28,-20 20,-4 C34,4 22,24 8,16 C4,30 -18,26 -14,10 C-30,12 -32,-4 -22,-10 Z" className={s.megaN} />
      </g>
      {/* Trabéculas y hueso cortical */}
      <path d="M72,300 C130,290 170,320 210,300 M72,620 C110,600 150,640 190,610 C210,596 236,600 252,586 M770,300 C720,296 690,330 650,318 M764,700 C720,690 700,730 660,720 M300,106 C306,150 340,170 334,210 M560,104 C550,140 520,160 530,206 M280,904 C286,866 320,850 312,812" className={s.trabecula} />
      <path d={MEDULA} className={s.corticalF} />
      <path d={MEDULA} className={s.cortical} />
      <path d={MEDULA} className={s.corticalMarca} />
    </g>
  );
});

const Sinusoide = memo(function Sinusoide() {
  return (
    <g>
      <path d="M815,40 C800,300 830,700 810,970" className={s.sinusoideP} />
      <path d="M815,40 C800,300 830,700 810,970" fill="none" stroke="url(#ad-sinusoide)" strokeWidth={48} strokeLinecap="round" />
      <path d="M815,40 C800,300 830,700 810,970" className={s.sinusoideLuz} />
      {[110, 220, 340, 450, 610, 720, 850].map((y, j) => <g key={y} transform={`translate(${815 + (j % 2 ? 5 : -7)},${y}) rotate(${j * 37})`}><ellipse rx={15} ry={10} fill="#C2392F" stroke="#7E1E1C" strokeWidth={0.8} /><ellipse rx={7} ry={4.5} fill="#E8796A" /></g>)}
    </g>
  );
});

const PeriferiaFija = memo(function PeriferiaFija() {
  const G = 'M900,420 C880,240 1060,130 1250,160 C1440,186 1540,330 1520,520 C1504,700 1370,860 1190,850 C1040,842 910,760 930,640 C990,620 1000,560 960,520 C930,500 910,470 900,420 Z';
  return (
    <g>
      <path d={G} fill="url(#ad-ganglio)" className={s.ganglioFilo} />
      {[[1080, 290, 66], [1270, 240, 76], [1430, 390, 72], [1420, 610, 74], [1250, 750, 72], [1060, 720, 58]].map(([x, y, r], j) => (
        <g key={j}><circle cx={x} cy={y} r={r} className={s.folMini} /><circle cx={x} cy={y} r={r * 0.55} className={s.folMiniC} /></g>
      ))}
      <path d="M856,560 C900,548 930,552 968,558" stroke="#C24B44" strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M856,590 C900,582 930,584 962,586" stroke="#5C79B2" strokeWidth={11} fill="none" strokeLinecap="round" />
    </g>
  );
});

export function FondoSeleccion({ t }: { t: T }) {
  const me = v(t, 'medula'), pe = v(t, 'periferia');
  return (
    <g>
      <DefsAdaptativa />
      <Tejido id="ad-azul" semilla={1} />
      {me > 0.001 && (
        <g opacity={me}>
          <MedulaFija />
          <text x={418} y={68} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Médula ósea · selección negativa</text>
        </g>
      )}
      {pe > 0.001 && (
        <g opacity={pe}>
          <Sinusoide />
          <PeriferiaFija />
          <text x={1210} y={68} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Periferia · ganglio</text>
        </g>
      )}
    </g>
  );
}

// ─── Periferia: BAFF y el repertorio ──────────────────────────────────────────

/** BAFF: un trímero, tres bolas juntas. */
function Baff({ x, y, r = 11, rot = 0, op = 1 }: { x: number; y: number; r?: number; rot?: number; op?: number }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${rot.toFixed(0)})`} opacity={op}>
      {[-90, 30, 150].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.72} cy={Math.sin((a * Math.PI) / 180) * r * 0.72} r={r * 0.74} fill="url(#ad-baff)" stroke="#8A5E10" strokeWidth={0.8} />)}
    </g>
  );
}

const CelulaFuente = memo(function CelulaFuente() {
  return (
    <g>
      <path d="M0,0 L-92,-56 M0,0 L-34,-98 M0,0 L54,-90 M0,0 L104,-24 M0,0 L80,70 M0,0 L6,102 M0,0 L-82,62 M0,0 L-108,4" stroke="#C98A5E" strokeWidth={15} strokeLinecap="round" />
      <path d="M-92,-56 L-120,-58 M-92,-56 L-104,-84 M54,-90 L44,-118 M54,-90 L82,-108 M80,70 L112,76 M80,70 L78,102 M-82,62 L-110,64 M-82,62 L-84,92" stroke="#C98A5E" strokeWidth={8} strokeLinecap="round" />
      <circle r={56} fill="url(#ad-dend)" stroke="#9A6238" strokeWidth={1.6} />
      <path d="M-24,-10 C-20,-32 16,-34 28,-14 C38,6 22,30 -2,28 C-24,28 -32,6 -24,-10 Z" fill="#7A4E86" />
      <circle cx={8} cy={-8} r={6} fill="#3F2A58" />
      <ellipse cx={-22} cy={-36} rx={15} ry={5} fill="#FFF" opacity={0.42} transform="rotate(-26 -22 -36)" />
    </g>
  );
});

export function FondoPeriferia({ t, reloj }: { t: T; reloj: number }) {
  const fu = v(t, 'fuente'), ex = v(t, 'exceso');
  return (
    <g>
      <DefsAdaptativa />
      <Tejido id="ad-azul" semilla={5} />
      {fu > 0.001 && <g opacity={fu} transform={`translate(1180,320) scale(${0.7 + 0.3 * easeBack(fu)})`}><CelulaFuente /></g>}
      {ex > 0.001 && Array.from({ length: 38 }, (_, j) => {
        const q = tramo(ex, hash(j, 7) * 0.55, hash(j, 7) * 0.55 + 0.45);
        if (q <= 0) return null;
        const a = reloj / (1800 + j * 40) + j;
        return <Baff key={j} x={lerp(1180, 240 + hash(j, 8) * 1200, easeOut(q)) + Math.cos(a) * 12} y={lerp(320, 240 + hash(j, 9) * 640, easeOut(q)) + Math.sin(a) * 12} r={11 + (j % 3) * 2} rot={a * 40} op={Math.min(1, q * 3) * 0.95} />;
      })}
      {fu > 0.001 && (
        <g opacity={fu}>
          <text x={1180} y={470} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Célula dendrítica</text>
          <text x={1180} y={498} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>fabrica BAFF y APRIL</text>
        </g>
      )}
      {/* Cada autoanticuerpo, con lo que reconoce */}
      <Medalla x={1400} y={220} k={v(t, 'ma1')} c={L.ana}>
        <circle r={32} fill="#6E52A8" /><circle r={32} fill="#FFF" opacity={0.08} />
        {Array.from({ length: 14 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 14) * 27; return <circle key={j} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={2.8} fill="#7CF0A6" />; })}
        <IgG x={32} y={-26} ang={-130} k={0.62} />
      </Medalla>
      <Medalla x={1400} y={400} k={v(t, 'ma2')} c={L.lupus}><ComplejoNuc r={40} tipo="adn" /></Medalla>
      <Medalla x={1400} y={580} k={v(t, 'ma3')} c={L.lupus}>
        <path d="M-34,14 C-14,-18 14,18 34,-14" fill="none" stroke="#1F9A6A" strokeWidth={4} strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, j) => { const a = (j / 7) * TAU; return <circle key={j} cx={Math.cos(a) * 19} cy={Math.sin(a) * 19} r={8} fill={['#2CA9BC', '#1F8F8A', '#3DBA8C'][j % 3]} stroke="#FFF" strokeWidth={1} />; })}
        <IgG x={0} y={-30} ang={180} k={0.5} />
      </Medalla>
      <Medalla x={1400} y={790} k={v(t, 'ma4')} c={L.dano}>
        {Array.from({ length: 8 }, (_, j) => (
          <g key={j} transform={`translate(${-36 + j * 10.3},16)`}>
            <path d="M-1.6,3 V15 M1.6,3 V15" stroke="#D9A23E" strokeWidth={1.3} />
            <circle r={4.6} fill="#2F6FD0" />
          </g>
        ))}
        <path d="M-12,6 C-22,-8 -2,-18 2,-6 C10,-16 22,-4 12,6 Z" fill="#E58AA0" stroke="#A8466A" strokeWidth={1} />
        <IgG x={0} y={-23} ang={180} k={0.46} />
      </Medalla>
    </g>
  );
}

// ─── Centro germinal ──────────────────────────────────────────────────────────

const G = { cx: 700, cy: 520, r: 330 };

const FoliculoFijo = memo(function FoliculoFijo() {
  const manto = Array.from({ length: 560 }, (_, i) => {
    const a = hash(i, 1) * TAU, r = G.r + 8 + Math.sqrt(hash(i, 2)) * 74;
    return [G.cx + Math.cos(a) * r, G.cy + Math.sin(a) * r * 1.01];
  });
  const dentro = (n: number, sem: number, x0: number, x1: number) => Array.from({ length: n }, (_, i) => {
    const a = hash(i, sem) * TAU, r = Math.sqrt(hash(i, sem + 1)) * (G.r - 16);
    return [G.cx + Math.cos(a) * r, G.cy + Math.sin(a) * r];
  }).filter(([x]) => x >= x0 && x <= x1);
  const blastos = dentro(190, 3, 0, G.cx - 4);
  const citos = dentro(140, 7, G.cx + 4, 9999);
  const oscura = `M${G.cx},${G.cy - G.r} A${G.r},${G.r} 0 0 0 ${G.cx},${G.cy + G.r} C${G.cx + 24},${G.cy + 170} ${G.cx - 24},${G.cy - 170} ${G.cx},${G.cy - G.r} Z`;
  return (
    <g>
      <circle cx={G.cx} cy={G.cy} r={G.r + 94} className={s.foliculoFondo} />
      <circle cx={G.cx} cy={G.cy} r={G.r + 90} fill="url(#ad-foliculo)" />
      <path d={nube(manto)} className={s.mantoCel} />
      <path d={nube(manto)} className={s.mantoN} />
      <circle cx={G.cx} cy={G.cy} r={G.r} fill="url(#ad-clara)" className={s.gcFilo} />
      <path d={oscura} fill="url(#ad-oscura)" />
      {/* Red de la dendrítica folicular en la zona clara */}
      {[[900, 380], [930, 610], [800, 280], [810, 760], [970, 480]].map(([x, y], j) => (
        <g key={j}>
          {Array.from({ length: 9 }, (_, n) => { const a = (n / 9) * TAU + j; return <path key={n} d={`M${x},${y} q${f1(Math.cos(a + 0.6) * 30)},${f1(Math.sin(a + 0.6) * 30)} ${f1(Math.cos(a) * 62)},${f1(Math.sin(a) * 62)}`} className={s.fdcRama} />; })}
          <circle cx={x} cy={y} r={9} className={s.fdcCuerpo} />
        </g>
      ))}
      {/* Centrocitos en la clara, centroblastos grandes en la oscura */}
      <path d={nube(citos)} className={s.centrocitoC} />
      <path d={nube(citos)} className={s.centrocitoN} />
      <path d={nube(blastos)} className={s.centroblastoC} />
      <path d={nube(blastos)} className={s.centroblastoN} />
      <path d={nube(blastos.map(([x, y]) => [x - 2, y - 3]))} className={s.centroblastoB} />
      {/* Macrófagos de cuerpos tingibles */}
      {[[480, 360], [560, 700], [420, 560]].map(([x, y], j) => (
        <g key={j} transform={`translate(${x},${y})`}>
          <circle r={25} className={s.tingible} />
          {[[-9, -6, 5], [8, -8, 4], [2, 8, 6], [-10, 10, 3.4]].map(([a, b, r], n) => <circle key={n} cx={a} cy={b} r={r} className={s.tingibleC} />)}
        </g>
      ))}
    </g>
  );
});

/** El gen de la cadena pesada: VDJ junto a las regiones constantes. Con el cambio de
 *  clase, Cμ y Cδ salen en un lazo y VDJ queda pegado a Cγ. */
function GenClase({ k }: { k: number }) {
  const lazo = easeInOut(tramo(k, 0.45, 0.85));
  const W = 54, y = 0;
  const pieza = (x: number, dy: number, w: number, c: string, txt: string, key: string, rot = 0) => (
    <g key={key} transform={`translate(${f1(x)},${f1(y + dy)}) rotate(${rot.toFixed(0)})`}>
      <rect x={-w / 2} y={-15} width={w} height={30} rx={5} fill={c} stroke="#20252E" strokeOpacity={0.35} />
      <rect x={-w / 2 + 3} y={-12} width={w - 6} height={5} rx={2.5} fill="#FFF" opacity={0.32} />
      <text dy="0.35em" textAnchor="middle" className={s.genSeg}>{txt}</text>
    </g>
  );
  const gx = lerp(150, -80, lazo);
  return (
    <g>
      <path d={`M-230,${y} H${lerp(236, 36, lazo)}`} className={s.genHebra} />
      {pieza(-162, 0, 96, '#7B4FC9', 'VDJ', 'v')}
      {/* Lazo que se recorta */}
      {lazo > 0.01 && <circle cx={lerp(-30, -30, lazo)} cy={46 * lazo} r={40 * lazo} className={s.genLazo} />}
      {pieza(lerp(-72, -62, lazo), 70 * lazo, W, '#A974BE', 'Cμ', 'm', -8 * lazo)}
      {pieza(lerp(-8, 2, lazo), 70 * lazo, W, '#C6A5D6', 'Cδ', 'd', 8 * lazo)}
      {pieza(gx, 0, 62, L.ana, 'Cγ', 'g')}
      {pieza(lerp(224, -18, lazo), 0, W, '#8AA3C4', 'Cα', 'a')}
      {lazo > 0.5 && <text x={46} y={76} className={`${s.lSubChico} ${s.conHalo}`} opacity={tramo(lazo, 0.5, 1)}>se recorta lo que sobra</text>}
    </g>
  );
}

function CambioClase({ k }: { k: number }) {
  const m = easeBack(tramo(k, 0, 0.4)), fl = tramo(k, 0.3, 0.6), g = easeBack(tramo(k, 0.55, 1));
  return (
    <g transform="translate(1320,0)">
      <text y={86} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Cambio de clase</text>
      {/* IgM pentámero */}
      <g transform="translate(-150,170)">
        <circle r={72} className={s.discoClase} />
        <g transform={`scale(${0.5 + 0.5 * m})`}><IgM x={0} y={0} k={1} /></g>
        <text y={98} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fill: '#7B4FC9' }}>IgM</text>
      </g>
      {/* Flecha con IL-21 */}
      <g opacity={fl}>
        <path d="M-60,170 H46" className={s.flechaClase} {...dibujar(fl)} />
        <path d="M36,158 L52,170 L36,182" className={s.flechaClase} />
        <text x={-6} y={150} textAnchor="middle" className={`${s.etiquetaCitocina} ${s.conHalo}`}>IL-21</text>
      </g>
      {/* IgG */}
      <g transform="translate(150,170)" opacity={tramo(k, 0.55, 0.8)}>
        <circle r={72} className={s.discoClase} />
        <g transform={`scale(${0.5 + 0.5 * g})`}><IgG x={0} y={0} k={2.2} /></g>
        <text y={98} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fill: '#C96A18' }}>IgG</text>
      </g>
      <g transform="translate(0,312)" opacity={tramo(k, 0.15, 0.4)}><GenClase k={k} /></g>
    </g>
  );
}

/** La afinidad: el Fab que al principio queda suelto y, mutación a mutación, encaja. */
function Afinidad({ k, reloj }: { k: number; reloj: number }) {
  const e = easeInOut(k);
  // Mismas x para los dos: el borde del Fab se va volviendo el negativo del antígeno.
  const xs = [-110, -74, -56, -34, -12, 12, 30, 54, 74, 110];
  const ya = [0, 0, -22, -22, 0, 0, -30, -30, 0, 0];
  const fab = xs.map((x, i) => [x, lerp(-14 + (i % 2 ? 6 : 0), ya[i], e)]);
  const sep = lerp(46, 3, e);
  const bordeF = [...fab].reverse().map(([x, y]) => `L${x},${f1(y)}`).join(' ');
  const bordeA = xs.map((x, i) => `L${x},${ya[i]}`).join(' ');
  const on = tramo(k, 0.72, 1);
  return (
    <g transform="translate(1320,0)">
      <text y={442} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Maduración de la afinidad</text>
      <g transform="translate(0,566) scale(0.85)">
        {on > 0.01 && <ellipse rx={170} ry={84} fill="url(#ad-brillo)" opacity={on * (0.75 + 0.25 * Math.sin(reloj / 200))} />}
        {/* Fab */}
        <g transform={`translate(0,${f1(-sep)})`}>
          <path d={`M-110,-76 H110 ${bordeF} Z`} fill="url(#ad-fab)" stroke="#8A4A10" strokeWidth={1.4} strokeLinejoin="round" />
          <rect x={-100} y={-70} width={200} height={7} rx={3.5} fill="#FFF" opacity={0.3} />
          <text y={-50} textAnchor="middle" className={s.genSeg}>Fab del anticuerpo</text>
          {[[-92, -30], [-44, -40], [-1, -34], [42, -42], [92, -30]].map(([x, y], j) => tramo(k, 0.1 + j * 0.13, 0.2 + j * 0.13) > 0 && <circle key={j} cx={x} cy={y} r={5} fill="#E5484D" stroke="#FFF" strokeWidth={1.2} opacity={tramo(k, 0.1 + j * 0.13, 0.2 + j * 0.13)} />)}
        </g>
        {/* Antígeno */}
        <path d={`M-110,62 V0 ${bordeA} V62 Z`} fill="url(#ad-ag)" stroke="#0E5E44" strokeWidth={1.4} strokeLinejoin="round" />
        <text y={40} textAnchor="middle" className={s.genSeg}>autoantígeno</text>
        {on > 0.01 && [-92, -45, 0, 42, 92].map((x) => <path key={x} d={`M${x},-9 V5`} stroke="#FFD54A" strokeWidth={3.2} strokeLinecap="round" opacity={on} />)}
      </g>
      {/* Medidor: barras que crecen y se calientan */}
      <g transform="translate(-180,716)">
        {Array.from({ length: 15 }, (_, j) => {
          const on2 = tramo(k, j / 15, (j + 1) / 15), h = 12 + j * 3.4, x = j * 24;
          const c = ['#3F6AA8', '#4C78B0', '#5E86B4', '#7A90AE', '#A8908A', '#CE8C5A', '#E0892E', '#E37F34', '#DF6E3C', '#D85E42', '#D24E48', '#CC444E', '#C63C52', '#C23856', '#C2385A'][j];
          return (
            <g key={j}>
              <rect x={x} y={-h} width={17} height={h} rx={4} className={s.barraApagada} />
              <rect x={x} y={-h} width={17} height={h} rx={4} fill={c} opacity={on2} />
            </g>
          );
        })}
        <text x={-4} y={24} className={s.lSubChico}>baja</text>
        <text x={353} y={24} textAnchor="end" className={s.lSubChico}>alta</text>
      </g>
    </g>
  );
}

export function FondoGerminal({ t, reloj }: { t: T; reloj: number }) {
  const gc = v(t, 'gc'), zo = v(t, 'zonas'), cs = v(t, 'csr'), af = v(t, 'afinidad'), au = v(t, 'aumentados');
  return (
    <g>
      <DefsAdaptativa />
      <Tejido id="ad-azul" semilla={9} />
      {gc > 0.001 && (
        <g opacity={gc}>
          <FoliculoFijo />
          <text x={G.cx} y={70} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Folículo del ganglio · centro germinal</text>
        </g>
      )}
      {zo > 0.001 && (
        <g opacity={zo}>
          <text x={G.cx - 170} y={G.cy - 212} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Zona oscura</text>
          <text x={G.cx - 170} y={G.cy - 184} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>proliferación, hipermutación</text>
          <text x={G.cx + 170} y={G.cy + 228} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Zona clara</text>
          <text x={G.cx + 170} y={G.cy + 256} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>selección con el Tfh</text>
        </g>
      )}
      {cs > 0.001 && <g opacity={tramo(cs, 0, 0.2)}><CambioClase k={cs} /></g>}
      {af > 0.001 && <g opacity={tramo(af, 0, 0.1)}><Afinidad k={af} reloj={reloj} /></g>}
      <Globo x={1320} y={786} w={430} h={54} chico txt="En el lupus: Tfh aumentados" k={au} tono="alerta" />
    </g>
  );
}

// ─── Th1 y Th17 ───────────────────────────────────────────────────────────────

function FlechaAccion({ y, k, id, c }: { y: number; k: number; id: string; c: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k}>
      <path d={`M150,${y - 118} H820 L930,${y} L820,${y + 118} H150 C110,${y + 118} 110,${y - 118} 150,${y - 118} Z`} fill={`url(#${id})`} />
      <path d={`M820,${y - 118} L930,${y} L820,${y + 118}`} fill="none" stroke={c} strokeWidth={2} opacity={0.35} />
    </g>
  );
}

export function FondoEfectoras({ t, reloj }: { t: T; reloj: number }) {
  const m1 = v(t, 'mi1'), m2 = v(t, 'mi2');
  return (
    <g>
      <DefsAdaptativa />
      <DefsInterferon />
      <Tejido id="ad-violeta" semilla={12} />
      <FlechaAccion y={300} k={v(t, 'h1')} id="ad-flecha1" c="#7B4FC9" />
      <FlechaAccion y={700} k={v(t, 'h2')} id="ad-flecha2" c="#C0396E" />
      <Medalla x={1526} y={320} k={m1} c="#C2410C"><g transform="scale(2)"><Ifn x={0} y={0} rot={reloj / 30} op={1} /></g></Medalla>
      <Medalla x={1526} y={600} k={m2} c="#7B4FC9">
        <g transform={`rotate(${reloj / 40})`}>
          {[-1, 1].map((l) => <g key={l} transform={`scale(${l},1)`}><rect x={2} y={-20} width={13} height={40} rx={6.5} fill="#7B4FC9" /><rect x={18} y={-14} width={10} height={28} rx={5} fill="#A98BE0" /><rect x={5} y={-16} width={4} height={18} rx={2} fill="#FFF" opacity={0.5} /></g>)}
        </g>
      </Medalla>
    </g>
  );
}

// ─── El freno que falla ───────────────────────────────────────────────────────

function MedidorIl2({ k, cae, reloj }: { k: number; cae: number; reloj: number }) {
  if (k <= 0.001) return null;
  const a = lerp(62, -66, easeInOut(cae)) + Math.sin(reloj / 300) * (cae > 0.9 ? 1.6 : 0.6);
  return (
    <g transform="translate(180,510)" opacity={k}>
      <circle cx={5} cy={7} r={102} className={s.globoSombra} />
      <circle r={102} className={s.medidorAro} />
      <circle r={90} className={s.medidorCara} />
      <path d="M-70,-40 A81,81 0 0 1 -30,-75" fill="none" stroke="#E5484D" strokeWidth={13} />
      <path d="M-30,-75 A81,81 0 0 1 30,-75" fill="none" stroke="#E8B21E" strokeWidth={13} />
      <path d="M30,-75 A81,81 0 0 1 70,-40" fill="none" stroke="#1F9A6A" strokeWidth={13} />
      {Array.from({ length: 9 }, (_, j) => { const r = ((-66 + j * 16.5) * Math.PI) / 180; return <line key={j} x1={Math.sin(r) * 60} y1={-Math.cos(r) * 60} x2={Math.sin(r) * 72} y2={-Math.cos(r) * 72} stroke="#3A4256" strokeWidth={j % 4 ? 1.6 : 3} />; })}
      <text x={0} y={46} textAnchor="middle" className={s.medidorTit}>IL-2</text>
      <text x={0} y={66} textAnchor="middle" className={s.medidorSub}>{cae > 0.6 ? 'casi vacío' : 'lo que necesita'}</text>
      <path d="M-4,4 L0,-70 L4,4 Z" fill="#C2385A" transform={`rotate(${a.toFixed(1)})`} />
      <circle r={10} fill="url(#ad-baff)" stroke="#6E4C14" strokeWidth={1} />
    </g>
  );
}

function FrenoIcono({ k, roto }: { k: number; roto: number }) {
  return (
    <Medalla x={770} y={330} k={k} c="#E5484D">
      <circle r={30} fill="#AEB5C2" stroke="#5C6577" strokeWidth={1.6} />
      <circle r={9} fill="#5C6577" />
      {Array.from({ length: 8 }, (_, j) => { const a = (j / 8) * TAU; return <circle key={j} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r={3} fill="#5C6577" />; })}
      <path d="M12,-34 C34,-26 40,-6 36,14 L22,10 C26,-4 20,-16 6,-22 Z" fill="#E5484D" stroke="#8A1E2C" strokeWidth={1.2} />
      {roto > 0.01 && <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#C2385A" strokeWidth={8} strokeLinecap="round" opacity={roto} />}
    </Medalla>
  );
}

export function FondoFreno({ t, reloj }: { t: T; reloj: number }) {
  const cl = v(t, 'clones');
  return (
    <g>
      <DefsAdaptativa />
      <Tejido id="ad-verde" semilla={15} />
      <MedidorIl2 k={v(t, 'il2')} cae={v(t, 'il2cae')} reloj={reloj} />
      <FrenoIcono k={v(t, 'frenoV')} roto={cl} />
      {cl > 0.001 && Array.from({ length: 22 }, (_, j) => {
        const q = easeBack(tramo(cl, j * 0.035, 0.3 + j * 0.035));
        if (q <= 0) return null;
        const x = 960 + hash(j, 2) * 590, y = 170 + hash(j, 3) * 640;
        return <g key={j} transform={`translate(${f1(x)},${f1(y)}) scale(${q.toFixed(3)})`} opacity={0.85}><DibujoCelula dibujo="linfocito" d={54} color="#5E9CD3" /></g>;
      })}
    </g>
  );
}

// ─── Intersticio renal ────────────────────────────────────────────────────────

const Tubulos = memo(function Tubulos() {
  const sitios = [[170, 200, 96], [440, 150, 84], [120, 500, 88], [330, 400, 76], [190, 780, 94], [470, 800, 80], [660, 170, 72], [650, 830, 84], [920, 140, 84], [900, 860, 90], [1170, 130, 72], [1200, 880, 76], [1460, 180, 92], [1480, 500, 86], [1440, 820, 96]];
  return (
    <g>
      {sitios.map(([x, y, r], j) => {
        const n = Math.round(r / 6.4);
        return (
          <g key={j} transform={`translate(${x},${y})`} className={s.tubulo}>
            <circle r={r + 5} className={s.tubuloBase} />
            {Array.from({ length: n }, (_, i) => { const a = (i / n) * TAU, b = ((i + 1) / n) * TAU, ri = r * 0.5; return <path key={i} d={`M${f1(Math.cos(a) * ri)},${f1(Math.sin(a) * ri)} L${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)} L${f1(Math.cos(b) * r)},${f1(Math.sin(b) * r)} L${f1(Math.cos(b) * ri)},${f1(Math.sin(b) * ri)} Z`} className={s.tubuloCel} />; })}
            <path d={nube(Array.from({ length: n }, (_, i) => { const a = ((i + 0.5) / n) * TAU; return [Math.cos(a) * r * 0.76, Math.sin(a) * r * 0.76]; }))} className={s.tubuloN} />
            <circle r={r * 0.44} className={s.tubuloLuz} />
          </g>
        );
      })}
    </g>
  );
});

export function FondoIntersticio({ t, reloj }: { t: T; reloj: number }) {
  const inf = v(t, 'inflamaR');
  return (
    <g>
      <DefsAdaptativa />
      <rect x={-40} y={-40} width={1680} height={1080} fill="url(#ad-rosa)" />
      <Tubulos />
      <text x={800} y={70} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Intersticio del riñón</text>
      {inf > 0.001 && (
        <g opacity={inf}>
          <ellipse cx={1000} cy={500} rx={560} ry={420} fill="url(#ad-inflama)" opacity={0.85 + 0.15 * Math.sin(reloj / 400)} />
          {Array.from({ length: 22 }, (_, j) => {
            const q = tramo(inf, j * 0.03, 0.4 + j * 0.03), a = hash(j, 4) * TAU, r = 190 + hash(j, 5) * 260;
            const x = 1060 + Math.cos(a) * r * 1.1, y = 500 + Math.sin(a) * r * 0.75;
            if (Math.abs(x - 860) < 190 && y > 400 && y < 680) return null;
            return q > 0 ? <g key={j} transform={`translate(${f1(x)},${f1(y)})`} opacity={q}><DibujoCelula dibujo="linfocito" d={38} color={j % 3 ? '#C2410C' : '#B67AC7'} /></g> : null;
          })}
        </g>
      )}
    </g>
  );
}

// ─── Circuito innata ↔ adaptativa ─────────────────────────────────────────────

function Reparto({ x, y, k, children }: { x: number; y: number; k: number; children: ReactNode }) {
  if (k <= 0.001) return null;
  return <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * easeBack(k)})`} opacity={Math.min(1, k * 2)}>{children}</g>;
}

function NeutroMini() {
  return (
    <g>
      <circle r={52} fill="#EBD7F2" stroke="#A974BE" strokeWidth={2} />
      <path d="M-26,-6 C-34,-24 -8,-28 -6,-10 C4,-26 26,-20 20,-2 C36,4 26,28 8,20 C4,34 -20,30 -16,12 C-32,14 -36,0 -26,-6 Z" fill="#6E3F96" />
      {Array.from({ length: 16 }, (_, j) => { const a = j * 2.39996, q = 24 + (j % 3) * 8; return <circle key={j} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={1.8} fill="#B05F9E" />; })}
    </g>
  );
}

export function FondoCircuito({ t }: { t: T; reloj: number }) {
  const c1 = v(t, 'ci1'), c2 = v(t, 'ci2');
  return (
    <g>
      <DefsAdaptativa />
      <DefsInterferon />
      <rect x={-40} y={-40} width={840} height={1080} fill="url(#ad-violeta)" />
      <rect x={800} y={-40} width={840} height={1080} fill="url(#ad-azul)" />
      <path d="M800,-40 V770" className={s.divisoria} />
      <Reparto x={300} y={210} k={c1}><DibujoCelula dibujo="pdc" d={150} color="#7B4FC9" /><text y={102} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>pDC</text></Reparto>
      <Reparto x={530} y={210} k={tramo(c1, 0.2, 1)}><g transform="scale(1.3)"><NeutroMini /></g><text y={102} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Neutrófilo</text></Reparto>
      <Reparto x={1060} y={210} k={c2}><DibujoCelula dibujo="linfocito" d={130} color="#4C86C9" /><text y={102} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Linfocito B</text></Reparto>
      <Reparto x={1300} y={210} k={tramo(c2, 0.2, 1)}><DibujoCelula dibujo="linfocito" d={130} color="#C0396E" /><text y={102} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Linfocito T</text></Reparto>
    </g>
  );
}

// ─── Del anticuerpo al daño ───────────────────────────────────────────────────

export function FondoPuente({ t }: { t: T }) {
  return (
    <g>
      <DefsAdaptativa />
      <Tejido id="ad-rosa" semilla={21} />
      <Medalla x={272} y={830} k={v(t, 'm3')} c={L.dano}>
        <path d="M-40,20 H40" stroke="#B86A84" strokeWidth={11} strokeLinecap="round" />
        <g transform="translate(0,-8)"><ComplejoNuc r={28} tipo="adn" /></g>
      </Medalla>
      <Medalla x={1328} y={830} k={v(t, 'm2')} c="#E0892E">
        <circle cy={18} r={23} fill="#E8796A" stroke="#A82C28" strokeWidth={1.2} />
        <circle cy={18} r={10} fill="#F4A39A" />
        <IgG x={-16} y={-16} ang={158} k={0.8} />
        <IgG x={18} y={-16} ang={200} k={0.8} />
      </Medalla>
    </g>
  );
}
