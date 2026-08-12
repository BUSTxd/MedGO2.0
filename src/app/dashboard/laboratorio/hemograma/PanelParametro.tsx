'use client';
/**
 * Panel lateral con la ficha educativa de un parámetro: qué mide, causas de
 * valor alto y bajo, y el dato clínico. Se abre al pulsar cualquier fila del
 * reporte y se cierra con Esc, con el botón o pulsando fuera.
 *
 * ── Master-detail dentro del propio panel ─────────────────────────────────
 * Cada causa es pulsable y abre su explicación (mecanismo + qué más ves). En
 * vez de montar una segunda capa flotante encima —dos superficies modales
 * compitiendo, y en móvil el panel ya ocupa 100vw—, es el MISMO aside el que
 * se ensancha: la lista de causas se queda a la izquierda y la explicación
 * entra a su derecha, así nunca se pierde de vista el resto de la lista.
 *
 * Bajo 900px no hay sitio para dos columnas: el panel pasa a navegación
 * master→detail (la lista se oculta y aparece «Volver a las causas»). Ese
 * cambio es sólo CSS; el detalle se renderiza una sola vez en el DOM.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  estadoDe,
  rangoDe,
  formatear,
  GLIFO,
  PALABRA,
  type Causa,
  type InfoParametro,
  type Parametro,
  type Sexo,
} from '@/lib/data/hemograma';
import s from '@/styles/hemograma.module.css';

type Direccion = 'alto' | 'bajo';
interface Seleccion { dir: Direccion; i: number }

function Chevron() {
  return (
    <svg className={s.causaChevron} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Lista de causas de una dirección. Cada una abre su explicación. */
