'use client';
// Capítulo 0 · ¿Por qué se vuelve amarillo? (vistazo gratis)

import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Cerebro, Escudo, Estacion, Flecha, Flota, Frasco, Gota, Hematie, Higado, Intestino, Macrofago, Moreton, Radical, Sale, Tetrapirrol, TuboOrina, Txt, TXB, Vagon, Via, clamp, easeOut, lerp, tramo } from '../Piezas';

/** Las tres moléculas de la cadena del color, en fila: hemo → biliverdina → bilirrubina. */
function Cadena({ y, hemo, verde, amarilla, reloj }: { y: number; hemo: number; verde: number; amarilla: number; reloj: number }) {
  return (
    <g>
      <Sale p={hemo} x={330} y={y} k={0.62}><Tetrapirrol abre={0} fe={1} tono={B.hemo} vibra={reloj} /></Sale>
      <Txt x={330} y={y + 105} txt="hemo" t={28} p={hemo} color={TXB.hemo} />
      <Flecha a={[440, y]} b={[650, y]} p={verde} color="var(--cit-flecha)" w={8} />
      <Sale p={verde} x={800} y={y} k={0.58}><Tetrapirrol abre={1} tono={B.biliverdina} vibra={reloj + 400} /></Sale>
      <Txt x={800} y={y + 105} txt="biliverdina" t={28} p={verde} color={TXB.verde} />
      <Flecha a={[950, y]} b={[1140, y]} p={amarilla} color="var(--cit-flecha)" w={8} />
      <Sale p={amarilla} x={1290} y={y} k={0.58}><Tetrapirrol abre={1} plegada={0.25} tono={B.bilirrubina} vibra={reloj + 800} /></Sale>
      <Txt x={1290} y={y + 105} txt="bilirrubina" t={28} p={amarilla} color={TXB.ambar} />
    </g>
  );
}

const ElMoreton: Lamina = ({ p, reloj }) => {
  const fase = easeOut(p('verde')) + easeOut(p('amarillo'));
  return (
    <g>
      <Sale p={p('piel')} x={800} y={300} k={1.05}><Moreton fase={fase} reloj={reloj} /></Sale>
      <Bandera x={420} y={110} txt="día 1: rojo violeta" color="#8A2A9A" p={p('piel')} t={26} />
      <Bandera x={800} y={110} txt="días después: verde" color="#2E8A3E" p={p('verde')} t={26} />
      <Bandera x={1190} y={110} txt="al final: amarillo" color="#C98A00" p={p('amarillo')} t={26} />
      <Txt x={800} y={520} txt="una reacción química, debajo de la piel" t={32} p={p('reaccion')} />
      <Cadena y={760} hemo={p('hemo')} verde={p('biliverdina')} amarilla={p('bilirrubina')} reloj={reloj} />
    </g>
  );
};

const TresColores: Lamina = ({ p, reloj }) => {
  const m = p('molecula');
  return (
    <g>
      <Flota x={330} y={560} rl={reloj} k={1.05} o={tramo(p('bilis'), 0, 0.4)}><Gota tono={B.bilis} /></Flota>
      <Txt x={330} y={730} txt="bilis" t={32} p={p('bilis')} color={TXB.limon} />
      <Txt x={330} y={775} txt="amarillo verdosa" t={24} p={p('bilis')} fuerte={false} />
      <Flota x={800} y={560} rl={reloj} fase={1.2} k={1.1} o={tramo(p('heces'), 0, 0.4)}><Frasco tono={B.estercobilina as unknown as string[]} /></Flota>
      <Txt x={800} y={730} txt="heces" t={32} p={p('heces')} color={TXB.marron} />
      <Txt x={800} y={775} txt="estercobilina: marrón" t={24} p={p('ester')} fuerte={false} />
      <Flota x={1270} y={540} rl={reloj} fase={2.3} k={0.62} alto={190} o={tramo(p('orina'), 0, 0.4)}><TuboOrina /></Flota>
      <Txt x={1270} y={730} txt="orina" t={32} p={p('orina')} color={TXB.ambar} />
      <Txt x={1270} y={775} txt="urobilina: amarilla" t={24} p={p('uro')} fuerte={false} />
      <Sale p={m} x={800} y={200} k={0.62}><Tetrapirrol abre={1} plegada={0.25} tono={B.bilirrubina} vibra={reloj} /></Sale>
      <Flecha a={[700, 250]} b={[400, 430]} c={[520, 300]} p={tramo(m, 0.2, 0.7)} color="var(--cit-flecha)" w={7} />
      <Flecha a={[800, 300]} b={[800, 420]} p={tramo(m, 0.3, 0.8)} color="var(--cit-flecha)" w={7} />
      <Flecha a={[900, 250]} b={[1200, 420]} c={[1080, 300]} p={tramo(m, 0.4, 0.9)} color="var(--cit-flecha)" w={7} />
      <Bandera x={800} y={80} txt="una misma molécula: la bilirrubina" color="#C46A00" p={m} t={28} punta="no" />
      <Txt x={800} y={900} txt="tres colores, tres parientes" t={30} p={p('parientes')} />
    </g>
  );
};

