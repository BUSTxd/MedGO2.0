/**
 * Hoja del Libro de Reclamaciones: los campos que pide la norma (D.S.
 * 011-2011-PCM, modificado por el D.S. 101-2022-PCM), compartidos por el
 * formulario y la API para que validen lo mismo.
 */

export const TIPOS_DOCUMENTO = ['DNI', 'CE', 'Pasaporte', 'RUC'] as const;
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export interface HojaReclamacion {
  tipo: 'reclamo' | 'queja';
  nombre: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  domicilio: string;
  telefono: string;
  email: string;
  menorDeEdad: boolean;
  apoderadoNombre: string;
  apoderadoDocumento: string;
  bienTipo: 'producto' | 'servicio';
  bienDescripcion: string;
  /** Texto tal cual lo escribe el consumidor («29.90»); vacío si no reclama un monto. */
  montoReclamado: string;
  detalle: string;
  pedido: string;
}

/** Lo que devuelve la API al registrar la hoja. */
export interface HojaRegistrada {
  codigo: string;
  fecha: string;
  copiaEnviada: boolean;
  /** Domicilio del proveedor: solo viaja aquí, con la hoja ya registrada. */
  domicilio: string | null;
}

export const DEFINICIONES = {
  reclamo: 'Disconformidad relacionada con el producto o servicio contratado.',
  queja: 'Disconformidad no relacionada con el producto o servicio, o malestar respecto a la atención al público.',
} as const;

/** Días hábiles que tiene el proveedor para responder. */
export const PLAZO_RESPUESTA = 15;

const LIMITES: Partial<Record<keyof HojaReclamacion, number>> = {
  nombre: 160,
  numeroDocumento: 20,
  domicilio: 240,
  telefono: 30,
  email: 160,
  apoderadoNombre: 160,
  apoderadoDocumento: 20,
  bienDescripcion: 300,
  montoReclamado: 20,
  detalle: 3000,
  pedido: 1500,
};

/** Devuelve el primer problema de la hoja, o `null` si se puede registrar. */
export function validarHoja(h: HojaReclamacion): string | null {
  if (h.tipo !== 'reclamo' && h.tipo !== 'queja') return 'Elige si es un reclamo o una queja.';
  if (!TIPOS_DOCUMENTO.includes(h.tipoDocumento)) return 'Elige el tipo de documento.';
  if (h.bienTipo !== 'producto' && h.bienTipo !== 'servicio') return 'Elige si es un producto o un servicio.';
  const obligatorios: [keyof HojaReclamacion, string][] = [
    ['nombre', 'tu nombre completo'],
    ['numeroDocumento', 'tu número de documento'],
    ['domicilio', 'tu domicilio'],
    ['email', 'tu correo'],
    ['bienDescripcion', 'qué contrataste'],
    ['detalle', 'el detalle'],
    ['pedido', 'tu pedido'],
  ];
  for (const [k, nombre] of obligatorios) {
    if (!String(h[k] ?? '').trim()) return `Falta ${nombre}.`;
  }
  if (h.menorDeEdad && (!h.apoderadoNombre.trim() || !h.apoderadoDocumento.trim())) {
    return 'Si eres menor de edad, completa los datos de tu padre, madre o apoderado.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(h.email.trim())) return 'El correo no es válido.';
  if (h.montoReclamado.trim() && !/^\d+([.,]\d{1,2})?$/.test(h.montoReclamado.trim())) {
    return 'El monto debe ser un número, por ejemplo 29.90.';
  }
  for (const [k, max] of Object.entries(LIMITES) as [keyof HojaReclamacion, number][]) {
    if (String(h[k] ?? '').length > max) return 'Uno de los campos es demasiado largo.';
  }
  return null;
}
