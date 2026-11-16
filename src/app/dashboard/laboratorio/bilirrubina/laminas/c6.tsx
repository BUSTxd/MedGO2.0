'use client';
// Capítulo 6 · El intestino y sus bacterias

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { B, Bacilo, Bandera, Cruz, Flecha, Flujo, Frasco, Gota, HematieRoto, Hematie, Higado, Pastilla, Poro, Rinon, Rostro, Sale, Tetrapirrol, Tijera, Tira, TuboOrina, Txt, TXB, Visto, clamp, easeBack, easeOut, hash, lerp, mezcla, tijeretazo, tramo } from '../Piezas';

const FLORA = ['#0A7F86', '#16B9BE', '#7FEDE8'] as const;
const INCOLORO = ['#B8B0C8', '#EDE8F5', '#FFFFFF'] as const;
const PARED = ['#9A2058', '#E06A98', '#FFC2D8'] as const;
const ESTERCOBILINOGENO = ['#8A6A50', '#C8A888', '#F0DCC8'] as const;

// ─── Piezas del capítulo ───────────────────────────────────────────────────────

/** Tubo de intestino delgado visto en corte longitudinal, con vellosidades (cada una con su capilar) en las dos paredes.
 *  Los extremos se funden con el fondo (máscara), así nada se sale del borde de golpe. */
function Delgado({ y = 500, alto = 300, reloj, o = 1 }: { y?: number; alto?: number; reloj: number; o?: number }) {
  if (o <= 0.002) return null;
  const y0 = y - alto / 2, y1 = y + alto / 2;
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id="bi-delg-g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FFF" stopOpacity={0} /><stop offset="0.07" stopColor="#FFF" stopOpacity={1} />
          <stop offset="0.93" stopColor="#FFF" stopOpacity={1} /><stop offset="1" stopColor="#FFF" stopOpacity={0} />
        </linearGradient>
        <mask id="bi-delg-m" maskUnits="userSpaceOnUse" x={0} y={y0 - 140} width={1600} height={alto + 280}><rect x={0} y={y0 - 140} width={1600} height={alto + 280} fill="url(#bi-delg-g)" /></mask>
      </defs>
      <g mask="url(#bi-delg-m)">
        <rect x={0} y={y0 - 90} width={1600} height={alto + 180} fill={PARED[0]} />
        <rect x={0} y={y0 - 76} width={1600} height={alto + 152} fill={PARED[1]} />
        <rect x={0} y={y0} width={1600} height={alto} fill="#FFF3D6" />
        {Array.from({ length: 20 }, (_, i) => {
          const x = 40 + i * 80, h = 64 + Math.sin(reloj / 900 + i) * 6, hb = 64 + Math.sin(reloj / 900 + i + 2) * 6;
          return (
            <g key={i}>
              <path d={`M${x - 22},${y0 - 2} L${x - 22},${y0 + h - 22} Q${x},${y0 + h + 6} ${x + 22},${y0 + h - 22} L${x + 22},${y0 - 2} Z`} fill={PARED[1]} />
              <path d={`M${x - 6},${y0} L${x - 6},${y0 + h - 18} Q${x},${y0 + h - 8} ${x + 6},${y0 + h - 18} L${x + 6},${y0}`} fill="none" stroke="#C2185B" strokeWidth={3} opacity={0.7} />
              <path d={`M${x + 18},${y1 + 2} L${x + 18},${y1 - hb + 22} Q${x + 40},${y1 - hb - 6} ${x + 62},${y1 - hb + 22} L${x + 62},${y1 + 2} Z`} fill={PARED[1]} />
              <path d={`M${x + 34},${y1} L${x + 34},${y1 - hb + 18} Q${x + 40},${y1 - hb + 8} ${x + 46},${y1 - hb + 18} L${x + 46},${y1}`} fill="none" stroke="#C2185B" strokeWidth={3} opacity={0.7} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** Colon con sus haustras (bolsillos) visto en corte: pared y luz festoneadas, que se contraen despacio. */
function Colon({ y = 520, alto = 380, reloj, o = 1 }: { y?: number; alto?: number; reloj: number; o?: number }) {
  if (o <= 0.002) return null;
  const n = 6, w = 1600 / n, top = y - alto / 2, bot = y + alto / 2;
  // Cada haustra es un bolsillo: la luz se abomba entre dos pliegues semilunares.
  const borde = (s: number) => Array.from({ length: n }, (_, i) => {
    const x0 = i * w, apr = Math.sin(reloj / 1100 + i) * 8;
    return `Q${(x0 + w / 2).toFixed(1)},${(y + s * (alto / 2 + 50 + apr)).toFixed(1)} ${(x0 + w).toFixed(1)},${(y + s * alto / 2).toFixed(1)}`;
  }).join(' ');
  return (
    <g opacity={o}>
      <rect x={0} y={top - 100} width={1600} height={alto + 200} fill="#8A2A5A" />
      <path d={`M0,${top} ${borde(-1)} L1600,${bot} L0,${bot} Z`} fill="#C2407A" />
      <path d={`M0,${top + 12} ${borde(-1).replace(/,(\d+(\.\d+)?)/g, (m, v) => `,${(Number(v) + 12).toFixed(1)}`)} L1600,${bot - 12} L0,${bot - 12} Z`} fill="#FFF0D0" />
      <path d={`M0,${bot} ${borde(1)} L1600,${bot + 120} L0,${bot + 120} Z`} fill="#8A2A5A" />
      {Array.from({ length: n - 1 }, (_, i) => <path key={i} d={`M${(i + 1) * w},${top - 20} L${(i + 1) * w},${top + 30} M${(i + 1) * w},${bot + 20} L${(i + 1) * w},${bot - 30}`} stroke="#8A2A5A" strokeWidth={16} strokeLinecap="round" />)}
    </g>
  );
}

/** Bacterias del colon que nadan solas (y entran y salen fundiéndose por los lados). */
function Flora({ n = 14, y0 = 380, y1 = 660, reloj, o = 1, sem = 3, k = 0.55 }: { n?: number; y0?: number; y1?: number; reloj: number; o?: number; sem?: number; k?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x = ((hash(i, sem) * 1800 + reloj * 0.025 * (0.4 + hash(i, sem + 1))) % 1800) - 100;
        const y = y0 + hash(i, sem + 2) * (y1 - y0) + Math.sin(reloj / 700 + i) * 10;
        return <Bacilo key={i} x={x} y={y} r={hash(i, sem + 3) * 180 + Math.sin(reloj / 900 + i) * 10} k={k} tono={FLORA} flagelo={0.6} reloj={reloj + i * 100} o={tramo(Math.min(x + 100, 1700 - x), 0, 140)} />;
      })}
    </g>
  );
}

/** Cargas polares (+ y −) que giran alrededor de un punto. */
function Cargas({ x, y, R = 70, reloj, o = 1 }: { x: number; y: number; R?: number; reloj: number; o?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const a = reloj / 1600 + (i * Math.PI) / 2, cx = x + Math.cos(a) * R, cy = y + Math.sin(a) * R * 0.6;
        const mas = i % 2 === 0;
        return <g key={i}><circle cx={cx} cy={cy} r={15} fill={mas ? '#E3203F' : '#2E78F2'} /><path d={mas ? `M${cx - 7},${cy} L${cx + 7},${cy} M${cx},${cy - 7} L${cx},${cy + 7}` : `M${cx - 7},${cy} L${cx + 7},${cy}`} stroke="#FFF" strokeWidth={4} strokeLinecap="round" /></g>;
      })}
    </g>
  );
}

