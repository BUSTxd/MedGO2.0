'use client';
// Capítulo 11 · Historia natural y fases
//
// La línea de tiempo de la referencia (barra por tramos de color con banderitas y su círculo-icono) y, en cada fase, una escena de un solo
// matiz (como «fases de mejora»): 1 azul (mucho virus, poca guerra), 2 rojo (empieza la guerra), 3 verde (la tregua) y 4 naranja (el virus
// que muta para no dar HBeAg). Después, el corte histológico por el ocular y el paciente 1 que avanza por el mapa.

import type { Lamina } from '../Lienzo';
import { Busto, Etiqueta, Flecha, Globo, Higado, Linfo, Nota, Sale, Sombra, TXH, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo } from '../Piezas';
import { Colageno, Hepatocito, Triada } from '../Higado';
import { BarraLab, Ocular } from '../Clinica';
import { Fact, Visto } from '../Extras';

type P2 = [number, number];
const FASE = ['#2F55E0', '#E5324C', '#1FA85A', '#E8841E', '#8A8496'] as const;

/** Un velo de color que tiñe toda la escena de una fase (una sola tonalidad, como en la referencia de las fases de mejora). */
function Tinte({ c }: { c: string }) {
  return <rect x={0} y={0} width={1600} height={1000} fill={c} opacity={0.1} />;
}

