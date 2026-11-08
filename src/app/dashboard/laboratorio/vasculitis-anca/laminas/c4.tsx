'use client';
// Capítulo 4 · Cuatro formas de romper un vaso: inmunocomplejos, ANCA, granuloma y
// respuesta tipo 2, con el complemento como amplificador.

import type { Lamina } from '../Lienzo';
import { Medula, Pastilla } from '../../citopenias-autoinmunes/Piezas';
import { Barra, Cruz, Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Anca, Bandera, Bola, C5a, CelEndo, CelGigante, Complejo, Corazon, En, Eosinofilo, Epitelioide, Flecha, FLECHA, Foco, Glomerulo, Granuloma, Hematie, IgG, Linfocito, Macrofago, Mpo, Net, Neutrofilo, Plasmatica, Pr3, Sale, Txt, V, blob, clamp, easeOut, hash, lerp, tramo } from '../Piezas';
import { Basal, Endo, Intersticio, Union } from '../Fisio';

/** Pared vista de canto: endotelio sobre la basal, de x0 a x1. */
function Pared({ y = 640, x0 = 80, x1 = 1520, w = 180, o = 1, rota = 0, tono }: { y?: number; x0?: number; x1?: number; w?: number; o?: number; rota?: number; tono?: string[] }) {
  const n = Math.round((x1 - x0) / w);
  return (
    <g opacity={o}>
      <Intersticio y={y + 48} alto={y + 160} x0={x0 - 20} x1={x1 + 20} />
      <Basal x0={x0 - 20} x1={x1 + 20} y={y + 28} h={20} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + w * (i + 0.5), centro = Math.abs(cx - (x0 + x1) / 2) < w * 1.2;
        return <Endo key={i} x={cx} y={y + 28} w={w - 6} h={58} o={centro ? 1 - 0.6 * rota : 1} activa={tono ? 1 : 0} muere={centro ? 0.5 * rota : 0} sem={i + 5} />;
      })}
      {Array.from({ length: n - 1 }, (_, i) => <Union key={i} x={x0 + w * (i + 1)} y={y + 28} h={58} />)}
      {rota > 0.01 && <path d={blob(10, 150, 0.2, 5, 2)} transform={`translate(${(x0 + x1) / 2},${y + 40}) scale(${(0.4 + 0.6 * rota).toFixed(2)},0.45)`} fill="#E86AA8" opacity={0.7 * rota} />}
    </g>
  );
}

/** Bucle de flechas entre nodos (círculo vicioso). */
function Bucle({ cx, cy, R, n, p, color = FLECHA }: { cx: number; cy: number; R: number; n: number; p: number; color?: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.38, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.38, am = (a0 + a1) / 2;
        return <Flecha key={i} a={[cx + Math.cos(a0) * R, cy + Math.sin(a0) * R]} b={[cx + Math.cos(a1) * R, cy + Math.sin(a1) * R]} c={[cx + Math.cos(am) * R * 1.18, cy + Math.sin(am) * R * 1.18]} p={tramo(p, i / n, (i + 1) / n)} color={color} w={8} />;
      })}
    </>
  );
}

/** Célula dendrítica: estrella con prolongaciones. */
function Dendritica({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={blob(14, 80, 0.45, 21)} fill="#0E7490" />
      <path d={blob(14, 72, 0.45, 21)} fill="#14A7BF" transform="translate(-4,-4)" />
      <circle r={26} fill="#0A5468" /><circle cx={-6} cy={-6} r={10} fill="#8EEBF2" />
    </En>
  );
}

/** Estafilococo: racimo de bolitas amarillas. */
function Estafilo({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}>{[[0, 0], [22, -6], [-20, 8], [8, 20], [-6, -20], [26, 16]].map(([a, b], i) => <Bola key={i} x={a} y={b} R={12} tono={V.ambar} />)}</En>;
}

