'use client';
// Capítulo 5 · Vasos medianos y pequeños: PAN, Kawasaki, GPA, GEPA, PAM y crioglobulinemia.

import type { Lamina } from '../Lienzo';
import { Pastilla, Termometro } from '../../citopenias-autoinmunes/Piezas';
import { Cruz, Lente, Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Alveolos, Anca, Bandera, Bola, Complejo, Corazon, Cuerpo, En, Eosinofilo, Flecha, FLECHA, Glomerulo, Granuloma, Hematie, IgG, LineaTiempo, Linfocito, Nervio, Neutrofilo, Pantalla, PiernaPurpura, Plasmatica, Pulmones, Punto, Rinon, Sale, Txt, TxtPantalla, V, blob, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Arteria mediana de lado, con microaneurismas en rosario. */
function Arteria({ x = 0, y = 0, w = 900, an = 0, nec = 0, o = 1 }: { x?: number; y?: number; w?: number; an?: number; nec?: number; o?: number }) {
  return (
    <En x={x} y={y} o={o}>
      <rect x={-w / 2} y={-40} width={w} height={80} rx={40} fill={V.pared[2]} />
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill={V.sangre[1]} />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-w / 2 + 120 + i * ((w - 240) / 4)} cy={0} rx={30 + 30 * an * (0.6 + hash(i, 2) * 0.5)} ry={24 + 32 * an * (0.6 + hash(i, 2) * 0.5)} fill={V.sangre[1]} stroke={V.pared[2]} strokeWidth={14} opacity={an > 0.01 ? 1 : 0} />)}
      {nec > 0.01 && [1, 3].map((i) => <rect key={i} x={-w / 2 + 80 + i * ((w - 240) / 4)} y={-46} width={80} height={92} rx={20} fill="#FF4F9A" opacity={0.85 * nec} />)}
    </En>
  );
}

/** Pictograma de persona (referencia «varias personas paradas»). */
function Persona({ x, y, k = 1, color, o = 1 }: { x: number; y: number; k?: number; color: string; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cy={-70} r={26} fill={color} />
      <path d="M-34,-36 Q0,-46 34,-36 L40,40 L22,40 L18,90 L-18,90 L-22,40 L-40,40 Z" fill={color} />
    </En>
  );
}

/** Neutrófilo en inmunofluorescencia: c-ANCA (granular en el citoplasma) o p-ANCA (alrededor del núcleo). */
function NeutroIF({ x, y, tipo, p }: { x: number; y: number; tipo: 'c' | 'p'; p: number }) {
  if (p <= 0.01) return null;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.4)}>
      <circle r={110} fill="#0A1A0E" />
      {tipo === 'c'
        ? Array.from({ length: 70 }, (_, i) => { const a = hash(i, 3) * Math.PI * 2, d = 30 + hash(i, 4) * 70; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={4 + hash(i, 5) * 3} fill={V.verde[1]} opacity={0.6 + 0.4 * hash(i, 6)} />; })
        : <>
            <path d="M-34,-20 C-44,-46 -16,-56 -6,-40 C4,-56 34,-50 28,-26 C48,-20 44,8 26,10 C30,32 6,40 -4,24 C-18,36 -46,26 -34,6 C-50,0 -46,-20 -34,-20 Z" fill="none" stroke={V.verde[1]} strokeWidth={14} strokeLinejoin="round" />
            <path d="M-34,-20 C-44,-46 -16,-56 -6,-40 C4,-56 34,-50 28,-26 C48,-20 44,8 26,10 C30,32 6,40 -4,24 C-18,36 -46,26 -34,6 C-50,0 -46,-20 -34,-20 Z" fill="#1E3A22" />
          </>}
    </En>
  );
}

