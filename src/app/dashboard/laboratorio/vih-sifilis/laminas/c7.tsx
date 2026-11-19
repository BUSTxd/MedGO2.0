'use client';
// Capítulo 7 · La respuesta inmunitaria y la caída de los CD4

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Cremallera, Cruz, Dendritica, Enterocito, Espiga, Flecha, Hla, Helice, IgG, Intestino, Letra, Linfocito, P, Sale, Termometro, Tijeras, Trazo, Txt, TXV, Virion, Visto, easeOut, hash, lerp, tramo } from '../Piezas';

const Camaras = ({ cur, o = 1 }: { cur: number; o?: number }) => (
  <g opacity={o}>
    {['directo', 'espectadores', 'piroptosis', 'intestino', 'barrera'].map((n, i) => (
      <g key={n} transform={`translate(${1000 + i * 100},58)`}>
        {i === cur && <circle r={32} fill="none" stroke={P.espiga[1]} strokeWidth={7} />}
        <circle r={22} fill={i <= cur ? P.sangre[1] : P.inte[2]} opacity={i <= cur ? 1 : 0.7} />
        <Letra txt={String(i + 1)} t={24} color={i <= cur ? '#FFF' : '#3A2A6A'} />
      </g>
    ))}
  </g>
);

// ─── 0 · La alarma innata ────────────────────────────────────────────────────
const AlarmaInnata: Lamina = ({ p, reloj }) => {
  const ola = easeOut(p('oleada'));
  return (
    <g>
      <Txt x={800} y={100} txt="los primeros días, antes de que existan anticuerpos" t={34} p={p('dias')} color={TXV.violeta} />
      <Sale p={p('dendriticas')} x={330} y={420}><Dendritica k={1.5} /></Sale>
      <Bandera x={330} y={250} txt="célula dendrítica plasmocitoide" color={P.dc[0]} p={p('dendriticas')} t={26} punta="abajo" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2, u = ((reloj / 2200 + i / 10) % 1) * easeOut(p('interferon'));
        return <circle key={i} cx={330 + Math.cos(a) * (120 + 150 * u)} cy={420 + Math.sin(a) * (120 + 150 * u)} r={10} fill={P.espiga[1]} opacity={(1 - u) * easeOut(p('interferon'))} />;
      })}
      <Txt x={330} y={640} txt="interferón de tipo I" t={30} p={p('interferon')} color={TXV.ambar} />
      <Sale p={p('nk')} x={760} y={420}><Linfocito tono="cd8" k={1.2} /></Sale>
      <Txt x={760} y={540} txt="células NK activadas" t={28} p={p('nk')} color={TXV.cd8} />
      {/* una oleada de citocinas inunda la sangre */}
      {Array.from({ length: 36 }, (_, i) => {
        const u = tramo(p('citocinas'), (i / 36) * 0.5, (i / 36) * 0.5 + 0.5);
        return <circle key={i} cx={lerp(100, 1500, hash(i, 1) * u + (1 - u) * 0.1)} cy={760 + (hash(i, 2) - 0.5) * 120} r={9 * easeOut(u)} fill={[P.sangre[1], P.espiga[1], P.hla[1]][i % 3]} opacity={0.9 - 0.4 * (1 - easeOut(u))} />;
      })}
      <Txt x={800} y={890} txt="una oleada de citocinas e inflamación" t={32} p={p('oleada')} color={TXV.sangre} />
      {/* llega incluso antes del pico del virus */}
      <Trazo pts={[[1000, 330], [1100, 330], [1190, 230], [1280, 330], [1400, 345], [1500, 350]]} p={p('pico')} color={P.virus[1]} w={11} />
      <Txt x={1250} y={190} txt="pico del virus" t={26} p={p('pico')} color={TXV.virus} />
      <Trazo pts={[[1000, 390], [1060, 390], [1130, 300], [1200, 390], [1300, 400], [1500, 400]]} p={p('citocinas')} color={P.sangre[1]} w={11} />
      <Txt x={1100} y={450} txt="citocinas, antes" t={26} p={p('citocinas')} color={TXV.sangre} />
      <Sale p={p('sintomas')} x={1380} y={600}><Termometro k={0.8} val={0.9} /></Sale>
      <Txt x={1380} y={690} txt="síntomas de la fase aguda" t={24} p={p('sintomas')} />
      <Txt x={1130} y={600} txt="potente, pero" t={32} p={p('potente')} ancla="end" color={TXV.verde} />
      <Cruz x={1170} y={598} k={0.8} p={p('apagar')} />
      <Txt x={1130} y={650} txt="no apaga la replicación" t={28} p={p('apagar')} ancla="end" color={TXV.sangre} />
    </g>
  );
};

