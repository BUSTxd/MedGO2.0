'use client';
// Capítulo 5 · La señal entra: MyD88, NF-κB e inflamasoma

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, CelulaCorte, Cerrojo, Chispa, Fibrina, Flecha, FT, Fosfato, Il1, Il6, Inflamasoma, Letra, Lps, NO, Nfkb, Proteasoma, S, Sale, Selectina, Tijera, Tlr4, Tnf, Ubi, easeOut, lerp, tramo } from '../Piezas';

/** La célula (monocito) en corte: los hijos van en coordenadas del lienzo, no de la célula. */
const Celda = ({ reloj, hincha = 0, o = 1, children }: { reloj: number; hincha?: number; o?: number; children?: ReactNode }) => (
  <CelulaCorte x={800} y={610} w={1480} h={760} nucleoY={200} nucleoR={170} reloj={reloj} k={1 + 0.05 * hincha} o={o}>
    <g transform="translate(-800,-610)">{children}</g>
  </CelulaCorte>
);

/** Una proteína de la cascada: esfera con su nombre. */
const Prot = ({ x, y, R = 40, txt, tono, p = 1, t = 24 }: { x: number; y: number; R?: number; txt: string; tono: readonly string[]; p?: number; t?: number }) => (
  <Sale p={p} x={x} y={y}>
    <circle r={R} fill={tono[0]} /><circle cx={-R * 0.07} cy={-R * 0.07} r={R * 0.9} fill={tono[1]} /><circle cx={-R * 0.4} cy={-R * 0.42} r={R * 0.14} fill="#FFF" opacity={0.7} />
    <Letra x={0} y={t * 0.36} txt={txt} t={t} />
  </Sale>
);

const ROJO = S.il1, AZUL = S.linfo, VIOLETA = S.il6, LIMON = S.nfkb;

// ─── 0 · Del receptor al adaptador ───────────────────────────────────────────
const Adaptador: Lamina = ({ p, reloj }) => {
  const im = easeOut(p('iman'));
  return (
    <g>
      <Celda reloj={reloj}>
        <Sale p={p('tlr4')} x={800} y={236}><Tlr4 activo={p('cola')} reloj={reloj} /></Sale>
        <g opacity={tramo(p('lps'), 0, 0.4)} transform="translate(860,116) rotate(35)"><Lps cadena={0.3} k={0.45} reloj={reloj} /></g>
        {[[520, 330, 'a'], [1080, 360, 'b'], [600, 470, 'c'], [1010, 480, 'd']].map(([x, y], i) => (
          <circle key={i} cx={lerp(Number(x), 800 + (i % 2 ? 40 : -40), im)} cy={lerp(Number(y), 372 + (i > 1 ? 30 : 0), im)} r={22} fill={[ROJO, AZUL, VIOLETA, LIMON][i][1]} opacity={tramo(p('adaptadores'), 0, 0.3) * 0.95} />
        ))}
        <Flecha a={[800, 400]} b={[800, 620]} p={tramo(p('nucleo'), 0, 0.9)} color={S.lps[1]} w={9} />
      </Celda>
      <Bandera x={1070} y={180} txt="TLR4 reconoció al LPS" color={S.lps[0]} p={p('tlr4')} t={26} punta="no" />
      <Bandera x={420} y={440} txt="dominio TIR (la cola)" color={S.lps[0]} p={p('tir')} t={26} punta="no" />
      <Bandera x={1250} y={440} txt="un imán que recluta adaptadores" color={S.il6[0]} p={p('adaptadores')} t={26} punta="no" />
      <Bandera x={1080} y={700} txt="la orden debe llegar al núcleo" color={S.il6[0]} p={p('nucleo')} t={26} punta="no" />
      <Bandera x={800} y={95} txt="así empieza el relevo" color={S.il6[0]} p={p('relevo')} t={34} punta="no" />
    </g>
  );
};

