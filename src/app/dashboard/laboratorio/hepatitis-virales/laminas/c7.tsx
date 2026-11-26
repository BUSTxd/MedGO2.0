'use client';
// Capítulo 7 · El VHB: partícula y genoma
//
// El virión de Dane en grande (azul cobalto, que gira y titila) con sus capas que entran al nombrarse; la nube de señuelos vacíos en un vaso
// ancho (como la referencia «virus y células», con profundidad); el genoma como un círculo con cuatro arcos que se solapan; cinco proteínas
// con su oficio (el interruptor de HBx, el trasvase del HBeAg por la placenta) y el mapa del mundo de la referencia con sus diez genotipos.

import type { Lamina } from '../Lienzo';
import { Placenta, Tijera } from '../../bilirrubina/Piezas';
import { Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Anticuerpo, Busto, Etiqueta, Flecha, Globo, Linfo, Sale, Sombra, Subviral, TXH, Toro, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, mezcla, tramo } from '../Piezas';
import { Colageno, Corre, Hepatocito, TuboCurvo } from '../Higado';
import { MapaMundi, proyecta } from '../Extras';

type P2 = [number, number];

/** Una línea guía que se dibuja con `p`, con un punto en el extremo. */
function Guia({ a, b, p, color = 'var(--cit-flecha)' }: { a: P2; b: P2; p: number; color?: string }) {
  if (p <= 0.003) return null;
  return (
    <g>
      <path d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${easeOut(clamp(p)).toFixed(3)} 1`} opacity={0.85} />
      <circle cx={b[0]} cy={b[1]} r={9 * tramo(p, 0.6, 1)} fill={color} />
    </g>
  );
}

/** Un arco de circunferencia (grados, 0° a la derecha y en sentido horario) con borde de sombra, cuerpo y punta de flecha. */
function Arco({ R, a0, a1, tono, p, w = 22 }: { R: number; a0: number; a1: number; tono: readonly string[]; p: number; w?: number }) {
  if (p <= 0.003) return null;
  const rad = (g: number) => (g * Math.PI) / 180;
  const P = (g: number): P2 => [Math.cos(rad(g)) * R, Math.sin(rad(g)) * R];
  const [x0, y0] = P(a0), [x1, y1] = P(a1);
  const d = `M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${(a1 - a0) % 360 > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
  const da = `${easeOut(clamp(p)).toFixed(3)} 1`;
  const tx = -Math.sin(rad(a1)), ty = Math.cos(rad(a1)), nx = Math.cos(rad(a1)), ny = Math.sin(rad(a1));
  return (
    <g>
      <path d={d} fill="none" stroke={tono[0]} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={da} transform="translate(3,6)" opacity={0.75} />
      <path d={d} fill="none" stroke={tono[1]} strokeWidth={w - 4} strokeLinecap="round" pathLength={1} strokeDasharray={da} />
      <path d={d} fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={da} opacity={0.45} transform="translate(-2,-3)" />
      <polygon points={`${x1 + tx * 26},${y1 + ty * 26} ${x1 + nx * 15},${y1 + ny * 15} ${x1 - nx * 15},${y1 - ny * 15}`} fill={tono[1]} opacity={tramo(p, 0.85, 1)} />
    </g>
  );
}

// ─── 0 · La partícula de Dane ───────────────────────────────────────────────
const Dane: Lamina = ({ p, reloj }) => {
  const dane = p('dane'), nm = p('nm'), envoltura = p('envoltura'), hbsag = p('hbsag'), capside = p('capside'), adn = p('adn'), polimerasa = p('polimerasa'), hepadna = p('hepadna'), hepatocitos = p('hepatocitos'), esfera = p('esfera');
  const VX = 480, VY = 470, K = 2.5;
  return (
    <g>
      <Etiqueta x={480} y={110} txt="partícula de Dane" color="#2F55E0" p={dane} t={34} punta="no" />
      <Etiqueta x={1180} y={130} txt="familia Hepadnaviridae" color="#0A7F78" p={hepadna} t={28} punta="no" />
      <circle cx={VX} cy={VY} r={78 * K} fill="none" stroke="#A8BEFF" strokeWidth={8} strokeDasharray="6 16" opacity={0.7 * tramo(dane, 0, 0.5) * (1 - tramo(envoltura, 0, 0.5))} transform={`rotate(${(reloj / 50) % 360} ${VX} ${VY})`} />
      <VirionB x={VX} y={VY} k={K} reloj={reloj} env={envoltura} espiculas={hbsag} capside={capside} adn={adn} o={tramo(dane, 0, 0.3)} />
      {/* el tamaño: 42 nm */}
      <path d={`M${VX - 78 * K},850 L${VX + 78 * K},850 M${VX - 78 * K},836 L${VX - 78 * K},864 M${VX + 78 * K},836 L${VX + 78 * K},864`} stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${easeOut(nm).toFixed(3)} 1`} />
      <Txt x={VX} y={905} txt="≈ 42 nm" t={34} p={nm} color={TXH.b} />
      {/* sus capas, con una guía a cada una */}
      <Guia a={[940, 250]} b={[650, 380]} p={envoltura} color="#2F55E0" />
      <Etiqueta x={1190} y={250} txt="envoltura lipídica con HBsAg" color="#2F55E0" p={envoltura} t={28} punta="no" />
      <Guia a={[960, 450]} b={[570, 470]} p={capside} color="#1B36A8" />
      <Etiqueta x={1200} y={450} txt="cápside icosaédrica (HBcAg)" color="#1B36A8" p={capside} t={28} punta="no" />
      <Guia a={[990, 650]} b={[520, 540]} p={adn} color="#C79A00" />
      <Etiqueta x={1190} y={650} txt="ADN con la polimerasa" color="#C79A00" p={adn} t={28} punta="no" />
      <Sale p={polimerasa} x={760} y={650} k={1.4}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /><ellipse cx={-4.5} cy={-3.6} rx={4.4} ry={2.2} fill="#FFF" opacity={0.75} /></Sale>
      {/* casi solo infecta hepatocitos */}
      <Hepatocito x={1330} y={840} k={0.7} reloj={reloj} sem={3} o={tramo(hepatocitos, 0, 0.4)} />
      <Flecha a={[720, 660]} b={[1220, 810]} c={[1000, 800]} p={tramo(hepatocitos, 0.2, 1)} color="var(--cit-flecha)" w={7} />
      <Txt x={800} y={975} txt="una esfera diminuta con todo lo necesario" t={34} p={esfera} color={TXH.b} />
    </g>
  );
};

// ─── 1 · Más partículas vacías que virus ────────────────────────────────────
const Senuelos: Lamina = ({ p, reloj }) => {
  const particulas = p('particulas'), sangre = p('sangre'), esferas = p('esferas'), filamentos = p('filamentos'), sinadn = p('sinadn'), mil = p('mil'), viriones = p('viriones'), senuelos = p('senuelos'), distraen = p('distraen'), hepatocito = p('hepatocito'), secreta = p('secreta'), escapar = p('escapar');
  const camino = (u: number): P2 => [120 + u * 1360, 430 + 22 * Math.sin(u * 6)];
  const decoys = Array.from({ length: 36 }, (_, i) => ({ x: 190 + hash(i, 1) * 1220, y: 310 + hash(i, 2) * 250, fil: i % 3 === 0, i }));
  const quien = [4, 11, 17, 24];
  return (
    <g>
      <Globo x={800} y={90} txt="¿hay más partículas que virus?" t={34} p={particulas} colaX={0} />
      <TuboCurvo a={[100, 430]} b={[1500, 430]} c={[800, 400]} w={380} tono={H.endo} p={tramo(sangre, 0, 0.6)} />
      <Corre camino={camino} reloj={reloj} n={8} vel={0.00005} tono={H.sangre} R={20} sem={2} o={tramo(sangre, 0.4, 1)} />
      <Etiqueta x={200} y={190} txt="en la sangre" color="#E3203F" p={sangre} t={28} punta="no" />
      {decoys.map(({ x, y, fil, i }) => {
        const q = fil ? filamentos : esferas;
        return <Subviral key={i} x={x + 26 * Math.sin(reloj / 1700 + i)} y={y + 16 * Math.cos(reloj / 1400 + i * 1.3)} k={0.78} r={i * 23} forma={fil ? 'filamento' : 'esfera'} reloj={reloj} fase={i} o={tramo(q, i / 46, i / 46 + 0.3)} />;
      })}
      <VirionB x={420} y={420} k={0.6} reloj={reloj} fase={0.5} o={tramo(viriones, 0, 0.4)} />
      <VirionB x={1190} y={480} k={0.6} reloj={reloj} fase={2.1} o={tramo(viriones, 0.1, 0.5)} />
      {quien.map((d, i) => {
        const b = decoys[d], q = easeOut(distraen);
        const ax = lerp(i % 2 ? 1190 : 420, b.x + 40, q), ay = lerp(i % 2 ? 480 : 420, b.y - 30, q);
        return <Anticuerpo key={i} x={ax + 12 * Math.sin(reloj / 500 + i)} y={ay + 8 * Math.cos(reloj / 600 + i)} k={0.7} r={20 + i * 40} o={tramo(distraen, i * 0.08, i * 0.08 + 0.3)} />;
      })}
      <Etiqueta x={420} y={560} txt="viriones" color="#2F55E0" p={viriones} t={26} punta="arriba" />
      <Etiqueta x={800} y={680} txt="HBsAg sin ADN" color="#7A55D8" p={sinadn} t={28} punta="no" />
      <Txt x={1360} y={690} txt="≥ 1 000 veces más" t={38} p={mil} color={TXH.b} />
      <Etiqueta x={800} y={745} txt="señuelos que distraen a los anticuerpos" color="#6A9A00" p={senuelos} t={26} punta="no" />
      {/* el hepatocito también los secreta */}
      <Hepatocito x={800} y={880} k={0.8} reloj={reloj} sem={5} o={tramo(hepatocito, 0, 0.4)} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((reloj / 2400 + i / 6) % 1);
        return <Subviral key={i} x={800 + 46 * Math.sin(i * 1.9 + u * 3)} y={lerp(790, 620, u)} k={0.4} forma={i % 3 === 0 ? 'filamento' : 'esfera'} reloj={reloj} fase={i} o={Math.sin(u * Math.PI) * tramo(secreta, 0, 0.4)} />;
      })}
      <Txt x={1130} y={880} txt="el hepatocito también los secreta" t={26} p={secreta} color={TXH.hep} />
      <Etiqueta x={1250} y={950} txt="fabrica señuelos para escapar" color="#B8237A" p={escapar} t={28} punta="no" />
    </g>
  );
};

// ─── 2 · Un genoma diminuto con cuatro genes solapados ──────────────────────
const Genoma: Lamina = ({ p, reloj }) => {
  const genoma = p('genoma'), genes = p('genes'), kb = p('kb'), circular = p('circular'), parcial = p('parcial'), completa = p('completa'), incompleta = p('incompleta'), marcos = p('marcos'), env = p('env'), capside = p('capside'), polimerasa = p('polimerasa'), x = p('x'), final = p('final');
  const CX = 520, CY = 530, R = 190;
  const gira = (reloj / 90) % 360;
  const fila = (y: number, tono: readonly string[], txt: string, q: number) => (
    <g opacity={tramo(q, 0, 0.4)}>
      <rect x={1040} y={y - 11} width={44} height={22} rx={11} fill={tono[0]} /><rect x={1038} y={y - 13} width={44} height={22} rx={11} fill={tono[1]} />
    </g>
  );
  return (
    <g>
      <Etiqueta x={CX} y={110} txt="el genoma" color="#2F55E0" p={genoma} t={34} punta="no" />
      <Txt x={CX} y={175} txt="cuatro genes solapados" t={32} p={genes} color={TXH.b} />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#A8BEFF" strokeWidth={8} strokeDasharray="6 16" opacity={0.6 * tramo(genoma, 0, 0.5) * (1 - tramo(circular, 0, 0.5))} />
      {/* la cadena completa y la incompleta */}
      <g transform={`translate(${CX},${CY})`}>
        <circle r={R} fill="none" stroke={H.adn[0]} strokeWidth={18} pathLength={1} strokeDasharray={`${easeOut(circular).toFixed(3)} 1`} transform="rotate(-90) translate(3,6)" opacity={0.7} />
        <circle r={R} fill="none" stroke={H.adn[1]} strokeWidth={14 + 6 * Math.sin(completa * Math.PI)} pathLength={1} strokeDasharray={`${easeOut(circular).toFixed(3)} 1`} transform="rotate(-90)" />
        <path d={`M${Math.cos(0) * (R - 26)},0 A${R - 26},${R - 26} 0 1 1 ${Math.cos(Math.PI * 1.3) * (R - 26)},${Math.sin(Math.PI * 1.3) * (R - 26)}`} fill="none" stroke={H.adn[2]} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(parcial).toFixed(3)} 1`} />
        <path d={`M${Math.cos(Math.PI * 1.3) * (R - 26)},${Math.sin(Math.PI * 1.3) * (R - 26)} A${R - 26},${R - 26} 0 0 1 ${R - 26},0`} fill="none" stroke={H.adn[2]} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" opacity={tramo(incompleta, 0, 0.5)} />
        {/* la polimerasa pegada al extremo de la cadena incompleta */}
        <g transform={`translate(${Math.cos(Math.PI * 1.3) * (R - 26)},${Math.sin(Math.PI * 1.3) * (R - 26)}) scale(${(1.7 * easeBack(clamp(incompleta))).toFixed(3)})`}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /></g>
      </g>
      <Txt x={CX} y={CY} txt="3,2 kb" t={64} p={kb} color={TXH.b} />
      {/* los cuatro marcos de lectura, uno encima de otro */}
      <g transform={`translate(${CX},${CY}) rotate(${gira * 0.02})`}>
        <Arco R={262} a0={20} a1={200} tono={H.b} p={env} />
        <Arco R={292} a0={150} a1={262} tono={H.c} p={capside} />
        <Arco R={322} a0={190} a1={500} tono={H.a} p={polimerasa} />
        <Arco R={352} a0={95} a1={165} tono={H.d} p={x} />
      </g>
      {/* la leyenda */}
      <Etiqueta x={1250} y={250} txt="ADN circular relajado" color="#2F55E0" p={circular} t={28} punta="no" />
      <Etiqueta x={1250} y={315} txt="parcialmente bicatenario" color="#1B36A8" p={parcial} t={28} punta="no" />
      <Txt x={1250} y={380} txt="una cadena completa" t={28} p={completa} color={TXH.b} />
      <Txt x={1250} y={425} txt="y otra incompleta" t={28} p={incompleta} color={TXH.biliI} />
      <Etiqueta x={1250} y={500} txt="marcos de lectura que se superponen" color="#7A55D8" p={marcos} t={26} punta="no" />
      {fila(580, H.b, '', env)}<Txt x={1100} y={580} txt="preS/S: envoltura" t={28} p={env} ancla="start" color={TXH.b} />
      {fila(645, H.c, '', capside)}<Txt x={1100} y={645} txt="preC/C: cápside y HBeAg" t={28} p={capside} ancla="start" color={TXH.c} />
      {fila(710, H.a, '', polimerasa)}<Txt x={1100} y={710} txt="P: polimerasa" t={28} p={polimerasa} ancla="start" color={TXH.a} />
      {fila(775, H.d, '', x)}<Txt x={1100} y={775} txt="X: HBx" t={28} p={x} ancla="start" color={TXH.d} />
      <Txt x={800} y={965} txt="cuatro genes en un mismo círculo" t={36} p={final} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Las proteínas y su oficio ──────────────────────────────────────────
const Proteinas: Lamina = ({ p, reloj }) => {
  const cinco = p('cinco'), hbsag = p('hbsag'), tres = p('tres'), preS1 = p('preS1'), ntcp = p('ntcp'), pequeno = p('pequeno'), vacuna = p('vacuna'), hbcag = p('hbcag'), capsida = p('capsida'), hbeag = p('hbeag'), tolera = p('tolera'), pol = p('pol'), retro = p('retro'), hbx = p('hbx'), activa = p('activa');
  const X = [190, 490, 790, 1090, 1390], Y = 380;
  const pico = (cx: number, alto: number, q: number, col: readonly string[]) => {
    const h = alto * easeOut(clamp(q));
    return (
      <g key={cx}>
        <line x1={cx} x2={cx} y1={Y + 48} y2={Y + 48 - h} stroke={col[0]} strokeWidth={14} strokeLinecap="round" transform="translate(3,3)" opacity={0.7} />
        <line x1={cx} x2={cx} y1={Y + 48} y2={Y + 48 - h} stroke={col[1]} strokeWidth={12} strokeLinecap="round" />
        {h > 6 && <g><circle cx={cx + 2} cy={Y + 48 - h + 2} r={15} fill={col[0]} /><circle cx={cx} cy={Y + 48 - h} r={14} fill={col[2]} /><circle cx={cx - 4} cy={Y + 48 - h - 4} r={4} fill="#FFF" opacity={0.8} /></g>}
      </g>
    );
  };
  const lenta = reloj / 700;
  return (
    <g>
      <Globo x={800} y={90} txt="cinco proteínas, cinco oficios" t={34} p={cinco} colaX={0} />
      {/* 1 · HBsAg en tres tamaños: S, M y L */}
      <g opacity={tramo(hbsag, 0, 0.4)}>
        <rect x={X[0] - 100} y={Y + 48} width={200} height={34} rx={17} fill={H.membrana[0]} transform="translate(3,5)" opacity={0.8} /><rect x={X[0] - 100} y={Y + 48} width={200} height={34} rx={17} fill={H.membrana[1]} />
        {pico(X[0] - 55, 50, hbsag, H.b)}{pico(X[0], 90 * tres, tres, H.b)}{pico(X[0] + 55, 128 * tres, tres, H.b)}
      </g>
      <Etiqueta x={X[0]} y={Y + 150} txt="HBsAg" color="#2F55E0" p={hbsag} t={28} punta="arriba" />
      <Txt x={X[0] - 55} y={Y + 108} txt="S" t={24} p={hbsag} /><Txt x={X[0]} y={Y + 108} txt="M" t={24} p={tres} /><Txt x={X[0] + 55} y={Y + 108} txt="L" t={24} p={tres} />
      <Txt x={X[0]} y={Y + 205} txt="tres tamaños" t={24} p={tres} fuerte={false} />
      {/* 2 · HBcAg forma la cápside */}
      <VirionB x={X[1]} y={Y + 10} k={1.0} reloj={reloj} env={0} capside={capsida} adn={0} o={tramo(capsida, 0, 0.4)} />
      <Etiqueta x={X[1]} y={Y + 150} txt="HBcAg" color="#1B36A8" p={hbcag} t={28} punta="arriba" />
      <Txt x={X[1]} y={Y + 205} txt="forma la cápside" t={24} p={capsida} fuerte={false} />
      {/* 3 · HBeAg: se secreta y tolera */}
      <g opacity={tramo(hbeag, 0, 0.4)}>
        {[0, 1, 2].map((i) => <circle key={i} cx={X[2] + 40 + ((lenta * 60 + i * 34) % 110)} cy={Y + 10 + 5 * Math.sin(lenta * 3 + i)} r={4} fill={H.c[1]} opacity={0.5} />)}
        <circle cx={X[2] + 3} cy={Y + 14} r={54} fill={H.c[0]} /><circle cx={X[2]} cy={Y + 10} r={52} fill={H.c[1]} /><circle cx={X[2] - 16} cy={Y - 6} r={12} fill="#FFF" opacity={0.7} />
        <text x={X[2]} y={Y + 12} dy="0.36em" textAnchor="middle" style={{ fontSize: 62, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>e</text>
      </g>
      <Etiqueta x={X[2]} y={Y + 150} txt="HBeAg" color="#138A3A" p={hbeag} t={28} punta="arriba" />
      <Txt x={X[2]} y={Y + 205} txt="se secreta y tolera" t={24} p={tolera} fuerte={false} />
      <Sale p={tolera} x={X[2]} y={Y + 275} k={0.4}><Linfo reloj={reloj} agotado={0.6} /></Sale>
      {/* 4 · La polimerasa retrotranscribe */}
      <Sale p={pol} x={X[3]} y={Y + 6} k={3}><ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill="#C2540A" /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill="#FF8A1E" /><ellipse cx={-4.5} cy={-3.6} rx={4.4} ry={2.2} fill="#FFF" opacity={0.75} /></Sale>
      <Etiqueta x={X[3]} y={Y + 150} txt="Pol" color="#C2540A" p={pol} t={28} punta="arriba" />
      <g opacity={tramo(retro, 0, 0.4)}>
        <path d={`M${X[3] - 100},${Y + 215} C${X[3] - 80},${Y + 190} ${X[3] - 60},${Y + 240} ${X[3] - 40},${Y + 215}`} fill="none" stroke="#C25A00" strokeWidth={7} strokeLinecap="round" />
        <path d={`M${X[3] - 18},${Y + 215} L${X[3] + 24},${Y + 215}`} stroke="var(--cit-flecha)" strokeWidth={6} strokeLinecap="round" /><polygon points={`${X[3] + 24},${Y + 205} ${X[3] + 40},${Y + 215} ${X[3] + 24},${Y + 225}`} fill="var(--cit-flecha)" />
        <path d={`M${X[3] + 52},${Y + 210} L${X[3] + 110},${Y + 210} M${X[3] + 52},${Y + 222} L${X[3] + 110},${Y + 222}`} stroke={H.adn[1]} strokeWidth={6} strokeLinecap="round" />
      </g>
      <Txt x={X[3]} y={Y + 268} txt="retrotranscribe" t={24} p={retro} fuerte={false} />
      {/* 5 · HBx es el interruptor de la transcripción */}
      <g opacity={tramo(hbx, 0, 0.4)}>
        <rect x={X[4] - 62} y={Y - 20} width={124} height={64} rx={32} fill={H.gris[0]} transform="translate(3,6)" opacity={0.7} />
        <rect x={X[4] - 62} y={Y - 20} width={124} height={64} rx={32} fill={mezcla(H.gris[1], H.verde[1], clamp(activa))} />
        <circle cx={lerp(X[4] - 30, X[4] + 30, easeBack(clamp(activa)))} cy={Y + 12} r={27} fill="#FFF" /><circle cx={lerp(X[4] - 32, X[4] + 28, easeBack(clamp(activa)))} cy={Y + 10} r={22} fill="#F4F0FA" />
      </g>
      <Etiqueta x={X[4]} y={Y + 150} txt="HBx" color="#8A4FE8" p={hbx} t={28} punta="arriba" />
      <Txt x={X[4]} y={Y + 205} txt="activa la transcripción" t={24} p={activa} fuerte={false} />
      {/* abajo: el preS1 se pega a NTCP y la S es la de la vacuna */}
      <g opacity={tramo(preS1, 0, 0.4)}>
        <path d="M110,860 C190,830 250,890 330,860 S470,830 520,860 L520,940 L110,940 Z" fill={H.hep[0]} /><path d="M110,868 C190,838 250,898 330,868 S470,838 520,868 L520,940 L110,940 Z" fill={H.hep[1]} />
      </g>
      <Toro x={390} y={850} k={0.7} tallo={30} tono={H.toro} o={tramo(ntcp, 0, 0.4)} reloj={reloj} tapon={ntcp} />
      <g transform={`translate(390,${(lerp(660, 770, easeOut(ntcp))).toFixed(1)})`} opacity={tramo(preS1, 0.2, 0.6)}>
        <line x1={0} x2={0} y1={0} y2={-120} stroke={H.b[1]} strokeWidth={12} strokeLinecap="round" /><circle cy={-120} r={15} fill={H.b[2]} /><circle cx={-4} cy={-124} r={4} fill="#FFF" opacity={0.8} />
      </g>
      <Etiqueta x={250} y={790} txt="preS1 → NTCP" color="#2F55E0" p={ntcp} t={26} punta="no" />
      <Sale p={vacuna} x={800} y={790} k={0.9}><Jeringa /></Sale>
      <Etiqueta x={800} y={950} txt="la pequeña (S) es la de la vacuna" color="#1FA85A" p={pequeno} t={26} punta="no" />
      <circle cx={X[0] - 55} cy={Y + 20} r={46 * easeOut(pequeno)} fill="none" stroke="#1FA85A" strokeWidth={6} strokeDasharray="10 9" opacity={tramo(pequeno, 0, 0.4)} transform={`rotate(${(reloj / 30) % 360} ${X[0] - 55} ${Y + 20})`} />
    </g>
  );
};

// ─── 4 · El HBeAg: de la cápside a la sangre ────────────────────────────────
const Hbeag: Lamina = ({ p, reloj }) => {
  const hbeag = p('hbeag'), nace = p('nace'), capsida = p('capsida'), tramoExtra = p('tramo'), corta = p('corta'), secreta = p('secreta'), virion = p('virion'), placenta = p('placenta'), tolera = p('tolera'), linfocitos = p('linfocitos'), nacido = p('nacido'), perinatal = p('perinatal'), cronifica = p('cronifica'), siempre = p('siempre');
  const sec = 330 * easeOut(secreta), cae = easeOut(corta);
  return (
    <g>
      <Globo x={800} y={90} txt="¿de dónde sale el HBeAg?" t={34} p={hbeag} colaX={0} />
      {/* la cadena: cola (preC) y cuerpo (cápside) */}
      {Array.from({ length: 12 }, (_, i) => {
        const cola = i < 4;
        const q = cola ? tramoExtra : tramo(nace, i / 16, i / 16 + 0.3);
        const x = 160 + i * 52 + (cola ? -90 * cae : sec), y = 300 + (cola ? -70 * cae : 0) + 4 * Math.sin(reloj / 500 + i);
        const tono = cola ? H.d : H.c;
        return (
          <g key={i} opacity={q * (cola ? 1 - 0.8 * cae : 1)}>
            <circle cx={x + 3} cy={y + 5} r={22} fill="#000" opacity={0.15} /><circle cx={x} cy={y} r={22} fill={tono[0]} /><circle cx={x - 2} cy={y - 2} r={19} fill={tono[1]} /><circle cx={x - 7} cy={y - 8} r={5} fill="#FFF" opacity={0.7} />
          </g>
        );
      })}
      <Etiqueta x={560} y={390} txt="proteína de la cápside" color="#138A3A" p={capsida} t={26} punta="no" />
      <Etiqueta x={240} y={200} txt="tramo extra (preC)" color="#7A55D8" p={tramoExtra} t={26} punta="no" />
      <Tijera x={345} y={300} k={0.9} corta={corta} o={tramo(corta, 0, 0.3) * (1 - 0.7 * tramo(corta, 0.9, 1))} />
      {/* se secreta por la membrana */}
      <path d="M900,190 C880,240 920,270 900,320 S880,380 900,420" fill="none" stroke={H.membrana[0]} strokeWidth={26} strokeLinecap="round" opacity={0.85 * tramo(secreta, 0, 0.3)} />
      <path d="M900,190 C880,240 920,270 900,320 S880,380 900,420" fill="none" stroke={H.membrana[1]} strokeWidth={18} strokeLinecap="round" opacity={0.95 * tramo(secreta, 0, 0.3)} />
      <Txt x={900} y={160} txt="se secreta" t={28} p={secreta} color={TXH.c} />
      <VirionB x={1370} y={300} k={0.5} reloj={reloj} o={tramo(virion, 0, 0.4)} />
      <g opacity={tramo(virion, 0.3, 0.8)}><circle cx={1370} cy={300} r={74} fill="none" stroke="#E5324C" strokeWidth={12} /><path d="M1318,248 L1422,352" stroke="#E5324C" strokeWidth={12} strokeLinecap="round" /></g>
      <Etiqueta x={1370} y={420} txt="no es parte del virión" color="#B8237A" p={virion} t={24} punta="no" />
      {/* madre → placenta → recién nacido */}
      <Sombra><Sale p={placenta} x={230} y={680} k={0.5}><Busto quien="madre" reloj={reloj} fase={0.8} /></Sale></Sombra>
      <Placenta x={620} y={690} k={0.95} o={tramo(placenta, 0, 0.4)} reloj={reloj} />
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((reloj / 3200 + i / 6) % 1);
        return <circle key={i} cx={lerp(340, 940, u)} cy={690 + 22 * Math.sin(u * 9 + i)} r={12} fill={H.c[1]} opacity={Math.sin(u * Math.PI) * tramo(tolera, 0, 0.4)} />;
      })}
      <Etiqueta x={620} y={810} txt="cruza la placenta" color="#C25A5A" p={placenta} t={26} punta="no" />
      <Sombra><Sale p={nacido} x={1030} y={690} k={0.26}><Busto quien="p2" reloj={reloj} fase={1.6} sueno={0.7} /></Sale></Sombra>
      <Sale p={linfocitos} x={1260} y={690} k={0.8}><Linfo reloj={reloj} agotado={0.8 * tolera} /></Sale>
      <Txt x={1260} y={790} txt="tolera a los linfocitos" t={24} p={tolera} color={TXH.cd8} />
      <Txt x={1030} y={790} txt="recién nacido" t={24} p={nacido} />
      <Etiqueta x={560} y={900} txt="VHB perinatal" color="#2F55E0" p={perinatal} t={28} punta="no" />
      <Etiqueta x={950} y={900} txt="se cronifica" color="#E5324C" p={cronifica} t={28} punta="no" />
      <Txt x={1290} y={900} txt="casi siempre" t={34} p={siempre} color={TXH.sangre} />
    </g>
  );
};

// ─── 5 · Diez genotipos ─────────────────────────────────────────────────────
const Genotipos: Lamina = ({ p, reloj }) => {
  const diez = p('diez'), geografia = p('geografia'), peru = p('peru'), f = p('f'), prelim = p('prelim'), pares = p('pares'), progresion = p('progresion'), interferon = p('interferon'), acentos = p('acentos');
  const MX = 800, MY = 470;
  const G: { l: string; lon: number; lat: number; c: readonly string[] }[] = [
    { l: 'A', lon: 22, lat: 4, c: ['#B01E8A', '#E84AC0'] }, { l: 'B', lon: 118, lat: 32, c: ['#1B36A8', '#4F7FF0'] },
    { l: 'C', lon: 104, lat: 18, c: ['#0A7F78', '#10B5A8'] }, { l: 'D', lon: 34, lat: 38, c: ['#C25A00', '#FF8A1E'] },
    { l: 'E', lon: -2, lat: 12, c: ['#8A6A12', '#D4A21E'] }, { l: 'F', lon: -73, lat: -9, c: ['#9E0B2E', '#E3203F'] },
    { l: 'G', lon: -100, lat: 42, c: ['#5A22A8', '#8A4FE8'] }, { l: 'H', lon: -92, lat: 16, c: ['#138A3A', '#3FD467'] },
    { l: 'I', lon: 84, lat: 22, c: ['#B86A00', '#F2A81E'] }, { l: 'J', lon: 138, lat: 37, c: ['#6A9A00', '#A8DC1E'] },
  ];
  const fp = proyecta(-73, -9);
  return (
    <g>
      <Globo x={800} y={90} txt="diez genotipos del virus B" t={34} p={diez} colaX={0} />
      <MapaMundi x={MX} y={MY} p={tramo(diez, 0, 0.5)}>
        {G.map(({ l, lon, lat, c }, i) => {
          const [px, py] = proyecta(lon, lat), q = easeBack(clamp(tramo(diez, 0.2 + i * 0.06, 0.5 + i * 0.06)));
          const salto = -14 * Math.max(0, Math.sin(geografia * Math.PI * 4 - i * 0.7)) * geografia * (1 - geografia * 0.2);
          const esF = l === 'F', pulso = esF ? 1 + 0.12 * f * Math.sin(reloj / 260) : 1;
          return (
            <g key={l} transform={`translate(${px},${py + salto}) scale(${(q * pulso * (esF ? 1 + 0.35 * f : 1)).toFixed(3)})`}>
              <circle cx={3} cy={6} r={22} fill="#000" opacity={0.25} /><circle r={22} fill={c[0]} /><circle cx={-2} cy={-2} r={19} fill={c[1]} /><circle cx={-8} cy={-9} r={5} fill="#FFF" opacity={0.7} />
              <text dy="0.36em" textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{l}</text>
            </g>
          );
        })}
        <circle cx={fp[0]} cy={fp[1]} r={46 * easeOut(peru)} fill="none" stroke="#E3203F" strokeWidth={6} strokeDasharray="10 9" opacity={tramo(peru, 0, 0.4)} transform={`rotate(${(reloj / 30) % 360} ${fp[0]} ${fp[1]})`} />
      </MapaMundi>
      <Txt x={1280} y={110} txt="cada uno con su geografía" t={28} p={geografia} color={TXH.hep} />
      <Etiqueta x={MX + fp[0] - 120} y={MY + fp[1] + 110} txt="Perú: predominaría el F" color="#E3203F" p={f} t={26} punta="no" />
      <Etiqueta x={330} y={850} txt="estudio preliminar" color="#E0A100" p={prelim} t={26} punta="no" />
      <Etiqueta x={330} y={915} txt="sin revisión por pares" color="#B8237A" p={pares} t={26} punta="no" />
      <Colageno x={720} y={830} w={230} h={44} n={4} p={progresion} reloj={reloj} />
      <Txt x={720} y={905} txt="la progresión" t={28} p={progresion} color={TXH.colageno} />
      <Sale p={interferon} x={1060} y={830} k={0.7}><Jeringa /></Sale>
      <Txt x={1060} y={930} txt="la respuesta al interferón" t={28} p={interferon} color={TXH.b} />
      <Txt x={1330} y={880} txt="el mismo virus, muchos acentos" t={30} p={acentos} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Dane, Senuelos, Genoma, Proteinas, Hbeag, Genotipos];
export default LAMINAS;
