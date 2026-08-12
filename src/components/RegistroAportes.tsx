'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Colaborador } from '@/lib/data/aportes';
import type { Track } from '@/lib/plans';
import {
  claveMarca,
  indexarMarcas,
  type Firma,
  type Marca,
  type MarcasIndex,
  type OrigenMarca,
} from '@/lib/aportes-marcas';
import type { GrupoRegistro, ItemRegistro, SlotRegistro } from '@/lib/aportes-registro';
import styles from '@/styles/aportes.module.css';

/**
 * Registro de quién subió qué.
 *
 * El resto del panel se deduce del repo; esto no: cada persona pinta el círculo
 * del material que aportó y la marca se guarda en Supabase, así que todo el
 * equipo ve el mismo registro. Como una marca ajena no se puede deshacer desde
 * el propio código, cada acción pide confirmación antes de escribir.
 *
 * Aquí se declara además el **tipo de aporte** del banqueo (armado o
 * recolectado): el sílabo no lo sabe —el mismo PDF puede ser trabajo propio o
 * una descarga— y de esta elección salen el ámbar y el recuento por persona.
 */

export interface PersonaRegistro {
  key: Colaborador;
  nombre: string;
  color: string;
  /** Aún no tiene cuenta en la web: sus marcas sólo las puede poner el admin. */
  sinCuenta: boolean;
}

interface Props {
  cursos: GrupoRegistro[];
  labs: GrupoRegistro;
  histologia: GrupoRegistro[];
  marcasIniciales: Marca[];
  /** Persona que corresponde a la sesión, o null si su correo no está en el registro. */
  yo: Colaborador | null;
  esAdmin: boolean;
  personas: PersonaRegistro[];
}

type Pestana = 'cursos' | 'labs' | 'histologia';

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: 'cursos',     label: 'Cursos' },
  { id: 'labs',       label: 'Laboratorio virtual' },
  { id: 'histologia', label: 'Histología' },
];

/** Las dos facultades no son niveles de lo mismo: cada una va en su columna. */
const TRACKS: { id: Track; titulo: string }[] = [
  { id: 'basico',   titulo: 'UFBI · 1.er año' },
  { id: 'medicina', titulo: 'Facultad · 2.º–7.º' },
];

/** Ámbar del material conseguido, el mismo en el círculo y en los recuentos. */
const COLOR_RECOLECTA = '#c79a3b';

/** Diana del popover: el material concreto sobre el que se está decidiendo. */
interface Foco {
  grupo: GrupoRegistro;
  item: ItemRegistro;
  slot: SlotRegistro;
  clave: string;
}

const ORIGEN_TEXTO: Record<OrigenMarca, string> = {
  armado: 'lo armó',
  recolectado: 'lo consiguió',
};

/**
 * El círculo pintado. Vacío = nadie lo ha reclamado; con una persona toma su
 * color; con varias se parte en sectores iguales, que es exactamente lo que
 * hace el reparto de crédito con esa unidad.
 *
 * El aro ámbar avisa de que ese banqueo se consiguió en PDF en vez de armarse.
 * Va en el borde y no en el relleno porque el relleno es la identidad de la
 * persona: si el ámbar la tapara, el círculo dejaría de decir quién lo subió.
 */
function Circulo({
  firmas,
  colores,
  activo,
  onClick,
  titulo,
}: {
  firmas: Firma[];
  colores: Record<string, string>;
  activo: boolean;
  onClick: () => void;
  titulo: string;
}) {
  const n = firmas.length;
  const recolectado = firmas.some((f) => f.origen === 'recolectado');
  const fondo =
    n === 0
      ? undefined
      : n === 1
        ? colores[firmas[0].colaborador]
        : `conic-gradient(${firmas
            .map(
              (f, i) =>
                `${colores[f.colaborador]} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`,
            )
            .join(', ')})`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      aria-pressed={n > 0}
      className={`${styles.circulo} ${n > 0 ? styles.circuloLleno : ''} ${
        activo ? styles.circuloActivo : ''
      }`}
      style={
        fondo
          ? { background: fondo, borderColor: recolectado ? COLOR_RECOLECTA : 'transparent' }
          : undefined
      }
    />
  );
}

