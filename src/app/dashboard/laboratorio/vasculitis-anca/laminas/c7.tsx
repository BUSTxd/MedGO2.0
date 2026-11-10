'use client';
// Capítulo 7 · El glomérulo se rompe: de la necrosis del asa a la semiluna y la caída del filtrado.

import type { Lamina } from '../Lienzo';
import { Barra, Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Anca, Bandera, FotoLente, Llamada, Manometro, PiernaPurpura, Pista, C5a, En, Flecha, FLECHA, Foco, Glomerulo, Hematie, Macrofago, Net, Neutrofilo, Sale, Txt, V, blob, clamp, easeOut, lerp, tramo, Portaobjetos } from '../Piezas';

/** Glomérulo pequeño para contar: 0 normal, 1 semiluna celular, 2 cicatriz. */
function MiniGlom({ x, y, tipo, o = 1 }: { x: number; y: number; tipo: 0 | 1 | 2; o?: number }) {
  return (
    <En x={x} y={y} o={o}>
      <circle r={30} fill={tipo === 2 ? '#C9A27A' : '#F4B9CF'} />
      <circle r={25} fill={tipo === 2 ? '#E7C9A6' : '#FFF1F6'} />
      {tipo === 1 && <path d="M-25,0 A25,25 0 0 1 25,0 A25,12 0 0 0 -25,0 Z" transform="rotate(-150)" fill="#D46A9E" />}
      {tipo !== 2 && <circle cx={tipo ? 4 : 0} cy={tipo ? 4 : 0} r={tipo ? 13 : 17} fill="#C2305A" />}
    </En>
  );
}

const Anatomia: Lamina = ({ p }) => {
  const b = p('barrera');
  return (
    <g>
      <Sale p={p('ovillo')} x={330} y={500} k={1}><Glomerulo /></Sale>
      <Txt x={360} y={120} txt="un ovillo de capilares entre dos arteriolas" t={26} p={p('arteriolas')} />
      <Manometro x={120} y={850} k={0.8} val={p('presion')} o={tramo(p('presion'), 0, 0.4)} />
      <Txt x={190} y={870} txt="la presión más alta de todos los capilares" t={24} p={p('presion')} ancla="start" />
      <Foco x={400} y={440} R={60} p={b} />
      <Flecha a={[460, 420]} b={[680, 360]} p={b} color={FLECHA} w={6} cabeza={false} />
      <Lente x={960} y={450} R={290} id="c7-bar" o={tramo(b, 0, 0.4)}>
        <rect x={-320} y={-320} width={640} height={640} fill="#FFF1F6" />
        <rect x={-320} y={-320} width={640} height={190} fill="#FFDCE5" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-310 + i * 72} y={-140} width={58} height={34} rx={10} fill={V.endo[0]} opacity={tramo(p('endotelio'), 0, 0.4)} />)}
        <rect x={-320} y={-100} width={640} height={50} fill="#E7A93A" opacity={tramo(p('mbg'), 0, 0.4)} />
        {Array.from({ length: 10 }, (_, i) => <g key={i} opacity={tramo(p('podocitos'), i / 14, i / 14 + 0.3)}><rect x={-310 + i * 64} y={-50} width={36} height={60} rx={14} fill={V.violeta[1]} /></g>)}
        <path d="M-320,60 C-160,90 -40,40 120,70 S280,60 320,70 L320,90 L-320,90 Z" fill="#7A45E6" opacity={tramo(p('podocitos'), 0.4, 0.8)} />
        <rect x={-320} y={110} width={640} height={130} fill="#FFFBE6" opacity={tramo(p('bowman'), 0, 0.4)} />
        <rect x={-320} y={240} width={640} height={80} fill="#F4B9CF" opacity={tramo(p('bowman'), 0, 0.4)} />
      </Lente>
      <Txt x={1270} y={330} txt="endotelio fenestrado" t={22} p={p('endotelio')} ancla="start" />
      <Txt x={1270} y={385} txt="membrana basal" t={22} p={p('mbg')} ancla="start" />
      <Txt x={1270} y={440} txt="podocitos" t={22} p={p('podocitos')} ancla="start" />
      <Txt x={1270} y={575} txt="espacio de Bowman" t={22} p={p('bowman')} ancla="start" />
      <Txt x={1270} y={665} txt="epitelio parietal" t={22} p={p('bowman')} ancla="start" fuerte={false} />
      <Txt x={960} y={860} txt="retén ese espacio" t={30} color={V.ambar[0]} p={p('reten')} />
    </g>
  );
};

