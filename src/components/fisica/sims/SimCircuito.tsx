'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, Btn, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C11 · Circuito de dos resistencias, conmutable entre serie y paralelo.
 *
 * El mismo par de resistencias con la misma fuente da corrientes distintas
 * según cómo se monten, y ésa es toda la clase. La escena lo hace visible con
 * los portadores: su DENSIDAD por rama es proporcional a la corriente de esa
 * rama, así que en paralelo se ve cómo el nudo reparte y en serie se ve que por
 * todo el lazo pasa exactamente lo mismo — que es la duda que casi todos
 * arrastran («¿se gasta la corriente al pasar por la primera resistencia?»).
 *
 * La escala de peligro fisiológico está en miliamperios porque es la unidad en
 * la que se enuncian los umbrales, y es el punto del sílabo sobre efectos de la
 * corriente: lo que mata no son los voltios.
 */

/** Claves de `preset`: `voltaje`, `r1`, `r2`, `paralelo`. */

type Montaje = 'serie' | 'paralelo';

/** Umbrales de corriente por el cuerpo, en mA. Los que se citan en clase. */
const UMBRALES = [
  { mA: 1,   label: 'percepción' },
  { mA: 10,  label: 'no soltar' },
  { mA: 30,  label: 'parálisis respiratoria' },
  { mA: 100, label: 'fibrilación ventricular' },
];

