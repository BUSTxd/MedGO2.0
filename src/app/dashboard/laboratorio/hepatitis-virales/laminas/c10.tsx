'use client';
// Capítulo 10 · La serología del VHB
//
// Los marcadores como fichas de colores que entran al nombrarse; la curva de la infección aguda dibujada en vivo sobre un eje de meses (la
// «línea de tiempo» de la referencia: banderitas y fechas en etiquetas pequeñas); el período de ventana como una franja que se enciende;
// tableros de lucecitas que cambian según quién es el paciente (vacunado, curado, crónico, anti-HBc aislado); el tamizaje con tres marcadores.

import type { Lamina } from '../Lienzo';
import { Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Sello } from '../../vih-sifilis/Piezas';
import { Busto, Capsula, Etiqueta, Flecha, Globo, Linfo, Nota, Sale, Sombra, TXH, TuboEnsayo, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Curva, Eje } from '../Clinica';
import { Banda, Calendario, Campana, Fact, Visto } from '../Extras';

type P2 = [number, number];
const g = (x: number, c: number, s: number) => Math.exp(-((x - c) ** 2) / (2 * s * s));
/** Una curva muestreada en meses: `f` da la altura en px; devuelve puntos relativos al origen del eje (150 px por mes). */
const muestra = (f: (m: number) => number, a: number, b: number, pm = 147): P2[] => Array.from({ length: 46 }, (_, i) => { const m = a + (b - a) * (i / 45); return [m * pm, -f(m)] as P2; });

/** Una lucecita de tablero: encendida (color, con su brillo que late) o apagada (gris), con su signo + o −. */
function Luz({ x, y, on, col, signo, q = 1, reloj = 0 }: { x: number; y: number; on: number; col: string; signo: '+' | '−' | '?'; q?: number; reloj?: number }) {
  if (q <= 0.003) return null;
  const luz = clamp(on) * (0.75 + 0.25 * onda(reloj, 900));
  return (
    <g transform={`translate(${x},${y}) scale(${(easeBack(clamp(q))).toFixed(3)})`}>
      <circle r={44} fill={col} opacity={0.28 * luz} />
      <circle cx={3} cy={5} r={30} fill="#000" opacity={0.18} />
      <circle r={30} fill={on > 0.5 ? col : '#8A8496'} /><circle cx={-3} cy={-3} r={26} fill={on > 0.5 ? '#FFF' : '#B8B2C6'} opacity={on > 0.5 ? 0.3 : 0.85} />
      <circle cx={-9} cy={-10} r={6} fill="#FFF" opacity={0.7} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: on > 0.5 ? '#FFF' : '#6E6478', fontFamily: 'inherit' }}>{signo}</text>
    </g>
  );
}

// ─── 0 · Los marcadores, uno por uno ────────────────────────────────────────
const Marcadores: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), hbsag = p('hbsag'), activa = p('activa'), antihbs = p('antihbs'), inmunidad = p('inmunidad'), hbcag = p('hbcag'), antihbc = p('antihbc'), total = p('total'), igm = p('igm'), hbeag = p('hbeag'), antihbe = p('antihbe'), replicacion = p('replicacion'), adn = p('adn'), cuanto = p('cuanto');
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué se mide en la sangre?" t={34} p={pregunta} colaX={0} />
      <Sale p={pregunta} x={190} y={540} k={1.9}><TuboEnsayo x={0} y={0} k={1} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Fact x={520} y={240} R={54} tono={H.b} txt="HBsAg" t={24} p={hbsag} />
      <Txt x={620} y={240} txt="infección activa: aguda o crónica" t={30} p={activa} ancla="start" color={TXH.b} />
      <Fact x={520} y={370} R={54} tono={H.ac} txt="anti-HBs" t={22} p={antihbs} />
      <Txt x={620} y={370} txt="inmunidad" t={30} p={inmunidad} ancla="start" color={TXH.ac} />
      <Fact x={520} y={500} R={54} tono={H.b} txt="HBcAg" t={24} p={hbcag} o={0.5} />
      <g opacity={tramo(hbcag, 0.3, 0.8)}><path d="M470,450 L570,550 M570,450 L470,550" stroke="#E5324C" strokeWidth={12} strokeLinecap="round" /></g>
      <Fact x={650} y={500} R={54} tono={['#0A7F78', '#10B5A8']} txt="anti-HBc" t={20} p={antihbc} />
      <Fact x={780} y={500} R={54} tono={H.a} txt="IgM" t={26} p={igm} />
      <Txt x={870} y={500} txt="no se mide en sangre, sí su anticuerpo" t={26} p={total} ancla="start" color={TXH.gris} />
      <Fact x={520} y={630} R={54} tono={H.c} txt="HBeAg" t={24} p={hbeag} />
      <Fact x={650} y={630} R={54} tono={['#2A8F5A', '#7FD8A0']} txt="anti-HBe" t={20} p={antihbe} />
      <Txt x={740} y={630} txt="replicación y su control" t={30} p={replicacion} ancla="start" color={TXH.c} />
      <Fact x={520} y={760} R={54} tono={H.adn} txt="ADN" t={28} p={adn} />
      <Txt x={620} y={760} txt="cuánto virus hay" t={30} p={cuanto} ancla="start" color={TXH.b} />
    </g>
  );
};

