'use client';
// Panel lateral "Qué está pasando ahora": resumen, sitio de acción, pH de luz y
// sangre, y los bloques de sangre / orina / ácido-base / electrolitos / clínica.
// Se rellena con la consecuencia curada de la perturbación activa.

import type { Consequence, PhDir } from './engine/types';
import { ACID_BASE_LABEL } from './engine/simulate';
import { type PhPair, phLabel } from './engine/phModel';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import styles from '@/styles/nefronInteractivo.module.css';

interface Props {
  titulo: string;
  consequence: Consequence | null;
  emptyHint: string;
  ph?: PhPair;
  affected?: Set<string>;
  segmentoNombre?: string;
}

function phClass(dir: PhDir): string {
  if (dir === 'acido') return styles.phAcido;
  if (dir === 'basico') return styles.phBasico;
  return styles.phNeutro;
}

export default function ConsequencePanel({ titulo, consequence, emptyHint, ph, affected, segmentoNombre }: Props) {
  const siglas = affected
    ? Array.from(affected).map((id) => TRANSPORTERS[id]?.sigla).filter(Boolean)
    : [];

  return (
    <div className={styles.consPanel}>
      <h4 className={styles.consTitle}>{titulo}</h4>

      {!consequence ? (
        <p className={styles.consEmpty}>{emptyHint}</p>
      ) : (
        <>
          <p className={styles.consResumen}>{consequence.resumen}</p>

          {/* Sitio de acción: segmento + proteínas diana */}
          {(segmentoNombre || siglas.length > 0) && (
            <div className={styles.siteRow}>
              <span className={styles.consLabel}>Sitio de acción</span>
              <p>
                {segmentoNombre}
                {siglas.length > 0 && <span className={styles.siteTargets}> · {siglas.join(' · ')}</span>}
              </p>
            </div>
          )}

          {/* Indicadores de pH en luz y sangre */}
          {ph && (
            <div className={styles.phRow}>
              <span className={`${styles.phChip} ${phClass(ph.lumen)}`}>
                <span className={styles.phChipLabel}>pH luz</span>
                {phLabel(ph.lumen)}
              </span>
              <span className={`${styles.phChip} ${phClass(ph.sangre)}`}>
                <span className={styles.phChipLabel}>pH sangre</span>
                {phLabel(ph.sangre)}
              </span>
            </div>
          )}

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