// ─── 1 · Los citotóxicos ─────────────────────────────────────────────────────
const Citotoxicos: Lamina = ({ p, reloj }) => {
  const mata = easeOut(p('matan'));
  const mu = easeOut(p('muta'));
  const nef = easeOut(p('esconde'));
  return (
    <g>
      <Sale p={p('citotoxicos')} x={330} y={470}><Linfocito tono="cd8" k={1.7} /></Sale>
      <Bandera x={330} y={300} txt="linfocito citotóxico (CD8)" color="#6D28D9" p={p('cd8')} t={26} punta="abajo" />
      <Sale p={p('hla')} x={900} y={470}><Linfocito k={1.9} o={1 - 0.7 * mata} /></Sale>
      <Virion x={900} y={470} k={0.34} o={tramo(p('hla'), 0, 0.5) * (1 - mata)} reloj={reloj} />
      {[-70, -35, 0, 35, 70].map((a, i) => {
        const ar = ((a - 180) * Math.PI) / 180;
        return <Hla key={i} x={900 + Math.cos(ar) * 112} y={470 + Math.sin(ar) * 112} r={a - 180 + 90} k={1.9 * easeOut(p('hla')) * (1 - nef)} />;
      })}
      {[-70, -35, 0, 35, 70].map((a, i) => {
        const ar = ((a - 180) * Math.PI) / 180;
        return <polygon key={i} points="-9,-8 9,-8 0,10" transform={`translate(${900 + Math.cos(ar) * 146},${470 + Math.sin(ar) * 146}) rotate(${a - 180 + 90})`} fill={mu > 0.5 ? P.sangre[1] : P.virus[1]} opacity={easeOut(p('peptidos')) * (1 - nef)} />;
      })}
      <Txt x={640} y={330} txt="péptidos virales" t={26} p={p('peptidos')} color={TXV.virus} />
      <Txt x={640} y={370} txt="presentados por HLA de clase I" t={24} p={p('hla')} />
      <Flecha a={[480, 470]} b={[740, 470]} p={p('matan')} color={P.sangre[1]} w={14} />
      <Cruz x={900} y={470} k={1.3} p={p('matan')} />
      <Txt x={620} y={560} txt="matan células infectadas" t={30} p={p('matan')} color={TXV.sangre} />
      {/* la viremia baja al set point */}
      <path d="M1100,300 L1100,560 L1520,560" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * tramo(p('pico'), 0, 0.5)} />
      <Trazo pts={[[1110, 540], [1190, 330], [1260, 320], [1340, 460], [1410, 470], [1510, 472]]} p={p('baja')} color={P.virus[1]} w={12} />
      <Txt x={1300} y={285} txt="pico" t={26} p={p('pico')} />
      <path d="M1340,470 L1520,470" stroke={P.espiga[1]} strokeWidth={5} strokeDasharray="12 10" opacity={p('estable')} />
      <Txt x={1430} y={520} txt="nivel estable" t={24} p={p('estable')} color={TXV.ambar} />
      {/* el virus contraataca: muta los fragmentos y Nef esconde el HLA */}
      <Txt x={800} y={700} txt="el virus contraataca" t={40} p={p('contraataca')} color={TXV.sangre} />
      <Txt x={800} y={760} txt="muta los fragmentos que presenta" t={28} p={p('muta')} />
      <Txt x={800} y={805} txt="Nef esconde las moléculas HLA" t={28} p={p('nef')} color={TXV.violeta} />
      <Bandera x={560} y={900} txt="HLA-B*57" color={P.virus[0]} p={p('b57')} t={30} punta="no" />
      <Bandera x={860} y={900} txt="HLA-B*27" color={P.virus[0]} p={p('b27')} t={30} punta="no" />
      <Visto x={1020} y={900} k={0.8} p={p('control')} />
      <Txt x={1070} y={900} txt="mejor control" t={32} ancla="start" p={p('control')} color={TXV.verde} />
    </g>
  );
};

