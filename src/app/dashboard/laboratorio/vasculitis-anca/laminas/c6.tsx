'use client';
// Capítulo 6 · Lo que ve el patólogo: necrosis fibrinoide e inflamación granulomatosa.

import type { Lamina } from '../Lienzo';
import { Cruz, Lente, Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Bandera, CelGigante, FotoLente, Llamada, Pista, Pulmones, Rinon, Anca, Complejo, En, Epitelioide, Flecha, FLECHA, Glomerulo, Granuloma, Hematie, Perfil, Plaqueta, Sale, Txt, V, blob, clamp, easeOut, hash, lerp, tramo, Portaobjetos } from '../Piezas';

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
      <FotoLente x={420} y={470} R={260} foto="pan-fibrinoide" o={p('patrones')} credito="arriba" />
      <Portaobjetos x={130} y={700} k={0.62} o={tramo(p('patrones'), 0.3, 1)} organo="PIEL" tincion="H-E" caso="PAN cutánea" />
      <Bandera x={420} y={780} txt="Necrosis fibrinoide" color="#E0338A" p={p('fibrinoide')} t={28} />
      <Txt x={420} y={870} txt="«la pared se rompió»" t={28} p={p('rompio')} />
      <FotoLente x={1180} y={470} R={260} foto="gpa-granuloma" o={tramo(p('patrones'), 0.15, 1)} credito="arriba" />
      <Portaobjetos x={1470} y={700} k={0.62} o={tramo(p('patrones'), 0.4, 1)} organo="PULMÓN" tincion="H-E" caso="GPA" />
      <Bandera x={1180} y={780} txt="Inflamación granulomatosa" color={V.violeta[0]} p={p('granulomatosa')} t={28} />
      <Txt x={1180} y={870} txt="«intentó encerrar algo que no pudo destruir»" t={24} p={p('encerrar')} />
    </g>
  );
};

const Fibrinoide: Lamina = ({ p }) => {
  // Foto real desde el principio (centro 440,470, R 300: 1 px de la foto = 0,833); el proceso, dibujado a la derecha.
  const ph = (px: number, py: number): [number, number] => [440 + (px - 360) * 0.833, 470 + (py - 360) * 0.833];
  const DX = 1250, DY = 400, D = 0.583;
  return (
    <g>
      <FotoLente x={440} y={470} R={300} foto="pan-fibrinoide" o={p('empieza')} />
      <Txt x={170} y={848} txt="lámina de piel, teñida con H-E" t={18} p={p('empieza')} fuerte={false} />
      <Portaobjetos x={170} y={900} k={0.85} o={tramo(p('empieza'), 0.3, 1)} organo="PIEL" tincion="H-E" caso="PAN cutánea" />
      <Lente x={DX} y={DY} R={210} id="c6-fib" o={p('lesiona')}>
        <g transform={`scale(${D})`}>
          <En k={0.85}><Arteriola fibrina={clamp(p('proteinas') + p('fibrina'))} fib={p('he')} /></En>
          {p('mezclan') > 0.01 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <Complejo key={i} x={Math.cos(a) * 130} y={Math.sin(a) * 130} k={0.6} o={tramo(p('complejos'), i / 12, i / 12 + 0.3)} />; })}
        </g>
      </Lente>
      <Txt x={DX} y={140} txt="el endotelio se lesiona" t={26} p={p('lesiona')} />
      <Txt x={DX} y={652} txt="el mismo proceso, dibujado" t={18} p={p('lesiona')} fuerte={false} />
      <Llamada x={790} y={210} a={[DX + 180 * D, DY - 80 * D]} txt="entra la fibrina del plasma" p={p('fibrina')} t={22} />
      <Txt x={DX} y={700} txt="se mezclan con células muertas" t={22} p={p('mezclan')} />
      <Txt x={DX} y={738} txt="y a veces con inmunocomplejos" t={20} p={p('complejos')} fuerte={false} />
      <Llamada x={800} y={820} a={ph(461, 498)} txt="en H-E: banda rosada intensa, sin forma" p={p('banda')} t={22} halo />
      <Txt x={1030} y={890} txt="recuerda a la fibrina: de ahí su nombre" t={24} p={p('nombre')} />
    </g>
  );
};

