'use client';
// Capítulo 5 · La mucosa: por dónde entra

import type { Lamina } from '../Lienzo';
import { HILLS, Escamoso, Bandera, Bola, Capas, Caliciforme, Cremallera, Dendritica, Enterocito, Escudo, Flecha, Ganglio, Gel, Hla, Letra, Linfocito, Macrofago, Bazo, P, Sale, Tijeras, Trazo, Txt, TXV, Virion, easeOut, hash, lerp, tramo, Correceptor } from '../Piezas';

// ─── 0 · Dos clases de epitelio ──────────────────────────────────────────────
const DosEpitelios: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={110} txt="la puerta de entrada depende del tejido" t={42} p={p('depende')} color={TXV.violeta} />
    <Capas x={800} y={600} w={1800} fondo={500} bandas={HILLS} sem={4} o={tramo(p('lamina'), 0, 0.5)} />
    {/* escamoso estratificado: muchas capas */}
    <Bandera x={420} y={235} txt="escamoso estratificado" color={P.hla[0]} p={p('escamoso')} t={32} punta="abajo" />
    <Escamoso x0={110} x1={730} y={345} o={tramo(p('escamoso'), 0, 0.5)} />
    <Txt x={420} y={560} txt="muchas capas de células" t={28} p={p('capas')} />
    <Txt x={420} y={165} txt="boca · vagina · exocérvix" t={26} p={p('boca')} />
    <Txt x={420} y={195} txt="conducto anal bajo · prepucio (cara interna)" t={26} p={p('conducto')} />
    {/* columnar simple: una sola capa */}
    <Bandera x={1180} y={235} txt="columnar simple" color={P.cap[0]} p={p('columnar')} t={32} punta="abajo" />
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 960 + i * 116, q = tramo(p('columnar'), i * 0.1, i * 0.1 + 0.5);
      return i === 2
        ? <Caliciforme key={i} x={x} y={450} k={0.82} o={q} />
        : <Enterocito key={i} x={x} y={450} k={0.82} w={104} o={q} />;
    })}
    <Txt x={1180} y={575} txt="una sola capa" t={28} p={p('sola')} />
    <Txt x={1180} y={165} txt="recto · endocérvix" t={26} p={p('recto')} />
    {/* la lámina propia, llena de células que el virus busca */}
    <Bandera x={800} y={720} txt="lámina propia" color={P.virus[0]} p={p('lamina')} t={34} punta="no" />
    {[[260, 830, 't'], [450, 880, 'cd8'], [650, 840, 't'], [930, 880, 't'], [1130, 835, 'cd8'], [1340, 880, 't']].map(([x, y, t], i) => (
      <Sale key={i} p={tramo(p('celulas'), i * 0.1, i * 0.1 + 0.5)} x={x as number} y={y as number}><Linfocito k={0.55} tono={t as 't' | 'cd8'} /></Sale>
    ))}
    <Sale p={p('busca')} x={800} y={380}><Virion k={0.5} reloj={reloj} /></Sale>
    <Flecha a={[800, 450]} b={[800, 800]} p={tramo(p('busca'), 0.3, 1)} color={P.virus[1]} w={10} />
  </g>
);

