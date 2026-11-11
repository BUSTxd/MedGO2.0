'use client';
// Capítulo 0 · Dos pacientes, una pregunta. Los dos casos son ilustrativos (no vienen de la clase).

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Corazon, Enterocito, En, Flecha, FLECHA, Frasco, G, Hematie, Intestino, Manometro, Neutrofilo, PildoraFlota, Pulmones, Retrato, Rinon, Sale, Suero, Tarjeta, Termometro, TXT_CASO, Txt, Ventilador, V, clamp, easeOut, tramo, TXTC } from '../Piezas';

/** Frasco de hemocultivo con bacilos dentro (`n` visibles). */
function Hemocultivo({ x, y, k = 1, bacterias = 0, tono = G.patogeno as readonly string[], flagelo = 0 }: { x: number; y: number; k?: number; bacterias?: number; tono?: readonly string[]; flagelo?: number }) {
  return (
    <En x={x} y={y} k={k}>
      <Frasco tono={['#9B1B3A', '#E5324C']} />
      {[[-8, -34, -20], [10, -4, 25], [-10, 28, -8]].map(([cx, cy, r], i) => <Bacilo key={i} x={cx} y={cy} r={r} k={0.4 * tramo(bacterias, i * 0.25, 0.5 + i * 0.25)} tono={tono} flagelo={flagelo} />)}
    </En>
  );
}

const Ella: Lamina = ({ p, reloj }) => {
  const quimio = p('quimio');
  return (
    <g>
      <Sale p={p('persona')} x={290} y={540}>
        <Tarjeta w={440} h={540} y={-10} color="#FFF1F6" />
        <Retrato quien="ella" y={-30} k={1.08} triste={quimio} />
      </Sale>
      <Bandera x={290} y={165} txt="58 años" color={V.turquesa[0]} p={p('persona')} t={32} />
      <Txt x={290} y={850} txt="leucemia en quimioterapia" t={28} p={p('leucemia')} />
      <Bandera x={290} y={920} txt={TXT_CASO} color={V.violeta[0]} p={p('persona')} t={22} punta="no" />
      <Sale p={quimio} x={565} y={540} k={0.92}><Suero gota={quimio > 0.05 ? reloj / 900 : 0} /></Sale>
      <Bandera x={600} y={165} txt="Quimioterapia" color={V.ambar[0]} p={quimio} t={30} punta="abajo" />
      <Sale p={p('mucositis')} x={880} y={500} k={1.05}><Intestino lesion={p('mucositis')} /></Sale>
      <Bandera x={880} y={785} txt="Mucositis y diarrea" color="#B8237A" p={p('mucositis')} t={28} />
      <Sale p={p('fiebre')} x={1130} y={350} k={0.46}><Termometro val={0.92} /></Sale>
      <Txt x={1130} y={470} txt="fiebre" t={28} p={p('fiebre')} />
      <Sale p={p('presion')} x={1340} y={300} k={1.15}><Manometro x={0} y={0} val={0.12} /></Sale>
      <Txt x={1345} y={440} txt="presión baja" t={28} p={p('presion')} color={TXTC.sangre} />
      <Flecha a={[1010, 600]} b={[1290, 650]} c={[1150, 720]} p={p('suya')} color={FLECHA} w={8} />
      <Txt x={1300} y={800} txt="su propio intestino" t={26} p={p('suya')} />
      <Sale p={p('cultivo')} x={1420} y={640}><Hemocultivo x={0} y={0} k={1.3} bacterias={p('ecoli')} /></Sale>
      <Bandera x={1420} y={880} txt="Hemocultivo: E. coli" color={V.nucleo[1]} p={p('cultivo')} t={28} />
    </g>
  );
};

