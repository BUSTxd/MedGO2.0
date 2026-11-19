'use client';
// Capítulo 6 · El ciclo replicativo (ocho estaciones, cada una con su hueco con forma de cerradura)

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Arn, Bandera, Canal, Capside, Correceptor, Cruz, Enzima, Espiga, Flecha, Helice, Hueco, Letra, Lomas, Maquina, P, Sale, Tijeras, Txt, TXV, Virion, blob, easeOut, hash, lerp, tramo } from '../Piezas';

const CORAL = '#FF6F7A';
const Guia = ({ a, b, p, color = 'var(--cit-flecha)' }: { a: [number, number]; b: [number, number]; p: number; color?: string }) => (
  <Flecha a={a} b={b} p={p} color={color} w={4} cabeza={false} />
);

/** La tira de las ocho estaciones: números en círculos, el de la estación actual marcado. */
function Progreso({ cur, o = 1 }: { cur: number; o?: number }) {
  return (
    <g opacity={o}>
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${220 + i * 165},56)`}>
          {i === cur && <circle r={34} fill="none" stroke={P.espiga[1]} strokeWidth={7} />}
          <circle r={24} fill={i <= cur ? P.virus[1] : P.inte[2]} opacity={i <= cur ? 1 : 0.7} />
          <Letra txt={String(i + 1)} t={26} color={i <= cur ? '#0E3A18' : '#3A2A6A'} />
        </g>
      ))}
    </g>
  );
}

/** La célula en corte: borde coral, interior azul marino, orgánulos magenta y, si se pide, el núcleo. */
function CelulaCorte({ x, y, R, nucleo }: { x: number; y: number; R: number; nucleo?: { dx: number; dy: number; r: number } }) {
  const orgs: [number, number, number, number][] = [[-0.45, 0.35, 70, 1], [0.3, 0.5, 60, 2], [-0.15, -0.5, 55, 3], [0.5, -0.2, 64, 4], [-0.6, -0.1, 48, 5]];
  return (
    <g>
      <circle cx={x + 8} cy={y + 10} r={R + 26} fill={P.sombra} />
      <circle cx={x} cy={y} r={R + 26} fill={CORAL} />
      <circle cx={x} cy={y} r={R + 8} fill="#C2185B" />
      <circle cx={x} cy={y} r={R - 4} fill="#2A0F6E" />
      {orgs.map(([a, b, r, s], i) => <path key={i} d={blob(9, r, 0.25, s)} fill="#B0206F" opacity={0.85} transform={`translate(${x + a * R},${y + b * R})`} />)}
      {nucleo && (
        <g>
          <circle cx={x + nucleo.dx} cy={y + nucleo.dy} r={nucleo.r} fill="#E08A00" />
          <circle cx={x + nucleo.dx - 8} cy={y + nucleo.dy - 8} r={nucleo.r - 12} fill="#FFB62B" />
          <circle cx={x + nucleo.dx - nucleo.r * 0.28} cy={y + nucleo.dy - nucleo.r * 0.3} r={nucleo.r * 0.4} fill="#FFE49A" />
        </g>
      )}
    </g>
  );
}

// ─── 0 · Unión ───────────────────────────────────────────────────────────────
const Union: Lamina = ({ p, reloj }) => {
  const une = easeOut(p('une'));
  const camb = easeOut(p('cambia'));
  const cx = 1350, cy = 540, R = 480;
  return (
    <g>
      <Sale p={p('llega')} x={lerp(220, 300, easeOut(p('llega')))} y={300}><Virion k={0.8} reloj={reloj} /></Sale>
      <g opacity={tramo(p('linfo'), 0, 0.5)}><CelulaCorte x={cx} y={cy} R={R} /></g>
      <Txt x={800} y={170} txt="un linfocito T CD4" t={34} p={p('linfo')} color={TXV.cd4} />
      {/* los receptores CD4 en la membrana */}
      {[-14, 0, 14].map((a, i) => {
        const ar = ((180 + a) * Math.PI) / 180;
        return <Canal key={i} x={cx + Math.cos(ar) * (R + 12)} y={cy + Math.sin(ar) * (R + 12)} r={180 + a + 90} k={1.0 * easeOut(p('cd4'))} alto={100} tono={P.cd4} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} hueco={P.interior} />;
      })}
      <Bandera x={560} y={760} txt="CD4" color={P.cd4[0]} p={p('cd4')} t={30} punta="no" />
      <Txt x={560} y={830} txt="cada célula se vuelve una fábrica de miles de viriones" t={26} p={p('miles')} />
      {/* la gp120 se pega al CD4 y cambia de forma */}
      <Sale p={p('gp120')} x={lerp(360, 520, une)} y={540}><Espiga r={90 + 14 * camb} k={4} /></Sale>
      <Bandera x={440} y={420} txt="gp120" color={P.espiga[0]} p={p('gp120')} t={30} punta="abajo" />
      <circle cx={796} cy={540} r={50 * easeOut(p('contacto'))} fill="none" stroke={P.espiga[1]} strokeWidth={8} opacity={0.9} />
      <Txt x={600} y={300} txt="al tocar, cambia de forma" t={28} p={p('cambia')} color={TXV.ambar} />
      {/* queda descubierto el sitio del correceptor */}
      <circle cx={760} cy={470} r={24 * easeOut(p('descubierto'))} fill={P.espiga[2]} opacity={0.9} />
      <Sale p={p('correceptor')} x={880} y={650}><Correceptor r={-90} k={1.3} /></Sale>
      <Sale p={p('correceptor')} x={880} y={760}><Correceptor r={-90} k={1.3} tipo="cxcr4" /></Sale>
      <Bandera x={1050} y={650} txt="CCR5" color={P.copa[0]} p={p('ccr5')} t={28} punta="no" />
      <Bandera x={1050} y={760} txt="CXCR4" color={P.esp[0]} p={p('cxcr4')} t={28} punta="no" />
      <Hueco x={1250} y={340} k={1.3} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={1250} y={470} txt="hueco 1: unión y correceptor" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
      <Progreso cur={0} o={p('estaciones')} />
    </g>
  );
};

// ─── 1 · Fusión ──────────────────────────────────────────────────────────────
const Fusion: Lamina = ({ p, reloj }) => {
  const acerca = easeOut(p('acerca'));
  const fun = easeOut(p('funden'));
  const vy = lerp(300, 450, acerca);
  const cae = easeOut(p('capsida'));
  return (
    <g>
      <Progreso cur={1} />
      <Lomas x={800} y={640} w={1800} fondo={1100} bandas={[[0, '#FF8AA0', 46], [50, CORAL, 52], [60, '#C2185B', 56]]} sem={14} />
      <Txt x={400} y={190} txt="fusión" t={46} p={p('fusion')} color={TXV.violeta} />
      <Virion x={800} y={vy} k={1.4} o={1 - 0.0} reloj={reloj} espigas={0.7} />
      {/* el haz de seis hélices de la gp41 */}
      {Array.from({ length: 6 }, (_, i) => {
        const dx = (i - 2.5) * 11, top = vy + 140, largo = lerp(360 - (top - 440) * 0.0, 0, 0), fin = 640;
        const q = tramo(p('gp41'), 0, 0.5);
        return <rect key={i} x={800 + dx - 4} y={top} width={8} height={Math.max(8, (fin - top) * (1 - 0.0))} rx={4} fill={P.espiga[1]} opacity={q * (1 - fun)} />;
      })}
      <Sale p={p('clava')} x={800} y={636}><polygon points="-16,-22 16,-22 0,16" fill={P.sangre[1]} /></Sale>
      <Txt x={1290} y={300} txt="la gp41 clava su péptido de fusión" t={26} p={p('clava')} />
      <Txt x={1290} y={345} txt="y se pliega en seis hélices" t={26} p={p('helices')} color={TXV.ambar} />
      <Txt x={1290} y={390} txt="que acercan las membranas" t={26} p={p('acerca')} />
      {fun > 0.02 && <ellipse cx={800} cy={640} rx={120 * fun} ry={26 * fun} fill={P.virus[1]} />}
      <Txt x={1290} y={435} txt="y las funden" t={26} p={p('funden')} color={TXV.sangre} />
      <Sale p={p('capsida')} x={800} y={lerp(640, 840, cae)}><Capside k={2.2} r={90} arn={1} /></Sale>
      <Txt x={1180} y={840} txt="la cápside entra al citoplasma" t={30} p={p('citoplasma')} color="#FFF" />
      <Hueco x={300} y={850} k={1.2} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={300} y={965} txt="hueco 2: fusión" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
    </g>
  );
};

// ─── 2 · Transcripción inversa ───────────────────────────────────────────────
const TranscripcionInversa: Lamina = ({ p, reloj }) => {
  const adn = easeOut(p('adn'));
  const sal = easeOut(p('salta'));
  const xt = 820 + 660 * adn;
  return (
    <g>
      <Progreso cur={2} />
      <Bandera x={800} y={150} txt="transcripción inversa: ARN → ADN" color={P.rt[0]} p={p('transcripcion')} t={34} punta="no" />
      <Sale p={p('capsida')} x={400} y={470}><Capside k={3.2} r={-14} arn={1} enzimas={p('rt')} /></Sale>
      <Bandera x={400} y={680} txt="la transcriptasa inversa, dentro de la cápside" color={P.rt[0]} p={p('rt')} t={24} punta="no" />
      {/* copia el ARN a ADN */}
      <Arn x={820} y={360} w={680} p={p('arn')} fase={reloj / 600} grosor={10} />
      <Txt x={780} y={330} txt="ARN" t={30} ancla="end" p={p('arn')} color={TXV.sangre} />
      <Helice x={820 + 330 * adn} y={540} w={Math.max(20, 660 * adn)} amp={34} vueltas={Math.max(0.5, 3 * adn)} p={p('copia')} fase={reloj / 1200} />
      <Txt x={780} y={540} txt="ADN" t={30} ancla="end" p={p('adn')} color={TXV.adn} />
      <Sale p={p('copia')} x={xt} y={450}><Enzima k={1.9} tono={[...P.rt]} abre={0.6} r={90} /></Sale>
      <Sale p={p('cebador')} x={840} y={450}>
        <circle cx={0} cy={-26} r={20} fill={P.virus[1]} /><circle cx={-24} cy={6} r={18} fill={P.virus[1]} /><circle cx={24} cy={6} r={18} fill={P.virus[1]} /><rect x={-5} y={-8} width={10} height={44} rx={5} fill={P.virus[0]} />
      </Sale>
      <Txt x={910} y={470} txt="ARNt: el cebador" t={24} ancla="start" p={p('cebador')} color={TXV.virus} />
      {/* no corrige sus errores */}
      {[0.2, 0.42, 0.63, 0.85].map((u, i) => <Cruz key={i} x={820 + 660 * u} y={610} k={0.55} p={tramo(p('errores'), i * 0.2, i * 0.2 + 0.5)} />)}
      <Txt x={1150} y={685} txt="no corrige sus errores" t={32} p={p('errores')} color={TXV.sangre} />
      <Txt x={1150} y={740} txt="uno cada 10 000 a 100 000 bases" t={28} p={p('cifras')} />
      {/* salta de una hebra de ARN a la otra */}
      <Arn x={820} y={250} w={680} p={p('salta')} tono={P.rt} fase={reloj / 600 + 1} grosor={10} />
      <Flecha a={[1100, 372]} b={[1180, 262]} c={[1190, 340]} p={sal} color={P.espiga[1]} w={9} />
      <Txt x={1380} y={225} txt="salta a la otra hebra" t={26} p={p('hebra')} color={TXV.ambar} />
      <Hueco x={400} y={860} k={1.1} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={400} y={965} txt="hueco 3: transcriptasa inversa" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
    </g>
  );
};

// ─── 3 · La cápside entra al núcleo ──────────────────────────────────────────
const CapsideNucleo: Lamina = ({ p, reloj }) => {
  const at = easeOut(p('atraviesa'));
  const NX = 1090, NY = 540, NR = 330;
  const cx = lerp(250, 900, at);
  return (
    <g>
      <Progreso cur={3} />
      <circle cx={NX + 8} cy={NY + 10} r={NR + 14} fill={P.sombra} />
      <circle cx={NX} cy={NY} r={NR + 14} fill="#E08A00" opacity={tramo(p('nucleo'), 0, 0.5)} />
      <circle cx={NX - 8} cy={NY - 8} r={NR - 14} fill="#FFB62B" opacity={tramo(p('nucleo'), 0, 0.5)} />
      <circle cx={NX - 70} cy={NY - 80} r={NR * 0.55} fill="#FFE49A" opacity={0.65 * tramo(p('nucleo'), 0, 0.5)} />
      <Txt x={NX} y={150} txt="núcleo" t={36} p={p('nucleo')} color={TXV.ambar} />
      {/* el poro nuclear y la luz que entra */}
      <g opacity={tramo(p('poro'), 0, 0.5)}>
        <rect x={730} y={420} width={40} height={90} rx={18} fill="#8A4A00" /><rect x={730} y={570} width={40} height={90} rx={18} fill="#8A4A00" />
        <rect x={736} y={426} width={14} height={78} rx={7} fill="#FFD27A" /><rect x={736} y={576} width={14} height={78} rx={7} fill="#FFD27A" />
        <rect x={500} y={505} width={420} height={70} rx={35} fill="#FFF" opacity={0.28} />
      </g>
      <Bandera x={750} y={360} txt="poro nuclear" color={P.cap[0]} p={p('poro')} t={26} punta="abajo" />
      {/* antes se creía que se desarmaba en el citoplasma */}
      {p('penso') > 0.02 && (
        <g opacity={1 - easeOut(p('sabemos'))}>
          {Array.from({ length: 10 }, (_, i) => {
            const d = easeOut(p('desarmaba'));
            return <circle key={i} cx={300 + (hash(i, 3) - 0.5) * 360 * d} cy={260 + (hash(i, 4) - 0.5) * 140 * d} r={11} fill={P.cap[1]} />;
          })}
          <Cruz x={300} y={260} k={1.0} p={p('desarmaba')} />
        </g>
      )}
      <Txt x={330} y={165} txt="antes se creía que se desarmaba" t={26} p={p('penso')} />
      {/* ahora sabemos: el cono cruza casi intacto y libera su ADN adentro */}
      <Sale p={p('cono')} x={cx} y={540}><Capside k={2.2} r={0} arn={0} /></Sale>
      <Txt x={450} y={720} txt="ahora sabemos: cruza casi intacta" t={28} p={p('sabemos')} color={TXV.verde} />
      <Helice x={NX + 60} y={NY} w={300} amp={34} vueltas={2.4} p={p('libera')} fase={reloj / 1500} />
      <Txt x={NX + 60} y={NY + 90} txt="libera el ADN adentro del núcleo" t={26} p={p('adn')} color="#5A2A00" />
      <Txt x={450} y={800} txt="una pieza clave" t={30} p={p('clave')} color={TXV.violeta} />
      <Hueco x={1400} y={170} k={1.1} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={1400} y={285} txt="hueco 4: la cápside" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
    </g>
  );
};

// ─── 4 · Integración ─────────────────────────────────────────────────────────
const Integracion: Lamina = ({ p, reloj }) => {
  const pega = easeOut(p('pega'));
  const vy = lerp(230, 520, pega);
  return (
    <g>
      <Progreso cur={4} />
      <Helice x={800} y={620} w={1400} amp={70} vueltas={5} p={1} grosor={22} fase={reloj / 2500} resalta={[0.36, 0.5] as [number, number]} />
      <path d="M100,545 L1500,545" stroke="none" />
      <Bandera x={1250} y={430} txt="genes activos" color={P.virus[0]} p={p('genes')} t={26} punta="abajo" />
      <Txt x={560} y={470} txt="integrasa" t={32} p={p('integrasa')} color={TXV.violeta} />
      <Sale p={p('integrasa')} x={700} y={vy + 140}><Enzima k={3.2} tono={[...P.hla]} abre={0.5 + 0.4 * Math.sin(reloj / 300)} r={0} /></Sale>
      <Txt x={700} y={170} txt="corta el ADN de la célula" t={28} p={p('corta')} />
      <Sale p={p('adn')} x={700} y={vy}><Helice x={0} y={0} w={240} amp={24} vueltas={1.6} grosor={14} fase={reloj / 1200} resalta={[0, 1] as [number, number]} /></Sale>
      <Txt x={930} y={vy + 6} txt="ADN del virus" t={26} ancla="start" p={p('adn')} color={TXV.violeta} />
      <Txt x={700} y={880} txt="y lo pega: provirus" t={34} p={p('pega')} color={TXV.violeta} />
      {/* guiada por una proteína propia de la célula, hacia genes activos */}
      <Sale p={p('guiada')} x={1000} y={380}>
        <circle r={36} fill={P.espiga[0]} /><circle cx={-2} cy={-2} r={31} fill={P.espiga[1]} /><circle cx={-10} cy={-10} r={8} fill="#FFF" opacity={0.7} />
      </Sale>
      <Bandera x={1000} y={300} txt="LEDGF/p75" color={P.espiga[0]} p={p('guiada')} t={26} punta="abajo" />
      <Flecha a={[1040, 400]} b={[1210, 470]} p={p('genes')} color={P.espiga[1]} w={8} />
      <Txt x={1150} y={250} txt="una proteína propia de la célula la guía" t={26} p={p('proteina')} />
      <Bandera x={700} y={780} txt="provirus" color={P.hla[0]} p={p('provirus')} t={34} punta="no" />
      <Sale p={p('separar')} x={1260} y={800}><Tijeras k={1.2} abre={0.7} r={90} /></Sale>
      <Cruz x={1260} y={800} k={1.3} p={p('separar')} />
      <Txt x={1260} y={900} txt="ya no se puede separar del genoma" t={26} p={p('separar')} color={TXV.sangre} />
      <Hueco x={260} y={800} k={1.1} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={260} y={915} txt="hueco 5: integrasa" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
    </g>
  );
};

// ─── 5 · Transcripción y traducción ──────────────────────────────────────────
const TranscripcionTraduccion: Lamina = ({ p, reloj }) => {
  const sale = easeOut(p('mensajeros'));
  return (
    <g>
      <Progreso cur={5} />
      <Sale p={p('fabrica')} x={290} y={500}>
        <circle r={240} fill={P.inte[0]} opacity={0.35} /><circle cx={-6} cy={-6} r={226} fill={P.inte[1]} opacity={0.35} />
        <Helice x={0} y={0} w={330} amp={36} vueltas={2.2} grosor={14} fase={reloj / 1800} resalta={[0.35, 0.65] as [number, number]} />
      </Sale>
      <Txt x={290} y={200} txt="el provirus se enciende" t={28} p={p('enciende')} color={TXV.violeta} />
      <Txt x={290} y={790} txt="las mismas señales que activan al linfocito (NF-κB)" t={22} p={p('senales')} />
      <Sale p={p('polimerasa')} x={290} y={420}><Enzima k={1.6} tono={[...P.rt]} abre={0.6} r={90} /></Sale>
      <Txt x={290} y={350} txt="ARN polimerasa de la célula" t={22} p={p('polimerasa')} />
      <En2 q={p('tat')} x={140} y={330}><circle r={26} fill={P.espiga[0]} /><circle cx={-2} cy={-2} r={22} fill={P.espiga[1]} /><Letra txt="Tat" t={20} /></En2>
      <En2 q={p('rev')} x={440} y={330}><circle r={26} fill={P.cap[0]} /><circle cx={-2} cy={-2} r={22} fill={P.cap[1]} /><Letra txt="Rev" t={20} /></En2>
      {/* los ARN largos salen y los ribosomas fabrican poliproteínas */}
      <Arn x={540} y={470} w={Math.max(4, 460 * sale)} p={p('mensajeros')} fase={reloj / 500} grosor={9} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={tramo(p('ribosomas'), i * 0.2, i * 0.2 + 0.5)}>
          <circle cx={700 + i * 120} cy={452} r={24} fill={P.inte[0]} /><circle cx={700 + i * 120} cy={436} r={17} fill={P.inte[1]} />
        </g>
      ))}
      <Txt x={820} y={390} txt="ribosomas" t={24} p={p('ribosomas')} />
      {[[P.cap, 700, 'Gag'], [P.rt, 820, 'Pol'], [P.espiga, 940, 'Env']].map(([tono, x, n], i) => (
        <g key={n as string}>
          {Array.from({ length: 5 }, (_, j) => <circle key={j} cx={(x as number) + Math.sin(j * 1.3 + reloj / 500) * 6} cy={500 + j * 22} r={11 * easeOut(tramo([p('gac'), p('pol'), p('embe')][i], j * 0.1, j * 0.1 + 0.4))} fill={(tono as readonly string[])[1]} />)}
          <Txt x={x as number} y={640} txt={n as string} t={26} p={[p('gac'), p('pol'), p('embe')][i]} />
        </g>
      ))}
      <Txt x={820} y={690} txt="poliproteínas" t={30} p={p('poliproteinas')} color={TXV.violeta} />
      {/* Env pasa al retículo (azúcares) y al Golgi (la furina la corta) */}
      <Flecha a={[980, 500]} b={[1160, 330]} c={[1060, 380]} p={p('reticulo')} color="var(--cit-flecha)" w={8} />
      <Sale p={p('reticulo')} x={1300} y={300}>
        {[0, 1, 2].map((i) => <path key={i} d={`M-120,${-40 + i * 36} Q-60,${-70 + i * 36} 0,${-40 + i * 36} T120,${-40 + i * 36}`} fill="none" stroke={P.hla[1]} strokeWidth={20} strokeLinecap="round" />)}
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-100 + i * 34} cy={-62 + (i % 2) * 90} r={9 * easeOut(p('azucares'))} fill={P.espiga[2]} />)}
      </Sale>
      <Txt x={1300} y={440} txt="retículo: se llena de azúcares" t={24} p={p('azucares')} />
      <Flecha a={[1300, 470]} b={[1300, 600]} p={p('furina')} color="var(--cit-flecha)" w={8} />
      <Sale p={p('golgi')} x={1300} y={720}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-110 + i * 6} y={-40 + i * 24} width={220 - i * 12} height={18} rx={9} fill={i % 2 ? P.hla[0] : P.hla[1]} />)}
      </Sale>
      <Sale p={p('furina')} x={1140} y={720}><Tijeras k={0.8} abre={0.7} r={90} /></Sale>
      <Txt x={1300} y={830} txt="Golgi: la furina corta gp160" t={26} p={p('golgi')} color={TXV.violeta} />
    </g>
  );
};

/** Un grupo que aparece con p (para las fichas pequeñas). */
function En2({ q, x, y, children }: { q: number; x: number; y: number; children: ReactNode }) {
  return <Sale p={q} x={x} y={y}>{children}</Sale>;
}

// ─── 6 · Ensamblaje y gemación ───────────────────────────────────────────────
const Gemacion: Lamina = ({ p, reloj }) => {
  const yema = easeOut(p('yema'));
  const sale = easeOut(p('sale'));
  const vy = lerp(640, 300, sale);
  const vk = lerp(0.3, 1.25, yema);
  return (
    <g>
      <Progreso cur={6} />
      <Lomas x={800} y={700} w={1800} fondo={1100} bandas={[[0, '#FF8AA0', 46], [50, CORAL, 52], [60, '#C2185B', 56]]} sem={16} o={tramo(p('membrana'), 0, 0.5)} />
      <Txt x={420} y={160} txt="en la membrana: Gag lo reúne todo" t={30} p={p('gag')} />
      {Array.from({ length: 12 }, (_, i) => {
        const dx = 800 - 330 + i * 60, q = tramo(p('reune'), (i / 12) * 0.6, (i / 12) * 0.6 + 0.4);
        return <circle key={i} cx={dx} cy={704 + Math.sin(i) * 3} r={15 * easeOut(q)} fill={P.cap[1]} />;
      })}
      {Array.from({ length: 5 }, (_, i) => <Espiga key={i} x={560 + i * 120} y={690} k={1.2 * easeOut(tramo(p('espiculas'), i * 0.12, i * 0.12 + 0.5))} crece={1} />)}
      {Array.from({ length: 2 }, (_, i) => <Arn key={i} x={700} y={620 + i * 26} w={200} p={p('copias')} tono={P.arn} fase={i + reloj / 600} grosor={8} />)}
      <Txt x={1220} y={640} txt="2 copias del genoma" t={26} p={p('copias')} color={TXV.sangre} />
      {/* la yema crece, el complejo ESCRT estrangula el cuello y sale el virión ininmaduro */}
      <Virion x={800} y={vy} k={vk} o={tramo(p('yema'), 0, 0.3)} reloj={reloj} />
      {yema > 0.1 && sale < 0.5 && <ellipse cx={800} cy={700} rx={70 - 50 * easeOut(p('estrangula'))} ry={22} fill={P.virus[1]} opacity={0.9} />}
      <Sale p={p('maquinaria')} x={800} y={702}><circle r={64 - 20 * easeOut(p('estrangula'))} fill="none" stroke={P.espiga[1]} strokeWidth={10} /></Sale>
      <Bandera x={1180} y={560} txt="ESCRT: maquinaria de la propia célula" color={P.espiga[0]} p={p('maquinaria')} t={24} punta="no" />
      <Txt x={1180} y={430} txt="brota" t={34} p={p('brota')} color={TXV.violeta} />
      <Bandera x={1310} y={340} txt="virión inmaduro: todavía no infeccioso" color={P.sangre[0]} p={p('inmaduro')} t={22} punta="no" />
      <circle cx={800} cy={vy} r={104 * vk} fill="none" stroke={P.cap[1]} strokeWidth={14 * vk} strokeDasharray={`${3 * vk} ${22 * vk}`} strokeLinecap="round" opacity={p('inmaduro')} />
    </g>
  );
};

// ─── 7 · Maduración ──────────────────────────────────────────────────────────
const Maduracion: Lamina = ({ p, reloj }) => {
  const cor = easeOut(p('corta'));
  const reorg = easeOut(p('reorganiza'));
  return (
    <g>
      <Progreso cur={7} />
      {/* inmaduro: anillo de Gag */}
      <circle cx={500} cy={520} r={190} fill={P.virus[0]} opacity={0.9} /><circle cx={496} cy={516} r={180} fill={P.virus[1]} />
      <circle cx={500} cy={520} r={136} fill={P.interior} />
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2, r = lerp(150, 70, reorg);
        return <circle key={i} cx={500 + Math.cos(a) * r * (1 - 0.0)} cy={520 + Math.sin(a) * r * 0.9} r={11 * (1 - 0.3 * reorg)} fill={P.cap[1]} opacity={1 - tramo(reorg, 0.6, 1)} />;
      })}
      <g opacity={reorg}><Capside x={500} y={520} k={2.0} r={-14} arn={1} enzimas={1} /></g>
      <Txt x={500} y={290} txt="inmaduro" t={30} p={p('falta')} color={TXV.sangre} ancla="middle" />
      <Txt x={500} y={780} txt="falta un último corte" t={30} p={p('corte')} />
      {/* la proteasa corta Gag y Gag-Pol */}
      <Sale p={p('proteasa')} x={920} y={430}><Tijeras k={1.8} abre={0.4 + 0.5 * Math.abs(Math.sin(reloj / 200))} r={0} tono={P.prot} /></Sale>
      <Bandera x={920} y={260} txt="proteasa viral" color={P.prot[0]} p={p('proteasa')} t={30} punta="abajo" />
      <Txt x={1130} y={430} txt="corta las poliproteínas" t={28} ancla="start" p={p('poliproteinas')} />
      <Txt x={1130} y={480} txt="Gag" t={28} ancla="start" p={p('gac')} color={TXV.ambar} />
      <Txt x={1130} y={530} txt="y Gag-Pol" t={28} ancla="start" p={p('gacpol')} color={TXV.violeta} />
      <Txt x={920} y={640} txt="la cápside se reorganiza en un cono" t={28} p={p('capside')} />
      {/* maduro e infeccioso */}
      <Sale p={p('virion')} x={1340} y={800}><Virion k={0.8} abre={1} capside={1} arn={1} enzimas={1} reloj={reloj} /></Sale>
      <Txt x={1340} y={950} txt="ahora sí, infeccioso" t={32} p={p('infeccioso')} color={TXV.verde} />
      <Hueco x={920} y={820} k={1.1} p={p('hueco')} brilla={Math.sin(reloj / 300)} />
      <Bandera x={920} y={935} txt="hueco 8: proteasa" color={P.espiga[0]} p={p('hueco')} t={24} punta="no" />
    </g>
  );
};

// ─── 8 · Una fábrica con errores ─────────────────────────────────────────────
const FabricaErrores: Lamina = ({ p, reloj }) => {
  const TON = [P.virus, P.esp, P.inte, P.hla, P.rt, P.cap] as const;
  return (
    <g>
      <Txt x={800} y={130} txt="10 000 000 000" t={110} p={p('diez')} color={TXV.virus} />
      <Txt x={800} y={225} txt="viriones al día" t={42} p={p('viriones')} />
      <Sale p={p('fabrica')} x={260} y={560}><Maquina x={0} y={0} k={1.5} encendida={1} golpe={Math.max(0, Math.sin(reloj / 200))} /></Sale>
      <Txt x={260} y={760} txt="sin tratamiento" t={28} p={p('tratamiento')} color={TXV.sangre} />
      {/* la transcriptasa se equivoca: cada mutación posible aparece a diario */}
      <Txt x={800} y={330} txt="la transcriptasa se equivoca" t={30} p={p('transcriptasa')} color={TXV.violeta} />
      <Txt x={800} y={375} txt="cada mutación posible aparece todos los días" t={26} p={p('todos')} />
      {Array.from({ length: 22 }, (_, i) => {
        const x = 520 + (i % 6) * 150 + (hash(i, 2) - 0.5) * 60, y = 480 + Math.floor(i / 6) * 120 + (hash(i, 3) - 0.5) * 40;
        return <Virion key={i} x={x + Math.sin(reloj / 700 + i) * 6} y={y + Math.cos(reloj / 800 + i) * 6} k={0.3} tono={TON[i % 6]} o={tramo(p('nube'), (i / 22) * 0.6, (i / 22) * 0.6 + 0.4)} reloj={reloj + i * 100} />;
      })}
      <Bandera x={900} y={845} txt="una cuasiespecie: una nube de variantes" color={P.hla[0]} p={p('cuasi')} t={30} punta="no" />
      <Txt x={1380} y={560} txt="bajo la presión de un fármaco" t={24} p={p('farmaco')} />
      <Txt x={1380} y={605} txt="la resistencia aparece rápido" t={26} p={p('resistencia')} color={TXV.sangre} />
      {/* los ocho huecos, que se llenarán en el capítulo 12 */}
      {Array.from({ length: 8 }, (_, i) => <Hueco key={i} x={130 + i * 190} y={1000 - 70} k={0.6} p={tramo(p('huecos'), i * 0.08, i * 0.08 + 0.4)} brilla={Math.sin(reloj / 300 + i)} />)}
      <Txt x={800} y={780} txt="en el capítulo 12 llenamos estos 8 huecos con fármacos" t={30} p={p('capitulo')} color={TXV.violeta} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Union, Fusion, TranscripcionInversa, CapsideNucleo, Integracion, TranscripcionTraduccion, Gemacion, Maduracion, FabricaErrores];
export default LAMINAS;
