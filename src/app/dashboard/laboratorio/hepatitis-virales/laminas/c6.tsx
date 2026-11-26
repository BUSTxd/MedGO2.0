'use client';
// Capítulo 6 · Hepatitis A y E: la vía fecal-oral
//
// El viaje de dos virus (A naranja, E ocre) desde un vaso de agua con su ola hasta el hepatocito; el virus A que se viste de membrana robada
// y esquiva a los anticuerpos; los linfocitos que matan por él; las curvas de IgM e IgG; el corte periportal visto por el ocular; el E con
// sus dos mundos (el agua para los genotipos 1-2, el cerdo, el jabalí y el ciervo para los 3-4) y todo lo que daña fuera del hígado.

import type { Lamina } from '../Lienzo';
import { Plasmatica, Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Nervio } from '../../vasculitis-anca/Piezas';
import { Sello } from '../../vih-sifilis/Piezas';
import { Anticuerpo, Busto, Capsula, Etiqueta, Flecha, Globo, Higado, Intestino, Linfo, Nota, Rinon, Sale, Sombra, TXH, TuboEnsayo, Txt, VirionAE, Zoom, H, clamp, easeOut, hash, lerp, tramo } from '../Piezas';
import { Corre, Hepatocito, Triada, TuboCurvo } from '../Higado';
import { Curva, Eje, Ocular } from '../Clinica';
import { Animal, Cabecita, Calendario, Campana, Filete, Heces, Plato, VasoAgua, Visto } from '../Extras';

type P2 = [number, number];

/** El estómago: una alubia rosada con su esófago y gotas de ácido que burbujean. */
function Estomago({ x, y, k = 1, o = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={6} cy={110} rx={104} ry={12} fill="#000" opacity={0.14} />
      <path d="M-56,-70 C-64,-110 -48,-134 -26,-156" fill="none" stroke="#B85A5A" strokeWidth={34} strokeLinecap="round" />
      <path d="M-56,-70 C-64,-110 -48,-134 -26,-156" fill="none" stroke="#E88A88" strokeWidth={26} strokeLinecap="round" />
      <path d="M-90,-30 C-90,-84 -8,-96 44,-62 C102,-22 112,62 52,94 C2,114 -62,94 -82,44 C-92,16 -92,-8 -90,-30 Z" fill="#B85A5A" />
      <path d="M-80,-28 C-80,-74 -6,-84 40,-54 C92,-18 100,54 48,84 C2,102 -54,84 -72,40 C-82,14 -82,-6 -80,-28 Z" fill="#E88A88" />
      <path d="M-62,-30 C-42,-58 0,-64 32,-44" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.4} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-44 + ((i * 23) % 96)} cy={-6 + ((i * 41) % 70) - 9 * Math.abs(Math.sin(reloj / 700 + i))} r={5 + (i % 3) * 2} fill="#F6E24A" opacity={0.85} />)}
    </g>
  );
}

