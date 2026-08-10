'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Colaborador } from '@/lib/data/aportes';
import { claveMarca, indexarMarcas, type Marca, type MarcasIndex } from '@/lib/aportes-marcas';
import type { GrupoRegistro, ItemRegistro, SlotRegistro } from '@/lib/aportes-registro';
import styles from '@/styles/aportes.module.css';

/**
 * Registro de quién subió qué.
 *
 * El resto del panel se deduce del repo; esto no: cada persona pinta el círculo
 * del material que aportó y la marca se guarda en Supabase, así que todo el
 * equipo ve el mismo registro. Como una marca ajena no se puede deshacer desde
 * el propio código, cada acción pide confirmación antes de escribir.
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

/** Diana del popover: el material concreto sobre el que se está decidiendo. */
interface Foco {
  grupo: GrupoRegistro;
  item: ItemRegistro;
  slot: SlotRegistro;
  clave: string;
}

const ESTADO_TEXTO: Record<string, string> = {
  listo: 'publicado',
  falta: 'aún no está en la web',
  futuro: 'material a futuro',
};

/**
 * El círculo pintado. Vacío = nadie lo ha reclamado; con una persona toma su
 * color; con varias se parte en sectores iguales, que es exactamente lo que
 * hace el reparto de crédito con esa unidad.
 */
function Circulo({
  personas,
  colores,
  activo,
  onClick,
  titulo,
}: {
  personas: Colaborador[];
  colores: Record<string, string>;
  activo: boolean;
  onClick: () => void;
  titulo: string;
}) {
  const n = personas.length;
  const fondo =
    n === 0
      ? undefined
      : n === 1
        ? colores[personas[0]]
        : `conic-gradient(${personas
            .map((p, i) => `${colores[p]} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`)
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
      style={fondo ? { background: fondo, borderColor: 'transparent' } : undefined}
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
    const despues =
      accion === 'add'
        ? [...antes, marca.colaborador]
        : antes.filter((p) => p !== marca.colaborador);

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

  const firmantesFoco = foco ? (marcas[foco.clave] ?? []) : [];
  const yaSoyYo = !!yo && firmantesFoco.includes(yo);
  const disponibles = personas.filter((p) => !firmantesFoco.includes(p.key));

  return (
    <section className={styles.registro}>
      <header className={styles.registroHead}>
        <div>
          <h3 className={styles.registroTitulo}>Quién subió qué</h3>
          <p className={styles.registroSub}>
            Pinta el círculo del material que subiste. Se guarda al instante y lo
            ve todo el equipo — de ahí sale el conteo de «Aportes por persona».
            Si un material lo armaron dos, que lo marquen los dos: el círculo se
            parte y el crédito también.
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

      {pestana === 'cursos' && (
        <div className={styles.selector}>
          {cursos.map((g) => {
            const { total, marcados } = progreso(g);
            return (
              <button
                key={g.scopeId}
                type="button"
                className={g.scopeId === grupoId ? styles.selectorChipActivo : styles.selectorChip}
                onClick={() => {
                  setGrupoId(g.scopeId);
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
                      const firmantes = marcas[clave] ?? [];
                      const abierto = foco?.clave === clave;
                      return (
                        <div key={slot.slot} className={styles.slotCelda}>
                          <Circulo
                            personas={firmantes}
                            colores={colores}
                            activo={abierto}
                            titulo={
                              firmantes.length === 0
                                ? `${slot.label} · sin marcar`
                                : `${slot.label} · ${firmantes.map((p) => nombres[p]).join(', ')}`
                            }
                            onClick={() => {
                              setError(null);
                              setOtro('');
                              setFoco(abierto ? null : { grupo: g, item, slot, clave });
                            }}
                          />
                          <span
                            className={
                              slot.estado === 'falta' ? styles.slotLabelFalta : styles.slotLabel
                            }
                          >
                            {slot.label}
                          </span>

                          {abierto && (
                            <div className={styles.popover} ref={popoverRef}>
                              <p className={styles.popTitulo}>{item.titulo}</p>
                              <p className={styles.popSlot}>
                                {slot.label}
                                <span className={styles.popEstado}>
                                  {ESTADO_TEXTO[slot.estado] ?? slot.estado}
                                </span>
                              </p>

                              {firmantes.length > 0 && (
                                <ul className={styles.popLista}>
                                  {firmantes.map((p) => {
                                    const puedo = esAdmin || p === yo;
                                    return (
                                      <li key={p} className={styles.popPersona}>
                                        <span
                                          className={styles.leyendaDot}
                                          style={{ background: colores[p] }}
                                        />
                                        {nombres[p]}
                                        {puedo && (
                                          <button
                                            type="button"
                                            className={styles.popQuitar}
                                            disabled={guardando}
                                            onClick={() =>
                                              escribir(
                                                {
                                                  ambito: g.ambito,
                                                  scopeId: g.scopeId,
                                                  itemId: item.id,
                                                  slot: slot.slot,
                                                  colaborador: p,
                                                },
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

                              <p className={styles.popAviso}>
                                Se guarda para todo el equipo.
                              </p>

                              {yo && !yaSoyYo && (
                                <button
                                  type="button"
                                  className={styles.popPrimario}
                                  disabled={guardando}
                                  onClick={() =>
                                    escribir(
                                      {
                                        ambito: g.ambito,
                                        scopeId: g.scopeId,
                                        itemId: item.id,
                                        slot: slot.slot,
                                        colaborador: yo,
                                      },
                                      'add',
                                    )
                                  }
                                >
                                  {guardando ? 'Guardando…' : 'Sí, lo subí yo'}
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
                                          ambito: g.ambito,
                                          scopeId: g.scopeId,
                                          itemId: item.id,
                                          slot: slot.slot,
                                          colaborador: otro,
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
