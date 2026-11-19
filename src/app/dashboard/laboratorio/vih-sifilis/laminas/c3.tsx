'use client';
// Capítulo 3 · Genes y proteínas

import type { Lamina } from '../Lienzo';
import { Arn, Bandera, Canal, Cerrojo, Cruz, En, Enzima, Flecha, Guardia, Helice, Hla, Letra, Linfocito, Llave, Lomas, Medallon, Nube, P, Reloj, Sale, Tijeras, Trazo, Txt, TXV, Vagon, Virion, Visto, clamp, easeOut, lerp, tramo } from '../Piezas';

const Guia = ({ a, b, p, color = 'var(--cit-flecha)' }: { a: [number, number]; b: [number, number]; p: number; color?: string }) => (
  <Flecha a={a} b={b} p={p} color={color} w={4} cabeza={false} />
);

// ─── 0 · Nueve genes, quince proteínas ───────────────────────────────────────
const X0 = 160, W = 1280, KB = 9719;
const gx = (b: number) => X0 + (b / KB) * W;
type Gen = { n: string; a: number; b: number; f: 0 | 1 | 2; t: 'est' | 'reg' | 'acc' };
const GENES: Gen[] = [
  { n: 'gag', a: 790, b: 2292, f: 0, t: 'est' }, { n: 'pol', a: 2085, b: 5096, f: 1, t: 'est' }, { n: 'vif', a: 5041, b: 5619, f: 2, t: 'acc' },
  { n: 'vpr', a: 5559, b: 5850, f: 0, t: 'acc' }, { n: 'tat', a: 5831, b: 6045, f: 1, t: 'reg' }, { n: 'rev', a: 5970, b: 6045, f: 2, t: 'reg' },
  { n: 'vpu', a: 6062, b: 6310, f: 0, t: 'acc' }, { n: 'env', a: 6225, b: 8795, f: 1, t: 'est' }, { n: 'nef', a: 8797, b: 9417, f: 2, t: 'acc' },
];
const TIPO = { est: P.cap, reg: P.rt, acc: P.hla } as const;

