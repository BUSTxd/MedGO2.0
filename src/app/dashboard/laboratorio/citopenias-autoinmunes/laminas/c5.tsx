'use client';
// Capítulo 5 · Cómo se trata la AHAI: lo que sirve en una forma falla en la otra.

import type { Lamina } from '../Lienzo';
import { Bazo, BolsaSangre, C, C1, En, Esfera, Flecha, Frasco, Guantes, Hematie, Higado, IgG, IgM, Jeringa, Linfocito, Mano, Medula, Persona, Plasmatica, Rotulo, Sale, Txt, Virus, clamp, easeOut, lerp, tramo } from '../Piezas';
import { Barra, Cruz, Diez, FLECHA, HematieC3b, Membrana, Visto } from './Comun';

const ParaTodos: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={70} txt="Antes de cualquier fármaco, lo básico" color="var(--cit-base)" p={p('titulo')} t={34} />
    <Sale p={p('folico')} x={240} y={350} k={1.5}><Frasco tono={C.c3b} /></Sale>
    <Rotulo x={240} y={560} txt="Ácido fólico" color={C.c3b[0]} p={p('folico')} t={28} />
    <Txt x={240} y={640} txt="La médula gasta de más" t={25} p={p('gasta')} fuerte={false} />
    <Sale p={p('vacuna')} x={600} y={340} r={35} k={1.15}><Jeringa liquido="#5FD6D3" /></Sale>
    <Sale p={p('vacuna')} x={700} y={240} k={0.7}><Virus /></Sale>
    <Cruz x={700} y={240} k={0.9} p={p('vacuna')} />
    <Rotulo x={620} y={560} txt="Vacunas" color={C.igm[0]} p={p('vacuna')} t={28} />
    <Txt x={640} y={640} txt="Una infección enciende el complemento" t={23} p={p('enciende')} fuerte={false} />
    <Sale p={p('heparina')} x={1020} y={340} r={-30} k={1.15}><Jeringa liquido="#E5324C" /></Sale>
    <Rotulo x={1020} y={560} txt="Heparina" color={C.rojo[1]} p={p('heparina')} t={28} />
    <Txt x={1020} y={640} txt="Si se hospitaliza: coagula" t={25} p={p('coagula')} fuerte={false} />
    <Sale p={p('abrigo')} x={1370} y={340} k={1.5}><Guantes /></Sale>
    <Rotulo x={1370} y={560} txt="Abrigo de verdad" color={C.rojo[1]} p={p('abrigo')} t={26} sobre="En la forma fría" colorSobre="#2F8DE8" />
    <Rotulo x={1090} y={810} txt="Avisar al anestesiólogo antes de operar" color="#2F8DE8" p={p('anest')} t={29} />
  </g>
);

const Transfundir: Lamina = ({ p }) => {
  const f = p('transfunde');
  return (
    <g>
      <Sale p={p('entra')} x={320} y={500} k={0.9}><Persona quien="hombre" palidez={1 - 0.7 * f} /></Sale>
      <Sale p={f} x={700} y={380} k={1.25}><BolsaSangre /></Sale>
      <Flecha a={[640, 610]} c={[540, 690]} b={[480, 610]} p={f} color={C.rojo[1]} w={11} cabeza={false} />
      <Rotulo x={700} y={90} txt="Transfunde. No lo retrases" color={C.rojo[1]} p={p('retrases')} t={32} />
      {[[1080, 260], [1240, 240], [1400, 280]].map(([x, y], i) => (
        <En key={i} x={x} y={y} o={p('compatible')}>
          <Hematie k={1.1} />
          <IgG x={22} y={-48} r={20} k={0.9} />
          <IgG x={-38} y={-30} r={-50} k={0.9} />
        </En>
      ))}
      <Txt x={1240} y={100} txt="Cuesta encontrar sangre compatible" t={27} p={p('compatible')} />
      <Visto x={1040} y={460} p={p('estudio')} k={1.1} />
      <Txt x={1096} y={460} txt="Con un buen estudio, riesgo muy bajo" t={25} p={p('estudio')} ancla="start" />
      <Diez x={1230} y={590} n={7} p={p('dos')} k={0.76} color={C.verde} />
      <Txt x={1230} y={675} txt="Funciona en 2 de cada 3" t={27} p={p('dos')} />
      <Rotulo x={1020} y={810} txt="Hb 8: mayor con comorbilidades" color={C.rojo[1]} p={p('ocho')} t={27} />
      <Rotulo x={1210} y={895} txt="Hb 6: un joven" color={C.rojo[0]} p={p('seis')} t={27} />
    </g>
  );
};

