'use client';
// Capítulo 7 · PTI: cuatro formas de destruir.

import type { Lamina } from '../Lienzo';
import { Bazo, C, Chorro, En, Esfera, FcR, Flecha, Hematie, Hepatocito, Linfocito, MAC, Macrofago, Plaqueta, Plasmatica, Rotulo, Sale, Txt, Vaso, clamp, easeOut, enBorde, hash, lerp, tramo } from '../Piezas';
import { Cruz, FLECHA, Lente, PlaquetaIg, viaje } from './Comun';

/** Plaqueta que se rompe: `p` de 0 a 1. */
function PlaquetaRota({ x, y, k = 1, p }: { x: number; y: number; k?: number; p: number }) {
  if (p <= 0) return <PlaquetaIg x={x} y={y} k={k} n={4} />;
  return (
    <En x={x} y={y} k={k}>
      <En o={1 - tramo(p, 0.2, 0.6)} k={1 + 0.2 * tramo(p, 0, 0.4)}><Plaqueta /></En>
      {p > 0.2 && Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * 6.28 + hash(i, 3), d = 18 + 50 * easeOut(p) * (0.5 + hash(i, 5));
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={4 + hash(i, 6) * 5} fill={i % 2 ? C.plaq[1] : C.plaq[2]} opacity={1 - tramo(p, 0.7, 1) * 0.6} />;
      })}
    </En>
  );
}

const Complemento: Lamina = ({ p, reloj }) => {
  const mac = p('mac'), rompe = p('rompe');
  return (
    <g>
      <Rotulo x={320} y={80} txt="Primera forma: en la sangre" color={C.rojo[1]} p={p('titulo')} t={30} />
      <Vaso x={800} y={470} w={1700} h={500} flujo={6} reloj={reloj} o={p('vaso')}>
        <PlaquetaRota x={-230} y={0} k={4.4} p={rompe} />
        {rompe <= 0 && [[-90, 0], [30, 90], [150, -70]].map(([ang, off], i) => {
          const b = enBorde(-230, 0, 120, ang + off * 0.1);
          const q = tramo(mac, i * 0.3, 0.7 + i * 0.3);
          return q > 0 ? <MAC key={i} x={b.x} y={b.y} r={ang + 90} k={1.7 * easeOut(q)} /> : null;
        })}
        <PlaquetaIg x={250} y={-30} k={2.9} n={4} o={p('sobrevive')} />
        {[-40, 80, 200].map((a, i) => { const b = enBorde(250, -30, 90, a); const q = tramo(p('marca'), i * 0.2, 0.6 + i * 0.2); return q > 0 ? <En key={a} x={b.x} y={b.y} k={easeOut(q)}><Esfera R={22} /></En> : null; })}
      </Vaso>
      <Rotulo x={1200} y={80} txt="Vía clásica: en la mitad o más" color={C.c1[1]} p={p('via')} t={28} />
      <Rotulo x={340} y={870} txt="Complejo de ataque: se rompe" color={C.mac[1]} p={mac} t={29} />
      <Rotulo x={1180} y={800} txt="Las que sobreviven: C3b" color={C.c3b[0]} p={p('marca')} t={29} />
      <Txt x={1180} y={885} txt="Listas para lo que viene" t={28} p={p('viene')} />
    </g>
  );
};

const ElMacrofago: Lamina = ({ p }) => {
  const traga = p('traga');
  const pos = viaje([1110, 480], [640, 500], traga);
  return (
    <g>
      <Rotulo x={420} y={80} txt="Segunda forma: la principal" color="#1287B5" p={p('titulo')} t={31} />
      <Sale p={p('macro')} x={560} y={500} k={2.05}><Macrofago /></Sale>
      <En o={1 - tramo(traga, 0.75, 1)}><PlaquetaIg x={pos.x} y={pos.y} k={lerp(3.6, 1.6, traga)} n={3} /></En>
      <En o={1 - tramo(traga, 0.75, 1)}>{p('cr') > 0.01 && <Esfera x={pos.x - 18} y={pos.y + 80 * lerp(1, 0.4, traga)} R={24} />}</En>
      <FcR x={880} y={410} r={70} k={2.2 * clamp(p('fc') * 1.3)} />
      <Rotulo x={1140} y={235} txt="Gancho 1: receptor Fc gamma" color="#F2546B" p={p('fc')} t={27} />
      <Txt x={1140} y={305} txt="Tipos I y III: agarra el anticuerpo" t={25} p={p('tipos')} />
      <FcR x={846} y={598} r={110} k={2.2 * clamp(p('cr') * 1.3)} color={C.verde[1]} />
      <Rotulo x={1030} y={760} txt="Gancho 2: CR1" color={C.verde[0]} p={p('cr')} t={27} />
      <Txt x={1030} y={830} txt="Agarra C3b" t={25} p={p('cr')} />
      <Txt x={1300} y={880} txt="La misma escena de la anemia," t={27} p={p('misma')} />
      <Hematie x={1300} y={800} k={0.8} o={p('misma')} />
      <Txt x={1300} y={925} txt="con otra víctima" t={27} p={p('misma')} />
    </g>
  );
};

