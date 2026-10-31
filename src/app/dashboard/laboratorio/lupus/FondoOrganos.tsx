'use client';
// Láminas del capítulo 8 (corazón, serosas, bazo y pulmón):
// · `valva`: el corazón y la válvula mitral ampliada con las vegetaciones
//   verrugosas de Libman-Sacks a ambos lados, estériles, y un émbolo.
// · `coronaria`: una coronaria con la placa de aterosclerosis que crece.
// · `torax`: pulmones y corazón con la pleura y el pericardio inflamados y sus derrames.
// · `cebolla`: el bazo y la arteria peniciliar en «hojas de cebolla».
// · `pulmon`: la enfermedad intersticial y la hipertensión pulmonar.

import { memo } from 'react';
import { IconoOrgano, dibujar, easeBack, easeOut, tramo, v, type T } from './laminas';
import { ARTERIA, CONTORNO, Corazon, Globulo, Pulmones, Tubo, VENA } from './Anatomia';
import s from '@/styles/lupus.module.css';

const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ─── Válvula ──────────────────────────────────────────────────────────────────

const VZ = { cx: 840, cy: 500, r: 270 };
const VEG = [[-120, -40, 1], [-70, -60, -1], [-30, -64, 1], [40, -60, -1], [90, -40, 1], [-100, -20, -1], [60, -30, 1]];

export function FondoValva({ t }: { t: T }) {
  const co = v(t, 'corazon'), va = v(t, 'valva'), ve = v(t, 'vegetaciones'), es = v(t, 'esteril'), em = v(t, 'embolo');
  return (
    <g>
      {co > 0.001 && (
        <g opacity={co}>
          <IconoOrgano i="corazon" x={300} y={500} k={3.4 * (0.85 + 0.15 * easeBack(co))} />
          <circle cx={340} cy={482} r={34} className={s.marcaMitral} />
          <text x={300} y={720} textAnchor="middle" className={s.lEtiqueta}>válvula mitral</text>
        </g>
      )}
      {va > 0.001 && (
        <g opacity={va}>
          <line x1={372} y1={476} x2={VZ.cx - VZ.r * 0.9} y2={VZ.cy - 90} className={s.hiloLupa} />
          <circle cx={VZ.cx} cy={VZ.cy} r={VZ.r + 7} className={s.lupaBorde} />
          <circle cx={VZ.cx} cy={VZ.cy} r={VZ.r} className={s.lupaFondoCorazon} />
          <g transform={`translate(${VZ.cx},${VZ.cy + 30})`}>
            <path d="M-210,-110 C-160,-40 -90,-10 -10,30" className={s.valvaMitral} />
            <path d="M210,-110 C160,-40 90,-10 10,30" className={s.valvaMitral} />
            {[-1, 1].map((sx) => <path key={sx} d={`M${sx * 80},10 L${sx * 60},150 M${sx * 40},26 L${sx * 30},150`} className={s.cuerda} />)}
            {VEG.map(([x, y, lado], i) => {
              const k = easeOut(tramo(ve, i * 0.1, 0.45 + i * 0.1));
              if (k <= 0) return null;
              const bx = (x < 0 ? -1 : 1) * Math.abs(x) * 1.25, by = y + (Math.abs(x) - 120) * -0.55;
              return <circle key={i} cx={bx + lado * 6} cy={by + lado * 14} r={9 * k} className={s.vegetacion} />;
            })}
          </g>
          <text x={VZ.cx} y={VZ.cy - VZ.r + 40} textAnchor="middle" className={s.lEtiquetaMayus}>valvas de la mitral</text>
        </g>
      )}
      {es > 0.001 && (
        <g opacity={es} transform={`translate(${VZ.cx},${VZ.cy + VZ.r - 50})`}>
          <rect x={-22} y={-9} width={44} height={18} rx={9} className={s.bacteria} />
          <path d="M-34,-24 L34,24" className={s.cruz} />
          <text y={50} textAnchor="middle" className={s.lEtiquetaVerde}>estériles</text>
        </g>
      )}
      {em > 0.001 && (
        <g opacity={tramo(em, 0, 0.2)}>
          <path d={`M${VZ.cx + 60},${VZ.cy + 20} C${VZ.cx + 160},${VZ.cy + 160} ${VZ.cx + 200},${VZ.cy + 300} ${VZ.cx + 230},${VZ.cy + 400}`} className={s.trayectoEmbolo} {...dibujar(em)} />
          <circle cx={VZ.cx + 60 + 170 * easeOut(em)} cy={VZ.cy + 20 + 380 * easeOut(em)} r={11} className={s.vegetacion} />
          <text x={VZ.cx + 260} y={VZ.cy + 410} className={s.lEtiquetaRoja}>émbolo</text>
        </g>
      )}
    </g>
  );
}

// ─── Coronaria ────────────────────────────────────────────────────────────────

