'use client';
// Capítulo 6 · Lo que ve el patólogo: necrosis fibrinoide e inflamación granulomatosa.

import type { Lamina } from '../Lienzo';
import { Cruz, Lente, Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Bandera, CelGigante, Complejo, En, Eosinofilo, Epitelioide, Flecha, FLECHA, Glomerulo, Granuloma, Hematie, Perfil, Plaqueta, Sale, Txt, V, blob, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Arteriola en corte H-E. `fib` la pared se vuelve banda rosada; `neu` neutrófilos; `polvo` cariorrexis; `eos` eosinófilos; `rojos` extravasación. */
function Arteriola({ fib = 0, neu = 0, polvo = 0, eos = 0, rojos = 0, fibrina = 0, gruesa = 0 }: { fib?: number; neu?: number; polvo?: number; eos?: number; rojos?: number; fibrina?: number; gruesa?: number }) {
  const R = 150 + 30 * gruesa;
  return (
    <g>
      <rect x={-420} y={-420} width={840} height={840} fill="#F6D6E6" />
      {Array.from({ length: 34 }, (_, i) => <ellipse key={i} cx={(hash(i, 1) - 0.5) * 800} cy={(hash(i, 2) - 0.5) * 800} rx={34} ry={8} fill="#EAB6D0" transform={`rotate(${hash(i, 3) * 180} ${(hash(i, 1) - 0.5) * 800} ${(hash(i, 2) - 0.5) * 800})`} />)}
      <circle r={R + 40} fill="#E591BF" />
      <circle r={R + 10} fill="#FF4F9A" opacity={tramo(fib, 0, 0.7)} />
      {fibrina > 0.01 && Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * (R - 40)},${Math.sin(a) * (R - 40)} L${Math.cos(a + 0.12) * (R + 20)},${Math.sin(a + 0.12) * (R + 20)}`} stroke={V.fibrina[1]} strokeWidth={7} strokeLinecap="round" opacity={tramo(fibrina, i / 24, i / 24 + 0.3)} />; })}
      <circle r={R - 40} fill="#FBEFF5" />
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + 0.2, d = R + 10 + hash(i, 4) * 120; return <g key={i} opacity={tramo(neu, i / 24, i / 24 + 0.3)}><circle cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={10} fill="#5A2A9E" /><circle cx={Math.cos(a) * d + 9} cy={Math.sin(a) * d + 4} r={8} fill="#5A2A9E" /><circle cx={Math.cos(a) * d + 2} cy={Math.sin(a) * d + 12} r={7} fill="#5A2A9E" /></g>; })}
      {Array.from({ length: 50 }, (_, i) => { const a = hash(i, 5) * Math.PI * 2, d = R + hash(i, 6) * 170; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={2.5 + hash(i, 7) * 2.5} fill="#3A1660" opacity={tramo(polvo, i / 70, i / 70 + 0.3)} />; })}
      {Array.from({ length: 12 }, (_, i) => { const a = hash(i, 8) * Math.PI * 2, d = R + 40 + hash(i, 9) * 150; return <g key={i} opacity={tramo(eos, i / 18, i / 18 + 0.3)}><circle cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={15} fill="#FF7A3D" /><circle cx={Math.cos(a) * d - 5} cy={Math.sin(a) * d} r={5} fill="#5A2A9E" /><circle cx={Math.cos(a) * d + 6} cy={Math.sin(a) * d} r={5} fill="#5A2A9E" /></g>; })}
      {Array.from({ length: 16 }, (_, i) => { const a = hash(i, 10) * Math.PI * 2, d = R + 70 + hash(i, 11) * 170; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={13} fill="#E8364E" opacity={tramo(rojos, i / 24, i / 24 + 0.3)} />; })}
    </g>
  );
}

/** Granuloma en corte H-E (colores de la tinción). */
function GranulomaHE({ necrosis = 0, langhans = 1, p = 1 }: { necrosis?: number; langhans?: number; p?: number }) {
  return (
    <g>
      <rect x={-420} y={-420} width={840} height={840} fill="#F6D6E6" />
      <Granuloma k={1.05} p={p} necrosis={necrosis} />
      <CelGigante x={-150} y={140} k={0.55} langhans={langhans} o={tramo(p, 0.5, 0.9)} />
    </g>
  );
}

const DosPatrones: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Casi todas dejan uno de dos patrones" color="var(--cit-base)" p={p('patrones')} t={30} punta="no" />
      <Lente x={420} y={470} R={260} id="c6-a" o={tramo(p('fibrinoide'), 0, 0.4)}><En k={0.65}><Arteriola fib={1} neu={1} polvo={1} /></En></Lente>
      <Bandera x={420} y={780} txt="Necrosis fibrinoide" color="#E0338A" p={p('fibrinoide')} t={28} />
      <Txt x={420} y={870} txt="«la pared se rompió»" t={28} p={p('rompio')} />
      <Lente x={1180} y={470} R={260} id="c6-b" o={tramo(p('granulomatosa'), 0, 0.4)}><En k={0.62}><GranulomaHE /></En></Lente>
      <Bandera x={1180} y={780} txt="Inflamación granulomatosa" color={V.violeta[0]} p={p('granulomatosa')} t={28} />
      <Txt x={1180} y={870} txt="«intentó encerrar algo que no pudo destruir»" t={24} p={p('encerrar')} />
    </g>
  );
};

const Fibrinoide: Lamina = ({ p }) => {
  return (
    <g>
      <Lente x={520} y={500} R={360} id="c6-fib" o={tramo(p('empieza'), 0, 0.4)}>
        <En k={0.85}><Arteriola fibrina={clamp(p('proteinas') + p('fibrina'))} fib={p('he')} /></En>
        {p('mezclan') > 0.01 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <Complejo key={i} x={Math.cos(a) * 130} y={Math.sin(a) * 130} k={0.6} o={tramo(p('complejos'), i / 12, i / 12 + 0.3)} />; })}
      </Lente>
      <Txt x={1200} y={200} txt="el endotelio se lesiona" t={28} p={p('lesiona')} />
      <Bandera x={1200} y={300} txt="Entran proteínas del plasma: fibrina" color="#C99300" p={p('fibrina')} t={24} />
      <Txt x={1200} y={380} txt="se mezclan con células muertas" t={24} p={p('mezclan')} />
      <Txt x={1200} y={430} txt="y a veces con inmunocomplejos" t={24} p={p('complejos')} fuerte={false} />
      <Bandera x={1200} y={560} txt="H-E: banda rosada intensa, sin forma" color="#E0338A" p={p('banda')} t={24} />
      <Txt x={1200} y={660} txt="recuerda a la fibrina: de ahí su nombre" t={24} p={p('nombre')} />
    </g>
  );
};

const Leucocitoclastica: Lamina = ({ p }) => {
  return (
    <g>
      <Lente x={460} y={500} R={340} id="c6-leu" o={tramo(p('piel'), 0, 0.4)}>
        <En k={0.8}><Arteriola fib={0.7} neu={p('neutros')} polvo={p('polvo')} rojos={p('rojos')} /></En>
      </Lente>
      <Bandera x={460} y={100} txt="Piel: vasculitis leucocitoclástica" color="#E0338A" p={p('leucocitoclastica')} t={28} />
      <Bandera x={1180} y={230} txt="Neutrófilos en la pared" color={V.nucleo[1]} p={p('neutros')} t={24} />
      <Bandera x={1180} y={320} txt="Se rompen: polvo nuclear" color="#3A1660" p={p('polvo')} t={24} />
      <Bandera x={1180} y={410} txt="Glóbulos rojos en la dermis" color={V.sangre[0]} p={p('rojos')} t={24} />
      <Lente x={1180} y={700} R={190} id="c6-pac" o={tramo(p('paciente'), 0, 0.4)}>
        <rect x={-200} y={-200} width={400} height={400} fill="#FFF3C4" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(i % 3 - 1) * 130} cy={(Math.floor(i / 3) - 1) * 130} r={58} fill="#FFFBE6" stroke="#F2D7A0" strokeWidth={6} />)}
        <En k={0.4}><Arteriola fib={1} neu={0.3} eos={p('eos')} gruesa={1} /></En>
      </Lente>
      <Txt x={1180} y={930} txt="segunda paciente: grasa subcutánea, pared gruesa, eosinófilos" t={22} p={p('grasa')} />
    </g>
  );
};

const Destinos: Lamina = ({ p }) => {
  const tr = p('trombo'), an = p('aneurisma'), fi = p('fibrosis');
  return (
    <g>
      <Bandera x={800} y={80} txt="La pared necrosada tiene tres destinos" color="var(--cit-base)" p={p('destinos')} t={30} punta="no" />
      {[300, 800, 1300].map((x, i) => (
        <Sale key={x} p={[tr, an, fi][i]} x={x} y={430}>
          <rect x={-200} y={-90} width={400} height={180} rx={0} fill={V.pared[2]} />
          <rect x={-200} y={i === 2 ? -30 - 20 * (1 - p('estrecha')) : -60} width={400} height={i === 2 ? 60 + 40 * (1 - p('estrecha')) : 120} fill={V.sangre[1]} />
          {i === 1 && <ellipse cx={0} cy={-80} rx={90 * easeOut(an)} ry={80 * easeOut(an)} fill={V.sangre[1]} stroke={V.pared[2]} strokeWidth={14} />}
          {i === 2 && <><rect x={-200} y={-90} width={400} height={30 + 30 * p('estrecha')} fill="#E7C9A6" /><rect x={-200} y={60 - 30 * p('estrecha')} width={400} height={30 + 30 * p('estrecha')} fill="#E7C9A6" /></>}
        </Sale>
      ))}
      {tr > 0.01 && <path d={blob(9, 60, 0.25, 3, 1.6)} transform="translate(300,430)" fill="#8A1A2E" opacity={tramo(tr, 0.2, 0.6)} />}
      {tr > 0.01 && [0, 1, 2, 3].map((i) => <Plaqueta key={i} x={250 + i * 34} y={400 + (i % 2) * 40} k={0.45} o={tramo(tr, 0.2, 0.6)} />)}
      <Bandera x={300} y={640} txt="Trombo" color="#8A1A2E" p={tr} t={28} />
      <Txt x={300} y={710} txt="isquemia e infarto" t={24} p={p('infarto')} />
      <Bandera x={800} y={640} txt="Aneurisma" color={V.sangre[0]} p={an} t={28} />
      <Txt x={800} y={710} txt="puede romperse" t={24} p={p('rompe')} />
      {[0, 1, 2].map((i) => <Hematie key={i} x={780 + i * 30} y={lerp(340, 220 - i * 20, easeOut(p('rompe')))} k={0.4} o={tramo(p('rompe'), 0, 0.3)} />)}
      <Bandera x={1300} y={640} txt="Fibrosis de la íntima" color="#B07A2E" p={fi} t={26} />
      <Txt x={1300} y={710} txt="la luz queda estrecha para siempre" t={22} p={p('estrecha')} />
    </g>
  );
};

const Granulomatoso: Lamina = ({ p }) => {
  return (
    <g>
      <Lente x={480} y={500} R={360} id="c6-gr" o={tramo(p('granulomatoso'), 0, 0.4)}>
        <En k={0.85}><GranulomaHE p={clamp(p('epitelioides') + p('collar') * 0.5)} langhans={p('langhans')} /></En>
      </Lente>
      <Bandera x={1180} y={180} txt="Histiocitos epitelioides" color="#4A3FB8" p={p('epitelioides')} t={24} />
      <Bandera x={1180} y={270} txt="Células gigantes multinucleadas" color={V.violeta[0]} p={p('gigantes')} t={24} />
      <Bandera x={1180} y={360} txt="Collar de linfocitos" color={V.turquesa[0]} p={p('collar')} t={24} />
      <Sale p={p('fusionan')} x={1100} y={560} k={0.5}><Epitelioide x={-60} /><Epitelioide x={60} r={30} /></Sale>
      <Flecha a={[1180, 560]} b={[1260, 560]} p={p('fusionan')} color={FLECHA} w={6} />
      <Sale p={p('langhans')} x={1380} y={560} k={0.5}><CelGigante langhans={1} /></Sale>
      <Txt x={1300} y={670} txt="núcleos en herradura: Langhans" t={22} p={p('langhans')} />
      <Txt x={1180} y={800} txt="busca encerrar un antígeno que no puede eliminar" t={22} p={p('encerrar')} />
      <Bandera x={1180} y={880} txt="…y en el camino, destruye la pared" color={V.sangre[0]} p={p('destruye')} t={24} />
    </g>
  );
};

const Necrotizante: Lamina = ({ p }) => {
  return (
    <g>
      <Lente x={460} y={480} R={330} id="c6-nec" o={tramo(p('gpa'), 0, 0.4)}>
        <En k={0.8}><GranulomaHE necrosis={p('necrotizante')} /></En>
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(hash(i, 3) - 0.5) * 200} cy={(hash(i, 4) - 0.5) * 120} r={3 + hash(i, 5) * 3} fill="#2A1660" opacity={tramo(p('basofilos'), i / 40, i / 40 + 0.3)} />)}
      </Lente>
      <Bandera x={460} y={90} txt="GPA: granuloma necrotizante" color={V.turquesa[0]} p={p('gpa')} t={28} />
      <Txt x={460} y={870} txt="necrosis geográfica, restos basófilos, empalizada" t={22} p={p('empalizada')} />
      <Txt x={460} y={920} txt="dentro o fuera del vaso" t={22} p={p('dentro')} fuerte={false} />
      <Lente x={1200} y={480} R={260} id="c6-eos" o={tramo(p('gepa'), 0, 0.4)}>
        <rect x={-300} y={-300} width={600} height={600} fill="#F6D6E6" />
        <Granuloma k={0.6} x={60} p={1} necrosis={0.6} />
        {Array.from({ length: 12 }, (_, i) => <Eosinofilo key={i} x={(hash(i, 6) - 0.5) * 420} y={(hash(i, 7) - 0.5) * 420} k={0.32} />)}
        <circle cx={-150} cy={-120} r={46} fill="#E591BF" /><circle cx={-150} cy={-120} r={22} fill="#FBEFF5" />
      </Lente>
      <Bandera x={1200} y={810} txt="GEPA: ricos en eosinófilos" color={V.ambar[0]} p={p('gepa')} t={26} />
      <Txt x={1200} y={880} txt="suelen ser extravasculares" t={22} p={p('extravascular')} />
    </g>
  );
};

const DosSitios: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Una misma enfermedad, los dos patrones" color="var(--cit-base)" p={p('misma')} t={30} punta="no" />
      <Sale p={p('nariz')} x={360} y={380} k={0.8}><Perfil quien="el" hundida={0.7} costras={1} /></Sale>
      <Lente x={360} y={760} R={140} id="c6-nz" o={tramo(p('nariz'), 0.3, 0.7)}><En k={0.34}><GranulomaHE necrosis={0.6} /></En></Lente>
      <Txt x={360} y={940} txt="granuloma en la nariz" t={24} p={p('nariz')} />
      <Sale p={p('glomerulo')} x={1180} y={420} k={0.8}><Glomerulo necrosis={1} /></Sale>
      <Txt x={1180} y={700} txt="necrosis fibrinoide en el capilar glomerular" t={24} p={p('glomerulo')} />
      <Txt x={760} y={800} txt="la biopsia nasal puede ser inespecífica…" t={24} p={p('inespecifica')} />
      <Bandera x={1100} y={880} txt="…el riñón o el pulmón dan el diagnóstico" color={V.turquesa[0]} p={p('diagnostico')} t={24} />
    </g>
  );
};

const Prueba: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Pongámoslo a prueba" color={V.ambar[0]} p={p('prueba')} t={32} punta="no" />
      <Lente x={520} y={520} R={330} id="c6-q" o={tramo(p('biopsia'), 0, 0.4)}>
        <En k={0.78}><Arteriola fib={p('biopsia')} neu={p('neutros')} eos={p('eos')} polvo={p('neutros') * 0.6} /></En>
      </Lente>
      <Txt x={520} y={900} txt="piel: necrosis fibrinoide, neutrófilos y eosinófilos" t={24} p={p('biopsia')} />
      <Sale p={p('pregunta')} x={1200} y={430} k={1 + 0.04 * Math.sin(reloj / 300)}>
        <circle r={150} fill={V.violeta[1]} /><circle cx={-12} cy={-12} r={132} fill={V.violeta[2]} />
        <text dy="0.35em" textAnchor="middle" fill="#FFF" style={{ fontSize: 200, fontWeight: 800 }}>?</text>
      </Sale>
      <Txt x={1200} y={680} txt="¿qué puedes afirmar?" t={30} p={p('pregunta')} />
      <Txt x={1200} y={760} txt="piensa en cada pieza por separado" t={24} p={p('piensa')} fuerte={false} />
    </g>
  );
};

const Respuesta: Lamina = ({ p }) => {
  const fil: [string, string, string][] = [['fibrinoide', 'La necrosis fibrinoide no prueba inmunocomplejos', 'también la producen los ANCA'], ['eos', 'Los eosinófilos no descartan ANCA', 'ni bastan para diagnosticar GEPA']];
  return (
    <g>
      {fil.map(([n, txt, sub], i) => (
        <g key={n}>
          <Cruz x={170} y={200 + i * 200} k={0.9} p={p(n)} />
          <Txt x={240} y={190 + i * 200} txt={txt} t={30} p={p(n)} ancla="start" />
          <Txt x={240} y={240 + i * 200} txt={sub} t={24} p={p(n === 'fibrinoide' ? 'anca' : 'bastan')} ancla="start" fuerte={false} />
        </g>
      ))}
      <Visto x={170} y={600} k={1} p={p('seguro')} />
      <Txt x={240} y={590} txt="Lo único seguro:" t={30} p={p('seguro')} ancla="start" />
      <Bandera x={240} y={660} txt="la lesión vascular coexiste con inflamación eosinofílica" color={V.verde[0]} p={p('coexiste')} t={24} ancla="izq" punta="no" />
      <Bandera x={300} y={850} txt="Inmunofluorescencia" color={V.verde[0]} p={p('resto')} t={26} ancla="izq" punta="no" />
      <Bandera x={760} y={850} txt="ANCA" color={V.anca[1]} p={tramo(p('resto'), 0.2, 1)} t={26} ancla="izq" punta="no" />
      <Bandera x={960} y={850} txt="Clínica" color={V.ambar[0]} p={tramo(p('resto'), 0.4, 1)} t={26} ancla="izq" punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosPatrones, Fibrinoide, Leucocitoclastica, Destinos, Granulomatoso, Necrotizante, DosSitios, Prueba, Respuesta];
export default LAMINAS;
