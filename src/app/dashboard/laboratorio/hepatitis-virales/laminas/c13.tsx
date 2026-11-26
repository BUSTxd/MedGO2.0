'use client';
// Capítulo 13 · Del virus al cáncer
//
// Dos caminos que salen del mismo hepatocito. El indirecto: una rueda de inflamación (los CD8 y los macrófagos atacan, mueren células, otras
// se dividen apuradas y chispas de ROS dejan «borrones» en el ADN). El directo: el ADN viral lineal (azul) se pega en la hélice del huésped
// junto a un interruptor, TERT; HBx truncada como un hub de ocho brazos; un maní enmohecido (aflatoxina B1) que golpea un codón y deja la
// mutación R249S en TP53; una célula que se escapa de su fila y empuja a sus vecinas hasta formar un nódulo.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Eco } from '../Clinica';
import { Busto, Etiqueta, Flecha, Globo, Helice, Higado, Linfo, Sale, Sombra, TXH, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Colageno, Hepatocito, Kupffer } from '../Higado';
import { BarraLab } from '../Clinica';
import { Trabaja, Visto } from '../Extras';

type P2 = [number, number];

/** Un tumor: racimo de bolas magenta oscuro con su brillo y su resplandor. */
function Tumor({ x, y, k = 1, o = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <circle r={78 + 4 * onda(reloj, 900)} fill="#7A1260" opacity={0.2} />
      {[[-26, -10, 38], [24, -16, 34], [0, 22, 40], [34, 20, 28], [-34, 24, 26]].map(([cx, cy, R], i) => <g key={i}><circle cx={cx + 3} cy={cy + 5} r={R} fill="#000" opacity={0.18} /><circle cx={cx} cy={cy} r={R} fill="#6A0F58" /><circle cx={cx - 3} cy={cy - 3} r={R - 6} fill="#B03A8C" /><circle cx={cx - R * 0.4} cy={cy - R * 0.4} r={R * 0.2} fill="#FFF" opacity={0.6} /></g>)}
    </g>
  );
}

/** Un cromosoma: dos brazos cruzados en X (el color de cada brazo puede cambiar: translocación). */
function Cromo({ x, y, k = 1, o = 1, r = 0, a = '#E84AC0', b = '#E84AC0', parte = 0 }: { x: number; y: number; k?: number; o?: number; r?: number; a?: string; b?: string; parte?: number }) {
  if (o <= 0.003) return null;
  const sep = 14 * parte;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <g transform={`translate(${-sep},${sep})`}><rect x={-12} y={-44} width={24} height={88} rx={12} fill={a} transform="rotate(24)" opacity={0.95} /></g>
      <g transform={`translate(${sep},${-sep})`}><rect x={-12} y={-44} width={24} height={88} rx={12} fill={b} transform="rotate(-24)" opacity={0.95} /></g>
      <circle r={9} fill="#FFF" opacity={0.5} />
    </g>
  );
}

/** Un libro abierto (el libro de la célula). */
function Libro({ x, y, k = 1, o = 1, insertado = 0 }: { x: number; y: number; k?: number; o?: number; insertado?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <path d="M-110,60 L-110,-60 Q-55,-80 0,-50 L0,80 Q-55,50 -110,60 Z" fill="#B0764A" /><path d="M110,60 L110,-60 Q55,-80 0,-50 L0,80 Q55,50 110,60 Z" fill="#B0764A" />
      <path d="M-100,50 L-100,-54 Q-52,-72 -6,-46 L-6,72 Q-52,44 -100,50 Z" fill="#FFF8E8" /><path d="M100,50 L100,-54 Q52,-72 6,-46 L6,72 Q52,44 100,50 Z" fill="#FFF8E8" />
      {[-30, -8, 14, 36].map((yy, i) => <line key={i} x1={-84} x2={-20} y1={yy - 6} y2={yy + 2} stroke="#B8A890" strokeWidth={4} strokeLinecap="round" />)}
      {[-30, -8, 14, 36].map((yy, i) => <line key={i} x1={20} x2={84} y1={yy + 2} y2={yy - 6} stroke={i === 2 ? '#2F55E0' : '#B8A890'} strokeWidth={i === 2 ? 7 : 4} strokeLinecap="round" opacity={i === 2 ? insertado : 1} />)}
    </g>
  );
}

