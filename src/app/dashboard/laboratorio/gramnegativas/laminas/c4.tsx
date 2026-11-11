'use client';
// Capítulo 4 · Invasión y muerte del enterocito.

import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Cruz, Enterocito, En, Flecha, FLECHA, G, Pastilla, PildoraFlota, Rinon, Sale, TXT_FARMACO, TXTC, Txt, clamp, easeOut, tramo } from '../Piezas';

/** Ondulaciones de la membrana alrededor de un punto de entrada (`q` 0-1). */
function Ondulacion({ x, y, q }: { x: number; y: number; q: number }) {
  return (
    <En x={x} y={y} o={tramo(q, 0, 0.3)}>
      {[-110, -60, 0, 60, 110].map((dx, i) => <circle key={i} cx={dx} cy={-26 * q * (1 - Math.abs(dx) / 200) - 4} r={30 + 16 * q * (1 - Math.abs(dx) / 160)} fill={G.epitelio[2]} />)}
    </En>
  );
}

const Salmonella: Lamina = ({ p, reloj }) => {
  const sop = p('sop'), ond = p('ondulacion');
  return (
    <g>
      <Enterocito x={820} y={700} k={2.7} micro={1} />
      <Sale p={p('flagelos')} x={470} y={250}><Bacilo r={30} k={1.6} flagelo={1} reloj={reloj} sombra /></Sale>
      <Bandera x={400} y={110} txt="Salmonella Typhimurium" color={G.patogeno[0]} p={p('flagelos')} t={28} punta="abajo" />
      <Flecha a={[620, 330]} b={[740, 420]} p={p('flagelos')} color={FLECHA} w={9} />
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={600 + 28 * i + 6 * Math.sin(reloj / 250 + i)} cy={300 + 22 * i * tramo(sop, i * 0.06, 0.4 + i * 0.06)} r={11} fill={['#FFD23F', '#5FE08A', '#FF7A9A'][i % 3]} opacity={tramo(sop, i * 0.06, 0.3 + i * 0.06)} />)}
      <Txt x={80} y={420} txt="SopB · SopE · SopE2" t={26} p={sop} ancla="start" color={TXTC.amarillo} />
      <Txt x={80} y={466} txt="Rho-GTPasas" t={26} p={p('rho')} ancla="start" color={TXTC.verde} />
      <Ondulacion x={800} y={440} q={ond} />
      <Txt x={1130} y={500} txt="ondulaciones de la membrana:" t={26} p={ond} ancla="start" />
      <Txt x={1130} y={538} txt="facilitan su captación" t={26} p={ond} ancla="start" />
      <Sale p={p('sipa')} x={1300} y={250}><Bacilo r={-30} k={1.3} /></Sale>
      <Flecha a={[1220, 330]} b={[1000, 470]} p={p('sipa')} color={FLECHA} w={8} />
      <Txt x={1300} y={350} txt="entrada discreta con SipA" t={24} p={p('sipa')} />
      <Txt x={1300} y={388} txt="en zonas apicolaterales" t={22} p={p('sipa')} fuerte={false} />
    </g>
  );
};

