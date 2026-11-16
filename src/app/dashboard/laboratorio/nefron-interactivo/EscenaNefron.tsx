'use client';
// Escena del nefrón entero (lienzo de 1200 × 1000), en el estilo plano de
// docs/nefron/ESTILO.md: sin bordes, cada tubo con su sombra, su brillo y un
// guion oscuro por célula; luz oscura donde brilla el filtrado. Va en dos SVG
// con el mismo viewBox: abajo lo fijo (este archivo) y arriba los rótulos y las
// áreas de toque (Lienzo.tsx). En medio, el canvas con el filtrado.

import { memo, useId } from 'react';
import { SEGMENTOS } from '@/lib/data/nefron/segmentos.ts';
import type { CelulaId, TramoId } from '@/lib/data/nefron/tipos.ts';
import {
  ALTO, ANCHO, CORTICAL, CUENTAS, GLOMERULO, GLOMERULO_CORTICAL, OTROS_CONECTORES, TRAMOS, TRAMOS_GEO, VASOS, ZONAS,
  curva, polilinea, type Cuenta, type P,
} from './engine/geometria';
import { BOKEH, brillo, sombra } from './engine/paleta';
import nf from '@/styles/nefron.module.css';

/** Color de cada tipo de célula sobre la pared (los demás, el de su segmento). */
export const COLOR_CELULA: Partial<Record<CelulaId, string>> = {
  principal: '#d9a6ff',
  'intercalada-a': '#ff4f8b',
  'intercalada-b': '#3fb0ff',
  'macula-densa': '#2b3fd6',
  'medular-interna': '#9d4edd',
};
export const colorCelula = (c: CelulaId, tramo: TramoId) => COLOR_CELULA[c] ?? SEGMENTOS[tramo].color;

export const ARTERIA = '#ef3a5d';
export const VENA = '#5b5bd6';

/** El fondo sigue mucho más allá del nefrón: la cámara (MARGEN) nunca llega a su borde. */
const FONDO = 3000;

const linea = (pts: P[]) => polilinea(curva(pts, 3));

export interface Halo { tramo: TramoId | 'glomerulo'; color: string; fuerte: boolean }

/** Un vaso plano: sombra corrida, cuerpo y brillo fino. */
function Vaso({ pts, color, w, op = 1 }: { pts: string; color: string; w: number; op?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={op}>
      <polyline points={pts} stroke={sombra(color)} strokeWidth={w} transform="translate(1.5 2.5)" />
      <polyline points={pts} stroke={color} strokeWidth={w} />
      <polyline points={pts} stroke={brillo(color)} strokeWidth={Math.max(1, w * 0.28)} transform={`translate(${-w * 0.16} ${-w * 0.16})`} opacity={0.75} />
    </g>
  );
}

/** Asas del ovillo glomerular: rosquillas rojas con sombra y brillo. */
const ASAS: Array<[number, number, number]> = [
  [0, -14, 17], [-20, -2, 15], [20, -4, 16], [-12, 18, 15], [14, 18, 15], [0, 4, 13], [-26, -22, 11], [26, -24, 11],
];

