'use client';
// El tejido del hígado, dibujado en el estilo de las referencias («muerte celular», «vaso sanguíneo», «análisis de una
// célula»): hepatocitos poligonales que respiran, células de Kupffer y estrelladas que se mueven, tríadas portales, el
// lobulillo con sus flujos y el colágeno. Todo vive: función de `reloj` (ms) y de los parámetros 0-1 de cada lámina.

import { En, clamp, easeBack, easeOut, hash, lerp, tramo } from './Piezas';
import { H, mezcla, onda, poli, type P2, type Tono } from './Piezas';

// ─── El hepatocito ───────────────────────────────────────────────────────────

/** Hepatocito (poligonal, rosa salmón, núcleo violeta con nucléolo): respira, y sus mitocondrias y su nucléolo derivan.
 *  `balon` lo hincha y lo aclara (balonización); `vidrio` lo vuelve pálido y homogéneo (vidrio esmerilado); `apop` lo encoge, lo pone
 *  rojo intenso y rompe el núcleo en fragmentos (cuerpo de Councilman); `grasa` le llena el citoplasma de gotas; `atip` agranda y
 *  oscurece el núcleo y lo deforma (atipia); `infecta` (un tono de virus) lo llena de partículas con un halo que late; `binuclear` pone un
 *  segundo núcleo. Radio base ≈ 92. */
