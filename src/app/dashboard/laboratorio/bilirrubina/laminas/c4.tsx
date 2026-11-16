'use client';
// Capítulo 4 · La conjugación

import type { Lamina } from '../Lienzo';
import { B, Bandera, Maquina, Cerebro, Chip, Cruz, Flecha, Flota, Glucuronido, Gota, Hepatocito, Intestino, Pastilla, Reticulo, Rinon, Sale, Tetrapirrol, TuboOrina, Txt, TXB, Visto, clamp, easeOut, lerp, tramo } from '../Piezas';

const Fabrica: Lamina = ({ p, reloj }) => {
  const cinta = p('cinta');
  return (
    <g>
      <Hepatocito x0={40} x1={1560} y0={80} y1={960} nucleo={false} />
      <Bandera x={800} y={150} txt="la fábrica" color="#8A4FE0" p={p('fabrica')} t={32} punta="no" />
      <Reticulo x={800} y={560} w={1300} n={3} reloj={reloj} o={tramo(p('reticulo'), 0, 0.4)} />
      <Txt x={800} y={700} txt="retículo endoplasmático: una cinta de montaje" t={28} p={p('reticulo')} color="#FFFFFF" />
      {cinta > 0.05 && [0, 1, 2, 3].map((i) => {
        const u = (reloj / 6000 + i / 4) % 1;
        return <Tetrapirrol key={i} x={lerp(160, 1440, u)} y={520 + Math.sin(u * 10) * 6} k={0.2} plegada={1} tono={B.bilirrubina} o={tramo(Math.min(u, 1 - u), 0, 0.06) * cinta} />;
      })}
      <Maquina x={800} y={390} k={1.1} golpe={reloj} o={tramo(p('ugt'), 0, 0.4)} />
      <Chip x={800} y={250} txt="UGT1A1" color="#5A2DB0" p={p('ugt')} t={30} />
      <Sale p={p('udp')} x={1250} y={330}>{[0, 1, 2].map((i) => <Glucuronido key={i} x={i * 46 - 46} y={Math.sin(reloj / 500 + i) * 8} k={1.2} />)}</Sale>
      <Txt x={1250} y={420} txt="ácido UDP-glucurónico" t={24} p={p('udp')} color="#FFFFFF" />
    </g>
  );
};

const Colitas: Lamina = ({ p, reloj }) => {
  const col = tramo(p('mono'), 0, 1) + tramo(p('di'), 0, 1);
  return (
    <g>
      <Maquina x={500} y={420} k={1.3} golpe={reloj} o={tramo(p('maquina'), 0, 0.3)} />
      <Sale p={p('maquina')} x={1050} y={380} k={1.2}><Tetrapirrol abre={1} plegada={1 - 0.4 * clamp(col / 2)} colitas={col} tono={col > 0.5 ? B.conjugada : B.bilirrubina} vibra={reloj} /></Sale>
      <Flecha a={[640, 330]} b={[930, 520]} c={[800, 340]} p={p('una')} color={B.glucuronido[1]} w={8} />
      <Txt x={1050} y={780} txt="monoglucurónido" t={30} p={p('mono')} color={TXB.rosa} />
      <Txt x={1050} y={835} txt="diglucurónido" t={34} p={p('di')} color={TXB.limon} />
      <Bandera x={1050} y={920} txt="la forma principal en la bilis" color="#9C8A00" p={p('principal')} t={24} punta="no" />
      <Txt x={500} y={680} txt="una colita, y luego dos" t={28} p={p('dos')} />
    </g>
  );
};

const SeAbre: Lamina = ({ p, reloj }) => {
  const abre = easeOut(p('abre'));
  return (
    <g>
      <Bandera x={800} y={90} txt="¿qué cambia? todo" color="#8A4FE0" p={p('cambia')} t={30} punta="no" />
      <Sale p={p('cambia')} x={800} y={440} k={1.6}><Tetrapirrol abre={1} plegada={1 - abre} colitas={2} tono={B.conjugada} vibra={reloj} /></Sale>
      <Txt x={800} y={250} txt="se rompen los puentes internos" t={28} p={p('rompen')} />
      <Txt x={800} y={700} txt="el libro se abre: hidrosoluble" t={32} p={p('hidro')} color={TXB.limon} />
      {[0, 1, 2].map((i) => {
        const u = (reloj / 2400 + i / 3) % 1;
        return <Gota key={i} x={560 + i * 240} y={lerp(180, 330, u)} k={0.22} tono={['#1E7FD0', '#3FB4E0', '#BFE9FF']} o={p('hidro') * (1 - u)} />;
      })}
      <Cruz x={560} y={860} k={0.9} o={p('pierde')} />
      <Txt x={620} y={860} txt="ya no cruza membranas por sí sola" t={26} p={p('pierde')} ancla="start" />
    </g>
  );
};

