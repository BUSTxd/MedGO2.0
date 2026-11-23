'use client';
// Capítulo 10 · Inmunotrombosis

import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Barra, Cerebro, Cuerpo, Diplococo, Endo, Fibrina, Hematie, Net, Neutrofilo, Pierna, Plaqueta, PlaqAct, Rinon, Pulmones, S, Sale, Tlr4, Vaso, easeOut, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

// ─── 0 · Un coágulo con propósito ────────────────────────────────────────────
const Proposito: Lamina = ({ p, reloj }) => {
  const q = easeOut(p('microtrombo'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y si la coagulación no fuera solo un problema?" color={S.il6[0]} p={p('coagulacion')} t={32} punta="no" />
      <Vaso x={800} y={500} largo={1700} ancho={420} ang={0} reloj={reloj} flujo={6}>
        <g opacity={tramo(p('atrapa'), 0, 0.5)}>
          <Fibrina x={0} y={0} w={380 * (0.4 + 0.6 * q)} /><Fibrina x={0} y={20} w={340} rota={25} /><Fibrina x={0} y={-20} w={340} rota={-25} />
          {[[-60, -20], [40, 30], [-10, 40], [70, -30]].map(([cx, cy], i) => <Diplococo key={i} x={cx + Math.sin(reloj / 500 + i) * 4} y={cy} k={0.38} r={i * 40} reloj={reloj} fase={i} pili={0.3} />)}
          {[[-110, 0], [110, -10]].map(([cx, cy], i) => <Plaqueta key={i} x={cx} y={cy} k={0.6} />)}
        </g>
      </Vaso>
      <Bandera x={420} y={270} txt="es parte de la inmunidad innata" color={S.il6[0]} p={p('innata')} t={28} punta="no" />
      <Bandera x={800} y={770} txt="un microtrombo atrapa a los microbios en una red de fibrina" color={S.fibrina[0]} p={p('fibrina')} t={26} punta="no" />
      <Bandera x={1250} y={270} txt="frena su diseminación" color={S.gluco[0]} p={p('diseminacion')} t={28} punta="no" />
      <Bandera x={420} y={880} txt="el coágulo funciona como una trampa" color={S.fibrina[0]} p={p('trampa')} t={28} punta="no" />
      <Bandera x={1180} y={880} txt="inmunotrombosis: trombosis que defiende" color={S.net[0]} p={p('inmunotrombosis')} t={30} punta="no" />
    </g>
  );
};

// ─── 1 · Las NET ─────────────────────────────────────────────────────────────
const Nets: Lamina = ({ p, reloj }) => {
  const red = easeOut(p('red'));
  return (
    <g>
      <Sale p={p('neutrofilo')} x={500} y={520} k={1.8 * (1 + 0.2 * easeOut(p('hincha')))} ><Neutrofilo activo={1} /></Sale>
      <g opacity={tramo(p('red'), 0, 0.3)}><Net x={800} y={520} k={1.9} p={red} R={300} sem={2} /></g>
      {[[900, 380], [1090, 560], [820, 680], [1180, 400], [700, 760]].map(([cx, cy], i) => (
        <Bacilo key={i} x={cx + Math.sin(reloj / 600 + i) * 5} y={cy} k={0.55} r={i * 50} reloj={reloj} o={tramo(p('atrapan'), i * 0.1, i * 0.1 + 0.4)} />
      ))}
      <Bandera x={500} y={290} txt="¿y si no puede comerse a todas las bacterias?" color={S.il6[0]} p={p('comerse')} t={24} punta="no" />
      <Bandera x={500} y={760} txt="se hincha" color={S.net[0]} p={p('hincha')} t={28} punta="no" />
      <Bandera x={950} y={150} txt="expulsa su propio ADN, como una red" color={S.net[0]} p={p('adn')} t={28} punta="no" />
      <Bandera x={1330} y={620} txt="histonas" color={S.il6[0]} p={p('histonas')} t={26} punta="no" />
      <Bandera x={1330} y={700} txt="elastasa" color={S.tnf[0]} p={p('elastasa')} t={26} punta="no" />
      <Bandera x={1330} y={780} txt="mieloperoxidasa" color={S.gluco[0]} p={p('mieloperoxidasa')} t={26} punta="no" />
      <Bandera x={1200} y={230} txt="NET: trampas extracelulares de neutrófilos" color={S.net[0]} p={p('nets')} t={26} punta="no" />
      <Bandera x={800} y={930} txt="una célula que se sacrifica para tender una red" color={S.net[0]} p={p('sacrifica')} t={30} punta="no" />
    </g>
  );
};

// ─── 2 · Plaquetas centinela ─────────────────────────────────────────────────
const Centinela: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('plaquetas')} x={800} y={520} k={2.2}><Neutrofilo activo={0.6} /></Sale>
    <Bacilo x={1230} y={470} k={0.9} reloj={reloj} o={tramo(p('detectan'), 0, 0.5)} />
    <Bacilo x={410} y={700} k={0.9} r={40} reloj={reloj} o={tramo(p('detectan'), 0, 0.5)} />
    {Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + reloj / 3000, d = lerp(420, 190, easeOut(tramo(p('pegan'), i * 0.06, i * 0.06 + 0.5))) + Math.sin(reloj / 300 + i) * 8;
      return <g key={i} opacity={tramo(p('pegan'), i * 0.06, i * 0.06 + 0.3)} transform={`translate(${800 + Math.cos(a) * d},${520 + Math.sin(a) * d * 0.8})`}><PlaqAct k={1.4} /></g>;
    })}
    {[[1180, 280], [1250, 330]].map(([x, y], i) => <Sale key={i} p={p('tlr4')} x={x} y={y} k={0.8}><Tlr4 cola={false} md2={1} reloj={reloj} /></Sale>)}
    <Bandera x={1220} y={170} txt="las plaquetas tienen TLR4" color={S.plaq[0]} p={p('tlr4')} t={26} punta="no" />
    <Bandera x={1200} y={650} txt="detectan a las bacterias" color={S.menin[0]} p={p('detectan')} t={26} punta="no" />
    <Bandera x={420} y={280} txt="se pegan a los neutrófilos y a los microbios" color={S.plaq[0]} p={p('pegan')} t={26} punta="no" />
    <Bandera x={800} y={850} txt="estimulan la salida de NET, como abejas sobre el invasor" color={S.net[0]} p={p('abejas')} t={26} punta="no" />
    <Bandera x={800} y={940} txt="plaqueta centinela" color={S.plaq[0]} p={p('centinela')} t={34} punta="no" />
    <Bandera x={800} y={95} txt="las plaquetas no solo coagulan" color={S.il6[0]} p={p('nets')} t={30} punta="no" />
  </g>
);

