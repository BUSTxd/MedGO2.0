'use client';
// Capítulo 0 · Una marca, dos enfermedades.

import type { Lamina } from '../Lienzo';
import { Bazo, C, En, Flecha, Hematie, IgG, Linfocito, Medula, Persona, Pierna, Plaqueta, Rotulo, Sale, TuboOrina, Txt, clamp, easeOut, tramo } from '../Piezas';
import { Antigeno, Barra, FLECHA, HematieIg, PlaquetaIg, viaje } from './Comun';

const LaMujer: Lamina = ({ p, reloj }) => {
  const late = 1 + 0.03 * Math.sin(reloj / 170) * p('medula');
  return (
    <g>
      <Sale p={p('persona')} x={440} y={470} k={1.12}><Persona quien="mujer" palidez={p('palida')} /></Sale>
      <Sale p={p('orina')} x={900} y={330} k={0.92}><TuboOrina oscuro={p('oscuro')} /></Sale>
      <Rotulo x={900} y={545} txt="Orina oscura" color="#7A3B1E" p={p('orina')} t={27} />
      <Sale p={p('medula')} x={1290} y={260}><En k={0.56 * late}><Medula /></En></Sale>
      <Rotulo x={1290} y={395} txt="Médula al máximo" color="#C93A52" p={p('medula')} t={27} />
      <Barra x={1100} y={530} w={380} val={1 - 0.72 * p('hb')} p={p('medula')} txt="Hemoglobina" color={C.rojo[1]} />
      <Rotulo x={1020} y={700} txt="¿Quién los destruye?" color="var(--cit-base)" p={p('quien')} t={32} />
      <HematieIg x={1020} y={850} k={1.25} p={p('propio')} o={tramo(p('quien'), 0, 0.5)} />
      <Rotulo x={1350} y={850} txt="Su sistema inmune" color={C.igg[1]} p={p('propio')} t={30} />
    </g>
  );
};

const ElHombre: Lamina = ({ p }) => {
  const gotas = p('boca');
  return (
    <g>
      <Sale p={p('persona')} x={370} y={470} k={1.12}><Persona quien="hombre" /></Sale>
      {gotas > 0.01 && [0, 1, 2].map((i) => (
        <En key={i} x={350 + i * 22} y={525 + easeOut(tramo(gotas, i * 0.2, 0.7 + i * 0.1)) * (46 + i * 18)} o={tramo(gotas, i * 0.2, 0.4 + i * 0.2)} k={0.85}>
          <path d="M0,-14 C6,-5 11,1 11,7 A11,11 0 1 1 -11,7 C-11,1 -6,-5 0,-14 Z" fill={C.rojo[1]} />
        </En>
      ))}
      <Sale p={p('pierna')} x={820} y={520} k={1.08}><Pierna p={p('petequias')} /></Sale>
      <Rotulo x={820} y={110} txt="Puntos rojos" color={C.rojo[0]} p={p('petequias')} t={28} />
      <Rotulo x={1290} y={240} txt="Hemograma" color="var(--cit-base)" p={p('hemograma')} t={30} />
      {([[350, 'Glóbulos rojos', <Hematie key="a" k={0.6} />, 0.8, C.rojo[1]], [510, 'Leucocitos', <Linfocito key="b" k={0.46} tono="t" />, 0.72, '#3FB6E8']] as const).map(([y, txt, ic, val, col]) => (
        <g key={txt}>
          <En x={1090} y={y as number} o={tramo(p('hemograma'), 0, 0.5)}>{ic}</En>
          <Barra x={1150} y={(y as number) + 8} w={290} val={val as number} color={col as string} txt={txt as string} p={p('hemograma')} />
        </g>
      ))}
      <En x={1090} y={670} o={tramo(p('hemograma'), 0, 0.5)} k={0.95}><Plaqueta /></En>
      <Barra x={1150} y={678} w={290} val={0.74 - 0.7 * p('caen')} color={C.plaq[1]} txt="Plaquetas" p={p('hemograma')} />
      <Rotulo x={1250} y={800} txt="Casi no le quedan" color={C.plaq[0]} p={p('quedan')} t={32} />
    </g>
  );
};