// ─── 1 · La curva de la infección aguda ─────────────────────────────────────
const CurvaAguda: Lamina = ({ p, reloj }) => {
  const curva = p('curva'), adn = p('adn'), mes1 = p('mes1'), hbsag = p('hbsag'), hbeag = p('hbeag'), alt = p('alt'), sintomas = p('sintomas'), igm = p('igm'), mes25 = p('mes25'), cae = p('cae'), antihbs = p('antihbs'), carrera = p('carrera');
  const OX = 180, OY = 800, W = 1250;
  const px = (m: number) => OX + m * 147;
  const marcas = [1, 2, 3, 4, 5, 6, 7, 8].map((m) => ({ u: (m * 147) / W, txt: String(m) }));
  const leyenda = (x: number, txt: string, col: string, q: number) => <Etiqueta x={x} y={165} txt={txt} color={col} p={q} t={24} punta="no" />;
  return (
    <g>
      <Eje x={OX} y={OY} w={W} alto={560} p={curva} marcas={marcas} />
      <Txt x={OX + W + 10} y={OY + 56} txt="meses" t={24} p={curva} fuerte={false} />
      {leyenda(230, 'ADN', '#4A6A9A', adn)}{leyenda(420, 'HBsAg', '#2F55E0', hbsag)}{leyenda(620, 'HBeAg', '#138A3A', hbeag)}{leyenda(810, 'ALT', '#C79A00', alt)}{leyenda(1030, 'anti-HBc IgM', '#C25A00', igm)}{leyenda(1290, 'anti-HBs', '#6A9A00', antihbs)}
      <Curva x={OX} y={OY} pts={muestra((m) => 330 * g(m, 2.0, 0.75) + 120 * g(m, 2.9, 0.7), 0.4, 5.2)} color="#7A9AD0" oscuro="#4A6A9A" p={adn} grosor={9} />
      <Curva x={OX} y={OY} pts={muestra((m) => 400 * g(m, 3.0, 0.95), 1.3, 5.6)} color="#4F7FF0" oscuro="#1E4FC0" p={hbsag} grosor={10} />
      <Curva x={OX} y={OY} pts={muestra((m) => 300 * g(m, 2.7, 0.8), 1.3, 4.8)} color="#3FD467" oscuro="#138A3A" p={hbeag} grosor={9} />
      <Curva x={OX} y={OY} pts={muestra((m) => 440 * g(m, 3.3, 0.65), 2.0, 5.0)} color="#FFC81E" oscuro="#C79A00" p={alt} grosor={9} />
      <Curva x={OX} y={OY} pts={muestra((m) => 360 * g(m, 4.3, 1.1), 2.3, 7.4)} color="#FF8A1E" oscuro="#C25A00" p={igm} grosor={10} />
      <Curva x={OX} y={OY} pts={muestra((m) => 440 / (1 + Math.exp(-(m - 6.1) * 2.4)), 4.8, 8.4)} color="#A8DC1E" oscuro="#6A9A00" p={antihbs} grosor={10} />
      {/* banderitas de la línea de tiempo */}
      <line x1={px(1)} x2={px(1)} y1={300} y2={OY} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="3 10" strokeLinecap="round" opacity={0.7 * tramo(mes1, 0, 0.5)} />
      <Etiqueta x={px(1)} y={265} txt="mes 1" color="#4A6A9A" p={mes1} t={24} punta="abajo" />
      <line x1={px(2.5)} x2={px(2.5)} y1={340} y2={OY} stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="3 10" strokeLinecap="round" opacity={0.7 * tramo(mes25, 0, 0.5)} />
      <Etiqueta x={px(2.5)} y={305} txt="mes 2,5" color="#C25A00" p={mes25} t={24} punta="abajo" />
      <Sombra><Sale p={sintomas} x={px(3.3)} y={290} k={0.26}><Busto quien="p1" reloj={reloj} ictericia={0.7} dolor={0.5} /></Sale></Sombra>
      <Etiqueta x={px(3.3)} y={365} txt="síntomas" color="#C79A00" p={sintomas} t={24} punta="no" />
      <g opacity={tramo(cae, 0, 0.4)}><Flecha a={[px(4.9), 470]} b={[px(5.3), 640]} p={tramo(cae, 0.2, 1)} color="#E5324C" w={9} /></g>
      <Txt x={px(5.2)} y={440} txt="cae el HBsAg" t={26} p={cae} color={TXH.sangre} />
      <Txt x={800} y={965} txt="una carrera de marcadores" t={36} p={carrera} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · El período de ventana ──────────────────────────────────────────────
const Ventana: Lamina = ({ p, reloj }) => {
  const intervalo = p('intervalo'), ventana = p('ventana'), hbsag = p('hbsag'), desaparecio = p('desaparecio'), antihbs = p('antihbs'), todavia = p('todavia'), miras = p('miras'), nada = p('nada'), igm = p('igm'), unico = p('unico'), confirma = p('confirma'), reciente = p('reciente'), siempre = p('siempre');
  const OX = 140, OY = 760, W = 880, pm = 110;
  const px = (m: number) => OX + m * pm;
  return (
    <g>
      <Eje x={OX} y={OY} w={W} alto={460} p={intervalo} marcas={[]} />
      <Txt x={OX + W + 8} y={OY + 56} txt="meses" t={22} p={intervalo} fuerte={false} />
      <Curva x={OX} y={OY} pts={muestra((m) => 360 * g(m, 3.0, 0.9), 1.5, 5.2, pm)} color="#4F7FF0" oscuro="#1E4FC0" p={hbsag} grosor={10} />
      <Curva x={OX} y={OY} pts={muestra((m) => 400 / (1 + Math.exp(-(m - 6.3) * 2.6)), 5.4, 8.0, pm)} color="#A8DC1E" oscuro="#6A9A00" p={antihbs} grosor={10} />
      <Curva x={OX} y={OY} pts={muestra((m) => 300 * g(m, 4.4, 1.5), 2.4, 7.8, pm)} color="#FF8A1E" oscuro="#C25A00" p={igm} grosor={10} />
      {/* la franja de la ventana */}
      <rect x={px(5.2)} y={OY - 470} width={px(6.4) - px(5.2)} height={470} fill="#FFC81E" opacity={0.28 * tramo(ventana, 0, 0.5) * (0.8 + 0.2 * onda(reloj, 900))} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${px(5.2) + 8},${OY - 470 + i * 70} L${px(6.4) - 8},${OY - 400 + i * 70}`} stroke="#C79A00" strokeWidth={4} opacity={0.5 * tramo(ventana, 0.2, 0.7)} />)}
      <Etiqueta x={(px(5.2) + px(6.4)) / 2} y={OY - 505} txt="período de ventana" color="#C79A00" p={ventana} t={26} punta="abajo" />
      <Txt x={px(3.1)} y={OY - 410} txt="HBsAg" t={26} p={hbsag} color={TXH.b} />
      <Txt x={px(7.3)} y={OY - 400} txt="anti-HBs" t={26} p={antihbs} color={TXH.ac} />
      <Txt x={px(4.4)} y={OY - 330} txt="anti-HBc IgM" t={26} p={igm} color={TXH.a} />
      {/* el tablero de lucecitas */}
      <Luz x={1190} y={260} on={0} col="#4F7FF0" signo="−" q={desaparecio} reloj={reloj} />
      <Txt x={1250} y={260} txt="HBsAg: ya desapareció" t={26} p={desaparecio} ancla="start" />
      <Luz x={1190} y={380} on={0} col="#A8DC1E" signo="−" q={todavia} reloj={reloj} />
      <Txt x={1250} y={380} txt="anti-HBs: todavía no" t={26} p={todavia} ancla="start" />
      <Luz x={1190} y={500} on={igm} col="#FF8A1E" signo="+" q={igm} reloj={reloj} />
      <Txt x={1250} y={500} txt="anti-HBc IgM" t={26} p={igm} ancla="start" />
      <Txt x={1330} y={600} txt="solo miras esos dos…" t={26} p={miras} color={TXH.gris} />
      <Txt x={1330} y={645} txt="parecería que no pasó nada" t={26} p={nada} color={TXH.gris} />
      <Etiqueta x={1330} y={730} txt="el único que lo confirma" color="#C25A00" p={unico} t={26} punta="no" />
      <Visto x={1190} y={820} k={0.9} p={confirma} />
      <Etiqueta x={1400} y={820} txt="infección aguda reciente" color="#1FA85A" p={reciente} t={26} punta="no" />
      <Txt x={800} y={955} txt="por eso se pide siempre" t={34} p={siempre} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Vacunado y curado ──────────────────────────────────────────────────
const VacunadoCurado: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), vac = p('vac'), solo = p('solo'), antihbs = p('antihbs'), positivo = p('positivo'), curado = p('curado'), antihbs2 = p('antihbs2'), antihbc = p('antihbc'), total = p('total'), hbsagneg = p('hbsagneg'), igg = p('igg'), vida = p('vida'), cicatriz = p('cicatriz'), mismo = p('mismo'), dos = p('dos');
  return (
    <g>
      <Globo x={800} y={90} txt="¿cómo se ve alguien vacunado y alguien curado?" t={34} p={pregunta} colaX={0} />
      {/* vacunado */}
      <Sombra><Sale p={vac} x={330} y={290} k={0.4}><Busto quien="p2" reloj={reloj} fase={0.6} sonrisa={0.6} /></Sale></Sombra>
      <Sale p={vac} x={470} y={330} k={0.5}><Jeringa /></Sale>
      <Etiqueta x={330} y={450} txt="vacunado" color="#1FA85A" p={vac} t={32} punta="no" />
      <Luz x={230} y={540} on={0} col="#4F7FF0" signo="−" q={solo} reloj={reloj} /><Txt x={285} y={540} txt="HBsAg" t={26} p={solo} ancla="start" />
      <Luz x={230} y={640} on={positivo} col="#A8DC1E" signo="+" q={antihbs} reloj={reloj} /><Txt x={285} y={640} txt="anti-HBs" t={26} p={antihbs} ancla="start" />
      <Luz x={230} y={740} on={0} col="#10B5A8" signo="−" q={solo} reloj={reloj} /><Txt x={285} y={740} txt="anti-HBc total" t={26} p={solo} ancla="start" />
      <Txt x={330} y={830} txt="solo anti-HBs positivo" t={26} p={positivo} color={TXH.ac} />
      {/* curado */}
      <Sombra><Sale p={curado} x={1130} y={290} k={0.42}><Busto quien="p1" reloj={reloj} fase={1.8} sonrisa={0.3} /></Sale></Sombra>
      <Etiqueta x={1130} y={450} txt="curado" color="#2F55E0" p={curado} t={32} punta="no" />
      <Luz x={1030} y={540} on={0} col="#4F7FF0" signo="−" q={hbsagneg} reloj={reloj} /><Txt x={1085} y={540} txt="HBsAg" t={26} p={hbsagneg} ancla="start" />
      <Luz x={1030} y={640} on={antihbs2} col="#A8DC1E" signo="+" q={antihbs2} reloj={reloj} /><Txt x={1085} y={640} txt="anti-HBs" t={26} p={antihbs2} ancla="start" />
      <Luz x={1030} y={740} on={total} col="#10B5A8" signo="+" q={antihbc} reloj={reloj} /><Txt x={1085} y={740} txt="anti-HBc total" t={26} p={antihbc} ancla="start" />
      <Txt x={1130} y={830} txt="HBsAg negativo" t={26} p={hbsagneg} color={TXH.b} />
      {/* la IgG, una cicatriz inmunológica */}
      <Linfo x={760} y={640} k={1.0} reloj={reloj} tono={H.ac} o={tramo(igg, 0, 0.4)} />
      <Banda x={790} y={590} r={-30} k={1.0} p={cicatriz} />
      <Etiqueta x={760} y={760} txt="la IgG anti-HBc" color="#6A9A00" p={igg} t={26} punta="no" />
      <Txt x={760} y={815} txt="queda de por vida" t={26} p={vida} color={TXH.ac} />
      <Txt x={760} y={860} txt="como una cicatriz inmunológica" t={24} p={cicatriz} color={TXH.hep} />
      <Txt x={560} y={950} txt="mismo anticuerpo protector," t={34} p={mismo} color={TXH.hep} />
      <Txt x={1060} y={950} txt="dos historias" t={34} p={dos} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · El patrón de la infección crónica ──────────────────────────────────
const PatronCronico: Lamina = ({ p, reloj }) => {
  const patron = p('patron'), cronica = p('cronica'), hbsag = p('hbsag'), seis = p('seis'), total = p('total'), igm = p('igm'), antihbs = p('antihbs'), hbeag = p('hbeag'), fase = p('fase'), consulta = p('consulta'), paciente = p('paciente'), conoces = p('conoces');
  const dudoso = 0.5 + 0.5 * onda(reloj, 1300);
  return (
    <g>
      <Etiqueta x={800} y={110} txt="el patrón de la infección crónica" color="#8A4FE8" p={patron} t={36} punta="no" />
      <Etiqueta x={800} y={190} txt="crónica" color="#B8237A" p={cronica} t={28} punta="no" />
      <Luz x={520} y={300} on={hbsag} col="#4F7FF0" signo="+" q={hbsag} reloj={reloj} /><Txt x={580} y={300} txt="HBsAg positivo" t={30} p={hbsag} ancla="start" />
      <Calendario x={1130} y={300} k={0.62} o={tramo(seis, 0, 0.4)} n="6" unidad="meses" />
      <Txt x={1130} y={400} txt="por más de" t={24} p={seis} fuerte={false} />
      <Luz x={520} y={430} on={total} col="#10B5A8" signo="+" q={total} reloj={reloj} /><Txt x={580} y={430} txt="anti-HBc total positivo" t={30} p={total} ancla="start" />
      <Luz x={520} y={560} on={0} col="#FF8A1E" signo="−" q={igm} reloj={reloj} /><Txt x={580} y={560} txt="con IgM negativa" t={30} p={igm} ancla="start" />
      <Luz x={520} y={690} on={0} col="#A8DC1E" signo="−" q={antihbs} reloj={reloj} /><Txt x={580} y={690} txt="anti-HBs negativo" t={30} p={antihbs} ancla="start" />
      <Luz x={520} y={820} on={dudoso} col="#3FD467" signo="?" q={hbeag} reloj={reloj} /><Txt x={580} y={820} txt="HBeAg: depende de la fase" t={30} p={fase} ancla="start" />
      <Sombra><Sale p={paciente} x={1230} y={640} k={0.5}><Busto quien="p1" reloj={reloj} fase={0.4} /></Sale></Sombra>
      <Etiqueta x={1230} y={800} txt="primera consulta del paciente 1" color="#2F55E0" p={consulta} t={26} punta="no" />
      <Txt x={1230} y={860} txt="exactamente este patrón" t={28} p={paciente} color={TXH.hep} />
      <Txt x={800} y={955} txt="un patrón que ya conoces" t={36} p={conoces} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · Anti-HBc aislado e infección oculta ────────────────────────────────
const Aislado: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), aislado = p('aislado'), todo = p('todo'), ventana = p('ventana'), antigua = p('antigua'), decayo = p('decayo'), falso = p('falso'), oculta = p('oculta'), adn = p('adn'), importa = p('importa'), reactivarse = p('reactivarse'), inmuno = p('inmuno'), ignorar = p('ignorar');
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué significa un anti-HBc aislado?" t={34} p={pregunta} colaX={0} />
      <Luz x={200} y={290} on={0} col="#4F7FF0" signo="−" q={todo} reloj={reloj} /><Txt x={255} y={290} txt="HBsAg" t={26} p={todo} ancla="start" />
      <Luz x={200} y={390} on={0} col="#A8DC1E" signo="−" q={todo} reloj={reloj} /><Txt x={255} y={390} txt="anti-HBs" t={26} p={todo} ancla="start" />
      <Luz x={200} y={490} on={aislado} col="#10B5A8" signo="+" q={aislado} reloj={reloj} /><Txt x={255} y={490} txt="anti-HBc total" t={26} p={aislado} ancla="start" />
      <Luz x={200} y={590} on={0} col="#FF8A1E" signo="−" q={todo} reloj={reloj} /><Txt x={255} y={590} txt="IgM" t={26} p={todo} ancla="start" />
      <Txt x={300} y={680} txt="todo lo demás negativo" t={26} p={todo} color={TXH.gris} />
      {/* cuatro explicaciones posibles */}
      <g opacity={tramo(ventana, 0, 0.4)}>
        <rect x={850} y={190} width={130} height={130} rx={12} fill="#7FC4F0" /><rect x={858} y={198} width={114} height={114} rx={8} fill="#D8F0FF" /><path d="M915,198 L915,312 M858,255 L972,255" stroke="#7FC4F0" strokeWidth={8} />
      </g>
      <Etiqueta x={915} y={350} txt="la ventana" color="#2F8FE8" p={ventana} t={26} punta="no" />
      <Calendario x={1180} y={255} k={0.6} o={tramo(antigua, 0, 0.4)} n="?" unidad="hace años" />
      <Etiqueta x={1180} y={350} txt="infección antigua" color="#8A6A12" p={antigua} t={24} punta="no" />
      <Txt x={1180} y={398} txt="con anti-HBs que decayó" t={22} p={decayo} color={TXH.e} />
      <Sale p={falso} x={915} y={510} k={0.5}><TuboEnsayo x={0} y={0} k={0.9} color="#E3203F" nivel={0.6} reloj={reloj} /><path d="M-90,-70 L90,110 M90,-70 L-90,110" stroke="#E5324C" strokeWidth={16} strokeLinecap="round" /></Sale>
      <Etiqueta x={900} y={650} txt="un falso positivo" color="#B8237A" p={falso} t={26} punta="no" />
      <g opacity={tramo(oculta, 0, 0.4)}>
        <path d="M1120,420 L1340,420 L1340,600 L1120,600 Z" fill="#8A4FE8" opacity={0.85} /><path d="M1120,420 Q1180,470 1120,520 T1120,600" fill="#5A22A8" />
        <path d="M1340,420 Q1280,470 1340,520 T1340,600" fill="#5A22A8" />
      </g>
      <VirionB x={1230} y={520} k={0.5} reloj={reloj} o={tramo(oculta, 0.2, 0.6)} />
      <Etiqueta x={1230} y={650} txt="infección oculta" color="#5A22A8" p={oculta} t={26} punta="no" />
      <Txt x={1230} y={700} txt="ADN presente, sin HBsAg" t={24} p={adn} color={TXH.d} />
      {/* importa: se puede reactivar */}
      <Sale p={reactivarse} x={640} y={820}><Capsula k={1.4} reloj={reloj} /></Sale>
      <Etiqueta x={640} y={900} txt="inmunosupresión" color="#8A4FE8" p={inmuno} t={26} punta="no" />
      <Flecha a={[740, 820]} b={[980, 820]} p={tramo(reactivarse, 0.3, 1)} color="#E5324C" w={9} />
      <VirionB x={1090 + 6 * Math.sin(reloj / 90)} y={820} k={0.8} reloj={reloj} o={tramo(reactivarse, 0.4, 0.9)} />
      <Campana x={1260} y={810} k={0.6} o={tramo(reactivarse, 0.5, 1)} suena={reactivarse} reloj={reloj} />
      <Etiqueta x={1090} y={905} txt="el virus puede reactivarse" color="#E5324C" p={importa} t={26} punta="no" />
      <Txt x={800} y={975} txt="un patrón que no se debe ignorar" t={34} p={ignorar} color={TXH.hep} />
    </g>
  );
};

/** La barra del ADN viral con su rótulo de replicación. */
function BarraAdn({ x, p, q }: { x: number; p: number; q: number }) {
  if (p <= 0.003) return null;
  const h = 360 * easeOut(p);
  return (
    <g>
      <rect x={x - 45 + 6} y={720 - 400} width={90} height={400} rx={45} fill="#000" opacity={0.1} />
      <rect x={x - 45} y={720 - 400} width={90} height={400} rx={45} fill="#FFF" opacity={0.28} />
      <rect x={x - 45 + 5} y={720 - h} width={90} height={h} rx={45} fill="#1E4FC0" /><rect x={x - 45} y={720 - h} width={90} height={h} rx={45} fill="#4F7FF0" />
      <rect x={x - 33} y={720 - h + 14} width={9} height={Math.max(0, h - 40)} rx={4.5} fill="#FFF" opacity={0.4} />
      <Etiqueta x={x} y={140} txt="ADN-VHB" color="#1E4FC0" p={p} t={30} punta="no" />
      <Txt x={x} y={775} txt="mide la replicación" t={26} p={q} color={TXH.b} />
    </g>
  );
}

// ─── 6 · HBsAg cuantitativo y ADN ───────────────────────────────────────────
const Cuantitativo: Lamina = ({ p, reloj }) => {
  const cuant = p('cuant'), distinguir = p('distinguir'), portador = p('portador'), adn = p('adn'), replicacion = p('replicacion'), oms = p('oms'), punto = p('punto'), refleja = p('refleja'), positivo = p('positivo'), viajes = p('viajes'), diagnosticos = p('diagnosticos');
  return (
    <g>
      {/* HBsAg cuantitativo: una escala con un indicador bajo */}
      <Etiqueta x={330} y={140} txt="HBsAg cuantitativo" color="#2F55E0" p={cuant} t={30} punta="no" />
      <g opacity={tramo(cuant, 0, 0.4)}>
        <rect x={290} y={220} width={80} height={520} rx={40} fill="#FFF" opacity={0.3} />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={376} x2={400} y1={260 + i * 90} y2={260 + i * 90} stroke="var(--cit-flecha)" strokeWidth={4} strokeLinecap="round" />)}
        <rect x={290} y={220 + 520 * (1 - 0.82 * easeOut(distinguir))} width={80} height={520 * 0.82 * easeOut(distinguir) + 520 * 0.18 * 0} rx={40} fill="#4F7FF0" opacity={0.0} />
      </g>
      <g transform={`translate(0,${(lerp(260, 640, easeOut(distinguir))).toFixed(1)})`} opacity={tramo(distinguir, 0, 0.4)}>
        <polygon points="270,0 250,-22 250,22" fill="#E5324C" /><rect x={250} y={-6} width={140} height={12} rx={6} fill="#E5324C" opacity={0.6} />
      </g>
      <Txt x={330} y={800} txt="distingue a un" t={26} p={distinguir} color={TXH.b} />
      <Etiqueta x={330} y={860} txt="portador inactivo" color="#1FA85A" p={portador} t={28} punta="no" />
      {/* ADN: la replicación */}
      <BarraAdn x={780} p={adn} q={replicacion} />
      {/* la OMS acepta ADN en el punto de atención y la prueba refleja */}
      <Etiqueta x={1190} y={140} txt="la OMS acepta" color="#0A7F78" p={oms} t={30} punta="no" />
      <g opacity={tramo(punto, 0, 0.4)}>
        <rect x={1060} y={230} width={170} height={300} rx={26} fill="#2A2640" transform="translate(6,8)" opacity={0.4} /><rect x={1060} y={230} width={170} height={300} rx={26} fill="#3A3558" /><rect x={1074} y={248} width={142} height={170} rx={14} fill="#CFEFFF" />
        <text x={1145} y={340} textAnchor="middle" dy="0.36em" style={{ fontSize: 44, fontWeight: 800, fill: '#1E4FC0', fontFamily: 'inherit' }}>ADN</text>
        <circle cx={1145} cy={470} r={24 + 3 * onda(reloj, 600)} fill="#E3203F" /><circle cx={1138} cy={462} r={7} fill="#FFF" opacity={0.7} />
      </g>
      <Txt x={1145} y={580} txt="ADN en el punto de atención" t={26} p={punto} color={TXH.b} />
      <Sale p={positivo} x={1340} y={330} k={0.9}><TuboEnsayo x={0} y={0} k={0.8} color="#4F7FF0" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={1340} y={470} txt="HBsAg +" color="#2F55E0" p={positivo} t={26} punta="no" />
      <Flecha a={[1290, 360]} b={[1250, 360]} p={tramo(refleja, 0, 0.8)} color="#E8841E" w={9} />
      <Etiqueta x={1250} y={640} txt="prueba refleja" color="#E8841E" p={refleja} t={28} punta="no" />
      {/* menos viajes, más diagnósticos */}
      <g opacity={tramo(viajes, 0, 0.4)}>
        <path d="M1000,780 C1100,720 1200,860 1300,780 S1440,740 1500,800" fill="none" stroke="var(--cit-flecha)" strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
        <circle cx={1000} cy={780} r={16} fill="#8A4FE8" /><circle cx={1500} cy={800} r={16} fill="#1FA85A" />
      </g>
      <Txt x={1250} y={880} txt="menos viajes" t={32} p={viajes} color={TXH.hep} />
      <Txt x={1250} y={935} txt="más diagnósticos" t={32} p={diagnosticos} color={TXH.c} />
    </g>
  );
};

// ─── 7 · Tamizar con tres marcadores ────────────────────────────────────────
const Tamizar: Lamina = ({ p, reloj }) => {
  const pruebas = p('pruebas'), adulto = p('adulto'), vida = p('vida'), cdc = p('cdc'), hbsag = p('hbsag'), antihbs = p('antihbs'), antihbc = p('antihbc'), total = p('total'), infectado = p('infectado'), inmune = p('inmune'), susceptible = p('susceptible'), vacunarlo = p('vacunarlo'), muestra_ = p('muestra'), respuestas = p('respuestas');
  return (
    <g>
      <Globo x={800} y={90} txt="¿cuántas pruebas necesita un adulto?" t={34} p={pruebas} colaX={0} />
      <Sombra><Sale p={adulto} x={190} y={330} k={0.4}><Busto quien="p1" reloj={reloj} fase={0.5} /></Sale></Sombra>
      <Etiqueta x={190} y={450} txt="al menos una vez en la vida" color="#2F55E0" p={vida} t={22} punta="no" />
      <Etiqueta x={190} y={190} txt="un adulto" color="#2F55E0" p={adulto} t={26} punta="no" />
      <Sale p={cdc} x={190} y={700} k={1.0}><TuboEnsayo x={0} y={0} k={1} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Etiqueta x={190} y={870} txt="según los CDC" color="#0A7F78" p={cdc} t={26} punta="no" />
      {/* los tres marcadores */}
      <Fact x={520} y={290} R={60} tono={H.b} txt="HBsAg" t={26} p={hbsag} />
      <Fact x={520} y={470} R={60} tono={H.ac} txt="anti-HBs" t={24} p={antihbs} />
      <Fact x={520} y={650} R={60} tono={['#0A7F78', '#10B5A8']} txt="anti-HBc" t={22} p={antihbc} />
      <Txt x={520} y={745} txt="total" t={24} p={total} fuerte={false} />
      {/* con los tres sabes... */}
      <Flecha a={[600, 290]} b={[900, 290]} p={tramo(infectado, 0, 0.8)} color="var(--cit-flecha)" w={8} />
      <Sale p={infectado} x={1000} y={290} k={0.7}><VirionB reloj={reloj} /></Sale>
      <Etiqueta x={1290} y={290} txt="está infectado" color="#E5324C" p={infectado} t={30} punta="no" />
      <Flecha a={[600, 470]} b={[900, 470]} p={tramo(inmune, 0, 0.8)} color="var(--cit-flecha)" w={8} />
      <Sale p={inmune} x={1000} y={470}><circle cx={4} cy={8} r={54} fill="#000" opacity={0.15} /><path d="M0,-58 L52,-34 L52,18 C52,46 20,62 0,70 C-20,62 -52,46 -52,18 L-52,-34 Z" fill="#1FA85A" /><path d="M0,-50 L44,-30 L44,16 C44,40 16,54 0,60 C-16,54 -44,40 -44,16 L-44,-30 Z" fill="#3FD467" /><path d="M-18,4 L-4,20 L22,-14" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /></Sale>
      <Etiqueta x={1340} y={470} txt="es inmune: vacuna o infección pasada" color="#1FA85A" p={inmune} t={26} punta="no" />
      <Flecha a={[600, 650]} b={[900, 650]} p={tramo(susceptible, 0, 0.8)} color="var(--cit-flecha)" w={8} />
      <Sale p={susceptible} x={1000} y={650} k={1.0}><Jeringa /></Sale>
      <Etiqueta x={1290} y={620} txt="es susceptible" color="#E8841E" p={susceptible} t={30} punta="no" />
      <Txt x={1290} y={680} txt="y hay que vacunarlo" t={28} p={vacunarlo} color={TXH.a} />
      <Etiqueta x={430} y={900} txt="una muestra" color="#8A4FE8" p={muestra_} t={32} punta="no" />
      <Etiqueta x={1090} y={900} txt="tres respuestas" color="#8A4FE8" p={respuestas} t={32} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Marcadores, CurvaAguda, Ventana, VacunadoCurado, PatronCronico, Aislado, Cuantitativo, Tamizar];
export default LAMINAS;