export function FondoCoronaria({ t }: { t: T }) {
  const ar = v(t, 'arteria'), pl = v(t, 'placaAt');
  const k = easeOut(pl);
  return (
    <g opacity={ar}>
      <rect x={120} y={380} width={1360} height={240} rx={120} className={s.paredArteria} />
      <rect x={120} y={420} width={1360} height={160} rx={80} className={s.luzArteria} />
      <path d={`M${560},420 C${640},${420 + 90 * k} ${880},${420 + 90 * k} ${960},420 Z`} className={s.placaAtero} />
      <path d={`M${640},580 C${720},${580 - 50 * k} ${860},${580 - 50 * k} ${920},580 Z`} className={s.placaAtero} />
      {Array.from({ length: 8 }, (_, i) => { const x = ((i * 190) % 1300) + 180; return <Globulo key={i} x={x} y={500 + ((i % 3) - 1) * 30} r={24} rot={i * 37} ky={0.66} />; })}
      <text x={800} y={350} textAnchor="middle" className={s.lEtiquetaMayus}>Arteria coronaria</text>
      {pl > 0.5 && <text x={760} y={690} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(pl, 0.5, 1)}>placa de ateroma</text>}
    </g>
  );
}

// ─── Tórax (serosas) ──────────────────────────────────────────────────────────

/** Medidas compartidas: pulmones reales y corazón real, en sus sitios. */
const TX = { x: 490, y: 500, k: 3.6 };
const CZ = { x: 516, y: 540, k: 1.3 };
const enPulmones = `translate(${TX.x},${TX.y}) scale(${TX.k * 0.96}) translate(0,4)`;
const enCorazon = `translate(${CZ.x},${CZ.y}) scale(${CZ.k * 0.92}) translate(0,6)`;

const ToraxFijo = memo(function ToraxFijo() {
  return (
    <g>
      <path d="M140,150 C260,104 720,104 840,150 C880,320 890,650 870,880 L110,880 C90,650 100,320 140,150 Z" className={s.toraxPared} />
      {/* Costillas, apenas insinuadas detrás */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} className={s.costilla}>
          <path d={`M470,${220 + i * 76} C380,${200 + i * 78} 230,${232 + i * 80} 150,${320 + i * 74}`} />
          <path d={`M510,${220 + i * 76} C600,${200 + i * 78} 750,${232 + i * 80} 830,${320 + i * 74}`} />
        </g>
      ))}
      <path d="M180,862 C300,812 420,842 490,870 C560,842 680,812 800,862" className={s.diafragma} />
      <g transform={`translate(${TX.x},${TX.y}) scale(${TX.k})`}><Pulmones /></g>
      <g transform={`translate(${CZ.x},${CZ.y}) scale(${CZ.k})`}><Corazon /></g>
    </g>
  );
});

export function FondoTorax({ t }: { t: T }) {
  const tx = v(t, 'torax'), pl = v(t, 'pleuraI'), dp = v(t, 'derrameP'), pc = v(t, 'pericardio'), dc = v(t, 'derrameC');
  return (
    <g opacity={tx}>
      <ToraxFijo />
      {pl > 0.001 && (
        <g opacity={pl} transform={enPulmones}>
          <path d={CONTORNO.pulmonD} className={s.serosaInflamada} vectorEffect="non-scaling-stroke" />
          <path d={CONTORNO.pulmonI} className={s.serosaInflamada} vectorEffect="non-scaling-stroke" />
        </g>
      )}
      {/* Derrame pleural: se acumula en la base del pulmón, con el menisco arriba */}
      {dp > 0.001 && (
        <g transform={enPulmones} clipPath="url(#an-c-pulmond)">
          <path d={`M-100,${86 - 44 * dp} Q-50,${80 - 40 * dp} 0,${86 - 44 * dp} L0,100 L-100,100 Z`} className={s.derrame} />
        </g>
      )}
      {pc > 0.001 && <g transform={enCorazon} opacity={pc}><path d={CONTORNO.corazon} transform="scale(1.13)" className={s.serosaInflamada} vectorEffect="non-scaling-stroke" /></g>}
      {dc > 0.001 && <g transform={enCorazon} opacity={dc}><path d={CONTORNO.corazon} transform="scale(1.13)" className={s.derrameCardio} vectorEffect="non-scaling-stroke" /></g>}
      {pl > 0.5 && <text x={170} y={120} className={s.lEtiquetaRoja} opacity={tramo(pl, 0.5, 1)}>pleura</text>}
      {pc > 0.5 && (
        <g opacity={tramo(pc, 0.5, 1)}>
          <line x1={690} y1={560} x2={730} y2={440} className={s.guia} />
          <rect x={658} y={402} width={146} height={36} rx={18} className={s.chip} />
          <text x={731} y={420} dy="0.35em" textAnchor="middle" className={s.lEtiquetaRoja}>pericardio</text>
        </g>
      )}
    </g>
  );
}

// ─── Bazo: hojas de cebolla ───────────────────────────────────────────────────

