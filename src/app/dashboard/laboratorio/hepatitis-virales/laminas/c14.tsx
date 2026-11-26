'use client';
// Capítulo 14 · El carcinoma: imagen, biopsia y vigilancia
//
// La pantalla de ecografía (gris, con ruido y el cono del transductor) con su nódulo de 2,8 cm y un hígado esquemático con el segmento VI
// encendido; dos redes de vasos (arteria roja, porta violeta) y el tumor que solo bebe de la arteria con su curva de contraste que entra y
// lava; la biopsia dirigida; dos oculares (trabéculas finas frente a gruesas, núcleos de tamaños distintos); la red de reticulina que se
// apaga y un calendario de seis meses con un transductor en cada casilla.

import type { Lamina } from '../Lienzo';
import { Etiqueta, Flecha, Globo, Higado, Linfo, Nota, Sale, Sombra, TXH, Txt, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Hepatocito, Triada, TuboCurvo } from '../Higado';
import { BarraLab, Curva, Eco, Eje, Ocular } from '../Clinica';
import { Calendario, Fact, Visto } from '../Extras';

type P2 = [number, number];

/** La aguja de la biopsia entrando (p 0-1). */
function Aguja({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  if (p <= 0.003) return null;
  const q = easeOut(clamp(p));
  return (
    <g transform={`translate(${x},${y}) rotate(-30) scale(${k})`} opacity={tramo(p, 0, 0.3)}>
      <g transform={`translate(0,${(-(1 - q) * 200).toFixed(1)})`}>
        <rect x={-10} y={-330} width={20} height={300} rx={6} fill="#8A97AD" /><rect x={-7} y={-326} width={6} height={292} rx={3} fill="#E6EDF7" opacity={0.85} /><rect x={-22} y={-356} width={44} height={30} rx={10} fill="#4A5C7C" />
      </g>
    </g>
  );
}

/** Un círculo de zoom con aro naranja y etiqueta (la referencia «Modern Archaeology»): los hijos van en coordenadas absolutas. */
function Lupa({ x, y, R = 80, p = 1, fondo = '#FFF4E4', children }: { x: number; y: number; R?: number; p?: number; fondo?: string; children?: React.ReactNode }) {
  if (p <= 0.003) return null;
  const q = easeBack(clamp(p));
  return (
    <g opacity={tramo(p, 0, 0.3)}>
      <circle cx={x + 6} cy={y + 8} r={R * q} fill="#000" opacity={0.16} />
      <circle cx={x} cy={y} r={R * q} fill="#F2A33A" /><circle cx={x} cy={y} r={(R - 10) * q} fill={fondo} />
      <g opacity={q > 0.9 ? 1 : 0}>{children}</g>
    </g>
  );
}

// ─── 0 · La ecografía: un nódulo de 2,8 cm ──────────────────────────────────
const Ecografia: Lamina = ({ p, reloj }) => {
  const ecografia = p('ecografia'), lesion = p('lesion'), solida = p('solida'), cm = p('cm'), heterogenea = p('heterogenea'), contornos = p('contornos'), segmento = p('segmento'), expansion = p('expansion'), desplaza = p('desplaza'), heterogeneo = p('heterogeneo'), necrosis = p('necrosis'), grasa = p('grasa'), nota = p('nota');
  const seg: [string, number, number][] = [['I', 1190, 400], ['II', 1085, 360], ['III', 1090, 440], ['IV', 1150, 360], ['V', 1270, 500], ['VI', 1340, 470], ['VII', 1350, 400], ['VIII', 1290, 350]];
  return (
    <g>
      <Etiqueta x={430} y={100} txt="¿qué ve la ecografía?" color="#0A7F78" p={ecografia} t={34} punta="no" />
      <Eco x={430} y={440} w={640} h={440} k={1.0} reloj={reloj} nodulo={lesion} nx={70} ny={70} heter={heterogeneo} o={tramo(ecografia, 0, 0.4)} />
      <Txt x={430} y={725} txt="una lesión sólida" t={28} p={solida} color={TXH.b} />
      <g opacity={tramo(cm, 0, 0.4)}><path d="M440,560 L580,560 M440,546 L440,574 M580,546 L580,574" stroke="#FFE98A" strokeWidth={5} strokeLinecap="round" /></g>
      <Etiqueta x={860} y={440} txt="2,8 cm" color="#C79A00" p={cm} t={34} punta="izq" />
      <Txt x={430} y={765} txt="heterogénea," t={26} p={heterogenea} color={TXH.hep} /><Txt x={430} y={805} txt="de contornos relativamente definidos" t={24} p={contornos} color={TXH.hep} />
      {/* un hígado esquemático con sus ocho segmentos y el VI encendido */}
      <Sale p={segmento} x={1215} y={425} k={0.5}><Higado corte={false} /></Sale>
      {seg.map(([l, sx, sy]) => { const on = l === 'VI' ? segmento : 0; return (
        <g key={l} opacity={tramo(segmento, 0, 0.5)}><circle cx={sx} cy={sy} r={on > 0.5 ? 26 + 3 * onda(reloj, 500) : 18} fill={on > 0.5 ? '#E5324C' : '#FFF'} opacity={on > 0.5 ? 1 : 0.6} /><text x={sx} y={sy} dy="0.36em" textAnchor="middle" style={{ fontSize: on > 0.5 ? 24 : 16, fontWeight: 800, fill: on > 0.5 ? '#FFF' : '#6E6478', fontFamily: 'inherit' }}>{l}</text></g>
      ); })}
      <Etiqueta x={1215} y={560} txt="segmento VI" color="#E5324C" p={segmento} t={28} punta="no" />
      <Txt x={1215} y={640} txt="la expansión de las células malignas" t={24} p={expansion} color={TXH.hep} /><Txt x={1215} y={680} txt="forma un nódulo que desplaza" t={24} p={desplaza} color={TXH.hep} />
      {/* por qué se ve heterogéneo */}
      <Lupa x={1000} y={830} R={70} p={heterogeneo} fondo="#C8C4D6">{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={975 + (i % 3) * 28} cy={810 + Math.floor(i / 3) * 34} r={12 + 4 * (i % 2)} fill={i % 2 ? '#8A8496' : '#E6E2F0'} />)}</Lupa>
      <Txt x={1000} y={925} txt="zonas de distinta densidad" t={22} p={heterogeneo} color={TXH.gris} />
      <Lupa x={1180} y={830} R={70} p={necrosis} fondo="#C8C4D6"><circle cx={1180} cy={830} r={38} fill="#1B2744" /></Lupa>
      <Txt x={1180} y={925} txt="necrosis" t={22} p={necrosis} color={TXH.gris} />
      <Lupa x={1360} y={830} R={70} p={grasa} fondo="#C8C4D6"><circle cx={1360} cy={830} r={36} fill="#FFF4B8" /></Lupa>
      <Txt x={1360} y={925} txt="o grasa dentro del tumor" t={22} p={grasa} color={TXH.gris} />
      <Etiqueta x={430} y={905} txt="un nódulo que se nota" color="#B8237A" p={nota} t={30} punta="no" />
    </g>
  );
};

