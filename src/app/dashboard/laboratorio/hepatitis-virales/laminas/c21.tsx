'use client';
// Capítulo 21 · Crioglobulinemia y lo extrahepático
//
// E2 se pega al CD81 del linfocito B y lo estimula sin parar: nacen clones que fabrican IgM con actividad de factor reumatoide; los tres tipos de
// crioglobulinas; el frío que las precipita (y por qué la muestra debe viajar a 37 °C); el complemento con el C4 consumido y el C3 casi normal; la
// vasculitis de vasos pequeños con su púrpura; el riñón y los nervios; y las otras caras del virus (linfoma, liquen plano, porfiria, insulina).

import type { Lamina } from '../Lienzo';
import { Tijera, tijeretazo } from '../../bilirrubina/Piezas';
import { Complejo, Nervio } from '../../vasculitis-anca/Piezas';
import { Anticuerpo, Busto, Etiqueta, Flecha, Glomerulo, Globo, Jeringa, Linfo, Neutrofilo, PiernaPurpura, Sale, Sombra, Termometro, TXH, TuboEnsayo, Txt, VirionC, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { FrascoOrina } from '../Clinica';
import { Fact, Hilo, Luz, Tacha, Tachon, Tumor, Visto } from '../Extras';

type P2 = [number, number];
const COLORES = [H.ac, H.cd4, H.nk, H.cd8, H.a, H.d] as const;

/** Una IgM: un pentámero en forma de estrella (cinco «Y» alrededor de un centro). */
function Pentamero({ x, y, k = 1, o = 1, r = 0, col = '#E8841E', oscuro = '#A85A00' }: { x: number; y: number; k?: number; o?: number; r?: number; col?: string; oscuro?: string }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r}) scale(${k})`} opacity={o}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * 360;
        return <g key={i} transform={`rotate(${a})`}><path d="M0,0 L0,-34 M0,-34 L-14,-52 M0,-34 L14,-52" stroke={oscuro} strokeWidth={9} strokeLinecap="round" fill="none" transform="translate(2,3)" /><path d="M0,0 L0,-34 M0,-34 L-14,-52 M0,-34 L14,-52" stroke={col} strokeWidth={8} strokeLinecap="round" fill="none" /></g>;
      })}
      <circle r={17} fill={oscuro} /><circle cx={-1.5} cy={-1.5} r={14} fill={col} /><circle cx={-5} cy={-5} r={4} fill="#FFF" opacity={0.7} />
    </g>
  );
}

// ─── 0 · El virus y el linfocito B ──────────────────────────────────────────
const LinfoB: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), e2 = p('e2'), une = p('une'), cd81 = p('cd81'), linfocitos = p('linfocitos'), cronica = p('cronica'), policlonal = p('policlonal'), expanden = p('expanden'), clones = p('clones'), igm = p('igm'), actividad = p('actividad'), factor = p('factor'), igm2 = p('igm2'), cola = p('cola'), igg = p('igg'), habla = p('habla');
  const lleva = easeOut(une);
  const pulso = 1 + 0.04 * Math.sin(reloj / 200) * tramo(cronica, 0, 0.3);
  return (
    <g>
      <Globo x={640} y={85} txt="¿qué tiene que ver el virus C con un linfocito B?" t={32} p={pregunta} colaX={0} />
      <VirionC x={240} y={400} k={1.3} reloj={reloj} />
      <Etiqueta x={240} y={540} txt="E2" color="#14B870" p={e2} t={28} punta="no" />
      <Linfo x={640} y={400} k={2.0 * pulso} tono={H.ac} reloj={reloj} activo={0.5 * tramo(cronica, 0, 0.4)} o={tramo(linfocitos, 0, 0.4)} />
      <Etiqueta x={640} y={560} txt="linfocito B" color="#6A9A00" p={linfocitos} t={28} punta="no" />
      <g opacity={tramo(cd81, 0, 0.4)}><ellipse cx={510} cy={400} rx={22} ry={34} fill="none" stroke="#FF8A1E" strokeWidth={9} /></g>
      <Etiqueta x={500} y={470} txt="CD81" color="#C25A00" p={cd81} t={24} punta="no" />
      <g opacity={tramo(une, 0, 0.3)}><line x1={lerp(330, 480, lleva)} y1={400} x2={lerp(300, 460, lleva)} y2={400} stroke="#0B7A4A" strokeWidth={8} strokeLinecap="round" /><circle cx={lerp(340, 490, lleva)} cy={400} r={15} fill="#14B870" /></g>
      <Txt x={400} y={250} txt="se une" t={26} p={une} color={TXH.c} />
      <Txt x={640} y={625} txt="los estimula de forma crónica" t={26} p={cronica} color={TXH.hep} /><Txt x={640} y={667} txt="y policlonal" t={26} p={policlonal} color={TXH.hep} />
      {/* se expanden clones, cada uno con su color */}
      {[0, 1, 2, 3].map((i) => <Linfo key={i} x={980 + (i % 2) * 130} y={280 + Math.floor(i / 2) * 130} k={0.95} tono={COLORES[i]} reloj={reloj} fase={i} o={tramo(expanden, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={1045} y={170} txt="se expanden clones" color="#8A4FE8" p={Math.max(expanden, clones)} t={26} punta="no" />
      {[0, 1, 2].map((i) => { const f = ((reloj / 1700 + i / 3) % 1); return <Pentamero key={i} x={lerp(1150, 1300, f) + 30 * i} y={lerp(340, 560, f)} k={0.45} o={tramo(igm, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      {/* IgM con actividad de factor reumatoide: contra la cola de las IgG */}
      <Pentamero x={650} y={775} k={1.3} o={tramo(igm, 0, 0.4)} r={reloj / 80} />
      <Etiqueta x={650} y={875} txt="IgM" color="#E8841E" p={igm} t={28} punta="no" />
      <Txt x={650} y={925} txt="con actividad de factor reumatoide" t={26} p={Math.max(actividad, factor)} color={TXH.a} />
      <Anticuerpo x={1050} y={775} k={2.2} o={tramo(igg, 0, 0.4)} />
      <Hilo a={[750, 780]} b={[1038, 825]} p={cola} color="#E8841E" />
      <Txt x={1050} y={885} txt="una IgM dirigida contra la cola" t={24} p={Math.max(igm2, cola)} color={TXH.a} /><Etiqueta x={1050} y={935} txt="de las IgG" color="#6A9A00" p={igg} t={24} punta="no" />
      <Txt x={1230} y={980} txt="el virus del hígado habla con el sistema inmune" t={30} p={habla} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Los tres tipos de crioglobulinas ───────────────────────────────────
const Tipos: Lamina = ({ p, reloj }) => {
  const iguales = p('iguales'), tipo1 = p('tipo1'), inmunoglobulina = p('inmunoglobulina'), mono1 = p('mono1'), tipo2 = p('tipo2'), igm = p('igm'), mono2 = p('mono2'), igg = p('igg'), poli = p('poli'), tipo3 = p('tipo3'), igm3 = p('igm3'), poli3 = p('poli3'), igg3 = p('igg3'), vhc = p('vhc'), produce = p('produce'), t23 = p('t23'), t3 = p('t3'), tres = p('tres'), idea = p('idea');
  const ig = (n: number, x: number, y: number, mono: boolean, q: number, igM: boolean) => Array.from({ length: n }, (_, i) => {
    const px = x - 90 + (i % 3) * 90, py = y + Math.floor(i / 3) * 90 + 6 * onda(reloj, 1700, i), tono = mono ? H.ac : COLORES[i % COLORES.length];
    return igM ? <Pentamero key={i} x={px} y={py} k={0.62} o={tramo(q, i * 0.1, i * 0.1 + 0.4)} col={mono ? '#E8841E' : (tono[1] as string)} oscuro={mono ? '#A85A00' : (tono[0] as string)} /> : <Anticuerpo key={i} x={px} y={py} k={1.0} tono={tono} o={tramo(q, i * 0.1, i * 0.1 + 0.4)} />;
  });
  return (
    <g>
      <Txt x={800} y={95} txt="todas las crioglobulinas no son iguales" t={36} p={iguales} color={TXH.hep} />
      {[300, 800, 1300].map((x, i) => <Sale key={i} p={[tipo1, tipo2, tipo3][i]} x={x} y={640} k={0.8}><TuboEnsayo color={['#A8DC1E', '#E8A81E', '#6EC8F5'][i]} nivel={0.55} reloj={reloj} /></Sale>)}
      <Etiqueta x={300} y={190} txt="tipo 1" color="#6A9A00" p={tipo1} t={34} punta="no" /><Etiqueta x={800} y={190} txt="tipo 2" color="#C77800" p={tipo2} t={34} punta="no" /><Etiqueta x={1300} y={190} txt="tipo 3" color="#2A7FB0" p={tipo3} t={34} punta="no" />
      {ig(6, 300, 290, true, Math.max(inmunoglobulina, mono1), false)}
      {ig(3, 800, 290, true, igm, true)}{ig(3, 800, 410, false, igg, false)}
      {ig(3, 1300, 290, false, igm3, true)}{ig(3, 1300, 410, false, igg3, false)}
      <Txt x={300} y={830} txt="una sola inmunoglobulina" t={24} p={inmunoglobulina} color={TXH.ac} /><Txt x={300} y={870} txt="monoclonal" t={26} p={mono1} color={TXH.ac} />
      <Txt x={800} y={830} txt="IgM monoclonal" t={24} p={mono2} color={TXH.a} /><Txt x={800} y={870} txt="con IgG policlonal" t={24} p={poli} color={TXH.a} />
      <Txt x={1300} y={830} txt="IgM policlonal" t={24} p={poli3} color={TXH.b} /><Txt x={1300} y={870} txt="con IgG policlonal" t={24} p={Math.max(igg3, poli3)} color={TXH.b} />
      {/* la hepatitis C produce sobre todo los tipos 2 y 3 */}
      <VirionC x={110} y={950} k={0.42} reloj={reloj} o={tramo(vhc, 0, 0.4)} />
      <Txt x={560} y={955} txt="la hepatitis C produce sobre todo los tipos 2 y 3" t={26} p={Math.max(produce, vhc)} color={TXH.c} />
      <g opacity={tramo(t23, 0, 0.3)}><circle cx={800} cy={190} r={74} fill="none" stroke="#14B870" strokeWidth={8} strokeDasharray="12 8" /></g>
      <g opacity={tramo(t3, 0, 0.3)}><circle cx={1300} cy={190} r={74} fill="none" stroke="#14B870" strokeWidth={8} strokeDasharray="12 8" /></g>
      <Txt x={1360} y={950} txt="3 tipos, una misma idea" t={30} p={Math.max(tres, idea)} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Por qué se manchan las piernas con el frío ─────────────────────────
const Frio: Lamina = ({ p, reloj }) => {
  const manchan = p('manchan'), piernas = p('piernas'), frio = p('frio'), complejos = p('complejos'), igm = p('igm'), igg = p('igg'), virus = p('virus'), precipitan = p('precipitan'), debajo = p('debajo'), t37 = p('t37'), redisuelven = p('redisuelven'), calentarse = p('calentarse'), zonas = p('zonas'), articulaciones = p('articulaciones'), depositan = p('depositan'), vasos = p('vasos'), muestra = p('muestra'), mantenerse = p('mantenerse'), t37b = p('t37b'), enfria = p('enfria'), falso = p('falso'), negativo = p('negativo'), frio2 = p('frio2'), visibles = p('visibles');
  const prec = easeOut(Math.max(precipitan, debajo)) * (1 - easeOut(Math.max(redisuelven, calentarse))), temp = 37 - 17 * prec;
  const manchas = easeOut(Math.max(depositan, vasos)), frioPiel = easeOut(Math.max(frio, zonas, articulaciones));
  return (
    <g>
      <Txt x={600} y={90} txt="¿por qué se manchan las piernas con el frío?" t={34} p={Math.max(manchan, piernas, frio)} color={TXH.hep} />
      {/* el tubo en el baño: precipita por debajo de 37 grados y se redisuelve al calentarse */}
      <rect x={120} y={300} width={440} height={420} rx={50} fill={mezclaHex('#FFD8B0', '#9FD4FF', prec)} opacity={0.55} /><rect x={120} y={300} width={440} height={420} rx={50} fill="none" stroke={mezclaHex('#FF8A1E', '#2F8FE8', prec)} strokeWidth={8} />
      <TuboEnsayo x={340} y={520} k={1.0} color="#F5E8D8" nivel={0.7} reloj={reloj} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={300 + (i % 4) * 26 + 6 * Math.sin(reloj / 600 + i)} cy={560 + Math.floor(i / 4) * 24} r={9} fill="#FFF" opacity={prec * (0.5 + 0.5 * hash(i, 4))} />)}
      <Termometro x={490} y={560} k={0.5} val={0.35 + 0.35 * (temp - 20) / 17} />
      <Txt x={470} y={680} txt={`${Math.round(temp)} °C`} t={28} p={Math.max(t37, precipitan, debajo)} color={TXH.hep} />
      <Etiqueta x={340} y={240} txt="complejos" color="#B8237A" p={complejos} t={28} punta="no" />
      <Etiqueta x={170} y={770} txt="IgM" color="#E8841E" p={igm} t={24} punta="no" /><Etiqueta x={290} y={770} txt="IgG" color="#6A9A00" p={igg} t={24} punta="no" /><Etiqueta x={410} y={770} txt="virus" color="#14B870" p={virus} t={24} punta="no" />
      <Txt x={340} y={835} txt="precipitan por debajo de 37 grados" t={24} p={Math.max(precipitan, debajo)} color={TXH.b} /><Txt x={340} y={875} txt="y se redisuelven al calentarse" t={24} p={Math.max(redisuelven, calentarse)} color={TXH.a} />
      {/* las zonas frías: piernas, piel y articulaciones */}
      <PiernaPurpura x={1000} y={520} k={0.85} p={manchas} />
      <circle cx={1000} cy={520} r={260} fill="#9FD4FF" opacity={0.18 * frioPiel} />
      <Etiqueta x={1000} y={215} txt="zonas frías" color="#2F8FE8" p={Math.max(frio2, zonas)} t={28} punta="no" />
      <Etiqueta x={760} y={700} txt="piernas" color="#B8237A" p={Math.max(piernas, zonas)} t={24} punta="no" /><Etiqueta x={1240} y={430} txt="piel" color="#C25A00" p={zonas} t={24} punta="no" /><Etiqueta x={1240} y={640} txt="articulaciones" color="#6A35A0" p={articulaciones} t={24} punta="no" />
      <Txt x={1000} y={830} txt="se depositan en los vasos pequeños" t={26} p={Math.max(depositan, vasos)} color={TXH.hep} />
      {/* la muestra debe mantenerse a 37 grados */}
      <Txt x={1360} y={310} txt="la muestra debe mantenerse" t={24} p={muestra} color={TXH.c} /><Txt x={1360} y={350} txt="a 37 grados" t={26} p={Math.max(mantenerse, t37b)} color={TXH.c} />
      <Visto x={1360} y={420} k={0.8} p={Math.max(mantenerse, t37b)} />
      <Txt x={1360} y={730} txt="si se enfría antes" t={24} p={enfria} color={TXH.sangre} /><Txt x={1360} y={770} txt="puede dar un falso negativo" t={24} p={Math.max(falso, negativo)} color={TXH.sangre} /><Tacha x={1360} y={860} r={40} p={Math.max(falso, negativo)} />
      <Txt x={800} y={965} txt="el frío los hace visibles" t={38} p={Math.max(frio2, visibles)} color={TXH.hep} />
    </g>
  );
};

/** Mezcla de dos colores #rrggbb. */
function mezclaHex(a: string, b: string, q: number): string {
  const f = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  const m = (i: number) => Math.round(lerp(f(a, i), f(b, i), clamp(q))).toString(16).padStart(2, '0');
  return `#${m(0)}${m(1)}${m(2)}`;
}

