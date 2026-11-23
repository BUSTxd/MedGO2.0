'use client';
// Capítulo 4 · Reconocer al invasor: PAMP, DAMP, PRR y TLR

import type { Lamina } from '../Lienzo';
import { Apoptosis, Bacilo, Bandera, Cd14, Diplococo, Enterocito, Flecha, Lbp, Llave, Lps, Macrofago, MembranaViva, Neutrofilo, S, Sale, Tlr4, Txt, Vaso, Virus, easeOut, hash, lerp, tramo } from '../Piezas';

/** Un marcador dorado de patrón (PAMP) sobre un microbio. */
const Patron = ({ x, y, q, reloj }: { x: number; y: number; q: number; reloj: number }) => (
  <g transform={`translate(${x},${y}) scale(${(0.6 + 0.4 * easeOut(q)) * (1 + 0.08 * Math.sin(reloj / 260))})`} opacity={tramo(q, 0, 0.3)}>
    <path d="M0,-18 L16,12 L-16,12 Z" fill={S.lps[0]} /><path d="M0,-14 L12,9 L-12,9 Z" fill={S.lps[1]} /><circle cx={-3} cy={-2} r={3} fill="#FFF" opacity={0.7} />
  </g>
);

// ─── 0 · Reconocer patrones ──────────────────────────────────────────────────
const Patrones: Lamina = ({ p, reloj }) => {
  const q = p('patrones');
  return (
    <g>
      <MembranaViva y={850} reloj={reloj} o={tramo(p('receptores'), 0, 0.4)} />
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={tramo(p('receptores'), i * 0.12, i * 0.12 + 0.5)} x={290 + i * 260} y={816}><Tlr4 cola={false} md2={0} k={0.9} reloj={reloj} activo={0} /></Sale>)}
      <Sale p={p('microbio')} x={270} y={330} k={1}><Diplococo reloj={reloj} /></Sale>
      <Sale p={p('microbio')} x={640} y={340} k={1.3}><Bacilo reloj={reloj} flagelo={0.7} /></Sale>
      <Sale p={p('microbio')} x={980} y={330} k={0.85}><Virus /></Sale>
      <Patron x={270} y={262} q={q} reloj={reloj} /><Patron x={600} y={290} q={q} reloj={reloj} /><Patron x={1000} y={262} q={q} reloj={reloj} />
      <Flecha a={[270, 420]} b={[290, 700]} p={tramo(p('estructuras'), 0, 0.9)} color={S.lps[1]} w={7} />
      <Flecha a={[640, 430]} b={[550, 700]} p={tramo(p('estructuras'), 0.1, 1)} color={S.lps[1]} w={7} />
      <Flecha a={[980, 420]} b={[810, 700]} p={tramo(p('estructuras'), 0.2, 1)} color={S.lps[1]} w={7} />
      <Bandera x={800} y={100} txt="no memoriza cada especie: reconoce patrones" color={S.il6[0]} p={p('visto')} t={32} punta="no" />
      <Bandera x={640} y={560} txt="estructuras que los microbios comparten" color={S.lps[0]} p={p('estructuras')} t={26} punta="no" />
      <Sale p={p('llave')} x={1380} y={520} k={1.9} r={-35}><Llave /></Sale>
      <Bandera x={1380} y={690} txt="una llave maestra, no mil llaves" color={S.nfkb[0]} p={p('llave')} t={26} punta="no" />
      <Bandera x={620} y={940} txt="receptores de reconocimiento de patrones (PRR)" color={S.il6[0]} p={p('prr')} t={30} punta="no" />
      <Txt x={1240} y={935} txt="un puñado de receptores…" t={26} p={p('punado')} />
      <Txt x={1240} y={975} txt="…vigila a una infinidad de microbios" t={26} p={p('infinidad')} />
    </g>
  );
};

