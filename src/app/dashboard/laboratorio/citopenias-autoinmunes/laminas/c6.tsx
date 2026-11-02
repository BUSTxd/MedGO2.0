'use client';
// Capítulo 6 · PTI: la marca en la plaqueta.

import type { Lamina } from '../Lienzo';
import { Bazo, C, hash, Chorro, En, Flecha, Folicular, IgG, Linfocito, Macrofago, Medula, Megacariocito, Persona, Plaqueta, Plasmatica, Rotulo, Sale, Txt, Vaso, Virus, clamp, easeOut, enBorde, lerp, tramo } from '../Piezas';
import { Antigeno, Cruz, Diez, FLECHA, PlaquetaIg, viaje } from './Comun';

const DosProblemas: Lamina = ({ p }) => (
  <g>
    <Sale p={p('hombre')} x={200} y={380} k={0.6}><Persona quien="hombre" /></Sale>
    <Rotulo x={800} y={70} txt="No es un problema: son dos" color={C.plaq[1]} p={p('dos')} t={35} />
    <Sale p={p('prod')} x={620} y={420} k={0.95}><Megacariocito prolong={lerp(1, 0.35, p('produccion'))} /></Sale>
    {Array.from({ length: 7 }, (_, i) => { const q = tramo(p('dest'), i * 0.09, 0.5 + i * 0.09); return <En key={i} x={1040 + (i % 3) * 110} y={270 + i * 44} o={1 - q * 0.95} k={1 + q * 0.2}><PlaquetaIg k={1} n={3} /></En>; })}
    <Rotulo x={1160} y={150} txt="1. Se destruyen en la periferia" color={C.rojo[1]} p={p('dest')} t={27} />
    <Rotulo x={620} y={735} txt="2. La médula no produce lo que debería" color={C.plaq[0]} p={p('produccion')} t={27} />
    <Diez x={1230} y={760} n={7} p={p('siete')} color={C.plaq} k={0.8} />
    <Txt x={1230} y={860} txt="7 de cada 10 adultos: se vuelve duradera" t={26} p={p('siete')} />
  </g>
);

const FrenoRoto: Lamina = ({ p, reloj }) => (
  <g>
    <Rotulo x={800} y={64} txt="Todo empieza con un freno roto" color={C.verde[0]} p={p('freno')} t={34} />
    {([[300, 'En la sangre', 'sangre'], [800, 'En el bazo', 'bazo'], [1300, 'En la médula', 'medula']] as const).map(([x, t, n]) => (
      <g key={n}>
        <Sale p={p(n)} x={x} y={270}>
          {n === 'sangre' && <Vaso w={360} h={130} flujo={2} reloj={reloj} />}
          {n === 'bazo' && <Bazo k={0.46} corte={false} />}
          {n === 'medula' && <Medula k={0.44} />}
          <Linfocito tono="treg" k={0.72} y={0} x={0} o={0.8} />
          <Cruz k={0.95} />
        </Sale>
        <Rotulo x={x} y={440} txt={t} color={C.verde[0]} p={p(n)} t={26} />
      </g>
    ))}
    <Sale p={p('th1')} x={560} y={620}><Linfocito tono="th1" k={1.05} /></Sale>
    <Rotulo x={560} y={730} txt="TH1" color="#DB3A97" p={p('th1')} t={28} />
    <Sale p={p('th17')} x={230} y={620}><Linfocito tono="th17" k={1.05} /></Sale>
    <Rotulo x={230} y={730} txt="TH17" color="#F97316" p={p('th17')} t={28} />
    <Txt x={1120} y={530} txt="¿Qué lo dispara? No se sabe" t={32} p={p('dispara')} />
    <Sale p={p('mimet')} x={920} y={700} k={1.1}><Virus /></Sale>
    <Txt x={1120} y={700} txt="≈" t={88} p={p('parece')} color={C.c1[0]} />
    <Sale p={p('parece')} x={1310} y={700} k={2.7}><Plaqueta gp /></Sale>
    <Rotulo x={1120} y={870} txt="Mimetismo: VIH o hepatitis C" color={C.c1[1]} p={p('mimet')} t={27} />
  </g>
);