export function Hepatocito({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, sem = 1, balon = 0, vidrio = 0, apop = 0, grasa = 0, atip = 0, infecta, brillo = 1, binuclear = 0 }: {
  x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; sem?: number; balon?: number; vidrio?: number; apop?: number; grasa?: number; atip?: number; infecta?: Tono; brillo?: number; binuclear?: number;
}) {
  const ba = clamp(balon), vi = clamp(vidrio), ap = clamp(apop), gr = clamp(grasa), at = clamp(atip);
  const resp = 1 + 0.013 * onda(reloj, 3400, fase);
  const S = resp * (1 + 0.24 * ba) * (1 - 0.3 * ap);
  const c0 = mezcla(mezcla(H.hep[0], '#B79AD0', vi * 0.6), '#B0102A', ap * 0.7);
  const c1 = mezcla(mezcla(H.hep[1], '#F3E4F4', vi * 0.85), '#EC3A58', ap * 0.85);
  const c2 = mezcla(mezcla(H.hep[2], '#FFFFFF', vi * 0.6), '#FF9AAA', ap * 0.7);
  const cuerpo = poli(7, 92, 0.09, sem), interior = poli(7, 74, 0.1, sem + 3);
  const nuc = at > 0.02 ? poli(8, 34 + 20 * at, 0.06 + 0.3 * at, sem + 11) : null;
  const nucTono = [mezcla(H.nucleo[0], '#14083C', at), mezcla(H.nucleo[1], '#2A1470', at * 0.8), H.nucleo[2]];
  const nx = 2 * onda(reloj, 1700, fase), ny = 1.6 * onda(reloj, 2100, fase + 1);
  return (
    <En x={x} y={y} r={r} k={k * S} o={o}>
      <path d={cuerpo} fill={c0} transform="translate(4,7)" />
      <path d={cuerpo} fill={c1} />
      <path d={interior} fill={c2} opacity={0.5 * (1 - 0.6 * ap)} transform="translate(-6,-6)" />
      {vi > 0.02 && <path d={poli(7, 84, 0.08, sem + 1)} fill="none" stroke="#FFF" strokeWidth={5} opacity={0.55 * vi} />}
      {/* mitocondrias: derivan */}
      {ap < 0.8 && [[-52, 30], [44, 40], [8, -58]].map(([mx, my], i) => (
        <g key={i} transform={`translate(${(mx + 5 * onda(reloj, 1900, fase + i * 2)).toFixed(1)},${(my + 4 * onda(reloj, 2300, fase + i)).toFixed(1)}) rotate(${i * 50 - 20})`} opacity={1 - ap}>
          <ellipse rx={15} ry={8} fill="#C4463C" /><ellipse cx={-1} cy={-1} rx={13} ry={6.4} fill="#EE7A68" />
          <path d="M-8,0 Q-4,-4 0,0 T8,0" fill="none" stroke="#C4463C" strokeWidth={1.6} />
        </g>
      ))}
      {/* vacuolas de la balonización */}
      {ba > 0.05 && [[-40, -8], [36, -22], [22, 34]].map(([vx, vy], i) => <g key={i} opacity={ba}><circle cx={vx} cy={vy} r={15 * ba} fill="#FFF" opacity={0.55} /><circle cx={vx - 4} cy={vy - 4} r={4} fill="#FFF" opacity={0.8} /></g>)}
      {/* gotas de grasa */}
      {gr > 0.02 && Array.from({ length: 8 }, (_, i) => {
        const q = easeBack(tramo(gr, i / 11, i / 11 + 0.35)), a = hash(i, sem + 5) * 6.28, d = 22 + hash(i, sem + 6) * 40;
        return q > 0.01 ? (
          <g key={i} transform={`translate(${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}) scale(${q.toFixed(3)})`}>
            <circle r={9 + hash(i, sem + 9) * 8} fill="#F2C440" /><circle cx={-1} cy={-1} r={7 + hash(i, sem + 9) * 7} fill="#FFE98A" /><circle cx={-4} cy={-4} r={2.6} fill="#FFF" opacity={0.9} />
          </g>
        ) : null;
      })}
      {/* el virus dentro, con su halo que late */}
      {infecta && Array.from({ length: 7 }, (_, i) => {
        const a = hash(i, sem + 2) * 6.28, d = 16 + hash(i, sem + 3) * 46;
        const q = tramo(brillo, i / 12, i / 12 + 0.4);
        return q > 0.01 ? (
          <g key={i} transform={`translate(${(Math.cos(a) * d + 3 * onda(reloj, 1500, i)).toFixed(1)},${(Math.sin(a) * d + 3 * onda(reloj, 1800, i + 1)).toFixed(1)}) scale(${q.toFixed(3)})`}>
            <circle r={13 + 3 * onda(reloj, 900, i)} fill={infecta[1]} opacity={0.28} />
            <circle r={7} fill={infecta[0]} /><circle cx={-1} cy={-1} r={5.6} fill={infecta[1]} /><circle cx={-2.4} cy={-2.4} r={1.7} fill="#FFF" opacity={0.9} />
          </g>
        ) : null;
      })}
      {/* el núcleo */}
      {ap < 0.99 && (
        <g opacity={1 - tramo(ap, 0.2, 0.7)} transform={`translate(${(nx * (1 - ap)).toFixed(1)},${(ny * (1 - ap)).toFixed(1)})`}>
          {nuc ? <path d={nuc} fill={nucTono[0]} /> : <circle r={35} fill={nucTono[0]} />}
          {nuc ? <path d={nuc} fill={nucTono[1]} transform="translate(-3,-3) scale(0.92)" /> : <circle cx={-3} cy={-3} r={31} fill={nucTono[1]} />}
          <circle cx={5 + 2 * onda(reloj, 1400, fase)} cy={4} r={10 + 3 * at} fill={H.nucleo[0]} /><circle cx={3} cy={2} r={6 + 2 * at} fill={H.nucleo[2]} opacity={0.75} />
          {[[-14, -12], [12, -16], [-10, 16], [16, 12]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={2.6} fill={H.nucleo[2]} opacity={0.65} />)}
          <path d="M-24,-14 Q-18,-26 -4,-28" fill="none" stroke="#FFF" strokeWidth={4.4} strokeLinecap="round" opacity={0.4} />
        </g>
      )}
      {binuclear > 0.02 && <g opacity={clamp(binuclear)} transform="translate(46,-34)"><circle r={20} fill={H.nucleo[0]} /><circle cx={-2} cy={-2} r={17} fill={H.nucleo[1]} /><circle cx={2} cy={2} r={5.4} fill={H.nucleo[2]} opacity={0.75} /></g>}
      {/* fragmentos del cuerpo de Councilman */}
      {ap > 0.15 && Array.from({ length: 7 }, (_, i) => {
        const q = easeOut(tramo(ap, 0.15 + i * 0.03, 0.8)), a = hash(i, sem + 20) * 6.28, d = (10 + hash(i, sem + 21) * 46) * q;
        return <circle key={i} cx={Math.cos(a) * d + 1.5 * onda(reloj, 700, i)} cy={Math.sin(a) * d} r={(6 + hash(i, sem + 22) * 11) * (0.4 + 0.6 * q)} fill="#1B0D55" opacity={q} />;
      })}
      <path d="M-62,-38 Q-54,-58 -30,-64" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.42 * (1 - 0.5 * ap)} />
    </En>
  );
}

