'use client';

import { useEffect, useRef, useState } from 'react';
import { Btn, useAcento, useSimCanvas, texto, alfa, type CanvasCtx } from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * Posición tonotópica en la membrana basilar según la función de Greenwood
 * (la real, la que se usa para programar implantes cocleares):
 *   f = A·(10^(a·x) − k),  con A = 165,4  a = 2,1  k = 0,88
 * `x` va de 0 (ápex, graves) a 1 (base, agudos). Se usa invertida para pasar
 * de la frecuencia elegida al punto que vibra.
 */
const GW = { A: 165.4, a: 2.1, k: 0.88 };
const posicionCoclear = (f: number) =>
  Math.min(Math.max(Math.log10(f / GW.A + GW.k) / GW.a, 0), 1);

/** Referencias de la escala de decibelios, para que el número signifique algo. */
const REFERENCIAS = [
  { db: 10,  label: 'Respiración' },
  { db: 30,  label: 'Susurro' },
  { db: 60,  label: 'Conversación' },
  { db: 85,  label: 'Tráfico denso' },
  { db: 110, label: 'Concierto' },
  { db: 130, label: 'Umbral de dolor' },
];

/**
 * Claves de `preset`: `frecuencia`, `db`, y `presbiacusia` (1 = activada).
 */