/** Una estrella de citocina / chispa de ROS. */
function Chispa5({ x, y, k = 1, o = 1, r = 0, tono = '#FFC81E', oscuro = '#C79A00' }: { x: number; y: number; k?: number; o?: number; r?: number; tono?: string; oscuro?: string }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={17} y2={0} stroke={oscuro} strokeWidth={5} strokeLinecap="round" transform={`rotate(${a})`} />)}
      <circle r={10} fill={tono} /><circle cx={-3} cy={-3} r={3.4} fill="#FFF" opacity={0.8} />
    </g>
  );
}

/** Un cacahuate enmohecido (aflatoxina B1). */
function Mani({ x, y, k = 1, o = 1, moho = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; moho?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={6} cy={50} rx={92} ry={12} fill="#000" opacity={0.14} />
      <ellipse cx={-34} cy={0} rx={52} ry={44} fill="#9A6A3A" /><ellipse cx={34} cy={0} rx={56} ry={48} fill="#9A6A3A" /><rect x={-34} y={-30} width={68} height={60} fill="#9A6A3A" />
      <ellipse cx={-36} cy={-3} rx={46} ry={38} fill="#D2A06A" /><ellipse cx={34} cy={-3} rx={50} ry={42} fill="#D2A06A" /><rect x={-34} y={-32} width={68} height={58} fill="#D2A06A" />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-70 + hash(i, 1) * 140} cy={-34 + hash(i, 2) * 70} r={4 + hash(i, 3) * 6} fill={i % 2 ? '#5C7A3A' : '#8A9A6A'} opacity={0.8 * moho * (0.7 + 0.3 * onda(reloj, 1200, i))} />)}
    </g>
  );
}

