import { useEffect, useState } from "react";
import { TOPICS } from "../data/topics.js";
import QbankCard from "./QbankCard.jsx";
import ExamTemplate from "./ExamTemplate.jsx";

export default function MainIsland(){
  const [view, setView] = useState("home");
  const [activeTopic, setActiveTopic] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(()=>{
    const nav = document.getElementById("app-nav");
    const handler = (e)=>{
      const a = e.target.closest("a[data-view]");
      if(!a) return;
      e.preventDefault();
      const v = a.getAttribute("data-view");
      setActiveTopic(null);
      setQuestions(null);
      setView(v);
      nav.querySelectorAll("a[data-view]").forEach(el => el.dataset.active = "false");
      a.dataset.active = "true";
    };
    nav?.addEventListener("click", handler);
    return ()=> nav?.removeEventListener("click", handler);
  },[]);

  const openTopic = async (topic) => {
    setActiveTopic(topic);
    setView("exam");
    const mod = await import(`../data/questions/${topic.json}`);
    setQuestions(mod.default);
  };

  const Home = () => (
    <section className="panel">
      <h2 className="h-title">Dashboard</h2>
      <p className="h-sub">¡Da lo mejor de ti, nosotros sabemos tu potencial! 💪</p>

      <div className="exam-list">
        <article className="exam-item">
          <strong>Hematología · SGP 1</strong>
          <div className="exam-meta">
            <span>Inicio: 08/11/2025 08:00</span>
            <span>Preguntas: 40</span>
            <span>Aprobado: 60%</span>
            <span>Resultado: 90%</span>
          </div>
          <div className="bar"><span style={{width:"90%"}}></span></div>
        </article>
        <article className="exam-item">
          <strong>Paso corto 22/08</strong>
          <div className="exam-meta">
            <span>Duración: 20 min</span>
            <span>10/10 preguntas</span>
            <span>Resultado: 90%</span>
          </div>
          <div className="bar"><span style={{width:"90%"}}></span></div>
        </article>
      </div>
    </section>
  );

  const Qbank = () => (
    <section className="panel">
      <h2 className="h-title">Qbank</h2>
      <p className="h-sub">Elige una materia o práctica y comienza.</p>
      <div className="qgrid">
        {TOPICS.map(t => (
          <QbankCard key={t.id} topic={t} onOpen={()=>openTopic(t)} />
        ))}
      </div>
    </section>
  );

  const Novedades = () => (
    <section className="panel">
      <h2 className="h-title">Novedades</h2>
      <p className="h-sub">Actualizaciones y anuncios aparecerán aquí.</p>
    </section>
  );
  const Laboratorio = () => (
    <section className="panel">
      <h2 className="h-title">Laboratorio virtual</h2>
      <p className="h-sub">Próximamente: simuladores y prácticas interactivas.</p>
    </section>
  );
  const Contacto = () => (
    <section className="panel">
      <h2 className="h-title">Contáctanos</h2>
      <p className="h-sub">Escríbenos a contacto@medgo.pe o deja tu consulta.</p>
    </section>
  );

  if(view === "exam" && activeTopic && questions){
    return <ExamTemplate topic={activeTopic} data={questions} onExit={()=> setView("qbank")} />;
  }

  switch(view){
    case "home": return <Home/>;
    case "qbank": return <Qbank/>;
    case "novedades": return <Novedades/>;
    case "laboratorio": return <Laboratorio/>;
    case "contacto": return <Contacto/>;
    default: return <Home/>;
  }
}