export function FondoCebolla({ t }: { t: T }) {
  const ba = v(t, 'bazo'), ca = v(t, 'capasBazo');
  const n = 1 + Math.round(9 * easeOut(ca));
  const C = { x: 680, y: 560 };
  return (
    <g opacity={ba}>
      <defs>
        <radialGradient id="lp-bazo" cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#B4586E" /><stop offset="0.6" stopColor="#8E3A54" /><stop offset="1" stopColor="#5C2238" />
        </radialGradient>
      </defs>
      {/* El bazo: cara con muescas en el borde superior e hilio con sus vasos */}
      <Tubo d="M398,330 C430,352 462,372 500,388" w={12} tono={VENA} />
      <Tubo d="M404,308 C436,328 470,348 506,364" w={9} tono={ARTERIA} />
      <path d="M196,226 C210,196 236,176 262,170 L270,186 L286,164 C330,152 384,170 420,208 C448,240 450,288 428,330 C412,344 402,352 396,372 C376,420 318,456 262,444 C214,434 180,392 176,338 C172,296 180,258 196,226 Z" fill="url(#lp-bazo)" stroke="#4A1A2C" strokeWidth={2} />
      <path d="M262,170 L270,186 L252,214 M286,164 L300,190" fill="none" stroke="#4A1A2C" strokeWidth={2.2} opacity={0.6} />
      <ellipse cx={258} cy={266} rx={56} ry={34} fill="url(#an-brillo)" opacity={0.42} transform="rotate(-30 258 266)" />
      <text x={330} y={510} textAnchor="middle" className={s.lEtiqueta}>bazo</text>
      <circle cx={420} cy={330} r={22} className={s.marcaMitral} />
      <line x1={438} y1={344} x2={C.x - 250} y2={C.y - 140} className={s.hiloLupa} />
      <circle cx={C.x} cy={C.y} r={300} className={s.lupaBorde} />
      <circle cx={C.x} cy={C.y} r={293} className={s.pulpaBazo} />
      {Array.from({ length: 160 }, (_, i) => { const a = hash(i, 2) * Math.PI * 2, r = 120 + hash(i, 3) * 165; return <circle key={i} cx={C.x + Math.cos(a) * r} cy={C.y + Math.sin(a) * r} r={5} className={s.linfoManto} />; })}
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={C.x} cy={C.y} r={34 + i * 13} className={s.capaCebolla} />)}
      <circle cx={C.x} cy={C.y} r={24} className={s.luzArteria} />
      <text x={C.x} y={C.y + 340} textAnchor="middle" className={s.lSub}>arteria peniciliar en corte</text>
    </g>
  );
}

// ─── Pulmón ───────────────────────────────────────────────────────────────────

export function FondoPulmon({ t }: { t: T }) {
  const pu = v(t, 'pulmones'), it = v(t, 'intersticio'), hp = v(t, 'hp');
  return (
    <g opacity={pu}>
      <ToraxFijo />
      {it > 0.001 && (
        <g opacity={it} transform={enPulmones}>
          {[['an-c-pulmond', -46], ['an-c-pulmoni', 50]].map(([id, cx]) => (
            <g key={id} clipPath={`url(#${id})`}>
              {Array.from({ length: 46 }, (_, i) => {
                const x = (cx as number) - 36 + hash(i, 1) * 72, y = -60 + hash(i, 2) * 138;
                return <path key={i} d={`M${x},${y} l${(hash(i, 3) - 0.5) * 16},${(hash(i, 4) - 0.5) * 16} l${(hash(i, 5) - 0.5) * 16},${(hash(i, 6) - 0.5) * 16}`} className={s.reticular} vectorEffect="non-scaling-stroke" />;
              })}
            </g>
          ))}
        </g>
      )}
      {it > 0.001 && <text x={490} y={86} textAnchor="middle" className={s.lEtiquetaRoja} opacity={it}>intersticio inflamado</text>}
      {hp > 0.001 && (
        <g opacity={hp}>
          <g transform={enCorazon}>
            {/* El ventrículo derecho, que carga con la presión, y la pulmonar que se ensancha */}
            <path d="M-30,-14 C-44,0 -50,24 -36,52 C-14,68 8,76 28,88 C16,60 8,30 8,-6 C4,-20 -16,-24 -30,-14 Z" className={s.ventriculoDerecho} />
            <Tubo d="M14,-24 C14,-44 20,-58 32,-66 C50,-72 66,-72 84,-68" w={21 + 11 * hp} tono={VENA} />
          </g>
          <line x1={640} y1={395} x2={690} y2={320} className={s.guia} />
          <rect x={626} y={282} width={304} height={36} rx={18} className={s.chip} />
          <text x={778} y={300} dy="0.35em" textAnchor="middle" className={s.lEtiquetaRoja}>arteria pulmonar dilatada</text>
          <line x1={470} y1={620} x2={350} y2={724} className={s.guia} />
          <rect x={226} y={724} width={224} height={36} rx={18} className={s.chip} />
          <text x={338} y={742} dy="0.35em" textAnchor="middle" className={s.lEtiquetaRoja}>ventrículo derecho</text>
        </g>
      )}
    </g>
  );
}
