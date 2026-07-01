'use client';
import Link from 'next/link';
import type { NivelContenido } from '@/lib/investigacion/types';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

/** Mini-gráfico decorativo dentro de cada tarjeta flotante. */
function StatViz({ viz }: { viz?: 'line' | 'dots' | 'curve' }) {
  if (viz === 'dots') {
    return (
      <div className={styles.introStatDots} aria-hidden="true">
        <span className={styles.on} />
        <span className={styles.on} />
        <span className={styles.on} />
        <span />
        <span />
      </div>
    );
  }
  if (viz === 'curve') {
    return (
      <svg className={styles.introStatViz} viewBox="0 0 90 30" fill="none" aria-hidden="true">
        <path d="M2 28 Q22 28 32 16 T60 16 Q70 28 88 28" stroke="currentColor" strokeWidth="1.6" />
        <path d="M45 4 v24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      </svg>
    );
  }
  // line (default)
  return (
    <svg className={styles.introStatViz} viewBox="0 0 90 30" fill="none" aria-hidden="true">
      <path d="M2 24 L20 18 L34 22 L50 10 L66 14 L88 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** Escena decorativa de datos (donut + barras + rejilla), acento heredado de --acento. */
function VisualScene() {
  const C = 376.99; // 2π·60
  const segs = [
    { len: 113.1, off: 0, cls: styles.seg1 },
    { len: 105.6, off: -113.1, cls: styles.seg2 },
    { len: 82.9, off: -218.7, cls: styles.seg3 },
    { len: 75.4, off: -301.6, cls: styles.seg4 },
  ];
  return (
    <svg className={styles.introScene} viewBox="0 0 440 380" fill="none" aria-hidden="true">
      {/* rejilla de puntos */}
      <g className={styles.introDots}>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 5 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={26 + c * 15} cy={26 + r * 15} r="1.6" />
          )),
        )}
      </g>

      {/* anillos concéntricos difusos */}
      <circle className={styles.introRing} cx="250" cy="160" r="118" />
      <circle className={styles.introRing} cx="250" cy="160" r="150" />

      {/* donut segmentado */}
      <g transform="rotate(-90 250 160)">
        {segs.map((s, i) => (
          <circle
            key={i}
            className={s.cls}
            cx="250"
            cy="160"
            r="60"
            strokeWidth="30"
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={s.off}
          />
        ))}
      </g>

      {/* mini barras */}
      <g className={styles.introBars}>
        <rect x="60" y="300" width="16" height="40" rx="3" />
        <rect x="86" y="278" width="16" height="62" rx="3" />
        <rect x="112" y="312" width="16" height="28" rx="3" />
        <rect x="138" y="266" width="16" height="74" rx="3" />
      </g>
    </svg>
  );
}

