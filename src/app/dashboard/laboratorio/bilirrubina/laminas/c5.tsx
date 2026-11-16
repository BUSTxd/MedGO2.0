'use client';
// Capítulo 5 · La salida a la bilis

import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Chip, Flecha, Flujo, Glucuronido, Gota, Hematie, Hepatocito, Higado, Pastilla, Poro, Rinon, Sale, Tetrapirrol, Txt, TXB, V, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

const MRP2 = ['#B5480A', '#F07A1E', '#FFC48A'] as const;
const OATP = ['#C77800', '#FFB21E', '#FFE08A'] as const;

/** Canalículo vertical entre dos hepatocitos, con la bilis que corre hacia abajo. */
function Canaliculo({ x = 800, w = 90, y0 = 60, y1 = 960, reloj, o = 1 }: { x?: number; w?: number; y0?: number; y1?: number; reloj: number; o?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} rx={w / 2} fill={B.bilis[0]} />
      <rect x={x - w / 2 + 8} y={y0 + 6} width={w - 16} height={y1 - y0 - 12} rx={w / 2 - 8} fill={B.bilis[1]} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = (reloj / 3000 + i / 6) % 1;
        return <circle key={i} cx={x + Math.sin(u * 9 + i) * (w * 0.2)} cy={lerp(y0 + 30, y1 - 30, u)} r={8} fill={B.bilis[2]} opacity={0.8} />;
      })}
    </g>
  );
}

const Puerta: Lamina = ({ p, reloj }) => {
  const sale = p('bomba');
  return (
    <g>
      <Hepatocito x0={40} x1={740} y0={80} y1={920} sem={1} />
      <Hepatocito x0={860} x1={1560} y0={80} y1={920} sem={2} />
      <Canaliculo reloj={reloj} o={tramo(p('canaliculo'), 0, 0.4)} y0={100} y1={900} />
      <Bandera x={800} y={50} txt="¿cómo sale del hepatocito?" color="#1E9E6A" p={p('sale')} t={28} punta="no" />
      {[300, 560].map((y, i) => <Poro key={y} x={722} y={y} r={90} k={0.9} tono={MRP2} bombea={reloj + i * 300} tallo={30} o={tramo(sale, i * 0.2, 0.6 + i * 0.2)} />)}
      <Chip x={480} y={180} txt="MRP2 (gen ABCC2)" color="#B5480A" p={sale} t={24} />
      {sale > 0.1 && [0, 1, 2].map((i) => {
        const u = (reloj / 3200 + i / 3) % 1;
        const y = [300, 560, 300][i];
        return <Tetrapirrol key={i} x={lerp(420, 800, u)} y={y + (u > 0.8 ? (u - 0.8) * 800 : 0)} k={0.2} colitas={2} tono={B.conjugada} o={tramo(Math.min(u, 1 - u), 0, 0.08)} />;
      })}
      <Txt x={1200} y={460} txt="canalículo: aquí nace la bilis" t={26} p={p('nace')} color="#FFFFFF" />
      <Sale p={p('atp')} x={400} y={720}><circle r={46} fill="#C77800" /><circle r={40} cx={-3} cy={-3} fill="#FFB21E" /><text dy="0.35em" textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: '#FFF' }}>ATP</text></Sale>
      <Flecha a={[450, 690]} b={[680, 600]} p={p('atp')} color="#FFE08A" w={7} />
      <Txt x={400} y={810} txt="gasta ATP: bomba ABC" t={24} p={p('atp')} color="#FFFFFF" />
    </g>
  );
};

/** La ladera del gradiente: de la célula (abajo, poca conjugada) al canalículo (arriba, mucha). */
const LADERA = (u: number): [number, number] => [lerp(170, 1130, u), 760 - 430 * (u * u * (3 - 2 * u))];

