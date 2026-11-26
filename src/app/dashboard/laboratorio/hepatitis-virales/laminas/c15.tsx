'use client';
// Capítulo 15 · Tratamiento del VHB: antes y ahora
//
// La meta con dos banderas (supresión y cura funcional, como la línea de tiempo de la referencia), los dos grupos de pastillas con sus
// fosfatos que se suman, la cadena de ADN viral que crece y el análogo que la detiene (el tenofovir al instante, el entecavir unas bases
// después), el profármaco que se activa dentro del hepatocito (TAF frente a TDF), el interferón y su receptor, y lo que los análogos logran
// y no logran: calman el incendio pero dejan intacto el cccDNA.

import type { Lamina } from '../Lienzo';
import { Fosfato, CelulaCorte, Proteasoma } from '../../sepsis/Piezas';
import { Rinon } from '../../vasculitis-anca/Piezas';
import { Tijera } from '../../bilirrubina/Piezas';
import { Busto, Capsula, Etiqueta, Flecha, Globo, Higado, Linfo, Llama, Sale, Sombra, TXH, Toro, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Colageno, Hepatocito } from '../Higado';
import { BarraLab } from '../Clinica';
import { Calendario, Campana, Fact, Luz, Tacha, Tumor, Visto } from '../Extras';

type P2 = [number, number];
const VERDE = ['#138A3A', '#3FD467'] as const;

/** Una pastilla con su nombre. */
function Pastilla({ x, y, k = 1.4, tono, reloj, nombre, q, opaco = 1 }: { x: number; y: number; k?: number; tono: readonly string[]; reloj: number; nombre: string; q: number; opaco?: number }) {
  return (
    <g>
      <Sale p={q} x={x} y={y}><g opacity={opaco}><Capsula k={k} tono={tono} reloj={reloj} /></g></Sale>
      <Etiqueta x={x} y={y + 80} txt={nombre} color={tono[0]} p={q} t={26} punta="no" />
    </g>
  );
}

// ─── 0 · Qué se busca ───────────────────────────────────────────────────────
const QueSeBusca: Lamina = ({ p, reloj }) => {
  const busca = p('busca'), suprimirlo = p('suprimirlo'), alt = p('alt'), fibrosis = p('fibrosis'), cancer = p('cancer'), meta = p('meta'), cura = p('cura'), hbsag = p('hbsag'), adn = p('adn'), indetectables = p('indetectables'), semanas = p('semanas'), parar = p('parar'), hoy = p('hoy'), curar = p('curar');
  return (
    <g>
      <Globo x={640} y={90} txt="¿qué se busca al tratar el virus B?" t={34} p={busca} colaX={0} />
      {/* bandera 1: suprimir */}
      <circle cx={420} cy={250} r={42} fill="#2F55E0" opacity={tramo(suprimirlo, 0, 0.4)} /><text x={420} y={250} dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit', opacity: tramo(suprimirlo, 0.2, 0.6) }}>1</text>
      <Etiqueta x={420} y={330} txt="suprimirlo de forma sostenida" color="#2F55E0" p={suprimirlo} t={26} punta="no" />
      <BarraLab x={250} y={800} w={70} alto={330} val={0.06} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={suprimirlo} nombre="ADN" valor="indetectable" t={22} />
      <BarraLab x={400} y={800} w={70} alto={330} val={0.06} max={1} color="#FFC81E" oscuro="#C79A00" norm={0.1} p={alt} nombre="ALT" valor="normal" t={22} />
      <Colageno x={620} y={450} w={170} h={36} n={3} p={fibrosis} reloj={reloj} /><Tacha x={620} y={450} r={44} p={fibrosis} /><Txt x={620} y={520} txt="frenar la fibrosis" t={22} p={fibrosis} color={TXH.colageno} />
      <Tumor x={620} y={650} k={0.55} reloj={reloj} o={tramo(cancer, 0, 0.4)} /><Tacha x={620} y={650} r={44} p={cancer} /><Txt x={620} y={730} txt="y el cáncer" t={22} p={cancer} color={TXH.hep} />
      {/* bandera 2: la cura funcional */}
      <circle cx={1180} cy={250} r={42} fill="#1FA85A" opacity={tramo(meta, 0, 0.4)} /><text x={1180} y={250} dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit', opacity: tramo(meta, 0.2, 0.6) }}>2</text>
      <Txt x={1180} y={325} txt="la meta última" t={26} p={meta} color={TXH.c} />
      <Etiqueta x={1180} y={385} txt="la cura funcional" color="#1FA85A" p={cura} t={32} punta="no" />
      <Fact x={1010} y={520} R={50} tono={H.b} txt="HBsAg" t={22} p={hbsag} /><Tacha x={1010} y={520} r={44} p={indetectables} />
      <Fact x={1170} y={520} R={50} tono={H.adn} txt="ADN" t={26} p={adn} /><Tacha x={1170} y={520} r={44} p={indetectables} />
      <Txt x={1090} y={610} txt="indetectables" t={28} p={indetectables} color={TXH.b} />
      <Calendario x={1400} y={520} k={0.7} o={tramo(semanas, 0, 0.4)} n="24" unidad="semanas" />
      <Sale p={parar} x={1120} y={760}><Capsula k={1.5} reloj={reloj} /></Sale><Tacha x={1120} y={760} r={50} p={parar} />
      <Txt x={1120} y={850} txt="después de parar el tratamiento" t={24} p={parar} color={TXH.hep} />
      <Txt x={500} y={950} txt="suprimir hoy," t={38} p={hoy} color={TXH.b} />
      <Txt x={1020} y={950} txt="curar mañana" t={38} p={curar} color={TXH.c} />
    </g>
  );
};

