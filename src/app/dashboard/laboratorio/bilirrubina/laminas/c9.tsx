'use client';
// Capítulo 9 · El cerebro en riesgo: kernícterus y la luz. La barrera hematoencefálica con las neuronas que
// se tiñen, el corte coronal con sus núcleos, el recién nacido en su incubadora (flojo, luego arqueado), las
// secuelas dibujadas, la lámpara de fototerapia con un zoom a la piel, la exanguinotransfusión y la terapia génica.

import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, BolsaSangre, Flecha, HematieRoto, Hepatocito, Jeringa, Maquina, Sale, Termometro, Tetrapirrol, Tijera, Txt, TXB, Vaso, Visto, clamp, easeOut, hash, lerp, mezcla, tijeretazo, tramo } from '../Piezas';
import { IgG } from '../../citopenias-autoinmunes/Piezas';
import { Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Bebe, CorteCerebro, HigadoB, Incubadora, LamparaFoto, NUCLEOS_CORTE } from '../Escenas';

type P2 = [number, number];
const LUMI = ['#1E8A5A', '#5FD69A', '#D0FFE4'] as const;

/** Neurona: soma violeta con dendritas y axón; `tinte` 0-1 la tiñe de amarillo. */
function Neurona({ x, y, k = 1, tinte = 0, sem = 1, reloj = 0 }: { x: number; y: number; k?: number; tinte?: number; sem?: number; reloj?: number }) {
  const c0 = mezcla('#4A1F8A', B.bilirrubina[0], clamp(tinte)), c1 = mezcla('#8A5AF0', B.bilirrubina[1], clamp(tinte));
  const late = 1 + Math.sin(reloj / 700 + sem) * 0.03;
  return (
    <g transform={`translate(${x},${y}) scale(${k * late})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 + hash(sem, i), L = 60 + hash(i, sem) * 30;
        const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
        return <g key={i}><path d={`M0,0 Q${ex * 0.5 + 10},${ey * 0.5 - 10} ${ex},${ey}`} fill="none" stroke={c0} strokeWidth={10} strokeLinecap="round" /><path d={`M${ex * 0.7},${ey * 0.7} l${Math.cos(a + 0.7) * 26},${Math.sin(a + 0.7) * 26} M${ex * 0.7},${ey * 0.7} l${Math.cos(a - 0.7) * 22},${Math.sin(a - 0.7) * 22}`} fill="none" stroke={c0} strokeWidth={6} strokeLinecap="round" /></g>;
      })}
      <circle r={30} fill={c0} /><circle cx={-3} cy={-3} r={25} fill={c1} />
      <circle cx={2} cy={2} r={10} fill={c0} /><circle cx={-10} cy={-11} r={5} fill="#FFF" opacity={0.7} />
    </g>
  );
}

const NoAlcanza: Lamina = ({ p, reloj }) => {
  const libre = p('libre'), perm = p('permeable'), org = p('origen');
  const celdas = 8;
  return (
    <g>
      <Bandera x={800} y={50} txt="cuando la albúmina no alcanza" color="#6D3FD8" p={p('alcanza')} t={30} punta="no" />
      {/* Capilar del cerebro: albúminas cargadas y bilirrubina libre */}
      <Vaso x={800} y={250} largo={1760} ancho={230} ang={0} reloj={reloj} flujo={8} pared={34} o={tramo(p('alcanza'), 0, 0.4)}>
        {Array.from({ length: 5 }, (_, i) => {
          const X = ((hash(i, 31) * 1760 + reloj * 0.05) % 1760) - 880;
          return <g key={i}><Albumina x={X} y={20} k={0.55} reloj={reloj} fase={i} /><Tetrapirrol x={X} y={-14} k={0.12} plegada={1} tono={B.bilirrubina} /></g>;
        })}
        {libre > 0.01 && Array.from({ length: 6 }, (_, i) => {
          const X = ((hash(i, 41) * 1760 + reloj * 0.07) % 1760) - 880;
          return <Tetrapirrol key={`l${i}`} x={X} y={-60 + hash(i, 42) * 120} k={0.12} plegada={1} tono={B.bilirrubina} vibra={reloj} o={libre} />;
        })}
      </Vaso>
      <Txt x={250} y={130} txt="todas ocupadas" t={22} p={p('alcanza')} color="#FFFFFF" />
      <Txt x={1220} y={130} txt="la libre, sin escolta" t={24} p={libre} color="#FFE08A" />
      {/* La barrera: células endoteliales con uniones estrechas, y los pies de los astrocitos */}
      <g opacity={tramo(p('barrera'), 0, 0.4)}>
        {Array.from({ length: celdas }, (_, i) => {
          const w = 1600 / celdas, hueco = 8 + 30 * easeOut(perm);
          return (
            <g key={i}>
              <rect x={i * w + hueco / 2} y={395} width={w - hueco} height={52} rx={22} fill="#C2307A" />
              <rect x={i * w + hueco / 2} y={391} width={w - hueco - 6} height={44} rx={20} fill="#F27BA0" />
              <ellipse cx={i * w + w / 2} cy={414} rx={34} ry={13} fill="#7A1A5A" />
              <rect x={i * w + 10} y={455} width={w - 20} height={18} rx={9} fill="#5A9AE0" opacity={0.85} />
            </g>
          );
        })}
      </g>
      <Txt x={1180} y={500} txt="barrera hematoencefálica" t={24} p={p('barrera')} />
      {/* La libre cruza por las uniones y entra al cerebro */}
      {libre > 0.01 && Array.from({ length: 5 }, (_, i) => {
        const u = (reloj / 2600 + i / 5) % 1, gx = (1 + i * 1.5) * 200;
        return <Tetrapirrol key={i} x={gx + Math.sin(u * 6) * 10} y={lerp(340, 720, u)} k={0.13} plegada={1} tono={B.bilirrubina} o={libre * tramo(Math.min(u, 1 - u), 0, 0.1) * (0.4 + 0.6 * perm)} />;
      })}
      {/* Tejido nervioso que se tiñe */}
      <g opacity={tramo(p('barrera'), 0, 0.4)}>
        {[[220, 700], [520, 820], [820, 680], [1100, 830], [1380, 700]].map(([nx, ny], i) => <Neurona key={i} x={nx} y={ny} k={0.9} sem={i + 3} tinte={org * (0.6 + 0.4 * hash(i, 7))} reloj={reloj} />)}
      </g>
      <Txt x={1180} y={550} txt="en el recién nacido, más permeable" t={22} p={perm} color={TXB.violeta} />
      <Bandera x={800} y={950} txt="el origen del kernícterus" color="#6D3FD8" p={org} t={26} punta="no" />
    </g>
  );
};

const Nucleos: Lamina = ({ p, reloj }) => {
  const NOMBRES: { n: string; clave: string; txt: string }[] = [
    { n: 'globo', clave: 'globo', txt: 'globo pálido' },
    { n: 'subtalamico', clave: 'subtalamico', txt: 'núcleo subtalámico' },
    { n: 'hipocampo', clave: 'hipocampo', txt: 'hipocampo' },
    { n: 'oculomotores', clave: 'tronco', txt: 'núcleos oculomotores y auditivos' },
    { n: 'cerebelo', clave: 'cerebelo', txt: 'cerebelo' },
  ];
  const CX = 560, CY = 470, K = 1.18;
  const tinte: Record<string, number> = {};
  NOMBRES.forEach((m) => { tinte[m.clave] = p(m.n); });
  return (
    <g>
      <Bandera x={800} y={50} txt="«kern» = núcleo: ictericia nuclear" color="#6D3FD8" p={p('kern')} t={30} punta="no" />
      <Sale p={p('nucleo')} x={CX} y={CY} k={K}><CorteCerebro tinte={tinte} reloj={reloj} /></Sale>
      {NOMBRES.map((m, i) => {
        const [lx, ly] = NUCLEOS_CORTE[m.clave][m.clave === 'tronco' ? 0 : 1];
        const a: P2 = [CX + (lx + (m.clave === 'tronco' ? 18 : 0)) * K, CY + ly * K];
        const ty = 240 + i * 135;
        const q = p(m.n);
        return (
          <g key={m.n}>
            <path d={`M${a[0]},${a[1]} C${lerp(a[0], 1080, 0.5)},${a[1]} ${lerp(a[0], 1080, 0.5)},${ty} 1080,${ty}`} fill="none" stroke="var(--cit-flecha)" strokeWidth={3} strokeDasharray={`${easeOut(clamp(q * 1.4)) * 700} 800`} />
            {q > 0.01 && <circle cx={a[0]} cy={a[1]} r={7} fill="#FFD23F" stroke="#9E0B2E" strokeWidth={2} />}
            <Txt x={1100} y={ty} txt={m.txt} t={26} p={q} ancla="start" />
          </g>
        );
      })}
    </g>
  );
};

/** Biberón: tetina, rosca, frasco y leche (`nivel`). */
function Biberon({ nivel = 0.5 }: { nivel?: number }) {
  return (
    <g>
      <path d="M-14,-118 C-14,-140 14,-140 14,-118 L22,-86 L-22,-86 Z" fill="#E8A86A" />
      <rect x={-40} y={-90} width={80} height={26} rx={8} fill="#5AA0E0" />
      <rect x={-36} y={-64} width={72} height={150} rx={22} fill="#DCEAF4" />
      <rect x={-30} y={86 - 140 * nivel} width={60} height={140 * nivel - 6} rx={16} fill="#FFFFFF" />
      {[-30, 0, 30].map((yy) => <rect key={yy} x={14} y={yy} width={16} height={4} rx={2} fill="#8FB0CC" />)}
      <rect x={-28} y={-54} width={8} height={120} rx={4} fill="#FFF" opacity={0.7} />
    </g>
  );
}

const Aguda: Lamina = ({ p, reloj }) => {
  const cambia = p('cambia'), arco = easeOut(p('opistotonos'));
  const flojo = p('letargico') * (1 - cambia);
  return (
    <g>
      <Bandera x={800} y={50} txt="la encefalopatía aguda" color="#6D3FD8" p={p('aguda')} t={30} punta="no" />
      <Sale p={p('discreta')} x={520} y={560} k={0.95}>
        <Incubadora x={0} y={0}><Bebe x={-20} y={-60} k={0.8} amarillo={0.75} flojo={flojo} llora={cambia} arco={arco} ojos={0} reloj={reloj} /></Incubadora>
      </Sale>
      {/* Zzz del letargo */}
      {flojo > 0.05 && [0, 1, 2].map((i) => {
        const u = (reloj / 1800 + i / 3) % 1;
        return <text key={i} x={300 + u * 60} y={320 - u * 90} style={{ fontSize: 30 + i * 6, fontWeight: 800, fill: '#7A6AA8' }} opacity={flojo * (1 - u)}>z</text>;
      })}
      {/* Primero, discreta */}
      <Txt x={1220} y={170} txt="primero, discreta" t={28} p={p('discreta')} />
      <g opacity={tramo(p('letargico'), 0, 0.4)}>
        <text x={1030} y={260} style={{ fontSize: 46, fontWeight: 800, fill: '#7A6AA8' }}>Zz</text>
        <path d="M1180,250 C1210,270 1250,272 1280,250" fill="none" stroke="#2E78F2" strokeWidth={14} strokeLinecap="round" />
        <g transform="translate(1420,250) scale(0.42)"><Biberon nivel={0.85} /></g>
      </g>
      <Txt x={1220} y={330} txt="letargo · hipotonía · succión débil" t={24} p={p('letargico')} color={TXB.albumina} />
      <Flecha a={[1220, 380]} b={[1220, 470]} p={cambia} color="var(--cit-flecha)" w={8} />
      <Txt x={1220} y={510} txt="si sigue, cambia" t={28} p={cambia} />
      <g opacity={tramo(cambia, 0, 0.4)}>
        {[0, 1, 2].map((i) => <path key={i} d={`M${1060 + i * 26},560 q20,26 0,52`} fill="none" stroke="#E3203F" strokeWidth={8} strokeLinecap="round" />)}
        <path d="M1260,610 C1240,560 1300,540 1330,580" fill="none" stroke="#D7263D" strokeWidth={14} strokeLinecap="round" />
      </g>
      <Txt x={1220} y={670} txt="llanto agudo · hipertonía" t={24} p={cambia} color={TXB.hemo} />
      <g opacity={tramo(p('opistotonos'), 0, 0.4)}>
        <path d="M1080,800 Q1220,700 1360,800" fill="none" stroke="#D7263D" strokeWidth={16} strokeLinecap="round" />
        <circle cx={1070} cy={806} r={22} fill="#D7263D" />
      </g>
      <Txt x={1220} y={860} txt="opistótonos: arqueado hacia atrás" t={24} p={p('opistotonos')} color={TXB.hemo} />
    </g>
  );
};

/** Antebrazo y mano que se tuercen solos (movimientos involuntarios). */
function Mano({ reloj }: { reloj: number }) {
  const g = Math.sin(reloj / 300) * 16, d = Math.sin(reloj / 210 + 1) * 10;
  const piel = ['#C9806A', '#E9A58A', '#F6CDB8'];
  return (
    <g>
      <path d="M0,150 C0,110 -6,80 -4,40" fill="none" stroke={piel[0]} strokeWidth={56} strokeLinecap="round" />
      <path d="M0,150 C0,110 -6,80 -4,40" fill="none" stroke={piel[1]} strokeWidth={44} strokeLinecap="round" transform="translate(-3,-2)" />
      <g transform={`translate(-4,30) rotate(${g})`}>
        {[-26, -9, 8, 25].map((fx, i) => <g key={i} transform={`translate(${fx},-40) rotate(${(i - 1.5) * 8 + d * (i % 2 ? 1 : -1)})`}><rect x={-8} y={-60 + i % 2 * 6} width={16} height={64} rx={8} fill={piel[0]} /><rect x={-7} y={-58 + i % 2 * 6} width={12} height={58} rx={6} fill={piel[1]} /></g>)}
        <g transform={`translate(-34,-6) rotate(${-40 + d})`}><rect x={-8} y={-44} width={17} height={50} rx={8} fill={piel[0]} /><rect x={-7} y={-42} width={13} height={44} rx={6} fill={piel[1]} /></g>
        <rect x={-38} y={-46} width={76} height={70} rx={26} fill={piel[0]} />
        <rect x={-36} y={-46} width={70} height={64} rx={24} fill={piel[1]} />
      </g>
      {[0, 1].map((i) => <path key={i} d={`M${70 + i * 22},-70 q16,24 0,48 q-16,24 0,48`} fill="none" stroke="#8A5AF0" strokeWidth={6} strokeLinecap="round" opacity={0.75} />)}
    </g>
  );
}

/** Oreja con su caracol y las ondas que no llegan. */
function Oreja({ reloj }: { reloj: number }) {
  return (
    <g>
      <path d="M-30,-110 C50,-130 100,-60 80,10 C66,56 30,62 26,100 C22,140 -30,140 -36,104" fill="none" stroke="#C9806A" strokeWidth={46} strokeLinecap="round" />
      <path d="M-30,-110 C50,-130 100,-60 80,10 C66,56 30,62 26,100 C22,140 -30,140 -36,104" fill="none" stroke="#E9A58A" strokeWidth={34} strokeLinecap="round" />
      <path d="M-4,-62 C40,-66 54,-20 30,6 C14,24 2,30 -4,48" fill="none" stroke="#C9806A" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-14} cy={10} rx={14} ry={20} fill="#8A4A3A" />
      {/* Caracol */}
      <g transform="translate(-120,10)">
        <path d="M0,0 m-34,0 a34,34 0 1,1 68,0 a26,26 0 1,1 -52,0 a18,18 0 1,1 36,0 a10,10 0 1,1 -20,0" fill="none" stroke="#F25CA8" strokeWidth={10} strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((i) => {
        const u = (reloj / 1200 + i / 3) % 1;
        return <path key={i} d={`M${180 - u * 60},-40 q-20,40 0,80`} fill="none" stroke="#2E78F2" strokeWidth={7} strokeLinecap="round" opacity={(1 - u) * 0.9} />;
      })}
    </g>
  );
}

/** Los dos ojos que intentan mirar arriba y no pasan del techo. */
function MiradaArriba({ reloj }: { reloj: number }) {
  const intento = Math.max(0, Math.sin(reloj / 600)) * 10;
  return (
    <g>
      <rect x={-170} y={-70} width={340} height={14} rx={7} fill="#E3203F" />
      {[-80, 80].map((ex) => (
        <g key={ex} transform={`translate(${ex},40)`}>
          <path d="M-72,0 Q0,-60 72,0 Q0,60 -72,0 Z" fill="#B5734F" />
          <path d="M-62,0 Q0,-50 62,0 Q0,50 -62,0 Z" fill="#FFFAF5" />
          <circle cy={-8 - intento * 0.4} r={24} fill="#3E7A3A" /><circle cy={-8 - intento * 0.4} r={11} fill="#1A1030" /><circle cx={-7} cy={-15 - intento * 0.4} r={5} fill="#FFF" />
        </g>
      ))}
      <path d="M0,-30 L0,-56 M-12,-44 L0,-56 L12,-44" stroke="#E3203F" strokeWidth={7} strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Muela con raíces y el esmalte manchado. */
function Muela() {
  return (
    <g>
      <path d="M-70,-60 C-74,-104 -30,-100 0,-86 C30,-100 74,-104 70,-60 C68,-20 60,10 50,30 C44,70 36,120 20,120 C6,120 6,70 0,50 C-6,70 -6,120 -20,120 C-36,120 -44,70 -50,30 C-60,10 -68,-20 -70,-60 Z" fill="#C8B890" transform="translate(6,8)" opacity={0.5} />
      <path d="M-70,-60 C-74,-104 -30,-100 0,-86 C30,-100 74,-104 70,-60 C68,-20 60,10 50,30 C44,70 36,120 20,120 C6,120 6,70 0,50 C-6,70 -6,120 -20,120 C-36,120 -44,70 -50,30 C-60,10 -68,-20 -70,-60 Z" fill="#F7F1E0" />
      <path d="M-50,30 C-20,40 20,40 50,30" fill="none" stroke="#E0D4B8" strokeWidth={6} />
      <path d="M-48,-70 Q-40,-86 -20,-84" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
      {[[-34, -40, 13], [16, -54, 10], [-6, -10, 15], [34, -14, 11], [-30, 10, 8]].map(([cx, cy, r], i) => <g key={i}><circle cx={cx} cy={cy} r={r} fill="#C98A2A" /><circle cx={cx - 2} cy={cy - 2} r={r * 0.6} fill="#E8B84A" /></g>)}
    </g>
  );
}

const Secuelas: Lamina = ({ p, reloj }) => {
  const items = [
    { n: 'paralisis', txt: 'parálisis cerebral discinética', sub: 'movimientos involuntarios', d: <Mano reloj={reloj} /> },
    { n: 'sordera', txt: 'sordera neurosensorial', sub: '', d: <Oreja reloj={reloj} /> },
    { n: 'mirar', txt: 'le cuesta mirar hacia arriba', sub: '', d: <MiradaArriba reloj={reloj} /> },
    { n: 'esmalte', txt: 'displasia del esmalte', sub: 'de los dientes', d: <Muela /> },
  ];
  return (
    <g>
      <Bandera x={800} y={60} txt="las secuelas" color="#6D3FD8" p={p('secuelas')} t={30} punta="no" />
      {items.map((it, i) => (
        <g key={it.n}>
          <ellipse cx={210 + i * 395} cy={600} rx={120} ry={18} fill={B.sombra} opacity={tramo(p(it.n), 0, 0.4)} />
          <Sale p={p(it.n)} x={210 + i * 395} y={400 + Math.sin(reloj / 900 + i) * 6} k={1.05}>{it.d}</Sale>
          <Txt x={210 + i * 395} y={660} txt={it.txt} t={24} p={p(it.n)} />
          {it.sub && <Txt x={210 + i * 395} y={696} txt={it.sub} t={20} p={p(it.n)} fuerte={false} />}
        </g>
      ))}
      <Bandera x={800} y={850} txt="cuatro marcas de un mismo pigmento" color="#E0A100" p={p('marcas')} t={28} punta="no" />
    </g>
  );
};

/** Hoja de calendario pequeña con «< 38 sem». */
function Semanas() {
  return (
    <g>
      <rect x={-50} y={-44} width={100} height={92} rx={14} fill={B.sombra} transform="translate(5,6)" />
      <rect x={-50} y={-44} width={100} height={92} rx={14} fill="#FFF7E6" />
      <rect x={-50} y={-44} width={100} height={28} rx={14} fill="#D7263D" /><rect x={-50} y={-28} width={100} height={12} fill="#D7263D" />
      <text y={18} textAnchor="middle" style={{ fontSize: 30, fontWeight: 800, fill: '#3A1250' }}>{'<38'}</text>
    </g>
  );
}

const Riesgo: Lamina = ({ p, reloj }) => {
  const factores = [
    { n: 'semanas', txt: 'menos de 38 semanas', d: <Semanas /> },
    { n: 'albumina', txt: 'albúmina < 3 g/dL', d: <g><Albumina k={0.55} reloj={reloj} /><Tetrapirrol y={-30} k={0.1} plegada={1} tono={B.bilirrubina} /></g> },
    { n: 'hemolisis', txt: 'hemólisis isoinmune, déficit de G6PD u otra', d: <HematieRoto k={0.8} p={0.3 + ((reloj / 2400) % 1) * 0.7} /> },
    { n: 'sepsis', txt: 'sepsis o inestabilidad clínica', d: <g transform="translate(0,24) scale(0.22)"><Termometro val={0.9} /></g> },
  ];
  const baja = easeOut(p('umbral'));
  const X = (h: number) => 960 + h * 5.2, Y = (v: number) => 800 - v * 22;
  const curva = (base: number, pend: number) => Array.from({ length: 21 }, (_, i) => { const h = i * 5; return `${i ? 'L' : 'M'}${X(h).toFixed(1)},${Y(base + pend * Math.log(1 + h / 12)).toFixed(1)}`; }).join(' ');
  const sinF = curva(6, 5.6), conF = curva(4, 4.4);
  return (
    <g>
      <Bandera x={800} y={50} txt="¿quién tiene más riesgo?" color="#6D3FD8" p={p('riesgo')} t={30} punta="no" />
      <Txt x={420} y={140} txt="guía de la AAP 2022: factores de neurotoxicidad" t={24} p={p('guia')} color={TXB.albumina} />
      {factores.map((f, i) => (
        <g key={f.n}>
          <Sale p={p(f.n)} x={130} y={250 + i * 150}>{f.d}</Sale>
          <Txt x={220} y={250 + i * 150} txt={f.txt} t={26} p={p(f.n)} ancla="start" />
        </g>
      ))}
      {/* El umbral para actuar baja con cualquiera de ellos */}
      <g opacity={tramo(p('umbral'), 0, 0.4)}>
        <path d={`M${X(0)},${Y(0)} L${X(100)},${Y(0)} M${X(0)},${Y(0)} L${X(0)},${Y(22)}`} stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" />
        {[0, 24, 48, 72, 96].map((h) => <text key={h} x={X(h)} y={Y(0) + 38} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto-2)' }}>{h} h</text>)}
        <path d={sinF} fill="none" stroke="#9AA8BC" strokeWidth={10} strokeLinecap="round" />
        <path d={conF} fill="none" stroke="#D7263D" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${baja * 700} 800`} />
        <text x={X(100) - 10} y={Y(6 + 5.6 * Math.log(1 + 100 / 12)) - 18} textAnchor="end" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto-2)' }}>sin factores</text>
        <text x={X(100) - 10} y={Y(4 + 4.4 * Math.log(1 + 100 / 12)) + 56} textAnchor="end" style={{ fontSize: 20, fontWeight: 800, fill: TXB.hemo }} opacity={baja}>con un factor</text>
        {/* El bebé que sube y cruza la línea roja antes */}
        {(() => {
          const h = 70 * baja, v = 3 + 0.14 * h;
          return <g><circle cx={X(h)} cy={Y(v)} r={14} fill={B.bilirrubina[0]} /><circle cx={X(h) - 3} cy={Y(v) - 3} r={9} fill={B.bilirrubina[1]} /></g>;
        })()}
        <text x={X(-6)} y={Y(22)} textAnchor="end" style={{ fontSize: 20, fontWeight: 700, fill: 'var(--cit-texto-2)' }}>bilirrubina</text>
      </g>
      <Txt x={1220} y={180} txt="con cualquiera, el umbral para actuar baja" t={24} p={p('umbral')} color={TXB.hemo} />
      <Txt x={1220} y={900} txt="según edad gestacional y horas de vida" t={22} p={p('umbral')} fuerte={false} />
    </g>
  );
};

