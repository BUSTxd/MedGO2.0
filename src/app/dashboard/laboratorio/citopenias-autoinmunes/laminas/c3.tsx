'use client';
// Capítulo 3 · Aglutininas frías: un clon, el frío, el complemento y el hígado.

import type { Lamina } from '../Lienzo';
import { Bazo, C, C1, En, Esfera, Flecha, Hematie, HematieRoto, Higado, IgM, Jeringa, MAC, Macrofago, Mano, Medula, Plasmatica, Rotulo, Sale, TarjetaGel, Termometro, Txt, Vaso, Virus, clamp, easeOut, enBorde, hash, lerp, tramo } from '../Piezas';
import { Antigeno, Copo, Cruz, FLECHA, HematieC3b, Lente, Membrana, viaje } from './Comun';

function HematieM({ x, y, k = 1, p = 1, igm = 3 }: { x: number; y: number; k?: number; p?: number; igm?: number }) {
  return (
    <En x={x} y={y} k={k}>
      {[-50, 70, 190].slice(0, igm).map((a, i) => {
        const q = tramo(p, i * 0.2, 0.5 + i * 0.2), b = enBorde(0, 0, 66 + 40 * (1 - q), a);
        return q > 0 ? <IgM key={a} x={b.x} y={b.y} r={a + 90} k={0.6} o={q} /> : null;
      })}
      <Hematie />
    </En>
  );
}

const UnSoloClon: Lamina = ({ p }) => (
  <g>
    <Sale p={p('medula')} x={700} y={400} k={1.25}><Medula w={1040} h={460} /></Sale>
    <Rotulo x={700} y={80} txt="Un solo clon" color={C.igm[0]} p={p('clon')} t={38} />
    {[[-250, -40], [-110, 40], [30, -46], [170, 34], [-20, 90]].map(([dx, dy], i) => <Sale key={i} p={tramo(p('celulas'), i * 0.14, 0.5 + i * 0.14)} x={640 + dx} y={400 + dy}><Plasmatica k={0.92} /></Sale>)}
    {Array.from({ length: 6 }, (_, i) => { const q = tramo(p('igm'), i * 0.1, 0.55 + i * 0.1); return q > 0 ? <IgM key={i} x={lerp(860, 1210 + (i % 2) * 110, q)} y={lerp(400, 190 + i * 66, q)} r={i * 50} k={1.05} o={q} /> : null; })}
    <Rotulo x={1320} y={100} txt="IgM kappa, siempre la misma" color={C.igm[1]} p={p('igm')} t={27} />
    <Sale p={p('blanco')} x={700} y={800} k={1.9}><Hematie /></Sale>
    {[-75, -20, 40, 100].map((a, i) => { const b = enBorde(700, 800, 82, a - 90 + 90); return <Antigeno key={i} x={b.x} y={b.y} r={a + 90} k={0.9} o={p('blanco')} />; })}
    <Rotulo x={950} y={800} txt="Antígeno I" color={C.verde[1]} p={p('blanco')} t={32} />
    <Txt x={1300} y={720} txt="Casi un tumor pequeño," t={30} p={p('tumor')} />
    <Txt x={1300} y={770} txt="con un anticuerpo equivocado" t={30} p={p('tumor')} />
  </g>
);

