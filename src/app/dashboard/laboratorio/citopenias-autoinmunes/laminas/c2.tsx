'use client';
// Capítulo 2 · AHAI caliente: del bazo a la sangre y de vuelta al bazo.

import type { Lamina } from '../Lienzo';
import { Bazo, C, Chorro, En, Esfera, FcR, Flecha, Folicular, Frasco, Frotis, Hematie, HematieRoto, IgG, Linfocito, MAC, Macrofago, Plaqueta, Plasmatica, Rotulo, Sale, TuboOrina, Txt, Vaso, Virus, C1, clamp, easeOut, enBorde, lerp, tramo } from '../Piezas';
import { Diez, HematieIg, Llama, viaje } from './Comun';

const Tolerancia: Lamina = ({ p }) => {
  const reg = p('fallan');
  return (
    <g>
      <Sale p={p('bazo')} x={990} y={510} k={1.5}><Bazo /></Sale>
      <Rotulo x={290} y={110} txt="¿Por qué?" color="var(--cit-base)" p={p('bazo')} t={36} />
      <Sale p={p('infeccion')} x={140} y={320}><Virus /></Sale>
      <Sale p={p('farmaco')} x={330} y={320} k={0.9}><Frasco /></Sale>
      <Sale p={p('inmuno')} x={510} y={320}><Linfocito tono="gris" k={0.85} /></Sale>
      <Rotulo x={140} y={440} txt="Infección" color={C.bazo[1]} p={p('infeccion')} t={25} />
      <Rotulo x={330} y={440} txt="Fármaco" color={C.ambar[0]} p={p('farmaco')} t={25} />
      <Rotulo x={510} y={440} txt="Inmunodeficiencia" color="#555C6A" p={p('inmuno')} t={22} />
      <Sale p={p('chispa')} x={330} y={620}><Llama k={1.15} /></Sale>
      {[[870, 340], [990, 290], [1110, 370]].map(([x, y], i) => <Sale key={i} p={tramo(p('suben'), i * 0.2, 0.6 + i * 0.2)} x={x} y={y}><Linfocito tono="th17" k={0.95} /></Sale>)}
      <Chorro a={[990, 300]} b={[1280, 150]} p={p('il17')} color="#F97316" abanico={70} n={16} />
      <Rotulo x={1340} y={110} txt="Suben TH17" color="#F97316" p={p('suben')} t={30} />
      {[[840, 640], [1000, 690], [1150, 620]].map(([x, y], i) => <Sale key={i} p={p('freno')} x={x} y={y}><Linfocito tono="treg" k={0.95} o={1 - 0.72 * reg} /></Sale>)}
      <Rotulo x={1260} y={890} txt="Fallan las T reguladoras" color={C.verde[0]} p={p('freno')} t={30} />
    </g>
  );
};

const FabricaArma: Lamina = ({ p }) => (
  <g>
    <Sale p={p('bazo')} x={800} y={510} k={1.85}><Bazo /></Sale>
    <Sale p={p('macro')} x={360} y={600} k={0.72}><Macrofago /></Sale>
    <Rotulo x={360} y={810} txt="Macrófago" color="#1287B5" p={p('macro')} t={27} />
    <Flecha a={[470, 560]} b={[650, 540]} p={p('presenta')} color="#FFF" w={9} />
    {p('presenta') > 0 && (() => { const q = viaje([440, 570], [660, 540], tramo(p('presenta'), 0.2, 1)); return <En x={q.x} y={q.y} k={0.4}><Hematie /></En>; })()}
    <Sale p={p('t')} x={760} y={540}><Linfocito tono="t" /></Sale>
    <Rotulo x={760} y={640} txt="Célula T" color="#127CB5" p={p('t')} t={26} />
    <Flecha a={[810, 480]} b={[930, 390]} p={p('ayuda')} color="#FFF" w={9} />
    {p('b') > 0.01 && <circle cx={1040} cy={330} r={150 * easeOut(clamp(p('b')))} fill={C.bazo[2]} />}
    {p('b') > 0.01 && <circle cx={1040} cy={330} r={110 * easeOut(clamp(p('b')))} fill="#FBDDE6" />}
    <Sale p={p('b')} x={1000} y={345}><Linfocito tono="b" k={0.74} /></Sale>
    <Sale p={p('b')} x={1085} y={365}><Linfocito tono="b" k={0.62} /></Sale>
    <Sale p={p('b')} x={1100} y={260}><Folicular k={0.5} /></Sale>
    <Rotulo x={1040} y={525} txt="Centro germinal" color={C.bazo[0]} p={p('b')} t={26} />
    <Flecha a={[930, 300]} c={[780, 240]} b={[640, 300]} p={p('nace')} color="#FFF" w={9} />
    <Sale p={p('nace')} x={520} y={300} k={1.25}><Plasmatica /></Sale>
    <Rotulo x={520} y={165} txt="Célula plasmática autorreactiva" color="#6B5AA8" p={p('auto')} t={28} />
    <Txt x={800} y={950} txt="Una fábrica de anticuerpos contra ti mismo" t={34} p={p('fabrica')} />
    {Array.from({ length: 8 }, (_, i) => { const q = tramo(p('fabrica'), i * 0.09, 0.4 + i * 0.09); return q > 0 ? <IgG key={i} x={lerp(440, 130 + hash14(i) * 190, q)} y={lerp(330, 230 + i * 34, q)} r={i * 57} k={1.1} o={q} /> : null; })}
  </g>
);