/** Piel en corte, vista en la lente: epidermis, dermis y un capilar con bilirrubina que la luz transforma. */
function PielZoom({ reloj, iso, lumi }: { reloj: number; iso: number; lumi: number }) {
  return (
    <g>
      <rect x={-220} y={-220} width={440} height={440} fill="#F6CDB8" />
      <path d="M-220,-120 C-140,-140 -60,-100 20,-124 C100,-148 160,-110 220,-128 L220,-220 L-220,-220 Z" fill="#7FB0FF" opacity={0.35} />
      <path d="M-220,-80 C-140,-100 -60,-60 20,-84 C100,-108 160,-70 220,-88 L220,-120 C160,-110 100,-148 20,-124 C-60,-100 -140,-140 -220,-120 Z" fill="#E9A58A" />
      <path d="M-220,90 C-100,60 60,120 220,80 L220,150 C60,190 -100,130 -220,160 Z" fill="#C8123A" opacity={0.85} />
      <path d="M-220,104 C-100,76 60,136 220,96" fill="none" stroke="#FF8A96" strokeWidth={6} opacity={0.7} />
      {Array.from({ length: 5 }, (_, i) => {
        const u = (reloj / 1100 + i / 5) % 1;
        return <path key={i} d={`M${-160 + i * 80 + u * 30},-220 L${-170 + i * 80 + u * 50},${-60 + u * 40}`} stroke="#4F8BFF" strokeWidth={8} strokeLinecap="round" opacity={0.6 * Math.sin(u * Math.PI)} />;
      })}
      <Tetrapirrol x={-40} y={20} k={0.32} plegada={1 - easeOut(iso)} tono={B.bilirrubina} vibra={reloj} o={1 - tramo(lumi, 0, 0.6)} />
      <Tetrapirrol x={-40} y={20} k={0.32} plegada={0.15} tono={LUMI} vibra={reloj} o={tramo(lumi, 0, 0.6)} />
      <Tetrapirrol x={120} y={40} k={0.2} plegada={0.15} tono={LUMI} o={tramo(lumi, 0.4, 1)} />
    </g>
  );
}

