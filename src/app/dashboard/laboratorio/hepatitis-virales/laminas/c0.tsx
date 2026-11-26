'use client';
// Capítulo 0 · Dos pacientes, un órgano (vistazo gratis)
//
// Cada paciente es un busto vivo (parpadea, respira, mueve la cabeza y las cejas, se frota los ojos) y cada dato es un dibujo: un tubo de
// sangre cuyas fichas entran al nombrarse, barras de laboratorio que suben, una nube de virus que se espesa, la pantalla de una ecografía
// con su nódulo, una bolsa de transfusión, un frasco de orina que se oscurece, una pierna con manchas. Lo escrito va suelto y en segundo plano
// (docs/hepatitis-virales/ESTILO.md). Referencias: «presentación de varios pacientes», «diseño de hombre adulto», «time line».

import type { Lamina } from '../Lienzo';
import { Anticuerpo, Busto, Capsula, Cruz, Etiqueta, Higado, Levita, Linfo, Nota, Pierna, Sale, Sombra, Suelo, TXH, TuboEnsayo, Tranvia, Txt, Visto, VirionAE, VirionB, VirionC, VirionD, Zoom, clamp, easeOut, hash, lerp, onda, tramo, BolsaSangre, Globo, Flecha, H } from '../Piezas';
import { Colageno, Hepatocito, Trabecula } from '../Higado';
import { BarraLab, Eco, Eje, FrascoOrina } from '../Clinica';

type P2 = [number, number];

/** La edad en grande y una línea debajo, sin caja (como el nombre de las referencias de pacientes). */
function Encabezado({ p, num, linea, color }: { p: number; num: string; linea: string; color: string }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p)), x2 = 64 + num.length * 70 + 18;
  return (
    <g opacity={tramo(p, 0, 0.5)} transform={`translate(${lerp(-26, 0, q).toFixed(1)},0)`}>
      <text x={64} y={152} style={{ fontSize: 120, fontWeight: 800, fill: color }}>{num}</text>
      <text x={x2} y={104} style={{ fontSize: 40, fontWeight: 800, fill: 'var(--cit-texto)' }}>años</text>
      <text x={x2} y={146} style={{ fontSize: 26, fontWeight: 600, fill: 'var(--cit-texto-2)' }}>{linea}</text>
    </g>
  );
}

/** Una nube de viriones que se va espesando con `p`: la carga viral. `tipo` b (cobalto) o c (esmeralda). */
function NubeVirus({ x, y, R = 130, n = 14, p, tipo = 'b', reloj, k = 0.3 }: { x: number; y: number; R?: number; n?: number; p: number; tipo?: 'b' | 'c'; reloj: number; k?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = hash(i, 5) * 6.28, d = Math.sqrt(hash(i, 6)) * R;
        const q = tramo(p, i / (n + 4), i / (n + 4) + 0.3);
        const px = x + Math.cos(a) * d + 6 * onda(reloj, 2200, i), py = y + Math.sin(a) * d * 0.8 + 6 * onda(reloj, 2600, i + 1);
        return tipo === 'b' ? <VirionB key={i} x={px} y={py} k={k * q} o={tramo(q, 0, 0.5)} reloj={reloj} fase={i} /> : <VirionC key={i} x={px} y={py} k={k * q} o={tramo(q, 0, 0.5)} reloj={reloj} fase={i} />;
      })}
    </g>
  );
}

/** Ondas de corte que cruzan un bloque de tejido: rápidas y apretadas en el hígado rígido (elastografía). */
function Elasto({ x, y, p, reloj, rigido = 1 }: { x: number; y: number; p: number; reloj: number; rigido?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p)), v = 2 + 5 * rigido;
  return (
    <g transform={`translate(${x},${y}) scale(${(0.6 + 0.4 * q).toFixed(3)})`} opacity={tramo(p, 0, 0.4)}>
      <rect x={-150} y={-92} width={300} height={190} rx={34} fill="#000" opacity={0.15} transform="translate(8,10)" />
      <rect x={-150} y={-92} width={300} height={190} rx={34} fill={H.hep[0]} />
      <rect x={-150} y={-92} width={300} height={176} rx={30} fill={H.hep[1]} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((reloj * v * 0.00012 + i / 6) % 1);
        const xx = -130 + u * 260;
        return <path key={i} d={`M${xx},-70 C${xx + 16},-30 ${xx - 16},20 ${xx},62`} fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.7 * Math.sin(u * Math.PI)} />;
      })}
      <path d="M-120,-70 Q-100,-84 -70,-82" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
    </g>
  );
}

