'use client';
/**
 * Modo quiz: se muestra un hemograma sin decir de quién es y el alumno elige
 * la condición. Las alternativas se barajan y siempre incluyen la correcta.
 *
 * El feedback no se limita a «bien/mal»: cita los hallazgos clave del
 * escenario real, que es lo que enseña a leer el patrón la próxima vez.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  ESCENARIOS,
  GRUPOS,
  PARAMETROS,
  calcularValores,
  estadoDe,
  formatear,
  GLIFO,
  PALABRA,
  type Escenario,
  type Sexo,
} from '@/lib/data/hemograma';
import { shuffle } from '@/lib/utils/shuffle';
import s from '@/styles/hemograma.module.css';

const N_OPCIONES = 4;

/** Ronda = escenario a adivinar + alternativas barajadas que lo incluyen. */
function nuevaRonda(evitar?: string) {
  const posibles = ESCENARIOS.filter((e) => e.id !== evitar);
  const correcto = posibles[Math.floor(Math.random() * posibles.length)];
  const distractores = shuffle(ESCENARIOS.filter((e) => e.id !== correcto.id)).slice(0, N_OPCIONES - 1);
  return { correcto, opciones: shuffle([correcto, ...distractores]) };
}

export default function QuizHemograma({ sexo }: { sexo: Sexo }) {
  const [ronda, setRonda] = useState(() => nuevaRonda());
  const [elegido, setElegido] = useState<string | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [total, setTotal] = useState(0);

  const valores = useMemo(() => calcularValores(ronda.correcto.valores), [ronda]);
  const acerto = elegido === ronda.correcto.id;

  const verificar = useCallback(() => {
    if (!elegido || verificado) return;
    setVerificado(true);
    setTotal((t) => t + 1);
    if (elegido === ronda.correcto.id) setAciertos((a) => a + 1);
  }, [elegido, verificado, ronda]);

  const siguiente = useCallback(() => {
    setRonda(nuevaRonda(ronda.correcto.id));
    setElegido(null);
    setVerificado(false);
  }, [ronda]);

  // Solo los parámetros alterados: es lo que hace legible el reto sin
  // obligar a barrer las 28 filas del reporte completo.
  const alterados = PARAMETROS.filter((p) => estadoDe(valores[p.id], p, sexo) !== 'normal');

  return (
    <>
      <div className={s.quiz}>
        <p className={s.quizPregunta}>¿Qué condición sugiere este hemograma?</p>
        <p className={s.quizSub}>
          Se listan solo los parámetros fuera de rango. Fíjate en el patrón completo,
          no en un valor suelto.
          {total > 0 && <> &nbsp;·&nbsp; <span className={s.quizMarcador}>{aciertos} / {total} correctas</span></>}
        </p>

        <div className={s.quizOpciones}>
          {ronda.opciones.map((o: Escenario) => {
            const esCorrecta = o.id === ronda.correcto.id;
            const cls = !verificado
              ? (elegido === o.id ? s.quizSel : '')
              : esCorrecta ? s.quizOk
              : elegido === o.id ? s.quizMal : '';
            return (
              <button
                key={o.id}
                type="button"
                className={`${s.quizOpcion} ${cls}`}
                disabled={verificado}
                onClick={() => setElegido(o.id)}
              >
                {o.nombre}
              </button>
            );
          })}
        </div>

        {verificado && (
          <div className={`${s.quizFeedback} ${acerto ? s.quizFeedbackOk : s.quizFeedbackMal}`}>
            <strong>{acerto ? 'Correcto. ' : `No. Era ${ronda.correcto.nombre}. `}</strong>
            {ronda.correcto.vineta}
            <ul className={s.vinetaClaves} style={{ marginTop: 8 }}>
              {ronda.correcto.claves.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}

        {verificado ? (
          <button type="button" className={s.btn} onClick={siguiente}>Siguiente caso</button>
        ) : (
          <button type="button" className={s.btn} onClick={verificar} disabled={!elegido}>
            Verificar
          </button>
        )}
      </div>

      {/* Reporte del caso: solo lo alterado */}
      <div className={s.secciones}>
        {GRUPOS.map((g) => {
          const params = alterados.filter((p) => p.grupo === g.id);
          if (!params.length) return null;
          return (
            <section key={g.id} className={s.seccion}>
              <header className={s.seccionHead}>
                <h3 className={s.seccionTitulo}>{g.titulo}</h3>
                <span className={s.seccionDesc}>{params.length} parámetro(s) fuera de rango</span>
              </header>
              {params.map((p) => {
                const estado = estadoDe(valores[p.id], p, sexo);
                const cv = estado === 'bajo' ? s.vBajo : s.vAlto;
                const ce = estado === 'bajo' ? s.eBajo : s.eAlto;
                return (
                  <div key={p.id} className={s.cmpFila}>
                    <span className={s.filaNombre}>
                      <span className={s.filaNombreTexto}>{p.nombre}</span>
                      <span className={s.filaAbrev}>{p.abrev} · {p.unidad}</span>
                    </span>
                    <span className={s.cmpCelda}>
                      <span className={`${s.cmpValor} ${cv}`}>{formatear(valores[p.id], p)}</span>
                    </span>
                    <span className={s.cmpCelda}>
                      <span className={`${s.estado} ${ce}`}>
                        <span aria-hidden>{GLIFO[estado]}</span>{PALABRA[estado]}
                      </span>
                    </span>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </>
  );
}