const Grandes: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('grandes')} x={440} y={460} k={1}>
        <path d="M-60,300 L-60,0 C-60,-160 160,-160 160,0 L160,300" fill="none" stroke={V.pared[2]} strokeWidth={110} strokeLinecap="round" opacity={0.45} />
        <path d="M-60,300 L-60,0 C-60,-160 160,-160 160,0 L160,300" fill="none" stroke={V.sangre[1]} strokeWidth={70} strokeLinecap="round" opacity={0.45} />
        {[-10, 50, 110].map((x) => <rect key={x} x={x - 14} y={-230} width={28} height={110} rx={14} fill={V.sangre[1]} opacity={0.45} />)}
      </Sale>
      <Bandera x={440} y={120} txt="Vasos grandes: la aorta y sus ramas" color={V.sangre[0]} p={p('grandes')} t={26} />
      <Txt x={440} y={820} txt="arteritis de células gigantes · Takayasu" t={26} p={p('granulomatosas')} />
      <Bandera x={440} y={900} txt="En el siguiente laboratorio" color="#8A4FE0" p={p('siguiente')} t={26} />
      <Arteria x={1150} y={380} w={600} o={tramo(p('aqui'), 0, 0.4)} />
      <Bandera x={1150} y={270} txt="Aquí: vasos medianos…" color={V.sangre[1]} p={p('aqui')} t={28} />
      {[0, 1, 2].map((k) => <path key={k} d={`M900,${620 + k * 60} C1100,${620 + k * 60} 1200,${600 + k * 70} 1450,${590 + k * 90}`} fill="none" stroke={V.sangre[2]} strokeWidth={12} strokeLinecap="round" opacity={tramo(p('pequenos'), k * 0.15, 0.5 + k * 0.15)} />)}
      <Bandera x={1150} y={880} txt="…y sobre todo, pequeños" color="#E0338A" p={p('pequenos')} t={28} />
    </g>
  );
};

const Pan: Lamina = ({ p }) => {
  const organos: [string, number, string][] = [['rinon', 300, 'riñón'], ['intestino', 560, 'intestino'], ['nervio', 820, 'nervio'], ['piel', 1080, 'piel']];
  return (
    <g>
      <Bandera x={800} y={70} txt="Vaso mediano: poliarteritis nodosa" color={V.sangre[1]} p={p('pan')} t={30} punta="no" />
      <Arteria x={800} y={230} w={1100} nec={p('segmentaria')} an={p('aneurismas')} />
      <Txt x={800} y={330} txt="necrosis segmentaria de toda la pared" t={24} p={p('segmentaria')} />
      {organos.map(([n, x, txt], i) => (
        <g key={n} opacity={tramo(p('organos'), i * 0.15, 0.4 + i * 0.15)}>
          <Bola x={x} y={480} R={60} tono={[V.rinon, V.pulmon, ['#C99300', '#F2C230', '#FFE27A'], V.piel][i]} />
          <Txt x={x} y={570} txt={txt} t={24} />
        </g>
      ))}
      <Sale p={p('respeta')} x={1330} y={460} k={0.3}><Pulmones /></Sale>
      <Sale p={p('respeta')} x={1470} y={470} k={0.2}><Glomerulo /></Sale>
      <Txt x={1400} y={570} txt="respeta pulmón y glomérulo" t={22} p={p('respeta')} />
      <Txt x={420} y={390} txt="microaneurismas en rosario" t={24} p={p('aneurismas')} fuerte={false} />
      <Bandera x={330} y={700} txt="Menos flujo renal → renina → HTA" color={V.rinon[1]} p={p('renina')} t={24} />
      <Bandera x={330} y={790} txt="Lesiones de distintas edades" color={V.violeta[0]} p={p('edades')} t={24} />
      <Bandera x={1180} y={700} txt="Hepatitis B" color={V.ambar[0]} p={p('vhb')} t={26} />
      <Bandera x={1180} y={790} txt="Sin ANCA" color="var(--cit-base)" p={p('sinanca')} t={26} />
      <Anca x={1380} y={790} k={1.2} o={tramo(p('sinanca'), 0, 0.4)} />
      <Cruz x={1385} y={810} k={0.8} p={p('sinanca')} />
    </g>
  );
};

