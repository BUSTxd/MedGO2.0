'use client';
// Capítulo 4 · Células diana y tropismo

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Canal, Cerebro, CelGigante, Correceptor, Cruz, Dendritica, Escudo, Espiga, Flecha, Flota, Ganglio, Helice, Hombre, Hla, Intestino, Linfocito, Llave, Lomas, Macrofago, Microglia, P, Pastilla, Puerta, Reloj, Sale, Trazo, TuboEnsayo, Txt, TXV, Virion, Visto, BolsaSangre, easeOut, hash, lerp, tramo } from '../Piezas';

const TIPOS = [P.virus, P.esp, P.inte, P.hla, P.rt, P.cap] as const;

// ─── 0 · La cerradura de dos llaves ──────────────────────────────────────────
const CerraduraDosLlaves: Lamina = ({ p, reloj }) => {
  const e1 = easeOut(p('cd4')), e2 = easeOut(p('segunda'));
  const abre = p('abre');
  const luz = 1 - easeOut(abre);
  const Cerr = ({ y, tono, q }: { y: number; tono: readonly string[]; q: number }) => (
    <Sale p={q} x={860} y={y}>
      <Bola R={38} tono={[...tono]} />
      <circle r={9} fill={P.interior} /><rect x={-4} y={4} width={8} height={20} rx={4} fill={P.interior} />
    </Sale>
  );
  return (
    <g>
      <Sale p={p('cerradura')} x={400} y={650} k={0.75}><Virion reloj={reloj} /></Sale>
      <Puerta x={860} y={650} k={0.95} o={tramo(p('cerradura'), 0, 0.4)} abre={abre} />
      <g opacity={luz}>
        <Cerr y={565} tono={P.cd4} q={p('cerradura')} />
        <Cerr y={707} tono={P.inte} q={p('corrector')} />
      </g>
      <Bandera x={1130} y={565} txt="CD4" color={P.cd4[0]} p={p('cd4')} t={30} punta="no" />
      <Bandera x={1130} y={707} txt="correceptor" color={P.inte[0]} p={p('corrector')} t={30} punta="no" />
      <Llave x={lerp(640, 828, e1)} y={565} forma={1} tono={P.espiga} o={tramo(p('llaves'), 0, 0.5) * luz} />
      <Llave x={lerp(640, 828, e2)} y={707} forma={2} tono={P.hla} o={tramo(p('llaves'), 0, 0.5) * luz} />
      <Cruz x={1040} y={640} k={1.0} p={tramo(p('basta'), 0, 1) * (1 - easeOut(p('abre')))} />
      <Txt x={1130} y={640} txt="no basta" t={30} ancla="start" p={p('basta') * (1 - easeOut(p('abre')))} color={TXV.sangre} />
      <Visto x={1040} y={640} k={1.0} p={p('abre')} />
      {/* las células que tienen CD4 */}
      {[
        [270, 'linfocitos T colaboradores', p('linfocitos'), <Linfocito key="l" k={1.25} />],
        [590, 'monocitos y macrófagos', p('monocitos'), <Macrofago key="m" k={0.5} />],
        [910, 'células dendríticas', p('dendriticas'), <Dendritica key="d" k={1.1} />],
        [1230, 'microglía del cerebro', p('microglia'), <Microglia key="g" k={1.2} />],
      ].map(([x, n, q, icono]) => (
        <g key={n as string}>
          <Sale p={q as number} x={x as number} y={190}>{icono as ReactNode}</Sale>
          <Txt x={x as number} y={330} txt={n as string} t={24} p={q as number} />
        </g>
      ))}
    </g>
  );
};

