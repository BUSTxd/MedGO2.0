'use client';
// Zoom nivel 2: célula del segmento con membrana apical / basolateral, lumen,
// citoplasma e intersticio. Cada transportador es una fila con su insignia, las
// partículas-ion animadas en la dirección correcta y un tooltip al hover. Click
// en la insignia → activa/desactiva el transportador (dispara la consecuencia).

import type { CellDef, SegmentDef, TransporterDef } from './engine/types';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { flowDirection } from './engine/simulate';
import styles from '@/styles/nefronInteractivo.module.css';

interface Props {
  segment: SegmentDef;
  cell: CellDef;
  disabled: Set<string>;
  onToggle: (id: string) => void;
}

const MEMBRANE_LABEL: Record<string, string> = {
  apical: 'Apical (lumen)',
  basolateral: 'Basolateral (sangre)',
  paracelular: 'Paracelular',
};

export default function CellView({ segment, cell, disabled, onToggle }: Props) {
  const transporters = cell.transportadores
    .map((id) => TRANSPORTERS[id])
    .filter(Boolean) as TransporterDef[];

  return (
    <div className={styles.cellView}>
      {/* Esquema de compartimentos */}
      <div className={styles.cellBands}>
        <div className={`${styles.cellBand} ${styles.bandLumen}`}>
          <span>Lumen tubular</span>
        </div>
        <div className={styles.membraneBar} title="Membrana apical" />
        <div className={`${styles.cellBand} ${styles.bandCyto}`}>
          <span>Citoplasma</span>
        </div>
        <div className={styles.membraneBar} title="Membrana basolateral" />
        <div className={`${styles.cellBand} ${styles.bandBlood}`}>
          <span>Intersticio / capilar</span>
        </div>
      </div>

      <p className={styles.cellDesc}>{cell.descripcion}</p>

      <ul className={styles.transList}>
        {transporters.map((t) => {
          const off = disabled.has(t.id);
          return (
            <li key={t.id} className={`${styles.transRow} ${off ? styles.transOff : ''}`}>
              <button
                className={styles.transBtn}
                onClick={() => onToggle(t.id)}
                aria-pressed={!off}
                title={off ? 'Activar transportador' : 'Desactivar transportador'}
              >
                <span className={styles.transMemTag}>{MEMBRANE_LABEL[t.membrana]}</span>
                <span className={styles.transBadge} style={{ borderColor: segment.color }}>
                  {t.sigla}
                  {t.usaAtp && <span className={styles.atp} title="Consume ATP">⚡</span>}
                </span>

                {t.receptor ? (
                  <span className={styles.transIons}>
                    <span className={styles.receptorChip}>receptor</span>
                  </span>
                ) : (
                  <span className={styles.transIons}>
                    {t.mueve.map((m, i) => {
                      const dir = flowDirection(t.membrana, m);
                      return (
                        <span
                          key={i}
                          className={`${styles.ionChip} ${off ? '' : dir === 'right' ? styles.flowRight : styles.flowLeft}`}
                          style={{ background: substanceColor(m.sustancia) }}
                        >
                          {substanceLabel(m.sustancia)}
                          {m.n && m.n > 1 ? `×${m.n}` : ''}
                          <span className={styles.ionArrow}>{dir === 'right' ? '→' : '←'}</span>
                        </span>
                      );
                    })}
                  </span>
                )}

                <span className={styles.transFn}>{t.funcionBreve}</span>
                {off && <span className={styles.offTag}>Bloqueado</span>}
              </button>

              {/* Tooltip al hover */}
              <div className={styles.transTooltip} role="tooltip">
                <strong>{t.nombre} ({t.sigla})</strong>
                <span className={styles.tipMeta}>{MEMBRANE_LABEL[t.membrana]} · {segment.nombre}</span>
                <p>{t.funcionAvanzada}</p>
                <p className={styles.tipClin}>🩺 {t.relevanciaClinica}</p>
                {t.asociado && <p className={styles.tipAssoc}>{t.asociado}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