/** Cara de un niño pequeño. */
function Nino({ x = 0, y = 0, k = 1, rojo = 0 }: { x?: number; y?: number; k?: number; rojo?: number }) {
  return (
    <En x={x} y={y} k={k}>
      <path d="M-150,230 C-150,150 -90,120 -40,114 L40,114 C90,120 150,150 150,230 Z" fill="#F5A54A" />
      <circle r={120} fill="#E9A58A" />
      <path d="M-120,-20 C-130,-120 -40,-150 0,-150 C60,-150 130,-110 120,-20 C100,-70 60,-90 20,-96 C-20,-70 -80,-60 -120,-20 Z" fill="#7A3B1E" />
      {[-44, 44].map((cx) => <g key={cx}><circle cx={cx} cy={-4} r={18} fill={rojo > 0.5 ? '#FF6B6B' : '#FFF'} /><circle cx={cx} cy={-4} r={9} fill="#3A1342" /></g>)}
      <path d="M-30,56 Q0,76 30,56" fill="none" stroke="#C2303F" strokeWidth={10} strokeLinecap="round" />
      <circle cx={-70} cy={34} r={16} fill="#F28A8A" opacity={0.6} /><circle cx={70} cy={34} r={16} fill="#F28A8A" opacity={0.6} />
    </En>
  );
}

const Kawasaki: Lamina = ({ p }) => {
  const signos: [string, string][] = [['fiebre', 'Fiebre ≥ 5 días'], ['ojos', 'Ojos rojos'], ['labios', 'Labios agrietados'], ['lengua', 'Lengua de fresa'], ['manos', 'Manos hinchadas'], ['ganglio', 'Ganglio cervical']];
  return (
    <g>
      <Bandera x={800} y={70} txt="Vaso mediano: Kawasaki, en menores de 5 años" color={V.ambar[0]} p={p('nino')} t={28} punta="no" />
      <Sale p={p('nino')} x={330} y={430} k={1.1}><Nino rojo={p('ojos')} /></Sale>
      <Sale p={p('fiebre')} x={140} y={300} k={0.4}><Termometro val={0.95} /></Sale>
      {signos.map(([n, txt], i) => <Bandera key={n} x={760} y={220 + i * 80} txt={txt} color={['#D9480F', '#E0338A', '#C2307A', '#E5324C', '#EE6A1F', '#8A4FE0'][i]} p={p(n)} t={24} ancla="izq" punta="izq" />)}
      <Sale p={p('coronario')} x={1300} y={420} k={1.5}>
        <Corazon />
        <path d="M-60,-60 C-40,0 -20,40 10,80" fill="none" stroke="#7A1E3A" strokeWidth={12} strokeLinecap="round" />
        <circle cx={-34} cy={2} r={22 * tramo(p('coronario'), 0.3, 1)} fill="#7A1E3A" />
      </Sale>
      <Bandera x={1300} y={680} txt="Lo que mata: el aneurisma coronario" color={V.sangre[0]} p={p('coronario')} t={24} />
      <Bandera x={1100} y={880} txt="Rápido: inmunoglobulina IV + aspirina" color={V.turquesa[0]} p={p('ivig')} t={26} />
    </g>
  );
};

const Gpa: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={70} txt="Granulomatosis con poliangeítis" color={V.turquesa[0]} p={p('gpa')} t={30} punta="no" />
      <Txt x={800} y={140} txt="vasculitis por neutrófilos + inflamación granulomatosa necrotizante" t={24} p={p('componentes')} />
      <Bandera x={800} y={200} txt="Anti-PR3" color={V.pr3[0]} p={p('pr3')} t={26} punta="no" />
      <Cuerpo x={520} y={600} k={1.05} o={tramo(p('territorios'), 0, 0.4)}>
        <Punto x={22} y={-268} p={p('superior')} />
        <Punto x={-36} y={-120} p={p('pulmon')} />
        <Punto x={44} y={-40} p={p('rinon')} />
      </Cuerpo>
      {([['superior', 330, 'Vía aérea superior', 'sinusitis, costras, epistaxis', 22, -268], ['pulmon', 560, 'Pulmón', 'nódulos que se cavitan, hemoptisis', -36, -120], ['rinon', 790, 'Riñón', 'glomerulonefritis pauciinmune', 44, -40]] as const).map(([n, y, txt, sub, dx, dy]) => (
        <g key={n}>
          <Flecha a={[520 + dx * 1.05, 600 + dy * 1.05]} b={[950, y]} p={p(n)} color={V.sangre[1]} w={5} cabeza={false} />
          <Bandera x={960} y={y} txt={txt} color={V.turquesa[0]} p={p(n)} t={26} ancla="izq" punta="no" />
          <Txt x={970} y={y + 56} txt={sub} t={22} p={p(n)} ancla="start" fuerte={false} />
        </g>
      ))}
    </g>
  );
};

