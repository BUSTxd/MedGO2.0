'use client';
// Escenario SVG de la vía: pinta una `Escena` (ya evaluada por el motor) en
// capas. No anima nada por sí mismo: quien quiera movimiento le pasa una
// escena nueva en cada fotograma. Por eso los actores son `<g>` dentro del
// mismo `<svg>` que las flechas: comparten sistema de coordenadas.

import { memo, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import type { Escenario } from '@/lib/data/ciclo-celular/tipos';
import { FAMILIAS, imagen, sitio, type Familia } from '@/lib/data/ciclo-celular/familias';
import { ALTO, ANCHO, cajaActor, medidas, posAbs, type ActorSt, type Caja, type ConectorSt, type DesenlaceSt, type EfectoSt, type Escena as EscenaSt } from '@/lib/ciclo-celular/motor';
import { ondaEntre, trazoEntre, type Punto, type Trazo } from '@/lib/ciclo-celular/geometria';
import { etiquetaTexto } from './texto';
import s from '@/styles/cicloCelular.module.css';

// ─── Rótulos con <sup>/<sub> ─────────────────────────────────────────────────

export function TextoSvg({ texto }: { texto: string }) {
  const partes = texto.split(/(<sup>.*?<\/sup>|<sub>.*?<\/sub>)/g).filter(Boolean);
  return (
    <>
      {partes.map((p, i) => {
        const sup = p.match(/^<sup>(.*)<\/sup>$/);
        const sub = p.match(/^<sub>(.*)<\/sub>$/);
        if (sup) return <tspan key={i} baselineShift="super" fontSize="70%">{sup[1]}</tspan>;
        if (sub) return <tspan key={i} baselineShift="sub" fontSize="70%">{sub[1]}</tspan>;
        return <tspan key={i}>{p}</tspan>;
      })}
    </>
  );
}

// ─── Conectores ───────────────────────────────────────────────────────────────

const COLOR_CONECTOR: Record<string, string> = {
  activa: 'var(--fitc)', inhibe: 'var(--rodamina)', fosforila: 'var(--fosfato)', desfosforila: 'var(--cian)',
  transcribe: '#B48CE0', degrada: '#8A97AB', dano: 'var(--cy3)', transloca: 'var(--texto-2)', secuestra: 'var(--texto-2)',
};
const ATRAS = new Set(['transcribe', 'degrada', 'transloca', 'secuestra']);

/** Sub-curva de la cuadrática hasta t (de Casteljau). */
function parcial(tr: Trazo, t: number): string {
  if (t >= 0.999) return tr.d;
  const p0 = tr.ini, c = tr.ctrl;
  const q = { x: p0.x + (c.x - p0.x) * t, y: p0.y + (c.y - p0.y) * t };
  const e = tr.en(t);
  return `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q${q.x.toFixed(1)},${q.y.toFixed(1)} ${e.x.toFixed(1)},${e.y.toFixed(1)}`;
}

function Punta({ tipo, en, ang, k, color }: { tipo: string; en: Punto; ang: number; k: number; color: string }) {
  if (k <= 0) return null;
  const esc = k < 1 ? 1 + 0.15 * Math.sin(Math.PI * k) : 1;
  const t = `translate(${en.x},${en.y}) rotate(${(ang * 180) / Math.PI}) scale(${esc * Math.min(1, k * 1.4)})`;
  switch (tipo) {
    case 'inhibe':
      return <line transform={t} x1={0} y1={-11} x2={0} y2={11} stroke={color} strokeWidth={5} strokeLinecap="round" />;
    case 'transcribe':
    case 'degrada':
      return <path transform={t} d="M-16,-9 L0,0 L-16,9" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
    case 'transloca':
      return <path transform={t} d="M-14,-8 L0,0 L-14,8 M-24,-8 L-10,0 L-24,8" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />;
    case 'secuestra':
      return null;
    default:
      return <path transform={t} d="M2,0 L-17,-9.5 L-13,0 L-17,9.5 Z" fill={color} />;
  }
}

function Conector({ c, tr, onda }: { c: ConectorSt; tr: Trazo; onda: boolean }) {
  const color = c.type === 'retroalimentacion' ? (c.sign === '−' ? 'var(--rodamina)' : 'var(--fitc)') : COLOR_CONECTOR[c.type];
  const ancho = c.type === 'activa' || c.type === 'inhibe' || c.type === 'dano' ? 4 : c.type === 'transloca' || c.type === 'secuestra' ? 2 : 3;
  const dash = c.type === 'fosforila' || c.type === 'desfosforila' ? '8 6' : c.type === 'degrada' ? '2 6' : c.type === 'secuestra' ? '4 5' : undefined;
  const d = onda ? ondaEntre(tr.ini, tr.en(Math.max(0.02, c.prog)), 9, 30) : parcial(tr, c.prog);
  const kPunta = (c.prog - 0.8) / 0.2;
  const marca = c.type === 'fosforila' ? 'P' : c.type === 'desfosforila' ? '−P' : c.type === 'retroalimentacion' ? c.sign ?? '+' : null;
  return (
    <g opacity={c.op} className={s.conector} data-tipo={c.type}>
      <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeDasharray={dash} strokeLinecap="round" />
      <Punta tipo={c.type} en={tr.fin} ang={tr.angFin} k={Math.min(1, kPunta)} color={color} />
      {marca && c.prog > 0.5 && (
        <g transform={`translate(${tr.medio.x},${tr.medio.y})`}>
          <circle r={13} fill="var(--campo-2)" stroke={color} strokeWidth={2} />
          <text className={s.marcaConector} textAnchor="middle" dy="0.35em" fill={color}>{marca}</text>
        </g>
      )}
      {c.label && c.prog > 0.6 && (
        <g transform={`translate(${tr.medio.x},${tr.medio.y + (marca ? 28 : 0)})`}>
          <rect x={-(c.label.length * 5.6 + 10)} y={-13} width={c.label.length * 11.2 + 20} height={26} rx={8} fill="var(--campo-2)" opacity={0.92} />
          <text className={s.etiquetaConector} textAnchor="middle" dy="0.35em">{c.label}</text>
        </g>
      )}
    </g>
  );
}

// ─── Actores ──────────────────────────────────────────────────────────────────

function ImagenActor({ id, op, gris, espejo }: { id: string; op: number; gris: number; espejo: boolean }) {
  const img = imagen(id);
  if (op <= 0.001) return null;
  const filtro = gris > 0.01 ? `grayscale(${gris.toFixed(2)}) brightness(${(1 - 0.3 * gris).toFixed(2)})` : undefined;
  if (!img.src) {
    return (
      <g opacity={op}>
        <ellipse rx={img.w / 2} ry={img.h / 2} fill={img.color} fillOpacity={0.35} stroke={img.color} strokeWidth={2.5} strokeDasharray="7 6" />
        <text className={s.placeholderTxt} textAnchor="middle" dy="0.35em">{id}</text>
      </g>
    );
  }
  return (
    <image
      href={img.src}
      x={-img.w / 2} y={-img.h / 2} width={img.w} height={img.h}
      opacity={op}
      style={filtro ? { filter: filtro } : undefined}
      transform={espejo ? 'scale(-1,1)' : undefined}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

/** Tira: la imagen base repetida a lo ancho; una imagen distinta (rotura,
 *  horquilla, gen activo) va en el centro y la tira se abre para dejarle sitio. */
function Tira({ a, ancho }: { a: ActorSt; ancho: number }) {
  const k = a.escalaDecl;
  const base = imagen(a.imgBase);
  const bw = base.w * k, bh = base.h * k;
  const piezas = [
    ...(a.imgPrev && a.imgPrev !== a.imgBase ? [{ id: a.imgPrev, op: 1 - a.mezcla }] : []),
    ...(a.img !== a.imgBase ? [{ id: a.img, op: a.imgPrev ? a.mezcla : 1 }] : []),
  ];
  const hueco = piezas.reduce((m, p) => Math.max(m, imagen(p.id).w * k * 0.92 * p.op), 0);
  const filtro = a.gris > 0.01 ? `grayscale(${a.gris.toFixed(2)}) brightness(${(1 - 0.3 * a.gris).toFixed(2)})` : undefined;
  const id = `tira-${a.key}`;
  if (!base.src) return <rect x={-ancho / 2} y={-bh / 2} width={ancho} height={bh} rx={bh / 2} fill={base.color} fillOpacity={0.35} />;
  const lado = (ancho - hueco) / 2;
  return (
    <g style={filtro ? { filter: filtro } : undefined}>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" x={-ancho / 2} y={-bh / 2} width={bw * 0.94} height={bh}>
          <image href={base.src} x={-bw * 0.03} width={bw} height={bh} preserveAspectRatio="none" />
        </pattern>
      </defs>
      {lado > 1 && <rect x={-ancho / 2} y={-bh / 2} width={lado} height={bh} fill={`url(#${id})`} />}
      {lado > 1 && <rect x={hueco / 2} y={-bh / 2} width={lado} height={bh} fill={`url(#${id})`} />}
      {piezas.map((p) => {
        const im = imagen(p.id);
        return im.src ? <image key={p.id} href={im.src} x={(-im.w * k) / 2} y={(-im.h * k) / 2} width={im.w * k} height={im.h * k} opacity={p.op} preserveAspectRatio="xMidYMid meet" /> : null;
      })}
    </g>
  );
}

type PropsActor = {
  a: ActorSt;
  pos: Punto;
  label: string;
  espejo: boolean;
  atenuar: number;
  seleccionado: boolean;
  escala: number;
  interactivo: boolean;
  onClick?: (key: string) => void;
};

const Actor = memo(function Actor({ a, pos, label, espejo, atenuar, seleccionado, escala, interactivo, onClick }: PropsActor) {
  const img = imagen(a.img);
  const { w, h } = medidas(a);
  const k = a.esc * a.envuelto * escala;
  // Una tira (ADN largo) no lleva halo del ancho entero: se mide por su alto.
  const lado = a.tira ? h * 1.3 : Math.max(w, h);
  const estadoTxt = [a.estado === 'inhibido' ? 'inhibida' : a.estado === 'activo' ? 'activa' : null,
    a.fosfatos.length ? `fosforilada${a.fosfatos.some((f) => f.label) ? ` (${a.fosfatos.map((f) => f.label).filter(Boolean).join(', ')})` : ''}` : null,
    a.ubi >= 1 ? 'ubiquitinada' : null].filter(Boolean).join(', ');
  const ubiN = Math.min(4, a.ubi);
  return (
    <g
      transform={`translate(${(pos.x + a.ex).toFixed(1)},${(pos.y + a.ey).toFixed(1)})`}
      opacity={a.op * atenuar}
      className={interactivo ? s.actorInteractivo : s.actor}
      role={interactivo ? 'button' : 'img'}
      tabIndex={interactivo ? 0 : undefined}
      aria-label={`${etiquetaTexto(label)}${estadoTxt ? `, ${estadoTxt}` : ''}`}
      onClick={interactivo && onClick ? () => onClick(a.key) : undefined}
      onKeyDown={interactivo && onClick ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(a.key); } } : undefined}
    >
      <g transform={`rotate(${a.rot.toFixed(2)}) scale(${k.toFixed(3)})`}>
        {(a.halo > 0.01 || seleccionado) && (
          <circle r={lado * 0.6} fill={`url(#halo-${img.familia})`} opacity={seleccionado ? 1 : a.halo} />
        )}
        {seleccionado && <circle r={lado * 0.58} fill="none" stroke="var(--dapi)" strokeWidth={3} strokeDasharray="6 7" />}
        {a.tira ? (
          <Tira a={a} ancho={w} />
        ) : (
          <g transform={a.escalaDecl !== 1 ? `scale(${a.escalaDecl})` : undefined}>
            {a.imgPrev && <ImagenActor id={a.imgPrev} op={1 - a.mezcla} gris={a.gris} espejo={espejo} />}
            <ImagenActor id={a.img} op={a.imgPrev ? a.mezcla : 1} gris={a.gris} espejo={espejo} />
          </g>
        )}
        {a.fosfatos.map((f) => {
          const sp = sitio(imagen(a.img), f.site);
          const x = (espejo ? 1 - sp[0] : sp[0]) * w - w / 2 + f.dx;
          const y = sp[1] * h - h / 2 + f.dy;
          const ap = f.op < 1 ? 1 + 0.3 * Math.sin(Math.PI * f.op) : 1;
          return (
            <g key={f.site} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(ap / k).toFixed(3)})`} opacity={f.op}>
              <circle r={15} className={s.fosfato} />
              <text className={s.fosfatoTxt} textAnchor="middle" dy="0.36em">P</text>
              {f.label && <text className={s.residuo} textAnchor="middle" y={31}>{f.label}</text>}
            </g>
          );
        })}
        {ubiN > 0 && (
          <g transform={`translate(${(w * 0.32).toFixed(1)},${(-h * 0.42).toFixed(1)}) scale(${(1 / k).toFixed(3)})`}>
            {Array.from({ length: Math.ceil(ubiN) }, (_, i) => (
              <g key={i} opacity={Math.min(1, ubiN - i)}>
                {i > 0 && <line x1={(i - 1) * 14} y1={-(i - 1) * 12 + ((i - 1) % 2) * 8} x2={i * 14} y2={-i * 12 + (i % 2) * 8} stroke="var(--ubiquitina)" strokeWidth={3} />}
                <circle cx={i * 14} cy={-i * 12 + (i % 2) * 8} r={8} className={s.ubi} />
              </g>
            ))}
          </g>
        )}
        {a.candado > 0.01 && (
          <g transform={`translate(${(-w * 0.36).toFixed(1)},${(-h * 0.36).toFixed(1)}) scale(${(1 / k).toFixed(3)})`} opacity={a.candado}>
            <circle r={14} className={s.candado} />
            <rect x={-5} y={-6} width={3.5} height={12} rx={1} fill="#fff" />
            <rect x={1.5} y={-6} width={3.5} height={12} rx={1} fill="#fff" />
          </g>
        )}
      </g>
    </g>
  );
});

// ─── Rótulos ──────────────────────────────────────────────────────────────────

type Rotulo = { key: string; x: number; y: number; w: number; h: number };
const anchoRotulo = (label: string) => etiquetaTexto(label).length * 11.6 + 24;
const choca = (a: Caja, b: Caja) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Colocación de rótulos (sección 3.8): debajo; si choca con otro rótulo o
 *  actor, prueba derecha, izquierda y arriba. En su propia capa, encima de
 *  todos los actores, para que ninguno tape un nombre. */
function colocarRotulos(keys: string[], cajas: Map<string, Caja>, labels: Record<string, string>): Rotulo[] {
  const puestos: Rotulo[] = [];
  const cuerpos = keys.map((k) => {
    const c = cajas.get(k)!;
    // Los bordes de una imagen son transparentes: se cuenta el núcleo.
    return { k, c: { x: c.x + c.w * 0.18, y: c.y + c.h * 0.18, w: c.w * 0.64, h: c.h * 0.64 } };
  });
  for (const k of keys) {
    const b = cajas.get(k)!;
    const w = anchoRotulo(labels[k]), h = 30;
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const cands: Caja[] = [
      { x: cx - w / 2, y: b.y + b.h + 4, w, h },
      { x: b.x + b.w + 6, y: cy - h / 2, w, h },
      { x: b.x - w - 6, y: cy - h / 2, w, h },
      { x: cx - w / 2, y: b.y - h - 4, w, h },
    ].map((c) => ({ ...c, x: Math.max(4, Math.min(ANCHO - c.w - 4, c.x)), y: Math.max(4, Math.min(ALTO - c.h - 4, c.y)) }));
    const libre = (c: Caja) => !puestos.some((p) => choca(p, c)) && !cuerpos.some((o) => o.k !== k && choca(o.c, c));
    const el = cands.find(libre) ?? cands.find((c) => !puestos.some((p) => choca(p, c))) ?? cands[0];
    puestos.push({ key: k, ...el });
  }
  return puestos;
}

function RotuloActor({ r, label, activo, color, op }: { r: Rotulo; label: string; activo: boolean; color: string; op: number }) {
  return (
    <g transform={`translate(${r.x.toFixed(1)},${r.y.toFixed(1)})`} opacity={op}>
      <rect width={r.w} height={r.h} rx={8} className={s.etiquetaFondo} stroke={activo ? color : undefined} />
      <text x={r.w / 2} y={r.h / 2} className={s.etiqueta} textAnchor="middle" dy="0.35em"><TextoSvg texto={label} /></text>
    </g>
  );
}

// ─── Efectos y desenlaces ─────────────────────────────────────────────────────

function Efecto({ e, trazos }: { e: EfectoSt; trazos: Map<string, Trazo> }) {
  switch (e.tipo) {
    case 'destello':
      return <circle cx={e.x} cy={e.y} r={e.r * (1 + 0.6 * e.p)} fill="none" stroke={e.color} strokeWidth={4 * (1 - e.p) + 1} opacity={1 - e.p} />;
    case 'chispas':
      return (
        <g opacity={1 - e.p}>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.3;
            const r0 = 20 + 40 * e.p, r1 = r0 + 22;
            return <line key={i} x1={e.x + Math.cos(a) * r0} y1={e.y + Math.sin(a) * r0} x2={e.x + Math.cos(a) * r1} y2={e.y + Math.sin(a) * r1} stroke="var(--cy3)" strokeWidth={4} strokeLinecap="round" />;
          })}
        </g>
      );
    case 'fragmentos':
      return (
        <g opacity={1 - e.p}>
          {Array.from({ length: 4 }, (_, i) => {
            const a = -Math.PI / 2 + (i - 1.5) * 0.5;
            return <circle key={i} cx={e.x + Math.cos(a) * (40 + 80 * e.p)} cy={e.y + Math.sin(a) * (40 + 80 * e.p)} r={6} fill="#8A97AB" />;
          })}
        </g>
      );
    case 'onda': {
      const fin = { x: e.x1 + (e.x2 - e.x1) * e.p, y: e.y1 + (e.y2 - e.y1) * e.p };
      return <path d={ondaEntre({ x: e.x1, y: e.y1 }, fin, 14, 40)} fill="none" stroke="var(--cy3)" strokeWidth={4} strokeLinecap="round" />;
    }
    case 'arnm': {
      const fin = { x: e.x1 + (e.x2 - e.x1) * e.p, y: e.y1 + (e.y2 - e.y1) * e.p };
      return <path d={ondaEntre({ x: e.x1, y: e.y1 }, fin, 7, 26)} fill="none" stroke="#B48CE0" strokeWidth={3.5} strokeLinecap="round" opacity={0.95} />;
    }
    case 'linea': {
      const fin = { x: e.x1 + (e.x2 - e.x1) * Math.max(0.02, e.p), y: e.y1 + (e.y2 - e.y1) * Math.max(0.02, e.p) };
      return <line x1={e.x1} y1={e.y1} x2={fin.x} y2={fin.y} stroke={e.clase === 'degrada' ? '#8A97AB' : 'var(--texto-2)'} strokeWidth={3} strokeDasharray={e.clase === 'degrada' ? '2 7' : '6 6'} strokeLinecap="round" opacity={0.8} />;
    }
    case 'punto': {
      const tr = e.via ? trazos.get(e.via) : undefined;
      const q = tr ? tr.en(Math.min(1, Math.max(0, e.f))) : { x: e.x1 + (e.x2 - e.x1) * e.f, y: e.y1 + (e.y2 - e.y1) * e.f };
      return (
        <g>
          <circle cx={q.x} cy={q.y} r={18} fill={e.color} opacity={0.25} />
          <circle cx={q.x} cy={q.y} r={8} fill={e.color} />
        </g>
      );
    }
  }
}

const DESENLACE: Record<DesenlaceSt['kind'], { titulo: string; img?: string; color: string }> = {
  fase_s: { titulo: 'Entra en fase S', color: '#5B8CFF' },
  mitosis: { titulo: 'Entra en mitosis', color: '#FF4D6D' },
  detencion: { titulo: 'Ciclo detenido', color: '#FF4D6D' },
  reparacion: { titulo: 'Reparación del ADN', color: '#B48CE0' },
  apoptosis: { titulo: 'Apoptosis', img: 'celula_apoptotica', color: '#E0474C' },
  senescencia: { titulo: 'Senescencia', img: 'celula_senescente', color: '#C9D3E0' },
  reanuda: { titulo: 'El ciclo se reanuda', img: 'celula_normal', color: '#3DDC97' },
};

function Desenlace({ d }: { d: DesenlaceSt }) {
  const cfg = DESENLACE[d.kind];
  const img = cfg.img ? imagen(cfg.img) : null;
  // Se ensancha con su texto en vez de cortarlo.
  const W = Math.max(320, 116 + Math.max(cfg.titulo.length * 13.5, (d.texto?.length ?? 0) * 8.6)), H = 92;
  return (
    <g transform={`translate(${d.x},${d.y}) scale(${0.9 + 0.1 * d.op})`} opacity={d.op} className={s.desenlace}>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={18} className={s.desenlaceCaja} stroke={cfg.color} />
      {img?.src ? (
        <image href={img.src} x={-W / 2 + 10} y={-H / 2 + 8} width={76} height={76} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <g transform={`translate(${-W / 2 + 48},0)`}>
          <circle r={28} fill={cfg.color} opacity={0.18} />
          {d.kind === 'detencion' ? (
            <><rect x={-9} y={-12} width={6} height={24} rx={2} fill={cfg.color} /><rect x={3} y={-12} width={6} height={24} rx={2} fill={cfg.color} /></>
          ) : d.kind === 'reparacion' ? (
            <path d="M-12,2 L-3,11 L13,-9" fill="none" stroke={cfg.color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M-12,0 H10 M3,-9 L12,0 L3,9" fill="none" stroke={cfg.color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      )}
      <text x={-W / 2 + 100} y={d.texto ? -8 : 0} dy="0.35em" className={s.desenlaceTitulo}>{cfg.titulo}</text>
      {d.texto && <text x={-W / 2 + 100} y={20} dy="0.35em" className={s.desenlaceSub}>{d.texto}</text>}
    </g>
  );
}

function Nota({ texto, caja, side, op }: { texto: string; caja: Caja; side: string; op: number }) {
  const w = Math.min(420, texto.length * 10.6 + 30), h = 40;
  let x = caja.x + caja.w / 2 - w / 2, y = caja.y - h - 14;
  if (side === 'bottom') y = caja.y + caja.h + 44;
  if (side === 'right') { x = caja.x + caja.w + 14; y = caja.y + caja.h / 2 - h / 2; }
  if (side === 'left') { x = caja.x - w - 14; y = caja.y + caja.h / 2 - h / 2; }
  x = Math.max(8, Math.min(ANCHO - w - 8, x));
  y = Math.max(8, Math.min(ALTO - h - 8, y));
  return (
    <g opacity={op} className={s.nota}>
      <rect x={x} y={y} width={w} height={h} rx={12} className={s.notaCaja} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dy="0.35em" className={s.notaTxt}>{texto}</text>
    </g>
  );
}

// ─── Compartimentos ───────────────────────────────────────────────────────────

function Compartimentos({ esc }: { esc: Escenario }) {
  const c = esc.compartimentos;
  const memb = imagen('membrana_plasmatica');
  const topN = c.nucleo ? c.nucleo.top * 100 : null;
  return (
    <g className={s.compartimentos}>
      {c.membrana && memb.src && (
        <>
          <defs>
            <pattern id="patron-membrana" patternUnits="userSpaceOnUse" x={0} y={78} width={memb.w * 0.55} height={memb.h * 0.55}>
              <image href={memb.src} width={memb.w * 0.55} height={memb.h * 0.55} preserveAspectRatio="none" />
            </pattern>
          </defs>
          <rect x={0} y={78} width={ANCHO} height={memb.h * 0.55} fill="url(#patron-membrana)" opacity={0.85} />
          <text x={24} y={60} className={s.rotuloComp}>Membrana</text>
          <text x={24} y={190} className={s.rotuloComp}>Citoplasma</text>
        </>
      )}
      {topN !== null && (
        <>
          <path
            d={`M60,${topN + 70} C60,${topN + 10} 140,${topN} 260,${topN} L1340,${topN} C1460,${topN} 1540,${topN + 10} 1540,${topN + 70} L1540,${ALTO + 40} L60,${ALTO + 40} Z`}
            className={s.nucleo}
          />
          <path
            d={`M72,${topN + 76} C72,${topN + 22} 150,${topN + 12} 264,${topN + 12} L1336,${topN + 12} C1450,${topN + 12} 1528,${topN + 22} 1528,${topN + 76}`}
            className={s.nucleoInterno}
          />
          <text x={86} y={topN + 44} className={s.rotuloComp}>Núcleo</text>
          {!c.membrana && topN > 250 && <text x={24} y={60} className={s.rotuloComp}>Citoplasma</text>}
        </>
      )}
      {c.nucleolo && (
        <>
          <ellipse cx={c.nucleolo.col * 100} cy={c.nucleolo.row * 100} rx={120} ry={90} className={s.nucleolo} />
          <text x={c.nucleolo.col * 100} y={c.nucleolo.row * 100 - 100} textAnchor="middle" className={s.rotuloComp}>Nucléolo</text>
        </>
      )}
      {c.centrosoma && (
        <g transform={`translate(${c.centrosoma.col * 100},${c.centrosoma.row * 100})`} className={s.centrosoma}>
          <circle r={70} className={s.centrosomaHalo} />
          <rect x={-8} y={-26} width={16} height={52} rx={6} />
          <rect x={-26} y={-8} width={52} height={16} rx={6} />
          <text y={-84} textAnchor="middle" className={s.rotuloComp}>Centrosoma</text>
        </g>
      )}
      {c.polos && [80, ANCHO - 80].map((x) => (
        <g key={x} transform={`translate(${x},500)`} className={s.polo}>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 70} y2={Math.sin(a) * 70} />;
          })}
          <circle r={14} />
          <text y={100} textAnchor="middle" className={s.rotuloComp}>Polo del huso</text>
        </g>
      ))}
    </g>
  );
}

// ─── Escenario ────────────────────────────────────────────────────────────────

export type PropsEscena = {
  escenario: Escenario;
  escena: EscenaSt;
  ocultarEtiquetas?: boolean;
  /** Actores resaltados (cajón abierto, pista): los demás se atenúan. */
  resaltar?: string[] | null;
  seleccionado?: string | null;
  onActor?: (key: string) => void;
  rejilla?: boolean;
  /** Contenido extra dentro del SVG (encima de todo). */
  children?: ReactNode;
  className?: string;
  /** Permitir zoom con rueda/pellizco y arrastre. */
  camaraLibre?: boolean;
  onInteraccion?: () => void;
  vistaReset?: number;
};

export default function Escena({
  escenario, escena, ocultarEtiquetas, resaltar, seleccionado, onActor, rejilla, children, className,
  camaraLibre = true, onInteraccion, vistaReset = 0,
}: PropsEscena) {
  const [vista, setVista] = useState({ k: 1, px: 0, py: 0, reset: vistaReset });
  // Un «Encuadrar todo» externo reinicia la vista del usuario.
  if (vista.reset !== vistaReset) setVista({ k: 1, px: 0, py: 0, reset: vistaReset });
  const svgRef = useRef<SVGSVGElement>(null);
  const gesto = useRef<{ x: number; y: number; px: number; py: number; id: number } | null>(null);
  const toques = useRef(new Map<number, { x: number; y: number }>());
  const pinza = useRef<{ d: number; k: number } | null>(null);

  const cam = escena.camara;
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
    for (const c of escena.conectores) {
      const a = cajas.get(c.from), b = cajas.get(c.to);
      if (!a || !b) continue;
      const obst = [...cajas.entries()].filter(([k]) => k !== c.from && k !== c.to).map(([, v]) => v);
      const curva = c.curve ?? (c.type === 'retroalimentacion' ? 0.38 : undefined);
      const tr = trazoEntre(a, b, curva, obst);
      if (tr) m.set(c.id, tr);
    }
    return m;
  }, [escena.conectores, cajas]);

  const rotulos = useMemo(() => {
    if (ocultarEtiquetas) return [];
    const keys = visibles.filter((k) => (escena.actores[k].op ?? 0) > 0.3);
    const labels = Object.fromEntries(keys.map((k) => [k, escena.actores[k].label ?? escenario.actores[k]?.label ?? k]));
    return colocarRotulos(keys, cajas, labels);
  }, [ocultarEtiquetas, visibles, cajas, escena.actores, escenario.actores]);

  const foco = resaltar ?? escena.foco?.actors ?? null;
  const kFoco = resaltar ? 1 : escena.foco?.k ?? 0;
  const atenuarDe = (key: string) => (foco && !foco.includes(key) ? 1 - 0.7 * kFoco : 1);

  const aSvg = (dx: number, dy: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const k = Math.max(vw / r.width, vh / r.height);
    return { x: dx * k, y: dy * k };
  };

  const onWheel = (ev: React.WheelEvent) => {
    if (!camaraLibre) return;
    onInteraccion?.();
    const f = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
    setVista((v) => ({ ...v, k: Math.min(4, Math.max(1, v.k * f)), ...(v.k * f <= 1 ? { px: 0, py: 0 } : {}) }));
  };
  const onDown = (ev: RPointerEvent<SVGSVGElement>) => {
    if (!camaraLibre) return;
    toques.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (toques.current.size === 2) {
      const [a, b] = [...toques.current.values()];
      pinza.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: vista.k };
      gesto.current = null;
      return;
    }
    if (vista.k > 1) gesto.current = { x: ev.clientX, y: ev.clientY, px: vista.px, py: vista.py, id: ev.pointerId };
  };
  const onMove = (ev: RPointerEvent<SVGSVGElement>) => {
    if (!toques.current.has(ev.pointerId)) return;
    toques.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pinza.current && toques.current.size === 2) {
      const [a, b] = [...toques.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const k = Math.min(4, Math.max(1, (pinza.current.k * d) / pinza.current.d));
      onInteraccion?.();
      setVista((v) => ({ ...v, k }));
      return;
    }
    const gst = gesto.current;
    if (!gst || gst.id !== ev.pointerId) return;
    const dd = aSvg(ev.clientX - gst.x, ev.clientY - gst.y);
    if (Math.abs(dd.x) + Math.abs(dd.y) > 4) onInteraccion?.();
    setVista((v) => ({ ...v, px: gst.px - dd.x, py: gst.py - dd.y }));
  };
  const onUp = (ev: RPointerEvent<SVGSVGElement>) => {
    toques.current.delete(ev.pointerId);
    if (toques.current.size < 2) pinza.current = null;
    if (gesto.current?.id === ev.pointerId) gesto.current = null;
  };

  const familias = Object.keys(FAMILIAS) as Familia[];
  const conectoresAtras = escena.conectores.filter((c) => ATRAS.has(c.type));
  const conectoresFrente = escena.conectores.filter((c) => !ATRAS.has(c.type));
  const pintaConector = (c: ConectorSt) => {
    const tr = trazos.get(c.id);
    if (!tr) return null;
    const dim = Math.min(atenuarDe(c.from), atenuarDe(c.to));
    return (
      <g key={c.id} opacity={dim}>
        <Conector c={c} tr={tr} onda={c.type === 'dano'} />
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      className={`${s.escena} ${className ?? ''}`}
      viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="group"
      aria-label={`Vía: ${escenario.nombre}`}
    >
      <defs>
        {familias.map((f) => (
          <radialGradient key={f} id={`halo-${f}`}>
            <stop offset="0%" stopColor={FAMILIAS[f].color} stopOpacity={0.55} />
            <stop offset="55%" stopColor={FAMILIAS[f].color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={FAMILIAS[f].color} stopOpacity={0} />
          </radialGradient>
        ))}
        <radialGradient id="vineta" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
        </radialGradient>
        <filter id="grano" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <g className={s.capaFondo}>
        <rect x={-800} y={-800} width={ANCHO + 1600} height={ALTO + 1600} className={s.campo} />
        <rect x={0} y={0} width={ANCHO} height={ALTO} fill="url(#vineta)" className={s.vineta} />
        <rect x={0} y={0} width={ANCHO} height={ALTO} filter="url(#grano)" opacity={0.04} />
      </g>

      <Compartimentos esc={escenario} />

      {rejilla && (
        <g className={s.rejilla}>
          {Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={ALTO} />)}
          {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 100} x2={ANCHO} y2={i * 100} />)}
          {Array.from({ length: 16 }, (_, i) => <text key={`c${i}`} x={i * 100 + 4} y={16}>{i}</text>)}
          {Array.from({ length: 10 }, (_, i) => <text key={`r${i}`} x={4} y={i * 100 + 30}>{i}</text>)}
        </g>
      )}

      <g className={s.capaConectoresAtras}>{conectoresAtras.map(pintaConector)}</g>

      <g className={s.capaActores}>
        {visibles.map((k) => {
          const a = escena.actores[k];
          const decl = escenario.actores[k];
          return (
            <Actor
              key={k}
              a={a}
              pos={posAbs(escena, k)}
              label={a.label ?? decl?.label ?? k}
              espejo={!!decl?.espejo}
              atenuar={atenuarDe(k)}
              seleccionado={seleccionado === k}
              escala={escena.escala ?? 1}
              interactivo={!!onActor}
              onClick={onActor}
            />
          );
        })}
      </g>

      <g className={s.capaEfectos}>{escena.efectos.map((e, i) => <Efecto key={i} e={e} trazos={trazos} />)}</g>

      <g className={s.capaConectoresFrente}>{conectoresFrente.map(pintaConector)}</g>

      <g className={s.capaEtiquetas}>
        {escena.desenlaces.map((d) => <Desenlace key={d.id} d={d} />)}
        {!ocultarEtiquetas && escena.notas.map((n) => {
          const caja = cajas.get(n.near);
          if (!caja) return null;
          return <Nota key={n.id} texto={n.text} caja={caja} side={n.side} op={n.op} />;
        })}
        {rotulos.map((r) => {
          const a = escena.actores[r.key];
          return (
            <RotuloActor
              key={r.key}
              r={r}
              label={a.label ?? escenario.actores[r.key]?.label ?? r.key}
              activo={a.estado === 'activo'}
              color={FAMILIAS[imagen(a.img).familia].color}
              op={Math.min(1, a.op) * atenuarDe(r.key)}
            />
          );
        })}
      </g>

      {children}
    </svg>
  );
}
