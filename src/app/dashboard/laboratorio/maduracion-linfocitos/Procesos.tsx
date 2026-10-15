'use client';
// Procesos moleculares de la «lupa». Cada uno es un dibujo en coordenadas
// locales (LUPA_W × LUPA_H) que depende solo de su progreso `p` (0–1): el
// motor da `p`, así que retroceder o saltar los deja en el fotograma exacto.
// Todo es SVG hecho a mano; las proteínas complejas son un círculo con su
// nombre (RAG1/2, TdT, AID, ligasa IV…).

import type { DatosProceso } from '@/lib/data/linfocitos/tipos';
import { L } from '@/lib/data/linfocitos/colores';
import { LUPA_H, LUPA_W, easeBack, easeInOut, easeOut, tramo } from '@/lib/linfocitos/motor';
import s from '@/styles/linfocitos.module.css';

export { LUPA_W, LUPA_H };

const COL_SEG = { V: '#4C7BE0', D: '#2FA36B', J: '#E09A2E', C: '#8E7CC3', S: '#B0B8C6', N: '#E5484D' } as const;

/** Proteína compleja: círculo con su nombre. */
function Prot({ x, y, r, color, nombre, op = 1, esc = 1 }: { x: number; y: number; r: number; color: string; nombre: string; op?: number; esc?: number }) {
  if (op <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`} opacity={op}>
      <circle r={r} fill={color} />
      <circle r={r} fill="url(#brilloProt)" />
      <text textAnchor="middle" dy="0.35em" className={s.protTxt} style={{ fontSize: Math.min(15, (r * 2 - 6) / (nombre.length * 0.55)) }}>{nombre}</text>
    </g>
  );
}

function Segmento({ x, y, w, tipo, label, op = 1 }: { x: number; y: number; w: number; tipo: keyof typeof COL_SEG; label: string; op?: number }) {
  return (
    <g opacity={op}>
      <rect x={x} y={y - 15} width={w} height={30} rx={6} fill={COL_SEG[tipo]} />
      <text x={x + w / 2} y={y} textAnchor="middle" dy="0.35em" className={s.segTxt}>{label}</text>
    </g>
  );
}

function Titulo({ texto, sub }: { texto: string; sub?: string }) {
  return (
    <g>
      <text x={18} y={30} className={s.lupaTitulo}>{texto}</text>
      {sub && <text x={18} y={52} className={s.lupaSub}>{sub}</text>}
    </g>
  );
}

function Destello({ x, y, q, color = '#FFD23F', r = 22 }: { x: number; y: number; q: number; color?: string; r?: number }) {
  if (q <= 0 || q >= 1) return null;
  return <circle cx={x} cy={y} r={r * (0.6 + q)} fill="none" stroke={color} strokeWidth={4 * (1 - q) + 1} opacity={1 - q} />;
}

// ─── Recombinación V(D)J ──────────────────────────────────────────────────────

type Seg = { label: string; tipo: keyof typeof COL_SEG };

function locusDe(d: Extract<DatosProceso, { clase: 'vdj' }>): { segs: Seg[]; a: number; b: number; previo?: [number, number] } {
  const V = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `V${i + 1}`, tipo: 'V' as const }));
  const Dd = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `D${i + 1}`, tipo: 'D' as const }));
  const J = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `J${i + 1}`, tipo: 'J' as const }));
  const C = (l: string) => ({ label: l, tipo: 'C' as const });
  if (d.fase === 'VJ') {
    const cc = d.locus === 'TRA' ? 'Cα' : d.locus === 'IGL' ? 'Cλ' : 'Cκ';
    const segs = [...V(5), ...J(4), C(cc)];
    return { segs, a: 2, b: 6 }; // V3 con J2
  }
  const cc = d.locus === 'TRB' ? [C('Cβ1')] : [C('Cμ'), C('Cδ')];
  const segs = [...V(4), ...Dd(3), ...J(4), ...cc];
  // DJ: D2 con J3. VDJ: V2 con el D2J3 ya unido.
  if (d.fase === 'DJ') return { segs, a: 5, b: 9 };
  return { segs, a: 1, b: 5, previo: [5, 9] };
}

function Recombinacion({ d, p }: { d: Extract<DatosProceso, { clase: 'vdj' }>; p: number }) {
  const { segs: base, a: a0, b: b0, previo } = locusDe(d);
  // En la fase V→DJ, el D–J ya está unido: se quita lo que se escindió antes.
  let segs = base, a = a0, b = b0;
  if (previo) {
    const [pa, pb] = previo;
    segs = [...base.slice(0, pa + 1), ...base.slice(pb)];
    b = a0 + (pa - a0); // el D que quedó (D2) sigue en su sitio
  }
  const W = 36, GAP = 5, X0 = 14, Y = 112;
  const paso = W + GAP;
  const nExc = b - a - 1;
  const hueco = d.tdt ? 26 : 4;
  const S = nExc * paso - hueco; // cuánto se corre la parte derecha
  const q0 = easeOut(tramo(p, 0, 0.12));
  const q1 = easeInOut(tramo(p, 0.12, 0.4));
  const q2 = tramo(p, 0.4, 0.5);
  const q3 = easeInOut(tramo(p, 0.48, 0.72));
  const q4 = tramo(p, 0.62, 0.84);
  const q5 = tramo(p, 0.86, 1);
  const corr = S * q1;
  const xA = X0 + a * paso;
  const xB = X0 + b * paso - corr;
  // Bucle: los segmentos escindidos suben a un círculo entre a y b.
  const cx = (xA + W + xB) / 2, cy = Y + 56 + 8 * q1;
  const R = Math.max(26, (nExc * paso) / (2 * Math.PI) + 12);
  const yCirc = q3 * 26;
  const opCirc = 1 - tramo(p, 0.62, 0.74);
  const nombreFase = d.fase === 'DJ' ? 'D se une a J' : d.fase === 'VDJ' ? 'V se une a DJ' : 'V se une a J';
  const unidos = d.fase === 'DJ' ? 'D2–J3' : d.fase === 'VDJ' ? 'V2–D2J3' : 'V3–J2';
  const tDna = (x1: number, x2: number) => <g><line x1={x1} y1={Y - 5} x2={x2} y2={Y - 5} className={s.adn} /><line x1={x1} y1={Y + 5} x2={x2} y2={Y + 5} className={s.adn} /></g>;
  const finIzq = xA + W, iniDer = xB;
  return (
    <g>
      <Titulo texto={`Locus ${d.locus} · ${d.cromosoma}`} sub={`Recombinación: ${nombreFase}`} />
      {/* ADN de fondo, partido en el hueco mientras se forma el bucle */}
      {tDna(10, finIzq + 2)}
      {tDna(iniDer - 2, LUPA_W - 10)}
      {q1 < 0.98 && q3 === 0 && (
        <path d={`M${finIzq},${Y} Q${cx},${Y + 120 * q1} ${iniDer},${Y}`} fill="none" className={s.adn} strokeWidth={3} opacity={0.6} />
      )}
      {segs.map((sg, i) => {
        if (i <= a) return <Segmento key={sg.label + i} x={X0 + i * paso} y={Y} w={W} tipo={sg.tipo} label={sg.label} />;
        if (i >= b) return <Segmento key={sg.label + i} x={X0 + i * paso - corr} y={Y} w={W} tipo={sg.tipo} label={sg.label} />;
        // Escindido: de la línea al círculo, y el círculo se va.
        const k = i - a - 1;
        const ang = Math.PI / 2 - (k + 0.5 - nExc / 2) * (2 * Math.PI / Math.max(nExc, 3));
        const xl = X0 + i * paso, yl = Y;
        const xc = cx + Math.cos(ang) * R - W / 2, yc = cy + Math.sin(ang) * R + yCirc;
        return <Segmento key={sg.label + i} x={xl + (xc - xl) * q1} y={yl + (yc - yl) * q1} w={W} tipo={sg.tipo} label={sg.label} op={opCirc} />;
      })}
      {q1 > 0.6 && opCirc > 0.05 && (
        <g opacity={opCirc}>
          <circle cx={cx} cy={cy + yCirc} r={R + 26} fill="none" className={s.circuloEscision} />
          {q3 > 0.2 && <text x={cx + R + 34} y={cy + yCirc} className={s.lupaNota}>círculo de escisión</text>}
        </g>
      )}
      {/* Señales de recombinación (RSS) junto a los segmentos elegidos */}
      {q0 > 0 && q2 < 1 && (
        <g opacity={q0 * (1 - q2)}>
          <path d={`M${finIzq + 2},${Y - 26} l9,10 l-9,10 z`} fill="#222" opacity={0.6} />
          <path d={`M${iniDer - 2},${Y - 26} l-9,10 l9,10 z`} fill="#222" opacity={0.6} />
        </g>
      )}
      <Prot x={finIzq - 6} y={Y - 40} r={19} color={L.rag} nombre="RAG" op={q0 * (1 - tramo(p, 0.55, 0.65))} />
      <Prot x={iniDer + 6} y={Y - 40} r={19} color={L.rag} nombre="RAG" op={q0 * (1 - tramo(p, 0.55, 0.65))} />
      <Destello x={(finIzq + iniDer) / 2} y={Y} q={q2} color="#E5484D" r={26} />
      {q2 > 0 && q3 < 0.5 && <text x={LUPA_W / 2} y={LUPA_H - 14} textAnchor="middle" className={s.lupaNota}>RAG corta · Artemis abre las horquillas</text>}
      {/* Nucleótidos N de TdT en la unión */}
      {d.tdt && q4 > 0 && (
        <g>
          {[0, 1, 2].map((i) => {
            const k = tramo(q4, i * 0.25, i * 0.25 + 0.4);
            return k > 0 ? <rect key={i} x={finIzq + 3 + i * 7} y={Y - 8} width={6} height={16} rx={1.5} fill={COL_SEG.N} transform={`translate(0,${(1 - easeBack(k)) * -22})`} opacity={k} /> : null;
          })}
          <Prot x={finIzq + 13} y={Y - 44} r={19} color={L.tdt} nombre="TdT" op={tramo(q4, 0, 0.2) * (1 - tramo(p, 0.86, 0.92))} />
          {q4 > 0.3 && q5 === 0 && <text x={LUPA_W / 2} y={LUPA_H - 14} textAnchor="middle" className={s.lupaNota}>TdT añade nucleótidos N sin molde</text>}
        </g>
      )}
      <Prot x={finIzq + hueco / 2} y={Y + 50} r={22} color="#5B6475" nombre="Ligasa IV" op={tramo(q5, 0, 0.3)} />
      <Destello x={finIzq + hueco / 2} y={Y} q={q5} color="#3DDC97" r={24} />
      {q5 > 0.4 && <text x={LUPA_W / 2} y={LUPA_H - 14} textAnchor="middle" className={s.lupaOk} opacity={tramo(q5, 0.4, 0.8)}>{unidos} unidos: un reordenamiento único</text>}
    </g>
  );
}

// ─── Hipermutación somática ───────────────────────────────────────────────────

function Hipermutacion({ d, p }: { d: Extract<DatosProceso, { clase: 'shm' }>; p: number }) {
  const X0 = 40, X1 = 540, Y = 140;
  const pos = Array.from({ length: d.mutaciones }, (_, i) => X0 + 30 + ((i * 0.618 + 0.13) % 1) * (X1 - X0 - 60));
  const orden = [...pos].sort((a, b) => a - b);
  const q = easeInOut(tramo(p, 0.08, 0.86));
  const xAid = X0 + (X1 - X0) * q;
  const hechas = orden.filter((x) => x < xAid).length;
  return (
    <g>
      <Titulo texto="Hipermutación somática" sub="AID desamina C → U en la región V; la reparación propensa a errores la fija" />
      <rect x={X0} y={Y - 18} width={X1 - X0} height={36} rx={8} fill={COL_SEG.V} opacity={0.18} />
      <rect x={X0} y={Y - 18} width={X1 - X0} height={36} rx={8} fill="none" stroke={COL_SEG.V} strokeWidth={2} />
      {Array.from({ length: 42 }, (_, i) => <line key={i} x1={X0 + 8 + i * 12} y1={Y - 10} x2={X0 + 8 + i * 12} y2={Y + 10} stroke={COL_SEG.V} strokeWidth={1.5} opacity={0.35} />)}
      <text x={X0 + 8} y={Y + 40} className={s.lupaNota}>región variable (VDJ) · CDR1 · CDR2 · CDR3</text>
      {orden.map((x, i) => {
        if (x >= xAid) return null;
        const k = tramo(xAid - x, 0, 40);
        return (
          <g key={i}>
            <line x1={x} y1={Y - 20} x2={x} y2={Y + 20} stroke="#E5484D" strokeWidth={4} strokeLinecap="round" />
            {k < 1 && <text x={x} y={Y - 34 - 10 * k} textAnchor="middle" className={s.mutTxt} opacity={1 - k}>C→U</text>}
            <Destello x={x} y={Y} q={k} color="#E5484D" r={14} />
          </g>
        );
      })}
      <Prot x={xAid} y={Y - 52} r={22} color={L.aid} nombre="AID" op={tramo(p, 0.02, 0.1) * (1 - tramo(p, 0.9, 1))} />
      <g transform={`translate(${LUPA_W - 18},${Y + 64})`}>
        <text textAnchor="end" className={s.lupaOk}>{hechas} {hechas === 1 ? 'mutación' : 'mutaciones'}</text>
      </g>
      {p > 0.55 && <text x={X0} y={Y + 66} className={s.lupaNota} opacity={tramo(p, 0.55, 0.7)}>UNG · MSH2/MSH6 · polimerasa η</text>}
    </g>
  );
}

// ─── Cambio de clase ──────────────────────────────────────────────────────────

function CambioClase({ d, p }: { d: Extract<DatosProceso, { clase: 'csr' }>; p: number }) {
  const destino = d.hacia === 'IgG' ? 'Cγ1' : d.hacia === 'IgA' ? 'Cα1' : 'Cε';
  const fila: Seg[] = [
    { label: 'VDJ', tipo: 'V' }, { label: 'Sμ', tipo: 'S' }, { label: 'Cμ', tipo: 'C' }, { label: 'Cδ', tipo: 'C' },
    { label: 'Sγ3', tipo: 'S' }, { label: 'Cγ3', tipo: 'C' }, { label: 'Sγ1', tipo: 'S' }, { label: 'Cγ1', tipo: 'C' },
    { label: 'Sα1', tipo: 'S' }, { label: 'Cα1', tipo: 'C' }, { label: 'Sε', tipo: 'S' }, { label: 'Cε', tipo: 'C' },
  ];
  const iDest = fila.findIndex((f) => f.label === destino);
  const a = 1, b = iDest - 1; // corta en Sμ y en la S del destino
  const W = 40, GAP = 5, X0 = 18, Y = 112, paso = W + GAP;
  const nExc = b - a - 1;
  const S = (nExc + 1) * paso; // también se funden las dos S en una
  const q0 = easeOut(tramo(p, 0, 0.14));
  const q1 = easeInOut(tramo(p, 0.16, 0.42));
  const q2 = tramo(p, 0.42, 0.5);
  const q3 = easeInOut(tramo(p, 0.5, 0.74));
  const q5 = tramo(p, 0.8, 1);
  const corr = S * q1;
  const xA = X0 + a * paso, xB = X0 + b * paso - corr;
  const cx = (xA + W + xB) / 2, R = Math.max(30, ((nExc + 1) * paso) / (2 * Math.PI) + 12), cy = Y + 62;
  const opC = 1 - tramo(p, 0.66, 0.76);
  return (
    <g>
      <Titulo texto={`Cambio de clase: IgM → ${d.hacia}`} sub={`AID corta en las regiones switch · citocina: ${d.citocina}`} />
      <line x1={8} y1={Y} x2={LUPA_W - 8} y2={Y} className={s.adn} strokeWidth={3} />
      {fila.map((f, i) => {
        if (i <= a) return <Segmento key={f.label} x={X0 + i * paso} y={Y} w={W} tipo={f.tipo} label={f.label} />;
        if (i >= b) return <Segmento key={f.label} x={X0 + i * paso - corr} y={Y} w={W} tipo={i === iDest ? 'C' : f.tipo} label={f.label} op={i === b ? 1 - q1 * 0.6 : 1} />;
        const k = i - a - 1;
        const ang = Math.PI / 2 - (k + 0.5 - nExc / 2) * (2 * Math.PI / Math.max(nExc, 3));
        const xc = cx + Math.cos(ang) * R - W / 2, yc = cy + Math.sin(ang) * R + 24 * q3;
        const xl = X0 + i * paso;
        return <Segmento key={f.label} x={xl + (xc - xl) * q1} y={Y + (yc - Y) * q1} w={W} tipo={f.tipo} label={f.label} op={opC} />;
      })}
      {q1 > 0.6 && opC > 0.05 && <circle cx={cx} cy={cy + 24 * q3} r={R + 26} fill="none" className={s.circuloEscision} opacity={opC} />}
      <Prot x={xA + W / 2} y={Y - 40} r={19} color={L.aid} nombre="AID" op={q0 * (1 - tramo(p, 0.5, 0.6))} />
      <Prot x={xB + W / 2} y={Y - 40} r={19} color={L.aid} nombre="AID" op={q0 * (1 - tramo(p, 0.5, 0.6))} />
      <Destello x={(xA + W + xB) / 2} y={Y} q={q2} color="#E5484D" r={26} />
      <Destello x={xA + W} y={Y} q={q5} color="#3DDC97" r={24} />
      {q5 > 0.3 && (
        <text x={LUPA_W / 2} y={LUPA_H - 14} textAnchor="middle" className={s.lupaOk} opacity={tramo(q5, 0.3, 0.7)}>VDJ junto a {destino}: misma especificidad, nueva clase</text>
      )}
      {q3 > 0.3 && opC > 0.05 && <text x={cx + R + 34} y={cy + 24 * q3} className={s.lupaNota} opacity={opC}>círculo de switch</text>}
    </g>
  );
}

// ─── Translocación ────────────────────────────────────────────────────────────

function Cromosoma({ x, y, h, nombre, bandas, color }: { x: number; y: number; h: number; nombre: string; bandas: number[]; color: string }) {
  const w = 40, cen = h * 0.32;
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={`M${-w / 2},8 Q${-w / 2},0 0,0 Q${w / 2},0 ${w / 2},8 L${w / 2},${cen - 8} Q${w / 4},${cen} ${w / 2},${cen + 8} L${w / 2},${h - 10} Q${w / 2},${h} 0,${h} Q${-w / 2},${h} ${-w / 2},${h - 10} L${-w / 2},${cen + 8} Q${-w / 4},${cen} ${-w / 2},${cen - 8} Z`} fill={color} stroke="#5B6475" strokeWidth={1.5} />
      {bandas.map((b, i) => <rect key={i} x={-w / 2 + 2} y={b * h} width={w - 4} height={7} fill="#5B6475" opacity={0.35} />)}
      <text y={-10} textAnchor="middle" className={s.cromTxt}>{nombre}</text>
    </g>
  );
}

function Translocacion({ d, p }: { d: Extract<DatosProceso, { clase: 'translocacion' }>; p: number }) {
  // Los cromosomas empiezan bajo el subtítulo (su nombre va encima).
  const H = 142, Y0 = 92, XA = 130, XB = 290;
  const rA = 0.78, rB = d.b === '11' ? 0.55 : d.b === '8' ? 0.82 : 0.72;
  const q0 = tramo(p, 0.05, 0.25);
  const q1 = easeInOut(tramo(p, 0.3, 0.62));
  const q2 = tramo(p, 0.66, 1);
  const w = 36;
  // Trozos distales que se intercambian.
  const tA = { y: Y0 + rA * H, h: (1 - rA) * H };
  const tB = { y: Y0 + rB * H, h: (1 - rB) * H };
  const xa = XA + (XB - XA) * q1, ya = tA.y + (tB.y - tA.y) * q1 - 40 * Math.sin(Math.PI * q1);
  const xb = XB + (XA - XB) * q1, yb = tB.y + (tA.y - tB.y) * q1 + 40 * Math.sin(Math.PI * q1);
  const brillo = 0.5 + 0.5 * Math.sin(p * Math.PI * 10);
  return (
    <g>
      <Titulo texto={d.nombre} sub="Un error de RAG o de AID une dos cromosomas rotos" />
      <Cromosoma x={XA} y={Y0} h={rA * H} nombre={`Cromosoma ${d.a}`} bandas={[0.15, 0.45, 0.7]} color="#E6ECF7" />
      <Cromosoma x={XB} y={Y0} h={rB * H} nombre={`Cromosoma ${d.b}`} bandas={[0.2, 0.5, 0.75]} color="#F5ECE0" />
      {/* Trozo distal de A (lleva IGH) — en una t(14;x) el gen pareja viaja hacia IGH */}
      <g transform={`translate(${xa},${ya})`}>
        <rect x={-w / 2} y={0} width={w} height={tA.h} rx={10} fill="#E6ECF7" stroke="#5B6475" strokeWidth={1.5} />
        <rect x={-w / 2 + 3} y={tA.h * 0.25} width={w - 6} height={12} rx={3} fill={L.b} />
        <text x={w / 2 + 6} y={tA.h * 0.25 + 10} className={s.cromGen}>{d.genA}</text>
      </g>
      <g transform={`translate(${xb},${yb})`}>
        <rect x={-w / 2} y={0} width={w} height={tB.h} rx={10} fill="#F5ECE0" stroke="#5B6475" strokeWidth={1.5} />
        <rect x={-w / 2 + 3} y={tB.h * 0.2} width={w - 6} height={12} rx={3} fill={L.neoplasia} opacity={q2 > 0 ? 0.6 + 0.4 * brillo : 1} />
        <text x={-w / 2 - 6} y={tB.h * 0.2 + 10} textAnchor="end" className={s.cromGen}>{d.genB}</text>
      </g>
      {q0 > 0 && q1 < 0.2 && (
        <g opacity={q0 * (1 - tramo(q1, 0, 0.2))}>
          <line x1={XA - 30} y1={tA.y} x2={XA + 30} y2={tA.y} stroke="#E5484D" strokeWidth={3} strokeDasharray="5 4" />
          <line x1={XB - 30} y1={tB.y} x2={XB + 30} y2={tB.y} stroke="#E5484D" strokeWidth={3} strokeDasharray="5 4" />
          <text x={(XA + XB) / 2} y={Math.min(tA.y, tB.y) - 12} textAnchor="middle" className={s.lupaNota}>puntos de rotura</text>
        </g>
      )}
      {q2 > 0 && (
        <g opacity={easeOut(q2)}>
          <circle cx={XA} cy={tA.y + 8} r={16 + 8 * brillo} fill="#FFD23F" opacity={0.35} />
          <text x={XA - 34} y={tA.y + 4} textAnchor="end" className={s.cromGen}>potenciador IGH</text>
          <text x={380} y={110} className={s.lupaOk}>der({d.a}): {d.genB} junto a IGH</text>
          <foreignObject x={380} y={124} width={190} height={100}>
            <p className={s.lupaEfecto}>{d.efecto}</p>
          </foreignObject>
        </g>
      )}
    </g>
  );
}

// ─── Afinidad (selección) ─────────────────────────────────────────────────────

function Afinidad({ d, p }: { d: Extract<DatosProceso, { clase: 'afinidad' }>; p: number }) {
  const X0 = 40, X1 = 540, Y = 130;
  const zonas = [
    { de: 0, a: 0.15, color: '#B0B8C6', nombre: 'nula' },
    { de: 0.15, a: 0.7, color: '#2FA36B', nombre: 'baja-moderada' },
    { de: 0.7, a: 1, color: '#E5484D', nombre: 'alta' },
  ];
  const q = easeOut(tramo(p, 0.12, 0.6));
  const v = d.valor * q;
  const xv = X0 + (X1 - X0) * v;
  const zona = zonas.find((z) => d.valor >= z.de && d.valor <= z.a) ?? zonas[1];
  return (
    <g>
      <Titulo texto={d.titulo} sub="¿Con cuánta fuerza se une el receptor?" />
      {zonas.map((z) => (
        <g key={z.nombre}>
          <rect x={X0 + (X1 - X0) * z.de} y={Y - 14} width={(X1 - X0) * (z.a - z.de)} height={28} fill={z.color} opacity={0.22} />
          <text x={X0 + (X1 - X0) * (z.de + z.a) / 2} y={Y + 36} textAnchor="middle" className={s.lupaNota}>{z.nombre}</text>
        </g>
      ))}
      <rect x={X0} y={Y - 14} width={X1 - X0} height={28} rx={6} fill="none" stroke="#B0B8C6" strokeWidth={1.5} />
      <rect x={X0} y={Y - 6} width={Math.max(0, xv - X0)} height={12} rx={6} fill={zona.color} />
      <g transform={`translate(${xv},${Y})`}>
        <path d="M0,-26 L9,-38 L-9,-38 Z" fill="#1B1F2A" />
      </g>
      {p > 0.62 && (
        <text x={LUPA_W / 2} y={Y + 78} textAnchor="middle" className={s.lupaResultado} fill={zona.color} opacity={tramo(p, 0.62, 0.8)}>{d.resultado}</text>
      )}
    </g>
  );
}

// ─── Clonalidad ───────────────────────────────────────────────────────────────

function Clonalidad({ p }: { p: number }) {
  const colores = ['#4C7BE0', '#2FA36B', '#E09A2E', '#8E7CC3', '#D9567E', '#2CA9BC', '#C2410C', '#5B6475'];
  const celda = (x: number, y: number, c: string, k: number, i: number) => k > 0 ? (
    <g key={i} transform={`translate(${x},${y}) scale(${easeBack(Math.min(1, k))})`}>
      <circle r={15} fill="#F4F6FA" stroke="#B0B8C6" strokeWidth={1.2} />
      <circle r={9} fill={c} opacity={0.85} />
    </g>
  ) : null;
  const curva = (x0: number, pico: boolean, k: number) => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const t = i / 40;
      const yv = pico ? Math.exp(-Math.pow((t - 0.5) / 0.04, 2)) : Math.exp(-Math.pow((t - 0.5) / 0.2, 2)) * 0.5;
      return `${i ? 'L' : 'M'}${x0 + t * 200},${220 - yv * 52 * k}`;
    }).join(' ');
    return <path d={pts} fill="none" stroke={pico ? '#E5484D' : '#2FA36B'} strokeWidth={2.5} />;
  };
  const kL = tramo(p, 0.05, 0.45), kR = tramo(p, 0.45, 0.85), kC = tramo(p, 0.7, 1);
  return (
    <g>
      <Titulo texto="Policlonal frente a monoclonal" sub="Cada color es un reordenamiento V(D)J distinto" />
      <text x={135} y={76} textAnchor="middle" className={s.lupaNota}>Reactivo: policlonal</text>
      <text x={430} y={76} textAnchor="middle" className={s.lupaNota}>Linfoma: monoclonal</text>
      {colores.map((c, i) => celda(60 + (i % 4) * 50, 100 + Math.floor(i / 4) * 40, c, tramo(kL, i * 0.08, i * 0.08 + 0.4), i))}
      {colores.map((_, i) => celda(355 + (i % 4) * 50, 100 + Math.floor(i / 4) * 40, '#E5484D', tramo(kR, i * 0.08, i * 0.08 + 0.4), i + 10))}
      {kC > 0 && (
        <g opacity={kC}>
          {curva(35, false, kC)}
          {curva(330, true, kC)}
          <text x={135} y={236} textAnchor="middle" className={s.lupaNota}>PCR de IGH: campana</text>
          <text x={430} y={236} textAnchor="middle" className={s.lupaNota}>PCR de IGH: pico único</text>
        </g>
      )}
    </g>
  );
}

// ─── Factores de transcripción ────────────────────────────────────────────────

function Factores({ d, p }: { d: Extract<DatosProceso, { clase: 'factores' }>; p: number }) {
  const n = d.factores.length;
  const sep = Math.min(130, (LUPA_W - 80) / n);
  const x0 = LUPA_W / 2 - ((n - 1) * sep) / 2;
  return (
    <g>
      <Titulo texto={d.titulo} sub="Factores de transcripción y enzimas que se encienden" />
      {d.factores.map((f, i) => {
        const k = tramo(p, 0.1 + i * 0.15, 0.3 + i * 0.15);
        return <Prot key={f.nombre} x={x0 + i * sep} y={140} r={40} color={f.color} nombre={f.nombre} op={k} esc={easeBack(Math.min(1, k))} />;
      })}
    </g>
  );
}

export default function Proceso({ datos, p }: { datos: DatosProceso; p: number }) {
  switch (datos.clase) {
    case 'vdj': return <Recombinacion d={datos} p={p} />;
    case 'shm': return <Hipermutacion d={datos} p={p} />;
    case 'csr': return <CambioClase d={datos} p={p} />;
    case 'translocacion': return <Translocacion d={datos} p={p} />;
    case 'afinidad': return <Afinidad d={datos} p={p} />;
    case 'clonalidad': return <Clonalidad p={p} />;
    case 'factores': return <Factores d={datos} p={p} />;
  }
}
