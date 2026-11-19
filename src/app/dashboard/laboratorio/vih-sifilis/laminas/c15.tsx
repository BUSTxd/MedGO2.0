'use client';
// Capítulo 15 · Treponema pallidum (desde aquí, la paleta de la sífilis: menta y verde azulado)

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, BolsaSangre, Bola, Cruz, Espiga, Flecha, IgG, Persona, Reloj, Sale, Treponema, Txt, TXV, easeOut, hash, lerp, tramo, P } from '../Piezas';

/** Campo de microscopio: centro crema y borde oscuro, como el de la referencia «E. coli bajo microscopio». */
function Campo({ x, y, R, children, o = 1 }: { x: number; y: number; R: number; children?: ReactNode; o?: number }) {
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={R + 40} fill="#3A1A6A" /><circle cx={x} cy={y} r={R + 14} fill="#6A4A8A" /><circle cx={x} cy={y} r={R} fill="#FFF3C0" />
      {children}
    </g>
  );
}

/** Un corte de la envoltura: membrana externa y membrana interna, con el periplasma entre ambas. */
function Envoltura({ x, y, w, lps = false, o = 1 }: { x: number; y: number; w: number; lps?: boolean; o?: number }) {
  return (
    <g opacity={o} transform={`translate(${x},${y})`}>
      <rect x={0} y={0} width={w} height={34} rx={17} fill={P.esp[0]} /><rect x={0} y={0} width={w} height={26} rx={13} fill={P.esp[1]} />
      <rect x={0} y={96} width={w} height={34} rx={17} fill={P.hla[0]} /><rect x={0} y={96} width={w} height={26} rx={13} fill={P.hla[1]} />
      {Array.from({ length: Math.floor(w / 46) }, (_, i) => <circle key={i} cx={22 + i * 46} cy={16} r={11} fill={P.esp[2]} />)}
      {lps && Array.from({ length: Math.floor(w / 46) }, (_, i) => <path key={i} d={`M${22 + i * 46},-4 L${22 + i * 46 - 10},-38 M${22 + i * 46},-4 L${22 + i * 46 + 10},-38`} stroke={P.espiga[1]} strokeWidth={6} strokeLinecap="round" fill="none" />)}
    </g>
  );
}

// ─── 0 · Un sacacorchos ──────────────────────────────────────────────────────
const Sacacorchos: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="la bacteria de la sífilis: un sacacorchos" t={40} p={p('sacacorchos')} color={TXV.esp} />
    <Sale p={p('treponema')} x={460} y={330}><Treponema w={760} amp={34} vueltas={7} reloj={reloj} grosor={16} /></Sale>
    <Bandera x={460} y={200} txt="Treponema pallidum" color={P.esp[0]} p={p('treponema')} t={30} punta="abajo" />
    <Txt x={460} y={450} txt="una espiroqueta delgadísima y helicoidal" t={26} p={p('espiroqueta')} />
    <Sale p={p('flagelos')} x={460} y={610}>
      <rect x={-380} y={-44} width={760} height={88} rx={44} fill={P.esp[0]} opacity={0.35} />
      {[-1, 1].map((l) => <path key={l} d={Array.from({ length: 40 }, (_, i) => `${i ? 'L' : 'M'}${-340 + i * 17},${l * 14 + Math.sin(i * 0.9 + reloj / 200) * 14}`).join(' ')} fill="none" stroke={P.espiga[1]} strokeWidth={7} strokeLinecap="round" />)}
    </Sale>
    <Txt x={460} y={690} txt="flagelos periplásmicos: corren por dentro, bajo la membrana externa" t={22} p={p('dentro')} color={TXV.ambar} />
    <Txt x={460} y={735} txt="la hacen girar como un tornillo" t={26} p={p('girar')} />
    <Txt x={460} y={830} txt="≈ 0,2 µm: demasiado fina" t={32} p={p('fina')} color={TXV.sangre} />
    <Campo x={1230} y={440} R={240} o={tramo(p('comun'), 0, 0.5)}>
      {Array.from({ length: 7 }, (_, i) => <g key={i} opacity={easeOut(tramo(p('campo'), i * 0.1, i * 0.1 + 0.5))}><Treponema x={1230 + (hash(i, 1) - 0.5) * 300} y={440 + (hash(i, 2) - 0.5) * 340} w={120} amp={9} vueltas={4} grosor={6} r={hash(i, 3) * 180} reloj={reloj + i * 300} /></g>)}
    </Campo>
    <Txt x={1230} y={750} txt="no se ve con el microscopio común" t={24} p={p('comun')} color={TXV.sangre} />
    <Txt x={1230} y={795} txt="campo oscuro" t={26} p={p('campo')} color={TXV.violeta} />
    <Txt x={1230} y={840} txt="plata o inmunofluorescencia" t={26} p={p('plata')} />
    <Txt x={1230} y={900} txt="no se cultiva de forma rutinaria" t={24} p={p('cultivo')} />
    <Txt x={1230} y={940} txt="microaerófila y dependiente del huésped" t={22} p={p('aerofila')} />
    <Txt x={1230} y={975} txt="para casi todo" t={22} p={p('huesped')} />
  </g>
);

