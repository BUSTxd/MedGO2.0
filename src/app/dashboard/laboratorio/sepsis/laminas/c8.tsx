'use client';
// Capítulo 8 · Coagulación y anticoagulación: el equilibrio normal

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Antitrombina, Balanza, Bandera, Chip, Cruz, Endo, Enzima, Fibrina, Flecha, FT, Heparan, Hematie, Llama, Plaqueta, PlaqAct, S, Sale, Tijera, TuboEnsayo, VWF, easeOut, hash, lerp, tramo } from '../Piezas';

/** Una pieza que aparece con su rótulo debajo. */
const Con = ({ p, x, y, k = 1, txt, color, t = 24, dy = 80, children }: { p: number; x: number; y: number; k?: number; txt: string; color: string; t?: number; dy?: number; children: ReactNode }) => (
  <g>
    <Sale p={p} x={x} y={y} k={k}>{children}</Sale>
    <Bandera x={x} y={y + dy} txt={txt} color={color} p={p} t={t} punta="no" />
  </g>
);

// ─── 0 · Un equilibrio activo ────────────────────────────────────────────────
const Equilibrio: Lamina = ({ p, reloj }) => {
  const tr = easeOut(p('trombosis')), he = easeOut(p('hemorragia'));
  const inclina = -0.85 * tr * (1 - he) + 0.85 * he;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿cómo evita tu cuerpo coagularse por dentro y desangrarse por fuera?" color={S.il6[0]} p={p('evita')} t={30} punta="no" />
      <Sale p={p('balanza')} x={800} y={440} k={1.05}>
        <Balanza x={0} y={0} inclina={inclina} reloj={reloj}
          izq={<g><FT x={-50} y={-30} k={1.4} /><PlaqAct x={0} y={-30} k={1.2} /><Fibrina x={50} y={-20} w={60} /></g>}
          der={<g><Antitrombina x={-40} y={-30} k={1.3} /><Heparan x={20} y={-30} n={3} /><Tijera x={60} y={-20} k={0.8} corta={0.4} /></g>} />
      </Sale>
      <Bandera x={300} y={650} txt="procoagulantes" color={S.fibrina[0]} p={p('procoagulantes')} t={26} punta="no" />
      <Bandera x={1300} y={650} txt="anticoagulantes y fibrinólisis" color={S.gluco[0]} p={p('anticoagulantes')} t={26} punta="no" />
      <Sale p={p('liquida')} x={300} y={260} k={0.9}><g><rect x={-90} y={-30} width={180} height={60} rx={30} fill="#B02FA0" /><rect x={-86} y={-26} width={172} height={52} rx={26} fill="#7A1E3A" /><g transform="translate(-30,0)"><Hematie k={0.3} /></g><g transform="translate(30,0)"><Hematie k={0.3} /></g></g></Sale>
      <Bandera x={300} y={340} txt="sangre líquida dentro del vaso" color={S.endo[0]} p={p('liquida')} t={22} punta="no" />
      <Sale p={p('coagulo')} x={1300} y={260} k={0.9}><g><path d="M-80,-24 L-30,0 L0,-24 L40,0 L80,-24" fill="none" stroke="#7A1E3A" strokeWidth={10} strokeLinecap="round" /><Fibrina y={20} w={120} /></g></Sale>
      <Bandera x={1300} y={340} txt="coágulo solo donde hay rotura" color={S.fibrina[0]} p={p('coagulo')} t={22} punta="no" />
      <Bandera x={420} y={850} txt="a un lado: trombosis" color={S.il1[0]} p={p('trombosis')} t={30} punta="no" />
      <Bandera x={1180} y={850} txt="al otro lado: hemorragia" color={S.il1[0]} p={p('hemorragia')} t={30} punta="no" />
      <Bandera x={800} y={940} txt="un equilibrio activo, no una calma" color={S.il6[0]} p={p('equilibrio')} t={30} punta="no" />
      <Bandera x={800} y={770} txt="una balanza con dos platos" color={S.il6[0]} p={p('fibrinolisis')} t={24} punta="no" />
    </g>
  );
};

