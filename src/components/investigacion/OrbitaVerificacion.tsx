/**
 * Ilustración de órbita azul con cubo/insignia central (header del minijuego de
 * correspondencia). SVG multicolor con degradados/filtros propios: los ids van
 * prefijados con `ov-` para evitar colisiones con otros SVG de la página.
 * Derivado de `orbita_verificacion_azul.svg` (viewBox 800×470, se conserva el
 * ancho completo para que las órbitas no se recorten).
 */
export default function OrbitaVerificacion({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 470"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ov-core" cx="40%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#5E8BFF" />
          <stop offset="48%" stopColor="#2868F7" />
          <stop offset="100%" stopColor="#1556E8" />
        </radialGradient>
        <linearGradient id="ov-ring" x1="280" y1="105" x2="520" y2="355" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E9F0FF" />
          <stop offset="0.46" stopColor="#BFD0FF" />
          <stop offset="1" stopColor="#7F9EFF" />
        </linearGradient>
        <linearGradient id="ov-ringAccent" x1="318" y1="137" x2="492" y2="328" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DCE6FF" />
          <stop offset="1" stopColor="#2C68F3" />
        </linearGradient>
        <linearGradient id="ov-cube1" x1="384" y1="218" x2="405" y2="254" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C9D8FF" />
        </linearGradient>
        <linearGradient id="ov-cube2" x1="407" y1="216" x2="432" y2="252" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EDF3FF" />
          <stop offset="1" stopColor="#8FAAFF" />
        </linearGradient>
        <linearGradient id="ov-cube3" x1="386" y1="247" x2="429" y2="275" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BFD0FF" />
          <stop offset="1" stopColor="#EEF3FF" />
        </linearGradient>
        <filter id="ov-shadow" x="230" y="60" width="340" height="340" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#3B66D9" floodOpacity="0.18" />
        </filter>
        <filter id="ov-glow" x="250" y="75" width="300" height="300" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ov-star" x="-30" y="-30" width="80" height="80" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Órbitas posteriores */}
      <ellipse cx="400" cy="235" rx="345" ry="82" transform="rotate(-9 400 235)" stroke="#A9BFFF" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 12" opacity="0.62" />
      <ellipse cx="400" cy="235" rx="315" ry="66" transform="rotate(17 400 235)" stroke="#CFDAFF" strokeWidth="2" strokeLinecap="round" opacity="0.68" />

      {/* Estrellas decorativas */}
      <g filter="url(#ov-star)" opacity="0.95">
        <path d="M90 345C101 376 105 380 136 391C105 402 101 406 90 437C79 406 75 402 44 391C75 380 79 376 90 345Z" fill="#7FA1FF" opacity="0.7" />
        <path d="M696 43C704 66 707 69 730 77C707 85 704 88 696 111C688 88 685 85 662 77C685 69 688 66 696 43Z" fill="#8BA9FF" opacity="0.65" />
        <path d="M28 93C32 105 34 107 46 111C34 115 32 117 28 129C24 117 22 115 10 111C22 107 24 105 28 93Z" fill="#7FA1FF" opacity="0.7" />
        <path d="M151 430C155 442 157 444 169 448C157 452 155 454 151 466C147 454 145 452 133 448C145 444 147 442 151 430Z" fill="#7FA1FF" opacity="0.55" />
      </g>

      {/* Puntos sobre órbitas */}
      <circle cx="170" cy="101" r="6" fill="#79A0FF" opacity="0.55" />
      <circle cx="523" cy="373" r="5" fill="#79A0FF" opacity="0.42" />
      <circle cx="636" cy="133" r="21" fill="#2C68F3" opacity="0.18" />
      <circle cx="636" cy="133" r="15" fill="#2C68F3" />
      <circle cx="630" cy="126" r="5" fill="white" opacity="0.65" />

      {/* Anillo externo y cuerpo central */}
      <g filter="url(#ov-shadow)">
        <circle cx="400" cy="235" r="140" fill="#DCE6FF" opacity="0.5" />
        <circle cx="400" cy="235" r="123" fill="white" opacity="0.65" />
        <circle cx="400" cy="235" r="111" fill="none" stroke="url(#ov-ring)" strokeWidth="32" opacity="0.88" />
        <circle cx="400" cy="235" r="88" fill="#EEF4FF" opacity="0.96" />
        <circle cx="400" cy="235" r="72" fill="url(#ov-core)" filter="url(#ov-glow)" />

        <path d="M288 238C287 176 337 126 399 125" stroke="#DCE6FF" strokeWidth="20" strokeLinecap="round" opacity="0.95" />
        <path d="M509 235C509 266 496 297 474 319" stroke="url(#ov-ringAccent)" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
        <path d="M335 327C367 351 411 358 450 341" stroke="#8AA8FF" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
      </g>

      {/* Órbita frontal */}
      <path d="M130 302C246 347 451 348 600 300C719 262 778 207 735 163" stroke="#BFD0FF" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 12" opacity="0.72" />
      <circle cx="586" cy="307" r="5" fill="#6F96FF" opacity="0.7" />
      <circle cx="260" cy="330" r="6" fill="#6F96FF" opacity="0.38" />

      {/* Cubo / insignia central */}
      <g>
        <path d="M400 201L436 221L400 241L364 221L400 201Z" fill="url(#ov-cube1)" />
        <path d="M400 241L436 221V262L400 284V241Z" fill="url(#ov-cube2)" />
        <path d="M400 241L364 221V262L400 284V241Z" fill="url(#ov-cube3)" />
        <path d="M400 201L436 221L400 241L364 221L400 201Z" stroke="white" strokeWidth="4" strokeLinejoin="round" opacity="0.85" />
        <path d="M364 221V262L400 284L436 262V221" stroke="#EAF0FF" strokeWidth="4" strokeLinejoin="round" opacity="0.85" />
        <path d="M400 241V284" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      </g>
    </svg>
  );
}
