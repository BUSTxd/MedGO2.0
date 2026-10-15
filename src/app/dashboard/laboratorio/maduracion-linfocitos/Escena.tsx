'use client';
// Escenario SVG del laboratorio «Maduración de linfocitos». Pinta una
// `Escena` ya evaluada por el motor, sobre FONDO BLANCO: el órgano de cada
// parte va en trazo fino (hueso y sinusoide, corteza y médula tímicas,
// folículo con zonas oscura y clara), las células son ilustraciones de
// Servier recortadas o dibujos hechos con código, y los procesos moleculares
// se abren en una «lupa» junto a la célula.

import { memo, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Dibujo, Escenario, Fondo, TipoMarcador } from '@/lib/data/linfocitos/tipos';
import { L } from '@/lib/data/linfocitos/colores';
import { IMAGENES, srcImagen } from '@/lib/data/linfocitos/imagenes';
import { ALTO, ANCHO, CELDA, LUPA_H, LUPA_W, cajaActor, posAbs, posLupa, type ActorSt, type Caja, type ConectorSt, type DesenlaceSt, type EfectoSt, type Escena as EscenaSt, type MarcadorSt, type ProcesoSt } from '@/lib/linfocitos/motor';
import { trazoEntre, type Punto, type Trazo } from '@/lib/ciclo-celular/geometria';
import Proceso from './Procesos';
import { DefsCelulas, DibujoCelula } from './Celulas';
import { FondoDe } from './Fondos';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const g = (v: number) => v * CELDA;

function mezclar(hex: string, con: string, k: number): string {
  const a = parseInt(hex.slice(1), 16), b = parseInt(con.slice(1), 16);
  const ch = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `#${((ch((a >> 16) & 255, (b >> 16) & 255) << 16) | (ch((a >> 8) & 255, (b >> 8) & 255) << 8) | ch(a & 255, b & 255)).toString(16).padStart(6, '0')}`;
}
const claro = (h: string, k: number) => mezclar(h, '#ffffff', k);
const oscuro = (h: string, k: number) => mezclar(h, '#141826', k);

// ─── Células dibujadas con código ─────────────────────────────────────────────

/** Linfocito genérico (si falta la ilustración). */
function LinfocitoCodigo({ d, color }: { d: number; color: string }) {
  return (
    <g>
      <circle r={d / 2} fill={claro(color, 0.82)} stroke={oscuro(color, 0.2)} strokeWidth={2.5} />
      <circle r={d * 0.38} cx={-d * 0.03} cy={d * 0.02} fill={claro(color, 0.35)} />
      <circle r={d * 0.08} cx={-d * 0.18} cy={-d * 0.2} fill="#fff" opacity={0.6} />
    </g>
  );
}

// ─── Marcadores de membrana ───────────────────────────────────────────────────

const COLOR_MARCADOR: Record<TipoMarcador, string> = {
  bcr: L.bcr, igd: '#6E9BEA', prebcr: L.prebcr, tcr: L.tcr, pretcr: L.pretcr, cd: L.cd, mhc1: L.mhc1, mhc2: L.mhc2, receptor: '#5B6475',
};