const GenesYProteinas: Lamina = ({ p, reloj }) => {
  const sp = 1 - easeOut(p('ltr'));
  const on = easeOut(p('enciende'));
  return (
    <g>
      <Txt x={330} y={130} txt="9 genes" t={84} p={p('nueve')} color={TXV.violeta} />
      <Flecha a={[560, 130]} b={[760, 130]} p={p('genes')} color="var(--cit-flecha)" w={12} />
      <Txt x={1100} y={130} txt="15 proteínas" t={84} p={p('quince')} color={TXV.ambar} />
      {/* el genoma: una cinta con los genes encima, en tres filas */}
      <g opacity={tramo(p('genoma'), 0, 0.5)}>
        <rect x={X0} y={623} width={W} height={36} rx={18} fill="#8E8AB8" />
        <rect x={X0} y={623} width={W} height={36} rx={18} fill={P.espiga[1]} opacity={0.9 * on} />
        <rect x={X0} y={623} width={gx(634) - X0} height={36} rx={18} fill={P.espiga[0]} />
        <rect x={gx(9086)} y={623} width={X0 + W - gx(9086)} height={36} rx={18} fill={P.espiga[0]} />
      </g>
      <path d={`M${X0},680 L${X0},696 L${X0 + W},696 L${X0 + W},680`} fill="none" stroke="var(--cit-texto)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('bases'), 0, 0.6)} />
      <Txt x={800} y={738} txt="unas 9 200 bases" t={34} p={p('bases')} />
      {GENES.map((g, i) => {
        const c = (gx(g.a) + gx(g.b)) / 2, w = Math.max(58, gx(g.b) - gx(g.a)), y = 350 + g.f * 84, tono = TIPO[g.t];
        const q = easeOut(tramo(p('genes'), (i / 9) * 0.7, (i / 9) * 0.7 + 0.35));
        return (
          <En key={g.n} x={c} y={y} k={q} o={tramo(q, 0, 0.5)}>
            <rect x={-w / 2} y={-30} width={w} height={60} rx={30} fill={tono[0]} />
            <rect x={-w / 2 + 4} y={-27} width={w - 8} height={50} rx={26} fill={tono[1]} />
            <rect x={-w / 2 + 18} y={-20} width={Math.max(10, w - 48)} height={9} rx={4.5} fill="#FFF" opacity={0.55} />
            <Letra y={3} txt={g.n} t={28} />
          </En>
        );
      })}
      {[['estructura', P.cap], ['reguladores', P.rt], ['accesorios', P.hla]].map(([n, tono], i) => (
        <g key={n as string}>
          <Sale p={p('genes')} x={420 + i * 280} y={240}><circle r={14} fill={(tono as readonly string[])[1]} /></Sale>
          <Txt x={444 + i * 280} y={242} txt={n as string} t={28} ancla="start" p={p('genes')} />
        </g>
      ))}
      {/* lecturas superpuestas */}
      {[[gx(2188), 392], [gx(5590), 476], [gx(6140), 392]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={36 * easeOut(p('lecturas'))} fill="none" stroke={P.espiga[1]} strokeWidth={7} />)}
      <Txt x={800} y={290} txt="lecturas superpuestas" t={30} p={p('lecturas')} color={TXV.ambar} />
      {/* un ARN que se corta y se empalma de varias maneras */}
      <g opacity={sp}>
        <Arn x={300} y={800} w={1000} p={p('arn')} fase={reloj / 600} grosor={9} />
        <Sale p={p('corta')} x={520} y={800}><Tijeras k={0.8} abre={0.5 + 0.5 * Math.sin(reloj / 200)} r={0} /></Sale>
        <Sale p={p('corta')} x={900} y={800}><Tijeras k={0.8} abre={0.5 + 0.5 * Math.sin(reloj / 200 + 2)} r={0} /></Sale>
        {[[870, P.cap, P.cap, 360, 260], [915, P.rt, P.hla, 300, 330], [960, P.hla, P.hla, 280, 340]].map(([y, a, b, w1, w2], i) => (
          <g key={i}>
            <Arn x={300 + i * 40} y={y as number} w={w1 as number} p={p('empalma')} tono={a as readonly string[]} grosor={9} fase={i} />
            <Arn x={300 + i * 40 + (w1 as number) + 20} y={y as number} w={w2 as number} p={p('empalma')} tono={b as readonly string[]} grosor={9} fase={i + 1} />
          </g>
        ))}
      </g>
      {/* los extremos: LTR, con su interruptor de NF-κB */}
      <Bandera x={200} y={715} txt="LTR" color={P.espiga[0]} p={p('ltr')} t={30} punta="no" />
      <Bandera x={1400} y={715} txt="LTR" color={P.espiga[0]} p={p('ltr')} t={30} punta="no" />
      <Guia a={[260, 780]} b={[215, 740]} p={p('interruptor')} />
      <Sale p={p('interruptor')} x={260} y={840}>
        <rect x={-62} y={-32} width={124} height={64} rx={32} fill="#8C86B0" />
        <rect x={-62} y={-32} width={124} height={64} rx={32} fill="#23C46A" opacity={on} />
        <circle cx={lerp(-30, 30, on)} cy={0} r={25} fill="#FFF" /><circle cx={lerp(-30, 30, on) - 7} cy={-7} r={7} fill="#E8ECF8" />
      </Sale>
      <Bandera x={520} y={840} txt="NF-κB" color={P.cd4[0]} p={p('nfkb')} t={34} punta="no" />
      <Sale p={p('linfo')} x={900} y={850}>
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-4} y={-118} width={8} height={26} rx={4} fill={P.espiga[1]} opacity={easeOut(p('activa'))} transform={`rotate(${i * 36})`} />)}
        <Linfocito k={1.2} />
      </Sale>
      <Txt x={900} y={965} txt="linfocito activado" t={30} p={p('activa')} />
      <Sale p={p('enciende')} x={1300} y={850}><Virion k={0.5} reloj={reloj} /></Sale>
    </g>
  );
};

// ─── 1 · Estructura: Gag, Pol y Env ──────────────────────────────────────────
const Pieza = ({ x, y, w, tono, l, nombre, q }: { x: number; y: number; w: number; tono: readonly string[]; l: string; nombre?: string; q: number }) => (
  <Sale p={q} x={x + w / 2} y={y}>
    <rect x={-w / 2} y={-42} width={w} height={84} rx={22} fill={tono[0]} />
    <rect x={-w / 2 + 4} y={-39} width={w - 8} height={72} rx={19} fill={tono[1]} />
    <rect x={-w / 2 + 16} y={-30} width={Math.max(10, w - 44)} height={9} rx={4.5} fill="#FFF" opacity={0.55} />
    <Letra y={2} txt={l} t={30} />
    {nombre && <Txt x={0} y={72} txt={nombre} t={24} />}
  </Sale>
);