const SeRompe: Lamina = ({ p, reloj }) => {
  const at = p('atascan'), rompe = p('rompe');
  return (
    <g>
      <Sale p={p('cebados')} x={800} y={500}>
        <path d="M-700,-90 C-300,-90 -200,-130 0,-130 C200,-130 300,-90 700,-90 L700,90 C300,90 200,130 0,130 C-200,130 -300,90 -700,90 Z" fill="#C2305A" />
        <path d="M-700,-62 C-300,-62 -200,-100 0,-100 C200,-100 300,-62 700,-62 L700,62 C300,62 200,100 0,100 C-200,100 -300,62 -700,62 Z" fill="#FFDCE5" />
        <path d="M-60,-128 C0,-134 100,-134 180,-124 L180,-96 C100,-104 0,-104 -60,-98 Z" fill="#5A0A2A" opacity={0.85 * tramo(p('necrosa'), 0, 0.6)} />
        {rompe > 0.01 && <path d={blob(9, 60, 0.3, 8, 1.4)} transform={`translate(80,-118) scale(${(0.4 + 0.6 * rompe).toFixed(2)})`} fill="var(--vas-fondo-a)" />}
      </Sale>
      {[0, 1, 2].map((i) => <Hematie key={i} x={((reloj * 0.1 + i * 300) % 1400) + 100} y={500 + (i - 1) * 30} k={0.55} lado={0.7} o={tramo(p('cebados'), 0, 0.4)} />)}
      <Neutrofilo x={lerp(150, 760, easeOut(at))} y={500} k={1.6} cebado={1} activo={p('liberan')} />
      {[0, 1, 2].map((i) => <Anca key={i} x={700 + i * 70} y={380 + (i % 2) * 40} r={150 + i * 20} k={1} o={tramo(p('anca'), i * 0.15, 0.5 + i * 0.15)} />)}
      <Net x={900} y={520} p={p('liberan')} R={110} />
      {[0, 1, 2, 3].map((i) => <C5a key={i} x={1000 + i * 70} y={560 + Math.sin(reloj / 260 + i) * 10} k={1.1} o={tramo(p('complemento'), i * 0.12, 0.5)} />)}
      <Txt x={800} y={170} txt="grandes y poco deformables: se atascan" t={28} p={at} />
      <Txt x={800} y={230} txt="proteasas, oxidantes y NETs; la vía alternativa amplifica" t={24} p={p('liberan')} fuerte={false} />
      <Bandera x={800} y={800} txt="El asa se necrosa y la membrana basal se rompe" color={V.sangre[0]} p={rompe} t={28} />
      <Txt x={800} y={880} txt="(se pegan al endotelio)" t={22} p={p('pegan')} fuerte={false} />
    </g>
  );
};

const Fibrina: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('ruptura')} x={560} y={520} k={1.35}><Glomerulo necrosis={1} fibrina={p('fibrina')} /></Sale>
      {[0, 1, 2, 3, 4].map((i) => <Hematie key={i} x={lerp(600, 380 + i * 50, easeOut(tramo(p('rojos'), i * 0.1, 0.8)))} y={lerp(420, 240 + (i % 2) * 30, easeOut(tramo(p('rojos'), i * 0.1, 0.8)))} k={0.45} o={tramo(p('rojos'), i * 0.1, 0.3)} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={lerp(600, 420 + i * 40, easeOut(tramo(p('fibrinogeno'), i * 0.1, 0.8)))} cy={lerp(420, 300, easeOut(tramo(p('fibrinogeno'), i * 0.1, 0.8)))} r={8} fill={V.fibrina[1]} opacity={tramo(p('fibrinogeno'), i * 0.1, 0.3)} />)}
      <Txt x={1200} y={260} txt="por la ruptura: glóbulos rojos y plasma" t={26} p={p('rojos')} />
      <Txt x={1200} y={320} txt="con el plasma, fibrinógeno" t={26} p={p('fibrinogeno')} />
      <Txt x={1200} y={420} txt="en el espacio de Bowman…" t={26} p={p('bowman')} />
      <Txt x={1200} y={500} txt="…se convierte en fibrina" t={28} color="#C99300" p={p('fibrina')} />
      <Txt x={1200} y={700} txt="la señal clave" t={34} color={V.ambar[0]} p={p('clave')} />
    </g>
  );
};

