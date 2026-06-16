'use client';
// Panel de control del simulador. Selector de modo (individual / grupo), sub-modo
// de grupo (sinergias / cardinales) y las listas interactivas. En individual los
// botones funcionan como "mantener presionado"; en grupo son selección por click.

import type { CSSProperties } from 'react';
import { MUSCLE_LIST, MUSCLES, SYNERGIES, CARDINALS } from './engine/kinematics';
import type { MuscleId } from './engine/muscles';
import type { Mode, GrupoSub } from './EyeSimulator';
import styles from '@/styles/biomecanicaExtraocular.module.css';

interface Props {
  mode: Mode;
  grupoSub: GrupoSub;
  activeMuscle: MuscleId | null;
  groupId: string | null;
  cardinalId: string | null;
  onSwitchMode: (m: Mode) => void;
  onSwitchSub: (s: GrupoSub) => void;
  onMuscleDown: (id: MuscleId) => void;
  onMuscleUp: () => void;
  onSelectGroup: (id: string) => void;
  onSelectCardinal: (id: string) => void;
}

export default function ControlsPanel({
  mode,
  grupoSub,
  activeMuscle,
  groupId,
  cardinalId,
  onSwitchMode,
  onSwitchSub,
  onMuscleDown,
  onMuscleUp,
  onSelectGroup,
  onSelectCardinal,
}: Props) {
  const selMuscle = activeMuscle ? MUSCLES[activeMuscle] : null;
  const selGroup = groupId ? SYNERGIES.find((s) => s.id === groupId) ?? null : null;
  const selCardinal = cardinalId ? CARDINALS.find((c) => c.id === cardinalId) ?? null : null;

  return (
    <aside className={styles.panel}>
      {/* Selector de modo */}
      <div className={styles.segmented} role="group" aria-label="Modo">
        <button
          className={`${styles.segBtn} ${mode === 'individual' ? styles.segActive : ''}`}
          onClick={() => onSwitchMode('individual')}
          aria-pressed={mode === 'individual'}
        >
          Individual
        </button>
        <button
          className={`${styles.segBtn} ${mode === 'grupo' ? styles.segActive : ''}`}
          onClick={() => onSwitchMode('grupo')}
          aria-pressed={mode === 'grupo'}
        >
          Grupo vectorial
        </button>
      </div>

      {mode === 'individual' && (
        <>
          <p className={styles.hint}>
            Mantén presionado un músculo para contraerlo; suelta para volver a la posición primaria.
          </p>
          <div className={styles.muscleGrid}>
            {MUSCLE_LIST.map((m) => (
              <button
                key={m.id}
                className={`${styles.muscleBtn} ${activeMuscle === m.id ? styles.muscleActive : ''}`}
                style={{ '--m': m.color } as CSSProperties}
                onPointerDown={(e) => { e.preventDefault(); onMuscleDown(m.id); }}
                onPointerUp={onMuscleUp}
                onPointerLeave={onMuscleUp}
                onPointerCancel={onMuscleUp}
                onContextMenu={(e) => e.preventDefault()}
              >
                <span className={styles.muscleDot} style={{ background: m.color }} />
                <span className={styles.muscleAbrev}>{m.abrev}</span>
                <span className={styles.muscleName}>{m.nombre}</span>
              </button>
            ))}
          </div>

          {selMuscle ? (
            <div className={styles.info}>
              <h4 className={styles.infoTitle}>{selMuscle.nombre}</h4>
              <p className={styles.infoNerve}>{selMuscle.nervio}</p>
              <ul className={styles.actionList}>
                {selMuscle.acciones.map((a, i) => (
                  <li key={a} className={styles.actionItem}>
                    <span className={styles.actionRank}>
                      {i === 0 ? 'Primaria' : i === 1 ? 'Secundaria' : 'Terciaria'}
                    </span>
                    <span className={styles.actionName}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.infoEmpty}>
              Mantén presionado un músculo (aquí o en el modelo 3D) para ver su acción.
            </p>
          )}
        </>
      )}

      {mode === 'grupo' && (
        <>
          <div className={styles.segmentedSm} role="group" aria-label="Sub-modo de grupo">
            <button
              className={`${styles.segBtnSm} ${grupoSub === 'sinergia' ? styles.segActive : ''}`}
              onClick={() => onSwitchSub('sinergia')}
              aria-pressed={grupoSub === 'sinergia'}
            >
              Sinergias
            </button>
            <button
              className={`${styles.segBtnSm} ${grupoSub === 'cardinal' ? styles.segActive : ''}`}
              onClick={() => onSwitchSub('cardinal')}
              aria-pressed={grupoSub === 'cardinal'}
            >
              Posiciones cardinales
            </button>
          </div>

          {grupoSub === 'sinergia' && (
            <>
              <p className={styles.hint}>
                Pares agonista + sinergista: las acciones secundarias se cancelan y queda un movimiento puro.
              </p>
              <div className={styles.groupGrid}>
                {SYNERGIES.map((g) => (
                  <button
                    key={g.id}
                    className={`${styles.groupBtn} ${groupId === g.id ? styles.groupActive : ''}`}
                    onClick={() => onSelectGroup(g.id)}
                    aria-pressed={groupId === g.id}
                  >
                    <span className={styles.groupLabel}>{g.label}</span>
                    <span className={styles.groupMembers}>{g.members.join(' + ')}</span>
                  </button>
                ))}
              </div>
              {selGroup && (() => {
                const dual = selGroup.members.length > 1;
                return (
                  <div className={styles.info}>
                    <h4 className={styles.infoTitle}>
                      {selGroup.label}{dual ? ' pura' : ''}
                    </h4>
                    <div className={styles.equation}>
                      {selGroup.members.map((id) => {
                        const m = MUSCLES[id];
                        return (
                          <div className={styles.eqRow} key={id}>
                            <span className={styles.eqMuscle} style={{ color: m.color }}>{m.abrev}</span>
                            <span className={styles.eqTerms}>
                              {m.acciones.map((a, i) => (
                                <span key={a}>
                                  {i > 0 && <span className={styles.eqPlus}> + </span>}
                                  <span className={dual && a !== selGroup.label ? styles.eqCancel : styles.eqKeep}>{a}</span>
                                </span>
                              ))}
                            </span>
                          </div>
                        );
                      })}
                      <div className={styles.eqResult}>
                        <span className={styles.eqSum}>Σ =</span>{' '}
                        <strong>{selGroup.label}{dual ? ' pura' : ''}</strong>
                      </div>
                    </div>
                    <p className={styles.infoDesc}>{selGroup.descripcion}</p>
                  </div>
                );
              })()}
            </>
          )}

          {grupoSub === 'cardinal' && (
            <>
              <p className={styles.hint}>
                Las 6 posiciones diagnósticas (patrón en H). Cada una <strong>aísla</strong> el músculo que se
                evalúa; en las oblicuas además se contrae el recto horizontal que lleva el ojo a esa mirada.
              </p>
              <div className={styles.groupGrid}>
                {CARDINALS.map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.groupBtn} ${cardinalId === c.id ? styles.groupActive : ''}`}
                    onClick={() => onSelectCardinal(c.id)}
                    aria-pressed={cardinalId === c.id}
                  >
                    <span className={styles.groupLabel}>{c.label}</span>
                    <span className={styles.groupMembers}>
                      {MUSCLES[c.muscle].abrev}
                      {c.coactive ? ` + ${MUSCLES[c.coactive].abrev}` : ''}
                    </span>
                  </button>
                ))}
              </div>
              {selCardinal && (
                <div className={styles.info}>
                  <h4 className={styles.infoTitle}>{selCardinal.label}</h4>
                  <p className={styles.infoDesc}>
                    Se evalúa: <strong style={{ color: MUSCLES[selCardinal.muscle].color }}>
                      {MUSCLES[selCardinal.muscle].nombre}
                    </strong>{' '}({MUSCLES[selCardinal.muscle].abrev}) · {MUSCLES[selCardinal.muscle].nervio}
                  </p>
                  {selCardinal.coactive ? (
                    <p className={styles.infoDesc}>
                      Co-agonista: <strong style={{ color: MUSCLES[selCardinal.coactive].color }}>
                        {MUSCLES[selCardinal.coactive].nombre}
                      </strong>{' '}({MUSCLES[selCardinal.coactive].abrev})
                      {selCardinal.coactiveRol ? ` — ${selCardinal.coactiveRol}.` : '.'}
                    </p>
                  ) : (
                    <p className={styles.infoDesc}>Mirada horizontal pura: actúa un solo músculo.</p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </aside>
  );
}
