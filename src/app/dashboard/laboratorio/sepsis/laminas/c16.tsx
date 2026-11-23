'use client';
// Capítulo 16 · Inmunoparálisis y la infección que viene después

import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Barra, Chip, Cruz, Diplococo, Domino, Flecha, Hla, Hombre, Linfocito, Macrofago, Medula, Neutrofilo, Persona, Pulmones, Respira, Rinon, S, Sale, Tijeras, Txt, Ventilador, easeOut, hash, lerp, mezcla, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Escudo de las defensas: azul si vive (`vivo` 1), gris si está apagado (`vivo` 0), con su «z z» flotando. */
const Escudo = ({ k = 1, vivo = 1, reloj = 0 }: { k?: number; vivo?: number; reloj?: number }) => {
  const c0 = mezcla('#6E6478', '#1E4FC0', vivo), c1 = mezcla('#9C92A8', '#4F7FF0', vivo);
  const d = 'M0,-110 C50,-90 90,-86 110,-80 C110,0 80,80 0,120 C-80,80 -110,0 -110,-80 C-90,-86 -50,-90 0,-110 Z';
  return (
    <g transform={`scale(${k})`}>
      <path d={d} fill={c0} transform="translate(0,10)" /><path d={d} fill={c1} />
      <path d="M-70,-62 C-40,-76 -20,-74 -4,-70 C-30,-30 -50,10 -60,40 C-72,0 -76,-30 -70,-62 Z" fill="#FFF" opacity={0.3} />
      <rect x={-12} y={-50} width={24} height={86} rx={8} fill="#FFF" opacity={0.85} /><rect x={-40} y={-22} width={80} height={24} rx={8} fill="#FFF" opacity={0.85} />
      {vivo < 0.5 && <g fontWeight={800} fill={S.gris[0]}><text x={70} y={-120 - 10 * Math.sin(reloj / 600)} fontSize={56}>z</text><text x={110} y={-170 - 10 * Math.sin(reloj / 600 + 1)} fontSize={40}>z</text></g>}
    </g>
  );
};

/** Casa con su fuego (`fuego` 0-1). */
const Casa = ({ k = 1, fuego = 1, reloj = 0 }: { k?: number; fuego?: number; reloj?: number }) => {
  const llama = (x: number, y: number, s: number, i: number) => { const f = 1 + 0.1 * Math.sin(reloj / 90 + i * 2) + 0.06 * Math.sin(reloj / 57 + i); return <g key={i} transform={`translate(${x},${y}) scale(${(s / f).toFixed(3)},${(s * f).toFixed(3)})`} opacity={fuego}><path d="M0,-70 C34,-34 30,2 0,12 C-30,2 -34,-34 0,-70 Z" fill="#FF8A1E" /><path d="M0,-44 C18,-22 16,-2 0,6 C-16,-2 -18,-22 0,-44 Z" fill="#FFE066" /></g>; };
  return (
    <g transform={`scale(${k})`}>
      <rect x={-110} y={-30} width={220} height={150} fill="#8A6A4A" /><rect x={-110} y={-36} width={220} height={150} fill="#D9B88A" />
      <path d="M-150,-30 L0,-150 L150,-30 Z" fill="#8A2A24" /><path d="M-150,-36 L0,-156 L150,-36 Z" fill="#C8443A" />
      <rect x={-26} y={44} width={52} height={70} rx={10} fill="#6A4A2A" />
      <rect x={-86} y={-6} width={46} height={46} rx={8} fill="#2A2F44" /><rect x={40} y={-6} width={46} height={46} rx={8} fill="#2A2F44" />
      {llama(-63, 30, 0.9, 0)}{llama(63, 30, 0.9, 1)}{llama(0, -110, 1.3, 2)}{llama(-90, -70, 0.8, 3)}
    </g>
  );
};