const Semiluna: Lamina = ({ p }) => {
  const sl = clamp(p('proliferan') * 0.5 + p('semiluna') * 0.5);
  return (
    <g>
      <FotoLente x={560} y={510} R={330} foto="semiluna-pas" o={p('proliferan')} />
      <Sale p={p('proliferan')} x={1260} y={330} k={0.58}><Glomerulo semiluna={sl} fibrina={1 - sl} necrosis={1} /></Sale>
      <Sale p={p('monocitos')} x={1120} y={200} k={0.12}><Macrofago /></Sale>
      <Sale p={p('monocitos')} x={1135} y={290} k={0.1}><Macrofago /></Sale>
      <Txt x={1260} y={530} txt="prolifera el epitelio parietal" t={22} p={p('proliferan')} />
      <Txt x={1260} y={568} txt="llegan monocitos y macrófagos" t={22} p={p('monocitos')} />
      <Txt x={1260} y={625} txt="semiluna" t={36} color="#D46A9E" p={p('semiluna')} />
      <Txt x={1260} y={665} txt="llena el espacio de Bowman y aplasta el ovillo" t={20} p={p('aplasta')} />
      <Llamada x={960} y={745} a={[560 + (200 - 360) * 0.917, 510 + (230 - 360) * 0.917]} txt="semiluna: capa gruesa de células" p={p('pas')} t={22} halo />
      <Llamada x={960} y={790} a={[560 + (450 - 360) * 0.917, 510 + (420 - 360) * 0.917]} txt="ovillo aplastado" p={tramo(p('pas'), 0.25, 1)} t={22} halo />
      <Llamada x={960} y={835} a={[560 + (72 - 360) * 0.917, 510 + (400 - 360) * 0.917]} txt="cápsula de Bowman (magenta con PAS)" p={tramo(p('pas'), 0.5, 1)} t={22} halo />
      <Portaobjetos x={1330} y={925} k={0.75} o={tramo(p('proliferan'), 0.3, 1)} organo="RIÑÓN" tincion="PAS" caso="anti-MBG" tejido="#D9539C" />
    </g>
  );
};

const Evolucion: Lamina = ({ p }) => {
  const est: [string, string, number, number][] = [['celular', 'Celular', 0, 260], ['fibrocelular', 'Fibrocelular', 0.5, 640], ['fibrosa', 'Fibrosa', 1, 1020]];
  const mitad = p('mitad');
  return (
    <g>
      <Txt x={800} y={70} txt="si nadie la detiene, la fibrina atrae fibroblastos" t={28} p={p('fibroblastos')} />
      {est.map(([n, txt, ci, x]) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={320} k={0.62}><Glomerulo semiluna={1} cicatriz={ci} /></Sale>
          <Txt x={x} y={520} txt={txt.toLowerCase()} t={26} color={ci > 0.7 ? '#B07A2E' : ci > 0.3 ? '#C2307A' : '#D46A9E'} p={p(n)} />
        </g>
      ))}
      <Flecha a={[400, 320]} b={[500, 320]} p={p('fibrocelular')} color={FLECHA} w={7} />
      <Flecha a={[780, 320]} b={[880, 320]} p={p('fibrosa')} color={FLECHA} w={7} />
      <Txt x={1300} y={320} txt="esa ya no vuelve" t={28} p={p('novuelve')} ancla="start" />
      {Array.from({ length: 20 }, (_, i) => <MiniGlom key={i} x={280 + (i % 10) * 80} y={680 + Math.floor(i / 10) * 80} tipo={i < 12 && mitad > i / 20 ? 1 : 0} o={tramo(mitad, 0, 0.3)} />)}
      <Txt x={1260} y={700} txt="semilunas en más de la mitad" t={24} p={mitad} />
      <Bandera x={1260} y={800} txt="Glomerulonefritis rápidamente progresiva" color={V.sangre[0]} p={p('gnrp')} t={24} />
    </g>
  );
};