/** Estrella de dolor: un destello amarillo-rojo con rayos que laten. */
function Dolor({ x, y, p, reloj }: { x: number; y: number; p: number; reloj: number }) {
  if (p <= 0.002) return null;
  const u = 0.5 + 0.5 * onda(reloj, 520, 0);
  return (
    <g transform={`translate(${x},${y}) scale(${(easeOut(clamp(p)) * (0.9 + 0.2 * u)).toFixed(3)})`} opacity={tramo(p, 0, 0.4)}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M16,0 L44,0" stroke="#FFB21E" strokeWidth={9} strokeLinecap="round" transform={`rotate(${a})`} />)}
      <circle r={15} fill="#A81830" /><circle cx={-2} cy={-2} r={12.5} fill="#E5324C" /><circle cx={-5} cy={-5} r={3.4} fill="#FFF" opacity={0.85} />
    </g>
  );
}

// ─── 0 · El hombre del antígeno de superficie ───────────────────────────────
const Primero: Lamina = ({ p, reloj }) => {
  const hombre = p('hombre'), semanas = p('semanas'), cansado = p('cansado'), cuatro = p('cuatro'), nunca = p('nunca');
  const hbsag = p('hbsag'), alt = p('alt'), ast = p('ast'), bili = p('bili'), hbe = p('hbe'), adn = p('adn'), casi = p('casi');
  return (
    <g>
      <Encabezado p={hombre} num="57" linea="hepatitis B hace 4 años" color={TXH.b} />
      <Suelo x={310} y={868} w={430} o={tramo(hombre, 0, 0.5)} />
      <Sombra><Sale p={hombre} x={310} y={565} k={0.92}><Busto quien="p1" reloj={reloj} sueno={0.55 * easeOut(cansado)} manoOjo={cansado} cejas={-0.35 * cansado} sonrisa={-0.4 * cansado} /></Sale></Sombra>
      <Nota x={310} y={372} txt="3 semanas de fatiga" p={semanas} />
      <Globo x={420} y={262} txt="casi sin síntomas…" t={30} p={casi} colaX={-70} />

      {/* hace 4 años → hoy */}
      <Eje x={620} y={186} w={560} p={cuatro} marcas={[{ u: 0.02 }, { u: 0.98 }]} />
      <Etiqueta x={640} y={130} txt="hace 4 años" color="#2F55E0" p={cuatro} t={26} punta="abajo" />
      <Etiqueta x={1160} y={130} txt="hoy" color="#8A4FE8" p={tramo(cuatro, 0.5, 1)} t={26} punta="abajo" />
      <g opacity={tramo(nunca, 0, 0.5)}>
        <Sale p={nunca} x={890} y={262} k={0.8}><Cruz /></Sale>
        <Txt x={1000} y={262} txt="sin tratamiento" t={28} p={nunca} ancla="start" color={TXH.sangre} />
      </g>

      {/* el tubo de sangre y sus dos fichas */}
      <Levita x={760} y={560} reloj={reloj} k={1.15} p={tramo(hbsag, 0, 0.4)} suelo={220} ancho={150} fase={1}><TuboEnsayo color="#B8123A" nivel={0.75} reloj={reloj} /></Levita>
      <Etiqueta x={760} y={296} txt="HBsAg  +" color="#2F55E0" p={hbsag} t={28} punta="abajo" />
      <Etiqueta x={760} y={832} txt="HBeAg  +" color="#FF8A1E" p={hbe} t={28} punta="arriba" />

      {/* barras del laboratorio */}
      <BarraLab x={1000} y={820} val={86} max={220} norm={40} color={H.hep[1]} oscuro={H.hep[0]} p={alt} nombre="ALT" valor="86" unidad="U/L" />
      <BarraLab x={1130} y={820} val={65} max={220} norm={40} color={H.kupffer[1]} oscuro={H.kupffer[0]} p={ast} nombre="AST" valor="65" unidad="U/L" />
      <Sale p={bili} x={1010} y={930} k={0.55}><Visto /></Sale>
      <Txt x={1070} y={930} txt="bilirrubina 0,9 · normal" t={26} p={bili} ancla="start" />

      {/* la carga viral: 8,2 × 10⁷ */}
      <NubeVirus x={1400} y={470} R={118} n={16} p={adn} reloj={reloj} k={0.34} />
      <Txt x={1400} y={680} txt="ADN-VHB" t={30} p={adn} />
      <Txt x={1400} y={730} txt="8,2 × 10⁷ UI/mL" t={36} p={adn} color={TXH.b} />
    </g>
  );
};

