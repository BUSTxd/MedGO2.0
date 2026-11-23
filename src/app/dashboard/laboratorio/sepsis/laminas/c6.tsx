'use client';
// Capítulo 6 · Los mensajeros: IL-1, IL-6, TNF-α, complemento y C5a

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, Barra, C5a, Cerebro, Chispa, Cuerpo, Endo, Enzima, Flecha, Higado, Histamina, Il1, Il6, Jeringa, Macrofago, Manometro, Medula, NO, Neutrofilo, Plaqueta, S, Sale, Termometro, Tnf, Txt, Vaso, easeOut, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

// ─── 0 · La orquesta ─────────────────────────────────────────────────────────
const Orquesta: Lamina = ({ p, reloj }) => {
  const msj: { clave: string; el: ReactNode; txt: string; y: number }[] = [
    { clave: 'tnf', el: <Tnf k={1.6} />, txt: 'TNF-α', y: 190 },
    { clave: 'il1', el: <Il1 k={1.7} />, txt: 'IL-1', y: 300 },
    { clave: 'il6', el: <Il6 k={1.8} />, txt: 'IL-6', y: 410 },
    { clave: 'il8', el: <Chispa tono={S.c5a} n={5} k={1.7} reloj={reloj} />, txt: 'IL-8', y: 520 },
    { clave: 'il12', el: <Chispa tono={S.nfkb} n={6} k={1.7} reloj={reloj} fase={1} />, txt: 'IL-12', y: 630 },
    { clave: 'il18', el: <Chispa tono={S.lps} n={4} k={1.7} reloj={reloj} fase={2} />, txt: 'IL-18', y: 740 },
    { clave: 'ifn', el: <Chispa tono={S.gluco} n={7} k={1.7} reloj={reloj} fase={3} />, txt: 'interferones', y: 850 },
  ];
  const efectos: { clave: string; el: ReactNode; txt: string; y: number }[] = [
    { clave: 'fiebre', el: <Termometro k={0.2} val={0.9} />, txt: 'fiebre', y: 220 },
    { clave: 'dilata', el: <g><rect x={-50} y={-14} width={100} height={28} rx={14} fill="#B02FA0" /><rect x={-46} y={-10} width={92} height={20} rx={10} fill="#7A1E3A" /></g>, txt: 'dilata los vasos', y: 400 },
    { clave: 'atrae', el: <Neutrofilo k={0.34} />, txt: 'atrae neutrófilos', y: 600 },
    { clave: 'activa', el: <circle r={24} fill={S.linfo[1]} />, txt: 'activa linfocitos', y: 800 },
  ];
  return (
    <g>
      <Sale p={p('mensajeros')} x={300} y={540} k={1.35}><Macrofago /></Sale>
      {msj.map((m, i) => (
        <g key={m.clave}>
          <Flecha a={[420, 540]} b={[700, m.y]} c={[540, m.y + 20]} p={tramo(p(m.clave), 0, 0.7)} color={S.tnf[1]} w={4} cabeza={false} />
          <Sale p={p(m.clave)} x={760 + Math.sin(reloj / 500 + i) * 4} y={m.y}>{m.el}</Sale>
          <Txt x={870} y={m.y + 10} txt={m.txt} t={26} p={p(m.clave)} ancla="start" />
        </g>
      ))}
      {efectos.map((e) => (
        <g key={e.clave}>
          <Sale p={p(e.clave)} x={1260} y={e.y}>{e.el}</Sale>
          <Bandera x={1420} y={e.y + 60} txt={e.txt} color={S.tnf[0]} p={p(e.clave)} t={22} punta="no" />
        </g>
      ))}
      <Bandera x={800} y={95} txt="los mensajeros: cada uno toca un instrumento distinto" color={S.il6[0]} p={p('orquesta')} t={30} punta="no" />
      <Bandera x={800} y={955} txt="la sepsis es esa orquesta sin director" color={S.il1[0]} p={p('director')} t={34} punta="no" />
    </g>
  );
};

