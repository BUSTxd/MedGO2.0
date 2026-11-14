'use client';
// Barra lateral del lab, con el mismo diseño que la de Médula Espinal 3D: arriba
// el selector fijo (aquí «Sistema» en lugar de «Nivel medular»), debajo la ficha
// de lo elegido y al final la lista de la vista activa, con su propio scroll.
// Las clases vienen del CSS de médula para que los dos labs sean idénticos; lo
// propio de Willis (cabecera fija de la ficha, «Lo esencial», pestañas, perla,
// buscador) va en su módulo.
//
// Revisado con las heurísticas de Nielsen
// (auditorias-ux/nielsen-willis-barra-lateral-2026-11-14.md): la ficha va de lo
// central a lo accesorio (qué es → lo esencial → perla → detalle), su título no
// se pierde al bajar, se cierra o se pasa a la arteria vecina sin volver a la
// lista (‹ › ✕ y las flechas del teclado) y la lista tiene buscador.

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ARTERIAS, ARTERIA_LIST, GRUPOS, SISTEMAS, TERRITORIOS, TERRITORIO_LIST, REFERENCIAS, REFERENCIA_LIST, ESENCIAL,
  ESENCIAL_TERRITORIO,
  enSistema,
  type ArteriaId, type SistemaId, type TerritorioId, type ReferenciaId,
} from './engine/anatomia';
import {
  VARIANTES, VARIANTE_LIST, SINDROMES, SINDROME_LIST, ESENCIAL_VARIANTE, ESENCIAL_SINDROME,
  type VarianteId, type SindromeId,
} from './engine/clinica';
import type { Elegido, ModoWillis } from './WillisSimulator';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';

export const MODOS: Array<{ key: ModoWillis; label: string; desc: string }> = [
  { key: 'arterias', label: 'Arterias', desc: 'Cada arteria: origen, trayecto, ramas, irrigación y clínica' },
  { key: 'territorios', label: 'Territorios', desc: 'Qué irriga cada arteria, coloreado en el modelo' },
  { key: 'variantes', label: 'Variantes', desc: 'Variantes anatómicas del polígono y por qué importan' },
  { key: 'clinico', label: 'Clínico', desc: 'Aneurismas e ictus: qué arteria y qué síntomas' },
];

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
  /** Cierra la ficha (deselecciona). */
  onCerrar: () => void;
}