const Traicion: Lamina = ({ p }) => {
  const ig = p('anticuerpo');
  const a = viaje([770, 130], [480, 420], tramo(ig, 0, 1));
  const marca = p('marca');
  return (
    <g>
      <Rotulo x={800} y={84} txt="Una misma traición" color="var(--cit-base)" p={p('traicion')} t={36} />
      <Sale p={p('celulas')} x={470} y={450} k={3.2}><Hematie /></Sale>
      <Sale p={p('celulas')} x={1130} y={450} k={4.2}><Plaqueta /></Sale>
      {ig < 1 && ig > 0 && <IgG x={a.x} y={a.y} k={1.6} r={0} />}
      {ig > 0.9 && <En o={tramo(ig, 0.9, 1)}><HematieIg x={470} y={450} k={3.2} n={6} p={ig > 0.9 ? 1 : 0} /></En>}
      <PlaquetaIg x={1130} y={450} k={4.2} n={5} p={tramo(ig, 0.3, 1)} />
      {marca > 0.01 && (
        <>
          <circle cx={470} cy={450} r={200 + 24 * easeOut(marca)} fill="none" stroke={C.c3b[1]} strokeWidth={9} opacity={1 - tramo(marca, 0.6, 1) * 0.55} />
          <circle cx={1130} cy={450} r={200 + 24 * easeOut(marca)} fill="none" stroke={C.c3b[1]} strokeWidth={9} opacity={1 - tramo(marca, 0.6, 1) * 0.55} />
        </>
      )}
      <Rotulo x={470} y={770} txt="Anemia hemolítica autoinmune" color={C.rojo[1]} p={p('ahai')} t={31} sobre="En ella: el glóbulo rojo" colorSobre={C.rojo[0]} />
      <Rotulo x={1130} y={770} txt="Púrpura trombocitopénica inmune" color={C.plaq[1]} p={p('pti')} t={31} sobre="En él: la plaqueta" colorSobre={C.plaq[0]} />
    </g>
  );
};

const TresPreguntas: Lamina = ({ p }) => {
  const ev = p('evans');
  return (
    <g>
      <Rotulo x={800} y={70} txt="Tres preguntas" color="var(--cit-base)" p={p('tres')} t={36} />
      <Sale p={p('q1')} x={300} y={250} k={3.2}><IgG y={-40} /></Sale>
      <Rotulo x={300} y={455} txt="¿Qué anticuerpo?" color={C.igg[1]} p={p('q1')} />
      <Sale p={p('q2')} x={800} y={330}>
        <rect x={-150} y={0} width={300} height={60} rx={22} fill={C.rojo[1]} />
        <Antigeno y={6} k={2.6} />
      </Sale>
      <Rotulo x={800} y={455} txt="¿Qué antígeno?" color={C.verde[1]} p={p('q2')} />
      <Sale p={p('q3')} x={1300} y={250} k={0.62}><Bazo corte={false} /></Sale>
      <Rotulo x={1300} y={455} txt="¿Qué órgano?" color={C.bazo[1]} p={p('q3')} />
      <Flecha a={[800, 530]} b={[800, 585]} p={p('todo')} color={FLECHA} w={8} />
      <Txt x={800} y={630} txt="Ahí está casi todo, hasta el tratamiento" t={34} p={p('todo')} />
      <Sale p={ev} x={640} y={830} k={1.45}><HematieIg n={5} /></Sale>
      <Sale p={clamp(ev * 1.3)} x={830} y={830} k={1.7}><PlaquetaIg n={4} /></Sale>
      <Rotulo x={1150} y={830} txt="Síndrome de Evans" color="#A34FE8" p={p('nombre')} t={34} />
    </g>
  );
};

const LAMINAS: Lamina[] = [LaMujer, ElHombre, Traicion, TresPreguntas];
export default LAMINAS;
