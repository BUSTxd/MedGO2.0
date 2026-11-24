'use client';
// Capítulo 0 · Dos pacientes, una pregunta (vistazo gratis)
//
// Rehecho el 2026-11-24 a pedido de BUST («hay un exceso de etiquetas, rectángulos con texto»; mejorar sombras y termómetro):
// cada dato es un dibujo (monitor de signos vitales, termómetro clínico con su escala, el vaso que aprieta las petequias, el
// estetoscopio, lentes de zoom, un mapa de metro) y lo escrito va suelto y en segundo plano. Lo que flota o se apoya lleva su
// sombra proyectada (`Sombra`) y su sombra de suelo (`Suelo`). Los parámetros son los de antes: `capitulos.ts` no cambia.

import type { Lamina } from '../Lienzo';
import { Alveolos, Bacilo, Cerebro, Cuerpo, Diana, Diplococo, Endo, Estetoscopio, Fibrina, Flecha, Globo, Hematie, Hombre, Levita, Linfocito, Llama, Manometro, Monitor, Nfkb, Nota, Persona, Pierna, Pulmones, Respira, Rinon, S, Sale, Sombra, Suelo, TXS, TermometroClinico, Tlr4, Tnf, Tranvia, Txt, Vaso, VasoVidrio, Visto, Zoom, clamp, easeOut, hash, lerp, tramo, type FilaMonitor } from '../Piezas';

type P2 = [number, number];

/** Quién es: la edad en grande y una línea debajo, sin caja (como el nombre de las referencias de pacientes). */
function Encabezado({ p, num, linea, color }: { p: number; num: string; linea: string; color: string }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p)), x2 = 64 + num.length * 70 + 18;
  return (
    <g opacity={tramo(p, 0, 0.5)} transform={`translate(${lerp(-26, 0, q).toFixed(1)},0)`}>
      <text x={64} y={152} style={{ fontSize: 120, fontWeight: 800, fill: color }}>{num}</text>
      <text x={x2} y={104} style={{ fontSize: 40, fontWeight: 800, fill: 'var(--cit-texto)' }}>años</text>
      <text x={x2} y={146} style={{ fontSize: 28, fontWeight: 600, fill: 'var(--cit-texto-2)' }}>{linea}</text>
    </g>
  );
}