/** Vaso pequeño en corte H-E con necrosis fibrinoide y neutrófilos. */
function VasoFibrinoide({ x, y, k = 1, o = 1, eos = 0 }: { x: number; y: number; k?: number; o?: number; eos?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle r={110} fill="#E58FBE" /><circle r={84} fill="#FF4F9A" /><circle r={52} fill="#F8E6EF" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, d = 96 + hash(i, 2) * 50; return eos > 0.5 ? <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={13} fill={V.eos[1]} /> : <g key={i}><circle cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={8} fill="#5A2A9E" /><circle cx={Math.cos(a) * d + 8} cy={Math.sin(a) * d + 3} r={7} fill="#5A2A9E" /></g>; })}
    </En>
  );
}

const BiopsiaGpa: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={70} txt="Biopsia de pulmón: los dos componentes juntos" color="var(--cit-base)" p={p('biopsia')} t={28} punta="no" />
      <Lente x={800} y={520} R={380} id="c5-gpa" o={tramo(p('biopsia'), 0, 0.4)}>
        <rect x={-400} y={-400} width={800} height={800} fill="#F6D6E6" />
        <Granuloma x={-110} y={0} k={0.95} p={p('granuloma')} necrosis={p('granuloma')} />
        <VasoFibrinoide x={220} y={-40} k={0.95} o={tramo(p('vaso'), 0, 0.4)} />
      </Lente>
      <Bandera x={250} y={260} txt="Granuloma necrotizante" color={V.violeta[0]} p={p('granuloma')} t={24} />
      <Txt x={250} y={320} txt="empalizada de epitelioides" t={22} p={p('empalizada')} />
      <Txt x={250} y={360} txt="y células gigantes" t={22} p={p('gigantes')} />
      <Bandera x={1340} y={300} txt="Vaso con necrosis fibrinoide" color="#E0338A" p={p('fibrinoide')} t={22} />
      <Txt x={1340} y={360} txt="infiltrado de neutrófilos" t={22} p={p('neutros')} />
      <Bandera x={800} y={950} txt="Granuloma + vasculitis: su firma" color={V.turquesa[0]} p={p('firma')} t={28} />
    </g>
  );
};

const Gepa: Lamina = ({ p }) => {
  const terr: [string, number, string, string, number, number][] = [['superior', 290, 'Vía aérea superior', 'rinosinusitis y pólipos', 22, -268], ['pulmon', 470, 'Pulmón', 'asma, sibilancias, infiltrados', -36, -120], ['piel', 650, 'Piel', 'púrpura palpable', -60, 260], ['corazon', 830, 'Corazón', 'miocarditis eosinofílica', 20, -150]];
  return (
    <g>
      <Bandera x={800} y={70} txt="Granulomatosis eosinofílica con poliangeítis" color={V.ambar[0]} p={p('gepa')} t={28} punta="no" />
      <Txt x={800} y={140} txt="inflamación tipo 2 + vasculitis necrotizante" t={24} p={p('componentes')} />
      <Bandera x={560} y={200} txt="Anti-MPO" color={V.mpo[0]} p={p('mpo')} t={24} punta="no" />
      <Bandera x={1040} y={200} txt="Pista: asma + eosinofilia" color={V.eos[0]} p={p('pista')} t={24} punta="no" />
      <Cuerpo x={430} y={620} k={0.95} o={tramo(p('superior'), 0, 0.4)}>
        {terr.map(([n, , , , dx, dy]) => <Punto key={n} x={dx} y={dy} p={p(n)} />)}
      </Cuerpo>
      {terr.map(([n, y, txt, sub, dx, dy]) => (
        <g key={n}>
          <Flecha a={[430 + dx * 0.95, 620 + dy * 0.95]} b={[840, y]} p={p(n)} color={V.sangre[1]} w={5} cabeza={false} />
          <Bandera x={850} y={y} txt={txt} color={V.ambar[0]} p={p(n)} t={24} ancla="izq" punta="no" />
          <Txt x={860} y={y + 50} txt={sub} t={21} p={p(n)} ancla="start" fuerte={false} />
        </g>
      ))}
    </g>
  );
};

