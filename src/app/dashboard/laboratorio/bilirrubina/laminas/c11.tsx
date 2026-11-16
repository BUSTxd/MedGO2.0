'use client';
// Capítulo 11 · Cálculos pigmentarios y mapa final. Los cálculos de colesterol frente a los pigmentarios (con el
// bilirrubinato cálcico que se arma), la vesícula con piedras negras y su radiografía, los conductos con piedras
// pardas y las bacterias que cortan las colitas; luego el mapa: el viaje con el atasco marcado y, debajo, las
// muestras de verdad (suero, orina, tira y heces), y al final el cuerpo entero con sus estaciones y tres semáforos.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { B, Bacilo, Bandera, Cruz, Cuerpo, Glucuronido, HematieRoto, Intestino, Macrofago, Rinon, Rostro, Sale, Tetrapirrol, Tijera, Tira, Txt, TXB, Visto, clamp, easeOut, hash, lerp, mezcla, tijeretazo, tramo } from '../Piezas';
import { Calcio, FrascoOrina, Heces, HigadoB, Piedra, Sube, TONO_HIGADO, TuboSuero, VesiculaB, ViasBiliares } from '../Escenas';

type P2 = [number, number];
const NEGRA = ['#100A14', '#2E2234'] as const;
const PARDA = ['#5E3210', '#9A5A26'] as const;
const COLES = ['#C9A400', '#FFE36A'] as const;

