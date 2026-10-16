import Hueso, { Esqueleto } from './Hueso';
import s from '@/styles/quizEncib.module.css';

/**
 * Las preguntas del ENCIB (`cursos/examen/encib`): cabecera con el cuadrado de
 * estadísticas, los tres años y la carta con su enunciado y cuatro
 * alternativas. Cajas del juego real (`QuizEncib`), así mide lo mismo.
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

        <div className={s.mazo}>
          <div className={s.carta}>
            <div className={s.top}>
              <Hueso w={110} h={16} />
              <Hueso w={96} h={24} r={999} />
            </div>
            <div>
              <Hueso w="100%" h={20} mb={9} />
              <Hueso w="92%" h={20} mb={9} />
              <Hueso w="60%" h={20} />
            </div>
            <div className={s.ops}>
              {[0, 1, 2, 3].map((i) => (
                <Hueso key={i} w="100%" h={56} r={14} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Esqueleto>
  );
}