export default function RegistroAportes({
  cursos,
  labs,
  histologia,
  marcasIniciales,
  yo,
  esAdmin,
  personas,
}: Props) {
  const router = useRouter();
  const [pestana, setPestana] = useState<Pestana>('cursos');
  const [grupoId, setGrupoId] = useState<string>(cursos[0]?.scopeId ?? '');
  const [histoId, setHistoId] = useState<string>(histologia[0]?.scopeId ?? '');
  const [soloSinMarcar, setSoloSinMarcar] = useState(false);
  const [marcas, setMarcas] = useState<MarcasIndex>(() => indexarMarcas(marcasIniciales));
  const [foco, setFoco] = useState<Foco | null>(null);
  /** Tipo elegido en el popover abierto; sólo se envía en el slot de banqueo. */
  const [origen, setOrigen] = useState<OrigenMarca>('armado');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otro, setOtro] = useState<Colaborador | ''>('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const colores = useMemo(
    () => Object.fromEntries(personas.map((p) => [p.key, p.color])),
    [personas],
  );
  const nombres = useMemo(
    () => Object.fromEntries(personas.map((p) => [p.key, p.nombre])),
    [personas],
  );

  const recargar = useCallback(async () => {
    try {
      const res = await fetch('/api/aportes/marcas', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { marcas: Marca[] };
      setMarcas(indexarMarcas(data.marcas));
    } catch {
      /* sin conexión: se conserva lo que ya estaba en pantalla */
    }
  }, []);

  // Otra persona puede haber marcado mientras la pestaña estaba en segundo
  // plano; al volver se resincroniza para no pisar su marca con datos viejos.
  useEffect(() => {
    const onFocus = () => void recargar();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [recargar]);

  useEffect(() => {
    if (!foco) return;
    const fuera = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) setFoco(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFoco(null);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [foco]);

  async function escribir(marca: Marca, accion: 'add' | 'del') {
    const clave = claveMarca(marca);
    const antes = marcas[clave] ?? [];
    const otras = antes.filter((f) => f.colaborador !== marca.colaborador);
    const despues: Firma[] =
      accion === 'add'
        ? [...otras, { colaborador: marca.colaborador, origen: marca.origen }]
        : otras;

    setGuardando(true);
    setError(null);
    setMarcas((m) => ({ ...m, [clave]: despues }));   // optimista

    try {
      const res = await fetch('/api/aportes/marcas', {
        method: accion === 'add' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marca),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'no se pudo guardar');
      }
      setFoco(null);
      setOtro('');
      // Recalcula «Aportes por persona» en el servidor con la marca nueva.
      router.refresh();
    } catch (e) {
      setMarcas((m) => ({ ...m, [clave]: antes }));   // se revierte lo optimista
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  const gruposVisibles: GrupoRegistro[] =
    pestana === 'cursos'
      ? cursos.filter((g) => g.scopeId === grupoId)
      : pestana === 'histologia'
        ? histologia.filter((g) => g.scopeId === histoId)
        : [labs];

  /** Cuántos slots del grupo tienen ya dueño: el avance del propio registro. */
  function progreso(g: GrupoRegistro) {
    let total = 0;
    let marcados = 0;
    for (const item of g.items) {
      for (const slot of item.slots) {
        total++;
        const clave = claveMarca({
          ambito: g.ambito,
          scopeId: g.scopeId,
          itemId: item.id,
          slot: slot.slot,
        });
        if ((marcas[clave]?.length ?? 0) > 0) marcados++;
      }
    }
    return { total, marcados };
  }

  function itemsDe(g: GrupoRegistro) {
    if (!soloSinMarcar) return g.items;
    return g.items.filter((item) =>
      item.slots.some((slot) => {
        const clave = claveMarca({
          ambito: g.ambito,
          scopeId: g.scopeId,
          itemId: item.id,
          slot: slot.slot,
        });
        return (marcas[clave]?.length ?? 0) === 0;
      }),
    );
  }

  /** Abre el popover de un material y arranca con el tipo que ya tuviera. */
  function abrir(f: Foco | null, firmas: Firma[]) {
    setError(null);
    setOtro('');
    setOrigen(firmas.find((x) => x.colaborador === yo)?.origen ?? 'armado');
    setFoco(f);
  }

  const firmasFoco = foco ? (marcas[foco.clave] ?? []) : [];
  const miFirma = firmasFoco.find((f) => f.colaborador === yo);
  const esBanqueo = foco?.slot.slot === 'banqueo';
  const disponibles = personas.filter(
    (p) => !firmasFoco.some((f) => f.colaborador === p.key),
  );

  /**
   * Una fila del selector: el curso con su avance de marcado.
   *
   * Función de render, no un componente declarado aquí dentro: como componente
   * sería un tipo nuevo en cada render del padre y React remontaría las filas
   * en cada clic.
   */
  function opcionCurso(g: GrupoRegistro) {
    const { total, marcados } = progreso(g);
    const pct = total === 0 ? 0 : (marcados / total) * 100;
    const completo = total > 0 && marcados === total;
    const activo = g.scopeId === grupoId;

    return (
      <button
        key={g.scopeId}
        type="button"
        aria-current={activo}
        className={activo ? styles.cursoOpcionActiva : styles.cursoOpcion}
        onClick={() => {
          setGrupoId(g.scopeId);
          setFoco(null);
        }}
      >
        {/* Anillo de avance: se llena según lo ya marcado de ese curso. */}
        <span
          className={completo ? styles.cursoDotOk : styles.cursoDot}
          style={{
            background: `conic-gradient(currentColor ${pct}%, rgba(148, 163, 184, 0.28) 0)`,
          }}
        />
        <span className={styles.cursoOpcionNombre}>{g.nombre}</span>
        {g.prioridad != null && (
          <span className={styles.cursoOpcionRank} title="Bloquea el lanzamiento">
            {g.prioridad + 1}
          </span>
        )}
        <span className={completo ? styles.cursoOpcionFracOk : styles.cursoOpcionFrac}>
          {marcados}/{total}
        </span>
      </button>
    );
  }

  return (
    <section className={styles.registro}>
      <header className={styles.registroHead}>
        <div>
          <h3 className={styles.registroTitulo}>Quién subió qué</h3>
          <p className={styles.registroSub}>
            Pinta el círculo del material que subiste. Se guarda al instante y lo
            ve todo el equipo — de aquí sale el conteo de «Aportes por persona»,
            y en el banqueo también si lo armaste o sólo lo conseguiste. Si un
            material lo hicieron dos, que lo marquen los dos: el círculo se parte
            y el crédito también. Aquí <strong>sólo aparece lo que ya está
            publicado</strong>; lo que falta se ve arriba, en la cobertura.
          </p>
        </div>
        <div className={styles.leyendaColores}>
          {personas.map((p) => (
            <span key={p.key} className={styles.leyendaPersona}>
              <span className={styles.leyendaDot} style={{ background: p.color }} />
              {p.nombre}
              {p.key === yo && <span className={styles.leyendaTu}>tú</span>}
              {p.sinCuenta && <span className={styles.leyendaSinCuenta}>sin cuenta</span>}
            </span>
          ))}
          <span className={styles.leyendaPersona}>
            <span className={styles.leyendaDotAro} />
            Conseguido en PDF
          </span>
        </div>
      </header>

      {!yo && (
        <p className={styles.avisoRegistro}>
          Tu correo no está asociado a ninguna persona del registro, así que
          puedes mirar pero no marcar. Pídele a BUST que te dé de alta.
        </p>
      )}

      <div className={styles.tabs} role="tablist">
        {PESTANAS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={pestana === t.id}
            className={pestana === t.id ? styles.tabActiva : styles.tab}
            onClick={() => {
              setPestana(t.id);
              setFoco(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Los cursos van repartidos por facultad y, dentro, por prioridad de
          lanzamiento: los que bloquean la salida llevan su número. */}
      {pestana === 'cursos' && (
        <div className={styles.selectorTracks}>
          {TRACKS.map((t) => {
            const grupos = cursos.filter((g) => g.track === t.id);
            if (grupos.length === 0) return null;
            return (
              <div key={t.id} className={styles.selectorColumna}>
                <p className={styles.selectorColTitulo}>{t.titulo}</p>
                <div className={styles.selectorLista}>{grupos.map(opcionCurso)}</div>
              </div>
            );
          })}
        </div>
      )}

      {pestana === 'histologia' && (
        <div className={styles.selector}>
          {histologia.map((g) => {
            const { total, marcados } = progreso(g);
            return (
              <button
                key={g.scopeId}
                type="button"
                className={g.scopeId === histoId ? styles.selectorChipActivo : styles.selectorChip}
                onClick={() => {
                  setHistoId(g.scopeId);
                  setFoco(null);
                }}
              >
                {g.nombre}
                <span className={styles.selectorFrac}>
                  {marcados}/{total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <label className={styles.filtro}>
        <input
          type="checkbox"
          checked={soloSinMarcar}
          onChange={(e) => setSoloSinMarcar(e.target.checked)}
        />
        Ver sólo lo que nadie ha marcado
      </label>

      {error && <p className={styles.errorRegistro}>{error}</p>}

      {gruposVisibles.map((g) => {
        const items = itemsDe(g);
        return (
          <div key={g.scopeId} className={styles.tablaRegistro}>
            {items.length === 0 ? (
              <p className={styles.todoMarcado}>Todo el material de aquí ya tiene autor.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className={styles.filaItem}>
                  <div className={styles.filaItemInfo}>
                    {item.codigo && <span className={styles.itemCodigo}>{item.codigo}</span>}
                    <span className={styles.filaItemTitulo}>{item.titulo}</span>
                    {item.bloque && <span className={styles.itemBloque}>{item.bloque}</span>}
                  </div>

                  <div className={styles.filaItemSlots}>
                    {item.slots.map((slot) => {
                      const clave = claveMarca({
                        ambito: g.ambito,
                        scopeId: g.scopeId,
                        itemId: item.id,
                        slot: slot.slot,
                      });
                      const firmas = marcas[clave] ?? [];
                      const abierto = foco?.clave === clave;
                      const marcaBase = {
                        ambito: g.ambito,
                        scopeId: g.scopeId,
                        itemId: item.id,
                        slot: slot.slot,
                      };
                      return (
                        <div key={slot.slot} className={styles.slotCelda}>
                          <Circulo
                            firmas={firmas}
                            colores={colores}
                            activo={abierto}
                            titulo={
                              firmas.length === 0
                                ? `${slot.label} · sin marcar`
                                : `${slot.label} · ${firmas
                                    .map((f) => nombres[f.colaborador])
                                    .join(', ')}`
                            }
                            onClick={() =>
                              abrir(abierto ? null : { grupo: g, item, slot, clave }, firmas)
                            }
                          />
                          <span className={styles.slotLabel}>{slot.label}</span>

                          {abierto && (
                            <div className={styles.popover} ref={popoverRef}>
                              <p className={styles.popTitulo}>{item.titulo}</p>
                              <p className={styles.popSlot}>{slot.label}</p>

                              {firmas.length > 0 && (
                                <ul className={styles.popLista}>
                                  {firmas.map((f) => {
                                    const puedo = esAdmin || f.colaborador === yo;
                                    return (
                                      <li key={f.colaborador} className={styles.popPersona}>
                                        <span
                                          className={styles.leyendaDot}
                                          style={{ background: colores[f.colaborador] }}
                                        />
                                        {nombres[f.colaborador]}
                                        {esBanqueo && (
                                          <span
                                            className={
                                              f.origen === 'recolectado'
                                                ? styles.popOrigenRec
                                                : styles.popOrigen
                                            }
                                          >
                                            {ORIGEN_TEXTO[f.origen ?? 'armado']}
                                          </span>
                                        )}
                                        {puedo && (
                                          <button
                                            type="button"
                                            className={styles.popQuitar}
                                            disabled={guardando}
                                            onClick={() =>
                                              escribir(
                                                { ...marcaBase, colaborador: f.colaborador },
                                                'del',
                                              )
                                            }
                                          >
                                            Quitar
                                          </button>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}

                              {/* El sílabo no sabe si ese PDF se hizo o se
                                  consiguió: lo dice quien lo subió. */}
                              {esBanqueo && (yo || esAdmin) && (
                                <div className={styles.popTipo}>
                                  <span className={styles.popTipoLabel}>¿Cómo llegó?</span>
                                  <div className={styles.popTipoOpciones}>
                                    <button
                                      type="button"
                                      className={
                                        origen === 'armado'
                                          ? styles.popTipoActivo
                                          : styles.popTipoBoton
                                      }
                                      onClick={() => setOrigen('armado')}
                                    >
                                      Lo armé
                                    </button>
                                    <button
                                      type="button"
                                      className={
                                        origen === 'recolectado'
                                          ? styles.popTipoActivoRec
                                          : styles.popTipoBoton
                                      }
                                      onClick={() => setOrigen('recolectado')}
                                    >
                                      Lo conseguí
                                    </button>
                                  </div>
                                  <p className={styles.popTipoAyuda}>
                                    {origen === 'armado'
                                      ? 'Banco de preguntas, solucionario o ejercicios hechos por ti.'
                                      : 'PDF de una PC o examen de otro año, subido tal cual.'}
                                  </p>
                                </div>
                              )}

                              <p className={styles.popAviso}>Se guarda para todo el equipo.</p>

                              {/* Las marcas anteriores a la columna `origen` no
                                  traen tipo: cuentan como armadas, así que no
                                  ofrecen «cambiar» hasta que se elija otra cosa. */}
                              {yo &&
                                (!miFirma ||
                                  (esBanqueo && (miFirma.origen ?? 'armado') !== origen)) && (
                                <button
                                  type="button"
                                  className={styles.popPrimario}
                                  disabled={guardando}
                                  onClick={() =>
                                    escribir(
                                      {
                                        ...marcaBase,
                                        colaborador: yo,
                                        origen: esBanqueo ? origen : undefined,
                                      },
                                      'add',
                                    )
                                  }
                                >
                                  {guardando
                                    ? 'Guardando…'
                                    : miFirma
                                      ? 'Cambiar a esta opción'
                                      : 'Sí, lo subí yo'}
                                </button>
                              )}

                              {esAdmin && disponibles.length > 0 && (
                                <div className={styles.popOtro}>
                                  <select
                                    className={styles.popSelect}
                                    value={otro}
                                    disabled={guardando}
                                    onChange={(e) => setOtro(e.target.value as Colaborador)}
                                  >
                                    <option value="">Marcar por otra persona…</option>
                                    {disponibles
                                      .filter((p) => p.key !== yo)
                                      .map((p) => (
                                        <option key={p.key} value={p.key}>
                                          {p.nombre}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    type="button"
                                    className={styles.popSecundario}
                                    disabled={guardando || !otro}
                                    onClick={() =>
                                      otro &&
                                      escribir(
                                        {
                                          ...marcaBase,
                                          colaborador: otro,
                                          origen: esBanqueo ? origen : undefined,
                                        },
                                        'add',
                                      )
                                    }
                                  >
                                    Añadir
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </section>
  );
}