// ─── 1 · MyD88 ───────────────────────────────────────────────────────────────
const MyD88: Lamina = ({ p, reloj }) => (
  <g>
    <Celda reloj={reloj}>
      <Tlr4 x={800} y={236} activo={1} reloj={reloj} />
      <Prot x={800} y={382} R={58} txt="MyD88" tono={VIOLETA} p={p('myd88')} t={22} />
      <Prot x={690} y={470} R={36} txt="IRAK4" tono={ROJO} p={p('irak')} t={16} />
      <Prot x={910} y={470} R={36} txt="IRAK1" tono={AZUL} p={p('irak2')} t={16} />
      <Sale p={p('il1')} x={1260} y={240}><Tlr4 md2={0} cola={false} reloj={reloj} /></Sale>
      <Sale p={p('il1')} x={1260} y={90} k={1.6}><Il1 /></Sale>
      <path d="M1260,262 C1260,340 1040,360 860,380" fill="none" stroke={S.il1[1]} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 14" opacity={tramo(p('il1'), 0.3, 1)} />
    </Celda>
    <Bandera x={800} y={95} txt="el primer adaptador: MyD88" color={S.il6[0]} p={p('adaptador')} t={34} punta="no" />
    <Bandera x={380} y={400} txt="común a casi todos los TLR (menos el TLR3)" color={S.il6[0]} p={p('todos')} t={24} punta="no" />
    <Bandera x={1330} y={330} txt="y al receptor de la IL-1" color={S.il1[0]} p={p('il1')} t={24} punta="no" />
    <Bandera x={380} y={520} txt="recluta dos cinasas: IRAK4 e IRAK1" color={S.il1[0]} p={p('cinasas')} t={24} punta="no" />
    <Bandera x={1250} y={560} txt="una autopista común" color={S.il6[0]} p={p('autopista')} t={30} punta="no" />
  </g>
);

// ─── 2 · La cadena de relevos ────────────────────────────────────────────────
const Relevos: Lamina = ({ p, reloj }) => {
  const nodos: [number, number, string, readonly string[], string][] = [
    [800, 340, 'IRAK', ROJO, 'irak'], [800, 440, 'TRAF6', AZUL, 'traf6'], [800, 540, 'TAK1', VIOLETA, 'tak1'], [1010, 540, 'IKK', LIMON, 'ikk'],
  ];
  const chispa = ((reloj / 1100) % 1);
  return (
    <g>
      <Celda reloj={reloj}>
        <Tlr4 x={800} y={236} activo={1} reloj={reloj} />
        {nodos.map(([x, y, txt, tono, clave]) => <Prot key={clave} x={x} y={y} R={44} txt={txt} tono={tono} p={p(clave)} t={txt.length > 4 ? 18 : 22} />)}
        <Flecha a={[800, 386]} b={[800, 396]} p={tramo(p('traf6'), 0, 1)} color={S.lps[1]} w={8} />
        <Flecha a={[800, 486]} b={[800, 496]} p={tramo(p('tak1'), 0, 1)} color={S.lps[1]} w={8} />
        <Flecha a={[848, 540]} b={[962, 540]} p={tramo(p('ikk'), 0, 1)} color={S.lps[1]} w={8} />
        <circle cx={800} cy={lerp(300, 560, chispa)} r={10} fill={S.lps[2]} opacity={tramo(p('mecha'), 0, 0.4) * 0.9} />
      </Celda>
      <Bandera x={800} y={95} txt="una cadena de relevos hasta el núcleo" color={S.il6[0]} p={p('reveles')} t={34} punta="no" />
      <Bandera x={1180} y={400} txt="cada eslabón enciende al siguiente" color={S.lps[0]} p={p('mecha')} t={26} punta="no" />
      <Bandera x={420} y={440} txt="como una chispa por una mecha" color={S.lps[0]} p={p('mecha')} t={26} punta="no" />
      <Bandera x={420} y={910} txt="tres traspasos y ya estamos en las puertas del núcleo" color={S.il6[0]} p={p('tres')} t={28} punta="no" />
    </g>
  );
};