const BiopsiaGepa: Lamina = ({ p }) => {
  const f = p('fases');
  return (
    <g>
      <Lente x={360} y={380} R={250} id="c5-gepa" o={tramo(p('biopsia'), 0, 0.4)}>
        <rect x={-300} y={-300} width={600} height={600} fill="#F6D6E6" />
        <VasoFibrinoide x={0} y={0} k={1.1} eos={1} />
        {Array.from({ length: 10 }, (_, i) => <Eosinofilo key={i} x={(hash(i, 4) - 0.5) * 420} y={(hash(i, 5) - 0.5) * 420} k={0.4} o={tramo(p('eos'), i / 14, i / 14 + 0.3)} />)}
      </Lente>
      <Bandera x={900} y={230} txt="Vaso con necrosis fibrinoide y eosinófilos" color={V.eos[0]} p={p('eos')} t={24} ancla="izq" punta="izq" />
      <Txt x={920} y={300} txt="también en pulmón y miocardio" t={22} p={p('eos')} ancla="start" fuerte={false} />
      <Txt x={920} y={370} txt="granulomas, si los hay, fuera del vaso" t={22} p={p('extravascular')} ancla="start" />
      <LineaTiempo x={800} y={800} w={1300} p={f} tramos={[{ txt: 'Alérgica', color: '#2F6FD8', p: p('alergica') }, { txt: 'Eosinofílica', color: V.eos[0], p: p('eosinofilica') }, { txt: 'Vasculítica', color: V.sangre[0], p: p('vasculitica') }]} />
      <Txt x={150 + 217} y={880} txt="asma del adulto, pólipos" t={20} p={p('alergica')} />
      <Txt x={800} y={880} txt="eosinófilos en sangre y tejidos" t={20} p={p('eosinofilica')} />
      <Txt x={1450 - 217} y={880} txt="púrpura, mononeuritis, miocarditis" t={20} p={p('vasculitica')} />
      <Txt x={800} y={950} txt="tres fases que se superponen" t={24} p={f} fuerte={false} />
    </g>
  );
};

const DosGrupos: Lamina = ({ p }) => {
  const sep = p('genes');
  return (
    <g>
      <Bandera x={800} y={70} txt="Solo unos 4 de cada 10 tienen ANCA" color={V.anca[1]} p={p('cuatro')} t={30} punta="no" />
      {Array.from({ length: 10 }, (_, i) => {
        const pos = i < 4;
        const x0 = 260 + i * 120, x1 = pos ? 260 + i * 120 : 940 + (i - 4) * 100;
        return <Persona key={i} x={lerp(x0, pos ? 220 + i * 110 : x1, easeOut(sep))} y={lerp(300, 430, easeOut(sep))} k={0.9} color={pos ? V.anca[1] : '#8E86A8'} o={tramo(p('cuatro'), i * 0.04, 0.3 + i * 0.04)} />;
      })}
      <Bandera x={380} y={600} txt="Anti-MPO positivos · HLA-DQ" color={V.anca[0]} p={p('mpo')} t={24} />
      <Txt x={380} y={680} txt="más vasculitis:" t={24} p={p('vasculitis')} />
      <Txt x={380} y={730} txt="púrpura, glomerulonefritis, neuropatía" t={22} p={p('vasculitis')} fuerte={false} />
      <Bandera x={1200} y={600} txt="ANCA negativos · IL-5 y barrera" color="#6E6A86" p={p('negativos')} t={24} />
      <Txt x={1200} y={680} txt="más corazón y pulmón" t={24} p={p('corazon')} />
      <Bandera x={800} y={900} txt="Casi dos enfermedades en una" color="var(--cit-base)" p={p('dos')} t={30} />
    </g>
  );
};