const Hematuria: Lamina = ({ p }) => {
  const d = p('deforman');
  return (
    <g>
      <Bandera x={800} y={80} txt="El primer hallazgo: hematuria" color={V.sangre[0]} p={p('hematuria')} t={30} punta="no" />
      <Sale p={p('hematuria')} x={800} y={420}>
        <path d="M-560,-60 L-200,-60 C-100,-60 -60,60 40,60 L700,60" fill="none" stroke="#F4B9CF" strokeWidth={130} strokeLinecap="round" />
        <path d="M-560,-60 L-200,-60 C-100,-60 -60,60 40,60 L700,60" fill="none" stroke="#FFF1F6" strokeWidth={96} strokeLinecap="round" />
      </Sale>
      {[0, 1, 2, 3, 4].map((i) => {
        const t = clamp(d * 1.2 - i * 0.12), x = lerp(-560, 600, t), y = x < -200 ? -60 : x < 40 ? lerp(-60, 60, (x + 200) / 240) : 60;
        return <Hematie key={i} x={800 + x} y={420 + y} k={0.75} vesiculas={tramo(t, 0.2, 0.8)} o={tramo(p('hematuria'), 0, 0.4)} />;
      })}
      <Sale p={p('hematuria')} x={170} y={360} k={0.42}><Glomerulo necrosis={1} /></Sale>
      <Txt x={420} y={580} txt="al atravesar la ruptura" t={24} p={d} />
      <Txt x={1100} y={580} txt="y el túbulo: osmolaridad y pH" t={24} p={p('tubulo')} />
      <Sale p={p('acantocitos')} x={520} y={780} k={1.8}><Hematie vesiculas={1} /></Sale>
      <Llamada x={900} y={740} a={[600, 760]} txt="dismórficos: acantocitos (con vesículas)" p={p('dismorficos')} t={26} />
      <Txt x={900} y={830} txt="un glóbulo rojo deformado viene del glomérulo" t={24} p={p('glomerulo')} ancla="start" />
    </g>
  );
};

