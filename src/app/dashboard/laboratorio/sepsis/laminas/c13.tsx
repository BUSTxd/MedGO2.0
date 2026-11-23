'use client';
// Capítulo 13 · Microcirculación y metabolismo

import type { Lamina } from '../Lienzo';
import { Bandera, Chip, Cruz, Cuerpo, Fibrina, Flecha, Glucosa, Gota, Higado, Manometro, Mitocondria, Moneda, Neutrofilo, Pierna, Plaqueta, Respira, S, Sale, Vaso, Vela, easeOut, hash, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Molécula de oxígeno: dos esferas azules unidas. */
const O2 = ({ k = 1 }: { k?: number }) => (
  <g transform={`scale(${k})`}>
    <circle cx={-10} cy={3} r={13} fill={S.no[0]} /><circle cx={10} cy={3} r={13} fill={S.no[0]} />
    <circle cx={-10} cy={0} r={13} fill={S.no[1]} /><circle cx={10} cy={0} r={13} fill={S.no[1]} />
    <circle cx={-14} cy={-5} r={4} fill="#FFF" opacity={0.7} /><circle cx={6} cy={-5} r={4} fill="#FFF" opacity={0.7} />
  </g>
);

/** Célula del tejido: cuerpo, núcleo, halo verde si le sobra riego (`glow`) y grisácea si no le llega nada (`pale`). */
const Celula = ({ x, y, r = 64, pale = 0, glow = 0, reloj = 0, fase = 0 }: { x: number; y: number; r?: number; pale?: number; glow?: number; reloj?: number; fase?: number }) => (
  <g transform={`translate(${x},${y}) scale(${1 + 0.022 * Math.sin(reloj / 650 + fase)})`}>
    {glow > 0.01 && <circle r={r + 30} fill={S.gluco[1]} opacity={0.34 * glow} />}
    <circle cy={8} r={r} fill={S.cito[0]} /><circle r={r} fill={S.cito[1]} />
    <circle cx={10} cy={6} r={r * 0.42} fill={S.nucleo[0]} /><circle cx={6} cy={2} r={r * 0.36} fill={S.nucleo[1]} />
    <ellipse cx={-r * 0.38} cy={-r * 0.5} rx={r * 0.26} ry={r * 0.1} fill="#FFF" opacity={0.55} />
    <circle r={r} fill="#8C84A0" opacity={0.68 * pale} />
  </g>
);

// ─── 0 · Macro y microcirculación pierden la coherencia ──────────────────────
const Coherencia: Lamina = ({ p, reloj }) => {
  const sep = easeOut(p('coherencia'));
  const eslabon = (x: number, color: string) => <g transform={`translate(${x},520)`}><rect x={-62} y={-34} width={124} height={68} rx={34} fill="none" stroke={color} strokeWidth={20} /></g>;
  return (
    <g>
      <Bandera x={800} y={95} txt="presión corregida: ¿los tejidos están a salvo?" color={S.il6[0]} p={p('salvo')} t={32} punta="no" />
      <Bandera x={800} y={172} txt="no necesariamente" color={S.il1[0]} p={p('necesariamente')} t={32} punta="no" />
      <Sale p={p('presion')} x={0} y={0}><Manometro x={320} y={400} k={2.2} val={0.62} /></Sale>
      <Vaso x={340} y={700} largo={560} ancho={130} ang={0} reloj={reloj} flujo={7} o={tramo(p('macro'), 0, 0.5)} />
      <Bandera x={320} y={850} txt="macrocirculación: arterias grandes" color={S.sangre[0]} p={p('macro')} t={26} punta="no" />
      <g opacity={tramo(p('bien'), 0, 0.5)} transform={`translate(540,270) scale(${1.15 + 0.05 * Math.sin(reloj / 400)})`}><circle cy={5} r={44} fill={S.verde[0]} /><circle r={44} fill={S.verde[1]} /><path d="M-19,2 L-5,17 L21,-15" fill="none" stroke="#FFF" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></g>
      {[380, 520, 660].map((y, i) => (
        <Vaso key={i} x={1260} y={y} largo={620} ancho={36} ang={0} reloj={reloj} flujo={i === 1 ? 4 : 2} pared={30} o={tramo(p('capilares'), i * 0.12, i * 0.12 + 0.5)}>
          {(i === 0 || i === 2) && <g opacity={tramo(p('mal'), 0, 0.6)}><Fibrina x={60} y={0} w={130} /></g>}
        </Vaso>
      ))}
      {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 3000), f = i % 3; return <g key={i} opacity={tramo(p('oxigeno'), 0, 0.4) * (1 - u) * 0.95} transform={`translate(${1010 + f * 230},${lerp(380 + f * 140 + 70, 380 + f * 140 + 120, u)})`}><O2 k={0.85} /></g>; })}
      <Bandera x={1260} y={262} txt="el oxígeno se entrega en los capilares" color={S.no[0]} p={p('oxigeno')} t={24} punta="no" />
      <Bandera x={1260} y={800} txt="microcirculación" color={S.sangre[0]} p={p('micro')} t={28} punta="no" />
      <g opacity={tramo(p('coherencia'), 0, 0.3)}>{eslabon(770 - lerp(40, 105, sep), S.il6[1])}{eslabon(770 + lerp(40, 105, sep), S.il6[0])}</g>
      <g opacity={tramo(p('coherencia'), 0.5, 1)} stroke={S.il1[1]} strokeWidth={9} strokeLinecap="round" fill="none"><path d="M740,470 l16,30 l-18,16 l18,30" /><path d="M800,470 l-16,30 l18,16 l-18,30" /></g>
      <Bandera x={770} y={650} txt="pierden la coherencia" color={S.il6[0]} p={p('coherencia')} t={28} punta="no" />
      <g opacity={tramo(p('mal'), 0, 0.5)} transform={`translate(1500,262) scale(${1.15 + 0.05 * Math.sin(reloj / 400)})`}><circle cy={5} r={44} fill={S.il1[0]} /><circle r={44} fill={S.il1[1]} /><path d="M-17,-17 L17,17 M17,-17 L-17,17" stroke="#FFF" strokeWidth={10} strokeLinecap="round" /></g>
      <Bandera x={320} y={950} txt="el manómetro: todo bien" color={S.verde[0]} p={p('manometro')} t={28} punta="no" />
      <Bandera x={1260} y={950} txt="los capilares: otra cosa" color={S.il1[0]} p={p('otra')} t={28} punta="no" />
    </g>
  );
};

