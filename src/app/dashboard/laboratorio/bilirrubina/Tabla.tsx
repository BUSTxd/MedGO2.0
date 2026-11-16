'use client';
// La tabla resumen del laboratorio (la misma forma que la de Citopenias): prehepática, hepática y
// posthepática, y cada causa en su sitio. El contenido lo manda el servidor solo con el plan.

import type { CeldaTabla, TablaLab } from '@/lib/data/bilirrubina/tipos';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';

const COLOR = ['#D92D4A', '#C2307A', '#18A34A'] as const;

function Celda({ v }: { v: CeldaTabla }) {
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
          <h4 className={h.tablaSub}>{k.titulo}</h4>
          <table className={ls.tablaNeo}>
            <thead>
              <tr>
                <th>Hallazgo</th>
                {k.columnas.map((col, i) => <th key={col} style={{ color: COLOR[i] }}>{col}</th>)}
                <th>Clave</th>
              </tr>
            </thead>
            <tbody>
              {k.filas.map((f) => (
                <tr key={f.nombre}>
                  <td><strong>{f.nombre}</strong></td>
                  {f.v.map((x, i) => <Celda key={i} v={x} />)}
                  <td>{f.clave ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className={h.tablaSub}>{u.titulo}</h4>
          <table className={ls.tablaNeo}>
            <thead><tr><th>Causa</th><th>Dónde</th><th>Qué la distingue</th></tr></thead>
            <tbody>
              {u.filas.map((f) => (
                <tr key={f.nombre}>
                  <td><strong>{f.nombre}</strong></td>
                  <td style={{ color: COLOR[f.columna], fontWeight: 700 }}>{f.donde}</td>
                  <td>{f.texto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