/** Campana de alarma: suena (ondas) o está muda (gris, sin ondas). */
const Campana = ({ k = 1, suena = 1, reloj = 0 }: { k?: number; suena?: number; reloj?: number }) => {
  const c0 = mezcla('#6E6478', '#C99300', suena), c1 = mezcla('#9C92A8', '#FFD23F', suena);
  return (
    <g transform={`scale(${k}) rotate(${suena > 0.5 ? Math.sin(reloj / 90) * 6 : 0})`}>
      <path d="M-70,60 C-70,0 -52,-70 0,-82 C52,-70 70,0 70,60 Z" fill={c0} transform="translate(0,8)" /><path d="M-70,60 C-70,0 -52,-70 0,-82 C52,-70 70,0 70,60 Z" fill={c1} />
      <rect x={-92} y={56} width={184} height={20} rx={10} fill={c0} /><rect x={-92} y={50} width={184} height={20} rx={10} fill={c1} />
      <circle cy={96} r={18} fill={c0} /><ellipse cx={-28} cy={-30} rx={12} ry={32} fill="#FFF" opacity={0.4} transform="rotate(14 -28 -30)" />
      {suena > 0.5 && [1, 2].map((i) => <g key={i} fill="none" stroke={S.lps[1]} strokeWidth={8} strokeLinecap="round" opacity={0.7 - 0.25 * i + 0.2 * Math.sin(reloj / 120 + i)}><path d={`M${90 + i * 26},${-30 - i * 10} q${20 + i * 6},${40 + i * 10} 0,${80 + i * 20}`} /><path d={`M${-90 - i * 26},${-30 - i * 10} q${-20 - i * 6},${40 + i * 10} 0,${80 + i * 20}`} /></g>)}
    </g>
  );
};

/** Carta con la dirección que se borra (`borrada` 0-1). */
const Carta = ({ k = 1, borrada = 0 }: { k?: number; borrada?: number }) => (
  <g transform={`scale(${k})`}>
    <rect x={-150} y={-90} width={300} height={190} rx={16} fill="#C9B07C" /><rect x={-150} y={-100} width={300} height={190} rx={16} fill="#FFF3D6" />
    <path d="M-150,-92 L0,12 L150,-92" fill="none" stroke="#D9C49A" strokeWidth={8} strokeLinejoin="round" />
    <rect x={92} y={-82} width={44} height={52} rx={6} fill={S.il1[1]} opacity={0.85} />
    {[0, 1, 2].map((i) => <rect key={i} x={-100} y={26 + i * 22} width={i === 2 ? 120 : 190} height={9} rx={4.5} fill="#8A7A5A" opacity={1 - borrada} />)}
    <rect x={-112} y={14} width={224} height={76} rx={12} fill="#FFF3D6" opacity={borrada} />
    <text y={74} textAnchor="middle" fontSize={64} fontWeight={800} fill={S.il6[0]} opacity={borrada}>¿?</text>
  </g>
);

/** Soldado (casco, uniforme y cabeza); cansado se encorva y bosteza. */
const Soldado = ({ x, y, k = 1, cansado = 0, o = 1 }: { x: number; y: number; k?: number; cansado?: number; o?: number }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <rect x={-34} y={-6} width={68} height={104} rx={26} fill={mezcla('#2E6A3A', '#6E6478', cansado)} transform={`rotate(${cansado * 10} 0 90)`} />
    <g transform={`rotate(${cansado * 14} 0 -6)`}><circle cy={-40} r={34} fill="#F0B88C" /><path d="M-40,-44 C-40,-90 40,-90 40,-44 Z" fill={mezcla('#3E8A4A', '#8C84A0', cansado)} /><circle cx={-12} cy={-38} r={4} fill="#2A1E3C" /><circle cx={12} cy={-38} r={4} fill="#2A1E3C" /></g>
    {cansado > 0.4 && <text x={46} y={-70} fontSize={34} fontWeight={800} fill={S.gris[0]}>z</text>}
  </g>
);

