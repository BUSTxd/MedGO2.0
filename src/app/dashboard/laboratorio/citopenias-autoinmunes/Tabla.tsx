'use client';
// La tabla del laboratorio (como la de Hipersensibilidad): intravascular frente a
// extravascular. El contenido lo manda el servidor solo con el plan (`contenidoDelLab`).

import type { LadoTabla, TablaLab } from '@/lib/data/citopenias/tipos';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';

const COLOR = ['#D92D4A', '#6D4FD8'] as const;

function Celda({ v }: { v: LadoTabla }) {
  return <td>{Array.isArray(v) ? v.map((x) => <div key={x}>{x}</div>) : v}</td>;
}

export default function PanelTabla({ nota, onCerrar }: { nota: TablaLab; onCerrar: () => void }) {
  const { comparacion: k, claves: u } = nota;
  return (
    <div className={c.velo} role="dialog" aria-label={nota.titulo} data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className={ls.panelNeo}>
        <div className={c.listaCab}>
          <h3>{nota.titulo}</h3>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Cerrar</button>
        </div>
        <div className={ls.tablaScroll}>
          <table className={ls.tablaNeo}>
            <thead>
              <tr>
                <th>Hallazgo</th>
                <th style={{ color: COLOR[0] }}>{k.columnas[0]}</th>
                <th style={{ color: COLOR[1] }}>{k.columnas[1]}</th>
                <th>Clave</th>
              </tr>
            </thead>
            <tbody>
              {k.filas.map((f) => (
                <tr key={f.nombre}>
                  <td><strong>{f.nombre}</strong></td>
                  <Celda v={f.a} />
                  <Celda v={f.b} />
                  <td>{f.clave}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className={h.tablaSub}>{u.titulo}</h4>
          <table className={ls.tablaNeo}>
            <thead><tr><th>Hallazgo</th><th>Dónde</th><th>Qué significa</th></tr></thead>
            <tbody>
              {u.filas.map((f) => (
                <tr key={f.nombre}>
                  <td><strong>{f.nombre}</strong></td>
                  <td style={{ color: COLOR[f.columna], fontWeight: 700 }}>{f.donde}</td>
                  <td>{f.texto ?? f.flujo?.join(' → ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
