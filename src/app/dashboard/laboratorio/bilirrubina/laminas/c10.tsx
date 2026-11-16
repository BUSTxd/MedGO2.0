'use client';
// Capítulo 10 · Cuando sube la conjugada. El hepatocito con su bomba MRP2 y el canalículo, el hígado negro con
// su zoom, los frascos de coproporfirina por isómeros, la tríada de la colestasis dibujada, las vías biliares con
// lo que las tapa, la vitamina K que no se absorbe, las tres llaves que fallan y la atresia con la operación de Kasai.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { B, Bacilo, Bandera, Cruz, Flecha, Grasa, Hematie, Hepatocito, Jeringa, Pastilla, Poro, Sale, Termometro, Tetrapirrol, Txt, TXB, Vaso, Visto, clamp, easeOut, hash, lerp, mezcla, tramo } from '../Piezas';
import { Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Bebe, Conducto, FrascoOrina, Heces, HigadoB, Llave, Piedra, Sube, TONO_HIGADO, Tubo, TuboSuero, ViasBiliares } from '../Escenas';

type P2 = [number, number];
const MRP2 = ['#C24A00', '#FF8A2B', '#FFD0A0'] as const;
const MRP3 = ['#A3237A', '#F25CA8', '#FFC2DE'] as const;
const COLURIA = '#7A3A0E';
const ACOLIA = '#E2DACB';