// ─── 1 · TNF-α: el primero en llegar ─────────────────────────────────────────
const TnfL: Lamina = ({ p, reloj }) => {
  const choque = easeOut(p('choque'));
  return (
    <g>
      <Sale p={p('tnf')} x={330} y={410} k={4.4}><Tnf /></Sale>
      <Bandera x={330} y={640} txt="TNF-α" color={S.tnf[0]} p={p('tnf')} t={44} punta="no" />
      <Sale p={p('activa')} x={680} y={270} k={0.5}><Endo gluco={0.5} activa={1} /></Sale>
      <Bandera x={680} y={340} txt="activa el endotelio" color={S.endo[0]} p={p('activa')} t={24} punta="no" />
      <g opacity={tramo(p('dilata'), 0, 0.5)}><rect x={620} y={420} width={120} height={20 + 40 * easeOut(p('dilata'))} rx={30} fill="#B02FA0" /></g>
      <Bandera x={680} y={560} txt="dilata los vasos" color={S.nfkb[0]} p={p('dilata')} t={24} punta="no" />
      <Sale p={p('fiebre')} x={680} y={730} k={0.3}><Termometro val={0.9} /></Sale>
      <Bandera x={680} y={840} txt="da fiebre" color={S.il1[0]} p={p('fiebre')} t={24} punta="no" />
      <Sale p={p('experimento')} x={1000} y={300} k={1.5} r={-35}><Jeringa liquido="#FF8A1E" /></Sale>
      <Bandera x={1000} y={110} txt="un experimento clásico: dosis altas" color={S.tnf[0]} p={p('experimento')} t={26} punta="no" />
      <Sale p={p('molecula')} x={1260} y={570} k={0.75}><Cuerpo /></Sale>
      <Sale p={p('molecula')} x={1010} y={760} k={1.2}><Manometro x={0} y={0} val={lerp(0.55, 0.12, choque)} /></Sale>
      <Bandera x={1200} y={940} txt="una sola molécula y el cuerpo entra en choque" color={S.il1[0]} p={p('choque')} t={26} punta="no" />
      <Bandera x={330} y={130} txt="uno de los primeros sospechosos" color={S.il6[0]} p={p('sospechosos')} t={26} punta="no" />
    </g>
  );
};

// ─── 2 · IL-1: la gemela ─────────────────────────────────────────────────────
const Gemelas: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('il1')} x={380} y={400} k={4}><Il1 /></Sale>
    <Bandera x={380} y={600} txt="IL-1" color={S.il1[0]} p={p('il1')} t={42} punta="no" />
    <Sale p={p('gemela')} x={800} y={400} k={3}><text textAnchor="middle" fontSize={60} fontWeight={800} fill="var(--se-ambar)" y={20}>≈</text></Sale>
    <Sale p={p('gemela')} x={1220} y={400} k={4}><Tnf /></Sale>
    <Bandera x={1220} y={600} txt="TNF-α" color={S.tnf[0]} p={p('gemela')} t={42} punta="no" />
    <Sale p={p('fiebre')} x={550} y={760} k={0.26}><Termometro val={0.9} /></Sale>
    <Bandera x={550} y={850} txt="fiebre" color={S.il1[0]} p={p('fiebre')} t={24} punta="no" />
    <Sale p={p('endotelio')} x={800} y={740} k={0.5}><Endo gluco={0.4} activa={1} /></Sale>
    <Bandera x={800} y={850} txt="activa el endotelio" color={S.endo[0]} p={p('endotelio')} t={24} punta="no" />
    <Sale p={p('inos')} x={1050} y={750} k={1.5}><Enzima /></Sale>
    <Bandera x={1050} y={850} txt="induce la iNOS" color={S.no[0]} p={p('inos')} t={24} punta="no" />
    <Flecha a={[1110, 750]} b={[1230, 750]} p={tramo(p('no'), 0, 0.8)} color={S.no[1]} w={7} />
    <Sale p={p('no')} x={1290} y={750} k={2}><NO /></Sale>
    <Bandera x={1300} y={850} txt="óxido nítrico" color={S.no[0]} p={p('no')} t={24} punta="no" />
    <Bandera x={800} y={110} txt="¿por qué dos moléculas tan parecidas?" color={S.il6[0]} p={p('juntas')} t={32} punta="no" />
    <Bandera x={800} y={950} txt="trabajan juntas: gemelas que se potencian" color={S.il6[0]} p={p('potencian')} t={32} punta="no" />
  </g>
);

