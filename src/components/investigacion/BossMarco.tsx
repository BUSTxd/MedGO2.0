'use client';

/**
 * Marco HUD sci-fi del BossChallenge. La silueta exacta viene del SVG de
 * referencia (public/investigacion/borde-boss.svg): pestañas en el borde
 * superior (la central sostiene la calavera), muescas laterales, esquinas
 * en chaflán y borde inferior simétrico.
 *
 * Se dibuja aquí inline para poder pintar también el relleno oscuro con tinte
 * rojo, el glow y el doble contorno usando el mismo path. `preserveAspectRatio="none"`
 * lo estira al tamaño real del panel; los trazos usan `vector-effect="non-scaling-stroke"`
 * para mantener grosor constante. Ids con prefijo `bm-` para no colisionar.
 *
 * El viewBox se recorta al bounding box del path (12,14 → 746,454) para que el
 * marco llene toda la caja del panel; así el contenido con padding queda dentro
 * del borde (el SVG original traía margen asimétrico que descuadraba el diseño).
 */

// Path idéntico a borde_panel_boss_simetrico.svg (coords originales, viewBox 791×462).
const D =
  'M14 40 L39 16 L116 16 L126 26 L286 26 L297 16 L461 16 L472 26 L632 26 L642 16 L719 16 L744 40 ' +
  'L744 80 L737 90 L737 172 L744 182 L744 371 L737 380 L737 436 L722 451 ' +
  'L578 451 L568 443 L477 443 L466 452 L292 452 L281 443 L190 443 L180 451 L36 451 L21 436 ' +
  'L21 380 L14 371 L14 182 L21 172 L21 90 L14 80 Z';

export default function BossMarco({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="12 14 734 440"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bm-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a4a" />
          <stop offset="42%" stopColor="#161436" />
          <stop offset="100%" stopColor="#0a0c26" />
        </linearGradient>
        <linearGradient id="bm-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8f7de6" />
          <stop offset="50%" stopColor="#6d6fd6" />
          <stop offset="100%" stopColor="#7c6ad0" />
        </linearGradient>
      </defs>

      {/* Relleno oscuro */}
      <path d={D} fill="url(#bm-fill)" />

      {/* Contorno exterior nítido */}
      <path d={D} stroke="url(#bm-stroke)" strokeWidth="2" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />

      {/* Segundo contorno interior (doble marco) */}
      <path
        d={D}
        transform="matrix(0.984 0 0 0.984 6.3 3.7)"
        stroke="rgba(165,185,230,0.2)"
        strokeWidth="1"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />

      {/* Segmento acento inferior central */}
      <line x1="300" y1="449" x2="490" y2="449" stroke="#7c6ad0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
