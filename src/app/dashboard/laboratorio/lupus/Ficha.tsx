'use client';
// Ficha de una célula, molécula o anticuerpo (panel flotante), como en
// «Hipersensibilidad». Las fichas llegan del servidor solo para los capítulos abiertos.

import type { Escenario } from '@/lib/data/lupus/tipos';
import { srcImagen } from '../hipersensibilidad/imagenes';
import { useContenido } from './ContenidoLab';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';

export function FichaActor({ escenario, actor, onCerrar }: { escenario: Escenario; actor: string; onCerrar: () => void }) {
  const { fichas } = useContenido();
  const decl = escenario.actores[actor];
  if (!decl) return null;
  const f = fichas[decl.info ?? actor];
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