// ─── 3 · La fiebre ───────────────────────────────────────────────────────────
const Fiebre: Lamina = ({ p, reloj }) => {
  const ajuste = easeOut(p('ajuste'));
  return (
    <g>
      <Vaso x={330} y={330} largo={620} ancho={150} ang={0} reloj={reloj} flujo={6} o={tramo(p('citocinas'), 0, 0.5)} />
      {[<Il1 key="a" k={1.1} />, <Tnf key="b" k={1.1} />, <Il6 key="c" k={1.2} />].map((el, i) => <g key={i} opacity={tramo(p('citocinas'), i * 0.2, i * 0.2 + 0.5)} transform={`translate(${lerp(120, 600, corre(reloj, i, 3, 3000))},${330 + Math.sin(reloj / 400 + i) * 16})`}>{el}</g>)}
      <Bandera x={330} y={440} txt="IL-1β · TNF-α · IL-6" color={S.tnf[0]} p={p('citocinas')} t={24} punta="no" />
      <Sale p={p('hipotalamo')} x={880} y={450} k={1.7}><Cerebro /></Sale>
      <circle cx={870} cy={440} r={30 + 5 * Math.sin(reloj / 300)} fill={S.il1[1]} opacity={0.5 * tramo(p('cox'), 0, 0.5)} />
      <Bandera x={880} y={270} txt="hipotálamo: el termostato" color={S.il1[0]} p={p('hipotalamo')} t={26} punta="no" />
      <Sale p={p('cox')} x={1190} y={300} k={1.5}><Enzima /></Sale>
      <Bandera x={1190} y={380} txt="COX-2" color={S.lps[0]} p={p('cox')} t={26} punta="no" />
      <Sale p={p('pge2')} x={1190} y={520} k={1.6}><Chispa tono={S.il6} n={5} reloj={reloj} /></Sale>
      <Bandera x={1190} y={600} txt="prostaglandina E2" color={S.il6[0]} p={p('pge2')} t={26} punta="no" />
      <Flecha a={[1190, 330]} b={[1190, 480]} p={tramo(p('pge2'), 0, 0.8)} color={S.il6[1]} w={6} />
      <Bandera x={880} y={700} txt="sube el punto de ajuste de la temperatura" color={S.il1[0]} p={p('ajuste')} t={24} punta="no" />
      <Sale p={p('joven')} x={430} y={760} k={0.3}><Termometro val={lerp(0.3, 0.93, ajuste)} /></Sale>
      <Bandera x={430} y={880} txt="el joven: 39,2 °C" color={S.il1[0]} p={p('t39')} t={26} punta="no" />
      <Sale p={p('abuela')} x={1280} y={760} k={0.3}><Termometro val={0.28} /></Sale>
      <Bandera x={1280} y={880} txt="la abuela: 35,8 °C" color={S.c5a[0]} p={p('t35')} t={26} punta="no" />
      <Bandera x={800} y={965} txt="en la sepsis, el frío también es una mala señal" color={S.c5a[0]} p={p('frio')} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · IL-6 y el hígado ────────────────────────────────────────────────────
const Higado6: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={100} txt="¿cómo sabe el laboratorio que hay inflamación?" color={S.il6[0]} p={p('inflamacion')} t={32} punta="no" />
    <Sale p={p('higado')} x={430} y={470} k={0.55}><Higado /></Sale>
    <Bandera x={430} y={690} txt="por el hígado" color={S.il1[0]} p={p('higado')} t={32} punta="no" />
    <Sale p={p('il6')} x={190} y={330} k={2}><Il6 /></Sale>
    <Flecha a={[250, 350]} b={[330, 420]} p={tramo(p('hepatocitos'), 0, 0.8)} color={S.il6[1]} w={7} />
    <Bandera x={190} y={250} txt="IL-6" color={S.il6[0]} p={p('il6')} t={28} punta="no" />
    <Bandera x={430} y={770} txt="los hepatocitos fabrican proteínas de fase aguda" color={S.il6[0]} p={p('hepatocitos')} t={24} punta="no" />
    {Array.from({ length: 7 }, (_, i) => { const u = corre(reloj, i, 7, 3200); return <circle key={i} cx={lerp(560, 850, u)} cy={430 + Math.sin(u * 7 + i) * 40} r={14} fill={S.il1[1]} opacity={tramo(p('reactiva'), 0, 0.4) * (1 - u * 0.5)} />; })}
    <Bandera x={760} y={330} txt="proteína C reactiva" color={S.il1[0]} p={p('reactiva')} t={28} punta="no" />
    <Barra x={930} y={400} w={430} h={42} val={186 / 230} color={S.il1[1]} txt="el joven" valor="186 mg/L" p={p('c186')} />
    <Barra x={930} y={530} w={430} h={42} val={215 / 230} color={S.il1[1]} txt="la abuela" valor="215 mg/L" p={p('c215')} />
    <Barra x={930} y={660} w={430} h={42} val={5 / 230} color={S.gluco[1]} txt="lo normal" valor="< 5 mg/L" p={p('normal')} />
    <Bandera x={800} y={900} txt="el hígado leyó el mensaje y respondió" color={S.il6[0]} p={p('leyo')} t={32} punta="no" />
  </g>
);

// ─── 5 · La médula se vacía ──────────────────────────────────────────────────
const MedulaL: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('medula')} x={420} y={540} k={0.7}><Medula /></Sale>
    <Bandera x={420} y={780} txt="médula ósea" color={S.il1[0]} p={p('medula')} t={28} punta="no" />
    <Vaso x={1130} y={500} largo={900} ancho={250} ang={0} reloj={reloj} flujo={8} o={tramo(p('suelta'), 0, 0.5)} />
    {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 4000); return <g key={i} opacity={tramo(p('suelta'), i * 0.1, i * 0.1 + 0.4)} transform={`translate(${lerp(560, 1500, u)},${500 + Math.sin(i * 2 + u * 5) * 50})`}><Neutrofilo k={0.55} activo={i % 2 ? 0.3 : 0} /></g>; })}
    <Bandera x={900} y={330} txt="suelta neutrófilos a la sangre" color={S.neutro[0]} p={p('suelta')} t={26} punta="no" />
    <Bandera x={1130} y={700} txt="incluso inmaduros (formas jóvenes)" color={S.il6[0]} p={p('inmaduros')} t={24} punta="no" />
    <Txt x={1130} y={170} txt="17 200 leucocitos / µL" t={42} p={p('c17200')} color="var(--se-sangre)" />
    <Txt x={1130} y={235} txt="89 % neutrófilos" t={36} p={p('n89')} color="var(--se-sangre)" />
    <Bandera x={420} y={900} txt="desviación a la izquierda" color={S.il6[0]} p={p('desviacion')} t={30} punta="no" />
    <Bandera x={1130} y={820} txt="la IL-8 los atrae hacia el foco" color={S.il1[0]} p={p('il8')} t={26} punta="no" />
    <Bandera x={1130} y={930} txt="se vacía la reserva de defensas" color={S.il1[0]} p={p('reserva')} t={30} punta="no" />
  </g>
);