const SaleLaIgG: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('entra')} x={250} y={240} k={0.72}><Bazo /></Sale>
    <Sale p={p('entra')} x={250} y={230}><Plasmatica k={0.75} /></Sale>
    <path d="M300,410 C340,540 500,590 650,610" fill="none" stroke="#3F86E0" strokeWidth={26 * clamp(p('vena') * 2)} strokeLinecap="round" />
    <Rotulo x={120} y={500} txt="Vena esplénica" color="#3F86E0" p={p('vena')} t={25} />
    {Array.from({ length: 7 }, (_, i) => { const q = tramo(p('vena'), i * 0.09, 0.55 + i * 0.09); return q > 0 ? <IgG key={i} x={lerp(300, 650, q)} y={lerp(410, 610, q) - 60 * Math.sin(q * 3.14) * (i % 2 ? -1 : 1) * 0.5} r={i * 50} k={1.1} /> : null; })}
    <Vaso x={800} y={760} w={1600} h={280} flujo={p('sangre') > 0 ? 8 : 0} reloj={reloj} o={p('entra')} />
    {Array.from({ length: 10 }, (_, i) => { const q = tramo(p('sangre'), i * 0.06, 0.5 + i * 0.06); return q > 0 ? <IgG key={i} x={420 + i * 112} y={700 + (i % 3) * 60} r={i * 70} k={1.1} o={q} /> : null; })}
    <Sale p={p('blancos')} x={1120} y={290} k={2.6}><HematieIg n={3} ang0={-150} p={clamp(p('rh') + p('b3') + p('gyp')) } /></Sale>
    <Rotulo x={830} y={120} txt="Rh" color={C.verde[1]} p={p('rh')} t={28} />
    <Rotulo x={1410} y={120} txt="Banda 3" color={C.c1[0]} p={p('b3')} t={28} />
    <Rotulo x={1120} y={530} txt="Glicoforina A" color={C.bazo[1]} p={p('gyp')} t={28} />
    <Rotulo x={590} y={230} txt="IgG1 e IgG3" color={C.igg[1]} p={p('igg')} t={28} />
    <Txt x={1420} y={470} txt="Marcado, y no lo sabe" t={27} p={p('marcado')} ancla="middle" />
  </g>
);

const Regreso: Lamina = ({ p }) => (
  <g>
    <Sale p={p('bazo')} x={1040} y={500} k={1.45}><Bazo /></Sale>
    <Rotulo x={1040} y={75} txt="El filtro" color={C.bazo[0]} p={p('bazo')} t={34} />
    <Sale p={p('bazo')} x={1000} y={380} k={0.55}><Macrofago /></Sale>
    <Sale p={p('bazo')} x={1200} y={620} k={0.55}><Macrofago /></Sale>
    {p('viejos') > 0 && [0, 1].map((i) => { const q = viaje([640, 250 + i * 60], [920 + i * 50, 390 + i * 30], tramo(p('viejos'), i * 0.2, 0.8 + i * 0.2)); return <En key={i} x={q.x} y={q.y} k={0.9} o={1 - tramo(p('viejos'), 0.85, 1)}><Hematie esfera={0.25} /></En>; })}
    <Txt x={330} y={260} txt="Glóbulos viejos o dañados" t={30} p={p('viejos')} />
    <path d="M60,650 C260,650 460,640 690,590" fill="none" stroke={C.rojo[1]} strokeWidth={46 * clamp(p('arteria') * 2)} strokeLinecap="round" />
    <Rotulo x={300} y={760} txt="Arteria esplénica" color={C.rojo[0]} p={p('arteria')} t={27} />
    {[0, 1, 2, 3].map((i) => {
      const q = tramo(p('sanos'), i * 0.14, 0.62 + i * 0.14);
      if (q <= 0) return null;
      const pos = viaje([60, 650], [940 + i * 56, 560 + (i % 2) * 70], q);
      return <HematieIg key={i} x={pos.x} y={pos.y - 10} k={1} p={p('igg')} n={4} />;
    })}
    <Rotulo x={420} y={470} txt="Sanos, cubiertos de IgG" color={C.igg[1]} p={p('igg')} t={29} />
    <Txt x={1040} y={910} txt="Los lee como basura" t={31} p={p('basura')} />
    <Txt x={420} y={880} txt="Vuelven adonde se fabricó el arma" t={27} p={p('vuelven')} fuerte={false} />
  </g>
);

