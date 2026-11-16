'use client';
// Capítulo 7 · Leer el laboratorio

import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Chip, Cruz, Flecha, Frasco, Pantalla, Sale, Tetrapirrol, Tira, TuboEnsayo, TuboOrina, Txt, TxtPantalla, TXB, Visto, clamp, easeOut, lerp, mezcla, tramo } from '../Piezas';

const AZO = '#C2307A';

const VanDenBergh: Lamina = ({ p, reloj }) => {
  const tine = p('tine');
  return (
    <g>
      <Bandera x={800} y={80} txt="la reacción de van den Bergh" color="#2E78F2" p={p('mide')} t={30} punta="no" />
      <Sale p={p('reaccion')} x={520} y={540} k={1.3}><TuboEnsayo color={mezcla('#FFD23F', AZO, easeOut(tine))} nivel={0.65} reloj={reloj} /></Sale>
      {p('diazo') > 0.05 && [0, 1, 2].map((i) => {
        const u = (reloj / 1600 + i / 3) % 1;
        return <circle key={i} cx={520} cy={lerp(160, 360, u)} r={11} fill="#8A5AF0" opacity={p('diazo') * (1 - u)} />;
      })}
      <Chip x={520} y={150} txt="reactivo diazo" color="#5A2DB0" p={p('diazo')} t={24} />
      <Txt x={520} y={820} txt="azobilirrubina: coloreada" t={28} p={p('azo')} color={TXB.rosa} />
      <Tetrapirrol x={1120} y={420} k={0.6} colitas={2} tono={B.conjugada} vibra={reloj} o={tramo(p('directa'), 0, 0.4)} />
      <Txt x={1120} y={600} txt="la conjugada reacciona enseguida" t={26} p={p('directa')} />
      <Bandera x={1120} y={680} txt="por eso: «directa»" color={AZO} p={p('directa')} t={30} punta="no" />
    </g>
  );
};

const LaQueSeEsconde: Lamina = ({ p, reloj }) => {
  const acel = p('acelerador');
  return (
    <g>
      <Bandera x={800} y={80} txt="la no conjugada se esconde" color="#2E78F2" p={p('esconde')} t={30} punta="no" />
      <Albumina x={420} y={470} k={1.3} reloj={reloj} o={tramo(p('esconde'), 0, 0.4)} />
      <Tetrapirrol x={420 + 140 * easeOut(acel)} y={lerp(380, 300, easeOut(acel))} k={0.4} plegada={1} tono={B.bilirrubina} vibra={reloj} o={tramo(p('esconde'), 0, 0.4)} />
      <Chip x={420} y={640} txt="acelerador: la saca de la albúmina" color="#C77800" p={acel} t={24} />
      <Sale p={p('total')} x={1120} y={480} k={1.1}><TuboEnsayo color={AZO} nivel={0.8} reloj={reloj} /></Sale>
      <Txt x={1120} y={720} txt="bilirrubina total" t={30} p={p('total')} />
      <Pantalla x={800} y={870} w={1100} h={150} p={p('calcula')}>
        <TxtPantalla x={0} y={8} txt="indirecta = total − directa" t={44} p={p('calcula')} />
      </Pantalla>
    </g>
  );
};

/** Regla de 0 a 4 mg/dL. */
function Regla({ x0, x1, y, p, marca, zona }: { x0: number; x1: number; y: number; p: number; marca: number; zona: number }) {
  if (p <= 0.002) return null;
  const X = (v: number) => lerp(x0, x1, v / 4);
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      <rect x={x0} y={y - 22} width={(x1 - x0) * easeOut(clamp(p))} height={44} rx={22} fill="var(--vas-suave)" />
      <rect x={X(0.3)} y={y - 22} width={(X(1.2) - X(0.3)) * easeOut(clamp(p))} height={44} rx={22} fill="#18A34A" opacity={0.75} />
      <rect x={X(2.5)} y={y - 22} width={(X(4) - X(2.5)) * clamp(zona)} height={44} rx={22} fill="#FFAA1A" opacity={0.85} />
      {[0, 1, 2, 3, 4].map((v) => <g key={v}><rect x={X(v) - 2} y={y + 28} width={4} height={18} fill="var(--cit-texto-2)" /><text x={X(v)} y={y + 74} textAnchor="middle" style={{ fontSize: 26, fontWeight: 700, fill: 'var(--cit-texto)' }}>{v}</text></g>)}
      <text x={x1 + 30} y={y + 10} style={{ fontSize: 24, fontWeight: 600, fill: 'var(--cit-texto-2)' }}>mg/dL</text>
      <g transform={`translate(${X(marca)},${y - 60})`}><path d="M-18,-26 L18,-26 L0,0 Z" fill="var(--cit-texto)" /></g>
    </g>
  );
}