// ─── 1 · Dos grupos de análogos ─────────────────────────────────────────────
const DosGrupos: Lamina = ({ p, reloj }) => {
  const grupos = p('grupos'), nucleotidos = p('nucleotidos'), tenofovir = p('tenofovir'), adefovir = p('adefovir'), fosforilaciones = p('fosforilaciones'), nucleosidos = p('nucleosidos'), entecavir = p('entecavir'), lamivudina = p('lamivudina'), tres = p('tres'), alta = p('alta'), resistencia = p('resistencia'), usan = p('usan'), familias = p('familias'), blanco = p('blanco');
  const escudo = (x: number, y: number, q: number, tenue: number) => (
    <g opacity={tramo(q, 0, 0.4) * tenue} transform={`translate(${x},${y})`}>
      <path d="M0,-40 L34,-26 L34,12 C34,32 14,44 0,50 C-14,44 -34,32 -34,12 L-34,-26 Z" fill="#1FA85A" /><path d="M-14,2 L-4,14 L16,-12" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      <Globo x={800} y={90} txt="dos grupos de análogos" t={34} p={grupos} colaX={0} />
      {/* nucleótidos: dos fosforilaciones */}
      <Etiqueta x={420} y={210} txt="análogos de nucleótidos" color="#8A4FE8" p={nucleotidos} t={28} punta="no" />
      <Pastilla x={290} y={380} tono={['#5A22A8', '#8A4FE8', '#D2B8FF']} reloj={reloj} nombre="tenofovir" q={tenofovir} />
      <Pastilla x={560} y={380} tono={['#5A22A8', '#B58AE8', '#E8DAFF']} reloj={reloj} nombre="adefovir" q={adefovir} opaco={1 - 0.6 * usan} />
      {[0, 1].map((i) => <Sale key={i} p={tramo(fosforilaciones, i * 0.3, i * 0.3 + 0.5)} x={380 + i * 80} y={560}><Fosfato /></Sale>)}
      <Txt x={420} y={630} txt="necesitan 2 fosforilaciones" t={24} p={fosforilaciones} color={TXH.d} />
      {/* nucleósidos: tres fosforilaciones */}
      <Etiqueta x={1180} y={210} txt="análogos de nucleósidos" color="#C2540A" p={nucleosidos} t={28} punta="no" />
      <Pastilla x={1050} y={380} tono={['#C2540A', '#FF8A1E', '#FFD0A0']} reloj={reloj} nombre="entecavir" q={entecavir} />
      <Pastilla x={1320} y={380} tono={['#C2540A', '#FFB070', '#FFE0C8']} reloj={reloj} nombre="lamivudina" q={lamivudina} opaco={1 - 0.6 * usan} />
      {[0, 1, 2].map((i) => <Sale key={i} p={tramo(tres, i * 0.25, i * 0.25 + 0.5)} x={1120 + i * 80} y={560}><Fosfato /></Sale>)}
      <Txt x={1180} y={630} txt="necesitan 3 fosforilaciones" t={24} p={tres} color={TXH.a} />
      {/* la barrera a la resistencia */}
      {escudo(290, 790, alta, 1)}{escudo(1050, 790, alta, 1)}
      <Txt x={170} y={870} txt="alta barrera a la resistencia" t={22} p={resistencia} ancla="start" color={TXH.c} /><Txt x={930} y={870} txt="alta barrera a la resistencia" t={22} p={resistencia} ancla="start" color={TXH.c} />
      <Txt x={560} y={800} txt="ya casi no se usan" t={22} p={usan} color={TXH.gris} /><Txt x={1320} y={800} txt="ya casi no se usan" t={22} p={usan} color={TXH.gris} />
      <Txt x={560} y={950} txt="dos familias," t={36} p={familias} color={TXH.hep} />
      <Etiqueta x={1040} y={950} txt="un mismo blanco" color="#B8237A" p={blanco} t={34} punta="no" />
    </g>
  );
};