const Cuesta: Lamina = ({ p, reloj }) => {
  const cuesta = p('cuesta'), grad = p('gradiente');
  const ciclo = (reloj / 4600) % 1;
  // La bomba sube a tirones (cada golpe gasta un ATP) y baja vacía.
  const golpes = 5, sub = ciclo < 0.8 ? ciclo / 0.8 : 1 - (ciclo - 0.8) / 0.2;
  const paso = Math.floor(sub * golpes), f = sub * golpes - paso;
  const u = ciclo < 0.8 ? (paso + easeOut(clamp(f * 1.6))) / golpes : sub;
  const [bx, by] = LADERA(u);
  const [tx, ty] = LADERA(Math.min(1, u + 0.035));
  const ang = (Math.atan2(ty - by, tx - bx) * 180) / Math.PI;
  const curva = Array.from({ length: 41 }, (_, i) => { const [x, y] = LADERA(i / 40); return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  return (
    <g>
      <Bandera x={800} y={70} txt="cuesta arriba" color="#1E9E6A" p={cuesta} t={30} punta="no" />
      {/* Ladera en capas (como el terreno de la referencia de la membrana) */}
      <g opacity={tramo(cuesta, 0, 0.4)}>
        <path d={`${curva} L1130,860 L170,860 Z`} fill="#1E9E6A" opacity={0.18} />
        <path d={`${curva} L1130,860 L170,860 Z`} fill="url(#bi-ladera)" />
        <defs>
          <linearGradient id="bi-ladera" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FFE08A" stopOpacity={0.25} />
            <stop offset="1" stopColor="#E0A100" stopOpacity={0.7 * grad + 0.15} />
          </linearGradient>
        </defs>
        <path d={curva} fill="none" stroke="#9C6A00" strokeWidth={16} strokeLinecap="round" strokeDasharray={`${easeOut(cuesta) * 1300} 1400`} />
        <path d={curva} fill="none" stroke="#FFD23F" strokeWidth={6} strokeLinecap="round" strokeDasharray={`${easeOut(cuesta) * 1300} 1400`} />
      </g>
      <Txt x={250} y={900} txt="dentro del hepatocito: poca" t={24} p={cuesta} fuerte={false} />
      {/* Cola de conjugadas que esperan su turno abajo: el cuello de botella */}
      {[0, 1, 2, 3].map((i) => <Tetrapirrol key={i} x={130 + i * 46 + Math.sin(reloj / 400 + i) * 4} y={800} k={0.15} colitas={2} tono={B.conjugada} o={tramo(p('lento'), i * 0.15, 0.6 + i * 0.1)} />)}
      {/* La bomba MRP2 empujando su carga */}
      {cuesta > 0.2 && (
        <g opacity={tramo(cuesta, 0.2, 0.5)}>
          <g transform={`translate(${bx.toFixed(1)},${(by - 6).toFixed(1)}) rotate(${ang.toFixed(1)})`}>
            <Poro x={-30} y={-52} k={1.05} r={90} tono={MRP2} bombea={reloj} tallo={0} />
            {ciclo < 0.8 && <Tetrapirrol x={60} y={-84} k={0.3} colitas={2} tono={B.conjugada} vibra={reloj} />}
          </g>
          {/* Un ATP por golpe: entra, se parte en ADP + P y suelta su chispa */}
          {ciclo < 0.8 && f < 0.5 && <circle cx={bx - 90} cy={by - 140 + f * 70} r={24} fill="#FFB21E" opacity={1 - f * 2} />}
          {ciclo < 0.8 && f >= 0.4 && f < 0.9 && <g opacity={1 - (f - 0.4) * 2}><circle cx={bx - 70 - f * 40} cy={by - 60} r={12} fill="#C77800" /><circle cx={bx - 30} cy={by - 110 - f * 40} r={7} fill="#FFE08A" /></g>}
        </g>
      )}
      <Chip x={bx + 30} y={by + 70} txt="MRP2 + ATP" color="#B5480A" p={tramo(cuesta, 0.3, 0.8)} t={20} />
      {/* Arriba, el canalículo ya lleno: el gradiente */}
      <g opacity={tramo(grad, 0, 0.4)}>
        <rect x={1150} y={180} width={300} height={440} rx={60} fill={B.bilis[0]} />
        <rect x={1162} y={190} width={276} height={420} rx={52} fill={B.bilis[1]} />
        {Array.from({ length: 12 }, (_, i) => <Tetrapirrol key={i} x={1210 + (i % 3) * 90} y={240 + Math.floor(i / 3) * 95 + Math.sin(reloj / 500 + i) * 5} k={0.17} colitas={2} tono={B.conjugada} o={tramo(grad, i * 0.05, 0.4 + i * 0.05)} />)}
      </g>
      <Txt x={1300} y={150} txt="canalículo: mucha" t={26} p={grad} />
      <Flecha a={[700, 640]} b={[1000, 430]} p={grad} color="#9C6A00" w={7} />
      <Txt x={930} y={600} txt="contra un gradiente grande" t={24} p={grad} />
      {/* El paso más lento: reloj de arena */}
      <g transform="translate(290,330)" opacity={tramo(p('lento'), 0, 0.4)}>
        <rect x={-50} y={-86} width={100} height={14} rx={7} fill="#7A4A08" /><rect x={-50} y={72} width={100} height={14} rx={7} fill="#7A4A08" />
        <path d="M-40,-72 L40,-72 L6,0 L40,72 L-40,72 L-6,0 Z" fill="#E8F4FF" opacity={0.75} />
        <path d={`M${-30 + 26 * ((reloj / 6000) % 1)},-62 L${30 - 26 * ((reloj / 6000) % 1)},-62 L4,-4 L-4,-4 Z`} fill="#FFB21E" />
        <path d={`M-34,68 L34,68 L${12 - 10 * ((reloj / 6000) % 1)},${68 - 40 * ((reloj / 6000) % 1)} L${-12 + 10 * ((reloj / 6000) % 1)},${68 - 40 * ((reloj / 6000) % 1)} Z`} fill="#FFB21E" />
        <line x1={0} y1={-4} x2={0} y2={68} stroke="#FFB21E" strokeWidth={3} strokeDasharray="4 6" strokeDashoffset={-reloj / 40} />
      </g>
      <Bandera x={290} y={470} txt="el paso más lento del hígado" color="#B5480A" p={p('lento')} t={24} punta="no" />
      {/* Consecuencia clínica */}
      <Sale p={p('dana')} x={1300} y={800} k={0.24}><Higado corte={false} /></Sale>
      {[0, 1, 2, 3].map((i) => <Tetrapirrol key={i} x={1220 + i * 55} y={720 + Math.sin(reloj / 400 + i) * 8} k={0.12} colitas={2} tono={B.conjugada} o={tramo(p('acumula'), i * 0.15, 0.5 + i * 0.15)} />)}
      <Txt x={1300} y={900} txt="si el hígado se daña," t={22} p={p('dana')} />
      <Txt x={1300} y={935} txt="primero se acumula la conjugada" t={22} p={p('acumula')} color={TXB.limon} />
    </g>
  );
};

const Compartida: Lamina = ({ p, reloj }) => {
  const cola = [
    { tipo: 'bili', p: p('solo') },
    { tipo: 'farmaco', p: p('farmacos') },
    { tipo: 'meta', p: p('metabolitos') },
    { tipo: 'bili', p: p('solo') },
    { tipo: 'farmaco', p: p('farmacos') },
    { tipo: 'meta', p: p('metabolitos') },
  ];
  return (
    <g>
      <Bandera x={800} y={90} txt="una puerta compartida" color="#1E9E6A" p={p('compartida')} t={30} punta="no" />
      <Poro x={800} y={520} k={2} tono={MRP2} bombea={reloj} tallo={0} o={tramo(p('solo'), 0, 0.3)} />
      {cola.map((c, i) => {
        const u = (reloj / 6000 + i / cola.length) % 1;
        const x = lerp(140, 1460, u), y = 520 - Math.sin(u * Math.PI) * 120;
        const o = c.p * tramo(Math.min(u, 1 - u), 0, 0.06);
        if (o <= 0.01) return null;
        return c.tipo === 'bili' ? <Tetrapirrol key={i} x={x} y={y} k={0.24} colitas={2} tono={B.conjugada} o={o} />
          : c.tipo === 'farmaco' ? <Pastilla key={i} x={x} y={y} k={0.8} o={o} r={u * 200} />
          : <Glucuronido key={i} x={x} y={y} k={1.6} o={o} r={u * 160} />;
      })}
      <Txt x={360} y={760} txt="bilirrubina conjugada" t={26} p={p('solo')} color={TXB.limon} />
      <Txt x={800} y={800} txt="conjugados de fármacos" t={26} p={p('farmacos')} />
      <Txt x={1240} y={760} txt="otros metabolitos" t={26} p={p('metabolitos')} />
    </g>
  );
};

/** Micela: corona de cabezas rosadas con colas hacia dentro, que gira despacio. */
function Micela({ x, y, k = 1, o = 1, reloj, carga = 0 }: { x: number; y: number; k?: number; o?: number; reloj: number; carga?: number }) {
  if (o <= 0.002) return null;
  const giro = reloj / 60;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
      <g transform={`rotate(${giro % 360})`}>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <g key={i}><line x1={Math.cos(a) * 62} y1={Math.sin(a) * 62} x2={Math.cos(a) * 30} y2={Math.sin(a) * 30} stroke="#F2B84A" strokeWidth={6} strokeLinecap="round" /><circle cx={Math.cos(a) * 70} cy={Math.sin(a) * 70} r={13} fill="#F25CA8" /></g>;
        })}
      </g>
      {carga > 0.01 && <Tetrapirrol k={0.16} colitas={2} tono={B.conjugada} o={carga} />}
    </g>
  );
}