// ─── Láminas ───────────────────────────────────────────────────────────────────

const Intacta: Lamina = ({ p, reloj }) => {
  const sales = p('sales');
  const u = (reloj / 2600) % 1;
  return (
    <g>
      <Bandera x={800} y={60} txt="cuarta estación: el intestino" color="#0C9E9A" p={p('intestino')} t={30} punta="no" />
      <Delgado y={440} alto={400} reloj={reloj} o={tramo(p('duodeno'), 0, 0.4)} />
      <Txt x={1450} y={170} txt="intestino delgado" t={24} p={p('duodeno')} fuerte={false} />
      {/* La conjugada pasa por el centro, intacta */}
      <Flujo camino={(w) => [lerp(0, 1600, w), 430 + Math.sin(w * 12) * 26]} reloj={reloj} n={6} vel={0.00007} tono={B.conjugada} R={13} o={p('intacta')} />
      <Sale p={p('intacta')} x={800} y={430} k={0.7}><Tetrapirrol colitas={2} tono={B.conjugada} vibra={reloj} /></Sale>
      <Cargas x={800} y={440} R={115} reloj={reloj} o={tramo(p('polar'), 0, 0.5)} />
      {/* Grande: no cabe por la puerta del epitelio */}
      <g opacity={tramo(p('grande'), 0, 0.4)}>
        <circle cx={800} cy={430} r={135} fill="none" stroke="#9C8A00" strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-reloj / 30} />
      </g>
      <Txt x={800} y={170} txt="grande y polar" t={26} p={p('grande')} color={TXB.limon} />
      {/* Sin transportador: el epitelio de abajo, liso, la rebota */}
      <g opacity={tramo(p('transportador'), 0, 0.4)}>
        <Tetrapirrol x={420} y={lerp(470, 540, Math.sin(u * Math.PI))} k={0.26} colitas={2} tono={B.conjugada} />
        <path d="M380,560 l20,22 l20,-22" fill="none" stroke="#E3203F" strokeWidth={6} strokeLinecap="round" />
        <Cruz x={480} y={700} k={0.8} />
      </g>
      <Txt x={420} y={790} txt="no tiene transportador" t={24} p={p('transportador')} />
      {/* Las sales biliares sí: su transportador las lleva a la sangre */}
      <Poro x={1180} y={590} k={0.8} tono={['#2E7A20', '#7CC84A', '#D4F2B8']} bombea={reloj} tallo={30} o={tramo(sales, 0, 0.4)} />
      {sales > 0.05 && [0, 1, 2].map((i) => {
        const v = (reloj / 2400 + i / 3) % 1;
        const [x, y] = v < 0.5 ? [lerp(1000, 1180, v * 2), 470 + v * 120] : [1180, lerp(590, 820, (v - 0.5) * 2)];
        return <Gota key={i} x={x} y={y} k={0.26} tono={B.bilis} o={sales * tramo(Math.min(v, 1 - v), 0, 0.08)} />;
      })}
      <Visto x={1270} y={720} k={0.8} o={sales} />
      <Txt x={1180} y={860} txt="las sales biliares sí se reabsorben" t={22} p={sales} />
      <Bandera x={800} y={950} txt="para ella, un túnel liso" color="#0C9E9A" p={p('tunel')} t={24} punta="no" />
    </g>
  );
};

