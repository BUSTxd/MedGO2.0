'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C10 · Condensador de placas, con los dos presets que el sílabo pide:
 * la MEMBRANA CELULAR y el DESFIBRILADOR.
 *
 * Son el mismo dispositivo a dos escalas y por eso comparten escena: la
 * membrana son 70 mV sobre 7 nm —un campo de 10⁷ V/m, mayor que el de una
 * tormenta— y el desfibrilador son miles de voltios sobre centímetros. Verlos
 * con la misma fórmula es lo que hace clic; tener dos simulaciones separadas lo
 * escondería.
 *
 * El campo se dibuja como líneas rectas y uniformes entre placas porque eso es
 * lo que dice el modelo (E = V/d, sin dependencia de la posición). Curvarlas
 * sería más bonito y menos cierto.
 */

/** Claves de `preset`: `area`, `separacion`, `voltaje`, `dielectrico`. */

const EPS0 = 8.85e-12;

export default function SimCapacitor({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [area, setArea] = useState(0.02);       // m²
  const [dMm, setDMm] = useState(1);            // mm
  const [er, setEr] = useState(1);
  const [voltaje, setVoltaje] = useState(200);  // V
  const [dtMs, setDtMs] = useState(5);          // ms de descarga
  const [verCampo, setVerCampo] = useState(true);

  const d = dMm / 1000;
  const C = (er * EPS0 * area) / d;
  const Q = C * voltaje;
  const E = voltaje / d;
  const U = 0.5 * C * voltaje * voltaje;
  const dt = dtMs / 1000;
  const P = U / dt;

  const est = useRef({ area, d, er, voltaje, E, Q });
  est.current = { area, d, er, voltaje, E, Q };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    rejilla(c, 28);

    const cy = h / 2 - 8;
    // La separación se dibuja en escala logarítmica: el mando recorre de 0,01 a
    // 5 mm, y en lineal el caso de la membrana sería una línea de un píxel.
    const sepPx = 30 + Math.log10(dMm / 0.005) * 42;
    const anchoPlaca = Math.min(w * 0.52, 320);
    const x0 = w / 2 - anchoPlaca / 2;

    /* ─── Placas ──────────────────────────────────────────────────────── */
    [
      { y: cy - sepPx / 2, color: '#E85B4A', signo: '+' },
      { y: cy + sepPx / 2, color: '#5E9CD3', signo: '−' },
    ].forEach((placa) => {
      ctx.save();
      ctx.fillStyle = placa.color;
      ctx.shadowColor = alfa(placa.color, 0.4);
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(x0, placa.y - 5, anchoPlaca, 10, 4);
      ctx.fill();
      ctx.restore();

      // Cargas repartidas por la placa: su número sube con Q, que es la lectura
      // inmediata de «esta placa guarda más».
      const nCargas = Math.min(Math.round(Math.abs(s.Q) * 1e9 * 2) + 3, 22);
      for (let i = 0; i < nCargas; i++) {
        const px = x0 + ((i + 0.5) / nCargas) * anchoPlaca;
        texto(c, placa.signo, px, placa.y, {
          align: 'center', size: 12, peso: 800, color: '#fff',
        });
      }
    });

    /* ─── Campo entre las placas ──────────────────────────────────────── */
    if (verCampo) {
      const nLineas = 11;
      for (let i = 0; i < nLineas; i++) {
        const px = x0 + ((i + 0.5) / nLineas) * anchoPlaca;
        vector(c, px, cy - sepPx / 2 + 8, 0, sepPx - 16, alfa(paleta.acento, 0.75), undefined, {
          grosor: 1.8, punta: 7, minimo: 6,
        });
      }
      // Dieléctrico: se dibuja como un velo entre placas, con dipolos alineados
      // — que es lo que de verdad hace: oponerse al campo y dejar meter más carga.
      if (s.er > 1) {
        ctx.save();
        ctx.fillStyle = alfa('#F5A623', 0.12);
        ctx.beginPath();
        ctx.roundRect(x0, cy - sepPx / 2 + 6, anchoPlaca, sepPx - 12, 3);
        ctx.fill();
        ctx.restore();
        texto(c, `dieléctrico εr = ${s.er.toFixed(1)}`, w / 2, cy, {
          align: 'center', size: 10.5, peso: 700, color: '#F5A623',
        });
      }
    }

    // Cota de separación
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.35);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x0 - 18, cy - sepPx / 2);
    ctx.lineTo(x0 - 18, cy + sepPx / 2);
    ctx.stroke();
    ctx.restore();
    texto(c, dMm >= 1 ? `${dMm.toFixed(2)} mm` : `${(dMm * 1000).toFixed(0)} nm`,
      x0 - 24, cy, { align: 'right', size: 10.5, peso: 700 });

    texto(c, `${voltaje >= 1 ? voltaje.toFixed(0) + ' V' : (voltaje * 1000).toFixed(0) + ' mV'}`,
      x0 + anchoPlaca + 22, cy, { align: 'left', size: 13, peso: 800, color: paleta.acento });

    /* ─── Barras de la descarga ───────────────────────────────────────── */
    const panel = { x: 30, y: h - 96, w: w - 60 };
    const filas = [
      { label: 'Capacitancia  C', valor: `${(C * 1e12).toFixed(1)} pF`, frac: Math.min(C / 1e-8, 1) },
      { label: 'Carga  Q',        valor: `${(Q * 1e9).toFixed(1)} nC`,  frac: Math.min(Q / 1e-6, 1) },
      { label: 'Energía  U',      valor: U >= 1 ? `${U.toFixed(1)} J` : `${(U * 1000).toFixed(2)} mJ`,
        frac: Math.min(U / 400, 1) },
    ];
    filas.forEach((fila, i) => {
      const y = panel.y + i * 26;
      texto(c, fila.label, panel.x, y, { size: 10.5, peso: 700 });
      texto(c, fila.valor, panel.x + panel.w, y, {
        align: 'right', size: 11.5, peso: 800, color: paleta.acento,
      });
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.07);
      ctx.beginPath();
      ctx.roundRect(panel.x, y + 8, panel.w, 6, 3);
      ctx.fill();
      ctx.fillStyle = paleta.acento;
      ctx.beginPath();
      ctx.roundRect(panel.x, y + 8, Math.max(panel.w * fila.frac, 6), 6, 3);
      ctx.fill();
      ctx.restore();
    });

    // Aviso de ruptura dieléctrica del aire: 3×10⁶ V/m. Es lo que convierte el
    // ejercicio en una restricción de diseño real.
    if (s.E > 3e6 && s.er <= 1.2) {
      const parpadeo = 0.55 + 0.45 * Math.sin(t * 6);
      texto(c, `E = ${s.E.toExponential(1)} V/m · el aire se rompe por encima de 3×10⁶`,
        w / 2, 22, { align: 'center', size: 11, peso: 800, color: alfa('#E85B4A', parpadeo) });
    } else {
      texto(c, `E = ${s.E.toExponential(2)} V/m entre las placas`, w / 2, 22, {
        align: 'center', size: 11, peso: 700,
      });
    }
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380 });

  useEffect(() => {
    if (!preset) return;
    if (preset.area        !== undefined) setArea(preset.area);
    if (preset.separacion  !== undefined) setDMm(preset.separacion * 1000);
    if (preset.voltaje     !== undefined) setVoltaje(preset.voltaje);
    if (preset.dielectrico !== undefined) setEr(preset.dielectrico);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Condensador: de la membrana celular al desfibrilador"
      acento={acento}
      onAcento={setAcento}
      sim="capacitor"
      reloj={reloj}
      magnitudes={{ A: area, d, er, C, V: voltaje, Q, E, U, dt, P }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M4 9h16M4 15h16M12 3v6M12 15v6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Área de placa  A" magnitud="A" valor={area * 10000}
            display={`${(area * 10000).toFixed(0)} cm²`}
            min={1} max={400} paso={1} onChange={(v) => setArea(v / 10000)} />
          <LabSlider label="Separación  d" magnitud="d" valor={Math.log10(dMm)}
            display={dMm >= 1 ? `${dMm.toFixed(2)} mm` : `${(dMm * 1000).toFixed(0)} nm`}
            min={-2.3} max={0.7} paso={0.01} onChange={(v) => setDMm(Math.pow(10, v))} />
          <LabSlider label="Voltaje  V" magnitud="V" valor={voltaje} display={`${voltaje.toFixed(0)} V`}
            min={0.05} max={5000} paso={1} onChange={setVoltaje} />
          <LabSlider label="Dieléctrico  εr" magnitud="er" valor={er} display={er.toFixed(1)}
            min={1} max={80} paso={0.5} onChange={setEr} />
          <LabSlider label="Duración de la descarga" magnitud="dt" valor={dtMs}
            display={`${dtMs.toFixed(1)} ms`}
            min={0.5} max={20} paso={0.5} onChange={setDtMs} />

          <LabFila label="Ir a">
            <Btn
              activo={Math.abs(voltaje - 0.07) < 0.01}
              onClick={() => { setArea(1e-4); setDMm(0.007); setEr(3); setVoltaje(0.07); }}
            >
              Membrana celular
            </Btn>
            <Btn
              activo={voltaje > 2000}
              onClick={() => { setArea(0.02); setDMm(1); setEr(1); setVoltaje(3000); setDtMs(5); }}
            >
              Desfibrilador
            </Btn>
            <Btn activo={verCampo} onClick={() => setVerCampo((v) => !v)}>
              Campo entre placas
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Pulsa <strong>Membrana celular</strong>: 70 mV parecen nada, pero repartidos sobre 7 nm
          dan 10⁷ V/m — más campo que dentro de una nube de tormenta. Eso es lo que abre y cierra
          los canales dependientes de voltaje.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