/** Sigla real (ACI, ACoA, M1…), no un nombre corto que repite el nombre. */
const esSigla = (c: string) => /^([AMP]\d|[A-Z][A-Za-z]{1,3})$/.test(c);
/** Para buscar sin tildes ni mayúsculas. */
const normal = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Íconos de trazo fino para los botones de la cabecera. */
function Icono({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
      <h4 className={ws.apartadoTitulo}>{titulo}</h4>
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

/** Cómo moverse desde la ficha: anterior, siguiente y cerrar (null = no se puede). */
interface Navegacion {
  posicion: string | null;
  onAnterior: (() => void) | null;
  onSiguiente: (() => void) | null;
  onCerrar: (() => void) | null;
  /** «arteria», «territorio»… para los nombres accesibles de los botones. */
  que: string;
}

/**
 * 1 · Qué es: cabecera fija de toda ficha (no se pierde al bajar), con su
 * insignia, el título, una línea de datos y ‹ › ✕.
 */
function CabezaFicha({ insignia, titulo, meta, nav }: { insignia?: ReactNode; titulo: string; meta: ReactNode; nav: Navegacion }) {
  return (
    <header className={ws.fichaCabeza}>
      <div className={ws.fichaFila}>
        <h3 className={ws.fichaTitulo}>{insignia}{titulo}</h3>
        <div className={ws.fichaNav}>
          <button type="button" className={ws.navBtn} onClick={nav.onAnterior ?? undefined} disabled={!nav.onAnterior} aria-label={`${nav.que} anterior de la lista`} title="Anterior (←)">
            <Icono d="m15 6-6 6 6 6" />
          </button>
          <button type="button" className={ws.navBtn} onClick={nav.onSiguiente ?? undefined} disabled={!nav.onSiguiente} aria-label={`${nav.que} siguiente de la lista`} title="Siguiente (→)">
            <Icono d="m9 6 6 6-6 6" />
          </button>
          {nav.onCerrar && (
            <button type="button" className={ws.navBtn} onClick={nav.onCerrar} aria-label="Cerrar la ficha" title="Cerrar (Esc)">
              <Icono d="M6 6l12 12M18 6 6 18" />
            </button>
          )}
        </div>
      </div>
      <p className={ws.fichaMeta}>
        {meta}{nav.posicion ? <span className={ws.fichaPos}> · {nav.posicion}</span> : null}
      </p>
    </header>
  );
}

/** 2 · Lo esencial: rótulo a la izquierda, dato a la derecha. */
function Esencial({ filas }: { filas: Array<{ rotulo: string; valor: ReactNode }> }) {
  return (
    <dl className={ws.esencial} aria-label="Lo esencial">
      {filas.map((f) => (
        <div key={f.rotulo} className={ws.esencialFila}>
          <dt>{f.rotulo}</dt>
          <dd>{f.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Enlaces en línea a las fichas de varias arterias («M1 · M2 · Lenticuloestriadas»). */
function EnlacesArterias({ ids, onVer }: { ids: ArteriaId[]; onVer: (id: ArteriaId) => void }) {
  return (
    <span className={ws.enlaces}>
      {ids.map((id, k) => (
        <span key={id}>
          {k > 0 && <span className={ws.enlacesSep} aria-hidden> · </span>}
          <button type="button" className={ws.enlaceTerr} onClick={() => onVer(id)} title={`Ver la ficha de ${ARTERIAS[id].nombre}`}>
            {ARTERIAS[id].corto}
          </button>
        </span>
      ))}
    </span>
  );
}

function FichaArteria({ id, lado, pestana, onPestana, onVerTerritorio, nav }: {
  id: ArteriaId;
  lado: 'i' | 'd' | 'm';
  pestana: Pestana;
  onPestana: (p: Pestana) => void;
  onVerTerritorio: (t: TerritorioId) => void;
  nav: Navegacion;
}) {
  const a = ARTERIAS[id];
  const e = ESENCIAL[id];
  const terr = TERRITORIOS[a.territorio];
  const grupo = GRUPOS.find((g) => g.id === a.grupo)!.nombre;
  const ladoTxt = a.par ? (lado === 'd' ? 'lado derecho' : 'lado izquierdo') : 'línea media';
  const PESTANAS: Array<{ key: Pestana; label: string }> = [
    { key: 'anatomia', label: 'Anatomía' },
    { key: 'irrigacion', label: 'Irrigación' },
    { key: 'clinica', label: 'Clínica' },
  ];
  const sigla = esSigla(a.corto);
  return (
    <div className={styles.info} role="region" aria-label={a.nombre}>
      <CabezaFicha
        insignia={sigla ? <span className={ws.sigla}>{a.corto}</span> : null}
        // Con la sigla en su etiqueta, el «(PICA)» del nombre sobra.
        titulo={sigla ? a.nombre.replace(/\s*\([^)]*\)$/, '') : a.nombre}
        meta={<>{grupo} · {ladoTxt} · {a.calibre}</>}
        nav={nav}
      />

      <p className={ws.fichaLead}>{a.resumen}</p>

      <Esencial filas={[
        { rotulo: 'Nace de', valor: e.nace },
        {
          rotulo: 'Irriga',
          valor: (
            <>
              {e.irriga}{' '}
              <button type="button" className={ws.enlaceTerr} onClick={() => onVerTerritorio(terr.id)} title="Ver su territorio en el modelo">
                <Dot color={terr.color} size={8} /> {terr.nombre}
              </button>
            </>
          ),
        },
        { rotulo: 'Si se lesiona', valor: e.lesion },
      ]} />

      <Perla>{a.perla}</Perla>

      <h4 className={ws.detalleTitulo}>Más detalle</h4>
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
                  <Dot color={terr.color} /> Ver el territorio de la {terr.nombre.toLowerCase()} →
                </button>
              </li>
            </ul>
          </Apartado>
        </div>
      )}

      {pestana === 'clinica' && (
        <div className={ws.cuerpo} role="tabpanel">
          <Apartado titulo="Patología"><p className={styles.infoDesc}>{a.clinica}</p></Apartado>
        </div>
      )}
    </div>
  );
}

function FichaTerritorio({ id, extra, onVerArteria, nav }: {
  id: TerritorioId;
  extra: ReactNode;
  onVerArteria: (a: ArteriaId) => void;
  nav: Navegacion;
}) {
  const t = TERRITORIOS[id];
  const e = ESENCIAL_TERRITORIO[id];
  const arts = ARTERIA_LIST.filter((a) => a.territorio === id).map((a) => a.id);
  return (
    <div className={styles.info} role="region" aria-label={`Territorio: ${t.nombre}`}>
      <CabezaFicha
        insignia={<span className={ws.insigniaColor} style={{ background: t.color }} aria-hidden />}
        titulo={t.nombre}
        meta={<>Territorio arterial · {arts.length} arteria{arts.length === 1 ? '' : 's'}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{t.resumen}</p>
      {extra}
      <Esencial filas={[
        { rotulo: 'Zona', valor: e.zona },
        { rotulo: 'Función', valor: e.funcion },
        { rotulo: 'Si se ocluye', valor: e.oclusion },
        { rotulo: 'Arterias', valor: <EnlacesArterias ids={arts} onVer={onVerArteria} /> },
      ]} />
      <Perla>{e.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <div className={ws.cuerpo}>
        <Apartado titulo="Qué irriga">
          <ul className={styles.infoLista}>
            {t.areas.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </Apartado>
        <Apartado titulo="Déficit al ocluirse"><p className={styles.infoDesc}>{t.deficit}</p></Apartado>
      </div>
    </div>
  );
}

function FichaVariante({ id, extra, onVerArteria, nav }: {
  id: VarianteId;
  extra: ReactNode;
  onVerArteria: (a: ArteriaId) => void;
  nav: Navegacion;
}) {
  const v = VARIANTES[id];
  const e = ESENCIAL_VARIANTE[id];
  const cambiadas = [...new Set(v.cambios.map((c) => c.arteria))];
  return (
    <div className={styles.info} role="region" aria-label={v.nombre}>
      <CabezaFicha
        insignia={<span className={ws.insigniaColor} style={{ background: id === 'completo' ? '#c0392b' : AMBAR }} aria-hidden />}
        titulo={v.nombre}
        meta={<>Variante anatómica</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{v.desc}</p>
      {extra}
      <Esencial filas={[
        { rotulo: 'Frecuencia', valor: v.frecuencia },
        { rotulo: 'Qué cambia', valor: e.cambia },
        { rotulo: 'Por qué importa', valor: e.importa },
        ...(cambiadas.length ? [{ rotulo: 'Arterias', valor: <EnlacesArterias ids={cambiadas} onVer={onVerArteria} /> }] : []),
      ]} />
      <Perla>{e.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <div className={ws.cuerpo}>
        <Apartado titulo="Consecuencias"><p className={styles.infoDesc}>{v.importancia}</p></Apartado>
      </div>
    </div>
  );
}

function FichaSindrome({ id, extra, onVerArteria, nav }: {
  id: SindromeId;
  extra: ReactNode;
  onVerArteria: (a: ArteriaId) => void;
  nav: Navegacion;
}) {
  const s = SINDROMES[id];
  const e = ESENCIAL_SINDROME[id];
  const aneurisma = s.tipo === 'aneurisma';
  return (
    <div className={styles.info} role="region" aria-label={s.nombre}>
      <CabezaFicha
        insignia={<span className={aneurisma ? ws.insigniaAneurisma : ws.insigniaIctus}>{aneurisma ? 'Aneurisma' : 'Ictus'}</span>}
        titulo={s.nombre}
        meta={<>{s.lado === 'i' ? 'Lado izquierdo en el modelo' : 'Ambos lados'}{s.frecuencia ? <> · {s.frecuencia.split(':')[0].replace(/\.$/, '')}</> : null}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{s.desc}</p>
      {extra}
      <Esencial filas={[
        { rotulo: 'Arteria', valor: <EnlacesArterias ids={s.arterias} onVer={onVerArteria} /> },
        { rotulo: 'Lesiona', valor: e.lesiona },
        { rotulo: 'Signo clave', valor: e.signo },
      ]} />
      <Perla>{s.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <div className={ws.cuerpo}>
        <Apartado titulo="Clínica">
          <ul className={styles.infoLista}>
            {s.clinica.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </Apartado>
        <Apartado titulo="Mecanismo"><p className={styles.infoDesc}>{s.mecanismo}</p></Apartado>
        {s.frecuencia && <Apartado titulo="Frecuencia"><p className={styles.infoDesc}>{s.frecuencia}</p></Apartado>}
      </div>
    </div>
  );
}

/** Arteria que se nombra en la lista cuando el síndrome afecta a varias. */
const PRINCIPAL: Partial<Record<SindromeId, ArteriaId>> = { an_pcom: 'pcom', wallenberg: 'pica' };

/** Lista de síndromes en el orden en que se pintan: aneurismas y luego ictus. */
const ORDEN_SINDROMES: SindromeId[] = [
  ...SINDROME_LIST.filter((x) => x.tipo === 'aneurisma'),
  ...SINDROME_LIST.filter((x) => x.tipo === 'isquemia'),
].map((x) => x.id);

export default function ControlsPanel(props: Props) {
  const {
    mode, sistema, onSistema, elegido, territorio, variante, sindrome, refs,
    onElegirArteria, onVerArteria, onTerritorio, onVerTerritorio, onVariante, onSindrome, onRef, onSenalar, onCerrar,
  } = props;
  const [pestana, setPestana] = useState<Pestana>('anatomia');
  const [busca, setBusca] = useState('');

  // Lista visible de arterias, en el orden en que se pintan (grupo a grupo):
  // la usan la lista, «‹ ›» y las flechas del teclado.
  const grupos = useMemo(() => {
    const q = normal(busca.trim());
    return GRUPOS.map((g) => ({
      ...g,
      arts: ARTERIA_LIST.filter((a) => a.grupo === g.id && enSistema(a, sistema)
        && (!q || normal(`${a.nombre} ${a.corto}`).includes(q))),
    })).filter((g) => g.arts.length > 0);
  }, [busca, sistema]);
  const orden = useMemo(() => grupos.flatMap((g) => g.arts.map((a) => a.id)), [grupos]);

  let cabeza: ReactNode = null;
  let ficha: ReactNode = null;
  let lista: ReactNode = null;

  const arteriaElegida = elegido?.kind === 'arteria' ? elegido : null;
  const refElegida = elegido?.kind === 'ref' ? REFERENCIAS[elegido.id] : null;
  /** Anterior, siguiente y posición dentro de una lista. */
  function navegar<T>(lista: T[], actual: T | null, ir: (x: T) => void, que: string, cerrar: (() => void) | null): Navegacion {
    const i = actual === null ? -1 : lista.indexOf(actual);
    return {
      posicion: i >= 0 ? `${i + 1} de ${lista.length}` : null,
      onAnterior: i > 0 ? () => ir(lista[i - 1]) : null,
      onSiguiente: i >= 0 && i < lista.length - 1 ? () => ir(lista[i + 1]) : null,
      onCerrar: cerrar,
      que,
    };
  }
  const nav: Navegacion | null =
    mode === 'arterias' ? (arteriaElegida ? navegar(orden, arteriaElegida.id, onElegirArteria, 'Arteria', onCerrar) : null)
      : mode === 'territorios' ? (territorio ? navegar(TERRITORIO_LIST.map((t) => t.id), territorio, onTerritorio, 'Territorio', () => onTerritorio(null)) : null)
        : mode === 'variantes' ? navegar(VARIANTE_LIST.map((v) => v.id), variante, onVariante, 'Variante', variante !== 'completo' ? () => onVariante('completo') : null)
          : sindrome ? navegar(ORDEN_SINDROMES, sindrome, onSindrome, 'Síndrome', () => onSindrome(null)) : null;

  // Teclado en las cuatro vistas: ← → pasan al elemento vecino de la lista y
  // Esc cierra la ficha (salvo que se esté escribiendo en el buscador).
  useEffect(() => {
    if (!nav) return;
    const tecla = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && nav.onAnterior) { e.preventDefault(); nav.onAnterior(); }
      else if (e.key === 'ArrowRight' && nav.onSiguiente) { e.preventDefault(); nav.onSiguiente(); }
      else if (e.key === 'Escape' && nav.onCerrar) nav.onCerrar();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [nav]);

  // En las otras vistas, tocar una arteria del modelo ofrece abrir su ficha.
  const irAFicha = arteriaElegida && mode !== 'arterias' ? (
    <p className={ws.tocaste}>
      Tocaste <strong>{ARTERIAS[arteriaElegida.id].nombre}</strong>.{' '}
      <button type="button" className={ws.enlaceTerr} onClick={() => onVerArteria(arteriaElegida.id)}>Ver su ficha →</button>
    </p>
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
        nav={nav!}
      />
    ) : fichaRef ?? (
      <Vacio>Toca una arteria en el modelo o en la lista: verás de dónde nace, qué irriga y qué pasa si se lesiona.</Vacio>
    );
    lista = (
      <>
        {/* Buscador: por nombre o sigla, sin importar tildes ni mayúsculas */}
        <div className={ws.buscador} role="search">
          <svg className={ws.buscadorLupa} width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m15.5 15.5 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className={ws.buscadorCampo}
            placeholder="Buscar arteria (PICA, basilar…)"
            aria-label="Buscar arteria por nombre o sigla"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') setBusca(''); }}
          />
        </div>
        {grupos.length === 0 && (
          <p className={styles.notaPie}>
            Ninguna arteria coincide con «{busca}»{sistema !== 'todo' ? ' en este sistema' : ''}.{' '}
            <button type="button" className={ws.enlaceTerr} onClick={() => { setBusca(''); onSistema('todo'); }}>Ver todas</button>
          </p>
        )}
        {grupos.map((g) => (
          <div key={g.id} className={styles.listSection}>
            <div className={styles.listTitle}>
              {g.nombre} <span className={ws.conteo}>{g.arts.length}</span>
            </div>
            <div className={styles.structureList}>
              {g.arts.map((a) => (
                <BotonLista
                  key={a.id}
                  activo={arteriaElegida?.id === a.id}
                  onClick={() => onElegirArteria(a.id)}
                  onEnter={() => onSenalar({ kind: 'arteria', id: a.id, lado: a.par ? 'i' : 'm' })}
                  onLeave={() => onSenalar(null)}
                >
                  <span className={styles.structureName}>{a.nombre}</span>
                  {esSigla(a.corto) && <span className={styles.structureDir}>{a.corto}</span>}
                </BotonLista>
              ))}
            </div>
          </div>
        ))}
        <span className={`${styles.grupoTitulo} ${ws.separado}`}>Mostrar en el modelo</span>
        {REFERENCIA_LIST.map((r) => (
          <Interruptor key={r.id} activo={refs[r.id]} onCambio={() => onRef(r.id)} etiqueta={r.nombre} color={r.color} />
        ))}
        <p className={styles.notaPie}>Modelo didáctico: el trayecto y el orden de calibres son reales; las medidas, aproximadas.</p>
      </>
    );
  }

  if (mode === 'territorios') {
    ficha = territorio ? (
      <FichaTerritorio id={territorio} extra={irAFicha} onVerArteria={onVerArteria} nav={nav!} />
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
    cabeza = (
      <div className={styles.leyenda} aria-label="Leyenda de colores">
        <span className={styles.leyendaItem}><Dot color={AMBAR} /> Lo que cambia respecto al polígono clásico</span>
      </div>
    );
    ficha = <FichaVariante id={variante} extra={irAFicha} onVerArteria={onVerArteria} nav={nav!} />;
    lista = (
      <div className={styles.structureList}>
        {VARIANTE_LIST.map((x) => (
          <BotonLista key={x.id} activo={variante === x.id} onClick={() => onVariante(x.id)}>
            <span className={styles.structureName}>{x.nombre}</span>
            <span className={styles.structureDir}>{ESENCIAL_VARIANTE[x.id].frecuencia}</span>
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
      <FichaSindrome id={s.id} extra={irAFicha} onVerArteria={onVerArteria} nav={nav!} />
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
                  <span className={styles.structureDir}>{ARTERIAS[PRINCIPAL[x.id] ?? x.arterias[0]].corto}</span>
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
      {lista && <div className={`${styles.panelLista} ${ws.listaHolgura}`}>{lista}</div>}
    </aside>
  );
}