const Desconjuga: Lamina = ({ p, reloj }) => {
  const q = p('quitan'), vuelve = p('vuelve');
  const golpe = tijeretazo(reloj, 1000);
  // Cada glucurónido se suelta con su corte; la tijera va de uno al otro.
  const c1 = tramo(q, 0.05, 0.45), c2 = tramo(q, 0.55, 0.95);
  const enSegundo = q > 0.5;
  return (
    <g>
      <Colon reloj={reloj} alto={460} y={520} o={tramo(p('colon'), 0, 0.4)} />
      <Bandera x={420} y={60} txt="en el colon, las bacterias" color="#0C9E9A" p={p('colon')} t={28} punta="no" />
      <Flora reloj={reloj} o={tramo(p('bacterias'), 0, 0.4)} />
      <Sale p={p('colon')} x={800} y={480} k={0.95}><Tetrapirrol colitas={2 - c1 - c2} plegada={easeOut(vuelve)} tono={vuelve > 0.5 ? B.bilirrubina : B.conjugada} vibra={reloj} /></Sale>
      {/* La bacteria que corta: se acerca con su β-glucuronidasa */}
      <Bacilo x={enSegundo ? 1130 : 470} y={760} r={enSegundo ? -20 : 20} k={1.1} tono={FLORA} sombra flagelo={1} reloj={reloj} o={tramo(p('tijeras'), 0, 0.4)} />
      <Tijera x={enSegundo ? 1000 : 600} y={690} r={enSegundo ? -130 : -50} k={0.95} corta={q > 0.02 && q < 0.98 ? golpe : 0.2} color="#0A7F86" o={tramo(p('tijeras'), 0, 0.4)} />
      {[c1, c2].map((c, i) => (c > 0.01 ? (
        <g key={i} transform={`translate(${lerp(i ? 870 : 730, i ? 1180 : 420, easeOut(c))},${lerp(640, 330, easeOut(c)) + Math.sin(reloj / 400 + i) * 8}) rotate(${c * 260})`} opacity={1 - 0.6 * c}>
          <polygon points="17,0 8.5,14.7 -8.5,14.7 -17,0 -8.5,-14.7 8.5,-14.7" fill={B.glucuronido[1]} transform="scale(1.7)" />
        </g>
      ) : null))}
      <Txt x={800} y={940} txt="β-glucuronidasas bacterianas: le quitan las colitas" t={26} p={p('enzima')} />
      <Bandera x={1180} y={60} txt="vuelve a ser no conjugada" color="#C46A00" p={vuelve} t={28} punta="no" />
    </g>
  );
};

