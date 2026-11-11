'use client';

import { useEffect, useRef } from 'react';
import { c } from './estilos';

/**
 * Trazo de EKG que cruza el hero a la altura del título. Mide 2400 px y va
 * centrado: el centro queda siempre bajo el título, que lo tapa con la máscara
 * de `.ekg`. Los latidos están a la misma distancia del centro a cada lado.
 *
 * GRIMI es el paciente: el trazo nace en el borde de la cabeza de la silueta
 * izquierda y muere en el de la derecha, como el cable de un electrodo, sin
 * cruzarles la cara (las dos son dibujos de línea del mismo grosor y color, y
 * encima se leen como un garabato). Dónde corta la línea a cada círculo se
 * mide en pantalla —centro y radio del `<circle>`, que no cambian con el giro de
 * la silueta— y se pasa a la máscara como `--ini` y `--fin`. Sin medida (sin JS,
 * o si la línea no toca el círculo) el trazo llega a los bordes de la pantalla.
 *
 * El barrido son tres trazos con el mismo recorrido (cola, cuerpo y cabeza) que
 * avanzan juntos por `stroke-dashoffset`; `pathLength=100` deja las longitudes
 * en porcentaje del trazo. Sin `filter`: se recalcularía en cada fotograma.
 */
const ANCHO = 2400;
const ALTO = 70;
const BASE = 40;
const CENTRO = ANCHO / 2;
/** Distancia del centro al pico R de cada latido. */
const LATIDOS = [480, 760, 1040];
/** Del inicio del latido a su pico R. */
const HASTA_R = 34;

function latido(x: number): string {
  return [
    `L ${x} ${BASE}`,
    `Q ${x + 8} ${BASE - 9} ${x + 16} ${BASE}`, // P
    `L ${x + 24} ${BASE}`,
    `L ${x + 28} ${BASE + 5}`, // Q
    `L ${x + HASTA_R} 4`, // R
    `L ${x + 40} ${BASE + 16}`, // S
    `L ${x + 45} ${BASE}`,
    `L ${x + 58} ${BASE}`,
    `Q ${x + 70} ${BASE - 13} ${x + 82} ${BASE}`, // T
  ].join(' ');
}

const inicios = LATIDOS.flatMap((d) => [CENTRO - d, CENTRO + d])
  .map((r) => r - HASTA_R)
  .sort((a, b) => a - b);
const D = `M 0 ${BASE} ${inicios.map(latido).join(' ')} L ${ANCHO} ${BASE}`;

/** Centro y radio en pantalla de la cabeza de una silueta. */
function cabeza(silueta: Element | null): { x: number; y: number; r: number } | null {
  const circulo = [...(silueta?.querySelectorAll('circle') ?? [])].find((n) => !n.closest('clipPath')) as SVGCircleElement | undefined;
  const m = circulo?.getScreenCTM();
  if (!circulo || !m) return null;
  const { cx, cy, r } = { cx: circulo.cx.baseVal.value, cy: circulo.cy.baseVal.value, r: circulo.r.baseVal.value };
  return { x: m.a * cx + m.c * cy + m.e, y: m.b * cx + m.d * cy + m.f, r: r * Math.hypot(m.a, m.b) };
}

export default function TrazoEkg() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest('section');
    if (!el || !hero) return;

    const medir = () => {
      const caja = el.getBoundingClientRect();
      const y = caja.top + BASE;
      // x donde la línea sale del círculo, por el lado que mira al título.
      const borde = (sel: string, lado: 1 | -1) => {
        const k = cabeza(hero.querySelector(`.${c(sel)}`));
        if (!k || Math.abs(y - k.y) >= k.r) return null;
        return k.x + lado * Math.sqrt(k.r * k.r - (y - k.y) ** 2) - caja.left;
      };
      const ini = borde('silhouette-left', 1);
      const fin = borde('silhouette-right', -1);
      // El hueco bajo el título, de su primera a su última pieza.
      const piezas = [...(el.parentElement?.children ?? [])].filter((n) => n !== el).map((n) => n.getBoundingClientRect());
      const titA = piezas.length ? Math.min(...piezas.map((r) => r.left)) - caja.left : null;
      const titB = piezas.length ? Math.max(...piezas.map((r) => r.right)) - caja.left : null;
      for (const [nombre, x] of [['--ini', ini], ['--fin', fin], ['--tit-a', titA], ['--tit-b', titB]] as const) {
        if (x === null) el.style.removeProperty(nombre);
        else el.style.setProperty(nombre, `${x}px`);
      }
    };

    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(hero);
    document.fonts?.ready.then(medir).catch(() => {});
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={c('ekg')} aria-hidden="true">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width={ANCHO} height={ALTO} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className={c('ekg-fondo')} d={D} />
        <path className={c('ekg-barrido ekg-cola')} d={D} pathLength={100} />
        <path className={c('ekg-barrido ekg-cuerpo')} d={D} pathLength={100} />
        <path className={c('ekg-barrido ekg-cabeza')} d={D} pathLength={100} />
      </svg>
    </span>
  );
}