// ─── 3 · El candado IκB ──────────────────────────────────────────────────────
const Candado: Lamina = ({ p, reloj }) => {
  const libre = easeOut(p('libre'));
  const lx = lerp(650, 800, libre), ly = lerp(450, 560, libre);
  const trag = easeOut(p('proteasoma'));
  return (
    <g>
      <Celda reloj={reloj}>
        <Sale p={p('nfkb')} x={lx - 90} y={ly} k={3}><Nfkb /></Sale>
        <g opacity={1 - easeOut(p('destruye'))}>
          <Sale p={p('candado')} x={lerp(lx, 1090, trag * 0.0 + 0)} y={ly} k={1.15}><Cerrojo /></Sale>
        </g>
        <Sale p={p('ikk')} x={980} y={360} k={1}><g><ellipse rx={64} ry={38} fill={LIMON[0]} /><ellipse cx={-3} cy={-3} rx={58} ry={33} fill={LIMON[1]} /><Letra x={0} y={9} txt="IKK" t={26} color="#3A4A00" /></g></Sale>
        {[0, 1].map((i) => <Fosfato key={i} x={lerp(930, 740 + i * 36, easeOut(p('fosfatos')))} y={lerp(380, 420 + i * 30, easeOut(p('fosfatos')))} o={tramo(p('fosfatos'), 0, 0.3)} />)}
        <Sale p={p('ub')} x={lx + 60} y={ly - 70}><Ubi r={-20} k={1.3} /></Sale>
        <Sale p={p('proteasoma')} x={1150} y={ly + 90} k={1.2}><Proteasoma traga={trag} /></Sale>
        <Flecha a={[lx + 100, ly - 20]} b={[1070, ly + 70]} p={tramo(p('proteasoma'), 0.3, 1)} color={S.il6[1]} w={7} />
      </Celda>
      <Bandera x={800} y={95} txt="¿qué espera NF-κB? Está preso" color={S.nfkb[0]} p={p('preso')} t={32} punta="no" />
      <Bandera x={420} y={250} txt="IκB: su candado" color={S.il6[0]} p={p('ikb')} t={28} punta="no" />
      <Bandera x={1080} y={250} txt="el IKK le pone fosfatos" color={S.nfkb[0]} p={p('fosfatos')} t={26} punta="no" />
      <Bandera x={420} y={700} txt="la ubiquitina lo marca" color={S.il6[0]} p={p('ub')} t={26} punta="no" />
      <Bandera x={1250} y={720} txt="el proteasoma lo destruye" color={S.c5a[0]} p={p('destruye')} t={26} punta="no" />
      <Bandera x={800} y={940} txt="el candado desaparece: NF-κB queda libre" color={S.nfkb[0]} p={p('libre')} t={30} punta="no" />
    </g>
  );
};