/** Medallón de noticia: estrella de puntas con el año, que entra rebotando y late. */
function Noticia({ x, y, p, reloj }: { x: number; y: number; p: number; reloj: number }) {
  if (p <= 0.002) return null;
  const s = 0.6 + 0.4 * easeBack(clamp(p)), late = 1 + Math.sin(reloj / 500) * 0.03;
  const pts = Array.from({ length: 24 }, (_, i) => { const r = i % 2 ? 150 : 185, a = (i / 24) * Math.PI * 2 + reloj / 6000; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
  return (
    <g transform={`translate(${x},${y}) scale(${(s * late).toFixed(3)})`} opacity={tramo(p, 0, 0.3)}>
      <polygon points={pts} fill="#B5245E" transform="translate(8,10)" opacity={0.35} />
      <polygon points={pts} fill="#E8476A" />
      <circle r={128} fill="#FFD23F" /><circle r={112} fill="#FFE68A" />
      <text y={-34} textAnchor="middle" style={{ fontSize: 30, fontWeight: 800, fill: '#7A1E3A' }}>descubierta en</text>
      <text y={44} textAnchor="middle" style={{ fontSize: 92, fontWeight: 900, fill: '#B5245E' }}>2024</text>
      <text y={84} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#7A1E3A' }}>Nature Microbiology</text>
    </g>
  );
}

const BilR: Lamina = ({ p, reloj }) => {
  const conv = p('urobilinogeno');
  const u = (reloj / 3600) % 1;
  return (
    <g>
      <Bandera x={560} y={70} txt="la enzima que faltaba" color="#0C9E9A" p={p('secreto')} t={30} punta="no" />
      {/* Campo del microscopio: esto sí es un zoom (referencia de la E. coli) */}
      <g opacity={tramo(p('secreto'), 0, 0.4)}>
        <circle cx={560} cy={550} r={370} fill="#3A1A5A" />
        <circle cx={560} cy={550} r={350} fill="#FFF6D0" />
        {Array.from({ length: 7 }, (_, i) => <path key={`l${i}`} d={`M${230},${330 + i * 70} L${890},${330 + i * 70}`} stroke="#E8D8A0" strokeWidth={2} opacity={0.35} />)}
        {Array.from({ length: 14 }, (_, i) => {
          const a = hash(i, 2) * Math.PI * 2, rr = 120 + Math.sqrt(hash(i, 3)) * 190;
          return <Bacilo key={i} x={560 + Math.cos(a) * rr} y={550 + Math.sin(a) * rr + Math.sin(reloj / 800 + i) * 6} r={hash(i, 4) * 180 + Math.sin(reloj / 1200 + i) * 12} k={0.4} tono={FLORA} />;
        })}
      </g>
      <Sale p={p('bilr')} x={560} y={560} k={1.9}><Bacilo tono={FLORA} sombra reloj={reloj} flagelo={1} /></Sale>
      {/* La enzima BilR en su membrana, con la bilirrubina que entra amarilla y sale incolora */}
      <g opacity={tramo(p('bilr'), 0, 0.4)}>
        <path d="M520,470 C520,430 600,430 600,470 L600,500 L520,500 Z" fill="#5A2DB0" />
        <path d="M534,474 C534,448 586,448 586,474 L586,500 L534,500 Z" fill="#8A5AF0" />
        <text x={560} y={420} textAnchor="middle" style={{ fontSize: 40, fontWeight: 900, fill: 'var(--bi-violeta)' }}>BilR</text>
      </g>
      {conv > 0.05 && (
        <g>
          <Tetrapirrol x={lerp(330, 540, tramo(u, 0, 0.45))} y={lerp(300, 450, tramo(u, 0, 0.45))} k={0.26} plegada={0.6} tono={B.bilirrubina} o={(1 - tramo(u, 0.42, 0.5)) * tramo(u, 0, 0.08)} />
          <Tetrapirrol x={lerp(580, 800, tramo(u, 0.5, 1))} y={lerp(450, 300, tramo(u, 0.5, 1))} k={0.26} plegada={0.2} tono={INCOLORO} o={tramo(u, 0.5, 0.58) * (1 - tramo(u, 0.92, 1))} />
        </g>
      )}
      <Txt x={560} y={940} txt="una reductasa de Firmicutes, sobre todo Clostridia" t={24} p={p('firmicutes')} />
      <Noticia x={1250} y={290} p={p('anio')} reloj={reloj} />
      <Tetrapirrol x={1250} y={610} k={0.5} plegada={0.6} tono={B.bilirrubina} vibra={reloj} o={tramo(conv, 0, 0.4)} />
      <Flecha a={[1250, 680]} b={[1250, 760]} p={conv} color="#0A7F86" w={9} />
      <Tetrapirrol x={1250} y={820} k={0.5} plegada={0.2} tono={INCOLORO} vibra={reloj + 300} o={tramo(conv, 0.3, 0.8)} />
      <Txt x={1250} y={930} txt="bilirrubina → urobilinógeno (incoloro)" t={24} p={conv} />
    </g>
  );
};

/** Muestra de flora en un círculo pequeño: muchas o pocas bacterias con BilR. */
function Muestra({ x, y, n, reloj, o, sem }: { x: number; y: number; n: number; reloj: number; o: number; sem: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={92} fill="#3A1A5A" /><circle cx={x} cy={y} r={84} fill="#FFF6D0" />
      {Array.from({ length: n }, (_, i) => {
        const a = hash(i, sem) * Math.PI * 2, rr = Math.sqrt(hash(i, sem + 1)) * 62;
        return <Bacilo key={i} x={x + Math.cos(a) * rr} y={y + Math.sin(a) * rr + Math.sin(reloj / 700 + i) * 3} r={hash(i, sem + 2) * 180} k={0.22} tono={FLORA} />;
      })}
    </g>
  );
}

const Quien: Lamina = ({ p, reloj }) => {
  const fichas = [
    { n: 'adultos', x: 330, cara: <Rostro quien="adulto" reloj={reloj} />, flora: 14, txt: 'adultos sanos', sub: 'casi todos tienen BilR', ok: true },
    { n: 'recien', x: 800, cara: <Rostro quien="bebe" piel={['#D07A6A', '#F2B0A0']} pelo="#5A3A1A" ropa={['#5A8AE0', '#9FC4FF']} reloj={reloj + 700} />, flora: 2, txt: 'recién nacidos', sub: 'menos frecuente', ok: false },
    { n: 'eii', x: 1270, cara: <Rostro quien="adulta" piel={['#8A4A3A', '#B8705A']} pelo="#1A1030" ropa={['#B5245E', '#F27BA0']} reloj={reloj + 1400} triste={0.6} />, flora: 4, txt: 'enfermedad inflamatoria intestinal', sub: 'menos frecuente', ok: false },
  ];
  return (
    <g>
      <Bandera x={800} y={70} txt="¿todos tenemos BilR?" color="#0C9E9A" p={p('todos')} t={30} punta="no" />
      {fichas.map((f) => (
        <g key={f.n}>
          <Sale p={p(f.n)} x={f.x} y={330 + Math.sin(reloj / 900 + f.x) * 4} k={0.95}>{f.cara as ReactNode}</Sale>
          <Muestra x={f.x + (f.n === 'eii' ? -110 : 110)} y={520} n={f.flora} reloj={reloj} o={tramo(p(f.n), 0.3, 0.8)} sem={f.x} />
          {f.ok ? <Visto x={f.x} y={620} k={0.9} o={p(f.n)} /> : <Flecha a={[f.x, 590]} b={[f.x, 650]} p={p(f.n)} color="#E3203F" w={8} />}
          <Txt x={f.x} y={700} txt={f.txt} t={f.n === 'eii' ? 22 : 26} p={p(f.n)} />
          <Txt x={f.x} y={740} txt={f.sub} t={20} p={p(f.n)} fuerte={false} color={f.ok ? TXB.verde : TXB.hemo} />
        </g>
      ))}
      <Bandera x={800} y={880} txt="guarda este dato: la ictericia del recién nacido" color="#C2307A" p={p('guarda')} t={24} punta="no" />
    </g>
  );
};

const Cadena: Lamina = ({ p, reloj }) => {
  const etapas = [
    { n: 'amarilla', txt: 'bilirrubina', sub: 'amarilla', tono: B.bilirrubina, tx: TXB.ambar },
    { n: 'incoloro', txt: 'urobilinógeno', sub: 'incoloro', tono: INCOLORO, tx: undefined },
    { n: 'esterco', txt: 'estercobilinógeno', sub: '', tono: ESTERCOBILINOGENO, tx: TXB.marron },
    { n: 'estercobilina', txt: 'estercobilina', sub: 'marrón', tono: B.estercobilina, tx: TXB.marron },
  ];
  const xs = [220, 600, 980, 1360];
  // Una molécula recorre la cadena sin parar y cambia de color en cada bacteria.
  const u = (reloj / 9000) % 1, seg = Math.min(3, Math.floor(u * 4)), f = u * 4 - seg;
  const viajera = etapas[Math.min(3, seg + (f > 0.6 ? 1 : 0))];
  return (
    <g>
      <Bandera x={800} y={70} txt="¿de dónde sale el color de las heces?" color="#8B5A2B" p={p('color')} t={28} punta="no" />
      {/* Franja de color de la cadena */}
      <g opacity={tramo(p('cadena'), 0, 0.4)}>
        {etapas.map((e, i) => <rect key={e.n} x={xs[i] - 190} y={190} width={380} height={34} rx={i === 0 || i === 3 ? 17 : 0} fill={e.tono[1]} />)}
      </g>
      {etapas.map((e, i) => (
        <g key={e.n}>
          <Tetrapirrol x={xs[i]} y={430 + Math.sin(reloj / 700 + i) * 6} k={0.55} plegada={0.3} tono={e.tono} o={tramo(p(e.n), 0, 0.4)} />
          <Txt x={xs[i]} y={570} txt={e.txt} t={26} p={p(e.n)} color={e.tx} />
          {e.sub && <Txt x={xs[i]} y={610} txt={e.sub} t={22} p={p(e.n)} fuerte={false} />}
          {i < 3 && (
            <g opacity={tramo(p(etapas[i + 1].n), 0, 0.4)}>
              <Flecha a={[xs[i] + 110, 430]} b={[xs[i + 1] - 110, 430]} p={p(etapas[i + 1].n)} color="var(--cit-flecha)" w={7} />
              <Bacilo x={(xs[i] + xs[i + 1]) / 2} y={350 + Math.sin(reloj / 500 + i) * 8} r={-10} k={0.5} tono={FLORA} flagelo={1} reloj={reloj} />
            </g>
          )}
        </g>
      ))}
      {p('marron') > 0.05 && <Tetrapirrol x={lerp(xs[seg], xs[Math.min(3, seg + 1)], easeOut(clamp(f * 1.4)))} y={300} k={0.3} plegada={0.3} tono={viajera.tono} o={tramo(Math.min(u, 1 - u), 0, 0.03)} />}
      {/* La muestra: un frasco con su contenido marrón, que se va oscureciendo */}
      <Sale p={p('marron')} x={620} y={800} k={1}><Frasco tono={[mezcla('#C8A070', B.estercobilina[0], easeOut(p('marron'))), mezcla('#E8C8A0', B.estercobilina[1], easeOut(p('marron'))), B.estercobilina[2]]} /></Sale>
      <Txt x={760} y={790} txt="estercobilina: el pigmento marrón" t={28} p={p('marron')} ancla="start" color={TXB.marron} />
      <Txt x={760} y={835} txt="de las heces" t={24} p={p('marron')} ancla="start" fuerte={false} />
    </g>
  );
};

// ─── Circuito enterohepático (anatomía esquemática) ───────────────────────────

const RUTA_BILIS: [number, number][] = [[470, 330], [560, 420], [610, 520], [660, 600], [760, 640], [900, 660], [1060, 660], [1180, 700], [1220, 790]];
const RUTA_PORTA: [number, number][] = [[1220, 790], [1150, 860], [940, 880], [700, 860], [560, 780], [430, 620], [380, 470], [420, 340]];
const porPuntos = (pts: [number, number][]) => (u: number): [number, number] => {
  const t = clamp(u) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(t)), f = t - i;
  return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
};
const linea = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

function Rotulo({ x, y, a, txt, p, ancla = 'start' }: { x: number; y: number; a: [number, number]; txt: string; p: number; ancla?: 'start' | 'end' }) {
  return <g><Flecha a={[x + (ancla === 'start' ? -8 : 8), y]} b={a} p={p} color="var(--cit-flecha)" w={3} cabeza={false} /><Txt x={x} y={y} txt={txt} t={22} p={p} ancla={ancla} /></g>;
}

const Enterohepatica: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={1180} y={70} txt="la circulación enterohepática" color="#0C9E9A" p={p('circulacion')} t={28} punta="no" />
    {/* Hígado y vesícula */}
    <Sale p={p('eses')} x={430} y={240} k={0.7}><Higado corte={false} /></Sale>
    <g opacity={tramo(p('eses'), 0, 0.4)}>
      <path d="M560,440 C520,460 510,520 540,550 C570,580 610,560 615,520 C620,480 600,440 560,440 Z" fill={B.bilis[0]} />
      <path d="M560,452 C530,470 524,516 546,540 C568,562 600,548 604,518 C608,486 592,456 560,452 Z" fill={B.bilis[1]} />
    </g>
    {/* Intestino: el delgado en asas dentro del marco del colon */}
    <g opacity={tramo(p('eses'), 0, 0.4)}>
      <path d="M760,640 C1000,620 1240,640 1260,700 C1280,770 1260,900 1180,920 C1000,960 800,960 700,920 C620,890 640,760 700,700" fill="none" stroke="#8A2A5A" strokeWidth={70} strokeLinecap="round" />
      <path d="M760,640 C1000,620 1240,640 1260,700 C1280,770 1260,900 1180,920 C1000,960 800,960 700,920 C620,890 640,760 700,700" fill="none" stroke="#C2407A" strokeWidth={50} strokeLinecap="round" />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={760 + (i % 5) * 100 + (Math.floor(i / 5) % 2) * 50} cy={740 + Math.floor(i / 5) * 80} r={36} fill="#F27BA0" stroke="#C2407A" strokeWidth={8} />)}
    </g>
    {/* Conductos biliares y vena porta */}
    <path d={linea(RUTA_BILIS.slice(0, 5))} fill="none" stroke={B.bilis[0]} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('eses'), 0, 0.4)} />
    <path d={linea(RUTA_PORTA)} fill="none" stroke="#2E4AA0" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${easeOut(p('porta')) * 1800} 2000`} />
    <path d={linea(RUTA_PORTA)} fill="none" stroke="#5A7AE0" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${easeOut(p('porta')) * 1800} 2000`} />
    {/* Lo que corre: bilis hasta el intestino; urobilinógeno de vuelta por la porta */}
    <Flujo camino={porPuntos(RUTA_BILIS)} reloj={reloj} n={8} vel={0.00008} tono={B.conjugada} R={10} o={tramo(p('eses'), 0, 0.4)} />
    <Flujo camino={porPuntos(RUTA_PORTA)} reloj={reloj} n={8} vel={0.00008} tono={INCOLORO} R={11} o={tramo(p('absorbe'), 0, 0.4)} />
    <Sale p={p('absorbe')} x={1220} y={790} k={0.7}><Bacilo tono={FLORA} reloj={reloj} flagelo={1} /></Sale>
    <Rotulo x={1330} y={850} a={[1250, 800]} txt="se absorbe en el colon" p={p('absorbe')} />
    <Rotulo x={200} y={700} a={[440, 640]} txt="vena porta" p={p('porta')} ancla="end" />
    <Rotulo x={760} y={330} a={[560, 330]} txt="el hígado lo excreta otra vez" p={p('excreta')} />
    <Rotulo x={760} y={540} a={[612, 520]} txt="vesícula y colédoco" p={p('eses')} />
    <Rotulo x={1330} y={560} a={[1240, 650]} txt="intestino" p={p('eses')} />
    <Bandera x={1180} y={180} txt="un circuito que da la vuelta" color="#0C9E9A" p={p('vuelta')} t={24} punta="no" />
  </g>
);