/** Ojo con la esclera teñida de amarillo (ictericia). */
function Ojo({ x, y, k = 1, amarillo = 0 }: { x: number; y: number; k?: number; amarillo: number }) {
  const esclera = amarillo > 0 ? `rgb(${255},${Math.round(lerp(250, 214, amarillo))},${Math.round(lerp(245, 90, amarillo))})` : '#FFFAF5';
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <path d="M-110,0 Q0,-86 110,0 Q0,86 -110,0 Z" fill="#B5734F" />
      <path d="M-96,0 Q0,-72 96,0 Q0,72 -96,0 Z" fill={esclera} />
      <circle r={40} fill="#3E7A3A" /><circle r={20} fill="#1A1030" /><circle cx={-12} cy={-12} r={8} fill="#FFF" />
    </g>
  );
}

const DosCaras: Lamina = ({ p, reloj }) => {
  const izq = p('toxica'), der = p('protege');
  return (
    <g>
      <Bandera x={800} y={90} txt="¿un simple desecho?" color="#6A4A5E" p={p('basura')} t={28} punta="no" />
      <circle cx={420} cy={520} r={300 * easeOut(clamp(izq))} fill="#E3203F" opacity={0.1} />
      <circle cx={1180} cy={520} r={300 * easeOut(clamp(der))} fill="#2FC45A" opacity={0.1} />
      <Sale p={p('basura')} x={800} y={500} k={0.75}><Tetrapirrol abre={1} plegada={0.25} tono={B.bilirrubina} vibra={reloj} /></Sale>
      <Txt x={420} y={250} txt="en exceso, tóxica" t={32} p={izq} color={TXB.hemo} />
      <Sale p={p('ictericia')} x={300} y={460} k={0.8}><Ojo x={0} y={0} amarillo={p('ictericia')} /></Sale>
      <Txt x={300} y={580} txt="ictericia" t={28} p={p('ictericia')} />
      <Sale p={p('kern')} x={540} y={700} k={0.75}><Cerebro sangra={0} /><circle cx={-10} cy={10} r={40 * p('kern')} fill={B.bilirrubina[1]} opacity={0.7} /></Sale>
      <Txt x={540} y={850} txt="kernícterus" t={28} p={p('kern')} />
      <Txt x={1180} y={250} txt="también protege" t={32} p={der} color={TXB.verde} />
      <Flota x={1060} y={470} rl={reloj} k={0.95} o={tramo(p('antiox'), 0, 0.4)}><Escudo /></Flota>
      {[0, 1, 2].map((i) => {
        const q = tramo(p('antiox'), 0.2 + i * 0.15, 0.8);
        return <Radical key={i} x={940 - 30 * i + Math.sin(reloj / 300 + i) * 10} y={380 + i * 70} k={0.8} o={q * (1 - 0.6 * q)} reloj={reloj} fase={i} />;
      })}
      <Txt x={1060} y={640} txt="antioxidante" t={28} p={p('antiox')} />
      {[0, 1, 2].map((i) => {
        const u = ((reloj / 1400 + i / 3) % 1);
        return <circle key={i} cx={1330} cy={500} r={40 + u * 110} fill="none" stroke="#2E78F2" strokeWidth={8} opacity={(1 - u) * p('senal')} />;
      })}
      <Sale p={p('senal')} x={1330} y={500} k={0.5}><Tetrapirrol abre={1} plegada={0.25} tono={B.bilirrubina} /></Sale>
      <Txt x={1330} y={700} txt="una señal" t={28} p={p('senal')} />
      <Bandera x={800} y={920} txt="una molécula con dos caras" color="#B8237A" p={p('caras')} t={30} punta="no" />
    </g>
  );
};