const GagPolEnv: Lamina = ({ p }) => {
  const corte = easeOut(p('cortan'));
  const gap = 4 + 40 * corte;
  const f = (ws: number[]) => ws.map((w, i) => 420 + ws.slice(0, i).reduce((a, b) => a + b + gap, 0));
  const gx0 = f([150, 230, 110, 90]), px0 = f([140, 320, 210]), ex0 = f([380, 210]);
  return (
    <g>
      <Bandera x={200} y={250} txt="Gag" color={P.cap[0]} p={p('gag')} t={40} punta="der" />
      <Pieza x={gx0[0]} y={250} w={150} tono={P.esp} l="p17" nombre="matriz" q={p('matriz')} />
      <Pieza x={gx0[1]} y={250} w={230} tono={P.cap} l="p24" nombre="cápside" q={p('capside')} />
      <Pieza x={gx0[2]} y={250} w={110} tono={P.arn} l="p7" nombre="nucleocápside" q={p('nucleo')} />
      <Pieza x={gx0[3]} y={250} w={90} tono={P.hla} l="p6" q={p('nucleo')} />
      <Bandera x={200} y={520} txt="Pol" color={P.rt[0]} p={p('pol')} t={40} punta="der" />
      <Pieza x={px0[0]} y={520} w={140} tono={P.prot} l="PR" nombre="proteasa" q={p('proteasa')} />
      <Pieza x={px0[1]} y={520} w={320} tono={P.rt} l="transcriptasa" nombre="transcriptasa inversa" q={p('rt')} />
      <Pieza x={px0[2]} y={520} w={210} tono={P.inte} l="integrasa" q={p('integrasa')} />
      <Txt x={1190} y={520} txt="3 enzimas" t={38} ancla="start" p={p('enzimas3')} color={TXV.violeta} />
      <Bandera x={200} y={790} txt="Env" color={P.espiga[0]} p={p('env')} t={40} punta="der" />
      <g opacity={1 - easeOut(p('gp120'))}><Pieza x={420} y={790} w={590} tono={P.espiga} l="gp160" q={p('gp160')} /></g>
      <Sale p={p('furina')} x={1130} y={790}><Tijeras k={0.7} abre={0.8} r={90} /></Sale>
      <Txt x={1130} y={880} txt="furina (enzima de la célula)" t={26} p={p('furina')} />
      <Pieza x={ex0[0]} y={790} w={380} tono={P.espiga} l="gp120" q={p('gp120')} />
      <Pieza x={ex0[1]} y={790} w={210} tono={P.hla} l="gp41" q={p('gp41')} />
      {[250, 520, 790].map((y, i) => (
        <path key={y} d={`M420,${y - 62} Q${i === 0 ? 700 : i === 1 ? 740 : 715},${y - 100} ${i === 0 ? 1030 : i === 1 ? 1070 : 1010},${y - 62}`} fill="none" stroke={P.hla[1]} strokeWidth={6} strokeLinecap="round" opacity={p('poli') * (1 - corte)} />
      ))}
      <Txt x={800} y={110} txt="poliproteínas: primero largas, luego cortadas" t={36} p={p('poli')} color={TXV.violeta} />
    </g>
  );
};