// ─── 1 · Seis semanas después ───────────────────────────────────────────────
const SeisSemanas: Lamina = ({ p, reloj }) => {
  const ojos = p('ojos'), orina = p('orina'), alt = p('alt'), ast = p('ast'), bili = p('bili'), inr = p('inr'), adn = p('adn');
  const eco = p('eco'), masa = p('masa'), seg = p('segmento'), bio = p('biopsia'), cancer = p('cancer'), inicio = p('inicio');
  return (
    <g>
      <Suelo x={250} y={830} w={360} o={tramo(inicio, 0, 0.5)} />
      <Sombra><Sale p={inicio} x={250} y={560} k={0.78}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ojos)} dolor={0.45 * ojos} sueno={0.3 * ojos} cejas={-0.5 * ojos} sonrisa={-0.6 * ojos} sudor={0.4 * ojos} /></Sale></Sombra>
      <Nota x={250} y={300} txt="escleras amarillas" p={ojos} a={[250, 425]} de={[250, 318]} />
      <Levita x={540} y={640} reloj={reloj} k={0.85} p={orina} suelo={150} ancho={110} fase={2}><FrascoOrina oscuro={easeOut(orina)} reloj={reloj} /></Levita>
      <Nota x={540} y={850} txt="orina oscura" p={orina} />

      <BarraLab x={690} y={820} w={72} alto={330} val={1450} max={1600} norm={40} color={H.hep[1]} oscuro={H.hep[0]} p={alt} nombre="ALT" valor="1 450" t={26} />
      <BarraLab x={790} y={820} w={72} alto={330} val={980} max={1600} norm={40} color={H.kupffer[1]} oscuro={H.kupffer[0]} p={ast} nombre="AST" valor="980" t={26} />
      <BarraLab x={890} y={820} w={72} alto={330} val={5.4} max={6} norm={1.2} color={H.biliI[1]} oscuro={H.biliI[0]} p={bili} nombre="bilirrubina" valor="5,4" t={24} />
      <Txt x={790} y={925} txt="INR 1,3" t={32} p={inr} color={TXH.sangre} />

      <NubeVirus x={1060} y={620} R={90} n={20} p={adn} reloj={reloj} k={0.26} />
      <Txt x={1060} y={735} txt="2,1 × 10⁸ UI/mL" t={28} p={adn} color={TXH.b} />

      {/* la ecografía y la masa del segmento VI */}
      <Sale p={eco} x={1360} y={300} k={0.8}><Eco reloj={reloj} nodulo={masa} nx={44} ny={48} /></Sale>
      <Etiqueta x={1360} y={502} txt="segmento VI" color="#E04AB0" p={seg} t={26} punta="arriba" />
      <Zoom x={1360} y={730} R={170} de={[1395, 338]} p={bio} fondo="#FFE9F2">
        <Trabecula x={1360} y={730} n={3} filas={3} paso={150} k={0.62} reloj={reloj} atip={1} bilis={0} />
      </Zoom>
      <Etiqueta x={1360} y={950} txt="carcinoma hepatocelular" color="#B8237A" p={cancer} t={28} punta="arriba" />
    </g>
  );
};