/** Lo fijo del dibujo. Solo se repinta si cambian sus opciones. */
export const NefronBase = memo(function NefronBase({ osmPunta, vasos, cortical, gradiente, halos }: {
  osmPunta: number;
  vasos: boolean;
  cortical: boolean;
  gradiente: boolean;
  halos: Halo[];
}) {
  const id = useId().replace(/:/g, '');
  const fuerza = Math.min(1, Math.max(0, (osmPunta - 300) / 900));
  const g = GLOMERULO;
  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1={ZONAS.corticomedular} x2="0" y2={ZONAS.papila} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--nf-grad)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: 'var(--nf-grad)', stopOpacity: 0.1 + 0.5 * fuerza }} />
        </linearGradient>
      </defs>
      {/* Zonas del riñón */}
      <rect x={-FONDO} y={-FONDO} width={ANCHO + 2 * FONDO} height={ZONAS.corticomedular + FONDO} fill="var(--nf-corteza)" />
      <rect x={-FONDO} y={ZONAS.corticomedular} width={ANCHO + 2 * FONDO} height={ZONAS.medulaInterna - ZONAS.corticomedular} fill="var(--nf-medula-ext)" />
      <rect x={-FONDO} y={ZONAS.medulaInterna} width={ANCHO + 2 * FONDO} height={ZONAS.papila - ZONAS.medulaInterna} fill="var(--nf-medula-int)" />
      {gradiente && <rect x={-FONDO} y={ZONAS.corticomedular} width={ANCHO + 2 * FONDO} height={ZONAS.papila - ZONAS.corticomedular} fill={`url(#grad-${id})`} />}
      <rect x={-FONDO} y={ZONAS.papila} width={ANCHO + 2 * FONDO} height={ALTO - ZONAS.papila + FONDO} fill="var(--nf-caliz)" />
      {/* Cápsula renal: una franja fina en el borde de la corteza */}
      <rect x={-FONDO} y={-4} width={ANCHO + 2 * FONDO} height={ZONAS.capsula + 4} fill="var(--nf-capsula-renal)" />

      {/* Círculos tenues del fondo */}
      <g fill="var(--nf-bokeh)">
        {[-1, 0, 1].flatMap((i) => [-1, 0, 1].map((j) => BOKEH.map(([x, y, r], k) => (
          <circle key={`${i}.${j}.${k}`} cx={(x + i) * ANCHO} cy={(y + j) * ALTO} r={r * ANCHO} />
        ))))}
      </g>

      {/* Vasos */}
      {vasos && (
        <g>
          <Vaso pts={linea(VASOS.venaArcuata)} color={VENA} w={10} op={0.9} />
          <Vaso pts={linea(VASOS.arteriaArcuata)} color={ARTERIA} w={9} />
          <Vaso pts={linea(VASOS.radiada)} color={ARTERIA} w={7} />
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={ARTERIA} strokeWidth={3} opacity={0.5}>
            {VASOS.capilares.map((c, i) => <polyline key={i} points={linea(c)} />)}
          </g>
          <Vaso pts={linea(VASOS.rectaDesc)} color={ARTERIA} w={4.5} op={0.7} />
          <Vaso pts={linea(VASOS.rectaAsc)} color={VENA} w={5} op={0.7} />
        </g>
      )}

      {/* Nefrón cortical, de fondo */}
      {cortical && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.38}>
          {CORTICAL.map((c, i) => (
            <g key={i}>
              <polyline points={linea(c)} stroke="var(--nf-cortical)" strokeWidth={15} />
              <polyline points={linea(c)} stroke="var(--nf-luz)" strokeWidth={6} />
            </g>
          ))}
          <circle cx={GLOMERULO_CORTICAL.c[0]} cy={GLOMERULO_CORTICAL.c[1]} r={GLOMERULO_CORTICAL.r} fill="var(--nf-luz)" stroke="var(--nf-cortical)" strokeWidth={5} />
          <circle cx={GLOMERULO_CORTICAL.c[0]} cy={GLOMERULO_CORTICAL.c[1]} r={GLOMERULO_CORTICAL.ovillo} fill={ARTERIA} />
        </g>
      )}
      {/* Otros conectores que vacían en el colector */}
      <g fill="none" strokeLinecap="round" opacity={0.6}>
        {OTROS_CONECTORES.map((c, i) => (
          <g key={i}>
            <polyline points={linea(c)} stroke={SEGMENTOS['colector-cortical'].color} strokeWidth={i === 0 ? 30 : 18} />
            <polyline points={linea(c)} stroke="var(--nf-luz)" strokeWidth={i === 0 ? 16 : 8} />
          </g>
        ))}
      </g>

      {/* Halos: lo elegido, lo señalado y lo afectado */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {halos.map((h, i) => h.tramo === 'glomerulo'
          ? <circle key={i} cx={g.c[0]} cy={g.c[1]} r={g.r + 12} stroke={h.color} strokeWidth={h.fuerte ? 12 : 8} opacity={h.fuerte ? 0.85 : 0.5} />
          : <polyline key={i} points={polilinea(TRAMOS_GEO[h.tramo].muestras)} stroke={h.color} strokeWidth={TRAMOS_GEO[h.tramo].ancho + (h.fuerte ? 18 : 12)} opacity={h.fuerte ? 0.8 : 0.48} />)}
      </g>

      {/* Arteriolas del glomérulo (siempre) */}
      <Vaso pts={linea(VASOS.aferente)} color={ARTERIA} w={8} />
      <Vaso pts={linea(VASOS.eferente)} color={ARTERIA} w={6} op={0.9} />

      {/* Cápsula de Bowman y ovillo */}
      <circle cx={g.c[0] + 2} cy={g.c[1] + 4} r={g.r + 3} fill={sombra('#c99be8')} />
      <circle cx={g.c[0]} cy={g.c[1]} r={g.r + 3} fill="#c99be8" />
      <circle cx={g.c[0]} cy={g.c[1]} r={g.r - 4} fill="var(--nf-luz)" />
      <path d={`M${g.c[0] - g.r * 0.7} ${g.c[1] - g.r * 0.62}A${g.r} ${g.r} 0 0 1 ${g.c[0] + g.r * 0.2} ${g.c[1] - g.r + 0.5}`} fill="none" stroke="#ead6fb" strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
      <g>
        {ASAS.map(([dx, dy, r], i) => (
          <g key={i} transform={`translate(${g.c[0] + dx} ${g.c[1] + dy})`}>
            <circle cx={1} cy={2} r={r} fill={sombra(ARTERIA)} />
            <circle r={r} fill={ARTERIA} />
            <circle r={r * 0.42} fill={sombra(ARTERIA)} opacity={0.55} />
            <ellipse cx={-r * 0.45} cy={-r * 0.45} rx={r * 0.22} ry={r * 0.15} fill="#ffffff" opacity={0.7} />
          </g>
        ))}
      </g>

      {/* Tubos: sombra, cuerpo, brillo, un guion por célula y la luz */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRAMOS.map((t) => (
          <polyline key={`s-${t}`} points={polilinea(TRAMOS_GEO[t].muestras)} stroke={sombra(SEGMENTOS[t].color)} strokeWidth={TRAMOS_GEO[t].ancho} transform="translate(2 3)" />
        ))}
        {TRAMOS.map((t) => (
          <polyline key={`c-${t}`} points={polilinea(TRAMOS_GEO[t].muestras)} stroke={SEGMENTOS[t].color} strokeWidth={TRAMOS_GEO[t].ancho} />
        ))}
        {TRAMOS.map((t) => (
          <polyline key={`b-${t}`} points={polilinea(TRAMOS_GEO[t].muestras)} stroke={brillo(SEGMENTOS[t].color)} strokeWidth={TRAMOS_GEO[t].ancho * 0.5} transform="translate(-1.5 -2)" opacity={0.55} />
        ))}
        {TRAMOS.map((t) => {
          const tg = TRAMOS_GEO[t];
          return (
            <polyline key={`g-${t}`} points={polilinea(tg.muestras)} stroke={sombra(SEGMENTOS[t].color)} strokeWidth={tg.ancho - 2} strokeLinecap="butt" strokeDasharray={`1.6 ${tg.paso - 1.6}`} opacity={0.6} />
          );
        })}
        {TRAMOS.map((t) => (
          <polyline key={`l-${t}`} points={polilinea(TRAMOS_GEO[t].muestras)} stroke="var(--nf-luz)" strokeWidth={TRAMOS_GEO[t].luz} />
        ))}
      </g>
    </g>
  );
});

