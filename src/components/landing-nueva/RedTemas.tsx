'use client';
// «Segundo cerebro»: lo publicado en MedGO como un grafo de fuerzas, al estilo del de
// Obsidian. Los datos salen de `red-datos.ts` (GENERADO por scripts/landing/generar-red.mjs)
// y este módulo entero se baja aparte (`ConectaRed`), sólo al acercarse a la tarjeta.
// Canvas en vez de SVG: son ~360 nodos y ~420 aristas por fotograma. Las fuerzas son las
// de d3-force (carga, resorte con fuerza 1/grado, gravedad al centro). Sólo corre mientras
// se ve; con «Pausar movimiento» o movimiento reducido no deriva ni se despliega animado.

import { useEffect, useRef } from 'react';
import { ARISTAS, NODOS, PASEO, type TipoNodoRed } from './red-datos';
import l from '@/styles/landingNueva.module.css';

/** Los colores salen de las variables de `.pagina` (los mismos de la leyenda y de las tarjetas); éstos son su respaldo. */
const COLOR: Record<TipoNodoRed, string> = { curso: '#e6ecf2', resumen: '#7f9df0', pregunta: '#8cbab6', lab: '#d2a66a' };
const VARIABLE: Record<TipoNodoRed, string> = { curso: '--c-curso', resumen: '--c-resumen', pregunta: '--c-banqueo', lab: '--c-lab' };
/** Lo que se apaga lo que no es vecino del foco (los cursos siguen leyéndose). */
const APAGADO = 0.3;
const FONDO = '#0f1318';
/** Orden en que se ganan sitio los rótulos de los vecinos. */
const PRIORIDAD: Record<TipoNodoRed, number> = { curso: 0, lab: 1, pregunta: 2, resumen: 3 };

// ── La estructura del grafo, una vez ──
const N = NODOS.length;
const GRADO = new Int32Array(N);
const VECINOS: number[][] = NODOS.map(() => []);
for (const [a, b] of ARISTAS) { GRADO[a]++; GRADO[b]++; VECINOS[a].push(b); VECINOS[b].push(a); }
const RADIO = NODOS.map((n, i) => (n[2] === 'curso' ? 3 + Math.sqrt(GRADO[i]) * 1.15 : Math.max(n[2] === 'resumen' ? 1.8 : 2.8, 1.6 + Math.sqrt(GRADO[i]) * 0.95)));
const CARGA = NODOS.map((_, i) => -(14 + GRADO[i] * 2.2));
const HOJA = ARISTAS.map(([a, b]) => GRADO[a] === 1 || GRADO[b] === 1);
const FUERZA = ARISTAS.map(([a, b]) => 1 / Math.min(GRADO[a], GRADO[b]));
const SESGO = ARISTAS.map(([a, b]) => GRADO[a] / (GRADO[a] + GRADO[b]));
const EN_PASEO = PASEO.map((id) => NODOS.findIndex((n) => n[0] === id)).filter((i) => i >= 0);
/** Lo que se rotula sin foco: los cursos y el ENCIB. */
const SIEMPRE = NODOS.map((n) => n[2] === 'curso' || n[0] === 'pregunta:encib');

const GRAVEDAD_ANCHA = 0.03;
const GRAVEDAD_CORTA = 0.065;
const FRENADO = 0.6;
const ENFRIAR = 0.0228;
/** Lo lejos que se deja llevar un nodo agarrado (luego vuelve solo). */
const CORREA = 0.3;
/** Lo que ocupan la leyenda (arriba) y la pista (abajo). */
const ARRIBA = 30;
const ABAJO = 24;
const PASEO_MS = 3400;

