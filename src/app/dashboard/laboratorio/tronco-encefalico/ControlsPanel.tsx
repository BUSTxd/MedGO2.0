'use client';
// Barra lateral del lab, con el diseño de Médula Espinal 3D y la ficha de
// Polígono de Willis (patrón Nielsen: cabecera fija con ‹ › ✕, lo esencial,
// perla «Para el examen»). Arriba, lo que afecta a todo el modelo (orientación
// o nivel del corte); debajo la ficha de lo elegido y al final la lista de la
// vista activa, con su propio scroll.

import { useMemo, useState, type ReactNode } from 'react';
import {
  Dot, Interruptor, Vacio, BotonLista, Perla, CabezaFicha, Esencial, Buscador,
  navegar, normal, useTecladoFicha, type Navegacion,
} from '@/components/laboratorio/FichaLab';
import { ESTRUCTURAS, ESTRUCTURA_LIST, GRUPOS, estructuraDe, esCorte } from './engine/anatomia';
import { NERVIOS, NERVIO } from './engine/nervios';
import { INTERIOR, INTERIOR_LIST, COLUMNAS, GRUPOS_INTERIOR, type Columna, type ParId } from './engine/interior';
import { SINDROMES, SINDROME, LADO_TEXTO, type Lado } from './engine/clinica';
import { NIVELES, NIVEL, calcularCorte } from './engine/cortes';
import type { Elegido, Modo, EstadoCerebelo, Vista } from './TroncoSimulator';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';
import ts from '@/styles/troncoEncefalico.module.css';

export const MODOS: Array<{ key: Modo; label: string; desc: string }> = [
  { key: 'anatomia', label: 'Anatomía', desc: 'Relieves de la superficie: toca uno para ver qué es' },
  { key: 'nervios', label: 'Pares craneales', desc: 'Del III al XII: dónde salen, sus núcleos y su lesión' },
  { key: 'nucleos', label: 'Núcleos y vías', desc: 'El interior: núcleos por columna funcional y vías largas' },
  { key: 'cortes', label: 'Cortes', desc: 'Cortes transversales a los niveles del atlas' },
  { key: 'clinico', label: 'Clínico', desc: 'Síndromes del tronco: dónde está la lesión y qué explica cada signo' },
];

const VISTAS: Array<{ key: Vista; label: string }> = [
  { key: 'anterior', label: 'Anterior' },
  { key: 'lateral', label: 'Lateral' },
  { key: 'posterior', label: 'Posterior' },
];

const LADO_NOMBRE = { i: 'izquierdo', d: 'derecho' } as const;

interface Props {
  modo: Modo;
  vista: Vista;
  onVista: (v: Vista) => void;
  cerebelo: EstadoCerebelo;
  onCerebelo: (c: EstadoCerebelo) => void;
  elegido: Elegido;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  nivel: string;
  onNivel: (n: string) => void;
  sindrome: string | null;
  onSindrome: (s: string | null) => void;
  onSigno: (id: string | null) => void;
  mostrarNervios: boolean;
  onMostrarNervios: () => void;
  mostrarVias: boolean;
  onMostrarVias: () => void;
  onVerInterior: (id: string) => void;
  onVerNervio: (id: ParId) => void;
}

/** Enlaces en línea a otras fichas. */
function Enlaces<T extends string>({ ids, nombre, onVer }: { ids: T[]; nombre: (id: T) => string; onVer: (id: T) => void }) {
  return (
    <span className={ws.enlaces}>
      {ids.map((id, k) => (
        <span key={id}>
          {k > 0 && <span className={ws.enlacesSep} aria-hidden> · </span>}
          <button type="button" className={ws.enlaceTerr} onClick={() => onVer(id)}>{nombre(id)}</button>
        </span>
      ))}
    </span>
  );
}

function Componentes({ cols }: { cols: Columna[] }) {
  return (
    <span className={ts.componentes}>
      {cols.map((c) => (
        <span key={c} className={ts.componente}><Dot color={COLUMNAS[c].color} size={8} /> {COLUMNAS[c].corto}</span>
      ))}
    </span>
  );
}

// ── Fichas ──────────────────────────────────────────────────────────────────