const Luz: Lamina = ({ p, reloj }) => {
  const iso = p('isomeros'), lumi = p('lumirrubina');
  return (
    <g>
      <Bandera x={800} y={50} txt="una lámpara de luz azul" color="#2E78F2" p={p('lampara')} t={30} punta="no" />
      <Sale p={p('piel')} x={470} y={680} k={0.78}>
        <Incubadora x={0} y={0} luz={p('lampara')}><Bebe x={-20} y={-60} k={0.8} ropa={false} antifaz={1} amarillo={0.75 * (1 - 0.65 * easeOut(lumi))} reloj={reloj} /></Incubadora>
      </Sale>
      <LamparaFoto x={470} y={300} k={0.9} luz={p('lampara')} reloj={reloj} alto={300} o={tramo(p('lampara'), 0, 0.4)} />
      <Txt x={770} y={290} txt="460-490 nm" t={30} p={p('nm')} color={TXB.albumina} ancla="start" />
      <Txt x={470} y={960} txt="en la piel" t={24} p={p('piel')} />
      {/* Zoom de verdad a la piel: la molécula cambia de forma */}
      <path d="M520,610 L1010,420" stroke="var(--cit-flecha)" strokeWidth={3} strokeDasharray="6 6" opacity={tramo(iso, 0, 0.5)} />
      <Lente x={1170} y={390} R={190} id="foto-piel" o={tramo(iso, 0, 0.5)}>
        <PielZoom reloj={reloj} iso={iso} lumi={lumi} />
      </Lente>
      <Txt x={1170} y={620} txt="isómeros hidrosolubles" t={26} p={iso} />
      <Txt x={1170} y={660} txt="lumirrubina: irreversible" t={28} p={lumi} color={TXB.verde} />
      <Flecha a={[1110, 700]} b={[1010, 790]} p={lumi} color="var(--cit-flecha)" w={7} />
      <Flecha a={[1230, 700]} b={[1330, 790]} p={lumi} color="var(--cit-flecha)" w={7} />
      <Txt x={990} y={830} txt="bilis" t={26} p={lumi} color={TXB.limon} />
      <Txt x={1350} y={830} txt="orina" t={26} p={lumi} color={TXB.ambar} />
      <Bandera x={1170} y={930} txt="sin conjugar: la gran excepción" color="#2E9E6A" p={p('excepcion')} t={24} punta="no" />
    </g>
  );
};