// ─── 1 · El recto, mucosa del paciente 1 ─────────────────────────────────────
const Recto: Lamina = ({ p, reloj }) => {
  const mu = easeOut(p('microlesion'));
  const ent = easeOut(p('entrar'));
  const vy = lerp(110, 700, ent);
  return (
    <g>
      <Capas x={800} y={520} w={1800} fondo={600} bandas={HILLS} sem={6} />
      {/* el moco en dos capas */}
      <Gel x={20} y={262} w={1560} h={88} denso sem={3} hebras={16} o={tramo(p('moco'), 0, 0.5)} />
      <Gel x={20} y={130} w={1560} h={132} sem={7} hebras={14} o={tramo(p('moco'), 0, 0.5)} />
      {Array.from({ length: 11 }, (_, i) => {
        const x = 130 + i * 134;
        const q = tramo(p('columnar'), (i / 11) * 0.6, (i / 11) * 0.6 + 0.4);
        if (i === 5) return <Enterocito key={i} x={x} y={470} k={0.92} w={104} muere={mu} o={q} />;
        return i % 4 === 3 ? <Caliciforme key={i} x={x} y={470} k={0.92} o={q} libera={tramo(p('calicif'), 0, 1)} /> : <Enterocito key={i} x={x} y={470} k={0.92} w={104} o={q} />;
      })}
      {Array.from({ length: 10 }, (_, i) => <Cremallera key={i} x={130 + (i + 0.5) * 134} y={500} h={110} k={0.8} cierre={i === 4 || i === 5 ? 1 - mu : 1} o={tramo(p('uniones'), 0, 0.5)} />)}
      <Bandera x={310} y={80} txt="epitelio columnar simple" color={P.cap[0]} p={p('columnar')} t={28} punta="no" />
      <Bandera x={760} y={80} txt="caliciformes: moco" color={P.hla[0]} p={p('calicif')} t={26} punta="no" />
      <Txt x={1230} y={80} txt="una sola capa, cubierta de moco" t={28} p={p('capa')} />
      <Bandera x={1250} y={640} txt="uniones estrechas" color={P.rt[0]} p={p('uniones')} t={26} punta="no" />
      {/* una microlesión deja expuesta la lámina propia y deja pasar al virus */}
      <Bandera x={800} y={640} txt="microlesión" color={P.sangre[0]} p={p('microlesion')} t={30} punta="no" />
      <Virion x={800} y={vy} k={0.4} o={tramo(p('entrar'), 0, 0.15) * (1 - 0.0)} reloj={reloj} />
      <Txt x={800} y={925} txt="la lámina propia queda expuesta" t={32} p={p('expuesta')} color="#FFB3BB" />
      {/* debajo: folículos linfoides y CD4 de memoria */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = hash(i, 3) * Math.PI * 2, r = 25 + hash(i, 4) * 85;
        return <Sale key={i} p={tramo(p('foliculos'), (i / 12) * 0.5, (i / 12) * 0.5 + 0.4)} x={330 + Math.cos(a) * r} y={800 + Math.sin(a) * r * 0.6}><Linfocito k={0.36} tono="b" /></Sale>;
      })}
      <Txt x={330} y={900} txt="folículos linfoides" t={26} p={p('foliculos')} color="#FFF" />
      {[1000, 1130, 1260, 1390].map((x, i) => <Sale key={x} p={tramo(p('cd4'), i * 0.15, i * 0.15 + 0.5)} x={x} y={790 + (i % 2) * 70}><Linfocito k={0.5} /></Sale>)}
      <Txt x={1200} y={910} txt="abundantes CD4 de memoria" t={26} p={p('memoria')} color="#FFF" />
    </g>
  );
};