const Pam: Lamina = ({ p }) => {
  const terr: [string, number, string, string, number, number][] = [['rinon', 330, 'Riñón', 'glomerulonefritis pauciinmune', 44, -40], ['pulmon', 500, 'Pulmón', 'capilaritis y hemorragia alveolar', -36, -120], ['piel', 670, 'Piel', 'púrpura palpable', -60, 260], ['nervios', 840, 'Nervios periféricos', 'mononeuritis', 70, 150]];
  return (
    <g>
      <Bandera x={800} y={70} txt="Poliangeítis microscópica: la vasculitis necrotizante pura" color="#B8237A" p={p('pam')} t={28} punta="no" />
      {([['granulomas', 'granulomas'], ['asma', 'asma'], ['eos', 'eosinófilos']] as const).map(([n, txt], i) => (
        <g key={n}><Cruz x={260 + i * 260} y={160} k={0.45} p={tramo(p('sin'), i * 0.15, 0.5 + i * 0.15)} /><Txt x={295 + i * 260} y={160} txt={`sin ${txt}`} t={24} p={tramo(p('sin'), i * 0.15, 0.5 + i * 0.15)} ancla="start" /></g>
      ))}
      <Bandera x={1300} y={160} txt="Anti-MPO" color={V.mpo[0]} p={p('mpo')} t={24} punta="no" />
      <Cuerpo x={430} y={640} k={0.95} o={tramo(p('rinon'), 0, 0.4)}>
        {terr.map(([n, , , , dx, dy]) => <Punto key={n} x={dx} y={dy} p={p(n)} />)}
      </Cuerpo>
      {terr.map(([n, y, txt, sub, dx, dy]) => (
        <g key={n}>
          <Flecha a={[430 + dx * 0.95, 640 + dy * 0.95]} b={[840, y]} p={p(n)} color={V.sangre[1]} w={5} cabeza={false} />
          <Bandera x={850} y={y} txt={txt} color="#B8237A" p={p(n)} t={24} ancla="izq" punta="no" />
          <Txt x={860} y={y + 50} txt={sub} t={21} p={p(n)} ancla="start" fuerte={false} />
        </g>
      ))}
    </g>
  );
};

const Mononeuritis: Lamina = ({ p }) => {
  const ci = p('cierra');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿Por qué los nervios?" color="var(--cit-base)" p={p('nervios')} t={30} punta="no" />
      <Nervio x={800} y={300} w={1100} isquemia={ci} o={tramo(p('nervios'), 0, 0.4)} />
      <Bandera x={420} y={170} txt="Vasa nervorum" color={V.sangre[0]} p={p('vasa')} t={24} />
      <Txt x={1100} y={420} txt="la vasculitis los cierra: el nervio se queda sin sangre" t={24} p={ci} />
      <Sale p={p('cae')} x={420} y={620} k={1}>
        <path d="M-120,-20 L60,-20 Q100,-20 100,20 L100,40 Q100,60 80,60 L-120,60 Z" fill={V.piel[1]} transform={`rotate(${lerp(0, 35, p('cae'))} -120 20)`} />
        <rect x={-180} y={-60} width={70} height={140} rx={24} fill={V.piel[0]} />
      </Sale>
      <Txt x={420} y={800} txt="un pie que cae de repente" t={24} p={p('cae')} />
      <Nervio x={1150} y={620} w={500} k={0.8} isquemia={tramo(p('otro'), 0, 1)} o={tramo(p('otro'), 0, 0.4)} />
      <Txt x={1150} y={720} txt="y luego otro nervio, en otro lugar" t={24} p={p('otro')} />
      <Bandera x={800} y={850} txt="Mononeuritis múltiple" color={V.ambar[0]} p={p('mononeuritis')} t={30} />
      <Txt x={800} y={930} txt="biopsia: necrosis fibrinoide, neutrófilos, sin granulomas" t={24} p={p('biopsia')} fuerte={false} />
    </g>
  );
};