/** Bolsa de suero con su goteo (para la inmunoglobulina). */
function BolsaIV({ reloj, liquido = '#BFD6FF' }: { reloj: number; liquido?: string }) {
  const u = (reloj / 900) % 1;
  return (
    <g>
      <rect x={-6} y={-220} width={12} height={420} rx={6} fill="#9AA8BC" />
      <path d="M-60,-220 L60,-220" stroke="#9AA8BC" strokeWidth={10} strokeLinecap="round" />
      <path d="M-56,-200 L56,-200 L56,-60 C56,-30 30,-16 0,-16 C-30,-16 -56,-30 -56,-60 Z" fill="#DCEAF4" transform="translate(70,0)" />
      <path d="M-46,-150 L46,-150 L46,-62 C46,-38 26,-28 0,-28 C-26,-28 -46,-38 -46,-62 Z" fill={liquido} transform="translate(70,0)" />
      <rect x={34} y={-140} width={72} height={36} rx={6} fill="#FFFFFF" opacity={0.9} />
      <text x={70} y={-122} dy="0.35em" textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: '#2E4AA0' }}>IgIV</text>
      <rect x={60} y={-16} width={20} height={44} rx={6} fill="#DCEAF4" />
      <circle cx={70} cy={10 + u * 14} r={4} fill={liquido} opacity={1 - u} />
      <path d="M70,28 C70,80 120,100 140,160" fill="none" stroke="#C9D4E6" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

