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
          <circle cx={318} cy={470} r={34} className={s.marcaMitral} />
          <text x={300} y={720} textAnchor="middle" className={s.lEtiqueta}>válvula mitral</text>
        </g>
      )}
      {va > 0.001 && (
        <g opacity={va}>
          <line x1={350} y1={470} x2={VZ.cx - VZ.r * 0.9} y2={VZ.cy - 90} className={s.hiloLupa} />
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
      {Array.from({ length: 8 }, (_, i) => { const x = ((i * 190) % 1300) + 180; return <g key={i} transform={`translate(${x},${500 + ((i % 3) - 1) * 30})`}><ellipse rx={22} ry={16} className={s.hematie} /></g>; })}
      <text x={800} y={350} textAnchor="middle" className={s.lEtiquetaMayus}>Arteria coronaria</text>
      {pl > 0.5 && <text x={760} y={690} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(pl, 0.5, 1)}>placa de ateroma</text>}
    </g>
  );
}

// ─── Tórax (serosas) ──────────────────────────────────────────────────────────

const ToraxFijo = memo(function ToraxFijo() {
  return (
    <g>
      <path d="M150,180 C150,120 830,120 830,180 L870,880 L110,880 Z" className={s.toraxPared} />
      <path d="M200,230 C260,190 400,200 430,260 L440,800 C360,830 240,830 180,790 C160,600 170,400 200,230 Z" className={s.pulmonGrande} />
      <path d="M780,230 C720,190 580,200 550,260 L540,800 C620,830 740,830 800,790 C820,600 810,400 780,230 Z" className={s.pulmonGrande} />
      <path d="M490,420 C420,400 380,470 400,540 C420,620 490,680 540,700 C600,660 640,600 640,530 C640,460 590,420 540,440 C520,420 505,418 490,420 Z" className={s.corazonGrande} />
      <path d="M180,860 L800,860" className={s.diafragma} />
    </g>
  );
});

export function FondoTorax({ t }: { t: T }) {
  const tx = v(t, 'torax'), pl = v(t, 'pleuraI'), dp = v(t, 'derrameP'), pc = v(t, 'pericardio'), dc = v(t, 'derrameC');
  return (
    <g opacity={tx}>
      <ToraxFijo />
      {pl > 0.001 && (
        <g opacity={pl}>
          <path d="M190,225 C255,180 410,192 440,256 L452,806 C365,840 236,840 170,796 C148,600 160,400 190,225 Z" className={s.serosaInflamada} />
          <path d="M790,225 C725,180 570,192 540,256 L528,806 C615,840 744,840 810,796 C832,600 820,400 790,225 Z" className={s.serosaInflamada} />
        </g>
      )}
      {dp > 0.001 && <path d={`M180,${800 - 120 * dp} Q300,${780 - 110 * dp} 440,${800 - 100 * dp} L440,820 C360,840 240,840 175,800 Z`} className={s.derrame} />}
      {pc > 0.001 && <path d="M482,404 C400,384 356,466 382,548 C404,632 486,700 540,722 C610,676 660,610 658,528 C656,450 600,404 540,426 C520,404 500,402 482,404 Z" className={s.serosaInflamada} opacity={pc} />}
      {dc > 0.001 && <path d="M482,404 C400,384 356,466 382,548 C404,632 486,700 540,722 C610,676 660,610 658,528 C656,450 600,404 540,426 C520,404 500,402 482,404 Z" className={s.derrameCardio} opacity={dc} />}
      {pl > 0.5 && <text x={160} y={150} className={s.lEtiquetaRoja} opacity={tramo(pl, 0.5, 1)}>pleura</text>}
      {pc > 0.5 && <text x={520} y={385} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(pc, 0.5, 1)}>pericardio</text>}
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
      <path d="M200,220 C260,140 420,150 470,240 C510,320 470,420 400,450 C320,480 220,450 190,380 C170,330 175,260 200,220 Z" className={s.bazo} />
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
        <g opacity={it}>
          {Array.from({ length: 70 }, (_, i) => {
            const izq = i % 2 === 0;
            const x = (izq ? 220 : 570) + hash(i, 1) * 190, y = 300 + hash(i, 2) * 480;
            return <path key={i} d={`M${x},${y} l${(hash(i, 3) - 0.5) * 50},${(hash(i, 4) - 0.5) * 50} l${(hash(i, 5) - 0.5) * 50},${(hash(i, 6) - 0.5) * 50}`} className={s.reticular} />;
          })}
          <text x={490} y={150} textAnchor="middle" className={s.lEtiquetaRoja}>intersticio inflamado</text>
        </g>
      )}
      {hp > 0.001 && (
        <g opacity={hp}>
          <path d="M520,430 C520,360 560,320 600,300 L640,330 C610,350 590,380 590,440 Z" className={s.arteriaPulmonar} transform={`scale(${1 + 0.15 * hp})`} style={{ transformOrigin: '560px 380px' }} />
          <path d="M480,560 C430,600 440,680 520,700 L540,600 Z" className={s.ventriculoDerecho} />
          <text x={650} y={290} className={s.lEtiquetaRoja}>arteria pulmonar dilatada</text>
          <text x={300} y={720} className={s.lEtiquetaRoja}>ventrículo derecho</text>
        </g>
      )}
    </g>
  );
}