// ─── 2 · La vagina y el cuello uterino ───────────────────────────────────────
const Vagina: Lamina = ({ p, reloj }) => {
  const gr = easeOut(p('microlesiones'));
  return (
    <g>
      <Capas x={800} y={560} w={1800} fondo={500} bandas={HILLS} sem={8} />
      {/* vagina y exocérvix: escamoso grueso */}
      <Escamoso x0={90} x1={930} y={300} filas={9} o={tramo(p('escamoso'), 0, 0.5)} />
      <Bandera x={700} y={180} txt="vagina y exocérvix: escamoso" color={P.hla[0]} p={p('escamoso')} t={26} punta="abajo" />
      <Txt x={510} y={610} txt="una barrera gruesa, casi impenetrable" t={28} p={p('gruesa')} color="#FFF" />
      <Sale p={p('langer')} x={300} y={500}><Dendritica k={0.36} tono={P.esp} brazos={6} /></Sale>
      <Sale p={p('langer')} x={620} y={520}><Dendritica k={0.36} tono={P.esp} brazos={6} /></Sale>
      <Sale p={p('cd4')} x={460} y={540}><Linfocito k={0.36} /></Sale>
      <Sale p={p('cd4')} x={760} y={530}><Linfocito k={0.36} /></Sale>
      <Bandera x={300} y={650} txt="Langerhans" color={P.esp[0]} p={p('langer')} t={24} punta="no" />
      <Bandera x={650} y={650} txt="CD4" color={P.cd4[0]} p={p('cd4')} t={24} punta="no" />
      {/* el virus llega por microlesiones o entre las células */}
      <Sale p={p('llegar')} x={400} y={110}><Virion k={0.4} reloj={reloj} /></Sale>
      <path d={`M470,${300 - 26} L${470 + 22},${330} L470,${356} L${470 + 18},${384}`} fill="none" stroke="#2A1A5A" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={gr} />
      <Flecha a={[430, 180]} b={[486, 440]} c={[500, 300]} p={tramo(p('microlesiones'), 0.2, 1)} color={P.virus[1]} w={9} />
      <Txt x={540} y={255} txt="microlesiones" t={26} p={p('microlesiones')} color={TXV.sangre} ancla="start" />
      <Flecha a={[860, 150]} b={[760, 420]} c={[860, 280]} p={p('celulas')} color={P.virus[1]} w={9} />
      <Txt x={890} y={250} txt="o entre las células" t={26} p={p('celulas')} color={TXV.virus} ancla="start" />
      {/* endocérvix: una sola capa columnar */}
      {[0, 1, 2, 3].map((i) => <Enterocito key={i} x={1070 + i * 120} y={420} k={0.82} w={104} o={tramo(p('endocervix'), i * 0.12, i * 0.12 + 0.5)} />)}
      <Bandera x={1290} y={140} txt="endocérvix: una sola capa columnar" color={P.cap[0]} p={p('endocervix')} t={26} punta="abajo" />
      {/* la zona de transformación */}
      <circle cx={1000} cy={400} r={110 * easeOut(p('transformacion'))} fill="none" stroke={P.espiga[1]} strokeWidth={10} opacity={0.9} />
      <Bandera x={1000} y={680} txt="zona de transformación" color={P.espiga[0]} p={p('transformacion')} t={30} punta="no" />
      <Txt x={1000} y={740} txt="donde se encuentran los dos epitelios" t={26} p={p('encuentran')} color="#FFF" />
      <Txt x={1000} y={795} txt="especialmente vulnerable" t={38} p={p('vulnerable')} color="#FFB3BB" />
    </g>
  );
};

// ─── 3 · El prepucio ─────────────────────────────────────────────────────────
const Prepucio: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={110} txt="otra histología particular: el prepucio" t={42} p={p('particular')} color={TXV.violeta} />
    <Capas x={500} y={620} w={1000} fondo={400} bandas={HILLS} sem={9} o={tramo(p('interna'), 0, 0.5)} />
    <Escamoso x0={90} x1={910} y={500} filas={3} o={tramo(p('delgado'), 0, 0.5)} />
    <Bandera x={500} y={400} txt="cara interna: epitelio delgado, poco queratinizado" color={P.hla[0]} p={p('delgado')} t={26} punta="abajo" />
    {[200, 330, 470, 610, 750].map((x, i) => <Sale key={x} p={tramo(p('langer'), i * 0.1, i * 0.1 + 0.5)} x={x} y={580}><Dendritica k={0.28} tono={P.esp} brazos={6} /></Sale>)}
    {[270, 410, 540, 680].map((x, i) => <Sale key={x} p={tramo(p('cd4'), i * 0.1, i * 0.1 + 0.5)} x={x} y={650}><Linfocito k={0.34} /></Sale>)}
    <Txt x={500} y={780} txt="muchas células de Langerhans y CD4" t={30} p={p('cd4')} color="#FFF" />
    <Bandera x={500} y={860} txt="base biológica del hallazgo famoso" color={P.virus[0]} p={p('base')} t={28} punta="no" />
    {/* ensayos aleatorizados: la circuncisión masculina redujo la adquisición */}
    <Txt x={1190} y={210} txt="ensayos aleatorizados" t={34} p={p('ensayos')} />
    <Sale p={p('circuncision')} x={1190} y={440}><Tijeras k={1.8} abre={0.6 + 0.4 * Math.sin(reloj / 250)} r={0} /></Sale>
    <Txt x={1190} y={600} txt="circuncisión masculina" t={32} p={p('circuncision')} color={TXV.violeta} />
    <Flecha a={[1190, 650]} b={[1050, 790]} c={[1190, 760]} p={p('redujo')} color={P.sangre[1]} w={14} />
    <Sale p={p('adquisicion')} x={1010} y={850}><Escudo k={0.5} id="esc53" /></Sale>
    <Txt x={1090} y={850} txt="menos adquisición del virus" t={28} p={p('adquisicion')} ancla="start" color={TXV.verde} />
  </g>
);