// ─── 2 · Cómo frenan al virus ───────────────────────────────────────────────
const ComoFrenan: Lamina = ({ p, reloj }) => {
  const frenan = p('frenan'), inhiben = p('inhiben'), retro = p('retro'), tenofovir = p('tenofovir'), datp = p('datp'), termina = p('termina'), entecavir = p('entecavir'), dgtp = p('dgtp'), conserva = p('conserva'), detiene = p('detiene'), bases = p('bases'), todos = p('todos');
  const cadena = (y: number, n: number, col: string[], q: number) => Array.from({ length: n }, (_, i) => (
    <g key={i} opacity={tramo(q, i / (n + 2), i / (n + 2) + 0.3)}><circle cx={300 + i * 70 + 3} cy={y + 5} r={26} fill="#000" opacity={0.15} /><circle cx={300 + i * 70} cy={y} r={26} fill={col[i % col.length]} /><circle cx={300 + i * 70 - 8} cy={y - 8} r={6} fill="#FFF" opacity={0.7} /></g>
  ));
  const base = ['#2F55E0', '#1FA85A', '#E8841E', '#8A4FE8'];
  return (
    <g>
      <Globo x={800} y={90} txt="¿cómo frenan al virus?" t={34} p={frenan} colaX={0} />
      <Txt x={800} y={170} txt="inhiben la retrotranscriptasa dentro de la cápside" t={26} p={inhiben} color={TXH.b} />
      <Sale p={retro} x={1180} y={330} k={2.2}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /></Sale><Sale p={retro} x={1180} y={640} k={2.2}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /></Sale>
      {/* tenofovir: imita al dATP y termina la cadena al instante */}
      <Fact x={150} y={330} R={50} tono={H.a} txt="dATP" t={22} p={datp} />
      {cadena(330, 6, base, tenofovir)}
      <Sale p={tenofovir} x={300 + 6 * 70} y={330}><circle r={30} fill="#9E0B2E" /><circle cx={-3} cy={-3} r={26} fill="#E5324C" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>TFV</text></Sale>
      <g opacity={tramo(termina, 0, 0.5)} transform={`translate(${300 + 7 * 70 + 6},330)`}><polygon points="-26,-52 26,-52 52,-26 52,26 26,52 -26,52 -52,26 -52,-26" transform="scale(0.6)" fill="#E5324C" /><rect x={-18} y={-5} width={36} height={10} rx={4} fill="#FFF" /></g>
      <Etiqueta x={380} y={420} txt="tenofovir imita al dATP" color="#E5324C" p={tenofovir} t={26} punta="no" />
      <Txt x={800} y={420} txt="sin 3′-OH, termina la cadena" t={26} p={termina} color={TXH.sangre} />
      {/* entecavir: imita al dGTP y detiene unas bases después */}
      <Fact x={150} y={640} R={50} tono={H.c} txt="dGTP" t={22} p={dgtp} />
      {cadena(640, 5, base, entecavir)}
      <Sale p={entecavir} x={300 + 5 * 70} y={640}><circle r={30} fill="#9A5A00" /><circle cx={-3} cy={-3} r={26} fill="#FF8A1E" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>ETV</text></Sale>
      {[0, 1].map((i) => <g key={i} opacity={tramo(bases, i * 0.3, i * 0.3 + 0.4)}><circle cx={300 + (6 + i) * 70} cy={640} r={26} fill={base[i + 1]} /><circle cx={300 + (6 + i) * 70 - 8} cy={632} r={6} fill="#FFF" opacity={0.7} /></g>)}
      <g opacity={tramo(detiene, 0, 0.5)} transform={`translate(${300 + 8 * 70 + 6},640)`}><polygon points="-26,-52 26,-52 52,-26 52,26 26,52 -26,52 -52,26 -52,-26" transform="scale(0.6)" fill="#E5324C" /><rect x={-18} y={-5} width={36} height={10} rx={4} fill="#FFF" /></g>
      <Etiqueta x={380} y={730} txt="entecavir imita al dGTP" color="#C2540A" p={entecavir} t={26} punta="no" />
      <Txt x={800} y={730} txt="conserva un hidroxilo equivalente al 3′" t={24} p={conserva} color={TXH.a} />
      <Txt x={980} y={800} txt="y detiene la cadena unas bases después" t={26} p={detiene} color={TXH.sangre} />
      <Txt x={800} y={950} txt="no todos los análogos terminan igual" t={34} p={todos} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Del profármaco a la forma activa ───────────────────────────────────
const Profarmaco: Lamina = ({ p, reloj }) => {
  const activan = p('activan'), entran = p('entran'), profarmacos = p('profarmacos'), cinasas = p('cinasas'), difosfato = p('difosfato'), nucleotidos = p('nucleotidos'), trifosfato = p('trifosfato'), nucleosidos = p('nucleosidos'), taf = p('taf'), mejor = p('mejor'), tdf = p('tdf'), rinon = p('rinon'), hueso = p('hueso'), peru = p('peru'), resolucion = p('resolucion');
  return (
    <g>
      <Globo x={640} y={90} txt="¿cómo se activan estas pastillas?" t={34} p={activan} colaX={0} />
      {/* la pastilla entra al hepatocito como profármaco inactivo */}
      <Hepatocito x={420} y={520} k={2.0} reloj={reloj} sem={3} o={tramo(entran, 0, 0.4)} />
      <Sale p={entran} x={lerp(110, 420, easeOut(entran))} y={lerp(300, 520, easeOut(entran))}><g opacity={0.5 + 0.5 * tramo(cinasas, 0, 1)}><Capsula k={1.3} reloj={reloj} /></g></Sale>
      <Etiqueta x={140} y={170} txt="profármaco inactivo" color="#6E6478" p={profarmacos} t={26} punta="no" />
      <Txt x={420} y={780} txt="las cinasas del huésped lo fosforilan" t={24} p={cinasas} color={TXH.d} />
      {[0, 1, 2].map((i) => <Sale key={i} p={i < 2 ? tramo(difosfato, i * 0.3, i * 0.3 + 0.5) : tramo(trifosfato, 0, 0.6)} x={500 + i * 60} y={430 + 40 * i}><Fosfato /></Sale>)}
      <Etiqueta x={870} y={330} txt="hasta difosfato" color="#8A4FE8" p={difosfato} t={26} punta="no" /><Txt x={870} y={380} txt="los nucleótidos" t={22} p={nucleotidos} color={TXH.d} />
      <Etiqueta x={870} y={470} txt="o hasta trifosfato" color="#C2540A" p={trifosfato} t={26} punta="no" /><Txt x={870} y={520} txt="los nucleósidos" t={22} p={nucleosidos} color={TXH.a} />
      {/* TAF frente a TDF */}
      <Etiqueta x={1180} y={200} txt="tenofovir alafenamida (TAF)" color="#1FA85A" p={taf} t={24} punta="no" />
      <Flecha a={[1050, 260]} b={[640, 470]} c={[840, 260]} p={tramo(mejor, 0, 0.8)} color="#1FA85A" w={16} />
      <Txt x={1180} y={265} txt="llega mejor al hepatocito" t={22} p={mejor} color={TXH.c} />
      <Etiqueta x={1180} y={620} txt="tenofovir disoproxilo (TDF)" color="#E8841E" p={tdf} t={24} punta="no" />
      <Flecha a={[1050, 640]} b={[700, 580]} c={[880, 650]} p={tramo(tdf, 0, 0.8)} color="#E8841E" w={6} />
      <Sale p={rinon} x={1060} y={800} k={0.6}><Rinon /></Sale><Sale p={hueso} x={1330} y={800}><rect x={-12} y={-50} width={24} height={100} rx={12} fill="#F4EBD2" /><circle cx={-16} cy={-52} r={18} fill="#F4EBD2" /><circle cx={16} cy={-52} r={18} fill="#F4EBD2" /><circle cx={-16} cy={52} r={18} fill="#F4EBD2" /><circle cx={16} cy={52} r={18} fill="#F4EBD2" /></Sale>
      <Txt x={1060} y={890} txt="menos riñón" t={22} p={rinon} color={TXH.c} /><Txt x={1330} y={890} txt="y hueso afectados" t={22} p={hueso} color={TXH.c} />
      <Etiqueta x={420} y={900} txt="en el Perú: RM 929-2026" color="#E5324C" p={peru} t={26} punta="no" />
      <Txt x={420} y={955} txt="resolución ministerial" t={22} p={resolucion} color={TXH.gris} />
    </g>
  );
};

// ─── 4 · El interferón y el brote ───────────────────────────────────────────
const Interferon: Lamina = ({ p, reloj }) => {
  const interferon = p('interferon'), pegilado = p('pegilado'), ifnar = p('ifnar'), jakstat = p('jakstat'), genes = p('genes'), degradan = p('degradan'), arn = p('arn'), silencian = p('silencian'), cccadn = p('cccadn'), brote = p('brote'), descompensacion = p('descompensacion'), contraindicado = p('contraindicado'), acelera = p('acelera'), falla = p('falla'), aliado = p('aliado');
  return (
    <g>
      <Globo x={640} y={90} txt="¿y el interferón?" t={34} p={interferon} colaX={0} />
      {/* el PEG-IFN se une a su receptor IFNAR */}
      <Sale p={pegilado} x={260} y={300}><circle r={46} fill="#8A4FE8" /><circle cx={-4} cy={-4} r={40} fill="#B58AE8" /><path d="M40,10 C80,40 60,80 100,90 S130,60 160,80" fill="none" stroke="#C9A66B" strokeWidth={10} strokeLinecap="round" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>IFN</text></Sale>
      <Etiqueta x={260} y={420} txt="interferón pegilado" color="#8A4FE8" p={pegilado} t={26} punta="no" />
      <path d="M100,520 C240,470 340,570 480,520 S660,470 760,520 L760,640 L100,640 Z" fill={H.membrana[1]} /><path d="M100,520 C240,470 340,570 480,520 S660,470 760,520" fill="none" stroke={H.membrana[0]} strokeWidth={10} />
      <Toro x={300} y={520} k={0.9} tallo={60} tono={H.toro} reloj={reloj} bombea={0} tapon={ifnar} />
      <Etiqueta x={300} y={700} txt="receptor IFNAR" color="#C77800" p={ifnar} t={26} punta="no" />
      {/* JAK-STAT enciende genes que degradan el ARN y silencian el cccDNA */}
      <g opacity={tramo(jakstat, 0, 0.4)}><circle cx={500} cy={660} r={26} fill={H.cd8[1]} /><circle cx={560} cy={660} r={26} fill={H.cd8[0]} /><path d="M520,660 L540,660" stroke="#FFF" strokeWidth={6} strokeLinecap="round" /></g>
      <Etiqueta x={530} y={730} txt="JAK-STAT" color="#0A7F78" p={jakstat} t={26} punta="no" />
      <Txt x={1100} y={200} txt="se encienden genes" t={26} p={genes} color={TXH.hep} />
      <Sale p={degradan} x={1060} y={320}><Tijera /></Sale>
      <path d="M1140,320 C1170,290 1200,350 1230,320 S1290,290 1320,320" fill="none" stroke="#FF8A1E" strokeWidth={8} strokeLinecap="round" opacity={tramo(arn, 0, 0.4)} />
      <Etiqueta x={1220} y={410} txt="degradan el ARN viral" color="#C2540A" p={arn} t={26} punta="no" />
      <g opacity={tramo(silencian, 0, 0.4)}><circle cx={1220} cy={560} r={52} fill="none" stroke="#9C92A8" strokeWidth={12} />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1220 + Math.cos(i * 1.26) * 52} cy={560 + Math.sin(i * 1.26) * 52} r={12} fill="#9C92A8" />)}</g>
      <Etiqueta x={1220} y={650} txt="silencian el cccDNA" color="#6E6478" p={cccadn} t={26} punta="no" />
      {/* en un brote o con descompensación: contraindicado */}
      <g opacity={tramo(brote, 0, 0.4)} transform="translate(300,860)"><polygon points="0,-60 56,40 -56,40" fill="#E5324C" /><polygon points="0,-44 40,30 -40,30" fill="#FFC81E" /><rect x={-5} y={-22} width={10} height={32} rx={4} fill="#3A2A22" /><circle cy={20} r={5.6} fill="#3A2A22" /></g>
      <Etiqueta x={560} y={830} txt="en un brote" color="#E5324C" p={brote} t={26} punta="no" /><Txt x={560} y={880} txt="o con descompensación" t={24} p={descompensacion} color={TXH.sangre} />
      <Etiqueta x={560} y={950} txt="contraindicado" color="#9E0B2E" p={contraindicado} t={30} punta="no" />
      <Sale p={acelera} x={860} y={850} k={0.38}><Higado corte={false} /></Sale><Sale p={falla} x={860} y={830} k={0.9}><Llama /></Sale>
      <Txt x={1230} y={800} txt="acelera la destrucción" t={24} p={acelera} color={TXH.sangre} /><Txt x={1230} y={850} txt="y puede precipitar una falla hepática" t={22} p={falla} color={TXH.sangre} />
      <Txt x={1000} y={965} txt="un aliado del sistema inmune que ahora sobra" t={24} p={aliado} color={TXH.hep} />
      <Campana x={1480} y={760} k={0.5} o={tramo(contraindicado, 0, 0.4)} suena={contraindicado} reloj={reloj} />
    </g>
  );
};

