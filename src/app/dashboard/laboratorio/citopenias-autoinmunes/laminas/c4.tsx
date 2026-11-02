'use client';
// Capítulo 4 · Cómo se reconoce la AHAI: dos patrones, el frotis y el Coombs.

import type { Lamina } from '../Lienzo';
import { Bazo, C, Chorro, Corazon, En, Esfera, Frotis, Hematie, IgG, IgM, Macrofago, Medula, Persona, Rotulo, Sale, TarjetaGel, Termometro, TuboOrina, Txt, clamp, easeOut, hash, lerp, tramo } from '../Piezas';
import { Barra, Bateria, Diez, HematieIg, Vesicula, viaje } from './Comun';

/** Tubo de plasma con hemoglobina libre (partículas rojas). */
function TuboPlasma({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  return (
    <Sale p={p} x={x} y={y} k={k}>
      <rect x={-46} y={-170} width={92} height={330} rx={40} fill="#D6E7F2" />
      <rect x={-37} y={-90} width={74} height={240} rx={32} fill="#E9767A" />
      <rect x={-37} y={-90} width={74} height={20} rx={10} fill="#F4A6A6" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(hash(i, 3) - 0.5) * 50} cy={-50 + hash(i, 4) * 180} r={6} fill={C.rojo[0]} />)}
      <rect x={-58} y={-188} width={116} height={32} rx={9} fill="#7F93A8" />
      <rect x={-26} y={-150} width={11} height={280} rx={5.5} fill="#FFF" opacity={0.6} />
    </Sale>
  );
}

const PatronLento: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={70} txt="Hemólisis extravascular: todo va lento" color={C.bazo[1]} p={p('titulo')} t={33} />
    <Sale p={p('persona')} x={340} y={520} k={1.02}><Persona quien="mujer" palidez={p('palidez')} /></Sale>
    <Sale p={p('fatiga')} x={830} y={250} k={1.1}><Bateria val={lerp(0.9, 0.12, p('apaga'))} /></Sale>
    <Rotulo x={830} y={350} txt="Fatiga" color="#5B6C80" p={p('fatiga')} t={27} />
    <Rotulo x={340} y={150} txt="Palidez" color="#B99E86" p={p('palidez')} t={27} />
    <Sale p={p('ictericia')} x={1100} y={250} k={1.05}>
      <ellipse rx={84} ry={50} fill="#FFF" />
      <ellipse rx={84} ry={50} fill="#F6CE2F" opacity={0.65} />
      <circle r={34} fill="#6B4E32" /><circle r={17} fill="#20140C" /><circle cx={11} cy={-12} r={8} fill="#FFF" />
    </Sale>
    <Rotulo x={1100} y={350} txt="Ictericia" color="#C49A0C" p={p('ictericia')} t={27} />
    <Sale p={p('calculos')} x={1360} y={250}><Vesicula /></Sale>
    <Rotulo x={1360} y={350} txt="Cálculos" color="#2F7A3F" p={p('calculos')} t={27} />
    <Sale p={p('bazo')} x={830} y={590} k={0.52}><Bazo corte={false} /></Sale>
    <Rotulo x={830} y={730} txt="Bazo grande" color={C.bazo[1]} p={p('bazo')} t={27} />
    <Sale p={p('bili')} x={1120} y={590} k={0.58}><Macrofago /></Sale>
    <Chorro a={[1200, 590]} b={[1450, 590]} p={p('bili')} color="#E8B20C" R={9} n={16} abanico={60} />
    <Rotulo x={1260} y={730} txt="Bilirrubina indirecta" color="#C49A0C" p={p('bili')} t={27} />
    <Txt x={1090} y={860} txt="Lleva semanas apagándose, sin saber por qué" t={30} p={p('apaga')} />
  </g>
);

const PatronBrusco: Lamina = ({ p, reloj }) => {
  const late = 1 + 0.07 * Math.abs(Math.sin(reloj / 170)) * clamp(p('taqui'));
  return (
    <g>
      <Rotulo x={800} y={70} txt="Hemólisis intravascular: es otra historia" color={C.rojo[1]} p={p('titulo')} t={33} />
      <Sale p={p('persona')} x={320} y={520} k={1.02}><Persona quien="hombre" palidez={0.8} /></Sale>
      <Sale p={p('taqui')} x={780} y={250}><En k={0.85 * late}><Corazon /></En></Sale>
      <Rotulo x={780} y={390} txt="Taquicardia" color={C.rojo[0]} p={p('taqui')} t={26} />
      <Sale p={p('fiebre')} x={1030} y={315} k={0.46}><Termometro val={1} /></Sale>
      <Rotulo x={1030} y={390} txt="Fiebre" color={C.rojo[1]} p={p('fiebre')} t={26} />
      <Sale p={p('orina')} x={1270} y={230} k={0.72}><TuboOrina oscuro={1} /></Sale>
      <Rotulo x={1270} y={390} txt="Orina oscura" color="#7A3B1E" p={p('orina')} t={26} />
      <Rotulo x={320} y={150} txt="Falta de aire" color="#3F86E0" p={p('aire')} t={26} />
      <Barra x={700} y={560} w={410} val={0.94} color={C.rojo[1]} txt="LDH" p={p('ldh')} valor=">500" />
      <TuboPlasma x={910} y={760} k={0.58} p={p('plasma')} />
      <Txt x={910} y={880} txt="Hb libre en el plasma" t={27} p={p('plasma')} />
      <Sale p={p('huria')} x={1290} y={750} k={0.62}><TuboOrina oscuro={0.75} /></Sale>
      <Txt x={1290} y={880} txt="Hemoglobina en la orina" t={27} p={p('huria')} />
    </g>
  );
};