// ─── 2 · Los anticuerpos llegan tarde ────────────────────────────────────────
const AnticuerposTarde: Lamina = ({ p, reloj }) => {
  const qs = [p('semanas'), p('meses'), p('anos')];
  return (
    <g>
      <Trazo pts={[[120, 700], [1500, 700]]} p={p('anticuerpos')} color="var(--cit-texto-2)" w={10} o={0.5} />
      {[[300, 'semanas'], [800, 'meses'], [1300, 'años']].map(([x, n], i) => (
        <g key={n as string}>
          <Sale p={qs[i]} x={x as number} y={700}><circle r={22} fill={P.hla[0]} /><circle r={17} fill={P.hla[1]} /></Sale>
          <Txt x={x as number} y={770} txt={n as string} t={34} p={qs[i]} color={TXV.violeta} />
        </g>
      ))}
      {/* primeros: anti-gp41 y anti-gp120 que no neutralizan */}
      <Sale p={p('gp41')} x={230} y={470}><IgG k={2.2} tono={['#8F89B8', '#BDB4DD', '#E6E0F7']} /></Sale>
      <Sale p={p('gp120')} x={370} y={470}><IgG k={2.2} tono={['#8F89B8', '#BDB4DD', '#E6E0F7']} /></Sale>
      <Txt x={230} y={400} txt="anti-gp41" t={24} p={p('gp41')} />
      <Txt x={370} y={400} txt="anti-gp120" t={24} p={p('gp120')} />
      <Cruz x={300} y={545} k={0.8} p={p('neutralizan')} />
      <Txt x={300} y={625} txt="no neutralizan" t={26} p={p('neutralizan')} color={TXV.sangre} />
      {/* los neutralizantes llegan meses después: la espícula ya cambió */}
      <Sale p={p('cambio')} x={800} y={540}><Espiga k={2.6} glico={p('escudo')} /></Sale>
      <Txt x={800} y={290} txt="zonas variables cambiadas" t={26} p={p('cambio')} color={TXV.ambar} />
      <Txt x={800} y={335} txt="escudo de azúcares" t={26} p={p('escudo')} color={TXV.dc} />
      <IgG x={lerp(1010, 905, easeOut(p('neutralizan')))} y={530} r={-90} k={2.0} o={tramo(p('meses'), 0, 0.5)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />
      <Cruz x={940} y={560} k={0.7} p={p('escudo')} />
      {/* tras años, unos pocos desarrollan anticuerpos ampliamente neutralizantes */}
      <Sale p={p('ampliamente')} x={1300} y={480}><IgG k={2.6} tono={['#B07A00', '#F2B21C', '#FFE49A']} /></Sale>
      <Txt x={1300} y={600} txt="ampliamente neutralizantes" t={26} p={p('ampliamente')} color={TXV.ambar} />
      <Bandera x={1300} y={330} txt="una pista para vacunas y tratamientos" color={P.virus[0]} p={p('vacunas')} t={26} punta="abajo" />
    </g>
  );
};

// ─── 3 · Efecto directo y citotóxicos ────────────────────────────────────────
const EfectoDirecto: Lamina = ({ p, reloj }) => (
  <g>
    <Camaras cur={0} o={p('primera')} />
    <Txt x={500} y={110} txt="¿por qué se pierden los CD4?" t={38} p={p('pregunta')} color={TXV.violeta} />
    <Sale p={p('fabrica')} x={420} y={430}><Linfocito k={2.2} /></Sale>
    {Array.from({ length: 5 }, (_, i) => <Virion key={i} x={420 + Math.cos(i * 1.4 + reloj / 900) * 190} y={430 + Math.sin(i * 1.4 + reloj / 900) * 160} k={0.2} o={tramo(p('fabrica'), 0, 0.5)} reloj={reloj + i * 200} />)}
    <Txt x={420} y={620} txt="la célula que fabrica virus" t={28} p={p('fabrica')} />
    <Sale p={p('dano')} x={420} y={430}><path d="M-40,-90 L-10,-40 L-50,-10 L-10,40 L-40,90" fill="none" stroke="#2A1A5A" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></Sale>
    <Txt x={420} y={665} txt="daño de membrana y de metabolismo" t={26} p={p('dano')} color={TXV.sangre} />
    <Sale p={p('citotoxicos')} x={900} y={430}><Linfocito tono="cd8" k={1.3} /></Sale>
    <Flecha a={[820, 430]} b={[620, 430]} p={p('matarla')} color={P.sangre[1]} w={12} />
    <Txt x={900} y={540} txt="los CD8 la matan" t={28} p={p('matarla')} color={TXV.sangre} />
    <Bandera x={1000} y={760} txt="efecto directo" color={P.sangre[0]} p={p('directo')} t={30} punta="no" />
    {/* pero solo una fracción mínima de los CD4 está infectada de forma productiva */}
    {Array.from({ length: 30 }, (_, i) => {
      const cx = 1130 + (i % 6) * 70, cy = 220 + Math.floor(i / 6) * 70;
      const q = tramo(p('alcanza'), (i / 30) * 0.5, (i / 30) * 0.5 + 0.4);
      return <Sale key={i} p={q} x={cx} y={cy}><Linfocito k={0.28} /></Sale>;
    })}
    <Sale p={p('infectada')} x={1130 + 2 * 70} y={220 + 2 * 70}><circle r={26} fill="none" stroke={P.sangre[1]} strokeWidth={6} /></Sale>
    <Txt x={1340} y={620} txt="una fracción mínima" t={28} p={p('fraccion')} color={TXV.ambar} />
    <Txt x={1340} y={662} txt="infectada de forma productiva" t={24} p={p('productiva')} />
    <Txt x={800} y={900} txt="no explica toda la pérdida" t={42} p={p('mecanismos')} color={TXV.sangre} />
  </g>
);

// ─── 4 · Los espectadores ────────────────────────────────────────────────────
const Espectadores: Lamina = ({ p, reloj }) => (
  <g>
    <Camaras cur={1} o={p('espectadoras')} />
    <Txt x={500} y={110} txt="la segunda forma: las células espectadoras" t={34} p={p('espectadoras')} color={TXV.violeta} />
    {Array.from({ length: 24 }, (_, i) => {
      const cx = 160 + (i % 8) * 110, cy = 260 + Math.floor(i / 8) * 110;
      const muere = hash(i, 7) < 0.6 ? easeOut(tramo(p('mueren'), (i / 24) * 0.6, (i / 24) * 0.6 + 0.4)) : 0;
      return (
        <g key={i}>
          <Sale p={p('muchos')} x={cx} y={cy}><Linfocito k={0.42} o={1 - 0.6 * muere} /></Sale>
          <Cruz x={cx} y={cy} k={0.4} p={muere} />
        </g>
      );
    })}
    <Txt x={540} y={620} txt="muchos CD4 mueren sin estar infectados" t={32} p={p('infectados')} color={TXV.sangre} />
    {/* la activación crónica los empuja a la apoptosis (Fas) */}
    <Sale p={p('activacion')} x={1160} y={300}><Linfocito k={0.9} /></Sale>
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-3} y={-86} width={6} height={20} rx={3} fill={P.espiga[1]} opacity={easeOut(p('activacion'))} transform={`translate(1160,300) rotate(${i * 45})`} />)}
    <Txt x={1160} y={410} txt="activación crónica" t={26} p={p('activacion')} color={TXV.ambar} />
    <Flecha a={[1160, 430]} b={[1160, 500]} p={p('apoptosis')} color={P.sangre[1]} w={10} />
    <Txt x={1160} y={535} txt="apoptosis (vía Fas)" t={28} p={p('apoptosis')} color={TXV.sangre} />
    {/* la gp120 libre manda señales de muerte */}
    <Sale p={p('gp120')} x={1400} y={300}><Espiga k={1.7} /></Sale>
    <Flecha a={[1360, 330]} b={[1230, 330]} p={p('senales')} color={P.sangre[1]} w={9} />
    <Txt x={1400} y={400} txt="gp120 libre" t={26} p={p('gp120')} />
    <Txt x={1400} y={440} txt="señales de muerte" t={24} p={p('senales')} color={TXV.sangre} />
    {/* tanta estimulación los agota */}
    <Sale p={p('agota')} x={300} y={800}><Linfocito tono="gris" k={1.0} /></Sale>
    <Txt x={300} y={890} txt="tanta estimulación los agota" t={26} p={p('agota')} />
    {['PD-1', 'LAG-3', 'TIM-3'].map((n, i) => <Bandera key={n} x={640 + i * 190} y={800} txt={n} color={P.hla[0]} p={tramo(p('marcadores'), i * 0.2, i * 0.2 + 0.5)} t={26} punta="abajo" />)}
    <Txt x={830} y={880} txt="marcadores de agotamiento" t={26} p={p('marcadores')} />
    <Txt x={1320} y={800} txt="responden cada vez peor" t={30} p={p('responden')} color={TXV.sangre} />
  </g>
);

