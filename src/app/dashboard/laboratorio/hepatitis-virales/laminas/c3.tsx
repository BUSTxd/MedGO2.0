'use client';
// Capítulo 3 · El hígado que trabaja: fisiología
//
// La fisiología hecha dibujos que se mueven: las dos puertas de sangre, el gradiente de oxígeno del acino, las dos transaminasas pasando un
// grupo amino, el ciclo glucosa-alanina con el músculo de la referencia, la fábrica de proteínas con sus relojes, el ciclo de los ácidos biliares
// con NTCP y BSEP (toros sobre tallos fucsia, como «membrana celular»), la cinta de la bilirrubina y un hígado que tolera.

import type { Lamina } from '../Lienzo';
import { Capsula, Corazon, Etiqueta, Flecha, Glucosa, Higado, Intestino, Levita, Linfo, Mitocondria, Nota, Reloj, Sale, Sombra, Suelo, TXH, Toro, Txt, Vaso, VirionB, Zoom, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo, Gota, Hematie } from '../Piezas';
import { Corre, Estrellada, Hepatocito, Kupffer, Triada, TuboCurvo } from '../Higado';

type P2 = [number, number];
const bez = (a: P2, c: P2, b: P2, u: number): P2 => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];

/** Una molécula pequeña: bola con su brillo y una etiqueta corta dentro. */
function Mol({ x, y, R = 30, tono, txt, p = 1, t = 22 }: { x: number; y: number; R?: number; tono: readonly string[]; txt?: string; p?: number; t?: number }) {
  if (p <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(0.6 + 0.4 * easeBack(clamp(p))).toFixed(3)})`} opacity={tramo(p, 0, 0.4)}>
      <circle r={R} fill={tono[0]} transform="translate(3,5)" /><circle r={R} fill={tono[1]} />
      <circle cx={-R * 0.32} cy={-R * 0.34} r={R * 0.22} fill="#FFF" opacity={0.8} />
      {txt && <text dy="0.36em" textAnchor="middle" style={{ fontSize: t, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{txt}</text>}
    </g>
  );
}

// ─── 0 · Dos puertas de entrada ─────────────────────────────────────────────
const DosPuertas: Lamina = ({ p, reloj }) => {
  const porta = p('porta'), setenta = p('setenta'), intestino = p('intestino'), microbios = p('microbios'), arteria = p('arteria'), oxigeno = p('oxigeno'), mezcla = p('mezcla'), sale = p('sale'), comida = p('comida'), puertas = p('puertas');
  const A: P2 = [340, 300], CC: P2 = [560, 250], B: P2 = [660, 470];
  const A2: P2 = [1330, 300], C2: P2 = [1150, 250], B2: P2 = [960, 450];
  return (
    <g>
      <Suelo x={800} y={800} w={460} o={tramo(mezcla, 0, 0.5)} />
      <Sombra><Sale p={mezcla} x={800} y={540} k={1.15}><Higado corte={false} /></Sale></Sombra>
      <Sale p={intestino} x={200} y={290} k={0.62}><Intestino /></Sale>
      <TuboCurvo a={A} b={B} c={CC} w={46} tono={H.d} p={porta} />
      <Corre camino={(u) => bez(A, CC, B, u)} reloj={reloj} n={10} tono={['#C79A00', '#FFD23F']} R={8} o={tramo(comida, 0, 0.5)} sem={1} vel={0.00009} />
      <Corre camino={(u) => { const [x, y] = bez(A, CC, B, u); return [x + 6 * Math.sin(u * 20), y + 12]; }} reloj={reloj} n={6} tono={['#5A5068', '#9C92A8']} R={7} o={tramo(microbios, 0, 0.5)} sem={5} vel={0.00009} fase={0.07} />
      <Txt x={230} y={520} txt="vena porta" t={30} p={porta} color={TXH.d} />
      <Txt x={230} y={580} txt="≈ 75 % del flujo" t={38} p={setenta} color={TXH.d} />
      <Nota x={470} y={140} txt="nutrientes… y microbios" p={microbios} />
      <Sale p={arteria} x={1430} y={250} k={0.55}><Corazon /></Sale>
      <TuboCurvo a={A2} b={B2} c={C2} w={26} tono={H.sangre} p={arteria} />
      <Corre camino={(u) => bez(A2, C2, B2, u)} reloj={reloj} n={7} tono={['#9E0B2E', '#E3203F']} R={9} o={tramo(arteria, 0.3, 0.8)} sem={2} vel={0.00012} />
      <Corre camino={(u) => { const [x, y] = bez(A2, C2, B2, u); return [x, y - 16]; }} reloj={reloj} n={6} tono={['#2E9FD8', '#BFE9FF']} R={7} o={tramo(oxigeno, 0, 0.5)} sem={6} vel={0.00012} fase={0.05} />
      <Txt x={1400} y={520} txt="arteria hepática" t={30} p={arteria} color={TXH.sangre} />
      <Txt x={1400} y={580} txt="el resto, con más oxígeno" t={28} p={oxigeno} color={TXH.sangre} />
      <TuboCurvo a={[800, 690]} b={[800, 930]} w={46} tono={H.nucleo} p={sale} />
      <Corre camino={(u) => [800, lerp(700, 925, u)]} reloj={reloj} n={6} tono={['#9E0B2E', '#E3203F']} R={10} o={tramo(sale, 0.3, 0.9)} sem={3} vel={0.00012} />
      <Etiqueta x={1010} y={830} txt="sale por la vena central" color="#4A2A9E" p={sale} t={28} punta="izq" />
      <Etiqueta x={800} y={110} txt="una puerta de comida y una de aire" color="#8A3FD8" p={puertas} t={32} punta="no" />
      <Etiqueta x={800} y={680} txt="se mezclan en el sinusoide" color="#E3203F" p={mezcla} t={26} punta="no" />
    </g>
  );
};

// ─── 1 · La zonación: un gradiente de oxígeno ───────────────────────────────
const Zonacion: Lamina = ({ p, reloj }) => {
  const oxigeno = p('oxigeno'), zona1 = p('zona1'), zona3 = p('zona3'), wnt = p('wnt'), oficios = p('oficios');
  const glucosa = p('glucosa'), urea = p('urea'), bilis = p('bilis'), grasa = p('grasa'), citocromos = p('citocromos'), glutamina = p('glutamina');
  const L = 240, R = 1360;
  return (
    <g>
      <defs>
        <linearGradient id="hv-gz" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#FF7A66" /><stop offset="0.5" stopColor="#E8486A" /><stop offset="1" stopColor="#5A0A3A" />
        </linearGradient>
      </defs>
      {/* el acino como una banda: de la tríada a la vena central */}
      <g opacity={tramo(oxigeno, 0, 0.4)}>
        <rect x={L} y={400} width={R - L} height={230} rx={115} fill="#000" opacity={0.15} transform="translate(8,12)" />
        <rect x={L} y={400} width={R - L} height={230} rx={115} fill="url(#hv-gz)" />
        <Sale p={oxigeno} x={L - 40} y={515} k={0.7}><Triada reloj={reloj} /></Sale>
        <Sale p={oxigeno} x={R + 50} y={515} k={1}><circle r={60} fill="#3A1470" /><circle r={50} fill="#7A55D8" /><circle r={32} fill="#3A1470" /></Sale>
      </g>
      {/* el oxígeno se gasta: burbujas cada vez más escasas */}
      {Array.from({ length: 28 }, (_, i) => {
        const u = i / 28, X = lerp(L + 30, R - 30, u);
        const v = ((reloj / 2600 + hash(i, 4)) % 1), vis = (1 - u) ** 1.4;
        return <circle key={i} cx={X + 10 * Math.sin(v * 6)} cy={lerp(610, 430, v)} r={9} fill="#BFE9FF" opacity={tramo(oxigeno, 0, 0.5) * vis * Math.sin(v * Math.PI) * 0.9} />;
      })}
      <Etiqueta x={400} y={330} txt="zona 1 · mucho oxígeno" color="#FF7A66" p={zona1} t={28} punta="abajo" />
      <Etiqueta x={1200} y={330} txt="zona 3 · poco oxígeno" color="#B21E58" p={zona3} t={28} punta="abajo" />
      {/* lo que hace cada zona, cada cosa en su palabra */}
      <g opacity={tramo(glucosa, 0, 0.4)}><Glucosa x={300} y={760} k={0.55} /><Txt x={300} y={850} txt="glucosa nueva" t={24} p={glucosa} /></g>
      <Mol x={540} y={760} R={26} tono={['#0A7F96', '#16B9D6']} txt="urea" t={18} p={urea} /><Txt x={540} y={850} txt="ciclo de la urea" t={24} p={urea} />
      <g opacity={tramo(bilis, 0, 0.4)}><Gota x={760} y={758} k={0.75} tono={H.bilis} /><Txt x={760} y={850} txt="bilis" t={24} p={bilis} /></g>
      <Mol x={1010} y={760} R={26} tono={['#C79A00', '#FFD23F']} txt="" p={grasa} /><Txt x={1010} y={850} txt="glucólisis y grasa" t={24} p={grasa} />
      <Sale p={citocromos} x={1230} y={760} k={0.55}><Capsula tono={H.farma} reloj={reloj} /></Sale><Txt x={1230} y={850} txt="citocromos P450" t={24} p={citocromos} />
      <Mol x={1450} y={760} R={26} tono={['#7A3FB0', '#B58AE8']} txt="Gln" t={20} p={glutamina} /><Txt x={1450} y={850} txt="glutamina sintetasa" t={24} p={glutamina} />
      <Flecha a={[1360, 250]} b={[760, 250]} p={tramo(wnt, 0, 0.9)} color="#8A4FE8" w={8} c={[1060, 225]} />
      <Etiqueta x={1060} y={170} txt="Wnt / β-catenina mantiene el reparto" color="#8A4FE8" p={wnt} t={26} punta="abajo" />
      <Txt x={800} y={940} txt="mismo hepatocito, dos oficios" t={32} p={oficios} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · ALT y AST: dos enzimas que mueven aminoácidos ──────────────────────
const Transaminasas: Lamina = ({ p, reloj }) => {
  const transaminasas = p('transaminasas'), amino = p('amino'), b6 = p('b6'), alt = p('alt'), alanina = p('alanina'), ast = p('ast'), citosol = p('citosol'), mito = p('mitocondria'), escondites = p('escondites');
  const salto = (a: P2, b: P2, u: number): P2 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 70 * Math.sin(u * Math.PI)];
  const u1 = (reloj / 2400) % 1, u2 = ((reloj + 1200) / 2400) % 1;
  return (
    <g>
      <Hepatocito x={600} y={540} k={3.2} reloj={reloj} sem={2} o={tramo(transaminasas, 0, 0.4)} />
      <Etiqueta x={600} y={110} txt="transaminasas" color="#E04AB0" p={transaminasas} t={34} punta="no" />
      {/* ALT en el citosol: alanina + α-cetoglutarato → piruvato + glutamato */}
      <g opacity={tramo(alt, 0, 0.4)}>
        <Mol x={400} y={420} R={36} tono={['#138A3A', '#3FD467']} txt="Ala" p={alanina} />
        <Mol x={680} y={420} R={36} tono={['#B86A00', '#FFB02E']} txt="Pir" p={alt} />
        <Sale p={alt} x={540} y={420} k={1.15}>
          <rect x={-46} y={-30} width={92} height={60} rx={30} fill="#C79A00" transform="translate(3,5)" /><rect x={-46} y={-30} width={92} height={60} rx={30} fill="#F2B21E" />
          <text dy="0.36em" textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>ALT</text>
        </Sale>
        <Mol x={400} y={570} R={30} tono={['#5A22A8', '#8A4FE8']} txt="α-KG" t={17} p={alt} /><Mol x={680} y={570} R={30} tono={['#7A3FB0', '#B58AE8']} txt="Glu" t={19} p={alt} />
        {amino > 0.02 && <g transform={`translate(${salto([410, 420], [410, 570], u1).map((v) => v.toFixed(1)).join(',')})`} opacity={amino * Math.sin(u1 * Math.PI)}><circle r={14} fill="#FFF" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 14, fontWeight: 800, fill: '#B01E8A', fontFamily: 'inherit' }}>NH₂</text></g>}
      </g>
      <Nota x={540} y={320} txt="en el citosol" p={citosol} />
      <Sale p={b6} x={200} y={250} k={0.8}><path d="M0,-34 L30,-17 L30,17 L0,34 L-30,17 L-30,-17 Z" fill="#0A7F96" /><path d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z" fill="#16B9D6" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>B6</text></Sale>
      <Txt x={200} y={314} txt="vitamina B6" t={22} p={b6} />
      {/* AST sobre todo en la mitocondria: aspartato + α-cetoglutarato → oxaloacetato + glutamato */}
      <g opacity={tramo(ast, 0, 0.4)}>
        <Sale p={mito} x={800} y={650} k={0.34}><Mitocondria reloj={reloj} /></Sale>
        <Zoom x={1260} y={560} R={270} de={[800, 650]} p={mito} fondo="#FFE9F2"><Mitocondria x={1260} y={560} k={0.95} reloj={reloj} /></Zoom>
        <Sale p={ast} x={1260} y={540} k={0.95}>
          <rect x={-44} y={-28} width={88} height={56} rx={28} fill="#B86A00" transform="translate(3,5)" /><rect x={-44} y={-28} width={88} height={56} rx={28} fill="#FF8A1E" />
          <text dy="0.36em" textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>AST</text>
        </Sale>
        {amino > 0.02 && <g transform={`translate(${salto([1160, 620], [1340, 620], u2).map((v) => v.toFixed(1)).join(',')})`} opacity={amino * Math.sin(u2 * Math.PI)}><circle r={14} fill="#FFF" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 14, fontWeight: 800, fill: '#B01E8A', fontFamily: 'inherit' }}>NH₂</text></g>}
        <Mol x={1150} y={640} R={26} tono={['#8C1E40', '#E5324C']} txt="Asp" t={18} p={ast} /><Mol x={1370} y={640} R={26} tono={['#C25A00', '#FF8A1E']} txt="OAA" t={16} p={ast} />
      </g>
      <Nota x={1260} y={870} txt="en la mitocondria (≈ 80 %) y en el citosol" p={mito} />
      <Etiqueta x={640} y={940} txt="dos enzimas, dos escondites" color="#8A3FD8" p={escondites} t={32} punta="no" />
    </g>
  );
};

// ─── 3 · El ciclo glucosa-alanina ───────────────────────────────────────────
const GlucosaAlanina: Lamina = ({ p, reloj }) => {
  const musculo = p('musculo'), alanina = p('alanina'), higado = p('higado'), piruvato = p('piruvato'), glucosa = p('glucosa'), amoniaco = p('amoniaco'), urea = p('urea'), especifica = p('especifica');
  const fibra = (i: number) => (
    <g key={i} transform={`translate(${180 + i * 118},${540 - i * 26}) rotate(-62)`}>
      <rect x={-210} y={-40} width={420} height={80} rx={40} fill="#8C0F55" transform="translate(4,6)" /><rect x={-210} y={-40} width={420} height={80} rx={40} fill="#E8328C" />
      <rect x={-200} y={-34} width={400} height={30} rx={15} fill="#FF6AB0" opacity={0.55} />
      {Array.from({ length: 9 }, (_, j) => <rect key={j} x={-180 + j * 44} y={26} width={10} height={20} rx={5} fill="#FF6AB0" />)}
      <ellipse cx={-60 + i * 30} cy={4} rx={22} ry={11} fill="#7FE8F8" /><ellipse cx={-60 + i * 30} cy={4} rx={10} ry={5} fill="#FFE98A" />
    </g>
  );
  return (
    <g>
      <g opacity={tramo(musculo, 0, 0.4)}>{[0, 1, 2, 3].map(fibra)}</g>
      <Etiqueta x={300} y={870} txt="músculo" color="#E8328C" p={musculo} t={32} punta="no" />
      <Sale p={higado} x={1180} y={520} k={2.3}><Hepatocito reloj={reloj} sem={4} /></Sale>
      {/* la alanina viaja por la sangre al hígado y la glucosa vuelve */}
      <TuboCurvo a={[560, 380]} b={[960, 400]} c={[760, 330]} w={30} tono={H.sangre} p={alanina} />
      <Corre camino={(u) => bez([560, 380], [760, 330], [960, 400], u)} reloj={reloj} n={5} tono={['#138A3A', '#3FD467']} R={13} o={tramo(alanina, 0.2, 0.7)} sem={3} vel={0.00009} />
      <Etiqueta x={760} y={280} txt="alanina" color="#138A3A" p={alanina} t={28} punta="abajo" />
      <TuboCurvo a={[960, 680]} b={[560, 700]} c={[760, 760]} w={30} tono={H.sangre} p={glucosa} />
      <Corre camino={(u) => bez([960, 680], [760, 760], [560, 700], u)} reloj={reloj} n={5} tono={['#C79A00', '#FFD23F']} R={13} o={tramo(glucosa, 0.2, 0.7)} sem={4} vel={0.00009} />
      <Etiqueta x={760} y={810} txt="glucosa nueva" color="#C79A00" p={glucosa} t={28} punta="arriba" />
      <Mol x={1100} y={470} R={30} tono={['#B86A00', '#FFB02E']} txt="Pir" p={piruvato} />
      <Sale p={glucosa} x={1230} y={470} k={0.7}><Glucosa /></Sale>
      <Etiqueta x={1100} y={380} txt="ALT" color="#C79A00" p={piruvato} t={26} punta="abajo" />
      <Mol x={1100} y={580} R={26} tono={['#0A7F96', '#16B9D6']} txt="NH₃" t={16} p={amoniaco} />
      <Sale p={urea} x={1330} y={600} k={1}>
        <path d="M-50,0 A50,50 0 1 1 0,50" fill="none" stroke="#16B9D6" strokeWidth={10} strokeLinecap="round" /><path d="M-8,36 L8,52 L-10,64" fill="none" stroke="#16B9D6" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </Sale>
      <Txt x={1330} y={690} txt="ciclo de la urea" t={26} p={urea} color={TXH.c} />
      <Etiqueta x={1180} y={900} txt="la ALT es la más específica del hígado" color="#E04AB0" p={especifica} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · La fábrica de proteínas ────────────────────────────────────────────
const Fabrica: Lamina = ({ p, reloj }) => {
  const fabrica = p('fabrica'), albumina = p('albumina'), dias = p('dias'), coag = p('coagulacion'), vitk = p('vitk'), siete = p('siete'), horas = p('horas'), guarda = p('guarda');
  const sube = (i: number, x: number, color: readonly string[], n: number, txt: (j: number) => string, q: number) => Array.from({ length: n }, (_, j) => {
    const u = ((reloj / 3400 + j / n + i * 0.13) % 1);
    return (
      <g key={`${i}-${j}`} opacity={tramo(q, 0, 0.4) * Math.sin(u * Math.PI)} transform={`translate(${x + 24 * Math.sin(u * 5 + j)},${lerp(330, 110, u)})`}>
        <circle r={22} fill={color[0]} transform="translate(2,4)" /><circle r={22} fill={color[1]} /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 17, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{txt(j)}</text>
      </g>
    );
  });
  return (
    <g>
      <Hepatocito x={640} y={650} k={2.6} reloj={reloj} sem={6} o={tramo(fabrica, 0, 0.4)} />
      {/* tres chimeneas */}
      {[360, 640, 920].map((x, i) => <g key={i} opacity={tramo(fabrica, 0.2, 0.8)}><rect x={x - 38} y={330} width={76} height={150} rx={14} fill="#6A3F5A" transform="translate(4,6)" /><rect x={x - 38} y={330} width={76} height={150} rx={14} fill="#9C6A8A" /><rect x={x - 38} y={330} width={76} height={26} rx={10} fill="#C490B4" /></g>)}
      {sube(0, 360, ['#1F6FB0', '#3AA7E0'], 4, () => 'alb', albumina)}
      {sube(1, 640, ['#B0102A', '#E3203F'], 4, (j) => ['II', 'VII', 'IX', 'X'][j], coag)}
      {sube(2, 920, ['#7A3FB0', '#B58AE8'], 4, (j) => ['C3', 'CRP', 'fib', 'C4'][j], fabrica)}
      <Txt x={360} y={60} txt="albúmina" t={28} p={albumina} color={TXH.colageno} />
      <Txt x={640} y={60} txt="coagulación" t={28} p={coag} color={TXH.sangre} />
      <Txt x={920} y={60} txt="fibrinógeno" t={28} p={fabrica} color={TXH.d} />
      <Txt x={920} y={96} txt="y complemento" t={24} p={fabrica} color={TXH.d} fuerte={false} />
      {/* vitamina K */}
      <Sale p={vitk} x={170} y={560} k={1}><path d="M0,-70 C60,-60 60,20 0,70 C-60,20 -60,-60 0,-70 Z" fill="#138A3A" transform="translate(4,6)" /><path d="M0,-70 C60,-60 60,20 0,70 C-60,20 -60,-60 0,-70 Z" fill="#3FD467" /><path d="M0,-56 L0,56" stroke="#138A3A" strokeWidth={5} strokeLinecap="round" /></Sale>
      <Txt x={170} y={680} txt="vitamina K" t={28} p={vitk} color={TXH.c} />
      <Flecha a={[250, 540]} b={[400, 560]} c={[320, 500]} p={tramo(vitk, 0.3, 1)} color="#3FD467" w={7} />
      {/* los relojes: el factor VII dura horas; la albúmina, días */}
      <Reloj x={1230} y={380} k={1.6} ang={(reloj / 120) % 360} tono={['#B0102A', '#E3203F', '#FFE9F0']} o={tramo(siete, 0, 0.4)} />
      <Etiqueta x={1230} y={540} txt="factor VII: 4 a 6 horas" color="#E3203F" p={horas} t={28} punta="arriba" />
      <Reloj x={1230} y={730} k={1.0} ang={(reloj / 3000) % 360} tono={['#1F6FB0', '#3AA7E0', '#E8F6FF']} o={tramo(dias, 0, 0.4)} />
      <Etiqueta x={1230} y={850} txt="albúmina: unos 20 días" color="#1F6FB0" p={dias} t={28} punta="arriba" />
      <Txt x={620} y={950} txt="guarda ese dato" t={30} p={guarda} color={TXH.sangre} />
    </g>
  );
};

// ─── 5 · Ácidos biliares y circulación enterohepática ───────────────────────
const Biliares: Lamina = ({ p, reloj }) => {
  const colesterol = p('colesterol'), conjuga = p('conjuga'), ntcp = p('ntcp'), bsep = p('bsep'), ileon = p('ileon'), porta = p('porta'), virus = p('virus');
  const G: P2 = [1250, 330], P0: P2 = [1110, 330], P1: P2 = [700, 500];
  return (
    <g>
      <Vaso x={170} y={520} largo={720} ancho={90} ang={90} pared={20} reloj={reloj} flujo={6} o={tramo(ntcp, 0, 0.4)} />
      <Hepatocito x={520} y={520} k={2.1} reloj={reloj} sem={5} />
      <Mol x={470} y={470} R={26} tono={['#C79A00', '#FFD23F']} txt="col" t={18} p={colesterol} />
      <Mol x={560} y={560} R={26} tono={['#5A6A12', '#9AAE22']} txt="AB" t={18} p={colesterol} />
      <Mol x={620} y={470} R={14} tono={['#0A7F96', '#16B9D6']} p={conjuga} /><Mol x={650} y={500} R={14} tono={['#8A4FE8', '#B58AE8']} p={conjuga} />
      <Txt x={640} y={400} txt="+ taurina o glicina" t={24} p={conjuga} />
      {/* NTCP del lado de la sangre y BSEP del lado del canalículo */}
      <Sale p={ntcp} x={335} y={520} k={0.9} r={90}><Toro reloj={reloj} bombea={ntcp} tallo={50} /></Sale>
      <Etiqueta x={335} y={650} txt="NTCP" color="#2F55E0" p={ntcp} t={30} punta="arriba" />
      <Sale p={bsep} x={720} y={520} k={0.9} r={-90}><Toro reloj={reloj} bombea={bsep} tallo={50} tono={H.nk} /></Sale>
      <Etiqueta x={720} y={650} txt="BSEP" color="#9AAE22" p={bsep} t={30} punta="arriba" />
      <TuboCurvo a={[790, 520]} b={P0} c={[950, 440]} w={26} tono={H.bilis} p={bsep} />
      <Corre camino={(u) => bez([790, 520], [950, 440], P0, u)} reloj={reloj} n={5} tono={H.bilis} R={9} o={tramo(bsep, 0.3, 0.8)} sem={2} vel={0.0001} />
      {/* el íleon los reabsorbe y la porta los devuelve */}
      <Sale p={ileon} x={1330} y={300} k={0.85}><Intestino /></Sale>
      <Etiqueta x={1330} y={170} txt="íleon: reabsorbe casi todos" color="#9AAE22" p={ileon} t={26} punta="abajo" />
      <TuboCurvo a={[1250, 460]} b={[520, 830]} c={[1100, 830]} w={34} tono={H.d} p={porta} />
      <Corre camino={(u) => bez([1250, 460], [1100, 830], [520, 830], u)} reloj={reloj} n={7} tono={H.bilis} R={9} o={tramo(porta, 0.3, 0.8)} sem={3} vel={0.00009} />
      <Txt x={900} y={920} txt="la vena porta los devuelve al hígado" t={28} p={porta} color={TXH.d} />
      {/* el virus B espía la puerta */}
      <Sale p={virus} x={150} y={780} k={0.5}><VirionB reloj={reloj} /></Sale>
      <Flecha a={[200, 760]} b={[300, 600]} c={[190, 640]} p={virus} color="#2F55E0" w={6} />
      <Etiqueta x={300} y={880} txt="será la puerta del virus B" color="#2F55E0" p={virus} t={28} punta="no" />
    </g>
  );
};

// ─── 6 · La bilirrubina en un paso ──────────────────────────────────────────
const Bilirrubina: Lamina = ({ p, reloj }) => {
  const hemo = p('hemo'), albumina = p('albumina'), capta = p('capta'), ugt = p('ugt'), mrp2 = p('mrp2'), intestino = p('intestino'), estercobilina = p('estercobilina'), detalle = p('detalle');
  const X = [210, 600, 1000, 1390];
  const nombres = ['hemo', 'no conjugada + albúmina', 'conjugación', 'a la bilis'];
  const luces = [hemo, albumina, ugt, mrp2];
  return (
    <g>
      <rect x={110} y={512} width={1380} height={22} rx={11} fill="#000" opacity={0.12} transform="translate(6,8)" />
      <rect x={110} y={512} width={1380} height={22} rx={11} fill="#B8A8D8" opacity={0.7} />
      {/* 1 · la destrucción de los glóbulos rojos libera el hemo */}
      <Sale p={hemo} x={X[0] - 20} y={350} k={1.5}><Hematie /></Sale>
      <Sale p={hemo} x={X[0] + 110} y={320} k={1}><circle r={26} fill="none" stroke="#8C1E40" strokeWidth={12} /><circle r={7} fill="#C79A00" /></Sale>
      {/* 2 · bilirrubina no conjugada viaja unida a la albúmina */}
      <Sale p={albumina} x={X[1] - 50} y={350} k={1.4}><Gota tono={H.biliI} /></Sale>
      <Sale p={albumina} x={X[1] + 70} y={350} k={1.35}><circle r={46} fill="#1F6FB0" /><circle cx={-3} cy={-3} r={40} fill="#3AA7E0" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>alb</text></Sale>
      {/* 3 · el hepatocito la capta y UGT1A1 le une ácido glucurónico */}
      <Sale p={capta} x={X[2]} y={340} k={1.25}><Hepatocito reloj={reloj} sem={3} /></Sale>
      <Sale p={ugt} x={X[2] - 8} y={340} k={1.1}><rect x={-40} y={-24} width={80} height={48} rx={24} fill="#C79A00" transform="translate(3,4)" /><rect x={-40} y={-24} width={80} height={48} rx={24} fill="#F2B21E" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 17, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>UGT1A1</text></Sale>
      <Sale p={ugt} x={X[2] + 100} y={400} k={1.3}><Gota tono={H.biliD} /></Sale>
      {/* 4 · MRP2 la saca al canalículo: el paso limitante */}
      <Sale p={mrp2} x={X[3] - 30} y={350} k={1.3} r={90}><Toro reloj={reloj} bombea={mrp2} tallo={50} /></Sale>
      <Corre camino={(u) => [lerp(X[3] - 120, X[3] + 60, u), 360 + 90 * u]} reloj={reloj} n={4} tono={H.biliD} R={9} o={tramo(mrp2, 0.3, 0.8)} sem={2} vel={0.0001} />
      {X.map((x, i) => (
        <g key={i} opacity={tramo(luces[i], 0, 0.4)}>
          <circle cx={x} cy={523} r={25} fill={['#8C1E40', '#C79A00', '#F2B21E', '#9AAE22'][i]} /><circle cx={x} cy={523} r={25} fill="none" stroke="#FFF" strokeWidth={7} />
          <text x={x} y={523} dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{i + 1}</text>
          <Txt x={x} y={590} txt={nombres[i]} t={26} p={luces[i]} />
        </g>
      ))}
      {/* en el intestino: urobilinógeno y estercobilina */}
      <Sale p={intestino} x={1000} y={780} k={0.6}><Intestino /></Sale>
      <Txt x={1000} y={900} txt="urobilinógeno" t={28} p={intestino} color={TXH.biliI} />
      <Mol x={1300} y={780} R={34} tono={['#6A3F1E', '#B07A44']} p={estercobilina} />
      <Txt x={1300} y={870} txt="estercobilina · heces" t={28} p={estercobilina} />
      <Flecha a={[1090, 780]} b={[1250, 780]} p={tramo(estercobilina, 0, 0.7)} color="var(--cit-flecha)" w={7} />
      <Etiqueta x={400} y={780} txt="el detalle: laboratorio de bilirrubina" color="#E0A100" p={detalle} t={26} punta="no" />
    </g>
  );
};

// ─── 7 · Un hígado que tolera ───────────────────────────────────────────────
const Tolera: Lamina = ({ p, reloj }) => {
  const porta = p('porta'), antigenos = p('antigenos'), kupffer = p('kupffer'), il10 = p('il10'), linfocito = p('linfocito'), tolerancia = p('tolerancia'), virus = p('virus');
  const dorm = tramo(tolerancia, 0, 1);
  return (
    <g>
      <Vaso x={800} y={300} largo={1700} ancho={250} ang={0} pared={26} reloj={reloj} flujo={5} o={tramo(porta, 0, 0.4)} />
      {/* antígenos de la dieta y de la microbiota que llegan por la porta */}
      {Array.from({ length: 9 }, (_, i) => {
        const X = ((hash(i, 9) * 1700 + reloj * 0.05) % 1800) - 100, Y = 240 + hash(i, 10) * 120;
        return (
          <g key={i} transform={`translate(${X.toFixed(0)},${(Y + 8 * onda(reloj, 1800, i)).toFixed(0)}) rotate(${(i * 40 + reloj / 30) % 360})`} opacity={tramo(antigenos, 0, 0.5)}>
            {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={0} y1={0} x2={18} y2={0} stroke="#5A5068" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />)}
            <circle r={11} fill="#6E6478" /><circle cx={-3} cy={-3} r={8.4} fill="#9C92A8" />
          </g>
        );
      })}
      <Txt x={300} y={110} txt="antígenos de la dieta y de la microbiota" t={28} p={antigenos} />
      <Sale p={kupffer} x={800} y={440} k={1.4}><Kupffer reloj={reloj} /></Sale>
      <Txt x={800} y={560} txt="Kupffer y endotelio" t={28} p={kupffer} color={TXH.kupffer} />
      {/* interleucina 10: señales calmantes */}
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((reloj / 2600 + i / 6) % 1);
        return <g key={i} transform={`translate(${(800 + (i - 2.5) * 70 + 14 * Math.sin(u * 7)).toFixed(0)},${lerp(430, 640, u).toFixed(0)})`} opacity={tramo(il10, 0, 0.4) * Math.sin(u * Math.PI)}><path d="M-14,0 Q-7,-11 0,0 T14,0" fill="none" stroke="#3FD467" strokeWidth={5} strokeLinecap="round" /></g>;
      })}
      <Etiqueta x={1050} y={520} txt="interleucina 10" color="#138A3A" p={il10} t={26} punta="izq" />
      {/* el linfocito T que se activa aquí tiende a la tolerancia */}
      <Sale p={linfocito} x={800} y={760} k={1.5}><Linfo reloj={reloj} agotado={dorm} activo={0.4 * (1 - dorm)} /></Sale>
      {dorm > 0.2 && ['z', 'Z', 'z'].map((z, i) => <text key={i} x={880 + i * 26 + ((reloj / 30) % 40)} y={700 - i * 38} style={{ fontSize: 36 + i * 10, fontWeight: 800, fill: 'var(--hv-gris)', opacity: dorm * (0.8 - i * 0.2) }}>{z}</text>)}
      <Txt x={800} y={880} txt="tolerancia" t={36} p={tolerancia} color={TXH.gris} />
      {/* y el virus se queda */}
      <Sale p={virus} x={1330} y={740} k={0.8}><VirionB reloj={reloj} /></Sale>
      <Etiqueta x={1330} y={880} txt="el virus puede quedarse" color="#2F55E0" p={virus} t={26} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosPuertas, Zonacion, Transaminasas, GlucosaAlanina, Fabrica, Biliares, Bilirrubina, Tolera];
export default LAMINAS;
