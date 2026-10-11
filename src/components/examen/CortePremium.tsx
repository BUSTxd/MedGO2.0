'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PLANS, type PlanKey } from '@/lib/plans';
import styles from '@/styles/examRunner.module.css';

/**
 * Lo que queda al otro lado de una prueba gratis: la muestra de un banqueo
 * (ExamRunner) o las barajas de prueba del examen 3D (ExamenMS). No es una
 * tarjeta-panel: es una portada a dos columnas —argumento a la izquierda, mural
 * a la derecha— porque la pieza tiene que competir con la nota que viene justo
 * debajo.
 *
 * Se abre con la animación de `.corteWrap` (examRunner.module.css): quien lo
 * monta lo envuelve y decide cuándo abrirlo.
 */

/**
 * Corona del mural del banqueo, reducida a insignia. Los `id` de los degradados
 * van prefijados porque el SVG convive en la misma página con las figuras de
 * las preguntas.
 */
function IconoCorona({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 389) / 486)}
      viewBox="57 100 486 389"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cpCorona" x1="150" y1="160" x2="450" y2="430" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9A8FF" />
          <stop offset="0.45" stopColor="#8A3FFC" />
          <stop offset="1" stopColor="#4B00FF" />
        </linearGradient>
      </defs>
      <path
        d="M151 410C139 410 128 402 124 390L86 264C82 251 96 241 107 249L180 309C189 317 203 314 210 304L284 191C291 180 309 180 316 191L390 304C397 314 411 317 420 309L493 249C504 241 518 251 514 264L476 390C472 402 461 410 449 410Z"
        fill="url(#cpCorona)"
      />
      <circle cx="100" cy="248" r="43" fill="url(#cpCorona)" />
      <circle cx="300" cy="150" r="50" fill="url(#cpCorona)" />
      <circle cx="500" cy="248" r="43" fill="url(#cpCorona)" />
      <rect x="150" y="435" width="300" height="54" rx="27" fill="url(#cpCorona)" />
    </svg>
  );
}

/** El mismo candado que la rejilla de cursos y el sílabo. */
export function IconoCandado({ size = 11 }: { size?: number }) {
  return (
    <svg className={styles.candado} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const ICONOS_DATO = {
  explicacion: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  variante: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="6" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.3 10.8 15.7 7.2M8.3 13.2l7.4 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  nota: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5l2.5 5.6 6.1.6-4.6 4.1 1.3 6-5.3-3.1-5.3 3.1 1.3-6L3.4 9.7l6.1-.6L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  imagen: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 17.5 4.7-4.2a2 2 0 0 1 2.7 0l4 3.7M15 14.4l1.6-1.4a2 2 0 0 1 2.6 0l1.3 1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  /** Tres cartas apiladas: las barajas del examen 3D. */
  barajas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="3.5" width="12" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 7.5v11A2.5 2.5 0 0 0 7.5 21H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  /** Cubo: el modelo 3D. */
  modelo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  /** El book-bookmark de Cursos: el resumen de la clase. */
  resumen: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 18.5V6a2.5 2.5 0 0 1 2.5-2.5H19v13H7.5A2.5 2.5 0 0 0 5 19a2.5 2.5 0 0 0 2.5 2.5H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 3.5v6l2-1.5 2 1.5v-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
} as const;

export type IconoDato = keyof typeof ICONOS_DATO;
export interface DatoCorte { icono: IconoDato; num?: number | string; label: string }

export default function CortePremium({
  plan,
  titulo,
  acento,
  cuerpo,
  datos,
  isAuthed,
  onVer,
}: {
  plan: PlanKey;
  /** Primera línea del titular y su remate en violeta (la promesa). */
  titulo: string;
  acento: string;
  cuerpo: React.ReactNode;
  /** Qué hay detrás del corte, en cifras. Los que valen 0 no se pintan. */
  datos: DatoCorte[];
  isAuthed: boolean;
  onVer: () => void;
}) {
  const p = PLANS[plan];
  const precio = Number.isInteger(p.amount) ? String(p.amount) : p.amount.toFixed(2);
  return (
    <section className={styles.corte} aria-label={`${titulo} ${acento}`}>
      <div className={styles.corteCol}>
        <p className={styles.corteBadge}>
          <IconoCorona size={15} />
          Premium
        </p>

        <h2 className={styles.corteTitulo}>
          {titulo}
          <span className={styles.corteTituloAcc}>{acento}</span>
        </h2>

        <p className={styles.corteCuerpo}>{cuerpo}</p>

        <ul className={styles.corteDatos}>
          {datos.filter((d) => !!d.num).map((d) => (
            <li key={d.label} className={styles.corteDato}>
              <span className={styles.corteDatoIcono}>{ICONOS_DATO[d.icono]}</span>
              <span className={styles.corteDatoNum}>{d.num}</span>
              <span className={styles.corteDatoLabel}>{d.label}</span>
            </li>
          ))}
        </ul>

        {isAuthed ? (
          <button type="button" className={styles.corteCta} onClick={onVer}>
            <IconoCandado size={17} />
            <span>
              Todo por S/ {precio}
              <span className={styles.corteCtaUnidad}>/ {p.durationDays === 30 ? 'mes' : 'año'}</span>
            </span>
            <svg className={styles.corteCtaFlecha} width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h13M12 5.5 18.5 12 12 18.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <Link href="/auth/login" className={styles.corteCta}>
            <IconoCandado size={17} />
            <span>Inicia sesión para continuar</span>
            <svg className={styles.corteCtaFlecha} width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h13M12 5.5 18.5 12 12 18.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}

        <p className={styles.cortePie}>
          Desbloquea además <strong>todos los resúmenes de todas las clases</strong> de{' '}
          {p.track === 'basico' ? 'los seis cursos del ciclo básico' : 'todos los años de la Facultad'}.
        </p>
      </div>

      <div className={styles.corteArte} aria-hidden>
        <Image
          src="/banco/premium-preguntas.avif"
          alt=""
          width={800}
          height={700}
          sizes="(max-width: 760px) 55vw, 320px"
        />
      </div>
    </section>
  );
}
