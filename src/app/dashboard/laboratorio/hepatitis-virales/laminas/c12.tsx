'use client';
// Capítulo 12 · Caso 1: el brote
//
// El paciente 1 seis semanas después (busto vivo con los ojos amarillos, el frasco de orina oscura, las barras del laboratorio), el brote como
// reagudización y no como hepatitis nueva, la citólisis masiva con sus enzimas que se escapan, la IgM que reaparece, las cuatro señales de
// un mismo hígado, los gatillos del brote y la línea roja de la falla hepática aguda.

import type { Lamina } from '../Lienzo';
import { Mitocondria } from '../../sepsis/Piezas';
import { Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Anticuerpo, Busto, Capsula, Etiqueta, Flecha, Globo, Higado, Linfo, Llama, Reloj, Sale, Sombra, TXH, Txt, VirionAE, VirionB, VirionD, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Hepatocito, TuboCurvo as Tubo } from '../Higado';
import { BarraLab, Curva, Eje, FrascoOrina } from '../Clinica';
import { Campana, Fact, Plato, Visto } from '../Extras';

type P2 = [number, number];
const AL = ['#C99300', '#FFD23F'] as const, AS = ['#C2540A', '#FF8A1E'] as const;

/** Una enzima: frijolito con su sombra y su brillo. */
function Enz({ x, y, k = 1, o = 1, r = 0, tono }: { x: number; y: number; k?: number; o?: number; r?: number; tono: readonly string[] }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill={tono[0]} /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill={tono[1]} /><ellipse cx={-4.5} cy={-3.6} rx={4.4} ry={2.2} fill="#FFF" opacity={0.75} />
    </g>
  );
}