// ─── 1 · Una red de capilares con riego mal repartido ────────────────────────
const RedCapilar: Lamina = ({ p, reloj }) => {
  const filas = [330, 560, 790], tapado = p('microtrombos') > 0.02, nada = tramo(p('nada'), 0, 1), sobra = tramo(p('sobra'), 0, 1);
  return (
    <g>
      <Bandera x={800} y={95} txt="una red de capilares en un tejido séptico" color={S.il6[0]} p={p('red')} t={32} punta="no" />
      <Vaso x={560} y={filas[0]} largo={900} ancho={64} ang={0} reloj={reloj} flujo={tapado ? 0 : 4} pared={46}>
        <g opacity={tramo(p('microtrombos'), 0, 0.6)}><Fibrina x={120} y={0} w={170} /><Fibrina x={170} y={12} w={150} rota={20} /></g>
        <g opacity={tramo(p('leucocitos'), 0, 0.6)}><Neutrofilo x={-40} y={0} k={0.42} activo={0.6} /><Plaqueta x={30} y={-14} k={0.5} /></g>
      </Vaso>
      <Vaso x={560} y={filas[1]} largo={900} ancho={64} ang={0} reloj={reloj} flujo={14} pared={46} />
      {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj * 3, i, 6, 4000); return <rect key={i} x={lerp(110, 1000, u)} y={filas[1] - 20 + (i % 3) * 20} width={80} height={6} rx={3} fill="#FFF" opacity={0.7 * tramo(p('velocidad'), 0, 0.5)} />; })}
      <Vaso x={560} y={filas[2]} largo={900} ancho={64} ang={0} reloj={reloj} flujo={tapado ? 0 : 4} pared={46}>
        <g opacity={tramo(p('microtrombos'), 0.2, 0.8)}><Fibrina x={-100} y={0} w={170} rota={-10} /></g>
        <g opacity={tramo(p('leucocitos'), 0.2, 0.8)}><Neutrofilo x={60} y={0} k={0.42} activo={0.6} /></g>
      </Vaso>
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${150 + i * 38 + Math.sin(reloj / 500 + i) * 3},${filas[1] - 32} q7,10 0,22`} fill="none" stroke={S.gluco[1]} strokeWidth={6} strokeLinecap="round" opacity={0.95 * (1 - tramo(p('glucocalix'), 0, 0.8))} />)}
      {Array.from({ length: 9 }, (_, i) => { const a = hash(i, 3) * 6.28, r = 30 + hash(i, 4) * 36; return <g key={i} opacity={tramo(p('edema'), i * 0.07, i * 0.07 + 0.4)} transform={`translate(${1140 + Math.cos(a + reloj / 2400) * r * 1.4},${filas[1] + Math.sin(a + reloj / 2000) * (r + 120)})`}><circle r={11 + hash(i, 5) * 12} fill={S.no[2]} opacity={0.85} /><circle cx={-4} cy={-4} r={4} fill="#FFF" opacity={0.8} /></g>; })}
      {[0, 1, 2].map((i) => <Celula key={i} x={1370} y={filas[i]} pale={i === 1 ? 0 : nada} glow={i === 1 ? sobra : 0} reloj={reloj} fase={i} />)}
      {Array.from({ length: 8 }, (_, i) => { const u = corre(reloj, i, 8, 2600); return <g key={i} opacity={tramo(p('oxigeno'), 0, 0.3) * Math.min(1, u * 5) * (1 - u)} transform={`translate(${lerp(1030, 1290, u)},${filas[1] + Math.sin(u * 9 + i) * 30})`}><O2 k={0.75} /></g>; })}
      <Bandera x={560} y={205} txt="tapados por microtrombos y leucocitos" color={S.fibrina[0]} p={p('tapados')} t={26} punta="no" />
      <Bandera x={560} y={445} txt="cortocircuitos: pasa a toda velocidad" color={S.tnf[0]} p={p('cortocircuitos')} t={26} punta="no" />
      <Bandera x={560} y={675} txt="sin glucocálix" color={S.gluco[0]} p={p('glucocalix')} t={28} punta="no" />
      <Bandera x={1135} y={445} txt="edema" color={S.no[0]} p={p('edema')} t={28} punta="no" />
      <Flecha a={[1040, 905]} b={[1300, 905]} p={tramo(p('distancia'), 0, 0.8)} color={S.il6[1]} w={8} />
      <Bandera x={1170} y={955} txt="más distancia" color={S.il6[0]} p={p('distancia')} t={26} punta="no" />
      <Bandera x={1370} y={445} txt="sangre de sobra" color={S.gluco[0]} p={p('sobra')} t={26} punta="no" />
      <Bandera x={1370} y={690} txt="sin nada" color={S.gris[0]} p={p('nada')} t={26} punta="no" />
      <Bandera x={560} y={950} txt="un riego mal repartido" color={S.il1[0]} p={p('repartido')} t={34} punta="no" />
    </g>
  );
};

// ─── 2 · Hipoxia citopática ──────────────────────────────────────────────────
const Hipoxia: Lamina = ({ p, reloj }) => {
  const dano = easeOut(p('aprovecha')), cae = easeOut(p('atp'));
  return (
    <g>
      <Bandera x={520} y={95} txt="el oxígeno sí llega…" color={S.no[0]} p={p('oxigeno')} t={32} punta="no" />
      <Bandera x={1100} y={95} txt="…y a veces no se usa" color={S.il1[0]} p={p('usa')} t={32} punta="no" />
      <Sale p={p('mitocondria')} x={640} y={570} k={1.5}><Mitocondria dano={dano} reloj={reloj} /></Sale>
      {Array.from({ length: 7 }, (_, i) => <g key={i} opacity={tramo(p('oxigeno'), i * 0.06, i * 0.06 + 0.4)} transform={`translate(${150 + Math.sin(reloj / 480 + i * 1.3) * 34 + (i % 2) * 40},${340 + i * 62 + Math.sin(reloj / 560 + i) * 10})`}><O2 k={1.05} /></g>)}
      <Sale p={p('no')} x={470} y={225} k={1.9}><g transform={`translate(0,${Math.sin(reloj / 400) * 5})`}><circle r={26} fill={S.no[1]} /><circle cx={-8} cy={-9} r={8} fill="#FFF" opacity={0.6} /></g></Sale>
      <Bandera x={470} y={305} txt="óxido nítrico" color={S.no[0]} p={p('no')} t={24} punta="no" />
      <Sale p={p('peroxinitrito')} x={820} y={225} k={1}><Chip x={0} y={0} txt="peroxinitrito" color={S.il1[0]} t={30} /></Sale>
      <Flecha a={[470, 280]} b={[560, 400]} p={tramo(p('peroxinitrito'), 0, 0.8)} color={S.il1[1]} w={9} />
      <Flecha a={[820, 275]} b={[740, 410]} p={tramo(p('peroxinitrito'), 0, 0.8)} color={S.il1[1]} w={9} />
      <Bandera x={640} y={830} txt="mitocondria dañada" color={S.gris[0]} p={p('mitocondria')} t={28} punta="no" />
      <Bandera x={640} y={910} txt="no aprovecha el oxígeno que recibe" color={S.il1[0]} p={p('aprovecha')} t={26} punta="no" />
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={p('atp')} x={1130 + i * 120} y={380 + Math.sin(reloj / 500 + i) * 6} k={1.05}><g opacity={1 - 0.8 * cae * (i / 3 + 0.25)}><Moneda /></g></Sale>)}
      <Bandera x={1300} y={500} txt="cae la producción de ATP" color={S.lps[0]} p={p('atp')} t={26} punta="no" />
      <Bandera x={1300} y={680} txt="hipoxia citopática" color={S.il1[0]} p={p('hipoxia')} t={36} punta="no" />
      <Bandera x={1300} y={780} txt="la célula asfixiada" color={S.gris[0]} p={p('asfixiada')} t={28} punta="no" />
      <Bandera x={1300} y={860} txt="con el aire a la puerta" color={S.no[0]} p={p('puerta')} t={28} punta="no" />
    </g>
  );
};

// ─── 3 · Glucólisis anaerobia: de dónde sale el lactato ──────────────────────
const Anaerobia: Lamina = ({ p, reloj }) => {
  const sale = easeOut(p('convierte'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿de dónde sale el lactato?" color={S.il6[0]} p={p('lactato')} t={34} punta="no" />
      <rect x={90} y={170} width={1190} height={640} rx={130} fill={S.cito[2]} opacity={0.55} />
      <Sale p={p('glucolicis')} x={270} y={410} k={1.8}><Respira reloj={reloj} amp={0.03}><Glucosa /></Respira></Sale>
      <Flecha a={[360, 410]} b={[470, 410]} p={tramo(p('glucolicis'), 0.2, 1)} color={S.il6[1]} w={10} />
      {[540, 650, 760].map((x, i) => <g key={i} opacity={tramo(p('glucolicis'), 0.3 + i * 0.1, 0.7 + i * 0.1)}><circle cx={x} cy={414} r={36} fill={S.il6[0]} /><circle cx={x} cy={408} r={36} fill={S.il6[1]} /><ellipse cx={x - 12} cy={394} rx={11} ry={5} fill="#FFF" opacity={0.55} /></g>)}
      <Bandera x={650} y={250} txt="glucólisis anaerobia" color={S.il6[0]} p={p('glucolicis')} t={28} punta="no" />
      <Flecha a={[810, 410]} b={[900, 410]} p={tramo(p('pirubato'), 0, 0.8)} color={S.il6[1]} w={10} />
      {[0, 1].map((i) => <g key={i} opacity={tramo(p('pirubato'), 0, 0.5)} transform={`translate(${975},${380 + i * 70 + Math.sin(reloj / 500 + i) * 5})`}><rect x={-44} y={-22} width={88} height={44} rx={22} fill="#6A3FB0" /><rect x={-44} y={-27} width={88} height={44} rx={22} fill="#A97BF0" /><ellipse cx={-20} cy={-17} rx={13} ry={5} fill="#FFF" opacity={0.6} /></g>)}
      <Flecha a={[1040, 410]} b={[1120, 410]} p={tramo(p('convierte'), 0, 0.8)} color={S.lactato[1]} w={10} />
      {[0, 1].map((i) => <g key={i} opacity={tramo(p('convierte'), 0, 0.4)} transform={`translate(${lerp(1190, 1430, sale) + Math.sin(reloj / 600 + i) * 6},${lerp(380 + i * 70, 330 + i * 120, sale) + Math.sin(reloj / 520 + i) * 8})`}><Gota tono={S.lactato} k={1.15} /></g>)}
      <Bandera x={1400} y={520} txt="lactato" color={S.lactato[0]} p={p('convierte')} t={30} punta="no" />
      <Bandera x={975} y={290} txt="piruvato" color={S.il6[0]} p={p('pirubato')} t={26} punta="no" />
      <Sale p={p('atp')} x={600} y={330} k={0.9}><g transform={`translate(0,${Math.sin(reloj / 450) * 6})`}><Moneda /></g></Sale>
      <Sale p={p('atp')} x={700} y={330} k={0.9}><g transform={`translate(0,${Math.sin(reloj / 450 + 1.5) * 6})`}><Moneda /></g></Sale>
      <g opacity={tramo(p('regenerar'), 0, 0.5)}>
        <Chip x={860} y={640} txt="NADH" color={S.il6[0]} t={28} /><Chip x={1070} y={640} txt="NAD⁺" color={S.il6[1]} t={28} />
      </g>
      <Flecha a={[930, 640]} b={[1000, 640]} p={tramo(p('regenerar'), 0.2, 1)} color={S.lactato[1]} w={8} />
      <Flecha a={[1090, 600]} b={[800, 450]} c={[1080, 480]} p={tramo(p('siga'), 0, 1)} color={S.il6[1]} w={8} />
      <Bandera x={960} y={725} txt="regenera NAD⁺" color={S.lactato[0]} p={p('regenerar')} t={26} punta="no" />
      <Bandera x={660} y={560} txt="y así la glucólisis siga" color={S.il6[0]} p={p('siga')} t={26} punta="no" />
      <Sale p={p('oxigeno')} x={250} y={730} k={0.5}><Mitocondria dano={1} reloj={reloj} /></Sale>
      <Bandera x={250} y={835} txt="sin oxígeno suficiente" color={S.gris[0]} p={p('oxigeno')} t={26} punta="no" />
      <Bandera x={560} y={860} txt="un poco de ATP sin oxígeno" color={S.lps[0]} p={p('atp')} t={26} punta="no" />
      <Bandera x={1050} y={880} txt="el lactato no es el veneno" color={S.lactato[0]} p={p('veneno')} t={32} punta="no" />
      <Bandera x={1050} y={955} txt="es la huella de la falta de oxígeno" color={S.il1[0]} p={p('huella')} t={30} punta="no" />
    </g>
  );
};

// ─── 4 · Lactato que sube aunque haya oxígeno ────────────────────────────────
const LactatoConOxigeno: Lamina = ({ p, reloj }) => {
  const gira = reloj / (6 - 4 * easeOut(p('acelera')));
  return (
    <g>
      <Bandera x={800} y={95} txt="lactato alto, aunque haya oxígeno" color={S.il6[0]} p={p('sube')} t={34} punta="no" />
      <Sale p={p('adrenalina')} x={300} y={225} k={1.3}><Chip x={0} y={0} txt="adrenalina" color={S.tnf[0]} t={30} /></Sale>
      <Flecha a={[300, 275]} b={[300, 395]} p={tramo(p('beta'), 0, 0.8)} color={S.tnf[1]} w={9} />
      <g opacity={tramo(p('beta'), 0, 0.5)}><rect x={-9} y={-6} width={18} height={44} rx={9} fill="#8E1B9C" transform="translate(300,404)" /><ellipse cx={300} cy={398} rx={38} ry={20} fill="#C77800" /><ellipse cx={300} cy={394} rx={36} ry={18} fill="#FFAE1A" /></g>
      <Bandera x={130} y={390} txt="receptor β2" color={S.lps[0]} p={p('beta')} t={26} punta="no" />
      <g opacity={tramo(p('musculo'), 0, 0.5)}><rect x={190} y={450} width={520} height={250} rx={125} fill="#9A2E3A" /><rect x={190} y={444} width={520} height={250} rx={125} fill="#E0626E" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={250} y={490 + i * 38} width={400} height={10} rx={5} fill="#FFB0B0" opacity={0.55} />)}</g>
      <g opacity={tramo(p('aerobica'), 0, 0.5)} transform={`translate(450,570) rotate(${gira})`}><circle r={74} fill="none" stroke={S.il6[1]} strokeWidth={16} strokeDasharray="60 30" strokeLinecap="round" /><path d="M74,0 l-14,-22 l30,0 z" fill={S.il6[1]} /></g>
      {[[330, 520], [570, 620], [330, 640], [580, 520]].map(([x, y], i) => <g key={i} opacity={tramo(p('aerobica'), 0.2, 0.8)} transform={`translate(${x + Math.sin(reloj / 500 + i) * 8},${y})`}><O2 k={0.75} /></g>)}
      <Bandera x={450} y={760} txt="glucólisis aeróbica" color={S.il6[0]} p={p('aerobica')} t={26} punta="no" />
      <Bandera x={440} y={315} txt="acelera" color={S.tnf[0]} p={p('acelera')} t={26} punta="no" />
      {Array.from({ length: 4 }, (_, i) => { const u = corre(reloj, i, 4, 3600); return <g key={i} opacity={tramo(p('sube'), 0, 0.3) * (1 - u * 0.6)} transform={`translate(${540 + i * 60},${lerp(470, 290, u)})`}><Gota tono={S.lactato} k={0.8} /></g>; })}
      <Sale p={p('higado')} x={1150} y={540} k={1.25}><Respira reloj={reloj} amp={0.015}><Higado /></Respira></Sale>
      <ellipse cx={1150} cy={540} rx={230} ry={170} fill="#8C84A0" opacity={0.36 * tramo(p('irrigado'), 0, 1)} />
      <Bandera x={1150} y={760} txt="hígado mal irrigado" color={S.gris[0]} p={p('irrigado')} t={26} punta="no" />
      <Flecha a={[760, 520]} b={[920, 520]} p={tramo(p('aclara'), 0, 0.8)} color={S.lactato[1]} w={10} />
      <Bandera x={1150} y={850} txt="aclara peor el lactato" color={S.lactato[0]} p={p('aclara')} t={26} punta="no" />
      <Flecha a={[820, 820]} b={[820, 690]} p={tramo(p('produccion'), 0, 0.8)} color={S.il1[1]} w={14} />
      <Bandera x={820} y={860} txt="más producción" color={S.il1[0]} p={p('produccion')} t={24} punta="no" />
      <Flecha a={[1450, 650]} b={[1450, 790]} p={tramo(p('limpieza'), 0, 0.8)} color={S.gris[1]} w={14} />
      <Bandera x={1450} y={600} txt="menos limpieza" color={S.gris[0]} p={p('limpieza')} t={24} punta="no" />
      <Bandera x={800} y={965} txt="el lactato no siempre significa falta de oxígeno" color={S.il6[0]} p={p('siempre')} t={30} punta="no" />
    </g>
  );
};

// ─── 5 · El cuerpo entero entra en modo supervivencia ────────────────────────
const Supervivencia: Lamina = ({ p, reloj }) => {
  const nGlu = Math.round(7 * tramo(p('glucosa'), 0, 1)), enc = easeOut(p('degrada')), pierde = easeOut(p('pierde'));
  const f = 1 + 0.09 * Math.sin(reloj / 90) + 0.05 * Math.sin(reloj / 53);
  return (
    <g>
      <Bandera x={800} y={95} txt="el cuerpo entero entra en modo supervivencia" color={S.il6[0]} p={p('supervivencia')} t={32} punta="no" />
      <Sale p={p('supervivencia')} x={250} y={560} k={0.95}><Cuerpo /></Sale>
      <g opacity={tramo(p('hipermetabolismo'), 0, 0.5)} transform={`translate(250,520) scale(${(1 / f).toFixed(3)},${f.toFixed(3)})`}><path d="M0,-70 C34,-34 30,2 0,12 C-30,2 -34,-34 0,-70 Z" fill="#FF8A1E" /><path d="M0,-44 C18,-22 16,-2 0,6 C-16,-2 -18,-22 0,-44 Z" fill="#FFE066" /></g>
      <Bandera x={250} y={850} txt="hipermetabolismo: todo se gasta más rápido" color={S.tnf[0]} p={p('hipermetabolismo')} t={24} punta="no" />
      {[['cortisol', 680, S.il6[0]], ['catecolaminas', 910, S.tnf[0]], ['glucagon', 1140, S.gluco[0]]].map(([clave, x, c], i) => (
        <g key={i}><Sale p={p(clave as string)} x={x as number} y={230} k={1}><Chip x={0} y={0} txt={clave === 'glucagon' ? 'glucagón' : (clave as string)} color={c as string} t={28} /></Sale><Flecha a={[x as number, 275]} b={[880 + (i - 1) * 60, 380]} p={tramo(p(clave as string), 0.2, 1)} color={c as string} w={7} /></g>
      ))}
      {Array.from({ length: 7 }, (_, i) => <g key={i} opacity={i < nGlu ? 1 : 0} transform={`translate(${770 + (i % 4) * 90 + (Math.floor(i / 4) ? 45 : 0)},${440 + Math.floor(i / 4) * 80 + Math.sin(reloj / 500 + i) * 5})`}><Glucosa k={0.55} /></g>)}
      <Bandera x={880} y={575} txt="sube la glucosa" color={S.il6[0]} p={p('glucosa')} t={26} punta="no" />
      <g opacity={tramo(p('resistencia'), 0, 0.5)} transform="translate(780,700) scale(1.25)"><rect x={-50} y={-44} width={100} height={88} rx={20} fill={S.il6[0]} /><rect x={-50} y={-50} width={100} height={88} rx={20} fill={S.il6[1]} /><circle cx={0} cy={-14} r={12} fill="#2A0F6E" /><rect x={-5} y={-8} width={10} height={32} rx={4} fill="#2A0F6E" /></g>
      <g opacity={tramo(p('insulina'), 0, 0.5)} transform={`translate(${930 + Math.sin(reloj / 300) * 8},700) rotate(28) scale(1.25)`}><circle r={26} fill={S.lps[0]} /><circle cy={-3} r={24} fill={S.lps[1]} /><rect x={22} y={-8} width={78} height={16} rx={8} fill={S.lps[1]} /><rect x={78} y={6} width={10} height={18} rx={4} fill={S.lps[1]} /></g>
      <g opacity={tramo(p('insulina'), 0.3, 1)}><Cruz x={850} y={650} k={0.9} /></g>
      <Bandera x={850} y={800} txt="resistencia a la insulina" color={S.il6[0]} p={p('resistencia')} t={26} punta="no" />
      <Sale p={p('degrada')} x={1330} y={520} k={1}><g transform={`scale(${lerp(1, 0.82, pierde)})`}><Pierna /></g></Sale>
      {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 3000); return <circle key={i} cx={lerp(1330, 1530, u) + Math.sin(i * 3) * 20} cy={lerp(500, 330 + (i % 3) * 120, u)} r={13} fill={['#2FD79A', '#FF8A1E', '#8A4FE8'][i % 3]} opacity={tramo(p('aminoacidos'), 0, 0.3) * (1 - u * 0.5)} />; })}
      <Bandera x={1330} y={290} txt="el músculo se degrada" color={S.il1[0]} p={p('degrada')} t={26} punta="no" />
      <Bandera x={1330} y={770} txt="da aminoácidos" color={S.gluco[0]} p={p('aminoacidos')} t={26} punta="no" />
      <Bandera x={1330} y={850} txt="días en sepsis: pierde masa muscular" color={S.il1[0]} p={p('dias')} t={24} punta="no" />
      <Sale p={p('consume')} x={560} y={960} k={0.5}><Vela gasto={tramo(p('consume'), 0, 1)} reloj={reloj} /></Sale>
      <Bandera x={1000} y={915} txt="el cuerpo se consume a sí mismo" color={S.il1[0]} p={p('consume')} t={30} punta="no" />
      <Bandera x={1000} y={975} txt="para seguir adelante" color={S.il6[0]} p={p('adelante')} t={30} punta="no" />
    </g>
  );
};

// ─── 6 · Los números del lactato ─────────────────────────────────────────────
const Numeros: Lamina = ({ p, reloj }) => {
  const y = (v: number) => 850 - v * 100, joven = lerp(1.8, 5.2, easeOut(p('c52')));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué dicen los números?" color={S.il6[0]} p={p('numeros')} t={34} punta="no" />
      <rect x={660} y={y(6)} width={80} height={600} rx={40} fill={S.gris[2]} opacity={0.7 * tramo(p('numeros'), 0, 0.6)} />
      <rect x={660} y={y(6)} width={80} height={y(2) - y(6)} rx={40} fill={S.il1[2]} opacity={0.55 * tramo(p('dos'), 0, 1)} />
      {[0, 1, 2, 3, 4, 5, 6].map((v) => <g key={v} opacity={tramo(p('numeros'), 0, 0.6)}><rect x={748} y={y(v) - 3} width={26} height={6} rx={3} fill={S.gris[1]} /><text x={790} y={y(v) + 9} fontSize={30} fontWeight={800} fill="var(--cit-texto-2)">{v}</text></g>)}
      <text x={700} y={y(6) - 20} textAnchor="middle" fontSize={28} fontWeight={800} fill="var(--cit-texto-2)" opacity={tramo(p('numeros'), 0, 0.6)}>mmol/L</text>
      <line x1={300} y1={y(2)} x2={1500} y2={y(2)} stroke={S.il1[1]} strokeWidth={8} strokeDasharray="30 22" strokeLinecap="round" opacity={tramo(p('dos'), 0, 0.6)} />
      <Bandera x={1250} y={y(2) - 46} txt="más de 2: parte del choque séptico" color={S.il1[0]} p={p('septico')} t={26} punta="no" />
      <g opacity={tramo(p('joven'), 0, 0.5)}><circle cx={700} cy={y(joven) + 5} r={34} fill={S.il6[0]} /><circle cx={700} cy={y(joven)} r={34} fill={S.il6[1]} /><circle cx={688} cy={y(joven) - 11} r={8} fill="#FFF" opacity={0.6} /></g>
      <g opacity={tramo(p('c18'), 0, 0.5)} transform={`translate(0,${y(joven) - 22})`}><Chip x={960} y={22} txt={`joven  ${p('c52') > 0.5 ? '5,2' : '1,8'}`} color={S.il6[0]} t={32} /></g>
      <g opacity={tramo(p('abuela'), 0, 0.5)}><circle cx={700} cy={y(3.4) + 5} r={34} fill={S.lactato[0]} /><circle cx={700} cy={y(3.4)} r={34} fill={S.lactato[1]} /><circle cx={688} cy={y(3.4) - 11} r={8} fill="#FFF" opacity={0.6} /></g>
      <Sale p={p('abuela')} x={440} y={y(3.4)} k={1}><Chip x={0} y={0} txt="abuela  3,4" color={S.lactato[0]} t={32} /></Sale>
      <Flecha a={[585, y(5)]} b={[585, y(1)]} p={tramo(p('baja'), 0, 0.8)} color={S.gluco[1]} w={16} />
      <Bandera x={330} y={830} txt="si baja con las horas, buena señal" color={S.gluco[0]} p={p('senal')} t={26} punta="no" />
      <Bandera x={800} y={955} txt="un solo número resume el estado de los tejidos" color={S.il6[0]} p={p('numero')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Coherencia, RedCapilar, Hipoxia, Anaerobia, LactatoConOxigeno, Supervivencia, Numeros];
export default LAMINAS;
