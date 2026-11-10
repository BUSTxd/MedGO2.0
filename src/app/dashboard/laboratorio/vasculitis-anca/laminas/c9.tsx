'use client';
// Capítulo 9 · Nariz, pulmón y riñón: el síndrome pulmón-riñón y el cierre de los dos casos.

import type { Lamina } from '../Lienzo';
import { TuboOrina } from '../../citopenias-autoinmunes/Piezas';
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

const Radiografia: Lamina = ({ p }) => {
  const li = p('licua'), cav = p('cavidad');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿Qué muestra la radiografía y cómo explica la hemoptisis?" color={V.ambar[0]} p={p('pregunta')} t={26} punta="no" />
      <Sale p={p('nodulos')} x={440} y={520} k={1}>
        <rect x={-330} y={-360} width={660} height={720} rx={30} fill="#15141C" />
        {[-1, 1].map((sx) => <path key={sx} d={`M${sx * 30},-300 C${sx * 260},-300 ${sx * 300},100 ${sx * 280},300 L${sx * 40},300 Z`} fill="#3A3A48" />)}
        {Array.from({ length: 6 }, (_, i) => [-1, 1].map((sx) => <path key={`${i}${sx}`} d={`M${sx * 20},${-250 + i * 85} Q${sx * 200},${-290 + i * 85} ${sx * 290},${-200 + i * 85}`} fill="none" stroke="#6E6E80" strokeWidth={10} opacity={0.6} />))}
        <rect x={-20} y={-340} width={40} height={680} fill="#6E6E80" opacity={0.5} />
        <circle cx={160} cy={-220} r={34} fill="#D8D8E4" opacity={tramo(p('clavicula'), 0, 0.5)} />
        <circle cx={-80} cy={-20} r={24} fill="#C8C8D6" opacity={tramo(p('hilios'), 0, 0.5)} /><circle cx={80} cy={10} r={22} fill="#C8C8D6" opacity={tramo(p('hilios'), 0, 0.5)} />
      </Sale>
      <Txt x={440} y={920} txt="nódulo bajo la clavícula izquierda; opacidades hiliares" t={22} p={p('hilios')} />
      <Sale p={p('granulomas')} x={1050} y={330} k={0.5}><Granuloma necrosis={1} /></Sale>
      <Flecha a={[1210, 330]} b={[1290, 330]} p={li} color={FLECHA} w={7} />
      <Sale p={li} x={1420} y={330} k={0.5}>
        <circle r={150} fill="#7D6FF0" /><circle r={110 * cav} fill="var(--vas-fondo-a)" />
        <rect x={-20} y={100} width={40} height={140 * cav} fill="var(--vas-fondo-a)" />
      </Sale>
      <Txt x={1230} y={470} txt="el centro se licúa, drena por un bronquio: cavidad" t={22} p={cav} />
      <Txt x={1230} y={590} txt="la sangre llega por dos caminos:" t={26} p={p('caminos')} />
      <Txt x={1050} y={680} txt="1 · un granuloma erosiona un vaso" t={22} p={p('caminos')} />
      <Txt x={1050} y={730} txt="2 · capilaritis" t={22} p={tramo(p('caminos'), 0.3, 1)} />
      <Txt x={1230} y={880} txt="la cavitación se confirma con tomografía" t={22} color="#2F6FD8" p={p('tomografia')} />
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

const AntiMbg: Lamina = ({ p }) => {
  return (
    <g>
      <Txt x={800} y={70} txt="¿por qué no siempre sangran los dos órganos?" t={28} p={p('mbg')} />
      <Txt x={400} y={190} txt="glomérulo: endotelio fenestrado" t={26} p={p('fenestrado')} />
      <Capilar x={400} y={420} fenestrado igg={p('llega')} />
      <Txt x={400} y={620} txt="el anticuerpo llega al colágeno IV" t={22} p={p('llega')} />
      <Txt x={1200} y={190} txt="alvéolo: mismo colágeno IV, escondido" t={26} p={p('escondido')} />
      <Capilar x={1200} y={420} fenestrado={false} igg={clamp(p('alveolar') + p('sangra'))} dano={p('tabaco')} />
      <Sale p={p('tabaco')} x={1200} y={700} k={1}>
        <rect x={-120} y={-14} width={200} height={28} rx={6} fill="#F2F2F2" /><rect x={80} y={-14} width={50} height={28} rx={6} fill="#E3A15C" />
        <circle cx={-130} cy={0} r={10} fill="#FF7A1A" />
      </Sale>
      <Txt x={1200} y={780} txt="tabaco, infección o un inhalante lo lesionan" t={22} p={p('tabaco')} />
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