const Valores: Lamina = ({ p, reloj }) => {
  const ict = p('ictericia');
  const marca = lerp(1, 2.8, easeOut(ict));
  const esclera = mezcla('#FFFAF5', '#FFD84A', easeOut(p('escleras')) * (0.8 + Math.sin(reloj / 900) * 0.1));
  return (
    <g>
      <Bandera x={800} y={80} txt="¿cuánto es normal?" color="#2E78F2" p={p('normal')} t={30} punta="no" />
      <Regla x0={180} x1={1300} y={420} p={p('normal')} marca={marca} zona={ict} />
      <Txt x={460} y={290} txt="alrededor de 1: casi toda indirecta" t={26} p={p('uno')} color={TXB.verde} />
      <Txt x={1100} y={290} txt="ictericia desde 2,5 a 3" t={26} p={ict} color={TXB.ambar} />
      <Sale p={p('escleras')} x={800} y={720} k={1.3}>
        <path d="M-110,0 Q0,-86 110,0 Q0,86 -110,0 Z" fill="#B5734F" />
        <path d="M-96,0 Q0,-72 96,0 Q0,72 -96,0 Z" fill={esclera} />
        <circle r={40} fill="#3E7A3A" /><circle r={20} fill="#1A1030" /><circle cx={-12} cy={-12} r={8} fill="#FFF" />
      </Sale>
      <Txt x={800} y={850} txt="primero, en las escleras" t={26} p={p('escleras')} />
      <Bandera x={800} y={930} txt="para que se note, más del doble" color="#C77800" p={p('doble')} t={24} punta="no" />
    </g>
  );
};

const Patron: Lamina = ({ p, reloj }) => {
  const q = p('quinta');
  const a = (Math.PI * 2) / 5;
  return (
    <g>
      <Bandera x={800} y={90} txt="¿patrón conjugado?" color="#2E78F2" p={p('conjugada')} t={30} punta="no" />
      <g transform="translate(560,480)" opacity={tramo(p('conjugada'), 0, 0.4)}>
        <circle r={220} fill={B.bilirrubina[1]} />
        <path d={`M0,0 L0,-220 A220,220 0 0 1 ${(Math.sin(a * easeOut(q) * 1.15) * 220).toFixed(1)},${(-Math.cos(a * easeOut(q) * 1.15) * 220).toFixed(1)} Z`} fill={AZO} />
        <circle r={220} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />
        <text y={14} textAnchor="middle" style={{ fontSize: 34, fontWeight: 800, fill: '#FFF' }}>total</text>
        <g transform={`rotate(${Math.sin(reloj / 900) * 2})`} />
      </g>
      <Txt x={1120} y={400} txt="directa > 1/5 de la total" t={32} p={q} color={TXB.rosa} />
      <Chip x={1120} y={540} txt="recién nacido: directa > 1 mg/dL" color="#C2185B" p={p('recien')} t={26} />
    </g>
  );
};

