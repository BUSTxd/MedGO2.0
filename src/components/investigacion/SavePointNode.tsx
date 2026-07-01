'use client';
import styles from '@/styles/investigacion.module.css';

export type EstadoNodo = 'bloqueado' | 'desbloqueado' | 'completado';

/**
 * Nodo "punto de guardado" (plataforma circular 3D) para el mapa de niveles.
 * Versión compacta y fiel del SVG punto_guardado_3d_lateral.svg, con estados.
 */
export default function SavePointNode({
  n,
  estado,
  nombre,
}: {
  n: number;
  estado: EstadoNodo;
  nombre: string;
}) {
  return (
    <div className={`${styles.nodo} ${styles[`nodo_${estado}`]}`}>
      <div className={styles.nodoArte}>
        <svg viewBox="0 0 200 150" className={styles.nodoSvg} aria-hidden="true">
          <defs>
            <linearGradient id={`body-${n}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#244a86" />
              <stop offset="50%" stopColor="#162f5a" />
              <stop offset="100%" stopColor="#09162d" />
            </linearGradient>
            <linearGradient id={`plate-${n}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2157a6" />
              <stop offset="50%" stopColor="#0c3d92" />
              <stop offset="100%" stopColor="#09285f" />
            </linearGradient>
            <radialGradient id={`glow-${n}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#48f8ff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#1fc7ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#061f50" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`gold-${n}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1a6" />
              <stop offset="55%" stopColor="#e3a83e" />
              <stop offset="100%" stopColor="#ffd76d" />
            </linearGradient>
          </defs>

          {/* sombra */}
          <ellipse cx="100" cy="128" rx="72" ry="12" fill="#00091a" opacity="0.32" />

          {/* cuerpo lateral */}
          <path
            d="M28 74 C28 50 60 38 100 38 C140 38 172 50 172 74 L172 96
               C172 120 140 132 100 132 C60 132 28 120 28 96 Z"
            fill={`url(#body-${n})`}
          />
          {/* tapa superior */}
          <ellipse cx="100" cy="74" rx="72" ry="28" fill={`url(#plate-${n})`} stroke="#071d47" strokeWidth="2" />
          <ellipse cx="100" cy="74" rx="72" ry="28" fill={`url(#glow-${n})`} />
          {/* aro dorado */}
          <ellipse cx="100" cy="74" rx="62" ry="22" fill="none" stroke={`url(#gold-${n})`} strokeWidth="2.4" opacity="0.9" />
          {/* anillos brillantes */}
          <ellipse cx="100" cy="74" rx="52" ry="18" fill="none" stroke="#59f5ff" strokeWidth="2" className={styles.nodoRing} />
          <ellipse cx="100" cy="74" rx="34" ry="12" fill="none" stroke="#7bffff" strokeWidth="1.6" opacity="0.9" />
          {/* estrella central */}
          <polygon
            points="100,58 106,71 122,74 106,77 100,90 94,77 78,74 94,71"
            fill="#cfffff"
            opacity="0.96"
          />
          <circle cx="100" cy="74" r="2.4" fill="#ffffff" />
        </svg>

        {/* Overlays por estado */}
        {estado === 'completado' && <span className={styles.nodoCheck}>✓</span>}
        {estado === 'bloqueado' && (
          <span className={styles.nodoLock} aria-label="Bloqueado">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        )}
        <span className={styles.nodoNum}>{n}</span>
      </div>
      <span className={styles.nodoNombre}>{nombre}</span>
    </div>
  );
}
