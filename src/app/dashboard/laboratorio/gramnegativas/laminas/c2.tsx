'use client';
// Capítulo 2 · La barrera sana y cómo se estropea (moco, microbiota, disbiosis, moco degradado, epitelio expuesto).

import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Bola, Capas, Corte, Cremallera, Cruz, En, Enterocito, Flecha, FLECHA, G, Gel, IgG, Llamada, Macrofago, Neutrofilo, Pastilla, PildoraFlota, Sale, Tijera, TXT_FARMACO, Txt, V, clamp, easeOut, hash, tramo, TXTC } from '../Piezas';

/** Cadena de glucanos: hexágonos unidos. */
function Glucano({ x, y, n = 5, k = 1, o = 1 }: { x: number; y: number; n?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: n }, (_, i) => {
        const cx = i * 46, cy = (i % 2) * 18;
        return <g key={i}><path d={`M${cx},${cy - 26} L${cx + 23},${cy - 13} L${cx + 23},${cy + 13} L${cx},${cy + 26} L${cx - 23},${cy + 13} L${cx - 23},${cy - 13} Z`} fill={G.amarillo[1]} /><path d={`M${cx},${cy - 26} L${cx + 23},${cy - 13} L${cx},${cy} L${cx - 23},${cy - 13} Z`} fill={G.amarillo[2]} /></g>;
      })}
    </En>
  );
}

/** Receptor del epitelio: una «Y» corta, rosa. */
function Receptor({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}><path d="M0,26 L0,0 M0,0 L-14,-22 M0,0 L14,-22" fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" /><circle cx={-14} cy={-24} r={7} fill="#FFF0A8" /><circle cx={14} cy={-24} r={7} fill="#FFF0A8" /></En>;
}

function Burger({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-70,-6 C-70,-60 70,-60 70,-6 Z" fill="#E5A32E" /><path d="M-70,-6 C-70,-40 70,-40 70,-6 Z" fill="#F7D683" opacity={0.5} />
      <rect x={-72} y={-2} width={144} height={16} rx={8} fill="#5BC85A" /><rect x={-68} y={12} width={136} height={24} rx={12} fill="#7A3A1E" />
      <path d="M-70,40 L70,40 C70,66 40,70 0,70 C-40,70 -70,66 -70,40 Z" fill="#E5A32E" />
      {[-36, -8, 22, 46].map((cx, i) => <ellipse key={i} cx={cx} cy={-34 + (i % 2) * 8} rx={6} ry={3.5} fill="#FFF0C8" />)}
    </En>
  );
}