// ─── 4 · NF-κB en el núcleo ──────────────────────────────────────────────────
const NucleoGenes: Lamina = ({ p, reloj }) => {
  const entra = easeOut(p('poro'));
  const grupos: { x: number; txt: string; color: string; clave: string; iconos: ReactNode }[] = [
    { x: 250, txt: 'inflamación', color: S.tnf[0], clave: 'tnf', iconos: <g><Tnf x={-40} y={-30} k={1.4} /><Il1 x={40} y={-30} k={1.4} /><Il6 x={-40} y={40} k={1.5} /><Chispa x={40} y={40} tono={S.c5a} reloj={reloj} /></g> },
    { x: 620, txt: 'adhesión', color: S.gluco[0], clave: 'adhesion', iconos: <g><Selectina x={-30} y={20} k={2.2} /><Selectina x={30} y={20} k={2.2} /></g> },
    { x: 980, txt: 'vasodilatación', color: S.no[0], clave: 'inos', iconos: <NO k={2.2} /> },
    { x: 1340, txt: 'coagulación', color: S.fibrina[0], clave: 'tisular', iconos: <g><FT k={1.8} /><Fibrina x={0} y={60} w={110} /></g> },
  ];
  return (
    <g>
      <Celda reloj={reloj}>
        <Prot x={800} y={lerp(560, 760, entra)} R={46} txt="NF-κB" tono={LIMON} p={p('poro')} t={20} />
        <path d="M600,830 C660,790 720,870 780,830 C840,790 900,870 960,830" fill="none" stroke={S.il6[1]} strokeWidth={10} strokeLinecap="round" opacity={tramo(p('adn'), 0, 0.4)} />
        <path d="M600,830 C660,870 720,790 780,830 C840,870 900,790 960,830" fill="none" stroke={S.c5a[1]} strokeWidth={10} strokeLinecap="round" opacity={tramo(p('adn'), 0, 0.4)} />
        {grupos.map((g) => <Flecha key={g.clave} a={[800, 700]} b={[g.x, 480]} c={[g.x, 700]} p={tramo(p(g.clave), 0, 0.8)} color={g.color} w={6} />)}
      </Celda>
      {grupos.map((g) => (
        <g key={g.clave}>
          <Sale p={p(g.clave)} x={g.x} y={330}>{g.iconos}</Sale>
          <Bandera x={g.x} y={440} txt={g.txt} color={g.color} p={p(g.clave)} t={26} punta="no" />
        </g>
      ))}
      <Bandera x={800} y={95} txt="NF-κB cruza el poro nuclear y enciende genes" color={S.nfkb[0]} p={p('genes')} t={32} punta="no" />
      <Bandera x={800} y={965} txt="un solo factor de transcripción enciende los cuatro frentes" color={S.il6[0]} p={p('cuatro')} t={30} punta="no" />
    </g>
  );
};

// ─── 5 · La otra puerta: TRIF ────────────────────────────────────────────────
const Trif: Lamina = ({ p, reloj }) => (
  <g>
    <Celda reloj={reloj}>
      <Tlr4 x={420} y={290} activo={0.6} reloj={reloj} />
      <Prot x={420} y={440} R={46} txt="MyD88" tono={VIOLETA} p={p('solo')} t={18} />
      <Flecha a={[470, 450]} b={[620, 380]} p={tramo(p('solo'), 0.2, 1)} color={S.il1[1]} w={7} />
      <Sale p={p('endosoma')} x={1040} y={450}>
        <circle r={150} fill={S.membrana[0]} opacity={0.5} /><circle r={138} fill={S.cito[2]} opacity={0.55} />
        <g transform="translate(0,-10)"><Tlr4 cola={false} md2={1} reloj={reloj} k={0.8} y={30} /></g>
      </Sale>
      <Prot x={1040} y={555} R={44} txt="TRIF" tono={S.c5a} p={p('trif')} t={20} />
      <Flecha a={[1040, 600]} b={[900, 720]} c={[1040, 690]} p={tramo(p('interferones'), 0, 0.8)} color={S.c5a[1]} w={8} />
      {[0, 1, 2].map((i) => <Chispa key={i} x={840 + i * 70} y={760 + (i % 2) * 40} tono={S.c5a} n={6} reloj={reloj} fase={i} o={tramo(p('interferones'), 0.3, 0.8)} />)}
    </Celda>
    <Bandera x={800} y={95} txt="¿TLR4 solo habla con MyD88?  No: hay una segunda vía" color={S.il6[0]} p={p('segunda')} t={30} punta="no" />
    <Bandera x={260} y={560} txt="vía de MyD88" color={S.il6[0]} p={p('solo')} t={24} punta="no" />
    <Bandera x={1040} y={290} txt="dentro de un endosoma: TRIF" color={S.c5a[0]} p={p('endosoma')} t={26} punta="no" />
    <Bandera x={680} y={470} txt="TNF-α" color={S.tnf[0]} p={p('tnf')} t={26} punta="no" />
    <Bandera x={1040} y={760} txt="interferones tipo I" color={S.c5a[0]} p={p('interferones')} t={26} punta="no" />
    <Bandera x={420} y={940} txt="una puerta inflamatoria" color={S.il1[0]} p={p('inflamatoria')} t={28} punta="no" />
    <Bandera x={1180} y={940} txt="y otra antiviral" color={S.c5a[0]} p={p('antiviral')} t={28} punta="no" />
  </g>
);

