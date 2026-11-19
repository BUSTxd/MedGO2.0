'use client';
// Capítulo 16 · Inmunopatogenia y endarteritis

import type { Lamina } from '../Lienzo';
import { VasoCorte } from './ComunSifilis';
import { Bandera, Cerebro, CelGigante, Cruz, Cuerpo, Epitelioide, Escamoso, Flecha, FotoLente, Granuloma, IgG, Letra, Linfocito, Macrofago, Medallon, P, Plasmatica, Punto, Sale, Treponema, Txt, TXV, easeOut, hash, lerp, tramo } from '../Piezas';

// ─── 0 · El sistema inmunitario la ve por dentro ─────────────────────────────
const VistaPorDentro: Lamina = ({ p, reloj }) => {
  const rompe = easeOut(p('rompen'));
  return (
    <g>
      <Txt x={800} y={90} txt="la membrana la esconde... entera" t={34} p={p('dentro')} color={TXV.esp} />
      <Sale p={p('macrofagos')} x={520} y={500}><Macrofago k={1.5} /></Sale>
      <Bandera x={520} y={230} txt="macrófagos y células dendríticas" color="#B4560B" p={p('dendriticas')} t={26} punta="no" />
      <Sale p={p('fagosoma')} x={540} y={520}><circle r={110} fill="#FFF3C0" opacity={0.85} /><circle r={96} fill="#FFFAE0" /></Sale>
      <Treponema x={540} y={520} w={180 * (1 - 0.3 * rompe)} amp={18} vueltas={4} grosor={10} r={20 + 40 * rompe} reloj={reloj} o={tramo(p('fagocitan'), 0, 0.4) * (1 - 0.5 * rompe)} />
      <Txt x={520} y={760} txt="fagocitan a algunas espiroquetas y las rompen en el fagosoma" t={22} p={p('rompen')} />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={540 + (hash(i, 1) - 0.5) * 180} cy={520 + (hash(i, 2) - 0.5) * 150} r={11 * easeOut(tramo(p('lipoproteinas'), i * 0.08, i * 0.08 + 0.4))} fill={P.sangre[1]} />)}
      <Txt x={520} y={810} txt="las lipoproteínas quedan a la vista" t={24} p={p('lipoproteinas')} color={TXV.sangre} />
      {/* TLR2 las reconoce y enciende NF-κB */}
      <Sale p={p('tlr2')} x={880} y={420}><rect x={-14} y={-60} width={28} height={120} rx={14} fill={P.copa[0]} /><circle cy={-66} r={28} fill={P.copa[1]} /><circle cx={-8} cy={-74} r={7} fill="#FFF" opacity={0.7} /></Sale>
      <Bandera x={1040} y={420} txt="receptor TLR2" color={P.copa[0]} p={p('tlr2')} t={28} punta="no" />
      <Flecha a={[760, 500]} b={[850, 440]} p={p('reconoce')} color={P.sangre[1]} w={9} />
      <Sale p={p('nfkb')} x={880} y={620}><circle r={36} fill={P.espiga[0]} /><circle cx={-2} cy={-2} r={31} fill={P.espiga[1]} /><path d="M6,-24 L-12,4 L-1,4 L-8,24 L12,-6 L1,-6 Z" fill="#FFF" /></Sale>
      <Txt x={1040} y={620} txt="enciende NF-κB" t={28} ancla="start" p={p('nfkb')} color={TXV.ambar} />
      {Array.from({ length: 12 }, (_, i) => { const u = tramo(p('citocinas'), (i / 12) * 0.5, (i / 12) * 0.5 + 0.5); return <circle key={i} cx={900 + (i % 6) * 90} cy={lerp(700, 800, u) + (Math.floor(i / 6)) * 40} r={11 * easeOut(u)} fill={[P.sangre[1], P.espiga[1], P.hla[1]][i % 3]} />; })}
      <Txt x={1160} y={880} txt="citocinas inflamatorias" t={26} p={p('citocinas')} color={TXV.sangre} />
      {/* sin LPS no interviene TLR4: la inflamación es moderada */}
      <Sale p={p('lps')} x={1350} y={240}><rect x={-14} y={-50} width={28} height={100} rx={14} fill="#B7AEDB" /><circle cy={-56} r={24} fill="#D9D3EE" /></Sale>
      <Cruz x={1350} y={240} k={1.0} p={p('tlr4')} />
      <Txt x={1350} y={330} txt="sin LPS no interviene TLR4" t={24} p={p('tlr4')} />
      <Txt x={1350} y={375} txt="la inflamación es moderada" t={26} p={p('moderada')} color={TXV.verde} />
    </g>
  );
};

