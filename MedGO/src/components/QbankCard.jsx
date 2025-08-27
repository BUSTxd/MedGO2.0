export default function QbankCard({ topic, onOpen }){
  return (
    <article className="q-card click" onClick={onOpen}>
      <span className="q-badge">{topic.badge}</span>
      <h3 className="q-title">{topic.title}</h3>
      <p className="q-summary">{topic.summary}</p>
      <div className="q-diff">
        <span className="b ok">Interno (fácil)</span>
        <span className="b warn">Residente (media)</span>
        <span className="b bad">Especialista (difícil)</span>
      </div>
    </article>
  );
}