const LaBilis: Lamina = ({ p, reloj }) => {
  const ing = [
    { n: 'sales', txt: 'sales biliares', el: <Gota tono={B.bilis} k={0.5} /> },
    { n: 'colesterol', txt: 'colesterol', el: <g><circle r={34} fill="#C99300" /><circle r={28} cx={-3} cy={-3} fill="#FFD23F" /></g> },
    { n: 'fosfolipidos', txt: 'fosfolípidos', el: <g><circle cy={-26} r={18} fill="#F25CA8" /><path d="M-8,-10 L-10,40 M8,-10 L10,40" stroke="#F2B84A" strokeWidth={7} strokeLinecap="round" /></g> },
    { n: 'agua', txt: 'electrolitos y agua', el: <g><Gota tono={['#1E7FD0', '#3FB4E0', '#BFE9FF']} k={0.4} /><circle cx={44} cy={-30} r={14} fill="#8A5AF0" /><text x={44} y={-30} dy="0.35em" textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: '#FFF' }}>+</text></g> },
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="en el canalículo" color="#1E9E6A" p={p('sales')} t={28} punta="no" />
      {ing.map((it, i) => (
        <g key={it.n}>
          <Sale p={p(it.n)} x={240 + i * 370} y={250 + Math.sin(reloj / 600 + i) * 8}>{it.el}</Sale>
          <Txt x={240 + i * 370} y={350} txt={it.txt} t={24} p={p(it.n)} />
        </g>
      ))}
      {[0, 1, 2].map((i) => <Micela key={i} x={480 + i * 320} y={590 + Math.sin(reloj / 700 + i) * 10} k={0.9} reloj={reloj + i * 400} o={tramo(p('micelas'), i * 0.2, 0.6 + i * 0.2)} carga={tramo(p('micelas'), 0.4, 1)} />)}
      <Txt x={800} y={730} txt="micelas: esa mezcla es la bilis" t={28} p={p('micelas')} />
      <Bandera x={800} y={870} txt="la regla: la bilirrubina de la bilis va conjugada" color="#9C8A00" p={p('regla')} t={26} punta="no" />
    </g>
  );
};