const Colesterol: Lamina = ({ p, reloj }) => {
  const ing = p('ingredientes'), cal = p('calcico');
  return (
    <g>
      <Bandera x={800} y={50} txt="¿todos son de colesterol?" color="#8B5A2B" p={p('colesterol')} t={30} punta="no" />
      {/* Dos piedras, dos materiales */}
      <Sale p={p('colesterol')} x={300} y={300} k={1}>
        <Piedra R={90} tono={COLES} sem={2} />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-50 + i * 22},-40 L${-30 + i * 22},30`} stroke="#FFF7C8" strokeWidth={5} strokeLinecap="round" opacity={0.6} />)}
      </Sale>
      <Txt x={300} y={450} txt="de colesterol" t={26} p={p('colesterol')} />
      <Sale p={p('pigmentarios')} x={760} y={300} k={1}>
        <Piedra x={-40} y={10} R={70} tono={NEGRA} sem={5} />
        <Piedra x={60} y={-20} R={56} tono={PARDA} sem={8} />
      </Sale>
      <Txt x={760} y={450} txt="pigmentarios" t={26} p={p('pigmentarios')} color={TXB.marron} />
      {/* Sus ingredientes: bilirrubina no conjugada + calcio → bilirrubinato cálcico */}
      <Txt x={1260} y={150} txt="bilirrubinato cálcico" t={28} p={cal} color={TXB.marron} />
      <g opacity={tramo(cal, 0, 0.4)}>
        {/* La red: cuatro bilirrubinas en las esquinas y el calcio que las une */}
        {([[1130, 290], [1390, 290], [1130, 540], [1390, 540]] as P2[]).map((destino, i) => {
          const origen: P2 = [980 + hash(i, 3) * 120, 820 + hash(i, 4) * 60];
          const q = easeOut(tramo(ing, 0.15 + i * 0.1, 0.65 + i * 0.08));
          return <Tetrapirrol key={i} x={lerp(origen[0], destino[0], q)} y={lerp(origen[1], destino[1], q)} k={0.3} plegada={1} tono={B.bilirrubina} vibra={reloj + i * 300} />;
        })}
        {([[1260, 300], [1260, 550], [1130, 420], [1390, 420], [1260, 425]] as P2[]).map((destino, i) => {
          const origen: P2 = [1420 + hash(i, 6) * 100, 820 + hash(i, 7) * 60];
          const q = easeOut(tramo(ing, 0.25 + i * 0.1, 0.75 + i * 0.05));
          return <Calcio key={`c${i}`} x={lerp(origen[0], destino[0], q)} y={lerp(origen[1], destino[1], q)} k={1.25} />;
        })}
      </g>
      <Txt x={1060} y={720} txt="bilirrubina no conjugada" t={24} p={ing} color={TXB.ambar} />
      <Txt x={1270} y={720} txt="+" t={34} p={ing} />
      <Txt x={1440} y={720} txt="calcio" t={24} p={ing} />
      <Txt x={1260} y={770} txt="una bilirrubina que no se disuelve en agua, y calcio" t={22} p={ing} fuerte={false} />
    </g>
  );
};

/** Radiografía del abdomen derecho: placa oscura con las piedras blancas (radiopacas). */
function Radiografia({ p }: { p: number }) {
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      <rect x={-130} y={-110} width={260} height={220} rx={16} fill="#0E1424" />
      <rect x={-118} y={-98} width={236} height={196} rx={10} fill="#1E2A44" />
      {[[-100, -60], [-100, -20], [-100, 20], [-100, 60]].map(([x, y], i) => <path key={i} d={`M${x},${y} C-40,${y - 10} 20,${y - 6} 100,${y + 10}`} fill="none" stroke="#5A6A8A" strokeWidth={10} strokeLinecap="round" opacity={0.6} />)}
      {[[-10, 20, 12], [14, 34, 10], [0, 50, 11], [24, 12, 8]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * easeOut(clamp(p))} fill="#F2F6FC" />)}
    </g>
  );
}

const Negros: Lamina = ({ p, reloj }) => {
  const pol = p('polimeriza');
  return (
    <g>
      <Bandera x={800} y={50} txt="cálculos negros" color="#2A1E30" p={p('negros')} t={30} punta="no" />
      <Sale p={p('vesicula')} x={360} y={430} k={2.3}>
        <VesiculaB reloj={reloj} tonoPiedra={NEGRA} piedras={[[-24, 44, 20], [18, 70, 17], [-8, 96, 18], [26, 22, 14], [-36, 80, 13], [6, 40, 12]]} />
      </Sale>
      <Txt x={360} y={820} txt="en la vesícula" t={28} p={p('vesicula')} />
      {/* Lo que los favorece */}
      {[
        { n: 'hemolisis', txt: 'hemólisis crónica', d: <HematieRoto k={0.9} p={0.25 + ((reloj / 2200) % 1) * 0.6} /> },
        { n: 'cirrosis', txt: 'cirrosis', d: <g transform="scale(0.24)"><HigadoB tono={TONO_HIGADO.normal} nodulos={1} /></g> },
        { n: 'ileon', txt: 'enfermedad o resección del íleon', d: <g><Intestino k={0.32} /><Tijera x={40} y={-10} k={0.5} corta={tijeretazo(reloj, 1500)} color="#0C9E9A" /></g> },
      ].map((c, i) => (
        <g key={c.n}>
          <Sale p={p(c.n)} x={800} y={190 + i * 140}>{c.d as ReactNode}</Sale>
          <Txt x={890} y={190 + i * 140} txt={c.txt} t={26} p={p(c.n)} ancla="start" />
        </g>
      ))}
      {/* Se polimeriza: las moléculas se enlazan en una cadena */}
      <g opacity={tramo(pol, 0, 0.4)}>
        {Array.from({ length: 4 }, (_, i) => <Tetrapirrol key={i} x={820 + i * 110} y={640} k={0.18} plegada={1} tono={['#2E2234', '#5A4A62', '#9A8AA2']} />)}
        {Array.from({ length: 3 }, (_, i) => <path key={`e${i}`} d={`M${860 + i * 110},640 L${890 + i * 110},640`} stroke="#E040C8" strokeWidth={8} strokeLinecap="round" opacity={tramo(pol, 0.3 + i * 0.15, 0.6 + i * 0.15)} />)}
      </g>
      <Txt x={1000} y={730} txt="la bilirrubina se polimeriza" t={26} p={pol} />
      <g transform="translate(1380,660)"><Radiografia p={p('duros')} /></g>
      <Txt x={1380} y={820} txt="duros, a menudo radiopacos" t={22} p={p('duros')} />
      <Bandera x={800} y={920} txt="negros: en la vesícula" color="#2A1E30" p={p('fin')} t={28} punta="no" />
    </g>
  );
};

/** Áscaris plano que ondula. */
function Gusano({ reloj }: { reloj: number }) {
  const d = Array.from({ length: 16 }, (_, i) => `${i ? 'L' : 'M'}${(i * 10 - 75).toFixed(1)},${(Math.sin(i * 0.7 + reloj / 220) * 8).toFixed(1)}`).join(' ');
  return (
    <g>
      <path d={d} fill="none" stroke="#C88A7A" strokeWidth={18} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#F2C2B0" strokeWidth={11} strokeLinecap="round" />
      <circle cx={75} cy={Math.sin(15 * 0.7 + reloj / 220) * 8} r={4} fill="#5A2A1A" />
    </g>
  );
}

const Pardos: Lamina = ({ p, reloj }) => {
  const bac = p('bacterias'), col = p('colangitis');
  const corte = tijeretazo(reloj, 1300);
  return (
    <g>
      <Bandera x={800} y={50} txt="cálculos pardos" color="#8B5A2B" p={p('pardos')} t={30} punta="no" />
      <g transform="translate(-30,90) scale(0.66)" opacity={tramo(p('conductos'), 0, 0.4)}>
        <ViasBiliares reloj={reloj} piedrasCond={1} fluye={0.4} dilata={0.4} />
        {/* Bacterias y un parásito dentro de los conductos */}
        {p('infeccion') > 0.01 && [[600, 470], [700, 680], [580, 380]].map(([bx, by], i) => <Bacilo key={i} x={bx} y={by} k={0.5} r={60 + i * 30} reloj={reloj + i * 400} o={p('infeccion')} />)}
        {p('parasitos') > 0.01 && <g transform="translate(680,640) rotate(52)" opacity={p('parasitos')}><Gusano reloj={reloj} /></g>}
        {/* Colangitis: el conducto se inflama */}
        {col > 0.01 && <path d="M560,410 C580,470 600,520 620,560 C650,640 720,700 790,770" fill="none" stroke="#E3203F" strokeWidth={60} strokeLinecap="round" opacity={0.22 * col * (1 + Math.sin(reloj / 300) * 0.3)} />}
      </g>
      <Txt x={360} y={760} txt="en los conductos" t={26} p={p('conductos')} />
      <Txt x={1220} y={150} txt="por infección:" t={28} p={p('infeccion')} color={TXB.bacteria} />
      <Txt x={1220} y={190} txt="las bacterias desconjugan la bilirrubina en la bilis" t={22} p={bac} fuerte={false} />
      {/* La desconjugación: la bacteria corta las colitas y queda no conjugada */}
      <g opacity={tramo(bac, 0, 0.4)}>
        <Bacilo x={1000} y={360} k={1} reloj={reloj} r={10} />
        <Tijera x={1110} y={330} k={0.7} r={-20} corta={corte} color="#0C9E9A" />
        <Tetrapirrol x={1300} y={350} k={0.4} colitas={2 * (1 - tramo(bac, 0.4, 0.9))} plegada={tramo(bac, 0.5, 1)} tono={bac > 0.7 ? B.bilirrubina : B.conjugada} />
        {[0, 1].map((i) => <Glucuronido key={i} x={1430 + i * 56} y={lerp(350, 420, tramo(bac, 0.5, 1)) + i * 16} k={1.1} r={reloj / 20 + i * 40} o={tramo(bac, 0.45, 0.7)} />)}
      </g>
      <Txt x={1300} y={510} txt="+ calcio → bilirrubinato cálcico" t={22} p={tramo(bac, 0.6, 1)} color={TXB.marron} />
      <Sale p={p('parasitos')} x={1000} y={640}><Gusano reloj={reloj} /></Sale>
      <Txt x={1090} y={640} txt="o por parásitos" t={26} p={p('parasitos')} ancla="start" />
      {/* Blandos: la piedra parda se aplasta como barro */}
      <g opacity={tramo(p('blandos'), 0, 0.4)} transform={`translate(1020,780) scale(${1 + Math.sin(reloj / 300) * 0.08},${1 - Math.sin(reloj / 300) * 0.08})`}>
        <Piedra R={36} tono={PARDA} sem={12} />
      </g>
      <Txt x={1090} y={780} txt="blandos" t={26} p={p('blandos')} ancla="start" />
      <Txt x={1090} y={830} txt="se asocian a colangitis" t={24} p={col} ancla="start" color={TXB.hemo} />
      <Bandera x={800} y={930} txt="pardos: en los conductos" color="#8B5A2B" p={p('fin')} t={28} punta="no" />
    </g>
  );
};

/** Gotero que deja caer solvente sobre lo que haya debajo. */
function Gotero({ reloj }: { reloj: number }) {
  const u = (reloj / 900) % 1;
  return (
    <g>
      <rect x={-18} y={-120} width={36} height={40} rx={14} fill="#E3203F" />
      <path d="M-14,-84 L14,-84 L10,10 L0,30 L-10,10 Z" fill="#DCEAF4" />
      <path d="M-10,-40 L10,-40 L8,8 L0,24 L-8,8 Z" fill="#7FB0FF" />
      <path d="M0,-12 C5,-4 7,1 7,4 A7,7 0 0 1 -7,4 C-7,1 -5,-4 0,-12 Z" transform={`translate(0,${44 + u * u * 160})`} fill="#7FB0FF" opacity={1 - tramo(u, 0.8, 1)} />
    </g>
  );
}

const Disolver: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="¿se pueden disolver? no" color="#8B5A2B" p={p('disolver')} t={30} punta="no" />
    {/* Un vaso con bilis, solvente que cae y las piedras pigmentarias que no cambian */}
    <g opacity={tramo(p('lipidos'), 0, 0.4)}>
      <path d="M260,330 L260,700 C260,740 290,760 330,760 L770,760 C810,760 840,740 840,700 L840,330" fill="#BFD8EA" opacity={0.45} />
      <path d="M274,450 L826,450 L826,700 C826,730 806,746 770,746 L330,746 C294,746 274,730 274,700 Z" fill={B.bilis[1]} opacity={0.8} />
      <path d="M274,450 Q400,436 550,450 T826,450" fill="none" stroke={B.bilis[2]} strokeWidth={6} />
      <Piedra x={440} y={680} R={56} tono={NEGRA} sem={5} />
      <Piedra x={640} y={684} R={52} tono={PARDA} sem={8} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = (reloj / 1800 + i / 6) % 1;
        return <circle key={i} cx={360 + hash(i, 4) * 380} cy={lerp(720, 470, u)} r={5 + hash(i, 5) * 5} fill="#FFFFFF" opacity={0.6 * (1 - u)} />;
      })}
      <path d="M290,360 L290,700" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.5} />
    </g>
    <Sale p={p('solventes')} x={550} y={240}><Gotero reloj={reloj} /></Sale>
    <Txt x={550} y={830} txt="no responden a cambios en los lípidos de la bilis" t={24} p={p('lipidos')} />
    <Txt x={550} y={870} txt="ni a los solventes" t={24} p={p('solventes')} />
    <Cruz x={860} y={620} k={1.1} o={p('solventes')} />
    {/* La clínica: la de un cólico biliar, como los de colesterol */}
    <Sale p={p('clinica')} x={1230} y={380} k={1.1}><Rostro quien="adulta" reloj={reloj} triste={1} piel={['#8A4A3A', '#B8705A']} pelo="#1A1030" ropa={['#0A7F86', '#3FC0B8']} /></Sale>
    <g opacity={tramo(p('clinica'), 0, 0.4)}>
      <path d="M1360,520 L1400,560 L1380,570 L1420,620" fill="none" stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <Piedra x={1080} y={600} R={26} tono={COLES} sem={2} />
      <Txt x={1130} y={600} txt="=" t={34} p={p('clinica')} />
      <Piedra x={1180} y={600} R={26} tono={NEGRA} sem={5} />
    </g>
    <Txt x={1230} y={700} txt="la clínica se parece" t={26} p={p('clinica')} />
    <Txt x={1230} y={740} txt="a la de los de colesterol" t={26} p={p('clinica')} />
  </g>
);

// ─── El mapa de los atascos ───────────────────────────────────────────────────

/** El viaje en una fila (macrófago → sangre → hígado → conductos → intestino), con el atasco señalado.
 *  `donde`: 0 antes del hígado, 1 dentro, 2 después. */
function Ruta({ donde, reloj, p, color }: { donde: 0 | 1 | 2; reloj: number; p: number; color: string }) {
  if (p <= 0.002) return null;
  const X = [170, 470, 800, 1110, 1400];
  const atasco = [320, 800, 960][donde];
  const late = 1 + Math.sin(reloj / 260) * 0.12;
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      <path d={`M${X[0]},230 L${X[4]},230`} stroke="var(--vas-suave)" strokeWidth={26} strokeLinecap="round" />
      <path d={`M${X[0]},230 L${atasco},230`} stroke={B.bilirrubina[1]} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${atasco},230 L${X[4]},230`} stroke={donde === 2 ? 'var(--vas-suave)' : B.conjugada[1]} strokeWidth={14} strokeLinecap="round" opacity={donde === 0 ? 0.9 : 0.4} />
      <g transform={`translate(${X[0]},200)`}><Macrofago k={0.45} /></g>
      <g transform={`translate(${X[1]},230)`}>
        <rect x={-90} y={-40} width={180} height={80} rx={40} fill="#9E0B2E" /><rect x={-86} y={-36} width={172} height={66} rx={33} fill="#E3203F" />
        {[-40, 10, 50].map((cx) => <circle key={cx} cx={cx} cy={0} r={13} fill="#FF7480" />)}
      </g>
      <HigadoB x={X[2]} y={226} k={0.3} tono={donde === 1 ? TONO_HIGADO.inflamado : TONO_HIGADO.normal} focos={donde === 1 ? 1 : 0} reloj={reloj} />
      <path d={`M${X[2] + 70},250 C${X[2] + 140},290 ${X[3] - 120},300 ${X[3] - 60},250`} fill="none" stroke={B.bilis[0]} strokeWidth={18} strokeLinecap="round" />
      <path d={`M${X[2] + 70},250 C${X[2] + 140},290 ${X[3] - 120},300 ${X[3] - 60},250`} fill="none" stroke={B.bilis[1]} strokeWidth={10} strokeLinecap="round" />
      <Intestino x={X[3] + 30} y={240} k={0.42} />
      <g transform={`translate(${X[4]},236)`}><Heces k={0.7} color={donde === 2 ? '#E2DACB' : donde === 0 ? '#5A2A0A' : '#8A4A1C'} /></g>
      {/* El atasco */}
      <g transform={`translate(${atasco},160) scale(${late})`}>
        <circle r={36} fill={color} opacity={0.25} />
        <path d="M0,-30 L28,22 L-28,22 Z" fill={color} />
        <rect x={-3} y={-12} width={6} height={20} rx={3} fill="#FFF" /><circle cy={15} r={3.5} fill="#FFF" />
      </g>
      {['macrófago', 'sangre', 'hígado', 'intestino', 'heces'].map((t, i) => <text key={t} x={X[i]} y={330} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto-2)' }}>{t}</text>)}
    </g>
  );
}