const Delta: Lamina = ({ p, reloj }) => {
  const une = p('covalente');
  return (
    <g>
      <Bandera x={800} y={80} txt="una tercera población: la bilirrubina delta" color="#2E78F2" p={p('tercera')} t={28} punta="no" />
      <Albumina x={560} y={470} k={1.6} reloj={reloj} o={tramo(p('delta'), 0, 0.4)} />
      <Tetrapirrol x={560 + lerp(-260, 0, easeOut(une))} y={lerp(260, 340, easeOut(une))} k={0.45} colitas={2} tono={B.conjugada} vibra={reloj} o={tramo(p('delta'), 0, 0.4)} />
      {une > 0.5 && <g opacity={tramo(une, 0.5, 1)}><rect x={540} y={360} width={40} height={50} rx={8} fill="#5A2DB0" /><path d="M547,362 L547,345 A13,13 0 0 1 573,345 L573,362" fill="none" stroke="#5A2DB0" strokeWidth={7} /></g>}
      <Txt x={560} y={680} txt="enlace covalente: ya no se suelta" t={26} p={une} />
      <Txt x={560} y={240} txt="conjugada mucho tiempo en sangre: obstrucción" t={22} p={p('obstruccion')} />
      <Chip x={1180} y={420} txt="se mide dentro de la directa" color={AZO} p={p('directa')} t={24} />
      <g opacity={tramo(p('semanas'), 0, 0.4)}>
        {Array.from({ length: 21 }, (_, i) => <rect key={i} x={980 + (i % 7) * 58} y={540 + Math.floor(i / 7) * 58} width={48} height={48} rx={10} fill={i < Math.round(21 * easeOut(p('semanas'))) ? '#2E78F2' : 'var(--vas-suave)'} />)}
      </g>
      <Txt x={1180} y={760} txt="dura lo que la albúmina: 2-3 semanas" t={24} p={p('semanas')} />
    </g>
  );
};

const TardaEnIrse: Lamina = ({ p, reloj }) => {
  const orina = p('orina'), piel = p('piel');
  return (
    <g>
      <Bandera x={800} y={80} txt="se resuelve la obstrucción…" color="#2E78F2" p={p('obstruccion')} t={30} punta="no" />
      <Sale p={p('orina')} x={420} y={460} k={1}><TuboOrina oscuro={0.7 * (1 - easeOut(orina))} /></Sale>
      <Txt x={420} y={680} txt="la orina se aclara pronto" t={26} p={orina} />
      <Sale p={piel} x={1150} y={460} k={1.1}>
        <rect x={-200} y={-110} width={400} height={220} rx={110} fill="#C9806A" />
        <rect x={-200} y={-110} width={392} height={206} rx={104} fill={mezcla('#E9A58A', '#F2C84A', 0.75 + Math.sin(reloj / 1100) * 0.05)} />
      </Sale>
      <Txt x={1150} y={680} txt="la piel sigue amarilla semanas" t={26} p={piel} color={TXB.ambar} />
      <Txt x={800} y={820} txt="la delta no se filtra en el riñón" t={28} p={p('filtra')} />
      <Bandera x={800} y={910} txt="se va cuando la albúmina se recambia" color="#2E78F2" p={p('recambia')} t={24} punta="no" />
    </g>
  );
};

const INCOLORO = ['#9A90B8', '#E4DEF2', '#FFFFFF'] as const;

/** Flecha de la almohadilla a su molécula, del color de la molécula, con gotitas que corren por ella. */
function Enlace({ a, b, p, tono, reloj }: { a: [number, number]; b: [number, number]; p: number; tono: readonly string[]; reloj: number }) {
  if (p <= 0.002) return null;
  return (
    <g>
      <Flecha a={a} b={b} p={p} color={tono[0]} w={9} />
      {p > 0.6 && [0, 1, 2].map((i) => {
        const u = (reloj / 1400 + i / 3) % 1;
        return <circle key={i} cx={lerp(a[0], b[0], u)} cy={lerp(a[1], b[1], u)} r={8} fill={tono[1]} stroke={tono[0]} strokeWidth={2} opacity={tramo(Math.min(u, 1 - u), 0, 0.15)} />;
      })}
    </g>
  );
}