function Medalla({ x, y, n, p, color }: { x: number; y: number; n: number; p: number; color: string }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p * 1.3));
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * q})`} opacity={tramo(p, 0, 0.4)}>
      <circle r={28} fill={mezcla(color, '#000000', 0.25)} transform="translate(3,4)" />
      <circle r={28} fill={color} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 30, fontWeight: 800, fill: '#FFF' }}>{n}</text>
    </g>
  );
}

/** Rótulo con su línea guía hasta lo que nombra. */
function Nombre({ x, y, a, txt, p, ancla = 'start', t = 22, color }: { x: number; y: number; a: P2; txt: string; p: number; ancla?: 'start' | 'end'; t?: number; color?: string }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p * 1.4));
  const x0 = x + (ancla === 'start' ? -10 : 10);
  return (
    <g>
      <path d={`M${x0},${y} L${lerp(x0, a[0], q)},${lerp(y, a[1], q)}`} stroke="var(--cit-flecha)" strokeWidth={3} strokeDasharray="6 5" fill="none" />
      <circle cx={a[0]} cy={a[1]} r={7 * q} fill="#FFD23F" stroke="#9E0B2E" strokeWidth={2} />
      <Txt x={x} y={y} txt={txt} t={t} p={p} ancla={ancla} color={color} />
    </g>
  );
}

/** Corte del hepatocito: sinusoide arriba (con su MRP3), célula, y el canalículo a la derecha con las MRP2.
 *  `rota` 0-1 tacha las MRP2; `acumula` 0-1 llena la célula de conjugada; `refluye` 0-1 la manda a la sangre. */
function Celula({ reloj, rota = 0, acumula = 0, refluye = 0, dano = 0, o = 1, x1 = 1180 }: { reloj: number; rota?: number; acumula?: number; refluye?: number; dano?: number; o?: number; x1?: number }) {
  if (o <= 0.002) return null;
  const canal = x1 + 14;
  const bombas = [430, 600, 770];
  const n = Math.round(4 + 14 * clamp(acumula));
  return (
    <g opacity={o}>
      <Vaso x={(x1 + 120) / 2} y={250} largo={x1 + 280} ancho={150} ang={0} reloj={reloj} flujo={6} pared={26} />
      <Hepatocito x0={120} x1={x1} y0={340} y1={880} sem={4} tinte={0.3 * acumula} />
      {/* Canalículo biliar */}
      <rect x={canal} y={330} width={60} height={560} rx={30} fill={B.bilis[0]} />
      <rect x={canal + 6} y={330} width={44} height={560} rx={22} fill={B.bilis[1]} />
      {bombas.map((by, i) => (
        <g key={by}>
          <Poro x={x1 - 6} y={by} k={0.62} r={90} tono={MRP2} roto={rota} bombea={reloj + i * 220} tallo={20} />
          {rota < 0.5 && Array.from({ length: 2 }, (_, j) => {
            const u = (reloj / 1500 + j / 2 + i * 0.2) % 1;
            return <Tetrapirrol key={j} x={lerp(x1 - 120, canal + 30, u)} y={by + lerp(0, 120, tramo(u, 0.5, 1))} k={0.07} colitas={2} tono={B.conjugada} o={tramo(Math.min(u, 1 - u), 0, 0.15)} />;
          })}
        </g>
      ))}
      {/* La conjugada dentro de la célula */}
      {Array.from({ length: n }, (_, i) => (
        <Tetrapirrol key={i} x={220 + hash(i, 51) * (x1 - 380)} y={430 + hash(i, 52) * 360} k={0.08} colitas={2} tono={B.conjugada} vibra={reloj + i * 300} />
      ))}
      {/* MRP3 de la membrana sinusoidal: por ahí refluye */}
      <Poro x={640} y={340} k={0.62} r={180} tono={MRP3} bombea={reloj} tallo={18} o={tramo(refluye, 0, 0.4)} />
      {refluye > 0.01 && Array.from({ length: 3 }, (_, j) => {
        const u = (reloj / 1700 + j / 3) % 1;
        return <Tetrapirrol key={`r${j}`} x={640 + Math.sin(u * 6 + j) * 14} y={lerp(420, 230, u)} k={0.08} colitas={2} tono={B.conjugada} o={refluye * tramo(Math.min(u, 1 - u), 0, 0.15)} />;
      })}
      {/* Daño de la célula: grietas */}
      {dano > 0.01 && <path d="M300,880 L340,800 L310,760 L370,690 M900,340 L880,420 L930,470 L900,540" fill="none" stroke="#5A0A3A" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={clamp(dano)} />}
    </g>
  );
}

const LaFirma: Lamina = ({ p, reloj }) => {
  const mec = p('mecanismos');
  return (
    <g>
      <Bandera x={800} y={50} txt="la otra mitad: sube la conjugada" color="#18A34A" p={p('mitad')} t={28} punta="no" />
      <Sale p={p('firma')} x={1380} y={250} k={0.78}><TuboSuero suero="#F2E23A" /></Sale>
      <Txt x={1380} y={390} txt="directa alta" t={24} p={p('firma')} color={TXB.limon} />
      <Sale p={p('coluria')} x={1380} y={560} k={0.85}><FrascoOrina color={COLURIA} espuma={1} /></Sale>
      <Txt x={1380} y={680} txt="coluria" t={24} p={p('coluria')} color={TXB.marron} />
      <g transform="translate(-60,70) scale(0.86)">
        <Celula reloj={reloj} acumula={0.4 + 0.4 * p('refluye')} refluye={p('refluye')} rota={0} o={tramo(p('firma'), 0, 0.4)} x1={1100} />
        {/* Conducto que sale del canalículo, con el tapón de la colestasis */}
        <g opacity={tramo(mec, 0, 0.4)}>
          <Conducto d="M1144,890 C1144,960 1200,990 1290,990" w={40} />
          <Piedra x={1230} y={985} R={20} tono={['#7A4A10', '#C8902A']} sem={3} o={tramo(p('colestasis'), 0, 0.4)} />
        </g>
      </g>
      <Txt x={540} y={112} txt="se conjugó, pero no sale o refluye" t={26} p={p('refluye')} />
      <Txt x={540} y={150} txt="tres mecanismos" t={24} p={mec} color={TXB.verde} />
      <Medalla x={980} y={460} n={1} p={p('bomba')} color="#C24A00" />
      <Medalla x={1080} y={900} n={2} p={p('colestasis')} color="#6E8A00" />
      <Medalla x={300} y={640} n={3} p={p('dano')} color="#A3237A" />
      <Txt x={560} y={960} txt="1 · la bomba     2 · colestasis     3 · daño hepatocelular" t={24} p={p('dano')} />
    </g>
  );
};

/** Tramo de ADN en el que una base sale en rojo (la mutación). */
function GenMutado({ x, y, p, rotulo }: { x: number; y: number; p: number; rotulo: string }) {
  if (p <= 0.002) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(p, 0, 0.4)}>
      {Array.from({ length: 9 }, (_, i) => {
        const yy = 30 * Math.sin(i * 0.8);
        return <path key={i} d={`M${-160 + i * 40},${-yy} L${-160 + i * 40},${yy}`} stroke={i === 5 ? '#E3203F' : i % 2 ? '#7FE8C6' : '#FF9AD0'} strokeWidth={i === 5 ? 14 : 8} strokeLinecap="round" />;
      })}
      <path d={Array.from({ length: 33 }, (_, i) => `${i ? 'L' : 'M'}${-160 + i * 10},${(30 * Math.sin(i * 0.2)).toFixed(1)}`).join(' ')} fill="none" stroke="#5A2DB0" strokeWidth={9} strokeLinecap="round" />
      <path d={Array.from({ length: 33 }, (_, i) => `${i ? 'L' : 'M'}${-160 + i * 10},${(-30 * Math.sin(i * 0.2)).toFixed(1)}`).join(' ')} fill="none" stroke="#2E78F2" strokeWidth={9} strokeLinecap="round" />
      <text x={0} y={70} textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: 'var(--cit-texto)' }}>{rotulo}</text>
    </g>
  );
}

const Dubin: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="síndrome de Dubin-Johnson" color="#18A34A" p={p('dubin')} t={28} punta="no" />
    <g transform="translate(-40,40) scale(0.9)">
      <Celula reloj={reloj} rota={p('mrp2')} acumula={p('acumula')} refluye={p('acumula')} o={tramo(p('bomba'), 0, 0.4)} />
    </g>
    <Txt x={500} y={180} txt="vuelve a la sangre" t={24} p={p('acumula')} color="#FFFFFF" />
    <Txt x={580} y={840} txt="la conjugada se acumula" t={26} p={p('acumula')} color="#FFFFFF" />
    <Txt x={1440} y={290} txt="falla la bomba MRP2" t={26} p={p('mrp2')} color={TXB.ambar} />
    <GenMutado x={1400} y={470} p={p('gen')} rotulo="mutación en ABCC2" />
    <Visto x={1340} y={720} k={1.1} o={p('benigno')} />
    <Txt x={1390} y={720} txt="y aun así," t={24} p={p('benigno')} ancla="start" fuerte={false} />
    <Txt x={1390} y={760} txt="benigno" t={30} p={p('benigno')} ancla="start" color={TXB.verde} />
  </g>
);

/** Frasco de orina con la coproporfirina en dos capas: isómero I (rojo) y III (violeta). `total` 1 = normal. */
function Coproporfirina({ x, y, total, isoI, p }: { x: number; y: number; total: number; isoI: number; p: number }) {
  if (p <= 0.002) return null;
  const H = 110 * total * easeOut(clamp(p * 1.2)), w = 90;
  const hI = H * isoI;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(p, 0, 0.4)}>
      <rect x={-w / 2 - 10 + 8} y={-H - 24} width={w + 20} height={H + 40} rx={18} fill={B.sombra} />
      <rect x={-w / 2 - 10} y={-H - 30} width={w + 20} height={H + 40} rx={18} fill="#E2EEF6" />
      <rect x={-w / 2} y={-H} width={w} height={H - hI} rx={6} fill="#8A5AF0" />
      <rect x={-w / 2} y={-hI} width={w} height={hI} rx={6} fill="#E3203F" />
      <rect x={-w / 2 + 8} y={-H + 4} width={10} height={H - 8} rx={5} fill="#FFFFFF" opacity={0.45} />
      <rect x={-w / 2 - 16} y={-H - 46} width={w + 32} height={24} rx={8} fill="#F2B21E" />
    </g>
  );
}

const HigadoNegro: Lamina = ({ p, reloj }) => {
  const neg = p('negro');
  return (
    <g>
      <Bandera x={800} y={50} txt="el hígado negro" color="#2A1E30" p={neg} t={30} punta="no" />
      <Sale p={neg} x={380} y={320} k={0.82}><HigadoB tono={TONO_HIGADO.negro} granos={1} reloj={reloj} /></Sale>
      <path d="M420,380 L400,600" stroke="var(--cit-flecha)" strokeWidth={3} strokeDasharray="6 6" opacity={tramo(p('lisosomas'), 0, 0.5)} />
      <Lente x={380} y={740} R={150} id="dj-lisosomas" o={tramo(p('lisosomas'), 0, 0.5)}>
        <rect x={-200} y={-200} width={400} height={400} fill={B.hepato[1]} />
        <ellipse cx={30} cy={40} rx={70} ry={54} fill="#4A1060" /><ellipse cx={22} cy={32} rx={54} ry={38} fill="#7A2A9A" />
        {Array.from({ length: 14 }, (_, i) => <g key={i}><circle cx={-130 + hash(i, 81) * 260} cy={-130 + hash(i, 82) * 120 + (i % 3) * 30} r={14 + hash(i, 83) * 10} fill="#1A0E1E" /><circle cx={-134 + hash(i, 81) * 260} cy={-134 + hash(i, 82) * 120 + (i % 3) * 30} r={5} fill="#5A4A60" /></g>)}
      </Lente>
      <Txt x={380} y={930} txt="pigmento oscuro en los lisosomas" t={24} p={p('lisosomas')} />
      {/* La pista en la orina */}
      <Txt x={1130} y={160} txt="la pista, en la orina: coproporfirina" t={26} p={p('pista')} />
      <Coproporfirina x={960} y={650} total={2.8} isoI={0.25} p={p('normal')} />
      <Coproporfirina x={1300} y={650} total={2.8} isoI={0.84} p={p('ochenta')} />
      <Txt x={960} y={700} txt="lo normal" t={24} p={p('normal')} />
      <Txt x={1300} y={700} txt="Dubin-Johnson" t={24} p={p('ochenta')} />
      <Txt x={1130} y={760} txt="mismo total; más del 80 % es isómero I" t={24} p={p('ochenta')} color={TXB.hemo} />
      <g opacity={tramo(p('normal'), 0, 0.4)}>
        <rect x={1460} y={330} width={30} height={30} rx={8} fill="#E3203F" /><text x={1500} y={346} dy="0.35em" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto)' }}>I</text>
        <rect x={1460} y={380} width={30} height={30} rx={8} fill="#8A5AF0" /><text x={1500} y={396} dy="0.35em" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto)' }}>III</text>
      </g>
      <Bandera x={1130} y={880} txt="la huella de Dubin-Johnson" color="#2A1E30" p={p('huella')} t={26} punta="no" />
    </g>
  );
};

const Rotor: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="Rotor frente a Dubin-Johnson" color="#18A34A" p={p('rotor')} t={30} punta="no" />
    <Sale p={p('rotor')} x={420} y={240} k={0.6}><HigadoB tono={TONO_HIGADO.negro} granos={1} reloj={reloj} /></Sale>
    <Txt x={420} y={370} txt="Dubin-Johnson: hígado negro" t={26} p={p('rotor')} />
    <Sale p={p('color')} x={1180} y={240} k={0.6}><HigadoB reloj={reloj} /></Sale>
    <Txt x={1180} y={370} txt="Rotor: color normal" t={26} p={p('color')} />
    <Coproporfirina x={420} y={820} total={1.1} isoI={0.84} p={p('veces')} />
    <Coproporfirina x={1180} y={820} total={3.3} isoI={0.65} p={p('veces')} />
    <Txt x={420} y={866} txt="coproporfirina total normal" t={22} p={p('veces')} fuerte={false} />
    <Txt x={1180} y={866} txt="total de 2 a 5 veces mayor" t={22} p={p('veces')} fuerte={false} />
    <Flecha a={[1290, 800]} b={[1290, 500]} p={p('veces')} color="#E3203F" w={8} />
    <Visto x={720} y={930} k={1} o={p('benignos')} />
    <Txt x={770} y={930} txt="los dos, benignos" t={26} p={p('benignos')} ancla="start" />
    <Txt x={1040} y={930} txt="· ninguno se trata" t={26} p={p('tratamiento')} ancla="start" color={TXB.verde} />
  </g>
);

/** Antebrazo que se rasca, con los arañazos y los cristales de sales biliares bajo la piel. */
function Prurito({ reloj }: { reloj: number }) {
  const rasca = Math.sin(reloj / 110) * 14;
  return (
    <g>
      <rect x={-150} y={-40} width={300} height={90} rx={45} fill="#C9806A" />
      <rect x={-150} y={-46} width={294} height={82} rx={41} fill="#E9A58A" />
      {[-60, -30, 0].map((xx, i) => <path key={i} d={`M${xx},-30 L${xx + 30},20`} stroke="#E3203F" strokeWidth={6} strokeLinecap="round" opacity={0.75} />)}
      {Array.from({ length: 6 }, (_, i) => <path key={`c${i}`} d="M0,-7 L6,0 L0,7 L-6,0 Z" transform={`translate(${-110 + i * 44},${10 + (i % 2) * 14})`} fill="#6E8A00" opacity={0.7} />)}
      <g transform={`translate(${-20 + rasca},-70)`}>
        {[-18, -6, 6, 18].map((fx) => <rect key={fx} x={fx - 6} y={-10} width={12} height={46} rx={6} fill="#C9806A" />)}
        <rect x={-30} y={-60} width={60} height={60} rx={22} fill="#E9A58A" />
      </g>
    </g>
  );
}

const Colestasis: Lamina = ({ p, reloj }) => {
  const c = p('colestasis');
  return (
    <g>
      <Bandera x={800} y={50} txt="segundo mecanismo: colestasis" color="#6E8A00" p={p('colestasis')} t={28} punta="no" />
      {/* La bilis que no fluye: se frena antes del tapón */}
      <g opacity={tramo(p('fluye'), 0, 0.4)}>
        <Conducto d="M80,230 C400,200 700,260 1000,230 C1200,210 1400,240 1520,230" w={70} />
        <Piedra x={1000} y={230} R={40 * easeOut(c)} tono={['#7A4A10', '#C8902A']} sem={6} />
        {Array.from({ length: 9 }, (_, i) => {
          const u = (i / 9 + reloj * 0.00012 * (1 - 0.85 * c)) % 1;
          const X = lerp(100, c > 0.5 ? 950 : 1500, u);
          return <circle key={i} cx={X} cy={230 + Math.sin(X / 140) * 10} r={10} fill={B.conjugada[1]} opacity={tramo(Math.min(u, 1 - u), 0, 0.06)} />;
        })}
      </g>
      <Txt x={500} y={320} txt="la bilis no fluye" t={26} p={p('fluye')} />
      {/* La tríada */}
      <Sale p={p('coluria')} x={250} y={560} k={0.95}><FrascoOrina color={COLURIA} espuma={1} /></Sale>
      <Txt x={250} y={700} txt="coluria" t={28} p={p('coluria')} color={TXB.marron} />
      <Sale p={p('acolia')} x={620} y={580} k={1.05}><Heces color={ACOLIA} /></Sale>
      <Txt x={620} y={700} txt="acolia" t={28} p={p('acolia')} />
      <Sale p={p('prurito')} x={1040} y={590}><Prurito reloj={reloj} /></Sale>
      <Txt x={1040} y={700} txt="prurito" t={28} p={p('prurito')} />
      <Txt x={1040} y={736} txt="por las sales biliares retenidas" t={20} p={p('prurito')} fuerte={false} />
      {/* El laboratorio */}
      <Sale p={p('fosfatasa')} x={1400} y={560} k={0.6}><TuboSuero suero="#F2E23A" tapa="#2E9E6A" /></Sale>
      <Sube x={600} y={860} sube p={p('fosfatasa')} />
      <Txt x={640} y={860} txt="fosfatasa alcalina" t={26} p={p('fosfatasa')} ancla="start" />
      <Sube x={1000} y={860} sube p={p('ggt')} />
      <Txt x={1040} y={860} txt="GGT" t={26} p={p('ggt')} ancla="start" />
    </g>
  );
};

const Extra: Lamina = ({ p, reloj }) => {
  const calc = p('calculo'), panc = p('pancreas'), cou = p('courvoisier'), col = p('colangio');
  return (
    <g>
      <Bandera x={1200} y={50} txt="¿dónde está el bloqueo? fuera: extrahepática" color="#18A34A" p={p('bloqueo')} t={26} punta="no" />
      <g transform="translate(-40,30) scale(0.94)" opacity={tramo(p('fuera'), 0, 0.4)}>
        <ViasBiliares reloj={reloj} calculo={calc} tumor={panc} grande={cou} colangio={col} dilata={0.6 * Math.max(calc, panc)} fluye={1} />
      </g>
      <Nombre x={1080} y={250} a={[486, 425]} txt="colangiocarcinoma" p={col} />
      <Nombre x={120} y={760} a={[370, 600]} txt="vesícula palpable y no dolorosa" p={cou} ancla="start" />
      <Txt x={120} y={796} txt="signo de Courvoisier" t={20} p={cou} ancla="start" color={TXB.verde} />
      <Nombre x={1080} y={430} a={[618, 662]} txt="cálculo en el colédoco" p={calc} />
      <Nombre x={1080} y={900} a={[750, 752]} txt="cáncer de la cabeza del páncreas" p={panc} />
    </g>
  );
};

/** Embarazada de perfil, plana. */
function Embarazada() {
  return (
    <g>
      <circle cy={-74} r={24} fill="#C9806A" />
      <path d="M-14,-96 C-40,-100 -44,-60 -26,-50" fill="none" stroke="#3A1A10" strokeWidth={16} strokeLinecap="round" />
      <path d="M-20,-46 C-30,-10 -28,30 -24,70 L20,70 C24,40 50,30 48,0 C46,-30 20,-30 18,-46 Z" fill="#C2307A" />
      <circle cx={26} cy={6} r={30} fill="#E0559A" />
      <rect x={-22} y={68} width={14} height={50} rx={7} fill="#3A1A50" /><rect x={4} y={68} width={14} height={50} rx={7} fill="#3A1A50" />
    </g>
  );
}

const Intra: Lamina = ({ p, reloj }) => {
  const causas: { n: string; txt: string; d: ReactNode }[] = [
    { n: 'farmacos', txt: 'estrógenos y anabólicos', d: <g><Pastilla x={-20} r={-30} color={['#B5245E', '#F25CA8', '#FFC2DE']} /><Pastilla x={24} y={10} r={30} color={['#C77800', '#FFB21E', '#FFE08A']} /></g> },
    { n: 'amoxicilina', txt: 'amoxicilina con clavulánico', d: <Pastilla r={-20} k={1.3} color={['#5A2DB0', '#8A5AF0', '#D3C2FF']} /> },
    { n: 'sepsis', txt: 'sepsis', d: <g><Bacilo x={-20} y={0} k={0.5} reloj={reloj} /><g transform="translate(30,-10) scale(0.22)"><Termometro val={0.9} /></g></g> },
    { n: 'embarazo', txt: 'colestasis del embarazo', d: <g transform="scale(0.6)"><Embarazada /></g> },
    { n: 'cbp', txt: 'colangitis biliar primaria', d: <g><Conducto d="M-50,0 L50,0" w={24} tono={['#7A6A5A', '#B8A890', '#E0D4C0']} /><circle cx={-10} cy={-22} r={11} fill="#5A6ACC" /><circle cx={16} cy={20} r={11} fill="#5A6ACC" /></g> },
  ];
  return (
    <g>
      <Bandera x={800} y={50} txt="dentro: colestasis intrahepática" color="#6E8A00" p={p('adentro')} t={28} punta="no" />
      <Sale p={p('adentro')} x={400} y={430} k={0.92}>
        <HigadoB tono={TONO_HIGADO.normal.map((c) => mezcla(c, '#8E8A22', 0.35))} reloj={reloj} />
        {/* Conductillos dentro del hígado, con tapones */}
        {['M-200,-60 C-120,-30 -40,-40 60,10', 'M-120,60 C-40,40 20,60 60,10', 'M-60,-140 C-20,-80 20,-40 60,10', 'M200,-90 C160,-50 120,-20 60,10'].map((d, i) => <Conducto key={i} d={d} w={14} />)}
        {[[-140, -46], [-70, 50], [-36, -100], [160, -62]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11 + Math.sin(reloj / 500 + i) * 1.5} fill="#4A5A00" />)}
      </Sale>
      <Txt x={400} y={680} txt="la bilis se estanca dentro del hígado" t={24} p={p('adentro')} />
      {causas.map((c, i) => (
        <g key={c.n}>
          <Sale p={p(c.n)} x={920} y={190 + i * 150}>{c.d}</Sale>
          <Txt x={1010} y={190 + i * 150} txt={c.txt} t={26} p={p(c.n)} ancla="start" />
        </g>
      ))}
    </g>
  );
};

/** Vitamina K: esfera verde con su letra. */
function VitK({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  if (o <= 0.002) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
      <circle r={22} fill="#0E7A34" /><circle cx={-2} cy={-2} r={18} fill="#2FC45A" />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF' }}>K</text>
    </g>
  );
}

const VitaminaK: Lamina = ({ p, reloj }) => {
  const vk = p('vitk');
  return (
    <g>
      <Bandera x={800} y={50} txt="¿y la coagulación?" color="#6E8A00" p={p('coagulacion')} t={30} punta="no" />
      {/* Pared del intestino: la vitamina K y la grasa se quedan en la luz sin micelas de bilis */}
      <g opacity={tramo(p('coagulacion'), 0, 0.4)}>
        <rect x={60} y={420} width={760} height={120} fill="#C2307A" />
        {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={80 + i * 92} y={300} width={70} height={150} rx={35} fill="#C2307A" /><rect x={86 + i * 92} y={300} width={56} height={140} rx={28} fill="#F27BA0" /></g>)}
        <rect x={60} y={560} width={760} height={90} rx={30} fill="#9E0B2E" />
        <rect x={60} y={566} width={760} height={70} rx={26} fill="#E3203F" />
        {/* Los hematíes entran y salen del vaso fundiéndose en los extremos (nunca saltan) */}
        <clipPath id="c10-capilar"><rect x={60} y={560} width={760} height={90} rx={30} /></clipPath>
        <g clipPath="url(#c10-capilar)">
          {Array.from({ length: 5 }, (_, i) => {
            const X = 20 + ((reloj * 0.05 + i * 176) % 880);
            return <Hematie key={i} x={X} y={598 + (i % 2 ? 8 : -6)} k={0.5} lado={0.75} r={i * 30} o={tramo(Math.min(X - 40, 860 - X), 0, 110)} />;
          })}
        </g>
      </g>
      <Txt x={440} y={700} txt="sin bilis en el intestino, no se absorbe la vitamina K" t={24} p={vk} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <VitK x={140 + i * 150 + Math.sin(reloj / 700 + i) * 10} y={220 + Math.cos(reloj / 800 + i) * 12} o={tramo(vk, i * 0.1, 0.5 + i * 0.1)} />
          <Grasa x={210 + i * 150} y={170 + Math.sin(reloj / 900 + i) * 8} k={0.4} o={tramo(vk, 0.2, 0.6)} />
        </g>
      ))}
      <Cruz x={760} y={380} k={0.9} o={vk} />
      {/* Tiempo de protrombina largo */}
      <g opacity={tramo(p('protrombina'), 0, 0.4)}>
        <circle cx={1140} cy={260} r={90} fill={B.sombra} transform="translate(6,8)" />
        <circle cx={1140} cy={260} r={90} fill="#2E4AA0" /><circle cx={1140} cy={260} r={76} fill="#FFF7E6" />
        <path d={`M1140,260 L1140,184 A76,76 0 ${easeOut(p('protrombina')) > 0.5 ? 1 : 0},1 ${1140 + Math.sin(easeOut(p('protrombina')) * Math.PI * 1.6) * 76},${260 - Math.cos(easeOut(p('protrombina')) * Math.PI * 1.6) * 76} Z`} fill="#E3203F" opacity={0.55} />
        <path d="M1140,260 L1140,200" stroke="#3A1250" strokeWidth={7} strokeLinecap="round" transform={`rotate(${(reloj / 10) % 360} 1140 260)`} />
        <rect x={1124} y={150} width={32} height={22} rx={6} fill="#2E4AA0" />
      </g>
      <Txt x={1140} y={390} txt="tiempo de protrombina largo" t={26} p={p('protrombina')} />
      {/* Se corrige con vitamina K… en la colestasis */}
      <Sale p={p('corrige')} x={1040} y={560} k={1}><Jeringa r={-35} liquido="#2FC45A" /></Sale>
      <Visto x={1150} y={520} k={1} o={p('corrige')} />
      <Txt x={1200} y={540} txt="se corrige con vitamina K" t={24} p={p('corrige')} ancla="start" color={TXB.verde} />
      {/* …pero no en el fallo hepático */}
      <Sale p={p('fallo')} x={1100} y={790} k={0.3}><HigadoB tono={['#5A5060', '#8A8090', '#B0A8B8', '#E0DAE6']} /></Sale>
      <Cruz x={1210} y={760} k={1} o={p('fallo')} />
      <Txt x={1250} y={790} txt="en el fallo hepático," t={24} p={p('fallo')} ancla="start" />
      <Txt x={1250} y={826} txt="no se corrige" t={24} p={p('fallo')} ancla="start" color={TXB.hemo} />
    </g>
  );
};

/** Virus de la hepatitis: esfera con espículas. */
function Virus({ reloj }: { reloj: number }) {
  return (
    <g transform={`rotate(${(reloj / 40) % 360})`}>
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <g key={i}><path d={`M${Math.cos(a) * 30},${Math.sin(a) * 30} L${Math.cos(a) * 46},${Math.sin(a) * 46}`} stroke="#5A2DB0" strokeWidth={6} strokeLinecap="round" /><circle cx={Math.cos(a) * 48} cy={Math.sin(a) * 48} r={7} fill="#E040C8" /></g>; })}
      <circle r={32} fill="#5A2DB0" /><circle cx={-3} cy={-3} r={27} fill="#8A5AF0" /><circle cx={-10} cy={-10} r={6} fill="#FFF" opacity={0.7} />
    </g>
  );
}
function Copa() {
  return (
    <g>
      <path d="M-40,-60 L40,-60 C40,-10 20,10 0,12 C-20,10 -40,-10 -40,-60 Z" fill="#DCEAF4" />
      <path d="M-36,-34 L36,-34 C32,-6 16,8 0,9 C-16,8 -32,-6 -36,-34 Z" fill="#B5245E" />
      <rect x={-4} y={10} width={8} height={44} fill="#DCEAF4" /><rect x={-30} y={52} width={60} height={10} rx={5} fill="#DCEAF4" />
      <path d="M-28,-54 L-24,-20" stroke="#FFF" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
}

/** Una transaminasa: proteína redonda con su nombre (ALT en verde, AST en azul). */
function Enzima({ x, y, alt, o = 1 }: { x: number; y: number; alt: boolean; o?: number }) {
  if (o <= 0.002) return null;
  const t = alt ? ['#0E7A34', '#2FC45A'] : ['#1446B0', '#2E78F2'];
  return (
    <g transform={`translate(${x},${y})`} opacity={o}>
      <circle r={19} fill={t[0]} /><circle cx={-2} cy={-2} r={16} fill={t[1]} />
      <circle cx={-8} cy={-9} r={4} fill="#FFF" opacity={0.75} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#FFF' }}>{alt ? 'ALT' : 'AST'}</text>
    </g>
  );
}

/** Tres hepatocitos bajo la sangre: los sanos guardan sus transaminasas; el del medio está roto y las suelta,
 *  que corren por la sangre hasta el tubo del análisis. */
function Transaminasas({ reloj, p }: { reloj: number; p: number }) {
  if (p <= 0.002) return null;
  const celdas = [[70, 280], [290, 500], [510, 720]];
  const fuga: P2[] = [[395, 880], [400, 800], [470, 772], [640, 768], [760, 770], [850, 800]];
  const camino = (u: number): P2 => {
    const t = u * (fuga.length - 1), i = Math.min(fuga.length - 2, Math.floor(t)), f = t - i;
    return [lerp(fuga[i][0], fuga[i + 1][0], f), lerp(fuga[i][1], fuga[i + 1][1], f)];
  };
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      {/* Sangre de la sinusoide */}
      <rect x={60} y={736} width={700} height={66} rx={33} fill="#9E0B2E" />
      <rect x={60} y={740} width={694} height={52} rx={26} fill="#E3203F" />
      <text x={90} y={766} dy="0.35em" style={{ fontSize: 18, fontWeight: 800, fill: '#FFFFFF' }}>sangre</text>
      {/* Los hepatocitos: sanos a los lados, el del medio dañado */}
      {celdas.map(([x0, x1], i) => <Hepatocito key={i} x0={x0} x1={x1} y0={816} y1={950} nucleo={false} sem={i + 2} tinte={i === 1 ? 0.25 : 0} />)}
      <path d="M352,816 L372,842 L356,866 L380,900 M430,950 L414,922 L436,896" fill="none" stroke="#3A0628" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M380,816 L396,834 L412,816 Z" fill="#3A0628" />
      {[[0, 140, 870, true], [0, 220, 912, false], [2, 580, 870, false], [2, 660, 910, true]].map(([_, ex, ey, alt], i) => (
        <Enzima key={i} x={ex as number} y={(ey as number) + Math.sin(reloj / 600 + i) * 4} alt={alt as boolean} />
      ))}
      {/* La fuga: salen por la grieta y viajan con la sangre */}
      {Array.from({ length: 6 }, (_, i) => {
        const u = (reloj / 3600 + i / 6) % 1;
        const [ex, ey] = camino(u);
        return <Enzima key={`f${i}`} x={ex} y={ey + Math.sin(u * 20 + i) * 3} alt={i % 2 === 0} o={tramo(Math.min(u, 1 - u), 0, 0.08)} />;
      })}
      <Txt x={395} y={980} txt="el hepatocito roto suelta sus enzimas a la sangre" t={20} p={p} fuerte={false} />
      {/* El análisis */}
      <g transform="translate(870,850) scale(0.5)"><TuboSuero suero="#F6E07A" tapa="#2E9E6A" /></g>
      <Sube x={960} y={790} sube p={p} />
      <Txt x={1000} y={790} txt="transaminasas muy altas" t={26} p={p} ancla="start" />
      <Txt x={1000} y={830} txt="ALT y AST, las que escapan de la célula" t={20} p={p} ancla="start" fuerte={false} />
    </g>
  );
}

const Dano: Lamina = ({ p, reloj }) => {
  const fall = p('fallan');
  const etapas = [
    { txt: 'captación', abre: 0.55, color: ['#8A1A5A', '#E0559A'] },
    { txt: 'conjugación', abre: 0.5, color: ['#4A1FA0', '#9A6AF5'] },
    { txt: 'excreción', abre: 0.1, color: ['#C24A00', '#FF8A2B'] },
  ];
  return (
    <g>
      <Bandera x={800} y={50} txt="tercer mecanismo: el daño hepatocelular" color="#A3237A" p={p('propio')} t={28} punta="no" />
      <Sale p={p('propio')} x={330} y={300} k={0.66}><HigadoB tono={TONO_HIGADO.inflamado} focos={1} reloj={reloj} /></Sale>
      {[
        { d: <Virus reloj={reloj} />, txt: 'hepatitis' },
        { d: <Copa />, txt: 'alcohol' },
        { d: <Pastilla k={1.2} r={30} color={['#3A3F58', '#6B7290', '#C8CCE0']} />, txt: 'tóxicos' },
        { d: <g transform="scale(0.24)"><Termometro val={0.9} /></g>, txt: 'sepsis' },
      ].map((c, i) => (
        <g key={i}>
          <Sale p={tramo(p('causas'), i * 0.15, 0.5 + i * 0.15)} x={110 + i * 150} y={580}>{c.d}</Sale>
          <Txt x={110 + i * 150} y={670} txt={c.txt} t={22} p={tramo(p('causas'), i * 0.15, 0.5 + i * 0.15)} />
        </g>
      ))}
      {/* Las tres etapas, como llaves en serie: la excreción es la que más se cierra */}
      <g opacity={tramo(fall, 0, 0.4)}>
        <Tubo pts={[[780, 330], [1560, 330]]} reloj={reloj} flujo={0.35} tono={B.conjugada} />
        {etapas.map((e, i) => <Llave key={e.txt} x={900 + i * 250} y={330} k={0.8} abre={lerp(1, e.abre, easeOut(fall))} color={e.color} roto={i === 2 ? tramo(p('fragil'), 0, 0.6) : 0} />)}
        {etapas.map((e, i) => <Txt key={`t${e.txt}`} x={900 + i * 250} y={420} txt={e.txt} t={24} p={fall} color={i === 2 ? TXB.hemo : undefined} />)}
      </g>
      <Txt x={1150} y={180} txt="fallan las tres etapas" t={26} p={fall} />
      <Txt x={1400} y={470} txt="la más frágil" t={24} p={p('fragil')} color={TXB.hemo} />
      <Sale p={p('predomina')} x={900} y={630} k={0.6}><TuboSuero suero="#F2E23A" /></Sale>
      <Txt x={970} y={620} txt="suele predominar la conjugada" t={26} p={p('predomina')} ancla="start" color={TXB.limon} />
      {/* Transaminasas: viven dentro del hepatocito; el roto las suelta a la sangre y llegan al análisis */}
      <Transaminasas reloj={reloj} p={p('transaminasas')} />
    </g>
  );
};

/** Calendario pequeño con un número grande. */
function HojaMes({ txt, color }: { txt: string; color: string }) {
  return (
    <g>
      <rect x={-70} y={-60} width={140} height={128} rx={18} fill={B.sombra} transform="translate(6,8)" />
      <rect x={-70} y={-60} width={140} height={128} rx={18} fill="#FFF7E6" />
      <rect x={-70} y={-60} width={140} height={36} rx={18} fill={color} /><rect x={-70} y={-40} width={140} height={16} fill={color} />
      {[-40, 40].map((cx) => <rect key={cx} x={cx - 6} y={-72} width={12} height={26} rx={6} fill="#5A6478" />)}
      <text y={26} textAnchor="middle" style={{ fontSize: 44, fontWeight: 800, fill: '#3A1250' }}>{txt}</text>
    </g>
  );
}

/** Curva suave (Catmull-Rom) muestreada en puntos: el dibujo y lo que viaja por dentro usan los mismos. */
function suave(pts: P2[], n = 10): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const largo = (pts: P2[]) => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
const enRuta = (pts: P2[], u: number): P2 => {
  const t = clamp(u) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(t)), f = t - i;
  return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
};

// Portoenterostomía de Kasai, en las coordenadas de `ViasBiliares`. Se quitan los conductos fibrosos y la vesícula;
// el yeyuno se corta poco después del duodeno y su extremo distal sube (asa en Y de Roux) hasta el hilio, donde se
// cose; el tramo que viene del duodeno (asa biliopancreática) desemboca más abajo en esa asa: la «Y».
// El duodeno ya es intestino delgado: su continuación es la misma tripa, no otra.
const JOTA: P2 = [744, 1112];
/** Del final de la «C» del duodeno (ángulo duodenoyeyunal) hasta la unión en «Y». */
const BILIOPANC = suave([[1070, 860], [1118, 806], [1170, 836], [1176, 940], [1110, 1040], [970, 1096], [790, 1112]]);
/** Asa de Roux: del hilio baja por delante, entre el hígado y el duodeno, hasta la unión. */
const ROUX = suave([[560, 412], [602, 482], [624, 572], [632, 680], [624, 800], [634, 920], [672, 1030], JOTA]);
/** Lo que sigue después de la unión: el intestino común. */
const COMUN = suave([JOTA, [784, 1190], [792, 1290]]);

/** Tubo de intestino delgado por una curva muestreada: pared, mucosa, luz y un brillo; `prog` lo traza. */
function Tripa({ pts, prog = 1, desde = 'inicio' }: { pts: P2[]; prog?: number; desde?: 'inicio' | 'fin' }) {
  const l = largo(pts);
  const orden = desde === 'fin' ? [...pts].reverse() : pts;
  const d = orden.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const da = `${clamp(prog) * l} ${l + 10}`;
  const pl = orden.filter((_, i) => i % 4 === 2 && i / orden.length < clamp(prog));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={B.sombra} strokeWidth={74} strokeDasharray={da} transform="translate(8,10)" />
      <path d={d} stroke="#A3205A" strokeWidth={74} strokeDasharray={da} />
      <path d={d} stroke="#E8689A" strokeWidth={58} strokeDasharray={da} />
      <path d={d} stroke="#FFD6E4" strokeWidth={22} strokeDasharray={da} opacity={0.9} />
      <path d={d} stroke="#FFFFFF" strokeWidth={6} strokeDasharray={da} opacity={0.5} transform="translate(-14,-8)" />
      {/* Pliegues circulares de la mucosa */}
      {pl.map(([x, y], k) => {
        const j = orden.indexOf(pl[k]), a = orden[Math.max(0, j - 1)], b = orden[Math.min(orden.length - 1, j + 1)];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, c = Math.cos(ang), s = Math.sin(ang);
        return <path key={k} d={`M${x + c * 14},${y + s * 14} L${x + c * 27},${y + s * 27} M${x - c * 14},${y - s * 14} L${x - c * 27},${y - s * 27}`} stroke="#B5306A" strokeWidth={5} />;
      })}
    </g>
  );
}

/** Puntos de sutura en anillo. */
function Sutura({ x, y, rx, ry, o }: { x: number; y: number; rx: number; ry: number; o: number }) {
  if (o <= 0.01) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${x + Math.cos(a) * rx},${y + Math.sin(a) * ry} L${x + Math.cos(a) * (rx + 12)},${y + Math.sin(a) * (ry + 12)}`} stroke="#3A1250" strokeWidth={5} strokeLinecap="round" />;
      })}
    </g>
  );
}