type Muestra = { n: string; titulo: string; valor: string; d: ReactNode; sube?: boolean | null };

/** Fila de muestras de verdad, cada una con su dibujo, lo que se mide y el resultado. */
function Muestras({ items, p }: { items: Muestra[]; p: (n: string) => number }) {
  const X = [220, 590, 960, 1330];
  return (
    <g>
      {items.map((m, i) => (
        <g key={m.titulo}>
          <ellipse cx={X[i]} cy={720} rx={110} ry={16} fill={B.sombra} opacity={tramo(p(m.n), 0, 0.4) * 0.8} />
          <Sale p={p(m.n)} x={X[i]} y={590}>{m.d}</Sale>
          <Txt x={X[i]} y={770} txt={m.titulo} t={20} p={p(m.n)} fuerte={false} />
          <Txt x={X[i]} y={810} txt={m.valor} t={27} p={p(m.n)} />
          {m.sube != null && <Sube x={X[i] + 100} y={510} sube={m.sube} p={p(m.n)} />}
        </g>
      ))}
    </g>
  );
}

const PADS = { alto: ['#D8C8F0', '#F0C8A0', '#C8123A', '#E8D8A0', '#B8E0C0'], normal: ['#D8C8F0', '#F0C8A0', '#F2A0A8', '#E8D8A0', '#B8E0C0'], bajo: ['#D8C8F0', '#F0C8A0', '#FFF2EA', '#E8D8A0', '#B8E0C0'] };

