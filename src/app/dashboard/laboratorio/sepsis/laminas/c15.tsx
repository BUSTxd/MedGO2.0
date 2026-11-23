'use client';
// Capítulo 15 · El pulmón: síndrome de dificultad respiratoria aguda (SDRA)

import { useId } from 'react';
import type { Lamina } from '../Lienzo';
import { Barrera, Gotita, Histo, Neumocito2, Saco } from './Pulmon';
import { Bacilo, Bandera, Barra, Chip, Corazon, Cruz, Enzima, Flecha, Late, Macrofago, Manometro, Net, Neutrofilo, Puerta, Pulmones, Respira, S, Sale, Tijeras, Tnf, Txt, Ventilador, easeOut, hash, lerp, sobre, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Molécula de oxígeno: dos esferas azules unidas. */
const O2 = ({ k = 1 }: { k?: number }) => (
  <g transform={`scale(${k})`}>
    <circle cx={-10} cy={3} r={13} fill={S.no[0]} /><circle cx={10} cy={3} r={13} fill={S.no[0]} />
    <circle cx={-10} cy={0} r={13} fill={S.no[1]} /><circle cx={10} cy={0} r={13} fill={S.no[1]} />
    <circle cx={-14} cy={-5} r={4} fill="#FFF" opacity={0.7} /><circle cx={6} cy={-5} r={4} fill="#FFF" opacity={0.7} />
  </g>
);

// ─── 0 · La barrera alvéolo-capilar y la batalla que empieza en ella ─────────
const BarreraInicio: Lamina = ({ p, reloj }) => {
  const y0 = 700, e = (i: number, q: number) => easeOut(tramo(q, i * 0.18, i * 0.18 + 0.7));
  return (
    <g>
      <Bandera x={900} y={95} txt="síndrome de dificultad respiratoria aguda (SDRA)" color={S.il1[0]} p={p('sdra')} t={32} punta="no" />
      <Sale p={p('pulmon')} x={190} y={330} k={0.62}><Respira reloj={reloj} amp={0.02}><Pulmones infiltrados={easeOut(p('batalla')) * 0.8} /></Respira></Sale>
      <Bandera x={190} y={520} txt="el pulmón de la abuela" color={S.il6[0]} p={p('pulmon')} t={24} punta="no" />
      <Barrera y={y0} reloj={reloj} glow={tramo(p('barrera'), 0, 0.6)} flujo={7} />
      <Sale p={p('aire')} x={1440} y={470} k={1}><Chip x={0} y={0} txt="aire" color={S.no[0]} t={34} /></Sale>
      <Sale p={p('sangre')} x={1440} y={830} k={1}><Chip x={0} y={0} txt="sangre" color={S.sangre[0]} t={34} /></Sale>
      <Bandera x={1250} y={580} txt="una barrera finísima" color={S.lps[0]} p={p('barrera')} t={26} punta="no" />
      <Bandera x={430} y={580} txt="neumocitos" color={S.cito[0]} p={p('neumocitos')} t={26} punta="no" />
      <Flecha a={[430, 610]} b={[430, 640]} p={tramo(p('neumocitos'), 0, 1)} color={S.cito[0]} w={8} />
      <Bandera x={1130} y={790} txt="endotelio" color={S.endo[0]} p={p('endotelio')} t={26} punta="no" />
      <Flecha a={[1130, 765]} b={[1130, 715]} p={tramo(p('endotelio'), 0, 1)} color={S.endo[1]} w={8} />
      <Sale p={p('macrofagos')} x={700} y={420} k={1.2}><Respira reloj={reloj} amp={0.035}><Macrofago /></Respira></Sale>
      <Bandera x={700} y={545} txt="macrófagos alveolares" color={S.linfo[0]} p={p('macrofagos')} t={24} punta="no" />
      <Bandera x={960} y={605} txt="y el epitelio" color={S.cito[0]} p={p('epitelio')} t={24} punta="no" />
      <Sale p={p('microbio')} x={300} y={470} k={0.85}><Bacilo r={-20} reloj={reloj} /></Sale>
      <Flecha a={[560, 440]} b={[400, 465]} p={tramo(p('microbio'), 0, 1)} color={S.linfo[1]} w={8} />
      {[0, 1, 2].map((i) => { const u = corre(reloj, i, 3, 3200); return <g key={i} opacity={tramo(p('tnf'), 0, 0.4) * (1 - u * 0.7)} transform={`translate(${lerp(780, 1020, u) + i * 40},${lerp(400, 250, u) - i * 20})`}><Tnf /></g>; })}
      <Sale p={p('tnf')} x={1000} y={170} k={1}><Chip x={0} y={0} txt="TNF-α" color={S.tnf[0]} t={30} /></Sale>
      {['IL-1β', 'IL-6', 'IL-8'].map((t, i) => <g key={t} opacity={e(i, p('interleucinas'))} transform={`translate(${1170 + i * 140},${250 + (i % 2) * 60})`}><Chip x={0} y={0} txt={t} color={i === 0 ? S.il1[0] : i === 1 ? S.il6[0] : S.c5a[0]} t={28} /></g>)}
      {[0, 1, 2].map((i) => <g key={i} opacity={e(i, p('neutrofilos'))} transform={`translate(${1000 + i * 150},${lerp(830, 705, e(i, p('neutrofilos')))})`}><Neutrofilo k={0.85} activo={0.7} /></g>)}
      <Bandera x={800} y={970} txt="la batalla empieza justo en la barrera" color={S.il1[0]} p={p('batalla')} t={32} punta="no" />
    </g>
  );
};

// ─── 1 · Los neutrófilos descargan sus armas ─────────────────────────────────
const Armas: Lamina = ({ p, reloj }) => {
  const rota = Math.min(1, tramo(p('cadherina'), 0, 1) * 0.4 + tramo(p('ocludinas'), 0, 1) * 0.3 + tramo(p('zo'), 0, 1) * 0.3);
  return (
    <g>
      <Bandera x={800} y={95} txt="los neutrófilos descargan sus armas" color={S.il6[0]} p={p('descargan')} t={32} punta="no" />
      <Sale p={p('neutrofilos')} x={300} y={410} k={2.4}><Respira reloj={reloj} amp={0.03}><Neutrofilo activo={1} /></Respira></Sale>
      <Sale p={p('ros')} x={680} y={240} k={1.5}><g><circle cy={5} r={36} fill={S.verde[0]} /><circle r={36} fill={S.verde[1]} /><circle cx={-11} cy={-12} r={8} fill="#FFF" opacity={0.6} /><text y={9} textAnchor="middle" fontSize={24} fontWeight={800} fill="#FFF">ROS</text></g></Sale>
      <Bandera x={1040} y={240} txt="especies reactivas de oxígeno" color={S.verde[0]} p={p('ros')} t={24} punta="no" />
      <Sale p={p('proteasas')} x={680} y={385} k={1.9}><Tijeras abre={0.55 + 0.4 * Math.sin(reloj / 260)} /></Sale>
      <Bandera x={960} y={385} txt="proteasas" color={S.il6[0]} p={p('proteasas')} t={26} punta="no" />
      <Sale p={p('elastasas')} x={680} y={510} k={2}><Enzima r={reloj / 50} /></Sale>
      <Bandera x={960} y={510} txt="elastasa" color={S.tnf[0]} p={p('elastasas')} t={26} punta="no" />
      <Sale p={p('nets')} x={1270} y={400} k={1}><Net x={0} y={0} k={0.85} p={1} R={230} sem={4} /></Sale>
      <Bandera x={1270} y={590} txt="NET" color={S.net[0]} p={p('nets')} t={28} punta="no" />
      <Flecha a={[640, 620]} b={[640, 740]} p={tramo(p('danan'), 0, 1)} color={S.il1[1]} w={14} />
      <Flecha a={[1000, 620]} b={[1000, 740]} p={tramo(p('danan'), 0.2, 1)} color={S.il1[1]} w={14} />
      <Barrera y={830} reloj={reloj} rota={easeOut(rota)} flujo={5} />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${60 + i * 50 + Math.sin(reloj / 500 + i) * 3},836 q7,12 0,26`} fill="none" stroke={S.gluco[1]} strokeWidth={6} strokeLinecap="round" opacity={0.95 * (1 - 0.92 * tramo(p('glucocalix'), 0, 0.8))} />)}
      <Bandera x={300} y={675} txt="dañan neumocitos y endotelio" color={S.il1[0]} p={p('danan')} t={24} punta="no" />
      <Bandera x={900} y={915} txt="degradan el glucocálix" color={S.gluco[0]} p={p('glucocalix')} t={24} punta="no" />
      <Sale p={p('cadherina')} x={440} y={735} k={1}><Chip x={0} y={0} txt="E-cadherina" color={S.gluco[0]} t={24} /></Sale>
      <Sale p={p('ocludinas')} x={710} y={735} k={1}><Chip x={0} y={0} txt="ocludinas" color={S.lps[0]} t={24} /></Sale>
      <Sale p={p('zo')} x={980} y={735} k={1}><Chip x={0} y={0} txt="ZO-1" color={S.il6[0]} t={24} /></Sale>
      <Bandera x={1250} y={190} txt="las mismas armas que usamos contra el microbio" color={S.gluco[0]} p={p('mismas')} t={24} punta="no" />
      <Sale p={p('microbio')} x={1440} y={290} k={0.7}><Bacilo reloj={reloj} /></Sale>
      <g opacity={tramo(p('microbio'), 0.3, 1)}><circle cx={1440} cy={365} r={22} fill={S.verde[1]} /><path d="M1430,365 l7,9 l14,-16" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g>
      <Bandera x={800} y={968} txt="…pero ahora contra la propia pared del alvéolo" color={S.il1[0]} p={p('propia')} t={30} punta="no" />
    </g>
  );
};

// ─── 2 · El alvéolo se llena de líquido ──────────────────────────────────────
const Edema: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿por qué se llena el alvéolo de líquido?" color={S.il6[0]} p={p('llena')} t={32} punta="no" />
    <Barrera y={640} reloj={reloj} rota={easeOut(p('barrera'))} hinchada={easeOut(p('intersticio'))} agua={0.6 * tramo(p('inunda'), 0, 1)} fuga={tramo(p('liquido'), 0, 1)} flujo={6} />
    <Bandera x={250} y={555} txt="barrera rota" color={S.il1[0]} p={p('barrera')} t={26} punta="no" />
    <Bandera x={790} y={520} txt="sale líquido con proteínas" color={S.no[0]} p={p('liquido')} t={26} punta="no" />
    <Bandera x={1180} y={745} txt="hacia el intersticio" color={S.no[0]} p={p('intersticio')} t={26} punta="no" />
    <g opacity={tramo(p('linfaticos'), 0, 0.5)} transform="translate(230,215)"><path d="M-74,-60 L74,-60 L52,62 L-52,62 Z" fill="#4C566E" /><path d="M-74,-66 L74,-66 L52,56 L-52,56 Z" fill="#8C9AB8" /><rect x={-60} y={-24 - 20 * easeOut(p('abasto'))} width={120} height={44 + 20 * easeOut(p('abasto'))} fill={S.no[1]} opacity={0.85} /></g>
    {[-60, 60].flatMap((dx, j) => [0, 1].map((i) => { const u = corre(reloj, i + j * 2, 4, 1800); return <circle key={`${j}-${i}`} cx={230 + dx * 1.15} cy={lerp(160, 300, u)} r={9} fill={S.no[1]} opacity={tramo(p('abasto'), 0, 0.4) * (1 - u)} />; }))}
    <Bandera x={230} y={340} txt="los linfáticos no dan abasto" color={S.lps[0]} p={p('linfaticos')} t={24} punta="no" />
    <Bandera x={800} y={440} txt="edema" color={S.no[0]} p={p('edema')} t={34} punta="no" />
    <Sale p={p('corazon')} x={1330} y={250} k={0.8}><Late reloj={reloj} bpm={70}><Corazon /></Late></Sale>
    <g opacity={tramo(p('corazon'), 0.4, 1)} transform="translate(1450,160)"><circle cy={5} r={34} fill={S.verde[0]} /><circle r={34} fill={S.verde[1]} /><path d="M-14,2 L-4,13 L16,-11" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></g>
    <Bandera x={1330} y={400} txt="edema no cardiogénico" color={S.il1[0]} p={p('cardiogenico')} t={26} punta="no" />
    <Bandera x={1330} y={470} txt="la causa no es el corazón" color={S.il6[0]} p={p('causa')} t={24} punta="no" />
    <Bandera x={800} y={965} txt="es la barrera" color={S.il1[0]} p={p('barrera2')} t={40} punta="no" />
  </g>
);

// ─── 3 · El surfactante se pierde y el alvéolo colapsa ───────────────────────
const Surfactante: Lamina = ({ p, reloj }) => {
  const col = tramo(p('pegan'), 0, 1), ag = tramo(p('exudado'), 0, 1) * 0.5 * (1 - col), surf = tramo(p('surfactante'), 0, 0.5) * (1 - 0.9 * tramo(p('inactiva'), 0, 1));
  const tens = tramo(p('sube'), 0, 1), R = 240, cx = 800, cy = 520;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué mantiene abierto a un alvéolo?" color={S.il6[0]} p={p('mantiene')} t={32} punta="no" />
      <Saco x={cx} y={cy} R={R} colapso={col} agua={ag} surf={surf} reloj={reloj} o={tramo(p('mantiene'), 0, 0.5)} />
      <g opacity={tramo(p('neumocito'), 0, 0.5)} transform={`translate(${cx},${cy - R + 52}) rotate(180) scale(0.78)`}><Neumocito2 reloj={reloj} activo={1 - 0.85 * tramo(p('fabrica'), 0, 1)} dano={tramo(p('danado'), 0, 1)} /></g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.2, r0 = R + 78, L = 22 + 56 * tens, fuera = 1 - tens;
        return <g key={i} transform={`translate(${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0 * (1 - 0.1 * col)}) rotate(${(a * 180) / Math.PI + (fuera > 0.5 ? 0 : 180)})`} opacity={tramo(p('baja'), 0, 0.5) * (1 - 0.3 * col)}><path d={`M${-L / 2},0 L${L / 2},0`} stroke={tens > 0.3 ? S.il1[1] : S.lps[1]} strokeWidth={9} strokeLinecap="round" /><path d={`M${L / 2 - 4},-13 L${L / 2 + 14},0 L${L / 2 - 4},13 z`} fill={tens > 0.3 ? S.il1[1] : S.lps[1]} /></g>;
      })}
      <Bandera x={300} y={300} txt="surfactante" color={S.lps[0]} p={p('surfactante')} t={34} punta="no" />
      <Bandera x={300} y={385} txt="una película que baja la tensión superficial" color={S.lps[0]} p={p('pelicula')} t={22} punta="no" />
      <Bandera x={1250} y={215} txt="neumocito tipo 2 dañado" color={S.cito[0]} p={p('neumocito')} t={26} punta="no" />
      <Bandera x={1250} y={300} txt="fabrica menos" color={S.gris[0]} p={p('fabrica')} t={26} punta="no" />
      <Bandera x={1250} y={640} txt="el exudado" color={S.no[0]} p={p('exudado')} t={26} punta="no" />
      <Bandera x={1250} y={710} txt="lo diluye" color={S.no[0]} p={p('diluye')} t={26} punta="no" />
      <Bandera x={1250} y={780} txt="y lo inactiva" color={S.il1[0]} p={p('inactiva')} t={26} punta="no" />
      <Bandera x={300} y={640} txt="sube la tensión superficial" color={S.il1[0]} p={p('tension')} t={26} punta="no" />
      <Bandera x={300} y={725} txt="paredes húmedas" color={S.no[0]} p={p('paredes')} t={26} punta="no" />
      <Barra x={560} y={875} w={480} h={36} val={1 - 0.86 * col} color={S.no[1]} txt="pulmón disponible" valor={col > 0.5 ? 'cada vez menos' : 'todo'} p={p('menos')} />
      <Bandera x={800} y={968} txt="cada vez hay menos pulmón disponible" color={S.il1[0]} p={p('menos')} t={26} punta="no" />
    </g>
  );
};

// ─── 4 · Por qué la sangre sale del pulmón sin oxígeno ───────────────────────
const Hipoxemia: Lamina = ({ p, reloj }) => {
  const zig: [number, number][] = [[330, 250], [250, 310], [410, 370], [260, 440], [400, 510], [330, 580]], u = (reloj / 3600) % 1, q = sobre(zig, u);
  return (
    <g>
      <Bandera x={800} y={95} txt="¿por qué sale la sangre sin oxígeno suficiente?" color={S.il6[0]} p={p('sale')} t={30} punta="no" />
      <Bandera x={800} y={172} txt="tres razones" color={S.il1[0]} p={p('tres')} t={32} punta="no" />
      <Barrera x0={90} x1={570} y={440} reloj={reloj} hinchada={1} agua={0.3} flujo={3} o={tramo(p('liquido'), 0, 0.5)} />
      <polyline points={zig.map((z) => z.join(',')).join(' ')} fill="none" stroke={S.lps[1]} strokeWidth={5} strokeDasharray="3 14" strokeLinecap="round" opacity={0.9 * tramo(p('difunde'), 0, 0.5)} />
      <g opacity={tramo(p('difunde'), 0, 0.4)} transform={`translate(${q[0]},${q[1]})`}><O2 k={0.9} /></g>
      <Bandera x={330} y={800} txt="el líquido aleja el aire de la sangre" color={S.no[0]} p={p('liquido')} t={22} punta="no" />
      <Bandera x={330} y={870} txt="el oxígeno difunde peor" color={S.il1[0]} p={p('difunde')} t={24} punta="no" />
      <Bandera x={800} y={255} txt="ventilación" color={S.no[0]} p={p('ventilacion')} t={26} punta="no" />
      <Saco x={800} y={430} R={90} colapso={0.92} agua={0.6} surf={0} reloj={reloj} o={tramo(p('ventilacion'), 0, 0.5)} />
      <Sale p={p('perfusion')} x={800} y={620} k={1}><g><rect x={-300} y={-42} width={600} height={84} rx={42} fill="#7A1E3A" /><rect x={-300} y={-48} width={600} height={84} rx={42} fill="#B02F55" /></g></Sale>
      {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={800 - 260 + ((i * 130 + reloj * 0.08) % 520)} cy={620 + Math.sin(i * 2) * 10} r={19} fill={S.sangre[0]} opacity={tramo(p('perfusion'), 0, 0.5)} />)}
      <Bandera x={800} y={715} txt="perfusión" color={S.sangre[0]} p={p('perfusion')} t={26} punta="no" />
      <Bandera x={800} y={800} txt="cortocircuito" color={S.il1[0]} p={p('cortocircuito')} t={34} punta="no" />
      <Sale p={p('rigido')} x={1290} y={420} k={0.62}><Pulmones /></Sale>
      <path d={`M1150,600 ${Array.from({ length: 8 }, (_, i) => `l24,${i % 2 ? -34 : 34}`).join(' ')}`} fill="none" stroke={S.gris[1]} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('rigido'), 0, 0.5)} />
      <Bandera x={1290} y={690} txt="el pulmón, más rígido" color={S.gris[0]} p={p('rigido')} t={26} punta="no" />
      <Bandera x={1290} y={765} txt="se distiende menos" color={S.il1[0]} p={p('distiende')} t={26} punta="no" />
      <Bandera x={1290} y={850} txt="saturación de oxígeno" color={S.no[0]} p={p('saturacion')} t={24} punta="no" />
      <Txt x={1290} y={945} txt="86 %" t={86} p={p('c86')} color="var(--se-sangre)" />
      <Bandera x={640} y={930} txt="respira más" color={S.gluco[0]} p={p('respira')} t={28} punta="no" />
      <Bandera x={920} y={930} txt="y oxigena menos" color={S.il1[0]} p={p('oxigena')} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · Criterios de Berlín ─────────────────────────────────────────────────
const Berlin: Lamina = ({ p, reloj }) => {
  const id = `berlin-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const X = (v: number) => 200 + v * 3, yb = 560, hb = 70;
  const zona = (v0: number, v1: number, color: string, q: number) => <rect x={X(v0)} y={yb} width={(X(v1) - X(v0)) * easeOut(q)} height={hb} fill={color} />;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿cómo se clasifica la gravedad?" color={S.il6[0]} p={p('clasifica')} t={32} punta="no" />
      <Bandera x={800} y={172} txt="criterios de Berlín" color={S.il1[0]} p={p('berlin')} t={30} punta="no" />
      <g opacity={tramo(p('presion'), 0, 0.5)}><Txt x={450} y={290} txt="PaO₂" t={70} color={S.no[0]} /></g>
      <rect x={340} y={318} width={220} height={8} rx={4} fill={S.gris[1]} opacity={tramo(p('presion'), 0, 0.5)} />
      <g opacity={tramo(p('fraccion'), 0, 0.5)}><Txt x={450} y={400} txt="FiO₂" t={70} color={S.gluco[0]} /></g>
      <Bandera x={790} y={290} txt="presión arterial de oxígeno" color={S.no[0]} p={p('oxigeno')} t={22} punta="no" />
      <Bandera x={830} y={400} txt="fracción de oxígeno que se respira" color={S.gluco[0]} p={p('fraccion')} t={22} punta="no" />
      <Sale p={p('pip')} x={1180} y={290} k={1}><Chip x={0} y={0} txt="PEEP" color={S.il6[0]} t={32} /></Sale>
      <Sale p={p('c5')} x={1360} y={290} k={1}><Chip x={0} y={0} txt="≥ 5 cmH₂O" color={S.il6[1]} t={28} /></Sale>
      <clipPath id={id}><rect x={200} y={yb} width={1200} height={hb} rx={35} /></clipPath>
      <rect x={200} y={yb} width={1200} height={hb} rx={35} fill={S.gris[2]} opacity={0.6 * tramo(p('berlin'), 0, 0.5)} />
      <g clipPath={`url(#${id})`}>{zona(0, 100, S.il1[1], p('grave'))}{zona(100, 200, S.tnf[1], p('moderado'))}{zona(200, 300, S.lps[1], p('leve'))}{zona(300, 400, S.gluco[1], p('berlin') * 0.8)}</g>
      <Sale p={p('grave')} x={X(50)} y={510} k={1}><Chip x={0} y={0} txt="grave" color={S.il1[0]} t={28} /></Sale>
      <Sale p={p('moderado')} x={X(150)} y={510} k={1}><Chip x={0} y={0} txt="moderado" color={S.tnf[0]} t={28} /></Sale>
      <Sale p={p('leve')} x={X(250)} y={510} k={1}><Chip x={0} y={0} txt="leve" color={S.lps[0]} t={28} /></Sale>
      <Txt x={X(50)} y={690} txt="≤ 100" t={34} p={p('c100')} color={S.il1[0]} />
      <Txt x={X(150)} y={690} txt="101 – 200" t={34} p={p('c101')} color={S.tnf[0]} />
      <Txt x={X(250)} y={690} txt="201 – 300" t={34} p={p('c201')} color={S.lps[0]} />
      <g opacity={tramo(p('c180'), 0, 0.5)}>
        <path d={`M${X(180)},${yb + hb + 2} l-22,34 l44,0 z`} fill={S.il6[0]} />
        <line x1={X(180)} y1={yb + hb + 40} x2={X(180)} y2={760} stroke={S.il6[1]} strokeWidth={6} strokeDasharray="3 12" strokeLinecap="round" />
        <Txt x={X(180)} y={820} txt="180" t={72} color={S.il6[0]} />
      </g>
      <Sale p={p('abuela')} x={X(180)} y={890} k={1}><Chip x={0} y={0} txt="abuela" color={S.lactato[0]} t={32} /></Sale>
      <Bandera x={380} y={830} txt="SDRA moderado" color={S.tnf[0]} p={p('sdr')} t={44} punta="no" />
      <g opacity={tramo(p('opacidades'), 0, 0.5)} transform="translate(1270,810)"><rect x={-200} y={-120} width={400} height={240} rx={26} fill="#10131F" /><ellipse cx={-85} cy={0} rx={70} ry={92} fill="#8E98B0" opacity={0.55} /><ellipse cx={85} cy={0} rx={70} ry={92} fill="#8E98B0" opacity={0.55} />{[[-95, -30, 34], [-70, 40, 40], [-110, 10, 28], [90, -20, 38], [70, 45, 34], [105, 15, 30]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={(r as number) * 0.75} fill="#F2F5FF" opacity={0.78} />)}<path d="M-14,-110 L-14,110 M14,-110 L14,110" stroke="#C9D0E4" strokeWidth={8} opacity={0.35} /></g>
      <Bandera x={1270} y={695} txt="radiografía de tórax" color={S.gris[0]} p={p('radiografia')} t={24} punta="no" />
      <Bandera x={1270} y={955} txt="opacidades en los dos pulmones" color={S.no[0]} p={p('opacidades')} t={24} punta="no" />
    </g>
  );
};

// ─── 6 · El ventilador y la presión positiva al final de la espiración ───────
const Ventilacion: Lamina = ({ p, reloj }) => {
  const pos: [number, number][] = [[880, 400], [1080, 400], [1280, 400], [880, 640], [1080, 640], [1280, 640]];
  const base = 0.35 * easeOut(p('cierran'));
  const col = (i: number) => (i === 1 || i === 5 ? 0 : i === 0 || i === 3 ? Math.max(0, 1 - base - 0.65 * easeOut(p('reabren'))) : Math.max(0, 1 - base - 0.65 * easeOut(p('reclutan'))));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y qué hace el ventilador por esos alvéolos colapsados?" color={S.il6[0]} p={p('ventilador')} t={28} punta="no" />
      <Sale p={p('ventilador')} x={250} y={540} k={1.2}><Ventilador reloj={reloj} /></Sale>
      <path d="M390,500 C560,500 640,520 760,520" fill="none" stroke={S.gris[0]} strokeWidth={26} strokeLinecap="round" opacity={tramo(p('colapsados'), 0, 0.5)} /><path d="M390,500 C560,500 640,520 760,520" fill="none" stroke={S.gris[1]} strokeWidth={16} strokeLinecap="round" opacity={tramo(p('colapsados'), 0, 0.5)} />
      {pos.map(([x, y], i) => <Saco key={i} x={x} y={y} R={78} colapso={col(i)} surf={0.6} reloj={reloj} o={tramo(p('colapsados'), i * 0.06, i * 0.06 + 0.4)} />)}
      <Bandera x={1080} y={250} txt="alvéolos colapsados" color={S.gris[0]} p={p('colapsados')} t={26} punta="no" />
      <Sale p={p('pip')} x={560} y={260} k={1.1}><Manometro x={0} y={0} val={0.35 + 0.35 * easeOut(p('pip'))} /></Sale>
      <Sale p={p('pip')} x={710} y={220} k={1}><Chip x={0} y={0} txt="PEEP" color={S.il6[0]} t={32} /></Sale>
      {[0, 1, 2].map((i) => { const u = corre(reloj, i, 3, 1600); return <g key={i} opacity={tramo(p('presion'), 0, 0.4)} transform={`translate(${lerp(480, 740, u)},${510 + (i - 1) * 4})`}><path d="M-16,-14 L16,0 L-16,14 z" fill={S.gluco[1]} /></g>; })}
      <Bandera x={470} y={690} txt="presión positiva al final de la inspiración" color={S.gluco[0]} p={p('final')} t={22} punta="no" />
      <Bandera x={1080} y={790} txt="no se cierran del todo" color={S.no[0]} p={p('cierran')} t={26} punta="no" />
      <Bandera x={1080} y={865} txt="algunos se reabren: se reclutan" color={S.gluco[0]} p={p('reclutan')} t={26} punta="no" />
      {pos.map(([x, y], i) => <g key={i} opacity={tramo(p('gases'), 0, 0.4) * (col(i) < 0.2 ? 1 : 0)} transform={`translate(${x + Math.sin(reloj / 400 + i) * 22},${y + Math.cos(reloj / 500 + i) * 18})`}><O2 k={0.6} /></g>)}
      <Bandera x={1080} y={940} txt="más superficie para el intercambio de gases" color={S.no[0]} p={p('superficie')} t={24} punta="no" />
      <Sale p={p('puerta')} x={170} y={800} k={0.42}><Puerta abre={0.25} /></Sale>
      <Bandera x={420} y={960} txt="como dejar la puerta entreabierta" color={S.il6[0]} p={p('puerta')} t={26} punta="no" />
    </g>
  );
};