// ─── 1 · Th1 y opsonización ──────────────────────────────────────────────────
const Th1Opsonizacion: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="se limpia la lesión primaria" t={36} p={p('limpia')} color={TXV.violeta} />
    <Sale p={p('th1')} x={300} y={330}><Linfocito tono="th1" k={1.5} /></Sale>
    <Txt x={300} y={450} txt="linfocitos Th1" t={28} p={p('th1')} color={TXV.dc} />
    {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 2500 + i / 6) % 1) * easeOut(p('interferon')); return <g key={i} transform={`translate(${380 + u * 250},${330 + Math.sin(i * 2) * 60})`} opacity={(1 - u) * easeOut(p('interferon'))}><circle r={15} fill={P.espiga[1]} /><Letra txt="γ" t={20} color="#5A3A00" /></g>; })}
    <Txt x={560} y={450} txt="interferón gamma" t={24} p={p('interferon')} color={TXV.ambar} />
    <Sale p={p('activan')} x={860} y={330}><Macrofago k={0.7} /></Sale>
    <Txt x={860} y={480} txt="activan a los macrófagos" t={24} p={p('activan')} />
    {/* los anticuerpos opsonizantes marcan a las espiroquetas para que las fagociten */}
    <Treponema x={400} y={640} w={240} amp={16} vueltas={5} grosor={10} reloj={reloj} />
    {[300, 380, 460, 540].map((x, i) => <IgG key={x} x={x} y={600 + (i % 2) * 70} r={i % 2 ? 0 : 180} k={0.9} o={tramo(p('anticuerpos'), i * 0.1, i * 0.1 + 0.5)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />)}
    <Txt x={400} y={780} txt="anticuerpos opsonizantes" t={24} p={p('marcan')} color={TXV.ab} />
    <Flecha a={[620, 640]} b={[780, 600]} p={p('fagociten')} color={P.esp[1]} w={9} />
    <Sale p={p('fagociten')} x={900} y={640}><Macrofago k={0.6} /></Sale>
    {/* el chancro cicatriza solo, aunque ya haya diseminación */}
    <Sale p={p('chancro')} x={1260} y={350}><circle r={90 * (1 - 0.6 * easeOut(p('cicatriza')))} fill="#B5183F" /><circle r={64 * (1 - 0.6 * easeOut(p('cicatriza')))} fill="#F9C9D2" /></Sale>
    <Txt x={1260} y={490} txt="el chancro cicatriza solo" t={26} p={p('cicatriza')} color={TXV.verde} />
    {Array.from({ length: 8 }, (_, i) => <Treponema key={i} x={1180 + (i % 4) * 90} y={640 + Math.floor(i / 4) * 80} w={50} amp={6} vueltas={3} grosor={5} r={hash(i, 2) * 180} reloj={reloj + i * 100} o={easeOut(tramo(p('dispersado'), (i / 8) * 0.6, (i / 8) * 0.6 + 0.4))} />)}
    <Txt x={1260} y={760} txt="aunque ya se hayan dispersado" t={24} p={p('dispersado')} color={TXV.sangre} />
    <Txt x={1260} y={830} txt="la respuesta contiene…" t={30} p={p('contiene')} color={TXV.verde} />
    <Txt x={1260} y={880} txt="…pero no erradica" t={30} p={p('erradica')} color={TXV.sangre} />
  </g>
);

