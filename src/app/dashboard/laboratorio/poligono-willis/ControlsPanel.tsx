'use client';
// Barra lateral del lab, con el mismo diseño que la de Médula Espinal 3D: arriba
// el selector fijo (aquí «Sistema» en lugar de «Nivel medular»), debajo la ficha
// de lo elegido y al final la lista de la vista activa, con su propio scroll.
// Las clases vienen del CSS de médula para que los dos labs sean idénticos; lo
// propio de Willis (pestañas de la ficha, perla de examen) va en su módulo.

import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  ARTERIAS, ARTERIA_LIST, GRUPOS, SISTEMAS, TERRITORIOS, TERRITORIO_LIST, REFERENCIAS, REFERENCIA_LIST,
  enSistema,
  type ArteriaId, type SistemaId, type TerritorioId, type ReferenciaId,
} from './engine/anatomia';
import { VARIANTES, VARIANTE_LIST, SINDROMES, SINDROME_LIST, type VarianteId, type SindromeId } from './engine/clinica';
import type { Elegido, ModoWillis } from './WillisSimulator';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';

export const MODOS: Array<{ key: ModoWillis; label: string; desc: string }> = [
  { key: 'arterias', label: 'Arterias', desc: 'Cada arteria: origen, trayecto, ramas, irrigación y clínica' },
  { key: 'territorios', label: 'Territorios', desc: 'Qué irriga cada arteria, coloreado en el modelo' },
  { key: 'variantes', label: 'Variantes', desc: 'Variantes anatómicas del polígono y por qué importan' },
  { key: 'clinico', label: 'Clínico', desc: 'Aneurismas e ictus: qué arteria y qué síntomas' },
];

const ROJO = '#c0392b';
const VIOLETA = '#7c5cd6';
const AMBAR = '#f2b631';

type Pestana = 'anatomia' | 'irrigacion' | 'clinica';

interface Props {
  mode: ModoWillis;
  sistema: SistemaId;
  onSistema: (s: SistemaId) => void;
  elegido: Elegido;
  territorio: TerritorioId | null;
  variante: VarianteId;
  sindrome: SindromeId | null;
  refs: Record<ReferenciaId, boolean>;
  onElegirArteria: (id: ArteriaId) => void;
  /** Abre la ficha de una arteria desde otra vista. */
  onVerArteria: (id: ArteriaId) => void;
  onTerritorio: (id: TerritorioId | null) => void;
  onVerTerritorio: (id: TerritorioId) => void;
  onVariante: (id: VarianteId) => void;
  onSindrome: (id: SindromeId | null) => void;
  onRef: (id: ReferenciaId) => void;
  onSenalar: (e: Elegido) => void;
}

function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className={styles.structureDot}
      style={{ background: color, width: size, height: size } as CSSProperties}
      aria-hidden
    />
  );
}

function Interruptor({ activo, onCambio, etiqueta, color, detalle }: {
  activo: boolean;
  onCambio: () => void;
  etiqueta: string;
  color?: string;
  detalle?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={activo} onClick={onCambio} className={styles.toggleRow}>
      <span className={styles.toggleLabel}>
        {color && <Dot color={color} />}
        <span className={styles.toggleTextos}>
          <span className={styles.structureName}>{etiqueta}</span>
          {detalle && <span className={styles.toggleDetalle}>{detalle}</span>}
        </span>
      </span>
      <span className={`${styles.toggleSwitch} ${activo ? styles.toggleOn : ''}`} aria-hidden />
    </button>
  );
}

function Ficha({ color, titulo, sub, children }: { color?: string; titulo: string; sub?: string; children?: ReactNode }) {
  return (
    <div className={styles.info} role="region" aria-label={titulo}>
      <div className={styles.infoHead}>
        {color && <Dot color={color} size={12} />}
        <h3 className={styles.infoTitle}>{titulo}</h3>
      </div>
      {sub && <p className={styles.infoSub}>{sub}</p>}
      {children}
    </div>
  );
}

function Vacio({ children }: { children: ReactNode }) {
  return <p className={styles.infoEmpty}>{children}</p>;
}

function BotonLista({ activo, onClick, onEnter, onLeave, children }: {
  activo: boolean;
  onClick: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={`${styles.structureBtn} ${activo ? styles.structureActive : ''}`}
      onClick={onClick}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}

/** Título de un apartado de la ficha. */
function Apartado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className={ws.apartado}>
      <span className={styles.grupoTitulo}>{titulo}</span>
      {children}
    </div>
  );
}