// ─── 6 · Falta una segunda señal ─────────────────────────────────────────────
const SegundaSenal: Lamina = ({ p, reloj }) => {
  const senales: [string, string, ReactNode, string][] = [
    ['atp', 'ATP extracelular', <Prot key="a" x={0} y={0} R={36} txt="ATP" tono={S.lps} t={20} />, 'atp'],
    ['potasio', 'salida de potasio', <Prot key="b" x={0} y={0} R={36} txt="K⁺" tono={S.no} t={22} />, 'potasio'],
    ['toxinas', 'toxinas', <Prot key="c" x={0} y={0} R={36} txt="☠" tono={S.verde} t={26} />, 'toxinas'],
    ['cristales', 'cristales', <g key="d"><polygon points="0,-40 30,0 0,40 -30,0" fill={S.c5a[1]} /><polygon points="0,-40 -30,0 0,6" fill={S.c5a[2]} opacity={0.8} /></g>, 'cristales'],
  ];
  return (
    <g>
      <Celda reloj={reloj}>
        <Sale p={p('pro')} x={520} y={440} k={2}><g opacity={0.55 + 0.45 * easeOut(p('segunda'))}><Il1 /></g></Sale>
        <circle cx={520} cy={440} r={110} fill="none" stroke={S.gris[1]} strokeWidth={6} strokeDasharray="4 12" opacity={tramo(p('precursor'), 0, 0.4)} />
        {senales.map(([, , icono, clave], i) => <Sale key={clave} p={p(clave)} x={880 + (i % 2) * 280} y={380 + Math.floor(i / 2) * 150}>{icono}</Sale>)}
      </Celda>
      <Bandera x={800} y={95} txt="la pro-IL-1β se fabricó… y no hace nada" color={S.il1[0]} p={p('nada')} t={32} punta="no" />
      <Bandera x={520} y={620} txt="precursor inactivo, guardado en el citoplasma" color={S.gris[0]} p={p('precursor')} t={24} punta="no" />
      <Bandera x={1040} y={260} txt="necesita una segunda señal" color={S.lps[0]} p={p('segunda')} t={28} punta="no" />
      {senales.map(([, txt, , clave], i) => <Bandera key={clave} x={880 + (i % 2) * 280} y={475 + Math.floor(i / 2) * 150} txt={txt} color={S.lps[0]} p={p(clave)} t={20} punta="no" />)}
      <Bandera x={800} y={900} txt="dos señales, como dos llaves en una caja fuerte" color={S.il6[0]} p={p('llaves')} t={30} punta="no" />
      <Bandera x={800} y={965} txt="así no se dispara el arma por un simple roce" color={S.il6[0]} p={p('roce')} t={26} punta="no" />
    </g>
  );
};