// ─── 1 · Cuando entra el contraste ──────────────────────────────────────────
const Contraste: Lamina = ({ p, reloj }) => {
  const contraste = p('contraste'), sano = p('sano'), porta = p('porta'), carcinoma = p('carcinoma'), arteria = p('arteria'), contraste2 = p('contraste2'), realza = p('realza'), arterial = p('arterial'), lava = p('lava'), sugiere = p('sugiere');
  const OX = 900, OY = 800, W = 600;
  const g = (m: number, c: number, s: number) => Math.exp(-((m - c) ** 2) / (2 * s * s));
  const mu = (f: (m: number) => number, a: number, b: number): P2[] => Array.from({ length: 40 }, (_, i) => { const m = a + (b - a) * (i / 39); return [m * 120, -f(m)] as P2; });
  return (
    <g>
      <Globo x={640} y={90} txt="¿cómo se comporta con contraste?" t={34} p={contraste} colaX={0} />
      {/* el tejido sano bebe de la porta */}
      <circle cx={330} cy={520} r={220} fill="#FFD8E0" opacity={0.85 * tramo(sano, 0, 0.5)} />
      <TuboCurvo a={[60, 520]} b={[330, 520]} c={[200, 560]} w={60} tono={H.d} p={porta} />
      <Etiqueta x={200} y={620} txt="vena porta" color="#7A55D8" p={porta} t={26} punta="no" />
      <Txt x={330} y={330} txt="el hígado sano recibe" t={24} p={sano} color={TXH.hep} /><Txt x={330} y={365} txt="sobre todo sangre de la porta" t={24} p={sano} color={TXH.hep} />
      {/* el carcinoma bebe de la arteria hepática */}
      <circle cx={600} cy={400} r={80} fill="#6A0F58" opacity={tramo(carcinoma, 0, 0.5)} /><circle cx={596} cy={396} r={66} fill="#B03A8C" opacity={tramo(carcinoma, 0, 0.5)} />
      <TuboCurvo a={[760, 220]} b={[640, 380]} c={[740, 340]} w={26} tono={H.sangre} p={arteria} />
      <TuboCurvo a={[760, 220]} b={[672, 450]} c={[800, 360]} w={18} tono={H.sangre} p={arteria} />
      <Etiqueta x={620} y={250} txt="arteria hepática" color="#E3203F" p={arteria} t={26} punta="no" />
      <Etiqueta x={600} y={520} txt="carcinoma" color="#7A1260" p={carcinoma} t={28} punta="no" />
      <Txt x={620} y={575} txt="se nutre de ramas arteriales" t={22} p={arteria} color={TXH.sangre} />
      {/* la curva de intensidad: entra en la fase arterial y lava */}
      <Eje x={OX} y={OY} w={W} alto={460} p={contraste2} marcas={[]} />
      <rect x={OX + 40} y={OY - 460} width={160} height={460} fill="#E5324C" opacity={0.16 * tramo(arterial, 0, 0.5)} />
      <Etiqueta x={OX + 120} y={OY - 490} txt="fase arterial" color="#E5324C" p={arterial} t={24} punta="abajo" />
      <Curva x={OX} y={OY} pts={mu((m) => 400 * g(m, 1.0, 0.35) + 120 * Math.exp(-m * 0.5), 0.1, 4.8)} color="#B03A8C" oscuro="#6A0F58" p={realza} grosor={11} />
      <Curva x={OX} y={OY} pts={mu((m) => 220 / (1 + Math.exp(-(m - 2.6) * 2)) + 40, 0.1, 4.8)} color="#FFB0C0" oscuro="#D86A80" p={sano} grosor={9} />
      <Txt x={OX + 150} y={OY - 430} txt="el tumor se realza" t={24} p={realza} color={TXH.hep} ancla="start" />
      <Flecha a={[OX + 360, OY - 260]} b={[OX + 470, OY - 120]} p={tramo(lava, 0, 0.8)} color="#E5324C" w={9} />
      <Txt x={OX + 440} y={OY - 300} txt="y luego lava" t={28} p={lava} color={TXH.sangre} />
      <Txt x={OX + W / 2} y={OY + 56} txt="tiempo tras el contraste" t={22} p={contraste2} fuerte={false} />
      <Etiqueta x={800} y={950} txt="sugiere carcinoma hepatocelular" color="#B8237A" p={sugiere} t={32} punta="no" />
    </g>
  );
};

