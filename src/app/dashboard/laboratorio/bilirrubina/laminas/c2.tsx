'use client';
// Capítulo 2 · Una molécula paradójica

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Capas, Cerebro, Cerradura, Chip, Corazon, Cruz, Escudo, Flecha, Flota, Gota, Grasa, Higado, Placenta, Radical, Rinon, Sale, Tetrapirrol, Txt, TXB, Vaso, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

const AGUA = ['#1E7FD0', '#3FB4E0', '#BFE9FF'];

/** Gotas de agua que caen sobre la molécula y resbalan (no se disuelve). */
function Resbalan({ x, y, reloj, o }: { x: number; y: number; reloj: number; o: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const u = (reloj / 2200 + i / 4) % 1;
        const lado = i % 2 ? 1 : -1;
        const yy = u < 0.45 ? lerp(y - 260, y - 90, u / 0.45) : y - 90 + (u - 0.45) * 380;
        const xx = x + (i - 1.5) * 60 + (u < 0.45 ? 0 : lado * (u - 0.45) * 420);
        return <Gota key={i} x={xx} y={yy} k={0.22} tono={AGUA} o={1 - tramo(u, 0.85, 1)} />;
      })}
    </g>
  );
}

const Paradoja: Lamina = ({ p, reloj }) => {
  const pl = p('pliega');
  return (
    <g>
      <Bandera x={800} y={90} txt="una paradoja" color="#E8720C" p={p('polares')} t={32} punta="no" />
      <Sale p={p('polares')} x={800} y={470} k={1.5}><Tetrapirrol abre={1} plegada={pl} tono={B.bilirrubina} vibra={reloj} /></Sale>
      <Txt x={520} y={700} txt="dos ácidos propiónicos: polares" t={28} p={p('polares')} color={TXB.hemo} />
      <Resbalan x={800} y={470} reloj={reloj} o={p('agua')} />
      <Txt x={1200} y={250} txt="y sin embargo, no se disuelve" t={28} p={p('agua')} />
      <Txt x={800} y={830} txt="se pliega como un libro que se cierra" t={30} p={pl} />
      <Bandera x={800} y={910} txt="puentes de hidrógeno internos esconden lo polar" color="#5B2FB0" p={p('puentes')} t={24} punta="no" />
    </g>
  );
};

const Liposoluble: Lamina = ({ p, reloj }) => {
  const cruza = p('membranas');
  const u = (reloj / 4200) % 1;
  return (
    <g>
      <Bandera x={800} y={90} txt="liposoluble" color="#E8720C" p={p('liposoluble')} t={32} punta="no" />
      <Sale p={p('precipita')} x={260} y={330}>
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(hash(i, 2) - 0.5) * 160} cy={40 + Math.min(1, ((reloj / 3000 + hash(i, 3)) % 1) * 1.6) * 70} r={12} fill={B.bilirrubina[1]} />)}
        <rect x={-100} y={-90} width={200} height={230} rx={30} fill="#3FB4E0" opacity={0.2} />
      </Sale>
      <Txt x={260} y={520} txt="en agua, precipita" t={26} p={p('precipita')} />
      <Capas x={860} y={540} w={640} fondo={180} bandas={[[0, '#F25CA8', 18], [40, '#D23AD8', 20], [44, '#8A2AB8', 22]]} sem={4} o={tramo(cruza, 0, 0.4)} />
      {cruza > 0.05 && <Tetrapirrol x={lerp(700, 1020, u)} y={lerp(380, 820, u)} k={0.32} plegada={1} tono={B.bilirrubina} o={tramo(Math.min(u, 1 - u), 0, 0.08)} />}
      <Txt x={860} y={480} txt="cruza las membranas" t={28} p={cruza} />
      <Sale p={p('barrera')} x={1340} y={330} k={0.6}><Cerebro /></Sale>
      <Txt x={1340} y={470} txt="barrera hematoencefálica" t={24} p={p('barrera')} />
      <Sale p={p('placenta')} x={1340} y={690} k={0.75}><Placenta reloj={reloj} /></Sale>
      <Txt x={1340} y={800} txt="placenta" t={24} p={p('placenta')} />
      <Bandera x={800} y={930} txt="guarda esta idea" color="#C2307A" p={p('guarda')} t={26} punta="no" />
    </g>
  );
};

