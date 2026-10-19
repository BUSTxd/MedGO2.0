'use client';
// Ficha de una célula, molécula o anticuerpo (panel flotante) y panel con las
// dos tablas: los cuatro tipos de hipersensibilidad y las enfermedades por
// mecanismo. Cada fila lleva al paso donde se anima.

import type { Escenario, ParteId } from '@/lib/data/hipersensibilidad/tipos';
import FICHAS from '@/lib/data/hipersensibilidad/fichas';
import { ENFERMEDADES, TIPOS } from '@/lib/data/hipersensibilidad/tabla-tipos';
import { srcImagen } from './imagenes';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import s from '@/styles/hipersensibilidad.module.css';

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
          {src ? <img src={src} alt="" /> : <span className={ls.fichaPunto} style={{ background: decl.color }} />}
        </div>
        <div className={c.fichaCabTxt}>
          <h3 className={c.fichaNombre}>{f?.nombre ?? decl.label}</h3>
          <p className={c.fichaMeta}>{f?.tipo}</p>
        </div>
      </div>
      {f && (
        <>
          {f.marcadores && <p className={ls.fichaMarcadores}>{f.marcadores}</p>}
          <p className={c.fichaTexto}>{f.queEs}</p>
          {f.origen && (
            <div className={c.fichaBloque}>
              <p className={c.fichaRotulo}>De dónde proviene</p>
              <p className={c.fichaTexto}>{f.origen}</p>
            </div>
          )}
          <div className={c.fichaBloque}>
            <p className={c.fichaRotulo}>Qué hace aquí</p>
            <p className={c.fichaTexto}>{f.papel}</p>
          </div>
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

export function PanelTabla({ onCerrar, onIr }: { onCerrar: () => void; onIr: (d: Destino) => void }) {
  return (
    <div className={c.velo} role="dialog" aria-label="Los cuatro tipos de hipersensibilidad" data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className={ls.panelNeo}>
        <div className={c.listaCab}>
          <h3>Los cuatro tipos de hipersensibilidad</h3>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Cerrar</button>
        </div>
        <div className={ls.tablaScroll}>
          <table className={ls.tablaNeo}>
            <thead><tr><th>Tipo</th><th>Efector</th><th>Antígeno</th><th>Tiempo</th><th>Cómo lesiona</th><th>Lesión</th><th>Prototipos</th></tr></thead>
            <tbody>
              {TIPOS.map((t) => (
                <tr key={t.tipo}>
                  <td><button type="button" className={s.tipoNombre} style={{ color: t.color }} onClick={() => onIr(t.destino)}>{t.tipo}<span>{t.nombre}</span></button></td>
                  <td>{t.efector}</td>
                  <td>{t.antigeno}</td>
                  <td className={ls.mono}>{t.tiempo}</td>
                  <td>{t.mecanismo}</td>
                  <td>{t.lesion}</td>
                  <td>{t.prototipos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className={s.tablaSub}>Enfermedades por mecanismo</h4>
          <table className={ls.tablaNeo}>
            <thead><tr><th>Enfermedad</th><th>Tipo</th><th>Antígeno o blanco</th><th>Manifestación</th></tr></thead>
            <tbody>
              {ENFERMEDADES.map((e) => {
                const col = TIPOS.find((t) => t.tipo === e.tipo.split(' (')[0])?.color;
                return (
                  <tr key={e.nombre}>
                    <td><button type="button" className={ls.neoNombre} style={{ color: col }} onClick={() => onIr(e.destino)}>{e.nombre}</button></td>
                    <td className={ls.mono} style={{ color: col }}>{e.tipo}</td>
                    <td>{e.blanco}</td>
                    <td>{e.manifestacion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={ls.fuente}>Robbins, Patología humana, cap. 6 (tablas 6.1 a 6.6), completado con Abbas. Toca un tipo o una enfermedad para verla animada.</p>
      </div>
    </div>
  );
}