// ─── Las células de las paredes del sinusoide ────────────────────────────────

/** Célula de Kupffer (ámbar): macrófago que saca y recoge seudópodos y lleva vacuolas con lo que ha comido. `activa` (0-1) crece y extiende
 *  más los seudópodos. */
export function Kupffer({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, activa = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; activa?: number }) {
  const ac = clamp(activa);
  const cuerpo = poli(9, 54, 0.14, 4);
  return (
    <En x={x} y={y} r={r} k={k * (1 + 0.18 * ac)} o={o}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.5, L = 30 + 14 * onda(reloj, 1400 + i * 170, fase + i) + 22 * ac;
        return (
          <g key={i} transform={`rotate(${((a * 180) / Math.PI).toFixed(0)})`}>
            <ellipse cx={46 + L * 0.5} cy={0} rx={L * 0.7} ry={13} fill={H.kupffer[0]} /><ellipse cx={44 + L * 0.5} cy={-1.5} rx={L * 0.66} ry={11} fill={H.kupffer[1]} />
          </g>
        );
      })}
      <path d={cuerpo} fill={H.kupffer[0]} transform="translate(3,5)" /><path d={cuerpo} fill={H.kupffer[1]} />
      <path d={poli(9, 40, 0.14, 6)} fill={H.kupffer[2]} opacity={0.45} transform="translate(-6,-6)" />
      <path d="M-14,-14 C-2,-26 20,-18 20,-2 C20,12 4,18 -8,10 C-2,4 -4,-6 -14,-14 Z" fill={H.nucleo[0]} transform={`translate(${(2 * onda(reloj, 1700, fase)).toFixed(1)},0)`} />
      <path d="M-11,-12 C0,-22 17,-16 17,-3 C17,8 5,13 -5,7 C0,2 -1,-5 -11,-12 Z" fill={H.nucleo[1]} transform={`translate(${(2 * onda(reloj, 1700, fase)).toFixed(1)},0)`} />
      {[[-30, 18], [26, 24], [-2, 34]].map(([vx, vy], i) => <g key={i}><circle cx={vx} cy={vy} r={9} fill="#7A3A00" opacity={0.55} /><circle cx={vx - 1} cy={vy - 1} r={6.4} fill="#FFE9A8" opacity={0.8} /></g>)}
      <path d="M-40,-26 Q-30,-42 -12,-46" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
    </En>
  );
}

/** Célula estrellada o de Ito (amarilla con gotas doradas de vitamina A). `activa` (0-1): pierde las gotas, se alarga en miofibroblasto y deja
 *  colágeno azul a su alrededor. */