// ─── 2 · El hombre de las transfusiones ─────────────────────────────────────
const Segundo: Lamina = ({ p, reloj }) => {
  const hombre = p('hombre'), meses = p('meses'), transfusion = p('transfusion'), treinta = p('treinta');
  const alt = p('alt'), ast = p('ast'), albumina = p('albumina'), anti = p('anti'), arn = p('arn'), hbsag = p('hbsag'), eco = p('eco'), elasto = p('elasto');
  return (
    <g>
      <Encabezado p={hombre} num="51" linea="enzimas altas hace 8 meses" color={TXH.d} />
      <Suelo x={290} y={868} w={430} o={tramo(hombre, 0, 0.5)} />
      <Sombra><Sale p={hombre} x={290} y={565} k={0.92}><Busto quien="p2" reloj={reloj} fase={1.3} sueno={0.2 * meses} mirada={0.4 * onda(reloj, 6000, 1)} /></Sale></Sombra>
      <Nota x={290} y={372} txt="fatiga ocasional" p={meses} />

      {/* la transfusión de hace 30 años */}
      <Levita x={640} y={330} reloj={reloj} k={1.25} p={transfusion} suelo={120} ancho={110} fase={0.5}><BolsaSangre /></Levita>
      <Etiqueta x={640} y={500} txt="hace 30 años" color="#FF8A1E" p={treinta} t={28} punta="arriba" />

      {/* laboratorio */}
      <BarraLab x={760} y={810} w={84} alto={290} val={94} max={220} norm={56} color={H.hep[1]} oscuro={H.hep[0]} p={alt} nombre="ALT" valor="94" unidad="U/L" />
      <BarraLab x={870} y={810} w={84} alto={290} val={73} max={220} norm={40} color={H.kupffer[1]} oscuro={H.kupffer[0]} p={ast} nombre="AST" valor="73" unidad="U/L" />
      <Sale p={albumina} x={760} y={915} k={0.55}><Visto /></Sale>
      <Txt x={806} y={915} txt="albúmina 4,2 · normal" t={26} p={albumina} ancla="start" />

      <Levita x={1090} y={380} reloj={reloj} k={1.5} p={anti} suelo={70} ancho={80} fase={3}><Anticuerpo /></Levita>
      <Nota x={1090} y={480} txt="anti-VHC reactivo" p={anti} />
      <NubeVirus x={1110} y={640} R={90} n={18} p={arn} tipo="c" reloj={reloj} k={0.27} />
      <Txt x={1110} y={745} txt="ARN-VHC 1,6 × 10⁶ UI/mL" t={24} p={arn} color={TXH.c} />
      <Etiqueta x={1110} y={850} txt="HBsAg  −" color="#7A6F90" p={hbsag} t={26} punta="no" />

      {/* ecografía brillante y elastografía rígida */}
      <Sale p={eco} x={1380} y={290} k={0.78}><Eco reloj={reloj} brillo={1} heter={0.7} /></Sale>
      <Nota x={1380} y={490} txt="más brillante y heterogéneo" p={eco} />
      <Elasto x={1380} y={650} p={elasto} reloj={reloj} rigido={1} />
      <Nota x={1380} y={780} txt="elastografía: rígido" p={elasto} />
    </g>
  );
};