// ─── 0 · Las dos caras: inflamación e inmunoparálisis ────────────────────────
const DosCaras: Lamina = ({ p, reloj }) => {
  const giro = Math.cos(reloj / 1100), cara = giro >= 0;
  return (
    <g>
      <Bandera x={800} y={95} txt="hasta ahora: una respuesta que se excede" color={S.il1[0]} p={p('excede')} t={32} punta="no" />
      <Sale p={p('cara')} x={800} y={330} k={1.4}><g transform={`scale(${Math.abs(giro).toFixed(3)},1)`}><circle cy={12} r={120} fill={cara ? S.il1[0] : '#1E3F90'} /><circle r={120} fill={cara ? S.il1[1] : '#4F7FF0'} /><circle r={96} fill="none" stroke="#FFF" strokeWidth={6} opacity={0.5} />{cara ? <g transform="translate(0,34) scale(1.15)"><path d="M0,-70 C34,-34 30,2 0,12 C-30,2 -34,-34 0,-70 Z" fill="#FFE066" /><path d="M0,-44 C18,-22 16,-2 0,6 C-16,-2 -18,-22 0,-44 Z" fill="#FFF" opacity={0.8} /></g> : <g transform="scale(0.5)"><Escudo vivo={0.3} reloj={reloj} /></g>}<ellipse cx={-48} cy={-70} rx={30} ry={9} fill="#FFF" opacity={0.5} transform="rotate(-30 -48 -70)" /></g></Sale>
      <Bandera x={800} y={500} txt="y si hay otra cara" color={S.il6[0]} p={p('hay')} t={28} punta="no" />
      <Flecha a={[640, 400]} b={[420, 470]} p={tramo(p('coexisten'), 0, 1)} color={S.il1[1]} w={12} />
      <Flecha a={[960, 400]} b={[1180, 470]} p={tramo(p('coexisten'), 0, 1)} color={S.linfo[1]} w={12} />
      <Bandera x={400} y={520} txt="inflamación excesiva" color={S.il1[0]} p={p('coexisten')} t={26} punta="no" />
      <Bandera x={1200} y={520} txt="defensas apagadas" color={S.linfo[0]} p={p('apagar')} t={26} punta="no" />
      <Bandera x={800} y={605} txt="ambos procesos coexisten" color={S.il6[0]} p={p('coexisten')} t={28} punta="no" />
      <Bandera x={800} y={690} txt="inmunosupresión · inmunoparálisis" color={S.linfo[0]} p={p('inmunoparalisis')} t={34} punta="no" />
      <Sale p={p('apagadas')} x={1330} y={290} k={0.95}><Escudo vivo={1 - easeOut(p('apagadas'))} reloj={reloj} /></Sale>
      <Bandera x={1330} y={410} txt="la inflamación sigue" color={S.il1[0]} p={p('desaparecido')} t={24} punta="no" />
      <Sale p={p('incende')} x={330} y={830} k={0.9}><Casa fuego={1} reloj={reloj} /></Sale>
      <Bandera x={330} y={965} txt="primero se incendia la casa" color={S.il1[0]} p={p('incende')} t={26} punta="no" />
      <Sale p={p('alarma')} x={1250} y={830} k={0.95}><Campana suena={1 - easeOut(p('alarma'))} reloj={reloj} /></Sale>
      <Bandera x={1250} y={965} txt="y después falla la alarma" color={S.gris[0]} p={p('alarma')} t={26} punta="no" />
    </g>
  );
};

// ─── 1 · Los linfocitos mueren ───────────────────────────────────────────────
const Linfopenia: Lamina = ({ p, reloj }) => {
  const muere = easeOut(p('apoptosis')), tonos = ['t', 't', 'b', 't'] as const;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué es lo primero que se pierde?  Los linfocitos" color={S.il6[0]} p={p('pierde')} t={32} punta="no" />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 150 + (i % 4) * 150, y = 290 + Math.floor(i / 4) * 150, muerta = i % 2 === 1;
        return <g key={i} opacity={tramo(p('linfocitos'), i * 0.05, i * 0.05 + 0.4) * (muerta ? 1 - 0.78 * muere : 1)} transform={`translate(${x},${y}) scale(${muerta ? 1 - 0.25 * muere : 1})`}><Linfocito tono={tonos[i % 4]} k={0.9} /></g>;
      })}
      <Sale p={p('cd4')} x={190} y={190} k={1}><Chip x={0} y={0} txt="CD4" color={S.linfo[0]} t={28} /></Sale>
      <Sale p={p('cd8')} x={330} y={190} k={1}><Chip x={0} y={0} txt="CD8" color={S.nfkb[0]} t={28} /></Sale>
      <Sale p={p('b')} x={470} y={190} k={1}><Chip x={0} y={0} txt="B" color={S.il6[0]} t={28} /></Sale>
      <Bandera x={330} y={760} txt="mueren por apoptosis" color={S.il1[0]} p={p('apoptosis')} t={28} punta="no" />
      <Sale p={p('extrinseca')} x={880} y={300} k={1}><Chip x={0} y={0} txt="vía extrínseca" color={S.il1[0]} t={26} /></Sale>
      <Sale p={p('intrinseca')} x={1230} y={300} k={1}><Chip x={0} y={0} txt="vía intrínseca" color={S.lps[0]} t={26} /></Sale>
      <Flecha a={[880, 340]} b={[1040, 470]} p={tramo(p('extrinseca'), 0, 1)} color={S.il1[1]} w={9} />
      <Flecha a={[1230, 340]} b={[1100, 470]} p={tramo(p('intrinseca'), 0, 1)} color={S.lps[1]} w={9} />
      <Sale p={p('caspasas')} x={1070} y={530} k={1.6}><Tijeras abre={0.4 + 0.4 * Math.sin(reloj / 220)} /></Sale>
      <Bandera x={1070} y={650} txt="caspasas" color={S.il1[0]} p={p('caspasas')} t={30} punta="no" />
      <Sale p={p('abuela')} x={900} y={690} k={1}><Chip x={0} y={0} txt="abuela" color={S.lactato[0]} t={28} /></Sale>
      <g opacity={tramo(p('c750'), 0, 0.5)}><rect x={760} y={900 - 130 * easeOut(p('c750'))} width={110} height={130 * easeOut(p('c750'))} rx={20} fill={S.linfo[1]} /><Txt x={815} y={900 - 130 * easeOut(p('c750')) - 20} txt="750" t={40} p={tramo(p('c750'), 0.4, 1)} color={S.linfo[0]} /></g>
      <g opacity={tramo(p('c420'), 0, 0.5)}><rect x={930} y={900 - 73 * easeOut(p('c420'))} width={110} height={73 * easeOut(p('c420'))} rx={20} fill={S.il1[1]} /><Txt x={985} y={900 - 73 * easeOut(p('c420')) - 20} txt="420" t={40} p={tramo(p('c420'), 0.4, 1)} color={S.il1[0]} /></g>
      <Bandera x={1250} y={900} txt="perdió cerca de la mitad" color={S.il1[0]} p={p('mitad')} t={24} punta="no" />
      <Sale p={p('caja')} x={1400} y={760} k={0.7}><g><rect x={-110} y={-40} width={220} height={120} rx={18} fill="#8A2A24" /><rect x={-110} y={-48} width={220} height={120} rx={18} fill="#C8443A" /><path d="M-40,-48 L-40,-80 L40,-80 L40,-48" fill="none" stroke="#6E6478" strokeWidth={14} strokeLinecap="round" /><rect x={-14} y={-6} width={28} height={30} rx={6} fill="#FFD23F" /></g></Sale>
      <Bandera x={800} y={968} txt="se vació la caja de herramientas de la inmunidad adaptativa" color={S.linfo[0]} p={p('adaptativa')} t={24} punta="no" />
    </g>
  );
};