// ─── 1 · PAMP ────────────────────────────────────────────────────────────────
const Pamps: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('pamps')} x={800} y={520} k={2.6}><Bacilo reloj={reloj} fimbrias={1} flagelo={1} /></Sale>
    <Bandera x={800} y={100} txt="PAMP: patrones moleculares asociados a patógenos" color={S.lps[0]} p={p('pamps')} t={32} punta="no" />
    <Bandera x={420} y={300} txt="LPS o LOS" color={S.lps[0]} p={p('lps')} t={30} punta="abajo" />
    <Flecha a={[470, 340]} b={[600, 440]} p={tramo(p('lps'), 0.2, 1)} color={S.lps[1]} w={6} />
    <Bandera x={420} y={400} txt="de las gramnegativas" color={S.lps[0]} p={p('los')} t={22} punta="no" />
    <Bandera x={1180} y={300} txt="flagelina" color={S.gluco[0]} p={p('flagelina')} t={30} punta="abajo" />
    <Flecha a={[1130, 340]} b={[1010, 470]} p={tramo(p('flagelina'), 0.2, 1)} color={S.gluco[1]} w={6} />
    <Bandera x={420} y={680} txt="peptidoglucano" color={S.c5a[0]} p={p('peptido')} t={30} punta="no" />
    <Flecha a={[520, 650]} b={[640, 560]} p={tramo(p('peptido'), 0.2, 1)} color={S.c5a[1]} w={6} />
    <Bandera x={1180} y={680} txt="ácidos lipoteicoicos (grampositivas)" color={S.il6[0]} p={p('lipoteicoicos')} t={26} punta="no" />
    <Bandera x={800} y={800} txt="ácidos nucleicos microbianos" color={S.il1[0]} p={p('nucleicos')} t={30} punta="no" />
    <Bandera x={800} y={900} txt="esenciales: si el microbio los cambia, deja de funcionar" color={S.il6[0]} p={p('esenciales')} t={28} punta="no" />
    <Bandera x={800} y={970} txt="su talón de Aquiles" color={S.il1[0]} p={p('talon')} t={30} punta="no" />
  </g>
);

// ─── 2 · El lípido A ─────────────────────────────────────────────────────────
const LipidoA: Lamina = ({ p, reloj }) => (
  <g>
    <MembranaViva y={700} reloj={reloj} amp={5} o={0.9} />
    <Sale p={p('lps')} x={470} y={628} k={1.65}><Lps reloj={reloj} cadena={1} resalta={p('endotoxica')} /></Sale>
    <Bandera x={290} y={110} txt="LPS" color={S.lps[0]} p={p('lps')} t={36} punta="no" />
    <Bandera x={730} y={780} txt="lípido A" color={S.lps[0]} p={p('lipido')} t={30} punta="izq" ancla="izq" />
    <Bandera x={730} y={560} txt="núcleo de azúcares" color={S.tnf[0]} p={p('nucleo')} t={28} punta="izq" ancla="izq" />
    <Bandera x={700} y={330} txt="antígeno O (cadena larga)" color={S.nfkb[0]} p={p('antigeno')} t={26} punta="izq" ancla="izq" />
    <Sale p={p('meningococo')} x={1330} y={628} k={1.65}><Lps reloj={reloj} cadena={0} resalta={p('endotoxica')} fase={2} /></Sale>
    <Bandera x={1330} y={330} txt="LOS del meningococo" color={S.menin[0]} p={p('meningococo')} t={28} punta="no" />
    <Txt x={1330} y={400} txt="sin cadena larga: lipooligosacárido" t={24} p={p('los')} />
    <Bandera x={1130} y={870} txt="la porción endotóxica es el lípido A" color={S.il1[0]} p={p('endotoxica')} t={30} punta="no" />
    <Bandera x={800} y={950} txt="un pedacito de grasa que enciende un organismo entero" color={S.il6[0]} p={p('pedacito')} t={30} punta="no" />
  </g>
);

