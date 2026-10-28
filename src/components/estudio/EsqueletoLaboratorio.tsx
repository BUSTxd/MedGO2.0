import { cx, Icono, type NombreIcono } from './Icono';
import { BarraEsqueleto, Hueso } from './EsqueletoEstudio';

/** Los mismos filtros que `IndiceLaboratorio`: sus nombres no dependen de la cuenta. */
const CATEGORIAS: [string, NombreIcono][] = [
  ['Todos los recursos', 'layers'],
  ['Simulaciones', 'flask'],
  ['Modelos 3D', 'cube'],
  ['Atlas', 'book'],
  ['Prácticas', 'quiz'],
  ['Investigación', 'target'],
];

/** Lo que cabe en la primera pantalla: dos filas de la rejilla de tres. */
const TARJETAS = 6;

/**
 * La silueta del índice del Laboratorio virtual, con las clases de `IndiceLaboratorio`.
 * Cabecera, filtros y buscador ya salen de verdad; los conteos, el filtro por curso y
 * las tarjetas (que dependen del plan) van en huesos.
 */
export default function EsqueletoLaboratorio({ barra }: { barra?: React.ReactNode }) {
  return (
    <div className={cx('wrapper esq')} data-palette="pearl" role="status" aria-busy="true" aria-label="Cargando el laboratorio virtual">
      {barra ?? <BarraEsqueleto page="labs" />}
      <main className={cx('page-scroll studio-page')}>
        <div className={cx('studio-shell')}>
          <div className={cx('studio-heading')}>
            <div><div className={cx('eyebrow')}>EXPLORA Y COMPRENDE</div><h1>Laboratorio virtual</h1><p>Una forma de ver lo que estás estudiando.</p></div>
            <span className={cx('button secondary')}><Icono n="arrowLeft" />Volver a mi clase</span>
          </div>
          <div className={cx('lab-workspace')}>
            <aside className={cx('resource-filters')}>
              <div className={cx('eyebrow')}>BIBLIOTECA</div>
              {CATEGORIAS.map(([label, icon], i) => (
                <span key={label} className={cx('resource-filter', i === 0 && 'active')}>
                  <Icono n={icon} /><span>{label}</span><small className={cx('esq-vacio')}>00</small>
                </span>
              ))}
              <div className={cx('filter-help')}><Icono n="info" />Abre un recurso y vuelve a tu clase desde «Estudiar».</div>
            </aside>
            <section className={cx('resource-main')}>
              <div className={cx('resource-toolbar')}>
                <div className={cx('resource-search')}>
                  <Icono n="search" />
                  <span className={cx('esq-placeholder')}>Buscar un modelo, simulación o tema</span>
                </div>
                <div className={cx('subject-filter')}><Hueso w="100%" h={44} r={12} /></div>
              </div>
              <div className={cx('resource-results')}><Hueso w={128} h={10} /></div>
              <div className={cx('labs-grid')}>
                {Array.from({ length: TARJETAS }, (_, i) => (
                  <div key={i} className={cx('lab-card')}>
                    <div className={cx('lab-card-art')}>
                      <Hueso w={64} h={18} r={5} style={{ position: 'absolute', left: 15, top: 13 }} />
                      <Hueso w={72} h={72} r={18} />
                    </div>
                    <div className={cx('lab-card-body')}>
                      <div className={cx('esq-pila')}>
                        <Hueso w="42%" h={8} />
                        <Hueso w={`${[78, 64, 84, 70, 58, 76][i]}%`} h={15} style={{ margin: '4px 0 2px' }} />
                        <Hueso w="100%" h={10} />
                        <Hueso w={`${[72, 86, 60, 80, 68, 74][i]}%`} h={10} />
                      </div>
                      <div className={cx('lab-card-bottom')} style={{ marginTop: 16 }}>
                        <Hueso w={86} h={10} /><Hueso w={14} h={14} r={4} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