// ─── 1 · ¿Gramnegativa? ──────────────────────────────────────────────────────
const Gramnegativa: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="¿es una bacteria gramnegativa?" t={40} p={p('gram')} color={TXV.violeta} />
    <Bandera x={420} y={200} txt="la gramnegativa clásica" color={P.cap[0]} p={p('negativa')} t={28} punta="no" />
    <Envoltura x={160} y={320} w={520} lps o={tramo(p('membranas'), 0, 0.5)} />
    <Txt x={420} y={500} txt="dos membranas y lipopolisacárido (endotoxina)" t={22} p={p('lps')} color={TXV.ambar} />
    <Bandera x={1180} y={200} txt="Treponema" color={P.esp[0]} p={p('medias')} t={28} punta="no" />
    <Envoltura x={920} y={320} w={520} o={tramo(p('membranas'), 0, 0.5)} />
    <Txt x={1180} y={500} txt="también tiene dos membranas…" t={24} p={p('membranas')} />
    <Cruz x={1180} y={288} k={0.9} p={p('endotoxina')} />
    <Txt x={1180} y={545} txt="…pero no tiene LPS" t={30} p={p('endotoxina')} color={TXV.sangre} />
    {/* la tinción de Gram no la revela */}
    <Sale p={p('tine')} x={420} y={760}><circle r={130} fill="#E8D8F8" /><circle r={112} fill="#FFF3C0" /></Sale>
    <Cruz x={420} y={760} k={1.6} p={p('delgada')} />
    <Txt x={420} y={930} txt="no se tiñe con Gram: es demasiado delgada" t={26} p={p('delgada')} />
    <Txt x={1080} y={780} txt="en el laboratorio, la sífilis" t={28} p={p('laboratorio')} />
    <Txt x={1080} y={830} txt="nunca se diagnostica con Gram" t={30} p={p('nunca')} color={TXV.sangre} />
    <Txt x={1080} y={900} txt="el resumen la llama «gramnegativa» sin más" t={22} p={p('diagnostica')} color={TXV.ambar} />
    <Bandera x={1080} y={960} txt="sin endotoxina clásica" color={P.hla[0]} p={p('secreto')} t={22} punta="no" />
  </g>
);

