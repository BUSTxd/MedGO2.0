'use client';
// Capítulo 17 · Sífilis primaria: el chancro

import type { Lamina } from '../Lienzo';
import { Bandera, Cruz, Cuerpo, Epitelioide, Escamoso, Flecha, Helice, Hombre, Linfocito, Medallon, Nodo, P, Plasmatica, Punto, Reloj, Sale, Signo, Trazo, Treponema, TuboEnsayo, Txt, TXV, Visto, easeOut, hash, lerp, tramo } from '../Piezas';
import { Dolor, Gota, Parche, Ulcera } from './ComunSifilis';

// ─── 0 · El paciente 2 ───────────────────────────────────────────────────────
const Paciente2: Lamina = ({ p }) => (
  <g>
    <Sale p={p('varon')} x={250} y={300}><Hombre k={0.4} piel={P.piel2} /></Sale>
    <Bandera x={250} y={105} txt="paciente 2 · 27 años" color={P.esp[0]} p={p('n27')} t={26} punta="abajo" />
    <Txt x={250} y={470} txt="lesión en el glande" t={24} p={p('lesion')} />
    <Cuerpo x={250} y={690} k={0.5}>
      <Punto x={0} y={80} p={p('glande')} />
      <Nodo x={-50} y={52} p={p('ganglios')} k={1.6} /><Nodo x={50} y={52} p={p('ganglios')} k={1.6} />
    </Cuerpo>
    <Txt x={250} y={915} txt="ganglios inguinales de ambos lados" t={20} p={p('ganglios')} />
    <Txt x={250} y={950} txt="móviles" t={22} p={p('moviles')} />
    {/* la úlcera, de cerca */}
    <Medallon x={880} y={370} R={215} id="u17" fondo="#F2A8C0" o={tramo(p('ulcera'), 0, 0.4)}><Ulcera y={10} k={0.9} dura={p('dura')} /></Medallon>
    <Txt x={880} y={632} txt="úlcera única de 12 mm" t={28} p={p('n12')} color={TXV.sangre} />
    <Txt x={880} y={676} txt="bordes bien definidos" t={22} p={p('bordes')} />
    <Txt x={880} y={712} txt="base limpia e indurada" t={22} p={p('base')} />
    <Sale p={p('duele')} x={1250} y={330}><Signo mas={false} k={1.3} /></Sale>
    <Txt x={1250} y={430} txt="no duele" t={36} p={p('duele')} color={TXV.verde} />
    <Txt x={1250} y={482} txt="ni la úlcera ni los ganglios" t={22} p={p('dolor')} />
    {/* tres semanas con la lesión; seis desde la exposición */}
    <rect x={1070} y={790} width={410} height={22} rx={11} fill={P.esp[1]} opacity={tramo(p('n3'), 0, 0.5)} />
    <rect x={660} y={790} width={420} height={22} rx={11} fill={P.espiga[1]} opacity={tramo(p('n6'), 0, 0.5)} />
    <Sale p={p('exposicion')} x={660} y={801}>
      <circle cx={3} cy={4} r={26} fill={P.sombra} /><circle r={26} fill={P.sangre[0]} /><circle cx={-2} cy={-2} r={22} fill={P.sangre[1]} /><circle cx={-8} cy={-9} r={6} fill="#FFF" opacity={0.7} />
    </Sale>
    <Txt x={1275} y={752} txt="3 semanas con la lesión" t={24} p={p('n3')} color={TXV.esp} />
    <Txt x={865} y={752} txt="6 semanas desde la exposición" t={24} p={p('n6')} color={TXV.ambar} />
    <Txt x={660} y={856} txt="exposición sexual de riesgo" t={22} p={p('exposicion')} />
    <Txt x={880} y={925} txt="la primera pista:" t={28} p={p('pista')} color={TXV.violeta} />
    <Txt x={880} y={968} txt="una úlcera que no duele" t={32} p={p('duele2')} color={TXV.verde} />
  </g>
);