const Pre: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="1 · antes del hígado: prehepática" color="#D7263D" p={p('antes')} t={28} punta="no" />
    <Ruta donde={0} reloj={reloj} p={p('antes')} color="#D7263D" />
    <Muestras p={(n) => p(n)} items={[
      { n: 'indirecta', titulo: 'sangre', valor: 'indirecta alta', d: <g transform="scale(0.8)"><TuboSuero suero="#FFB21E" /></g>, sube: true },
      { n: 'orina', titulo: 'bilirrubina en orina', valor: 'no hay', d: <g transform="scale(0.8)"><FrascoOrina color="#F8E27A" /></g> },
      { n: 'uro', titulo: 'urobilinógeno', valor: 'alto', d: <Tira k={0.42} r={90} pads={PADS.alto} />, sube: true },
      { n: 'heces', titulo: 'heces', valor: 'oscuras', d: <Heces k={1.1} color="#5A2A0A" /> },
    ]} />
    <Bandera x={800} y={920} txt="mucho hemo roto: el hígado no da abasto" color="#D7263D" p={p('abasto')} t={26} punta="no" />
  </g>
);

const Hep: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="2 · dentro del hígado: hepática" color="#C2307A" p={p('dentro')} t={28} punta="no" />
    <Ruta donde={1} reloj={reloj} p={p('dentro')} color="#C2307A" />
    <Muestras p={(n) => p(n)} items={[
      { n: 'mixta', titulo: 'sangre', valor: 'mixta', d: <g transform="scale(0.8)"><TuboSuero suero="#F8C820" /></g>, sube: true },
      { n: 'coluria', titulo: 'bilirrubina en orina', valor: 'puede haber coluria', d: <g transform="scale(0.8)"><FrascoOrina color="#B8701A" espuma={0.6} /></g> },
      { n: 'uro', titulo: 'urobilinógeno', valor: 'normal o alto', d: <Tira k={0.42} r={90} pads={PADS.normal} /> },
      { n: 'transaminasas', titulo: 'transaminasas', valor: 'altas', d: <g transform="scale(0.8)"><TuboSuero suero="#F6E07A" tapa="#8A5AF0" /></g>, sube: true },
    ]} />
    <Bandera x={800} y={920} txt="fallan varias etapas a la vez" color="#C2307A" p={p('etapas')} t={26} punta="no" />
  </g>
);

