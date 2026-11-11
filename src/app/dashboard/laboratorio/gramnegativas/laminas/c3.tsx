'use client';
// Capítulo 3 · Uniones y rutas de cruce.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Basal, Cremallera, En, Enterocito, Flecha, FLECHA, G, Il1, Linfocito, Llamada, Macrofago, PildoraFlota, Sale, Tijera, TXT_FARMACO, TXTC, Txt, clamp, easeOut, tramo } from '../Piezas';

/** Los cinco tipos de unión entre dos enterocitos grandes: se señalan por la línea de contacto (x = 830). */
const Cinco: Lamina = ({ p }) => {
  const e = p('estrechas'), a = p('adherentes'), d = p('desmosomas'), g = p('comunicantes'), f = p('focales');
  return (
    <g>
      <Bandera x={800} y={80} txt="Cinco tipos de unión" color="var(--cit-base)" p={p('celulas')} t={34} punta="no" />
      <Sale p={p('celulas')} x={830} y={540}><Enterocito x={-140} y={0} k={2.6} /><Enterocito x={140} y={0} k={2.6} /></Sale>
      <Basal x0={520} x1={1140} y={782} p={f} h={24} />
      {[690, 970].map((x) => <g key={x} opacity={tramo(f, 0.2, 0.7)}><path d={`M${x - 12},770 L${x},788 L${x + 12},770`} fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /><rect x={x - 30} y={760} width={60} height={12} rx={6} fill="#2A0A48" /></g>)}
      <Cremallera x={830} y={335} h={80} k={1.25} cierre={e} o={tramo(e, 0, 0.3)} />
      <g opacity={tramo(a, 0, 0.4)}>
        <rect x={804} y={384} width={10} height={72} rx={5} fill="#2A0A48" /><rect x={846} y={384} width={10} height={72} rx={5} fill="#2A0A48" />
        {[0, 1, 2].map((i) => <g key={i}><rect x={812} y={392 + i * 24} width={36} height={9} rx={4.5} fill="#FFD23F" /><circle cx={802} cy={396 + i * 24} r={7} fill="#FF9F1C" /><circle cx={858} cy={396 + i * 24} r={7} fill="#FF9F1C" /></g>)}
      </g>
      <g opacity={tramo(d, 0, 0.4)}>
        <ellipse cx={812} cy={522} rx={9} ry={30} fill="#FF8AD0" /><ellipse cx={848} cy={522} rx={9} ry={30} fill="#FF8AD0" /><rect x={820} y={496} width={20} height={52} rx={6} fill="#E0338A" />
        {[-14, 0, 14].map((dy, i) => <g key={i}><path d={`M803,${522 + dy} q-26,${i * 6 - 6} -50,${dy}`} fill="none" stroke="#FFD0F0" strokeWidth={4} strokeLinecap="round" /><path d={`M857,${522 + dy} q26,${i * 6 - 6} 50,${dy}`} fill="none" stroke="#FFD0F0" strokeWidth={4} strokeLinecap="round" /></g>)}
      </g>
      <g opacity={tramo(g, 0, 0.4)}>
        <rect x={796} y={598} width={26} height={44} rx={9} fill="#0A7F86" /><rect x={838} y={598} width={26} height={44} rx={9} fill="#0A7F86" /><rect x={820} y={610} width={22} height={20} fill="#7FEDE8" />
        <rect x={803} y={612} width={12} height={16} rx={4} fill="#16B9BE" /><rect x={845} y={612} width={12} height={16} rx={4} fill="#16B9BE" />
      </g>
      <Llamada x={1250} y={335} a={[860, 335]} txt="uniones estrechas" p={e} t={28} halo />
      <Txt x={1250} y={372} txt="claudinas, ocludina, tricelulina, ZO-1" t={20} p={e} ancla="start" fuerte={false} />
      <Llamada x={1250} y={425} a={[862, 425]} txt="uniones adherentes" p={a} t={28} halo />
      <Txt x={1250} y={462} txt="E-cadherina y cateninas" t={20} p={a} ancla="start" fuerte={false} />
      <Llamada x={1250} y={525} a={[866, 525]} txt="desmosomas" p={d} t={28} halo />
      <Llamada x={1250} y={620} a={[866, 620]} txt="uniones comunicantes" p={g} t={28} halo />
      <Llamada x={100} y={715} a={[690, 772]} txt="adhesiones focales y hemidesmosomas" p={f} t={26} halo />
      <Txt x={130} y={755} txt="anclan la célula a la matriz" t={20} p={f} ancla="start" fuerte={false} />
    </g>
  );
};

