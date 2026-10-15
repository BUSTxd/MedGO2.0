'use client';
// Ficha de una célula, proteína o molécula (panel flotante) y panel con la
// tabla de neoplasias por célula de origen.

import type { Escenario, ParteId } from '@/lib/data/linfocitos/tipos';
import FICHAS from '@/lib/data/linfocitos/fichas';
import { NEOPLASIAS } from '@/lib/data/linfocitos/tabla-neoplasias';
import { srcImagen } from '@/lib/data/linfocitos/imagenes';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

export type Destino = { parte: ParteId; paso: string };

export function FichaActor({ escenario, actor, onCerrar }: { escenario: Escenario; actor: string; onCerrar: () => void }) {
  const decl = escenario.actores[actor];
  if (!decl) return null;
  const f = FICHAS[decl.info ?? actor];
  const src = decl.img ? srcImagen(decl.img) : null;
  return (
    <aside className={c.ficha} role="dialog" aria-label={`Ficha de ${f?.nombre ?? decl.label}`}>
      <button type="button" className={c.fichaCerrar} onClick={onCerrar} aria-label="Cerrar ficha">
        <svg viewBox="0 0 16 16" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <div className={c.fichaCab}>
        <div className={c.fichaImg} style={{ ['--fam' as string]: decl.color ?? '#7FA7D9' }}>
          {src ? <img src={src} alt="" /> : <span className={s.fichaPunto} style={{ background: decl.color }} />}
        </div>
        <div className={c.fichaCabTxt}>
          <h3 className={c.fichaNombre}>{f?.nombre ?? decl.label}</h3>
          <p className={c.fichaMeta}>{f?.tipo}</p>
        </div>
      </div>
      {f && (
        <>
          {f.marcadores && <p className={s.fichaMarcadores}>{f.marcadores}</p>}
          <p className={c.fichaTexto}>{f.queEs}</p>
          {f.origen && (
            <div className={c.fichaBloque}>
              <p className={c.fichaRotulo}>De dónde proviene</p>
              <p className={c.fichaTexto}>{f.origen}</p>
            </div>
          )}
          <div className={c.fichaBloque}>
            <p className={c.fichaRotulo}>Qué hace en la ruta</p>
            <p className={c.fichaTexto}>{f.papel}</p>
          </div>
          {f.neoplasia && (
            <div className={s.fichaNeo}>
              <p className={c.fichaRotulo}>Neoplasia que nace aquí</p>
              <p className={c.fichaTexto}>{f.neoplasia}</p>
            </div>
          )}
          {f.clinica && f.clinica.length > 0 && (
            <div className={c.clinica}>
              <p className={c.fichaRotulo}>Correlación clínica</p>
              {f.clinica.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          )}
        </>
      )}
    </aside>
  );
}

export function PanelNeoplasias({ onCerrar, onIr }: { onCerrar: () => void; onIr: (d: Destino) => void }) {
  return (
    <div className={c.velo} role="dialog" aria-label="Neoplasias linfoides por célula de origen" data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className={s.panelNeo}>
        <div className={c.listaCab}>
          <h3>Neoplasias linfoides por célula de origen</h3>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Cerrar</button>
        </div>
        <div className={s.tablaScroll}>
          <table className={s.tablaNeo}>
            <thead><tr><th>Neoplasia</th><th>Célula de origen</th><th>Inmunofenotipo</th><th>Genética</th><th>Clínica</th></tr></thead>
            <tbody>
              {NEOPLASIAS.map((n) => (
                <tr key={n.nombre}>
                  <td><button type="button" className={s.neoNombre} onClick={() => onIr({ parte: 'neoplasias', paso: n.paso })}>{n.nombre}</button></td>
                  <td>{n.origen}</td>
                  <td className={s.mono}>{n.inmunofenotipo}</td>
                  <td>{n.genetica}</td>
                  <td>{n.clinica}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={s.fuente}>Robbins y Cotran, cap. 13 · Clasificación OMS de neoplasias linfoides, 5.ª ed. Toca una neoplasia para verla en el mapa.</p>
      </div>
    </div>
  );
}