function GlifoMarcador({ m }: { m: MarcadorSt }) {
  const col = m.color ?? COLOR_MARCADOR[m.tipo];
  switch (m.tipo) {
    case 'bcr':
    case 'igd':
      return <path d={`M0,0 L0,-${m.tipo === 'igd' ? 18 : 14} M0,-${m.tipo === 'igd' ? 18 : 14} L-9,-30 M0,-${m.tipo === 'igd' ? 18 : 14} L9,-30`} stroke={col} strokeWidth={5} strokeLinecap="round" fill="none" />;
    case 'prebcr':
      return <g><path d="M0,0 L0,-14 M0,-14 L-9,-30 M0,-14 L6,-22" stroke={col} strokeWidth={5} strokeLinecap="round" fill="none" /><circle cx={8} cy={-25} r={3.5} fill="none" stroke={col} strokeWidth={2} /></g>;
    case 'tcr':
      return <g><rect x={-8} y={-28} width={7} height={28} rx={3} fill={col} /><rect x={1} y={-28} width={7} height={28} rx={3} fill={oscuro(col, 0.2)} /></g>;
    case 'pretcr':
      return <g><rect x={-8} y={-28} width={7} height={28} rx={3} fill={col} /><rect x={1} y={-16} width={7} height={16} rx={3} fill={claro(col, 0.3)} /></g>;
    case 'cd':
      return <g><line x1={0} y1={0} x2={0} y2={-18} stroke={col} strokeWidth={3} /><circle cy={-22} r={6} fill={col} /></g>;
    case 'mhc1':
    case 'mhc2':
      return <path d="M-9,-26 L-9,-6 Q0,4 9,-6 L9,-26" stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case 'receptor':
      return <g><rect x={-7} y={-24} width={14} height={24} rx={5} fill={col} /><rect x={-11} y={-30} width={22} height={8} rx={4} fill={claro(col, 0.25)} /></g>;
  }
}

