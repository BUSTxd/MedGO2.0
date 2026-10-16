import type { CSSProperties } from 'react';

/**
 * Pulmones — ícono del curso de Respiratorio (tarjeta de la rejilla y esquina
 * del sílabo). Tráquea y bronquios en blanco sobre los dos pulmones.
 */
export default function LungsIcon({
  size = 22,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M27 21c-3-3-9-2-13 4C8 33 6 45 7 52c1 5 5 7 10 5l8-3c3-1 4-3 4-6V25c0-2-1-3-2-4Z"
        fill="#3fa7d6"
      />
      <path
        d="M37 21c3-3 9-2 13 4 6 8 8 20 7 27-1 5-5 7-10 5l-8-3c-3-1-4-3-4-6V25c0-2 1-3 2-4Z"
        fill="#2b86b8"
      />
      <rect x="29.5" y="4" width="5" height="24" rx="2.5" fill="#3fa7d6" />
      <path d="M32 26v5m0 0c-2 2-5 3-9 7m9-7c2 2 5 3 9 7" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
