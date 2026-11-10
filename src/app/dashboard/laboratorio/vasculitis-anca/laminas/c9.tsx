'use client';
// Capítulo 9 · Nariz, pulmón y riñón: el síndrome pulmón-riñón y el cierre de los dos casos.

import { useId } from 'react';
import type { Lamina } from '../Lienzo';
import { TuboOrina, Virus } from '../../citopenias-autoinmunes/Piezas';
import { Barra, Lente, Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Alveolos, Anca, Bandera, Cuerpo, Llamada, Mpo, Perfil, Pista, Pr3, FotoLente, Bola, Eosinofilo, En, Flecha, FLECHA, Glomerulo, Granuloma, Hematie, IgG, Macrofago, Neutrofilo, Paciente, Pulmones, Rinon, Sale, Tarjeta, Txt, V, blob, clamp, easeOut, hash, lerp, tramo, Portaobjetos, FotoCuadro } from '../Piezas';

/** Cara con el eritema en alas de mariposa (lupus). */
function Lupus() {
  return (
    <g>
      <circle r={34} fill="#E9A58A" />
      <path d="M0,4 C-8,-8 -30,-10 -31,2 C-32,13 -16,18 -2,12 Z M0,4 C8,-8 30,-10 31,2 C32,13 16,18 2,12 Z" fill="#E0338A" opacity={0.8} />
      <circle cx={-11} cy={-8} r={3} fill="#3A1342" /><circle cx={11} cy={-8} r={3} fill="#3A1342" />
    </g>
  );
}

const PulmonRinon: Lamina = ({ p }) => {
  const causas: [string, string, string][] = [['gpa', 'Granulomatosis con poliangeítis', V.turquesa[1]], ['pam', 'Poliangeítis microscópica', '#E0338A'], ['mbg', 'Anti membrana basal', '#3B9EDD'], ['lupus', 'Lupus', '#9A6BF2']];
  return (
    <g>
      <Sale p={p('sangra')} x={330} y={330} k={0.8}><Pulmones sangre={p('sangra')} /></Sale>
      <Sale p={p('pierde')} x={330} y={720} k={0.8}><Rinon x={-110} /><g transform="translate(110,0) scale(-1,1)"><Rinon /></g></Sale>
      <Bandera x={800} y={90} txt="Síndrome pulmón-riñón: una urgencia" color={V.sangre[0]} p={p('urgencia')} t={30} punta="no" />
      {causas.map(([n, txt, c], i) => (
        <g key={n}>
          <Sale p={p(n)} x={830} y={260 + i * 105} k={1}>{i === 0 ? <Perfil quien="el" hundida={0.7} costras={1} k={0.2} y={8} /> : i === 1 ? <g><Anca y={-4} k={1.6} /><Mpo y={-18} k={1.1} /></g> : i === 2 ? <g><circle r={40} fill="#0E1F14" /><Glomerulo brillo="lineal" k={0.14} /></g> : <Lupus />}</Sale>
          <Txt x={900} y={260 + i * 105} txt={txt.toLowerCase().replace('anti membrana basal', 'enfermedad anti membrana basal')} t={24} color={c} p={p(n)} ancla="start" />
        </g>
      ))}
      <Txt x={1050} y={190} txt="sus causas principales" t={24} p={p('causas')} />
      <Sale p={p('capilares')} x={900} y={820} k={0.38}><Alveolos /></Sale>
      <Txt x={1060} y={820} txt="=" t={60} p={p('capilares')} />
      <Sale p={p('capilares')} x={1230} y={820} k={0.42}><Glomerulo /></Sale>
      <Txt x={1060} y={950} txt="redes de capilares con una membrana basal finísima" t={24} p={p('capilares')} />

    </g>
  );
};

/** Vista de rinoscopia: túnel de mucosa. `tipo` gpa (roja, ulcerada, costras) o polipos. */
function Rinoscopia({ tipo, ulcera = 0, costras = 0, polipo = 0, eos = 0 }: { tipo: 'gpa' | 'polipos'; ulcera?: number; costras?: number; polipo?: number; eos?: number }) {
  const g = tipo === 'gpa';
  return (
    <g>
      <rect x={-320} y={-320} width={640} height={640} fill={g ? '#8E1A3A' : '#E39AB4'} />
      <circle r={240} fill={g ? '#B0284E' : '#EFB3C7'} />
      <circle r={150} fill={g ? '#C8385E' : '#F6CBD8'} />
      <circle r={60} fill="#3A0A1E" />
      {g && Array.from({ length: 6 }, (_, i) => <path key={i} d={blob(8, 34, 0.35, i + 2)} transform={`translate(${Math.cos(i) * 180},${Math.sin(i) * 180})`} fill="#F2E0C8" opacity={tramo(ulcera, i / 8, i / 8 + 0.3)} />)}
      {g && Array.from({ length: 9 }, (_, i) => <path key={i} d={blob(8, 26, 0.4, i + 7)} transform={`translate(${Math.cos(i * 0.8 + 1) * (110 + (i % 3) * 50)},${Math.sin(i * 0.8 + 1) * (110 + (i % 3) * 50)})`} fill="#3A1A10" opacity={tramo(costras, i / 12, i / 12 + 0.3)} />)}
      {!g && <path d={blob(11, 120, 0.18, 4, 1.2)} transform={`translate(40,40) scale(${(0.2 + 0.8 * easeOut(polipo)).toFixed(2)})`} fill="#F1EFC2" />}
      {!g && <path d={blob(11, 90, 0.18, 4, 1.2)} transform={`translate(20,20) scale(${(0.2 + 0.8 * easeOut(polipo)).toFixed(2)})`} fill="#FBFAE0" />}
      {!g && Array.from({ length: 8 }, (_, i) => <Eosinofilo key={i} x={Math.cos(i) * 200} y={Math.sin(i) * 200} k={0.3} o={tramo(eos, i / 10, i / 10 + 0.3)} />)}
    </g>
  );
}

