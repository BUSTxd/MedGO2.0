'use client';
import Link from 'next/link';
import { HISTO_CURSOS } from '@/lib/data/histologia';
import MicroscopeIcon from '@/components/icons/MicroscopeIcon';
import styles from '@/styles/histologia.module.css';

export default function HistologiaPage() {
  return (
    <>
      <div className={styles.panelIcon}>
        <MicroscopeIcon size={26} />
      </div>

      <h2 className={styles.title}>Histología</h2>
      <p className={styles.sub}>Atlas de preparaciones de laboratorio. Elige un curso para ver sus clases.</p>

      <div className={styles.cursoGrid}>
        {HISTO_CURSOS.map((c) => (
          <Link key={c.id} href={`/dashboard/histologia/${c.id}`} className={styles.cursoCard}>
            <div className={styles.cursoCardTop}>
              <span className={styles.badge} style={{ color: c.badgeColor, background: c.badgeBg }}>
                {c.badge}
              </span>
              <span className={styles.cursoIconWrap}>{c.iconColor}</span>
            </div>
            <h3 className={styles.cursoName}>{c.nombre}</h3>
            <p className={styles.cursoMeta}>Atlas filtrable · {c.clases.length} clases de preparaciones</p>
            <span className={styles.cursoEnter}>Abrir atlas →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