/** Albúminas con su bilirrubina que circulan por el vaso, sin parar. Recorren de `x0` a `x1` (coordenadas del vaso)
 *  y entran y salen fundiéndose: nada aparece ni desaparece de golpe. Las `libres` sueltan su bilirrubina, que sube y se desvanece. */
function Barcos({ reloj, n = 5, y = 500, x0 = -950, x1 = 950, k = 0.6, libres = 0, o = 1 }: { reloj: number; n?: number; y?: number; x0?: number; x1?: number; k?: number; libres?: number; o?: number }) {
  const L = x1 - x0, borde = 220;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const X = x0 + ((hash(i, 21) * L + reloj * 0.07) % L);
        const entra = tramo(Math.min(X - x0, x1 - X), 0, borde);
        const Y = y + (hash(i, 22) - 0.5) * 120 + Math.sin(reloj / 700 + i) * 8;
        const suelta = i < Math.round(n * libres);
        const sube = (reloj / 2600 + hash(i, 23)) % 1;
        return (
          <g key={i} opacity={entra}>
            <Albumina x={X} y={Y} k={k} reloj={reloj} fase={i} />
            {!suelta && <Tetrapirrol x={X} y={Y - 52 * k} k={0.22 * k / 0.6} plegada={1} tono={B.bilirrubina} />}
            {suelta && <Tetrapirrol x={X + 30 + Math.sin(reloj / 300 + i) * 20} y={Y - 60 - sube * 160} k={0.2} plegada={1} tono={B.bilirrubina} o={tramo(sube, 0, 0.15) * (1 - tramo(sube, 0.7, 1))} />}
          </g>
        );
      })}
    </g>
  );
}

const ElBarco: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={90} txt="segunda estación: la sangre" color="#2E78F2" p={p('sangre')} t={30} punta="no" />
    <Vaso x={800} y={470} largo={1900} ancho={330} ang={0} reloj={reloj} flujo={8} pared={40} o={tramo(p('sangre'), 0, 0.4)}>
      <Barcos reloj={reloj} n={5} y={0} x0={-950} x1={950} k={0.62} o={tramo(p('albumina'), 0, 0.4)} />
    </Vaso>
    <Txt x={800} y={720} txt="unida a la albúmina, con alta afinidad" t={28} p={p('afinidad')} color={TXB.albumina} />
    <Txt x={800} y={760} txt="como un pasajero en un barco" t={24} p={p('barco')} fuerte={false} />
    <Sale p={p('rinon')} x={1250} y={870} k={0.45}><Rinon /></Sale>
    <Flecha a={[980, 840]} b={[1150, 860]} p={p('rinon')} color="var(--cit-flecha)" w={7} />
    <Cruz x={1080} y={850} k={0.9} o={p('rinon')} />
    <Txt x={560} y={870} txt="demasiado grande para filtrarse" t={26} p={p('rinon')} />
    <Txt x={560} y={910} txt="la indirecta no sale por la orina" t={24} p={p('orina')} fuerte={false} color={TXB.ambar} />
  </g>
);

const Libre: Lamina = ({ p, reloj }) => {
  const libre = p('libre');
  const factores = [
    { n: 'poca', txt: 'poca albúmina', c: '#2E78F2' },
    { n: 'acidosis', txt: 'acidosis', c: '#C2185B' },
    { n: 'grasos', txt: 'ácidos grasos libres', c: '#C77800' },
    { n: 'sulfonamidas', txt: 'sulfonamidas', c: '#5A2DB0' },
    { n: 'ceftriaxona', txt: 'ceftriaxona (recién nacido)', c: '#0A7F86' },
  ];
  return (
    <g>
      <Vaso x={620} y={560} largo={1400} ancho={300} ang={0} reloj={reloj} flujo={5} pared={36}>
        <Barcos reloj={reloj} n={4} y={0} x0={-700} x1={700} k={0.55} libres={0.5 * libre} />
      </Vaso>
      <Bandera x={620} y={300} txt="la fracción libre es la peligrosa" color="#D7263D" p={libre} t={28} punta="no" />
      <Sale p={p('cerebro')} x={1380} y={330} k={0.7}><Cerebro /><circle cx={-20} cy={0} r={44 * p('cerebro')} fill={B.bilirrubina[1]} opacity={0.55} /></Sale>
      <Flecha a={[1020, 420]} b={[1260, 360]} p={p('cerebro')} color="#D7263D" w={8} />
      <Txt x={1380} y={480} txt="entra al cerebro" t={26} p={p('cerebro')} color={TXB.hemo} />
      <Txt x={800} y={780} txt="¿qué la hace subir?" t={28} p={p('poca')} />
      {factores.map((f, i) => <Chip key={f.n} x={190 + i * 305} y={860} txt={f.txt} color={f.c} p={p(f.n)} t={22} />)}
    </g>
  );
};