// ─── 4 · El comité de bienvenida ─────────────────────────────────────────────
const Comite: Lamina = ({ p, reloj }) => (
  <g>
    <Escamoso x0={90} x1={1510} y={150} filas={5} o={tramo(p('epitelio'), 0, 0.5)} />
    <Bandera x={800} y={80} txt="epitelio" color={P.hla[0]} p={p('epitelio')} t={26} punta="no" />
    <Capas x={800} y={330} w={1800} fondo={700} bandas={HILLS} sem={10} o={tramo(p('lamina'), 0, 0.5)} />
    <Bandera x={160} y={310} txt="lámina propia" color={P.virus[0]} p={p('lamina')} t={26} punta="no" />
    <Txt x={800} y={290} txt="aquí es donde le interesa al virus" t={30} p={p('interesa')} color={TXV.sangre} />
    <Sale p={p('memoria')} x={290} y={560}><Linfocito k={1.2} /></Sale>
    <Correceptor x={290} y={500} k={0.9 * easeOut(p('ccr5'))} />
    <Txt x={290} y={680} txt="CD4 de memoria" t={28} p={p('memoria')} color="#FFF" />
    <Txt x={290} y={720} txt="con CCR5" t={26} p={p('ccr5')} color="#FFF" />
    <Sale p={p('macrofagos')} x={640} y={570}><Macrofago k={0.42} /></Sale>
    <Txt x={640} y={690} txt="macrófagos" t={28} p={p('macrofagos')} color="#FFD58A" />
    <Sale p={p('dendriticas')} x={1000} y={570}><Dendritica k={0.9} /></Sale>
    {[0, 1, 2].map((i) => { const a = (-130 + i * 40) * Math.PI / 180; return <Hla key={i} x={1000 + Math.cos(a) * 66} y={570 + Math.sin(a) * 66} r={-130 + i * 40 + 90} k={1.5 * easeOut(p('dcsign'))} tono={P.esp} />; })}
    <Txt x={1000} y={690} txt="dendríticas con DC-SIGN" t={28} p={p('dendriticas')} color="#FFB0F0" />
    <Sale p={p('langer')} x={1370} y={225}><Dendritica k={0.42} tono={P.esp} brazos={6} /></Sale>
    <Bandera x={1370} y={90} txt="Langerhans, dentro del epitelio" color={P.esp[0]} p={p('langer')} t={24} punta="no" />
    <Bandera x={800} y={830} txt="el comité de bienvenida" color={P.espiga[0]} p={p('comite')} t={40} punta="no" />
    <Txt x={800} y={915} txt="células que están allí para vigilar" t={30} p={p('vigilar')} color="#FFF" />
    <Sale p={p('aprovecha')} x={800} y={420}><Virion k={0.4} reloj={reloj} /></Sale>
    <Flecha a={[800, 480]} b={[700, 540]} p={p('entrar')} color={P.virus[1]} w={10} />
  </g>
);

