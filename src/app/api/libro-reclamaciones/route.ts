import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CORREO } from '@/lib/contacto';
import { enviarCorreo, escHtml } from '@/lib/correo';
import { PROVEEDOR } from '@/lib/proveedor';
import {
  DEFINICIONES,
  PLAZO_RESPUESTA,
  validarHoja,
  type HojaReclamacion,
  type HojaRegistrada,
} from '@/lib/libro-reclamaciones';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Hojas por correo y hora: frena el abuso sin estorbar a quien reclama de verdad. */
const MAX_POR_HORA = 5;

const esc = escHtml;

function htmlHoja(h: HojaReclamacion, codigo: string, fecha: string): string {
  const fila = (k: string, v: string) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : '';
  const proveedor = [PROVEEDOR.nombreComercial, PROVEEDOR.titular, PROVEEDOR.ruc && `RUC ${PROVEEDOR.ruc}`, PROVEEDOR.domicilio]
    .filter(Boolean)
    .join(' · ');
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:640px">
<h2 style="margin:0 0 4px">Hoja de reclamación ${esc(codigo)}</h2>
<p style="margin:0 0 16px;color:#555">${esc(fecha)} · ${esc(proveedor)}</p>
<table style="border-collapse:collapse">
${fila('Tipo', h.tipo === 'reclamo' ? 'Reclamo' : 'Queja')}
${fila('Consumidor', h.nombre)}
${fila('Documento', `${h.tipoDocumento} ${h.numeroDocumento}`)}
${fila('Domicilio', h.domicilio)}
${fila('Teléfono', h.telefono)}
${fila('Correo', h.email)}
${h.menorDeEdad ? fila('Padre, madre o apoderado', `${h.apoderadoNombre} (${h.apoderadoDocumento})`) : ''}
${fila(h.bienTipo === 'producto' ? 'Producto' : 'Servicio', h.bienDescripcion)}
${fila('Monto reclamado', h.montoReclamado ? `S/ ${h.montoReclamado}` : '')}
${fila('Detalle', h.detalle)}
${fila('Pedido', h.pedido)}
</table>
<p style="margin:16px 0 0;color:#555;font-size:12px">${esc(DEFINICIONES[h.tipo])} Responderemos en un plazo máximo de ${PLAZO_RESPUESTA} días hábiles. La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
</div>`;
}

/** Copia de la hoja al consumidor, con copia oculta al buzón de MedGO. */
function enviarCopia(h: HojaReclamacion, codigo: string, fecha: string): Promise<boolean> {
  return enviarCorreo({
    to: h.email,
    bcc: CORREO,
    subject: `Libro de Reclamaciones de MedGO · ${codigo}`,
    html: htmlHoja(h, codigo, fecha),
  });
}

export async function POST(req: Request) {
  let body: Partial<HojaReclamacion> & { web?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }
  // Campo trampa: invisible para personas, lo rellenan los bots.
  if (body.web) return NextResponse.json({ error: 'No se pudo registrar.' }, { status: 400 });

  const h: HojaReclamacion = {
    tipo: body.tipo === 'queja' ? 'queja' : body.tipo === 'reclamo' ? 'reclamo' : (body.tipo as never),
    nombre: String(body.nombre ?? '').trim(),
    tipoDocumento: body.tipoDocumento as HojaReclamacion['tipoDocumento'],
    numeroDocumento: String(body.numeroDocumento ?? '').trim(),
    domicilio: String(body.domicilio ?? '').trim(),
    telefono: String(body.telefono ?? '').trim(),
    email: String(body.email ?? '').trim().toLowerCase(),
    menorDeEdad: body.menorDeEdad === true,
    apoderadoNombre: String(body.apoderadoNombre ?? '').trim(),
    apoderadoDocumento: String(body.apoderadoDocumento ?? '').trim(),
    bienTipo: body.bienTipo as HojaReclamacion['bienTipo'],
    bienDescripcion: String(body.bienDescripcion ?? '').trim(),
    montoReclamado: String(body.montoReclamado ?? '').trim().replace(',', '.'),
    detalle: String(body.detalle ?? '').trim(),
    pedido: String(body.pedido ?? '').trim(),
  };
  const problema = validarHoja(h);
  if (problema) return NextResponse.json({ error: problema }, { status: 400 });

  const admin = createAdminClient();
  const tabla = admin.from('libro_reclamaciones') as unknown as {
    select: (c: string, o: { count: 'exact'; head: true }) => {
      eq: (c: string, v: string) => { gte: (c: string, v: string) => Promise<{ count: number | null }> };
    };
    insert: (row: Record<string, unknown>) => {
      select: (c: string) => { single: () => Promise<{ data: { id: string; codigo: string; created_at: string } | null; error: unknown }> };
    };
    update: (row: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
  };

  const { count } = await tabla
    .select('id', { count: 'exact', head: true })
    .eq('email', h.email)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if ((count ?? 0) >= MAX_POR_HORA) {
    return NextResponse.json({ error: `Ya registraste varias hojas en la última hora. Si es urgente, escribe a ${CORREO}.` }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await tabla
    .insert({
      user_id: user?.id ?? null,
      tipo: h.tipo,
      nombre: h.nombre,
      tipo_documento: h.tipoDocumento,
      numero_documento: h.numeroDocumento,
      domicilio: h.domicilio,
      telefono: h.telefono || null,
      email: h.email,
      menor_de_edad: h.menorDeEdad,
      apoderado_nombre: h.menorDeEdad ? h.apoderadoNombre : null,
      apoderado_documento: h.menorDeEdad ? h.apoderadoDocumento : null,
      bien_tipo: h.bienTipo,
      bien_descripcion: h.bienDescripcion,
      monto_reclamado: h.montoReclamado ? Number(h.montoReclamado) : null,
      detalle: h.detalle,
      pedido: h.pedido,
    })
    .select('id, codigo, created_at')
    .single();
  if (error || !data) {
    console.error('[libro-reclamaciones] insert', error);
    return NextResponse.json({ error: `No se pudo registrar. Escríbenos a ${CORREO}.` }, { status: 500 });
  }

  const fecha = new Date(data.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'long', timeStyle: 'short' });
  const copiaEnviada = await enviarCopia(h, data.codigo, fecha);
  if (copiaEnviada) await tabla.update({ copia_enviada: true }).eq('id', data.id);

  const respuesta: HojaRegistrada = { codigo: data.codigo, fecha, copiaEnviada };
  return NextResponse.json(respuesta);
}