const NarizEl: Lamina = ({ p }) => {
  return (
    <g>
      <Txt x={800} y={70} txt="empecemos más arriba: la nariz del primer paciente" t={28} p={p('nariz')} />
      <Lente x={430} y={500} R={330} id="c9-rino1" o={tramo(p('rinoscopia'), 0, 0.4)}>
        <Rinoscopia tipo="gpa" ulcera={p('ulcera')} costras={p('costras')} />
      </Lente>
      <Txt x={430} y={880} txt="rinoscopia: roja, friable, ulcerada" t={24} p={p('roja')} />
      <Sale p={p('anca')} x={1000} y={260} k={0.9}><Neutrofilo cebado={1} activo={0.6} /><Anca x={70} y={-40} r={-40} /></Sale>
      <Granuloma x={1300} y={260} k={0.32} p={p('granulomas')} necrosis={1} />
      <Txt x={1150} y={380} txt="neutrófilos activados y granulomas invasores" t={22} p={p('granulomas')} />
      <Txt x={1150} y={470} txt="la mucosa se queda sin sangre y se ulcera" t={22} p={p('ulcera')} />
      <Llamada x={1000} y={570} a={[760, 480]} txt="costras: moco, sangre y tejido necrótico" p={p('moco')} t={22} />
      <Sale p={p('perfora')} x={1150} y={780} k={0.9}>
        <rect x={-200} y={-80} width={400} height={160} rx={30} fill={V.piel[1]} />
        <rect x={-30} y={-80} width={60} height={160} fill="#F2E4C4" />
        <ellipse cx={0} cy={0} rx={30 * tramo(p('perfora'), 0.3, 1)} ry={40 * tramo(p('perfora'), 0.3, 1)} fill="#3A0A1E" />
      </Sale>
      <Txt x={1150} y={900} txt="sin irrigación, el tabique se perfora" t={22} p={p('perfora')} />
    </g>
  );
};

const NarizElla: Lamina = ({ p }) => {
  return (
    <g>
      <Txt x={800} y={70} txt="la nariz de la segunda paciente: pólipos" t={28} p={p('polipos')} />
      <Lente x={430} y={500} R={330} id="c9-rino2" o={tramo(p('polipos'), 0, 0.4)}>
        <Rinoscopia tipo="polipos" polipo={clamp(p('edema') * 0.5 + p('masa') * 0.5)} eos={p('eos')} />
      </Lente>
      <Txt x={1150} y={200} txt="manda la respuesta tipo 2" t={28} color={V.eos[1]} p={p('tipo2')} />
      <Txt x={1150} y={280} txt="IL-5 y eotaxinas traen eosinófilos" t={24} p={p('il5')} />
      <Txt x={1150} y={330} txt="dañan el epitelio y abren los vasos" t={22} p={p('eos')} fuerte={false} />
      <Txt x={1150} y={430} txt="edema y fibroblastos que proliferan" t={24} p={p('fibroblastos')} />
      <Llamada x={960} y={520} a={[430, 600]} txt="una masa blanda que tapa la nariz" p={p('masa')} t={24} />
      {[0, 1, 2, 3].map((i) => <Bola key={i} x={lerp(1400, 1180, easeOut(tramo(p('olfato'), i * 0.1, 0.8)))} y={700 + (i % 2) * 40} R={12} tono={V.moco} o={tramo(p('olfato'), i * 0.1, 0.3)} />)}
      <rect x={1140} y={650} width={20} height={130} rx={10} fill="#F1EFC2" opacity={tramo(p('olfato'), 0, 0.3)} />
      <Txt x={1150} y={840} txt="los olores no llegan a la mucosa olfatoria" t={22} p={p('olfato')} />
    </g>
  );
};

const Capilaritis: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('pulmon')} x={520} y={440} k={1.2}><Alveolos sangre={p('llenos')} /></Sale>
      {[0, 1, 2, 3, 4].map((i) => <Neutrofilo key={i} x={520 + [-120, 60, 190, -10, -170][i] * 1.2} y={440 + [-110, -110, 40, 130, 90][i] * 1.2} k={0.42} cebado={1} activo={p('rompe')} o={tramo(p('capilaritis'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Llamada x={1100} y={200} a={[724, 266]} txt="capilaritis" p={p('capilaritis')} t={30} />
      <Txt x={1200} y={280} txt="la barrera alveolocapilar se rompe" t={24} p={p('rompe')} />
      <Txt x={1200} y={380} txt="hemorragia alveolar difusa" t={28} color={V.sangre[1]} p={p('hemorragia')} />
      <FotoCuadro x={215} y={860} w={270} h={180} foto="pulmon-goodpasture" o={p('pulmon')} />
      <Txt x={385} y={850} txt="pieza real:" t={18} p={p('pulmon')} fuerte={false} ancla="start" />
      <Txt x={385} y={878} txt="hemorragia difusa en ambos pulmones (Goodpasture)" t={18} p={p('pulmon')} ancla="start" />
      <Txt x={1200} y={480} txt="hemoptisis… pero no siempre" t={24} p={p('hemoptisis')} />
      <Barra x={1000} y={620} w={400} val={1 - 0.45 * p('hb')} color={V.sangre[1]} txt="hemoglobina" p={p('hb')} />
      <Sale p={p('vidrio')} x={1200} y={820} k={0.8}>
        <rect x={-160} y={-80} width={320} height={160} rx={20} fill="#1C1C26" />
        <ellipse cx={-60} cy={0} rx={60} ry={50} fill="#9FA4B8" opacity={0.5} /><ellipse cx={60} cy={10} rx={70} ry={52} fill="#9FA4B8" opacity={0.45} />
      </Sale>
      <Txt x={1200} y={940} txt="opacidades en vidrio esmerilado" t={22} p={p('vidrio')} />
    </g>
  );
};

const Fisiologia: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('flujo')} x={420} y={460} k={1.4}>
        <circle r={150} fill={V.pulmon[0]} /><circle r={130} fill="#FFE6F2" />
        {Array.from({ length: 14 }, (_, i) => <Hematie key={i} x={(hash(i, 3) - 0.5) * 180} y={(hash(i, 4) - 0.5) * 180} k={0.38} r={i * 30} />)}
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + reloj / 2000; return <circle key={i} cx={Math.cos(a) * 140} cy={Math.sin(a) * 140} r={9} fill="#7A1F6E" />; })}
      </Sale>
      <Txt x={420} y={150} txt="sigue recibiendo flujo…" t={26} p={p('flujo')} />
      {[0, 1, 2].map((i) => <Bola key={i} x={lerp(160, 260, Math.abs(Math.sin(reloj / 500 + i)))} y={300 + i * 50} R={14} tono={['#3F86FF', '#7DB2FF', '#CFE0FF']} o={tramo(p('aire'), 0, 0.4)} />)}
      <Txt x={420} y={780} txt="…pero ya no recibe aire" t={26} p={p('aire')} />
      <Txt x={420} y={870} txt="hipoxemia y disnea" t={30} color="#2F6FD8" p={p('hipoxemia')} />
      <Txt x={1150} y={220} txt="un dato curioso:" t={26} p={p('curioso')} />
      <Txt x={1150} y={300} txt="la DLCO aumenta ↑" t={30} color={V.verde[0]} p={p('dlco')} />
      <Txt x={1150} y={370} txt="la hemoglobina derramada capta el CO" t={22} p={p('dlco')} fuerte={false} />
      <Sale p={p('dias')} x={1060} y={600} k={0.4}><Macrofago /></Sale>
      <FotoLente x={1360} y={590} R={140} foto="hemosiderofagos" o={p('flujo')} credito="arriba" />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1020 + (i % 3) * 30} cy={590 + Math.floor(i / 3) * 30} r={10} fill="#8A6A3E" opacity={tramo(p('hemosiderina'), i * 0.1, 0.5 + i * 0.1)} />)}
      <Llamada x={900} y={790} a={[1360 + (355 - 360) * 0.389, 590 + (435 - 360) * 0.389]} txt="en 2 o 3 días, macrófagos con hemosiderina" p={p('hemosiderina')} t={22} halo />
      <Portaobjetos x={1360} y={890} k={0.7} o={tramo(p('flujo'), 0.3, 1)} organo="PULMÓN" tincion="H-E" caso="hemorragia" />
    </g>
  );
};

