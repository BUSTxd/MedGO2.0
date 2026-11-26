'use client';
// Capítulo 9 · Inmunopatogenia del VHB
//
// Un virus que entra sin hacer ruido (los sensores del hepatocito son orejas que no oyen), el CD8 que mata sin matar (perforinas y granzimas
// por un lado, estrellas de IFN-γ y TNF por otro), los CD4 y los anticuerpos, la edad en dos barras (como la referencia «ratio de
// supervivencia»), el recién nacido que tolera, el linfocito agotado con sus candados y los dos pacientes que explican por qué la carga
// viral no es el daño. Todo respira: las células titilan, los linfocitos se arrastran, las estrellas caen.

import type { Lamina } from '../Lienzo';
import { CelulaCorte } from '../../sepsis/Piezas';
import { Placenta } from '../../bilirrubina/Piezas';
import { Plasmatica } from '../../citopenias-autoinmunes/Piezas';
import { Sello } from '../../vih-sifilis/Piezas';
import { Anticuerpo, Busto, Etiqueta, Flecha, Globo, Linfo, Nota, Sale, Sombra, Subviral, TXH, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Hepatocito, TuboCurvo as Tubo } from '../Higado';
import { BarraLab, BarrasPct } from '../Clinica';
import { Campana, Visto } from '../Extras';

const SOBRE_CEL = { hep: '#8A1E3C', b: '#1B36A8', d: '#4A1E8E', kup: '#7A4A00' } as const; // el cuerpo de CelulaCorte es siempre rosa claro: el texto encima va oscuro en los dos temas

type P2 = [number, number];