// ─── 0 · El VHB no necesita cirrosis ────────────────────────────────────────
const SinCirrosis: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), mayoria = p('mayoria'), hepc = p('hepc'), excepcion = p('excepcion'), oncogenica = p('oncogenica'), directa = p('directa'), nocirrotico = p('nocirrotico'), saltarse = p('saltarse'), cicatriz = p('cicatriz');
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Globo x={800} y={90} txt="¿hace falta cirrosis para que haya cáncer?" t={34} p={pregunta} colaX={0} />
      {/* la mayoría de las hepatopatías: hígado → cirrosis → cáncer */}
      <Etiqueta x={700} y={210} txt="en la mayoría de las hepatopatías" color="#6E6478" p={mayoria} t={28} punta="no" />
      <Sale p={mayoria} x={300} y={350} k={0.3}><Higado corte={false} /></Sale>
      <Flecha a={[420, 350]} b={[560, 350]} p={tramo(mayoria, 0.3, 1)} color="var(--cit-flecha)" w={8} />
      <Sale p={mayoria} x={700} y={350} k={0.3}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /></g>)}</Sale>
      <Txt x={700} y={450} txt="cirrosis" t={28} p={mayoria} color={TXH.colageno} />
      <Flecha a={[840, 350]} b={[980, 350]} p={tramo(mayoria, 0.5, 1)} color="var(--cit-flecha)" w={8} />
      <Tumor x={1100} y={350} k={0.9} reloj={reloj} o={tramo(mayoria, 0.5, 1)} />
      <Etiqueta x={1380} y={350} txt="como en la hepatitis C" color="#138A3A" p={hepc} t={28} punta="no" />
      {/* el VHB: la excepción clásica */}
      <Etiqueta x={700} y={570} txt="el VHB: la excepción clásica" color="#2F55E0" p={excepcion} t={30} punta="no" />
      <Sale p={excepcion} x={300} y={740} k={0.3}><Higado corte={false} /></Sale>
      <Colageno x={700} y={800} w={240} h={50} n={4} p={cicatriz} reloj={reloj} />
      <Txt x={700} y={880} txt="se salta la cicatriz" t={28} p={saltarse} color={TXH.colageno} />
      <path d="M430,700 C520,560 880,560 980,690" fill="none" stroke="#2F55E0" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(saltarse).toFixed(3)} 1`} />
      <polygon points="990,704 960,692 982,668" fill="#2F55E0" opacity={tramo(saltarse, 0.8, 1)} />
      <Sale p={excepcion} x={1100} y={740} k={0.3}><Higado corte={false} /></Sale>
      <Tumor x={1100} y={740} k={0.6} reloj={reloj} o={tramo(nocirrotico, 0, 0.5)} />
      <Txt x={1380} y={700} txt="capacidad oncogénica" t={26} p={oncogenica} color={TXH.b} /><Txt x={1380} y={745} txt="directa" t={30} p={directa} color={TXH.b} />
      <Txt x={1380} y={805} txt="sobre un hígado no cirrótico" t={24} p={nocirrotico} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Camino indirecto: la inflamación que no cesa ───────────────────────
const Indirecto: Lamina = ({ p, reloj }) => {
  const camino = p('camino'), inflamacion = p('inflamacion'), cccadn = p('cccadn'), ataque = p('ataque'), cd8 = p('cd8'), macrofagos = p('macrofagos'), necrosis = p('necrosis'), regeneracion = p('regeneracion'), estres = p('estres'), adn = p('adn'), dividen = p('dividen'), acumulan = p('acumulan'), error = p('error');
  const CX = 800, CY = 520;
  return (
    <g>
      <Etiqueta x={230} y={110} txt="primer camino" color="#B8237A" p={camino} t={34} punta="no" />
      <Txt x={800} y={110} txt="la inflamación que no cesa" t={34} p={inflamacion} color={TXH.hep} />
      <Trabaja x={CX} y={CY} R={230} reloj={reloj} p={inflamacion} color="#E8841E" />
      {/* arriba: el cccDNA activo en un hepatocito infectado */}
      <Hepatocito x={CX} y={290} k={0.8} reloj={reloj} sem={3} infecta={H.b} brillo={1} o={tramo(cccadn, 0, 0.4)} />
      <Etiqueta x={CX + 230} y={290} txt="cccDNA activo" color="#E8841E" p={cccadn} t={26} punta="no" />
      {/* derecha: el ataque constante de CD8 y macrófagos */}
      <Linfo x={1170} y={480} k={0.8} reloj={reloj} activo={1} o={tramo(cd8, 0, 0.4)} />
      <Kupffer x={1250} y={640} k={0.75} reloj={reloj} o={tramo(macrofagos, 0, 0.4)} />
      <Txt x={1230} y={380} txt="el ataque constante de" t={26} p={ataque} color={TXH.sangre} />
      <Etiqueta x={1170} y={560} txt="CD8" color="#0A7F78" p={cd8} t={26} punta="no" /><Etiqueta x={1250} y={730} txt="macrófagos" color="#C98400" p={macrofagos} t={26} punta="no" />
      {/* abajo: necrosis y regeneración compensatoria */}
      <Hepatocito x={620} y={790} k={0.7} reloj={reloj} sem={5} apop={easeOut(necrosis)} o={tramo(necrosis, 0, 0.4)} />
      <Etiqueta x={620} y={900} txt="necrosis focal" color="#E5324C" p={necrosis} t={26} punta="no" />
      <Hepatocito x={940 - 50 * easeOut(dividen)} y={790} k={0.55} reloj={reloj} sem={6} o={tramo(regeneracion, 0, 0.4)} />
      <Hepatocito x={940 + 50 * easeOut(dividen)} y={790} k={0.55} reloj={reloj} sem={7} fase={1} o={tramo(regeneracion, 0, 0.4)} />
      <Etiqueta x={940} y={900} txt="regeneración compensatoria" color="#1FA85A" p={regeneracion} t={26} punta="no" />
      <Txt x={940} y={950} txt="se dividen sin poder reparar" t={24} p={dividen} color={TXH.c} />
      {/* izquierda: el estrés oxidativo daña el ADN, que acumula borrones */}
      {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 1500 + i / 6) % 1); return <Chispa5 key={i} x={lerp(520, 400, u)} y={300 + i * 90 + 14 * Math.sin(u * 9)} k={0.9} r={u * 300} o={Math.sin(u * Math.PI) * tramo(estres, 0, 0.4)} />; })}
      <Helice x={240} y={520} w={300} amp={26} reloj={reloj} p={tramo(adn, 0, 0.5)} grosor={10} vueltas={2} o={tramo(adn, 0, 0.4)} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={260 + i * 50} cy={520 + 18 * Math.sin(i * 2)} r={11} fill="#3A2A22" opacity={0.85 * tramo(acumulan, i / 8, i / 8 + 0.3)} />)}
      <Etiqueta x={380} y={420} txt="estrés oxidativo (ROS)" color="#C79A00" p={estres} t={24} punta="no" />
      <Txt x={380} y={640} txt="daña el ADN" t={26} p={adn} color={TXH.kupffer} />
      <Txt x={380} y={690} txt="y acumula mutaciones" t={24} p={acumulan} color={TXH.sangre} />
      <Txt x={CX} y={CY} txt="cada ciclo suma un error" t={30} p={error} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Camino directo: el ADN viral se integra ────────────────────────────
const Integra: Lamina = ({ p, reloj }) => {
  const segundo = p('segundo'), meterse = p('meterse'), fragmentos = p('fragmentos'), lineal = p('lineal'), integran = p('integran'), azar = p('azar'), tert = p('tert'), integracion = p('integracion'), lesiones = p('lesiones'), translocaciones = p('translocaciones'), reordenamientos = p('reordenamientos'), inestabilidad = p('inestabilidad'), libro = p('libro');
  const q = easeOut(integran);
  return (
    <g>
      <Etiqueta x={230} y={110} txt="segundo camino" color="#2F55E0" p={segundo} t={34} punta="no" />
      <Txt x={800} y={110} txt="¿puede el virus meterse en el genoma?" t={32} p={meterse} color={TXH.b} />
      {/* la hélice del huésped */}
      <Helice x={800} y={500} w={1280} amp={36} reloj={reloj} p={tramo(meterse, 0, 0.6)} grosor={14} vueltas={7} />
      <Txt x={400} y={590} txt="genoma del hepatocito" t={24} p={meterse} fuerte={false} />
      {/* el fragmento de ADN viral lineal, de doble cadena */}
      <Helice x={lerp(560, 640, q)} y={lerp(250, 500, q)} w={170} amp={20} reloj={reloj} p={tramo(fragmentos, 0, 0.5)} grosor={12} tono={H.sangre} vueltas={2} />
      <Etiqueta x={620} y={175} txt="fragmentos de ADN viral" color="#9E0B2E" p={fragmentos} t={26} punta="no" />
      <Txt x={620} y={215} txt="lineal, de doble cadena" t={22} p={lineal} color={TXH.sangre} />
      <Txt x={900} y={350} txt="se integran, casi al azar" t={26} p={azar} color={TXH.hep} />
      <Flecha a={[640, 290]} b={[640, 420]} p={tramo(integran, 0, 0.8)} color="#E3203F" w={8} />
      {/* el punto caliente TERT */}
      <g opacity={tramo(tert, 0, 0.4)} transform={`translate(1150,500)`}>
        {[0, 45, 90, 135].map((a) => <line key={a} x1={-38} x2={38} y1={0} y2={0} stroke="#FFC81E" strokeWidth={8} strokeLinecap="round" transform={`rotate(${a + (reloj / 12) % 360})`} />)}<circle r={14} fill="#FFF" />
      </g>
      <Etiqueta x={1150} y={405} txt="TERT: un punto caliente" color="#C79A00" p={tert} t={26} punta="abajo" />
      {/* lo que provoca la integración */}
      <Txt x={800} y={700} txt="la integración provoca" t={26} p={integracion} color={TXH.sangre} />
      <Cromo x={330} y={820} k={1.2} a="#E84AC0" b="#E84AC0" parte={lesiones} o={tramo(lesiones, 0, 0.4)} />
      <Txt x={330} y={920} txt="lesiones" t={24} p={lesiones} />
      <Cromo x={560} y={820} k={1.2} a="#E84AC0" b={lerp(0, 1, translocaciones) > 0.5 ? '#4F7FF0' : '#E84AC0'} o={tramo(translocaciones, 0, 0.4)} />
      <Cromo x={640} y={820} k={1.2} a={lerp(0, 1, translocaciones) > 0.5 ? '#E84AC0' : '#4F7FF0'} b="#4F7FF0" o={tramo(translocaciones, 0, 0.4)} />
      <Txt x={600} y={920} txt="translocaciones" t={24} p={translocaciones} />
      <Cromo x={900} y={820} k={1.2} r={lerp(0, 90, reordenamientos)} a="#3FD467" b="#E84AC0" o={tramo(reordenamientos, 0, 0.4)} />
      <Txt x={900} y={920} txt="reordenamientos" t={24} p={reordenamientos} />
      <Etiqueta x={1100} y={850} txt="inestabilidad cromosómica" color="#B8237A" p={inestabilidad} t={26} punta="no" />
      <Libro x={1370} y={800} k={0.8} o={tramo(libro, 0, 0.4)} insertado={libro} />
      <Txt x={1370} y={920} txt="el virus escribe en el libro de la célula" t={22} p={libro} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Mutagénesis insercional ────────────────────────────────────────────
const Insercional: Lamina = ({ p, reloj }) => {
  const consecuencias = p('consecuencias'), promotoras = p('promotoras'), protoonc = p('protoonc'), aceleran = p('aceleran'), interrumpen = p('interrumpen'), supresores = p('supresores'), frenos = p('frenos'), hbsag = p('hbsag'), replicacion = p('replicacion'), acelerador = p('acelerador'), roto = p('roto');
  const bloque = (x: number, y: number, w: number, txt: string, c: string[], q: number, brillo = 0) => (
    <g opacity={tramo(q, 0, 0.4)}>
      {brillo > 0.01 && <rect x={x - w / 2 - 12} y={y - 48} width={w + 24} height={96} rx={26} fill="#FFE98A" opacity={0.5 * brillo * (0.7 + 0.3 * onda(reloj, 500))} />}
      <rect x={x - w / 2 + 4} y={y - 36 + 7} width={w} height={72} rx={18} fill="#000" opacity={0.15} /><rect x={x - w / 2} y={y - 36} width={w} height={72} rx={18} fill={c[0]} /><rect x={x - w / 2 + 3} y={y - 36} width={w - 6} height={62} rx={16} fill={c[1]} />
      <text x={x} y={y} dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{txt}</text>
    </g>
  );
  return (
    <g>
      <Txt x={800} y={110} txt="esa escritura tiene consecuencias" t={34} p={consecuencias} color={TXH.hep} />
      <line x1={120} x2={1480} y1={400} y2={400} stroke="#9C92A8" strokeWidth={12} strokeLinecap="round" opacity={0.8 * tramo(consecuencias, 0, 0.5)} />
      {bloque(310, 400, 230, 'promotor viral', H.b as unknown as string[], promotoras)}
      {bloque(560, 400, 230, 'protooncogén', H.c as unknown as string[], protoonc, protoonc)}
      <Flecha a={[560, 340]} b={[560, 250]} p={tramo(aceleran, 0, 0.8)} color="#1FA85A" w={9} />
      <Txt x={560} y={215} txt="aceleran la división" t={26} p={aceleran} color={TXH.c} />
      {bloque(940, 400, 200, 'supresor', H.sangre as unknown as string[], supresores)}
      <g opacity={tramo(interrumpen, 0, 0.5)}><rect x={1010} y={344} width={34} height={112} rx={10} fill={H.b[1]} /></g>
      {bloque(1180, 400, 200, 'supresor', H.sangre as unknown as string[], interrumpen)}
      <Txt x={1090} y={290} txt="interrumpen genes supresores" t={24} p={interrumpen} color={TXH.sangre} />
      <Txt x={1090} y={335} txt="los frenos del ciclo celular" t={22} p={frenos} color={TXH.gris} />
      {/* el acelerador pisado y el freno roto */}
      <g opacity={tramo(acelerador, 0, 0.4)} transform={`translate(560,660) rotate(${-8 * easeOut(acelerador)})`}>
        <rect x={-50} y={-90} width={100} height={170} rx={20} fill="#1E8A3A" transform="translate(5,8)" opacity={0.5} /><rect x={-50} y={-90} width={100} height={170} rx={20} fill="#3FD467" />
        {[-50, -20, 10, 40].map((yy) => <rect key={yy} x={-34} y={yy} width={68} height={10} rx={5} fill="#138A3A" opacity={0.7} />)}
      </g>
      <Etiqueta x={560} y={790} txt="un acelerador pisado" color="#1FA85A" p={acelerador} t={26} punta="no" />
      <g opacity={tramo(roto, 0, 0.4)} transform="translate(1090,660)">
        <rect x={-46} y={-80} width={92} height={150} rx={20} fill="#9E0B2E" transform="translate(5,8)" opacity={0.5} /><rect x={-46} y={-80} width={92} height={150} rx={20} fill="#E5324C" />
        <path d="M-30,-60 L-6,-10 L-26,10 L2,52" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Etiqueta x={1090} y={790} txt="y un freno roto" color="#E5324C" p={roto} t={26} punta="no" />
      <BarraLab x={1450} y={900} w={60} alto={180} val={0.15} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={replicacion} nombre="replicación" valor="cae" t={20} />
      <BarraLab x={1330} y={900} w={60} alto={180} val={0.9} max={1} color="#FFC81E" oscuro="#C79A00" p={hbsag} nombre="HBsAg" valor="se mantiene" t={20} />
    </g>
  );
};

// ─── 4 · HBx: la proteína que hace de todo ──────────────────────────────────
const Hbx: Lamina = ({ p, reloj }) => {
  const hbx = p('hbx'), todo = p('todo'), fragmento = p('fragmento'), truncada = p('truncada'), mantiene = p('mantiene'), supresores = p('supresores'), apoptosis = p('apoptosis'), reparacion = p('reparacion'), nfkb = p('nfkb'), jakstat = p('jakstat'), il6 = p('il6'), tnf = p('tnf'), sola = p('sola');
  const CX = 800, CY = 520, RX = 520, RY = 300;
  const nodo = (ang: number, q: number, txt: string, col: string, dibujo: ReactNode, tx?: number) => {
    const a = (ang * Math.PI) / 180, nx = CX + Math.cos(a) * RX, ny = CY + Math.sin(a) * RY;
    return (
      <g key={txt}>
        <line x1={CX + Math.cos(a) * 110} y1={CY + Math.sin(a) * 80} x2={nx - Math.cos(a) * 50} y2={ny - Math.sin(a) * 40} stroke={col} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(q).toFixed(3)} 1`} opacity={0.8} />
        <g transform={`translate(${nx},${ny})`} opacity={tramo(q, 0.3, 0.8)}>{dibujo}</g>
        <Etiqueta x={tx ?? nx} y={ny + 82} txt={txt} color={col} p={q} t={22} punta="no" />
      </g>
    );
  };
  const tacha = <path d="M-40,-40 L40,40 M40,-40 L-40,40" stroke="#E5324C" strokeWidth={10} strokeLinecap="round" />;
  return (
    <g>
      <Etiqueta x={800} y={100} txt="HBx" color="#8A4FE8" p={hbx} t={40} punta="no" />
      <Txt x={800} y={165} txt="la proteína que hace de todo" t={28} p={todo} color={TXH.d} />
      {/* el hub: HBx truncada y sostenida */}
      <g opacity={tramo(fragmento, 0, 0.4)} transform={`translate(${CX},${CY})`}>
        <circle r={84 + 4 * onda(reloj, 800)} fill="#8A4FE8" opacity={0.2} />
        <circle cx={5} cy={8} r={70} fill="#000" opacity={0.16} /><circle r={70} fill={H.d[0]} /><circle cx={-4} cy={-4} r={64} fill={H.d[1]} /><circle cx={-24} cy={-26} r={14} fill="#FFF" opacity={0.6} />
        <path d="M44,40 L96,40 L96,70 L60,70 Z" fill={H.d[1]} opacity={tramo(truncada, 0, 0.5) * 0} />
        <text dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>HBx</text>
        <path d="M30,56 L56,28 M30,56 L58,44" stroke="#FFF" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 10" opacity={tramo(truncada, 0, 0.5)} />
      </g>
      <Txt x={CX} y={CY + 110} txt="truncada y sostenida" t={24} p={truncada} color={TXH.d} />
      <Txt x={CX} y={CY - 110} txt="el fragmento integrado la conserva" t={22} p={fragmento} color={TXH.gris} />
      {nodo(-90, mantiene, 'mantiene al cccDNA', '#E8841E', <g><circle r={46} fill="#FFE98A" opacity={0.4} /><circle r={36} fill="none" stroke={H.adn[1]} strokeWidth={10} />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.cos(i * 1.26) * 36} cy={Math.sin(i * 1.26) * 36} r={9} fill={H.prot[1]} />)}</g>)}
      {nodo(-40, supresores, 'inhibe supresores', '#E5324C', <g><path d="M0,-40 L34,-26 L34,12 C34,32 14,44 0,50 C-14,44 -34,32 -34,12 L-34,-26 Z" fill="#9AA6B8" />{tacha}</g>)}
      {nodo(0, apoptosis, 'inhibe la apoptosis', '#B8237A', <g><circle r={34} fill="#F5A0A6" /><circle cx={-12} cy={-8} r={5} fill="#3A2A22" /><circle cx={12} cy={-8} r={5} fill="#3A2A22" />{tacha}</g>, 1330)}
      {nodo(40, reparacion, 'estropea la reparación del ADN', '#C79A00', <g><path d="M-30,30 L16,-16 A18,18 0 1 1 30,-30 L-16,16 Z" fill="#9AA6B8" />{tacha}</g>, 1230)}
      {nodo(90, nfkb, 'activa NF-κB', '#2F55E0', <g>{[[-30, 0], [0, -26], [30, 8]].map(([qx, qy], i) => <rect key={i} x={qx - 14} y={qy - 14} width={28} height={28} rx={7} fill={H.b[1]} />)}<path d="M-16,0 L-12,-12 M14,-22 L22,0" stroke="#FFF" strokeWidth={4} /></g>)}
      {nodo(140, jakstat, 'y JAK-STAT', '#0A7F78', <g><circle cx={-18} cy={0} r={18} fill={H.cd8[1]} /><circle cx={20} cy={0} r={18} fill={H.cd8[0]} /><path d="M-4,0 L6,0" stroke="#FFF" strokeWidth={6} strokeLinecap="round" /></g>)}
      {nodo(182, il6, 'con interleucina 6', '#C2540A', <Chispa5 x={0} y={0} k={1.7} r={(reloj / 20) % 360} tono="#FF8A1E" oscuro="#C2540A" />, 330)}
      {nodo(224, tnf, 'y TNF-α', '#138A3A', <Chispa5 x={0} y={0} k={1.7} r={(reloj / 20) % 360} tono="#3FD467" oscuro="#138A3A" />, 380)}
      <Txt x={800} y={970} txt="una sola proteína, muchos frentes" t={36} p={sola} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La aflatoxina B1 y TP53 ────────────────────────────────────────────
