'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/investigacionGame.module.css';

export default function NivelHUD({
  n,
  nombre,
  totalXP,
  progresoPct,
  seccion,
  boss = false,
}: {
  n: number;
  nombre: string;
  totalXP: number;
  progresoPct: number;
  seccion: string;
  boss?: boolean;
}) {
  return (
    <div className={`${styles.hud} ${boss ? styles.hudBoss : ''}`}>
      <div className={styles.hudTop}>
        <Link href="/dashboard/investigacion" className={styles.hudBack}>
          ← Mapa
        </Link>
        <div className={styles.hudInfo}>
          <span className={styles.hudNivel}>Nivel {n}</span>
          <span className={styles.hudNombre}>{nombre}</span>
        </div>
        <div className={styles.hudXP}>
          <span className={styles.hudXPValor}>{totalXP}</span>
          <span className={styles.hudXPLabel}>XP</span>
        </div>
        <span className={`${styles.hudEstrella} ${boss ? styles.hudEstrellaBoss : ''}`} aria-hidden="true">
          {boss ? (
            <Image
              src="/investigacion/calavera-roja.webp"
              alt=""
              width={30}
              height={30}
              className={styles.hudCalavera}
            />
          ) : (
          <svg viewBox="0 0 512 512" width="30" height="30" fill="none">
            <defs>
              <linearGradient id="hi_starFill" x1="120" y1="90" x2="392" y2="402" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFE88A" />
                <stop offset="45%" stopColor="#FFC94D" />
                <stop offset="100%" stopColor="#FF9F1C" />
              </linearGradient>
              <linearGradient id="hi_strokeGrad" x1="160" y1="120" x2="360" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF6C9" />
                <stop offset="100%" stopColor="#FFB347" />
              </linearGradient>
              <radialGradient id="hi_shine" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 190) rotate(45) scale(150 120)">
                <stop offset="0%" stopColor="#FFFBEA" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FFFBEA" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g transform="rotate(-12 256 256)">
              <path
                d="M256 86C268 114, 278 138, 289 166C293 176, 302 182, 313 184C343 189, 367 194, 395 200C411 203, 417 223, 406 235C387 255, 368 274, 350 294C343 302, 340 312, 342 323C347 353, 351 377, 356 406C359 423, 341 436, 326 428C300 414, 278 401, 262 391C253 386, 243 386, 234 391C217 401, 194 414, 168 428C153 436, 135 423, 138 406C143 377, 147 353, 152 323C154 312, 151 302, 144 294C126 274, 107 255, 88 235C77 223, 83 203, 99 200C127 194, 151 189, 181 184C192 182, 201 176, 205 166C216 138, 226 114, 238 86C242 76, 252 72, 256 86Z"
                fill="url(#hi_starFill)" stroke="url(#hi_strokeGrad)" strokeWidth="14" strokeLinejoin="round"
              />
              <path
                d="M256 117C265 138, 273 157, 281 178C286 192, 298 202, 313 205C335 209, 354 213, 377 218C389 220, 394 236, 385 245C370 260, 356 275, 342 291C332 302, 328 317, 331 331C335 353, 339 372, 342 392C344 403, 332 411, 322 406C303 396, 286 386, 271 378C261 372, 251 372, 241 378C226 386, 209 396, 190 406C180 411, 168 403, 170 392C173 372, 177 353, 181 331C184 317, 180 302, 170 291C156 275, 142 260, 127 245C118 236, 123 220, 135 218C158 213, 177 209, 199 205C214 202, 226 192, 231 178C239 157, 247 138, 256 117Z"
                fill="url(#hi_shine)" opacity="0.8"
              />
            </g>
          </svg>
          )}
        </span>
      </div>

      <div className={styles.hudBarra}>
        <div className={styles.hudBarraFill} style={{ width: `${progresoPct}%` }} />
      </div>
      <div className={styles.hudSeccion}>{seccion}</div>
    </div>
  );
}
