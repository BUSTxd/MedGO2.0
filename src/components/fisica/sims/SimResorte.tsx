'use client';

import { useEffect, useRef, useState } from 'react';
import { useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx } from './SimShell';
import { LabShell, LabSlider } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * Masa-resorte en MAS. Se resuelve de forma ANALÍTICA (x = A·cos ωt), no
 * integrando: la solución cerrada existe, es exacta y no acumula deriva, y
 * además es la que el alumno tiene que reconocer en el examen. Integrar aquí
 * sólo añadiría error numérico a una curva que ya conocemos.
 */
/** Claves de `preset` que acepta esta sim: `masa`, `k`, `amplitud`. */
export default function SimResorte({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [masa, setMasa] = useState(1);      // kg
  const [k, setK] = useState(30);           // N/m
  const [amplitud, setAmplitud] = useState(0.28); // m

  const omega = Math.sqrt(k / masa);
  const periodo = (2 * Math.PI) / omega;
  const frecuencia = 1 / periodo;
  const vMax = amplitud * omega;
  const energia = 0.5 * k * amplitud * amplitud;

  // Los valores vivos entran al draw por ref: el bucle de rAF no se reinicia
  // cuando se mueve un slider (ver nota en useSimCanvas).
  const est = useRef({ omega, amplitud, energia, k, periodo });
  est.current = { omega, amplitud, energia, k, periodo };

  // Magnitudes instantáneas para el panel de fórmulas. Van por ref y no por
  // estado: son las mismas que el draw ya calcula en cada frame, y subirlas a
  // React serían 60 renders por segundo del módulo entero.
  const vivo = useRef<Record<string, number>>({});

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const { omega: om, amplitud: A, energia: E, k: kk } = est.current;

    const compacto = w < 620;
    const x = A * Math.cos(om * t);          // m
    const v = -A * om * Math.sin(om * t);    // m/s
    const U = 0.5 * kk * x * x;
    const K = Math.max(E - U, 0);

    vivo.current = { t, x, v, F: -kk * x, U, K };

    // ── Zonas del lienzo ──
    const escena = compacto
      ? { x: 0, y: 0, w, h: 190 }
      : { x: 0, y: 0, w: w * 0.52, h };
    const grafica = compacto
      ? { x: 16, y: 202, w: w - 32, h: 98 }
      : { x: w * 0.55, y: 18, w: w * 0.42, h: 182 };
    const barras = compacto
      ? { x: 16, y: 312, w: w - 32, h: 56 }
      : { x: w * 0.55, y: 228, w: w * 0.42, h: 132 };

    rejilla(c, 28);

    /* ─── Escena: pared + resorte + masa ─────────────────────────────── */
    const cy = escena.y + escena.h / 2;
    const paredX = escena.x + 34;
    const escala = Math.min((escena.w - 150) / 0.62, 190); // px por metro
    const eqX = paredX + 96;
    const masaX = eqX + x * escala;
    const lado = 44;

    // Pared (hachurada)
    ctx.save();
    ctx.strokeStyle = paleta.muted;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(paredX, cy - 62);
    ctx.lineTo(paredX, cy + 62);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = -60; i <= 56; i += 11) {
      ctx.moveTo(paredX, cy + i);
      ctx.lineTo(paredX - 11, cy + i + 11);
    }
    ctx.stroke();
    ctx.restore();

    // Suelo
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.18);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paredX, cy + 62);
    ctx.lineTo(escena.x + escena.w - 14, cy + 62);
    ctx.stroke();
    ctx.restore();

    // Marca del equilibrio
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.28);
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(eqX, cy - 58);
    ctx.lineTo(eqX, cy + 62);
    ctx.stroke();
    ctx.restore();
    texto(c, 'equilibrio', eqX, cy - 68, { align: 'center', size: 10 });

    // Resorte: zigzag entre la pared y la cara izquierda del bloque
    const x0 = paredX;
    const x1 = masaX - lado / 2;
    const vueltas = 13;
    const amp = 15;
    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, cy);
    const util = x1 - x0;
    const guia = util * 0.14;
    ctx.lineTo(x0 + guia, cy);
    for (let i = 0; i <= vueltas; i++) {
      const px = x0 + guia + ((util - 2 * guia) * i) / vueltas;
      ctx.lineTo(px, cy + (i % 2 === 0 ? -amp : amp));
    }
    ctx.lineTo(x1 - guia, cy);
    ctx.lineTo(x1, cy);
    ctx.stroke();
    ctx.restore();

    // Bloque
    ctx.save();
    ctx.fillStyle = paleta.acento;
    ctx.shadowColor = alfa(paleta.acento, 0.42);
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(masaX - lado / 2, cy - lado / 2, lado, lado, 9);
    ctx.fill();
    ctx.restore();
    texto(c, 'm', masaX, cy, { align: 'center', size: 16, peso: 800, color: '#fff' });

    // Vector velocidad sobre el bloque
    if (Math.abs(v) > 0.02) {
      const largo = (v / (A * om || 1)) * 46;
      const vy = cy - lado / 2 - 16;
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.55);
      ctx.fillStyle = alfa(paleta.ink, 0.55);
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(masaX, vy);
      ctx.lineTo(masaX + largo, vy);
      ctx.stroke();
      const dir = Math.sign(largo);
      ctx.beginPath();
      ctx.moveTo(masaX + largo, vy);
      ctx.lineTo(masaX + largo - 6 * dir, vy - 4);
      ctx.lineTo(masaX + largo - 6 * dir, vy + 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      texto(c, 'v', masaX + largo + 9 * (Math.sign(largo) || 1), vy, {
        align: largo > 0 ? 'left' : 'right', size: 11, color: alfa(paleta.ink, 0.6),
      });
    }

    /* ─── Gráfica x(t): ventana FIJA de 4 s ──────────────────────────── */
    // Fija a propósito: si la ventana siguiera al periodo, cambiar la masa no
    // se vería: siempre saldrían los mismos 3 ciclos en pantalla.
    const VENTANA = 4;
    const g = grafica;
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.03);
    ctx.beginPath();
    ctx.roundRect(g.x, g.y, g.w, g.h, 10);
    ctx.fill();
    ctx.restore();

    const gcy = g.y + g.h / 2;
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.18);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g.x + 8, gcy);
    ctx.lineTo(g.x + g.w - 8, gcy);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const pasos = 160;
    for (let i = 0; i <= pasos; i++) {
      const tau = t - VENTANA + (VENTANA * i) / pasos;
      const px = g.x + 8 + ((g.w - 16) * i) / pasos;
      const py = gcy - (A * Math.cos(om * Math.max(tau, 0)) / 0.5) * (g.h / 2 - 12);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Punto «ahora» al borde derecho
    const nx = g.x + g.w - 8;
    const ny = gcy - (x / 0.5) * (g.h / 2 - 12);
    ctx.save();
    ctx.fillStyle = paleta.acento;
    ctx.shadowColor = alfa(paleta.acento, 0.6);
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(nx, ny, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    texto(c, 'x (t)', g.x + 10, g.y + 12, { size: 10.5, peso: 700, color: paleta.acento });
    texto(c, '← 4 s', g.x + g.w - 10, g.y + 12, { size: 10, align: 'right' });

    /* ─── Barras de energía ──────────────────────────────────────────── */
    const b = barras;
    texto(c, 'ENERGÍA', b.x, b.y - 8, { size: 10, peso: 800 });

    const filas = [
      { label: 'Cinética  K', val: K, color: paleta.acento },
      { label: 'Potencial U', val: U, color: alfa(paleta.ink, 0.42) },
      { label: 'Total  E',    val: E, color: alfa(paleta.acento, 0.3) },
    ];
    const altoFila = Math.min(20, (b.h - 12) / 3);
    filas.forEach((f, i) => {
      const y = b.y + 6 + i * (altoFila + 10);
      const bx = b.x + 82;
      const bw = b.w - 92;
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.07);
      ctx.beginPath();
      ctx.roundRect(bx, y, bw, altoFila, altoFila / 2);
      ctx.fill();
      const frac = E > 0 ? Math.min(f.val / E, 1) : 0;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.roundRect(bx, y, Math.max(bw * frac, altoFila), altoFila, altoFila / 2);
      ctx.fill();
      ctx.restore();
      texto(c, f.label, b.x, y + altoFila / 2, { size: 10.5, peso: 600 });
      texto(c, `${f.val.toFixed(2)} J`, bx + bw - 8, y + altoFila / 2, {
        size: 10.5, peso: 700, align: 'right',
        color: i === 2 ? paleta.muted : '#fff',
      });
    });
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380 });

  // El problema guiado coloca aquí sus datos. `preset` llega con una referencia
  // nueva en cada pulsación, así que volver a pulsar reconfigura la escena. Va
  // DESPUÉS del hook porque necesita `reloj` para reanudar la escena si estaba
  // en pausa: si no, los datos entrarían sobre un dibujo congelado.
  useEffect(() => {
    if (!preset) return;
    if (preset.masa     !== undefined) setMasa(preset.masa);
    if (preset.k        !== undefined) setK(preset.k);
    if (preset.amplitud !== undefined) setAmplitud(preset.amplitud);
    reloj.reanudar();
    // `reloj` cambia de identidad en cada play/pausa; incluirlo aquí volvería a
    // aplicar el preset al pausar la escena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Masa-resorte en movimiento armónico simple"
      acento={acento}
      onAcento={setAcento}
      sim="resorte"
      reloj={reloj}
      magnitudes={{ m: masa, k, A: amplitud, T: periodo, f: frecuencia, w: omega, E: energia, vmax: vMax }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h3l2-5 3 10 3-10 2 5h5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Masa  m" magnitud="m" valor={masa} display={`${masa.toFixed(1)} kg`}
            min={0.2} max={5} paso={0.1} onChange={setMasa} />
          <LabSlider label="Constante  k" magnitud="k" valor={k} display={`${k.toFixed(0)} N/m`}
            min={5} max={120} paso={1} onChange={setK} />
          <LabSlider label="Amplitud  A" magnitud="A" valor={amplitud} display={`${(amplitud * 100).toFixed(0)} cm`}
            min={0.05} max={0.5} paso={0.01} onChange={setAmplitud} />
        </>
      }
      nota={
        <>
          Mueve <strong>sólo la amplitud</strong> y vigila el periodo: no se inmuta. Ahora mueve la
          masa y míralo cambiar. Eso es exactamente lo que dice T = 2π√(m/k).
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
