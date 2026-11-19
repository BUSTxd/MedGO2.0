'use client';
// Capítulo 9 · Carga viral, CD4 y clínica

import type { Lamina } from '../Lienzo';
import { Bandera, Cerrojo, Cruz, Flecha, Hombre, Linfocito, P, Reloj, Sale, Termometro, Trazo, Txt, TXV, Vagon, clamp, easeOut, lerp, tramo } from '../Piezas';

const Ejes = ({ x0, x1, y0, y1, o = 1 }: { x0: number; x1: number; y0: number; y1: number; o?: number }) => (
  <path d={`M${x0},${y1} L${x1},${y1} M${x0},${y1} L${x0},${y0}`} fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * o} />
);

// ─── 0 · Dos números ─────────────────────────────────────────────────────────
const DosNumeros: Lamina = ({ p, reloj }) => {
  const lleno = 1 - 0.65 * easeOut(p('dano'));
  return (
    <g>
      <Txt x={800} y={100} txt="los números cuentan la historia" t={42} p={p('numeros')} color={TXV.violeta} />
      {/* el recuento de CD4: un depósito que se vacía */}
      <Sale p={p('cd4')} x={330} y={520}>
        <rect x={-130} y={-240} width={260} height={480} rx={40} fill={P.sombra} transform="translate(8,9)" />
        <rect x={-130} y={-240} width={260} height={480} rx={40} fill="#DCD6F5" opacity={0.9} />
        <rect x={-116} y={-226 + 452 * (1 - lleno)} width={232} height={452 * lleno} rx={30} fill={P.cd4[1]} />
        <rect x={-116} y={-226 + 452 * (1 - lleno)} width={232} height={18} rx={9} fill={P.cd4[2]} />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-60 + (i % 3) * 60} cy={160 - Math.floor(i / 3) * 90 + (1 - lleno) * 0} r={Math.max(0, 22 * clamp((lleno - 0.12 * i / 2) * 2))} fill={P.cd4[0]} opacity={0.7} />)}
      </Sale>
      <Bandera x={330} y={230} txt="recuento de CD4" color={P.cd4[0]} p={p('cd4')} t={30} punta="no" />
      <rect x={470} y={430} width={34} height={140} rx={8} fill={P.virus[1]} opacity={0.0 + tramo(p('normal'), 0, 0.5)} />
      <Txt x={600} y={470} txt="normal: unos 500" t={26} ancla="start" p={p('r500')} color={TXV.verde} />
      <Txt x={600} y={520} txt="a 1 500 / µL" t={26} ancla="start" p={p('r1500')} color={TXV.verde} />
      <Txt x={330} y={810} txt="cuánto daño sufrió el sistema inmunitario" t={26} p={p('dano')} />
      <Txt x={330} y={860} txt="muestra el daño hecho" t={30} p={p('muestra')} color={TXV.sangre} />
      {/* la carga viral: un termómetro en escala logarítmica */}
      <Sale p={p('carga')} x={1240} y={580}><Termometro k={0.85} val={0.85} /></Sale>
      {[3, 4, 5, 6].map((e, i) => <Txt key={e} x={1320} y={513 - i * 67} txt={`10${['³', '⁴', '⁵', '⁶'][i]}`} t={26} ancla="start" p={p('carga')} fuerte={false} />)}
      <Bandera x={1240} y={170} txt="carga viral" color={P.sangre[0]} p={p('carga')} t={30} punta="no" />
      <Txt x={1240} y={790} txt="cuánta replicación hay ahora" t={26} p={p('replicacion')} />
      <Txt x={1240} y={835} txt="cuánto virus podría transmitirse" t={26} p={p('transmitirse')} color={TXV.sangre} />
      <Txt x={1240} y={895} txt="lo que viene" t={30} p={p('viene')} color={TXV.ambar} />
      <Flecha a={[640, 330]} b={[500, 330]} p={p('primero')} color="var(--cit-flecha)" w={9} />
      <Flecha a={[1000, 330]} b={[1120, 330]} p={p('segundo')} color="var(--cit-flecha)" w={9} />
    </g>
  );
};

