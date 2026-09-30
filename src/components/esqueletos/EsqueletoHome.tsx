import Hueso, { Esqueleto } from './Hueso';
import e from '@/styles/esqueletos.module.css';
import p from '@/styles/dashboardPages.module.css';

/** Home: bienvenida a todo el ancho + Tu esfuerzo · Continuar viendo · Estadísticas. */
export default function EsqueletoHome() {
  return (
    <Esqueleto>
      <div className={p.pagePanelIcon}>
        <Hueso w={20} h={20} r={6} />
      </div>

      <div className={p.homeDashboard}>
        <Hueso className={e.bienvenida}>
          <span className={e.linea} style={{ width: 'min(460px, 80%)', height: 34 }} />
          <span className={e.linea} style={{ width: 'min(220px, 50%)', height: 20 }} />
          <span className={e.linea} style={{ width: 'min(620px, 92%)', height: 14 }} />
          <span className={e.linea} style={{ width: 'min(480px, 70%)', height: 14 }} />
        </Hueso>

        {/* Tu esfuerzo: título, una línea y el círculo de invocación. */}
        <div className={p.dashboardPanel}>
          <Hueso w={110} h={18} mb={16} />
          <Hueso w="75%" h={12} />
          <div className={e.centro} style={{ minHeight: 192, marginTop: 4 }}>
            <Hueso w={150} h={150} r="50%" />
          </div>
        </div>

        {/* Continuar viendo: tres clases recientes. */}
        <div className={p.dashboardPanel}>
          <Hueso w={140} h={18} mb={16} />
          {[82, 64, 74].map((w) => (
            <div key={w} className={e.fila}>
              <Hueso w={`${w}%`} h={14} />
              <Hueso w={70} h={12} />
            </div>
          ))}
        </div>

        {/* Estadísticas: aro de eficiencia y las cuatro cifras. */}
        <div className={`${p.dashboardPanel} ${p.statsPanel}`}>
          <Hueso w={110} h={18} mb={16} />
          <Hueso w={110} h={110} r="50%" mb={16} />
          <div className={p.statsMiniGrid}>
            {Array.from({ length: 4 }, (_, i) => (
              <Hueso key={i} h={56} r={10} />
            ))}
          </div>
        </div>
      </div>
    </Esqueleto>
  );
}