const ElGen: Lamina = ({ p }) => {
  const une = p('une');
  return (
    <g>
      {/* gen: una hebra de ADN plana */}
      <Sale p={p('gen')} x={320} y={310}>
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`translate(${(i - 5.5) * 44},0)`}>
            <rect x={-20} y={-30} width={40} height={60} fill={i >= 4 && i <= 7 ? C.c3b[1] : i % 2 ? C.igm[1] : C.igg[1]} />
            <rect x={-20} y={-30} width={40} height={14} fill="#FFF" opacity={0.35} />
          </g>
        ))}
      </Sale>
      <Rotulo x={320} y={180} txt="Gen IGHV4-34" color={C.c1[0]} p={p('gen')} t={34} />
      <Txt x={320} y={440} txt="85 %" t={84} color={C.igm[1]} p={p('ochenta')} />
      <Txt x={320} y={520} txt="de estos clones" t={31} p={p('ochenta')} />
      <Txt x={320} y={720} txt="El error ya viene" t={35} p={p('error')} />
      <Txt x={320} y={770} txt="escrito en el gen" t={35} p={p('error')} />
      <Lente x={1050} y={500} R={390} id="c3g" o={p('lente')}>
        <En y={230}>
          <rect x={-420} y={50} width={840} height={320} fill={C.rojo[1]} />
          <rect x={-420} y={50} width={840} height={22} fill={C.rojo[0]} />
          <Antigeno x={0} y={lerp(55, 55, une)} k={3.4} color={C.verde} />
        </En>
        {/* Un brazo de la IgM, ampliado: baja hasta encajar el parche en el antígeno. */}
        <En x={0} y={lerp(-135, 78, une)}>
          <rect x={-58} y={-560} width={116} height={590} rx={58} fill={C.igm[0]} />
          <rect x={-46} y={-560} width={92} height={578} rx={46} fill={C.igm[1]} />
          <rect x={-28} y={-540} width={18} height={480} rx={9} fill={C.igm[2]} opacity={0.8} />
          <ellipse cy={20} rx={44} ry={15} fill={C.c3b[1]} opacity={clamp(p('parche') * 1.4)} />
        </En>
      </Lente>
      <Rotulo x={1050} y={82} txt="Parche hidrofóbico" color={C.c3b[0]} p={p('parche')} t={30} />
      <Rotulo x={1050} y={920} txt="Reconoce el antígeno I por sí solo" color={C.verde[0]} p={une} t={29} />
    </g>
  );
};

const FrioOrden: Lamina = ({ p, reloj }) => {
  const az = p('enfria');
  return (
    <g>
      <Vaso x={320} y={230} w={640} h={170} flujo={3} reloj={reloj} o={p('circula')}>
        <IgM x={-140} y={0} k={0.85} /><IgM x={120} y={22} k={0.75} />
      </Vaso>
      <Rotulo x={320} y={70} txt="Sangre caliente: no hace nada" color={C.rojo[1]} p={p('circula')} t={25} />
      <Flecha a={[640, 280]} c={[700, 380]} b={[780, 410]} p={p('llega')} color={FLECHA} w={10} />
      <Sale p={p('llega')} x={950} y={620} k={1.05}><Mano azul={az} /></Sale>
      <Sale p={az} x={1140} y={190} k={1.1}><Copo /></Sale>
      <Rotulo x={420} y={425} txt="Se enfría: se pega" color="#2F8DE8" p={p('pega')} t={28} />
      <Lente x={420} y={660} R={190} id="c3f" o={p('pega')}>
        <HematieM x={0} y={0} k={1.5} p={p('pega')} />
      </Lente>
      <Sale p={p('temp')} x={1380} y={660} k={0.98}><Termometro val={0.74 * clamp(p('temp')) + 0.03} /></Sale>
      <Rotulo x={1260} y={60} txt="No cuánto: hasta qué temperatura" color={C.igm[0]} p={p('temp')} t={26} />
      <Txt x={1210} y={300} txt="28 °C" t={60} color={C.rojo[1]} p={p('veintiocho')} />
      <Txt x={1190} y={365} txt="un día templado basta" t={27} p={p('templado')} />
    </g>
  );
};

const DedosAzules: Lamina = ({ p }) => {
  const am = p('amontona'), tapa = p('tapa');
  return (
    <g>
      <Vaso x={800} y={260} w={1720} h={250}>
        {Array.from({ length: 11 }, (_, i) => {
          const off = 120 + i * 90;
          const X = lerp(-740 + off * 1.1, -150 + (hash(i, 8) - 0.5) * 240, easeOut(am));
          const Y = lerp((hash(i, 9) - 0.5) * 130, (hash(i, 10) - 0.5) * 170, am);
          return <Hematie key={i} x={X} y={Y} k={0.82} r={i * 33} />;
        })}
        {[[-210, -30], [-90, 50], [-40, -60], [-170, 56], [30, 10]].map(([x, y], i) => <IgM key={i} x={x} y={y} k={0.9} o={clamp(p('igm'))} />)}
        <En x={600} o={tapa}><Txt x={0} y={0} txt="Sin flujo" t={34} color="#FFF" /></En>
      </Vaso>
      <Rotulo x={250} y={60} txt="Cinco brazos" color={C.igm[0]} p={p('igm')} t={30} />
      <Rotulo x={800} y={60} txt="El capilar se tapa" color={C.rojo[0]} p={tapa} t={30} />
      <Sale p={p('dedos')} x={300} y={760} k={0.72}><Mano azul={1} /></Sale>
      <Txt x={560} y={590} txt="Dedos azules cada invierno" t={32} p={p('dedos')} ancla="start" />
      <Rotulo x={700} y={690} txt="Acrocianosis" color="#2F4FB0" p={p('acro')} t={29} />
      <Rotulo x={1020} y={690} txt="Raynaud" color="#3E6FC9" p={p('raynaud')} t={29} />
      <Rotulo x={1280} y={690} txt="Úlceras" color={C.bazo[0]} p={p('ulcera')} t={29} />
      <Rotulo x={700} y={790} txt="Gangrena (excepcional)" color="#3B3B46" p={p('gangrena')} t={29} />
      <Txt x={1110} y={880} txt="No es hemólisis todavía: es sangre que no pasa" t={30} p={p('nopasa')} />
    </g>
  );
};

