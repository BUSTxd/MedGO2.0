'use client';
import Link from 'next/link';
import type { NivelContenido } from '@/lib/investigacion/types';
import { getInsignia } from '@/lib/investigacion/badges';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

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
      {/* Placeholder de confetti — animación compleja a agregar manualmente */}
      <div
        className="animation-placeholder"
        data-animation="CONFETTI_NIVEL_COMPLETO"
        style={{
          width: '100%',
          height: '160px',
          border: '2px dashed #94a3b8',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#94a3b8',
          fontFamily: 'monospace',
          fontSize: '14px',
          marginBottom: '18px',
        }}
      >
        [ Animación: CONFETTI_NIVEL_COMPLETO — agregar manualmente ]
      </div>

      <div className={styles.celebraCheck}>✓</div>
      <h2 className={styles.celebraTitulo}>¡Nivel completado!</h2>
      <p className={styles.celebraXP}>+{xpNivel} XP en este nivel</p>

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
