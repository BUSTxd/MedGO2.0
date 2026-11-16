'use client';
// Lienzo del nefrón: zoom continuo del nefrón entero a sus células y, al
// acercar más (o tocar una célula), la vista de pared de esa célula. Dos capas
// que se funden: la del nefrón (SVG + canvas + SVG) y la de la célula (SVG +
// canvas). El canvas lleva lo que se mueve: el filtrado, las partículas y los
// glóbulos rojos; un solo requestAnimationFrame mueve todo.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { SUSTANCIAS } from '@/lib/data/nefron/sustancias.ts';
import { CELULAS } from '@/lib/data/nefron/celulas.ts';
import { SEGMENTOS, TRAMOS } from '@/lib/data/nefron/segmentos.ts';
import { esCapa } from '@/lib/data/nefron/barrera.ts';
import type { CelulaId, SegmentoId, TramoId, TransportadorId } from '@/lib/data/nefron/tipos.ts';
import {
  ALTO, ANCHO, CUENTAS, GLOMERULO, TRAMOS_GEO, ZONAS, cajaGlomerulo, cuentaDe, type Cuenta, type P,
} from './engine/geometria';
import {
  CAM_INICIAL, Z_CELULAS, Z_DETALLE, Z_MAX, aMundo, encuadrar, escala, interpolar, limitar, viewBox, zoomEn, type Camara,
} from './engine/camara';
import { colorOsm, fx, mezclarEstado, type Estado, type Factores, type Marca } from './engine/flujo';
import { disponer } from './engine/disposicion';
import { disponerBarrera } from './engine/barrera';
import { Emisores, PARTICULAS_RUTA, burbuja, enLaRuta, globuloRojo } from './engine/particulas';
import { ARTERIA, CuentasTramo, NefronBase, type Halo } from './EscenaNefron';
import { Etiqueta } from './Glifos';
import { sombra } from './engine/paleta';
import { EscenaBarrera, EscenaCelula, type PiezaId } from './EscenaCelula';
import nf from '@/styles/nefron.module.css';

export type Vista = 'nefron' | 'transporte' | 'hormonas' | 'farmacos' | 'clinico';
export type Destino = { tipo: 'inicio' } | { tipo: 'tramo'; id: SegmentoId };
export type Senal =
  | { kind: 'tramo'; id: SegmentoId }
  | { kind: 'celula'; id: CelulaId }
  | { kind: 'pieza'; id: PiezaId }
  | null;

export interface Opciones { etiquetas: boolean; vasos: boolean; gradiente: boolean; particulas: boolean; cortical: boolean }