/** El intestino que sigue al duodeno (siempre) y, con `kas`, el asa de Roux cosida al hilio y la unión en «Y». */
function Kasai({ kas, reloj }: { kas: number; reloj: number }) {
  const q = easeOut(tramo(kas, 0.15, 0.8));
  const fluye = tramo(kas, 0.75, 1);
  const viaje = (pts: P2[], n: number, vel: number, tono: readonly string[], R: number, sem: number) => Array.from({ length: n }, (_, i) => {
    const u = (reloj / vel + i / n + sem) % 1;
    const [x, y] = enRuta(pts, u);
    return <g key={`${sem}-${i}`} opacity={fluye * tramo(Math.min(u, 1 - u), 0, 0.06)}><circle cx={x} cy={y} r={R} fill={tono[0]} /><circle cx={x - 2} cy={y - 2} r={R * 0.7} fill={tono[1]} /></g>;
  });
  return (
    <g>
      {/* El duodeno sigue como yeyuno: está antes y después de operar */}
      <Tripa pts={BILIOPANC} />
      <Tripa pts={COMUN} />
      {/* El asa de Roux sube desde la unión hasta el hilio */}
      {kas > 0.01 && <Tripa pts={ROUX} prog={q} desde="fin" />}
      <Sutura x={JOTA[0] + 22} y={JOTA[1]} rx={30} ry={34} o={tramo(kas, 0.6, 0.9)} />
      <Sutura x={560} y={412} rx={34} ry={30} o={tramo(kas, 0.7, 1)} />
      {/* Lo que corre: la bilis baja por el asa de Roux; lo del duodeno, por su tramo; los dos siguen juntos */}
      {kas > 0.01 && viaje([...ROUX, ...COMUN.slice(1)], 8, 5400, B.conjugada, 10, 0)}
      {kas > 0.01 && viaje([...BILIOPANC, ...COMUN.slice(1)], 5, 6200, ['#B89A6A', '#E8D4A8'], 8, 0.37)}
    </g>
  );
}