/** Sinusoide hepática en corte: plasma que corre, hematíes de frente y de canto, endotelio con poros y el espacio de Disse. */
function Sangre({ y0, y1, reloj, o = 1 }: { y0: number; y1: number; reloj: number; o?: number }) {
  if (o <= 0.002) return null;
  const h = y1 - y0;
  return (
    <g opacity={o}>
      <rect x={-20} y={y0} width={1640} height={h} fill={V.pared[1]} />
      <rect x={-20} y={y0} width={1640} height={h * 0.28} fill={V.pared[0]} opacity={0.55} />
      {/* Corriente: hilos claros que avanzan */}
      {Array.from({ length: 6 }, (_, i) => {
        const yy = y0 + 30 + (i / 5) * (h - 60);
        return <path key={`c${i}`} d={`M-20,${yy} L1620,${yy}`} stroke={V.pared[3]} strokeWidth={3} strokeDasharray="40 120" strokeDashoffset={-(reloj / 6) - i * 37} opacity={0.35} />;
      })}
      {/* Hematíes que fluyen y entran y salen fundiéndose */}
      {Array.from({ length: 11 }, (_, i) => {
        const X = ((hash(i, 41) * 1800 + reloj * (0.07 + hash(i, 42) * 0.03)) % 1800) - 100;
        const entra = tramo(Math.min(X + 100, 1700 - X), 0, 160);
        return <Hematie key={`h${i}`} x={X} y={y0 + 40 + hash(i, 43) * (h - 80)} r={hash(i, 44) * 180 + reloj / 40} k={0.55 + hash(i, 45) * 0.2} lado={hash(i, 46) > 0.6 ? 0.85 : 0} o={entra} />;
      })}
      {/* Albúminas libres en el plasma */}
      {Array.from({ length: 3 }, (_, i) => {
        const X = ((hash(i, 47) * 1800 + reloj * 0.05) % 1800) - 100;
        return <Albumina key={`a${i}`} x={X} y={y0 + h * 0.55} k={0.42} reloj={reloj} fase={i} o={tramo(Math.min(X + 100, 1700 - X), 0, 160)} />;
      })}
      {/* Endotelio fenestrado y espacio de Disse */}
      {Array.from({ length: 9 }, (_, i) => <rect key={`e${i}`} x={-20 + i * 190 + 14} y={y1 - 8} width={162} height={22} rx={11} fill={V.endo[0]} />)}
      <rect x={-20} y={y1 + 14} width={1640} height={34} fill="#FFE6A8" opacity={0.5} />
    </g>
  );
}