// ─── 1 · El tren hacia el precipicio ─────────────────────────────────────────
const TrenPrecipicio: Lamina = ({ p, reloj }) => {
  const tr = easeOut(p('tren'));
  const acel = p('acelera');
  const pts: [number, number][] = [[160, 280], [300, 300], [420, 390], [560, 440], [900, 520], [1180, 570], [1290, 620], [1380, 940]];
  return (
    <g>
      <Ejes x0={160} x1={1480} y0={180} y1={900} o={p('tren')} />
      {[[160, 420, 'aguda', P.sangre], [420, 1180, 'crónica', P.cd4], [1180, 1480, 'sida', P.hla]].map(([a, b, n, tono]) => (
        <g key={n as string} opacity={tramo(p('fase'), 0, 0.5)}>
          <rect x={a as number} y={150} width={(b as number) - (a as number)} height={26} rx={13} fill={(tono as readonly string[])[1]} />
          <Txt x={((a as number) + (b as number)) / 2} y={163} txt={n as string} t={20} color="#FFF" />
        </g>
      ))}
      <Trazo pts={[[160, 880], [260, 440], [340, 300], [480, 600], [800, 640], [1100, 650], [1330, 660], [1420, 360]]} p={p('dispara')} color={P.sangre[1]} w={12} />
      <Txt x={300} y={250} txt="carga viral" t={26} p={p('dispara')} color={TXV.sangre} />
      <Trazo pts={pts} p={p('cd4')} color={P.cd4[1]} w={13} />
      <Txt x={900} y={470} txt="CD4" t={30} p={p('cd4')} color={TXV.cd4} />
      <Txt x={620} y={392} txt="caen un poco" t={24} p={p('caen')} />
      <Txt x={800} y={560} txt="luego se estabilizan, años" t={24} p={p('anos')} />
      <Txt x={1000} y={595} txt="y bajan despacio" t={24} p={p('bajan')} />
      <path d="M1300,230 L1300,900" stroke={P.espiga[1]} strokeWidth={6} strokeDasharray="14 12" opacity={p('n200')} />
      <Txt x={1300} y={205} txt="200" t={30} p={p('n200')} color={TXV.ambar} />
      <Txt x={1480} y={290} txt="la carga viral sube" t={24} p={p('sube')} color={TXV.sangre} ancla="end" />
      <Txt x={1480} y={330} txt="y aparecen las infecciones oportunistas" t={24} p={p('oportunistas')} ancla="end" />
      {/* el tren */}
      <Sale p={p('tren')} x={lerp(240, 1290 + 40 * acel, easeOut(p('lento')))} y={lerp(280, 585, easeOut(p('lento')))}><Vagon x={0} y={0} k={0.9} reloj={reloj} tono={[...P.virus]} /></Sale>
      <Txt x={800} y={790} txt="un tren que avanza lento hacia el precipicio" t={32} p={p('precipicio')} color={TXV.violeta} />
      <Txt x={800} y={842} txt="y se acelera" t={30} p={p('acelera')} color={TXV.sangre} />
    </g>
  );
};

// ─── 2 · Estadios y relación CD4/CD8 ─────────────────────────────────────────
const Estadios: Lamina = ({ p, reloj }) => {
  const inv = easeOut(p('invierte'));
  const ang = lerp(-14, 14, inv);
  return (
    <g>
      <Bandera x={330} y={110} txt="estadios del CDC" color={P.hla[0]} p={p('cdc')} t={34} punta="no" />
      {[['estadio 1', 'CD4 ≥ 500/µL', 'e1', P.virus, 250], ['estadio 2', '200 a 499', 'e2', P.espiga, 410], ['estadio 3', '< 200, < 14 % o condición definitoria', 'e3', P.sangre, 570]].map(([n, d, id, tono, y], i) => {
        const q = [p('e1'), p('e2'), p('e3')][i];
        return (
          <g key={n as string}>
            <Sale p={q} x={330} y={y as number}>
              <rect x={-250} y={-60} width={500} height={120} rx={26} fill={(tono as readonly string[])[0]} /><rect x={-246} y={-58} width={492} height={108} rx={24} fill={(tono as readonly string[])[1]} />
              <rect x={-220} y={-44} width={200} height={10} rx={5} fill="#FFF" opacity={0.5} />
            </Sale>
            <Txt x={330} y={(y as number) - 12} txt={n as string} t={38} p={q} color="#FFF" />
            <Txt x={330} y={(y as number) + 30} txt={d as string} t={(d as string).length > 14 ? 22 : 30} p={[p('n500'), p('n499'), p('definitoria')][i]} color="#FFF" />
          </g>
        );
      })}
      <Txt x={330} y={720} txt="más CD4 perdidos, más avanzado" t={26} p={p('menos')} />
      {/* la balanza CD4/CD8 */}
      <Txt x={1100} y={150} txt="la relación CD4/CD8" t={38} p={p('relacion')} color={TXV.violeta} />
      <Sale p={p('relacion')} x={1100} y={480}>
        <rect x={-14} y={-20} width={28} height={300} rx={14} fill="#7A7F9C" /><rect x={-110} y={270} width={220} height={26} rx={13} fill="#7A7F9C" />
        <g transform={`rotate(${ang})`}>
          <rect x={-290} y={-34} width={580} height={22} rx={11} fill="#B7B2DD" />
          <g transform="translate(-270,0)"><path d="M0,0 L-60,150 L60,150 Z" fill="none" stroke="#7A7F9C" strokeWidth={5} /><rect x={-80} y={146} width={160} height={24} rx={12} fill={P.cd4[1]} />
            {Array.from({ length: Math.round(lerp(5, 1, inv)) }, (_, i) => <g key={i} transform={`translate(${-48 + i * 24},120)`}><Linfocito k={0.2} /></g>)}</g>
          <g transform="translate(270,0)"><path d="M0,0 L-60,150 L60,150 Z" fill="none" stroke="#7A7F9C" strokeWidth={5} /><rect x={-80} y={146} width={160} height={24} rx={12} fill={P.hla[1]} />
            {Array.from({ length: Math.round(lerp(2, 5, inv)) }, (_, i) => <g key={i} transform={`translate(${-48 + i * 24},120)`}><Linfocito k={0.2} tono="cd8" /></g>)}</g>
        </g>
      </Sale>
      <Bandera x={830} y={340} txt="CD4" color={P.cd4[0]} p={p('relacion')} t={26} punta="no" />
      <Bandera x={1370} y={340} txt="CD8" color={P.hla[0]} p={p('relacion')} t={26} punta="no" />
      <Txt x={1100} y={820} txt="en personas sanas: mayor que 1" t={28} p={p('mayor')} color={TXV.verde} />
      <Txt x={1100} y={870} txt="con VIH se invierte: caen los CD4 y se expanden los CD8" t={26} p={p('invierte')} color={TXV.sangre} />
    </g>
  );
};

