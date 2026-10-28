'use client';
/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { TarjetaLab, TipoLab } from '@/lib/estudio/tipos';
import { ultimaClase } from '@/lib/estudio/rutas';
import { cx, Icono, type NombreIcono } from './Icono';
import { norm } from './texto';
import BarraSuperior from './BarraSuperior';
import Desplegable from './Desplegable';

const CATEGORIAS: [TipoLab | 'Todos', string, NombreIcono][] = [
  ['Todos', 'Todos los recursos', 'layers'],
  ['Simulación', 'Simulaciones', 'flask'],
  ['Modelo 3D', 'Modelos 3D', 'cube'],
  ['Atlas', 'Atlas', 'book'],
  ['Práctica', 'Prácticas', 'quiz'],
  ['Investigación', 'Investigación', 'target'],
];

const PIE: Record<TarjetaLab['acceso'], string> = {
  abierto: 'Abrir recurso',
  gratis: 'Gratis',
  vistazo: 'Vistazo gratis',
  prueba: 'Prueba gratis',
  plan: 'Con tu plan',
};

/** El Laboratorio virtual con el diseño del prototipo y los laboratorios reales. */
export default function IndiceLaboratorio({ tarjetas }: { tarjetas: TarjetaLab[] }) {
  const router = useRouter();
  const [categoria, setCategoria] = useState<TipoLab | 'Todos'>('Todos');
  const [materia, setMateria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const buscador = useRef<HTMLInputElement>(null);

  const materias = useMemo(() => [...new Set(tarjetas.flatMap((t) => t.cursos))], [tarjetas]);
  const q = norm(busqueda);
  const found = tarjetas.filter((t) =>
    (categoria === 'Todos' || t.tipo === categoria)
    && (materia === 'Todas' || t.cursos.includes(materia))
    && (!q || norm(`${t.nombre} ${t.desc} ${t.cursos.join(' ')}`).includes(q)));

  return (
    <div className={cx('wrapper')} data-palette="pearl">
      <BarraSuperior page="labs" />
      <main className={cx('page-scroll studio-page')}>
        <div className={cx('studio-shell')}>
          <div className={cx('studio-heading')}>
            <div><div className={cx('eyebrow')}>EXPLORA Y COMPRENDE</div><h1>Laboratorio virtual</h1><p>Una forma de ver lo que estás estudiando.</p></div>
            <button className={cx('button secondary')} onClick={() => router.push(ultimaClase())}><Icono n="arrowLeft" />Volver a mi clase</button>
          </div>
          <div className={cx('lab-workspace')}>
            <aside className={cx('resource-filters')} aria-label="Tipos de recurso">
              <div className={cx('eyebrow')}>BIBLIOTECA</div>
              {CATEGORIAS.map(([id, label, icon]) => (
                <button key={id} className={cx('resource-filter', categoria === id && 'active')} aria-pressed={categoria === id} onClick={() => setCategoria(id)}>
                  <Icono n={icon} /><span>{label}</span><small>{id === 'Todos' ? tarjetas.length : tarjetas.filter((t) => t.tipo === id).length}</small>
                </button>
              ))}
              <div className={cx('filter-help')}><Icono n="info" />Abre un recurso y vuelve a tu clase desde «Estudiar».</div>
            </aside>
            <section className={cx('resource-main')} aria-label="Recursos del laboratorio">
              <div className={cx('resource-toolbar')}>
                <div className={cx('resource-search')}>
                  <Icono n="search" />
                  <input ref={buscador} type="search" placeholder="Buscar un modelo, simulación o tema" value={busqueda} aria-label="Buscar recursos del laboratorio" onChange={(e) => setBusqueda(e.target.value)} />
                  {busqueda && <button type="button" className={cx('campo-limpiar')} aria-label="Limpiar búsqueda de material" onClick={() => { setBusqueda(''); buscador.current?.focus(); }}><Icono n="close" /></button>}
                </div>
                <div className={cx('subject-filter')}>
                  <Desplegable
                    etiqueta="Filtrar laboratorio por curso"
                    variante="campo"
                    icono="book"
                    valor={materia}
                    opciones={[{ value: 'Todas', label: 'Todos los cursos', simbolo: 'layers' }, ...materias.map((m) => ({ value: m, label: m, simbolo: 'book' as const }))]}
                    onCambiar={setMateria}
                  />
                </div>
              </div>
              <div className={cx('resource-results')}>
                <span>{found.length} {found.length === 1 ? 'recurso disponible' : 'recursos disponibles'}</span>
              </div>
              <div className={cx('labs-grid')}>
                {found.length ? found.map((t) => (
                  <Link key={t.id} href={t.href} className={cx('lab-card', t.acceso === 'plan' && 'is-bloqueada')}>
                    <div className={cx('lab-card-art')}>
                      <span className={cx('lab-badge')}>{t.tipo}</span>
                      {t.icono ? <img src={t.icono} alt="" /> : <Icono n={t.tipo === 'Investigación' ? 'target' : 'flask'} cls="lab-art-icono" />}
                      <span className={cx('lab-open')}><Icono n="arrow" /></span>
                    </div>
                    <div className={cx('lab-card-body')}>
                      <span className={cx('lab-subject')}>{t.cursos.join(' · ')}</span>
                      <h2>{t.nombre}</h2>
                      <p>{t.desc}</p>
                      <div className={cx('lab-card-bottom')}>
                        <span>{t.acceso === 'plan' && <Icono n="lock" />}{PIE[t.acceso]}</span>
                        <Icono n="arrow" />
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className={cx('resource-empty')}>
                    <Icono n="search" />
                    <h2>No encontramos ese recurso</h2>
                    <p>Prueba con otra palabra o cambia los filtros.</p>
                    <button className={cx('button secondary')} onClick={() => { setCategoria('Todos'); setMateria('Todas'); setBusqueda(''); }}>Limpiar filtros</button>
                  </div>
                )}
              </div>
            </section>
          </div>
          <p className={cx('studio-demo')}><Icono n="info" />Las imágenes de vista previa de cada laboratorio llegan pronto.</p>
        </div>
      </main>
    </div>
  );
}