// ─── 5 · Lo que logran en el paciente 1 ─────────────────────────────────────
const Logran: Lamina = ({ p, reloj }) => {
  const logran = p('logran'), paciente = p('paciente'), bajan = p('bajan'), adn = p('adn'), antigenos = p('antigenos'), cd8 = p('cd8'), calman = p('calman'), alt = p('alt'), ast = p('ast'), bilis = p('bilis'), inr = p('inr'), higado = p('higado'), tumor = p('tumor'), reseccion = p('reseccion'), calmar = p('calmar');
  const barra = (x: number, nombre: string, antes: number, despues: number, q: number, col: string[]) => (
    <g>
      <rect x={x - 33} y={760 - 300} width={66} height={300} rx={33} fill="#FFF" opacity={0.28 * tramo(q, 0, 0.4)} />
      <rect x={x - 33} y={760 - antes * 300} width={66} height={antes * 300} rx={33} fill={col[1]} opacity={0.3 * tramo(q, 0, 0.4)} />
      <rect x={x - 33} y={760 - lerp(antes, despues, easeOut(q)) * 300} width={66} height={lerp(antes, despues, easeOut(q)) * 300} rx={33} fill={col[1]} opacity={tramo(q, 0, 0.3)} />
      <Txt x={x} y={800} txt={nombre} t={24} p={q} />
    </g>
  );
  return (
    <g>
      <Globo x={640} y={90} txt="¿qué logran en el paciente 1?" t={34} p={logran} colaX={0} />
      <Sombra><Sale p={paciente} x={300} y={290} k={0.42}><Busto quien="p1" reloj={reloj} fase={0.5} ictericia={0.7 * (1 - easeOut(inr))} sonrisa={0.5 * easeOut(inr)} /></Sale></Sombra>
      {barra(120, 'ADN', 0.95, 0.06, adn, ['#1E4FC0', '#4F7FF0'])}{barra(250, 'ALT', 0.95, 0.08, alt, ['#C79A00', '#FFC81E'])}{barra(380, 'AST', 0.7, 0.07, ast, ['#C2540A', '#FF8A1E'])}{barra(510, 'INR', 0.6, 0.2, inr, ['#A8203A', '#F0495F'])}
      <Txt x={320} y={190} txt="bajan rápido el ADN" t={26} p={bajan} color={TXH.b} />
      <Txt x={850} y={300} txt="y con él, los antígenos en la superficie" t={24} p={antigenos} color={TXH.b} /><Txt x={850} y={335} txt="del hepatocito" t={24} p={antigenos} color={TXH.b} />
      <Linfo x={900} y={460} k={0.85} reloj={reloj} activo={1 - easeOut(calman)} o={tramo(cd8, 0, 0.4)} />
      <Etiqueta x={900} y={560} txt="los TCD8 se calman" color="#0A7F78" p={calman} t={26} punta="no" />
      {Array.from({ length: 5 }, (_, i) => { const u = ((reloj / 2600 + i / 5) % 1); return <circle key={i} cx={lerp(1080, 1240, u)} cy={460 + 20 * Math.sin(u * 8 + i)} r={11} fill="#9AAE22" opacity={Math.sin(u * Math.PI) * tramo(bilis, 0, 0.4)} />; })}
      <Etiqueta x={1330} y={600} txt="se recupera la bilis" color="#9AAE22" p={bilis} t={26} punta="no" />
      <Sale p={higado} x={1050} y={780} k={0.45}><Higado corte={false} /></Sale>
      <Tumor x={1100} y={760} k={0.45} reloj={reloj} o={tramo(tumor, 0, 0.4)} />
      <Etiqueta x={1050} y={890} txt="mejor para tratar el tumor" color="#B8237A" p={higado} t={24} punta="no" />
      <Sale p={reseccion} x={1330} y={760}><Tijera /></Sale><Txt x={1330} y={850} txt="resección o ablación" t={22} p={reseccion} color={TXH.hep} />
      <Sale p={calmar} x={560} y={950} k={0.4}><Llama /></Sale><Txt x={820} y={950} txt="primero, calmar el incendio" t={34} p={calmar} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · Lo que no logran ───────────────────────────────────────────────────
const NoLogran: Lamina = ({ p, reloj }) => {
  const logran = p('logran'), solo = p('solo'), retro = p('retro'), intacto = p('intacto'), cccadn = p('cccadn'), suspenden = p('suspenden'), reinicia = p('reinicia'), vida = p('vida'), toxicidad = p('toxicidad'), mito = p('mito'), tdf = p('tdf'), rinon = p('rinon'), hueso = p('hueso'), suprimen = p('suprimen'), curan = p('curan');
  return (
    <g>
      <Globo x={640} y={90} txt="¿y qué no logran?" t={34} p={logran} colaX={0} />
      {/* el análogo solo actúa sobre la retrotranscriptasa */}
      <Sale p={solo} x={300} y={330}><Capsula k={1.5} reloj={reloj} /></Sale>
      <Flecha a={[390, 330]} b={[520, 330]} p={tramo(retro, 0, 0.8)} color="#1FA85A" w={9} />
      <Sale p={retro} x={600} y={330}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /></Sale>
      <Txt x={450} y={420} txt="solo actúan sobre la retrotranscriptasa" t={24} p={solo} color={TXH.b} />
      {/* el cccDNA queda intacto: la pastilla rebota */}
      <g opacity={tramo(cccadn, 0, 0.4)}>
        <circle cx={1050} cy={340} r={92} fill="none" stroke={H.adn[1]} strokeWidth={14} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={1050 + Math.cos(i * 0.785) * 92} cy={340 + Math.sin(i * 0.785) * 92} r={20} fill={H.prot[1]} />)}
      </g>
      <Sale p={intacto} x={880 + 40 * Math.max(0, Math.sin(reloj / 500))} y={340}><Capsula k={1.2} reloj={reloj} /></Sale>
      <Tacha x={940} y={340} r={30} p={intacto} />
      <Etiqueta x={1050} y={480} txt="dejan intacto el cccDNA" color="#E8841E" p={cccadn} t={26} punta="no" />
      {/* si se suspenden, el virus reinicia */}
      <Sale p={suspenden} x={300} y={640}><Capsula k={1.5} reloj={reloj} /></Sale><Tacha x={300} y={640} r={52} p={suspenden} />
      <Txt x={300} y={730} txt="si se suspenden" t={24} p={suspenden} color={TXH.gris} />
      {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 2000 + i / 6) % 1); return <VirionB key={i} x={lerp(560, 760, u)} y={640 + 70 * Math.sin(i * 2.1 + u * 4)} k={0.2} reloj={reloj} fase={i} o={Math.sin(u * Math.PI) * tramo(reinicia, 0, 0.4)} />; })}
      <Etiqueta x={660} y={750} txt="el virus reinicia" color="#B8237A" p={reinicia} t={26} punta="no" />
      <Calendario x={1100} y={650} k={0.7} o={tramo(vida, 0, 0.4)} n="∞" unidad="de por vida" />
      <Txt x={1100} y={750} txt="casi todos siguen de por vida" t={24} p={vida} color={TXH.hep} />
      {/* toxicidad rara */}
      <Etiqueta x={1380} y={560} txt="toxicidad" color="#6E6478" p={toxicidad} t={26} punta="no" />
      <Txt x={1380} y={610} txt="mitocondrial, rara" t={22} p={mito} color={TXH.gris} />
      <Sale p={rinon} x={1310} y={750} k={0.4}><Rinon /></Sale><Sale p={hueso} x={1470} y={750}><rect x={-10} y={-44} width={20} height={88} rx={10} fill="#F4EBD2" /><circle cx={-14} cy={-46} r={16} fill="#F4EBD2" /><circle cx={14} cy={-46} r={16} fill="#F4EBD2" /><circle cx={-14} cy={46} r={16} fill="#F4EBD2" /><circle cx={14} cy={46} r={16} fill="#F4EBD2" /></Sale>
      <Txt x={1390} y={850} txt="con el TDF: riñón y hueso" t={22} p={tdf} color={TXH.gris} />
      <Txt x={460} y={950} txt="suprimen," t={42} p={suprimen} color={TXH.c} /><Txt x={900} y={950} txt="pero no curan" t={42} p={curan} color={TXH.sangre} />
    </g>
  );
};

