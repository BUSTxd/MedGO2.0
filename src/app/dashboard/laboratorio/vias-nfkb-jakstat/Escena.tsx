'use client';
// Escenario SVG del laboratorio «Vías NF-κB y JAK/STAT». Pinta una `Escena`
// ya evaluada por el motor; no anima nada por sí mismo. Mismo esqueleto que
// el del ciclo celular (capas, cámara con zoom y arrastre, conectores
// recortados al borde de cada molécula), pero cada actor se DIBUJA según su
// forma: elipses con brillo como en la figura de Küppers, receptores que
// cruzan la bicapa, LMP1 con sus seis pasos, trímeros de ligando, la doble
// hélice… Solo el proteasoma, la ligasa SCF y la ubiquitina son recortes
// del banco del ciclo celular.

import { memo, useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode, type RefObject } from 'react';
import type { Escenario, ViaId } from '@/lib/data/vias-nfkb/tipos';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import { COLOR_VIA, ROJO_ALTERACION } from '@/lib/data/vias-nfkb/colores';
import { ALTO, ANCHO, CELDA, cajaActor, nucleoY, posAbs, type ActorSt, type Caja, type ConectorSt, type DesenlaceSt, type EfectoSt, type Escena as EscenaSt } from '@/lib/vias-nfkb/motor';
import { ondaEntre, trazoEntre, type Punto, type Trazo } from '@/lib/ciclo-celular/geometria';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

// ─── Color ────────────────────────────────────────────────────────────────────

function mezclar(hex: string, con: string, k: number): string {
  const a = parseInt(hex.slice(1), 16), b = parseInt(con.slice(1), 16);
  const ch = (x: number, y: number) => Math.round(x + (y - x) * k);
  const r = ch((a >> 16) & 255, (b >> 16) & 255), g = ch((a >> 8) & 255, (b >> 8) & 255), bl = ch(a & 255, b & 255);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}
const claro = (h: string, k: number) => mezclar(h, '#ffffff', k);
const oscuro = (h: string, k: number) => mezclar(h, '#1b1430', k);
const idColor = (h: string) => h.replace('#', '');

export const NOMBRE_VIA: Record<ViaId, string> = {
  clasica: 'Vía clásica de NF-κB',
  alternativa: 'Vía alternativa de NF-κB',
  jakstat: 'Vía JAK/STAT',
};

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

export const textoPlano = (l: string) => l.replace(/<\/?(sup|sub)>/g, '');

// ─── Conectores ───────────────────────────────────────────────────────────────

const COLOR_CONECTOR: Record<string, string> = {
  activa: 'var(--fitc)', inhibe: 'var(--rodamina)', fosforila: 'var(--fosfato-trazo)', transcribe: '#B48CE0',
  degrada: '#8A97AB', transloca: 'var(--texto-2)', secuestra: 'var(--texto-2)',
};
const ATRAS = new Set(['transcribe', 'degrada', 'transloca', 'secuestra']);

function parcial(tr: Trazo, t: number): string {
  if (t >= 0.999) return tr.d;
  const p0 = tr.ini, q0 = tr.ctrl;
  const q = { x: p0.x + (q0.x - p0.x) * t, y: p0.y + (q0.y - p0.y) * t };
  const e = tr.en(t);
  return `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q${q.x.toFixed(1)},${q.y.toFixed(1)} ${e.x.toFixed(1)},${e.y.toFixed(1)}`;
}

function Punta({ tipo, en, ang, k, color }: { tipo: string; en: Punto; ang: number; k: number; color: string }) {
  if (k <= 0) return null;
  const t = `translate(${en.x},${en.y}) rotate(${(ang * 180) / Math.PI}) scale(${Math.min(1, k * 1.4)})`;
  switch (tipo) {
    case 'inhibe':
      return <line transform={t} x1={0} y1={-11} x2={0} y2={11} stroke={color} strokeWidth={5} strokeLinecap="round" />;
    case 'transcribe':
    case 'degrada':
      return <path transform={t} d="M-15,-8 L0,0 L-15,8" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
    case 'secuestra':
      return null;
    default:
      return <path transform={t} d="M2,0 L-16,-9 L-12,0 L-16,9 Z" fill={color} />;
  }
}