/** Una oreja: el sensor que escucha. `oye` 0-1 la tensa; `zzz` la duerme. */
function Oreja({ x, y, k = 1, o = 1, r = 0, oye = 0, reloj = 0 }: { x: number; y: number; k?: number; o?: number; r?: number; oye?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  const mov = 3 * Math.sin(reloj / 900) * (1 - oye);
  return (
    <g transform={`translate(${x},${y}) rotate(${r + mov}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={4} cy={8} rx={34} ry={50} fill="#000" opacity={0.14} />
      <ellipse rx={34} ry={50} fill="#D49A6A" /><ellipse cx={-2} cy={-2} rx={30} ry={46} fill="#F2C9A0" />
      <path d="M-10,-30 C10,-38 22,-14 12,4 C6,16 -4,18 -4,30" fill="none" stroke="#C9845A" strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={-14} cy={-24} rx={8} ry={14} fill="#FFF" opacity={0.45} />
    </g>
  );
}

/** Un cromosoma: dos brazos que se cruzan en X. */
function Cromosoma({ x, y, k = 1, o = 1, r = 0 }: { x: number; y: number; k?: number; o?: number; r?: number }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <g transform="translate(3,5)" opacity={0.2}><rect x={-12} y={-44} width={24} height={88} rx={12} transform="rotate(24)" /><rect x={-12} y={-44} width={24} height={88} rx={12} transform="rotate(-24)" /></g>
      <rect x={-12} y={-44} width={24} height={88} rx={12} fill={H.prot[0]} transform="rotate(24)" /><rect x={-12} y={-44} width={24} height={88} rx={12} fill={H.prot[0]} transform="rotate(-24)" />
      <rect x={-9} y={-42} width={18} height={82} rx={9} fill={H.prot[1]} transform="rotate(24)" /><rect x={-9} y={-42} width={18} height={82} rx={9} fill={H.prot[1]} transform="rotate(-24)" />
      <circle r={9} fill={H.prot[0]} />
    </g>
  );
}

/** Una estrella de citocina (chispa de cinco rayos). */
function Estrella({ x, y, k = 1, o = 1, r = 0, tono = '#FF8A1E', oscuro = '#C2540A' }: { x: number; y: number; k?: number; o?: number; r?: number; tono?: string; oscuro?: string }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={17} y2={0} stroke={oscuro} strokeWidth={5} strokeLinecap="round" transform={`rotate(${a})`} />)}
      <circle r={10} fill={tono} /><circle cx={-3} cy={-3} r={3.4} fill="#FFF" opacity={0.8} />
    </g>
  );
}

// ─── 0 · Un virus sigiloso ──────────────────────────────────────────────────
const Sigiloso: Lamina = ({ p, reloj }) => {
  const sigiloso = p('sigiloso'), innata = p('innata'), capside = p('capside'), esconde = p('esconde'), cccadn = p('cccadn'), cromosomas = p('cromosomas'), sensores = p('sensores'), notan = p('notan'), interferon = p('interferon'), debil = p('debil'), intruso = p('intruso'), ruido = p('ruido');
  const oidos: [number, number, number][] = [[330, 420, -18], [1270, 430, 18], [800, 270, 0]];
  return (
    <g>
      <CelulaCorte x={800} y={560} w={1300} h={800} nucleoY={190} nucleoR={215} reloj={reloj} />
      <Etiqueta x={460} y={110} txt="un virus sigiloso" color="#2F55E0" p={sigiloso} t={34} punta="no" />
      <Txt x={1100} y={110} txt="casi no activa la inmunidad innata" t={28} p={innata} color={TXH.b} />
      {/* la cápside esconde el ADN */}
      <VirionB x={560} y={380} k={1.0} reloj={reloj} env={0} capside={capside} adn={1 - easeOut(esconde)} o={tramo(capside, 0, 0.4)} />
      <Etiqueta x={560} y={500} txt="la cápside esconde el ADN" color="#1B36A8" p={esconde} t={26} punta="no" />
      {/* el cccDNA se parece a los cromosomas del huésped */}
      <circle cx={800} cy={750} r={152 + 6 * onda(reloj, 900)} fill="#FFE98A" opacity={0.2 * tramo(cccadn, 0, 0.5)} />
      {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * 6.28 - 1.57; return <g key={i} opacity={tramo(cccadn, 0.2 + i * 0.08, 0.5 + i * 0.08)}><circle cx={800 + Math.cos(a) * 105} cy={750 + Math.sin(a) * 105} r={22} fill={H.prot[0]} /><circle cx={798 + Math.cos(a) * 105} cy={748 + Math.sin(a) * 105} r={19} fill={H.prot[1]} /></g>; })}
      <circle cx={800} cy={750} r={105} fill="none" stroke={H.adn[1]} strokeWidth={10} opacity={0.9 * tramo(cccadn, 0, 0.5)} />
      <Etiqueta x={800} y={905} txt="cccDNA" color="#E8841E" p={cccadn} t={28} punta="no" />
      <Cromosoma x={640} y={690} k={0.8} r={-20} o={tramo(cromosomas, 0, 0.4)} /><Cromosoma x={960} y={690} k={0.8} r={20} o={tramo(cromosomas, 0.1, 0.5)} /><Cromosoma x={930} y={840} k={0.7} r={-30} o={tramo(cromosomas, 0.2, 0.6)} />
      <Txt x={1190} y={735} txt="parecido a los cromosomas" t={24} p={cromosomas} color={SOBRE_CEL.hep} /><Txt x={1190} y={772} txt="del huésped" t={24} p={cromosomas} color={SOBRE_CEL.hep} />
      {/* los sensores, orejas que no oyen */}
      {oidos.map(([ox, oy, r], i) => <Oreja key={i} x={ox} y={oy} k={1.0} r={r} reloj={reloj + i * 300} o={tramo(sensores, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={330} y={530} txt="sensores" color="#B07A44" p={sensores} t={26} punta="no" />
      {oidos.map(([ox, oy], i) => <text key={i} x={ox + 46} y={oy - 56 - 6 * Math.sin(reloj / 500 + i)} style={{ fontSize: 46, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: tramo(notan, i * 0.2, i * 0.2 + 0.4) }}>?</text>)}
      <Txt x={330} y={590} txt="apenas lo notan" t={26} p={notan} color={SOBRE_CEL.kup} />
      {/* el interferón de las primeras semanas es débil */}
      <BarraLab x={1520} y={880} w={80} alto={280} val={0.14} max={1} color="#FFB21E" oscuro="#C77800" p={interferon} nombre="interferón" valor="débil" t={26} />
      <Etiqueta x={1420} y={580} txt="primeras semanas" color="#C77800" p={debil} t={22} punta="no" />
      <Txt x={420} y={770} txt="un intruso que entra" t={30} p={intruso} color={SOBRE_CEL.hep} />
      <Txt x={420} y={820} txt="sin hacer ruido" t={30} p={ruido} color={SOBRE_CEL.hep} />
    </g>
  );
};

// ─── 1 · El ataque que mata sin matar ───────────────────────────────────────
const MataSinMatar: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), cd8 = p('cd8'), reconocen = p('reconocen'), hla = p('hla'), matan = p('matan'), perforinas = p('perforinas'), granzimas = p('granzimas'), fas = p('fas'), secretan = p('secretan'), ifn = p('ifn'), tnf = p('tnf'), frenan = p('frenan'), sinmatar = p('sinmatar'), cura = p('cura');
  const AX = 400, AY = 380, CX = 900, CY = 380, BX = 1180, BY = 760;
  return (
    <g>
      <Globo x={800} y={90} txt="¿cómo mata un linfocito sin matar?" t={34} p={pregunta} colaX={0} />
      {/* arriba: el CD8 reconoce el péptido en HLA y mata */}
      <Hepatocito x={AX} y={AY} k={1.55} reloj={reloj} sem={3} infecta={H.b} brillo={1 - easeOut(matan)} apop={easeOut(matan)} o={tramo(pregunta, 0, 0.4)} />
      {[0, 1, 2].map((i) => { const a = -0.5 + i * 0.5; return <g key={i} opacity={tramo(hla, i * 0.15, i * 0.15 + 0.4)}><line x1={AX + Math.cos(a) * 140} y1={AY + Math.sin(a) * 140} x2={AX + Math.cos(a) * 190} y2={AY + Math.sin(a) * 190} stroke="#E04AB0" strokeWidth={9} strokeLinecap="round" /><circle cx={AX + Math.cos(a) * 198} cy={AY + Math.sin(a) * 198} r={12} fill="#FFC81E" /></g>; })}
      <Linfo x={lerp(1150, CX, easeOut(cd8))} y={CY} k={1.1} reloj={reloj} activo={reconocen} receptores={8} o={tramo(cd8, 0, 0.3)} />
      <Etiqueta x={CX} y={230} txt="TCD8" color="#0A7F78" p={cd8} t={30} punta="no" />
      <Etiqueta x={AX - 20} y={600} txt="HLA de clase I + péptido viral" color="#B8237A" p={hla} t={24} punta="no" />
      <Txt x={640} y={190} txt="reconocen péptidos virales" t={26} p={reconocen} color={TXH.cd8} />
      <g opacity={tramo(matan, 0, 0.3)}>
        {[0, 1, 2, 3, 4, 5].map((i) => { const u = ((reloj / 1400 + i / 6) % 1); return <circle key={i} cx={lerp(CX - 90, AX + 150, u)} cy={CY - 20 + 40 * (i % 3) / 2 + 8 * Math.sin(u * 9)} r={7 + (i % 2) * 3} fill={i % 3 === 0 ? '#9DEEE6' : i % 3 === 1 ? '#FFC81E' : '#FFF'} opacity={Math.sin(u * Math.PI)} />; })}
      </g>
      <Txt x={640} y={560} txt="matan al hepatocito" t={28} p={matan} color={TXH.sangre} />
      <Etiqueta x={1250} y={250} txt="perforinas" color="#0A7F78" p={perforinas} t={26} punta="no" />
      <Etiqueta x={1250} y={320} txt="granzimas" color="#C79A00" p={granzimas} t={26} punta="no" />
      <Etiqueta x={1250} y={390} txt="Fas–FasL" color="#8A4FE8" p={fas} t={26} punta="no" />
      {/* abajo: las citocinas frenan la replicación sin destruir la célula */}
      <Linfo x={620} y={BY} k={0.95} reloj={reloj} fase={2} activo={0.5} o={tramo(secretan, 0, 0.4)} />
      <Txt x={620} y={880} txt="pero también secretan" t={26} p={secretan} color={TXH.kupffer} />
      <Hepatocito x={BX} y={BY} k={1.3} reloj={reloj} sem={5} infecta={H.b} brillo={1 - 0.8 * easeOut(frenan)} o={tramo(secretan, 0, 0.4)} />
      {Array.from({ length: 8 }, (_, i) => {
        const u = ((reloj / 2200 + i / 8) % 1), ifnQ = i % 2 === 0;
        const q = ifnQ ? ifn : tnf;
        return <Estrella key={i} x={lerp(760, BX - 80, u)} y={lerp(BY - 70, BY + (i % 3 - 1) * 60, u) + 12 * Math.sin(u * 9 + i)} k={0.9} r={u * 200} o={Math.sin(u * Math.PI) * tramo(q, 0, 0.4)} tono={ifnQ ? '#FF8A1E' : '#3FD467'} oscuro={ifnQ ? '#C2540A' : '#138A3A'} />;
      })}
      <Etiqueta x={900} y={600} txt="IFN-γ" color="#C2540A" p={ifn} t={28} punta="no" />
      <Etiqueta x={1060} y={600} txt="TNF-α" color="#138A3A" p={tnf} t={28} punta="no" />
      <Txt x={1180} y={925} txt="frenan la replicación" t={26} p={frenan} color={TXH.b} />
      <Visto x={1420} y={760} k={0.9} p={sinmatar} />
      <Txt x={1400} y={845} txt="sin destruir la célula" t={26} p={sinmatar} color={TXH.c} />
      <Etiqueta x={800} y={960} txt="una parte de la cura es no citolítica" color="#1FA85A" p={cura} t={26} punta="no" />
    </g>
  );
};

// ─── 2 · Los CD4 y los anticuerpos ──────────────────────────────────────────
const CuatroYAnticuerpos: Lamina = ({ p, reloj }) => {
  const cd4 = p('cd4'), sostienen = p('sostienen'), ayudan = p('ayudan'), b = p('b'), anticuerpos = p('anticuerpos'), antihbs = p('antihbs'), neutralizan = p('neutralizan'), retiran = p('retiran'), resolucion = p('resolucion'), decide = p('decide'), completa = p('completa');
  return (
    <g>
      <Linfo x={300} y={300} k={1.2} reloj={reloj} tono={H.cd4} activo={0.4} o={tramo(cd4, 0, 0.4)} />
      <Etiqueta x={300} y={180} txt="TCD4" color="#1E4FC0" p={cd4} t={30} punta="no" />
      <Linfo x={300} y={640} k={1.1} reloj={reloj} fase={2} activo={0.5} o={tramo(sostienen, 0, 0.4)} />
      <Etiqueta x={300} y={760} txt="TCD8" color="#0A7F78" p={sostienen} t={26} punta="no" />
      <Flecha a={[300, 400]} b={[300, 550]} p={tramo(sostienen, 0.2, 1)} color="#1E4FC0" w={9} />
      <Txt x={170} y={480} txt="sostienen" t={24} p={sostienen} color={TXH.b} />
      <Flecha a={[400, 290]} b={[600, 290]} p={tramo(ayudan, 0.2, 1)} color="#1E4FC0" w={9} />
      <Txt x={500} y={240} txt="ayudan" t={24} p={ayudan} color={TXH.b} />
      <Linfo x={720} y={300} k={1.1} reloj={reloj} fase={1} tono={H.ac} o={tramo(b, 0, 0.4)} />
      <Etiqueta x={720} y={180} txt="linfocito B" color="#6A9A00" p={b} t={26} punta="no" />
      <Sale p={anticuerpos} x={720} y={470} k={1.1}><Plasmatica /></Sale>
      <Flecha a={[720, 380]} b={[720, 430]} p={tramo(anticuerpos, 0, 0.8)} color="#6A9A00" w={8} />
      <Etiqueta x={600} y={585} txt="fabrican anticuerpos" color="#6A9A00" p={anticuerpos} t={26} punta="no" />
      {/* la sangre, con viriones y HBsAg que los anticuerpos neutralizan y retiran */}
      <Tubo a={[960, 640]} b={[1580, 520]} c={[1260, 660]} w={260} tono={H.endo} p={tramo(antihbs, 0, 0.6)} />
      <VirionB x={1090} y={600} k={0.6} reloj={reloj} fase={1} o={tramo(neutralizan, 0, 0.4)} />
      <VirionB x={1400} y={560} k={0.6} reloj={reloj} fase={2.4} o={tramo(neutralizan, 0.1, 0.5)} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Subviral key={i} x={950 + i * 110 + 20 * Math.sin(reloj / 1300 + i)} y={560 + 70 * (i % 2) + 10 * Math.cos(reloj / 1100 + i)} k={0.5} forma={i % 3 === 0 ? 'filamento' : 'esfera'} reloj={reloj} fase={i} o={tramo(retiran, 0, 0.5) * (1 - 0.7 * tramo(retiran, 0.7, 1)) + 0.0} />)}
      {Array.from({ length: 8 }, (_, i) => {
        const u = ((reloj / 2500 + i / 8) % 1), tx = [1090, 1400][i % 2] + (i > 3 ? 60 : -40), ty = 590;
        return <Anticuerpo key={i} x={lerp(760, tx, u)} y={lerp(480, ty + 20 * ((i % 3) - 1), u)} k={0.7} r={20 + i * 30} o={Math.sin(u * Math.PI) * tramo(antihbs, 0.2, 0.6)} />;
      })}
      <Etiqueta x={1230} y={420} txt="anti-HBs" color="#6A9A00" p={antihbs} t={30} punta="no" />
      <Txt x={1230} y={780} txt="neutralizan los viriones" t={26} p={neutralizan} color={TXH.ac} />
      <Txt x={1230} y={830} txt="y retiran el HBsAg de la sangre" t={26} p={retiran} color={TXH.ac} />
      <Etiqueta x={500} y={860} txt="su aparición marca la resolución" color="#1FA85A" p={resolucion} t={26} punta="no" />
      <Sale p={resolucion} x={760} y={930}><Sello ok /></Sale>
      <Etiqueta x={1230} y={930} txt="¿quién se cura?" color="#8A4FE8" p={decide} t={28} punta="no" />
      <Txt x={1230} y={985} txt="la respuesta completa de linfocitos y anticuerpos" t={24} p={completa} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · La edad decide la cronicidad ───────────────────────────────────────
const Edad: Lamina = ({ p, reloj }) => {
  const decide = p('decide'), edad = p('edad'), bebes = p('bebes'), cronifican = p('cronifican'), v95 = p('v95'), oms = p('oms'), adultos = p('adultos'), v5 = p('v5'), resumen = p('resumen'), rara = p('rara');
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué decide si el virus B se queda?" t={34} p={decide} colaX={0} />
      <Etiqueta x={800} y={185} txt="la edad" color="#B8237A" p={edad} t={40} punta="no" />
      <BarrasPct x={800} y={550} w={900} h={560} a={0.95} b={0.05} pa={v95} pb={v5} colA="#E6DDF2" colB="#E5324C" txtA="bebés" txtB="adultos" valA="95 %" valB="< 5 %" titulo="¿quién cronifica?" pt={cronifican} />
      <Sombra><Sale p={bebes} x={230} y={540} k={0.38}><Busto quien="p2" reloj={reloj} fase={1.2} sueno={0.6} sonrisa={0.5} /></Sale></Sombra>
      <Etiqueta x={230} y={680} txt="al nacer o en la infancia" color="#1FA85A" p={bebes} t={24} punta="no" />
      <Sombra><Sale p={adultos} x={1380} y={540} k={0.45}><Busto quien="p1" reloj={reloj} fase={2.6} /></Sale></Sombra>
      <Etiqueta x={1380} y={690} txt="adultos" color="#2F55E0" p={adultos} t={26} punta="no" />
      <Etiqueta x={800} y={875} txt="según la Organización Mundial de la Salud" color="#0A7F78" p={oms} t={24} punta="no" />
      <Nota x={800} y={925} txt="el resumen dice solo «infancia o nacimiento»" p={resumen} />
      <Txt x={800} y={968} txt="pero los adultos también pueden cronificar, aunque rara vez" t={24} p={rara} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · La tolerancia del recién nacido ────────────────────────────────────
const Tolerancia: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), hbeag = p('hbeag'), placenta = p('placenta'), ensena = p('ensena'), reaccionar = p('reaccionar'), replica = p('replica'), adn = p('adn'), alt = p('alt'), fase = p('fase'), inmunotolerante = p('inmunotolerante');
  return (
    <g>
      <Globo x={640} y={90} txt="¿por qué un recién nacido tolera al virus?" t={34} p={pregunta} colaX={0} />
      <Sombra><Sale p={hbeag} x={220} y={330} k={0.45}><Busto quien="madre" reloj={reloj} fase={0.8} /></Sale></Sombra>
      <Etiqueta x={220} y={460} txt="HBeAg de la madre" color="#138A3A" p={hbeag} t={24} punta="no" />
      <Placenta x={600} y={340} k={0.95} o={tramo(placenta, 0, 0.4)} reloj={reloj} />
      {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 3000 + i / 6) % 1); return <circle key={i} cx={lerp(340, 900, u)} cy={340 + 22 * Math.sin(u * 9 + i)} r={12} fill={H.c[1]} opacity={Math.sin(u * Math.PI) * tramo(placenta, 0.2, 0.6)} />; })}
      <Etiqueta x={600} y={460} txt="cruza la placenta" color="#C25A5A" p={placenta} t={26} punta="no" />
      <Sombra><Sale p={ensena} x={900} y={340} k={0.26}><Busto quien="p2" reloj={reloj} fase={1.4} sueno={0.7} sonrisa={0.4} /></Sale></Sombra>
      <Linfo x={1180} y={330} k={1.2} reloj={reloj} agotado={0.5 * tramo(ensena, 0, 1)} activo={0.2 * (1 - ensena)} o={tramo(ensena, 0, 0.4)} />
      <text x={1250} y={250 - 8 * Math.sin(reloj / 500)} style={{ fontSize: 44, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: tramo(reaccionar, 0, 0.5) }}>z z z</text>
      <Etiqueta x={1040} y={470} txt="enseña a los linfocitos T del bebé" color="#1E4FC0" p={ensena} t={24} punta="no" />
      <g opacity={tramo(reaccionar, 0, 0.4)}><polygon points="1390,420 1420,420 1442,442 1442,472 1420,494 1390,494 1368,472 1368,442" fill="#E5324C" /><rect x={1382} y={451} width={52} height={14} rx={4} fill="#FFF" /></g>
      <Txt x={1405} y={535} txt="a no reaccionar" t={24} p={reaccionar} color={TXH.sangre} />
      {/* el virus se replica a sus anchas, con ADN muy alto y ALT normal */}
      <Tubo a={[120, 700]} b={[900, 700]} c={[520, 660]} w={200} tono={H.endo} p={tramo(replica, 0, 0.6)} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <VirionB key={i} x={190 + i * 105 + 14 * Math.sin(reloj / 900 + i)} y={700 + 40 * Math.sin(i * 2.3) + 8 * Math.cos(reloj / 700 + i)} k={0.3} reloj={reloj} fase={i} o={tramo(replica, i / 12, i / 12 + 0.3)} />)}
      <Txt x={500} y={850} txt="se replica a sus anchas" t={28} p={replica} color={TXH.b} />
      <BarraLab x={1090} y={900} w={90} alto={250} val={0.95} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN viral" valor="muy alto" t={26} />
      <BarraLab x={1330} y={900} w={90} alto={250} val={0.1} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="normal" t={26} />
      <Txt x={560} y={905} txt="la fase que llamábamos" t={30} p={fase} color={TXH.hep} />
      <Etiqueta x={560} y={960} txt="inmunotolerante" color="#B8237A" p={inmunotolerante} t={32} punta="no" />
    </g>
  );
};

/** Un reloj sencillo para los años (aguja que gira). */
function Reloj2({ x, y, reloj, p }: { x: number; y: number; reloj: number; p: number }) {
  if (p <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={tramo(p, 0, 0.4)}>
      <circle cx={4} cy={8} r={62} fill="#000" opacity={0.15} /><circle r={62} fill="#6A35A0" /><circle cx={-2} cy={-2} r={56} fill="#F4EAFF" />
      <line x1={0} y1={0} x2={0} y2={-38} stroke="#6A35A0" strokeWidth={6} strokeLinecap="round" transform={`rotate(${(reloj / 6) % 360})`} />
      <line x1={0} y1={0} x2={28} y2={0} stroke="#9358F0" strokeWidth={6} strokeLinecap="round" transform={`rotate(${(reloj / 72) % 360})`} />
      <circle r={6} fill="#6A35A0" />
    </g>
  );
}

// ─── 5 · El agotamiento ─────────────────────────────────────────────────────
const Agotamiento: Lamina = ({ p, reloj }) => {
  const anos = p('anos'), hbsag = p('hbsag'), hbeag = p('hbeag'), agotan = p('agotan'), receptores = p('receptores'), pd1 = p('pd1'), tim3 = p('tim3'), ctla4 = p('ctla4'), lag3 = p('lag3'), prolif = p('proliferan'), sueltan = p('sueltan'), distinto = p('distinto'), ejercito = p('ejercito');
  const LX = 560, LY = 560;
  // un receptor inhibidor: bastoncito con bola, su candado y su rótulo de color
  const rec = (txt: string, ang: number, q: number, col: string, lx: number, ly: number) => {
    const a = (ang * Math.PI) / 180, bx = LX + Math.cos(a) * 190, by = LY + Math.sin(a) * 190, tx = LX + Math.cos(a) * 262, ty = LY + Math.sin(a) * 262;
    return (
      <g key={txt}>
        <g opacity={tramo(q, 0, 0.4)}>
          <line x1={LX + Math.cos(a) * 150} y1={LY + Math.sin(a) * 150} x2={bx} y2={by} stroke={col} strokeWidth={9} strokeLinecap="round" />
          <circle cx={bx} cy={by} r={15} fill={col} /><circle cx={bx - 4} cy={by - 4} r={4} fill="#FFF" opacity={0.8} />
          <rect x={tx - 17} y={ty - 6} width={34} height={28} rx={7} fill="#4A4658" /><path d={`M${tx - 9},${ty - 6} v-10 a9,9 0 0 1 18,0 v10`} fill="none" stroke="#4A4658" strokeWidth={5} />
        </g>
        <Etiqueta x={lx} y={ly} txt={txt} color={col} p={q} t={26} punta="no" />
      </g>
    );
  };
  return (
    <g>
      <Reloj2 x={200} y={200} reloj={reloj} p={anos} />
      <Txt x={200} y={290} txt="años" t={32} p={anos} color={TXH.d} />
      {Array.from({ length: 10 }, (_, i) => {
        const u = ((reloj / 2600 + i / 10) % 1), ee = i % 2 === 0;
        return <circle key={i} cx={lerp(330, 480, u)} cy={150 + 26 * (i % 5)} r={ee ? 9 : 7} fill={ee ? H.b[1] : H.c[1]} opacity={Math.sin(u * Math.PI) * tramo(ee ? hbsag : hbeag, 0, 0.4)} />;
      })}
      <Etiqueta x={640} y={115} txt="HBsAg" color="#2F55E0" p={hbsag} t={26} punta="no" />
      <Etiqueta x={800} y={115} txt="HBeAg" color="#138A3A" p={hbeag} t={26} punta="no" />
      <Linfo x={LX} y={LY} k={2.3} reloj={reloj} agotado={easeOut(agotan)} receptores={8} o={tramo(agotan, 0, 0.4)} />
      <Etiqueta x={LX - 60} y={865} txt="los linfocitos T específicos se agotan" color="#6E6478" p={agotan} t={26} punta="no" />
      {rec('PD-1', -80, pd1, '#E5324C', 617, 235)}{rec('TIM-3', -20, tim3, '#8A4FE8', 870, 447)}{rec('CTLA-4', 35, ctla4, '#E8841E', 830, 750)}{rec('LAG-3', 160, lag3, '#0A7F78', 250, 673)}
      <Etiqueta x={1250} y={150} txt="receptores inhibidores" color="#4A4658" p={receptores} t={26} punta="no" />
      <Txt x={1250} y={225} txt="proliferan menos" t={30} p={prolif} color={TXH.hep} />
      <BarraLab x={1050} y={720} w={64} alto={200} val={0.18} max={1} color="#9DEEE6" oscuro="#0A7F78" p={sueltan} nombre="perforinas" valor="poco" t={22} />
      <BarraLab x={1230} y={720} w={64} alto={200} val={0.2} max={1} color="#FFC81E" oscuro="#C79A00" p={sueltan} nombre="granzimas" valor="poco" t={22} />
      <BarraLab x={1410} y={720} w={64} alto={200} val={0.15} max={1} color="#FF8A1E" oscuro="#C2540A" p={sueltan} nombre="IFN-γ" valor="poco" t={22} />
      <Txt x={1230} y={810} txt="sueltan menos" t={28} p={sueltan} color={TXH.kupffer} />
      <Txt x={760} y={925} txt="agotamiento no es lo mismo que tolerancia" t={32} p={distinto} color={TXH.hep} />
      {[0, 1, 2, 3, 4].map((i) => <Linfo key={i} x={1120 + i * 80} y={950} k={0.3} reloj={reloj} fase={i} agotado={1} receptores={4} o={tramo(ejercito, i * 0.1, i * 0.1 + 0.4)} />)}
      <Txt x={1330} y={990} txt="un ejército que ya no puede" t={24} p={ejercito} color={TXH.gris} />
    </g>
  );
};

// ─── 6 · La pregunta guía ───────────────────────────────────────────────────
const PreguntaGuia: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), a = p('a'), alt1 = p('alt1'), b = p('b'), les2 = p('les2'), noCito = p('noCito'), dano = p('dano'), fuerza = p('fuerza'), carga = p('carga'), r1 = p('r1'), r2 = p('r2');
  // una columna: el paciente, su sangre con virus, los TCD8 que atacan y su ALT
  const col = (cx: number, bx: number, nVir: number, nCd: number, altv: number, q: number, qa: number, quien: 'p1' | 'p2', lesion: number) => (
    <g>
      <Sombra><Sale p={q} x={cx} y={230} k={0.34}><Busto quien={quien} reloj={reloj} fase={cx / 300} /></Sale></Sombra>
      <Tubo a={[cx - 290, 470]} b={[cx + 290, 470]} c={[cx, 440]} w={170} tono={H.endo} p={tramo(q, 0, 0.6)} />
      {Array.from({ length: nVir }, (_, i) => <VirionB key={i} x={cx - 250 + (i * 500) / Math.max(1, nVir - 1) + 12 * Math.sin(reloj / 900 + i)} y={470 + 28 * Math.sin(i * 2.7)} k={0.34} reloj={reloj} fase={i} o={tramo(q, 0.2 + i / 30, 0.5 + i / 30)} />)}
      {Array.from({ length: nCd }, (_, i) => <Linfo key={i} x={cx - 230 + (i * 460) / Math.max(1, nCd - 1) + 10 * Math.sin(reloj / 700 + i)} y={640 + 14 * Math.sin(i * 2.1 + reloj / 600)} k={0.5} reloj={reloj} fase={i} activo={0.8} receptores={5} o={tramo(qa, i / 12, i / 12 + 0.3)} />)}
      <BarraLab x={bx} y={745} w={70} alto={200} val={altv} max={1} color="#F2848C" oscuro="#B83A52" p={lesion} nombre="ALT" valor={altv > 0.5 ? 'alta' : 'casi normal'} t={22} />
    </g>
  );
  return (
    <g>
      <Globo x={800} y={90} txt="¿por qué no coinciden virus y daño?" t={34} p={pregunta} colaX={0} />
      {col(380, 740, 12, 1, 0.12, a, tramo(alt1, 0, 1), 'p1', alt1)}
      {col(1160, 1520, 3, 7, 0.9, b, tramo(les2, 0, 1), 'p2', les2)}
      <Txt x={380} y={760} txt="mucho virus + poco ataque = poca lesión" t={26} p={r1} color={TXH.b} />
      <Txt x={1160} y={760} txt="menos virus + mucho ataque = mucha lesión" t={26} p={r2} color={TXH.sangre} />
      <Etiqueta x={800} y={850} txt="el VHB no es citopático" color="#B8237A" p={noCito} t={30} punta="no" />
      <Txt x={800} y={905} txt="el daño depende" t={28} p={dano} color={TXH.cd8} />
      <Txt x={800} y={942} txt="de la fuerza del ataque de los TCD8" t={28} p={fuerza} color={TXH.cd8} />
      <Txt x={800} y={979} txt="no de la carga viral" t={30} p={carga} color={TXH.hep} />
    </g>
  );
};

// ─── 7 · El paciente 1 en esa tabla ─────────────────────────────────────────
const Paciente1: Lamina = ({ p, reloj }) => {
  const paciente = p('paciente'), hace = p('hace'), tol = p('tol'), consulta = p('consulta'), alt = p('alt'), esquivan = p('esquivan'), matan = p('matan'), apoptosis = p('apoptosis'), necrosis = p('necrosis'), moderado = p('moderado'), guerra = p('guerra');
  const TY = 620;
  const bandera = (x: number, txt: string, c: string, q: number) => (
    <g>
      <g opacity={tramo(q, 0, 0.4)}><line x1={x} x2={x} y1={TY - 20} y2={TY + 100} stroke={c} strokeWidth={6} strokeLinecap="round" /><circle cx={x} cy={TY} r={20} fill={c} /><circle cx={x - 5} cy={TY - 5} r={6} fill="#FFF" opacity={0.7} /></g>
      <Etiqueta x={x} y={TY + 140} txt={txt} color={c} p={q} t={28} punta="arriba" />
    </g>
  );
  return (
    <g>
      <Etiqueta x={800} y={100} txt="el paciente 1" color="#2F55E0" p={paciente} t={36} punta="no" />
      <rect x={150} y={TY - 14} width={1300} height={28} rx={14} fill="#FFF" opacity={0.3 * tramo(paciente, 0, 0.5)} />
      <rect x={150} y={TY - 14} width={650 * tramo(hace, 0, 1)} height={28} rx={14} fill="#7A55D8" opacity={0.9} />
      <rect x={800} y={TY - 14} width={650 * tramo(consulta, 0, 1)} height={28} rx={14} fill="#E8841E" opacity={0.9} />
      {bandera(420, 'hace 4 años', '#7A55D8', hace)}
      {bandera(1100, 'primera consulta', '#E8841E', consulta)}
      {/* hace 4 años: mucho virus y ningún ataque */}
      <Sombra><Sale p={hace} x={240} y={380} k={0.32}><Busto quien="p1" reloj={reloj} fase={0.3} /></Sale></Sombra>
      {[0, 1, 2, 3, 4, 5].map((i) => <VirionB key={i} x={390 + (i % 3) * 90 + 10 * Math.sin(reloj / 800 + i)} y={330 + Math.floor(i / 3) * 90} k={0.28} reloj={reloj} fase={i} o={tramo(hace, 0.2 + i / 15, 0.5 + i / 15)} />)}
      <Linfo x={700} y={370} k={0.75} reloj={reloj} agotado={0.7 * tol} activo={0} o={tramo(tol, 0, 0.4)} />
      <text x={750} y={290 - 6 * Math.sin(reloj / 500)} style={{ fontSize: 40, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: tramo(tol, 0.3, 0.8) }}>z z</text>
      <Etiqueta x={430} y={200} txt="tolerancia: mucho virus y ningún ataque" color="#7A55D8" p={tol} t={26} punta="no" />
      {/* primera consulta: ALT 86 y los CD8 que esquivan el agotamiento */}
      <Linfo x={930} y={370} k={0.8} reloj={reloj} fase={2} activo={esquivan} o={tramo(esquivan, 0, 0.4)} />
      <Etiqueta x={1130} y={200} txt="los TCD8 esquivan el agotamiento" color="#0A7F78" p={esquivan} t={26} punta="no" />
      {[0, 1, 2].map((i) => <Hepatocito key={i} x={1090 + i * 120} y={370 + (i % 2) * 40} k={0.5} reloj={reloj} fase={i} sem={i + 2} infecta={H.b} brillo={1 - 0.5 * matan} apop={i === 1 ? easeOut(apoptosis) : 0} o={tramo(matan, 0, 0.4)} />)}
      <Flecha a={[990, 380]} b={[1060, 380]} p={tramo(matan, 0.2, 1)} color="#E5324C" w={8} />
      <Etiqueta x={1190} y={480} txt="empiezan a matar hepatocitos" color="#B8237A" p={matan} t={24} punta="no" />
      <BarraLab x={1510} y={500} w={70} alto={230} val={86} max={400} norm={40} color="#F2848C" oscuro="#B83A52" p={alt} nombre="ALT" valor="86" t={30} />
      <Txt x={500} y={860} txt="apoptosis" t={30} p={apoptosis} color={TXH.sangre} />
      <Txt x={800} y={860} txt="necrosis focal" t={30} p={necrosis} color={TXH.hep} />
      <Txt x={1190} y={860} txt="en un número moderado de células" t={26} p={moderado} color={TXH.gris} />
      <Txt x={800} y={950} txt="la guerra está empezando" t={38} p={guerra} color={TXH.sangre} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Sigiloso, MataSinMatar, CuatroYAnticuerpos, Edad, Tolerancia, Agotamiento, PreguntaGuia, Paciente1];
export default LAMINAS;