const Cuatro: Lamina = ({ p, reloj }) => {
  const amp = p('complemento');
  const items: [string, string, string][] = [['ic', 'Inmunocomplejos', '#2F6FD8'], ['anca', 'ANCA', V.anca[1]], ['granuloma', 'Inflamación granulomatosa', V.violeta[1]], ['tipo2', 'Respuesta tipo 2', V.eos[0]]];
  return (
    <g>
      <Bandera x={800} y={80} txt="Cuatro mecanismos que verás una y otra vez" color="var(--cit-base)" p={p('cuatro')} t={30} punta="no" />
      {amp > 0.01 && <rect x={120} y={260 - 30 * Math.sin(reloj / 300) * amp} width={1360} height={340} rx={60} fill={V.c5a[1]} opacity={0.12 * amp} />}
      <Sale p={p('ic')} x={260} y={420}>{[0, 1, 2].map((i) => <Complejo key={i} x={(i - 1) * 60} y={(i % 2) * 40 - 20} k={1.3} r={i * 50} />)}</Sale>
      <Sale p={p('anca')} x={620} y={420}><Neutrofilo k={1.1} cebado={1} /><Anca x={80} y={-40} r={-60} k={1.1} /></Sale>
      <Granuloma x={980} y={420} k={0.4} p={p('granuloma')} />
      <Sale p={p('tipo2')} x={1340} y={420} k={1.2}><Eosinofilo /></Sale>
      {items.map(([n, txt, col], i) => <Bandera key={n} x={260 + i * 360} y={600} txt={txt} color={col} p={p(n)} t={22} punta="no" />)}
      {[0, 1, 2, 3, 4].map((i) => <C5a key={i} x={300 + i * 250} y={760 + Math.sin(reloj / 260 + i) * 8} k={1.4} o={tramo(p('uno'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Bandera x={800} y={860} txt="El complemento: no rompe solo, lo amplifica todo" color={V.c5a[0]} p={amp} t={28} />
      <Txt x={800} y={940} txt="en el paciente real se mezclan" t={26} p={p('mezclan')} fuerte={false} />
    </g>
  );
};

const Tipo3: Lamina = ({ p, reloj }) => {
  const f = p('forman');
  return (
    <g>
      <Bandera x={800} y={80} txt="1 · Inmunocomplejos: hipersensibilidad tipo III" color="#2F6FD8" p={p('tipo3')} t={30} punta="no" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Bola x={lerp(160 + i * 60, 280, easeOut(f))} y={lerp(220 + i * 30, 300, easeOut(f))} R={14} tono={CC_VERDE} o={1 - tramo(f, 0.8, 1)} />
          <IgG x={lerp(420 - i * 30, 300, easeOut(f))} y={lerp(380 - i * 30, 300, easeOut(f))} r={i * 60} k={1} o={(1 - tramo(f, 0.8, 1)) * tramo(p('tipo3'), 0, 0.4)} />
        </g>
      ))}
      <Sale p={tramo(f, 0.7, 1)} x={290} y={300} k={1.6}><Complejo /></Sale>
      <Txt x={290} y={430} txt="antígeno + anticuerpo" t={24} p={f} />
      <Sale p={p('grandes')} x={720} y={300} k={1.6}>{[0, 1, 2, 3].map((i) => <Complejo key={i} x={(i % 2) * 40 - 20} y={Math.floor(i / 2) * 40 - 20} r={i * 40} />)}</Sale>
      <Sale p={p('grandes')} x={720} y={300} k={0.26}><En x={210} y={0}><Macrofago /></En></Sale>
      <Txt x={720} y={430} txt="grandes: los limpian los fagocitos" t={22} p={p('grandes')} />
      <Sale p={p('pequenos')} x={1080} y={300} k={0.8}><Complejo n={2} /></Sale>
      <Flecha a={[1120, 300]} b={[1220, 300]} p={p('pequenos')} color={FLECHA} w={6} />
      <Txt x={1100} y={430} txt="pequeños: circulan sin daño" t={22} p={p('pequenos')} />
      <Sale p={p('medianos')} x={800} y={600} k={2}><Complejo n={3} r={reloj * 0.02} /></Sale>
      <Bandera x={800} y={730} txt="Medianos, con exceso de antígeno: los peligrosos" color={V.sangre[0]} p={p('medianos')} t={26} />
      <Txt x={800} y={800} txt="se atascan donde el flujo es turbulento o se filtra mucho" t={24} p={p('atascan')} fuerte={false} />
      <Sale p={p('sitios')} x={480} y={900} k={0.2}><Glomerulo /></Sale>
      <Txt x={590} y={900} txt="glomérulos" t={24} p={p('sitios')} ancla="start" />
      <Txt x={880} y={900} txt="piel" t={24} p={tramo(p('sitios'), 0.2, 1)} />
      <Txt x={1100} y={900} txt="articulaciones" t={24} p={tramo(p('sitios'), 0.4, 1)} />
    </g>
  );
};
const CC_VERDE = ['#11804F', '#23B26C', '#7BE3A4'];

const Depositados: Lamina = ({ p }) => {
  const ll = p('llaman'), en = p('enganchan');
  return (
    <g>
      <Bandera x={800} y={80} txt="Depositados: activan el complemento por la vía clásica" color="#2F6FD8" p={p('depositados')} t={28} punta="no" />
      <Pared y={700} o={tramo(p('depositados'), 0, 0.4)} />
      {[0, 1, 2, 3, 4].map((i) => <Complejo key={i} x={520 + i * 140} y={652} k={1.05} r={i * 30} o={tramo(p('depositados'), 0.2 + i * 0.05, 0.5 + i * 0.05)} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Bola key={`a${i}`} x={500 + i * 120} y={lerp(640, 460 - (i % 2) * 60, easeOut(tramo(p('c3a'), i * 0.06, 0.7)))} R={12} tono={V.ambar} o={tramo(p('c3a'), i * 0.06, 0.3)} />)}
      {[0, 1, 2, 3, 4].map((i) => <C5a key={`c${i}`} x={560 + i * 130} y={lerp(640, 380 - (i % 2) * 70, easeOut(tramo(p('c5a'), i * 0.06, 0.7)))} k={1.2} o={tramo(p('c5a'), i * 0.06, 0.3)} />)}
      <Bandera x={300} y={420} txt="C3a" color={V.ambar[0]} p={p('c3a')} t={28} />
      <Bandera x={300} y={500} txt="C5a" color={V.c5a[0]} p={p('c5a')} t={28} />
      <Txt x={300} y={570} txt="más permeabilidad" t={22} p={p('c5a')} fuerte={false} />
      {[0, 1].map((i) => <Neutrofilo key={i} x={lerp(i ? 1500 : 100, i ? 980 : 620, easeOut(ll))} y={lerp(250, 560, easeOut(en))} k={1.05} o={tramo(ll, 0, 0.3)} />)}
      <Txt x={1300} y={330} txt="llaman a los neutrófilos" t={24} p={ll} />
      <Bandera x={1250} y={480} txt="Receptores Fc" color="#F2546B" p={p('fc')} t={26} />
      <Bandera x={800} y={900} txt="Doble llamado: complemento + receptor Fc" color={V.sangre[0]} p={p('doble')} t={28} />
    </g>
  );
};

const Frustrada: Lamina = ({ p, reloj }) => {
  const va = p('vacia');
  return (
    <g>
      <Pared y={640} rota={va} />
      {[0, 1, 2, 3].map((i) => <Complejo key={i} x={620 + i * 120} y={592} k={1.05} r={i * 30} />)}
      <Neutrofilo x={800} y={lerp(300, 470, easeOut(p('intenta')))} k={1.6} activo={va} />
      {va > 0.01 && Array.from({ length: 16 }, (_, i) => { const a = Math.PI * (0.1 + (i / 15) * 0.8); return <circle key={i} cx={800 + Math.cos(a) * (90 + 160 * easeOut(tramo(va, i / 30, 0.8)))} cy={480 + Math.sin(a) * (60 + 90 * easeOut(tramo(va, i / 30, 0.8)))} r={8} fill={i % 2 ? V.neutro[0] : V.fibrina[1]} />; })}
      {p('ros') > 0.01 && Array.from({ length: 8 }, (_, i) => <path key={i} d="M0,-12 L4,-3 L13,0 L4,3 L0,12 L-4,3 L-13,0 L-4,-3 Z" fill={V.fibrina[1]} transform={`translate(${600 + i * 60},${560 + Math.sin(reloj / 180 + i) * 14})`} opacity={tramo(p('ros'), i / 10, i / 10 + 0.3)} />)}
      <Txt x={800} y={150} txt="intenta comerse el complejo pegado… no puede" t={28} p={p('intenta')} />
      <Txt x={800} y={210} txt="vacía enzimas lisosomales y especies reactivas de oxígeno" t={24} p={va} fuerte={false} />
      <Bandera x={800} y={850} txt="Fagocitosis frustrada" color={V.sangre[0]} p={p('frustrada')} t={32} />
      <Barra x={1180} y={340} w={300} val={1 - 0.65 * p('baja')} color={V.ambar[1]} txt="complemento en sangre" p={p('consume')} />
      <Txt x={300} y={340} txt="en la biopsia, los depósitos se ven" t={24} p={p('biopsia')} />
    </g>
  );
};

/** Corte histológico dibujado (H-E): pared con necrosis fibrinoide, neutrófilos y polvo nuclear. */
function CorteHE({ banda = 1, neutros = 1, polvo = 1, rojos = 1 }: { banda?: number; neutros?: number; polvo?: number; rojos?: number }) {
  return (
    <g>
      <rect x={-400} y={-400} width={800} height={800} fill="#F6D6E6" />
      {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={(hash(i, 1) - 0.5) * 760} cy={(hash(i, 2) - 0.5) * 760} rx={30} ry={8} fill="#E9B2CE" transform={`rotate(${hash(i, 3) * 180} ${(hash(i, 1) - 0.5) * 760} ${(hash(i, 2) - 0.5) * 760})`} />)}
      <circle r={190} fill="#E58FBE" />
      <circle r={150} fill="#FF4F9A" opacity={banda} />
      <circle r={110} fill="#F8E6EF" />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, d = 160 + hash(i, 4) * 90; return <g key={i} opacity={neutros}><circle cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={11} fill="#5A2A9E" /><circle cx={Math.cos(a) * d + 10} cy={Math.sin(a) * d + 4} r={9} fill="#5A2A9E" /></g>; })}
      {Array.from({ length: 40 }, (_, i) => { const a = hash(i, 5) * Math.PI * 2, d = 140 + hash(i, 6) * 140; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={2.5 + hash(i, 7) * 2.5} fill="#3A1660" opacity={polvo} />; })}
      {Array.from({ length: 12 }, (_, i) => { const a = hash(i, 8) * Math.PI * 2, d = 220 + hash(i, 9) * 120; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={13} fill="#E8364E" opacity={rojos} />; })}
    </g>
  );
}