// ─── 5 · Piroptosis ──────────────────────────────────────────────────────────
const Piroptosis: Lamina = ({ p, reloj }) => {
  const est = easeOut(p('estalla'));
  const lib = easeOut(p('libera'));
  const atr = easeOut(p('atrae'));
  return (
    <g>
      <Camaras cur={2} o={p('reveladora')} />
      <Txt x={500} y={110} txt="piroptosis, una forma reveladora" t={34} p={p('piroptosis')} color={TXV.violeta} />
      <Bandera x={240} y={220} txt="ganglios y amígdalas" color={P.cd4[0]} p={p('ganglios')} t={26} punta="no" />
      {/* un CD4 en reposo: el virus entra y la transcripción inversa se queda a medias */}
      <g opacity={1 - est}>
        <Sale p={p('reposo')} x={520} y={540}><Linfocito tono="gris" k={2.3} /></Sale>
        <Virion x={lerp(160, 410, easeOut(p('entra')))} y={lerp(380, 520, easeOut(p('entra')))} k={0.3} o={tramo(p('entra'), 0, 0.3) * (1 - easeOut(p('adn')))} reloj={reloj} />
        <Helice x={520} y={560} w={120} amp={14} vueltas={1.2} p={p('adn')} grosor={9} fase={reloj / 1500} />
        <Txt x={520} y={700} txt="transcripción inversa a medias" t={24} p={p('medias')} />
        <Sale p={p('ifi')} x={660} y={470}><circle r={26} fill={P.esp[0]} /><circle cx={-2} cy={-2} r={22} fill={P.esp[1]} /><Letra txt="16" t={22} /></Sale>
        <Bandera x={780} y={420} txt="IFI16 detecta el ADN" color={P.esp[0]} p={p('detecta')} t={24} punta="no" />
        {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return <circle key={i} cx={520 + Math.cos(a) * 62} cy={540 + Math.sin(a) * 62} r={11 * easeOut(p('inflamasoma'))} fill={P.espiga[1]} />; })}
        <Txt x={780} y={480} txt="inflamasoma" t={24} ancla="start" p={p('inflamasoma')} color={TXV.ambar} />
        <Sale p={p('caspasa')} x={660} y={640}><Tijeras k={0.8} abre={0.7} r={90} /></Sale>
        <Txt x={780} y={640} txt="caspasa-1" t={24} ancla="start" p={p('caspasa')} />
      </g>
      {/* la célula estalla y libera interleucina-1β */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = hash(i, 3) * Math.PI * 2, r = (40 + hash(i, 4) * 160) * est;
        return <path key={i} d={`M-14,-8 L12,-14 L16,10 L-6,16 Z`} fill="#2A0F6E" transform={`translate(${520 + Math.cos(a) * r},${540 + Math.sin(a) * r}) rotate(${i * 40}) scale(${(0.8 + hash(i, 5)) * (1 - 0.3 * est)})`} opacity={est * (1 - 0.0)} />;
      })}
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, r = 120 + 280 * lib; return <polygon key={i} points="0,-14 4,-4 14,-4 6,3 9,13 0,7 -9,13 -6,3 -14,-4 -4,-4" fill={P.espiga[1]} transform={`translate(${520 + Math.cos(a) * r},${540 + Math.sin(a) * r})`} opacity={lib * (1 - 0.5 * lib)} />; })}
      <Txt x={520} y={810} txt="estalla y libera IL-1β" t={30} p={p('libera')} color={TXV.ambar} />
      {/* atrae más CD4 y se cierra el círculo vicioso */}
      {[0, 1, 2].map((i) => <Sale key={i} p={tramo(atr, i * 0.2, i * 0.2 + 0.6)} x={lerp(1450, 1100, atr) + (i % 2) * 60} y={380 + i * 130}><Linfocito k={0.7} /></Sale>)}
      <Flecha a={[1100, 700]} b={[700, 700]} c={[900, 860]} p={p('circulo')} color={P.sangre[1]} w={14} />
      <Txt x={1200} y={880} txt="un círculo vicioso" t={40} p={p('circulo')} color={TXV.sangre} />
    </g>
  );
};

