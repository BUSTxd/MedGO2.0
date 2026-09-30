import Hueso, { Esqueleto } from './Hueso';
import p from '@/styles/dashboardPages.module.css';

// Un panel por tema de `LAB_TOPICS` (laboratorio/page.tsx), todos plegados.
const PANELES = 10;

/** Laboratorio virtual: título y los paneles plegados, uno por materia. */
export default function EsqueletoLaboratorio() {
  return (
    <Esqueleto>
      <div className={p.pagePanelIcon}>
        <Hueso w={20} h={20} r={6} />
      </div>
      <Hueso w={250} h={30} mb={8} />
      <Hueso w="min(360px, 90%)" h={15} mb={30} />

      <div className={p.labSections}>
        {Array.from({ length: PANELES }, (_, i) => (
          <div key={i} className={p.labPanel}>
            <div className={p.labPanelHeader}>
              <Hueso w={48} h={48} r={12} />
              <div className={p.labPanelInfo}>
                <Hueso w={`${48 + ((i * 19) % 30)}%`} h={19} mb={8} />
                <Hueso w={94} h={20} r={999} mb={8} />
                <Hueso w={104} h={18} r={999} />
              </div>
              <Hueso w={20} h={20} r={6} />
            </div>
          </div>
        ))}
      </div>
    </Esqueleto>
  );
}