const AlMicroscopio: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Al microscopio, la escena se reconoce" color="var(--cit-base)" p={p('micro')} t={30} punta="no" />
      <Lente x={560} y={540} R={340} id="c4-he" o={tramo(p('micro'), 0, 0.4)}>
        <CorteHE banda={tramo(p('banda'), 0, 0.6)} neutros={tramo(p('neutros'), 0, 0.5)} polvo={tramo(p('polvo'), 0, 0.5)} rojos={tramo(p('rojos'), 0, 0.5)} />
      </Lente>
      <Bandera x={1200} y={330} txt="Necrosis fibrinoide" color="#E0338A" p={p('fibrinoide')} t={28} punta="izq" />
      <Txt x={1220} y={390} txt="la pared, una banda rosada" t={22} p={p('banda')} fuerte={false} />
      <Bandera x={1200} y={480} txt="Neutrófilos" color={V.nucleo[1]} p={p('neutros')} t={28} punta="izq" />
      <Bandera x={1200} y={580} txt="Polvo nuclear" color="#3A1660" p={p('polvo')} t={28} punta="izq" />
      <Bandera x={1200} y={680} txt="Glóbulos rojos fuera del vaso" color={V.sangre[0]} p={p('rojos')} t={24} punta="izq" />
      <Bandera x={800} y={940} txt="Guárdala: una vasculitis por ANCA puede verse casi igual" color={V.anca[1]} p={p('guarda')} t={26} />
    </g>
  );
};

