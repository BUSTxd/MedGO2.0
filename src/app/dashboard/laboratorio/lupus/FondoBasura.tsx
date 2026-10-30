'use client';
// Láminas del capítulo 2 («La basura nuclear»).
//
// · `epidermis`: un corte de piel por capas (córnea, granulosa, espinosa, basal,
//   membrana basal con sus papilas y dermis con colágeno, fibroblastos y
//   capilares). Los queratinocitos son fijos (capa `memo`) y solo se repintan
//   los que mueren: unos pocos en silencio (`apoNormal`), muchos con la UV
//   (`apoUV`) y más en el lupus (`apoMas`). Encima: la lupa de las burbujas
//   (`zoom`), el resplandor de la eferocitosis (`calma`), los medidores
//   muerte/limpieza y las barreras de la tolerancia. Macrófago, cuerpos
//   apoptóticos, nucleosomas y el linfocito son actores del motor.
// · `ciudad`: la analogía del resumen (basura ×3, camión una vez por semana,
//   la llamada a la policía = el interferón).

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { clamp, dibujar, easeBack, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// ─── Epidermis ────────────────────────────────────────────────────────────────

type Kc = { i: number; x: number; y: number; w: number; h: number; capa: 'granulosa' | 'espinosa' | 'basal' };
const KC: Kc[] = (() => {
  const out: Kc[] = [];
  let i = 0;
  const fila = (y: number, w: number, h: number, capa: Kc['capa'], off: number) => {
    for (let x = 40 + off; x < 1570; x += w + 5) out.push({ i: i++, x, y, w, h, capa });
  };
  fila(176, 112, 30, 'granulosa', 0);
  fila(238, 96, 60, 'espinosa', 30);
  fila(303, 96, 60, 'espinosa', 78);
  fila(368, 96, 60, 'espinosa', 22);
  fila(433, 96, 60, 'espinosa', 70);
  fila(497, 52, 58, 'basal', 10);
  return out;
})();
const espinosas = KC.filter((c) => c.capa === 'espinosa');
const elegir = (n: number, semilla: number, excluir: Set<number>) => {
  const out: number[] = [];
  for (let j = 0; out.length < n && j < 400; j++) {
    const c = espinosas[Math.floor(hash(j, semilla) * espinosas.length)];
    if (!excluir.has(c.i) && !out.includes(c.i)) out.push(c.i);
  }
  return out;
};
const APO_NORMAL = elegir(2, 3, new Set());
const APO_UV = elegir(13, 7, new Set(APO_NORMAL));
const APO_MAS = elegir(9, 11, new Set([...APO_NORMAL, ...APO_UV]));
/** El queratinocito al que apunta la lupa. */
const LUPA_DE = KC.find((c) => c.i === APO_UV[0])!;
const yMb = (x: number) => 538 + 16 * Math.sin(x / 95);

const EpidermisFija = memo(function EpidermisFija() {
  const mb = Array.from({ length: 81 }, (_, j) => { const x = j * 20; return `${x},${yMb(x).toFixed(1)}`; }).join(' L');
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={1080} className={s.dermisFondo} />
      {/* Dermis: colágeno, fibroblastos y capilares en las papilas */}
      {Array.from({ length: 9 }, (_, j) => {
        const y = 610 + j * 46;
        return <path key={j} d={`M-20,${y} C200,${y - 18} 400,${y + 18} 620,${y} S1040,${y - 18} 1260,${y} S1640,${y + 14} 1640,${y}`} className={s.colageno} />;
      })}
      {Array.from({ length: 14 }, (_, j) => {
        const x = 80 + hash(j, 2) * 1440, y = 600 + hash(j, 4) * 380, a = (hash(j, 6) - 0.5) * 40;
        return <g key={j} transform={`translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${a.toFixed(0)})`}><ellipse rx={30} ry={5} className={s.fibroblasto} /><ellipse rx={9} ry={3.5} className={s.nucleoFibro} /></g>;
      })}
      {[240, 540, 840, 1140, 1440].map((x) => (
        <path key={x} d={`M${x - 22},700 L${x - 22},${yMb(x) + 34} Q${x},${yMb(x) + 8} ${x + 22},${yMb(x) + 34} L${x + 22},700`} className={s.capilarPiel} />
      ))}
      {/* Membrana basal */}
      <path d={`M${mb}`} className={s.membranaBasal} />
      {/* Capa córnea: escamas sin núcleo */}
      {[104, 116, 128, 140, 152].map((y, j) => (
        <path key={y} d={`M-20,${y} ${Array.from({ length: 17 }, (_, n) => `Q${n * 100 + 50 + j * 13},${y + (n % 2 ? -5 : 5)} ${n * 100 + 100 + j * 13},${y}`).join(' ')}`} className={s.escama} />
      ))}
      {KC.map((c) => <Queratinocito key={c.i} c={c} k={0} />)}
    </g>
  );
});