export default function SimCircuito({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [montaje, setMontaje] = useState<Montaje>('serie');
  const [voltaje, setVoltaje] = useState(12);
  const [R1, setR1] = useState(100);
  const [R2, setR2] = useState(200);

  const Rs = R1 + R2;
  const Rp = (R1 * R2) / (R1 + R2);
  const Req = montaje === 'serie' ? Rs : Rp;
  const I = voltaje / Req;
  const I1 = montaje === 'serie' ? I : voltaje / R1;
  const I2 = montaje === 'serie' ? I : voltaje / R2;
  const V1 = I1 * R1;
  const V2 = I2 * R2;
  const P = voltaje * I;

  const est = useRef({ montaje, I, I1, I2, voltaje });
  est.current = { montaje, I, I1, I2, voltaje };

  const vivo = useRef<Record<string, number>>({});

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    rejilla(c, 28);

    const compacto = w < 620;
    const marco = compacto
      ? { x: 40, y: 34, w: w - 80, h: 150 }
      : { x: 44, y: 40, w: Math.min(w - 88, 470), h: h - 150 };

    const cable = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.45);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    /** Resistencia con su zigzag, rotulada con su valor y su caída. */
    const resistencia = (
      cx: number, cy: number, ancho: number, etiqueta: string, valor: string, caida: string,
    ) => {
      ctx.save();
      ctx.strokeStyle = paleta.acento;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - ancho / 2, cy);
      const dientes = 6;
      for (let i = 0; i < dientes; i++) {
        ctx.lineTo(cx - ancho / 2 + (ancho * (i + 0.5)) / dientes, cy + (i % 2 === 0 ? -11 : 11));
      }
      ctx.lineTo(cx + ancho / 2, cy);
      ctx.stroke();
      ctx.restore();
      texto(c, etiqueta, cx, cy - 26, { align: 'center', size: 11.5, peso: 800, color: paleta.acento });
      texto(c, valor, cx, cy + 26, { align: 'center', size: 10.5, peso: 700 });
      texto(c, caida, cx, cy + 40, { align: 'center', size: 10, color: paleta.muted });
    };

    /* ─── Fuente, a la izquierda ──────────────────────────────────────── */
    const fx = marco.x;
    const fyTop = marco.y;
    const fyBot = marco.y + marco.h;
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.6);
    ctx.lineWidth = 3;
    [[-9, 14], [-5, 8], [-9, 14], [-5, 8]].forEach(([off, medio], i) => {
      const y = marco.y + marco.h / 2 - 21 + i * 14;
      ctx.beginPath();
      ctx.moveTo(fx + off, y);
      ctx.lineTo(fx + off + Math.abs(off) * 2 - (Math.abs(off) - medio), y);
      ctx.stroke();
    });
    ctx.restore();
    texto(c, `${s.voltaje.toFixed(1)} V`, fx - 16, marco.y + marco.h / 2, {
      align: 'right', size: 12.5, peso: 800, color: paleta.acento,
    });

    /* ─── Trazado según montaje ───────────────────────────────────────── */
    // Cada tramo lleva su corriente para poder sembrar portadores con la
    // densidad correcta: es el dato que la escena tiene que transmitir.
    const tramos: { x1: number; y1: number; x2: number; y2: number; I: number }[] = [];
    const anchoR = Math.min(marco.w * 0.26, 96);

    if (s.montaje === 'serie') {
      const yTop = fyTop;
      const r1x = marco.x + marco.w * 0.34;
      const r2x = marco.x + marco.w * 0.72;
      cable(fx, marco.y + marco.h / 2 - 26, fx, yTop);
      cable(fx, yTop, r1x - anchoR / 2, yTop);
      cable(r1x + anchoR / 2, yTop, r2x - anchoR / 2, yTop);
      cable(r2x + anchoR / 2, yTop, marco.x + marco.w, yTop);
      cable(marco.x + marco.w, yTop, marco.x + marco.w, fyBot);
      cable(marco.x + marco.w, fyBot, fx, fyBot);
      cable(fx, fyBot, fx, marco.y + marco.h / 2 + 26);
      resistencia(r1x, yTop, anchoR, 'R₁', `${R1} Ω`, `${V1.toFixed(2)} V`);
      resistencia(r2x, yTop, anchoR, 'R₂', `${R2} Ω`, `${V2.toFixed(2)} V`);
      tramos.push(
        { x1: fx, y1: yTop, x2: r1x - anchoR / 2, y2: yTop, I: s.I },
        { x1: r1x + anchoR / 2, y1: yTop, x2: r2x - anchoR / 2, y2: yTop, I: s.I },
        { x1: r2x + anchoR / 2, y1: yTop, x2: marco.x + marco.w, y2: yTop, I: s.I },
        { x1: marco.x + marco.w, y1: fyBot, x2: fx, y2: fyBot, I: s.I },
      );
    } else {
      const ramaY1 = marco.y + marco.h * 0.24;
      const ramaY2 = marco.y + marco.h * 0.76;
      const nudoX = marco.x + marco.w * 0.3;
      const nudoFin = marco.x + marco.w * 0.88;
      const rx = (nudoX + nudoFin) / 2;

      cable(fx, marco.y + marco.h / 2 - 26, fx, fyTop);
      cable(fx, fyTop, nudoX, fyTop);
      cable(nudoX, fyTop, nudoX, ramaY2);
      cable(nudoX, ramaY1, rx - anchoR / 2, ramaY1);
      cable(rx + anchoR / 2, ramaY1, nudoFin, ramaY1);
      cable(nudoX, ramaY2, rx - anchoR / 2, ramaY2);
      cable(rx + anchoR / 2, ramaY2, nudoFin, ramaY2);
      cable(nudoFin, ramaY1, nudoFin, ramaY2);
      cable(nudoFin, ramaY1, nudoFin, fyBot);
      cable(nudoFin, fyBot, fx, fyBot);
      cable(fx, fyBot, fx, marco.y + marco.h / 2 + 26);

      resistencia(rx, ramaY1, anchoR, 'R₁', `${R1} Ω`, `${I1.toFixed(3)} A`);
      resistencia(rx, ramaY2, anchoR, 'R₂', `${R2} Ω`, `${I2.toFixed(3)} A`);

      // Nudos: sin el punto marcado no se lee que ahí la corriente se parte.
      [ramaY1, ramaY2].forEach((y) => {
        [nudoX, nudoFin].forEach((x) => {
          ctx.save();
          ctx.fillStyle = alfa(paleta.ink, 0.6);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      });

      tramos.push(
        { x1: fx, y1: fyTop, x2: nudoX, y2: fyTop, I: s.I },
        { x1: nudoX, y1: ramaY1, x2: rx - anchoR / 2, y2: ramaY1, I: s.I1 },
        { x1: rx + anchoR / 2, y1: ramaY1, x2: nudoFin, y2: ramaY1, I: s.I1 },
        { x1: nudoX, y1: ramaY2, x2: rx - anchoR / 2, y2: ramaY2, I: s.I2 },
        { x1: rx + anchoR / 2, y1: ramaY2, x2: nudoFin, y2: ramaY2, I: s.I2 },
        { x1: nudoFin, y1: fyBot, x2: fx, y2: fyBot, I: s.I },
      );
    }

    /* ─── Portadores ──────────────────────────────────────────────────── */
    tramos.forEach((tramo, idx) => {
      const largo = Math.hypot(tramo.x2 - tramo.x1, tramo.y2 - tramo.y1);
      // Densidad ∝ corriente: es lo que hace comparables las dos ramas del
      // paralelo de un vistazo, sin leer un número.
      const cuantos = Math.max(Math.round(Math.min(tramo.I * 90, 1) * (largo / 22)), 1);
      const paso = largo / cuantos;
      const ux = (tramo.x2 - tramo.x1) / (largo || 1);
      const uy = (tramo.y2 - tramo.y1) / (largo || 1);
      const desfase = ((t * Math.min(tramo.I * 260, 160) + idx * 7) % paso + paso) % paso;
      for (let i = 0; i < cuantos; i++) {
        const dist = i * paso + desfase;
        if (dist > largo) continue;
        ctx.save();
        ctx.fillStyle = paleta.acento;
        ctx.beginPath();
        ctx.arc(tramo.x1 + ux * dist, tramo.y1 + uy * dist, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    /* ─── Escala fisiológica ──────────────────────────────────────────── */
    const esc = { x: 40, y: h - 56, w: w - 80 };
    const mA = I * 1000;
    texto(c, 'Si esta corriente pasara por el tórax', esc.x, esc.y - 12, { size: 10, peso: 700 });

    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.07);
    ctx.beginPath();
    ctx.roundRect(esc.x, esc.y, esc.w, 12, 6);
    ctx.fill();
    // Escala logarítmica de 0,1 a 1000 mA: los umbrales están repartidos en
    // cuatro órdenes de magnitud y en lineal se apilarían todos a la izquierda.
    const aX = (v: number) => esc.x + (Math.min(Math.max(Math.log10(v / 0.1) / 4, 0), 1)) * esc.w;
    ctx.fillStyle = mA >= 100 ? '#E85B4A' : mA >= 10 ? '#F5A623' : paleta.acento;
    ctx.beginPath();
    ctx.roundRect(esc.x, esc.y, Math.max(aX(Math.max(mA, 0.1)) - esc.x, 12), 12, 6);
    ctx.fill();
    ctx.restore();

    UMBRALES.forEach((u) => {
      const x = aX(u.mA);
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.35);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, esc.y - 3);
      ctx.lineTo(x, esc.y + 15);
      ctx.stroke();
      ctx.restore();
      texto(c, u.label, x, esc.y + 26, { align: 'center', size: 9 });
    });

    texto(c, `${mA.toFixed(1)} mA`, esc.x + esc.w, esc.y - 12, {
      align: 'right', size: 11.5, peso: 800,
      color: mA >= 100 ? '#E85B4A' : paleta.acento,
    });

    texto(c, s.montaje === 'serie'
      ? 'En serie: la misma corriente por todo el lazo, las caídas suman la fuente'
      : 'En paralelo: cada rama ve la fuente entera, las corrientes suman la total',
      w / 2, marco.y + marco.h + 30, { align: 'center', size: 11, peso: 700 });

    vivo.current = { t };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 400 });

  useEffect(() => {
    if (!preset) return;
    if (preset.voltaje  !== undefined) setVoltaje(preset.voltaje);
    if (preset.r1       !== undefined) setR1(preset.r1);
    if (preset.r2       !== undefined) setR2(preset.r2);
    if (preset.paralelo !== undefined) setMontaje(preset.paralelo ? 'paralelo' : 'serie');
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Ley de Ohm: la misma pareja de resistencias, dos montajes"
      acento={acento}
      onAcento={setAcento}
      sim="circuito"
      reloj={reloj}
      magnitudes={{
        V: voltaje, R1, R2, Req, Rs, Rp, I, I1, I2, V1, V2, P, ImA: I * 1000,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 12h3l2-4 3 8 3-8 2 4h5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Fuente  V" magnitud="V" valor={voltaje} display={`${voltaje.toFixed(1)} V`}
            min={1} max={240} paso={1} onChange={setVoltaje} />
          <LabSlider label="Resistencia  R₁" magnitud="R1" valor={R1} display={`${R1} Ω`}
            min={10} max={2000} paso={10} onChange={setR1} />
          <LabSlider label="Resistencia  R₂" magnitud="R2" valor={R2} display={`${R2} Ω`}
            min={10} max={2000} paso={10} onChange={setR2} />

          <LabFila label="Montaje">
            <Segmented
              valor={montaje}
              onChange={setMontaje}
              opciones={[
                { id: 'serie',    label: 'Serie' },
                { id: 'paralelo', label: 'Paralelo' },
              ]}
            />
            <Btn
              activo={R1 === 1000 && voltaje === 220}
              onClick={() => { setVoltaje(220); setR1(1000); setR2(1000); setMontaje('serie'); }}
            >
              Piel mojada · 220 V
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Cambia de <strong>serie a paralelo</strong> sin tocar nada más: mira cómo se llena de
          portadores el circuito. En paralelo el equivalente es menor que la menor de las dos
          resistencias, así que la fuente entrega más corriente, no menos.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