const Leucocitoclastica: Lamina = ({ p }) => {
  return (
    <g>
      <FotoLente x={460} y={500} R={340} foto="leucocitoclastica" o={clamp(p('piel') + p('foto'))} />
      <Portaobjetos x={150} y={930} k={0.8} o={tramo(p('piel'), 0.2, 0.8)} organo="PIEL" tincion="H-E" caso="púrpura" />
      <Bandera x={460} y={100} txt="Piel: vasculitis leucocitoclástica" color="#E0338A" p={p('leucocitoclastica')} t={28} />
      <Llamada x={900} y={150} a={[460 + (360 - 360) * 0.944, 500 + (40 - 360) * 0.944]} txt="epidermis" p={p('foto')} t={22} halo />
      <Llamada x={900} y={230} a={[460 + (255 - 360) * 0.944, 500 + (520 - 360) * 0.944]} txt="neutrófilos en la pared del vaso" p={p('neutros')} t={24} halo />
      <Llamada x={900} y={320} a={[460 + (390 - 360) * 0.944, 500 + (600 - 360) * 0.944]} txt="se rompen: polvo nuclear" p={p('polvo')} t={24} halo />
      <Llamada x={900} y={410} a={[460 + (300 - 360) * 0.944, 500 + (190 - 360) * 0.944]} txt="glóbulos rojos en la dermis" p={p('rojos')} t={24} halo />
      <Lente x={1180} y={700} R={190} id="c6-pac" o={tramo(p('paciente'), 0, 0.4)}>
        <rect x={-200} y={-200} width={400} height={400} fill="#FFF3C4" />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(i % 3 - 1) * 130} cy={(Math.floor(i / 3) - 1) * 130} r={58} fill="#FFFBE6" stroke="#F2D7A0" strokeWidth={6} />)}
        <En k={0.4}><Arteriola fib={1} neu={0.3} eos={p('eos')} gruesa={1} /></En>
      </Lente>
      <Txt x={1180} y={930} txt="segunda paciente: grasa subcutánea, pared gruesa, eosinófilos" t={22} p={p('grasa')} />
    </g>
  );
};

/** Estetoscopio: la clínica. */
function Estetoscopio() {
  return (
    <g>
      <path d="M-26,-44 C-30,0 -10,20 0,20 C10,20 30,0 26,-44" fill="none" stroke="#7A45E6" strokeWidth={7} strokeLinecap="round" />
      <path d="M0,20 C0,44 30,50 40,30" fill="none" stroke="#7A45E6" strokeWidth={7} strokeLinecap="round" />
      <circle cx={-26} cy={-46} r={6} fill="#8E86A8" /><circle cx={26} cy={-46} r={6} fill="#8E86A8" />
      <circle cx={42} cy={22} r={16} fill="#8E86A8" /><circle cx={42} cy={22} r={10} fill="#D9D3EA" />
    </g>
  );
}

/** Arteria de lado (segmento): adventicia, media muscular y su luz. */
function Segmento({ w = 380 }: { w?: number }) {
  const W = w / 2;
  return (
    <g>
      <rect x={-W} y={-80} width={w} height={160} rx={30} fill="#F2B8CB" />
      <rect x={-W} y={-64} width={w} height={128} rx={24} fill={V.pared[2]} />
      {Array.from({ length: Math.floor(w / 24) }, (_, i) => [-54, 54].map((yy) => <ellipse key={`${i}${yy}`} cx={-W + 14 + i * 24} cy={yy} rx={4} ry={7} fill={V.pared[3]} opacity={0.8} />))}
    </g>
  );
}