// ─── 2 · Tat: el acelerador ──────────────────────────────────────────────────
const TatAcelerador: Lamina = ({ p, reloj }) => {
  const mov = 250 * easeOut(p('copiar')) + 480 * easeOut(p('seguir'));
  const px = 330 + mov;
  const tat = easeOut(p('tat'));
  const ptef = easeOut(p('recluta'));
  return (
    <g>
      <Helice x={800} y={650} w={1100} amp={28} vueltas={5} p={p('poli')} fase={reloj / 1500} />
      <Txt x={300} y={745} txt="provirus: el ADN del virus" t={28} ancla="start" p={p('provirus')} color={TXV.adn} />
      <Arn x={330} y={520} w={Math.max(4, px - 330)} p={p('copiar')} grosor={11} fase={reloj / 500} />
      <Sale p={p('poli')} x={px} y={575}><Enzima k={2.4} tono={[...P.rt]} abre={0.5 + 0.4 * Math.sin(reloj / 250)} r={-10} /></Sale>
      <Txt x={px} y={690 + 70} txt="ARN polimerasa" t={26} p={p('poli')} />
      <g opacity={p('detiene') * (1 - easeOut(p('seguir')))}>
        <polygon points="-28,-68 28,-68 68,-28 68,28 28,68 -28,68 -68,28 -68,-28" transform={`translate(${px + 20},420) scale(0.62)`} fill="#E5324C" />
        <rect x={px + 20 - 22} y={414} width={44} height={11} rx={5} fill="#FFF" />
      </g>
      <Txt x={440} y={430} txt="ARN corto" t={34} p={p('cortos')} color={TXV.sangre} />
      {/* la horquilla TAR, Tat y la maquinaria de la célula */}
      <path d={`M${px - 6},520 C${px - 40},430 ${px + 30},430 ${px + 6},520`} fill="none" stroke={P.arn[1]} strokeWidth={10} strokeLinecap="round" opacity={p('horquilla')} />
      <Txt x={px - 170} y={440} txt="horquilla del ARN" t={26} p={p('horquilla')} />
      <En x={lerp(1320, px + 70, tat)} y={lerp(240, 385, tat)} o={tramo(p('tat'), 0, 0.3)}>
        <circle r={38} fill={P.espiga[0]} /><circle cx={-2} cy={-2} r={33} fill={P.espiga[1]} />
        <path d="M6,-26 L-14,4 L-1,4 L-8,26 L14,-6 L1,-6 Z" fill="#FFF" />
      </En>
      <Bandera x={1180} y={170} txt="Tat: el acelerador" color={P.espiga[0]} p={p('tat')} t={34} punta="no" />
      <En x={lerp(1050, px + 90, ptef)} y={lerp(300, 440, ptef)} o={tramo(p('recluta'), 0, 0.3)}>
        <circle r={30} fill={P.inte[0]} /><circle cx={-2} cy={-2} r={26} fill={P.inte[1]} /><circle cx={-10} cy={-10} r={7} fill="#FFF" opacity={0.7} />
      </En>
      <Txt x={px + 150} y={420} txt="maquinaria de la célula" t={26} ancla="start" p={p('recluta')} />
      <Txt x={900} y={380} txt="sigue copiando" t={36} p={p('seguir')} color={TXV.verde} />
      <Nube x={400} y={250} w={480} h={100} n={9} k={0.22} reloj={reloj} o={tramo(p('multiplica'), 0, 0.5)} sem={9} />
      <Txt x={400} y={160} txt="el virus se multiplica" t={32} p={p('multiplica')} color={TXV.virus} />
    </g>
  );
};