export default function SimSonido({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [frecuencia, setFrecuencia] = useState(1000); // Hz
  const [db, setDb] = useState(60);                   // dB
  const [presbiacusia, setPresbiacusia] = useState(false);

  const intensidad = 1e-12 * Math.pow(10, db / 10);   // W/m²
  const lambdaAire = 343 / frecuencia;                 // m
  const x = posicionCoclear(frecuencia);
  const audible = frecuencia >= 20 && frecuencia <= 20000;
  // La presbiacusia empieza por la base de la cóclea: se pierden los agudos.
  const perdida = presbiacusia ? Math.max(0, Math.min((frecuencia - 2000) / 6000, 1)) : 0;
  const dbEfectivo = Math.max(db - perdida * 55, 0);

  const est = useRef({ frecuencia, db, x, perdida, dbEfectivo, presbiacusia });
  est.current = { frecuencia, db, x, perdida, dbEfectivo, presbiacusia };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const { frecuencia: f, db: nivel, x: xc, perdida: perd, presbiacusia: presbi } = est.current;

    const compacto = w < 640;
    const margen = 22;

    /* ─── 1. Onda de presión ──────────────────────────────────────────── */
    const onda = { x: margen, y: 18, w: compacto ? w - margen * 2 : w * 0.6, h: 118 };
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.03);
    ctx.beginPath();
    ctx.roundRect(onda.x, onda.y, onda.w, onda.h, 12);
    ctx.fill();
    ctx.restore();

    const ocy = onda.y + onda.h / 2;
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.16);
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(onda.x + 10, ocy);
    ctx.lineTo(onda.x + onda.w - 10, ocy);
    ctx.stroke();
    ctx.restore();

    // Amplitud ∝ √I, y √I va con 10^(β/20): por eso la escala de dB comprime
    // tanto — de 60 a 120 dB la amplitud se multiplica por 1000.
    const ampRel = Math.pow(10, (nivel - 60) / 20) / 8;
    const ampPx = Math.min(Math.max(ampRel, 0.02), 1) * (onda.h / 2 - 12);
    // Ciclos visibles: comprimidos logarítmicamente, o a 20 kHz sería una mancha.
    const ciclos = 1.4 + Math.log10(f / 20) * 2.6;

    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const u = i / 300;
      const px = onda.x + 10 + u * (onda.w - 20);
      const py = ocy - ampPx * Math.sin(u * ciclos * Math.PI * 2 - t * 3.2);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    texto(c, 'ONDA DE PRESIÓN', onda.x + 12, onda.y + 14, { size: 10, peso: 800 });
    texto(c, `${f < 1000 ? f.toFixed(0) + ' Hz' : (f / 1000).toFixed(2) + ' kHz'}`,
      onda.x + onda.w - 12, onda.y + 14, { size: 11, peso: 800, align: 'right', color: paleta.acento });

    if (!audible) {
      texto(c, f < 20 ? 'INFRASONIDO — fuera del rango audible' : 'ULTRASONIDO — fuera del rango audible',
        onda.x + onda.w / 2, onda.y + onda.h - 14,
        { size: 11, peso: 700, align: 'center', color: '#ef4444' });
    }

    /* ─── 2. Escala de decibelios ─────────────────────────────────────── */
    if (!compacto) {
      const esc = { x: w * 0.66, y: 18, w: w * 0.3, h: 118 };
      texto(c, 'NIVEL', esc.x, esc.y + 14, { size: 10, peso: 800 });
      const barY = esc.y + 26;
      const barH = esc.h - 38;
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.06);
      ctx.beginPath();
      ctx.roundRect(esc.x, barY, esc.w, barH, 8);
      ctx.fill();
      ctx.restore();

      REFERENCIAS.forEach((r) => {
        const rx = esc.x + (r.db / 140) * esc.w;
        ctx.save();
        ctx.strokeStyle = alfa(paleta.ink, 0.18);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rx, barY);
        ctx.lineTo(rx, barY + barH);
        ctx.stroke();
        ctx.restore();
      });

      const nx = esc.x + (nivel / 140) * esc.w;
      ctx.save();
      ctx.fillStyle = nivel >= 85 ? '#ef4444' : paleta.acento;
      ctx.beginPath();
      ctx.roundRect(esc.x, barY, Math.max(nx - esc.x, 6), barH, 8);
      ctx.fill();
      ctx.restore();

      const ref = [...REFERENCIAS].reverse().find((r) => nivel >= r.db - 8);
      texto(c, `${nivel} dB`, esc.x + 8, barY + barH / 2 - 8, { size: 15, peso: 800, color: '#fff' });
      texto(c, ref ? ref.label : 'Casi inaudible', esc.x + 8, barY + barH / 2 + 10,
        { size: 10.5, peso: 600, color: alfa('#ffffff', 0.85) });
      if (nivel >= 85) {
        texto(c, '⚠ daño con exposición prolongada', esc.x, barY + barH + 12,
          { size: 10, peso: 700, color: '#ef4444' });
      }
    }

    /* ─── 3. Cóclea desenrollada (tonotopía) ──────────────────────────── */
    const coc = { x: margen + 30, y: compacto ? 168 : 172, w: w - margen * 2 - 60, h: 96 };
    texto(c, 'MEMBRANA BASILAR (cóclea desenrollada)', margen, coc.y - 16, { size: 10, peso: 800 });

    // La membrana es estrecha y rígida en la base (agudos) y ancha y flexible
    // en el ápex (graves): esa geometría ES la razón de la tonotopía.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(coc.x, coc.y + coc.h / 2 - 10);
    ctx.lineTo(coc.x + coc.w, coc.y + coc.h / 2 - 34);
    ctx.lineTo(coc.x + coc.w, coc.y + coc.h / 2 + 34);
    ctx.lineTo(coc.x, coc.y + coc.h / 2 + 10);
    ctx.closePath();
    ctx.fillStyle = alfa(paleta.ink, 0.06);
    ctx.strokeStyle = alfa(paleta.ink, 0.2);
    ctx.lineWidth = 1.4;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Zona apagada por presbiacusia (extremo de agudos = base = izquierda aquí)
    if (presbi) {
      const x2k = 1 - posicionCoclear(2000);
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.beginPath();
      ctx.rect(coc.x, coc.y, coc.w * x2k, coc.h);
      ctx.fill();
      ctx.restore();
      texto(c, 'zona degenerada', coc.x + (coc.w * x2k) / 2, coc.y + coc.h + 14,
        { align: 'center', size: 10, peso: 700, color: '#ef4444' });
    }

    // Marcas de frecuencia a lo largo de la membrana
    [20000, 8000, 4000, 2000, 1000, 500, 250, 125, 60].forEach((fr) => {
      const u = 1 - posicionCoclear(fr);
      const px = coc.x + u * coc.w;
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.14);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, coc.y + 6);
      ctx.lineTo(px, coc.y + coc.h - 6);
      ctx.stroke();
      ctx.restore();
      texto(c, fr >= 1000 ? `${fr / 1000}k` : `${fr}`, px, coc.y - 2, { align: 'center', size: 9 });
    });

    texto(c, 'BASE · agudos', coc.x, coc.y + coc.h + 14, { size: 10, peso: 700 });
    texto(c, 'ÁPEX · graves', coc.x + coc.w, coc.y + coc.h + 14, { size: 10, peso: 700, align: 'right' });

    // Punto de resonancia: envolvente de la onda viajera
    const ux = 1 - xc;
    const px = coc.x + ux * coc.w;
    const vivo = 0.6 + 0.4 * Math.sin(t * 7);
    const alturaPico = (1 - perd) * 30 * (0.5 + Math.min(nivel / 120, 1) * 0.5);

    ctx.save();
    ctx.strokeStyle = alfa(paleta.acento, audible ? 0.95 : 0.3);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const u = i / 200;
      const dx = (u - ux) * coc.w;
      // Onda viajera: crece hacia su punto de resonancia y cae en picado tras él.
      const sobre = dx > 0 ? Math.exp(-((dx / 46) ** 2)) : Math.exp(-((dx / 118) ** 2));
      const py = coc.y + coc.h / 2 - sobre * alturaPico * vivo;
      const cx = coc.x + u * coc.w;
      if (i === 0) ctx.moveTo(cx, py); else ctx.lineTo(cx, py);
    }
    ctx.stroke();
    ctx.restore();

    if (audible) {
      ctx.save();
      ctx.fillStyle = perd > 0.5 ? '#ef4444' : paleta.acento;
      ctx.shadowColor = alfa(perd > 0.5 ? '#ef4444' : paleta.acento, 0.7);
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(px, coc.y + coc.h / 2 - alturaPico * vivo, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      texto(c, 'aquí vibra', px, coc.y + coc.h / 2 - alturaPico - 18, {
        align: 'center', size: 10.5, peso: 700, color: perd > 0.5 ? '#ef4444' : paleta.acento,
      });
    }

    /* ─── 4. Banda del habla ──────────────────────────────────────────── */
    const hb = { y: coc.y + coc.h + 32, h: 20 };
    const u1 = 1 - posicionCoclear(3400);
    const u2 = 1 - posicionCoclear(300);
    ctx.save();
    ctx.fillStyle = alfa(paleta.acento, 0.14);
    ctx.beginPath();
    ctx.roundRect(coc.x + u1 * coc.w, hb.y, (u2 - u1) * coc.w, hb.h, 6);
    ctx.fill();
    ctx.restore();
    texto(c, 'banda del habla  (300 Hz – 3,4 kHz)', coc.x + ((u1 + u2) / 2) * coc.w, hb.y + hb.h / 2, {
      align: 'center', size: 10, peso: 700, color: paleta.acento,
    });

    if (presbi) {
      texto(c, 'Las consonantes (2–4 kHz) caen en la zona perdida: «oigo pero no entiendo».',
        w / 2, hb.y + hb.h + 16, { align: 'center', size: 10.5, peso: 600, color: '#ef4444' });
    }
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 400 });

  useEffect(() => {
    if (!preset) return;
    if (preset.frecuencia   !== undefined) setFrecuencia(preset.frecuencia);
    if (preset.db           !== undefined) setDb(preset.db);
    if (preset.presbiacusia !== undefined) setPresbiacusia(!!preset.presbiacusia);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  // El mando recorre el rango audible en escala logarítmica: en lineal, el 90 %
  // del recorrido caería sobre agudos que se distinguen mal entre sí.
  const sliderF = Math.log10(frecuencia);

  return (
    <LabShell
      titulo="Del sonido al nervio auditivo"
      acento={acento}
      onAcento={setAcento}
      sim="sonido"
      reloj={reloj}
      magnitudes={{
        f: frecuencia,
        db,
        I: intensidad,
        veces: Math.pow(10, db / 10),
        lambda: lambdaAire,
        dbEf: dbEfectivo,
        // 35 mm de membrana basilar: la posición normalizada de Greenwood
        // pasada a la distancia que se mide de verdad.
        x: x * 35,
      }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M6 9a6 6 0 1 1 12 0c0 4-3 4-3 8a3 3 0 0 1-6 0" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      }
      mando={
        <>
          <LabSlider
            label="Frecuencia  f"
            magnitud="f"
            valor={sliderF}
            display={frecuencia >= 1000 ? `${(frecuencia / 1000).toFixed(2)} kHz` : `${frecuencia.toFixed(0)} Hz`}
            min={1}
            max={6.7}
            paso={0.01}
            onChange={(v) => setFrecuencia(Math.pow(10, v))}
          />
          <LabSlider label="Nivel  β" magnitud="db" valor={db} display={`${db} dB`}
            min={0} max={140} paso={1} onChange={setDb} />

          <LabFila label="Ir a">
            {[
              { label: 'Grave · 125 Hz',       f: 125 },
              { label: 'Voz · 1 kHz',          f: 1000 },
              { label: 'Consonantes · 4 kHz',  f: 4000 },
              { label: 'Ecografía · 5 MHz',    f: 5_000_000 },
            ].map((opcion) => (
              <Btn
                key={opcion.label}
                activo={Math.abs(frecuencia - opcion.f) < 1}
                onClick={() => setFrecuencia(opcion.f)}
              >
                {opcion.label}
              </Btn>
            ))}
            <Btn activo={presbiacusia} onClick={() => setPresbiacusia((v) => !v)}>
              Simular presbiacusia
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Sube de 60 a 90 dB: la barra sólo avanza un tercio, pero la intensidad se multiplicó por
          1000. Esa compresión logarítmica es la razón de que el oído aguante 14 órdenes de magnitud.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
