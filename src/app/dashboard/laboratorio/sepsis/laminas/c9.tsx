'use client';
// Capítulo 9 · La coagulación se enciende en la sepsis

import type { Lamina } from '../Lienzo';
import { Antitrombina, Balanza, Bandera, Chip, Cruz, Endo, Enzima, Fibrina, Flecha, FT, Heparan, Il1, Macrofago, Respira, S, Sale, Tnf, Vaso, easeOut, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Receptor activado por proteasas (PAR): tallo fucsia con su cabeza dorada. */
const Par = ({ k = 1 }: { k?: number }) => (
  <g transform={`scale(${k})`}>
    <rect x={-9} y={-26} width={18} height={52} rx={9} fill="#8E1B9C" /><rect x={-9} y={-30} width={18} height={52} rx={9} fill="#D23AD8" />
    <ellipse cx={0} cy={-38} rx={36} ry={19} fill="#C77800" /><ellipse cx={0} cy={-41} rx={34} ry={17} fill="#FFAE1A" /><ellipse cx={-12} cy={-46} rx={11} ry={4} fill="#FFFFFF" opacity={0.6} />
  </g>
);

// ─── 0 · Se pisa el acelerador ───────────────────────────────────────────────
const Acelerador: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿qué le pasa al equilibrio?  Se pisa el acelerador" color={S.il6[0]} p={p('acelerador')} t={32} punta="no" />
    <Sale p={p('equilibrio')} x={360} y={690} k={0.8}><Balanza x={0} y={0} inclina={-0.8 * easeOut(p('acelerador'))} reloj={reloj} izq={<FT k={1.3} />} der={<Antitrombina k={1} />} /></Sale>
    <Sale p={p('monocitos')} x={340} y={370} k={1.5}><Respira reloj={reloj} amp={0.035}><Macrofago /></Respira></Sale>
    {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + 0.3; return <g key={i} opacity={tramo(p('tisular'), i * 0.1, i * 0.1 + 0.4)} transform={`translate(${340 + Math.cos(a) * 250},${370 + Math.sin(a) * 200 + Math.sin(reloj / 600 + i) * 5})`}><FT k={1.1} /></g>; })}
    <Bandera x={340} y={585} txt="monocitos y endotelio activados" color={S.nfkb[0]} p={p('endotelio')} t={26} punta="no" />
    <Sale p={p('nfkb')} x={640} y={215} k={1.3}><Chip x={0} y={0} txt="NF-κB" color={S.nfkb[0]} t={28} /></Sale>
    <Vaso x={1110} y={440} largo={1000} ancho={320} ang={0} reloj={reloj} flujo={8} o={tramo(p('micropart'), 0, 0.5)} />
    {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 4400); return <g key={i} opacity={tramo(p('vesiculas'), i * 0.08, i * 0.08 + 0.4)} transform={`translate(${lerp(640, 1560, u)},${440 + Math.sin(i * 2 + u * 5) * 70})`}><circle r={38} fill={S.fibrina[1]} opacity={0.92} /><circle cx={-12} cy={-14} r={10} fill="#FFF" opacity={0.5} /><FT k={0.8} /></g>; })}
    <Bandera x={1110} y={650} txt="micropartículas: vesículas con factor tisular" color={S.fibrina[0]} p={p('micropart')} t={26} punta="no" />
    <Bandera x={1110} y={735} txt="viajan por la sangre" color={S.fibrina[0]} p={p('viajan')} t={26} punta="no" />
    <Bandera x={1000} y={950} txt="el disparador, antes escondido, anda suelto" color={S.il1[0]} p={p('suelto')} t={30} punta="no" />
  </g>
);

