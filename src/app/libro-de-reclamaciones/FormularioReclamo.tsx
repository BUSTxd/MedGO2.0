'use client';

import { useState } from 'react';
import { CORREO } from '@/lib/contacto';
import { PROVEEDOR } from '@/lib/proveedor';
import {
  DEFINICIONES,
  PLAZO_RESPUESTA,
  TIPOS_DOCUMENTO,
  validarHoja,
  type HojaReclamacion,
  type HojaRegistrada,
} from '@/lib/libro-reclamaciones';
import styles from '@/styles/libroReclamaciones.module.css';

const VACIA: HojaReclamacion = {
  tipo: 'reclamo',
  nombre: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  domicilio: '',
  telefono: '',
  email: '',
  menorDeEdad: false,
  apoderadoNombre: '',
  apoderadoDocumento: '',
  bienTipo: 'servicio',
  bienDescripcion: '',
  montoReclamado: '',
  detalle: '',
  pedido: '',
};

export default function FormularioReclamo() {
  const [h, setH] = useState<HojaReclamacion>(VACIA);
  const [web, setWeb] = useState('');
  const [acepto, setAcepto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hecha, setHecha] = useState<{ hoja: HojaReclamacion; registro: HojaRegistrada } | null>(null);

  const campo = <K extends keyof HojaReclamacion>(k: K, v: HojaReclamacion[K]) => setH((p) => ({ ...p, [k]: v }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const problema = validarHoja(h);
    if (problema) return setError(problema);
    if (!acepto) return setError('Confirma que los datos son verdaderos.');
    setEnviando(true);
    try {
      const res = await fetch('/api/libro-reclamaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...h, web }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'No se pudo registrar.');
      setHecha({ hoja: h, registro: json as HojaRegistrada });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar.');
    } finally {
      setEnviando(false);
    }
  }

  if (hecha) {
    const { hoja, registro } = hecha;
    const filas: [string, string][] = [
      ['Fecha', registro.fecha],
      ['Proveedor', [PROVEEDOR.nombreComercial, PROVEEDOR.titular, PROVEEDOR.ruc && `RUC ${PROVEEDOR.ruc}`, PROVEEDOR.domicilio].filter(Boolean).join(' · ')],
      ['Tipo', hoja.tipo === 'reclamo' ? 'Reclamo' : 'Queja'],
      ['Consumidor', hoja.nombre],
      ['Documento', `${hoja.tipoDocumento} ${hoja.numeroDocumento}`],
      ['Domicilio', hoja.domicilio],
      ['Teléfono', hoja.telefono],
      ['Correo', hoja.email],
      ['Padre, madre o apoderado', hoja.menorDeEdad ? `${hoja.apoderadoNombre} (${hoja.apoderadoDocumento})` : ''],
      [hoja.bienTipo === 'producto' ? 'Producto' : 'Servicio', hoja.bienDescripcion],
      ['Monto reclamado', hoja.montoReclamado ? `S/ ${hoja.montoReclamado}` : ''],
      ['Detalle', hoja.detalle],
      ['Pedido', hoja.pedido],
    ];
    return (
      <section className={styles.hoja} aria-live="polite">
        <p className={styles.hojaOk}>Hoja registrada</p>
        <h2 className={styles.hojaCodigo}>{registro.codigo}</h2>
        <p className={styles.hojaAviso}>
          {registro.copiaEnviada
            ? <>Te enviamos una copia a <strong>{hoja.email}</strong>. </>
            : <>Guarda o imprime esta hoja como constancia. </>}
          Responderemos a tu correo en un plazo máximo de {PLAZO_RESPUESTA} días hábiles.
        </p>
        <dl className={styles.hojaDatos}>
          {filas.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <button type="button" className={styles.boton} onClick={() => window.print()}>Imprimir o guardar en PDF</button>
      </section>
    );
  }

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <fieldset className={styles.grupo}>
        <legend>1. Tus datos</legend>
        <label className={styles.ancho}>Nombre completo<input value={h.nombre} onChange={(e) => campo('nombre', e.target.value)} autoComplete="name" required /></label>
        <label>Tipo de documento
          <select value={h.tipoDocumento} onChange={(e) => campo('tipoDocumento', e.target.value as HojaReclamacion['tipoDocumento'])}>
            {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>Número de documento<input value={h.numeroDocumento} onChange={(e) => campo('numeroDocumento', e.target.value)} required /></label>
        <label className={styles.ancho}>Domicilio<input value={h.domicilio} onChange={(e) => campo('domicilio', e.target.value)} autoComplete="street-address" required /></label>
        <label>Teléfono <span className={styles.opcional}>(opcional)</span><input value={h.telefono} onChange={(e) => campo('telefono', e.target.value)} autoComplete="tel" inputMode="tel" /></label>
        <label>Correo<input type="email" value={h.email} onChange={(e) => campo('email', e.target.value)} autoComplete="email" required /></label>
        <label className={`${styles.ancho} ${styles.check}`}>
          <input type="checkbox" checked={h.menorDeEdad} onChange={(e) => campo('menorDeEdad', e.target.checked)} />
          Soy menor de edad
        </label>
        {h.menorDeEdad && (
          <>
            <label>Nombre del padre, madre o apoderado<input value={h.apoderadoNombre} onChange={(e) => campo('apoderadoNombre', e.target.value)} required /></label>
            <label>Su documento<input value={h.apoderadoDocumento} onChange={(e) => campo('apoderadoDocumento', e.target.value)} required /></label>
          </>
        )}
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend>2. Qué contrataste</legend>
        <div className={`${styles.ancho} ${styles.opciones}`} role="radiogroup" aria-label="Producto o servicio">
          {(['servicio', 'producto'] as const).map((t) => (
            <label key={t} className={styles.opcion}>
              <input type="radio" name="bien" checked={h.bienTipo === t} onChange={() => campo('bienTipo', t)} />
              {t === 'servicio' ? 'Servicio' : 'Producto'}
            </label>
          ))}
        </div>
        <label className={styles.ancho}>Descripción<input value={h.bienDescripcion} onChange={(e) => campo('bienDescripcion', e.target.value)} placeholder="Por ejemplo: plan Residente de MedGO" required /></label>
        <label>Monto reclamado en S/ <span className={styles.opcional}>(opcional)</span><input value={h.montoReclamado} onChange={(e) => campo('montoReclamado', e.target.value)} inputMode="decimal" /></label>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend>3. Tu reclamo o queja</legend>
        <div className={`${styles.ancho} ${styles.opciones}`} role="radiogroup" aria-label="Reclamo o queja">
          {(['reclamo', 'queja'] as const).map((t) => (
            <label key={t} className={styles.opcion}>
              <input type="radio" name="tipo" checked={h.tipo === t} onChange={() => campo('tipo', t)} />
              <span><strong>{t === 'reclamo' ? 'Reclamo' : 'Queja'}</strong><small>{DEFINICIONES[t]}</small></span>
            </label>
          ))}
        </div>
        <label className={styles.ancho}>Detalle<textarea rows={6} value={h.detalle} onChange={(e) => campo('detalle', e.target.value)} required /></label>
        <label className={styles.ancho}>Pedido: ¿qué solución esperas?<textarea rows={3} value={h.pedido} onChange={(e) => campo('pedido', e.target.value)} required /></label>
      </fieldset>

      {/* Trampa para bots: fuera de la vista y del orden de tabulación. */}
      <input className={styles.trampa} tabIndex={-1} autoComplete="off" aria-hidden="true" value={web} onChange={(e) => setWeb(e.target.value)} />

      <label className={styles.check}>
        <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
        Declaro que los datos son verdaderos y acepto que MedGO los use para atender esta hoja, según la{' '}
        <a href="/privacidad">Política de privacidad</a>.
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" className={styles.boton} disabled={enviando}>{enviando ? 'Registrando…' : 'Registrar hoja'}</button>
      <p className={styles.nota}>¿Dudas? Escríbenos a <a href={`mailto:${CORREO}`}>{CORREO}</a>.</p>
    </form>
  );
}
