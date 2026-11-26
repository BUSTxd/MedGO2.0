'use client';
// Capítulo 22 · Tratamiento del VHC y cierre
//
// Antes: interferón pegilado con ribavirina, de 24 a 48 semanas y una curación que no llegaba a la mitad; ahora, las tres familias de antivirales de
// acción directa (-previr, -asvir, -buvir), cada una tapando una pieza de la fábrica; el sofosbuvir que corta la cadena de ARN y el velpatasvir sobre
// NS5A; otras pautas y qué hacer si el ARN reaparece; la respuesta virológica sostenida como cura; las interacciones; y los dos pacientes lado a lado.

import type { Lamina } from '../Lienzo';
import { Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Arn } from '../../vih-sifilis/Piezas';
import { Tijera, tijeretazo } from '../../bilirrubina/Piezas';
import { Busto, CccDNA, Capsula, Etiqueta, Flecha, Globo, Helice, Reloj, Sale, Sombra, TXH, Txt, VirionC, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { PiernaPurpura } from '../../vasculitis-anca/Piezas';
import { BarraLab } from '../Clinica';
import { Hepatocito } from '../Higado';
import { Calendario, Plato, Tacha, Tachon, Tumor, Visto } from '../Extras';

type P2 = [number, number];
const ESM = ['#0B7A4A', '#14B870', '#A4F0CC'] as const;
const PILD = { previr: ['#0A7F78', '#10B5A8', '#9DEEE6'], asvir: ['#A81878', '#E04AB0', '#FFB0E4'], buvir: ['#1B36A8', '#4F7FF0', '#C0D4FF'] } as const;

/** Un anillo de porcentaje. */
function Anillo({ x, y, R = 100, v, p, color, txt }: { x: number; y: number; R?: number; v: number; p: number; color: string; txt: string }) {
  if (p <= 0.003) return null;
  return (
    <g>
      <g transform={`translate(${x},${y}) rotate(-90)`} opacity={tramo(p, 0, 0.3)}>
        <circle r={R} fill="none" stroke="#FFF" strokeWidth={34} opacity={0.3} />
        <circle r={R} fill="none" stroke={color} strokeWidth={34} pathLength={1} strokeDasharray={`${(v * easeOut(clamp(p))).toFixed(3)} 1`} strokeLinecap="round" />
      </g>
      <Txt x={x} y={y} txt={txt} t={36} p={p} color={color} />
    </g>
  );
}

// ─── 0 · Antes: interferón y ribavirina ─────────────────────────────────────
const Antes: Lamina = ({ p, reloj }) => {
  const antes = p('antes'), interferon = p('interferon'), pegilado = p('pegilado'), ribavirina = p('ribavirina'), semanas = p('semanas'), efectos = p('efectos'), adversos = p('adversos'), curacion = p('curacion'), mitad = p('mitad'), genotipo = p('genotipo'), hoy = p('hoy'), historia = p('historia');
  return (
    <g>
      <Etiqueta x={130} y={85} txt="antes" color="#8A6A12" p={antes} t={40} punta="no" />
      <Sale p={interferon} x={250} y={260} k={1.2}><Jeringa /></Sale>
      <Etiqueta x={250} y={370} txt="interferón pegilado" color="#8A4FE8" p={Math.max(interferon, pegilado)} t={24} punta="no" />
      <Txt x={420} y={260} txt="+" t={60} p={ribavirina} color={TXH.gris} />
      <Sale p={ribavirina} x={570} y={270} k={1.6}><Capsula reloj={reloj} /></Sale>
      <Etiqueta x={570} y={370} txt="ribavirina" color="#C25A00" p={ribavirina} t={24} punta="no" />
      {/* de 24 a 48 semanas */}
      <rect x={150} y={500} width={760 * easeOut(semanas)} height={46} rx={23} fill="#B8A8D8" opacity={0.6} /><rect x={150} y={500} width={380 * easeOut(semanas)} height={46} rx={23} fill="#8A4FE8" />
      <Etiqueta x={530} y={440} txt="24 semanas" color="#8A4FE8" p={semanas} t={26} punta="abajo" /><Etiqueta x={900} y={440} txt="48 semanas" color="#6A35A0" p={semanas} t={26} punta="abajo" />
      {/* muchos efectos adversos */}
      <Sombra><Sale p={efectos} x={260} y={760} k={0.33}><Busto quien="p1" reloj={reloj} fase={0.5} dolor={0.8} sueno={0.5} /></Sale></Sombra>
      <Etiqueta x={260} y={880} txt="muchos efectos adversos" color="#E5324C" p={Math.max(efectos, adversos)} t={26} punta="no" />
      {/* la curación no llegaba a la mitad */}
      <Anillo x={1180} y={400} R={110} v={0.45} p={curacion} color="#8A6A12" txt="< 50 %" />
      <g opacity={tramo(mitad, 0, 0.4)} transform="translate(1180,400)"><line x1={0} y1={-150} x2={0} y2={-80} stroke="#E5324C" strokeWidth={7} strokeLinecap="round" /></g>
      <Txt x={1180} y={600} txt="una curación que no llegaba" t={26} p={curacion} color={TXH.sangre} /><Txt x={1180} y={640} txt="ni a la mitad de los pacientes" t={26} p={mitad} color={TXH.sangre} />
      <Etiqueta x={1180} y={710} txt="con genotipo 1" color="#2F55E0" p={genotipo} t={28} punta="no" />
      <Sale p={hoy} x={1000} y={860} k={2.0}><Capsula tono={H.verde} reloj={reloj} /></Sale>
      <Txt x={1300} y={880} txt="hoy es otra historia" t={38} p={Math.max(hoy, historia)} color={TXH.c} />
    </g>
  );
};

// ─── 1 · Tres familias de antivirales directos ──────────────────────────────
const Familias: Lamina = ({ p, reloj }) => {
  const tres = p('tres'), familias = p('familias'), antivirales = p('antivirales'), previr = p('previr'), proteasa = p('proteasa'), ns34a = p('ns34a'), asvir = p('asvir'), ns5a = p('ns5a'), buvir = p('buvir'), polimerasa = p('polimerasa'), ns5b = p('ns5b'), cada = p('cada'), bloquea = p('bloquea'), pieza = p('pieza'), fabrica = p('fabrica'), tres2 = p('tres2'), piezas = p('piezas'), familias2 = p('familias2');
  const col = (x: number, nombre: string, q: number, tono: readonly string[], bloqueo: number, txt: string, txtq: number) => {
    const sube = easeOut(bloqueo);
    return (
      <g>
        <Etiqueta x={x} y={170} txt={nombre} color={tono[1]} p={q} t={36} punta="no" />
        <rect x={x - 130} y={330} width={260} height={160} rx={44} fill="#000" opacity={0.12} transform="translate(6,10)" /><rect x={x - 130} y={330} width={260} height={160} rx={44} fill={tono[1]} />
        <rect x={x - 110} y={346} width={200} height={24} rx={12} fill="#FFF" opacity={0.3} />
        <rect x={x - 70} y={380} width={140} height={86} rx={30} fill="none" stroke="#FFF" strokeWidth={6} strokeDasharray="12 10" opacity={0.85} />
        <g transform={`translate(${x},${lerp(640, 424, sube)})`} opacity={tramo(q, 0, 0.4)}><Capsula tono={tono} k={1.5} r={-90} reloj={reloj} /></g>
        <Txt x={x} y={600} txt={txt} t={26} p={txtq} color={TXH.hep} />
      </g>
    );
  };
  return (
    <g>
      <Txt x={800} y={95} txt="tres familias de antivirales de acción directa" t={36} p={Math.max(tres, familias, antivirales)} color={TXH.hep} />
      {col(300, '-previr', previr, PILD.previr, ns34a, 'inhiben la proteasa NS3/4A', Math.max(proteasa, ns34a))}
      {col(800, '-asvir', asvir, PILD.asvir, ns5a, 'inhiben NS5A', ns5a)}
      {col(1300, '-buvir', buvir, PILD.buvir, ns5b, 'inhiben la polimerasa NS5B', Math.max(polimerasa, ns5b))}
      {/* la proteasa NS3/4A es la tijera; NS5A y NS5B, piezas de la fábrica */}
      <Sale p={Math.max(proteasa, ns34a)} x={300} y={300} k={0.55}><g transform="rotate(90)"><Tijera color="#0A7F78" corta={tijeretazo(reloj, 800)} /></g></Sale>
      <Txt x={300} y={535} txt="NS3/4A" t={32} p={Math.max(previr, ns34a)} color="#10B5A8" /><Txt x={800} y={535} txt="NS5A" t={32} p={Math.max(asvir, ns5a)} color="#E04AB0" /><Txt x={1300} y={535} txt="NS5B" t={32} p={Math.max(buvir, ns5b)} color="#4F7FF0" />
      <Txt x={800} y={730} txt="cada una bloquea una pieza" t={30} p={Math.max(cada, bloquea, pieza)} color={TXH.c} /><Txt x={800} y={776} txt="de la fábrica que vimos en el ciclo" t={28} p={fabrica} color={TXH.c} />
      <Txt x={800} y={900} txt="tres piezas, tres familias" t={40} p={Math.max(tres2, piezas, familias2)} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Sofosbuvir y velpatasvir ───────────────────────────────────────────
const Sofos: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), sofosbuvir = p('sofosbuvir'), velpatasvir = p('velpatasvir'), profarmaco = p('profarmaco'), uridina = p('uridina'), trifosfato = p('trifosfato'), ns5b = p('ns5b'), termina = p('termina'), cadena = p('cadena'), arn = p('arn'), velpat2 = p('velpat2'), bloquea = p('bloquea'), ns5a = p('ns5a'), pangeno = p('pangeno'), doce = p('doce'), semanas = p('semanas'), tiempo = p('tiempo'), ensayos = p('ensayos'), recambio = p('recambio'), hepatocitos = p('hepatocitos'), dos = p('dos'), golpes = p('golpes'), fabrica = p('fabrica');
  const crece = Math.max(cadena, arn);
  return (
    <g>
      <Globo x={560} y={85} txt="¿cómo actúa sofosbuvir con velpatasvir?" t={32} p={pregunta} colaX={0} />
      {/* el sofosbuvir: un profármaco de uridina que termina la cadena de ARN */}
      <Sale p={Math.max(sofosbuvir, profarmaco)} x={180} y={320} k={1.8}><Capsula tono={H.farma} reloj={reloj} /></Sale>
      <Etiqueta x={180} y={420} txt="sofosbuvir" color="#6A35A0" p={sofosbuvir} t={26} punta="no" /><Txt x={180} y={470} txt="profármaco de uridina" t={22} p={Math.max(profarmaco, uridina)} color={TXH.d} />
      <Flecha a={[290, 320]} b={[400, 320]} p={tramo(trifosfato, 0, 1)} color="#8A4FE8" w={9} />
      <g opacity={tramo(trifosfato, 0, 0.4)} transform="translate(520,320)"><circle r={36} fill="#E5324C" /><circle cx={-2} cy={-2} r={31} fill="#FF5D6C" /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 34, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>U</text>{[0, 1, 2].map((i) => <circle key={i} cx={56 + i * 26} cy={0} r={11} fill="#FFC81E" />)}</g>
      <Etiqueta x={560} y={420} txt="forma trifosfato" color="#E5324C" p={trifosfato} t={24} punta="no" />
      {/* NS5B la incorpora y la cadena se detiene */}
      <g opacity={tramo(ns5b, 0, 0.4)}><circle cx={1003} cy={345} r={64} fill="#000" opacity={0.13} /><circle cx={1000} cy={340} r={64} fill="#1B36A8" /><circle cx={997} cy={336} r={58} fill="#4F7FF0" /><circle cx={975} cy={314} r={12} fill="#FFF" opacity={0.6} /></g>
      <Txt x={1000} y={345} txt="NS5B" t={28} p={ns5b} color="#FFFFFF" />
      {Array.from({ length: 8 }, (_, i) => { const q = tramo(crece, i / 10, i / 10 + 0.25), x = 700 + i * 34; return q > 0.01 ? <circle key={i} cx={x} cy={430 + 10 * Math.sin(i + reloj / 400)} r={11} fill="#14B870" opacity={q} /> : null; })}
      <circle cx={700 + 8 * 34} cy={430} r={14} fill="#E5324C" opacity={tramo(termina, 0, 0.3)} /><Tacha x={700 + 9 * 34} y={430} r={26} p={termina} />
      <Txt x={880} y={510} txt="termina la cadena de ARN" t={26} p={Math.max(termina, cadena, arn)} color={TXH.sangre} />
      {/* el velpatasvir bloquea NS5A; es pangenotípico y se da 12 semanas */}
      <Sale p={Math.max(velpatasvir, velpat2)} x={180} y={690} k={1.8}><Capsula tono={PILD.asvir} reloj={reloj} /></Sale>
      <Etiqueta x={180} y={790} txt="velpatasvir" color="#A81878" p={Math.max(velpatasvir, velpat2)} t={26} punta="no" />
      <Flecha a={[290, 690]} b={[400, 690]} p={tramo(bloquea, 0, 1)} color="#A81878" w={9} />
      <g opacity={tramo(Math.max(bloquea, ns5a), 0, 0.4)}><rect x={430} y={620} width={240} height={140} rx={40} fill="#E04AB0" /><rect x={448} y={632} width={160} height={20} rx={10} fill="#FFF" opacity={0.3} /></g>
      <Txt x={550} y={690} txt="NS5A" t={30} p={Math.max(bloquea, ns5a)} color="#FFFFFF" /><Tacha x={648} y={655} r={30} p={ns5a} />
      {Array.from({ length: 6 }, (_, i) => { const q = easeBack(tramo(pangeno, i / 9, i / 9 + 0.3)); return q > 0.01 ? <g key={i} transform={`translate(${860 + i * 100},690) scale(${q.toFixed(3)})`}><circle cx={3} cy={5} r={36} fill="#000" opacity={0.14} /><circle r={36} fill={`hsl(${i * 55 + 20},60%,38%)`} /><circle cx={-2} cy={-2} r={32} fill={`hsl(${i * 55 + 20},70%,56%)`} /></g> : null; })}
      {Array.from({ length: 6 }, (_, i) => <Txt key={i} x={860 + i * 100} y={690} txt={String(i + 1)} t={32} p={pangeno} color="#FFFFFF" />)}
      <Txt x={1110} y={760} txt="pangenotípico" t={26} p={pangeno} color={TXH.d} />
      <Calendario x={1450} y={900} k={0.8} o={tramo(doce, 0, 0.4)} n="12" unidad="semanas" /><Txt x={1230} y={860} txt="se da 12 semanas" t={28} p={Math.max(doce, semanas)} color={TXH.hep} />
      <Txt x={760} y={850} txt="un tiempo que fijaron los ensayos clínicos" t={24} p={Math.max(tiempo, ensayos)} color={TXH.b} />
      <Txt x={820} y={892} txt="no el recambio de los hepatocitos" t={24} p={Math.max(recambio, hepatocitos)} color={TXH.gris} /><Hepatocito x={580} y={892} k={0.2} reloj={reloj} sem={3} o={tramo(hepatocitos, 0, 0.4)} /><Tacha x={580} y={892} r={22} p={hepatocitos} />
      <Txt x={760} y={965} txt="dos golpes a la misma fábrica" t={38} p={Math.max(dos, golpes, fabrica)} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Otras pautas y qué hacer si el ARN reaparece ───────────────────────
const Pautas: Lamina = ({ p, reloj }) => {
  const pautas = p('pautas'), glecaprevir = p('glecaprevir'), pibrentasvir = p('pibrentasvir'), ocho = p('ocho'), semanas = p('semanas'), cirrosis = p('cirrosis'), previo = p('previo'), peru = p('peru'), resolucion = p('resolucion'), rm = p('rm'), sofosbuvir = p('sofosbuvir'), daklatasvir = p('daklatasvir'), arn = p('arn'), reaparece = p('reaparece'), revisan = p('revisan'), adherencia = p('adherencia'), interacciones = p('interacciones'), resistencia = p('resistencia'), repetir = p('repetir'), ciegas = p('ciegas');
  return (
    <g>
      <Globo x={420} y={85} txt="¿hay otras pautas?" t={32} p={pautas} colaX={0} />
      {/* glecaprevir con pibrentasvir: 8 semanas, sin cirrosis ni tratamiento previo */}
      <Sale p={glecaprevir} x={170} y={320} k={1.5}><Capsula tono={PILD.previr} reloj={reloj} /></Sale><Sale p={pibrentasvir} x={310} y={320} k={1.5}><Capsula tono={PILD.asvir} reloj={reloj} /></Sale>
      <Etiqueta x={240} y={410} txt="glecaprevir + pibrentasvir" color="#0A7F78" p={Math.max(glecaprevir, pibrentasvir)} t={24} punta="no" />
      <Calendario x={240} y={560} k={1.0} o={tramo(Math.max(ocho, semanas), 0, 0.4)} n="8" unidad="semanas" />
      <Txt x={240} y={680} txt="sin cirrosis" t={26} p={cirrosis} color={TXH.c} /><Visto x={410} y={680} k={0.6} p={cirrosis} />
      <Txt x={240} y={730} txt="ni tratamiento previo" t={26} p={previo} color={TXH.c} /><Visto x={460} y={730} k={0.6} p={previo} />
      {/* en el Perú: RM 929-2026 con sofosbuvir y daklatasvir */}
      <g opacity={tramo(peru, 0, 0.4)}><rect x={620} y={230} width={110} height={160} rx={8} fill="#D91023" /><rect x={730} y={230} width={110} height={160} fill="#FFFFFF" /><rect x={840} y={230} width={110} height={160} rx={8} fill="#D91023" /></g>
      <Etiqueta x={785} y={450} txt="en el Perú" color="#D91023" p={peru} t={28} punta="no" />
      <Txt x={785} y={510} txt="resolución ministerial" t={24} p={resolucion} color={TXH.hep} /><Etiqueta x={785} y={566} txt="RM 929-2026" color="#6A35A0" p={rm} t={28} punta="no" />
      <Sale p={sofosbuvir} x={680} y={680} k={1.5}><Capsula tono={H.farma} reloj={reloj} /></Sale><Sale p={daklatasvir} x={880} y={680} k={1.5}><Capsula tono={H.verde} reloj={reloj} /></Sale>
      <Txt x={785} y={760} txt="sofosbuvir con daklatasvir" t={24} p={Math.max(sofosbuvir, daklatasvir)} color={TXH.d} />
      {/* si el ARN reaparece: se revisa antes de repetir, no se repite a ciegas */}
      <VirionC x={1260} y={260} k={0.9} reloj={reloj} o={tramo(Math.max(arn, reaparece), 0, 0.4)} />
      <Etiqueta x={1260} y={370} txt="si el ARN reaparece" color="#0B7A4A" p={Math.max(arn, reaparece)} t={26} punta="no" />
      <Txt x={1260} y={440} txt="se revisan" t={26} p={revisan} color={TXH.hep} />
      {[['adherencia', adherencia, 510], ['interacciones', interacciones, 580], ['resistencia', resistencia, 650]].map(([t, q, y]) => (
        <g key={t as string}><Visto x={1120} y={y as number} k={0.55} p={q as number} /><Txt x={1300} y={y as number} txt={t as string} t={28} p={q as number} color={TXH.d} /></g>
      ))}
      <Txt x={1260} y={740} txt="antes de repetir el esquema" t={24} p={repetir} color={TXH.gris} />
      <Txt x={1260} y={800} txt="repetir a ciegas" t={30} p={ciegas} color={TXH.gris} /><Tachon x1={1130} x2={1390} y={800} p={ciegas} /><Etiqueta x={1260} y={870} txt="no se repite a ciegas" color="#E5324C" p={ciegas} t={30} punta="no" />
    </g>
  );
};

// ─── 4 · La respuesta virológica sostenida es la cura ───────────────────────
const Curacion: Lamina = ({ p, reloj }) => {
  const curarse = p('curarse'), arn = p('arn'), indetectable = p('indetectable'), doce = p('doce'), semanas = p('semanas'), terminar = p('terminar'), respuesta = p('respuesta'), sostenida = p('sostenida'), cura = p('cura'), mejoran = p('mejoran'), transaminasas = p('transaminasas'), fibrosis = p('fibrosis'), regresar = p('regresar'), crio = p('crio'), purpura = p('purpura'), artralgias = p('artralgias'), proteinuria = p('proteinuria'), nota = p('nota'), piel = p('piel');
  const X0 = 140, Y0 = 640, Y1 = 280;
  const carga = (u: number) => (u < 0.34 ? lerp(Y1 + 40, Y1 + 60, u / 0.34) : u < 0.5 ? lerp(Y1 + 60, Y0 - 40, (u - 0.34) / 0.16) : Y0 - 40);
  const traza = (q: number) => 'M' + Array.from({ length: 41 }, (_, i) => { const u = (i / 40) * clamp(q); return `${(X0 + u * 760).toFixed(1)},${carga(u).toFixed(1)}`; }).join(' L');
  return (
    <g>
      <Globo x={500} y={85} txt="¿qué es curarse del virus C?" t={32} p={curarse} colaX={0} />
      <line x1={X0} y1={Y0} x2={X0 + 800} y2={Y0} stroke={TXH.gris} strokeWidth={5} opacity={0.6 * tramo(arn, 0, 0.3)} />
      <path d={traza(easeOut(arn) * (0.5 + 0.5 * tramo(terminar, 0, 1)))} fill="none" stroke="#14B870" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      <Etiqueta x={300} y={230} txt="ARN" color="#0B7A4A" p={arn} t={28} punta="no" />
      <line x1={X0} y1={Y0 - 40} x2={X0 + 800} y2={Y0 - 40} stroke="#E5324C" strokeWidth={5} strokeDasharray="10 12" opacity={tramo(indetectable, 0, 0.4)} />
      <Txt x={X0 + 742} y={Y0 - 80} txt="indetectable" t={26} p={indetectable} color={TXH.sangre} />
      {/* 12 semanas después de terminar el tratamiento */}
      <line x1={X0 + 380} y1={Y0 - 200} x2={X0 + 380} y2={Y0 + 30} stroke={TXH.d} strokeWidth={5} opacity={tramo(terminar, 0, 0.3)} />
      <Txt x={X0 + 380} y={Y0 + 70} txt="fin del tratamiento" t={22} p={terminar} color={TXH.d} />
      <path d={`M${X0 + 380},${Y0 - 20} L${X0 + 380},${Y0 - 6} L${X0 + 380 + 280 * easeOut(Math.max(doce, semanas))},${Y0 - 6} L${X0 + 380 + 280 * easeOut(Math.max(doce, semanas))},${Y0 - 20}`} fill="none" stroke="#8A4FE8" strokeWidth={6} strokeLinecap="round" />
      <Txt x={X0 + 520} y={Y0 + 120} txt="12 semanas después" t={26} p={Math.max(doce, semanas)} color={TXH.d} />
      <g opacity={tramo(respuesta, 0, 0.4)} transform={`translate(${X0 + 620},${Y0 - 6})`}><line y2={-170} stroke="#8A6A12" strokeWidth={7} strokeLinecap="round" /><path d="M0,-170 L96,-146 L0,-118 Z" fill="#1FA85A" /></g>
      <Txt x={X0 + 650} y={Y0 - 200} txt="RVS12" t={30} p={Math.max(respuesta, sostenida)} color={TXH.c} /><Txt x={X0 + 560} y={Y0 + 170} txt="respuesta virológica sostenida" t={24} p={sostenida} color={TXH.c} />
      <g opacity={0.28 * tramo(cura, 0, 0.5)}>{Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.283, cx = X0 + 400, cy = 905; return <path key={i} d={`M${cx},${cy} L${(cx + Math.cos(a - 0.08) * 260).toFixed(1)},${(cy + Math.sin(a - 0.08) * 260).toFixed(1)} L${(cx + Math.cos(a + 0.08) * 260).toFixed(1)},${(cy + Math.sin(a + 0.08) * 260).toFixed(1)} Z`} fill="#FFC81E" />; })}</g>
      <Etiqueta x={X0 + 400} y={905} txt="equivale a la cura" color="#1FA85A" p={cura} t={34} punta="no" />
      {/* mejoran las transaminasas, la fibrosis regresa en parte y la crioglobulinemia mejora */}
      <Etiqueta x={1250} y={150} txt="mejoran" color="#1FA85A" p={mejoran} t={30} punta="no" />
      <BarraLab x={1090} y={450} w={72} alto={230} val={1.2} max={4} norm={1.0} color="#F2848C" oscuro="#B83A52" p={transaminasas} nombre="transaminasas" valor="↓" t={22} />
      <Txt x={1380} y={290} txt="la fibrosis puede regresar" t={22} p={fibrosis} color={TXH.colageno} /><Txt x={1380} y={326} txt="en parte" t={22} p={regresar} color={TXH.colageno} />
      <PiernaPurpura x={1330} y={500} k={0.5} p={1 - 0.85 * easeOut(Math.max(purpura, artralgias, proteinuria))} />
      <Txt x={1380} y={690} txt="en la crioglobulinemia" t={22} p={crio} color={TXH.hep} /><Txt x={1380} y={725} txt="mejoran la púrpura" t={22} p={purpura} color={TXH.hep} /><Txt x={1380} y={760} txt="las artralgias" t={22} p={artralgias} color={TXH.hep} /><Txt x={1380} y={795} txt="y a menudo la proteinuria" t={22} p={proteinuria} color={TXH.hep} />
      <Txt x={1180} y={930} txt="una cura que se nota en la piel" t={34} p={Math.max(nota, piel)} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · Interacciones y cuidados ───────────────────────────────────────────
const Cuidados: Lamina = ({ p, reloj }) => {
  const cuidado = p('cuidado'), interacciones = p('interacciones'), efectos = p('efectos'), leves = p('leves'), cefalea = p('cefalea'), fatiga = p('fatiga'), ibp = p('ibp'), norecomiendan = p('norecomiendan'), falta = p('falta'), comida = p('comida'), cuatro = p('cuatro'), veinte = p('veinte'), omeprazol = p('omeprazol'), amiodarona = p('amiodarona'), bradicardia = p('bradicardia'), rifampicina = p('rifampicina'), efecto = p('efecto'), busca = p('busca'), hbsag = p('hbsag'), antihbc = p('antihbc'), reactivarse = p('reactivarse');
  const ecg = (x0: number, y: number, lento: number) => 'M' + Array.from({ length: 60 }, (_, i) => { const u = i / 59, ciclo = lento > 0.5 ? 3 : 6, ph = (u * ciclo) % 1, v = ph > 0.42 && ph < 0.5 ? -(ph - 0.42) / 0.04 * 50 : ph >= 0.5 && ph < 0.56 ? -50 + (ph - 0.5) / 0.06 * 110 : ph >= 0.56 && ph < 0.62 ? 60 - (ph - 0.56) / 0.06 * 60 : 0; return `${(x0 + u * 360).toFixed(1)},${(y - v).toFixed(1)}`; }).join(' L');
  return (
    <g>
      <Etiqueta x={460} y={95} txt="cuidado con las interacciones" color="#E8841E" p={Math.max(cuidado, interacciones)} t={34} punta="no" />
      {/* efectos leves: cefalea y fatiga */}
      <Sombra><Sale p={Math.max(efectos, leves, cefalea)} x={170} y={290} k={0.3}><Busto quien="p2" reloj={reloj} fase={0.4} dolor={0.9} sueno={0.4} /></Sale></Sombra>
      <Etiqueta x={170} y={400} txt="efectos leves" color="#1FA85A" p={Math.max(efectos, leves)} t={26} punta="no" />
      <Txt x={170} y={450} txt="cefalea" t={24} p={cefalea} color={TXH.sangre} /><Txt x={170} y={490} txt="y fatiga" t={24} p={fatiga} color={TXH.kupffer} />
      {/* los inhibidores de la bomba de protones no se recomiendan; si hacen falta, con comida y 4 horas antes de 20 mg de omeprazol */}
      <g opacity={tramo(ibp, 0, 0.4)}><rect x={470} y={230} width={200} height={90} rx={45} fill="#8A6A12" /><rect x={470} y={230} width={100} height={90} rx={45} fill="#D4A21E" /><text x={570} y={282} textAnchor="middle" style={{ fontSize: 38, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>IBP</text></g>
      <Tacha x={660} y={275} r={38} p={norecomiendan} />
      <Txt x={570} y={370} txt="inhibidores de la bomba de protones" t={22} p={ibp} color={TXH.kupffer} /><Txt x={570} y={405} txt="no se recomiendan" t={24} p={norecomiendan} color={TXH.sangre} />
      <Txt x={570} y={470} txt="si hacen falta:" t={24} p={falta} color={TXH.gris} />
      <Plato x={430} y={560} k={0.7} o={tramo(comida, 0, 0.4)} /><Txt x={430} y={650} txt="con comida" t={22} p={comida} color={TXH.c} />
      <Reloj x={640} y={560} k={0.7} ang={(reloj / 30) % 360} o={tramo(cuatro, 0, 0.4)} /><Txt x={640} y={650} txt="4 horas antes" t={22} p={cuatro} color={TXH.d} />
      <Sale p={Math.max(veinte, omeprazol)} x={880} y={560} k={1.1}><Capsula tono={H.a} reloj={reloj} /></Sale><Txt x={880} y={650} txt="de 20 mg de omeprazol" t={22} p={Math.max(veinte, omeprazol)} color={TXH.a} />
      {/* amiodarona: bradicardia; rifampicina: baja el efecto */}
      <path d={ecg(240, 820, bradicardia)} fill="none" stroke="#E5324C" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(amiodarona, 0, 0.4)} />
      <Etiqueta x={300} y={730} txt="amiodarona" color="#B8237A" p={amiodarona} t={26} punta="no" /><Txt x={420} y={900} txt="bradicardia" t={26} p={bradicardia} color={TXH.sangre} />
      <BarraLab x={940} y={900} w={72} alto={150} val={0.3} max={1} norm={0.9} color="#14B870" oscuro="#0B7A4A" p={efecto} nombre="efecto" valor="baja" t={22} />
      <Etiqueta x={940} y={700} txt="rifampicina" color="#C25A00" p={rifampicina} t={26} punta="no" />
      {/* antes se busca el virus B, porque puede reactivarse */}
      <Etiqueta x={1290} y={200} txt="antes se busca el virus B" color="#2F55E0" p={busca} t={28} punta="no" />
      <Sale p={hbsag} x={1170} y={430} k={0.9}><circle r={50} fill="#1B36A8" /><circle cx={-3} cy={-3} r={44} fill="#4F7FF0" /><circle cx={-14} cy={-16} r={9} fill="#FFF" opacity={0.7} /></Sale><Etiqueta x={1170} y={520} txt="HBsAg" color="#2F55E0" p={hbsag} t={26} punta="no" />
      <Sale p={antihbc} x={1410} y={430} k={0.9}><circle r={50} fill="#0A7F78" /><circle cx={-3} cy={-3} r={44} fill="#10B5A8" /><circle cx={-14} cy={-16} r={9} fill="#FFF" opacity={0.7} /></Sale><Etiqueta x={1410} y={520} txt="anti-HBc" color="#0A7F78" p={antihbc} t={26} punta="no" />
      <VirionCB x={1290} y={760} reloj={reloj} q={reactivarse} />
      <Txt x={1290} y={900} txt="porque puede reactivarse" t={30} p={reactivarse} color={TXH.sangre} />
    </g>
  );
};

/** El virus B que despierta: late y crece cuando se reactiva. */
function VirionCB({ x, y, reloj, q }: { x: number; y: number; reloj: number; q: number }) {
  if (q <= 0.01) return null;
  const k = 0.7 + 0.5 * easeOut(q) + 0.04 * Math.sin(reloj / 160);
  return (
    <g transform={`translate(${x},${y}) scale(${k.toFixed(3)})`} opacity={tramo(q, 0, 0.4)}>
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 6.283; return <g key={i}><line x1={Math.cos(a) * 50} y1={Math.sin(a) * 50} x2={Math.cos(a) * 68} y2={Math.sin(a) * 68} stroke="#2F55E0" strokeWidth={6} strokeLinecap="round" /><circle cx={Math.cos(a) * 70} cy={Math.sin(a) * 70} r={5} fill="#A8BEFF" /></g>; })}
      <circle r={52} fill="#1B36A8" /><circle cx={-3} cy={-3} r={47} fill="#2F55E0" /><circle r={26} fill="#A8BEFF" opacity={0.9} /><circle cx={-12} cy={-16} r={9} fill="#FFF" opacity={0.7} />
    </g>
  );
}

// ─── 6 · Los dos pacientes, lado a lado ─────────────────────────────────────
const Dos: Lamina = ({ p, reloj }) => {
  const dos0 = p('dos0'), pacientes = p('pacientes'), lado = p('lado'), p1 = p('p1'), adn = p('adn'), integra = p('integra'), ccc = p('ccc'), farmacos = p('farmacos'), suprime = p('suprime'), cura1 = p('cura1'), cancer = p('cancer'), p2 = p('p2'), arnvirus = p('arnvirus'), reservorio = p('reservorio'), cura2 = p('cura2'), reinfectarse = p('reinfectarse'), vacuna = p('vacuna'), dosvirus = p('dosvirus'), discretos = p('discretos'), organo = p('organo'), respuesta = p('respuesta'), entender = p('entender'), defiende = p('defiende'), hiere = p('hiere'), hepatitis = p('hepatitis');
  const rebote = Math.abs(Math.sin(reloj / 480)) * tramo(farmacos, 0, 0.3);
  return (
    <g>
      <rect x={40} y={170} width={730} height={640} rx={44} fill="#4F7FF0" opacity={0.1 * tramo(Math.max(dos0, pacientes, lado), 0, 0.4)} /><rect x={830} y={170} width={730} height={640} rx={44} fill="#14B870" opacity={0.1 * tramo(Math.max(dos0, pacientes, lado), 0, 0.4)} />
      <Txt x={800} y={95} txt="los dos pacientes, lado a lado" t={38} p={Math.max(dos0, pacientes, lado)} color={TXH.hep} />
      {/* paciente 1: el VHB, un ADN que se integra y un cccDNA que los fármacos no tocan */}
      <Etiqueta x={400} y={225} txt="paciente 1 · virus B" color="#2F55E0" p={p1} t={30} punta="no" />
      <Sombra><Sale p={p1} x={150} y={400} k={0.38}><Busto quien="p1" reloj={reloj} fase={0.5} /></Sale></Sombra>
      <Helice x={540} y={330} w={300} amp={26} reloj={reloj} p={adn} grosor={11} tono={H.adn} vueltas={2} />
      <g opacity={tramo(integra, 0, 0.4)}><rect x={500} y={290} width={80} height={80} rx={20} fill="#FFC81E" opacity={0.4} /><path d="M540,250 L540,290" stroke="#FFC81E" strokeWidth={8} strokeLinecap="round" /></g>
      <Txt x={540} y={415} txt="un ADN que se integra" t={24} p={Math.max(adn, integra)} color={TXH.b} />
      <CccDNA x={540} y={540} R={56} reloj={reloj} p={ccc} o={tramo(ccc, 0, 0.3)} />
      <Txt x={540} y={640} txt="un cccDNA que los fármacos no tocan" t={22} p={Math.max(ccc, farmacos)} color={TXH.b} />
      {[0, 1].map((i) => <g key={i} transform={`translate(${300 + 60 * i - 30 * rebote},${520 + 20 * i - 18 * rebote})`} opacity={tramo(farmacos, 0, 0.3)}><Capsula tono={H.farma} k={0.9} reloj={reloj} /></g>)}
      <Tacha x={400} y={540} r={36} p={farmacos} />
      <Etiqueta x={500} y={745} txt="se suprime, no se cura" color="#2F55E0" p={Math.max(suprime, cura1)} t={28} punta="no" />
      <Tumor x={170} y={640} k={0.55} reloj={reloj} o={tramo(cancer, 0, 0.4)} /><Txt x={170} y={735} txt="hubo un cáncer" t={24} p={cancer} color={TXH.sangre} />
      {/* paciente 2: el VHC, un ARN sin reservorio */}
      <Etiqueta x={1200} y={225} txt="paciente 2 · virus C" color="#0B7A4A" p={p2} t={30} punta="no" />
      <Sombra><Sale p={p2} x={910} y={400} k={0.38}><Busto quien="p2" reloj={reloj} fase={1.5} sonrisa={0.6 * easeOut(cura2)} /></Sale></Sombra>
      <VirionC x={1250} y={340} k={0.9} reloj={reloj} o={tramo(arnvirus, 0, 0.4)} />
      <Arn x={1100} y={450} w={300} p={arnvirus} grosor={10} tono={ESM} fase={reloj / 500} />
      <Txt x={1250} y={520} txt="un virus de ARN" t={24} p={arnvirus} color={TXH.c} />
      <g opacity={tramo(reservorio, 0, 0.4)}><circle cx={1000} cy={620} r={44} fill="#4A2A9E" opacity={0.7} /></g><Tacha x={1000} y={620} r={52} p={reservorio} />
      <Txt x={1170} y={620} txt="sin reservorio" t={26} p={reservorio} color={TXH.c} />
      <Sale p={cura2} x={950} y={715}><Capsula tono={H.verde} k={1.2} reloj={reloj} /></Sale><Visto x={1080} y={715} k={0.7} p={cura2} /><Etiqueta x={1290} y={720} txt="se cura" color="#1FA85A" p={cura2} t={30} punta="no" />
      <Txt x={1130} y={780} txt="aunque puede reinfectarse" t={22} p={reinfectarse} color={TXH.sangre} /><Sale p={vacuna} x={1470} y={560} k={0.62}><Jeringa /></Sale><Tacha x={1470} y={560} r={52} p={vacuna} /><Txt x={1470} y={690} txt="no hay vacuna" t={26} p={vacuna} color={TXH.sangre} />
      {/* el cierre */}
      <Txt x={800} y={850} txt="dos virus discretos, un órgano y la respuesta del cuerpo" t={30} p={Math.max(dosvirus, discretos, organo, respuesta)} color={TXH.d} />
      <Txt x={800} y={905} txt="entender cómo se defiende y se hiere" t={36} p={Math.max(entender, defiende, hiere)} color={TXH.hep} /><Txt x={800} y={955} txt="es entender las hepatitis" t={38} p={hepatitis} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Antes, Familias, Sofos, Pautas, Curacion, Cuidados, Dos];
export default LAMINAS;
