'use client';
// Capítulo 8 · Cuando sube la no conjugada. La metáfora de la voz, «tres grifos», se dibuja como una bañera:
// el grifo de la producción llena el depósito (la sangre), y dos llaves lo vacían, la de la captación (OATP)
// y la de la conjugación (UGT1A1). Cada lámina abre o cierra una de las tres.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Cruz, Figurita, Flecha, Hematie, HematieRoto, Hepatocito, Maquina, Medula, Moreton, Pastilla, Poro, Reticulo, Rostro, Sale, Termometro, Tetrapirrol, Txt, TXB, Vaso, Visto, clamp, easeOut, hash, lerp, mezcla, tramo } from '../Piezas';
import { IgG } from '../../citopenias-autoinmunes/Piezas';
import { Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Bebe, Deposito, Grifo, HigadoB, Incubadora, Llave, Sube, Tubo, TuboSuero, FrascoOrina } from '../Escenas';

type P2 = [number, number];
const NUM = ['#D7263D', '#C2307A', '#8A4FE0', '#2E78F2'];

/** Número de cada grifo: medalla redonda con su color. */
function Medalla({ x, y, n, p }: { x: number; y: number; n: number; p: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p * 1.3));
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * q})`} opacity={tramo(p, 0, 0.4)}>
      <circle r={30} fill={mezcla(NUM[n - 1], '#000000', 0.25)} transform="translate(3,4)" />
      <circle r={30} fill={NUM[n - 1]} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 32, fontWeight: 800, fill: '#FFF' }}>{n}</text>
    </g>
  );
}

/** La bañera entera: grifo 1 → depósito → llave 2 → hepatocito → llave 3 → bilis.
 *  `produce`, `capta`, `conjuga`: 0-1 cuánto abre cada una. `nivel`: el de la sangre. */
function Banera({ reloj, produce, capta, conjuga, nivel, o = 1, num = 1, foco = 0 }: { reloj: number; produce: number; capta: number; conjuga: number; nivel: number; o?: number; num?: number; foco?: number }) {
  if (o <= 0.002) return null;
  const top = 450, h = 340, bot = top + h;
  const yl = bot - 14 - (h - 40) * nivel;
  const salida: P2[] = [[690, 740], [880, 740]];
  const entra: P2[] = [[1000, 740], [1150, 740]];
  const dentro: P2[] = [[1290, 740], [1420, 740], [1420, 560]];
  const halo = (n: number) => (foco === n ? 1 : 0);
  return (
    <g opacity={o}>
      {/* Hepatocito, con su retículo detrás de la llave 3 */}
      <Hepatocito x0={1080} x1={1560} y0={500} y1={960} sem={8} nucleo={false} />
      <Reticulo x={1330} y={860} w={360} n={2} reloj={reloj} />
      <Txt x={1320} y={930} txt="hepatocito" t={22} p={1} color="#FFFFFF" />
      {/* Tuberías: de la sangre al hepatocito, y la conjugada que sale a la bilis */}
      <Tubo pts={salida} reloj={reloj} flujo={capta} sem={2} />
      <Tubo pts={entra} reloj={reloj} flujo={capta} sem={3} />
      <Tubo pts={[[1150, 740], [1230, 740]]} reloj={reloj} flujo={Math.min(capta, conjuga + 0.2)} sem={4} />
      <Tubo pts={dentro} reloj={reloj} flujo={conjuga} tono={B.conjugada} sem={5} />
      <g>
        <path d="M1420,560 C1420,500 1460,470 1520,440" fill="none" stroke={B.bilis[0]} strokeWidth={40} strokeLinecap="round" />
        <path d="M1420,560 C1420,500 1460,470 1520,440" fill="none" stroke={B.bilis[1]} strokeWidth={26} strokeLinecap="round" />
        {Array.from({ length: 3 }, (_, i) => {
          const u = (reloj / 1500 + i / 3) % 1;
          return conjuga > 0.05 ? <Tetrapirrol key={i} x={lerp(1430, 1540, u)} y={lerp(540, 420, u)} k={0.09} colitas={2} tono={B.conjugada} o={tramo(Math.min(u, 1 - u), 0, 0.15) * clamp(conjuga * 2)} /> : null;
        })}
      </g>
      <Txt x={1500} y={390} txt="a la bilis" t={22} p={1} color={TXB.limon} />
      {/* Depósito: la sangre */}
      <Deposito x={520} y={top} w={340} h={h} nivel={nivel} reloj={reloj} marca={0.22} />
      <Txt x={520} y={bot + 40} txt="la sangre" t={24} p={1} />
      {/* Grifo 1 cayendo sobre el depósito */}
      <Grifo x={330} y={300} k={1} abre={produce} reloj={reloj} largo={Math.max(60, yl - 400)} />
      {/* Llaves 2 y 3 */}
      <Llave x={940} y={740} k={0.9} abre={capta} color={['#8A1A5A', '#E0559A']} />
      <Llave x={1260} y={740} k={0.9} abre={conjuga} color={['#4A1FA0', '#9A6AF5']} />
      {/* Medallas con halo en la que manda esta lámina */}
      {[[200, 230], [940, 590], [1260, 590]].map(([mx, my], i) => (
        <g key={i}>
          {halo(i + 1) > 0 && <circle cx={mx} cy={my} r={46 + Math.sin(reloj / 300) * 4} fill={NUM[i]} opacity={0.22} />}
          <Medalla x={mx} y={my} n={i + 1} p={num} />
        </g>
      ))}
    </g>
  );
}

const LaFirma: Lamina = ({ p, reloj }) => {
  const g = p('grifos'), tres = p('tres');
  return (
    <g>
      <Bandera x={800} y={66} txt="la firma: indirecta alta" color="#E0A100" p={p('firma')} t={30} punta="no" />
      <Banera reloj={reloj} produce={0.55} capta={0.6} conjuga={0.6} nivel={lerp(0.22, 0.7, easeOut(p('indirecta')))} o={tramo(tres, 0, 0.4)} num={g} />
      {/* La firma: el suero amarillo y la orina sin bilirrubina */}
      <Sale p={p('indirecta')} x={870} y={260} k={0.78}><TuboSuero suero="#FFB21E" /></Sale>
      <Txt x={870} y={400} txt="indirecta alta" t={24} p={p('indirecta')} color={TXB.ambar} />
      <Sale p={p('orina')} x={1130} y={270} k={0.8}><FrascoOrina color="#F8E27A" /></Sale>
      <Cruz x={1200} y={200} k={0.85} o={p('orina')} />
      <Txt x={1130} y={400} txt="nada en la orina" t={24} p={p('orina')} />
      <Txt x={1430} y={250} txt="tres formas" t={26} p={tres} />
      <Txt x={1430} y={290} txt="de llegar ahí" t={26} p={tres} />
      <Txt x={250} y={870} txt="1 · producir demasiada" t={22} p={tramo(g, 0, 0.5)} color={TXB.hemo} />
      <Txt x={250} y={905} txt="2 · captar poca" t={22} p={tramo(g, 0.25, 0.75)} color={TXB.hepato} />
      <Txt x={250} y={940} txt="3 · conjugar poca" t={22} p={tramo(g, 0.5, 1)} color={TXB.violeta} />
    </g>
  );
};

const Producir: Lamina = ({ p, reloj }) => {
  const h = p('hemolisis'), rh = p('rh');
  return (
    <g>
      <Bandera x={800} y={60} txt="primer grifo: la producción" color="#D7263D" p={p('produccion')} t={28} punta="no" />
      {/* El grifo abierto del todo, sobre su depósito que sube */}
      <g opacity={tramo(p('produccion'), 0, 0.4)}>
        <Grifo x={190} y={190} k={0.75} abre={0.3 + 0.7 * easeOut(h)} reloj={reloj} largo={170} />
        <Deposito x={262} y={340} w={200} h={200} nivel={lerp(0.3, 0.85, easeOut(h))} reloj={reloj} marca={0.22} />
        <Medalla x={110} y={150} n={1} p={p('produccion')} />
      </g>
      {/* Un vaso donde los hematíes se rompen y sueltan su hemo, que se vuelve bilirrubina */}
      <Vaso x={1000} y={330} largo={1300} ancho={250} ang={-8} reloj={reloj} flujo={10} o={tramo(p('produccion'), 0, 0.4)}>
        {Array.from({ length: 5 }, (_, i) => {
          const u = (reloj / 2800 + i / 5) % 1;
          const X = -460 + i * 200, Y = (hash(i, 3) - 0.5) * 120;
          return (
            <g key={i} opacity={h}>
              <Hematie x={X} y={Y} k={0.95} o={1 - tramo(u, 0.35, 0.55)} r={i * 40} />
              <g transform={`translate(${X},${Y})`}><HematieRoto k={0.9} p={tramo(u, 0.35, 0.8)} /></g>
              <Tetrapirrol x={X + 30} y={Y - 30 - 70 * tramo(u, 0.5, 1)} k={0.13} plegada={0.8} tono={B.bilirrubina} o={tramo(u, 0.5, 0.65) * (1 - tramo(u, 0.92, 1))} vibra={reloj} />
            </g>
          );
        })}
        {/* Isoinmune del recién nacido: anticuerpos anti-Rh pegados a los hematíes */}
        {rh > 0.01 && [[-360, 80], [-160, -70], [140, 60], [360, -40]].map(([X, Y], i) => (
          <g key={`r${i}`} opacity={tramo(rh, i * 0.15, 0.5 + i * 0.15)}>
            <Hematie x={X} y={Y} k={0.85} />
            {[0, 120, 240].map((a) => <IgG key={a} x={X + Math.cos((a * Math.PI) / 180) * 44} y={Y + Math.sin((a * Math.PI) / 180) * 44} r={a + 90} k={0.9} />)}
          </g>
        ))}
      </Vaso>
      <Txt x={1060} y={575} txt="hemólisis: también la isoinmune del recién nacido, por Rh" t={24} p={p('rh')} />
      {/* Otras dos fuentes de hemo */}
      <Sale p={p('ineficaz')} x={330} y={720} k={0.42}><Medula /></Sale>
      <Txt x={330} y={830} txt="eritropoyesis ineficaz" t={24} p={p('ineficaz')} />
      <Txt x={330} y={862} txt="precursores que mueren en la médula" t={19} p={p('ineficaz')} fuerte={false} />
      <Sale p={p('hematoma')} x={720} y={720} k={0.5}><Moreton fase={0.2} reloj={reloj} /></Sale>
      <Txt x={720} y={830} txt="hematoma grande" t={24} p={p('hematoma')} />
      {/* El laboratorio lo delata */}
      {[
        { n: 'ldh', txt: 'LDH', sube: true },
        { n: 'haptoglobina', txt: 'haptoglobina', sube: false },
        { n: 'uro', txt: 'urobilinógeno en orina', sube: true },
      ].map((l, i) => (
        <g key={l.n}>
          <Sube x={1080} y={680 + i * 80} sube={l.sube} p={p(l.n)} />
          <Txt x={1130} y={680 + i * 80} txt={l.txt} t={26} p={p(l.n)} ancla="start" />
        </g>
      ))}
      <Bandera x={800} y={950} txt="más hemo roto, más bilirrubina" color="#D7263D" p={p('mas')} t={26} punta="no" />
    </g>
  );
};

/** Corte de la entrada al hígado: sangre arriba, membrana con tres OATP y el hepatocito debajo. */
function Entrada({ reloj, bloqueo, flujo, o = 1 }: { reloj: number; bloqueo: number; flujo: number; o?: number }) {
  if (o <= 0.002) return null;
  const poros = [560, 900, 1240];
  return (
    <g opacity={o}>
      <rect x={380} y={130} width={1240} height={190} fill="#6E1030" />
      <rect x={380} y={130} width={1240} height={60} fill="#4E0820" opacity={0.6} />
      {Array.from({ length: 5 }, (_, i) => {
        const X = 380 + ((hash(i, 21) * 1240 + reloj * 0.05 * (0.3 + 0.7 * flujo)) % 1240);
        return <g key={i}><Albumina x={X} y={240} k={0.42} reloj={reloj} fase={i} /><Tetrapirrol x={X} y={212} k={0.09} plegada={1} tono={B.bilirrubina} /></g>;
      })}
      <Hepatocito x0={380} x1={1620} y0={360} y1={620} nucleo={false} sem={3} />
      <rect x={380} y={330} width={1240} height={22} rx={11} fill="#E9A6C8" />
      {poros.map((px, i) => (
        <g key={px}>
          <Poro x={px} y={340} k={0.9} bombea={reloj + i * 200} tallo={30} roto={i === 1 ? bloqueo : 0} />
          {/* Lo que entra por cada OATP */}
          {Array.from({ length: 2 }, (_, j) => {
            const u = (reloj / 1800 + j / 2 + i * 0.3) % 1;
            const pasa = i === 1 ? 1 - clamp(bloqueo) : 1;
            return <Tetrapirrol key={j} x={px} y={lerp(300, 540, u)} k={0.08} plegada={1} tono={B.bilirrubina} o={pasa * flujo * tramo(Math.min(u, 1 - u), 0, 0.12)} />;
          })}
        </g>
      ))}
    </g>
  );
}

const Captar: Lamina = ({ p, reloj }) => {
  const f = p('farmacos');
  return (
    <g>
      <Bandera x={800} y={60} txt="segundo grifo: la captación" color="#C2307A" p={p('captacion')} t={28} punta="no" />
      <g opacity={tramo(p('captacion'), 0, 0.4)}>
        <Llave x={190} y={260} k={1.1} abre={lerp(1, 0.25, easeOut(p('captacion')))} color={['#8A1A5A', '#E0559A']} />
        <Medalla x={90} y={150} n={2} p={p('captacion')} />
        <Txt x={190} y={380} txt="entra menos" t={24} p={p('captacion')} />
        <Txt x={190} y={414} txt="al hepatocito" t={24} p={p('captacion')} />
      </g>
      <Entrada reloj={reloj} bloqueo={f} flujo={1 - 0.5 * easeOut(p('cardiaca'))} o={tramo(p('captacion'), 0, 0.4)} />
      <Txt x={1000} y={580} txt="OATP: la puerta de entrada" t={22} p={p('captacion')} color="#FFFFFF" />
      {/* 1. Fármacos que tapan el OATP */}
      <Pastilla x={lerp(900, 900, f)} y={lerp(170, 300, easeOut(f))} k={1.1} r={90} color={['#0A7F86', '#16B9BE', '#7FEDE8']} o={tramo(f, 0, 0.2)} />
      <Txt x={300} y={720} txt="fármacos que bloquean OATP" t={23} p={f} />
      <Sale p={f} x={300} y={820} k={0.9}>
        <Pastilla x={-50} r={-30} color={['#0A7F86', '#16B9BE', '#7FEDE8']} />
        <Pastilla x={20} y={20} r={20} color={['#B5245E', '#F25CA8', '#FFC2DE']} />
        <Pastilla x={60} y={-20} r={60} color={['#C77800', '#FFB21E', '#FFE08A']} />
      </Sale>
      {/* 2. Insuficiencia cardíaca: llega menos sangre al hígado */}
      <Sale p={p('cardiaca')} x={800} y={790} k={0.9}>
        <g transform={`scale(${1 + Math.max(0, Math.sin(reloj / 520)) * 0.03})`}><HeartSimple /></g>
      </Sale>
      <Txt x={800} y={920} txt="insuficiencia cardíaca" t={23} p={p('cardiaca')} />
      {/* 3. Cortocircuito portosistémico: la sangre rodea el hígado */}
      <g opacity={tramo(p('cortocircuitos'), 0, 0.4)}>
        <HigadoB x={1300} y={760} k={0.34} />
        <path d="M1110,880 C1110,820 1170,800 1220,800" fill="none" stroke="#2E4AA0" strokeWidth={22} strokeLinecap="round" />
        <path d="M1110,880 C1110,970 1490,970 1490,830 L1490,690" fill="none" stroke="#2E4AA0" strokeWidth={22} strokeLinecap="round" strokeDasharray={`${easeOut(p('cortocircuitos')) * 700} 800`} />
        <path d="M1110,880 C1110,970 1490,970 1490,830 L1490,690" fill="none" stroke="#6A8AF0" strokeWidth={12} strokeLinecap="round" strokeDasharray={`${easeOut(p('cortocircuitos')) * 700} 800`} />
        {Array.from({ length: 4 }, (_, i) => {
          const u = (reloj / 2400 + i / 4) % 1;
          const pts: P2[] = [[1110, 880], [1200, 950], [1400, 950], [1490, 830], [1490, 690]];
          const t = u * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(t)), fr = t - j;
          return <circle key={i} cx={lerp(pts[j][0], pts[j + 1][0], fr)} cy={lerp(pts[j][1], pts[j + 1][1], fr)} r={8} fill={B.bilirrubina[1]} opacity={p('cortocircuitos')} />;
        })}
      </g>
      <Txt x={1300} y={660} txt="cortocircuito portosistémico" t={23} p={p('cortocircuitos')} />
      <Bandera x={800} y={970} txt="una causa poco frecuente" color="#6A4A5E" p={p('poco')} t={22} punta="no" />
    </g>
  );
};

/** Corazón dilatado y cansado (la insuficiencia), con la gota que no alcanza. */
function HeartSimple() {
  const d = 'M0,70 C-40,40 -96,4 -96,-40 C-96,-80 -60,-100 -30,-96 C-12,-94 0,-80 0,-66 C0,-80 12,-94 30,-96 C60,-100 96,-80 96,-40 C96,4 40,40 0,70 Z';
  return (
    <g>
      <path d={d} fill={B.sombra} transform="translate(8,10)" />
      <path d={d} fill="#9E0B2E" />
      <path d={d} fill="#D7263D" transform="translate(-4,-5) scale(0.93)" />
      <path d="M-60,-60 Q-74,-30 -60,-4" fill="none" stroke="#FF8A96" strokeWidth={10} strokeLinecap="round" />
      <path d="M-14,-96 L-14,-130 M14,-96 C14,-120 40,-130 60,-124" fill="none" stroke="#2E4AA0" strokeWidth={16} strokeLinecap="round" />
      <path d="M-30,10 L-12,10 L-4,-12 L8,30 L16,4 L34,4" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </g>
  );
}

/** Doble hélice horizontal con la caja TATA del promotor: `extra` 0-1 mete la repetición TA de más (en rojo). */
function Promotor({ x0, x1, y, p, extra, reloj }: { x0: number; x1: number; y: number; p: number; extra: number; reloj: number }) {
  if (p <= 0.002) return null;
  const L = (x1 - x0) * easeOut(clamp(p));
  const amp = 46, per = 150, fase = reloj / 1400;
  const hebra = (s: number) => Array.from({ length: 61 }, (_, i) => {
    const xx = x0 + (i / 60) * L;
    return `${i ? 'L' : 'M'}${xx.toFixed(1)},${(y + s * amp * Math.sin(((xx - x0) / per) * Math.PI * 2 + fase)).toFixed(1)}`;
  }).join(' ');
  const cajaX0 = x0 + 220, ancho = 64;
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      {/* Peldaños comunes */}
      {Array.from({ length: Math.floor(L / 34) }, (_, i) => {
        const xx = x0 + 10 + i * 34;
        if (xx > cajaX0 - 20 && xx < cajaX0 + ancho * 7.2) return null;
        const yy = amp * Math.sin(((xx - x0) / per) * Math.PI * 2 + fase);
        return <path key={i} d={`M${xx},${y - yy} L${xx},${y + yy}`} stroke={i % 2 ? '#7FE8C6' : '#FF9AD0'} strokeWidth={8} strokeLinecap="round" opacity={0.8} />;
      })}
      <path d={hebra(1)} fill="none" stroke="#5A2DB0" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      <path d={hebra(-1)} fill="none" stroke="#2E78F2" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      {/* La caja TATA: la hélice se abre en una banda y sobre ella van las repeticiones TA */}
      {L > cajaX0 - x0 && <rect x={cajaX0 - 16} y={y - 44} width={Math.min(L - (cajaX0 - x0), ancho * (6 + easeOut(clamp(extra))) + 32)} height={88} rx={30} fill="#3A1A80" opacity={0.92} />}
      {Array.from({ length: 7 }, (_, i) => {
        const nueva = i === 6;
        const q = nueva ? easeOut(clamp(extra)) : 1;
        if (q <= 0.01 || L < (cajaX0 - x0) + i * ancho) return null;
        return (
          <g key={i} transform={`translate(${cajaX0 + i * ancho + ancho / 2},${y}) scale(${q})`}>
            <rect x={-27} y={-30} width={54} height={60} rx={14} fill={nueva ? '#9E0B2E' : '#3A1A80'} transform="translate(3,4)" />
            <rect x={-27} y={-30} width={54} height={60} rx={14} fill={nueva ? '#E3203F' : '#8A5AF0'} />
            <text dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: '#FFF' }}>TA</text>
          </g>
        );
      })}
      {/* El gen, al final */}
      <rect x={x0 + L - 170} y={y - 34} width={170} height={68} rx={20} fill="#18A34A" opacity={tramo(p, 0.6, 1)} />
      <text x={x0 + L - 85} y={y} dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: '#FFF' }} opacity={tramo(p, 0.6, 1)}>UGT1A1</text>
    </g>
  );
}

const Gilbert: Lamina = ({ p, reloj }) => {
  const pob = p('poblacion'), tercio = p('tercio');
  return (
    <g>
      <Bandera x={800} y={60} txt="tercer grifo: síndrome de Gilbert, el más común" color="#8A4FE0" p={p('gilbert')} t={28} punta="no" />
      {/* Veinte personas: una o dos lo tienen */}
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 5, f = Math.floor(i / 5);
        const marcada = i === 7 || i === 16;
        return <Figurita key={i} x={130 + c * 100 + (f % 2) * 30} y={200 + f * 105 + Math.sin(reloj / 700 + i) * 2} k={0.8} ropa={i} marca={marcada ? tramo(pob, 0.4, 1) : 0} o={tramo(pob, i * 0.025, 0.3 + i * 0.025)} />;
      })}
      <Txt x={340} y={640} txt="entre el 5 y el 10 %" t={26} p={pob} color={TXB.violeta} />
      <Txt x={340} y={676} txt="de la población" t={22} p={pob} fuerte={false} />
      {/* El promotor del gen */}
      <Txt x={1100} y={150} txt="variante UGT1A1*28" t={28} p={p('variante')} color={TXB.violeta} />
      <Promotor x0={680} x1={1560} y={280} p={p('tata')} extra={p('ta')} reloj={reloj} />
      <Txt x={1000} y={370} txt="caja TATA del promotor" t={22} p={p('tata')} fuerte={false} />
      <Txt x={1300} y={370} txt="una repetición TA de más" t={24} p={p('ta')} color={TXB.hemo} />
      {/* Menos máquinas encendidas, y la llave 3 a un tercio */}
      {[0, 1, 2].map((i) => <Maquina key={i} x={760 + i * 230} y={560} k={0.8} golpe={reloj + i * 260} encendida={i === 0 ? 1 : 1 - tramo(tercio, 0.1 + i * 0.25, 0.4 + i * 0.25)} o={tramo(p('ta'), 0, 0.5)} />)}
      <Llave x={1450} y={580} k={0.85} abre={lerp(1, 0.33, easeOut(tercio))} color={['#4A1FA0', '#9A6AF5']} o={tramo(p('variante'), 0, 0.4)} />
      <Medalla x={1450} y={440} n={3} p={p('variante')} />
      <g opacity={tramo(tercio, 0, 0.4)}>
        <rect x={680} y={760} width={880} height={50} rx={25} fill="var(--vas-suave)" />
        <rect x={680} y={760} width={880 * lerp(1, 0.33, easeOut(tercio))} height={50} rx={25} fill={B.re[1]} />
        <rect x={696} y={768} width={880 * lerp(1, 0.33, easeOut(tercio)) - 32} height={12} rx={6} fill="#FFFFFF" opacity={0.35} />
      </g>
      <Txt x={1120} y={860} txt="queda alrededor de un tercio de la actividad" t={26} p={tercio} />
    </g>
  );
};

/** Ojo de cerca, con la esclera que se tiñe de amarillo. */
function OjoCerca({ amarillo }: { amarillo: number }) {
  return (
    <g>
      <rect x={-200} y={-200} width={400} height={400} fill="#E9A58A" />
      <path d="M-170,10 Q0,-150 170,10 Q0,150 -170,10 Z" fill="#C9806A" />
      <path d="M-150,10 Q0,-124 150,10 Q0,124 -150,10 Z" fill={mezcla('#FFFAF5', '#F7D23A', clamp(amarillo))} />
      <path d="M-120,-10 Q-60,-40 -20,-46" fill="none" stroke="#E07A6A" strokeWidth={3} opacity={0.6} />
      <circle cy={10} r={58} fill="#4A8A3A" /><circle cy={10} r={42} fill="#2E6A2A" /><circle cy={10} r={26} fill="#120A20" />
      <circle cx={-18} cy={-10} r={12} fill="#FFF" />
      <path d="M-170,6 Q0,-160 170,6" fill="none" stroke="#5A2A1A" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
}

/** Desencadenantes del Gilbert: plato vacío (ayuno), termómetro (infección), nube con rayo (estrés). */
function Plato() {
  return (
    <g>
      <ellipse cx={4} cy={10} rx={82} ry={26} fill={B.sombra} />
      <ellipse rx={80} ry={26} fill="#C9D4E6" /><ellipse cy={-3} rx={58} ry={17} fill="#F2F6FC" />
      <rect x={-118} y={-50} width={10} height={70} rx={5} fill="#9AA8BC" /><path d="M-124,-50 L-124,-24 M-113,-50 L-113,-24 M-102,-50 L-102,-24" stroke="#9AA8BC" strokeWidth={5} strokeLinecap="round" />
      <path d="M108,-50 C124,-40 124,-10 112,0 L112,20" fill="none" stroke="#9AA8BC" strokeWidth={10} strokeLinecap="round" />
    </g>
  );
}
function Nube({ reloj }: { reloj: number }) {
  const rayo = (reloj % 1600) < 200;
  return (
    <g>
      <path d="M-70,20 C-100,20 -100,-24 -66,-26 C-62,-64 -10,-70 6,-40 C24,-62 70,-50 66,-16 C96,-14 96,20 66,20 Z" fill="#5A4A7A" transform="translate(5,6)" opacity={0.4} />
      <path d="M-70,20 C-100,20 -100,-24 -66,-26 C-62,-64 -10,-70 6,-40 C24,-62 70,-50 66,-16 C96,-14 96,20 66,20 Z" fill="#7A6AA8" />
      <path d="M-60,-6 C-56,-34 -24,-44 -6,-30" fill="none" stroke="#B8AEE0" strokeWidth={8} strokeLinecap="round" />
      <path d="M-4,22 L-22,62 L0,58 L-14,96 L24,44 L2,48 L14,22 Z" fill={rayo ? '#FFF3A0' : '#FFD23F'} />
    </g>
  );
}

const GilbertNota: Lamina = ({ p, reloj }) => {
  const nota = p('nota'), iri = p('irinotecan');
  return (
    <g>
      <Bandera x={800} y={60} txt="¿cómo se nota el Gilbert? casi no se nota" color="#8A4FE0" p={nota} t={28} punta="no" />
      <Sale p={nota} x={250} y={330} k={1.05}><Rostro quien="adulto" reloj={reloj} piel={['#B8705A', '#E8A07E']} pelo="#3A1A10" ropa={['#4A1FA0', '#8A5AF0']} /></Sale>
      {/* Zoom al ojo: la esclera apenas amarilla */}
      <Lente x={540} y={250} R={110} id="gilbert-ojo" o={tramo(nota, 0.3, 0.8)}>
        <g transform="scale(0.62)"><OjoCerca amarillo={0.35 + Math.sin(reloj / 1300) * 0.06} /></g>
      </Lente>
      <path d="M300,300 L440,282" stroke="var(--cit-flecha)" strokeWidth={3} strokeDasharray="6 6" opacity={tramo(nota, 0.3, 0.8)} />
      <Txt x={540} y={400} txt="ictericia leve" t={26} p={nota} color={TXB.ambar} />
      {/* Lo que la despierta */}
      {[
        { x: 880, n: <Plato />, txt: 'ayuno', q: tramo(p('ayuno'), 0, 0.4) },
        { x: 1130, n: <g transform="scale(0.36)"><Termometro val={0.85} /></g>, txt: 'infección', q: tramo(p('ayuno'), 0.3, 0.7) },
        { x: 1380, n: <Nube reloj={reloj} />, txt: 'estrés', q: tramo(p('ayuno'), 0.6, 1) },
      ].map((d, i) => (
        <g key={i}>
          <Sale p={d.q} x={d.x} y={230 + Math.sin(reloj / 900 + i) * 5}>{d.n as ReactNode}</Sale>
          <Txt x={d.x} y={350} txt={d.txt} t={24} p={d.q} />
        </g>
      ))}
      {/* Transaminasas normales */}
      <Sale p={p('transaminasas')} x={880} y={540} k={0.62}><TuboSuero suero="#F6E07A" tapa="#8A5AF0" /></Sale>
      <Visto x={940} y={480} k={0.9} o={p('transaminasas')} />
      <Txt x={980} y={560} txt="transaminasas normales" t={24} p={p('transaminasas')} ancla="start" />
      <Bandera x={1200} y={680} txt="el Gilbert no se trata" color="#18A34A" p={p('notrata')} t={30} punta="no" />
      {/* Irinotecán: su SN-38 también pasa por la UGT1A1, que va a un tercio */}
      <g opacity={tramo(iri, 0, 0.4)}>
        <path d="M150,760 L150,960" stroke="#9AA8BC" strokeWidth={6} />
        <rect x={100} y={760} width={100} height={130} rx={24} fill="#B5245E" />
        <rect x={100} y={760} width={92} height={120} rx={22} fill="#F25CA8" />
        <rect x={116} y={790} width={60} height={34} rx={6} fill="#FFFFFF" opacity={0.85} />
        <rect x={140} y={890} width={20} height={30} rx={6} fill="#9AA8BC" />
        <Flecha a={[230, 850]} b={[480, 850]} p={iri} color="var(--cit-flecha)" w={6} />
        {Array.from({ length: 3 }, (_, i) => {
          const u = (reloj / 1800 + i / 3) % 1;
          return <g key={i} transform={`translate(${lerp(260, 470, u)},${820 + Math.sin(u * 8) * 6})`} opacity={tramo(Math.min(u, 1 - u), 0, 0.15)}><circle r={12} fill="#9E0B2E" /><circle cx={-2} cy={-2} r={9} fill="#F0476A" /></g>;
        })}
        <Maquina x={600} y={860} k={0.75} golpe={reloj} encendida={0.6} />
        <Txt x={720} y={850} txt="ojo con el irinotecán: su SN-38 también depende de la UGT1A1" t={23} p={iri} ancla="start" color={TXB.rosa} />
      </g>
    </g>
  );
};

/** Retículo con los huecos donde irían las máquinas. `encendidas`: lista 0-1 por hueco (−1 = no hay máquina). */
function Taller({ x, y, reloj, maquinas, o = 1 }: { x: number; y: number; reloj: number; maquinas: number[]; o?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <Hepatocito x0={x - 330} x1={x + 330} y0={y - 230} y1={y + 230} nucleo={false} sem={6} />
      <Reticulo x={x} y={y + 120} w={560} n={3} reloj={reloj} />
      {maquinas.map((m, i) => {
        const mx = x - 210 + (i % 2) * 260 + (Math.floor(i / 2) % 2) * 120, my = y - 110 + Math.floor(i / 2) * 150;
        return m < 0
          ? <rect key={i} x={mx - 90} y={my - 70} width={180} height={140} rx={30} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeDasharray="14 12" opacity={0.6} />
          : <Maquina key={i} x={mx} y={my} k={0.75} golpe={reloj + i * 200} encendida={m} />;
      })}
    </g>
  );
}

const CN1: Lamina = ({ p, reloj }) => {
  const feno = p('feno');
  const u = (reloj / 1600) % 1;
  return (
    <g>
      <Bandera x={800} y={60} txt="Crigler-Najjar tipo I" color="#D7263D" p={p('cn1')} t={32} punta="no" />
      <Taller x={400} y={430} reloj={reloj} maquinas={[-1, -1, -1, -1]} o={tramo(p('ninguna'), 0, 0.4)} />
      <Llave x={400} y={760} k={0.9} abre={0} roto={tramo(p('ninguna'), 0.4, 1)} color={['#4A1FA0', '#9A6AF5']} o={tramo(p('ninguna'), 0, 0.4)} />
      <Txt x={400} y={880} txt="ninguna UGT1A1: ninguna máquina" t={26} p={p('ninguna')} />
      {/* El fenobarbital rebota: no hay enzima que despertar */}
      {feno > 0.01 && <Pastilla x={lerp(740, 560, tramo(u, 0, 0.5)) + tramo(u, 0.5, 1) * 120} y={lerp(160, 260, Math.sin(Math.min(1, u * 2) * Math.PI / 2)) - tramo(u, 0.5, 1) * 100} r={u * 360} k={1.1} color={['#0A7F86', '#16B9BE', '#7FEDE8']} o={tramo(feno, 0, 0.3)} />}
      <Cruz x={720} y={250} k={0.9} o={feno} />
      <Txt x={800} y={330} txt="el fenobarbital no sirve" t={24} p={feno} ancla="start" />
      {/* El recién nacido, muy amarillo desde el nacimiento */}
      <Sale p={p('intensa')} x={1180} y={470} k={0.6}><Incubadora x={0} y={0}><Bebe x={-20} y={-56} k={0.78} amarillo={0.95} reloj={reloj} /></Incubadora></Sale>
      <Txt x={1180} y={680} txt="ictericia intensa desde el nacimiento" t={24} p={p('intensa')} color={TXB.ambar} />
      <Sale p={p('kern')} x={1180} y={860} k={0.26}><CerebroMini reloj={reloj} /></Sale>
      <Txt x={1290} y={860} txt="riesgo de kernícterus" t={24} p={p('kern')} color={TXB.hemo} ancla="start" />
    </g>
  );
};

/** Cerebro de lado con los núcleos amarillos (para el aviso de kernícterus). */
function CerebroMini({ reloj }: { reloj: number }) {
  const d = 'M-260,40 C-300,-80 -200,-200 -40,-210 C120,-220 260,-150 280,-30 C296,60 230,120 140,120 C80,170 -20,160 -60,120 C-150,140 -240,120 -260,40 Z';
  return (
    <g>
      <path d={d} fill={B.sombra} transform="translate(12,16)" />
      <path d={d} fill="#B8457A" />
      <path d={d} fill="#E886B0" transform="translate(-6,-8) scale(0.96)" />
      {['M-200,-90 C-150,-120 -100,-110 -60,-140', 'M-40,-180 C-20,-120 20,-100 80,-120', 'M120,-160 C110,-100 160,-60 220,-70', 'M-220,10 C-160,-10 -100,20 -40,0'].map((s, i) => <path key={i} d={s} fill="none" stroke="#B8457A" strokeWidth={12} strokeLinecap="round" />)}
      <path d="M40,120 C60,180 70,220 60,260" fill="none" stroke="#B04A7A" strokeWidth={50} strokeLinecap="round" />
      <ellipse cx={170} cy={150} rx={90} ry={60} fill="#C8578A" />
      {[[-20, 20, 50], [60, 60, 34], [170, 150, 40]].map(([cx, cy, r], i) => <g key={i}><circle cx={cx} cy={cy} r={r * (1 + Math.sin(reloj / 500 + i) * 0.08)} fill={B.bilirrubina[0]} /><circle cx={cx - 4} cy={cy - 4} r={r * 0.75} fill={B.bilirrubina[1]} /></g>)}
    </g>
  );
}

const CN2: Lamina = ({ p, reloj }) => {
  const resp = p('responde');
  const enc = (i: number) => (i === 0 ? 1 : i === 1 ? lerp(0, 1, tramo(resp, 0.2, 0.5)) : tramo(resp, 0.5, 0.9));
  return (
    <g>
      <Bandera x={800} y={60} txt="Crigler-Najjar tipo II" color="#C77800" p={p('algunas')} t={32} punta="no" />
      <Taller x={400} y={430} reloj={reloj} maquinas={[enc(0), enc(1), enc(2), -1]} o={tramo(p('algunas'), 0, 0.4)} />
      <Txt x={400} y={720} txt="algo de UGT1A1" t={26} p={p('tipo2')} />
      {/* El fenobarbital entra al núcleo y enciende más máquinas */}
      <g opacity={tramo(resp, 0, 0.3)}>
        <Pastilla x={lerp(980, 820, easeOut(tramo(resp, 0, 0.4)))} y={lerp(200, 300, easeOut(tramo(resp, 0, 0.4)))} r={-25} k={1.2} color={['#0A7F86', '#16B9BE', '#7FEDE8']} />
        <Flecha a={[800, 330]} b={[620, 390]} p={tramo(resp, 0.2, 0.6)} color="var(--cit-flecha)" w={6} />
      </g>
      <Visto x={1000} y={200} k={1} o={tramo(resp, 0.6, 1)} />
      <Txt x={1040} y={290} txt="responde al fenobarbital" t={30} p={resp} color={TXB.bacteria} ancla="start" />
      <Txt x={1040} y={330} txt="despierta más máquinas" t={22} p={resp} fuerte={false} ancla="start" />
      {/* La bilirrubina baja */}
      <g opacity={tramo(p('menor'), 0, 0.4)}>
        <Deposito x={1240} y={430} w={240} h={300} nivel={lerp(0.62, 0.32, easeOut(resp))} reloj={reloj} marca={0.2} />
        <Llave x={1440} y={680} k={0.75} abre={lerp(0.25, 0.75, easeOut(resp))} color={['#4A1FA0', '#9A6AF5']} />
      </g>
      <Txt x={1240} y={780} txt="bilirrubina menor" t={24} p={p('menor')} />
      <Bandera x={800} y={900} txt="la llave que separa el tipo II del I" color="#C2185B" p={p('llave')} t={26} punta="no" />
    </g>
  );
};

/** Los cuatro motivos del recién nacido, cada uno con su dibujo. */
function Razon({ i, q, reloj }: { i: number; q: number; reloj: number }) {
  if (q <= 0.002) return null;
  if (i === 0) return <g>{[[-50, -10], [10, 20], [50, -20]].map(([cx, cy], j) => <Hematie key={j} x={cx} y={cy} k={0.55} r={j * 50} />)}<g transform="translate(-10,-50)"><HematieRoto k={0.5} p={(reloj / 2000) % 1} /></g></g>;
  if (i === 1) return <g transform="scale(0.55)"><Maquina x={0} y={0} golpe={reloj} encendida={0.3} /></g>;
  if (i === 2) {
    return (
      <g>
        <path d="M-70,-20 C-70,40 70,40 70,-20" fill="none" stroke="#B5245E" strokeWidth={44} strokeLinecap="round" />
        <path d="M-70,-20 C-70,40 70,40 70,-20" fill="none" stroke="#F27BA0" strokeWidth={30} strokeLinecap="round" />
        <path d="M-70,-20 C-70,40 70,40 70,-20" fill="none" stroke="#FFE8F0" strokeWidth={10} strokeLinecap="round" />
        <Cruz x={0} y={-36} k={0.7} />
      </g>
    );
  }
  const u = (reloj / 2400) % 1;
  return (
    <g>
      <circle r={52} fill="none" stroke="#2E78F2" strokeWidth={14} strokeDasharray="250 80" transform={`rotate(${u * 360})`} />
      <circle cx={Math.cos(u * Math.PI * 2) * 52} cy={Math.sin(u * Math.PI * 2) * 52} r={12} fill={B.bilirrubina[1]} />
    </g>
  );
}

const Fisiologica: Lamina = ({ p, reloj }) => {
  const razones = [
    { n: 'hematies', txt: 'más hematíes, que viven menos' },
    { n: 'ugt', txt: 'UGT1A1 inmadura' },
    { n: 'flora', txt: 'intestino sin flora ni BilR' },
    { n: 'entero', txt: 'más circulación enterohepática' },
  ];
  const X = (d: number) => 900 + d * 66, Y = (v: number) => 840 - v * 360;
  const curva = Array.from({ length: 61 }, (_, i) => {
    const d = i / 6, v = d < 1 ? 0.15 * d : 0.15 + 0.85 * Math.exp(-((d - 4) ** 2) / 3.2);
    return `${i ? 'L' : 'M'}${X(d).toFixed(1)},${Y(v).toFixed(1)}`;
  }).join(' ');
  // El bebé se pone amarillo siguiendo la curva.
  const dia = 10 * easeOut(p('despues'));
  const am = dia < 1 ? 0.1 : 0.1 + 0.6 * Math.exp(-((dia - 4) ** 2) / 3.2);
  return (
    <g>
      <Bandera x={800} y={60} txt="la ictericia fisiológica del recién nacido" color="#E0A100" p={p('razones')} t={28} punta="no" />
      <g opacity={tramo(p('razones'), 0, 0.4)}>
        <rect x={60} y={300} width={560} height={40} rx={20} fill="#C9B8F0" />
        <rect x={60} y={292} width={556} height={32} rx={16} fill="#EDE6FF" />
        <Bebe x={340} y={250} k={0.62} amarillo={am} reloj={reloj} />
      </g>
      {razones.map((r, i) => (
        <g key={r.n}>
          <Sale p={p(r.n)} x={130 + i * 160} y={500 + (i % 2) * 40}><Razon i={i} q={p(r.n)} reloj={reloj} /></Sale>
          <Medalla x={70 + i * 160} y={430 + (i % 2) * 40} n={i + 1} p={p(r.n)} />
        </g>
      ))}
      {razones.map((r, i) => <Txt key={`t${r.n}`} x={80} y={680 + i * 46} txt={`${i + 1} · ${r.txt}`} t={24} p={p(r.n)} ancla="start" />)}
      <g opacity={tramo(p('despues'), 0, 0.4)}>
        <rect x={X(0)} y={Y(1.05)} width={X(1) - X(0)} height={Y(0) - Y(1.05)} fill="#E3203F" opacity={0.12 + 0.18 * p('antes')} />
        <path d={`M${X(0)},${Y(0)} L${X(10)},${Y(0)} M${X(0)},${Y(0)} L${X(0)},${Y(1.1)}`} stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" />
        {[0, 1, 3, 5, 7, 10].map((d) => <text key={d} x={X(d)} y={Y(0) + 40} textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: 'var(--cit-texto-2)' }}>{d === 0 ? 'nace' : `día ${d}`}</text>)}
        <rect x={X(3)} y={Y(1.05)} width={X(5) - X(3)} height={Y(0) - Y(1.05)} fill={B.bilirrubina[1]} opacity={0.16 * p('pico')} />
        <path d={curva} fill="none" stroke={B.bilirrubina[0]} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${easeOut(p('despues')) * 1600} 1800`} />
        <path d={curva} fill="none" stroke={B.bilirrubina[1]} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${easeOut(p('despues')) * 1600} 1800`} />
        <circle cx={X(dia)} cy={Y(dia < 1 ? 0.15 * dia : 0.15 + 0.85 * Math.exp(-((dia - 4) ** 2) / 3.2))} r={14} fill={B.bilirrubina[0]} />
      </g>
      <Txt x={X(4)} y={Y(1) - 40} txt="pico: día 3 a 5" t={26} p={p('pico')} color={TXB.ambar} />
      <Txt x={X(0.5)} y={Y(1.05) - 24} txt="24 h" t={22} p={p('antes')} color={TXB.hemo} />
      <Bandera x={1230} y={940} txt="antes de las 24 h, nunca es fisiológica" color="#D7263D" p={p('antes')} t={24} punta="no" />
    </g>
  );
};

/** Gota de leche (blanca, con su brillo). */
function GotaLeche({ k = 1, llena = 1 }: { k?: number; llena?: number }) {
  const d = 'M0,-80 C26,-40 54,-8 54,26 C54,58 30,80 0,80 C-30,80 -54,58 -54,26 C-54,-8 -26,-40 0,-80 Z';
  return (
    <g transform={`scale(${k})`}>
      <path d={d} fill={B.sombra} transform="translate(8,10)" />
      <path d={d} fill="#D8D2E8" />
      <path d={d} fill="#FFFFFF" transform={`translate(-3,-4) scale(0.92)`} opacity={0.4 + 0.6 * llena} />
      <path d="M-28,10 Q-28,-10 -14,-28" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" />
    </g>
  );
}

/** Hoja de calendario con los días marcados. */
function Calendario({ desde, hasta, rotulo, color }: { desde: number; hasta: number; rotulo: string; color: string }) {
  return (
    <g>
      <rect x={-110} y={-90} width={220} height={190} rx={20} fill={B.sombra} transform="translate(8,9)" />
      <rect x={-110} y={-90} width={220} height={190} rx={20} fill="#FFF7E6" />
      <rect x={-110} y={-90} width={220} height={48} rx={20} fill={color} />
      <rect x={-110} y={-60} width={220} height={18} fill={color} />
      {[-60, 60].map((cx) => <rect key={cx} x={cx - 7} y={-104} width={14} height={32} rx={7} fill="#5A6478" />)}
      {Array.from({ length: 21 }, (_, i) => {
        const on = i + 1 >= desde && i + 1 <= hasta;
        return <circle key={i} cx={-84 + (i % 7) * 28} cy={-14 + Math.floor(i / 7) * 34} r={11} fill={on ? color : '#E6DCC8'} />;
      })}
      <text x={0} y={-66} dy="0.35em" textAnchor="middle" style={{ fontSize: 20, fontWeight: 800, fill: '#FFF' }}>{rotulo}</text>
    </g>
  );
}

const Lactancia: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={60} txt="¿la lactancia puede dar ictericia?" color="#E0A100" p={p('lactancia')} t={30} punta="no" />
    {/* 1. Lactancia insuficiente: entra poca leche los primeros días */}
    <Sale p={p('insuficiente')} x={260} y={330}><GotaLeche k={0.6} llena={0.2} /></Sale>
    {[0, 1].map((i) => {
      const u = (reloj / 1600 + i / 2) % 1;
      return <circle key={i} cx={260} cy={410 + u * 60} r={6} fill="#FFFFFF" opacity={p('insuficiente') * (1 - u)} />;
    })}
    <Sale p={p('insuficiente')} x={530} y={330} k={0.85}><Calendario desde={1} hasta={5} rotulo="días 1 a 5" color="#C77800" /></Sale>
    <Sale p={p('insuficiente')} x={400} y={590} k={0.55}><Bebe amarillo={0.55} reloj={reloj} llora={0.6 + 0.4 * Math.sin(reloj / 900)} /></Sale>
    <Txt x={400} y={740} txt="por lactancia insuficiente" t={28} p={p('insuficiente')} />
    <Txt x={400} y={780} txt="primeros días: poca ingesta" t={24} p={p('insuficiente')} fuerte={false} />
    {/* 2. Leche materna: más tardía y benigna */}
    <Sale p={p('materna')} x={1060} y={330}><GotaLeche k={1} /></Sale>
    <Sale p={p('materna')} x={1340} y={330} k={0.85}><Calendario desde={8} hasta={21} rotulo="semanas 2 a 3" color="#2E9E6A" /></Sale>
    <Sale p={p('materna')} x={1200} y={590} k={0.55}><Bebe amarillo={0.35} reloj={reloj + 800} /></Sale>
    <Txt x={1200} y={740} txt="por leche materna" t={28} p={p('materna')} />
    <Txt x={1200} y={780} txt="más tardía" t={24} p={p('materna')} fuerte={false} />
    <Visto x={1060} y={240} k={0.9} o={p('benigna')} />
    <Txt x={1100} y={240} txt="benigna" t={24} p={p('benigna')} color={TXB.verde} ancla="start" />
    <path d="M800,200 L800,800" stroke="var(--cit-texto-2)" strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" opacity={0.5 * tramo(p('materna'), 0, 0.5)} />
    <Bandera x={800} y={900} txt="dos nombres parecidos, dos causas diferentes" color="#C2307A" p={p('diferentes')} t={26} punta="no" />
  </g>
);


const LAMINAS: Lamina[] = [LaFirma, Producir, Captar, Gilbert, GilbertNota, CN1, CN2, Fisiologica, Lactancia];
export default LAMINAS;