// ─── 3 · Tratar cambia la curva ──────────────────────────────────────────────
const TratarCambia: Lamina = ({ p, reloj }) => (
  <g>
    <Ejes x0={160} x1={1450} y0={160} y1={760} o={p('carga')} />
    <Txt x={800} y={110} txt="el tratamiento cambia la curva" t={40} p={p('tratamiento')} color={TXV.violeta} />
    <Trazo pts={[[170, 200], [260, 240], [330, 430], [420, 560]]} p={p('rapido')} color={P.sangre[1]} w={13} />
    <Trazo pts={[[420, 560], [600, 640], [820, 700], [1000, 720]]} p={p('despacio')} color={P.sangre[1]} w={13} />
    <path d="M1000,720 L1440,720" stroke={P.virus[1]} strokeWidth={9} opacity={p('indetectable')} />
    <Txt x={260} y={160} txt="carga viral" t={26} p={p('carga')} color={TXV.sangre} />
    <Txt x={540} y={460} txt="primero cae rápido" t={26} p={p('primero')} />
    <Txt x={540} y={500} txt="desaparecen las células de vida corta" t={22} p={p('desaparecen')} ancla="start" />
    <Txt x={900} y={600} txt="luego, despacio:" t={26} p={p('luego')} />
    <Txt x={900} y={640} txt="quedan las de vida larga" t={24} p={p('larga')} />
    <Txt x={1200} y={680} txt="indetectable" t={34} p={p('indetectable')} color={TXV.verde} />
    <Txt x={900} y={800} txt="en unos meses" t={28} p={p('meses')} />
    <Trazo pts={[[1000, 600], [1100, 560], [1220, 490], [1340, 450], [1440, 430]]} p={p('recuperan')} color={P.cd4[1]} w={13} />
    <Txt x={1230} y={400} txt="los CD4 se recuperan" t={26} p={p('cd4')} color={TXV.cd4} />
    <Txt x={1230} y={445} txt="aunque a veces no del todo" t={22} p={p('aunque')} />
    <Sale p={p('sostenido')} x={500} y={900}><Reloj k={0.5} ang={lerp(0, 1440, p('sostenido'))} /></Sale>
    <Txt x={570} y={900} txt="con tratamiento sostenido" t={30} ancla="start" p={p('sostenido')} />
    <Cruz x={1070} y={900} k={0.8} p={p('sida')} />
    <Txt x={1130} y={900} txt="no se llega al sida" t={30} ancla="start" p={p('sida')} color={TXV.verde} />
  </g>
);