const El: Lamina = ({ p, reloj }) => {
  const tubo = p('tubo');
  return (
    <g>
      <Sale p={p('persona')} x={290} y={540}>
        <Tarjeta w={440} h={540} y={-10} color="#EFF8F9" />
        <Retrato quien="el" y={-30} k={1.08} tubo={tubo} />
      </Sale>
      <Bandera x={290} y={165} txt="67 años" color={V.turquesa[0]} p={p('persona')} t={32} />
      <Bandera x={290} y={920} txt={TXT_CASO} color={V.violeta[0]} p={p('persona')} t={22} punta="no" />
      <Sale p={p('uci')} x={640} y={640}><g transform="scale(-1,1)"><Ventilador reloj={reloj} k={0.95} /></g></Sale>
      <Bandera x={640} y={165} txt="Ventilación mecánica" color={V.ambar[0]} p={p('uci')} t={28} punta="abajo" />
      <Txt x={640} y={830} txt="9 días en UCI" t={28} p={p('dias')} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={560 + i * 20} cy={870} r={7} fill={V.ambar[1]} opacity={tramo(p('dias'), i * 0.09, 0.3 + i * 0.09)} />)}
      <Sale p={p('neumonia')} x={960} y={500} k={1.1}><Pulmones infiltrados={p('neumonia')} /></Sale>
      <Bandera x={960} y={790} txt="Neumonía" color="#B8237A" p={p('neumonia')} t={30} />
      {[0, 1, 2].map((i) => <Bacilo key={i} x={900 + i * 62} y={430 + (i % 2) * 90} r={-30 + i * 40} k={0.5 * tramo(p('pseudo'), i * 0.2, 0.5 + i * 0.2)} flagelo={p('pseudo')} reloj={reloj} />)}
      <Txt x={960} y={850} txt="Pseudomonas" t={26} p={p('pseudo')} color={TXTC.patogeno} />
      <Flecha a={[1110, 560]} b={[1290, 650]} c={[1220, 640]} p={p('sangre')} color={FLECHA} w={8} />
      <Sale p={p('sangre')} x={1420} y={640}><Hemocultivo x={0} y={0} k={1.3} bacterias={p('sangre')} flagelo={1} /></Sale>
      <Bandera x={1420} y={880} txt="Después, la sangre" color={V.nucleo[1]} p={p('sangre')} t={28} />
    </g>
  );
};

/** Cinco peldaños: de la colonización a la sepsis. */
const PELDANOS = [
  { n: 'colonizacion', txt: 'Colonización', x: 220, h: 150, c: G.comensal },
  { n: 'localizada', txt: 'Infección localizada', x: 510, h: 230, c: G.amarillo },
  { n: 'bacteriemia', txt: 'Bacteriemia', x: 800, h: 310, c: G.patogeno },
  { n: 'toxemia', txt: 'Toxemia', x: 1090, h: 390, c: G.toxina },
  { n: 'sepsis', txt: 'Sepsis', x: 1380, h: 470, c: G.rosa },
] as const;

function Tubo({ x, y, w = 190, children }: { x: number; y: number; w?: number; children?: ReactNode }) {
  return (
    <En x={x} y={y}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={46} fill="#5E1030" /><rect x={-w / 2 + 6} y={-40} width={w - 12} height={74} rx={37} fill="#7E1840" />
      {children}
    </En>
  );
}

