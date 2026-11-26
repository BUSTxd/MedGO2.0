'use client';
// Capítulo 18 · El VHC: virus, genoma y ciclo
//
// El virión esmeralda con su cápside icosaédrica y su ARN de cadena positiva; el disfraz de lipoproteína (lipoviropartícula); las cuatro llaves de la
// entrada (CD81, SR-BI, claudina-1 y ocludina) y el viaje hasta el citoplasma; la traducción sin caperuza (IRES) con el miR-122 que protege el
// extremo 5′; la poliproteína que se corta en diez piezas; la membranous web donde NS5B copia el ARN sin corregir errores; las cuasiespecies; y el
// ensamblaje en las gotas de grasa, los ocho genotipos y el paciente 2.

import type { Lamina } from '../Lienzo';
import { Reticulo, Tijera, tijeretazo } from '../../bilirrubina/Piezas';
import { Arn } from '../../vih-sifilis/Piezas';
import { Anticuerpo, Busto, Etiqueta, Globo, Helice, Linfo, Sale, Sombra, TXH, Toro, Txt, VirionC, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo } from '../Piezas';
import { Hepatocito } from '../Higado';
import { Calendario, Fact, Hilo, Tacha, Tachon, Visto } from '../Extras';

type P2 = [number, number];
const ESM = ['#0B7A4A', '#14B870', '#A4F0CC'] as const;
const MAG = ['#A81878', '#E04AB0', '#FFB0E4'] as const;

/** Una esfera de lipoproteína (amarilla, con brillo). */
function Lipo({ x, y, r = 16, o = 1 }: { x: number; y: number; r?: number; o?: number }) {
  if (o <= 0.01) return null;
  return <g opacity={o}><circle cx={x + 2} cy={y + 4} r={r} fill="#000" opacity={0.15} /><circle cx={x} cy={y} r={r} fill="#C79A00" /><circle cx={x - 1.5} cy={y - 1.5} r={r - 2.2} fill="#FFD23F" /><circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#FFF" opacity={0.85} /></g>;
}

// ─── 0 · El virus C por fuera y por dentro ──────────────────────────────────
const Fuera: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), envuelto = p('envuelto'), capside = p('capside'), genoma = p('genoma'), positiva = p('positiva'), kb = p('kb'), humanos = p('humanos'), huesped = p('huesped'), rt = p('rt'), integra = p('integra'), citoplasma = p('citoplasma'), escondite = p('escondite');
  return (
    <g>
      <Globo x={640} y={90} txt="¿cómo es el virus C por fuera y por dentro?" t={34} p={pregunta} colaX={0} />
      <VirionC x={330} y={500} k={2.4} reloj={reloj} />
      <Etiqueta x={330} y={238} txt="virus envuelto" color="#14B870" p={envuelto} t={28} punta="no" />
      <Etiqueta x={330} y={775} txt="cápside icosaédrica" color="#0B7A4A" p={capside} t={28} punta="no" />
      <Hilo a={[330, 752]} b={[330, 575]} p={capside} />
      {/* el genoma: ARN de cadena positiva de 9,6 kb */}
      <Etiqueta x={1130} y={150} txt="genoma de ARN" color="#14B870" p={genoma} t={30} punta="no" />
      <Arn x={810} y={250} w={640} p={genoma} grosor={12} tono={ESM} fase={reloj / 600} />
      {Array.from({ length: 8 }, (_, i) => <Txt key={i} x={850 + i * 80} y={312} txt="+" t={40} p={positiva} color={TXH.c} />)}
      <Txt x={1130} y={375} txt="de cadena positiva" t={26} p={positiva} color={TXH.c} />
      <Txt x={1130} y={420} txt="de unas 9,6 kilobases" t={26} p={kb} color={TXH.c} />
      {/* su único huésped natural */}
      <Sombra><Sale p={humanos} x={820} y={620} k={0.3}><Busto quien="p1" reloj={reloj} fase={0.4} /></Sale></Sombra>
      <Txt x={820} y={730} txt="los humanos" t={28} p={humanos} color={TXH.c} />
      <Etiqueta x={820} y={790} txt="único huésped natural" color="#0B7A4A" p={huesped} t={24} punta="no" />
      {/* lo que no tiene ni hace */}
      <Txt x={1290} y={560} txt="transcriptasa inversa" t={28} p={rt} color={TXH.gris} /><Tachon x1={1110} x2={1470} y={560} p={rt} />
      <Txt x={1290} y={650} txt="integración al ADN" t={28} p={integra} color={TXH.gris} /><Tachon x1={1110} x2={1470} y={650} p={integra} />
      {/* todo ocurre en el citoplasma */}
      <Hepatocito x={1060} y={860} k={0.95} reloj={reloj} sem={4} infecta={H.c} brillo={citoplasma} />
      <Tacha x={1060} y={860} r={34} p={escondite} />
      <Txt x={1380} y={830} txt="todo ocurre en el citoplasma" t={26} p={citoplasma} color={TXH.c} />
      <Etiqueta x={1380} y={895} txt="sin escondite nuclear" color="#E5324C" p={escondite} t={26} punta="no" />
    </g>
  );
};

