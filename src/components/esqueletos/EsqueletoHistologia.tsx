import Hueso, { Esqueleto } from './Hueso';
import h from '@/styles/histologia.module.css';

// Una tarjeta por curso de `HISTO_CURSOS`. El número va a mano para no meter el
// archivo de datos del atlas en el esqueleto: si se añade un curso, subirlo aquí.
const CURSOS = 7;

/** Histología: título y la rejilla de cursos del atlas. */
export default function EsqueletoHistologia() {
  return (
    <Esqueleto>
      <div className={h.panelIcon}>
        <Hueso w={26} h={26} r={6} />
      </div>
      <Hueso w={160} h={32} mb={8} />
      <Hueso w="min(440px, 90%)" h={14} mb={30} />

      <div className={h.cursoGrid}>
        {Array.from({ length: CURSOS }, (_, i) => (
          <div key={i} className={h.cursoCard}>
            <div className={h.cursoCardTop}>
              <Hueso w={96} h={22} r={999} />
              <Hueso w={30} h={30} />
            </div>
            <Hueso w="70%" h={20} />
            <Hueso w="92%" h={13} />
            <Hueso w={92} h={14} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>
    </Esqueleto>
  );
}
