'use client';
// Laboratorio «Vías de la coagulación». Sin cabecera: lo primero que se ve es
// el lienzo cuadriculado con la cascada entera.
//
// Reparto del trabajo:
// - React pinta QUÉ hay (nodos, hilos, zonas, qué está visible, qué resalta).
// - Un bucle rAF escribe DÓNDE está (transform de los nodos, `d` de los hilos,
//   cajas de las zonas) directo en el DOM. Arrastrar un factor o dejar que un
//   hilo vibre no re-renderiza nada. Por eso los <path> no reciben `d` por
//   props: React lo pisaría en el siguiente render.
// - La cámara vive en `useCamara`, con el mismo criterio.

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AVISOS, HILOS, HILO_POR_ID, NODOS, NODO_POR_ID, VIAS, ZONAS,
  barajar, distractores, hiloDestino, respuestaCorrecta, textoFicha,
  type Aviso, type Hilo, type TipoHilo, type Via,
} from '@/lib/data/coagulacion';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useCamara } from './useCamara';
import {
  bezier, bordeHacia, grosor, objetivoControl, pasoMuelle, trazo,
  type Caja, type Muelle, type Pt,
} from './hilos';
import NodoFactor, { type EstadoNodo } from './NodoFactor';
import { GloboAviso, TarjetaAviso } from './Aviso';
import {
  BandejaFichas, CampoEscribir, CierreVia, HudAprender, SelectorVias,
  type Dificultad, type Ficha, type Progreso,
} from './Aprender';
import s from '@/styles/cascadaCoagulacion.module.css';

const CLAVE_LAYOUT = 'medgo-coag-layout-v1';
const CLAVE_PROGRESO = 'medgo-coag-progreso-v1';
const CLAVE_AVISOS = 'medgo-coag-avisos-v1';
const CLAVE_DIFICULTAD = 'medgo-coag-dificultad';

const GROSOR: Record<TipoHilo, number> = {
  convierte: 2.2, activa: 1.9, discontinua: 1.7, trombina: 1.9, inhibe: 1.9, estimula: 1.9,
};

const ORDEN: Record<string, number> = Object.fromEntries(NODOS.map((n, i) => [n.id, i]));
const AVISO_DE: Record<string, Aviso> = Object.fromEntries(AVISOS.map((a) => [a.ancla, a]));
const DEF: Record<string, Pt> = Object.fromEntries(NODOS.map((n) => [n.id, { x: n.x, y: n.y }]));

// Los hilos que llegan a otra flecha necesitan su curva ya calculada: van después.
const HILOS_ORDENADOS = [
  ...HILOS.filter((h) => !hiloDestino(h.a)),
  ...HILOS.filter((h) => hiloDestino(h.a)),
];

/** Largo de cada hilo en la lámina: la referencia para saber si está tenso o flojo. */
const REPOSO: Record<string, number> = (() => {
  const r: Record<string, number> = {};
  for (const h of HILOS) {
    const a = DEF[h.de];
    const d = hiloDestino(h.a);
    let b: Pt;
    if (d) {
      const t = HILO_POR_ID[d];
      b = { x: (DEF[t.de].x + DEF[t.a].x) / 2, y: (DEF[t.de].y + DEF[t.a].y) / 2 };
    } else b = DEF[h.a];
    r[h.id] = Math.hypot(b.x - a.x, b.y - a.y);
  }
  return r;
})();

/** Cadena aguas abajo de un nodo: lo que se enciende al pasar el cursor. */
function cadenaDe(id: string) {
  const nodos = new Set<string>([id]);
  const hilos = new Set<string>();
  const cola = [id];
  const PROPAGA: TipoHilo[] = ['convierte', 'activa', 'discontinua'];
  while (cola.length) {
    const u = cola.shift()!;
    for (const h of HILOS) {
      if (h.de !== u) continue;
      const directo = u === id; // desde el propio nodo, también sus ⊖, ⊕ y grises
      if (!PROPAGA.includes(h.tipo) && !directo) continue;
      hilos.add(h.id);
      const d = hiloDestino(h.a);
      const siguiente = d ? HILO_POR_ID[d].a : h.a;
      if (d) hilos.add(d);
      if (!nodos.has(siguiente)) {
        nodos.add(siguiente);
        if (PROPAGA.includes(h.tipo)) cola.push(siguiente);
      }
    }
  }
  return { nodos, hilos };
}

type Vis = Record<string, EstadoNodo>;
type Destino = { tipo: 'nodo'; id: string } | { tipo: 'hilo'; id: string };

/**
 * A dónde llega un hilo según lo que esté visible. Si apunta a una flecha que
 * aún no existe (le falta un extremo) sólo se admite caer sobre el HUECO: así el
 * hilo fantasma del modo aprender dice «esto viene de aquí» sin inventar
 * relaciones con nodos visibles que no son su destino.
 */