// ─── 1 · CCR5: el que transmite ──────────────────────────────────────────────
const Ccr5Transmite: Lamina = ({ p, reloj }) => {
  const A = 1 - easeOut(p('fund'));
  const R = 58 * 2.4;
  return (
    <g>
      <g opacity={A}>
        <Bandera x={800} y={120} txt="CCR5" color={P.copa[0]} p={p('ccr5')} t={46} punta="no" />
        <Sale p={p('ccr5')} x={420} y={520}><Linfocito k={2.4} /></Sale>
        {[-125, -90, -55].map((a) => {
          const ar = (a * Math.PI) / 180;
          return <Correceptor key={a} x={420 + Math.cos(ar) * (R - 4)} y={520 + Math.sin(ar) * (R - 4)} r={a + 90} k={1.1 * easeOut(p('ccr5'))} />;
        })}
        <Txt x={420} y={690} txt="linfocito de memoria" t={30} p={p('memoria')} color={TXV.cd4} />
        <Sale p={p('macrofagos')} x={1070} y={540}><Macrofago k={0.85} /></Sale>
        {[[-20, -150], [40, -160], [100, -140]].map(([dx, dy], i) => <Correceptor key={i} x={1070 + dx} y={540 + dy} k={1.0 * easeOut(p('macrofagos'))} r={(i - 1) * 25} />)}
        <Txt x={1070} y={730} txt="macrófago" t={30} p={p('macrofagos')} color={TXV.mac} />
        <Sale p={p('r5')} x={750} y={330}><Virion k={0.5} reloj={reloj} tono={P.virus} /></Sale>
        <Bandera x={750} y={225} txt="virus R5" color={P.virus[0]} p={p('r5')} t={30} punta="abajo" />
        <Flecha a={[700, 360]} b={[520, 430]} p={tramo(p('r5'), 0.3, 1)} color={P.virus[1]} w={9} />
        <Flecha a={[800, 370]} b={[960, 440]} p={tramo(p('r5'), 0.3, 1)} color={P.virus[1]} w={9} />
        <Txt x={800} y={830} txt="transmiten la infección" t={40} p={p('transmiten')} color={TXV.sangre} />
        <Bandera x={800} y={900} txt="el correceptor preferido" color={P.copa[0]} p={p('preferido')} t={28} punta="no" />
        <Txt x={800} y={960} txt="sobre todo al inicio" t={30} p={p('inicio')} />
      </g>
      {/* los virus fundadores: de muchos, entra una sola variante */}
      <g opacity={tramo(p('fund'), 0, 0.5)}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = hash(i, 4) * Math.PI * 2, r = 40 + hash(i, 5) * 170;
          return <Virion key={i} x={330 + Math.cos(a) * r * 1.1} y={540 + Math.sin(a) * r * 0.9} k={0.4} tono={TIPOS[i % 6]} reloj={reloj + i * 150} />;
        })}
        <Txt x={330} y={800} txt="muchas variantes" t={34} p={p('fund')} />
        <Puerta x={790} y={540} k={0.62} abre={0.3} />
        <Sale p={p('fund')} x={1180} y={540}><Linfocito k={2.2} /></Sale>
        <Sale p={p('sola')} x={1040} y={470}>
          <circle r={64} fill="none" stroke={P.espiga[1]} strokeWidth={9} />
          <Virion k={0.38} reloj={reloj} tono={P.virus} />
        </Sale>
        <Bandera x={1040} y={350} txt="virus fundador" color={P.espiga[0]} p={p('sola')} t={34} punta="abajo" />
        <Txt x={800} y={900} txt="una sola variante, o muy pocas" t={38} p={p('pocas')} color={TXV.ambar} />
      </g>
    </g>
  );
};