// ─── 1 · El disfraz de lipoproteína ─────────────────────────────────────────
const Disfraz: Lamina = ({ p, reloj }) => {
  const sale = p('sale'), disfrazado = p('disfrazado'), grasa = p('grasa'), lipoviro = p('lipoviro'), une = p('une'), apoe = p('apoe'), fabrica = p('fabrica'), ligera = p('ligera'), esconde = p('esconde'), anticuerpos = p('anticuerpos'), ayuda = p('ayuda'), receptores = p('receptores'), disfraz = p('disfraz');
  const vx = lerp(470, 820, easeOut(sale)), vy = 430;
  const globo = (x: number, y: number) => <g transform={`translate(${x},${(y + 8 * onda(reloj, 2600)).toFixed(1)})`}><path d="M0,44 C-6,70 6,86 0,110" fill="none" stroke={TXH.gris} strokeWidth={3} /><ellipse cx={3} cy={4} rx={34} ry={42} fill="#000" opacity={0.14} /><ellipse rx={34} ry={42} fill="#E8A81E" /><ellipse cx={-2} cy={-3} rx={31} ry={39} fill="#FFD23F" /><ellipse cx={-12} cy={-16} rx={8} ry={12} fill="#FFF" opacity={0.7} /></g>;
  return (
    <g>
      <Hepatocito x={230} y={330} k={1.0} reloj={reloj} sem={6} infecta={H.c} brillo={1} />
      <Txt x={230} y={470} txt="las fabrica el hepatocito" t={24} p={fabrica} color={TXH.hep} />
      {[0, 1, 2].map((i) => { const f = ((reloj / 1500 + i / 3) % 1); return <Lipo key={i} x={lerp(330, 700, f)} y={lerp(330, 420, f) - 34 * Math.sin(f * Math.PI)} o={tramo(fabrica, 0, 0.3) * Math.sin(f * Math.PI)} />; })}
      <VirionC x={vx} y={vy} k={2.0} reloj={reloj} lipo={easeOut(une)} />
      <Txt x={500} y={540} txt="sale a la calle" t={26} p={sale} color={TXH.gris} />
      <Etiqueta x={820} y={150} txt="disfrazado de grasa" color="#C79A00" p={disfrazado} t={30} punta="no" />
      {[0, 1, 2].map((i) => <Lipo key={i} x={1040 + i * 36} y={150 + 4 * onda(reloj, 1500, i)} r={14} o={tramo(grasa, i * 0.2, i * 0.2 + 0.4)} />)}
      <Etiqueta x={820} y={215} txt="lipoviropartícula" color="#0B7A4A" p={lipoviro} t={28} punta="no" />
      <Etiqueta x={1030} y={520} txt="APOE" color="#C79A00" p={apoe} t={22} punta="no" /><Etiqueta x={600} y={450} txt="APOE" color="#C79A00" p={apoe} t={22} punta="no" />
      {/* ligera, y esconde sus proteínas */}
      {ligera > 0.01 && <g opacity={tramo(ligera, 0, 0.4)}>{globo(480, 640)}</g>}
      <Txt x={480} y={790} txt="ligera" t={28} p={ligera} color={TXH.kupffer} />
      <Txt x={1390} y={200} txt="esconde sus proteínas" t={26} p={esconde} color={TXH.c} /><Txt x={1390} y={245} txt="de los anticuerpos" t={26} p={anticuerpos} color={TXH.ac} />
      {[0, 1, 2].map((i) => <Anticuerpo key={i} x={1250 - 120 * Math.abs(Math.sin(reloj / 600 + i)) * tramo(anticuerpos, 0, 0.3)} y={340 + i * 90} k={1.1} r={-90} o={tramo(anticuerpos, i * 0.1, i * 0.1 + 0.4)} />)}
      <Tacha x={1095} y={430} r={40} p={anticuerpos} />
      {/* la ayuda a entrar por los receptores de lípidos */}
      <rect x={560} y={862} width={760} height={56} rx={28} fill={H.membrana[0]} opacity={0.45 * tramo(ayuda, 0, 0.4)} /><rect x={560} y={854} width={760} height={56} rx={28} fill={H.membrana[1]} opacity={tramo(ayuda, 0, 0.4)} />
      <Toro x={760} y={846} k={0.7} tallo={40} tono={H.toro} reloj={reloj} o={tramo(ayuda, 0, 0.4)} /><Toro x={960} y={846} k={0.7} tallo={40} tono={H.toro} reloj={reloj} o={tramo(ayuda, 0, 0.4)} />
      <VirionC x={860} y={770 + 6 * onda(reloj, 1200)} k={0.75} reloj={reloj} lipo={1} o={tramo(ayuda, 0, 0.4)} />
      <Txt x={1190} y={750} txt="la ayuda a entrar" t={26} p={ayuda} color={TXH.c} /><Etiqueta x={1190} y={805} txt="receptores de lípidos" color="#C77800" p={receptores} t={24} punta="no" />
      <Txt x={800} y={968} txt="un disfraz de lipoproteína" t={38} p={disfraz} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Las cuatro llaves de la entrada ────────────────────────────────────
const MEMB_Y = 640, ESC = 1.45;

const Llaves: Lamina = ({ p, reloj }) => {
  const llaves = p('llaves'), e2 = p('e2'), cd81 = p('cd81'), srb1 = p('srb1'), claudina = p('claudina'), ocludina = p('ocludina'), completan = p('completan'), endocitosis = p('endocitosis'), fusion = p('fusion'), endosoma = p('endosoma'), arn = p('arn'), citoplasma = p('citoplasma'), variable = p('variable');
  const m1 = easeOut(cd81), m2 = easeOut(ocludina), m3 = easeOut(endocitosis), m4 = easeOut(endosoma);
  let vx = lerp(180, 360, m1); vx = lerp(vx, 820, m2); vx = lerp(vx, 1060, m4);
  let vy = lerp(330, 440, m1); vy = lerp(vy, 790, m3); vy = lerp(vy, 840, m4);
  vy += 6 * Math.sin(reloj / 500);
  const vo = tramo(e2, 0, 0.4) * (1 - tramo(fusion, 0.2, 0.9));
  const fuera = 1 - tramo(endocitosis, 0, 0.3);
  const luz = (q: number, x: number, y: number, col: string) => <circle cx={x} cy={y} r={54 + 6 * Math.sin(reloj / 260)} fill={col} opacity={0.3 * tramo(q, 0, 0.3)} />;
  const rec = (x: number) => `translate(${x},${MEMB_Y}) scale(${ESC})`;
  return (
    <g>
      <Globo x={640} y={90} txt="¿cuántas llaves necesita para entrar?" t={34} p={llaves} colaX={0} />
      <rect x={40} y={MEMB_Y + 56} width={1520} height={304} fill={H.hep[2]} opacity={0.3} />
      <rect x={40} y={MEMB_Y + 8} width={1520} height={56} rx={28} fill={H.membrana[0]} opacity={0.45} /><rect x={40} y={MEMB_Y} width={1520} height={56} rx={28} fill={H.membrana[1]} />
      {/* los receptores de la membrana */}
      {luz(cd81, 300, MEMB_Y - 67, '#FF8A1E')}{luz(srb1, 420, MEMB_Y - 75, '#E04AB0')}{luz(claudina, 780, MEMB_Y - 44, '#8A4FE8')}{luz(ocludina, 860, MEMB_Y - 44, '#2F55E0')}
      <g transform={rec(300)}><line y2={-34} stroke="#C25A00" strokeWidth={10} strokeLinecap="round" /><ellipse cy={-46} rx={26} ry={14} fill="none" stroke="#FF8A1E" strokeWidth={9} /></g>
      <g transform={rec(420)}><line y2={-40} stroke="#B8237A" strokeWidth={10} strokeLinecap="round" /><circle cy={-52} r={19} fill="#E04AB0" /><circle cx={-6} cy={-58} r={5} fill="#FFF" opacity={0.7} /></g>
      <g transform={rec(780)}><rect x={-13} y={-60} width={26} height={62} rx={10} fill="#8A4FE8" /><rect x={-7} y={-54} width={7} height={46} rx={3} fill="#D2B8FF" opacity={0.6} /></g>
      <g transform={rec(860)}><rect x={-13} y={-60} width={26} height={62} rx={10} fill="#2F55E0" /><rect x={-7} y={-54} width={7} height={46} rx={3} fill="#A8BEFF" opacity={0.6} /></g>
      <Etiqueta x={300} y={MEMB_Y + 112} txt="CD81" color="#C25A00" p={cd81 * fuera} t={24} punta="no" /><Etiqueta x={420} y={MEMB_Y + 112} txt="SR-BI" color="#B8237A" p={srb1 * fuera} t={24} punta="no" />
      <Etiqueta x={735} y={MEMB_Y + 112} txt="claudina-1" color="#8A4FE8" p={claudina * fuera} t={24} punta="no" /><Etiqueta x={910} y={MEMB_Y + 112} txt="ocludina" color="#2F55E0" p={ocludina * fuera} t={24} punta="no" />
      <Txt x={820} y={MEMB_Y + 170} txt="uniones estrechas" t={24} p={ocludina * fuera} color={TXH.gris} />
      {/* el virus viaja: se une, se desliza a la unión, entra en un endosoma, se fusiona y suelta su ARN */}
      <g opacity={tramo(endocitosis, 0, 0.5) * (1 - 0.5 * tramo(fusion, 0, 1))}>
        <circle cx={vx} cy={vy} r={150} fill="#FFFFFF" opacity={0.18} /><circle cx={vx} cy={vy} r={150} fill="none" stroke="#FFB0F0" strokeWidth={12} strokeDasharray={fusion > 0.05 ? '18 14' : undefined} />
      </g>
      <VirionC x={vx} y={vy} k={1.25} reloj={reloj} o={vo} />
      <Etiqueta x={vx} y={vy - 140} txt="E2" color="#14B870" p={e2 * (1 - tramo(endocitosis, 0, 0.4))} t={28} punta="no" />
      <Etiqueta x={vx} y={vy - 185} txt="endosoma" color="#B02FA0" p={endosoma} t={26} punta="no" />
      <Arn x={lerp(vx - 115, 1180, easeOut(citoplasma))} y={vy + 24 * easeOut(citoplasma)} w={230} p={arn} grosor={12} tono={ESM} fase={reloj / 500} />
      <Txt x={1330} y={925} txt="citoplasma" t={32} p={citoplasma} color={TXH.c} />
      <Txt x={560} y={200} txt="la envoltura se fusiona con la membrana del endosoma" t={26} p={fusion} color={TXH.hep} />
      <Txt x={560} y={248} txt="y el ARN llega al citoplasma" t={26} p={arn} color={TXH.c} />
      <Txt x={820} y={300} txt="completan la entrada" t={26} p={completan * fuera} color={TXH.d} />
      {/* E2, la más variable */}
      <Etiqueta x={1290} y={330} txt="E2: la proteína más variable" color="#E5324C" p={variable} t={28} punta="no" />
      <g opacity={tramo(variable, 0, 0.4)}>
        {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${1100 + i * 80},500) scale(1.25)`}><line y2={-44} stroke={`hsl(${(i * 55 + reloj / 14) % 360},65%,40%)`} strokeWidth={9} strokeLinecap="round" /><circle cy={-58} r={17} fill={`hsl(${(i * 55 + reloj / 14) % 360},75%,55%)`} /></g>)}
      </g>
    </g>
  );
};

// ─── 3 · La traducción empieza en el IRES ───────────────────────────────────
const Traduccion: Lamina = ({ p, reloj }) => {
  const arranca = p('arranca'), ribosomas = p('ribosomas'), reconocen = p('reconocen'), ires = p('ires'), traducen = p('traducen'), caperuza = p('caperuza'), mir = p('mir'), abundante = p('abundante'), higado = p('higado'), une = p('une'), extremo = p('extremo'), estabiliza = p('estabiliza'), hepatotropo = p('hepatotropo');
  const rx = lerp(360, 900, easeOut(traducen)), ry = lerp(300, 520, easeOut(ribosomas));
  const joinMir = easeOut(une);
  const comer = Math.abs(Math.sin(reloj / 380)) * easeOut(estabiliza);
  const COLS = ['#E5324C', '#E8841E', '#F2B21E', '#C25A00', '#2F55E0', '#0A9E9A', '#14B870', '#8A4FE8'];
  return (
    <g>
      <Globo x={640} y={90} txt="¿cómo arranca la traducción?" t={34} p={arranca} colaX={0} />
      <Arn x={170} y={520} w={1260} p={arranca} grosor={14} tono={ESM} fase={reloj / 900} />
      <Txt x={140} y={520} txt="5′" t={26} p={arranca} color={TXH.c} /><Txt x={1470} y={520} txt="3′" t={26} p={arranca} color={TXH.c} />
      {/* el IRES: tres horquillas bajo el extremo 5′ */}
      {[0, 1, 2].map((j) => <path key={j} d={`M${300 + j * 62},520 C${300 + j * 62},565 ${286 + j * 62},585 ${314 + j * 62},590 C${342 + j * 62},585 ${328 + j * 62},565 ${328 + j * 62},520`} fill="none" stroke="#0A9E9A" strokeWidth={9} strokeLinecap="round" opacity={tramo(ires, 0, 0.4)} />)}
      <Etiqueta x={400} y={650} txt="IRES" color="#0A9E9A" p={ires} t={28} punta="no" />
      {/* el ribosoma baja, reconoce el IRES y se pone a traducir */}
      <g opacity={tramo(ribosomas, 0, 0.3)}>
        <ellipse cx={rx + 4} cy={ry - 26} rx={82} ry={50} fill="#000" opacity={0.13} />
        <ellipse cx={rx} cy={ry - 32} rx={80} ry={48} fill="#C77800" /><ellipse cx={rx - 3} cy={ry - 36} rx={74} ry={42} fill="#FFB21E" /><ellipse cx={rx - 20} cy={ry - 52} rx={20} ry={9} fill="#FFF" opacity={0.55} />
        <ellipse cx={rx} cy={ry + 24} rx={62} ry={28} fill="#8A4A00" /><ellipse cx={rx - 2} cy={ry + 21} rx={57} ry={23} fill="#E89A00" />
      </g>
      <Txt x={rx} y={ry + 84} txt="ribosoma" t={24} p={ribosomas} color={TXH.kupffer} />
      <circle cx={360} cy={520} r={70 + 6 * Math.sin(reloj / 250)} fill="none" stroke="#14B870" strokeWidth={5} opacity={0.7 * tramo(reconocen, 0, 0.3) * (1 - tramo(traducen, 0, 0.3))} />
      <Txt x={360} y={420} txt="reconoce el IRES" t={24} p={reconocen * (1 - tramo(traducen, 0, 0.3))} color={TXH.c} />
      {COLS.map((c, i) => <circle key={i} cx={rx + 10 + i * 18} cy={ry - 94 - i * 14} r={11} fill={c} opacity={tramo(traducen, i / 10, i / 10 + 0.2)} />)}
      <Txt x={700} y={320} txt="traduce sin la caperuza habitual" t={26} p={traducen} color={TXH.hep} />
      {/* sin caperuza */}
      <g opacity={tramo(caperuza, 0, 0.4)}><circle cx={150} cy={450} r={24} fill="#C25A00" /><circle cx={148} cy={448} r={20} fill="#FF8A1E" /></g>
      <Tacha x={150} y={450} r={30} p={caperuza} /><Txt x={150} y={398} txt="caperuza" t={22} p={caperuza} color={TXH.a} />
      {/* el miR-122 protege el extremo 5′ */}
      {[0, 1].map((i) => <g key={i} transform={`translate(${lerp(150 + i * 80, 175 + i * 52, joinMir)},${lerp(700 + 6 * Math.sin(reloj / 600 + i), 548, joinMir)})`} opacity={tramo(mir, 0, 0.4)}><rect x={-26} y={-12} width={52} height={24} rx={12} fill="#A81878" /><rect x={-22} y={-9} width={44} height={14} rx={7} fill="#E04AB0" /><line x1={-14} x2={14} y1={0} y2={0} stroke="#FFB0E4" strokeWidth={3} strokeDasharray="3 5" /></g>)}
      <Etiqueta x={190} y={775} txt="miR-122" color="#B8237A" p={mir} t={26} punta="no" />
      <Txt x={640} y={700} txt="un microARN abundante" t={24} p={abundante} color={TXH.hep} /><Txt x={640} y={745} txt="en el hígado" t={24} p={higado} color={TXH.hep} />
      <Etiqueta x={185} y={345} txt="extremo 5′" color="#0B7A4A" p={extremo} t={24} punta="no" />
      <circle cx={170} cy={520} r={62} fill="#14B870" opacity={0.22 * tramo(estabiliza, 0, 0.4)} /><circle cx={170} cy={520} r={62} fill="none" stroke="#14B870" strokeWidth={5} strokeDasharray="10 8" opacity={tramo(estabiliza, 0, 0.4)} />
      <g transform={`translate(${52 + 34 * comer},505)`} opacity={tramo(estabiliza, 0, 0.3)}><circle r={26} fill="#E8A81E" /><path d="M0,0 L24,-14 A28,28 0 0 1 24,14 Z" fill="#FFF8E8" /><circle cx={-6} cy={-12} r={4} fill="#5A3A00" /></g>
      <Txt x={170} y={830} txt="estabiliza el ARN" t={26} p={estabiliza} color={TXH.c} />
      {/* por eso es tan hepatotrópico */}
      <Hepatocito x={1000} y={830} k={0.62} reloj={reloj} sem={5} infecta={H.nk} brillo={hepatotropo} />
      <circle cx={1280} cy={830} r={56} fill="#C8C0D4" opacity={tramo(hepatotropo, 0, 0.4)} /><circle cx={1280} cy={830} r={30} fill="#A89EBC" opacity={tramo(hepatotropo, 0, 0.4)} />
      <Txt x={1000} y={925} txt="hígado: mucho miR-122" t={22} p={hepatotropo} color={TXH.hep} /><Txt x={1280} y={925} txt="otra célula: casi nada" t={22} p={hepatotropo} color={TXH.gris} />
      <Etiqueta x={1140} y={720} txt="tan hepatotrópico" color="#B8237A" p={hepatotropo} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · Una cadena, diez proteínas ─────────────────────────────────────────
const PIEZAS_C = [
  { id: 'core', txt: 'core', col: '#E5324C' }, { id: 'e1', txt: 'E1', col: '#E8841E' }, { id: 'e2', txt: 'E2', col: '#F2B21E' }, { id: 'p7', txt: 'p7', col: '#C25A00' },
  { id: 'ns2', txt: 'NS2', col: '#2F55E0' }, { id: 'ns3', txt: 'NS3', col: '#0A9E9A' }, { id: 'ns4a', txt: 'NS4A', col: '#14B870' }, { id: 'ns4b', txt: 'NS4B', col: '#8A4FE8' },
  { id: 'ns5a', txt: 'NS5A', col: '#E04AB0' }, { id: 'ns5b', txt: 'NS5B', col: '#4F7FF0' },
] as const;

const Poliproteina: Lamina = ({ p, reloj }) => {
  const cadena = p('cadena'), larga = p('larga'), corta = p('corta'), estruct = p('estruct'), noestruct = p('noestruct'), ojo = p('ojo'), autoproteasa = p('autoproteasa'), serinproteasa = p('serinproteasa'), helicasa = p('helicasa'), dos = p('dos');
  const q: Record<string, number> = { core: p('core'), e1: p('e1'), e2: p('e2'), p7: p('p7'), ns2: p('ns2'), ns3: p('ns3'), ns4a: p('ns4a'), ns4b: p('ns4b'), ns5a: p('ns5a'), ns5b: p('ns5b') };
  const W = 126, GAP = 22 * easeOut(corta), total = 10 * W + 9 * GAP, x0 = 800 - total / 2, CY = 540;
  const cx = (i: number) => x0 + i * (W + GAP) + W / 2;
  const snip = tijeretazo(reloj, 700), cortando = tramo(corta, 0, 0.25) * (1 - tramo(corta, 0.75, 1));
  const pulsa = 1 + 0.1 * Math.max(0, Math.sin(reloj / 260)) * tramo(dos, 0, 0.3);
  return (
    <g>
      <Etiqueta x={800} y={110} txt="una cadena, 10 proteínas" color="#0B7A4A" p={cadena} t={36} punta="no" />
      <Txt x={800} y={205} txt="se fabrica una sola cadena larga" t={28} p={larga * (1 - tramo(corta, 0, 0.3))} color={TXH.c} />
      <Txt x={800} y={205} txt="que se corta en 10 piezas" t={28} p={corta} color={TXH.hep} />
      {PIEZAS_C.map((pz, i) => {
        const rev = tramo(q[pz.id], 0, 0.5), col = mezcla('#9CB8A8', pz.col, rev), o = tramo(larga, i / 12, i / 12 + 0.3);
        return (
          <g key={pz.id} opacity={o}>
            <rect x={cx(i) - W / 2 + 4} y={CY - 48 + 8} width={W} height={96} rx={22} fill="#000" opacity={0.14} />
            <rect x={cx(i) - W / 2} y={CY - 48} width={W} height={96} rx={22} fill={col} />
            <rect x={cx(i) - W / 2 + 10} y={CY - 40} width={W - 20} height={14} rx={7} fill="#FFF" opacity={0.28} />
            <Txt x={cx(i)} y={CY + 6} txt={rev > 0.2 ? pz.txt : ''} t={32} p={rev} color="#FFFFFF" />
          </g>
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Sale key={i} p={cortando} x={cx(i) + W / 2 + GAP / 2} y={CY - 90}><g transform="rotate(90)"><Tijera corta={snip} k={0.42} /></g></Sale>)}
      {/* 4 estructurales y 6 no estructurales */}
      <g opacity={tramo(estruct, 0, 0.4)}><path d={`M${cx(0) - W / 2},${CY - 70} L${cx(0) - W / 2},${CY - 88} L${cx(3) + W / 2},${CY - 88} L${cx(3) + W / 2},${CY - 70}`} fill="none" stroke="#E8841E" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g>
      <Etiqueta x={(cx(0) + cx(3)) / 2} y={CY - 128} txt="4 estructurales" color="#E8841E" p={estruct} t={26} punta="no" />
      <g opacity={tramo(noestruct, 0, 0.4)}><path d={`M${cx(4) - W / 2},${CY - 70} L${cx(4) - W / 2},${CY - 88} L${cx(9) + W / 2},${CY - 88} L${cx(9) + W / 2},${CY - 70}`} fill="none" stroke="#2F55E0" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></g>
      <Etiqueta x={(cx(4) + cx(9)) / 2} y={CY - 128} txt="6 no estructurales" color="#2F55E0" p={noestruct} t={26} punta="no" />
      <Etiqueta x={800} y={290} txt="ojo con NS2 y NS3" color="#E5324C" p={ojo} t={30} punta="no" />
      {/* NS2 se corta a sí misma; NS3/4A, la serinproteasa y también la helicasa */}
      <Sale p={autoproteasa} x={cx(4)} y={CY + 130} k={pulsa}><g transform="rotate(-90)"><Tijera corta={snip} k={0.7} /></g></Sale>
      <Txt x={cx(4)} y={CY + 215} txt="autoproteasa" t={24} p={autoproteasa} color={TXH.b} />
      <Sale p={serinproteasa} x={(cx(5) + cx(6)) / 2} y={CY + 130} k={pulsa}><g transform="rotate(-90)"><Tijera corta={snip} k={0.7} /></g></Sale>
      <Txt x={(cx(5) + cx(6)) / 2} y={CY + 215} txt="serinproteasa" t={24} p={serinproteasa} color={TXH.c} />
      <Helice x={(cx(5) + cx(6)) / 2} y={CY + 305} w={190} amp={16} reloj={reloj} p={helicasa} grosor={9} tono={H.verde} vueltas={2} />
      <Etiqueta x={(cx(5) + cx(6)) / 2} y={CY + 370} txt="helicasa" color="#0A9E9A" p={helicasa} t={26} punta="no" />
      <Txt x={800} y={965} txt="dos proteasas, no una" t={42} p={dos} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La membranous web ──────────────────────────────────────────────────
const Fabrica: Lamina = ({ p, reloj }) => {
  const donde = p('donde'), ns4b = p('ns4b'), reorganiza = p('reorganiza'), reticulo = p('reticulo'), vesiculas = p('vesiculas'), web = p('web'), complejo = p('complejo'), ns5b = p('ns5b'), polimerasa = p('polimerasa'), copia = p('copia'), positivo = p('positivo'), negativo = p('negativo'), muchos = p('muchos'), corrige = p('corrige'), errores = p('errores');
  const pol = lerp(1070, 1390, (reloj / 2600) % 1);
  return (
    <g>
      <Globo x={640} y={90} txt="¿dónde se arma la fábrica?" t={34} p={donde} colaX={0} />
      <Reticulo x={400} y={340} w={560} n={4} o={tramo(reticulo, 0, 0.3) * (1 - tramo(vesiculas, 0, 0.8))} reloj={reloj} />
      <Etiqueta x={400} y={250} txt="retículo endoplásmico" color="#B02FA0" p={reticulo} t={24} punta="no" />
      <Fact x={230} y={520} R={44} tono={H.prot} txt="NS4B" t={20} p={ns4b} />
      <Txt x={420} y={610} txt="NS4B reorganiza las membranas" t={24} p={reorganiza} color={TXH.hep} />
      {Array.from({ length: 10 }, (_, i) => {
        const x = 560 + (hash(i, 11) - 0.5) * 420, y = 400 + (hash(i, 12) - 0.5) * 230, r = 34 + 26 * hash(i, 13), q = easeBack(tramo(vesiculas, i / 14, i / 14 + 0.3));
        return q > 0.01 ? (
          <g key={i} transform={`translate(${x.toFixed(1)},${(y + 5 * Math.sin(reloj / 700 + i)).toFixed(1)}) scale(${q.toFixed(3)})`}>
            <circle r={r} fill="#FFE4F8" opacity={0.6} /><circle r={r} fill="none" stroke={H.membrana[1]} strokeWidth={9} /><circle r={r} fill="none" stroke="#FFF" strokeWidth={3} opacity={0.5} transform="translate(-3,-3)" />
            {[0, 1, 2].map((j) => <circle key={j} cx={(hash(j, i + 20) - 0.5) * r} cy={(hash(j, i + 30) - 0.5) * r} r={4.5} fill="#14B870" />)}
          </g>
        ) : null;
      })}
      <Etiqueta x={560} y={700} txt="membranous web" color="#B02FA0" p={web} t={28} punta="no" />
      <Txt x={560} y={760} txt="una red de vesículas" t={24} p={vesiculas} color={TXH.hep} />
      {/* el complejo de replicación */}
      <circle cx={1240} cy={520} r={282} fill="#FFE4F8" opacity={0.45 * tramo(complejo, 0, 0.4)} /><circle cx={1240} cy={520} r={282} fill="none" stroke={H.membrana[1]} strokeWidth={14} opacity={tramo(complejo, 0, 0.4)} />
      <Etiqueta x={1240} y={190} txt="complejo de replicación" color="#B02FA0" p={complejo} t={28} punta="no" />
      <Arn x={1040} y={430} w={400} p={complejo} grosor={12} tono={ESM} fase={reloj / 700} />
      <Txt x={1010} y={430} txt="+" t={40} p={positivo} color={TXH.c} />
      <Arn x={1040} y={520} w={400} p={negativo} grosor={12} tono={MAG} fase={reloj / 700 + 1} />
      <Txt x={1010} y={520} txt="−" t={44} p={negativo} color={TXH.hep} />
      {[0, 1, 2].map((i) => <Arn key={i} x={1060 + i * 8} y={610 + i * 46} w={340} p={muchos} grosor={11} tono={ESM} fase={reloj / 700 + i} />)}
      <Txt x={1010} y={650} txt="+ + +" t={30} p={muchos} color={TXH.c} />
      <g opacity={tramo(ns5b, 0, 0.3)}><circle cx={pol + 3} cy={480 + 5} r={36} fill="#000" opacity={0.14} /><circle cx={pol} cy={480} r={36} fill="#C25A00" /><circle cx={pol - 3} cy={476} r={32} fill="#FF8A1E" /><circle cx={pol - 12} cy={464} r={8} fill="#FFF" opacity={0.6} /></g>
      <Txt x={pol} y={420} txt="NS5B" t={22} p={ns5b} color={TXH.a} />
      <Txt x={1240} y={850} txt="ARN polimerasa: copia el positivo a negativo" t={24} p={polimerasa} color={TXH.a} />
      <Txt x={1240} y={895} txt="y de ahí fabrica muchos positivos" t={24} p={copia} color={TXH.c} />
      {/* no corrige errores */}
      <g transform={`translate(${1270},${560}) scale(${(1 + 0.3 * Math.sin(reloj / 140)).toFixed(3)})`} opacity={tramo(corrige, 0, 0.3)}><path d="M0,-24 L7,-7 L24,0 L7,7 L0,24 L-7,7 L-24,0 L-7,-7 Z" fill="#E5324C" /></g>
      <Etiqueta x={560} y={880} txt="y no corrige errores" color="#E5324C" p={errores} t={34} punta="no" />
      <Txt x={560} y={940} txt="cada copia puede salir distinta" t={26} p={errores} color={TXH.sangre} />
    </g>
  );
};

// ─── 6 · Cuasiespecies ──────────────────────────────────────────────────────
/** Un virión pequeño de color propio: cada variante es un poco distinta. */
function Variante({ x, y, h, k = 1, o = 1, fase = 0, reloj }: { x: number; y: number; h: number; k?: number; o?: number; fase?: number; reloj: number }) {
  if (o <= 0.01) return null;
  const col = `hsl(${h},65%,38%)`, luz = `hsl(${h},75%,56%)`;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(reloj / 40 + fase * 40) % 360}) scale(${k})`} opacity={o}>
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.283; return <g key={i}><line x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 31} y2={Math.sin(a) * 31} stroke={col} strokeWidth={4} strokeLinecap="round" /><circle cx={Math.cos(a) * 33} cy={Math.sin(a) * 33} r={4} fill={luz} /></g>; })}
      <circle r={22} fill={col} /><circle cx={-2} cy={-2} r={18} fill={luz} /><circle cx={-7} cy={-8} r={4.5} fill="#FFF" opacity={0.7} />
    </g>
  );
}