const Shigella: Lamina = ({ p }) => {
  return (
    <g>
      <Enterocito x={640} y={560} k={2.2} micro={0.8} /><Enterocito x={880} y={560} k={2.2} micro={0.8} />
      <rect x={440} y={820} width={640} height={28} rx={14} fill="#E7A93A" />
      <Sale p={p('shigella')} x={760} y={930}><Bacilo r={0} k={1.5} /></Sale>
      <Bandera x={400} y={930} txt="Shigella" color={G.patogeno[0]} p={p('shigella')} t={30} punta="der" />
      <Flecha a={[760, 890]} b={[760, 790]} p={p('basolateral')} color={FLECHA} w={10} />
      <Txt x={1130} y={870} txt="entra por el polo basolateral" t={26} p={p('basolateral')} ancla="start" />
      <Txt x={1130} y={650} txt="SepA modifica la actina" t={26} p={p('sepa')} ancla="start" color={TXTC.amarillo} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${715 + i * 24},800 q-16,-26 4,-50`} fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" opacity={tramo(p('actina'), i * 0.12, 0.5 + i * 0.12)} />)}
      <Flecha a={[760, 190]} b={[760, 330]} p={p('paracelular')} color={FLECHA} w={9} />
      <Bacilo x={760} y={150} r={90} k={0.6 * tramo(p('paracelular'), 0, 0.3)} />
      <Txt x={1130} y={250} txt="tránsito paracelular" t={26} p={p('paracelular')} ancla="start" />
    </g>
  );
};

const Listeria: Lamina = ({ p }) => {
  const cola = p('cola');
  return (
    <g>
      <Bandera x={800} y={90} txt="Comparación grampositiva" color={G.grampos[0]} p={p('listeria')} t={32} punta="no" />
      <Enterocito x={290} y={640} k={2.2} micro={0.6} /><Enterocito x={1310} y={640} k={2.2} micro={0.6} />
      <Sale p={p('listeria')} x={290} y={330}><Bacilo tono={G.grampos} k={1.2} /></Sale>
      {[0, 1, 2].map((i) => <rect key={i} x={254 + i * 36} y={376} width={8} height={26} rx={4} fill="#FFD23F" opacity={tramo(p('internalinas'), i * 0.15, 0.5 + i * 0.15)} />)}
      <Txt x={470} y={330} txt="Listeria monocytogenes" t={26} p={p('listeria')} ancla="start" color={TXTC.grampos} />
      <Txt x={470} y={380} txt="internalinas: entra a la célula" t={24} p={p('internalinas')} ancla="start" />
      <Sale p={p('lisO')} x={290} y={680}><circle r={70} fill="#6D5AE0" opacity={0.35} /><circle r={70} fill="none" stroke="#3B2A9E" strokeWidth={6} strokeDasharray="18 14" /><Bacilo tono={G.grampos} k={0.6} r={20} /></Sale>
      <Txt x={470} y={470} txt="listeriolisina O: escapa de la vacuola" t={24} p={p('lisO')} ancla="start" />
      <Sale p={p('acta')} x={760} y={640}><Bacilo tono={G.grampos} k={0.9} r={-10} /></Sale>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${715 - i * 22},${640 + (i % 3 - 1) * 14} q-10,${8 * (i % 2 ? 1 : -1)} -22,0`} fill="none" stroke="#FFF1B8" strokeWidth={7} strokeLinecap="round" opacity={tramo(cola, i * 0.07, 0.4 + i * 0.07)} />)}
      <Txt x={640} y={730} txt="ActA: colas de actina" t={26} p={p('acta')} color={TXTC.amarillo} />
      <Flecha a={[850, 640]} b={[1120, 640]} p={cola} color={FLECHA} w={10} />
      <Txt x={800} y={900} txt="se propaga de célula a célula" t={28} p={cola} />
    </g>
  );
};