const LosAnca: Lamina = ({ p }) => {
  const g = p('granulos');
  return (
    <g>
      <Bandera x={800} y={80} txt="2 · ANCA: anticuerpos contra el citoplasma del neutrófilo" color={V.anca[1]} p={p('anca')} t={28} punta="no" />
      <Sale p={p('citoplasma')} x={430} y={500} k={3.2}><Neutrofilo /></Sale>
      {[0, 1, 2, 3, 4, 5].map((i) => <Anca key={i} x={430 + Math.cos(i) * 300} y={500 + Math.sin(i) * 300} r={(i * 60 + 90) % 360} k={1.5} o={tramo(p('anca'), i * 0.08, 0.4 + i * 0.08)} />)}
      <Foco x={430} y={500} R={210} p={g} color={V.pr3[1]} />
      <Txt x={430} y={850} txt="dos proteínas de sus gránulos" t={26} p={g} />
      <Sale p={p('pr3')} x={960} y={310} k={4}><Pr3 /></Sale>
      <Bandera x={1250} y={290} txt="Proteinasa 3 · PR3" color={V.pr3[0]} p={p('pr3')} t={26} />
      <Txt x={1250} y={350} txt="proteasa de los gránulos azurófilos" t={22} p={p('azurofilos')} fuerte={false} />
      <Sale p={p('mpo')} x={960} y={560} k={4}><Mpo /></Sale>
      <Bandera x={1250} y={540} txt="Mieloperoxidasa · MPO" color={V.mpo[0]} p={p('mpo')} t={26} />
      <Txt x={1250} y={600} txt="fabrica oxidantes contra microbios" t={22} p={p('oxidantes')} fuerte={false} />
      <Bandera x={1150} y={780} txt="Anti-PR3 → granulomatosis con poliangeítis" color={V.turquesa[0]} p={p('gpa')} t={24} />
      <Bandera x={1150} y={870} txt="Anti-MPO → poliangeítis microscópica" color="#B8237A" p={p('pam')} t={24} />
    </g>
  );
};

const Cebado: Lamina = ({ p, reloj }) => {
  const ce = p('superficie');
  return (
    <g>
      <Bandera x={800} y={80} txt="En reposo, escondidas" color="var(--cit-base)" p={p('escondidas')} t={30} punta="no" />
      <Sale p={p('escondidas')} x={620} y={520} k={2.6}><Neutrofilo cebado={ce} /></Sale>
      {p('nover') > 0.01 && [0, 1].map((i) => <Anca key={i} x={lerp(i ? 1050 : 260, i ? 900 : 380, Math.abs(Math.sin(reloj / 400 + i)))} y={300 + i * 420} r={i ? -100 : 80} k={1.6} o={tramo(p('nover'), 0, 0.4)} />)}
      <Txt x={620} y={880} txt="el anticuerpo no puede verlas" t={26} p={p('nover')} />
      <Bandera x={1280} y={240} txt="Cebado" color={V.c5a[0]} p={p('cebado')} t={32} />
      {([['tnf', 'TNF', V.c5a], ['lps', 'LPS bacteriano', V.verde], ['c5a', 'C5a', V.ambar]] as const).map(([n, txt, tono], i) => (
        <g key={n}>
          <Bola x={1160} y={360 + i * 110} R={26} tono={tono} o={tramo(p(n), 0, 0.4)} />
          <Txt x={1210} y={360 + i * 110} txt={txt} t={26} p={p(n)} ancla="start" />
          <Flecha a={[1130, 360 + i * 110]} b={[900, 470 + i * 30]} p={tramo(p(n), 0.3, 1)} color={FLECHA} w={6} />
        </g>
      ))}
      <Bandera x={1140} y={800} txt="PR3 y MPO salen a la superficie" color={V.pr3[0]} p={ce} t={26} />
    </g>
  );
};