// ─── 2 · La membrana sigilosa ────────────────────────────────────────────────
const MembranaSigilosa: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="el secreto: esconderse" t={44} p={p('secreto')} color={TXV.esp} />
    <Txt x={800} y={145} txt="esconderse del sistema inmunitario" t={26} p={p('esconderse')} />
    <Envoltura x={300} y={420} w={1000} />
    <Txt x={1380} y={436} txt="membrana externa" t={24} ancla="start" p={p('externa')} />
    <Txt x={1380} y={536} txt="membrana interna" t={24} ancla="start" p={p('periplasmico')} fuerte={false} />
    {/* pocas proteínas expuestas */}
    {[420, 760, 1100].map((x, i) => <Sale key={x} p={tramo(p('expuestas'), i * 0.2, i * 0.2 + 0.5)} x={x} y={420}><Espiga k={0.8} /></Sale>)}
    <Txt x={760} y={340} txt="muy pocas proteínas expuestas" t={26} p={p('pocas')} color={TXV.ambar} />
    {/* las lipoproteínas inmunogénicas, ocultas en el periplasma */}
    {[360, 520, 680, 840, 1000, 1160].map((x, i) => <Sale key={x} p={tramo(p('lipoproteinas'), i * 0.1, i * 0.1 + 0.5)} x={x} y={500}><circle r={16} fill={P.sangre[1]} /><circle cx={-4} cy={-4} r={5} fill="#FFF" opacity={0.7} /></Sale>)}
    <Txt x={760} y={600} txt="las lipoproteínas inmunogénicas" t={26} p={p('inmunogenicas')} color={TXV.sangre} />
    <Txt x={760} y={640} txt="estimulan al sistema inmunitario…" t={22} p={p('estimulan')} />
    <Txt x={760} y={690} txt="…pero quedan ocultas en el espacio periplásmico, debajo de la membrana" t={24} p={p('ocultas')} color={TXV.violeta} />
    {/* los anticuerpos pasan de largo */}
    {[0, 1, 2].map((i) => <IgG key={i} x={lerp(120, 1330 - i * 130, easeOut(tramo(p('pasan'), i * 0.12, i * 0.12 + 0.8)))} y={250 + i * 44} r={-90} k={2.2} o={tramo(p('anticuerpos'), 0, 0.3)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />)}
    <Txt x={760} y={790} txt="los anticuerpos pasan de largo" t={30} p={p('pasan')} color={TXV.verde} />
    <Txt x={760} y={840} txt="casi no encuentran dónde agarrarse" t={28} p={p('agarrarse')} color={TXV.sangre} />
    <Bandera x={760} y={930} txt="un patógeno sigiloso" color={P.esp[0]} p={p('sigiloso')} t={32} punta="no" />
  </g>
);