/** Rótulo dentro de la placa: texto blanco con borde oscuro y línea fina hasta lo que señala (la placa es oscura en los dos temas). */
function RotuloRx({ x, y, a, txt, p, t = 19 }: { x: number; y: number; a: [number, number]; txt: string; p: number; t?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p * 1.4));
  const ancho = txt.length * t * 0.55;
  // Si lo señalado cae bajo el texto, la línea baja desde él; si no, sale por el lado más cercano.
  const debajo = a[0] > x && a[0] < x + ancho && a[1] > y;
  const x0 = debajo ? a[0] : a[0] > x + ancho / 2 ? x + ancho + 8 : x - 8;
  const y0 = debajo ? y + 6 : y - t * 0.3;
  return (
    <g opacity={q}>
      <path d={`M${x0},${y0} L${lerp(x0, a[0], q)},${lerp(y0, a[1], q)}`} stroke="#000000" strokeWidth={5} opacity={0.5} fill="none" strokeLinecap="round" />
      <path d={`M${x0},${y0} L${lerp(x0, a[0], q)},${lerp(y0, a[1], q)}`} stroke="#FFFFFF" strokeWidth={2} strokeDasharray="5 4" fill="none" />
      <circle cx={a[0]} cy={a[1]} r={5 * q} fill="#FFD23F" />
      <text x={x} y={y} style={{ fontSize: t, fontWeight: 700 }} fill="#FFFFFF" stroke="#0B0B12" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">{txt}</text>
    </g>
  );
}

/** Radiografía de tórax PA: partes blandas, costillas posteriores y anteriores, clavículas, escápulas, húmeros, columna,
 *  tráquea y bronquios, silueta cardíaca, hilios con sus vasos, diafragmas y burbuja gástrica. Lo denso es claro y el aire,
 *  oscuro. El lado izquierdo del paciente queda a la derecha de la imagen (marcador «D» arriba a la izquierda). */