// ─── 2 · CXCR4 y el cambio de tropismo ───────────────────────────────────────
const Cxcr4Cambio: Lamina = ({ p, reloj }) => {
  const R = 58 * 1.9;
  const mu = easeOut(p('muta'));
  return (
    <g>
      <Sale p={p('x4')} x={300} y={440} k={0.7}><Virion reloj={reloj} tono={P.inte} /></Sale>
      <Bandera x={300} y={310} txt="virus X4" color={P.inte[0]} p={p('x4')} t={30} punta="abajo" />
      <Bandera x={700} y={235} txt="CXCR4" color={P.esp[0]} p={p('cxcr4')} t={34} punta="abajo" />
      <Sale p={p('cxcr4')} x={700} y={460}><Linfocito k={1.9} /></Sale>
      {[-120, -90, -60].map((a) => { const ar = (a * Math.PI) / 180; return <Correceptor key={a} x={700 + Math.cos(ar) * (R - 4)} y={460 + Math.sin(ar) * (R - 4)} r={a + 90} tipo="cxcr4" k={1.0 * easeOut(p('cxcr4'))} />; })}
      <Txt x={700} y={600} txt="linfocitos vírgenes" t={30} p={p('virgenes')} color={TXV.cd4} />
      <Txt x={1080} y={290} txt="aparecen tarde" t={40} p={p('tarde')} color={TXV.violeta} />
      <Txt x={1080} y={345} txt="en cerca de la mitad de las personas" t={26} p={p('mitad')} />
      <Txt x={1080} y={390} txt="tras años de infección" t={26} p={p('anos')} />
      {/* el virus cambia de correceptor por una mutación del asa V3 */}
      <Sale p={p('cambiar')} x={200} y={780} k={0.5}><Virion reloj={reloj} tono={P.virus} /></Sale>
      <Txt x={200} y={880} txt="R5" t={32} p={p('cambiar')} color={TXV.virus} />
      <Flecha a={[310, 780]} b={[440, 780]} p={tramo(p('cambiar'), 0.2, 1)} color="var(--cit-flecha)" w={12} />
      <Sale p={p('cambiar')} x={560} y={780} k={0.5}><Virion reloj={reloj + 300} tono={P.inte} /></Sale>
      <Txt x={560} y={880} txt="X4" t={32} p={p('cambiar')} color={TXV.violeta} />
      <Sale p={p('muta')} x={900} y={850}><Espiga k={3} /></Sale>
      <circle cx={900} cy={850 - 34 * 3 - 18} r={44 * mu} fill="none" stroke={P.sangre[1]} strokeWidth={8} />
      <Bandera x={1010} y={690} txt="asa V3 de la gp120" color={P.sangre[0]} p={p('asa')} t={28} punta="no" />
      {/* los CD4 caen más rápido */}
      <Trazo pts={[[1150, 650], [1280, 670], [1380, 760], [1490, 890]]} p={p('caen')} color={P.sangre[1]} w={12} />
      <Txt x={1330} y={625} txt="CD4 cae más rápido" t={30} p={p('caen')} color={TXV.sangre} />
      {/* antes del fármaco contra CCR5, una prueba de tropismo */}
      <Sale p={p('farmaco')} x={1000} y={500}><Flota x={0} y={0} rl={reloj} alto={5}><Pastilla r={-30} k={1.2} /></Flota></Sale>
      <Txt x={1000} y={570} txt="fármaco contra CCR5" t={24} p={p('farmaco')} />
      <Sale p={p('prueba')} x={1480} y={460}><TuboEnsayo k={1.0} reloj={reloj} color={P.inte[1]} /></Sale>
      <Txt x={1440} y={575} txt="prueba de tropismo" t={26} p={p('prueba')} color={TXV.violeta} />
    </g>
  );
};

// ─── 3 · CCR5Δ32 ─────────────────────────────────────────────────────────────
const Ccr5Delta32: Lamina = ({ p, reloj }) => {
  const R = 58 * 1.6;
  return (
    <g>
      {/* el gen, con 32 pares de bases menos */}
      <Helice x={500} y={170} w={420} amp={26} vueltas={2.2} p={p('delecion')} fase={reloj / 1500} />
      <Helice x={1100} y={170} w={420} amp={26} vueltas={2.2} p={p('delecion')} fase={reloj / 1500 + 1} />
      <rect x={730} y={120} width={140} height={100} rx={14} fill="none" stroke={P.sangre[1]} strokeWidth={7} strokeDasharray="14 10" opacity={p('par32')} />
      <Txt x={800} y={290} txt="32 pares de bases menos" t={34} p={p('par32')} color={TXV.sangre} />
      {/* receptor normal frente a receptor truncado */}
      <Sale p={p('ccr5')} x={330} y={560}><Linfocito k={1.6} /></Sale>
      {[-125, -95, -65].map((a) => { const ar = (a * Math.PI) / 180; return <Correceptor key={a} x={330 + Math.cos(ar) * (R - 4)} y={560 + Math.sin(ar) * (R - 4)} r={a + 90} k={0.9 * easeOut(p('ccr5'))} />; })}
      <Txt x={330} y={700} txt="CCR5 normal" t={30} p={p('ccr5')} />
      <Sale p={p('truncada')} x={830} y={560}><Linfocito k={1.6} /></Sale>
      {[-30, 0, 30].map((dx, i) => <rect key={i} x={830 + dx * 1.2 - 8} y={560 - 14 + (i % 2) * 14} width={16} height={34 * easeOut(p('truncada'))} rx={8} fill={P.copa[1]} />)}
      <Txt x={830} y={700} txt="CCR5Δ32: no llega a la superficie" t={28} p={p('superficie')} color={TXV.violeta} />
      <Sale p={p('superficie')} x={830} y={380}><Virion k={0.35} reloj={reloj} /></Sale>
      <Cruz x={830} y={440} k={0.8} p={p('superficie')} />
      {/* dos copias, una copia, y los europeos */}
      <Sale p={p('copias')} x={1260} y={400}><Escudo k={0.65} id="esc43" /></Sale>
      <Txt x={1470} y={370} txt="2 copias" t={34} p={p('copias')} color={TXV.verde} />
      <Txt x={1470} y={415} txt="mucha protección" t={26} p={p('proteccion')} />
      <Sale p={p('europeos')} x={1260} y={590}>
        <circle r={50} fill={P.cd4[1]} /><path d="M0,0 L0,-50 A50,50 0 0 1 6,-49.6 Z" fill={P.sangre[1]} />
        <circle r={50} fill="none" stroke="#FFF" strokeWidth={5} opacity={0.6} />
      </Sale>
      <Txt x={1470} y={575} txt="≈ 1 % de los europeos" t={26} p={p('europeos')} />
      <Txt x={1380} y={700} txt="1 copia: progresión lenta" t={28} p={p('progresion')} color={TXV.ambar} />
      {/* Berlín y Londres: un trasplante de células madre y la remisión */}
      <Sale p={p('berlin')} x={300} y={850}><Hombre k={0.2} piel={P.piel2} /></Sale>
      <Txt x={300} y={925} txt="Berlín" t={26} p={p('berlin')} />
      <Sale p={p('londres')} x={560} y={850}><Hombre k={0.2} piel={P.piel2} pelo="#3A1B8E" /></Sale>
      <Txt x={560} y={925} txt="Londres" t={26} p={p('londres')} />
      <Sale p={p('trasplante')} x={820} y={850}><BolsaSangre k={0.5} /></Sale>
      <Txt x={820} y={935} txt="trasplante de células madre" t={24} p={p('trasplante')} />
      <Flecha a={[890, 850]} b={[1020, 850]} p={tramo(p('donante'), 0, 1)} color="var(--cit-flecha)" w={9} />
      <Txt x={1010} y={805} txt="donante con 2 copias" t={24} ancla="start" p={p('donante')} />
      <Visto x={1250} y={850} k={0.9} p={p('remision')} />
      <Txt x={1300} y={850} txt="remisión" t={38} ancla="start" p={p('remision')} color={TXV.verde} />
    </g>
  );
};