interface Props {
  estado: Estado;
  marcas: Map<string, Marca>;
  halosMarca: Halo[];
  /** Tipos de célula marcados, como clave estable «a,b». */
  celulasMarcadas: string;
  tramoElegido: SegmentoId | null;
  senalado: Senal;
  celula: CelulaId | null;
  pieza: PiezaId | null;
  peticion: { destino: Destino; n: number } | null;
  opciones: Opciones;
  pausa: boolean;
  velocidad: number;
  reducido: boolean;
  onTramo: (id: SegmentoId) => void;
  onEntrar: (c: CelulaId) => void;
  onSalir: () => void;
  onPieza: (p: PiezaId) => void;
  onSenalar: (s: Senal) => void;
  onVecina: (c: CelulaId) => void;
  onFondo: () => void;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Flujo de la vía paracelular según lo que la impulsa en cada célula. */
function paracelular(cel: CelulaId, F: Factores) {
  switch (cel) {
    case 'gruesa': return Math.min(fx(F, cel, 'nkcc2'), fx(F, cel, 'romk'));
    case 'ascendente-delgada': return fx(F, cel, 'clck1');
    case 'principal': return Math.min(1.6, fx(F, cel, 'enac'));
    default: return fx(F, cel, 'nak');
  }
}

/** Fuerzas de Starling orientativas según la angiotensina II y el ANP. */
function starling(e: Estado) {
  const pcg = 55 + (e.niveles.angiotensina === 1 ? 4 : e.niveles.angiotensina === -1 ? -5 : 0) + (e.niveles.anp === 1 ? 3 : 0);
  return { pcg, pb: 15, pic: 30, tfg: Math.round(125 + 4 * (pcg - 55)) };
}

export default function Lienzo(p: Props) {
  const caja = useRef<HTMLDivElement>(null);
  const cvN = useRef<HTMLCanvasElement>(null);
  const cvC = useRef<HTMLCanvasElement>(null);
  const svgBase = useRef<SVGSVGElement>(null);
  const svgArriba = useRef<SVGSVGElement>(null);
  const [tam, setTam] = useState({ w: 900, h: 700 });
  const tamRef = useRef(tam);
  const props = useRef(p);
  props.current = p;

  // ── Cámara ──
  const cam = useRef<Camara>(CAM_INICIAL);
  const [camV, setCamV] = useState<Camara>(CAM_INICIAL);
  const animCam = useRef<{ desde: Camara; hasta: Camara; t0: number; dur: number } | null>(null);
  const volar = useCallback((hasta: Camara, dur = 650) => {
    if (props.current.reducido) { cam.current = hasta; setCamV(hasta); animCam.current = null; return; }
    animCam.current = { desde: cam.current, hasta, t0: performance.now(), dur };
  }, []);

  // ── Estado mostrado: se mezcla hacia el objetivo para que el cambio se vea llegar ──
  const [vis, setVis] = useState<Estado>(p.estado);
  const visRef = useRef<Estado>(p.estado);
  const mezcla = useRef<{ desde: Estado; hasta: Estado; t0: number } | null>(null);
  useEffect(() => {
    if (props.current.reducido) {
      mezcla.current = null;
      visRef.current = p.estado;
      setVis(p.estado);
      return;
    }
    mezcla.current = { desde: visRef.current, hasta: p.estado, t0: performance.now() };
  }, [p.estado]);

  // ── Capa de célula ──
  const [celVista, setCelVista] = useState<CelulaId | null>(p.celula);
  const celVistaRef = useRef<CelulaId | null>(p.celula);
  const [opCel, setOpCel] = useState(p.celula ? 1 : 0);
  const opCelRef = useRef(opCel);
  const trans = useRef<{ tipo: 'entrar' | 'salir' | 'cambiar'; t0: number; dur: number; destino: CelulaId | null; cambiado?: boolean } | null>(null);
  const ultimaCuenta = useRef<Cuenta | null>(null);
  const emisores = useRef(new Emisores());
  const celPedida = useRef<CelulaId | null>(p.celula);

  const ponerCel = (c: CelulaId | null) => { celVistaRef.current = c; setCelVista(c); emisores.current.vaciar(); };
  const ponerOp = (o: number) => { opCelRef.current = o; setOpCel(o); };

  useEffect(() => {
    const antes = celPedida.current;
    const ahora = p.celula;
    if (antes === ahora) return;
    celPedida.current = ahora;
    const t = performance.now();
    const { w, h } = tamRef.current;
    if (props.current.reducido) {
      ponerCel(ahora);
      ponerOp(ahora ? 1 : 0);
      trans.current = null;
      if (!ahora && antes) volar(limitar({ ...cam.current, z: 3.6 }, w, h), 0);
      return;
    }
    if (!antes && ahora) {
      const cu = ultimaCuenta.current?.tipo === ahora ? ultimaCuenta.current : cuentaDe(ahora);
      const obj: P = ahora === 'barrera' ? GLOMERULO.c : cu?.centro ?? [ANCHO / 2, ALTO / 2];
      volar(limitar({ cx: obj[0], cy: obj[1], z: Z_MAX }, w, h), 720);
      ponerCel(ahora);
      ponerOp(0);
      trans.current = { tipo: 'entrar', t0: t + 380, dur: 480, destino: ahora };
    } else if (antes && !ahora) {
      trans.current = { tipo: 'salir', t0: t, dur: 420, destino: null };
      const destino = antes === 'barrera' ? encuadrar(cajaGlomerulo(), w, h) : limitar({ ...cam.current, z: 3.6 }, w, h);
      animCam.current = { desde: cam.current, hasta: destino, t0: t + 150, dur: 700 };
    } else {
      trans.current = { tipo: 'cambiar', t0: t, dur: 380, destino: ahora };
    }
    ultimaCuenta.current = null;
  }, [p.celula, volar]);

  // ── Peticiones de cámara desde la barra lateral ──
  useEffect(() => {
    if (!p.peticion) return;
    const { w, h } = tamRef.current;
    const d = p.peticion.destino;
    if (d.tipo === 'inicio') volar(CAM_INICIAL);
    else if (d.id === 'glomerulo') volar(encuadrar(cajaGlomerulo(), w, h));
    else volar(encuadrar(TRAMOS_GEO[d.id].caja, w, h, 0.78));
  }, [p.peticion, volar]);

  // ── Tamaño ──
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      const t = { w: Math.max(200, r.width), h: Math.max(200, r.height) };
      tamRef.current = t;
      setTam(t);
      cam.current = limitar(cam.current, t.w, t.h);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const c of [cvN.current, cvC.current]) {
        if (!c) continue;
        c.width = Math.round(t.w * dpr);
        c.height = Math.round(t.h * dpr);
      }
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** El canvas de la célula se monta y desmonta con ella: se mide al nacer. */
  const refCanvasCelula = useCallback((el: HTMLCanvasElement | null) => {
    cvC.current = el;
    if (!el) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(tamRef.current.w * dpr);
    el.height = Math.round(tamRef.current.h * dpr);
  }, []);