// ─── 1 · Del inóculo a la úlcera ─────────────────────────────────────────────
const InoculoUlcera: Lamina = ({ p, reloj }) => {
  const ero = easeOut(p('erosiona'));
  const luz = 50 - 36 * easeOut(p('estrecha'));
  const CEL: [number, number][] = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.2, r = 112 + (i % 3) * 26;
    return [Math.cos(a) * r, 120 + Math.sin(a) * r * 0.9];
  });
  return (
    <g>
      <Txt x={800} y={80} txt="del inóculo a la úlcera" t={42} p={p('forma')} color={TXV.violeta} />
      <Medallon x={560} y={540} R={380} id="ino" fondo="#F9C9D9">
        <Escamoso x0={-380} x1={380} y={-250} filas={3} />
        <ellipse cx={0} cy={-222} rx={12 + 190 * ero} ry={8 + 38 * ero} fill="#F9C9D9" />
        <ellipse cx={0} cy={-216} rx={8 + 150 * ero} ry={4 + 20 * ero} fill="#FDE9F0" opacity={ero} />
        <path d="M-12,-278 L10,-246 L-10,-216 L8,-186" fill="none" stroke="#7A1F3D" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('microlesion'), 0, 0.5) * (1 - ero)} />
        <Treponema x={0} y={lerp(-330, -150, easeOut(p('entra')))} w={120} amp={10} vueltas={4} grosor={7} r={90} reloj={reloj} o={tramo(p('entra'), 0, 0.3) * (1 - 0.5 * tramo(p('multiplica'), 0, 0.6))} />
        {[[-210, -90], [-150, 20], [150, -80], [215, 10], [-235, 110], [235, 150], [70, -125]].map(([x, y], i) => (
          <Treponema key={i} x={x} y={y} w={62} amp={6} vueltas={3} grosor={5} r={hash(i, 3) * 180} reloj={reloj + i * 220} o={easeOut(tramo(p('multiplica'), i * 0.08, i * 0.08 + 0.4))} />
        ))}
        {/* una arteria pequeña, en corte */}
        <g opacity={tramo(p('vasos'), 0, 0.5)}>
          <circle cy={120} r={80} fill="#8A1030" /><circle cy={120} r={64} fill="#B5183F" />
          <circle cy={120} r={64} fill="#FF9AA0" /><circle cy={120} r={luz} fill="#E5324C" />
          <circle cx={-12} cy={108} r={Math.max(2, luz * 0.3)} fill="#FF7A7F" opacity={0.8} />
          <circle cy={120} r={66} fill="none" stroke="#FFD23F" strokeWidth={9} opacity={easeOut(p('endotelio'))} />
        </g>
        {CEL.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${easeOut(tramo(i < 5 ? p('linfocitos') : i < 10 ? p('plasmaticas') : p('histiositos'), (i % 5) * 0.1, (i % 5) * 0.1 + 0.5))})`}>
            {i < 5 ? <Linfocito k={0.36} /> : i < 10 ? <Plasmatica k={0.36} r={hash(i, 2) * 360} /> : <Epitelioide k={0.42} />}
          </g>
        ))}
      </Medallon>
      <Txt x={1270} y={190} txt="entra por una microlesión" t={26} p={p('microlesion')} />
      <Txt x={1270} y={240} txt="se replica en la dermis" t={26} p={p('dermis')} />
      <Txt x={1270} y={282} txt="alrededor de los vasos" t={22} p={p('vasos')} />
      <Txt x={1270} y={346} txt="activa el endotelio" t={28} p={p('endotelio')} color={TXV.sangre} />
      <g opacity={tramo(p('linfocitos'), 0, 0.5)}><Sale p={p('linfocitos')} x={1090} y={420}><Linfocito k={0.34} /></Sale></g>
      <Txt x={1130} y={420} txt="linfocitos" t={24} ancla="start" p={p('linfocitos')} />
      <Sale p={p('plasmaticas')} x={1090} y={470}><Plasmatica k={0.34} /></Sale>
      <Txt x={1130} y={470} txt="células plasmáticas" t={24} ancla="start" p={p('plasmaticas')} />
      <Sale p={p('histiositos')} x={1090} y={520}><Epitelioide k={0.4} /></Sale>
      <Txt x={1130} y={520} txt="histiocitos" t={24} ancla="start" p={p('histiositos')} />
      <Txt x={1270} y={600} txt="la luz de las arterias se estrecha" t={26} p={p('estrecha')} />
      <Txt x={1270} y={648} txt="endarteritis" t={34} p={p('endarteritis')} color={TXV.violeta} />
      <Txt x={1270} y={700} txt="menos flujo" t={28} p={p('flujo')} color={TXV.sangre} />
      <Txt x={1270} y={748} txt="hipoxia y daño" t={30} p={p('hipoxia')} color={TXV.sangre} />
      <Txt x={1270} y={810} txt="el epitelio se necrosa" t={26} p={p('necrosa')} />
      <Bandera x={1270} y={900} txt="queda un fondo ulcerado" color={P.sangre[0]} p={p('fondo')} t={30} punta="no" />
    </g>
  );
};

// ─── 2 · Cada rasgo del chancro ──────────────────────────────────────────────
const CadaRasgo: Lamina = ({ p, reloj }) => {
  const dura = easeOut(p('dura'));
  const DOMO: [number, number][] = [[1100, 300], [1240, 292], [1380, 300], [1130, 388], [1250, 402], [1360, 388]];
  return (
    <g>
      <Txt x={800} y={78} txt="cada rasgo del chancro" t={42} p={p('caracteristica')} color={TXV.violeta} />
      {/* la lesión, sobre un parche de piel */}
      <Parche x={380} y={560} rx={290} ry={265} o={tramo(p('lesion'), 0, 0.4)} />
      <Ulcera x={380} y={560} k={1.15} dura={dura} o={tramo(p('lesion'), 0, 0.4)} />
      <circle cx={380} cy={560} r={178} fill="none" stroke="#FFF" strokeWidth={6} strokeDasharray="14 14" strokeDashoffset={-reloj / 80} strokeLinecap="round" opacity={0.85 * tramo(p('redonda'), 0, 0.5)} />
      <Bandera x={380} y={212} txt="una sola úlcera" color={P.esp[0]} p={p('unica')} t={28} punta="abajo" />
      <g opacity={tramo(p('regla'), 0, 0.5)}>
        <rect x={250} y={738} width={260} height={30} rx={7} fill="#FFE9A8" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <path key={i} d={`M${250 + i * 32.5},738 L${250 + i * 32.5},${i % 2 ? 750 : 760}`} stroke="#B07A00" strokeWidth={4} strokeLinecap="round" />)}
      </g>
      <Txt x={380} y={802} txt="1 a 2 cm" t={28} p={p('regla')} color="#5A2A00" />
      <Trazo pts={[[700, 470], [526, 512]]} p={easeOut(p('bordes'))} color="#7A5AC8" w={5} />
      <Bandera x={700} y={470} txt="bordes nítidos" color={P.cd4[0]} p={p('bordes')} t={26} punta="izq" ancla="izq" />
      <Trazo pts={[[700, 565], [440, 575]]} p={easeOut(p('fondo'))} color="#7A5AC8" w={5} />
      <Bandera x={700} y={565} txt="fondo limpio" color={P.menta[0]} p={p('fondo')} t={26} punta="izq" ancla="izq" />
      <Trazo pts={[[700, 660], [490, 615]]} p={easeOut(p('base'))} color="#7A5AC8" w={5} />
      <Bandera x={700} y={660} txt="base dura" color={P.sangre[0]} p={p('base')} t={26} punta="izq" ancla="izq" />
      <Txt x={380} y={905} txt="úlcera genital que no duele" t={28} p={p('genital')} color={TXV.sangre} />
      <Txt x={380} y={952} txt="pensar en sífilis" t={36} p={p('pensar')} color={TXV.esp} />
      {/* la base dura: células inflamatorias y endotelio que prolifera */}
      <g opacity={tramo(p('base'), 0, 0.5)}>
        <ellipse cx={1240} cy={236} rx={232} ry={36} fill="#B5183F" />
        <ellipse cx={1240} cy={240} rx={200} ry={24} fill="#F9C9D2" />
        <path d="M1010,238 A230,190 0 0 0 1470,238 Z" fill={P.piel[2]} />
        <path d="M1032,246 A208,166 0 0 0 1448,246 Z" fill="#F7C9D8" />
        {DOMO.map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${easeOut(tramo(p('celulas'), i * 0.08, i * 0.08 + 0.4))})`}>{i % 2 ? <Plasmatica k={0.28} r={hash(i, 2) * 360} /> : <Linfocito k={0.28} />}</g>
        ))}
        {[1190, 1310].map((x) => (
          <g key={x}>
            <circle cx={x} cy={338} r={34} fill="#8A1030" /><circle cx={x} cy={338} r={20} fill="#E5324C" />
            <circle cx={x} cy={338} r={27} fill="none" stroke="#FFD23F" strokeWidth={11 * easeOut(p('prolifera'))} />
          </g>
        ))}
      </g>
      <Txt x={1240} y={482} txt="llena de células inflamatorias" t={24} p={p('celulas')} />
      <Txt x={1240} y={520} txt="y de endotelio que prolifera" t={24} p={p('prolifera')} color={TXV.ambar} />
      {/* no duele: no produce toxinas que destruyan las células */}
      <Sale p={p('duele')} x={1040} y={640}><Signo mas={false} k={1.2} /></Sale>
      <Txt x={1100} y={640} txt="no duele" t={40} ancla="start" p={p('duele')} color={TXV.verde} />
      <Sale p={p('atreponema')} x={1110} y={745}><Treponema w={170} amp={11} vueltas={5} grosor={8} reloj={reloj} /></Sale>
      <Txt x={1110} y={855} txt="T. pallidum" t={22} p={p('atreponema')} />
      <Sale p={p('toxinas')} x={1370} y={735}><Gota x={0} y={0} k={0.5} /></Sale>
      <Cruz x={1370} y={742} k={1.1} p={p('destruyan')} />
      <Txt x={1370} y={855} txt="no produce toxinas citolíticas" t={22} p={p('toxinas')} />
      <Txt x={1240} y={895} txt="la inflamación inicial es moderada" t={24} p={p('moderada')} />
      <Txt x={1240} y={935} txt="un infiltrado inmunitario, no necrótico" t={24} p={p('infiltrado')} color={TXV.violeta} />
    </g>
  );
};