// ─── 2 · Monocitos con poco HLA-DR ───────────────────────────────────────────
const Hladr: Lamina = ({ p, reloj }) => {
  const pierde = easeOut(p('menos'));
  return (
    <g>
      <Bandera x={800} y={95} txt="los monocitos muestran menos HLA-DR" color={S.il6[0]} p={p('hladr')} t={32} punta="no" />
      <Sale p={p('monocitos')} x={430} y={420} k={1.9}><Respira reloj={reloj} amp={0.03}><Macrofago /></Respira></Sale>
      {Array.from({ length: 6 }, (_, i) => { const a = -2.6 + (i / 5) * 2.4; return <g key={i} opacity={tramo(p('monocitos'), 0.2, 0.7) * (i < 2 ? 1 : 1 - pierde)} transform={`translate(${430 + Math.cos(a) * 250},${420 + Math.sin(a) * 215}) rotate(${(a * 180) / Math.PI + 90})`}><Hla k={2.2} /></g>; })}
      <Bandera x={430} y={600} txt="monocito" color={S.linfo[0]} p={p('monocitos')} t={26} punta="no" />
      <Bandera x={430} y={685} txt="HLA-DR: MHC de clase 2" color={S.il6[0]} p={p('clase')} t={26} punta="no" />
      <Sale p={p('presentar')} x={1130} y={400} k={1.6}><Linfocito tono="t" /></Sale>
      <Bandera x={1130} y={530} txt="linfocito CD4" color={S.linfo[0]} p={p('d4')} t={26} punta="no" />
      <Flecha a={[650, 400]} b={[960, 400]} p={tramo(p('presentar'), 0, 1)} color={S.gluco[1]} w={16} />
      <Bandera x={800} y={300} txt="presentar antígenos" color={S.gluco[0]} p={p('presentar')} t={26} punta="no" />
      <g opacity={tramo(p('mal'), 0, 0.5)}><Cruz x={800} y={400} k={1.5} /></g>
      <Bandera x={800} y={490} txt="presentan mal" color={S.il1[0]} p={p('mal')} t={28} punta="no" />
      <Bandera x={1130} y={620} txt="la respuesta se descoordina" color={S.il1[0]} p={p('descordina')} t={24} punta="no" />
      <Sale p={p('carta')} x={430} y={850} k={0.8}><Carta borrada={easeOut(p('borrada'))} /></Sale>
      <Bandera x={800} y={870} txt="una carta con la dirección borrada" color={S.il6[0]} p={p('direccion')} t={26} punta="no" />
      <Bandera x={1200} y={950} txt="nadie sabe a quién va dirigida" color={S.il6[0]} p={p('nadie')} t={28} punta="no" />
    </g>
  );
};