// ─── 3 · Dos meses después, con el frío ─────────────────────────────────────
const ConFrio: Lamina = ({ p, reloj }) => {
  const frio = p('frio'), articulaciones = p('articulaciones'), purpura = p('purpura'), fr = p('fr'), c3 = p('c3'), c4 = p('c4'), crio = p('crio'), orina = p('orina'), farmaco = p('farmaco'), pregunta = p('pregunta');
  return (
    <g>
      <Suelo x={250} y={850} w={400} o={tramo(frio, 0, 0.5)} />
      <Sombra><Sale p={frio} x={250} y={570} k={0.86}><Busto quien="p2" reloj={reloj} fase={1.3} frio={easeOut(frio)} cejas={-0.4 * frio} sonrisa={-0.5 * frio} dolor={0.3 * articulaciones} /></Sale></Sombra>
      {/* copos que caen: hace frío */}
      {Array.from({ length: 14 }, (_, i) => {
        const u = (reloj / 5200 + hash(i, 1)) % 1;
        return <g key={i} transform={`translate(${(60 + hash(i, 2) * 440 + 14 * Math.sin(reloj / 700 + i)).toFixed(0)},${(180 + u * 520).toFixed(0)})`} opacity={clamp(frio) * Math.sin(u * Math.PI) * 0.85}>
          {[0, 60, 120].map((a) => <line key={a} x1={-9} x2={9} y1={0} y2={0} stroke="#FFF" strokeWidth={3.4} strokeLinecap="round" transform={`rotate(${a + u * 120})`} />)}
        </g>;
      })}
      <Nota x={250} y={330} txt="con el frío" p={frio} />
      <Dolor x={470} y={470} p={articulaciones} reloj={reloj} />
      <Nota x={470} y={540} txt="articulaciones" p={articulaciones} />

      {/* la pierna con púrpura */}
      <Suelo x={700} y={870} w={200} o={tramo(purpura, 0, 0.5)} />
      <Sombra><Sale p={purpura} x={700} y={520} k={0.7}><Pierna p={purpura} /></Sale></Sombra>
      <Nota x={700} y={290} txt="púrpura palpable" p={purpura} a={[690, 400]} de={[700, 308]} />

      {/* tubo con crioglobulinas que precipitan con el frío */}
      <Levita x={960} y={520} reloj={reloj} k={0.95} p={tramo(crio, 0, 0.4)} suelo={200} ancho={120} fase={1}>
        <TuboEnsayo color="#E8B0C0" nivel={0.7} reloj={reloj} />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-24 + hash(i, 3) * 48} cy={30 + hash(i, 4) * 100} r={4 + hash(i, 5) * 6} fill="#FFF" opacity={clamp(crio) * 0.9} />)}
      </Levita>
      <Nota x={960} y={760} txt="crioglobulinas +" p={crio} />
      <Etiqueta x={960} y={290} txt="FR  +" color="#E04AB0" p={fr} t={28} punta="abajo" />

      {/* complemento */}
      <BarraLab x={1140} y={810} w={80} alto={280} val={0.9} max={1} norm={0.8} color={H.cd8[1]} oscuro={H.cd8[0]} p={c3} nombre="C3" valor="normal" t={24} />
      <BarraLab x={1250} y={810} w={80} alto={280} val={0.22} max={1} norm={0.8} color={H.sangre[1]} oscuro={H.sangre[0]} p={c4} nombre="C4" valor="bajo" t={24} />

      {/* orina con sangre y proteína */}
      <Levita x={1450} y={430} reloj={reloj} k={0.8} p={orina} suelo={150} ancho={100} fase={2}><FrascoOrina oscuro={0.45 * orina} reloj={reloj} /></Levita>
      <Nota x={1450} y={620} txt="sangre y proteína" p={orina} />

      {/* el tratamiento */}
      <Levita x={1420} y={800} reloj={reloj} k={1.2} p={farmaco} suelo={70} ancho={120} fase={0.8}><Capsula tono={H.farma} reloj={reloj} /></Levita>
      <Txt x={1420} y={895} txt="sofosbuvir/velpatasvir · 12 semanas" t={24} p={farmaco} />
      <Globo x={800} y={160} txt="¿manchas con el frío y un virus del hígado?" t={32} p={pregunta} colaX={-140} />
    </g>
  );
};