function Queratinocito({ c, k }: { c: Kc; k: number }) {
  const cx = c.x + c.w / 2, cy = c.y;
  const apo = k > 0.001;
  const esc = 1 - 0.38 * easeOut(k);
  return (
    <g transform={`translate(${cx},${cy}) scale(${esc.toFixed(3)})`}>
      {apo && k > 0.25 && Array.from({ length: 6 }, (_, j) => {
        const a = (j / 6) * TAU + 0.4;
        return <circle key={j} cx={Math.cos(a) * c.w * 0.5} cy={Math.sin(a) * c.h * 0.55} r={7 * tramo(k, 0.25 + j * 0.06, 0.6 + j * 0.06)} className={s.blebPiel} />;
      })}
      <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={c.capa === 'basal' ? 12 : 16} className={apo && k > 0.4 ? s.queratinocitoApo : c.capa === 'granulosa' ? s.granulosa : s.queratinocito} />
      {c.capa === 'granulosa'
        ? [-30, -10, 12, 32].map((x) => <circle key={x} cx={x} cy={(x % 3) - 1} r={3.2} className={s.granuloQh} />)
        : apo && k > 0.4
          ? [[-7, -6], [7, -3], [-1, 8]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={5} className={s.nucleoPicnotico} />)
          : <ellipse rx={c.capa === 'basal' ? 11 : 16} ry={c.capa === 'basal' ? 15 : 12} className={c.capa === 'basal' ? s.nucleoBasal : s.nucleoQueratinocito} />}
    </g>
  );
}

const ROTULOS_CAPAS: [string, number][] = [['Capa córnea', 128], ['Granulosa', 176], ['Espinosa', 335], ['Basal', 497], ['Dermis', 598]];