const Post: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={50} txt="3 · después del hígado: posthepática" color="#18A34A" p={p('despues')} t={28} punta="no" />
    <Ruta donde={2} reloj={reloj} p={p('despues')} color="#18A34A" />
    <Muestras p={(n) => p(n)} items={[
      { n: 'directa', titulo: 'sangre', valor: 'directa alta', d: <g transform="scale(0.8)"><TuboSuero suero="#F2E23A" /></g>, sube: true },
      { n: 'coluria', titulo: 'bilirrubina en orina', valor: 'coluria', d: <g transform="scale(0.8)"><FrascoOrina color="#7A3A0E" espuma={1} /></g> },
      { n: 'uro', titulo: 'urobilinógeno', valor: 'bajo o ausente', d: <Tira k={0.42} r={90} pads={PADS.bajo} />, sube: false },
      { n: 'acolicas', titulo: 'heces', valor: 'acólicas', d: <Heces k={1.1} color="#E2DACB" /> },
    ]} />
    <Bandera x={800} y={920} txt="fosfatasa alcalina y GGT altas, con prurito" color="#18A34A" p={p('fosfatasa')} t={26} punta="no" />
  </g>
);

/** Semáforo de verdad: poste y tres luces; `luz` 0 roja, 1 ámbar, 2 verde; `p` lo enciende. */
function Semaforo({ x, y, luz, p, txt, reloj }: { x: number; y: number; luz: 0 | 1 | 2; p: number; txt: string; reloj: number }) {
  if (p <= 0.002) return null;
  const COL = ['#E3203F', '#FFB21E', '#18A34A'];
  const brillo = 0.85 + Math.sin(reloj / 400) * 0.15;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(p, 0, 0.4)}>
      <rect x={-8} y={110} width={16} height={130} rx={6} fill="#5A6478" />
      <rect x={-52} y={-130} width={104} height={250} rx={30} fill={B.sombra} transform="translate(7,9)" />
      <rect x={-52} y={-130} width={104} height={250} rx={30} fill="#1E2240" />
      <rect x={-52} y={-130} width={98} height={240} rx={28} fill="#2E3460" />
      {COL.map((c, i) => {
        const on = i === luz && p > 0.3;
        return <g key={c}>{on && <circle cy={-74 + i * 76} r={44} fill={c} opacity={0.3 * brillo} />}<circle cy={-74 + i * 76} r={28} fill={on ? c : mezcla(c, '#1E2240', 0.75)} />{on && <circle cx={-9} cy={-83 + i * 76} r={8} fill="#FFF" opacity={0.7} />}</g>;
      })}
      <text y={280} textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: 'var(--cit-texto)' }}>{txt}</text>
    </g>
  );
}