function Marcadores({ a, d }: { a: ActorSt; d: number }) {
  const r = d / 2;
  return (
    <g>
      {a.marcadores.map((m) => {
        const ang = (m.ang * Math.PI) / 180;
        const x = Math.cos(ang) * r * 0.96, y = Math.sin(ang) * r * 0.96;
        const k = Math.max(0, Math.min(1.2, m.op));
        return (
          <g key={m.id} opacity={Math.min(1, m.op)}>
            <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${m.ang + 90}) scale(${k.toFixed(3)})`}><GlifoMarcador m={m} /></g>
            {m.label && (
              <text x={Math.cos(ang) * (r + 46)} y={Math.sin(ang) * (r + 46)} textAnchor="middle" dy="0.35em" className={s.marcadorTxt} style={{ fill: m.color ?? COLOR_MARCADOR[m.tipo] }}>{m.label}</text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ─── Actor ────────────────────────────────────────────────────────────────────

function Cuerpo({ a, img, dibujo }: { a: ActorSt; img?: string; dibujo?: Dibujo }) {
  const d = a.d;
  if (a.forma === 'proteina') {
    return (
      <g>
        <circle r={d / 2} fill={a.color} />
        <circle r={d / 2} fill="url(#brilloProt)" />
        <text textAnchor="middle" dy="0.35em" className={s.protTxt} style={{ fontSize: Math.min(17, (d - 8) / (a.label.length * 0.55)) }}>{a.label}</text>
      </g>
    );
  }
  if (a.forma === 'molecula') {
    const src = img ? srcImagen(img) : null;
    if (src) { const m = IMAGENES[img!]; const k = d / Math.max(m.w, m.h); return <image href={src} x={(-m.w * k) / 2} y={(-m.h * k) / 2} width={m.w * k} height={m.h * k} />; }
    return (
      <g>
        {[[-0.35, 0.2], [0.35, 0.2], [0, -0.3]].map(([x, y], i) => <circle key={i} cx={x * d * 0.6} cy={y * d * 0.6} r={d * 0.28} fill={a.color} stroke={oscuro(a.color, 0.3)} strokeWidth={1.2} />)}
      </g>
    );
  }
  if (dibujo) return <DibujoCelula dibujo={dibujo} d={d} />;
  const src = img ? srcImagen(img) : null;
  if (src) {
    const m = IMAGENES[img!];
    const k = d / Math.max(m.w, m.h);
    // Los linfocitos de Servier son todos azules: los del linaje T giran al
    // verde (su color en el laboratorio) para distinguirlos de los B.
    const tinte = a.color === L.t && img!.startsWith('linfocito') ? 'hue-rotate(-62deg) saturate(0.85)' : undefined;
    return <image href={src} x={(-m.w * k) / 2} y={(-m.h * k) / 2} width={m.w * k} height={m.h * k} preserveAspectRatio="xMidYMid meet" style={tinte ? { filter: tinte } : undefined} />;
  }
  return <LinfocitoCodigo d={d} color={a.color} />;
}

const Actor = memo(function Actor({ a, pos, atenuar, seleccionado, interactivo, onClick }: { a: ActorSt; pos: Punto; atenuar: number; seleccionado: boolean; interactivo: boolean; onClick?: (k: string) => void }) {
  const d = a.d;
  const filtro = a.gris > 0.01 ? `grayscale(${a.gris.toFixed(2)}) brightness(${(1 + 0.1 * a.gris).toFixed(2)})` : undefined;
  const esCelula = a.forma === 'celula' || a.forma === 'dibujo';
  const sep = a.surco * d * 0.2;
  return (
    <g
      transform={`translate(${(pos.x + a.ex).toFixed(1)},${(pos.y + a.ey).toFixed(1)})`}
      opacity={a.op * atenuar}
      className={interactivo ? c.actorInteractivo : c.actor}
      role={interactivo ? 'button' : 'img'}
      tabIndex={interactivo ? 0 : undefined}
      aria-label={a.label}
      onClick={interactivo && onClick ? () => onClick(a.key) : undefined}
      onKeyDown={interactivo && onClick ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(a.key); } } : undefined}
    >
      <g transform={`rotate(${a.rot.toFixed(2)}) scale(${a.esc.toFixed(3)})`}>
        {(a.halo > 0.01 || seleccionado) && <circle r={d * 0.72} fill={`url(#halo-${a.key})`} opacity={seleccionado ? 1 : a.halo} />}
        {seleccionado && <circle r={d * 0.64} fill="none" stroke="var(--dapi)" strokeWidth={3} strokeDasharray="6 7" />}
        <g style={filtro ? { filter: filtro } : undefined}>
          {a.surco > 0.01 ? (
            // Mitosis: dos mitades que se separan con un surco.
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
        </g>
        {a.apoptosis > 0.01 && (
          <g>
            {Array.from({ length: 8 }, (_, i) => {
              const ang = (i / 8) * Math.PI * 2 + 0.4;
              const k = Math.min(1, a.apoptosis * 1.6 - i * 0.06);
              return k > 0 ? <circle key={i} cx={Math.cos(ang) * d * 0.5} cy={Math.sin(ang) * d * 0.5} r={d * 0.09 * k} className={s.burbuja} /> : null;
            })}
            {[[-0.12, -0.08], [0.1, 0.06], [-0.02, 0.15], [0.14, -0.12]].map(([x, y], i) => <circle key={`n${i}`} cx={x * d} cy={y * d} r={d * 0.045 * a.apoptosis} fill="#3B2F4A" opacity={a.apoptosis} />)}
          </g>
        )}
      </g>
    </g>
  );
});

function Rotulos({ a, pos, tx, bajar = 0 }: { a: ActorSt; pos: Punto; tx: number; bajar?: number }) {
  if (a.op < 0.3 || (a.forma === 'proteina') || !a.label) return null;
  const d = a.d * a.esc;
  const y0 = pos.y + d / 2 + (a.forma === 'molecula' ? 18 : 26) * tx + bajar;
  // Todo el bloque escala desde el pie de la célula (en el teléfono, tx > 1).
  return (
    <g opacity={Math.min(1, a.op)} transform={`translate(${pos.x},${y0}) scale(${tx})`}>
      <text textAnchor="middle" className={a.forma === 'molecula' ? s.rotuloMol : s.rotuloCelula}>{a.label}</text>
      {a.sub && <text y={19} textAnchor="middle" className={s.subCelula}>{a.sub}</text>}
      {a.marcas.map((m, i) => (
        <g key={m.texto} opacity={m.op} transform={`translate(0,${(a.sub ? 46 : 28) + i * 42})`}>
          <text textAnchor="middle" className={s.marcaTxt}>{m.texto}</text>
          {m.sub && <text y={17} textAnchor="middle" className={s.marcaSub}>{m.sub}</text>}
        </g>
      ))}
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
          <rect x={-(cn.label.length * 4.8 + 10)} y={-12} width={cn.label.length * 9.6 + 20} height={24} rx={8} className={s.etiquetaFondo} />
          <text textAnchor="middle" dy="0.35em" className={s.etiquetaConector}>{cn.label}</text>
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
            return <circle key={i} cx={e.x + Math.cos(a) * (e.r + 50 * e.p)} cy={e.y + Math.sin(a) * (e.r + 50 * e.p)} r={6} className={s.burbuja} />;
          })}
        </g>
      );
    case 'punto': {
      const tr = e.via ? trazos.get(e.via) : undefined;
      const q = tr ? tr.en(Math.min(1, Math.max(0, e.f))) : { x: e.x1 + (e.x2 - e.x1) * e.f, y: e.y1 + (e.y2 - e.y1) * e.f };
      return <g><circle cx={q.x} cy={q.y} r={16} fill={e.color} opacity={0.25} /><circle cx={q.x} cy={q.y} r={7} fill={e.color} /></g>;
    }
  }
}

const DESENLACE: Record<DesenlaceSt['kind'], { color: string }> = {
  sobrevive: { color: '#1F9A6A' }, muere: { color: '#8A93A6' }, sale: { color: '#2F6FD0' }, neoplasia: { color: '#E5484D' },
};

function Desenlace({ d, tx, vista }: { d: DesenlaceSt; tx: number; vista: Caja }) {
  const col = DESENLACE[d.kind].color;
  const W = Math.max(280, d.texto.length * 11 + 80), H = 64;
  // Dentro de lo que se ve: en el teléfono la cámara es estrecha.
  const m = (W * tx) / 2 + 8;
  const x = vista.w > 2 * m ? Math.max(vista.x + m, Math.min(vista.x + vista.w - m, d.x)) : d.x;
  return (
    <g transform={`translate(${x},${d.y}) scale(${(0.9 + 0.1 * d.op) * tx})`} opacity={d.op}>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={16} className={s.desenlaceCaja} stroke={col} />
      <circle cx={-W / 2 + 34} r={14} fill={col} opacity={0.2} />
      <path d={d.kind === 'muere' ? 'M-6,-6 L6,6 M6,-6 L-6,6' : 'M-8,0 H6 M0,-7 L7,0 L0,7'} transform={`translate(${-W / 2 + 34},0)`} stroke={col} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={-W / 2 + 60} dy="0.35em" className={s.desenlaceTxt}>{d.texto}</text>
    </g>
  );
}

function Nota({ texto, caja, side, op, tx, vista }: { texto: string; caja: Caja; side: string; op: number; tx: number; vista: Caja }) {
  const w0 = Math.min(460, texto.length * 10.4 + 30), h0 = 40;
  const w = w0 * tx, h = h0 * tx;
  let x = caja.x + caja.w / 2 - w / 2, y = caja.y - h - 18;
  if (side === 'bottom') y = caja.y + caja.h + 64;
  if (side === 'right') { x = caja.x + caja.w + 18; y = caja.y + caja.h / 2 - h / 2; }
  if (side === 'left') { x = caja.x - w - 18; y = caja.y + caja.h / 2 - h / 2; }
  // Dentro del lienzo y de lo que se ve (en el teléfono la cámara es estrecha).
  x = Math.max(8, vista.x + 8, Math.min(ANCHO - w - 8, vista.x + vista.w - w - 8, x));
  y = Math.max(8, Math.min(ALTO - h - 8, y));
  return (
    <g opacity={op}>
      <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${tx})`}>
        <rect x={-w0 / 2} y={-h0 / 2} width={w0} height={h0} rx={12} className={s.notaCaja} />
        <text textAnchor="middle" dy="0.35em" className={s.notaTxt}>{texto}</text>
      </g>
    </g>
  );
}

// ─── Lupa ─────────────────────────────────────────────────────────────────────

function Lupa({ pr, e }: { pr: ProcesoSt; e: EscenaSt }) {
  const p = posAbs(e, pr.cerca);
  const { x, y } = posLupa(pr, e);
  const esc = 0.85 + 0.15 * pr.op;
  // Hilo desde el núcleo de la célula al borde más cercano de la lupa.
  const bx = Math.max(x, Math.min(x + LUPA_W, p.x)), by = Math.max(y, Math.min(y + LUPA_H, p.y));
  return (
    <g opacity={pr.op}>
      <line x1={p.x} y1={p.y} x2={bx} y2={by} className={s.hiloLupa} />
      <circle cx={p.x} cy={p.y} r={22} className={s.anilloLupa} />
      <g transform={`translate(${x + LUPA_W / 2},${y + LUPA_H / 2}) scale(${esc}) translate(${-LUPA_W / 2},${-LUPA_H / 2})`}>
        <rect x={4} y={6} width={LUPA_W} height={LUPA_H} rx={18} className={s.lupaSombra} />
        <rect width={LUPA_W} height={LUPA_H} rx={18} className={s.lupaCaja} />
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
  children?: ReactNode;
};

export default function Escena({ escenario, escena, resaltar, seleccionado, onActor, camaraLibre = true, onInteraccion, vistaReset = 0, children }: PropsEscena) {
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
    for (const k of visibles) {
      const c = cajaActor(escena, k);
      // El hueso es largo y delgado: su caja de d × d dejaba las flechas
      // flotando antes de llegar. Para trazarlas se usa su grosor real.
      if (escena.actores[k].dibujo === 'hueso') { const r = c.w * 0.14; m.set(k, { x: c.x + c.w / 2 - r, y: c.y + c.h / 2 - r, w: r * 2, h: r * 2 }); }
      else m.set(k, c);
    }
    return m;
  }, [escena, visibles]);
  const trazos = useMemo(() => {
    const m = new Map<string, Trazo>();
    for (const cn of escena.conectores) {
      const a = cajas.get(cn.from), b = cajas.get(cn.to);
      if (!a || !b) continue;
      const tr = trazoEntre(a, b, cn.curve, [...cajas.entries()].filter(([k]) => k !== cn.from && k !== cn.to).map(([, v]) => v));
      if (tr) m.set(cn.id, tr);
    }
    return m;
  }, [escena.conectores, cajas]);

  // Teléfono: los nombres crecen (tx) y dos células vecinas pueden pisarse los
  // rótulos; el de la derecha baja una línea (o dos) hasta quedar libre.
  const bajadas = useMemo(() => {
    const m = new Map<string, number>();
    if (tx <= 1) return m;
    const puestos: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const lista = visibles
      .map((k) => ({ k, a: escena.actores[k], p: posAbs(escena, k) }))
      .filter(({ a }) => a.op >= 0.3 && a.forma !== 'proteina' && a.label)
      .sort((u, v) => u.p.x - v.p.x);
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
  // Táctil: dos dedos pellizcan (zoom), uno arrastra si ya hay zoom.
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
      className={`${c.escena} ${s.escena}`}
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

      <rect x={-800} y={-800} width={ANCHO + 1600} height={ALTO + 1600} className={s.blanco} />
      <FondoDe f={escenario.fondo} />
      {escenario.zonas?.map((z) => <text key={z.texto} x={g(z.pos.col)} y={g(z.pos.row)} className={s.zona}>{z.texto}</text>)}

      <g>{escena.conectores.filter((cn) => cn.type === 'migra' || cn.type === 'secreta').map((cn) => { const tr = trazos.get(cn.id); return tr ? <g key={cn.id} opacity={Math.min(atenuarDe(cn.from), atenuarDe(cn.to))}><Conector cn={cn} tr={tr} tx={tx} /></g> : null; })}</g>

      <g>
        {visibles.map((k) => (
          <Actor key={k} a={escena.actores[k]} pos={posAbs(escena, k)} atenuar={atenuarDe(k)} seleccionado={seleccionado === k} interactivo={!!onActor} onClick={onActor} />
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