// ─── 6 · El intestino se vacía ───────────────────────────────────────────────
const IntestinoVacia: Lamina = ({ p, reloj }) => {
  const vac = easeOut(p('vacia'));
  return (
    <g>
      <Camaras cur={3} o={p('clave')} />
      <Txt x={480} y={110} txt="la clave: el tejido linfoide del intestino" t={32} p={p('clave')} color={TXV.violeta} />
      <Sale p={p('galt')} x={330} y={470}><Intestino k={1.7} /></Sale>
      <Bandera x={330} y={230} txt="GALT" color={P.rt[0]} p={p('galt')} t={30} punta="abajo" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = hash(i, 5) * Math.PI * 2, r = 20 + hash(i, 6) * 80;
        const sale = tramo(vac, (i / 16) * 0.7, (i / 16) * 0.7 + 0.3);
        return <Sale key={i} p={tramo(p('abundan'), (i / 16) * 0.5, (i / 16) * 0.5 + 0.4) * (1 - sale)} x={660 + Math.cos(a) * r * 1.6} y={470 + Math.sin(a) * r}><Linfocito k={0.36} tono={i % 3 === 0 ? 'th17' : 't'} /></Sale>;
      })}
      <Txt x={660} y={600} txt="abundan los CD4 de memoria" t={26} p={p('abundan')} />
      <Txt x={660} y={645} txt="con CCR5, sobre todo Th17" t={24} p={p('th17')} color={TXV.mac} />
      {/* se destruyen de forma masiva en las primeras semanas */}
      <path d="M980,300 L980,760 L1520,760" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * tramo(p('semanas'), 0, 0.5)} />
      <Txt x={1250} y={820} txt="primeras semanas" t={26} p={p('semanas')} />
      <Trazo pts={[[990, 330], [1080, 360], [1160, 560], [1300, 690], [1500, 730]]} p={p('vacia')} color={P.sangre[1]} w={13} />
      <Txt x={1300} y={500} txt="CD4 del intestino" t={26} p={p('vacia')} color={TXV.sangre} />
      <Trazo pts={[[990, 335], [1250, 345], [1320, 390], [1400, 540], [1500, 700]]} p={p('sangre')} color={P.cd4[1]} w={13} />
      <Txt x={1300} y={330} txt="CD4 de la sangre" t={26} p={p('sangre')} color={TXV.cd4} />
      <Txt x={1000} y={900} txt="antes de que caiga el recuento" t={30} p={p('caiga')} color={TXV.ambar} />
      <Txt x={400} y={820} txt="es donde más CD4 se pierden" t={34} p={p('pierden')} color={TXV.sangre} />
      <Txt x={400} y={870} txt="en silencio" t={28} p={p('silencio')} />
    </g>
  );
};