// ─── 3 · Muy contagioso, pero se cura solo ───────────────────────────────────
const Contagioso: Lamina = ({ p, reloj }) => {
  const sana = easeOut(p('desaparece'));
  const CUERPO: [number, number][] = [[0, -250], [-70, -150], [75, -140], [-120, -40], [125, -30], [-30, 80], [40, 90], [-50, 230], [45, 235]];
  return (
    <g>
      <Txt x={800} y={72} txt="es contagiosa…" t={38} p={p('contagiosa')} color={TXV.sangre} />
      <Txt x={800} y={130} txt="muchísimo" t={54} p={p('muchisimo')} color={TXV.sangre} />
      {/* el chancro y su exudado */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2, q = easeOut(tramo(p('muchisimo'), (i / 14) * 0.5, (i / 14) * 0.5 + 0.5));
        return <path key={i} d={`M${330 + Math.cos(a) * 170},${400 + Math.sin(a) * 140} L${330 + Math.cos(a) * (170 + 36 * q)},${400 + Math.sin(a) * (140 + 32 * q)}`} stroke="#FF8A1E" strokeWidth={10} strokeLinecap="round" opacity={q} />;
      })}
      <Ulcera x={330} y={400} k={1} o={tramo(p('contagiosa'), 0, 0.4)} />
      <Flecha a={[330, 540]} b={[330, 610]} p={p('exudado')} color="#E0A800" w={9} />
      {[[210, 690], [330, 730], [450, 690]].map(([x, y], i) => (
        <Gota key={i} x={x} y={y + Math.sin(reloj / 700 + i * 2) * 7} k={0.85} o={tramo(p('exudado'), i * 0.15, i * 0.15 + 0.5)}>
          {[0, 1].map((j) => <Treponema key={j} x={0} y={14 + j * 24} w={56} amp={5} vueltas={3} grosor={5} r={j ? 6 : -6} reloj={reloj + (i * 2 + j) * 250} o={easeOut(tramo(p('lleno'), (i * 2 + j) * 0.1, (i * 2 + j) * 0.1 + 0.4))} />)}
        </Gota>
      ))}
      <Txt x={330} y={830} txt="el exudado del chancro" t={26} p={p('exudado')} />
      <Txt x={330} y={872} txt="lleno de espiroquetas" t={26} p={p('lleno')} color={TXV.esp} />
      {/* los condilomas lata y las placas mucosas */}
      <g opacity={tramo(p('condilomas'), 0, 0.4)}>
        <ellipse cx={838} cy={353} rx={150} ry={92} fill={P.sombra} />
        <ellipse cx={830} cy={345} rx={150} ry={92} fill={P.piel2[0]} /><ellipse cx={826} cy={340} rx={140} ry={84} fill={P.piel2[1]} />
        {[[-70, -8, 62, 34], [10, -30, 70, 38], [72, 10, 58, 32], [-6, 26, 64, 32]].map(([x, y, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={830 + x} cy={345 + y + 6} rx={rx} ry={ry} fill="#B08878" /><ellipse cx={830 + x} cy={345 + y} rx={rx} ry={ry} fill="#D9B8A8" />
            <ellipse cx={830 + x - 10} cy={345 + y - 8} rx={rx * 0.5} ry={ry * 0.3} fill="#FFF" opacity={0.45} />
          </g>
        ))}
      </g>
      <Txt x={830} y={468} txt="condilomas lata" t={28} p={p('condilomas')} />
      <g opacity={tramo(p('placas'), 0, 0.4)}>
        <path d="M690,650 Q760,580 830,610 Q900,580 970,650 Q900,730 830,740 Q760,730 690,650 Z" fill="#C0284A" />
        <path d="M706,652 Q765,598 830,622 Q895,598 954,652 Q895,714 830,722 Q765,714 706,652 Z" fill="#E5324C" />
        <path d="M706,652 Q830,678 954,652" fill="none" stroke="#7A1030" strokeWidth={7} strokeLinecap="round" />
        {[[765, 632, 44, 20], [884, 640, 50, 22], [830, 697, 56, 18]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#F4EBDD" />)}
      </g>
      <Txt x={830} y={782} txt="placas mucosas" t={28} p={p('placas')} />
      <Bandera x={830} y={890} txt="las lesiones más infectantes" color={P.sangre[0]} p={p('infectantes')} t={28} punta="no" />
      {/* se resuelve sola, sin cicatriz… */}
      <Parche x={1330} y={300} rx={190} ry={135} />
      <Ulcera x={1330} y={300} k={0.8 - 0.62 * sana} o={1 - sana} />
      <Txt x={1330} y={470} txt="desaparece en semanas" t={26} p={p('desaparece')} />
      <Txt x={1330} y={512} txt="sin cicatriz ni marca" t={26} p={p('cicatriz')} color={TXV.verde} />
      <Visto x={1470} y={230} k={1.1} p={p('cicatriz')} />
      {/* …pero la infección no se ha curado: las espiroquetas ya viajaron */}
      <Txt x={1330} y={590} txt="pero no significa que se curó" t={26} p={p('significa')} color={TXV.sangre} />
      <Cuerpo x={1330} y={770} k={0.36}>
        {CUERPO.map(([x, y], i) => <Treponema key={i} x={x} y={y} w={90} amp={9} vueltas={3} grosor={9} r={hash(i, 3) * 180} reloj={reloj + i * 180} o={easeOut(tramo(p('espiroquetas2'), i * 0.07, i * 0.07 + 0.4))} />)}
      </Cuerpo>
      <Cruz x={1140} y={720} k={1.5} p={p('curado')} />
      <Txt x={1330} y={942} txt="las espiroquetas ya viajaron" t={26} p={p('viajaron')} color={TXV.esp} />
    </g>
  );
};

// ─── 4 · Confirmarlo en la lesión ────────────────────────────────────────────
const Confirmar: Lamina = ({ p, reloj }) => {
  const FLUO = ['#1B9E3C', '#4CF06A', '#E6FFE9'] as const;
  const CAMPO = ['#1F8FB0', '#6FE0F0', '#EFFFFF'] as const;
  const GRUMOS: [number, number, number][] = [[-30, -20, 8], [-12, 12, 6], [18, -26, 9], [30, 8, 7], [-2, -4, 10], [-34, 30, 6], [26, 34, 8], [8, 28, 5], [-20, -40, 6], [38, -12, 6], [-42, 4, 5], [14, 4, 6]];
  return (
    <g>
      <Txt x={800} y={66} txt="confirmarlo en la lesión" t={42} p={p('confirma')} color={TXV.violeta} />
      <Sale p={p('serologia')} x={90} y={148}><Reloj k={0.42} ang={lerp(0, 330, p('tardar'))} /></Sale>
      <Txt x={150} y={148} txt="la serología puede tardar en positivizarse" t={22} ancla="start" p={p('serologia')} color={TXV.ambar} />
      {/* campo oscuro: espiroquetas vivas que giran */}
      <Bandera x={470} y={238} txt="microscopía de campo oscuro" color={P.copa[0]} p={p('campo')} t={26} punta="abajo" />
      <Medallon x={470} y={560} R={250} id="oscuro" fondo="#0A0630" o={tramo(p('campo'), 0, 0.4)}>
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(hash(i, 1) - 0.5) * 460} cy={(hash(i, 2) - 0.5) * 460} r={6 + hash(i, 3) * 16} fill="#2A1A7A" opacity={0.5} />)}
        {[[-90, -80, 20], [80, -110, 160], [-40, 60, 100], [110, 40, 60], [-130, 110, 140], [30, -10, 30]].map(([x, y, r], i) => (
          <Treponema key={i} x={x} y={y} w={170} amp={13} vueltas={5} grosor={9} r={r + Math.sin(reloj / 1000 + i) * 18} reloj={reloj + i * 260} tono={CAMPO} o={easeOut(tramo(p('vivas'), i * 0.08, i * 0.08 + 0.4))} />
        ))}
        <path d="M-150,-60 A92,92 0 1 1 -66,-150" fill="none" stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" opacity={tramo(p('giran'), 0, 0.4)} />
        <path d="M-52,-160 L-80,-138 L-62,-176 Z" fill="#FFD23F" opacity={tramo(p('giran'), 0, 0.4)} />
      </Medallon>
      <Sale p={p('gota')} x={100} y={420}><Gota x={0} y={0} k={0.5} /></Sale>
      <Flecha a={[130, 470]} b={[230, 520]} p={p('gota')} color="#E0A800" w={8} />
      <Txt x={100} y={520} txt="una gota" t={20} p={p('gota')} />
      <Txt x={470} y={872} txt="espiroquetas vivas" t={28} p={p('vivas')} color={TXV.esp} />
      <Txt x={470} y={915} txt="que giran" t={28} p={p('giran')} />
      {/* otras pruebas sobre la lesión */}
      <Medallon x={1010} y={290} R={105} id="fluo" fondo="#0A1A3A" o={tramo(p('inmuno'), 0, 0.4)}>
        {[[-26, -30, 30], [30, 6, 150], [-16, 38, 100]].map(([x, y, r], i) => <Treponema key={i} x={x} y={y} w={110} amp={9} vueltas={4} grosor={7} r={r} reloj={reloj + i * 300} tono={FLUO} />)}
      </Medallon>
      <Txt x={1010} y={432} txt="inmunofluorescencia directa" t={22} p={p('inmuno')} />
      <Helice x={1340} y={290} w={240} amp={34} vueltas={2.5} grosor={11} p={easeOut(p('moleculares'))} />
      <Txt x={1340} y={432} txt="pruebas moleculares" t={22} p={p('moleculares')} />
      {/* nuestro paciente: la serología ya es positiva */}
      <Bandera x={1190} y={520} txt="nuestro paciente" color={P.esp[0]} p={p('paciente')} t={28} punta="no" />
      <Sale p={p('serologia2')} x={950} y={700}><TuboEnsayo k={0.42} color="#B5183F" nivel={0.7} reloj={reloj} /></Sale>
      <Txt x={950} y={800} txt="serología" t={24} p={p('serologia2')} />
      <Sale p={p('rpr')} x={1180} y={690}>
        <circle cx={5} cy={7} r={78} fill={P.sombra} /><circle r={78} fill="#E4DAF8" /><circle r={64} fill="#FFF" />
        {GRUMOS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5A22A8" opacity={0.85} />)}
      </Sale>
      <Signo x={1250} y={625} k={0.85} p={p('rpr')} />
      <Txt x={1180} y={800} txt="RPR reactivo" t={24} p={p('rpr')} />
      <Txt x={1180} y={842} txt="título 1:32" t={30} p={p('titulo')} color={TXV.ambar} />
      <Sale p={p('tpp')} x={1400} y={690}>
        <rect x={-92} y={-38} width={192} height={84} rx={22} fill={P.sombra} />
        <rect x={-96} y={-42} width={192} height={84} rx={22} fill="#E4DAF8" />
        {[-58, 0, 58].map((x, i) => <g key={x}><circle cx={x} cy={0} r={24} fill="#FFF" />{i < 2 ? <circle cx={x} cy={0} r={19} fill="#C9A0F0" /> : <circle cx={x} cy={0} r={6} fill="#5A22A8" />}</g>)}
      </Sale>
      <Signo x={1470} y={625} k={0.85} p={p('tpp')} />
      <Txt x={1400} y={800} txt="TP-PA reactiva" t={24} p={p('tpp')} />
      <Txt x={1190} y={908} txt="juntas confirman que" t={26} p={p('juntas')} />
      <Txt x={1190} y={952} txt="el RPR no es un falso positivo" t={30} p={p('falso')} color={TXV.verde} />
    </g>
  );
};

