'use client';
// Capítulo 5 · Vasos medianos y pequeños: PAN, Kawasaki, GPA, GEPA, PAM y crioglobulinemia.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Pastilla, Termometro } from '../../citopenias-autoinmunes/Piezas';
import { Barra, Cruz, Lente, Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Alveolos, Anca, FotoLente, Llamada, Portaobjetos, Manometro, Inhalador, Mpo, Perfil, Pista, Pr3, Bandera, Complejo, Corazon, Cuerpo, En, Eosinofilo, Flecha, FLECHA, Glomerulo, Granuloma, Hematie, IgG, LineaTiempo, Linfocito, Nervio, Pantalla, PiernaPurpura, Pulmones, Punto, Rinon, Sale, Txt, TxtPantalla, V, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Arteria mediana de lado: adventicia, media muscular, lámina elástica interna ondulada, endotelio y luz con hematíes.
 *  `an` saca microaneurismas en rosario; `nec` necrosa dos segmentos de toda la pared (fibrinoide y neutrófilos). */
function Arteria({ x = 0, y = 0, w = 900, an = 0, nec = 0, o = 1, reloj = 0 }: { x?: number; y?: number; w?: number; an?: number; nec?: number; o?: number; reloj?: number }) {
  const W = w / 2, pos = [0, 1, 2, 3, 4].map((i) => -W + 120 + i * ((w - 240) / 4));
  const onda = (yy: number) => { let d = `M${-W + 30},${yy}`; for (let xx = -W + 30; xx < W - 30; xx += 16) d += ` q4,${yy > 0 ? 3 : -3} 8,0 t8,0`; return d; };
  return (
    <En x={x} y={y} o={o}>
      <rect x={-W} y={-60} width={w} height={120} rx={60} fill="#B23A62" transform="translate(4,4)" />
      <rect x={-W} y={-60} width={w} height={120} rx={60} fill="#F2B8CB" />
      {Array.from({ length: Math.floor(w / 46) }, (_, i) => <path key={i} d={`M${-W + 40 + i * 46},${i % 2 ? -54 : 50} q10,${i % 2 ? 3 : -3} 22,0`} stroke="#D98AA6" strokeWidth={3} fill="none" strokeLinecap="round" />)}
      <rect x={-W + 14} y={-46} width={w - 28} height={92} rx={46} fill={V.pared[2]} />
      {Array.from({ length: Math.floor((w - 60) / 22) }, (_, i) => [-38, 38].map((yy) => <ellipse key={`${i}${yy}`} cx={-W + 40 + i * 22 + (yy > 0 ? 11 : 0)} cy={yy} rx={4} ry={7} fill={V.pared[3]} opacity={0.8} />))}
      <path d={onda(-30)} fill="none" stroke="#FFD23F" strokeWidth={3.5} /><path d={onda(30)} fill="none" stroke="#FFD23F" strokeWidth={3.5} />
      {an > 0.01 && pos.map((px, i) => {
        const R = (16 + 22 * hash(i, 2)) * easeOut(clamp(an * 1.2 - i * 0.05)), sg = i % 2 ? 1 : -1, cy = sg * (44 + R * 0.55);
        if (R < 1) return null;
        return (
          <g key={i}>
            <circle cx={px} cy={cy} r={R + 9} fill={V.pared[3]} />
            <circle cx={px} cy={cy} r={R} fill={V.sangre[1]} />
            <rect x={px - R * 0.7} y={Math.min(0, cy)} width={R * 1.4} height={Math.abs(cy)} fill={V.sangre[1]} />
            <circle cx={px - R * 0.35} cy={cy - R * 0.35} r={R * 0.18} fill={V.sangre[3]} opacity={0.8} />
          </g>
        );
      })}
      {nec > 0.01 && [1, 3].map((i) => (
        <g key={i} opacity={nec}>
          <rect x={pos[i] - 70} y={-58} width={140} height={116} rx={26} fill="#FF4F9A" />
          {Array.from({ length: 12 }, (_, j) => <g key={j}><circle cx={pos[i] - 56 + hash(j, i + 3) * 112} cy={(j % 2 ? 1 : -1) * (34 + hash(j, i + 5) * 18)} r={5} fill="#5A2A9E" /><circle cx={pos[i] - 50 + hash(j, i + 3) * 112} cy={(j % 2 ? 1 : -1) * (34 + hash(j, i + 5) * 18) + 4} r={4} fill="#5A2A9E" /></g>)}
          {[-1, 1].map((sg) => <path key={sg} d={`M${pos[i] - 50},${sg * 40} L${pos[i] + 50},${sg * 44}`} stroke="#FFD23F" strokeWidth={4} strokeDasharray="10 8" />)}
        </g>
      ))}
      <rect x={-W + 30} y={-28} width={w - 60} height={56} rx={28} fill={V.sangre[1]} />
      <path d={`M${-W + 40},-27 L${W - 40},-27 M${-W + 40},27 L${W - 40},27`} stroke={V.endo[1]} strokeWidth={4} strokeDasharray="26 6" />
      {Array.from({ length: Math.floor(w / 70) }, (_, i) => { const xx = -W + 50 + ((((i * 70 + reloj * 0.08) % (w - 100)) + (w - 100)) % (w - 100)); return <Hematie key={i} x={xx} y={(hash(i, 8) - 0.5) * 22} k={0.28} r={i * 40} />; })}
    </En>
  );
}

/** Asas de intestino delgado con sus arterias mesentéricas en arcada. `inf` infarta un asa. */
function Intestino({ x = 0, y = 0, k = 1, o = 1, inf = 0 }: { x?: number; y?: number; k?: number; o?: number; inf?: number }) {
  const asa = 'M-82,-58 C-20,-96 44,-92 74,-60 C104,-28 62,4 0,-8 C-62,-20 -104,12 -72,44 C-42,74 42,72 82,50';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M0,130 L-60,44 M0,130 L-2,62 M0,130 L58,52 M0,130 L-30,-10 M0,130 L40,-20" stroke={V.sangre[1]} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M-60,44 Q-30,30 -2,62 Q30,40 58,52 M-30,-10 Q6,-30 40,-20" stroke={V.sangre[1]} strokeWidth={3} fill="none" />
      <path d={asa} fill="none" stroke="#C9566E" strokeWidth={40} strokeLinecap="round" transform="translate(4,4)" />
      <path d={asa} fill="none" stroke="#F5A3B1" strokeWidth={36} strokeLinecap="round" />
      <path d={asa} fill="none" stroke="#FFD0D8" strokeWidth={14} strokeLinecap="round" strokeDasharray="3 9" opacity={0.9} />
      {inf > 0.01 && <path d="M-62,-20 C-104,12 -72,44 -50,58" fill="none" stroke="#5A2340" strokeWidth={36} strokeLinecap="round" opacity={0.85 * inf} />}
      <path d="M-60,-74 C-20,-92 30,-90 60,-70" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
    </En>
  );
}

/** Corte transversal de un nervio periférico: epineuro, fascículos con axones y su vasa nervorum. `inf` ocluye un vaso y apaga un fascículo. */
function NervioCorte({ x = 0, y = 0, k = 1, o = 1, inf = 0 }: { x?: number; y?: number; k?: number; o?: number; inf?: number }) {
  const fas: [number, number, number][] = [[-30, -24, 26], [22, -30, 22], [40, 14, 24], [-6, 24, 24], [-44, 18, 18], [6, -2, 14]];
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse rx={80} ry={68} fill="#C99A3A" transform="translate(4,4)" />
      <ellipse rx={80} ry={68} fill="#F7E1A8" />
      {fas.map(([fx, fy, r], i) => {
        const muerto = i === 2 && inf > 0.5;
        return (
          <g key={i}>
            <circle cx={fx} cy={fy} r={r + 4} fill="#D9A23A" />
            <circle cx={fx} cy={fy} r={r} fill={muerto ? '#B5AFC8' : '#FFF3CE'} />
            {Array.from({ length: Math.round(r / 3.2) }, (_, j) => <circle key={j} cx={fx + (hash(j, i) - 0.5) * r * 1.3} cy={fy + (hash(j, i + 9) - 0.5) * r * 1.3} r={2.6} fill={muerto ? '#8E86A8' : '#F2C230'} stroke={muerto ? 'none' : '#C99300'} strokeWidth={1} />)}
          </g>
        );
      })}
      {[[-62, -26], [60, -32], [-10, 56], [66, 30]].map(([vx, vy], i) => <g key={i}><circle cx={vx} cy={vy} r={8} fill={V.sangre[0]} /><circle cx={vx} cy={vy} r={4} fill={i === 3 && inf > 0.5 ? '#3A1342' : V.sangre[2]} /></g>)}
      <path d="M-56,-42 C-36,-58 -10,-62 12,-60" fill="none" stroke="#FFF6D8" strokeWidth={5} strokeLinecap="round" />
    </En>
  );
}