// ─── 2 · Las células endoteliales se activan ─────────────────────────────────
const EndotelioActiva: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="las espiroquetas: su blanco favorito son los vasos pequeños" t={34} p={p('blanco')} color={TXV.esp} />
    <Medallon x={620} y={540} R={330} id="vas" fondo="#6A0F2E">
      <circle r={200} fill="#E5324C" opacity={0.0} />
      <circle r={190} fill="#8A1030" />
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 196} cy={Math.sin(a) * 196} rx={32} ry={18} fill="#FF5A4A" transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 196} ${Math.sin(a) * 196})`} opacity={0.5 + 0.5 * easeOut(p('endoteliales'))} />; })}
      {/* moléculas de adhesión hacia la luz */}
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, q = easeOut(tramo(p('moleculas'), (i / 12) * 0.7, (i / 12) * 0.7 + 0.3)); return <g key={i} transform={`translate(${Math.cos(a) * 176},${Math.sin(a) * 176}) rotate(${(a * 180) / Math.PI + 90}) scale(${q})`}><rect x={-3} y={-40} width={6} height={40} rx={3} fill={[P.espiga, P.hla, P.virus][i % 3][1]} /><circle cy={-42} r={9} fill={[P.espiga, P.hla, P.virus][i % 3][1]} /></g>; })}
      {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + 0.3, r = 90 * (1 - 0.5 * easeOut(p('agarra'))) ; return <g key={i} transform={`translate(${Math.cos(a) * (r + 40 * easeOut(p('agarra')))},${Math.sin(a) * (r + 40 * easeOut(p('agarra')))})`} opacity={tramo(p('leucocitos'), 0, 0.4)}><Linfocito k={0.42} /></g>; })}
    </Medallon>
    <Txt x={620} y={930} txt="un vaso pequeño, en corte" t={24} p={p('vasos')} />
    <Bandera x={1180} y={260} txt="las células endoteliales se activan" color={P.sangre[0]} p={p('endoteliales')} t={28} punta="no" />
    <Txt x={1180} y={340} txt="y se llenan de moléculas de adhesión" t={24} p={p('moleculas')} />
    {[['ICAM-1', 'icam', P.espiga], ['VCAM-1', 'vcam', P.hla], ['E-selectina', 'selectina', P.virus]].map(([n, id, tono], i) => (
      <Bandera key={id as string} x={1180} y={440 + i * 80} txt={n as string} color={(tono as readonly string[])[0]} p={[p('icam'), p('vcam'), p('selectina')][i]} t={28} punta="no" />
    ))}
    <Txt x={1180} y={720} txt="el endotelio agarra a los leucocitos que pasan" t={24} p={p('agarra')} color={TXV.ambar} />
    <Txt x={1180} y={765} txt="para dejarlos entrar al tejido" t={24} p={p('entrar')} />
    <Bandera x={1180} y={860} txt="empieza la perivasculitis" color={P.hla[0]} p={p('perivasculitis')} t={30} punta="no" />
  </g>
);

// ─── 3 · El infiltrado de la sífilis ─────────────────────────────────────────
const InfiltradoSifilis: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="el infiltrado perivascular de la sífilis" t={38} p={p('perivascular')} color={TXV.violeta} />
    <Medallon x={560} y={540} R={340} id="inf" fondo="#F6D6E4">
      <circle r={90} fill="#8A1030" /><circle r={78} fill="#E5324C" opacity={0.85} />
      {Array.from({ length: 22 }, (_, i) => {
        const a = hash(i, 1) * Math.PI * 2, r = 130 + hash(i, 2) * 150;
        const q = easeOut(tramo(i < 6 ? p('linfocitos') : i < 11 ? p('histiocitos') : p('plasmaticas'), (i % 6) * 0.1, (i % 6) * 0.1 + 0.5));
        return i < 6 ? <g key={i} transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r}) scale(${q})`}><Linfocito k={0.42} /></g>
          : i < 11 ? <g key={i} transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r}) scale(${q})`}><Epitelioide k={0.5} /></g>
          : <g key={i} transform={`translate(${Math.cos(a) * r},${Math.sin(a) * r}) scale(${q})`}><Plasmatica k={0.42} r={hash(i, 3) * 360} /></g>;
      })}
    </Medallon>
    {/* «al microscopio»: lo dibujado se vuelve la foto real */}
    <FotoLente x={560} y={540} R={340} foto="infiltrado-plasmocitos" o={p('microscopio')} credito="arriba" />
    <Txt x={560} y={930} txt="linfocitos, histiocitos y, sobre todo, abundantes células plasmáticas" t={22} p={p('muchas')} />
    <Bandera x={1180} y={230} txt="la firma de la sífilis" color={P.esp[0]} p={p('firma')} t={32} punta="no" />
    <Txt x={1180} y={300} txt="al microscopio" t={24} p={p('microscopio')} />
    <Sale p={p('fabrican')} x={1000} y={480}><Plasmatica k={0.9} /></Sale>
    <Txt x={1000} y={580} txt="las células plasmáticas" t={24} p={p('fabrican')} />
    {[0, 1, 2, 3].map((i) => <IgG key={i} x={1240 + i * 60} y={430 + (i % 2) * 50} r={(i % 2) * 180} k={0.9} o={tramo(p('anticuerpos'), i * 0.1, i * 0.1 + 0.5)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />)}
    <Txt x={1340} y={580} txt="fabrican los anticuerpos" t={24} p={p('anticuerpos')} color={TXV.ab} />
    <Bandera x={1180} y={700} txt="reagina" color={P.hla[0]} p={p('reagina')} t={32} punta="no" />
    <Txt x={1180} y={780} txt="la famosa reagina, la que mide el RPR" t={24} p={p('rpr')} color={TXV.violeta} />
  </g>
);

// ─── 4 · La endarteritis ─────────────────────────────────────────────────────
const Endarteritis: Lamina = ({ p, reloj }) => {
  const etapas = [0, p('hinchan'), p('engruesa'), p('cierra')];
  return (
    <g>
      <Txt x={800} y={90} txt="la endarteritis" t={46} p={p('endarteritis')} color={TXV.violeta} />
      {[0, 1, 2, 3].map((i) => (
        <Sale key={i} p={i === 0 ? p('endoteliales') : etapas[i]} x={260 + i * 360} y={450}>
          <VasoCorte r={140} luz={[1, 0.75, 0.45, 0.14][i]} />
        </Sale>
      ))}
      <Txt x={260} y={680} txt="artería normal" t={24} p={p('endoteliales')} fuerte={false} />
      <Txt x={620} y={680} txt="las células endoteliales se hinchan y proliferan" t={20} p={p('proliferan')} />
      <Txt x={980} y={680} txt="la íntima se engruesa" t={22} p={p('intima')} />
      <Txt x={1340} y={680} txt="la luz se estrecha hasta casi cerrarse" t={20} p={p('estrecha')} color={TXV.sangre} />
      <Txt x={800} y={780} txt="hipoxia, isquemia y daño del tejido que irrigaba" t={32} p={p('hipoxia')} color={TXV.sangre} />
      <Txt x={400} y={850} txt="isquemia" t={26} p={p('isquemia')} /><Txt x={800} y={850} txt="daño del tejido" t={26} p={p('dano')} />
      <Txt x={560} y={930} txt="a veces se altera la lámina elástica interna" t={24} p={p('elastica')} />
      <Bandera x={1250} y={930} txt="trombosis" color={P.sangre[0]} p={p('trombosis')} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · El mismo mecanismo, en cada sitio ───────────────────────────────────
const MismoMecanismo: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="el mismo mecanismo, en cada sitio" t={42} p={p('mismo')} color={TXV.violeta} />
    {/* en la dermis: la ulceración del chancro */}
    <Escamoso x0={110} x1={470} y={250} filas={3} o={tramo(p('dermis'), 0, 0.5)} />
    <Sale p={p('ulcera')} x={290} y={250}><ellipse rx={90} ry={26} fill="#B5183F" /><ellipse rx={70} ry={16} fill="#F9C9D2" /></Sale>
    <Txt x={290} y={400} txt="dermis: la ulceración del chancro" t={22} p={p('chancro')} />
    {/* piel y mucosas: la erupción secundaria */}
    <Cuerpo x={760} y={470} k={0.5}>
      {[[-60, 60], [60, 40], [-30, 180], [50, 200], [0, -100], [-90, -40]].map(([x, y], i) => <Punto key={i} x={x} y={y} p={tramo(p('erupcion'), i * 0.1, i * 0.1 + 0.5)} color="#B8451E" />)}
    </Cuerpo>
    <Txt x={760} y={700} txt="piel y mucosas: la erupción secundaria" t={22} p={p('piel')} />
    {/* los vasa vasorum de la aorta: aortitis */}
    <Sale p={p('vasos')} x={1260} y={400}>
      <path d="M-120,200 L-120,-40 Q-120,-160 0,-160 Q120,-160 120,-40 L120,200" fill="none" stroke="#8A1030" strokeWidth={70} strokeLinecap="round" />
      <path d="M-120,200 L-120,-40 Q-120,-160 0,-160 Q120,-160 120,-40 L120,200" fill="none" stroke="#E5324C" strokeWidth={40} strokeLinecap="round" />
      {[[-150, -80], [-140, 10], [150, -60], [160, 20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9 * easeOut(p('aortitis'))} fill={P.espiga[1]} />)}
    </Sale>
    <Txt x={1260} y={700} txt="vasa vasorum de la aorta: aortitis" t={22} p={p('aortitis')} color={TXV.sangre} />
    {/* los vasos de las meninges y del cerebro */}
    <Sale p={p('cerebro')} x={760} y={870}><Cerebro k={0.7} /></Sale>
    <Txt x={1000} y={860} txt="vasos cerebrales y meníngeos:" t={22} ancla="start" p={p('meninges')} />
    <Txt x={1000} y={900} txt="sífilis meningovascular" t={26} ancla="start" p={p('meningobascular')} color={TXV.violeta} />
    <Txt x={290} y={620} txt="un solo proceso, en muchos lugares" t={26} p={p('proceso')} color={TXV.ambar} />
  </g>
);

// ─── 6 · La goma: hipersensibilidad tardía ───────────────────────────────────
const Goma: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="la goma" t={50} p={p('goma')} color={TXV.violeta} />
    <Granuloma x={520} y={540} k={1.0} p={p('granulomas')} necrosis={easeOut(p('necrotico'))} />
    {/* la goma de verdad, mientras se nombran el granuloma y su centro necrótico; luego vuelve el dibujo para ir célula por célula */}
    <FotoLente x={520} y={515} R={290} foto="goma-corte" o={tramo(p('granulomas'), 0, 0.5) * (1 - tramo(p('epitelioides'), 0, 0.4))} credito={[520, 874]} />
    <Txt x={520} y={840} txt="un centro necrótico, de aspecto gomoso" t={24} p={p('gomoso')} color={TXV.ambar} />
    {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.2; return <g key={i} transform={`translate(${520 + Math.cos(a) * 300},${540 + Math.sin(a) * 270}) scale(${easeOut(tramo(p('epitelioides'), (i / 8) * 0.6, (i / 8) * 0.6 + 0.4))})`}><Epitelioide k={0.55} /></g>; })}
    <Sale p={p('gigantes')} x={520} y={250}><CelGigante k={0.5} /></Sale>
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${300 + i * 110},900) scale(${easeOut(tramo(p('plasmaticas'), i * 0.1, i * 0.1 + 0.5))})`}><Plasmatica k={0.4} r={hash(i, 2) * 360} /></g>)}
    <Txt x={520} y={950} txt="histiocitos epitelioides, células gigantes y plasmocitos" t={20} p={p('plasmaticas')} />
    <Bandera x={1180} y={230} txt="en la sífilis tardía" color={P.esp[0]} p={p('tardia')} t={30} punta="no" />
    {[0, 1].map((i) => <Treponema key={i} x={1100 + i * 160} y={360} w={90} amp={9} vueltas={4} grosor={6} reloj={reloj + i * 300} o={tramo(p('pocos'), i * 0.3, i * 0.3 + 0.5)} />)}
    <Txt x={1180} y={420} txt="quedan muy pocos treponemas" t={26} p={p('pocos')} />
    <Txt x={1180} y={520} txt="pero el cuerpo reacciona:" t={30} p={p('reacciona')} color={TXV.sangre} />
    <Txt x={1180} y={575} txt="hipersensibilidad retardada" t={32} p={p('retardada')} color={TXV.violeta} />
    <Txt x={1180} y={780} txt="aquí no pesa la bacteria:" t={28} p={p('pesa')} />
    <Txt x={1180} y={830} txt="pesa la respuesta que provoca" t={32} p={p('pesa')} color={TXV.sangre} />
  </g>
);

const LAMINAS: Lamina[] = [VistaPorDentro, Th1Opsonizacion, EndotelioActiva, InfiltradoSifilis, Endarteritis, MismoMecanismo, Goma];
export default LAMINAS;