/** Riñones con uréteres y vejiga (vista anterior). */
function Urinario({ x, y, k = 1, o = 1, reloj }: { x: number; y: number; k?: number; o?: number; reloj: number }) {
  if (o <= 0.002) return null;
  const gota = (reloj / 1500) % 1;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
      <g transform="translate(-150,0) scale(0.55)"><Rinon /></g>
      <g transform="translate(150,0) scale(-0.55,0.55)"><Rinon /></g>
      <path d="M-128,40 C-110,130 -60,200 -30,250 M128,40 C110,130 60,200 30,250" fill="none" stroke="#E8B850" strokeWidth={14} strokeLinecap="round" />
      <path d="M-80,250 C-80,200 80,200 80,250 C80,320 40,340 0,340 C-40,340 -80,320 -80,250 Z" fill="#E8B850" />
      <path d="M-66,254 C-66,216 66,216 66,254 C66,310 34,326 0,326 C-34,326 -66,310 -66,254 Z" fill="#FFE07A" />
      {[-1, 1].map((s) => <circle key={s} cx={s * lerp(120, 40, gota)} cy={lerp(60, 240, gota)} r={7} fill="#FFE07A" opacity={1 - gota} />)}
    </g>
  );
}

const Orina: Lamina = ({ p, reloj }) => {
  const ox = p('urobilina');
  return (
    <g>
      <Sale p={p('resto')} x={230} y={260} k={0.4}><Higado corte={false} /></Sale>
      <Txt x={230} y={400} txt="una parte mínima escapa" t={22} p={p('escapa')} />
      {/* Sangre sistémica: un vaso con hematíes y urobilinógeno incoloro */}
      <g opacity={tramo(p('sangre'), 0, 0.4)}>
        <path d="M330,300 C480,300 520,460 640,460" fill="none" stroke="#9E0B2E" strokeWidth={60} strokeLinecap="round" />
        <path d="M330,300 C480,300 520,460 640,460" fill="none" stroke="#E3203F" strokeWidth={42} strokeLinecap="round" />
      </g>
      <Flujo camino={(u) => [lerp(330, 640, u), 300 + 160 * (u * u * (3 - 2 * u))]} reloj={reloj} n={5} tono={INCOLORO} R={9} o={p('sangre')} />
      <Urinario x={820} y={330} k={1} reloj={reloj} o={tramo(p('rinon'), 0, 0.4)} />
      <Txt x={820} y={250} txt="riñones" t={24} p={p('rinon')} />
      {/* Menos del 5 %: cuadrícula de 100 */}
      <g opacity={tramo(p('cinco'), 0, 0.4)}>
        {Array.from({ length: 100 }, (_, i) => <rect key={i} x={1110 + (i % 10) * 34} y={160 + Math.floor(i / 10) * 34} width={26} height={26} rx={6} fill={i < 4 ? '#FFB21E' : 'var(--vas-suave)'} />)}
      </g>
      <Txt x={1265} y={530} txt="menos del 5 % sale en la orina" t={24} p={p('cinco')} />
      {/* En la orina, el urobilinógeno se oxida a urobilina: amarilla */}
      <Sale p={p('oxida')} x={1000} y={760} k={0.75}><TuboOrina oscuro={0} /></Sale>
      {[0, 1, 2].map((i) => { const u = (reloj / 1800 + i / 3) % 1; return <circle key={i} cx={1110 + i * 18} cy={lerp(760, 640, u)} r={9} fill="#B0123A" opacity={p('oxida') * (1 - u)} />; })}
      <Txt x={1130} y={620} txt="O₂" t={24} p={p('oxida')} color={TXB.hemo} />
      <Tetrapirrol x={1300} y={740} k={0.4} plegada={0.2} tono={INCOLORO} o={1 - tramo(ox, 0, 0.6)} vibra={reloj} />
      <Tetrapirrol x={1300} y={740} k={0.4} plegada={0.2} tono={B.urobilina} o={tramo(ox, 0, 0.6)} vibra={reloj} />
      <Txt x={1300} y={850} txt="se oxida a urobilina" t={24} p={p('oxida')} />
      <Bandera x={800} y={950} txt="urobilina: el amarillo de la orina" color="#C9A400" p={p('amarillo')} t={26} punta="no" />
    </g>
  );
};