// ─── 1 · El disparo: el factor tisular ───────────────────────────────────────
const Disparo: Lamina = ({ p, reloj }) => {
  const ro = easeOut(p('rotura'));
  return (
    <g>
      <rect x={0} y={150} width={1600} height={170} fill="#5E1030" opacity={tramo(p('dispara'), 0, 0.4)} />
      <g opacity={tramo(p('fuera'), 0, 0.5)}>
        {[160, 400, 640, 880].map((x, i) => <Endo key={i} x={x} y={470} w={220} h={70} gluco={0} sem={i + 1} o={i === 2 ? 0 : 1} />)}
        {[160, 400, 880].map((x, i) => <g key={i} transform={`translate(${x},430)`}><FT k={1.1} /></g>)}
      </g>
      <g opacity={tramo(p('rotura'), 0, 0.4)}>{Array.from({ length: 5 }, (_, i) => <circle key={i} cx={640 + (hash(i, 1) - 0.5) * 60} cy={lerp(330, 440, ((reloj / 1500 + i / 5) % 1) * ro)} r={10} fill={S.sangre[1]} />)}</g>
      <Sale p={p('tisular')} x={640} y={410} k={1.7}><FT /></Sale>
      <Bandera x={640} y={540} txt="factor tisular, fuera del vaso" color={S.fibrina[0]} p={p('tisular')} t={24} punta="no" />
      <Bandera x={640} y={260} txt="¿quién dispara la coagulación?" color={S.il6[0]} p={p('dispara')} t={30} punta="no" />
      <Chip x={1180} y={230} txt="factor VIIa" color={S.c5a[0]} p={p('siete')} t={26} />
      <Chip x={1180} y={340} txt="X → Xa (diez a)" color={S.nfkb[0]} p={p('diez')} t={26} />
      <Chip x={1180} y={440} txt="+ Va (cinco a)" color={S.il6[0]} p={p('cinco_a')} t={26} />
      <Flecha a={[1180, 252]} b={[1180, 318]} p={tramo(p('diez'), 0, 0.8)} color={S.lps[1]} w={7} />
      <Flecha a={[1180, 362]} b={[1180, 418]} p={tramo(p('cinco_a'), 0, 0.8)} color={S.lps[1]} w={7} />
      <Bandera x={1180} y={560} txt="la protrombinasa genera trombina" color={S.il1[0]} p={p('protrombinasa')} t={26} punta="no" />
      <Sale p={p('trombina')} x={1180} y={680} k={2}><Enzima /></Sale>
      <Bandera x={1180} y={780} txt="trombina" color={S.tnf[0]} p={p('trombina')} t={30} punta="no" />
      <Sale p={p('chispa')} x={300} y={770} k={0.35}><Llama /></Sale>
      <Sale p={p('incendio')} x={640} y={730} k={1.3}><Llama /></Sale>
      <Flecha a={[360, 790]} b={[560, 770]} p={tramo(p('incendio'), 0, 0.8)} color={S.tnf[1]} w={8} />
      <Bandera x={460} y={880} txt="una chispa que se convierte en incendio" color={S.tnf[0]} p={p('incendio')} t={28} punta="no" />
      <Bandera x={1050} y={955} txt="por eso vive afuera: solo toca la sangre si hay una rotura" color={S.il6[0]} p={p('afuera')} t={26} punta="no" />
    </g>
  );
};

// ─── 2 · La trombina ─────────────────────────────────────────────────────────
const Trombina: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿quién manda en toda la cascada?" color={S.il6[0]} p={p('manda')} t={34} punta="no" />
    <Sale p={p('trombina')} x={800} y={470} k={3.4}><Enzima /></Sale>
    <Bandera x={800} y={650} txt="trombina" color={S.tnf[0]} p={p('trombina')} t={40} punta="no" />
    <Flecha a={[640, 430]} b={[400, 340]} p={tramo(p('fibrina'), 0, 0.8)} color={S.fibrina[1]} w={8} />
    <Bandera x={250} y={250} txt="fibrinógeno" color={S.fibrina[0]} p={p('fibrinogeno')} t={26} punta="no" />
    <Sale p={p('fibrina')} x={250} y={370} k={1}><Fibrina w={190} /></Sale>
    <Bandera x={250} y={470} txt="fibrina: las hebras del coágulo" color={S.fibrina[0]} p={p('hebras')} t={24} punta="no" />
    <Flecha a={[960, 430]} b={[1230, 340]} p={tramo(p('plaquetas'), 0, 0.8)} color={S.plaq[1]} w={8} />
    <Sale p={p('plaquetas')} x={1300} y={330} k={2.2}><PlaqAct /></Sale>
    <Bandera x={1300} y={450} txt="activa a las plaquetas" color={S.plaq[0]} p={p('plaquetas')} t={24} punta="no" />
    {[['V', 'factor V'], ['VIII', 'factor VIII'], ['XI', 'factor XI'], ['XIII', 'factor XIII']].map(([n, txt], i) => <Chip key={n} x={470 + i * 220} y={800} txt={txt} color={S.lps[0]} p={tramo(p('factores'), i * 0.18, i * 0.18 + 0.5)} t={22} />)}
    <Flecha a={[800, 690]} b={[800, 765]} p={tramo(p('factores'), 0, 0.8)} color={S.lps[1]} w={8} />
    <path d="M980,560 C1180,720 1180,820 1000,800" fill="none" stroke={S.il1[1]} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 14" opacity={tramo(p('ayuda'), 0, 0.5)} />
    <Bandera x={1250} y={715} txt="ayuda a fabricar más trombina" color={S.il1[0]} p={p('ayuda')} t={24} punta="no" />
    <Bandera x={800} y={900} txt="una enzima que se amplifica a sí misma" color={S.il6[0]} p={p('amplifica')} t={30} punta="no" />
    <Bandera x={800} y={970} txt="por eso necesita frenos" color={S.il1[0]} p={p('frenos')} t={30} punta="no" />
  </g>
);