// ─── 4 · La pregunta ────────────────────────────────────────────────────────
const LaPregunta: Lamina = ({ p, reloj }) => {
  const dos = p('dos'), pregunta = p('pregunta'), virus = p('virus'), mata = p('mata'), citop = p('citopatico'), inmune = p('inmune'), cicatriz = p('cicatriz'), combate = p('combate');
  const muere = tramo(inmune, 0.3, 1);
  return (
    <g>
      <Suelo x={250} y={860} w={420} o={tramo(dos, 0, 0.5)} />
      <Sombra><Sale p={dos} x={150} y={590} k={0.62}><Busto quien="p1" reloj={reloj} fase={0.5} cejas={0.3} habla={0.5 * pregunta * Math.abs(onda(reloj, 700, 0))} /></Sale></Sombra>
      <Sombra><Sale p={dos} x={400} y={610} k={0.6}><Busto quien="p2" reloj={reloj} fase={2.1} cejas={0.3} /></Sale></Sombra>
      <Globo x={900} y={150} txt={'¿por qué un virus que casi no mata\na la célula destruye un hígado?'} t={38} p={pregunta} colaX={-120} />

      {/* el hepatocito infectado que sigue vivo */}
      <Levita x={860} y={560} reloj={reloj} k={1.9} p={virus} suelo={200} ancho={300} fase={1}>
        <Hepatocito reloj={reloj} infecta={H.b} brillo={virus} apop={muere} sem={3} />
      </Levita>
      {Array.from({ length: 5 }, (_, i) => <VirionB key={i} x={720 + hash(i, 4) * 280 + 10 * onda(reloj, 2000, i)} y={330 + hash(i, 5) * 70 + 12 * onda(reloj, 2400, i)} k={0.3} o={tramo(virus, 0.3, 0.9)} reloj={reloj} fase={i} />)}
      <Nota x={860} y={860} txt="el virus B no es directamente citopático" p={citop} color={TXH.b} />
      <Sale p={mata} x={690} y={430} k={0.9}><Cruz /></Sale>

      {/* la respuesta inmune */}
      <Sale p={inmune} x={1300} y={500} k={1.5}><Linfo reloj={reloj} activo={tramo(inmune, 0.2, 1)} /></Sale>
      <Flecha a={[1210, 520]} b={[1030, 540]} c={[1120, 470]} p={tramo(inmune, 0.2, 0.8)} color="#10B5A8" w={10} />
      <Nota x={1300} y={640} txt="respuesta inmune" p={inmune} color={TXH.cd8} />
      <Sale p={combate} x={1300} y={780} k={0.9}><Etiqueta x={0} y={0} txt="el cuerpo que lo combate" color="#10B5A8" t={26} punta="no" /></Sale>

      {/* la cicatriz */}
      <g opacity={tramo(cicatriz, 0, 0.4)}>
        <Colageno x={800} y={920} w={900} h={50} n={5} p={cicatriz} reloj={reloj} />
        <Txt x={1380} y={920} txt="cicatriz" t={30} p={cicatriz} color={TXH.colageno} />
      </g>
    </g>
  );
};

// ─── 5 · El mapa (también es la portada): una línea de metro ────────────────
const ESTACIONES = [
  { nombre: 'el hígado', color: '#E0707A' },
  { nombre: 'lesión y laboratorio', color: '#B23A5E' },
  { nombre: 'los cinco virus', color: '#8A3FD8' },
  { nombre: 'el virus B', color: '#2F55E0' },
  { nombre: 'inmunidad\ny serología', color: '#10B5A8' },
  { nombre: 'brote y cáncer', color: '#E5324C' },
  { nombre: 'el delta', color: '#8A4FE8' },
  { nombre: 'el virus C', color: '#14B870' },
  { nombre: 'la cura\ny los pacientes', color: '#14A864' },
];
const F1 = 425, F2 = 760, RU = (F2 - F1) / 2, XU = 1270, X0 = 60, XFIN = 330;
const XS = [200, 450, 710, 990, 1270, 1270, 990, 710, 430];
const ARCO = Math.PI * RU;
const DIST = XS.map((x, i) => (i < 5 ? x - X0 : XU - X0 + ARCO + (XU - x)));
const LARGO = XU - X0 + ARCO + (XU - XFIN);
function enVia(d: number): { x: number; y: number; r: number; dir: 1 | -1 } {
  const a = XU - X0;
  if (d <= a) return { x: X0 + d, y: F1, r: 0, dir: 1 };
  if (d <= a + ARCO) {
    const th = (d - a) / RU;
    return { x: XU + Math.sin(th) * RU, y: F1 + RU - Math.cos(th) * RU, r: th <= Math.PI / 2 ? (th * 180) / Math.PI : ((th - Math.PI) * 180) / Math.PI, dir: th <= Math.PI / 2 ? 1 : -1 };
  }
  return { x: XU - (d - a - ARCO), y: F2, r: 0, dir: -1 };
}
const TRAMOS = ESTACIONES.map((e, i) => {
  const d0 = i === 0 ? 0 : DIST[i - 1], d1 = DIST[i];
  const a = enVia(d0), b = enVia(d1);
  const d = i === 5 ? `M${a.x},${a.y} A${RU},${RU} 0 0 1 ${b.x},${b.y}` : `M${a.x},${a.y} L${b.x},${b.y}`;
  return { d, d0, largo: d1 - d0, color: e.color };
}).concat([{ d: `M${XS[8]},${F2} L${XFIN},${F2}`, d0: DIST[8], largo: XS[8] - XFIN, color: ESTACIONES[8].color }]);