// ─── 5 · Tres rutas para cruzar ──────────────────────────────────────────────
const TresRutas: Lamina = ({ p, reloj }) => {
  const cols = [260, 800, 1340];
  const ruta = (n: number, x: number, q: number) => <Sale key={n} p={q} x={x} y={90}><Bola R={34} tono={[...P.espiga]} /><Letra txt={String(n)} t={40} /></Sale>;
  const q2 = easeOut(p('transcitosis'));
  return (
    <g>
      <Capas x={800} y={520} w={1800} fondo={500} bandas={HILLS} sem={12} />
      <Txt x={800} y={975} txt="¿cómo cruza el virus la barrera?" t={34} p={p('cruza')} color="#FFF" />
      {ruta(1, cols[0], p('r1'))}{ruta(2, cols[1], p('r2'))}{ruta(3, cols[2], p('r3'))}
      {/* 1 · microlesiones, con inflamación que atrae CD4 */}
      {[0, 1, 2].map((i) => <Enterocito key={i} x={140 + i * 120} y={440} k={0.82} w={104} muere={i === 1 ? easeOut(p('microlesiones')) : 0} />)}
      <Virion x={260} y={lerp(260, 560, easeOut(p('alcance')))} k={0.36} o={tramo(p('microlesiones'), 0, 0.3)} reloj={reloj} />
      <Bandera x={260} y={190} txt="microlesiones" color={P.sangre[0]} p={p('microlesiones')} t={28} punta="no" />
      <Txt x={260} y={640} txt="la inflamación y otras infecciones las empeoran" t={22} p={p('inflamacion')} color="#FFB3BB" />
      {[[150, 760], [260, 790], [370, 760]].map(([x, y], i) => <Sale key={i} p={tramo(p('atraen'), i * 0.15, i * 0.15 + 0.5)} x={x as number} y={y as number}><Linfocito k={0.42} /></Sale>)}
      <Flecha a={[260, 740]} b={[260, 660]} p={p('atraen')} color={P.cd4[1]} w={8} />
      <Txt x={260} y={880} txt="atraen más CD4" t={26} p={p('atraen')} color="#FFF" />
      {/* 2 · transcitosis por células M sobre un folículo linfoide */}
      <Sale p={p('transcitosis')} x={800} y={440}>
        <path d="M-80,60 L-80,-20 Q-80,-96 0,-96 Q80,-96 80,-20 L80,60 Z" fill={P.hla[0]} />
        <path d="M-72,60 L-72,-20 Q-72,-88 -4,-88 Q70,-88 72,-20 L72,60 Z" fill={P.hla[1]} />
        <path d="M-50,40 Q-50,-10 0,-10 Q50,-10 50,40 Z" fill="#4B1A6E" />
        <path d="M-52,-50 Q-34,-76 -6,-78" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      </Sale>
      <Bandera x={800} y={190} txt="células M: transcitosis" color={P.hla[0]} p={p('especializadas')} t={28} punta="no" />
      <Txt x={800} y={620} txt="cubren los folículos linfoides" t={24} p={p('foliculos')} color="#FFF" />
      <Virion x={800} y={lerp(300, 440, q2)} k={0.3} o={tramo(p('toman'), 0, 0.3) * (1 - 0.0)} reloj={reloj} />
      <Flecha a={[800, 520]} b={[800, 700]} p={p('llevan')} color={P.virus[1]} w={9} />
      {[[720, 760], [800, 800], [880, 760]].map(([x, y], i) => <Sale key={i} p={tramo(p('esperan'), i * 0.15, i * 0.15 + 0.5)} x={x as number} y={y as number}><Linfocito k={0.42} tono="b" /></Sale>)}
      <Txt x={800} y={880} txt="al otro lado esperan los linfocitos" t={24} p={p('esperan')} color="#FFF" />
      {/* 3 · prolongaciones de células dendríticas */}
      {[0, 1, 2].map((i) => <Enterocito key={i} x={1220 + i * 120} y={440} k={0.82} w={104} />)}
      <Sale p={p('captura')} x={1340} y={760}><Dendritica k={0.7} /></Sale>
      <path d="M1340,720 C1330,640 1350,560 1340,430" fill="none" stroke={P.dc[1]} strokeWidth={16} strokeLinecap="round" opacity={easeOut(p('prolongaciones'))} />
      <Virion x={1340} y={lerp(330, 420, easeOut(p('atrapan')))} k={0.3} o={tramo(p('atrapan'), 0, 0.3)} reloj={reloj} />
      <Bandera x={1340} y={190} txt="prolongaciones dendríticas" color={P.dc[0]} p={p('captura')} t={26} punta="no" />
      <Txt x={1340} y={880} txt="se extienden entre las células del epitelio" t={22} p={p('extienden')} color="#FFF" />
    </g>
  );
};

