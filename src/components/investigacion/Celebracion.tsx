'use client';
import Link from 'next/link';
import type { NivelContenido } from '@/lib/investigacion/types';
import { getInsignia } from '@/lib/investigacion/badges';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

/**
 * Check animado (solo CSS): anillo que se dibuja, disco que hace pop,
 * trazo del check dibujándose, halos expansivos y destellos de 4 puntas.
 * Ids del gradiente prefijados (`cel-`) para evitar colisiones.
 */
function CheckAnimado() {
  return (
    <div className={styles.celebraCheckWrap} aria-hidden="true">
      <span className={styles.celebraHalo} />
      <span className={`${styles.celebraHalo} ${styles.celebraHalo2}`} />

      <svg className={styles.celebraCheckSvg} viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="cel-verde" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3ddfb0" />
            <stop offset="100%" stopColor="#1f9e79" />
          </linearGradient>
        </defs>
        <circle
          className={styles.celebraAnillo}
          cx="60" cy="60" r="53"
          stroke="url(#cel-verde)"
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <circle className={styles.celebraDisco} cx="60" cy="60" r="43" fill="url(#cel-verde)" />
        <path
          className={styles.celebraCheckPath}
          d="M39 62l15 15 28-32"
          stroke="#fff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* destellos de 4 puntas (misma estrella que Destellos del runner) */}
      {[styles.celebraSparkA, styles.celebraSparkB, styles.celebraSparkC, styles.celebraSparkD].map(
        (cls, i) => (
          <svg key={i} className={`${styles.celebraSpark} ${cls}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0C11 6 14 9 20 10C14 11 11 14 10 20C9 14 6 11 0 10C6 9 9 6 10 0Z" />
          </svg>
        ),
      )}
    </div>
  );
}

export default function Celebracion({
  cierre,
  xpNivel,
  insignias,
  siguienteId,
}: {
  cierre: NivelContenido['cierre'];
  xpNivel: number;
  insignias: string[];
  siguienteId: string | null;
}) {
  return (
    <section className={styles.celebra}>
      <CheckAnimado />

      <span className={styles.celebraKicker}>Misión cumplida</span>
      <h2 className={styles.celebraTitulo}>¡Nivel completado!</h2>
      <p className={styles.celebraXP}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
        </svg>
        +{xpNivel} XP ganados en este nivel
      </p>

      <div className={styles.informe}>
        <h3 className={styles.informeTitulo}>{cierre.titulo}</h3>
        <ul className={styles.informeLista}>
          {cierre.puntosClave.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      {insignias.length > 0 && (
        <div className={styles.celebraInsignias}>
          <p className={styles.celebraInsigniasTitulo}>Insignias de este nivel</p>
          <div className={styles.celebraInsigniasRow}>
            {insignias.map((id) => {
              const ins = getInsignia(id);
              if (!ins) return null;
              return (
                <div key={id} className={styles.celebraInsignia} title={ins.descripcion}>
                  <span><Icono name={ins.icono} /></span>
                  {ins.nombre}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.celebraAcciones}>
        <Link href="/dashboard/investigacion" className={styles.celebraBtnSec}>
          Volver al mapa
        </Link>
        {siguienteId && (
          <Link href={`/dashboard/investigacion/${siguienteId}`} className={styles.celebraBtnPri}>
            Siguiente nivel →
          </Link>
        )}
      </div>
    </section>
  );
}