// ─── 2 · ¿Por qué se biopsió? ───────────────────────────────────────────────
const PorQueBiopsia: Lamina = ({ p, reloj }) => {
  const biopsia = p('biopsia'), sin = p('sin'), imagenes = p('imagenes'), seguras = p('seguras'), confirmacion = p('confirmacion'), tejido = p('tejido'), paciente = p('paciente'), signos = p('signos'), hipertension = p('hipertension'), dirigida = p('dirigida'), palabra = p('palabra');
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Globo x={640} y={90} txt="¿por qué se le hizo biopsia?" t={34} p={biopsia} colaX={0} />
      {/* sin cirrosis, las imágenes son menos seguras */}
      <Etiqueta x={330} y={220} txt="sin cirrosis" color="#6E6478" p={sin} t={28} punta="no" />
      <Txt x={330} y={290} txt="las imágenes" t={26} p={imagenes} color={TXH.b} />
      <text x={330} y={400} textAnchor="middle" style={{ fontSize: 110, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: tramo(seguras, 0, 0.5) }}>?</text>
      <Txt x={330} y={470} txt="pueden ser menos seguras" t={24} p={seguras} color={TXH.kupffer} />
      <Txt x={330} y={560} txt="la confirmación" t={26} p={confirmacion} color={TXH.hep} />
      <Sale p={tejido} x={330} y={680} k={1}><circle cx={4} cy={8} r={56} fill="#000" opacity={0.15} /><circle r={56} fill="#E04AB0" /><circle cx={-3} cy={-3} r={50} fill="#F29AB4" />{[[-16, -10], [12, -14], [4, 16], [-18, 14], [22, 10]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7} fill="#7A3FB0" opacity={0.85} />)}</Sale>
      <Etiqueta x={330} y={780} txt="la da el tejido" color="#E04AB0" p={tejido} t={28} punta="no" />
      {/* en este paciente: sin signos de cirrosis ni hipertensión portal */}
      <Txt x={800} y={190} txt="en este paciente, además" t={28} p={paciente} color={TXH.b} />
      <Sale p={signos} x={800} y={330} k={0.4}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /></g>)}</Sale>
      <g opacity={tramo(signos, 0.3, 1)}><path d="M730,270 L870,390 M870,270 L730,390" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" /></g>
      <Etiqueta x={800} y={460} txt="sin signos de cirrosis" color="#8A3A1E" p={signos} t={24} punta="no" />
      <Sale p={hipertension} x={800} y={600}><path d="M-110,0 C-60,-50 60,-50 110,0" fill="none" stroke={H.d[1]} strokeWidth={40} strokeLinecap="round" /><ellipse cx={0} cy={-30} rx={44} ry={32} fill={H.d[1]} /></Sale>
      <g opacity={tramo(hipertension, 0.3, 1)}><path d="M730,560 L870,660 M870,560 L730,660" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" /></g>
      <Etiqueta x={800} y={700} txt="ni hipertensión portal" color="#7A55D8" p={hipertension} t={24} punta="no" />
      {/* una biopsia dirigida de la lesión */}
      <Sale p={dirigida} x={1230} y={540} k={0.55}><Higado corte={false} /></Sale>
      <circle cx={1280} cy={500} r={34 * tramo(dirigida, 0.2, 0.7)} fill="#6A0F58" /><circle cx={1276} cy={496} r={26 * tramo(dirigida, 0.2, 0.7)} fill="#B03A8C" />
      <Aguja x={1290} y={520} k={1.0} p={dirigida} />
      <Etiqueta x={1230} y={730} txt="biopsia dirigida de la lesión" color="#E04AB0" p={dirigida} t={26} punta="no" />
      <Etiqueta x={800} y={900} txt="el tejido tiene la última palabra" color="#B8237A" p={palabra} t={34} punta="no" />
    </g>
  );
};