const Rutas: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Dos rutas para cruzar" color="var(--cit-base)" p={p('rutas')} t={34} punta="no" />
      {[200, 340, 500, 640, 780].map((x, i) => <Enterocito key={i} x={x} y={650} k={1.3} />)}
      <Bacilo x={420} y={620} r={90} k={0.55 * tramo(p('paracelular'), 0, 0.3)} />
      <Flecha a={[420, 330]} b={[420, 560]} p={p('paracelular')} color={FLECHA} w={9} />
      <Txt x={330} y={260} txt="paracelular: entre las células" t={26} p={p('paracelular')} />
      <Bacilo x={640} y={650} r={20} k={0.5 * tramo(p('transcelular'), 0.3, 1)} />
      <Flecha a={[640, 330]} b={[640, 520]} p={p('transcelular')} color={FLECHA} w={9} />
      <Txt x={760} y={260} txt="transcelular: a través" t={26} p={p('transcelular')} />
      <Txt x={640} y={845} txt="invasión o transcitosis" t={22} p={p('transcelular')} fuerte={false} />
      <Sale p={p('peyer')} x={1180} y={680}>
        <path d="M-150,100 Q0,-240 150,100 Z" fill={G.epitelio[0]} /><path d="M-136,100 Q0,-216 136,100 Z" fill={G.epitelio[1]} />
        {[[-50, 20], [10, 40], [50, -10], [-10, -30], [-70, 70], [70, 60]].map(([cx, cy], i) => <Linfocito key={i} x={cx} y={cy} k={0.32} />)}
      </Sale>
      <Sale p={p('celulaM')} x={1180} y={470}><ellipse cx={0} cy={0} rx={44} ry={36} fill={G.rosa[1]} /><ellipse cx={0} cy={-6} rx={30} ry={20} fill={G.rosa[0]} /></Sale>
      <Bacilo x={1180} y={420} r={90} k={0.5 * tramo(p('celulaM'), 0.4, 1)} />
      <Txt x={1180} y={330} txt="célula M" t={26} p={p('celulaM')} />
      <Txt x={1180} y={830} txt="placas de Peyer" t={26} p={p('peyer')} />
      <Sale p={p('fagocitos')} x={1450} y={560}>
        <Macrofago k={0.62} />
        <Bacilo x={-6} y={-6} r={30} k={0.3} /><Bacilo x={12} y={18} r={-20} k={0.3} />
      </Sale>
      <Txt x={1400} y={770} txt="sobreviven en fagocitos y viajan con ellos" t={22} p={p('fagocitos')} />
    </g>
  );
};

const Cortar: Lamina = ({ p }) => {
  const corta = p('cortan');
  return (
    <g>
      <Bandera x={800} y={80} txt="Primera forma: cortar" color="var(--cit-base)" p={p('ecad')} t={34} punta="no" />
      <rect x={380} y={330} width={380} height={470} rx={60} fill={G.epitelio[0]} /><rect x={380} y={330} width={364} height={460} rx={56} fill={G.epitelio[1]} />
      <rect x={840} y={330} width={380} height={470} rx={60} fill={G.epitelio[0]} /><rect x={840} y={330} width={364} height={460} rx={56} fill={G.epitelio[1]} />
      <rect x={740} y={400} width={14} height={330} rx={7} fill="#2A0A48" /><rect x={846} y={400} width={14} height={330} rx={7} fill="#2A0A48" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={p('ecad') > 0.01 ? 1 - 0.85 * tramo(corta, i * 0.1, 0.5 + i * 0.1) : 0}>
          <rect x={754} y={420 + i * 62} width={92} height={14} rx={7} fill="#FFD23F" /><circle cx={744} cy={427 + i * 62} r={9} fill="#FF9F1C" /><circle cx={856} cy={427 + i * 62} r={9} fill="#FF9F1C" />
        </g>
      ))}
      <Txt x={800} y={870} txt="E-cadherina" t={30} p={p('ecad')} color={TXTC.amarillo} />
      <Sale p={p('cortan')} x={800} y={560} k={3}><Tijera corta={corta} /></Sale>
      <Sale p={p('htra')} x={280} y={230}><Bacilo r={20} k={1.2} /></Sale>
      <Bandera x={280} y={140} txt="HtrA · varios gramnegativos" color={G.patogeno[0]} p={p('htra')} t={24} punta="abajo" />
      <Sale p={p('fragilisina')} x={1320} y={230}><Bacilo r={-20} k={1.2} /></Sale>
      <Bandera x={1320} y={140} txt="fragilisina · B. fragilis" color={G.patogeno[0]} p={p('fragilisina')} t={24} punta="abajo" />
    </g>
  );
};