/** Las células de un tramo sobre la pared (solo con zoom). */
export const CuentasTramo = memo(function CuentasTramo({ tramo, detalle, marcadas, elegida, onCuenta, onSenalar }: {
  tramo: TramoId;
  detalle: boolean;
  /** Tipos de célula marcados (clave estable: «a,b,c»). */
  marcadas: string;
  elegida: CelulaId | null;
  onCuenta: (c: Cuenta) => void;
  onSenalar: (c: CelulaId | null) => void;
}) {
  const t = TRAMOS_GEO[tramo];
  const marc = new Set(marcadas.split(',').filter(Boolean));
  const rn = Math.max(1.6, ((t.ancho - t.luz) / 2) * 0.3);
  return (
    <g>
      {CUENTAS[tramo].map((c) => {
        const m = marc.has(c.tipo);
        const e = elegida === c.tipo;
        const color = colorCelula(c.tipo, tramo);
        return (
          <g
            key={c.clave}
            className={nf.cuenta}
            onClick={(ev) => { ev.stopPropagation(); onCuenta(c); }}
            onPointerEnter={() => onSenalar(c.tipo)}
            onPointerLeave={() => onSenalar(null)}
          >
            <polygon
              points={c.poli}
              fill={color}
              stroke={e ? '#ffffff' : m ? '#7c5cd6' : sombra(color)}
              strokeWidth={e || m ? 1.6 : 0.7}
              strokeLinejoin="round"
            />
            {detalle && (
              <>
                <circle cx={c.nucleo[0] + rn * 0.2} cy={c.nucleo[1] + rn * 0.3} r={rn} fill="#d98a12" />
                <circle cx={c.nucleo[0]} cy={c.nucleo[1]} r={rn} fill="#ffc23d" />
                <circle cx={c.nucleo[0] - rn * 0.35} cy={c.nucleo[1] - rn * 0.35} r={rn * 0.32} fill="#fff3c4" />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
});