const Presenta: Lamina = ({ p }) => {
  const q = p('muestra');
  const frag = viaje([700, 520], [960, 460], q);
  return (
    <g>
      <Sale p={p('bazo')} x={790} y={470} k={1.6}><Bazo /></Sale>
      <Sale p={p('macro')} x={560} y={530} k={1.08}><Macrofago /></Sale>
      <Rotulo x={380} y={160} txt="Macrófago esplénico" color="#1287B5" p={p('macro')} t={28} />
      {[0, 1, 2].map((i) => { const m = tramo(p('come'), i * 0.2, 0.65 + i * 0.2); const a = viaje([180, 330 + i * 120], [510, 520], m); return p('come') > 0 ? <PlaquetaIg key={i} x={a.x} y={a.y} k={lerp(1.4, 0.6, m)} n={3} o={1 - tramo(m, 0.8, 1)} /> : null; })}
      {q > 0 && <En x={frag.x} y={frag.y} k={0.8}><Plaqueta /></En>}
      <Flecha a={[740, 510]} b={[900, 480]} p={q} color="#FFF" w={9} />
      <Sale p={p('t')} x={1050} y={470}><Linfocito tono="t" k={1.25} /></Sale>
      <Rotulo x={1050} y={610} txt="Célula T" color="#127CB5" p={p('t')} t={27} />
      <Rotulo x={900} y={360} txt="Por clase II" color={C.c1[0]} p={q} t={26} />
      <Rotulo x={1230} y={160} txt="La principal presentadora" color="var(--cit-base)" p={p('principal')} t={28} />
      <Txt x={800} y={920} txt="El mismo que destruye da la orden de seguir" t={33} p={p('orden')} />
    </g>
  );
};

const AyudaT: Lamina = ({ p }) => {
  const div = p('prolifera');
  return (
    <g>
      <circle cx={800} cy={490} r={440 * easeOut(clamp(p('centro')))} fill={C.bazo[2]} opacity={0.55} />
      <circle cx={800} cy={490} r={340 * easeOut(clamp(p('centro')))} fill={C.bazo[3]} opacity={0.65} />
      <Rotulo x={800} y={60} txt="Centro germinal" color={C.bazo[0]} p={p('centro')} t={33} />
      <Sale p={p('tfh')} x={590} y={470}><Linfocito tono="tfh" k={1.7} /></Sale>
      <Rotulo x={380} y={290} txt="T folicular cooperadora" color="#0E7490" p={p('tfh')} t={26} />
      <Sale p={p('b')} x={960} y={470}><Linfocito tono="b" k={1.7} /></Sale>
      <Rotulo x={1190} y={290} txt="Célula B" color={C.igg[0]} p={p('b')} t={26} />
      <Sale p={p('c40')} x={775} y={430}>
        <rect x={-38} y={-11} width={76} height={22} rx={11} fill={C.verde[1]} />
        <rect x={-6} y={-16} width={12} height={32} rx={6} fill={C.c1[1]} />
      </Sale>
      <Rotulo x={775} y={345} txt="CD40 y CD154" color={C.verde[0]} p={p('c154')} t={25} />
      <Chorro a={[660, 530]} b={[900, 570]} p={p('il21')} color="#E0339A" n={14} R={8} abanico={70} />
      <Rotulo x={775} y={680} txt="Interleucina 21" color="#DB3A97" p={p('il21')} t={27} />
      {[0, 1, 2].map((i) => { const q = tramo(div, i * 0.2, 0.7 + i * 0.2); return q > 0 ? <En key={i} x={lerp(960, 1190 + (i % 2) * 110, q)} y={lerp(470, 430 + i * 130, q)} k={0.95} o={q}><Linfocito tono="b" /></En> : null; })}
      {Array.from({ length: 13 }, (_, i) => { const q = tramo(p('baf'), i * 0.05, 0.4 + i * 0.05), a = (i / 13) * 6.28; return q > 0 ? <circle key={i} cx={960 + Math.cos(a) * 170} cy={470 + Math.sin(a) * 170} r={9 * q} fill="#2DD4BF" /> : null; })}
      <Rotulo x={960} y={860} txt="BAFF la mantiene viva" color="#0F9D8F" p={p('baf')} t={27} />
      <Sale p={p('centro')} x={420} y={740} k={0.6}><Folicular /></Sale>
    </g>
  );
};

