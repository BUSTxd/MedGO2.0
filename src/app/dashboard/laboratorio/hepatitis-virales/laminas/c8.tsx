'use client';
// Capítulo 8 · El ciclo del VHB y el cccDNA
//
// La alfombra magenta de la referencia «membrana celular» con sus toros-receptor; el virus que se engancha a los hilos y después a la llave;
// la célula cortada (membrana que ondula, núcleo con poros) por la que viaja la cápside; el núcleo visto de cerca, con el cccDNA como un
// anillo de cuentas (nucleosomas) que no se borra, el freno Smc5/6 que HBx manda al proteasoma y los ARN que salen del molde.

import type { Lamina } from '../Lienzo';
import { CelulaCorte, Proteasoma, Ubi, Zoom } from '../../sepsis/Piezas';
import { Tijera } from '../../bilirrubina/Piezas';
import { Anticuerpo, Capsula, Etiqueta, Flecha, Globo, Reloj, Sale, Subviral, TXH, Toro, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Trabaja } from '../Extras';

const SOBRE_CEL = { hep: '#8A1E3C', b: '#1B36A8', d: '#4A1E8E', kup: '#7A4A00' } as const; // el cuerpo de CelulaCorte es siempre rosa claro: el texto encima va oscuro en los dos temas

type P2 = [number, number];
const bez = (a: P2, c: P2, b: P2, u: number): P2 => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];

/** Un frijolito (enzima) con su brillo. */
function Bean({ x, y, k = 1, o = 1, r = 0, tono }: { x: number; y: number; k?: number; o?: number; r?: number; tono: readonly string[] }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <ellipse cx={3} cy={4} rx={13} ry={9} fill="#000" opacity={0.14} /><ellipse rx={13} ry={9} fill={tono[0]} /><ellipse cx={-1} cy={-1} rx={11.5} ry={7.6} fill={tono[1]} /><ellipse cx={-4.5} cy={-3.6} rx={4.4} ry={2.2} fill="#FFF" opacity={0.75} />
    </g>
  );
}

/** El núcleo visto de cerca: esfera índigo con su envoltura y grumos de cromatina. */
function Nucleo({ x, y, R = 330, o = 1, reloj = 0 }: { x: number; y: number; R?: number; o?: number; reloj?: number }) {
  if (o <= 0.003) return null;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <circle cx={x + 8} cy={y + 12} r={R} fill="#000" opacity={0.18} />
      <circle cx={x} cy={y} r={R + 18} fill={H.nucleo[0]} opacity={0.45} />
      <circle cx={x} cy={y} r={R} fill={H.nucleo[0]} /><circle cx={x - 8} cy={y - 8} r={R - 16} fill={H.nucleo[1]} />
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={x + (hash(i, 3) - 0.5) * R * 1.5 + 5 * Math.sin(reloj / 1800 + i)} cy={y + (hash(i, 4) - 0.5) * R * 1.5} r={8 + hash(i, 5) * 14} fill={H.nucleo[2]} opacity={0.28} />)}
      <path d={`M${x - R * 0.7},${y - R * 0.35} A${R * 0.78},${R * 0.78} 0 0 1 ${x - R * 0.18},${y - R * 0.76}`} fill="none" stroke="#FFF" strokeWidth={10} strokeLinecap="round" opacity={0.25} />
    </g>
  );
}

