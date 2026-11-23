'use client';
// Capítulo 7 · El endotelio se rompe

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, Basal, Endo, Flecha, Heparan, Hematie, NO, Neutrofilo, Plaqueta, S, Sale, Selectina, Tijera, Union, easeOut, hash, lerp, tramo } from '../Piezas';

const XS = [190, 495, 800, 1105, 1410];
const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** La pared: la luz del vaso arriba (con glóbulos que corren), cinco células endoteliales, las uniones entre ellas y el intersticio abajo. */
const Pared = ({ reloj, gluco = [1, 1, 1, 1, 1], cierre = [1, 1, 1, 1], activa = 0, alto = 0, children }: { reloj: number; gluco?: number[]; cierre?: number[]; activa?: number; alto?: number; children?: ReactNode }) => (
  <g>
    <rect x={0} y={90 + alto} width={1600} height={560 - alto} fill="#5E1030" /><rect x={0} y={90 + alto} width={1600} height={22} fill="#8E2A55" />
    <rect x={0} y={712} width={1600} height={290} fill="#F9C9D6" opacity={0.75} />
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${lerp(-80, 1680, corre(reloj, i, 6, 9000))},${230 + (i % 3) * 120 + alto * 0.5})`}><Hematie k={0.6} r={i * 40} /></g>)}
    {XS.map((x, i) => <Endo key={i} x={x} y={702} w={290} h={86} gluco={gluco[i]} activa={activa} sem={i + 1} />)}
    {cierre.map((c, i) => <Union key={i} x={(XS[i] + XS[i + 1]) / 2} y={668} h={66} cierre={c} />)}
    <Basal x0={0} x1={1600} y={716} />
    {children}
  </g>
);

// ─── 0 · La alfombra ─────────────────────────────────────────────────────────
const Alfombra: Lamina = ({ p, reloj }) => (
  <g>
    <Pared reloj={reloj} gluco={[1, 1, 1, 1, 1].map((g) => g * easeOut(p('glucocalix')))} />
    <g transform={`translate(${520 + Math.sin(reloj / 700) * 20},${440 + Math.sin(reloj / 500) * 14})`} opacity={tramo(p('leucocitos'), 0, 0.5)}><Neutrofilo k={0.8} /></g>
    <g transform={`translate(${1090 + Math.sin(reloj / 800) * 24},${450 + Math.sin(reloj / 450) * 12})`} opacity={tramo(p('plaquetas'), 0, 0.5)}><Plaqueta k={1} /></g>
    <Bandera x={800} y={95} txt="la pared interna del vaso" color={S.endo[0]} p={p('endotelio')} t={34} punta="no" />
    <Bandera x={800} y={820} txt="el glucocálix: una alfombra de pelillos rica en carbohidratos" color={S.gluco[0]} p={p('alfombra')} t={28} punta="no" />
    <Bandera x={420} y={900} txt="regula la permeabilidad y el roce" color={S.gluco[0]} p={p('permeabilidad')} t={26} punta="no" />
    <Bandera x={1090} y={900} txt="mantiene lejos a leucocitos y plaquetas" color={S.gluco[0]} p={p('leucocitos')} t={26} punta="no" />
    <Bandera x={800} y={960} txt="una alfombra que no deja pegar nada" color={S.gluco[0]} p={p('pegar')} t={30} punta="no" />
  </g>
);

// ─── 1 · Las dos tijeras ─────────────────────────────────────────────────────
const DosTijeras: Lamina = ({ p, reloj }) => {
  const a = easeOut(p('cd44')), b = easeOut(p('heparanasa'));
  return (
    <g>
      <Pared reloj={reloj} gluco={[1 - a, 1 - 0.9 * a, 1, 1 - 0.9 * b, 1 - b]}>
        <Sale p={p('adam')} x={400} y={480} k={1.7} r={-20}><Tijera corta={a} color={S.il1[0]} /></Sale>
        <g opacity={tramo(p('soluble'), 0, 0.4)}>{[0, 1, 2].map((i) => <rect key={i} x={300 + i * 70} y={560 - i * 16 - 50 * tramo(p('soluble'), 0, 1)} width={30} height={14} rx={7} fill={S.gris[1]} />)}</g>
        <Sale p={p('ang2')} x={1100} y={400} k={1.5}><g><circle r={34} fill={S.il6[0]} /><circle cx={-3} cy={-3} r={30} fill={S.il6[1]} /><text y={8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#FFF">Ang-2</text></g></Sale>
        <Flecha a={[1100, 440]} b={[1100, 600]} p={tramo(p('tie2'), 0, 0.8)} color={S.il6[1]} w={7} />
        <Sale p={p('heparanasa')} x={1380} y={480} k={1.7} r={20}><Tijera corta={b} color={S.menin[0]} /></Sale>
        <Sale p={p('heparan')} x={1300} y={590} k={1.2}><Heparan /></Sale>
      </Pared>
      <Bandera x={800} y={95} txt="¿quién desarma esa alfombra?  Dos tijeras" color={S.il1[0]} p={p('tijeras')} t={34} punta="no" />
      <Bandera x={380} y={290} txt="ADAM15 corta CD44" color={S.il1[0]} p={p('adam')} t={26} punta="no" />
      <Bandera x={380} y={830} txt="salen CD44 soluble y fragmentos de hialurónico" color={S.gris[0]} p={p('hialuronico')} t={24} punta="no" />
      <Bandera x={1100} y={290} txt="Ang-2 frena a Tie2" color={S.il6[0]} p={p('tie2')} t={26} punta="no" />
      <Bandera x={1220} y={830} txt="la heparanasa corta el sulfato de heparán" color={S.menin[0]} p={p('heparan')} t={24} punta="no" />
      <Bandera x={800} y={940} txt="dos rutas, un mismo resultado: la alfombra se deshilacha" color={S.il6[0]} p={p('deshilacha')} t={30} punta="no" />
    </g>
  );
};

// ─── 2 · Las cremalleras ─────────────────────────────────────────────────────
const Cremalleras: Lamina = ({ p, reloj }) => {
  const ab = easeOut(p('citocinas'));
  const cierre = [1 - ab, 1 - ab * 0.95, 1 - ab, 1 - ab * 0.9];
  return (
    <g>
      <Pared reloj={reloj} gluco={[0.3, 0.3, 0.3, 0.3, 0.3]} cierre={cierre} activa={0.6} alto={140 * easeOut(p('volumen'))}>
        {Array.from({ length: 12 }, (_, i) => {
          const u = ((reloj / 2600 + i / 12) % 1), cx = (XS[i % 4] + XS[(i % 4) + 1]) / 2;
          return <circle key={i} cx={cx + (hash(i, 4) - 0.5) * 70} cy={lerp(660, 900, u)} r={11} fill="#FFE9A0" opacity={tramo(p('albumina'), 0, 0.4) * (1 - u * 0.4)} />;
        })}
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={100 + i * 150 + hash(i, 6) * 40} cy={800 + hash(i, 7) * 160} r={16 + 14 * tramo(p('edema'), 0, 1)} fill="#CFE9FF" opacity={0.7 * tramo(p('edema'), 0, 0.5)} />)}
      </Pared>
      <Bandera x={800} y={95} txt="las uniones entre las células: como cremalleras" color={S.endo[0]} p={p('cremalleras')} t={30} punta="no" />
      <Bandera x={420} y={290} txt="VE-cadherina · β-catenina · uniones estrechas" color={S.il6[0]} p={p('estrechas')} t={24} punta="no" />
      <Bandera x={1180} y={290} txt="con las citocinas se abren" color={S.il1[0]} p={p('citocinas')} t={28} punta="no" />
      <Bandera x={420} y={900} txt="sale albúmina y líquido: edema" color={S.c5a[0]} p={p('albumina')} t={26} punta="no" />
      <Bandera x={1180} y={900} txt="el vaso pierde volumen" color={S.il1[0]} p={p('volumen')} t={26} punta="no" />
      <Bandera x={800} y={965} txt="la fuga capilar: el líquido sale y la presión cae" color={S.il1[0]} p={p('fuga')} t={30} punta="no" />
    </g>
  );
};

// ─── 3 · Un endotelio pegajoso ───────────────────────────────────────────────
const Pegajoso: Lamina = ({ p, reloj }) => {
  const roda = p('ruedan'), agarra = easeOut(p('agarran'));
  return (
    <g>
      <Pared reloj={reloj} gluco={[0.05, 0.05, 0.05, 0.05, 0.05]} activa={1}>
        {XS.map((x, i) => <g key={i} opacity={tramo(p('selectinas'), i * 0.1, i * 0.1 + 0.5)}><Selectina x={x - 40} y={630} k={1.4} /><Selectina x={x + 50} y={630} k={1.4} /></g>)}
        {[430, 800, 1170].map((x, i) => <g key={i} opacity={tramo(p('cam'), i * 0.15, i * 0.15 + 0.5)}><rect x={x - 6} y={600} width={12} height={50} rx={6} fill={S.lps[1]} /><rect x={x + 24} y={606} width={12} height={44} rx={6} fill={S.il6[1]} /></g>)}
        {[0, 1, 2].map((i) => {
          const x = lerp(160 + i * 120, 430 + i * 370, agarra) + (1 - agarra) * ((reloj / 7 + i * 300) % 160), y = lerp(430 - i * 20, 568, agarra);
          return <g key={i} opacity={tramo(roda, i * 0.1, i * 0.1 + 0.4)} transform={`translate(${x},${y})`}><Neutrofilo k={0.72} activo={agarra} /></g>;
        })}
      </Pared>
      <Bandera x={800} y={95} txt="sin alfombra, el endotelio se vuelve pegajoso" color={S.endo[0]} p={p('pegajoso')} t={30} punta="no" />
      <Bandera x={420} y={830} txt="selectinas" color={S.gluco[0]} p={p('selectinas')} t={28} punta="no" />
      <Bandera x={800} y={830} txt="ICAM-1 y VCAM-1" color={S.lps[0]} p={p('cam')} t={28} punta="no" />
      <Bandera x={1180} y={830} txt="integrinas: LFA-1, Mac-1 y VLA-4" color={S.il6[0]} p={p('lfa')} t={26} punta="no" />
      <Bandera x={800} y={250} txt="los leucocitos ruedan, frenan y se agarran" color={S.neutro[0]} p={p('leucocitos')} t={28} punta="no" />
      <Bandera x={800} y={940} txt="como cinta adhesiva por dentro del vaso: dejan de pasar de largo" color={S.il1[0]} p={p('cinta')} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · Especies reactivas y tapones ────────────────────────────────────────
const Tapones: Lamina = ({ p, reloj }) => {
  const rotos = easeOut(p('cadherina'));
  return (
    <g>
      <Pared reloj={reloj} gluco={[0.05, 0.05, 0.05, 0.05, 0.05]} activa={1} cierre={[1 - rotos, 1, 1 - rotos, 1]}>
        {[430, 1020].map((x, i) => (
          <g key={i}>
            <g transform={`translate(${x},568)`}><Neutrofilo k={0.72} activo={1} /></g>
            {Array.from({ length: 6 }, (_, j) => <circle key={j} cx={x + Math.cos(j + reloj / 700) * 90} cy={560 + Math.sin(j * 2 + reloj / 600) * 50} r={7} fill={S.verde[1]} opacity={tramo(p('ros'), 0, 0.4) * 0.85} />)}
            <g opacity={tramo(p('proteasas'), 0, 0.4)} transform={`translate(${x + 80},470)`}><Tijera corta={0.5} k={0.9} color={S.menin[0]} /></g>
          </g>
        ))}
        <g transform="translate(1390,330)" opacity={tramo(p('pequenos'), 0, 0.4)}>
          <rect x={-60} y={-110} width={120} height={300} rx={50} fill="#B02FA0" /><rect x={-54} y={-104} width={108} height={288} rx={46} fill="#7A1E3A" />
          {[[-20, 20], [10, -20], [0, 60], [-10, 100], [20, 130]].map(([cx, cy], i) => <g key={i} opacity={tramo(p('agregados'), i * 0.12, i * 0.12 + 0.4)}>{i % 2 ? <Plaqueta x={cx} y={cy} k={0.6} /> : <g transform={`translate(${cx},${cy})`}><Neutrofilo k={0.4} /></g>}</g>)}
        </g>
      </Pared>
      <Bandera x={600} y={250} txt="los leucocitos pegados sueltan especies reactivas de oxígeno y proteasas" color={S.verde[0]} p={p('ros')} t={24} punta="no" />
      <Bandera x={600} y={830} txt="rompen la VE-cadherina y la ZO-1" color={S.il1[0]} p={p('zo1')} t={26} punta="no" />
      <Bandera x={1390} y={200} txt="en los vasos más pequeños" color={S.plaq[0]} p={p('pequenos')} t={24} punta="no" />
      <Bandera x={1390} y={600} txt="agregados que lo tapan" color={S.plaq[0]} p={p('tapan')} t={26} punta="no" />
      <Bandera x={1180} y={900} txt="el tejido de atrás se queda sin sangre: isquemia" color={S.il1[0]} p={p('isquemia')} t={30} punta="no" />
    </g>
  );
};

// ─── 5 · El óxido nítrico se desequilibra ────────────────────────────────────
const OxidoNitrico: Lamina = ({ p, reloj }) => {
  const gush = easeOut(p('mucho'));
  return (
    <g>
      <Bandera x={420} y={95} txt="endotelio sano: eNOS" color={S.no[0]} p={p('enos')} t={30} punta="no" />
      <Bandera x={1180} y={95} txt="en la sepsis: iNOS" color={S.il1[0]} p={p('inos')} t={30} punta="no" />
      <path d="M800,180 L800,860" stroke="var(--cit-texto-2)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.4 * tramo(p('baja'), 0, 0.5)} />
      <Sale p={p('enos')} x={420} y={640} k={1.6}><Endo w={290} h={86} gluco={1} /></Sale>
      {Array.from({ length: 3 }, (_, i) => { const u = corre(reloj, i, 3, 3500); return <g key={i} opacity={tramo(p('dosis'), 0, 0.4) * (1 - u)} transform={`translate(${420 + (i - 1) * 40},${lerp(560, 340, u)})`}><NO k={1.4} /></g>; })}
      <Bandera x={420} y={830} txt="un chorrito constante regula el tono" color={S.no[0]} p={p('tono')} t={24} punta="no" />
      <Sale p={p('inos')} x={1180} y={640} k={1.6}><Endo w={290} h={86} gluco={0.1} activa={1} /></Sale>
      {Array.from({ length: 22 }, (_, i) => { const u = corre(reloj, i, 22, 2600); return <g key={i} opacity={gush * (1 - u * 0.6)} transform={`translate(${1180 + (hash(i, 2) - 0.5) * 380},${lerp(580, 230, u)})`}><NO k={1.2 + hash(i, 3) * 0.8} /></g>; })}
      <Sale p={p('peroxinitrito')} x={1180} y={300} k={1.8}><g transform={`rotate(${reloj / 30})`}><polygon points="0,-40 12,-12 40,-12 18,6 26,34 0,18 -26,34 -18,6 -40,-12 -12,-12" fill={S.il6[0]} /><polygon points="0,-34 9,-10 34,-10 15,5 22,28 0,15 -22,28 -15,5 -34,-10 -9,-10" fill={S.il6[1]} /></g></Sale>
      <Bandera x={1180} y={420} txt="peroxinitrito: daña todo lo que toca" color={S.il6[0]} p={p('peroxinitrito')} t={24} punta="no" />
      <Bandera x={1180} y={830} txt="mucho óxido nítrico: una inundación" color={S.il1[0]} p={p('inundacion')} t={28} punta="no" />
      <Bandera x={800} y={940} txt="se retoma en el capítulo 12" color={S.il6[0]} p={p('capitulo')} t={28} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Alfombra, DosTijeras, Cremalleras, Pegajoso, Tapones, OxidoNitrico];
export default LAMINAS;