// ─── 7 · La barrera rota ─────────────────────────────────────────────────────
const BarreraRota: Lamina = ({ p, reloj }) => {
  const deb = easeOut(p('debilita'));
  const pas = easeOut(p('pasan'));
  return (
    <g>
      <Camaras cur={4} o={p('intestino')} />
      <Txt x={480} y={110} txt="en el intestino, los defensores Th17" t={32} p={p('defensores')} color={TXV.violeta} />
      {Array.from({ length: 10 }, (_, i) => <Enterocito key={i} x={150 + i * 145} y={440} k={0.78} w={104} muere={deb * (i % 3 === 1 ? 1 : 0.3)} />)}
      {Array.from({ length: 9 }, (_, i) => <Cremallera key={i} x={150 + (i + 0.5) * 145} y={470} h={100} k={0.7} cierre={1 - deb} />)}
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={tramo(p('th17'), i * 0.15, i * 0.15 + 0.5) * (1 - deb)} x={290 + i * 340} y={640}><Linfocito tono="th17" k={0.6} /></Sale>)}
      <Txt x={460} y={730} txt="mantienen sana la barrera" t={28} p={p('sana')} color={TXV.mac} />
      <Bandera x={800} y={300} txt="la barrera se debilita" color={P.sangre[0]} p={p('debilita')} t={30} punta="no" />
      {/* las bacterias y su lipopolisacárido pasan a la sangre */}
      {Array.from({ length: 6 }, (_, i) => {
        const bx = 230 + i * 240, by = lerp(200, 850, tramo(pas, (i / 6) * 0.5, (i / 6) * 0.5 + 0.5));
        return (
          <g key={i} opacity={tramo(p('bacterias'), (i / 6) * 0.5, (i / 6) * 0.5 + 0.4)}>
            <rect x={bx - 36} y={by - 14} width={72} height={28} rx={14} fill={P.esp[0]} /><rect x={bx - 32} y={by - 11} width={60} height={20} rx={10} fill={P.esp[1]} />
            <circle cx={bx - 14} cy={by - 6} r={4} fill="#FFF" opacity={0.7} />
          </g>
        );
      })}
      <Txt x={800} y={190} txt="bacterias" t={26} p={p('bacterias')} color={TXV.esp} />
      <Bandera x={1250} y={190} txt="lipopolisacárido" color={P.espiga[0]} p={p('lps')} t={26} punta="no" />
      <rect x={0} y={800} width={1600} height={110} fill={P.sangre[0]} opacity={0.85 * tramo(p('sangre'), 0, 0.5)} />
      <rect x={0} y={812} width={1600} height={86} fill={P.sangre[1]} opacity={0.85 * tramo(p('sangre'), 0, 0.5)} />
      <Txt x={800} y={860} txt="sangre" t={36} p={p('sangre')} color="#FFF" />
      <Txt x={800} y={950} txt="translocación microbiana" t={34} p={p('translocacion')} color={TXV.sangre} />
      {/* activación inmunitaria crónica, incluso con tratamiento */}
      <Txt x={1230} y={580} txt="activación inmunitaria crónica" t={30} p={p('activacion')} color={TXV.violeta} />
      <Txt x={1230} y={625} txt="sigue incluso con tratamiento" t={26} p={p('tratamiento')} />
      <Txt x={1230} y={670} txt="en pacientes con carga viral controlada" t={24} p={p('pacientes')} />
      <Txt x={1230} y={715} txt="se mantiene la inflamación" t={26} p={p('inflamacion')} color={TXV.sangre} />
    </g>
  );
};