const Activa: Lamina = ({ p, reloj }) => {
  const act = p('activa'), nets = p('nets');
  return (
    <g>
      <Pared y={760} rota={p('necrosa')} />
      <En x={800} y={470}>
        <Neutrofilo k={2.2} cebado={1} activo={act} />
        <Anca x={-150} y={-100} r={-40} k={1.6} o={tramo(p('une'), 0, 0.4)} />
        <Anca x={160} y={-80} r={40} k={1.6} o={tramo(p('fc'), 0, 0.4)} />
      </En>
      <Bandera x={350} y={250} txt="Fab: se une a PR3/MPO" color={V.anca[1]} p={p('une')} t={24} />
      <Bandera x={1250} y={250} txt="Fc: al receptor Fcγ del mismo neutrófilo" color="#F2546B" p={p('fc')} t={22} />
      <Txt x={800} y={130} txt="se activa de golpe, pegado al endotelio" t={28} p={act} />
      {p('degranula') > 0.01 && Array.from({ length: 14 }, (_, i) => { const a = Math.PI * (0.05 + (i / 13) * 0.9); return <circle key={i} cx={800 + Math.cos(a) * (150 + 120 * easeOut(p('degranula')))} cy={500 + Math.sin(a) * (110 + 120 * easeOut(p('degranula')))} r={8} fill={V.neutro[0]} />; })}
      {p('ros') > 0.01 && Array.from({ length: 8 }, (_, i) => <path key={i} d="M0,-12 L4,-3 L13,0 L4,3 L0,12 L-4,3 L-13,0 L-4,-3 Z" fill={V.fibrina[1]} transform={`translate(${560 + i * 70},${680 + Math.sin(reloj / 180 + i) * 12})`} opacity={tramo(p('ros'), i / 10, i / 10 + 0.3)} />)}
      <Net x={1060} y={620} p={nets} R={150} />
      <Bandera x={1300} y={480} txt="NET" color="#7A45E6" p={nets} t={28} />
      {[0, 1, 2].map((i) => <Hematie key={i} x={780 + i * 50} y={lerp(800, 900 + i * 14, easeOut(tramo(p('sangra'), i * 0.1, 0.8)))} k={0.5} o={tramo(p('sangra'), i * 0.1, 0.3)} />)}
      <Txt x={360} y={900} txt="la pared se inflama, se necrosa y sangra" t={24} p={p('inflama')} />
    </g>
  );
};

const Pauci: Lamina = ({ p, reloj }) => {
  const pas = p('pasaba');
  return (
    <g>
      <Bandera x={800} y={80} txt="Fíjate en lo que no queda" color="var(--cit-base)" p={p('queda')} t={30} punta="no" />
      <Pared x0={80} x1={740} y={520} o={tramo(p('complejo'), 0, 0.4)} />
      {[0, 1, 2, 3].map((i) => <Complejo key={i} x={220 + i * 130} y={472} k={1} r={i * 30} o={tramo(p('complejo'), 0.1 + i * 0.08, 0.5 + i * 0.08)} />)}
      <Txt x={410} y={660} txt="un complejo que se quedó" t={26} p={p('complejo')} />
      <Pared x0={860} x1={1520} y={520} o={tramo(p('ningun'), 0, 0.4)} rota={0.5 * pas} />
      <Neutrofilo x={lerp(820, 1580, ((reloj * 0.00012) % 1))} y={380} k={0.9} o={tramo(pas, 0, 0.3)} />
      <Txt x={1190} y={660} txt="una célula que pasaba" t={26} p={pas} />
      <Txt x={1190} y={230} txt="casi ningún anticuerpo en la pared" t={24} p={p('ningun')} fuerte={false} />
      <Bandera x={800} y={820} txt="Pauciinmune" color={V.anca[1]} p={p('pauci')} t={40} />
      <Txt x={800} y={920} txt="recuerda esa palabra: volverá en el riñón" t={26} p={p('rinon')} />
    </g>
  );
};

const Origen: Lamina = ({ p }) => {
  const ci = p('circulo');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿De dónde salen los ANCA?" color="var(--cit-base)" p={p('pista')} t={30} punta="no" />
      <Net x={500} y={280} p={p('nets')} R={120} />
      <Txt x={500} y={420} txt="NET con PR3 y MPO" t={22} p={p('nets')} />
      <Dendritica x={820} y={540} k={0.9} o={tramo(p('dendritica'), 0, 0.4)} />
      <Txt x={820} y={650} txt="la recoge y la presenta" t={22} p={p('presenta')} />
      <Sale p={p('plasmatica')} x={500} y={760} k={0.9}><Plasmatica /></Sale>
      {[0, 1, 2].map((i) => <Anca key={i} x={280 + i * 40} y={760 - i * 50} r={i * 40} k={1.2} o={tramo(p('ancas'), i * 0.15, 0.5 + i * 0.15)} />)}
      <Txt x={500} y={870} txt="célula plasmática: fabrica ANCA" t={22} p={p('plasmatica')} />
      <Bucle cx={560} cy={540} R={300} n={3} p={ci} />
      <Bandera x={560} y={540} txt="Círculo vicioso" color={V.anca[1]} p={ci} t={26} punta="no" />
      <Txt x={1260} y={250} txt="Lo empujan:" t={28} p={p('estafilococo')} />
      <Estafilo x={1120} y={350} k={1.2} o={tramo(p('estafilococo'), 0, 0.4)} />
      <Txt x={1190} y={350} txt="estafilococo en la nariz" t={22} p={p('estafilococo')} ancla="start" />
      {[0, 1, 2].map((i) => <path key={i} d="M0,-16 L12,0 L0,16 L-12,0 Z" fill="#B9C7DB" transform={`translate(${1100 + i * 18},${450 + (i % 2) * 10})`} opacity={tramo(p('silice'), 0, 0.4)} />)}
      <Txt x={1190} y={450} txt="sílice" t={22} p={p('silice')} ancla="start" />
      <Sale p={p('farmacos')} x={1120} y={550} k={0.8}><Pastilla /></Sale>
      <Txt x={1190} y={550} txt="ciertos fármacos" t={22} p={p('farmacos')} ancla="start" />
      <Bandera x={1270} y={680} txt="Genes: alfa-1 antitripsina" color={V.turquesa[0]} p={p('genes')} t={22} />
      <Txt x={1270} y={740} txt="frena a la PR3" t={22} p={p('frena')} fuerte={false} />
    </g>
  );
};