function FichaEstructura({ id, nav }: { id: string; nav: Navegacion }) {
  const e = estructuraDe(id)!;
  const g = GRUPOS.find((x) => x.id === e.grupo)!;
  return (
    <div className={styles.info} role="region" aria-label={e.nombre}>
      <CabezaFicha insignia={<span className={ts.insignia} style={{ background: g.color }} aria-hidden />} titulo={e.nombre} meta={<>{g.nombre} · cara {e.cara}</>} nav={nav} />
      {esCorte(id) && <p className={ts.nota}>Estás tocando su superficie de corte: aquí se seccionó para retirar el cerebelo o separar el tronco.</p>}
      <p className={ws.fichaLead}>{e.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Qué contiene', valor: e.contiene },
        { rotulo: 'Clínica', valor: e.clinica },
      ]} />
      {e.perla && <Perla>{e.perla}</Perla>}
    </div>
  );
}

function FichaNervio({ id, lado, nav, onVerInterior }: { id: ParId; lado: 'i' | 'd'; nav: Navegacion; onVerInterior: (id: string) => void }) {
  const n = NERVIO[id];
  const nucleos = n.nucleos.filter((x) => INTERIOR[x]?.tipo === 'nucleo_par');
  return (
    <div className={styles.info} role="region" aria-label={`${n.id} ${n.nombre}`}>
      <CabezaFicha
        insignia={<span className={ws.sigla} style={{ background: n.color, color: '#fff', borderColor: n.color }}>{n.id}</span>}
        titulo={n.nombre}
        meta={<>{n.tipo} · lado {LADO_NOMBRE[lado]}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{n.funcion}</p>
      <Esencial filas={[
        { rotulo: 'Emerge', valor: n.emerge },
        { rotulo: 'Sale del cráneo', valor: n.sale },
        { rotulo: 'Componentes', valor: <Componentes cols={n.componentes} /> },
        { rotulo: 'Núcleos', valor: <Enlaces ids={nucleos} nombre={(x) => INTERIOR[x].nombre.replace(/^Núcleo (del |de la |de )?/, '')} onVer={onVerInterior} /> },
        { rotulo: 'Si se lesiona', valor: n.lesion },
      ]} />
      <Perla>{n.perla}</Perla>
      <p className={ts.nota}>Sus núcleos se ven dentro del tronco, que se vuelve de cristal mientras el nervio está elegido.</p>
    </div>
  );
}

function FichaInterior({ id, lado, nav, onVerNervio }: { id: string; lado: 'i' | 'd'; nav: Navegacion; onVerNervio: (id: ParId) => void }) {
  const x = INTERIOR[id];
  const tipo = x.columna ? COLUMNAS[x.columna].nombre : x.tipo === 'via' ? 'Vía' : x.tipo === 'fibras' ? 'Fibras de un par' : 'Núcleo';
  return (
    <div className={styles.info} role="region" aria-label={x.nombre}>
      <CabezaFicha
        insignia={<span className={ts.insignia} style={{ background: x.color }} aria-hidden />}
        titulo={x.nombre}
        meta={<>{tipo}{x.impar ? '' : ` · lado ${LADO_NOMBRE[lado]}`}</>}
        nav={nav}
      />
      <Esencial filas={[
        { rotulo: 'Dónde', valor: x.nivel },
        { rotulo: 'Qué hace', valor: x.funcion },
        { rotulo: 'Si se lesiona', valor: x.lesion },
        ...(x.pares ? [{ rotulo: 'Par craneal', valor: <Enlaces ids={x.pares} nombre={(p) => `${p} · ${NERVIO[p].nombre}`} onVer={onVerNervio} /> }] : []),
      ]} />
      {x.perla && <Perla>{x.perla}</Perla>}
    </div>
  );
}

const COLOR_LADO: Record<Lado, string> = { ipsi: ts.ladoIpsi, contra: ts.ladoContra, bilateral: ts.ladoBilateral };

function FichaSindrome({ id, nav, onSigno }: { id: string; nav: Navegacion; onSigno: (id: string | null) => void }) {
  const s = SINDROME[id];
  return (
    <div className={styles.info} role="region" aria-label={s.nombre}>
      <CabezaFicha insignia={<span className={ts.insignia} style={{ background: '#7c5cd6' }} aria-hidden />} titulo={s.nombre} meta={<>{s.nivel}</>} nav={nav} />
      <p className={ws.fichaLead}>{s.resumen}</p>
      <Esencial filas={[{ rotulo: 'Arteria', valor: s.arteria }]} />
      <h4 className={ts.subtitulo}>Cada signo y lo que lo explica</h4>
      <ul className={ts.signos}>
        {s.signos.map((g) => {
          const x = INTERIOR[g.id];
          const ext = ESTRUCTURAS[g.id];
          const nombre = x?.nombre ?? ext?.nombre ?? g.id;
          const color = x?.color ?? '#7c5cd6';
          return (
            <li key={g.id + g.signo} onPointerEnter={() => onSigno(g.id)} onPointerLeave={() => onSigno(null)}>
              <span className={ts.signoTexto}>
                <strong>{g.signo}</strong>
                <span className={ts.signoCausa}><Dot color={color} size={8} /> {nombre}</span>
              </span>
              <span className={`${ts.lado} ${COLOR_LADO[g.lado]}`}>{s.medial ? 'bilateral' : LADO_TEXTO[g.lado]}</span>
            </li>
          );
        })}
      </ul>
      <Esencial filas={[{ rotulo: 'Respeta', valor: s.respeta }]} />
      <Perla>{s.perla}</Perla>
    </div>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────

export default function ControlsPanel(p: Props) {
  const [busca, setBusca] = useState('');
  const { modo, elegido, onElegir, onSenalar } = p;
  const cerrar = () => onElegir(null);

  // Listas navegables de cada vista (para ‹ › y las flechas del teclado).
  const listaEst = useMemo(() => ESTRUCTURA_LIST.filter((e) => e.grupo !== 'cerebelo' || p.cerebelo !== 'retirado'), [p.cerebelo]);
  const listaInt = useMemo(() => INTERIOR_LIST.filter((x) => x.tipo !== 'fibras' && (p.mostrarVias || x.tipo !== 'via')), [p.mostrarVias]);
  const corte = useMemo(() => (modo === 'cortes' ? calcularCorte(NIVEL[p.nivel].y) : null), [modo, p.nivel]);
  const enCorte = useMemo(() => {
    if (!corte) return [];
    const vistos = new Set<string>();
    return corte.ids.filter((x) => x.id && !vistos.has(x.id) && vistos.add(x.id)).map((x) => INTERIOR[x.id]);
  }, [corte]);

  let nav: Navegacion | null = null;
  let ficha: ReactNode = null;
  if (elegido?.kind === 'estructura' && estructuraDe(elegido.id)) {
    const est = estructuraDe(elegido.id)!;
    nav = navegar(listaEst.map((e) => e.id), est.id, (id) => onElegir({ kind: 'estructura', id }), 'estructura', cerrar);
    ficha = <FichaEstructura id={elegido.id} nav={nav} />;
  } else if (elegido?.kind === 'nervio') {
    nav = navegar(NERVIOS.map((n) => n.id), elegido.id, (id) => onElegir({ kind: 'nervio', id, lado: elegido.lado }), 'par craneal', cerrar);
    ficha = <FichaNervio id={elegido.id} lado={elegido.lado} nav={nav} onVerInterior={p.onVerInterior} />;
  } else if (elegido?.kind === 'interior' && INTERIOR[elegido.id]) {
    const lista = modo === 'cortes' ? enCorte.map((x) => x.id) : listaInt.map((x) => x.id);
    nav = navegar(lista, elegido.id, (id) => onElegir({ kind: 'interior', id, lado: elegido.lado }), 'estructura', cerrar);
    ficha = <FichaInterior id={elegido.id} lado={elegido.lado} nav={nav} onVerNervio={p.onVerNervio} />;
  } else if (modo === 'clinico' && p.sindrome) {
    nav = navegar(SINDROMES.map((s) => s.id), p.sindrome, (id) => p.onSindrome(id), 'síndrome', () => p.onSindrome(null));
    ficha = <FichaSindrome id={p.sindrome} nav={nav} onSigno={p.onSigno} />;
  }
  useTecladoFicha(nav);

  // ── Cabecera fija: orientación o nivel del corte ──
  const cabeza = modo === 'cortes' ? (
    <div className={styles.panelNivel}>
      <span className={styles.grupoTitulo} id="te-nivel">Nivel del corte</span>
      <div className={styles.niveles} role="group" aria-labelledby="te-nivel">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            type="button"
            title={n.nombre}
            aria-pressed={p.nivel === n.id}
            className={p.nivel === n.id ? styles.nivelActivo : styles.nivel}
            onClick={() => p.onNivel(n.id)}
          >
            <strong>{n.corto}</strong>
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div className={styles.panelNivel}>
      <span className={styles.grupoTitulo} id="te-vista">Mirar desde</span>
      <div className={`${styles.niveles} ${ts.tres}`} role="group" aria-labelledby="te-vista">
        {VISTAS.map((v) => (
          <button
            key={v.key}
            type="button"
            aria-pressed={p.vista === v.key}
            className={p.vista === v.key ? styles.nivelActivo : styles.nivel}
            onClick={() => p.onVista(v.key)}
          >
            <strong>{v.label}</strong>
          </button>
        ))}
      </div>
      {(modo === 'anatomia' || modo === 'nervios') && p.vista === 'posterior' && p.cerebelo === 'sitio' && (
        <p className={ts.aviso}>
          El cerebelo tapa toda la cara posterior.{' '}
          <button type="button" className={ws.enlaceTerr} onClick={() => p.onCerebelo('retirado')}>Retíralo</button>
          {' '}para ver el IV ventrículo, como en la disección.
        </p>
      )}
    </div>
  );

  // ── Lista de la vista ──
  let lista: ReactNode = null;
  const q = normal(busca.trim());

  if (modo === 'anatomia') {
    const filtradas = listaEst.filter((e) => !q || normal(e.nombre).includes(q));
    lista = (
      <>
        <Buscador valor={busca} onCambio={setBusca} placeholder="Buscar: oliva, colículo…" etiqueta="Buscar una estructura" />
        {GRUPOS.map((g) => {
          const items = filtradas.filter((e) => e.grupo === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id} className={styles.listSection}>
              <div className={styles.listTitle}>{g.nombre}</div>
              <div className={styles.structureList}>
                {items.map((e) => (
                  <BotonLista
                    key={e.id}
                    activo={elegido?.kind === 'estructura' && estructuraDe(elegido.id)?.id === e.id}
                    onClick={() => onElegir(elegido?.kind === 'estructura' && estructuraDe(elegido.id)?.id === e.id ? null : { kind: 'estructura', id: e.id })}
                    onEnter={() => onSenalar({ kind: 'estructura', id: e.id })}
                    onLeave={() => onSenalar(null)}
                  >
                    <Dot color={g.color} />
                    <span className={styles.structureName}>{e.nombre}</span>
                  </BotonLista>
                ))}
              </div>
            </div>
          );
        })}
        {filtradas.length === 0 && <p className={styles.notaPie}>Nada coincide con «{busca}».</p>}
        <span className={styles.grupoTitulo}>Mostrar en el modelo</span>
        <Interruptor activo={p.mostrarNervios} onCambio={p.onMostrarNervios} etiqueta="Pares craneales" color="#d8c9ae" />
        {p.cerebelo === 'retirado' && (
          <p className={styles.notaPie}>La cara posterior y los cortes de los pedúnculos solo se ven sin el cerebelo, como en la pieza de disección.</p>
        )}
      </>
    );
  }

  if (modo === 'nervios') {
    lista = (
      <div className={styles.structureList}>
        {NERVIOS.map((n) => {
          const activo = elegido?.kind === 'nervio' && elegido.id === n.id;
          return (
            <BotonLista
              key={n.id}
              activo={activo}
              onClick={() => onElegir(activo ? null : { kind: 'nervio', id: n.id, lado: 'i' })}
              onEnter={() => onSenalar({ kind: 'nervio', id: n.id, lado: 'i' })}
              onLeave={() => onSenalar(null)}
            >
              <span className={ts.numero} style={{ background: n.color }}>{n.id}</span>
              <span className={styles.structureName}>{n.nombre}</span>
              <span className={ts.tipo}>{n.tipo}</span>
            </BotonLista>
          );
        })}
      </div>
    );
  }

  if (modo === 'nucleos') {
    lista = (
      <>
        <div className={ts.columnas} aria-label="Columnas funcionales">
          {(Object.keys(COLUMNAS) as Columna[]).map((c) => (
            <span key={c} className={ts.columna} title={COLUMNAS[c].desc}><Dot color={COLUMNAS[c].color} /> {COLUMNAS[c].nombre}</span>
          ))}
        </div>
        <Interruptor activo={p.mostrarVias} onCambio={p.onMostrarVias} etiqueta="Vías largas" detalle="Corticoespinal, lemniscos, FLM…" />
        <Buscador valor={busca} onCambio={setBusca} placeholder="Buscar: ambiguo, rojo…" etiqueta="Buscar un núcleo o una vía" />
        {GRUPOS_INTERIOR.map((g) => {
          const items = listaInt.filter(g.filtro).filter((x) => !q || normal(x.nombre).includes(q));
          if (!items.length) return null;
          return (
            <div key={g.id} className={styles.listSection}>
              <div className={styles.listTitle}>{g.nombre}</div>
              <div className={styles.structureList}>
                {items.map((x) => {
                  const activo = elegido?.kind === 'interior' && elegido.id === x.id;
                  return (
                    <BotonLista
                      key={x.id}
                      activo={activo}
                      onClick={() => onElegir(activo ? null : { kind: 'interior', id: x.id, lado: 'i' })}
                      onEnter={() => onSenalar({ kind: 'interior', id: x.id, lado: 'i' })}
                      onLeave={() => onSenalar(null)}
                    >
                      <Dot color={x.color} />
                      <span className={styles.structureName}>{x.nombre}</span>
                      {x.pares && <span className={ts.tipo}>{x.pares.join(', ')}</span>}
                    </BotonLista>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (modo === 'cortes') {
    const n = NIVEL[p.nivel];
    if (!ficha) {
      ficha = (
        <div className={styles.info} role="region" aria-label={n.nombre}>
          <h3 className={ws.fichaTitulo}>{n.nombre}</h3>
          <p className={ws.fichaLead}>{n.claves}</p>
          <p className={ts.nota}>Arriba en la imagen queda la cara posterior (el IV ventrículo o el techo), como en el atlas. Toca un color para ver qué es.</p>
        </div>
      );
    }
    lista = (
      <>
        <span className={styles.grupoTitulo}>En este corte</span>
        <div className={styles.structureList}>
          {enCorte.map((x) => {
            const activo = elegido?.kind === 'interior' && elegido.id === x.id;
            return (
              <BotonLista
                key={x.id}
                activo={activo}
                onClick={() => onElegir(activo ? null : { kind: 'interior', id: x.id, lado: 'i' })}
                onEnter={() => onSenalar({ kind: 'interior', id: x.id, lado: 'i' })}
                onLeave={() => onSenalar(null)}
              >
                <Dot color={x.color} />
                <span className={styles.structureName}>{x.nombre}</span>
              </BotonLista>
            );
          })}
        </div>
      </>
    );
  }

  if (modo === 'clinico') {
    if (!ficha) ficha = <Vacio>Elige un síndrome: el modelo muestra la lesión en violeta y lo que daña en color.</Vacio>;
    lista = (
      <>
        {(['Mesencéfalo', 'Protuberancia', 'Bulbo'] as const).map((nv) => (
          <div key={nv} className={styles.listSection}>
            <div className={styles.listTitle}>{nv}</div>
            <div className={styles.structureList}>
              {SINDROMES.filter((s) => s.nivel === nv).map((s) => (
                <BotonLista key={s.id} activo={p.sindrome === s.id} onClick={() => p.onSindrome(p.sindrome === s.id ? null : s.id)}>
                  <span className={styles.structureName}>{s.corto}</span>
                </BotonLista>
              ))}
            </div>
          </div>
        ))}
        <p className={styles.notaPie}>Regla de los síndromes alternos: el par craneal falla del mismo lado y localiza el nivel; la vía larga falla del lado contrario.</p>
      </>
    );
  }

  if (!ficha && modo === 'anatomia') ficha = <Vacio>Toca un relieve del modelo o elige uno de la lista.</Vacio>;
  if (!ficha && modo === 'nervios') ficha = <Vacio>Toca un nervio en el modelo o en la lista: verás sus núcleos dentro del tronco.</Vacio>;
  if (!ficha && modo === 'nucleos') ficha = <Vacio>Toca un núcleo o una vía. Colores = columnas funcionales: motoras cerca de la línea media, sensitivas por fuera.</Vacio>;

  return (
    <aside className={styles.panel} aria-label={`Panel de ${MODOS.find((m) => m.key === modo)?.label ?? ''}`}>
      {cabeza}
      {ficha && <div className={styles.panelFicha}>{ficha}</div>}
      {lista && <div className={`${styles.panelLista} ${ws.listaHolgura}`}>{lista}</div>}
    </aside>
  );
}