const Destinos: Lamina = ({ p, reloj }) => {
  const tr = p('trombo'), an = p('aneurisma'), fi = p('fibrosis'), inf = p('infarto'), ro = p('rompe'), es = p('estrecha');
  const corre = (reloj / 30) % 60;
  return (
    <g>
      <Bandera x={800} y={80} txt="La pared necrosada tiene tres destinos" color="var(--cit-base)" p={p('destinos')} t={30} punta="no" />
      {/* 1 · Trombo: la luz se tapa y el tejido de después se infarta */}
      <Sale p={tr} x={300} y={380}>
        <Segmento />
        <rect x={-190} y={-44} width={380} height={88} rx={20} fill={V.sangre[1]} />
        <rect x={20} y={-44} width={170} height={88} fill="#E7B3C2" opacity={tramo(tr, 0.4, 1)} />
        {Array.from({ length: 5 }, (_, i) => <Hematie key={i} x={-180 + ((corre * 2 + i * 40) % 150)} y={(hash(i, 3) - 0.5) * 50} k={0.32} r={i * 50} />)}
        <path d={blob(9, 50, 0.2, 3, 1.1)} fill="#8A1A2E" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-40 + i * 12},-40 L${-30 + i * 10},40`} stroke="#FFD23F" strokeWidth={2.5} opacity={0.85} />)}
        {[[-20, -14], [10, 10], [-6, 22], [22, -18]].map(([px, py], i) => <Plaqueta key={i} x={px} y={py} k={0.35} />)}
      </Sale>
      <Sale p={inf} x={420} y={555} k={0.9}>
        <path d="M0,-100 L0,-40" stroke={V.sangre[1]} strokeWidth={12} strokeLinecap="round" />
        <rect x={-110} y={-44} width={220} height={100} rx={26} fill="#E9A0B5" />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-90 + (i % 7) * 30} cy={-18 + Math.floor(i / 7) * 44} r={9} fill="#C2457E" opacity={0.6} />)}
        <path d="M-110,-18 Q-110,-44 -84,-44 L84,-44 Q110,-44 110,-18 L110,30 Q110,56 84,56 L10,56 Z" fill="#9C95B5" opacity={0.85 * tramo(inf, 0.2, 1)} />
      </Sale>
      <Txt x={240} y={650} txt="trombo" t={28} p={tr} />
      <Txt x={240} y={690} txt="isquemia e infarto" t={22} p={inf} fuerte={false} />
      {/* 2 · Aneurisma: la pared débil se abomba y puede romperse */}
      <Sale p={an} x={800} y={400}>
        <circle cx={0} cy={-80} r={92 * easeOut(an)} fill="#C2457E" />
        <circle cx={0} cy={-80} r={82 * easeOut(an)} fill={V.sangre[1]} />
        <Segmento />
        <rect x={-190} y={-44} width={380} height={88} rx={20} fill={V.sangre[1]} />
        <rect x={-60} y={-70} width={120} height={40} fill={V.sangre[1]} />
        {ro > 0.01 && <path d="M-14,-168 L0,-150 L-8,-138 L8,-120" fill="none" stroke="#3A1342" strokeWidth={5} strokeLinecap="round" opacity={ro} />}
        <circle cx={-30} cy={-110} r={14} fill={V.sangre[3]} opacity={0.6} />
      </Sale>
      {[0, 1, 2, 3, 4].map((i) => <Hematie key={i} x={lerp(812, 880 + i * 18, easeOut(tramo(ro, i * 0.1, 0.6 + i * 0.1)))} y={lerp(262, 250 + i * 26, easeOut(tramo(ro, i * 0.1, 0.6 + i * 0.1)))} k={0.38} r={i * 60} o={tramo(ro, i * 0.1, 0.3 + i * 0.1)} />)}
      <Txt x={800} y={650} txt="aneurisma" t={28} p={an} />
      <Txt x={800} y={690} txt="puede romperse" t={22} p={ro} fuerte={false} />
      {/* 3 · Fibrosis de la íntima: capas en catáfila que estrechan la luz */}
      <Sale p={fi} x={1300} y={400}>
        <circle r={150} fill="#F2B8CB" /><circle r={128} fill={V.pared[2]} />
        {Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 112} cy={Math.sin(a) * 112} rx={4} ry={8} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 112} ${Math.sin(a) * 112})`} fill={V.pared[3]} />; })}
        <circle r={98} fill="#FFD23F" />
        <circle r={95} fill="#E7C9A6" />
        {[0, 1, 2, 3].map((j) => <circle key={j} r={92 - j * 14 * (0.3 + 0.7 * es)} fill="none" stroke="#C9A27A" strokeWidth={2.5} />)}
        <circle r={lerp(88, 30, es)} fill={V.sangre[1]} />
        <circle cx={-lerp(88, 30, es) * 0.35} cy={-lerp(88, 30, es) * 0.35} r={lerp(88, 30, es) * 0.18} fill={V.sangre[3]} opacity={0.8} />
      </Sale>
      <Txt x={1300} y={650} txt="fibrosis de la íntima" t={28} p={fi} />
      <Txt x={1300} y={690} txt="la luz queda estrecha para siempre" t={22} p={es} fuerte={false} />
    </g>
  );
};