const Reflujo: Lamina = ({ p, reloj }) => {
  const sube = (i: number) => (reloj / 2800 + i / 2) % 1;
  return (
    <g>
      <Bandera x={800} y={50} txt="un tránsito imperfecto" color="#1E9E6A" p={p('imperfecto')} t={30} punta="no" />
      <Sangre y0={100} y1={330} reloj={reloj} o={tramo(p('imperfecto'), 0, 0.4)} />
      <Txt x={90} y={130} txt="sangre de la sinusoide" t={22} p={p('imperfecto')} color="#FFFFFF" ancla="start" />
      <Hepatocito x0={60} x1={1110} y0={400} y1={960} o={tramo(p('imperfecto'), 0, 0.4)} sem={4} />
      <Hepatocito x0={1150} x1={1380} y0={400} y1={960} o={tramo(p('imperfecto'), 0, 0.4)} sem={5} />
      {/* Canalículo entre los dos: hacia allí debería ir todo */}
      <rect x={1112} y={420} width={36} height={520} rx={18} fill={B.bilis[1]} opacity={tramo(p('imperfecto'), 0, 0.4)} />
      {/* La no conjugada refluye y vuelve a su albúmina */}
      <Flecha a={[300, 640]} b={[300, 340]} p={p('refluye')} color="#E3203F" w={8} />
      {[0, 1].map((i) => <Tetrapirrol key={`n${i}`} x={360 + i * 30} y={lerp(620, 250, sube(i))} k={0.2} plegada={1} tono={B.bilirrubina} o={p('refluye') * tramo(Math.min(sube(i), 1 - sube(i)), 0, 0.12)} />)}
      <Albumina x={430} y={230} k={0.7} reloj={reloj} o={tramo(p('albumina'), 0, 0.4)} />
      <Tetrapirrol x={430} y={190} k={0.2} plegada={1} tono={B.bilirrubina} o={tramo(p('albumina'), 0.3, 0.8)} />
      <Txt x={360} y={720} txt="la no conjugada vuelve a la albúmina" t={24} p={p('albumina')} color="#FFFFFF" />
      {/* La conjugada sube a la sangre y tiene dos destinos */}
      {[0, 1].map((i) => <Tetrapirrol key={`c${i}`} x={800 + i * 30} y={lerp(620, 250, sube(i + 0.5))} k={0.18} colitas={2} tono={B.conjugada} o={p('destinos') * tramo(Math.min(sube(i + 0.5), 1 - sube(i + 0.5)), 0, 0.12)} />)}
      <Flecha a={[740, 640]} b={[740, 340]} p={p('destinos')} color="#E3203F" w={8} />
      <Txt x={800} y={720} txt="la conjugada: dos destinos" t={24} p={p('destinos')} color="#FFFFFF" />
      {/* Destino 1: un hepatocito más adelante la recapta por OATP */}
      <Poro x={1265} y={380} k={0.85} tono={OATP} r={180} bombea={reloj} tallo={30} o={tramo(p('recaptan'), 0, 0.4)} />
      <Flecha a={[880, 230]} b={[1240, 300]} c={[1080, 200]} p={p('recaptan')} color="#FFE08A" w={6} />
      <Chip x={1265} y={480} txt="OATP: la recapta" color="#C77800" p={p('recaptan')} t={22} />
      {/* Destino 2: el riñón la filtra */}
      <Sale p={p('rinon')} x={1490} y={700} k={0.42}><Rinon /></Sale>
      <Flecha a={[1490, 350]} b={[1490, 580]} p={p('rinon')} color="var(--cit-flecha)" w={7} />
      <Txt x={1490} y={850} txt="o el riñón la filtra" t={22} p={p('rinon')} />
    </g>
  );
};