// ─── 3 · Del LPS al TLR4: la carrera de relevos ──────────────────────────────
const Relevo: Lamina = ({ p, reloj }) => {
  const A = [430, 460], B = [790, 460], C = [1130, 600];
  const q1 = easeOut(p('lps')), q2 = easeOut(p('cd14')), q3 = easeOut(p('tlr4'));
  const [lx, ly] = q3 > 0 ? [lerp(B[0], C[0], q3), lerp(B[1], C[1], q3)] : q2 > 0 ? [lerp(A[0], B[0], q2), lerp(A[1], B[1], q2)] : [lerp(190, A[0], q1), lerp(460, A[1], q1)];
  return (
    <g>
      <MembranaViva y={850} reloj={reloj} />
      <Sale p={p('lbp')} x={A[0]} y={A[1] + 40} k={1.4}><Lbp /></Sale>
      <Bandera x={A[0]} y={620} txt="LBP" color={S.linfo[0]} p={p('lbp')} t={30} punta="no" />
      <Sale p={p('cd14')} x={B[0]} y={B[1] + 30} k={1.5}><Cd14 /></Sale>
      <Bandera x={B[0]} y={620} txt="CD14" color={S.c5a[0]} p={p('cd14')} t={30} punta="no" />
      <Sale p={p('tlr4')} x={C[0]} y={816} k={1.1}><Tlr4 md2={p('md2')} activo={p('despierta')} reloj={reloj} /></Sale>
      <Bandera x={C[0]} y={930} txt="TLR4 / MD-2 en la membrana" color={S.lps[0]} p={p('md2')} t={26} punta="no" />
      <g opacity={tramo(p('lps'), 0, 0.3)} transform={`translate(${lx},${ly - 40}) rotate(90)`}><circle r={70} fill={S.lps[2]} opacity={0.4} /><Lps cadena={0.5} k={0.9} reloj={reloj} /></g>
      <Bandera x={190} y={620} txt="LPS en la sangre" color={S.lps[0]} p={p('lps')} t={28} punta="no" />
      <Flecha a={[A[0] + 60, 430]} b={[B[0] - 70, 430]} p={tramo(p('cd14'), 0, 0.8)} color={S.il6[1]} w={7} />
      <Flecha a={[B[0] + 70, 480]} b={[C[0] - 40, 650]} c={[1010, 520]} p={tramo(p('tlr4'), 0, 0.8)} color={S.il6[1]} w={7} />
      <Bandera x={800} y={110} txt="una carrera de relevos" color={S.il6[0]} p={p('relevos')} t={34} punta="no" />
      <Bandera x={1300} y={140} txt="monocitos y células dendríticas" color={S.linfo[0]} p={p('monocitos')} t={26} punta="no" />
      <Bandera x={800} y={760} txt="una llave que pasa de mano en mano" color={S.nfkb[0]} p={p('llave')} t={26} punta="no" />
      <g opacity={tramo(p('encaja'), 0, 0.5)}><circle cx={C[0]} cy={C[1] + 36} r={90 + 8 * Math.sin(reloj / 250)} fill="none" stroke={S.il1[1]} strokeWidth={8} strokeDasharray="2 14" strokeLinecap="round" /></g>
      <Bandera x={C[0]} y={420} txt="cuando encaja, la célula despierta" color={S.il1[0]} p={p('despierta')} t={26} punta="no" />
    </g>
  );
};

// ─── 4 · Endotoxina sin bacteria muerta ──────────────────────────────────────
const Vesiculas: Lamina = ({ p, reloj }) => {
  const v = easeOut(p('vesiculas'));
  return (
    <g>
      <Sale p={p('muera')} x={330} y={520} k={2.3}><Bacilo reloj={reloj} fimbrias={0.6} flagelo={0.8} /></Sale>
      <Bandera x={330} y={720} txt="una bacteria viva" color={S.menin[0]} p={p('vivas')} t={28} punta="no" />
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((reloj / 4500 + i / 7) % 1);
        const x = lerp(430 + (i % 3) * 30, 1150, u * v + 0.0), y = 520 + Math.sin(i * 2.3 + u * 4) * 110 - (i % 2 ? 40 : -40) * u;
        const R = 22 + hash(i, 2) * 12;
        return (
          <g key={i} opacity={tramo(p('vesiculas'), i * 0.1, i * 0.1 + 0.4)} transform={`translate(${x},${y})`}>
            <circle r={R} fill={S.lps[0]} opacity={0.3} /><circle r={R - 4} fill={S.lps[2]} opacity={0.9} />
            {Array.from({ length: 8 }, (_, j) => { const a = (j / 8) * Math.PI * 2; return <circle key={j} cx={Math.cos(a) * (R + 4)} cy={Math.sin(a) * (R + 4)} r={4} fill={S.lps[1]} />; })}
          </g>
        );
      })}
      <Bandera x={800} y={300} txt="vesículas de membrana externa, con LPS" color={S.lps[0]} p={p('vesiculas')} t={28} punta="no" />
      <Sale p={p('distancia')} x={1330} y={520} k={1.2}><Macrofago /></Sale>
      <Bandera x={1330} y={720} txt="actúan a distancia" color={S.linfo[0]} p={p('distancia')} t={28} punta="no" />
      <Bandera x={800} y={100} txt="¿hace falta que la bacteria muera para soltar endotoxina?  No" color={S.il1[0]} p={p('endotoxina')} t={30} punta="no" />
      <Bandera x={800} y={870} txt="la endotoxina está en la sangre y en los tejidos sin que la bacteria se rompa" color={S.il6[0]} p={p('tejidos')} t={26} punta="no" />
      <Bandera x={800} y={950} txt="la señal viaja sola" color={S.lps[0]} p={p('sola')} t={32} punta="no" />
    </g>
  );
};