/** Pared del colon en corte, para el panel de comparación: luz arriba y un capilar abajo. */
function Panel({ x, titulo, flora, vuelve, reloj, p, o }: { x: number; titulo: string; flora: number; vuelve: boolean; reloj: number; p: number; o: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <rect x={x - 340} y={180} width={680} height={640} rx={44} fill="var(--vas-suave)" />
      <text x={x} y={235} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: 'var(--cit-texto)' }}>{titulo}</text>
      <rect x={x - 320} y={270} width={640} height={250} rx={20} fill="#FFF0D0" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={x - 316 + i * 80} y={520} width={72} height={90} rx={22} fill={PARED[1]} />)}
      <rect x={x - 320} y={640} width={640} height={110} rx={40} fill="#9E0B2E" />
      <rect x={x - 320} y={652} width={640} height={86} rx={36} fill="#E3203F" />
      {Array.from({ length: 3 }, (_, i) => <Hematie key={i} x={x - 280 + ((reloj * 0.06 + i * 220) % 560)} y={695} k={0.4} lado={0.85} />)}
      {Array.from({ length: flora }, (_, i) => <Bacilo key={i} x={x - 260 + hash(i, 61) * 520} y={300 + hash(i, 62) * 180 + Math.sin(reloj / 600 + i) * 6} r={hash(i, 63) * 180} k={0.4} tono={FLORA} />)}
      {[0, 1, 2].map((i) => {
        const u = (reloj / 3200 + i / 3) % 1;
        if (vuelve) {
          const y = lerp(320, 690, u);
          return <Tetrapirrol key={i} x={x - 160 + i * 160} y={y} k={0.22} plegada={0.6} tono={B.bilirrubina} o={tramo(Math.min(u, 1 - u), 0, 0.1)} />;
        }
        const conv = tramo(u, 0.2, 0.5);
        return <g key={i}><Tetrapirrol x={x - 160 + i * 160} y={lerp(320, 470, u)} k={0.22} plegada={0.6} tono={B.bilirrubina} o={(1 - conv) * tramo(u, 0, 0.1)} /><Tetrapirrol x={x - 160 + i * 160} y={lerp(320, 470, u)} k={0.22} plegada={0.2} tono={INCOLORO} o={conv * (1 - tramo(u, 0.85, 1))} /></g>;
      })}
      {vuelve ? <Flecha a={[x + 270, 520]} b={[x + 270, 660]} p={p} color="#E3203F" w={8} /> : <Cruz x={x + 270} y={580} k={0.8} o={p} />}
    </g>
  );
}