const Polaridad: Lamina = ({ p }) => {
  return (
    <g>
      <Enterocito x={500} y={620} k={3} micro={1} />
      <Txt x={90} y={300} txt="polo apical" t={26} p={p('ezrina')} ancla="start" /><Txt x={90} y={900} txt="polo basal" t={26} p={p('ezrina')} ancla="start" />
      {Array.from({ length: 6 }, (_, i) => <g key={i} opacity={tramo(p('ezrina'), i * 0.08, 0.4 + i * 0.08)}><path d={`M${410 + i * 34},330 l0,30`} stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" /><circle cx={410 + i * 34} cy={364} r={7} fill="#FF9F1C" /></g>)}
      <Txt x={760} y={300} txt="ezrina · radixina · moesina" t={26} p={p('ezrina')} ancla="start" color={TXTC.amarillo} />
      <Txt x={760} y={338} txt="unen la membrana con el citoesqueleto" t={22} p={p('ezrina')} ancla="start" fuerte={false} />
      <Sale p={p('epec')} x={1230} y={470}><Bacilo r={20} k={1.3} /></Sale>
      <Bandera x={1230} y={390} txt="EPEC" color={G.patogeno[0]} p={p('epec')} t={30} punta="abajo" />
      <Sale p={p('pedestal')} x={1230} y={620}>
        <path d="M-70,0 Q-70,-70 0,-70 Q70,-70 70,0 L40,60 L-40,60 Z" fill={G.epitelio[2]} />
        {[-40, -14, 14, 40].map((dx, i) => <path key={i} d={`M${dx},40 q${(i % 2 ? 8 : -8)},-26 0,-52`} fill="none" stroke="#FFD23F" strokeWidth={7} strokeLinecap="round" />)}
      </Sale>
      <Txt x={1230} y={730} txt="pedestal rico en actina" t={26} p={p('pedestal')} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={1060 + i * 80 + 50 * p('crb3') * (i % 2 ? 1 : -1)} cy={830 + 20 * (i % 2)} r={13} fill={['#E0338A', '#5FE08A', '#FFD23F', '#7A45E6'][i]} opacity={tramo(p('crb3'), 0, 0.3)} />)}
      <Txt x={1230} y={910} txt="CRB3 y PALS1 se redistribuyen" t={26} p={p('crb3')} />
    </g>
  );
};

const Expulsar: Lamina = ({ p }) => {
  const ex = easeOut(clamp(p('extrusion'))), br = p('brecha');
  return (
    <g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const infectada = i === 3;
        return <Enterocito key={i} x={170 + i * 210} y={infectada ? 720 - 150 * ex : 720} k={1.7} micro={infectada ? 0.8 : 1} o={i === 5 || i === 1 ? 1 - 1 * tramo(br, i === 5 ? 0 : 0.3, 0.7) : 1} muere={infectada ? tramo(p('extrusion'), 0, 1) : 0} />;
      })}
      <g opacity={tramo(p('infectada'), 0, 0.4)}>{[0, 1, 2].map((i) => <Bacilo key={i} x={800 + (i - 1) * 40} y={730 - 150 * ex + (i % 2) * 24} r={i * 50} k={0.34} />)}</g>
      <Txt x={800} y={300} txt="la célula infectada se expulsa" t={30} p={p('extrusion')} />
      <Flecha a={[800, 480]} b={[800, 380]} p={p('extrusion')} color={FLECHA} w={10} />
      <Txt x={800} y={190} txt="a veces la defensa es sacrificar" t={30} p={p('infectada')} />
      <Txt x={420} y={870} txt="limita la replicación" t={26} p={p('extrusion')} />
      <Sale p={p('brecha')} x={1180} y={560}><Bacilo r={90} k={0.7} /></Sale>
      <Txt x={1180} y={470} txt="si se muere más de lo que se repone: brechas" t={26} p={br} />
      <Txt x={800} y={950} txt="… y se abren brechas en la barrera" t={28} p={p('reposicion')} color={TXTC.sangre} />
    </g>
  );
};

/** Anillo de ocho pétalos: el inflamasoma NLRC4 con NAIP. */
function Inflamasoma({ x, y, k = 1, q = 1 }: { x: number; y: number; k?: number; q?: number }) {
  return (
    <En x={x} y={y} k={k} o={tramo(q, 0, 0.3)}>
      {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`rotate(${i * 45})`}><ellipse cx={0} cy={-62} rx={22} ry={34} fill={i % 2 ? '#7A45E6' : '#E0338A'} /><ellipse cx={-6} cy={-70} rx={7} ry={11} fill="#FFF" opacity={0.5} /></g>)}
      <circle r={34} fill="#FFD23F" /><circle r={24} fill="#FFF0A8" />
    </En>
  );
}