export function Estrellada({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, fase = 0, activa = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; activa?: number }) {
  const ac = clamp(activa);
  const alarga = 1 + 0.9 * ac;
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {ac > 0.02 && Array.from({ length: 9 }, (_, i) => {
        const a = hash(i, 31) * 6.28, d = 60 + hash(i, 32) * 46;
        const q = tramo(ac, 0.2 + i * 0.05, 0.9);
        return <path key={i} d={`M${(Math.cos(a) * 40 * alarga).toFixed(1)},${(Math.sin(a) * 26).toFixed(1)} L${(Math.cos(a) * d * alarga).toFixed(1)},${(Math.sin(a) * d * 0.7).toFixed(1)}`} stroke={H.colageno[1]} strokeWidth={9} strokeLinecap="round" opacity={q} strokeDasharray="1 0" />;
      })}
      <g transform={`scale(${alarga.toFixed(3)},${(1 - 0.18 * ac).toFixed(3)})`}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3, L = 44 + 10 * onda(reloj, 1700 + i * 120, fase + i);
          return <rect key={i} x={20} y={-10} width={L} height={20} rx={10} fill={H.estrellada[1]} transform={`rotate(${((a * 180) / Math.PI).toFixed(0)})`} />;
        })}
        <circle r={46} fill={H.estrellada[0]} transform="translate(3,5)" /><circle r={46} fill={H.estrellada[1]} />
        <circle cx={-6} cy={-6} r={34} fill={H.estrellada[2]} opacity={0.45} />
        <circle cx={6} cy={4} r={20} fill={H.nucleo[0]} /><circle cx={4} cy={2} r={17} fill={H.nucleo[1]} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = hash(i, 41) * 6.28, d = 18 + hash(i, 42) * 20, q = 1 - 0.9 * ac;
          return <g key={i} transform={`translate(${(Math.cos(a) * d + 2 * onda(reloj, 1300, i)).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}) scale(${q.toFixed(2)})`}><circle r={7.4} fill="#C79A00" /><circle cx={-1} cy={-1} r={5.8} fill="#FFD23F" /><circle cx={-2.6} cy={-2.6} r={1.8} fill="#FFF" opacity={0.9} /></g>;
        })}
        <path d="M-32,-22 Q-24,-38 -8,-42" fill="none" stroke="#FFF" strokeWidth={5.4} strokeLinecap="round" opacity={0.5} />
      </g>
    </En>
  );
}

// ─── Tejido ──────────────────────────────────────────────────────────────────

/** Trabécula: una fila de hepatocitos, uno al lado del otro, con su canalículo biliar verde oliva entre dos filas y gotas de bilis que
 *  corren por él. `filas` (1-4) la engruesa (el carcinoma: tres o más); `atip` deforma los núcleos. */
export function Trabecula({ x = 0, y = 0, n = 5, filas = 1, paso = 150, k = 1, o = 1, reloj = 0, atip = 0, balon = 0, bilis = 1, sem = 1 }: { x?: number; y?: number; n?: number; filas?: number; paso?: number; k?: number; o?: number; reloj?: number; atip?: number; balon?: number; bilis?: number; sem?: number }) {
  const alto = 132;
  const filasN = Math.ceil(filas);
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: filasN }, (_, f) => {
        const yy = (f - (filasN - 1) / 2) * alto;
        const op = f + 1 <= filas ? 1 : clamp(filas - f);
        return (
          <g key={f} opacity={op}>
            {Array.from({ length: n }, (_, i) => <Hepatocito key={i} x={(i - (n - 1) / 2) * paso + (f % 2 ? paso * 0.12 : 0)} y={yy} k={0.8} reloj={reloj} fase={i * 1.3 + f} sem={sem + i + f * 5} atip={atip} balon={balon} />)}
          </g>
        );
      })}
      {bilis > 0.02 && Array.from({ length: Math.max(0, filasN - 1) + 1 }, (_, f) => {
        const yy = ((f - (filasN - 1) / 2) - 0.5) * alto;
        return f === 0 && filasN === 1 ? null : (
          <g key={f}>
            <rect x={-(n * paso) / 2} y={yy - 4} width={n * paso} height={8} rx={4} fill={H.bilis[0]} opacity={0.65 * bilis} />
            {[0, 1, 2, 3].map((i) => <circle key={i} cx={-(n * paso) / 2 + (((reloj / 2600 + i / 4) % 1) * n * paso)} cy={yy} r={5} fill={H.bilis[2]} opacity={bilis} />)}
          </g>
        );
      })}
    </En>
  );
}

/** Espacio porta (tríada): arteriola hepática roja, vénula portal violeta y conducto biliar de epitelio cúbico verde oliva, sobre su tejido
 *  conectivo rosa pálido. Los glóbulos de los vasos circulan. */
