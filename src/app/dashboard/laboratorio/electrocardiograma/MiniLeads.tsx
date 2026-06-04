'use client';
// Mini-derivaciones V1 y V6. Se usan en los modos de bloqueo de rama (7 y 8),
// donde la morfología (rSR′ en V1, R ancha mellada en V6) hace evidente el
// bloqueo. En el Modo 1 (sinusal) no se renderiza. Cada mini-lead recibe su
// propio juego de parámetros gaussianos.

import { useEffect, useRef } from 'react';
import type { BeatParams } from './engine/types';
import { sampleEcg } from './engine/ecgWave';
import styles from '@/styles/electrocardiograma.module.css';

interface Lead {
  name: string;
  beat: BeatParams;
}

export default function MiniLeads({ leads, dark }: { leads: Lead[]; dark: boolean }) {
  return (
    <div className={styles.miniLeads}>
      {leads.map((l) => (
        <MiniLead key={l.name} lead={l} dark={dark} />
      ))}
    </div>
  );
}

function MiniLead({ lead, dark }: { lead: Lead; dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseline = h * 0.6;
    const pxPerMv = (w / (lead.beat.rr / 1000)) * 0.2 * 0.4;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = dark ? '#5fe0a8' : '#16203a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const tBeat = ((x / w) * lead.beat.rr) % lead.beat.rr;
      const y = baseline - sampleEcg(tBeat, lead.beat) * pxPerMv;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [lead, dark]);

  return (
    <div className={styles.miniLead}>
      <span className={styles.miniLeadName}>{lead.name}</span>
      <div className={styles.miniLeadCanvas}>
        <canvas ref={ref} />
      </div>
    </div>
  );
}