const LaMedula: Lamina = ({ p }) => {
  const sube = p('suben'), no = p('no');
  return (
    <g>
      <Sale p={p('medula')} x={350} y={280} k={0.8}><Medula /></Sale>
      <Rotulo x={350} y={80} txt="La médula intenta compensar" color="#C93A52" p={p('medula')} t={28} />
      {Array.from({ length: 7 }, (_, i) => {
        const q = tramo(sube, i * 0.08, 0.5 + i * 0.08);
        return q > 0 ? (
          <En key={i} x={lerp(640, 800 + i * 95, easeOut(q))} y={250 + (i % 3) * 56} k={0.95} o={lerp(1, 0.25, no) * q}>
            <Hematie r={i * 40} />
            {[[-14, -8], [8, -14], [14, 8], [-6, 12], [0, -1]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={3.2} fill="#5B3CC4" />)}
          </En>
        ) : null;
      })}
      <Rotulo x={1110} y={90} txt="Reticulocitos" color={C.plaq[1]} p={sube} t={29} />
      <Diez x={330} y={640} n={2} p={no} color={C.c1} k={0.9} />
      <Txt x={330} y={760} txt="2 de cada 10 adultos: no suben" t={29} p={no} />
      <Rotulo x={330} y={860} txt="Están más graves" color={C.rojo[1]} p={p('graves')} t={29} />
      <Txt x={1090} y={530} txt="La haptoglobina se consume" t={33} p={p('hapto')} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const q = tramo(p('consume'), i * 0.1, 0.5 + i * 0.1);
        return (
          <En key={i} x={810 + i * 110} y={660} o={p('hapto')}>
            <rect x={-30} y={-52} width={60} height={104} rx={24} fill={C.verde[0]} opacity={lerp(1, 0.18, q)} />
            <rect x={-23} y={-46} width={46} height={92} rx={20} fill={C.verde[1]} opacity={lerp(1, 0.18, q)} />
            {q > 0 && <En k={easeOut(q)} y={0}><circle r={17} fill={C.rojo[0]} /><circle cx={-3} cy={-3} r={12} fill={C.rojo[1]} /></En>}
          </En>
        );
      })}
      <Rotulo x={1090} y={810} txt="Uno de los marcadores más sensibles" color={C.verde[0]} p={p('sensible')} t={27} />
    </g>
  );
};

const ElFrotis: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={70} txt="Primero, el frotis" color="var(--cit-base)" p={p('titulo')} t={36} />
    <Txt x={800} y={150} txt="Descarta microangiopatía y anemia hereditaria" t={29} p={p('descarta')} fuerte={false} />
    <Frotis x={430} y={450} R={240} tipo="esferocitos" id="c4a" o={p('esfero')} />
    <Rotulo x={430} y={740} txt="Esferocitos" color={C.rojo[0]} p={p('esfero')} t={30} sobre="" />
    <Txt x={430} y={810} txt="Piensa en la forma caliente" t={28} p={p('caliente')} />
    <Frotis x={1170} y={450} R={240} tipo="aglutinados" id="c4b" o={p('grumos')} />
    <Rotulo x={1170} y={740} txt="Grumos" color="#2F8DE8" p={p('grumos')} t={30} />
    <Txt x={1170} y={810} txt="Piensa en la forma fría" t={28} p={p('fria')} />
    <Txt x={800} y={910} txt="A veces se aglutina sola en el tubo, y el laboratorio te llama" t={28} p={p('tubo')} />
  </g>
);