// ─── 6 · El complemento ──────────────────────────────────────────────────────
const Complemento: Lamina = ({ p, reloj }) => {
  const cae = easeOut(p('cascada'));
  return (
    <g>
      <Bandera x={800} y={100} txt="otro sistema de alarma que no es una célula: el complemento" color={S.c5a[0]} p={p('complemento')} t={30} punta="no" />
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={tramo(p('cascada'), i * 0.2, i * 0.2 + 0.4)} x={300 + i * 120} y={260 + i * 100}><g><rect x={-46} y={-30} width={92} height={60} rx={20} fill={S.c5a[0]} /><rect x={-44} y={-34} width={88} height={56} rx={18} fill={S.c5a[1]} /><ellipse cx={-20} cy={-20} rx={12} ry={5} fill="#FFF" opacity={0.6} /></g></Sale>)}
      <Flecha a={[360, 320]} b={[650, 610]} p={tramo(p('cascada'), 0.3, 1)} color={S.c5a[1]} w={6} cabeza={false} />
      <Bandera x={420} y={470} txt="proteínas de la sangre en cascada" color={S.c5a[0]} p={p('cascada')} t={24} punta="no" />
      <Sale p={p('c3a')} x={720} y={560} k={1.6}><Chispa tono={S.c5a} n={5} reloj={reloj} /></Sale>
      <Bandera x={720} y={640} txt="C3a" color={S.c5a[0]} p={p('c3a')} t={30} punta="no" />
      <Sale p={p('c5a')} x={920} y={560} k={1.4}><C5a /></Sale>
      <Bandera x={920} y={640} txt="C5a" color={S.c5a[0]} p={p('c5a')} t={30} punta="no" />
      <Bandera x={820} y={730} txt="anafilatoxinas" color={S.c5a[0]} p={p('fragmentos')} t={28} punta="no" />
      <g opacity={tramo(p('dilatan'), 0, 0.4)}><rect x={1150} y={250} width={200} height={26 + 34 * easeOut(p('dilatan'))} rx={30} fill="#B02FA0" /></g>
      <Bandera x={1250} y={370} txt="dilatan los vasos" color={S.nfkb[0]} p={p('dilatan')} t={24} punta="no" />
      <Sale p={p('permeabilidad')} x={1250} y={500} k={1}>
        {[[-60, 0], [0, 20], [60, -10]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy + Math.sin(reloj / 400 + i) * 6} r={14} fill={S.il1[1]} />)}
      </Sale>
      <Bandera x={1250} y={570} txt="más permeabilidad" color={S.il1[0]} p={p('permeabilidad')} t={24} punta="no" />
      <Sale p={p('mastocitos')} x={1250} y={690} k={1.2}><Histamina /></Sale>
      <Bandera x={1250} y={770} txt="activan a los mastocitos" color={S.tnf[0]} p={p('mastocitos')} t={24} punta="no" />
      <Sale p={p('atrae')} x={1380} y={900} k={0.5}><Neutrofilo /></Sale>
      <Flecha a={[960, 620]} b={[1300, 880]} c={[1100, 820]} p={tramo(p('atrae'), 0, 0.9)} color={S.c5a[1]} w={6} />
      <Bandera x={900} y={930} txt="la C5a atrae neutrófilos como un imán" color={S.c5a[0]} p={p('iman')} t={26} punta="no" />
      <Bandera x={420} y={880} txt="un sistema hecho para dar la alarma" color={S.il1[0]} p={p('alarma')} t={26} punta="no" />
    </g>
  );
};