const Antioxidante: Lamina = ({ p, reloj }) => {
  const atrapa = p('radicales');
  return (
    <g>
      <Bandera x={800} y={90} txt="cara buena 1: antioxidante" color="#18A34A" p={p('cuida')} t={30} punta="no" />
      <Capas x={800} y={690} w={1700} fondo={330} bandas={[[0, '#F25CA8', 22], [50, '#D23AD8', 24], [60, '#8A2AB8', 26]]} sem={8} o={tramo(p('lipidos'), 0, 0.4)} />
      <Txt x={800} y={890} txt="lípidos de las membranas" t={26} p={p('lipidos')} color="#FFFFFF" />
      {[0, 1, 2, 3, 4].map((i) => {
        const u = ((reloj / 2600) + i / 5) % 1;
        const x = 250 + i * 270;
        const atrapado = atrapa > 0.3 && u > 0.5;
        return (
          <g key={i} opacity={tramo(p('cuida'), 0, 0.4)}>
            <Radical x={x + Math.sin(u * 8) * 20} y={atrapado ? lerp(390, 300, (u - 0.5) * 2) : lerp(180, 520, Math.min(1, u * 1.7))} k={1.5} reloj={reloj} fase={i} o={tramo(u, 0, 0.12) * (atrapado ? 1 - (u - 0.5) * 2 : 1 - tramo(u, 0.55, 0.8))} />
            {atrapa > 0.05 && <Tetrapirrol x={x + 60} y={400} k={0.24} plegada={1} tono={B.bilirrubina} vibra={reloj + i * 200} o={atrapa} />}
          </g>
        );
      })}
      <Txt x={800} y={250} txt="atrapa radicales libres" t={28} p={atrapa} />
      <Flota x={1430} y={300} rl={reloj} k={0.8} o={tramo(p('escudo'), 0, 0.4)}><Escudo /></Flota>
      <Txt x={1430} y={430} txt="un escudo" t={26} p={p('escudo')} />
    </g>
  );
};

const Hormona: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={90} txt="cara buena 2: una hormona" color="#0C9E9A" p={p('hormona')} t={30} punta="no" />
    <Sale p={p('ppar')} x={420} y={450}><Cerradura encaja={p('llave')} /></Sale>
    <Txt x={420} y={620} txt="PPARα" t={34} p={p('ppar')} color={TXB.bacteria} />
    <Chip x={420} y={680} txt="el mismo receptor de los fibratos" color="#0A7F86" p={p('fibratos')} t={22} />
    {[0, 1, 2].map((i) => <Grasa key={i} x={850 + i * 130} y={430 + Math.sin(reloj / 500 + i) * 10} k={0.9} usa={p('grasa')} o={tramo(p('grasa'), 0, 0.2)} />)}
    <Txt x={980} y={560} txt="favorece usar grasa" t={28} p={p('grasa')} />
    <Sale p={p('cardio')} x={1380} y={430} k={0.75}><Corazon /></Sale>
    <Txt x={1380} y={580} txt="menos enfermedad cardiovascular" t={24} p={p('cardio')} />
    <Txt x={1380} y={615} txt="y metabólica" t={24} p={p('cardio')} />
    <Bandera x={800} y={860} txt="estudios observacionales: asociación, no causa" color="#6A4A5E" p={p('observacionales')} t={26} punta="no" />
  </g>
);

const LATON = ['#7A4A08', '#D9A030', '#FFE6A0'] as const;

/** Platillo colgante con sus tres cadenas y su carga encima (siempre horizontal). */
function Platillo({ x, y, children }: { x: number; y: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      {[-1, 0, 1].map((c) => <path key={c} d={`M0,0 L${c * 92},150`} stroke={LATON[0]} strokeWidth={4} strokeDasharray="10 6" strokeLinecap="round" />)}
      <circle r={12} fill={LATON[1]} />
      <g transform="translate(0,150)">
        <ellipse cx={4} cy={40} rx={110} ry={16} fill={B.sombra} />
        <path d="M-112,0 C-100,40 100,40 112,0 Z" fill={LATON[0]} />
        <path d="M-104,0 C-92,30 92,30 104,0 Z" fill={LATON[1]} />
        <ellipse cx={0} cy={0} rx={112} ry={14} fill={LATON[1]} />
        <ellipse cx={0} cy={-2} rx={100} ry={9} fill={LATON[2]} opacity={0.6} />
        <g transform="translate(0,-14)">{children}</g>
      </g>
    </g>
  );
}

