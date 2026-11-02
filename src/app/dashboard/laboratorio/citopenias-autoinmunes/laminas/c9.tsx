'use client';
// Capítulo 9 · PTI: reconocerla y tratarla. Termina volviendo a los dos pacientes.

import type { Lamina } from '../Lienzo';
import { Bazo, C, Cerebro, En, FcR, Frasco, Frotis, Hematie, IgG, Linfocito, Macrofago, Megacariocito, Persona, Pierna, Plaqueta, Plasmatica, Rotulo, Sale, Txt, Vaso, Virus, clamp, lerp, tramo } from '../Piezas';
import { Antigeno, Barra, Diez, HematieIg, PlaquetaIg } from './Comun';

const ComoSangra: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('pierna')} x={250} y={500} k={1.15}><Pierna p={p('petequias')} /></Sale>
    <Rotulo x={250} y={100} txt="Petequias" color={C.rojo[0]} p={p('petequias')} t={28} />
    <Rotulo x={590} y={260} txt="Moretones" color="#6B3FA0" p={p('moreton')} t={27} />
    <Sale p={p('moreton')} x={590} y={150} k={1}>
      <ellipse rx={76} ry={55} fill="#5B3C8C" opacity={0.85} /><ellipse cx={-6} cy={-3} rx={50} ry={34} fill="#8A4FA8" /><ellipse cx={-12} cy={-8} rx={22} ry={15} fill="#B66F9A" />
    </Sale>
    <Rotulo x={590} y={380} txt="La nariz" color={C.rojo[1]} p={p('nariz')} t={27} />
    <Rotulo x={590} y={470} txt="Las encías" color={C.rojo[1]} p={p('encias')} t={27} />
    <Vaso x={1140} y={230} w={780} h={210} flujo={2} reloj={reloj} o={p('tapon')}>
      <rect x={-40} y={92} width={80} height={50} fill="var(--cit-fondo-b, #DFF3F4)" />
      {[0, 1, 2].map((i) => <En key={i} x={-20 + i * 28} y={130 + i * 26} k={0.75}><Hematie /></En>)}
      <Plaqueta x={-70} y={40} k={0.85} /><Plaqueta x={82} y={-30} k={0.75} />
    </Vaso>
    <Txt x={1140} y={480} txt="Sin plaquetas, el tapón no se forma" t={29} p={p('tapon')} />
    <Sale p={p('cerebro')} x={760} y={720} k={1.08}><Cerebro sangra={p('sangra')} /></Sale>
    <Rotulo x={760} y={910} txt="Hemorragia intracraneal" color="#7A0F24" p={p('sangra')} t={28} />
    <Sale p={p('paciente')} x={1270} y={700} k={0.62}><Persona quien="hombre" /></Sale>
    <Rotulo x={1270} y={900} txt="Tratas al paciente, no al número" color={C.plaq[1]} p={p('numero')} t={26} />
  </g>
);

const Descartando: Lamina = ({ p }) => {
  const chips: [number, number, string, string][] = [[850, 610, 'Fármacos', 'f'], [1110, 610, 'VIH', 'v'], [1340, 610, 'Hepatitis C', 'h'], [960, 730, 'Lupus', 'l'], [1240, 730, 'Una neoplasia', 'n']];
  return (
    <g>
      <Rotulo x={800} y={64} txt="No hay prueba que la confirme" color="var(--cit-base)" p={p('titulo')} t={33} />
      <Txt x={800} y={132} txt="Se diagnostica descartando" t={32} p={p('descarta')} />
      <En x={70} y={0} o={p('hemo')}>
        <Plaqueta x={40} y={260} k={0.9} />
        <Barra x={100} y={270} w={360} val={tramo(p('bajas'), 0, 1) * 0.1 + (1 - p('bajas')) * 0.7} color={C.plaq[1]} txt="Plaquetas bajas" />
        <Hematie x={40} y={410} k={0.55} />
        <Barra x={100} y={420} w={360} val={0.78} color={C.rojo[1]} txt="Glóbulos rojos" p={p('resto')} />
        <Linfocito x={40} y={560} k={0.42} tono="t" />
        <Barra x={100} y={570} w={360} val={0.72} color="#3FB6E8" txt="Leucocitos" p={p('resto')} />
      </En>
      <Frotis x={290} y={810} R={130} tipo="plaquetas" id="c9f" o={p('frotis')} />
      <Txt x={560} y={810} txt="Frotis sin nada raro" t={28} p={p('frotis')} ancla="middle" />
      <Txt x={1090} y={290} txt="Busca lo que la imita o la causa" t={30} p={p('busca')} />
      <Sale p={p('busca')} x={1090} y={440} k={1}><Virus /></Sale>
      {chips.map(([x, y, t, n]) => <Rotulo key={n} x={x} y={y} txt={t} color={C.bazo[1]} p={p(n)} t={26} />)}
      <Diez x={1090} y={860} n={2} p={p('dos')} k={0.62} color={C.bazo} />
      <Txt x={1340} y={860} txt="2 de 10, secundarias" t={23} p={p('dos')} ancla="middle" />
    </g>
  );
};

