'use client';
// Panel lateral "Qué está pasando ahora / Sangre / Orina / Ácido-base / Clínica".
// Se rellena con la consecuencia curada de la perturbación activa.

import type { Consequence } from './engine/types';
import { ACID_BASE_LABEL } from './engine/simulate';
import styles from '@/styles/nefronInteractivo.module.css';

interface Props {
  titulo: string;
  consequence: Consequence | null;
  emptyHint: string;
}

export default function ConsequencePanel({ titulo, consequence, emptyHint }: Props) {
  return (
    <div className={styles.consPanel}>
      <h4 className={styles.consTitle}>{titulo}</h4>

      {!consequence ? (
        <p className={styles.consEmpty}>{emptyHint}</p>
      ) : (
        <>
          <p className={styles.consResumen}>{consequence.resumen}</p>

          <div className={styles.consGrid}>
            <div className={`${styles.consBlock} ${styles.consBlood}`}>
              <span className={styles.consLabel}>Sangre</span>
              <p>{consequence.sangre}</p>
            </div>
            <div className={`${styles.consBlock} ${styles.consUrine}`}>
              <span className={styles.consLabel}>Orina</span>
              <p>{consequence.orina}</p>
            </div>
          </div>

          <div className={`${styles.consBlock} ${styles.consAcid} ${styles[abClass(consequence.acidoBase)]}`}>
            <span className={styles.consLabel}>Ácido-base</span>
            <p>{ACID_BASE_LABEL[consequence.acidoBase] ?? consequence.acidoBase}</p>
          </div>

          {(consequence.potasio || consequence.otros) && (
            <div className={`${styles.consBlock} ${styles.consExtra}`}>
              <span className={styles.consLabel}>Electrolitos</span>
              {consequence.potasio && <p>{consequence.potasio}</p>}
              {consequence.otros && <p>{consequence.otros}</p>}
            </div>
          )}

          <div className={`${styles.consBlock} ${styles.consClinic}`}>
            <span className={styles.consLabel}>Correlato clínico</span>
            <p>{consequence.clinica}</p>
          </div>
        </>
      )}
    </div>
  );
}

function abClass(ab: string): 'abAcid' | 'abAlk' | 'abNone' {
  if (ab === 'acidosis-metabolica') return 'abAcid';
  if (ab === 'alcalosis-metabolica') return 'abAlk';
  return 'abNone';
}