// ─── 3 · Trabéculas que engordan ────────────────────────────────────────────
const Trabeculas: Lamina = ({ p, reloj }) => {
  const patologo = p('patologo'), normal = p('normal'), trabeculas = p('trabeculas'), dos = p('dos'), carcinoma = p('carcinoma'), tres = p('tres'), atipicos = p('atipicos'), nucleos = p('nucleos'), pleomorfismo = p('pleomorfismo'), pierde = p('pierde'), lobulillos = p('lobulillos'), triadas = p('triadas'), engordan = p('engordan');
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué dice el patólogo?" t={34} p={patologo} colaX={0} />
      {/* hígado normal: trabéculas de una o dos células */}
      <Ocular x={420} y={520} R={240} id="hv-o14a" reloj={reloj} o={tramo(normal, 0, 0.4)}>
        {[0, 1, 2].map((fila) => <g key={fila} opacity={tramo(trabeculas, fila * 0.2, fila * 0.2 + 0.4)}>
          <rect x={250} y={420 + fila * 100} width={340} height={14} rx={7} fill="#F8B8B0" opacity={0.7} />
          {Array.from({ length: 6 }, (_, i) => <Hepatocito key={i} x={290 + i * 56} y={450 + fila * 100} k={0.3} reloj={reloj} fase={i + fila} sem={i + fila * 6 + 1} />)}
        </g>)}
      </Ocular>
      <Etiqueta x={420} y={835} txt="normal: 1 o 2 células de grosor" color="#1FA85A" p={dos} t={26} punta="no" />
      {/* carcinoma: tres o más, atípicas, sin arquitectura */}
      <Ocular x={1180} y={520} R={240} id="hv-o14b" reloj={reloj} o={tramo(carcinoma, 0, 0.4)}>
        {[0, 1].map((fila) => <g key={fila} opacity={tramo(tres, fila * 0.2, fila * 0.2 + 0.4)}>
          {[0, 1, 2, 3].map((capa) => Array.from({ length: 5 }, (_, i) => {
            const k = 0.24 + 0.18 * hash(i + capa * 5 + fila * 20, 4) * pleomorfismo + 0.04, atip = 0.8 * atipicos * (0.4 + hash(i + capa * 5, 7));
            return <Hepatocito key={`${capa}-${i}`} x={1020 + i * 66 + 8 * hash(i + capa, 3)} y={430 + fila * 190 + capa * 48} k={k} reloj={reloj} fase={i + capa} sem={i + capa * 5 + fila * 20 + 1} atip={atip} />;
          }))}
        </g>)}
      </Ocular>
      <Etiqueta x={1180} y={835} txt="carcinoma: 3 o más células" color="#E5324C" p={engordan} t={26} punta="no" />
      <Txt x={1180} y={285} txt="hepatocitos atípicos" t={24} p={atipicos} color={TXH.sangre} />
      <Txt x={1180} y={885} txt="núcleos de tamaño, forma e intensidad distintos: pleomorfismo" t={20} p={pleomorfismo} color={TXH.d} />
      <Txt x={420} y={285} txt="trabéculas" t={26} p={trabeculas} color={TXH.hep} />
      {/* se pierde la arquitectura: sin lobulillos ni tríadas dentro del nódulo */}
      <Txt x={800} y={900} txt="se pierde la arquitectura" t={28} p={pierde} color={TXH.sangre} />
      <g opacity={tramo(triadas, 0, 0.4)}><Triada x={800} y={620} k={0.35} reloj={reloj} /><path d="M740,560 L860,680 M860,560 L740,680" stroke="#E5324C" strokeWidth={12} strokeLinecap="round" /></g>
      <Txt x={800} y={720} txt="sin lobulillos" t={22} p={lobulillos} color={TXH.gris} /><Txt x={800} y={755} txt="ni tríadas" t={22} p={triadas} color={TXH.gris} />
      <Txt x={800} y={968} txt="trabéculas que engordan" t={36} p={engordan} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · La reticulina que desaparece ───────────────────────────────────────
const Reticulina: Lamina = ({ p, reloj }) => {
  const pista = p('pista'), reticulina = p('reticulina'), red = p('red'), sostiene = p('sostiene'), destruye = p('destruye'), tumor = p('tumor'), tincion = p('tincion'), dudosos = p('dudosos'), inmuno = p('inmuno'), glipicano = p('glipicano'), sospechar = p('sospechar');
  const celda = (cx: number, cy: number, lat: boolean) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={34} fill="#F8B8B0" /><circle cx={cx} cy={cy} r={12} fill="#7A55D8" />
      {lat && <circle cx={cx} cy={cy} r={34} fill="#B07A44" opacity={0.0} />}
    </g>
  );
  return (
    <g>
      <Etiqueta x={800} y={100} txt="una pista más fina" color="#8A4FE8" p={pista} t={34} punta="no" />
      {/* hígado sano: la red de reticulina sostiene a los hepatocitos */}
      <Ocular x={420} y={520} R={260} id="hv-o14c" reloj={reloj} o={tramo(reticulina, 0, 0.4)}>
        {Array.from({ length: 12 }, (_, i) => celda(310 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 40, 400 + Math.floor(i / 4) * 80, false))}
        <g opacity={tramo(red, 0, 0.5)} stroke="#3A2A22" strokeWidth={4} strokeLinecap="round" fill="none">
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={310 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 40} cy={400 + Math.floor(i / 4) * 80} r={42} />)}
          {Array.from({ length: 9 }, (_, i) => <path key={`r${i}`} d={`M${290 + (i % 3) * 100},${380 + Math.floor(i / 3) * 80} q20,-16 40,0`} />)}
        </g>
      </Ocular>
      <Etiqueta x={420} y={830} txt="la reticulina sostiene a los hepatocitos sanos" color="#3A2A22" p={sostiene} t={24} punta="no" />
      {/* dentro del tumor la red se destruye */}
      <Ocular x={1180} y={520} R={260} id="hv-o14d" reloj={reloj} o={tramo(tumor, 0, 0.4)}>
        {Array.from({ length: 12 }, (_, i) => <Hepatocito key={i} x={1070 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 40} y={400 + Math.floor(i / 4) * 80} k={0.34} reloj={reloj} fase={i} sem={i + 4} atip={0.6} />)}
        <g opacity={(1 - easeOut(destruye)) * tramo(red, 0, 0.5)} stroke="#3A2A22" strokeWidth={4} strokeLinecap="round" fill="none">{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={1070 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 40} cy={400 + Math.floor(i / 4) * 80} r={42} />)}</g>
        {Array.from({ length: 12 }, (_, i) => <circle key={`g${i}`} cx={1070 + (i % 4) * 80 + (Math.floor(i / 4) % 2) * 40 + 14} cy={400 + Math.floor(i / 4) * 80 - 14} r={9} fill="#7A4A22" opacity={0.85 * tramo(glipicano, i / 16, i / 16 + 0.3)} />)}
      </Ocular>
      <Etiqueta x={1180} y={830} txt="dentro del tumor se destruye" color="#E5324C" p={destruye} t={26} punta="no" />
      <Txt x={420} y={300} txt="la red de fibras de reticulina" t={24} p={reticulina} color={TXH.hep} />
      <Txt x={800} y={560} txt="una tinción" t={22} p={tincion} color={TXH.d} /><Txt x={800} y={592} txt="lo muestra" t={22} p={tincion} color={TXH.d} />
      <Sale p={tincion} x={800} y={470} k={0.9}><rect x={-30} y={-10} width={60} height={86} rx={12} fill="#7A55D8" /><rect x={-14} y={-46} width={28} height={40} rx={6} fill="#B58AE8" /><rect x={-22} y={20} width={44} height={36} rx={5} fill="#FFF8E8" /></Sale>
      <Txt x={1180} y={285} txt="en casos dudosos" t={26} p={dudosos} color={TXH.gris} /><Txt x={1180} y={325} txt="ayuda la inmunohistoquímica" t={24} p={inmuno} color={TXH.gris} />
      <Etiqueta x={1180} y={900} txt="glipicano 3" color="#7A4A22" p={glipicano} t={28} punta="no" />
      <Txt x={800} y={960} txt="cuando la reticulina desaparece, hay que sospechar" t={30} p={sospechar} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · Vigilar cada seis meses ────────────────────────────────────────────