const LoPrimero: Lamina = ({ p }) => {
  const nivel = 0.14 + 0.72 * tramo(p('responden'), 0, 1) * (1 - 0.72 * p('recae'));
  return (
    <g>
      <Rotulo x={420} y={70} txt="Si sangra o están muy bajas, tratas" color={C.rojo[1]} p={p('titulo')} t={29} />
      <Sale p={p('cort')} x={200} y={300} k={1.4}><Frasco tono={C.igm} /></Sale>
      <Rotulo x={200} y={480} txt="Corticoides" color={C.igm[0]} p={p('cort')} t={26} />
      <Diez x={570} y={250} n={9} p={p('responden')} color={C.verde} k={0.82} />
      <Txt x={570} y={345} txt="8 o 9 de cada 10, en pocos días" t={26} p={p('responden')} />
      <Barra x={380} y={440} w={380} val={nivel} color={C.plaq[1]} txt="Plaquetas" p={p('cort')} />
      <Rotulo x={570} y={560} txt="Recaída frecuente: no a largo plazo" color={C.rojo[0]} p={p('recae')} t={25} />
      <Sale p={p('ivig')} x={1130} y={460} k={1.5}><Macrofago /></Sale>
      <Rotulo x={1130} y={80} txt="Inmunoglobulina intravenosa" color={C.igg[1]} p={p('ivig')} t={28} />
      {[[1385, 345, 45], [1292, 480, 90], [1345, 610, 110]].map(([x, y, r], i) => {
        const dir = ((r - 90) * Math.PI) / 180;
        return (
          <g key={i}>
            <FcR x={x} y={y} r={r} k={1.7 * clamp(p('bloquea') + p('ivig'))} />
            <IgG x={x + Math.cos(dir) * 38} y={y + Math.sin(dir) * 38} r={r} k={1.25 * clamp(p('bloquea'))} tono={C.igm} />
          </g>
        );
      })}
      <Txt x={1130} y={800} txt="Bloquea los receptores del macrófago" t={27} p={p('bloquea')} />
      <Txt x={1130} y={860} txt="y ayuda a eliminar los anticuerpos" t={27} p={p('elimina')} />
      {Array.from({ length: 4 }, (_, i) => <IgG key={i} x={680 + i * 60} y={800 + (i % 2) * 20} r={i * 40} k={1} o={p('ivig') * (1 - p('elimina') * 0.9)} />)}
    </g>
  );
};

const Rituximab: Lamina = ({ p }) => {
  const m = p('elimina');
  return (
    <g>
      <Rotulo x={380} y={70} txt="Rituximab" color={C.igg[1]} p={p('titulo')} t={35} />
      {[[140, 240], [290, 200], [440, 250], [210, 370], [370, 380]].map(([x, y], i) => {
        const q = tramo(m, i * 0.13, 0.5 + i * 0.13);
        return <En key={i} x={x} y={y} o={p('titulo') * (1 - q * 0.82)} k={1 - q * 0.3}><Linfocito tono="b" k={0.95} /><IgG x={46} y={-30} r={55} k={0.9} /></En>;
      })}
      <Barra x={110} y={570} w={400} val={0.4} color={C.igg[1]} txt="Bien al año" p={p('uno')} valor="4 de 10" />
      <Barra x={110} y={700} w={400} val={0.3} color={C.mac[1]} txt="A los cinco años" p={p('cinco')} valor="3 de 10" />
      <Rotulo x={1090} y={80} txt="¿Y los que no responden?" color="var(--cit-base)" p={p('pregunta')} t={32} />
      <Txt x={1090} y={160} txt="Ya conoces a los sospechosos" t={28} p={p('conoces')} />
      <Sale p={p('plasm')} x={870} y={430} k={1.4}><Plasmatica /></Sale>
      {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 6.28; return <circle key={i} cx={870 + Math.cos(a) * 170} cy={430 + Math.sin(a) * 124} r={9} fill="#2DD4BF" opacity={p('plasm')} />; })}
      <Rotulo x={870} y={650} txt="Vida larga, sin CD20" color="#6B5AA8" p={p('plasm')} t={26} />
      <Sale p={p('cd8')} x={1320} y={430} k={1.75}><Linfocito tono="cd8" /></Sale>
      <Rotulo x={1320} y={650} txt="Célula T CD8" color="#6D28D9" p={p('cd8')} t={26} />
      <Txt x={1320} y={730} txt="Nunca necesitó un anticuerpo" t={25} p={p('nunca')} />
    </g>
  );
};