const Amplificador: Lamina = ({ p, reloj }) => {
  const rompe = p('rompe');
  const nodos: [number, number, string][] = [[800, 250, 'neutrófilo activado'], [1060, 650, 'C5a'], [540, 650, 'más neutrófilos cebados']];
  return (
    <g>
      <Bandera x={800} y={70} txt="El amplificador: la vía alternativa del complemento" color={V.c5a[0]} p={p('amplificador')} t={28} punta="no" />
      <Sale p={p('alternativa')} x={800} y={250} k={1.1}><Neutrofilo activo={1} cebado={1} /></Sale>
      <Sale p={p('c5a')} x={1060} y={650}>{[0, 1, 2].map((i) => <C5a key={i} x={(i - 1) * 40} y={Math.sin(reloj / 250 + i) * 8} k={1.8} />)}</Sale>
      <Sale p={p('ceba')} x={540} y={650}>{[0, 1].map((i) => <Neutrofilo key={i} x={(i - 0.5) * 120} k={0.75} cebado={1} />)}</Sale>
      {nodos.map(([x, y, txt], i) => <Txt key={txt} x={x} y={y + 120} txt={txt} t={22} p={p(['alternativa', 'c5a', 'ceba'][i])} />)}
      <Bucle cx={800} cy={510} R={280} n={3} p={p('circuito') * (1 - 0.5 * rompe)} color={V.c5a[0]} />
      <Txt x={800} y={520} txt="responden más a los ANCA" t={22} p={p('responden')} />
      <Sale p={p('avacopan')} x={1330} y={450} k={1.5}><Pastilla color={['#5B3CC4', '#8460E8', '#B39BFF']} /></Sale>
      <Bandera x={1330} y={350} txt="Avacopán" color={V.violeta[0]} p={p('avacopan')} t={28} />
      <Txt x={1330} y={540} txt="bloquea el receptor de C5a" t={22} p={p('avacopan')} />
      <Cruz x={940} y={640} k={1.2} p={rompe} />
      <Bandera x={800} y={930} txt="Con mucho menos corticoide" color={V.verde[0]} p={p('corticoide')} t={28} />
    </g>
  );
};

const Granulomatosa: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={70} txt="3 · Inflamación granulomatosa" color={V.violeta[0]} p={p('tercer')} t={30} punta="no" />
      <Sale p={p('macrofago')} x={320} y={480} k={0.6}><Macrofago /></Sale>
      <Txt x={320} y={640} txt="presenta el antígeno" t={22} p={p('macrofago')} />
      <Sale p={p('cd4')} x={720} y={480} k={1.2}><Linfocito tono="gris" /></Sale>
      <Txt x={720} y={600} txt="linfocito CD4" t={24} p={p('cd4')} />
      <Flecha a={[470, 480]} b={[640, 480]} p={p('cd4')} color={FLECHA} w={7} />
      <Flecha a={[800, 430]} b={[1000, 300]} p={p('caminos')} color={FLECHA} w={7} />
      <Flecha a={[800, 530]} b={[1000, 680]} p={p('caminos')} color={FLECHA} w={7} />
      <Sale p={p('th1')} x={1080} y={280} k={1}><Linfocito tono="th1" /></Sale>
      <Bandera x={1080} y={170} txt="Th1 → interferón γ" color="#A21F6D" p={p('ifn')} t={24} />
      <Sale p={p('epitelioide')} x={1340} y={300} k={1.3}><Epitelioide /></Sale>
      <Txt x={1340} y={390} txt="macrófago epitelioide" t={22} p={p('epitelioide')} />
      <Sale p={p('th17')} x={1080} y={700} k={1}><Linfocito tono="th17" /></Sale>
      <Bandera x={1080} y={830} txt="Th17 → IL-17" color="#C2410C" p={p('il17')} t={24} />
      {[0, 1].map((i) => <Neutrofilo key={i} x={1300 + i * 120} y={700} k={0.6} o={tramo(p('neutros'), i * 0.2, 0.6)} />)}
      <Txt x={1360} y={790} txt="recluta neutrófilos" t={22} p={p('neutros')} />
    </g>
  );
};

