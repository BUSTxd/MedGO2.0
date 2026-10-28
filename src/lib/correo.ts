import 'server-only';
import { CORREO } from '@/lib/contacto';

/**
 * Envía un correo con Resend. Necesita `RESEND_API_KEY` y un remitente de un
 * dominio verificado en `RESEND_FROM`; sin la clave no envía y devuelve `false`
 * (quien llama decide qué hacer sin correo).
 */
export async function enviarCorreo(opts: { to: string; subject: string; html: string; bcc?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? `MedGO <${CORREO}>`,
        to: [opts.to],
        ...(opts.bcc ? { bcc: [opts.bcc] } : {}),
        reply_to: CORREO,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) console.error('[correo] Resend', res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error('[correo] Resend', err);
    return false;
  }
}

export const escHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