const NaceAc: Lamina = ({ p }) => {
  const m = p('muda');
  const pos = viaje([1100, 290], [1270, 700], m);
  return (
    <g>
      <Sale p={p('nace')} x={380} y={420} k={2}><Plasmatica /></Sale>
      <Rotulo x={380} y={160} txt="Célula plasmática" color="#6B5AA8" p={p('nace')} t={30} />
      {Array.from({ length: 6 }, (_, i) => { const q = tramo(p('igg'), i * 0.11, 0.5 + i * 0.11); return q > 0 ? <IgG key={i} x={lerp(540, 700 + hash(i, 5) * 170, q)} y={lerp(420, 230 + i * 62, q)} r={lerp(0, 40 + i * 61, q)} k={1.25} /> : null; })}
      <Rotulo x={380} y={660} txt="IgG, sobre todo IgG1" color={C.igg[1]} p={p('igg')} t={28} />
      <Txt x={380} y={750} txt="Mutada y de alta afinidad" t={29} p={p('mutada')} />
      <PlaquetaIg x={870} y={760} k={2.5} n={4} p={p('afinado')} o={p('afinado')} />
      <Txt x={870} y={910} txt="Afinado para la plaqueta" t={28} p={p('afinado')} />
      <Sale p={p('mudan')} x={1170} y={240} k={0.48}><Bazo /></Sale>
      <Sale p={p('mudan')} x={1270} y={700} k={0.62}><Medula /></Sale>
      <Flecha a={[1250, 380]} c={[1310, 480]} b={[1280, 590]} p={p('mudan')} color={FLECHA} w={9} />
      {m > 0 && <Plasmatica x={pos.x} y={pos.y} k={0.72} />}
      <Rotulo x={1270} y={860} txt="En la médula, vive mucho tiempo" color="#C93A52" p={m} t={26} />
      <Txt x={1280} y={945} txt="Por eso el tratamiento puede fallar" t={26} p={p('fallar')} fuerte={false} />
    </g>
  );
};

const LosBlancos: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={64} txt="Contra las glicoproteínas de la plaqueta" color={C.plaq[1]} p={p('titulo')} t={32} />
    <Sale p={p('titulo')} x={800} y={500} k={6.2}><Plaqueta /></Sale>
    {([[-58, 'GPIIb/IIIa', 'Receptor de fibrinógeno', 'g1', C.verde, 1270, 240], [-122, 'GPIb/IX', 'Factor de von Willebrand', 'g2', C.c1, 330, 240]] as const).map(([ang, nom, fun, id, tono, xr, yr]) => {
      const b = enBorde(800, 500, 188, ang);
      const q = p(id);
      return (
        <g key={id}>
          <Antigeno x={b.x} y={b.y} r={ang + 90} k={2} o={clamp(q * 1.4)} color={tono} />
          <IgG x={b.x + Math.cos((ang * Math.PI) / 180) * lerp(190, 84, easeOut(q))} y={b.y + Math.sin((ang * Math.PI) / 180) * lerp(190, 84, easeOut(q))} r={ang - 90} k={2} o={clamp(q * 1.4)} />
          <Rotulo x={xr} y={yr} txt={nom} color={tono[1]} p={q} t={33} />
          <Txt x={xr} y={yr + 66} txt={fun} t={27} p={q} />
        </g>
      );
    })}
    <Txt x={800} y={830} txt="Las mismas piezas que usa para trabajar" t={32} p={p('piezas')} />
    <Rotulo x={800} y={915} txt="Ya está marcada. Ahora, veamos cómo muere" color="var(--cit-base)" p={p('marcada')} t={30} />
  </g>
);

const LAMINAS: Lamina[] = [DosProblemas, FrenoRoto, Presenta, AyudaT, NaceAc, LosBlancos];
export default LAMINAS;
