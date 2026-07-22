'use client';

import { useState } from 'react';
import styles from '@/styles/faq.module.css';

const faqs = [
  {
    q: '¿Para qué universidad y años está disponible MedGO?',
    a: 'Por ahora MedGO está enfocado 100% en la Universidad Peruana Cayetano Heredia (UPCH), cubriendo los primeros 3 años de la carrera de Medicina. Estamos trabajando para sumar más universidades y años más adelante.',
  },
  {
    q: '¿Tienen todos los cursos?',
    a: 'Sí. Contamos con todos los cursos de los primeros 3 años de Medicina de la UPCH, con su sílabo oficial: subtemas, fechas, docentes y prácticas de cada clase.',
  },
  {
    q: '¿El contenido sigue exactamente el sílabo de Cayetano?',
    a: 'Sí. Cada tema está mapeado con el sílabo oficial de la UPCH para los primeros 3 años de Medicina, así sabes exactamente qué viene cada semana y qué entra en cada evaluación.',
  },
  {
    q: '¿Los cursos incluyen imágenes histológicas y casos clínicos?',
    a: 'Sí. Encontrarás atlas con imágenes microscópicas reales, laboratorios virtuales interactivos y modelos 3D para estudiar cada estructura. El contenido disponible varía según el plan elegido.',
  },
  {
    q: '¿Puedo compartir mi cuenta con un compañero?',
    a: 'Cada cuenta es personal: el progreso, los exámenes y tu ruta de estudio son individuales. Además, cada cuenta tiene un límite de dispositivos por seguridad.',
  },
  {
    q: '¿Cómo cancelo mi suscripción?',
    a: 'El plan Interno (mensual) tiene un compromiso mínimo de 3 meses: el botón de cancelar se habilita una vez cumplidos. El plan Residente (anual) es cancelable cuando quieras desde Mi cuenta — mantienes el acceso hasta el final del periodo pagado. En ningún caso hay devolución del periodo en curso.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="contacto">
      <div className="section-inner reveal">
        <span className="section-tag">FAQ</span>
        <h2 className="section-title">Preguntas frecuentes.</h2>
        <p className="section-sub">Todo lo que necesitas saber antes de empezar.</p>
        <div className={styles.list}>
          {faqs.map((f, i) => (
            <div className={`${styles.item} ${open === i ? styles.open : ''}`} key={i}>
              <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <span className={styles.chevron}>▾</span>
              </button>
              <div className={styles.answer}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