const Consecuencias: Lamina = ({ p, reloj }) => {
  const items = [
    { n: 'c1', x: 230, txt: 'viaja en la bilis sin albúmina', ok: true },
    { n: 'c2', x: 610, txt: 'no se reabsorbe en el intestino', ok: false },
    { n: 'c3', x: 990, txt: 'si vuelve a la sangre, se filtra', ok: true },
    { n: 'c4', x: 1370, txt: 'no cruza la barrera hematoencefálica', ok: false },
  ];
  return (
    <g>
      <Bandera x={800} y={90} txt="cuatro consecuencias" color="#8A4FE0" p={p('cuatro')} t={30} punta="no" />
      <Flota x={230} y={380} rl={reloj} k={0.95} o={tramo(p('c1'), 0, 0.4)}><Gota tono={B.bilis} /></Flota>
      <Flota x={610} y={380} rl={reloj} fase={1} k={0.6} o={tramo(p('c2'), 0, 0.4)}><Intestino /></Flota>
      <Flota x={990} y={380} rl={reloj} fase={2} k={0.4} o={tramo(p('c3'), 0, 0.4)}><Rinon /></Flota>
      <Flota x={1370} y={380} rl={reloj} fase={3} k={0.6} o={tramo(p('c4'), 0, 0.4)}><Cerebro /></Flota>
      {items.map((it, i) => (
        <g key={it.n}>
          <Txt x={it.x} y={560} txt={`${i + 1}`} t={44} p={p(it.n)} color={TXB.violeta} />
          {it.ok ? <Visto x={it.x + 100} y={300} k={0.9} o={p(it.n)} /> : <Cruz x={it.x + 100} y={300} k={0.9} o={p(it.n)} />}
          <Txt x={it.x} y={620} txt={it.txt} t={20} p={p(it.n)} />
        </g>
      ))}
      <Sale p={p('coluria')} x={990} y={800} k={0.45}><TuboOrina oscuro={0.7} /></Sale>
      <Txt x={1150} y={800} txt="coluria" t={30} p={p('coluria')} color={TXB.marron} ancla="start" />
    </g>
  );
};

const UnaSola: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={90} txt="¿cuántas enzimas? solo una" color="#8A4FE0" p={p('una')} t={30} punta="no" />
    <Maquina x={800} y={360} k={1.5} golpe={reloj} o={tramo(p('una'), 0, 0.4)} />
    <Txt x={800} y={540} txt="la UGT1A1 hace casi todo el trabajo" t={28} p={p('trabajo')} color={TXB.violeta} />
    <Sale p={p('farmacos')} x={420} y={760}><Pastilla r={-30} /></Sale>
    <Txt x={420} y={880} txt="también conjuga fármacos" t={26} p={p('farmacos')} />
    <Sale p={p('sn38')} x={1080} y={740} k={1.2}><Pastilla color={['#B5245E', '#F25CA8', '#FFC2DE']} r={20} /></Sale>
    <Chip x={1080} y={840} txt="SN-38, del irinotecán" color="#B5245E" p={p('irinotecan')} t={24} />
    <Txt x={1080} y={900} txt="un fármaco contra el cáncer" t={22} p={p('irinotecan')} fuerte={false} />
    <Bandera x={1380} y={600} txt="anota este nombre" color="#C2185B" p={p('anota')} t={22} punta="abajo" />
  </g>
);

const Acelerar: Lamina = ({ p, reloj }) => {
  const mas = p('mas');
  return (
    <g>
      <Bandera x={800} y={90} txt="¿y si trabajara más rápido?" color="#8A4FE0" p={p('rapido')} t={30} punta="no" />
      <Sale p={p('fenobarbital')} x={250} y={420} k={1.3}><Pastilla color={['#0A7F86', '#16B9BE', '#7FEDE8']} r={-25} /></Sale>
      <Txt x={250} y={540} txt="fenobarbital" t={30} p={p('fenobarbital')} color={TXB.bacteria} />
      <Flecha a={[360, 420]} b={[560, 420]} p={p('car')} color="var(--cit-flecha)" w={8} />
      <Sale p={p('car')} x={660} y={420}><circle r={80} fill="#5A2DB0" /><circle r={68} cx={-4} cy={-4} fill="#8A5AF0" /><text dy="0.35em" textAnchor="middle" style={{ fontSize: 34, fontWeight: 800, fill: '#FFF' }}>CAR</text></Sale>
      <Txt x={660} y={540} txt="receptor nuclear" t={24} p={p('car')} fuerte={false} />
      {[0, 1, 2, 3].map((i) => <Maquina key={i} x={1000 + (i % 2) * 260} y={330 + Math.floor(i / 2) * 200} k={0.7} golpe={reloj + i * 150} encendida={i === 0 ? 1 : tramo(mas, (i - 1) * 0.25, 0.25 + (i - 1) * 0.25)} />)}
      <Txt x={1130} y={620} txt="más máquinas encendidas" t={28} p={mas} />
      <Bandera x={800} y={820} txt="la llave que separa Crigler-Najjar II del I" color="#C2185B" p={p('llave')} t={26} punta="no" />
    </g>
  );
};

const RecienNacido: Lamina = ({ p, reloj }) => {
  const madura = p('madura');
  return (
    <g>
      <Bandera x={800} y={90} txt="el recién nacido" color="#8A4FE0" p={p('recien')} t={30} punta="no" />
      <Maquina x={420} y={420} k={1.3} golpe={reloj} encendida={0.15 + 0.85 * madura} o={tramo(p('apagada'), 0, 0.4)} />
      <Txt x={420} y={620} txt="la fábrica casi apagada" t={28} p={p('apagada')} />
      <g opacity={tramo(p('uno'), 0, 0.3)}>
        <rect x={900} y={300} width={520} height={60} rx={30} fill="var(--vas-suave)" />
        <rect x={900} y={300} width={Math.max(14, 520 * lerp(0.01, 1, easeOut(madura)))} height={60} rx={30} fill={B.re[1]} />
      </g>
      <Txt x={1160} y={400} txt={madura > 0.5 ? 'madura con las semanas' : 'alrededor del 1 % del adulto'} t={28} p={p('uno')} color={TXB.violeta} />
      <Txt x={1160} y={250} txt="actividad de la UGT1A1" t={24} p={p('adulto')} fuerte={false} />
      <Flecha a={[900, 520]} b={[1420, 520]} p={madura} color="var(--cit-flecha)" w={7} />
      <Txt x={1160} y={570} txt="al nacer → semanas" t={22} p={madura} fuerte={false} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Fabrica, Colitas, SeAbre, Consecuencias, UnaSola, Acelerar, RecienNacido];
export default LAMINAS;