const Cilindros: Lamina = ({ p }) => {
  const at = p('atrapados');
  return (
    <g>
      <Txt x={800} y={70} txt="rama gruesa del asa de Henle" t={28} p={p('henle')} />
      <Sale p={p('henle')} x={800} y={360}>
        <rect x={-650} y={-110} width={1300} height={220} rx={110} fill="#F2C98A" />
        <rect x={-640} y={-80} width={1280} height={160} rx={80} fill="#FFF6E0" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${-600 + i * 56},-60 q20,${30 + (i % 3) * 10} 0,120`} fill="none" stroke="#A8C9F0" strokeWidth={7} opacity={tramo(p('uromodulina'), i / 30, i / 30 + 0.3)} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <Hematie key={i} x={lerp(-600 + i * 40, -200 + i * 90, easeOut(at))} y={(i % 2 ? 1 : -1) * 22} k={0.55} vesiculas={0.6} o={tramo(at, 0, 0.3)} />)}
      </Sale>
      <Llamada x={180} y={560} a={[300, 440]} txt="uromodulina (Tamm-Horsfall)" p={p('uromodulina')} t={24} />
      <Sale p={p('cilindros')} x={1080} y={640} k={1}>
        <rect x={-180} y={-46} width={360} height={92} rx={46} fill="#C9DDF5" />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-130 + i * 65} cy={(i % 2 ? 1 : -1) * 12} r={24} fill={V.sangre[1]} />)}
      </Sale>
      <Txt x={1080} y={760} txt="cilindros hemáticos" t={30} color={V.sangre[1]} p={p('cilindros')} />
      <Txt x={1080} y={840} txt="la firma de una glomerulonefritis" t={24} p={p('firma')} />
      <Txt x={420} y={760} txt="proteinuria, pero suele ser subnefrótica" t={24} p={p('proteinuria')} fuerte={false} />
    </g>
  );
};

/** Pocas gotas de orina: oliguria. */
function Gotas() {
  return (
    <g>
      <path d="M-34,-40 L34,-40 L28,44 Q26,54 16,54 L-16,54 Q-26,54 -28,44 Z" fill="#E9EEF7" />
      <path d="M-30,30 L30,30 L28,44 Q26,52 16,52 L-16,52 Q-26,52 -28,44 Z" fill="#F2C230" />
      {[-30, -8].map((y, i) => <path key={i} d={'M0,' + (y - 14) + ' C8,' + (y - 2) + ' 8,' + (y + 6) + ' 0,' + (y + 6) + ' C-8,' + (y + 6) + ' -8,' + (y - 2) + ' 0,' + (y - 14) + ' Z'} fill="#F2C230" opacity={0.7 - i * 0.3} />)}
    </g>
  );
}

const Filtrado: Lamina = ({ p }) => {
  const cae = p('filtrado'), cr = p('paciente');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿Cómo explica la biopsia la caída de la función renal?" color={V.ambar[0]} p={p('pregunta')} t={26} punta="no" />
      <Sale p={p('superficie')} x={330} y={430} k={0.9}><Glomerulo semiluna={0.9} necrosis={1} /></Sale>
      <Txt x={330} y={720} txt="menos superficie para filtrar" t={24} p={p('superficie')} />
      <Barra x={720} y={300} w={420} val={1 - 0.5 * cae} color={V.turquesa[1]} txt="filtrado glomerular" p={p('superficie')} />
      <Barra x={720} y={420} w={420} val={0.3 + 0.5 * p('creatinina')} color={V.sangre[1]} txt="creatinina y urea" p={p('creatinina')} />
      <Txt x={930} y={560} txt={`creatinina ${lerp(0.9, 1.9, easeOut(cr)).toFixed(1).replace('.', ',')} mg/dL`} t={40} p={cr} />
      <Txt x={930} y={630} txt="perdió cerca de la mitad de su filtrado" t={24} p={p('mitad')} />
      <Pista x={600} y={830} p={p('oliguria')} nombre="oliguria, retiene sodio" dy={80}><Gotas /></Pista>
      <Pista x={900} y={830} p={p('edema')} nombre="hipertensión" dy={80}><Manometro x={0} y={-10} k={0.7} val={p('edema')} /></Pista>
      <Pista x={1160} y={820} p={tramo(p('edema'), 0.1, 1)} nombre="edema" dy={90}><g transform="scale(0.2)"><PiernaPurpura p={0} /></g><circle cx={-4} cy={34} r={7} fill="#C9806A" opacity={0.8} /></Pista>
    </g>
  );
};

const Clasificacion: Lamina = ({ p }) => {
  const grupos: [string, string, (0 | 1 | 2)[]][] = [
    ['focal', 'Focal', [0, 0, 0, 0, 0, 0, 1, 1, 2, 1]],
    ['crescentica', 'Crescéntica', [1, 1, 1, 1, 1, 1, 0, 0, 2, 0]],
    ['esclerotica', 'Esclerótica', [2, 2, 2, 2, 2, 2, 0, 1, 0, 1]],
    ['mixta', 'Mixta', [0, 0, 0, 1, 1, 1, 2, 2, 2, 0]],
  ];
  return (
    <g>
      <Bandera x={800} y={70} txt="La biopsia se clasifica contando glomérulos" color="var(--cit-base)" p={p('clasifica')} t={28} punta="no" />
      {grupos.map(([n, txt, val], g) => (
        <g key={n}>
          <Txt x={240} y={210 + g * 150} txt={txt} t={28} p={p(n)} ancla="middle" />
          {val.map((t, i) => <MiniGlom key={i} x={430 + i * 82} y={210 + g * 150} tipo={t} o={tramo(p(n), i / 14, i / 14 + 0.3)} />)}
        </g>
      ))}
      <Txt x={1380} y={210} txt="> 50 % normales" t={22} p={p('focal')} />
      <Txt x={1380} y={360} txt="> 50 % semilunas celulares" t={22} p={p('crescentica')} />
      <Txt x={1380} y={510} txt="> 50 % cicatriz" t={22} p={p('esclerotica')} />
      <Txt x={1380} y={660} txt="no domina ninguno" t={22} p={p('mixta')} />
      <Txt x={520} y={830} txt="focal: mejor pronóstico" t={26} color={V.verde[0]} p={p('pronostico')} />
      <Txt x={1080} y={830} txt="esclerótica: el peor" t={26} color={V.sangre[1]} p={p('pronostico')} />
      <Txt x={800} y={930} txt="cada semana sin tratar son nefronas que no vuelven" t={26} p={p('semana')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Anatomia, SeRompe, Fibrina, Semiluna, Evolucion, Hematuria, Cilindros, Filtrado, Clasificacion];
export default LAMINAS;