/** Corte de piel: epidermis con crestas, dermis, hipodermis grasa y la arteria mediana en el límite; `nod` la inflama y levanta un nódulo. */
function PielCorte({ x = 0, y = 0, k = 1, o = 1, nod = 0 }: { x?: number; y?: number; k?: number; o?: number; nod?: number }) {
  const n = clamp(nod);
  const sup = `M-90,-60 C-50,-60 -30,${-60 - 22 * n} 0,${-60 - 26 * n} C30,${-60 - 22 * n} 50,-60 90,-60`;
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-90} y={-60} width={184} height={150} rx={14} fill="#B5636E" transform="translate(4,4)" />
      <path d={`${sup} L90,40 L-90,40 Z`} fill="#F8D3C4" />
      <path d={`${sup} L90,-40 C70,-30 60,-46 40,-36 C20,-28 10,-44 -10,-36 C-30,-28 -40,-44 -60,-36 C-76,-30 -84,-40 -90,-40 Z`} fill="#D98C76" />
      <path d={sup} fill="none" stroke="#B5636E" strokeWidth={4} />
      <rect x={-90} y={40} width={180} height={50} fill="#FFE9A8" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-74 + (i % 5) * 36 + (i > 4 ? 18 : 0)} cy={i > 4 ? 76 : 56} r={15} fill="#FFF6D2" stroke="#F2C24B" strokeWidth={2} />)}
      {[-50, 10, 60].map((cx, i) => <path key={i} d={`M${cx},-28 q8,10 0,20 t0,20`} stroke="#E98A9A" strokeWidth={3} fill="none" />)}
      <circle cx={0} cy={40} r={20 + 10 * n} fill="#FF8A2B" opacity={0.35 * n} />
      <circle cx={0} cy={40} r={15} fill={V.pared[2]} /><circle cx={0} cy={40} r={7 * (1 - 0.5 * n)} fill={V.sangre[1]} />
      {n > 0.01 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 22} cy={40 + Math.sin(a) * 22} r={3} fill="#5A2A9E" opacity={n} />; })}
    </En>
  );
}

/** Corte de arteria según la edad de la lesión: 0 aguda (fibrinoide y neutrófilos), 1 en reparación, 2 cicatriz que estrecha la luz. */
function ArteriaEdad({ x, y, edad, o = 1 }: { x: number; y: number; edad: 0 | 1 | 2; o?: number }) {
  if (o <= 0.002) return null;
  const pared = ['#FF4F9A', '#D46A9E', '#E7C9A6'][edad], luz = [30, 24, 12][edad], nc = edad === 0 ? 14 : 8;
  return (
    <En x={x} y={y} o={o}>
      <circle r={56} fill="#F2B8CB" />
      <circle r={46} fill={pared} />
      {edad === 2 && Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <path key={i} d={`M${Math.cos(a) * 18},${Math.sin(a) * 18} L${Math.cos(a + 0.4) * 42},${Math.sin(a + 0.4) * 42}`} stroke="#C9A27A" strokeWidth={3} />; })}
      {edad < 2 && Array.from({ length: nc }, (_, i) => { const a = (i / nc) * Math.PI * 2 + 0.2, d = 38 + hash(i, edad) * 8; return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={4.5} fill={edad === 0 ? '#5A2A9E' : '#3F7FB8'} />; })}
      <circle r={luz} fill={V.sangre[1]} />
      <circle cx={-luz * 0.35} cy={-luz * 0.35} r={luz * 0.2} fill={V.sangre[3]} opacity={0.8} />
    </En>
  );
}

/** Partícula del virus de la hepatitis B (de Dane): envoltura con HBsAg y cápside con su ADN. */
function Vhb({ x, y, k = 1, o = 1, reloj = 0 }: { x: number; y: number; k?: number; o?: number; reloj?: number }) {
  return (
    <En x={x} y={y + Math.sin(reloj / 400) * 6} k={k} o={o}>
      {Array.from({ length: 16 }, (_, i) => <g key={i} transform={`rotate(${(i / 16) * 360})`}><rect x={48} y={-4} width={14} height={8} rx={3} fill="#B8741A" /><circle cx={64} r={6} fill="#E5A32E" /></g>)}
      <circle r={52} fill="#B8741A" /><circle cx={-3} cy={-3} r={47} fill="#F7D683" />
      <path d="M0,-28 L24,-14 L24,14 L0,28 L-24,14 L-24,-14 Z" fill="#C2410C" />
      <path d="M-10,-8 C-4,-16 10,-12 10,-2 C10,10 -6,12 -10,4" fill="none" stroke="#FFE08A" strokeWidth={4} strokeLinecap="round" />
      <circle cx={-22} cy={-26} r={6} fill="#FFF" opacity={0.75} />
    </En>
  );
}

