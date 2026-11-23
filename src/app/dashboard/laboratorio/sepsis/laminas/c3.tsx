'use client';
// Capítulo 3 · Caliente y luego frío

import type { Lamina } from '../Lienzo';
import { Bandera, Barra, Cuerpo, Corazon, Cruz, Flecha, Gota, Hematie, Il1, Late, Mano, Manometro, NO, S, Sale, Tnf, TuboOrina, Txt, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Glóbulos que corren por un tubo de y = yc, de x0 a x1 (rápido o lento). */
const Flujo2 = ({ x0, x1, yc, n, reloj, periodo, o = 1, k = 0.4 }: { x0: number; x1: number; yc: number; n: number; reloj: number; periodo: number; o?: number; k?: number }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${lerp(x0, x1, ((reloj / periodo + i / n) % 1))},${yc + Math.sin(i * 3 + reloj / 700) * 4})`}><Hematie k={k} /></g>)}
  </g>
);

// ─── 0 · La fórmula de la presión ────────────────────────────────────────────
const Formula: Lamina = ({ p, reloj }) => {
  const aprieta = easeOut(p('boquilla'));
  const ab = 70 - 38 * aprieta;
  return (
    <g>
      <Sale p={p('bomba')} x={300} y={470} k={0.7}><Late reloj={reloj} bpm={70}><Corazon /></Late></Sale>
      <Bandera x={300} y={290} txt="la bomba: el corazón" color={S.il1[0]} p={p('bomba')} t={26} punta="abajo" />
      <g opacity={tramo(p('manguera'), 0, 0.5)}>
        <path d="M430,500 C600,500 700,420 900,420 L1090,420" fill="none" stroke="#1E4FC0" strokeWidth={84} strokeLinecap="round" />
        <path d="M430,500 C600,500 700,420 900,420 L1090,420" fill="none" stroke="#4F7FF0" strokeWidth={70} strokeLinecap="round" />
        <path d="M470,480 C600,480 700,400 900,400 L1050,400" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.4} />
        <path d={`M1090,${420 - 42} L1230,${420 - ab / 2} L1230,${420 + ab / 2} L1090,${420 + 42} Z`} fill="#C99300" /><path d={`M1090,${420 - 38} L1226,${420 - ab / 2 + 3} L1226,${420 + ab / 2 - 3} L1090,${420 + 38} Z`} fill="#FFD23F" />
        {Array.from({ length: 7 }, (_, i) => { const u = ((reloj / 900 + i / 7) % 1); return <circle key={i} cx={lerp(1230, 1470, u)} cy={420 + (hash(i, 3) - 0.5) * 40 * u} r={7 * (1 - u * 0.5)} fill="#7FD0F5" opacity={0.85 * (1 - u) * tramo(p('manguera'), 0.3, 0.8)} />; })}
      </g>
      <Bandera x={1160} y={300} txt="la boquilla aprieta: la resistencia" color={S.nfkb[0]} p={p('boquilla')} t={26} punta="abajo" />
      <Sale p={p('presion')} x={830} y={250} k={0.8}><Manometro x={0} y={0} val={0.5} /></Sale>
      <Bandera x={830} y={170} txt="presión arterial media" color={S.il6[0]} p={p('media')} t={28} punta="no" />
      <Bandera x={290} y={720} txt="gasto cardíaco" color={S.il1[0]} p={p('gasto')} t={30} punta="no" />
      <Txt x={510} y={724} txt="×" t={56} p={p('resistencia')} />
      <Bandera x={780} y={720} txt="resistencia vascular sistémica" color={S.nfkb[0]} p={p('resistencia')} t={30} punta="no" />
      <Bandera x={1250} y={720} txt="= PAM" color={S.il6[0]} p={p('media')} t={36} punta="no" />
      <Bandera x={800} y={840} txt="PAM ≈ (sistólica + 2 × diastólica) / 3" color={S.c5a[0]} p={p('estima')} t={30} punta="no" />
      <Bandera x={800} y={930} txt="si una baja, la otra tiene que subir" color={S.il6[0]} p={p('baja')} t={30} punta="no" />
    </g>
  );
};

// ─── 1 · Choque cálido ───────────────────────────────────────────────────────
const ChoqueCalido: Lamina = ({ p, reloj }) => {
  const manos = easeOut(p('manos'));
  const glow = (x: number, y: number, r: number, i: number) => <circle cx={x} cy={y} r={r + 6 * Math.sin(reloj / 300 + i)} fill="#FF8A1E" opacity={0.42 * manos} />;
  return (
    <g>
      <Sale p={p('manos')} x={430} y={540} k={0.82}><Cuerpo /></Sale>
      {glow(250, 520, 66, 0)}{glow(610, 520, 66, 1)}{glow(375, 840, 70, 2)}{glow(490, 840, 70, 3)}
      <g opacity={tramo(p('rubor'), 0, 0.5)}><circle cx={430} cy={250} r={64} fill="#FF5D6C" opacity={0.36} /></g>
      <Bandera x={430} y={110} txt="manos calientes y piel ruborizada" color={S.tnf[0]} p={p('rubor')} t={28} punta="no" />
      <Sale p={p('tnf')} x={900} y={250} k={1.4}><Tnf /></Sale>
      <Sale p={p('il1')} x={1010} y={250} k={1.4}><Il1 /></Sale>
      <Sale p={p('no')} x={1120} y={250} k={1.6}><NO /></Sale>
      <Bandera x={1010} y={330} txt="TNF-α · IL-1 · óxido nítrico" color={S.tnf[0]} p={p('no')} t={26} punta="no" />
      <Flecha a={[1010, 360]} b={[1010, 450]} p={tramo(p('dilatan'), 0, 0.8)} color={S.tnf[1]} w={8} />
      <g opacity={tramo(p('dilatan'), 0, 0.4)}>
        <rect x={820} y={470 - 22 - 40 * easeOut(p('dilatan'))} width={400} height={44 + 80 * easeOut(p('dilatan'))} rx={30} fill="#B02FA0" /><rect x={824} y={474 - 22 - 40 * easeOut(p('dilatan'))} width={392} height={36 + 80 * easeOut(p('dilatan'))} rx={26} fill="#7A1E3A" />
        <Flujo2 x0={850} x1={1190} yc={490} n={5} reloj={reloj} periodo={1500} k={0.34} o={tramo(p('dilatan'), 0.3, 0.8)} />
      </g>
      <Bandera x={1020} y={650} txt="arterias y venas se dilatan: la resistencia cae" color={S.nfkb[0]} p={p('cae')} t={26} punta="no" />
      <Sale p={p('corazon')} x={940} y={810} k={0.5}><Late reloj={reloj} bpm={130} fuerza={1.6}><Corazon /></Late></Sale>
      <Bandera x={1120} y={810} txt="late más rápido y bombea más sangre" color={S.il1[0]} p={p('rapido')} t={26} punta="der" ancla="izq" />
      <Bandera x={1050} y={940} txt="fase hiperdinámica: el choque cálido" color={S.tnf[0]} p={p('calido')} t={34} punta="no" />
    </g>
  );
};

// ─── 2 · El pulso saltón (y la errata del resumen) ───────────────────────────
const PulsoSalton: Lamina = ({ p, reloj }) => {
  const onda = (x0: number, y0: number, alto: number, subida: number, q: number, color: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 90; i++) {
      const t = i / 90 * 3;
      const f = t % 1;
      const y = f < subida ? Math.sin((f / subida) * Math.PI / 2) : Math.exp(-(f - subida) * 4.2);
      pts.push(`${(x0 + i * 4.6).toFixed(1)},${(y0 - alto * y).toFixed(1)}`);
    }
    return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp(q)} />;
  };
  return (
    <g>
      <Bandera x={430} y={100} txt="¿saltón es lo mismo que ancho?" color={S.il6[0]} p={p('pulso')} t={30} punta="no" />
      {onda(240, 560, 250, 0.1, p('velocidad'), S.tnf[1])}
      <path d="M220,580 L220,260 M220,580 L660,580" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.4 * tramo(p('velocidad'), 0, 0.3)} />
      <Bandera x={430} y={650} txt="sube y cae rápido: la onda del pulso saltón" color={S.tnf[0]} p={p('volumen')} t={26} punta="no" />
      <Sale p={p('sube')} x={1040} y={420} k={1}><text textAnchor="middle" fontSize={84} fontWeight={800} fill="var(--se-ambar)">¿sube?</text></Sale>
      <Barra x={880} y={520} w={560} h={46} val={42 / 60} color={S.nfkb[1]} txt="presión de pulso al ingreso" valor="42 mmHg" p={p('cuarentaydos')} />
      <Barra x={880} y={640} w={560} h={46} val={36 / 60} color={S.il1[1]} txt="presión de pulso 4 horas después" valor="36 mmHg" p={p('treintayseis')} />
      <Flecha a={[840, 545]} b={[840, 645]} p={tramo(p('bajan'), 0, 0.8)} color={S.il1[1]} w={9} />
      <Sale p={p('errata')} x={1010} y={230} k={1}><Cruz k={1.2} /></Sale>
      <Bandera x={1130} y={230} txt="errata del resumen: dice que aumentó" color={S.il1[0]} p={p('errata')} t={26} punta="no" />
      <Bandera x={1010} y={790} txt="sus propias cifras la bajan" color={S.il1[0]} p={p('bajan')} t={30} punta="no" />
      <Bandera x={800} y={930} txt="saltón no es lo mismo que ancho" color={S.il6[0]} p={p('ancho')} t={34} punta="no" />
    </g>
  );
};

// ─── 3 · La trampa de la piel caliente ───────────────────────────────────────
const TrampaPiel: Lamina = ({ p, reloj }) => {
  const f = p('flujo');
  return (
    <g>
      <Bandera x={800} y={100} txt="cuidado con la piel caliente: engaña" color={S.tnf[0]} p={p('engana')} t={34} punta="no" />
      <Sale p={p('extremidades')} x={290} y={440} k={1.1}>
        <circle r={150 + 7 * Math.sin(reloj / 300)} fill="#FF8A1E" opacity={0.3} /><Mano />
      </Sale>
      <Bandera x={290} y={640} txt="extremidades calientes" color={S.tnf[0]} p={p('extremidades')} t={26} punta="no" />
      <Sale p={p('lactato')} x={1330} y={400} k={1.8}><Gota tono={S.lactato as unknown as string[]} /></Sale>
      <Bandera x={1330} y={600} txt="lactato 5,2 mmol/L" color={S.lactato[0]} p={p('lactato')} t={30} punta="no" />
      <Txt x={840} y={275} txt="¿cómo puede ser?" t={46} p={p('puede')} color="var(--se-ambar)" />
      <g opacity={tramo(f, 0, 0.4)}>
        <rect x={560} y={400} width={560} height={70} rx={35} fill="#B02FA0" /><rect x={564} y={404} width={552} height={62} rx={31} fill="#7A1E3A" />
        <Flujo2 x0={590} x1={1090} yc={435} n={6} reloj={reloj} periodo={1000} k={0.3} />
        <rect x={560} y={550} width={560} height={70} rx={35} fill="#B02FA0" /><rect x={564} y={554} width={552} height={62} rx={31} fill="#7A1E3A" />
        <Flujo2 x0={590} x1={1090} yc={585} n={1} reloj={reloj} periodo={9000} k={0.3} />
        <circle cx={840} cy={720} r={46} fill={S.gris[1]} /><circle cx={836} cy={716} r={40} fill={S.gris[2]} /><circle cx={836} cy={716} r={16} fill={S.gris[0]} />
      </g>
      <Bandera x={840} y={365} txt="los vasos más abiertos se llevan la sangre" color={S.nfkb[0]} p={p('abiertos')} t={24} punta="no" />
      <Bandera x={840} y={810} txt="el tejido que la necesita no la recibe" color={S.il1[0]} p={p('necesitan')} t={26} punta="no" />
      <Bandera x={800} y={930} txt="piel caliente no quiere decir tejidos bien regados" color={S.il6[0]} p={p('regados')} t={32} punta="no" />
    </g>
  );
};

// ─── 4 · Choque frío ─────────────────────────────────────────────────────────
const ChoqueFrio: Lamina = ({ p, reloj }) => {
  const frio = easeOut(p('periferia'));
  return (
    <g>
      <Bandera x={800} y={100} txt="con las horas el panorama se invierte" color={S.c5a[0]} p={p('invierte')} t={34} punta="no" />
      <Sale p={p('periferia')} x={430} y={560} k={0.78}><Cuerpo /></Sale>
      {[[250, 530, 66], [610, 530, 66], [375, 850, 70], [490, 850, 70]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#4F7FF0" opacity={0.5 * frio} />)}
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={300 + hash(i, 1) * 260} cy={420 + hash(i, 2) * 440} r={6 + hash(i, 3) * 10} fill="#7A3FB0" opacity={0.5 * tramo(p('piel'), i / 20, i / 20 + 0.3)} />)}
      <Bandera x={430} y={940} txt="piel fría y moteada" color={S.c5a[0]} p={p('piel')} t={28} punta="no" />
      <Sale p={p('corazon')} x={940} y={330} k={0.5}><Late reloj={reloj} bpm={55} fuerza={0.5}><Corazon /></Late></Sale>
      <Bandera x={1120} y={330} txt="el corazón se deprime" color={S.il1[0]} p={p('corazon')} t={26} punta="der" ancla="izq" />
      <Bandera x={1120} y={410} txt="el volumen se fuga por el endotelio" color={S.il1[0]} p={p('fuga')} t={24} punta="der" ancla="izq" />
      <Bandera x={1120} y={490} txt="el gasto cardíaco cae" color={S.il1[0]} p={p('gasto')} t={26} punta="der" ancla="izq" />
      <Bandera x={1120} y={570} txt="la periferia se contrae" color={S.c5a[0]} p={p('periferia')} t={26} punta="der" ancla="izq" />
      <Bandera x={1120} y={650} txt="relleno capilar lento" color={S.c5a[0]} p={p('relleno')} t={26} punta="der" ancla="izq" />
      <Sale p={p('orina')} x={1000} y={800} k={0.7}><TuboOrina oscuro={0.9} /></Sale>
      <Bandera x={1190} y={800} txt="muy poca orina" color={S.lactato[0]} p={p('orina')} t={26} punta="der" ancla="izq" />
      <Bandera x={1130} y={930} txt="fase hipodinámica: el choque frío" color={S.c5a[0]} p={p('hipo')} t={34} punta="no" />
    </g>
  );
};

// ─── 5 · Una misma cascada ───────────────────────────────────────────────────
const MismaCascada: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={100} txt="¿dos enfermedades distintas?  No: dos momentos" color={S.il6[0]} p={p('dos')} t={36} punta="no" />
    <Sale p={p('momentos')} x={400} y={430} k={0.62}><Late reloj={reloj} bpm={130}><Corazon /></Late></Sale>
    <rect x={250} y={600} width={300} height={70 * (1 + 0.6 * easeOut(p('abre')))} rx={35} fill="#B02FA0" />
    <rect x={254} y={604} width={292} height={62 * (1 + 0.6 * easeOut(p('abre')))} rx={31} fill="#7A1E3A" opacity={tramo(p('abre'), 0, 0.3)} />
    <Bandera x={400} y={790} txt="el vaso se abre y el corazón corre" color={S.tnf[0]} p={p('abre')} t={26} punta="no" />
    <Flecha a={[600, 480]} b={[1000, 480]} p={tramo(p('cansa'), 0, 0.9)} color={S.il6[1]} w={14} />
    <Sale p={p('cansa')} x={1200} y={430} k={0.62}><Late reloj={reloj} bpm={55} fuerza={0.4}><Corazon /></Late></Sale>
    <rect x={1050} y={620} width={300} height={34} rx={17} fill="#B02FA0" /><rect x={1054} y={624} width={292} height={26} rx={13} fill="#7A1E3A" opacity={tramo(p('cansa'), 0, 0.3)} />
    <Bandera x={1200} y={790} txt="el corazón se cansa y el vaso se cierra" color={S.c5a[0]} p={p('cansa')} t={26} punta="no" />
    <Bandera x={420} y={900} txt="cap. 12: por qué el vaso deja de obedecer" color={S.il6[0]} p={p('doce')} t={26} punta="no" />
    <Bandera x={1180} y={900} txt="cap. 13: de dónde sale el lactato" color={S.lactato[0]} p={p('trece')} t={26} punta="no" />
    <Bandera x={800} y={970} txt="antes, cómo empezó todo" color={S.il6[0]} p={p('antes')} t={26} punta="no" />
  </g>
);

const LAMINAS: Lamina[] = [Formula, ChoqueCalido, PulsoSalton, TrampaPiel, ChoqueFrio, MismaCascada];
export default LAMINAS;
