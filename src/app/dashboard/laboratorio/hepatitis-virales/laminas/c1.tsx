'use client';
// Capítulo 1 · Cinco virus, un blanco (vistazo gratis)
//
// Los cinco virus lado a lado con su color y su forma (referencia «virus y células»), repartidos por vías, por quién se queda («varias
// personas paradas»: puntos que se tiñen o se apagan), por vacuna (escudos), por las cifras del mundo («ratio de muerto en población»: la trama
// de puntos sobre azul marino) y el Perú («mapa del mundo»). Todo respira, titila o deriva.

import type { Lamina } from '../Lienzo';
import { Busto, Etiqueta, Cruz, Flecha, Higado, Levita, Nota, Sale, Sombra, Suelo, TXH, Txt, Visto, VirionAE, VirionB, VirionC, VirionD, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo, BolsaSangre, Globo } from '../Piezas';

type P2 = [number, number];

const COL = { a: '#FF8A1E', b: '#2F55E0', c: '#14B870', d: '#8A4FE8', e: '#D4A21E' };

/** Una letra en un círculo de color sólido, con su sombra en media luna. */
function Letra({ x, y, txt, color, p, k = 1 }: { x: number; y: number; txt: string; color: string; p: number; k?: number }) {
  return (
    <Sale p={p} x={x} y={y} k={k}>
      <circle r={36} fill="#000" opacity={0.16} transform="translate(5,7)" />
      <circle r={36} fill={color} />
      <path d="M-24,-14 A28,28 0 0 1 -4,-26" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.45} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 42, fontWeight: 800, fill: '#FFFFFF', fontFamily: 'inherit' }}>{txt}</text>
    </Sale>
  );
}

/** Escudo de la vacuna, con su visto. */
function Escudo({ x, y, k = 1, p, color }: { x: number; y: number; k?: number; p: number; color: string }) {
  return (
    <Sale p={p} x={x} y={y} k={k}>
      <path d="M0,-50 C26,-40 44,-40 50,-34 C50,10 34,40 0,58 C-34,40 -50,10 -50,-34 C-44,-40 -26,-40 0,-50 Z" fill="#000" opacity={0.15} transform="translate(5,7)" />
      <path d="M0,-50 C26,-40 44,-40 50,-34 C50,10 34,40 0,58 C-34,40 -50,10 -50,-34 C-44,-40 -26,-40 0,-50 Z" fill={color} />
      <path d="M-34,-30 C-20,-34 -8,-36 0,-40" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
      <path d="M-20,2 L-6,16 L22,-14" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </Sale>
  );
}

/** Una columna de 20 puntos (la población): se tiñen del color del virus y, al llegar `p`, los que no cronifican se apagan. */
function Poblacion({ x, y, color, cron, p, reloj, sem = 1 }: { x: number; y: number; color: string; cron: number; p: number; reloj: number; sem?: number }) {
  const n = 20, gris = '#C9C0DC';
  const esCron = new Set(Array.from({ length: n }, (_, i) => i).sort((a, b) => hash(a, sem) - hash(b, sem)).slice(0, cron));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const cx = x + (i % 2 ? 24 : -24), cy = y + Math.floor(i / 2) * 44;
        const q = tramo(p, (i % 10) / 14, (i % 10) / 14 + 0.25);
        const col = esCron.has(i) ? mezcla('#F2A2A8', color, q) : mezcla('#F2A2A8', gris, q);
        return (
          <g key={i} transform={`translate(${cx},${cy + 3 * onda(reloj, 2200, i)})`}>
            <circle r={19} fill="#000" opacity={0.12} transform="translate(3,4)" />
            <circle r={19} fill={col} />
            <circle cx={-6} cy={-7} r={5} fill="#FFF" opacity={0.55} />
          </g>
        );
      })}
    </g>
  );
}