/** Renina: enzima con su hendidura activa. */
function Renina({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  const forma = 'M-30,-6 C-30,-30 -6,-36 6,-26 C14,-36 34,-30 32,-8 C32,16 12,32 -4,30 C-24,28 -30,12 -30,-6 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={forma} fill="#11823A" transform="translate(3,3)" />
      <path d={forma} fill="#3FD467" />
      <path d="M2,-26 L6,-4 L14,-20 Z" fill="#11823A" />
      <circle cx={-16} cy={-14} r={4.5} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Aorta entera: ascendente, cayado con sus tres ramas, descendente torácica y abdominal con sus ramas y la bifurcación ilíaca. */
function Aorta() {
  const t = (d: string, w: number) => <g><path d={d} fill="none" stroke={V.sangre[0]} strokeWidth={w + 8} strokeLinecap="round" /><path d={d} fill="none" stroke={V.sangre[1]} strokeWidth={w} strokeLinecap="round" /></g>;
  return (
    <g>
      {t('M-20,-178 L-38,-232 M-20,-178 L-6,-236', 14)}
      {t('M-20,-140 L-20,-180', 20)}
      {t('M22,-160 L22,-236', 16)}
      {t('M60,-150 L84,-226', 16)}
      {t('M110,30 L54,30 M110,70 L60,82', 12)}
      {t('M110,150 L40,160 M110,150 L180,160', 14)}
      {t('M110,260 L50,330 M110,260 L170,330', 26)}
      {t('M-40,40 L-40,-110 C-40,-176 110,-176 110,-110 L110,262', 50)}
      <path d="M-30,-60 L-30,-112 C-30,-150 40,-160 80,-140" fill="none" stroke={V.sangre[3]} strokeWidth={9} strokeLinecap="round" opacity={0.75} />
      {[[30, 160], [190, 160]].map(([kx, ky], i) => <ellipse key={i} cx={kx} cy={ky} rx={20} ry={30} fill={V.rinon[1]} />)}
    </g>
  );
}

/** Lecho de vasos pequeños: arteriola que se ramifica en capilares (hematíes en fila) y se reúne en una vénula. */
function Lecho({ x, y, o = 1, reloj = 0 }: { x: number; y: number; o?: number; reloj?: number }) {
  if (o <= 0.002) return null;
  const ys = [-60, -30, 0, 30, 60];
  const caps = ys.map((cy, i) => `M-150,0 C-110,${cy * 0.4} -90,${cy} -40,${cy + (i % 2 ? 8 : -8)} C10,${cy - (i % 2 ? 10 : -10)} 60,${cy} 150,0`);
  return (
    <En x={x} y={y} o={o}>
      <path d="M-300,0 L-150,0" stroke={V.sangre[0]} strokeWidth={30} strokeLinecap="round" /><path d="M-300,0 L-150,0" stroke={V.sangre[1]} strokeWidth={22} strokeLinecap="round" />
      <path d="M150,0 L300,0" stroke="#3A2A8A" strokeWidth={36} strokeLinecap="round" /><path d="M150,0 L300,0" stroke="#6A4FC8" strokeWidth={28} strokeLinecap="round" />
      {caps.map((d, i) => <path key={i} d={d} fill="none" stroke={['#E3203F', '#D0306A', '#B3408A', '#9050A8', '#7A55B8'][i]} strokeWidth={9} strokeLinecap="round" opacity={0.95} />)}
      {[-110, -40, 30, 100].map((cx, i) => <path key={i} d={`M${cx},-52 L${cx + 16},52`} stroke="#C0407A" strokeWidth={5} opacity={0.55} />)}
      {Array.from({ length: 10 }, (_, i) => { const f = (reloj / 2600 + i / 10) % 1, xx = lerp(-290, 290, f), dentro = Math.abs(xx) < 150; return <circle key={i} cx={xx} cy={dentro ? ys[i % 5] * Math.sin(((xx + 150) / 300) * Math.PI) : 0} r={6} fill="#FFA3AB" />; })}
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

const Grandes: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('grandes')} x={420} y={440} k={1}><g opacity={lerp(1, 0.5, p('siguiente'))}><Aorta /></g></Sale>
      <Bandera x={420} y={120} txt="Vasos grandes: la aorta y sus ramas" color={V.sangre[0]} p={p('grandes')} t={26} />
      <Txt x={420} y={830} txt="arteritis de células gigantes · Takayasu" t={26} p={p('granulomatosas')} />
      <Bandera x={420} y={910} txt="En el siguiente laboratorio" color="#8A4FE0" p={p('siguiente')} t={26} />
      <Bandera x={1150} y={250} txt="Aquí: vasos medianos…" color={V.sangre[1]} p={p('aqui')} t={28} />
      <Arteria x={1150} y={390} w={640} o={tramo(p('aqui'), 0, 0.4)} reloj={reloj} />
      <Lecho x={1150} y={680} o={tramo(p('pequenos'), 0, 0.5)} reloj={reloj} />
      <Bandera x={1150} y={880} txt="…y sobre todo, pequeños" color="#E0338A" p={p('pequenos')} t={28} />
    </g>
  );
};

const Pan: Lamina = ({ p, reloj }) => {
  const inf = tramo(p('aneurismas'), 0.2, 1);
  const organos: [string, number][] = [['riñón', 170], ['intestino', 400], ['nervio', 630], ['piel', 850]];
  const baja = (reloj / 700) % 1;
  const ren = p('renina');
  return (
    <g>
      <Bandera x={800} y={70} txt="Vaso mediano: poliarteritis nodosa" color={V.sangre[1]} p={p('pan')} t={30} punta="no" />
      <Arteria x={800} y={235} w={1200} nec={p('segmentaria')} an={p('aneurismas')} reloj={reloj} />
      <Txt x={460} y={345} txt="necrosis segmentaria de toda la pared" t={24} p={p('segmentaria')} />
      <Txt x={1160} y={345} txt="microaneurismas en rosario" t={24} p={p('aneurismas')} fuerte={false} />
      {/* Los órganos con arterias medianas, cada uno con su infarto */}
      <Rinon x={170} y={500} k={0.55} palido={0.5 * inf} o={tramo(p('organos'), 0, 0.4)} />
      {inf > 0.01 && <path d="M196,452 L224,476 L208,514 Z" fill="#5A2340" opacity={0.8 * inf} />}
      <Intestino x={400} y={490} k={0.85} inf={inf} o={tramo(p('organos'), 0.15, 0.55)} />
      <NervioCorte x={630} y={500} k={0.9} inf={inf} o={tramo(p('organos'), 0.3, 0.7)} />
      <PielCorte x={850} y={500} k={0.85} nod={inf} o={tramo(p('organos'), 0.45, 0.85)} />
      {organos.map(([txt, ox], i) => <Txt key={txt} x={ox} y={615} txt={txt} t={22} p={tramo(p('organos'), i * 0.15, 0.4 + i * 0.15)} />)}
      {/* Respeta pulmón y glomérulo */}
      <Sale p={p('respeta')} x={1170} y={505} k={0.42}><Pulmones /></Sale>
      <Sale p={p('respeta')} x={1400} y={510} k={0.3}><Glomerulo /></Sale>
      <Visto x={1290} y={430} k={0.8} p={p('respeta')} />
      <Txt x={1290} y={620} txt="respeta pulmón y glomérulo" t={22} p={p('respeta')} />
      {/* Menos flujo renal → renina → HTA */}
      <Rinon x={130} y={800} k={0.42} palido={ren} o={tramo(ren, 0, 0.3)} />
      {ren > 0.01 && <g opacity={tramo(ren, 0, 0.3) * (1 - baja * 0.7)} transform={`translate(60,${728 + baja * 36})`}><path d="M-9,-24 L9,-24 L9,0 L20,0 L0,22 L-20,0 L-9,0 Z" fill="#E3203F" /></g>}
      <Flecha a={[190, 800]} b={[250, 800]} p={tramo(ren, 0.2, 0.6)} color={FLECHA} w={5} />
      <Renina x={295} y={800} k={1.1} o={tramo(ren, 0.3, 0.6)} />
      <Txt x={295} y={862} txt="renina" t={20} p={tramo(ren, 0.3, 1)} />
      <Flecha a={[340, 800]} b={[395, 800]} p={tramo(ren, 0.5, 0.8)} color={FLECHA} w={5} />
      <Manometro x={445} y={790} k={0.9} val={tramo(ren, 0.6, 1)} o={tramo(ren, 0.5, 0.8)} />
      <Txt x={455} y={880} txt="HTA" t={22} p={tramo(ren, 0.6, 1)} />
      {/* Lesiones de distintas edades */}
      {([0, 1, 2] as const).map((e) => <ArteriaEdad key={e} x={660 + e * 130} y={790} edad={e} o={tramo(p('edades'), e * 0.2, 0.4 + e * 0.2)} />)}
      {['aguda', 'reparándose', 'cicatriz'].map((t, i) => <Txt key={t} x={660 + i * 130} y={865} txt={t} t={18} p={tramo(p('edades'), i * 0.2, 0.5 + i * 0.2)} />)}
      <Txt x={790} y={915} txt="lesiones de distintas edades, a la vez" t={22} p={p('edades')} />
      {/* Hepatitis B; sin ANCA */}
      <Vhb x={1150} y={790} k={0.8} o={tramo(p('vhb'), 0, 0.4)} reloj={reloj} />
      <Txt x={1150} y={880} txt="virus de la hepatitis B" t={20} p={p('vhb')} />
      <Anca x={1395} y={765} k={2.2} o={tramo(p('sinanca'), 0, 0.4)} />
      <Cruz x={1425} y={790} k={0.6} p={p('sinanca')} />
      <Txt x={1400} y={880} txt="ANCA negativa" t={20} p={p('sinanca')} />
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

/** Mano de dorso, apoyada y con los dedos hacia abajo; el pulgar queda en +x.
 *  `m` la hincha (dedos en salchicha), la enrojece y pela la piel alrededor de las uñas. */
function ManoK({ m }: { m: number }) {
  const ancho = 13 + 4 * m;
  const dedos: [number, number][] = [[-19, 38], [-6.5, 48], [6.5, 50], [19, 44]];
  const forma = (c: string) => (
    <g fill={c}>
      <rect x={-26} y={-12} width={52} height={42} rx={16} />
      {dedos.map(([fx, L], i) => <rect key={i} x={fx - ancho / 2} y={20} width={ancho} height={L} rx={ancho / 2} />)}
      <rect x={17} y={2} width={ancho} height={36} rx={ancho / 2} transform="rotate(-14 23 8)" />
    </g>
  );
  return (
    <g>
      <g transform="translate(4,4)">{forma('#D9806A')}</g>
      {forma('#F2B08F')}
      <g opacity={0.85 * m}>{forma('#EC5F68')}</g>
      <ellipse cx={-6} cy={8} rx={13} ry={9} fill="#FFFFFF" opacity={0.18} />
      {[-12.75, 0, 12.75].map((gx, i) => <path key={i} d={`M${gx},30 L${gx},${54 + (i === 1 ? 8 : 2)}`} stroke="#B9503F" strokeWidth={2.4} strokeLinecap="round" opacity={0.45} />)}
      {dedos.map(([fx, L], i) => (
        <g key={i}>
          <rect x={fx - 4} y={20 + L - 13} width={8} height={9} rx={3.5} fill="#FFE6DA" />
          {m > 0.45 && (
            <g opacity={tramo(m, 0.45, 1)}>
              <path d={`M${fx - ancho / 2 + 1},${20 + L - 16} q-5,-1 -5,-7`} fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

/** Niño pequeño sentado en la cama, plano y sin contornos (estilo de las referencias), con los signos de Kawasaki
 *  que se encienden uno a uno: fiebre, ojos rojos con el borde del iris limpio, labios rojos y agrietados,
 *  lengua de fresa que sale por delante del labio, ganglio en el cuello y manos hinchadas que se pelan. */
function NinoK({ fiebre = 0, ojos = 0, labios = 0, lengua = 0, manos = 0, ganglio = 0, reloj = 0 }: { fiebre?: number; ojos?: number; labios?: number; lengua?: number; manos?: number; ganglio?: number; reloj?: number }) {
  const piel = { sombra: '#E2896F', base: '#F6B596', luz: '#FFD3BC' };
  const f = clamp(fiebre), o = clamp(ojos), lb = clamp(labios), lg = clamp(lengua), m = clamp(manos), gn = clamp(ganglio);
  const labio = lb > 0.01 ? (lb > 0.5 ? '#D3122F' : '#E0485A') : '#E27C84';
  const lenguaCol = lg > 0.4 ? '#E5223D' : '#F07A86';
  const punta = 84 + 30 * lg; // borde inferior de la lengua que sale
  const ola = (i: number) => `M${-56 + i * 56},-150 q12,-12 0,-24 t0,-24`;
  const hk = 1 + 0.12 * m;
  return (
    <g>
      {/* Cama: cabecero, almohada */}
      <rect x={-250} y={110} width={500} height={250} rx={40} fill="#7E68D6" />
      <rect x={-250} y={110} width={500} height={226} rx={40} fill="#9C88EC" />
      <rect x={-190} y={96} width={380} height={170} rx={60} fill="#E6DEFF" />
      <rect x={-190} y={96} width={380} height={150} rx={60} fill="#F6F2FF" />
      {/* Fiebre: ondas de calor */}
      {f > 0.01 && [0, 1, 2].map((i) => <path key={i} d={ola(i)} fill="none" stroke="#FF7A3D" strokeWidth={9} strokeLinecap="round" opacity={f * (0.55 + 0.45 * Math.sin(reloj / 220 + i * 1.7))} />)}
      {/* Torso con bata */}
      <path d="M-150,330 C-158,214 -118,156 -46,140 L46,140 C118,156 158,214 150,330 Z" fill="#2E8FC4" />
      <path d="M-150,330 C-158,214 -118,156 -46,140 L46,140 C110,156 140,210 132,330 Z" fill="#4FB0E2" />
      {[[-90, 210], [-40, 250], [20, 205], [70, 262], [-100, 290], [96, 214], [-10, 300]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={7} fill="#9FDBF8" />)}
      {/* Cuello y ganglio */}
      <rect x={-32} y={78} width={64} height={78} rx={24} fill={piel.sombra} />
      <path d="M-44,142 Q0,186 44,142 Q0,166 -44,142 Z" fill="#2E8FC4" />
      {gn > 0.01 && (
        <g>
          <ellipse cx={-44} cy={124} rx={26 * gn} ry={21 * gn} fill="#E57A64" />
          <ellipse cx={-47} cy={121} rx={22 * gn} ry={17 * gn} fill="#F49A80" />
          <ellipse cx={-54} cy={114} rx={7 * gn} ry={5 * gn} fill="#FFFFFF" opacity={0.45} />
        </g>
      )}
      {/* Orejas */}
      {[-1, 1].map((sx) => (
        <g key={sx} transform={`translate(${sx * 116},8)`}>
          <circle r={26} fill={piel.sombra} />
          <circle cx={-sx * 2} cy={-2} r={21} fill={piel.base} />
          <ellipse cx={sx * 3} cy={0} rx={9} ry={12} fill="#E58A70" />
        </g>
      ))}
      {/* Cabeza con sombra en media luna */}
      <circle r={122} fill={piel.sombra} />
      <circle cx={-8} cy={-7} r={114} fill={piel.base} />
      <ellipse cx={-62} cy={-58} rx={22} ry={13} transform="rotate(-35 -62 -58)" fill={piel.luz} opacity={0.7} />
      {/* Pelo */}
      <path d="M-124,0 C-132,-104 -62,-152 2,-152 C70,-152 132,-106 124,-6 C112,-52 88,-70 60,-76 C46,-58 14,-60 0,-82 C-20,-60 -66,-60 -90,-74 C-104,-58 -116,-34 -124,0 Z" fill="#4A2416" />
      <path d="M-124,0 C-132,-104 -62,-152 2,-152 C62,-152 118,-112 116,-30 C104,-60 84,-74 60,-80 C46,-62 14,-64 0,-86 C-20,-64 -66,-64 -90,-78 C-104,-62 -116,-36 -124,0 Z" fill="#6E3A22" />
      <path d="M-6,-150 C2,-182 34,-188 46,-170 C30,-170 20,-162 16,-150 Z" fill="#6E3A22" />
      {[[-70, -118, -30], [-20, -132, -12], [40, -126, 18]].map(([cx, cy, r], i) => <rect key={i} x={cx - 22} y={cy - 6} width={44} height={12} rx={6} transform={`rotate(${r} ${cx} ${cy})`} fill="#93553A" />)}
      {/* Cejas preocupadas */}
      {[-1, 1].map((sx) => <rect key={sx} x={sx * 46 - 22} y={-50} width={44} height={11} rx={5.5} transform={`rotate(${sx * 12} ${sx * 46} -44)`} fill="#4A2416" />)}
      {/* Ojos: esclera que se enrojece con vasitos; el anillo junto al iris queda limpio */}
      {[-1, 1].map((sx) => (
        <g key={sx} transform={`translate(${sx * 46},-6)`}>
          <ellipse rx={23} ry={19} fill="#FFFFFF" />
          <ellipse rx={23} ry={19} fill="#FF7083" opacity={0.75 * o} />
          {o > 0.01 && [[-21, -5, -12, -2], [-20, 8, -12, 3], [21, -6, 12, -1], [20, 8, 12, 4], [-8, -17, -6, -12], [9, 17, 6, 12]].map(([a1, b1, a2, b2], i) => <path key={i} d={`M${a1},${b1} Q${(a1 + a2) / 2 + 2},${(b1 + b2) / 2 - 3} ${a2},${b2}`} stroke="#C8102E" strokeWidth={2} strokeLinecap="round" fill="none" opacity={o} />)}
          <circle r={14.5} fill="#FFFFFF" />
          <circle r={11} fill="#7A4424" />
          <circle r={6} fill="#24100A" />
          <circle cx={-3.5} cy={-4} r={3} fill="#FFFFFF" />
        </g>
      ))}
      {/* Nariz y mejillas */}
      <ellipse cx={-2} cy={28} rx={13} ry={10} fill="#E8957A" />
      <ellipse cx={-6} cy={25} rx={5} ry={3.5} fill={piel.luz} opacity={0.6} />
      {[-1, 1].map((sx) => <ellipse key={sx} cx={sx * 70} cy={40} rx={22} ry={14} fill="#FF6F7E" opacity={0.3 + 0.45 * f} />)}
      {/* Gota de sudor */}
      {f > 0.01 && (
        <g opacity={f} transform="translate(98,-40)">
          <path d="M0,-18 C8,-6 12,2 12,8 C12,15 6,20 0,20 C-6,20 -12,15 -12,8 C-12,2 -8,-6 0,-18 Z" fill="#BDEFFF" />
          <circle cx={-4} cy={10} r={3} fill="#FFFFFF" />
        </g>
      )}
      {/* Boca: cavidad, labios rellenos y, por delante del labio inferior, la lengua */}
      <path d="M-28,58 Q0,52 28,58 Q26,90 0,93 Q-26,90 -28,58 Z" fill="#5A1020" />
      <ellipse cx={0} cy={82} rx={18} ry={9} fill={lenguaCol} />
      <path d="M-35,58 Q-20,45 0,51 Q20,45 35,58 Q18,61 0,58 Q-18,61 -35,58 Z" fill={labio} />
      <path d="M-30,64 Q-27,90 0,92 Q27,90 30,64 Q36,102 0,106 Q-36,102 -30,64 Z" fill={labio} />
      {lg > 0.01 && (
        <g>
          <path d={`M-21,76 C-24,${punta - 6} -14,${punta + 2} 0,${punta + 2} C14,${punta + 2} 24,${punta - 6} 21,76 Z`} fill={lenguaCol} />
          <path d={`M0,82 L0,${punta - 8}`} stroke="#B3122C" strokeWidth={3} strokeLinecap="round" opacity={lg} />
          {Array.from({ length: 14 }, (_, i) => {
            const px = (hash(i, 3) - 0.5) * 30, py = 82 + hash(i, 4) * (punta - 88);
            return Math.abs(px) < 18 - (py > punta - 8 ? 6 : 0) ? <circle key={i} cx={px} cy={py} r={2} fill="#FFE7B0" opacity={tramo(lg, 0.3, 1)} /> : null;
          })}
          <ellipse cx={-8} cy={88} rx={5} ry={3} fill="#FFFFFF" opacity={0.3} />
        </g>
      )}
      {lb > 0.3 && [[-22, 52], [-9, 50], [8, 50], [21, 52], [-18, 98], [-4, 101], [12, 100]].map(([cx, cy], i) => <path key={i} d={`M${cx},${cy - 4} l1.5,7`} stroke="#FFE2E2" strokeWidth={2.2} strokeLinecap="round" opacity={tramo(lb, 0.3, 1)} />)}
      {/* Manta */}
      <path d="M-280,320 Q0,296 280,320 L286,470 Q0,488 -286,470 Z" fill="#E68FBF" />
      <path d="M-280,320 Q0,296 280,320 L282,346 Q0,326 -282,346 Z" fill="#FFFFFF" />
      <path d="M-280,346 Q0,326 280,346 L286,470 Q0,488 -286,470 Z" fill="#F4ABD2" />
      {[-150, 60, 190].map((x, i) => <path key={i} d={`M${x},360 q20,50 6,100`} fill="none" stroke="#E68FBF" strokeWidth={8} strokeLinecap="round" />)}
      <rect x={-270} y={462} width={540} height={52} rx={16} fill="#6A52C4" />
      <rect x={-232} y={476} width={90} height={14} rx={7} fill="#C9B8F2" /><rect x={142} y={476} width={90} height={14} rx={7} fill="#C9B8F2" />
      {/* Brazos: manga corta, brazo y antebrazo apoyado en la manta */}
      {[-1, 1].map((sx) => (
        <g key={sx}>
          <path d={`M${sx * 138},196 C${sx * 162},244 ${sx * 166},292 ${sx * 150},314 C${sx * 136},334 ${sx * 118},342 ${sx * 104},346`} fill="none" stroke={piel.sombra} strokeWidth={38} strokeLinecap="round" />
          <path d={`M${sx * 136},194 C${sx * 158},242 ${sx * 160},290 ${sx * 146},310 C${sx * 132},330 ${sx * 116},338 ${sx * 104},342`} fill="none" stroke={piel.base} strokeWidth={30} strokeLinecap="round" />
          <path d={`M${sx * 128},176 C${sx * 148},196 ${sx * 160},222 ${sx * 162},246`} fill="none" stroke={sx < 0 ? '#4FB0E2' : '#2E8FC4'} strokeWidth={52} strokeLinecap="round" />
        </g>
      ))}
      {[-1, 1].map((sx) => <g key={sx} transform={`translate(${sx * 100},336) rotate(${sx * 16}) scale(${-sx * hk * 1.25},${hk * 1.25})`}><ManoK m={m} /></g>)}
    </g>
  );
}

/** Pie de suero con la bolsa de inmunoglobulina y su cámara de goteo (como la referencia «mujer con suero»). */
function PieSuero({ x, y, o = 1, reloj = 0 }: { x: number; y: number; o?: number; reloj?: number }) {
  const g = (reloj / 650) % 1;
  return (
    <En x={x} y={y} o={o}>
      <rect x={-4} y={-40} width={8} height={360} rx={4} fill="#4A6FE3" />
      <path d="M-70,-40 L70,-40" stroke="#4A6FE3" strokeWidth={8} strokeLinecap="round" />
      <path d="M-70,-40 q-14,0 -14,14" fill="none" stroke="#4A6FE3" strokeWidth={6} strokeLinecap="round" />
      <path d="M70,-40 q14,0 14,14" fill="none" stroke="#4A6FE3" strokeWidth={6} strokeLinecap="round" />
      {[-1, -0.4, 0.4, 1].map((d, i) => <g key={i}><path d={`M0,316 L${d * 56},${352 - Math.abs(d) * 8}`} stroke="#3A5BCC" strokeWidth={8} strokeLinecap="round" /><circle cx={d * 56} cy={356 - Math.abs(d) * 8} r={7} fill="#2B3F99" /></g>)}
      <g transform="translate(-60,-26)">
        <rect x={-5} y={0} width={10} height={14} rx={4} fill="#8E9FD8" />
        <path d="M-36,14 L36,14 Q46,14 46,24 L46,112 Q46,134 24,138 L-24,138 Q-46,134 -46,112 L-46,24 Q-46,14 -36,14 Z" fill="#D9F1FF" />
        <path d="M-40,54 L40,54 L40,110 Q40,128 22,132 L-22,132 Q-40,128 -40,110 Z" fill="#7CCBF2" />
        <rect x={-34} y={24} width={7} height={92} rx={3.5} fill="#FFFFFF" opacity={0.6} />
        <rect x={-22} y={28} width={44} height={18} rx={5} fill="#FFFFFF" /><rect x={-15} y={34} width={30} height={5} rx={2.5} fill="#16B9BE" />
        <rect x={-9} y={138} width={18} height={40} rx={7} fill="#EAF6FF" />
        <rect x={-6} y={162} width={12} height={12} rx={4} fill="#7CCBF2" />
        <circle cx={0} cy={144 + g * 16} r={3.6} fill="#3B9EDD" opacity={1 - g * 0.4} />
      </g>
    </En>
  );
}

const Kawasaki: Lamina = ({ p, reloj }) => {
  const CX = 470, CY = 380, K = 1;
  const at = (fx: number, fy: number): [number, number] => [CX + fx * K, CY + fy * K];
  const iv = p('ivig');
  const tubo = 'M970,738 C970,860 860,890 740,850 C660,822 620,770 586,742';
  return (
    <g>
      <Bandera x={800} y={70} txt="Vaso mediano: Kawasaki, en menores de 5 años" color={V.ambar[0]} p={p('nino')} t={28} punta="no" />
      <Sale p={p('nino')} x={CX} y={CY} k={K}><NinoK fiebre={p('fiebre')} ojos={p('ojos')} labios={p('labios')} lengua={p('lengua')} manos={p('manos')} ganglio={p('ganglio')} reloj={reloj} /></Sale>
      <Sale p={p('fiebre')} x={110} y={250} k={0.42}><Termometro val={0.95} /></Sale>
      <Txt x={110} y={365} txt="fiebre ≥ 5 días" t={22} p={p('fiebre')} />
      <g opacity={tramo(p('fiebre'), 0.3, 1)}>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={70 + i * 20} cy={398} r={7 * tramo(p('fiebre'), 0.3 + i * 0.12, 0.5 + i * 0.12)} fill="#FF7A3D" />)}</g>
      <Llamada x={790} y={250} a={at(50, -6)} txt="ojos rojos, sin pus" p={p('ojos')} />
      <Llamada x={790} y={330} a={at(30, 98)} txt="labios rojos y agrietados" p={p('labios')} />
      <Llamada x={790} y={410} a={at(6, 84 + 30 * clamp(p('lengua')) - 4)} txt="lengua de fresa" p={p('lengua')} />
      <Llamada x={790} y={500} a={at(112, 410)} txt="manos hinchadas que se pelan" p={p('manos')} />
      <Llamada x={40} y={470} a={at(-56, 124)} txt="ganglio en el cuello" p={p('ganglio')} />
      <Sale p={p('coronario')} x={1310} y={360} k={1.1}><Corazon aneurisma={tramo(p('coronario'), 0.3, 1)} /></Sale>
      <Txt x={1310} y={570} txt="aneurisma coronario" t={26} p={p('coronario')} />
      <Txt x={1310} y={606} txt="lo que puede matar" t={20} p={tramo(p('coronario'), 0.3, 1)} fuerte={false} />
      {iv > 0.002 && (
        <g>
          <path d={tubo} pathLength={1} fill="none" stroke="#BFE3F7" strokeWidth={8} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - tramo(iv, 0.2, 0.8)} />
          <path d={tubo} fill="none" stroke="#3B9EDD" strokeWidth={3.5} strokeDasharray="10 14" strokeDashoffset={-reloj / 25} strokeLinecap="round" opacity={tramo(iv, 0.75, 1)} />
          <circle cx={586} cy={742} r={8} fill="#FFFFFF" opacity={tramo(iv, 0.75, 1)} />
        </g>
      )}
      <PieSuero x={1030} y={600} o={tramo(iv, 0, 0.4)} reloj={reloj} />
      <Sale p={tramo(iv, 0.3, 1)} x={1300} y={800} k={1}><Pastilla color={['#B9B4C8', '#F4F2F8', '#FFFFFF']} /></Sale>
      <Txt x={1300} y={870} txt="inmunoglobulina IV + aspirina" t={22} p={iv} />
      <Txt x={1300} y={902} txt="a tiempo, protege las coronarias" t={19} p={tramo(iv, 0.3, 1)} fuerte={false} />
    </g>
  );
};

/** Territorio: línea desde un punto del cuerpo hasta el dibujo del órgano, con nombre y detalle pequeños. */
function Territorio({ desde, en, p, nombre, sub, children }: { desde: [number, number]; en: [number, number]; p: number; nombre: string; sub: string; children: ReactNode }) {
  if (p <= 0.002) return null;
  return (
    <g>
      <Flecha a={desde} b={[en[0] - 95, en[1]]} p={p} color={V.sangre[1]} w={4} cabeza={false} />
      <Sale p={p} x={en[0]} y={en[1]}>{children}</Sale>
      <Txt x={en[0] + 105} y={en[1] - 16} txt={nombre} t={24} p={p} ancla="start" />
      <Txt x={en[0] + 105} y={en[1] + 20} txt={sub} t={19} p={tramo(p, 0.2, 1)} ancla="start" fuerte={false} />
    </g>
  );
}

/** Autoanticuerpo pegado a su antígeno (anti-PR3 o anti-MPO). */
function AntiDe({ x, y, cual, k = 1, o = 1 }: { x: number; y: number; cual: 'pr3' | 'mpo'; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <Anca x={0} y={-6} k={2.2} />
      {cual === 'pr3' ? <Pr3 x={0} y={-26} k={1.6} /> : <Mpo x={0} y={-26} k={1.6} />}
    </En>
  );
}

const Gpa: Lamina = ({ p }) => {
  const B: [number, number] = [430, 600], K = 1.05;
  const pt = (dx: number, dy: number): [number, number] => [B[0] + dx * K, B[1] + dy * K];
  return (
    <g>
      <Bandera x={800} y={70} txt="Granulomatosis con poliangeítis" color={V.turquesa[0]} p={p('gpa')} t={30} punta="no" />
      <Txt x={800} y={140} txt="vasculitis por neutrófilos + inflamación granulomatosa necrotizante" t={24} p={p('componentes')} />
      <AntiDe x={1460} y={180} cual="pr3" o={tramo(p('pr3'), 0, 0.4)} />
      <Txt x={1460} y={295} txt="anti-PR3" t={22} p={p('pr3')} />
      <Cuerpo x={B[0]} y={B[1]} k={K} o={tramo(p('territorios'), 0, 0.4)}>
        <Punto x={22} y={-268} p={p('superior')} />
        <Punto x={-36} y={-120} p={p('pulmon')} />
        <Punto x={44} y={-40} p={p('rinon')} />
      </Cuerpo>
      <Territorio desde={pt(22, -268)} en={[880, 330]} p={p('superior')} nombre="vía aérea superior" sub="sinusitis, costras, epistaxis, nariz en silla de montar"><Perfil quien="el" hundida={0.8} costras={1} k={0.36} y={10} /></Territorio>
      <Territorio desde={pt(-36, -120)} en={[880, 570]} p={p('pulmon')} nombre="pulmón" sub="nódulos que se cavitan, hemoptisis"><Pulmones nodulos={tramo(p('pulmon'), 0.3, 1)} k={0.4} y={10} /></Territorio>
      <Territorio desde={pt(44, -40)} en={[880, 810]} p={p('rinon')} nombre="riñón" sub="glomerulonefritis pauciinmune"><Glomerulo necrosis={1} semiluna={tramo(p('rinon'), 0.3, 1) * 0.7} k={0.3} /></Territorio>
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
  // Foto real desde el principio (izquierda, centro 560,500, R 330: 1 px de la foto = 0,917) y el mismo hallazgo dibujado a la derecha.
  const fo = p('foto');
  const ph = (px: number, py: number): [number, number] => [560 + (px - 360) * 0.917, 500 + (py - 360) * 0.917];
  const D = 0.55, DX = 1250, DY = 470;
  return (
    <g>
      <Bandera x={800} y={70} txt="Biopsia de pulmón: los dos componentes juntos" color="var(--cit-base)" p={p('biopsia')} t={28} punta="no" />
      <FotoLente x={560} y={500} R={330} foto="gpa-pulmon" o={fo} />
      <Portaobjetos x={180} y={895} k={0.95} o={tramo(p('biopsia'), 0.2, 0.8)} organo="PULMÓN" tincion="H-E" caso="GPA · biopsia" />
      <Txt x={190} y={812} txt="lámina de pulmón, teñida con H-E" t={18} p={p('biopsia')} fuerte={false} />
      <Lente x={DX} y={DY} R={215} id="c5-gpa" o={tramo(p('biopsia'), 0.3, 0.8)}>
        <g transform={`scale(${D})`}>
          <rect x={-420} y={-420} width={840} height={840} fill="#F6D6E6" />
          <Granuloma x={-110} y={0} k={0.95} p={p('granuloma')} necrosis={p('granuloma')} />
          <VasoFibrinoide x={220} y={-40} k={0.95} o={tramo(p('vaso'), 0, 0.4)} />
        </g>
      </Lente>
      <Txt x={DX} y={DY + 250} txt="el mismo hallazgo, dibujado" t={18} p={p('biopsia')} fuerte={false} />
      {/* En el dibujo: lo que la foto no deja ver con claridad */}
      <Llamada x={960} y={200} a={[DX - 110 * D, DY]} txt="granuloma necrotizante" p={p('granuloma')} t={24} />
      <Txt x={DX} y={DY + 300} txt="empalizada de epitelioides" t={22} p={p('empalizada')} />
      <Txt x={DX} y={DY + 336} txt="y células gigantes" t={22} p={p('gigantes')} />
      <Llamada x={1300} y={226} a={[DX + 220 * D, DY - 40 * D]} txt="vaso con necrosis fibrinoide" p={p('fibrinoide')} t={20} />
      {/* En la foto: solo lo que de verdad se ve en ella */}
      <Llamada x={40} y={250} a={ph(138, 200)} txt="sangre en los alvéolos" p={tramo(fo, 0.4, 1)} halo />
      <Llamada x={40} y={660} a={ph(405, 575)} txt="vaso inflamado" p={p('vaso')} halo />
      <Llamada x={600} y={140} a={ph(600, 230)} txt="infiltrado de neutrófilos" p={p('neutros')} halo />
      <Bandera x={800} y={915} txt="Granuloma + vasculitis: su firma" color={V.turquesa[0]} p={p('firma')} t={28} />
    </g>
  );
};

const Gepa: Lamina = ({ p }) => {
  const B: [number, number] = [330, 620], K = 0.95;
  const pt = (dx: number, dy: number): [number, number] => [B[0] + dx * K, B[1] + dy * K];
  return (
    <g>
      <Bandera x={800} y={70} txt="Granulomatosis eosinofílica con poliangeítis" color={V.ambar[0]} p={p('gepa')} t={28} punta="no" />
      <Txt x={800} y={140} txt="inflamación tipo 2 + vasculitis necrotizante" t={24} p={p('componentes')} />
      <AntiDe x={1380} y={215} cual="mpo" o={tramo(p('mpo'), 0, 0.4)} />
      <Txt x={1380} y={345} txt="anti-MPO" t={24} p={p('mpo')} />
      <Txt x={1380} y={377} txt="en 4 de cada 10" t={19} p={p('mpo')} fuerte={false} />
      <Inhalador x={1300} y={560} k={0.75} spray={p('pista')} o={tramo(p('pista'), 0, 0.4)} />
      <Sale p={tramo(p('pista'), 0.2, 1)} x={1460} y={560} k={0.75}><Eosinofilo /></Sale>
      <Txt x={1380} y={660} txt="la pista: asma + eosinofilia" t={22} p={p('pista')} />
      <Cuerpo x={B[0]} y={B[1]} k={K} o={tramo(p('superior'), 0, 0.4)}>
        {([['superior', 22, -268], ['pulmon', -36, -120], ['piel', -60, 260], ['corazon', 20, -150]] as const).map(([n, dx, dy]) => <Punto key={n} x={dx} y={dy} p={p(n)} />)}
      </Cuerpo>
      <Territorio desde={pt(22, -268)} en={[740, 290]} p={p('superior')} nombre="vía aérea superior" sub="rinosinusitis y pólipos"><Perfil quien="ella" polipo={1} k={0.3} y={10} /></Territorio>
      <Territorio desde={pt(-36, -120)} en={[740, 470]} p={p('pulmon')} nombre="pulmón" sub="asma, sibilancias, infiltrados"><Pulmones infiltrados={tramo(p('pulmon'), 0.3, 1)} k={0.34} y={10} /></Territorio>
      <Territorio desde={pt(-60, 260)} en={[740, 650]} p={p('piel')} nombre="piel" sub="púrpura palpable"><PiernaPurpura p={1} k={0.25} /></Territorio>
      <Territorio desde={pt(20, -150)} en={[740, 840]} p={p('corazon')} nombre="corazón" sub="miocarditis eosinofílica"><Corazon k={0.48} />{[[-30, -10], [20, 20], [10, -40]].map(([ex, ey], i) => <Eosinofilo key={i} x={ex} y={ey} k={0.22} />)}</Territorio>
    </g>
  );
};

const BiopsiaGepa: Lamina = ({ p }) => {
  const f = p('fases');
  // Foto real desde el principio (centro 360,380, R 250: 1 px de la foto = 0,694).
  const ph = (px: number, py: number): [number, number] => [360 + (px - 360) * 0.694, 380 + (py - 360) * 0.694];
  return (
    <g>
      <FotoLente x={360} y={380} R={250} foto="gepa-vaso" o={clamp(p('biopsia') + p('foto'))} />
      <Portaobjetos x={830} y={530} k={0.9} o={tramo(p('biopsia'), 0.2, 0.8)} organo="VASO" tincion="H-E" caso="GEPA" />
      <Txt x={830} y={462} txt="lámina de un vaso, teñida con H-E" t={18} p={p('foto')} fuerte={false} />
      <Llamada x={680} y={180} a={ph(420, 290)} txt="pared con necrosis fibrinoide" p={p('eos')} t={24} halo />
      <Llamada x={680} y={235} a={ph(170, 170)} txt="infiltrado rico en eosinófilos" p={tramo(p('eos'), 0.3, 1)} t={24} halo />
      <Llamada x={680} y={290} a={ph(320, 400)} txt="la luz, con hematíes" p={tramo(p('eos'), 0.5, 1)} t={22} halo />
      <Txt x={1080} y={360} txt="también en pulmón y miocardio" t={22} p={p('eos')} ancla="start" fuerte={false} />
      <Txt x={1080} y={410} txt="granulomas, si los hay, fuera del vaso" t={22} p={p('extravascular')} ancla="start" />
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
      <AntiDe x={250} y={570} cual="mpo" k={0.8} o={tramo(p('mpo'), 0, 0.4)} />
      <Txt x={320} y={590} txt="anti-MPO positivos" t={24} p={p('mpo')} ancla="start" />
      <Txt x={320} y={625} txt="genes HLA-DQ" t={19} p={p('mpo')} ancla="start" fuerte={false} />
      <Txt x={420} y={700} txt="más vasculitis" t={22} p={p('vasculitis')} />
      <Pista x={250} y={800} p={p('vasculitis')} nombre="púrpura" dy={95}><PiernaPurpura p={1} k={0.25} /></Pista>
      <Pista x={420} y={800} p={tramo(p('vasculitis'), 0.2, 1)} nombre="glomerulonefritis" dy={95}><Glomerulo necrosis={1} k={0.26} /></Pista>
      <Pista x={590} y={800} p={tramo(p('vasculitis'), 0.4, 1)} nombre="neuropatía" dy={95}><NervioCorte inf={1} k={0.8} /></Pista>
      <Txt x={1200} y={590} txt="ANCA negativos" t={24} p={p('negativos')} />
      <Txt x={1200} y={625} txt="genes de la IL-5 y de la barrera epitelial" t={19} p={p('negativos')} fuerte={false} />
      <Txt x={1200} y={700} txt="más corazón y pulmón" t={22} p={p('corazon')} />
      <Pista x={1110} y={815} p={p('corazon')} nombre="miocarditis" dy={80}><Corazon k={0.42} /></Pista>
      <Pista x={1290} y={800} p={tramo(p('corazon'), 0.2, 1)} nombre="asma, infiltrados" dy={95}><Pulmones infiltrados={1} k={0.36} y={10} /></Pista>
      <Bandera x={800} y={962} txt="Casi dos enfermedades en una" color="var(--cit-base)" p={p('dos')} t={30} />
    </g>
  );
};

const Pam: Lamina = ({ p }) => {
  const B: [number, number] = [330, 640], K = 0.95;
  const pt = (dx: number, dy: number): [number, number] => [B[0] + dx * K, B[1] + dy * K];
  const sin = (i: number) => tramo(p('sin'), i * 0.15, 0.5 + i * 0.15);
  return (
    <g>
      <Bandera x={800} y={70} txt="Poliangeítis microscópica: la vasculitis necrotizante pura" color="#B8237A" p={p('pam')} t={28} punta="no" />
      {/* Lo que no tiene: granulomas, asma, eosinófilos */}
      <Sale p={sin(0)} x={1130} y={240} k={0.2}><Granuloma necrosis={1} /></Sale>
      <Inhalador x={1270} y={250} k={0.6} o={tramo(sin(1), 0, 0.4)} />
      <Sale p={sin(2)} x={1410} y={240} k={0.6}><Eosinofilo /></Sale>
      {[0, 1, 2].map((i) => <Cruz key={i} x={1130 + i * 140} y={240} k={0.7} p={sin(i)} />)}
      <Txt x={1270} y={330} txt="sin granulomas, sin asma, sin eosinófilos" t={20} p={sin(2)} />
      <AntiDe x={1300} y={450} cual="mpo" o={tramo(p('mpo'), 0, 0.4)} />
      <Txt x={1300} y={565} txt="anti-MPO" t={24} p={p('mpo')} />
      <Cuerpo x={B[0]} y={B[1]} k={K} o={tramo(p('rinon'), 0, 0.4)}>
        {([['rinon', 44, -40], ['pulmon', -36, -120], ['piel', -60, 260], ['nervios', 70, 150]] as const).map(([n, dx, dy]) => <Punto key={n} x={dx} y={dy} p={p(n)} />)}
      </Cuerpo>
      <Territorio desde={pt(44, -40)} en={[700, 260]} p={p('rinon')} nombre="riñón" sub="glomerulonefritis pauciinmune"><Glomerulo necrosis={1} semiluna={0.6} k={0.26} /></Territorio>
      <Territorio desde={pt(-36, -120)} en={[700, 450]} p={p('pulmon')} nombre="pulmón" sub="capilaritis, hemorragia alveolar"><Pulmones sangre={tramo(p('pulmon'), 0.3, 1)} k={0.34} y={10} /></Territorio>
      <Territorio desde={pt(-60, 260)} en={[700, 640]} p={p('piel')} nombre="piel" sub="púrpura palpable"><PiernaPurpura p={1} k={0.24} /></Territorio>
      <Territorio desde={pt(70, 150)} en={[700, 830]} p={p('nervios')} nombre="nervios periféricos" sub="mononeuritis múltiple"><NervioCorte inf={tramo(p('nervios'), 0.3, 1)} k={0.85} /></Territorio>
    </g>
  );
};

/** Pierna de perfil con el pie que cae (pie caído por mononeuritis del peroneo). */
function PiernaCae({ cae = 0 }: { cae?: number }) {
  const ang = lerp(0, 38, easeOut(clamp(cae)));
  return (
    <g>
      <path d="M-40,-170 C-44,-110 -40,-50 -30,-6 L22,-6 C30,-60 34,-120 32,-170 Z" fill={V.piel[0]} transform="translate(4,4)" />
      <path d="M-40,-170 C-44,-110 -40,-50 -30,-6 L22,-6 C30,-60 34,-120 32,-170 Z" fill={V.piel[1]} />
      <path d="M-28,-150 C-30,-100 -26,-50 -20,-14" fill="none" stroke={V.piel[2]} strokeWidth={8} strokeLinecap="round" />
      <g transform={`rotate(${ang.toFixed(1)} -4 4)`}>
        <path d="M-34,-10 C-46,10 -40,34 -14,36 L120,36 C140,36 150,26 146,14 C142,2 120,-2 96,-2 L20,-14 C4,-18 -24,-22 -34,-10 Z" fill={V.piel[0]} transform="translate(3,3)" />
        <path d="M-34,-10 C-46,10 -40,34 -14,36 L120,36 C140,36 150,26 146,14 C142,2 120,-2 96,-2 L20,-14 C4,-18 -24,-22 -34,-10 Z" fill={V.piel[1]} />
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={128 - i * 10} cy={30 - i * 2} rx={8} ry={6} fill={V.piel[2]} opacity={0.7} />)}
      </g>
      <circle cx={-6} cy={0} r={12} fill={V.piel[0]} opacity={0.6} />
      {cae > 0.3 && <path d="M100,-40 C140,-20 150,20 140,60" fill="none" stroke={V.sangre[1]} strokeWidth={5} strokeDasharray="8 7" opacity={tramo(cae, 0.3, 1)} />}
    </g>
  );
}

const Mononeuritis: Lamina = ({ p }) => {
  const ci = p('cierra');
  return (
    <g>
      <Bandera x={800} y={70} txt="¿Por qué los nervios?" color="var(--cit-base)" p={p('nervios')} t={30} punta="no" />
      <Nervio x={800} y={300} w={1100} isquemia={ci} o={tramo(p('nervios'), 0, 0.4)} />
      <Llamada x={140} y={170} a={[420, 234]} txt="vasa nervorum: lo nutre" p={p('vasa')} />
      <Txt x={1100} y={420} txt="la vasculitis los cierra: el nervio se queda sin sangre" t={24} p={ci} />
      <Sale p={p('cae')} x={400} y={600} k={1}><PiernaCae cae={p('cae')} /></Sale>
      <Txt x={420} y={800} txt="un pie que cae de repente" t={24} p={p('cae')} />
      <Nervio x={1150} y={620} w={500} k={0.8} isquemia={tramo(p('otro'), 0, 1)} o={tramo(p('otro'), 0, 0.4)} />
      <Txt x={1150} y={720} txt="y luego otro nervio, en otro lugar" t={24} p={p('otro')} />
      <Bandera x={800} y={850} txt="Mononeuritis múltiple" color={V.ambar[0]} p={p('mononeuritis')} t={30} />
      <Txt x={800} y={930} txt="biopsia: necrosis fibrinoide, neutrófilos, sin granulomas" t={24} p={p('biopsia')} fuerte={false} />
    </g>
  );
};

/** Virus de la hepatitis C: envoltura con sus glicoproteínas E1/E2, cápside y ARN. */
function Vhc({ reloj = 0 }: { reloj?: number }) {
  return (
    <g transform={`translate(0,${Math.sin(reloj / 420) * 6})`}>
      {Array.from({ length: 14 }, (_, i) => <g key={i} transform={`rotate(${(i / 14) * 360})`}><rect x={46} y={-7} width={12} height={6} rx={3} fill="#C46A00" /><rect x={46} y={1} width={16} height={6} rx={3} fill="#FF9F1C" /></g>)}
      <circle r={50} fill="#C46A00" /><circle cx={-3} cy={-3} r={45} fill="#FFD27A" />
      <circle r={28} fill="#E5A32E" /><circle r={23} fill="#FFE8B0" />
      <path d="M-16,-6 C-10,-18 2,-14 4,-4 C6,6 16,10 18,0" fill="none" stroke="#C2410C" strokeWidth={4} strokeLinecap="round" />
      <circle cx={-22} cy={-26} r={6} fill="#FFF" opacity={0.75} />
    </g>
  );
}

/** Fracción C4 del complemento: proteína de tres lóbulos. */
function C4({ x, y, o = 1 }: { x: number; y: number; o?: number }) {
  if (o <= 0.002) return null;
  return <En x={x} y={y} o={o}>{[[-10, 0], [8, -8], [8, 10]].map(([cx, cy], i) => <g key={i}><circle cx={cx + 2} cy={cy + 2} r={13} fill="#C46A00" /><circle cx={cx} cy={cy} r={12} fill="#FFB21E" /></g>)}<circle cx={-14} cy={-4} r={3} fill="#FFF" opacity={0.8} /></En>;
}

const Crio: Lamina = ({ p, reloj }) => {
  const fr = p('frio');
  return (
    <g>
      <Txt x={800} y={70} txt="las de inmunocomplejos tendrán su propio laboratorio" t={26} p={p('propio')} fuerte={false} />
      <Bandera x={800} y={140} txt="Aquí, solo una: la crioglobulinémica" color="#2F6FD8" p={p('crio')} t={28} punta="no" />
      <Sale p={p('vhc')} x={200} y={420} k={1}><Vhc reloj={reloj} /></Sale>
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
      {[0, 1, 2, 3, 4].map((i) => <C4 key={i} x={260 + i * 70} y={790 - tramo(p('c4'), i * 0.12, 0.5 + i * 0.12) * 60} o={1 - tramo(p('c4'), i * 0.12, 0.5 + i * 0.12)} />)}
      {[0, 1, 2].map((i) => <Complejo key={i} x={330 + i * 100} y={800} k={0.75} o={tramo(p('c4'), 0, 0.4)} />)}
      <Barra x={760} y={790} w={340} val={1 - 0.75 * p('c4')} color={V.ambar[1]} txt="C4" p={p('c4')} />
      <Txt x={600} y={900} txt="los complejos consumen el complemento: C4 bajo" t={22} p={p('c4')} />
    </g>
  );
};

const AncaLab: Lamina = ({ p }) => {
  return (
    <g>
      <Pantalla x={800} y={520} w={1400} h={820} p={p('detalle')}>
        <TxtPantalla x={0} y={-320} txt="Inmunofluorescencia en neutrófilos fijados con etanol" t={30} p={p('etanol')} />
        <NeutroIF x={-330} y={-75} tipo="c" p={p('pr3')} />
        <FotoLente x={-330} y={-75} R={140} foto="c-anca" o={p('canca')} credito="arriba" aro={V.verde[0]} tinta="#BFF5CB" />
        <Portaobjetos x={-330} y={255} k={0.85} o={p('canca')} organo="NEUTRÓFILOS" tincion="IFI · FITC" caso="suero anti-PR3" tejido="#DCE8F0" />
        <TxtPantalla x={-330} y={110} txt="PR3: se queda en los gránulos" t={24} p={p('pr3')} />
        <TxtPantalla x={-330} y={170} txt="c-ANCA · granular citoplasmático" t={30} p={p('canca')} />
        <NeutroIF x={330} y={-75} tipo="p" p={p('mpo')} />
        <FotoLente x={330} y={-75} R={140} foto="p-anca" o={p('panca')} credito="arriba" aro={V.verde[0]} tinta="#BFF5CB" />
        <Portaobjetos x={330} y={255} k={0.85} o={p('panca')} organo="NEUTRÓFILOS" tincion="IFI · FITC" caso="suero anti-MPO" tejido="#DCE8F0" />
        <TxtPantalla x={330} y={110} txt="MPO: carga +, se corre al núcleo" t={24} p={p('mpo')} />
        <TxtPantalla x={330} y={170} txt="p-ANCA · perinuclear" t={30} p={p('panca')} />
        <TxtPantalla x={0} y={350} txt="después se confirma midiendo cada anticuerpo" t={26} p={p('confirma')} />
      </Pantalla>
    </g>
  );
};

/** Ficha de una enfermedad: sus pistas como dibujos pequeños con su nombre, y una flecha al diagnóstico. */
function Ficha({ x, nombre, color, pistas, ps, final }: { x: number; nombre: string; color: string; pistas: [string, ReactNode][]; ps: number[]; final: number }) {
  return (
    <g>
      {pistas.map(([t, icono], i) => (
        <g key={t}>
          <Sale p={ps[i]} x={x - 150} y={200 + i * 120}>{icono}</Sale>
          <Txt x={x - 80} y={200 + i * 120} txt={t} t={22} p={ps[i]} ancla="start" />
        </g>
      ))}
      <Flecha a={[x, 200 + pistas.length * 120 - 50]} b={[x, 200 + pistas.length * 120 + 20]} p={final} color={FLECHA} w={7} />
      <Bandera x={x} y={200 + pistas.length * 120 + 80} txt={nombre} color={color} p={final} t={32} punta="no" />
    </g>
  );
}

/** Icono tachado (lo que falta). */
function Sin({ children }: { children: ReactNode }) {
  return <g>{children}<path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#E5324C" strokeWidth={9} strokeLinecap="round" /></g>;
}

const Junta: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Ahora, junta las piezas" color="var(--cit-base)" p={p('junta')} t={30} punta="no" />
      <Ficha x={420} color={V.ambar[0]} nombre="GEPA" pistas={[
        ['asma de inicio adulto', <Inhalador key="a" k={0.55} />],
        ['eosinofilia marcada', <Eosinofilo key="e" k={0.5} />],
        ['infiltrados pulmonares', <Pulmones key="p" infiltrados={1} k={0.2} />],
        ['vasculitis', <VasoFibrinoide key="v" x={0} y={0} k={0.3} />],
      ]} ps={[p('asma'), p('eos'), p('infiltrados'), p('vasculitis')]} final={p('gepa')} />
      <Ficha x={1180} color="#B8237A" nombre="PAM" pistas={[
        ['glomerulonefritis pauciinmune', <Glomerulo key="g" necrosis={1} semiluna={0.6} k={0.12} />],
        ['hemorragia alveolar', <Pulmones key="h" sangre={1} k={0.2} />],
        ['anti-MPO', <AntiDe key="m" x={0} y={-20} cual="mpo" k={0.55} />],
        ['sin asma ni granulomas', <Sin key="s"><Inhalador k={0.45} /></Sin>],
      ]} ps={[p('gn'), p('hemorragia'), p('mpo'), p('sinasma')]} final={p('pam')} />
    </g>
  );
};

const JuntaGpa: Lamina = ({ p }) => {
  return (
    <g>
      <Ficha x={420} color={V.turquesa[0]} nombre="GPA" pistas={[
        ['sinusitis crónica', <Perfil key="s" quien="el" costras={1} hundida={0.6} k={0.17} y={5} />],
        ['nódulos pulmonares cavitados', <Pulmones key="n" nodulos={1} k={0.2} />],
        ['glomerulonefritis pauciinmune', <Glomerulo key="g" necrosis={1} semiluna={0.6} k={0.12} />],
        ['anti-PR3', <AntiDe key="a" x={0} y={-20} cual="pr3" k={0.55} />],
      ]} ps={[p('sinusitis'), p('nodulos'), p('gn'), p('pr3')]} final={p('gpa')} />
      <Txt x={1160} y={250} txt="una trampa frecuente" t={30} p={p('trampa')} color={V.sangre[1]} />
      <Sale p={p('trampa')} x={1160} y={480} k={0.6}><Glomerulo necrosis={1} semiluna={0.8} /></Sale>
      <Txt x={1160} y={690} txt="la glomerulonefritis pauciinmune" t={24} p={p('trampa')} />
      <Txt x={1160} y={728} txt="no es exclusiva de una sola" t={24} p={p('trampa')} />
      <Flecha a={[1120, 760]} b={[1030, 820]} p={p('ambas')} color={FLECHA} w={6} />
      <Flecha a={[1200, 760]} b={[1290, 820]} p={p('ambas')} color={FLECHA} w={6} />
      <Bandera x={1010} y={860} txt="GPA" color={V.turquesa[0]} p={p('ambas')} t={28} punta="no" />
      <Bandera x={1310} y={860} txt="PAM" color="#B8237A" p={p('ambas')} t={28} punta="no" />
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