export default function IntroNivel({
  intro,
  onStart,
}: {
  intro: NivelContenido['intro'];
  onStart: () => void;
}) {
  const stats = intro.stats ?? [];
  const destacados = intro.destacados ?? [];

  return (
    <section className={styles.intro}>
      <Link href="/dashboard/investigacion" className={styles.introVolver}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Volver al mapa
      </Link>

      <div className={styles.introGrid}>
        {/* ── Columna de contenido ── */}
        <div className={styles.introMain}>
          <span className={styles.introKicker}>{intro.kicker}</span>
          <h2 className={styles.introTitulo}>{intro.titulo}</h2>
          <p className={styles.introGancho}>{intro.gancho}</p>

          <ul className={styles.introObjetivos}>
            {intro.objetivos.map((o, i) => (
              <li key={i}>
                <span className={styles.introCheck} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                </span>
                {o}
              </li>
            ))}
          </ul>

          <button className={styles.introBtn} onClick={onStart}>
            <svg className={styles.introBtnIcon} viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.5023 14.3674L20.5319 9.35289C21.2563 8.63072 21.6185 8.26963 21.8092 7.81046C22 7.3513 22 6.84065 22 5.81937V5.33146C22 3.76099 22 2.97576 21.5106 2.48788C21.0213 2 20.2337 2 18.6585 2H18.1691C17.1447 2 16.6325 2 16.172 2.19019C15.7114 2.38039 15.3493 2.74147 14.6249 3.46364L9.59522 8.47817C8.74882 9.32202 8.224 9.84526 8.02078 10.3506C7.95657 10.5103 7.92446 10.6682 7.92446 10.8339C7.92446 11.5238 8.48138 12.0791 9.59522 13.1896L9.74492 13.3388L11.4985 11.5591C11.7486 11.3053 12.1571 11.3022 12.4109 11.5523C12.6647 11.8024 12.6678 12.2109 12.4177 12.4647L10.6587 14.2499L10.7766 14.3674C11.8905 15.4779 12.4474 16.0331 13.1394 16.0331C13.2924 16.0331 13.4387 16.006 13.5858 15.9518C14.1048 15.7607 14.6345 15.2325 15.5023 14.3674ZM17.8652 8.47854C17.2127 9.12904 16.1548 9.12904 15.5024 8.47854C14.8499 7.82803 14.8499 6.77335 15.5024 6.12284C16.1548 5.47233 17.2127 5.47233 17.8652 6.12284C18.5177 6.77335 18.5177 7.82803 17.8652 8.47854Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M2.77409 12.4814C3.07033 12.778 3.07004 13.2586 2.77343 13.5548L2.61779 13.7103C2.48483 13.8431 2.48483 14.058 2.61779 14.1908C2.75125 14.3241 2.96801 14.3241 3.10147 14.1908L4.8136 12.4807C5.1102 12.1845 5.59079 12.1848 5.88704 12.4814C6.18328 12.778 6.18298 13.2586 5.88638 13.5548L4.17426 15.2648C3.4481 15.9901 2.27116 15.9901 1.545 15.2648C0.818334 14.5391 0.818333 13.362 1.545 12.6362L1.70065 12.4807C1.99725 12.1845 2.47784 12.1848 2.77409 12.4814ZM7.29719 16.696C7.5903 16.9957 7.58495 17.4762 7.28525 17.7693L5.55508 19.4614C5.25538 19.7545 4.77481 19.7491 4.48171 19.4494C4.1886 19.1497 4.19395 18.6692 4.49365 18.3761L6.22382 16.684C6.52352 16.3909 7.00409 16.3963 7.29719 16.696ZM11.4811 18.118C11.7774 18.4146 11.7771 18.8952 11.4805 19.1915L9.76834 20.9015C9.63539 21.0343 9.63539 21.2492 9.76834 21.382C9.9018 21.5153 10.1186 21.5153 10.252 21.382L10.4077 21.2265C10.7043 20.9303 11.1849 20.9306 11.4811 21.2272C11.7774 21.5238 11.7771 22.0044 11.4805 22.3006L11.3248 22.4561C10.5987 23.1813 9.42171 23.1813 8.69556 22.4561C7.96889 21.7303 7.96889 20.5532 8.69556 19.8274L10.4077 18.1174C10.7043 17.8211 11.1849 17.8214 11.4811 18.118Z" />
              <g opacity="0.5">
                <path d="M10.8461 5.40925L8.65837 7.59037C8.25624 7.99126 7.88737 8.35901 7.59606 8.69145C7.40899 8.90494 7.22204 9.13861 7.06368 9.39679L7.04237 9.37554C7.00191 9.3352 6.98165 9.31501 6.96133 9.29529C6.58108 8.92635 6.1338 8.63301 5.64342 8.43097C5.61722 8.42018 5.59062 8.40964 5.53743 8.38856L5.2117 8.25949C4.77043 8.08464 4.65283 7.51659 4.9886 7.18184C5.95224 6.22112 7.10923 5.06765 7.6676 4.83597C8.16004 4.63166 8.692 4.56368 9.20505 4.6395C9.67514 4.70897 10.1198 4.95043 10.8461 5.40925Z" />
                <path d="M14.5816 16.8934C14.7579 17.0723 14.8749 17.1987 14.9808 17.3337C15.1204 17.5119 15.2453 17.7012 15.3542 17.8996C15.4767 18.123 15.5718 18.3616 15.7621 18.8389C15.9169 19.2274 16.4315 19.3301 16.7303 19.0322L16.8026 18.9601C17.7662 17.9993 18.9232 16.8458 19.1556 16.2891C19.3605 15.7982 19.4287 15.2678 19.3526 14.7563C19.283 14.2877 19.0408 13.8444 18.5807 13.1205L16.3857 15.3089C15.9745 15.7189 15.5974 16.0949 15.2564 16.3894C15.052 16.5659 14.8284 16.7423 14.5816 16.8934Z" />
              </g>
              <g opacity="0.5">
                <path d="M7.68621 14.5633C7.98263 14.2669 7.98263 13.7863 7.68621 13.4899C7.38979 13.1935 6.90919 13.1935 6.61277 13.4899L4.47036 15.6323C4.17394 15.9287 4.17394 16.4093 4.47036 16.7057C4.76679 17.0021 5.24738 17.0021 5.5438 16.7057L7.68621 14.5633Z" />
                <path d="M10.4954 17.369C10.7918 17.0726 10.7918 16.592 10.4954 16.2956C10.1989 15.9992 9.71835 15.9992 9.42193 16.2956L7.29417 18.4233C6.99774 18.7198 6.99774 19.2003 7.29417 19.4968C7.59059 19.7932 8.07118 19.7932 8.36761 19.4968L10.4954 17.369Z" />
              </g>
            </svg>
            Empezar nivel →
          </button>
        </div>

        {/* ── Columna visual ── */}
        <div className={styles.introVisual}>
          <VisualScene />

          <div className={styles.introBadgeFlota} aria-hidden="true">
            <Icono name="personas" />
          </div>

          {stats.slice(0, 3).map((s, i) => (
            <div key={i} className={`${styles.introStat} ${styles[`introStat${i}`]}`}>
              <span className={styles.introStatLabel}>{s.label}</span>
              <div className={styles.introStatRow}>
                <span className={styles.introStatValor}>{s.valor}</span>
                {s.sub && <span className={styles.introStatSub}>{s.sub}</span>}
              </div>
              <StatViz viz={s.viz} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Franja de destacados ── */}
      {destacados.length > 0 && (
        <div className={styles.introDestacados}>
          {destacados.map((d, i) => (
            <div key={i} className={styles.introDestacado}>
              <span className={styles.introDestIcon}>
                <Icono name={d.icono} />
              </span>
              <span className={styles.introDestTexto}>{d.texto}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