/** Una tacha roja (el «no» de las cosas descartadas). */
function Tacha({ x, y, r = 46, p = 1 }: { x: number; y: number; r?: number; p?: number }) {
  if (p <= 0.003) return null;
  return <path d={`M${x - r},${y - r} L${x + r},${y + r} M${x + r},${y - r} L${x - r},${y + r}`} stroke="#E5324C" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(clamp(p)).toFixed(3)} 1`} opacity={0.95} />;
}

// ─── 0 · Seis semanas después ───────────────────────────────────────────────
const SeisSemanas: Lamina = ({ p, reloj }) => {
  const semanas = p('semanas'), empeora = p('empeora'), fatiga = p('fatiga'), apetito = p('apetito'), orina = p('orina'), ojos = p('ojos'), alcohol = p('alcohol'), hierbas = p('hierbas'), farmacos = p('farmacos'), alt = p('alt'), ast = p('ast'), bili = p('bili'), directa = p('directa'), inr = p('inr'), debil = p('debil'), adn = p('adn'), cambio = p('cambio');
  return (
    <g>
      <Etiqueta x={330} y={100} txt="6 semanas después" color="#2F55E0" p={semanas} t={34} punta="no" />
      <Txt x={330} y={160} txt="todo empeora" t={28} p={empeora} color={TXH.sangre} />
      <Sombra><Sale p={semanas} x={330} y={400} k={0.85}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ojos)} dolor={0.5 * fatiga} sueno={0.4 * fatiga} /></Sale></Sombra>
      <Etiqueta x={330} y={610} txt="fatiga intensa" color="#7A55D8" p={fatiga} t={24} punta="no" />
      <Plato x={640} y={300} k={0.55} o={tramo(apetito, 0, 0.4)} /><Tacha x={640} y={300} r={50} p={apetito} />
      <Txt x={640} y={380} txt="sin apetito" t={24} p={apetito} color={TXH.gris} />
      <Sale p={orina} x={640} y={500} k={0.8}><FrascoOrina oscuro={easeOut(orina)} reloj={reloj} /></Sale>
      <Txt x={640} y={600} txt="orina oscura" t={24} p={orina} color={TXH.biliD} />
      <Etiqueta x={330} y={670} txt="ojos amarillos" color="#C79A00" p={ojos} t={24} punta="no" />
      {/* lo que NO hubo */}
      <Sale p={alcohol} x={250} y={790}><path d="M-22,40 L-22,-10 Q-22,-26 -8,-34 L-8,-66 L8,-66 L8,-34 Q22,-26 22,-10 L22,40 Z" fill="#2FA860" /><rect x={-14} y={0} width={28} height={30} rx={4} fill="#FFF8E8" /></Sale>
      <Tacha x={250} y={790} r={46} p={alcohol} /><Txt x={250} y={880} txt="sin alcohol" t={24} p={alcohol} />
      <Sale p={hierbas} x={450} y={790}><path d="M-34,24 C-40,-30 0,-48 30,-30 C46,-10 24,22 -34,24 Z" fill="#5BC95A" /><path d="M-30,20 C-10,-4 10,-14 24,-26" fill="none" stroke="#2F8F3A" strokeWidth={4} strokeLinecap="round" /></Sale>
      <Tacha x={450} y={790} r={46} p={hierbas} /><Txt x={450} y={880} txt="sin hierbas" t={24} p={hierbas} />
      <Sale p={farmacos} x={650} y={790}><Capsula k={1.3} reloj={reloj} /></Sale>
      <Tacha x={650} y={790} r={46} p={farmacos} /><Txt x={650} y={880} txt="sin fármacos nuevos" t={24} p={farmacos} />
      {/* el laboratorio */}
      <BarraLab x={950} y={840} w={70} alto={360} val={1450} max={1600} norm={40} color="#F2848C" oscuro="#B83A52" p={alt} nombre="ALT" valor="1 450" t={24} />
      <BarraLab x={1070} y={840} w={70} alto={360} val={980} max={1600} norm={40} color="#FF8A1E" oscuro="#C2540A" p={ast} nombre="AST" valor="980" t={24} />
      <BarraLab x={1200} y={840} w={70} alto={360} val={5.4} max={6} norm={1.2} color="#FFC81E" oscuro="#C79A00" p={bili} nombre="bili total" valor="5,4" t={22} />
      <BarraLab x={1320} y={840} w={70} alto={360} val={4.1} max={6} color="#FF9A2E" oscuro="#D96A00" p={directa} nombre="directa" valor="4,1" t={22} />
      <BarraLab x={1440} y={840} w={70} alto={360} val={1.3} max={2.5} norm={1.1} color="#F0495F" oscuro="#A8203A" p={inr} nombre="INR" valor="1,3" t={24} />
      <Fact x={1010} y={230} R={46} tono={H.a} txt="IgM" t={22} p={debil} o={0.55} />
      <Txt x={1110} y={230} txt="anti-HBc débil" t={26} p={debil} ancla="start" color={TXH.a} />
      <Fact x={1010} y={350} R={46} tono={H.adn} txt="ADN" t={22} p={adn} />
      <Txt x={1110} y={350} txt="2,1 × 10⁸ UI/mL" t={26} p={adn} ancla="start" color={TXH.b} />
      <Txt x={800} y={970} txt="algo cambió" t={40} p={cambio} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Una reagudización, no una hepatitis aguda ──────────────────────────
const Reagudizacion: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), no = p('no'), reagud = p('reagud'), cronica = p('cronica'), brote = p('brote'), inmuno = p('inmuno'), igm = p('igm'), debil = p('debil'), adn = p('adn'), sube = p('sube'), carga = p('carga'), antes = p('antes'), pico = p('pico'), nuevo = p('nuevo');
  const OX = 880, OY = 830, W = 560;
  const g = (m: number, c: number, s: number) => Math.exp(-((m - c) ** 2) / (2 * s * s));
  const mu = (f: (m: number) => number, a: number, b: number): P2[] => Array.from({ length: 40 }, (_, i) => { const m = a + (b - a) * (i / 39); return [m * 100, -f(m)] as P2; });
  return (
    <g>
      <Globo x={640} y={90} txt="¿es una hepatitis aguda nueva?" t={34} p={pregunta} colaX={0} />
      {/* no: un virus nuevo, descartado */}
      <VirionB x={230} y={340} k={0.9} reloj={reloj} o={tramo(pregunta, 0, 0.4)} />
      <Tacha x={230} y={340} r={92} p={no} />
      <Etiqueta x={230} y={500} txt="no: no es un virus nuevo" color="#E5324C" p={no} t={26} punta="no" />
      {/* sí: un brote de una hepatitis B crónica */}
      <Sale p={cronica} x={640} y={350} k={0.5}><Higado corte={false} /></Sale>
      <Sale p={brote} x={640} y={260} k={1.5}><Llama /></Sale>
      <Etiqueta x={640} y={510} txt="reagudización" color="#B8237A" p={reagud} t={30} punta="no" />
      <Txt x={640} y={570} txt="de una hepatitis B crónica" t={26} p={cronica} color={TXH.hep} />
      <Txt x={640} y={620} txt="un brote inmunomediado" t={26} p={inmuno} color={TXH.cd8} />
      <Linfo x={430} y={620} k={0.6} reloj={reloj} activo={inmuno} o={tramo(inmuno, 0, 0.4)} />
      {/* la IgM sale débil */}
      <BarraLab x={230} y={900} w={64} alto={200} val={0.2} max={1} color="#FF8A1E" oscuro="#C2540A" p={igm} nombre="IgM" valor="débil" t={24} />
      <Txt x={420} y={850} txt="por eso la IgM sale" t={24} p={debil} ancla="start" color={TXH.gris} />
      {/* la carga sube antes del pico de ALT */}
      <Eje x={OX} y={OY} w={W} alto={400} p={adn} marcas={[]} />
      <Curva x={OX} y={OY} pts={mu((m) => 260 * g(m, 2.2, 0.8) + 60, 0.2, 5.2)} color="#4F7FF0" oscuro="#1E4FC0" p={sube} grosor={10} />
      <Curva x={OX} y={OY} pts={mu((m) => 340 * g(m, 3.1, 0.55), 0.8, 5.2)} color="#FFC81E" oscuro="#C79A00" p={pico} grosor={10} />
      <Etiqueta x={OX + 130} y={OY - 330} txt="ADN" color="#1E4FC0" p={adn} t={24} punta="no" />
      <Txt x={OX + 20} y={OY - 395} txt="ADN: de 8,2 × 10⁷ a 2,1 × 10⁸" t={22} p={sube} ancla="start" color={TXH.b} />
      <Etiqueta x={OX + 410} y={OY - 300} txt="ALT" color="#C79A00" p={pico} t={24} punta="no" />
      <Txt x={OX + W / 2 + 60} y={OY + 56} txt="tiempo" t={22} p={adn} fuerte={false} />
      <Txt x={1180} y={200} txt="en un brote, la carga viral" t={26} p={carga} color={TXH.b} />
      <Txt x={1180} y={245} txt="suele subir antes del pico de ALT" t={26} p={antes} color={TXH.b} />
      <Txt x={1180} y={330} txt="es una reagudización," t={30} p={pico} color={TXH.hep} />
      <Txt x={1180} y={375} txt="no un virus nuevo" t={30} p={nuevo} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Citólisis masiva ───────────────────────────────────────────────────
const Citolisis: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), linfocitos = p('linfocitos'), matan = p('matan'), perforinas = p('perforinas'), granzimas = p('granzimas'), rompen = p('rompen'), enzimas = p('enzimas'), sinusoides = p('sinusoides'), masa = p('masa'), citosol = p('citosol'), dura = p('dura'), alt2 = p('alt2'), encima = p('encima'), ritis = p('ritis'), r068 = p('r068');
  const C: P2 = [470, 520], K = 1.9, VX = 1000, sal: P2 = [C[0] + 92 * K, C[1] - 14];
  return (
    <g>
      <Globo x={640} y={90} txt="¿qué ocurre dentro del hígado?" t={34} p={pregunta} colaX={0} />
      <Tubo a={[VX, 230]} b={[VX, 790]} c={[VX + 26, 510]} w={130} tono={H.endo} p={tramo(sinusoides, 0, 0.6)} />
      <Hepatocito x={C[0]} y={C[1]} k={K} reloj={reloj} sem={3} apop={0.3 * easeOut(matan)} balon={0.3 * easeOut(rompen)} />
      {/* las mitocondrias conservan la AST */}
      {[[-70, 60], [60, 90], [-20, -80]].map(([mx, my], i) => <g key={i}><Mitocondria x={C[0] + mx} y={C[1] + my} k={0.16} r={i * 40 - 30} reloj={reloj} /><Enz x={C[0] + mx} y={C[1] + my} k={0.8} tono={AS} o={tramo(enzimas, 0.2, 0.6)} /></g>)}
      {/* la ALT del citosol sale en masa */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = hash(i, 1) * 6.28, r = (40 + hash(i, 2) * 36) * K, q = easeOut(tramo(masa, i * 0.03, i * 0.03 + 0.5));
        const dentro: P2 = [C[0] + Math.cos(a) * r, C[1] + Math.sin(a) * r];
        const fuera: P2 = [VX + (hash(i, 3) - 0.5) * 60, 280 + ((hash(i, 4) * 500 + reloj * 0.045) % 500)];
        return <Enz key={i} x={lerp(dentro[0], fuera[0], q) + 4 * Math.sin(reloj / 400 + i)} y={lerp(dentro[1], fuera[1], q)} k={1.15} r={i * 41} tono={AL} o={tramo(enzimas, i / 20, i / 20 + 0.3)} />;
      })}
      {/* los linfocitos atacan */}
      {[0, 1].map((i) => <Linfo key={i} x={lerp(260, 300 + i * 40, easeOut(tramo(linfocitos, i * 0.1, i * 0.1 + 0.8)))} y={300 + i * 440} k={0.65} reloj={reloj} fase={i * 2} activo={1} o={tramo(linfocitos, i * 0.1, i * 0.1 + 0.3)} />)}
      <path d={`M${sal[0]},${sal[1] - 60} L${sal[0] + 14},${sal[1] - 34} L${sal[0] - 8},${sal[1] - 10} L${sal[0] + 16},${sal[1] + 14} L${sal[0] - 6},${sal[1] + 40}`} fill="none" stroke="#7A1230" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(rompen, 0, 0.4)} />
      <Txt x={260} y={190} txt="linfocitos T" t={26} p={linfocitos} color={TXH.cd8} />
      <Etiqueta x={470} y={800} txt="matan hepatocitos" color="#E5324C" p={matan} t={26} punta="no" />
      <Txt x={250} y={880} txt="con perforinas" t={24} p={perforinas} color={TXH.cd8} /><Txt x={470} y={880} txt="y granzimas" t={24} p={granzimas} color={TXH.kupffer} />
      <Txt x={760} y={160} txt="las membranas se rompen" t={26} p={rompen} color={TXH.sangre} />
      <Txt x={1000} y={850} txt="y las enzimas pasan a los sinusoides" t={24} p={enzimas} color={TXH.hep} />
      <Etiqueta x={1300} y={200} txt="sale en masa la ALT del citosol" color="#C79A00" p={citosol} t={24} punta="no" />
      <Txt x={1300} y={270} txt="como dura más," t={24} p={dura} color={TXH.gris} />
      <BarraLab x={1330} y={760} w={80} alto={360} val={1450} max={1600} norm={40} color="#F2848C" oscuro="#B83A52" p={alt2} nombre="ALT" valor="1 450" t={24} />
      <BarraLab x={1470} y={760} w={80} alto={360} val={980} max={1600} norm={40} color="#FF8A1E" oscuro="#C2540A" p={ritis} nombre="AST" valor="980" t={24} />
      <Txt x={1400} y={870} txt="ALT por encima de AST" t={22} p={encima} color={TXH.kupffer} />
      <Etiqueta x={1260} y={930} txt="De Ritis: 0,68" color="#8A4FE8" p={r068} t={32} punta="no" />
    </g>
  );
};

// ─── 3 · La IgM que reaparece ───────────────────────────────────────────────
const IgmReaparece: Lamina = ({ p, reloj }) => {
  const igm = p('igm'), reaparece = p('reaparece'), destruccion = p('destruccion'), masiva = p('masiva'), antigeno = p('antigeno'), sangre = p('sangre'), reestimula = p('reestimula'), memoria = p('memoria'), fabrican = p('fabrican'), igm2 = p('igm2'), nueva = p('nueva'), misma = p('misma'), reencendida = p('reencendida');
  return (
    <g>
      <Etiqueta x={800} y={100} txt="la IgM que reaparece" color="#C25A00" p={igm} t={36} punta="no" />
      {/* la destrucción masiva suelta antígeno core a la sangre */}
      {[0, 1, 2].map((i) => <Hepatocito key={i} x={250 + i * 130} y={380 + (i % 2) * 70} k={0.7} reloj={reloj} fase={i} sem={i + 2} infecta={H.b} brillo={1 - 0.5 * destruccion} apop={easeOut(tramo(masiva, i * 0.15, i * 0.15 + 0.7))} o={tramo(reaparece, 0, 0.4)} />)}
      <Txt x={400} y={540} txt="la destrucción masiva" t={26} p={destruccion} color={TXH.sangre} />
      <Tubo a={[120, 700]} b={[1000, 700]} c={[560, 660]} w={170} tono={H.endo} p={tramo(sangre, 0, 0.6)} />
      {Array.from({ length: 8 }, (_, i) => { const u = ((reloj / 3000 + i / 8) % 1); return <VirionB key={i} x={lerp(240 + (i % 3) * 120, 900, u)} y={lerp(470, 700 + 20 * Math.sin(u * 9 + i), easeOut(Math.min(1, u * 2)))} k={0.2} reloj={reloj} fase={i} env={0} capside={1} adn={0} o={Math.sin(u * Math.PI) * tramo(antigeno, 0, 0.4)} />; })}
      <Etiqueta x={560} y={810} txt="antígeno core a la sangre" color="#1B36A8" p={antigeno} t={26} punta="no" />
      <Txt x={560} y={870} txt="en la sangre" t={24} p={sangre} fuerte={false} />
      {/* reestimula a los B de memoria: se despiertan y sueltan un poco de IgM */}
      <Linfo x={1180} y={420} k={1.2} reloj={reloj} tono={H.ac} activo={easeOut(reestimula)} o={tramo(memoria, 0, 0.4)} />
      <text x={1250} y={310 - 6 * Math.sin(reloj / 500)} style={{ fontSize: 42, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: 1 - tramo(reestimula, 0.2, 0.8) }}>z z</text>
      <Etiqueta x={1180} y={250} txt="linfocitos B de memoria" color="#6A9A00" p={memoria} t={26} punta="no" />
      <Txt x={1180} y={560} txt="se reestimulan" t={26} p={reestimula} color={TXH.ac} />
      {[0, 1, 2].map((i) => <Anticuerpo key={i} x={1120 + i * 100 + 10 * Math.sin(reloj / 500 + i)} y={650 + 18 * Math.sin(reloj / 600 + i)} k={0.9} r={i * 30 - 30} tono={H.a} o={tramo(fabrican, i * 0.15, i * 0.15 + 0.4)} />)}
      <Txt x={1230} y={750} txt="fabrican un poco de IgM anti-HBc" t={24} p={igm2} color={TXH.a} />
      <Txt x={1180} y={830} txt="no es una infección nueva" t={30} p={nueva} color={TXH.hep} />
      <Txt x={1180} y={880} txt="es la misma," t={30} p={misma} color={TXH.hep} />
      <Sale p={reencendida} x={1060} y={925} k={0.55}><Llama /></Sale>
      <Txt x={1290} y={940} txt="reencendida" t={30} p={reencendida} color={TXH.sangre} />
    </g>
  );
};

// ─── 4 · Bilirrubina, orina y heces ─────────────────────────────────────────
const CuatroSenales: Lamina = ({ p, reloj }) => {
  const bili = p('bili'), directa = p('directa'), nosale = p('nosale'), refluye = p('refluye'), escleras = p('escleras'), orina = p('orina'), rinon = p('rinon'), heces = p('heces'), inr = p('inr'), avisa = p('avisa'), senales = p('senales'), solo = p('solo');
  return (
    <g>
      {/* un solo hígado en el centro */}
      <Sale p={Math.max(bili, 0.001)} x={800} y={520} k={0.6}><Higado corte={false} /></Sale>
      <Etiqueta x={800} y={140} txt="bilirrubina directa 4,1" color="#D96A00" p={directa} t={30} punta="no" />
      <Sale p={nosale} x={800} y={330} k={1.2}><circle cx={3} cy={4} r={20} fill="#000" opacity={0.14} /><path d="M0,-40 C22,-12 30,6 30,18 A30,30 0 0 1 -30,18 C-30,6 -22,-12 0,-40 Z" fill="#FF9A2E" /><path d="M-6,-18 C-14,-2 -18,6 -18,14" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} /></Sale>
      <Tacha x={800} y={330} r={46} p={nosale} />
      <Txt x={800} y={405} txt="no sale por el canalículo" t={24} p={nosale} color={TXH.biliD} />
      <Txt x={800} y={700} txt="y refluye a la sangre" t={26} p={refluye} color={TXH.sangre} />
      {/* señal 1: escleras amarillas */}
      <Sombra><Sale p={escleras} x={260} y={330} k={0.5}><Busto quien="p1" reloj={reloj} ictericia={easeOut(escleras)} /></Sale></Sombra>
      <Etiqueta x={260} y={510} txt="escleras amarillas" color="#C79A00" p={escleras} t={26} punta="no" />
      <Flecha a={[400, 380]} b={[600, 450]} p={tramo(escleras, 0.3, 1)} color="var(--cit-flecha)" w={7} />
      {/* señal 2: orina oscura, porque se filtra por el riñón */}
      <Sale p={orina} x={260} y={780} k={0.75}><FrascoOrina oscuro={easeOut(orina)} reloj={reloj} /></Sale>
      <Etiqueta x={260} y={920} txt="orina oscura" color="#B8601E" p={orina} t={26} punta="no" />
      <Txt x={520} y={800} txt="se filtra por el riñón" t={24} p={rinon} color={TXH.gris} />
      <Flecha a={[400, 780]} b={[600, 640]} p={tramo(orina, 0.3, 1)} color="var(--cit-flecha)" w={7} />
      {/* señal 3: heces pálidas */}
      <g opacity={tramo(heces, 0, 0.4)}>
        <ellipse cx={1340} cy={352} rx={130} ry={14} fill="#000" opacity={0.12} /><rect x={1210} y={290} width={260} height={66} rx={33} fill="#E4D6B6" /><rect x={1210} y={285} width={254} height={58} rx={29} fill="#F4EBD2" /><rect x={1236} y={298} width={140} height={9} rx={4.5} fill="#FFF" opacity={0.45} />
      </g>
      <Etiqueta x={1340} y={430} txt="heces pálidas" color="#8A6A12" p={heces} t={26} punta="no" />
      <Flecha a={[1210, 380]} b={[1000, 450]} p={tramo(heces, 0.3, 1)} color="var(--cit-flecha)" w={7} />
      {/* señal 4: el INR de 1,3 avisa */}
      <BarraLab x={1340} y={900} w={80} alto={300} val={1.3} max={2.5} norm={1.1} color="#F0495F" oscuro="#A8203A" p={inr} nombre="INR" valor="1,3" t={26} />
      <Txt x={1090} y={760} txt="avisa de que la síntesis" t={24} p={avisa} color={TXH.sangre} /><Txt x={1090} y={800} txt="ya se afectó" t={24} p={avisa} color={TXH.sangre} />
      <Flecha a={[1250, 700]} b={[1000, 600]} p={tramo(inr, 0.3, 1)} color="var(--cit-flecha)" w={7} />
      <Etiqueta x={800} y={870} txt="4 señales" color="#B8237A" p={senales} t={34} punta="no" />
      <Txt x={800} y={940} txt="un solo hígado" t={34} p={solo} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · ¿Qué enciende un brote? ────────────────────────────────────────────
const Gatillos: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), espontaneo = p('espontaneo'), fase = p('fase'), inmuno = p('inmuno'), retirarla = p('retirarla'), rituximab = p('rituximab'), quimio = p('quimio'), esteroides = p('esteroides'), analogos = p('analogos'), delta = p('delta'), otro = p('otro'), historia = p('historia');
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué enciende un brote?" t={34} p={pregunta} colaX={0} />
      <Sale p={pregunta} x={800} y={600} k={1.7}><Llama /></Sale>
      {/* espontáneo, al pasar de una fase a otra */}
      <Reloj x={270} y={310} k={1.0} ang={(reloj / 20) % 360} o={tramo(espontaneo, 0, 0.4)} />
      <Etiqueta x={270} y={420} txt="espontáneo" color="#6A35A0" p={espontaneo} t={28} punta="no" />
      <Txt x={270} y={475} txt="al pasar de una fase a otra" t={22} p={fase} color={TXH.d} />
      {/* inmunosupresión, sobre todo al retirarla */}
      <Etiqueta x={800} y={190} txt="inmunosupresión" color="#8A4FE8" p={inmuno} t={28} punta="no" />
      <Sale p={rituximab} x={560} y={300}><Jeringa /></Sale><Txt x={560} y={400} txt="rituximab" t={24} p={rituximab} color={TXH.d} />
      <Sale p={quimio} x={800} y={300}><Capsula k={1.5} reloj={reloj} /></Sale><Txt x={800} y={375} txt="quimioterapia" t={24} p={quimio} color={TXH.d} />
      <Sale p={esteroides} x={1040} y={300}><Capsula k={1.5} reloj={reloj} tono={H.hep as unknown as readonly string[]} /></Sale><Txt x={1040} y={375} txt="esteroides" t={24} p={esteroides} color={TXH.d} />
      <Txt x={800} y={445} txt="sobre todo al retirarla" t={26} p={retirarla} color={TXH.sangre} />
      {/* suspender los análogos */}
      <Sale p={analogos} x={400} y={760}><Capsula k={1.6} reloj={reloj} /></Sale>
      <Tacha x={400} y={760} r={56} p={analogos} />
      <Etiqueta x={400} y={870} txt="suspender los análogos" color="#E8841E" p={analogos} t={26} punta="no" />
      {/* sobreinfección: el virus D u otro virus de la hepatitis */}
      <VirionD x={1000 + 20 * Math.sin(reloj / 700)} y={lerp(620, 740, easeOut(delta))} k={1.0} reloj={reloj} o={tramo(delta, 0, 0.4)} />
      <Etiqueta x={1020} y={870} txt="sobreinfección: virus D" color="#8A4FE8" p={delta} t={26} punta="no" />
      <VirionAE x={1400} y={lerp(620, 740, easeOut(otro))} k={1.0} reloj={reloj} tipo="a" o={tramo(otro, 0, 0.4)} />
      <Etiqueta x={1400} y={940} txt="otro virus de la hepatitis" color="#C25A00" p={otro} t={26} punta="no" />
      <Txt x={800} y={965} txt="cada gatillo tiene su historia" t={36} p={historia} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · La línea roja ──────────────────────────────────────────────────────
const LineaRoja: Lamina = ({ p, reloj }) => {
  const brote = p('brote'), falla = p('falla'), ictericia = p('ictericia'), inr = p('inr'), encef = p('encef'), paciente = p('paciente'), cerca = p('cerca'), tratar = p('tratar'), analogos = p('analogos'), ojo = p('ojo'), grave = p('grave'), mayoria = p('mayoria'), observa = p('observa');
  const TY = 860, TH = 640;
  const nivel = (v: number) => TY - (v / 2.2) * TH; // INR 0 → TY; 2.2 → arriba
  return (
    <g>
      <Etiqueta x={800} y={100} txt="si el brote sigue" color="#E5324C" p={brote} t={34} punta="no" />
      {/* el termómetro de gravedad del INR */}
      <rect x={236} y={TY - TH} width={88} height={TH + 40} rx={44} fill="#FFF" opacity={0.3 * tramo(inr, 0, 0.5)} />
      <rect x={240} y={nivel(1.3)} width={80} height={TY - nivel(1.3) + 30} rx={40} fill="#F0495F" opacity={tramo(inr, 0, 0.5)} />
      <circle cx={280} cy={TY + 24} r={52} fill="#F0495F" opacity={tramo(inr, 0, 0.5)} />
      <line x1={190} x2={420} y1={nivel(1.5)} y2={nivel(1.5)} stroke="#E5324C" strokeWidth={8} strokeDasharray="14 10" strokeLinecap="round" opacity={tramo(inr, 0.3, 1)} />
      <Etiqueta x={560} y={nivel(1.5)} txt="INR 1,5 o más" color="#E5324C" p={inr} t={26} punta="izq" />
      <g transform={`translate(${280},${nivel(1.3)})`} opacity={tramo(paciente, 0, 0.4)}><polygon points="52,0 84,-16 84,16" fill="#2F55E0" /><Etiqueta x={170} y={0} txt="paciente 1: 1,3" color="#2F55E0" p={paciente} t={24} punta="no" /></g>
      <Txt x={530} y={nivel(1.3) + 60} txt="no la cumple, pero está cerca" t={26} p={cerca} color={TXH.hep} />
      {/* falla hepática aguda: ictericia + INR + encefalopatía */}
      <Etiqueta x={1060} y={150} txt="falla hepática aguda" color="#B8237A" p={falla} t={32} punta="no" />
      <Sombra><Sale p={ictericia} x={880} y={430} k={0.42}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ictericia)} sueno={0.5 * encef} dolor={0.4} /></Sale></Sombra>
      <Txt x={880} y={575} txt="ictericia" t={26} p={ictericia} color={TXH.biliI} />
      {encef > 0.1 && ['?', '?', '?'].map((q, i) => <text key={i} x={880 + (i - 1) * 80} y={290 - 18 * Math.abs(onda(reloj, 700, i))} textAnchor="middle" style={{ fontSize: 50 + i * 8, fontWeight: 800, fill: 'var(--se-ambar)', opacity: encef }}>{q}</text>)}
      <Etiqueta x={1100} y={400} txt="encefalopatía" color="#7A55D8" p={encef} t={26} punta="no" />
      {/* por eso, análogos */}
      <Etiqueta x={1100} y={640} txt="conviene tratarlo" color="#1FA85A" p={tratar} t={28} punta="no" />
      <Sale p={analogos} x={940} y={715}><Capsula k={1.6} reloj={reloj} /></Sale><Txt x={1100} y={720} txt="con análogos" t={28} p={analogos} color={TXH.c} ancla="start" />
      <Visto x={1400} y={715} k={0.8} p={analogos} />
      <Txt x={1100} y={790} txt="ojo: la hepatitis B aguda grave" t={26} p={ojo} color={TXH.gris} />
      <Txt x={1100} y={830} txt="también se trata con análogos" t={26} p={grave} color={TXH.c} />
      <Txt x={1100} y={880} txt="aunque en la mayoría de los adultos no hace falta" t={22} p={mayoria} color={TXH.gris} />
      <Txt x={1100} y={930} txt="no toda hepatitis aguda se observa" t={24} p={observa} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [SeisSemanas, Reagudizacion, Citolisis, IgmReaparece, CuatroSenales, Gatillos, LineaRoja];
export default LAMINAS;