const Cinco: Lamina = ({ p, reloj }) => {
  const iconos = [
    (q: number) => (
      <g>
        <ellipse cx={0} cy={44} rx={100} ry={26} fill={G.epitelio[1]} /><ellipse cx={0} cy={36} rx={96} ry={22} fill={G.epitelio[2]} />
        {[-50, 0, 50].map((dx, i) => <Bacilo key={i} x={dx} y={6 - (i % 2) * 4} r={i * 15 - 15} k={0.5 * tramo(q, i * 0.2, 0.5 + i * 0.2)} tono={G.comensal} />)}
      </g>
    ),
    (q: number) => (
      <g>
        <circle cy={4} r={78} fill="#FF7A8A" opacity={0.35 * q} /><ellipse cx={0} cy={44} rx={100} ry={26} fill={G.epitelio[1]} />
        {[-40, 10, 56].map((dx, i) => <Bacilo key={i} x={dx} y={30 - (i % 2) * 40} r={i * 40 - 30} k={0.5 * tramo(q, i * 0.2, 0.5 + i * 0.2)} />)}
        <Neutrofilo x={-70} y={-40} k={0.55} o={tramo(q, 0.4, 0.9)} activo={q} />
      </g>
    ),
    (q: number) => (
      <Tubo x={0} y={10} w={200}>
        {[[-56, -4], [-4, 10], [50, -8]].map(([cx, cy], i) => <Hematie key={i} x={cx} y={cy} k={0.42} o={tramo(q, i * 0.15, 0.5)} />)}
        {[[-30, 12, 10], [24, -10, -20], [70, 12, 30]].map(([cx, cy, r], i) => <Bacilo key={i} x={cx} y={cy} r={r} k={0.45 * tramo(q, 0.3 + i * 0.15, 0.7 + i * 0.15)} flagelo={q} reloj={reloj} />)}
      </Tubo>
    ),
    (q: number) => (
      <Tubo x={0} y={10} w={200}>
        {[[-56, -4], [-4, 10], [50, -8]].map(([cx, cy], i) => <Hematie key={i} x={cx} y={cy} k={0.42} />)}
        {[[-30, 14], [20, -12], [66, 14], [-66, -16]].map(([cx, cy], i) => <g key={i} opacity={tramo(q, i * 0.15, 0.5 + i * 0.15)}><circle cx={cx} cy={cy} r={11} fill={G.toxina[1]} /><circle cx={cx - 3} cy={cy - 3} r={4} fill="#FFF" opacity={0.8} /></g>)}
      </Tubo>
    ),
    (q: number) => (
      <g>
        <Rinon x={-70} y={10} k={0.5} palido={q} o={tramo(q, 0, 0.4)} />
        <Corazon x={50} y={4} k={0.5} o={tramo(q, 0.2, 0.6)} />
        <En x={104} y={-48} k={tramo(q, 0.5, 1)}><circle r={22} fill="#E5324C" /><rect x={-4} y={-14} width={8} height={18} rx={3} fill="#FFF" /><circle cy={10} r={4.5} fill="#FFF" /></En>
      </g>
    ),
  ];
  return (
    <g>
      <rect x={60} y={900} width={1480} height={14} rx={7} fill={G.sombra} />
      {PELDANOS.map((s, i) => {
        const q = p(['colonizacion', 'localizada', 'bacteriemia', 'toxemia', 'sepsis'][i]);
        const top = 900 - s.h * easeOut(clamp(q * 1.4));
        return (
          <g key={s.n}>
            {q > 0.01 && <rect x={s.x - 140} y={top} width={280} height={900 - top} fill={s.c[0]} />}
            {q > 0.01 && <rect x={s.x - 140} y={top} width={272} height={Math.max(0, 900 - top - 8)} fill={s.c[1]} />}
            {q > 0.01 && <rect x={s.x - 126} y={top + 10} width={36} height={Math.max(0, (900 - top) * 0.5)} rx={10} fill="#FFF" opacity={0.18} />}
            <En x={s.x} y={top - 110} o={tramo(q, 0.2, 0.7)} k={0.95 + 0.05 * q}>{iconos[i](tramo(q, 0.25, 1))}</En>
            <Bandera x={s.x} y={top + 62} txt={s.txt} color={s.c[0]} p={tramo(q, 0.1, 0.8)} t={s.txt.length > 14 ? 21 : 28} punta="no" />
          </g>
        );
      })}
      <Bandera x={800} y={90} txt="Cinco palabras que no son sinónimos" color="var(--cit-base)" p={p('palabras')} t={34} punta="no" />
      <En x={1235} y={170} o={tramo(p('distinto'), 0, 0.6)} k={0.7 + 0.3 * tramo(p('distinto'), 0, 0.6)}>
        <rect x={-62} y={-40} width={124} height={80} rx={14} fill="#FFD23F" />
        <text textAnchor="middle" dy="0.35em" style={{ fontSize: 56, fontWeight: 800 }} fill="#3B1A6E">≠</text>
      </En>
      <Txt x={1235} y={238} txt="bacteriemia y sepsis" t={24} p={p('distinto')} color={TXTC.epitelio} />
    </g>
  );
};