const AgonistasBazo: Lamina = ({ p }) => (
  <g>
    <Sale p={p('agon')} x={330} y={420} k={0.95}><Megacariocito /></Sale>
    <Rotulo x={330} y={75} txt="Agonistas de trombopoyetina" color="#F97316" p={p('agon')} t={27} />
    {Array.from({ length: 10 }, (_, i) => { const q = tramo(p('suben'), i * 0.06, 0.5 + i * 0.06), a = (i / 10) * 6.28; return q > 0 ? <Plaqueta key={i} x={330 + Math.cos(a) * lerp(190, 280, q)} y={420 + Math.sin(a) * lerp(190, 250, q)} k={0.72} r={i * 40} o={q} /> : null; })}
    <Txt x={330} y={760} txt="Suben las plaquetas en la mayoría" t={27} p={p('suben')} />
    <Txt x={330} y={830} txt="En algunos, la remisión se mantiene" t={27} p={p('remision')} />
    <Sale p={p('bazo')} x={1100} y={350} k={0.84}><Bazo /></Sale>
    <Rotulo x={1100} y={75} txt="Esplenectomía" color={C.bazo[1]} p={p('bazo')} t={30} />
    <Diez x={1100} y={670} n={7} p={p('dos')} color={C.verde} k={0.72} />
    <Txt x={1100} y={760} txt="Funciona en 2 de cada 3" t={27} p={p('dos')} />
    <Txt x={1100} y={830} txt="Hoy se usa menos: ya hay buenos fármacos" t={25} p={p('menos')} fuerte={false} />
    <Sale p={p('riesgo')} x={1000} y={910} k={0.42}><Virus /></Sale>
    <En x={1100} y={910} o={p('riesgo')}>{[[-18, 0], [12, -10], [12, 14], [36, 3]].map(([x, y], i) => <Plaqueta key={i} x={x} y={y} k={0.55} r={i * 40} />)}</En>
    <Txt x={1160} y={910} txt="Infección y trombosis" t={26} p={p('riesgo')} ancla="start" color={C.bazo[1]} />
  </g>
);

const VolverInicio: Lamina = ({ p }) => {
  const r = p('retratos');
  return (
    <g>
      {([[260, 'Syk', 'syk', C.c1[1]], [580, 'BTK', 'btk', C.igg[1]], [960, 'FcRn', 'fcrn', C.igm[0]], [1300, 'C1s', 'c1s', C.c3b[0]]] as const).map(([x, t, n, col]) => <Rotulo key={n} x={x} y={80} txt={t} color={col} p={p(n)} t={30} />)}
      <Sale p={r} x={360} y={370} k={0.72}><Persona quien="mujer" palidez={0.1} /></Sale>
      <Sale p={r} x={1240} y={370} k={0.72}><Persona quien="hombre" /></Sale>
      <HematieIg x={590} y={290} k={0.95} n={4} o={r} />
      <PlaquetaIg x={1010} y={290} k={1.3} n={3} o={r} />
      <Rotulo x={800} y={470} txt="Una misma traición" color="var(--cit-base)" p={p('traicion')} t={34} />
      <Sale p={p('q1')} x={500} y={720} k={1.3}><IgG y={-40} /></Sale>
      <Sale p={p('q2')} x={800} y={720}><rect x={-80} y={0} width={160} height={36} rx={14} fill={C.rojo[1]} /><Antigeno y={4} k={1.6} /></Sale>
      <Sale p={p('q3')} x={1100} y={700} k={0.26}><Bazo corte={false} /></Sale>
      <Rotulo x={500} y={800} txt="¿Qué anticuerpo?" color={C.igg[1]} p={p('q1')} t={26} />
      <Rotulo x={800} y={800} txt="¿Qué antígeno?" color={C.verde[1]} p={p('q2')} t={26} />
      <Rotulo x={1100} y={800} txt="¿Qué órgano?" color={C.bazo[1]} p={p('q3')} t={26} />
      <Txt x={800} y={900} txt="Respóndelo, y sabrás cómo salvarlos" t={39} p={p('fin')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [ComoSangra, Descartando, LoPrimero, Rituximab, AgonistasBazo, VolverInicio];
export default LAMINAS;