const Crio: Lamina = ({ p, reloj }) => {
  const fr = p('frio');
  return (
    <g>
      <Txt x={800} y={70} txt="las de inmunocomplejos tendrán su propio laboratorio" t={26} p={p('propio')} fuerte={false} />
      <Bandera x={800} y={140} txt="Aquí, solo una: la crioglobulinémica" color="#2F6FD8" p={p('crio')} t={28} punta="no" />
      <Sale p={p('vhc')} x={200} y={420} k={1.2}><path d={blob(10, 50, 0.25, 7)} fill={V.ambar[0]} /><path d={blob(10, 42, 0.25, 7)} fill={V.ambar[1]} /></Sale>
      <Txt x={200} y={520} txt="hepatitis C" t={24} p={p('vhc')} />
      <Flecha a={[270, 420]} b={[400, 420]} p={p('linfob')} color={FLECHA} w={7} />
      <Sale p={p('linfob')} x={480} y={420} k={1}><Linfocito tono="b" /></Sale>
      <Txt x={480} y={520} txt="linfocitos B sin descanso" t={22} p={p('linfob')} />
      <Sale p={p('igm')} x={760} y={420} k={1.6}>
        <IgG tono={['#07808F', '#10BCC4', '#6DEBE2']} r={0} />
        <IgG y={60} r={180} k={0.9} />
      </Sale>
      <Txt x={760} y={560} txt="IgM contra IgG" t={24} p={p('igm')} />
      <En x={1080} y={420} o={tramo(fr, 0, 0.4)}>
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d="M0,-26 L0,26 M-22,-13 L22,13 M-22,13 L22,-13" stroke="#7FD3EA" strokeWidth={6} strokeLinecap="round" transform={`translate(${(i % 3) * 60 - 60},${Math.floor(i / 3) * 60 - 30}) rotate(${reloj * 0.01})`} />)}
      </En>
      <Txt x={1080} y={520} txt="precipitan con el frío" t={22} p={fr} />
      <Sale p={p('piernas')} x={1380} y={560} k={0.85}><PiernaPurpura p={p('piernas')} /></Sale>
      {[0, 1, 2].map((i) => <Complejo key={i} x={1380 + (i - 1) * 50} y={420} k={0.8} o={tramo(p('piernas'), i * 0.15, 0.5)} />)}
      <Bandera x={600} y={800} txt="Consumen el complemento: C4 bajo" color={V.ambar[0]} p={p('c4')} t={28} />
    </g>
  );
};

const AncaLab: Lamina = ({ p }) => {
  return (
    <g>
      <Pantalla x={800} y={520} w={1400} h={820} p={p('detalle')}>
        <TxtPantalla x={0} y={-320} txt="Inmunofluorescencia en neutrófilos fijados con etanol" t={30} p={p('etanol')} />
        <NeutroIF x={-330} y={-40} tipo="c" p={p('pr3')} />
        <TxtPantalla x={-330} y={110} txt="PR3: se queda en los gránulos" t={24} p={p('pr3')} />
        <TxtPantalla x={-330} y={170} txt="c-ANCA · granular citoplasmático" t={30} p={p('canca')} />
        <NeutroIF x={330} y={-40} tipo="p" p={p('mpo')} />
        <TxtPantalla x={330} y={110} txt="MPO: carga +, se corre al núcleo" t={24} p={p('mpo')} />
        <TxtPantalla x={330} y={170} txt="p-ANCA · perinuclear" t={30} p={p('panca')} />
        <TxtPantalla x={0} y={290} txt="después se confirma midiendo cada anticuerpo" t={26} p={p('confirma')} />
      </Pantalla>
    </g>
  );
};

/** Ficha de una enfermedad: banderita con sus pistas debajo. */
function Ficha({ x, nombre, color, pistas, ps, final }: { x: number; nombre: string; color: string; pistas: string[]; ps: number[]; final: number }) {
  return (
    <g>
      {pistas.map((t, i) => <Bandera key={t} x={x} y={200 + i * 90} txt={t} color={color} p={ps[i]} t={22} punta="no" />)}
      <Flecha a={[x, 200 + pistas.length * 90 - 30]} b={[x, 200 + pistas.length * 90 + 40]} p={final} color={FLECHA} w={7} />
      <Bandera x={x} y={200 + pistas.length * 90 + 110} txt={nombre} color="var(--cit-base)" p={final} t={26} punta="no" />
    </g>
  );
}

const Junta: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Ahora, junta las piezas" color="var(--cit-base)" p={p('junta')} t={30} punta="no" />
      <Ficha x={420} color={V.ambar[0]} nombre="GEPA" pistas={['Asma de inicio adulto', 'Eosinofilia marcada', 'Infiltrados pulmonares', 'Vasculitis']} ps={[p('asma'), p('eos'), p('infiltrados'), p('vasculitis')]} final={p('gepa')} />
      <Ficha x={1180} color="#B8237A" nombre="PAM" pistas={['Glomerulonefritis pauciinmune', 'Hemorragia alveolar', 'Anti-MPO', 'Sin asma ni granulomas']} ps={[p('gn'), p('hemorragia'), p('mpo'), p('sinasma')]} final={p('pam')} />
    </g>
  );
};