// ─── 8 · El colapso ──────────────────────────────────────────────────────────
const Colapso: Lamina = ({ p, reloj }) => {
  const NODOS: { x: number; y: number; txt: string; q: number; tono: readonly string[] }[] = [
    { x: 800, y: 190, txt: 'muerte directa', q: p('directa'), tono: P.sangre },
    { x: 1220, y: 420, txt: 'muerte indirecta', q: p('indirecta'), tono: P.hla },
    { x: 1060, y: 780, txt: 'inflamación crónica', q: p('inflamacion'), tono: P.cap },
    { x: 540, y: 780, txt: 'fibrosis del tejido linfoide', q: p('fibrosis'), tono: P.inte },
    { x: 380, y: 420, txt: 'menos reposición (timo y médula)', q: p('reponen'), tono: P.rt },
  ];
  const inv = easeOut(p('invierte'));
  return (
    <g>
      <Txt x={800} y={90} txt="junta las piezas" t={34} p={p('junta')} color={TXV.violeta} />
      {NODOS.map((n, i) => {
        const m = NODOS[(i + 1) % 5];
        return (
          <g key={n.txt}>
            <Flecha a={[n.x + (m.x - n.x) * 0.3, n.y + (m.y - n.y) * 0.3]} b={[n.x + (m.x - n.x) * 0.72, n.y + (m.y - n.y) * 0.72]} p={tramo(p('circulo'), i * 0.15, i * 0.15 + 0.5)} color="var(--cit-flecha)" w={12} />
            <Sale p={n.q} x={n.x} y={n.y}><Bola R={52} tono={[...n.tono]} /><Letra txt={String(i + 1)} t={44} /></Sale>
            <Txt x={n.x} y={n.y + 82} txt={n.txt} t={24} p={n.q} />
          </g>
        );
      })}
      <Sale p={p('mata')} x={800} y={470}><Linfocito k={1.3} o={1 - 0.7 * easeOut(p('acelera'))} /></Sale>
      {/* la relación CD4/CD8 se invierte */}
      <rect x={720} y={560 - 70 * (1 - 0.8 * inv)} width={56} height={70 * (1 - 0.8 * inv)} rx={8} fill={P.cd4[1]} opacity={tramo(p('relacion'), 0, 0.4)} />
      <rect x={830} y={560 - 70 * (0.5 + 1.0 * inv)} width={56} height={70 * (0.5 + 1.0 * inv)} rx={8} fill={P.hla[1]} opacity={tramo(p('relacion'), 0, 0.4)} />
      <Txt x={748} y={590} txt="CD4" t={22} p={p('relacion')} color={TXV.cd4} />
      <Txt x={858} y={590} txt="CD8" t={22} p={p('relacion')} color={TXV.dc} />
      <Txt x={800} y={930} txt="no hay una sola causa: es un círculo" t={38} p={p('sola')} color={TXV.sangre} />
      <Txt x={800} y={975} txt="la pérdida de CD4 se alimenta a sí misma" t={26} p={p('alimenta')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [AlarmaInnata, Citotoxicos, AnticuerposTarde, EfectoDirecto, Espectadores, Piroptosis, IntestinoVacia, BarreraRota, Colapso];
export default LAMINAS;