/** Matraz de laboratorio que burbujea (lo experimental). */
function Matraz({ reloj }: { reloj: number }) {
  return (
    <g>
      <path d="M-20,-90 L-20,-30 L-70,60 C-78,76 -66,90 -50,90 L50,90 C66,90 78,76 70,60 L20,-30 L20,-90 Z" fill="#DCEAF4" />
      <path d="M-44,20 L44,20 L66,62 C70,72 62,82 52,82 L-52,82 C-62,82 -70,72 -66,62 Z" fill="#8A5AF0" />
      {Array.from({ length: 4 }, (_, i) => {
        const u = (reloj / 1300 + i / 4) % 1;
        return <circle key={i} cx={-24 + i * 16} cy={70 - u * 120} r={5 + i % 2 * 3} fill="#D3C2FF" opacity={1 - u} />;
      })}
      <rect x={-28} y={-100} width={56} height={16} rx={6} fill="#9AA8BC" />
      <path d="M-12,-70 L-12,-30" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

const NoBasta: Lamina = ({ p, reloj }) => {
  const r = p('reemplaza');
  return (
    <g>
      <Bandera x={800} y={50} txt="cuando la luz no basta" color="#6D3FD8" p={p('exanguino')} t={30} punta="no" />
      {/* Exanguinotransfusión: sale sangre cargada de bilirrubina y anticuerpos, entra sangre de donante */}
      <Sale p={p('exanguino')} x={560} y={500} k={0.72}>
        <Incubadora x={0} y={0}><Bebe x={-20} y={-60} k={0.8} amarillo={0.75 * (1 - 0.5 * easeOut(r))} reloj={reloj} cateter={1} ropa={false} /></Incubadora>
      </Sale>
      <Sale p={p('exanguino')} x={160} y={260} k={0.9}><BolsaSangre /></Sale>
      <g opacity={tramo(r, 0, 0.4)}>
        <path d="M160,360 C180,540 430,540 557,461" fill="none" stroke="#C8123A" strokeWidth={10} strokeLinecap="round" />
        <path d="M557,461 C640,530 770,510 820,420 C850,370 880,340 900,330" fill="none" stroke="#C49A1A" strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: 4 }, (_, i) => {
          const u = (reloj / 1600 + i / 4) % 1;
          return <g key={i}><circle cx={lerp(160, 557, u)} cy={lerp(380, 461, u) + Math.sin(u * Math.PI) * 90} r={8} fill="#E3203F" /><circle cx={lerp(557, 900, u)} cy={lerp(461, 330, u * u)} r={8} fill={B.bilirrubina[1]} /></g>;
        })}
        <Jeringa x={960} y={300} r={60} liquido="#E0B030" />
        {[0, 1].map((i) => <IgG key={i} x={900 + i * 40} y={400} r={i * 40} k={0.9} />)}
      </g>
      <Txt x={560} y={790} txt="exanguinotransfusión: se reemplaza la sangre" t={24} p={r} />
      <Txt x={560} y={826} txt="se van la bilirrubina y los anticuerpos" t={22} p={r} fuerte={false} />
      {/* Inmunoglobulina intravenosa */}
      <Sale p={p('inmunoglobulina')} x={1280} y={420} k={0.9}><BolsaIV reloj={reloj} /></Sale>
      <Txt x={1340} y={620} txt="inmunoglobulina IV" t={24} p={p('inmunoglobulina')} />
      <Txt x={1340} y={654} txt="en la hemólisis isoinmune" t={20} p={p('inmunoglobulina')} fuerte={false} />
      {/* Inhibidores de la hemo oxigenasa: la tijera del principio, aún en el laboratorio */}
      <g opacity={tramo(p('inhibidores'), 0, 0.4)}>
        <Tijera x={1080} y={850} k={0.9} r={-20} corta={tijeretazo(reloj, 1400) * 0.4} color="#0C9E9A" />
        <g transform="translate(1260,850) scale(0.85)"><Matraz reloj={reloj} /></g>
      </g>
      <Txt x={1170} y={960} txt="inhibidores de la hemo oxigenasa: experimentales" t={24} p={p('inhibidores')} />
    </g>
  );
};