function RxTorax({ nodulo = 0, clav = 0, hilios = 0, cav = 0 }: { nodulo?: number; clav?: number; hilios?: number; cav?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const W = 300, H = 380;
  const pulmonD = 'M-30,-290 C-80,-335 -180,-310 -228,-215 C-272,-120 -288,60 -285,225 L-276,238 C-240,212 -190,172 -120,163 C-80,159 -45,164 -30,170 Z';
  const pulmonI = 'M30,-290 C80,-335 180,-310 228,-215 C272,-120 288,70 285,250 L276,262 C240,234 190,198 130,190 C90,186 50,193 30,198 Z';
  const cuerpo = 'M-72,-380 L-64,-332 C-120,-322 -248,-322 -300,-282 L-300,380 L300,380 L300,-282 C248,-322 120,-322 64,-332 L72,-380 Z';
  const abdomen = 'M-300,380 L-300,242 L-284,236 C-250,210 -190,170 -120,161 C-60,157 0,180 30,196 C90,184 190,196 284,258 L300,264 L300,380 Z';
  const corazon = 'M-46,-330 L-48,-172 C-56,-122 -60,-82 -64,-42 C-96,0 -102,92 -80,160 C-30,192 60,214 150,210 C206,205 218,170 202,120 C186,60 142,10 96,-30 C108,-70 106,-110 88,-140 C112,-165 110,-206 72,-216 C60,-262 52,-300 48,-330 Z';
  // Vasos pulmonares: salen del hilio en abanico y se afinan hacia la periferia.
  const vasos = (sx: number) => Array.from({ length: 10 }, (_, j) => {
    const a = ((-72 + j * 15 + (hash(j, sx + 3) - 0.5) * 8) * Math.PI) / 180;
    const L = 150 + hash(j, sx + 9) * 80;
    const x0 = sx * 72, y0 = -22;
    const x1 = x0 + sx * Math.cos(a) * L * 0.5, y1 = y0 + Math.sin(a) * L * 0.5;
    const x2 = x0 + sx * Math.cos(a + 0.1) * L, y2 = y0 + Math.sin(a + 0.1) * L;
    const x3 = x1 + sx * Math.cos(a - 0.45) * L * 0.42, y3 = y1 + Math.sin(a - 0.45) * L * 0.42;
    return (
      <g key={j}>
        <path d={`M${x0},${y0} Q${(x0 + x1) / 2 + sx * 6},${(y0 + y1) / 2 - 6} ${x1},${y1}`} strokeWidth={6} />
        <path d={`M${x1},${y1} L${x2},${y2}`} strokeWidth={3} />
        <path d={`M${x1},${y1} L${x3},${y3}`} strokeWidth={2.2} />
      </g>
    );
  });
  const ncx = 168, ncy = -222; // nódulo infraclavicular izquierdo
  return (
    <g>
      <defs>
        <clipPath id={`pel-${id}`}><rect x={-W} y={-H} width={W * 2} height={H * 2} rx={22} /></clipPath>
        <clipPath id={`cue-${id}`}><path d={cuerpo} /></clipPath>
        <clipPath id={`pul-${id}`}><path d={pulmonD} /><path d={pulmonI} /></clipPath>
        <clipPath id={`nod-${id}`}><circle cx={ncx} cy={ncy} r={19} /></clipPath>
        {[-1, 1].map((sx) => (
          <radialGradient key={sx} id={`pg${sx > 0 ? 'i' : 'd'}-${id}`} gradientUnits="userSpaceOnUse" cx={sx * 80} cy={-20} r={300}>
            <stop offset="0" stopColor="#3C3C4C" /><stop offset="0.45" stopColor="#22222E" /><stop offset="1" stopColor="#14141C" />
          </radialGradient>
        ))}
        <radialGradient id={`co-${id}`} gradientUnits="userSpaceOnUse" cx={50} cy={80} r={220}>
          <stop offset="0" stopColor="#D6D6E2" /><stop offset="1" stopColor="#A2A2B4" />
        </radialGradient>
        <linearGradient id={`ab-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4B4C4" /><stop offset="1" stopColor="#77778A" />
        </linearGradient>
        <radialGradient id={`no-${id}`}>
          <stop offset="0" stopColor="#F2F2F8" /><stop offset="0.62" stopColor="#D4D4E0" /><stop offset="1" stopColor="#D4D4E0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`hi-${id}`}>
          <stop offset="0" stopColor="#E0E0EA" stopOpacity="0.95" /><stop offset="1" stopColor="#C8C8D6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#pel-${id})`}>
        <rect x={-W} y={-H} width={W * 2} height={H * 2} fill="#0A0A10" />
        {/* partes blandas: cuello, hombros y pared; cabezas de los húmeros en las esquinas */}
        <path d={cuerpo} fill="#3A3A47" />
        {[-1, 1].map((sx) => <circle key={`h${sx}`} cx={sx * 312} cy={-318} r={62} fill="#8E8EA0" opacity={0.75} />)}
        {[-1, 1].map((sx) => <circle key={`m${sx}`} cx={sx * 312} cy={-318} r={44} fill="#A2A2B4" opacity={0.5} />)}
        <path d={abdomen} fill={`url(#ab-${id})`} />
        <path d={pulmonD} fill={`url(#pgd-${id})`} />
        <path d={pulmonI} fill={`url(#pgi-${id})`} />
        {/* vasos: tramas que salen de los hilios */}
        <g clipPath={`url(#pul-${id})`} stroke="#70708A" fill="none" strokeLinecap="round" opacity={0.55}>{vasos(-1)}{vasos(1)}</g>
        {/* escápulas: el borde medial se proyecta sobre el pulmón */}
        {[-1, 1].map((sx) => <path key={sx} d={`M${sx * 238},-300 C${sx * 214},-210 ${sx * 212},-130 ${sx * 246},-48`} fill="none" stroke="#9090A4" strokeWidth={5} opacity={0.35} />)}
        {/* columna: cuerpos vertebrales y pedículos */}
        {Array.from({ length: 19 }, (_, i) => (
          <g key={i} opacity={0.32}>
            <rect x={-24} y={-372 + i * 40} width={48} height={32} rx={7} fill="#A8A8BA" />
            <ellipse cx={-17} cy={-356 + i * 40} rx={5} ry={8} fill="#D0D0DC" /><ellipse cx={17} cy={-356 + i * 40} rx={5} ry={8} fill="#D0D0DC" />
          </g>
        ))}
        {/* costillas: posteriores (horizontales, claras) y anteriores (bajan hacia el esternón, tenues) */}
        <g clipPath={`url(#cue-${id})`} fill="none" strokeLinecap="round">
          {Array.from({ length: 10 }, (_, i) => [-1, 1].map((sx) => {
            const y0 = -286 + i * 52;
            const d = `M${sx * 26},${y0} C${sx * 110},${y0 - 38} ${sx * 232},${y0 - 30} ${sx * 284},${y0 + 52}`;
            return (
              <g key={`p${i}${sx}`}>
                <path d={d} stroke="#ABABBE" strokeWidth={13} opacity={0.42} />
                <path d={d} stroke="#20202A" strokeWidth={4} opacity={0.3} />
              </g>
            );
          }))}
          {Array.from({ length: 6 }, (_, i) => [-1, 1].map((sx) => {
            const y0 = -250 + i * 56;
            return <path key={`a${i}${sx}`} d={`M${sx * 276},${y0 + 30} C${sx * 222},${y0 + 66} ${sx * 150},${y0 + 108} ${sx * 84},${y0 + 140}`} stroke="#9C9CB0" strokeWidth={9} opacity={0.22} />;
          }))}
        </g>
        {/* mediastino y corazón (botón aórtico arriba a la derecha de la imagen) */}
        <path d={corazon} transform="translate(8,0) scale(0.86,1)" fill={`url(#co-${id})`} opacity={0.9} />
        {/* tráquea y bronquios principales: columna de aire */}
        <rect x={-13} y={-380} width={26} height={250} rx={12} fill="#14141C" opacity={0.72} />
        <path d="M-5,-138 L-62,-72" stroke="#14141C" strokeWidth={17} strokeLinecap="round" opacity={0.65} />
        <path d="M5,-138 L56,-62" stroke="#14141C" strokeWidth={15} strokeLinecap="round" opacity={0.65} />
        {/* burbuja gástrica bajo el hemidiafragma izquierdo */}
        <ellipse cx={168} cy={292} rx={52} ry={26} fill="#16161E" opacity={0.75} />
        {/* clavículas en S, por encima de los vértices */}
        {[-1, 1].map((sx) => {
          const d = `M${sx * 34},-280 C${sx * 88},-300 ${sx * 146},-290 ${sx * 196},-312 S${sx * 258},-352 ${sx * 294},-350`;
          return (
            <g key={sx}>
              <path d={d} fill="none" stroke="#DCDCE8" strokeWidth={21} strokeLinecap="round" opacity={0.9} />
              <path d={d} fill="none" stroke="#B4B4C6" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
            </g>
          );
        })}
        {/* hilios con opacidades perihiliares */}
        {hilios > 0.01 && [[-80, -30, 34, 3], [84, -14, 30, 5], [-128, 52, 16, 7], [206, -58, 14, 9]].map(([x, y, r, s], i) => (
          <path key={i} d={blob(9, r, 0.3, s)} transform={`translate(${x},${y})`} fill={`url(#hi-${id})`} opacity={tramo(hilios, i * 0.12, 0.5 + i * 0.12)} />
        ))}
        {/* nódulo infraclavicular izquierdo; al cavitarse muestra aire arriba y líquido abajo */}
        <circle cx={ncx} cy={ncy} r={36} fill={`url(#no-${id})`} opacity={tramo(nodulo, 0, 0.5)} />
        {cav > 0.01 && (
          <g clipPath={`url(#nod-${id})`} opacity={tramo(cav, 0, 0.6)}>
            <circle cx={ncx} cy={ncy} r={19} fill="#1E1E28" />
            <rect x={ncx - 20} y={ncy + lerp(19, 5, cav)} width={40} height={30} fill="#C9C9D6" />
          </g>
        )}
        <text x={-236} y={-346} style={{ fontSize: 24, fontWeight: 800 }} fill="#F2F2F8" opacity={0.85}>D</text>
        <text x={-206} y={-347} style={{ fontSize: 15, fontWeight: 700 }} fill="#F2F2F8" opacity={0.6}>PA</text>
      </g>
      <RotuloRx x={60} y={-352} a={[150, -300]} txt="clavícula izquierda" p={clav} />
      <RotuloRx x={70} y={-140} a={[ncx - 10, ncy + 22]} txt="nódulo" p={clav} />
      <RotuloRx x={-282} y={-128} a={[-86, -38]} txt="opacidades hiliares" p={hilios} />
    </g>
  );
}

/** Corte de pulmón con un granuloma necrotizante: el centro se licúa, drena por un bronquio y deja una cavidad con nivel. */
function Cavidad({ li = 0, cav = 0, reloj = 0 }: { li?: number; cav?: number; reloj?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const nivel = lerp(-62, 30, easeOut(cav));
  return (
    <g>
      <defs><clipPath id={`cv-${id}`}><circle r={66} /></clipPath></defs>
      <path d={blob(14, 165, 0.08, 21)} fill={V.pulmon[1]} />
      {Array.from({ length: 34 }, (_, i) => {
        const a = hash(i, 31) * Math.PI * 2, d = 105 + hash(i, 32) * 50;
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={9 + hash(i, 33) * 7} fill="#FFE6F2" />;
      })}
      {/* bronquio que sale de la pared hacia arriba a la derecha */}
      <path d="M48,-46 C90,-90 130,-120 196,-150" stroke="#FFFFFF" strokeWidth={36} fill="none" strokeLinecap="round" />
      <path d="M48,-46 C90,-90 130,-120 196,-150" stroke="#F4B0CA" strokeWidth={22} fill="none" strokeLinecap="round" />
      <circle r={98} fill="#5E4FD6" /><circle r={86} fill="#7D6FF0" />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const cx = Math.cos(a) * 80, cy = Math.sin(a) * 80; return <ellipse key={i} cx={cx} cy={cy} rx={11} ry={5} transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} fill="#B8AEFF" />; })}
      <g clipPath={`url(#cv-${id})`}>
        <circle r={66} fill={li < 0.5 ? '#C8569A' : '#E2B84E'} />
        {cav > 0.01 && <rect x={-70} y={-70} width={140} height={70 + nivel} fill="var(--vas-fondo-a)" opacity={tramo(cav, 0, 0.4)} />}
        {cav > 0.01 && <rect x={-70} y={nivel} width={140} height={4} fill="#FFFFFF" opacity={0.7 * tramo(cav, 0.2, 0.6)} />}
        {li > 0.01 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={(hash(i, 41) - 0.5) * 100} cy={Math.max(nivel + 10, (hash(i, 42) - 0.3) * 100)} r={4} fill="#9A6B1E" opacity={0.6 * li} />)}
      </g>
      {/* la pared se abre al bronquio y el pus sale por él */}
      <path d="M60,-58 L80,-78" stroke="#7D6FF0" strokeWidth={22 * (1 - tramo(cav, 0, 0.5))} strokeLinecap="round" />
      {cav > 0.01 && Array.from({ length: 5 }, (_, i) => {
        const t = (reloj / 1400 + i / 5) % 1;
        return <circle key={i} cx={lerp(56, 190, t)} cy={lerp(-54, -146, t) + Math.sin(t * 3) * 6} r={6} fill="#E2B84E" opacity={tramo(cav, 0, 0.4) * (1 - t * 0.6)} />;
      })}
    </g>
  );
}