const Fosfo: Lamina = ({ p }) => {
  const mueve = p('redistribuye'), fos = p('fosforila');
  return (
    <g>
      <rect x={380} y={420} width={380} height={400} rx={60} fill={G.epitelio[0]} /><rect x={380} y={420} width={364} height={390} rx={56} fill={G.epitelio[1]} />
      <rect x={840} y={420} width={380} height={400} rx={60} fill={G.epitelio[0]} /><rect x={840} y={420} width={364} height={390} rx={56} fill={G.epitelio[1]} />
      <Cremallera x={800} y={520} h={170} cierre={1 - 0.7 * mueve} k={1.2} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={744 - 70 * mueve * (i % 2)} cy={470 + i * 52} r={11} fill="#FFD23F" opacity={tramo(mueve, 0, 0.3)} />)}
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={856 + 70 * mueve * (i % 2)} cy={470 + i * 52} r={11} fill="#FFD23F" opacity={tramo(mueve, 0, 0.3)} />)}
      {[[690, 520], [910, 600], [660, 660], [940, 480]].map(([x, y], i) => <En key={i} x={x} y={y} k={tramo(fos, i * 0.15, 0.5 + i * 0.15)}><circle r={22} fill="#E0338A" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 28, fontWeight: 800 }} fill="#FFF">P</text></En>)}
      {[['campy', 'Campylobacter', 220], ['epec', 'EPEC', 620], ['salmonella', 'Salmonella', 990], ['shigella', 'Shigella', 1340]].map(([n, txt, x]) => (
        <g key={n as string}><Sale p={p(n as string)} x={x as number} y={240}><Bacilo r={15} k={1} /></Sale><Bandera x={x as number} y={120} txt={txt as string} color={G.patogeno[0]} p={p(n as string)} t={26} punta="abajo" /></g>
      ))}
      <Txt x={800} y={900} txt="ocludina y ZO-1: fosforiladas, redistribuidas o con otra expresión" t={26} p={mueve} />
    </g>
  );
};