// ─── 4 · Indetectable = intransmisible ───────────────────────────────────────
const Intransmisible: Lamina = ({ p, reloj }) => {
  const q96 = easeOut(p('n96'));
  return (
    <g>
      <Sale p={p('indetectable')} x={800} y={250}><Cerrojo k={1.25} /></Sale>
      <Txt x={800} y={95} txt="indetectable = intransmisible" t={52} p={p('igual')} color={TXV.verde} />
      <Txt x={800} y={440} txt="una consecuencia enorme" t={32} p={p('consecuencia')} color={TXV.violeta} />
      <Txt x={800} y={482} txt="indetectable" t={28} p={p('indetectable')} />
      <Txt x={1040} y={270} txt="intransmisible" t={34} ancla="start" p={p('intransmisible')} color={TXV.verde} />
      {/* PARTNER2: cero transmisiones */}
      <Bandera x={400} y={560} txt="PARTNER2" color={P.hla[0]} p={p('partner')} t={34} punta="no" />
      <Txt x={400} y={620} txt="casi 1 000 parejas" t={26} p={p('parejas')} />
      {[0, 1, 2, 3].map((i) => <Sale key={i} p={tramo(p('parejas'), i * 0.15, i * 0.15 + 0.5)} x={230 + i * 90} y={700}><Hombre k={0.17} piel={P.piel2} /></Sale>)}
      <Txt x={400} y={800} txt="76 000 relaciones sin preservativo" t={26} p={p('n76')} />
      <Txt x={400} y={880} txt="0" t={100} p={p('ninguna')} color={TXV.verde} />
      <Txt x={400} y={955} txt="transmisiones, con carga viral < 200 copias/mL" t={24} p={p('copias200')} />
      {/* HPTN 052: tratar temprano redujo 96 % */}
      <Bandera x={1200} y={560} txt="HPTN 052" color={P.cd4[0]} p={p('hptn')} t={34} punta="no" />
      <rect x={1020} y={620} width={110} height={300} rx={14} fill={P.hla[0]} opacity={tramo(p('temprano'), 0, 0.5)} />
      <rect x={1020} y={620 + 300 * 0.96 * q96} width={110} height={300 - 300 * 0.96 * q96} rx={14} fill={P.hla[1]} opacity={tramo(p('temprano'), 0, 0.5)} />
      <rect x={1020} y={620} width={110} height={300 * 0.96 * q96} rx={14} fill={P.virus[1]} opacity={q96} />
      <Txt x={1075} y={950} txt="tratar temprano" t={24} p={p('temprano')} />
      <Txt x={1330} y={720} txt="96 %" t={90} p={p('n96')} color={TXV.verde} />
      <Txt x={1330} y={800} txt="menos transmisiones" t={28} p={p('n96')} />
    </g>
  );
};

// ─── 5 · El paciente 1, en números ───────────────────────────────────────────
const PacienteNumeros: Lamina = ({ p, reloj }) => (
  <g>
    <Ejes x0={160} x1={1450} y0={160} y1={800} o={p('caso')} />
    <Bandera x={400} y={110} txt="el paciente 1" color={P.cd4[0]} p={p('caso')} t={34} punta="no" />
    <Trazo pts={[[200, 230], [330, 240], [520, 520], [700, 700], [820, 730], [1000, 640], [1200, 450], [1330, 330]]} p={p('baja')} color={P.sangre[1]} w={13} />
    <Txt x={300} y={190} txt="carga viral al llegar" t={26} p={p('llegar')} color={TXV.sangre} />
    <Txt x={300} y={150} txt="5,8 × 10⁶" t={46} p={p('cifra1')} color={TXV.sangre} />
    <Txt x={880} y={770} txt="con el tratamiento, baja" t={26} p={p('empieza')} color={TXV.verde} />
    <Txt x={1300} y={280} txt="7,2 × 10⁵" t={46} p={p('n720')} color={TXV.sangre} />
    <Txt x={1300} y={235} txt="ocho meses después" t={26} p={p('ocho')} />
    <Trazo pts={[[200, 560], [520, 600], [800, 660], [1050, 720], [1330, 760]]} p={p('cd4')} color={P.cd4[1]} w={13} />
    <Txt x={300} y={520} txt="CD4 480" t={34} p={p('n480')} color={TXV.cd4} />
    <Txt x={1330} y={725} txt="CD4 85" t={34} p={p('n85')} color={TXV.cd4} />
    <Flecha a={[1100, 560]} b={[1300, 380]} c={[1260, 520]} p={p('sube')} color={P.sangre[1]} w={10} />
    <Txt x={900} y={880} txt="la curva sube en vez de bajar: algo falló" t={36} p={p('falla')} color={TXV.sangre} />
    <Bandera x={800} y={950} txt="lo retomamos en el capítulo 14" color={P.hla[0]} p={p('cap14')} t={28} punta="no" />
  </g>
);

const LAMINAS: Lamina[] = [DosNumeros, TrenPrecipicio, Estadios, TratarCambia, Intransmisible, PacienteNumeros];
export default LAMINAS;
