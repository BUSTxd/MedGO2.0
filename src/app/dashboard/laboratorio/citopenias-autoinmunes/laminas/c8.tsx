'use client';
// Capítulo 8 · PTI: por qué la médula no repone. El termostato de la trombopoyetina.

import type { Lamina } from '../Lienzo';
import { C, Chorro, En, Hepatocito, IgG, Linfocito, MAC, Macrofago, Megacariocito, Plaqueta, Rotulo, Sale, Txt, clamp, easeOut, enBorde, lerp, tramo } from '../Piezas';
import { Barra, Visto, viaje } from './Comun';

const TPO = '#2DD4BF';
const Punto = ({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) => (
  <En x={x} y={y} k={k} o={o}><circle r={12} fill="#0F9D8F" /><circle cx={-2} cy={-2} r={9} fill={TPO} /><circle cx={-4} cy={-4} r={3} fill="#FFF" /></En>
);

/** Plaqueta con su receptor cMpl; `tpo` 0–1: ya atrapó trombopoyetina. */
function PlaquetaR({ x, y, k = 1, tpo = 0, o = 1 }: { x: number; y: number; k?: number; tpo?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-5} y={-54} width={10} height={26} rx={5} fill={C.c1[1]} />
      <path d="M-12,-62 Q0,-48 12,-62" fill="none" stroke={C.c1[1]} strokeWidth={6} strokeLinecap="round" />
      <Plaqueta />
      {tpo > 0 && <Punto x={0} y={-64} k={clamp(tpo) * 0.85} />}
    </En>
  );
}

const Termostato: Lamina = ({ p }) => (
  <g>
    <Rotulo x={800} y={70} txt="El termostato" color="#0F9D8F" p={p('titulo')} t={36} />
    <Sale p={p('hepa')} x={280} y={440} k={1.25}><Hepatocito /></Sale>
    <Rotulo x={280} y={650} txt="El hígado la fabrica" color={C.ambar[0]} p={p('hepa')} t={27} />
    {Array.from({ length: 10 }, (_, i) => { const q = tramo(p('tpo'), i * 0.07, 0.5 + i * 0.07); return q > 0 ? <Punto key={i} x={lerp(420, 880, easeOut(q))} y={380 + (i % 4) * 40} o={1 - tramo(q, 0.85, 1)} /> : null; })}
    <Rotulo x={650} y={250} txt="Trombopoyetina" color="#0F9D8F" p={p('tpo')} t={27} />
    <Sale p={p('mek')} x={1040} y={440} k={0.95}><Megacariocito prolong={clamp(p('produce'))} /></Sale>
    <Rotulo x={1040} y={720} txt="Le ordena producir plaquetas" color={C.plaq[1]} p={p('produce')} t={27} />
    {[0, 1, 2].map((i) => <PlaquetaR key={i} x={1320 + (i % 2) * 90} y={330 + i * 110} k={1.15} tpo={tramo(p('atrapan'), i * 0.2, 0.6 + i * 0.2)} o={p('receptor')} />)}
    <Rotulo x={1330} y={190} txt="Receptor cMpl" color={C.c1[1]} p={p('receptor')} t={27} />
    <Txt x={800} y={850} txt="Atrapan trombopoyetina y la sacan de circulación" t={30} p={p('atrapan')} />
  </g>
);

function Mitad({ x, muchas, q, qP }: { x: number; muchas: boolean; q: number; qP: number }) {
  const n = muchas ? 14 : 3;
  return (
    <g>
      <En x={x} y={640} k={0.72} o={tramo(q, 0, 0.4)}><Megacariocito prolong={muchas ? 0.25 : 1} /></En>
      {Array.from({ length: n }, (_, i) => <PlaquetaR key={i} x={x - 190 + (i % 7) * 64} y={230 + Math.floor(i / 7) * 96 + (i % 2) * 16} k={0.72} tpo={muchas ? tramo(q, 0.25, 0.9) : 0} o={tramo(q, 0, 0.3)} />)}
      {Array.from({ length: muchas ? 3 : 9 }, (_, i) => { const r = tramo(qP, i * 0.06, 0.65 + i * 0.06); return r > 0 ? <Punto key={i} x={x - 110 + (i % 5) * 58} y={lerp(180, 470 + (i % 3) * 16, r)} k={0.85} /> : null; })}
    </g>
  );
}