export function Triada({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj = 0, p = 1 }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj?: number; p?: number }) {
  const q = easeBack(clamp(p));
  const gl = (cx: number, cy: number, R: number, n: number, ph: number) => Array.from({ length: n }, (_, i) => {
    const a = (reloj / 1800 + i / n + ph) * Math.PI * 2;
    return <circle key={i} cx={cx + Math.cos(a) * R} cy={cy + Math.sin(a) * R} r={5} fill="#E3203F" />;
  });
  return (
    <En x={x} y={y} r={r} k={k * (0.5 + 0.5 * q)} o={o * tramo(p, 0, 0.4)}>
      <path d="M-118,-12 C-120,-84 -34,-118 52,-100 C124,-84 130,-6 108,56 C82,118 -34,126 -92,88 C-118,66 -118,30 -118,-12 Z" fill="#FFC9D2" transform="translate(4,7)" />
      <path d="M-118,-12 C-120,-84 -34,-118 52,-100 C124,-84 130,-6 108,56 C82,118 -34,126 -92,88 C-118,66 -118,30 -118,-12 Z" fill="#FFE0E6" />
      {/* arteriola */}
      <circle cx={-52} cy={-30} r={26} fill="#9E0B2E" /><circle cx={-52} cy={-30} r={20} fill="#E3203F" opacity={0.35} /><circle cx={-52} cy={-30} r={14} fill="#5A0A22" />
      {gl(-52, -30, 6, 2, 0)}
      {/* vénula portal */}
      <circle cx={42} cy={-2} r={46} fill="#5A33B8" /><circle cx={40} cy={-4} r={41} fill="#7A55D8" /><circle cx={42} cy={-2} r={33} fill="#B7A0F5" opacity={0.7} /><circle cx={42} cy={-2} r={29} fill="#3A1470" />
      {gl(42, -2, 12, 3, 0.2)}
      {/* conducto biliar: luz rodeada de células cúbicas */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <rect key={i} x={-6 - 0} y={-6} width={14} height={14} rx={3.5} fill={i % 2 ? H.bilis[1] : H.bilis[0]} transform={`translate(${(-12 + Math.cos(a) * 26).toFixed(1)},${(56 + Math.sin(a) * 26).toFixed(1)}) rotate(${((a * 180) / Math.PI).toFixed(0)})`} />;
      })}
      <circle cx={-12} cy={56} r={14} fill={H.bilis[2]} />
      <circle cx={-12 + 3 * Math.sin(reloj / 700)} cy={56} r={4.4} fill={H.bilis[1]} opacity={0.8} />
      <ellipse cx={-92} cy={40} rx={11} ry={7} fill="#FFF" opacity={0.7} />
    </En>
  );
}

/** El lobulillo clásico: un hexágono con la vena central en medio y una tríada en cada vértice. Los sinusoides son las líneas radiales: la sangre
 *  (rojo) corre de los vértices al centro (`flujo`) y la bilis (verde oliva) en sentido contrario (`bilis`). `zonas` pinta el degradado
 *  de oxígeno de la zona 1 (periferia, rojo vivo) a la 3 (centro, vino). */
