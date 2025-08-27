import { useState } from "react";

export default function ExamTemplate({ topic, data, onExit }) {
  const items = data?.items ?? [];
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(null);

  const current = items[i];

  // Guard: si no hay preguntas, evita crashear
  if (!current) {
    return (
      <section className="exam-wrap panel">
        <h2 className="h-title">{data?.title || topic?.title || "Examen"}</h2>
        <p className="h-sub">No hay preguntas disponibles.</p>
        <button className="next" onClick={() => onExit?.()}>Volver a Qbank</button>
      </section>
    );
  }

  const choose = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setCorrect(idx === current.answer);
  };

  const next = () => {
    if (i < items.length - 1) {
      setI(i + 1);
      setChosen(null);
      setCorrect(null);
    } else {
      onExit?.();
    }
  };

  return (
    <section className="exam-wrap panel">
      <h2 className="h-title">{data.title}</h2>
      <p className="h-sub">Pregunta {i + 1} de {items.length} · Categoría: {data.category}</p>

      <div className="qbox">
        <strong>{current.q}</strong>
        <div className="choices">
          {current.choices.map((c, idx) => {
            const classes = ["choice"];
            if (chosen !== null) {
              if (idx === current.answer) classes.push("correct");
              if (idx === chosen && idx !== current.answer) classes.push("wrong");
            }
            return (
              <button key={idx} className={classes.join(" ")} onClick={() => choose(idx)}>
                {String.fromCharCode(65 + idx)}. {c}
              </button>
            );
          })}
        </div>

        {chosen !== null && (
          <>
            <p className="expl">
              <strong>{correct ? "Correcto." : "Incorrecto."}</strong><br />
              <span>Explicación: {current.explain}</span>
            </p>
            <button className="next" onClick={next}>
              {i < items.length - 1 ? "Siguiente pregunta" : "Volver a Qbank"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