// ─── 3 · Variar para escapar: TprK ───────────────────────────────────────────
const VariarTprK: Lamina = ({ p, reloj }) => {
  const COL = [P.sangre, P.espiga, P.virus, P.cd4, P.hla, P.cap, P.inte] as const;
  const cambia = easeOut(p('intercambia'));
  return (
    <g>
      <Txt x={800} y={90} txt="el sistema inmunitario logra reconocer algo…" t={32} p={p('logra')} color={TXV.violeta} />
      <Txt x={800} y={140} txt="y la bacteria cambia" t={34} p={p('cambia')} color={TXV.sangre} />
      {/* TprK: una proteína de la membrana externa con siete regiones variables */}
      <Sale p={p('tprk')} x={460} y={560}>
        <rect x={-30} y={-20} width={60} height={240} rx={30} fill={P.esp[0]} /><rect x={-22} y={-10} width={44} height={225} rx={22} fill={P.esp[1]} />
        {COL.map((c, i) => {
          const a = ((-150 + i * 50) * Math.PI) / 180;
          const q = easeOut(tramo(p('siete'), i * 0.1, i * 0.1 + 0.5));
          return <path key={i} d={`M0,-20 C${Math.cos(a) * 80},${-20 + Math.sin(a) * 40} ${Math.cos(a) * 170},${-60 + Math.sin(a) * 120} ${Math.cos(a) * 200 * q},${-20 + Math.sin(a) * 230 * q}`} fill="none" stroke={c[i === 0 && cambia > 0.5 ? 1 : 1]} strokeWidth={14} strokeLinecap="round" />;
        })}
      </Sale>
      <Txt x={460} y={870} txt="TprK, con siete regiones variables" t={26} p={p('variables')} />
      {/* la conversión génica: los casetes silenciosos se intercambian */}
      <Txt x={1130} y={250} txt="conversión génica" t={34} p={p('conversion')} color={TXV.violeta} />
      {COL.map((c, i) => <Sale key={i} p={tramo(p('guardados'), i * 0.1, i * 0.1 + 0.5)} x={900 + (i % 4) * 130} y={470 + Math.floor(i / 4) * 90}><rect x={-46} y={-26} width={92} height={52} rx={14} fill={c[0]} /><rect x={-42} y={-23} width={84} height={42} rx={11} fill={c[1]} /></Sale>)}
      <Txt x={1100} y={650} txt="segmentos guardados, en casetes silenciosos" t={24} p={p('guardados')} />
      <Flecha a={[880, 510]} b={[650, 450]} c={[760, 400]} p={p('intercambia')} color={P.espiga[1]} w={9} />
      <Txt x={1130} y={750} txt="se intercambian y producen variantes nuevas" t={26} p={p('variantes')} color={TXV.ambar} />
      <IgG x={lerp(1450, 1080, easeOut(p('anticuerpos')))} y={880} r={-90} k={1.5} o={tramo(p('presion'), 0, 0.4)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />
      <Txt x={1130} y={840} txt="justo bajo la presión de los anticuerpos" t={24} p={p('presion')} />
      <Txt x={460} y={940} txt="así la espiroqueta puede persistir" t={30} p={p('persistir')} color={TXV.sangre} />
    </g>
  );
};

// ─── 4 · Lenta pero lejos ────────────────────────────────────────────────────
const LentaPeroLejos: Lamina = ({ p, reloj }) => {
  const rap = easeOut(p('rapido'));
  return (
    <g>
      <Txt x={800} y={90} txt="tarda en enfermar: incubación de 10 a 90 días" t={36} p={p('tardan')} color={TXV.violeta} />
      <rect x={160} y={220} width={1280} height={26} rx={13} fill="#B7AEDB" opacity={tramo(p('n10'), 0, 0.5)} />
      <rect x={160 + 1280 * 10 / 90} y={220} width={1280 * 80 / 90 * easeOut(p('n90'))} height={26} rx={13} fill={P.esp[1]} />
      <Txt x={160} y={290} txt="10 días" t={26} ancla="start" p={p('n10')} /><Txt x={1440} y={290} txt="90 días" t={26} ancla="end" p={p('n90')} />
      <Sale p={p('n21')} x={160 + 1280 * 21 / 90} y={233}><Bola R={26} tono={[...P.espiga]} /></Sale>
      <Txt x={160 + 1280 * 21 / 90} y={300} txt="21 en promedio" t={28} p={p('n21')} color={TXV.ambar} />
      {/* se divide cada 30 horas: un reloj lento */}
      <Sale p={p('multiplica')} x={330} y={560}><Reloj k={1.2} ang={lerp(0, 270, p('n30'))} /></Sale>
      <Txt x={330} y={700} txt="se multiplica lentísimo: cada 30 horas" t={26} p={p('n30')} />
      {/* pero se mueve rápido: en horas llega a los ganglios, la sangre y el sistema nervioso */}
      <Txt x={1020} y={400} txt="pero se mueve rápido" t={32} p={p('mueve')} color={TXV.sangre} />
      {Array.from({ length: 18 }, (_, i) => {
        const a = hash(i, 4) * Math.PI * 2, r = (30 + hash(i, 5) * 230) * rap;
        return <circle key={i} cx={1020 + Math.cos(a) * r * 1.5} cy={690 + Math.sin(a) * r * 0.55} r={9} fill={P.esp[1]} opacity={0.9 * rap} />;
      })}
      <Bandera x={760} y={480} txt="ganglios" color={P.cd4[0]} p={p('ganglios')} t={26} punta="no" />
      <Bandera x={1020} y={480} txt="sangre" color={P.sangre[0]} p={p('sangre')} t={26} punta="no" />
      <Bandera x={1290} y={480} txt="sistema nervioso" color={P.hla[0]} p={p('nervioso')} t={26} punta="no" />
      <Txt x={1020} y={850} txt="en horas, desde etapas tempranas" t={24} p={p('horas')} />
      <Txt x={800} y={920} txt="la lentitud explica un detalle del tratamiento:" t={26} p={p('lentitud')} />
      <Sale p={p('penicilina')} x={440} y={972}><Pastilla2 /></Sale>
      <Txt x={500} y={972} txt="la penicilina debe mantenerse durante días" t={24} ancla="start" p={p('mantenerse')} color={TXV.verde} />
    </g>
  );
};

/** Una pastilla pequeña (la penicilina). */
function Pastilla2() {
  return (
    <g transform="rotate(-30)">
      <rect x={-34} y={-16} width={68} height={32} rx={16} fill="#B07A00" /><rect x={-34} y={-16} width={34} height={32} rx={16} fill="#F2B21C" /><rect x={-28} y={-11} width={44} height={8} rx={4} fill="#FFF" opacity={0.6} />
    </g>
  );
}

// ─── 5 · Cómo se transmite ───────────────────────────────────────────────────
const ComoSeTransmite: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="cómo llega a una persona nueva" t={40} p={p('llega')} color={TXV.violeta} />
    {/* contacto sexual, por microlesiones */}
    <Bandera x={300} y={200} txt="contacto sexual" color={P.sangre[0]} p={p('sexual')} t={30} punta="no" />
    <Sale p={p('contacto')} x={300} y={400}><rect x={-160} y={-60} width={320} height={120} rx={30} fill="#F2A8C0" /><rect x={-150} y={-52} width={300} height={100} rx={26} fill="#F9C9D9" /></Sale>
    <path d="M-10,340 L8,380 L-8,420" fill="none" stroke="#2A1A5A" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" transform="translate(300,0)" opacity={tramo(p('microlesiones'), 0, 0.5)} />
    <Sale p={p('microlesiones')} x={300} y={262}><Treponema w={150} amp={10} vueltas={4} grosor={7} reloj={reloj} /></Sale>
    <Flecha a={[300, 295]} b={[300, 400]} p={p('microlesiones')} color={P.esp[1]} w={9} />
    <Txt x={300} y={560} txt="a través de microlesiones" t={24} p={p('microlesiones')} />
    <Txt x={300} y={600} txt="de la piel y las mucosas" t={22} p={p('sexual')} />
    {/* vertical: embarazo o parto */}
    <Bandera x={800} y={200} txt="vertical" color={P.hla[0]} p={p('madre')} t={30} punta="no" />
    <Sale p={p('madre')} x={680} y={420}><Persona quien="mujer" k={0.38} /></Sale>
    <Sale p={p('embarazo')} x={930} y={440}><circle r={70} fill="#F2A8C0" /><circle r={62} fill="#F9C9D9" /><circle cx={-20} cy={-6} r={8} fill="#52106A" /><circle cx={20} cy={-6} r={8} fill="#52106A" /></Sale>
    <Flecha a={[760, 440]} b={[860, 440]} p={p('embarazo')} color={P.esp[1]} w={9} />
    <Txt x={800} y={600} txt="durante el embarazo o el parto" t={24} p={p('parto')} />
    {/* rara vez: transfusión o trasplante */}
    <Bandera x={1300} y={200} txt="poco frecuente" color={P.cap[0]} p={p('raramente')} t={30} punta="no" />
    <Sale p={p('transfusion')} x={1200} y={420}><BolsaSangre k={0.8} /></Sale>
    <Txt x={1200} y={625} txt="transfusión" t={24} p={p('transfusion')} />
    <Sale p={p('trasplante')} x={1420} y={420}><circle r={52} fill="#B5183F" /><circle cx={-5} cy={-5} r={44} fill="#E5324C" /><circle cx={-16} cy={-18} r={9} fill="#FFF" opacity={0.7} /></Sale>
    <Txt x={1420} y={625} txt="trasplante de órganos" t={24} p={p('trasplante')} />
    {/* en cualquier caso: una puerta de entrada, una pequeña herida */}
    <Txt x={800} y={760} txt="en cualquier caso: una puerta de entrada" t={34} p={p('puerta')} color={TXV.violeta} />
    <Txt x={800} y={815} txt="una pequeña herida" t={30} p={p('herida')} color={TXV.sangre} />
    <Sale p={p('viaje')} x={800} y={920}><Treponema w={300} amp={14} vueltas={5} grosor={9} reloj={reloj} /></Sale>
    <Txt x={1100} y={925} txt="y la espiroqueta empieza su viaje" t={26} ancla="start" p={p('viaje')} color={TXV.esp} />
  </g>
);

const LAMINAS: Lamina[] = [Sacacorchos, Gramnegativa, MembranaSigilosa, VariarTprK, LentaPeroLejos, ComoSeTransmite];
export default LAMINAS;