function Escudo({ x = 0, y = 0, k = 1, o = 1, rota = 0 }: { x?: number; y?: number; k?: number; o?: number; rota?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M0,-70 C28,-52 56,-48 62,-46 C62,10 44,52 0,76 C-44,52 -62,10 -62,-46 C-56,-48 -28,-52 0,-70 Z" fill="#1E56C6" />
      <path d="M0,-58 C24,-44 46,-40 52,-38 C52,6 38,44 0,64 C-38,44 -52,6 -52,-38 C-46,-40 -24,-44 0,-58 Z" fill="#3B82F0" />
      <path d="M-30,-30 L-30,8" stroke="#BFDBFF" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      {rota > 0.01 && <path d={`M4,-60 L-6,-24 L12,-6 L-4,26 L8,${26 + 50 * clamp(rota)}`} fill="none" stroke="#FFF7E8" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${200 * clamp(rota)} 300`} />}
    </En>
  );
}

const Tres: Lamina = ({ p }) => {
  return (
    <g>
      <Corte y={700} o={tramo(p('corte'), 0, 0.6)} libera={0} />
      <Bandera x={400} y={200} txt="1 · Física" color={G.comensal[0]} p={p('fisica')} t={34} punta="abajo" />
      <Llamada x={80} y={120} a={[340, 480]} txt="moco y uniones" p={p('fisica')} t={24} />
      {[0, 1, 2, 3, 4].map((i) => <IgG key={i} x={560 + i * 74} y={420 + (i % 2) * 36} r={i * 70} k={0.9 * tramo(p('inmuno'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Bandera x={800} y={200} txt="2 · Inmunológica" color={V.violeta[0]} p={p('inmuno')} t={34} punta="abajo" />
      <Macrofago x={880} y={910} k={0.7 * tramo(p('inmuno'), 0.4, 1)} />
      <Bandera x={1290} y={200} txt="3 · Regenerativa" color={G.amarillo[0]} p={p('regenera')} t={34} punta="abajo" />
      {[0, 1, 2].map((i) => <Bola key={i} x={1180 + i * 110} y={900 - 70 * easeOut(tramo(p('regenera'), i * 0.12, 0.7 + i * 0.12))} R={30 * tramo(p('regenera'), 0, 0.3)} tono={G.amarillo as unknown as string[]} />)}
      <Flecha a={[1290, 900]} b={[1290, 810]} p={p('regenera')} color={FLECHA} w={9} />
    </g>
  );
};

const Gel2: Lamina = ({ p }) => {
  return (
    <g>
      <Corte y={700} libera={p('muc2')} interna={p('interna')} externa={p('externa')} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Bacilo key={i} x={220 + i * 230 + hash(i, 2) * 60} y={380 + (i % 3) * 36} r={hash(i, 3) * 160} k={0.55 * tramo(p('comensales'), i * 0.12, 0.45 + i * 0.12)} tono={G.comensal} />)}
      <Llamada x={90} y={150} a={[300, 520]} txt="capa interna: adherida, casi sin bacterias" p={p('interna')} t={26} />
      <Llamada x={900} y={150} a={[1000, 380]} txt="capa externa: laxa, hábitat de comensales" p={p('externa')} t={26} />
      <Bandera x={1440} y={200} txt="MUC2 · célula caliciforme" color={G.epitelio[1]} p={p('muc2')} t={26} punta="abajo" />
    </g>
  );
};

const Comensales: Lamina = ({ p }) => {
  const mu = p('mucinas');
  return (
    <g>
      <Capas y={900} fondo={300} bandas={[[0, '#8B2BB8', 28], [50, '#6E1FA3', 32]]} sem={9} />
      <Glucano x={110} y={420} n={5} o={tramo(p('glucanos'), 0, 0.4)} />
      <Txt x={210} y={500} txt="glucanos y polisacáridos" t={24} p={p('glucanos')} />
      <Flecha a={[360, 440]} b={[470, 440]} p={p('glucanos')} color={FLECHA} w={8} />
      <Bacilo x={600} y={430} r={-8} k={1.5 * tramo(p('bt'), 0, 0.4)} tono={G.comensal} sombra />
      <Bandera x={600} y={250} txt="Bacteroides thetaiotaomicron" color={G.comensal[0]} p={p('bt')} t={24} punta="abajo" />
      {Array.from({ length: 7 }, (_, i) => { const q = tramo(p('ags'), i * 0.08, 0.5 + i * 0.08); return <circle key={i} cx={720 + i * 40 + hash(i, 4) * 20} cy={470 + 120 * q} r={13} fill="#7FEDE8" opacity={tramo(q, 0, 0.3) * (1 - tramo(q, 0.8, 1))} />; })}
      <Txt x={900} y={630} txt="ácidos grasos de cadena corta" t={26} p={p('ags')} color={TXTC.comensal} />
      <Gel x={600} y={730} w={760} h={110} o={mu} denso hebras={13} sem={11} />
      <Txt x={980} y={700} txt="más mucinas y mejor epitelio" t={26} p={mu} color={TXTC.mucoso} />
      <Bacilo x={1300} y={420} r={20} k={1.4 * tramo(p('akk'), 0, 0.4)} tono={['#2E6E8E', '#5AB3CF', '#C4EEFF']} largo={90} alto={64} sombra />
      <Bandera x={1300} y={250} txt="Akkermansia muciniphila" color="#2E6E8E" p={p('akk')} t={24} punta="abajo" />
      <Txt x={1460} y={690} txt="depende del contexto" t={26} p={p('contexto')} fuerte={false} />
    </g>
  );
};

const Cinco: Lamina = ({ p }) => {
  const items: [string, string, number][] = [['moco', 'el moco se renueva', 190], ['peristalsis', 'peristalsis', 495], ['uniones', 'uniones entre células', 800], ['polaridad', 'polaridad apicobasal', 1105], ['recambio', 'recambio de enterocitos', 1410]];
  return (
    <g>
      <Bandera x={800} y={90} txt="Y no es solo moco" color="var(--cit-base)" p={p('moco')} t={34} punta="no" />
      <Sale p={p('moco')} x={190} y={450} k={1.3}><Gel x={-80} y={-120} w={160} h={200} denso hebras={5} sem={2} />{[0, 1, 2].map((i) => <Flecha key={i} a={[-50 + i * 50, 70]} b={[-50 + i * 50, -150]} p={1} color={FLECHA} w={6} />)}</Sale>
      <Sale p={p('peristalsis')} x={470} y={450} k={1.1}>
        <path d="M-110,-40 C-60,-40 -50,40 0,40 C50,40 60,-40 110,-40" fill="none" stroke="#7A2A8A" strokeWidth={56} strokeLinecap="round" /><path d="M-110,-40 C-60,-40 -50,40 0,40 C50,40 60,-40 110,-40" fill="none" stroke="#FFF1B8" strokeWidth={34} strokeLinecap="round" />
        <Flecha a={[-100, 120]} b={[100, 120]} p={1} color={FLECHA} w={7} />
      </Sale>
      <Sale p={p('uniones')} x={800} y={450} k={1.4}><Enterocito x={-39} y={10} k={0.7} micro={0} /><Enterocito x={39} y={10} k={0.7} micro={0} /><Cremallera x={0} y={-30} h={110} cierre={p('uniones')} k={0.8} /></Sale>
      <Sale p={p('polaridad')} x={1105} y={450} k={1.3}>
        <Enterocito k={0.95} /><Txt x={96} y={-100} txt="apical" t={22} p={1} ancla="start" /><Txt x={96} y={70} txt="basal" t={22} p={1} ancla="start" />
      </Sale>
      <Sale p={p('recambio')} x={1410} y={450} k={1.3}>
        <Enterocito k={0.75} micro={0.7} />
        <path d="M-96,-20 A100,100 0 1 1 -40,92" fill="none" stroke="#FFD23F" strokeWidth={13} strokeLinecap="round" />
        <path d="M-52,110 L-34,84 L-68,84 Z" fill="#FFD23F" />
      </Sale>
      {items.map(([n, txt, x]) => <Txt key={n} x={x} y={730} txt={txt} t={26} p={p(n)} />)}
      <Txt x={800} y={880} txt="juntos impiden que los microbios toquen y atraviesen la mucosa" t={28} p={p('recambio')} />
    </g>
  );
};

const Disbiosis: Lamina = ({ p }) => {
  const N8 = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g>
      <Sale p={p('dieta')} x={280} y={170} k={0.8}><Burger x={0} y={0} /></Sale>
      <Sale p={p('antibioticos')} x={800} y={170}><Pastilla r={-20} k={1.1} color={['#C2410C', '#F97316', '#FFC48A']} /></Sale>
      <Sale p={p('inmuno')} x={1320} y={170} k={0.8}><Escudo rota={p('inmuno')} /></Sale>
      <Txt x={280} y={270} txt="dieta" t={26} p={p('dieta')} /><Txt x={800} y={270} txt="antibióticos" t={26} p={p('antibioticos')} /><Txt x={1320} y={270} txt="inmunosupresión" t={26} p={p('inmuno')} />
      <circle cx={420} cy={640} r={250} fill={G.mucoso[2]} opacity={0.55} /><circle cx={1180} cy={640} r={250} fill="#FFD9D0" opacity={0.6} />
      {N8.map((i) => <Bacilo key={i} x={420 + Math.cos(i * 2.3) * (60 + hash(i, 1) * 130)} y={640 + Math.sin(i * 2.3) * (60 + hash(i, 2) * 130)} r={hash(i, 3) * 180} k={0.8} tono={G.comensal} o={1 - 0.8 * tramo(p('pierden'), (i % 4) * 0.1, 0.6)} />)}
      {N8.map((i) => <Bacilo key={i} x={1180 + Math.cos(i * 2.9) * (50 + hash(i, 4) * 140)} y={640 + Math.sin(i * 2.9) * (50 + hash(i, 5) * 140)} r={hash(i, 6) * 180} k={0.8} tono={i < 2 ? G.comensal : G.patogeno} o={i < 2 ? 0.9 : tramo(p('oportunistas'), (i % 5) * 0.1, 0.5 + (i % 5) * 0.1)} />)}
      <Flecha a={[700, 640]} b={[900, 640]} p={p('pierden')} color={FLECHA} w={10} />
      <Bandera x={420} y={930} txt="Microbiota sana" color={G.comensal[0]} p={p('dieta')} t={28} punta="no" />
      <Bandera x={1180} y={930} txt="Disbiosis" color={G.patogeno[0]} p={p('oportunistas')} t={28} punta="no" />
      <Txt x={800} y={780} txt="menos protección…" t={24} p={p('pierden')} /><Txt x={800} y={560} txt="…y más oportunistas" t={24} p={p('empeoran')} color={TXTC.patogeno} />
    </g>
  );
};

const Degrada: Lamina = ({ p }) => {
  const cortan = p('cortan');
  return (
    <g>
      <Gel x={80} y={380} w={1440} h={210} o={0.9} hebras={22} sem={13} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={300 + i * 330} cy={575} r={46 * tramo(cortan, i * 0.15, 0.5 + i * 0.15)} fill="#FFF7E8" opacity={0.85} />)}
      <Sale p={p('hap')} x={300} y={250}><Bacilo r={-20} k={1.2} flagelo={1} /></Sale>
      <Bandera x={300} y={120} txt="Vibrio cholerae · Hap" color={G.patogeno[0]} p={p('hap')} t={26} punta="abajo" />
      <Sale p={p('cortan')} x={300} y={430} k={2.6}><Tijera corta={cortan} /></Sale>
      <Sale p={p('sslE')} x={820} y={250}><Bacilo r={10} k={1.2} fimbrias={1} /></Sale>
      <Bandera x={820} y={120} txt="E. coli · SslE" color={G.patogeno[0]} p={p('sslE')} t={26} punta="abajo" />
      <Sale p={p('sslE')} x={820} y={430} k={2.6}><Tijera corta={cortan} /></Sale>
      <Sale p={p('comen')} x={1330} y={250}><Bacilo r={-10} k={1.1} flagelo={1} /><Bacilo x={90} y={34} r={25} k={0.9} /></Sale>
      <Bandera x={1330} y={120} txt="Salmonella · Shigella" color={G.patogeno[0]} p={p('comen')} t={26} punta="abajo" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1230 + i * 40} cy={480 + 70 * tramo(p('comen'), i * 0.1, 0.5 + i * 0.1) * (1 - 0.5 * (i % 2))} r={12} fill="#2FB98A" opacity={0.95} />)}
      <Txt x={1330} y={680} txt="comen los restos de mucina" t={26} p={p('comen')} />
      <Txt x={560} y={720} txt="se rompe el equilibrio entre degradación y renovación" t={26} p={p('cortan')} />
      <Bandera x={800} y={880} txt="Detectar el gen no basta: importa su combinación con otros factores" color={V.violeta[0]} p={p('genNoBasta')} t={26} punta="no" />
    </g>
  );
};

const Grampositiva: Lamina = ({ p }) => {
  const baja = p('muc2baja'), sube = p('muc1sube');
  const base = 650, h2 = 260 * (1 - 0.55 * baja), h1 = 90 + 170 * sube;
  return (
    <g>
      <Bandera x={800} y={90} txt="Comparación grampositiva" color={G.grampos[0]} p={p('cdiff')} t={32} punta="no" />
      <Sale p={p('cdiff')} x={330} y={470} k={1.5}>
        <Bacilo tono={G.grampos} sombra />
        <ellipse cx={14} cy={2} rx={20} ry={13} fill="#FFF7E8" /><ellipse cx={14} cy={2} rx={12} ry={7} fill="#B3A8FF" />
      </Sale>
      <Txt x={330} y={640} txt="Clostridioides difficile" t={30} p={p('cdiff')} color={TXTC.grampos} />
      <rect x={780} y={base - h2} width={80} height={h2} rx={14} fill={G.epitelio[1]} opacity={tramo(p('mucinas'), 0, 0.4)} />
      <rect x={940} y={base - h1} width={80} height={h1} rx={14} fill={G.amarillo[1]} opacity={tramo(p('mucinas'), 0, 0.4)} />
      <Txt x={820} y={base + 40} txt="MUC2" t={30} p={p('mucinas')} /><Txt x={980} y={base + 40} txt="MUC1" t={30} p={p('mucinas')} />
      <Txt x={780} y={base - h2 - 40} txt="menos MUC2" t={26} p={baja} color={TXTC.epitelio} />
      <Txt x={1000} y={base - h1 - 40} txt="más MUC1" t={26} p={sube} color={TXTC.amarillo} />
      <Txt x={1300} y={330} txt="puede favorecer su unión" t={26} p={sube} />
      <Sale p={p('sinmucinasa')} x={1300} y={520}><Tijera k={2.8} /><Cruz x={0} y={0} k={1.5} /></Sale>
      <Txt x={1300} y={700} txt="sin mucinasa propia identificada" t={24} p={p('sinmucinasa')} />
    </g>
  );
};

const Expuesto: Lamina = ({ p }) => {
  return (
    <g>
      <Corte y={720} moco={0} micro={1} />
      {[0, 1, 2].map((i) => <Bacilo key={i} x={380 + i * 380} y={540 + (i % 2) * 24} r={i * 40 - 30} k={0.6 * tramo(p('expuesto'), i * 0.15, 0.5 + i * 0.15)} fimbrias={0.8} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Receptor key={i} x={220 + i * 250} y={604} k={tramo(p('receptores'), i * 0.1, 0.5 + i * 0.1)} />)}
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={140 + i * 190} cy={560 - 20 * tramo(p('nutrientes'), i * 0.08, 0.5 + i * 0.08)} r={9} fill="#5FE08A" opacity={tramo(p('nutrientes'), i * 0.08, 0.5)} />)}
      {Array.from({ length: 6 }, (_, i) => { const q = tramo(p('il8'), i * 0.1, 0.6 + i * 0.1); return <circle key={i} cx={300 + i * 200} cy={520 - 220 * q} r={10} fill="#FFD23F" opacity={q * (1 - tramo(q, 0.85, 1))} />; })}
      {[0, 1, 2].map((i) => <Neutrofilo key={i} x={460 + i * 330} y={170 + 40 * easeOut(tramo(p('neutrofilos'), i * 0.15, 0.7 + i * 0.15))} k={0.6} o={tramo(p('neutrofilos'), i * 0.15, 0.4 + i * 0.15)} activo={p('neutrofilos')} />)}
      <Bandera x={800} y={80} txt="Sin moco, el epitelio queda a la vista" color="var(--cit-base)" p={p('expuesto')} t={32} punta="no" />
      <Txt x={420} y={450} txt="receptores y nutrientes al alcance" t={24} p={p('nutrientes')} />
      <Txt x={1130} y={400} txt="IL-8: llama a los neutrófilos" t={26} p={p('il8')} color={TXTC.ambar} />
      <En x={1400} y={900} o={tramo(p('cuanto'), 0, 0.5)}><circle r={52} fill="#FFD23F" /><circle r={42} fill="#FFF7E8" /><path d="M0,-26 L0,0 L20,12" fill="none" stroke="#3B1A6E" strokeWidth={7} strokeLinecap="round" /></En>
      <Txt x={1130} y={900} txt="¿cuánto tarda en reconstruirse?" t={26} p={p('cuanto')} />
    </g>
  );
};

const Antibioticos: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('amplio')} x={260} y={230}><Pastilla k={1.6} r={-25} color={['#C2410C', '#F97316', '#FFC48A']} /></Sale>
      <Txt x={260} y={330} txt="amplio espectro" t={26} p={p('amplio')} />
      {[0, 1, 2, 3].map((i) => <Bacilo key={i} x={150 + i * 150} y={520 + (i % 2) * 40} r={i * 35} k={0.6} tono={G.comensal} o={1 - 0.75 * tramo(p('anaerobios'), i * 0.12, 0.5 + i * 0.12)} />)}
      {[0, 1, 2, 3].map((i) => <Cruz key={i} x={150 + i * 150} y={520 + (i % 2) * 40} k={0.7} p={tramo(p('anaerobios'), 0.2 + i * 0.12, 0.6 + i * 0.12)} />)}
      <Txt x={380} y={620} txt="caen los anaerobios" t={26} p={p('anaerobios')} />
      <Txt x={380} y={690} txt="se pierde la resistencia a la colonización" t={24} p={p('colonizacion')} fuerte={false} />
      {[0, 1, 2, 3, 4].map((i) => <Bacilo key={i} x={150 + i * 120} y={820 + (i % 2) * 30} r={i * 30} k={0.55 * tramo(p('oportunistas'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Txt x={380} y={910} txt="entran los oportunistas" t={26} p={p('oportunistas')} color={TXTC.patogeno} />
      <rect x={830} y={150} width={720} height={420} rx={210} fill="#7A2A8A" opacity={tramo(p('luz'), 0, 0.5)} /><rect x={850} y={170} width={680} height={380} rx={190} fill="#FFF1B8" opacity={tramo(p('luz'), 0, 0.5)} />
      <Sale p={p('cdiff')} x={1190} y={330}><Bacilo k={1.1} tono={G.grampos} /><Bacilo x={-120} y={50} r={20} k={0.9} tono={G.grampos} /></Sale>
      <Txt x={1190} y={420} txt="C. difficile (grampositiva)" t={24} p={p('cdiff')} color="#3B2A9E" />
      <Sale p={p('vancomicina')} x={1040} y={270}><Pastilla k={0.8} r={20} color={['#1E56C6', '#3B82F0', '#BFDBFF']} /></Sale>
      <Sale p={p('fidaxomicina')} x={1360} y={270}><Pastilla k={0.8} r={-20} color={['#138A3A', '#3FD467', '#B5F5C4']} /></Sale>
      <Txt x={1040} y={215} txt="vancomicina oral" t={22} p={p('vancomicina')} color="#3B1A6E" /><Txt x={1360} y={215} txt="fidaxomicina" t={22} p={p('fidaxomicina')} color="#3B1A6E" />
      <Txt x={1190} y={520} txt="casi no se absorben: actúan en la luz" t={26} p={p('absorben')} color="#157A5C" />
      <PildoraFlota x={1190} y={740} k={1.2} rl={reloj} p={p('amplio')} />
      <Bandera x={1190} y={900} txt={TXT_FARMACO} color="#2F6FD8" p={p('amplio')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Tres, Gel2, Comensales, Cinco, Disbiosis, Degrada, Grampositiva, Expuesto, Antibioticos];
export default LAMINAS;