const Atresia: Lamina = ({ p, reloj }) => {
  const ob = p('obliterados'), kas = p('kasai');
  // La escena va a escala 0.6 desde (40, 100): G pasa un punto de `ViasBiliares` al lienzo.
  const G = (x: number, y: number): P2 => [40 + x * 0.6, 100 + y * 0.6];
  const parte = (i: number) => tramo(kas, 0.2 + i * 0.18, 0.5 + i * 0.18);
  return (
    <g>
      <Bandera x={800} y={50} txt="un tema aparte: la atresia biliar" color="#D7263D" p={p('aparte')} t={28} punta="no" />
      {/* Las vías del recién nacido, con los conductos hechos cordones; luego la operación de Kasai */}
      <g transform="translate(40,100) scale(0.6)" opacity={tramo(p('atresia'), 0, 0.4)}>
        <ViasBiliares reloj={reloj} atresia={ob} fluye={0.4 * (1 - ob)} pancreas={1} sinVias={tramo(kas, 0, 0.5)} />
        <Kasai kas={kas} reloj={reloj} />
      </g>
      <Txt x={230} y={900} txt="conductos obliterados" t={26} p={ob * (1 - tramo(kas, 0, 0.4))} color={TXB.hemo} />
      <Txt x={230} y={936} txt="la conjugada vuelve a la sangre" t={22} p={ob * (1 - tramo(kas, 0, 0.4))} fuerte={false} />
      {/* La operación, parte por parte */}
      <Txt x={970} y={370} txt="operación de Kasai (portoenterostomía)" t={28} p={kas} ancla="start" color={TXB.hepato} />
      <Nombre x={970} y={430} a={G(560, 412)} txt="1 · se quitan los conductos y la vesícula" p={parte(0)} t={22} />
      <Nombre x={970} y={500} a={G(628, 640)} txt="2 · el yeyuno se corta y su extremo sube al hilio" p={parte(1)} t={22} />
      <Txt x={1002} y={530} txt="asa en Y de Roux: por ella sale la bilis" t={19} p={parte(1)} ancla="start" fuerte={false} />
      <Nombre x={970} y={590} a={G(1172, 900)} txt="3 · el tramo que viene del duodeno" p={parte(2)} t={22} />
      <Nombre x={970} y={660} a={G(JOTA[0] - 30, JOTA[1])} txt="4 · se une más abajo: la «Y»" p={parte(3)} t={22} />
      {/* El recién nacido amarillo */}
      <Sale p={p('frecuente')} x={1340} y={180} k={0.42}>
        <Bebe amarillo={0.85} reloj={reloj} />
        <rect x={-270} y={70} width={600} height={30} rx={15} fill="#C9B8F0" />
      </Sale>
      <Txt x={1340} y={262} txt="la causa más frecuente de" t={20} p={p('frecuente')} fuerte={false} />
      <Txt x={1340} y={292} txt="ictericia conjugada neonatal" t={22} p={p('frecuente')} />
      <Sale p={p('meses')} x={1000} y={790} k={0.75}><HojaMes txt="< 2 m" color="#C2307A" /></Sale>
      <Txt x={1080} y={775} txt="idealmente antes de los 2 meses;" t={22} p={p('meses')} ancla="start" />
      <Txt x={1080} y={808} txt="si no, trasplante" t={22} p={p('meses')} ancla="start" />
      <Bandera x={1000} y={930} txt="ictericia de más de 2 semanas: medir la directa" color="#D7263D" p={p('regla')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [LaFirma, Dubin, HigadoNegro, Rotor, Colestasis, Extra, Intra, VitaminaK, Dano, Atresia];
export default LAMINAS;