// ─── Vías biliares en vista anterior ───────────────────────────────────────────
// Hígado arriba a la izquierda (lado derecho del paciente), sus conductos que confluyen en el hilio, el hepático
// común, el cístico hacia la vesícula, el colédoco que baja detrás de la cabeza del páncreas y se une al Wirsung en
// la ampolla de Vater, sobre la pared del duodeno, que abraza la cabeza del páncreas en su «C».

const HILIO: [number, number] = [560, 410];
const UNION: [number, number] = [620, 560];
const AMPOLLA: [number, number] = [790, 770];
const INTRA = ['M250,230 C340,280 460,340 560,410', 'M360,160 C420,240 500,330 560,410', 'M540,170 C550,260 556,340 560,410', 'M660,190 C640,270 600,350 560,410', 'M690,280 C650,320 600,370 560,410'];
const HEPATICO = `M${HILIO[0]},${HILIO[1]} C580,470 600,520 ${UNION[0]},${UNION[1]}`;
const CISTICO = `M${UNION[0]},${UNION[1]} C590,575 540,560 500,555`;
const COLEDOCO = `M${UNION[0]},${UNION[1]} C650,640 720,700 ${AMPOLLA[0]},${AMPOLLA[1]}`;
const DUODENO = 'M1040,560 C900,560 780,580 760,660 C740,760 740,860 820,900 C900,940 1010,920 1070,860';
const PANCREAS = 'M800,700 C830,640 920,630 1000,640 C1120,600 1280,560 1440,560 C1500,560 1520,600 1490,630 C1420,680 1260,690 1120,710 C1040,720 1000,800 940,830 C880,860 790,800 800,700 Z';