/** El cccDNA: un anillo de ADN envuelto en nucleosomas (cuentas). `brillo` 0-1 lo enciende; `silencio` 0-1 lo apaga y lo grisea. */
function AnilloC({ x, y, R = 150, n = 10, brillo = 1, silencio = 0, reloj = 0, o = 1, p = 1 }: { x: number; y: number; R?: number; n?: number; brillo?: number; silencio?: number; reloj?: number; o?: number; p?: number }) {
  if (p <= 0.003 || o <= 0.003) return null;
  const luz = clamp(brillo) * (1 - 0.7 * clamp(silencio));
  return (
    <g opacity={(o < 1 ? o : 1) * tramo(p, 0, 0.4)}>
      <circle cx={x} cy={y} r={R + 44} fill="#FFE98A" opacity={0.28 * luz * (0.7 + 0.3 * onda(reloj, 900))} />
      <circle cx={x + 3} cy={y + 6} r={R} fill="none" stroke={H.adn[0]} strokeWidth={14} opacity={0.7} />
      <circle cx={x} cy={y} r={R} fill="none" stroke={silencio > 0.5 ? '#9C92A8' : H.adn[1]} strokeWidth={12} pathLength={1} strokeDasharray={`${easeOut(clamp(p)).toFixed(3)} 1`} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 6.28 - 1.57, q = tramo(p, 0.3 + i / (n * 2), 0.6 + i / (n * 2));
        return (
          <g key={i} transform={`translate(${x + Math.cos(a) * R},${y + Math.sin(a) * R}) scale(${(q * (1 + 0.04 * onda(reloj, 1400, i))).toFixed(3)})`}>
            <circle cx={3} cy={4} r={25} fill="#000" opacity={0.18} /><circle r={25} fill={silencio > 0.5 ? '#6E6478' : H.prot[0]} /><circle cx={-2} cy={-2} r={22} fill={silencio > 0.5 ? '#9C92A8' : H.prot[1]} /><circle cx={-8} cy={-9} r={6} fill="#FFF" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
}

/** Un ARN: una línea ondulada con su capuchón, que se dibuja con `p`. */
function ARN({ a, b, amp = 14, ondas = 4, color, p, w = 8, cap = true }: { a: P2; b: P2; amp?: number; ondas?: number; color: string; p: number; w?: number; cap?: boolean }) {
  if (p <= 0.003) return null;
  const n = 30, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const pts = Array.from({ length: n + 1 }, (_, i) => { const u = i / n, s = Math.sin(u * ondas * 6.28) * amp; return `${(a[0] + dx * u + nx * s).toFixed(1)},${(a[1] + dy * u + ny * s).toFixed(1)}`; });
  return (
    <g>
      <path d={'M' + pts.join(' L')} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${easeOut(clamp(p)).toFixed(3)} 1`} />
      {cap && <circle cx={a[0]} cy={a[1]} r={w * 1.1} fill={color} opacity={tramo(p, 0, 0.2)} />}
    </g>
  );
}

// ─── 0 · Primero el hilo, después la llave ──────────────────────────────────
const Entrada: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), engancha = p('engancha'), hspg = p('hspg'), dominio = p('dominio'), miristato = p('miristato'), une = p('une'), ntcp = p('ntcp'), hilo = p('hilo'), llave = p('llave');
  const e1 = easeOut(engancha), e2 = easeOut(une);
  const vx = lerp(lerp(600, 440, e1), 1180, e2), vy = lerp(lerp(250, 585, e1), 664, e2) + (1 - e2) * e1 * 14 * Math.sin(reloj / 380) - 34 * Math.sin(e2 * Math.PI);
  const colina = 'M0,1000 L0,800 C120,740 220,740 320,790 S520,850 640,780 S840,730 960,785 S1160,845 1280,775 S1480,740 1600,790 L1600,1000 Z';
  return (
    <g>
      <Globo x={800} y={90} txt="¿cómo entra el virus B a un hepatocito?" t={34} p={pregunta} colaX={0} />
      <path d={colina} fill={H.membrana[0]} transform="translate(0,10)" /><path d={colina} fill={H.membrana[1]} />
      <path d="M0,830 C140,790 240,810 340,850 S560,890 700,830 S900,790 1020,840 S1240,890 1380,830 S1540,800 1600,830 L1600,1000 L0,1000 Z" fill={H.membrana[0]} opacity={0.5} />
      {/* los hilos: proteoglucanos de heparán sulfato */}
      {[250, 330, 410, 490, 570, 650].map((hx, i) => {
        const bend = (e1 * 18 * Math.sin(i + 1)) + 7 * Math.sin(reloj / 520 + i);
        const d = `M${hx},800 q${22 + bend},-52 ${-10 + bend},-96 q${-22 - bend},-34 ${14 + bend},-66`;
        return <path key={i} d={d} fill="none" stroke="#FFD23F" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(hspg).toFixed(3)} 1`} />;
      })}
      <Etiqueta x={450} y={900} txt="hilos: proteoglucanos de heparán sulfato" color="#C79A00" p={hspg} t={26} punta="no" />
      {/* las llaves: NTCP, toros naranja sobre tallos fucsia que bombean ácidos biliares */}
      {[1050, 1180, 1310].map((tx, i) => <Toro key={i} x={tx} y={772 - 6 * (i % 2)} k={1.0} tallo={62} tono={H.toro} reloj={reloj} bombea={ntcp} o={tramo(une, 0, 0.5)} />)}
      <Etiqueta x={1180} y={900} txt="NTCP: la llave" color="#C77800" p={ntcp} t={28} punta="no" />
      {/* el virus */}
      <VirionB x={vx} y={vy} k={0.85} reloj={reloj} o={tramo(pregunta, 0, 0.4)} />
      <Etiqueta x={460} y={330} txt="se engancha, con poca fuerza" color="#C25A00" p={engancha} t={26} punta="no" />
      <Zoom x={1380} y={270} R={135} de={[vx + 40, vy - 40]} p={dominio} fondo="#EAF2FF">
        <line x1={1350} y1={380} x2={1350} y2={240} stroke={H.b[1]} strokeWidth={16} strokeLinecap="round" />
        <circle cx={1350} cy={232} r={22} fill={H.b[2]} /><circle cx={1343} cy={225} r={6} fill="#FFF" opacity={0.8} />
        <path d="M1350,370 q-34,10 -22,34 q12,22 -16,38 q-26,16 -6,38" fill="none" stroke="#FF8A1E" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(miristato).toFixed(3)} 1`} />
      </Zoom>
      <Etiqueta x={1380} y={445} txt="preS1 del HBsAg grande" color="#2F55E0" p={dominio} t={26} punta="no" />
      <Etiqueta x={1380} y={505} txt="+ miristato (ácido graso)" color="#C25A00" p={miristato} t={26} punta="no" />
      <Txt x={700} y={215} txt="primero el hilo, después la llave" t={34} p={llave} color={TXH.hep} />
      <Txt x={700} y={262} txt="una unión débil y luego una unión fuerte" t={24} p={hilo} fuerte={false} />
    </g>
  );
};

// ─── 1 · NTCP: la puerta de la bilis ────────────────────────────────────────
const Puerta: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), toma = p('toma'), acidos = p('acidos'), sangre = p('sangre'), usa = p('usa'), puerta = p('puerta'), solo = p('solo'), hepatocitos = p('hepatocitos'), bloquear = p('bloquear'), terapeutica = p('terapeutica'), entrada = p('entrada');
  const colina = 'M0,1000 L0,700 C140,650 260,650 380,700 S640,750 780,690 S1000,640 1140,700 S1400,750 1600,690 L1600,1000 Z';
  const rebote = 40 * Math.max(0, Math.sin(reloj / 420)) * easeOut(bloquear);
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué hace normalmente la NTCP?" t={34} p={pregunta} colaX={0} />
      {/* arriba, la sangre; abajo, el hepatocito */}
      <rect x={0} y={170} width={1600} height={250} fill="#E3203F" opacity={0.14 * tramo(sangre, 0, 0.5)} />
      <Etiqueta x={200} y={230} txt="sangre" color="#E3203F" p={sangre} t={28} punta="no" />
      <path d={colina} fill={H.membrana[0]} transform="translate(0,10)" /><path d={colina} fill={H.membrana[1]} />
      <Etiqueta x={200} y={900} txt="hepatocito" color="#B8237A" p={hepatocitos} t={28} punta="no" />
      <Toro x={480} y={700} k={1.5} tallo={90} tono={H.toro} reloj={reloj} bombea={toma} o={tramo(toma, 0, 0.4)} />
      {Array.from({ length: 5 }, (_, i) => {
        const u = ((reloj / 2600 + i / 5) % 1);
        return <circle key={i} cx={480 + 8 * Math.sin(u * 9 + i)} cy={lerp(280, 880, u)} r={13} fill={H.bilis[1]} opacity={Math.sin(u * Math.PI) * tramo(acidos, 0, 0.4)} />;
      })}
      <Etiqueta x={480} y={560} txt="NTCP toma ácidos biliares" color="#C77800" p={toma} t={26} punta="no" />
      <Txt x={650} y={330} txt="ácidos biliares" t={26} p={acidos} color={TXH.bilis} />
      {/* el virus usa la misma puerta */}
      <Toro x={1130} y={700} k={1.5} tallo={90} tono={H.toro} reloj={reloj} tapon={bloquear} o={tramo(usa, 0, 0.4)} />
      <VirionB x={1130 + 10 * onda(reloj, 700)} y={lerp(380, 560, easeOut(puerta)) - rebote} k={0.75} reloj={reloj} o={tramo(usa, 0, 0.4) * (1 - 0.3 * bloquear)} />
      <Etiqueta x={1130} y={250} txt="el virus usa ese transportador" color="#2F55E0" p={usa} t={26} punta="no" />
      <Etiqueta x={1130} y={880} txt="una puerta de bilis" color="#C77800" p={puerta} t={28} punta="no" />
      <Txt x={880} y={450} txt="solo hepatocitos" t={30} p={solo} color={TXH.hep} />
      {/* bloquearla es una estrategia terapéutica */}
      <Sale p={bloquear} x={1400} y={470}><Capsula k={1.5} reloj={reloj} /></Sale>
      <g opacity={tramo(bloquear, 0.4, 1)}><path d="M1080,520 L1180,620 M1180,520 L1080,620" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" /></g>
      <Etiqueta x={1400} y={560} txt="bloquear la NTCP" color="#8A4FE8" p={bloquear} t={26} punta="no" />
      <Etiqueta x={1400} y={620} txt="estrategia terapéutica" color="#1FA85A" p={terapeutica} t={26} punta="no" />
      <Txt x={800} y={965} txt="una puerta de bilis, usada como entrada" t={34} p={entrada} color="#FFF" />
    </g>
  );
};

// ─── 2 · Adentro: endocitosis y viaje ───────────────────────────────────────
const Adentro: Lamina = ({ p, reloj }) => {
  const engulle = p('engulle'), endocitosis = p('endocitosis'), endosoma = p('endosoma'), pierde = p('pierde'), suelta = p('suelta'), citoplasma = p('citoplasma'), viaja = p('viaja'), microtubulos = p('microtubulos'), nucleo = p('nucleo'), desnuda = p('desnuda'), disfraza = p('disfraza'), desnuda2 = p('desnuda2');
  const E: P2 = [500, 194], I: P2 = [500, 270], C: P2 = [420, 430], N: P2 = [652, 533];
  const a = easeOut(endocitosis), b = easeOut(viaja);
  const pos: P2 = b > 0.001 ? bez(I, C, N, b) : [lerp(E[0], I[0], a), lerp(90, I[1], a) - 0 * a];
  const posY = b > 0.001 ? pos[1] : lerp(90, I[1], a);
  return (
    <g>
      <CelulaCorte x={800} y={560} w={1440} h={860} nucleoY={180} nucleoR={250} reloj={reloj} />
      {/* el hoyo de la membrana */}
      <path d={`M${E[0] - 40},${E[1] - 8} Q${E[0]},${E[1] + 90 * easeOut(engulle)} ${E[0] + 40},${E[1] - 8}`} fill="#7A1260" opacity={0.7 * tramo(engulle, 0, 0.4)} />
      {/* el microtúbulo */}
      <path d={`M${I[0]},${I[1]} Q${C[0]},${C[1]} ${N[0]},${N[1]}`} fill="none" stroke="#C9C2D6" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(microtubulos).toFixed(3)} 1`} opacity={0.9} />
      {Array.from({ length: 6 }, (_, i) => { const q = bez(I, C, N, ((reloj / 2600 + i / 6) % 1)); return <circle key={i} cx={q[0]} cy={q[1]} r={5} fill="#FFF" opacity={0.7 * tramo(microtubulos, 0.4, 1)} />; })}
      {/* el endosoma y el virus (pierde la envoltura, suelta la cápside) */}
      <circle cx={pos[0]} cy={posY} r={64} fill="#8FB4E8" opacity={0.5 * tramo(endosoma, 0, 0.4) * (1 - tramo(suelta, 0, 0.7))} />
      <circle cx={pos[0]} cy={posY} r={64} fill="none" stroke="#3E6FC0" strokeWidth={6} opacity={0.8 * tramo(endosoma, 0, 0.4) * (1 - tramo(suelta, 0, 0.7))} />
      <VirionB x={pos[0]} y={posY} k={0.5} reloj={reloj} env={1 - easeOut(pierde)} espiculas={1 - easeOut(pierde)} capside={1} adn={1} o={tramo(endocitosis, 0, 0.15)} />
      {/* los rótulos */}
      <Etiqueta x={250} y={150} txt="la célula lo engulle" color="#B8237A" p={engulle} t={26} punta="no" />
      <Etiqueta x={250} y={260} txt="endocitosis" color="#7A55D8" p={endocitosis} t={26} punta="no" />
      <Etiqueta x={250} y={370} txt="endosoma" color="#3E6FC0" p={endosoma} t={26} punta="no" />
      <Etiqueta x={1180} y={250} txt="pierde la envoltura" color="#2F55E0" p={pierde} t={26} punta="no" />
      <Etiqueta x={1180} y={330} txt="suelta la nucleocápside" color="#1B36A8" p={suelta} t={26} punta="no" />
      <Txt x={1180} y={410} txt="en el citoplasma" t={26} p={citoplasma} color={SOBRE_CEL.hep} />
      <Etiqueta x={250} y={500} txt="microtúbulos" color="#6E6478" p={microtubulos} t={26} punta="no" />
      <Etiqueta x={800} y={880} txt="núcleo" color="#4A2A9E" p={nucleo} t={30} punta="no" />
      <Txt x={1230} y={640} txt="se desnuda justo antes de llegar" t={26} p={desnuda} color={SOBRE_CEL.b} />
      <Txt x={1230} y={760} txt="primero se disfraza," t={34} p={disfraza} color={SOBRE_CEL.hep} />
      <Txt x={1230} y={815} txt="luego se desnuda" t={34} p={desnuda2} color={SOBRE_CEL.hep} />
    </g>
  );
};