const SeVa: Lamina = ({ p }) => {
  const via = p('viaja'), suelta = p('suelta');
  const pos = viaje([410, 480], [1160, 480], via);
  const igmX = lerp(pos.x + 120, 1460, easeOut(suelta)), igmY = lerp(pos.y - 170, 400, easeOut(suelta));
  return (
    <g>
      <rect x={-400} y={120} width={1200} height={760} fill="#3F9BE8" opacity={0.16 * p('zonas')} />
      <rect x={800} y={120} width={1200} height={760} fill="#EE5A5A" opacity={0.16 * p('zonas')} />
      <Sale p={p('zonas')} x={160} y={220}><Copo /></Sale>
      <Rotulo x={400} y={180} txt="Zona fría" color="#2F8DE8" p={p('zonas')} t={30} />
      <Rotulo x={1200} y={180} txt="Zona cálida" color={C.rojo[1]} p={p('zonas')} t={30} />
      <Rotulo x={800} y={72} txt="La clave" color="var(--cit-base)" p={p('clave')} t={36} />
      <Flecha a={[640, 730]} b={[960, 730]} p={via} color={FLECHA} w={10} />
      <En x={pos.x} y={pos.y} k={2.7}><Hematie /></En>
      <IgM x={igmX} y={igmY} k={1.75} r={suelta * 70} />
      <C1 x={pos.x - 54} y={pos.y - 122} k={1.75 * clamp(p('c1') * 1.3)} r={-24} />
      <Rotulo x={pos.x - 150} y={pos.y - 200} txt="C1" color={C.c1[1]} p={p('c1')} t={32} />
      <Txt x={1460} y={520} txt="Se suelta y se va" t={27} p={suelta} />
      <Rotulo x={1160} y={720} txt="C1 se queda" color={C.c1[0]} p={p('queda')} t={32} />
      <Txt x={800} y={930} txt="El anticuerpo escapa… la marca permanece" t={34} p={p('escapa')} />
    </g>
  );
};

const NaceC3b: Lamina = ({ p }) => {
  const parte = p('parte');
  const C3a = viaje([820, 470], [1030, 150], p('c3a'));
  const C3b = viaje([820, 470], [940, 618], p('c3b'));
  return (
    <g>
      <Membrana x={800} y={640} w={1560} />
      <C1 x={180} y={620} k={2 * clamp(p('entra') * 1.3)} />
      <Rotulo x={180} y={420} txt="C1" color={C.c1[1]} p={p('entra')} t={30} />
      <Flecha a={[260, 540]} b={[380, 540]} p={p('c4')} color={FLECHA} w={8} />
      <Sale p={p('c4')} x={440} y={560}><Esfera R={44} tono={C.verde} /></Sale>
      <Txt x={440} y={560} txt="C4" t={30} color="#FFF" p={p('c4')} />
      <Sale p={p('c2')} x={570} y={560}><Esfera R={38} tono={C.igm} /></Sale>
      <Txt x={570} y={560} txt="C2" t={28} color="#FFF" p={p('c2')} />
      <Flecha a={[630, 530]} b={[730, 510]} p={parte} color={FLECHA} w={8} />
      {parte < 0.98 && <En x={820} y={470} k={1 - 0.2 * parte}><Esfera R={56} tono={C.c3b} /></En>}
      {parte < 0.98 && <Txt x={820} y={470} txt="C3" t={32} color="#7A4A00" />}
      {parte > 0.4 && (
        <>
          <En x={C3a.x} y={C3a.y} o={tramo(parte, 0.4, 0.8)}><Esfera R={32} tono={C.igm} /></En>
          <En x={C3b.x} y={C3b.y} o={tramo(parte, 0.4, 0.8)}><Esfera R={46} tono={C.c3b} /></En>
          <Txt x={C3a.x} y={C3a.y - 54} txt="C3a" t={29} p={p('c3a')} />
        </>
      )}
      <Rotulo x={1160} y={560} txt="C3b, clavado en la membrana" color={C.c3b[0]} p={p('c3b')} t={28} />
      <Txt x={560} y={200} txt="La nueva señal de muerte" t={36} p={p('senal')} />
      <Sale p={p('coombs')} x={1320} y={280} k={0.52}><TarjetaGel pos={[0, 0, 0, 0, clamp(p('positivo')), 0]} /></Sale>
    </g>
  );
};

