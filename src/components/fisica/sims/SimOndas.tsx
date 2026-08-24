'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, Btn, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

type Tipo = 'transversal' | 'longitudinal';

const N = 78; // partículas del medio

/**
 * Onda mecánica en un medio discretizado.
 *
 * Los controles son la VELOCIDAD (propiedad del medio) y la FRECUENCIA
 * (impuesta por la fuente), y λ sale calculada — no al revés. Es la
 * dependencia que hay que interiorizar: al cambiar de medio se conserva f,
 * cambia v y λ se acomoda. Un slider de λ directo enseñaría lo contrario.
 */
/**
 * Claves de `preset`: `velocidad`, `frecuencia`, `amplitud`, y `longitudinal`
 * (1 = longitudinal, 0 = transversal).
 */
export default function SimOndas({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [tipo, setTipo] = useState<Tipo>('transversal');
  const [velocidad, setVelocidad] = useState(3);   // m/s (medio)
  const [frecuencia, setFrecuencia] = useState(1); // Hz (fuente)
  const [amplitud, setAmplitud] = useState(0.5);   // 0–1 relativo
  const [rastro, setRastro] = useState(true);

  const lambda = velocidad / frecuencia;
  const periodo = 1 / frecuencia;
  // Las dos formas angulares de lo mismo: son las que entran dentro del seno
  // de y(x,t), y el panel las enseña junto a λ y T para que se vea el paso.
  const numeroOnda = (2 * Math.PI) / lambda;
  const pulsacion = 2 * Math.PI * frecuencia;

  const vivo = useRef<Record<string, number>>({});

  const est = useRef({ tipo, velocidad, frecuencia, amplitud, lambda, rastro });
  est.current = { tipo, velocidad, frecuencia, amplitud, lambda, rastro };

  // Rastro de la partícula marcada: prueba visual de que oscila sin avanzar.
  const estela = useRef<{ x: number; y: number }[]>([]);

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const { tipo: tp, frecuencia: f, amplitud: amp, lambda: lam, rastro: verRastro } = est.current;

    rejilla(c, 28);

    const margen = 26;
    const ancho = w - margen * 2;
    // Metros visibles en el lienzo: fijo, para que cambiar λ se vea como un
    // cambio real de separación entre crestas y no como un rescalado.
    const METROS = 8;
    const pxPorM = ancho / METROS;

    const cy = tp === 'transversal' ? h * 0.36 : h * 0.4;
    const ampPx = amp * (tp === 'transversal' ? 52 : 20);
    const k = (2 * Math.PI) / lam;
    const om = 2 * Math.PI * f;

    const idxMarcada = Math.round(N * 0.42);

    /* ─── Envolvente (sólo transversal): la forma de onda ─────────────── */
    if (tp === 'transversal') {
      ctx.save();
      ctx.strokeStyle = alfa(paleta.acento, 0.28);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 260; i++) {
        const xm = (METROS * i) / 260;
        const px = margen + xm * pxPorM;
        const py = cy - ampPx * Math.sin(k * xm - om * t);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Línea de equilibrio
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.14);
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(margen, cy);
      ctx.lineTo(w - margen, cy);
      ctx.stroke();
      ctx.restore();
    }

    /* ─── Partículas del medio ────────────────────────────────────────── */
    let marcada = { x: 0, y: 0 };
    for (let i = 0; i < N; i++) {
      const xm = (METROS * i) / (N - 1);       // posición de equilibrio, en m
      const fase = k * xm - om * t;
      const desp = ampPx * Math.sin(fase);

      const px = margen + xm * pxPorM + (tp === 'longitudinal' ? desp : 0);
      const py = cy - (tp === 'transversal' ? desp : 0);

      const esMarcada = i === idxMarcada;
      if (esMarcada) {
        marcada = { x: px, y: py };
        // El desplazamiento de la partícula marcada, en las mismas unidades
        // relativas que el mando: es el valor que despeja y(x,t) en el panel.
        vivo.current = { t, y: amp * Math.sin(fase) };
      }

      ctx.save();
      if (esMarcada) {
        ctx.fillStyle = paleta.acento;
        ctx.shadowColor = alfa(paleta.acento, 0.7);
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = alfa(paleta.ink, tp === 'longitudinal' ? 0.55 : 0.42);
      }
      ctx.beginPath();
      ctx.arc(px, py, esMarcada ? 6.5 : 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ─── Rastro de la partícula marcada ──────────────────────────────── */
    if (verRastro) {
      estela.current.push({ ...marcada });
      if (estela.current.length > 90) estela.current.shift();
      ctx.save();
      ctx.strokeStyle = alfa(paleta.acento, 0.4);
      ctx.lineWidth = 2;
      ctx.beginPath();
      estela.current.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();
    } else {
      estela.current.length = 0;
    }

    texto(c, 'partícula marcada', marcada.x, marcada.y - 22, {
      align: 'center', size: 10.5, peso: 700, color: paleta.acento,
    });

    /* ─── Dirección de vibración vs dirección de propagación ──────────── */
    const flecha = (x: number, y: number, dx: number, dy: number, color: string, label: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx, y + dy);
      ctx.stroke();
      const ang = Math.atan2(dy, dx);
      ctx.translate(x + dx, y + dy);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-7, -4);
      ctx.lineTo(-7, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      texto(c, label, x + dx * 1.15 + (dy !== 0 ? 12 : 0), y + dy * 1.15 + (dy !== 0 ? 0 : -12), {
        size: 10.5, peso: 700, color,
      });
    };

    // Propagación: siempre hacia la derecha
    flecha(w - 132, h - 30, 46, 0, alfa(paleta.ink, 0.5), 'propagación');
    // Vibración: perpendicular o paralela según el tipo
    if (tp === 'transversal') flecha(margen + 34, h - 44, 0, -30, paleta.acento, 'vibración');
    else flecha(margen + 34, h - 30, 40, 0, paleta.acento, 'vibración');

    /* ─── Banda de presión (sólo longitudinal) ────────────────────────── */
    if (tp === 'longitudinal') {
      const by = h * 0.68;
      const bh = 34;
      texto(c, 'PRESIÓN DEL MEDIO', margen, by - 14, { size: 10, peso: 800 });
      for (let i = 0; i < 150; i++) {
        const xm = (METROS * i) / 149;
        const px = margen + xm * pxPorM;
        const compresion = Math.cos(k * xm - om * t); // +1 comprimido, −1 enrarecido
        const inten = (compresion + 1) / 2;
        ctx.save();
        ctx.fillStyle = alfa(paleta.acento, 0.1 + inten * 0.62 * amp);
        ctx.fillRect(px, by, ancho / 149 + 1, bh);
        ctx.restore();
      }
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.14);
      ctx.lineWidth = 1;
      ctx.strokeRect(margen, by, ancho, bh);
      ctx.restore();
      texto(c, 'compresión', margen + 6, by + bh + 14, { size: 10, color: paleta.acento });
      texto(c, 'rarefacción', margen + ancho - 6, by + bh + 14, { size: 10, align: 'right' });
    }

    /* ─── Regla de λ ──────────────────────────────────────────────────── */
    const ry = tp === 'transversal' ? h - 78 : 24;
    const lamPx = lam * pxPorM;
    if (lamPx < ancho) {
      const x0 = margen + 8;
      ctx.save();
      ctx.strokeStyle = paleta.acento;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x0, ry);
      ctx.lineTo(x0 + lamPx, ry);
      ctx.moveTo(x0, ry - 5); ctx.lineTo(x0, ry + 5);
      ctx.moveTo(x0 + lamPx, ry - 5); ctx.lineTo(x0 + lamPx, ry + 5);
      ctx.stroke();
      ctx.restore();
      texto(c, `λ = ${lam.toFixed(2)} m`, x0 + lamPx / 2, ry - 14, {
        align: 'center', size: 11, peso: 700, color: paleta.acento,
      });
    }
  };

  // El rastro es memoria de la escena: reiniciar sin borrarlo dejaría el dibujo
  // de la onda anterior colgando sobre la nueva.
  const { canvasRef, reloj } = useSimCanvas(dibujar, {
    alto: 360,
    onReiniciar: () => { estela.current.length = 0; },
  });

  useEffect(() => {
    if (!preset) return;
    if (preset.velocidad  !== undefined) setVelocidad(preset.velocidad);
    if (preset.frecuencia !== undefined) setFrecuencia(preset.frecuencia);
    if (preset.amplitud   !== undefined) setAmplitud(preset.amplitud);
    if (preset.longitudinal !== undefined) setTipo(preset.longitudinal ? 'longitudinal' : 'transversal');
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Onda mecánica: cómo vibra el medio y qué es lo que viaja"
      acento={acento}
      onAcento={setAcento}
      sim="ondas"
      reloj={reloj}
      magnitudes={{
        v: velocidad, f: frecuencia, lambda, T: periodo,
        A: amplitud, k: numeroOnda, w: pulsacion,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-3 5 0" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Velocidad del medio  v" magnitud="v" valor={velocidad}
            display={`${velocidad.toFixed(1)} m/s`}
            min={0.5} max={8} paso={0.1} onChange={setVelocidad} />
          <LabSlider label="Frecuencia de la fuente  f" magnitud="f" valor={frecuencia}
            display={`${frecuencia.toFixed(2)} Hz`}
            min={0.2} max={4} paso={0.05} onChange={setFrecuencia} />
          <LabSlider label="Amplitud  A" magnitud="A" valor={amplitud}
            display={`${(amplitud * 100).toFixed(0)} %`}
            min={0.1} max={1} paso={0.05} onChange={setAmplitud} />

          <LabFila>
            <Segmented
              valor={tipo}
              onChange={(v) => { setTipo(v); estela.current.length = 0; }}
              opciones={[
                { id: 'transversal',  label: 'Transversal' },
                { id: 'longitudinal', label: 'Longitudinal' },
              ]}
            />
            <Btn activo={rastro} onClick={() => setRastro((v) => !v)}>
              Rastro de la partícula
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          λ no tiene perilla propia a propósito: no se elige. Sale de v/f, y esa es justo la
          relación que se pregunta en los problemas de ultrasonido cambiando de tejido.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