// ─── 3 · Linfocitos agotados ─────────────────────────────────────────────────
const Agotamiento: Lamina = ({ p, reloj }) => {
  const cae = easeOut(p('agotamiento'));
  return (
    <g>
      <Bandera x={800} y={95} txt="los linfocitos que quedan, ¿funcionan bien?" color={S.il6[0]} p={p('quedan')} t={30} punta="no" />
      <Bandera x={800} y={172} txt="no necesariamente" color={S.il1[0]} p={p('necesariamente')} t={32} punta="no" />
      <Sale p={p('exposicion')} x={500} y={470} k={2.4}><Respira reloj={reloj} amp={0.025}><Linfocito tono="t" /></Respira></Sale>
      {[['pd', 'PD-1', 320, 330, S.il1], ['tim', 'TIM-3', 700, 360, S.lps], ['lag', 'LAG-3', 330, 620, S.il6]].map(([clave, txt, x, y, c], i) => (
        <g key={i}><Sale p={p(clave as string)} x={x as number} y={y as number} k={1}><Chip x={0} y={0} txt={txt as string} color={(c as readonly string[])[0]} t={30} /></Sale><Flecha a={[(x as number) + (i === 1 ? -50 : 60), (y as number) + 30]} b={[500, 470]} p={tramo(p(clave as string), 0.2, 1)} color={(c as readonly string[])[1]} w={8} /></g>
      ))}
      <Bandera x={1180} y={300} txt="receptores inhibidores" color={S.il1[0]} p={p('inhibidores')} t={28} punta="no" />
      <Bandera x={1180} y={385} txt="baja la proliferación" color={S.gris[0]} p={p('proliferacion')} t={26} punta="no" />
      <Sale p={p('exposicion')} x={1030} y={560} k={0.9}><Chip x={0} y={0} txt="antígenos e inflamación persistentes" color={S.tnf[0]} t={22} /></Sale>
      {Array.from({ length: 8 }, (_, i) => <Soldado key={i} x={150 + i * 95} y={780} k={0.95} o={i < 3 ? 1 : 1 - tramo(p('apoptosis'), 0, 0.8) * 0.95} />)}
      <Bandera x={420} y={910} txt="la apoptosis baja el número" color={S.il1[0]} p={p('apoptosis')} t={24} punta="no" />
      {Array.from({ length: 3 }, (_, i) => <Soldado key={i} x={1000 + i * 140} y={780} k={1.05} cansado={cae} />)}
      <Bandera x={1130} y={910} txt="el agotamiento baja la función" color={S.gris[0]} p={p('agotamiento')} t={24} punta="no" />
      <Bandera x={420} y={968} txt="menos soldados" color={S.il1[0]} p={p('menos')} t={28} punta="no" />
      <Bandera x={1130} y={968} txt="y soldados cansados" color={S.gris[0]} p={p('cansados')} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · Neutrófilos: mucha cantidad, poca calidad ───────────────────────────
const Neutrofilos: Lamina = ({ p, reloj }) => {
  const sale = easeOut(p('salen'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y los neutrófilos?  ¿Hay muchos?" color={S.il6[0]} p={p('neutrofilos')} t={32} punta="no" />
      <Sale p={p('muchos')} x={260} y={470} k={0.55}><Medula /></Sale>
      <Bandera x={260} y={620} txt="médula ósea" color={S.endo[0]} p={p('medula')} t={26} punta="no" />
      {Array.from({ length: 14 }, (_, i) => { const u = (corre(reloj, i, 14, 6000) * 0.4 + 0.6 * sale); const x = lerp(300, 1450, (hash(i, 51) * 0.5 + u * 0.5)), y = 330 + ((i * 53) % 340) + Math.sin(reloj / 500 + i) * 14; return <g key={i} opacity={tramo(p('muchos'), 0, 0.4)} transform={`translate(${x},${y})`}><Neutrofilo k={0.8} activo={0.5} /></g>; })}
      <Bandera x={900} y={235} txt="muchos: salen de la médula en masa" color={S.gluco[0]} p={p('salen')} t={26} punta="no" />
      <g opacity={tramo(p('quimiotaxis'), 0, 0.5)} transform="translate(300,690)"><circle r={54} fill={S.gris[2]} opacity={0.8} />{[0, 1, 2, 3].map((i) => <path key={i} d="M0,-36 L10,-10 L-10,-10 z" fill={S.il6[1]} transform={`rotate(${i * 90 + Math.sin(reloj / 300 + i) * 40})`} />)}</g>
      <Bandera x={300} y={780} txt="quimiotaxis alterada" color={S.il6[0]} p={p('quimiotaxis')} t={24} punta="no" />
      <Sale p={p('fagocitosis')} x={640} y={690} k={1}><g><Neutrofilo k={0.55} /><g transform={`translate(${70 + Math.sin(reloj / 400) * 10},${-10})`}><ellipse rx={32} ry={14} fill={S.menin[1]} /></g></g></Sale>
      <Bandera x={640} y={780} txt="fagocitosis alterada" color={S.il6[0]} p={p('fagocitosis')} t={24} punta="no" />
      <Sale p={p('matar')} x={980} y={690} k={1}><g><ellipse rx={36} ry={16} fill={S.menin[1]} /><ellipse cx={-10} cy={-5} rx={12} ry={5} fill="#FFF" opacity={0.6} /></g></Sale>
      <Bandera x={980} y={780} txt="no matan bien" color={S.il1[0]} p={p('matar')} t={24} punta="no" />
      <g opacity={tramo(p('ros'), 0, 0.5)} transform="translate(1260,680)"><circle r={34} fill={S.verde[1]} />{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d="M0,-46 L6,-62 L-6,-62 z" fill={S.verde[0]} transform={`rotate(${i * 60 + reloj / 30})`} />)}</g>
      <Bandera x={1260} y={780} txt="ROS y NET desregulados" color={S.net[0]} p={p('nets')} t={24} punta="no" />
      <Barra x={430} y={920} w={340} h={30} val={0.95} color={S.gluco[1]} txt="cantidad" valor="alta" p={p('cantidad')} />
      <Barra x={980} y={920} w={340} h={30} val={0.2} color={S.il1[1]} txt="calidad" valor="baja" p={p('calidad')} />
    </g>
  );
};

// ─── 5 · El pulmón sin defensas: tubo y biopelícula ──────────────────────────
const PulmonSinDefensas: Lamina = ({ p, reloj }) => {
  const dano = tramo(p('aclaramiento'), 0, 1);
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué le queda al pulmón de la abuela para defenderse?" color={S.il6[0]} p={p('queda')} t={30} punta="no" />
      <Bandera x={800} y={172} txt="muy poco" color={S.il1[0]} p={p('poco')} t={36} punta="no" />
      <rect x={90} y={760} width={1420} height={70} rx={30} fill={S.cito[0]} opacity={tramo(p('aclaramiento'), 0, 0.4)} /><rect x={90} y={752} width={1420} height={70} rx={30} fill={S.cito[1]} opacity={tramo(p('aclaramiento'), 0, 0.4)} />
      {Array.from({ length: 36 }, (_, i) => { const x = 130 + i * 38, sway = Math.sin(reloj / 260 + i * 0.7) * 16 * (1 - 0.85 * dano); return <path key={i} d={`M${x},752 q${sway},-34 ${sway * 1.2},-62`} fill="none" stroke={mezcla(S.gluco[1], S.gris[1], dano)} strokeWidth={7} strokeLinecap="round" opacity={tramo(p('aclaramiento'), 0, 0.4)} />; })}
      <Bandera x={420} y={880} txt="aclaramiento mucociliar alterado" color={S.il1[0]} p={p('aclaramiento')} t={24} punta="no" />
      <g opacity={tramo(p('retienen'), 0, 0.5)}>{[[300, 700, 120, 40], [620, 706, 150, 36], [1010, 700, 130, 42]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={S.nfkb[1]} opacity={0.75} />)}</g>
      <Bandera x={660} y={620} txt="secreciones retenidas" color={S.nfkb[0]} p={p('secreciones')} t={24} punta="no" />
      <Bandera x={1240} y={880} txt="epitelio lesionado" color={S.endo[0]} p={p('lesionado')} t={24} punta="no" />
      <Sale p={p('tubo')} x={800} y={440} k={1}><g><rect x={-560} y={-70} width={1120} height={140} rx={70} fill="#5E78A8" opacity={0.55} /><rect x={-560} y={-78} width={1120} height={140} rx={70} fill="#BFD6F5" opacity={0.7} /><rect x={-520} y={-62} width={900} height={22} rx={11} fill="#FFF" opacity={0.6} /></g></Sale>
      <Bandera x={800} y={440} txt="tubo endotraqueal" color={S.linfo[0]} p={p('tubo')} t={30} punta="no" />
      <Bandera x={420} y={330} txt="un cuerpo extraño en la vía aérea" color={S.gris[0]} p={p('extrano')} t={24} punta="no" />
      <g opacity={tramo(p('biopelicula'), 0, 0.6)}><path d={`M-460,0 ${Array.from({ length: 26 }, (_, i) => `q18,${i % 2 ? -22 : 22} 36,0`).join(' ')}`} transform="translate(420,530)" fill="none" stroke={S.pseudo[1]} strokeWidth={26} strokeLinecap="round" opacity={0.85} />{[0, 1, 2, 3, 4, 5, 6].map((i) => <g key={i} transform={`translate(${340 + i * 150},${532 + (i % 2) * 8}) rotate(${i * 40})`}><ellipse rx={26} ry={11} fill={S.pseudo[0]} /><ellipse cy={-3} rx={22} ry={8} fill={S.pseudo[2]} /></g>)}</g>
      <Bandera x={1240} y={560} txt="biopelícula" color={S.pseudo[0]} p={p('biopelicula')} t={30} punta="no" />
      <Sale p={p('guardia')} x={1400} y={300} k={0.55}><Escudo vivo={0} reloj={reloj} /></Sale>
      <Bandera x={1130} y={300} txt="húmedo, protegido y sin guardia" color={S.gris[0]} p={p('humedo')} t={24} punta="no" />
      <Bandera x={800} y={968} txt="el terreno perfecto para una nueva infección" color={S.il1[0]} p={p('terreno')} t={30} punta="no" />
    </g>
  );
};

// ─── 6 · Pseudomonas aeruginosa ──────────────────────────────────────────────
const Pseudomonas: Lamina = ({ p, reloj }) => {
  const y = (q: string) => easeOut(p(q));
  return (
    <g>
      <Sale p={p('dia')} x={200} y={170} k={1}><Chip x={0} y={0} txt="día 8" color={S.il6[0]} t={32} /></Sale>
      <Sale p={p('ventilacion')} x={190} y={350} k={0.6}><Ventilador reloj={reloj} /></Sale>
      <Sale p={p('infiltrado')} x={400} y={420} k={0.55}><Pulmones infiltrados={0.8} /></Sale>
      <Bandera x={300} y={570} txt="infiltrado nuevo" color={S.il1[0]} p={p('infiltrado')} t={24} punta="no" />
      <Sale p={p('c420')} x={300} y={650} k={1}><Chip x={0} y={0} txt="420 linfocitos" color={S.linfo[0]} t={26} /></Sale>
      <Bandera x={900} y={95} txt="¿el culpable?  Pseudomonas aeruginosa" color={S.pseudo[0]} p={p('seudomonas')} t={34} punta="no" />
      <g opacity={tramo(p('piocianina'), 0, 0.6)}>{[[0, 0, 190], [-120, 40, 130], [140, -30, 150], [60, 90, 120]].map(([dx, dy, r], i) => <circle key={i} cx={900 + (dx as number)} cy={500 + (dy as number)} r={r as number} fill={S.verde[1]} opacity={0.22} />)}</g>
      <Sale p={p('seudomonas')} x={900} y={500} k={3}><Bacilo tono={S.pseudo} fimbrias={y('pili')} flagelo={y('flagelo')} capsula={y('biopeliculas')} reloj={reloj} /></Sale>
      <Bandera x={1370} y={190} txt="bacilo gramnegativo" color={S.pseudo[0]} p={p('gram')} t={26} punta="no" />
      <Bandera x={1370} y={260} txt="aerobio" color={S.no[0]} p={p('aerobio')} t={26} punta="no" />
      <Bandera x={1370} y={330} txt="no fermentador" color={S.gris[0]} p={p('fermentador')} t={26} punta="no" />
      <Sale p={p('oxidasa')} x={1370} y={430} k={1}><g><rect x={-60} y={-24} width={120} height={48} rx={10} fill="#E8D9B8" /><rect x={-60} y={-24} width={52 + 68 * easeOut(p('oxidasa')) } height={48} rx={10} fill={mezcla('#E8D9B8', '#7A3FB0', easeOut(p('oxidasa')))} /></g></Sale>
      <Bandera x={1370} y={500} txt="oxidasa positivo" color={S.il6[0]} p={p('oxidasa')} t={24} punta="no" />
      <Bandera x={1300} y={600} txt="piocianina: pigmento verde" color={S.verde[0]} p={p('piocianina')} t={24} punta="no" />
      <Bandera x={1300} y={670} txt="a su lado" color={S.verde[0]} p={p('verde')} t={24} punta="no" />
      <Bandera x={520} y={760} txt="pili tipo 4" color={S.menin[0]} p={p('pili')} t={26} punta="no" />
      <Bandera x={520} y={835} txt="flagelo" color={S.lps[0]} p={p('flagelo')} t={26} punta="no" />
      <Bandera x={900} y={830} txt="biopelículas" color={S.pseudo[0]} p={p('biopeliculas')} t={28} punta="no" />
      <Bandera x={1250} y={760} txt="elastasa" color={S.tnf[0]} p={p('elastasa')} t={28} punta="no" />
      <Bandera x={1250} y={835} txt="exotoxina A" color={S.il1[0]} p={p('exotoxina')} t={28} punta="no" />
      <Bandera x={1250} y={905} txt="secreción tipo 3" color={S.il6[0]} p={p('secrecion')} t={28} punta="no" />
      <Bandera x={800} y={960} txt="y su LPS activa de nuevo al TLR4" color={S.il1[0]} p={p('tlr4')} t={30} punta="no" />
      <Sale p={p('lps')} x={330} y={930} k={0.9}><Chip x={0} y={0} txt="LPS" color={S.lps[0]} t={34} /></Sale>
    </g>
  );
};

// ─── 7 · Dos desenlaces y la respuesta a la pregunta del principio ───────────
const Final: Lamina = ({ p, reloj }) => {
  const cadena: { clave: string; txt: string; c: readonly string[] }[] = [
    { clave: 'receptor', txt: 'receptor', c: S.il1 }, { clave: 'endotelio', txt: 'endotelio', c: S.endo }, { clave: 'coagulacion', txt: 'coagulación', c: S.fibrina },
    { clave: 'choque', txt: 'choque', c: S.sangre }, { clave: 'inmunoparalisis', txt: 'inmunoparálisis', c: S.linfo },
  ];
  return (
    <g>
      <Bandera x={800} y={95} txt="dos pacientes, dos desenlaces" color={S.il6[0]} p={p('pacientes')} t={34} punta="no" />
      <Sale p={p('joven')} x={330} y={260} k={0.4}><Hombre /></Sale>
      <Bandera x={330} y={450} txt="el joven sobrevivió" color={S.gluco[0]} p={p('sobrevivio')} t={26} punta="no" />
      <Sale p={p('renal')} x={200} y={540} k={0.55}><Rinon palido={0.5} /></Sale>
      <g opacity={tramo(p('necrosis'), 0, 0.5)} transform="translate(450,550)"><circle r={50} fill={S.il6[0]} opacity={0.5} /><circle r={40} fill="#7A1E3A" /><circle r={29} fill="#1E0F18" /></g>
      <Bandera x={330} y={640} txt="lesión renal y necrosis de piel" color={S.il1[0]} p={p('necrosis')} t={22} punta="no" />
      <Sale p={p('abuela')} x={1240} y={260} k={0.4}><Persona quien="mujer" palidez={0.5} /></Sale>
      <Bandera x={1240} y={450} txt="la abuela falleció el día 12" color={S.gris[0]} p={p('fallecio')} t={26} punta="no" />
      <Sale p={p('hipoxemia')} x={1240} y={540} k={0.5}><Pulmones infiltrados={1} /></Sale>
      <Bandera x={1240} y={640} txt="hipoxemia refractaria" color={S.no[0]} p={p('hipoxemia')} t={24} punta="no" />
      <Sale p={p('pregunta')} x={800} y={270} k={1}><text textAnchor="middle" fontSize={190} fontWeight={800} fill={S.il6[1]} opacity={0.9}>?</text></Sale>
      <Bandera x={800} y={335} txt="¿cómo daña una infección órganos que el microbio nunca tocó?" color={S.il6[0]} p={p('organos')} t={22} punta="no" />
      <Sale p={p('microbio')} x={800} y={440} k={0.6}><Diplococo reloj={reloj} pili={0.4} /></Sale>
      <g opacity={tramo(p('nunca'), 0, 0.5)}><path d="M720,440 L430,530 M880,440 L1150,530" stroke={S.gris[1]} strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" /></g>
      <Bandera x={800} y={520} txt="el daño lo hizo la respuesta del huésped" color={S.il1[0]} p={p('huesped')} t={26} punta="no" />
      {cadena.map((d, i) => (
        <Domino key={d.clave} x={170 + i * 270} y={760} k={0.75} cae={easeOut(p(d.clave)) * (i === cadena.length - 1 ? 0 : 1)} tono={d.c}><text y={60} textAnchor="middle" fontSize={22} fontWeight={800} fill="#FFF">{d.txt}</text></Domino>
      ))}
      <Bandera x={760} y={880} txt="del receptor a la inmunoparálisis" color={S.il6[0]} p={p('inmunoparalisis')} t={22} punta="no" />
      <Sale p={p('defensa')} x={1470} y={850} k={0.5}><Escudo vivo={0.4} reloj={reloj} /></Sale>
      <Bandera x={760} y={960} txt="la sepsis: una defensa que se vuelve contra quien defiende" color={S.il1[0]} p={p('defiende')} t={30} punta="no" />
      <Bandera x={1250} y={915} txt="esa es la sepsis" color={S.il1[0]} p={p('sepsis')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosCaras, Linfopenia, Hladr, Agotamiento, Neutrofilos, PulmonSinDefensas, Pseudomonas, Final];
export default LAMINAS;
