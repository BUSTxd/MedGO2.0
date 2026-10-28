'use client';
// Escenario SVG del laboratorio «Hipersensibilidad». Pinta una `Escena` ya
// evaluada por el motor: el TEJIDO de fondo con sus parámetros animados (y un
// fundido si el paso cambia de tejido), las células (recortes de Robbins,
// ilustraciones de Servier o dibujos con código) con sus receptores, los
// anticuerpos orientados, los chorros de mediadores, los seudópodos del
// fagocito y la «lupa» con el proceso molecular. Interacción de cámara (rueda,
// pellizco, arrastre) igual que en «Maduración de linfocitos».

import { memo, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { Dibujo, Escenario, TipoMarcador } from '@/lib/data/hipersensibilidad/tipos';
import { PARTICULA } from '@/lib/data/hipersensibilidad/colores';
import { ALTO, ANCHO, CELDA, LUPA_H, LUPA_W, cajaActor, hash, posAbs, posLupa, rotAbs, type ActorSt, type Caja, type ConectorSt, type DesenlaceSt, type EfectoSt, type Escena as EscenaSt, type MarcadorSt, type ProcesoSt } from '@/lib/hipersensibilidad/motor';
import { trazoEntre, type Punto, type Trazo } from '@/lib/ciclo-celular/geometria';
import { DefsCelulas } from '../maduracion-linfocitos/Celulas';
import { Anticuerpo, Complejo, DefsPropias, DibujoCelula } from './Celulas';
import { FondoDe } from './Fondos';
import { FuentesImagen, medidasImagen, srcImagen } from './imagenes';

// Las lupas (con su contenido de los capítulos) se bajan aparte: la landing, que no las
// usa, no las carga; el laboratorio las precarga al montar la escena (ver `Escena`).
const cargarProcesos = () => import('./Procesos');
const Proceso = dynamic(cargarProcesos, { ssr: false });
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import s from '@/styles/hipersensibilidad.module.css';

const g = (v: number) => v * CELDA;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// ─── Marcadores de membrana ───────────────────────────────────────────────────

const COLOR_MARCADOR: Record<TipoMarcador, string> = {
  fceri: '#E8B21E', fcgr: '#2C8FD6', cr: '#E8B21E', tcr: '#C0396E', mhc1: '#C9792A', mhc2: '#A9502A', cd: '#5B6475', receptor: '#5B6475', cd40l: '#1F9A6A',
};

function GlifoMarcador({ m }: { m: MarcadorSt }) {
  const col = m.color ?? COLOR_MARCADOR[m.tipo];
  switch (m.tipo) {
    case 'fceri':
    case 'fcgr':
      // Receptor de Fc: un vástago con una «copa» que recibe el Fc.
      return <g><rect x={-3.5} y={-12} width={7} height={12} rx={2} fill={col} /><path d="M-9,-24 L-9,-13 Q0,-8 9,-13 L9,-24" stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" /></g>;
    case 'cr':
      return <g><rect x={-3} y={-12} width={6} height={12} rx={2} fill={col} /><path d="M-8,-22 Q-8,-12 0,-12 Q8,-12 8,-22" stroke={col} strokeWidth={4.5} fill="none" strokeLinecap="round" /></g>;
    case 'tcr':
      return <g><rect x={-8} y={-26} width={7} height={26} rx={3} fill={col} /><rect x={1} y={-26} width={7} height={26} rx={3} fill={col} opacity={0.7} /></g>;
    case 'cd':
      return <g><line x1={0} y1={0} x2={0} y2={-16} stroke={col} strokeWidth={3} /><circle cy={-20} r={6} fill={col} /></g>;
    case 'cd40l':
      return <g>{[[-4, -14], [4, -14], [0, -21]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill={col} />)}<line x1={0} y1={0} x2={0} y2={-10} stroke={col} strokeWidth={3} /></g>;
    case 'mhc1':
    case 'mhc2':
      return <path d="M-9,-26 L-9,-6 Q0,4 9,-6 L9,-26" stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case 'receptor':
      return <g><rect x={-7} y={-22} width={14} height={22} rx={5} fill={col} /><rect x={-11} y={-28} width={22} height={8} rx={4} fill={col} opacity={0.7} /></g>;
  }
}

function Marcadores({ a, d }: { a: ActorSt; d: number }) {
  const r = d / 2;
  return (
    <g>
      {a.marcadores.map((m) => {
        const ang = (m.ang * Math.PI) / 180;
        const x = Math.cos(ang) * r * 0.94, y = Math.sin(ang) * r * 0.94;
        const k = Math.max(0, Math.min(1.2, m.op));
        return (
          <g key={m.id} opacity={Math.min(1, m.op)}>
            <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${m.ang + 90}) scale(${k.toFixed(3)})`}><GlifoMarcador m={m} /></g>
            {m.label && <text x={Math.cos(ang) * (r + 44)} y={Math.sin(ang) * (r + 44)} textAnchor="middle" dy="0.35em" className={ls.marcadorTxt} style={{ fill: m.color ?? COLOR_MARCADOR[m.tipo] }}>{m.label}</text>}
          </g>
        );
      })}
    </g>
  );
}

// ─── Actor ────────────────────────────────────────────────────────────────────

function Cuerpo({ a, img, dibujo }: { a: ActorSt; img?: string; dibujo?: Dibujo }) {
  const d = a.d;
  if (a.forma === 'ancla') return null;
  if (a.forma === 'anticuerpo') return <Anticuerpo ab={a.ab ?? 'IgG'} d={d} />;
  if (a.forma === 'complejo') return <Complejo n={a.n ?? 4} d={d} />;
  if (a.forma === 'proteina') {
    return (
      <g>
        <circle r={d / 2} fill={a.color} />
        <circle r={d / 2} fill="url(#brilloProt)" />
        <text textAnchor="middle" dy="0.35em" className={ls.protTxt} style={{ fontSize: Math.min(17, (d - 8) / (a.label.length * 0.55)) }}>{a.label}</text>
      </g>
    );
  }
  const fuentes = useContext(FuentesImagen);
  const src = img ? (fuentes?.[img] ?? srcImagen(img)) : null;
  const m = img ? medidasImagen(img) : null;
  if (src && m) {
    const k = d / Math.max(m.w, m.h);
    return <image href={src} x={(-m.w * k) / 2} y={(-m.h * k) / 2} width={m.w * k} height={m.h * k} preserveAspectRatio="xMidYMid meet" />;
  }
  if (dibujo) return <DibujoCelula dibujo={dibujo} d={d} color={a.color} vacio={a.granulos} />;
  if (a.forma === 'molecula') {
    return <g>{[[-0.35, 0.2], [0.35, 0.2], [0, -0.3]].map(([x, y], i) => <circle key={i} cx={x * d * 0.6} cy={y * d * 0.6} r={d * 0.28} fill={a.color} stroke="#1B1F2A" strokeOpacity={0.25} strokeWidth={1.2} />)}</g>;
  }
  return <DibujoCelula dibujo="linfocito" d={d} color={a.color} />;
}

/** Poros de exocitosis en la membrana mientras se vacían los gránulos. */
function Exocitosis({ d, k }: { d: number; k: number }) {
  const r = d / 2;
  return <g>{Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + 0.4; const q = clamp(k * 1.6 - i * 0.08); return q > 0 ? <circle key={i} cx={Math.cos(a) * r * 0.9} cy={Math.sin(a) * r * 0.9} r={r * 0.12 * q} className={s.poroExo} opacity={1 - k * 0.5} /> : null; })}</g>;
}

/** Poros del complejo de ataque a la membrana. */
function PorosMac({ d, k }: { d: number; k: number }) {
  const r = d / 2;
  return <g>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + hash(i, 4); const q = clamp(k * 2 - i * 0.1); return q > 0 ? <circle key={i} cx={Math.cos(a) * r * 0.86} cy={Math.sin(a) * r * 0.86} r={4.5 * q} className={s.poroMac} /> : null; })}</g>;
}

const Actor = memo(function Actor({ a, pos, rot, atenuar, seleccionado, interactivo, onClick }: { a: ActorSt; pos: Punto; rot: number; atenuar: number; seleccionado: boolean; interactivo: boolean; onClick?: (k: string) => void }) {
  const d = a.d;
  if (a.forma === 'ancla') return null;
  const filtro = a.gris > 0.01 ? `grayscale(${a.gris.toFixed(2)}) brightness(${(1 + 0.1 * a.gris).toFixed(2)})` : undefined;
  const esCelula = a.forma === 'celula' || a.forma === 'dibujo';
  const pulsable = interactivo && a.forma !== 'anticuerpo';
  const sep = a.surco * d * 0.2;
  return (
    <g
      transform={`translate(${(pos.x + a.ex).toFixed(1)},${(pos.y + a.ey).toFixed(1)})`}
      opacity={a.op * atenuar}
      className={pulsable ? c.actorInteractivo : c.actor}
      role={pulsable ? 'button' : 'img'}
      tabIndex={pulsable ? 0 : undefined}
      aria-label={a.label}
      onClick={pulsable && onClick ? () => onClick(a.key) : undefined}
      onKeyDown={pulsable && onClick ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(a.key); } } : undefined}
    >
      <g transform={`rotate(${rot.toFixed(2)}) scale(${a.esc.toFixed(3)})`}>
        {(a.halo > 0.01 || seleccionado) && <circle r={d * 0.72} fill={`url(#halo-${a.key})`} opacity={seleccionado ? 1 : a.halo} />}
        {seleccionado && <circle r={d * 0.64} fill="none" stroke="var(--dapi)" strokeWidth={3} strokeDasharray="6 7" />}
        {a.fago > 0.01 && <circle r={d * 0.62} className={s.fagosoma} opacity={a.fago} />}
        <g style={filtro ? { filter: filtro } : undefined}>
          {a.surco > 0.01 ? (
            <g>
              <g transform={`translate(${-sep},0) scale(${1 - 0.12 * a.surco})`}><Cuerpo a={a} img={a.img} dibujo={a.dibujo} /></g>
              <g transform={`translate(${sep},0) scale(${1 - 0.12 * a.surco})`} opacity={0.92}><Cuerpo a={a} img={a.img} dibujo={a.dibujo} /></g>
            </g>
          ) : (
            <>
              {a.prev && <g opacity={1 - a.mezcla}><Cuerpo a={a} img={a.prev.img} dibujo={a.prev.dibujo} /></g>}
              <g opacity={a.prev ? a.mezcla : 1}><Cuerpo a={a} img={a.img} dibujo={a.dibujo} /></g>
            </>
          )}
          {esCelula && <Marcadores a={a} d={d} />}
          {a.granulos > 0.01 && a.granulos < 0.999 && esCelula && <Exocitosis d={d} k={a.granulos} />}
          {a.lisis > 0.01 && <PorosMac d={d} k={a.lisis} />}
        </g>
        {a.apoptosis > 0.01 && (
          <g>
            {Array.from({ length: 8 }, (_, i) => {
              const ang = (i / 8) * Math.PI * 2 + 0.4;
              const k = Math.min(1, a.apoptosis * 1.6 - i * 0.06);
              return k > 0 ? <circle key={i} cx={Math.cos(ang) * d * 0.5} cy={Math.sin(ang) * d * 0.5} r={d * 0.09 * k} className={ls.burbuja} /> : null;
            })}
          </g>
        )}
      </g>
    </g>
  );
});

function Rotulos({ a, pos, tx, bajar = 0 }: { a: ActorSt; pos: Punto; tx: number; bajar?: number }) {
  if (a.op < 0.3 || a.forma === 'proteina' || a.forma === 'anticuerpo' || a.forma === 'ancla' || a.fago > 0.5 || !a.label) return null;
  const d = a.d * a.esc;
  const y0 = pos.y + d / 2 + (a.forma === 'molecula' ? 18 : 26) * tx + bajar;
  return (
    <g opacity={Math.min(1, a.op)} transform={`translate(${pos.x},${y0}) scale(${tx})`}>
      <text textAnchor="middle" className={a.forma === 'molecula' ? ls.rotuloMol : ls.rotuloCelula}>{a.label}</text>
      {a.sub && <text y={19} textAnchor="middle" className={ls.subCelula}>{a.sub}</text>}
    </g>
  );
}

// ─── Conectores, efectos, notas, desenlaces ───────────────────────────────────

const COLOR_CON: Record<string, string> = { activa: '#1F9A6A', inhibe: '#E5484D', migra: '#8A93A6', secreta: '#2CA9BC', une: '#5B6475' };

function Conector({ cn, tr, tx = 1 }: { cn: ConectorSt; tr: Trazo; tx?: number }) {
  const col = COLOR_CON[cn.type];
  const dash = cn.type === 'migra' ? '10 8' : cn.type === 'secreta' ? '2 7' : undefined;
  const t = Math.max(0.02, cn.prog);
  const q = { x: tr.ini.x + (tr.ctrl.x - tr.ini.x) * t, y: tr.ini.y + (tr.ctrl.y - tr.ini.y) * t };
  const e = tr.en(t);
  const dPath = t >= 0.999 ? tr.d : `M${tr.ini.x},${tr.ini.y} Q${q.x},${q.y} ${e.x},${e.y}`;
  const kp = Math.min(1, (cn.prog - 0.8) / 0.2);
  return (
    <g opacity={cn.op}>
      <path d={dPath} fill="none" stroke={col} strokeWidth={cn.type === 'une' ? 2.5 : 3.5} strokeDasharray={dash} strokeLinecap="round" />
      {kp > 0 && cn.type !== 'une' && (
        <g transform={`translate(${tr.fin.x},${tr.fin.y}) rotate(${(tr.angFin * 180) / Math.PI}) scale(${kp})`}>
          {cn.type === 'inhibe' ? <line x1={0} y1={-11} x2={0} y2={11} stroke={col} strokeWidth={5} strokeLinecap="round" /> : <path d="M2,0 L-16,-9 L-12,0 L-16,9 Z" fill={col} />}
        </g>
      )}
      {cn.label && cn.prog > 0.6 && (
        <g transform={`translate(${tr.medio.x},${tr.medio.y}) scale(${tx})`}>
          <rect x={-(cn.label.length * 4.8 + 10)} y={-12} width={cn.label.length * 9.6 + 20} height={24} rx={8} className={ls.etiquetaFondo} />
          <text textAnchor="middle" dy="0.35em" className={ls.etiquetaConector}>{cn.label}</text>
        </g>
      )}
    </g>
  );
}

function GlifoParticula({ forma, color }: { forma: (typeof PARTICULA)[keyof typeof PARTICULA]['forma']; color: string }) {
  switch (forma) {
    case 'punto': return <circle r={5.5} fill={color} />;
    case 'triangulo': return <path d="M0,-7 L6.5,5 L-6.5,5 Z" fill={color} />;
    case 'rombo': return <path d="M0,-7 L6,0 L0,7 L-6,0 Z" fill={color} />;
    case 'chispa': return <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill={color} />;
    case 'gota': return <path d="M0,-8 C5,-2 6,2 0,7 C-6,2 -5,-2 0,-8 Z" fill={color} opacity={0.8} />;
    case 'y': return <path d="M0,8 L0,0 M0,0 L-6,-8 M0,0 L6,-8" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />;
  }
}

function Particulas({ e }: { e: Extract<EfectoSt, { tipo: 'particulas' }> }) {
  const P = PARTICULA[e.kind];
  const hayDestino = e.x2 !== undefined && e.y2 !== undefined;
  const out: ReactNode[] = [];
  for (let i = 0; i < e.n; i++) {
    const retraso = hash(i, e.semilla) * 0.45;
    const u = clamp((e.p - retraso) / 0.55);
    if (u <= 0 || u >= 1) continue;
    const a = hash(i, e.semilla + 1) * Math.PI * 2;
    const x0 = e.x1 + Math.cos(a) * e.r, y0 = e.y1 + Math.sin(a) * e.r;
    let x: number, y: number;
    const q = 1 - Math.pow(1 - u, 2);
    if (hayDestino) {
      const tx = e.x2! + (hash(i, e.semilla + 2) - 0.5) * 60, ty = e.y2! + (hash(i, e.semilla + 3) - 0.5) * 60;
      const dx = tx - x0, dy = ty - y0, L = Math.hypot(dx, dy) || 1;
      const off = (hash(i, e.semilla + 4) - 0.5) * Math.min(160, L * 0.5);
      const cx = (x0 + tx) / 2 - (dy / L) * off, cy = (y0 + ty) / 2 + (dx / L) * off;
      x = (1 - q) ** 2 * x0 + 2 * (1 - q) * q * cx + q * q * tx;
      y = (1 - q) ** 2 * y0 + 2 * (1 - q) * q * cy + q * q * ty;
    } else {
      const L = 60 + hash(i, e.semilla + 5) * 130;
      x = x0 + Math.cos(a) * L * q; y = y0 + Math.sin(a) * L * q;
    }
    const op = Math.min(1, u * 8) * (u > 0.8 ? (1 - u) * 5 : 1);
    out.push(<g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(a * 57.3).toFixed(0)})`} opacity={op}><GlifoParticula forma={P.forma} color={P.color} /></g>);
  }
  const lp = clamp((e.p - 0.15) / 0.15) * clamp((0.95 - e.p) / 0.15);
  return (
    <g>
      {out}
      {e.label && lp > 0 && (
        <g transform={`translate(${hayDestino ? (e.x1 + e.x2!) / 2 : e.x1},${(hayDestino ? (e.y1 + e.y2!) / 2 : e.y1 - e.r - 40) - 22})`} opacity={lp}>
          <rect x={-(e.label.length * 5 + 12)} y={-14} width={e.label.length * 10 + 24} height={28} rx={10} className={s.etiquetaChorro} style={{ stroke: P.color }} />
          <text textAnchor="middle" dy="0.35em" className={s.etiquetaChorroTxt} style={{ fill: P.color }}>{e.label}</text>
        </g>
      )}
    </g>
  );
}

function Efecto({ e, trazos }: { e: EfectoSt; trazos: Map<string, Trazo> }) {
  switch (e.tipo) {
    case 'destello':
      return <circle cx={e.x} cy={e.y} r={e.r * (1 + 0.5 * e.p)} fill="none" stroke={e.color} strokeWidth={4 * (1 - e.p) + 1} opacity={1 - e.p} />;
    case 'fragmentos':
      return (
        <g opacity={1 - e.p}>
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <circle key={i} cx={e.x + Math.cos(a) * (e.r + 50 * e.p)} cy={e.y + Math.sin(a) * (e.r + 50 * e.p)} r={6} className={ls.burbuja} />;
          })}
        </g>
      );
    case 'punto': {
      const tr = e.via ? trazos.get(e.via) : undefined;
      const q = tr ? tr.en(Math.min(1, Math.max(0, e.f))) : { x: e.x1 + (e.x2 - e.x1) * e.f, y: e.y1 + (e.y2 - e.y1) * e.f };
      return <g><circle cx={q.x} cy={q.y} r={16} fill={e.color} opacity={0.25} /><circle cx={q.x} cy={q.y} r={7} fill={e.color} /></g>;
    }
    case 'particulas':
      return <Particulas e={e} />;
    case 'seudopodos': {
      // Dos brazos que salen del lado del fagocito y se cierran alrededor.
      const base = ((e.ang + 180) * Math.PI) / 180;
      const abre = (40 + 140 * e.p) * (Math.PI / 180);
      const R = e.r * 1.3;
      const arco = (a0: number, a1: number) => `M${e.x + Math.cos(a0) * R},${e.y + Math.sin(a0) * R} A${R},${R} 0 0 ${a1 > a0 ? 1 : 0} ${e.x + Math.cos(a1) * R},${e.y + Math.sin(a1) * R}`;
      return (
        <g>
          <path d={arco(base, base + abre)} className={s.seudopodo} style={{ stroke: e.color === '#7FA7D9' ? undefined : e.color }} />
          <path d={arco(base, base - abre)} className={s.seudopodo} style={{ stroke: e.color === '#7FA7D9' ? undefined : e.color }} />
        </g>
      );
    }
  }
}

const DESENLACE: Record<DesenlaceSt['kind'], { color: string }> = {
  sobrevive: { color: '#1F9A6A' }, muere: { color: '#8A93A6' }, sale: { color: '#2F6FD0' }, lesion: { color: '#E5484D' }, alivio: { color: '#1F9A6A' },
};

function Desenlace({ d, tx, vista }: { d: DesenlaceSt; tx: number; vista: Caja }) {
  const col = DESENLACE[d.kind].color;
  const W = Math.max(280, d.texto.length * 11 + 80), Hh = 64;
  const m = (W * tx) / 2 + 8;
  const x = vista.w > 2 * m ? Math.max(vista.x + m, Math.min(vista.x + vista.w - m, d.x)) : d.x;
  return (
    <g transform={`translate(${x},${d.y}) scale(${(0.9 + 0.1 * d.op) * tx})`} opacity={d.op}>
      <rect x={-W / 2} y={-Hh / 2} width={W} height={Hh} rx={16} className={ls.desenlaceCaja} stroke={col} />
      <circle cx={-W / 2 + 34} r={14} fill={col} opacity={0.2} />
      <path d={d.kind === 'muere' || d.kind === 'lesion' ? 'M-6,-6 L6,6 M6,-6 L-6,6' : 'M-8,0 H6 M0,-7 L7,0 L0,7'} transform={`translate(${-W / 2 + 34},0)`} stroke={col} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={-W / 2 + 60} dy="0.35em" className={ls.desenlaceTxt}>{d.texto}</text>
    </g>
  );
}

function Nota({ texto, caja, side, op, tx, vista }: { texto: string; caja: Caja; side: string; op: number; tx: number; vista: Caja }) {
  const w0 = Math.min(480, texto.length * 10.4 + 30), h0 = 40;
  const w = w0 * tx, h = h0 * tx;
  let x = caja.x + caja.w / 2 - w / 2, y = caja.y - h - 18;
  if (side === 'bottom') y = caja.y + caja.h + 64;
  if (side === 'right') { x = caja.x + caja.w + 18; y = caja.y + caja.h / 2 - h / 2; }
  if (side === 'left') { x = caja.x - w - 18; y = caja.y + caja.h / 2 - h / 2; }
  x = Math.max(8, vista.x + 8, Math.min(ANCHO - w - 8, vista.x + vista.w - w - 8, x));
  y = Math.max(8, Math.min(ALTO - h - 8, y));
  return (
    <g opacity={op}>
      <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${tx})`}>
        <rect x={-w0 / 2} y={-h0 / 2} width={w0} height={h0} rx={12} className={ls.notaCaja} />
        <text textAnchor="middle" dy="0.35em" className={ls.notaTxt}>{texto}</text>
      </g>
    </g>
  );
}

function Lupa({ pr, e }: { pr: ProcesoSt; e: EscenaSt }) {
  const p = posAbs(e, pr.cerca);
  const { x, y } = posLupa(pr, e);
  const esc = 0.85 + 0.15 * pr.op;
  const bx = Math.max(x, Math.min(x + LUPA_W, p.x)), by = Math.max(y, Math.min(y + LUPA_H, p.y));
  return (
    <g opacity={pr.op}>
      <line x1={p.x} y1={p.y} x2={bx} y2={by} className={ls.hiloLupa} />
      <circle cx={p.x} cy={p.y} r={22} className={ls.anilloLupa} />
      <g transform={`translate(${x + LUPA_W / 2},${y + LUPA_H / 2}) scale(${esc}) translate(${-LUPA_W / 2},${-LUPA_H / 2})`}>
        <rect x={4} y={6} width={LUPA_W} height={LUPA_H} rx={18} className={ls.lupaSombra} />
        <rect width={LUPA_W} height={LUPA_H} rx={18} className={ls.lupaCaja} />
        <Proceso datos={pr.datos} p={pr.p} />
      </g>
    </g>
  );
}

// ─── Escenario ────────────────────────────────────────────────────────────────

export type PropsEscena = {
  escenario: Escenario;
  escena: EscenaSt;
  resaltar?: string[] | null;
  seleccionado?: string | null;
  onActor?: (key: string) => void;
  camaraLibre?: boolean;
  onInteraccion?: () => void;
  vistaReset?: number;
  /** Baja ya el código de las lupas (el laboratorio); la landing lo deja en `false`. */
  precargarProcesos?: boolean;
  children?: ReactNode;
};

export default function Escena({ escenario, escena, resaltar, seleccionado, onActor, camaraLibre = true, onInteraccion, vistaReset = 0, precargarProcesos = true, children }: PropsEscena) {
  useEffect(() => { if (precargarProcesos) void cargarProcesos(); }, [precargarProcesos]);
  const [vista, setVista] = useState({ k: 1, px: 0, py: 0, reset: vistaReset });
  if (vista.reset !== vistaReset) setVista({ k: 1, px: 0, py: 0, reset: vistaReset });
  const svgRef = useRef<SVGSVGElement>(null);
  const gesto = useRef<{ x: number; y: number; px: number; py: number; id: number } | null>(null);

  const cam = escena.camara;
  const tx = escena.tx ?? 1;
  const vw = cam.w / vista.k, vh = cam.h / vista.k;
  const vx = cam.x + (cam.w - vw) / 2 + vista.px, vy = cam.y + (cam.h - vh) / 2 + vista.py;

  const visibles = useMemo(() => escena.orden.filter((k) => escena.actores[k]?.vis || (escena.actores[k]?.op ?? 0) > 0.001), [escena]);
  const cajas = useMemo(() => {
    const m = new Map<string, Caja>();
    for (const k of visibles) m.set(k, cajaActor(escena, k));
    return m;
  }, [escena, visibles]);
  const trazos = useMemo(() => {
    const m = new Map<string, Trazo>();
    for (const cn of escena.conectores) {
      const a = cajas.get(cn.from), b = cajas.get(cn.to);
      if (!a || !b) continue;
      const tr = trazoEntre(a, b, cn.curve, [...cajas.entries()].filter(([k]) => k !== cn.from && k !== cn.to && escena.actores[k]?.forma !== 'anticuerpo').map(([, v]) => v));
      if (tr) m.set(cn.id, tr);
    }
    return m;
  }, [escena.conectores, escena.actores, cajas]);

  const bajadas = useMemo(() => {
    const m = new Map<string, number>();
    if (tx <= 1) return m;
    const puestos: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const lista = visibles
      .map((k) => ({ k, a: escena.actores[k], p: posAbs(escena, k) }))
      .filter(({ a }) => a.op >= 0.3 && a.forma !== 'proteina' && a.forma !== 'anticuerpo' && a.forma !== 'ancla' && a.label)
      .sort((u, w) => u.p.x - w.p.x);
    for (const { k, a, p } of lista) {
      const mitad = (Math.max(a.label.length * 10.6, (a.sub?.length ?? 0) * 7.6) * tx) / 2;
      const alto = (a.sub ? 44 : 26) * tx;
      const y = p.y + (a.d * a.esc) / 2 + (a.forma === 'molecula' ? 18 : 26) * tx - 20 * tx;
      let dy = 0;
      for (let i = 0; i < 3; i++) {
        const choca = puestos.some((q) => p.x - mitad < q.x1 && p.x + mitad > q.x0 && y + dy < q.y1 && y + dy + alto > q.y0);
        if (!choca) break;
        dy += alto;
      }
      puestos.push({ x0: p.x - mitad, x1: p.x + mitad, y0: y + dy, y1: y + dy + alto });
      if (dy) m.set(k, dy);
    }
    return m;
  }, [escena, visibles, tx]);
  const vistaCaja: Caja = { x: vx, y: vy, w: vw, h: vh };

  const foco = resaltar ?? escena.foco?.actors ?? null;
  const kFoco = resaltar ? 1 : escena.foco?.k ?? 0;
  const atenuarDe = (key: string) => (foco && !foco.includes(key) ? 1 - 0.6 * kFoco : 1);

  const onWheel = (ev: React.WheelEvent) => {
    if (!camaraLibre) return;
    onInteraccion?.();
    const f = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
    setVista((v) => ({ ...v, k: Math.min(4, Math.max(1, v.k * f)), ...(v.k * f <= 1 ? { px: 0, py: 0 } : {}) }));
  };
  const dedos = useRef(new Map<number, { x: number; y: number }>());
  const pellizco = useRef<{ dist: number; k: number } | null>(null);
  const distDedos = () => { const [p, q] = [...dedos.current.values()]; return Math.hypot(p.x - q.x, p.y - q.y); };
  const onDown = (ev: React.PointerEvent) => {
    if (!camaraLibre) return;
    dedos.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (dedos.current.size === 2) { gesto.current = null; pellizco.current = { dist: distDedos(), k: vista.k }; return; }
    if (vista.k > 1) gesto.current = { x: ev.clientX, y: ev.clientY, px: vista.px, py: vista.py, id: ev.pointerId };
  };
  const onMove = (ev: React.PointerEvent) => {
    if (dedos.current.has(ev.pointerId)) dedos.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const pz = pellizco.current;
    if (pz && dedos.current.size === 2) {
      const k = Math.min(4, Math.max(1, pz.k * (distDedos() / Math.max(1, pz.dist))));
      onInteraccion?.();
      setVista((v) => ({ ...v, k, ...(k <= 1 ? { px: 0, py: 0 } : {}) }));
      return;
    }
    const gst = gesto.current;
    if (!gst || gst.id !== ev.pointerId) return;
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const k = Math.max(vw / r.width, vh / r.height);
    onInteraccion?.();
    setVista((v) => ({ ...v, px: gst.px - (ev.clientX - gst.x) * k, py: gst.py - (ev.clientY - gst.y) * k }));
  };
  const onUp = (ev: React.PointerEvent) => {
    dedos.current.delete(ev.pointerId);
    if (dedos.current.size < 2) pellizco.current = null;
    if (gesto.current?.id === ev.pointerId) gesto.current = null;
  };

  return (
    <svg
      ref={svgRef}
      className={`${c.escena} ${ls.escena}`}
      viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="group"
      aria-label={escenario.nombre}
      style={{ ...(tx !== 1 ? { '--tx': tx } : {}), touchAction: vista.k > 1 ? 'none' : 'pan-y' } as React.CSSProperties}
    >
      <defs>
        <DefsCelulas />
        <DefsPropias />
        <radialGradient id="brilloProt" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="60%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        {visibles.map((k) => (
          <radialGradient key={k} id={`halo-${k}`}>
            <stop offset="0%" stopColor={escena.actores[k].color} stopOpacity={0.45} />
            <stop offset="60%" stopColor={escena.actores[k].color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={escena.actores[k].color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>

      <rect x={-800} y={-800} width={ANCHO + 1600} height={ALTO + 1600} className={ls.blanco} />
      {escena.fondoPrev && <g opacity={1 - escena.fondoMezcla}><FondoDe f={escena.fondoPrev} t={escena.tejido} reloj={escena.reloj} /></g>}
      <g opacity={escena.fondoPrev ? escena.fondoMezcla : 1}><FondoDe f={escena.fondo} t={escena.tejido} reloj={escena.reloj} /></g>
      {escena.fondo === escenario.fondo && escenario.zonas?.map((z) => <text key={z.texto} x={g(z.pos.col)} y={g(z.pos.row)} className={ls.zona}>{z.texto}</text>)}

      <g>{escena.conectores.filter((cn) => cn.type === 'migra' || cn.type === 'secreta').map((cn) => { const tr = trazos.get(cn.id); return tr ? <g key={cn.id} opacity={Math.min(atenuarDe(cn.from), atenuarDe(cn.to))}><Conector cn={cn} tr={tr} tx={tx} /></g> : null; })}</g>

      <g>
        {visibles.map((k) => (
          <Actor key={k} a={escena.actores[k]} pos={posAbs(escena, k)} rot={rotAbs(escena, k)} atenuar={atenuarDe(k)} seleccionado={seleccionado === k} interactivo={!!onActor} onClick={onActor} />
        ))}
      </g>

      <g pointerEvents="none">{escena.conectores.filter((cn) => cn.type !== 'migra' && cn.type !== 'secreta').map((cn) => { const tr = trazos.get(cn.id); return tr ? <g key={cn.id} opacity={Math.min(atenuarDe(cn.from), atenuarDe(cn.to))}><Conector cn={cn} tr={tr} tx={tx} /></g> : null; })}</g>
      <g pointerEvents="none">{escena.efectos.map((e, i) => <Efecto key={i} e={e} trazos={trazos} />)}</g>

      <g pointerEvents="none">
        {visibles.map((k) => <Rotulos key={k} a={escena.actores[k]} pos={posAbs(escena, k)} tx={tx} bajar={bajadas.get(k)} />)}
        {escena.desenlaces.map((d) => <Desenlace key={d.id} d={d} tx={tx} vista={vistaCaja} />)}
        {escena.notas.map((n) => { const caja = cajas.get(n.near); return caja ? <Nota key={n.id} texto={n.text} caja={caja} side={n.side} op={n.op} tx={tx} vista={vistaCaja} /> : null; })}
      </g>

      <g pointerEvents="none">{escena.procesos.map((pr) => <Lupa key={pr.id} pr={pr} e={escena} />)}</g>

      {children}
    </svg>
  );
}