/** Balanza: el platillo izquierdo (pocas bacterias) pesa menos que el derecho (la respuesta del huésped y las toxinas). */
function Balanza({ q }: { q: number }) {
  const inc = -14 * easeOut(clamp(q));
  return (
    <g>
      <rect x={-8} y={-70} width={16} height={190} rx={6} fill="#5B3A86" /><rect x={-60} y={112} width={120} height={16} rx={8} fill="#5B3A86" />
      <g transform={`rotate(${inc} 0 -70)`}>
        <rect x={-130} y={-80} width={260} height={14} rx={7} fill="#7A45E6" />
        <path d="M-130,-66 L-130,-10 M130,-66 L130,-10" stroke="#5B3A86" strokeWidth={5} />
        <g transform={`translate(-130,${-10 - inc * 0.2})`}>
          <path d="M-52,0 L52,0 Q40,40 0,40 Q-40,40 -52,0 Z" fill="#FFB21E" />
          {[-20, 14, 0].map((dx, i) => <Bacilo key={i} x={dx} y={-14 - i * 3} r={i * 30 - 20} k={0.3} />)}
        </g>
        <g transform={`translate(130,${-10 + inc * 0.2})`}>
          <path d="M-52,0 L52,0 Q40,40 0,40 Q-40,40 -52,0 Z" fill="#FFB21E" />
          <Neutrofilo x={-10} y={-30} k={0.5} activo={0.8} />
          <circle cx={34} cy={-14} r={10} fill={G.toxina[1]} />
        </g>
      </g>
      <circle cx={0} cy={-72} r={11} fill="#3B1A6E" />
    </g>
  );
}

const Pregunta: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Cuatro preguntas" color="var(--cit-base)" p={p('entra')} t={34} punta="no" />
      {/* ¿Por dónde entra? */}
      <Sale p={p('entra')} x={250} y={330}>
        <rect x={-92} y={-130} width={184} height={260} rx={22} fill="#7A45E6" /><rect x={-80} y={-118} width={160} height={236} rx={14} fill="#B79BFF" />
        <circle cx={50} cy={6} r={9} fill="#FFD23F" />
        <Bacilo x={-150} y={74} r={-10} k={0.5} />
      </Sale>
      <Txt x={250} y={520} txt="¿por dónde entra?" t={30} p={p('entra')} />
      {/* ¿Cómo cruza? */}
      <Sale p={p('cruza')} x={650} y={330}>
        <Enterocito x={-78} y={30} k={0.8} micro={0} /><Enterocito x={78} y={30} k={0.8} micro={0} />
        <Bacilo x={0} y={-6} r={90} k={0.6} />
      </Sale>
      <Txt x={650} y={520} txt="¿cómo cruza la barrera?" t={30} p={p('cruza')} />
      {/* ¿Qué libera? */}
      <Sale p={p('libera')} x={1050} y={330}>
        <Bacilo k={1} sombra />
        {[[-70, -60], [70, -64], [-50, 66], [78, 52]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={14} fill={G.toxina[1]} /><circle cx={cx - 4} cy={cy - 4} r={5} fill="#FFF" opacity={0.8} /></g>)}
      </Sale>
      <Txt x={1050} y={520} txt="¿qué libera?" t={30} p={p('libera')} />
      {/* ¿Por qué no depende del número? */}
      <Sale p={p('cuantas')} x={1400} y={350} k={0.9}><Balanza q={p('cuantas')} /></Sale>
      <Txt x={1400} y={520} txt="¿solo cuenta cuántas son?" t={28} p={p('cuantas')} />
      {/* la segunda pregunta */}
      <PildoraFlota x={560} y={760} k={1.5} rl={reloj} p={p('farmaco')} />
      <Txt x={960} y={720} txt="¿qué clase de fármaco llega a cada bacteria?" t={32} p={p('farmaco')} />
      <Txt x={960} y={780} txt="y por qué, a veces, no llega" t={28} p={p('farmaco')} fuerte={false} />
      <Bandera x={960} y={880} txt="Repaso de Farmacología" color="#2F6FD8" p={p('farmaco')} t={26} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Ella, El, Cinco, Pregunta];
export default LAMINAS;