const Devora: Lamina = ({ p }) => {
  const atrapa = p('atrapa'), dev = p('devora');
  const pos = viaje([1210, 480], [885, 510], atrapa);
  const dentro = viaje([885, 510], [590, 500], dev);
  const X = dev > 0 ? dentro.x : pos.x, Y = dev > 0 ? dentro.y : pos.y;
  return (
    <g>
      <Sale p={p('macro')} x={560} y={500} k={2.05}><Macrofago /></Sale>
      <Rotulo x={560} y={85} txt="La destrucción principal" color="var(--cit-base)" p={p('principal')} t={34} />
      {[[822, 482, 115], [800, 562, 62], [858, 628, 62]].map(([x, y, r], i) => <FcR key={i} x={x} y={y} r={r} k={1.6 * clamp(p('fc') * 1.4)} />)}
      <Rotulo x={920} y={235} txt="Receptor Fc gamma" color="#F2546B" p={p('fc')} t={28} />
      <Txt x={1270} y={260} txt="Agarra la cola de la IgG" t={27} p={p('cola')} />
      <En o={1 - tramo(dev, 0.7, 1)} k={1}>
        <HematieIg x={X} y={Y} k={lerp(1.9, 1.1, dev)} n={5} p={p('llega')} />
      </En>
      <Rotulo x={1160} y={740} txt="Hemólisis extravascular" color={C.bazo[1]} p={p('nombre')} t={33} />
      <Sale p={p('bazo')} x={1400} y={520} k={0.46}><Bazo corte={false} /></Sale>
      <Txt x={1120} y={830} txt="No muere en la sangre: muere dentro del bazo" t={28} p={p('bazo')} />
    </g>
  );
};

const Esferocito: Lamina = ({ p }) => {
  const mor = p('muerde'), e = p('esfera');
  const trozo = viaje([740, 500], [470, 500], mor);
  const pos = viaje([790, 500], [930, 470], e);
  return (
    <g>
      <Sale p={p('macro')} x={350} y={500} k={1.55}><Macrofago /></Sale>
      <Rotulo x={350} y={120} txt="No lo termina" color="#1287B5" p={p('macro')} t={30} />
      <Sale p={p('macro')}><En x={pos.x} y={pos.y} k={lerp(2.5, 2.6, e)}><Hematie esfera={e} /></En></Sale>
      {mor > 0 && mor < 1 && <En x={trozo.x} y={trozo.y} k={1.3}><path d="M-14,-10 Q2,-18 14,-8 Q12,10 -2,14 Q-16,8 -14,-10 Z" fill={C.rojo[1]} /></En>}
      <Txt x={720} y={190} txt="Le arranca un trozo" t={30} p={p('muerde')} />
      <Txt x={930} y={750} txt="Ya no es un disco: es una esfera" t={30} p={p('disco')} />
      <Rotulo x={930} y={830} txt="Esferocito" color={C.rojo[0]} p={p('nombre')} t={36} />
      <Frotis x={1340} y={360} R={200} tipo="esferocitos" id="c2e" o={p('frotis')} />
      <Diez x={1340} y={680} n={4} p={p('cuatro')} k={0.85} />
      <Txt x={1340} y={790} txt="4 de cada 10 frotis" t={30} p={p('cuatro')} />
      <Txt x={1340} y={880} txt="La huella de una mordida" t={29} p={p('huella')} fuerte={false} />
    </g>
  );
};