function Conector({ cn, tr }: { cn: ConectorSt; tr: Trazo }) {
  const color = COLOR_CONECTOR[cn.type];
  const ancho = cn.type === 'activa' || cn.type === 'inhibe' ? 3.5 : cn.type === 'secuestra' ? 2 : 3;
  const dash = cn.type === 'fosforila' ? '8 6' : cn.type === 'degrada' ? '2 7' : cn.type === 'secuestra' ? '4 5' : undefined;
  const kPunta = (cn.prog - 0.8) / 0.2;
  return (
    <g opacity={cn.op}>
      <path d={parcial(tr, cn.prog)} fill="none" stroke={color} strokeWidth={ancho} strokeDasharray={dash} strokeLinecap="round" />
      <Punta tipo={cn.type} en={tr.fin} ang={tr.angFin} k={Math.min(1, kPunta)} color={color} />
      {cn.type === 'fosforila' && cn.prog > 0.5 && (
        <g transform={`translate(${tr.medio.x},${tr.medio.y})`}>
          <circle r={12} fill="var(--campo-2)" stroke={color} strokeWidth={2} />
          <text className={c.marcaConector} textAnchor="middle" dy="0.35em" fill={color}>P</text>
        </g>
      )}
      {cn.label && cn.prog > 0.6 && (
        <g transform={`translate(${tr.medio.x},${tr.medio.y})`}>
          <rect x={-(cn.label.length * 4.9 + 10)} y={-12} width={cn.label.length * 9.8 + 20} height={24} rx={8} fill="var(--campo-2)" opacity={0.92} />
          <text className={s.etiquetaConector} textAnchor="middle" dy="0.35em">{cn.label}</text>
        </g>
      )}
    </g>
  );
}

// ─── Formas ───────────────────────────────────────────────────────────────────

/** Elipse con brillo, como las de la figura. */
function Elipse({ w, h, color, label, k }: { w: number; h: number; color: string; label: string; k: number }) {
  const n = textoPlano(label).length;
  const fs = Math.min(23 * k, (w - 16) / (n * 0.56));
  return (
    <g>
      <ellipse rx={w / 2} ry={h / 2} fill={`url(#gl-${idColor(color)})`} stroke={oscuro(color, 0.38)} strokeWidth={1.6} />
      <ellipse cx={-w * 0.12} cy={-h * 0.22} rx={w * 0.26} ry={h * 0.13} fill="#fff" opacity={0.42} />
      <text className={s.rotuloElipse} textAnchor="middle" dy="0.36em" style={{ fontSize: fs }}><TextoSvg texto={label} /></text>
    </g>
  );
}

function Receptor({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.32} fill={`url(#gv-${idColor(color)})`} stroke={oscuro(color, 0.35)} strokeWidth={1.6} />
      <rect x={-w / 2 + w * 0.18} y={-h / 2 + 4} width={w * 0.22} height={h - 8} rx={w * 0.1} fill="#fff" opacity={0.35} />
    </g>
  );
}

/** LMP1: seis hélices transmembrana unidas por asas, y su cola citoplasmática. */
function Multipaso({ w, h, color }: { w: number; h: number; color: string }) {
  const n = 6, bw = w / (n * 1.25), paso = (w - bw) / (n - 1);
  const hh = h * 0.62;
  const xs = Array.from({ length: n }, (_, i) => -w / 2 + bw / 2 + i * paso);
  return (
    <g>
      {xs.slice(0, -1).map((x, i) => {
        const arriba = i % 2 === 0;
        const y = arriba ? -hh / 2 : hh / 2;
        return <path key={i} d={`M${x},${y} Q${x + paso / 2},${y + (arriba ? -16 : 16)} ${x + paso},${y}`} fill="none" stroke={oscuro(color, 0.3)} strokeWidth={3} />;
      })}
      {xs.map((x, i) => (
        <rect key={i} x={x - bw / 2} y={-hh / 2} width={bw} height={hh} rx={bw / 2} fill={`url(#gv-${idColor(color)})`} stroke={oscuro(color, 0.35)} strokeWidth={1.2} />
      ))}
      <path d={`M${xs[n - 1]},${hh / 2} q12,${h * 0.16} -4,${h * 0.36}`} fill="none" stroke={oscuro(color, 0.3)} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function Ligando({ w, h, color }: { w: number; h: number; color: string }) {
  const r = Math.min(w, h) * 0.3;
  const pts = [[-r * 0.95, r * 0.55], [r * 0.95, r * 0.55], [0, -r * 0.75]];
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`url(#gl-${idColor(color)})`} stroke={oscuro(color, 0.38)} strokeWidth={1.4} />
      ))}
    </g>
  );
}

