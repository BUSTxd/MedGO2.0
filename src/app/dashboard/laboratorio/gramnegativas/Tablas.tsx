'use client';
// Panel de tablas resumen del laboratorio «Infecciones bacterianas por gramnegativas»: el
// de Hipersensibilidad (mismas clases de panel y de tabla), con una pestaña por grupo de
// tablas. Cada fila lleva al paso donde se anima. Las tablas de pago no llegan sin el plan
// (`contenidoDelLab`): su pestaña sale con candado y lleva al muro.

import { useState } from 'react';
import type { Destino, GrupoTablas, ParteId, TablaResumen } from '@/lib/data/gramnegativas/tipos';
import type { Contenido } from '@/lib/gramnegativas/contenido';
import { Candado } from './MuroPago';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import g from '@/styles/gramnegativas.module.css';

/** `*así*` va en cursiva (nombres de género y especie). */
function Rico({ t }: { t: string }) {
  return <>{t.split('*').map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}</>;
}

const mismo = (a?: Destino, b?: Destino) => !!a && !!b && a.cap === b.cap && a.paso === b.paso;

type Props = {
  contenido: Contenido;
  /** El capítulo en el que está quien abre el panel: se abre en la pestaña que lo ilustra. */
  desde: ParteId | null;
  onCerrar: () => void;
  onIr: (d: Destino) => void;
  /** Una pestaña de pago sin el plan: el capítulo cerrado que enseña el muro. */
  onMuro: (id: ParteId) => void;
};

export default function PanelTablas({ contenido, desde, onCerrar, onIr, onMuro }: Props) {
  const { tablas: grupos, indice, partes } = contenido;
  const [activo, setActivo] = useState(() => {
    const i = grupos.findIndex((gr) => gr.tablas && desde && gr.capitulos.includes(desde));
    return i === -1 ? 0 : i;
  });
  const grupo = grupos[activo];

  const meta = (id: ParteId) => indice.find((m) => m.id === id);
  const titulo = (d: Destino) => partes.find((p) => p.id === d.cap)?.pasos[d.paso]?.titulo;
  /** El primer capítulo del grupo que el vistazo no abre: el que enseña el muro. */
  const capituloDeMuro = (gr: GrupoTablas) => gr.capitulos.find((id) => !meta(id)?.gratis) ?? gr.capitulos[0];

  const tabla = (t: TablaResumen) => {
    const nCol = t.columnas.length;
    const m = t.destino ? meta(t.destino.cap) : undefined;
    return (
      <section key={t.id}>
        <div className={g.tablaCab}>
          <h4 className={g.tablaTitulo}><Rico t={t.titulo} /></h4>
          {t.farmacologia ? <span className={g.pildora}>Repaso de Farmacología</span> : <span className={g.tablaFuente}>{t.fuente}</span>}
          {t.destino && m && (
            <button type="button" className={g.ver} onClick={() => onIr(t.destino!)} title={titulo(t.destino)}>
              <i className={g.punto} style={{ background: m.color }} />Ver animado · cap. {m.numero}
            </button>
          )}
        </div>
        <table className={`${ls.tablaNeo} ${g.tabla} ${nCol >= 4 ? g.tabla4 : nCol === 3 ? g.tabla3 : ''}`}>
          <thead><tr>{t.columnas.map((col) => <th key={col}>{col}</th>)}</tr></thead>
          <tbody>
            {t.filas.map((f) => {
              const dst = f.destino ?? t.destino;
              const propio = !!f.destino && !mismo(f.destino, t.destino);
              const mf = dst ? meta(dst.cap) : undefined;
              // El título del paso solo si dice algo más que el nombre de la fila.
              const tp = dst ? titulo(dst) : undefined;
              const tf = tp && tp.replaceAll('*', '').trim().toLowerCase() !== f.nombre.replaceAll('*', '').trim().toLowerCase() ? tp : undefined;
              return (
                <tr key={f.nombre}>
                  <td>
                    {dst ? (
                      <button type="button" className={g.filaBtn} onClick={() => onIr(dst)}>
                        <span className={g.filaNombre}><Rico t={f.nombre} /></span>
                        {propio && mf && <span className={g.filaDestino}><i className={g.punto} style={{ background: mf.color }} />Cap. {mf.numero}{tf ? ` · ${tf}` : ''}</span>}
                      </button>
                    ) : (
                      <strong className={g.filaNombre}><Rico t={f.nombre} /></strong>
                    )}
                  </td>
                  {f.celdas.map((cel, i) => (
                    <td key={i} data-label={t.columnas[i + 1]}>{Array.isArray(cel) ? cel.map((x) => <div key={x} className={g.item}><Rico t={x} /></div>) : <Rico t={cel} />}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {t.nota && <p className={g.tablaNota}><Rico t={t.nota} /></p>}
      </section>
    );
  };

  return (
    <div className={c.velo} role="dialog" aria-label="Tablas resumen de la clase" data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className={`${ls.panelNeo} ${g.panel}`}>
        <div className={c.listaCab}>
          <h3>Tablas resumen</h3>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Cerrar</button>
        </div>
        <div className={g.pestanas} role="tablist" aria-label="Grupos de tablas">
          {grupos.map((gr, i) => {
            const cerrada = !gr.tablas;
            return (
              <button
                key={gr.id}
                type="button"
                role="tab"
                aria-selected={i === activo}
                className={`${g.pestana} ${i === activo ? g.pestanaOn : ''} ${cerrada ? g.pestanaCerrada : ''}`}
                onClick={() => (cerrada ? onMuro(capituloDeMuro(gr)) : setActivo(i))}
                title={cerrada ? `${gr.nombre} (de pago)` : gr.nombre}
              >
                {gr.nombre}{cerrada && <Candado />}
              </button>
            );
          })}
        </div>
        <div key={grupo.id} className={`${ls.tablaScroll} ${g.panelCuerpo}`} role="tabpanel">
          {grupo.tablas?.map(tabla)}
        </div>
        <p className={ls.fuente}>{grupo.fuente}</p>
      </div>
    </div>
  );
}