/** Punto de un camino de varios tramos en línea recta entre puntos (para la bilis que corre). */
const RUTA: [number, number][] = [[360, 160], [460, 290], [560, 410], [590, 490], [620, 560], [690, 660], [790, 770], [800, 820], [860, 890]];
const porRuta = (u: number): [number, number] => {
  const t = clamp(u) * (RUTA.length - 1), i = Math.min(RUTA.length - 2, Math.floor(t)), f = t - i;
  return [lerp(RUTA[i][0], RUTA[i + 1][0], f), lerp(RUTA[i][1], RUTA[i + 1][1], f)];
};

function Conducto({ d, w, p = 1, o = 1 }: { d: string; w: number; p?: number; o?: number }) {
  return (
    <g opacity={o} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={B.bilis[0]} strokeWidth={w} strokeDasharray={`${easeOut(clamp(p)) * 900} 1000`} />
      <path d={d} stroke={B.bilis[1]} strokeWidth={w * 0.62} strokeDasharray={`${easeOut(clamp(p)) * 900} 1000`} />
      <path d={d} stroke={B.bilis[2]} strokeWidth={w * 0.14} strokeDasharray={`${easeOut(clamp(p)) * 900} 1000`} opacity={0.8} transform={`translate(${-w * 0.14},${-w * 0.1})`} />
    </g>
  );
}

/** Rótulo con su línea guía hasta la estructura. */
function Nombre({ x, y, a, txt, p, ancla = 'start' }: { x: number; y: number; a: [number, number]; txt: string; p: number; ancla?: 'start' | 'end' }) {
  return (
    <g>
      <Flecha a={[x + (ancla === 'start' ? -8 : 8), y]} b={a} p={p} color="var(--cit-flecha)" w={3} cabeza={false} />
      <Txt x={x} y={y} txt={txt} t={22} p={p} ancla={ancla} />
    </g>
  );
}