function Citocina({ w, color }: { w: number; color: string }) {
  const r = w / 2;
  return (
    <g>
      <circle r={r} fill={`url(#gl-${idColor(color)})`} stroke={oscuro(color, 0.38)} strokeWidth={1.4} />
      {[-0.4, 0, 0.4].map((x, i) => <line key={i} x1={x * r} y1={-r * 0.55} x2={x * r} y2={r * 0.55} stroke={oscuro(color, 0.3)} strokeWidth={2} strokeLinecap="round" opacity={0.6} />)}
    </g>
  );
}

function Producto({ w, h, color, label }: { w: number; h: number; color: string; label: string }) {
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} stroke={oscuro(color, 0.35)} strokeWidth={1.4} />
      <text className={s.rotuloProducto} textAnchor="middle" dy="0.36em"><TextoSvg texto={label} /></text>
    </g>
  );
}

/** Célula del microambiente: linfocito (núcleo redondo) o eosinófilo (bilobulado). */
function Celula({ w, h, color, eosinofilo }: { w: number; h: number; color: string; eosinofilo: boolean }) {
  return (
    <g>
      <ellipse rx={w / 2} ry={h / 2} fill={color} stroke={oscuro(color, 0.3)} strokeWidth={2} opacity={0.95} />
      {eosinofilo ? (
        <>
          {Array.from({ length: 14 }, (_, i) => {
            const a = i * 2.4, rr = (0.25 + (i % 4) * 0.06);
            return <circle key={i} cx={Math.cos(a) * w * rr} cy={Math.sin(a) * h * rr} r={3.4} fill="#E2725B" opacity={0.75} />;
          })}
          <ellipse cx={-w * 0.14} cy={0} rx={w * 0.14} ry={h * 0.2} fill="#7B5EA7" opacity={0.85} />
          <ellipse cx={w * 0.14} cy={0} rx={w * 0.14} ry={h * 0.2} fill="#7B5EA7" opacity={0.85} />
        </>
      ) : (
        <ellipse rx={w * 0.33} ry={h * 0.36} fill="#5B4A94" opacity={0.85} />
      )}
    </g>
  );
}