const CalienteTrat: Lamina = ({ p }) => {
  const mata = p('elimina');
  return (
    <g>
      <Rotulo x={410} y={70} txt="Forma caliente" color={C.rojo[1]} p={p('titulo')} t={34} />
      <Sale p={p('cort')} x={190} y={330} k={1.3}><Frasco tono={C.igm} /></Sale>
      <Rotulo x={190} y={510} txt="Corticoides" color={C.igm[0]} p={p('cort')} t={26} />
      <Diez x={510} y={260} n={8} p={p('ocho')} color={C.verde} k={0.82} />
      <Txt x={510} y={360} txt="8 de cada 10 responden" t={27} p={p('ocho')} />
      <Diez x={510} y={530} n={3} p={p('uno')} color={C.c1} k={0.82} />
      <Txt x={510} y={630} txt="Solo 1 de cada 3 se mantiene" t={27} p={p('uno')} />
      <Flecha a={[770, 400]} b={[910, 400]} p={p('sigue')} color={FLECHA} w={10} />
      <Rotulo x={1190} y={120} txt="Rituximab" color={C.igg[1]} p={p('sigue')} t={34} />
      {[[1020, 320], [1190, 280], [1360, 330], [1100, 470], [1280, 480]].map(([x, y], i) => {
        const q = tramo(mata, i * 0.13, 0.5 + i * 0.13);
        return (
          <En key={i} x={x} y={y} o={1 - q * 0.82} k={1 - q * 0.3}>
            <Linfocito tono="b" k={0.95} />
            <IgG x={50} y={-34} r={55} k={0.95} o={p('sigue')} />
          </En>
        );
      })}
      <Txt x={1190} y={610} txt="75 %" t={72} p={p('setenta')} color={C.igg[1]} />
      <Txt x={1190} y={680} txt="responde" t={28} p={p('setenta')} />
      <Rotulo x={1090} y={830} txt="Inicio brutal, Hb bajo 6: se adelanta" color={C.rojo[1]} p={p('adelanta')} t={29} />
    </g>
  );
};

const SiFalla: Lamina = ({ p }) => (
  <g>
    <Sale p={p('bazo')} x={400} y={480} k={1.05}><Bazo /></Sale>
    <Rotulo x={400} y={140} txt="¿Y si rituximab falla?" color="var(--cit-base)" p={p('titulo')} t={32} />
    <Sale p={p('celula')} x={400} y={470} k={1.1}><Plasmatica /></Sale>
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 6.28; return <circle key={i} cx={400 + Math.cos(a) * 130} cy={470 + Math.sin(a) * 98} r={8} fill="#2DD4BF" opacity={p('celula')} />; })}
    <Rotulo x={400} y={785} txt="Célula plasmática de vida larga" color="#6B5AA8" p={p('celula')} t={27} />
    <Txt x={400} y={860} txt="No tiene CD20" t={30} p={p('cd20')} color={C.rojo[1]} />
    {([[1040, 780, 'Inmunosupresor', 'Azatioprina', 'inmuno', C.igm[1]], [1190, 560, 'Esplenectomía', 'En la mitad o algo más', 'bazoEsc', C.bazo[1]], [1340, 340, 'Bortezomib', 'o un ensayo clínico', 'bort', C.mac[1]]] as const).map(([x, y, a, b, nom, col]) => (
      <g key={nom}>
        <rect x={x - 180} y={y + 30} width={360} height={Math.max(0, 900 - y)} rx={6} fill={col} opacity={0.14 * clamp(p(nom))} />
        <Rotulo x={x} y={y - 12} txt={a} color={col} p={p(nom)} t={30} />
        <Txt x={x} y={y + 58} txt={b} t={25} p={p(nom)} />
      </g>
    ))}
  </g>
);