// ─── 3 · El poro nuclear y el nacimiento del cccDNA ─────────────────────────
const Poro: Lamina = ({ p, reloj }) => {
  const puerta = p('puerta'), ancla = p('ancla'), suelta = p('suelta'), enzimas = p('enzimas'), completan = p('completan'), cierran = p('cierran'), nace = p('nace'), minicromosoma = p('minicromosoma'), nucleosomas = p('nucleosomas'), volvio = p('volvio');
  const N: P2 = [652, 533], CX = 800, CY = 750, R = 125;
  const rad = (g: number) => (g * Math.PI) / 180;
  const arcoInc = (fin: number) => `M${CX + Math.cos(rad(-60)) * (R - 22)},${CY + Math.sin(rad(-60)) * (R - 22)} A${R - 22},${R - 22} 0 ${fin > 180 ? 1 : 0} 1 ${CX + Math.cos(rad(-60 + fin)) * (R - 22)},${CY + Math.sin(rad(-60 + fin)) * (R - 22)}`;
  const brecha = 150 * (1 - easeOut(completan));
  return (
    <g>
      <CelulaCorte x={800} y={560} w={1440} h={860} nucleoY={180} nucleoR={250} reloj={reloj} />
      <circle cx={N[0]} cy={N[1]} r={30 + 8 * onda(reloj, 700)} fill="none" stroke="#FFE98A" strokeWidth={7} opacity={0.9 * tramo(puerta, 0, 0.4)} />
      <Etiqueta x={400} y={440} txt="la puerta del núcleo" color="#C79A00" p={puerta} t={26} punta="no" />
      <VirionB x={lerp(600, N[0] - 6, easeOut(ancla))} y={lerp(380, N[1] - 36, easeOut(ancla))} k={0.5} reloj={reloj} env={0} capside={1} adn={1 - tramo(suelta, 0.2, 0.8)} o={tramo(ancla, 0, 0.3) * (1 - 0.6 * tramo(suelta, 0.6, 1))} />
      <Etiqueta x={400} y={330} txt="la nucleocápside se ancla" color="#1B36A8" p={ancla} t={26} punta="no" />
      {/* el ADN entra y se arregla dentro del núcleo */}
      <g opacity={tramo(suelta, 0, 0.5)}>
        <circle cx={CX + 3} cy={CY + 6} r={R} fill="none" stroke={H.adn[0]} strokeWidth={14} opacity={0.7} /><circle cx={CX} cy={CY} r={R} fill="none" stroke={H.adn[1]} strokeWidth={12} />
        <path d={arcoInc(150 + 150 * easeOut(completan) + 60 * easeOut(cierran))} fill="none" stroke={H.adn[2]} strokeWidth={11} strokeLinecap="round" opacity={0.95} />
        {brecha > 3 && <path d={arcoInc(0.1)} fill="none" />}
        {brecha > 3 && <circle cx={CX + Math.cos(rad(-60 + 150 + (150 - brecha))) * (R - 22)} cy={CY + Math.sin(rad(-60 + 150 + (150 - brecha))) * (R - 22)} r={9} fill="#FFC81E" />}
      </g>
      <Etiqueta x={1330} y={520} txt="suelta el ADN dentro" color="#C79A00" p={suelta} t={26} punta="no" />
      {[0, 1, 2].map((i) => {
        const q = easeOut(tramo(enzimas, i * 0.1, i * 0.1 + 0.5)), a = rad(-60 + 150 + i * 50 * easeOut(completan));
        return <Bean key={i} x={lerp(CX + 190 + i * 30, CX + Math.cos(a) * (R - 22), q) + 4 * Math.sin(reloj / 400 + i)} y={lerp(CY - 40 + i * 30, CY + Math.sin(a) * (R - 22), q)} k={1.5} r={i * 50} tono={['#FFC81E', '#FFF0A0']} o={tramo(enzimas, i * 0.1, i * 0.1 + 0.3) * (1 - 0.8 * tramo(cierran, 0.5, 1))} />;
      })}
      <Etiqueta x={1330} y={600} txt="enzimas de reparación del huésped" color="#5A22A8" p={enzimas} t={22} punta="no" />
      <Txt x={1270} y={660} txt="completan la cadena incompleta" t={24} p={completan} color={SOBRE_CEL.d} />
      <Txt x={1270} y={705} txt="y cierran el círculo" t={24} p={cierran} color={SOBRE_CEL.d} />
      <circle cx={CX} cy={CY} r={R + 40 + 6 * onda(reloj, 800)} fill="#FFE98A" opacity={0.3 * tramo(nace, 0, 0.5)} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * 6.28 - 1.57, q = easeBack(clamp(tramo(minicromosoma, i / 14, i / 14 + 0.4)));
        return <g key={i} transform={`translate(${CX + Math.cos(a) * R},${CY + Math.sin(a) * R}) scale(${q.toFixed(3)})`}><circle cx={3} cy={4} r={22} fill="#000" opacity={0.18} /><circle r={22} fill={H.prot[0]} /><circle cx={-2} cy={-2} r={19} fill={H.prot[1]} /><circle cx={-7} cy={-8} r={5} fill="#FFF" opacity={0.7} /></g>;
      })}
      <Etiqueta x={1330} y={800} txt="nace el cccDNA" color="#E8841E" p={nace} t={32} punta="no" />
      <Etiqueta x={1290} y={870} txt="un minicromosoma con nucleosomas" color="#B8237A" p={nucleosomas} t={24} punta="no" />
      <Txt x={300} y={760} txt="el virus se volvió" t={32} p={volvio} color={SOBRE_CEL.hep} />
      <Txt x={300} y={805} txt="parte del núcleo" t={32} p={volvio} color={SOBRE_CEL.hep} />
    </g>
  );
};