// ─── 0 · Dos virus que viajan por el agua ───────────────────────────────────
const Viaje: Lamina = ({ p, reloj }) => {
  const comparten = p('comparten'), agua = p('agua'), fecal = p('fecal'), alimentos = p('alimentos'), estomago = p('estomago'), intestino = p('intestino'), porta = p('porta'), higado = p('higado'), infectan = p('infectan'), pequeno = p('pequeno');
  const R: P2[] = [[170, 520], [560, 560], [900, 560], [1290, 360]];
  const v = Math.min(easeOut(estomago) + easeOut(intestino) + easeOut(porta), 2.9999);
  const seg = Math.floor(v), u = v - seg;
  const pos: P2 = [lerp(R[seg][0], R[seg + 1][0], u), lerp(R[seg][1], R[seg + 1][1], u) - 44 * Math.sin(u * Math.PI) + 5 * Math.sin(reloj / 400)];
  const vis = tramo(comparten, 0, 0.4) * (1 - tramo(higado, 0.5, 1));
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué comparten el A y el E?" t={34} p={comparten} colaX={0} />
      <path d={`M${R[0][0]},${R[0][1]} C330,420 440,600 ${R[1][0]},${R[1][1]} C690,500 780,620 ${R[2][0]},${R[2][1]} C1040,640 1180,640 ${R[3][0]},${R[3][1] + 40}`} fill="none" stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" pathLength={1} opacity={0.7} />
      {/* de dónde vienen: heces → agua y alimentos */}
      <Heces x={170} y={220} k={0.8} o={tramo(fecal, 0, 0.4)} reloj={reloj} />
      <Flecha a={[170, 300]} b={[170, 388]} p={tramo(fecal, 0.2, 1)} color="#8A5428" w={8} />
      <Etiqueta x={380} y={235} txt="vía fecal-oral" color="#8A5428" p={fecal} t={28} punta="izq" />
      <VasoAgua x={170} y={520} k={0.8} o={tramo(agua, 0, 0.4)} reloj={reloj} sucia={fecal} />
      <Etiqueta x={170} y={690} txt="agua" color="#2F8FE8" p={agua} t={28} punta="arriba" />
      <Plato x={170} y={800} k={0.8} o={tramo(alimentos, 0, 0.4)} />
      <Etiqueta x={170} y={880} txt="alimentos" color="#2F8F3A" p={alimentos} t={28} punta="arriba" />
      {/* el viaje: estómago → intestino → porta → hígado */}
      <Estomago x={560} y={540} k={0.85} o={tramo(estomago, 0, 0.4)} reloj={reloj} />
      <Etiqueta x={560} y={700} txt="estómago (ácido)" color="#C25A5A" p={estomago} t={26} punta="arriba" />
      <Sale p={intestino} x={900} y={560} k={0.52}><Intestino /></Sale>
      <Etiqueta x={900} y={700} txt="intestino" color="#E8841E" p={intestino} t={26} punta="arriba" />
      <TuboCurvo a={[1000, 610]} b={[1290, 380]} c={[1200, 600]} w={38} tono={H.d} p={porta} />
      <Etiqueta x={1130} y={600} txt="vena porta" color="#7A55D8" p={porta} t={26} punta="no" />
      <Sale p={higado} x={1440} y={290} k={0.34}><Higado corte={false} /></Sale>
      {/* los dos viajeros */}
      <g opacity={vis}>
        <VirionAE x={pos[0] - 22} y={pos[1]} k={0.4} reloj={reloj} tipo="a" />
        <VirionAE x={pos[0] + 22} y={pos[1] + 6} k={0.4} reloj={reloj} tipo="e" fase={1.5} />
      </g>
      <Zoom x={1350} y={770} R={170} de={[1440, 320]} p={infectan} fondo="#FFE9F2">
        <Hepatocito x={1350} y={770} k={1.25} reloj={reloj} sem={3} infecta={H.a} brillo={infectan} />
      </Zoom>
      <Txt x={1350} y={975} txt="infectan a los hepatocitos" t={26} p={infectan} color={TXH.hep} />
      <Txt x={640} y={965} txt="un viaje largo para un virus tan pequeño" t={32} p={pequeno} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · El VHA se viste de membrana ────────────────────────────────────────
const Disfraz: Lamina = ({ p, reloj }) => {
  const virus = p('virus'), picorna = p('picornavirus'), arn = p('arn'), kb = p('kb'), heces = p('heces'), desnudo = p('desnudo'), sangre = p('sangre'), manto = p('manto'), robada = p('robada'), esconde = p('esconde');
  const VX = 1180, VY = 500;
  const camino = (u: number): P2 => [880 + u * 700, 500 + 18 * Math.sin(u * 8)];
  return (
    <g>
      {/* izquierda: en las heces, desnudo */}
      <VirionAE x={420} y={500} k={2.6} reloj={reloj} tipo="a" o={tramo(virus, 0, 0.4)} />
      <Etiqueta x={420} y={290} txt="picornavirus" color="#C25A00" p={picorna} t={34} punta="no" />
      <Heces x={190} y={690} k={0.55} o={tramo(heces, 0, 0.4)} reloj={reloj} />
      <Etiqueta x={430} y={690} txt="en las heces: desnudo" color="#8A5428" p={desnudo} t={26} punta="no" />
      <path d="M260,800 C300,760 340,840 380,800 S460,760 500,800 S580,840 620,800" fill="none" stroke="#FF8A1E" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(arn).toFixed(3)} 1`} />
      <Txt x={440} y={870} txt="ARN de cadena positiva" t={26} p={arn} color={TXH.a} />
      <Etiqueta x={440} y={930} txt="≈ 7,5 kb" color="#C25A00" p={kb} t={28} punta="no" />
      {/* derecha: en la sangre, cuasi envuelto */}
      <TuboCurvo a={[880, 500]} b={[1580, 500]} c={[1230, 470]} w={320} tono={H.endo} p={tramo(sangre, 0, 0.6)} />
      <Corre camino={camino} reloj={reloj} n={7} vel={0.00006} tono={H.sangre} R={18} sem={5} o={tramo(sangre, 0.4, 1)} />
      <Etiqueta x={1180} y={300} txt="en la sangre: cuasi envuelto" color="#E3203F" p={sangre} t={30} punta="no" />
      {/* la membrana robada a la célula */}
      <Hepatocito x={1470} y={210} k={0.5} reloj={reloj} sem={4} o={tramo(robada, 0, 0.4)} />
      <circle cx={VX} cy={VY} r={lerp(150, 112, easeOut(robada))} fill="none" stroke="#F8B8B0" strokeWidth={16} strokeDasharray="30 14" opacity={0.9 * tramo(robada, 0, 0.5)} transform={`rotate(${(reloj / 40) % 360} ${VX} ${VY})`} />
      <VirionAE x={VX} y={VY} k={2.4} reloj={reloj} tipo="a" manto={manto} fase={2} o={tramo(sangre, 0.2, 0.7)} />
      <Txt x={1180} y={700} txt="una membrana robada a la célula" t={26} p={robada} color={TXH.hep} />
      {/* los anticuerpos rebotan */}
      {[0, 1, 2, 3].map((i) => {
        const a = -0.9 + i * 0.6, d = 200 + 50 * (1 + Math.sin(reloj / 480 + i * 1.7));
        return <Anticuerpo key={i} x={VX + Math.cos(a) * d + 60} y={VY + Math.sin(a) * d} k={0.8} r={(a * 180) / Math.PI + 90} o={tramo(esconde, i * 0.1, i * 0.1 + 0.4)} />;
      })}
      <Etiqueta x={1180} y={790} txt="se esconde de los anticuerpos" color="#6A9A00" p={esconde} t={28} punta="no" />
    </g>
  );
};

// ─── 2 · La defensa mata, el virus no ───────────────────────────────────────
const Defensa: Lamina = ({ p, reloj }) => {
  const mata = p('mata'), casi = p('casi'), linfocitos = p('linfocitos'), reconocen = p('reconocen'), incubacion = p('incubacion'), semanas = p('semanas'), ninos = p('ninos'), adultos = p('adultos'), ictericia = p('ictericia'), defensa = p('defensa'), virusno = p('virusno');
  return (
    <g>
      <Globo x={640} y={90} txt="¿mata el virus a la célula?" t={34} p={mata} colaX={0} />
      <Hepatocito x={400} y={470} k={1.7} reloj={reloj} sem={3} infecta={H.a} brillo={1} apop={easeOut(reconocen)} o={tramo(mata, 0, 0.4)} />
      <Etiqueta x={400} y={690} txt="casi no la daña" color="#C25A00" p={casi} t={28} punta="arriba" />
      {[0, 1, 2].map((i) => {
        const q = easeOut(tramo(linfocitos, i * 0.12, i * 0.12 + 0.8));
        return <Linfo key={i} x={lerp(1000 + i * 40, 640 + i * 8, q)} y={330 + i * 120 + 10 * Math.sin(reloj / 400 + i)} k={0.62 * Math.min(1, q * 3)} o={tramo(linfocitos, i * 0.12, i * 0.12 + 0.3)} reloj={reloj} fase={i * 2} activo={0.4 + 0.6 * reconocen} />;
      })}
      <Etiqueta x={860} y={230} txt="linfocitos T CD8" color="#0A7F78" p={linfocitos} t={28} punta="no" />
      <Txt x={640} y={790} txt="reconocen los hepatocitos infectados" t={26} p={reconocen} color={TXH.cd8} />
      {/* la incubación y los dos finales */}
      <Etiqueta x={1250} y={180} txt="incubación" color="#8A4FE8" p={incubacion} t={28} punta="no" />
      <Calendario x={1250} y={340} k={0.95} o={tramo(semanas, 0, 0.4)} n="2–7" unidad="semanas" />
      <Sombra><Sale p={ninos} x={1010} y={700} k={0.34}><Busto quien="p2" reloj={reloj} fase={0.7} sonrisa={0.6} /></Sale></Sombra>
      <Etiqueta x={1010} y={820} txt="niños: inadvertido" color="#1FA85A" p={ninos} t={26} punta="no" />
      <Sombra><Sale p={adultos} x={1400} y={690} k={0.42}><Busto quien="p1" reloj={reloj} fase={2.2} ictericia={easeOut(ictericia)} dolor={0.3 * ictericia} /></Sale></Sombra>
      <Etiqueta x={1400} y={820} txt="adultos: ictericia" color="#C79A00" p={ictericia} t={26} punta="no" />
      <Txt x={520} y={925} txt="la defensa mata" t={36} p={defensa} color={TXH.sangre} />
      <Txt x={1020} y={925} txt="el virus, no" t={36} p={virusno} color={TXH.a} />
    </g>
  );
};

// ─── 3 · Serología y curso del VHA ──────────────────────────────────────────
const Curso: Lamina = ({ p, reloj }) => {
  const sintomas = p('sintomas'), igm = p('igm'), aguda = p('aguda'), igg = p('igg'), vida = p('vida'), nunca = p('nunca'), colestasis = p('colestasis'), recidiva = p('recidiva'), inmunidad = p('inmunidad');
  const OX = 200, OY = 820, W = 1150;
  const g = (x: number, c: number, s: number) => Math.exp(-((x - c) ** 2) / (2 * s * s));
  const muestra = (f: (x: number) => number, a: number, b: number): P2[] => Array.from({ length: 41 }, (_, i) => { const x = a + (b - a) * (i / 40); return [x * W, -f(x)] as P2; });
  const igmF = (x: number) => 340 * g(x, 0.36, 0.085);
  const iggF = (x: number) => 380 / (1 + Math.exp(-(x - 0.5) * 16));
  const alt1 = (x: number) => 300 * g(x, 0.34, 0.07) + 110 * g(x, 0.5, 0.09);
  const alt2 = (x: number) => 110 * g(x, 0.5, 0.09) + 130 * g(x, 0.74, 0.05);
  return (
    <g>
      <Eje x={OX} y={OY} w={W} alto={560} p={sintomas} marcas={[]} />
      <Txt x={OX + W - 10} y={OY + 56} txt="semanas" t={24} p={sintomas} fuerte={false} />
      {/* los síntomas */}
      <Sombra><Sale p={sintomas} x={OX + 0.34 * W} y={250} k={0.3}><Busto quien="p1" reloj={reloj} ictericia={0.7} dolor={0.5} /></Sale></Sombra>
      <Etiqueta x={OX + 0.34 * W} y={340} txt="síntomas" color="#C79A00" p={sintomas} t={26} punta="no" />
      <line x1={OX + 0.34 * W} x2={OX + 0.34 * W} y1={372} y2={OY} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="3 10" strokeLinecap="round" opacity={0.7 * tramo(sintomas, 0.3, 1)} />
      {/* curvas */}
      <Curva x={OX} y={OY} pts={muestra(alt1, 0.08, 0.62)} color="#FFC81E" oscuro="#C79A00" p={colestasis} grosor={9} />
      <Curva x={OX} y={OY} pts={muestra(alt2, 0.5, 0.95)} color="#FFC81E" oscuro="#C79A00" p={recidiva} grosor={9} />
      <Curva x={OX} y={OY} pts={muestra(igmF, 0.12, 0.7)} color="#A8DC1E" oscuro="#6A9A00" p={igm} />
      <Curva x={OX} y={OY} pts={muestra(iggF, 0.2, 1)} color="#4F7FF0" oscuro="#1E4FC0" p={igg} />
      <Txt x={OX + 0.36 * W + 90} y={OY - 380} txt="IgM" t={32} p={igm} color={TXH.ac} />
      <Etiqueta x={OX + 0.36 * W + 250} y={OY - 400} txt="infección aguda" color="#6A9A00" p={aguda} t={26} punta="no" />
      <Txt x={OX + W - 50} y={OY - 420} txt="IgG" t={32} p={igg} color={TXH.b} />
      <Etiqueta x={OX + 0.8 * W} y={OY - 470} txt="de por vida: protege" color="#1E4FC0" p={vida} t={26} punta="no" />
      <Txt x={OX + 0.62 * W} y={OY - 160} txt="colestasis prolongada" t={24} p={colestasis} color={TXH.biliI} />
      <Txt x={OX + 0.8 * W} y={OY - 130} txt="recidiva" t={24} p={recidiva} color={TXH.biliI} />
      {/* nunca cronifica */}
      <g opacity={tramo(nunca, 0, 0.4)}>
        <path d={`M${OX + 0.9 * W},${OY - 100} L${OX + 1.0 * W},${OY - 230}`} stroke="var(--cit-flecha)" strokeWidth={8} strokeDasharray="4 14" strokeLinecap="round" fill="none" />
        <path d={`M${OX + 0.9 * W - 40},${OY - 280} L${OX + 0.9 * W + 40},${OY - 200} M${OX + 0.9 * W + 40},${OY - 280} L${OX + 0.9 * W - 40},${OY - 200}`} stroke="#E5324C" strokeWidth={14} strokeLinecap="round" />
      </g>
      <Etiqueta x={OX + 0.9 * W} y={OY - 330} txt="nunca se cronifica" color="#B8237A" p={nunca} t={26} punta="no" />
      <Sale p={inmunidad} x={OX + 0.3 * W} y={OY + 90}><Visto x={0} y={0} k={0.9} p={1} /></Sale>
      <Txt x={OX + 0.55 * W} y={OY + 96} txt="se va y deja inmunidad" t={32} p={inmunidad} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · La histología del VHA ──────────────────────────────────────────────
const HistoA: Lamina = ({ p, reloj }) => {
  const microscopio = p('microscopio'), periportal = p('periportal'), plasmocitos = p('plasmocitos'), interfase = p('interfase'), councilman = p('councilman'), colestasis = p('colestasis'), patron = p('patron'), reconocelo = p('reconocelo');
  const CX = 520, CY = 500;
  return (
    <g>
      <Ocular x={CX} y={CY} R={330} id="hv-o6" reloj={reloj} o={tramo(microscopio, 0, 0.4)}>
        {/* hepatocitos alrededor, con los atacados por la interfase y los cuerpos de Councilman */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * 6.28 + 0.2, d = 255 + 12 * Math.sin(i * 2.1);
          return <Hepatocito key={i} x={CX + Math.cos(a) * d} y={CY + Math.sin(a) * d * 0.92} k={0.48} reloj={reloj} fase={i} sem={i + 1} apop={(i === 2 || i === 8) ? councilman : 0} />;
        })}
        {[[CX - 190, CY + 60], [CX + 200, CY - 90], [CX + 40, CY + 215]].map(([bx, by], i) => <g key={i} opacity={tramo(colestasis, i * 0.2, i * 0.2 + 0.5)}><ellipse cx={bx} cy={by} rx={11} ry={30} fill={H.bilis[0]} transform={`rotate(${i * 50} ${bx} ${by})`} /><ellipse cx={bx} cy={by} rx={7} ry={24} fill={H.bilis[1]} transform={`rotate(${i * 50} ${bx} ${by})`} /></g>)}
        {/* el espacio porta y su cinturón de plasmocitos y linfocitos */}
        <g opacity={tramo(periportal, 0, 0.5)}><Triada x={CX} y={CY} k={0.95} reloj={reloj} /></g>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * 6.28, q = tramo(plasmocitos, i / 14, i / 14 + 0.3);
          return <Plasmatica key={i} x={CX + Math.cos(a) * (152 + 8 * Math.sin(reloj / 700 + i))} y={CY + Math.sin(a) * (140 + 8 * Math.cos(reloj / 800 + i))} k={0.5 * q} o={q} r={i * 36} />;
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * 6.28 + 0.6, q = tramo(interfase, i / 9, i / 9 + 0.3);
          return <Linfo key={i} x={CX + Math.cos(a) * 200} y={CY + Math.sin(a) * 186} k={0.3 * q} o={q} reloj={reloj} fase={i} activo={0.4} receptores={5} />;
        })}
      </Ocular>
      <Nota x={1150} y={230} txt="inflamación periportal" p={periportal} color={TXH.cd8} />
      <Nota x={1150} y={325} txt="muchos plasmocitos" p={plasmocitos} color={TXH.hep} />
      <Nota x={1150} y={420} txt="hepatitis de interfase" p={interfase} color={TXH.sangre} />
      <Nota x={1150} y={515} txt="cuerpos de Councilman" p={councilman} color={TXH.d} />
      <Nota x={1150} y={610} txt="a veces, colestasis" p={colestasis} color={TXH.bilis} />
      <Etiqueta x={1130} y={750} txt="patrón periportal con plasmocitos" color="#B8237A" p={patron} t={28} punta="no" />
      <Sale p={reconocelo} x={1420} y={850}><Sello ok /></Sale>
      <Txt x={1160} y={860} txt="reconócelo" t={36} p={reconocelo} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · VHE: genotipos 1-2 y 3-4 ───────────────────────────────────────────
const DosMundos: Lamina = ({ p, reloj }) => {
  const virus = p('virus'), g12 = p('g12'), agua = p('agua'), brotes = p('brotes'), embarazo = p('embarazo'), g34 = p('g34'), zoo = p('zoo'), cerdo = p('cerdo'), jabali = p('jabali'), siervo = p('siervo'), carne = p('carne'), cronificar = p('cronificar'), inmuno = p('inmuno'), mundos = p('mundos');
  return (
    <g>
      <Globo x={800} y={90} txt="virus E: ¿una enfermedad o dos?" t={34} p={virus} colaX={0} />
      <line x1={800} x2={800} y1={190} y2={900} stroke="var(--cit-flecha)" strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" opacity={0.6 * tramo(virus, 0.3, 1)} />
      {/* mundo 1: genotipos 1 y 2, el agua y los brotes */}
      <Etiqueta x={400} y={200} txt="genotipos 1 y 2" color="#2F8FE8" p={g12} t={32} punta="no" />
      <VasoAgua x={190} y={440} k={0.72} o={tramo(agua, 0, 0.4)} reloj={reloj} sucia={1}>
        <VirionAE x={-18} y={20} k={0.34} reloj={reloj} tipo="e" /><VirionAE x={24} y={64} k={0.34} reloj={reloj} tipo="e" fase={1.4} />
      </VasoAgua>
      <Etiqueta x={190} y={610} txt="agua contaminada" color="#2F8FE8" p={agua} t={24} punta="arriba" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Cabecita key={i} x={310 + (i % 4) * 84 + (i > 3 ? 42 : 0)} y={i > 3 ? 760 : 660} k={0.56} reloj={reloj} fase={i} o={tramo(brotes, i * 0.06, i * 0.06 + 0.3)} amarillo={easeOut(tramo(brotes, 0.3 + i * 0.08, 0.7 + i * 0.08))} />)}
      <Txt x={470} y={850} txt="brotes" t={30} p={brotes} color={TXH.e} />
      <Sombra><Sale p={embarazo} x={600} y={400} k={0.42}><Busto quien="madre" reloj={reloj} fase={1.2} dolor={0.5} /></Sale></Sombra>
      <Campana x={720} y={330} k={0.42} o={tramo(embarazo, 0, 0.4)} suena={embarazo} reloj={reloj} />
      <Etiqueta x={600} y={540} txt="graves en el embarazo" color="#B8237A" p={embarazo} t={24} punta="no" />
      {/* mundo 2: genotipos 3 y 4, los animales */}
      <Etiqueta x={1200} y={200} txt="genotipos 3 y 4" color="#B8601E" p={g34} t={32} punta="no" />
      <Etiqueta x={1200} y={268} txt="zoonóticos" color="#8A6A12" p={zoo} t={26} punta="no" />
      <Animal x={960} y={470} k={0.5} tipo="cerdo" reloj={reloj} fase={0.3} o={tramo(cerdo, 0, 0.4)} />
      <Animal x={1210} y={470} k={0.5} tipo="jabali" reloj={reloj} fase={1.9} o={tramo(jabali, 0, 0.4)} />
      <Animal x={1450} y={490} k={0.5} tipo="ciervo" reloj={reloj} fase={3.1} o={tramo(siervo, 0, 0.4)} />
      <Txt x={950} y={610} txt="cerdo" t={26} p={cerdo} /><Txt x={1200} y={610} txt="jabalí" t={26} p={jabali} /><Txt x={1440} y={610} txt="ciervo" t={26} p={siervo} />
      <Filete x={1000} y={760} k={0.8} o={tramo(carne, 0, 0.4)} cocido={0.25} />
      <Etiqueta x={1000} y={860} txt="carne poco cocida" color="#B2243C" p={carne} t={26} punta="arriba" />
      <Sombra><Sale p={inmuno} x={1380} y={750} k={0.4}><Busto quien="p1" reloj={reloj} fase={2.6} dolor={0.4} /></Sale></Sombra>
      <Etiqueta x={1380} y={860} txt="inmunodeprimidos" color="#7A55D8" p={inmuno} t={26} punta="no" />
      <Txt x={1380} y={920} txt="pueden cronificar" t={26} p={cronificar} color={TXH.sangre} />
      <Txt x={800} y={970} txt="misma letra, dos mundos" t={38} p={mundos} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · VHE: más allá del hígado ───────────────────────────────────────────
const MasAlla: Lamina = ({ p, reloj }) => {
  const no = p('no'), neuro = p('neuro'), gb = p('gb'), amiotrofia = p('amiotrofia'), renales = p('renales'), trasplantados = p('trasplantados'), g3 = p('g3'), cirrosis = p('cirrosis'), ribavirina = p('ribavirina'), cura = p('cura'), pregunta = p('pregunta');
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Sale p={no} x={330} y={480} k={0.55}><Higado corte={false} /></Sale>
      {[0, 1, 2, 3, 4].map((i) => {
        const u = ((reloj / 2600 + i / 5) % 1), a = -0.9 + i * 0.45;
        return <VirionAE key={i} x={330 + Math.cos(a) * (90 + u * 250)} y={480 + Math.sin(a) * (60 + u * 190)} k={0.36} reloj={reloj} tipo="e" fase={i} o={Math.sin(u * Math.PI) * tramo(no, 0.3, 1)} />;
      })}
      <Etiqueta x={330} y={250} txt="no se queda en el hígado" color="#8A6A12" p={no} t={28} punta="no" />
      <Flecha a={[470, 430]} b={[640, 300]} c={[540, 340]} p={tramo(neuro, 0, 0.8)} color="var(--cit-flecha)" w={7} />
      <Flecha a={[470, 540]} b={[700, 650]} c={[580, 640]} p={tramo(renales, 0, 0.8)} color="var(--cit-flecha)" w={7} />
      <Nervio x={900} y={260} k={0.55} w={640} o={tramo(neuro, 0, 0.4)} isquemia={easeOut(gb)} />
      <Etiqueta x={900} y={170} txt="síntomas neurológicos" color="#7A55D8" p={neuro} t={28} punta="no" />
      <Nota x={900} y={350} txt="síndrome de Guillain-Barré" p={gb} color={TXH.d} />
      <Nota x={900} y={405} txt="amiotrofia neurálgica" p={amiotrofia} color={TXH.d} />
      <Sale p={renales} x={900} y={650} k={0.9}><Rinon /></Sale>
      <Etiqueta x={900} y={780} txt="también renales" color="#B8237A" p={renales} t={28} punta="arriba" />
      {/* trasplantados */}
      <Sombra><Sale p={trasplantados} x={1330} y={290} k={0.4}><Busto quien="p1" reloj={reloj} fase={1.1} dolor={0.3} /></Sale></Sombra>
      <Etiqueta x={1330} y={400} txt="trasplantados" color="#7A55D8" p={trasplantados} t={28} punta="no" />
      <Etiqueta x={1330} y={460} txt="genotipo 3: se cronifica" color="#B8601E" p={g3} t={26} punta="no" />
      <Sale p={cirrosis} x={1330} y={620} k={0.36}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /><circle cx={-8} cy={-10} r={6} fill="#FFF" opacity={0.5} /></g>)}</Sale>
      <Etiqueta x={1330} y={750} txt="y puede llevar a cirrosis" color="#8A3A1E" p={cirrosis} t={26} punta="no" />
      <Sale p={ribavirina} x={1000} y={880}><Capsula k={1.3} reloj={reloj} /></Sale>
      <Etiqueta x={1150} y={880} txt="ribavirina" color="#8A4FE8" p={ribavirina} t={28} punta="no" />
      <Visto x={1300} y={880} k={0.9} p={cura} />
      <Txt x={1470} y={880} txt="ayuda a curarlo" t={26} p={cura} color={TXH.c} />
      <Txt x={640} y={975} txt="¿un virus del hígado que daña nervios?" t={34} p={pregunta} color={TXH.hep} />
    </g>
  );
};

// ─── 7 · Diagnóstico y prevención ───────────────────────────────────────────
const Prevenir: Lamina = ({ p, reloj }) => {
  const dx = p('dx'), a = p('a'), igma = p('igma'), e = p('e'), igme = p('igme'), arn = p('arn'), heces = p('heces'), prev = p('prev'), agua = p('agua'), alimentos = p('alimentos'), vacA = p('vacA'), peru = p('peru'), dosis = p('dosis'), meses = p('meses'), noE = p('noE'), mejor = p('mejor');
  const insignia = (x: number, y: number, l: string, c: string, q: number) => (
    <Sale p={q} x={x} y={y}><circle cx={3} cy={4} r={42} fill="#000" opacity={0.16} /><circle r={42} fill={c} /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 46, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{l}</text></Sale>
  );
  return (
    <g>
      <Etiqueta x={430} y={110} txt="diagnóstico" color="#8A4FE8" p={dx} t={32} punta="no" />
      {insignia(190, 290, 'A', '#FF8A1E', a)}
      <Sale p={igma} x={400} y={290} k={0.6}><TuboEnsayo x={0} y={0} k={1} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={400} y={430} txt="IgM" color="#6A9A00" p={igma} t={28} punta="arriba" />
      {insignia(190, 590, 'E', '#D4A21E', e)}
      <Sale p={igme} x={400} y={590} k={0.6}><TuboEnsayo x={0} y={0} k={1} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={400} y={730} txt="IgM" color="#6A9A00" p={igme} t={28} punta="arriba" />
      <Sale p={arn} x={560} y={590} k={0.6}><TuboEnsayo x={0} y={0} k={1} color="#3FD467" nivel={0.6} reloj={reloj} /></Sale>
      <Etiqueta x={560} y={730} txt="ARN" color="#138A3A" p={arn} t={28} punta="arriba" />
      <Heces x={730} y={600} k={0.45} o={tramo(heces, 0, 0.4)} reloj={reloj} />
      <Etiqueta x={730} y={730} txt="ARN en heces" color="#8A5428" p={heces} t={24} punta="arriba" />
      <Etiqueta x={1200} y={110} txt="prevención" color="#1FA85A" p={prev} t={32} punta="no" />
      <VasoAgua x={1000} y={330} k={0.5} o={tramo(agua, 0, 0.4)} reloj={reloj} />
      <Visto x={1090} y={250} k={0.7} p={agua} />
      <Etiqueta x={1000} y={450} txt="agua segura" color="#2F8FE8" p={agua} t={24} punta="arriba" />
      <Plato x={1260} y={340} k={0.62} o={tramo(alimentos, 0, 0.4)} />
      <Visto x={1350} y={250} k={0.7} p={alimentos} />
      <Etiqueta x={1260} y={450} txt="alimentos seguros" color="#2F8F3A" p={alimentos} t={24} punta="arriba" />
      <Sale p={vacA} x={1010} y={640} k={1.1}><Jeringa /></Sale>
      <Etiqueta x={1010} y={760} txt="vacuna contra el A" color="#FF8A1E" p={vacA} t={26} punta="arriba" />
      <Etiqueta x={1260} y={580} txt="en el Perú" color="#E5324C" p={peru} t={28} punta="no" />
      <Calendario x={1260} y={680} k={0.62} o={tramo(meses, 0, 0.4)} n="15" unidad="meses" />
      <Etiqueta x={1260} y={790} txt="dosis única" color="#E5324C" p={dosis} t={26} punta="no" />
      <Sale p={noE} x={1480} y={640} k={1.1}><Jeringa /></Sale>
      <g opacity={tramo(noE, 0.3, 0.8)}><path d="M1430,590 L1530,690 M1530,590 L1430,690" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" /></g>
      <Etiqueta x={1470} y={765} txt="E: sin vacuna" color="#D4A21E" p={noE} t={26} punta="no" />
      <Txt x={800} y={940} txt="agua segura es la mejor vacuna" t={44} p={mejor} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Viaje, Disfraz, Defensa, Curso, HistoA, DosMundos, MasAlla, Prevenir];
export default LAMINAS;