// ─── 3 · Rev: el transportista ───────────────────────────────────────────────
const RevTransportista: Lamina = ({ p, reloj }) => {
  const esc = easeOut(p('escolta'));
  const sal = easeOut(p('salen'));
  const x = lerp(lerp(330, 700, esc), 1080, sal);
  return (
    <g>
      <Sale p={p('saca')} x={480} y={520}>
        <circle r={340} fill={P.inte[0]} opacity={0.35} /><circle cx={-6} cy={-6} r={326} fill={P.inte[1]} opacity={0.35} />
        <circle cx={-6} cy={-6} r={326} fill="none" stroke={P.inte[2]} strokeWidth={8} opacity={0.7} />
      </Sale>
      <Txt x={300} y={225} txt="núcleo" t={34} p={p('saca')} color={TXV.violeta} />
      <g opacity={tramo(p('puerta'), 0, 0.4) * 0.9 + tramo(p('saca'), 0, 0.4) * 0.1}>
        <rect x={800} y={330} width={44} height={140} rx={20} fill="#8A86C8" /><rect x={800} y={570} width={44} height={140} rx={20} fill="#8A86C8" />
        <rect x={806} y={336} width={16} height={120} rx={8} fill="#C9C6F0" /><rect x={806} y={576} width={16} height={120} rx={8} fill="#C9C6F0" />
      </g>
      {p('puerta') > 0.05 && <circle cx={822} cy={520} r={64 + 8 * Math.sin(reloj / 250)} fill="none" stroke={P.espiga[1]} strokeWidth={7} opacity={0.8 * p('puerta')} />}
      {/* los ARN cortados salen solos */}
      {[0, 1, 2].map((i) => {
        const q = easeOut(tramo(p('cortados'), i * 0.18, i * 0.18 + 0.6));
        return <Arn key={i} x={lerp(300, 930, q)} y={430 + i * 90} w={110} p={tramo(p('cortados'), 0, 0.2)} tono={P.cap} grosor={8} />;
      })}
      <Visto x={1060} y={520} k={0.8} p={p('cortados')} />
      {/* el ARN largo, con su elemento RRE, y Rev que lo escolta */}
      <g opacity={tramo(p('largos'), 0, 0.4)}><Arn x={x - 110} y={520} w={260} fase={reloj / 600} grosor={11} /></g>
      <Txt x={x + 20} y={455} txt="ARN largo" t={26} p={p('largos')} />
      <path d={`M${x + 28},520 C${x - 10},440 ${x + 60},440 ${x + 40},520`} fill="none" stroke={P.espiga[1]} strokeWidth={10} strokeLinecap="round" opacity={p('elemento')} />
      <Txt x={x + 30} y={420} txt="RRE" t={28} p={p('elemento')} color={TXV.ambar} />
      <Sale p={p('rev')} x={x} y={620}><Vagon x={0} y={0} k={0.85} reloj={reloj} tono={[...P.espiga]} /></Sale>
      <Bandera x={x} y={725} txt="Rev" color={P.espiga[0]} p={p('rev')} t={30} punta="no" />
      <Bandera x={822} y={250} txt="transporte de la propia célula (CRM1)" color={P.hla[0]} p={p('propia')} t={26} punta="no" />
      {/* afuera: el genoma y los mensajeros de Gag, Pol y Env */}
      {[['genoma', 360, P.virus], ['Gag', 480, P.cap], ['Pol', 600, P.rt], ['Env', 720, P.espiga]].map(([n, y, tono], i) => (
        <g key={n as string}>
          <Arn x={1130} y={y as number} w={300} p={tramo(p('mensajeros'), i * 0.18, i * 0.18 + 0.5)} tono={tono as readonly string[]} grosor={9} fase={i} />
          <Txt x={1480} y={(y as number) + 2} txt={n as string} t={28} ancla="start" p={tramo(p('mensajeros'), i * 0.18, i * 0.18 + 0.5)} />
        </g>
      ))}
      {/* el ritmo: primero los reguladores, después los estructurales */}
      <Sale p={p('ritmo')} x={150} y={935}><Reloj k={0.5} ang={lerp(0, 720, p('ritmo'))} /></Sale>
      <Bandera x={500} y={935} txt="primero: reguladores (Tat, Rev)" color={P.rt[0]} p={p('reguladores')} t={26} punta="no" />
      <Flecha a={[760, 935]} b={[860, 935]} p={p('estructura')} color="var(--cit-flecha)" w={9} />
      <Bandera x={1180} y={935} txt="después: estructura (Gag, Pol, Env)" color={P.cap[0]} p={p('estructura')} t={26} punta="no" />
    </g>
  );
};

// ─── 4 · Nef: el camuflaje ───────────────────────────────────────────────────
const NefCamuflaje: Lamina = ({ p, reloj }) => {
  const CX = 440, CY = 580, RC = 58 * 4.2;
  const qc = easeOut(p('cd4')), qh = easeOut(p('hla'));
  const ser = p('serinc');
  return (
    <g>
      <Txt x={800} y={95} txt="proteínas accesorias" t={52} p={p('accesorias')} color={TXV.violeta} />
      <Linfocito x={CX} y={CY} k={4.2} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = -160 + i * 17, ar = (a * Math.PI) / 180;
        return <Canal key={i} x={CX + Math.cos(ar) * (RC - 6)} y={CY + Math.sin(ar) * (RC - 6)} r={a + 90} k={0.4 * (1 - qc)} alto={70} tono={P.cd4} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} hueco={P.interior} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = -40 + i * 18, ar = (a * Math.PI) / 180;
        return <Hla key={i} x={CX + Math.cos(ar) * (RC - 4)} y={CY + Math.sin(ar) * (RC - 4)} r={a + 90} k={2.2 * (1 - qh)} />;
      })}
      <Sale p={p('nef')} x={lerp(300, 560, easeOut(tramo(p('quita'), 0, 1)))} y={CY - RC - 70}>
        <rect x={-46} y={-26} width={92} height={52} rx={14} fill={P.hla[0]} transform="rotate(-18)" />
        <rect x={-42} y={-23} width={84} height={42} rx={12} fill={P.hla[1]} transform="rotate(-18)" />
        <rect x={-42} y={-6} width={84} height={16} fill="#FFF" opacity={0.85} transform="rotate(-18)" />
      </Sale>
      <Bandera x={300} y={225} txt="Nef: el camuflaje" color={P.hla[0]} p={p('nef')} t={32} punta="no" />
      <Bandera x={150} y={330} txt="receptor CD4" color={P.cd4[0]} p={p('cd4')} t={24} punta="no" />
      <Bandera x={720} y={330} txt="HLA de clase I" color={P.hla[0]} p={p('hla')} t={24} punta="no" />
      <Cruz x={150} y={400} k={0.8} p={tramo(p('cd4'), 0.5, 1)} /><Cruz x={720} y={400} k={0.8} p={tramo(p('hla'), 0.5, 1)} />
      {/* los citotóxicos ya no la ven */}
      <Sale p={p('citotoxicos')} x={1130} y={500}><Linfocito tono="cd8" k={1.6} /></Sale>
      <Sale p={p('citotoxicos')} x={1130} y={300}>
        <ellipse rx={74} ry={44} fill="#FFF" /><circle r={30} fill={P.rt[1]} /><circle r={15} fill={P.interior} /><circle cx={-8} cy={-8} r={6} fill="#FFF" />
      </Sale>
      <Cruz x={1130} y={300} k={1.2} p={p('dificil')} />
      <Txt x={1130} y={395} txt="no reconoce a la célula infectada" t={28} p={p('dificil')} color={TXV.sangre} />
      {/* SERINC: los viriones nuevos, menos infecciosos */}
      <Sale p={ser} x={1130} y={770}>
        <En o={1 - 0.55 * easeOut(p('infecciosos'))}><Virion k={0.8} reloj={reloj} /></En>
        {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.3; return <circle key={i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 92} r={11} fill="none" stroke="#E5324C" strokeWidth={6} />; })}
      </Sale>
      <Txt x={1130} y={925} txt="SERINC" t={30} p={ser} color={TXV.sangre} />
      <Txt x={1130} y={968} txt="menos infecciosos" t={30} p={p('infecciosos')} />
    </g>
  );
};