/** Perfil del Perú (lon, lat proyectadas a una caja de ≈ 125 × 183) y su selva. */
const PERU = 'M17,34 L8,44 L7,50 L10,60 L21,69 L34,91 L48,120 L58,137 L68,153 L93,166 L107,176 L116,184 L125,176 L130,164 L124,152 L129,136 L131,126 L124,110 L105,100 L88,94 L91,80 L83,73 L80,59 L90,43 L120,42 L118,35 L84,18 L67,1 L42,9 L36,28 L27,41 Z';
const SELVA = 'M36,28 L42,9 L67,1 L84,18 L118,35 L120,42 L90,43 L80,59 L83,73 L91,80 L88,94 L105,100 L124,110 L131,126 L125,131 L105,130 L85,122 L70,110 L58,93 L48,75 L41,55 L37,39 Z';

// ─── 0 · Cinco letras, cinco virus ──────────────────────────────────────────
const CincoLetras: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), ninguno = p('ninguno'), ae = p('ae'), b = p('b'), c = p('c'), d = p('d'), higado = p('higado');
  const X = [185, 500, 815, 1130, 1445];
  const flotan = (i: number, q: number, k: number, hijo: React.ReactNode) => <Levita key={i} x={X[i]} y={430} reloj={reloj} k={k} p={q} suelo={150} ancho={200} fase={i * 0.9}>{hijo}</Levita>;
  return (
    <g>
      <Globo x={800} y={110} txt="¿cuántos parientes tienen?" t={36} p={pregunta} colaX={0} />
      {flotan(0, ae, 2.0, <VirionAE tipo="a" reloj={reloj} fase={0} />)}
      {flotan(1, b, 1.45, <VirionB reloj={reloj} fase={1} />)}
      {flotan(2, c, 1.65, <VirionC reloj={reloj} fase={2} lipo={tramo(c, 0.4, 1)} />)}
      {flotan(3, d, 2.1, <VirionD reloj={reloj} fase={3} abrigo={tramo(d, 0.3, 1)} />)}
      {flotan(4, ae, 2.0, <VirionAE tipo="e" reloj={reloj} fase={4} />)}
      <Letra x={X[0]} y={680} txt="A" color={COL.a} p={ae} />
      <Letra x={X[1]} y={680} txt="B" color={COL.b} p={b} />
      <Letra x={X[2]} y={680} txt="C" color={COL.c} p={c} />
      <Letra x={X[3]} y={680} txt="D" color={COL.d} p={d} />
      <Letra x={X[4]} y={680} txt="E" color={COL.e} p={ae} />
      <Txt x={X[0]} y={752} txt="ARN · desnudo" t={26} p={ae} />
      <Txt x={X[1]} y={752} txt="ADN circular" t={26} p={b} />
      <Txt x={X[2]} y={752} txt="ARN · con envoltura" t={26} p={c} />
      <Txt x={X[3]} y={752} txt="ARN circular + abrigo" t={26} p={d} />
      <Txt x={X[4]} y={752} txt="ARN · desnudo" t={26} p={ae} />
      <Sale p={ninguno} x={680} y={210} k={1}><text textAnchor="middle" dy="0.36em" style={{ fontSize: 120, fontWeight: 800, fill: 'var(--hv-sangre)' }}>≠</text></Sale>
      <Sale p={higado} x={800} y={900} k={0.42}><Higado corte={false} /></Sale>
      {X.map((x, i) => <Flecha key={i} a={[x, 780]} b={[800 + (x - 800) * 0.34, 860]} c={[x, 835]} p={tramo(higado, 0.1 + i * 0.05, 0.8)} color="var(--cit-flecha)" w={5} />)}
      <Txt x={1300} y={900} txt="comparten el hígado" t={32} p={higado} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Por dónde entran ───────────────────────────────────────────────────
const PorDonde: Lamina = ({ p, reloj }) => {
  const fecal = p('fecal'), agua = p('agua'), alimentos = p('alimentos'), sangre = p('sangre'), liquidos = p('liquidos'), madre = p('madre'), delta = p('delta'), mundos = p('mundos');
  return (
    <g>
      <Etiqueta x={400} y={110} txt="A y E · vía fecal-oral" color="#D4871E" p={fecal} t={32} punta="abajo" />
      <Etiqueta x={1200} y={110} txt="B, C y D · sangre y otros líquidos" color="#2F55E0" p={sangre} t={32} punta="abajo" />
      {/* agua y alimento contaminados */}
      <Levita x={250} y={380} reloj={reloj} k={1.2} p={agua} suelo={130} ancho={120} fase={0.4}>
        <path d="M-54,-70 L54,-70 L40,76 Q38,90 24,90 L-24,90 Q-38,90 -40,76 Z" fill="#8EC8F0" />
        <path d="M-50,-30 Q-25,-44 0,-30 T50,-30 L40,76 Q38,90 24,90 L-24,90 Q-38,90 -40,76 Z" fill="#46A0E0" />
        <path d="M-40,-62 L-30,70" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
        {[0, 1, 2].map((i) => <VirionAE key={i} x={-18 + i * 18 + 4 * onda(reloj, 1500, i)} y={20 + 14 * onda(reloj, 1900, i)} k={0.2} tipo={i % 2 ? 'e' : 'a'} reloj={reloj} fase={i} />)}
      </Levita>
      <Levita x={520} y={400} reloj={reloj} k={1.2} p={alimentos} suelo={110} ancho={140} fase={1.4}>
        <ellipse rx={78} ry={24} fill="#F4EAFF" /><ellipse cx={-4} cy={-6} rx={72} ry={20} fill="#FFFFFF" />
        <circle cx={-26} cy={-26} r={26} fill="#E5324C" /><circle cx={14} cy={-30} r={22} fill="#3FD467" /><circle cx={44} cy={-20} r={16} fill="#FFB21E" />
        {[0, 1].map((i) => <VirionAE key={i} x={-10 + i * 40} y={-30} k={0.18} tipo="a" reloj={reloj} fase={i * 2} />)}
      </Levita>
      {/* sangre y líquidos, de la madre al bebé */}
      <Levita x={1030} y={390} reloj={reloj} k={1.15} p={sangre} suelo={140} ancho={110} fase={2}><BolsaSangre /></Levita>
      <Levita x={1230} y={400} reloj={reloj} k={1.6} p={liquidos} suelo={120} ancho={100} fase={0.8}>
        <path d="M0,-70 C34,-24 52,0 52,28 A52,52 0 0 1 -52,28 C-52,0 -34,-24 0,-70 Z" fill="#9E0B2E" /><path d="M-2,-62 C28,-22 44,0 44,26 A44,44 0 0 1 -44,26 C-44,0 -28,-22 -2,-62 Z" fill="#E3203F" />
        <circle cx={-18} cy={10} r={9} fill="#FFF" opacity={0.7} />
      </Levita>
      <Sombra><Sale p={madre} x={1420} y={430} k={0.36}><Busto quien="madre" reloj={reloj} fase={0.6} sonrisa={0.6} /></Sale></Sombra>
      <Sale p={madre} x={1530} y={500} k={0.6}>
        <circle r={44} fill="#C78462" /><circle cx={-3} cy={-3} r={41} fill="#E2A887" /><circle cx={-16} cy={0} r={5} fill="#2A1250" /><circle cx={14} cy={0} r={5} fill="#2A1250" /><path d="M-10,18 Q0,24 10,18" fill="none" stroke="#A31472" strokeWidth={5} strokeLinecap="round" />
      </Sale>
      <Flecha a={[1450, 540]} b={[1510, 545]} c={[1480, 590]} p={madre} color="var(--cit-flecha)" w={6} />
      <Nota x={1400} y={650} txt="B y C: de madre a hijo" p={madre} />
      <Etiqueta x={1150} y={690} txt="D solo con B" color="#8A4FE8" p={delta} t={28} punta="arriba" />
      {/* las dos rutas llegan al hígado */}
      <Sale p={mundos} x={800} y={850} k={0.5}><Higado corte={false} /></Sale>
      <Flecha a={[400, 620]} b={[690, 810]} c={[420, 760]} p={tramo(mundos, 0, 0.7)} color="#D4871E" w={9} />
      <Flecha a={[1200, 700]} b={[920, 820]} c={[1100, 810]} p={tramo(mundos, 0, 0.7)} color="#2F55E0" w={9} />
      <Txt x={800} y={960} txt="dos rutas, dos mundos" t={30} p={mundos} />
    </g>
  );
};

// ─── 2 · Quién se queda ─────────────────────────────────────────────────────
const QuienSeQueda: Lamina = ({ p, reloj }) => {
  const ae = p('ae'), bebes = p('bebes'), adultos = p('adultos'), c = p('c'), d = p('d');
  const cols: { x: number; col: string; letra: string; txt: string; cron: number; q: number }[] = [
    { x: 190, col: COL.a, letra: 'A·E', txt: 'se curan', cron: 0, q: ae },
    { x: 510, col: COL.b, letra: 'B', txt: 'bebés: ≈ 95 %', cron: 19, q: bebes },
    { x: 830, col: COL.b, letra: 'B', txt: 'adultos: < 5 %', cron: 1, q: adultos },
    { x: 1150, col: COL.c, letra: 'C', txt: '≈ 70 %', cron: 14, q: c },
    { x: 1470, col: COL.d, letra: 'D', txt: 'sobre un B crónico', cron: 20, q: d },
  ];
  return (
    <g>
      {cols.map((cl, i) => (
        <g key={i}>
          <Letra x={cl.x} y={150} txt={cl.letra} color={cl.col} p={cl.q} k={0.9} />
          <Poblacion x={cl.x} y={250} color={cl.col} cron={cl.cron} p={cl.q} reloj={reloj} sem={i + 1} />
          <Txt x={cl.x} y={760} txt={cl.txt} t={30} p={cl.q} color={cl.col === COL.a ? TXH.a : cl.col === COL.b ? TXH.b : cl.col === COL.c ? TXH.c : TXH.d} />
        </g>
      ))}
      <Txt x={800} y={880} txt="los puntos de color son los que se quedan: infección crónica" t={28} p={tramo(c, 0.4, 1)} fuerte={false} />
    </g>
  );
};

// ─── 3 · Quién tiene vacuna ─────────────────────────────────────────────────
const QuienVacuna: Lamina = ({ p, reloj }) => {
  const a = p('a'), b = p('b'), delta = p('delta'), c = p('c'), peru = p('peru'), nacer = p('nacer');
  const X = [200, 520, 840, 1160, 1480];
  return (
    <g>
      <Levita x={X[0]} y={300} reloj={reloj} k={1.2} p={tramo(a, 0, 0.4)} suelo={100} ancho={120} fase={0}><VirionAE tipo="a" reloj={reloj} /></Levita>
      <Levita x={X[1]} y={300} reloj={reloj} k={0.95} p={tramo(b, 0, 0.4)} suelo={110} ancho={140} fase={1}><VirionB reloj={reloj} /></Levita>
      <Levita x={X[2]} y={300} reloj={reloj} k={1.1} p={tramo(c, 0, 0.4)} suelo={110} ancho={130} fase={2}><VirionC reloj={reloj} /></Levita>
      <Levita x={X[3]} y={300} reloj={reloj} k={1.3} p={tramo(delta, 0, 0.4)} suelo={100} ancho={120} fase={3}><VirionD reloj={reloj} /></Levita>
      <Letra x={X[0]} y={470} txt="A" color={COL.a} p={a} k={0.8} />
      <Letra x={X[1]} y={470} txt="B" color={COL.b} p={b} k={0.8} />
      <Letra x={X[2]} y={470} txt="C" color={COL.c} p={c} k={0.8} />
      <Letra x={X[3]} y={470} txt="D" color={COL.d} p={delta} k={0.8} />
      <Escudo x={X[0]} y={600} k={1} p={a} color="#FF8A1E" />
      <Escudo x={X[1]} y={600} k={1} p={b} color="#2F55E0" />
      <Sale p={c} x={X[2]} y={600} k={1}><Cruz /></Sale>
      <Txt x={X[2]} y={690} txt="sin vacuna" t={30} p={c} color={TXH.sangre} />
      <g opacity={0.55}><Escudo x={X[3]} y={600} k={1} p={delta} color="#8A4FE8" /></g>
      <Txt x={X[3]} y={690} txt="protegido por la del B" t={26} p={delta} color={TXH.d} />
      <Txt x={X[0]} y={690} txt="1 dosis" t={30} p={peru} color={TXH.a} />
      <Etiqueta x={X[0]} y={790} txt="a los 15 meses" color="#FF8A1E" p={peru} t={28} punta="arriba" />
      <Etiqueta x={X[1]} y={790} txt="al nacer" color="#2F55E0" p={nacer} t={28} punta="arriba" />
      <Sale p={peru} x={1480} y={470} k={0.9}>
        <rect x={-88} y={-44} width={176} height={88} rx={14} fill="#000" opacity={0.15} transform="translate(5,7)" /><rect x={-88} y={-44} width={176} height={88} rx={14} fill="#D9344F" stroke="#CFC6E2" strokeWidth={3} />
        <rect x={-88} y={-44} width={58} height={88} rx={14} fill="#FFFFFF" opacity={0.95} /><rect x={30} y={-44} width={58} height={88} rx={14} fill="#FFFFFF" opacity={0.95} /><rect x={-58} y={-44} width={30} height={88} fill="#D9344F" />
        <rect x={28} y={-44} width={30} height={88} fill="#D9344F" />
      </Sale>
      <Txt x={1480} y={560} txt="Perú" t={30} p={peru} />
    </g>
  );
};

// ─── 4 · El tamaño del problema ─────────────────────────────────────────────
const Cifras: Lamina = ({ p, reloj }) => {
  const be = p('be'), ce = p('ce'), muertes = p('muertes'), trat = p('tratamiento'), silenciosa = p('silenciosa');
  const N = 100;
  return (
    <g>
      {/* la trama de puntos de la referencia «ratio de muerto en población» */}
      <rect x={60} y={90} width={860} height={820} rx={34} fill="#000" opacity={0.18} transform="translate(8,10)" />
      <rect x={60} y={90} width={860} height={820} rx={34} fill="#0B0B4A" />
      <text x={100} y={150} style={{ fontSize: 30, fontWeight: 800, fill: '#8FB0FF' }}>personas con hepatitis crónica (2024)</text>
      {Array.from({ length: N }, (_, i) => {
        const cx = 130 + (i % 10) * 78, cy = 230 + Math.floor(i / 10) * 66;
        const esB = i < 84, qB = tramo(be, i / 120, i / 120 + 0.25), qC = tramo(ce, (i - 84) / 40, (i - 84) / 40 + 0.4);
        const col = esB ? (qB > 0.3 ? '#2F55E0' : '#3A2A9A') : (qC > 0.3 ? '#14B870' : '#3A2A9A');
        const glow = esB ? qB : qC;
        return (
          <g key={i} transform={`translate(${cx},${cy + 2.5 * onda(reloj, 2400, i)})`}>
            <circle r={21} fill={col} opacity={0.35 + 0.65 * glow} />
            {glow > 0.3 && <circle r={9} fill="#FFFFFF" opacity={0.6 * glow} />}
          </g>
        );
      })}
      <text x={110} y={880} style={{ fontSize: 26, fontWeight: 700, fill: '#B7A0F5' }}>cada punto ≈ 2,9 millones de personas</text>
      {/* las cifras */}
      <Txt x={1230} y={170} txt="240 millones" t={74} p={be} color={TXH.b} />
      <Txt x={1230} y={232} txt="con hepatitis B crónica" t={28} p={be} fuerte={false} />
      <Txt x={1230} y={340} txt="47 millones" t={74} p={ce} color={TXH.c} />
      <Txt x={1230} y={402} txt="con hepatitis C crónica" t={28} p={ce} fuerte={false} />
      <Txt x={1230} y={530} txt="> 1,3 millones" t={70} p={muertes} color={TXH.sangre} />
      <Txt x={1230} y={590} txt="de muertes al año: cirrosis y cáncer" t={28} p={muertes} fuerte={false} />
      {/* solo el 4,3 % de los B crónicos se trata */}
      <g opacity={tramo(trat, 0, 0.4)}>
        <rect x={1020} y={700} width={420} height={56} rx={28} fill="#000" opacity={0.12} transform="translate(5,7)" />
        <rect x={1020} y={700} width={420} height={56} rx={28} fill="#FFF" opacity={0.3} />
        <rect x={1020} y={700} width={Math.max(16, 420 * 0.043 * 1.0 * easeOut(clamp(trat)))} height={56} rx={28} fill="#14B870" />
        <Txt x={1230} y={800} txt="4,3 % de los B crónicos recibe tratamiento" t={28} p={trat} color={TXH.c} />
      </g>
      <Etiqueta x={1230} y={900} txt="una epidemia silenciosa" color="#8A3FD8" p={silenciosa} t={32} punta="no" />
    </g>
  );
};

// ─── 5 · Y en el Perú ───────────────────────────────────────────────────────
const EnElPeru: Lamina = ({ p, reloj }) => {
  const mapa = p('mapa'), amazonia = p('amazonia'), huanta = p('huanta'), genF = p('genf'), vacuna = p('vacuna'), escenario = p('escenario');
  const MX = 300, MY = 110, MS = 3.85;
  const pulso = 0.5 + 0.5 * onda(reloj, 1300, 0);
  return (
    <g>
      <g transform={`translate(${MX},${MY}) scale(${MS})`} opacity={tramo(mapa, 0, 0.4)}>
        <path d={PERU} fill="#000" opacity={0.16} transform="translate(1.2,1.6)" />
        <path d={PERU} fill="#E8B896" />
        <path d={SELVA} fill="#3FD467" opacity={0.55 + 0.4 * tramo(amazonia, 0, 1)} />
        <path d={SELVA} fill="none" stroke="#138A3A" strokeWidth={0.9} strokeDasharray="2 3" opacity={tramo(amazonia, 0, 1)} />
      </g>
      <Etiqueta x={1090} y={250} txt="Amazonía: hiperendémica de B y D" color="#138A3A" p={amazonia} t={30} punta="izq" />
      {/* Huanta */}
      <g opacity={tramo(huanta, 0, 0.4)}>
        <circle cx={MX + 77.5 * MS} cy={MY + 129.4 * MS} r={16 + 12 * pulso} fill="#8A4FE8" opacity={0.35} />
        <circle cx={MX + 77.5 * MS} cy={MY + 129.4 * MS} r={11} fill="#8A4FE8" /><circle cx={MX + 77.5 * MS - 3} cy={MY + 129.4 * MS - 3} r={3.4} fill="#FFF" opacity={0.85} />
      </g>
      <Etiqueta x={1040} y={620} txt="Huanta: delta genotipo 3" color="#8A4FE8" p={huanta} t={30} punta="izq" />
      <Sale p={genF} x={1080} y={830} k={1.1}><VirionB reloj={reloj} /></Sale>
      <Txt x={1080} y={950} txt="VHB genotipo F · dato preliminar" t={28} p={genF} color={TXH.b} />
      <Escudo x={1400} y={780} k={1} p={vacuna} color="#2F55E0" />
      <Txt x={1400} y={880} txt="vacuna del B al nacer" t={28} p={vacuna} color={TXH.b} />
      <Sale p={escenario} x={1290} y={420} k={0.6}><Higado corte={false} /></Sale>
      <Txt x={1290} y={540} txt="ahora, el escenario: el hígado" t={30} p={escenario} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [CincoLetras, PorDonde, QuienSeQueda, QuienVacuna, Cifras, EnElPeru];
export default LAMINAS;