const Cuasiespecies: Lamina = ({ p, reloj }) => {
  const equivoca = p('equivoca'), epatocito = p('epatocito'), variantes = p('variantes'), cuasi = p('cuasi'), variabilidad = p('variabilidad'), e2 = p('e2'), escapar = p('escapar'), anticuerpos = p('anticuerpos'), linfocitos = p('linfocitos'), cambia = p('cambia'), persigue = p('persigue');
  return (
    <g>
      <Hepatocito x={330} y={500} k={1.5} reloj={reloj} sem={7} infecta={H.c} brillo={1} />
      <Etiqueta x={330} y={290} txt="la polimerasa se equivoca" color="#E5324C" p={equivoca} t={28} punta="no" />
      <Txt x={330} y={760} txt="cada hepatocito infectado" t={26} p={epatocito} color={TXH.hep} /><Txt x={330} y={805} txt="produce variantes" t={26} p={variantes} color={TXH.c} />
      {Array.from({ length: 22 }, (_, i) => {
        const u = (reloj / 6500 + i / 22) % 1;
        const x = lerp(470, 1180, u), y = 500 + (hash(i, 3) - 0.5) * 2 * 190 * (0.25 + u) + 14 * Math.sin(reloj / 500 + i);
        return <Variante key={i} x={x} y={y} h={85 + 100 * hash(i, 4) + (cuasi > 0.1 ? 25 * Math.sin(reloj / 400 + i) : 0)} k={0.55 + 0.35 * hash(i, 5)} o={tramo(variantes, i / 30, i / 30 + 0.2) * Math.min(1, u * 8) * (1 - tramo(u, 0.9, 1))} fase={i} reloj={reloj} />;
      })}
      {[0, 1, 2, 3].map((i) => { const x = 700 + i * 140 + 20 * Math.sin(reloj / 700 + i), y = 330 + 36 * Math.sin(reloj / 520 + i * 2); return <g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(1 + 0.3 * Math.sin(reloj / 150 + i)).toFixed(3)})`} opacity={tramo(equivoca, 0, 0.3) * 0.9}><path d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z" fill="#FFD23F" /></g>; })}
      <Etiqueta x={800} y={125} txt="cuasiespecies" color="#0B7A4A" p={cuasi} t={40} punta="no" />
      <Txt x={800} y={205} txt="variabilidad, sobre todo en" t={26} p={variabilidad} color={TXH.c} /><Etiqueta x={1090} y={205} txt="E2" color="#14B870" p={e2} t={26} punta="no" />
      {/* escapa de los anticuerpos y de los linfocitos T, que siempre llegan tarde */}
      <Txt x={1390} y={330} txt="escapa de" t={26} p={escapar} color={TXH.sangre} />
      {[0, 1, 2].map((i) => <Anticuerpo key={i} x={1290 + 50 * Math.abs(Math.sin(reloj / 650 + i)) * tramo(anticuerpos, 0, 0.3)} y={430 + i * 80} k={1.1} r={-90} o={tramo(anticuerpos, i * 0.1, i * 0.1 + 0.4)} />)}
      <Etiqueta x={1490} y={510} txt="anticuerpos" color="#6A9A00" p={anticuerpos} t={24} punta="no" />
      <Linfo x={1360} y={760} k={1.1} reloj={reloj} activo={0.6 * tramo(linfocitos, 0, 0.3)} o={tramo(linfocitos, 0, 0.4)} />
      <Etiqueta x={1360} y={870} txt="linfocitos T" color="#0A7F78" p={linfocitos} t={24} punta="no" />
      <Txt x={800} y={905} txt="un virus que cambia" t={34} p={cambia} color={TXH.hep} />
      <Txt x={800} y={955} txt="más rápido de lo que se le persigue" t={30} p={persigue} color={TXH.c} />
    </g>
  );
};

// ─── 7 · Ensamblaje, genotipos y el paciente 2 ──────────────────────────────
const Ensamblaje: Lamina = ({ p, reloj }) => {
  const ultimo = p('ultimo'), core = p('core'), gotas = p('gotas'), ensamblan = p('ensamblan'), salen = p('salen'), lipoproteinas = p('lipoproteinas'), genotipos = p('genotipos'), paciente = p('paciente'), expuesto = p('expuesto'), transfusion = p('transfusion'), treinta = p('treinta'), tamizara = p('tamizara'), nucleicos = p('nucleicos'), silenciosa = p('silenciosa'), decadas = p('decadas');
  const GOTAS: P2[] = [[300, 520], [430, 470], [380, 640], [250, 400], [470, 590]];
  return (
    <g>
      <Etiqueta x={430} y={105} txt="último tramo del ciclo" color="#0B7A4A" p={ultimo} t={30} punta="no" />
      {/* el hepatocito: el core en las gotas de grasa, el ensamblaje y la salida con las lipoproteínas */}
      <rect x={90} y={190} width={660} height={640} rx={120} fill="#000" opacity={0.1} transform="translate(6,10)" /><rect x={90} y={190} width={660} height={640} rx={120} fill="var(--hv-cel-1)" /><rect x={110} y={210} width={620} height={600} rx={104} fill="var(--hv-cel-2)" opacity={0.55} />
      <circle cx={230} cy={310} r={64} fill={H.nucleo[1]} opacity={0.9} /><circle cx={224} cy={304} r={52} fill={H.nucleo[2]} opacity={0.55} />
      {GOTAS.map(([gx, gy], i) => (
        <g key={i} opacity={tramo(gotas, i / 8, i / 8 + 0.3)}>
          <circle cx={gx} cy={gy} r={46 + 4 * i % 3} fill="#F2C440" /><circle cx={gx - 3} cy={gy - 3} r={40 + 4 * i % 3} fill="#FFE98A" /><circle cx={gx - 14} cy={gy - 16} r={8} fill="#FFF" opacity={0.8} />
          {Array.from({ length: 5 }, (_, j) => { const a = (j / 5) * 6.283 + i; return <circle key={j} cx={gx + Math.cos(a) * 60} cy={gy + Math.sin(a) * 60} r={7} fill="#14B870" opacity={tramo(core, 0, 0.5)} />; })}
        </g>
      ))}
      <Txt x={380} y={250} txt="gotas lipídicas" t={24} p={gotas} color={TXH.kupffer} /><Etiqueta x={560} y={380} txt="core" color="#14B870" p={core} t={24} punta="no" />
      {[0, 1, 2].map((i) => <VirionC key={i} x={470 + i * 52} y={720 - i * 6 + 6 * Math.sin(reloj / 600 + i)} k={0.32} reloj={reloj} o={tramo(ensamblan, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={520} y={790} txt="se ensamblan los viriones" color="#0B7A4A" p={ensamblan} t={22} punta="no" />
      {[0, 1, 2].map((i) => { const f = ((reloj / 2000 + i / 3) % 1) * tramo(salen, 0, 0.3); return <VirionC key={i} x={lerp(560, 830, f)} y={680 + 20 * Math.sin(i * 2 + f * 5)} k={0.3} lipo={1} reloj={reloj} o={Math.sin(f * Math.PI)} />; })}
      <Txt x={400} y={872} txt="salen por la vía" t={24} p={salen} color={TXH.c} /><Txt x={400} y={910} txt="de las lipoproteínas" t={24} p={lipoproteinas} color={TXH.kupffer} />
      {/* ocho genotipos */}
      <Etiqueta x={1250} y={190} txt="8 genotipos" color="#8A4FE8" p={genotipos} t={32} punta="no" />
      {Array.from({ length: 8 }, (_, i) => { const x = 1060 + (i % 4) * 130, y = 290 + Math.floor(i / 4) * 120, q = easeBack(tramo(genotipos, i / 14, i / 14 + 0.3)); return q > 0.01 ? <g key={i} transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}><circle cx={3} cy={6} r={44} fill="#000" opacity={0.14} /><circle r={44} fill={`hsl(${i * 40},60%,38%)`} /><circle cx={-2} cy={-2} r={39} fill={`hsl(${i * 40},70%,56%)`} /><circle cx={-14} cy={-16} r={8} fill="#FFF" opacity={0.6} /></g> : null; })}
      {Array.from({ length: 8 }, (_, i) => <Txt key={i} x={1060 + (i % 4) * 130} y={290 + Math.floor(i / 4) * 120} txt={String(i + 1)} t={38} p={genotipos} color="#FFFFFF" />)}
      {/* el paciente 2 y su transfusión */}
      <Sombra><Sale p={paciente} x={950} y={700} k={0.38}><Busto quien="p2" reloj={reloj} fase={1.5} habla={0} /></Sale></Sombra>
      <Etiqueta x={950} y={820} txt="paciente 2" color="#6E4AD8" p={paciente} t={26} punta="no" />
      <Txt x={950} y={875} txt="estuvo expuesto" t={24} p={expuesto} color={TXH.d} />
      <g opacity={tramo(transfusion, 0, 0.4)} transform="translate(1180,640)"><rect x={-44} y={-62} width={88} height={124} rx={26} fill="#000" opacity={0.14} transform="translate(5,7)" /><rect x={-44} y={-62} width={88} height={124} rx={26} fill="#F4A0AC" /><rect x={-38} y={-8} width={76} height={64} rx={20} fill="#E3203F" /><rect x={-14} y={-92} width={28} height={34} rx={8} fill="#B8C4D8" /></g>
      <Txt x={1180} y={750} txt="transfusión" t={26} p={transfusion} color={TXH.sangre} />
      <Calendario x={1400} y={650} k={0.9} o={tramo(treinta, 0, 0.4)} n="30" unidad="años" />
      <Txt x={1400} y={750} txt="hace 30 años" t={26} p={treinta} color={TXH.gris} />
      <Txt x={1290} y={830} txt="antes de que se tamizara" t={24} p={tamizara} color={TXH.gris} /><Txt x={1290} y={870} txt="con ácidos nucleicos" t={24} p={nucleicos} color={TXH.gris} /><Tachon x1={1150} x2={1430} y={870} p={nucleicos} />
      <Txt x={800} y={935} txt="una exposición silenciosa" t={36} p={silenciosa} color={TXH.hep} /><Txt x={800} y={980} txt="que tardó décadas en mostrarse" t={28} p={decadas} color={TXH.c} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Fuera, Disfraz, Llaves, Traduccion, Poliproteina, Fabrica, Cuasiespecies, Ensamblaje];
export default LAMINAS;