// ─── 4 · El molde que no se destruye ────────────────────────────────────────
const Molde: Lamina = ({ p, reloj }) => {
  const cccadn = p('cccadn'), molde = p('molde'), arn = p('arn'), vive = p('vive'), anos = p('anos'), defensas = p('defensas'), antivirales = p('antivirales'), persiste = p('persiste'), reactiva = p('reactiva'), borra = p('borra');
  const CX = 560, CY = 520;
  const cols = [H.a[1], H.c[1], H.b[1], H.d[1], H.sangre[1], H.biliI[1]];
  const rebota = (i: number) => 1000 + 150 * Math.sin(reloj / 650 + i * 2);
  return (
    <g>
      <Nucleo x={CX} y={CY} R={340} reloj={reloj} />
      <AnilloC x={CX} y={CY} R={150} reloj={reloj} p={cccadn} brillo={1} />
      <Etiqueta x={CX} y={110} txt="cccDNA" color="#E8841E" p={cccadn} t={36} punta="no" />
      {/* es el molde de todos los ARN */}
      {cols.map((c, i) => { const a = -1.2 + i * 0.5; return <ARN key={i} a={[CX + Math.cos(a) * 170, CY + Math.sin(a) * 170]} b={[CX + Math.cos(a) * 320, CY + Math.sin(a) * 320]} amp={9} ondas={2} color={c} p={tramo(arn, i * 0.1, i * 0.1 + 0.5)} w={7} />; })}
      <Etiqueta x={1250} y={110} txt="el molde de todos los ARN" color="#7A55D8" p={molde} t={28} punta="no" />
      {/* años en el núcleo */}
      <Reloj x={1150} y={280} k={1.0} ang={(reloj / 8) % 360} o={tramo(anos, 0, 0.4)} />
      <Etiqueta x={1150} y={190} txt="vive años en el núcleo" color="#6A35A0" p={vive} t={26} punta="no" />
      <Txt x={1150} y={380} txt="años" t={34} p={anos} color={TXH.d} />
      {/* ni las defensas ni los antivirales lo tocan */}
      <Sale p={defensas} x={rebota(0) + 90} y={560} k={1.3}><Tijera /></Sale>
      <Etiqueta x={1230} y={470} txt="defensas celulares" color="#0A7F78" p={defensas} t={26} punta="no" />
      <Sale p={antivirales} x={rebota(1) + 90} y={720} k={1.6}><Capsula reloj={reloj} /></Sale>
      <Etiqueta x={1230} y={820} txt="antivirales actuales" color="#8A4FE8" p={antivirales} t={26} punta="no" />
      <g opacity={tramo(antivirales, 0.4, 1)}>{[560, 720].map((yy, i) => <path key={i} d={`M${800},${yy - 34} L${868},${yy + 34} M${868},${yy - 34} L${800},${yy + 34}`} stroke="#E5324C" strokeWidth={12} strokeLinecap="round" opacity={tramo(i ? antivirales : defensas, 0, 0.6)} />)}</g>
      <Etiqueta x={560} y={920} txt="la infección persiste" color="#B8237A" p={persiste} t={28} punta="no" />
      <Etiqueta x={1100} y={920} txt="y se reactiva" color="#E5324C" p={reactiva} t={28} punta="no" />
      <Txt x={800} y={975} txt="un molde que no se borra" t={34} p={borra} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · HBx quita el freno ─────────────────────────────────────────────────
const Freno: Lamina = ({ p, reloj }) => {
  const freno = p('freno'), smc = p('smc'), silencia = p('silencia'), hbx = p('hbx'), ddb1 = p('ddb1'), ligasa = p('ligasa'), marca = p('marca'), proteasoma = p('proteasoma'), destruya = p('destruya'), enciende = p('enciende'), sola = p('sola');
  const CX = 560, CY = 520;
  const rad = (g: number) => (g * Math.PI) / 180;
  const R2 = 198;
  const clamp0 = easeOut(freno) * (1 - easeOut(destruya));
  const hbxX = lerp(1000, 780, easeOut(hbx)), hbxY = lerp(300, 330, easeOut(hbx)) + 6 * onda(reloj, 700);
  return (
    <g>
      <Nucleo x={CX} y={CY} R={340} reloj={reloj} />
      <AnilloC x={CX} y={CY} R={150} reloj={reloj} p={freno} brillo={0.3 + 0.7 * enciende} silencio={silencia * (1 - enciende)} />
      {/* el freno: Smc5/6 abraza el anillo */}
      <g opacity={clamp0}>
        <path d={`M${CX + Math.cos(rad(40)) * R2},${CY + Math.sin(rad(40)) * R2} A${R2},${R2} 0 1 1 ${CX + Math.cos(rad(320)) * R2},${CY + Math.sin(rad(320)) * R2}`} fill="none" stroke="#5A5668" strokeWidth={36} strokeLinecap="round" transform="translate(3,6)" opacity={0.7} />
        <path d={`M${CX + Math.cos(rad(40)) * R2},${CY + Math.sin(rad(40)) * R2} A${R2},${R2} 0 1 1 ${CX + Math.cos(rad(320)) * R2},${CY + Math.sin(rad(320)) * R2}`} fill="none" stroke="#9C92A8" strokeWidth={32} strokeLinecap="round" />
        <path d={`M${CX + Math.cos(rad(60)) * R2},${CY + Math.sin(rad(60)) * R2} A${R2},${R2} 0 0 1 ${CX + Math.cos(rad(130)) * R2},${CY + Math.sin(rad(130)) * R2}`} fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.4} />
      </g>
      {/* los pedazos del freno viajan al proteasoma */}
      {[0, 1, 2, 3].map((i) => {
        const q = easeOut(tramo(destruya, i * 0.1, i * 0.1 + 0.6)), a = rad(60 + i * 70);
        return <circle key={i} cx={lerp(CX + Math.cos(a) * R2, 770, q)} cy={lerp(CY + Math.sin(a) * R2, 730, q)} r={14 * (1 - 0.5 * q)} fill="#9C92A8" opacity={tramo(destruya, 0, 0.2) * (1 - tramo(destruya, 0.85, 1))} />;
      })}
      {/* HBx y DDB1 */}
      <g opacity={tramo(hbx, 0, 0.4)}>
        <circle cx={hbxX + 4} cy={hbxY + 6} r={44} fill="#000" opacity={0.16} /><circle cx={hbxX} cy={hbxY} r={44} fill={H.d[0]} /><circle cx={hbxX - 3} cy={hbxY - 3} r={40} fill={H.d[1]} /><circle cx={hbxX - 14} cy={hbxY - 16} r={9} fill="#FFF" opacity={0.7} />
        <text x={hbxX} y={hbxY} dy="0.36em" textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>HBx</text>
      </g>
      <g opacity={tramo(ddb1, 0, 0.4)}>
        <ellipse cx={hbxX - 70} cy={hbxY + 52} rx={46} ry={32} fill="#C2540A" /><ellipse cx={hbxX - 72} cy={hbxY + 49} rx={42} ry={28} fill="#FF8A1E" />
        <text x={hbxX - 71} y={hbxY + 50} dy="0.36em" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>DDB1</text>
      </g>
      {[0, 1, 2].map((i) => {
        const q = easeOut(tramo(marca, i * 0.15, i * 0.15 + 0.6)), a = rad(110 + i * 55);
        return <Ubi key={i} x={lerp(hbxX - 120, CX + Math.cos(a) * (R2 + 6), q)} y={lerp(hbxY + 110, CY + Math.sin(a) * (R2 + 6), q)} k={1.2} r={i * 40} o={tramo(ligasa, 0, 0.5) * (1 - 0.7 * tramo(destruya, 0.3, 1))} />;
      })}
      <Sale p={proteasoma} x={770} y={730} k={0.85}><Proteasoma traga={destruya} /></Sale>
      {/* rótulos a la derecha */}
      <Etiqueta x={1220} y={130} txt="Smc5/6: el freno" color="#6E6478" p={smc} t={28} punta="no" />
      <Txt x={1220} y={195} txt="silencia el cccDNA" t={26} p={silencia} color={TXH.gris} />
      <Etiqueta x={1250} y={470} txt="HBx recluta a DDB1" color="#8A4FE8" p={ddb1} t={26} punta="no" />
      <Txt x={1250} y={530} txt="una ligasa de ubiquitina" t={26} p={ligasa} color={TXH.d} />
      <Txt x={1250} y={580} txt="marca a Smc5/6 con Ub" t={26} p={marca} color={TXH.d} />
      <Etiqueta x={1250} y={680} txt="el proteasoma" color="#0A7F78" p={proteasoma} t={26} punta="no" />
      <Txt x={1250} y={740} txt="lo destruye" t={26} p={destruya} color={TXH.cd8} />
      <Etiqueta x={1250} y={830} txt="sin freno, el cccDNA se enciende" color="#E8841E" p={enciende} t={26} punta="no" />
      <Txt x={800} y={970} txt="una sola proteína quita el freno" t={34} p={sola} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · ARN mensajeros y pgARN ─────────────────────────────────────────────
const Arns: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), polimerasa = p('polimerasa'), lee = p('lee'), varios = p('varios'), mensajeros = p('mensajeros'), pregenomico = p('pregenomico'), largo = p('largo'), genoma = p('genoma'), traducirse = p('traducirse'), molde = p('molde'), dos = p('dos');
  const CX = 330, CY = 500, R = 130;
  const ang = -1.2 + (reloj / 1800) * lee;
  const cols = [H.a[1], H.c[1], H.b[1], H.d[1]];
  return (
    <g>
      <Globo x={800} y={90} txt="¿qué se fabrica a partir del molde?" t={34} p={pregunta} colaX={0} />
      <Nucleo x={CX} y={CY} R={235} reloj={reloj} o={tramo(pregunta, 0, 0.4)} />
      <AnilloC x={CX} y={CY} R={R} n={8} reloj={reloj} p={tramo(pregunta, 0, 0.5)} />
      <Sale p={polimerasa} x={CX + Math.cos(ang) * (R + 4)} y={CY + Math.sin(ang) * (R + 4)} k={2.2}><Bean x={0} y={0} tono={['#C2540A', '#FF8A1E']} /></Sale>
      <Etiqueta x={CX} y={800} txt="ARN polimerasa II" color="#C2540A" p={polimerasa} t={26} punta="no" />
      {/* varios ARN mensajeros, cortos */}
      {cols.map((c, i) => <ARN key={i} a={[CX + 160, 330 + i * 46]} b={[CX + 520, 330 + i * 46]} amp={10} ondas={5 - i * 0.4} color={c} p={tramo(varios, i * 0.15, i * 0.15 + 0.6)} w={8} />)}
      <Etiqueta x={1100} y={260} txt="ARN mensajeros de las proteínas" color="#2F55E0" p={mensajeros} t={26} punta="no" />
      {/* el pgARN: más largo que el genoma */}
      <line x1={600} x2={1060} y1={690} y2={690} stroke={H.adn[1]} strokeWidth={10} strokeDasharray="14 12" strokeLinecap="round" opacity={0.9 * tramo(genoma, 0, 0.4)} />
      <Txt x={830} y={735} txt="genoma: 3,2 kb" t={24} p={genoma} color={TXH.b} />
      <ARN a={[600, 590]} b={[600 + 560 * easeOut(largo) + 60 * (1 - easeOut(largo)) , 590]} amp={9} ondas={9} color="#FFC81E" p={pregenomico} w={11} />
      <Etiqueta x={900} y={640} txt="ARN pregenómico (pgARN)" color="#C79A00" p={pregenomico} t={28} punta="no" />
      <Txt x={1330} y={590} txt="más largo" t={26} p={largo} color={TXH.biliI} />
      {/* dos trabajos: se traduce y es el molde de la retrotranscripción */}
      <g opacity={tramo(traducirse, 0, 0.4)}>
        <circle cx={1000} cy={590} r={26} fill="#5A22A8" /><circle cx={999} cy={572} r={17} fill="#8A4FE8" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={1030 + i * 22} cy={540 - i * 16 - 6 * Math.sin(reloj / 400 + i)} r={11} fill={H.prot[1]} opacity={tramo(traducirse, i / 9, i / 9 + 0.4)} />)}
      </g>
      <Txt x={1330} y={440} txt="se traduce a proteínas" t={26} p={traducirse} color={TXH.d} />
      <g opacity={tramo(molde, 0, 0.4)}>
        <Flecha a={[1130, 620]} b={[1130, 770]} p={tramo(molde, 0.1, 1)} color="var(--cit-flecha)" w={8} />
        <path d="M1030,830 L1230,830 M1030,848 L1230,848" stroke={H.adn[1]} strokeWidth={9} strokeLinecap="round" />
      </g>
      <Etiqueta x={1330} y={900} txt="molde de la retrotranscripción" color="#1B36A8" p={molde} t={26} punta="no" />
      <Txt x={800} y={965} txt="un mismo ARN, dos trabajos" t={34} p={dos} color={TXH.hep} />
    </g>
  );
};