const Conductos: Lamina = ({ p, reloj }) => {
  const late = 1 + Math.sin(reloj / 900) * 0.015;
  return (
    <g>
      <Bandera x={1250} y={70} txt="el último tramo" color="#1E9E6A" p={p('tramo')} t={28} punta="no" />
      {/* Páncreas lobulado con su conducto de Wirsung */}
      <g opacity={tramo(p('coledoco'), 0, 0.4)}>
        <path d={PANCREAS} fill="#C98A2A" />
        <path d={PANCREAS} fill="#F2C060" transform="translate(-3,-4)" />
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={860 + i * 38} cy={690 - i * 6 + Math.sin(i * 1.7) * 14} r={14} fill="#FFE0A0" opacity={0.45} />)}
        <path d={`M1470,595 C1300,620 1120,650 1000,690 C900,720 840,750 ${AMPOLLA[0]},${AMPOLLA[1]}`} fill="none" stroke="#E0A030" strokeWidth={8} strokeLinecap="round" />
      </g>
      {/* Hígado con su árbol biliar */}
      <Sale p={p('tramo')} x={440} y={260} k={0.86}><Higado corte={false} /></Sale>
      {INTRA.map((d, i) => <Conducto key={i} d={d} w={10 + i % 2 * 4} p={p('conductos')} o={tramo(p('conductos'), 0, 0.3)} />)}
      <Conducto d={HEPATICO} w={26} p={p('conductos')} />
      {/* Vesícula biliar con el cístico */}
      <Conducto d={CISTICO} w={18} p={p('vesicula')} />
      <g transform={`translate(440,560) rotate(-20) scale(${late * 0.85})`} opacity={tramo(p('vesicula'), 0, 0.4)}>
        <path d="M0,-90 C-70,-80 -90,20 -50,80 C-20,120 40,120 60,70 C80,20 60,-80 0,-90 Z" fill={B.bilis[0]} />
        <path d="M-2,-80 C-62,-70 -78,18 -44,72 C-18,106 34,106 52,62 C70,18 52,-70 -2,-80 Z" fill={mezclaBilis(p('vesicula'))} />
        <path d="M-40,-30 Q-50,10 -36,40" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.55} />
      </g>
      {/* Colédoco, que se mete detrás de la cabeza del páncreas */}
      <Conducto d={COLEDOCO} w={30} p={p('coledoco')} />
      {/* Duodeno en «C» */}
      <g opacity={tramo(p('duodeno'), 0, 0.4)}>
        <path d={DUODENO} fill="none" stroke="#B5245E" strokeWidth={96} strokeLinecap="round" />
        <path d={DUODENO} fill="none" stroke="#F27BA0" strokeWidth={74} strokeLinecap="round" />
        <path d={DUODENO} fill="none" stroke="#FFD0DE" strokeWidth={26} strokeLinecap="round" opacity={0.8} />
        {/* Pliegues circulares de la mucosa */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = 0.08 + i * 0.1, pts = [[1040, 560], [900, 562], [780, 590], [756, 680], [748, 780], [790, 880], [880, 920], [990, 905], [1070, 860]];
          const a = pts[Math.min(8, Math.round(t * 8))];
          return <circle key={i} cx={a[0]} cy={a[1]} r={6} fill="#C2407A" opacity={0.5} />;
        })}
      </g>
      {/* Píloro: el duodeno empieza en el estómago */}
      <g opacity={tramo(p('duodeno'), 0, 0.4)}><ellipse cx={1060} cy={560} rx={22} ry={52} fill="#B5245E" /><ellipse cx={1064} cy={560} rx={12} ry={36} fill="#7A1A44" /></g>
      {/* Ampolla de Vater */}
      <g opacity={tramo(p('duodeno'), 0.3, 0.8)}><circle cx={AMPOLLA[0]} cy={AMPOLLA[1]} r={16} fill="#7A2A4A" /><circle cx={AMPOLLA[0] - 4} cy={AMPOLLA[1] - 4} r={7} fill="#FFC0D0" /></g>
      {/* La bilis que corre del hígado al duodeno, y la que entra y sale de la vesícula */}
      <Flujo camino={porRuta} reloj={reloj} n={12} vel={0.00008} tono={B.conjugada} R={7} o={tramo(p('conductos'), 0, 0.4)} />
      <Flujo camino={(u) => [lerp(UNION[0], 470, u), lerp(UNION[1], 560, u)]} reloj={reloj + 900} n={3} vel={0.0001} tono={B.conjugada} R={6} o={tramo(p('vesicula'), 0, 0.4)} />
      {/* Nombres, cada uno junto a lo suyo */}
      <Nombre x={780} y={150} a={[640, 220]} txt="conductos biliares" p={p('conductos')} />
      <Nombre x={680} y={470} a={[595, 490]} txt="hepático común" p={p('conductos')} />
      <Nombre x={300} y={700} a={[420, 610]} txt="vesícula" p={p('vesicula')} ancla="end" />
      <Nombre x={430} y={480} a={[540, 560]} txt="cístico" p={p('vesicula')} ancla="end" />
      <Nombre x={560} y={790} a={[690, 668]} txt="colédoco" p={p('coledoco')} ancla="end" />
      <Nombre x={1180} y={960} a={[1000, 912]} txt="duodeno" p={p('duodeno')} />
      <Nombre x={1180} y={820} a={[AMPOLLA[0] + 16, AMPOLLA[1]]} txt="ampolla de Vater" p={tramo(p('duodeno'), 0.3, 1)} />
      <Nombre x={1330} y={480} a={[1300, 585]} txt="páncreas" p={p('coledoco')} />
      <Nombre x={1110} y={470} a={[1062, 520]} txt="píloro" p={p('duodeno')} />
      <Bandera x={1250} y={170} txt="no se modifica ni se reabsorbe" color="#9C8A00" p={p('modifica')} t={22} punta="no" />
      <Bandera x={1250} y={360} txt="la bilis llega al intestino" color="#0C9E9A" p={p('intestino')} t={22} punta="no" />
    </g>
  );
};

function mezclaBilis(q: number) {
  // Más concentrada: de verde claro a verde oscuro dorado.
  const a = [180, 200, 42], b = [140, 150, 10];
  const t = clamp(q);
  return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
}

const LAMINAS: Lamina[] = [Puerta, Cuesta, Compartida, LaBilis, Reflujo, Conductos];
export default LAMINAS;