const NoVuelve: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={80} txt="si le quitan las colitas, ¿no vuelve a absorberse?" color="#0C9E9A" p={p('duda')} t={26} punta="no" />
    <Panel x={420} titulo="adulto: casi no" flora={12} vuelve={false} reloj={reloj} p={p('transforman')} o={tramo(p('casi'), 0, 0.4)} />
    <Panel x={1180} titulo="recién nacido: sí puede" flora={Math.round(2 + 4 * (1 - p('flora')))} vuelve reloj={reloj} p={p('sangre')} o={tramo(p('recien'), 0, 0.4)} />
    <Txt x={420} y={870} txt="las bacterias la transforman antes" t={24} p={p('transforman')} />
    <Txt x={1180} y={870} txt="con poca flora, vuelve a la sangre" t={24} p={p('sangre')} color={TXB.hemo} />
  </g>
);

/** Tarjeta de pista (referencia de las tarjetas de pacientes): fondo crema de esquinas redondas. */
function Tarjeta({ x, titulo, o, children }: { x: number; titulo: string; o: number; children: ReactNode }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <rect x={x - 230} y={170} width={460} height={560} rx={40} fill="#FFF7E6" />
      <rect x={x - 230} y={170} width={460} height={560} rx={40} fill="none" stroke="#EADBC0" strokeWidth={4} />
      <text x={x} y={225} textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: '#4A2368' }}>{titulo}</text>
      {children}
    </g>
  );
}