const EnElHigado: Lamina = ({ p }) => {
  const entra = p('entra'), come = p('devora');
  return (
    <g>
      <Sale p={p('higado')} x={720} y={500} k={1.7}><Higado /></Sale>
      <Sale p={p('higado')} x={500} y={470} k={0.68}><Macrofago /></Sale>
      <Sale p={p('higado')} x={860} y={440} k={0.56}><Macrofago /></Sale>
      {[0, 1, 2, 3].map((i) => {
        const dest: [number, number] = i % 2 ? [860, 440] : [510, 470];
        const q = tramo(entra, i * 0.16, 0.56 + i * 0.16);
        const a = viaje([1540, 240 + i * 120], [dest[0] + 170 + i * 60, dest[1] + 60 - i * 30], q);
        const b = viaje([a.x, a.y], dest, tramo(come, i * 0.14, 0.5 + i * 0.14));
        return q > 0 ? <HematieC3b key={i} x={b.x} y={b.y} k={lerp(1, 0.55, come)} o={1 - tramo(come, 0.7 + i * 0.05, 1)} r={i * 40} /> : null;
      })}
      <Rotulo x={1280} y={120} txt="Marcados con C3b" color={C.c3b[0]} p={entra} t={29} />
      <Rotulo x={700} y={80} txt="Hemólisis extravascular, en otro órgano" color={C.higado[1]} p={p('nombre')} t={31} />
      <Sale p={p('bazo')} x={1320} y={740} k={0.56}><Bazo corte={false} /></Sale>
      <Cruz x={1320} y={740} k={1.7} p={p('bazo')} />
      <Txt x={760} y={900} txt="Sacar el bazo no sirve: el bazo no es el problema" t={32} p={p('problema')} />
    </g>
  );
};

const LaCrisis: Lamina = ({ p, reloj }) => {
  const roto = p('estalla');
  return (
    <g>
      <Vaso x={800} y={350} w={1720} h={380} flujo={6} reloj={reloj} o={p('vaso')}>
        <En x={0} y={0}>
          {roto <= 0 ? <HematieC3b k={2.3} /> : <HematieRoto k={2.3} p={roto} />}
          {roto <= 0 && [[-82, 28, 95], [70, 70, 40], [46, -86, -30]].map(([x, y, r], i) => { const q = tramo(p('mac'), i * 0.28, 0.72 + i * 0.28); return q > 0 ? <MAC key={i} x={x} y={y} r={r} k={1.5 * easeOut(q)} /> : null; })}
        </En>
      </Vaso>
      <Txt x={380} y={90} txt="Las proteínas reguladoras frenan aquí…" t={29} p={p('frena')} />
      <Sale p={p('frio')} x={250} y={350} k={1.2}><Copo /></Sale>
      <Sale p={p('infeccion')} x={470} y={320} k={1}><Virus /></Sale>
      <Sale p={p('cirugia')} x={1240} y={340} r={35} k={0.9}><Jeringa /></Sale>
      <Rotulo x={1160} y={90} txt="Complejo de ataque a la membrana" color={C.mac[1]} p={p('mac')} t={27} />
      {([[300, 'El frío da la orden', '#2F8DE8', 'orden', <Copo key="a" k={0.85} />], [800, 'El complemento la firma', C.c3b[0], 'firma', <Esfera key="b" R={40} />], [1300, 'El hígado la ejecuta', C.higado[1], 'ejecuta', <Higado key="c" k={0.28} corte={false} />]] as const).map(([x, txt, col, nom, ic]) => (
        <g key={nom}>
          <Sale p={p(nom)} x={x} y={710}>{ic}</Sale>
          <Rotulo x={x} y={850} txt={txt} color={col} p={p(nom)} t={30} />
        </g>
      ))}
    </g>
  );
};

const LAMINAS: Lamina[] = [UnSoloClon, ElGen, FrioOrden, DedosAzules, SeVa, NaceC3b, EnElHigado, LaCrisis];
export default LAMINAS;