/** Corte axial de tomografía con el nódulo cavitado (lóbulo superior izquierdo). */
function TcCorte({ cav = 1 }: { cav?: number }) {
  return (
    <g>
      <rect x={-125} y={-85} width={250} height={170} rx={14} fill="#0A0A10" />
      <ellipse rx={112} ry={70} fill="#3A3A47" />
      {[-1, 1].map((sx) => <path key={sx} d={blob(10, 46, 0.12, sx > 0 ? 5 : 8, 1)} transform={`translate(${sx * 50},-6) scale(1,1.08)`} fill="#17171F" />)}
      <ellipse cx={10} cy={14} rx={28} ry={22} fill="#A2A2B4" />
      <circle cx={0} cy={52} r={13} fill="#D6D6E2" /><rect x={-4} y={58} width={8} height={12} fill="#D6D6E2" />
      <circle cx={58} cy={-24} r={16} fill="none" stroke="#E4E4EE" strokeWidth={6} />
      <circle cx={58} cy={-24} r={11} fill="#0E0E14" />
      <rect x={47} y={-24 + lerp(10, 3, cav)} width={22} height={8} fill="#B8B8C8" opacity={cav} />
      <text x={112} y={-62} textAnchor="end" style={{ fontSize: 13, fontWeight: 700 }} fill="#F2F2F8" opacity={0.6}>TC</text>
    </g>
  );
}