/** Las cinco estaciones del viaje (también es la portada). */
const ESTACIONES = [
  { x: 210, nombre: '1 · macrófago', color: '#D7263D' },
  { x: 510, nombre: '2 · sangre y albúmina', color: '#2E78F2' },
  { x: 800, nombre: '3 · hígado', color: '#C2307A' },
  { x: 1090, nombre: '4 · intestino', color: '#0C9E9A' },
  { x: 1390, nombre: '5 · heces y orina', color: '#8B5A2B' },
];

export function Viaje({ p, reloj, luces }: { p: (n: string) => number; reloj: number; luces: number[] }) {
  const tren = p('tren');
  // El vagón avanza hasta la última estación encendida, y se mece en ella.
  const hasta = luces.reduce((a, v) => a + easeOut(clamp(v)), 0);
  const xs = ESTACIONES.map((e) => e.x);
  const i = Math.min(4, Math.floor(hasta));
  const xv = hasta <= 1 ? lerp(60, xs[0], hasta) : hasta >= 5 ? xs[4] : lerp(xs[i - 1], xs[i], hasta - i);
  const iconos = [
    <Macrofago key="m" k={0.55} />,
    <g key="a"><Albumina k={0.85} reloj={reloj} /><Tetrapirrol y={-48} k={0.3} plegada={0.6} /></g>,
    <Higado key="h" k={0.38} corte={false} />,
    <Intestino key="i" k={0.62} />,
    <g key="s"><Frasco x={-46} y={6} k={0.55} tono={B.estercobilina as unknown as string[]} /><TuboOrina x={50} y={0} k={0.4} /></g>,
  ];
  return (
    <g>
      <Via x0={60} x1={1540} y={690} tramos={ESTACIONES.map((e) => e.color)} p={tren} />
      {ESTACIONES.map((e, j) => (
        <g key={j}>
          <Estacion x={e.x} y={500} color={e.color} p={luces[j]} luz={Math.sin(reloj / 500 + j) * 0.3 + 0.7 * clamp(luces[j])}>{iconos[j]}</Estacion>
          <Bandera x={e.x} y={290} txt={e.nombre} color={e.color} p={luces[j]} t={22} punta="abajo" />
        </g>
      ))}
      <Vagon x={xv} y={650 + Math.sin(reloj / 160) * 2} k={0.7} o={tramo(tren, 0, 0.3)} reloj={reloj} />
    </g>
  );
}

const Mapa: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={110} txt="el viaje de la bilirrubina" color="#C46A00" p={p('tren')} t={32} punta="no" />
    <Viaje p={p} reloj={reloj} luces={[p('e1'), p('e2'), p('e3'), p('e4'), p('e5')]} />
  </g>
);

const LaPregunta: Lamina = ({ p, reloj }) => {
  const zonas = [
    { n: 'antes', x: 330, txt: 'antes del hígado', color: '#D7263D' },
    { n: 'dentro', x: 800, txt: 'dentro del hígado', color: '#C2307A' },
    { n: 'despues', x: 1270, txt: 'después del hígado', color: '#18A34A' },
  ];
  return (
    <g>
      <Bandera x={800} y={110} txt="¿en qué estación se atascó el viaje?" color="#6D3FD8" p={p('pregunta')} t={32} punta="no" />
      <Sale p={p('pregunta')} x={800} y={290} k={0.8}><Ojo x={0} y={0} amarillo={0.6 + Math.sin(reloj / 900) * 0.2} /></Sale>
      {zonas.map((z, i) => (
        <g key={z.n}>
          <circle cx={z.x} cy={640} r={170 * easeOut(clamp(p(z.n)))} fill={z.color} opacity={0.12} />
          <Txt x={z.x} y={840} txt={z.txt} t={30} p={p(z.n)} />
          <Txt x={z.x} y={880} txt={['¿sobra?', '¿falla?', '¿no sale?'][i]} t={24} p={p(z.n)} fuerte={false} />
        </g>
      ))}
      <Sale p={p('antes')} x={330} y={640}>{[[-50, -30, 20], [40, -10, -30], [-10, 50, 60]].map(([x, y, r], i) => <Hematie key={i} x={x} y={y + Math.sin(reloj / 400 + i) * 6} r={r} k={0.8} />)}</Sale>
      <Sale p={p('dentro')} x={800} y={640} k={0.42}><Higado corte={false} /></Sale>
      <Sale p={p('despues')} x={1270} y={640} k={0.75}><Intestino /></Sale>
      <Bandera x={800} y={960} txt="al final vas a poder responderla" color="#C46A00" p={p('responder')} t={26} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [ElMoreton, TresColores, DosCaras, Mapa, LaPregunta];
export default LAMINAS;