  const estrecha = tam.w / tam.h < 0.95;
  const disp = useMemo(() => (celVista && celVista !== 'barrera' ? disponer(celVista, estrecha) : null), [celVista, estrecha]);
  const dispB = useMemo(() => (celVista === 'barrera' ? disponerBarrera(estrecha) : null), [celVista, estrecha]);
  const dispRef = useRef({ disp, dispB });
  dispRef.current = { disp, dispB };

  /** El viewBox de los dos SVG sale de la cámara viva, en el mismo cuadro que el
   *  canvas: si lo pusiera React (un render después) las capas se desfasarían. */
  const vbPuesto = useRef('');
  const ponerViewBox = () => {
    const { w, h } = tamRef.current;
    const vb = viewBox(cam.current, w, h);
    if (vb === vbPuesto.current) return;
    vbPuesto.current = vb;
    svgBase.current?.setAttribute('viewBox', vb);
    svgArriba.current?.setAttribute('viewBox', vb);
  };
  useLayoutEffect(() => { vbPuesto.current = ''; ponerViewBox(); });

  // ── Bucle de animación ──
  const tSim = useRef(0);
  useEffect(() => {
    let raf = 0;
    let ultimo = performance.now();
    const paso = (ahora: number) => {
      const pr = props.current;
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      const dtSim = pr.pausa || pr.reducido ? 0 : dt * pr.velocidad;
      tSim.current += dtSim;

      if (animCam.current) {
        const a = animCam.current;
        const k = clamp((ahora - a.t0) / a.dur, 0, 1);
        if (ahora >= a.t0) {
          cam.current = interpolar(a.desde, a.hasta, k);
          setCamV(cam.current);
        }
        if (k >= 1) animCam.current = null;
      }
      if (mezcla.current) {
        const m = mezcla.current;
        const k = clamp((ahora - m.t0) / 1800, 0, 1);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        visRef.current = mezclarEstado(m.desde, m.hasta, e);
        setVis(visRef.current);
        if (k >= 1) mezcla.current = null;
      }
      const tr = trans.current;
      if (tr) {
        const k = clamp((ahora - tr.t0) / tr.dur, 0, 1);
        if (tr.tipo === 'entrar') {
          if (ahora >= tr.t0) ponerOp(k);
        } else if (tr.tipo === 'salir') {
          ponerOp(1 - k);
          if (k >= 1) ponerCel(null);
        } else {
          if (k < 0.5) ponerOp(1 - 2 * k);
          else {
            if (!tr.cambiado) { tr.cambiado = true; ponerCel(tr.destino); }
            ponerOp(2 * k - 1);
          }
        }
        if (k >= 1) trans.current = null;
      }
      dibujar(dtSim);
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dibujar(dtSim: number) {
    const pr = props.current;
    const { w, h } = tamRef.current;
    ponerViewBox();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const est = visRef.current;
    const perfil = est.perfil;

    // Nefrón: filtrado y partículas.
    const cn = cvN.current;
    const ctx = cn?.getContext('2d');
    if (cn && ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cn.width, cn.height);
      if (opCelRef.current < 0.99) {
        const c = cam.current;
        const s = escala(c, w, h);
        ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (w / 2 - c.cx * s), dpr * (h / 2 - c.cy * s));
        const vx0 = c.cx - w / (2 * s) - 30; const vx1 = c.cx + w / (2 * s) + 30;
        const vy0 = c.cy - h / (2 * s) - 30; const vy1 = c.cy + h / (2 * s) + 30;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        TRAMOS.forEach((id, i) => {
          const t = TRAMOS_GEO[id];
          if (t.caja.x1 < vx0 || t.caja.x0 > vx1 || t.caja.y1 < vy0 || t.caja.y0 > vy1) return;
          const ms = t.muestras;
          for (let k = 0; k < ms.length - 1; k += 5) {
            const k2 = Math.min(ms.length - 1, k + 6);
            const u = (k + k2) / 2 / (ms.length - 1);
            const vol = perfil.vol[i] + (perfil.vol[i + 1] - perfil.vol[i]) * u;
            const o = perfil.osm[i] + (perfil.osm[i + 1] - perfil.osm[i]) * u;
            ctx.strokeStyle = colorOsm(o, 0.62);
            ctx.lineWidth = t.luz * clamp(Math.sqrt(vol / 100) * 1.5, 0.22, 0.9);
            ctx.beginPath();
            ctx.moveTo(ms[k].p[0], ms[k].p[1]);
            for (let j = k + 1; j <= k2; j++) ctx.lineTo(ms[j].p[0], ms[j].p[1]);
            ctx.stroke();
          }
        });
        if (pr.opciones.particulas) {
          // Visibles de lejos, con su símbolo de cerca.
          const r = clamp(3.2 / s, 2.4, 4.2);
          const texto = r * s >= 8.5;
          for (const q of PARTICULAS_RUTA) {
            const d = enLaRuta(q, tSim.current, perfil);
            if (!d || d.x < vx0 || d.x > vx1 || d.y < vy0 || d.y > vy1) continue;
            burbuja(ctx, d.x, d.y, r, q.s, d.alfa * (q.s === 'agua' ? 0.85 : 1), texto);
          }
        }
      }
    }

    // Célula: corrientes y glóbulos rojos.
    const cc = cvC.current;
    const cx2 = cc?.getContext('2d');
    if (cc && cx2) {
      cx2.setTransform(1, 0, 0, 1, 0, 0);
      cx2.clearRect(0, 0, cc.width, cc.height);
      const { disp: d, dispB: db } = dispRef.current;
      const cel = celVistaRef.current;
      const L = d ?? db;
      if (cel && L && opCelRef.current > 0.01) {
        const sc = Math.min(w / L.W, h / L.H);
        const ox = (w - L.W * sc) / 2;
        const oy = (h - L.H * sc) / 2;
        cx2.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy);
        const cap = d ? d.capilar : db!.capilar;
        const yc = d ? (cap.y0 + cap.y1) / 2 : cap.y1 * 0.45;
        const tramoW = L.W + 140;
        // Glóbulos rojos como en la referencia: rosquillas rojas y magenta, algunas de canto.
        for (let k = 0; k < 9; k++) {
          const x = ((tSim.current * 60 + (k * tramoW) / 9) % tramoW) - 70;
          const y = yc + ((k % 3) - 1) * (d ? 26 : 60) + (k % 2 ? 6 : -4);
          globuloRojo(cx2, x, y, d ? 24 : 30, k);
        }
        const corrientes = d ? d.corrientes : db!.corrientes;
        const F = visRef.current.factores;
        const flujo = (c: { t: TransportadorId | null }) => (cel === 'barrera' ? 1 : c.t ? fx(F, cel, c.t) : paracelular(cel, F));
        if (pr.reducido) {
          // Movimiento reducido: flechas fijas en lugar de partículas.
          for (const c of corrientes) {
            const f = Math.min(1, flujo(c));
            if (f < 0.05) continue;
            cx2.globalAlpha = 0.35 + 0.5 * f;
            cx2.strokeStyle = SUSTANCIAS[c.s].color;
            cx2.lineWidth = 4;
            cx2.setLineDash([10, 8]);
            cx2.beginPath();
            cx2.moveTo(c.ruta[0][0], c.ruta[0][1]);
            for (const q of c.ruta.slice(1)) cx2.lineTo(q[0], q[1]);
            cx2.stroke();
            cx2.setLineDash([]);
            const a = c.ruta[c.ruta.length - 2];
            const b = c.ruta[c.ruta.length - 1];
            const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
            cx2.fillStyle = cx2.strokeStyle;
            cx2.beginPath();
            cx2.moveTo(b[0], b[1]);
            cx2.lineTo(b[0] - 14 * Math.cos(ang - 0.45), b[1] - 14 * Math.sin(ang - 0.45));
            cx2.lineTo(b[0] - 14 * Math.cos(ang + 0.45), b[1] - 14 * Math.sin(ang + 0.45));
            cx2.fill();
            cx2.globalAlpha = 1;
          }
        } else {
          emisores.current.avanzar(corrientes, dtSim, flujo);
          const r = L.estrecha ? 15 : 13;
          emisores.current.cada(corrientes, (c, q, alfa) => {
            burbuja(cx2, q[0], q[1], c.s === 'albumina' ? r * 1.5 : r, c.s, alfa, true);
          });
        }
      }
    }
  }