const FriaTrat: Lamina = ({ p }) => (
  <g>
    <Rotulo x={420} y={70} txt="Forma fría: olvida lo anterior" color="#2F8DE8" p={p('titulo')} t={32} />
    <Sale p={p('cort')} x={210} y={290} k={1.1}><Frasco tono={C.igm} /></Sale>
    <Cruz x={210} y={290} p={p('cort')} k={1.2} />
    <Sale p={p('bazo')} x={500} y={290} k={0.5}><Bazo corte={false} /></Sale>
    <Cruz x={500} y={290} p={p('bazo')} k={1.2} />
    <Sale p={p('prevencion')} x={330} y={620} k={1.3}><Guantes /></Sale>
    <Txt x={330} y={760} txt="Hb sobre 10, pocos síntomas" t={27} p={p('prevencion')} />
    <Rotulo x={330} y={840} txt="Solo prevención" color={C.verde[0]} p={p('prevencion')} t={30} />
    <Rotulo x={1090} y={120} txt="Si no: atacas al clon" color={C.igm[0]} p={p('clon')} t={32} />
    <Sale p={p('clon')} x={1090} y={350} k={0.8}><Medula /></Sale>
    {[-130, -45, 45, 130].map((dx, i) => {
      const q = tramo(p('ritu'), i * 0.12, 0.5 + i * 0.12);
      return <Sale key={i} p={p('clon')} x={1090 + dx} y={350 + (i % 2 ? 12 : -12)}><Plasmatica k={0.55} o={1 - q * 0.5} /></Sale>;
    })}
    <Barra x={880} y={620} w={320} val={0.5} color={C.igg[1]} txt="Rituximab" p={p('ritu')} valor="La mitad" />
    <Barra x={880} y={730} w={320} val={0.75} color={C.mac[1]} txt="Con bendamustina" p={p('bend')} valor="3 de cada 4" />
    <Sale p={p('inf')} x={1000} y={855} k={0.55}><Virus /></Sale>
    <Txt x={1090} y={855} txt="Más infecciones" t={28} p={p('inf')} ancla="start" color={C.bazo[1]} />
  </g>
);

const Cadena: Lamina = ({ p }) => {
  const bl = p('bloquea'), v = p('vuelve');
  const fuerza = clamp(1 - bl + v);
  return (
    <g>
      <Rotulo x={800} y={64} txt="Cortar la cadena arriba" color="var(--cit-base)" p={p('titulo')} t={34} />
      <En y={-210}>
        <Membrana x={800} y={520} w={1500} h={70} />
        <C1 x={260} y={500} k={1.75} />
        <Rotulo x={260} y={320} txt="C1s" color={C.c1[1]} p={p('titulo')} t={27} />
        {[[520, 'C4', C.verde], [720, 'C2', C.igm], [920, 'C3', C.c3b]].map(([x, t, tono], i) => (
          <En key={i} o={fuerza * 0.8 + 0.2}>
            <Esfera x={x as number} y={460} R={40} tono={tono as string[]} />
            <Txt x={x as number} y={460} txt={t as string} t={27} color="#FFF" />
            <Flecha a={[(x as number) - 130, 460]} b={[(x as number) - 58, 460]} color={FLECHA} w={7} />
          </En>
        ))}
        <HematieC3b x={1240} y={420} k={1.5} c={fuerza} />
      </En>
      <En x={lerp(360, 340, bl)} y={lerp(120, 240, easeOut(bl))} o={clamp(bl * 2)}>
        <IgG k={1.8} r={180} tono={C.plaq} />
      </En>
      <Rotulo x={590} y={150} txt="Sutimlimab" color={C.plaq[1]} p={bl} t={30} />
      <Txt x={1240} y={120} txt="Frena la hemólisis en más de la mitad" t={25} p={p('frena')} />
      <Rotulo x={1240} y={530} txt="Se suspende, y vuelve" color={C.rojo[1]} p={v} t={27} />
      <Sale p={p('dedos')} x={300} y={760} k={0.58}><Mano azul={1} /></Sale>
      <IgM x={470} y={610} k={1} o={p('dedos')} />
      <Txt x={560} y={690} txt="No mejora los dedos:" t={28} p={p('dedos')} ancla="start" />
      <Txt x={560} y={740} txt="eso lo hace la IgM" t={28} p={p('dedos')} ancla="start" />
      <Sale p={p('pregunta')} x={1140} y={720} k={0.34}><Bazo corte={false} /></Sale>
      <Sale p={p('pregunta')} x={1370} y={720} k={0.3}><Higado corte={false} /></Sale>
      <Rotulo x={1230} y={870} txt="¿Dónde muere? Ahí está tu tratamiento" color="var(--cit-base)" p={p('alli')} t={29} />
    </g>
  );
};

const LAMINAS: Lamina[] = [ParaTodos, Transfundir, CalienteTrat, SiFalla, FriaTrat, Cadena];
export default LAMINAS;