/** Rayo plano (la cefalea), con su tono oscuro corrido y un brillo. */
function Rayo({ x, y, r, k, o }: { x: number; y: number; r: number; k: number; o: number }) {
  const d = 'M-8,-46 L18,-46 L4,-10 L22,-10 L-14,46 L-4,6 L-20,6 Z';
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${k.toFixed(3)})`} opacity={o}>
      <path d={d} fill="#A3122C" transform="translate(4,4)" />
      <path d={d} fill="#FF4242" />
      <path d="M-3,-40 L9,-40 L1,-18" fill="none" stroke="#FFC2C2" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** Gota de sudor que resbala (la fiebre). */
function Sudor({ x, y, o }: { x: number; y: number; o: number }) {
  if (o <= 0.01) return null;
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity={o}>
      <path d="M0,-17 C7,-5 11,2 11,7 A11,11 0 0 1 -11,7 C-11,2 -7,-5 0,-17 Z" fill="#3F9BE8" />
      <path d="M0,-14 C5,-4 8,2 8,6 A8.5,8.5 0 0 1 -8,6 C-8,2 -5,-4 0,-14 Z" fill="#8FD3F7" />
      <circle cx={-3} cy={4} r={2.6} fill="#FFFFFF" />
    </g>
  );
}

/** Señal de alerta: círculo rojo con su «!». */
function Alerta({ x, y, k = 1, p }: { x: number; y: number; k?: number; p: number }) {
  if (p <= 0.01) return null;
  return (
    <Sale p={p} x={x} y={y} k={k}>
      <circle r={30} fill="#A81830" /><circle cx={-2} cy={-2} r={27} fill="#E5324C" />
      <rect x={-5} y={-18} width={10} height={22} rx={5} fill="#FFFFFF" /><circle cy={12} r={5.5} fill="#FFFFFF" />
    </Sale>
  );
}

// ─── 0 · El joven de las manchas ─────────────────────────────────────────────
const ElJoven: Lamina = ({ p, reloj }) => {
  const joven = p('joven'), fiebre = p('fiebre'), cabeza = p('cabeza'), musc = p('musculos');
  const manchas = p('manchas'), aprieta = p('aprieta'), temp = p('temp'), final = p('final');
  // Con la fiebre la columna sube a 38,6 °C; con la cifra, a 39,2 °C (y la lectura cuenta hasta ahí).
  const tc = lerp(lerp(36.9, 38.6, easeOut(tramo(fiebre, 0.2, 1))), 39.2, easeOut(tramo(temp, 0, 0.85)));
  const llega = easeOut(tramo(aprieta, 0, 0.45)), aprieto = tramo(aprieta, 0.35, 0.8);
  const PX = 1432, PY = 598, PK = 0.72;
  const VX = PX + 4 * PK, VY = PY - 40 * PK;
  const filas: FilaMonitor[] = [
    { tipo: 'ecg', nombre: 'FC', valor: '118', unidad: 'lat/min', frec: 118, p: p('fc') },
    { tipo: 'resp', nombre: 'FR', valor: '24', unidad: 'resp/min', frec: 24, p: p('fr') },
    { tipo: 'pa', nombre: 'PA', valor: '112/70', unidad: 'mmHg', p: p('pa') },
  ];
  const late = (i: number) => 1 + 0.09 * Math.sin(reloj / 110 + i * 2);
  return (
    <g>
      <Encabezado p={joven} num="19" linea="sano · 12 h de fiebre" color={TXS.menin} />

      {/* El joven: rubor y sudor de la fiebre, rayos de la cefalea y dolor en los hombros */}
      <Sombra><Sale p={joven} x={310} y={585} k={0.9}><Hombre pelo="var(--se-pelo)" rubor={fiebre} triste={0.35 * fiebre} /></Sale></Sombra>
      {[-1, 1].map((l, i) => {
        const u = (reloj / 2600 + i * 0.47) % 1;
        return <Sudor key={l} x={310 + l * (97 - u * 6)} y={530 + u * 80} o={tramo(fiebre, 0.3, 1) * Math.sin(u * Math.PI)} />;
      })}
      <Sombra>
        <Rayo x={162} y={440} r={-24} k={late(0) * (0.5 + 0.5 * easeOut(tramo(cabeza, 0, 0.6)))} o={tramo(cabeza, 0, 0.4)} />
        <Rayo x={458} y={440} r={24} k={late(1) * (0.5 + 0.5 * easeOut(tramo(cabeza, 0.15, 0.75)))} o={tramo(cabeza, 0.15, 0.55)} />
      </Sombra>
      <Nota x={310} y={340} txt="cefalea intensa" p={cabeza} />
      {[-1, 1].map((l) => (
        <g key={l} transform={`translate(${310 + l * 136},${752}) scale(${(late(l + 3) * easeOut(tramo(musc, 0, 0.6))).toFixed(3)})`} opacity={tramo(musc, 0, 0.4)}>
          {[-62, -90, -118].map((a) => {
            const r = ((l === 1 ? 180 - a : a) * Math.PI) / 180;
            return <path key={a} d={`M${(Math.cos(r) * 16).toFixed(1)},${(-Math.abs(Math.sin(r)) * 16).toFixed(1)} L${(Math.cos(r) * 40).toFixed(1)},${(-Math.abs(Math.sin(r)) * 40).toFixed(1)}`} stroke="#FF7A1E" strokeWidth={8} strokeLinecap="round" />;
          })}
        </g>
      ))}
      <Nota x={150} y={690} txt="mialgias" p={musc} ancla="end" a={[172, 740]} de={[156, 708]} />

      {/* Termómetro: sube con la fiebre y marca 39,2 °C */}
      <Levita x={600} y={600} reloj={reloj} k={0.64} p={fiebre} suelo={112} ancho={120} fase={1}>
        <TermometroClinico temp={tc} reloj={reloj} lectura={temp > 0.04} />
      </Levita>

      {/* Monitor de cabecera: cada cifra entra cuando se nombra */}
      <Suelo x={990} y={894} w={340} o={tramo(temp, 0, 0.5)} />
      <Sombra><Sale p={temp} x={990} y={410} k={0.86}><Monitor reloj={reloj} filas={filas} estable={final} pie={300} /></Sale></Sombra>

      {/* La pierna: petequias que no se borran cuando el vaso aprieta la piel */}
      <Suelo x={PX - 34} y={PY + 302 * PK} w={250} o={tramo(manchas, 0, 0.5)} />
      <Sombra><Sale p={manchas} x={PX} y={PY} k={PK}><Pierna p={manchas} blanquea={{ cx: 4, cy: -40, rx: 60, ry: 96, q: aprieto }} /></Sale></Sombra>
      {llega > 0.01 && <VasoVidrio x={lerp(VX + 240, VX, llega)} y={VY} k={PK * 0.86 * (1 - 0.05 * aprieto)} o={tramo(aprieta, 0, 0.3)} />}
      <Nota x={PX} y={352} txt="petequias" p={manchas} a={[PX - 22, PY - 150 * PK]} />
      <Nota x={PX - 10} y={868} txt="no se borran al apretar" p={aprieta} color={final > 0.02 ? TXS.il1 : undefined} />
      <Alerta x={1546} y={470} k={0.9 * (1 + 0.08 * Math.sin(reloj / 160) * final)} p={final} />

      {/* Despierto, cuello sin rigidez */}
      <Sale p={p('despierto')} x={512} y={806} k={0.42}><Visto /></Sale>
      <Nota x={542} y={806} txt="despierto · sin rigidez de nuca" p={p('despierto')} ancla="start" />

      {/* Parece estable… */}
      <Txt x={990} y={948} txt="parece estable…" t={30} p={final} color={TXS.verde} />
    </g>
  );
};

// ─── 1 · La abuela que no reconoce a su familia ──────────────────────────────
const LaAbuela: Lamina = ({ p, reloj }) => {
  const abuela = p('abuela'), tos = p('tos'), adorm = p('adormilada'), desor = p('desorienta'), temp = p('temp');
  const pulmon = p('pulmon'), crep = p('crepitantes'), final = p('final');
  const tc = lerp(37, 35.8, easeOut(tramo(temp, 0.15, 0.9)));
  const sat = p('sat');
  const filas: FilaMonitor[] = [
    { tipo: 'ecg', nombre: 'FC', valor: '112', unidad: 'lat/min', frec: 112, p: p('fc') },
    { tipo: 'pleth', nombre: 'SpO₂', valor: '86', unidad: '%', frec: 112, p: sat, alerta: tramo(sat, 0.5, 1) },
    { tipo: 'resp', nombre: 'FR', valor: '30', unidad: 'resp/min', frec: 30, p: p('fr') },
    { tipo: 'pa', nombre: 'PA', valor: '108/66', unidad: 'mmHg', p: p('pa') },
  ];
  return (
    <g>
      <Encabezado p={abuela} num="76" linea="hipertensa · 4 días enferma" color={TXS.violeta} />

      {/* La abuela: tos con flema, párpados que se le cierran, la pregunta de quien no sabe dónde está */}
      <Sombra><Sale p={abuela} x={310} y={590} k={0.88}><Persona quien="mujer" sueno={0.62 * easeOut(adorm)} /></Sale></Sombra>
      {[0, 1, 2].map((i) => {
        const u = (reloj / 1700 + i / 3) % 1, R = 10 + u * 24;
        const cx = 418 + u * 130, cy = 640 - u * 70 + i * 8, o = tramo(tos, 0, 0.3) * 0.9 * Math.sin(u * Math.PI);
        return (
          <g key={i} opacity={o}>
            <circle cx={cx + 3} cy={cy + 3} r={R} fill="#9EAE2E" /><circle cx={cx} cy={cy} r={R} fill="#D9E67A" />
            <circle cx={cx - R * 0.35} cy={cy - R * 0.35} r={R * 0.22} fill="#FFFFFF" opacity={0.7} />
          </g>
        );
      })}
      <Nota x={548} y={770} txt="tos con flema · disnea" p={tos} ancla="start" a={[492, 650]} de={[556, 748]} />
      {['z', 'Z', 'z'].map((z, i) => {
        const u = (reloj / 2300 + i / 3) % 1;
        return <text key={i} x={470 + i * 24 + u * 34} y={420 - u * 90} style={{ fontSize: 30 + i * 10, fontWeight: 800, fill: 'var(--se-violeta)' }} opacity={tramo(adorm, 0, 0.3) * (1 - u)}>{z}</text>;
      })}
      <Sombra><Sale p={desor} x={168} y={386 + Math.sin(reloj / 500) * 6} k={1}><text textAnchor="middle" dy="0.35em" style={{ fontSize: 96, fontWeight: 800, fill: 'var(--se-ambar)' }}>?</text></Sale></Sombra>
      <Nota x={310} y={282} txt="somnolienta y desorientada" p={desor} />

      {/* Termómetro: baja a 35,8 °C, con escarcha */}
      <Levita x={628} y={600} reloj={reloj} k={0.64} p={temp} suelo={112} ancho={120} fase={2}>
        <TermometroClinico temp={tc} reloj={reloj} lectura />
      </Levita>

      {/* Monitor: la saturación entra en alarma */}
      <Suelo x={990} y={892} w={340} o={tramo(temp, 0, 0.5)} />
      <Sombra><Sale p={temp} x={990} y={424} k={0.82}><Monitor reloj={reloj} filas={filas} alarma={final} pie={270} /></Sale></Sombra>

      {/* Los pulmones con el estetoscopio: crepitantes en los dos */}
      <Levita x={1395} y={455} reloj={reloj} k={0.74} p={pulmon} suelo={172} ancho={250} fase={0.5}>
        <Respira reloj={reloj} periodo={2000} amp={0.04}><Pulmones infiltrados={0.55 * crep + 0.15} /></Respira>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const u = (reloj / 900 + hash(i, 3)) % 1;
          return <circle key={i} cx={(hash(i, 1) - 0.5) * 230} cy={(hash(i, 2) - 0.35) * 230} r={4 + u * 11} fill="none" stroke="#FFFFFF" strokeWidth={3.4} opacity={tramo(crep, 0, 0.4) * (1 - u)} />;
        })}
        <g opacity={tramo(crep, 0, 0.5)}>
          <Estetoscopio x={88} y={52} k={0.9} hx={140} hy={-230} />
          {[0, 1].map((i) => {
            const u = (reloj / 700 + i * 0.5) % 1;
            return <path key={i} d={`M${150 + u * 30},${10 - u * 6} q${14 + u * 10},${30} 0,${62 + u * 16}`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={(1 - u) * 0.85} />;
          })}
        </g>
      </Levita>
      <Nota x={1395} y={700} txt="crepitantes en los dos pulmones" p={crep} />

      {/* Sin fiebre… y algo grave */}
      <Txt x={990} y={948} txt="sin fiebre… y aun así, algo grave" t={30} p={final} color={TXS.il1} />
    </g>
  );
};

// ─── 2 · Dos puertas de entrada ──────────────────────────────────────────────
const DosPuertas: Lamina = ({ p, reloj }) => {
  const sangre = p('sangre'), pulmon = p('pulmon'), dip = p('diplococos'), menin = p('menin'), neu = p('neumonia');
  const puertas = p('puertas'), nada = p('nada'), lugar = p('lugar');
  const A: P2 = [470, 515], B: P2 = [1130, 515], R = 236;
  const deA: P2 = [152, 286], deB: P2 = [1452, 286];
  const anillo = (c: P2, q: number) => q > 0.01 && [0, 1].map((i) => {
    const u = (reloj / 1100 + i / 2) % 1;
    return <circle key={i} cx={c[0]} cy={c[1]} r={12 + u * 40} fill="none" stroke="var(--se-ambar)" strokeWidth={5} opacity={q * (1 - u)} />;
  });
  return (
    <g>
      {/* Los dos pacientes, pequeños, en las esquinas: de cada uno sale su lente */}
      <Sombra><Sale p={sangre} x={130} y={200} k={0.33}><Hombre pelo="var(--se-pelo)" rubor={0.6} triste={0.3} /></Sale></Sombra>
      <Sombra><Sale p={pulmon} x={1470} y={212} k={0.3}><Persona quien="mujer" sueno={0.5} /></Sale></Sombra>

      <Zoom x={A[0]} y={A[1]} R={R} de={deA} p={sangre} fondo="#F7C6D2">
        <Vaso x={A[0]} y={A[1]} largo={760} ancho={300} ang={-8} reloj={reloj} flujo={9}>
          {[[-150, -40], [40, 50], [170, -50], [-40, -70], [-160, 70]].map(([cx, cy], i) => (
            <Diplococo key={i} x={cx + Math.sin(reloj / 900 + i) * 10} y={cy + Math.sin(reloj / 600 + i) * 7} k={0.6} r={i * 25} reloj={reloj} fase={i} pili={0.8} o={tramo(dip, i * 0.12, i * 0.12 + 0.5)} />
          ))}
        </Vaso>
      </Zoom>
      <Zoom x={B[0]} y={B[1]} R={R} de={deB} p={pulmon} fondo="#FBE3EE">
        <Alveolos x={B[0]} y={B[1] + 12} k={0.78} />
        {[[-80, -40], [60, -95], [-10, 50], [95, 25], [-140, 70]].map(([cx, cy], i) => (
          <Bacilo key={i} x={B[0] + cx + Math.sin(reloj / 500 + i * 2) * 9} y={B[1] + cy + Math.cos(reloj / 640 + i) * 6} k={0.55} r={-30 + i * 40} tono={S.gris as unknown as readonly string[]} reloj={reloj} flagelo={0.6} o={tramo(neu, i * 0.12, i * 0.12 + 0.5)} />
        ))}
      </Zoom>
      {/* Las dos puertas de entrada laten en cada paciente */}
      {anillo(deA, tramo(sangre, 0.5, 1) * (0.35 + 0.65 * puertas))}
      {anillo(deB, tramo(pulmon, 0.5, 1) * (0.35 + 0.65 * puertas))}
      <circle cx={deA[0]} cy={deA[1]} r={9 * tramo(sangre, 0.3, 0.8)} fill="var(--se-ambar)" />
      <circle cx={deB[0]} cy={deB[1]} r={9 * tramo(pulmon, 0.3, 0.8)} fill="var(--se-ambar)" />

      {/* Qué es cada uno: el nombre en cursiva, la descripción debajo */}
      {menin > 0.002 && <text x={A[0]} y={812} textAnchor="middle" dy="0.35em" opacity={tramo(menin, 0, 0.5)} style={{ fontSize: 36, fontWeight: 800, fontStyle: 'italic', fill: TXS.menin }}>Neisseria meningitidis</text>}
      <Nota x={A[0]} y={856} txt="diplococos gramnegativos" p={dip} />
      {neu > 0.002 && <text x={B[0]} y={812} textAnchor="middle" dy="0.35em" opacity={tramo(neu, 0, 0.5)} style={{ fontSize: 36, fontWeight: 800, fill: TXS.violeta }}>neumonía bacteriana</text>}

      {/* Nada en común… */}
      <Sombra>
        <Sale p={nada} x={800} y={515} k={1}>
          <rect x={-46} y={-30} width={92} height={18} rx={9} fill="#7A45E6" /><rect x={-46} y={12} width={92} height={18} rx={9} fill="#7A45E6" />
          <rect x={-9} y={-58} width={18} height={116} rx={9} fill="#E5324C" transform="rotate(28)" />
        </Sale>
      </Sombra>

      {/* …y van al mismo lugar */}
      <Flecha a={[655, 690]} c={[720, 820]} b={[756, 858]} p={tramo(lugar, 0, 0.6)} color="var(--cit-flecha)" w={7} />
      <Flecha a={[945, 690]} c={[880, 820]} b={[844, 858]} p={tramo(lugar, 0, 0.6)} color="var(--cit-flecha)" w={7} />
      <Sale p={tramo(lugar, 0.4, 1)} x={800} y={872} k={1.1}><Diana /></Sale>
      <Txt x={800} y={950} txt="van al mismo lugar" t={30} p={tramo(lugar, 0.5, 1)} />
    </g>
  );
};

// ─── 3 · La pregunta ─────────────────────────────────────────────────────────
const ORGANOS = [
  { x: 1240, y: 252, nombre: 'piel', suelo: 108, ancho: 120 },
  { x: 1350, y: 520, nombre: 'riñón', suelo: 104, ancho: 170 },
  { x: 1240, y: 785, nombre: 'cerebro', suelo: 112, ancho: 200 },
];

/** Donde llega la flecha de la respuesta: un golpe que destella (rayitas que salen del punto). */
const IMPACTOS: P2[] = [[1168, 262], [1262, 520], [1148, 786]];
function Impacto({ x, y, p, reloj }: { x: number; y: number; p: number; reloj: number }) {
  if (p <= 0.01) return null;
  const u = (reloj / 650) % 1, q = easeOut(clamp(p));
  return (
    <g transform={`translate(${x},${y}) scale(${(q * (0.9 + 0.2 * Math.sin(u * Math.PI))).toFixed(3)})`} opacity={tramo(p, 0, 0.4)}>
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r = ((a + 30) * Math.PI) / 180;
        return <path key={a} d={`M${(Math.cos(r) * 18).toFixed(1)},${(Math.sin(r) * 18).toFixed(1)} L${(Math.cos(r) * (36 + 6 * u)).toFixed(1)},${(Math.sin(r) * (36 + 6 * u)).toFixed(1)}`} stroke="#FFB21E" strokeWidth={7} strokeLinecap="round" />;
      })}
      <circle r={11} fill="#E5324C" /><circle cx={-3} cy={-3} r={4} fill="#FFFFFF" opacity={0.8} />
    </g>
  );
}

/** «Aquí no está el microbio»: la señal de prohibido con un diplococo dentro. */
function SinMicrobio({ x, y, p, reloj }: { x: number; y: number; p: number; reloj: number }) {
  if (p <= 0.01) return null;
  return (
    <Sombra>
      <Sale p={p} x={x} y={y} k={1}>
        <circle r={34} fill="#FFFFFF" />
        <Diplococo k={0.24} reloj={reloj} pili={0.5} />
        <circle r={30} fill="none" stroke="#E5324C" strokeWidth={8} />
        <rect x={-30} y={-4.5} width={60} height={9} rx={4.5} fill="#E5324C" transform="rotate(-45)" />
      </Sale>
    </Sombra>
  );
}

const LaPregunta: Lamina = ({ p, reloj }) => {
  const inf = p('infeccion'), toco = p('toco'), preg = p('pregunta'), resp = p('respuesta'), desb = p('desborda');
  const fuego = easeOut(tramo(resp, 0, 0.7));
  const piezas = [<Pierna key="p" k={0.3} p={1} />, <Rinon key="r" k={0.6} />, <Cerebro key="c" k={0.68} />];
  const sale = [p('piel'), p('rinon'), p('cerebro')];
  return (
    <g>
      {/* El microbio, y por dónde entró */}
      <Levita x={226} y={470} reloj={reloj} k={0.74} p={inf} suelo={96} ancho={170}>
        <Diplococo reloj={reloj} capsula={1} />
      </Levita>
      <path d="M330,478 C430,470 540,486 660,500" fill="none" stroke={S.menin[1]} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" opacity={tramo(inf, 0.4, 1)} />

      {/* El cuerpo; la respuesta se enciende en el pecho y se desborda */}
      <Suelo x={760} y={838} w={280} o={tramo(inf, 0, 0.5)} />
      <Sombra><Sale p={inf} x={760} y={560} k={0.8}><Cuerpo /></Sale></Sombra>
      {fuego > 0.01 && <Respira x={762} y={470} k={0.42 + 0.3 * fuego + 0.28 * desb} reloj={reloj} periodo={700} amp={0.08}><Llama /></Respira>}
      {desb > 0.01 && [[-72, -70], [74, -66], [-110, 40], [112, 44], [-30, 150], [34, 152]].map(([dx, dy], i) => (
        <Respira key={i} x={760 + dx} y={470 + dy} k={0.26 * easeOut(tramo(desb, i * 0.08, 0.5 + i * 0.08))} reloj={reloj + i * 130} periodo={520} amp={0.12}><Llama /></Respira>
      ))}

      {/* Los órganos lejanos, cada uno flotando con su sombra */}
      {ORGANOS.map((o, i) => (
        <g key={o.nombre}>
          <Levita x={o.x} y={o.y} reloj={reloj} k={1} p={sale[i]} suelo={o.suelo} ancho={o.ancho} fase={i * 1.7}>{piezas[i]}</Levita>
          <Impacto x={IMPACTOS[i][0]} y={IMPACTOS[i][1]} p={tramo(resp, 0.55 + i * 0.1, 0.9 + i * 0.1)} reloj={reloj + i * 300} />
          <Nota x={o.x} y={o.y + o.suelo + 36} txt={o.nombre} p={sale[i]} />
          <SinMicrobio x={o.x - 118} y={o.y - 62} p={tramo(toco, i * 0.15, i * 0.15 + 0.6)} reloj={reloj} />
        </g>
      ))}

      {/* La pregunta */}
      <Globo x={760} y={132} txt={'¿cómo se dañan órganos\nque el microbio no tocó?'} t={34} p={preg} />

      {/* La respuesta del propio cuerpo llega a los órganos */}
      <Flecha a={[808, 430]} c={[960, 300]} b={[1150, 262]} p={tramo(resp, 0, 0.7)} color="#E5324C" w={8 + 3 * desb} />
      <Flecha a={[815, 500]} c={[1020, 520]} b={[1240, 520]} p={tramo(resp, 0.1, 0.8)} color="#E5324C" w={8 + 3 * desb} />
      <Flecha a={[805, 570]} c={[960, 740]} b={[1130, 780]} p={tramo(resp, 0.2, 0.9)} color="#E5324C" w={8 + 3 * desb} />
      <Txt x={760} y={930} txt="lo hace, sobre todo, la respuesta del propio cuerpo" t={28} p={resp} color={TXS.il1} />
    </g>
  );
};

// ─── 4 · El mapa (también es la portada): una línea de metro ─────────────────
const ESTACIONES = [
  { nombre: 'reconocer', color: '#2FA84F' },
  { nombre: 'la señal', color: '#5B4BE8' },
  { nombre: 'mensajeros', color: '#E8721E' },
  { nombre: 'endotelio', color: '#0C9E9A' },
  { nombre: 'coagulación', color: '#2E78F2' },
  { nombre: 'el choque', color: '#19A8C2' },
  { nombre: 'microcirculación', color: '#F2546B' },
  { nombre: 'los órganos', color: '#0E9E6A' },
  { nombre: 'las defensas\nque se apagan', color: '#6D3FD8' },
];
const F1 = 425, F2 = 760, RU = (F2 - F1) / 2, XU = 1270, X0 = 60, XFIN = 330;
const XS = [150, 430, 710, 990, 1270, 1270, 990, 710, 430];
const ARCO = Math.PI * RU;
/** Distancia de cada estación desde el inicio de la vía. */
const DIST = XS.map((x, i) => (i < 5 ? x - X0 : XU - X0 + ARCO + (XU - x)));
const LARGO = XU - X0 + ARCO + (XU - XFIN);
/** Punto de la vía a una distancia `d`: posición, giro (grados) y sentido. */
function enVia(d: number): { x: number; y: number; r: number; dir: 1 | -1 } {
  const a = XU - X0;
  if (d <= a) return { x: X0 + d, y: F1, r: 0, dir: 1 };
  if (d <= a + ARCO) {
    const th = (d - a) / RU;
    return { x: XU + Math.sin(th) * RU, y: F1 + RU - Math.cos(th) * RU, r: th <= Math.PI / 2 ? (th * 180) / Math.PI : ((th - Math.PI) * 180) / Math.PI, dir: th <= Math.PI / 2 ? 1 : -1 };
  }
  return { x: XU - (d - a - ARCO), y: F2, r: 0, dir: -1 };
}
/** Tramos de la vía (cada uno del color de la estación a la que llega) y su largo. */
const TRAMOS = ESTACIONES.map((e, i) => {
  const d0 = i === 0 ? 0 : DIST[i - 1], d1 = DIST[i];
  const a = enVia(d0), b = enVia(d1);
  const d = i === 5 ? `M${a.x},${a.y} A${RU},${RU} 0 0 1 ${b.x},${b.y}` : `M${a.x},${a.y} L${b.x},${b.y}`;
  return { d, d0, largo: d1 - d0, color: e.color };
}).concat([{ d: `M${XS[8]},${F2} L${XFIN},${F2}`, d0: DIST[8], largo: XS[8] - XFIN, color: ESTACIONES[8].color }]);

const Mapa: Lamina = ({ p, reloj }) => {
  const tren = p('tren'), emp = p('empecemos');
  const luces = [p('e1'), p('e2'), p('e3'), p('e4'), p('e5'), p('e6'), p('e7'), p('e8'), p('defensas')];
  const hasta = luces.reduce((s, v) => s + easeOut(clamp(v)), 0);
  const i = Math.min(8, Math.floor(hasta));
  // El tranvía se detiene justo antes de cada estación: su número queda a la vista.
  const dv = hasta <= 1 ? lerp(0, DIST[0], hasta) : hasta >= 9 ? DIST[8] : lerp(DIST[i - 1], DIST[i], hasta - i);
  const v = enVia(Math.max(0, dv - 78));
  const dibujada = LARGO * easeOut(clamp(tren));
  const iconos = [
    <Tlr4 key="a" k={0.74} y={52} cola={false} reloj={reloj} />,
    <Nfkb key="b" k={2.1} />,
    <Tnf key="c" k={1.7} />,
    <Endo key="d" w={150} h={52} y={22} gluco={1} />,
    <Fibrina key="e" w={120} />,
    <Manometro key="f" x={-8} y={-10} k={0.85} val={0.3} />,
    <Hematie key="g" k={1.05} />,
    <Rinon key="h" k={0.46} />,
    <Linfocito key="i" k={0.62} />,
  ];
  return (
    <g>
      <Txt x={64} y={120} txt="el recorrido del laboratorio" t={40} p={tren} ancla="start" />

      {/* La vía, tramo a tramo, con su sombra proyectada */}
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

      {/* Estaciones: el icono flota encima, el número en la parada y el nombre debajo */}
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
            {lineas.map((l, m) => <Txt key={m} x={x} y={y + 62 + m * 32} txt={l} t={28} p={q} />)}
          </g>
        );
      })}

      {/* El tranvía con los dos pacientes */}
      <Sombra dx={8} dy={10}>
        <Tranvia x={v.x} y={v.y} r={v.r} k={0.56} o={tramo(tren, 0, 0.3)} reloj={reloj} dir={v.dir} />
      </Sombra>
    </g>
  );
};

const LAMINAS: Lamina[] = [ElJoven, LaAbuela, DosPuertas, LaPregunta, Mapa];
export default LAMINAS;