// ─── 3 · Las plaquetas ───────────────────────────────────────────────────────
const Plaquetas: Lamina = ({ p, reloj }) => {
  const ad = easeOut(p('adhieren')), forma = easeOut(p('estrella')), ag = easeOut(p('agregan'));
  return (
    <g>
      <rect x={0} y={700} width={1600} height={300} fill="#8E2A55" /><rect x={0} y={700} width={1600} height={20} fill="#C25A52" />
      <Sale p={p('vwf')} x={520} y={690} k={1}><VWF largo={2} r={-70} /></Sale>
      <Bandera x={520} y={800} txt="factor de von Willebrand" color={S.plaq[0]} p={p('vwf')} t={24} punta="no" />
      <Sale p={p('adhieren')} x={lerp(300, 520, ad)} y={lerp(480, 650, ad)} k={1.7}><Plaqueta /></Sale>
      <Bandera x={300} y={310} txt="se adhieren a la pared dañada" color={S.plaq[0]} p={p('adhieren')} t={26} punta="no" />
      <Sale p={p('forma')} x={760} y={560} k={1.7}><Plaqueta /></Sale>
      <g opacity={tramo(forma, 0, 1)} transform="translate(980,560)"><PlaqAct k={3.2} /></g>
      <Flecha a={[820, 560]} b={[920, 560]} p={tramo(p('forma'), 0, 0.8)} color={S.plaq[1]} w={8} />
      <Bandera x={700} y={410} txt="cambian de forma: de disco a estrella" color={S.plaq[0]} p={p('estrella')} t={24} punta="no" />
      {[0, 1, 2, 3, 4].map((i) => <g key={i} opacity={tramo(ag, i * 0.15, i * 0.15 + 0.4)} transform={`translate(${1100 + (i % 3) * 110 + (i > 2 ? 55 : 0)},${640 + (i > 2 ? -100 : 0)})`}><PlaqAct k={2.4} /></g>)}
      {[[1155, 540], [1265, 540], [1210, 640]].map(([x, y], i) => <path key={i} d={`M${x - 40},${y + 80} L${x + 40},${y + 80}`} stroke={S.fibrina[1]} strokeWidth={8} strokeLinecap="round" opacity={tramo(p('puentes'), i * 0.2, i * 0.2 + 0.4)} />)}
      <Bandera x={1260} y={410} txt="se agregan: puentes de fibrinógeno" color={S.fibrina[0]} p={p('puentes')} t={24} punta="no" />
      <Bandera x={1210} y={820} txt="glucoproteína IIb/IIIa" color={S.plaq[0]} p={p('gp')} t={24} punta="no" />
      <Fibrina x={1210} y={600} w={330} o={tramo(p('fibrina'), 0, 0.5) * 0.9} />
      <Bandera x={800} y={905} txt="un tapón primero, y la fibrina lo refuerza" color={S.il6[0]} p={p('tapon')} t={28} punta="no" />
      <Bandera x={800} y={965} txt="plaquetas y fibrina, trabajando en equipo" color={S.il6[0]} p={p('equipo')} t={26} punta="no" />
      <Bandera x={800} y={95} txt="¿y las plaquetas?" color={S.plaq[0]} p={p('plaquetas')} t={32} punta="no" />
    </g>
  );
};

