'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C9 · Dos cargas: fuerza, líneas de campo y el 1/r² a la vista.
 *
 * Las líneas de campo se trazan INTEGRANDO el campo real de las dos cargas
 * (paso a paso siguiendo E), no dibujando arcos decorativos: es la única forma
 * de que la figura cambie de verdad al pasar de atracción a repulsión y de que
 * la densidad de líneas signifique algo. Salen repartidas alrededor de cada
 * carga positiva y se cortan al llegar a una negativa o al salirse del lienzo.
 *
 * La malla de fondo pinta la magnitud |E| por celda, que es lo que hace ver el
 * 1/r²: al doblar la distancia el color no baja a la mitad, se desploma.
 */

/** Claves de `preset`: `q1`, `q2`, `r` (en metros). */

const K = 8.99e9;
/** Masa de un protón: la referencia con la que la aceleración significa algo. */
const M_PROTON = 1.673e-27;

export default function SimCoulomb({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [q1nC, setQ1nC] = useState(4);    // nC
  const [q2nC, setQ2nC] = useState(-3);   // nC
  const [rCm, setRCm] = useState(8);      // cm
  const [verLineas, setVerLineas] = useState(true);
  const [verMalla, setVerMalla] = useState(true);

  const q1 = q1nC * 1e-9;
  const q2 = q2nC * 1e-9;
  const r = rCm / 100;
  const F = (K * Math.abs(q1 * q2)) / (r * r);
  const E1 = (K * Math.abs(q1)) / (r * r);
  const V1 = (K * q1) / r;
  const U = (K * q1 * q2) / r;
  const atrae = q1 * q2 < 0;
  const acel = F / M_PROTON;

  const est = useRef({ q1, q2, r, atrae });
  est.current = { q1, q2, r, atrae };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, paleta } = c;
    const s = est.current;

    rejilla(c, 28);

    const cy = h / 2;
    // Escala fija a la distancia máxima del mando (25 cm): así separar las
    // cargas se ve como separarlas, en vez de reencuadrar el dibujo.
    const pxPorM = Math.min((w - 150) / 0.25, 2100);
    const sep = s.r * pxPorM;
    const a = { x: w / 2 - sep / 2, y: cy };
    const b = { x: w / 2 + sep / 2, y: cy };

    /** Campo total en un punto, en N/C. */
    const campo = (x: number, y: number) => {
      let ex = 0;
      let ey = 0;
      [{ p: a, q: s.q1 }, { p: b, q: s.q2 }].forEach(({ p, q }) => {
        const dx = (x - p.x) / pxPorM;
        const dy = (y - p.y) / pxPorM;
        const d2 = dx * dx + dy * dy;
        // Recorte cerca del centro: el campo diverge y sin él la integración
        // daría saltos de miles de píxeles en un solo paso.
        if (d2 < 1e-6) return;
        const mag = (K * q) / (d2 * Math.sqrt(d2));
        ex += mag * dx;
        ey += mag * dy;
      });
      return { ex, ey };
    };

    /* ─── Malla de intensidad ─────────────────────────────────────────── */
    if (verMalla) {
      const paso = 22;
      for (let x = paso / 2; x < w; x += paso) {
        for (let y = paso / 2; y < h; y += paso) {
          const { ex, ey } = campo(x, y);
          const mag = Math.hypot(ex, ey);
          // Escala logarítmica: el campo recorre varios órdenes en el lienzo y
          // en lineal sólo se vería un halo diminuto pegado a cada carga.
          const nivel = Math.min(Math.max(Math.log10(mag + 1) / 6, 0), 1);
          if (nivel < 0.04) continue;
          ctx.save();
          ctx.fillStyle = alfa(paleta.acento, nivel * 0.3);
          ctx.beginPath();
          ctx.arc(x, y, 2 + nivel * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    /* ─── Líneas de campo ─────────────────────────────────────────────── */
    if (verLineas) {
      const desde: { p: { x: number; y: number }; q: number }[] = [
        { p: a, q: s.q1 },
        { p: b, q: s.q2 },
      ];
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.32);
      ctx.lineWidth = 1.4;
      desde.forEach(({ p, q }) => {
        if (q === 0) return;
        const nLineas = 14;
        const signo = Math.sign(q);
        for (let i = 0; i < nLineas; i++) {
          const ang = (i / nLineas) * Math.PI * 2 + 0.2;
          let x = p.x + Math.cos(ang) * 15;
          let y = p.y + Math.sin(ang) * 15;
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (let paso = 0; paso < 260; paso++) {
            const { ex, ey } = campo(x, y);
            const mag = Math.hypot(ex, ey);
            if (mag === 0) break;
            // Paso de longitud constante: seguir el campo con paso proporcional
            // a |E| haría tramos larguísimos lejos de las cargas.
            x += (ex / mag) * 3 * signo;
            y += (ey / mag) * 3 * signo;
            if (x < 0 || x > w || y < 0 || y > h) break;
            if (Math.hypot(x - a.x, y - a.y) < 13 || Math.hypot(x - b.x, y - b.y) < 13) break;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    /* ─── Las cargas ──────────────────────────────────────────────────── */
    const dibujarCarga = (p: { x: number; y: number }, q: number, nombre: string) => {
      const radio = 13 + Math.min(Math.abs(q) * 1e9, 10) * 1.1;
      const color = q >= 0 ? '#E85B4A' : '#5E9CD3';
      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = alfa(color, 0.55);
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      texto(c, q >= 0 ? '+' : '−', p.x, p.y - 1, {
        align: 'center', size: 20, peso: 800, color: '#fff',
      });
      texto(c, `${nombre} = ${(q * 1e9).toFixed(1)} nC`, p.x, p.y + radio + 16, {
        align: 'center', size: 10.5, peso: 700, color,
      });
    };

    /* ─── Fuerzas: iguales y opuestas (tercera ley) ───────────────────── */
    const escala = Math.min(70 / Math.max(F, 1e-9), 1e9);
    const largo = Math.min(F * escala, 80);
    const dir = s.atrae ? 1 : -1;
    vector(c, a.x, a.y - 44, largo * dir, 0, '#F5A623', 'F');
    vector(c, b.x, b.y - 44, -largo * dir, 0, '#F5A623', 'F');

    dibujarCarga(a, s.q1, 'q₁');
    dibujarCarga(b, s.q2, 'q₂');

    // Regla de la separación
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.3);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, cy + 52);
    ctx.lineTo(b.x, cy + 52);
    ctx.stroke();
    ctx.restore();
    texto(c, `r = ${rCm.toFixed(1)} cm`, w / 2, cy + 66, {
      align: 'center', size: 11, peso: 700,
    });

    texto(c, s.atrae ? 'se atraen' : 'se repelen', w / 2, 22, {
      align: 'center', size: 12, peso: 800, color: paleta.acento,
    });
    texto(c, `F = ${F.toExponential(2)} N sobre cada una · misma magnitud, sentidos opuestos`,
      w / 2, h - 16, { align: 'center', size: 10.5 });
  };

  // Escena estática: el campo de dos cargas quietas no evoluciona. Animar las
  // cargas convertiría esto en un problema de dos cuerpos, que no es la clase.
  const { canvasRef } = useSimCanvas(dibujar, { alto: 400 });

  useEffect(() => {
    if (!preset) return;
    if (preset.q1 !== undefined) setQ1nC(preset.q1 * 1e9);
    if (preset.q2 !== undefined) setQ2nC(preset.q2 * 1e9);
    if (preset.r  !== undefined) setRCm(preset.r * 100);
  }, [preset]);

  return (
    <LabShell
      titulo="Ley de Coulomb: la fuerza y el campo que la explica"
      acento={acento}
      onAcento={setAcento}
      sim="coulomb"
      magnitudes={{ q1, q2, r, F, E1, U, V1, a1: acel, mp: M_PROTON }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M5 12h4M15 12h4M17 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Carga  q₁" magnitud="q1" valor={q1nC} display={`${q1nC.toFixed(1)} nC`}
            min={-10} max={10} paso={0.5} onChange={setQ1nC} />
          <LabSlider label="Carga  q₂" magnitud="q2" valor={q2nC} display={`${q2nC.toFixed(1)} nC`}
            min={-10} max={10} paso={0.5} onChange={setQ2nC} />
          <LabSlider label="Separación  r" magnitud="r" valor={rCm} display={`${rCm.toFixed(1)} cm`}
            min={2} max={25} paso={0.5} onChange={setRCm} />

          <LabFila>
            <Btn activo={verLineas} onClick={() => setVerLineas((v) => !v)}>
              Líneas de campo
            </Btn>
            <Btn activo={verMalla} onClick={() => setVerMalla((v) => !v)}>
              Intensidad del campo
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Dobla la separación y mira la fuerza: cae a <strong>la cuarta parte</strong>, no a la
          mitad. Ahora selecciona el potencial en el panel y repite: ése sí cae a la mitad, porque
          va con 1/r. Confundir las dos curvas es el error más caro de este tema.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