function destinoDe(h: Hilo, vis: Vis): Destino | null {
  const d = hiloDestino(h.a);
  if (!d) return vis[h.a] !== 'off' ? { tipo: 'nodo', id: h.a } : null;
  const t = HILO_POR_ID[d];
  const a = vis[t.de] !== 'off';
  const b = vis[t.a] !== 'off';
  if (a && b) return { tipo: 'hilo', id: d };
  if (b && vis[t.a] === 'blank') return { tipo: 'nodo', id: t.a };
  if (a && vis[t.de] === 'blank') return { tipo: 'nodo', id: t.de };
  return null;
}

function esFantasma(h: Hilo, dest: Destino, vis: Vis) {
  if (vis[h.de] === 'blank') return true;
  if (dest.tipo === 'nodo') return vis[dest.id] === 'blank';
  const t = HILO_POR_ID[dest.id];
  return vis[t.de] === 'blank' || vis[t.a] === 'blank';
}

function leer<T>(clave: string, def: T): T {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
}
function escribir(clave: string, v: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(v));
  } catch { /* modo privado / cuota */ }
}

type Mensaje = { tipo: 'mal' | 'regalo'; texto: string; key: number };
interface Juego {
  fase: 'selector' | 'jugando' | 'fin';
  via: Via | null;
  paso: number;
  errores: number;
  fallosPaso: number;
  regalados: string[];
  descartadas: string[];
  sacudida: number;
  recien: string | null;
  mensaje: Mensaje | null;
}
const JUEGO_INICIAL: Juego = {
  fase: 'selector', via: null, paso: 0, errores: 0, fallosPaso: 0,
  regalados: [], descartadas: [], sacudida: 0, recien: null, mensaje: null,
};

const ALTO_BANDEJA = 190;
const ALTO_HUD = 76;