// ─── 4 · DC-SIGN: capturar sin infectar ──────────────────────────────────────
const DcSign: Lamina = ({ p, reloj }) => {
  const via = easeOut(p('viajan'));
  const ent = easeOut(p('entregan'));
  const cur = (t: number): [number, number] => [lerp(560, 1010, t) , lerp(560, 360, t) - Math.sin(t * Math.PI) * 120];
  return (
    <g>
      <Lomas x={800} y={800} w={1800} fondo={1100} bandas={[[0, '#F58AD0', 46], [60, '#E22BC4', 52], [70, '#8A15A8', 58]]} sem={11} o={tramo(p('mucosa'), 0, 0.5)} />
      {/* los virus llegan a la mucosa y los capturan sin infectarse */}
      {[[250, 330], [400, 260], [560, 340]].map(([vx, vy], i) => {
        const cap = easeOut(p('atrapan'));
        const ruta = easeOut(tramo(p('viajan'), i * 0.12, i * 0.12 + 0.6));
        const [qx, qy] = cur(ruta);
        const px = ruta > 0.01 ? qx : lerp(vx as number, 420 + (i - 1) * 40, cap), py = ruta > 0.01 ? qy : lerp(vy as number, 600 - 40 * (i % 2), cap);
        return <Virion key={i} x={px} y={py} k={0.3} o={tramo(p('capturan'), i * 0.2, i * 0.2 + 0.4)} glico={p('azucares')} reloj={reloj + i * 200} />;
      })}
      <Sale p={p('dendriticas')} x={440} y={660}><Dendritica k={1.15} /></Sale>
      <Bandera x={440} y={800} txt="célula dendrítica de la mucosa" color={P.dc[0]} p={p('dendriticas')} t={26} punta="no" />
      {[0, 1, 2, 3].map((i) => {
        const a = (-150 + i * 40) * Math.PI / 180;
        return <Hla key={i} x={440 + Math.cos(a) * 62} y={660 + Math.sin(a) * 62} r={-150 + i * 40 + 90} k={1.5 * easeOut(p('lectina'))} tono={P.esp} />;
      })}
      <Bandera x={250} y={470} txt="CCR5" color={P.copa[0]} p={p('ccr5')} t={24} punta="no" />
      <Bandera x={640} y={480} txt="DC-SIGN: una lectina" color={P.esp[0]} p={p('dcsign')} t={26} punta="no" />
      <Txt x={640} y={530} txt="reconoce los azúcares de la gp120" t={24} p={p('azucares')} />
      {/* viaja al ganglio y entrega los virus a los CD4 */}
      <Sale p={p('ganglios')} x={1150} y={280}><Ganglio k={1.3} /></Sale>
      <Txt x={1150} y={420} txt="ganglio" t={28} p={p('ganglios')} />
      {[[1030, 430], [1170, 450], [1300, 400]].map(([cx, cy], i) => <Sale key={i} p={tramo(ent, i * 0.2, i * 0.2 + 0.6)} x={cx as number} y={cy as number}><Linfocito k={0.7} /></Sale>)}
      <Txt x={1170} y={540} txt="los entrega a los CD4" t={28} p={p('entregan')} color={TXV.cd4} />
      <Txt x={850} y={160} txt="el caballo de Troya" t={44} p={p('troya')} color={TXV.violeta} />
      {/* Langerhans: su langerina destruye al virus */}
      <Sale p={p('langer')} x={1260} y={680}><Dendritica k={0.9} tono={P.esp} brazos={6} /></Sale>
      <Bandera x={1260} y={810} txt="célula de Langerhans: langerina" color={P.esp[0]} p={p('langerina')} t={24} punta="no" />
      <Sale p={p('langerina')} x={1130} y={600}><Virion k={0.3} reloj={reloj} /></Sale>
      <g opacity={p('destruye')}>
        <path d="M1118,580 L1136,598 L1122,614 M1142,590 L1130,606" fill="none" stroke="#2A1A5A" strokeWidth={6} strokeLinecap="round" />
      </g>
      <Cruz x={1130} y={600} k={0.7} p={p('destruye')} />
      <Txt x={1270} y={730} txt="una barrera natural" t={32} p={p('barrera')} color={TXV.verde} />
    </g>
  );
};