const SeRegula: Lamina = ({ p }) => (
  <g>
    <Rotulo x={400} y={80} txt="Pocas plaquetas" color={C.plaq[1]} p={p('pocas')} t={31} />
    <Mitad x={400} muchas={false} q={p('pocas')} qP={p('llega')} />
    <Rotulo x={400} y={880} txt="La producción sube" color={C.verde[0]} p={p('sube')} t={29} />
    <Rotulo x={1200} y={80} txt="Muchas plaquetas" color={C.plaq[0]} p={p('muchas')} t={31} />
    <Mitad x={1200} muchas q={p('muchas')} qP={p('llegapoca')} />
    <Rotulo x={1200} y={880} txt="La producción baja" color={C.rojo[1]} p={p('baja')} t={29} />
    <Txt x={800} y={455} txt="Regulan su" t={27} p={p('regulan')} />
    <Txt x={800} y={495} txt="propia fabricación" t={27} p={p('regulan')} />
    <Txt x={800} y={950} txt="Y en esta enfermedad, el sistema se engaña" t={29} p={p('engana')} />
  </g>
);

const Engañado: Lamina = ({ p }) => {
  const sal = p('salen'), des = p('destruyen');
  return (
    <g>
      <Sale p={p('mek')} x={280} y={470} k={0.9}><Megacariocito /></Sale>
      {[0, 1, 2, 3].map((i) => {
        const q = tramo(sal, i * 0.15, 0.6 + i * 0.15);
        const a = viaje([430, 440], [640 + i * 74, 300 + (i % 2) * 110], q);
        const b = viaje([a.x, a.y], [1120, 430], tramo(des, i * 0.13, 0.55 + i * 0.13));
        return q > 0 ? <PlaquetaR key={i} x={b.x} y={b.y} k={lerp(1.2, 0.7, des)} tpo={tramo(p('atrapan'), i * 0.15, 0.6 + i * 0.15)} o={1 - tramo(des, 0.65 + i * 0.07, 1)} /> : null;
      })}
      <Rotulo x={720} y={150} txt="Atrapan trombopoyetina, como siempre" color="#0F9D8F" p={p('atrapan')} t={27} />
      <Sale p={p('macro')} x={1160} y={440} k={0.95}><Macrofago /></Sale>
      <Txt x={1200} y={660} txt="Destruidas, con todo y la trombopoyetina" t={27} p={des} />
      <Barra x={110} y={800} w={420} val={0.08} color={C.plaq[1]} txt="Recuento de plaquetas" p={p('suelo')} />
      <Barra x={110} y={910} w={420} val={0.12} color={TPO} txt="Señal para producir más" p={p('senal')} />
      <Barra x={880} y={800} w={380} val={0.2} color={TPO} txt="PTI" p={p('aplasica')} />
      <Barra x={880} y={910} w={380} val={0.92} color="#0F9D8F" txt="Anemia aplásica, mismo recuento" p={p('aplasica')} />
    </g>
  );
};