/** Vector viral (AAV): icosaedro turquesa con la hebra del gen dentro. */
function Vector({ x, y, k = 1, o = 1, r = 0 }: { x: number; y: number; k?: number; o?: number; r?: number }) {
  if (o <= 0.002) return null;
  const pts = (R: number, d: number) => Array.from({ length: 6 }, (_, i) => `${(Math.cos((i * Math.PI) / 3 + d) * R).toFixed(1)},${(Math.sin((i * Math.PI) / 3 + d) * R).toFixed(1)}`).join(' ');
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`} opacity={o}>
      <polygon points={pts(60, 0.5)} fill={B.sombra} transform="translate(6,8)" />
      <polygon points={pts(60, 0.5)} fill="#0A7F86" />
      <polygon points={pts(50, 0.5)} fill="#16B9BE" />
      {Array.from({ length: 3 }, (_, i) => <path key={i} d={`M0,0 L${(Math.cos((i * 2 * Math.PI) / 3 + 0.5) * 50).toFixed(1)},${(Math.sin((i * 2 * Math.PI) / 3 + 0.5) * 50).toFixed(1)}`} stroke="#0A7F86" strokeWidth={4} />)}
      <path d="M-26,-6 C-10,-34 10,22 26,-6" fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" />
      <circle cx={-22} cy={-24} r={7} fill="#7FEDE8" />
    </g>
  );
}

/** Reloj de pared con un arco de horas marcado (fototerapia muchas horas). */
function RelojHoras({ reloj }: { reloj: number }) {
  return (
    <g>
      <circle r={64} fill={B.sombra} transform="translate(6,8)" />
      <circle r={64} fill="#2E4AA0" /><circle r={54} fill="#FFF7E6" />
      <path d="M0,0 L0,-54 A54,54 0 1,1 -46.8,27 Z" fill="#7FB0FF" opacity={0.6} />
      <path d="M0,0 L0,-36" stroke="#3A1250" strokeWidth={7} strokeLinecap="round" transform={`rotate(${(reloj / 40) % 360})`} />
      <path d="M0,0 L24,0" stroke="#3A1250" strokeWidth={7} strokeLinecap="round" />
      <circle r={7} fill="#3A1250" />
    </g>
  );
}

const LargoPlazo: Lamina = ({ p, reloj }) => {
  const v = p('vector');
  const viaje = (reloj / 3200) % 1;
  const llega = easeOut(tramo(viaje, 0, 0.55));
  return (
    <g>
      <Bandera x={800} y={50} txt="Crigler-Najjar tipo I a largo plazo" color="#D7263D" p={p('cn1')} t={30} punta="no" />
      {/* Fototerapia muchas horas al día */}
      <g opacity={tramo(p('cn1'), 0, 0.4)}>
        <LamparaFoto x={250} y={250} k={0.6} reloj={reloj} alto={240} ancho={200} />
        <Bebe x={250} y={480} k={0.5} ropa={false} antifaz={1} amarillo={0.6} reloj={reloj} />
        <rect x={60} y={520} width={380} height={30} rx={15} fill="#C9B8F0" />
        <g transform="translate(400,190) scale(0.7)"><RelojHoras reloj={reloj} /></g>
      </g>
      <Txt x={250} y={620} txt="fototerapia muchas horas al día" t={22} p={p('cn1')} />
      {/* Trasplante */}
      <Sale p={p('trasplante')} x={680} y={420} k={0.48}>
        <HigadoB />
        <path d="M-180,-60 C-60,-30 60,-40 200,-90" fill="none" stroke="#3A1250" strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-170 + i * 44},${-70 + i * -2 - (i > 4 ? (i - 4) * 4 : 0)} l0,24`} stroke="#3A1250" strokeWidth={5} strokeLinecap="round" />)}
      </Sale>
      <Visto x={820} y={330} k={0.9} o={p('trasplante')} />
      <Txt x={680} y={620} txt="trasplante de hígado" t={24} p={p('trasplante')} />
      {/* Terapia génica: el AAV entra y lleva el gen al núcleo; se encienden máquinas */}
      <Hepatocito x0={960} x1={1560} y0={250} y1={700} nucleo={false} sem={9} o={tramo(p('genica'), 0, 0.4)} />
      <g opacity={tramo(p('genica'), 0, 0.4)}>
        <ellipse cx={1330} cy={380} rx={100} ry={74} fill="#4A1060" /><ellipse cx={1320} cy={372} rx={80} ry={56} fill="#7A2A9A" />
        <path d="M1270,380 C1300,350 1330,410 1370,370" fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" opacity={tramo(v, 0.5, 1) * tramo(viaje, 0.5, 0.7)} />
      </g>
      <Txt x={1260} y={210} txt="terapia génica" t={30} p={p('genica')} color={TXB.bacteria} />
      <Vector x={lerp(880, 1300, llega)} y={lerp(540, 390, llega) + Math.sin(reloj / 400) * 6} k={0.8 - 0.35 * llega} r={reloj / 30} o={v * (1 - tramo(viaje, 0.55, 0.7))} />
      {[0, 1].map((i) => <Maquina key={i} x={1110 + i * 220} y={580} k={0.62} golpe={reloj + i * 300} encendida={tramo(v, 0.3, 0.8) * tramo(viaje, 0.6, 0.9)} o={tramo(p('genica'), 0, 0.4)} />)}
      <Txt x={1260} y={760} txt="AAV8 con el gen de la UGT1A1" t={24} p={v} color={TXB.bacteria} />
      <Bandera x={800} y={900} txt="prometedora, todavía no estándar" color="#6A4A5E" p={p('prometedora')} t={26} punta="no" />
    </g>
  );
};


const LAMINAS: Lamina[] = [NoAlcanza, Nucleos, Aguda, Secuelas, Riesgo, Luz, NoBasta, LargoPlazo];
export default LAMINAS;