// ─── 4 · Freno 1: la antitrombina ────────────────────────────────────────────
const FrenoAntitrombina: Lamina = ({ p, reloj }) => {
  const ac = easeOut(p('acelera'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué impide que la trombina siga sin parar?  Los frenos" color={S.il6[0]} p={p('frenos')} t={30} punta="no" />
      <Sale p={p('antitrombina')} x={420} y={430} k={4}><Antitrombina /></Sale>
      <Bandera x={270} y={610} txt="freno 1: antitrombina" color={S.c5a[0]} p={p('freno1')} t={30} punta="no" />
      <Sale p={p('inactiva')} x={900} y={400} k={2.6}><Enzima /></Sale>
      <Sale p={p('diez')} x={1200} y={400} k={2}><Enzima r={20} /></Sale>
      <Bandera x={900} y={520} txt="trombina" color={S.tnf[0]} p={p('inactiva')} t={26} punta="no" />
      <Bandera x={1200} y={520} txt="factor diez a" color={S.nfkb[0]} p={p('diez')} t={26} punta="no" />
      <g opacity={tramo(p('inactiva'), 0.3, 1)}><Cruz x={900} y={400} k={1.6} /><Cruz x={1200} y={400} k={1.6} /></g>
      <Flecha a={[560, 430]} b={[780, 410]} p={tramo(p('inactiva'), 0, 0.8)} color={S.c5a[1]} w={8} />
      <Sale p={p('heparan')} x={540} y={720} k={1.6}><Heparan n={8} /></Sale>
      <Bandera x={540} y={830} txt="sulfato de heparán del glucocálix" color={S.gluco[0]} p={p('heparan')} t={24} punta="no" />
      <Sale p={p('heparanasa')} x={1000} y={720} k={1.5} r={20}><Tijera color={S.menin[0]} corta={0.4} /></Sale>
      <Bandera x={1000} y={830} txt="el mismo que cortó la heparanasa" color={S.menin[0]} p={p('heparanasa')} t={24} punta="no" />
      <Flecha a={[600, 660]} b={[470, 570]} p={tramo(p('acelera'), 0, 0.8)} color={S.gluco[1]} w={8} />
      <Bandera x={1400} y={720} txt="la acelera" color={S.gluco[0]} p={p('acelera')} t={30} punta="no" />
      <Bandera x={1330} y={900} txt="¿ves cómo se conectan?" color={S.il6[0]} p={p('capitulos')} t={24} punta="no" />
      <Bandera x={800} y={965} txt="un glucocálix sano es también un anticoagulante" color={S.gluco[0]} p={p('anticoagulante')} t={30} punta="no" />
    </g>
  );
};

// ─── 5 · Freno 2 y 3: proteína C y TFPI ──────────────────────────────────────
const FrenosDos: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="la trombina tiene otro enemigo en el endotelio" color={S.il6[0]} p={p('enemigo')} t={32} punta="no" />
    <Endo x={330} y={700} w={380} h={110} gluco={1} />
    <Sale p={p('trombomodulina')} x={330} y={560} k={1.9}><g><rect x={-9} y={-30} width={18} height={60} rx={9} fill="#B000C8" /><ellipse cx={0} cy={-40} rx={34} ry={20} fill="#FFAE1A" /></g></Sale>
    <Bandera x={330} y={430} txt="trombomodulina" color={S.lps[0]} p={p('trombomodulina')} t={26} punta="no" />
    <Sale p={p('freno2')} x={330} y={330} k={2.2}><Enzima /></Sale>
    <Bandera x={170} y={330} txt="trombina" color={S.tnf[0]} p={p('freno2')} t={22} punta="no" />
    <Chip x={720} y={470} txt="proteína C activada" color={S.il6[0]} p={p('apaga')} t={26} />
    <Chip x={720} y={560} txt="con EPCR y proteína S" color={S.c5a[0]} p={p('ayuda')} t={22} />
    <Flecha a={[470, 440]} b={[600, 470]} p={tramo(p('apaga'), 0, 0.8)} color={S.il6[1]} w={7} />
    <Chip x={1100} y={400} txt="factor Va" color={S.lps[0]} p={p('cinco_a')} t={26} />
    <Chip x={1100} y={500} txt="factor VIIIa" color={S.lps[0]} p={p('ocho_a')} t={26} />
    <g opacity={tramo(p('cinco_a'), 0.4, 1)}><Cruz x={1290} y={400} k={0.8} /></g><g opacity={tramo(p('ocho_a'), 0.4, 1)}><Cruz x={1290} y={500} k={0.8} /></g>
    <Bandera x={1300} y={300} txt="freno 2" color={S.il6[0]} p={p('freno2')} t={30} punta="no" />
    <Sale p={p('tfpi')} x={1100} y={780} k={1.2}><g><rect x={-90} y={-40} width={180} height={80} rx={40} fill={S.c5a[0]} /><rect x={-86} y={-44} width={172} height={72} rx={36} fill={S.c5a[1]} /><text y={10} textAnchor="middle" fontSize={34} fontWeight={800} fill="#FFF">TFPI</text></g></Sale>
    <Sale p={p('freno3')} x={1100} y={900} k={1}><g><FT x={-60} k={1.2} /><Chip x={50} y={0} txt="VIIa" color={S.c5a[0]} t={22} /></g></Sale>
    <Bandera x={560} y={820} txt="freno 3: frena el complejo factor tisular + VIIa" color={S.c5a[0]} p={p('disparo')} t={26} punta="no" />
    <Bandera x={560} y={920} txt="tres frenos, tres lugares distintos" color={S.il6[0]} p={p('tres')} t={32} punta="no" />
  </g>
);