// ─── 7 · Cápside, retrotranscripción y salida ───────────────────────────────
const Salida: Lamina = ({ p, reloj }) => {
  const capside = p('capside'), encapsidan = p('encapsidan'), dentro = p('dentro'), retro = p('retro'), adn = p('adn'), madura = p('madura'), nucleo = p('nucleo'), cccadn = p('cccadn'), envuelve = p('envuelve'), sale = p('sale'), sobran = p('sobran'), senuelos = p('senuelos'), ciclo = p('ciclo');
  const A: P2 = [800, 270], B: P2 = [1290, 560], C: P2 = [800, 780], D: P2 = [320, 560];
  return (
    <g>
      <Trabaja x={800} y={540} R={300} reloj={reloj} p={ciclo} color="#E8841E" />
      {/* A · encapsidación: pgARN + polimerasa dentro de la cápside */}
      <VirionB x={A[0]} y={A[1]} k={0.95} reloj={reloj} env={0} capside={capside} adn={0} o={tramo(capside, 0, 0.4)} />
      <ARN a={[A[0] - 38, A[1] + 6]} b={[A[0] + 38, A[1] - 6]} amp={8} ondas={2} color="#FFC81E" p={encapsidan} w={7} cap={false} />
      <Bean x={A[0] + 4} y={A[1] + 24} k={1.2} tono={['#C2540A', '#FF8A1E']} o={tramo(encapsidan, 0.3, 1)} />
      <Etiqueta x={A[0] + 250} y={A[1] - 30} txt="se encapsidan: pgARN + polimerasa" color="#C79A00" p={encapsidan} t={26} punta="no" />
      <Flecha a={[A[0], A[1] + 120]} b={[C[0], C[1] - 130]} p={tramo(dentro, 0, 0.8)} color="var(--cit-flecha)" w={9} />
      {/* C · retrotranscripción dentro de la cápside: el ARN pasa a ADN */}
      <VirionB x={C[0]} y={C[1]} k={0.95} reloj={reloj} env={0} capside={dentro} adn={0} o={tramo(dentro, 0, 0.4)} fase={1} />
      <ARN a={[C[0] - 40, C[1]]} b={[C[0] + 40 * (1 - easeOut(retro)) - 40 * easeOut(retro) + 40, C[1]]} amp={8} ondas={2} color="#FFC81E" p={dentro * (1 - tramo(retro, 0.5, 1))} w={7} cap={false} />
      <path d={`M${C[0] - 40},${C[1] - 6} L${C[0] - 40 + 80 * easeOut(retro)},${C[1] - 6} M${C[0] - 40},${C[1] + 6} L${C[0] - 40 + 80 * easeOut(retro)},${C[1] + 6}`} stroke={H.adn[1]} strokeWidth={6} strokeLinecap="round" opacity={tramo(retro, 0, 0.3)} />
      <Etiqueta x={C[0] + 240} y={C[1] + 10} txt="retrotranscripción" color="#1B36A8" p={retro} t={26} punta="no" />
      <Txt x={C[0] + 240} y={C[1] + 65} txt="de ARN a ADN" t={26} p={adn} color={TXH.b} />
      {/* D · la cápside madura vuelve al núcleo: más cccDNA */}
      <Nucleo x={D[0]} y={D[1]} R={130} o={tramo(nucleo, 0, 0.4)} reloj={reloj} />
      <AnilloC x={D[0]} y={D[1]} R={66} n={6} reloj={reloj} p={cccadn} />
      <Flecha a={[C[0] - 130, C[1] - 30]} b={[D[0] + 140, D[1] + 120]} c={[480, 780]} p={tramo(madura, 0, 0.8)} color="var(--cit-flecha)" w={9} />
      <Etiqueta x={D[0]} y={D[1] + 190} txt="vuelve al núcleo" color="#4A2A9E" p={nucleo} t={26} punta="no" />
      <Txt x={D[0]} y={D[1] - 175} txt="más cccDNA" t={28} p={cccadn} color={TXH.d} />
      <Etiqueta x={C[0] - 330} y={C[1] + 100} txt="la cápside madura" color="#138A3A" p={madura} t={26} punta="no" />
      {/* B · o se envuelve en HBsAg y sale */}
      <circle cx={B[0]} cy={B[1]} r={96} fill="#EAF2FF" opacity={0.45 * tramo(envuelve, 0, 0.5)} />
      <VirionB x={B[0] + 120 * easeOut(sale)} y={B[1]} k={0.95} reloj={reloj} env={envuelve} espiculas={envuelve} capside={1} adn={1} o={tramo(envuelve, 0, 0.3)} fase={2} />
      <Flecha a={[C[0] + 130, C[1] - 40]} b={[B[0] - 110, B[1] + 90]} c={[1100, 760]} p={tramo(envuelve, 0, 0.8)} color="var(--cit-flecha)" w={9} />
      <Etiqueta x={B[0]} y={B[1] - 190} txt="se envuelve en HBsAg" color="#2F55E0" p={envuelve} t={26} punta="no" />
      <Txt x={B[0] + 20} y={B[1] + 120} txt="y sale" t={32} p={sale} color={TXH.b} />
      {[0, 1, 2, 3].map((i) => <Subviral key={i} x={1270 + i * 75 + 12 * Math.sin(reloj / 700 + i)} y={780 + 30 * (i % 2) + 10 * Math.cos(reloj / 800 + i)} k={0.6} forma={i % 2 ? 'filamento' : 'esfera'} reloj={reloj} fase={i} o={tramo(sobran, i * 0.12, i * 0.12 + 0.4)} />)}
      <Etiqueta x={1330} y={880} txt="sobran partículas vacías" color="#7A55D8" p={senuelos} t={26} punta="no" />
      <Txt x={800} y={965} txt="un ciclo que se alimenta a sí mismo" t={34} p={ciclo} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Entrada, Puerta, Adentro, Poro, Molde, Freno, Arns, Salida];
export default LAMINAS;