// ─── 6 · El virus fundador y la diseminación ─────────────────────────────────
const Fundador: Lamina = ({ p, reloj }) => {
  return (
    <g>
      {/* la mucosa, con una sola variante que funda la infección */}
      <Capas x={300} y={420} w={600} fondo={300} bandas={HILLS} sem={13} />
      <Sale p={p('fundador')} x={300} y={300}><circle r={64} fill="none" stroke={P.espiga[1]} strokeWidth={9} /><Virion k={0.38} reloj={reloj} /></Sale>
      <Bandera x={300} y={170} txt="virus fundador" color={P.espiga[0]} p={p('fundador')} t={32} punta="abajo" />
      <Txt x={300} y={95} txt="una o pocas variantes" t={26} p={p('variantes')} />
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={tramo(p('focos'), i * 0.15, i * 0.15 + 0.5)} x={190 + i * 70} y={470 + (i % 2) * 40}><Virion k={0.22} reloj={reloj + i * 200} /></Sale>)}
      <Txt x={300} y={620} txt="pequeños focos en la mucosa" t={24} p={p('focos')} color="#FFF" />
      {/* los linfáticos llevan el virus a los ganglios, la sangre y los órganos linfoides */}
      <Trazo pts={[[470, 330], [560, 290], [680, 330], [790, 300]]} p={p('linfaticos')} color={P.virus[1]} w={12} />
      <Txt x={620} y={240} txt="linfáticos" t={26} p={p('linfaticos')} />
      <Sale p={p('ganglios')} x={880} y={300}><Ganglio k={1.1} /></Sale>
      <Txt x={880} y={400} txt="ganglios regionales" t={24} p={p('ganglios')} />
      <Trazo pts={[[1000, 300], [1100, 270], [1230, 310]]} p={p('sangre')} color={P.sangre[1]} w={12} />
      <Txt x={1110} y={225} txt="sangre" t={26} p={p('sangre')} color={TXV.sangre} />
      <Sale p={p('organos')} x={1380} y={300}><Bazo k={0.6} /></Sale>
      <Txt x={1380} y={400} txt="demás órganos linfoides" t={24} p={p('organos')} />
      {/* todo en la fase eclipse */}
      <rect x={700} y={470} width={800} height={46} rx={23} fill={P.inte[1]} opacity={0.9 * tramo(p('eclipse'), 0, 0.5)} />
      <rect x={700} y={470} width={Math.max(0.1, 800 * easeOut(p('eclipse')))} height={46} rx={23} fill={P.inte[0]} opacity={0.95} />
      <Txt x={1100} y={493} txt="fase eclipse" t={30} p={p('eclipse')} color="#FFF" />
      <Txt x={1100} y={555} txt="todavía nada se puede detectar" t={28} p={p('detectar')} />
      {/* el GALT se vacía de CD4 antes que la sangre */}
      <path d="M720,610 L720,930 L1500,930" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.45 * tramo(p('galt'), 0, 0.5)} />
      <Trazo pts={[[730, 650], [850, 660], [950, 780], [1150, 850], [1480, 905]]} p={p('galt')} color={P.sangre[1]} w={13} />
      <Txt x={730} y={965} txt="CD4 del intestino (GALT)" t={26} ancla="start" p={p('galt')} color={TXV.sangre} />
      <Trazo pts={[[730, 660], [1100, 665], [1230, 700], [1350, 800], [1480, 905]]} p={p('recuento')} color={P.cd4[1]} w={13} />
      <Txt x={1130} y={965} txt="CD4 de la sangre" t={26} ancla="start" p={p('recuento')} color={TXV.cd4} />
      <Txt x={330} y={850} txt="el intestino se vacía" t={28} p={p('antes')} color={TXV.sangre} />
      <Txt x={330} y={890} txt="antes de que caiga el recuento" t={26} p={p('antes')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosEpitelios, Recto, Vagina, Prepucio, Comite, TresRutas, Fundador];
export default LAMINAS;