const LaTira: Lamina = ({ p, reloj }) => {
  const sube = p('sube'), desap = p('desaparece');
  const conj = p('conjugada'), uro = p('urobilinogeno');
  const padUro = desap > 0.5 ? '#F4F2FA' : mezcla('#F6C8A8', '#E0607A', easeOut(sube));
  // Almohadillas de la tira (k = 1 en y = 540): la de bilirrubina en y ≈ 394 y la de urobilinógeno en y ≈ 486.
  return (
    <g>
      <Bandera x={800} y={80} txt="la orina también habla" color="#2E78F2" p={p('giro')} t={30} punta="no" />
      <Sale p={p('tira')} x={380} y={540} k={1}><Tira r={Math.sin(reloj / 1200) * 2} pads={['#F2E8A0', mezcla('#F2E8A0', '#B07A5A', easeOut(conj)), padUro, '#B8D8A0', '#C8B8E0']} /></Sale>
      <Txt x={380} y={890} txt="tira reactiva de orina" t={22} p={p('tira')} fuerte={false} />
      {/* Bilirrubina: solo la conjugada (amarillo limón, con sus colitas) */}
      <Enlace a={[440, 394]} b={[700, 320]} p={conj} tono={B.conjugada} reloj={reloj} />
      <Sale p={conj} x={810} y={300 + Math.sin(reloj / 700) * 6} k={0.42}><Tetrapirrol colitas={2} tono={B.conjugada} vibra={reloj} /></Sale>
      <Txt x={930} y={290} txt="bilirrubina: solo si es conjugada" t={26} p={conj} ancla="start" color={TXB.limon} />
      <Txt x={930} y={335} txt="la no conjugada va en su albúmina y no se filtra" t={20} p={conj} ancla="start" fuerte={false} />
      {/* Urobilinógeno: incoloro */}
      <Enlace a={[440, 486]} b={[700, 580]} p={uro} tono={INCOLORO} reloj={reloj} />
      <Sale p={uro} x={810} y={590 + Math.sin(reloj / 700 + 1) * 6} k={0.42}><Tetrapirrol plegada={0.2} tono={INCOLORO} vibra={reloj + 400} /></Sale>
      <Txt x={930} y={580} txt="urobilinógeno" t={28} p={uro} ancla="start" />
      <Flecha a={[950, 690]} b={[950, 640]} p={sube} color="#E3203F" w={7} />
      <Txt x={985} y={665} txt="sube: hemólisis y daño hepático" t={22} p={sube} ancla="start" fuerte={false} />
      <Cruz x={952} y={730} k={0.55} o={desap} />
      <Txt x={985} y={730} txt="desaparece: obstrucción completa" t={22} p={desap} ancla="start" fuerte={false} />
    </g>
  );
};

const CuatroPreguntas: Lamina = ({ p, reloj }) => {
  const qs = [
    { n: 'q1', txt: '¿qué fracción está alta?', el: <TuboEnsayo k={0.55} color={AZO} nivel={0.6} reloj={reloj} /> },
    { n: 'q2', txt: '¿bilirrubina en la orina?', el: <TuboOrina k={0.5} oscuro={0.4} /> },
    { n: 'q3', txt: '¿hay urobilinógeno?', el: <Tira k={0.4} pads={['#F2E8A0', '#C8A080', '#E0607A', '#B8D8A0', '#C8B8E0']} /> },
    { n: 'q4', txt: '¿de qué color son las heces?', el: <Frasco k={0.75} tono={B.estercobilina as unknown as string[]} /> },
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="cuatro preguntas" color="#2E78F2" p={p('cuatro')} t={32} punta="no" />
      {qs.map((q, i) => (
        <g key={q.n}>
          <Sale p={p(q.n)} x={230 + i * 380} y={420 + Math.sin(reloj / 800 + i) * 8}>{q.el}</Sale>
          <Txt x={230 + i * 380} y={630} txt={`${i + 1}`} t={44} p={p(q.n)} color={TXB.albumina} />
          <Txt x={230 + i * 380} y={690} txt={q.txt} t={22} p={p(q.n)} />
        </g>
      ))}
      <Visto x={600} y={860} k={1.1} o={p('respuestas')} />
      <Txt x={660} y={860} txt="con esas respuestas, ubicas la estación" t={28} p={p('respuestas')} ancla="start" />
    </g>
  );
};

const LAMINAS: Lamina[] = [VanDenBergh, LaQueSeEsconde, Valores, Patron, Delta, TardaEnIrse, LaTira, CuatroPreguntas];
export default LAMINAS;