function Adn({ w, h, activo }: { w: number; h: number; activo: number }) {
  const per = 120, amp = h * 0.36;
  const n = Math.ceil(w / 8);
  const pts = (fase: number) => Array.from({ length: n + 1 }, (_, i) => {
    const x = -w / 2 + (i * w) / n;
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${(Math.sin((x / per) * Math.PI * 2 + fase) * amp).toFixed(1)}`;
  }).join(' ');
  const peldanos = Array.from({ length: Math.floor(w / 20) }, (_, i) => -w / 2 + 10 + i * 20);
  return (
    <g>
      {activo > 0.01 && <rect x={-w / 2} y={-h * 0.7} width={w} height={h * 1.4} rx={h * 0.7} fill="#B48CE0" opacity={0.12 * activo} />}
      {peldanos.map((x) => {
        const y1 = Math.sin((x / per) * Math.PI * 2) * amp, y2 = Math.sin((x / per) * Math.PI * 2 + Math.PI) * amp;
        return <line key={x} x1={x} y1={y1} x2={x} y2={y2} className={s.adnPeldano} />;
      })}
      <path d={pts(0)} className={s.adnHebra} />
      <path d={pts(Math.PI)} className={s.adnHebraB} />
    </g>
  );
}

// ─── Actor ────────────────────────────────────────────────────────────────────

type PropsActor = {
  a: ActorSt;
  pos: Punto;
  atenuar: number;
  seleccionado: boolean;
  interactivo: boolean;
  k: number;
  info?: string;
  onClick?: (key: string) => void;
};

function Forma({ a, k }: { a: ActorSt; k: number }) {
  const color = a.colorAlt ?? a.color;
  switch (a.forma) {
    case 'proteina': return <Elipse w={a.w} h={a.h} color={color} label={a.label} k={k} />;
    case 'receptor': return <Receptor w={a.w} h={a.h} color={color} />;
    case 'multipaso': return <Multipaso w={a.w} h={a.h} color={color} />;
    case 'ligando': return <Ligando w={a.w} h={a.h} color={color} />;
    case 'citocina': return <Citocina w={a.w} color={color} />;
    case 'producto': return <Producto w={a.w} h={a.h} color={color} label={a.label} />;
    case 'celula': return <Celula w={a.w} h={a.h} color={color} eosinofilo={a.label.toLowerCase().includes('eosin')} />;
    case 'adn': return <Adn w={a.w} h={a.h} activo={a.halo} />;
    case 'imagen': {
      const im = imagen(a.img ?? 'proteasoma');
      return im.src ? <image href={im.src} x={-a.w / 2} y={-a.h / 2} width={a.w} height={a.h} preserveAspectRatio="xMidYMid meet" /> : null;
    }
  }
}

const SRC_UBI = imagen('ubiquitina').src;

const Actor = memo(function Actor({ a, pos, atenuar, seleccionado, interactivo, k, onClick }: PropsActor) {
  const kk = a.esc;
  const lado = a.forma === 'adn' ? a.h * 1.4 : Math.max(a.w, a.h);
  const filtro = a.gris > 0.01 ? `grayscale(${a.gris.toFixed(2)}) brightness(${(1 - 0.22 * a.gris).toFixed(2)})` : undefined;
  const ubiN = Math.min(4, a.ubi);
  const estadoTxt = [
    a.estado === 'inhibido' ? 'inhibida' : a.estado === 'activo' ? 'activa' : null,
    a.fosfatos.length ? 'fosforilada' : null,
    a.ubi >= 1 ? `con cadena ${a.cadena}` : null,
    a.mut ? `alterada: ${a.mut.gene}` : null,
  ].filter(Boolean).join(', ');
  const color = a.colorAlt ?? a.color;
  return (
    <g
      transform={`translate(${(pos.x + a.ex).toFixed(1)},${(pos.y + a.ey).toFixed(1)})`}
      opacity={a.op * atenuar}
      className={interactivo ? c.actorInteractivo : c.actor}
      role={interactivo ? 'button' : 'img'}
      tabIndex={interactivo ? 0 : undefined}
      aria-label={`${textoPlano(a.label) || 'Receptor'}${estadoTxt ? `, ${estadoTxt}` : ''}`}
      onClick={interactivo && onClick ? () => onClick(a.key) : undefined}
      onKeyDown={interactivo && onClick ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(a.key); } } : undefined}
    >
      <g transform={`rotate(${a.rot.toFixed(2)}) scale(${kk.toFixed(3)})`}>
        {(a.halo > 0.01 || seleccionado) && a.forma !== 'adn' && (
          <circle r={lado * 0.68} fill={`url(#ha-${idColor(color)})`} opacity={seleccionado ? 1 : a.halo} />
        )}
        {seleccionado && <circle r={lado * 0.62} fill="none" stroke="var(--dapi)" strokeWidth={3} strokeDasharray="6 7" />}
        {/* Ganancia: copias detrás, como un montón de la misma proteína. */}
        {a.mut?.efecto === 'ganancia' && (
          <g opacity={0.55 * a.mut.op}>
            <g transform="translate(16,-12)"><Forma a={a} k={k} /></g>
            <g transform="translate(8,-6)"><Forma a={a} k={k} /></g>
          </g>
        )}
        <g style={filtro ? { filter: filtro } : undefined}><Forma a={a} k={k} /></g>
        {a.mut?.efecto === 'perdida' && (
          <g opacity={a.mut.op} stroke={ROJO_ALTERACION} strokeWidth={5} strokeLinecap="round">
            <line x1={-a.w * 0.22} y1={-a.h * 0.32} x2={a.w * 0.22} y2={a.h * 0.32} />
            <line x1={a.w * 0.22} y1={-a.h * 0.32} x2={-a.w * 0.22} y2={a.h * 0.32} />
          </g>
        )}
        {a.fosfatos.map((f) => {
          const sp = a.pSites[(Number(f.site.replace(/\D/g, '')) || 1) - 1] ?? [0.9, 0.35];
          const x = sp[0] * a.w - a.w / 2 + f.dx;
          const y = sp[1] * a.h - a.h / 2 + f.dy;
          const ap = f.op < 1 ? 1 + 0.3 * Math.sin(Math.PI * f.op) : 1;
          return (
            <g key={f.site} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(ap / kk).toFixed(3)})`} opacity={f.op}>
              <circle r={13} className={c.fosfato} />
              <text className={c.fosfatoTxt} textAnchor="middle" dy="0.36em">P</text>
              {f.label && <text className={c.residuo} textAnchor="middle" y={-20}>{f.label}</text>}
            </g>
          );
        })}
        {ubiN > 0 && (
          <g transform={`translate(${(a.w * 0.3).toFixed(1)},${(-a.h * 0.5).toFixed(1)}) scale(${(1 / kk).toFixed(3)})`}>
            {Array.from({ length: Math.ceil(ubiN) }, (_, i) => {
              const x = i * 15, y = -i * 13 + (i % 2) * 7;
              return (
                <g key={i} opacity={Math.min(1, ubiN - i)}>
                  {i > 0 && <line x1={(i - 1) * 15} y1={-(i - 1) * 13 + ((i - 1) % 2) * 7} x2={x} y2={y} stroke={a.cadena === 'K63' ? 'var(--fitc)' : 'var(--ubiquitina)'} strokeWidth={3} />}
                  {SRC_UBI
                    ? <image href={SRC_UBI} x={x - 10} y={y - 10} width={20} height={20} />
                    : <circle cx={x} cy={y} r={8} className={c.ubi} />}
                  {i === 0 && <circle cx={x} cy={y} r={11.5} fill="none" stroke={a.cadena === 'K63' ? 'var(--fitc)' : 'var(--ubiquitina)'} strokeWidth={2} />}
                </g>
              );
            })}
            {ubiN >= 1 && (
              <g transform={`translate(${Math.ceil(ubiN) * 15 + 8},${-Math.ceil(ubiN) * 13 + 6})`}>
                <rect x={-2} y={-11} width={40} height={20} rx={6} className={a.cadena === 'K63' ? s.chipK63 : s.chipK48} />
                <text x={18} y={0} textAnchor="middle" dy="0.32em" className={s.chipCadena}>{a.cadena}</text>
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
});

// ─── Rótulos externos (receptores, ligandos, imágenes, células, ADN) ─────────

const EXTERNO = new Set(['receptor', 'multipaso', 'ligando', 'citocina', 'imagen', 'celula', 'adn']);

function RotuloExterno({ a, pos, op }: { a: ActorSt; pos: Punto; op: number }) {
  const txt = textoPlano(a.label);
  if (!txt) return null;
  let x = pos.x, y = pos.y, anchor: 'middle' | 'start' | 'end' = 'middle';
  if (a.forma === 'receptor' || a.forma === 'multipaso') y = pos.y - a.h / 2 - 8;
  else if (a.forma === 'ligando' || a.forma === 'citocina') { x = pos.x + a.w / 2 + 6; y = pos.y + 5; anchor = 'start'; }
  else if (a.forma === 'adn') { x = pos.x - a.w / 2 + 14; y = pos.y - a.h / 2 - 8; anchor = 'start'; }
  else y = pos.y + a.h / 2 + 20;
  return (
    <text x={x} y={y} textAnchor={anchor} className={s.rotuloExterno} opacity={op}>{txt}</text>
  );
}

/** Marca roja de alteración, debajo del actor (como el texto rojo de la figura). */
function MarcaAlteracion({ a, pos }: { a: ActorSt; pos: Punto }) {
  if (!a.mut) return null;
  const y = pos.y + a.h / 2 + (EXTERNO.has(a.forma) ? 38 : 18);
  return (
    <g opacity={a.mut.op} className={s.marcaAlt} transform={`translate(${pos.x},${y})`}>
      <text textAnchor="middle" className={s.marcaAltGen}>{a.mut.gene}</text>
      {a.mut.pct && <text textAnchor="middle" y={19} className={s.marcaAltPct}>{a.mut.efecto === 'perdida' ? 'pérdida' : 'ganancia'} · {a.mut.pct}</text>}
    </g>
  );
}

// ─── Efectos, notas y desenlaces ──────────────────────────────────────────────

function Efecto({ e, trazos }: { e: EfectoSt; trazos: Map<string, Trazo> }) {
  switch (e.tipo) {
    case 'destello':
      return <circle cx={e.x} cy={e.y} r={e.r * (1 + 0.6 * e.p)} fill="none" stroke={e.color} strokeWidth={4 * (1 - e.p) + 1} opacity={1 - e.p} />;
    case 'fragmentos':
      return (
        <g opacity={1 - e.p}>
          {Array.from({ length: 5 }, (_, i) => {
            const ang = -Math.PI / 2 + (i - 2) * 0.5;
            return <rect key={i} x={e.x + Math.cos(ang) * (40 + 80 * e.p) - 5} y={e.y + Math.sin(ang) * (40 + 80 * e.p) - 3} width={10} height={6} rx={2} fill="#8A97AB" />;
          })}
        </g>
      );
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

const DESENLACE: Record<DesenlaceSt['kind'], { titulo: string; color: string }> = {
  apagada: { titulo: 'Señal apagada', color: '#22C3C9' },
  encendida: { titulo: 'Señal encendida', color: '#3DDC97' },
  supervivencia: { titulo: 'La célula sobrevive', color: '#E5484D' },
  evasion: { titulo: 'Evasión inmunitaria', color: '#E5484D' },
};

function Desenlace({ d }: { d: DesenlaceSt }) {
  const cfg = DESENLACE[d.kind];
  const W = Math.max(300, 100 + Math.max(cfg.titulo.length * 13.5, (d.texto?.length ?? 0) * 8.4)), H = 86;
  return (
    <g transform={`translate(${d.x},${d.y}) scale(${0.9 + 0.1 * d.op})`} opacity={d.op}>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={18} className={c.desenlaceCaja} stroke={cfg.color} />
      <g transform={`translate(${-W / 2 + 44},0)`}>
        <circle r={26} fill={cfg.color} opacity={0.18} />
        {d.kind === 'apagada'
          ? <><rect x={-9} y={-11} width={6} height={22} rx={2} fill={cfg.color} /><rect x={3} y={-11} width={6} height={22} rx={2} fill={cfg.color} /></>
          : <path d="M-11,0 H9 M2,-8 L11,0 L2,8" fill="none" stroke={cfg.color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
      </g>
      <text x={-W / 2 + 86} y={d.texto ? -9 : 0} dy="0.35em" className={c.desenlaceTitulo}>{cfg.titulo}</text>
      {d.texto && <text x={-W / 2 + 86} y={19} dy="0.35em" className={c.desenlaceSub}>{d.texto}</text>}
    </g>
  );
}

function Nota({ texto, caja, side, op }: { texto: string; caja: Caja; side: string; op: number }) {
  const w = Math.min(440, texto.length * 10.2 + 30), h = 40;
  let x = caja.x + caja.w / 2 - w / 2, y = caja.y - h - 14;
  if (side === 'bottom') y = caja.y + caja.h + 40;
  if (side === 'right') { x = caja.x + caja.w + 16; y = caja.y + caja.h / 2 - h / 2; }
  if (side === 'left') { x = caja.x - w - 16; y = caja.y + caja.h / 2 - h / 2; }
  x = Math.max(8, Math.min(ANCHO - w - 8, x));
  y = Math.max(8, Math.min(ALTO - h - 8, y));
  return (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={h} rx={12} className={c.notaCaja} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dy="0.35em" className={c.notaTxt}>{texto}</text>
    </g>
  );
}

// ─── Compartimentos ───────────────────────────────────────────────────────────

function Compartimentos({ esc }: { esc: Escenario }) {
  const cp = esc.compartimentos;
  const ym = cp.membrana * CELDA;
  const top = cp.nucleo;
  const arco = (dy = 0) => {
    const pts = Array.from({ length: 33 }, (_, i) => {
      const x = -40 + (i * (ANCHO + 80)) / 32;
      return `${i ? 'L' : 'M'}${x.toFixed(0)},${(nucleoY(top, x) + dy).toFixed(1)}`;
    });
    return pts.join(' ');
  };
  const poros = [0.12, 0.3, 0.5, 0.7, 0.88].map((f) => f * ANCHO);
  const rot = cp.rotulos;
  return (
    <g className={s.compartimentos}>
      <defs>
        <pattern id="bicapa" patternUnits="userSpaceOnUse" x={0} y={ym - 26} width={15} height={52}>
          <circle cx={7.5} cy={6} r={5.4} className={s.cabeza} />
          <circle cx={7.5} cy={46} r={5.4} className={s.cabeza} />
          <path d="M5.5,11 V23 M9.5,11 V22 M5.5,41 V29 M9.5,41 V30" className={s.cola} />
        </pattern>
      </defs>
      <rect x={-800} y={-800} width={ANCHO + 1600} height={ym - 26 + 800} className={s.extracelular} />
      <rect x={-800} y={ym - 26} width={ANCHO + 1600} height={52} fill="url(#bicapa)" />
      <path d={`${arco()} L${ANCHO + 40},${ALTO + 800} L-40,${ALTO + 800} Z`} className={c.nucleo} />
      <path d={arco(12)} className={c.nucleoInterno} />
      {poros.map((x) => <circle key={x} cx={x} cy={nucleoY(top, x) + 6} r={8} className={s.poro} />)}
      {!cp.rotulosVias && <text x={ANCHO - 24} y={34} textAnchor="end" className={c.rotuloComp}>Espacio extracelular</text>}
      <text x={rot ? rot.citoplasma.col * CELDA : 24} y={rot ? rot.citoplasma.row * CELDA : ym + 58} className={c.rotuloComp}>Citoplasma</text>
      <text x={rot ? rot.nucleo.col * CELDA : 24} y={rot ? rot.nucleo.row * CELDA : nucleoY(top, 24) + 44} className={c.rotuloComp}>Núcleo</text>
      {cp.rotulosVias?.map((r) => {
        const txt = NOMBRE_VIA[r.via].replace('Vía ', '').replace(/^\w/, (m) => m.toUpperCase());
        const w = Math.max(250, txt.length * 13 + 40);
        return (
          <g key={r.via} transform={`translate(${r.col * CELDA},30)`}>
            <rect x={-w / 2} y={-20} width={w} height={40} rx={8} fill={COLOR_VIA[r.via]} />
            <text textAnchor="middle" dy="0.35em" className={s.rotuloVia}>{txt}</text>
          </g>
        );
      })}
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
  children?: ReactNode;
  /** Contenido debajo de los actores (huecos del modo estudio). */
  fondo?: ReactNode;
  camaraLibre?: boolean;
  onInteraccion?: () => void;
  vistaReset?: number;
  svgRef?: RefObject<SVGSVGElement | null>;
  className?: string;
};

export default function Escena({
  escenario, escena, resaltar, seleccionado, onActor, children, fondo, camaraLibre = true, onInteraccion, vistaReset = 0, svgRef: refExterno, className,
}: PropsEscena) {
  const [vista, setVista] = useState({ k: 1, px: 0, py: 0, reset: vistaReset });
  if (vista.reset !== vistaReset) setVista({ k: 1, px: 0, py: 0, reset: vistaReset });
  const refPropio = useRef<SVGSVGElement>(null);
  const svgRef = refExterno ?? refPropio;
  const gesto = useRef<{ x: number; y: number; px: number; py: number; id: number } | null>(null);
  const kTexto = escenario.texto ?? 1;

  const cam = escena.camara;
  const vw = cam.w / vista.k, vh = cam.h / vista.k;
  const vx = cam.x + (cam.w - vw) / 2 + vista.px, vy = cam.y + (cam.h - vh) / 2 + vista.py;

  const visibles = useMemo(() => escena.orden.filter((k) => escena.actores[k]?.vis || (escena.actores[k]?.op ?? 0) > 0.001), [escena]);
  // El ADN va siempre detrás de todo (los dímeros se posan encima).
  const ordenPintado = useMemo(() => [...visibles].sort((a, b) => Number(escena.actores[b].forma === 'adn') - Number(escena.actores[a].forma === 'adn')), [visibles, escena.actores]);
  const cajas = useMemo(() => {
    const m = new Map<string, Caja>();
    for (const k of visibles) m.set(k, cajaActor(escena, k));
    return m;
  }, [escena, visibles]);

  const colores = useMemo(() => {
    const set = new Set<string>();
    for (const a of Object.values(escena.actores)) { set.add(a.color); if (a.colorAlt) set.add(a.colorAlt); }
    return [...set];
  }, [escena.actores]);

  const trazos = useMemo(() => {
    const m = new Map<string, Trazo>();
    for (const cn of escena.conectores) {
      const a = cajas.get(cn.from), b = cajas.get(cn.to);
      if (!a || !b) continue;
      const obst = [...cajas.entries()].filter(([k]) => k !== cn.from && k !== cn.to && escena.actores[k].forma !== 'adn').map(([, v]) => v);
      const tr = trazoEntre(a, b, cn.curve, obst);
      if (tr) m.set(cn.id, tr);
    }
    return m;
  }, [escena.conectores, escena.actores, cajas]);

  const foco = resaltar ?? escena.foco?.actors ?? null;
  const kFoco = resaltar ? 1 : escena.foco?.k ?? 0;
  const atenuarDe = (key: string) => (foco && !foco.includes(key) ? 1 - 0.65 * kFoco : 1);

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
    if (!camaraLibre || vista.k <= 1) return;
    gesto.current = { x: ev.clientX, y: ev.clientY, px: vista.px, py: vista.py, id: ev.pointerId };
  };
  const onMove = (ev: RPointerEvent<SVGSVGElement>) => {
    const gst = gesto.current;
    if (!gst || gst.id !== ev.pointerId) return;
    const dd = aSvg(ev.clientX - gst.x, ev.clientY - gst.y);
    if (Math.abs(dd.x) + Math.abs(dd.y) > 4) onInteraccion?.();
    setVista((v) => ({ ...v, px: gst.px - dd.x, py: gst.py - dd.y }));
  };
  const onUp = (ev: RPointerEvent<SVGSVGElement>) => { if (gesto.current?.id === ev.pointerId) gesto.current = null; };

  const pintaConector = (cn: ConectorSt) => {
    const tr = trazos.get(cn.id);
    if (!tr) return null;
    return <g key={cn.id} opacity={Math.min(atenuarDe(cn.from), atenuarDe(cn.to))}><Conector cn={cn} tr={tr} /></g>;
  };

  return (
    <svg
      ref={svgRef}
      className={`${c.escena} ${className ?? ''}`}
      viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      onWheel={onWheel}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="group"
      aria-label={escenario.nombre}
    >
      <defs>
        {colores.map((col) => (
          <g key={col}>
            <radialGradient id={`gl-${idColor(col)}`} cx="38%" cy="30%" r="75%">
              <stop offset="0%" stopColor={claro(col, 0.55)} />
              <stop offset="55%" stopColor={col} />
              <stop offset="100%" stopColor={oscuro(col, 0.22)} />
            </radialGradient>
            <linearGradient id={`gv-${idColor(col)}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={claro(col, 0.35)} />
              <stop offset="60%" stopColor={col} />
              <stop offset="100%" stopColor={oscuro(col, 0.25)} />
            </linearGradient>
            <radialGradient id={`ha-${idColor(col)}`}>
              <stop offset="0%" stopColor={col} stopOpacity={0.6} />
              <stop offset="55%" stopColor={col} stopOpacity={0.25} />
              <stop offset="100%" stopColor={col} stopOpacity={0} />
            </radialGradient>
          </g>
        ))}
        <radialGradient id="vineta-vias" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
        </radialGradient>
      </defs>

      <g>
        <rect x={-800} y={-800} width={ANCHO + 1600} height={ALTO + 1600} className={c.campo} />
      </g>
      <Compartimentos esc={escenario} />
      <rect x={-800} y={-800} width={ANCHO + 1600} height={ALTO + 1600} fill="url(#vineta-vias)" className={c.vineta} pointerEvents="none" />

      {fondo}

      <g>{escena.conectores.filter((cn) => ATRAS.has(cn.type)).map(pintaConector)}</g>

      <g>
        {ordenPintado.map((k) => (
          <Actor
            key={k}
            a={escena.actores[k]}
            pos={posAbs(escena, k)}
            atenuar={atenuarDe(k)}
            seleccionado={seleccionado === k}
            interactivo={!!onActor}
            k={kTexto}
            onClick={onActor}
          />
        ))}
      </g>

      <g pointerEvents="none">{escena.efectos.map((e, i) => <Efecto key={i} e={e} trazos={trazos} />)}</g>
      <g pointerEvents="none">{escena.conectores.filter((cn) => !ATRAS.has(cn.type)).map(pintaConector)}</g>

      <g pointerEvents="none">
        {visibles.map((k) => {
          const a = escena.actores[k];
          if (!EXTERNO.has(a.forma) || a.op < 0.3) return null;
          // En el panorama (texto reducido) los nombres de los ligandos se
          // pisan con el rótulo de la vía: el receptor ya dice cuál es.
          if (kTexto < 1 && (a.forma === 'ligando' || a.forma === 'citocina')) return null;
          return <RotuloExterno key={k} a={a} pos={posAbs(escena, k)} op={Math.min(1, a.op) * atenuarDe(k)} />;
        })}
        {visibles.map((k) => {
          const a = escena.actores[k];
          return a.mut ? <MarcaAlteracion key={`m-${k}`} a={a} pos={posAbs(escena, k)} /> : null;
        })}
        {escena.desenlaces.map((d) => <Desenlace key={d.id} d={d} />)}
        {escena.notas.map((n) => {
          const caja = cajas.get(n.near);
          if (!caja) return null;
          return <Nota key={n.id} texto={n.text} caja={caja} side={n.side} op={n.op} />;
        })}
      </g>

      {children}
    </svg>
  );
}