function ListaCausas({
  dir, causas, sel, onPick,
}: {
  dir: Direccion;
  causas: Causa[];
  sel: Seleccion | null;
  onPick: (s: Seleccion) => void;
}) {
  const alto = dir === 'alto';
  return (
    <div className={s.panelBloque}>
      <p className={`${s.panelBloqueTitulo} ${alto ? s.tAlto : s.tBajo}`}>
        <span aria-hidden>{alto ? '▲' : '▼'}</span>
        Causas de valor {alto ? 'alto' : 'bajo'}
      </p>
      <ul className={s.panelLista}>
        {causas.map((c, i) => {
          const activa = sel?.dir === dir && sel.i === i;
          return (
            <li key={c.causa}>
              <button
                type="button"
                className={`${s.causaBtn} ${alto ? s.causaAlto : s.causaBajo} ${activa ? s.causaActiva : ''}`}
                aria-expanded={activa}
                onClick={() => onPick({ dir, i })}
              >
                <span className={s.causaTexto}>{c.causa}</span>
                <Chevron />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PanelParametro({
  p, info, valor, sexo, simple, onClose,
}: {
  p: Parametro;
  info: InfoParametro;
  valor: number;
  sexo: Sexo;
  simple: boolean;
  onClose: () => void;
}) {
  const estado = estadoDe(valor, p, sexo);
  const r = rangoDe(p, sexo);
  const claseValor = estado === 'bajo' ? s.vBajo : estado === 'alto' ? s.vAlto : s.vNormal;

  const [sel, setSel] = useState<Seleccion | null>(null);
  const detalle = sel ? info[sel.dir][sel.i] : null;
  const detalleRef = useRef<HTMLDivElement>(null);

  const cerrarDetalle = useCallback(() => setSel(null), []);

  // Esc se maneja aquí y no en el simulador para poder encadenarlo: con una
  // causa abierta cierra la explicación, y sólo entonces cierra el panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (detalle) cerrarDetalle();
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detalle, cerrarDetalle, onClose]);

  // En móvil el detalle sustituye a la lista: hay que llevar el foco y el
  // scroll a lo nuevo, o el usuario se queda mirando el punto donde pulsó.
  useEffect(() => {
    if (detalle) detalleRef.current?.focus();
  }, [detalle]);

  return (
    <>
      <div className={s.panelBack} onClick={onClose} aria-hidden />
      <aside
        className={s.panel}
        data-modo={detalle ? 'detalle' : 'lista'}
        role="dialog"
        aria-modal="true"
        aria-label={p.nombre}
      >
        <button type="button" className={s.panelClose} onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className={s.panelCols}>
          {/* ── Columna izquierda: la ficha y las causas ── */}
          <div className={s.panelMaster}>
            <span className={s.panelAbrev}>{p.abrev}</span>
            <h3 className={s.panelTitulo}>{p.nombre}</h3>

            <div className={s.panelCifras}>
              <div className={s.panelCifra}>
                <span className={s.panelCifraLabel}>Valor</span>
                <span className={`${s.panelCifraValor} ${claseValor}`}>
                  {formatear(valor, p)} <small>{p.unidad}</small>
                </span>
              </div>
              <div className={s.panelCifra}>
                <span className={s.panelCifraLabel}>Referencia</span>
                <span className={s.panelCifraValor}>
                  {p.ceroEsNormal ? '0' : `${formatear(r.min, p)} – ${formatear(r.max, p)}`}
                </span>
              </div>
              <div className={s.panelCifra}>
                <span className={s.panelCifraLabel}>Estado</span>
                <span className={`${s.panelCifraValor} ${claseValor}`}>
                  <span aria-hidden>{GLIFO[estado]}</span> {PALABRA[estado]}
                </span>
              </div>
            </div>

            {p.formula && (
              <div className={s.panelBloque}>
                <p className={`${s.panelBloqueTitulo} ${s.tNeutro}`}>Se calcula así</p>
                <p className={s.panelTexto}><code>{p.formula}</code></p>
              </div>
            )}

            <div className={s.panelBloque}>
              <p className={`${s.panelBloqueTitulo} ${s.tNeutro}`}>Qué mide</p>
              <p className={s.panelTexto}>{simple ? info.simple : info.queMide}</p>
            </div>

            <p className={s.causaAyuda}>Pulsa una causa para ver por qué mueve este parámetro.</p>

            <ListaCausas dir="alto" causas={info.alto} sel={sel} onPick={setSel} />
            <ListaCausas dir="bajo" causas={info.bajo} sel={sel} onPick={setSel} />

            <div className={s.panelDato}>
              <span className={s.panelDatoLabel}>Dato clínico</span>
              {info.dato}
            </div>
          </div>

          {/* ── Columna derecha: la explicación de la causa abierta ── */}
          {detalle && sel && (
            <div className={s.panelDetalleCol}>
              <div
                ref={detalleRef}
                className={s.panelDetalle}
                data-dir={sel.dir}
                tabIndex={-1}
                role="region"
                aria-label={`Explicación: ${detalle.causa}`}
                // Remonta al cambiar de causa para que su animación de entrada
                // se repita en cada salto, igual que los pasos del solucionario.
                key={`${sel.dir}-${sel.i}`}
              >
                <button type="button" className={s.detalleVolver} onClick={cerrarDetalle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Volver a las causas
                </button>

                <div className={s.detalleHead}>
                  <span className={s.detalleBadge}>
                    <span aria-hidden>{sel.dir === 'alto' ? '▲' : '▼'}</span>
                    {p.abrev} {sel.dir === 'alto' ? 'alto' : 'bajo'}
                  </span>
                  <h4 className={s.detalleTitulo}>{detalle.causa}</h4>
                </div>

                <section className={s.detalleBloque} style={{ ['--i' as string]: 0 }}>
                  <p className={s.detalleLabel}>Mecanismo</p>
                  <p className={s.detalleTexto}>{detalle.mecanismo}</p>
                </section>

                <section className={`${s.detalleBloque} ${s.detallePista}`} style={{ ['--i' as string]: 1 }}>
                  <p className={s.detalleLabel}>Qué más ves</p>
                  <p className={s.detalleTexto}>{detalle.pista}</p>
                </section>

                <button type="button" className={s.detalleCerrar} onClick={cerrarDetalle}>
                  Cerrar explicación
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