// ─── 3 · La red también coagula ──────────────────────────────────────────────
const RedCoagula: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="pero esa red tiene un efecto secundario" color={S.il1[0]} p={p('efecto')} t={32} punta="no" />
    <g opacity={0.9}><Net x={500} y={500} k={1.5} p={1} R={260} sem={3} /></g>
    <Bandera x={500} y={760} txt="ADN e histonas" color={S.net[0]} p={p('histonas')} t={28} punta="no" />
    {[[900, 420], [1000, 560], [880, 640]].map(([x, y], i) => <Sale key={i} p={tramo(p('plaquetas'), i * 0.15, i * 0.15 + 0.5)} x={x} y={y} k={1.7}><PlaqAct /></Sale>)}
    <Bandera x={950} y={760} txt="activan a las plaquetas" color={S.plaq[0]} p={p('plaquetas')} t={26} punta="no" />
    <Sale p={p('doce')} x={1230} y={420} k={1}><g><circle r={56} fill={S.lps[0]} /><circle cx={-3} cy={-3} r={50} fill={S.lps[1]} /><text y={12} textAnchor="middle" fontSize={34} fontWeight={800} fill="#FFF">XII</text></g></Sale>
    <Bandera x={1230} y={520} txt="y al factor 12" color={S.lps[0]} p={p('doce')} t={26} punta="no" />
    <Sale p={p('danan')} x={1250} y={720} k={0.8}><Endo w={300} h={90} gluco={0} activa={1} /></Sale>
    <Bandera x={1250} y={820} txt="dañan al endotelio" color={S.endo[0]} p={p('danan')} t={26} punta="no" />
    <Bandera x={800} y={900} txt="la red que atrapa bacterias también coagula la sangre" color={S.fibrina[0]} p={p('coagula')} t={30} punta="no" />
    <Bandera x={800} y={970} txt="una defensa que empieza a producir trombosis" color={S.il1[0]} p={p('trombosis')} t={28} punta="no" />
  </g>
);