const Pistas: Lamina = ({ p, reloj }) => {
  const golpe = Math.sin(reloj / 300);
  return (
    <g>
      <Bandera x={800} y={80} txt="el color cuenta una historia" color="#8B5A2B" p={p('historia')} t={30} punta="no" />
      {/* 1. No llega bilis: conducto tapado → heces pálidas, sin urobilinógeno */}
      <Tarjeta x={300} titulo="no llega bilis" o={tramo(p('bilis'), 0, 0.4)}>
        <path d="M200,300 L400,300" stroke={B.bilis[0]} strokeWidth={34} strokeLinecap="round" /><path d="M200,300 L400,300" stroke={B.bilis[1]} strokeWidth={20} strokeLinecap="round" />
        <circle cx={300} cy={300} r={26} fill="#3A3040" />
        <g transform="translate(220,480) scale(0.8)" opacity={tramo(p('palidas'), 0, 0.4)}><Frasco tono={['#B8A898', '#E8DCCC', '#FFF8EE']} /></g>
        <text x={220} y={620} textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: '#4A2368' }} opacity={p('acolia')}>acolia</text>
        <g transform="translate(380,470) scale(0.45)" opacity={tramo(p('desaparece'), 0, 0.4)}><TuboOrina /></g>
        <g opacity={p('desaparece')}><Cruz x={420} y={400} k={0.7} /></g>
        <text x={380} y={620} textAnchor="middle" style={{ fontSize: 18, fontWeight: 600, fill: '#6A4A5E' }} opacity={p('desaparece')}>sin urobilinógeno</text>
      </Tarjeta>
      {/* 2. Antibióticos: matan a las que lo fabrican → lo bajan */}
      <Tarjeta x={800} titulo="antibióticos" o={tramo(p('antibioticos'), 0, 0.4)}>
        <g transform={`translate(800,320) rotate(${-30 + golpe * 4})`}><Pastilla k={1.1} color={['#1446B0', '#2E78F2', '#A8CCFF']} /></g>
        {[0, 1, 2, 3].map((i) => <Bacilo key={i} x={680 + i * 80} y={470 + Math.sin(reloj / 500 + i) * 6} r={i * 40} k={0.45} tono={p('matan') > 0.5 && i > 0 ? ['#6A7080', '#9AA0B0', '#D0D4E0'] : FLORA} o={i > 0 ? 1 - 0.5 * p('matan') : 1} />)}
        <Flecha a={[800, 600]} b={[800, 680]} p={p('matan')} color="#2E78F2" w={8} />
        <text x={800} y={575} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#4A2368' }} opacity={p('matan')}>baja el urobilinógeno</text>
      </Tarjeta>
      {/* 3. Hemólisis: más hemo roto → más urobilinógeno */}
      <Tarjeta x={1300} titulo="hemólisis" o={tramo(p('hemolisis'), 0, 0.4)}>
        {[0, 1, 2].map((i) => {
          const u = (reloj / 2400 + i / 3) % 1;
          return <g key={i}><Hematie x={1210 + i * 90} y={330} k={0.6} o={1 - tramo(u, 0.4, 0.6)} /><HematieRoto x={1210 + i * 90} y={330} k={0.6} p={tramo(u, 0.4, 0.8)} /></g>;
        })}
        <g transform="translate(1300,500) rotate(90) scale(0.32)"><Tira pads={['#F2E8A0', '#F2E8A0', mezcla('#F6C8A8', '#E0607A', easeOut(p('sube'))), '#B8D8A0', '#C8B8E0']} /></g>
        <Flecha a={[1300, 680]} b={[1300, 600]} p={p('sube')} color="#E3203F" w={8} />
        <text x={1300} y={575} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#4A2368' }} opacity={p('sube')}>sube el urobilinógeno</text>
      </Tarjeta>
      <Bandera x={800} y={860} txt="pero el color no basta: al laboratorio" color="#2E78F2" p={p('laboratorio')} t={28} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Intacta, Desconjuga, BilR, Quien, Cadena, Enterohepatica, Orina, NoVuelve, Pistas];
export default LAMINAS;