// ─── 7 · C5a en exceso ───────────────────────────────────────────────────────
const C5aExceso: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={100} txt="un imán demasiado fuerte deja de funcionar" color={S.c5a[0]} p={p('iman')} t={32} punta="no" />
    {Array.from({ length: 9 }, (_, i) => <g key={i} opacity={tramo(p('c5a'), i * 0.06, i * 0.06 + 0.4)} transform={`translate(${200 + (i % 3) * 110 + Math.sin(reloj / 500 + i) * 8},${330 + Math.floor(i / 3) * 110})`}><C5a k={1.1} /></g>)}
    <Bandera x={310} y={190} txt="C5a muy alta" color={S.c5a[0]} p={p('c5a')} t={28} punta="no" />
    <Sale p={p('receptor')} x={800} y={500} k={2.2}><Neutrofilo cebado={0} activo={0} /></Sale>
    <Bandera x={800} y={720} txt="el neutrófilo pierde su receptor" color={S.neutro[0]} p={p('receptor')} t={26} punta="no" />
    <Sale p={p('torpe')} x={1010} y={380} k={1.3}><text textAnchor="middle" fontSize={50} fontWeight={800} fill="var(--se-violeta)">z z z</text></Sale>
    <Bandera x={800} y={800} txt="torpe: fagocita y mata peor" color={S.il6[0]} p={p('fagocita')} t={28} punta="no" />
    <Sale p={p('coagulacion')} x={1340} y={420} k={1}><g><PlaqueG /></g></Sale>
    <Bandera x={1340} y={560} txt="activa la coagulación" color={S.fibrina[0]} p={p('coagulacion')} t={26} punta="no" />
    {Array.from({ length: 12 }, (_, i) => <g key={i} opacity={tramo(p('demasiados'), i * 0.05, i * 0.05 + 0.3)} transform={`translate(${1100 + (i % 4) * 120},${650 + Math.floor(i / 4) * 80})`}>{[<Tnf key="a" />, <Il1 key="b" />, <Il6 key="c" />][i % 3]}</g>)}
    <Bandera x={1250} y={900} txt="demasiados mensajeros, ninguno bien regulado" color={S.il1[0]} p={p('demasiados')} t={26} punta="no" />
    <Bandera x={420} y={900} txt="esa es la tormenta" color={S.il1[0]} p={p('tormenta')} t={34} punta="no" />
    <Bandera x={420} y={970} txt="y quien más la sufre: el endotelio" color={S.endo[0]} p={p('endotelio')} t={26} punta="no" />
  </g>
);
const PlaqueG = () => <g><Plaqueta k={1.3} /></g>;

const LAMINAS: Lamina[] = [Orquesta, TnfL, Gemelas, Fiebre, Higado6, MedulaL, Complemento, C5aExceso];
export default LAMINAS;