// ─── 7 · El inflamasoma ──────────────────────────────────────────────────────
const InflamasomaL: Lamina = ({ p, reloj }) => {
  const corta = easeOut(p('corta'));
  return (
    <g>
      <Celda reloj={reloj}>
        <Sale p={p('inflamasoma')} x={800} y={430} k={1}><Inflamasoma monta={p('nlrp3')} activo={p('caspasa')} reloj={reloj} /></Sale>
        <Sale p={p('corta')} x={440} y={470} k={1.6}><Il1 /></Sale>
        <Sale p={p('corta')} x={440} y={640} k={1.6}><g opacity={1}><Il6 /></g></Sale>
        <g opacity={tramo(p('caspasa'), 0, 0.4)}>
          <Tijera x={600} y={470} k={1.4} corta={corta} color={S.lps[0]} />
          <Tijera x={600} y={640} k={1.4} corta={corta} color={S.lps[0]} />
        </g>
        <Sale p={p('maduras')} x={1180} y={470} k={2}><Il1 /></Sale>
        <Sale p={p('maduras')} x={1180} y={640} k={2}><Chispa tono={S.il1} n={5} reloj={reloj} /></Sale>
      </Celda>
      <Bandera x={800} y={95} txt="el inflamasoma: NLRP3 + ASC + procaspasa-1" color={S.menin[0]} p={p('quien')} t={32} punta="no" />
      <Bandera x={800} y={690} txt="una rueda enorme" color={S.menin[0]} p={p('rueda')} t={26} punta="no" />
      <Bandera x={440} y={380} txt="pro-IL-1β" color={S.il1[0]} p={p('corta')} t={24} punta="no" />
      <Bandera x={440} y={730} txt="pro-IL-18" color={S.il6[0]} p={p('il18')} t={24} punta="no" />
      <Bandera x={1180} y={380} txt="la caspasa-1 corta" color={S.lps[0]} p={p('caspasa')} t={26} punta="no" />
      <Bandera x={1240} y={800} txt="IL-1β e IL-18 maduras, listas para salir" color={S.il1[0]} p={p('maduras')} t={26} punta="no" />
    </g>
  );
};

// ─── 8 · Piroptosis ──────────────────────────────────────────────────────────
const Piroptosis: Lamina = ({ p, reloj }) => {
  const est = easeOut(p('estalla'));
  return (
    <g>
      <Celda reloj={reloj} hincha={tramo(p('globo'), 0, 1)} o={1 - 0.62 * est}>
        {[330, 560, 800, 1040, 1270].map((x, i) => (
          <Sale key={i} p={tramo(p('perforan'), i * 0.12, i * 0.12 + 0.5)} x={x} y={238}><ellipse rx={32} ry={14} fill={S.nucleo[0]} /><ellipse cx={0} cy={-2} rx={22} ry={8} fill={S.nucleo[1]} /></Sale>
        ))}
        {Array.from({ length: 5 }, (_, i) => {
          const u = ((reloj / 1800 + i / 5) % 1);
          return <g key={i} transform={`translate(${330 + i * 235},${lerp(210, 80, u)})`} opacity={tramo(p('salen'), 0, 0.4) * (1 - u)}><Il1 k={1.2} /></g>;
        })}
        <Sale p={p('gasdermina')} x={800} y={420} k={1.7}><Tijera color={S.menin[0]} corta={0.6} /></Sale>
      </Celda>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2, d = 200 * tramo(est, 0, 1);
        return <g key={i} opacity={tramo(p('damps'), 0, 0.3) * est}><Chispa x={800 + Math.cos(a) * (240 + d)} y={610 + Math.sin(a) * (200 + d * 0.6)} tono={S.il1} n={4 + (i % 3)} reloj={reloj} fase={i} /></g>;
      })}
      <Bandera x={800} y={95} txt="la caspasa-1 corta la gasdermina D" color={S.menin[0]} p={p('gasdermina')} t={32} punta="no" />
      <Bandera x={380} y={400} txt="sus fragmentos perforan la membrana" color={S.menin[0]} p={p('perforan')} t={24} punta="no" />
      <Bandera x={1240} y={400} txt="por los agujeros salen las interleucinas" color={S.il1[0]} p={p('salen')} t={24} punta="no" />
      <Bandera x={800} y={740} txt="piroptosis" color={S.il1[0]} p={p('piroptosis')} t={40} punta="no" />
      <Bandera x={420} y={900} txt="suelta DAMP y esos DAMP vuelven a activar receptores" color={S.il1[0]} p={p('damps')} t={26} punta="no" />
      <Bandera x={1200} y={940} txt="el fuego se alimenta a sí mismo" color={S.il6[0]} p={p('fuego')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Adaptador, MyD88, Relevos, Candado, NucleoGenes, Trif, SegundaSenal, InflamasomaL, Piroptosis];
export default LAMINAS;