// ─── 5 · Macrófagos y microglía ──────────────────────────────────────────────
const MacrofagosMicroglia: Lamina = ({ p, reloj }) => {
  const fus = easeOut(p('fusionan'));
  return (
    <g>
      {/* el linfocito infectado muere pronto */}
      <Sale p={p('pronto')} x={280} y={420}>
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-120} width={8} height={26} rx={4} fill="#E5324C" transform={`rotate(${i * 30})`} />)}
        <Linfocito k={1.6} />
      </Sale>
      <Cruz x={280} y={420} k={1.2} p={tramo(p('pronto'), 0.5, 1)} />
      <Txt x={280} y={560} txt="mueren pronto" t={34} p={p('pronto')} color={TXV.sangre} />
      {/* el macrófago resiste, vive mucho y produce virus durante semanas */}
      <Sale p={p('macrofagos')} x={800} y={420}><Macrofago k={0.8} /></Sale>
      {Array.from({ length: 8 }, (_, i) => {
        const u = (reloj / 3500 + i / 8) % 1, a = (i / 8) * Math.PI * 2;
        return <Virion key={i} x={800 + Math.cos(a) * (150 + 120 * u)} y={420 + Math.sin(a) * (130 + 100 * u)} k={0.22} o={tramo(p('semanas'), 0, 0.4) * (1 - u)} reloj={reloj} />;
      })}
      <Txt x={800} y={580} txt="resiste y vive mucho tiempo" t={32} p={p('resisten')} color={TXV.mac} />
      <Sale p={p('semanas')} x={640} y={680}><Reloj k={0.6} ang={lerp(0, 1440, p('semanas'))} /></Sale>
      <Txt x={800} y={680} txt="produce virus durante semanas" t={30} ancla="start" p={p('semanas')} />
      {/* el cerebro y la microglía */}
      <Sale p={p('cerebro')} x={1330} y={340}><Cerebro k={1.1} /></Sale>
      <Sale p={p('microglia')} x={1380} y={380}><Microglia k={0.9} /></Sale>
      <Bandera x={1330} y={540} txt="refugio del virus" color={P.esp[0]} p={p('refugio')} t={30} punta="no" />
      <Txt x={1330} y={600} txt="microglía" t={30} p={p('microglia')} color={TXV.esp} />
      {/* encefalitis: macrófagos y microglía se fusionan en células gigantes */}
      <Bandera x={300} y={800} txt="encefalitis por VIH" color={P.sangre[0]} p={p('encefalitis')} t={30} punta="no" />
      <Macrofago x={lerp(560, 800, fus)} y={lerp(860, 840, fus)} k={0.26} o={tramo(p('fusionan'), 0, 0.2) * (1 - fus)} />
      <Microglia x={lerp(1060, 800, fus)} y={lerp(860, 840, fus)} k={0.6} o={tramo(p('fusionan'), 0, 0.2) * (1 - fus)} />
      <Sale p={p('gigantes')} x={800} y={840}><CelGigante k={0.8} /></Sale>
      <Txt x={1150} y={840} txt="células gigantes multinucleadas" t={28} ancla="start" p={p('gigantes')} />
      <Visto x={1100} y={900} k={0.7} p={p('sello')} />
      <Txt x={1150} y={900} txt="el sello de la enfermedad en el tejido" t={26} ancla="start" p={p('sello')} color={TXV.violeta} />
    </g>
  );
};

