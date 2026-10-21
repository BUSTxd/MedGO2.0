'use client';
import { useEffect, useRef, useState } from 'react';
import { cx, Icono } from './Icono';
import { ArteLab, norm } from './Graficos';
import { todasLasLecciones } from './EspacioEstudio';
import type { LabMuestra } from '@/lib/estudio/muestra';

/** Cierra al pulsar el fondo, no el diálogo. */
function Fondo({ onCerrar, children }: { onCerrar: () => void; children: React.ReactNode }) {
  return (
    <div className={cx('overlay-backdrop')} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      {children}
    </div>
  );
}

export function Buscador({ onCerrar, onAbrir }: { onCerrar: () => void; onAbrir: (id: string, cid: string) => void }) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const found = todasLasLecciones()
    .filter((l) => !query || norm(`${l.title} ${l.course.name} ${l.summary.intro}`).includes(norm(query)))
    .slice(0, 8);
  return (
    <Fondo onCerrar={onCerrar}>
      <section className={cx('search-dialog')} role="dialog" aria-modal="true" aria-labelledby="search-heading" tabIndex={-1}>
        <div className={cx('dialog-search-row')}>
          <Icono n="search" />
          <input ref={input} placeholder="¿Qué quieres estudiar?" aria-label="Buscar una clase o tema" autoComplete="off" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && found[0]) onAbrir(found[0].id, found[0].course.id); }} />
          <button aria-label="Cerrar búsqueda" onClick={onCerrar}><kbd>ESC</kbd></button>
        </div>
        <div className={cx('search-results')}>
          {found.length ? found.map((l) => (
            <button key={l.id} className={cx('search-result')} onClick={() => onAbrir(l.id, l.course.id)}>
              <Icono n="document" />
              <span>{l.title}<small>{l.course.name} · {l.group.title}</small></span>
              <Icono n="arrow" cls="result-arrow" />
            </button>
          )) : <div className={cx('empty-state')}>Prueba con otro tema, por ejemplo «corazón».</div>}
        </div>
        <div className={cx('search-footer')} id="search-heading">Busca en las clases de muestra · Enter para abrir el primer resultado</div>
      </section>
    </Fondo>
  );
}

export function VisorLab({ lab, onCerrar }: { lab: LabMuestra; onCerrar: () => void }) {
  const [rotacion, setRotacion] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [vista, setVista] = useState<'normal' | 'outline'>('normal');
  const dialogo = useRef<HTMLElement>(null);
  useEffect(() => { (dialogo.current?.querySelector<HTMLElement>('button,input,select') || dialogo.current)?.focus(); }, []);
  return (
    <Fondo onCerrar={onCerrar}>
      <section ref={dialogo} className={cx('lab-view-dialog')} role="dialog" aria-modal="true" aria-labelledby="lab-view-title" tabIndex={-1}>
        <header className={cx('lab-view-head')}>
          <div><h2 id="lab-view-title">{lab.title}</h2><p>{lab.subject} · {lab.category}</p></div>
          <button className={cx('icon-button')} aria-label="Cerrar recurso" onClick={onCerrar}><Icono n="close" /></button>
        </header>
        <div className={cx('lab-view-body')}>
          <div className={cx('lab-stage')}>
            <div className={cx('lab-stage-object')} style={{
              transform: `rotateY(${rotacion}deg) rotateZ(${rotacion / 15}deg) scale(${zoom / 100})`,
              filter: vista === 'outline' ? 'saturate(.35) contrast(1.3)' : 'none',
            }}>
              <ArteLab kind={lab.kind} />
            </div>
            <span className={cx('viewer-help')}>Vista ilustrativa · Explora los controles</span>
          </div>
          <aside className={cx('lab-settings')}>
            <div className={cx('eyebrow')}>Controles del visor</div>
            <div>
              <label className={cx('setting-label')} htmlFor="lab-rotation">Rotación<span>{rotacion}°</span></label>
              <input type="range" id="lab-rotation" min="-65" max="65" value={rotacion} onChange={(e) => setRotacion(Number(e.target.value))} />
            </div>
            <div>
              <label className={cx('setting-label')} htmlFor="lab-zoom">Acercamiento<span>{zoom}%</span></label>
              <input type="range" id="lab-zoom" min="70" max="135" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            </div>
            <div>
              <div className={cx('setting-label')}>Presentación</div>
              <div className={cx('filter-pills')}>
                <button className={cx('filter-pill', vista === 'normal' && 'active')} onClick={() => setVista('normal')}>Completa</button>
                <button className={cx('filter-pill', vista === 'outline' && 'active')} onClick={() => setVista('outline')}>Contraste</button>
              </div>
            </div>
            <p>{lab.description}<br /><br />Esta vista permite probar la navegación. El motor del laboratorio real todavía no está conectado.</p>
            <button className={cx('text-button')} onClick={() => { setRotacion(0); setZoom(100); }}><Icono n="reset" />Restablecer vista</button>
          </aside>
        </div>
        <div className={cx('lab-view-footer')}><Icono n="info" />Puedes cerrar este recurso y continuar exactamente donde estabas leyendo.</div>
      </section>
    </Fondo>
  );
}