// ─── 7 · Lo que se ve al microscopio ─────────────────────────────────────────
const Histologia: Lamina = ({ p, reloj }) => {
  void reloj;
  const nota = (clave: string, y: number, txt: string, color: string) => <Bandera key={clave} x={1270} y={y} txt={txt} color={color} p={p(clave)} t={26} punta="no" />;
  return (
    <g>
      <Bandera x={800} y={95} txt="al microscopio, con hematoxilina y eosina" color={S.il6[0]} p={p('microscopio')} t={30} punta="no" />
      <Histo x={540} y={560} R={390} edema={tramo(p('edema'), 0, 1)} hemorragia={tramo(p('hemorragia'), 0, 1)} necrosis={tramo(p('necrosis'), 0, 1)} neutro={tramo(p('infiltrado'), 0, 1)} trombos={tramo(p('microtrombos'), 0, 1)} membrana={tramo(p('pelicula'), 0, 1)} o={tramo(p('microscopio'), 0, 0.5)} />
      {nota('difuso', 205, 'daño alveolar difuso', S.il1[0])}
      {nota('exudativa', 275, 'fase exudativa', S.il6[0])}
      {nota('edema', 345, 'edema: intersticio y alvéolos', S.no[0])}
      {nota('congestion', 415, 'congestión', S.sangre[0])}
      {nota('hemorragia', 485, 'hemorragia', S.il1[0])}
      {nota('necrosis', 555, 'necrosis de neumocitos', S.gris[0])}
      {nota('infiltrado', 625, 'infiltrado de neutrófilos', S.nucleo[1])}
      {nota('microtrombos', 695, 'microtrombos', S.fibrina[0])}
      {nota('pelicula', 775, 'película rosada: fibrina y proteínas', S.il1[0])}
      {nota('membranas', 845, 'membranas hialinas', S.il1[0])}
      <Bandera x={800} y={968} txt="una tela rosa que tapiza el alvéolo" color={S.il1[0]} p={p('tela')} t={32} punta="no" />
    </g>
  );
};