// ─── 6 · Los CD4 de memoria del intestino ────────────────────────────────────
const CD4Intestino: Lamina = ({ p, reloj }) => {
  const R = 58 * 2.8, CX = 520, CY = 440;
  const tocan = easeOut(p('gp120'));
  return (
    <g>
      <Sale p={p('intestino')} x={800} y={880}><Intestino k={1.0} /></Sale>
      <Txt x={800} y={965} txt="intestino" t={28} p={p('intestino')} />
      <Sale p={p('memoria')} x={CX} y={CY + 50}><Linfocito k={2.8} /></Sale>
      <Bandera x={CX} y={110} txt="linfocito T de memoria" color={P.cd4[0]} p={p('memoria')} t={30} punta="abajo" />
      {[-135, -75].map((a) => { const ar = (a * Math.PI) / 180; return <Canal key={a} x={CX + Math.cos(ar) * (R - 6)} y={CY + Math.sin(ar) * (R - 6)} r={a + 90} k={0.4 * easeOut(p('abundantes'))} alto={70} tono={P.cd4} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} hueco={P.interior} />; })}
      {[-105].map((a) => { const ar = (a * Math.PI) / 180; return <Correceptor key={a} x={CX + Math.cos(ar) * (R - 4)} y={CY + Math.sin(ar) * (R - 4)} r={a + 90} k={1.2 * easeOut(p('csr5'))} />; })}
      {[-45, -15].map((a) => { const ar = (a * Math.PI) / 180; return <Hla key={a} x={CX + Math.cos(ar) * (R - 4)} y={CY + Math.sin(ar) * (R - 4)} r={a + 90} k={2.2 * easeOut(p('integrina'))} tono={P.cap} />; })}
      <Bandera x={170} y={290} txt="CCR5" color={P.copa[0]} p={p('csr5')} t={26} punta="no" />
      <Bandera x={900} y={290} txt="integrina α4β7" color={P.cap[0]} p={p('integrina')} t={26} punta="no" />
      <Txt x={170} y={345} txt="abundantes y activados" t={24} p={p('activados')} />
      <Txt x={900} y={345} txt="los dirige de vuelta al intestino" t={24} p={p('dirige')} />
      <Sale p={p('gp120')} x={lerp(1250, 930, tocan)} y={lerp(240, 420, tocan)}><Virion k={0.55} reloj={reloj} /></Sale>
      <Txt x={1230} y={430} txt="la gp120 también se une a ella" t={26} p={p('gp120')} color={TXV.ambar} />
      {/* GALT: el primer gran campo de batalla */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = hash(i, 8) * Math.PI * 2, r = 30 + hash(i, 9) * 110;
        return <Sale key={i} p={tramo(p('galt'), (i / 14) * 0.6, (i / 14) * 0.6 + 0.4)} x={1250 + Math.cos(a) * r * 1.3} y={700 + Math.sin(a) * r * 0.6}><Linfocito k={0.36} tono={i % 3 ? 't' : 'cd8'} /></Sale>;
      })}
      <Bandera x={1250} y={560} txt="GALT: el tejido linfoide del intestino" color={P.rt[0]} p={p('galt')} t={26} punta="no" />
      <Txt x={1250} y={870} txt="el primer gran campo de batalla" t={32} p={p('campo')} color={TXV.sangre} />
      <Txt x={1250} y={925} txt="adonde llega el virus" t={26} p={p('llega')} />
      <Txt x={800} y={110} txt="próximo capítulo: la mucosa" t={30} p={p('capitulo')} color={TXV.violeta} />
    </g>
  );
};

const LAMINAS: Lamina[] = [CerraduraDosLlaves, Ccr5Transmite, Cxcr4Cambio, Ccr5Delta32, DcSign, MacrofagosMicroglia, CD4Intestino];
export default LAMINAS;