const LaFabrica: Lamina = ({ p }) => {
  const dañ = p('escaso');
  return (
    <g>
      <Rotulo x={800} y={70} txt="También atacan a la fábrica" color={C.rojo[1]} p={p('titulo')} t={35} />
      <Sale p={p('mek')} x={760} y={520} k={1.5}><Megacariocito prolong={lerp(1, 0.22, dañ)} /></Sale>
      {[-30, 40, 110, 200, 300].map((a, i) => {
        const q = tramo(p('ac'), i * 0.15, 0.6 + i * 0.15);
        const b = enBorde(760, 520, lerp(380, 230, easeOut(q)), a);
        return q > 0 ? <IgG key={a} x={b.x} y={b.y} r={b.r} k={1.75} o={tramo(q, 0, 0.4)} /> : null;
      })}
      {[60, 240].map((a, i) => { const b = enBorde(760, 520, 214, a); return <MAC key={a} x={b.x} y={b.y} r={a + 90} k={1.5 * clamp(tramo(dañ, i * 0.2, 0.7 + i * 0.2))} />; })}
      <Rotulo x={260} y={280} txt="Mismas glicoproteínas" color={C.verde[0]} p={p('gp')} t={26} />
      <Rotulo x={260} y={380} txt="El anticuerpo lo reconoce" color={C.igg[1]} p={p('ac')} t={25} />
      <Rotulo x={260} y={490} txt="Más escaso, madura peor" color={C.plaq[0]} p={dañ} t={26} />
      {[0, 1].map((i) => { const a = viaje([1600, 360 + i * 240], [1120 + i * 50, 390 + i * 240], p('ctl')); return <En key={i} x={a.x} y={a.y} k={1.2} o={p('ctl')}><Linfocito tono="cd8" /></En>; })}
      <Chorro a={[1090, 440]} b={[940, 480]} p={p('altera')} color={C.c3b[1]} n={12} abanico={110} R={8} />
      <Rotulo x={1340} y={205} txt="Células T citotóxicas" color="#6D28D9" p={p('ctl')} t={26} />
      <Txt x={800} y={920} txt="Se destruye la plaqueta y se daña a quien la hace" t={33} p={p('quien')} />
    </g>
  );
};

const PorEsoFunciona: Lamina = ({ p }) => {
  const a = p('agonista');
  return (
    <g>
      <Sale p={p('mek')} x={590} y={480} k={1.25}><Megacariocito prolong={lerp(0.25, 1, a)} /></Sale>
      {[-140, -60, 30, 120, 200].map((ang, i) => {
        const q = tramo(a, i * 0.13, 0.55 + i * 0.13);
        const b = enBorde(590, 480, lerp(430, 196, easeOut(q)), ang);
        return q > 0 ? <En key={ang} x={b.x} y={b.y} r={45} k={1} o={tramo(q, 0, 0.4)}><rect x={-15} y={-15} width={30} height={30} rx={6} fill="#F97316" /><rect x={-10} y={-11} width={8} height={8} rx={2} fill="#FFC48A" /></En> : null;
      })}
      <Rotulo x={590} y={70} txt="Agonistas del receptor de trombopoyetina" color="#F97316" p={p('agonista')} t={27} />
      {Array.from({ length: 12 }, (_, i) => { const q = tramo(p('brotan'), i * 0.05, 0.45 + i * 0.05), ang = (i / 12) * 6.28; return q > 0 ? <Plaqueta key={i} x={590 + Math.cos(ang) * lerp(220, 370, q)} y={480 + Math.sin(ang) * lerp(220, 310, q)} k={0.8} r={i * 30} o={q} /> : null; })}
      <Txt x={1270} y={260} txt="60-90 %" t={80} color="#F97316" p={p('cifra')} />
      <Txt x={1270} y={345} txt="responde" t={30} p={p('cifra')} />
      <Visto x={1060} y={500} k={0.85} p={p('senal')} />
      <Txt x={1110} y={500} txt="No frenan el ataque: arreglan la señal" t={25} p={p('senal')} ancla="start" />
      <Barra x={1020} y={640} w={410} val={0.9} color={TPO} txt="Mejor, con trombopoyetina propia baja" p={p('mejor')} />
      <Rotulo x={800} y={880} txt="La PTI no solo destruye: también deja de reponer" color={C.plaq[1]} p={p('final')} t={34} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Termostato, SeRegula, Engañado, LaFabrica, PorEsoFunciona];
export default LAMINAS;
