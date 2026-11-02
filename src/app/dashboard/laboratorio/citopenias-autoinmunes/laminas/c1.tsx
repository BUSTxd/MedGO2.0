'use client';
// Capítulo 1 · La temperatura lo decide.

import type { Lamina } from '../Lienzo';
import { Bazo, C, Corazon, En, Flecha, Frasco, Ganglio, Hematie, HematieRoto, Higado, IgG, IgM, Linfocito, Mano, Medula, Micoplasma, Pastilla, Persona, Plasmatica, Rotulo, Sale, TarjetaGel, Termometro, Txt, enBorde, lerp, tramo } from '../Piezas';
import { Copo, Diez, FLECHA, HematieIg, viaje } from './Comun';

/** Glóbulo rojo con anticuerpos IgM unidos. */
function HematieM({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  return (
    <En x={x} y={y} k={k}>
      {[-60, 60, 180].map((a, i) => {
        const q = tramo(p, i * 0.2, 0.5 + i * 0.2), b = enBorde(0, 0, 66 + 40 * (1 - q), a);
        return q > 0 ? <IgM key={a} x={b.x} y={b.y} r={a + 90} k={0.62} o={q} /> : null;
      })}
      <Hematie />
    </En>
  );
}

const UnSoloDato: Lamina = ({ p, reloj }) => {
  const entra = p('termo');
  const sube = 0.5 + 0.5 * Math.sin(reloj / 900);
  return (
    <g>
      <Sale p={entra} x={800} y={640} k={1.15}><Termometro val={lerp(0.15, 0.9, sube)} /></Sale>
      <Rotulo x={800} y={90} txt="La temperatura" color="var(--cit-base)" p={p('dato')} t={36} />
      <Sale p={p('pega')} x={420} y={460} k={2.5}><HematieIg n={5} p={p('pega')} /></Sale>
      <Rotulo x={420} y={680} txt="El anticuerpo se pega" color={C.igg[1]} p={p('pega')} t={28} />
      <Txt x={420} y={770} txt="¿Un detalle de laboratorio? No." t={28} p={p('detalle')} fuerte={false} />
      <Sale p={p('mecanismo')} x={1180} y={340} k={0.56}><Bazo /></Sale>
      <Sale p={p('mecanismo')} x={1420} y={350} k={0.42}><Higado /></Sale>
      <Rotulo x={1290} y={510} txt="El mecanismo" color={C.bazo[1]} p={p('mecanismo')} t={28} />
      <Sale p={p('receta')} x={1210} y={690}><Frasco /></Sale>
      <Sale p={p('receta')} x={1380} y={700} r={-20}><Pastilla /></Sale>
      <Rotulo x={1290} y={830} txt="Lo que vas a recetar" color={C.igm[0]} p={p('receta')} t={28} />
    </g>
  );
};

const Caliente: Lamina = ({ p }) => (
  <g>
    <Sale p={p('termo')} x={220} y={660} k={1.05}><Termometro val={1} /></Sale>
    <Rotulo x={220} y={880} txt="37 °C" color={C.rojo[1]} p={p('une')} t={36} />
    <Rotulo x={700} y={110} txt="Forma caliente" color={C.rojo[1]} p={p('termo')} t={38} />
    <Sale p={p('termo')} x={700} y={410} k={3}><HematieIg n={6} p={p('igg')} /></Sale>
    <Rotulo x={700} y={690} txt="IgG" color={C.igg[1]} p={p('igg')} t={36} />
    <Diez x={1230} y={210} n={7} p={p('siete')} />
    <Txt x={1230} y={320} txt="7 de cada 10" t={36} p={p('siete')} />
    <Txt x={1230} y={460} txt="En la mitad, hay algo debajo" t={31} p={p('debajo')} />
    <Sale p={p('linfoma')} x={1030} y={610} k={1.1}><Ganglio /></Sale>
    <Rotulo x={1030} y={730} txt="Linfoma" color="#2F7A67" p={p('linfoma')} t={26} />
    <Sale p={p('leucemia')} x={1230} y={610}>
      {[[-44, -20], [40, -28], [0, 30], [-50, 44], [52, 36]].map(([cx, cy], i) => <Linfocito key={i} x={cx} y={cy} k={0.55} tono="gris" />)}
    </Sale>
    <Rotulo x={1230} y={730} txt="Leucemia" color="#555C6A" p={p('leucemia')} t={26} />
    <Sale p={p('lupus')} x={1430} y={590} k={0.36}>
      <Persona quien="mujer" />
      <path d="M-74,-8 Q-40,-34 0,-6 Q40,-34 74,-8 Q40,22 0,4 Q-40,22 -74,-8 Z" fill={C.rojo[1]} opacity={0.5} />
    </Sale>
    <Rotulo x={1430} y={730} txt="Lupus" color="#C2385A" p={p('lupus')} t={26} />
    <Rotulo x={1230} y={850} txt="Búscalo" color="var(--cit-base)" p={p('busca')} t={34} />
  </g>
);

const Fria: Lamina = ({ p }) => (
  <g>
    <Sale p={p('termo')} x={220} y={660} k={1.05}><Termometro val={0.03} /></Sale>
    <Rotulo x={220} y={880} txt="4 °C" color="#2F8DE8" p={p('cuatro')} t={36} />
    <Sale p={p('termo')} x={350} y={180} k={1.1}><Copo /></Sale>
    <Rotulo x={680} y={110} txt="Forma fría" color="#2F8DE8" p={p('termo')} t={38} />
    <Sale p={p('termo')}><HematieM x={680} y={410} k={2.4} p={p('igm')} /></Sale>
    <Rotulo x={680} y={690} txt="IgM" color={C.igm[0]} p={p('igm')} t={36} />
    <Sale p={p('clon')} x={1240} y={230} k={0.58}><Medula /></Sale>
    <Sale p={p('clon')} x={1240} y={230}>
      {[-90, -30, 30, 90].map((dx, i) => <Plasmatica key={i} x={dx} y={i % 2 ? 10 : -10} k={0.52} />)}
    </Sale>
    <Rotulo x={1240} y={400} txt="Enfermedad por aglutininas frías" color={C.igm[0]} p={p('eaf')} t={28} sobre="Un clon, sin otra enfermedad" colorSobre={C.igm[0]} />
    <Sale p={p('causa')} x={1110} y={640} k={1.4}><Ganglio /></Sale>
    <Sale p={p('mico')} x={1380} y={640} k={1.3}><Micoplasma /></Sale>
    <Rotulo x={1110} y={760} txt="Linfoma" color="#2F7A67" p={p('causa')} t={26} />
    <Rotulo x={1380} y={760} txt="Micoplasma" color={C.verde[0]} p={p('mico')} t={26} />
    <Rotulo x={1240} y={870} txt="Síndrome por aglutininas frías" color="#2F8DE8" p={p('saf')} t={28} />
  </g>
);

const MixtaFrigore: Lamina = ({ p }) => {
  const via = p('viaja'), roto = p('estalla');
  const pos = viaje([1000, 560], [1370, 560], via);
  return (
    <g>
      <Rotulo x={300} y={110} txt="Mixta" color="#A34FE8" p={p('mixta')} t={38} />
      <Sale p={p('mixta')} x={300} y={410} k={2.6}>
        <HematieIg n={4} ang0={-130} p={p('ambas')} />
        {[-40, 140].map((a) => { const b = enBorde(0, 0, 70, a); return <IgM key={a} x={b.x} y={b.y} k={0.6} o={p('ambas')} />; })}
      </Sale>
      <Rotulo x={230} y={680} txt="IgG" color={C.igg[1]} p={p('ambas')} t={30} />
      <Rotulo x={370} y={680} txt="IgM" color={C.igm[0]} p={p('ambas')} t={30} />
      <Txt x={300} y={780} txt="Más agresiva" t={33} p={p('agresiva')} />
      <Rotulo x={1100} y={100} txt="Hemoglobinuria paroxística a frigore" color="#2F8DE8" p={p('hpf')} t={30} />
      <Txt x={1100} y={175} txt="Casi exclusiva de niños" t={30} p={p('ninos')} />
      <Rotulo x={1100} y={260} txt="Anticuerpo de Donath-Landsteiner" color={C.igg[1]} p={p('dl')} t={25} />
      <Sale p={p('dl')} x={920} y={440} k={0.34}><Mano azul={0.85} /></Sale>
      <Sale p={p('dl')} x={1040} y={380} k={0.8}><Copo /></Sale>
      <Sale p={p('dl')} x={1370} y={420} k={0.55}><Corazon /></Sale>
      <Txt x={930} y={690} txt="Se une en frío" t={29} p={p('une')} color="#2F8DE8" />
      <Txt x={1370} y={700} txt="Al calentarse, estalla" t={29} p={p('estalla')} color={C.rojo[1]} />
      <Flecha a={[1090, 610]} b={[1270, 610]} p={via} color={FLECHA} w={8} />
      {p('une') > 0.01 && (roto <= 0 ? <HematieIg x={pos.x} y={pos.y} k={1.05} n={4} p={p('une')} /> : <HematieRoto x={pos.x} y={pos.y} k={1.1} p={roto} />)}
    </g>
  );
};

const PorQueImporta: Lamina = ({ p }) => (
  <g>
    <Sale p={p('entra')} x={800} y={430} k={0.72}><Termometro val={0.55} /></Sale>
    <Flecha a={[720, 300]} c={[520, 240]} b={[370, 300]} p={p('donde')} color={FLECHA} w={9} />
    <Flecha a={[880, 300]} c={[1080, 240]} b={[1230, 300]} p={p('donde')} color={FLECHA} w={9} />
    <Sale p={p('donde')} x={290} y={430} k={0.55}><Bazo corte={false} /></Sale>
    <Sale p={p('donde')} x={1310} y={430} k={0.48}><Higado corte={false} /></Sale>
    <Rotulo x={290} y={160} txt="Caliente" color={C.rojo[1]} p={p('donde')} />
    <Rotulo x={1310} y={160} txt="Fría" color="#2F8DE8" p={p('donde')} />
    <Sale p={p('prueba')} x={290} y={690} k={0.36}><TarjetaGel pos={[1, 0, 0, 0, 0.2, 0]} /></Sale>
    <Sale p={p('prueba')} x={1310} y={690} k={0.36}><TarjetaGel pos={[0, 0, 0, 0, 1, 0]} /></Sale>
    <Sale p={p('farmaco')} x={540} y={690} k={0.7}><Frasco tono={C.igm} /></Sale>
    <Sale p={p('farmaco')} x={1060} y={690} k={0.7}><Frasco tono={C.ambar} /></Sale>
    <Rotulo x={800} y={880} txt="¿A qué temperatura trabaja el anticuerpo?" color="var(--cit-base)" p={p('pregunta')} t={32} />
    <IgG x={800} y={730} k={1.6} o={p('pregunta')} />
  </g>
);

const LAMINAS: Lamina[] = [UnSoloDato, Caliente, Fria, MixtaFrigore, PorQueImporta];
export default LAMINAS;