const NODOS: [number, number][] = [[800, 200], [1170, 430], [1020, 790], [580, 790], [430, 430]];
const ElCirculo: Lamina = ({ p, reloj }) => {
  const gira = p('gira');
  const orden = ['presenta', 'ayuda', 'celb', 'ac', 'siguiente'];
  return (
    <g>
      {NODOS.map((a, i) => {
        const b = NODOS[(i + 1) % 5];
        const c: [number, number] = [(a[0] + b[0]) / 2 + (a[1] - b[1]) * -0.12 + (a[0] + b[0] - 1600) * 0.1, (a[1] + b[1]) / 2 + (b[0] - a[0]) * -0.12 + (a[1] + b[1] - 1000) * 0.1];
        return <Flecha key={i} a={[lerp(a[0], b[0], 0.2), lerp(a[1], b[1], 0.2)]} c={c} b={[lerp(a[0], b[0], 0.8), lerp(a[1], b[1], 0.8)]} p={p(orden[i])} color={FLECHA} w={11} />;
      })}
      <Sale p={p('macro')} x={800} y={200} k={0.72}><Macrofago /></Sale>
      <Rotulo x={1090} y={165} txt="Macrófago" color="#1287B5" p={p('macro')} t={26} />
      <Sale p={p('presenta')} x={1170} y={430} k={1.15}><Linfocito tono="t" /></Sale>
      <Rotulo x={1400} y={430} txt="Más ayuda" color="#127CB5" p={p('ayuda')} t={26} />
      <Sale p={p('ayuda')} x={1020} y={790} k={1.15}><Linfocito tono="b" /></Sale>
      <Rotulo x={1250} y={840} txt="Más células B" color={C.igg[0]} p={p('celb')} t={26} />
      <Sale p={p('celb')} x={580} y={790} k={0.95}><Plasmatica /></Sale>
      <Rotulo x={340} y={840} txt="Más anticuerpos" color={C.igg[1]} p={p('ac')} t={26} />
      <Sale p={p('ac')} x={430} y={430} k={3}><PlaquetaIg n={4} /></Sale>
      <Rotulo x={200} y={430} txt="La siguiente" color={C.plaq[1]} p={p('siguiente')} t={26} />
      <En x={800} y={500} o={gira} r={reloj / 22}>
        {[0, 120, 240].map((a) => <path key={a} d="M0,-132 A132,132 0 0 1 114,-66" fill="none" stroke={C.rojo[1]} strokeWidth={16} strokeLinecap="round" transform={`rotate(${a})`} />)}
      </En>
      <Txt x={800} y={500} txt="Se sostiene solo" t={26} p={gira} />
    </g>
  );
};

const CelulaCD8: Lamina = ({ p }) => {
  const dis = p('dispara'), hay = p('demasiadas');
  return (
    <g>
      <Rotulo x={420} y={80} txt="Tercera forma: sin anticuerpos" color="#9358F0" p={p('titulo')} t={30} />
      <Sale p={p('cd8')} x={410} y={430} k={2.3}><Linfocito tono="cd8" /></Sale>
      <Rotulo x={410} y={640} txt="Célula T CD8" color="#6D28D9" p={p('cd8')} t={28} />
      {dis > 0.2 ? <En x={790} y={430} k={3.1} o={1 - tramo(dis, 0.7, 1) * 0.65}><Plaqueta /></En> : <En x={lerp(1000, 790, clamp(p('toca')))} y={430} k={3.1} o={clamp(p('toca') * 2)}><Plaqueta /></En>}
      <Chorro a={[550, 430]} b={[780, 430]} p={dis} color={C.c3b[1]} n={16} R={9} abanico={90} sem={3} />
      <Rotulo x={830} y={200} txt="Granzima y perforina" color={C.c3b[0]} p={dis} t={27} />
      <Sale p={hay} x={1270} y={310}>
        <Linfocito tono="cd8" k={0.5} />
        {Array.from({ length: 40 }, (_, i) => { const a = hash(i, 71) * 6.28, d = 60 + hash(i, 72) * 165; return <Plaqueta key={i} x={Math.cos(a) * d} y={Math.sin(a) * d * 0.85} k={0.42} r={i * 20} />; })}
      </Sale>
      <Txt x={1270} y={560} txt="En la sangre, demasiadas para cada una" t={26} p={hay} />
      <Sale p={p('bazo')} x={1340} y={760} k={0.42}><Bazo corte={false} /></Sale>
      <Rotulo x={1020} y={760} txt="Por eso, en el bazo" color={C.bazo[1]} p={p('bazo')} t={27} />
      <Sale p={p('quitar')} x={410} y={830} k={0.95}><Linfocito tono="b" /></Sale>
      <Cruz x={410} y={830} k={1.15} p={p('quitar')} />
      <Txt x={730} y={830} txt="Quitar células B no resuelve nada" t={28} p={p('quitar')} />
    </g>
  );
};