/** Vaso erosionado por un granuloma: la sangre se escapa hacia la vía aérea. */
function VasoErosionado({ p = 1, reloj = 0 }: { p?: number; reloj?: number }) {
  return (
    <g>
      <rect x={-120} y={-14} width={240} height={34} rx={17} fill={V.sangre[0]} />
      <rect x={-120} y={-7} width={240} height={20} rx={10} fill={V.sangre[1]} />
      <path d={blob(11, 46, 0.22, 13)} transform="translate(-6,-40)" fill="#7D6FF0" />
      <path d={blob(9, 22, 0.25, 15)} transform="translate(-6,-40)" fill="#C8569A" />
      {Array.from({ length: 4 }, (_, i) => {
        const t = (reloj / 1600 + i / 4) % 1;
        return <Hematie key={i} x={lerp(-4, 40, t) + i * 4} y={lerp(26, 92, t)} k={0.22} r={i * 50} o={p * (1 - t * 0.7)} />;
      })}
    </g>
  );
}

const Radiografia: Lamina = ({ p, reloj }) => {
  const li = p('licua'), cav = p('cavidad');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿Qué muestra la radiografía y cómo explica la hemoptisis?" color={V.ambar[0]} p={p('pregunta')} t={26} punta="no" />
      <Sale p={p('nodulos')} x={400} y={510} k={1}><RxTorax nodulo={p('nodulos')} clav={p('clavicula')} hilios={p('hilios')} cav={cav} /></Sale>
      <Txt x={400} y={930} txt="nódulo bajo la clavícula izquierda; opacidades hiliares" t={22} p={p('hilios')} />
      <Sale p={p('granulomas')} x={900} y={300} k={0.4}><Granuloma necrosis={1} /></Sale>
      <Txt x={900} y={428} txt="granuloma necrotizante" t={20} p={p('granulomas')} fuerte={false} />
      <Flecha a={[1030, 300]} b={[1110, 300]} p={li} color={FLECHA} w={7} />
      <Sale p={li} x={1330} y={310} k={0.85}><Cavidad li={li} cav={cav} reloj={reloj} /></Sale>
      <Txt x={1500} y={150} txt="bronquio" t={18} p={li} fuerte={false} />
      <Txt x={1290} y={480} txt="el centro se licúa, drena por un bronquio: cavidad" t={22} p={cav} />
      <Txt x={1190} y={565} txt="la sangre llega por dos caminos:" t={26} p={p('caminos')} />
      <Sale p={p('caminos')} x={960} y={670} k={0.85}><VasoErosionado p={p('caminos')} reloj={reloj} /></Sale>
      <Txt x={960} y={790} txt="1 · un granuloma erosiona un vaso" t={22} p={p('caminos')} />
      <Sale p={tramo(p('caminos'), 0.3, 1)} x={1400} y={670} k={0.3}>
        <Alveolos sangre={1} />
        {[[-120, -110], [150, -100], [-20, 150]].map(([x, y], i) => <Neutrofilo key={i} x={x} y={y} k={0.55} cebado={1} activo={0.8} />)}
      </Sale>
      <Txt x={1400} y={790} txt="2 · capilaritis" t={22} p={tramo(p('caminos'), 0.3, 1)} />
      <Sale p={p('tomografia')} x={880} y={890} k={0.62}><TcCorte cav={1} /></Sale>
      <Txt x={980} y={890} txt="la cavitación se confirma con tomografía" t={22} color="#2F6FD8" p={p('tomografia')} ancla="start" />
    </g>
  );
};

const AsmaElla: Lamina = ({ p, reloj }) => {
  const c = p('leucotrienos'), ed = p('edema'), mo = p('moco');
  const luz = lerp(120, 50, clamp(c * 0.5 + ed * 0.3 + mo * 0.2));
  return (
    <g>
      <Txt x={800} y={70} txt="en la segunda paciente, el pulmón es asma" t={28} p={p('asma')} />
      <Sale p={p('asma')} x={400} y={480}>
        <circle r={250} fill="#F2A7C9" /><circle r={250 - 40 - 30 * ed} fill="#E07AA8" />
        <circle r={luz + 30} fill="#C2457E" />
        <circle r={luz} fill="var(--vas-fondo-a)" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={blob(7, 16, 0.3, i)} transform={`translate(${Math.cos(i * 1.1) * luz * 0.5},${Math.sin(i * 1.1) * luz * 0.5})`} fill={V.moco[1]} opacity={mo} />)}
      </Sale>
      <Txt x={400} y={790} txt="leucotrienos · edema · moco (IL-13)" t={22} p={mo} />
      {p('silba') > 0.01 && [0, 1, 2].map((i) => <path key={i} d={`M${700 + i * 30},${440 + Math.sin(reloj / 120 + i) * 12} q20,-20 40,0 t40,0`} fill="none" stroke="#3F86FF" strokeWidth={6} strokeLinecap="round" opacity={tramo(p('silba'), i * 0.2, 0.5 + i * 0.2)} />)}
      <Txt x={400} y={860} txt="al espirar, el aire pasa por vías estrechas y silba" t={22} p={p('silba')} />
      <Txt x={1200} y={200} txt="¿y sus opacidades?" t={28} p={p('opacidades')} />
      <Sale p={p('eos')} x={1200} y={480} k={0.95}><Alveolos eos={p('eos')} /></Sale>
      <Txt x={1200} y={780} txt="neumonía eosinofílica" t={28} color={V.eos[1]} p={p('neumonia')} />
      <Txt x={1200} y={850} txt="aparece y desaparece" t={22} p={p('neumonia')} />
    </g>
  );
};