// ─── 3 · El C4 baja y el C3 no ──────────────────────────────────────────────
const Complemento: Lamina = ({ p, reloj }) => {
  const baja = p('baja'), c4 = p('c4'), c3 = p('c3'), complejos = p('complejos'), activan = p('activan'), c1 = p('c1'), clasica = p('clasica'), consume = p('consume'), intensa = p('intensa'), persistente = p('persistente'), c3b = p('c3b'), menos = p('menos'), normal = p('normal'), factor = p('factor'), positivo = p('positivo'), igm = p('igm'), igg = p('igg'), artritis = p('artritis'), c4b = p('c4b'), bajo = p('bajo'), c3c = p('c3c'), normal2 = p('normal2');
  const nivel = (q: number, tope: number) => 1 - tope * easeOut(q);
  const ficha = (x: number, txt: string, col: string, q: number, lleno: number) => (
    <g>
      <circle cx={x + 4} cy={430 + 8} r={74} fill="#000" opacity={0.14} />
      <circle cx={x} cy={430} r={74} fill="#FFF" opacity={0.35 * tramo(q, 0, 0.3)} />
      <clipPath id={`cc-${txt}`}><circle cx={x} cy={430} r={70} /></clipPath>
      <g clipPath={`url(#cc-${txt})`} opacity={tramo(q, 0, 0.3)}><rect x={x - 74} y={430 + 70 - 140 * lleno} width={148} height={140 * lleno} fill={col} /></g>
      <circle cx={x} cy={430} r={70} fill="none" stroke={col} strokeWidth={8} opacity={tramo(q, 0, 0.3)} />
    </g>
  );
  return (
    <g>
      <Globo x={640} y={85} txt="¿por qué baja el C4 y el C3 no?" t={32} p={baja} colaX={0} />
      <Complejo x={170} y={430} k={1.6} n={3} o={tramo(complejos, 0, 0.4)} /><Txt x={170} y={560} txt="los complejos" t={24} p={complejos} color={TXH.b} />
      <Flecha a={[260, 430]} b={[350, 430]} p={tramo(activan, 0, 1)} color="#8A4FE8" w={9} />
      {ficha(440, 'C1', '#8A4FE8', Math.max(c1, activan), 1)}{ficha(660, 'C4', '#E5324C', Math.max(c4, c1), nivel(Math.max(consume, intensa, persistente), 0.82))}{ficha(880, 'C2', '#E8841E', c1, 1)}{ficha(1100, 'C3', '#14B870', Math.max(c3, c1), nivel(Math.max(c3b, menos), 0.12))}
      <Txt x={440} y={430} txt="C1" t={34} p={Math.max(c1, activan)} color="#FFFFFF" /><Txt x={660} y={430} txt="C4" t={34} p={Math.max(c4, c1)} color="#FFFFFF" /><Txt x={880} y={430} txt="C2" t={34} p={c1} color="#FFFFFF" /><Txt x={1100} y={430} txt="C3" t={34} p={Math.max(c3, c1)} color="#FFFFFF" />
      <Txt x={440} y={560} txt="la vía clásica" t={26} p={Math.max(clasica, activan)} color={TXH.d} />
      <Txt x={660} y={560} txt="se consume" t={26} p={consume} color={TXH.sangre} /><Txt x={660} y={602} txt="de forma intensa y persistente" t={22} p={Math.max(intensa, persistente)} color={TXH.sangre} />
      <Txt x={1100} y={560} txt="baja menos" t={26} p={Math.max(c3b, menos)} color={TXH.c} /><Txt x={1100} y={602} txt="o queda normal" t={24} p={normal} color={TXH.c} />
      {/* el factor reumatoide sale positivo sin artritis reumatoide */}
      <Pentamero x={300} y={820} k={1.1} o={tramo(igm, 0, 0.4)} /><Anticuerpo x={480} y={820} k={1.7} o={tramo(igg, 0, 0.4)} /><Hilo a={[340, 800]} b={[462, 826]} p={Math.max(factor, igm)} color="#E8841E" />
      <Txt x={390} y={925} txt="la IgM actúa contra la IgG" t={24} p={Math.max(igm, igg)} color={TXH.a} />
      <Luz x={780} y={820} on={Math.max(factor, positivo)} col="#E8841E" signo="+" q={Math.max(factor, positivo)} reloj={reloj} /><Txt x={780} y={915} txt="factor reumatoide positivo" t={24} p={Math.max(factor, positivo)} color={TXH.a} />
      <Txt x={1130} y={820} txt="aunque no haya" t={24} p={artritis} color={TXH.gris} /><Txt x={1130} y={862} txt="artritis reumatoide" t={26} p={artritis} color={TXH.gris} /><Tachon x1={980} x2={1280} y={862} p={artritis} />
      <Etiqueta x={1420} y={260} txt="C4 bajo" color="#E5324C" p={Math.max(c4b, bajo)} t={30} punta="no" /><Etiqueta x={1420} y={330} txt="C3 normal" color="#14B870" p={Math.max(c3c, normal2)} t={30} punta="no" />
    </g>
  );
};