const Mapa: Lamina = ({ p, reloj }) => {
  const tren = p('tren'), emp = p('empecemos');
  const luces = [p('e1'), p('e2'), p('e3'), p('e4'), p('e5'), p('e6'), p('e7'), p('e8'), p('final')];
  const hasta = luces.reduce((s, v) => s + easeOut(clamp(v)), 0);
  const i = Math.min(8, Math.floor(hasta));
  const dv = hasta <= 1 ? lerp(0, DIST[0], hasta) : hasta >= 9 ? DIST[8] : lerp(DIST[i - 1], DIST[i], hasta - i);
  const v = enVia(Math.max(0, dv - 78));
  const dibujada = LARGO * easeOut(clamp(tren));
  const iconos = [
    <Higado key="a" k={0.4} corte={false} />,
    <Hepatocito key="b" k={0.62} apop={0.9} sem={2} />,
    <g key="c"><VirionAE k={0.7} x={-30} y={10} /><VirionB k={0.7} x={34} y={-6} /><VirionC k={0.6} x={-4} y={-44} /></g>,
    <VirionB key="d" k={0.95} />,
    <Linfo key="e" k={0.8} />,
    <Hepatocito key="f" k={0.62} atip={1} sem={4} />,
    <VirionD key="g" k={1} />,
    <VirionC key="h" k={0.95} />,
    <Busto key="i" k={0.22} y={-10} sonrisa={1} quien="p1" />,
  ];
  return (
    <g>
      <Txt x={64} y={120} txt="el recorrido del laboratorio" t={40} p={tren} ancla="start" />
      <Sombra dx={8} dy={10}>
        {TRAMOS.map((t, j) => {
          const vis = clamp(dibujada - t.d0, 0, t.largo);
          return vis > 0.5 ? <path key={j} d={t.d} fill="none" stroke={t.color} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${vis.toFixed(1)} 4000`} /> : null;
        })}
      </Sombra>
      {TRAMOS.map((t, j) => {
        const vis = clamp(dibujada - t.d0, 0, t.largo);
        return vis > 0.5 ? <path key={j} d={t.d} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeDasharray={`${vis.toFixed(1)} 4000`} opacity={0.35} /> : null;
      })}
      {ESTACIONES.map((e, j) => {
        const x = XS[j], y = j < 5 ? F1 : F2, q = clamp(luces[j]);
        const lineas = e.nombre.split('\n');
        const pulso = j === 0 ? emp : 0;
        return (
          <g key={j}>
            {pulso > 0.01 && [0, 1].map((m) => {
              const u = (reloj / 1000 + m / 2) % 1;
              return <circle key={m} cx={x} cy={y} r={26 + u * 46} fill="none" stroke={e.color} strokeWidth={6} opacity={pulso * (1 - u)} />;
            })}
            <Levita x={x} y={y - 118} reloj={reloj} k={1} p={q} suelo={84} ancho={110} fase={j * 0.9}>{iconos[j]}</Levita>
            <g opacity={tramo(dibujada - (j === 0 ? 0 : DIST[j - 1]), 0, 60)}>
              <circle cx={x} cy={y} r={25} fill={q > 0.3 ? e.color : '#FFFFFF'} />
              <circle cx={x} cy={y} r={25} fill="none" stroke={q > 0.3 ? '#FFFFFF' : '#B9B1C9'} strokeWidth={7} />
              <text x={x} y={y} dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: q > 0.3 ? '#FFFFFF' : '#8E86A0' }}>{j + 1}</text>
            </g>
            {lineas.map((l, m) => <Txt key={m} x={x} y={y + 62 + m * 32} txt={l} t={26} p={q} />)}
          </g>
        );
      })}
      <Sombra dx={8} dy={10}>
        <Tranvia x={v.x} y={v.y} r={v.r} k={0.56} o={tramo(tren, 0, 0.3)} reloj={reloj} dir={v.dir} />
      </Sombra>
    </g>
  );
};

const LAMINAS: Lamina[] = [Primero, SeisSemanas, Segundo, ConFrio, LaPregunta, Mapa];
export default LAMINAS;
