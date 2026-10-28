import { cx, Icono } from './Icono';
import type { Pagina } from './BarraSuperior';

/**
 * La silueta de /estudio mientras llega la sesión o el curso. Las cajas son las
 * clases reales (barra, ruta, temario, lector, índice), así que mide lo mismo que
 * lo que sustituye y el cambio no salta; dentro van huesos con el brillo de hoja.
 *
 * Lo que no depende del alumno (logo, pestañas, buscador, «Tu meta») ya sale de
 * verdad. Con `barra` (la barra real, cuando ya hay sesión) se pinta esa en vez de
 * la de mentira: así lo que ya cargó aparece antes que el resto.
 */
export default function EsqueletoEstudio({ barra }: { barra?: React.ReactNode }) {
  return (
    <div className={cx('wrapper esq')} data-palette="pearl" role="status" aria-busy="true" aria-label="Cargando tu espacio de estudio">
      {barra ?? <BarraEsqueleto page="study" />}
      <div className={cx('contextbar')}>
        <div className={cx('context-label')}>Tu meta</div>
        <Hueso w={150} h={30} r={8} />
        <span className={cx('context-divider')} />
        <Hueso w={210} h={30} r={8} />
        <Hueso w={74} h={20} r={999} />
      </div>
      <main className={cx('workspace')}>
        <aside className={cx('course-nav')}>
          <div className={cx('course-nav-head')}>
            <div className={cx('esq-fila')} style={{ marginBottom: 18 }}>
              <Hueso w={36} h={36} r={10} />
              <div className={cx('esq-pila')} style={{ gap: 7, flex: 1 }}>
                <Hueso w="78%" h={13} />
                <Hueso w="52%" h={9} />
              </div>
            </div>
            <Hueso w="100%" h={33} r={7} />
          </div>
          <div className={cx('course-nav-scroll')}>
            {[6, 5].map((n, g) => (
              <section key={g} className={cx('nav-group')}>
                <div className={cx('nav-group-heading')}><Hueso w="46%" h={8} /></div>
                {Array.from({ length: n }, (_, i) => (
                  <div key={i} className={cx('lesson-link')}>
                    <Hueso w={14} h={14} r={4} />
                    <Hueso w={`${[82, 64, 74, 90, 58, 70][i]}%`} h={10} style={{ marginTop: 2 }} />
                  </div>
                ))}
              </section>
            ))}
          </div>
        </aside>
        <section className={cx('study-area')}>
          <div className={cx('study-toolbar')}>
            <div className={cx('esq-fila')}><Hueso w={92} h={30} r={8} /><Hueso w={92} h={30} r={8} /></div>
            <div className={cx('esq-fila')}><Hueso w={118} h={26} r={999} /><Hueso w={32} h={32} r={8} /></div>
          </div>
          <div className={cx('reading-layout')}>
            <div className={cx('article-scroller')}>
              <div className={cx('article')}>
                <div className={cx('esq-pila')}>
                  <Hueso w={190} h={10} />
                  <Hueso w="74%" h={30} r={8} style={{ marginTop: 22 }} />
                  <Hueso w="46%" h={30} r={8} />
                  <div className={cx('esq-fila')} style={{ margin: '10px 0 22px' }}>
                    <Hueso w={82} h={22} r={999} /><Hueso w={104} h={22} r={999} /><Hueso w={70} h={22} r={999} />
                  </div>
                  <Lineas anchos={[100, 97, 99, 93, 62]} />
                  <div className={cx('esq-fila')} style={{ marginTop: 26 }}>
                    <Hueso w={26} h={26} r={7} /><Hueso w={230} h={17} />
                  </div>
                  <Lineas anchos={[98, 100, 95, 71]} />
                  <Hueso w="100%" h={128} r={14} style={{ marginTop: 22 }} />
                </div>
              </div>
            </div>
            <aside className={cx('reading-aside')}>
              <div className={cx('esq-pila')} style={{ gap: 14 }}>
                <Hueso w={86} h={9} />
                {[88, 72, 80, 64, 76].map((w, i) => <Hueso key={i} w={`${w}%`} h={10} />)}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

/** La barra marina antes de la sesión: todo es fijo salvo el avatar. */
export function BarraEsqueleto({ page }: { page: Pagina | null }) {
  const pestanas = [['study', 'Estudiar', 'book'], ['exams', 'Exámenes', 'quiz'], ['labs', 'Laboratorio virtual', 'flask'], ['progress', 'Mi progreso', 'chart']] as const;
  return (
    <header className={cx('topbar')}>
      <span className={cx('brand')}><span className={cx('brand-lockup')} aria-hidden="true" /></span>
      <nav className={cx('main-nav')} aria-hidden="true">
        {pestanas.map(([id, label, icon]) => (
          <span key={id} className={cx('nav-link', page === id && 'active')}><Icono n={icon} /><span>{label}</span></span>
        ))}
      </nav>
      <div className={cx('top-tools')} aria-hidden="true">
        <span className={cx('search-launch')}><Icono n="search" /><span>Buscar una clase o tema...</span><kbd>Ctrl K</kbd></span>
        <div className={cx('top-account')}>
          <span className={cx('icon-button moon-toggle')} style={{ '--moon-color': '#245b8f' } as React.CSSProperties}><Icono n="moon" /></span>
          <Hueso w={32} h={32} r="50%" />
        </div>
      </div>
    </header>
  );
}

function Lineas({ anchos }: { anchos: number[] }) {
  return <>{anchos.map((w, i) => <Hueso key={i} w={`${w}%`} h={12} style={{ marginTop: i ? 0 : 6 }} />)}</>;
}

export function Hueso({ w, h, r, style }: { w: number | string; h: number; r?: number | string; style?: React.CSSProperties }) {
  return <span className={cx('esq-hueso')} style={{ width: w, height: h, borderRadius: r, ...style }} />;
}