function Lupa({ k }: { k: number }) {
  const cx = 1250, cy = 755, R = 180;
  const b = tramo(k, 0, 0.5), a = tramo(k, 0.5, 1);
  const burbujas = Array.from({ length: 8 }, (_, j) => {
    const ang = (j / 8) * TAU - 0.3;
    const grande = j % 2 === 0;
    return { x: Math.cos(ang) * 104, y: Math.sin(ang) * 104, r: (grande ? 40 : 26) * easeOut(tramo(b, j * 0.07, 0.5 + j * 0.06)), grande, j };
  });
  const rotulos = [
    { t: 'ADN fragmentado', x: cx - R - 18, y: cy - 110, fin: 'end' as const, px: cx - 96, py: cy - 74 },
    { t: 'nucleosomas', x: cx - R - 18, y: cy + 120, fin: 'end' as const, px: cx - 110, py: cy + 60 },
    { t: 'Ro', x: cx + R + 18, y: cy - 120, fin: 'start' as const, px: cx + 74, py: cy - 88 },
    { t: 'Sm', x: cx + R + 18, y: cy + 110, fin: 'start' as const, px: cx + 100, py: cy + 64 },
  ];
  const lx = LUPA_DE.x + LUPA_DE.w / 2, ly = LUPA_DE.y;
  return (
    <g opacity={tramo(k, 0, 0.15)}>
      <line x1={lx} y1={ly + 26} x2={cx - R * 0.5} y2={cy - R * 0.86} className={s.hiloLupa} />
      <circle cx={lx} cy={ly} r={34} className={s.anilloLupaL} />
      <circle cx={cx} cy={cy} r={R + 6} className={s.lupaBorde} />
      <circle cx={cx} cy={cy} r={R} className={s.lupaFondo} />
      <g transform={`translate(${cx},${cy})`}>
        {burbujas.map((u) => u.r > 0.5 && (
          <g key={u.j}>
            <circle cx={u.x} cy={u.y} r={u.r} className={s.bleb} />
            {a > 0 && (u.grande
              ? <g opacity={tramo(a, u.j * 0.05, 0.4 + u.j * 0.05)}>
                  {u.j % 4 === 0
                    ? [[-12, -6], [10, 4], [-2, 14]].map(([x, y], n) => <g key={n} transform={`translate(${u.x + x},${u.y + y})`}><circle r={8} fill={L.histona} /><circle r={11} fill="none" stroke={L.adn} strokeWidth={2.5} /></g>)
                    : <path d={`M${u.x - 22},${u.y - 4} q8,-12 16,0 t16,0 t12,4 M${u.x - 16},${u.y + 12} q8,-10 14,0 t14,0`} fill="none" stroke={L.adn} strokeWidth={3.5} strokeLinecap="round" />}
                </g>
              : <g opacity={tramo(a, u.j * 0.05, 0.4 + u.j * 0.05)}>{[[-6, -4], [6, 3], [0, 9]].map(([x, y], n) => <circle key={n} cx={u.x + x} cy={u.y + y} r={4.5} fill={u.j % 4 === 1 ? L.rnp : '#1F8F8A'} />)}</g>)}
          </g>
        ))}
        <path d="M-78,-8 C-80,-58 -30,-82 6,-78 C50,-74 82,-40 78,4 C74,50 36,80 -6,78 C-50,76 -76,40 -78,-8 Z" className={s.queratinocitoApo} />
        {[[-24, -18, 16], [16, -10, 13], [-4, 22, 15], [24, 26, 9]].map(([x, y, r], n) => <circle key={n} cx={x} cy={y} r={r} className={s.nucleoPicnotico} />)}
      </g>
      {a > 0 && rotulos.map((r, n) => (
        <g key={r.t} opacity={tramo(a, 0.1 + n * 0.15, 0.35 + n * 0.15)}>
          <line x1={r.fin === 'end' ? r.x + 8 : r.x - 8} y1={r.y - 6} x2={r.px} y2={r.py} className={s.guia} />
          <text x={r.x} y={r.y} textAnchor={r.fin} className={s.lEtiqueta}>{r.t}</text>
        </g>
      ))}
      <text x={cx} y={cy + R + 40} textAnchor="middle" className={s.lSub} opacity={tramo(k, 0.2, 0.5)}>queratinocito en apoptosis: burbujas en la superficie</text>
    </g>
  );
}

const GATES = [1140, 1310, 1480];

function Tolerancia({ k, debil }: { k: number; debil: number }) {
  const nombres = ['Médula ósea', 'Timo', 'Periferia'];
  return (
    <g opacity={k}>
      <text x={1310} y={600} textAnchor="middle" className={s.lEtiquetaMayus}>Tolerancia</text>
      {GATES.map((x, j) => {
        const abre = easeOut(tramo(debil, j * 0.15, 0.6 + j * 0.15));
        return (
          <g key={x}>
            <line x1={x} y1={650} x2={x} y2={800} className={s.poste} />
            <g transform={`rotate(${-72 * abre} ${x} 690)`}>
              <rect x={x - 4} y={684} width={100} height={14} rx={7} className={abre > 0.5 ? s.barreraRota : s.barrera} transform={`translate(${-48},0)`} />
            </g>
            <text x={x} y={830} textAnchor="middle" className={s.lSub}>{nombres[j]}</text>
          </g>
        );
      })}
      {debil > 0.001 && (
        <g opacity={debil}>
          <text x={1310} y={878} textAnchor="middle" className={s.lEtiquetaRoja}>debilitada</text>
          <text x={1310} y={906} textAnchor="middle" className={s.lSub}>por los genes y las hormonas</text>
        </g>
      )}
    </g>
  );
}