// ─── 4 · Cuando se generaliza ────────────────────────────────────────────────
const Generaliza: Lamina = ({ p, reloj }) => {
  const g = easeOut(p('generalizada'));
  return (
    <g>
      <Sale p={p('rincon')} x={330} y={440} k={0.65}><Cuerpo /></Sale>
      <Sale p={p('trampa')} x={330} y={500} k={0.9}><g><Fibrina w={110} /><Diplococo k={0.3} reloj={reloj} pili={0.2} /></g></Sale>
      <Bandera x={330} y={800} txt="en un rincón, la trampa sirve" color={S.gluco[0]} p={p('trampa')} t={26} punta="no" />
      <path d="M640,160 L640,860" stroke="var(--cit-texto-2)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.4 * tramo(p('sepsis'), 0, 0.5)} />
      <Sale p={p('sepsis')} x={1090} y={470} k={0.9}><Cuerpo /></Sale>
      {[[1090, 330], [1040, 450], [1140, 450], [1090, 560], [1030, 640], [1150, 640]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14 + 3 * Math.sin(reloj / 300 + i)} fill={S.fibrina[1]} opacity={g * 0.95} />)}
      {[[1330, 330, <Cerebro key="c" k={0.4} />], [1380, 560, <Rinon key="r" k={0.45} />], [1330, 780, <Pulmones key="p" k={0.35} />]].map(([x, y, el], i) => <g key={i} opacity={tramo(p('organos'), i * 0.2, i * 0.2 + 0.5)}><g transform={`translate(${x as number},${y as number})`}>{el}</g><circle cx={(x as number) - 30} cy={(y as number) - 30} r={14} fill={S.fibrina[1]} /></g>)}
      <Bandera x={1090} y={160} txt="en la sepsis la respuesta es generalizada" color={S.il1[0]} p={p('generalizada')} t={28} punta="no" />
      <Bandera x={1090} y={860} txt="microtrombos en todos los órganos a la vez" color={S.fibrina[0]} p={p('microtrombos')} t={26} punta="no" />
      <Bandera x={800} y={940} txt="obstruyen los vasos más pequeños: los tejidos de atrás pierden su riego" color={S.il1[0]} p={p('obstruyen')} t={26} punta="no" />
      <Bandera x={800} y={95} txt="de defensa local a isquemia sistémica" color={S.il6[0]} p={p('sistemica')} t={34} punta="no" />
    </g>
  );
};

// ─── 5 · Petequias con plaquetas normales ────────────────────────────────────
const Petequias: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('petequias')} x={340} y={500} k={0.8}><Pierna p={p('petequias')} /></Sale>
    <Bandera x={340} y={150} txt="el joven: petequias" color={S.il1[0]} p={p('joven')} t={30} punta="abajo" />
    <Barra x={680} y={190} w={460} h={44} val={0.82} color={S.plaq[1]} txt="plaquetas del joven" valor="165 000 · normales" p={p('plaquetas')} />
    <Bandera x={900} y={330} txt="no es por falta de plaquetas" color={S.plaq[0]} p={p('normales')} t={30} punta="no" />
    <Vaso x={1050} y={580} largo={900} ancho={220} ang={0} reloj={reloj} flujo={6} o={tramo(p('capilares'), 0, 0.5)} />
    <Endo x={1000} y={760} w={300} h={90} gluco={0} activa={1} muere={tramo(p('citocinas'), 0, 1) * 0.5} o={tramo(p('endotelio'), 0, 0.5)} />
    {Array.from({ length: 5 }, (_, i) => { const u = corre(reloj, i, 5, 3000); return <g key={i} opacity={tramo(p('eritrocitos'), 0, 0.4) * (1 - u * 0.3)} transform={`translate(${900 + i * 55},${lerp(690, 900, u)})`}><Hematie k={0.4} /></g>; })}
    <Bandera x={1050} y={420} txt="endotelio de los capilares de la piel, lesionado por el LOS" color={S.endo[0]} p={p('los')} t={24} punta="no" />
    <Bandera x={1050} y={480} txt="y por las citocinas" color={S.il1[0]} p={p('citocinas')} t={24} punta="no" />
    <Bandera x={1250} y={900} txt="los eritrocitos se escapan hacia la dermis" color={S.il1[0]} p={p('dermis')} t={24} punta="no" />
    <Bandera x={800} y={965} txt="el inicio de la inmunotrombosis, escrito en la piel" color={S.net[0]} p={p('piel')} t={30} punta="no" />
  </g>
);

const LAMINAS: Lamina[] = [Proposito, Nets, Centinela, RedCoagula, Generaliza, Petequias];
export default LAMINAS;