const Desialilacion: Lamina = ({ p }) => {
  const arr = p('arranca'), cap = p('saca');
  const siálicos = [-70, -30, 15, 60];
  const plaq = viaje([980, 360], [1190, 420], cap);
  return (
    <g>
      <Rotulo x={430} y={70} txt="Cuarta forma: la más sutil" color={C.c1[1]} p={p('titulo')} t={30} />
      <Lente x={430} y={470} R={330} id="c7d" o={p('lente')}>
        <En y={120}>
          <rect x={-340} y={40} width={680} height={280} fill={C.plaq[1]} />
          <rect x={-340} y={40} width={680} height={18} fill={C.plaq[0]} />
          {siálicos.map((ang, i) => {
            const x = -210 + i * 140;
            const q = tramo(arr, i * 0.16, 0.56 + i * 0.16);
            return (
              <g key={ang} transform={`translate(${x},40)`}>
                <rect x={-5} y={-96} width={10} height={98} rx={5} fill={C.plaq[0]} />
                <circle cy={-104} r={18} fill={C.c3b[1]} />
                {q < 1 && <En y={lerp(-138, -300, easeOut(q))} o={1 - q}><circle r={17} fill="#E0339A" /><circle cx={-5} cy={-5} r={5} fill="#FFF" /></En>}
              </g>
            );
          })}
        </En>
        {arr > 0 && arr < 1 && (
          <En x={lerp(-260, 240, arr)} y={-30}>
            <circle r={36} fill={C.igm[1]} /><circle cx={-8} cy={-8} r={10} fill={C.igm[2]} />
            <path d="M18,-18 L48,-34 M18,18 L48,34" stroke={C.igm[0]} strokeWidth={10} strokeLinecap="round" />
          </En>
        )}
      </Lente>
      <Rotulo x={430} y={830} txt="Neuraminidasa arranca el ácido siálico" color="#E0339A" p={p('neura')} t={27} />
      <Rotulo x={430} y={905} txt="Queda la galactosa" color={C.c3b[0]} p={p('gala')} t={29} />
      <Sale p={p('hepa')} x={1190} y={620} k={1.25}><Hepatocito /></Sale>
      <En x={1190} y={490} o={p('hepa')}><rect x={-12} y={-54} width={24} height={60} rx={8} fill="#2DD4BF" /><path d="M-30,-72 Q0,-44 30,-72" fill="none" stroke="#2DD4BF" strokeWidth={15} strokeLinecap="round" /></En>
      <Rotulo x={1400} y={420} txt="Ashwell-Morell" color="#0F9D8F" p={p('recep')} t={26} />
      <En x={plaq.x} y={plaq.y} k={2.3} o={p('hepa') * (1 - tramo(cap, 0.85, 1))}><Plaqueta gp gal={1} /></En>
      <Txt x={1190} y={110} txt="Sin macrófago. Sin Fc gamma" t={31} p={p('sin')} />
      <Sale p={p('nobasta')} x={830} y={830} k={0.3}><Bazo corte={false} /></Sale>
      <Txt x={1200} y={880} txt="Por eso, a veces, sacar el bazo no basta" t={26} p={p('nobasta')} />
    </g>
  );
};

const VIAS: { x: number; y: number; n: string; col: string; peso: [number, number] }[] = [
  { x: 240, y: 220, n: 'Complemento', col: C.mac[1], peso: [5, 15] },
  { x: 1360, y: 220, n: 'Macrófago', col: '#1287B5', peso: [22, 8] },
  { x: 240, y: 780, n: 'Célula T CD8', col: '#9358F0', peso: [7, 22] },
  { x: 1360, y: 780, n: 'Desialilación', col: C.c1[1], peso: [14, 6] },
];
const Sindrome: Lamina = ({ p }) => {
  const pes = p('pesan');
  return (
    <g>
      {VIAS.map((v, i) => (
        <g key={v.n}>
          <Flecha a={[v.x + (v.x < 800 ? 130 : -130), v.y + (v.y < 500 ? 60 : -60)]} b={[v.x < 800 ? 680 : 920, v.y < 500 ? 420 : 580]} p={p('caminos')} color={v.col} w={lerp(11, v.peso[pes > 0.5 ? 1 : 0], tramo(pes, 0, 1))} />
          <Rotulo x={v.x} y={v.y} txt={v.n} color={v.col} p={tramo(p('caminos'), i * 0.1, 0.5 + i * 0.1)} t={29} />
        </g>
      ))}
      <Sale p={p('caminos')} x={800} y={500} k={3.4}><Plaqueta /></Sale>
      <Rotulo x={800} y={70} txt="Un mismo resultado" color="var(--cit-base)" p={p('resultado')} t={33} />
      <Rotulo x={800} y={775} txt="Más un síndrome que una sola enfermedad" color={C.plaq[1]} p={p('sindrome')} t={29} />
      <Txt x={800} y={890} txt="No has fallado: es otro camino" t={36} p={p('fallado')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Complemento, ElMacrofago, ElCirculo, CelulaCD8, Desialilacion, Sindrome];
export default LAMINAS;