export default function CascadaLab() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  // ─── Estado de posición (fuera de React) ───────────────────────────────────
  const pos = useRef<Record<string, Pt> | null>(null);
  if (pos.current === null) {
    const guardado = leer<Record<string, Pt>>(CLAVE_LAYOUT, {});
    pos.current = Object.fromEntries(
      NODOS.map((n) => {
        const g = guardado[n.id];
        return [n.id, g && Number.isFinite(g.x) && Number.isFinite(g.y) ? { x: g.x, y: g.y } : { ...DEF[n.id] }];
      }),
    );
  }
  const tam = useRef<Record<string, { w: number; h: number }>>({});
  const elNodo = useRef<Record<string, HTMLDivElement>>({});
  const elHilo = useRef<Record<string, SVGPathElement>>({});
  const elSigno = useRef<Record<string, SVGGElement>>({});
  const elZona = useRef<Record<string, { rect: SVGRectElement | null; text: SVGTextElement | null }>>({});
  const muelles = useRef<Record<string, Muelle>>({});
  const destinos = useRef(new Map<string, Pt>());
  const arrastre = useRef<{ id: string; movido: boolean } | null>(null);
  const raf = useRef(0);
  const reducido = useRef(false);

  // ─── Estado de React ───────────────────────────────────────────────────────
  const [modo, setModo] = useState<'explorar' | 'aprender'>('explorar');
  const [juego, setJuego] = useState<Juego>(JUEGO_INICIAL);
  const [dificultad, setDificultad] = useState<Dificultad>(() => leer<Dificultad>(CLAVE_DIFICULTAD, 'fichas'));
  const [progreso, setProgreso] = useState<Progreso>(() => leer<Progreso>(CLAVE_PROGRESO, {}));
  const [focoHover, setFocoHover] = useState<string | null>(null);
  const [focoFijo, setFocoFijo] = useState<string | null>(null);
  const [globo, setGlobo] = useState<{ aviso: Aviso; rect: DOMRect } | null>(null);
  const [tarjeta, setTarjeta] = useState<{ aviso: Aviso; rect: DOMRect } | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(() => new Set(leer<string[]>(CLAVE_AVISOS, [])));
  const [leyenda, setLeyenda] = useState(true);
  // Sólo durante la primera carga la cascada entra escalonada (factor a factor,
  // en orden de activación). Después, un nodo que aparece no espera su turno.
  const [arranque, setArranque] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setArranque(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const flotantesRef = useRef(false);
  flotantesRef.current = !!(globo || tarjeta);

  // Al mover la cámara los globos quedarían flotando lejos de su baliza.
  const alMoverCamara = useCallback(() => {
    if (flotantesRef.current) {
      flotantesRef.current = false;
      setGlobo(null);
      setTarjeta(null);
    }
  }, []);
  const camara = useCamara(viewportRef, worldRef, alMoverCamara);

  // ─── Visibilidad ───────────────────────────────────────────────────────────
  const jugando = modo === 'aprender' && juego.fase !== 'selector' && juego.via !== null;
  const vis: Vis = useMemo(() => {
    const v: Vis = {};
    if (!jugando || !juego.via) {
      for (const n of NODOS) v[n.id] = 'on';
      return v;
    }
    for (const n of NODOS) v[n.id] = 'off';
    const via = juego.via;
    for (const id of via.semilla) v[id] = 'on';
    const hasta = juego.fase === 'fin' ? via.pasos.length : juego.paso;
    via.pasos.slice(0, hasta).forEach((p) => { v[p.nodo] = 'on'; });
    if (juego.fase === 'jugando') v[via.pasos[juego.paso].nodo] = 'blank';
    return v;
  }, [jugando, juego.via, juego.paso, juego.fase]);
  const visRef = useRef(vis);
  visRef.current = vis;

  const hilosVisibles = useMemo(() => {
    const r: { h: Hilo; fantasma: boolean }[] = [];
    for (const h of HILOS_ORDENADOS) {
      if (vis[h.de] === 'off') continue;
      const d = destinoDe(h, vis);
      if (!d) continue;
      r.push({ h, fantasma: esFantasma(h, d, vis) });
    }
    return r;
  }, [vis]);

  const foco = focoHover ?? focoFijo;
  const cadena = useMemo(() => (foco ? cadenaDe(foco) : null), [foco]);

  // ─── Bucle de simulación ───────────────────────────────────────────────────
  const escribirNodo = (id: string) => {
    const el = elNodo.current[id];
    const p = pos.current![id];
    if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
  };

  const cajaDe = (id: string): Caja => {
    const p = pos.current![id];
    const t = tam.current[id] ?? { w: 60, h: 34 };
    return { x: p.x, y: p.y, w: t.w, h: t.h };
  };

  const simular = useCallback((): boolean => {
    let vivo = false;
    const P = pos.current!;
    const V = visRef.current;

    // 1) «Reordenar»: los nodos vuelven a la lámina deslizándose.
    for (const [id, d] of destinos.current) {
      const p = P[id];
      p.x += (d.x - p.x) * 0.16;
      p.y += (d.y - p.y) * 0.16;
      if (Math.abs(d.x - p.x) < 0.3 && Math.abs(d.y - p.y) < 0.3) {
        p.x = d.x;
        p.y = d.y;
        destinos.current.delete(id);
      } else vivo = true;
      escribirNodo(id);
    }

    // 2) Hilos: primero los nodo→nodo, luego los que llegan a otra flecha.
    const curvas: Record<string, { p0: Pt; c: Pt; p2: Pt }> = {};
    for (const h of HILOS_ORDENADOS) {
      const path = elHilo.current[h.id];
      if (!path || V[h.de] === 'off') continue;
      const dest = destinoDe(h, V);
      if (!dest) continue;
      const cajaA = cajaDe(h.de);
      let cajaB: Caja | null = null;
      let fin: Pt;
      if (dest.tipo === 'nodo') {
        cajaB = cajaDe(dest.id);
        fin = { x: cajaB.x, y: cajaB.y };
      } else {
        const cv = curvas[dest.id];
        if (!cv) continue;
        fin = bezier(cv.p0, cv.c, cv.p2, 0.5);
      }
      let m = muelles.current[h.id];
      if (!m) m = muelles.current[h.id] = { cx: 0, cy: 0, vx: 0, vy: 0, reposo: REPOSO[h.id], vivo: false };
      const obj = objetivoControl(cajaA, fin, m.reposo);
      if (pasoMuelle(m, obj, reducido.current)) vivo = true;
      const c = { x: m.cx, y: m.cy };
      const p0 = bordeHacia(cajaA, c, 4);
      let p2: Pt;
      if (cajaB) p2 = bordeHacia(cajaB, c, h.tipo === 'inhibe' || h.tipo === 'estimula' ? 5 : 6);
      else {
        // Llega a la mitad de otra flecha: se detiene 3 px antes para que la
        // punta toque la línea sin taparla.
        const dx = fin.x - c.x;
        const dy = fin.y - c.y;
        const l = Math.hypot(dx, dy) || 1;
        p2 = { x: fin.x - (dx / l) * 3, y: fin.y - (dy / l) * 3 };
      }
      curvas[h.id] = { p0, c, p2 };
      path.setAttribute('d', trazo(p0, c, p2));
      const largo = Math.hypot(fin.x - cajaA.x, fin.y - cajaA.y);
      path.style.strokeWidth = grosor(GROSOR[h.tipo], largo, m.reposo).toFixed(2);
      const signo = elSigno.current[h.id];
      if (signo) {
        const q = bezier(p0, c, p2, 0.78);
        signo.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
      }
    }

    // 3) Zonas: la caja de sus nodos visibles, así acompañan al arrastrar.
    for (const z of ZONAS) {
      const el = elZona.current[z.id];
      if (!el?.rect) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const n of NODOS) {
        if (n.zona !== z.id || V[n.id] === 'off') continue;
        const b = cajaDe(n.id);
        x0 = Math.min(x0, b.x - b.w / 2);
        y0 = Math.min(y0, b.y - b.h / 2);
        x1 = Math.max(x1, b.x + b.w / 2);
        y1 = Math.max(y1, b.y + b.h / 2);
      }
      if (x0 === Infinity) {
        el.rect.setAttribute('width', '0');
        el.text?.setAttribute('opacity', '0');
        continue;
      }
      const PAD = 30;
      const rx = x0 - PAD;
      const ry = y0 - PAD - 30;
      el.rect.setAttribute('x', rx.toFixed(1));
      el.rect.setAttribute('y', ry.toFixed(1));
      el.rect.setAttribute('width', (x1 - x0 + PAD * 2).toFixed(1));
      el.rect.setAttribute('height', (y1 - y0 + PAD * 2 + 30).toFixed(1));
      if (el.text) {
        el.text.setAttribute('x', (rx + 16).toFixed(1));
        el.text.setAttribute('y', (ry + 24).toFixed(1));
        el.text.setAttribute('opacity', '1');
      }
    }

    return vivo || arrastre.current !== null;
  }, []);

  const bucle = useCallback(() => {
    raf.current = 0;
    if (simular()) raf.current = requestAnimationFrame(bucle);
  }, [simular]);
  const despertar = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(bucle);
  }, [bucle]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const medir = useCallback(() => {
    for (const [id, el] of Object.entries(elNodo.current)) {
      tam.current[id] = { w: el.offsetWidth, h: el.offsetHeight };
    }
  }, []);

  const cajaTotal = useCallback((ids: string[]) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const id of ids) {
      const b = cajaDe(id);
      x0 = Math.min(x0, b.x - b.w / 2);
      y0 = Math.min(y0, b.y - b.h / 2);
      x1 = Math.max(x1, b.x + b.w / 2);
      y1 = Math.max(y1, b.y + b.h / 2);
    }
    return { x: x0, y: y0 - 30, w: x1 - x0, h: y1 - y0 + 30 };
  }, []);

  // Tras cada cambio de visibilidad: medir (el hueco no mide lo que el nodo) y
  // dibujar ya, en el mismo frame, para que ningún hilo nuevo aparezca sin `d`.
  useLayoutEffect(() => {
    medir();
    simular();
    despertar();
  }, [vis, medir, simular, despertar]);

  // Arranque: encuadre de toda la cascada sin animación.
  useLayoutEffect(() => {
    reducido.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.innerWidth < 760) setLeyenda(false);
    medir();
    simular();
    camara.encuadrar(cajaTotal(NODOS.map((n) => n.id)), { ms: 0, margen: 40 });
    // Con la fuente definitiva cambian los anchos: re-medir y redibujar.
    document.fonts?.ready.then(() => {
      medir();
      despertar();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Arrastre de nodos ─────────────────────────────────────────────────────
  const onPointerDownNodo = useCallback((e: React.PointerEvent<HTMLDivElement>, id: string) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch { /* ya liberado */ }
    const sx = e.clientX;
    const sy = e.clientY;
    const o = { ...pos.current![id] };
    arrastre.current = { id, movido: false };
    destinos.current.delete(id);

    const mover = (ev: PointerEvent) => {
      const a = arrastre.current;
      if (!a) return;
      const k = camara.cam.current.k;
      const dx = (ev.clientX - sx) / k;
      const dy = (ev.clientY - sy) / k;
      if (!a.movido) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
        a.movido = true;
        el.classList.add(s.agarrado);
        setGlobo(null);
        setTarjeta(null);
      }
      pos.current![id] = { x: o.x + dx, y: o.y + dy };
      escribirNodo(id);
      despertar();
    };
    const soltar = () => {
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerup', soltar);
      el.removeEventListener('pointercancel', soltar);
      el.classList.remove(s.agarrado);
      const a = arrastre.current;
      arrastre.current = null;
      if (a?.movido) {
        const cambiados: Record<string, Pt> = {};
        for (const n of NODOS) {
          const p = pos.current![n.id];
          if (p.x !== DEF[n.id].x || p.y !== DEF[n.id].y) cambiados[n.id] = p;
        }
        escribir(CLAVE_LAYOUT, cambiados);
      } else {
        // Un toque sin arrastre fija/suelta el resaltado de su cadena (en
        // táctil no hay hover).
        setFocoFijo((f) => (f === id ? null : id));
      }
      despertar();
    };
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerup', soltar);
    el.addEventListener('pointercancel', soltar);
  }, [camara.cam, despertar]);

  const registrar = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) elNodo.current[id] = el;
    else delete elNodo.current[id];
  }, []);

  const onFoco = useCallback((id: string | null) => {
    if (arrastre.current) return;
    setFocoHover(id);
  }, []);

  const reordenar = () => {
    for (const n of NODOS) destinos.current.set(n.id, { ...DEF[n.id] });
    escribir(CLAVE_LAYOUT, {});
    despertar();
  };

  // ─── Avisos ────────────────────────────────────────────────────────────────
  const tarjetaRef = useRef(tarjeta);
  tarjetaRef.current = tarjeta;
  const onAviso = useCallback((aviso: Aviso, el: HTMLElement, fijar: boolean) => {
    const rect = el.getBoundingClientRect();
    if (fijar) {
      setGlobo(null);
      setTarjeta((t) => (t?.aviso.id === aviso.id ? null : { aviso, rect }));
      setVistos((v) => {
        if (v.has(aviso.id)) return v;
        const n = new Set(v).add(aviso.id);
        escribir(CLAVE_AVISOS, [...n]);
        return n;
      });
    } else if (tarjetaRef.current?.aviso.id !== aviso.id) {
      setGlobo({ aviso, rect });
    }
  }, []);
  const onAvisoFuera = useCallback(() => setGlobo(null), []);
  const cerrarTarjeta = useCallback(() => setTarjeta(null), []);

  // ─── Modo aprender ─────────────────────────────────────────────────────────
  const via = juego.via;
  const pasoActual = via && juego.fase === 'jugando' ? via.pasos[juego.paso] : null;

  const opciones = useMemo(() => {
    if (!via || !pasoActual) return [];
    const visibles = new Set(Object.keys(vis).filter((id) => vis[id] === 'on'));
    return barajar([pasoActual.nodo, ...distractores(pasoActual.nodo, visibles)]);
    // `vis` cambia con el paso: no hace falta como dependencia aparte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [via, pasoActual]);

  const encuadrarVia = useCallback((v: Via) => {
    const ids = [...v.semilla, ...v.pasos.map((p) => p.nodo)];
    camara.encuadrar(cajaTotal(ids), { abajo: ALTO_BANDEJA, arriba: ALTO_HUD, kMax: 1.2 });
  }, [camara, cajaTotal]);

  const empezar = useCallback((v: Via) => {
    setGlobo(null);
    setTarjeta(null);
    setFocoFijo(null);
    // Un hover pendiente de un nodo que va a ocultarse dejaría toda la vía atenuada.
    setFocoHover(null);
    setJuego({ ...JUEGO_INICIAL, fase: 'jugando', via: v });
    encuadrarVia(v);
  }, [encuadrarVia]);

  /** Cierra el paso actual (acertado o regalado) y abre el siguiente o el cierre. */
  const cerrarPaso = useCallback((j: Juego, regalo: boolean, texto?: string) => {
    if (!j.via) return;
    const correcto = j.via.pasos[j.paso].nodo;
    const siguiente = j.paso + 1;
    const fin = siguiente >= j.via.pasos.length;
    if (fin) {
      const id = j.via.id;
      setProgreso((p) => {
        const prev = p[id];
        const n = { ...p, [id]: { hecha: true, mejor: prev?.hecha ? Math.min(prev.mejor, j.errores) : j.errores } };
        escribir(CLAVE_PROGRESO, n);
        return n;
      });
    }
    setJuego({
      ...j,
      fase: fin ? 'fin' : 'jugando',
      paso: fin ? j.paso : siguiente,
      fallosPaso: 0,
      descartadas: [],
      regalados: regalo ? [...j.regalados, correcto] : j.regalados,
      recien: correcto,
      mensaje: texto ? { tipo: 'regalo', texto, key: Date.now() } : null,
    });
  }, []);

  const comprobar = useCallback((respuesta: { id?: string; texto?: string }) => {
    const j = juego;
    if (j.fase !== 'jugando' || !j.via) return;
    const paso = j.via.pasos[j.paso];
    const nodo = NODO_POR_ID[paso.nodo];
    const ok = respuesta.id ? respuesta.id === paso.nodo : respuestaCorrecta(nodo, respuesta.texto ?? '');
    if (ok) {
      cerrarPaso(j, false);
      return;
    }
    const fallos = j.fallosPaso + 1;
    const conError = { ...j, errores: j.errores + 1, sacudida: j.sacudida + 1 };
    const nombre = textoFicha(nodo);
    // Al tercer fallo se revela resuelto, como la parte B del AnatExam: atascarse
    // en un paso impide ver el resto de la vía, que es lo que se vino a aprender.
    if (fallos >= 3) {
      cerrarPaso(conError, true, `Era ${nombre}. Queda marcado y sigues con el siguiente.`);
      return;
    }
    const dicho = respuesta.id ? textoFicha(NODO_POR_ID[respuesta.id]) : (respuesta.texto ?? '').trim();
    setJuego({
      ...conError,
      fallosPaso: fallos,
      descartadas: respuesta.id ? [...j.descartadas, respuesta.id] : j.descartadas,
      mensaje: {
        tipo: 'mal',
        texto: `«${dicho}» no va aquí. ${fallos === 2 ? 'Último intento antes de ver la respuesta.' : 'Relee la pista.'}`,
        key: Date.now(),
      },
    });
  }, [juego, cerrarPaso]);

  const dnd = useDragDrop<Ficha>({
    onDrop: (item, slot) => { if (slot === 'hueco') comprobar({ id: item.id }); },
    disabled: juego.fase !== 'jugando',
  });

  // Estable: `dnd` es un objeto nuevo en cada render y, pasado tal cual, haría
  // re-renderizar los 40 nodos (van con `memo`) en cada movimiento de una ficha.
  const tapSlotRef = useRef(dnd.tapSlot);
  tapSlotRef.current = dnd.tapSlot;
  const onHueco = useCallback(() => tapSlotRef.current('hueco'), []);

  // Cada paso nuevo: que el hueco quede a la vista.
  useEffect(() => {
    if (!jugando || juego.fase !== 'jugando' || !pasoActual) return;
    const p = pos.current![pasoActual.nodo];
    camara.asegurarVisible(p, { abajo: ALTO_BANDEJA, arriba: ALTO_HUD });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [juego.paso, juego.fase]);

  const siguienteVia = useMemo(() => {
    if (!via) return null;
    const i = VIAS.findIndex((v) => v.id === via.id);
    const resto = [...VIAS.slice(i + 1), ...VIAS.slice(0, i)];
    return resto.find((v) => !progreso[v.id]?.hecha) ?? null;
  }, [via, progreso]);

  const irAExplorar = useCallback(() => {
    setModo('explorar');
    setJuego(JUEGO_INICIAL);
    camara.encuadrar(cajaTotal(NODOS.map((n) => n.id)), { margen: 40 });
  }, [camara, cajaTotal]);

  const irAAprender = () => {
    setModo('aprender');
    setJuego(JUEGO_INICIAL);
    setGlobo(null);
    setTarjeta(null);
  };

  // Teclado: + − 0 para la cámara (salvo escribiendo).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea')) return;
      if (e.key === '+' || e.key === '=') camara.zoomCentro(1.2);
      else if (e.key === '-') camara.zoomCentro(1 / 1.2);
      else if (e.key === '0') camara.encuadrar(cajaTotal(NODOS.filter((n) => visRef.current[n.id] !== 'off').map((n) => n.id)), { margen: 40 });
      else if (e.key === 'Escape' && modo === 'aprender' && juego.fase === 'selector') irAExplorar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [camara, cajaTotal, modo, juego.fase, irAExplorar]);

  // Limpia el pop del recién revelado para que no se repita en otro render.
  useEffect(() => {
    if (!juego.recien) return;
    const t = setTimeout(() => setJuego((j) => ({ ...j, recien: null })), 700);
    return () => clearTimeout(t);
  }, [juego.recien]);

  const encuadrarActual = () => {
    if (jugando && via) encuadrarVia(via);
    else camara.encuadrar(cajaTotal(NODOS.map((n) => n.id)), { margen: 40 });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`${s.wrapper} ${arranque ? s.arranque : ''}`}>
      <div
        ref={viewportRef}
        className={`${s.viewport} ${foco ? s.conFoco : ''}`}
        onPointerDown={(e) => {
          if (!(e.target as Element).closest('[data-nodo],[data-ui],[data-aviso]')) setFocoFijo(null);
          camara.onPointerDown(e);
        }}
      >
        <div ref={worldRef} className={s.mundo}>
          <svg className={s.capaSvg} width="1" height="1" overflow="visible" aria-hidden>
            <defs>
              {(['convierte', 'activa', 'discontinua', 'trombina', 'fantasma'] as const).map((t) => (
                <marker
                  key={t}
                  id={`coag-mk-${t}`}
                  viewBox="0 0 12 12"
                  refX="10.5"
                  refY="6"
                  markerWidth="11"
                  markerHeight="11"
                  markerUnits="userSpaceOnUse"
                  orient="auto"
                >
                  <path d="M1.5 1.8 L10.8 6 L1.5 10.2 L3.6 6 Z" className={s[`mk_${t}`]} />
                </marker>
              ))}
              <marker id="coag-mk-inhibe" viewBox="0 0 8 16" refX="6" refY="8" markerWidth="8" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M6 1.5V14.5" className={s.mk_inhibe} />
              </marker>
              <marker id="coag-mk-estimula" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M1.5 1.8 L10.8 6 L1.5 10.2 L3.6 6 Z" className={s.mk_estimula} />
              </marker>
            </defs>

            {ZONAS.map((z) => (
              <g key={z.id} className={`${s.zona} ${s[`z_${z.id}`]}`}>
                <rect
                  ref={(el) => { (elZona.current[z.id] ??= { rect: null, text: null }).rect = el; }}
                  rx="22"
                  className={s.zonaRect}
                />
                <text ref={(el) => { (elZona.current[z.id] ??= { rect: null, text: null }).text = el; }} className={s.zonaRotulo}>
                  {z.rotulo}
                  {z.detalle && <tspan className={s.zonaDetalle}>{` (${z.detalle})`}</tspan>}
                </text>
              </g>
            ))}

            {hilosVisibles.map(({ h, fantasma }) => {
              const clase = [
                s.hilo,
                s[`h_${h.tipo}`],
                fantasma ? s.fantasma : '',
                cadena ? (cadena.hilos.has(h.id) ? s.enCadena : s.tenue) : '',
              ].filter(Boolean).join(' ');
              const marca = fantasma ? 'fantasma' : h.tipo;
              const liso = !fantasma && h.tipo !== 'discontinua';
              return (
                // La key incluye `fantasma`: al pasar de fantasma a real el hilo
                // remonta y repite su animación de trazado.
                <g key={`${h.id}-${fantasma ? 'f' : 'r'}`} className={clase} style={{ ['--i' as string]: ORDEN[h.de] }}>
                  <path
                    ref={(el) => { if (el) elHilo.current[h.id] = el; else delete elHilo.current[h.id]; }}
                    className={`${s.hiloTrazo} ${liso ? s.dibuja : s.aparece}`}
                    pathLength={liso ? 1 : undefined}
                    markerEnd={`url(#coag-mk-${marca})`}
                  />
                  {(h.tipo === 'inhibe' || h.tipo === 'estimula') && !fantasma && (
                    <g ref={(el) => { if (el) elSigno.current[h.id] = el; else delete elSigno.current[h.id]; }} className={s.signo}>
                      <circle r="8.5" />
                      <path d="M-4 0H4" />
                      {h.tipo === 'estimula' && <path d="M0 -4V4" />}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {NODOS.map((n) => (
            <NodoFactor
              key={n.id}
              nodo={n}
              estado={vis[n.id]}
              x={pos.current![n.id].x}
              y={pos.current![n.id].y}
              orden={ORDEN[n.id]}
              tenue={!!cadena && !cadena.nodos.has(n.id)}
              enCadena={!!cadena && cadena.nodos.has(n.id)}
              recien={juego.recien === n.id}
              sacudida={vis[n.id] === 'blank' ? juego.sacudida : 0}
              objetivo={vis[n.id] === 'blank' && dnd.target === 'hueco'}
              huecoFichas={dificultad === 'fichas'}
              aviso={AVISO_DE[n.id]}
              avisoVisto={vistos.has(AVISO_DE[n.id]?.id ?? '')}
              registrar={registrar}
              onPointerDown={onPointerDownNodo}
              onFoco={onFoco}
              onHueco={onHueco}
              onAviso={onAviso}
              onAvisoFuera={onAvisoFuera}
            />
          ))}
        </div>

        {/* ─── Barra flotante ─── */}
        <div className={s.barra} data-ui>
          <Link href="/dashboard/laboratorio" className={s.volver} aria-label="Volver al laboratorio virtual">
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={s.volverTexto}>Laboratorio</span>
          </Link>
          <div className={s.segmento} role="tablist" aria-label="Modo">
            <button
              type="button"
              role="tab"
              aria-selected={modo === 'explorar'}
              className={`${s.segBtn} ${modo === 'explorar' ? s.segActivo : ''}`}
              onClick={irAExplorar}
            >
              Explorar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={modo === 'aprender'}
              className={`${s.segBtn} ${modo === 'aprender' ? s.segActivo : ''}`}
              onClick={irAAprender}
            >
              Aprender
            </button>
          </div>
        </div>

        <div className={s.barraDer} data-ui>
          <div className={s.zoomGrupo}>
            <button type="button" className={s.btnIcono} onClick={() => camara.zoomCentro(1 / 1.25)} aria-label="Alejar">
              <svg viewBox="0 0 16 16" aria-hidden><path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
            </button>
            <span ref={camara.etiquetaRef} className={s.zoomPct}>100 %</span>
            <button type="button" className={s.btnIcono} onClick={() => camara.zoomCentro(1.25)} aria-label="Acercar">
              <svg viewBox="0 0 16 16" aria-hidden><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
            </button>
          </div>
          <button type="button" className={s.btnIcono} onClick={encuadrarActual} aria-label="Encuadrar" title="Encuadrar (0)">
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M2.5 6V3.5a1 1 0 011-1H6M10 2.5h2.5a1 1 0 011 1V6M13.5 10v2.5a1 1 0 01-1 1H10M6 13.5H3.5a1 1 0 01-1-1V10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className={s.btnIcono} onClick={reordenar} aria-label="Reordenar como la lámina" title="Reordenar como la lámina">
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M3 8a5 5 0 108.6-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M12.2 1.8v3.1H9.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* ─── Leyenda ─── */}
        {!jugando && modo === 'explorar' && (
          <div className={`${s.leyenda} ${leyenda ? '' : s.leyendaCerrada}`} data-ui>
            <button type="button" className={s.leyendaCab} onClick={() => setLeyenda((v) => !v)} aria-expanded={leyenda}>
              Leyenda
              <svg viewBox="0 0 16 16" aria-hidden className={s.leyendaFlecha}>
                <path d="M4 10l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {leyenda && (
              <ul className={s.leyendaLista}>
                <li><span className={`${s.lgCaja} ${s.lgVitK}`}>X</span>Dependiente de vitamina K</li>
                <li><span className={`${s.lgCaja} ${s.lgCofactor}`}>Va</span>Cofactor</li>
                <li><span className={s.lgAst}>*</span>Requiere Ca²⁺ y fosfolípidos</li>
                <li><svg className={s.lgLinea} viewBox="0 0 34 10"><path d="M2 5H30" className={s.lgSolida} /><path d="M26 1.5L32 5L26 8.5" className={s.lgPunta} /></svg>Activa / convierte</li>
                <li><svg className={s.lgLinea} viewBox="0 0 34 10"><path d="M2 5H30" className={s.lgDiscontinua} /></svg>Activa, pero fuera de la cascada</li>
                <li><svg className={s.lgLinea} viewBox="0 0 34 10"><path d="M2 5H30" className={s.lgTrombina} /></svg>Activado por trombina</li>
                <li><span className={`${s.lgSigno} ${s.lgInhibe}`}>−</span>Inhibe<span className={`${s.lgSigno} ${s.lgEstimula}`}>+</span>Estimula</li>
                <li className={s.lgAyuda}>Arrastra los factores · la rueda acerca · pasa el cursor por las <span className={s.lgBaliza}>i</span></li>
              </ul>
            )}
          </div>
        )}

        {/* ─── Modo aprender ─── */}
        {modo === 'aprender' && juego.fase === 'selector' && (
          <SelectorVias
            vias={VIAS}
            progreso={progreso}
            dificultad={dificultad}
            onDificultad={(d) => { setDificultad(d); escribir(CLAVE_DIFICULTAD, d); }}
            onElegir={empezar}
            onCerrar={irAExplorar}
          />
        )}

        {jugando && via && (
          <HudAprender
            via={via}
            paso={juego.paso}
            errores={juego.errores}
            terminado={juego.fase === 'fin'}
            onCambiar={() => setJuego(JUEGO_INICIAL)}
          />
        )}

        {jugando && via && pasoActual && dificultad === 'fichas' && (
          <BandejaFichas
            key={`${via.id}-${juego.paso}`}
            via={via}
            pista={pasoActual.pista}
            opciones={opciones}
            descartadas={new Set(juego.descartadas)}
            picked={dnd.picked}
            dragItem={dnd.dragItem}
            ghost={dnd.ghost}
            mensaje={juego.mensaje}
            startDrag={dnd.startDrag}
            tapItem={dnd.tapItem}
          />
        )}

        {jugando && via && pasoActual && dificultad === 'escribir' && (
          <CampoEscribir
            via={via}
            pista={pasoActual.pista}
            paso={juego.paso}
            mensaje={juego.mensaje}
            onComprobar={(texto) => comprobar({ texto })}
          />
        )}

        {jugando && via && juego.fase === 'fin' && (
          <CierreVia
            via={via}
            errores={juego.errores}
            regalados={juego.regalados.length}
            siguiente={siguienteVia}
            onRepetir={() => empezar(via)}
            onOtra={() => setJuego(JUEGO_INICIAL)}
            onSiguiente={() => siguienteVia && empezar(siguienteVia)}
            onVerTodo={irAExplorar}
          />
        )}
      </div>

      <GloboAviso ancla={globo} />
      <TarjetaAviso ancla={tarjeta} onCerrar={cerrarTarjeta} />
    </div>
  );
}