const ElGranuloma: Lamina = ({ p }) => {
  const inv = p('invade');
  return (
    <g>
      <Granuloma x={560} y={520} k={1.25} p={clamp(p('acumulan') * 0.5 + p('collar') * 0.5)} necrosis={p('necrosa')} />
      <CelGigante x={560} y={520} k={0.7 * tramo(p('gigantes'), 0, 0.6)} o={1 - tramo(p('necrosa'), 0, 0.6)} />
      <Txt x={560} y={110} txt="se acumulan, se aplanan, se fusionan" t={28} p={p('epiteliales')} />
      <Bandera x={1080} y={300} txt="Células gigantes multinucleadas" color={V.violeta[0]} p={p('gigantes')} t={24} />
      <Bandera x={1080} y={390} txt="Collar de linfocitos" color={V.turquesa[0]} p={p('collar')} t={24} />
      <Bandera x={560} y={880} txt="Granuloma: un muro para encerrar lo indestructible" color={V.violeta[1]} p={p('muro')} t={26} />
      <Sale p={p('gpa')} x={1300} y={640}>
        <rect x={-200} y={-140} width={400} height={80} fill="#F0A7C2" />
        <rect x={-200} y={-60} width={400} height={90} fill="#BFE3F2" />
        <rect x={-200} y={30} width={400} height={110} fill="#F2E4C4" />
        <path d={blob(9, 70, 0.3, 4)} transform={`translate(-40,${-120 + 160 * easeOut(inv)}) scale(${(0.8 + 0.6 * inv).toFixed(2)})`} fill="#C8569A" opacity={tramo(p('gpa'), 0, 0.4)} />
      </Sale>
      <Txt x={1560} y={540} txt="mucosa" t={20} p={tramo(inv, 0, 0.3)} ancla="end" />
      <Txt x={1560} y={625} txt="cartílago" t={20} p={tramo(inv, 0.3, 0.6)} ancla="end" />
      <Txt x={1560} y={720} txt="hueso" t={20} p={tramo(inv, 0.6, 0.9)} ancla="end" />
      <Txt x={1300} y={820} txt="en la GPA, necrosa e invade" t={24} p={p('gpa')} />
    </g>
  );
};

/** Epitelio respiratorio: fila de células columnares. */
function Epitelio({ x0 = 80, x1 = 1520, y = 300, p = 1, dano = 0 }: { x0?: number; x1?: number; y?: number; p?: number; dano?: number }) {
  const n = Math.round((x1 - x0) / 70);
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      {Array.from({ length: n }, (_, i) => {
        const roto = dano > 0.01 && hash(i, 3) < 0.35;
        return (
          <g key={i} transform={`translate(${x0 + i * 70 + 35},${y})`} opacity={roto ? 1 - 0.6 * dano : 1}>
            <rect x={-32} y={-90} width={64} height={180} rx={14} fill="#F2A7C9" />
            <ellipse cx={0} cy={40} rx={16} ry={22} fill="#8A2363" />
            {[-20, -8, 4, 16].map((dx) => <rect key={dx} x={dx} y={-112} width={5} height={24} rx={2.5} fill="#F2A7C9" />)}
          </g>
        );
      })}
    </g>
  );
}

const Tipo2: Lamina = ({ p }) => {
  const al = p('alarma');
  return (
    <g>
      <Bandera x={800} y={70} txt="4 · La respuesta tipo 2" color={V.eos[0]} p={p('cuarto')} t={30} punta="no" />
      <Epitelio y={280} p={p('epitelio')} dano={p('epitelio')} />
      {[0, 1, 2, 3].map((i) => <Bola key={i} x={220 + i * 90} y={lerp(110, 170, Math.sin(i))} R={14} tono={V.moco} o={tramo(p('alergeno'), i * 0.1, 0.4)} />)}
      <Txt x={360} y={140} txt="alérgeno" t={22} p={p('alergeno')} />
      {([['il25', 'IL-25'], ['il33', 'IL-33'], ['tslp', 'TSLP']] as const).map(([n, txt], i) => (
        <g key={n}>
          <Bola x={660 + i * 200} y={lerp(380, 480, easeOut(al))} R={20} tono={V.c5a} o={tramo(p(n), 0, 0.4)} />
          <Bandera x={660 + i * 200} y={540} txt={txt} color={V.c5a[0]} p={p(n)} t={24} punta="no" />
        </g>
      ))}
      <Txt x={860} y={620} txt="señales de alarma" t={24} p={al} />
      <Dendritica x={420} y={760} k={0.8} o={tramo(p('presentadora'), 0, 0.4)} />
      <Flecha a={[520, 760]} b={[720, 760]} p={p('presentadora')} color={FLECHA} w={7} />
      <Sale p={p('virgen')} x={820} y={760} k={1}><Linfocito tono="gris" /></Sale>
      <Flecha a={[910, 760]} b={[1100, 760]} p={p('th2')} color={FLECHA} w={7} />
      <Sale p={p('th2')} x={1200} y={760} k={1.1}><Linfocito tono="tfh" /></Sale>
      <Bandera x={1200} y={900} txt="Th2" color="#0E7490" p={p('th2')} t={30} />
    </g>
  );
};