export function Lobulillo({ x = 0, y = 0, R = 330, k = 1, o = 1, reloj = 0, flujo = 0, bilis = 0, zonas = 0, triadas = 1, vena = 1, id = 'lob' }: { x?: number; y?: number; R?: number; k?: number; o?: number; reloj?: number; flujo?: number; bilis?: number; zonas?: number; triadas?: number; vena?: number; id?: string }) {
  const V: P2[] = Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * R, Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * R]);
  const d = `M${V.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' L')} Z`;
  const z = clamp(zonas);
  return (
    <En x={x} y={y} k={k} o={o}>
      <defs>
        <radialGradient id={`${id}-z`}>
          <stop offset="0" stopColor="#5A0A3A" /><stop offset="0.38" stopColor="#B21E58" /><stop offset="0.7" stopColor="#E8486A" /><stop offset="1" stopColor="#FF7A66" />
        </radialGradient>
      </defs>
      <path d={d} fill={H.hep[0]} transform="translate(8,12)" />
      <path d={d} fill={H.hep[1]} />
      {z > 0.01 && <path d={d} fill={`url(#${id}-z)`} opacity={0.88 * z} />}
      {/* sinusoides radiales */}
      {V.map(([a, b], i) => <line key={i} x1={a * 0.9} y1={b * 0.9} x2={a * 0.12} y2={b * 0.12} stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.28} />)}
      {V.map(([a, b], i) => <line key={`m${i}`} x1={(a + V[(i + 1) % 6][0]) * 0.42} y1={(b + V[(i + 1) % 6][1]) * 0.42} x2={(a + V[(i + 1) % 6][0]) * 0.07} y2={(b + V[(i + 1) % 6][1]) * 0.07} stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.2} />)}
      {/* la sangre entra por los vértices y la bilis sale */}
      {flujo > 0.02 && V.flatMap(([a, b], i) => [0, 1, 2].map((j) => {
        const u = (reloj / 3000 + i / 6 + j / 3) % 1;
        const s = 0.86 - 0.74 * u;
        return <circle key={`f${i}-${j}`} cx={a * s} cy={b * s} r={11} fill="#E3203F" opacity={clamp(flujo) * Math.sin(u * Math.PI)} />;
      }))}
      {bilis > 0.02 && V.flatMap(([a, b], i) => [0, 1].map((j) => {
        const u = (reloj / 3600 + i / 6 + j / 2) % 1;
        const s = 0.12 + 0.74 * u, ang = Math.atan2(b, a) + 0.18;
        return <circle key={`b${i}-${j}`} cx={Math.cos(ang) * R * s} cy={Math.sin(ang) * R * s} r={8} fill={H.bilis[2]} opacity={clamp(bilis) * Math.sin(u * Math.PI)} />;
      }))}
      {/* tríadas en los vértices */}
      {triadas > 0.01 && V.map(([a, b], i) => (
        <g key={i} transform={`translate(${a.toFixed(1)},${b.toFixed(1)}) scale(${(0.34 * clamp(triadas)).toFixed(3)})`}>
          <circle r={96} fill="#FFE0E6" /><circle cx={-44} cy={-24} r={24} fill="#E3203F" /><circle cx={38} cy={-4} r={40} fill="#7A55D8" /><circle cx={-8} cy={50} r={24} fill={H.bilis[1]} />
        </g>
      ))}
      {/* vena central */}
      {vena > 0.01 && <g transform={`scale(${clamp(vena).toFixed(3)})`}><circle r={R * 0.115} fill="#3A1470" /><circle r={R * 0.1} fill="#7A55D8" /><circle r={R * 0.07} fill="#3A1470" /></g>}
    </En>
  );
}

/** Colágeno: hebras azules ondulantes que van apareciendo (`p`). Para las cicatrices y los septos. */
export function Colageno({ x = 0, y = 0, w = 400, h = 160, n = 6, p = 1, o = 1, reloj = 0, sem = 1 }: { x?: number; y?: number; w?: number; h?: number; n?: number; p?: number; o?: number; reloj?: number; sem?: number }) {
  if (p <= 0.01) return null;
  return (
    <En x={x} y={y} o={o}>
      {Array.from({ length: n }, (_, i) => {
        const yy = (hash(i, sem) - 0.5) * h, amp = 14 + hash(i, sem + 1) * 22, dx = 0.15 + hash(i, sem + 2) * 0.2;
        const q = tramo(p, i / (n + 2), i / (n + 2) + 0.5);
        const ph = reloj / 1600 + i;
        const d = `M${-w / 2},${yy} C${(-w / 2 + w * 0.3).toFixed(0)},${(yy + amp * Math.sin(ph)).toFixed(1)} ${(w * dx).toFixed(0)},${(yy - amp * Math.cos(ph)).toFixed(1)} ${w / 2},${(yy + amp * 0.3 * Math.sin(ph)).toFixed(1)}`;
        return (
          <g key={i} opacity={q}>
            <path d={d} fill="none" stroke={H.colageno[0]} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${(w * 1.4 * q).toFixed(0)} 4000`} transform="translate(0,4)" />
            <path d={d} fill="none" stroke={H.colageno[1]} strokeWidth={11} strokeLinecap="round" strokeDasharray={`${(w * 1.4 * q).toFixed(0)} 4000`} />
            <path d={d} fill="none" stroke={H.colageno[2]} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${(w * 1.4 * q).toFixed(0)} 4000`} opacity={0.7} transform="translate(0,-3)" />
          </g>
        );
      })}
    </En>
  );
}