/** Órganos del abdomen sobre la silueta de `Cuerpo` (coordenadas locales: el torso va de x ±90 y de y −130 a 90).
 *  Vista de frente: el hígado a la derecha del paciente (izquierda de la pantalla), el bazo al otro lado. */
function Organos({ reloj }: { reloj: number }) {
  const late = 1 + Math.max(0, Math.sin(reloj / 320)) * 0.08;
  return (
    <g>
      {/* Grandes vasos, detrás de todo: aorta y cava */}
      <path d="M6,-122 L6,64 M6,64 L-26,96 M6,64 L34,96" fill="none" stroke="#B0123A" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-8,-122 L-8,62 M-8,62 L-38,94 M-8,62 L22,96" fill="none" stroke="#2E4AA0" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      {/* Riñones con sus uréteres hasta la vejiga */}
      <path d="M-44,-14 C-40,20 -22,56 -8,72 M44,-14 C40,20 22,56 8,72" fill="none" stroke="#E0B030" strokeWidth={3.5} strokeLinecap="round" />
      <g transform="translate(-50,-32) scale(0.13)"><Rinon /></g>
      <g transform="translate(50,-32) scale(-0.13,0.13)"><Rinon /></g>
      {/* Corazón */}
      <g transform={`translate(4,-140) scale(${late})`}>
        <path d="M0,14 C-10,6 -20,-2 -20,-10 C-20,-18 -12,-22 -6,-20 C-2,-19 0,-16 0,-13 C0,-16 2,-19 6,-20 C12,-22 20,-18 20,-10 C20,-2 10,6 0,14 Z" fill="#9E0B2E" />
        <path d="M0,11 C-8,5 -17,-2 -17,-9 C-17,-15 -11,-18 -6,-17 C-2,-16 0,-13 0,-11 C0,-13 2,-16 6,-17 C11,-18 17,-15 17,-9 C17,-2 8,5 0,11 Z" fill="#E3203F" />
        <circle cx={-9} cy={-11} r={2.5} fill="#FFF" opacity={0.7} />
      </g>
      {/* Hígado y vesícula */}
      <HigadoB x={-30} y={-94} k={0.19} />
      <ellipse cx={-34} cy={-62} rx={7} ry={10} fill={B.bilis[0]} transform="rotate(-20 -34 -62)" />
      <ellipse cx={-35} cy={-63} rx={5} ry={8} fill={B.bilis[1]} transform="rotate(-20 -35 -63)" />
      {/* Estómago */}
      <path d="M28,-122 C50,-128 70,-112 68,-90 C66,-70 48,-60 30,-66 C20,-70 20,-80 30,-84 C42,-86 46,-96 38,-106 C34,-112 28,-114 28,-122 Z" fill="#B5245E" />
      <path d="M30,-118 C48,-122 64,-108 62,-90 C60,-74 46,-66 32,-70 C26,-72 26,-78 32,-80 C44,-84 48,-96 40,-108 Z" fill="#F27BA0" />
      <path d="M40,-114 Q56,-110 58,-96" fill="none" stroke="#FFD0DE" strokeWidth={3} strokeLinecap="round" />
      {/* Bazo, donde los macrófagos rompen los hematíes viejos */}
      <g transform="translate(78,-80) rotate(20)">
        <ellipse rx={11} ry={21} fill="#5A1A6A" /><ellipse cx={-1} cy={-2} rx={9} ry={18} fill="#9A3AB0" />
        <ellipse cx={-3} cy={-8} rx={3} ry={6} fill="#D08AE0" opacity={0.7} />
      </g>
      {/* Vena esplénica y porta: del bazo al hígado, por detrás del estómago */}
      <path d="M70,-70 C52,-54 12,-54 -20,-70" fill="none" stroke="#2E4AA0" strokeWidth={6} strokeLinecap="round" />
      <path d="M70,-70 C52,-54 12,-54 -20,-70" fill="none" stroke="#6A8AF0" strokeWidth={3} strokeLinecap="round" />
      {/* Colédoco hasta el intestino */}
      <path d="M-30,-60 C-24,-52 -16,-48 -8,-44" fill="none" stroke={B.bilis[0]} strokeWidth={4} strokeLinecap="round" />
      {/* Intestino grueso en marco y el delgado en asas */}
      <path d="M-60,46 L-60,-34 Q-60,-46 -48,-46 L48,-46 Q60,-46 60,-34 L60,46 C58,60 30,64 10,66" fill="none" stroke="#8A4A1C" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-60,46 L-60,-34 Q-60,-46 -48,-46 L48,-46 Q60,-46 60,-34 L60,46 C58,60 30,64 10,66" fill="none" stroke="#D9894A" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      {[-40, -20, 0, 20, 40].map((x) => <path key={`h${x}`} d={`M${x},-52 L${x},-40`} stroke="#8A4A1C" strokeWidth={2.5} />)}
      {[-26, -6, 14, 34].map((y) => <path key={`v${y}`} d={`M-66,${y} L-54,${y} M54,${y} L66,${y}`} stroke="#8A4A1C" strokeWidth={2.5} />)}
      <path d="M-40,-28 C-10,-34 20,-32 38,-24 C46,-16 30,-8 0,-8 C-30,-8 -44,0 -38,10 C-30,18 10,16 34,18 C46,24 36,34 10,34 C-14,34 -36,32 -40,40" fill="none" stroke="#B5306A" strokeWidth={12} strokeLinecap="round" />
      <path d="M-40,-28 C-10,-34 20,-32 38,-24 C46,-16 30,-8 0,-8 C-30,-8 -44,0 -38,10 C-30,18 10,16 34,18 C46,24 36,34 10,34 C-14,34 -36,32 -40,40" fill="none" stroke="#F27BA0" strokeWidth={7} strokeLinecap="round" />
      {/* Vejiga */}
      <ellipse cx={0} cy={78} rx={17} ry={12} fill="#C9A400" /><ellipse cx={-1} cy={76} rx={14} ry={9} fill="#FFE36A" />
      <circle cx={-6} cy={73} r={2.5} fill="#FFF" opacity={0.8} />
    </g>
  );
}