/** El dato que más se pregunta, con su bombilla. */
function Perla({ children }: { children: ReactNode }) {
  return (
    <p className={ws.perla}>
      <svg className={ws.perlaIcono} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
      <span><strong>Para el examen.</strong> {children}</span>
    </p>
  );
}

/** Chips de arterias que llevan a su ficha. */
function ChipsArterias({ ids, color, onVer }: { ids: ArteriaId[]; color: string; onVer: (id: ArteriaId) => void }) {
  return (
    <ul className={styles.chips}>
      {ids.map((id) => (
        <li key={id}>
          <button type="button" className={`${styles.chip} ${ws.chipBoton}`} onClick={() => onVer(id)} title={`Ver la ficha de ${ARTERIAS[id].nombre}`}>
            <Dot color={color} /> {ARTERIAS[id].corto}
          </button>
        </li>
      ))}
    </ul>
  );
}

function FichaArteria({ id, lado, pestana, onPestana, onVerTerritorio }: {
  id: ArteriaId;
  lado: 'i' | 'd' | 'm';
  pestana: Pestana;
  onPestana: (p: Pestana) => void;
  onVerTerritorio: (t: TerritorioId) => void;
}) {
  const a = ARTERIAS[id];
  const terr = TERRITORIOS[a.territorio];
  const grupo = GRUPOS.find((g) => g.id === a.grupo)!.nombre;
  const ladoTxt = a.par ? (lado === 'd' ? 'Lado derecho (es par)' : 'Lado izquierdo (es par)') : 'De línea media';
  const PESTANAS: Array<{ key: Pestana; label: string }> = [
    { key: 'anatomia', label: 'Anatomía' },
    { key: 'irrigacion', label: 'Irrigación' },
    { key: 'clinica', label: 'Clínica' },
  ];
  return (
    <Ficha color={ROJO} titulo={a.nombre} sub={a.resumen}>
      <ul className={styles.chips} aria-label="Datos">
        <li className={styles.chip}>{grupo}</li>
        <li className={styles.chip}>{ladoTxt}</li>
        <li className={styles.chip}>Calibre {a.calibre}</li>
      </ul>

      <div className={ws.pestanas} role="tablist" aria-label="Apartados de la ficha">
        {PESTANAS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={pestana === p.key}
            className={pestana === p.key ? ws.pestanaActiva : ws.pestana}
            onClick={() => onPestana(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {pestana === 'anatomia' && (
        <div className={ws.cuerpo} role="tabpanel">
          <Apartado titulo="Origen"><p className={styles.infoDesc}>{a.origen}</p></Apartado>
          <Apartado titulo="Trayecto"><p className={styles.infoDesc}>{a.trayecto}</p></Apartado>
          <Apartado titulo="Ramas">
            <ul className={styles.infoLista}>
              {a.ramas.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Apartado>
        </div>
      )}

      {pestana === 'irrigacion' && (
        <div className={ws.cuerpo} role="tabpanel">
          <Apartado titulo="Qué irriga"><p className={styles.infoDesc}>{a.irriga}</p></Apartado>
          <Apartado titulo="Territorio">
            <ul className={styles.chips}>
              <li>
                <button type="button" className={`${styles.chip} ${ws.chipBoton}`} onClick={() => onVerTerritorio(terr.id)}>
                  <Dot color={terr.color} /> {terr.nombre} →
                </button>
              </li>
            </ul>
          </Apartado>
        </div>
      )}

      {pestana === 'clinica' && (
        <div className={ws.cuerpo} role="tabpanel">
          <Apartado titulo="Patología"><p className={styles.infoDesc}>{a.clinica}</p></Apartado>
          <Perla>{a.perla}</Perla>
        </div>
      )}
    </Ficha>
  );
}

export default function ControlsPanel(props: Props) {
  const {
    mode, sistema, onSistema, elegido, territorio, variante, sindrome, refs,
    onElegirArteria, onVerArteria, onTerritorio, onVerTerritorio, onVariante, onSindrome, onRef, onSenalar,
  } = props;
  const [pestana, setPestana] = useState<Pestana>('anatomia');

  let cabeza: ReactNode = null;
  let ficha: ReactNode = null;
  let lista: ReactNode = null;

  const arteriaElegida = elegido?.kind === 'arteria' ? elegido : null;
  const refElegida = elegido?.kind === 'ref' ? REFERENCIAS[elegido.id] : null;

  // En las otras vistas, tocar una arteria del modelo ofrece abrir su ficha.
  const irAFicha = arteriaElegida && mode !== 'arterias' ? (
    <button type="button" className={styles.ctaBtn} onClick={() => onVerArteria(arteriaElegida.id)}>
      Ver la ficha de {ARTERIAS[arteriaElegida.id].corto} →
    </button>
  ) : null;

  const fichaRef = refElegida ? (
    <Ficha color={refElegida.color} titulo={refElegida.nombre} sub="Referencia anatómica">
      <p className={styles.infoDesc}>{refElegida.desc}</p>
    </Ficha>
  ) : null;

  if (mode === 'arterias') {
    ficha = arteriaElegida ? (
      <FichaArteria
        id={arteriaElegida.id}
        lado={arteriaElegida.lado}
        pestana={pestana}
        onPestana={setPestana}
        onVerTerritorio={onVerTerritorio}
      />
    ) : fichaRef ?? (
      <Vacio>Toca una arteria en el modelo o en la lista para ver su anatomía, lo que irriga y su patología.</Vacio>
    );
    lista = (
      <>
        {GRUPOS.map((g) => {
          const arts = ARTERIA_LIST.filter((a) => a.grupo === g.id && enSistema(a, sistema));
          if (arts.length === 0) return null;
          return (
            <div key={g.id} className={styles.listSection}>
              <div className={styles.listTitle}>{g.nombre}</div>
              <div className={styles.structureList}>
                {arts.map((a) => (
                  <BotonLista
                    key={a.id}
                    activo={arteriaElegida?.id === a.id}
                    onClick={() => onElegirArteria(a.id)}
                    onEnter={() => onSenalar({ kind: 'arteria', id: a.id, lado: a.par ? 'i' : 'm' })}
                    onLeave={() => onSenalar(null)}
                  >
                    <Dot color={ROJO} />
                    <span className={styles.structureName}>{a.nombre}</span>
                    <span className={styles.structureDir}>{a.corto}</span>
                  </BotonLista>
                ))}
              </div>
            </div>
          );
        })}
        <span className={`${styles.grupoTitulo} ${ws.separado}`}>Mostrar en el modelo</span>
        {REFERENCIA_LIST.map((r) => (
          <Interruptor key={r.id} activo={refs[r.id]} onCambio={() => onRef(r.id)} etiqueta={r.nombre} color={r.color} />
        ))}
        <p className={styles.notaPie}>Modelo didáctico: el trayecto y el orden de calibres son reales; las medidas, aproximadas.</p>
      </>
    );
  }

  if (mode === 'territorios') {
    const t = territorio ? TERRITORIOS[territorio] : null;
    const arts = t ? ARTERIA_LIST.filter((a) => a.territorio === t.id).map((a) => a.id) : [];
    ficha = t ? (
      <Ficha color={t.color} titulo={`Territorio: ${t.nombre}`} sub={t.resumen}>
        {irAFicha}
        <Apartado titulo="Qué irriga">
          <ul className={styles.infoLista}>
            {t.areas.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </Apartado>
        <Apartado titulo="Si se ocluye"><p className={styles.infoDesc}>{t.deficit}</p></Apartado>
        <Apartado titulo="Arterias de este territorio">
          <ChipsArterias ids={arts} color={t.color} onVer={onVerArteria} />
        </Apartado>
      </Ficha>
    ) : fichaRef ?? (
      <Vacio>Toca un territorio o una arteria: el modelo resalta las arterias que lo irrigan.</Vacio>
    );
    lista = (
      <div className={styles.structureList}>
        {TERRITORIO_LIST.map((x) => (
          <BotonLista key={x.id} activo={territorio === x.id} onClick={() => onTerritorio(territorio === x.id ? null : x.id)}>
            <Dot color={x.color} />
            <span className={styles.structureName}>{x.nombre}</span>
          </BotonLista>
        ))}
      </div>
    );
  }

  if (mode === 'variantes') {
    const v = VARIANTES[variante];
    cabeza = (
      <div className={styles.leyenda} aria-label="Leyenda de colores">
        <span className={styles.leyendaItem}><Dot color={AMBAR} /> Lo que cambia respecto al polígono clásico</span>
      </div>
    );
    const cambiadas = [...new Set(v.cambios.map((c) => c.arteria))];
    ficha = (
      <Ficha color={variante === 'completo' ? ROJO : AMBAR} titulo={v.nombre} sub={v.frecuencia}>
        {irAFicha}
        <p className={styles.infoDesc}>{v.desc}</p>
        <Apartado titulo="Por qué importa"><p className={styles.infoDesc}>{v.importancia}</p></Apartado>
        {cambiadas.length > 0 && (
          <Apartado titulo="Arterias que cambian">
            <ChipsArterias ids={cambiadas} color={AMBAR} onVer={onVerArteria} />
          </Apartado>
        )}
      </Ficha>
    );
    lista = (
      <div className={styles.structureList}>
        {VARIANTE_LIST.map((x) => (
          <BotonLista key={x.id} activo={variante === x.id} onClick={() => onVariante(x.id)}>
            <Dot color={x.id === 'completo' ? ROJO : AMBAR} />
            <span className={styles.structureName}>{x.nombre}</span>
          </BotonLista>
        ))}
      </div>
    );
  }

  if (mode === 'clinico') {
    const s = sindrome ? SINDROMES[sindrome] : null;
    cabeza = (
      <div className={styles.leyenda} aria-label="Leyenda de colores">
        <span className={styles.leyendaItem}><Dot color={VIOLETA} /> Afectado</span>
        <span className={styles.leyendaItem}><Dot color="#d8453a" /> Saco del aneurisma</span>
      </div>
    );
    ficha = s ? (
      <Ficha titulo={s.nombre} sub={s.desc}>
        {irAFicha}
        {s.frecuencia && <p className={styles.infoNota}>{s.frecuencia}</p>}
        <Apartado titulo="Clínica">
          <ul className={styles.infoLista}>
            {s.clinica.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </Apartado>
        <Apartado titulo="Mecanismo"><p className={styles.infoDesc}>{s.mecanismo}</p></Apartado>
        <Apartado titulo={s.lado === 'i' ? 'Arterias afectadas (lado izquierdo)' : 'Arterias afectadas'}>
          <ChipsArterias ids={s.arterias} color={VIOLETA} onVer={onVerArteria} />
        </Apartado>
        <Perla>{s.perla}</Perla>
      </Ficha>
    ) : fichaRef ?? (
      <Vacio>Elige un aneurisma o un síndrome: el modelo resalta la arteria afectada.</Vacio>
    );
    lista = (
      <>
        {(['aneurisma', 'isquemia'] as const).map((tipo) => (
          <div key={tipo} className={styles.listSection}>
            <div className={styles.listTitle}>{tipo === 'aneurisma' ? 'Aneurismas' : 'Ictus isquémico'}</div>
            <div className={styles.structureList}>
              {SINDROME_LIST.filter((x) => x.tipo === tipo).map((x) => (
                <BotonLista key={x.id} activo={sindrome === x.id} onClick={() => onSindrome(sindrome === x.id ? null : x.id)}>
                  <span className={styles.structureName}>{x.nombre}</span>
                </BotonLista>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <aside className={styles.panel} aria-label={`Panel de ${MODOS.find((m) => m.key === mode)?.label ?? ''}`}>
      <div className={styles.panelNivel}>
        <span className={styles.grupoTitulo} id="pw-sistema">Sistema</span>
        <div className={styles.niveles} role="group" aria-labelledby="pw-sistema">
          {SISTEMAS.map((s) => (
            <button
              key={s.id}
              type="button"
              title={s.desc}
              aria-pressed={sistema === s.id}
              className={sistema === s.id ? styles.nivelActivo : styles.nivel}
              onClick={() => onSistema(s.id)}
            >
              <strong>{s.nombre}</strong>
              <span>{s.sub}</span>
            </button>
          ))}
        </div>
      </div>
      {cabeza && <div className={styles.panelCabeza}>{cabeza}</div>}
      {ficha && <div className={styles.panelFicha}>{ficha}</div>}
      {lista && <div className={styles.panelLista}>{lista}</div>}
    </aside>
  );
}