const EnLaSangre: Lamina = ({ p, reloj }) => {
  const roto = p('estalla');
  return (
    <g>
      <Vaso x={800} y={470} w={1700} h={460} flujo={7} reloj={reloj} o={p('vaso')}>
        <En x={-120} y={0}>
          {roto <= 0
            ? <HematieIg k={2.7} n={5} p={1} />
            : <HematieRoto k={2.7} p={roto} />}
          {roto <= 0 && <C1 x={-60} y={-135} k={1.5 * clamp(p('via') * 1.3)} r={-20} />}
          {roto <= 0 && [[58, -80], [86, 28], [-40, 92]].map(([x, y], i) => { const q = tramo(p('c3b'), i * 0.2, 0.6 + i * 0.2); return q > 0 ? <En key={i} x={x} y={y} k={easeOut(q)}><Esfera R={22} /></En> : null; })}
          {roto <= 0 && [[-96, 18, 90], [62, 86, 35]].map(([x, y, r], i) => { const q = tramo(p('mac'), i * 0.3, 0.7 + i * 0.3); return q > 0 ? <MAC key={i} x={x} y={y} r={r} k={1.7 * easeOut(q)} /> : null; })}
        </En>
      </Vaso>
      <Rotulo x={420} y={120} txt="Un segundo frente, en la sangre" color="var(--cit-base)" p={p('frente')} t={31} />
      <Rotulo x={1160} y={120} txt="Vía clásica del complemento" color={C.c1[1]} p={p('via')} t={28} />
      <Rotulo x={1210} y={350} txt="Complejo de ataque" color={C.mac[1]} p={p('mac')} t={28} sobre="Un poro" colorSobre="#FFF" />
      <Rotulo x={560} y={850} txt="Hemólisis intravascular" color={C.rojo[1]} p={p('nombre')} t={35} />
      <Sale p={p('orina')} x={1280} y={790} k={0.72}><TuboOrina oscuro={1} /></Sale>
      <Txt x={1040} y={850} txt="Oscurece la orina" t={29} p={p('orina')} />
    </g>
  );
};

const Trombosis: Lamina = ({ p, reloj }) => {
  const tr = p('trombo');
  return (
    <g>
      <Rotulo x={800} y={80} txt="Esta anemia también coagula" color="var(--cit-base)" p={p('coagula')} t={36} />
      <Vaso x={800} y={440} w={1700} h={380} flujo={5} reloj={reloj} o={p('vaso')}>
        {Array.from({ length: 9 }, (_, i) => { const q = tramo(p('hb'), i * 0.05, 0.4 + i * 0.05); const X = -640 + i * 90, Y = -90 + (i % 3) * 80; return q > 0 ? <En key={i} x={X} y={Y} k={easeOut(q)}><circle r={14} fill="#7E1226" /><circle cx={-3} cy={-3} r={9} fill={C.rojo[1]} /></En> : null; })}
        {Array.from({ length: 6 }, (_, i) => { const q = tramo(p('no'), i * 0.09, 0.6 + i * 0.09); const dest = [-640 + i * 180, -90 + (i * 2 % 3) * 80]; return q > 0 ? <En key={i} x={lerp(dest[0] + 90, dest[0] + 12, q)} y={lerp(dest[1] - 90, dest[1], q)}><circle r={9} fill="#2F8DE8" /><circle cx={12} r={9} fill="#7DB2FF" /></En> : null; })}
        <En x={420} y={190}>
          {Array.from({ length: 14 }, (_, i) => {
            const q = tramo(tr, i * 0.05, 0.35 + i * 0.05);
            return q > 0 ? <Plaqueta key={i} x={(hash14(i) - 0.5) * 240} y={-10 - hash14(i + 20) * 160 * q} k={0.95 * easeOut(q)} r={i * 41} /> : null;
          })}
        </En>
      </Vaso>
      <Txt x={320} y={750} txt="La hemoglobina libre atrapa óxido nítrico" t={29} p={p('no')} ancla="middle" />
      <Rotulo x={1220} y={750} txt="Estado protrombótico" color={C.plaq[1]} p={tr} t={32} />
      <Rotulo x={1220} y={845} txt="Embolia" color={C.rojo[0]} p={p('embolia')} t={32} />
      <Sale p={p('final')} x={330} y={880} k={0.28}><Bazo corte={false} /></Sale>
      <Txt x={760} y={880} txt="El bazo fabrica el arma… y ejecuta la sentencia" t={28} p={p('final')} />
    </g>
  );
};

const hash14 = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

const LAMINAS: Lamina[] = [Tolerancia, FabricaArma, SaleLaIgG, Regreso, Devora, Esferocito, EnLaSangre, Trombosis];
export default LAMINAS;