// ─── 5 · DAMP: las señales de casa ───────────────────────────────────────────
const Damps: Lamina = ({ p, reloj }) => {
  const rotura = p('rompe');
  const moleculas: { clave: string; txt: string; color: string; x: number; y: number }[] = [
    { clave: 'hmgb1', txt: 'HMGB1', color: S.il1[0], x: 680, y: 250 },
    { clave: 'atp', txt: 'ATP extracelular', color: S.lps[0], x: 760, y: 360 },
    { clave: 'adn', txt: 'ADN mitocondrial', color: S.c5a[0], x: 740, y: 470 },
    { clave: 'histonas', txt: 'histonas', color: S.il6[0], x: 640, y: 580 },
    { clave: 'proteinas', txt: 'proteínas de choque térmico', color: S.gluco[0], x: 760, y: 690 },
  ];
  return (
    <g>
      <Bandera x={800} y={100} txt="otra fuente de alarma, y esta es de casa" color={S.il6[0]} p={p('casa')} t={34} punta="no" />
      <Sale p={p('casa')} x={290} y={500} k={1}><g><circle r={150} fill={S.cito[0]} /><circle cx={-4} cy={-4} r={140} fill={S.cito[1]} /><circle cx={-20} cy={-10} r={52} fill={S.nucleo[1]} /></g></Sale>
      <g opacity={tramo(rotura, 0, 0.3)}><Apoptosis x={290} y={500} p={rotura} R={150} tono={S.cito as unknown as string[]} /></g>
      <Bandera x={290} y={720} txt="una célula nuestra que se rompe" color={S.il1[0]} p={rotura} t={26} punta="no" />
      {moleculas.map((m, i) => (
        <g key={m.clave}>
          <Flecha a={[380, 500]} b={[m.x - 30, m.y]} p={tramo(p(m.clave), 0, 0.7)} color={m.color} w={5} cabeza={false} />
          <Sale p={p(m.clave)} x={m.x} y={m.y}>
            <circle r={26 + 3 * Math.sin(reloj / 300 + i)} fill={m.color} opacity={0.3} />
            <circle r={18} fill={m.color} />
          </Sale>
          <Bandera x={m.x + 220} y={m.y} txt={m.txt} color={m.color} p={p(m.clave)} t={24} punta="izq" ancla="izq" />
        </g>
      ))}
      <Sale p={p('damps')} x={1440} y={330} k={0.8}><Macrofago /></Sale>
      <Bandera x={1400} y={470} txt="DAMP: señales de daño propio" color={S.il1[0]} p={p('damps')} t={26} punta="no" />
      <Bandera x={1240} y={820} txt="las células que mueren mantienen encendida la inflamación" color={S.il1[0]} p={p('mueren')} t={26} punta="no" />
      <Bandera x={800} y={950} txt="el daño alimenta al daño" color={S.il6[0]} p={p('dano')} t={34} punta="no" />
    </g>
  );
};