// ─── 7 · ¿A quién y cuándo? ─────────────────────────────────────────────────
const AQuien: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), oms = p('oms'), fibrosis = p('fibrosis'), cirrosis = p('cirrosis'), adn = p('adn'), dosmil = p('dosmil'), alt = p('alt'), coinfeccion = p('coinfeccion'), inmuno = p('inmuno'), persistente = p('persistente'), easl = p('easl'), aasld = p('aasld'), gris = p('gris'), cuarenta = p('cuarenta'), peru = p('peru'), nts = p('nts');
  const fila = (y: number, txt: string, q: number, col: string, sub?: string) => (
    <g>
      <Luz x={150} y={y} on={q} col={col} signo="+" q={q} reloj={reloj} /><Txt x={205} y={y} txt={txt} t={26} p={q} ancla="start" color={col} />
      {sub && <Txt x={205} y={y + 30} txt={sub} t={20} p={q} ancla="start" fuerte={false} />}
    </g>
  );
  return (
    <g>
      <Globo x={800} y={90} txt="¿a quién tratar y cuándo?" t={34} p={pregunta} colaX={0} />
      <Etiqueta x={450} y={200} txt="OMS 2024" color="#0A7F78" p={oms} t={32} punta="no" />
      {fila(290, 'fibrosis significativa', fibrosis, '#1F6FB0')}{fila(370, 'o cirrosis', cirrosis, '#1F6FB0')}
      {fila(470, 'ADN sobre 2 000', dosmil, '#2F55E0')}{fila(550, 'y ALT elevada', alt, '#C79A00')}
      {fila(650, 'coinfección', coinfeccion, '#8A4FE8')}{fila(730, 'o inmunosupresión', inmuno, '#8A4FE8')}
      {fila(830, 'ALT persistente, aun sin ADN', persistente, '#E8841E')}
      <Etiqueta x={1130} y={200} txt="EASL 2025" color="#B8237A" p={easl} t={32} punta="no" />
      <Fact x={1020} y={330} R={46} tono={H.adn} txt="ADN" t={22} p={easl} /><Txt x={1090} y={330} txt="desde 2 000," t={26} p={easl} ancla="start" color={TXH.b} />
      <Txt x={1090} y={375} txt="con ALT alta o fibrosis" t={24} p={easl} ancla="start" color={TXH.hep} />
      <Etiqueta x={1130} y={500} txt="AASLD 2025" color="#E8841E" p={aasld} t={32} punta="no" />
      <Txt x={1130} y={580} txt="zona gris" t={34} p={gris} color={TXH.a} />
      <Txt x={1130} y={630} txt="desde los 40 años" t={28} p={cuarenta} color={TXH.a} />
      <Etiqueta x={1130} y={760} txt="en el Perú" color="#E5324C" p={peru} t={32} punta="no" />
      <Etiqueta x={1130} y={840} txt="rige la NTS 146" color="#9E0B2E" p={nts} t={34} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [QueSeBusca, DosGrupos, ComoFrenan, Profarmaco, Interferon, Logran, NoLogran, AQuien];
export default LAMINAS;