// ─── 5 · Vif contra APOBEC3G ─────────────────────────────────────────────────
const VifApobec: Lamina = ({ p, reloj }) => {
  const entra = easeOut(p('cuela'));
  const mut = p('mutaciones') + 0.5 * p('errores');
  return (
    <g>
      <Txt x={330} y={150} txt="las defensas de la célula" t={34} p={p('defensas')} color={TXV.violeta} />
      <Sale p={p('restriccion')} x={lerp(330, 770, entra)} y={lerp(560, 640, entra)}><Guardia k={1.6 - 0.8 * entra} o={1 - 0.75 * entra} /></Sale>
      <Bandera x={330} y={730} txt="APOBEC3G" color={P.inte[0]} p={p('a3g')} t={32} punta="no" />
      <Txt x={330} y={790} txt="factor de restricción" t={26} p={p('restriccion')} />
      <Virion x={870} y={640} k={1.0} reloj={reloj} o={tramo(p('cuela'), 0, 0.3)} />
      {/* el ADN naciente se llena de mutaciones G→A */}
      <Medallon x={870} y={230} R={140} id="vif">
        <Helice x={0} y={0} w={330} amp={34} vueltas={2.2} p={p('copia')} fase={reloj / 1500} />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-130 + i * 32} cy={Math.sin(i * 1.9) * 26} r={11 * easeOut(clamp(mut * 2 - i / 9))} fill="#E5324C" />)}
      </Medallon>
      <Txt x={1130} y={190} txt="mutaciones G→A" t={30} ancla="start" p={p('mutaciones')} color={TXV.sangre} />
      <Txt x={1130} y={240} txt="al copiar el ARN a ADN" t={26} ancla="start" p={p('copia')} />
      {/* Vif: la llave que destruye al guardia */}
      <Bandera x={560} y={330} txt="Vif" color={P.hla[0]} p={p('vif')} t={36} punta="no" />
      <Sale p={p('vif')} x={560} y={430}><Llave r={90} tono={P.hla} forma={2} /></Sale>
      <Sale p={p('vif')} x={560} y={620}><Guardia k={1.0} o={1 - easeOut(p('destruya'))} /></Sale>
      <Cruz x={560} y={620} k={1.1} p={p('destruya')} />
      <Txt x={560} y={725} txt="la célula la destruye" t={26} p={p('destruya')} />
      {/* los viriones nuevos salen sin ella; si Vif falla, se llenan de errores */}
      {[0, 1, 2].map((i) => <Virion key={i} x={1130 + i * 150} y={600 + (i % 2) * 90} k={0.4} o={tramo(p('particulas'), i * 0.2, i * 0.2 + 0.5)} reloj={reloj + i * 300} />)}
      <Txt x={1280} y={800} txt="sin APOBEC3G" t={32} p={p('particulas')} color={TXV.verde} />
      <Cruz x={560} y={430} k={0.9} p={p('falla')} />
      <Txt x={870} y={880} txt="sin Vif: un genoma lleno de errores" t={34} p={p('errores')} color={TXV.sangre} />
      <Txt x={870} y={935} txt="el virus se apaga" t={34} p={p('apaga')} color={TXV.violeta} />
    </g>
  );
};