// ─── 1 · Se rompe el freno 1 ─────────────────────────────────────────────────
const Freno1: Lamina = ({ p, reloj }) => {
  const rota = easeOut(p('falla')), cons = easeOut(p('consume'));
  return (
    <g>
      <Bandera x={800} y={95} txt="al mismo tiempo se rompen los frenos: ¿cuál primero?" color={S.il6[0]} p={p('frenos')} t={30} punta="no" />
      <Sale p={p('antitrombina')} x={380} y={480} k={4.2}><g opacity={1 - 0.55 * rota}><Antitrombina /></g></Sale>
      <g opacity={tramo(p('falla'), 0.1, 0.7)}><Cruz x={540} y={350} k={1.2} /></g>
      <Bandera x={380} y={680} txt="antitrombina" color={S.c5a[0]} p={p('antitrombina')} t={34} punta="no" />
      {[0, 1, 2].map((i) => (
        <Sale key={i} p={tramo(p('consume'), 0, 0.3)} x={lerp(930 + i * 70, 480 + i * 10, cons)} y={lerp(270 + i * 20, 410 + i * 55, cons)} k={1.5}><Enzima r={i * 25 + reloj / 30} /></Sale>
      ))}
      <Bandera x={840} y={205} txt="se consume al frenar tanta trombina" color={S.tnf[0]} p={p('consume')} t={26} punta="no" />
      <Sale p={p('permeable')} x={1240} y={540} k={1.7}><Endo w={300} h={90} gluco={0.2} activa={1} /></Sale>
      {Array.from({ length: 4 }, (_, i) => { const u = corre(reloj, i, 4, 3400); return <g key={i} opacity={tramo(p('fuga'), 0, 0.4) * (1 - u * 0.45)} transform={`translate(${1130 + i * 75},${lerp(600, 900, u)})`}><Antitrombina k={0.95} /></g>; })}
      <Bandera x={1240} y={395} txt="se fuga por el endotelio permeable" color={S.il1[0]} p={p('permeable')} t={26} punta="no" />
      <Sale p={p('heparan')} x={880} y={700} k={2.4}><Heparan n={5} /></Sale>
      <g opacity={tramo(p('heparan'), 0.4, 1)}><Cruz x={960} y={640} k={0.9} /></g>
      <Bandera x={880} y={830} txt="pierde el sulfato de heparán que la aceleraba" color={S.gluco[0]} p={p('heparan')} t={24} punta="no" />
      <Bandera x={380} y={780} txt="mucha trombina y poca antitrombina" color={S.il1[0]} p={p('mucha')} t={26} punta="no" />
      <Bandera x={800} y={960} txt="el primer freno falla" color={S.il1[0]} p={p('falla')} t={38} punta="no" />
    </g>
  );
};

