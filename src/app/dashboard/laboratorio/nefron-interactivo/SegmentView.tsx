'use client';
// Zoom nivel 1: vista del segmento completo. Muestra su función global, la
// reabsorción/secreción por sustancia y las células (unidades funcionales) con
// acceso al zoom celular (nivel 2).

import type { SegmentDef } from './engine/types';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import styles from '@/styles/nefronInteractivo.module.css';

const AGUA_LABEL: Record<string, string> = {
  si: 'Permeable al agua',
  no: 'Impermeable al agua',
  adh: 'Permeable al agua según ADH',
  parcial: 'Permeabilidad parcial al agua',
};

interface Props {
  segment: SegmentDef;
  onSelectCell: (cellId: string) => void;
}

export default function SegmentView({ segment, onSelectCell }: Props) {
  return (
    <div className={styles.segView}>
      <div className={styles.segHead}>
        <span className={styles.segDot} style={{ background: segment.color }} />
        <div>
          <h3 className={styles.segName}>{segment.nombre}</h3>
          {segment.subsegmentos && (
            <span className={styles.segSubs}>{segment.subsegmentos.join(' · ')}</span>
          )}
        </div>
      </div>

      <span className={styles.aguaPill} data-agua={segment.permeableAgua}>
        💧 {AGUA_LABEL[segment.permeableAgua]}
      </span>

      <p className={styles.segDesc}>{segment.descripcion}</p>

      <h4 className={styles.segSub}>Reabsorción / secreción</h4>
      <ul className={styles.reabsList}>
        {segment.reabsorcion.map((r) => (
          <li key={r.sustancia} className={styles.reabsItem}>
            <span className={styles.reabsDot} style={{ background: substanceColor(r.sustancia) }} />
            <span className={styles.reabsSust}>{substanceLabel(r.sustancia)}</span>
            <span className={styles.reabsDet}>{r.detalle}</span>
          </li>
        ))}
      </ul>

      <h4 className={styles.segSub}>Células / unidades funcionales</h4>
      <div className={styles.cellCards}>
        {segment.celulas.map((c) => (
          <div key={c.id} className={styles.cellCard}>
            <div className={styles.cellCardInfo}>
              <strong>{c.nombre}</strong>
              <p>{c.descripcion}</p>
            </div>
            {c.transportadores.length > 0 ? (
              <button className={styles.cellCardBtn} onClick={() => onSelectCell(c.id)}>
                Ver célula →
              </button>
            ) : (
              <span className={styles.cellCardNote}>Sin transporte tubular</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