const Actina: Lamina = ({ p, reloj }) => {
  const caos = p('actina');
  return (
    <g>
      <Sale p={p('t3ss')} x={800} y={220}>
        <Bacilo k={1.6} sombra />
        <rect x={-6} y={26} width={12} height={150} rx={6} fill="#2A0A48" /><rect x={-3} y={26} width={6} height={150} rx={3} fill="#FFD23F" />
      </Sale>
      <Bandera x={800} y={80} txt="Sistema de secreción tipo 3" color={G.patogeno[0]} p={p('t3ss')} t={30} punta="no" />
      <rect x={400} y={430} width={800} height={430} rx={80} fill={G.epitelio[0]} /><rect x={400} y={430} width={780} height={415} rx={76} fill={G.epitelio[1]} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${470 + i * 90},${540 + (i % 2) * 20} q${(18 + 40 * caos).toFixed(0)},${(40 - 80 * caos * (i % 3 - 1)).toFixed(0)} ${(10 + 30 * caos * (i % 2 ? 1 : -1)).toFixed(0)},${(110 + 20 * caos).toFixed(0)}`} fill="none" stroke={caos > 0.5 ? '#FF9F1C' : '#FFD23F'} strokeWidth={9} strokeLinecap="round" opacity={tramo(p('soporte'), 0, 0.4)} />)}
      <g opacity={tramo(p('espf'), 0, 0.3)}><circle cx={800} cy={200 + 330 * easeOut(clamp(p('espf'))) + 20 * Math.sin(reloj / 200)} r={16} fill={G.toxina[1]} /><circle cx={794} cy={194 + 330 * easeOut(clamp(p('espf')))} r={5} fill="#FFF" opacity={0.8} /></g>
      <Txt x={1080} y={250} txt="efectores como EspF (EPEC)" t={26} p={p('espf')} ancla="start" />
      <Txt x={800} y={920} txt="se desarma el soporte de actina de las uniones" t={28} p={caos} />
    </g>
  );
};

const Inflama: Lamina = ({ p }) => {
  const abre = p('abre'), mi = p('miosina');
  return (
    <g>
      <Sale p={p('il1')} x={250} y={300}><Il1 k={2.2} /></Sale>
      <Txt x={250} y={400} txt="interleucina 1β" t={28} p={p('il1')} />
      <Flecha a={[360, 330]} b={[600, 430]} c={[470, 340]} p={p('il1')} color={FLECHA} w={9} />
      <Sale p={p('yersinia')} x={250} y={760}><Bacilo r={-10} k={1.3} /></Sale>
      <Txt x={250} y={850} txt="modelo con Yersinia pseudotuberculosis" t={22} p={p('yersinia')} />
      <Enterocito x={720} y={640} k={2} micro={0.6} /><Enterocito x={940 + 40 * abre} y={640} k={2} micro={0.6} />
      <Cremallera x={830 + 20 * abre} y={420} h={120} cierre={1 - abre} k={1.2} />
      <Bandera x={830} y={190} txt="MLCK" color={G.epitelio[1]} p={p('mlck')} t={34} punta="abajo" />
      {[0, 1].map((i) => <g key={i} opacity={tramo(mi, 0, 0.4)}><path d={`M${i ? 906 + 40 * abre : 754} 470 q${i ? -50 : 50},50 0,100`} fill="none" stroke="#E5324C" strokeWidth={12} strokeLinecap="round" /><path d={`M${i ? 906 + 40 * abre : 754} 470 q${i ? -26 : 26},50 0,100`} fill="none" stroke="#FF7A8A" strokeWidth={5} strokeLinecap="round" /></g>)}
      <Txt x={1200} y={430} txt="la miosina contrae el anillo…" t={26} p={mi} ancla="start" />
      <Txt x={1200} y={480} txt="…y se abre la unión" t={30} p={abre} ancla="start" color={TXTC.sangre} />
    </g>
  );
};

const Recordar: Lamina = ({ p }) => {
  const filas: [string, number, ReactNode][] = [
    ['corte', 260, <Tijera key="t" k={2.4} />],
    ['fosfo', 620, <g key="f"><circle r={46} fill="#E0338A" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 56, fontWeight: 800 }} fill="#FFF">P</text></g>],
    ['actina', 980, <path key="a" d="M-60,30 q20,-70 40,0 t40,0 t40,0" fill="none" stroke="#FFD23F" strokeWidth={12} strokeLinecap="round" />],
    ['inflama', 1340, <Il1 key="i" k={2} />],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Qué recordar" color="var(--cit-base)" p={p('corte')} t={34} punta="no" />
      {filas.map(([n, x, ic]) => <Sale key={n} p={p(n)} x={x} y={330}>{ic}</Sale>)}
      <Txt x={260} y={450} txt="cortar" t={28} p={p('corte')} /><Txt x={620} y={450} txt="fosforilar o mover" t={28} p={p('fosfo')} />
      <Txt x={980} y={450} txt="desarmar la actina" t={28} p={p('actina')} /><Txt x={1340} y={450} txt="inflamar" t={28} p={p('inflama')} />
      <Flecha a={[800, 520]} b={[800, 640]} p={p('combina')} color={FLECHA} w={10} />
      <Sale p={p('combina')} x={800} y={760}><Cremallera h={150} cierre={0.1} k={1.4} /></Sale>
      <Txt x={800} y={880} txt="un patógeno puede combinar varias" t={30} p={p('combina')} />
      <Txt x={800} y={930} txt="la ruta depende del microorganismo: no hay receta única" t={26} p={p('depende')} fuerte={false} />
    </g>
  );
};

const Sro: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Enterocito x={800} y={650} k={2.4} micro={1} />
      <Cremallera x={650} y={500} h={110} cierre={0.2} k={1.2} o={tramo(p('uniones'), 0, 0.4)} /><Cremallera x={950} y={500} h={110} cierre={0.2} k={1.2} o={tramo(p('uniones'), 0, 0.4)} />
      <Txt x={800} y={190} txt="aunque las uniones estén abiertas…" t={28} p={p('uniones')} />
      <Sale p={p('sgl')} x={800} y={440}>
        <path d="M-60,-30 C-60,-70 60,-70 60,-30 L60,40 C60,80 -60,80 -60,40 Z" fill="#0A7F86" /><path d="M-50,-30 C-50,-60 50,-60 50,-30 L50,36 C50,68 -50,68 -50,36 Z" fill="#16B9BE" /><rect x={-14} y={-40} width={28} height={90} rx={12} fill="#BFF5F0" />
      </Sale>
      <Txt x={1010} y={440} txt="SGLT1" t={30} p={p('sgl')} ancla="start" color={TXTC.comensal} />
      <g opacity={tramo(p('sodio'), 0, 0.3)}><circle cx={770} cy={300 + 150 * easeOut(clamp(p('sodio'))) + 8 * Math.sin(reloj / 300)} r={22} fill="#FFD23F" /><text x={770} y={307 + 150 * easeOut(clamp(p('sodio')))} textAnchor="middle" style={{ fontSize: 20, fontWeight: 800 }} fill="#3B1A6E">Na⁺</text></g>
      <g opacity={tramo(p('glucosa'), 0, 0.3)}><path d={`M830,${280 + 150 * easeOut(clamp(p('glucosa')))} l16,9 v18 l-16,9 l-16,-9 v-18 z`} fill="#FF7A9A" /><path d={`M830,${280 + 150 * easeOut(clamp(p('glucosa')))} l16,9 l-16,9 l-16,-9 z`} fill="#FFC0D0" /></g>
      <g opacity={tramo(p('agua'), 0, 0.3)}>{[0, 1, 2].map((i) => <path key={i} d={`M${860 + i * 26},${320 + 130 * easeOut(clamp(p('agua'))) - i * 12} c10,16 16,26 16,36 a16,16 0 1 1 -32,0 c0,-10 6,-20 16,-36 z`} fill="#5AA8FF" />)}</g>
      <Sale p={p('sales')} x={260} y={420}>
        <rect x={-90} y={-110} width={180} height={220} rx={16} fill={G.sombra} transform="translate(8,9)" /><rect x={-90} y={-110} width={180} height={220} rx={16} fill="#FFF7E8" /><rect x={-90} y={-110} width={180} height={64} rx={16} fill="#2F6FD8" />
        <path d="M0,-20 c20,30 30,46 30,62 a30,30 0 1 1 -60,0 c0,-16 10,-32 30,-62 z" fill="#5AA8FF" /><rect x={-8} y={20} width={16} height={46} rx={4} fill="#FFF" /><rect x={-23} y={35} width={46} height={16} rx={4} fill="#FFF" />
      </Sale>
      <Txt x={260} y={570} txt="sales de rehidratación oral" t={26} p={p('sales')} />
      <Txt x={800} y={945} txt="llevan glucosa y sodio: usan la vía que la diarrea no apaga" t={28} p={p('sales')} />
      <PildoraFlota x={1380} y={430} k={1.2} rl={reloj} p={p('farmaco')} />
      <Bandera x={1380} y={580} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Cinco, Rutas, Cortar, Fosfo, Actina, Inflama, Recordar, Sro];
export default LAMINAS;