/** La barra de las cinco fases: tramos de color con su círculo-icono arriba; `q` 0-1 de cada tramo; `marca` pone al paciente en un punto (0-4). */
function BarraFases({ y, q, marcador }: { y: number; q: number[]; marcador?: { u: number; o: number } }) {
  const X0 = 120, W = 1360, anchos = [300, 300, 300, 300, 160], ini = [0, 300, 600, 900, 1200];
  const k = 1360 / 1360;
  return (
    <g>
      <rect x={X0 + 5} y={y - 22 + 7} width={W} height={44} rx={22} fill="#000" opacity={0.12} />
      <rect x={X0} y={y - 22} width={W} height={44} rx={22} fill="#FFF" opacity={0.3} />
      {anchos.map((a, i) => (
        <g key={i}>
          <rect x={X0 + ini[i] * k} y={y - 22} width={a * easeOut(clamp(q[i]))} height={44} rx={i === 0 ? 22 : 0} fill={FASE[i]} />
          <circle cx={X0 + (ini[i] + a / 2) * k} cy={y - 74} r={34 * easeBack(clamp(q[i]))} fill={FASE[i]} />
          <circle cx={X0 + (ini[i] + a / 2) * k - 4} cy={y - 78} r={30 * easeBack(clamp(q[i]))} fill="#FFF" opacity={0.22} />
          <text x={X0 + (ini[i] + a / 2) * k} y={y - 74} dy="0.36em" textAnchor="middle" opacity={tramo(q[i], 0.4, 1)} style={{ fontSize: 34, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{i + 1}</text>
        </g>
      ))}
      {marcador && marcador.o > 0.01 && <g transform={`translate(${X0 + marcador.u * 1360},${y + 6})`} opacity={marcador.o}>
        <polygon points="0,-6 -20,-38 20,-38" fill="#FFF" /><polygon points="0,-12 -14,-34 14,-34" fill="#2F55E0" />
      </g>}
    </g>
  );
}

// ─── 0 · Cuatro fases y una más ─────────────────────────────────────────────
const CuatroFases: Lamina = ({ p, reloj }) => {
  const historia = p('historia'), cuatro = p('cuatro'), tabla = p('tabla'), easl = p('easl'), f1 = p('f1'), f2 = p('f2'), f3 = p('f3'), f4 = p('f4'), mas = p('mas'), f5 = p('f5'), resuelta = p('resuelta'), oculta = p('oculta'), recordar = p('recordar');
  return (
    <g>
      <Globo x={800} y={90} txt="la historia natural del virus B" t={34} p={historia} colaX={0} />
      <Txt x={330} y={225} txt="cuatro fases" t={36} p={cuatro} color={TXH.b} />
      <Txt x={1000} y={225} txt="la tabla de" t={28} p={tabla} color={TXH.gris} />
      <Etiqueta x={1190} y={225} txt="EASL 2017" color="#0A7F78" p={easl} t={28} punta="no" />
      <BarraFases y={470} q={[f1, f2, f3, f4, f5]} />
      <Txt x={640} y={225} txt="… y una más" t={32} p={mas} color={TXH.hep} />
      <Etiqueta x={270} y={590} txt="infección crónica" color={FASE[0]} p={f1} t={26} punta="arriba" />
      <Txt x={270} y={650} txt="HBeAg positivo" t={26} p={f1} color={TXH.b} />
      <Etiqueta x={570} y={590} txt="hepatitis crónica" color={FASE[1]} p={f2} t={26} punta="arriba" />
      <Txt x={570} y={650} txt="HBeAg positivo" t={26} p={f2} color={TXH.sangre} />
      <Etiqueta x={870} y={590} txt="infección crónica" color={FASE[2]} p={f3} t={26} punta="arriba" />
      <Txt x={870} y={650} txt="HBeAg negativo" t={26} p={f3} color={TXH.c} />
      <Etiqueta x={1170} y={590} txt="hepatitis crónica" color={FASE[3]} p={f4} t={26} punta="arriba" />
      <Txt x={1170} y={650} txt="HBeAg negativo" t={26} p={f4} color={TXH.a} />
      <Etiqueta x={1400} y={590} txt="HBsAg −" color={FASE[4]} p={f5} t={26} punta="arriba" />
      <Txt x={1400} y={650} txt="resuelta" t={26} p={resuelta} color={TXH.gris} /><Txt x={1400} y={695} txt="u oculta" t={26} p={oculta} color={TXH.gris} />
      <Txt x={800} y={850} txt="recordémoslas" t={44} p={recordar} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Fase 1: mucho virus, poca guerra ───────────────────────────────────
const Fase1: Lamina = ({ p, reloj }) => {
  const fase = p('fase'), tanto = p('tanto'), hbeag = p('hbeag'), antihbe = p('antihbe'), adn = p('adn'), encima = p('encima'), alt = p('alt'), replica = p('replica'), tolera = p('tolera'), nodano = p('nodano');
  return (
    <g>
      <Tinte c={FASE[0]} />
      <Etiqueta x={210} y={110} txt="fase 1" color={FASE[0]} p={fase} t={44} punta="no" />
      <Globo x={860} y={100} txt="¿tanto virus y tan poca guerra?" t={34} p={tanto} colaX={0} />
      <Hepatocito x={470} y={520} k={2.1} reloj={reloj} sem={3} infecta={H.b} brillo={1} o={tramo(tanto, 0, 0.4)} />
      {[[190, 340], [220, 700], [760, 350]].map(([lx, ly], i) => <g key={i}><Linfo x={lx} y={ly} k={0.75} reloj={reloj} fase={i} agotado={0.7 * tolera} activo={0} o={tramo(tolera, i * 0.15, i * 0.15 + 0.4)} /><text x={lx + 44} y={ly - 54 - 6 * Math.sin(reloj / 500 + i)} style={{ fontSize: 36, fontWeight: 800, fill: 'var(--se-ambar)', fontFamily: 'inherit', opacity: tramo(tolera, 0.3, 0.8) }}>z z</text></g>)}
      <Txt x={760} y={470} txt="el sistema inmune lo tolera" t={24} p={tolera} color={TXH.b} />
      {Array.from({ length: 5 }, (_, i) => { const u = ((reloj / 2400 + i / 5) % 1); return <VirionB key={i} x={lerp(520, 800, u)} y={lerp(520, 640 + 80 * (i % 2), u)} k={0.2} reloj={reloj} fase={i} o={Math.sin(u * Math.PI) * tramo(replica, 0, 0.4)} />; })}
      <Txt x={470} y={800} txt="se replica libremente" t={30} p={replica} color={TXH.b} />
      <Fact x={1000} y={290} R={50} tono={H.c} txt="HBeAg" t={22} p={hbeag} />
      <Txt x={1090} y={290} txt="positivo" t={26} p={hbeag} ancla="start" color={TXH.c} />
      <Fact x={1000} y={410} R={50} tono={['#6E6478', '#9C92A8']} txt="anti-HBe" t={20} p={antihbe} />
      <g opacity={tramo(antihbe, 0.3, 0.8)}><path d="M960,370 L1040,450 M1040,370 L960,450" stroke="#E5324C" strokeWidth={10} strokeLinecap="round" /></g>
      <Txt x={1090} y={410} txt="negativo" t={26} p={antihbe} ancla="start" color={TXH.gris} />
      <BarraLab x={1280} y={850} w={90} alto={380} val={0.97} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN" valor="> 10⁷ UI/mL" t={26} />
      <Txt x={1280} y={915} txt="muy alto" t={24} p={encima} color={TXH.b} />
      <BarraLab x={1480} y={850} w={90} alto={380} val={0.08} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="normal" t={26} />
      <Sale p={nodano} x={800} y={850} k={0.42}><Higado corte={false} /></Sale>
      <Visto x={950} y={850} k={0.8} p={nodano} />
      <Txt x={800} y={950} txt="no hay daño hepático" t={30} p={nodano} color={TXH.c} />
    </g>
  );
};

// ─── 2 · Fase 2: empieza la guerra ──────────────────────────────────────────
const Fase2: Lamina = ({ p, reloj }) => {
  const fase = p('fase'), guerra = p('guerra'), cd8 = p('cd8'), atacan = p('atacan'), adn = p('adn'), alt = p('alt'), inflamacion = p('inflamacion'), cirrosis = p('cirrosis'), termina = p('termina'), desaparece = p('desaparece'), aparece = p('aparece'), serocon = p('serocon'), cicatrices = p('cicatrices');
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      <Tinte c={FASE[1]} />
      <Etiqueta x={210} y={110} txt="fase 2" color={FASE[1]} p={fase} t={44} punta="no" />
      <Txt x={760} y={110} txt="empieza la guerra" t={38} p={guerra} color={TXH.sangre} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Linfo x={lerp(900, 640 + i * 10, easeOut(tramo(cd8, i * 0.1, i * 0.1 + 0.7)))} y={310 + i * 160 + 8 * Math.sin(reloj / 400 + i)} k={0.7} reloj={reloj} fase={i * 2} activo={1} o={tramo(cd8, i * 0.1, i * 0.1 + 0.3)} />
          <Hepatocito x={420} y={310 + i * 160} k={0.8} reloj={reloj} fase={i} sem={i + 2} infecta={H.b} brillo={1 - 0.6 * atacan} apop={easeOut(tramo(atacan, i * 0.15, i * 0.15 + 0.7))} o={tramo(guerra, 0, 0.4)} />
        </g>
      ))}
      <Etiqueta x={800} y={200} txt="TCD8" color="#0A7F78" p={cd8} t={28} punta="no" />
      <Txt x={560} y={790} txt="atacan a los hepatocitos infectados" t={26} p={atacan} color={TXH.sangre} />
      <BarraLab x={1130} y={880} w={80} alto={290} val={0.4} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN" valor="baja" t={26} />
      <BarraLab x={1310} y={880} w={80} alto={290} val={0.9} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="sube" t={26} />
      <Sale p={inflamacion} x={1440} y={330} k={0.42}><Higado corte={false} /><ellipse rx={180} ry={110} fill="#E5324C" opacity={0.28} /></Sale>
      <Etiqueta x={1440} y={430} txt="inflamación activa" color="#E5324C" p={inflamacion} t={24} punta="no" />
      <g opacity={tramo(cirrosis, 0, 0.4)}>{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${1440 + nx * 2.4},${330 + ny * 2.4})`}><circle r={13} fill="#8A3A1E" /><circle cx={-1} cy={-2} r={11} fill="#B8602F" /></g>)}</g>
      <Txt x={1440} y={490} txt="riesgo de cirrosis" t={26} p={cirrosis} color={TXH.sangre} />
      {/* la seroconversión */}
      <Txt x={560} y={870} txt="termina cuando el HBeAg desaparece" t={26} p={termina} color={TXH.gris} />
      <Fact x={1000} y={450} R={46} tono={H.c} txt="HBeAg" t={20} p={1} o={tramo(termina, 0, 0.4) * (1 - 0.85 * easeOut(desaparece))} />
      <Fact x={1170} y={450} R={46} tono={H.ac} txt="anti-HBe" t={18} p={aparece} />
      <Flecha a={[1050, 450]} b={[1115, 450]} p={tramo(serocon, 0, 0.8)} color="var(--cit-flecha)" w={8} />
      <Etiqueta x={1085} y={525} txt="seroconversión" color="#8A4FE8" p={serocon} t={26} punta="no" />
      <Colageno x={760} y={950} w={280} h={44} n={4} p={cicatrices} reloj={reloj} />
      <Txt x={1290} y={950} txt="una guerra que puede dejar cicatrices" t={24} p={cicatrices} color={TXH.hep} />
    </g>
  );
};

/** Un hígado en calma con un CD8 relajado a cada lado (la tregua). */
function Levita2({ reloj, p }: { reloj: number; p: number }) {
  const resp = 1 + 0.02 * Math.sin(reloj / 900);
  return (
    <g>
      <Sale p={Math.max(p, 0.001)} x={430} y={520} k={0.85 * resp}><Higado corte={false} /></Sale>
      <Linfo x={200} y={420} k={0.75} reloj={reloj} fase={0.5} activo={0} o={tramo(p, 0, 0.4)} />
      <Linfo x={680} y={420} k={0.75} reloj={reloj} fase={2.5} activo={0} o={tramo(p, 0.1, 0.5)} />
      {[0, 1, 2].map((i) => <VirionB key={i} x={330 + i * 100} y={600 + 20 * Math.sin(i * 2)} k={0.16} reloj={reloj} fase={i} o={tramo(p, 0.2, 0.6)} />)}
    </g>
  );
}

// ─── 3 · Fase 3: la tregua ──────────────────────────────────────────────────
const Fase3: Lamina = ({ p, reloj }) => {
  const tregua = p('tregua'), hbeag = p('hbeag'), antihbe = p('antihbe'), adn = p('adn'), dosmil = p('dosmil'), alt = p('alt'), controla = p('controla'), dano = p('dano'), portador = p('portador');
  return (
    <g>
      <Tinte c={FASE[2]} />
      <Etiqueta x={210} y={110} txt="fase 3" color={FASE[2]} p={tregua} t={44} punta="no" />
      <Txt x={760} y={110} txt="la tregua" t={38} p={tregua} color={TXH.c} />
      <Levita2 reloj={reloj} p={controla} />
      <Fact x={900} y={290} R={50} tono={['#6E6478', '#9C92A8']} txt="HBeAg" t={22} p={hbeag} />
      <g opacity={tramo(hbeag, 0.3, 0.8)}><path d="M860,250 L940,330 M940,250 L860,330" stroke="#E5324C" strokeWidth={10} strokeLinecap="round" /></g>
      <Txt x={990} y={290} txt="negativo" t={26} p={hbeag} ancla="start" color={TXH.gris} />
      <Fact x={900} y={410} R={50} tono={H.ac} txt="anti-HBe" t={20} p={antihbe} />
      <Txt x={990} y={410} txt="positivo" t={26} p={antihbe} ancla="start" color={TXH.ac} />
      <BarraLab x={1230} y={800} w={90} alto={380} val={0.1} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN" valor="< 2 000 UI/mL" t={24} />
      <Txt x={1230} y={870} txt="por debajo de" t={22} p={dosmil} color={TXH.b} />
      <BarraLab x={1440} y={800} w={90} alto={380} val={0.08} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="normal" t={26} />
      <Txt x={420} y={850} txt="el sistema inmune controla al virus" t={28} p={controla} color={TXH.c} />
      <Visto x={420} y={920} k={0.8} p={dano} />
      <Txt x={620} y={925} txt="el daño es mínimo" t={28} p={dano} color={TXH.c} ancla="start" />
      <Etiqueta x={1000} y={600} txt="el antiguo portador inactivo" color="#1FA85A" p={portador} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · Fase 4: el virus cambia para no dar HBeAg ──────────────────────────
const Fase4: Lamina = ({ p, reloj }) => {
  const cambia = p('cambia'), hbeag = p('hbeag'), antihbe = p('antihbe'), adn = p('adn'), alt = p('alt'), fluctuante = p('fluctuante'), muto = p('muto'), precore = p('precore'), promotor = p('promotor'), producir = p('producir'), esconde = p('esconde'), detiene = p('detiene');
  const GX = 470, GY = 540, R = 200;
  const rad = (g: number) => (g * Math.PI) / 180;
  const destello = (ang: number, q: number, col: string) => <g opacity={tramo(q, 0, 0.3) * (0.7 + 0.3 * onda(reloj, 300))} transform={`translate(${GX + Math.cos(rad(ang)) * R},${GY + Math.sin(rad(ang)) * R})`}>
    {[0, 45, 90, 135].map((a) => <line key={a} x1={-28} x2={28} y1={0} y2={0} stroke={col} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} />)}<circle r={10} fill="#FFF" />
  </g>;
  return (
    <g>
      <Tinte c={FASE[3]} />
      <Etiqueta x={210} y={110} txt="fase 4" color={FASE[3]} p={cambia} t={44} punta="no" />
      <Txt x={780} y={110} txt="el virus cambia" t={38} p={cambia} color={TXH.a} />
      {/* el genoma con la mutación */}
      <circle cx={GX} cy={GY} r={R} fill="none" stroke={H.adn[0]} strokeWidth={22} opacity={0.7 * tramo(muto, 0, 0.5)} transform="translate(3,6)" />
      <circle cx={GX} cy={GY} r={R} fill="none" stroke={H.adn[1]} strokeWidth={20} opacity={tramo(muto, 0, 0.5)} />
      <VirionB x={GX} y={GY} k={0.9} reloj={reloj} o={tramo(muto, 0, 0.4)} />
      {destello(-120, precore, '#FFC81E')}{destello(-50, promotor, '#FF8A1E')}
      <Etiqueta x={GX - 230} y={GY - 270} txt="gen precore" color="#C79A00" p={precore} t={26} punta="no" />
      <Etiqueta x={GX + 230} y={GY - 250} txt="promotor del core" color="#C25A00" p={promotor} t={26} punta="no" />
      <Txt x={GX} y={GY + 290} txt="una mutación" t={30} p={muto} color={TXH.a} />
      <Fact x={1000} y={300} R={50} tono={['#6E6478', '#9C92A8']} txt="HBeAg" t={22} p={hbeag} />
      <g opacity={tramo(producir, 0, 0.5)}><path d="M960,260 L1040,340 M1040,260 L960,340" stroke="#E5324C" strokeWidth={10} strokeLinecap="round" /></g>
      <Txt x={1090} y={300} txt="negativo" t={26} p={hbeag} ancla="start" color={TXH.gris} />
      <Txt x={1090} y={350} txt="deja de producirlo" t={24} p={producir} ancla="start" color={TXH.a} />
      <Fact x={1000} y={450} R={50} tono={H.ac} txt="anti-HBe" t={20} p={antihbe} />
      <Txt x={1090} y={450} txt="positivo" t={26} p={antihbe} ancla="start" color={TXH.ac} />
      <BarraLab x={1230} y={850} w={90} alto={330} val={0.5} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN" valor="> 2 000" t={26} />
      <BarraLab x={1440} y={850} w={90} alto={330} val={0.7 + 0.2 * Math.sin(reloj / 700)} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="elevada" t={26} />
      <Txt x={1335} y={470} txt="fluctuante" t={26} p={fluctuante} color={TXH.kupffer} />
      <Txt x={560} y={940} txt="se esconde," t={34} p={esconde} color={TXH.hep} />
      <Txt x={1000} y={940} txt="pero no se detiene" t={34} p={detiene} color={TXH.sangre} />
    </g>
  );
};

// ─── 5 · La histología de la hepatitis B crónica ────────────────────────────
const HistoB: Lamina = ({ p, reloj }) => {
  const microscopio = p('microscopio'), hepatocitos = p('hepatocitos'), vidrio = p('vidrio'), citoplasma = p('citoplasma'), reticulo = p('reticulo'), repleto = p('repleto'), caracteristicos = p('caracteristicos'), patog = p('patog'), otras = p('otras'), nucleos = p('nucleos'), interfase = p('interfase'), fibrosis = p('fibrosis'), pista = p('pista'), firma = p('firma');
  const CX = 500, CY = 500;
  return (
    <g>
      <Ocular x={CX} y={CY} R={330} id="hv-o11" reloj={reloj} o={tramo(microscopio, 0, 0.4)}>
        {Array.from({ length: 13 }, (_, i) => {
          const a = (i / 13) * 6.28 + 0.1, d = 60 + 190 * hash(i, 4) + (i % 3) * 20;
          const esVidrio = i % 2 === 0;
          return <Hepatocito key={i} x={CX + Math.cos(a) * d} y={CY + Math.sin(a) * d * 0.9} k={0.5} reloj={reloj} fase={i} sem={i + 1} vidrio={esVidrio ? vidrio : 0} o={tramo(hepatocitos, i / 20, i / 20 + 0.3)} />;
        })}
        {/* núcleos arenosos: granitos finos dentro de algunos núcleos */}
        {[[CX - 60, CY - 20], [CX + 110, CY + 70], [CX - 10, CY + 150]].map(([nx, ny], i) => <g key={i} opacity={tramo(nucleos, i * 0.2, i * 0.2 + 0.4)}>{Array.from({ length: 14 }, (_, j) => <circle key={j} cx={nx + (hash(j, i + 20) - 0.5) * 30} cy={ny + (hash(j, i + 30) - 0.5) * 30} r={2.4} fill="#FFF" opacity={0.85} />)}</g>)}
        <g opacity={tramo(interfase, 0, 0.5)}><Triada x={CX + 150} y={CY - 150} k={0.4} reloj={reloj} />{[0, 1, 2, 3].map((i) => <Linfo key={i} x={CX + 90 + i * 34} y={CY - 90 + 10 * (i % 2)} k={0.2} reloj={reloj} fase={i} activo={0.4} receptores={4} />)}</g>
      </Ocular>
      <Etiqueta x={1190} y={190} txt="hepatocitos en vidrio esmerilado" color="#7A55D8" p={vidrio} t={26} punta="no" />
      <Txt x={1190} y={255} txt="citoplasma pálido y homogéneo" t={26} p={citoplasma} color={TXH.d} />
      <Txt x={1190} y={310} txt="por el retículo liso" t={26} p={reticulo} color={TXH.d} />
      <Txt x={1190} y={360} txt="repleto de HBsAg" t={26} p={repleto} color={TXH.b} />
      <Etiqueta x={1190} y={450} txt="característicos," color="#1FA85A" p={caracteristicos} t={28} punta="no" />
      <Etiqueta x={1190} y={515} txt="no patognomónicos" color="#E8841E" p={patog} t={28} punta="no" />
      <Txt x={1190} y={575} txt="también con otras causas" t={24} p={otras} color={TXH.gris} />
      <Txt x={1190} y={640} txt="núcleos «arenosos» (HBcAg)" t={26} p={nucleos} color={TXH.hep} />
      <Txt x={1190} y={690} txt="hepatitis de interfase" t={26} p={interfase} color={TXH.sangre} />
      <Colageno x={1190} y={760} w={260} h={44} n={4} p={fibrosis} reloj={reloj} />
      <Txt x={1190} y={820} txt="y fibrosis" t={26} p={fibrosis} color={TXH.colageno} />
      <Etiqueta x={1190} y={900} txt="una pista casi de firma" color="#B8237A" p={pista} t={28} punta="no" />
      <Sale p={firma} x={480} y={920}><Visto x={0} y={0} k={0.9} p={1} /></Sale>
      <Txt x={640} y={920} txt="la firma de la hepatitis B" t={28} p={firma} color={TXH.hep} ancla="start" />
    </g>
  );
};

// ─── 6 · El paciente 1 en el mapa ───────────────────────────────────────────
const MapaPaciente: Lamina = ({ p, reloj }) => {
  const paciente = p('paciente'), empezo = p('empezo'), consulta = p('consulta'), pasando = p('pasando'), desde = p('desde'), easl = p('easl'), decide = p('decide'), adn = p('adn'), alt = p('alt'), fibrosis = p('fibrosis'), riesgo = p('riesgo'), explican = p('explican'), decision = p('decision'), brote = p('brote');
  const u = lerp(0.1, 0.33, easeOut(pasando)) * 1.0 + 0;
  return (
    <g>
      <Etiqueta x={420} y={110} txt="el paciente 1" color="#2F55E0" p={paciente} t={36} punta="no" />
      <BarraFases y={400} q={[1, 1, 1, 1, 1].map((q) => q * tramo(paciente, 0, 0.5))} marcador={{ u: u, o: tramo(empezo, 0, 0.4) }} />
      <Sombra><Sale p={empezo} x={lerp(300, 560, easeOut(pasando))} y={560} k={0.36}><Busto quien="p1" reloj={reloj} fase={0.5} /></Sale></Sombra>
      <Etiqueta x={300} y={720} txt="empezó en la fase 1" color={FASE[0]} p={empezo} t={26} punta="no" />
      <Etiqueta x={620} y={780} txt="primera consulta" color="#E8841E" p={consulta} t={26} punta="no" />
      <Txt x={620} y={835} txt="pasando a la fase 2" t={26} p={pasando} color={TXH.sangre} />
      {/* desde 2025, EASL decide por ADN, ALT, fibrosis y riesgo */}
      <Etiqueta x={1180} y={560} txt="desde 2025: EASL" color="#0A7F78" p={desde} t={28} punta="no" />
      <Txt x={1180} y={620} txt="ya no decide por fase" t={26} p={decide} color={TXH.gris} />
      <Txt x={1180} y={680} txt="sino por…" t={26} p={easl} color={TXH.gris} />
      <BarraLab x={1000} y={900} w={46} alto={140} val={0.8} max={1} color="#4F7FF0" oscuro="#1E4FC0" p={adn} nombre="ADN" valor="" t={22} />
      <BarraLab x={1110} y={900} w={46} alto={140} val={0.5} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="" t={22} />
      <Colageno x={1260} y={850} w={150} h={34} n={3} p={fibrosis} reloj={reloj} />
      <Txt x={1260} y={905} txt="fibrosis" t={22} p={fibrosis} color={TXH.colageno} />
      <Etiqueta x={1440} y={850} txt="riesgo" color="#E5324C" p={riesgo} t={26} punta="no" />
      <Txt x={560} y={915} txt="las fases explican la historia" t={30} p={explican} color={TXH.hep} />
      <Txt x={560} y={960} txt="la decisión mira el riesgo" t={30} p={decision} color={TXH.sangre} />
      <Etiqueta x={1380} y={160} txt="ahora, el brote" color="#B8237A" p={brote} t={36} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [CuatroFases, Fase1, Fase2, Fase3, Fase4, HistoB, MapaPaciente];
export default LAMINAS;