const ElCoombs: Lamina = ({ p }) => {
  const r = p('reactivo'), ag = p('aglutina');
  const a = viaje([300, 420], [440, 460], ag), b = viaje([640, 420], [570, 460], ag);
  return (
    <g>
      <Rotulo x={470} y={80} txt="Prueba de antiglobulina directa" color={C.igg[1]} p={p('titulo')} t={29} sobre="Coombs directo" colorSobre={C.igg[0]} />
      <Sale p={p('titulo')}><HematieIg x={a.x} y={a.y} k={1.6} n={5} /></Sale>
      <Sale p={p('titulo')}><HematieIg x={b.x} y={b.y} k={1.6} n={5} ang0={-20} /></Sale>
      {Array.from({ length: 3 }, (_, i) => { const q = tramo(r, i * 0.15, 0.6 + i * 0.15); return q > 0 ? <IgG key={i} x={lerp(470, 505, ag)} y={lerp(140 + i * 20, 400 + i * 58, q)} r={90} k={1.1} o={q} tono={C.verde} /> : null; })}
      <Rotulo x={470} y={700} txt="Reconoce lo que ya está pegado" color={C.verde[0]} p={r} t={27} />
      <Txt x={470} y={790} txt="Si hay algo, se aglutina" t={30} p={ag} />
      <Sale p={p('tarjeta')} x={1140} y={440} k={1.08}><TarjetaGel pos={[clamp(p('anti')), 0, 0, 0, clamp(p('antic3')), 0]} /></Sale>
      <Txt x={1140} y={100} txt="No basta un positivo: ¿qué está pegado?" t={29} p={p('tarjeta')} />
      <Rotulo x={920} y={800} txt="Anti-IgG" color={C.igg[1]} p={p('anti')} t={30} />
      <Rotulo x={1260} y={800} txt="Anti-C3d" color={C.c3b[0]} p={p('antic3')} t={30} />
      <Txt x={1090} y={880} txt="Siempre por separado" t={29} p={p('separado')} />
    </g>
  );
};

const LeerResultado: Lamina = ({ p }) => {
  const a = p('caliente'), b = p('fria'), c = p('mixta');
  const igg = c > 0 ? clamp(c) : a * (1 - b);
  const c3 = Math.max(b, c, a * 0.28);
  const suelta = p('suelta');
  return (
    <g>
      <Sale p={p('tarjeta')} x={390} y={430} k={1}><TarjetaGel pos={[igg, 0, 0, 0, c3, 0]} /></Sale>
      <Sale p={a * (1 - b)} x={960} y={500} k={0.62}><Termometro val={1} /></Sale>
      <Rotulo x={1220} y={260} txt="Forma caliente" color={C.rojo[1]} p={a * (1 - b)} t={33} />
      <Sale p={b * (1 - c)} x={960} y={500} k={0.62}><Termometro val={0.03} /></Sale>
      <Rotulo x={1220} y={260} txt="Forma fría" color="#2F8DE8" p={b * (1 - c)} t={33} sobre="Solo C3d, con aglutininas" colorSobre="#2F8DE8" />
      <Sale p={c * (1 - suelta)} x={960} y={500} k={0.62}><Termometro val={0.5} /></Sale>
      <Rotulo x={1220} y={260} txt="Mixta" color="#A34FE8" p={c * (1 - suelta)} t={33} sobre="Las dos cosas" colorSobre="#A34FE8" />
      {p('porque') > 0.01 && (() => {
        const X = 1220, Y = 560;
        return (
          <En o={tramo(p('porque'), 0, 0.5)}>
            <Hematie x={X} y={Y} k={1.9} />
            <IgM x={lerp(X + 70, X + 270, easeOut(suelta))} y={lerp(Y - 120, Y - 230, easeOut(suelta))} k={1.05} r={suelta * 80} />
            {[[-52, -42], [56, 10], [-16, 62]].map(([dx, dy], i) => { const q = tramo(p('huella'), i * 0.2, 0.6 + i * 0.2); return q > 0 ? <En key={i} x={X + dx} y={Y + dy} k={easeOut(q)}><Esfera R={18} /></En> : null; })}
          </En>
        );
      })()}
      <Txt x={1220} y={780} txt="¿Por qué no ves la IgM? Se suelta" t={28} p={p('porque')} />
      <Rotulo x={1220} y={860} txt="Queda su huella: C3d" color={C.c3b[0]} p={p('huella')} t={31} />
    </g>
  );
};

const LasTrampas: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={70} txt="El Coombs también se equivoca" color="var(--cit-base)" p={p('titulo')} t={35} />
    <Sale p={p('neg')} x={400} y={390} k={0.68}><TarjetaGel pos={[0, 0, 0, 0, 0, 0]} /></Sale>
    <Rotulo x={400} y={610} txt="Negativo: hasta 1 de cada 10" color="#5B6C80" p={p('neg')} t={26} />
    <Sale p={p('iga')} x={290} y={760}><HematieIg k={1.15} n={4} /></Sale>
    <Txt x={560} y={740} txt="Es IgA" t={28} p={p('iga')} />
    <Txt x={560} y={790} txt="o se suelta al lavar" t={28} p={p('lavar')} />
    <Sale p={p('donante')} x={1190} y={380} k={0.7}><Persona quien="hombre" /></Sale>
    <Rotulo x={1190} y={640} txt="Positivo en un donante sano" color={C.verde[0]} p={p('donante')} t={26} />
    <Hematie x={950} y={770} k={1.2} o={p('sin')} />
    <Txt x={1030} y={770} txt="Sin hemólisis, no es enfermedad" t={27} p={p('sin')} ancla="start" />
    <Rotulo x={800} y={900} txt="El Coombs no se obedece: se interpreta" color="var(--cit-base)" p={p('interpreta')} t={35} />
  </g>
);

const LAMINAS: Lamina[] = [PatronLento, PatronBrusco, LaMedula, ElFrotis, ElCoombs, LeerResultado, LasTrampas];
export default LAMINAS;