// ─── 2 · Se rompe el freno 2 ─────────────────────────────────────────────────
const Freno2: Lamina = ({ p, reloj }) => {
  const pierde = easeOut(p('pierde'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y el segundo freno?  La proteína C" color={S.il6[0]} p={p('segundo')} t={32} punta="no" />
      <Endo x={500} y={735} w={640} h={170} gluco={0.15} activa={0.8} />
      <Sale p={p('trombomodulina')} x={360} y={575} k={2.6}><g opacity={1 - 0.7 * pierde}><rect x={-9} y={-30} width={18} height={60} rx={9} fill="#B000C8" /><ellipse cx={0} cy={-40} rx={34} ry={20} fill="#FFAE1A" /></g></Sale>
      <Sale p={p('epcr')} x={650} y={575} k={2.6}><g opacity={1 - 0.7 * pierde}><rect x={-9} y={-30} width={18} height={60} rx={9} fill="#0A6F78" /><ellipse cx={0} cy={-40} rx={30} ry={18} fill="#16B9BE" /></g></Sale>
      <g opacity={tramo(p('pierde'), 0, 0.5)}><Cruz x={420} y={470} k={0.9} /><Cruz x={700} y={470} k={0.9} /></g>
      <Bandera x={340} y={395} txt="trombomodulina" color={S.lps[0]} p={p('trombomodulina')} t={26} punta="no" />
      <Bandera x={670} y={395} txt="EPCR" color={S.c5a[0]} p={p('epcr')} t={26} punta="no" />
      <Bandera x={500} y={895} txt="el endotelio dañado los pierde" color={S.il1[0]} p={p('pierde')} t={26} punta="no" />
      <Sale p={p('proteinac')} x={1190} y={290} k={1.3}><Chip x={0} y={0} txt="proteína C" color={S.il6[0]} t={32} /></Sale>
      <Flecha a={[1190, 340]} b={[1190, 470]} p={tramo(p('poca'), 0, 0.8)} color={S.il6[1]} w={6} />
      <g opacity={0.3 + 0.2 * tramo(p('poca'), 0, 1)}><Sale p={p('poca')} x={1190} y={520} k={1.2}><Chip x={0} y={0} txt="proteína C activada" color={S.il6[1]} t={26} /></Sale></g>
      <Bandera x={1190} y={620} txt="se activa poca" color={S.il1[0]} p={p('poca')} t={28} punta="no" />
      <Sale p={p('antiinflamatoria')} x={1190} y={770} k={2.2}><g transform={`rotate(${Math.sin(reloj / 900) * 4})`}><Il1 /></g></Sale>
      <g opacity={tramo(p('antiinflamatoria'), 0.3, 1)}><Cruz x={1290} y={720} k={0.9} /></g>
      <Bandera x={1190} y={890} txt="además era antiinflamatoria" color={S.il1[0]} p={p('antiinflamatoria')} t={26} punta="no" />
      <Bandera x={800} y={965} txt="se pierde un freno doble" color={S.il1[0]} p={p('doble')} t={38} punta="no" />
    </g>
  );
};

// ─── 3 · El freno 3 no alcanza ───────────────────────────────────────────────
const Freno3: Lamina = ({ p, reloj }) => {
  const n = Math.round(12 * tramo(p('tanto'), 0, 1));
  return (
    <g>
      <Bandera x={800} y={95} txt="el tercer freno sigue ahí: el TFPI" color={S.il6[0]} p={p('tercer')} t={32} punta="no" />
      <Sale p={p('tfpi')} x={280} y={520} k={2.1}><g><rect x={-90} y={-44} width={180} height={88} rx={44} fill={S.c5a[0]} /><rect x={-86} y={-48} width={172} height={80} rx={40} fill={S.c5a[1]} /><ellipse cx={-40} cy={-30} rx={32} ry={7} fill="#FFF" opacity={0.5} /><text y={12} textAnchor="middle" fontSize={38} fontWeight={800} fill="#FFF">TFPI</text></g></Sale>
      <Bandera x={280} y={700} txt="diseñado para un disparo normal" color={S.c5a[0]} p={p('disparo')} t={26} punta="no" />
      {Array.from({ length: 12 }, (_, i) => {
        const fila = i % 3, u = corre(reloj, i, 12, 7000), vis = i < n;
        return <g key={i} opacity={vis ? 1 : 0} transform={`translate(${lerp(1560, 560, u)},${330 + fila * 160 + Math.sin(i * 2 + reloj / 420) * 10})`}><FT k={3} /></g>;
      })}
      <Bandera x={1130} y={215} txt="tanto factor tisular, en tantas células a la vez" color={S.fibrina[0]} p={p('celulas')} t={26} punta="no" />
      <Bandera x={800} y={830} txt="no alcanza" color={S.il1[0]} p={p('alcanza')} t={44} punta="no" />
      <Bandera x={420} y={925} txt="un portero contra un equipo entero de delanteros" color={S.tnf[0]} p={p('delanteros')} t={28} punta="no" />
      <Bandera x={1250} y={925} txt="aunque funcione, llega tarde" color={S.il1[0]} p={p('tarde')} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · La fibrinólisis se apaga ────────────────────────────────────────────
const Fibrinolisis: Lamina = ({ p, reloj }) => {
  const f = 0.4 + 0.6 * easeOut(p('produce')), w = (a: number) => Math.sin(reloj / 700 + a) * 2;
  return (
    <g>
      <Bandera x={800} y={95} txt="queda la última defensa: limpiar los coágulos" color={S.il6[0]} p={p('defensa')} t={32} punta="no" />
      <Fibrina x={1020} y={520} w={780 * f} rota={w(0)} />
      <Fibrina x={1020} y={610} w={700 * f} rota={14 + w(1)} />
      <Fibrina x={1020} y={430} w={640 * f} rota={-12 + w(2)} />
      <Sale p={p('plasmina')} x={360} y={560} k={3.4}><g opacity={0.4}><Enzima /></g></Sale>
      <g opacity={tramo(p('plasmina'), 0.2, 0.8)}><Cruz x={470} y={450} k={1.1} /></g>
      <Bandera x={360} y={740} txt="la plasmina casi no se activa" color={S.il1[0]} p={p('plasmina')} t={26} punta="no" />
      <Sale p={p('pai')} x={360} y={300} k={1.4}><g><circle r={56} fill={S.il1[0]} /><circle cx={-3} cy={-3} r={50} fill={S.il1[1]} /><text y={10} textAnchor="middle" fontSize={26} fontWeight={800} fill="#FFF">PAI-1</text></g></Sale>
      <Flecha a={[360, 385]} b={[360, 450]} p={tramo(p('inhibidor'), 0, 0.8)} color={S.il1[1]} w={9} />
      <Bandera x={640} y={205} txt="sube PAI-1, el inhibidor de la fibrinólisis" color={S.il1[0]} p={p('inhibidor')} t={24} punta="no" />
      <Bandera x={1020} y={760} txt="la fibrina que se forma no se limpia" color={S.fibrina[0]} p={p('limpia')} t={28} punta="no" />
      <Bandera x={800} y={940} txt="más fibrina que se produce, menos fibrina que se retira" color={S.il1[0]} p={p('retira')} t={30} punta="no" />
    </g>
  );
};

// ─── 5 · Un círculo vicioso ──────────────────────────────────────────────────
const Circulo: Lamina = ({ p, reloj }) => {
  const R = 270, cx = 800, cy = 590, anillo = tramo(p('circulo'), 0, 1);
  const flecha = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return <path key={deg} d="M-16,-20 L26,0 L-16,20 z" fill={S.il1[0]} transform={`translate(${cx + Math.cos(a) * R},${cy + Math.sin(a) * R}) rotate(${deg + 90})`} opacity={anillo} />;
  };
  return (
    <g>
      <Bandera x={800} y={95} txt="¿dónde termina todo esto?  En un círculo" color={S.il6[0]} p={p('circulo')} t={32} punta="no" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={S.il1[1]} strokeWidth={14} strokeDasharray="46 28" strokeDashoffset={-reloj / 18} strokeLinecap="round" opacity={0.55 * anillo} />
      {[-30, 90, 210].map(flecha)}
      <circle cx={cx} cy={cy - R} r={96} fill="var(--se-fondo-a)" opacity={0.9 * tramo(p('trombina'), 0, 0.4)} />
      <Sale p={p('trombina')} x={cx} y={cy - R} k={2.3}><g transform={`rotate(${reloj / 60})`}><Enzima /></g></Sale>
      <Bandera x={cx} y={cy - R - 125} txt="trombina" color={S.tnf[0]} p={p('trombina')} t={30} punta="no" />
      <circle cx={cx + R * 0.866} cy={cy + R * 0.5} r={92} fill="var(--se-fondo-a)" opacity={0.9 * tramo(p('receptores'), 0, 0.4)} />
      <Sale p={p('receptores')} x={cx + R * 0.866} y={cy + R * 0.5 + 12} k={1.5}><Par /></Sale>
      <Bandera x={1360} y={700} txt="receptores activados por proteasas" color={S.lps[0]} p={p('proteasas')} t={24} punta="no" />
      <Bandera x={1340} y={785} txt="en endotelio y células inmunitarias" color={S.linfo[0]} p={p('inmunitarias')} t={24} punta="no" />
      <circle cx={cx - R * 0.866} cy={cy + R * 0.5} r={100} fill="var(--se-fondo-a)" opacity={0.9 * tramo(p('citocinas'), 0, 0.4)} />
      <Sale p={p('citocinas')} x={cx - R * 0.866 - 28} y={cy + R * 0.5} k={1.5}><Tnf /></Sale>
      <Sale p={p('tisular')} x={cx - R * 0.866 + 44} y={cy + R * 0.5 + 24} k={1.3}><FT /></Sale>
      <Bandera x={300} y={850} txt="más citocinas y más factor tisular" color={S.tnf[0]} p={p('tisular')} t={24} punta="no" />
      <Bandera x={cx} y={cy - 40} txt="inflamación" color={S.il1[0]} p={p('inflamacion')} t={36} punta="no" />
      <Bandera x={cx} y={cy + 50} txt="coagulación" color={S.fibrina[0]} p={p('coagulacion')} t={36} punta="no" />
      <Bandera x={800} y={965} txt="un círculo vicioso que se acelera" color={S.il1[0]} p={p('vicioso')} t={34} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Acelerador, Freno1, Freno2, Freno3, Fibrinolisis, Circulo];
export default LAMINAS;