const Inflamasomas: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="¿Cómo se activa?" color="var(--cit-base)" p={p('toxinas')} t={34} punta="no" />
      <Txt x={330} y={190} txt="toxinas" t={30} p={p('toxinas')} /><Txt x={800} y={190} txt="citocinas" t={30} p={p('citocinas')} /><Txt x={1270} y={190} txt="inflamasomas" t={30} p={p('inflamasomas')} />
      <Sale p={p('flagelina')} x={300} y={430}><Bacilo r={-20} k={1.2} flagelo={1} /></Sale>
      <Txt x={300} y={520} txt="flagelo y sistema de secreción" t={24} p={p('flagelina')} />
      <Flecha a={[470, 440]} b={[590, 440]} p={p('naip')} color={FLECHA} w={9} />
      <Sale p={p('naip')} x={660} y={440}><rect x={-34} y={-44} width={68} height={88} rx={26} fill="#0A7F86" /><rect x={-28} y={-38} width={56} height={76} rx={22} fill="#16B9BE" /></Sale>
      <Txt x={660} y={520} txt="NAIP" t={28} p={p('naip')} color={TXTC.comensal} />
      <Inflamasoma x={960} y={440} k={1.2} q={p('nlrc4')} />
      <Txt x={960} y={560} txt="NLRC4" t={28} p={p('nlrc4')} color={TXTC.rosa} />
      <Sale p={p('caspasa')} x={1300} y={440}><circle r={50} fill="#E5324C" /><path d="M-22,-12 l44,24 M-22,12 l44,-24" stroke="#FFF" strokeWidth={9} strokeLinecap="round" /></Sale>
      <Txt x={1300} y={520} txt="caspasas → muerte y expulsión" t={24} p={p('caspasa')} />
      <Sale p={p('humano')} x={460} y={770}><circle r={54} fill="#2F6FD8" /><circle r={42} fill="#5AA8FF" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 30, fontWeight: 800 }} fill="#FFF">4 · 5</text></Sale>
      <Txt x={460} y={860} txt="caspasas humanas 4 y 5" t={24} p={p('humano')} />
      <Sale p={p('raton')} x={1140} y={770}><circle r={54} fill="#D9822B" /><circle r={42} fill="#FFC060" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 30, fontWeight: 800 }} fill="#FFF">11</text></Sale>
      <Txt x={1140} y={860} txt="caspasa 11 de ratón" t={24} p={p('raton')} />
      <Sale p={p('noigual')} x={800} y={770}><rect x={-62} y={-42} width={124} height={84} rx={16} fill="#FFD23F" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 58, fontWeight: 800 }} fill="#3B1A6E">≠</text></Sale>
      <Txt x={800} y={860} txt="no son la misma molécula" t={24} p={p('noigual')} />
    </g>
  );
};