export default function RedTemas({ parado }: { parado: boolean }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const paradoRef = useRef(parado);
  const arrancarRef = useRef<() => void>(() => {});
  const repintarRef = useRef<() => void>(() => {});

  const s = useRef({
    x: new Float64Array(N), y: new Float64Array(N), vx: new Float64Array(N), vy: new Float64Array(N),
    w: 0, h: 0, dpr: 1, esc: 1, alfa: 1, objetivo: 0, t: 0,
    listo: false, visible: false, raf: 0,
    // Con el paseo parado no hay ejemplo que resaltar: la red empieza entera.
    foco: parado ? -1 : EN_PASEO[0] ?? -1, tocado: false,
    agarre: -1, ax: 0, ay: 0, px: 0, py: 0,
    fuente: 'sans-serif',
  }).current;

  useEffect(() => {
    const cv = lienzo.current!;
    const ctx = cv.getContext('2d')!;
    const estilo = getComputedStyle(cv);
    s.fuente = estilo.fontFamily || 'sans-serif';
    const color = { ...COLOR };
    for (const t of Object.keys(VARIABLE) as TipoNodoRed[]) color[t] = estilo.getPropertyValue(VARIABLE[t]).trim() || COLOR[t];

    // ── Fuerzas: un paso ──
    const paso = () => {
      const { x, y, vx, vy, alfa, esc } = s;
      const esc2 = esc * esc;
      const lejos = (230 * esc) ** 2;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          let dx = x[j] - x[i], dy = y[j] - y[i];
          let d2 = dx * dx + dy * dy;
          if (d2 > lejos) continue;
          if (d2 < 1) { dx = 0.5 + (i % 3); dy = 0.5; d2 = dx * dx + dy * dy; }
          const k = (alfa * esc2) / d2;
          vx[i] += dx * CARGA[j] * k; vy[i] += dy * CARGA[j] * k;
          vx[j] -= dx * CARGA[i] * k; vy[j] -= dy * CARGA[i] * k;
        }
      }
      for (let e = 0; e < ARISTAS.length; e++) {
        const [a, b] = ARISTAS[e];
        const dx = x[b] + vx[b] - x[a] - vx[a], dy = y[b] + vy[b] - y[a] - vy[a];
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = ((d - (HOJA[e] ? 13 : 40) * esc) / d) * alfa * FUERZA[e];
        vx[b] -= dx * f * SESGO[e]; vy[b] -= dy * f * SESGO[e];
        vx[a] += dx * f * (1 - SESGO[e]); vy[a] += dy * f * (1 - SESGO[e]);
      }
      const ancha = s.w > s.h;
      const gx = ancha ? GRAVEDAD_ANCHA : GRAVEDAD_CORTA, gy = ancha ? GRAVEDAD_CORTA : GRAVEDAD_ANCHA;
      const cx = s.w / 2, cy = (s.h + ARRIBA - ABAJO) / 2;
      const deriva = !paradoRef.current;
      for (let i = 0; i < N; i++) {
        vx[i] += (cx - x[i]) * gx * alfa;
        vy[i] += (cy - y[i]) * gy * alfa;
        if (deriva) {
          vx[i] += Math.sin(s.t * 0.0006 + i * 1.7) * 0.01;
          vy[i] += Math.cos(s.t * 0.0005 + i * 2.3) * 0.01;
        }
      }
      for (let i = 0; i < N; i++) {
        if (i === s.agarre) { vx[i] = vy[i] = 0; continue; }
        vx[i] *= FRENADO; vy[i] *= FRENADO;
        x[i] += vx[i]; y[i] += vy[i];
        const r = RADIO[i] + 3;
        x[i] = Math.min(s.w - r, Math.max(r, x[i]));
        y[i] = Math.min(s.h - r - ABAJO, Math.max(r + ARRIBA, y[i]));
      }
      s.alfa += (s.objetivo - s.alfa) * ENFRIAR;
    };

    // ── Pintar ──
    const pintar = () => {
      const { x, y, w, h, foco } = s;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const lit = foco >= 0 ? new Set([foco, ...VECINOS[foco]]) : null;

      ctx.lineWidth = 0.6;
      ctx.strokeStyle = lit ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.085)';
      ctx.beginPath();
      for (const [a, b] of ARISTAS) {
        if (lit && (a === foco || b === foco)) continue;
        ctx.moveTo(x[a], y[a]); ctx.lineTo(x[b], y[b]);
      }
      ctx.stroke();
      if (lit) {
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = 'rgba(115,160,196,0.75)';
        ctx.beginPath();
        for (const v of VECINOS[foco]) { ctx.moveTo(x[foco], y[foco]); ctx.lineTo(x[v], y[v]); }
        ctx.stroke();
      }

      for (let i = 0; i < N; i++) {
        ctx.globalAlpha = lit && !lit.has(i) ? APAGADO : 1;
        ctx.fillStyle = color[NODOS[i][2]];
        ctx.beginPath();
        ctx.arc(x[i], y[i], RADIO[i], 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (foco >= 0) {
        ctx.strokeStyle = '#f3f5f8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x[foco], y[foco], RADIO[foco] + 2.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rótulos: el foco, sus vecinos y después los cursos (siempre, para saber qué grupo es cuál);
      // el que choca con uno ya puesto, no sale.
      const fijos = SIEMPRE.flatMap((v, i) => (v ? [i] : []));
      const cand = lit
        ? [foco, ...VECINOS[foco].slice().sort((a, b) => PRIORIDAD[NODOS[a][2]] - PRIORIDAD[NODOS[b][2]]), ...fijos.filter((i) => !lit.has(i))]
        : fijos;
      const puestos: [number, number, number, number][] = [];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineJoin = 'round';
      for (const i of cand) {
        const esFoco = i === foco;
        const grande = esFoco || NODOS[i][2] === 'curso';
        ctx.font = `${grande ? 500 : 400} ${grande ? 11 : 10}px ${s.fuente}`;
        const t = NODOS[i][1];
        const ancho = ctx.measureText(t).width;
        const tx = Math.min(w - ancho / 2 - 4, Math.max(ancho / 2 + 4, x[i]));
        const ty = y[i] + RADIO[i] + 3;
        const caja: [number, number, number, number] = [tx - ancho / 2 - 2, ty - 1, tx + ancho / 2 + 2, ty + 13];
        if (!esFoco && puestos.some((p) => caja[0] < p[2] && caja[2] > p[0] && caja[1] < p[3] && caja[3] > p[1])) continue;
        puestos.push(caja);
        ctx.lineWidth = 3;
        ctx.strokeStyle = FONDO;
        ctx.strokeText(t, tx, ty);
        ctx.fillStyle = esFoco ? '#f3f5f8' : lit ? (lit.has(i) ? '#c3cfdc' : '#7f8b99') : '#aebccb';
        ctx.fillText(t, tx, ty);
      }
    };

    // ── Bucle: corre mientras se ve y hay algo que mover ──
    let previo = 0;
    const vuelta = (ahora: number) => {
      s.t += Math.min(64, ahora - (previo || ahora));
      previo = ahora;
      paso();
      pintar();
      const vivo = s.visible && (!paradoRef.current || s.agarre >= 0 || s.alfa > 0.003);
      s.raf = vivo ? requestAnimationFrame(vuelta) : 0;
      if (!vivo) previo = 0;
    };
    const arrancar = () => {
      if (!s.listo || s.raf) return;
      s.raf = requestAnimationFrame(vuelta);
    };
    arrancarRef.current = arrancar;
    /** Un fotograma suelto (cambió el foco con el bucle parado). */
    const repintar = () => { if (!s.raf && s.listo) pintar(); };
    repintarRef.current = repintar;

    // Filotaxis, como d3: determinista y sin nodos encimados. Se despliega animado salvo
    // con movimiento parado, que lo resuelve de golpe.
    const colocar = () => {
      for (let i = 0; i < N; i++) {
        const r = 4.5 * s.esc * Math.sqrt(0.5 + i), a = i * Math.PI * (3 - Math.sqrt(5));
        s.x[i] = s.w / 2 + r * Math.cos(a) * (s.w > s.h ? 1.4 : 1);
        s.y[i] = s.h / 2 + r * Math.sin(a) * (s.w > s.h ? 1 : 1.3);
      }
      s.alfa = 1; s.objetivo = 0;
      if (paradoRef.current) { for (let k = 0; k < 300; k++) paso(); }
      s.listo = true;
      pintar();
      arrancar();
    };

    // ── Tamaño (el lienzo a la resolución de la pantalla) ──
    const medir = () => {
      const r = cv.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h || (w === s.w && h === s.h)) return;
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * s.dpr);
      cv.height = Math.round(h * s.dpr);
      if (s.listo) {
        const fx = w / s.w, fy = h / s.h;
        for (let i = 0; i < N; i++) { s.x[i] *= fx; s.y[i] *= fy; }
        s.alfa = Math.max(s.alfa, 0.2);
      }
      s.w = w; s.h = h;
      s.esc = Math.min(1.25, Math.max(0.62, Math.sqrt((w * h) / (600 * 470))));
      if (!s.listo) colocar();
      else { pintar(); arrancar(); }
    };

    const ro = new ResizeObserver(medir);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) arrancar(); }, { threshold: 0.05 });
    io.observe(cv);

    // ── Puntero: el nodo más cercano dentro de un radio ──
    const local = (e: { clientX: number; clientY: number }) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const cercano = (px: number, py: number, holgura: number) => {
      let mejor = -1, md = Infinity;
      for (let i = 0; i < N; i++) {
        const d = Math.hypot(s.x[i] - px, s.y[i] - py) - RADIO[i];
        if (d < holgura && d < md) { md = d; mejor = i; }
      }
      return mejor;
    };
    const enfocar = (i: number) => { if (s.foco !== i) { s.foco = i; repintar(); } };

    const abajo = (e: PointerEvent) => {
      const p = local(e);
      const i = cercano(p.x, p.y, e.pointerType === 'mouse' ? 8 : 18);
      s.tocado = true;
      if (i < 0) { if (e.pointerType !== 'mouse') enfocar(-1); return; }
      cv.setPointerCapture(e.pointerId);
      s.agarre = i; s.ax = s.x[i]; s.ay = s.y[i]; s.px = p.x; s.py = p.y;
      s.objetivo = 0.25; s.alfa = Math.max(s.alfa, 0.25);
      cv.style.cursor = 'grabbing';
      enfocar(i);
      arrancar();
    };
    const mover = (e: PointerEvent) => {
      const p = local(e);
      if (s.agarre >= 0) {
        // Correa elástica: cuanto más lejos, menos sigue al puntero.
        const dx = p.x - s.px, dy = p.y - s.py, d = Math.hypot(dx, dy);
        const largo = Math.min(s.w, s.h) * CORREA;
        const k = d > 0 ? (largo * Math.tanh(d / largo)) / d : 0;
        const i = s.agarre, r = RADIO[i] + 3;
        s.x[i] = Math.min(s.w - r, Math.max(r, s.ax + dx * k));
        s.y[i] = Math.min(s.h - r - ABAJO, Math.max(r + ARRIBA, s.ay + dy * k));
        return;
      }
      if (e.pointerType !== 'mouse') return;
      const i = cercano(p.x, p.y, 8);
      cv.style.cursor = i >= 0 ? 'grab' : '';
      if (i >= 0) { s.tocado = true; enfocar(i); } else if (s.tocado) enfocar(-1);
    };
    const soltar = (e: PointerEvent) => {
      if (s.agarre < 0) return;
      if (cv.hasPointerCapture(e.pointerId)) cv.releasePointerCapture(e.pointerId);
      s.agarre = -1; s.objetivo = 0;
      cv.style.cursor = '';
      // Con el mouse el resaltado sigue al cursor; con el dedo se queda hasta tocar el fondo.
      if (e.pointerType === 'mouse') { const p = local(e); enfocar(cercano(p.x, p.y, 8)); }
    };
    const salir = (e: PointerEvent) => { if (e.pointerType === 'mouse' && s.agarre < 0 && s.tocado) enfocar(-1); };
    // Sobre un nodo, el dedo arrastra; en el resto del grafo, la página se desplaza.
    const tocar = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const p = local(t);
      if (cercano(p.x, p.y, 18) >= 0) e.preventDefault();
    };

    cv.addEventListener('pointerdown', abajo);
    cv.addEventListener('pointermove', mover);
    cv.addEventListener('pointerup', soltar);
    cv.addEventListener('pointercancel', soltar);
    cv.addEventListener('pointerleave', salir);
    cv.addEventListener('touchstart', tocar, { passive: false });

    // Mientras nadie lo toca, el resaltado pasea por unos cuantos ejemplos.
    let k = 0;
    const paseo = setInterval(() => {
      if (s.tocado || paradoRef.current || !s.visible || !EN_PASEO.length) return;
      k = (k + 1) % EN_PASEO.length;
      enfocar(EN_PASEO[k]);
    }, PASEO_MS);

    medir();
    return () => {
      cancelAnimationFrame(s.raf); s.raf = 0;
      clearInterval(paseo);
      ro.disconnect(); io.disconnect();
      cv.removeEventListener('pointerdown', abajo);
      cv.removeEventListener('pointermove', mover);
      cv.removeEventListener('pointerup', soltar);
      cv.removeEventListener('pointercancel', soltar);
      cv.removeEventListener('pointerleave', salir);
      cv.removeEventListener('touchstart', tocar);
    };
  }, [s]);

  // Al reanudar el movimiento, el bucle vuelve a correr (la deriva lo mantiene vivo). Al pararlo,
  // el resaltado del paseo se apaga (ya no va a cambiar) salvo que lo haya puesto el usuario.
  useEffect(() => {
    paradoRef.current = parado;
    if (!parado) arrancarRef.current();
    else if (!s.tocado && s.foco >= 0) { s.foco = -1; repintarRef.current(); }
  }, [parado, s]);

  return <canvas ref={lienzo} className={l.redLienzo} aria-hidden />;
}