const Interleucinas: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('tres')} x={200} y={480} k={1.3}><Linfocito tono="tfh" /></Sale>
      <Txt x={200} y={620} txt="Th2: tres interleucinas" t={24} p={p('tres')} />
      {[0, 1, 2].map((i) => <Flecha key={i} a={[300, 480]} b={[520, 200 + i * 290]} p={p(['il4', 'il5', 'il13'][i])} color={FLECHA} w={7} />)}
      <Bandera x={620} y={200} txt="IL-4" color="#2F6FD8" p={p('il4')} t={28} />
      <Sale p={p('ige')} x={820} y={200} k={0.7}><Linfocito tono="b" /></Sale>
      {[0, 1, 2].map((i) => <IgG key={i} x={940 + i * 50} y={190} r={20} k={1.1} tono={['#0B6E86', '#16B9BE', '#7FEDE8']} o={tramo(p('ige'), i * 0.15, 0.5 + i * 0.15)} />)}
      <Txt x={1220} y={200} txt="cambio de clase a IgE" t={24} p={p('ige')} ancla="start" />
      <Bandera x={620} y={490} txt="IL-5" color={V.eos[0]} p={p('il5')} t={28} />
      <Sale p={p('medula')} x={880} y={490} k={0.3}><Medula /></Sale>
      {[0, 1, 2].map((i) => <Eosinofilo key={i} x={1060 + i * 100} y={490} k={0.6} o={tramo(p('medula'), 0.3 + i * 0.15, 0.7 + i * 0.1)} />)}
      <Txt x={1160} y={580} txt="los fabrica, activa y mantiene vivos" t={22} p={p('vivos')} />
      <Bandera x={620} y={780} txt="IL-13" color="#8A9A1E" p={p('il13')} t={28} />
      <Sale p={p('moco')} x={900} y={780} k={0.9}>{[0, 1, 2].map((i) => <path key={i} d={blob(8, 40, 0.3, i + 2)} transform={`translate(${i * 60 - 60},0)`} fill={V.moco[i % 2]} />)}</Sale>
      <Txt x={1200} y={780} txt="mucosas inflamadas y llenas de moco" t={22} p={p('moco')} ancla="start" />
      <Bandera x={800} y={940} txt="En la GEPA: IgE alta, eosinofilia y asma" color={V.ambar[0]} p={p('egpa')} t={26} />
    </g>
  );
};

const Migra: Lamina = ({ p }) => {
  const cr = p('cruza');
  return (
    <g>
      <Bandera x={800} y={70} txt="Para salir de la sangre, el eosinófilo…" color={V.eos[0]} p={p('salir')} t={28} punta="no" />
      <Pared y={460} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={1100 + i * 70} cy={640 + i * 40} r={6 + i * 3} fill="#E0338A" opacity={tramo(p('eotaxinas'), i / 8, i / 8 + 0.4)} />)}
      <Bandera x={1280} y={900} txt="Eotaxinas · CCL11" color="#B8237A" p={p('eotaxinas')} t={24} />
      <Eosinofilo x={lerp(600, 1000, easeOut(p('tejido')))} y={lerp(330, 720, easeOut(cr))} k={1.25} degranula={p('degranula')} />
      <Bandera x={300} y={260} txt="Integrina α4β1 → VCAM-1" color={V.violeta[0]} p={p('integrina')} t={24} />
      <Txt x={300} y={330} txt="se pega al endotelio" t={22} p={p('vcam')} fuerte={false} />
      <Txt x={300} y={700} txt="cruza y migra al tejido" t={26} p={cr} />
      <Bandera x={330} y={800} txt="Proteína básica mayor" color={V.eos[0]} p={p('mbp')} t={22} />
      <Bandera x={330} y={870} txt="Proteína catiónica eosinofílica" color={V.eos[0]} p={p('ecp')} t={22} />
      <Bandera x={330} y={940} txt="Peroxidasa eosinofílica" color={V.eos[0]} p={p('epo')} t={22} />
    </g>
  );
};

const Dano: Lamina = ({ p, reloj }) => {
  const hr = p('hiperreactivo');
  const luz = lerp(80, 34, hr * (0.6 + 0.4 * Math.abs(Math.sin(reloj / 500))));
  return (
    <g>
      <Txt x={800} y={80} txt="dañan epitelio y endotelio, sostienen la inflamación" t={28} p={p('danan')} />
      <Sale p={p('danan')} x={420} y={460}>
        <circle r={200} fill="#F2A7C9" />
        <circle r={170} fill="#C2457E" />
        <circle r={luz + 40} fill="#F7C9DD" />
        <circle r={luz} fill="var(--vas-fondo-a)" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={blob(7, 16, 0.3, i)} transform={`translate(${Math.cos(i * 1.3) * luz * 0.5},${Math.sin(i * 1.3) * luz * 0.5})`} fill={V.moco[1]} opacity={hr} />)}
      </Sale>
      <Txt x={420} y={720} txt="bronquio hiperreactivo: se contrae ante todo" t={24} p={hr} />
      <Bandera x={420} y={800} txt="Asma" color="#2F6FD8" p={p('asma')} t={34} />
      <Sale p={p('corazon')} x={1120} y={420} k={1.4}><Corazon /></Sale>
      {[0, 1, 2, 3, 4].map((i) => <Eosinofilo key={i} x={1040 + (i % 3) * 80} y={370 + Math.floor(i / 3) * 90} k={0.42} o={tramo(p('miocarditis'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Bandera x={1120} y={680} txt="Miocarditis eosinofílica" color={V.sangre[0]} p={p('miocarditis')} t={26} />
      <Txt x={1120} y={750} txt="la primera causa de muerte en la GEPA" t={22} p={p('muerte')} />
      <Sale p={p('mepolizumab')} x={1000} y={890} k={1.1}><Pastilla color={['#0E7490', '#14A7BF', '#8EEBF2']} /></Sale>
      <Bandera x={1260} y={890} txt="Mepolizumab: anti IL-5" color={V.turquesa[0]} p={p('mepolizumab')} t={24} />
      <Foco x={1120} y={460} R={190} p={p('manda')} color={V.eos[1]} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Cuatro, Tipo3, Depositados, Frustrada, AlMicroscopio, LosAnca, Cebado, Activa, Pauci, Origen, Amplificador, Granulomatosa, ElGranuloma, Tipo2, Interleucinas, Migra, Dano];
export default LAMINAS;