// ─── 8 · La reparación: salvar el pulmón o cicatrizarlo ──────────────────────
const Reparacion: Lamina = ({ p, reloj }) => {
  const celulas = Math.round(3 * tramo(p('multiplican'), 0, 1));
  return (
    <g>
      <Bandera x={800} y={95} txt="después de la fase exudativa, empieza la reparación" color={S.il6[0]} p={p('despues')} t={30} punta="no" />
      <Barrera x0={30} x1={710} y={530} reloj={reloj} rota={0.55 * (1 - 0.7 * tramo(p('cubrir'), 0, 1))} hinchada={0.35} flujo={4} />
      {[170, 380, 590].map((x, i) => <g key={i} opacity={i < celulas || (i === 0 && p('neumocitos') > 0.1) ? 1 : 0} transform={`translate(${x},${462 + Math.sin(reloj / 600 + i) * 3})`}><Neumocito2 k={0.56} reloj={reloj} activo={1} /></g>)}
      <Bandera x={370} y={345} txt="neumocitos tipo 2 se multiplican" color={S.cito[0]} p={p('multiplican')} t={24} punta="no" />
      <Bandera x={370} y={265} txt="reparación" color={S.il6[0]} p={p('reparacion')} t={30} punta="no" />
      <Bandera x={370} y={190} txt="hiperplasia" color={S.il6[0]} p={p('hiperplasia')} t={26} punta="no" />
      <Flecha a={[250, 515]} b={[320, 515]} p={tramo(p('cubrir'), 0, 1)} color={S.gluco[1]} w={9} /><Flecha a={[460, 515]} b={[530, 515]} p={tramo(p('cubrir'), 0.2, 1)} color={S.gluco[1]} w={9} />
      <Bandera x={370} y={790} txt="cubren el epitelio perdido" color={S.gluco[0]} p={p('epitelio')} t={24} punta="no" />
      <Flecha a={[730, 480]} b={[890, 340]} c={[800, 380]} p={tramo(p('cede'), 0, 1)} color={S.gluco[1]} w={14} />
      <Flecha a={[730, 560]} b={[890, 760]} c={[800, 700]} p={tramo(p('persiste'), 0, 1)} color={S.il1[1]} w={14} />
      <Barrera x0={900} x1={1570} y={320} reloj={reloj} flujo={4} o={tramo(p('cede'), 0, 0.6)} />
      <Bandera x={1230} y={150} txt="si el daño cede, se recupera" color={S.gluco[0]} p={p('recupera')} t={26} punta="no" />
      <Barrera x0={900} x1={1570} y={740} reloj={reloj} hinchada={1} flujo={4} o={tramo(p('persiste'), 0, 0.6)} />
      <g opacity={tramo(p('fibrosis'), 0, 0.6)}>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${910 + i * 72},${735} q18,14 36,0 t36,0`} fill="none" stroke="#8A5A2A" strokeWidth={7} strokeLinecap="round" />)}{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${930 + i * 72},${755} q18,-14 36,0 t36,0`} fill="none" stroke="#B88A52" strokeWidth={6} strokeLinecap="round" />)}</g>
      <Bandera x={1230} y={600} txt="si el daño persiste: fibrosis" color={S.il1[0]} p={p('persiste')} t={26} punta="no" />
      <Bandera x={1230} y={925} txt="fibrosis" color={S.tnf[0]} p={p('fibrosis')} t={34} punta="no" />
      <Bandera x={400} y={965} txt="puede salvar el pulmón…" color={S.gluco[0]} p={p('salvar')} t={26} punta="no" />
      <Bandera x={760} y={965} txt="…o cicatrizarlo" color={S.il1[0]} p={p('cicatrizarlo')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [BarreraInicio, Armas, Edema, Surfactante, Hipoxemia, Berlin, Ventilacion, Histologia, Reparacion];
export default LAMINAS;