const Viaje: Lamina = ({ p, reloj }) => {
  // Estaciones dentro del cuerpo (coordenadas locales de `Cuerpo`, escala 1.32 alrededor de (430, 540)).
  const K = 1.32, CX = 430, CY = 540;
  const L = (x: number, y: number): P2 => [CX + x * K, CY + y * K];
  // Cada estación: su punto en el órgano y dónde va su rótulo (a un lado, sin que las guías se crucen).
  const est = [
    { n: 'e1', num: 1, txt: 'macrófago (bazo)', at: L(78, -82), rot: [700, 380] as P2, color: '#D7263D' },
    { n: 'e2', num: 2, txt: 'sangre, con la albúmina', at: L(30, -58), rot: [700, 460] as P2, color: '#2E78F2' },
    { n: 'e3', num: 3, txt: 'hígado', at: L(-44, -100), rot: [200, 330] as P2, color: '#C2307A' },
    { n: 'e4', num: 4, txt: 'intestino', at: L(6, 8), rot: [700, 560] as P2, color: '#0C9E9A' },
    { n: 'e5', num: 5, txt: 'heces y orina', at: L(0, 72), rot: [700, 660] as P2, color: '#8B5A2B' },
  ];
  // Lo que hace la bilirrubina: bazo → vena → hígado → colédoco → intestino → salida.
  const ruta: P2[] = [L(76, -76), L(52, -58), L(30, -58), L(-20, -70), L(-30, -60), L(-8, -44), L(-20, -10), L(20, 16), L(10, 34), L(4, 64)];
  const u = (reloj / 7000) % 1;
  const t = u * (ruta.length - 1), j = Math.min(ruta.length - 2, Math.floor(t)), f = t - j;
  const viajera: P2 = [lerp(ruta[j][0], ruta[j + 1][0], f), lerp(ruta[j][1], ruta[j + 1][1], f)];
  const tono = j < 4 ? B.bilirrubina : B.conjugada;
  const sem = p('semaforos');
  return (
    <g>
      <Bandera x={800} y={50} txt="volvamos al principio: el viaje completo" color="#8B5A2B" p={p('principio')} t={28} punta="no" />
      <Sale p={p('principio')} x={CX} y={CY} k={K}>
        <Cuerpo><Organos reloj={reloj} /></Cuerpo>
      </Sale>
      {p('e5') > 0.5 && <g opacity={tramo(p('e5'), 0.5, 1) * tramo(Math.min(u, 1 - u), 0, 0.04)}><circle cx={viajera[0]} cy={viajera[1]} r={11} fill={tono[0]} /><circle cx={viajera[0] - 2} cy={viajera[1] - 2} r={7} fill={tono[1]} /></g>}
      {/* Guías: del órgano sale una línea recta al costado y luego sube o baja hasta su rótulo */}
      {est.map((e, i) => {
        const q = p(e.n);
        if (q <= 0.002) return null;
        const der = e.rot[0] > CX;
        const codo: P2 = [der ? 620 : 250, e.at[1]];
        const fin: P2 = [e.rot[0] + (der ? -12 : 12), e.rot[1]];
        const d = `M${e.at[0]},${e.at[1]} L${codo[0]},${codo[1]} L${fin[0]},${fin[1]}`;
        const lg = Math.abs(codo[0] - e.at[0]) + Math.hypot(fin[0] - codo[0], fin[1] - codo[1]);
        const da = `${easeOut(clamp(q * 1.3)) * lg} ${lg + 10}`;
        const activo = q < 1 ? 1 : 0.55 + 0.45 * Math.max(0, Math.sin(reloj / 500 + i));
        return (
          <g key={e.n} opacity={tramo(q, 0, 0.4)}>
            <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={da} opacity={0.7} />
            <path d={d} fill="none" stroke={e.color} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={da} />
            <circle cx={e.at[0]} cy={e.at[1]} r={26 + 6 * activo} fill={e.color} opacity={0.18 * activo} />
            <circle cx={e.at[0]} cy={e.at[1]} r={15} fill={mezcla(e.color, '#000000', 0.25)} transform="translate(2,3)" />
            <circle cx={e.at[0]} cy={e.at[1]} r={15} fill={e.color} stroke="#FFFFFF" strokeWidth={3} />
            <text x={e.at[0]} y={e.at[1]} dy="0.36em" textAnchor="middle" style={{ fontSize: 16, fontWeight: 800, fill: '#FFF' }}>{e.num}</text>
            <Txt x={e.rot[0]} y={e.rot[1]} txt={`${e.num} · ${e.txt}`} t={24} p={q} ancla={der ? 'start' : 'end'} color={e.color} />
          </g>
        );
      })}
      {/* Tres semáforos: antes, dentro y después del hígado */}
      <Semaforo x={1110} y={620} luz={0} p={tramo(sem, 0, 0.5)} txt="antes" reloj={reloj} />
      <Semaforo x={1290} y={620} luz={1} p={tramo(sem, 0.25, 0.75)} txt="dentro" reloj={reloj} />
      <Semaforo x={1470} y={620} luz={2} p={tramo(sem, 0.5, 1)} txt="después" reloj={reloj} />
      <Txt x={1290} y={960} txt="cada uno enciende lo que cambia en sangre, orina y heces" t={20} p={sem} fuerte={false} />
      <Bandera x={1180} y={130} txt="¿en qué estación se atascó?" color="#E0A100" p={p('pregunta')} t={28} punta="no" />
      <Visto x={1500} y={130} k={1.1} o={p('responder')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Colesterol, Negros, Pardos, Disolver, Pre, Hep, Post, Viaje];
export default LAMINAS;
