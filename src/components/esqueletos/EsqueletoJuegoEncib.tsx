import Hueso, { Esqueleto } from './Hueso';
import s from '@/styles/juegoEncib.module.css';

/**
 * El mazo de preguntas del ENCIB (`cursos/examen/encib`): cabecera con el
 * cuadrado de estadísticas, los tres años, los chips de área, la carta y el
 * mando. Las cajas son las del juego, así que mide lo mismo.
 */
export default function EsqueletoJuegoEncib() {
  return (
    <Esqueleto>
      <Hueso w={92} h={14} mb={14} />
      <div className={s.raiz}>
        <div className={s.cabecera}>
          <div className={s.cabTexto}>
            <Hueso w={140} h={20} r={999} mb={10} />
            <Hueso w={220} h={38} mb={8} />
            <Hueso w="min(420px, 90%)" h={14} />
          </div>
          <div className={s.stats}>
            <Hueso w={20} h={20} r={6} />
            <Hueso w={80} h={13} />
            <Hueso w="100%" h={8} r={4} />
            <Hueso w={90} h={11} />
          </div>
        </div>

        <div className={s.anios}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={s.anio}>
              <Hueso w={64} h={26} />
              <Hueso w={80} h={11} />
            </div>
          ))}
        </div>

        <div className={s.chips}>
          {[70, 96, 104, 92, 96, 92, 104, 116, 150].map((w, i) => (
            <Hueso key={i} w={w} h={34} r={999} />
          ))}
        </div>

        <div className={s.escenario}>
          <Hueso w="100%" h="100%" r={28} />
        </div>

        <div className={s.mando}>
          <Hueso w={48} h={48} r="50%" />
          <div className={s.progreso}>
            <Hueso w={70} h={16} mb={8} style={{ margin: '0 auto 8px' }} />
            <Hueso w="100%" h={6} r={3} />
          </div>
          <Hueso w={48} h={48} r="50%" />
        </div>
      </div>
    </Esqueleto>
  );
}