const ElRinon: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('rinon')} x={380} y={460} k={0.95}><Glomerulo semiluna={0.9} necrosis={1} /></Sale>
      <Txt x={380} y={760} txt="GN necrotizante pauciinmune con semilunas" t={22} p={p('lesion')} />
      <Sale p={p('noduele')} x={860} y={330} k={1.2}><Rinon /></Sale>
      <Txt x={1320} y={250} txt="el riñón no duele" t={32} color={V.rinon[1]} p={p('noduele')} />
      <Txt x={1320} y={330} txt="pierde la mitad del filtrado en silencio" t={22} p={p('silencio')} />
      <Sale p={p('orina')} x={900} y={560} k={0.45}><TuboOrina oscuro={0.6} /></Sale>
      <Txt x={970} y={560} txt="examen de orina desde el primer día" t={26} p={p('orina')} ancla="start" />
      <Visto x={900} y={730} k={0.9} p={p('normal')} />
      <Txt x={960} y={730} txt="segunda paciente: orina y creatinina normales" t={22} p={p('normal')} ancla="start" />
      <Txt x={1100} y={830} txt="en la GEPA, el riñón se afecta menos" t={24} p={p('menos')} />
    </g>
  );
};

/** Capilar con su membrana basal; `fenestrado` deja pasar a la IgG. */
function Capilar({ x, y, fenestrado, igg, dano = 0 }: { x: number; y: number; fenestrado: boolean; igg: number; dano?: number }) {
  return (
    <En x={x} y={y}>
      <rect x={-260} y={-40} width={520} height={34} rx={8} fill="#E7A93A" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-255 + i * 64} y={-4} width={fenestrado || (dano > 0.5 && (i === 3 || i === 4)) ? 46 : 64} height={30} rx={6} fill={V.endo[0]} opacity={dano > 0.5 && (i === 3 || i === 4) ? 0.4 : 1} />
      ))}
      {[0, 1, 2, 3].map((i) => {
        const pasa = fenestrado || dano > 0.5;
        const yy = lerp(140, pasa ? -10 : 40, easeOut(tramo(igg, i * 0.12, 0.8)));
        return <IgG key={i} x={-150 + i * 100} y={yy} r={180} k={1.2} o={tramo(igg, i * 0.12, 0.3)} />;
      })}
      {(fenestrado || dano > 0.5) && <rect x={-260} y={-44} width={520 * tramo(igg, 0.5, 1)} height={8} rx={4} fill={V.verde[1]} />}
    </En>
  );
}

/** Cigarrillo encendido: filtro de corcho moteado con anillo dorado, papel con costura y marca, ceniza agrietada,
 *  brasa que late y humo que sube en volutas hasta el capilar alveolar. */
function Cigarrillo({ reloj = 0, humo = 1 }: { reloj?: number; humo?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const late = 0.75 + 0.25 * Math.sin(reloj / 260) ** 2;
  // Humo: bocanadas suaves que suben ondulando desde la punta, crecen, se aclaran y llegan al capilar (0,-245).
  const bocanadas = [0, 1].flatMap((col) => Array.from({ length: 16 }, (_, i) => {
    const t = (i / 16 + reloj / (3200 + col * 700)) % 1;
    const x = lerp(-160, -10 + col * 40, t) + Math.sin(t * 6 + col * 2 + reloj / 900) * 34 * t;
    const y = lerp(-10, -245, t);
    return { k: `${col}-${i}`, x, y, r: 7 + 26 * t, o: Math.min(1, t * 6) * (1 - t) ** 0.7 * (0.55 - col * 0.15) };
  }));
  return (
    <g>
      <defs>
        <radialGradient id={`brasa-${id}`}>
          <stop offset="0" stopColor="#FFF3B0" /><stop offset="0.35" stopColor="#FFB020" /><stop offset="0.75" stopColor="#F2541B" /><stop offset="1" stopColor="#B3201A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`humo-${id}`}>
          <stop offset="0" stopColor="#C9C6D6" /><stop offset="0.6" stopColor="#B4B0C4" stopOpacity="0.6" /><stop offset="1" stopColor="#B4B0C4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`papel-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.55" stopColor="#F1EEE8" /><stop offset="1" stopColor="#CFCAC0" />
        </linearGradient>
        <linearGradient id={`filtro-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2B871" /><stop offset="0.55" stopColor="#E09A4E" /><stop offset="1" stopColor="#B8743A" />
        </linearGradient>
      </defs>
      {/* humo */}
      {humo > 0.01 && bocanadas.map((b) => <circle key={b.k} cx={b.x} cy={b.y} r={b.r} fill={`url(#humo-${id})`} opacity={humo * b.o} />)}
      <g transform="rotate(-6)">
        {/* sombra */}
        <ellipse cx={0} cy={30} rx={160} ry={8} fill="#000000" opacity={0.12} />
        {/* papel */}
        <rect x={-132} y={-17} width={204} height={34} rx={4} fill={`url(#papel-${id})`} />
        <path d="M-130,-3 L70,-3" stroke="#DAD5CC" strokeWidth={1.5} strokeDasharray="7 5" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-118 + i * 22},-15 L${-118 + i * 22},15`} stroke="#E6E1D8" strokeWidth={1} />)}
        <text x={-20} y={9} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2 }} fill="#C7C1B6">TABACO</text>
        {/* anillo dorado y filtro de corcho moteado */}
        <rect x={68} y={-17} width={8} height={34} fill="#D9A92E" />
        <rect x={76} y={-17} width={78} height={34} rx={6} fill={`url(#filtro-${id})`} />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={82 + hash(i, 51) * 66} cy={-12 + hash(i, 52) * 24} r={1.6 + hash(i, 53) * 1.6} fill="#9A5A24" opacity={0.6} />)}
        <ellipse cx={154} cy={0} rx={5} ry={17} fill="#C98A48" />
        {/* papel quemado, ceniza agrietada y brasa */}
        <rect x={-142} y={-17} width={14} height={34} fill="#5C4A3E" opacity={0.85} />
        <path d="M-142,-16 C-152,-14 -166,-12 -170,-4 C-174,4 -164,14 -142,16 Z" fill="#8A8790" />
        <path d="M-150,-12 L-158,-4 L-152,4 M-162,-6 L-166,6" stroke="#5E5B66" strokeWidth={1.5} fill="none" />
        <circle cx={-146} cy={0} r={22 * late} fill={`url(#brasa-${id})`} />
        {Array.from({ length: 4 }, (_, i) => {
          const t = (reloj / 900 + i / 4) % 1;
          return <circle key={i} cx={-150 - t * 30 + i * 4} cy={-8 - t * 40} r={2.5 * (1 - t)} fill="#FFB020" opacity={(1 - t) * humo} />;
        })}
      </g>
    </g>
  );
}

/** Aerosol (inhalante): bote con válvula y una nube de gotas. */
function Inhalante() {
  return (
    <g>
      <rect x={-22} y={-40} width={44} height={86} rx={10} fill="#3B9EDD" />
      <rect x={-22} y={-14} width={44} height={22} fill="#1F6FB2" />
      <rect x={-12} y={-56} width={24} height={18} rx={4} fill="#C9D3E0" />
      <rect x={-6} y={-64} width={12} height={10} rx={2} fill="#7A8798" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-18 - (i % 3) * 12} cy={-62 - Math.floor(i / 3) * 10 + (i % 2) * 4} r={3} fill="#BFE3FF" opacity={0.8} />)}
    </g>
  );
}