// ─── 6 · Una familia de receptores ───────────────────────────────────────────
const Familia: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="los TLR son una familia" color={S.il6[0]} p={p('familia')} t={36} punta="no" />
    <MembranaViva y={470} reloj={reloj} />
    {[[330, '4', 'TLR4: LPS', S.lps[0], 'tlr4'], [800, '2', 'TLR2: lipoproteínas y ácidos lipoteicoicos', S.il6[0], 'tlr2'], [1270, '5', 'TLR5: flagelina', S.gluco[0], 'tlr5']].map(([x, , txt, color, clave]) => (
      <g key={String(clave)}>
        <Sale p={p(String(clave))} x={Number(x)} y={436} k={1}><Tlr4 cola={false} md2={clave === 'tlr4' ? 1 : 0} reloj={reloj} /></Sale>
        <Bandera x={Number(x)} y={240} txt={String(txt)} color={String(color)} p={p(String(clave))} t={24} punta="no" />
      </g>
    ))}
    <Sale p={p('endosomas')} x={560} y={740} k={1}>
      <circle r={190} fill={S.membrana[0]} opacity={0.35} /><circle r={178} fill={S.cito[2]} opacity={0.5} />
    </Sale>
    <Bandera x={560} y={950} txt="en los endosomas: ácidos nucleicos" color={S.c5a[0]} p={p('endosomas')} t={26} punta="no" />
    {[['tlr3', '3', -80, -40], ['tlr7', '7', 20, -70], ['tlr8', '8', -20, 40], ['tlr9', '9', 90, 30]].map(([clave, n, dx, dy]) => (
      <Sale key={String(clave)} p={p(String(clave))} x={560 + Number(dx)} y={740 + Number(dy)}>
        <circle r={36} fill={S.c5a[0]} /><circle cx={-3} cy={-3} r={31} fill={S.c5a[1]} /><text y={11} textAnchor="middle" fontSize={32} fontWeight={800} fill="#FFF">{String(n)}</text>
      </Sale>
    ))}
    <Sale p={p('citoplasma')} x={1180} y={740} k={1}>
      {[[-70, -30], [30, -60], [70, 40], [-30, 50]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={32} fill={i % 2 ? S.il1[1] : S.nfkb[1]} />)}
    </Sale>
    <Bandera x={1180} y={880} txt="en el citoplasma: NOD y NLR" color={S.il1[0]} p={p('nod')} t={26} punta="no" />
    <Bandera x={800} y={560} txt="cada receptor, una pista distinta" color={S.il6[0]} p={p('pista')} t={28} punta="no" />
  </g>
);

// ─── 7 · El meningococo: escudo y delator ────────────────────────────────────
const Meningococo: Lamina = ({ p, reloj }) => {
  const pasa = easeOut(p('mucosa'));
  const x = lerp(330, 1150, pasa), y = lerp(560, 540, pasa);
  const cap = easeOut(p('capsula'));
  const spikes = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return [Math.cos(a) * 86, Math.sin(a) * 58, (a * 180) / Math.PI + 90] as const; });
  return (
    <g>
      <Bandera x={800} y={95} txt="¿escurridizo y peligroso a la vez?" color={S.menin[0]} p={p('escurridizo')} t={34} punta="no" />
      {[0, 1, 2, 3].map((i) => <Enterocito key={i} x={170 + i * 150} y={760} k={1} w={120} micro={0.6} />)}
      <Bandera x={330} y={900} txt="nasofaringe" color={S.nfkb[0]} p={p('coloniza')} t={26} punta="no" />
      <Vaso x={1230} y={600} largo={700} ancho={300} ang={0} reloj={reloj} flujo={8} o={tramo(p('sangre'), 0, 0.5)} />
      <Bandera x={1230} y={820} txt="la sangre" color={S.il1[0]} p={p('sangre')} t={26} punta="no" />
      <g opacity={tramo(p('delator'), 0, 0.5)} transform={`translate(${x},${y})`}>
        {spikes.map(([sx, sy, r], i) => <g key={i} transform={`translate(${sx * (1 + 0.5 * cap)},${sy * (1 + 0.5 * cap)}) rotate(${r})`}><path d="M0,-14 L10,9 L-10,9 Z" fill={S.lps[0]} /><path d="M0,-10 L7,6 L-7,6 Z" fill={S.lps[1]} /></g>)}
      </g>
      <Sale p={p('menin')} x={x} y={y} k={1.1 + 0.55 * cap}><Diplococo reloj={reloj} pili={p('pili')} capsula={p('capsula')} /></Sale>
      <Bandera x={330} y={430} txt="coloniza la nasofaringe pegado con sus pili" color={S.menin[0]} p={p('pili')} t={26} punta="no" />
      <Bandera x={760} y={420} txt="cruza la mucosa hacia la sangre" color={S.menin[0]} p={p('mucosa')} t={26} punta="no" />
      <Sale p={p('fagocitosis')} x={1420} y={430} k={0.8}><Neutrofilo /></Sale>
      <Bandera x={1250} y={170} txt="cápsula: protege de la fagocitosis y del complemento" color={S.menin[0]} p={p('capsula')} t={24} punta="no" />
      <Bandera x={1250} y={250} txt="LOS: el delator que dispara la inflamación" color={S.lps[0]} p={p('delator')} t={26} punta="no" />
      <Bandera x={800} y={955} txt="un escudo que lo esconde y un delator que lo traiciona" color={S.il6[0]} p={p('traiciona')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Patrones, Pamps, LipidoA, Relevo, Vesiculas, Damps, Familia, Meningococo];
export default LAMINAS;