// ─── 6 · Vpu contra la teterina ──────────────────────────────────────────────
const VpuTeterina: Lamina = ({ p, reloj }) => {
  const corta = easeOut(p('neutraliza'));
  const libre = easeOut(p('libre'));
  const XS = [300, 550, 800, 1050, 1300];
  return (
    <g>
      <Lomas x={800} y={720} w={1800} fondo={1100} bandas={[[0, '#F58AD0', 46], [60, '#E22BC4', 52], [70, '#8A15A8', 58]]} sem={5} o={tramo(p('segunda'), 0, 0.5)} />
      <Txt x={800} y={150} txt="la segunda defensa: la teterina" t={44} p={p('teterina')} color={TXV.violeta} />
      {XS.map((x, i) => {
        const dy = -170 * libre, dx = (i - 2) * 60 * libre;
        const wob = Math.sin(reloj / 140 + i * 2) * 4 * p('ata') * (1 - corta);
        return (
          <g key={x}>
            <Trazo pts={[[x, 590], [x - 22, 640], [x + 20, 680], [x, 725]]} p={p('ata') * (1 - corta)} color={P.hla[1]} w={9} />
            <Sale p={p('pegados')} x={x + dx + wob} y={500 + dy}><Virion k={0.55} reloj={reloj + i * 200} /></Sale>
          </g>
        );
      })}
      {[425, 675, 925, 1175].map((x, i) => (
        <g key={x}>
          <Canal x={x} y={726} k={0.8 * (1 - easeOut(p('degrada')))} alto={60} tono={P.cd4} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} />
          <Cruz x={x} y={650} k={0.55} p={tramo(p('cd4'), i * 0.15, i * 0.15 + 0.5)} />
        </g>
      ))}
      <Bandera x={300} y={880} txt="teterina (BST-2)" color={P.hla[0]} p={p('ata')} t={28} punta="no" />
      <Txt x={300} y={930} txt="ata a los viriones nuevos" t={26} p={p('pegados')} />
      <Sale p={p('vpu')} x={800} y={640}><Tijeras k={2.2} abre={0.4 + 0.5 * Math.abs(Math.sin(reloj / 180))} r={90} /></Sale>
      <Bandera x={800} y={400} txt="Vpu" color={P.hla[0]} p={p('vpu')} t={34} punta="no" />
      <Bandera x={925} y={880} txt="también degrada el CD4" color={P.cd4[0]} p={p('degrada')} t={28} punta="no" />
      <Txt x={925} y={930} txt="para que no estorbe a las espículas" t={26} p={p('estorbe')} />
      <Bandera x={1400} y={250} txt="puerta de salida libre" color={P.virus[0]} p={p('puerta')} t={30} punta="no" />
      {[200, 800, 1400].map((x, i) => <Sale key={x} p={p('buscar')} x={x} y={80 + (i === 1 ? 0 : 20)}><Linfocito tono="t" k={0.6} /></Sale>)}
      <Flecha a={[800, 300]} b={[800, 215]} p={p('buscar')} color="var(--cit-flecha)" w={9} />
    </g>
  );
};