/** Pared de sinusoide vista de lado, para los cortes de histología: un endotelio de células planas con fenestras (huecos) que parpadean. */
export function ParedFenestrada({ x = 0, y = 0, w = 600, o = 1, reloj = 0, p = 1 }: { x?: number; y?: number; w?: number; o?: number; reloj?: number; p?: number }) {
  if (p <= 0.01) return null;
  const n = Math.floor(w / 46);
  return (
    <En x={x} y={y} o={o * tramo(p, 0, 0.4)}>
      <rect x={-w / 2} y={-9} width={w} height={18} rx={9} fill={H.endo[0]} transform="translate(0,3)" />
      <rect x={-w / 2} y={-9} width={w} height={16} rx={8} fill={H.endo[1]} />
      {Array.from({ length: n }, (_, i) => {
        const cx = -w / 2 + 24 + i * 46, vis = 0.5 + 0.5 * onda(reloj, 1800, i * 1.7);
        return <ellipse key={i} cx={cx} cy={-1} rx={8} ry={3 + 3 * vis} fill="#8E1030" opacity={0.7} />;
      })}
    </En>
  );
}

export { lerp, easeOut };

// ─── Flujos ──────────────────────────────────────────────────────────────────

/** Puntos que corren por un camino `u → [x, y]` (de 0 a 1): la sangre, la bilis, los nutrientes. Cada uno nace y se apaga en los extremos. */
export function Corre({ camino, reloj, n = 8, vel = 0.00012, tono = H.sangre, R = 9, o = 1, sem = 1, fase = 0 }: { camino: (u: number) => P2; reloj: number; n?: number; vel?: number; tono?: Tono; R?: number; o?: number; sem?: number; fase?: number }) {
  if (o <= 0.01) return null;
  return (
    <g opacity={o < 1 ? o : undefined}>
      {Array.from({ length: n }, (_, i) => {
        const u = ((((reloj * vel) + i / n + hash(i, sem) * 0.04 + fase) % 1) + 1) % 1;
        const [px, py] = camino(u);
        return (
          <g key={i} transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`} opacity={Math.sin(u * Math.PI)}>
            <circle r={R} fill={tono[0]} /><circle cx={-R * 0.12} cy={-R * 0.12} r={R * 0.84} fill={tono[1]} /><circle cx={-R * 0.36} cy={-R * 0.36} r={R * 0.24} fill="#FFF" opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
}

/** Tubo curvo (vena, arteria, vía biliar): una cuerda gruesa con su sombra, su cuerpo y un brillo, que se dibuja con `p`. */
export function TuboCurvo({ a, b, c, w = 30, tono = H.sangre, p = 1, o = 1 }: { a: P2; b: P2; c?: P2; w?: number; tono?: Tono; p?: number; o?: number }) {
  if (p <= 0.003) return null;
  const cc = c ?? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const d = `M${a[0]},${a[1]} Q${cc[0]},${cc[1]} ${b[0]},${b[1]}`;
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.3;
  const da = `${(largo * clamp(p)).toFixed(0)} ${(largo * 2).toFixed(0)}`;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <path d={d} fill="none" stroke={tono[0]} strokeWidth={w} strokeLinecap="round" strokeDasharray={da} transform="translate(0,6)" opacity={0.9} />
      <path d={d} fill="none" stroke={tono[1]} strokeWidth={w * 0.86} strokeLinecap="round" strokeDasharray={da} />
      <path d={d} fill="none" stroke="#FFF" strokeWidth={w * 0.16} strokeLinecap="round" strokeDasharray={da} opacity={0.5} transform={`translate(${-w * 0.18},${-w * 0.18})`} />
    </g>
  );
}