const Granulomatoso: Lamina = ({ p }) => {
  return (
    <g>
      <Lente x={480} y={500} R={360} id="c6-gr" o={tramo(p('granulomatoso'), 0, 0.4)}>
        <En k={0.85}><GranulomaHE p={clamp(p('epitelioides') + p('collar') * 0.5)} langhans={p('langhans')} /></En>
      </Lente>
      <Llamada x={900} y={180} a={[620, 420]} txt="histiocitos epitelioides" p={p('epitelioides')} t={24} />
      <Llamada x={900} y={270} a={[355, 615]} txt="células gigantes multinucleadas" p={p('gigantes')} t={24} />
      <Llamada x={900} y={360} a={[690, 600]} txt="collar de linfocitos" p={p('collar')} t={24} />
      <Sale p={p('fusionan')} x={1100} y={560} k={0.5}><Epitelioide x={-60} /><Epitelioide x={60} r={30} /></Sale>
      <Flecha a={[1180, 560]} b={[1260, 560]} p={p('fusionan')} color={FLECHA} w={6} />
      <Sale p={p('langhans')} x={1380} y={560} k={0.5}><CelGigante langhans={1} /></Sale>
      <Txt x={1300} y={670} txt="núcleos en herradura: Langhans" t={22} p={p('langhans')} />
      <Txt x={1180} y={800} txt="busca encerrar un antígeno que no puede eliminar" t={22} p={p('encerrar')} />
      <Txt x={1180} y={880} txt="…y en el camino, destruye la pared" t={26} color={V.sangre[1]} p={p('destruye')} />
    </g>
  );
};

const Necrotizante: Lamina = ({ p }) => {
  return (
    <g>
      <FotoLente x={460} y={480} R={330} foto="gpa-granuloma" o={clamp(p('gpa') + p('foto'))} />
      <Portaobjetos x={130} y={220} k={0.7} o={tramo(p('gpa'), 0.2, 0.8)} organo="PULMÓN" tincion="H-E" caso="GPA" />
      <Txt x={460} y={95} txt="GPA: granuloma necrotizante" t={28} color={V.turquesa[0]} p={p('gpa')} />
      <Llamada x={40} y={850} a={[460 + (450 - 360) * 0.917, 480 + (260 - 360) * 0.917]} txt="necrosis geográfica" p={p('necrotizante')} t={22} halo />
      <Llamada x={40} y={892} a={[460 + (520 - 360) * 0.917, 480 + (470 - 360) * 0.917]} txt="restos basófilos" p={p('basofilos')} t={22} halo />
      <Llamada x={40} y={934} a={[460 + (330 - 360) * 0.917, 480 + (300 - 360) * 0.917]} txt="histiocitos en empalizada" p={p('empalizada')} t={22} halo />
      <Txt x={700} y={925} txt="dentro o fuera del vaso" t={22} p={p('dentro')} fuerte={false} />
      <FotoLente x={1200} y={480} R={260} foto="gepa-eosinofilos" o={tramo(p('gpa'), 0.15, 1)} />
      <Portaobjetos x={1490} y={250} k={0.7} o={tramo(p('gpa'), 0.4, 1)} organo="BIOPSIA" tincion="H-E" caso="GEPA" />
      <Llamada x={960} y={150} a={[1200 + (325 - 360) * 0.722, 480 + (370 - 360) * 0.722]} txt="eosinófilos: gránulos rojos" p={tramo(p('gepa'), 0.3, 1)} t={22} halo />
      <Txt x={1200} y={840} txt="GEPA: ricos en eosinófilos" t={26} color={V.ambar[0]} p={p('gepa')} />
      <Txt x={1200} y={895} txt="suelen ser extravasculares" t={22} p={p('extravascular')} />
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
      <Sale p={p('diagnostico')} x={1330} y={880} k={0.42}><Rinon /></Sale>
      <Sale p={tramo(p('diagnostico'), 0.2, 1)} x={1480} y={880} k={0.28}><Pulmones /></Sale>
      <Txt x={980} y={880} txt="…el riñón o el pulmón dan el diagnóstico" t={24} p={p('diagnostico')} />
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
      <Txt x={240} y={660} txt="la lesión vascular coexiste con inflamación eosinofílica" t={26} color={V.verde[0]} p={p('coexiste')} ancla="start" />
      <Txt x={240} y={760} txt="el resto lo dicen:" t={24} p={p('resto')} ancla="start" fuerte={false} />
      <Pista x={420} y={860} p={p('resto')} nombre="inmunofluorescencia" dy={80}><circle r={56} fill="#0E1F14" /><Glomerulo brillo="granular" k={0.18} /></Pista>
      <Pista x={720} y={860} p={tramo(p('resto'), 0.2, 1)} nombre="ANCA" dy={80}><Anca k={2.2} y={-30} /></Pista>
      <Pista x={1000} y={860} p={tramo(p('resto'), 0.4, 1)} nombre="la clínica" dy={80}><Estetoscopio /></Pista>
    </g>
  );
};

const LAMINAS: Lamina[] = [DosPatrones, Fibrinoide, Leucocitoclastica, Destinos, Granulomatoso, Necrotizante, DosSitios, Prueba, Respuesta];
export default LAMINAS;