const AntiMbg: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Txt x={800} y={70} txt="¿por qué no siempre sangran los dos órganos?" t={28} p={p('mbg')} />
      <Txt x={400} y={190} txt="glomérulo: endotelio fenestrado" t={26} p={p('fenestrado')} />
      <Capilar x={400} y={420} fenestrado igg={p('llega')} />
      <Txt x={400} y={620} txt="el anticuerpo llega al colágeno IV" t={22} p={p('llega')} />
      <Txt x={1200} y={190} txt="alvéolo: mismo colágeno IV, escondido" t={26} p={p('escondido')} />
      <Capilar x={1200} y={420} fenestrado={false} igg={clamp(p('alveolar') + p('sangra'))} dano={p('tabaco')} />
      <Sale p={p('tabaco')} x={1230} y={700} k={1}><Cigarrillo reloj={reloj} humo={tramo(p('tabaco'), 0.2, 1)} /></Sale>
      <Sale p={tramo(p('tabaco'), 0.3, 1)} x={960} y={700} k={0.42}><Virus /></Sale>
      <Sale p={tramo(p('tabaco'), 0.45, 1)} x={1460} y={710} k={0.9}><Inhalante /></Sale>
      <Txt x={1200} y={790} txt="tabaco, infección o un inhalante lo lesionan" t={22} p={p('tabaco')} />
      <Txt x={1200} y={880} txt="entonces, el pulmón también sangra" t={28} color={V.sangre[1]} p={p('sangra')} />
    </g>
  );
};

const Cierre: Lamina = ({ p }) => {
  const el: string[] = ['anti-PR3', 'neutrófilos y granulomas', 'nariz destruida, nódulos', 'GN pauciinmune'];
  const ella: string[] = ['tipo 2 y anti-MPO', 'asma, pólipos, eosinófilos', 'IgE alta y púrpura', 'riñón aún a salvo'];
  const preg: [string, string][] = [['tamano', '¿Qué tamaño de vaso?'], ['mecanismo', '¿Qué mecanismo?'], ['patron', '¿Qué patrón de IF?'], ['organos', '¿Qué órganos?']];
  return (
    <g>
      <Sale p={p('el')} x={200} y={260} k={0.5}><Tarjeta w={460} h={500} /><En y={-20}><Paciente quien="el" /></En></Sale>
      {el.map((t, i) => <g key={t}><circle cx={400} cy={150 + i * 70} r={8 * tramo(p('el'), i * 0.15, 0.5 + i * 0.15)} fill={V.turquesa[0]} /><Txt x={420} y={150 + i * 70} txt={t} t={24} p={tramo(p('el'), i * 0.15, 0.5 + i * 0.15)} ancla="start" /></g>)}
      <Sale p={p('ella')} x={1400} y={260} k={0.5}><Tarjeta w={460} h={500} color="#FFF1F6" /><En y={-20}><Paciente quien="ella" /></En></Sale>
      {ella.map((t, i) => <g key={t}><circle cx={1200} cy={150 + i * 70} r={8 * tramo(p('ella'), i * 0.15, 0.5 + i * 0.15)} fill={V.ambar[0]} /><Txt x={1180} y={150 + i * 70} txt={t} t={24} p={tramo(p('ella'), i * 0.15, 0.5 + i * 0.15)} ancla="end" /></g>)}
      <Bandera x={800} y={560} txt="El mismo vaso, dos armas distintas" color="var(--cit-base)" p={p('vaso')} t={32} />
      {preg.map(([n, t], i) => (
        <Pista key={n} x={230 + i * 380} y={740} p={p(n)} nombre={t} dy={90} t={24}>
          {i === 0 ? <g>{[34, 22, 12].map((R, j) => <g key={j}><circle cx={-50 + j * 46} r={R} fill={V.pared[2]} /><circle cx={-50 + j * 46} r={R * 0.6} fill={V.sangre[1]} /></g>)}</g>
            : i === 1 ? <g><Anca x={-24} y={-10} k={1.6} /><Pr3 x={-24} y={-26} k={1.1} /><Anca x={24} y={-10} k={1.6} /><Mpo x={24} y={-26} k={1.1} /></g>
            : i === 2 ? <g><circle r={50} fill="#0E1F14" /><Glomerulo brillo="granular" k={0.17} /></g>
            : <Cuerpo k={0.2} y={-6} />}
        </Pista>
      ))}
      <Txt x={800} y={900} txt="ahí está el diagnóstico" t={34} p={p('preguntas')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [PulmonRinon, NarizEl, NarizElla, Capilaritis, Fisiologia, Radiografia, AsmaElla, ElRinon, AntiMbg, Cierre];
export default LAMINAS;
