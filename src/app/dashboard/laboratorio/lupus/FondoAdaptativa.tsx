'use client';
// Láminas del capítulo 4 («Linfocitos B y T fuera de control»).
//
// · `seleccion`: la médula ósea (selección negativa) frente a la periferia.
// · `germinal`: un folículo con su centro germinal (zona oscura y zona clara),
//   el cambio de clase IgM → IgG y la afinidad que sube.

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { easeBack, easeOut, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

function Region({ x, y, w, h, titulo, k, clase }: { x: number; y: number; w: number; h: number; titulo: string; k: number; clase: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k}>
      <rect x={x} y={y} width={w} height={h} rx={36} className={clase} />
      <text x={x + w / 2} y={y + 46} textAnchor="middle" className={s.lEtiquetaMayus}>{titulo}</text>
    </g>
  );
}

export function FondoSeleccion({ t }: { t: T }) {
  return (
    <g>
      <Region x={60} y={150} w={700} h={740} titulo="Médula ósea · selección negativa" k={v(t, 'medula')} clase={s.regionMedula} />
      <Region x={860} y={150} w={680} h={740} titulo="Periferia" k={v(t, 'periferia')} clase={s.regionPeriferia} />
      {v(t, 'periferia') > 0.001 && <path d="M760,520 L860,520" className={s.flechaComun} opacity={v(t, 'periferia')} />}
    </g>
  );
}

const G = { cx: 700, cy: 520, r: 330 };

const FoliculoFijo = memo(function FoliculoFijo() {
  const manto = Array.from({ length: 140 }, (_, i) => {
    const a = (i / 140) * Math.PI * 2, r = G.r + 18 + hash(i, 1) * 44;
    return <circle key={i} cx={G.cx + Math.cos(a) * r} cy={G.cy + Math.sin(a) * r} r={7} className={s.linfoManto} />;
  });
  return (
    <g>
      {manto}
      <circle cx={G.cx} cy={G.cy} r={G.r} className={s.zonaClara} />
      <path d={`M${G.cx},${G.cy - G.r} A${G.r},${G.r} 0 0 0 ${G.cx},${G.cy + G.r} Z`} className={s.zonaOscura} />
      {Array.from({ length: 40 }, (_, i) => {
        const a = hash(i, 3) * Math.PI * 2, r = Math.sqrt(hash(i, 4)) * (G.r - 30);
        const x = G.cx + Math.cos(a) * r, y = G.cy + Math.sin(a) * r;
        return <circle key={i} cx={x} cy={y} r={x < G.cx ? 11 : 9} className={x < G.cx ? s.centroblasto : s.centrocito} />;
      })}
    </g>
  );
});

export function FondoGerminal({ t }: { t: T }) {
  const gc = v(t, 'gc'), zo = v(t, 'zonas'), cs = v(t, 'csr'), af = v(t, 'afinidad'), au = v(t, 'aumentados');
  return (
    <g>
      {gc > 0.001 && (
        <g opacity={gc}>
          <FoliculoFijo />
          <text x={G.cx} y={G.cy - G.r - 78} textAnchor="middle" className={s.lEtiquetaMayus}>Folículo del ganglio · centro germinal</text>
        </g>
      )}
      {zo > 0.001 && (
        <g opacity={zo}>
          <text x={G.cx - 170} y={G.cy - 200} textAnchor="middle" className={s.lEtiqueta}>Zona oscura</text>
          <text x={G.cx - 170} y={G.cy - 172} textAnchor="middle" className={s.lSub}>proliferación, hipermutación</text>
          <text x={G.cx + 170} y={G.cy + 230} textAnchor="middle" className={s.lEtiqueta}>Zona clara</text>
          <text x={G.cx + 170} y={G.cy + 258} textAnchor="middle" className={s.lSub}>selección con el Tfh</text>
        </g>
      )}
      {cs > 0.001 && (
        <g opacity={cs} transform={`translate(1310,300) scale(${0.85 + 0.15 * easeBack(cs)})`}>
          <text y={-60} textAnchor="middle" className={s.lEtiquetaMayus}>Cambio de clase</text>
          <rect x={-200} y={-30} width={150} height={60} rx={30} fill="#8A4FCF" />
          <text x={-125} dy="0.35em" textAnchor="middle" className={s.chipTxtBlanco}>IgM</text>
          <path d="M-40,0 L30,0 M18,-12 L32,0 L18,12" className={s.flechaComun} />
          <rect x={50} y={-30} width={150} height={60} rx={30} fill={L.ana} />
          <text x={125} dy="0.35em" textAnchor="middle" className={s.chipTxtBlanco}>IgG</text>
        </g>
      )}
      {af > 0.001 && (
        <g transform="translate(1310,470)">
          <text y={-40} textAnchor="middle" className={s.lEtiquetaMayus}>Afinidad</text>
          <rect x={-200} y={-16} width={400} height={32} rx={16} className={s.rielEspectro} />
          <rect x={-200} y={-16} width={400 * (0.15 + 0.85 * easeOut(af))} height={32} rx={16} fill={L.lupus} />
          <text y={48} textAnchor="middle" className={s.lSub}>cada vez más afines</text>
        </g>
      )}
      {au > 0.001 && (
        <g opacity={au} transform="translate(1310,640)">
          <rect x={-230} y={-30} width={460} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>En el lupus: Tfh aumentados</text>
        </g>
      )}
    </g>
  );
}