/** Balanza de latón: pie, columna, astil con remates y fiel, y dos platillos que cuelgan rectos. `ang` inclina el astil. */
function Balanza({ x, y, ang, reloj, izq, der, o = 1 }: { x: number; y: number; ang: number; reloj: number; izq: ReactNode; der: ReactNode; o?: number }) {
  const a = ang + Math.sin(reloj / 900) * 1.2;
  const rad = (a * Math.PI) / 180, L = 360;
  const ext = (s: number) => [x + Math.cos(rad) * L * s, y - 230 + Math.sin(rad) * L * s];
  const [xi, yi] = ext(-1), [xd, yd] = ext(1);
  return (
    <g opacity={o}>
      <ellipse cx={x + 6} cy={y + 50} rx={170} ry={22} fill={B.sombra} />
      <path d={`M${x - 150},${y + 40} C${x - 140},${y} ${x + 140},${y} ${x + 150},${y + 40} Z`} fill={LATON[0]} />
      <path d={`M${x - 136},${y + 32} C${x - 120},${y + 6} ${x + 120},${y + 6} ${x + 136},${y + 32} Z`} fill={LATON[1]} />
      <rect x={x - 18} y={y - 236} width={36} height={244} rx={14} fill={LATON[0]} />
      <rect x={x - 14} y={y - 236} width={22} height={240} rx={11} fill={LATON[1]} />
      <rect x={x - 8} y={y - 220} width={6} height={210} rx={3} fill={LATON[2]} opacity={0.7} />
      <g transform={`translate(${x},${y - 230}) rotate(${a.toFixed(2)})`}>
        <rect x={-L} y={-11} width={L * 2} height={22} rx={11} fill={LATON[0]} />
        <rect x={-L} y={-11} width={L * 2} height={14} rx={7} fill={LATON[1]} />
        <path d="M-60,-11 L0,-34 L60,-11 Z" fill={LATON[1]} />
        <path d="M-6,-20 L0,-96 L6,-20 Z" fill={LATON[0]} />
        <circle cx={-L} cy={0} r={16} fill={LATON[1]} /><circle cx={L} cy={0} r={16} fill={LATON[1]} />
      </g>
      <circle cx={x} cy={y - 230} r={20} fill={LATON[0]} /><circle cx={x - 3} cy={y - 233} r={13} fill={LATON[2]} />
      <Platillo x={xi} y={yi}>{izq}</Platillo>
      <Platillo x={xd} y={yd}>{der}</Platillo>
    </g>
  );
}

const ElProblema: Lamina = ({ p, reloj }) => {
  const ang = tramo(p('peligrosa'), 0, 1) * 10 - tramo(p('soluble'), 0, 1) * 10;
  return (
    <g>
      <Bandera x={800} y={70} txt="el problema" color="#C2307A" p={p('problema')} t={32} punta="no" />
      <Balanza x={800} y={640} ang={ang} reloj={reloj} o={tramo(p('problema'), 0, 0.4)}
        izq={<Tetrapirrol y={-56} k={0.42} plegada={1} tono={B.bilirrubina} vibra={reloj} />}
        der={<Cerebro y={-60} k={0.42} o={tramo(p('peligrosa'), 0, 0.5)} />} />
      <Txt x={300} y={250} txt="liposoluble: útil" t={28} p={p('util')} color={TXB.verde} />
      <Txt x={1300} y={250} txt="… y peligrosa" t={28} p={p('peligrosa')} color={TXB.hemo} />
      <Txt x={800} y={780} txt="hay que volverla soluble en agua" t={32} p={p('soluble')} />
      <Sale p={p('higado')} x={720} y={900} k={0.26}><Higado corte={false} /></Sale>
      <Txt x={900} y={900} txt="el hígado" t={30} p={p('higado')} color={TXB.hepato} ancla="start" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Paradoja, Liposoluble, ElBarco, Libre, Antioxidante, Hormona, ElProblema];
export default LAMINAS;
