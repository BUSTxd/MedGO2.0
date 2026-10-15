'use client';
// Paneles de las tres vías (portada) y su firma en miniatura (cabecera de
// Explorar). Antes eran tres tarjetas idénticas de título + pregunta; ahora
// cada vía se reconoce por su propia cadena dibujada con los colores de la
// escena, sus cifras (pasos de cada secuencia, sacados de los datos) y las
// alteraciones del linfoma de Hodgkin que la tocan.

import type { Via, ViaId } from '@/lib/data/vias-nfkb/tipos';
import { C } from '@/lib/data/vias-nfkb/colores';
import { ALTERACIONES } from '@/lib/data/vias-nfkb/alteraciones';
import { VIAS } from '@/lib/vias-nfkb/registro';
import s from '@/styles/viasNfkb.module.css';

type Nodo =
  | { t: 'receptor'; color: string; citocina?: string }
  | { t: 'grupo'; colores: string[] }
  | { t: 'adn' };

/** La cadena de cada vía, de la membrana al ADN, con los colores de la escena. */
const CADENA: Record<ViaId, Nodo[]> = {
  clasica: [
    { t: 'receptor', color: C.cd40 },
    { t: 'grupo', colores: [C.rip, C.traf] },
    { t: 'grupo', colores: [C.ikka, C.nemo, C.ikkb] },
    { t: 'grupo', colores: [C.p50, C.p65] },
    { t: 'adn' },
  ],
  alternativa: [
    { t: 'receptor', color: C.bcma },
    { t: 'grupo', colores: [C.nik] },
    { t: 'grupo', colores: [C.ikka, C.ikka] },
    { t: 'grupo', colores: [C.p52, C.relb] },
    { t: 'adn' },
  ],
  jakstat: [
    { t: 'receptor', color: C.receptor, citocina: C.citocina },
    { t: 'grupo', colores: [C.jak] },
    { t: 'grupo', colores: [C.stat, C.stat] },
    { t: 'adn' },
  ],
};

const RX = 10.5, RY = 7.2;

/** Firma de la vía: su cadena en miniatura. `compacto` = solo los grupos, para la cabecera. */
export function MiniVia({ via, compacto }: { via: ViaId; compacto?: boolean }) {
  const nodos = compacto ? CADENA[via].filter((n) => n.t === 'grupo') : CADENA[via];
  const W = compacto ? 46 : 268, H = compacto ? 16 : 40, y = compacto ? H / 2 : 26;
  const paso = (W - (compacto ? 12 : 30)) / Math.max(1, nodos.length - 1);
  const x0 = compacto ? 6 : 15;
  const xs = nodos.map((_, i) => x0 + i * paso);
  const k = compacto ? 0.5 : 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className={compacto ? s.miniViaCompacta : s.miniVia} aria-hidden style={{ ['--recorrido' as string]: `${xs[xs.length - 1] - xs[0]}px` }}>
      <line x1={xs[0]} y1={y} x2={xs[xs.length - 1]} y2={y} className={s.miniViaLinea} />
      {nodos.map((n, i) => {
        const x = xs[i];
        if (n.t === 'receptor') {
          return (
            <g key={i}>
              <line x1={x - 13} y1={y - 9} x2={x + 13} y2={y - 9} className={s.miniViaMembrana} />
              <line x1={x - 13} y1={y - 3} x2={x + 13} y2={y - 3} className={s.miniViaMembrana} />
              <rect x={x - 4} y={y - 20} width={8} height={22} rx={3} fill={n.color} stroke="rgba(0,0,0,.28)" />
              {n.citocina && <circle cx={x} cy={y - 23} r={4.5} fill={n.citocina} stroke="rgba(0,0,0,.28)" />}
            </g>
          );
        }
        if (n.t === 'adn') {
          return (
            <g key={i} className={s.miniViaAdn}>
              <path d={`M${x - 12},${y + 4} q3,-7 6,0 t6,0 t6,0 t6,0`} />
              <path d={`M${x - 12},${y + 4} q3,7 6,0 t6,0 t6,0 t6,0`} />
            </g>
          );
        }
        const ancho = RX * 1.7 * k;
        const ini = x - ((n.colores.length - 1) * ancho) / 2;
        return (
          <g key={i}>
            {n.colores.map((col, j) => (
              <ellipse key={j} cx={ini + j * ancho} cy={y} rx={RX * k} ry={RY * k} fill={col} stroke="rgba(0,0,0,.28)" strokeWidth={0.8} />
            ))}
          </g>
        );
      })}
      {!compacto && <circle cx={xs[0]} cy={y} r={3.6} className={s.miniViaPunto} />}
    </svg>
  );
}

function cifras(v: Via) {
  const fis = v.pasos.filter((p) => p.secuencia === 'Fisiología' && p.orden > 0).length;
  const lhc = v.pasos.filter((p) => p.secuencia?.startsWith('Linfoma')).length;
  return { fis, lhc };
}

/** Las tres vías como una lista de rutas (no tres tarjetas iguales). */
export default function PanelVias({ onVia }: { onVia: (id: ViaId) => void }) {
  return (
    <ol className={s.rutas} aria-label="Elige una vía">
      {VIAS.map((v, i) => {
        const { fis, lhc } = cifras(v);
        const alts = ALTERACIONES.filter((a) => a.via === v.id);
        return (
          <li key={v.id}>
            <button type="button" className={s.ruta} style={{ ['--via' as string]: v.color }} onClick={() => onVia(v.id)}>
              <span className={s.rutaCab}>
                <span className={s.rutaNum}>{i + 1}</span>
                <strong>{v.nombre}</strong>
              </span>
              <MiniVia via={v.id} />
              <span className={s.rutaPregunta}>{v.pregunta}</span>
              <span className={s.rutaCifras}>
                <span><b>{fis}</b> pasos</span>
                <span className={s.rutaCifraLhc}><b>{lhc}</b> en el linfoma de Hodgkin</span>
              </span>
              <span className={s.rutaAlts}>
                {alts.map((a) => <em key={a.gen}>{a.gen.replace(/ \(.*\)$/, '')}</em>)}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