const Directa: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('shiga')} x={330} y={330}><Bacilo r={-20} k={1.3} /></Sale>
      <Bandera x={330} y={190} txt="Toxina Shiga" color={G.patogeno[0]} p={p('shiga')} t={28} punta="abajo" />
      <Sale p={p('ribosoma')} x={330} y={620}>
        <ellipse cx={0} cy={-26} rx={60} ry={40} fill="#7A45E6" /><ellipse cx={0} cy={22} rx={80} ry={50} fill="#B79BFF" />
        <path d="M-120,70 q60,-60 120,0 t120,0" fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" />
      </Sale>
      <Cruz x={330} y={620} k={2.2} p={p('ribosoma')} />
      <Txt x={330} y={740} txt="frena la síntesis de proteínas" t={24} p={p('ribosoma')} />
      <Bandera x={800} y={190} txt="TcdB · C. difficile" color={G.grampos[0]} p={p('tcdb')} t={28} punta="abajo" />
      <Sale p={p('tcdb')} x={800} y={330}><Bacilo tono={G.grampos} k={1.3} /></Sale>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${700 + i * 50},${520 + 60 * p('colapsa') * (i % 2 ? 1 : -1)} q${20 * p('colapsa')},${80 - 30 * p('colapsa')} ${-10 * p('colapsa')},170`} fill="none" stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" opacity={tramo(p('colapsa'), 0, 0.3)} />)}
      <Txt x={800} y={740} txt="colapsa el citoesqueleto" t={24} p={p('colapsa')} />
      <Bandera x={1270} y={190} txt="C. perfringens" color={G.grampos[0]} p={p('perfringens')} t={28} punta="abajo" />
      <Sale p={p('perfringens')} x={1270} y={330}><Bacilo tono={G.grampos} k={1.3} /></Sale>
      <Sale p={p('poros')} x={1270} y={600}>
        <rect x={-150} y={-24} width={300} height={48} rx={24} fill={G.epitelio[1]} />
        {[-80, 0, 80].map((dx, i) => <g key={i}><circle cx={dx} cy={0} r={22} fill="#1B0A3D" /><circle cx={dx} cy={0} r={22} fill="none" stroke="#FFD23F" strokeWidth={5} /></g>)}
      </Sale>
      <Txt x={1270} y={700} txt="forma poros en la membrana" t={24} p={p('poros')} />
      <Txt x={800} y={900} txt="lesión directa de la célula" t={30} p={p('colapsa')} color={TXTC.sangre} />
    </g>
  );
};

const Adentro: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Enterocito x={540} y={640} k={2.6} micro={0.7} />
      <Sale p={p('viven')} x={540} y={640}>{[[-30, 30, 20], [24, -10, -30], [30, 60, 50]].map(([cx, cy, r], i) => <Bacilo key={i} x={cx} y={cy} r={r} k={0.4} />)}</Sale>
      <Txt x={540} y={910} txt="Salmonella y Shigella viven dentro o en la mucosa" t={26} p={p('viven')} />
      <Sale p={p('fluoro')} x={170} y={330}><Pastilla k={0.9} r={20} color={['#1E56C6', '#3B82F0', '#BFDBFF']} /></Sale>
      <Txt x={170} y={400} txt="fluoroquinolonas" t={22} p={p('fluoro')} />
      <Sale p={p('macro')} x={400} y={330}><Pastilla k={0.9} r={-20} color={['#138A3A', '#3FD467', '#B5F5C4']} /></Sale>
      <Txt x={400} y={400} txt="macrólidos" t={22} p={p('macro')} />
      <Flecha a={[170, 440]} b={[420, 560]} p={p('fluoro')} color="#2F6FD8" w={9} /><Flecha a={[400, 440]} b={[480, 560]} p={p('macro')} color="#138A3A" w={9} />
      <Sale p={p('amino')} x={900} y={330}><Pastilla k={0.9} r={0} color={['#C2410C', '#F97316', '#FFC48A']} /></Sale>
      <Txt x={900} y={400} txt="aminoglucósidos" t={22} p={p('amino')} />
      <Flecha a={[900, 440]} b={[800, 530]} p={p('amino')} color="#C2410C" w={9} />
      <Cruz x={780} y={560} k={1.2} p={p('rebota')} />
      <Txt x={900} y={620} txt="fallan ahí dentro" t={24} p={p('rebota')} color={TXTC.sangre} />
      <Sale p={p('stec')} x={1150} y={360}><Bacilo r={-10} k={1.3} /></Sale>
      <Bandera x={1150} y={230} txt="STEC / EHEC" color={G.patogeno[0]} p={p('stec')} t={28} punta="abajo" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1080 + i * 36} cy={470 + 90 * tramo(p('shiga'), i * 0.1, 0.6 + i * 0.1) + 6 * Math.sin(reloj / 300 + i)} r={13} fill={G.toxina[1]} opacity={tramo(p('shiga'), 0, 0.3)} />)}
      <Txt x={1150} y={460} txt="más toxina Shiga" t={24} p={p('shiga')} color={TXTC.verde} />
      <Sale p={p('shu')} x={1150} y={700} k={0.8}><Rinon palido={p('shu')} /></Sale>
      <Txt x={1150} y={830} txt="síndrome hemolítico urémico: se evita de rutina" t={24} p={p('shu')} />
      <PildoraFlota x={1430} y={330} k={1.2} rl={reloj} p={p('farmaco')} />
      <Bandera x={1430} y={470} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={22} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Salmonella, Shigella, Listeria, Polaridad, Expulsar, Inflamasomas, Directa, Adentro];
export default LAMINAS;