const JuntaGpa: Lamina = ({ p }) => {
  return (
    <g>
      <Ficha x={420} color={V.turquesa[0]} nombre="GPA" pistas={['Sinusitis crónica', 'Nódulos pulmonares cavitados', 'Glomerulonefritis pauciinmune', 'Anti-PR3']} ps={[p('sinusitis'), p('nodulos'), p('gn'), p('pr3')]} final={p('gpa')} />
      <Bandera x={1160} y={260} txt="Una trampa frecuente" color={V.sangre[0]} p={p('trampa')} t={28} />
      <Sale p={p('trampa')} x={1160} y={500} k={0.6}><Glomerulo semiluna={0.8} /></Sale>
      <Txt x={1160} y={700} txt="la glomerulonefritis pauciinmune" t={24} p={p('trampa')} />
      <Txt x={1160} y={740} txt="no es exclusiva de una sola" t={24} p={p('trampa')} />
      <Bandera x={1020} y={840} txt="GPA" color={V.turquesa[0]} p={p('ambas')} t={26} punta="no" />
      <Bandera x={1300} y={840} txt="PAM" color="#B8237A" p={p('ambas')} t={26} punta="no" />
    </g>
  );
};

const Tabla: Lamina = ({ p }) => {
  const filas: [string, string, (0 | 1 | 2)[]][] = [['pequeno', 'Vaso pequeño', [1, 1, 1]], ['neutros', 'Neutrófilos', [1, 2, 1]], ['eos', 'Eosinófilos y asma', [0, 1, 0]], ['granulomas', 'Granulomas', [1, 2, 0]]];
  const cols = [['GPA', V.turquesa[0]], ['GEPA', V.ambar[0]], ['PAM', '#B8237A']] as const;
  return (
    <g>
      <Bandera x={800} y={70} txt="Otra forma de ordenarlas" color="var(--cit-base)" p={p('otra')} t={30} punta="no" />
      {cols.map(([t, c], j) => <Bandera key={t} x={820 + j * 260} y={170} txt={t} color={c} p={p('otra')} t={28} punta="no" />)}
      {filas.map(([n, txt, val], i) => (
        <g key={n}>
          <Txt x={560} y={270 + i * 110} txt={txt} t={26} p={p(n)} ancla="end" />
          {val.map((v, j) => v === 1 ? <Visto key={j} x={820 + j * 260} y={270 + i * 110} k={0.8} p={tramo(p(n), j * 0.2, 0.5 + j * 0.2)} /> : v === 2 ? <Txt key={j} x={820 + j * 260} y={270 + i * 110} txt="a veces" t={22} p={tramo(p(n), j * 0.2, 0.5 + j * 0.2)} fuerte={false} /> : <Cruz key={j} x={820 + j * 260} y={270 + i * 110} k={0.6} p={tramo(p(n), j * 0.2, 0.5 + j * 0.2)} />)}
        </g>
      ))}
      <Txt x={560} y={750} txt="El pulmón" t={26} p={p('pulmon')} ancla="end" />
      {[['nódulos', 'cavidades'], ['asma', 'infiltrados'], ['capilaritis', 'hemorragia']].map(([a, b], j) => (
        <g key={a}>
          <Txt x={820 + j * 260} y={735} txt={a} t={22} p={tramo(p('pulmon'), j * 0.25, 0.5 + j * 0.25)} />
          <Txt x={820 + j * 260} y={770} txt={b} t={22} p={tramo(p('pulmon'), j * 0.25, 0.5 + j * 0.25)} />
        </g>
      ))}
      <Sale p={p('pulmon')} x={820} y={880} k={0.25}><Granuloma necrosis={1} /></Sale>
      <Sale p={tramo(p('pulmon'), 0.25, 1)} x={1080} y={880} k={0.4}><Eosinofilo /></Sale>
      <Sale p={tramo(p('pulmon'), 0.5, 1)} x={1340} y={880} k={0.18}><Alveolos sangre={1} /></Sale>
    </g>
  );
};

const LAMINAS: Lamina[] = [Grandes, Pan, Kawasaki, Gpa, BiopsiaGpa, Gepa, BiopsiaGepa, DosGrupos, Pam, Mononeuritis, Crio, AncaLab, Junta, JuntaGpa, Tabla];
export default LAMINAS;
