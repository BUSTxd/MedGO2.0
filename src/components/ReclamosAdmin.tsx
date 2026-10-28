'use client';

import { useCallback, useEffect, useState } from 'react';
import { PLAZO_RESPUESTA } from '@/lib/libro-reclamaciones';
import styles from '@/styles/adminPage.module.css';

interface Hoja {
  id: string;
  codigo: string;
  created_at: string;
  tipo: 'reclamo' | 'queja';
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
  domicilio: string;
  telefono: string | null;
  email: string;
  menor_de_edad: boolean;
  apoderado_nombre: string | null;
  apoderado_documento: string | null;
  bien_tipo: 'producto' | 'servicio';
  bien_descripcion: string;
  monto_reclamado: number | null;
  detalle: string;
  pedido: string;
  copia_enviada: boolean;
  estado: 'pendiente' | 'respondido';
  respuesta: string | null;
  respondido_at: string | null;
}

const fecha = (iso: string) =>
  new Date(iso).toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'medium', timeStyle: 'short' });

/**
 * Días hábiles (lunes a viernes) que quedan del plazo legal para responder.
 * No descuenta feriados: con uno de por medio, el plazo real es un día más largo.
 */
function diasHabilesRestantes(desde: string): number {
  const d = new Date(desde);
  let usados = 0;
  const hoy = new Date();
  while (d < hoy) {
    d.setDate(d.getDate() + 1);
    if (d > hoy) break;
    const dia = d.getDay();
    if (dia !== 0 && dia !== 6) usados++;
  }
  return PLAZO_RESPUESTA - usados;
}

/** Libro de Reclamaciones en el panel admin: leer cada hoja y responderla dentro del plazo. */
export default function ReclamosAdmin() {
  const [hojas, setHojas] = useState<Hoja[] | null>(null);
  const [correo, setCorreo] = useState(false);
  const [abierta, setAbierta] = useState<string | null>(null);
  const [borrador, setBorrador] = useState('');
  const [estado, setEstado] = useState<string | null>(null);

  const cargar = useCallback(() => {
    fetch('/api/admin/reclamos', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { setHojas(j?.hojas ?? []); setCorreo(!!j?.correo); })
      .catch(() => setHojas([]));
  }, []);
  useEffect(cargar, [cargar]);

  const responder = async (id: string) => {
    setEstado('Guardando…');
    const r = await fetch('/api/admin/reclamos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, respuesta: borrador }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setEstado(`Error: ${j.error ?? r.status}`); return; }
    setEstado(j.enviada ? 'Respuesta guardada y enviada por correo.' : 'Respuesta guardada. No hay servicio de correo: envíasela tú desde contacto@.');
    setBorrador('');
    cargar();
  };

  const pendientes = hojas?.filter((h) => h.estado === 'pendiente') ?? [];

  return (
    <section className={styles.cursosSection}>
      <div className={styles.cursosHead}>
        <div>
          <h2 className={styles.cursosTitle}>Libro de Reclamaciones</h2>
          <p className={styles.cursosSub}>
            {hojas === null
              ? 'Cargando…'
              : <>{pendientes.length} pendiente{pendientes.length === 1 ? '' : 's'} · {hojas.length} en total · plazo {PLAZO_RESPUESTA} días hábiles · {correo ? 'copias por correo activas' : <strong>sin servicio de correo (falta RESEND_API_KEY)</strong>}</>}
          </p>
        </div>
      </div>

      {hojas && hojas.length === 0 && <div className={styles.empty}>Aún no hay hojas registradas.</div>}

      {hojas && hojas.length > 0 && (
        <ol className={styles.reclamos}>
          {hojas.map((h) => {
            const quedan = diasHabilesRestantes(h.created_at);
            const abiertaEsta = abierta === h.id;
            return (
              <li key={h.id} className={styles.reclamo}>
                <button
                  type="button"
                  className={styles.reclamoCabeza}
                  aria-expanded={abiertaEsta}
                  onClick={() => { setAbierta(abiertaEsta ? null : h.id); setBorrador(h.respuesta ?? ''); setEstado(null); }}
                >
                  <span className={styles.reclamoCodigo}>{h.codigo}</span>
                  <span className={styles.reclamoTipo}>{h.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}</span>
                  <span className={styles.reclamoNombre}>{h.nombre} <span className={styles.muted}>· {h.email}</span></span>
                  {h.estado === 'respondido'
                    ? <span className={`${styles.reclamoEstado} ${styles.reclamoOk}`}>Respondido</span>
                    : <span className={`${styles.reclamoEstado} ${quedan <= 3 ? styles.reclamoUrgente : ''}`}>
                        {quedan > 0 ? `Quedan ${quedan} días hábiles` : `Vencido hace ${-quedan} días hábiles`}
                      </span>}
                </button>

                {abiertaEsta && (
                  <div className={styles.reclamoCuerpo}>
                    <dl className={styles.reclamoDatos}>
                      <div><dt>Registrada</dt><dd>{fecha(h.created_at)}{h.copia_enviada ? ' · copia enviada' : ' · sin copia por correo'}</dd></div>
                      <div><dt>Documento</dt><dd>{h.tipo_documento} {h.numero_documento}</dd></div>
                      <div><dt>Domicilio</dt><dd>{h.domicilio}</dd></div>
                      {h.telefono && <div><dt>Teléfono</dt><dd>{h.telefono}</dd></div>}
                      {h.menor_de_edad && <div><dt>Apoderado</dt><dd>{h.apoderado_nombre} ({h.apoderado_documento})</dd></div>}
                      <div><dt>{h.bien_tipo === 'producto' ? 'Producto' : 'Servicio'}</dt><dd>{h.bien_descripcion}{h.monto_reclamado != null && ` · S/ ${Number(h.monto_reclamado).toFixed(2)}`}</dd></div>
                      <div><dt>Detalle</dt><dd>{h.detalle}</dd></div>
                      <div><dt>Pedido</dt><dd>{h.pedido}</dd></div>
                      {h.respondido_at && <div><dt>Respondido</dt><dd>{fecha(h.respondido_at)}</dd></div>}
                    </dl>
                    <label className={styles.reclamoRespuesta}>
                      {h.estado === 'respondido' ? 'Respuesta enviada (puedes corregirla)' : 'Respuesta al consumidor'}
                      <textarea rows={5} value={borrador} onChange={(e) => setBorrador(e.target.value)} />
                    </label>
                    <div className={styles.iaForm}>
                      <button type="button" className={styles.descargar} disabled={!borrador.trim()} onClick={() => responder(h.id)}>
                        {correo ? 'Guardar y enviar respuesta' : 'Guardar respuesta'}
                      </button>
                      {estado && <span className={styles.muted}>{estado}</span>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