  // ── Gestos ──
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const gesto = useRef<{ tipo: 'nada' | 'arrastre' | 'pinza'; x0: number; y0: number; cam0: Camara; d0: number; movido: boolean }>({
    tipo: 'nada', x0: 0, y0: 0, cam0: CAM_INICIAL, d0: 1, movido: false,
  });
  const suprimir = useRef(false);
  const enCelula = () => opCelRef.current >= 0.5 || !!props.current.celula;

  const local = (e: { clientX: number; clientY: number }) => {
    const r = caja.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /** La célula más cercana a un punto del lienzo (o la barrera si es el glomérulo). */
  const cuentaCerca = (q: P): Cuenta | 'barrera' | null => {
    if (Math.hypot(q[0] - GLOMERULO.c[0], q[1] - GLOMERULO.c[1]) < GLOMERULO.r) return 'barrera';
    let mejor: Cuenta | null = null;
    let dm = 36;
    for (const id of TRAMOS) {
      const cj = TRAMOS_GEO[id].caja;
      if (q[0] < cj.x0 || q[0] > cj.x1 || q[1] < cj.y0 || q[1] > cj.y1) continue;
      for (const c of CUENTAS[id]) {
        const d = Math.hypot(c.centro[0] - q[0], c.centro[1] - q[1]);
        if (d < dm) { dm = d; mejor = c; }
      }
    }
    return mejor;
  };

  const entrarEn = (c: Cuenta | 'barrera') => {
    if (c === 'barrera') { props.current.onEntrar('barrera'); return; }
    ultimaCuenta.current = c;
    props.current.onEntrar(c.tipo);
  };

  const onPointerDown = (e: RPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const q = local(e);
    ptrs.current.set(e.pointerId, q);
    const ps = [...ptrs.current.values()];
    if (ps.length === 1) gesto.current = { tipo: 'arrastre', x0: q.x, y0: q.y, cam0: cam.current, d0: 1, movido: false };
    else if (ps.length === 2) {
      gesto.current = {
        tipo: 'pinza', x0: (ps[0].x + ps[1].x) / 2, y0: (ps[0].y + ps[1].y) / 2, cam0: cam.current,
        d0: Math.max(10, Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y)), movido: true,
      };
    }
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (!ptrs.current.has(e.pointerId)) return;
    const q = local(e);
    ptrs.current.set(e.pointerId, q);
    const g = gesto.current;
    const { w, h } = tamRef.current;
    if (g.tipo === 'arrastre') {
      const dx = q.x - g.x0;
      const dy = q.y - g.y0;
      if (!g.movido && Math.hypot(dx, dy) > 5) {
        g.movido = true;
        animCam.current = null;
        try { caja.current?.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      if (g.movido && !enCelula()) {
        const s = escala(g.cam0, w, h);
        cam.current = limitar({ ...g.cam0, cx: g.cam0.cx - dx / s, cy: g.cam0.cy - dy / s }, w, h);
        setCamV(cam.current);
      }
    } else if (g.tipo === 'pinza') {
      const ps = [...ptrs.current.values()];
      if (ps.length < 2) return;
      const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      const f = d / g.d0;
      if (enCelula()) {
        if (f < 0.62 && props.current.celula) { gesto.current.tipo = 'nada'; props.current.onSalir(); }
        return;
      }
      animCam.current = null;
      cam.current = zoomEn(g.cam0, w, h, g.x0, g.y0, f);
      setCamV(cam.current);
    }
  };
  const onPointerUp = (e: RPointerEvent) => {
    ptrs.current.delete(e.pointerId);
    if (gesto.current.movido) {
      suprimir.current = true;
      window.setTimeout(() => { suprimir.current = false; }, 0);
    }
    if (ptrs.current.size === 0) gesto.current.tipo = 'nada';
    else if (ptrs.current.size === 1) {
      const [q] = [...ptrs.current.values()];
      gesto.current = { tipo: 'arrastre', x0: q.x, y0: q.y, cam0: cam.current, d0: 1, movido: true };
    }
  };

  // Rueda: acerca o aleja en el punto; al tope del zoom entra en la célula de debajo.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let acumEntrar = 0;
    let acumSalir = 0;
    const rueda = (e: WheelEvent) => {
      e.preventDefault();
      const q = local(e);
      const { w, h } = tamRef.current;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      if (enCelula()) {
        if (dy > 0) {
          acumSalir += dy;
          if (acumSalir > 240 && props.current.celula) { acumSalir = 0; props.current.onSalir(); }
        } else acumSalir = 0;
        return;
      }
      acumSalir = 0;
      if (dy < 0 && cam.current.z >= Z_MAX * 0.98) {
        acumEntrar += -dy;
        if (acumEntrar > 160) {
          acumEntrar = 0;
          const c = cuentaCerca(aMundo(cam.current, w, h, q.x, q.y));
          if (c) entrarEn(c);
        }
        return;
      }
      acumEntrar = 0;
      animCam.current = null;
      cam.current = zoomEn(cam.current, w, h, q.x, q.y, Math.exp(-dy * 0.0017));
      setCamV(cam.current);
    };
    el.addEventListener('wheel', rueda, { passive: false });
    return () => el.removeEventListener('wheel', rueda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDoubleClick = (e: RMouseEvent) => {
    if (enCelula()) return;
    const q = local(e);
    const { w, h } = tamRef.current;
    if (cam.current.z >= Z_MAX * 0.9) {
      const c = cuentaCerca(aMundo(cam.current, w, h, q.x, q.y));
      if (c) entrarEn(c);
      return;
    }
    volar(zoomEn(cam.current, w, h, q.x, q.y, 2.2), 380);
  };

  // ── Derivados para pintar ──
  const { w, h } = tam;
  const s = escala(camV, w, h);
  const lod = camV.z >= Z_DETALLE ? 2 : camV.z >= Z_CELULAS ? 1 : 0;
  const vx0 = camV.cx - w / (2 * s); const vx1 = camV.cx + w / (2 * s);
  const vy0 = camV.cy - h / (2 * s); const vy1 = camV.cy + h / (2 * s);
  const visibles = lod >= 1
    ? TRAMOS.filter((id) => { const c = TRAMOS_GEO[id].caja; return !(c.x1 < vx0 || c.x0 > vx1 || c.y1 < vy0 || c.y0 > vy1); })
    : [];
  const claveVisibles = visibles.join('|');

  const senTramo = p.senalado?.kind === 'tramo' ? p.senalado.id : null;
  const halos = useMemo<Halo[]>(() => {
    const out: Halo[] = [...p.halosMarca];
    if (senTramo && senTramo !== p.tramoElegido) out.push({ tramo: senTramo, color: '#3b9edd', fuerte: false });
    if (p.tramoElegido) out.push({ tramo: p.tramoElegido, color: '#3b9edd', fuerte: true });
    return out;
  }, [p.halosMarca, p.tramoElegido, senTramo]);

  // Rótulos de tamaño constante en pantalla (en u del lienzo dependen del zoom).
  const fs = 13 / s;
  const fsZona = 11.5 / s;
  // En el teléfono el dibujo es chico: etiquetas más pequeñas para que no lo tapen.
  const tamEtiqueta = w < 700 ? 0.74 : 0.9;
  const elegidaCel = p.senalado?.kind === 'celula' ? p.senalado.id : null;

  const cuentaClick = useCallback((c: Cuenta) => {
    if (suprimir.current) return;
    entrarEn(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const senalarCelula = useCallback((c: CelulaId | null) => props.current.onSenalar(c ? { kind: 'celula', id: c } : null), []);
  const senalarPieza = useCallback((t: PiezaId | null) => props.current.onSenalar(t ? { kind: 'pieza', id: t } : null), []);
  const elegirPieza = useCallback((t: PiezaId) => props.current.onPieza(t), []);
  const vecina = useCallback((c: CelulaId) => props.current.onVecina(c), []);

  const cuentasCapa = useMemo(() => (
    claveVisibles ? claveVisibles.split('|').map((id) => (
      <CuentasTramo
        key={id}
        tramo={id as TramoId}
        detalle={lod >= 2}
        marcadas={p.celulasMarcadas}
        elegida={elegidaCel}
        onCuenta={cuentaClick}
        onSenalar={senalarCelula}
      />
    )) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [claveVisibles, lod >= 2, p.celulasMarcadas, elegidaCel, cuentaClick, senalarCelula]);

  const celula = celVista;
  const pantallaNefron = opCel < 0.5;

  return (
    <div
      ref={caja}
      className={nf.lienzo}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={(e) => { if (suprimir.current) { e.stopPropagation(); e.preventDefault(); } }}
      onClick={() => p.onFondo()}
      onDoubleClick={onDoubleClick}
    >
      {/* ── Capa del nefrón ── */}
      <div className={nf.capa} style={{ opacity: 1 - opCel, pointerEvents: pantallaNefron ? 'auto' : 'none', visibility: opCel >= 0.999 ? 'hidden' : 'visible' }}>
        <svg ref={svgBase} className={nf.svg} preserveAspectRatio="xMidYMid meet" aria-hidden>
          <NefronBase
            osmPunta={Math.round(p.estado.perfil.osmPunta / 20) * 20}
            vasos={p.opciones.vasos}
            cortical={p.opciones.cortical}
            gradiente={p.opciones.gradiente}
            halos={halos}
          />
          {cuentasCapa}
        </svg>
        <canvas ref={cvN} className={nf.canvas} />
        <svg ref={svgArriba} className={`${nf.svg} ${nf.svgArriba}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Nefrón: toca un segmento o acerca hasta sus células">
          {/* Áreas de toque de los tramos (solo sin células a la vista) */}
          {lod === 0 && TRAMOS.map((id) => (
            <polyline
              key={id}
              className={nf.toca}
              points={TRAMOS_GEO[id].muestras.map((m) => `${m.p[0].toFixed(0)},${m.p[1].toFixed(0)}`).join(' ')}
              fill="none"
              stroke="transparent"
              strokeWidth={TRAMOS_GEO[id].ancho + 16}
              strokeLinecap="round"
              onClick={(e) => {
                e.stopPropagation();
                if (suprimir.current) return;
                p.onTramo(id);
                volar(encuadrar(TRAMOS_GEO[id].caja, w, h, 0.78));
              }}
              onPointerEnter={() => p.onSenalar({ kind: 'tramo', id })}
              onPointerLeave={() => p.onSenalar(null)}
            />
          ))}
          <circle
            className={nf.tocaArea}
            cx={GLOMERULO.c[0]} cy={GLOMERULO.c[1]} r={GLOMERULO.r + 6}
            fill="transparent"
            onClick={(e) => {
              e.stopPropagation();
              if (suprimir.current) return;
              if (lod >= 1) { props.current.onEntrar('barrera'); return; }
              p.onTramo('glomerulo');
              volar(encuadrar(cajaGlomerulo(), w, h));
            }}
            onPointerEnter={() => p.onSenalar({ kind: 'tramo', id: 'glomerulo' })}
            onPointerLeave={() => p.onSenalar(null)}
          />

          {/* Zonas, siempre pegadas al borde izquierdo de la vista */}
          <g className={nf.tZona} fontSize={fsZona}>
            {[
              ['Corteza', (Math.max(vy0, 0) + Math.min(vy1, ZONAS.corticomedular)) / 2, vy1 > 0 && vy0 < ZONAS.corticomedular],
              ['Médula externa', (Math.max(vy0, ZONAS.corticomedular) + Math.min(vy1, ZONAS.medulaInterna)) / 2, vy1 > ZONAS.corticomedular && vy0 < ZONAS.medulaInterna],
              ['Médula interna', (Math.max(vy0, ZONAS.medulaInterna) + Math.min(vy1, ZONAS.papila)) / 2, vy1 > ZONAS.medulaInterna && vy0 < ZONAS.papila],
            ].filter(([, , ver]) => ver).map(([t, y]) => (
              <text key={t as string} x={Math.max(vx0 + 12 / s, -180)} y={y as number} className={`${nf.tZona} ${nf.halo}`} strokeWidth={3 / s}>{t as string}</text>
            ))}
          </g>

          {/* Nombres de los segmentos: etiquetas de color sólido, sin más texto */}
          {p.opciones.etiquetas && (
            <g>
              {TRAMOS.map((id) => {
                const r = TRAMOS_GEO[id].rotulo;
                return (
                  <Etiqueta key={id} x={r.p[0]} y={r.p[1] - fs * 0.35} texto={SEGMENTOS[id].corto} tam={fs * tamEtiqueta} color={sombra(SEGMENTOS[id].color)} ancla={r.ancla} />
                );
              })}
              <Etiqueta x={GLOMERULO.c[0] - GLOMERULO.r - 10} y={GLOMERULO.c[1]} texto="Glomérulo" tam={fs * tamEtiqueta} color={sombra(ARTERIA)} ancla="end" />
            </g>
          )}
        </svg>
      </div>

      {/* ── Capa de la célula ── */}
      {celula && (
        <div
          className={nf.capa}
          style={{
            opacity: opCel,
            transform: `scale(${0.3 + 0.7 * opCel})`,
            transformOrigin: '50% 50%',
            pointerEvents: pantallaNefron ? 'none' : 'auto',
          }}
        >
          <svg className={nf.svg} viewBox={`0 0 ${(disp ?? dispB)!.W} ${(disp ?? dispB)!.H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Pared de ${CELULAS[celula].nombre}`}>
            {disp && (
              <EscenaCelula
                celula={celula}
                d={disp}
                factores={vis.factores}
                marcas={p.marcas}
                elegido={p.pieza}
                senalado={p.senalado?.kind === 'pieza' ? p.senalado.id : null}
                onElegir={elegirPieza}
                onSenalar={senalarPieza}
                onVecina={vecina}
              />
            )}
            {dispB && (
              <EscenaBarrera
                d={dispB}
                elegido={p.pieza && esCapa(p.pieza) ? p.pieza : null}
                senalado={p.senalado?.kind === 'pieza' ? p.senalado.id : null}
                onElegir={elegirPieza}
                onSenalar={senalarPieza}
                tfg={starling(vis)}
              />
            )}
          </svg>
          <canvas ref={refCanvasCelula} className={nf.canvas} />
        </div>
      )}
    </div>
  );
}