// ─── 5 · Otras úlceras genitales ─────────────────────────────────────────────
const OtrasUlceras: Lamina = ({ p }) => {
  const VES: [number, number][] = [[-70, -60], [-10, -76], [55, -56], [-96, -6], [-32, -12], [34, -2], [96, -8], [-56, 54], [14, 58], [74, 50]];
  const BLOB = 'M-110,-10 C-100,-70 -50,-90 -20,-70 C10,-100 70,-85 90,-40 C130,-30 130,30 95,52 C100,90 40,100 10,80 C-20,105 -80,95 -90,55 C-130,40 -130,10 -110,-10 Z';
  return (
    <g>
      <Txt x={800} y={68} txt="úlceras genitales" t={44} p={p('ulceras')} color={TXV.violeta} />
      <Txt x={800} y={118} txt="¿cómo se distinguen?" t={28} p={p('distinguen')} />
      {/* herpes */}
      <Bandera x={300} y={200} txt="herpes" color={P.hla[0]} p={p('herpes')} t={32} punta="abajo" />
      <Parche x={300} y={420} rx={210} ry={165} o={tramo(p('herpes'), 0, 0.4)} />
      <ellipse cx={300} cy={424} rx={150} ry={104} fill="#E5324C" opacity={0.3 * tramo(p('vesiculas'), 0, 0.4)} />
      {VES.map(([x, y], i) => {
        const q = easeOut(tramo(p('vesiculas'), i * 0.07, i * 0.07 + 0.4));
        return (
          <g key={i} transform={`translate(${300 + x},${424 + y}) scale(${q})`}>
            <circle r={21} fill="#E04A6E" /><circle r={16} fill="#FFE3EA" /><circle cx={-5} cy={-6} r={5} fill="#FFF" />
          </g>
        );
      })}
      <Txt x={300} y={640} txt="vesículas agrupadas" t={24} p={p('vesiculas')} />
      <Dolor x={236} y={702} p={p('dolorosas')} />
      <Txt x={284} y={702} txt="dolorosas" t={26} ancla="start" p={p('dolorosas')} color={TXV.sangre} />
      {/* chancroide */}
      <Bandera x={800} y={200} txt="chancroide" color={P.espiga[0]} p={p('chancroide')} t={32} punta="abajo" />
      <Parche x={800} y={420} rx={210} ry={165} o={tramo(p('chancroide'), 0, 0.4)} />
      <g transform="translate(800,424)" opacity={tramo(p('blanda'), 0, 0.5)}>
        <path d={BLOB} fill="#B5183F" /><path d={BLOB} fill="#E8C48A" transform="scale(0.78)" />
        <path d="M-60,-20 Q-20,-44 30,-34" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.5} />
      </g>
      <Txt x={800} y={640} txt="úlcera blanda" t={24} p={p('blanda')} />
      <Dolor x={736} y={702} p={p('dolorosa2')} />
      <Txt x={784} y={702} txt="dolorosa" t={26} ancla="start" p={p('dolorosa2')} color={TXV.sangre} />
      <Txt x={800} y={760} txt="bordes irregulares" t={24} p={p('irregulares')} />
      {/* chancro sifilítico */}
      <Bandera x={1300} y={200} txt="chancro sifilítico" color={P.esp[0]} p={p('sifilitico')} t={32} punta="abajo" />
      <Parche x={1300} y={420} rx={210} ry={165} o={tramo(p('sifilitico'), 0, 0.4)} />
      <Ulcera x={1300} y={424} k={0.95} dura={easeOut(p('duro'))} o={tramo(p('unico'), 0, 0.4)} />
      <Txt x={1300} y={640} txt="único" t={26} p={p('unico')} />
      <Txt x={1300} y={680} txt="duro" t={26} p={p('duro')} color={TXV.ambar} />
      <Txt x={1300} y={720} txt="limpio" t={26} p={p('limpio')} color={TXV.esp} />
      <Sale p={p('duele')} x={1230} y={790}><Signo mas={false} k={0.8} /></Sale>
      <Txt x={1275} y={790} txt="no duele" t={30} ancla="start" p={p('duele')} color={TXV.verde} />
      {/* la clínica no basta */}
      <Txt x={800} y={860} txt="la clínica no basta" t={36} p={p('clinica')} color={TXV.sangre} />
      <Sale p={p('pruebas')} x={560} y={930}><TuboEnsayo k={0.24} color="#B5183F" nivel={0.7} /></Sale>
      <Txt x={620} y={930} txt="ante una úlcera genital:" t={22} ancla="start" p={p('pruebas')} />
      <Bandera x={1100} y={930} txt="pruebas para sífilis" color={P.esp[0]} p={p('sifilis')} t={24} punta="no" />
      <Bandera x={1340} y={930} txt="y para VIH" color={P.arn[0]} p={p('vih')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Paciente2, InoculoUlcera, CadaRasgo, Contagioso, Confirmar, OtrasUlceras];
export default LAMINAS;