// ─── 6 · Fibrinólisis y laboratorio ──────────────────────────────────────────
const Limpieza: Lamina = ({ p, reloj }) => {
  const pl = easeOut(p('plasmina'));
  return (
    <g>
      <Bandera x={420} y={95} txt="¿cómo se limpia el coágulo?" color={S.il6[0]} p={p('limpia')} t={30} punta="no" />
      <Fibrina x={420} y={520} w={380} o={1 - 0.7 * pl} />
      <Chip x={170} y={250} txt="tPA" color={S.il6[0]} p={p('tpa')} t={26} />
      <Flecha a={[230, 270]} b={[330, 380]} p={tramo(p('plasmina'), 0, 0.6)} color={S.il6[1]} w={7} />
      <Sale p={p('plasmina')} x={420} y={400} k={1.7} r={-20}><Tijera corta={pl} color={S.il1[0]} /></Sale>
      <Bandera x={520} y={330} txt="plasmina" color={S.il1[0]} p={p('plasmina')} t={26} punta="no" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={260 + i * 56 + Math.sin(reloj / 500 + i) * 4} y={620 + (i % 2) * 30} width={34} height={14} rx={7} fill={S.fibrina[1]} opacity={tramo(p('dimero'), i * 0.1, i * 0.1 + 0.4)} />)}
      <Bandera x={420} y={730} txt="restos: dímero D" color={S.fibrina[0]} p={p('dimero')} t={26} punta="no" />
      <Chip x={650} y={250} txt="PAI-1" color={S.il1[0]} p={p('pai')} t={26} />
      <g opacity={tramo(p('pai'), 0.4, 1)}><Cruz x={430} y={250} k={0.9} /></g>
      <Bandera x={1190} y={95} txt="y el laboratorio mide todo esto" color={S.c5a[0]} p={p('laboratorio')} t={30} punta="no" />
      <Sale p={p('protrombina')} x={1040} y={390} k={1.1}><TuboEnsayo color="#FFE9B8" nivel={0.6} reloj={reloj} /></Sale>
      <Bandera x={1040} y={600} txt="tiempo de protrombina" color={S.lps[0]} p={p('protrombina')} t={24} punta="no" />
      <Bandera x={1040} y={665} txt="vía extrínseca y común" color={S.lps[0]} p={p('extrinseca')} t={22} punta="no" />
      <Bandera x={1040} y={730} txt="factores 7, 10, 5, 2 y 1" color={S.lps[0]} p={p('f7')} t={22} punta="no" />
      <Sale p={p('plastina')} x={1380} y={390} k={1.1}><TuboEnsayo color="#FFD0C8" nivel={0.6} reloj={reloj} /></Sale>
      <Bandera x={1380} y={600} txt="tromboplastina parcial" color={S.il6[0]} p={p('plastina')} t={24} punta="no" />
      <Bandera x={1380} y={665} txt="vía intrínseca y común" color={S.il6[0]} p={p('intrinseca')} t={22} punta="no" />
      <Bandera x={1380} y={730} txt="factores 12, 11, 9, 8 y 10" color={S.il6[0]} p={p('f12')} t={22} punta="no" />
      <Bandera x={1210} y={900} txt="dos pruebas, dos caminos" color={S.il6[0]} p={p('pruebas')} t={32} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Equilibrio, Disparo, Trombina, Plaquetas, FrenoAntitrombina, FrenosDos, Limpieza];
export default LAMINAS;