const Vigilar: Lamina = ({ p, reloj }) => {
  const riesgo = p('riesgo'), cirrosis = p('cirrosis'), hepatitisb = p('hepatitisb'), ecografia = p('ecografia'), afp = p('afp'), seis = p('seis'), page = p('page'), edad = p('edad'), sexo = p('sexo'), plaquetas = p('plaquetas'), decidir = p('decidir'), pronostico = p('pronostico');
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Etiqueta x={500} y={100} txt="quién tiene riesgo" color="#E5324C" p={riesgo} t={34} punta="no" />
      <Sale p={cirrosis} x={250} y={290} k={0.32}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /></g>)}</Sale>
      <Txt x={250} y={380} txt="cirrosis" t={28} p={cirrosis} color={TXH.colageno} />
      <Etiqueta x={560} y={290} txt="ciertas hepatitis B" color="#2F55E0" p={hepatitisb} t={28} punta="no" />
      {/* ecografía con o sin alfafetoproteína, cada seis meses */}
      <Etiqueta x={1100} y={100} txt="cada seis meses" color="#0A7F78" p={seis} t={34} punta="no" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} opacity={tramo(seis, i / 9, i / 9 + 0.3)}>
          <rect x={700 + i * 135 + 4} y={230 + 7} width={118} height={140} rx={16} fill="#000" opacity={0.14} /><rect x={700 + i * 135} y={230} width={118} height={140} rx={16} fill="#FFF8F0" />
          <rect x={700 + i * 135} y={230} width={118} height={34} rx={16} fill="#0A7F78" /><text x={700 + i * 135 + 59} y={247} dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{(i + 1) * 6} m</text>
          <rect x={700 + i * 135 + 30} y={290} width={58} height={50} rx={10} fill="#1B2744" /><path d={`M${700 + i * 135 + 59},296 L${700 + i * 135 + 38},334 A30,30 0 0 0 ${700 + i * 135 + 80},334 Z`} fill="#7FE8FF" opacity={0.55} />
        </g>
      ))}
      <Txt x={900} y={420} txt="ecografía" t={28} p={ecografia} color={TXH.b} />
      <Txt x={1220} y={420} txt="con o sin alfafetoproteína" t={26} p={afp} color={TXH.hep} />
      {/* el puntaje PAGE-B en el B sin cirrosis */}
      <Etiqueta x={500} y={560} txt="en el B sin cirrosis: PAGE-B" color="#8A4FE8" p={page} t={32} punta="no" />
      <Fact x={330} y={700} R={56} tono={H.b} txt="edad" t={24} p={edad} /><Fact x={500} y={700} R={56} tono={['#B01E8A', '#E84AC0']} txt="sexo" t={24} p={sexo} /><Fact x={670} y={700} R={56} tono={H.sangre} txt="plaq." t={22} p={plaquetas} />
      <Txt x={670} y={790} txt="plaquetas" t={22} p={plaquetas} fuerte={false} />
      <g opacity={tramo(decidir, 0, 0.4)}><path d="M760,700 L900,700" stroke="var(--cit-flecha)" strokeWidth={9} strokeLinecap="round" /><polygon points="900,684 930,700 900,716" fill="var(--cit-flecha)" /></g>
      <BarraLab x={1020} y={810} w={80} alto={220} val={0.62} max={1} color="#8A4FE8" oscuro="#5A22A8" p={decidir} nombre="PAGE-B" valor="" t={24} />
      <Etiqueta x={1260} y={700} txt="decide quién entra" color="#B8237A" p={decidir} t={28} punta="no" />
      <Visto x={1450} y={840} k={0.9} p={pronostico} />
      <Txt x={1170} y={925} txt="mirar a tiempo cambia el pronóstico" t={34} p={pronostico} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Ecografia, Contraste, PorQueBiopsia, Trabeculas, Reticulina, Vigilar];
export default LAMINAS;
