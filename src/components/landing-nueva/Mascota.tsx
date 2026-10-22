'use client';
import { useEffect, useRef } from 'react';
import s from '@/styles/landingNueva.module.css';
import { c } from './estilos';

/**
 * DOT, la mascota plana de GO (port de `landing/mascot.js` del prototipo): los ojos
 * siguen al puntero, parpadea cada 4-8 s y guiña al pulsar el botón que la contiene.
 * Todo se para con `pausado`, con movimiento reducido, con la pestaña oculta o fuera
 * de vista. Escribe directo en el SVG (refs): seguir al puntero no re-renderiza.
 */
export default function Mascota({ pausado, cls }: { pausado: boolean; cls: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const cara = useRef<SVGGElement>(null);
  const pausadoRef = useRef(pausado);
  const sincronizar = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current, svg = art.current, face = cara.current;
    if (!el || !svg || !face) return;
    const reducido = matchMedia('(prefers-reduced-motion: reduce)');
    const boton = el.closest('button');
    let frame = 0, visible = true, destruido = false;
    let tx = 0, ty = 0, x = 0, y = 0, parpadeo = 0, gesto = 0;
    const activo = () => !destruido && !pausadoRef.current && !reducido.matches && !document.hidden && visible;

    const dibujar = () => {
      frame = 0;
      if (!activo()) return;
      x += (tx - x) * 0.24; y += (ty - y) * 0.24;
      face.setAttribute('transform', `translate(${x * 7} ${y * 4})`);
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.003) frame = requestAnimationFrame(dibujar);
    };
    const mirar = (e: PointerEvent) => {
      if (!activo() || e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / Math.max(120, r.width)));
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / Math.max(120, r.height)));
      if (!frame) frame = requestAnimationFrame(dibujar);
    };
    const planearParpadeo = () => {
      clearTimeout(parpadeo);
      if (!activo()) return;
      parpadeo = window.setTimeout(() => {
        if (!activo()) return;
        svg.classList.add(s['dot-blink']);
        gesto = window.setTimeout(() => { svg.classList.remove(s['dot-blink']); planearParpadeo(); }, 140);
      }, 4200 + Math.random() * 3500);
    };
    const guinar = () => {
      if (!activo()) return;
      clearTimeout(gesto);
      svg.classList.remove(s['dot-blink']);
      svg.classList.add(s['dot-wink']);
      gesto = window.setTimeout(() => { svg.classList.remove(s['dot-wink']); planearParpadeo(); }, 240);
    };
    const sync = () => {
      clearTimeout(parpadeo); clearTimeout(gesto); cancelAnimationFrame(frame); frame = 0;
      svg.classList.remove(s['dot-blink'], s['dot-wink']);
      if (activo()) { frame = requestAnimationFrame(dibujar); planearParpadeo(); }
    };
    sincronizar.current = sync;

    const io = new IntersectionObserver((entradas) => { visible = entradas[0].isIntersecting; sync(); });
    io.observe(el);
    window.addEventListener('pointermove', mirar, { passive: true });
    window.addEventListener('pointerdown', mirar, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reducido.addEventListener('change', sync);
    boton?.addEventListener('click', guinar);
    planearParpadeo();
    return () => {
      destruido = true;
      io.disconnect();
      clearTimeout(parpadeo); clearTimeout(gesto); cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', mirar);
      window.removeEventListener('pointerdown', mirar);
      document.removeEventListener('visibilitychange', sync);
      reducido.removeEventListener('change', sync);
      boton?.removeEventListener('click', guinar);
    };
  }, []);

  useEffect(() => { pausadoRef.current = pausado; sincronizar.current(); }, [pausado]);

  return (
    <span ref={host} className={c(cls)} data-mascot="" aria-hidden="true">
      <svg ref={art} className={c('dot-art')} viewBox="0 0 128 136" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle cx="64" cy="83" r="47" fill="#f3f5f8" />
        <g ref={cara} className={c('dot-face')}>
          <rect className={c('dot-eye dot-eye-left')} x="47" y="73" width="9" height="21" rx="4.5" fill="#101820" />
          <rect className={c('dot-eye dot-eye-right')} x="73" y="73" width="9" height="21" rx="4.5" fill="#101820" />
        </g>
        <path d="m103 49 12 4-4 8-10-8m3-6 9-7 6 6-13 7" fill="#467e9f" />
        <path d="M17 49c0-16 4-28 16-34C46 8 82 8 96 15c12 6 15 18 15 34l-2 11H19l-2-11Z" fill="#5689b2" />
        <path d="M18 48c24 4 68 4 92 0l-1 12c-23 5-66 5-90 0l-1-12Z" fill="#3e7099" />
        <path d="m35 19-3 22m63-22 3 22" stroke="#77a3c3" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 54c24 4 58 4 82 0" stroke="#729bb9" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="57" y="43" width="17" height="16" rx="4" fill="#e8f0f4" />
        <path d="M65.5 47v8m-4-4h8" stroke="#376e79" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