// ─── 7 · Vpx, Vpr y SAMHD1 ───────────────────────────────────────────────────
const VpxVpr: Lamina = ({ p, reloj }) => {
  const gasta = easeOut(p('gasta'));
  const perlas = Array.from({ length: 10 }, (_, i) => i);
  const resumen = p('resumen');
  return (
    <g>
      {/* A · SAMHD1 deja sin nucleótidos a la transcriptasa */}
      <Sale p={p('reposo')} x={230} y={300}><Linfocito tono="gris" k={1.5} /></Sale>
      <Txt x={230} y={415} txt="célula en reposo" t={28} p={p('reposo')} />
      <Sale p={p('samhd1')} x={560} y={290}><Guardia k={0.9} tono={[...P.menta]} /></Sale>
      <Bandera x={560} y={170} txt="SAMHD1" color={P.menta[0]} p={p('samhd1')} t={32} punta="no" />
      <Sale p={p('nucleotidos')} x={440} y={420}>
        <path d="M-90,-10 L90,-10 Q90,66 0,66 Q-90,66 -90,-10 Z" fill={P.prot[0]} /><path d="M-82,-8 L82,-8 Q82,56 0,56 Q-82,56 -82,-8 Z" fill={P.prot[1]} />
        {perlas.map((i) => <circle key={i} cx={-64 + (i % 5) * 32} cy={-20 + Math.floor(i / 5) * 26 - 8} r={11 * (1 - clamp(gasta * 1.25 - i / 12))} fill={[P.cd4[1], P.sangre[1], P.virus[1], P.espiga[1]][i % 4]} />)}
      </Sale>
      <Txt x={440} y={518} txt="nucleótidos" t={26} p={p('nucleotidos')} />
      <Sale p={p('rt')} x={150} y={470}><Enzima k={1.4} tono={[...P.rt]} abre={0.6} /></Sale>
      <Cruz x={290} y={470} k={0.7} p={p('prima')} />
      <Txt x={300} y={560} txt="sin materia prima" t={28} p={p('prima')} color={TXV.sangre} />
      {/* B · el VIH-2 tiene la llave (Vpx); el VIH-1, no */}
      <Sale p={p('vih2')} x={890} y={230}><Virion k={0.42} reloj={reloj} tono={P.inte} /></Sale>
      <Txt x={890} y={320} txt="VIH-2" t={30} p={p('vih2')} color={TXV.violeta} />
      <Sale p={p('llave')} x={1130} y={230}><Llave tono={P.hla} forma={2} k={0.8} /></Sale>
      <Bandera x={1070} y={160} txt="Vpx" color={P.hla[0]} p={p('vpx')} t={28} punta="no" />
      <Sale p={p('vih2')} x={1370} y={230}><Guardia k={0.6} tono={[...P.menta]} o={1 - easeOut(p('destruye'))} /></Sale>
      <Cruz x={1370} y={230} k={0.8} p={p('destruye')} />
      <Sale p={p('vih1')} x={890} y={420}><Virion k={0.42} reloj={reloj + 300} /></Sale>
      <Txt x={890} y={510} txt="VIH-1" t={30} p={p('vih1')} color={TXV.virus} />
      <Txt x={1130} y={430} txt="no tiene Vpx" t={30} p={p('vih1')} />
      <Sale p={p('vih1')} x={1370} y={420}><Guardia k={0.6} tono={[...P.menta]} /></Sale>
      <Txt x={1130} y={545} txt="infecta peor a las células en reposo" t={26} p={p('peor')} color={TXV.sangre} />
      {/* C · Vpr frena el ciclo celular antes de la división */}
      <Bandera x={420} y={650} txt="Vpr: cuarta accesoria" color={P.rt[0]} p={p('vpr')} t={30} punta="no" />
      <Sale p={p('detiene')} x={420} y={790}>
        <circle r={96} fill="none" stroke={P.rt[1]} strokeWidth={22} strokeDasharray="120 40" transform={`rotate(${reloj / 20 * (1 - p('dividirse'))})`} />
        <polygon points="-34,-80 34,-80 78,-34 78,34 34,80 -34,80 -78,34 -78,-34" transform="scale(0.55)" fill="#E5324C" />
        <rect x={-18} y={-5} width={36} height={10} rx={5} fill="#FFF" />
      </Sale>
      <Txt x={420} y={925} txt="detiene la célula antes de dividirse" t={28} p={p('dividirse')} />
      {/* D · cada accesoria es la llave de una cerradura de la defensa innata */}
      {[['Nef', P.hla], ['Vif', P.cd4], ['Vpu', P.cap], ['Vpx', P.virus]].map(([n, tono], i) => {
        const q = easeOut(tramo(resumen, i * 0.18, i * 0.18 + 0.5));
        const x = 960 + i * 150;
        return (
          <g key={n as string}>
            <Sale p={q} x={x} y={720}><Cerrojo k={0.55} forma={(i % 2 ? 2 : 1) as 1 | 2} tono={P.inte} /></Sale>
            <Sale p={q} x={x} y={835}><Llave k={0.6} r={-90} tono={tono as readonly string[]} forma={(i % 2 ? 2 : 1) as 1 | 2} /></Sale>
            <Txt x={x} y={625} txt={n as string} t={30} p={q} />
          </g>
        );
      })}
      <Txt x={1150} y={975} txt="cada accesoria, la llave de una defensa innata" t={26} p={p('cerradura')} color={TXV.violeta} />
    </g>
  );
};

const LAMINAS: Lamina[] = [GenesYProteinas, GagPolEnv, TatAcelerador, RevTransportista, NefCamuflaje, VifApobec, VpuTeterina, VpxVpr];
export default LAMINAS;