const Aflatoxina: Lamina = ({ p, reloj }) => {
  const cocarcinogeno = p('cocarcinogeno'), aflatoxina = p('aflatoxina'), hongos = p('hongos'), alimentos = p('alimentos'), mutacion = p('mutacion'), r249s = p('r249s'), tp53 = p('tp53'), guardian = p('guardian'), regiones = p('regiones'), potencian = p('potencian'), golpes = p('golpes');
  const ficha = (x: number, l: string, c: string, vuelta: number) => (
    <g transform={`translate(${x},470)`}>
      <rect x={-44 + 5} y={-44 + 8} width={88} height={88} rx={14} fill="#000" opacity={0.16} /><rect x={-44} y={-44} width={88} height={88} rx={14} fill={c} />
      <g transform={`scale(${(1 - 0.0 * vuelta).toFixed(2)})`}><text dy="0.36em" textAnchor="middle" style={{ fontSize: 56, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{l}</text></g>
    </g>
  );
  return (
    <g>
      <Etiqueta x={800} y={100} txt="un cocarcinógeno entra en escena" color="#8A4FE8" p={cocarcinogeno} t={32} punta="no" />
      <Mani x={290} y={400} k={1.6} reloj={reloj} o={tramo(aflatoxina, 0, 0.4)} moho={tramo(hongos, 0, 0.8)} />
      <Etiqueta x={290} y={560} txt="aflatoxina B1" color="#5C7A3A" p={aflatoxina} t={30} punta="no" />
      <Txt x={290} y={620} txt="hongos en alimentos" t={24} p={hongos} color={TXH.gris} /><Txt x={290} y={660} txt="mal almacenados" t={24} p={alimentos} color={TXH.gris} />
      {/* el codón AGG pasa a AGT: R249S */}
      <Flecha a={[480, 400]} b={[640, 450]} p={tramo(mutacion, 0, 0.8)} color="#E5324C" w={9} />
      <g opacity={tramo(mutacion, 0.2, 0.7)}>{ficha(720, 'A', '#2F55E0', 0)}{ficha(830, 'G', '#1FA85A', 0)}{ficha(940, tramo(r249s, 0.3, 0.7) > 0.5 ? 'T' : 'G', tramo(r249s, 0.3, 0.7) > 0.5 ? '#E5324C' : '#1FA85A', 0)}</g>
      <circle cx={940} cy={470} r={70 * tramo(r249s, 0.2, 0.5) * (1 - tramo(r249s, 0.5, 1))} fill="#FFE98A" opacity={0.8} />
      <Etiqueta x={830} y={580} txt="mutación R249S" color="#E5324C" p={r249s} t={32} punta="no" />
      {/* TP53, el guardián del genoma, golpeado */}
      <g opacity={tramo(tp53, 0, 0.4)} transform="translate(1290,430)">
        <path d="M5,12 L112,-34 L112,24 C112,60 36,92 5,104 C-26,92 -102,60 -102,24 L-102,-34 Z" fill="#000" opacity={0.16} />
        <path d="M0,-96 L104,-52 L104,12 C104,52 30,84 0,96 C-30,84 -104,52 -104,12 L-104,-52 Z" fill="#6E6478" /><path d="M0,-84 L92,-46 L92,10 C92,44 26,72 0,82 C-26,72 -92,44 -92,10 L-92,-46 Z" fill="#9C92A8" />
        <text dy="0.36em" y={-8} textAnchor="middle" style={{ fontSize: 50, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>p53</text>
        <path d="M-10,-84 L8,-30 L-12,0 L10,50" fill="none" stroke="#E5324C" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(golpes, 0, 0.6)} />
      </g>
      <Etiqueta x={1290} y={600} txt="TP53, el guardián del genoma" color="#6E6478" p={guardian} t={26} punta="no" />
      {/* regiones expuestas: el VHB y la aflatoxina se potencian */}
      <Txt x={500} y={780} txt="en regiones expuestas" t={26} p={regiones} color={TXH.hep} />
      <VirionB x={900} y={800} k={0.7} reloj={reloj} o={tramo(potencian, 0, 0.4)} /><Mani x={1130} y={820} k={0.75} reloj={reloj} o={tramo(potencian, 0, 0.4)} />
      <Flecha a={[990, 760]} b={[1180, 640]} p={tramo(golpes, 0, 0.8)} color="#E5324C" w={8} /><Flecha a={[1180, 760]} b={[1240, 650]} p={tramo(golpes, 0.2, 1)} color="#E5324C" w={8} />
      <Etiqueta x={1020} y={910} txt="se potencian" color="#8A4FE8" p={potencian} t={28} punta="no" />
      <Txt x={800} y={970} txt="dos golpes al mismo guardián" t={34} p={golpes} color={TXH.sangre} />
    </g>
  );
};

// ─── 6 · Una célula con ventaja ─────────────────────────────────────────────
const Ventaja: Lamina = ({ p, reloj }) => {
  const celula = p('celula'), hepatocito = p('hepatocito'), divide = p('divide'), vecinos = p('vecinos'), antes = p('antes'), cirrosis = p('cirrosis'), nodulo = p('nodulo'), desplaza = p('desplaza'), ecografia = p('ecografia'), compatible = p('compatible'), confirma = p('confirma'), incipiente = p('incipiente'), biopsia = p('biopsia'), lesion = p('lesion');
  const empuje = 70 * easeOut(desplaza);
  const clon = [[0, 0], [70, -36], [70, 36], [-70, -36], [-70, 36], [0, -72], [0, 72]];
  return (
    <g>
      <Etiqueta x={430} y={100} txt="una célula gana ventaja" color="#B8237A" p={celula} t={34} punta="no" />
      {/* una fila de hepatocitos; los vecinos se apartan al crecer el clon */}
      {[0, 1, 2, 3, 4, 5].map((i) => { const lado = i < 3 ? -1 : 1, d = 1 + (i % 3); return <Hepatocito key={i} x={800 + lado * (170 + d * 120) + lado * empuje} y={420 + (i % 2) * 26} k={0.55} reloj={reloj} fase={i} sem={i + 2} o={tramo(hepatocito, i / 14, i / 14 + 0.3)} />; })}
      {clon.map(([cx, cy], i) => <Hepatocito key={`c${i}`} x={800 + cx * 0.9 * easeOut(tramo(divide, i / 10, i / 10 + 0.5))} y={420 + cy * 0.9 * easeOut(tramo(divide, i / 10, i / 10 + 0.5))} k={0.55} reloj={reloj} fase={i + 3} sem={i + 9} atip={0.6} o={tramo(divide, i / 10, i / 10 + 0.3) * tramo(hepatocito, 0.3, 0.6)} />)}
      <Txt x={800} y={560} txt="se divide más rápido que sus vecinos" t={26} p={vecinos} color={TXH.hep} />
      <Etiqueta x={430} y={610} txt="antes de que exista cirrosis" color="#1FA85A" p={antes} t={26} punta="no" />
      <Txt x={430} y={665} txt="cirrosis" t={30} p={cirrosis} color={TXH.colageno} />
      <Tumor x={1280} y={600} k={0.7} reloj={reloj} o={tramo(nodulo, 0, 0.4)} />
      <Etiqueta x={1280} y={700} txt="un nódulo" color="#7A1260" p={nodulo} t={28} punta="no" />
      <Txt x={1280} y={750} txt="que desplaza al parénquima" t={24} p={desplaza} color={TXH.hep} />
      {/* la ecografía sin cirrosis: compatible, pero no lo confirma */}
      <Eco x={330} y={800} w={380} h={220} k={0.8} reloj={reloj} o={tramo(ecografia, 0, 0.4)} />
      <Etiqueta x={330} y={925} txt="ecografía sin cirrosis" color="#0A7F78" p={ecografia} t={24} punta="no" />
      <Txt x={780} y={820} txt="compatible con este camino" t={26} p={compatible} color={TXH.c} />
      <Txt x={780} y={865} txt="pero no lo confirma" t={26} p={confirma} color={TXH.sangre} />
      <Txt x={780} y={925} txt="ve poco la cirrosis incipiente" t={24} p={incipiente} color={TXH.gris} />
      <Etiqueta x={1250} y={880} txt="la biopsia" color="#E04AB0" p={biopsia} t={28} punta="no" />
      <Txt x={1250} y={935} txt="fue solo de la lesión" t={24} p={lesion} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [SinCirrosis, Indirecto, Integra, Insercional, Hbx, Aflatoxina, Ventaja];
export default LAMINAS;
