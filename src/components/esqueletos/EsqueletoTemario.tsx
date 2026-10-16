import Hueso, { Esqueleto } from './Hueso';
import s from '@/styles/temarioEncib.module.css';

/**
 * El temario del ENCIB (`cursos/examen/temario`): cabecera con cifras y la
 * barra de reparto, buscador y chips, y las primeras áreas con sus subáreas
 * plegadas. Cajas del temario real.
 */
export default function EsqueletoTemario() {
  return (
    <Esqueleto>
      <Hueso w={92} h={14} mb={14} />
      <div className={s.raiz}>
        <div className={s.cabecera}>
          <Hueso w="min(380px, 85%)" h={36} mb={10} />
          <Hueso w="min(620px, 100%)" h={14} mb={7} />
          <Hueso w="min(420px, 80%)" h={14} mb={16} />
          <ul className={s.cifras}>
            {[0, 1, 2, 3].map((i) => (
              <li key={i}>
                <Hueso w={44} h={22} mb={6} />
                <Hueso w="70%" h={11} />
              </li>
            ))}
          </ul>
          <div className={s.reparto}>
            <Hueso w="100%" h={12} r={6} mb={10} />
            <Hueso w="min(560px, 100%)" h={11} />
          </div>
        </div>

        <div className={s.controles}>
          <div className={s.buscador}>
            <Hueso w="60%" h={16} />
          </div>
          <div className={s.chips}>
            {[64, 96, 104, 92, 96, 92, 104, 116, 150].map((w, i) => (
              <Hueso key={i} w={w} h={34} r={999} />
            ))}
          </div>
        </div>

        <div className={s.areas}>
          {[4, 3].map((subs, i) => (
            <div key={i} className={s.area}>
              <div className={s.areaCab}>
                <div className={s.areaTextos}>
                  <Hueso w={160} h={22} mb={6} />
                  <Hueso w={260} h={12} />
                </div>
                <Hueso w={130} h={14} />
              </div>
              <ul className={s.subareas}>
                {Array.from({ length: subs }, (_, j) => (
                  <li key={j} className={s.sub}>
                    <div className={s.subBtn}>
                      <Hueso w={18} h={18} r={4} />
                      <Hueso w={46} h={13} />
                      <Hueso w={`${42 + ((i + j) % 3) * 12}%`} h={14} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Esqueleto>
  );
}