function Medidores({ k, muerte, lenta }: { k: number; muerte: number; lenta: number }) {
  const W = 420;
  const m = 0.35 + 0.6 * easeOut(muerte), l = 0.85 - 0.62 * easeOut(lenta);
  return (
    <g opacity={k}>
      <text x={1120} y={624} className={s.lEtiquetaMayus}>El balance</text>
      <text x={1120} y={672} className={s.lEtiqueta}>muerte celular</text>
      <rect x={1120} y={686} width={W} height={28} rx={14} className={s.rielEspectro} />
      <rect x={1120} y={686} width={W * m} height={28} rx={14} fill="#E5484D" />
      <text x={1120 + W} y={672} textAnchor="end" className={s.lEtiquetaRoja} opacity={muerte}>más</text>
      <text x={1120} y={766} className={s.lEtiqueta}>limpieza</text>
      <rect x={1120} y={780} width={W} height={28} rx={14} className={s.rielEspectro} />
      <rect x={1120} y={780} width={W * l} height={28} rx={14} fill="#1F9A6A" opacity={0.4 + 0.6 * (1 - lenta)} />
      <text x={1120 + W} y={766} textAnchor="end" className={s.lEtiquetaRoja} opacity={lenta}>más lenta</text>
    </g>
  );
}

function Chip({ x, y, w, txt, k, clase = s.chip }: { x: number; y: number; w: number; txt: string; k: number; clase?: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(k)})`}>
      <rect x={-w / 2} y={-28} width={w} height={56} rx={28} className={clase} />
      <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>{txt}</text>
    </g>
  );
}

export function FondoEpidermis({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'capas'), an = v(t, 'apoNormal'), uv = v(t, 'uv'), au = v(t, 'apoUV'), am = v(t, 'apoMas');
  const zo = v(t, 'zoom'), ca2 = v(t, 'calma'), ch = v(t, 'chispa');
  const apo = new Map<number, number>();
  APO_NORMAL.forEach((i, j) => apo.set(i, tramo(an, j * 0.3, 0.7 + j * 0.3)));
  APO_UV.forEach((i, j) => apo.set(i, tramo(au, j * 0.04, 0.5 + j * 0.04)));
  APO_MAS.forEach((i, j) => apo.set(i, tramo(am, j * 0.05, 0.5 + j * 0.05)));
  return (
    <g>
      <EpidermisFija />
      {/* Encima de los fijos, los que están muriendo (tapan al sano de debajo). */}
      {KC.filter((c) => (apo.get(c.i) ?? 0) > 0.001).map((c) => (
        <g key={c.i}>
          <rect x={c.x - 2} y={c.y - c.h / 2 - 2} width={c.w + 4} height={c.h + 4} className={s.huecoQueratinocito} />
          <Queratinocito c={c} k={apo.get(c.i)!} />
        </g>
      ))}
      {uv > 0.001 && (
        <g opacity={uv}>
          <rect x={0} y={96} width={1600} height={440} className={s.tinteUv} opacity={0.6} />
          {Array.from({ length: 11 }, (_, j) => {
            const x0 = 60 + j * 150;
            const n = 16, pts = Array.from({ length: n + 1 }, (_, q) => { const f = q / n; return `${(x0 + 90 * f + (q % 2 ? 6 : -6)).toFixed(0)},${(-10 + 300 * f).toFixed(0)}`; });
            return <path key={j} d={`M${pts.join(' L')}`} className={s.rayoUv} {...dibujar(tramo(uv, j * 0.04, 0.6 + j * 0.04))} />;
          })}
          <text x={40} y={60} className={s.lEtiquetaUv}>Luz UV</text>
        </g>
      )}
      {ca > 0.001 && ROTULOS_CAPAS.map(([txt, y], j) => (
        <g key={txt} opacity={tramo(ca, j * 0.12, 0.4 + j * 0.12)} transform={`translate(1560,${y})`}>
          <rect x={-txt.length * 11 - 24} y={-17} width={txt.length * 11 + 24} height={34} rx={17} className={s.chipCapa} />
          <text x={-12} dy="0.35em" textAnchor="end" className={s.etiquetaCapa}>{txt}</text>
        </g>
      ))}
      <Chip x={800} y={720} w={560} txt="Muerte programada: silenciosa y ordenada" k={v(t, 'silencio')} />
      <Chip x={800} y={810} w={560} txt="El problema: lo que pasa después" k={v(t, 'despues')} clase={s.chipPista} />
      <Chip x={500} y={700} w={560} txt="En una persona sana: sin consecuencias" k={v(t, 'sano')} />
      {v(t, 'empaqueta') > 0.001 && (
        <g opacity={v(t, 'empaqueta')}>
          <text x={500} y={800} textAnchor="middle" className={s.significado}>La célula que muere empaqueta su núcleo</text>
          <text x={500} y={840} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`}>y lo muestra hacia afuera</text>
        </g>
      )}
      {zo > 0.001 && <Lupa k={zo} />}
      {ca2 > 0.001 && (
        <g opacity={ca2}>
          <ellipse cx={560} cy={740} rx={170} ry={150} className={s.auraCalma} />
          <text x={560} y={952} textAnchor="middle" className={s.lEtiquetaVerde}>Eferocitosis: calma la inflamación</text>
        </g>
      )}
      <Chip x={1170} y={940} w={560} txt="Limpieza rápida, silenciosa, sin alarma" k={v(t, 'sinAlarma')} clase={s.chipVerde} />
      <Chip x={380} y={598} w={460} txt="En el lupus, la limpieza falla" k={v(t, 'falla')} clase={s.chipPista} />
      {v(t, 'medidor') > 0.001 && <Medidores k={v(t, 'medidor')} muerte={v(t, 'muerte')} lenta={v(t, 'lenta')} />}
      <Chip x={800} y={958} w={860} txt="Evento central: más muerte celular + limpieza más lenta" k={v(t, 'central')} clase={s.chipPista} />
      {v(t, 'tolerancia') > 0.001 && <Tolerancia k={v(t, 'tolerancia')} debil={v(t, 'debil')} />}
      {ch > 0.001 && (
        <g opacity={ch * (0.75 + 0.25 * Math.sin(reloj / 120))} transform={`translate(1090,670) scale(${0.6 + 0.4 * easeBack(ch)})`}>
          {Array.from({ length: 10 }, (_, j) => { const a = (j / 10) * TAU; return <line key={j} x1={Math.cos(a) * 34} y1={Math.sin(a) * 34} x2={Math.cos(a) * 66} y2={Math.sin(a) * 66} className={s.chispa} />; })}
          <text y={-100} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`}>la chispa</text>
        </g>
      )}
    </g>
  );
}

// ─── Ciudad ───────────────────────────────────────────────────────────────────

const EDIFICIOS = [[60, 330, 150], [220, 260, 120], [350, 380, 170], [530, 300, 110], [650, 220, 140], [800, 340, 160], [970, 280, 120], [1100, 360, 150], [1260, 240, 130], [1400, 320, 170]];

const CiudadFija = memo(function CiudadFija() {
  return (
    <g>
      {EDIFICIOS.map(([x, y, w], j) => (
        <g key={j}>
          <rect x={x} y={y} width={w} height={620 - y} className={s.edificio} />
          {Array.from({ length: Math.floor((620 - y - 30) / 44) }, (_, r) => Array.from({ length: Math.floor((w - 20) / 34) }, (_, c) => (
            <rect key={`${r}-${c}`} x={x + 14 + c * 34} y={y + 18 + r * 44} width={18} height={24} rx={2} className={s.ventana} />
          )))}
        </g>
      ))}
      <rect x={-40} y={620} width={1680} height={24} className={s.vereda} />
      <rect x={-40} y={644} width={1680} height={110} className={s.asfalto} />
      {Array.from({ length: 17 }, (_, j) => <rect key={j} x={j * 100} y={696} width={56} height={6} rx={3} className={s.lineaCalle} />)}
    </g>
  );
});

function Bolsa({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * easeBack(k)})`} opacity={Math.min(1, k * 2)}>
      <path d="M-26,0 C-34,-30 -18,-46 0,-46 C18,-46 34,-30 26,0 Z" className={s.bolsa} />
      <path d="M-6,-46 L0,-58 L6,-46" className={s.bolsaNudo} />
    </g>
  );
}

