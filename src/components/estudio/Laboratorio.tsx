'use client';
import { cx, Icono, type NombreIcono } from './Icono';
import { ArteLab, norm } from './Graficos';
import type { Contexto } from './EspacioEstudio';
import type { LabMuestra } from '@/lib/estudio/muestra';

const CATEGORIAS: [string, string, NombreIcono][] = [
  ['Todos', 'Todos los recursos', 'layers'],
  ['Simulación', 'Simulaciones', 'flask'],
  ['3D', 'Modelos 3D', 'cube'],
  ['Atlas', 'Atlas', 'book'],
];

export default function Laboratorio({ ctx, labs }: { ctx: Contexto; labs: LabMuestra[] }) {
  const { st, set, lesson, irA, abrirLab } = ctx;
  const related = undefined as { id: string } | undefined;
  const subjects = [...new Set(labs.map((l) => l.subject))];
  const found = labs.filter((l) =>
    (st.labFilter === 'Todos' || l.category === st.labFilter)
    && (st.labSubject === 'Todos' || l.subject === st.labSubject)
    && (!st.labSearch || norm(`${l.title} ${l.subject}`).includes(norm(st.labSearch))));

  return (
    <main className={cx('page-scroll studio-page')}>
      <div className={cx('studio-shell')}>
        <div className={cx('studio-heading')}>
          <div><div className={cx('eyebrow')}>EXPLORA Y COMPRENDE</div><h1>Laboratorio virtual</h1><p>Una forma de ver lo que estás estudiando.</p></div>
          <button className={cx('button secondary')} onClick={() => irA('study')}><Icono n="arrowLeft" />Volver a mi clase</button>
        </div>
        <div className={cx('lab-workspace')}>
          <aside className={cx('resource-filters')} aria-label="Tipos de recurso">
            <div className={cx('eyebrow')}>BIBLIOTECA</div>
            {CATEGORIAS.map(([id, label, icon]) => (
              <button key={id} className={cx('resource-filter', st.labFilter === id && 'active')} aria-pressed={st.labFilter === id} onClick={() => set(() => ({ labFilter: id }))}>
                <Icono n={icon} /><span>{label}</span><small>{id === 'Todos' ? labs.length : labs.filter((l) => l.category === id).length}</small>
              </button>
            ))}
            <div className={cx('filter-help')}><Icono n="info" />Abre un recurso y vuelve al mismo punto de tu resumen.</div>
          </aside>
          <section className={cx('resource-main')} aria-label="Recursos del laboratorio">
            <div className={cx('resource-toolbar')}>
              <label className={cx('resource-search')}>
                <Icono n="search" />
                <input type="search" placeholder="Buscar un modelo, simulación o tema" value={st.labSearch} aria-label="Buscar recursos del laboratorio" onChange={(e) => set(() => ({ labSearch: e.target.value }))} />
              </label>
              <label className={cx('subject-filter')}>
                <span>Materia</span>
                <select aria-label="Filtrar laboratorio por materia" value={st.labSubject} onChange={(e) => set(() => ({ labSubject: e.target.value }))}>
                  <option value="Todos">Todas las materias</option>
                  {subjects.map((s) => <option key={s}>{s}</option>)}
                </select>
                <Icono n="down" />
              </label>
            </div>
            <div className={cx('resource-results')}>
              <span>{found.length} {found.length === 1 ? 'recurso disponible' : 'recursos disponibles'}</span>
              <span><Icono n="book" />Tu clase: {lesson.title}</span>
            </div>
            <div className={cx('labs-grid')}>
              {found.length ? found.map((l) => (
                <button key={l.id} className={cx('lab-card', related?.id === l.id && 'is-related')} onClick={() => abrirLab(l.id)}>
                  <div className={cx('lab-card-art', l.kind)}>
                    <span className={cx('lab-badge')}>{l.category}</span>
                    <ArteLab kind={l.kind} />
                  </div>
                  <div className={cx('lab-card-body')}>
                    <span className={cx('lab-subject')}>{l.subject}</span>
                    <h2>{l.title}</h2>
                    <p>{l.description}</p>
                    <div className={cx('lab-card-bottom')}>
                      <span>{related?.id === l.id ? <><Icono n="pin" />Para tu clase</> : 'Explorar recurso'}</span>
                      <Icono n="arrow" />
                    </div>
                  </div>
                </button>
              )) : (
                <div className={cx('resource-empty')}>
                  <Icono n="search" />
                  <h2>No encontramos ese recurso</h2>
                  <p>Prueba con otra palabra o cambia los filtros.</p>
                  <button className={cx('button secondary')} onClick={() => set(() => ({ labFilter: 'Todos', labSubject: 'Todos', labSearch: '' }))}>Limpiar filtros</button>
                </div>
              )}
            </div>
          </section>
        </div>
        <p className={cx('studio-demo')}><Icono n="info" />Vista de interfaz · Los recursos son demostraciones locales.</p>
      </div>
    </main>
  );
}