// ─── 4 · Vasculitis de vasos pequeños ───────────────────────────────────────
const Vasculitis: Lamina = ({ p, reloj }) => {
  const complejos = p('complejos'), depositan = p('depositan'), complemento = p('complemento'), reclutan = p('reclutan'), neutrofilos = p('neutrofilos'), vasculitis = p('vasculitis'), pequenos = p('pequenos'), purpura = p('purpura'), artralgias = p('artralgias'), debilidad = p('debilidad'), triada = p('triada'), raynaud = p('raynaud'), laboratorio = p('laboratorio'), historia = p('historia'), manchas = p('manchas'), paciente = p('paciente'), nombre = p('nombre');
  const flota = (i: number, n: number) => ((reloj / 1800 + i / n) % 1);
  return (
    <g>
      {/* el vaso pequeño con los complejos pegados a su pared y los neutrófilos que lo muerden */}
      <rect x={80} y={220} width={900} height={50} rx={25} fill="#E3203F" opacity={0.85 * tramo(depositan, 0, 0.3) + 0.15} /><rect x={80} y={430} width={900} height={50} rx={25} fill="#E3203F" opacity={0.85 * tramo(depositan, 0, 0.3) + 0.15} />
      <rect x={80} y={270} width={900} height={160} fill="#FFD8D8" opacity={0.55} />
      {Array.from({ length: 7 }, (_, i) => { const f = flota(i, 7); return <circle key={i} cx={120 + ((f * 900) % 860)} cy={350 + 24 * Math.sin(i * 2 + reloj / 500)} r={16} fill="#E3203F" opacity={0.9} />; })}
      {[0, 1, 2, 3, 4].map((i) => <Complejo key={i} x={200 + i * 160} y={i % 2 ? 284 : 416} k={0.55} n={3} o={tramo(Math.max(complejos, depositan), i * 0.12, i * 0.12 + 0.4)} />)}
      <Etiqueta x={300} y={170} txt="complejos inmunes" color="#B8237A" p={Math.max(complejos, depositan)} t={26} punta="no" />
      {[0, 1].map((i) => <Neutrofilo key={i} x={340 + i * 380 + 14 * Math.sin(reloj / 500 + i)} y={i ? 396 : 304} k={0.8} o={tramo(Math.max(reclutan, neutrofilos), i * 0.2, i * 0.2 + 0.4)} />)}
      <Txt x={540} y={520} txt="activan el complemento" t={24} p={complemento} color={TXH.d} /><Txt x={540} y={562} txt="y reclutan neutrófilos" t={24} p={Math.max(reclutan, neutrofilos)} color={TXH.hep} />
      <Etiqueta x={540} y={650} txt="vasculitis de pequeños vasos" color="#E5324C" p={Math.max(vasculitis, pequenos)} t={30} punta="no" />
      {/* púrpura palpable, artralgias y debilidad */}
      <PiernaPurpura x={1250} y={420} k={0.75} p={easeOut(purpura)} />
      <Etiqueta x={1250} y={160} txt="púrpura palpable" color="#8A4FE8" p={purpura} t={28} punta="no" />
      <Sombra><Sale p={artralgias} x={430} y={850} k={0.3}><Busto quien="p2" reloj={reloj} fase={0.7} dolor={0.8} /></Sale></Sombra>
      <Etiqueta x={430} y={945} txt="artralgias" color="#C25A00" p={artralgias} t={24} punta="no" /><Etiqueta x={700} y={945} txt="debilidad" color="#6A35A0" p={debilidad} t={24} punta="no" />
      <Txt x={1230} y={700} txt="la tríada clásica" t={28} p={triada} color={TXH.hep} /><Txt x={1230} y={745} txt="y a veces fenómeno de Raynaud" t={24} p={raynaud} color={TXH.gris} />
      <Txt x={1230} y={820} txt="el laboratorio de vasculitis" t={24} p={laboratorio} color={TXH.b} /><Txt x={1230} y={858} txt="cuenta esta historia desde otro ángulo" t={22} p={historia} color={TXH.b} />
      <Etiqueta x={1170} y={975} txt="las manchas del paciente 2 tienen nombre" color="#6E4AD8" p={Math.max(manchas, paciente, nombre)} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · Otros órganos: riñón y nervios ─────────────────────────────────────
const Organos: Lamina = ({ p, reloj }) => {
  const organos = p('organos'), reciben = p('reciben'), complejos = p('complejos'), rinon = p('rinon'), glomerulo = p('glomerulo'), membrano = p('membrano'), sangre = p('sangre'), proteina = p('proteina'), orina = p('orina'), paciente = p('paciente'), nervios = p('nervios'), hormigueo = p('hormigueo'), dolor = p('dolor'), debilidad = p('debilidad'), neuropatia = p('neuropatia'), cada = p('cada'), consecuencia = p('consecuencia');
  return (
    <g>
      <Etiqueta x={800} y={95} txt="otros órganos también reciben los complejos" color="#8A4FE8" p={Math.max(organos, reciben, complejos)} t={32} punta="no" />
      <Glomerulo x={330} y={420} k={0.8} necrosis={0.3 * easeOut(glomerulo)} fibrina={0.3 * easeOut(membrano)} brillo="granular" o={tramo(rinon, 0, 0.4)} />
      <Etiqueta x={330} y={680} txt="riñón" color="#B8237A" p={rinon} t={30} punta="no" /><Txt x={330} y={735} txt="glomerulonefritis" t={26} p={glomerulo} color={TXH.hep} /><Txt x={330} y={777} txt="membranoproliferativa" t={26} p={membrano} color={TXH.hep} />
      <FrascoOrina x={760} y={420} k={1.5} oscuro={easeOut(Math.max(sangre, proteina))} reloj={reloj} o={tramo(sangre, 0, 0.4)} />
      <Txt x={760} y={640} txt="sangre" t={26} p={sangre} color={TXH.sangre} /><Txt x={760} y={682} txt="y proteína en la orina" t={26} p={Math.max(proteina, orina)} color={TXH.hep} /><Txt x={760} y={740} txt="como el paciente 2" t={26} p={paciente} color={TXH.d} />
      {/* los nervios periféricos */}
      <Nervio x={1230} y={470} k={0.7} w={560} isquemia={0.5 * easeOut(Math.max(neuropatia, debilidad))} o={tramo(nervios, 0, 0.4)} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${1020 + i * 85},${380 + 8 * Math.sin(reloj / 120 + i)} l6,-14 l6,14`} fill="none" stroke="#FFC81E" strokeWidth={5} strokeLinecap="round" opacity={tramo(hormigueo, 0, 0.3)} />)}
      <Etiqueta x={1230} y={290} txt="nervios periféricos" color="#C79A00" p={nervios} t={28} punta="no" />
      <Txt x={1230} y={620} txt="hormigueo" t={26} p={hormigueo} color={TXH.kupffer} /><Txt x={1230} y={664} txt="dolor" t={26} p={dolor} color={TXH.sangre} /><Txt x={1230} y={708} txt="debilidad o neuropatía" t={26} p={Math.max(debilidad, neuropatia)} color={TXH.hep} />
      <Txt x={800} y={920} txt="cada órgano, una consecuencia" t={40} p={Math.max(cada, consecuencia)} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · Un virus con muchas caras ──────────────────────────────────────────
const Caras: Lamina = ({ p, reloj }) => {
  const nodano = p('nodano'), higado = p('higado'), estimulacion = p('estimulacion'), linfocitos = p('linfocitos'), linfoma = p('linfoma'), hodgkin = p('hodgkin'), relaciona = p('relaciona'), liquen = p('liquen'), porfiria = p('porfiria'), tardia = p('tardia'), resistencia = p('resistencia'), insulina = p('insulina'), muchas = p('muchas'), caras = p('caras');
  return (
    <g>
      <Txt x={800} y={95} txt="no todo el daño del virus empieza en el hígado" t={36} p={Math.max(nodano, higado)} color={TXH.hep} />
      <VirionC x={800} y={500} k={1.7} reloj={reloj} />
      {/* linfoma no Hodgkin de células B */}
      <Hilo a={[690, 440]} b={[470, 350]} p={Math.max(estimulacion, linfocitos, linfoma)} color="#6A9A00" />
      {[0, 1, 2].map((i) => <Linfo key={i} x={260 + i * 70} y={300 + (i % 2) * 50} k={0.8 + 0.1 * i} tono={H.ac} reloj={reloj} fase={i} o={tramo(Math.max(linfocitos, linfoma), i * 0.15, i * 0.15 + 0.4)} />)}
      <Tumor x={330} y={400} k={0.5} reloj={reloj} o={tramo(linfoma, 0, 0.4)} />
      <Etiqueta x={330} y={560} txt="linfoma no Hodgkin de células B" color="#6A9A00" p={Math.max(linfoma, hodgkin)} t={24} punta="no" /><Txt x={330} y={205} txt="la estimulación crónica de los linfocitos B" t={22} p={Math.max(estimulacion, linfocitos)} color={TXH.ac} />
      {/* liquen plano */}
      <Hilo a={[910, 440]} b={[1160, 350]} p={Math.max(relaciona, liquen)} color="#8A4FE8" />
      <rect x={1040} y={240} width={300} height={200} rx={36} fill="#F2C4A8" opacity={tramo(liquen, 0, 0.4)} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d="M-14,-8 L0,-16 L14,-8 L14,8 L0,16 L-14,8 Z" transform={`translate(${1080 + (i % 5) * 56},${300 + Math.floor(i / 5) * 80})`} fill="#8A3AA8" opacity={tramo(liquen, i / 14, i / 14 + 0.3)} />)}
      <Etiqueta x={1190} y={490} txt="liquen plano" color="#8A4FE8" p={Math.max(relaciona, liquen)} t={26} punta="no" />
      {/* porfiria cutánea tardía */}
      <Hilo a={[700, 600]} b={[470, 760]} p={Math.max(porfiria, tardia)} color="#C25A00" />
      <rect x={180} y={680} width={300} height={190} rx={36} fill="#F2C4A8" opacity={tramo(porfiria, 0, 0.4)} />
      {Array.from({ length: 5 }, (_, i) => <g key={i} opacity={tramo(Math.max(porfiria, tardia), i / 8, i / 8 + 0.3)}><circle cx={240 + (i % 3) * 90} cy={730 + Math.floor(i / 3) * 80} r={26} fill="#FFF" opacity={0.6} /><circle cx={240 + (i % 3) * 90 - 8} cy={730 + Math.floor(i / 3) * 80 - 8} r={7} fill="#FFF" opacity={0.9} /></g>)}
      <Etiqueta x={330} y={915} txt="porfiria cutánea tardía" color="#C25A00" p={Math.max(porfiria, tardia)} t={24} punta="no" />
      {/* resistencia a la insulina */}
      <Hilo a={[900, 600]} b={[1130, 760]} p={Math.max(resistencia, insulina)} color="#2F55E0" />
      <Jeringa x={1060} y={760} k={1.1} o={tramo(Math.max(resistencia, insulina), 0, 0.4)} />
      <Fact x={1290} y={760} R={52} tono={H.b} txt="célula" t={20} p={Math.max(resistencia, insulina)} /><Tacha x={1180} y={760} r={36} p={insulina} />
      <Etiqueta x={1190} y={880} txt="resistencia a la insulina" color="#2F55E0" p={Math.max(resistencia, insulina)} t={24} punta="no" />
      <Txt x={800} y={800} txt="un virus con muchas caras" t={38} p={Math.max(muchas, caras)} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [LinfoB, Tipos, Frio, Complemento, Vasculitis, Organos, Caras];
export default LAMINAS;