function Camion({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-150} y={-110} width={210} height={100} rx={10} className={s.camionCaja} />
      <path d="M60,-10 L60,-80 L110,-80 L140,-46 L140,-10 Z" className={s.camionCabina} />
      <rect x={76} y={-72} width={36} height={26} rx={4} className={s.ventana} />
      {[-110, 0, 110].map((cx) => <g key={cx}><circle cx={cx} cy={-4} r={22} className={s.rueda} /><circle cx={cx} cy={-4} r={8} className={s.rin} /></g>)}
      <text x={-45} y={-54} textAnchor="middle" className={s.lEtiquetaMayus}>recolector</text>
    </g>
  );
}

export function FondoCiudad({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'calle'), ba = v(t, 'basura'), cm = v(t, 'camion'), po = v(t, 'policia'), im = v(t, 'inmune'), it = v(t, 'interferon');
  const bolsas = [[260, 618], [310, 618], [285, 590], [360, 618], [410, 618], [385, 590], [460, 618], [510, 618], [335, 562], [485, 590], [435, 562], [410, 534]];
  const destello = 0.5 + 0.5 * Math.sin(reloj / 140);
  return (
    <g opacity={ca}>
      <CiudadFija />
      {/* Contenedor y bolsas: de pocas a tres veces más */}
      <rect x={160} y={540} width={80} height={80} rx={8} className={s.contenedor} />
      {bolsas.map(([x, y], j) => {
        const k = j < 3 ? Math.min(1, ca * 2) : tramo(ba, (j - 3) * 0.08, 0.3 + (j - 3) * 0.08);
        return k > 0.001 ? <Bolsa key={j} x={x} y={y} k={k} /> : null;
      })}
      {ba > 0.6 && (
        <g opacity={tramo(ba, 0.6, 1)} transform="translate(390,450)">
          <rect x={-120} y={-30} width={240} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>basura × 3</text>
        </g>
      )}
      {cm > 0.001 && (
        <g opacity={cm}>
          <g transform={`translate(${1100 - 80 * (1 - easeOut(cm))},0)`}><Camion x={0} y={720} /></g>
          <g transform="translate(1050,470)">
            <rect x={-170} y={-30} width={340} height={60} rx={30} className={s.chip} />
            <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>pasa una vez por semana</text>
          </g>
        </g>
      )}
      {po > 0.001 && (
        <g opacity={po} transform="translate(1440,560)">
          <rect x={-46} y={-30} width={92} height={50} rx={12} className={s.patrulla} />
          <rect x={-30} y={-46} width={28} height={16} rx={4} fill="#2F6FD0" opacity={0.4 + 0.6 * destello} />
          <rect x={2} y={-46} width={28} height={16} rx={4} fill="#E5484D" opacity={0.4 + 0.6 * (1 - destello)} />
          {[30, 52, 74].map((r, j) => <path key={r} d={`M${-r * 0.7},${-70 - r * 0.4} A${r},${r} 0 0 1 ${r * 0.7},${-70 - r * 0.4}`} className={s.ondaLlamada} opacity={tramo(po, j * 0.2, 0.5 + j * 0.2)} />)}
          <text y={60} textAnchor="middle" className={s.lEtiqueta}>alguien llama a la policía</text>
        </g>
      )}
      {im > 0.001 && [
        ['Basura', 'ADN y nucleosomas expuestos', 340],
        ['Camión', 'macrófagos con C1q', 800],
        ['Policía', 'el sistema inmune', 1260],
      ].map(([a, b, x], j) => {
        const k = tramo(im, j * 0.25, 0.4 + j * 0.25);
        return k > 0.001 ? (
          <g key={a as string} opacity={k} transform={`translate(${x},835) scale(${0.85 + 0.15 * easeBack(k)})`}>
            <rect x={-205} y={-44} width={410} height={88} rx={20} className={s.tarjeta} />
            <text y={-12} textAnchor="middle" dy="0.35em" className={s.chipTxt}>{a}</text>
            <text y={20} textAnchor="middle" dy="0.35em" className={s.lSub}>{b}</text>
          </g>
        ) : null;
      })}
      {it > 0.001 && (
        <g>
          <text x={560} y={950} textAnchor="end" className={s.significado} opacity={tramo(it, 0, 0.5)}>La llamada:</text>
          <g opacity={tramo(it, 0.5, 1)} transform={`translate(580,950) scale(${clamp(0.85 + 0.15 * easeBack(tramo(it, 0.5, 1)))})`}>
            <text className={s.respuestaMorada}>el interferón</text>
            <text x={360} className={s.lSub}>→ capítulo 3</text>
          </g>
        </g>
      )}
    </g>
  );
}
