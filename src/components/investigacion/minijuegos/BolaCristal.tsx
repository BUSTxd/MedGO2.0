/** Bola de cristal decorativa (aro + estrellas) para el minijuego de orden. */
export default function BolaCristal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 40 480 345"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bc_bgGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#e7efff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#f4f8ff" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bc_sphereFill" cx="38%" cy="26%" r="75%">
          <stop offset="0%" stopColor="#edf4ff" stopOpacity="0.95" />
          <stop offset="22%" stopColor="#b7cdfd" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#7da6fb" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#4d7ef1" stopOpacity="0.84" />
        </radialGradient>
        <linearGradient id="bc_sphereStroke" x1="170" y1="60" x2="398" y2="285" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fcfeff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#a5c1ff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#3571ef" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="bc_ringGradient" x1="70" y1="90" x2="530" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5c1ff" stopOpacity="0.10" />
          <stop offset="18%" stopColor="#5f8fff" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#3a75f6" stopOpacity="1" />
          <stop offset="82%" stopColor="#5f8fff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#a5c1ff" stopOpacity="0.10" />
        </linearGradient>
        <linearGradient id="bc_baseFill" x1="205" y1="295" x2="395" y2="366" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6d9dff" />
          <stop offset="42%" stopColor="#2969ee" />
          <stop offset="100%" stopColor="#1547c9" />
        </linearGradient>
        <filter id="bc_softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#2259cc" floodOpacity="0.18" />
        </filter>
        <filter id="bc_ringGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <clipPath id="bc_sphereClip">
          <circle cx="300" cy="170" r="118" />
        </clipPath>
        <clipPath id="bc_ringFrontClip">
          <rect x="0" y="175" width="600" height="175" />
        </clipPath>
      </defs>

      <ellipse cx="300" cy="175" rx="235" ry="165" fill="url(#bc_bgGlow)" />

      <g fill="#4b80f4">
        <path opacity="0.28" d="M88 198c8 0 11-3 11-11 0 8 3 11 11 11-8 0-11 3-11 11 0-8-3-11-11-11Z" />
        <path opacity="0.88" d="M117 238c15 0 20-6 20-21 0 15 6 21 21 21-15 0-21 6-21 21 0-15-5-21-20-21Z" />
        <path opacity="0.64" d="M111 61c9 0 12-3 12-12 0 9 3 12 12 12-9 0-12 3-12 12 0-9-3-12-12-12Z" />
        <path opacity="0.58" d="M477 95c15 0 20-6 20-21 0 15 6 21 21 21-15 0-21 6-21 21 0-15-5-21-20-21Z" />
        <path opacity="0.34" d="M520 160c7 0 10-3 10-10 0 7 3 10 10 10-7 0-10 3-10 10 0-7-3-10-10-10Z" />
        <circle cx="190" cy="82" r="4" opacity="0.30" />
        <circle cx="425" cy="116" r="4.5" opacity="0.42" />
        <circle cx="467" cy="240" r="3.8" opacity="0.38" />
      </g>

      <g fill="none" strokeLinecap="round">
        <ellipse cx="300" cy="178" rx="224" ry="62" transform="rotate(-16 300 178)" stroke="url(#bc_ringGradient)" strokeWidth="5.5" opacity="0.38" filter="url(#bc_ringGlow)" />
      </g>

      <g>
        <ellipse cx="300" cy="288" rx="60" ry="12" fill="#5a88f7" opacity="0.50" />
        <ellipse cx="300" cy="289" rx="40" ry="7" fill="#97b7ff" opacity="0.23" />
        <path d="M255 289c4 13 19 24 45 24s41-11 45-24" fill="#5a88f7" opacity="0.18" />
      </g>

      <g filter="url(#bc_softShadow)">
        <circle cx="300" cy="170" r="118" fill="#7fa8ff" opacity="0.16" />
        <circle cx="300" cy="170" r="118" fill="url(#bc_sphereFill)" stroke="url(#bc_sphereStroke)" strokeWidth="5" />
        <g clipPath="url(#bc_sphereClip)">
          <ellipse cx="250" cy="107" rx="34" ry="76" transform="rotate(24 250 107)" fill="#ffffff" opacity="0.26" />
          <ellipse cx="356" cy="96" rx="27" ry="55" transform="rotate(-34 356 96)" fill="#ffffff" opacity="0.38" />
          <path d="M242 155L300 112L358 155L340 218L300 239L260 218Z" fill="#3c71ec" opacity="0.28" />
          <ellipse cx="336" cy="238" rx="80" ry="24" transform="rotate(-18 336 238)" fill="#245add" opacity="0.16" />
          <circle cx="221" cy="204" r="30" fill="#1a52d1" opacity="0.10" />
          <circle cx="378" cy="188" r="26" fill="#1a52d1" opacity="0.10" />
          <path d="M206 246C246 278 329 290 387 248" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.18" />
          <circle cx="277" cy="157" r="7" fill="#ffffff" opacity="0.12" />
          <circle cx="343" cy="144" r="6" fill="#ffffff" opacity="0.16" />
        </g>
        <path d="M226 82C255 52 316 43 362 65" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" opacity="0.36" />
        <path d="M391 90C411 111 419 141 414 166" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.22" />
      </g>

      <g fill="none" strokeLinecap="round" clipPath="url(#bc_ringFrontClip)">
        <ellipse cx="300" cy="178" rx="224" ry="62" transform="rotate(-16 300 178)" stroke="url(#bc_ringGradient)" strokeWidth="6" opacity="0.96" />
      </g>
      <g>
        <circle cx="484" cy="196" r="8" fill="#3f79f2" opacity="0.96" />
        <circle cx="484" cy="196" r="13" fill="#3f79f2" opacity="0.13" />
      </g>

      <g filter="url(#bc_softShadow)">
        <ellipse cx="300" cy="353" rx="97" ry="21" fill="#1643c0" opacity="0.16" />
        <path d="M229 302h142c8 0 14 6 14 14v7c0 15-38 27-85 27s-85-12-85-27v-7c0-8 6-14 14-14Z" fill="url(#bc_baseFill)" />
        <path d="M217 321c19 14 147 14 166 0v17c-20 18-146 18-166 0v-17Z" fill="#205ee4" opacity="0.97" />
        <path d="M217 338c25 18 141 18 166 0v18c-27 18-139 18-166 0v-18Z" fill="#184bd2" />
        <ellipse cx="300" cy="355" rx="92" ry="16" fill="#2d68ee" />
        <ellipse cx="300" cy="353" rx="71" ry="7" fill="#86aeff" opacity="0.36" />
      </g>

      <g>
        <path d="M240 289C245 299 269 306 300 306C331 306 355 299 360 289C350 296 327 300 300 300C273 300 250 296 240 289Z" fill="#3f74ef" />
        <path d="M244 289C250 295 271 299 300 299C329 299 350 295 356 289" fill="none" stroke="#7ea7ff" strokeWidth="3.2" strokeLinecap="round" opacity="0.95" />
        <path d="M244 291C252 299 273 304 300 304C327 304 348 299 356 291" fill="none" stroke="#2d5fe0" strokeWidth="5.5" strokeLinecap="round" opacity="0.95" />
        <ellipse cx="300" cy="289" rx="58" ry="10.5" fill="none" stroke="#a9c4ff" strokeWidth="2.1" opacity="0.42" />
      </g>
    </svg>
  );
}
